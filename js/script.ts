/**
 * Site-wide script: footer year, nav active state, sticky-header shadow,
 * scroll-reveal animations, and an image lightbox.
 */

const ACTIVE_CLASS = 'nav-link--active';
const INDEX_HREF = 'index.html';

function getCurrentPath(): string {
  const path = window.location.pathname.replace(/^\//, '');
  const file = path.split('/').pop() ?? '';
  return file || INDEX_HREF;
}

function setFooterYear(): void {
  const el = document.getElementById('year');
  if (el) {
    el.textContent = String(new Date().getFullYear());
  }
}

function setupHudClock(): void {
  const el = document.getElementById('hud-clock');
  if (!el) return;
  const tick = (): void => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    el.textContent = `NYC ${time}`;
  };
  tick();
  setInterval(tick, 1000);
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

function setupHeaderShadow(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  const onScroll = (): void => {
    header.classList.toggle('site-header--scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupScrollReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${Math.min(index * 60, 180)}ms`;
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

function setupLightbox(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    '.project-detail__img, .project-detail__poster-img'
  );
  if (images.length === 0) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<button class="lightbox__close" aria-label="Close image">&times;</button>' +
    '<img class="lightbox__img" alt="">';
  document.body.appendChild(overlay);

  const overlayImg = overlay.querySelector<HTMLImageElement>('.lightbox__img');
  const closeBtn = overlay.querySelector<HTMLButtonElement>('.lightbox__close');

  const open = (src: string, alt: string): void => {
    if (!overlayImg) return;
    overlayImg.src = src;
    overlayImg.alt = alt;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = (): void => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  images.forEach((img) => {
    img.addEventListener('click', () => open(img.currentSrc || img.src, img.alt));
  });

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
}

function init(): void {
  setFooterYear();
  setupHudClock();
  setActiveNavLink();
  setupHeaderShadow();
  setupScrollReveal();
  setupLightbox();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
