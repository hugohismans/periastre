/* ============================================================================
   L'APPROCHE — on arrive dans le nuage de Oort, et on TOMBE.

   Le cadrage est d'Hugo, tranché le 10 août 2026 au soir, après que le chiffrage
   eut contredit ce qu'il imaginait :

       « les deux, dans cet ordre. »

   Il voulait « une vision depuis le nuage dehors, avec des tags : ça c'est
   Jupiter, ça c'est truc ». Le calcul a répondu que ça ne se pouvait pas de
   là-bas — huit planètes dans deux pixels, et deux étiquettes y pointeraient le
   même endroit. Plutôt que de renoncer ou de tricher, il a ajouté un mouvement :
   on arrive où il n'y a rien à voir, et l'on continue à tomber jusqu'à ce qu'il
   y ait quelque chose.

   **LE PASSAGE D'UN RÉGIME À L'AUTRE EST LE SUJET DE LA SCÈNE**, pas un fondu de
   transition. C'est là que « il n'y a rien à voir » devient « ah, il y a quelque
   chose ». Ce module existe pour tenir ce passage, et pour rien d'autre.

   ---------------------------------------------------------------------------
   IL NE DESSINE RIEN, ET IL NE CONNAÎT PAS LA CAMÉRA

   Comme `etiquettes.js`, comme `solaire.js`, comme tout ce qui est sorti de la
   page : ni DOM, ni WebGL, ni `window`. Il reçoit une focale et une taille
   d'image, il rend des nombres. La page projette le Soleil avec sa caméra à elle
   et pose ce qu'on lui donne.

   ---------------------------------------------------------------------------
   D'OÙ VIENNENT LES DEUX BOUTS DE LA CHUTE

   LE DÉPART, 20 000 ua, n'est pas un chiffre rond : c'est la borne INTERNE du
   nuage de Oort externe telle que Dones, Weissman, Levison & Duncan la publient
   en 2004, et `SOURCES-SOLAIRE.md` §4 en garde l'adresse et la page. C'est aussi
   là que la fiche `f-solaire` situe le nuage. On arrive donc quelque part, pas à
   une distance choisie pour bien tomber.

   L'ARRIVÉE NE S'ÉCRIT PAS. Elle se cherche, comme la distance parlante, et par
   le critère qui EST le sujet de la scène : on tombe jusqu'à ce que la CINQUIÈME
   étiquette tienne debout. Cinq, parce que c'est le rang où Mars rejoint les
   quatre géantes — la première planète rocheuse à gagner son nom, et le moment
   où la scène cesse d'être « les grosses » pour devenir le système solaire.

   Un nombre d'unités astronomiques écrit ici serait faux au premier changement
   d'optique. On le dérive donc de la loi de nommage elle-même, sur l'optique de
   RÉFÉRENCE — celle du chiffrage du 10 août, qui a servi à trancher.

   ET C'EST UNE DÉCISION D'IMAGE AUTANT QUE DE CALCUL. Elle est posée à Hugo dans
   `?juge` : où s'arrête la chute se mesure, mais si elle s'arrête au bon endroit
   ne se mesure pas. Ce module donne un point de départ à sa réponse, pas une
   conclusion.

   ---------------------------------------------------------------------------
   LA CHUTE EST UN VOL À 1 g, ET C'EST LA MÊME LOI QUE LE GRAND TRAJET

   Pas un lissage, pas une courbe choisie. Le vaisseau accélère, retourne, freine
   — exactement ce que fait le voyage depuis Sagittarius, avec le même `VOYAGE`
   et le même rythme réglé par le visiteur. La loi est lue dans `RECUL.ou`, où
   elle a été sortie le 11 août précisément pour ça : deux copies d'une loi de
   mouvement finissent toujours par diverger, et l'œil d'Hugo l'a déjà vu une
   fois. C'est la règle 4.

   Ce qui NE passe pas par `RECUL`, en revanche, c'est l'état : `RECUL.etat`
   compte des mètres depuis Sagittarius A*, on compte ici des unités
   astronomiques depuis le Soleil. Deux sens pour une même valeur, c'est la
   maladie qui a donné le disque à 622×. Un état séparé, un seul écrivain.

   ---------------------------------------------------------------------------
   LE CONTRAT

     APPROCHE.DEPART_UA        20 000 — le nuage de Oort externe (Dones 2004)
     APPROCHE.ARRIVEE_UA       dérivée, voir plus haut
     APPROCHE.etat             { actif, dUa, t, duree, d0, d1, tauBord, tauLoin }
                               EN LECTURE SEULE dehors. Ce module en est le seul
                               écrivain, et c'est ce qui garantit qu'il n'y a
                               qu'une distance au Soleil dans tout le site.

     APPROCHE.pose(dUa)        poser la scène à une distance, sans chute
     APPROCHE.tombe(secondes)  lancer la chute vers `ARRIVEE_UA`
     APPROCHE.avance(dt)       faire avancer la chute
     APPROCHE.range()          tout éteindre

     APPROCHE.prix()           { tau, t, d_m } — ce que la chute coûte vraiment,
                               par `VOYAGE`. Le panneau l'affiche comme le prix
                               d'un vrai trajet, parce que c'en est un.
     APPROCHE.dureeEcran()     les secondes d'animation, par `RECUL.duree`

     APPROCHE.soleil(focale,vue)   { magnitude, diametrePx, dessinable,
                               grossissement, coeurPx, haloPx }
     APPROCHE.anneaux(focale,vue)  [{ nom, rayonPx }] — ceux qu'on a le droit de
                               tracer. Vide depuis assez loin, et c'est la
                               réponse juste.
     APPROCHE.points(cx,cy,focale,vue)  les points à donner à `ETIQUETTES`, le
                               Soleil compris — c'est lui qui tient le centre, et
                               c'est ce qui fait que « assez loin du Soleil »
                               n'est pas une règle de plus.
   ============================================================================ */

