/* ============================================================================
   LE COCKPIT DE LA SONDE, ÉPROUVÉ SANS ÉCRAN

       node outil-verif-cockpit.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   Le cockpit est le seul endroit du site où l'on lit des CHIFFRES qui bougent
   pendant qu'on tombe : le temps qui s'écoule moins vite, la vitesse, la marée.
   Un chiffre faux qui bouge est pire qu'un chiffre faux immobile — on le croit,
   et on le croit d'autant plus qu'il tremble comme un vrai instrument.

   Or ces chiffres ne sont pas rangés dans une variable qu'on pourrait relire :
   ils naissent et meurent dans un appel de dessin. Sans outil, la seule façon
   de savoir que le cockpit dit 70,7 % à l'orbite stable la plus basse serait
   d'ouvrir la page et de regarder — c'est-à-dire de dépenser l'œil d'Hugo pour
   ce qu'un calcul vérifie mieux.

   ---------------------------------------------------------------------------
   IL A ÉTÉ ÉCRIT DEPUIS LE CONTRAT, PAS DEPUIS LE MODULE  (règle 3)

   `cockpit.js` était écrit en parallèle, par quelqu'un d'autre, et n'existait
   pas encore quand ces lignes ont été posées. C'est une chance, pas une gêne :
   un contrôle qui naît de l'implémentation apprend par cœur ce qu'elle fait, y
   compris ses fautes. Celui-ci ne connaît que ceci, et rien d'autre :

       global.COCKPIT = { dessine };
       dessine(ctx, W, H, e) — rend true s'il a dessiné, false si la sonde manque
       e.sonde         : { p:[x,y,z] } ou null/undefined
       e.vitesseLocale : [vx,vy,vz]
       e.horloge       : { bord, mere }   (secondes)
       e.len(v)        : la norme d'un vecteur
       e.T / e.remplit / e.virgule / e.tempsFr : le texte
       tau   = √(1 − 1.5/r),  r = len(sonde.p)     affiché en pourcentage
       maree = 1/r³                                affichée si elle dépasse 0,01

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI

   Surtout pas de la formule du module recopiée en face d'elle-même — deux fois
   le dépôt s'est fait avoir par un test qui s'adaptait au tableau qu'on lui
   donnait. La référence est redérivée en bas de ce fichier, à partir des
   géodésiques circulaires de Schwarzschild et de rien d'autre :

     · le potentiel effectif V(r) = (1 − 2M/r)(1 + L²/r²), en unités G = c = M = 1 ;
     · une orbite circulaire annule V'(r) — on en tire L² par différences finies ;
     · son énergie vaut E = √V(r), et l'horloge de bord bat dτ/dt = (1 − 2M/r)/E ;
     · l'ISCO est le rayon qui MINIMISE L² — trouvé par recherche ternaire, il
       tombe sur 6M sans que 6 ait jamais été écrit ;
     · et là, dτ/dt sort à 0,70710678… : c'est √½, dérivé et non recopié.

   Le pont entre les deux mondes est la seule convention à connaître : le site
   compte les longueurs en rayons de Schwarzschild, donc r_site = r/(2M). L'ISCO
   à 6M vaut 3 sur les cadrans, et √(1 − 3M/r) devient √(1 − 1,5/r_site).

   ---------------------------------------------------------------------------
   COMMENT ON ÉPROUVE UN DESSIN SANS NAVIGATEUR

   La technique vient d'`outil-verif-recul.js` : on donne au module un contexte
   2D qui ne dessine rien et NOTE tout. Chaque appel laisse ses coordonnées et
   son texte, et le tas d'appels devient une matière qu'on interroge.

   Deux perfectionnements par rapport au faux contexte du recul, parce qu'ici
   c'est la mise en page qui est en jeu :

   1. LES TRANSFORMATIONS SONT TENUES. `translate`, `rotate`, `scale`, `save` et
      `restore` alimentent une vraie matrice affine, et les points relevés sont
      en coordonnées d'ÉCRAN. Sans elle, un module qui centre son cockpit par un
      `translate` verrait tous ses contrôles de bornes passer au vert en mesurant
      un repère local — le contrôle mesurerait depuis un point de vue qu'il n'a
      pas choisi (règle 5).
   2. LE TEXTE EST PIÉGÉ À LA SOURCE. `e.T(cle)` ne rend pas la phrase française
      mais un jeton « ⟦CLE COCKPIT.MAREE⟧ », insensible aux majuscules. On
      reconnaît donc un cadran par sa CLÉ et non par ses mots : le jour où « marée »
      devient « effet de marée », ou qu'on lit la page en anglais, rien ne bouge
      ici. Un contrôle qui casse à chaque relecture de traduction se fait
      désactiver dans la semaine.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le dernier groupe casse volontairement ce qui est surveillé et exige que les
   contrôles tombent. Deux sabotages, dont le premier ne dépend pas d'une ligne
   de code particulière et s'appliquera donc quoi qu'il arrive :

     · on ment sur `e.len`, qui rend 80 % de la vraie norme. Le module calcule
       alors un rayon faux tout en restant parfaitement cohérent avec lui-même —
       et l'arbitre, lui, n'a pas bougé. Tombent : l'accord à l'ISCO, l'accord
       sur toute la plage de rayons, la valeur de la marée, et le seuil au-dessus
       duquel elle doit disparaître.
     · on remplace le coefficient 1.5 de tau dans une copie EN MÉMOIRE du source,
       et le seuil 0,01 de la marée dans une autre. Tombent : les mêmes, plus
       « le cadran de marée disparaît quand elle est négligeable ».

   Si un sabotage passe inaperçu, cet outil échoue — un contrôle incapable de
   prouver qu'il sait échouer ne teste rien.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS, ET IL FAUT LE DIRE

   Les couleurs, les contrastes, la lisibilité réelle, la largeur du texte tracé
   (`measureText` est un mensonge poli), les découpes par `clip`, et tout ce qui
   se passe derrière en WebGL. Ces choses-là se jugent à l'œil, dans `?juge`.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN = path.join(ICI, "cockpit.js");

console.log("\n  LE COCKPIT DE LA SONDE — CONTRÔLE NUMÉRIQUE");
console.log("  ═══════════════════════════════════════════");

let n = 0, echecs = 0;
/* Quand `carnet` n'est pas nul, `ok()` range au lieu d'imprimer. C'est ce qui
   permet de rejouer les mêmes contrôles sur un module saboté sans salir la
   sortie de faux échecs — et sans écrire une seconde fois les assertions, ce
   qui reviendrait à saboter aussi le contrôle du sabotage. */
