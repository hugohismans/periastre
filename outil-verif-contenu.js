/* ============================================================================
   Le contrat du contenu, appliqué.

       node outil-verif-contenu.js

   Il refuse une information qui n'a pas son paquet complet : les deux langues,
   sa source, le lien de cette source, ce à quoi elle sert dans les deux langues,
   et — sous cliquet — de quoi aller plus loin.

   Sort en code 1 si quelque chose manque. C'est ce qui fait la différence entre
   une consigne et un contrat.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ici = __dirname;
const charge = f => { const w = {}; new Function("window", fs.readFileSync(path.join(ici, f), "utf8"))(w); return w; };

const faux = {};
new Function("window", fs.readFileSync(path.join(ici, "contrat.js"), "utf8"))(faux);
const FR = charge("contenu.js").CONTENU;
const EN = charge("contenu.en.js").CONTENU;

const b = faux.CONTRAT.controle(FR, EN);

console.log("\n  LE CONTRAT DU CONTENU");
console.log("  ═════════════════════\n");

if(b.durs.length){
  console.log("  ❌ " + b.durs.length + " MANQUEMENT(S) :\n");
  for(const d of b.durs) console.log("     · " + d.ou + "\n       " + d.quoi);
  console.log("");
} else {
  console.log("  ✅ Aucun manquement dur.\n");
}

console.log("  Couverture, sous cliquet — elle ne peut jamais descendre :\n");
for(const d of b.doux){
  const pct = d.total ? Math.round(100*d.valeur/d.total) : 100;
  const etat = d.valeur < d.plancher ? "❌ SOUS LE PLANCHER"
             : d.valeur > d.plancher ? "⬆  on peut relever le plancher à " + d.valeur
             : "✅";
  console.log("     " + etat.padEnd(42) + d.nom);
  console.log("        " + d.valeur + " / " + d.total + "  (" + pct + " %)   plancher " + d.plancher);
}

// Les textes sans source, en clair : ce sont eux le travail qui reste.
const nus = b.doux.find(d => d.liste);
if(nus && nus.liste.length){
  console.log("\n  Textes de plus de 60 signes sans aucune source (" + nus.liste.length + ") :\n");
  for(const l of nus.liste.slice(0, 30)) console.log("     · " + l);
  if(nus.liste.length > 30) console.log("     … et " + (nus.liste.length - 30) + " autres.");
}

console.log("\n  ─────────────────────");
console.log(b.ok ? "  Le contrat est tenu.\n" : "  LE CONTRAT N'EST PAS TENU.\n");
process.exit(b.ok ? 0 : 1);
