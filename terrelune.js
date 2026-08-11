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

   ET ON NE S'ARRÊTE PAS AU COUPLE, ON LE TRAVERSE. C'est le fait que la scène
   est venue dire, et il a failli m'échapper : à la distance où la Terre et la
   Lune tiennent ENSEMBLE dans la baie, la Terre ne fait que vingt pixels. Le
   système Terre–Lune est presque entièrement du vide — trente diamètres
   terrestres d'écart — et aucune image ne peut montrer les deux astres gros à
   la fois. La chute passe donc par ce moment-là, où l'on voit le couple et son
   gouffre, puis continue : la Lune sort du cadre par le côté et la Terre
   grandit jusqu'à remplir la baie. La légende dit où la Lune est partie.

   `distanceCouple` calcule ce moment de passage — il n'est écrit nulle part,
   il se relit à chaque ouverture avec la vraie fenêtre.

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
const PART_COUPLE = 0.86;  // part de la LARGEUR où le couple entier tient — un passage
const DUREE       = 9.0;   // secondes de chute — le rythme se juge à l'œil
const PSI        = 50 * Math.PI/180;  // angle Soleil / ligne de visée : gibbeuse à 82 %
const AZIMUT     = -0.32;  // radians : le côté où l'on pose la Lune à l'écran
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

/** L'étendue du couple à l'écran, en pixels : du limbe extérieur de la Terre au
 *  limbe extérieur de la Lune. C'est ce qu'on cadre. */
function etendue(d_km, k){
  const s = scene(d_km);
  if(!isFinite(s.terre.alpha)) return Infinity;   // on est dans la Terre
  return pixels(s.terre.alpha, k) + pixels(s.ecart + s.lune.alpha, k);
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

/** La distance où le couple entier tient dans `part` de la largeur `W`.
 *
 *  Ce n'est pas là qu'on s'arrête : c'est le moment qu'on TRAVERSE, celui où
 *  l'écart Terre–Lune est encore dans le cadre. La chute continue au-delà.
 *
 *  Par bissection, parce que l'étendue n'est pas inversible à la main et
 *  qu'une formule approchée serait un chiffre de plus à croire. L'étendue
 *  décroît strictement avec d : la bissection converge. */
function distanceCouple(k, W, part){
  const cible = (part === undefined ? PART_COUPLE : part) * W;
  let bas = L.rayonDe(corps("terre")) * 1.0001, haut = 1e14;
  for(let i = 0; i < 200; i++){
    const m = Math.sqrt(bas*haut);          // bissection en logarithme
    if(etendue(m, k) > cible) bas = m; else haut = m;
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
  dCouple: 0,         // le moment de passage, où le couple tient dans la baie
  dir: null,          // direction du monde, GELÉE à l'arrivée
  duree: DUREE,
};

/** Ouvre la scène. `dir` est la direction du monde où le couple se tient — on
 *  la gèle, pour que l'orbite du vaisseau ne fasse pas dériver l'arrivée.
 *  `k` est l'échelle en pixels par radian, `W` la largeur de la vue, `focale`
 *  celle de la caméra du site.
 *
 *  Rend false et ne s'ouvre pas si `lune.js` manque : une scène qui invente ses
 *  propres rayons serait pire qu'une baie vide. */
function ouvre(dir, k, W, focale){
  if(!L || !L.ASTRES || !L.ECLAIRAGE) return false;
  if(!(k > 0) || !(W > 0) || !(focale > 0)) return false;
  etat.d1 = distanceTerreCadree(focale);
  etat.d0 = distanceDemiPixel(k);
  etat.dCouple = distanceCouple(k, W);
  // Une fenêtre minuscule pourrait mettre le demi-pixel plus près que le but :
  // il n'y aurait alors pas de chute à jouer, on se pose au but.
  if(!(etat.d0 > etat.d1)) etat.d0 = etat.d1;
  etat.dir = [dir[0], dir[1], dir[2]];
  etat.t = 0;
  etat.actif = true;
  return true;
}

function ferme(){ etat.actif = false; etat.dir = null; etat.t = 0; }

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

/* =============================================================== 4. LE DESSIN */

/** Le disque d'un astre, avec sa nuit calculée.
 *
 *  On peint deux fois : le globe entier au ras de l'éteint, puis le globe
 *  éclairé découpé au contour du terminateur. C'est plus simple qu'un masque,
 *  et surtout ça garde le modelé de `lune.js` des deux côtés — une face nuit
 *  peinte à plat trahirait qu'on a posé un cache. */
function disque(ctx, corpsScene, cx, cy, r, phi, psi){
  const a = corpsScene.astre;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2*Math.PI); ctx.clip();
  L.dessineAstre(ctx, a, cx, cy, r, NUIT);

  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(phi);
  const p = contourEclaire(r, psi);
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  for(let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.closePath();
  ctx.clip();
  ctx.rotate(-phi); ctx.translate(-cx, -cy);
  L.dessineAstre(ctx, a, cx, cy, r, 1);
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
  if(mot("declare")){
    ctx.font = (9.5*u).toFixed(1) + "px ui-monospace, monospace";
    ctx.fillStyle = "rgba(154,149,142,0.6)";
    ctx.fillText(mot("declare"), marge, y0 + lignes.length*h + 2*u);
  }
  ctx.restore();
  return true;
}

/* ================================================================== 5. SORTIE */

global.TERRELUNE = {
  // calcul
  scene, demiAngle, echelle, pixels, etendue,
  distanceDemiPixel, distanceTerreCadree, distanceCouple, distanceA,
  fractionEclairee, contourEclaire, directionSoleilEcran,
  // déroulé
  etat, ouvre, ferme, avance, avancement, distance,
  // mots et dessin
  poseMots, dessine, legende, visible,
  // les réglages déclarés, exposés pour que le contrôle les lise plutôt que de
  // les recopier — une constante recopiée dans un test est un test qui ment
  REGLAGES: { PART_TERRE, PART_COUPLE, DUREE, PSI, AZIMUT, NUIT, DEMI_PIXEL },
};

})(window);
