"use strict";
/**
 * Site-wide script: footer year, nav active state, sticky-header shadow,
 * scroll-reveal animations, and an image lightbox.
 */
const ACTIVE_CLASS = 'nav-link--active';
const INDEX_HREF = 'index.html';
function getCurrentPath() {
    const path = window.location.pathname.replace(/^\//, '');
    const file = path.split('/').pop() ?? '';
    return file || INDEX_HREF;
}
function setFooterYear() {
    const el = document.getElementById('year');
    if (el) {
        el.textContent = String(new Date().getFullYear());
    }
}
function setupHudClock() {
    const el = document.getElementById('hud-clock');
    if (!el)
        return;
    const tick = () => {
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
function setActiveNavLink() {
    const currentPath = getCurrentPath();
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        const href = link.getAttribute('href') ?? '';
        const isActive = href === currentPath || (currentPath === '' && href === INDEX_HREF);
        link.classList.toggle(ACTIVE_CLASS, isActive);
    });
}
function setupHeaderShadow() {
    const header = document.querySelector('.site-header');
    if (!header)
        return;
    const onScroll = () => {
        header.classList.toggle('site-header--scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}
function setupScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.transitionDelay = `${Math.min(index * 60, 180)}ms`;
                el.classList.add('is-visible');
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => observer.observe(el));
}
function setupLightbox() {
    const images = document.querySelectorAll('.project-detail__img, .project-detail__poster-img');
    if (images.length === 0)
        return;
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
        '<button class="lightbox__close" aria-label="Close image">&times;</button>' +
            '<img class="lightbox__img" alt="">';
    document.body.appendChild(overlay);
    const overlayImg = overlay.querySelector('.lightbox__img');
    const closeBtn = overlay.querySelector('.lightbox__close');
    const open = (src, alt) => {
        if (!overlayImg)
            return;
        overlayImg.src = src;
        overlayImg.alt = alt;
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    };
    images.forEach((img) => {
        img.addEventListener('click', () => open(img.currentSrc || img.src, img.alt));
    });
    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay)
            close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open'))
            close();
    });
}
function init() {
    setFooterYear();
    setupHudClock();
    setActiveNavLink();
    setupHeaderShadow();
    setupScrollReveal();
    setupLightbox();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
