/* ============================================================================
   L'APPROCHE — ARRIVER OÙ IL N'Y A RIEN, ET TOMBER

       node outil-verif-approche.js

   ---------------------------------------------------------------------------
   CE QU'IL FAUT SURVEILLER ICI, ET QUI N'EST PAS ÉVIDENT

   La scène a deux régimes et le sujet est le PASSAGE de l'un à l'autre. Or les
   deux régimes se surveillent mal pour des raisons opposées :

     · le premier est un silence — huit planètes dans deux pixels, aucun nom. Un
       module mort le produirait aussi bien ;
     · le second est une accumulation — et un module qui nommerait tout, tout le
       temps, la produirait aussi.

   Ce fichier exige donc les deux ensemble, et le mouvement entre eux : rien au
   départ, cinq noms à l'arrivée, et jamais un nom perdu entre les deux.

   ---------------------------------------------------------------------------
   D'OÙ VIENT SA VÉRITÉ — RÈGLE 3

     · DE LA FICHE PUBLIÉE. `contenu.js` affirme au visiteur que le bord interne
       du nuage externe est à 20 000 ua et que le Soleil y brille à magnitude
       −5,3, son disque faisant un dixième de seconde d'arc. Le module doit
       tomber sur les mêmes nombres — sans quoi le site dirait une chose et en
       montrerait une autre. C'est la boucle qu'`outil-verif-solaire.js` a
       ouverte pour les demi-grands axes ; celle-ci la ferme pour la scène.

     · DE LA PHYSIQUE, PAS DU MODULE. Un vol à 1 g qui accélère puis freine
       couvre la MOITIÉ de la distance dans la moitié du temps propre. Cette
       symétrie ne se lit nulle part dans `approche.js` : c'est une conséquence,
       et elle attrape n'importe quelle courbe de confort qu'on glisserait à la
       place. Le rythme régulier a sa symétrie à lui, en décades, et on l'exige
       aussi — sans quoi le réglage du visiteur pourrait être ignoré en silence.

     · DE `recul.js`. La chute et le grand voyage doivent suivre la MÊME loi
       (règle 4). Elle a été sortie dans `RECUL.ou` le 11 août pour ça ; on
       vérifie que les deux trajets s'y accordent au mètre près.

   ---------------------------------------------------------------------------
   ET IL MAÎTRISE L'ÉTAT D'OÙ IL MESURE — RÈGLE 5

   `APPROCHE.etat` est un objet vivant : une mesure prise après une autre lirait
   la position laissée par la précédente. Chaque groupe repose donc la scène, et
   le dernier groupe VÉRIFIE que `range()` remet vraiment tout — un contrôle qui
   ne serait d'accord avec lui-même que joué seul est un contrôle qui ment.
   ============================================================================ */

"use strict";
const fs = require("fs");

const g = {};
for(const f of ["voyage1g.js", "solaire.js", "recul.js", "etiquettes.js", "approche.js"])
  new Function("window", fs.readFileSync(f, "utf8"))(g);
const A = g.APPROCHE, S = g.SOLAIRE, E = g.ETIQUETTES, R = g.RECUL, V = g.VOYAGE;

const FOCALE = 1.55;
const VUE = { W: 1920, H: 1080 };
const AN = 365.25 * 86400;

let echecs = 0, total = 0;
function point(nom, ok, attendu, mesure, note){
  total++; if(!ok) echecs++;
  console.log(`  ${ok ? "✅" : "❌"}  ${nom}`);
  if(attendu !== undefined) console.log(`        attendu ${attendu}   mesuré ${mesure}`);
  if(note) console.log(`        ${note}`);
}
function titre(t){ console.log(`\n  ${t}\n  ${"─".repeat(t.length)}`); }

/* Les noms POSÉS à la distance courante, par le vrai mécanisme d'étiquettes —
   pas par un compte parallèle. Une seconde façon de compter serait une seconde
   loi, et c'est justement ce qu'on refuse partout ailleurs. */
