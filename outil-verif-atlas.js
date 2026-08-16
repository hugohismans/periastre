/* ============================================================================
   L'ATLAS — LE REGISTRE DES CARTES, ET LA SPHÈRE SUR LAQUELLE ON LES POSE

       node outil-verif-atlas.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE — 16 août 2026

   Hugo, en jugeant l'arrivée : « la terre et la lune utilise des vrai photo,
   ont les a dans le projet ». Elles y étaient depuis cinq jours, sourcées et
   gardées, et seule la page du rivage s'en servait. Le registre est donc sorti
   de `rivage.js` vers `atlas.js`, et la projection sur la sphère a été écrite
   une seconde fois — en pixels cette fois, parce que la scène de l'arrivée
   dessine sur un canevas 2D et n'a pas de nuanceur sous la main.

   DEUX ÉCRITURES D'UNE MÊME GÉOMÉTRIE, c'est exactement ce que la règle 4
   interdit — sauf qu'ici les deux moteurs ne peuvent rien partager : l'un
   tourne dans la carte graphique, l'autre dans un tableau d'octets. Ce qu'ils
   peuvent partager est le RÉSULTAT, et c'est ce que ce fichier exige.

   ---------------------------------------------------------------------------
   D'OÙ VIENT SA VÉRITÉ — règle 3, et elle est prise au sérieux

   L'arbitre ne rejoue PAS la formule d'`atlas.js`. Il refait le chemin du
   nuanceur, qui est d'une autre nature :

     le nuanceur    lance un rayon, coupe la sphère, prend la NORMALE au point
                    touché, et lit `asin(n.y)` / `atan2(n.x, n.z)`.

     `atlas.js`     applique la projection orthographique INVERSE en forme
                    close — `asin(rho)`, puis les deux formules de Snyder.

   Un observateur infiniment loin voit en projection orthographique : les deux
   décrivent donc le même point, par deux algèbres qui n'ont pas une ligne en
   commun. Une erreur de signe, d'axe ou de convention casse l'accord.

   C'est le piège qu'on cherche : une inversion du nord ne se voit PAS sur la
   Lune, et se voit à peine sur la Terre pour qui ne connaît pas ses
   continents. Aucun œil ne rattraperait ça — il fallait une mesure.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const ici = __dirname;
const W = {};
new Function("window", fs.readFileSync(path.join(ici, "atlas.js"), "utf8"))(W);
const A = W.ATLAS;

if(!A){ console.error("atlas.js n'a rien posé."); process.exit(2); }

let echecs = 0, total = 0;
function point(nom, ok, attendu, mesure, note){
  total++; if(!ok) echecs++;
  console.log(`  ${ok ? "✅" : "❌"}  ${nom}`);
  if(attendu !== undefined) console.log(`        attendu ${attendu}   mesuré ${mesure}`);
  if(note) console.log(`        ${note}`);
}
function titre(t){ console.log(`\n  ${t}\n  ${"─".repeat(t.length)}`); }

/* ---------------------------------------------------------------- L'ARBITRE

   Le chemin du nuanceur, refait à la main. On construit le repère de l'écran
   autour du point sous l'observateur, on pose le point de la sphère par
   combinaison, et on lit sa latitude et sa longitude comme le nuanceur les lit.

   La convention du repère de l'astre est celle du nuanceur, et elle est lisible
   dans `rivage.html` : y est le pôle nord, et la longitude vaut `atan2(x, z)`,
   donc la longitude nulle regarde vers +z.                                    */
