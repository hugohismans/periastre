/* ============================================================================
   LE REGISTRE TEMPOREL — ce que chaque voyage a coûté aux deux horloges.

   Chaque trajet inscrit sa ligne : ce qu'on a fait, et ce que ça a coûté à
   l'horloge du bord et à celle de la Terre. C'est un REGISTRE, pas une
   simulation — on enregistre ce qui s'est passé, on n'intègre rien en continu.

   Et il se fige quand on s'en va. C'était tranché : un compteur qui courrait en
   l'absence du joueur récompenserait l'attente au lieu du voyage, ce qui est
   l'inverse de ce qu'on veut enseigner.

   ---------------------------------------------------------------------------
   POURQUOI LA MÉMOIRE ARRIVE EN ARGUMENT

   Le 7 août 2026, une séance de jugement a laissé un réglage lourd dans la
   mémoire du navigateur et divisé par huit la cadence du site sur le téléphone
   d'Hugo. Personne ne l'a vu venir parce que rien de ce qui touche à cette
   mémoire n'était éprouvable hors navigateur.

   Ici, elle arrive par `pose(memoire)` — un objet qui sait lire et écrire. Un
   outil lui en donne une fausse, joue cent voyages, et vérifie ce qui se passe,
   sans navigateur et sans rien salir.

   ---------------------------------------------------------------------------
   CE QU'IL PORTERA PEUT-ÊTRE

   `cap.html` propose d'en faire le « carnet du voyageur » : cumuler l'écart de
   tous les trajets et le dire à la première personne — « depuis ta première
   mission tu as vécu quatre ans, la Terre en a vécu trente et un mille ». Tout
   est déjà là ; il n'y manque qu'une décision.
   ============================================================================ */

(function(global){
"use strict";

/* Quarante lignes, et pas une de plus.

   Ce n'est pas une limite de place — c'est que le registre sert à LIRE une
   histoire, et qu'une histoire de deux cents lignes ne se lit plus. Les plus
   anciennes sortent par le début. */
const MAX = 40;

let lignes = [];
let memoire = null;

/* `pose` accepte une mémoire absente : en navigation privée, `localStorage`
   lève à la première écriture. Le registre marche alors le temps de la visite
   et s'oublie en partant, ce qui vaut mieux qu'une page morte. */
function pose(m){
  memoire = m || null;
  lignes = [];
  if(!memoire) return lignes;
  try {
    const lu = memoire.lit();
    if(Array.isArray(lu)) lignes = lu.filter(estLigne).slice(-MAX);
  } catch(e){ lignes = []; }
  return lignes;
}

/* Une ligne mal formée est écartée à la lecture, pas à l'usage.

   La mémoire d'un navigateur survit aux versions du site : une ligne écrite par
   une version d'il y a six mois peut ne plus avoir la forme attendue. La
   rejeter ici coûte une fonction ; la découvrir au moment de faire la somme
   donne un `NaN` qui se propage à tout l'affichage. */
function estLigne(e){
  return e && typeof e === "object"
      && Number.isFinite(e.tau) && Number.isFinite(e.t);
}

/* Inscrit un trajet. `v` vient de `VOYAGE.entre` : { tau, t, d_m }.
   Rend true si la ligne a été retenue. */
function inscrit(quoi, v){
  if(!v || !Number.isFinite(v.tau) || !Number.isFinite(v.t)) return false;
  lignes.push({ q: quoi, tau: v.tau, t: v.t, d: v.d_m, quand: Date.now() });
  if(lignes.length > MAX) lignes.shift();
  if(memoire){ try { memoire.ecrit(lignes); } catch(e){ /* mémoire pleine ou refusée */ } }
  return true;
}

/* L'écart accumulé entre les deux horloges, en secondes.

   C'est le seul chiffre qui compte vraiment : le temps qu'on a gagné sur ceux
   qui sont restés. Il ne peut pas être négatif — un voyage relativiste fait
   toujours vieillir le voyageur MOINS que celui qui attend — donc une somme
   négative signale une ligne corrompue et non un paradoxe. */
function ecart(){
  const s = lignes.reduce((a, e) => a + (e.t - e.tau), 0);
  return Number.isFinite(s) ? Math.max(0, s) : 0;
}

// Une copie, jamais la liste elle-même : un appelant qui la modifierait
// écrirait dans le registre sans passer par `inscrit`, et la mémoire ne
// suivrait pas. Deux écrivains pour une valeur, la maladie du dépôt.
function tout(){ return lignes.map(e => Object.assign({}, e)); }

global.REGISTRE = { pose, inscrit, ecart, tout, MAX };

})(window);