function noms(){
  return E.placements(A.points(VUE.W/2, VUE.H/2, FOCALE, VUE), VUE,
                      { ecartMin: S.ECART_MIN, marge: 8 })
          .filter(p => p.cle !== "soleil").map(p => p.cle);
}

/* Rejouer la chute et rendre la trace, en maîtrisant le point de départ. */
function chute(rythme, pas){
  R.poseRythme(rythme);
  A.pose(A.DEPART_UA);
  A.tombe();
  const trace = [];
  for(let i = 0; i <= pas; i++){
    A.etat.t = 0;                       // on repart du début et l'on saute à t
    A.avance(A.etat.duree * i / pas);
    trace.push({ t: i/pas, dUa: A.etat.dUa, noms: noms().length });
  }
  return trace;
}

console.log("\n  L'APPROCHE DU SYSTÈME SOLAIRE");
console.log("  ═════════════════════════════");

titre("Les deux bouts de la chute");
point("le départ est le bord interne du nuage externe", A.DEPART_UA === 20000,
      "20 000 ua", A.DEPART_UA,
      "Dones, Weissman, Levison & Duncan 2004, p. 376 — relevé dans "
      + "`SOURCES-SOLAIRE.md` §4, et c'est ce que la fiche dit au visiteur");
point("l'arrivée n'est pas écrite : elle se cherche",
      Number.isFinite(A.ARRIVEE_UA) && A.ARRIVEE_UA > 0,
      "un nombre fini", A.ARRIVEE_UA.toFixed(2) + " ua");
point("et elle est bien la frontière du cinquième nom",
      S.nommables(A.ARRIVEE_UA * 0.99, FOCALE, A.H_REF, S.ECART_MIN).length >= A.NOMS_VOULUS &&
      S.nommables(A.ARRIVEE_UA * 1.01, FOCALE, A.H_REF, S.ECART_MIN).length <  A.NOMS_VOULUS,
      A.NOMS_VOULUS + " noms juste avant, moins juste après",
      S.nommables(A.ARRIVEE_UA * 0.99, FOCALE, A.H_REF, S.ECART_MIN).length + " / " +
      S.nommables(A.ARRIVEE_UA * 1.01, FOCALE, A.H_REF, S.ECART_MIN).length);
/* LA CONSIGNE DU CHANTIER, ET ELLE EST CHIFFRÉE. Le tableau d'`A-REGARDER.md`
   supposait un champ plus large : mesuré avec l'optique réelle, un seul nom
   tient à 1 000 ua. Une chute qui s'arrêterait là ne ferait pas une scène. */
point("la chute va bien plus loin que mille unités astronomiques",
      A.ARRIVEE_UA < 1000, "< 1 000 ua", A.ARRIVEE_UA.toFixed(0) + " ua",
      "à 1 000 ua, l'optique réelle du site ne tient qu'UN nom — ce n'est pas "
      + "une scène, c'est un mot posé sur un point");
point("et l'on reste tout de même dehors", A.ARRIVEE_UA > S.demiGrandAxe("Neptune"),
      "> " + S.demiGrandAxe("Neptune").toFixed(2) + " ua (Neptune)",
      A.ARRIVEE_UA.toFixed(0) + " ua",
      "quatre fois l'orbite de Neptune : « le système solaire vu du dehors » "
      + "tient encore");

titre("Ce que le module calcule et ce que la fiche affirme sont le même nombre");
/* La fiche est lue POUR DE VRAI, pas paraphrasée : si quelqu'un change l'un des
   deux sans l'autre, ce contrôle le dit. C'est la boucle qu'`outil-verif-solaire`
   a ouverte pour les demi-grands axes ; ici c'est la scène qu'on referme. */
const fiche = fs.readFileSync("contenu.js", "utf8");
const mFiche = fiche.match(/le Soleil brille à magnitude\s*\n?\s*bolométrique <b>−([\d,]+)<\/b>/);
const mModule = -S.magnitudeSoleil(A.DEPART_UA);
point("la magnitude au départ est celle que la fiche publie",
      !!mFiche && Math.abs(parseFloat(mFiche[1].replace(",", ".")) - mModule) < 0.05,
      mFiche ? "−" + mFiche[1] + " (lu dans contenu.js)" : "INTROUVABLE dans contenu.js",
      "−" + mModule.toFixed(2) + " (calculé par solaire.js)",
      "elle est DÉRIVÉE de la luminosité nominale et du point zéro de l'UAI, "
      + "jamais recopiée — c'est la règle 7");
