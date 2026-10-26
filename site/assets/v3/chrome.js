/* Shared header for pages still on site.css: the mobile menu, and the glass
   state once the page scrolls under the header. */
(function () {
  'use strict';
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function solid() { if (header) header.classList.toggle('is-solid', window.scrollY > 24); }
  window.addEventListener('scroll', solid, { passive: true });
  solid();

  if (!toggle || !menu) return;
  function setMenu(open, returnFocus) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    menu.hidden = !open;
    if (open) { var first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    else if (returnFocus) toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true); });
  document.addEventListener('click', function (e) {
    if (toggle.getAttribute('aria-expanded') === 'true' && !toggle.contains(e.target) && !menu.contains(e.target)) setMenu(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
})();
