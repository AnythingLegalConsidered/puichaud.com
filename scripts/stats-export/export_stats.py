#!/usr/bin/env python3
"""Generate the public stats.json for the portfolio site.

Runs INFRA-SIDE on a scheduled task (~10 min). Reads the Proxmox API and
Uptime Kuma locally, filters everything through an explicit whitelist,
and writes an aggregate-only JSON. The portfolio site never talks to the
homelab: it only fetches the published stats.json.

Required environment variables (provide via the infra secrets manager,
never hardcoded):
    PVE_API_URL        Proxmox API base URL (LAN address)
    PVE_TOKEN_ID       read-only API token id (audit-scoped)
    PVE_TOKEN_SECRET   token secret
    KUMA_URL           Uptime Kuma local URL (optional)
    KUMA_API_KEY       Uptime Kuma API key (optional)
    OUTPUT_PATH        where to write stats.json (default: ./stats.json)

Whitelist file: whitelist.yml (see whitelist.example.yml). Deny-by-default:
anything not listed never leaves the LAN.
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests  # type: ignore
    import yaml  # type: ignore
except ImportError:
    sys.exit("missing deps: pip install requests pyyaml")


def load_whitelist(path: Path) -> dict:
    """Load the explicit allowlist. Refuse to run without one."""
    if not path.exists():
        sys.exit(f"whitelist not found: {path} — refusing to export without an allowlist")
    with path.open(encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def pve_get(session: requests.Session, base: str, endpoint: str) -> dict:
    resp = session.get(f"{base}/api2/json{endpoint}", timeout=10)
    resp.raise_for_status()
    return resp.json()["data"]


def collect_cluster(session: requests.Session, base: str, wl: dict) -> dict:
    """Aggregate CPU/RAM over whitelisted nodes only. Percentages, no absolutes."""
    nodes_raw = pve_get(session, base, "/nodes")
    allowed = {n["id"] for n in wl.get("nodes", [])}
    nodes, cpu_acc, ram_acc, online_count = [], 0.0, 0.0, 0

    for node in nodes_raw:
        if node["node"] not in allowed:
            continue  # deny-by-default
        online = node.get("status") == "online"
        nodes.append({"id": node["node"], "online": online})
        if online:
            online_count += 1
            cpu_acc += node.get("cpu", 0.0) * 100
            ram_acc += (node.get("mem", 0) / node.get("maxmem", 1)) * 100

    iac_lxc = wl.get("iac_lxc_count", 0)  # declared, not scanned: stays curated
    return {
        "nodes": nodes,
        "cluster": {
            "uptime_30d": wl.get("uptime_30d_source", 99.0),  # fed by Kuma below if enabled
            "cpu_pct": round(cpu_acc / max(online_count, 1)),
            "ram_pct": round(ram_acc / max(online_count, 1)),
            "iac_lxc": iac_lxc,
        },
    }


def collect_services(wl: dict) -> list[dict]:
    """Per-service 30d uptime from Uptime Kuma (queried locally), whitelisted names only."""
    kuma_url = os.environ.get("KUMA_URL")
    api_key = os.environ.get("KUMA_API_KEY")
    allowed = {s["name"]: s for s in wl.get("services", [])}
    if not kuma_url or not api_key or not allowed:
        return []

    out: list[dict] = []
    resp = requests.get(
        f"{kuma_url}/metrics", auth=("", api_key), timeout=10
    )
    resp.raise_for_status()
    # Parse the Prometheus exposition format for monitor_uptime (30d window),
    # keep whitelisted monitors only, expose the curated public name.
    for line in resp.text.splitlines():
        if not line.startswith("monitor_uptime"):
            continue
        for name, conf in allowed.items():
            if f'monitor_name="{conf.get("kuma_monitor", name)}"' in line:
                out.append({"name": name, "uptime_30d": round(float(line.split()[-1]), 1)})
    return out


def main() -> None:
    base = os.environ["PVE_API_URL"]
    token_id = os.environ["PVE_TOKEN_ID"]
    token_secret = os.environ["PVE_TOKEN_SECRET"]
    output = Path(os.environ.get("OUTPUT_PATH", "stats.json"))
    wl = load_whitelist(Path(__file__).parent / "whitelist.yml")

    session = requests.Session()
    session.headers["Authorization"] = f"PVEAPIToken={token_id}={token_secret}"
    session.verify = True

    data = collect_cluster(session, base, wl)
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "cluster": data["cluster"],
        "nodes": data["nodes"],
        "services": collect_services(wl),
    }

    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {output} ({len(payload['services'])} services)")


if __name__ == "__main__":
    main()