const arcsecDepart = S.diametreSoleil(A.DEPART_UA) * 180/Math.PI * 3600;
point("et son disque fait bien le dixième de seconde d'arc annoncé",
      fiche.includes("un dixième de seconde") &&
      arcsecDepart > 0.08 && arcsecDepart < 0.12,
      "≈ 0,1″, et la fiche le dit", arcsecDepart.toFixed(3) + "″");
point("l'irradiance à une unité astronomique retombe sur la valeur nominale",
      Math.abs(S.fluxSoleil(1) - 1361) < 1,
      "1 361 W/m² (table de l'UAI, que le module ne porte pas)",
      S.fluxSoleil(1).toFixed(2) + " W/m²",
      "trois constantes indépendantes qui se referment : la luminosité, "
      + "l'unité astronomique, et l'irradiance qu'on n'a écrite nulle part");

titre("Le Soleil ne devient JAMAIS un disque — la doctrine de `lune.js`");
let pireDiam = 0, ouPire = 0;
for(const d of [A.DEPART_UA, 5000, 1000, 500, A.ARRIVEE_UA]){
  A.pose(d);
  const s = A.soleil(FOCALE, VUE);
  if(s.diametrePx > pireDiam){ pireDiam = s.diametrePx; ouPire = d; }
}
point("sur toute la scène, il reste sous le demi-pixel", pireDiam < S.DEMI_PIXEL,
      "< " + S.DEMI_PIXEL + " px", pireDiam.toExponential(2) + " px (à "
      + ouPire.toFixed(0) + " ua)",
      "« sous le demi-pixel on ne dessine rien » — `lune.js:41-54`. Un disque de "
      + "quelques pixels dirait « voilà sa taille », et serait faux d'un facteur "
      + "deux cents");
A.pose(A.ARRIVEE_UA);
const sArr = A.soleil(FOCALE, VUE);
/* Le grossissement est ce que `lune.js` montre À LA PLACE du dessin, et il n'est
   pas un réglage : c'est exactement ce qui manque au disque pour faire un pixel.
   On l'exige donc par sa définition, pas par un nombre attendu — un seuil écrit
   ici deviendrait faux au premier changement d'optique, et il a d'ailleurs été
   faux au premier jet : j'avais demandé ×30 sans mesurer, la réponse est ×14. */
point("et l'on sait dire le grossissement qu'il faudrait",
      sArr.dessinable === false && Math.abs(sArr.grossissement * sArr.diametrePx - 1) < 1e-9,
      "pas dessinable, et grossissement × diamètre = 1 pixel",
      "×" + sArr.grossissement.toFixed(0) + " pour " + sArr.diametrePx.toFixed(4) + " px",
      "c'est ce qui remplace le dessin, mot pour mot comme pour le trou noir de "
      + "masse lunaire : « on ne le verrait même pas »");
point("mais il RAYONNE, et son éclat, lui, se voit",
      sArr.coeurPx === 1 && sArr.haloPx > 0 && Number.isFinite(sArr.magnitude),
      "un cœur d'un pixel et un halo", "cœur " + sArr.coeurPx + " px, halo "
      + sArr.haloPx.toFixed(1) + " px, m = " + sArr.magnitude.toFixed(2),
      "la différence avec `lune.js` est entière : là-bas l'objet est noir, ici "
      + "c'est une étoile. Le cœur fait un pixel plein — sous le pixel, ça "
      + "scintille, et `outil-verif-ciel.js` a payé cette leçon");

titre("Les deux régimes, et le passage entre eux");
const tr = chute("fidele", 40);
point("au départ, aucune planète n'a le droit d'être nommée", tr[0].noms === 0,
      0, tr[0].noms,
      "c'est le fait sur lequel Hugo a tranché le 10 août — et c'est la moitié "
      + "de la scène, pas une lacune");
