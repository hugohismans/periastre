/* ============================================================================
   LA SÉANCE DE JUGEMENT — SES QUESTIONS SONT-ELLES BIEN FORMÉES ?

       node outil-verif-juge.js

   ---------------------------------------------------------------------------
   LE DÉFAUT QUI L'A FAIT NAÎTRE, ET IL S'EST PRODUIT DEUX FOIS

   Une question de séance peut prendre deux formes, et elles ne se ressemblent
   pas du tout à l'écran :

     COMPARER  — les options sont des propositions concurrentes. Les boutons
                 disent « je garde celle-ci » / « aucune ne convient », et le
                 rapport demande d'enlever les autres.

     REGARDER  — les options sont des angles de vue sur UNE SEULE chose. Les
                 boutons disent « ça va » / « ça coince », et l'angle n'est
                 qu'une note en marge du verdict.

   `inspection: true` choisit la seconde. La première fois qu'il a manqué, la
   séance a rendu « garde celle-ci, enlève les autres » à propos de trois
   rotations du site — c'est-à-dire proposer d'effacer une fonctionnalité parce
   qu'Hugo venait de dire qu'elle marchait. Le drapeau a été créé ce jour-là.

   LE 10 AOÛT 2026, JE L'AI OUBLIÉ À NOUVEAU, sur la question « regarder
   ailleurs pendant le vol ». Les huit autres questions du fichier le portaient.
   Hugo a répondu ce que l'écran lui demandait — « je garde en partant, je
   tourne, enlève les autres » — pour trois angles de vue sur un vol qui marche.

   Et le vrai coût n'est pas la consigne absurde, qu'on repère en la lisant.
   C'est qu'une question à comparaison **ne produit aucun verdict** : ni « ça
   va », ni « ça coince ». La séance ne rend donc pas la réponse qu'on était
   allé chercher, et l'on ne s'en aperçoit qu'après avoir dépensé le seul
   temps qu'on ne peut pas remplacer par un calcul.

   ---------------------------------------------------------------------------
   LA RÈGLE, ET POURQUOI ELLE EST DÉCLARATIVE

   On ne devine pas la forme d'une question. Une heuristique — « si les options
   rappellent la même fonction, c'est une inspection » — se serait trompée sur
   celle du 10 août, dont les trois options appellent deux fonctions
   différentes pour le même trajet.

   Donc : **toute question à options DÉCLARE sa forme**, `inspection: true` ou
   `inspection: false`. Ne rien dire est refusé. C'est la même manœuvre que
   `carte:` sur les destinations le matin même — une donnée qu'on ne peut pas
   oublier vaut mieux qu'un défaut qu'on n'aurait pas vu.

   D'OÙ VIENT SA VÉRITÉ : du rendu des boutons de `juge.js`, qui est le seul
   endroit où la distinction a un effet. L'outil vérifie que ce rendu teste bien
   `d.inspection` — sans quoi la règle qu'il impose ne servirait plus à rien, et
   il continuerait de la faire respecter dans le vide.
   ============================================================================ */

"use strict";
const fs = require("fs");
const src = fs.readFileSync("juge.js", "utf8");

let echecs = 0, total = 0;
function point(nom, ok, attendu, mesure, note){
  total++; if(!ok) echecs++;
  console.log(`  ${ok ? "✅" : "❌"}  ${nom}`);
  if(attendu !== undefined) console.log(`        attendu ${attendu}   mesuré ${mesure}`);
  if(note) console.log(`        ${note}`);
}
function titre(t){ console.log(`\n  ${t}\n  ${"─".repeat(t.length)}`); }

/* Découper les questions. On repère chaque `{ id: "…"` en tête de ligne et l'on
   va jusqu'au suivant : la découpe est grossière exprès, elle n'a qu'à isoler
   les champs de premier niveau. Le contrôle « on a bien lu des questions »
   refuse qu'elle rende zéro — une expression qui cesserait de mordre passerait
   sinon tout le reste au vert sans rien mesurer. */