let carnet = null;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  if(carnet){ carnet.push({ nom, vrai: !!vrai }); return; }
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
function stop(titre, lignes){
  console.log("\n  ❌  " + titre);
  console.log("  " + "─".repeat(titre.length + 4));
  for(const l of lignes) console.log("      " + l);
  console.log("");
  process.exit(1);
}

/* ══════════════════════════════════════════════════ 0. le module est-il là ?

   S'il manque, on ne rend PAS un zéro échec. Un outil qui n'a rien mesuré et
   qui sort en code 0 endort exactement comme un contrôle qui ne peut pas
   échouer : `node tout.js` afficherait un filet complet sur un trou. */
if(!fs.existsSync(CHEMIN))
  stop("cockpit.js n'existe pas encore — RIEN N'A ÉTÉ MESURÉ", [
    "Le module est écrit en parallèle ; cet outil l'attend et refuse de conclure.",
    "Il tient prêt " + "une quarantaine de contrôles" + " et se déclenchera seul dès que",
    path.relative(process.cwd(), CHEMIN) + " exposera  global.COCKPIT = { dessine }.",
    "",
    "Le contrat attendu est écrit en tête de ce fichier.",
  ]);

const SRC = fs.readFileSync(CHEMIN, "utf8");

/* Le module se referme sur un faux global. On lui tend tous les noms sous
   lesquels un module de ce dépôt peut se déclarer — `(function(global){…})(window)`
   pour ceux qui sont refermés, `window.X =` ou `globalThis.X =` pour les autres —
   plutôt que d'imposer une forme d'écriture à quelqu'un qui travaille en
   parallèle et n'a pas lu ce fichier. */
function charge(src){
  const bac = {};
  const mod = { exports: bac };
  new Function("window", "global", "globalThis", "self", "module", "exports", src)
    (bac, bac, bac, bac, mod, bac);
  return bac.COCKPIT || (mod.exports && mod.exports.COCKPIT) || null;
}

let COCKPIT;
try { COCKPIT = charge(SRC); }
catch(err){
  stop("cockpit.js ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "",
    "Le module doit pouvoir s'évaluer hors navigateur : ni DOM, ni WebGL, ni",
    "`document` au chargement. C'est ce qui rend les autres modules vérifiables.",
  ]);
}
if(!COCKPIT || typeof COCKPIT.dessine !== "function")
  stop("cockpit.js s'est chargé mais n'expose pas `dessine`", [
    "attendu   global.COCKPIT = { dessine }",
    "trouvé    " + (COCKPIT ? "COCKPIT = " + JSON.stringify(Object.keys(COCKPIT))
                            : "aucun COCKPIT sur le global"),
  ]);

/* ════════════════════════════════════════ le faux contexte 2D qui enregistre

   Il accepte tout ce qu'une routine de dessin peut lui demander, ne rend rien
   de faux qui puisse tromper le module (une largeur de texte plausible, un
   dégradé qui avale ses arrêts), et note chaque appel avec ses points DÉJÀ
   passés par la matrice courante. */
