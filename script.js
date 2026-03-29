let currentLang = "eng";

const savedLang = localStorage.getItem("lang");
if (savedLang) currentLang = savedLang;

const tabButtons = document.querySelectorAll(".tab-button");
const langBtns   = document.querySelectorAll(".lang-btn");
const langBlocks = document.querySelectorAll(".lang-content");
const navbars    = document.querySelectorAll(".top-nav");

let globeENG = null;
let globeSK  = null;

/* ISO numerické kódy (world-atlas 110m) */
const visitedNumeric = new Set([
  703, 203, 616, 348, 40, 688, 642, 100,
  300, 380, 56, 528, 442, 826, 250, 724,
  428, 440, 233, 392
]);

const countryNames = {
  703:"Slovakia", 203:"Czech Republic", 616:"Poland", 348:"Hungary",
  40:"Austria", 688:"Serbia", 642:"Romania", 100:"Bulgaria",
  300:"Greece", 380:"Italy", 56:"Belgium", 528:"Netherlands",
  442:"Luxembourg", 826:"United Kingdom", 250:"France", 724:"Spain",
  428:"Latvia", 440:"Lithuania", 233:"Estonia", 392:"Japan"
};

/* Micro-štáty ako malé ručné polygóny */
const microFeatures = [
  { name:"Andorra",       visited:true,  c:[[1.35,42.38],[1.85,42.38],[1.85,42.68],[1.35,42.68],[1.35,42.38]] },
  { name:"Monaco",        visited:false, c:[[7.33,43.71],[7.45,43.71],[7.45,43.79],[7.33,43.79],[7.33,43.71]] },
  { name:"San Marino",    visited:false, c:[[12.35,43.85],[12.55,43.85],[12.55,44.00],[12.35,44.00],[12.35,43.85]] },
  { name:"Liechtenstein", visited:false, c:[[9.45,47.03],[9.66,47.03],[9.66,47.28],[9.45,47.28],[9.45,47.03]] },
].map(m => ({
  type:"Feature",
  properties:{ _name:m.name, _visited:m.visited },
  geometry:{ type:"Polygon", coordinates:[m.c] }
}));

/* ---------------- INIT GLÓBUS ---------------- */
function initGlobe(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return null;

  const g = Globe()
    .width(el.clientWidth || 700)
    .height(el.clientHeight || 450)
    (el);

  /* Blue Marble — svetlá, farebná Zem */
  g.globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
   .backgroundImageUrl("https://unpkg.com/three-globe/example/img/night-sky.png")
   .backgroundColor("rgba(0,0,0,0)");

  g.controls().autoRotate      = true;
  g.controls().autoRotateSpeed = 0.5;
  g.controls().enableZoom      = true;
  g.pointOfView({ lat: 48, lng: 15, altitude: 1.9 });

  /* Oprava lighting-u — neutralizuj oranžový ambient */
  setTimeout(() => {
    const canvas = el.querySelector("canvas");
    if (canvas) { canvas.style.display = "block"; canvas.style.margin = "0 auto"; }

    g.scene().traverse(obj => {
      if (obj.isLight) {
        obj.color.set("#ffffff");
        if (obj.isAmbientLight)     obj.intensity = 0.5;
        if (obj.isDirectionalLight) obj.intensity = 0.8;
      }
    });
  }, 250);

  /* 110m TopoJSON + micro-štáty */
  fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
    .then(r => r.json())
    .then(world => {
      const features = [
        ...topojson.feature(world, world.objects.countries).features,
        ...microFeatures
      ];

      g.polygonsData(features)
       .polygonCapColor(f => {
         const visited = f.properties._visited !== undefined
           ? f.properties._visited
           : visitedNumeric.has(parseInt(f.id));
         return visited ? "#e8820a" : "#2c3e50";
       })
       .polygonSideColor(() => "#000")
       .polygonStrokeColor(() => "rgba(255,255,255,0.5)")
       .polygonAltitude(0.006)
       .polygonLabel(f => {
         const name = f.properties._name || countryNames[parseInt(f.id)];
         const visited = f.properties._visited !== undefined
           ? f.properties._visited
           : visitedNumeric.has(parseInt(f.id));
         return (name && visited)
           ? `<div style="background:#111;border:1px solid #ffa03c;color:#ffa03c;font-weight:600;padding:4px 10px;border-radius:6px;">${name}</div>`
           : "";
       });
    });

  return g;
}

/* ---------------- APLIKOVANIE JAZYKA PRI NAČÍTANÍ ---------------- */
function applyLanguageOnLoad() {
  langBtns.forEach(b => b.classList.remove("active"));
  document.querySelector(`.lang-btn[data-lang="${currentLang}"]`)?.classList.add("active");
  langBlocks.forEach(b => b.classList.remove("active"));
  document.querySelector(`.lang-${currentLang}`)?.classList.add("active");
  navbars.forEach(n => n.classList.remove("active"));
  document.querySelector(`.nav-${currentLang}`)?.classList.add("active");
  const activeTab = document.querySelector(".tab-button.active")?.dataset.tab || "info";
  document.getElementById(`${activeTab}-${currentLang}`)?.classList.add("active");
}

/* ---------------- TAB PREPÍNANIE ---------------- */
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    const target = document.getElementById(`${btn.dataset.tab}-${currentLang}`);
    if (target) target.classList.add("active");
  });
});

/* ---------------- JAZYK PREPÍNANIE ---------------- */
langBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    localStorage.setItem("lang", currentLang);
    location.reload();
  });
});

/* ---------------- ACCORDION → LAZY INIT GLÓBUS ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyLanguageOnLoad();

  document.querySelectorAll(".cert-accordion").forEach(details => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      if (details.querySelector("#travel-map-eng") && !globeENG) {
        setTimeout(() => { globeENG = initGlobe("travel-map-eng"); }, 80);
      }
      if (details.querySelector("#travel-map-sk") && !globeSK) {
        setTimeout(() => { globeSK = initGlobe("travel-map-sk"); }, 80);
      }
    });
  });
});
