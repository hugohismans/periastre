/* ============================================================================
   LA ROTATION DU TROU NOIR D'ÉTUDE — une valeur continue, et ce qu'on en dit.

   Hugo, 9 août 2026 : « j'aimerais que ce soit un slider, pas des valeurs fixes,
   qu'on puisse mettre de zéro jusqu'à une valeur extrême, et vraiment tester
   toutes les valeurs du spin. »

   Le trou noir d'étude est l'endroit du site où l'on regarde ce que la physique
   AUTORISE, par opposition à ce qu'on MESURE. Quatre boutons y répondaient mal :
   ils donnaient quatre points d'un continuum, et le continuum est justement le
   sujet — l'ISCO se resserre, l'ombre se déforme, la couture apparaît.

   ---------------------------------------------------------------------------
   POURQUOI ÇA S'ARRÊTE AVANT UN

   Le spin réduit `a*` vaut, par définition, le moment cinétique rapporté à ce
   qu'un trou noir de cette masse peut porter au maximum. À `a* = 1` — le cas
   « extrémal » — l'horizon et la dernière orbite stable se confondent, et les
   formules fermées de Bardeen, Press & Teukolsky perdent leur sens en même
   temps que le nuanceur perd sa précision.

   Ce n'est pas une limite d'affichage, c'est une limite physique : on pense
   qu'un trou noir réel ne peut pas être poussé jusque-là, parce que la matière
   qui l'accélère rayonne d'autant plus qu'il tourne vite. La borne retenue est
   `0,998`, dite « limite de Thorne » (1974) — la valeur au-delà de laquelle un
   disque d'accrétion cesse de pouvoir accélérer son trou noir.

   C'est donc un vrai fait, et il a sa place dans ce module plutôt que dans un
   nombre magique au fond de la page.

   ---------------------------------------------------------------------------
   LE CONTRAT

     SPIN.MAX            0.998 — la limite de Thorne
     SPIN.PAS            le pas du curseur
     SPIN.BANDES         les quatre régimes, avec leur clé de note
     SPIN.borne(v)       ramène n'importe quoi dans [0, MAX]
     SPIN.bande(v)       le régime où tombe une valeur → { i, cle, nom }
     SPIN.descripteur(v) { valeur, texte, bande } — ce que la page peint

   Rien ne lit `window`, rien ne touche au document : la page fabrique le
   curseur, ce module dit seulement ce qu'il vaut et ce qu'on en dit.
   ============================================================================ */

(function(global){
"use strict";

/* La limite de Thorne. Voir l'en-tête : ce n'est pas un arrondi de confort mais
   la borne au-delà de laquelle un disque d'accrétion ne peut plus accélérer son
   trou noir — le rayonnement qu'il émet le freine autant qu'il le pousse. */
const MAX = 0.998;

/* Un millième. Assez fin pour que le resserrement de l'ISCO se voie en glissant,
   assez gros pour que le curseur ne produise pas mille recalculs par seconde du
   nuanceur — qui coûte neuf fois plus cher quand la rotation n'est pas nulle. */
const PAS = 0.001;

/* Les quatre régimes gardent les clés de texte des anciens boutons : les notes
   sont écrites, sourcées, traduites dans les deux langues, et rien ne justifie
   de les réécrire parce que le réglage a changé de forme.

   `jusqua` est la borne HAUTE de la bande, incluse. Les seuils sont placés au
   milieu des anciennes valeurs fixes — 0 / 0,6 / 0,9 / 0,95 — pour qu'un
   curseur posé sur l'une d'elles retrouve exactement la note qu'elle avait. */
const BANDES = [
  { jusqua: 0,     cle: "panneau.spin.aucune.note",  nom: "panneau.spin.aucune"  },
  { jusqua: 0.75,  cle: "panneau.spin.moderee.note", nom: "panneau.spin.moderee" },
  { jusqua: 0.925, cle: "panneau.spin.rapide.note",  nom: "panneau.spin.rapide"  },
  { jusqua: MAX,   cle: "panneau.spin.extreme.note", nom: "panneau.spin.extreme" },
];

/* Tout ce qui entre est ramené dans les bornes, y compris ce qui n'est pas un
   nombre. Une mémoire d'il y a six mois, un curseur d'un navigateur qui arrondit
   autrement, un `NaN` — aucun ne doit pouvoir sortir d'ici. */
function borne(v){
  const x = Number(v);
  if(!Number.isFinite(x)) return 0;
  return Math.min(MAX, Math.max(0, x));
}

/* Zéro est une bande à lui seul, et c'est voulu : « aucune rotation » n'est pas
   le bas d'un continuum, c'est un cas qualitativement différent — pas de
   couture, pas d'entraînement, la métrique redevient celle de Schwarzschild. */
function bande(v){
  const x = borne(v);
  for(let i = 0; i < BANDES.length; i++) if(x <= BANDES[i].jusqua) return { i, ...BANDES[i] };
  return { i: BANDES.length - 1, ...BANDES[BANDES.length - 1] };
}

/* Ce que la page peint. `texte` est le nombre tel qu'on l'écrit à l'écran —
   trois décimales, parce que le pas en fait autant et qu'afficher moins ferait
   croire que le curseur saute. */
function descripteur(v){
  const x = borne(v);
  return { valeur: x, texte: x.toFixed(3), bande: bande(x) };
}

global.SPIN = { MAX, PAS, BANDES, borne, bande, descripteur };

})(window);
