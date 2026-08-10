/* ============================================================================
   LE SYSTÈME SOLAIRE — ET SA VÉRITÉ VIENT D'AILLEURS QUE DE LUI

       node outil-verif-solaire.js

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL EXISTE

   La fiche « Le système solaire vu du dehors » porte une trentaine de nombres :
   huit demi-grands axes, l'unité astronomique, la luminosité du Soleil, sa
   magnitude, les bornes du nuage de Oort, des tailles apparentes. Chacun est
   relevé à sa source publiée — `SOURCES-SOLAIRE.md` en garde l'adresse et la
   ligne — et c'est exactement ce qui rend la suite dangereuse : un chiffre
   relevé une fois, recopié dans une phrase, ne se relit plus jamais.

   Deux sessions ont buté sur ce sujet faute de réseau. La troisième a relevé.
   La quatrième n'aura pas de réseau non plus, et il faut qu'elle puisse
   vérifier sans en avoir.

   ---------------------------------------------------------------------------
   D'OÙ IL TIRE SA VÉRITÉ — et c'est tout le sujet (règle 3)

   Recopier ici la colonne des demi-grands axes et la comparer à celle de la
   fiche ne prouverait RIEN : deux copies d'accord sur une faute de frappe
   restent deux fautes de frappe. C'est le piège qui s'est déjà refermé deux
   fois sur ce dépôt.

   Alors cet outil ne porte PAS les demi-grands axes. Il porte d'autres
   colonnes, d'autres sources, et il RECONSTRUIT :

     · les TAUX DE LONGITUDE MOYENNE de la même table du JPL — une colonne
       voisine, ajustée séparément — donnent la période de chaque planète ;
     · les PARAMÈTRES DE MASSE de l'éphéméride DE440, qui sont d'une autre page
       et d'un autre article, donnent 𝒢(M☉ + M_planète) ;
     · la troisième loi de Kepler et l'unité astronomique de l'UAI ferment le
       calcul, et rendent un demi-grand axe qui n'a jamais été recopié.

   Il retombe sur la colonne de la fiche à 25 ppm de Mercure à Saturne. Uranus
   et Neptune s'en écartent de 330 et 405 ppm, et ce n'est pas du bruit : leurs
   périodes, 84 et 165 ans, occupent une fraction notable de la fenêtre
   d'ajustement de 250 ans, et le taux ajusté y absorbe les perturbations
   mutuelles. La tolérance est donc large là et serrée ailleurs — un seuil
   unique cacherait une faute de frappe sur Mercure.

   Le reste suit le même principe : la magnitude bolométrique se dérive de la
   luminosité et du point zéro, l'irradiance nominale se dérive de la luminosité
   et de l'unité astronomique, le rayon moyen de Jupiter se dérive de ses deux
   rayons nominaux, les tailles apparentes se dérivent par trigonométrie. Aucun
   de ces nombres n'est ici en double de la fiche.

   ---------------------------------------------------------------------------
   ET IL FERME UNE BOUCLE QUE PERSONNE NE FERMAIT

   `outil-verif-constantes.js` garde l'unité astronomique ÉCRITE DANS LE CODE —
   quatre fichiers la déclarent, et non cinq comme l'annonçait `CHANTIER-P.md` :
   la cinquième ligne citée, `index.html:3877`, déclare le parsec. La fiche,
   elle, l'AFFIRME au visiteur. Rien ne reliait les deux : le site pouvait
   annoncer un nombre et calculer avec un autre. Ce contrôle-là est ici.

   Et la parité : `contrat.js` vérifie que toute clé citée existe, mais pas que
   les deux langues citent LES MÊMES. Un anglophone pouvait lire une fiche
   sourcée autrement que le francophone.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const ici = __dirname;
const lis = f => fs.readFileSync(path.join(ici, f), "utf8");
const charge = f => { const w = {}; new Function("window", lis(f))(w); return w; };

/* ==========================================================================
   1. LA VÉRITÉ, ET ELLE N'EST PAS DANS LA FICHE

   Tout ce bloc est relevé à sa source publiée. Aucune de ces valeurs n'est un
   demi-grand axe, une magnitude ou une taille apparente : ce sont les briques
   d'où l'on reconstruit ce que la fiche affirme.
   ========================================================================== */

