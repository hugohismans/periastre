/* ============================================================================
   LE SPECTRE ÉLECTROMAGNÉTIQUE DE SGR A* — la part calculée.

   Le fait central : c'est la longueur d'onde qui décide si l'ombre est visible.
   En radio le gaz d'accrétion est opaque et forme une photosphère qui bouche
   tout ; vers le millimétrique il devient transparent et l'anneau apparaît.
   C'est la raison d'être de l'EHT à 1,3 mm, et tout le reste découle de la SED
   mesurée.

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   Ces quelques lignes ne dessinent rien, mais elles commandent trois choses à
   la fois : la courbe du panneau, le texte de la bande, et trois uniformes du
   nuanceur — rayon de la photosphère, teinte, éclat. Tant qu'elles vivaient au
   milieu de la page, aucune ne pouvait être vérifiée sans navigateur, alors
   qu'elles sont de l'arithmétique pure. Les voilà dehors.

   Ce qui reste dans la page, et volontairement : `dessineSED`, `majSpectre` et
   `leconSpectre`. Elles touchent au canevas et au DOM ; les faire entrer ici
   rendrait le module invérifiable en ligne de commande, c'est-à-dire le
   contraire du but.

   ---------------------------------------------------------------------------
   LE MODULE NE SAIT RIEN

   Aucun chiffre mesuré n'est écrit ici. La SED, les bandes et leurs bornes
   arrivent par `pose(CONTENU.spectre)` — `contenu.js` reste la seule source de
   vérité factuelle, et `sedMax` se DÉRIVE des points reçus au lieu d'être
   recopié. Un point ajouté à la SED déplace donc le maximum, l'éclat et
   l'échelle du graphe sans qu'une ligne de code bouge. Si on l'avait figé, la
   page aurait continué d'afficher un maximum devenu faux, sans rien signaler.

   Ce qui est écrit ici, en revanche, ce sont les CONVENTIONS et les RÉGLAGES
   d'affichage : la table des fausses couleurs, la loi de photosphère et sa
   compression d'éclat. Ce ne sont pas des mesures ; elles se discutent comme
   des choix de rendu, pas comme des faits.
   ============================================================================ */

