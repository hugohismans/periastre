/* ============================================================================
   LA RÉSOLUTION ADAPTATIVE, ÉPROUVÉE SANS NAVIGATEUR.

       node outil-verif-resolution.js

   `VERIF.resolution()` existait déjà, mais il fallait un navigateur pour le
   jouer : la décision vivait au cœur de la boucle de rendu. C'est pourtant de
   l'arithmétique pure, et c'est elle qui décide si le site est fluide ou net
   sur le téléphone de quelqu'un.

   ---------------------------------------------------------------------------
   CE QU'ON PROTÈGE

   Le 7 août, Hugo est tombé à deux images par seconde sans savoir pourquoi.
   La cause était ailleurs — une rotation restée dans ses réglages — mais elle a
   montré ce qui manquait : rien ne disait, hors navigateur, que l'échelle de
   rendu réagissait comme elle doit.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ

   De la propriété, pas du code. On ne relit pas les seuils : on exige les
   comportements qui les justifient — descendre vite, remonter lentement, ne
   jamais osciller, ne jamais sortir de l'échelle.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const w = {};
new Function("window", fs.readFileSync(path.join(__dirname, "resolution.js"), "utf8"))(w);
const R = w.RESOLUTION;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

console.log("\n  LA RÉSOLUTION ADAPTATIVE");
console.log("  ════════════════════════");

const P = R.PALIERS;

// ═══════════════════════════════════════════ 1. l'échelle elle-même
groupe("L'échelle des paliers tient debout");
{
  ok("elle commence au piqué", P[0] === 1.0, 1.0, P[0]);
  ok("elle est strictement décroissante",
     P.every((v, i) => i === 0 || v < P[i-1]), "décroissante", P.join(" > "));
  ok("elle a de la profondeur", P.length >= 4, "≥ 4 crans", P.length,
     "il n'y en avait que deux — net ou flou — ce qui laissait un appareil trop "
     + "lent pour le second sans nulle part où aller");
  const aire = P[P.length-1]*P[P.length-1];
  ok("le dernier cran divise l'aire par plus de six", 1/aire > 6,
     "> 6", (1/aire).toFixed(1) + " fois moins de pixels",
     "c'est le levier réel : le temps d'image suit l'aire du tampon");
}

// ═══════════════════════════════════ 2. descendre vite, remonter lentement
/* L'asymétrie est la seule chose qui empêche l'image de sauter à chaque tour
   d'orbite : au périastre l'astre emplit le champ et coûte plus cher qu'à
   l'apoastre. Une politique symétrique traverserait le seuil une fois par
   révolution, et l'on verrait l'image basculer en rythme. */
groupe("On descend vite et l'on remonte lentement");
{
  const lent = R.decide(40, 1.0, 100000, 0);
  ok("une image lente fait descendre d'un cran tout de suite",
     lent.echelle === P[1], P[1], lent.echelle);

  const vite = R.decide(5, P[1], 100000, 99000);   // calme depuis 1 s seulement
  ok("une image rapide ne fait PAS remonter tout de suite",
     vite.echelle === P[1], P[1] + " (inchangé)", vite.echelle,
     "sans cette patience, l'image basculerait une fois par tour d'orbite");

  const patient = R.decide(5, P[1], 100000, 100000 - R.PATIENCE - 1);
  ok("mais elle remonte après la patience", patient.echelle === P[0], P[0], patient.echelle);

  ok("la patience est d'au moins vingt secondes", R.PATIENCE >= 20000,
     "≥ 20 000 ms", R.PATIENCE);
}

// ═══════════════════════════════════ 3. toute lenteur repousse le retour
groupe("Toute lenteur, même passagère, repousse le retour au piqué");
{
  const tiede = R.decide(20, P[1], 500000, 0);   // entre les deux seuils
  ok("une image tiède ne change pas l'échelle", tiede.echelle === P[1], P[1], tiede.echelle);
  ok("mais elle réarme l'attente", tiede.tCalme === 500000, 500000, tiede.tCalme,
     "sinon trente secondes de tiédeur suffiraient à regagner un cran qu'on ne "
     + "tiendra pas");
  const calme = R.decide(3, P[1], 500000, 0);
  ok("une image franchement rapide, elle, remonte", calme.echelle === P[0], P[0], calme.echelle);
}

// ═══════════════════════════════════════════ 4. jamais hors de l'échelle
groupe("On ne sort jamais de l'échelle");
{
  const bas = R.decide(999, P[P.length-1], 100000, 0);
  ok("au dernier cran, on ne descend plus", bas.echelle === P[P.length-1],
     P[P.length-1], bas.echelle);
  const haut = R.decide(1, P[0], 1e9, 0);
  ok("au piqué, on ne remonte plus", haut.echelle === P[0], P[0], haut.echelle);
  const inconnu = R.decide(40, 0.5, 100000, 0);   // 0,5 n'est pas un palier
  ok("une échelle qui n'est pas un palier ne bouge pas", inconnu.echelle === 0.5,
     0.5, inconnu.echelle,
     "sinon une valeur venue d'ailleurs sauterait au hasard dans l'échelle");
  const nan = R.decide(NaN, P[1], 100000, 0);
  ok("une mesure absente ne fait rien", nan.echelle === P[1], P[1], nan.echelle,
     "la première fenêtre après un changement d'onglet peut rendre n'importe quoi");
}

// ═══════════════════════════ 5. la descente converge, elle n'oscille pas
/* On simule un appareil trop lent d'un facteur constant, et l'on exige que
   l'échelle se stabilise. Une politique mal réglée descendrait, remonterait,
   redescendrait — et l'image sauterait indéfiniment. */
groupe("Sur un appareil lent, l'échelle se stabilise");
{
  let e = P[0], t = 0, now = 0;
  const suite = [];
  for(let k = 0; k < 40; k++){
    now += 1500;
    // le temps d'image suit l'aire : plus l'échelle est basse, plus c'est rapide
    const moy = 34 * (e*e) / (P[0]*P[0]);
    const r = R.decide(moy, e, now, t);
    e = r.echelle; t = r.tCalme;
    suite.push(e);
  }
  const fin = suite.slice(-12);
  ok("elle ne bouge plus sur les douze dernières fenêtres",
     fin.every(v => v === fin[0]), "constante", [...new Set(fin)].join(", "),
     "une politique qui oscille fait sauter l'image indéfiniment, et c'est pire "
     + "qu'une image durablement floue");
  ok("et elle s'est bien arrêtée sous le piqué", fin[0] < P[0], "< 1.0", fin[0]);
}

// ═══════════════════════════════════════════ 6. cet outil sait échouer
groupe("Cet outil sait échouer");
{
  const casse = fs.readFileSync(path.join(__dirname, "resolution.js"), "utf8")
                  .replace("const PATIENCE = 30000;", "const PATIENCE = 0;");
  const g = {}; new Function("window", casse)(g);
  const r = g.RESOLUTION.decide(5, g.RESOLUTION.PALIERS[1], 100000, 99000);
  ok("une patience supprimée est vue", r.echelle === g.RESOLUTION.PALIERS[0],
     "le module cassé remonte immédiatement", r.echelle,
     "si ce point échouait, le groupe de l'asymétrie ne prouverait rien");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
