// 1. RUN IMMEDIATELY: Load language and apply translations
(async function() {
    const lang = localStorage.getItem('siteLang') || 'en';
    document.documentElement.setAttribute('lang', lang);
    
    // Watch for the navbar appearing in the DOM
    const observer = new MutationObserver((mutations, obs) => {
        const currentLangText = document.querySelector('.current-lang-text');
        if (currentLangText) {
            updateSwitcherUI(lang, currentLangText);
            obs.disconnect(); // Stop watching once found
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    try {
        const response = await fetch(`languages/${lang}.json`);
        const translations = await response.json();
        applyTranslations(translations);
    } catch (e) {
        console.error("Initial load error", e);
    }
})();

// 2. Initialize the rest of the dropdown listeners
document.addEventListener('DOMContentLoaded', initLanguageSwitcher);

async function initLanguageSwitcher() {
  const switcher = document.querySelector('.custom-lang-switcher');
  const currentLangText = document.querySelector('.current-lang-text');
  const langOptions = document.querySelectorAll('.lang-dropdown li');
  
  if (!switcher || !currentLangText) return;

  switcher.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    switcher.classList.remove('open');
  });

  langOptions.forEach(option => {
    option.addEventListener('click', async (e) => {
      e.stopPropagation();
      const selectedLang = option.getAttribute('data-lang');
      localStorage.setItem('siteLang', selectedLang);
      updateSwitcherUI(selectedLang, currentLangText);
      switcher.classList.remove('open');
      
      document.body.style.opacity = '0.5';
      await loadLanguage(selectedLang);
      document.documentElement.setAttribute('lang', selectedLang);
      setTimeout(() => { document.body.style.opacity = '1'; }, 200);
    });
  });
}

function updateSwitcherUI(lang, textElement) {
  const map = { 'en': 'EN', 'ka': 'GE', 'ru': 'RU' };
  textElement.textContent = map[lang] || 'EN';
}

async function loadLanguage(lang) {
  try {
    const response = await fetch(`languages/${lang}.json`);
    if (!response.ok) throw new Error('Translation not found');
    const translations = await response.json();
    applyTranslations(translations);
  } catch (error) {
    console.error('Error loading language:', error);
  }
}

function applyTranslations(translations) {
  const elements = document.querySelectorAll('[data-i18n], [data-i18n-placeholder]');
  elements.forEach(el => {
    if (el.hasAttribute('data-i18n')) {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) el.textContent = translations[key];
    }
    if (el.hasAttribute('data-i18n-placeholder')) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) el.setAttribute('placeholder', translations[key]);
    }
  });
}

// Global function to be called by the navbar onclick
window.changeLanguage = async function(lang) {
    localStorage.setItem('siteLang', lang);
    const textElement = document.querySelector('.current-lang-text');
    if (textElement) updateSwitcherUI(lang, textElement);
    
    document.body.style.opacity = '0.5';
    await loadLanguage(lang);
    document.documentElement.setAttribute('lang', lang);
    setTimeout(() => { document.body.style.opacity = '1'; }, 200);
};