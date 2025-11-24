let currentLang = 'eng';

const tabButtons = document.querySelectorAll('.tab-button');
const langBtns = document.querySelectorAll('.lang-btn');
const langBlocks = document.querySelectorAll('.lang-content');
const navbars = document.querySelectorAll('.top-nav');

// TAB PREPÍNANIE
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    const tabName = btn.dataset.tab;
    const target = document.getElementById(`${tabName}-${currentLang}`);
    if (target) target.classList.add('active');
  });
});

// JAZYK PREPÍNANIE
langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;

    // tlačidlá ENG/SK
    langBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // obsah
    langBlocks.forEach(block => block.classList.remove('active'));
    document.querySelector(`.lang-${currentLang}`).classList.add('active');

    // navbar
    navbars.forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.nav-${currentLang}`).classList.add('active');

    // zachovanie tabu
    const activeTab = document.querySelector('.tab-button.active').dataset.tab;
    document.getElementById(`${activeTab}-${currentLang}`).classList.add('active');
  });
});
