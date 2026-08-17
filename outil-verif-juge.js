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
/* ON ÔTE LES COMMENTAIRES AVANT DE CHERCHER LES CHAMPS — trouvé le 16 août, et
   c'est l'outil qui s'est fait avoir par son propre fichier.

   Le corps d'une question va jusqu'à la question suivante, donc il EMPORTE le
   long commentaire qui présente celle-ci. Ces commentaires parlent des champs :
   « les quatre options sont des angles de vue, donc `inspection: true` ». La
   phrase suffisait à faire croire que la question déclarait sa forme, alors que
   le champ pouvait être absent du code. Le contrôle passait au vert pour une
   raison qui n'était pas la sienne — et son sabotage, lui, virait au rouge en
   silence, ce qui est la façon dont on s'en est aperçu.

   Une déclaration se lit dans le code, jamais dans la prose qui l'explique.
   Seuls les commentaires en bloc sont ôtés : aucun commentaire de ligne de
   `juge.js` ne porte ces mots, et en ôter détruirait la seule adresse web du
   fichier, dont le `//` est à l'intérieur d'une chaîne. */
function sansProse(corps){ return corps.replace(/\/\*[\s\S]*?\*\//g, ""); }

function questions(texte){
  const bornes = [];
  const re = /^\s{2}\{\s*id:\s*"([a-z0-9-]+)"/gm;
  let m;
  while((m = re.exec(texte))) bornes.push({ id: m[1], i: m.index });
  return bornes.map((b, k) => ({
    id: b.id,
    corps: sansProse(texte.slice(b.i, k + 1 < bornes.length ? bornes[k + 1].i : texte.length)),
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

/* LE FICHIER COMPILE.

   Trois fois en deux jours, un accent grave écrit dans un commentaire a fermé le
   gabarit de chaîne qui porte la feuille de style, et `juge.js` ne se chargeait
   plus DU TOUT : plus de séance, plus de panneau, rien. Aucun des quarante-huit
   outils ne l'aurait dit — celui-ci lit le fichier comme du TEXTE, et un texte
   cassé se lit très bien.

   `new Function` compile sans exécuter : pas de DOM, pas de WebGL, juste la
   grammaire. C'est le seul contrôle du dépôt qui garde ce fichier vivant.      */
titre("La mesure elle-même tient debout");
let compile = null;
try { new Function("window", src); } catch(e){ compile = e.message; }
point("juge.js compile", compile === null, "aucune erreur", compile || "aucune erreur",
      "un accent grave de trop dans un commentaire ferme le gabarit de la feuille "
      + "de style et tue le fichier entier — c'est arrivé trois fois");
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
   LE DOCUMENT ET LA SÉANCE DISENT-ILS LA MÊME CHOSE ?

   LE DÉFAUT QUI L'A FAIT NAÎTRE — 16 août 2026. Hugo revient sur le projet et
   demande où en sont les plans. `A-REGARDER.md` portait QUATRE questions
   ouvertes ; `juge.js` n'en posait que DEUX. Les deux du 14 août — le repère du
   voyage, la vitre avant — avaient été rédigées dans le document, complètes et
   bien tournées, et n'étaient jamais arrivées jusqu'à la séance.

   Ce n'est pas un oubli anodin. Le document s'ouvre sur « Ne lis pas ce
   fichier. Ouvre ?juge » : il DÉLÈGUE à la séance, et se déclare lui-même
   n'être que sa source. Une question qui reste dans la source n'est donc posée
   nulle part. Hugo pouvait ouvrir `?juge`, y passer ses dix minutes, et
   ressortir en croyant avoir tout jugé — sans qu'aucun écran lui dise que la
   moitié manquait. C'est le pire genre de défaut de ce dépôt : celui qui coûte
   la seule ressource qu'aucun calcul ne remplace.

   D'OÙ VIENT SA VÉRITÉ — d'`A-REGARDER.md`, que `juge.js` ne lit pas et ne
   mentionne pas. Les deux fichiers n'ont aucun moyen de s'accorder tout seuls,
   et c'est ce qui rend l'accord mesurable (règle 3).

   LA CONVENTION EST DÉCLARÉE, JAMAIS DEVINÉE — comme `inspection:` plus haut et
   comme `carte:` sur les destinations. Un titre de section marqué 🔎 ou 👁 est
   une question de séance, et il porte l'identifiant de sa question dans un
   commentaire `<!-- juge: … -->`. Les sections ⚠, ❓, ❗ sont des notes libres,
   antérieures à la séance, et restent hors de cette règle : deviner à leur
   place produirait des faux rouges qu'on finirait par ignorer.

   ET LA RÈGLE VA DANS LES DEUX SENS, parce que les deux fautes existent :
   une section ouverte sans question active (le 16 août), et une question restée
   active alors que sa section est passée en ✅ — c'est ce second sens qui a
   mordu le 11 août, quand un verdict rendu portait sur un rythme que le jeu ne
   jouait pas. */
titre("Le document et la séance posent les mêmes questions");

const doc = fs.readFileSync("A-REGARDER.md", "utf8");

/* Une section ouverte : un titre `##` portant 🔎 ou 👁, et tout ce qui suit
   jusqu'au titre suivant. On y cherche son marqueur. */
const ouvertes = [];
{
  const re = /^##[ \t]+(?=.*[🔎👁]).*$/gm;
  const tetes = [];
  let m;
  while((m = re.exec(doc))) tetes.push({ titre: m[0].trim(), i: m.index });
  tetes.forEach((t, k) => {
    const corps = doc.slice(t.i, k + 1 < tetes.length ? tetes[k + 1].i : doc.length);
    const mark = /<!--\s*juge:\s*([a-z0-9-]+)\s*-->/.exec(corps);
    ouvertes.push({ titre: t.titre, id: mark ? mark[1] : null });
  });
}

const actives = qs.filter(q => !q.repondue).map(q => q.id);
const sansMarqueur = ouvertes.filter(o => !o.id);
const pointeDansLeVide = ouvertes.filter(o => o.id && !qs.some(q => q.id === o.id));
const posePlusRien = ouvertes.filter(o => o.id && qs.some(q => q.id === o.id && q.repondue));
const horsDocument = actives.filter(id => !ouvertes.some(o => o.id === id));

point("on a bien lu des sections ouvertes", ouvertes.length > 0,
      "> 0", ouvertes.length,
      "zéro voudrait dire que la lecture du document ne mord plus, et les trois "
      + "contrôles suivants passeraient au vert sans rien mesurer");

point("chaque section ouverte nomme sa question", sansMarqueur.length === 0,
      0, sansMarqueur.length ? sansMarqueur.map(o => o.titre).join(" | ") : 0,
      "une section 🔎 sans `<!-- juge: … -->` est une question qu'on a écrite "
      + "pour lui et qu'il ne verra jamais");

point("et cette question existe dans la séance", pointeDansLeVide.length === 0,
      0, pointeDansLeVide.length ? pointeDansLeVide.map(o => o.id).join(", ") : 0,
      "le document renverrait vers une question que `juge.js` ne porte pas");

point("et elle y est encore posée", posePlusRien.length === 0,
      0, posePlusRien.length ? posePlusRien.map(o => o.id).join(", ") : 0,
      "`ignore: true` la retire de la séance ; la laisser ouverte dans le "
      + "document ferait croire qu'elle attend encore une réponse");

point("et aucune question posée ne manque au document", horsDocument.length === 0,
      0, horsDocument.length ? horsDocument.join(", ") : 0,
      "le sens qui a mordu le 11 août : une question reste active alors que sa "
      + "section est passée en ✅, et son verdict porte sur autre chose que ce "
      + "qu'on croit lui demander");

/* --------------------------------------------------------------------------
   ET CET OUTIL SAIT ÉCHOUER — règle 2. */
titre("Cet outil sait échouer");

const sansDrapeau = src.replace(/\n\s{4}inspection:\s*true,/, "");
const m2 = questions(sansDrapeau).filter(q => q.aOptions && !q.ditForme);
point("une question à options qui oublie sa forme est vue", m2.length > 0,
      "au moins une signalée", m2.length ? m2.map(q => q.id).join(", ") : "RIEN",
      "c'est exactement la faute du 10 août, remise dans une copie jetable");

/* LE SABOTAGE QUI A DÉMASQUÉ LE PRÉCÉDENT — 16 août 2026.

   On retire le champ du code ET l'on écrit la phrase dans le commentaire qui
   présente la question. C'est exactement ce qui existait dans le fichier ce
   jour-là, et c'est la forme la plus vraisemblable de la faute : on rédige le
   commentaire en même temps qu'on écrit la question, et l'on oublie le champ.
   Avant `sansProse`, ce point restait au vert. */
const enProse = src
  .replace(/\n\s{4}inspection:\s*true,/, "")
  .replace("/* LE REPÈRE DU VOYAGE", "/* Les options sont des angles de vue, donc inspection: true.\n   LE REPÈRE DU VOYAGE");
const m3 = questions(enProse).filter(q => q.aOptions && !q.ditForme);
point("une forme annoncée en commentaire seulement ne compte pas", m3.length > 0,
      "au moins une signalée", m3.length ? m3.map(q => q.id).join(", ") : "RIEN",
      "une déclaration se lit dans le code ; la prose qui l'explique n'engage "
      + "rien, et laissait ce contrôle vert pour une raison qui n'était pas la sienne");

const sansRendu = src.replace(/if\s*\(\s*d\.options\s*&&\s*!\s*d\.inspection\s*\)/, "if(d.options)");
point("un rendu qui cesse de distinguer les deux formes est vu",
      !/if\s*\(\s*d\.options\s*&&\s*!\s*d\.inspection\s*\)/.test(sansRendu),
      "signalé", !/if\s*\(\s*d\.options\s*&&\s*!\s*d\.inspection\s*\)/.test(sansRendu) ? "signalé" : "RIEN");

const aveugle = questions(src.replace(/^\s{2}\{\s*id:/gm, "  { identifiant:"));
point("une découpe qui cesse de mordre est vue", aveugle.length < 5,
      "moins de 5 questions lues", aveugle.length,
      "c'est le premier point qui l'attrape, et il faut qu'il soit vrai");

/* LES QUATRE SABOTAGES DE L'ACCORD ENTRE LES DEUX FICHIERS.

   Ils se jouent sur des copies EN MÉMOIRE, et c'est ici la bonne forme : cet
   outil ne fait que lire du texte, donc abîmer le texte qu'il lit est
   exactement abîmer ce qu'il perçoit du fichier. La leçon du 14 août — « on
   casse le FICHIER » — visait un cas différent : un module dont on remplaçait
   les fonctions sur l'objet exporté pendant que le dessin les appelait par leur
   nom de module. Ici il n'y a pas de second chemin par lequel la vérité
   pourrait passer.

   (Ils ont malgré tout été rejoués une fois sur de vraies copies des deux
   fichiers, dans un dossier à part, le 16 août.) */
function accord(texteSeance, texteDoc){
  const qq = questions(texteSeance);
  const tt = [];
  const re = /^##[ \t]+(?=.*[🔎👁]).*$/gm;
  let m; while((m = re.exec(texteDoc))) tt.push(m.index);
  const secs = tt.map((i, k) => {
    const corps = texteDoc.slice(i, k + 1 < tt.length ? tt[k + 1] : texteDoc.length);
    const mk = /<!--\s*juge:\s*([a-z0-9-]+)\s*-->/.exec(corps);
    return mk ? mk[1] : null;
  });
  const act = qq.filter(q => !q.repondue).map(q => q.id);
  return secs.some(id => !id)
      || secs.some(id => id && !qq.some(q => q.id === id))
      || secs.some(id => qq.some(q => q.id === id && q.repondue))
      || act.some(id => !secs.includes(id));
}

point("la séance qui perd une question ouverte est vue",
      accord(src.replace(/^\s{2}\{ id: "repere-du-voyage",[\s\S]*?\n\s{2}\},\n/m, ""), doc),
      "signalé", accord(src.replace(/^\s{2}\{ id: "repere-du-voyage",[\s\S]*?\n\s{2}\},\n/m, ""), doc) ? "signalé" : "RIEN",
      "c'est la faute du 16 août, remise dans une copie jetable : le document "
      + "porte la question, la séance ne la pose pas");

point("une question rangée sans que le document suive est vue",
      accord(src.replace('{ id: "vitre-avant",', '{ id: "vitre-avant", ignore: true,'), doc),
      "signalé", accord(src.replace('{ id: "vitre-avant",', '{ id: "vitre-avant", ignore: true,'), doc) ? "signalé" : "RIEN",
      "`ignore: true` la retire de la séance ; sa section reste ouverte");

point("un document qui nomme une question inexistante est vu",
      accord(src, doc.replace("<!-- juge: vitre-avant -->", "<!-- juge: vitre-de-cote -->")),
      "signalé", accord(src, doc.replace("<!-- juge: vitre-avant -->", "<!-- juge: vitre-de-cote -->")) ? "signalé" : "RIEN",
      "une coquille dans l'identifiant casserait le lien en silence");

point("une section ouverte sans marqueur est vue",
      accord(src, doc.replace("<!-- juge: repere-du-voyage -->", "")),
      "signalé", accord(src, doc.replace("<!-- juge: repere-du-voyage -->", "")) ? "signalé" : "RIEN",
      "c'est la forme qu'aurait prise l'oubli du 14 août si la convention "
      + "avait déjà existé ce jour-là");

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
