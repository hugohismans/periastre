/* ============================================================================
   L'ARRIVÉE DIT-ELLE OÙ L'ON EST ARRIVÉ ?

       node outil-verif-arrivee.js

   ---------------------------------------------------------------------------
   LE DÉFAUT QUI L'A FAIT NAÎTRE — 10 août 2026

   `d.id` existait depuis le premier jour de la table des destinations, et il
   n'était lu NULLE PART. Conséquence, en ligne pendant vingt-quatre heures :

     · on partait vingt-sept mille années-lumière pour le système solaire ;
     · on arrivait devant les dix orbites du CENTRE GALACTIQUE, dessinées à la
       même taille apparente qu'à l'arrivée aux étoiles S — `ETOILES_S.cadre`
       pose `échelle = arrivée / distance`, donc la carte atteint la taille un à
       l'arrivée quelle que soit la distance, et 8 277 parsecs sont sept millions
       de fois 10 000 unités astronomiques ;
     · et le pied du panneau écrivait « le trou noir est là, au centre, et vous
       ne le voyez pas », après un trajet passé à s'en éloigner.

   Ce n'était pas une fonctionnalité manquante. C'était faux à l'écran, et rien
   ne pouvait le dire : aucun contrôle ne reliait la table des destinations aux
   textes qui les décrivent.

   ---------------------------------------------------------------------------
   D'OÙ CET OUTIL TIRE SA VÉRITÉ — la règle 3, et elle mord ici

   Il ne lit PAS le code de rendu pour lui demander s'il fait bien son travail :
   un contrôle qui interroge ce qu'il surveille se met d'accord avec lui.

   Il part de la TABLE DES DESTINATIONS, qui est la seule liste de ce qu'on peut
   atteindre, et il exige que pour chaque entrée existent — ailleurs, dans des
   fichiers qu'elle ne contrôle pas :

     · un pied de panneau `tele.arrive.pied.<id>`, dans les DEUX langues ;
     · un lieu d'aveu `arrivee-<id>`, dans les DEUX listes de lieux — celle de
       `contrat.js` et sa recopie de `aveu.js` ;
     · la déclaration `carte:` — la carte des étoiles S parle-t-elle de cette
       arrivée, oui ou non.

   Et réciproquement : un pied ou un lieu qui ne correspond à aucune destination
   est un orphelin, donc un texte que personne ne verra jamais.

   C'est la même forme que le défaut d'origine, prise par l'autre bout : là-bas
   une destination sans texte propre, ici un texte sans destination.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS, ET IL FAUT LE SAVOIR

   Il ne prouve pas que le dessin obéit à `carte`. Ça se voit dans la page —
   `VERIF.arriveeJuste()` s'en charge, avec des pixels. Ici on garde le CONTRAT :
   toute destination déclare son cas, et tous ses textes existent dans les deux
   langues. Un contrat tenu ne garantit pas le rendu ; un contrat rompu garantit
   qu'il est faux.
   ============================================================================ */

"use strict";
const fs = require("fs");

const page   = fs.readFileSync("index.html", "utf8");
const fr     = fs.readFileSync("ui.fr.js", "utf8");
const en     = fs.readFileSync("ui.en.js", "utf8");
const contrat = fs.readFileSync("contrat.js", "utf8");
const aveu    = fs.readFileSync("aveu.js", "utf8");

let echecs = 0, total = 0;
function point(nom, ok, attendu, mesure, note){
  total++;
  if(!ok) echecs++;
  console.log(`  ${ok ? "✅" : "❌"}  ${nom}`);
  if(attendu !== undefined) console.log(`        attendu ${attendu}   mesuré ${mesure}`);
  if(note) console.log(`        ${note}`);
}
function titre(t){ console.log(`\n  ${t}\n  ${"─".repeat(t.length)}`); }

/* --------------------------------------------------------------------------
   LIRE LA TABLE DES DESTINATIONS

   On la découpe au texte plutôt que d'exécuter la page : `index.html` est un
   document, pas un module, et l'exécuter demanderait un navigateur entier. La
   découpe est étroite exprès — elle s'arrête au premier `];` — et le contrôle
   « on a bien trouvé des destinations » plus bas refuse qu'elle rende zéro. Une
   expression qui cesserait de mordre passerait sinon au vert sans rien mesurer,
   ce qui est le piège classique de ce genre d'outil. */
function destinations(src){
  const i = src.indexOf("const DESTINATIONS = [");
  if(i < 0) return null;
  const j = src.indexOf("\n];", i);
  if(j < 0) return null;
  const bloc = src.slice(i, j);
  const out = [];
  // Chaque entrée commence par `{ id:"…"`. On repart de là pour lire ce qui
  // suit jusqu'à l'accolade fermante de la même entrée.
  const re = /\{\s*id\s*:\s*"([a-z0-9-]+)"([\s\S]*?)\}/g;
  let m;
  while((m = re.exec(bloc))){
    const carte = /\bcarte\s*:\s*(true|false)\b/.exec(m[2]);
    out.push({ id: m[1], carte: carte ? carte[1] : null });
  }
  return out;
}

// Les lieux d'aveu, lus dans chacune des deux listes. Elles sont recopiées l'une
// de l'autre — c'est une dette assumée, et `outil-verif-aveu.js` exige déjà
// qu'elles soient identiques. Ici on ne les compare pas entre elles : on demande
// à chacune, séparément, de porter le lieu de chaque destination.
function lieux(src, nom){
  const i = src.indexOf(nom);
  if(i < 0) return [];
  const j = src.indexOf("]);", i);
  return (src.slice(i, j).match(/"([a-z-]+)"/g) || []).map(s => s.slice(1, -1));
}

