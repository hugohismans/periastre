/* ============================================================================
   OUTIL DE VÉRIFICATION — pas du code de production, pas chargé par la page.

       node outil-verif-lune.js

   Il charge `lune.js` en lui donnant un faux `window`, puis AFFIRME. Chaque
   ligne porte une valeur attendue, une valeur mesurée, l'écart et un verdict.
   Le code de sortie est non nul dès qu'une affirmation tombe.

   Ce qui est éprouvé :

     1. les sept diamètres apparents, recalculés ICI depuis les rayons sourcés,
        sans passer par le module — le module doit retomber dessus ;
     2. le nombre de Lunes de large, et le piège des aires ;
     3. le rayon de Schwarzschild lunaire, 0,109 mm, calculé depuis GM et non
        depuis la masse — GM est mesuré, la masse est dérivée ;
     4. LE POINT CENTRAL : à 384 400 km, la force est la même que la masse soit
        une boule de 3 475 km ou un point de 0,109 mm. Ce n'est pas cité, c'est
        INTÉGRÉ : la boule est découpée en anneaux et sommée par quadrature de
        Gauss–Legendre. Avec une contre-épreuve — un barreau de même masse, qui
        lui doit s'écarter — pour prouver que l'intégrateur sait voir la
        différence quand il y en a une ;
     5. le coefficient de marée, identique aussi, et confronté au 1,73 × 10⁻¹³ s⁻²
        déjà publié dans `SOURCES.md` ;
     6. la taille apparente du trou noir de masse lunaire, et son rapport à
        l'anneau de Sgr A* ;
     7. la marge des éclipses totales, ces trois pour cent qu'on perdrait.

   Et une section CONSTAT, non fatale, qui confronte le module au tableau
   d'`IDEES.md`. Le carnet emploie 2·arctan(R/d) là où la silhouette d'une
   sphère demande 2·arcsin(R/d). Trois lignes en sortent fausses, dont une
   gravement. Le module est juste, le carnet ne l'est pas : l'outil sort donc
   à zéro tout en le disant fort.
   ============================================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

// --- chargement de lune.js sans navigateur ---------------------------------
const src = fs.readFileSync(path.join(__dirname, "lune.js"), "utf8");
const faux = {};
new Function("window", src)(faux);
const L = faux.LUNE;

if(!L) { console.error("lune.js n'a rien posé sur window."); process.exit(2); }

// --- affirmation ------------------------------------------------------------
let echecs = 0, total = 0;

function fr(x, dec){
  if(x === null || x === undefined) return "—";
  if(!isFinite(x)) return "—";
  if(x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3))
    return x.toExponential(dec === undefined ? 4 : dec).replace(".", ",");
  return x.toFixed(dec === undefined ? 4 : dec).replace(".", ",");
}

/** Affirme que `mesure` vaut `attendu` à `tol` près en RELATIF. */
function affirme(quoi, attendu, mesure, tol, unite){
  total++;
  const ecart = attendu === 0 ? Math.abs(mesure) : Math.abs(mesure/attendu - 1);
  const ok = isFinite(ecart) && ecart <= tol;
  if(!ok) echecs++;
  console.log(
    "  " + (ok ? "✅" : "❌") + " " + quoi.padEnd(46) +
    " attendu " + String(fr(attendu)).padStart(13) +
    "   mesuré " + String(fr(mesure)).padStart(13) +
    "   écart " + (isFinite(ecart) ? ecart.toExponential(1).replace(".", ",") : "—").padStart(9) +
    (unite ? "  " + unite : ""));
  return ok;
}

/** Affirme un fait booléen. */
function affirmeQue(quoi, condition, detail){
  total++;
  if(!condition) echecs++;
  console.log("  " + (condition ? "✅" : "❌") + " " + quoi + (detail ? "   — " + detail : ""));
  return condition;
}

function titre(t){ console.log("\n" + t + "\n" + "─".repeat(t.length)); }

/* ============================================================ LES CONSTANTES

   Recopiées ici depuis les sources, à la main, pour que l'outil ne se contente
   pas de relire les chiffres du module. Si l'un des deux dérive, ça se voit. */

