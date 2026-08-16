/* ============================================================================
   L'ARRIVÉE — la Terre et la Lune, vues du vaisseau.

   Le voyage vers le système solaire s'arrêtait sur un panneau. Le texte disait
   « nous y sommes », la baie ne montrait rien, et Hugo l'a dit le 11 août 2026 :
   « tu m'en parles, tu m'en parles, mais toujours pas vu ». Ce module est la
   réponse : à l'arrivée, on tombe vers le couple Terre–Lune et on le regarde.

   ---------------------------------------------------------------------------
   AUCUN CHIFFRE N'EST ÉCRIT ICI

   Pas un rayon, pas une masse, pas une distance. Tout vient de `lune.js`, qui
   les porte avec leurs clés de sources depuis le 5 août — les rayons moyens du
   JPL, le demi-grand axe lunaire du JPL, la formule en arcsin plutôt qu'en
   arctan. Ce fichier ne fait qu'appliquer une géométrie à des nombres qu'il ne
   possède pas. C'est voulu : deux tables décrivant les mêmes astres feraient
   deux lois pour un seul espace, et le dépôt a déjà payé ça.

   ---------------------------------------------------------------------------
   OÙ ÇA VIT — LA DÉCISION, ÉCRITE

   `lune.js` est en canvas 2D, avec sa propre boucle, et il ne se compose pas
   avec le pipeline WebGL de la page. La question posée était : canevas séparé,
   ou ailleurs ?

   RÉPONSE : ni l'un ni l'autre — la scène se peint sur le **calque 2D que la
   page tient déjà**, celui d'`ETOILES_S`, dans `dessineVoyage`, et elle passe
   par `decoupeBaie()`. Trois raisons, et la troisième est un défaut déjà payé :

     1. un canevas séparé ne pourrait pas être découpé à la forme de la baie ;
        la scène flotterait devant la vitre au lieu d'être dehors ;
     2. le calque existe, il est déjà à la bonne taille, et `ETOILES_S` a prouvé
        le patron ;
     3. surtout, la scène doit rester ACCROCHÉE AU MONDE. Verdict d'Hugo du
        9 août : « le trou noir est toujours au centre du regard du joueur, pas
        au centre de la vitre. » Une scène centrée sur W/2, H/2 tournerait avec
        la tête. Celle-ci reçoit une direction du monde, gelée à l'arrivée, et
        `projette` la place — on tourne la tête, elle sort du champ.

   Le module ne touche donc ni au DOM ni à WebGL. Il reçoit un contexte 2D, une
   taille, une position à l'écran et une échelle en pixels par radian. C'est ce
   qui le rend éprouvable sans navigateur, comme les autres.

   ---------------------------------------------------------------------------
   LA GÉOMÉTRIE, ET CE QU'ELLE SUPPOSE

   L'observateur est à une distance d du CENTRE de la Terre, et il regarde
   perpendiculairement à la ligne Terre–Lune. C'est un point de vue, pas une
   loi : il est déclaré, et tout ce qui en découle est exact.

       demi-angle de la Terre     arcsin(R⊕ / d)
       distance de la Lune        √(d² + a²)          a = 384 400 km
       demi-angle de la Lune      arcsin(R☾ / √(d²+a²))
       écart angulaire des deux   arctan(a / d)

   Le demi-angle est un arcsin et non un arctan : la silhouette d'une sphère est
   bornée par les tangentes issues de l'œil. `lune.js` porte la démonstration et
   `outil-verif-lune.js` chiffre l'écart ; on se contente ici d'appeler sa
   fonction, pour qu'il n'y ait qu'une formule dans le dépôt.

   ---------------------------------------------------------------------------
   LES PIXELS VIENNENT DE L'OPTIQUE DU SITE, PAS D'UN RÉGLAGE

   `CAMERA.projette` pose px = (x/z · F · H + W)/2. Un point à l'angle α de
   l'axe a x/z = tan α, donc son décalage vaut tan(α) · F·H/2 pixels. L'échelle
   est donc **F·H/2 pixels par radian**, exactement, et elle sort de la même
   focale que le nuanceur et que la vue libre. Rien n'est réglé ici : si la
   focale change, la Terre change de taille avec le reste du monde.

   ---------------------------------------------------------------------------
   LES DEUX BOUTS DE LA CHUTE SE CALCULENT, ILS NE S'ÉCRIVENT PAS

   D'où l'on part : de la distance où le disque de la Terre mesure EXACTEMENT
   un demi-pixel. C'est le seuil de `lune.js` — sous le demi-pixel on ne dessine
   rien — et le prendre comme départ fait commencer la scène à l'instant précis
   où la Terre a le droit d'exister à l'écran. C'est « il n'y a rien à voir »
   qui devient « ah, il y a quelque chose », et le seuil n'est pas un goût.

   Où l'on s'arrête : à la distance où le disque de la Terre occupe une fraction
   déclarée de la HAUTEUR de la baie. Elle se déduit de la seule focale —
   tan α = part / F — donc elle ne dépend pas de la taille de la fenêtre, ce qui
   est juste : une taille apparente se compare à un champ, pas à un compte de
   pixels.

   ET ON NE S'ARRÊTE PAS QUAND LA LUNE EST ENCORE LÀ, ON CONTINUE. C'est le
   fait que la scène est venue dire, et il a failli m'échapper deux fois : au
   dernier instant où la Lune tient dans la baie, la Terre ne fait que dix-huit
   pixels. Le système Terre–Lune est presque entièrement du vide — trente
   diamètres terrestres d'écart, quand la baie n'en montre que cinquante-six
   degrés — et AUCUNE image ne peut montrer les deux astres gros à la fois.

   La chute traverse donc ce moment, où l'on voit les deux et le gouffre entre
   eux, puis continue : la Lune sort du cadre par le côté et la Terre grandit
   jusqu'à remplir la baie. La légende ne se tait pas quand la Lune s'en va —
   elle dit à quel angle elle est passée.

   `distanceSortieLune` calcule ce moment de passage à partir du champ réel de
   la fenêtre. Il n'est écrit nulle part, il se relit à chaque ouverture.

   Entre les deux bouts, d décroît à TAUX RELATIF CONSTANT — d(u) = d₀·(d₁/d₀)^u.
   C'est la loi de `recul.js` et celle du champ de `lune.js` : l'œil lit des
   rapports, pas des différences. Une quatrième loi de distance dans ce dépôt
   serait exactement la faute que la règle 4 interdit.

   ---------------------------------------------------------------------------
   CE QUI EST DESSINÉ ET NE MESURE RIEN

   Les continents, les mers lunaires, les nuances : `lune.js` les déclare déjà
   comme une évocation, et ce module n'en ajoute pas. Deux choses lui
   appartiennent en propre et se déclarent à l'écran :

     — L'HEURE DE LA SCÈNE. La direction du Soleil est un choix de mise en
       scène. Mais elle est UNIQUE : les deux astres reçoivent la même, et c'est
       physique — à 384 400 km l'un de l'autre et à 1 ua du Soleil, leurs deux
       directions d'éclairement diffèrent de 0,15°. Le terminateur, lui, est
       calculé : la frontière jour/nuit d'une sphère éclairée à ψ de la ligne de
       visée se projette en une ellipse de demi-axe r·|cos ψ|, et la fraction
       éclairée vaut (1 + cos ψ)/2. Un croissant faux se voit ; celui-ci sort de
       la formule.

     — L'AZIMUT DE LA LUNE À L'ÉCRAN. Sa distance angulaire à la Terre est
       calculée ; le côté où on la pose ne l'est pas. Déclaré.

   La direction du Soleil n'est pas choisie ici non plus : elle est prise sur le
   reflet de `limbe`, dans `lune.js`, pour que l'ombre du terminateur et le
   modelé du globe ne se contredisent pas. Deux éclairages sur un même astre,
   c'est la soupe de drapeaux sous un autre nom.
   ============================================================================ */

