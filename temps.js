/* ============================================================================
   L'horloge.

   Troisième tranche du chantier F2, après `physique.js` et `vol.js`. Elle sort
   du bloc principal tout ce qui décide de l'heure qu'il est : le temps simulé,
   les crans de vitesse, les deux horloges du paradoxe des jumeaux, et le mode
   direct où le ciel se déduit d'une date absolue.

   ---------------------------------------------------------------------------
   POURQUOI CELLE-CI, ET CE QU'ELLE REND IMPOSSIBLE

   Parce que c'est là que le pire défaut de la semaine a vécu.

   Le disque d'accrétion tournait SIX CENT VINGT-DEUX FOIS trop vite en « temps
   réel ». Deux mécanismes incrémentaient la même horloge — la commande de la
   barre et celle du mur du salon — et régler l'une ne retirait pas l'autre.
   C'était mon erreur : en corrigeant la veille un disque qui ne suivait pas le
   mur, j'avais AJOUTÉ un écrivain au lieu d'aiguiller celui qui existait.

   La correction d'alors consistait à n'écrire qu'à un seul endroit. C'était
   juste, et c'était fragile : rien n'empêchait le prochain de recommencer. Une
   règle qu'on doit se rappeler n'est pas une règle, c'est un pari.

   Ici, `geo` n'est qu'un ACCESSEUR EN LECTURE. Il n'existe aucun moyen, depuis
   l'extérieur de ce fichier, d'avancer l'horloge autrement qu'en appelant
   `avance()`. Le second écrivain n'est plus interdit : il est indicible.

   C'est le même remède que le `lieu` unique, qui a rendu impossible d'être à
   deux endroits à la fois. La soupe de drapeaux et l'horloge à deux écrivains
   sont la même maladie.

   ---------------------------------------------------------------------------
   LE MODE DIRECT

   Le temps simulé s'y DÉDUIT d'une horloge absolue au lieu de s'accumuler. Deux
   personnes qui ouvrent la page à la même seconde voient alors rigoureusement le
   même ciel, sans rien synchroniser : il suffit qu'elles partagent l'origine.
   C'est ce qui rendra un salon commun possible.
   ============================================================================ */

(function(global){
"use strict";

const { SEC_PAR_UNITE, cadence } = global.PHYSIQUE;

// Les crans de la barre. Le premier est le temps réel — la vérité doit être
// parmi les choix, et non subie comme une accélération imposée.
const VITESSES = [
  { mult:1,    nom:"temps.v0" },
  { mult:60,   nom:"temps.v1" },
  { mult:600,  nom:"temps.v2" },
  { mult:3600, nom:"temps.v3" },
];

const EPOQUE = Date.UTC(2026, 0, 1) / 1000;     // origine fixe, en secondes
const R_MERE = 20;                              // le rayon de l'orbite du vaisseau

// ------------------------------------------------------------------ l'état
let geo = 0;        // temps simulé, en unités géométriques — LECTURE SEULE dehors
let pas = 0;        // le pas de l'image en cours, idem

const etat = {
  VITESSES, EPOQUE, R_MERE,

  cran: 2,          // l'indice dans VITESSES
  direct: false,    // le ciel se déduit d'une date absolue
  decalage: 0,      // écart avec l'horloge de référence

  /* Les deux horloges du paradoxe des jumeaux. Pour une orbite circulaire en
     Schwarzschild, dτ/dt = √(1 − 3M/r) : la dilatation gravitationnelle et celle
     de la vitesse s'y combinent. À l'ISCO, r = 3 r_s, elle vaut √½ — et c'est
     le plancher. Sans rotation, on ne peut pas ralentir son temps de plus d'un
     facteur √2. */
  horloge: { bord: 0, mere: 0 },

  get geo(){ return geo; },
  get pas(){ return pas; },

  maintenant(){ return Date.now()/1000 + this.decalage; },
  geoDirect(){ return (this.maintenant() - EPOQUE) / SEC_PAR_UNITE; },

  /* L'UNIQUE écrivain. `facteur` vient de l'appelant, parce que c'est le LIEU
     qui décide s'il faut écouter le mur du salon ou la barre — et le lieu n'est
     pas l'affaire de l'horloge. Rend le pas géométrique. */
  avance(dtSec, facteur){
    if(this.direct){
      const cible = this.geoDirect();   // temps réel strict : on ne triche pas
      pas = cible - geo;
      geo = cible;
    } else {
      pas = dtSec * facteur / SEC_PAR_UNITE;
      geo += pas;
    }
    return pas;
  },

  /* Les horloges de bord n'avancent que lorsqu'on est à bord de quelque chose.
     `r` est le rayon de l'objet suivi ; la mère reste à R_MERE. */
  bat(dtGeo, r){
    this.horloge.bord += dtGeo * SEC_PAR_UNITE * cadence(r);
    this.horloge.mere += dtGeo * SEC_PAR_UNITE * cadence(R_MERE);
  },

  // Pour le harnais, qui doit pouvoir replacer l'horloge où il veut sans que
  // cela ouvre une porte au reste du programme.
  pose(t){ geo = t; pas = 0; },
};

global.TEMPS = etat;

})(typeof window !== "undefined" ? window : globalThis);
