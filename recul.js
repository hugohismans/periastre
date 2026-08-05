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

/* Un seul étage du quadrillage, à une maille donnée.

   Trois nappes parallèles plutôt qu'une seule : le repère doit se lire comme un
   VOLUME. Une nappe unique, vue de biais, ressemble à un tapis posé dans le
   vide avec le trou noir posé dessus — on croit voir un objet là où il n'y a
   qu'une aide de lecture. Trois nappes espacées, dont deux plus pâles, donnent
   l'épaisseur, et le point de fuite se lit alors dans les trois.

   Chaque ligne porte en outre son propre alpha, décroissant vers le bord, pour
   que la grille se dissolve au lieu de s'arrêter net sur un rectangle. */
function nappe(ctx, projette, maille, force){
  if(force <= 0.004) return;
  const n = 7;                              // lignes de part et d'autre
  const etages = [[0, 1], [-3, 0.42], [3, 0.42]];   // hauteur en mailles, opacité

  for(const [h, poids] of etages){
    const y = h * maille;
    for(let i = -n; i <= n; i++){
      ctx.globalAlpha = 0.22 * force * poids * (1 - Math.abs(i)/(n + 1));
      if(ctx.globalAlpha < 0.004) continue;
      ctx.beginPath();
      const a = projette([i*maille, y, -n*maille]);
      const b = projette([i*maille, y,  n*maille]);
      if(a && b){ ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
      const c = projette([-n*maille, y, i*maille]);
      const e = projette([ n*maille, y, i*maille]);
      if(c && e){ ctx.moveTo(c[0], c[1]); ctx.lineTo(e[0], e[1]); }
      ctx.stroke();
    }
  }
}

/* Dessine le quadrillage sur le calque à deux dimensions.

   La maille se donne en rayons, sans aucun facteur d'échelle : elle vaut le
   dixième de la distance en début de décade et le centième en fin, si bien que
   sa taille apparente décroît de six degrés à un demi-degré. C'est ce
   resserrement, répété quatre fois, qui fait sentir le recul.

   ---------------------------------------------------------------------------
   POURQUOI DEUX MAILLES À LA FOIS

   Avec une seule, la grille SAUTE à chaque décade : dix lignes sur onze
   disparaissent d'un coup et l'on voit un à-coup au lieu d'un éloignement.
   C'est le défaut qu'Hugo a relevé, et il est juste.

   On en dessine donc deux en permanence, distantes d'un facteur dix, fondues
   l'une dans l'autre par la position dans la décade. La fine se resserre et
   s'éteint ; la grossière, d'abord trop lâche pour être lue, s'allume à mesure
   qu'elle devient la bonne. À aucun instant la densité apparente ne change
   brutalement — les nœuds se rapprochent, et d'autres naissent entre eux.

   @param projette  fonction monde → écran, celle du salon
   @param force     0 à 1, pour l'apparition et l'effacement */
function dessineQuadrillage(ctx, W, H, projette, force){
  if(force <= 0.01) return;
  const d = decade();
  const echelle = etat.distance / RS_M;

  ctx.save();
  ctx.strokeStyle = "#8fb6ff";
  ctx.lineWidth = 1;

  // Un fondu adouci aux deux bouts : au milieu de la décade les deux nappes
  // coexistent franchement, ce qui est exactement le moment où l'œil a besoin
  // des deux pour ne pas perdre le fil.
  const f = d.fraction * d.fraction * (3 - 2*d.fraction);
  const fine = Math.pow(10, d.entiere - 1);
  nappe(ctx, projette, fine,      force * (1 - f));
  nappe(ctx, projette, fine * 10, force * f);

  // L'étiquette suit la maille DOMINANTE, et c'est elle qui fait sentir les
  // décades — un chiffre qui saute une fois, quand la grille, elle, coule.
  const maille = f < 0.5 ? fine : fine * 10;
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
