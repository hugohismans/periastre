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
  parcouru: 0,                    // distance déjà franchie, en mètres
  vol: null,                      // l'état physique courant — voir `avance`
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
  etat.parcouru = 0;
  etat.vol = null;
  return v;
}

/* ---------------------------------------------------------------------------
   LA POSITION EST CELLE DU VRAI VOL À 1 g. IL N'Y A PLUS DE COURBE DE CONFORT.

   Il y avait ici une interpolation lissée du logarithme de la distance, choisie
   parce qu'elle était agréable, pendant que le chronomètre calculait le vrai
   vol relativiste. Deux descriptions du même voyage, qui ne se ressemblaient
   pas.

   J'AI HÉSITÉ, ET JE ME SUIS TROMPÉ DANS LES DEUX SENS. D'abord j'ai basculé
   sur le profil physique, puis je suis revenu à la courbe de confort en voyant
   que la seconde moitié du trajet couvrait à peine trois dixièmes de décade
   contre deux virgule sept pour la première — j'ai lu ça comme « la seconde
   moitié ne bouge plus ».

   C'était la DÉCÉLÉRATION, et c'est le sujet. Hugo, 7 août au soir : « on reste
   dans l'idée de la simulation, donc il faut que ce soit précis. Au début ça va
   aller doucement, puis au milieu du trajet à sa vitesse maximale, puis ça va
   re-ralentir parce qu'on décélère jusqu'à l'arrivée. » Ce que je prenais pour
   un défaut d'animation est exactement ce qu'un vaisseau qui freine donne à
   voir.

   Le temps d'écran est donc proportionnel au temps PROPRE, et la position vient
   de `VOYAGE.etat`. Trois conséquences :

   - le mouvement vu et le chiffre affiché ne peuvent plus diverger, puisqu'ils
     sortent du même calcul ;
   - le départ et l'arrivée sont doux GRATUITEMENT, la vitesse valant zéro aux
     deux bouts — c'est ce que l'ancienne courbe imitait à la main ;
   - le seul artifice restant est la COMPRESSION du temps, quatorze secondes
     d'écran pour des mois de vol, et le site le déclare déjà.                */
