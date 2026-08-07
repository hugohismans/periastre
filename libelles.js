/* ============================================================================
   LES LIBELLÉS DE L'INTERFACE — LA TABLE, ET RIEN QUE LA TABLE.

   Au chargement, la page repeint son propre balisage depuis les chaînes : le
   HTML garde le français en dur — c'est ce qu'on voit si un fichier de langue
   manque, et un écran de boutons français vaut mieux qu'un écran de boutons
   vides — mais l'autorité est dans `ui.fr.js` / `ui.en.js`.

   Ce module ne contient AUCUNE logique. Il ne touche ni au DOM, ni à `T`, ni à
   `window.UI`. Il ne porte que la correspondance « cet endroit de l'écran ↔
   cette clé de langue ». C'est justement ce qui le rend contrôlable hors
   navigateur : `outil-verif-libelles.js` croise ces trois tables avec les deux
   fichiers de langue et avec le balisage d'`index.html`, et il refuse une clé
   qui n'existe pas dans les deux langues.

   Ce contrôle-là est la raison d'être du fichier. Aujourd'hui une clé inventée
   affiche son propre nom à l'écran — `T` rend la clé quand elle manque, et
   c'est le bon comportement : le manque se voit. Mais il ne se voit qu'en
   ouvrant la page DANS CETTE LANGUE-LÀ, ce que personne ne fait à chaque
   commit. La table sortie du code, ça devient une commande.

   ---------------------------------------------------------------------------
   LA FORME, ET LA SEULE ENTORSE AU CONTRAT DEMANDÉ

       textes    : [[id, cle], …]              → $(id).textContent = T(cle)
       attributs : [[id, attribut, cle], …]    → $(id).setAttribute(…, T(cle))
       elements  : [[id, remonte, cle], …]     → l'étiquette qui COIFFE l'élément

   Les deux premières sont exactement celles de la page. La troisième était
   demandée en paires `[nom, cle]` ; elle est ici en triplets, et voici
   pourquoi. Dans `index.html` cette table ne désigne pas des variables mais des
   expressions — huit `$("…")` et deux `$("…").parentElement` — et elle ne pose
   pas le texte sur l'élément désigné : elle le pose sur son VOISIN DE GAUCHE,
   le `<div class="etiq">` qui coiffe le bloc de réglages. L'élément n'est
   qu'une adresse, choisie parce qu'il est le seul du bloc à porter un `id`.

   Une paire `[id, cle]` ne saurait donc pas distinguer `$("langue-choix")` de
   `$("b-traj").parentElement`, et la page devrait remettre ce cas particulier
   dans son code — ce qui rendrait l'extraction inutile. Le drapeau `remonte`
   dit « l'étiquette coiffe le PARENT de cet élément, pas lui ». C'est un mot
   de plus dans la table, et une ligne de moins dans la page.

   Rien d'autre ne change : le module ne connaît que des chaînes, il ne voit
   aucun élément, et c'est la page qui fait les trois boucles.

   ---------------------------------------------------------------------------
   CE QUE CETTE TABLE NE COUVRE PAS, ET C'EST VOULU

   Un libellé qui DÉPEND D'UN ÉTAT n'a rien à faire ici. « Venir à bord » /
   « Quitter le salon », « Lumière réelle » / « Rallumer », les sondes qui
   montent et redescendent : ces boutons sont repeints par les bascules, plus
   bas dans la page, et la clé y est choisie par une condition. Les mettre dans
   une table figée donnerait deux écrivains pour un même texte — la maladie qui
   a donné le disque à 622×. La table ne pose que le libellé AU REPOS, celui du
   premier affichage ; la bascule reste maîtresse de la suite.

   Ne sont pas non plus ici les textes posés par `querySelector` (le titre du
   site, les trois compteurs, le dossier de méthode, les deux étiquettes du
   chronomètre) : ils se désignent par une position dans le balisage et non par
   un `id`, et une table d'`id` mentirait sur ce qu'elle sait.
   ============================================================================ */

(function(global){
"use strict";

/* ---- les textes de boutons et de titres ---------------------------------- */
const textes = [
  ["b-pluie",    "dock.pluie"],
  ["b-photon",   "dock.photon"],
  ["b-vide",     "dock.effacer"],
  ["b-reel",     "dock.reel"],
  ["b-spectre",  "dock.spectre"],
  ["b-temps",    "dock.temps"],
  ["b-salon",    "dock.salon"],
  ["b-sonde",    "dock.sonde"],
  ["b-traj",     "panneau.traj"],
  ["b-cours",    "titre.cours"],
  ["b-menu",     "stats.menu"],
  ["tp-titre",   "temps.titre"],
  ["b-missions", "panneau.missions"],
  ["b-quete",    "panneau.quete"],
  ["b-methode",  "panneau.methode"],
  ["spin-note",  "panneau.spin.note"],
  ["d-journal",  "panneau.journal"],
  ["couche",     "salon.tourne"],
  ["t-saut",     "salon.manette.saut"],
  ["b-lancer",   "banc.lancer"],
];

/* ---- les infobulles et les étiquettes d'accessibilité --------------------- *
   Elles comptent autant que le reste : elles sont le SEUL texte de la page
   pour qui l'écoute au lieu de la lire. Un même élément peut apparaître deux
   fois — `b-bulle-fermer` porte `title` et `aria-label` — donc ce qui doit
   être unique ici, c'est le couple (identifiant, attribut), pas l'identifiant. */
const attributs = [
  ["rouage",         "title",      "stats.reglages"],
  ["b-cours",        "title",      "titre.cours.montrer"],
  ["m-fermer",       "title",      "mission.masquer"],
  ["q-fermer",       "title",      "quete.passer"],
  ["f-prec",         "aria-label", "fiches.precedente"],
  ["f-suiv",         "aria-label", "fiches.suivante"],
  ["lumen-corps",    "aria-label", "lumen.parler"],
  ["b-voix",         "title",      "lumen.voix.lire"],
  ["b-bulle-fermer", "title",      "lumen.fermer"],
  ["b-bulle-fermer", "aria-label", "lumen.fermer"],
  ["d-fermer",       "aria-label", "dossier.fermer"],
];

/* ---- les étiquettes des blocs de réglages -------------------------------- *
   [identifiant, remonte, clé] — `remonte` vaut vrai quand l'étiquette coiffe
   le PARENT de l'élément désigné. Les deux seuls cas sont des boutons rangés
   dans une `.rangee` : c'est la rangée qui suit l'étiquette, pas le bouton. */
const elements = [
  ["b-traj",         true,  "panneau.etiq.affichage"],
  ["langue-choix",   false, "panneau.langue"],
  ["voix-choix",     false, "panneau.etiq.voix"],
  ["spin-choix",     false, "panneau.etiq.spin"],
  ["volume",         false, "panneau.etiq.volume"],
  ["volume-musique", false, "panneau.etiq.musique"],
  ["mode-acces",     false, "panneau.etiq.acces"],
  ["anecdotes",      false, "panneau.etiq.lumen"],
  ["taille-sondes",  false, "panneau.etiq.taille"],
  ["b-missions",     true,  "panneau.etiq.guide"],
];

global.LIBELLES = { textes, attributs, elements };

})(window);
