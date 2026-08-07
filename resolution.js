/* ============================================================================
   LA RÉSOLUTION ADAPTATIVE — on préfère la fluidité au piqué.

   Elle vivait au cœur de la boucle de rendu, donc `VERIF.resolution()` exigeait
   un navigateur pour l'éprouver. C'est pourtant une décision entièrement
   arithmétique : on lui donne un temps moyen par image et l'état courant, elle
   rend le palier suivant. Rien là-dedans n'a besoin d'un écran.

   ---------------------------------------------------------------------------
   POURQUOI DES PALIERS, ET NON DEUX ÉTATS

   Il n'y en avait que deux — net ou flou — ce qui laissait un appareil trop lent
   pour le second sans nulle part où aller. Le seul levier réel est l'AIRE du
   tampon : mesuré, quatre cents pas d'intégration rendent au pixel près comme
   cent vingt, tandis que le temps d'image suit l'aire. Autant, alors, que
   l'échelle ait des degrés. Les aires vont de 1 à 0,13 : de quoi tenir sur un
   appareil huit fois moins puissant que celui pour lequel le rendu a été écrit.
   Le dernier cran est laid, et il vaut toujours mieux qu'une image qui saccade.

   ---------------------------------------------------------------------------
   POURQUOI ELLE EST COLLANTE DANS LE SENS DE LA REMONTÉE

   Changer la taille du tampon SE VOIT : l'image devient nette ou floue d'un
   coup. Or la charge varie avec l'orbite — au périastre l'astre emplit le champ
   et le lancer de rayons coûte plus cher qu'à l'apoastre. Sur une machine
   juste, la moyenne traverserait le seuil une fois par tour, et l'on verrait
   l'image sauter à chaque passage.

   On descend donc VITE et l'on remonte LENTEMENT, d'un cran à la fois, et
   seulement après trente secondes sans le moindre à-coup. Toute lenteur, même
   passagère, repousse le retour au piqué.
   ============================================================================ */

(function(global){
"use strict";

const PALIERS = [1.0, 0.78, 0.62, 0.48, 0.36];

/* Les trois seuils, en millisecondes par image.

   26 pour descendre : c'est déjà sous quarante images par seconde, et l'œil le
   sent. 9 pour remonter : il faut une marge franche, sinon on remonte pour
   redescendre aussitôt. 14 pour armer l'attente : entre les deux, on ne bouge
   pas mais on ne fait pas non plus comme si tout allait bien. */
const DESCEND = 26, REMONTE = 9, INQUIET = 14;
const PATIENCE = 30000;      // trente secondes de calme avant de regagner un cran

/* decide(moy, echelle, now, tCalme) → { echelle, tCalme }

   `moy`    le temps moyen par image sur la fenêtre écoulée, en millisecondes
   `echelle` le palier courant
   `now`    l'horloge de la boucle
   `tCalme` le dernier moment où la résolution a bougé, ou où ça a ramé

   Rend toujours les deux, même inchangés : l'appelant compare et n'a pas à
   deviner ce qui s'est passé. */
function decide(moy, echelle, now, tCalme){
  const i = PALIERS.indexOf(echelle);
  let e = echelle, t = tCalme;

  if(!Number.isFinite(moy) || i < 0) return { echelle, tCalme };

  if(moy > DESCEND && i < PALIERS.length - 1){
    e = PALIERS[i + 1]; t = now;
  } else if(moy < REMONTE && i > 0 && now - tCalme > PATIENCE){
    e = PALIERS[i - 1]; t = now;
  }
  if(moy > INQUIET) t = now;     // toute lenteur repousse le retour au piqué
  return { echelle: e, tCalme: t };
}

global.RESOLUTION = { PALIERS, decide, DESCEND, REMONTE, INQUIET, PATIENCE };

})(window);
