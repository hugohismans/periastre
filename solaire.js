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
   ici deviendrait faux au premier changement de champ. */
function distanceParlante(focale, H, ecartMin){
  let bas = 1, haut = 1e6;                    // ua — encadre largement la réponse
  if(!nommables(bas, focale, H, ecartMin).length) return NaN;
  for(let i = 0; i < 80; i++){
    const m = Math.sqrt(bas * haut);          // en log : l'échelle du problème
    if(nommables(m, focale, H, ecartMin).length) bas = m; else haut = m;
  }
  return bas;
}

global.SOLAIRE = { ORDRE, LDOT, GM_KM3, GM_SOLEIL_KM3, UA,
                   demiGrandAxe, ecartMax, enPixels, nommables,
                   distanceParlante, ECART_MIN };

})(typeof window !== "undefined" ? window : globalThis);
