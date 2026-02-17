/**
 * Site-wide script: footer year, nav active state.
 */

const ACTIVE_CLASS = 'nav-link--active';
const INDEX_HREF = 'index.html';

function getCurrentPath(): string {
  const path = window.location.pathname.replace(/^\//, '');
  return path || INDEX_HREF;
}

function setFooterYear(): void {
  const el = document.getElementById('year');
  if (el) {
    el.textContent = String(new Date().getFullYear());
  }
}

function setActiveNavLink(): void {
  const currentPath = getCurrentPath();
  const links = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  links.forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    const isActive =
      href === currentPath || (currentPath === '' && href === INDEX_HREF);
    link.classList.toggle(ACTIVE_CLASS, isActive);
  });
}

function init(): void {
  setFooterYear();
  setActiveNavLink();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