point("à l'arrivée, elles sont " + A.NOMS_VOULUS, tr[tr.length-1].noms >= A.NOMS_VOULUS,
      "≥ " + A.NOMS_VOULUS, tr[tr.length-1].noms);
let perdus = 0;
for(let i = 1; i < tr.length; i++) if(tr[i].noms < tr[i-1].noms) perdus++;
point("et l'on n'en perd jamais un seul en tombant", perdus === 0, 0, perdus,
      "une scène qui reprendrait un nom en s'approchant serait absurde à l'œil, "
      + "et personne ne saurait dire pourquoi");
const apparitions = tr.filter((p, i) => i > 0 && p.noms > tr[i-1].noms).length;
point("ils apparaissent UN PAR UN, pas d'un coup", apparitions >= 3,
      "≥ 3 apparitions séparées", apparitions,
      "si tous naissaient au même instant, il n'y aurait pas de passage entre "
      + "les deux régimes — il y aurait une coupure, et le passage EST le sujet");
/* Et le silence doit DURER : un régime qui ne tiendrait que trois images ne se
   verrait pas, et l'on aurait écrit tout ça pour rien. */
const partMuette = tr.filter(p => p.noms === 0).length / tr.length;
point("le silence occupe une vraie part de la chute",
      partMuette > 0.25 && partMuette < 0.95,
      "entre un quart et la quasi-totalité", (100*partMuette).toFixed(0) + " %",
      "trop court, il ne se voit pas ; entier, il n'y a pas de scène");

titre("La chute est un vrai vol à 1 g — la vérité vient de la physique");
/* LA SYMÉTRIE DU VOL, ET ELLE N'EST ÉCRITE NULLE PART DANS LE MODULE. Un
   vaisseau qui accélère la moitié du temps puis freine l'autre moitié est à
   mi-distance à mi-temps propre. N'importe quelle courbe de confort glissée à la
   place casserait ça — c'est exactement le remplacement que `recul.js` raconte
   avoir subi une fois. */
const mi = chute("fidele", 2)[1];
point("à mi-temps, on est à mi-DISTANCE",
      Math.abs(mi.dUa - (A.DEPART_UA + A.ARRIVEE_UA)/2) < 1,
      ((A.DEPART_UA + A.ARRIVEE_UA)/2).toFixed(1) + " ua", mi.dUa.toFixed(1) + " ua",
      "signature d'un vol qui accélère puis freine. Une courbe lissée, choisie "
      + "parce qu'elle est jolie, ne tomberait pas là");
const miReg = chute("regulier", 2)[1];
const logMi = Math.pow(10, (Math.log10(A.DEPART_UA) + Math.log10(A.ARRIVEE_UA))/2);
point("et le rythme régulier est bien à mi-DÉCADE",
      Math.abs(miReg.dUa - logMi) / logMi < 1e-6,
      logMi.toFixed(1) + " ua", miReg.dUa.toFixed(1) + " ua",
      "le réglage du visiteur commande vraiment. Sans ce contrôle, la chute "
      + "pourrait l'ignorer en silence");
R.poseRythme("fidele");

/* UNE SEULE LOI POUR LES DEUX TRAJETS — règle 4. On rejoue le MÊME déplacement
   par `RECUL`, dont c'est le métier depuis le début, et l'on exige le même
   chemin. Deux copies d'une loi de mouvement finissent toujours par diverger. */
A.pose(A.DEPART_UA); A.tombe();
const d0m = A.DEPART_UA * S.UA, d1m = A.ARRIVEE_UA * S.UA;
let pireEcartLoi = 0;
for(let i = 0; i <= 20; i++){
  A.etat.t = 0; A.avance(A.etat.duree * i / 20);
  const attendu = R.ou(d0m, d1m, i/20).distance / S.UA;
  pireEcartLoi = Math.max(pireEcartLoi, Math.abs(A.etat.dUa - attendu) / attendu);
}
point("la chute et le grand voyage suivent la même loi",
      pireEcartLoi < 1e-12, "< 1e-12 d'écart relatif", pireEcartLoi.toExponential(1),
      "`RECUL.ou` est le seul endroit du dépôt où cette loi est écrite. Deux "
      + "objets qui décrivent le même mouvement n'en ont qu'une");

