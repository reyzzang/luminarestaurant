async function initLanguageSwitcher() {
  const switcher = document.querySelector('.custom-lang-switcher');
  const currentLangText = document.querySelector('.current-lang-text');
  const langOptions = document.querySelectorAll('.lang-dropdown li');
  
  if (!switcher || !currentLangText) return;

  const currentLang = localStorage.getItem('siteLang') || 'en';
  updateSwitcherUI(currentLang, currentLangText);
  await loadLanguage(currentLang);

  // Toggle Dropdown
  switcher.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    switcher.classList.remove('open');
  });

  // Handle language selection
  langOptions.forEach(option => {
    option.addEventListener('click', async (e) => {
      e.stopPropagation();
      const selectedLang = option.getAttribute('data-lang');
      localStorage.setItem('siteLang', selectedLang);
      updateSwitcherUI(selectedLang, currentLangText);
      switcher.classList.remove('open');
      
      // Add a subtle opacity transition to the body during text swap
      document.body.style.opacity = '0.5';
      await loadLanguage(selectedLang);
      setTimeout(() => { document.body.style.opacity = '1'; }, 200);
    });
  });
}

function updateSwitcherUI(lang, textElement) {
  const map = { 'en': 'EN', 'ka': 'GE', 'ru': 'RU' };
  textElement.textContent = map[lang];
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
    // Handle standard text
    if (el.hasAttribute('data-i18n')) {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) el.textContent = translations[key];
    }
    // Handle input placeholders
    if (el.hasAttribute('data-i18n-placeholder')) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) el.setAttribute('placeholder', translations[key]);
    }
  });
}