function arbitre(dx, dy, sousObs){
  const rho2 = dx*dx + dy*dy;
  if(rho2 > 1) return null;
  const la = sousObs.lat, lo = sousObs.lon;

  // Vers l'observateur, depuis le centre de l'astre.
  const o = [Math.cos(la)*Math.sin(lo), Math.sin(la), Math.cos(la)*Math.cos(lo)];
  // Le haut de l'écran, le nord autant que possible : ŷ redressé sur o.
  const pj = o[1];                                    // ŷ · o
  let up = [-pj*o[0], 1 - pj*o[1], -pj*o[2]];
  const nu = Math.hypot(up[0], up[1], up[2]);
  // Au pôle exact, ŷ et o sont colinéaires et « le nord » n'a plus de sens :
  // on ne teste pas là, et l'arbitre le dit plutôt que de rendre un NaN.
  if(!(nu > 1e-9)) return null;
  up = [up[0]/nu, up[1]/nu, up[2]/nu];
  // La droite de l'écran : up × o. Vérifié au centre du repère — lat 0, lon 0
  // donne o = +z, up = +y, et donc right = +x, qui est bien l'est.
  const right = [up[1]*o[2] - up[2]*o[1],
                 up[2]*o[0] - up[0]*o[2],
                 up[0]*o[1] - up[1]*o[0]];

  const nord = -dy;                                   // l'écran descend
  const z = Math.sqrt(Math.max(0, 1 - rho2));
  const n = [dx*right[0] + nord*up[0] + z*o[0],
             dx*right[1] + nord*up[1] + z*o[1],
             dx*right[2] + nord*up[2] + z*o[2]];
  return { lat: Math.asin(Math.max(-1, Math.min(1, n[1]))),
           lon: Math.atan2(n[0], n[2]) };
}

// On compare des POINTS de la sphère, jamais des latitudes et des longitudes
// nues : celles-ci se cassent à la couture des ±180° et ne veulent plus rien
// dire près des pôles, où deux longitudes très différentes désignent le même
// endroit.
const vecteur = p => [Math.cos(p.lat)*Math.sin(p.lon), Math.sin(p.lat),
                      Math.cos(p.lat)*Math.cos(p.lon)];

// L'écart ANGULAIRE, pour les affirmations qui se lisent en degrés.
function ecart(a, b){
  const [x, y] = [vecteur(a), vecteur(b)];
  const d = x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
  return Math.acos(Math.max(-1, Math.min(1, d)));
}

/* LA CORDE, et il a fallu se faire prendre pour l'écrire — 16 août 2026.

   La comparaison fine employait `ecart`, et rendait 2,6 × 10⁻⁸ rad là où l'on
   attendait le bruit de la virgule flottante. J'ai failli desserrer le seuil et
   passer à autre chose. Le désaccord n'était pas dans la géométrie : il est
   dans `acos`. Près de zéro, son argument vaut 1 − δ avec δ de l'ordre de la
   précision machine, et l'angle rendu est √(2δ) — soit 1,4 × 10⁻⁸. **La mesure
   ne pouvait pas descendre plus bas, quoi que fasse le code mesuré.**

   Un seuil desserré pour tenir compte du bruit d'une mesure aveugle, c'est un
   contrôle qui s'adapte au tableau qu'on lui donne — la règle 3, prise à
   l'envers. La corde entre deux points unitaires n'a pas cette singularité :
   elle se calcule sans arc, et elle vaut l'angle à ε près quand il est petit. */
function chorde(a, b){
  const [x, y] = [vecteur(a), vecteur(b)];
  return Math.hypot(x[0]-y[0], x[1]-y[1], x[2]-y[2]);
}

console.log("\n  L'ATLAS — LE REGISTRE ET LA SPHÈRE");
console.log("  ══════════════════════════════════");

/* ------------------------------------------------------------ LE REGISTRE */
titre("Le registre des cartes tient debout");

point("les six cartes sont là", A.LISTE.length === 6, 6, A.LISTE.length);
point("et toutes passent la validation", A.LISTE.every(A.carteValide),
      "toutes", A.LISTE.filter(c => !A.carteValide(c)).map(c => c && c.cle).join(", ") || "toutes");
point("la Terre et la Lune ont bien la leur",
      !!A.carteDe("terre") && !!A.carteDe("lune"), "les deux",
      `${A.carteDe("terre") ? "terre" : "TERRE MANQUE"}, ${A.carteDe("lune") ? "lune" : "LUNE MANQUE"}`,
      "ce sont celles qu'Hugo a réclamées le 16 août — sans elles, la scène de "
      + "l'arrivée retombe sur les taches dessinées à la main");
point("et chacune porte son crédit à l'écran",
      A.LISTE.every(c => A.creditDe(c.cle)), "toutes",
      A.LISTE.filter(c => !A.creditDe(c.cle)).map(c => c.cle).join(", ") || "toutes",
      "deux des six licences sont des Creative Commons Attribution : le crédit "
      + "est une obligation, pas une politesse");
point("les fichiers annoncés existent sur le disque",
      A.LISTE.every(c => fs.existsSync(path.join(ici, c.fichier))), "tous",
      A.LISTE.filter(c => !fs.existsSync(path.join(ici, c.fichier))).map(c => c.fichier).join(", ") || "tous");