// UAI 2012, résolution B2 — 149 597 870 700 m exactement. Une convention.
const UA = 149597870700;
// Exact par la définition du mètre, et le jour et l'année juliens de l'UAI.
const C = 299792458, JOUR = 86400, AN = 365.25, SIECLE = 36525 * JOUR;
const AL = C * AN * JOUR;
const RAD_ARCSEC = 180 * 3600 / Math.PI;

/* UAI 2015, résolution B3 (Prša et al. 2016) — valeurs NOMINALES, exactes par
   définition, et l'article insiste : ce ne sont pas des mesures. */
const L_SOLEIL   = 3.828e26;      // W
const R_SOLEIL   = 6.957e8;       // m
const S_SOLEIL   = 1361;          // W/m² — l'irradiance nominale, de la même table
const R_JUP_EQ   = 7.1492e7;      // m
const R_JUP_POL  = 6.6854e7;      // m
// UAI 2015, résolution B2 : M_bol = 0 vaut exactement cette puissance.
const L_ZERO     = 3.0128e28;     // W

/* NASA/JPL, « Approximate Positions of the Planets », table 1 — la colonne des
   TAUX DE LONGITUDE MOYENNE, en degrés par siècle julien. Pas la colonne des
   demi-grands axes : c'est tout l'intérêt. */
const LDOT = {
  Mercure: 149472.67411175, Venus: 58517.81538729, Terre: 35999.37244981,
  Mars: 19140.30268499, Jupiter: 3034.74612775, Saturne: 1222.49362201,
  Uranus: 428.48202785, Neptune: 218.45945325,
};

/* NASA/JPL, « Astrodynamic Parameters » — masses de l'éphéméride DE440 (Park et
   al. 2021). En km³/s². La ligne « Terre » de la table d'éléments est le
   barycentre Terre-Lune : on ajoute donc la Lune, sinon la reconstruction
   dériverait de 4 ppm pour une raison qui n'est pas une faute de frappe. */
const GM_KM3 = {
  Mercure: 22031.868551, Venus: 324858.592, Terre: 398600.435507 + 4902.800118,
  Mars: 42828.375816, Jupiter: 126712764.1, Saturne: 37940584.8418,
  Uranus: 5794556.4, Neptune: 6836527.10058,
};
const GM_SOLEIL_KM3 = 1.32712440041279419e11;

/* Dones, Weissman, Levison & Duncan 2004 — les bornes du nuage de Oort, en
   unités astronomiques. Ce sont les seules valeurs de ce bloc que l'outil ne
   peut pas dériver : elles sortent d'un modèle, et l'article le dit. Elles sont
   ici pour ce que l'outil PEUT en dériver — les conversions et les rapports que
   la fiche affirme, qui eux se calculent. */
const OORT = { interne: 2000, mitoyen: 20000, externe: 200000,
               spikeBas: 10000, spikeHaut: 100000 };

/* L'ordre des planètes tel que la fiche les récite. */
const ORDRE = ["Mercure", "Venus", "Terre", "Mars", "Jupiter", "Saturne", "Uranus", "Neptune"];

/* ==========================================================================
   2. CE QU'ON RECONSTRUIT
   ========================================================================== */

// Troisième loi de Kepler, sur le taux de longitude moyenne et la masse totale.
function demiGrandAxe(nom){
  const T  = 360 / LDOT[nom] * SIECLE;                 // secondes
  const GM = GM_SOLEIL_KM3 * 1e9 + GM_KM3[nom] * 1e9;  // m³/s²
  return Math.cbrt(GM * T * T / (4 * Math.PI * Math.PI)) / UA;
}
const magBol      = L => -2.5 * Math.log10(L / L_ZERO);
const rayonMoyen  = (re, rp) => Math.cbrt(re * re * rp);
const demiAngle   = (r, dUa) => Math.asin(r / (dUa * UA)) * RAD_ARCSEC;   // ″
const ecartMax    = (aUa, dUa) => Math.asin(aUa / dUa) * RAD_ARCSEC;      // ″

/* Les tolérances par planète. Larges pour Uranus et Neptune, et la raison est
   physique, pas commode : voir l'en-tête. */
const TOLERANCE = { Uranus: 6e-4, Neptune: 6e-4 };
const tol = nom => TOLERANCE[nom] || 5e-5;

