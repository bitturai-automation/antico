(function () {
  var links = document.querySelectorAll('.lg-toc li a');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var a = map[e.target.id]; if (a) a.classList.add('is-active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('.lg-sec').forEach(function (s) { io.observe(s); });
})();