function fauxContexte(W, H, traces){
  let M = [1, 0, 0, 1, 0, 0];                     // a b c d e f
  const pile = [];
  const mul = (p, q) => [
    p[0]*q[0] + p[2]*q[1], p[1]*q[0] + p[3]*q[1],
    p[0]*q[2] + p[2]*q[3], p[1]*q[2] + p[3]*q[3],
    p[0]*q[4] + p[2]*q[5] + p[4], p[1]*q[4] + p[3]*q[5] + p[5],
  ];
  const pt = (x, y) => [M[0]*x + M[2]*y + M[4], M[1]*x + M[3]*y + M[5]];
  const boite = (x, y, w, h) => [pt(x, y), pt(x + w, y), pt(x + w, y + h), pt(x, y + h)];
  const note = (op, pts, sup) => { traces.push(Object.assign({ op, pts }, sup || {})); };
  const taille = () => { const m = /(-?[\d.]+)px/.exec(c.font); return m ? +m[1] : 10; };
  const degrade = () => ({ addColorStop(){} });

  const c = {
    canvas: { width: W, height: H },
    fillStyle: "#000", strokeStyle: "#000", lineWidth: 1, lineCap: "butt",
    lineJoin: "miter", miterLimit: 10, lineDashOffset: 0, globalAlpha: 1,
    globalCompositeOperation: "source-over", shadowBlur: 0, shadowColor: "transparent",
    shadowOffsetX: 0, shadowOffsetY: 0, font: "10px sans-serif", textAlign: "start",
    textBaseline: "alphabetic", direction: "ltr", filter: "none",
    imageSmoothingEnabled: true, imageSmoothingQuality: "low",

    save(){ pile.push(M.slice()); },
    restore(){ if(pile.length) M = pile.pop(); },
    translate(x, y){ M = mul(M, [1, 0, 0, 1, x, y]); },
    rotate(a){ M = mul(M, [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]); },
    scale(x, y){ M = mul(M, [x, 0, 0, y, 0, 0]); },
    transform(a, b, d, e, f, g){ M = mul(M, [a, b, d, e, f, g]); },
    setTransform(a, b, d, e, f, g){ M = [a, b, d, e, f, g]; },
    resetTransform(){ M = [1, 0, 0, 1, 0, 0]; },
    getTransform(){ return { a:M[0], b:M[1], c:M[2], d:M[3], e:M[4], f:M[5] }; },

    beginPath(){}, closePath(){}, fill(){ note("fill", []); }, stroke(){ note("stroke", []); },
    clip(){ note("clip", []); },
    moveTo(x, y){ note("moveTo", [pt(x, y)]); },
    lineTo(x, y){ note("lineTo", [pt(x, y)]); },
    arcTo(x1, y1, x2, y2){ note("arcTo", [pt(x1, y1), pt(x2, y2)]); },
    quadraticCurveTo(a, b, x, y){ note("quadraticCurveTo", [pt(a, b), pt(x, y)]); },
    bezierCurveTo(a, b, d, e, x, y){ note("bezierCurveTo", [pt(a, b), pt(d, e), pt(x, y)]); },
    /* Un arc n'est relevé que par son CENTRE, avec son rayon à côté. Une lueur
       radiale déborde légitimement du cadre, et exiger d'elle qu'elle tienne
       dans le hublot ferait échouer du code juste. */
    arc(x, y, r){ note("arc", [pt(x, y)], { rayon: r }); },
    ellipse(x, y, rx, ry){ note("ellipse", [pt(x, y)], { rayon: Math.max(rx, ry) }); },
    rect(x, y, w, h){ note("rect", boite(x, y, w, h), { pave: true }); },
    roundRect(x, y, w, h){ note("roundRect", boite(x, y, w, h), { pave: true }); },
    fillRect(x, y, w, h){ note("fillRect", boite(x, y, w, h), { pave: true }); },
    strokeRect(x, y, w, h){ note("strokeRect", boite(x, y, w, h), { pave: true }); },
    clearRect(x, y, w, h){ note("clearRect", boite(x, y, w, h), { pave: true }); },
    fillText(t, x, y){ note("fillText", [pt(x, y)], { texte: String(t), corps: taille() }); },
    strokeText(t, x, y){ note("strokeText", [pt(x, y)], { texte: String(t), corps: taille() }); },
    drawImage(im, x, y){ note("drawImage", [pt(x || 0, y || 0)]); },
    measureText(t){
      const s = taille();
      return { width: String(t).length * s * 0.55, actualBoundingBoxAscent: s * 0.72,
               actualBoundingBoxDescent: s * 0.21, actualBoundingBoxLeft: 0,
               actualBoundingBoxRight: String(t).length * s * 0.55 };
    },
    createLinearGradient: degrade, createRadialGradient: degrade, createConicGradient: degrade,
    createPattern(){ return null; },
    setLineDash(){}, getLineDash(){ return []; },
    isPointInPath(){ return false; }, isPointInStroke(){ return false; },
  };
  return c;
}

/* ══════════════════════════════════════════════ l'appel, et ce qu'il en reste */

// Une direction quelconque, surtout pas un axe : un module qui prendrait `p[0]`
// pour le rayon au lieu de passer par `e.len` se ferait prendre ici.
const DIR = (() => { const u = [0.3, 0.5, 0.8], k = Math.hypot(u[0], u[1], u[2]);
                     return u.map(x => x / k); })();

const CONTRAT = new Set(["sonde", "vitesseLocale", "horloge", "len",
                         "T", "remplit", "virgule", "tempsFr"]);

function rend(dessine, o){
  o = o || {};
  const W = o.W === undefined ? 1440 : o.W;
  const H = o.H === undefined ?  900 : o.H;
  const traces = [], horsContrat = new Set();
  const ctx = fauxContexte(W, H, traces);

  const base = {
    sonde: ("sonde" in o) ? o.sonde
                          : { p: DIR.map(x => x * (o.r === undefined ? 3 : o.r)) },
    vitesseLocale: o.v || [0, 0, 0],
    horloge: o.horloge || { bord: 0, mere: 0 },
    len: o.len || (v => Math.hypot(v[0], v[1], v[2])),
    /* Des jetons, pas des phrases — voir l'en-tête. Ils survivent à
       `.toUpperCase()`, que la mise en page des cadrans applique aux étiquettes. */
    T: cle => "⟦CLE " + String(cle).toUpperCase() + "⟧",
    remplit: (cle, vals) => "⟦REMPLI " + String(cle).toUpperCase() + " "
                            + JSON.stringify(vals) + "⟧",
    virgule: s => String(s).replace(".", ","),
    tempsFr: s => "⟦TEMPS " + Math.round(Number(s)) + "⟧",
  };
  /* Ce que le module lit et que le contrat ne promet pas est noté : c'est une
     dépendance cachée, et elle casserait le jour où l'appelant changerait. */
  const e = new Proxy(base, {
    get(cible, cle){
      if(typeof cle === "string" && !CONTRAT.has(cle)) horsContrat.add(cle);
      return cible[cle];
    },
  });

  let retour, erreur = null;
  try { retour = dessine(ctx, W, H, e); }
  catch(err){ erreur = err; }

  const textes = traces.filter(t => t.texte !== undefined).map(t => t.texte);
  const points = [];
  for(const t of traces) for(const p of t.pts) points.push({ x: p[0], y: p[1], trace: t });
  return { W, H, r: o.r, traces, textes, points, retour, erreur, horsContrat };
}

// ── lire un nombre affiché, avec la tolérance que son PROPRE affichage impose.
// « 70,7 » ne peut pas mieux dire que ±0,05 : exiger davantage reviendrait à
// tester le nombre de décimales du module au lieu de sa physique.
const NOMBRE = /-?\d+(?:[.,]\d+)?/g;
function tolerance(jeton){
  const p = /[.,](\d+)/.exec(jeton);
  return 0.5 * Math.pow(10, -(p ? p[1].length : 0)) * 1.0001;
}
const valeur = jeton => Number(String(jeton).replace(",", "."));
const colle  = t => String(t).replace(/[\s  ]/g, "");

