#!/usr/bin/env node
/* ============================================================================
   LE HOOK QUI REFUSE L'ARRÊT TANT QUE LE CHANTIER N'EST PAS FINI.

   Hugo, 8 août 2026 : « tu dis "je continue" et puis c'est la fin de ton tour,
   donc tu ne continues pas. »

   C'est exact, et ce n'est pas une distraction : un tour se termine quand je
   cesse d'appeler des outils. Dire « je continue » ne relance rien — il faut
   quelque chose d'extérieur qui refuse la fin. C'est ce que fait ce script,
   branché sur l'événement `Stop` dans `.claude/settings.json`.

   ---------------------------------------------------------------------------
   LES TROIS FAÇONS DONT UNE CONTINUATION FORCÉE PART EN VRILLE

   1. **La boucle infinie.** Si l'on bloque sans regarder `stop_hook_active`,
      on rebloque la continuation qu'on vient de déclencher, indéfiniment. Ce
      drapeau vaut `true` quand on est DÉJÀ en continuation forcée : on sort
      immédiatement.

   2. **La condition qui ne peut pas devenir vraie.** Un blocage adossé à rien
      ne se termine jamais. Celui-ci lit `CHANTIER-F2.md` et ne bloque que s'il
      reste une case `- [ ]`. Cocher une case est un geste réel, qui rapproche
      la fin.

   3. **Le travail qui doit s'arrêter pour de bon.** Il arrive qu'une décision
      revienne à Hugo, ou que quelque chose soit cassé. Écrire `## ARRÊT` en
      tête d'une ligne du fichier suspend le hook — c'est la porte de sortie, et
      elle est dans le même fichier que la liste, donc impossible à oublier.

   Un quatrième garde-fou existe hors de ce script : Claude Code coupe la boucle
   au bout de huit blocages consécutifs sur le même tour.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const LISTE = path.join(__dirname, "..", "CHANTIER-F2.md");

let entree = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", c => entree += c);
process.stdin.on("end", () => {
  let data = {};
  try { data = JSON.parse(entree || "{}"); } catch(e){ /* pas de JSON : on ne bloque pas */ }

  // 1. déjà en continuation forcée : on laisse finir, sinon c'est sans fin.
  if(data.stop_hook_active) return process.exit(0);

  let texte = "";
  try { texte = fs.readFileSync(LISTE, "utf8"); }
  catch(e){ return process.exit(0); }        // pas de liste : pas de chantier

  // 3. la porte de sortie, lue avant tout le reste.
  if(/^##\s*ARRÊT/m.test(texte)){
    const quoi = (texte.match(/^##\s*ARRÊT.*$/m) || [""])[0];
    console.error("  ⏸  " + quoi.replace(/^##\s*/, ""));
    return process.exit(0);
  }

  // 2. la condition réelle : reste-t-il une case vide ?
  const restantes = (texte.match(/^\s*-\s*\[ \]/gm) || []).length;
  const faites    = (texte.match(/^\s*-\s*\[x\]/gmi) || []).length;
  if(restantes === 0) return process.exit(0);

  const suivante = (texte.match(/^\s*-\s*\[ \]\s*(.+)$/m) || [, "?"])[1];

  console.log(JSON.stringify({
    decision: "block",
    reason:
      "Le chantier des fondations n'est pas fini : " + restantes + " étape(s) "
      + "restante(s) sur " + (restantes + faites) + " dans CHANTIER-F2.md.\n\n"
      + "PROCHAINE ÉTAPE : " + suivante + "\n\n"
      + "Enchaîne maintenant, sans annoncer que tu enchaînes. Le protocole de "
      + "chaque étape est le même : sortir le domaine dans son module, écrire "
      + "ou faire écrire son outil, jouer `node tout.js` et `VERIF.sain()` dans "
      + "la page, DESCENDRE `PLAFOND` dans `outil-verif-taille.js`, cocher la "
      + "case ici, committer et publier.\n\n"
      + "Si tu as besoin de l'œil d'Hugo, d'une décision qui lui revient, ou si "
      + "quelque chose est cassé : écris une ligne `## ARRÊT — <pourquoi>` en "
      + "tête de CHANTIER-F2.md et termine ton tour. C'est la seule façon "
      + "légitime de t'arrêter avant la fin.",
  }));
  process.exit(0);
});