/* ==========================================================================
   3. CE QUE LA FICHE DIT — relevé dans le texte, pas dans une copie

   On lit les nombres DANS les phrases publiées. C'est plus fragile qu'un
   tableau, et c'est voulu : ce qui est contrôlé doit être ce que le visiteur
   lit, pas une doublure rangée à côté.
   ========================================================================== */

/* Lire un nombre écrit POUR ÊTRE LU : le français sépare les milliers par une
   espace insécable et décime par la virgule, l'anglais fait exactement
   l'inverse. Une seule fonction pour les deux se tromperait sur « 69,911 km »,
   qui vaut soixante-dix mille d'un côté du site et soixante-dix de l'autre. */
function nb(s, langue){
  let t = String(s).replace(/[\s\u00a0\u202f]/g, "");
  t = langue === "en" ? t.replace(/,/g, "") : t.replace(",", ".");
  return Number(t.replace(/[^0-9.\-e]/gi, ""));
}

function fiche(C){ return (C.fiches || []).find(f => f.id === "f-solaire"); }

// Les huit demi-grands axes, récités au troisième niveau, séparés par « · ».
function axesDits(f, langue){
  const t = (f && f.t && f.t[2]) || "";
  const m = t.match(/(\d+[.,]\d{8})(?:\s|·|\n)+(?:\d+[.,]\d{8}(?:\s|·|\n)+){6}\d+[.,]\d{8}/);
  return m ? m[0].split("·").map(x => nb(x, langue)) : [];
}

// Un nombre repéré par ce qui l'entoure, dans une langue donnée.
function dit(f, niveau, motif, langue){
  const t = (f && f.t && f.t[niveau]) || "";
  const m = t.replace(/<[^>]+>/g, "").match(motif);
  return m ? nb(m[1], langue) : null;
}

/* ==========================================================================
   4. LE HARNAIS
   ========================================================================== */

let echecs = 0, total = 0;
function point(nom, ok, attendu, mesure, note){
  total++; if(!ok) echecs++;
  console.log(`  ${ok ? "✅" : "❌"}  ${nom}`);
  if(attendu !== undefined) console.log(`        attendu ${attendu}   lu ${mesure}`);
  if(note) console.log(`        ${note}`);
}
function titre(t){ console.log(`\n  ${t}\n  ${"─".repeat(t.length)}`); }
const pres = (a, b, r) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a/b - 1) <= r;

const FR = charge("contenu.js").CONTENU;
const EN = charge("contenu.en.js").CONTENU;

console.log("\n  LE SYSTÈME SOLAIRE VU DU DEHORS");
console.log("  ═══════════════════════════════");

/* -------------------------------------------------------------- la fiche est là */
titre("La fiche existe, dans les deux langues");
const fFR = fiche(FR), fEN = fiche(EN);
point("« f-solaire » en français", !!fFR);
point("« f-solaire » en anglais", !!fEN);
point("trois niveaux de chaque côté",
      !!fFR && !!fEN && fFR.t.length === 3 && fEN.t.length === 3,
      3, (fFR ? fFR.t.length : 0) + " / " + (fEN ? fEN.t.length : 0));

/* La parité des clés de sources — `contrat.js` ne la vérifie pas fiche par
   fiche, et un anglophone pouvait donc lire une fiche sourcée autrement. */
const cleF = JSON.stringify((fFR || {}).sources || []);
const cleE = JSON.stringify((fEN || {}).sources || []);
point("les deux langues citent exactement les mêmes sources", cleF === cleE,
      cleF, cleE);

/* -------------------------------------------------- la mesure elle-même tient */
titre("La mesure elle-même tient debout");
const axFR = axesDits(fFR, "fr"), axEN = axesDits(fEN, "en");
point("les huit demi-grands axes se relèvent en français", axFR.length === 8, 8, axFR.length,
      "zéro voudrait dire que l'expression ne mord plus, pas que la fiche est juste — "
      + "et tout ce qui suit passerait au vert à vide");
point("les huit demi-grands axes se relèvent en anglais", axEN.length === 8, 8, axEN.length);