/* Le pourcentage du cockpit. Le contrat n'en prévoit qu'un — celui de tau — et
   c'est pour cela qu'on peut le reconnaître sans rien savoir de la mise en page.
   S'il y en a deux, ou zéro, on ne devine pas : on le dit. */
function lisPourcentage(res){
  if(res.erreur) return { ok: false, raison: "le dessin a explosé : " + res.erreur.message };
  const trouves = res.textes.map(colle)
    .map(t => /^(-?\d+(?:[.,]\d+)?)%$/.exec(t)).filter(Boolean).map(m => m[1]);
  if(trouves.length === 0)
    return { ok: false, raison: "aucun pourcentage tracé — textes vus : "
             + (res.textes.slice(0, 6).map(t => "« " + t + " »").join(", ") || "aucun") };
  if(trouves.length > 1)
    return { ok: false, raison: "plusieurs pourcentages tracés (" + trouves.join(", ")
             + ") — on ne devine pas lequel porte dτ/dt" };
  return { ok: true, v: valeur(trouves[0]), tol: tolerance(trouves[0]), brut: trouves[0] };
}

// Un nombre quelconque, affiché quelque part, qui vaut `cible` à sa propre
// précision près. Sert à retrouver la marée sans rien supposer de sa place.
function affiche(res, cible){
  for(const t of res.textes)
    for(const j of colle(t).match(NOMBRE) || [])
      if(Math.abs(valeur(j) - cible) <= tolerance(j)) return j;
  return null;
}
const porteCle = (res, cle) => {
  const m = ("⟦CLE " + cle + "⟧").toUpperCase();
  return res.textes.some(t => String(t).toUpperCase().includes(m));
};

/* ══════════════════════════════ L'ARBITRE — Schwarzschild, redérivé ici même

   Unités géométriques : G = c = M = 1. Rien de ce bloc ne lit `cockpit.js`, ni
   `physique.js`, ni aucune valeur écrite de mémoire. */
const gtt  = r => 1 - 2/r;                       // −g_tt de la métrique
const coefL = r => (1 - 2/r)/(r*r);              // le facteur de L² dans V(r)

// L'orbite circulaire de rayon r : V'(r) = 0 donne L², puis E = √V, puis dτ/dt.
function orbite(r){
  const h = r * 1e-5;
  const dA = (gtt(r + h)   - gtt(r - h))   / (2*h);
  const dB = (coefL(r + h) - coefL(r - h)) / (2*h);
  const L2 = -dA / dB;                           // V est affine en L² : c'est exact
  const E  = Math.sqrt(gtt(r) * (1 + L2/(r*r)));
  return { L2, E, rapport: gtt(r) / E };         // dτ/dt = (1 − 2M/r)/E
}

// L'ISCO est le rayon qui MINIMISE L² sur la famille des orbites circulaires.
// Recherche ternaire : aucune valeur de rayon n'est écrite, elle est trouvée.
const rIsco = (() => {
  let a = 3.2, b = 40;
  for(let i = 0; i < 400; i++){
    const p = a + (b - a)/3, q = b - (b - a)/3;
    if(orbite(p).L2 < orbite(q).L2) b = q; else a = p;
  }
  return (a + b)/2;
})();

const EN_RS  = rGeo => rGeo/2;                   // r_site = r/(2M)
const EN_GEO = rSite => 2*rSite;
const tauVrai = rSite => orbite(EN_GEO(rSite)).rapport;

// Le seuil de la marée, résolu et non recopié : 1/r³ = 0,01, par bissection.
const SEUIL_MAREE = 0.01;
const rMaree = (() => {
  let a = 1, b = 100;
  for(let i = 0; i < 200; i++){
    const m = (a + b)/2;
    if(1/(m*m*m) > SEUIL_MAREE) a = m; else b = m;
  }
  return (a + b)/2;
})();

const ECRANS = [
  { nom: "grand écran",      W: 1440, H:  900 },
  { nom: "téléphone debout", W:  390, H:  844 },
  { nom: "téléphone couché", W:  844, H:  390 },
  { nom: "tablette debout",  W: 1024, H: 1366 },
];
// La bande basse réservée, telle que le contrat la fixe : la barre d'actions
// vit là, en HTML, PAR-DESSUS le canevas.
const bandeBasse = (W, H) => 0.115 * Math.min(W, H) + 72;

/* ════════════════════════════════ 1. LE GARDE-FOU : a-t-on mesuré quelque chose ?

   Le piège que ce groupe existe pour éviter : un faux contexte qui n'intercepte
   pas la bonne méthode, ou un module qui sort par une porte de côté, laissent
   une récolte VIDE. Tous les contrôles suivants deviennent alors des « rien de
   faux n'a été vu », c'est-à-dire du vert sur du néant.

   On ne se contente donc pas de constater : on exige une récolte, et l'on
   s'arrête net si elle manque. */
groupe("Le garde-fou : la mesure a bien eu lieu");
{
  const res = rend(COCKPIT.dessine, { r: EN_RS(rIsco), v: [0.2, -0.3, 0.1] });
  if(res.erreur)
    stop("le dessin a levé une exception — RIEN N'A ÉTÉ MESURÉ", [
      res.erreur.name + " : " + res.erreur.message,
      ...(res.erreur.stack || "").split("\n").slice(1, 4).map(l => l.trim()),
      "",
      "Tant que `dessine` explose, aucun contrôle de ce fichier ne veut rien dire.",
    ]);
  if(res.textes.length < 3 || res.points.length < 8)
    stop("le faux contexte n'a presque rien enregistré — JE REFUSE DE CONCLURE", [
      res.textes.length + " textes et " + res.points.length + " points relevés.",
      "Soit le module dessine par une méthode que ce contexte n'intercepte pas,",
      "soit il n'a rien tracé. Dans les deux cas, un « tout passe » serait un",
      "mensonge : les contrôles qui suivent liraient une récolte vide.",
    ]);

  ok("le faux contexte a bien recueilli un cockpit",
     res.textes.length >= 3 && res.points.length >= 8,
     "≥ 3 textes et ≥ 8 points", res.textes.length + " textes, " + res.points.length + " points");
  ok("il a dessiné, et il le dit", res.retour === true, "true", String(res.retour),
     "le contrat fait de la valeur rendue un signal, pas une politesse");
  ok("il ne lit rien hors du contrat", res.horsContrat.size === 0, "aucune clé",
     res.horsContrat.size ? [...res.horsContrat].join(", ") : "aucune",
     "une lecture hors contrat est une dépendance cachée : elle casse le jour où"
     + " l'appelant change, sans que personne ne l'ait touchée");
  if(res.traces.some(t => t.op === "clip"))
    console.log("        (note : le module utilise `clip` — ce contexte ne modélise pas"
                + " la découpe, les bornes ci-dessous sont donc pessimistes)");
}