const G = 6.67430e-11;                 // CODATA 2018
const C = 299792458;                   // exact
const D = 384400;                      // km — JPL, demi-grand axe lunaire
const UA = 1.495978707e8;              // km — UAI 2012 B2

const GM_LUNE = 4.902800e12;           // m³/s² — JPL DE440 (4 902,800 km³/s²)
const R_LUNE  = 1737.4;                // km   — JPL, rayon moyen

// rayons moyens, en km — JPL / Archinal et al. 2018
const RAYONS = {
  lune: R_LUNE, mars: 3389.50, terre: 6371.0084,
  neptune: 24622, saturne: 58232, jupiter: 69911,
  soleil: 695700,                      // UAI 2015 B3, valeur nominale exacte
};

const SGRA_UAS = 51.8;                 // EHT 2022, diamètre de l'anneau

console.log("VÉRIFICATION — « Depuis la Terre, remplacer la Lune »");
console.log("distance de référence : " + D.toLocaleString("fr-FR") + " km\n");

/* ================================================ 1. LES DIAMÈTRES APPARENTS

   La silhouette d'une sphère est bornée par les tangentes issues de l'œil :
   sin α = R/d. Donc 2·arcsin(R/d), et non 2·arctan(R/d) qui serait l'angle d'un
   disque plat vu de face. */

titre("1. Diamètres apparents — recalculés ici, comparés au module");

const asin = (R, d) => R >= d ? NaN : 2*Math.asin(R/d) * 180/Math.PI;
const atan = (R, d) => 2*Math.atan(R/d) * 180/Math.PI;

const THETA_LUNE = asin(R_LUNE, D);
const tab = {};
for(const t of L.tableau()) tab[t.cle] = t;

for(const [cle, R] of Object.entries(RAYONS)){
  const t = tab[cle];
  affirme("rayon moyen conservé — " + cle, R, t.rayon_km, 1e-12, "km");
}

for(const [cle, R] of Object.entries(RAYONS)){
  const t = tab[cle];
  if(R >= D){
    affirmeQue("θ(" + cle + ") n'existe pas : R ≥ d, on est dedans",
               !isFinite(t.deg) && t.dedans,
               "R/d = " + fr(R/D, 3));
  } else {
    affirme("θ(" + cle + ")", asin(R, D), t.deg, 1e-12, "°");
  }
}

titre("1 bis. Les sept valeurs, telles qu'elles s'affichent");
console.log("| astre | θ = 2·arcsin(R/d) | en Lunes de large | en Lunes de surface |");
console.log("|---|---:|---:|---:|");
for(const cle of ["lune","mars","terre","neptune","saturne","jupiter","soleil"]){
  const t = tab[cle];
  if(!isFinite(t.deg)){ console.log("| " + t.nom + " | — (on est dedans) | — | — |"); continue; }
  console.log("| " + t.nom + " | " + fr(t.deg, 4) + "° | " +
              fr(t.lunes, 3) + " | " + fr(t.lunes*t.lunes, 0) + " |");
}

/* ==================================================== 2. LE NOMBRE DE LUNES */

titre("2. En Lunes — rapport de diamètres, jamais d'aires");

affirme("θ de la Lune (l'étalon)", THETA_LUNE, L.THETA_LUNE, 1e-12, "°");
for(const cle of ["mars","terre","neptune","saturne","jupiter"]){
  affirme("Lunes de large — " + cle, asin(RAYONS[cle], D)/THETA_LUNE, tab[cle].lunes, 1e-12);
}
affirmeQue("Jupiter : 40 Lunes de large, mais 1 637 de surface",
           Math.round(tab.jupiter.lunes) === 40 &&
           Math.round(tab.jupiter.lunes**2) === 1637,
           fr(tab.jupiter.lunes, 2) + " → " + fr(tab.jupiter.lunes**2, 0));