/* ------------------------------------------------ Kepler contre la colonne dite */
titre("Kepler redonne la colonne, sans jamais l'avoir recopiée");
for(let i = 0; i < ORDRE.length; i++){
  const nom = ORDRE[i], a = demiGrandAxe(nom), dite = axFR[i];
  const ok = pres(a, dite, tol(nom));
  point(`${nom} — ${(dite || 0).toFixed(8)} ua`, ok, a.toFixed(8), dite,
        `écart ${dite ? ((a/dite - 1)*1e6).toFixed(1) : "?"} ppm, toléré ${(tol(nom)*1e6).toFixed(0)} ppm`);
}
point("l'anglais récite les mêmes huit nombres",
      axFR.length === 8 && axEN.length === 8 && axFR.every((v, i) => v === axEN[i]),
      axFR.join(" "), axEN.join(" "));

/* ------------------------------------------------------- le Soleil, par définition */
titre("Le Soleil se dérive de ses constantes, pas de la fiche");
const mbol = magBol(L_SOLEIL);
const mbolFR = dit(fFR, 1, /magnitude bolométrique absolue de\s*([\d,]+)/, "fr");
const mbolEN = dit(fEN, 1, /absolute bolometric magnitude of\s*([\d.]+)/, "en");
point("M_bol☉ = −2,5 log(𝓛☉ᴺ / L₀), français", pres(mbol, mbolFR, 1e-3),
      mbol.toFixed(4), mbolFR);
point("M_bol☉, anglais", pres(mbol, mbolEN, 1e-3), mbol.toFixed(4), mbolEN);

const irr = L_SOLEIL / (4 * Math.PI * UA * UA);
point("𝓛☉ᴺ / 4π ua² redonne l'irradiance nominale", pres(irr, S_SOLEIL, 2e-4),
      S_SOLEIL, irr.toFixed(2),
      "trois constantes indépendantes — luminosité, unité astronomique, irradiance — "
      + "qui se referment ; si l'une bougeait, ce point tomberait");
const irrFR = dit(fFR, 2, /4π ua².{0,3}=\s*([\d\s ,]+)\s*W\/m²/);
point("et c'est bien le nombre que la fiche affiche", pres(irr, irrFR, 1e-3),
      irr.toFixed(1), irrFR);

/* ------------------------------------------------------------------ Jupiter */
titre("Jupiter : le rayon moyen se dérive des deux rayons nominaux");
const rJup = rayonMoyen(R_JUP_EQ, R_JUP_POL) / 1000;   // km
const rJupFR = dit(fFR, 2, /vaut\s*([\d\s ]+)\s*km/);
const rJupEN = dit(fEN, 2, /is ([\d, ]+) km/, "en");
point("∛(Rₑ²Rₚ) sur les rayons joviens nominaux, français", pres(rJup, rJupFR, 1e-4),
      rJup.toFixed(0) + " km", rJupFR);
point("le même en anglais", pres(rJup, rJupEN, 1e-4), rJup.toFixed(0) + " km", rJupEN);

const dJup = 2 * demiAngle(rayonMoyen(R_JUP_EQ, R_JUP_POL), OORT.mitoyen) * 1000; // mas
const dSol = 2 * demiAngle(R_SOLEIL, OORT.mitoyen) * 1000;                        // mas
const dJupFR = dit(fFR, 2, /son disque mesure ([\d,]+) milliseconde/, "fr");
const dSolFR = dit(fFR, 2, /et celui du Soleil (\d+)\./, "fr");
point("⌀ Jupiter vu de 20 000 ua", pres(dJup, dJupFR, 5e-3), dJup.toFixed(2) + " mas", dJupFR);
point("⌀ Soleil vu de 20 000 ua",  pres(dSol, dSolFR, 5e-3), dSol.toFixed(1) + " mas", dSolFR);

/* ------------------------------------------------- ce qui tient dans un point */
titre("Ce que la fiche promet sur les écarts angulaires");
const nept = ecartMax(demiGrandAxe("Neptune"), OORT.mitoyen);
const jup  = ecartMax(demiGrandAxe("Jupiter"), OORT.mitoyen);
point("Neptune s'écarte au plus de 5 minutes d'arc", pres(nept / 60, 5, 0.05),
      "5′", (nept/60).toFixed(2) + "′",
      "la fiche l'annonce, et la trigonométrie le dit depuis les demi-grands axes reconstruits");
point("Jupiter reste sous la minute d'arc", jup < 60, "< 60″", jup.toFixed(1) + "″");
point("et le disque du Soleil est cent fois plus petit que l'écart de Jupiter",
      dSol / 1000 < jup / 50, "≪", (dSol/1000).toFixed(3) + "″ contre " + jup.toFixed(1) + "″");

