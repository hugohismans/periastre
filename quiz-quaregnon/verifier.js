/* ============================================================================
   TOUT VÉRIFIER — une commande, un verdict.

       node verifier.js

   Pour ne pas avoir à connaître la liste des outils. Il les trouve tout seul :
   n'importe quel fichier nommé `outil-verif-*.js` est joué. Un outil ajouté
   demain sera joué demain sans que personne y pense.
   ============================================================================ */

"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ici = __dirname;
const C = { gras: "\x1b[1m", vert: "\x1b[32m", rouge: "\x1b[31m",
            gris: "\x1b[90m", zero: "\x1b[0m" };

const outils = fs.readdirSync(ici)
  .filter(function (f) { return /^outil-verif-.*\.js$/.test(f); })
  .sort();

if (!outils.length) {
  console.log("Aucun outil de contrôle trouvé. C'est suspect.");
  process.exit(1);
}

console.log(C.gras + "\nLe Quiz de Quaregnon — " + outils.length
  + " outils de contrôle\n" + C.zero);

let tombes = 0;
const rapports = [];

outils.forEach(function (outil) {
  const r = spawnSync(process.execPath, [path.join(ici, outil)],
    { encoding: "utf8", cwd: ici });
  const sortie = (r.stdout || "") + (r.stderr || "");
  const bilan = (sortie.match(/(\d+) contrôles, (\d+) échec/) || []);
  const ok = r.status === 0;
  if (!ok) tombes++;

  console.log("  " + (ok ? C.vert + "✓" : C.rouge + "✗") + C.zero + "  "
    + outil.replace(/^outil-verif-|\.js$/g, "").padEnd(10)
    + C.gris + (bilan[1] ? bilan[1] + " contrôles, " + bilan[2] + " échec"
                           + (Number(bilan[2]) > 1 ? "s" : "")
                         : "n'a pas rendu de bilan") + C.zero);

  if (!ok) rapports.push({ outil: outil, sortie: sortie });
});

/* Ce que les outils ne couvrent pas — le dire, plutôt que laisser croire. */
console.log("\n" + C.gris
  + "  Non couvert ici : l'affichage réel dans un navigateur, et le fait que\n"
  + "  Firebase se comporte comme le salon le suppose. Le premier se regarde,\n"
  + "  le second se prouve par une vraie partie à deux téléphones." + C.zero);

if (rapports.length) {
  console.log("\n" + C.rouge + C.gras + "Le détail de ce qui a échoué :" + C.zero);
  rapports.forEach(function (r) {
    console.log("\n" + C.gras + "── " + r.outil + C.zero);
    r.sortie.split("\n")
      .filter(function (l) { return /ÉCHEC|^ {9}/.test(l); })
      .forEach(function (l) { console.log(l); });
  });
}

console.log("");
console.log(tombes
  ? C.rouge + C.gras + tombes + " outil" + (tombes > 1 ? "s" : "")
    + " en échec." + C.zero
  : C.vert + C.gras + "Tout va bien." + C.zero);
console.log("");

process.exit(tombes ? 1 : 0);
