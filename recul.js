/* ============================================================================
   Le recul — s'éloigner jusqu'à ce que le trou noir disparaisse.

   L'idée, d'Hugo : plutôt qu'une scène séparée pour les étoiles S, le vaisseau
   s'éloigne et l'on regarde l'astre rétrécir par la baie. Ce n'est pas de
   l'esthétique. Le disque devient invisible à cette distance, et c'est
   précisément le propos : on ne voit plus le trou noir, on voit des étoiles
   tourner autour de rien. C'est ainsi qu'on l'a découvert, trente ans avant
   d'en avoir une image.

   ---------------------------------------------------------------------------
   POURQUOI C'EST LOGARITHMIQUE

   Le rayon de Schwarzschild vaut 1,27 × 10^10 m ; le demi-grand axe de S2
   environ 1,5 × 10^14 m. Quatre décades. Un recul proportionnel au temps
   passerait quatre-vingt-dix-neuf pour cent du trajet à ne plus rien voir.

   On avance donc à vitesse constante EN DÉCADES : le nombre de chiffres croît
   linéairement. Chaque seconde multiplie la distance par le même facteur, ce
   qui est exactement ce que l'œil sait lire — il perçoit les rapports, pas les
   différences.

   ---------------------------------------------------------------------------
   LE QUADRILLAGE, ET POURQUOI IL EST INDISPENSABLE

   Dans le vide, rien ne prouve qu'on bouge. Pas de parallaxe, pas de bord qui
   défile : quatre décades ressemblent à un écran figé qui s'assombrit, et l'on
   conclut que ça a planté. Il faut un étalon.

   Sa maille vaut une puissance de dix ronde et porte sa valeur écrite. Le
   détail qui fait tout : elle garde la même taille à l'écran et se RENUMÉROTE
   en franchissant chaque décade. C'est ce saut d'étiquette, répété quatre
   fois, qui fait sentir la distance — bien plus qu'un compteur qu'on ne lit
   pas.

   Il ne paraît que pendant le mouvement, et se déclare pour ce qu'il est :
   rien ne quadrille l'espace. C'est la règle posée dans IDEES.md — la baie est
   honnête, la surcouche est déclarée.
   ============================================================================ */

(function(global){
"use strict";

const RS_M = 1.269e10;            // rayon de Schwarzschild de Sgr A*, en mètres
const UA_M = 1.495978707e11;

const etat = {
  actif: false,
  d0: 16*RS_M, d1: 16*RS_M,       // départ et arrivée, en mètres
  t: 0, duree: 0,                 // avancement de 0 à 1, et durée en secondes
  distance: 16*RS_M,              // distance courante
  tauBord: 0, tauLoin: 0,         // ce que le trajet aura coûté, en secondes
};

/* Lance un recul. La durée à l'écran n'a rien à voir avec la durée réelle du
   voyage : on montre en une quinzaine de secondes ce qui prendrait des mois.
   Le chronomètre, lui, dit la vérité. */
function lance(vers_m, secondesEcran){
  const v = global.VOYAGE.entre(etat.distance, vers_m);
  etat.actif = true;
  etat.d0 = etat.distance;
  etat.d1 = vers_m;
  etat.t = 0;
  etat.duree = secondesEcran || 14;
  etat.tauBord = v.tau;
  etat.tauLoin = v.t;
  return v;
}

// Une courbe d'accélération douce aux deux bouts : on ne démarre pas un
// vaisseau d'un coup, et l'on n'arrive pas en pile.
const adouci = x => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2;

function avance(dt){
  if(!etat.actif) return;
  etat.t = Math.min(1, etat.t + dt/etat.duree);
  const k = adouci(etat.t);
  // interpolation en logarithme : c'est le nombre de chiffres qui croît
  // linéairement, pas la distance.
  const l0 = Math.log10(etat.d0), l1 = Math.log10(etat.d1);
  etat.distance = Math.pow(10, l0 + (l1 - l0)*k);
  if(etat.t >= 1) etat.actif = false;
}

/* La décade courante et l'avancement dedans. C'est ce couple qui commande le
   quadrillage : la maille garde sa taille tant qu'on est dans la décade, et
   l'étiquette saute quand on en change. */
function decade(){
  const l = Math.log10(etat.distance / RS_M);   // en rayons de Schwarzschild
  return { entiere: Math.floor(l), fraction: l - Math.floor(l), log: l };
}

// L'étiquette d'une maille, dans l'unité qui parle à cette échelle.
function etiquette(rs){
  const m = rs * RS_M;
  if(m >= 0.5*UA_M) return arrondi(m/UA_M) + " UA";
  return arrondi(rs) + " rₛ";
}
function arrondi(x){
  if(x >= 100) return Math.round(x).toLocaleString("fr-FR");
  if(x >= 10)  return Math.round(x).toString();
  if(x >= 1)   return x.toFixed(1).replace(".", ",");
  return x.toFixed(2).replace(".", ",");
}

/* Dessine le quadrillage sur le calque à deux dimensions.

   Il est tracé en perspective au sol, dans le plan du disque, ce qui lui donne
   un point de fuite — c'est ce point de fuite qui fait qu'on sent le
   mouvement, bien plus qu'une grille plate.

   @param projette  fonction monde → écran, celle du salon
   @param force     0 à 1, pour l'apparition et l'effacement */
function dessineQuadrillage(ctx, W, H, projette, force){
  if(force <= 0.01) return;
  const d = decade();
  // la maille vaut la puissance de dix immédiatement inférieure à la distance
  const maille = Math.pow(10, d.entiere - 1);
  const n = 7;                              // lignes de part et d'autre

  ctx.save();
  ctx.globalAlpha = 0.20 * force;
  ctx.strokeStyle = "#8fb6ff";
  ctx.lineWidth = 1;
  const echelle = etat.distance / RS_M;
  /* La maille se donne en rayons, et c'est TOUT : aucun facteur d'échelle.

     Il y en avait un, `26/echelle`, et il annulait précisément l'effet
     recherché. La maille vaut le dixième de la distance en début de décade et
     le centième en fin ; à distance `echelle`, sa taille apparente passe donc
     de six degrés à un demi-degré, puis l'étiquette saute et tout repart. C'est
     ce battement, quatre fois répété, qui fait sentir le recul. Multiplier par
     l'inverse de la distance figeait la grille dans le monde, et elle
     rétrécissait sans jamais se renuméroter. */
  const k = 1;

  ctx.beginPath();
  for(let i = -n; i <= n; i++){
    const a = projette([i*maille*k, 0, -n*maille*k]);
    const b = projette([i*maille*k, 0,  n*maille*k]);
    if(a && b){ ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    const c = projette([-n*maille*k, 0, i*maille*k]);
    const e = projette([ n*maille*k, 0, i*maille*k]);
    if(c && e){ ctx.moveTo(c[0], c[1]); ctx.lineTo(e[0], e[1]); }
  }
  ctx.stroke();

  // L'étiquette : c'est elle qui fait sentir les décades, pas la grille.
  ctx.globalAlpha = 0.85 * force;
  ctx.fillStyle = "#a9c6ff";
  ctx.font = "11px ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillText("une case = " + etiquette(maille), 18, H - 46);
  ctx.globalAlpha = 0.55 * force;
  ctx.fillText("distance " + etiquette(echelle), 18, H - 30);
  ctx.restore();
}

global.RECUL = { etat, lance, avance, decade, etiquette, dessineQuadrillage,
                 RS_M, UA_M,
                 get actif(){ return etat.actif; } };

})(window);
