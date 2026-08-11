/* ============================================================================
   Depuis la Terre, remplacer la Lune.

   C'est le seul endroit du site où l'échelle ne s'exprime pas en rayons de
   Schwarzschild ni en unités astronomiques, mais en quelque chose que tout le
   monde a déjà vu de ses yeux. On est debout, la nuit, et l'on change ce qui
   est accroché là-haut.

   ---------------------------------------------------------------------------
   POURQUOI LE CIEL EST DÉROULÉ

   La projection est LINÉAIRE EN DEGRÉS sur les deux axes : un degré vaut le
   même nombre de pixels partout dans le cadre. Ce n'est pas ce que voit l'œil —
   c'est un panorama, pas une perspective. C'est un choix, et il est délibéré.

   Une projection rectiligne, celle d'un objectif honnête, explose au-delà de
   cent degrés : le bord du cadre s'étire sans limite et deux objets de même
   taille apparente n'occupent plus la même largeur selon qu'ils sont au centre
   ou sur le côté. Une page dont le sujet EST la comparaison des tailles ne peut
   pas se permettre ça. En déroulant, on perd le réalisme et l'on gagne la seule
   chose qui compte ici : la règle graduée est droite, et une taille lue au
   double d'une autre l'est vraiment.

   C'est déclaré à l'écran. La règle de la maison : la baie est honnête, la
   surcouche est déclarée.

   ---------------------------------------------------------------------------
   CE QU'ON NE MONTRE PAS, ET POURQUOI

   Pas de rencontre, pas d'absorption, pas de catastrophe. Un trou noir qui
   dévore la Lune enseignerait « aspirateur cosmique », c'est-à-dire l'exact
   contraire de ce que le reste du site passe son temps à démonter.

   La leçon est dans l'anticlimax. On remplace la Lune par un trou noir de même
   masse et IL NE SE PASSE RIEN : à 384 400 km, un point de 7,35 × 10²² kg
   attire exactement comme une boule de 3 475 km de la même masse. Les marées ne
   bougent pas, l'orbite non plus. Ce qu'on perd, c'est le clair de lune, les
   éclipses et le disque. Le ciel est juste vide à cet endroit.

   ---------------------------------------------------------------------------
   MONTRER UN OBJET INVISIBLE SANS TRICHER SUR SA TAILLE

   Le trou noir de masse lunaire fait 0,109 mm de rayon. Vu de la Terre, son
   disque mesure 3,3 × 10⁻¹¹ degré, soit 0,117 microseconde d'arc.

   On ne le dessine donc pas. Jamais. Tant que son diamètre reste sous le
   demi-pixel, `dessine` ne trace rien du tout — pas un point pâle, pas un halo,
   rien. Ce qui se montre à sa place, c'est le GROSSISSEMENT qu'il faudrait, et
   on laisse le lecteur le pousser lui-même : le champ tombe de degrés en
   minutes, en secondes, en millisecondes, en microsecondes d'arc, le cadre se
   vide de ses étoiles, et il ne se passe toujours rien. Le premier pixel arrive
   à ×2,2 × 10⁸ ; la taille de la Lune, à ×1,6 × 10¹⁰.

   Le réticule, lui, est une aide de lecture. Il n'a pas de taille, et il le dit.

   ---------------------------------------------------------------------------
   LA CORRECTION AU CARNET

   `IDEES.md` donne les sept tailles apparentes comme des tangentes,
   2·arctan(R/d). Ce n'est pas la bonne formule : la silhouette d'une SPHÈRE est
   bornée par les tangentes issues de l'œil, et le demi-angle vaut arcsin(R/d),
   pas arctan(R/d). Sous un degré les deux coïncident, d'où l'absence de dégât
   sur la Lune, Mars et la Terre. Mais l'écart atteint 1,1 % sur Saturne et
   1,7 % sur Jupiter — c'est visible à trois chiffres.

   Et sur le Soleil, la tangente ne dit pas « grand », elle dit n'importe quoi :
   le rayon solaire vaut 695 700 km, soit 1,81 fois la distance Terre–Lune.
   arcsin n'est même pas défini. Mettre le Soleil à la place de la Lune, ce
   n'est pas remplir les deux tiers du ciel — c'est se retrouver DEDANS, à 55 %
   du rayon solaire depuis son centre. Le 122° du carnet est une formule
   appliquée hors de son domaine.

   `outil-verif-lune.js` affirme les deux séries et chiffre l'écart.
   ============================================================================ */