/* ============================================ 3. LE RAYON DE SCHWARZSCHILD

   r_s = 2GM/c². Aucun G là-dedans : GM est mesuré à 2 × 10⁻⁷ près par les
   éphémérides, tandis que G n'est connu qu'à 2,2 × 10⁻⁵. Passer par la masse
   dégraderait le résultat de deux ordres de grandeur pour rien. */

titre("3. Le trou noir de la masse de la Lune");

const RS = 2*GM_LUNE/(C*C);                       // mètres
affirme("r_s lunaire", 1.0910e-4, RS, 1e-4, "m");
affirme("r_s lunaire — module", RS, L.rayonSchwarzschild(GM_LUNE), 1e-15, "m");
affirmeQue("r_s s'écrit 0,109 mm",
           (RS*1000).toFixed(3) === "0.109", fr(RS*1000, 5) + " mm");
affirmeQue("plus petit qu'un grain de sable (0,1 à 2 mm)",
           RS*1000 < 0.2, fr(RS*1000, 3) + " mm");

const M_LUNE = GM_LUNE / G;
affirme("masse lunaire dérivée de GM", 7.346e22, M_LUNE, 1e-3, "kg");
affirmeQue("le carnet écrit 7,3 × 10²² kg — compatible",
           Math.abs(M_LUNE/7.3e22 - 1) < 0.01, fr(M_LUNE, 4) + " kg");
affirmeQue("le carnet écrit un diamètre de 3 474 km — c'est 3 474,8",
           Math.abs(2*R_LUNE - 3474.8) < 0.05, fr(2*R_LUNE, 1) + " km");

const TH_TROU = asin(RS/1000, D);
affirme("θ du trou noir", 3.252386e-11, TH_TROU, 1e-6, "°");
affirme("θ du trou noir, en μas", 0.1170859, TH_TROU*3.6e9, 1e-6, "μas");
affirme("θ du trou noir — module", TH_TROU, tab.trounoir.deg, 1e-12, "°");
affirme("grossissement pour égaler la Lune", 1.592460e10, THETA_LUNE/TH_TROU, 1e-6);
affirme("l'anneau de Sgr A* est plus large de", 442.410, SGRA_UAS/(TH_TROU*3.6e9), 1e-6, "fois");
affirmeQue("il reste sous le pixel dans tout le champ nominal du module",
           TH_TROU * (960/L.CHAMP_MIN) < 1e-8,
           fr(TH_TROU*(960/L.CHAMP_MIN), 2) + " px sur 960 px de large");

/* ==================================================== 4. BOULE OU POINT ?

   Le cœur de la page. On n'invoque pas le théorème des coquilles : on intègre.

   Une boule de rayon R, de masse M, centrée à la distance d. On la découpe en
   anneaux : élément de masse dm = ρ·2π a² sin θ dθ da, à la distance
   s = √(d² + a² − 2ad cos θ) du point de mesure. La composante axiale de
   l'attraction vaut G·dm·(d − a cos θ)/s³. On somme par quadrature de
   Gauss–Legendre à 96 nœuds sur chaque variable, et l'on compare à GM/d².

   Trois cas : boule homogène, boule stratifiée (densité décroissante), et un
   BARREAU de même masse — celui-là DOIT s'écarter, sinon l'intégrateur ne
   prouve rien. */

titre("4. À 384 400 km, la boule et le point attirent-ils pareil ?");

function gaussLegendre(n){
  const x = new Array(n), w = new Array(n);
  for(let i = 0; i < n; i++){
    let z = Math.cos(Math.PI*(i + 0.75)/(n + 0.5)), pp = 0;
    for(let it = 0; it < 200; it++){
      let p0 = 1, p1 = 0;
      for(let j = 0; j < n; j++){ const p2 = p1; p1 = p0; p0 = ((2*j + 1)*z*p1 - j*p2)/(j + 1); }
      pp = n*(z*p0 - p1)/(z*z - 1);
      const dz = p0/pp;
      z -= dz;
      if(Math.abs(dz) < 1e-16) break;
    }
    x[i] = z; w[i] = 2/((1 - z*z)*pp*pp);
  }
  return { x, w };
}
const GL = gaussLegendre(96);

