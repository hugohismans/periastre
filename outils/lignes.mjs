/* Extrait les répliques de Lumen depuis contenu.js et les sort en JSON.
   On évalue le fichier au lieu de le parser : la source de vérité reste
   contenu.js, et un changement de mise en forme ne casse rien ici.

   Usage :  node outils/lignes.mjs           */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ici = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(ici, "..", "contenu.js"), "utf8");

const fenetre = {};
new Function("window", source)(fenetre);
const C = fenetre.CONTENU;

const lignes = [];
const vus = new Set();

function ajoute(o){
  if(vus.has(o.id)) throw new Error(`id en double : ${o.id}`);
  vus.add(o.id);
  lignes.push({
    id: o.id,
    // les balises en ligne ne séparent pas les mots : les remplacer par une
    // espace donnerait « Lumen , photon »
    dire: (o.dire ?? o.t)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  });
}

function parcours(x){
  if(Array.isArray(x)) x.forEach(parcours);
  else if(x && typeof x === "object"){
    // Une réplique a un `t` (ou `dire`) qui est une CHAÎNE. Une mission porte
    // un id sans texte — le sien est dans `reussi`. Une fiche porte un id et un
    // `t` qui est un tableau de niveaux, et ne se dit pas à voix haute.
    // Dans les deux derniers cas on continue à descendre.
    const dit = typeof x.dire === "string" || typeof x.t === "string";
    if(typeof x.id === "string" && dit) ajoute(x);
    else Object.values(x).forEach(parcours);
  }
}

// On parcourt TOUT le contenu plutôt qu'une liste de sections à tenir à jour :
// l'oubli d'une section rend des répliques muettes sans rien signaler, et
// c'est déjà arrivé deux fois. `sources` est exclu, il n'a pas de `t`.
for(const [cle, valeur] of Object.entries(C)){
  if(cle === "sources" || cle === "voix") continue;
  parcours(valeur);
}

console.log(JSON.stringify({ voix: C.voix, lignes }, null, 1));
