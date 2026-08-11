/* ============================================================================
   LE RIVAGE — se tenir sur la Terre, la nuit, et changer ce qu'il y a dans le
   ciel.

   Décidé par Hugo le 11 août 2026, contre la page `lune.html` qu'il venait de
   voir : « c'est très bien, mais c'est une page d'explication, ce n'est pas
   vraiment une page de jeu. Moi je veux que le joueur il soit dans un monde
   interactif. Il peut cliquer, voilà, je mets la Lune. Il voit comment c'est la
   Lune. EN TANT QUE JOUEUR SUR TERRE, pas juste une page HTML. »

   Et son second choix, qui commande tout ce fichier : le ciel ne bouge pas —
   on regarde — MAIS LA MER, SI.

   C'est ce couple qui fait la démonstration. On met le trou noir de la masse de
   la Lune : le ciel se vide, il n'y a plus rien à voir du tout. Et la mer monte
   et descend EXACTEMENT PAREIL. La marée ne demande pas de lumière, elle ne
   demande pas de taille, elle ne demande pas de surface. Elle ne demande que la
   masse et la distance. Un joueur qui a vu ça n'a plus besoin qu'on lui explique
   le théorème de Birkhoff : il l'a dans les yeux.

   ---------------------------------------------------------------------------
   CE MODULE NE CONTIENT AUCUN CHIFFRE D'ASTRE

   Pas un. Les rayons, les masses, les GM, les distances : tout vient de
   `LUNE.ASTRES`, qui les porte déjà avec leurs sources JPL et UAI. Le rivage
   DÉRIVE, il ne recopie pas — c'est la règle 7 du projet, et c'est aussi ce qui
   fait qu'un chiffre corrigé chez la Lune corrige le rivage sans qu'on y pense.

   Les deux seules constantes propres à ce fichier sont la rotation de la Terre
   et le coefficient de Roche. Elles portent leurs sources plus bas, et aucune
   des deux n'existe dans `LUNE`.

   ---------------------------------------------------------------------------
   NI DOM NI WebGL

   Comme tous les modules du dépôt. Le rivage calcule une SCÈNE — la hauteur de
   la mer, la taille de l'astre dans le ciel, l'état du cadran — et la page la
   peint. C'est ce qui permet à `outil-verif-rivage.js` de l'éprouver dans node,
   sans carte graphique, en quelques millisecondes.

   ---------------------------------------------------------------------------
   LA MARÉE — d'où elle sort, et pourquoi elle n'est pas dessinée

   Le potentiel de marée d'un astre de paramètre GM à la distance d, sur une
   Terre de rayon R, s'écrit au second ordre

       Φ(θ) = −(GM · R²/d³) · P₂(cos θ),        P₂(x) = (3x² − 1)/2

   où θ est l'angle depuis la direction de l'astre. La surface d'un océan à
   l'équilibre est une équipotentielle : elle se déforme jusqu'à ce que g·h
   compense Φ, donc

       h(θ) = (GM · R²)/(g · d³) · P₂(cos θ)

   et comme g = GM_Terre/R², le rayon monte à la puissance quatre et la gravité
   terrestre disparaît au profit d'un simple rapport de masses :

       h(θ) = (GM_astre/GM_Terre) · (R⁴/d³) · P₂(cos θ)

   C'est la MARÉE D'ÉQUILIBRE. Pour la Lune elle donne 54 cm entre haute et
   basse mer — pas les 12 m de la baie du Mont-Saint-Michel, qui sont un effet
   de résonance de bassin et non un effet de marée. Le module annonce la marée
   d'équilibre et le déclare, parce que c'est elle qui se dérive ; l'amplification
   par la forme des côtes est un autre problème, et l'inventer serait une loi de
   plus (règle 4).

   RIEN ICI N'EST CHOISI POUR ÊTRE JOLI. Le marnage de la Lune sort petit, et il
   sort petit. Ce qui rend la scène spectaculaire, ce n'est pas d'avoir gonflé la
   Lune : c'est Jupiter à la même distance, qui donne quatorze kilomètres.

   ---------------------------------------------------------------------------
   LE RYTHME — pourquoi il n'est pas « douze heures » en dur

   La Terre tourne sous le bourrelet, donc on traverse deux marées hautes par
   tour. Mais le bourrelet lui-même tourne, parce que l'astre orbite. La période
   des marées est celle du jour APPARENT de l'astre, divisé par deux :

       1/T_marée = ½ · |1/T_rotation − 1/T_orbite|

   et T_orbite se dérive de la troisième loi de Kepler sur le couple, avec la
   masse des DEUX corps :

       T_orbite = 2π √( d³ / (GM_Terre + GM_astre) )

   Pour la Lune cela redonne 27,3 jours d'orbite et 12 h 25 de marée — le chiffre
   que tous les almanachs des marées impriment. Personne ne l'a saisi ici : il
   tombe de Kepler et de la rotation terrestre.

   Et pour Jupiter à la distance lunaire, l'orbite tombe à un jour et demi, donc
   le rythme des marées devient tout autre. C'est une conséquence, pas une
   décision.

   ---------------------------------------------------------------------------
   EST-CE QUE LA TERRE SURVIT — la question que la scène doit poser

   À la distance lunaire, deux astres de la table tuent la Terre, et pas pour la
   même raison. Le module rend un verdict pour que la page ne l'invente pas :

     "rivage"   la scène a lieu, on est debout dessus
     "englouti" le rayon de l'astre dépasse la distance : on est DEDANS.
                C'est le Soleil, et `LUNE.englobe` le dit déjà.
     "brisee"   on est sous la limite de Roche : la Terre se disloque avant
                d'avoir une marée. C'est le Soleil aussi, par surcroît.

   L'ordre compte : englouti l'emporte, parce qu'être à l'intérieur du Soleil
   est un fait plus immédiat qu'une limite de stabilité.
   ============================================================================ */