const p = A.prix();
point("le prix de la chute est un vrai prix", p && p.tau > 0 && p.tau < p.t,
      "temps du bord < temps du dehors",
      p ? (p.tau/AN).toFixed(2) + " an à bord, " + (p.t/AN).toFixed(2) + " dehors" : "aucun",
      "un an de vol pour tomber du nuage jusqu'aux géantes, et l'écart entre "
      + "les deux horloges est la dilatation, calculée et non décorée");
point("et il porte bien la distance parcourue",
      p && Math.abs(p.d_m - (A.DEPART_UA - A.ARRIVEE_UA)*S.UA) < 1e6,
      ((A.DEPART_UA - A.ARRIVEE_UA)).toFixed(0) + " ua",
      p ? (p.d_m/S.UA).toFixed(0) + " ua" : "aucun");
point("la durée d'écran tient dans ce qu'on regarde",
      A.dureeEcran() > 8 && A.dureeEcran() < 30,
      "entre 8 et 30 s", A.dureeEcran().toFixed(1) + " s",
      "elle sort de `RECUL.duree`, la même règle que le grand trajet : racine du "
      + "nombre de décades, plancher à huit secondes");

titre("Il maîtrise l'état d'où il mesure — règle 5");
A.pose(500);
const avant = A.etat.dUa;
A.tombe(); A.avance(A.etat.duree);
A.range();
point("`range()` remet vraiment tout à zéro",
      A.etat.actif === false && A.etat.chute === false &&
      A.etat.dUa === A.DEPART_UA && A.etat.t === 0,
      "éteint, au départ", JSON.stringify({ actif:A.etat.actif, chute:A.etat.chute,
        dUa:A.etat.dUa, t:A.etat.t }),
      "sans ça, un contrôle joué après un autre lirait la position laissée par "
      + "le précédent, et ne serait d'accord avec lui-même que joué seul");
A.pose(avant);
point("et `pose()` repose exactement où on lui dit", A.etat.dUa === avant,
      avant, A.etat.dUa);
A.avance(10);
point("une scène posée ne tombe pas toute seule", A.etat.dUa === avant,
      avant, A.etat.dUa,
      "`avance` ne doit rien faire tant que la chute n'est pas lancée — sinon "
      + "l'arrivée dans le nuage glisserait sans que personne ne l'ait demandé");

titre("Le dessin — on lui tend un faux contexte et l'on compte");
/* Le même arrangement que `RECUL.dessineQuadrillage` : le contexte arrive, donc
   un contrôle peut en fabriquer un et regarder ce qui a été tracé. Sans ça, tout
   le dessin de cette scène ne serait gardé par personne. */
function fauxCtx(){
  const j = { textes: [], arcs: [], rects: 0, traits: 0, alphas: [] };
  const pile = [];
  const c = {
    globalAlpha: 1, fillStyle: "", strokeStyle: "", lineWidth: 1,
    font: "", textAlign: "", textBaseline: "",
    journal: j,
    save(){ pile.push({ a: c.globalAlpha, f: c.fillStyle, s: c.strokeStyle }); },
    restore(){ const e = pile.pop(); if(e){ c.globalAlpha = e.a; c.fillStyle = e.f; c.strokeStyle = e.s; } },
    beginPath(){}, moveTo(){}, lineTo(){ j.traits++; }, closePath(){},
    fill(){ j.alphas.push(c.globalAlpha); }, stroke(){ j.alphas.push(c.globalAlpha); },
    fillRect(){ j.rects++; },
    arc(x, y, r){ j.arcs.push(r); },
    fillText(t){ j.textes.push(t); j.alphas.push(c.globalAlpha); },
    createRadialGradient(){ return { addColorStop(){} }; },
  };
  return c;
}
const MOTS = { soleil: "Soleil", Mercure: "Mercure", Venus: "Vénus", Terre: "Terre",
               Mars: "Mars", Jupiter: "Jupiter", Saturne: "Saturne",
               Uranus: "Uranus", Neptune: "Neptune" };

