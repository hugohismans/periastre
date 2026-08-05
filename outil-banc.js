/* ============================================================================
   Le banc d'essai, hors navigateur.

       node outil-banc.js

   Jusqu'ici, vérifier que le moteur retrouve la sphère des photons demandait
   d'ouvrir une page — donc un navigateur, donc WebGL, `index.html` jetant au
   chargement s'il en manque. Autrement dit : un humain, un écran, une machine
   capable. C'était le dernier verrou de la vérification.

   Depuis que la physique vit dans `physique.js`, les quatre grandeurs se
   contrôlent d'une ligne de commande, partout, y compris dans une intégration
   continue. Personne n'a besoin de regarder.

   ---------------------------------------------------------------------------
   CONTRE QUOI L'ON COMPARE

   Deux choses, et la distinction est le sujet :

     la THÉORIE      1,5 · √27·M · 4M/b · 6M — elle ne bougera jamais
     le MESURÉ PUBLIÉ  la table de README.md, ce que le moteur rendait le jour
                       où elle a été écrite — elle bouge si le moteur change

   La première dit « le calcul est juste ». La seconde dit « le calcul n'a pas
   changé ». Un banc qui ne surveille que la théorie laisse passer une
   régression tant qu'elle reste dans la tolérance ; celui-ci ne la laisse pas.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const faux = {};
new Function("window", fs.readFileSync(path.join(__dirname, "physique.js"), "utf8"))(faux);
const P = faux.PHYSIQUE;

/* La table d'or, recopiée de README.md — les valeurs MESURÉES publiées.
   `tol` est la tolérance sur la non-régression, pas sur la physique. */
const OR = {
  photon:    { publie: 1.500033, tol: 5e-5,  unite: "r_s" },
  ombre:     { publie: 2.598070, tol: 5e-5,  unite: "r_s" },
  deflexion: { publie: 0.002003, tol: 5e-6,  unite: "rad" },
  isco:      { publie: 3.00223,  tol: 5e-4,  unite: "r_s" },
};

const NOMS = {
  photon:    "Sphère des photons",
  ombre:     "Rayon de l'ombre",
  deflexion: "Déflexion à b = 1000",
  isco:      "Dernière orbite stable",
};

let echecs = 0;
const lignes = [];

console.log("\n  LE BANC D'ESSAI, SANS NAVIGATEUR");
console.log("  ────────────────────────────────\n");

for(const r of P.REPERES){
  const or = OR[r.id];
  const t0 = Date.now();
  const v = r.mesure();
  const ms = Date.now() - t0;

  const ecartTheorie = Math.abs(v - r.theorie) / Math.abs(r.theorie);
  const derive       = Math.abs(v - or.publie);
  const ok = derive <= or.tol;
  if(!ok) echecs++;

  lignes.push({ nom: NOMS[r.id], theorie: r.theorie, publie: or.publie,
                mesure: v, ecartTheorie, derive, ok, ms, unite: or.unite });

  console.log("  " + (ok ? "✅" : "❌") + "  " + NOMS[r.id]);
  console.log("        théorie          " + r.theorie.toPrecision(7) + " " + or.unite);
  console.log("        mesuré           " + v.toPrecision(7) + " " + or.unite +
              "   (" + (100*ecartTheorie).toFixed(4) + " % de la théorie)");
  console.log("        publié           " + or.publie + " " + or.unite +
              "   dérive " + derive.toExponential(2) +
              (ok ? "" : "  ← AU-DELÀ DE " + or.tol.toExponential(0)));
  console.log("        calculé en       " + (ms/1000).toFixed(1) + " s\n");
}

/* L'écart sur la déflexion n'est PAS une erreur, et il faut le dire à chaque
   fois : 4M/b n'est que le premier ordre du développement. Le terme suivant
   vaut 15πM²/4b², et c'est exactement le décalage observé — l'intégration est
   donc plus juste que la formule de référence à laquelle on la compare. */
const d = lignes.find(l => l.nom === NOMS.deflexion);
const secondOrdre = 15*Math.PI*P.M*P.M/(4*1000*1000);
const attendu2 = 4*P.M/1000 + secondOrdre;
const colle = Math.abs(d.mesure - attendu2) / attendu2;
const ok2 = colle < 2e-3;
if(!ok2) echecs++;
console.log("  " + (ok2 ? "✅" : "❌") + "  Le second ordre de la déflexion");
console.log("        15πM²/4b²        " + secondOrdre.toExponential(3) + " rad");
console.log("        1er + 2e ordre   " + attendu2.toPrecision(7) + " rad");
console.log("        mesuré           " + d.mesure.toPrecision(7) + " rad   (" +
            (100*colle).toFixed(3) + " % d'écart)");
console.log("        → l'écart au premier ordre n'est pas une erreur du moteur,");
console.log("          c'est le terme qui manque à la formule de référence.\n");

console.log("  ────────────────────────────────");
if(echecs === 0){
  console.log("  " + (lignes.length + 1) + " contrôles tenus. Le moteur n'a pas bougé.\n");
} else {
  console.log("  " + echecs + " ÉCHEC(S). Le moteur rend autre chose qu'avant.\n");
}
process.exit(echecs === 0 ? 0 : 1);
