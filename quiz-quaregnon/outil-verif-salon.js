/* ============================================================================
   CONTRÔLE — le salon multijoueur, sa mécanique.

       node outil-verif-salon.js

   ---------------------------------------------------------------------------
   CE QU'IL PROUVE, ET CE QU'IL NE PROUVE PAS

   Il prouve que le miroir, le barème, le classement et l'oubli des partis font
   ce qu'on croit — sans réseau, sans navigateur, sans Firebase.

   Il ne prouve PAS que Firebase envoie bien les messages que j'attends. Écrire
   une imitation de Firebase et la comparer à ma lecture de Firebase ne
   mesurerait que mon accord avec moi-même. La forme des messages vient de la
   documentation de Google ; la vérification, c'est une vraie partie à deux
   téléphones, et rien d'autre.

   Alors partout où c'était possible, les contrôles s'appuient sur des
   PROPRIÉTÉS plutôt que sur des valeurs recopiées : un classement doit être le
   même quel que soit l'ordre des clés ; l'oubli des partis doit être insensible
   à un décalage d'horloge. Ces propriétés-là restent vraies même si je me suis
   trompé sur le détail.
   ============================================================================ */

"use strict";

/* `salon.js` s'écrit pour le navigateur : on lui donne le décor minimum. */
global.CONFIG = { base: "https://exemple.firebasedatabase.app", secondesParQuestion: 25 };
const { SALON } = require("./salon.js");

let echecs = 0, controles = 0;

function verifier(titre, condition, detail) {
  controles++;
  if (condition) return;
  echecs++;
  console.log("  ÉCHEC  " + titre + (detail ? "\n         " + detail : ""));
}