/** Somme axiale sur une boule à symétrie sphérique, de profil de densité
 *  `profil(u)` avec u = a/R (à une constante multiplicative près : la masse est
 *  renormalisée). Renvoie l'accélération en m/s² au point situé à d_m du centre. */
function bouleIntegree(R_m, d_m, profil){
  // normalisation : ∫₀^R profil(a/R)·4π a² da = M  ⇒  on calcule les deux
  // intégrales avec la même quadrature et on divise.
  let norme = 0, somme = 0;
  const ha = R_m/2, ca = R_m/2;
  for(let i = 0; i < GL.x.length; i++){
    const a = ca + ha*GL.x[i], wa = ha*GL.w[i];
    const rho = profil(a/R_m);
    norme += wa * rho * 4*Math.PI * a*a;

    // ∫₀^π sinθ (d − a cosθ)/s³ dθ , avec le changement u = cosθ sur [−1, 1]
    let anneaux = 0;
    for(let j = 0; j < GL.x.length; j++){
      const u = GL.x[j], wu = GL.w[j];
      const s = Math.sqrt(d_m*d_m + a*a - 2*a*d_m*u);
      anneaux += wu * (d_m - a*u) / (s*s*s);
    }
    somme += wa * rho * 2*Math.PI * a*a * anneaux;
  }
  return { somme, norme };
}

const R_LUNE_M = R_LUNE*1000, D_M = D*1000;
const g_point = GM_LUNE/(D_M*D_M);

for(const [nom, profil] of [
  ["boule homogène",                u => 1],
  ["boule stratifiée ρ ∝ 1 − 0,6u²", u => 1 - 0.6*u*u],
  ["boule très piquée ρ ∝ e^(−4u)",  u => Math.exp(-4*u)],
]){
  const r = bouleIntegree(R_LUNE_M, D_M, profil);
  const g_boule = G * (GM_LUNE/G) / r.norme * r.somme;   // renormalisé à la masse lunaire
  affirme(nom + " vs point", g_point, g_boule, 1e-12, "m/s²");
}

// La contre-épreuve. Un barreau homogène de longueur 2R sur l'axe donne
// GM/(d² − R²), donc 2,04 × 10⁻⁵ de plus. Si l'intégrateur ne voyait pas ÇA,
// l'accord à 10⁻¹² ci-dessus ne vaudrait rien.
{
  let s = 0;
  const h = R_LUNE_M, c = 0;                              // sur [−R, R]
  for(let i = 0; i < GL.x.length; i++){
    const z = c + h*GL.x[i], w = h*GL.w[i];
    s += w * 1/((D_M - z)*(D_M - z));
  }
  const g_barreau = G * (GM_LUNE/G) / (2*R_LUNE_M) * s;
  const attendu = GM_LUNE/(D_M*D_M - R_LUNE_M*R_LUNE_M);
  affirme("contre-épreuve : barreau de même masse", attendu, g_barreau, 1e-12, "m/s²");
  affirmeQue("…et il S'ÉCARTE du point, donc le test a des dents",
             Math.abs(g_barreau/g_point - 1) > 1e-5,
             "écart " + (g_barreau/g_point - 1).toExponential(2).replace(".", ","));
}

affirmeQue("conclusion : remplacer la Lune par un point de 0,109 mm ne change " +
           "RIEN à l'attraction", true,
           "accord à mieux que 10⁻¹², quel que soit le profil de densité");

/* ================================================== 5. LES MARÉES */

titre("5. Les marées ne bougent pas non plus");

const maree = 2*GM_LUNE/(D_M*D_M*D_M);
affirme("coefficient de marée 2GM/d³", 1.7263e-13, maree, 1e-4, "s⁻²");
affirmeQue("cohérent avec le 1,73 × 10⁻¹³ s⁻² déjà publié dans SOURCES.md §6.3",
           Math.abs(maree/1.73e-13 - 1) < 0.005, fr(maree, 4) + " s⁻²");
