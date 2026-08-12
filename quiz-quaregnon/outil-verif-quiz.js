/* ============================================================================
   CONTRÔLE — la banque de questions et le tirage.

       node outil-verif-quiz.js

   Sort en 0 si tout va bien, en 1 sinon.

   Il attrape ce qu'une relecture à l'œil laisse toujours passer : une clé de
   source qui n'existe pas, deux questions avec le même identifiant, une bonne
   réponse qui pointe à côté, deux propositions identiques dans la même
   question — la faute qui rend une question impossible sans que personne ne
   s'en aperçoive avant la partie.

   Là où c'est possible, il tire sa vérité d'ailleurs que de la fonction qu'il
   surveille : le tirage n'est pas comparé à lui-même, mais à un comptage naïf
   fait ici, et aux propriétés qu'on attend de lui quoi qu'il arrive.
   ============================================================================ */

"use strict";

const { QUESTIONS, NIVEAUX, THEMES } = require("./questions.js");
const { SOURCES } = require("./sources.js");
const { melanger, choisirQuestions, mention, nombre, accord } = require("./quiz.js");

let echecs = 0, controles = 0;

function verifier(titre, condition, detail) {
  controles++;
  if (condition) return;
  echecs++;
  console.log("  ÉCHEC  " + titre + (detail ? "\n         " + detail : ""));
}

function titre(t) { console.log("\n" + t); }

/* Une suite pseudo-aléatoire reproductible : deux exécutions du contrôle
   doivent donner exactement la même chose, sinon un échec sur trois cents
   disparaît au moment où on le cherche. */
