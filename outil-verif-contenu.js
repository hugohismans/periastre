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

/* ---------------------------------------------------------------------------
   ET CE CONTRAT SAIT-IL REFUSER ?

   Un contrôle qui n'a jamais rougi ne prouve rien. On lui tend donc des contenus
   délibérément abîmés et l'on exige la plainte exacte. Les règles éprouvées ici
   sont celles de `selonMode`, nées le 9 août 2026 avec la bascule cinéma /
   simulation : elles seraient sans cela le seul morceau du contrat que rien
   n'exerce.

   La forme est minimale — deux contenus jumeaux avec un seul compromis — et
   c'est voulu : la plainte cherchée doit venir de la règle visée, pas du bruit. */
let sabotages = 0, ratés = [];
function refuse(nom, motifCherché, abîme){
  const un = (selonMode) => ({
    langue: "fr", sources: {},
    notes: { groupes: [{ points: [ {
      id: "essai", ou: "salon", aveu: "court", t: "un texte long qui dépasse largement les soixante signes exigés ailleurs",
      selonMode,
    } ] }] },
  });
  const bon = { cinema: { aveu:"a", t:"t" }, simulation: { aveu:"b", t:"t" } };
  const { fr, en } = abîme(JSON.parse(JSON.stringify(bon)), JSON.parse(JSON.stringify(bon)));
  const r = faux.CONTRAT.controle(un(fr), un(en));
  const vu = r.durs.some(d => d.quoi.indexOf(motifCherché) >= 0);
  sabotages++;
  if(!vu) ratés.push(nom + " — attendu une plainte contenant « " + motifCherché + " »");
}

refuse("selonMode dans une seule langue", "n'existe que dans une des deux langues",
       (fr, en) => ({ fr, en: undefined }));
refuse("modes différents entre les langues", "diffèrent entre les langues",
       (fr, en) => { delete en.simulation; return { fr, en }; });
refuse("un aveu de mode manquant", "pas d'aveu court",
       (fr, en) => { delete fr.simulation.aveu; return { fr, en }; });
refuse("un aveu de mode trop long", "ne se pose plus sur place",
       (fr, en) => { fr.cinema.aveu = "x".repeat(201); return { fr, en }; });
refuse("un texte long de mode manquant", "pas de texte long",
       (fr, en) => { delete en.cinema.t; return { fr, en }; });

console.log("\n  Et ce contrat sait refuser :\n");
if(ratés.length){
  console.log("     ❌ " + ratés.length + " règle(s) sur " + sabotages + " n'ont pas rougi :\n");
  for(const r of ratés) console.log("        · " + r);
} else {
  console.log("     ✅ " + sabotages + " contenus abîmés, " + sabotages + " refus.");
}

console.log("\n  ─────────────────────");
const tenu = b.ok && !ratés.length;
console.log(tenu ? "  Le contrat est tenu.\n" : "  LE CONTRAT N'EST PAS TENU.\n");
process.exit(tenu ? 0 : 1);