/* UN SEUL ÉCRIVAIN. Le registre est sorti de `rivage.js` le 16 août ; le jour
   où quelqu'un y recolle une liste, on a deux vérités pour six images et rien
   ne le dit. La mesure se lit dans le texte, parce que c'est là que la faute
   s'écrirait. */
const srcRivage = fs.readFileSync(path.join(ici, "rivage.js"), "utf8");
point("et `rivage.js` ne le possède plus, il le relaie",
      !/const\s+CARTES\s*=\s*\[/.test(srcRivage) && /ATLAS/.test(srcRivage),
      "aucune seconde liste, et un renvoi vers ATLAS",
      /const\s+CARTES\s*=\s*\[/.test(srcRivage) ? "UNE SECONDE LISTE EST REVENUE"
        : (/ATLAS/.test(srcRivage) ? "il relaie" : "IL NE RELAIE PLUS"));

/* ---------------------------------------------- LA SPHÈRE, CONTRE L'ARBITRE */
titre("La projection s'accorde avec celle du nuanceur");

/* Plusieurs points sous l'observateur, dont deux qui ne sont pas l'origine :
   une erreur d'axe passe inaperçue quand tout est à zéro. */
const OBS = [
  { lat: 0,            lon: 0 },
  { lat: 0,            lon: 1.9 },
  { lat: 0.7,          lon: -2.4 },
  { lat: -0.45,        lon: 0.3 },
];
let pires = 0, comptes = 0;
for(const o of OBS){
  for(let i = 0; i <= 24; i++){
    for(let j = 0; j <= 24; j++){
      const dx = -1 + 2*i/24, dy = -1 + 2*j/24;
      if(dx*dx + dy*dy > 0.985) continue;             // on laisse le limbe, où asin sature
      const a = A.latLon(dx, dy, o), b = arbitre(dx, dy, o);
      if(!a || !b) continue;
      pires = Math.max(pires, chorde(a, b));
      comptes++;
    }
  }
}
point("les deux chemins tombent sur le même point", pires < 1e-12,
      "moins de 1 pico d'écart", pires.toExponential(2),
      `sur ${comptes} points, quatre observateurs — le nuanceur coupe une sphère `
      + "et lit sa normale, `atlas.js` inverse la projection en forme close");
point("et la mesure a bien mordu", comptes > 1500, "> 1500 points", comptes,
      "zéro passerait le point ci-dessus sans rien comparer");

titre("La géométrie dit ce qu'elle doit dire");

const c0 = A.latLon(0, 0, { lat: 0.7, lon: -2.4 });
point("le centre du disque est le point sous l'observateur",
      Math.abs(c0.lat - 0.7) < 1e-12 && Math.abs(c0.lon + 2.4) < 1e-12,
      "lat 0,7 lon −2,4", `lat ${c0.lat.toFixed(6)} lon ${c0.lon.toFixed(6)}`);

const bord = A.latLon(1, 0, { lat: 0, lon: 0 });   // AU bord, pas presque :
// `asin` y a une tangente verticale, et à 10⁻⁶ du limbe l'angle est déjà à
// 1,4 mrad de π/2 — ce qui mesurerait la racine carrée, pas la géométrie.
point("le bord du disque est à 90° de l'observateur",
      Math.abs(ecart(bord, { lat: 0, lon: 0 }) - Math.PI/2) < 1e-12,
      "π/2", ecart(bord, { lat: 0, lon: 0 }).toFixed(6),
      "c'est le limbe : on y voit la sphère par la tranche");

point("hors du disque, rien", A.latLon(0.8, 0.8, { lat: 0, lon: 0 }) === null,
      "null", A.latLon(0.8, 0.8, { lat: 0, lon: 0 }) === null ? "null" : "un point");

/* LE NORD EST EN HAUT, et c'est le contrôle qu'aucun œil ne remplace : sur la
   Lune, une carte retournée est indiscernable pour qui ne connaît pas ses mers.
   `dy` négatif est le HAUT de l'écran, donc la latitude doit y monter. */
const haut = A.latLon(0, -0.5, { lat: 0, lon: 0 });
const bas  = A.latLon(0, +0.5, { lat: 0, lon: 0 });
point("le nord est en haut de l'écran", haut.lat > 0 && bas.lat < 0,
      "haut > 0 > bas", `haut ${haut.lat.toFixed(3)}, bas ${bas.lat.toFixed(3)}`,
      "une carte retournée ne se voit sur AUCUN écran pour la Lune, et à peine "
      + "pour la Terre — il n'y a que la mesure pour l'attraper");

const est = A.latLon(0.5, 0, { lat: 0, lon: 0 });
point("et l'est est à droite", est.lon > 0, "> 0", est.lon.toFixed(3),
      "la longitude croît vers l'est, comme sur les cartes publiées");

titre("La convention de la carte est celle du nuanceur");

/* Le nuanceur écrit `vec2(longitude/6.2831853 + 0.5, 0.5 - latitude/3.1415927)`.
   On la rejoue telle quelle, plutôt que de la décrire. */
function uvNuanceur(lat, lon){
  return { u: lon/(2*Math.PI) + 0.5, v: 0.5 - lat/Math.PI };
}
/* `u` SE COMPARE MODULO 1, et ce n'est pas une facilité. Une carte se referme
   sur elle-même : la colonne 0 et la colonne 1 sont la MÊME, et les deux
   écritures la nomment différemment de part et d'autre des ±180°. `atlas.js`
   ramène la longitude dans ]−π, π] avant de diviser ; le nuanceur laisse le
   bouclage à la texture. Exiger l'égalité nue rendrait un écart de 1 sur la
   couture — un contrôle rouge pour deux formules qui désignent le même pixel. */
const distanceU = (a, b) => { const d = Math.abs(a - b) % 1; return Math.min(d, 1 - d); };
let pireUV = 0;
for(let i = 0; i <= 40; i++){
  for(let j = 0; j <= 40; j++){
    const lat = -Math.PI/2 + Math.PI*i/40, lon = -Math.PI + 2*Math.PI*j/40;
    const a = A.uv(lat, lon), b = uvNuanceur(lat, lon);
    pireUV = Math.max(pireUV, distanceU(a.u, b.u), Math.abs(a.v - b.v));
  }
}
point("les deux conventions de carte coïncident", pireUV < 1e-12,
      "identiques", pireUV.toExponential(2),
      "sur 1 681 points. Si elles divergeaient, la même photo tomberait à deux "
      + "endroits différents selon la page qui la regarde");

const srcRivageHtml = fs.readFileSync(path.join(ici, "rivage.html"), "utf8");
point("et le nuanceur emploie toujours cette convention",
      /longitude\s*\/\s*6\.2831853\s*\+\s*0\.5/.test(srcRivageHtml)
      && /0\.5\s*-\s*latitude\s*\/\s*3\.1415927/.test(srcRivageHtml),
      "les deux lignes sont là",
      /longitude\s*\/\s*6\.2831853\s*\+\s*0\.5/.test(srcRivageHtml) ? "présentes" : "LE NUANCEUR A CHANGÉ",
      "sans ça l'accord ci-dessus se ferait avec une formule que plus personne "
      + "n'exécute — et cet outil resterait vert en gardant une porte fermée");

titre("Le remplissage du disque");

/* Une carte fabriquée à la main, dont chaque pixel dit d'où il vient : le rouge
   porte la colonne, le vert la ligne. On peut donc RELIRE le disque et vérifier
   qu'il a pris ses pixels au bon endroit — pas seulement qu'il en a pris. */
const SW = 64, SH = 32;
const src = { width: SW, height: SH, data: new Uint8ClampedArray(SW*SH*4) };
for(let y = 0; y < SH; y++) for(let x = 0; x < SW; x++){
  const k = (y*SW + x)*4;
  src.data[k] = Math.round(255*x/(SW-1));
  src.data[k+1] = Math.round(255*y/(SH-1));
  src.data[k+2] = 128; src.data[k+3] = 255;
}
const T = 64;
const dst = { width: T, height: T, data: new Uint8ClampedArray(T*T*4) };
const peints = A.projette(src, dst, { lat: 0, lon: 0 });

const aire = Math.PI*(T/2)*(T/2);
point("le disque est peint, et il a l'aire d'un disque",
      Math.abs(peints - aire)/aire < 0.02, `≈ ${Math.round(aire)} pixels`, peints,
      "un carré plein en donnerait " + (T*T) + " : la différence est le contrôle");

const coin = (0*T + 0)*4;
point("les coins restent transparents", dst.data[coin+3] === 0, 0, dst.data[coin+3],
      "hors du disque c'est le vide, pas du noir — l'appelant pose ce qu'il veut derrière");

const centre = ((T/2)*T + (T/2))*4;
point("le centre est opaque", dst.data[centre+3] === 255, 255, dst.data[centre+3]);

/* Le centre du disque regarde la longitude 0 et la latitude 0, donc le milieu
   de la carte dans les deux sens : rouge ≈ 128, vert ≈ 128. */
point("et il a pris son pixel au milieu de la carte",
      Math.abs(dst.data[centre] - 128) < 8 && Math.abs(dst.data[centre+1] - 128) < 8,
      "rouge ≈ 128, vert ≈ 128", `${dst.data[centre]}, ${dst.data[centre+1]}`,
      "c'est ce qui distingue « il a peint » de « il a peint au bon endroit »");

/* Le haut du disque regarde le nord, donc le HAUT de la carte, donc vert bas. */
const enHaut = ((2)*T + (T/2))*4;
point("le haut du disque vient du haut de la carte",
      dst.data[enHaut+1] < 40, "vert < 40", dst.data[enHaut+1],
      "le second garde-fou contre une carte retournée, celui-là sur de vrais pixels");

point("une source vide ne peint rien",
      A.projette(null, dst, null) === 0 && A.projette({width:0,height:0,data:[]}, dst, null) === 0,
      0, "0",
      "une photo qui n'a pas chargé doit rendre zéro, pas planter : c'est le "
      + "repli de la scène qui en dépend");

/* ------------------------------------------------------------- LES SABOTAGES
   Règle 2 — et ils portent sur la GÉOMÉTRIE, pas sur le registre : c'est elle
   qu'aucun œil ne peut relire. */
titre("Cet outil sait échouer");

function accord(f){
  let pire = 0;
  for(const o of OBS) for(let i = 0; i <= 12; i++) for(let j = 0; j <= 12; j++){
    const dx = -1 + 2*i/12, dy = -1 + 2*j/12;
    if(dx*dx + dy*dy > 0.985) continue;
    const a = f(dx, dy, o), b = arbitre(dx, dy, o);
    if(!a || !b) continue;
    pire = Math.max(pire, chorde(a, b));
  }
  return pire;
}

const nordInverse = (dx, dy, o) => A.latLon(dx, -dy, o);
point("un nord retourné est vu", accord(nordInverse) > 1e-3,
      "> 1 mrad", accord(nordInverse).toExponential(2),
      "LE sabotage qui compte : c'est la faute qu'aucun œil ne rattrape");

const estInverse = (dx, dy, o) => A.latLon(-dx, dy, o);
point("un est retourné est vu", accord(estInverse) > 1e-3,
      "> 1 mrad", accord(estInverse).toExponential(2));

const platCommeUnDisque = (dx, dy, o) => {
  // L'erreur vraisemblable : lire la carte comme si le disque était plat, en
  // proportion du rayon, au lieu de projeter une sphère. Le centre reste juste,
  // et tout le reste glisse — un défaut qui « a l'air de marcher ».
  const rho2 = dx*dx + dy*dy;
  if(rho2 > 1) return null;
  return { lat: o.lat - dy*Math.PI/2, lon: o.lon + dx*Math.PI/2 };
};
point("une carte posée à plat au lieu d'être projetée est vue",
      accord(platCommeUnDisque) > 1e-2, "> 10 mrad", accord(platCommeUnDisque).toExponential(2),
      "elle est juste au centre et fausse partout ailleurs, donc elle passerait "
      + "un contrôle qui ne regarderait qu'un point");

const uvDecale = (lat, lon) => ({ u: A.uv(lat, lon).u + 0.5, v: A.uv(lat, lon).v });
let pireDecale = 0;
for(let i = 0; i <= 10; i++){
  const lat = -1 + 2*i/10;
  pireDecale = Math.max(pireDecale, distanceU(uvDecale(lat, 0.3).u, uvNuanceur(lat, 0.3).u));
}
point("une convention de carte décalée est vue", pireDecale > 1e-6,
      "> 1 µ", pireDecale.toFixed(3),
      "une demi-carte de décalage met l'Afrique dans le Pacifique, et se voit "
      + "à peine sur la Lune");

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