A.pose(A.DEPART_UA);
const cD = fauxCtx();
A.dessine(cD, VUE.W/2, VUE.H/2, FOCALE, VUE, 1, MOTS);
point("depuis le nuage, il n'écrit QUE « Soleil »",
      cD.journal.textes.length === 1 && cD.journal.textes[0] === "Soleil",
      "un seul mot", cD.journal.textes.join(", ") || "aucun",
      "c'est la moitié de la scène : un point, et le vide autour");

A.pose(A.ARRIVEE_UA);
const cA = fauxCtx();
A.dessine(cA, VUE.W/2, VUE.H/2, FOCALE, VUE, 1, MOTS);
point("à l'arrivée, six mots et huit anneaux",
      cA.journal.textes.length === A.NOMS_VOULUS + 1 &&
      A.anneaux(FOCALE, VUE).length === 8,
      (A.NOMS_VOULUS + 1) + " mots, 8 anneaux",
      cA.journal.textes.length + " mots (" + cA.journal.textes.join(", ") + "), "
      + A.anneaux(FOCALE, VUE).length + " anneaux");
point("aucun anneau tracé sous le demi-pixel",
      cA.journal.arcs.filter(r => r > 0 && r < S.DEMI_PIXEL).length === 0,
      0, cA.journal.arcs.filter(r => r > 0 && r < S.DEMI_PIXEL).length,
      "un cercle plus petit qu'un pixel dessine une forme qui n'existe pas");

/* LA LEÇON D'`etoiles.js`, ET ELLE EST NOMMÉE DANS LA CONSIGNE. Il écrase
   `globalAlpha` dès sa première étoile : l'appelant qui croyait piloter un fondu
   peint en opaque sans que rien ne le dise. */
const cF = fauxCtx();
cF.globalAlpha = 0.4;
A.dessine(cF, VUE.W/2, VUE.H/2, FOCALE, VUE, 0.25, MOTS);
point("il rend le contexte exactement comme il l'a reçu", cF.globalAlpha === 0.4,
      0.4, cF.globalAlpha,
      "`etoiles.js` écrase l'alpha de l'appelant dès sa première étoile — on ne "
      + "reproduit pas ce motif");
point("et tout ce qu'il peint passe bien par le fondu qu'on lui donne",
      cF.journal.alphas.length > 0 && Math.max(...cF.journal.alphas) <= 0.25 + 1e-9,
      "≤ 0,25", Math.max(...cF.journal.alphas).toFixed(3),
      "sinon la scène apparaîtrait d'un coup au lieu de monter avec le reste");

const cZ = fauxCtx();
A.dessine(cZ, VUE.W/2, VUE.H/2, FOCALE, VUE, 0, MOTS);
point("à fondu nul, il ne trace rien du tout",
      cZ.journal.textes.length === 0 && cZ.journal.arcs.length === 0 && cZ.journal.rects === 0,
      "rien", cZ.journal.arcs.length + " arcs, " + cZ.journal.rects + " voiles");

const cM = fauxCtx();
A.dessine(cM, VUE.W/2, VUE.H/2, FOCALE, VUE, 1, { soleil: "Soleil" });
point("un mot manquant ne devient jamais une clé nue à l'écran",
      cM.journal.textes.length === 1,
      "seulement les mots donnés", cM.journal.textes.join(", "),
      "le module ne résout pas de clé — même règle que `RECUL.poseMots`");

/* --------------------------------------------------------------------------
   ET CET OUTIL SAIT ÉCHOUER — règle 2, en cassant pour de vrai. */
titre("Cet outil sait échouer");
const src = fs.readFileSync("approche.js", "utf8");
function casse(...paires){
  let texte = src;
  for(const [avant, apres] of paires){
    if(!texte.includes(avant))
      throw new Error("le sabotage ne mord plus : " + avant.slice(0, 60));
    texte = texte.replace(avant, apres);
  }
  const v = {};
  for(const f of ["voyage1g.js", "solaire.js", "recul.js", "etiquettes.js"])
    new Function("window", fs.readFileSync(f, "utf8"))(v);
  new Function("window", texte)(v);
  return v;
}
function nomsDe(v, dUa){
  v.APPROCHE.pose(dUa);
  return v.ETIQUETTES.placements(v.APPROCHE.points(VUE.W/2, VUE.H/2, FOCALE, VUE), VUE,
                                 { ecartMin: v.SOLAIRE.ECART_MIN, marge: 8 })
          .filter(x => x.cle !== "soleil").length;
}

