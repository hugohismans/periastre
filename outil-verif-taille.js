/* ============================================================================
   Le cliquet — le bloc de script ne doit plus grossir.

       node outil-verif-taille.js

   ---------------------------------------------------------------------------
   POURQUOI CE CHANTIER NE SE FERAIT JAMAIS SANS LUI

   Le bloc principal d'`index.html` vit en portée globale, avec des `const` non
   hissés. Une variable employée avant sa ligne le tue ENTIÈREMENT, et le
   symptôme est muet : le bloc s'arrête, la moitié du site disparaît, aucun
   message. C'est arrivé deux fois.

   `CHANTIERS.md` annonçait 3 500 lignes. Le 6 août 2026 il en faisait 4 276.
   Personne n'avait décidé qu'il grossirait — il a simplement grossi, parce que
   chaque ajout y était plus rapide qu'ailleurs et que rien ne comptait.

   C'est le défaut classique du chantier structurel : il n'a AUCUN effet
   visible, donc il ne se fera jamais « quand on aura le temps ».

   ---------------------------------------------------------------------------
   UN CLIQUET, PAS UN OBJECTIF

   On n'exige pas de découper aujourd'hui. On exige seulement que ça ne monte
   plus. Chaque sortie de domaine abaisse le plafond, et le plafond ne remonte
   jamais — c'est la même mécanique que les planchers de `contrat.js`, et c'est
   la seule forme qui ne se fait pas contourner : elle ne demande jamais un
   effort qu'on n'a pas le temps de fournir.

   ENTRETIEN : quand l'outil annonce qu'on peut descendre le plafond, on le
   descend. C'est tout ce que ce fichier demande.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

/* Le plafond. Il ne remonte JAMAIS.

   4 310 le 6 août 2026, après la précondition d'entrée des lieux et le réglage
   du ciel. Le point de départ est ce qu'il est : on ne récrit pas l'histoire,
   on l'empêche de continuer.

   Ce chiffre a d'ailleurs été posé à 4 291 au premier jet — une estimation — et
   l'outil a refusé de passer dès sa première exécution. C'est exactement le
   comportement qu'on lui demande, et il l'a prouvé avant même d'être commis. */
const PLAFOND = 4298;   // descendu de 4310 le 7 août 2026 — le cliquet a cliqué

// Le nombre de modules déjà sortis. Il ne descend jamais non plus : un module
// qu'on ferait rentrer dans le bloc serait le contraire exact du chantier.
// Monté de 24 à 26 le 7 août 2026 : `kerrschild.js` et `contrat.js` — l'outil
// l'avait signalé lui-même, c'est le seul entretien qu'il demande.
const MODULES_SORTIS = 26;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

const ici = __dirname;
const page = fs.readFileSync(path.join(ici, "index.html"), "utf8");

/* Les blocs SANS `src` seulement : une balise qui charge un module est
   précisément ce qu'on encourage, et la compter serait absurde. */
const blocs = [];
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
let m;
while((m = re.exec(page)) !== null){
  blocs.push({
    depart: page.slice(0, m.index).split("\n").length,
    lignes: m[1].split("\n").length - 1,
  });
}
blocs.sort((a, b) => b.lignes - a.lignes);

const gros = blocs[0] || { lignes: 0, depart: 0 };
const totalPage = page.split("\n").length;

console.log("\n  LA TAILLE DU BLOC PRINCIPAL — CLIQUET");
console.log("  ════════════════════════════════════");

groupe("Ce qu'on mesure");
console.log("  index.html                " + String(totalPage).padStart(5) + " lignes");
console.log("  blocs <script> sans src   " + String(blocs.length).padStart(5));
console.log("  le plus gros              " + String(gros.lignes).padStart(5)
            + " lignes, à partir de la ligne " + gros.depart);
console.log("  part du fichier           " + String(Math.round(100*gros.lignes/totalPage)).padStart(5) + " %");

groupe("Le cliquet");
ok("le bloc principal n'a pas grossi", gros.lignes <= PLAFOND,
   "≤ " + PLAFOND, gros.lignes,
   gros.lignes > PLAFOND
     ? "il a pris " + (gros.lignes - PLAFOND) + " lignes. Sortir un domaine, ou "
       + "expliquer ici pourquoi le plafond doit monter — et ce sera la première fois."
     : "marge : " + (PLAFOND - gros.lignes) + " lignes");

if(gros.lignes < PLAFOND){
  console.log("\n  ⬇  LE PLAFOND PEUT DESCENDRE : " + PLAFOND + " → " + gros.lignes);
  console.log("     Modifier `PLAFOND` dans ce fichier. C'est le seul entretien qu'il demande.");
}

const modules = fs.readdirSync(ici)
  .filter(f => f.endsWith(".js") && !/^(outil-|tout\.js)/.test(f)).length;
ok("aucun module n'est rentré dans le bloc", modules >= MODULES_SORTIS,
   "≥ " + MODULES_SORTIS + " modules", modules + " modules",
   "un domaine qui repasserait en portée globale est le contraire du chantier");

if(modules > MODULES_SORTIS){
  console.log("\n  ⬆  MODULES_SORTIS PEUT MONTER : " + MODULES_SORTIS + " → " + modules);
}

/* Et un garde-fou sur la mesure elle-même : si la découpe des blocs cesse de
   marcher, l'outil rendrait zéro et passerait au vert en ne mesurant rien. */
groupe("La mesure elle-même tient debout");
ok("on a bien trouvé des blocs de script", blocs.length > 0, "> 0", blocs.length);
ok("et le plus gros n'est pas vide", gros.lignes > 1000, "> 1000 lignes", gros.lignes,
   "un zéro voudrait dire que l'expression de découpe ne mord plus, pas que le "
   + "bloc a disparu — et le contrôle passerait au vert sans rien mesurer");

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