(function(global){
"use strict";

/* La seule dépendance, et elle est assumée : sans `lune.js` il n'y a ni rayons,
   ni masses, ni formule d'angle apparent — et en fabriquer ici serait le
   doublon que ce module existe pour éviter. */
const L = global.LUNE;

/* ------------------------------------------------------------- les réglages
   Ce ne sont pas des mesures. Chacun est un choix de mise en scène, et chacun
   est déclaré à l'écran ou dans le commentaire qui le porte. */

const PART_TERRE  = 0.50;  // part de la HAUTEUR de la baie que la Terre occupe au bout
const DUREE       = 9.0;   // secondes de chute — le rythme se juge à l'œil
const PSI        = 50 * Math.PI/180;  // angle Soleil / ligne de visée : gibbeuse à 82 %
/* Le côté où l'on pose la Lune à l'écran, en radians. Sa distance angulaire à
   la Terre est calculée ; ce côté-là ne l'est pas, et il est déclaré.

   IL POINTE VERS LE COIN, et ce n'est pas un goût : c'est le point le plus
   éloigné du centre dans une baie large et basse, donc celui qui garde la Lune
   à l'écran le plus longtemps. Pour une demi-largeur L et une demi-hauteur H,
   la portée vaut min(L/|cos a|, H/|sin a|) et elle est maximale quand les deux
   bornes se rejoignent — tan a = H/L, et la portée vaut alors √(L² + H²).

   J'ai cru le contraire une heure durant. En regardant la scène, la Lune
   semblait sortir par le haut, et j'ai couché l'azimut à plat « pour employer
   la largeur ». C'était faux, et c'est le contrôle qui l'a dit en chiffrant les
   deux : à plat elle sort à 766 000 km, en diagonale à 727 000. La règle 3 dans
   les deux sens — un contrôle qui tire sa vérité d'ailleurs corrige aussi celui
   qui l'écrit. */
const AZIMUT     = -0.35;
const NUIT       = 0.05;   // ce qu'il reste du modelé sur la face non éclairée
const DEMI_PIXEL = 0.5;    // le seuil de `lune.js` : sous ça, on ne dessine rien

/* La direction de l'éclairage vient de `lune.js` — un seul écrivain. Si elle
   manque (module absent), on ne bricole pas : le module refusera de s'ouvrir. */
function directionSoleilEcran(){
  const e = L && L.ECLAIRAGE;
  return e ? Math.atan2(e.dy, e.dx) : 0;
}

/* ==================================================== 1. CE QUI SE CALCULE */

/** Les deux astres, pris dans la table de `lune.js`. On ne les copie pas. */
function corps(cle){ return L.ASTRES.find(a => a.cle === cle); }

/** Demi-angle apparent d'un astre, en radians, vu de `d_km` de son centre.
 *  Passe par `LUNE.diametreApparent` — arcsin, et une seule formule au dépôt.
 *  Rend NaN quand on est dedans, comme elle. */
function demiAngle(a, d_km){
  return L.diametreApparent(L.rayonDe(a), d_km) * Math.PI/180 / 2;
}

/** La scène, à une distance donnée. Tout est en radians, et rien n'est dessiné.
 *
 *  `d_km` est la distance au CENTRE de la Terre. La ligne de visée est
 *  perpendiculaire à la ligne Terre–Lune : c'est le point de vue déclaré, et
 *  c'est lui qui donne à la Lune une distance plus grande que la Terre.       */
function scene(d_km){
  const T = corps("terre"), M = corps("lune");
  const a = L.D_LUNE_KM;
  const dM = Math.hypot(d_km, a);
  return {
    d: d_km,
    terre: { astre: T, alpha: demiAngle(T, d_km), d: d_km },
    lune:  { astre: M, alpha: demiAngle(M, dM),  d: dM },
    // l'écart angulaire des deux centres, vu d'ici
    ecart: Math.atan2(a, d_km),
  };
}

/** Pixels par radian, tirés de l'optique du site : px = tan(α) · F·H/2. */
function echelle(focale, H){ return focale * H / 2; }

/** Le décalage en pixels d'un point vu à l'angle `alpha` de l'axe. C'est la
 *  projection exacte, tangente comprise — pas l'approximation aux petits
 *  angles, qui se verrait quand le couple remplit la baie. */
function pixels(alpha, k){ return Math.tan(alpha) * k; }

/** La distance d'où le disque de la Terre mesure exactement un demi-pixel.
 *  C'est le seuil de `lune.js`, et c'est de là que part la chute. */
function distanceDemiPixel(k){
  const T = corps("terre");
  // diamètre = 2·tan(α)·k = DEMI_PIXEL  →  α = atan(DEMI_PIXEL / (2k))
  const alpha = Math.atan(DEMI_PIXEL / (2*k));
  return L.rayonDe(T) / Math.sin(alpha);
}

/** À quelle distance du CENTRE DE L'ÉCRAN, en pixels, tombe le bord extérieur
 *  de la Lune.
 *
 *  Comptée depuis le centre de la Terre, parce que c'est là que la scène est
 *  ancrée. La première version comptait d'un limbe à l'autre — l'étendue du
 *  couple — ce qui suppose le couple centré dans la fenêtre. Il ne l'est pas :
 *  la Terre est au point de visée. Le contrôle croyait donc la Lune dans le
 *  cadre alors qu'elle en était sortie depuis longtemps, et le « moment du
 *  couple » tombait deux fois trop près. Trouvé en chiffrant la scène plutôt
 *  qu'en la regardant tourner. */
function ecartLunePx(d_km, k){
  const s = scene(d_km);
  if(!isFinite(s.terre.alpha)) return Infinity;   // on est dans la Terre
  return pixels(s.ecart + s.lune.alpha, k);
}

/** La distance où le disque de la Terre occupe `part` de la hauteur de la baie.
 *
 *  Elle ne dépend QUE de la focale, et c'est le bon comportement : une taille
 *  apparente se compare à un champ, pas à un compte de pixels. Le diamètre en
 *  pixels vaut 2·tan(α)·F·H/2 et la cible `part·H` ; H se simplifie et il
 *  reste tan α = part / F. Tourner le téléphone ne change donc pas la scène. */
function distanceTerreCadree(focale, part){
  const p = (part === undefined ? PART_TERRE : part);
  const alpha = Math.atan(p / focale);
  return L.rayonDe(corps("terre")) / Math.sin(alpha);
}

/** La distance à laquelle la Lune quitte le cadre — son bord atteint le bord
 *  de la fenêtre, à `W/2` du point de visée.
 *
 *  Ce n'est PAS là qu'on s'arrête : c'est le dernier moment où l'on voit les
 *  deux, et la chute le traverse. C'est aussi le moment le plus parlant de la
 *  scène, celui où la Terre est encore une bille et la Lune un point à l'autre
 *  bout de la baie.
 *
 *  Par bissection, parce que l'écart n'est pas inversible à la main et qu'une
 *  formule approchée serait un chiffre de plus à croire. L'écart en pixels
 *  décroît strictement avec d : la bissection converge. */
function distanceSortieLune(k, W){
  const cible = W/2;
  let bas = L.rayonDe(corps("terre")) * 1.0001, haut = 1e14;
  for(let i = 0; i < 200; i++){
    const m = Math.sqrt(bas*haut);          // bissection en logarithme
    if(ecartLunePx(m, k) > cible) bas = m; else haut = m;
  }
  return Math.sqrt(bas*haut);
}

/** La loi de chute : taux relatif constant, celle de `recul.js`. */
function distanceA(u, d0, d1){
  const t = Math.min(1, Math.max(0, u));
  return d0 * Math.pow(d1/d0, t);
}

/** La fraction éclairée d'un disque, pour un Soleil à ψ de la ligne de visée.
 *  (1 + cos ψ)/2 — pleine à ψ=0, moitié à ψ=90°, nulle à ψ=180°. */
function fractionEclairee(psi){ return (1 + Math.cos(psi)) / 2; }

/** Le contour de la part éclairée d'un disque de rayon r, dans un repère où
 *  l'axe +x pointe vers le Soleil à l'écran. Rendu comme une liste de points,
 *  parce qu'un chemin construit point par point ne peut pas se tromper de sens
 *  de rotation — et que la faute d'un croissant à l'envers est invisible au
 *  relecteur et hurlante à l'œil.
 *
 *  Le limbe éclairé va de −π/2 à +π/2 ; le terminateur revient par
 *  (−cos ψ · r · cos t, r · sin t). Pour ψ < 90° il bombe du côté opposé au
 *  Soleil — gibbeuse ; au-delà il repasse du côté du Soleil — croissant. La
 *  même expression donne les deux, sans condition. */
function contourEclaire(r, psi, n){
  const N = n || 48, k = Math.cos(psi), p = [];
  for(let i = 0; i <= N; i++){
    const t = -Math.PI/2 + i*Math.PI/N;
    p.push([r*Math.cos(t), r*Math.sin(t)]);
  }
  for(let i = 0; i <= N; i++){
    const t = Math.PI/2 - i*Math.PI/N;
    p.push([-k*r*Math.cos(t), r*Math.sin(t)]);
  }
  return p;
}

/* ========================================================= 2. LE DÉROULÉ */

/* Un seul état, écrit à un seul endroit. La maladie du disque à 622× venait de
   deux écrivains pour une valeur ; on ne la refait pas ici. */
const etat = {
  actif: false,
  t: 0,               // secondes depuis l'ouverture
  d0: 0, d1: 0,       // les deux bouts, calculés à l'ouverture
  dSortie: 0,         // le moment de passage : le dernier où l'on voit les deux
  duree: DUREE,
};

/** Où la scène se tient — ET C'EST DANS LE REPÈRE DE LA PIÈCE, pas du monde.
 *
 *  Trois essais, trois défauts, aucun visible autrement qu'à l'écran. Ils sont
 *  écrits parce que la prochaine main refera le premier.
 *
 *  1. UN POINT DU MONDE, À L'OPPOSÉ DU TROU NOIR — l'avant du voyage. C'était
 *     géométriquement juste et bon à jeter : la baie ne regarde que dans un
 *     sens, et `projette` rendait `null`. La scène était dans le dos du joueur.
 *
 *  2. LE MÊME POINT, RETOURNÉ, à distance écrite. Le voyage porte le vaisseau
 *     de seize rayons à 1,7 × 10¹⁰ : une ancre à 10⁶ s'est retrouvée près du
 *     centre plutôt que loin devant.
 *
 *  3. LA DIRECTION DU TROU NOIR, RECALCULÉE À CHAQUE IMAGE. Toujours faux, et
 *     c'est le plus instructif : le vaisseau se DÉPLACE pendant le recul, mais
 *     il ne se RETOURNE pas. La direction de l'astre balaie donc la baie —
 *     mesuré à l'écran, 576 px, puis 614, puis 1 005, hors de la fenêtre. Le
 *     recentrage de `recul.js` masque ça pendant le trajet ; à l'arrêt, non.
 *
 *  LA BONNE ANCRE EST LA BAIE ELLE-MÊME. On prend le centre des vitres, dans le
 *  repère de la pièce, et on le pousse droit devant — la baie regarde vers les
 *  z négatifs, comme `salon.versAstre` le dit depuis le premier jour. C'est fixe
 *  dans le vaisseau, donc ça ne dérive jamais ; et ça sort du champ dès qu'on
 *  tourne la tête, puisque la tête est dans la caméra et non dans la pièce.
 *  C'est exactement ce qu'Hugo avait demandé le 9 août, obtenu par le repère
 *  plutôt que par un calcul.
 *
 *  `LOIN` est en unités de la pièce. Il n'a pas d'échelle à suivre ici : la
 *  pièce ne grandit pas. */
const LOIN = 4000;
function ou(vitres){
  if(!vitres || !vitres.length) return null;
  let y = 0, z = 0;
  for(const v of vitres){ y += (v.y0 + v.y1)/2; z += v.z; }
  y /= vitres.length; z /= vitres.length;
  // droit devant, par la baie : le sens de `salon.versAstre`, les z négatifs
  return [0, y, z - LOIN];
}

/** Ouvre la scène.
 *
 *  `k` est l'échelle en pixels par radian, `W` la largeur de la vue, `focale`
 *  celle de la caméra du site. La scène n'a pas de direction à retenir : elle
 *  la relit à chaque image, dans `peint`.
 *
 *  Rend false et ne s'ouvre pas si `lune.js` manque : une scène qui invente ses
 *  propres rayons serait pire qu'une baie vide. */
function ouvre(k, W, focale){
  if(!L || !L.ASTRES || !L.ECLAIRAGE) return false;
  if(!(k > 0) || !(W > 0) || !(focale > 0)) return false;
  etat.d1 = distanceTerreCadree(focale);
  etat.d0 = distanceDemiPixel(k);
  etat.dSortie = distanceSortieLune(k, W);
  // Une fenêtre minuscule pourrait mettre le demi-pixel plus près que le but :
  // il n'y aurait alors pas de chute à jouer, on se pose au but.
  if(!(etat.d0 > etat.d1)) etat.d0 = etat.d1;
  etat.t = 0;
  etat.actif = true;
  return true;
}

function ferme(){ etat.actif = false; etat.t = 0; }

function avance(dt){
  if(!etat.actif) return;
  etat.t = Math.min(etat.duree, etat.t + Math.max(0, Math.min(dt, 0.1)));
}

/** Où en est la chute, entre 0 et 1. */
function avancement(){ return etat.duree > 0 ? etat.t / etat.duree : 1; }

/** La distance courante, en km. */
function distance(){ return distanceA(avancement(), etat.d0, etat.d1); }

/* ============================================================ 3. LES MOTS

   Aucun texte n'est écrit dans ce fichier. La page les pose, dans sa langue,
   comme elle le fait déjà pour le quadrillage de `recul.js`. Une clé absente
   ne s'invente pas : elle ne s'affiche pas. */
const mots = {};
function poseMots(m){ Object.assign(mots, m || {}); }
function mot(cle){ return mots[cle]; }

/* ============================================== 3 bis. LES PHOTOGRAPHIES

   Hugo, en jugeant l'arrivée le 16 août 2026 : « la terre et la lune utilise
   des vrai photo, ont les a dans le projet ». Il avait raison — les cartes de
   la NASA étaient dans le dépôt depuis le 11 août, sourcées et gardées, et
   cette scène dessinait encore les taches à la main de `lune.js`.

   CE FICHIER NE CHARGE RIEN ET NE FABRIQUE AUCUN CANEVAS. Il ne touche ni au
   DOM ni à une image, et c'est ce qui permet de l'éprouver sans navigateur —
   `outil-verif-terrelune.js` le charge dans un faux `window`. La page lui tend
   une fonction qui rend, pour une clé d'astre, un disque déjà projeté ou rien.
   C'est la manœuvre de `fabriqueToile` dans `ecrans.js`, et celle de `poseMots`
   juste au-dessus.

   NE RIEN POSER EST UN ÉTAT VALIDE, et c'est le repli : une photo qui n'a pas
   fini de charger, ou qui a échoué, laisse la scène retomber sur le dessin
   calculé. Elle ne laisse jamais un trou dans la baie. */
let disqueDe = null;
function poseCartes(f){ disqueDe = typeof f === "function" ? f : null; }
function carteDisponible(cle){ return !!(disqueDe && disqueDe(cle)); }

/* =============================================================== 4. LE DESSIN */

/** Le disque d'un astre, avec sa nuit calculée.
 *
 *  On peint deux fois : le globe entier au ras de l'éteint, puis le globe
 *  éclairé découpé au contour du terminateur. C'est plus simple qu'un masque,
 *  et surtout ça garde le modelé de `lune.js` des deux côtés — une face nuit
 *  peinte à plat trahirait qu'on a posé un cache. */
function disque(ctx, corpsScene, cx, cy, r, phi, psi){
  const a = corpsScene.astre;
  /* Le globe, à l'éclairement voulu — par la photographie si la page en a posé
     une, par le dessin de `lune.js` sinon. Les DEUX passes emploient le même
     peintre : mélanger une photo de nuit et un dessin de jour ferait un astre
     qui change de nature au terminateur. */
  const toile = disqueDe && disqueDe(a.cle);
  const globe = toile
    ? (eclair) => {
        ctx.drawImage(toile, cx - r, cy - r, 2*r, 2*r);
        // La nuit : on assombrit la photographie au lieu d'en peindre une
        // seconde. Le modelé reste, comme il reste du côté dessiné.
        if(eclair < 1){
          ctx.save();
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillStyle = "rgba(0,0,0," + (1 - eclair) + ")";
          ctx.fillRect(cx - r, cy - r, 2*r, 2*r);
          ctx.restore();
        }
      }
    : (eclair) => L.dessineAstre(ctx, a, cx, cy, r, eclair);

  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2*Math.PI); ctx.clip();
  globe(NUIT);

  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(phi);
  const p = contourEclaire(r, psi);
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  for(let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.closePath();
  ctx.clip();
  ctx.rotate(-phi); ctx.translate(-cx, -cy);
  globe(1);
  ctx.restore();

  ctx.restore();
}

/** Sous le demi-pixel, rien. C'est la doctrine de `lune.js`, et elle vaut ici
 *  d'autant plus que la scène commence exactement à ce seuil : la respecter,
 *  c'est ce qui fait que la Terre APPARAÎT au lieu d'être déjà là. */
function visible(r){ return 2*r >= DEMI_PIXEL; }

/**
 *  ctx  contexte 2D, déjà découpé à la baie par l'appelant
 *  W,H  la vue en pixels
 *  o    { x, y, k, alpha } — position à l'écran (de `projette`), échelle en
 *       pixels par radian, opacité.
 *
 *  Rend ce qu'il a dessiné : l'appelant n'a pas à recalculer la scène pour
 *  écrire sa légende, et un contrôle peut lire ce que le dessin a VRAIMENT
 *  fait plutôt que ce qu'il aurait dû faire.
 */
function dessine(ctx, W, H, o){
  if(!etat.actif || !o || !(o.k > 0)) return null;
  const s = scene(distance());
  const k = o.k;
  const phi = directionSoleilEcran();

  const rT = pixels(s.terre.alpha, k);
  const rL = pixels(s.lune.alpha, k);
  const e  = pixels(s.ecart, k);
  const cx = o.x, cy = o.y;
  const lx = cx + e*Math.cos(AZIMUT), ly = cy + e*Math.sin(AZIMUT);

  const vT = visible(rT), vL = visible(rL);

  ctx.save();
  ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;
  if(vL) disque(ctx, s.lune, lx, ly, rL, phi, PSI);
  if(vT) disque(ctx, s.terre, cx, cy, rT, phi, PSI);
  ctx.restore();

  return { scene: s, rT, rL, ecartPx: e, terreVue: vT, luneVue: vL,
           x: cx, y: cy, xLune: lx, yLune: ly };
}

/* ============================================ 4 bis. LES ÉTIQUETTES

   Hugo, le 16 août 2026 : « tu peux ajouter des tag, pour qu'on remarque la
   lune ». Elle est le sujet du problème : trente diamètres terrestres d'écart,
   donc au moment où l'on voit les deux, elle ne fait que quelques pixels à côté
   d'une Terre qui en fait vingt. On la rate.

   C'EST `etiquettes.js` QUI DÉCIDE QUI PARLE, et ce fichier ne fait que peindre
   ce qu'il a autorisé — le même arrangement que la scène solaire. Deux règles du
   module s'appliquent telles quelles et méritent d'être dites ici :

   · UNE LISTE VIDE EST UNE RÉPONSE. Pas de repli « au moins une » : quand la
     Terre remplit la baie, son étiquette doit disparaître d'elle-même, et
     quand la Lune est sous le pixel elle ne doit pas s'annoncer avant
     d'exister. C'est la doctrine du demi-pixel, appliquée aux mots.

   · LA LUNE PASSE D'ABORD, au rang zéro. Le module donne la place au plus petit
     rang quand deux étiquettes se marchent dessus ; c'est donc la Lune qui
     gagne. Ce n'est pas une politesse : la Terre, on ne la rate pas. Mettre la
     Terre au rang zéro rendrait l'étiquette exactement là où elle ne sert à
     rien et la retirerait là où Hugo l'a réclamée.

   L'ANCRE EST SUR LE LIMBE, pas au centre. Un astre qui grossit jusqu'à la
   moitié de la baie verrait son nom écrit au milieu de ses continents. On pose
   donc le point à 45° en haut à droite du bord, ce qui redevient le centre
   quand l'astre est petit — sans cas particulier à écrire.

   `ECART_MIN` se dérive de la typographie comme dans `solaire.js` : c'est la
   hauteur d'une ligne, et deux étiquettes plus proches se chevauchent. */
const ECART_MIN = 16;               // px — la hauteur d'une ligne de 12 px
const DECALAGE  = 10;               // px — du limbe au début du mot

function pointsEtiquettes(vu){
  const p = [];
  const surLeLimbe = (x, y, r) => [x + r*Math.SQRT1_2, y - r*Math.SQRT1_2];
  if(vu.luneVue && mot("lune"))
    p.push({ cle: "lune",  ecran: surLeLimbe(vu.xLune, vu.yLune, vu.rL), rang: 0 });
  if(vu.terreVue && mot("terre"))
    p.push({ cle: "terre", ecran: surLeLimbe(vu.x, vu.y, vu.rT), rang: 1 });
  return p;
}

function etiquettes(ctx, W, H, vu){
  const ET = global.ETIQUETTES;
  if(!ET || !vu) return 0;
  const poses = ET.placements(pointsEtiquettes(vu), { W, H },
                              { ecartMin: ECART_MIN, marge: 12, decalage: DECALAGE });
  if(!poses.length) return 0;
  let traces = 0;
  ctx.save();
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "middle";
  for(const p of poses){
    const nom = mot(p.cle);
    if(!nom) continue;                 // pas de clé nue à l'écran, jamais
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "#cfe0ff";
    ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "#e6efff";
    ctx.textAlign = p.ancre === "droite" ? "left" : "right";
    ctx.fillText(nom, p.x + (p.ancre === "droite" ? 2 : -2), p.y);
    traces++;
  }
  ctx.restore();
  return traces;
}

/** La légende. Elle se pose SUR L'ÉCRAN et non dans le monde — c'est une aide
 *  de lecture, comme le réticule de `lune.js`, et elle le dit.
 *
 *  Elle ne nomme rien qu'on ne lui ait donné : sans `poseMots`, elle ne
 *  s'affiche pas du tout plutôt que d'écrire des identifiants nus. */
function legende(ctx, W, H, vu, o){
  if(!vu || !mot("titre")) return false;
  const u = Math.max(0.72, Math.min(1.1, W/620));
  const marge = 16*u;
  const nb = (x, d) => L.nombre(x, d);
  const ang = (rad) => L.etiquetteAngle(rad * 180/Math.PI);

  /* La Lune sort du cadre en cours de chute, et c'est le sujet : on ne peut pas
     avoir les deux gros dans la même image. La légende ne se tait donc pas
     quand elle part — elle dit où elle est allée. Un cadre qui perd un astre
     sans rien dire ressemble à un astre qui n'existait pas. */
  const dansLeCadre = vu.xLune >= 0 && vu.xLune <= W && vu.yLune >= 0 && vu.yLune <= H;

  const lignes = [];
  lignes.push([1, mot("titre")]);
  if(vu.terreVue && mot("terre"))
    lignes.push([0, mot("terre") + " — " + ang(2*vu.scene.terre.alpha)
                    + "  ·  " + nb(vu.scene.d, 0) + " km"]);
  if(vu.luneVue && dansLeCadre && mot("lune"))
    lignes.push([0, mot("lune") + " — " + ang(2*vu.scene.lune.alpha)
                    + "  ·  " + ang(vu.scene.ecart) + " " + (mot("ecart") || "")]);
  else if(vu.luneVue && mot("dehors"))
    lignes.push([0, mot("dehors") + " " + ang(vu.scene.ecart)]);
  else if(mot("pasEncore"))
    lignes.push([0, mot("pasEncore")]);

  const h = 15*u;
  const y0 = H - marge - lignes.length*h;
  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(6,6,10,0.55)";
  ctx.fillRect(0, y0 - 18*u, Math.min(W, 420*u), lignes.length*h + 26*u);
  lignes.forEach(([fort, t], i) => {
    ctx.font = fort ? (14*u).toFixed(1) + "px ui-serif, Georgia, serif"
                    : (11.5*u).toFixed(1) + "px ui-monospace, monospace";
    ctx.fillStyle = fort ? "rgba(255,154,60,0.92)" : "rgba(200,196,190,0.82)";
    ctx.fillText(t, marge, y0 + i*h);
  });
  /* L'AVEU DOIT DIRE CE QU'ON MONTRE, et il a menti pendant une heure le
     16 août : la scène affichait déjà les photographies de la NASA pendant que
     la ligne du bas annonçait « reliefs évoqués ». Vu en regardant la première
     capture, et c'est exactement le genre de faute que ce dépôt refuse — un
     aveu qui parle d'un autre dessin que celui qui est à l'écran.

     Deux aveux, donc, et c'est la scène qui choisit. Le mot des photographies
     porte les crédits, que deux des six licences EXIGENT : la page les compose
     depuis `atlas.js`, ce fichier ne les connaît pas.

     ON N'EXIGE LES DEUX PHOTOGRAPHIES QUE POUR LE DIRE. Si une seule a chargé,
     on garde l'aveu du dessin : il sous-estime ce qu'on montre au lieu de le
     surestimer, et c'est le bon sens de l'erreur. L'état mêlé est de toute
     façon fugace — les deux cartes partent du même dossier au même instant. */
  const parPhoto = carteDisponible("terre") && carteDisponible("lune");
  const aveu = (parPhoto && mot("declarePhoto")) || mot("declare");
  if(aveu){
    ctx.font = (9.5*u).toFixed(1) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(154,149,142,0.6)";
    ctx.fillText(aveu, marge, y0 + lignes.length*h + 2*u);
  }
  ctx.restore();
  return true;
}

/** La passe complète : place, découpe, peint, légende.
 *
 *  Elle vit ICI et non dans la page, et c'est plus qu'une question de lignes.
 *  L'enchaînement porte trois gestes qui réparent chacun un défaut déjà payé,
 *  et les laisser dans `index.html` les mettrait hors de portée de tout
 *  contrôle sans navigateur :
 *
 *    — `projette` rend `null` quand le point est derrière le plan de coupure.
 *      On ne dessine alors RIEN, au lieu de rabattre la scène au centre. Ce
 *      rabattement ÉTAIT le défaut de la carte des étoiles, le 9 août.
 *    — la découpe à la baie passe avant le dessin : sinon la scène déborde sur
 *      la coque et se lit comme un calque posé sur l'écran, ce qu'Hugo a déjà
 *      signalé pour les orbites et pour le quadrillage.
 *    — la légende, elle, est HORS découpe : c'est une aide de lecture, elle le
 *      déclare, et la tailler à la forme de la vitre la rendrait illisible.
 *
 *  La page ne tend que ses propres outils — la projection, la découpe, la
 *  focale — et n'a plus de composition à tenir. */
function peint(ctx, W, H, o){
  if(!etat.actif || !o || !o.projette) return null;
  const cible = ou(o.vitres);
  if(!cible) return null;
  const vu = o.projette(cible);
  if(!vu) return null;
  ctx.save();
  if(o.decoupe) o.decoupe();
  /* LE VOILE EST TOMBÉ — 16 août 2026, et c'est l'œil d'Hugo qui l'a fait
     tomber, sans savoir que c'était lui :

       « quand on survole la terre il y a un truc bizarre. Genre ça ne fait pas
       naturel, on n'a pas l'impression que c'est une planète, parce que quand
       on bouge de gauche à droite, c'est comme si la Skybox nous suivait. »

     Il avait raison sur le symptôme et la cause était ailleurs. La Terre est
     ancrée à 4 004 m dans le repère de la pièce : un pas de côté la déplace de
     0,014°, quand un montant de baie, à 3,7 m, se déplace de 15°. Elle est donc
     bien fixe — et c'était le TÉMOIN qui manquait. Ce voile remplissait toute la
     baie d'un noir opaque, en coordonnées d'écran : derrière la Terre il n'y
     avait pas un ciel, il y avait un carton noir collé à la fenêtre, qui suivait
     la fenêtre. Une planète immobile glissant sur un fond qui bouge, sans une
     étoile pour arbitrer : l'œil conclut que c'est le ciel qui nous suit.

     IL AVAIT UNE RAISON, ET ELLE A EXPIRÉ. Posé le 11 août comme douzième
     compromis (`ciel-arrivee`), il cachait le trou noir que la baie peignait
     encore, faute d'un vaisseau qui se déplace. Son propre texte portait sa date
     de péremption : « Le jour où le vaisseau bouge vraiment, le voile tombe
     seul. » Le vaisseau bouge — `majVoyage` pose `salon.p` à la distance
     courante, et l'on arrive à 2 × 10¹⁰ rayons de Schwarzschild, où l'ombre
     mesure un cinquante-milliardième de radian. Il n'y a plus rien à cacher.

     CE QUI RESTE FAUX EST DIT AUTREMENT : le champ d'étoiles est celui de
     l'amas nucléaire, pas notre ciel. C'est un aveu, et un aveu vrai vaut mieux
     qu'un cache — le compromis est réécrit dans `contenu.js` plutôt que
     supprimé. */
  const r = dessine(ctx, W, H, { x: vu[0], y: vu[1], k: echelle(o.focale, H) });
  /* Les étiquettes sont DEDANS le découpage de la baie, la légende DEHORS. Ce
     n'est pas un détail de rangement : un nom posé sur un astre appartient au
     monde qu'on voit par la vitre et doit être coupé avec lui, tandis que la
     légende est une aide de lecture posée sur l'écran, comme le réticule de
     `lune.js`. Les sortir du découpage ferait flotter « la Lune » sur une
     cloison, à côté d'une vitre où il n'y a plus rien. */
  if(r) etiquettes(ctx, W, H, r);
  ctx.restore();
  if(r) legende(ctx, W, H, r);
  return r;
}

/** LE VOILE, ET C'EST UN COMPROMIS QU'IL FAUT AVOUER PLUTÔT QUE CACHER.
 *
 *  Trouvé en regardant la scène tourner, pas en la calculant : le vaisseau ne
 *  bouge JAMAIS. Le recul est un diagramme — `RECUL.etat.distance` est un
 *  nombre, la position du salon reste à seize rayons de Sagittarius A*. Le
 *  nuanceur continue donc de peindre le trou noir, son disque et sa nébuleuse
 *  dans la baie, pendant que le panneau d'arrivée écrit qu'il est « à
 *  vingt-sept mille années-lumière derrière vous, et plus rien ne permet de
 *  l'y distinguer ».
 *
 *  Sans voile, la Terre arriverait à côté d'un trou noir large de la moitié de
 *  la vitre — celui qu'on vient de fuir. L'image contredirait le texte, et ce
 *  serait la pire des deux erreurs possibles.
 *
 *  On peint donc la nuit. C'est un aveu, déclaré à l'arrivée sous
 *  `arrivee-soleil` : ce noir n'est pas calculé, il remplace un calcul qui dit
 *  autre chose. Le jour où le vaisseau se déplacera vraiment, il tombera de
 *  lui-même.
 *
 *  La carte des étoiles S fait déjà ce geste, à sa façon — un voile à 0,62 —
 *  mais la sienne n'est qu'un assombrissement, parce qu'à SON arrivée le trou
 *  noir est encore là où on le montre. Ici il n'y est plus. */
/* CE QUI ÉTAIT ICI : `VOILE_MONTEE`, `opaciteVoile` et `voileLeCiel`, retirés
   le 16 août 2026. Le voile remplissait toute la baie d'un noir opaque pour
   cacher le trou noir que la page peignait encore ; le vaisseau se déplace
   vraiment depuis que le voyage est d'un seul tenant, et l'on arrive à
   2 × 10¹⁰ rayons de Schwarzschild — mesuré dans la page. Il n'y avait plus
   rien à cacher, et ce noir COÛTAIT quelque chose : voir `peint`.

   Le compromis `ciel-arrivee` ne disparaît pas pour autant, il change de sujet :
   le champ d'étoiles qu'on découvre est celui de l'amas nucléaire, pas notre
   ciel. Un aveu vrai à la place d'un cache.                                  */

/* ================================================================== 5. SORTIE */

global.TERRELUNE = {
  // calcul
  scene, demiAngle, echelle, pixels, ecartLunePx,
  distanceDemiPixel, distanceTerreCadree, distanceSortieLune, distanceA,
  fractionEclairee, contourEclaire, directionSoleilEcran,
  // déroulé
  etat, ou, ouvre, ferme, avance, avancement, distance,
  // mots, photographies et dessin
  poseMots, poseCartes, carteDisponible,
  dessine, legende, etiquettes, pointsEtiquettes, peint, visible,
  // les réglages déclarés, exposés pour que le contrôle les lise plutôt que de
  // les recopier — une constante recopiée dans un test est un test qui ment
  REGLAGES: { PART_TERRE, DUREE, PSI, AZIMUT, NUIT, DEMI_PIXEL,
              ECART_MIN, DECALAGE },
};

})(window);
