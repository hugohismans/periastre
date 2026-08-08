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
  /* CE QUI ARRIVE SUR L'ENTRÉE DÉCIDE DU GARDE-FOU, DONC ON NE DEVINE PAS.

     Le commentaire disait « pas de JSON : on ne bloque pas », et le code faisait
     l'inverse : il laissait `data` vide et tombait dans la logique de blocage.
     Un objet vide n'a pas de `stop_hook_active`, donc une entrée illisible
     supprimait précisément la protection contre la boucle sans fin.

     Trouvé le 9 août en éprouvant le hook avant de le brancher — le BOM que
     PowerShell colle en tête d'un fichier suffisait à casser la lecture. Ce
     n'était qu'un artefact de test, mais il a montré le vrai défaut derrière.

     Deux réparations : on retire le BOM, et une entrée qu'on ne sait pas lire
     ne bloque JAMAIS. Un hook qui ne comprend pas ce qu'on lui dit doit se
     taire, pas insister. */
  /* UNE ENTRÉE VIDE VEUT DIRE « JE NE SAIS PAS », ET ON SE TAIT.

     Elle devenait `{}` par le `|| "{}"` d'origine : un objet valide, sans
     `stop_hook_active`, donc un blocage. Or c'est exactement le cas où l'on
     ignore si l'on est déjà en continuation forcée — le seul renseignement qui
     protège de la boucle sans fin.

     Le pire des deux côtés n'est pas le même. Un hook muet à tort ne coûte
     qu'une continuation manquée, qu'on voit tout de suite. Un hook qui insiste
     à tort tourne jusqu'aux huit blocages du garde-fou de Claude Code, en
     produisant du remplissage. Dans le doute, on se tait. */
  const brut = (entree || "").replace(/^﻿/, "").trim();
  if(!brut) return process.exit(0);
  let data = null;
  try { data = JSON.parse(brut); }
  catch(e){ return process.exit(0); }
  if(!data || typeof data !== "object") return process.exit(0);

  // 1. déjà en continuation forcée : on laisse finir, sinon c'est sans fin.
  if(data.stop_hook_active) return process.exit(0);

  let texte = "";
  try { texte = fs.readFileSync(LISTE, "utf8"); }
  catch(e){ return process.exit(0); }        // pas de liste : pas de chantier

  /* 3. la porte de sortie, lue avant tout le reste.

     ELLE ACCEPTE « ARRET » SANS ACCENT, et ce n'est pas une coquetterie : c'est
     une issue de secours. On l'écrit quand quelque chose est cassé ou qu'une
     décision revient à Hugo — c'est-à-dire au pire moment pour se tromper d'une
     touche. Éprouvée le 9 août avant branchement : elle ne répondait qu'à la
     forme accentuée, et mon propre essai est resté dehors. */
  if(/^##\s*ARR[EÊ]T/mi.test(texte)){
    const quoi = (texte.match(/^##\s*ARR[EÊ]T.*$/mi) || [""])[0];
    console.error("  ⏸  " + quoi.replace(/^##\s*/, ""));
    return process.exit(0);
  }

  /* 2. la condition réelle : reste-t-il une case vide QUI SOIT LA MIENNE ?

     LES CASES D'HUGO SONT ÉCARTÉES, et c'est le point 2 de l'en-tête pris au
     sérieux : « un blocage adossé à rien ne se termine jamais ». Une séance de
     jugement, un choix de forme, une réplique à écrire de sa voix — ce sont des
     cases que je ne peux pas cocher. Me pousser dessus ne rapprocherait pas la
     fin, ça produirait du remplissage jusqu'aux huit blocages du garde-fou.

     La marque est `(HUGO)` en fin de ligne. Elle se lit d'un coup d'œil dans le
     fichier, et elle dit à qui appartient chaque case — ce qui est utile bien
     au-delà de ce script. */
  const lignes = texte.split("\n");
  const vides = lignes.filter(l => /^\s*-\s*\[ \]/.test(l));
  const miennes = vides.filter(l => !/\(HUGO\)/.test(l));
  const faites = lignes.filter(l => /^\s*-\s*\[x\]/i.test(l)).length;
  const restantes = miennes.length;

  if(restantes === 0){
    const attente = vides.length;
    if(attente) console.error("  ⏸  " + attente + " case(s) attendent Hugo — rien à enchaîner de mon côté.");
    return process.exit(0);
  }

  const suivante = (miennes[0].match(/^\s*-\s*\[ \]\s*(.+)$/) || [, "?"])[1];

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