/* ══════════════════════════════════════ 2. LA PHYSIQUE, CONTRE LES GÉODÉSIQUES */
function controlePhysique(dessine, sup){
  const opt = k => Object.assign({ v: [0.1, 0.2, -0.15] }, sup || {}, k);

  ok("l'ISCO se trouve tout seul à 3 rₛ", Math.abs(EN_RS(rIsco) - 3) < 1e-3,
     "3 rₛ (6M)", EN_RS(rIsco).toFixed(6) + " rₛ",
     "minimum de L² sur les orbites circulaires — aucun rayon n'a été écrit ici");
  ok("et l'horloge y bat exactement √½",
     Math.abs(tauVrai(EN_RS(rIsco))**2 - 0.5) < 1e-6,
     "(dτ/dt)² = 0,5", (tauVrai(EN_RS(rIsco))**2).toFixed(9),
     "soit " + tauVrai(EN_RS(rIsco)).toFixed(7) + " — la forme fermée que la"
     + " dérivation devait retrouver, et le seul contrôle où l'arbitre s'éprouve lui-même");

  // ── le cockpit à l'ISCO, contre l'arbitre
  {
    const res = rend(dessine, opt({ r: EN_RS(rIsco) }));
    const p = lisPourcentage(res);
    ok("à l'ISCO, le cockpit affiche un pourcentage et un seul", p.ok,
       "un pourcentage lisible", p.ok ? "« " + p.brut + " % »" : p.raison);
    const vrai = 100 * tauVrai(EN_RS(rIsco));
    ok("et il vaut √½ — le temps de la sonde s'écoule à 70,7 % du nôtre",
       p.ok && Math.abs(p.v - vrai) <= p.tol,
       vrai.toFixed(4) + " %", p.ok ? p.brut + " %" : "—",
       "c'est LE chiffre du site : sur l'orbite stable la plus basse, une heure"
       + " à bord contre une heure et vingt-cinq minutes au loin");
  }

  // ── sur toute la plage, y compris entre la sphère des photons et l'ISCO
  {
    const rayons = [1.6, 1.75, 2, 2.4, 3, 3.6, 5, 8, 15, 40, 120, 900, 5000];
    let pire = 0, ou = "", muet = null;
    for(const r of rayons){
      const p = lisPourcentage(rend(dessine, opt({ r })));
      if(!p.ok){ muet = r + " rₛ : " + p.raison; break; }
      const vrai = 100 * tauVrai(r);
      const ecart = Math.abs(p.v - vrai) - p.tol;
      if(ecart > pire){ pire = ecart; ou = r + " rₛ (affiché " + p.brut
                                          + " %, attendu " + vrai.toFixed(3) + " %)"; }
    }
    ok("treize rayons, de 1,6 à 5 000 rₛ, tous d'accord avec la géodésique",
       !muet && pire <= 0, "écart nul au-delà de l'arrondi affiché",
       muet ? muet : (pire <= 0 ? "aucun dépassement" : "dépassement de "
                      + pire.toFixed(4) + " point en " + ou),
       "un seul point d'accord ne prouve rien : une formule fausse peut croiser"
       + " la bonne. Treize, non.");
  }

  // ── les deux limites qui encadrent tout le reste
  {
    const loin = lisPourcentage(rend(dessine, opt({ r: 1e7 })));
    ok("très loin, l'horloge de bord rejoint la nôtre",
       loin.ok && Math.abs(loin.v - 100) <= loin.tol, "100 %",
       loin.ok ? loin.brut + " %" : loin.raison,
       "sans cette limite, un facteur constant faux passerait inaperçu partout ailleurs");

    let croissant = true, av = -1, dernier = "";
    for(const r of [1.6, 2, 3, 5, 10, 50, 400, 9000]){
      const p = lisPourcentage(rend(dessine, opt({ r })));
      if(!p.ok){ croissant = false; dernier = p.raison; break; }
      if(p.v < av - 1e-9){ croissant = false; dernier = "chute à " + r + " rₛ"; }
      av = p.v;
    }
    ok("et elle bat d'autant plus lentement qu'on descend", croissant,
       "croissante avec le rayon", croissant ? "huit rayons" : dernier,
       "le sens du gradient : c'est ce qui rend la descente lisible, et un signe"
       + " inversé ferait un site qui enseigne le contraire de la relativité");
  }

  // ── sous l'ISCO, là où la formule pourrait passer sous zéro
  {
    const bas = [2.8, 2, 1.6, 1.5, 1.4, 1, 0.6, 0.2, 1e-9];
    let sale = null;
    for(const r of bas){
      const res = rend(dessine, opt({ r }));
      if(res.erreur){ sale = r + " rₛ : " + res.erreur.message; break; }
      const laid = res.textes.find(t => /NaN|Infinity|undefined|null/i.test(String(t)));
      if(laid){ sale = r + " rₛ : le cockpit affiche « " + laid + " »"; break; }
      if(res.points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))){
        sale = r + " rₛ : une coordonnée n'est pas finie"; break;
      }
      const p = lisPourcentage(res);
      if(!p.ok){ sale = r + " rₛ : " + p.raison; break; }
      if(!(p.v >= 0 && p.v <= 100)){ sale = r + " rₛ : " + p.brut + " %"; break; }
    }
    ok("sous l'ISCO et jusque sous l'horizon, rien ne devient NaN", sale === null,
       "0 ≤ % ≤ 100, tout fini", sale || "neuf rayons, jusqu'à 10⁻⁹ rₛ",
       "1 − 1,5/r passe sous zéro dès 1,5 rₛ : une racine non protégée y rend NaN,"
       + " et un NaN dans un `fillText` s'affiche en toutes lettres à l'écran");
  }
}
groupe("La physique, contre les géodésiques de Schwarzschild");
controlePhysique(COCKPIT.dessine);