affirme("coefficient de marée — module", maree, L.coefficientMaree(GM_LUNE, D_M), 1e-15, "s⁻²");
affirme("accélération lunaire à la Terre", 3.3180e-5, L.acceleration(GM_LUNE, D_M), 1e-4, "m/s²");

// Le gradient s'obtient aussi par différence sur l'intégrale de la boule : même
// chiffre, donc même marée pour la boule et pour le point.
{
  const eps = 1e5;                                        // 100 km
  const gg = (dd) => {
    const r = bouleIntegree(R_LUNE_M, dd, u => 1);
    return G*(GM_LUNE/G)/r.norme*r.somme;
  };
  // g(d) = GM/d² pour un point, donc −dg/dd = 2GM/d³, qui EST le coefficient
  // de marée. On dérive ici l'intégrale de la BOULE : si elle rend le même
  // gradient, la boule et le point marèent pareil, et pas seulement attirent
  // pareil. C'est ce qui répond vraiment à « les marées ne changeraient pas ».
  const grad = -(gg(D_M + eps) - gg(D_M - eps))/(2*eps);
  affirme("marée de la BOULE, par différentiation numérique", maree, grad, 1e-6, "s⁻²");
}

/* ============================================ 6. CE QU'ON PERD VRAIMENT */

titre("6. Ce qu'on perd : le disque, le clair de lune, les éclipses");

const b = L.bilan();
const thSoleilDepuisTerre = asin(695700, UA);
affirme("θ du Soleil vu de la Terre", 0.532906, thSoleilDepuisTerre, 1e-5, "°");
affirme("θ du Soleil vu de la Terre — module", thSoleilDepuisTerre,
        b.eclipse.soleilDepuisTerre, 1e-12, "°");
affirme("rapport Soleil / Lune dans le ciel terrestre", 1.02893, b.eclipse.rapport, 1e-4);
affirmeQue("les éclipses totales tiennent à 2,9 % — c'est ça qu'on perd",
           b.eclipse.rapport > 1 && b.eclipse.rapport < 1.05,
           "rapport " + fr(b.eclipse.rapport, 5));
affirmeQue("le disque tombe de 0,518° à 3,3 × 10⁻¹¹° : un facteur 1,6 × 10¹⁰",
           Math.abs((b.perdu[0].avant/b.perdu[0].apres)/1.5926e10 - 1) < 1e-3,
           "facteur " + fr(b.perdu[0].avant/b.perdu[0].apres, 4));

/* ===================================== 7. LA MISE EN VUE NE MENT PAS */

titre("7. Le rendu ne peut pas tricher");

affirmeQue("le champ minimal du module tient les 0,518° de la Lune",
           L.CHAMP_MIN > L.THETA_LUNE * 10,
           L.CHAMP_MIN + "° pour " + fr(L.THETA_LUNE, 3) + "°");
affirmeQue("le champ maximal ne prétend pas montrer plus que l'hémisphère",
           L.CHAMP_MAX <= 180, L.CHAMP_MAX + "°");
{
  // à quel grossissement le trou noir atteint-il un demi-pixel sur 960 px ?
  const pxdeg0 = 960/L.CHAMP_MIN;
  const g1px = Math.log10(0.5/(TH_TROU*pxdeg0));
  const gLune = Math.log10(THETA_LUNE/TH_TROU);
  affirme("premier demi-pixel à ×10^g, g =", 8.3506, g1px, 1e-4);
  affirme("taille de la Lune à ×10^g, g =", 10.2021, gLune, 1e-4);
  affirmeQue("le grossissement offert par le module va assez loin",
             L.GROSSISSEMENT_MAX >= gLune, "max ×10^" + L.GROSSISSEMENT_MAX);
}
affirmeQue("aucune entrée de ASTRES n'a de rayon écrit à la main pour le trou noir",
           faux.LUNE.ASTRES.find(a => a.cle === "trounoir").rayon_km === undefined,
           "il est déduit de GM par 2GM/c²");
affirmeQue("chaque astre porte une clé de source valide",
           L.ASTRES.every(a => L.SOURCES[a.source] && L.SOURCES[a.masseSource]),
           L.ASTRES.length + " astres, " + Object.keys(L.SOURCES).length + " sources");
