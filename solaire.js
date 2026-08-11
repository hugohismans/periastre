/* ============================================================================
   LE SYSTÈME SOLAIRE VU DU DEHORS — ce qu'on en voit, et à partir de quand.

   Ce module ne dessine rien. Il répond à deux questions, et la seconde est la
   plus importante :

     · où sont les planètes dans le champ, vues d'une distance donnée ;
     · À PARTIR DE QUELLE DISTANCE a-t-on le droit de les nommer.

   ---------------------------------------------------------------------------
   POURQUOI LA SECONDE QUESTION EXISTE — verdict d'Hugo, 10 août 2026

   Il voulait « une vision depuis le nuage dehors, avec des tags : ça c'est
   Jupiter, ça c'est truc ». Le chiffrage a dit que ça ne se pouvait pas là-bas :
   depuis le nuage de Oort, les huit planètes tiennent dans deux pixels. Des
   étiquettes séparées pour Jupiter et Saturne y pointeraient LE MÊME POINT, et
   ce serait un mensonge — le genre exact que ce site existe pour ne pas faire.

   Il a donc tranché « les deux, dans cet ordre » : on arrive dans le nuage, on
   ne voit qu'un point, et l'on CONTINUE À TOMBER jusqu'à ce que les orbites
   s'écartent. La scène n'est pas une vue, c'est un mouvement entre deux régimes.

   D'où la responsabilité première de ce module : **savoir se taire**. Une
   étiquette n'apparaît que lorsqu'elle désigne un endroit distinct de tous les
   autres. Le reste du temps, il n'y a rien à dire, et le dire serait faux.

   ---------------------------------------------------------------------------
   D'OÙ VIENNENT LES NOMBRES

   Aucun demi-grand axe n'est écrit ici. Ils se DÉRIVENT, par la troisième loi
   de Kepler, des taux de longitude moyenne du JPL et des masses de DE440 — deux
   colonnes relevées à leur source, dont `SOURCES-SOLAIRE.md` garde l'adresse.
   Écrire les demi-grands axes en dur aurait été une troisième copie d'une chose
   déjà présente deux fois dans le dépôt, et le dépôt a déjà payé ça.

   `outil-verif-solaire.js` reconstruit les mêmes valeurs de son côté et les
   compare à ce que la fiche publiée affirme. La boucle se ferme : ce que le
   visiteur lit et ce que le module calcule sont le même nombre.
   ============================================================================ */