(function(global){
"use strict";

// Convention des fausses couleurs en astronomie : long = rouge, court = bleu.
// Elle n'est vraie nulle part — hors du visible aucune de ces bandes n'a de
// couleur — mais elle est universelle dans les images publiées, et c'est
// exactement ce que la leçon du panneau annonce au lecteur.
const COUL_BANDE = {
  radio:[1.00,0.35,0.24], submm:[1.00,0.62,0.24], ir:[1.00,0.80,0.30],
  visible:[0.92,0.92,0.96], uv:[0.64,0.49,1.00], x:[0.35,0.66,1.00], gamma:[0.82,0.70,1.00],
};

/* L'état posé. `SED` est trié une fois pour toutes par longueur d'onde
   croissante : l'interpolation le suppose ordonné, et `contenu.js` n'a aucune
   obligation de l'être — c'est une liste écrite à la main, relue par des yeux
   humains, et lui imposer un ordre serait une contrainte de plus à tenir.

   Le tri se fait sur une COPIE : trier le tableau de `CONTENU` en place
   modifierait la source de vérité depuis un consommateur, et le prochain
   lecteur trouverait des données qu'il n'a pas écrites. */
let SED = null, BANDES = null, sedMax = -Infinity;

function pose(donnees){
  if(!donnees || !Array.isArray(donnees.sed) || !Array.isArray(donnees.bandes))
    throw new Error("SPECTRE_CALC.pose attend { sed, bandes } — c'est CONTENU.spectre.");
  SED = donnees.sed.slice().sort((a, b) => a[0] - b[0]);
  BANDES = donnees.bandes;
  // Le maximum de νLν, dérivé et jamais recopié : c'est le zéro de l'échelle
  // d'éclat, et le plafond de l'axe vertical du graphe.
  sedMax = -Infinity;
  for(let i = 0; i < SED.length; i++) if(SED[i][1] > sedMax) sedMax = SED[i][1];
}

// Un appel avant `pose` rendrait NaN sans rien dire, et l'erreur se verrait
// trois écrans plus loin sous la forme d'une image noire. Elle se déclare ici.
function pret(){
  if(!SED) throw new Error("SPECTRE_CALC : appeler pose(CONTENU.spectre) avant tout le reste.");
}

/* νLν interpolé linéairement en log-log.

   Linéaire en log-log, donc en loi de puissance entre deux points mesurés :
   c'est la seule interpolation qui ne fabrique ni bosse ni creux entre eux, et
   un spectre non thermique est fait de segments de ce genre. Hors des bornes on
   tient la valeur du point extrême plutôt que de prolonger la pente — une
   extrapolation en loi de puissance sur quatre décades inventerait une
   luminosité que personne n'a mesurée. */
function sed(lg){
  pret();
  const p = SED;
  if(lg <= p[0][0]) return p[0][1];
  if(lg >= p[p.length-1][0]) return p[p.length-1][1];
  for(let i = 1; i < p.length; i++){
    if(lg <= p[i][0]){
      const t = (lg - p[i-1][0])/(p[i][0] - p[i-1][0]);
      return p[i-1][1] + t*(p[i][1] - p[i-1][1]);
    }
  }
  return p[p.length-1][1];
}

/* La bande qui contient cette longueur d'onde. Bornes semi-ouvertes [min, max[ :
   à une frontière exacte, une seule bande répond, et le nom affiché ne dépend
   pas de l'ordre de la liste.

   Le repli sur la première bande sert la valeur haute de la réglette, λ = 10^0,5
   m, exclue par le `< max` de la bande radio — qui est pourtant la bonne
   réponse. Il masquerait en revanche une bande manquante ailleurs : c'est un
   endroit à surveiller si les bornes de `contenu.js` changent. */
function bande(lg){
  pret();
  return BANDES.find(b => lg >= b.min && lg < b.max) || BANDES[0];
}

/* Rayon de la photosphère synchrotron, en rayons de Schwarzschild, calé sur
   deux faits observés : à 1,3 mm le flux est devenu transparent à l'échelle de
   l'horizon — c'est ce qui permet à l'EHT d'y voir l'ombre — et en
   centimétrique il masque quelques dizaines de rayons. Entre les deux, la
   taille apparente varie à peu près comme λ.

   C'est cette proportionnalité qui est la vraie affirmation physique : la pente
   vaut exactement 1 en log-log (le `lg` du terme, sans coefficient). Le reste
   est du réglage. Ce que les chiffres donnent :

     3 cm   (lg = −1,52)  → 28 rayons     « quelques dizaines », oui
     1,6 mm (lg ≈ −2,79)  → 1,5 rayon     la photosphère s'éteint ici
     1,3 mm (lg = −2,886) → 0             la fenêtre de l'EHT, dégagée

   Le seuil de 1,5 n'est donc pas un garde-fou : c'est lui qui fixe où la
   photosphère disparaît, et il la fait disparaître un cheveu avant 1,3 mm. Le
   plafond de 60, lui, est un bord de scène — au-delà la caméra recule déjà
   au-dessus de cent rayons pour tout tenir dans le cadre. Aucun des deux ne
   sort d'une source ; les changer change l'image. */
function rPhotosphere(lg){
  const r = Math.pow(10, 0.079 + (lg + 2.886));
  return r < 1.5 ? 0 : Math.min(r, 60);
}

/* L'éclat relatif, 1 au maximum de la SED.

   L'exposant 0,45 comprime : trois décades sous le pic ne donnent pas un
   millième de luminosité mais un vingtième. Sans lui, tout ce qui n'est pas la
   bosse submillimétrique serait noir à l'écran, et la réglette n'apprendrait
   plus rien entre l'ultraviolet et les rayons X. C'est un rendu tonal, pas une
   grandeur photométrique — la courbe du panneau, elle, montre le vrai νLν. */
function eclat(lg){ return Math.pow(10, (sed(lg) - sedMax)*0.45); }

/* « 1,30 mm ». L'unité suit l'ordre de grandeur, comme l'écrirait un
   astronome : personne ne dit 0,0013 m. Trois chiffres significatifs, parce
   qu'au pas de la réglette le quatrième ne veut plus rien dire. */
function longueur(lg){
  const m = Math.pow(10, lg);
  if(m < 1e-9)  return (m*1e12).toPrecision(3) + " pm";
  if(m < 1e-6)  return (m*1e9).toPrecision(3)  + " nm";
  if(m < 1e-3)  return (m*1e6).toPrecision(3)  + " µm";
  if(m < 1)     return (m*1e3).toPrecision(3)  + " mm";
  return m.toPrecision(3) + " m";
}

/* `sedMax` passe par un accesseur : il n'existe qu'après `pose`, et une valeur
   copiée à la construction de l'objet resterait indéfinie pour toujours. */
global.SPECTRE_CALC = {
  pose, sed, bande, rPhotosphere, eclat, longueur, COUL_BANDE,
  get sedMax(){ return sedMax; },
};

})(typeof window !== "undefined" ? window : globalThis);
