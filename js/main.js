document.addEventListener('DOMContentLoaded', async () => {
  // Global Page Transition Logic
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    setTimeout(() => { overlay.classList.add('fade-out'); }, 300); // Fade out on load
  }

  // Intercept links for smooth page transitions
  document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = this.getAttribute('href');
      // Only apply transition to internal pages, not anchors or external links
      if (target && target.endsWith('.html') && !this.hasAttribute('target')) {
        e.preventDefault();
        if (overlay) overlay.classList.remove('fade-out');
        setTimeout(() => { window.location.href = target; }, 800); // Wait for fade in
      }
    });
  });

  // Load Components
  await loadComponent('navbar-placeholder', 'components/navbar.html');
  await loadComponent('footer-placeholder', 'components/footer.html');

  initNavbar();
  initMobileMenu();
  
  if (typeof initLanguageSwitcher === 'function') initLanguageSwitcher();
  if (typeof initScrollAnimations === 'function') initScrollAnimations();
  
  // Highlight active nav link
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
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
}