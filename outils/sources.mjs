/* Produit REFERENCES.md : l'index mécanique de qui cite quoi.

   À ne pas confondre avec SOURCES.md, qui est l'audit — le jugement porté sur
   chaque affirmation après vérification contre les articles. Ce fichier-ci ne
   juge rien : il dit seulement où chaque référence est utilisée, et surtout
   ce qui n'en a aucune.

   Usage :  node outils/sources.mjs           */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ici = dirname(fileURLToPath(import.meta.url));
const racine = join(ici, "..");
const fenetre = {};
new Function("window", readFileSync(join(racine, "contenu.js"), "utf8"))(fenetre);
const C = fenetre.CONTENU;

const usages = new Map();       // clé de source -> [emplacements]
const orphelins = [];           // unités de texte sans aucune source
const NIV = C.niveaux;

const propre = t => (t || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const note = (cle, ou, extrait) => {
  if(!usages.has(cle)) usages.set(cle, []);
  usages.get(cle).push({ ou, extrait });
};

// --- fiches : sources par niveau ---
C.fiches.forEach((f, i) => {
  f.t.forEach((txt, n) => {
    const ou = `Fiche ${i+1} « ${f.titre} » — ${NIV[n]}`;
    const s = (f.sources || [])[n] || [];
    if(!s.length) orphelins.push({ ou, extrait: propre(txt).slice(0, 110) });
    s.forEach(k => note(k, ou, propre(txt).slice(0, 110)));
  });
});

// --- dossier méthode ---
(C.methode || []).forEach((txt, n) => {
  const ou = `Dossier « pourquoi c'est exact » — ${NIV[n]}`;
  const s = (C.methodeSources || [])[n] || [];
  if(!s.length) orphelins.push({ ou, extrait: propre(txt).slice(0, 110) });
  s.forEach(k => note(k, ou, propre(txt).slice(0, 110)));
});

// --- tout le reste : répliques, questions, missions, spectre ---
function parcours(x, chemin){
  if(Array.isArray(x)) return x.forEach((v, i) => parcours(v, `${chemin}[${i}]`));
  if(!x || typeof x !== "object") return;
  if(x.t || x.dire || x.note || x.pourquoi){
    const txt = propre(x.t || x.dire || x.note || x.pourquoi);
    const ou = x.id ? `${chemin} (${x.id})` : chemin;
    const s = x.sources || [];
    if(!s.length && txt.length > 60) orphelins.push({ ou, extrait: txt.slice(0, 110) });
    s.forEach(k => note(k, ou, txt.slice(0, 110)));
  }
  Object.entries(x).forEach(([k, v]) => {
    if(k !== "sources" && typeof v === "object") parcours(v, `${chemin}.${k}`);
  });
}
["reactions", "questions", "missions", "spectre", "accueil", "experiences"]
  .forEach(k => C[k] && parcours(C[k], k));

// --- rédaction ---
const L = [];
L.push("# Références", "");
L.push("Index automatique : où chaque source est utilisée dans le site.");
L.push("Généré par `node outils/sources.mjs` — ne pas modifier à la main.", "");
L.push("Pour le *jugement* porté sur chaque affirmation après vérification,");
L.push("voir [SOURCES.md](SOURCES.md), qui est l'audit et non l'index.", "");
L.push(`${Object.keys(C.sources).length} références, ${usages.size} effectivement citées.`, "");

for(const [cle, meta] of Object.entries(C.sources)){
  const u = usages.get(cle) || [];
  L.push(`## \`${cle}\``, "");
  L.push(meta.ref, "");
  if(meta.doi) L.push(`DOI : [${meta.doi}](https://doi.org/${meta.doi})`, "");
  if(meta.url) L.push(`<${meta.url}>`, "");
  L.push(`**Ce qu'elle étaye :** ${meta.sert}`, "");
  if(!u.length){
    L.push("> ⚠️ Cette référence n'est citée nulle part.", "");
  } else {
    L.push(`**Citée ${u.length} fois :**`, "");
    u.forEach(x => L.push(`- ${x.ou}`, `  > ${x.extrait}…`));
    L.push("");
  }
}

L.push("## Affirmations sans source", "");
if(!orphelins.length){
  L.push("Aucune. Toute unité de texte substantielle porte au moins une référence.", "");
} else {
  L.push(`${orphelins.length} unités de texte n'ont aucune clé de source.`, "");
  orphelins.forEach(o => L.push(`- **${o.ou}**`, `  > ${o.extrait}…`));
  L.push("");
}

writeFileSync(join(racine, "REFERENCES.md"), L.join("\n"), "utf8");
console.log(`REFERENCES.md écrit — ${usages.size}/${Object.keys(C.sources).length} références citées, ${orphelins.length} textes sans source`);