function memeChose(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function titre(t) { console.log("\n" + t); }

/* ============================== LE MIROIR ============================== */

titre("Le miroir — appliquer un message au reflet local");

(function () {
  const salon = { etat: "attente", joueurs: { a: { nom: "Hugo", score: 0 } } };

  verifier("un put à la racine remplace tout",
    memeChose(SALON.appliquer({ vieux: 1 }, { type: "put", chemin: "/", donnee: salon }),
              salon));

  verifier("un put à la racine avec null vide le miroir",
    SALON.appliquer(salon, { type: "put", chemin: "/", donnee: null }) === null);

  verifier("un put profond ne touche qu'à sa branche",
    memeChose(
      SALON.appliquer(salon, { type: "put", chemin: "/etat", donnee: "question" }),
      { etat: "question", joueurs: { a: { nom: "Hugo", score: 0 } } }));

  verifier("un put profond ne modifie pas le miroir d'origine",
    salon.etat === "attente",
    "le miroir a été modifié sur place — deux écrivains pour une valeur");

  verifier("un put crée les niveaux manquants",
    memeChose(
      SALON.appliquer({}, { type: "put", chemin: "/manche/ordre", donnee: [2, 0, 1, 3] }),
      { manche: { ordre: [2, 0, 1, 3] } }));

  verifier("un put à null efface la clé",
    memeChose(
      SALON.appliquer(salon, { type: "put", chemin: "/joueurs/a", donnee: null }),
      { etat: "attente", joueurs: {} }));
})();

(function () {
  const salon = { joueurs: { a: { nom: "Hugo", score: 10 }, b: { nom: "Zoé", score: 4 } } };

  verifier("un patch fusionne au lieu de remplacer",
    memeChose(
      SALON.appliquer(salon, { type: "patch", chemin: "/joueurs/a", donnee: { score: 90 } }),
      { joueurs: { a: { nom: "Hugo", score: 90 }, b: { nom: "Zoé", score: 4 } } }),
    "un patch qui remplace effacerait le nom du joueur");

  verifier("un patch avec null efface la clé visée",
    memeChose(
      SALON.appliquer(salon, { type: "patch", chemin: "/joueurs", donnee: { b: null } }),
      { joueurs: { a: { nom: "Hugo", score: 10 } } }),
    "sans ça, un joueur parti resterait affiché pour toujours");

  verifier("un patch à la racine fusionne aussi",
    memeChose(
      SALON.appliquer({ etat: "attente", hote: "a" },
                      { type: "patch", chemin: "/", donnee: { etat: "question" } }),
      { etat: "question", hote: "a" }));

  verifier("un message d'un autre type ne change rien",
    SALON.appliquer(salon, { type: "keep-alive" }) === salon);
})();

(function () {
  /* Une vraie séquence de partie, appliquée message par message. L'état final
     est écrit à la main ici : si le miroir dérive d'un cran quelque part, le
     total ne tombe pas juste. */
  let m = null;
  const messages = [
    { type: "put", chemin: "/", donnee: {
        etat: "attente", hote: "h",
        joueurs: { h: { nom: "Hugo", score: 0 } } } },
    { type: "put", chemin: "/joueurs/z", donnee: { nom: "Zoé", score: 0 } },
    { type: "put", chemin: "/reglages", donnee: { liste: ["pays", "riviere"], limite: 25000 } },
    { type: "put", chemin: "/manche", donnee: { i: 0, id: "pays", ordre: [1, 0, 2, 3] } },
    { type: "put", chemin: "/etat", donnee: "question" },
    { type: "patch", chemin: "/joueurs/h", donnee: { rep: { manche: 0, choix: 1, ms: 3000 } } },
    { type: "patch", chemin: "/joueurs/z", donnee: { rep: { manche: 0, choix: 0, ms: 9000 } } },
    { type: "patch", chemin: "/joueurs", donnee: { "h/score": 940, "z/score": 0 } },
    { type: "put", chemin: "/etat", donnee: "revelation" },
    { type: "put", chemin: "/joueurs/z", donnee: null }
  ];
  messages.forEach(function (ev) { m = SALON.appliquer(m, ev); });

  verifier("après la séquence, l'état est celui attendu", m.etat === "revelation");
  verifier("après la séquence, il ne reste qu'un joueur",
    Object.keys(m.joueurs).length === 1 && m.joueurs.h.nom === "Hugo");
  verifier("après la séquence, le score du meneur est arrivé", m.joueurs.h.score === 940);
  verifier("après la séquence, la manche est intacte",
    memeChose(m.manche, { i: 0, id: "pays", ordre: [1, 0, 2, 3] }));
  verifier("après la séquence, les réglages sont intacts",
    memeChose(m.reglages.liste, ["pays", "riviere"]));
})();

/* Le patch multi-chemins « h/score » est la façon dont Firebase met à jour
   plusieurs joueurs d'un coup. Le miroir doit le comprendre, sinon les scores
   n'apparaissent que chez le meneur. */
(function () {
  const avant = { joueurs: { h: { nom: "Hugo", score: 0 }, z: { nom: "Zoé", score: 0 } } };
  const apres = SALON.appliquer(avant,
    { type: "patch", chemin: "/joueurs", donnee: { "h/score": 800, "z/score": 550 } });

  verifier("un patch multi-chemins pose les deux scores au bon endroit",
    apres.joueurs.h.score === 800 && apres.joueurs.z.score === 550);
  verifier("un patch multi-chemins ne perd pas les noms",
    apres.joueurs.h.nom === "Hugo" && apres.joueurs.z.nom === "Zoé");
  verifier("un patch multi-chemins ne crée pas de clé « h/score »",
    !Object.prototype.hasOwnProperty.call(apres.joueurs, "h/score"),
    "lire la clé à plat au lieu du chemin ferait apparaître les points "
    + "chez le meneur et nulle part ailleurs");
  verifier("un patch multi-chemins ne modifie pas le miroir d'origine",
    avant.joueurs.h.score === 0);
})();

/* ======================== LA LECTURE DES MESSAGES ======================== */

titre("La lecture des messages du tuyau");

verifier("un put est compris",
  memeChose(SALON.lireEvenement("put", '{"path":"/etat","data":"question"}'),
            { type: "put", chemin: "/etat", donnee: "question" }));

verifier("un patch est compris",
  memeChose(SALON.lireEvenement("patch", '{"path":"/joueurs/a","data":{"score":10}}'),
            { type: "patch", chemin: "/joueurs/a", donnee: { score: 10 } }));

verifier("un keep-alive est ignoré", SALON.lireEvenement("keep-alive", "null") === null);
verifier("un cancel est signalé",
  (SALON.lireEvenement("cancel", "null") || {}).type === "cancel");
verifier("un auth_revoked est signalé",
  (SALON.lireEvenement("auth_revoked", "null") || {}).type === "cancel");
verifier("un message illisible ne fait pas tomber la partie",
  SALON.lireEvenement("put", "{ceci n'est pas du json") === null);
verifier("un message sans chemin retombe sur la racine",
  (SALON.lireEvenement("put", '{"data":{"a":1}}') || {}).chemin === "/");

/* =============================== LE BARÈME =============================== */

titre("Le barème");

verifier("une mauvaise réponse ne rapporte rien", SALON.points(false, 0, 25000) === 0);
verifier("une mauvaise réponse instantanée ne rapporte rien non plus",
  SALON.points(false, 1, 25000) === 0);
verifier("répondre juste instantanément vaut le maximum",
  SALON.points(true, 0, 25000) === 1000);
verifier("répondre juste à la dernière seconde vaut la moitié",
  SALON.points(true, 25000, 25000) === 500);
verifier("répondre juste hors délai vaut encore la moitié",
  SALON.points(true, 999999, 25000) === 500,
  "on ne punit jamais une bonne réponse en dessous de 500");

(function () {
  let precedent = 1001;
  let decroissant = true;
  for (let ms = 0; ms <= 25000; ms += 250) {
    const p = SALON.points(true, ms, 25000);
    if (p > precedent) decroissant = false;
    if (p < 500 || p > 1000) decroissant = false;
    precedent = p;
  }
  verifier("plus on met de temps, moins on marque — jamais l'inverse", decroissant);
})();

verifier("un barème sans limite de temps reste défini",
  SALON.points(true, 4000, 0) === 500);

/* ============================= LE CLASSEMENT ============================= */

titre("Le classement");

(function () {
  const joueurs = {
    zzz: { nom: "Anna", score: 300 },
    aaa: { nom: "Bruno", score: 900 },
    mmm: { nom: "Chloé", score: 300 }
  };
  const rangs = SALON.classement(joueurs);
  verifier("le meilleur est premier", rangs[0].nom === "Bruno");
  verifier("tout le monde est là", rangs.length === 3);
  verifier("à égalité, l'ordre est alphabétique",
    rangs[1].nom === "Anna" && rangs[2].nom === "Chloé");

  /* La propriété qui compte vraiment : deux téléphones reçoivent les joueurs
     dans un ordre différent et doivent afficher le MÊME podium. */
  const memeMonde = {
    mmm: { nom: "Chloé", score: 300 },
    zzz: { nom: "Anna", score: 300 },
    aaa: { nom: "Bruno", score: 900 }
  };
  verifier("le classement ne dépend pas de l'ordre d'arrivée des joueurs",
    memeChose(SALON.classement(joueurs).map(function (j) { return j.nom; }),
              SALON.classement(memeMonde).map(function (j) { return j.nom; })),
    "sinon deux joueurs voient deux podiums différents pour la même partie");

  verifier("un joueur sans score compte pour zéro",
    SALON.classement({ a: { nom: "X" } })[0].score === 0);
  verifier("un salon vide donne un classement vide",
    SALON.classement({}).length === 0);
})();

/* ========================= L'OUBLI DES PARTIS ========================= */

titre("L'oubli de ceux qui sont partis");

(function () {
  const joueurs = {
    ici:   { nom: "Ici", vu: 1000000 },
    aussi: { nom: "Aussi", vu: 990000 },
    parti: { nom: "Parti", vu: 900000 }
  };
  verifier("celui qui s'est tu depuis longtemps est oublié",
    memeChose(SALON.absents(joueurs, 45000), ["parti"]));
  verifier("ceux qui parlent encore restent",
    SALON.absents(joueurs, 45000).indexOf("ici") === -1);

  /* LA propriété : le seuil se mesure entre joueurs, jamais contre l'horloge
     du téléphone. Deux téléphones ne sont jamais à la même heure. */
  const memeMondeDecale = {};
  Object.keys(joueurs).forEach(function (k) {
    memeMondeDecale[k] = { nom: joueurs[k].nom, vu: joueurs[k].vu + 8640000000 };
  });
  verifier("décaler toutes les horloges ne change rien au résultat",
    memeChose(SALON.absents(joueurs, 45000), SALON.absents(memeMondeDecale, 45000)),
    "un contrôle qui comparerait à Date.now() jetterait des joueurs présents");

  verifier("un salon vide n'oublie personne", SALON.absents({}, 45000).length === 0);
  verifier("un joueur sans horodatage n'est pas jeté dehors",
    SALON.absents({ a: { nom: "A" }, b: { nom: "B", vu: 5 } }, 45000).length === 0);
  verifier("personne n'est oublié quand tout le monde est frais",
    SALON.absents({ a: { vu: 100 }, b: { vu: 120 } }, 45000).length === 0);
})();

/* ========================== TOUT LE MONDE A DIT ========================== */

titre("Savoir si la manche est finie");

verifier("un salon vide n'est pas une manche finie",
  SALON.tousOntRepondu({}, 0) === false);
verifier("il manque quelqu'un",
  SALON.tousOntRepondu({ a: { rep: { manche: 0 } }, b: {} }, 0) === false);
verifier("tout le monde a répondu",
  SALON.tousOntRepondu({ a: { rep: { manche: 0 } }, b: { rep: { manche: 0 } } }, 0) === true);
verifier("une réponse d'une manche précédente ne compte pas",
  SALON.tousOntRepondu({ a: { rep: { manche: 0 } }, b: { rep: { manche: 1 } } }, 1) === false,
  "sinon la manche se referme avant que le retardataire ait vu la question");

/* ============================ LES TABLEAUX ============================ */

titre("Les tableaux rendus par Firebase");

verifier("un vrai tableau passe tel quel",
  memeChose(SALON.enTableau([1, 2, 3]), [1, 2, 3]));
verifier("un objet à clés numériques redevient un tableau",
  memeChose(SALON.enTableau({ 0: "a", 1: "b", 2: "c" }), ["a", "b", "c"]));
verifier("les clés numériques sont remises dans l'ordre",
  memeChose(SALON.enTableau({ 2: "c", 0: "a", 1: "b" }), ["a", "b", "c"]),
  "les clés d'un objet JSON n'arrivent pas triées");
verifier("les clés au-delà de dix sont triées en nombres, pas en texte",
  memeChose(SALON.enTableau({ 0: "a", 10: "k", 2: "c" }), ["a", "c", "k"]),
  "un tri en texte mettrait 10 avant 2");
verifier("rien du tout donne un tableau vide", memeChose(SALON.enTableau(null), []));
verifier("les trous sont refermés",
  memeChose(SALON.enTableau([1, null, 3]), [1, 3]));

/* ============================== LES CODES ============================== */

titre("Le code d'un salon");

(function () {
  let n = 0;
  const faux = function () { const v = (n * 0.137) % 1; n++; return v; };
  const code = SALON.codeDepuis(faux, 4);
  verifier("le code fait quatre lettres", code.length === 4);
  verifier("le code n'emploie que l'alphabet prévu",
    code.split("").every(function (c) { return SALON.ALPHABET.indexOf(c) !== -1; }));

  verifier("l'alphabet évite I, O, Q, 0 et 1",
    ["I", "O", "Q", "0", "1"].every(function (c) {
      return SALON.ALPHABET.indexOf(c) === -1;
    }),
    "au téléphone on les confond, et le salon devient introuvable");

  /* Une valeur au bord ne doit pas sortir de l'alphabet. */
  verifier("un tirage à 1 exactement ne sort pas de l'alphabet",
    SALON.codeDepuis(function () { return 1; }, 4)
      .split("").every(function (c) { return SALON.ALPHABET.indexOf(c) !== -1; }));
  verifier("un tirage à 0 exactement ne sort pas de l'alphabet",
    SALON.codeDepuis(function () { return 0; }, 4) === "AAAA");

  /* Avec un vrai hasard, les codes ne doivent pas se répéter sans arrêt. */
  const vus = {};
  for (let i = 0; i < 400; i++) vus[SALON.codeDepuis(Math.random, 4)] = true;
  verifier("quatre cents ouvertures donnent presque autant de codes différents",
    Object.keys(vus).length > 380,
    "obtenu " + Object.keys(vus).length + " codes distincts sur 400");
})();

/* =============================== L'ADRESSE =============================== */

titre("L'adresse de la base");

verifier("l'adresse est bien formée",
  SALON.adresse("salons/ABCD") === "https://exemple.firebasedatabase.app/salons/ABCD.json");
verifier("une barre en trop ne casse rien",
  SALON.adresse("/salons/ABCD") === "https://exemple.firebasedatabase.app/salons/ABCD.json");

(function () {
  const avant = global.CONFIG.base;
  global.CONFIG.base = "https://x.firebasedatabase.app/";
  verifier("une barre finale dans la configuration ne casse rien",
    SALON.adresse("salons/A") === "https://x.firebasedatabase.app/salons/A.json",
    "c'est la faute qu'on fait en collant l'adresse depuis Firebase");
  global.CONFIG.base = "";
  verifier("sans adresse, le multijoueur se déclare éteint", SALON.configure() === false);
  global.CONFIG.base = avant;
  verifier("avec une vraie adresse, le multijoueur se déclare prêt",
    SALON.configure() === true);
})();

titre("Quelles adresses de base sont acceptées");

verifier("une base Firebase en https est acceptée",
  SALON.adresseAcceptable("https://quiz-quaregnon-default-rtdb.europe-west1.firebasedatabase.app"));
verifier("la machine locale est acceptée, pour pouvoir éprouver le salon",
  SALON.adresseAcceptable("http://localhost:8742"));
verifier("127.0.0.1 aussi", SALON.adresseAcceptable("http://127.0.0.1:9000/"));

verifier("un http vers l'extérieur est refusé",
  SALON.adresseAcceptable("http://exemple.com") === false,
  "l'adresse de la base passerait en clair sur le réseau");
verifier("un faux localhost n'ouvre pas la porte",
  SALON.adresseAcceptable("http://localhost.attaquant.example/x") === false,
  "l'exception doit se refermer sur le point qui suit le nom");
verifier("un https vide est refusé", SALON.adresseAcceptable("https://") === false);
verifier("du texte quelconque est refusé",
  SALON.adresseAcceptable("pas-une-adresse") === false);
verifier("rien du tout est refusé", SALON.adresseAcceptable("") === false);
verifier("autre chose qu'une chaîne est refusé",
  SALON.adresseAcceptable(null) === false && SALON.adresseAcceptable(42) === false);

console.log("");
console.log(controles + " contrôles, " + echecs + " échec" + (echecs > 1 ? "s" : "") + ".");
process.exit(echecs ? 1 : 0);
