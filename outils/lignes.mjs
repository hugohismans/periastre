/* Extrait les répliques de Lumen depuis contenu.js et les sort en JSON.
   On évalue le fichier au lieu de le parser : la source de vérité reste
   contenu.js, et un changement de mise en forme ne casse rien ici.

   Usage :  node outils/lignes.mjs           */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/* La langue se passe en argument. Le français garde `contenu.js` — son nom
   d'origine, que trois autres outils connaissent — et les autres langues
   prennent `contenu.<langue>.js`. */
const ici = dirname(fileURLToPath(import.meta.url));
const langue = (process.argv[2] || "fr").toLowerCase();
const fichier = langue === "fr" ? "contenu.js" : `contenu.${langue}.js`;
const source = readFileSync(join(ici, "..", fichier), "utf8");

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

/* On parcourt TOUT le contenu plutôt qu'une liste de sections à tenir à jour :
   l'oubli d'une section rend des répliques muettes sans rien signaler, et
   c'est déjà arrivé deux fois. `sources` est exclu, il n'a pas de `t`.

   CE QUE ÇA RAMASSE EN TROP, ET QU'IL FAUT SAVOIR AVANT DE LANCER `voix.py` :
   les onze compromis (`notes.groupes[].points[]`) portent un `id` et un `t`,
   donc ils comptent comme des répliques — alors que la page ne les DIT jamais,
   elle les pose en badges. Un `voix.py` lancé aujourd'hui fabrique donc vingt-
   six MP3 que rien ne joue, aveux compris. Ils ne sont pas au dépôt : les y
   mettre coûterait un mégaoctet pour du silence, et l'aveu du fond de ciel
   serait de surcroît FAUX en mode simulation, où son texte change.

   Le jour où Lumen dira les aveux — ce serait cohérent avec « le compromis se
   déclare là où on le rencontre » — il faudra une réplique par mode pour
   celui-là, donc des identifiants par mode. C'est la vraie raison de cette
   note : le trou n'est pas dans le ramassage, il est dans le contenu.
   9 août 2026. */
for(const [cle, valeur] of Object.entries(C)){
  if(cle === "sources" || cle === "voix") continue;
  parcours(valeur);
}

console.log(JSON.stringify({ voix: C.voix, lignes }, null, 1));