/* ═══════════════════════════════════════ 3. LA MARÉE PARAÎT, PUIS DISPARAÎT

   Le contrat le dit et c'est un choix de conception, pas un détail : un cadran
   qui affiche en permanence « négligeable » n'apprend rien et prend la place
   d'un cadran qui parlerait. Ce qu'on surveille, c'est donc les DEUX sens —
   présent en bas, absent en haut. Un module qui l'afficherait toujours passerait
   un contrôle qui ne regarderait que le bas. */
function controleMaree(dessine, sup){
  const opt = k => Object.assign({ v: [0.1, 0.2, -0.15] }, sup || {}, k);
  const cle = "COCKPIT.MAREE";

  ok("le seuil 0,01 se franchit à 4,64 rₛ", Math.abs(1/(rMaree**3) - SEUIL_MAREE) < 1e-9,
     "1/r³ = 0,01", rMaree.toFixed(6) + " rₛ",
     "résolu par bissection : le rayon n'est pas écrit, il est trouvé");

  {
    const bas = [1.2, 2, 3, rMaree*0.97];
    const manque = bas.filter(r => !porteCle(rend(dessine, opt({ r })), cle));
    ok("près du trou noir, le cadran de marée est là", manque.length === 0,
       "présent aux quatre rayons",
       manque.length ? "absent à " + manque.map(r => r.toFixed(2)).join(", ") + " rₛ"
                     : "présent jusqu'à " + (rMaree*0.97).toFixed(2) + " rₛ");

    const haut = [rMaree*1.03, 6, 20, 500, 1e5];
    const restent = haut.filter(r => porteCle(rend(dessine, opt({ r })), cle));
    ok("loin, il s'efface au lieu de dire « négligeable »", restent.length === 0,
       "absent aux cinq rayons",
       restent.length ? "encore là à " + restent.map(r => r.toFixed(2)).join(", ") + " rₛ"
                      : "effacé dès " + (rMaree*1.03).toFixed(2) + " rₛ");
  }

  /* La VALEUR, pas seulement la présence. Un cadran qui paraît au bon moment en
     affichant un chiffre faux serait pire que pas de cadran : on le croirait.
     On la cherche parmi tous les nombres tracés, sans rien supposer de sa place
     dans la console — la mise en page est libre, la valeur ne l'est pas. */
  {
    let faute = null;
    for(const r of [1.5, 2, 3.5, 4.4]){
      const res = rend(dessine, opt({ r, v: [0.37, 0, 0] }));
      const vrai = 1/(r*r*r);
      if(!affiche(res, vrai)){
        faute = r + " rₛ : 1/r³ = " + vrai.toFixed(4) + " ne se lit nulle part — tracé : "
                + res.textes.map(t => "« " + t + " »").join(" ");
        break;
      }
    }
    ok("et le chiffre affiché est bien 1/r³", faute === null,
       "la valeur se retrouve dans le dessin", faute || "quatre rayons vérifiés",
       "la marée du site vaut M/r³ à un facteur d'unités près : c'est la dérivée"
       + " seconde du potentiel, ce qui écartèle et non ce qui tire");
  }
}
groupe("La marée paraît près du trou noir, et s'efface loin");
controleMaree(COCKPIT.dessine);

/* ═════════════════════════════════════ 4. RIEN NE SORT DU HUBLOT, NI DU CADRE */
groupe("Rien n'est tracé hors de l'écran");
for(const ec of ECRANS){
  const res = rend(COCKPIT.dessine, { W: ec.W, H: ec.H, r: 2.2,
                                      v: [0.3, 0.1, -0.2],
                                      horloge: { bord: 137, mere: 921 } });
  if(res.erreur){
    ok(ec.nom + " — le dessin passe", false, "aucune exception", res.erreur.message);
    continue;
  }
  const fini = res.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y));
  ok(ec.nom + " (" + ec.W + "×" + ec.H + ") — toutes les coordonnées sont finies", fini,
     "toutes finies",
     fini ? res.points.length + " points" : "au moins une NaN ou infinie",
     "une seule coordonnée NaN et le chemin entier disparaît sans un mot dans la console");

  // Une marge, parce qu'un trait large ou une capitale centrée dépassent d'un
  // cheveu sans que ce soit un défaut. Ce qu'on traque, c'est l'aberration.
  const marge = Math.max(3, 0.02 * Math.min(ec.W, ec.H));
  const dehors = res.points.filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)
    && (p.x < -marge || p.x > ec.W + marge || p.y < -marge || p.y > ec.H + marge));
  const pire = dehors.slice().sort((a, b) =>
    Math.max(Math.abs(b.x - ec.W/2), Math.abs(b.y - ec.H/2))
    - Math.max(Math.abs(a.x - ec.W/2), Math.abs(a.y - ec.H/2)))[0];
  ok(ec.nom + " — et toutes tiennent dans le cadre", dehors.length === 0,
     "0 point hors de [0," + ec.W + "]×[0," + ec.H + "] à " + marge.toFixed(0) + " px près",
     dehors.length ? dehors.length + " points, le pire en " + pire.trace.op
                     + " (" + pire.x.toFixed(0) + ", " + pire.y.toFixed(0) + ")"
                   : "aucun",
     "un cadran poussé hors champ ne se voit pas en développant : il se voit sur"
     + " le téléphone de quelqu'un, un mois plus tard");
}