(function(global){
"use strict";

/* --------------------------------------------------------------------------
   LES DEUX SEULES CONSTANTES DE CE FICHIER, ET LEURS SOURCES              */
const SOURCES = {
  iers2010: {
    ref: "G. Petit et B. Luzum (éd.), « IERS Conventions (2010) », " +
         "IERS Technical Note No. 36, Bundesamt für Kartographie und " +
         "Geodäsie, Frankfurt am Main (2010), tableau 1.1",
    url: "https://www.iers.org/IERS/EN/Publications/TechnicalNotes/tn36.html",
    sert: "durée du jour sidéral terrestre : 86 164,0905 s. C'est la rotation " +
          "vraie de la Terre sur elle-même, pas les 86 400 s du jour solaire — " +
          "la différence est le tour d'orbite annuel, et l'employer ici serait " +
          "compter deux fois le mouvement de l'astre.",
  },
  roche1849: {
    ref: "É. Roche, « La figure d'une masse fluide soumise à l'attraction d'un " +
         "point éloigné », Mémoires de la section des sciences, Académie des " +
         "sciences et lettres de Montpellier, 1 (1849), 243–262 ; coefficient " +
         "fluide 2,44 d'après S. Chandrasekhar, Ellipsoidal Figures of " +
         "Equilibrium, Yale University Press (1969), chap. 8",
    sert: "limite de Roche fluide d = 2,44 · R_astre · (ρ_astre/ρ_Terre)^⅓. " +
          "La Terre est un corps fluide à cette échelle : ses roches n'ont " +
          "aucune cohésion devant sa propre gravité.",
  },
  equilibre: {
    ref: "G. H. Darwin, « The Tides and Kindred Phenomena in the Solar System », " +
         "Houghton Mifflin (1898), chap. 6 — théorie de la marée d'équilibre ; " +
         "voir aussi W. Munk et C. Wunsch, « Abyssal recipes II », " +
         "Deep-Sea Research 45 (1998), 1977–2010, pour l'écart aux marées réelles",
    doi: "10.1016/S0967-0637(98)00070-3",
    sert: "la marée d'équilibre h = (GM/GM_T)·(R⁴/d³)·P₂(cos θ), et le fait " +
          "qu'elle vaut 54 cm pour la Lune là où les marées observées vont de " +
          "quelques centimètres à douze mètres selon la résonance du bassin",
  },
};

const JOUR_SIDERAL_S = 86164.0905;    // IERS Conventions (2010), tableau 1.1
const ROCHE_FLUIDE   = 2.44;          // Roche 1849 / Chandrasekhar 1969

/* --------------------------------------------------------------------------
   LA SCÈNE — ce qu'on voit quand on se retourne

   Ces quatre-là ne sont pas de la physique : ce sont des choix de mise en
   scène, et ils se déclarent comme tels. La hauteur d'œil et l'horizon sont
   liés par la géométrie de la sphère, donc l'un se dérive de l'autre — mais
   « on est debout, pas allongé » reste une décision.                      */
const OEIL_M = 1.70;                  // hauteur des yeux au-dessus de la mer

/* Distance de l'horizon vue d'une hauteur h sur une sphère de rayon R :
   d = √(2Rh + h²). La réfraction atmosphérique l'allonge d'environ 8 %, et on
   ne l'applique PAS : elle dépend du gradient de température du jour, elle
   n'est pas une constante, et l'inventer serait une loi de plus. */
function horizonM(rayonTerre_m, oeil_m){
  return Math.sqrt(2*rayonTerre_m*oeil_m + oeil_m*oeil_m);
}

/* --------------------------------------------------------------------------
   OUTILLAGE — tout passe par LUNE, rien n'est ressaisi                    */

function terre(L){
  const t = L.ASTRES.find(a => a.cle === "terre");
  if(!t) throw new Error("rivage : la Terre a disparu de LUNE.ASTRES");
  return t;
}

function densite(L, a){
  const r = L.rayonDe(a) * 1000;                       // km → m
  return L.masseDe(a) / (4/3 * Math.PI * r*r*r);
}

/* Le polynôme de Legendre d'ordre 2 — le cœur de la marée. θ = 0 sous l'astre,
   θ = π/2 au quart de tour. */
function P2(cosTheta){ return (3*cosTheta*cosTheta - 1) / 2; }

/* --------------------------------------------------------------------------
   LA MARÉE D'ÉQUILIBRE

   Rend la hauteur signée de la mer, en mètres, à l'angle θ depuis la direction
   de l'astre. Positive sous l'astre ET à l'opposé — c'est le double bourrelet,
   et c'est pour cela qu'il y a deux marées hautes par jour et non une.      */
function hauteurMaree(L, a, distance_km, theta){
  const T   = terre(L);
  const gmA = L.gmDe(a);
  const gmT = L.gmDe(T);
  const R   = L.rayonDe(T) * 1000;                     // km → m
  const d   = distance_km * 1000;                      // km → m
  return (gmA/gmT) * (R*R*R*R)/(d*d*d) * P2(Math.cos(theta));
}

/* Le MARNAGE : l'écart entre haute et basse mer. P₂ va de +1 (sous l'astre) à
   −½ (au quart de tour), donc l'écart vaut 3/2 du coefficient. */
function marnage(L, a, distance_km){
  return hauteurMaree(L, a, distance_km, 0) - hauteurMaree(L, a, distance_km, Math.PI/2);
}

/* --------------------------------------------------------------------------
   LE RYTHME — Kepler, puis le jour apparent                                */

function periodeOrbite_s(L, a, distance_km){
  const gmTot = L.gmDe(a) + L.gmDe(terre(L));
  const d = distance_km * 1000;
  return 2*Math.PI * Math.sqrt(d*d*d / gmTot);
}

/* La demi-période du jour apparent de l'astre. Quand l'orbite est très rapide,
   le jour apparent s'allonge sans borne puis change de signe — la valeur
   absolue le couvre, et le cas d'égalité exacte (rotation synchrone) rendrait
   l'infini : la marée ne monte alors plus jamais, ce qui est correct et ce que
   le module annonce par `Infinity`. */
function periodeMaree_s(L, a, distance_km){
  const ecart = Math.abs(1/JOUR_SIDERAL_S - 1/periodeOrbite_s(L, a, distance_km));
  return ecart === 0 ? Infinity : 1 / (2 * ecart);
}

/* --------------------------------------------------------------------------
   LA TERRE SURVIT-ELLE                                                     */

function limiteRoche_km(L, a){
  const rapport = densite(L, a) / densite(L, terre(L));
  return ROCHE_FLUIDE * L.rayonDe(a) * Math.cbrt(rapport);
}

function verdict(L, a, distance_km){
  if(L.englobe(a, distance_km))                return "englouti";
  if(distance_km < limiteRoche_km(L, a))       return "brisee";
  return "rivage";
}

/* --------------------------------------------------------------------------
   LA SCÈNE COMPLÈTE — un seul objet, tout dérivé, rien de caché

   C'est ce que la page peint. `phase` va de 0 à 1 et parcourt UN cycle complet
   de marée ; elle ne porte aucune unité de temps, pour que la page reste libre
   d'accélérer sans que le module ait un avis là-dessus.                     */
function scene(L, cle, distance_km, phase){
  const d = (distance_km === undefined) ? L.D_LUNE_KM : distance_km;
  const a = L.ASTRES.find(x => x.cle === cle);
  if(!a) throw new Error("rivage : astre inconnu — " + cle);

  const v = verdict(L, a, d);
  const T = terre(L);
  const theta = 2*Math.PI * (phase || 0);

  return {
    cle: a.cle, nom: a.nom, court: a.court, genre: a.genre,
    teinte: a.teinte, dessin: a.dessin, anneaux: a.anneaux || null,
    note: a.note,
    distance_km: d,
    verdict: v,

    /* LE CIEL — fixe, comme Hugo l'a demandé. `englobe` est le seul cas où le
       diamètre apparent n'a pas de sens : on ne voit pas un objet dont on est
       à l'intérieur, et `LUNE` refuse déjà de le donner. */
    diametreApparent_deg: L.englobe(a, d) ? null : L.diametreApparent(L.rayonDe(a), d),
    enLunes: L.englobe(a, d) ? null : L.enLunes(L.diametreApparent(L.rayonDe(a), d)),

    /* LA MER — elle, elle bouge. Et c'est elle qui ne change pas d'un
       millimètre quand on remplace la Lune par le trou noir de même masse. */
    mer_m:            hauteurMaree(L, a, d, theta),
    marnage_m:        marnage(L, a, d),
    periodeMaree_s:   periodeMaree_s(L, a, d),
    periodeOrbite_s:  periodeOrbite_s(L, a, d),

    /* LE SOL */
    oeil_m: OEIL_M,
    horizon_m: horizonM(L.rayonDe(T)*1000, OEIL_M),
  };
}

/* --------------------------------------------------------------------------
   LE CADRAN — huit crans gravés, dans l'ordre de la table

   Ce n'est pas une liste écrite à la main : c'est `LUNE.ASTRES` lu dans
   l'ordre. Ajouter un astre chez la Lune grave un cran de plus, sans toucher
   ici — et un contrôle peut exiger que les deux listes coïncident.          */
function crans(L){
  return L.ASTRES.map(a => ({ cle: a.cle, court: a.court }));
}

/* --------------------------------------------------------------------------
   L'ÉTALON — la Lune, toujours présente, à la même échelle

   Décidé par Hugo le 11 août 2026, contre le premier jet du rivage : la Lune y
   faisait cinq pixels, ce qui est EXACT, mais elle est l'étalon auquel toute la
   scène compare. « Aussi gros que ça » n'a rien à quoi s'accrocher quand la
   chose à laquelle on compare est invisible. Son choix : garder chaque astre à
   sa taille vraie, et poser à côté un petit disque — la Lune, même ciel, même
   échelle — pour que « quarante fois » devienne une chose qu'on VOIT.

   Rien n'est faussé : les deux sont vrais en même temps. C'est pour cela que
   l'étalon se calcule ICI, au même endroit et par la même fonction que le
   diamètre de l'astre choisi. S'ils venaient de deux endroits, ils pourraient
   diverger — et ce serait la maladie des deux écrivains, celle qui a donné le
   disque à 622× (règle 4).                                                  */
/* --------------------------------------------------------------------------
   LES CARTES — la porte ouverte le 11 août 2026 par Hugo

   Il a regardé mon Jupiter dessiné à la main et tranché : « très très moche,
   on dirait une merde orange… tu ne t'acharnes pas trop avec cette promesse de
   tout est calculé, si on importe des trucs, aussi bien. »

   Il a raison, et le renversement mérite d'être écrit noir sur blanc : une
   carte photographique est une OBSERVATION, du même genre que les rayons et les
   masses du JPL que ce module dérive déjà. Mes bandes, elles, ne viennent de
   nulle part. **L'objet importé est le plus sourcé des deux.**

   Ce registre est donc VIDE, et c'est un état, pas un oubli. Aucune image n'a
   pu être rapatriée : la session qui a ouvert cette porte n'avait aucun accès
   au dehors. Ce qui est prêt, c'est la serrure.

   POUR EN AJOUTER UNE, il faut trois choses, et `carteValide` les exige :

     { cle:"jupiter", fichier:"cartes/jupiter.jpg", source:"…", licence:"…" }

   Une carte sans source ne peut pas entrer — c'est la règle 6 appliquée aux
   pixels comme aux phrases. Une carte sans licence non plus : une image qu'on
   n'a pas le droit de servir est un défaut juridique, pas un défaut d'image, et
   il ne se voit sur aucun écran.

   Tant qu'un astre n'a pas de carte, la page le DESSINE, comme aujourd'hui, et
   l'avoue. Les deux chemins cohabitent sans que l'un attende l'autre.        */
const CARTES = [];

function carteValide(c){
  return !!c && typeof c.cle === "string" && typeof c.fichier === "string"
      && typeof c.source === "string" && c.source.length > 12
      && typeof c.licence === "string" && c.licence.length > 3;
}

/* Rend la carte d'un astre, ou null. Une entrée mal formée ne passe PAS en
   silence : elle est refusée ici et signalée par l'outil. */
function carteDe(cle){
  const c = CARTES.find(x => x && x.cle === cle);
  return carteValide(c) ? c : null;
}

function etalonLune(L, distance_km){
  const d = (distance_km === undefined) ? L.D_LUNE_KM : distance_km;
  const lune = L.ASTRES.find(a => a.cle === "lune");
  return L.diametreApparent(L.rayonDe(lune), d);
}

global.RIVAGE = {
  SOURCES, JOUR_SIDERAL_S, ROCHE_FLUIDE, OEIL_M,
  P2, hauteurMaree, marnage, periodeOrbite_s, periodeMaree_s,
  limiteRoche_km, densite, verdict, horizonM, scene, crans, etalonLune, CARTES, carteDe, carteValide,
};

})(typeof window !== "undefined" ? window : globalThis);