affirmeQue("le module ne pose qu'un seul global, et ce n'est pas un nom déjà pris",
           Object.keys(faux).length === 1 && Object.keys(faux)[0] === "LUNE",
           "window." + Object.keys(faux).join(", window."));

/* ===================================================== CONSTAT — le carnet

   Non fatal. Le module est juste ; c'est `IDEES.md` qui ne l'est pas. */

titre("CONSTAT — confrontation au tableau d'IDEES.md (non fatal)");

const CARNET = {
  lune:    { deg: 0.52,  lunes: 1   },
  mars:    { deg: 1.01,  lunes: 2   },
  terre:   { deg: 1.90,  lunes: 3.7 },
  neptune: { deg: 7.33,  lunes: 14  },
  saturne: { deg: 17.2,  lunes: 33  },
  jupiter: { deg: 20.6,  lunes: 40  },
  soleil:  { deg: 122,   lunes: 236 },
};

console.log("| astre | carnet | arctan (formule du carnet) | arcsin (juste) | verdict |");
console.log("|---|---:|---:|---:|---|");
let divergences = 0;
for(const [cle, c] of Object.entries(CARNET)){
  const R = RAYONS[cle];
  const at = atan(R, D), as = asin(R, D);
  let verdict;
  if(!isFinite(as)){
    verdict = "❌ **hors domaine** — R = " + fr(R/D, 2) + " d, on est DEDANS";
    divergences++;
  } else {
    // le carnet est-il retrouvé par arcsin, à sa propre précision d'écriture ?
    const dec = (String(c.deg).split(".")[1] || "").length;
    const ok = as.toFixed(dec) === c.deg.toFixed(dec);
    verdict = ok ? "✅" : ("❌ le carnet a arrondi l'arctan (" +
              ((as/at - 1)*100).toFixed(2).replace(".", ",") + " % d'écart)");
    if(!ok) divergences++;
  }
  console.log("| " + cle + " | " + String(c.deg).replace(".", ",") + "° | " +
              fr(at, 4) + "° | " + (isFinite(as) ? fr(as, 4) + "°" : "—") +
              " | " + verdict + " |");
}

console.log("");
console.log("Divergences : " + divergences + " lignes sur " + Object.keys(CARNET).length + ".");
console.log("");
console.log("  · Lune, Mars, Terre : arcsin et arctan coïncident sous deux degrés,");
console.log("    le carnet tombe juste par accident heureux.");
console.log("  · Neptune, Saturne, Jupiter : le carnet est petit de 0,2 %, 1,1 % et");
console.log("    1,7 %. Saturne passe de 33 à 34 Lunes, Jupiter reste à 40.");
console.log("  · Soleil : le rayon solaire vaut " + fr(695700/D, 2) + " fois la distance");
console.log("    Terre–Lune. arcsin n'est pas défini, la Terre serait à l'INTÉRIEUR du");
console.log("    Soleil, à " + fr(100*D/695700, 0) + " % du rayon depuis son centre. Les");
console.log("    « 122° » et les « deux tiers du ciel » sont une tangente appliquée hors");
console.log("    de son domaine. Il n'y a pas de diamètre apparent à donner.");
console.log("");

/* ========================================================================= */

titre("VERDICT");
console.log("  " + (total - echecs) + " affirmations tenues sur " + total + ".");
if(echecs){
  console.log("  ❌ " + echecs + " ÉCHEC" + (echecs > 1 ? "S" : "") + ".");
  process.exit(1);
}
console.log("  ✅ Aucun échec.");
console.log("");
console.log("  Le chiffre à retenir n'est pas un des sept : c'est le quatrième");
console.log("  paragraphe. Une boule de 3 475 km et un point de 0,109 mm de même");
console.log("  masse tirent sur la Terre avec la même force, à mieux que 10⁻¹² près,");
console.log("  quel que soit le profil de densité. On échange la Lune contre un trou");
console.log("  noir, et il ne se passe rien.");
process.exit(0);
