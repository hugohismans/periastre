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
const page = join(racine, "index.html");

const v = execSync("git rev-parse --short HEAD", { cwd: racine }).toString().trim();
const avant = readFileSync(page, "utf8");
const apres = avant.replace(/\?v=[0-9a-f]{6,12}/g, "?v=" + v);

const n = (avant.match(/\?v=[0-9a-f]{6,12}/g) || []).length;
if(apres === avant){
  console.log("\n  Déjà à la version " + v + " — " + n + " scripts estampillés, rien à faire.\n");
} else {
  writeFileSync(page, apres);
  console.log("\n  " + n + " scripts estampillés à la version " + v + ".\n");
  console.log("  Pense à committer `index.html` avec le reste.\n");
}
