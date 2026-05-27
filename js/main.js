document.addEventListener('DOMContentLoaded', async () => {
  // Global Page Transition Logic
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    setTimeout(() => { overlay.classList.add('fade-out'); }, 300);
  }

  // Intercept links
  document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = this.getAttribute('href');
      if (target && target.endsWith('.html') && !this.hasAttribute('target')) {
        e.preventDefault();
        if (overlay) overlay.classList.remove('fade-out');
        setTimeout(() => { window.location.href = target; }, 300); // Updated to 300ms to match CSS
      }
    });
  });

  // Load Components
  await loadComponent('navbar-placeholder', 'components/navbar.html');
  await loadComponent('footer-placeholder', 'components/footer.html');

  // Trigger Translation again after navbar loads
  if (typeof applyTranslations === 'function') {
    const lang = localStorage.getItem('siteLang') || 'en';
    fetch(`languages/${lang}.json`)
      .then(res => res.json())
      .then(data => applyTranslations(data));
  }

  initNavbar();
  initMobileMenu();
  
  if (typeof initLanguageSwitcher === 'function') initLanguageSwitcher();
  if (typeof initScrollAnimations === 'function') initScrollAnimations();
  
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath) link.classList.add('active');
  });
});

async function loadComponent(elementId, path) {
  try {
    const el = document.getElementById(elementId);
    if(!el) return;
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path}`);
    const html = await response.text();
    el.innerHTML = html;
  } catch (error) { console.error(error); }
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if(!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

function initMobileMenu() {
  // Use event delegation in case navbar was loaded dynamically
  document.addEventListener('click', (e) => {
    const hamburger = e.target.closest('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    }
  });
}