/* ------------------------------------------------------------- le nuage de Oort */
titre("Le nuage de Oort — ce qui s'y dérive");
const alExterne = OORT.externe * UA / AL;
point("200 000 ua font bien « trois années-lumière »", pres(alExterne, 3, 0.1),
      "≈ 3 al", alExterne.toFixed(2) + " al");
const rapport = OORT.interne / demiGrandAxe("Neptune");
point("le nuage commence « soixante fois plus loin » que Neptune",
      rapport > 55 && rapport < 75, "60 à un chiffre près", rapport.toFixed(1) + "×");
const bornesFR = (fFR.t[1] || "").replace(/<[^>]+>/g, "");
for(const [quoi, v] of [["2 000", OORT.interne], ["20 000", OORT.mitoyen],
                        ["200 000", OORT.externe], ["10 000", OORT.spikeBas],
                        ["100 000", OORT.spikeHaut]])
  point(`la borne ${quoi} ua est bien celle de Dones et al.`,
        bornesFR.includes(quoi.replace(/ /g, " ")) || bornesFR.includes(quoi),
        quoi + " ua", v + " ua");

const heures = demiGrandAxe("Neptune") * UA / C / 3600;
point("Neptune est à « quatre heures de lumière »", pres(heures, 4, 0.06),
      "≈ 4 h", heures.toFixed(2) + " h");

/* ------------------------------------------------------- peser contre l'étoile */
titre("Les planètes contre leur étoile");
const somme = Object.values(GM_KM3).reduce((a, b) => a + b, 0);
const inverse = GM_SOLEIL_KM3 / somme;
const inverseFR = dit(fFR, 0, /(\d+)ᵉ du Soleil/, "fr");
point("Σ(𝒢M) des huit systèmes = 1/745 du Soleil", pres(inverse, inverseFR, 2e-3),
      inverse.toFixed(1), inverseFR);
const partJup = GM_KM3.Jupiter / somme;
point("Jupiter en fait « plus des deux tiers »", partJup > 2/3 && partJup < 0.75,
      "entre 2/3 et 3/4", (partJup*100).toFixed(1) + " %");

/* ---------------------------------- la boucle que personne ne fermait : l'UA */
titre("Ce que la fiche AFFIRME et ce que le code CALCULE sont le même nombre");
const uaDite = nb((fFR.t[1] || "").match(/<b>([\d\s ]+) mètres, exactement<\/b>/)[1]);
point("la fiche annonce l'unité astronomique de l'UAI", uaDite === UA, UA, uaDite);
/* `CHANTIER-P.md` annonçait « cinq écrivains » et nommait `index.html:3877`.
   Vérifié : cette ligne-là déclare le PARSEC, pas l'unité astronomique. Ils sont
   quatre. On le compte plutôt que de le croire — une déclaration qui
   disparaîtrait, ou une cinquième qui apparaîtrait sans passer par ici, doit se
   voir. */
const FICHIERS = ["echelle.js", "recul.js", "voyage1g.js", "lune.js", "index.html"];
const ecrivains = [];
for(const f of FICHIERS){
  const motif = /\b(UA|UA_M|UA_KM)\s*=\s*([0-9.e+]+)/g;
  const t = lis(f);
  let m;
  while((m = motif.exec(t)))
    ecrivains.push({ f, v: Number(m[2]) * (/_KM$/.test(m[1]) ? 1000 : 1),
                     ligne: t.slice(0, m.index).split("\n").length });
}
point("on a bien relevé les écrivains de l'unité astronomique", ecrivains.length === 4,
      4, ecrivains.length,
      "zéro voudrait dire que l'expression ne mord plus, pas que le site est d'accord "
      + "avec lui-même — et le point suivant passerait au vert à vide");
for(const e of ecrivains)
  point(`${e.f}:${e.ligne} calcule avec ce que la fiche annonce`, e.v === uaDite,
        uaDite, e.v);

/* ==========================================================================
   5. ET CET OUTIL SAIT ÉCHOUER — règle 2, éprouvée en cassant pour de vrai.

   On n'abîme pas des fichiers : on abîme des copies en mémoire, et l'on exige
   que la plainte sorte. Un contrôle qu'on n'a jamais vu rougir ne prouve rien.
   ========================================================================== */
titre("Cet outil sait échouer");

const clone = o => JSON.parse(JSON.stringify(o));

