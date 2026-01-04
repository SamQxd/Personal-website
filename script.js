let currentLang = 'eng';

const tabButtons = document.querySelectorAll('.tab-button');
const langBtns = document.querySelectorAll('.lang-btn');
const langBlocks = document.querySelectorAll('.lang-content');
const navbars = document.querySelectorAll('.top-nav');

let mapENG = null;
let mapSK = null;

// ---------------- TAB PREPÍNANIE ----------------
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.tab-content')
      .forEach(tab => tab.classList.remove('active'));

    const tabName = btn.dataset.tab;
    const target = document.getElementById(`${tabName}-${currentLang}`);
    if (target) target.classList.add('active');

    fixMap();
  });
});

// ---------------- JAZYK PREPÍNANIE ----------------
langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;

    langBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    langBlocks.forEach(block => block.classList.remove('active'));
    document.querySelector(`.lang-${currentLang}`).classList.add('active');

    navbars.forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.nav-${currentLang}`).classList.add('active');

    const activeTab = document.querySelector('.tab-button.active').dataset.tab;
    document.getElementById(`${activeTab}-${currentLang}`).classList.add('active');

    fixMap();
  });
});

// ---------------- MAPY (LEAFLET) ----------------
document.addEventListener("DOMContentLoaded", () => {

  const visitedPlaces = [
    { name: "Slovakia", coords: [48.7, 19.7] },
    { name: "Czech Republic", coords: [49.8, 15.4] },
     // nové krajiny
    { name: "Poland", coords: [52.1, 19.4] },
    { name: "Hungary", coords: [47.1, 19.5] },
    { name: "Austria", coords: [47.6, 14.1] },
    { name: "Serbia", coords: [44.0, 20.9] },
    { name: "Romania", coords: [45.9, 24.9] },
    { name: "Bulgaria", coords: [42.7, 25.5] },
    { name: "Greece", coords: [39.1, 23.7] },
    { name: "Italy", coords: [42.8, 12.5] },
    { name: "Belgium", coords: [50.8, 4.5] },
    { name: "Netherlands", coords: [52.1, 5.3] },
    { name: "Luxembourg", coords: [49.8, 6.1] },
    { name: "United Kingdom", coords: [54.1, -2.8] },
    { name: "Andorra", coords: [42.5, 1.5] },
    { name: "France", coords: [46.6, 2.2] },
    { name: "Spain", coords: [40.3, -3.7] },
    { name: "Latvia", coords: [56.9, 24.6] },
    { name: "Lithuania", coords: [55.2, 23.9] },
    { name: "Estonia", coords: [58.7, 25.0] },
    { name: "Japan", coords: [36.2, 138.3] }
    
  ];

  function initMap(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return null;

    const map = L.map(elementId).setView([48.7, 19.7], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 10,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    // DEFAULT MARKER
    visitedPlaces.forEach(place => {
      L.marker(place.coords)
        .addTo(map)
        .bindPopup(`<b>${place.name}</b>`);
    });

    return map;
  }

  mapENG = initMap("travel-map-eng");
  mapSK  = initMap("travel-map-sk");

  setTimeout(fixMap, 300);
});

// ---------------- OPRAVA VEĽKOSTI MAPY PRI PREPÍNANÍ ----------------
function fixMap() {
  // hneď
  if (mapENG) mapENG.invalidateSize();
  if (mapSK) mapSK.invalidateSize();

  // po chvíli
  setTimeout(() => {
    if (mapENG) mapENG.invalidateSize();
    if (mapSK) mapSK.invalidateSize();
  }, 300);

  // po vykreslení layoutu
  requestAnimationFrame(() => {
    if (mapENG) mapENG.invalidateSize();
    if (mapSK) mapSK.invalidateSize();
  });
}