const arreteTrop = casse(["const NOMS_VOULUS = 5;", "const NOMS_VOULUS = 1;"]);
point("une chute qui s'arrêterait trop tôt est vue",
      arreteTrop.APPROCHE.ARRIVEE_UA > 1000,
      "> 1 000 ua, donc refusée par le contrôle du haut",
      arreteTrop.APPROCHE.ARRIVEE_UA.toFixed(0) + " ua",
      "c'est exactement le cadrage qu'`A-REGARDER.md` proposait avant qu'on le "
      + "mesure avec la vraie optique");

const soleilGros = casse(["const COEUR_PX = 1;", "const COEUR_PX = 9;"]);
soleilGros.APPROCHE.pose(A.DEPART_UA);
point("un Soleil dessiné plus gros que sa mesure est vu",
      soleilGros.APPROCHE.soleil(FOCALE, VUE).coeurPx !== 1,
      "un cœur qui n'est plus d'un pixel",
      soleilGros.APPROCHE.soleil(FOCALE, VUE).coeurPx + " px");

const partDeTropPres = casse(["const DEPART_UA = 20000;", "const DEPART_UA = 900;"]);
point("un départ trop près — donc un premier régime qui parle déjà — est vu",
      nomsDe(partDeTropPres, partDeTropPres.APPROCHE.DEPART_UA) > 0 ||
      partDeTropPres.APPROCHE.DEPART_UA !== 20000,
      "des noms dès l'arrivée, ou un départ qui n'est plus le nuage",
      "départ " + partDeTropPres.APPROCHE.DEPART_UA + " ua, "
      + nomsDe(partDeTropPres, partDeTropPres.APPROCHE.DEPART_UA) + " nom(s)",
      "arriver là où il y a déjà quelque chose à voir supprime la moitié de la "
      + "scène, celle qu'Hugo a explicitement demandée");

const courbeDeConfort = casse(
  ["const p = R.ou(enMetres(etat.d0), enMetres(etat.d1), etat.t);\n    const u = S() ? p.distance / S().UA : etat.d1;",
   "const u = etat.d0 + (etat.d1 - etat.d0) * etat.t;"]);
courbeDeConfort.RECUL.poseRythme("fidele");
courbeDeConfort.APPROCHE.pose(courbeDeConfort.APPROCHE.DEPART_UA);
courbeDeConfort.APPROCHE.tombe();
courbeDeConfort.APPROCHE.avance(courbeDeConfort.APPROCHE.etat.duree / 2);
const miCassee = courbeDeConfort.APPROCHE.etat.dUa;
/* Une droite passe elle aussi par le milieu à mi-temps : la symétrie seule ne
   l'attrape pas. C'est la comparaison à `RECUL.ou` qui la voit, et c'est
   pourquoi les deux contrôles existent. */
let vuParLaLoi = false;
for(let i = 1; i < 20; i++){
  courbeDeConfort.APPROCHE.etat.t = 0;
  courbeDeConfort.APPROCHE.avance(courbeDeConfort.APPROCHE.etat.duree * i / 20);
  const att = courbeDeConfort.RECUL.ou(d0m, d1m, i/20).distance / S.UA;
  if(Math.abs(courbeDeConfort.APPROCHE.etat.dUa - att)/att > 1e-9) vuParLaLoi = true;
}
point("une courbe de confort à la place du vol est vue", vuParLaLoi,
      "un écart à `RECUL.ou`", vuParLaLoi ? "vu" : "RIEN — l'outil serait aveugle",
      "et PAS par la symétrie : une droite est symétrique aussi, elle passe au "
      + "milieu à mi-temps (" + miCassee.toFixed(0) + " ua). Il fallait les deux");

