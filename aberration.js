/* ============================================================================
   L'ABERRATION — le ciel qui se resserre devant soi.

   Demandé par Hugo le 9 août 2026 : « si tu t'approches de la vitesse de la
   lumière, visuellement on voit les étoiles qui se, le ciel qui se resserre
   devant nous, et j'aimerais bien que cet effet soit mis en place. »

   Ce n'est pas un effet. C'est ce qu'on verrait, et c'est calculable — donc ça
   se calcule. Le vaisseau passe l'essentiel du trajet vers le système solaire
   au-dessus de 0,9999 c : à cette vitesse, la moitié arrière du ciel est
   rabattue dans un petit disque devant, et ce qu'on regarde n'a plus rien à voir
   avec le ciel du repos.

   ---------------------------------------------------------------------------
   LES TROIS CHOSES QUI CHANGENT, ET QU'ON SÉPARE

   1. LA DIRECTION. Une étoile vue à 90° au repos se déplace vers l'avant. La
      formule tient sur une ligne, et c'est celle de l'aberration relativiste :

          cos θ' = (cos θ + β) / (1 + β cos θ)

      où θ est l'angle entre la vitesse et la direction de l'étoile dans le
      repère où le ciel est au repos, et θ' le même angle vu du bord.

      Le nuanceur, lui, part de l'écran : il a θ' et cherche θ. C'est la même
      formule avec −β, et c'est `versCiel` qui la porte. Les deux existent parce
      qu'un contrôle peut alors exiger qu'elles soient réciproques — sans quoi
      une erreur de signe donnerait un ciel qui se resserre DERRIÈRE, ce qui est
      exactement le genre de faute qu'on ne voit pas en regardant.

   2. LA COULEUR. La lumière de devant est décalée vers le bleu, celle de
      derrière vers le rouge, du facteur Doppler relativiste

          D = 1 / [ γ (1 − β cos θ') ]

      θ' étant l'angle DÉJÀ aberré — l'ordre compte, et l'inverser donne un
      résultat plausible et faux.

   3. L'ÉCLAT. L'intensité intégrée d'une source ponctuelle varie comme D⁴ : un
      facteur du transport de la luminance spécifique le long du rayon, que la
      relativité restreinte donne sans modèle ni réglage. À 0,9999 c, l'avant
      gagne un facteur 10⁹ et l'arrière le perd — c'est ce qui rend le ciel
      d'arrière NOIR, plus encore que le resserrement.

   ---------------------------------------------------------------------------
   CE QUE CE FICHIER NE FAIT PAS

   Il ne dessine rien, ne connaît ni écran ni nuanceur, et n'a pas d'opinion sur
   ce qu'il faut montrer. Il rend des nombres. Le choix de ce qu'on peint avec —
   jusqu'où pousser l'éclat sans brûler l'image, faut-il un mode qui l'atténue —
   est une décision d'image, et elle appartient à l'œil d'Hugo.

   ---------------------------------------------------------------------------
   LE CONTRAT

     AB.versBord(cosTheta, beta)   cos θ au repos → cos θ' vu du bord
     AB.versCiel(cosTheta, beta)   l'inverse : ce dont le nuanceur a besoin
     AB.doppler(cosBord, beta)     le facteur D, à partir de l'angle ABERRÉ
     AB.eclat(D)                   D⁴
     AB.demiCiel(beta)             l'angle qui contient la moitié avant du ciel
   ============================================================================ */

(function(global){
"use strict";

/* Une vitesse qu'on peut employer sans crainte. `beta = 1` ferait diverger γ, et
   le vol à 1 g y arrive de si près que la différence se perd dans les flottants :
   on borne juste en dessous, et l'on dit pourquoi plutôt que de laisser un NaN
   traverser le nuanceur — un NaN dans une direction, c'est un pixel noir dont
   personne ne comprend l'origine. */
const BETA_MAX = 1 - 1e-12;
function borne(beta){
  const b = Number(beta);
  if(!Number.isFinite(b)) return 0;
  return Math.min(BETA_MAX, Math.max(-BETA_MAX, b));
}
const cosBorne = c => Math.min(1, Math.max(-1, Number.isFinite(+c) ? +c : 1));

function gamma(beta){
  const b = borne(beta);
  return 1 / Math.sqrt(1 - b*b);
}

/* Du ciel vers le bord : où VOIT-ON une étoile qui est là-bas ?
   cos θ' = (cos θ + β) / (1 + β cos θ) */
function versBord(cosTheta, beta){
  const b = borne(beta), c = cosBorne(cosTheta);
  return cosBorne((c + b) / (1 + b*c));
}

/* Du bord vers le ciel : d'où vient le rayon que je regarde ?
   C'est la même chose avec −β, et c'est ce que le nuanceur emploie — il part du
   pixel, pas de l'étoile. */
function versCiel(cosBord, beta){
  const b = borne(beta), c = cosBorne(cosBord);
  return cosBorne((c - b) / (1 - b*c));
}

/* Le facteur Doppler, à partir de l'angle DÉJÀ aberré. L'ordre compte : donner
   ici l'angle au repos rend un nombre plausible et faux, et rien à l'écran ne
   le dénoncerait. */
function doppler(cosBord, beta){
  const b = borne(beta), c = cosBorne(cosBord);
  return 1 / (gamma(b) * (1 - b*c));
}

// L'éclat d'une source ponctuelle suit D⁴. Sans réglage : c'est du transport.
function eclat(D){
  const d = Number(D);
  return Number.isFinite(d) && d > 0 ? Math.pow(d, 4) : 0;
}

/* L'angle, vu du bord, dans lequel tient toute la moitié AVANT du ciel du repos.
   C'est le chiffre qui dit la chose en un mot : à 0,99 c, un hémisphère entier
   tient dans un cône de huit degrés. */
function demiCiel(beta){
  return Math.acos(versBord(0, beta));
}

global.AB = { versBord, versCiel, doppler, eclat, gamma, demiCiel, borne, BETA_MAX };

})(typeof window !== "undefined" ? window : globalThis);