(function(global){
"use strict";

const UA = 1.495978707e11;          // m — UAI 2012 résolution B2, exact
const SIECLE = 36525 * 86400;       // s — le siècle julien des tables du JPL

/* NASA/JPL, « Approximate Positions of the Planets », table 1 : les TAUX DE
   LONGITUDE MOYENNE, en degrés par siècle julien. La table pose ses propres
   réserves, et la fiche les porte : ce ne sont pas des moyennes mais un
   ajustement valable de 1800 à 2050, et sa ligne « Terre » est le barycentre
   Terre-Lune. */
const LDOT = {
  Mercure: 149472.67411175, Venus: 58517.81538729, Terre: 35999.37244981,
  Mars: 19140.30268499, Jupiter: 3034.74612775, Saturne: 1222.49362201,
  Uranus: 428.48202785, Neptune: 218.45945325,
};

/* NASA/JPL, « Astrodynamic Parameters » — éphéméride DE440, en km³/s². La Lune
   est ajoutée à la Terre pour la même raison : la ligne d'éléments est le
   barycentre. Sans elle, la reconstruction dérive de 4 ppm, et ce ne serait pas
   une faute de frappe mais une erreur de modèle. */
const GM_KM3 = {
  Mercure: 22031.868551, Venus: 324858.592, Terre: 398600.435507 + 4902.800118,
  Mars: 42828.375816, Jupiter: 126712764.1, Saturne: 37940584.8418,
  Uranus: 5794556.4, Neptune: 6836527.10058,
};
const GM_SOLEIL_KM3 = 1.32712440041279419e11;

const ORDRE = ["Mercure", "Venus", "Terre", "Mars", "Jupiter", "Saturne", "Uranus", "Neptune"];

/* Troisième loi de Kepler, sur la période tirée du taux de longitude moyenne et
   la masse TOTALE du couple — pas celle du Soleil seul. Pour Jupiter, négliger
   sa masse déplacerait le résultat de 300 ppm, soit dix fois la tolérance. */
function demiGrandAxe(nom){
  const T  = 360 / LDOT[nom] * SIECLE;
  const GM = (GM_SOLEIL_KM3 + GM_KM3[nom]) * 1e9;
  return Math.cbrt(GM * T * T / (4 * Math.PI * Math.PI)) / UA;
}

/* L'ÉCART MAXIMAL entre une planète et le Soleil, vus de `dUa` unités
   astronomiques — en radians. C'est l'élongation d'une orbite vue de loin :
   `asin(a/d)`, la même géométrie que le diamètre apparent d'une sphère, pour la
   même raison — c'est la tangente issue de l'œil qui borne, pas la projection.

   `NaN` si l'on est DEDANS (`a ≥ d`) plutôt qu'une valeur plausible et fausse.
   C'est la leçon de `lune.js`, qui l'avait apprise sur le Soleil vu de la Lune. */
function ecartMax(nom, dUa){
  const x = demiGrandAxe(nom) / dUa;
  return x >= 1 ? NaN : Math.asin(x);
}

/* Le même écart, en pixels, pour une caméra donnée. `focale` et `H` sont ceux de
   la page : le demi-champ vertical a pour tangente 1/focale, donc `H/2` pixels
   couvrent `atan(1/focale)` radians. On reste dans l'approximation des petits
   angles — à ces distances l'écart dépasse rarement la minute d'arc, et
   l'erreur y est sous le millionième de pixel. */
function enPixels(nom, dUa, focale, H){
  const a = ecartMax(nom, dUa);
  if(!Number.isFinite(a) || !(focale > 0) || !(H > 0)) return NaN;
  return a / Math.atan(1 / focale) * (H / 2);
}

/* ---------------------------------------------------------------------------
   LE DROIT DE NOMMER — le cœur de ce module.

   Une planète ne peut porter son nom que si son point est distinct de tous les
   autres à l'écran. Le critère n'est pas « est-elle loin du Soleil » mais « est-
   elle séparée de SA VOISINE » : Uranus et Neptune sont les dernières à se
   séparer l'une de l'autre alors qu'elles sont déjà loin du centre.

   `ECART_MIN` vaut 12 pixels, et ce n'est pas un réglage de confort : c'est la
   hauteur d'une ligne de texte de 11 px, la police du reste du site. Deux
   étiquettes plus proches que ça se chevauchent, et deux étiquettes qui se
   chevauchent désignent le même endroit — ce qu'on refuse. Le chiffre se dérive
   donc de la typographie, il ne se choisit pas.

   On rend la liste de CE QU'ON A LE DROIT DE DIRE, jamais la liste des planètes
   avec un drapeau : une liste vide est une réponse, et c'est la bonne réponse
   depuis le nuage de Oort. */
const ECART_MIN = 12;               // px — la hauteur d'une ligne de 11 px

function nommables(dUa, focale, H, ecartMin){
  const seuil = ecartMin > 0 ? ecartMin : ECART_MIN;
  const vus = ORDRE.map(nom => ({ nom, px: enPixels(nom, dUa, focale, H) }))
                   .filter(p => Number.isFinite(p.px));
  /* On compare à la dernière RETENUE, pas à la voisine. La différence n'est pas
     un détail : exiger d'Uranus qu'elle se sépare de Saturne interdirait de
     nommer Uranus alors que Saturne, elle, n'est pas nommée — on refuserait de
     dire ce qu'on peut dire à cause de ce qu'on a déjà tu. Ce qui compte est que
     les étiquettes POSÉES ne se marchent pas dessus. */
  const gardees = [];
  for(const p of vus){
    if(p.px < seuil) continue;                       // trop près du Soleil
    const derniere = gardees[gardees.length - 1];
    if(derniere && p.px - derniere.px < seuil) continue;
    gardees.push(p);
  }
  return gardees;
}

/* La distance à partir de laquelle la scène a quelque chose à dire. Cherchée
   par bissection plutôt qu'écrite : elle dépend de l'écran, et un nombre écrit
   ici deviendrait faux au premier changement de champ.

   `combien` a été ajouté le 11 août, avec la chute : « il y a quelque chose à
   dire » et « il y a une SCÈNE » ne sont pas la même distance. Un seul nom, à
   2 361 ua, ne fait pas une scène — c'est un mot posé sur un point. Le défaut
   vaut un, ce qui laisse tous les appelants d'avant exacts.

   La bissection est légitime parce que le compte est MONOTONE quand on
   s'approche, et cette monotonie n'est pas supposée ici : elle est éprouvée
   dans `outil-verif-nommables.js`, qui la balaie sur tout le domaine. */
function distanceParlante(focale, H, ecartMin, combien){
  const n = combien > 0 ? combien : 1;
  /* LA BORNE BASSE SE DÉRIVE, ET ELLE M'A REPRIS. Elle valait une unité
     astronomique, ce qui va tant qu'on ne demande qu'un seul nom. Dès qu'on en
     demande trois, la bissection rendait `NaN` : à une unité astronomique on est
     DEDANS pour six planètes sur huit, elles sortent de la liste, et le compte y
     est plus bas qu'à trois cents. La monotonie sur laquelle repose la
     bissection n'existe que DEHORS — c'est d'ailleurs le domaine sur lequel
     `outil-verif-nommables.js` l'éprouve, et je ne l'avais pas lu.
     On part donc juste au-delà de la dernière orbite, dérivée et non écrite. */
  let bas = 1.05 * Math.max(...ORDRE.map(demiGrandAxe));
  let haut = 1e6;                             // ua — encadre largement la réponse
  if(nommables(bas, focale, H, ecartMin).length < n) return NaN;
  for(let i = 0; i < 80; i++){
    const m = Math.sqrt(bas * haut);          // en log : l'échelle du problème
    if(nommables(m, focale, H, ecartMin).length >= n) bas = m; else haut = m;
  }
  return bas;
}

/* ---------------------------------------------------------------------------
   LE SOLEIL, RÉDUIT À CE QU'IL EST VRAIMENT DE LÀ-BAS — 11 août 2026

   Deux constantes NOMINALES, au sens que l'UAI donne à ce mot : ce ne sont pas
   des mesures mais des conventions de calcul, exactes par définition, pour que
   tout le monde trouve le même nombre. Prša et al. 2016, résolution B3 de 2015 ;
   `SOURCES-SOLAIRE.md` §3 garde l'adresse, la table et la ligne.

   Le point zéro apparent vient de la résolution B2 de la même assemblée, lue à
   son texte (Mamajek et al. 2015) : une source de flux f₀ a la magnitude
   bolométrique apparente zéro. C'est lui qui fait de la magnitude une grandeur
   DÉRIVÉE de la luminosité, et non un chiffre de plus à recopier — la règle 7.

   `outil-verif-solaire.js` porte ses propres copies de ces deux nombres et
   refait le calcul de son côté, contre ce que la fiche publiée affirme. C'est
   voulu : il est l'arbitre, sa vérité doit venir d'ailleurs (règle 3). */
const R_SOLEIL_M = 6.957e8;            // m — rayon solaire nominal, UAI 2015 B3
const L_SOLEIL_W = 3.828e26;           // W — luminosité solaire nominale, idem
const F_ZERO     = 2.518021002e-8;     // W m⁻² — point zéro apparent, UAI 2015 B2

/* Diamètre apparent d'une SPHÈRE, en radians : 2·asin(R/d), et non 2·atan(R/d).
   La silhouette est bornée par les tangentes issues de l'œil. C'est la
   correction que `lune.js:255` porte déjà, avec son refus de répondre quand on
   est dedans — ici on ne peut pas l'être, mais on ne va pas écrire une seconde
   fois la même formule avec un domaine plus large : ce serait la même faute
   sous un autre nom. */
function diametreSoleil(dUa){
  const x = R_SOLEIL_M / (dUa * UA);
  return x >= 1 ? NaN : 2*Math.asin(x);
}

/* Le même diamètre, en pixels de l'écran, avec la caméra de la page. Même
   conversion angle → pixel qu'`enPixels`, et pour la même raison : `H/2` pixels
   couvrent `atan(1/focale)` radians. */
function soleilEnPixels(dUa, focale, H){
  const a = diametreSoleil(dUa);
  if(!Number.isFinite(a) || !(focale > 0) || !(H > 0)) return NaN;
  return a / Math.atan(1 / focale) * (H / 2);
}

/* La magnitude bolométrique APPARENTE, dérivée du flux reçu, lui-même dérivé de
   la luminosité : f = L/(4πd²), puis m = −2,5 log₁₀(f/f₀). Rien n'est recopié —
   depuis une unité astronomique, la formule rend −26,83, et l'irradiance rend
   1 361 W m⁻², c'est-à-dire les deux valeurs de la même table de l'UAI, que
   personne n'a écrites ici. Trois entrées qui se referment sur elles-mêmes. */
function fluxSoleil(dUa){
  const d = dUa * UA;
  return L_SOLEIL_W / (4 * Math.PI * d * d);
}
function magnitudeSoleil(dUa){
  const f = fluxSoleil(dUa);
  return f > 0 ? -2.5 * Math.log10(f / F_ZERO) : NaN;
}

/* ---------------------------------------------------------------------------
   SOUS LE DEMI-PIXEL, ON NE DESSINE RIEN — la doctrine de `lune.js:41-54`

   Le trou noir de masse lunaire y mesure 0,117 microseconde d'arc, et `dessine`
   ne trace RIEN tant que son diamètre reste sous le demi-pixel : pas un point
   pâle, pas un halo. Ce qui se montre à sa place est le GROSSISSEMENT qu'il
   faudrait — « on ne le verrait même pas », mot pour mot.

   Le Soleil est dans le même cas, et c'est le fait le plus fort de la scène.
   Depuis mille unités astronomiques son disque fait neuf MILLIÈMES de pixel ; le
   premier pixel n'arrive qu'à dix-sept unités astronomiques, c'est-à-dire à
   l'intérieur de l'orbite de Saturne. Toute la scène se joue donc sur un astre
   dont on ne verra jamais la forme.

   ON NE DESSINE PAS POUR AUTANT RIEN DU TOUT, et la différence avec `lune.js`
   est entière : là-bas l'objet est NOIR, ici il RAYONNE. Une étoile est un point
   sans taille qu'on voit quand même — c'est la définition d'une étoile. Ce qui
   n'a pas le droit d'exister, c'est un DISQUE : dessiner le Soleil gros de
   quelques pixels dirait « voilà sa taille », et ce serait faux d'un facteur
   deux cents. On rend donc les deux choses séparément, et la page ne peut pas
   les confondre :

     `diametrePx`   ce qu'il mesure vraiment. Presque toujours invisible.
     `dessinable`   a-t-on le droit de tracer un disque. Presque jamais.
     `grossissement` ce qu'il faudrait pour que ce disque atteigne UN pixel.
     `magnitude`    son éclat, qui lui est bien réel et qui, lui, se voit.       */
const DEMI_PIXEL = 0.5;

function soleilVu(dUa, focale, H){
  const diametrePx = soleilEnPixels(dUa, focale, H);
  const ok = Number.isFinite(diametrePx) && diametrePx > 0;
  return {
    diametrePx,
    dessinable: ok && diametrePx >= DEMI_PIXEL,
    grossissement: ok ? 1 / diametrePx : NaN,
    magnitude: magnitudeSoleil(dUa),
  };
}

/* ---------------------------------------------------------------------------
   LES ANNEAUX — ET CE QU'ILS SONT VRAIMENT

   On ne sait pas dire où est Jupiter. Les colonnes relevées au JPL donnent le
   demi-grand axe et le taux de longitude moyenne, rien d'autre : ni la phase, ni
   l'inclinaison de l'orbite vue depuis Sagittarius. Placer un point et écrire
   « Jupiter » dessus serait une affirmation que rien dans ce dépôt ne soutient.

   Ce qu'on peut dire, et qui est exactement `ecartMax`, c'est jusqu'où elle peut
   s'écarter du Soleil vue d'ici. On trace donc le CERCLE QUI BORNE cet écart :
   la planète est quelque part là-dedans, et l'anneau ne prétend rien de plus.
   L'aveu de l'arrivée le dit au visiteur — c'est la règle de la maison, la baie
   est honnête et la surcouche est déclarée.

   Le même demi-pixel décide : un anneau dont le rayon tient sous le demi-pixel
   est entièrement dans un pixel, et le tracer dessinerait une forme qui n'existe
   pas. Depuis le nuage de Oort, ils y sont tous — d'où le point unique. */
function anneaux(dUa, focale, H){
  return ORDRE.map(nom => ({ nom, rayonPx: enPixels(nom, dUa, focale, H) }))
              .filter(a => Number.isFinite(a.rayonPx) && a.rayonPx >= DEMI_PIXEL);
}

global.SOLAIRE = { ORDRE, LDOT, GM_KM3, GM_SOLEIL_KM3, UA,
                   demiGrandAxe, ecartMax, enPixels, nommables,
                   distanceParlante, ECART_MIN,
                   R_SOLEIL_M, L_SOLEIL_W, F_ZERO, DEMI_PIXEL,
                   diametreSoleil, soleilEnPixels, fluxSoleil, magnitudeSoleil,
                   soleilVu, anneaux };

})(typeof window !== "undefined" ? window : globalThis);