function suite(graine) {
  let a = graine >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------ la forme des questions */

titre("La forme de chaque question");

const vus = {};
QUESTIONS.forEach(function (q, k) {
  const ou = "question n°" + (k + 1) + " (" + (q.id || "sans identifiant") + ")";

  verifier("identifiant présent — " + ou, typeof q.id === "string" && q.id.length > 0);
  verifier("identifiant unique — " + ou, !vus[q.id], "déjà pris");
  vus[q.id] = true;

  verifier("thème connu — " + ou, !!THEMES[q.theme], "thème « " + q.theme + " »");
  verifier("niveau entre 1 et 3 — " + ou, [1, 2, 3].indexOf(q.niveau) !== -1);

  verifier("énoncé non vide — " + ou, typeof q.q === "string" && q.q.trim().length > 5);
  verifier("explication non vide — " + ou,
    typeof q.pourquoi === "string" && q.pourquoi.trim().length > 5);

  verifier("au moins deux propositions — " + ou, Array.isArray(q.r) && q.r.length >= 2);
  if (Array.isArray(q.r)) {
    q.r.forEach(function (r, i) {
      verifier("proposition " + i + " non vide — " + ou,
        typeof r === "string" && r.trim().length > 0);
    });
    const nettes = q.r.map(function (r) {
      return String(r).toLowerCase().replace(/[\s'’.,-]/g, "");
    });
    verifier("aucune proposition en double — " + ou,
      new Set(nettes).size === nettes.length,
      "deux réponses identiques rendent la question injouable");
    verifier("la bonne réponse pointe sur une proposition — " + ou,
      Number.isInteger(q.bonne) && q.bonne >= 0 && q.bonne < q.r.length,
      "bonne = " + q.bonne);
  }

  verifier("au moins une source — " + ou,
    Array.isArray(q.sources) && q.sources.length > 0);
  (q.sources || []).forEach(function (cle) {
    verifier("la source « " + cle + " » existe — " + ou, !!SOURCES[cle],
      "aucune entrée de ce nom dans sources.js");
  });
});

/* ------------------------------------------- chaque question tient debout seule */

/* Trouvé à l'œil, sur une capture d'écran : la première question d'une partie
   était « Quel parti l'a adoptée ? ». Adoptée quoi ? La question précédente
   parlait de la Charte — mais les questions sont tirées dans le désordre et
   par thème, alors celle-là arrive seule et ne veut plus rien dire. Il y en
   avait quatorze dans ce cas.

   Le contrôle demande que l'énoncé NOMME SON SUJET : soit par un nom propre,
   soit par l'un des mots dont ce quiz parle. C'est une approximation, et elle
   s'assume : une question qui nomme Quaregnon, la Charte ou Van Gogh se suffit
   presque toujours, une question qui ne nomme rien s'appuie presque toujours
   sur sa voisine.

   La liste en minuscules n'est pas une commodité : « borain » et « borinage »
   nomment leur sujet aussi bien que « Quaregnon », et le français les écrit
   sans majuscule. Une règle qui ne verrait que les majuscules refuserait la
   moitié des questions sur la langue — et à force d'exceptions, on aurait fini
   par la désarmer.

   La poignée de vraies exceptions se déclare à la main avec `autonome: true`,
   et le contrôle refuse cette déclaration quand elle ne sert à rien — sinon on
   la collerait partout et il n'y aurait plus de contrôle du tout. */

titre("Chaque question doit tenir debout toute seule");

const AMORCES = ["Et ", "Ou ", "Puis ", "Alors ", "Ensuite ", "Aussi "];

/* Des majuscules qui ne sont pas des noms propres : elles ouvrent une phrase
   ou une proposition, et ne nomment rien. */
const PAS_UN_NOM = new Set([
  "Aux", "Une", "Les", "Des", "Ils", "Elle", "Elles", "Qui", "Que", "Quel",
  "Quelle", "Quels", "Quelles", "Combien", "Comment", "Dans", "Depuis",
  "Pour", "Est", "Cette", "Ces", "Sur", "Par", "Avec", "Sans", "Quand",
  "Pourquoi", "Lequel", "Laquelle", "Piège"
]);

/* Les sujets du quiz qui s'écrivent sans majuscule en français. */
const SUJETS = ["borain", "borinage", "picard", "wallon", "charbonnage",
                "houilleur", "terril", "charte", "coron"];

function sujetsNommes(enonce) {
  const trouves = [];

  enonce.split(/\s+/).forEach(function (brut) {
    const mot = brut.replace(/^[«"'(’]+/, "").replace(/[»"',.;:!?)]+$/, "");
    if (mot.length >= 3 && /^[A-ZÀ-ÖØ-Þ]/.test(mot) && !PAS_UN_NOM.has(mot)) {
      trouves.push(mot);
    }
  });

  const bas = enonce.toLowerCase();
  SUJETS.forEach(function (s) {
    if (bas.indexOf(s) !== -1) trouves.push(s);
  });

  return trouves;
}

QUESTIONS.forEach(function (q) {
  const ou = "« " + q.q + " »";

  verifier("l'énoncé ne commence pas par une conjonction — " + ou,
    !AMORCES.some(function (a) { return q.q.indexOf(a) === 0; }),
    "« Et quand le quitte-t-il ? » n'a de sens qu'après la question d'avant");

  const noms = sujetsNommes(q.q);
  verifier("l'énoncé nomme son sujet — " + ou,
    noms.length > 0 || q.autonome === true,
    "l'énoncé ne nomme rien : soit il s'appuie sur une autre question, "
    + "soit c'est une vraie exception et il faut écrire autonome: true");

  if (q.autonome === true) {
    verifier("la déclaration « autonome » sert à quelque chose — " + ou,
      noms.length === 0,
      "l'énoncé nomme déjà " + noms.join(", ") + " : retirer autonome: true");
  }
});

/* ------------------------------------------------------------- les sources */

titre("Les sources");

Object.keys(SOURCES).forEach(function (cle) {
  const s = SOURCES[cle];
  verifier("la source « " + cle + " » a un titre", !!s.titre);
  verifier("la source « " + cle + " » a un lien https",
    typeof s.lien === "string" && /^https:\/\//.test(s.lien));
  verifier("la source « " + cle + " » porte sa date de lecture",
    /^\d{4}-\d{2}-\d{2}$/.test(s.lu || ""));
});

const utilisees = {};
QUESTIONS.forEach(function (q) {
  (q.sources || []).forEach(function (c) { utilisees[c] = true; });
});
Object.keys(SOURCES).forEach(function (cle) {
  verifier("la source « " + cle + " » sert à quelque chose", !!utilisees[cle],
    "plus aucune question ne s'en sert — la retirer ou l'employer");
});

/* --------------------------------------------------------- la répartition */

titre("La répartition");

NIVEAUX.forEach(function (niv) {
  const n = QUESTIONS.filter(function (q) { return q.niveau === niv.n; }).length;
  verifier("le niveau « " + niv.nom + " » a au moins huit questions", n >= 8,
    "il en a " + n + " — une partie de dix devient répétitive en dessous");
});

Object.keys(THEMES).forEach(function (cle) {
  const n = QUESTIONS.filter(function (q) { return q.theme === cle; }).length;
  verifier("le thème « " + THEMES[cle].nom + " » a au moins quatre questions", n >= 4,
    "il en a " + n);
});

/* ------------------------------------------------------------- le mélange */

titre("Le mélange");

(function () {
  const alea = suite(7);
  for (let essai = 0; essai < 200; essai++) {
    const depart = [0, 1, 2, 3, 4, 5, 6, 7];
    const melange = melanger(depart, alea);
    verifier("le mélange ne perd ni n'invente d'élément",
      melange.slice().sort().join(",") === depart.join(","));
    verifier("le mélange ne modifie pas le tableau d'origine",
      depart.join(",") === "0,1,2,3,4,5,6,7");
    if (echecs) break;
  }
})();

(function () {
  /* Un mélange qui rendrait toujours le même ordre passerait les contrôles
     ci-dessus sans rien mélanger du tout. */
  const alea = suite(11);
  const ordres = {};
  for (let i = 0; i < 100; i++) ordres[melanger([0, 1, 2, 3], alea).join("")] = true;
  verifier("le mélange donne des ordres variés", Object.keys(ordres).length >= 12,
    "seulement " + Object.keys(ordres).length + " ordres différents sur 24 possibles");
})();

/* -------------------------------------------------------------- le tirage */

titre("Le tirage d'une partie");

const TOUS_NIVEAUX = [1, 2, 3];
const TOUS_THEMES = Object.keys(THEMES);

(function () {
  const alea = suite(3);
  for (let essai = 0; essai < 60; essai++) {
    const tirees = choisirQuestions(QUESTIONS, TOUS_NIVEAUX, TOUS_THEMES, 10, alea);
    verifier("le tirage rend bien dix questions", tirees.length === 10,
      "il en a rendu " + tirees.length);
    const ids = tirees.map(function (q) { return q.id; });
    verifier("aucune question deux fois dans la même partie",
      new Set(ids).size === ids.length);
    if (echecs) break;
  }
})();

(function () {
  /* Le filtre est vérifié contre un comptage naïf fait ici, pas contre
     lui-même. */
  const alea = suite(5);
  const niveaux = [3];
  const themes = ["borain"];
  const attendues = QUESTIONS.filter(function (q) {
    return q.niveau === 3 && q.theme === "borain";
  }).map(function (q) { return q.id; });

  const tirees = choisirQuestions(QUESTIONS, niveaux, themes, 50, alea);
  verifier("le tirage ne sort jamais des réglages demandés",
    tirees.every(function (q) { return q.niveau === 3 && q.theme === "borain"; }));
  verifier("le tirage épuise tout ce qui correspond quand on en demande plus",
    tirees.length === attendues.length,
    "attendu " + attendues.length + ", obtenu " + tirees.length);
})();

(function () {
  /* La raison d'être de ce tirage : sur une partie de dix, aucun thème ne doit
     manger toute la place. Sans répartition, « quaregnon » sortait huit fois
     sur dix parce qu'il est le thème le mieux fourni. */
  const alea = suite(13);
  let pirePart = 0;
  for (let essai = 0; essai < 300; essai++) {
    const tirees = choisirQuestions(QUESTIONS, TOUS_NIVEAUX, TOUS_THEMES, 10, alea);
    const compte = {};
    tirees.forEach(function (q) { compte[q.theme] = (compte[q.theme] || 0) + 1; });
    const max = Math.max.apply(null, Object.keys(compte).map(function (k) {
      return compte[k];
    }));
    if (max > pirePart) pirePart = max;
  }
  verifier("aucun thème ne prend plus de la moitié d'une partie de dix",
    pirePart <= 5, "un thème est monté à " + pirePart + " questions sur 10");
})();

(function () {
  const alea = suite(17);
  const vide = choisirQuestions(QUESTIONS, [1], ["borain"], 10, alea);
  const compte = QUESTIONS.filter(function (q) {
    return q.niveau === 1 && q.theme === "borain";
  }).length;
  verifier("un tirage trop étroit rend ce qu'il peut sans se plaindre",
    vide.length === Math.min(compte, 10));
  verifier("un tirage impossible rend une liste vide",
    choisirQuestions(QUESTIONS, [1], ["inexistant"], 10, alea).length === 0);
})();

/* ---------------------------------------------------------- la mention */

titre("La mention finale");

(function () {
  const bornes = [0, 19, 20, 39, 40, 59, 60, 79, 80, 99, 100];
  const textes = bornes.map(mention);
  textes.forEach(function (t, i) {
    verifier("la mention à " + bornes[i] + " % est une phrase",
      typeof t === "string" && t.length > 3);
  });
  verifier("la mention change au fil du score",
    new Set(textes).size === 6,
    "il n'y a que " + new Set(textes).size + " mentions distinctes sur 6 attendues");
  verifier("le sans-faute a sa propre mention", mention(100) !== mention(99));
})();

/* ------------------------------------------------------------- l'écriture */

/* Ces deux-là sont nées d'une capture d'écran : l'écran de fin annonçait
   « 997 points sur 10000 — 1 bonnes réponses sur 10 ». Deux fautes en une
   ligne, dans la seule phrase que le joueur relit à coup sûr. */

titre("L'écriture des nombres et des pluriels");

verifier("les milliers sont séparés", nombre(10000) === "10\u202F000");
verifier("les centaines ne le sont pas", nombre(997) === "997");
verifier("les millions aussi sont séparés", nombre(1234567) === "1\u202F234\u202F567");
verifier("mille pile est séparé", nombre(1000) === "1\u202F000");
verifier("zéro reste zéro", nombre(0) === "0");
verifier("la séparation est une espace insécable",
  nombre(10000).indexOf("\u202F") !== -1 && nombre(10000).indexOf(" ") === -1 && nombre(10000).indexOf("\u00A0") === -1,
  "ni une espace ordinaire, qui laisserait le nombre se couper en fin de ligne,\n         ni l'insécable large U+00A0 — les trois se ressemblent à l'écran");

verifier("une seule bonne réponse reste au singulier",
  accord(1, "bonne réponse", "bonnes réponses") === "bonne réponse");
verifier("zéro bonne réponse reste au singulier",
  accord(0, "bonne réponse", "bonnes réponses") === "bonne réponse",
  "en français, zéro ne prend pas la marque du pluriel ici");
verifier("deux bonnes réponses passent au pluriel",
  accord(2, "bonne réponse", "bonnes réponses") === "bonnes réponses");
verifier("le pluriel simple ajoute un s", accord(3, "question") === "questions");
verifier("le singulier simple n'ajoute rien", accord(1, "question") === "question");

/* ------------------------------------------------------- ce qui attend Hugo */

const aRelire = QUESTIONS.filter(function (q) { return q.toiDeVoir; });

console.log("");
if (aRelire.length) {
  console.log("  À FAIRE RELIRE PAR HUGO — " + aRelire.length + " questions sur le borain :");
  aRelire.forEach(function (q) { console.log("    · " + q.id + " — " + q.q); });
  console.log("");
}

console.log(controles + " contrôles, " + echecs + " échec" + (echecs > 1 ? "s" : "") + ".");
console.log(QUESTIONS.length + " questions, " + Object.keys(SOURCES).length + " sources.");
process.exit(echecs ? 1 : 0);
