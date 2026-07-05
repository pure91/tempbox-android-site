const currentPath = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.site-nav a').forEach((link) => {
  const linkPath = link.getAttribute('href');

  if (linkPath === currentPath) {
    link.setAttribute('aria-current', 'page');
  }
});

document.querySelectorAll('[data-current-year]').forEach((target) => {
  target.textContent = String(new Date().getFullYear());
});