const voleAlpha = casse(["  ctx.restore();\n  return traces;", "  return traces;"]);
const cV = fauxCtx();
cV.globalAlpha = 0.4;
voleAlpha.APPROCHE.pose(voleAlpha.APPROCHE.ARRIVEE_UA);
voleAlpha.APPROCHE.dessine(cV, VUE.W/2, VUE.H/2, FOCALE, VUE, 0.25, MOTS);
point("un dessin qui vole l'alpha de l'appelant est vu", cV.globalAlpha !== 0.4,
      "l'alpha rendu changé", cV.globalAlpha,
      "c'est le motif d'`etoiles.js`, remis en place exprès");

const bavard = casse(
  ["      const mot = noms[p.cle];\n      if(!mot) continue;                 // pas de clé nue à l'écran, jamais",
   "      const mot = noms[p.cle] || p.cle;"],
  ["{ ecartMin: s.ECART_MIN, marge: 14, decalage: 7 }",
   "{ ecartMin: 0.001, marge: 14, decalage: 7 }"]);
const cB = fauxCtx();
bavard.APPROCHE.pose(bavard.APPROCHE.DEPART_UA);
bavard.APPROCHE.dessine(cB, VUE.W/2, VUE.H/2, FOCALE, VUE, 1, MOTS);
point("une scène qui nommerait tout depuis le nuage est vue",
      cB.journal.textes.length > 1,
      "plus d'un mot au départ", cB.journal.textes.length + " mots",
      "c'est le mensonge exact que toute cette scène existe pour ne pas faire : "
      + "huit étiquettes pointant le même point");

/* ============================================================================
   UNE SCÈNE FERMÉE NE SE PEINT PAS

   DÉFAUT TROUVÉ À L'ŒIL le 14 août, par la vitre AVANT du vaisseau, le jour où
   elle a existé. La page appelle `dessine` dès que la destination est le système
   solaire — donc pendant TOUT le trajet — et le garde d'entrée ne gardait rien,
   `S()` rendant le module `SOLAIRE`, qui est toujours chargé. Le nuage de Oort
   était peint pendant les vingt-sept mille années-lumière du voyage : son voile,
   ses anneaux, et le mot « Soleil » à côté d'une coquille de 1,3 al.

   Il n'était pas VISIBLE, et c'est ce qui l'a fait vivre : le calque ne se
   découpait qu'à la baie, qui regarde en arrière, tandis que la scène se pose
   devant. Peinte et jetée à chaque image, pendant des jours.

   Deux contrôles, et le second n'est pas de la décoration : sans lui, un
   `return 0` posé en tête du dessin ferait passer le premier au vert en ne
   dessinant plus jamais rien.                                                */
{
  const cFerme = fauxCtx();
  A.range();
  const traces = A.dessine(cFerme, VUE.W/2, VUE.H/2, FOCALE, VUE, 1, MOTS);
  const rien = traces === 0 && cFerme.journal.textes.length === 0
               && cFerme.journal.rects === 0 && cFerme.journal.arcs.length === 0;
  point("scène fermée : elle ne peint rien du tout", rien,
        "0 trace, 0 mot, 0 voile, 0 anneau",
        traces + " traces, " + cFerme.journal.textes.length + " mots, "
        + cFerme.journal.rects + " voiles, " + cFerme.journal.arcs.length + " anneaux",
        "sinon le nuage de Oort se peint pendant tout le grand trajet, et la "
        + "première vitre avant le montre — c'est ce qui est arrivé");

  A.pose(A.DEPART_UA);
  const cOuvert = fauxCtx();
  const t2 = A.dessine(cOuvert, VUE.W/2, VUE.H/2, FOCALE, VUE, 1, MOTS);
  point("…et scène ouverte, elle peint bien", t2 > 0 && cOuvert.journal.rects > 0,
        "des traces et son voile", t2 + " traces, " + cOuvert.journal.rects + " voiles",
        "la moitié qui empêche de faire passer le contrôle précédent en ne "
        + "dessinant plus jamais rien");
}

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
