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

   ---------------------------------------------------------------------------
   CE QUI N'EST PAS ESTAMPILLÉ, ET POURQUOI ON LE LAISSE COMME ÇA

   Les MP3 de Lumen. Leur adresse se fabrique dans `parle()`, sans `?v=` : un
   visiteur déjà venu peut donc entendre l'ancienne prise pendant la fenêtre de
   cache. C'est arrivé le 9 août — la réplique du carburant disait encore
   758 000 tonnes après correction du texte.

   On ne l'estampille pas quand même, et c'est un arbitrage assumé : la voix
   pèse sept mégaoctets, l'estampille change à chaque commit, et versionner les
   fichiers audio ferait retélécharger tout ce poids à chaque publication —
   pour réparer une ligne périodiquement fausse pendant dix minutes. Le remède
   coûterait mille fois le mal.

   Si un jour une réplique doit changer sans attendre, la bonne manœuvre est de
   renommer CE fichier-là, pas de versionner les sept mégaoctets.
   ============================================================================ */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

/* TOUTES les pages, et on les DÉCOUVRE.

   Le journal a été publié avec un `journal.js` sans estampille, et GitHub Pages
   l'aurait servi périmé pendant dix minutes — exactement le piège que ce fichier
   existe pour éviter. J'ai alors écrit la liste à la main, ce qui a tenu une
   heure : `lune.html` existait depuis des jours et n'y était pas.

   Une liste tenue à la main est une liste qu'on oublie de tenir. */
const PAGES = readdirSync(racine).filter(f => f.endsWith(".html")).sort();

const v = execSync("git rev-parse --short HEAD", { cwd: racine }).toString().trim();
let total = 0, changees = 0;

for(const nom of PAGES){
  const chemin = join(racine, nom);
  const avant = readFileSync(chemin, "utf8");
  const apres = avant.replace(/\?v=[0-9a-f]{6,12}/g, "?v=" + v);
  const n = (avant.match(/\?v=[0-9a-f]{6,12}/g) || []).length;
  total += n;
  if(apres !== avant){ writeFileSync(chemin, apres); changees++; }
  /* On ne crie que si la page charge VRAIMENT un script local sans estampille.
     `bienvenue.html` et `carnet.html` n'en chargent aucun : les accuser aurait
     appris à ignorer l'avertissement, et il aurait alors cessé de servir le
     jour où il aurait eu raison. */
  /* `vendor/` est exclu, et c'est un choix. Ces fichiers ne changent jamais
     entre deux commits : les estampiller ferait retélécharger trois cents
     kilo-octets de KaTeX à chaque publication, pour rien. Le cache est un
     ennemi quand il sert du périmé, un allié quand il sert de l'immuable. */
  const locaux = (avant.match(/src="(?!https?:)[^"]+\.js[^"]*"/g) || [])
                   .filter(s => s.indexOf("vendor/") < 0);
  const nus = locaux.filter(s => !/\?v=/.test(s));
  if(nus.length)
    console.log("\n  ⚠  " + nom + " charge " + nus.length + " script(s) SANS estampille"
                + " — ils seront servis depuis le cache : " + nus.join(", "));
}

if(!changees){
  console.log("\n  Déjà à la version " + v + " — " + total + " scripts estampillés, rien à faire.\n");
} else {
  console.log("\n  " + total + " scripts estampillés à la version " + v
              + ", sur " + changees + " page(s).\n");
  console.log("  Pense à committer les pages avec le reste.\n");
}