function cle(src, k){
  return src.includes(`"${k}":`);
}

/* --------------------------------------------------------------------------
   LE CONTRÔLE */
function controle(page, fr, en, contrat, aveu){
  const dest = destinations(page);
  const lc = lieux(contrat, "const LIEUX_COMPROMIS = new Set([");
  const la = lieux(aveu, "const LIEUX = new Set([");
  const manque = [];

  if(!dest || !dest.length) return { dest: dest || [], manque: ["aucune destination lue"] };

  for(const d of dest){
    if(d.carte === null) manque.push(`${d.id} ne dit pas si la carte des étoiles la concerne`);
    for(const [src, langue] of [[fr, "fr"], [en, "en"]])
      if(!cle(src, `tele.arrive.pied.${d.id}`))
        manque.push(`${d.id} n'a pas de pied de panneau en ${langue}`);
    if(!lc.includes(`arrivee-${d.id}`)) manque.push(`arrivee-${d.id} manque à contrat.js`);
    if(!la.includes(`arrivee-${d.id}`)) manque.push(`arrivee-${d.id} manque à aveu.js`);
  }

  // L'autre bout : un texte ou un lieu que plus aucune destination ne réclame.
  const ids = new Set(dest.map(d => d.id));
  for(const src of [fr, en])
    for(const m of src.matchAll(/"tele\.arrive\.pied\.([a-z0-9-]+)"/g))
      if(!ids.has(m[1])) manque.push(`le pied ${m[1]} ne va avec aucune destination`);
  for(const l of lc)
    if(l.startsWith("arrivee-") && !ids.has(l.slice(8)))
      manque.push(`le lieu ${l} ne va avec aucune destination`);

  return { dest, manque };
}

console.log("\n  L'ARRIVÉE DIT-ELLE OÙ L'ON EST ARRIVÉ ?");
console.log("  ═══════════════════════════════════════");

const r = controle(page, fr, en, contrat, aveu);

titre("La mesure elle-même tient debout");
point("on a bien lu des destinations", r.dest.length > 0,
      "> 0", r.dest.length,
      "un zéro voudrait dire que la découpe ne mord plus, pas qu'il n'y a plus de "
      + "destination — et tout le reste passerait au vert sans rien mesurer");

titre("Chaque destination porte son arrivée");
for(const d of r.dest){
  const siennes = r.manque.filter(m => m.startsWith(d.id) || m.includes(`arrivee-${d.id}`));
  point(`« ${d.id} » — pied dans les deux langues, lieu dans les deux listes, carte déclarée`,
        siennes.length === 0,
        "rien ne manque", siennes.length ? siennes.join(" · ") : "rien ne manque",
        d.carte === "true" ? "la carte des étoiles S parle de cette arrivée"
                           : "la carte des étoiles S ne parle pas de cette arrivée");
}

titre("Et rien ne traîne à l'autre bout");
const orphelins = r.manque.filter(m => m.startsWith("le "));
point("aucun texte ni lieu d'arrivée sans destination", orphelins.length === 0,
      0, orphelins.length ? orphelins.join(" · ") : 0,
      "un pied qu'aucune destination ne réclame est un texte que personne ne lira");

/* --------------------------------------------------------------------------
   ET CET OUTIL SAIT ÉCHOUER — règle 2.

   On lui tend des sources abîmées et l'on exige la plainte EXACTE. Sans ça il
   resterait vert le jour où sa découpe cesserait de mordre, et un outil qui ne
   sait pas refuser ne contrôle rien. */
titre("Cet outil sait échouer");

const sabotages = [
  ["une destination sans pied en anglais",
   p => p, f => f, e => e.replace('"tele.arrive.pied.soleil":', '"tele.arrive.pied.zzz":'),
   c => c, a => a, "soleil n'a pas de pied de panneau en en"],

  ["une destination sans lieu d'aveu",
   p => p, f => f, e => e,
   c => c.replace('"arrivee-soleil", ', ""), a => a, "arrivee-soleil manque à contrat.js"],

  ["une destination qui ne dit pas si la carte la concerne",
   p => p.replace(", prix:true, carte:false", ", prix:true"), f => f, e => e,
   c => c, a => a, "soleil ne dit pas si la carte des étoiles la concerne"],

  ["un pied qui ne va avec aucune destination",
   p => p, f => f + '\n  "tele.arrive.pied.fantome": "x",', e => e,
   c => c, a => a, "le pied fantome ne va avec aucune destination"],
];

for(const [nom, fp, ff, fe, fc, fa, attendu] of sabotages){
  const s = controle(fp(page), ff(fr), fe(en), fc(contrat), fa(aveu));
  const vu = s.manque.includes(attendu);
  point(nom, vu, `« ${attendu} » signalé`, vu ? "signalé" : s.manque.join(" · ") || "rien");
}

// Le sabotage qui compte le plus : celui de la mesure elle-même.
const aveugle = controle(page.replace("const DESTINATIONS = [", "const AUTRE_CHOSE = ["), fr, en, contrat, aveu);
point("une table de destinations introuvable est vue",
      aveugle.manque.includes("aucune destination lue"),
      "« aucune destination lue »",
      aveugle.manque.includes("aucune destination lue") ? "signalé" : "RIEN — l'outil serait aveugle",
      "sans ce point, renommer la table rendrait l'outil muet et vert");

console.log("");
if(echecs){
  console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`);
  process.exit(1);
}
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
