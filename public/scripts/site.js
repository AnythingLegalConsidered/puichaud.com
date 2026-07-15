(function () {
  var links = document.querySelectorAll('.site-header nav a[href*="#"]');

  if (links.length && 'IntersectionObserver' in window) {
    var linksBySection = {};

    links.forEach(function (link) {
      linksBySection[new URL(link.href).hash.slice(1)] = link;
    });

    var sections = Object.keys(linksBySection)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        links.forEach(function (link) {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        });

        var activeLink = linksBySection[entry.target.id];
        if (activeLink) {
          activeLink.classList.add('active');
          activeLink.setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  var menuButton = document.querySelector('.nav-toggle');
  var navigation = document.getElementById('primary-nav');

  if (!menuButton || !navigation) return;

  function closeMenu() {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Ouvrir le menu');
  }

  function openMenu() {
    navigation.classList.add('open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Fermer le menu');
  }

  menuButton.addEventListener('click', function () {
    navigation.classList.contains('open') ? closeMenu() : openMenu();
  });

  navigation.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });
})();