function questions(texte){
  const bornes = [];
  const re = /^\s{2}\{\s*id:\s*"([a-z0-9-]+)"/gm;
  let m;
  while((m = re.exec(texte))) bornes.push({ id: m[1], i: m.index });
  return bornes.map((b, k) => ({
    id: b.id,
    corps: texte.slice(b.i, k + 1 < bornes.length ? bornes[k + 1].i : texte.length),
  })).map(q => ({
    id: q.id,
    aOptions: /\boptions:\s*\[/.test(q.corps),
    ditForme: /\binspection:\s*(true|false)\b/.test(q.corps),
    repondue: /\bignore:\s*true\b/.test(q.corps),
  }));
}

console.log("\n  LA SÉANCE DE JUGEMENT — SES QUESTIONS");
console.log("  ═════════════════════════════════════");

const qs = questions(src);
const aOptions = qs.filter(q => q.aOptions);
const muettes  = aOptions.filter(q => !q.ditForme);

titre("La mesure elle-même tient debout");
point("on a bien lu des questions", qs.length >= 5, "≥ 5", qs.length,
      "un zéro voudrait dire que la découpe ne mord plus, pas qu'il n'y a plus "
      + "de question — et tout le reste passerait au vert à vide");
point("et certaines portent des options", aOptions.length > 0,
      "> 0", aOptions.length,
      "sans options, la règle de ce fichier ne s'appliquerait à personne");

titre("Chaque question à options dit laquelle des deux formes elle prend");
point("aucune ne se tait", muettes.length === 0,
      0, muettes.length ? muettes.map(q => q.id).join(", ") : 0,
      "« comparer » rend « garde celle-ci, enlève les autres » et AUCUN verdict ; "
      + "« regarder » rend « ça va » / « ça coince ». Se tromper coûte la séance "
      + "entière, et c'est arrivé deux fois — la seconde le 10 août 2026");

titre("Et la distinction a toujours un effet");
point("le rendu des boutons interroge bien `inspection`",
      /if\s*\(\s*d\.options\s*&&\s*!\s*d\.inspection\s*\)/.test(src),
      "le rendu teste `d.options && !d.inspection`",
      /if\s*\(\s*d\.options\s*&&\s*!\s*d\.inspection\s*\)/.test(src) ? "il le teste" : "IL NE LE TESTE PLUS",
      "le jour où ce test disparaît, la règle ci-dessus s'applique dans le vide "
      + "— et cet outil resterait vert en gardant une porte qui n'ouvre plus rien");

/* --------------------------------------------------------------------------
   ET CET OUTIL SAIT ÉCHOUER — règle 2. */
titre("Cet outil sait échouer");

const sansDrapeau = src.replace(/\n\s{4}inspection:\s*true,/, "");
const m2 = questions(sansDrapeau).filter(q => q.aOptions && !q.ditForme);
point("une question à options qui oublie sa forme est vue", m2.length > 0,
      "au moins une signalée", m2.length ? m2.map(q => q.id).join(", ") : "RIEN",
      "c'est exactement la faute du 10 août, remise dans une copie jetable");

const sansRendu = src.replace(/if\s*\(\s*d\.options\s*&&\s*!\s*d\.inspection\s*\)/, "if(d.options)");
point("un rendu qui cesse de distinguer les deux formes est vu",
      !/if\s*\(\s*d\.options\s*&&\s*!\s*d\.inspection\s*\)/.test(sansRendu),
      "signalé", !/if\s*\(\s*d\.options\s*&&\s*!\s*d\.inspection\s*\)/.test(sansRendu) ? "signalé" : "RIEN");

const aveugle = questions(src.replace(/^\s{2}\{\s*id:/gm, "  { identifiant:"));
point("une découpe qui cesse de mordre est vue", aveugle.length < 5,
      "moins de 5 questions lues", aveugle.length,
      "c'est le premier point qui l'attrape, et il faut qu'il soit vrai");

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