/* ══════════════════════════ 5. LA CONSOLE TIENT DANS SA BANDE

   ═══ CE GROUPE A ÉTÉ ÉCRIT SUR UNE SPÉCIFICATION FAUSSE, ET C'EST LA MIENNE.

   J'avais donné à l'agent qui a écrit cet outil la consigne suivante : « la
   bande basse est réservée, le dessin ne doit pas empiéter sur les 72 px +
   11,5 % ». Il l'a implémentée fidèlement, a trouvé quatre échecs sur quatre
   écrans, et — c'est le bon réflexe — a REFUSÉ de corriger `cockpit.js` pour
   les faire taire.

   Il avait raison de refuser : le module n'a rien de faux. `bas` n'est pas une
   bande interdite au dessin, c'est **la hauteur du tableau de bord que le
   cockpit dessine lui-même**. La console DOIT être là ; le hublot, lui, s'arrête
   au-dessus. Ma consigne disait exactement l'inverse de la vérité.

   On contrôle donc la vraie propriété, qui est le miroir de la fausse : ce que
   la console écrit reste DANS sa bande, et ne remonte pas dans le hublot par où
   l'on regarde dehors.

   ═══ CE QUI RESTE OUVERT, ET QUI N'EST PAS UNE MESURE

   L'agent a relevé au passage que les valeurs tombent à 81 px du bas sur grand
   écran et 55 px sur téléphone, alors que le CSS pose `#lecture-flottant` à
   82 px et `#mission` à 64 px. Une collision est donc possible avec ces deux
   panneaux — pas avec les boutons, qui sont plus bas. Ça ne se tranche pas au
   calcul : c'est une question d'œil, notée dans `A-REGARDER.md`.            */
groupe("La console tient dans sa bande, et ne remonte pas dans le hublot");
for(const ec of ECRANS){
  const bas = bandeBasse(ec.W, ec.H);
  const limite = ec.H - bas;
  let pires = [], plante = null;

  for(const horloge of [{ bord: 0, mere: 0 }, { bord: 137, mere: 921 }]){
    const res = rend(COCKPIT.dessine, { W: ec.W, H: ec.H, r: 2.2,
                                        v: [0.3, 0.1, -0.2], horloge });
    if(res.erreur){ plante = res.erreur.message; break; }
    for(const t of res.traces){
      if(!t.pts.length) continue;
      const xs = t.pts.map(p => p[0]), ys = t.pts.map(p => p[1]);
      const large = Math.max(...xs) - Math.min(...xs);
      // le voile : un aplat qui couvre la largeur entière ne cache aucun texte
      if(t.pave && large >= 0.98 * ec.W) continue;
      /* On ne garde que ce qui PORTE de l'information — un texte ou une jauge.
         Le cadre du hublot, ses montants et le filet de séparation traversent
         la ligne par construction : ils la dessinent. */
      if(t.op !== "fillText" && t.op !== "fillRect") continue;
      const y = Math.min(...ys);
      // remonté dans le hublot : ce qui devrait rester en console flotte dedans
      if(Number.isFinite(y) && y < limite - 0.5 && Math.max(...ys) > limite)
        pires.push({ op: t.op, y, texte: t.texte });
    }
  }
  /* On dédoublonne avant de raconter : quatre jauges à la même hauteur, vues
     deux fois, feraient huit lignes qui disent une seule chose. Et l'on donne la
     profondeur EN PARTANT DU BAS de l'écran, parce que c'est le seul repère
     comparable aux `bottom:` du CSS — c'est ce chiffre-là qu'on ira confronter
     à la barre, au bandeau de lecture ou au panneau de mission. */
  const vus = new Set();
  pires.sort((a, b) => b.y - a.y);
  const dit = pires.filter(p => {
    const cle = p.op + "|" + p.texte + "|" + p.y.toFixed(0);
    if(vus.has(cle)) return false; vus.add(cle); return true;
  }).slice(0, 4).map(p => p.op
      + (p.texte !== undefined ? " « " + p.texte + " »" : "")
      + " à " + (ec.H - p.y).toFixed(0) + " px du bas");

  ok(ec.nom + " — la console ne déborde pas dans le hublot",
     !plante && pires.length === 0,
     "aucun texte ni jauge à cheval sur y = " + limite.toFixed(0),
     plante ? "le dessin a explosé : " + plante
            : (pires.length ? pires.length + " tracés à cheval — " + dit.join(" ; ")
                            : "aucun"),
     "la console occupe les " + bas.toFixed(0) + " px du bas, c'est son rôle. Ce "
     + "qu'on interdit, c'est qu'un cadran remonte dans la vitre par où l'on regarde");
}

/* ══════════════════════════════════════════ 6. LA SONDE ABSENTE NE PLANTE PAS

   Il n'y a pas toujours une sonde suivie : au démarrage, après une chute
   jusqu'à l'horizon, entre deux lancers. Le cockpit doit alors se taire ET le
   dire — se taire seulement laisserait l'appelant peindre une interface autour
   d'un instrument qui n'a rien affiché. */