(function(global){
"use strict";

/* ============================================================ 1. LES CHIFFRES
   Aucune valeur n'est ici sans une clé de `SOURCES` en face. C'est la règle du
   dépôt, et elle vaut aussi pour un module de dessin. */

const G = 6.67430e-11;          // m³ kg⁻¹ s⁻²   — CODATA 2018
const C = 299792458;            // m/s           — exact par définition du mètre
/* L'unité astronomique n'avait pas de clé de source dans le registre ci-dessous,
   alors que la règle de ce fichier est « aucune valeur sans une clé en face ».
   Elle en a une : `iau2012b2`, la même que dans `contenu.js`. Et sa valeur est
   gardée du dehors — `outil-verif-constantes.js` la redemande à la définition,
   au chiffre près, dans les huit fichiers qui la portent. */
const UA_KM = 1.495978707e8;    // km — source iau2012b2 (UAI 2012 résolution B2, exact)

const D_LUNE_KM = 384400;       // demi-grand axe de l'orbite lunaire

const SOURCES = {
  jplPlanetes: {
    ref: "NASA/JPL Solar System Dynamics, « Planetary Physical Parameters » ; " +
         "rayons moyens d'après B. A. Archinal et al., « Report of the IAU Working " +
         "Group on Cartographic Coordinates and Rotational Elements: 2015 », " +
         "Celestial Mechanics and Dynamical Astronomy 130, 22 (2018)",
    doi: "10.1007/s10569-017-9805-5",
    url: "https://ssd.jpl.nasa.gov/planets/phys_par.html",
    sert: "rayons moyens et masses de Mars, la Terre, Jupiter, Saturne, Neptune",
  },
  jplSatellites: {
    ref: "NASA/JPL Solar System Dynamics, « Planetary Satellite Physical " +
         "Parameters » ; GM lunaire tiré de l'éphéméride DE440",
    url: "https://ssd.jpl.nasa.gov/sats/phys_par/",
    sert: "rayon moyen de la Lune (1 737,4 ± 0,1 km) et GM lunaire " +
          "(4 902,800 ± 0,001 km³/s²)",
  },
  jplElements: {
    ref: "NASA/JPL Solar System Dynamics, « Planetary Satellite Mean Orbital " +
         "Parameters »",
    url: "https://ssd.jpl.nasa.gov/sats/elem/",
    sert: "demi-grand axe de l'orbite lunaire : 384 400 km",
  },
  iau2015b3: {
    ref: "A. Prša et al., « Nominal Values for Selected Solar and Planetary " +
         "Quantities: IAU 2015 Resolution B3 », The Astronomical Journal 152, 41 (2016)",
    doi: "10.3847/0004-6256/152/2/41",
    url: "https://arxiv.org/abs/1605.09788",
    sert: "rayon solaire nominal 𝓡☉ᴺ = 6,957 × 10⁸ m et paramètre de masse " +
          "solaire nominal (𝒢M)☉ᴺ = 1,327 124 4 × 10²⁰ m³/s², valeurs " +
          "conventionnelles exactes",
  },
  codata2018: {
    ref: "CODATA 2018, reprises par NASA/JPL, « Astrodynamic Constants »",
    url: "https://ssd.jpl.nasa.gov/astro_par.html",
    sert: "G = 6,674 30 (± 0,000 15) × 10⁻¹¹ m³ kg⁻¹ s⁻² ; c = 299 792 458 m/s",
  },
  eht2022: {
    ref: "Event Horizon Telescope Collaboration, « First Sagittarius A* Event " +
         "Horizon Telescope Results. I. The Shadow of the Supermassive Black " +
         "Hole in the Center of the Milky Way », ApJL 930, L12 (2022)",
    doi: "10.3847/2041-8213/ac6674",
    sert: "diamètre de l'anneau de Sgr A* : 51,8 ± 2,3 μas — la plus fine " +
          "structure jamais imagée, sert d'étalon de comparaison",
  },
  schwarzschild1916: {
    ref: "K. Schwarzschild, « Über das Gravitationsfeld eines Massenpunktes nach " +
         "der Einsteinschen Theorie », Sitzungsberichte der Königlich " +
         "Preussischen Akademie der Wissenschaften (1916), 189–196",
    sert: "r_s = 2GM/c², et le fait que le champ extérieur d'une masse à " +
          "symétrie sphérique ne dépend que de M",
  },
  birkhoff1923: {
    ref: "G. D. Birkhoff, Relativity and Modern Physics, Harvard University " +
         "Press (1923), p. 253",
    sert: "théorème de Birkhoff : à l'extérieur, boule ou point donnent la même " +
          "métrique. C'est la version relativiste du théorème des coquilles de " +
          "Newton, et c'est tout l'anticlimax de cette page.",
  },
};

/* Diamètre de l'anneau de Sgr A*, en microsecondes d'arc. Le plus petit détail
   que l'humanité ait jamais photographié : il sert d'étalon au bout de la page. */
const SGRA_ANNEAU_UAS = 51.8;

/* Les astres.

   `rayon_km` est toujours le rayon MOYEN volumétrique, jamais l'équatorial : un
   objet aplati n'a pas un seul diamètre apparent, et le rayon moyen est le seul
   choix qui se compare d'une ligne à l'autre sans arbitraire. Pour Saturne
   l'écart entre les deux vaut 3,5 % — assez pour changer le chiffre affiché.

   `masse_kg` vient des mêmes tables. Pour la Lune et le Soleil on stocke le
   PRODUIT GM plutôt que la masse : c'est ce que mesurent réellement les
   éphémérides, et c'est connu à onze chiffres là où G n'en donne que six. Le
   rayon de Schwarzschild vaut 2GM/c² — il ne demande pas G, donc il ne mérite
   pas d'être dégradé par lui. */
const ASTRES = [
  { cle:"lune", nom:"la Lune", court:"Lune", genre:"f",
    rayon_km: 1737.4, GM: 4.902800e12,
    source:"jplSatellites", masseSource:"jplSatellites",
    dessin:"lune", teinte:[214,208,196], clarte:0.30,
    note:"C'est elle. Un demi-degré, pas plus — la moitié de la largeur de " +
         "votre petit doigt à bout de bras. Tout le monde la croit plus grande." },

  { cle:"mars", nom:"Mars", court:"Mars", genre:"f",
    rayon_km: 3389.50, masse_kg: 0.641691e24,
    source:"jplPlanetes", masseSource:"jplPlanetes",
    dessin:"mars", teinte:[196,118,78], clarte:0.34,
    note:"Deux Lunes de large. C'est déjà net, et c'est encore petit : Mars " +
         "reste une pièce de monnaie tenue à bout de bras." },

  { cle:"terre", nom:"la Terre", court:"Terre", genre:"f",
    rayon_km: 6371.0084, masse_kg: 5.97217e24,
    source:"jplPlanetes", masseSource:"jplPlanetes",
    dessin:"terre", teinte:[86,124,168], clarte:0.55,
    note:"Voilà ce que les équipages d'Apollo avaient au-dessus de la tête : " +
         "presque quatre Lunes. Le seul point de vue de cette page qu'un être " +
         "humain ait réellement occupé." },

  { cle:"neptune", nom:"Neptune", court:"Neptune", genre:"f",
    rayon_km: 24622, masse_kg: 102.4092e24,
    source:"jplPlanetes", masseSource:"jplPlanetes",
    dessin:"neptune", teinte:[62,102,190], clarte:0.72,
    note:"Quatorze Lunes. À partir d'ici on ne compare plus à un objet tenu " +
         "dans la main : Neptune ferait un mur." },

  { cle:"saturne", nom:"Saturne", court:"Saturne", genre:"f",
    rayon_km: 58232, masse_kg: 568.317e24,
    source:"jplPlanetes", masseSource:"jplPlanetes",
    dessin:"saturne", teinte:[214,190,142], clarte:0.86,
    // Les anneaux sont un DESSIN. Leur étendue n'entre dans aucun chiffre
    // publié par ce module, et l'écran le déclare. Le diamètre annoncé pour
    // Saturne est celui du globe seul.
    anneaux:{ rInt:1.20, rExt:2.35 },
    note:"Trente-quatre Lunes pour le globe seul. Les anneaux sont dessinés, " +
         "leur étendue n'est pas un chiffre de cette page." },

  { cle:"jupiter", nom:"Jupiter", court:"Jupiter", genre:"m",
    rayon_km: 69911, masse_kg: 1898.125e24,
    source:"jplPlanetes", masseSource:"jplPlanetes",
    dessin:"jupiter", teinte:[212,178,140], clarte:1.0,
    note:"Quarante Lunes de large — mais mille six cents Lunes de surface. " +
         "C'est le piège de toutes les comparaisons de ce genre : on compte " +
         "des largeurs, l'œil, lui, reçoit des aires." },

  { cle:"soleil", nom:"le Soleil", court:"Soleil", genre:"m",
    rayon_km: 695700, GM: 1.32712440041279419e20,
    source:"iau2015b3", masseSource:"iau2015b3",
    dessin:"soleil", teinte:[255,236,190], clarte:1.0,
    note:"Il ne rentre pas. On ne serait pas devant : on serait dedans, à 55 % " +
         "du rayon solaire depuis son centre. Il n'y a pas de diamètre apparent " +
         "à donner, et les « 122° » du carnet sont une tangente employée hors " +
         "de son domaine." },

  /* Le rayon n'est pas saisi : il est DÉDUIT de GM par 2GM/c². Écrire 0,109 mm
     à la main aurait été un chiffre de plus à croire ; là, il n'y a rien à
     croire, il sort du même GM que la Lune juste au-dessus. */
  { cle:"trounoir", nom:"un trou noir de la masse de la Lune", court:"Trou noir",
    genre:"m", GM: 4.902800e12, rayonDeGM: true,
    source:"schwarzschild1916", masseSource:"jplSatellites",
    dessin:"trou", teinte:[0,0,0], clarte:0.0,
    note:"Même masse, même orbite, mêmes marées. Le ciel est simplement vide " +
         "à cet endroit." },
];

/* ==================================================== 2. CE QUI SE CALCULE */

/** Rayon de Schwarzschild, en mètres, à partir du produit GM (m³/s²).
 *  Pas de G ici : GM est mesuré directement et bien mieux connu. */
function rayonSchwarzschild(GM){ return 2*GM / (C*C); }

/** Le produit GM d'un astre, en m³/s². Mesuré si on l'a, dérivé sinon. */
function gmDe(a){ return a.GM !== undefined ? a.GM : G * a.masse_kg; }

/** Le rayon d'un astre, en km. Déduit de GM pour le trou noir. */
function rayonDe(a){
  return a.rayonDeGM ? rayonSchwarzschild(gmDe(a)) / 1000 : a.rayon_km;
}

/** La masse, en kg. Dérivée de GM quand c'est GM qui est publié — et c'est
 *  alors G, connu à 2,2 × 10⁻⁵ près, qui limite le chiffre. */
function masseDe(a){
  return a.masse_kg !== undefined ? a.masse_kg : a.GM / G;
}

/** Diamètre apparent d'une SPHÈRE de rayon R vue depuis une distance d de son
 *  centre, en degrés.
 *
 *  La silhouette est bornée par les tangentes issues de l'œil : le demi-angle
 *  vérifie sin α = R/d, donc arcsin, pas arctan. arctan(R/d) serait l'angle
 *  sous-tendu par un DISQUE PLAT de rayon R vu de face — ce que la Lune n'est
 *  pas. Sous un degré les deux ne se distinguent pas ; à vingt degrés si.
 *
 *  Renvoie NaN si R ≥ d : l'observateur est à l'intérieur, il n'y a pas de
 *  silhouette et il n'y a rien à répondre. On ne renvoie surtout pas 360°,
 *  qui laisserait croire à une réponse. */
function diametreApparent(rayon_km, distance_km){
  const x = rayon_km / distance_km;
  return x >= 1 ? NaN : 2*Math.asin(x) * 180/Math.PI;
}

/** La formule du carnet, gardée pour que l'outil de vérification puisse
 *  chiffrer l'écart au lieu de le décréter. */
function diametreApparentTangente(rayon_km, distance_km){
  return 2*Math.atan(rayon_km / distance_km) * 180/Math.PI;
}

/** Est-on dedans ? */
function englobe(a, distance_km){ return rayonDe(a) >= (distance_km || D_LUNE_KM); }

/** Diamètre apparent de la Lune depuis la Terre, en degrés. L'étalon de tout. */
const THETA_LUNE = diametreApparent(1737.4, D_LUNE_KM);

/** Combien de Lunes de large. Rapport de DIAMÈTRES apparents — pas d'aires.
 *  Quarante Lunes de large font mille six cents Lunes de surface, et c'est là
 *  que la comparaison trompe si on ne le dit pas. */
function enLunes(deg){ return deg / THETA_LUNE; }

/** Accélération de pesanteur d'une masse ponctuelle, en m/s², à d mètres. */
function acceleration(GM, d_m){ return GM / (d_m*d_m); }

/** Coefficient de marée 2GM/d³, en s⁻². C'est le gradient du champ, la seule
 *  chose que l'on sente réellement d'un astre lointain. */
function coefficientMaree(GM, d_m){ return 2*GM / (d_m*d_m*d_m); }

/** Le tableau complet, calculé. C'est ce que `outil-verif-lune.js` éprouve. */
function tableau(distance_km){
  const d = distance_km || D_LUNE_KM;
  return ASTRES.map(a => {
    const R = rayonDe(a);
    const GM = gmDe(a);
    const th = diametreApparent(R, d);
    return {
      cle: a.cle, nom: a.nom,
      rayon_km: R, masse_kg: masseDe(a), GM,
      dedans: englobe(a, d),
      deg: th,
      degTangente: diametreApparentTangente(R, d),
      lunes: enLunes(th),
      uas: th * 3.6e9,                       // degré → microseconde d'arc
      rs_m: rayonSchwarzschild(GM),
      source: a.source, masseSource: a.masseSource,
    };
  });
}

/* ========================================================= 3. LA MISE EN VUE

   Le champ s'ajuste à l'objet, ce qui rend chaque objet lisible mais change
   l'échelle d'un objet à l'autre. Deux garde-fous, tous deux permanents :

     — la RÈGLE graduée au bas du cadre, qui se renumérote quand le champ bouge,
       exactement comme le quadrillage de `recul.js` change d'étiquette en
       franchissant une décade ;
     — la LUNE TÉMOIN en haut à droite, dessinée à l'échelle courante. Quand
       elle tombe à trois pixels devant Jupiter, la comparaison est faite, et
       elle est faite sans qu'on ait eu besoin d'écrire un chiffre.

   Et un mode « champ figé » à 60°, où plus rien ne s'ajuste : c'est la
   comparaison la plus honnête, mais la Lune n'y fait que huit pixels. */

const CHAMP_MIN = 14, CHAMP_MAX = 150, CHAMP_FIGE = 60;

const etat = {
  i: 0,                 // index dans ASTRES
  champ: CHAMP_MIN,     // champ horizontal courant, en degrés (animé)
  champVise: CHAMP_MIN,
  champFige: false,
  grossissement: 0,     // en décades, pour le trou noir seulement
  grossissementVise: 0,
};

function astre(){ return ASTRES[etat.i]; }

/** L'étendue à cadrer, en degrés : le globe, ou les anneaux s'il y en a. */
function etendueDessinee(a){
  const th = diametreApparent(rayonDe(a), D_LUNE_KM);
  if(!isFinite(th)) return CHAMP_MAX;              // le Soleil : on est dedans
  return a.anneaux ? th * a.anneaux.rExt : th;
}

function champVoulu(){
  const a = astre();
  if(etat.champFige) return CHAMP_FIGE;
  if(a.dessin === "trou") return CHAMP_MIN;        // la base ; le zoom fait le reste
  const c = etendueDessinee(a) * 2.5;
  return Math.min(CHAMP_MAX, Math.max(CHAMP_MIN, c));
}

/** Le champ effectivement rendu, grossissement compris. */
function champEffectif(){
  return etat.champ / Math.pow(10, etat.grossissement);
}

function choisis(cle){
  const i = ASTRES.findIndex(a => a.cle === cle);
  if(i < 0) return false;
  etat.i = i;
  if(ASTRES[i].dessin !== "trou"){ etat.grossissement = 0; etat.grossissementVise = 0; }
  etat.champVise = champVoulu();
  return true;
}
function suivant(n){
  etat.i = (etat.i + (n || 1) + ASTRES.length) % ASTRES.length;
  if(astre().dessin !== "trou"){ etat.grossissement = 0; etat.grossissementVise = 0; }
  etat.champVise = champVoulu();
}
function basculeChampFige(){ etat.champFige = !etat.champFige; etat.champVise = champVoulu(); }

/** Le grossissement se donne en décades : 0 à 10,5. Au-delà de 10,2 le trou
 *  noir a la taille apparente qu'avait la Lune, et il n'y a plus rien à voir
 *  d'autre — le voyage était le sujet. */
const GROSSISSEMENT_MAX = 10.5;
function grossis(decades){
  etat.grossissementVise = Math.min(GROSSISSEMENT_MAX, Math.max(0, decades));
}

function avance(dt){
  const k = 1 - Math.pow(0.0016, Math.min(dt, 0.1));   // ~ 0,3 s de constante
  etat.champVise = champVoulu();
  // en logarithme : l'œil lit des rapports, pas des différences. Même règle
  // que le recul.
  const l = Math.log(etat.champ), lv = Math.log(etat.champVise);
  etat.champ = Math.exp(l + (lv - l)*k);
  etat.grossissement += (etat.grossissementVise - etat.grossissement)*k;
}

/* ============================================================ 4. LE VOCABULAIRE

   Un angle traverse cinq unités entre le Soleil et le trou noir de masse
   lunaire. Les faire toutes tenir dans une seule étiquette, c'est ce qui rend
   la chute lisible : on voit les noms tomber les uns après les autres. */

function nombre(x, dec){
  const s = Math.abs(x) >= 1000
    ? x.toLocaleString("fr-FR", { minimumFractionDigits:dec, maximumFractionDigits:dec })
    : x.toFixed(dec).replace(".", ",");
  return s;
}

/** Les zéros de fin sont du bruit sur une graduation : « 4° » se lit, « 4,00° »
 *  se déchiffre. On ne les taille que s'il y a une virgule, sinon « 100 »
 *  deviendrait « 1 ». */
function compact(x, dec){
  let s = nombre(x, dec);
  if(s.indexOf(",") >= 0) s = s.replace(/0+$/, "").replace(/,$/, "");
  return s;
}

/* Le seuil de bascule est à 0,05° et non à 1°, pour que la Lune s'écrive
   « 0,52° » comme dans le carnet et non « 31,1′ » : toute la page compte en
   degrés, et changer d'unité pour la seule valeur que le lecteur connaît
   déjà serait une coquetterie. Sous trois minutes d'arc, en revanche, les
   degrés ne disent plus rien et il faut bien descendre. */
function etiquetteAngle(deg){
  const a = Math.abs(deg);
  if(a === 0)       return "0";
  if(a >= 0.05)     return compact(deg, a >= 100 ? 0 : 2) + "°";
  if(a >= 1/60)     return compact(deg*60, 2) + "′";
  if(a >= 1/3600)   return compact(deg*3600, 2) + "″";
  if(a >= 1/3.6e6)  return compact(deg*3.6e6, 2) + " mas";
  // On descend jusqu'au millième de microseconde d'arc : c'est la dernière
  // unité qui ait un nom, et le trou noir de masse lunaire tient dedans —
  // 0,117 μas. Au-delà il n'y a plus de mot, seulement un exposant.
  if(a >= 1/3.6e12) return compact(deg*3.6e9, 3) + " μas";
  return deg.toExponential(2).replace(".", ",") + "°";
}

/** Un pas de graduation « rond » : 1, 2 ou 5 fois une puissance de dix.
 *  Visé sur une dizaine de divisions — moins, et la règle ne porte plus assez
 *  de nombres pour qu'on y lise une distance. */
function pasJoli(champ){
  const brut = champ / 11;
  const p = Math.pow(10, Math.floor(Math.log10(brut)));
  for(const m of [1, 2, 5]) if(brut <= m*p) return m*p;
  return 10*p;
}

/* ================================================================ 5. LE CIEL

   Rien n'est importé : les étoiles sont un tirage déterministe, le relief est
   une somme de sinus, les astres sont des dégradés calculés. C'est le style de
   la maison, et c'est aussi la seule façon d'être sûr de ce qu'on montre. */

function melange(graine){
  let x = graine | 0 || 1;
  return function(){
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

/* Les étoiles portent des coordonnées ABSOLUES en degrés, azimut et hauteur.
   Conséquence voulue : quand le champ se resserre, elles s'écartent et sortent
   du cadre. C'est la preuve visible que l'échelle a changé — et c'est ce qui
   vide entièrement l'écran quand on grossit le trou noir. */
const ETOILES = (function(){
  const r = melange(20260805);
  const t = [];
  // Environ le compte de l'œil nu sous un ciel noir. À quatorze degrés de
  // champ il en reste une trentaine dans le cadre ; à un millionième de degré,
  // aucune. C'est cette disparition qui rend le grossissement palpable.
  for(let i = 0; i < 4000; i++){
    t.push({
      az:  (r()*2 - 1) * 95,
      alt: Math.pow(r(), 0.72) * 88,
      m:   Math.pow(r(), 2.6),          // beaucoup de faibles, peu de vives
      teinte: r(),
    });
  }
  return t;
})();

function reliefAlt(az){
  return 1.15
       + 1.05*Math.sin(az*0.0431 + 0.7)
       + 0.55*Math.sin(az*0.1170 + 1.7)
       + 0.30*Math.sin(az*0.3100 + 0.4)
       + 0.14*Math.sin(az*0.8300 + 2.9);
}

/* ------------------------------------------------------------ les astres eux-mêmes
   Chaque corps est une évocation dessinée, pas une carte. Les taches de la Lune,
   les bandes de Jupiter, les continents de la Terre ne sont pas relevés sur une
   source : ils disent « ce n'est pas une bille lisse », rien de plus. Le seul
   chiffre qui engage cette page, c'est le diamètre. */

/* D'OÙ VIENT LA LUMIÈRE — un seul écrivain.

   Le reflet de `limbe` disait implicitement d'où le Soleil éclaire : en haut à
   gauche. Tant que ce fichier était seul à peindre, ça pouvait rester dans une
   expression. `terrelune.js` calcule maintenant un terminateur sur les mêmes
   globes, et deux éclairages sur un même astre, c'est la soupe de drapeaux sous
   un autre nom — l'ombre tomberait d'un côté et le reflet de l'autre.

   La direction sort donc de la formule et devient une valeur, lue par les deux. */
const ECLAIRAGE = { dx: -0.32, dy: -0.34 };

function limbe(ctx, x, y, r, teinte, eclair){
  const [R, V, B] = teinte;
  const g = ctx.createRadialGradient(x + r*ECLAIRAGE.dx, y + r*ECLAIRAGE.dy, r*0.03, x, y, r*1.02);
  const f = (k) => `rgb(${Math.round(R*k)},${Math.round(V*k)},${Math.round(B*k)})`;
  g.addColorStop(0,    f(1.00 * eclair));
  g.addColorStop(0.55, f(0.86 * eclair));
  g.addColorStop(0.88, f(0.60 * eclair));
  g.addColorStop(1,    f(0.34 * eclair));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2*Math.PI); ctx.fill();
}

function taches(ctx, x, y, r, liste, couleur, alpha){
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r*0.995, 0, 2*Math.PI); ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = couleur;
  for(const [dx, dy, rr] of liste){
    ctx.beginPath(); ctx.ellipse(x + dx*r, y + dy*r, rr*r, rr*r*0.82, 0.4, 0, 2*Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

function bandes(ctx, x, y, r, liste){
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r*0.995, 0, 2*Math.PI); ctx.clip();
  for(const [h, ep, coul, al] of liste){
    ctx.globalAlpha = al;
    ctx.fillStyle = coul;
    ctx.fillRect(x - r, y + h*r - ep*r/2, 2*r, ep*r);
  }
  ctx.restore();
}

const MERS = [[-0.32,-0.30,0.24],[0.10,-0.42,0.16],[0.30,-0.12,0.20],
              [-0.10,0.02,0.17],[-0.44,0.16,0.12],[0.06,0.34,0.10]];
const CONTINENTS = [[-0.30,-0.22,0.26],[0.18,-0.02,0.30],[0.34,0.36,0.16],
                    [-0.36,0.30,0.14],[0.02,0.44,0.12]];

function dessineAstre(ctx, a, x, y, r, eclair){
  switch(a.dessin){
    case "lune":
      limbe(ctx, x, y, r, a.teinte, eclair);
      taches(ctx, x, y, r, MERS, "#6d6a63", 0.42);
      break;

    case "mars":
      limbe(ctx, x, y, r, a.teinte, eclair);
      taches(ctx, x, y, r, [[-0.2,0.06,0.30],[0.28,-0.18,0.20]], "#7a4028", 0.30);
      taches(ctx, x, y, r, [[0.04,-0.80,0.22],[-0.02,0.82,0.16]], "#f2ece2", 0.75);
      break;

    case "terre":
      limbe(ctx, x, y, r, a.teinte, eclair);
      taches(ctx, x, y, r, CONTINENTS, "#5c7a52", 0.62);
      taches(ctx, x, y, r, [[-0.1,-0.5,0.30],[0.35,0.15,0.24],[-0.45,0.35,0.20]],
             "#ffffff", 0.28);
      break;

    case "neptune":
      limbe(ctx, x, y, r, a.teinte, eclair);
      bandes(ctx, x, y, r, [[-0.35,0.16,"#2b4f9e",0.30],[0.30,0.20,"#5a86d8",0.20]]);
      taches(ctx, x, y, r, [[-0.22,0.20,0.13]], "#16306b", 0.55);
      break;

    case "jupiter":
      limbe(ctx, x, y, r, a.teinte, eclair);
      bandes(ctx, x, y, r, [
        [-0.62,0.16,"#b89a78",0.42], [-0.40,0.13,"#eadfcd",0.35],
        [-0.18,0.17,"#a8825e",0.45], [ 0.04,0.12,"#f0e6d4",0.30],
        [ 0.26,0.16,"#b08a63",0.42], [ 0.50,0.14,"#e3d6c0",0.28],
        [ 0.70,0.14,"#9d7a58",0.38],
      ]);
      ctx.save();
      ctx.beginPath(); ctx.arc(x, y, r*0.995, 0, 2*Math.PI); ctx.clip();
      ctx.globalAlpha = 0.55; ctx.fillStyle = "#c05a3c";
      ctx.beginPath(); ctx.ellipse(x - r*0.26, y + r*0.26, r*0.20, r*0.11, 0, 0, 2*Math.PI);
      ctx.fill();
      ctx.restore();
      break;

    case "saturne": {
      const an = a.anneaux;
      // l'arrière des anneaux, puis le globe, puis l'avant : c'est la seule
      // façon d'obtenir le passage devant/derrière sans profondeur.
      anneau(ctx, x, y, r, an, eclair, Math.PI, 2*Math.PI);
      limbe(ctx, x, y, r, a.teinte, eclair);
      bandes(ctx, x, y, r, [[-0.45,0.20,"#c3a87e",0.30],[0.05,0.24,"#efe2c4",0.22],
                            [0.50,0.20,"#b99b70",0.28]]);
      anneau(ctx, x, y, r, an, eclair, 0, Math.PI);
      break; }

    case "soleil":  break;   // traité à part : on est dedans
    case "trou":    break;   // jamais dessiné tant qu'il est sous le pixel
  }
}

/* Les anneaux : trois ellipses concentriques d'ouverture faible, avec la
   division qu'on attend. Dessin, pas mesure. */
function anneau(ctx, x, y, r, an, eclair, a0, a1){
  const incl = 0.30;                    // aplatissement vu de biais
  ctx.save();
  ctx.lineWidth = 1;
  const trace = (rr, ep, alpha, coul) => {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = coul;
    ctx.lineWidth = Math.max(0.6, ep*r);
    ctx.beginPath();
    ctx.ellipse(x, y, rr*r, rr*r*incl, -0.16, a0, a1);
    ctx.stroke();
  };
  const k = 220*eclair;
  const c = `rgb(${Math.round(k)},${Math.round(k*0.93)},${Math.round(k*0.76)})`;
  trace((an.rInt + 1.42)/2, 0.22, 0.34, c);          // C, pâle
  trace(1.72, 0.34, 0.72, c);                        // B, dense
  trace(2.12, 0.20, 0.50, c);                        // A
  ctx.restore();
}

/* =============================================================== 6. LE RENDU */

/* L'unité de l'interface.
 *
 *  Tout le bandeau — polices, marges, hauteur de la règle — se mesure en `u`
 *  plutôt qu'en pixels. Un canevas de téléphone fait trois cent quarante
 *  pixels de large ; les tailles taillées pour six cents s'y chevauchaient
 *  jusqu'à rendre la légende illisible, ce qui est la seule faute qu'une page
 *  dont le sujet est la lisibilité ne puisse pas se permettre.
 *
 *  Le DESSIN, lui, ne suit pas `u` : un degré vaut W/champ pixels et rien
 *  d'autre. Mettre l'échelle du ciel à l'échelle de l'interface reviendrait à
 *  mentir sur les tailles pour faire tenir du texte. */
function unite(W){ return Math.max(0.60, Math.min(1.08, W/620)); }

function dessine(ctx, W, H, opts){
  const o = opts || {};
  const a = astre();
  const u = unite(W);
  const champ = champEffectif();
  const pxdeg = W / champ;
  const yH = Math.round(H * 0.80);          // l'horizon géométrique, 0°
  const zoome = etat.grossissement > 0.02;

  const R_km = rayonDe(a);
  const theta = diametreApparent(R_km, D_LUNE_KM);
  const dedans = englobe(a);
  const rPx = isFinite(theta) ? theta/2 * pxdeg : 0;
  const clarte = a.clarte;

  ctx.save();
  ctx.clearRect(0, 0, W, H);

  /* --- le ciel ---------------------------------------------------------- */
  const nuit = ctx.createLinearGradient(0, 0, 0, yH);
  const l = 0.10 + clarte*0.30;
  nuit.addColorStop(0, `rgb(${Math.round(5+8*l)},${Math.round(6+11*l)},${Math.round(14+26*l)})`);
  nuit.addColorStop(1, `rgb(${Math.round(12+22*l)},${Math.round(14+26*l)},${Math.round(28+46*l)})`);
  ctx.fillStyle = nuit;
  ctx.fillRect(0, 0, W, yH);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, yH, W, H - yH);

  if(dedans){ dessineDedans(ctx, W, H, a); }

  /* --- les étoiles ------------------------------------------------------- */
  // Elles s'éteignent sous un ciel très éclairé, et elles disparaissent tout à
  // fait dans le zoom : à cent millionièmes de degré de champ, il n'y a plus
  // rien dans le cadre. C'est exact, et c'est le propos.
  if(!dedans){
    const voile = 1 - Math.min(0.85, clarte*0.85);
    for(const e of ETOILES){
      const x = W/2 + e.az * pxdeg;
      const y = yH - e.alt * pxdeg;
      if(x < -2 || x > W + 2 || y < -2 || y > yH) continue;
      const b = Math.pow(e.m, 0.7) * voile;
      if(b < 0.03) continue;
      const t = 205 + Math.round(e.teinte*50);
      ctx.globalAlpha = Math.min(1, b*1.15);
      ctx.fillStyle = `rgb(${t},${Math.round(t*0.97)},${Math.round(200+e.teinte*55)})`;
      const rr = 0.5 + b*1.2;
      ctx.beginPath(); ctx.arc(x, y, rr, 0, 2*Math.PI); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* --- l'astre ----------------------------------------------------------- */
  const yObj = Math.max(rPx + 10, Math.min(yH * 0.44, yH - rPx - 8));
  const altObj = (yH - yObj) / pxdeg;

  if(a.dessin === "trou"){
    dessineTrou(ctx, W, yH, W/2, yH*0.44, theta, pxdeg);
  } else if(!dedans){
    const halo = clarte * (a.dessin === "lune" ? 0.9 : 0.55);
    if(halo > 0.02 && rPx > 2){
      const g = ctx.createRadialGradient(W/2, yObj, rPx, W/2, yObj, rPx*2.6);
      g.addColorStop(0, `rgba(200,214,255,${0.16*halo})`);
      g.addColorStop(1, "rgba(200,214,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(W/2, yObj, rPx*2.6, 0, 2*Math.PI); ctx.fill();
    }
    if(rPx >= 0.5) dessineAstre(ctx, a, W/2, yObj, rPx, 1);
  }

  /* --- le sol ------------------------------------------------------------- */
  // Il passe DEVANT l'astre : un objet de cent vingt degrés descendrait sous
  // l'horizon, et c'est le sol qui doit le couper, pas un cadrage arrangé.
  if(!zoome) dessineSol(ctx, W, H, yH, pxdeg, clarte);

  /* --- les repères -------------------------------------------------------- */
  // Un voile en bas pour la règle. En haut, pas de voile : il assombrirait
  // justement l'objet qu'on est venu regarder. La légende porte son propre
  // fond, taillé à sa taille.
  voile(ctx, W, H, H - 112*u, "rgba(4,4,9,0.88)");

  regle(ctx, W, H, champ, pxdeg, u);
  if(!dedans && a.dessin !== "trou" && rPx >= 0.5)
    crochet(ctx, W, yObj, rPx, theta, u);
  if(!zoome) luneTemoin(ctx, W, H, pxdeg, a, u);
  legende(ctx, W, H, a, theta, dedans, altObj, pxdeg, u, o);

  ctx.restore();
}

/* Le sol. Éclairé par ce qui est accroché là-haut — et c'est une INDICATION,
   pas un calcul photométrique. On ne publie donc aucun chiffre de luminosité :
   il faudrait des albédos géométriques et des fonctions de phase, et ce module
   n'en a pas. La note à l'écran le dit. */
function dessineSol(ctx, W, H, yH, pxdeg, clarte){
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, H);
  const az0 = -W/2/pxdeg;
  for(let px = 0; px <= W; px += 3){
    const az = az0 + px/pxdeg;
    ctx.lineTo(px, yH - reliefAlt(az)*pxdeg);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, yH - 3*pxdeg, 0, H);
  const k = 0.055 + clarte*0.16;
  g.addColorStop(0, `rgb(${Math.round(255*k*0.8)},${Math.round(255*k*0.84)},${Math.round(255*k)})`);
  g.addColorStop(1, `rgb(${Math.round(255*k*0.20)},${Math.round(255*k*0.22)},${Math.round(255*k*0.30)})`);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}

/* Le Soleil à la place de la Lune : on est dedans. Le cadre est plein, il n'y a
   pas de silhouette, pas d'horizon, pas de diamètre apparent. C'est la seule
   ligne du tableau qui n'a pas de réponse, et il vaut mieux le montrer comme ça
   que d'inventer un angle. */
function dessineDedans(ctx, W, H, a){
  const g = ctx.createRadialGradient(W*0.5, H*0.42, 0, W*0.5, H*0.42, Math.hypot(W, H)*0.7);
  g.addColorStop(0,   "#fffdf4");
  g.addColorStop(0.5, "#ffe8a8");
  g.addColorStop(1,   "#f0a13a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // une granulation, pour que ce ne soit pas un aplat mort
  const r = melange(7717);
  ctx.globalAlpha = 0.055;
  for(let i = 0; i < 1400; i++){
    const x = r()*W, y = r()*H, rr = 3 + r()*22;
    ctx.fillStyle = r() > 0.5 ? "#fff8d8" : "#d97b23";
    ctx.beginPath(); ctx.arc(x, y, rr, 0, 2*Math.PI); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* Le trou noir.
 *
 *  On ne dessine RIEN tant que son diamètre reste sous le demi-pixel. Pas de
 *  point pâle, pas de halo, pas de « voilà où il serait ». Un point pâle serait
 *  un mensonge de dix ordres de grandeur, et ce serait exactement le mensonge
 *  que cette page combat.
 *
 *  Ce qui se dessine à sa place : un réticule, déclaré comme aide de lecture,
 *  et le chiffre de sa taille en pixels. Deux milliardièmes de pixel — c'est
 *  plus parlant qu'un dessin, et c'est vrai. */
function dessineTrou(ctx, W, yH, x, y, theta, pxdeg){
  const dPx = theta * pxdeg;

  if(dPx >= 0.5){
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.arc(x, y, dPx/2, 0, 2*Math.PI); ctx.fill();
    // un liseré, sinon un disque noir sur fond noir n'existe pas à l'écran.
    // Il est DEHORS du disque : il ne l'agrandit pas.
    ctx.strokeStyle = "rgba(255,154,60,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, dPx/2 + 1.2, 0, 2*Math.PI); ctx.stroke();
  }

  ctx.save();
  ctx.strokeStyle = "rgba(255,154,60,0.60)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 5]);
  const e = Math.max(22, dPx*0.8 + 22), t = 10;
  ctx.beginPath();
  ctx.moveTo(x - e, y); ctx.lineTo(x - e + t, y);
  ctx.moveTo(x + e, y); ctx.lineTo(x + e - t, y);
  ctx.moveTo(x, y - e); ctx.lineTo(x, y - e + t);
  ctx.moveTo(x, y + e); ctx.lineTo(x, y + e - t);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

/** Un fondu du bord `y0` vers `y1`, opaque au bord. */
function voile(ctx, W, y0, y1, couleur){
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, couleur);
  g.addColorStop(1, couleur.replace(/[\d.]+\)$/, "0)"));
  ctx.fillStyle = g;
  ctx.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0));
}

/* La règle. Elle ne disparaît jamais, et elle se renumérote en changeant
   d'unité — c'est elle qui fait sentir la chute des degrés aux microsecondes
   d'arc quand on grossit le trou noir. */
function regle(ctx, W, H, champ, pxdeg, u){
  const y = H - 34*u;
  const pas = pasJoli(champ);
  ctx.save();
  ctx.strokeStyle = "rgba(169,198,255,0.55)";
  ctx.fillStyle   = "rgba(169,198,255,0.80)";
  ctx.lineWidth = 1;
  ctx.font = (11*u).toFixed(1) + "px ui-monospace, monospace";
  ctx.textAlign = "center";

  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();

  const n = Math.ceil(champ/2/pas);
  const ecart = pas*pxdeg;
  // Une étiquette d'angle fait jusqu'à sept caractères — « 1,44 μas ». On ne
  // numérote donc qu'une graduation sur deux dès qu'elles se rapprochent, sinon
  // les chiffres se chevauchent et la règle ne se lit plus.
  const saute = ecart < 60*u ? 2 : 1;
  for(let i = -n; i <= n; i++){
    const x = W/2 + i*ecart;
    if(x >= 12 && x <= W - 12){
      const grand = (i % saute === 0);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - (grand ? 8 : 4)*u); ctx.stroke();
      if(grand) ctx.fillText(etiquetteAngle(Math.abs(i*pas)), x, y + 13*u);
    }
    const xm = x + ecart/2;              // la demi-graduation, muette
    if(xm >= 6 && xm <= W - 6){
      ctx.beginPath(); ctx.moveTo(xm, y); ctx.lineTo(xm, y - 3*u); ctx.stroke();
    }
  }
  ctx.textAlign = "left";
  ctx.globalAlpha = 0.55;
  const px = pxdeg >= 1e5 ? pxdeg.toExponential(1).replace(".", ",")
                          : nombre(pxdeg, pxdeg < 10 ? 1 : 0);
  ctx.fillText((W < 460 ? "" : "ciel déroulé — ") + "champ " + etiquetteAngle(champ)
               + ", un degré = " + px + " px partout", 14*u, H - 8*u);
  ctx.restore();
}

/* Le crochet sous l'astre : sa taille, écrite au-dessous de sa largeur. */
function crochet(ctx, W, yObj, rPx, theta, u){
  const y = yObj + rPx + 16*u;
  ctx.save();
  ctx.strokeStyle = "rgba(255,154,60,0.75)";
  ctx.fillStyle   = "rgba(255,154,60,0.95)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W/2 - rPx, y - 5*u); ctx.lineTo(W/2 - rPx, y);
  ctx.lineTo(W/2 + rPx, y);       ctx.lineTo(W/2 + rPx, y - 5*u);
  ctx.stroke();
  ctx.font = (12*u).toFixed(1) + "px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(etiquetteAngle(theta) + "  ·  " + nombre(enLunes(theta), 1) + " Lunes",
               W/2, y + 13*u);
  ctx.restore();
}

/* La Lune témoin. Toujours là, toujours à l'échelle courante — y compris quand
   elle ne fait plus que trois pixels. Surtout quand elle ne fait plus que trois
   pixels : c'est à ce moment-là qu'elle dit quelque chose. */
function luneTemoin(ctx, W, H, pxdeg, a, u){
  if(a.cle === "lune") return;            // on la regarde déjà, en plus grand

  const r = THETA_LUNE/2 * pxdeg;
  // Sur un canevas étroit, le coin haut-droit appartient à la légende. Le
  // témoin descend alors juste au-dessus de la règle, où il reste toujours de
  // la place — le ciel y est vide par construction, c'est le bas de l'horizon.
  const etroit = W < 460;
  const cx = etroit ? W - 52*u : W - 74*u;
  const cy = etroit ? H - 150*u : 52*u;

  ctx.save();
  panneau(ctx, cx - 62*u, cy - 30*u, 124*u, 82*u);
  ctx.font = (10*u).toFixed(1) + "px ui-monospace, monospace";
  ctx.textAlign = "center";

  if(r >= 0.5){
    limbe(ctx, cx, cy, r, [214,208,196], 1);
    if(r > 6) taches(ctx, cx, cy, r, MERS, "#6d6a63", 0.42);
  } else {
    // Sous le demi-pixel, la Lune non plus n'a pas droit à un dessin flatté :
    // un pixel, pas davantage. C'est la même règle que pour le trou noir.
    ctx.fillStyle = "rgba(214,208,196,0.9)";
    ctx.fillRect(cx - 0.5, cy - 0.5, 1, 1);
  }
  ctx.fillStyle = "rgba(169,198,255,0.62)";
  ctx.fillText("la Lune, même échelle", cx, cy + 32*u);
  ctx.fillText(nombre(2*r, 1) + " px", cx, cy + 44*u);
  ctx.restore();
}

/* La légende. Sobre, et elle déclare ce qui est dessiné plutôt que mesuré.
 *
 *  Elle porte son propre fond, taillé à la hauteur du texte : par-dessus le
 *  Soleil, un texte clair sur du blanc ne se lit pas, et voiler tout le haut du
 *  cadre reviendrait à assombrir l'objet qu'on est venu voir. */
function legende(ctx, W, H, a, theta, dedans, altObj, pxdeg, u, o){
  const marge = 16*u;
  // La colonne de texte laisse la place au témoin lunaire — sauf sur un canevas
  // étroit, où le témoin est allé se mettre en bas et rend la largeur entière.
  const etroit = W < 460;
  const largeur = Math.min(560, W - 2*marge - (etroit ? 0 : 150*u));

  const fTitre = (17*u).toFixed(1) + "px ui-serif, Georgia, serif";
  const fMono  = (12.5*u).toFixed(1) + "px ui-monospace, monospace";
  const fNote  = (13*u).toFixed(1) + "px ui-sans-serif, system-ui, sans-serif";
  const AMBRE  = "rgba(255,154,60,0.92)", GRIS = "rgba(154,149,142,0.95)";

  /* On COMPOSE d'abord, on dessine ensuite. Deux raisons : le fond doit
     connaître la hauteur du bloc avant d'être posé, et les lignes de chiffres
     doivent pouvoir se replier comme la prose — sur un téléphone, « l'anneau de
     Sgr A* fait 51,8 μas… » ne tient pas sur une ligne, et une phrase coupée
     par le bord du cadre ne vaut pas mieux qu'une phrase absente. */
  const donnees = [];
  if(a.dessin === "trou"){
    const dPx = theta * pxdeg;
    // Les deux seuils sont CALCULÉS : celui de l'apparition dépend de la
    // largeur du cadre, et l'écrire en dur serait un chiffre faux dès qu'on
    // redimensionne la fenêtre.
    const gApparait = Math.log10(0.5 / (theta * W/etat.champ));
    const gLune = Math.log10(THETA_LUNE / theta);
    donnees.push([AMBRE, etiquetteAngle(theta) + "  ·  rayon "
      + nombre(rayonSchwarzschild(gmDe(a))*1000, 3) + " mm"]);
    // Le texte suit ce que le dessin fait vraiment : dire « rien n'est dessiné »
    // alors qu'un disque est à l'écran serait le genre de légende qui ment.
    donnees.push([GRIS, dPx >= 0.5
      ? "son disque mesure ici " + nombre(dPx, dPx < 10 ? 2 : 0) + " pixels — le voilà"
      : "son disque mesure ici " + dPx.toExponential(1).replace(".", ",")
        + " pixel — rien n'est dessiné"]);
    donnees.push([GRIS, "grossissement " + (etat.grossissement < 0.02
      ? "×1 — il apparaîtra à ×10^" + nombre(gApparait, 1)
        + ", il aura la taille de la Lune à ×10^" + nombre(gLune, 1)
      : "×10^" + nombre(etat.grossissement, 2))]);
    donnees.push([GRIS, "l'anneau de Sgr A* fait " + nombre(SGRA_ANNEAU_UAS, 1)
      + " μas, soit " + nombre(SGRA_ANNEAU_UAS/(theta*3.6e9), 0)
      + " fois plus large. C'est le plus fin détail jamais photographié."]);
  } else if(dedans){
    donnees.push([AMBRE, "pas de diamètre apparent : on est à l'intérieur"]);
    donnees.push([GRIS, "rayon " + nombre(a.rayon_km, 0) + " km = "
      + nombre(a.rayon_km/D_LUNE_KM, 2) + " fois la distance Terre–Lune"]);
  } else {
    donnees.push([AMBRE, etiquetteAngle(theta) + "  ·  " + nombre(enLunes(theta), 2)
      + " Lunes de large  ·  " + nombre(enLunes(theta)*enLunes(theta), 0)
      + " Lunes de surface"]);
    donnees.push([GRIS, "rayon moyen " + nombre(a.rayon_km, a.rayon_km < 10000 ? 1 : 0)
      + " km, à " + nombre(D_LUNE_KM, 0) + " km  ·  hauteur "
      + etiquetteAngle(altObj) + " sur l'horizon"]);
  }

  ctx.save();
  ctx.textAlign = "left";

  ctx.font = fMono;
  const lignesD = [];
  for(const [c, t] of donnees) for(const l of decoupe(ctx, t, largeur)) lignesD.push([c, l]);
  ctx.font = fNote;
  const lignesN = decoupe(ctx, a.note, largeur);

  const hTitre = 26*u, hD = 17*u, hN = 17*u;
  panneau(ctx, 0, 0, Math.min(W, marge + largeur + 24*u),
          hTitre + 4*u + lignesD.length*hD + 14*u + lignesN.length*hN + 12*u);

  let y = hTitre;
  ctx.fillStyle = "rgba(232,229,224,0.95)";
  ctx.font = fTitre;
  ctx.fillText("À la place de la Lune : " + a.nom, marge, y);
  y += 4*u;

  ctx.font = fMono;
  for(const [c, t] of lignesD){ y += hD; ctx.fillStyle = c; ctx.fillText(t, marge, y); }

  y += 14*u;
  ctx.fillStyle = "rgba(154,149,142,0.92)";
  ctx.font = fNote;
  for(const t of lignesN){ y += hN; ctx.fillText(t, marge, y); }

  /* Les déclarations : ce qui est dessiné et ne mesure rien. Elles restent même
     quand la place manque — c'est la règle de la maison, la surcouche se
     déclare — mais elles se replient au-dessus de la règle plutôt que de
     s'écrire par-dessus. */
  ctx.font = (10*u).toFixed(1) + "px ui-monospace, monospace";
  ctx.fillStyle = "rgba(154,149,142,0.55)";
  const decl = ["dessin : reliefs, taches et bandes sont évoqués, pas relevés",
                "l'éclairage du sol est indicatif, il n'est pas calculé"];
  if(a.anneaux) decl.push("l'étendue des anneaux est un dessin, pas une mesure");
  if(a.dessin === "trou") decl.push("le réticule est une aide de lecture, il n'a pas de taille");
  decl.forEach((t, i) => ctx.fillText(t, marge, H - 50*u - (decl.length - 1 - i)*12*u));

  // Le rappel des touches ne s'affiche que si l'appelant le demande : une page
  // qui offre déjà des boutons n'en a pas besoin, et il viendrait buter contre
  // la légende du champ, à gauche sur la même ligne.
  if(o.aide){
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(154,149,142,0.5)";
    ctx.fillText("← →  changer d'astre   ·   F  champ figé à 60°"
                 + (a.dessin === "trou" ? "   ·   ↑ ↓  grossir" : ""), W - marge, H - 22*u);
  }
  ctx.restore();
}

/** Découpe un texte en lignes tenant dans `largeur`, sans rien dessiner : il
 *  faut connaître la hauteur du bloc avant de poser le fond qui va dessous. */
function decoupe(ctx, texte, largeur){
  const lignes = [];
  let ligne = "";
  for(const m of texte.split(" ")){
    const essai = ligne ? ligne + " " + m : m;
    if(ctx.measureText(essai).width > largeur && ligne){ lignes.push(ligne); ligne = m; }
    else ligne = essai;
  }
  if(ligne) lignes.push(ligne);
  return lignes;
}

/** Un fond sombre à coins adoucis, sous un bloc de texte. */
function panneau(ctx, x, y, w, h){
  ctx.save();
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0,    "rgba(4,4,9,0.84)");
  g.addColorStop(0.88, "rgba(4,4,9,0.80)");
  g.addColorStop(1,    "rgba(4,4,9,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/* ============================================================== 7. L'ANTICLIMAX

   Ce que le remplacement change, et ce qu'il ne change pas. C'est le cœur de la
   page, et c'est le contraire d'un spectacle : deux colonnes de chiffres
   identiques.

   Le théorème des coquilles de Newton — et, en relativité, celui de Birkhoff —
   dit qu'à l'extérieur d'une distribution à symétrie sphérique le champ ne
   dépend que de la masse totale. Une boule de 3 475 km et un point de 0,109 mm
   de la même masse tirent identiquement sur la Terre. `outil-verif-lune.js`
   ne se contente pas de citer le théorème : il intègre la boule numériquement
   et compare. */
function bilan(distance_km){
  const d_m = (distance_km || D_LUNE_KM) * 1000;
  const lune = ASTRES.find(a => a.cle === "lune");
  const trou = ASTRES.find(a => a.cle === "trounoir");
  const GM = gmDe(lune);
  return {
    identique: [
      { quoi:"masse",                    val: masseDe(lune),                unite:"kg" },
      { quoi:"GM",                       val: GM,                           unite:"m³/s²" },
      { quoi:"accélération à 384 400 km", val: acceleration(GM, d_m),        unite:"m/s²" },
      { quoi:"coefficient de marée 2GM/d³", val: coefficientMaree(GM, d_m),  unite:"s⁻²" },
      { quoi:"période orbitale",         val: null, unite:"inchangée" },
    ],
    perdu: [
      { quoi:"le disque",   avant: diametreApparent(rayonDe(lune), distance_km || D_LUNE_KM),
        apres: diametreApparent(rayonDe(trou), distance_km || D_LUNE_KM), unite:"°" },
      { quoi:"le clair de lune", avant:1, apres:0, unite:"" },
      { quoi:"les éclipses", avant:1, apres:0, unite:"" },
    ],
    /* Les éclipses tiennent à trois pour cent. Le Soleil vu de la Terre fait
       0,533°, la Lune 0,518° : c'est le rapport 1,03 qui rend les éclipses
       totales possibles, et de justesse. C'est cela qu'on perd, pas un vague
       agrément. */
    eclipse: {
      soleilDepuisTerre: diametreApparent(695700, UA_KM),
      luneDepuisTerre: THETA_LUNE,
      get rapport(){ return this.soleilDepuisTerre / this.luneDepuisTerre; },
    },
  };
}

/* ================================================================== 8. SORTIE */

global.LUNE = {
  // données et sources
  ASTRES, SOURCES, D_LUNE_KM, UA_KM, G, C, THETA_LUNE, SGRA_ANNEAU_UAS, ECLAIRAGE,
  // calcul
  diametreApparent, diametreApparentTangente, enLunes, rayonSchwarzschild,
  acceleration, coefficientMaree, gmDe, masseDe, rayonDe, englobe,
  tableau, bilan,
  // mise en vue
  etat, astre, choisis, suivant, basculeChampFige, grossis, avance,
  champEffectif, GROSSISSEMENT_MAX, CHAMP_MIN, CHAMP_MAX, CHAMP_FIGE,
  // rendu et mise en forme. `dessineAstre` sort parce que `terrelune.js` peint
  // les MÊMES globes à l'arrivée du voyage : une seconde façon de dessiner la
  // Terre donnerait deux Terres, et l'œil d'Hugo l'a déjà vu une fois.
  dessine, dessineAstre, etiquetteAngle, nombre,
};

})(window);