function avance(dt){
  if(!etat.actif) return;
  etat.t = Math.min(1, etat.t + dt/etat.duree);

  const D = Math.abs(etat.d1 - etat.d0);
  const sens = etat.d1 >= etat.d0 ? 1 : -1;
  if(D > 0 && global.VOYAGE && global.VOYAGE.etat){
    // Le temps d'écran est proportionnel au temps PROPRE : une seconde
    // d'animation vaut toujours la même tranche d'horloge du bord.
    const tauTotal = global.VOYAGE.etat(D, 0).tauTotal;
    const e = global.VOYAGE.etat(D, etat.t * tauTotal);
    etat.vol = e;
    etat.parcouru = e.s;
    etat.distance = etat.d0 + sens*e.s;
  } else {
    etat.vol = null;
    etat.parcouru = 0;
    etat.distance = etat.d1;
  }

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
const N = 7;                                        // lignes de part et d'autre
const ETAGES = [[0, 1], [-3, 0.42], [3, 0.42]];     // hauteur en mailles, opacité

function nappe(ctx, projette, maille, force, W, H){
  if(force <= 0.004) return;
  const n = N;

  for(const [h, poids] of ETAGES){
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
  montants(ctx, projette, maille, force, W, H);
}

/* LES MONTANTS — ce qui fait qu'on voit un volume et non des tapis.

   Trois nappes empilées se lisent encore comme trois nappes : rien ne dit
   qu'elles appartiennent au même objet, et l'œil n'a de fuite que dans le plan.
   Hugo, trois fois plutôt qu'une, la dernière le 6 août : « j'aimerai que le
   quadrillage soit 3d, vertical aussi, là on a qu'une grille horizontale. »

   Ce sont les arêtes verticales qui donnent la troisième fuite. Elles relient
   les étages, et c'est cette liaison — pas leur nombre — qui fait le volume.

   TROIS CHOIX, ET LEURS RAISONS :

   Une colonne sur deux. Les poser toutes rendrait la baie illisible ; le repère
   doit rester une aide de lecture, et il est déjà déclaré comme telle.

   Aucune ne passe par le centre. Les indices sont impairs, si bien que le
   trou noir n'est jamais barré par un trait vertical — il est le sujet, pas un
   nœud du quadrillage.

   Elles ne sont PAS assombries. Premier jet, je les avais mises à moitié
   d'opacité, en supposant qu'une arête verticale traverse toute la hauteur de
   l'image et pèserait donc plus lourd à l'œil. Mesure faite sur une vraie image
   depuis la baie : elles font 803 pixels de long en moyenne contre 1060 aux
   horizontales — elles sont plus COURTES, pas plus longues, parce qu'elles ne
   couvrent que six mailles de haut là où les autres en traversent quatorze.

   À 0,081 contre 0,217, elles étaient sous le seuil du visible, et la demande
   serait revenue une quatrième fois. Le léger retrait qui reste vient de la
   décroissance par anneau, qui commence à un cran du centre.

   On les groupe par anneau parce que leur opacité ne dépend que de
   l'éloignement au centre : quatre tracés au lieu de soixante-quatre.

   ---------------------------------------------------------------------------
   POURQUOI ON DÉCOUPE, ET POURQUOI ON JETTE LES TRONÇONS TROP LONGS

   `projette` rend `null` en deçà du plan rapproché. Une arête tracée d'un seul
   trait disparaît donc ENTIÈREMENT dès qu'une seule de ses deux extrémités passe
   derrière ce plan — et comme un montant est haut de six mailles, c'est-à-dire
   la moitié de la distance au trou noir, ça lui arrive tout le temps. Mesuré
   depuis la baie, en pleine décade : deux montants dessinés sur soixante-quatre.

   Les deux survivants étaient pires que l'absence. Une extrémité posée juste au
   bord du plan rapproché projette à l'infini : ils faisaient quatorze mille
   pixels de long, deux traits qui balaient l'écran sans rien vouloir dire.

   On découpe donc chaque montant, et l'on juge tronçon par tronçon. Ce qui
   passe derrière le plan tombe seul, le reste tient. Et l'on écarte tout
   tronçon dont la longueur à l'écran n'a plus de sens — c'est le symptôme d'une
   extrémité rasant le plan rapproché, jamais celui d'une arête honnête. */
const DECOUPE = 6;                 // tronçons par montant

function montants(ctx, projette, maille, force, W, H){
  const n = N;
  const bas  = Math.min(...ETAGES.map(e => e[0])) * maille;
  const haut = Math.max(...ETAGES.map(e => e[0])) * maille;
  const limite = 2 * Math.hypot(W, H);          // au-delà, c'est une aberration

  for(let anneau = 1; anneau <= n; anneau += 2){
    ctx.globalAlpha = 0.22 * force * (1 - anneau/(n + 1));
    if(ctx.globalAlpha < 0.004) continue;
    ctx.beginPath();
    let trace = false;
    for(let i = -n; i <= n; i += 2)
      for(let j = -n; j <= n; j += 2){
        if(Math.max(Math.abs(i), Math.abs(j)) !== anneau) continue;
        let prec = projette([i*maille, bas, j*maille]);
        for(let k = 1; k <= DECOUPE; k++){
          const y = bas + (haut - bas) * k/DECOUPE;
          const p = projette([i*maille, y, j*maille]);
          if(prec && p && Math.hypot(p[0]-prec[0], p[1]-prec[1]) < limite){
            ctx.moveTo(prec[0], prec[1]); ctx.lineTo(p[0], p[1]); trace = true;
          }
          prec = p;
        }
      }
    if(trace) ctx.stroke();
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
  nappe(ctx, projette, fine,      force * (1 - f), W, H);
  nappe(ctx, projette, fine * 10, force * f,       W, H);

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