groupe("Sans sonde, il se tait et il le dit");
for(const [nom, s] of [["null", null], ["undefined", undefined]]){
  const res = rend(COCKPIT.dessine, { sonde: s });
  ok("sonde " + nom + " — aucune exception", res.erreur === null, "aucune",
     res.erreur ? res.erreur.name + " : " + res.erreur.message : "aucune");
  ok("sonde " + nom + " — il rend false", res.retour === false, "false",
     JSON.stringify(res.retour),
     "le contrat demande `false`, pas un `return` nu : `undefined` ne se distingue"
     + " pas d'un module qui a oublié de répondre");
  ok("sonde " + nom + " — et il n'a rien peint", res.traces.length === 0, "0 tracé",
     res.traces.length + " tracés",
     "un demi-cockpit posé sur la scène est pire qu'un cockpit absent : il"
     + " affirme une lecture qu'il n'a pas");
}
{
  // La sonde au centre exact : ce n'est pas une sonde absente, c'est une sonde
  // impossible. On n'exige pas un affichage sensé — 1/r³ y est infini — mais
  // rien ne doit exploser ni salir la géométrie.
  const res = rend(COCKPIT.dessine, { sonde: { p: [0, 0, 0] } });
  ok("une sonde au centre exact ne fait rien exploser",
     res.erreur === null && res.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)),
     "aucune exception, aucune coordonnée NaN",
     res.erreur ? res.erreur.message : "propre",
     "r = 0 est hors du monde simulé — on n'y demande pas un affichage juste,"
     + " seulement qu'il ne contamine pas le dessin");
}

/* ═════════════════════════════ 7. LES ENTRÉES SERVENT VRAIMENT À QUELQUE CHOSE

   Un cadran qui ne dépend pas de son entrée est un décor. Le dépôt en a déjà
   payé le prix ailleurs, et ça ne se voit pas : ça s'affiche parfaitement, avec
   une valeur qui a l'air juste. */
groupe("Ce qu'on lui donne se retrouve à l'écran");
{
  const lent  = rend(COCKPIT.dessine, { r: 4, v: [0, 0, 0] });
  const vite  = rend(COCKPIT.dessine, { r: 4, v: [0.3, 0.4, 0.5] });
  ok("changer la vitesse locale change le cockpit",
     lent.textes.join("|") !== vite.textes.join("|"), "un affichage différent",
     lent.textes.join("|") === vite.textes.join("|") ? "identique au caractère près"
                                                     : "différent",
     "sinon `e.vitesseLocale` serait décorative, et le cadran de vitesse un dessin");

  const arret = rend(COCKPIT.dessine, { r: 4, horloge: { bord: 0, mere: 0 } });
  const long  = rend(COCKPIT.dessine, { r: 4, horloge: { bord: 137, mere: 921 } });
  const vu = s => long.textes.some(t => String(t).includes("⟦TEMPS " + s + "⟧"));
  ok("quand les horloges ont tourné, les deux sont affichées",
     vu(137) && vu(921), "les deux temps, passés par `e.tempsFr`",
     (vu(137) ? "bord ✓" : "bord manquant") + ", " + (vu(921) ? "mère ✓" : "mère manquante"),
     "le sujet du site est l'ÉCART entre elles : n'en montrer qu'une, ou les"
     + " formater à la main, revient à raconter la moitié de l'histoire");
  ok("et à l'arrêt, le cockpit n'est pas le même",
     arret.textes.join("|") !== long.textes.join("|"), "un affichage différent",
     arret.textes.join("|") === long.textes.join("|") ? "identique" : "différent");
}

/* ═══════════════════════════════════════ 8. LE CONTRÔLE SAIT-IL ÉCHOUER ?  (règle 2)

   On rejoue les groupes 2 et 3 sur un cockpit saboté, en silence, et l'on exige
   qu'ils tombent. Deux sabotages de nature différente :

   · PAR L'ENVIRONNEMENT — `e.len` rend 80 % de la norme. Aucune ligne de
     `cockpit.js` n'est touchée : le module reste cohérent avec lui-même, il ne
     ment que par rapport au monde. C'est la seule forme de sabotage qui
     s'applique à coup sûr, quelle que soit la façon dont le module est écrit —
     et c'est aussi la plus proche du vrai danger, un rayon mal transmis.
   · PAR LE TEXTE — on remplace le coefficient de tau, puis le seuil de la marée,
     dans une copie EN MÉMOIRE du source. Le fichier sur le disque n'est jamais
     touché. Si le motif n'existe pas, on le dit au lieu de faire semblant. */
groupe("Le contrôle sait échouer — on le casse pour le prouver");
function essaie(nom, dessine, sup){
  carnet = [];
  try { controlePhysique(dessine, sup); controleMaree(dessine, sup); }
  catch(err){ carnet.push({ nom: "exception : " + err.message, vrai: false }); }
  const lot = carnet; carnet = null;
  const tombes = lot.filter(c => !c.vrai);
  ok(nom, tombes.length > 0, "au moins un contrôle tombe",
     tombes.length + " tombés sur " + lot.length,
     tombes.length ? "→ " + tombes.slice(0, 4).map(c => c.nom).join(" ; ")
                   : "AUCUN — les contrôles ci-dessus ne surveillent donc rien");
}

essaie("un `e.len` qui rend 80 % de la norme fait tout tomber", COCKPIT.dessine,
       { len: v => 0.8 * Math.hypot(v[0], v[1], v[2]) });

const SABOTAGES = [
  { nom: "le coefficient de tau, 1.5 → 2.4",
    motif: /(?<![\d.])1\s*\.\s*5(?=\s*\/\s*r\b)/, par: "2.4" },
  { nom: "le seuil de la marée, 0.01 → 1e9",
    motif: /(?<![\d.])0\s*\.\s*01(?![\d])/, par: "1e9" },
];
for(const s of SABOTAGES){
  if(!s.motif.test(SRC)){
    /* Pas un échec : le sabotage par l'environnement, ci-dessus, a déjà prouvé
       que le filet mord. Mais on ne fait pas semblant de l'avoir essayé. */
    console.log("  ·   " + s.nom + " — motif introuvable dans le source, non tenté");
    continue;
  }
  let mutant = null;
  try { mutant = charge(SRC.replace(s.motif, s.par)); } catch(err){ /* rien */ }
  if(!mutant || typeof mutant.dessine !== "function"){
    ok("saboter " + s.nom + " donne un module chargeable", false,
       "un module mutant", "il ne se charge plus — sabotage inexploitable");
    continue;
  }
  essaie("saboter " + s.nom + " fait tomber le filet", mutant.dessine);
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
