/* ============================================================================
   Estampiller les scripts avant de publier.

       node outils/version.mjs

   GitHub Pages sert ses fichiers avec « garde ça dix minutes ». Le navigateur
   obéit — et une correction déployée reste invisible. On recharge, on ne voit
   rien, on conclut que rien n'a été poussé.

   C'est arrivé six fois dans la même journée. À chaque fois j'ai fini par
   télécharger le fichier depuis le serveur pour constater qu'il était le bon,
   et que le problème était entre le serveur et l'œil. Une fois, le cache m'a
   même rendu un « tout va bien » sur une page qui ne contenait pas le module
   que je venais d'écrire : une vérification faussement rassurante, ce qui est
   pire qu'une vérification en échec.

   Une adresse qui change est une adresse que le cache ne connaît pas. Ce script
   réécrit le `?v=` de chaque script local avec le commit courant.

   ---------------------------------------------------------------------------
   POURQUOI PAS UN HORODATAGE

   Parce qu'il changerait à chaque exécution, y compris quand rien n'a bougé, et
   ferait retélécharger tout le site pour rien. Le commit ne change que lorsque
   le code change — c'est exactement la condition qu'on veut.
   ============================================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

/* TOUTES les pages, pas seulement le simulateur.

   Le journal a été publié avec un `journal.js` sans estampille, et GitHub Pages
   l'aurait servi périmé pendant dix minutes — exactement le piège que ce fichier
   existe pour éviter. Une page oubliée ici est une page dont les corrections
   restent invisibles, et l'on conclut qu'elles n'ont pas été poussées. */
const PAGES = ["index.html", "journal.html"];

const v = execSync("git rev-parse --short HEAD", { cwd: racine }).toString().trim();
let total = 0, changees = 0;

for(const nom of PAGES){
  const chemin = join(racine, nom);
  const avant = readFileSync(chemin, "utf8");
  const apres = avant.replace(/\?v=[0-9a-f]{6,12}/g, "?v=" + v);
  const n = (avant.match(/\?v=[0-9a-f]{6,12}/g) || []).length;
  total += n;
  if(apres !== avant){ writeFileSync(chemin, apres); changees++; }
  if(n === 0) console.log("\n  ⚠  " + nom + " ne porte AUCUNE estampille — ses scripts seront mis en cache.");
}

if(!changees){
  console.log("\n  Déjà à la version " + v + " — " + total + " scripts estampillés, rien à faire.\n");
} else {
  console.log("\n  " + total + " scripts estampillés à la version " + v
              + ", sur " + changees + " page(s).\n");
  console.log("  Pense à committer les pages avec le reste.\n");
}