(function(global){
"use strict";

/* L'optique de RÉFÉRENCE — celle du chiffrage qui a servi à trancher le 10 août.
   Elle ne sert qu'à fixer les deux bouts de la chute, jamais à dessiner : ce
   qu'on peint suit l'écran qu'on a. Les deux valeurs sont celles de `camera.js`
   et de l'écran sur lequel `A-REGARDER.md` a chiffré la scène. */
const FOCALE_REF = 1.55, H_REF = 1080;

/* Le nuage de Oort externe commence à 20 000 ua — Dones, Weissman, Levison &
   Duncan 2004, p. 376, relevé dans `SOURCES-SOLAIRE.md` §4. C'est le même
   chiffre que porte la fiche `f-solaire`. */
const DEPART_UA = 20000;

/* Combien de noms il faut pour qu'il y ait une scène. Voir l'en-tête : cinq est
   le rang de Mars, la première rocheuse. Le nombre est ici, à un seul endroit,
   pour qu'on puisse le changer en le voyant plutôt qu'en fouillant. */
const NOMS_VOULUS = 5;

/* Vingt-deux secondes est la référence du site pour un trajet, et `RECUL.duree`
   l'étire en racine du nombre de décades. La chute en franchit 2,2 : elle dure
   donc moins que le grand voyage, et c'est juste — elle est plus courte. */
const BASE_S = 22;

function S(){ return global.SOLAIRE; }

/* L'arrivée, cherchée et non écrite. Calculée à la demande plutôt qu'au
   chargement : le module ne peut pas supposer que `solaire.js` est déjà là, et
   un `NaN` figé au chargement serait indétectable ensuite. */
let arriveeCache = null;
function arriveeUa(){
  if(arriveeCache !== null) return arriveeCache;
  const s = S();
  if(!s) return NaN;
  arriveeCache = s.distanceParlante(FOCALE_REF, H_REF, s.ECART_MIN, NOMS_VOULUS);
  return arriveeCache;
}

/* ---------------------------------------------------------------------- l'état
   Un objet, pas des variables : une variable réassignée ne se partage pas entre
   deux fichiers, et le dépôt a déjà payé cette leçon avec `nChute`. */
const etat = {
  actif: false,        // la scène est-elle allumée
  chute: false,        // et est-on en train de tomber
  dUa: DEPART_UA,      // où l'on est, en unités astronomiques du Soleil
  t: 0, duree: 0,      // avancement de 0 à 1, et durée d'écran en secondes
  d0: DEPART_UA, d1: DEPART_UA,
  tauBord: 0, tauLoin: 0,   // ce que la chute coûte, en secondes
};

function pose(dUa){
  etat.actif = true;
  etat.chute = false;
  etat.dUa = Number.isFinite(dUa) && dUa > 0 ? dUa : DEPART_UA;
  etat.d0 = etat.d1 = etat.dUa;
  etat.t = 0; etat.duree = 0;
  etat.tauBord = 0; etat.tauLoin = 0;
}

function range(){
  etat.actif = false; etat.chute = false;
  etat.dUa = DEPART_UA;
  etat.d0 = etat.d1 = DEPART_UA;
  etat.t = 0; etat.duree = 0;
  etat.tauBord = 0; etat.tauLoin = 0;
}

/* En mètres, pour parler à `VOYAGE` et à `RECUL`, qui ne connaissent que ça. */
function enMetres(dUa){ return dUa * (S() ? S().UA : NaN); }

/* Ce que la chute coûte VRAIMENT. Pas une estimation : le même `VOYAGE.entre`
   que les destinations du télescope, sur la même accélération d'un g. Le panneau
   l'affiche comme un prix, parce que c'en est un — un an de vol pour tomber du
   nuage jusqu'aux géantes. */
function prix(){
  const V = global.VOYAGE;
  const a = arriveeUa();
  if(!V || !Number.isFinite(a)) return null;
  return V.entre(enMetres(DEPART_UA), enMetres(a));
}

function dureeEcran(){
  const R = global.RECUL, a = arriveeUa();
  if(!R || !Number.isFinite(a)) return BASE_S;
  return R.duree(enMetres(DEPART_UA), enMetres(a), BASE_S);
}

function tombe(secondesEcran){
  const a = arriveeUa();
  if(!Number.isFinite(a)) return null;
  const v = prix();
  etat.actif = true;
  etat.chute = true;
  etat.d0 = etat.dUa;
  etat.d1 = a;
  etat.t = 0;
  etat.duree = secondesEcran > 0 ? secondesEcran : dureeEcran();
  etat.tauBord = v ? v.tau : 0;
  etat.tauLoin = v ? v.t : 0;
  return v;
}

/* La position vient de `RECUL.ou`, la loi du trajet à 1 g, et de nulle part
   ailleurs. On lui donne des MÈTRES parce que c'est ce qu'elle compte, et l'on
   revient en unités astronomiques ici : la conversion est une seule
   multiplication, écrite une fois, dans les deux sens. */
function avance(dt){
  if(!etat.actif || !etat.chute) return;
  if(!(etat.duree > 0)){ etat.dUa = etat.d1; etat.chute = false; return; }
  etat.t = Math.min(1, etat.t + dt/etat.duree);
  const R = global.RECUL;
  if(R && R.ou){
    const p = R.ou(enMetres(etat.d0), enMetres(etat.d1), etat.t);
    const u = S() ? p.distance / S().UA : etat.d1;
    etat.dUa = Number.isFinite(u) && u > 0 ? u : etat.d1;
  } else {
    etat.dUa = etat.d1;
  }
  if(etat.t >= 1){ etat.chute = false; etat.dUa = etat.d1; }
}

/* ---------------------------------------------------------------- ce qu'on voit

   L'ÉCLAT DU SOLEIL À L'ÉCRAN — ET C'EST LE SEUL COMPROMIS DE CETTE SCÈNE.

   Tout le reste est calculé : les rayons des anneaux sont des élongations, le
   droit de nommer est une règle de typographie, la chute est un vol à 1 g. Ici,
   non — et il faut le dire.

   Le flux reçu du Soleil est multiplié par vingt-sept mille entre le départ de
   la chute et son arrivée. Aucun écran ne tient un tel rapport ; le pousser tel
   quel donnerait un point noir puis un écran blanc. On peint donc l'éclat sur
   l'échelle des MAGNITUDES, qui est logarithmique — ce n'est pas un artifice
   choisi pour la commodité, c'est l'échelle que Pogson a bâtie sur la réponse de
   l'œil, et c'est celle dans laquelle toute l'astronomie parle d'éclat.

   Deux ancres, et elles sont nommées :

     · MAGNITUDE ZÉRO DU HALO : la magnitude 6, la limite de l'œil nu. Un astre
       qu'on distingue à peine n'a pas de halo, et c'est exact — le halo d'une
       étoile sur une photographie est un débordement, il n'existe que pour ce
       qui est très brillant.

     · L'ÉCHELLE, en pixels par magnitude. Elle, est un réglage d'image, et c'est
       tout ce qu'il y a de déclaré ici.

   LE CŒUR NE CHANGE JAMAIS DE TAILLE, et il fait un pixel. C'est la leçon
   d'`outil-verif-ciel.js` : un cœur d'un quart de pixel apparaît et disparaît
   dès que la caméra bouge — « ça grouille », trois séances de suite. Un pixel
   plein, toujours le même. Ce cœur n'est PAS le disque du Soleil, qui mesure
   neuf millièmes de pixel à mille unités astronomiques et qu'on ne dessine
   jamais : c'est la marque d'une source ponctuelle, et `soleil()` rend les deux
   séparément pour que la page ne puisse pas les confondre. */
const MAG_OEIL_NU = 6;        // la limite de l'œil nu — le halo y vaut zéro
const PX_PAR_MAG = 0.9;       // px par magnitude — le réglage d'image, déclaré
const COEUR_PX = 1;           // toujours. Sous le pixel, ça scintille.

function soleil(focale, vue){
  const s = S();
  if(!s || !vue) return null;
  const v = s.soleilVu(etat.dUa, focale, vue.H);
  const halo = Number.isFinite(v.magnitude)
             ? Math.max(0, (MAG_OEIL_NU - v.magnitude) * PX_PAR_MAG) : 0;
  return { magnitude: v.magnitude, diametrePx: v.diametrePx,
           dessinable: v.dessinable, grossissement: v.grossissement,
           coeurPx: COEUR_PX, haloPx: halo };
}

function anneaux(focale, vue){
  const s = S();
  return (s && vue) ? s.anneaux(etat.dUa, focale, vue.H) : [];
}

/* Les points que `ETIQUETTES` recevra. Le Soleil D'ABORD, et au rang zéro : il
   tient le centre, donc il gagne toujours la place, et toutes les autres se
   mesurent à lui. C'est ce qui fait que « assez loin du Soleil » n'a pas besoin
   d'être une seconde règle — voir l'en-tête d'`etiquettes.js`.

   ELLES S'EMPILENT VERS LE HAUT, ET CE N'EST PAS UN CHOIX DE GOÛT. Le seuil de
   douze pixels se dérive de la HAUTEUR d'une ligne de onze — c'est écrit dans
   `solaire.js`. Deux étiquettes rangées côte à côte à douze pixels l'une de
   l'autre se chevaucheraient donc quand même : « Neptune » en fait quarante-six
   de large. Empilées, le seuil dit exactement ce qu'il croit dire.

   Chacune est posée SUR son anneau, au sommet. Ce n'est pas une position : on ne
   sait pas où est Jupiter sur son orbite, et l'anneau est un bord, pas un point.
   L'aveu de l'arrivée le dit au visiteur. */
function points(cx, cy, focale, vue){
  const s = S();
  if(!s || !vue) return [];
  const pts = [{ cle: "soleil", ecran: [cx, cy], rang: 0 }];
  s.ORDRE.forEach((nom, i) => {
    pts.push({ cle: nom, ecran: [cx, cy - s.enPixels(nom, etat.dUa, focale, vue.H)],
               rang: i + 1 });
  });
  return pts;
}

/* ============================================================================
   LE DESSIN — il reçoit un contexte, comme `RECUL.dessineQuadrillage`

   Même arrangement que le quadrillage et la carte des étoiles : le contexte
   ARRIVE, il n'est pas allé se chercher. Le module ne touche donc toujours ni au
   document ni à WebGL, et un contrôle peut lui tendre un faux contexte et
   compter ce qu'il a tracé — c'est ce que fait `outil-verif-approche.js`.

   `cx, cy` sont la position du Soleil À L'ÉCRAN, projetée par la page avec sa
   caméra. Le module ne projette rien : la caméra appartient à la page, et deux
   projections pour un même espace se paieraient comme toujours.

   `mots` porte les noms déjà traduits. Un module ne résout pas de clé — même
   règle que `RECUL.poseMots`, posée le jour où le quadrillage écrivait « une
   case = 1 000 UA » en français à un visiteur anglais.

   IL NE VOLE PAS L'ALPHA DE L'APPELANT. `etoiles.js` écrase `globalAlpha` dès sa
   première étoile, et l'appelant qui croyait piloter un fondu se retrouve à
   peindre en opaque. Tout se multiplie donc par `alpha`, et le `save`/`restore`
   rend le contexte exactement comme il l'a reçu.
   ============================================================================ */

/* Le voile. Plus léger que celui de la carte des étoiles (0,62) : là-bas il faut
   que des orbites blanches se lisent, ici il faut au contraire que le VIDE se
   voie. Le champ d'étoiles reste présent dessous — c'est lui qui dit qu'on est
   quelque part, et l'effacer ferait de la scène un fond noir de plus. */
const VOILE = 0.45;

/* LA SCÈNE REFUSE DE SE PEINDRE QUAND ELLE N'EST PAS OUVERTE — 14 août 2026.

   DÉFAUT TROUVÉ À L'ŒIL, et il n'a pu être vu que le jour où le vaisseau a eu
   une vitre AVANT. La page appelle ce dessin dès que la destination est le
   système solaire, c'est-à-dire pendant TOUT le trajet ; et `S()` rend le
   module `SOLAIRE`, qui est toujours chargé, donc le garde d'entrée ne gardait
   rien. On peignait le nuage de Oort — son voile, ses anneaux, le Soleil et son
   nom — pendant les vingt-sept mille années-lumière du voyage.

   Personne ne l'avait vu, et pour une raison précise : le calque était découpé
   à la seule baie, qui regarde l'ASTRE, donc en arrière ; la scène, elle, se
   pose DEVANT. Elle était peinte et jetée à chaque image. La première vitre
   avant l'a montrée d'un coup — « Soleil » lu par la fenêtre, à côté d'une
   coquille de 1,3 al, alors que le Soleil est à vingt-sept mille.

   Le garde est ICI et pas seulement chez l'appelant : un module qui accepte de
   peindre une scène fermée rendra la même faute au prochain qui l'appellera. */
function dessine(ctx, cx, cy, focale, vue, alpha, mots){
  if(!ctx || !vue || !(alpha > 0.005)) return 0;
  if(!etat.actif) return 0;
  const s = S(), ET = global.ETIQUETTES;
  if(!s) return 0;
  let traces = 0;
  const noms = mots || {};

  ctx.save();

  ctx.globalAlpha = alpha * VOILE;
  ctx.fillStyle = "#05050a";
  // Il déborde largement, pour la raison qu'`etoiles.js` a payée : la page pose
  // ce dessin là où le Soleil se trouve vraiment, pas au milieu de l'image, et
  // un voile à la taille du cadre laisserait un bord clair du côté opposé.
  ctx.fillRect(cx - 2*vue.W, cy - 2*vue.H, 4*vue.W, 4*vue.H);

  /* LES ANNEAUX — des bornes, pas des orbites dessinées. Voir `solaire.anneaux`.
     Le même bleu que le quadrillage du recul : c'est le repère de la maison, et
     lui en donner un autre laisserait croire à un objet d'une autre nature. */
  ctx.strokeStyle = "#8fb6ff";
  ctx.lineWidth = 1;
  for(const a of anneaux(focale, vue)){
    ctx.globalAlpha = alpha * 0.30;
    ctx.beginPath();
    ctx.arc(cx, cy, a.rayonPx, 0, 6.2832);
    ctx.stroke();
    traces++;
  }

  /* LE SOLEIL. Pas de disque : son diamètre est sous le demi-pixel partout dans
     cette scène, et un disque dirait une taille. Un halo qui suit la magnitude,
     et un cœur d'un pixel plein qui ne bouge jamais. */
  const so = soleil(focale, vue);
  if(so && so.haloPx > 0){
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, so.haloPx);
    halo.addColorStop(0, "rgba(255,246,224,0.95)");
    halo.addColorStop(0.35, "rgba(255,226,170,0.30)");
    halo.addColorStop(1, "rgba(255,214,150,0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(cx, cy, so.haloPx, 0, 6.2832); ctx.fill();
    traces++;
  }
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#fffaf0";
  ctx.beginPath(); ctx.arc(cx, cy, COEUR_PX, 0, 6.2832); ctx.fill();
  traces++;

  /* LES ÉTIQUETTES. Le module d'étiquettes décide QUI parle ; ici on ne fait que
     peindre ce qu'il a autorisé. Une liste vide est une réponse, et c'est la
     bonne réponse depuis le nuage de Oort — il ne faut donc surtout pas de repli
     « au moins une », qui serait la reconstitution exacte du mensonge. */
  if(ET){
    ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textBaseline = "middle";
    for(const p of ET.placements(points(cx, cy, focale, vue), vue,
                                 { ecartMin: s.ECART_MIN, marge: 14, decalage: 7 })){
      const mot = noms[p.cle];
      if(!mot) continue;                 // pas de clé nue à l'écran, jamais
      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = "#cfe0ff";
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillStyle = "#e6efff";
      ctx.textAlign = p.ancre === "droite" ? "left" : "right";
      ctx.fillText(mot, p.x + (p.ancre === "droite" ? 2 : -2), p.y);
      traces++;
    }
  }

  ctx.restore();
  return traces;
}

global.APPROCHE = {
  DEPART_UA, NOMS_VOULUS, FOCALE_REF, H_REF, BASE_S, VOILE,
  MAG_OEIL_NU, PX_PAR_MAG, COEUR_PX,
  etat, pose, tombe, avance, range, prix, dureeEcran,
  soleil, anneaux, points, dessine,
  get ARRIVEE_UA(){ return arriveeUa(); },
};

})(typeof window !== "undefined" ? window : globalThis);
