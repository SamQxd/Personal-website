let currentLang = "eng";

const savedLang = localStorage.getItem("lang");
if (savedLang) currentLang = savedLang;

const tabButtons = document.querySelectorAll(".tab-button");
const langBtns = document.querySelectorAll(".lang-btn");
const langBlocks = document.querySelectorAll(".lang-content");
const navbars = document.querySelectorAll(".top-nav");

let mapENG = null;
let mapSK = null;

/* ---------------- APLIKOVANIE JAZYKA PRI NAČÍTANÍ ---------------- */
function applyLanguageOnLoad() {
  langBtns.forEach(b => b.classList.remove("active"));
  document
    .querySelector(`.lang-btn[data-lang="${currentLang}"]`)
    ?.classList.add("active");

  langBlocks.forEach(block => block.classList.remove("active"));
  document.querySelector(`.lang-${currentLang}`)?.classList.add("active");

  navbars.forEach(nav => nav.classList.remove("active"));
  document.querySelector(`.nav-${currentLang}`)?.classList.add("active");

  const activeTab =
    document.querySelector(".tab-button.active")?.dataset.tab || "info";

  document
    .getElementById(`${activeTab}-${currentLang}`)
    ?.classList.add("active");
}

/* ---------------- TAB PREPÍNANIE ---------------- */
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document
      .querySelectorAll(".tab-content")
      .forEach(tab => tab.classList.remove("active"));

    const tabName = btn.dataset.tab;
    const target = document.getElementById(`${tabName}-${currentLang}`);
    if (target) target.classList.add("active");

    fixMap();
  });
});

/* ---------------- JAZYK PREPÍNANIE (RELOAD) ---------------- */
langBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    localStorage.setItem("lang", currentLang);
    location.reload();
  });
});

/* ---------------- MAPY (LEAFLET) ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyLanguageOnLoad();

  const visitedPlaces = [
    { name: "Slovakia", code: "SK", coords: [48.7, 19.7], cities: ["Bratislava", "Košice", "Prešov"] },
    { name: "Czech Republic", code: "CZ", coords: [49.8, 15.4], cities: ["Prague", "Brno", "Ostrava"] },
    { name: "Poland", code: "PL", coords: [52.1, 19.4], cities: ["Warsaw", "Kraków", "Łódź"] },
    { name: "Hungary", code: "HU", coords: [47.1, 19.5], cities: ["Budapest", "Debrecen", "Szeged"] },
    { name: "Austria", code: "AT", coords: [47.6, 14.1], cities: ["Vienna", "Graz", "Linz"] },
    { name: "Serbia", code: "RS", coords: [44.0, 20.9], cities: ["Belgrade", "Novi Sad", "Niš"] },
    { name: "Romania", code: "RO", coords: [45.9, 24.9], cities: ["Bucharest", "Cluj-Napoca", "Timișoara"] },
    { name: "Bulgaria", code: "BG", coords: [42.7, 25.5], cities: ["Sofia", "Plovdiv", "Varna"] },
    { name: "Greece", code: "GR", coords: [39.1, 23.7], cities: ["Athens", "Thessaloniki", "Patras"] },
    { name: "Italy", code: "IT", coords: [42.8, 12.5], cities: ["Rome", "Milan", "Naples"] },
    { name: "Belgium", code: "BE", coords: [50.8, 4.5], cities: ["Brussels", "Antwerp", "Ghent"] },
    { name: "Netherlands", code: "NL", coords: [52.1, 5.3], cities: ["Amsterdam", "Rotterdam", "The Hague"] },
    { name: "Luxembourg", code: "LU", coords: [49.8, 6.1], cities: ["Luxembourg City", "Esch-sur-Alzette", "Differdange"] },
    { name: "United Kingdom", code: "UK", coords: [54.1, -2.8], cities: ["London", "Birmingham", "Manchester"] },
    { name: "Andorra", code: "AD", coords: [42.5, 1.5], cities: ["Andorra la Vella", "Escaldes-Engordany"] },
    { name: "France", code: "FR", coords: [46.6, 2.2], cities: ["Paris", "Marseille", "Lyon"] },
    { name: "Spain", code: "ES", coords: [40.3, -3.7], cities: ["Madrid", "Barcelona", "Valencia"] },
    { name: "Latvia", code: "LV", coords: [56.9, 24.6], cities: ["Riga", "Daugavpils", "Liepāja"] },
    { name: "Lithuania", code: "LT", coords: [55.2, 23.9], cities: ["Vilnius", "Kaunas", "Klaipėda"] },
    { name: "Estonia", code: "EE", coords: [58.7, 25.0], cities: ["Tallinn", "Tartu", "Narva"] },
    { name: "Japan", code: "JP", coords: [36.2, 138.3], cities: ["Tokyo", "Osaka", "Yokohama"] }
  ];

  function initMap(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return null;

    const map = L.map(elementId).setView([48.7, 19.7], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 10,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    // skupina pre clustery
    const markers = L.markerClusterGroup({
      maxClusterRadius: 40   // default je ~80 — menšie číslo = menej mergovania
    });

    visitedPlaces.forEach(place => {
      const randomCity =
        place.cities[Math.floor(Math.random() * place.cities.length)];

      const randomNumber = Math.floor(Math.random() * 90) + 10;

      const popupText = `<b>${randomCity} ${place.code} — FREE#${randomNumber}</b>`;

      const marker = L.marker(place.coords).bindPopup(popupText);

      markers.addLayer(marker);
    });

    map.addLayer(markers);

    return map;
  }

  mapENG = initMap("travel-map-eng");
  mapSK  = initMap("travel-map-sk");

  setTimeout(fixMap, 300);
});

/* ---------------- OPRAVA VEĽKOSTI MAPY PRI PREPÍNANÍ ---------------- */
function fixMap() {
  if (mapENG) mapENG.invalidateSize();
  if (mapSK) mapSK.invalidateSize();

  setTimeout(() => {
    if (mapENG) mapENG.invalidateSize();
    if (mapSK) mapSK.invalidateSize();
  }, 300);

  requestAnimationFrame(() => {
    if (mapENG) mapENG.invalidateSize();
    if (mapSK) mapSK.invalidateSize();
  });
}