/* (a) la faute de frappe sur un demi-grand axe — le cas qui a motivé l'outil.

   DEUX chiffres intervertis, pas le dernier : et il faut le dire, parce que
   c'est la limite honnête de ce contrôle. La reconstruction par Kepler retombe
   à 20 ppm près sur les planètes intérieures et à 400 ppm sur Neptune ; elle ne
   peut donc PAS voir une erreur sur le huitième chiffre significatif. Elle voit
   ce qu'une relecture humaine rate : une transposition, un zéro de trop, une
   ligne décalée. Un outil qui prétendrait voir les deux mentirait. */
{
  const f = clone(fFR);
  f.t[2] = f.t[2].replace("5,20288700", "5,02288700");   // 5,2 → 5,0 : transposition
  const ax = axesDits(f, "fr");
  const vu = !pres(demiGrandAxe("Jupiter"), ax[4], tol("Jupiter"));
  point("deux chiffres intervertis sur Jupiter (5,202887 → 5,022887)", vu,
        "signalé", vu ? "signalé" : "RIEN — Kepler serait aveugle",
        "3,5 % : la faute qu'on relit dix fois sans la voir");
}

/* (a bis) et l'aveu de ce qu'il ne voit pas. Ce point n'échouerait que si la
   reconstruction devenait miraculeusement exacte — auquel cas la tolérance
   serait à resserrer, et il faut qu'on l'apprenne. */
{
  const f = clone(fFR);
  f.t[2] = f.t[2].replace("5,20288700", "5,20288100");   // dernier chiffre
  const ax = axesDits(f, "fr");
  const vu = pres(demiGrandAxe("Jupiter"), ax[4], tol("Jupiter"));
  point("le huitième chiffre, lui, passe — et c'est avoué, pas caché", vu,
        "non vu, comme annoncé", vu ? "non vu" : "VU — alors la tolérance est trop large",
        "1,2 ppm contre 19 ppm d'écart résiduel : Kepler ne descend pas là. "
        + "La parité fr/en, elle, l'attrape si une seule des deux langues bouge");
}

// (b) la magnitude du Soleil recopiée de travers
{
  const f = clone(fFR);
  f.t[1] = f.t[1].replace("<b>4,74</b>", "<b>4,83</b>");
  const v = dit(f, 1, /magnitude bolométrique absolue de\s*([\d,]+)/, "fr");
  const vu = !pres(magBol(L_SOLEIL), v, 1e-3);
  point("4,74 remplacé par 4,83 — la magnitude VISUELLE, la confusion facile", vu,
        "signalé", vu ? "signalé" : "RIEN");
}

// (c) l'expression qui cesse de mordre : le piège du vert à vide
{
  const f = clone(fFR);
  f.t[2] = f.t[2].replace(/·/g, ",");
  const vu = axesDits(f, "fr").length !== 8;
  point("les séparateurs disparaissent — la mesure cesse de mordre", vu,
        "signalé", vu ? "signalé" : "RIEN — et tout le reste passerait au vert à vide");
}

// (d) les deux langues qui divergent en silence
{
  const f = clone(fEN);
  f.sources[0] = ["dones2004"];
  const vu = JSON.stringify(fFR.sources) !== JSON.stringify(f.sources);
  point("l'anglais perd une source que le français cite", vu,
        "signalé", vu ? "signalé" : "RIEN — et `contrat.js` ne le verrait pas non plus");
}

// (e) le site qui annonce une unité astronomique et en calcule une autre
{
  const truque = lis("recul.js").replace("const UA_M = 1.495978707e11;",
                                         "const UA_M = 1.49598e11;");
  const m = truque.match(/\b(UA|UA_M|UA_KM)\s*=\s*([0-9.e+]+)/);
  const vu = Number(m[2]) !== uaDite;
  point("un fichier calcule avec une autre unité astronomique que celle affichée", vu,
        "signalé", vu ? "signalé" : "RIEN — c'est la maladie du disque à 622×");
}

// (f) une constante nominale changée : tout le bloc dérivé doit bouger ensemble
{
  const vu = !pres(3.9e26 / (4 * Math.PI * UA * UA), S_SOLEIL, 2e-4);
  point("une luminosité solaire fausse casse le recoupement de l'irradiance", vu,
        "signalé", vu ? "signalé" : "RIEN");
}

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
