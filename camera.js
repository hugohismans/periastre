/* ============================================================================
   La caméra — le seul endroit du site qui décide D'OÙ l'on regarde, et qui
   traduit entre les trois mondes qui doivent s'accorder au pixel près.

   Trois mondes, et c'est là tout l'enjeu :

     · le lancer de géodésiques, en WebGL, qui ne connaît qu'une position, une
       base orthonormée et une focale ;
     · le calque à deux dimensions, où l'on pose les sondes, les traces, les
       repères et le quadrillage ;
     · le pointeur, qui désigne un endroit du plan du disque en cliquant sur
       une image dont il ignore tout.

   Ces trois-là ne se parlent pas. Ils s'accordent parce qu'ils partagent la
   MÊME position, la MÊME base et la MÊME focale. Le jour où deux d'entre eux
   n'en partagent plus qu'une partie, rien ne casse : les sondes se mettent
   simplement à tourner autour d'un centre décalé, et l'on cherche pendant une
   heure une erreur de physique qui n'existe pas. C'est arrivé.

   ---------------------------------------------------------------------------
   `projette` ET `surLePlan` SONT EXACTEMENT INVERSES, ET ÇA SE DÉMONTRE

   Ce n'est pas une intention, c'est une identité. En posant q = p − pos :

       projette :  px = ( (q·d)/z · F · H + W ) / 2
                   py = H − ( (q·h)/z · F · H + H ) / 2

       surLePlan : ux = (px·2 − W)/H              -> (q·d)/z · F
                   uy = ((H − py)·2 − H)/H        -> (q·h)/z · F
                   dir ∝ d·ux + h·uy + a·F         -> q · F/z

   La direction reconstruite est colinéaire à q : on retombe sur le point de
   départ, au signe et à l'échelle près. MAIS seulement si les deux emploient
   les mêmes W et H. Avec deux mesures différentes de la même image, l'aller et
   le retour ne se referment plus — l'écart est un facteur d'aspect, donc il se
   voit horizontalement et pas verticalement, ce qui est la pire des signatures
   parce qu'elle ressemble à un défaut de physique.

   D'où la règle du contrat : `vue` arrive en argument, la MÊME aux deux. Le
   module ne peut plus choisir sa mesure, donc il ne peut plus en choisir deux.

   ---------------------------------------------------------------------------
   POURQUOI L'ÉTAT RESTE CHEZ L'APPELANT, ET COMMENT

   Quatorze domaines lisent cette caméra. Une variable réassignée ne se partage
   pas entre deux fichiers : la lier ailleurs en fige la valeur du moment. La
   leçon est déjà payée dans ce dépôt — c'est l'histoire de `nChute`, devenu un
   champ de `compte` pour cette raison exacte.

   Donc : UN SEUL OBJET, `cam`, créé par `CAMERA.etat()`, détenu par la page, et
   que le module remplit. `cam.pos`, `cam.base`, `cam.vitesse` sont des CHAMPS,
   pas des variables — tout le monde les voit bouger. Et `cam.dist`, `cam.elev`,
   `cam.azim` gardent leurs noms, donc les douze endroits qui les touchent déjà
   n'ont pas une ligne à changer.

   Deux valeurs restent dehors, et c'est délibéré : `lieu` et l'indice de la
   sonde suivie. Elles n'appartiennent pas à la caméra — `vaAu()` en est le
   seul écrivain, et l'invariant « `sondeSuivie !== null` ⇔ `lieu === "sonde"` »
   est éprouvé ailleurs. Le module les REÇOIT et, quand la sonde suivie s'est
   évaporée, il DEMANDE le décrochage au lieu de le faire. La page tranche.

   ---------------------------------------------------------------------------
   NI DOM, NI WEBGL, NI `window`

   Même règle qu'`ecrans.js` et `cockpit.js`. Le bouton d'embarquement ne peut
   donc pas entrer : `CAMERA.bouton()` rend un DESCRIPTEUR, et c'est la page qui
   peint. Le bénéfice n'est pas théorique — une dépendance oubliée lève une
   exception au premier appel, là où une lecture globale aurait continué de
   marcher dans la page et de casser dans le contrôle.

   ---------------------------------------------------------------------------
   LE CONTRAT

     CAMERA.FOCAL                 1.55 — tan(demi-champ) = 1/F. La MÊME valeur
                                  que `mvpSalon` et que `uFocal` : c'est elle
                                  qui garantit que l'astre vu par la baie est à
                                  sa place. `etat()` la copie dans `cam.focale`,
                                  et tout le monde lit `cam.focale`.

     CAMERA.etat()                l'objet caméra, neuf, aux valeurs de départ :
                                  { dist, elev, azim, focale,
                                    pos:[x,y,z], base:{d,h,a}, vitesse:[x,y,z],
                                    regard:{ lacet, tangage } }

     CAMERA.maj(cam, e)           remplit `cam` selon le lieu, et rend
                                  { lieu, sonde, decroche }. `lieu` et `sonde`
                                  sont ce que la page DOIT désormais tenir ;
                                  `decroche` est vrai quand la sonde suivie a
                                  disparu sous la caméra.

     CAMERA.majLibre(cam, e)      les trois branches, exposées séparément pour
     CAMERA.majSalon(cam, e)      qu'un contrôle puisse en éprouver une sans
     CAMERA.majSonde(cam, e)      monter tout l'état du jeu autour.

     CAMERA.projette(cam, p, vue) monde -> [x, y] en pixels CSS, ou null
                                  derrière le plan de coupure. vue = { W, H }.

     CAMERA.surLePlan(cam, px, py, vue)   pixel -> point du plan du disque
                                  (y = 0), ou null si le rayon ne le coupe pas
                                  devant soi.

     CAMERA.occulte(cam, p, rOmbre)   vrai si l'ombre passe entre l'œil et le
                                  point. `rOmbre` = PHYSIQUE.R_OMBRE.

     CAMERA.meilleureSonde(sondes)    l'indice de la sonde la plus proche d'une
                                  orbite tenable, ou null.

     CAMERA.embarque(cam, i, sondes)  la DÉCISION de monter ou de descendre :
                                  { lieu, sonde, monte }. Elle remet le regard
                                  droit quand on monte, et ne fait rien d'autre.

     CAMERA.bouton(sonde)         { dessus, cle } — l'état du bouton et la clé
                                  de texte. La page appelle `T(cle)` et peint.

   Ce que `e` doit porter, selon la branche :

     e.lieu        "libre" | "salon" | "sonde"
     e.sonde       l'indice de la sonde suivie, ou null
     e.sondes      le tableau des sondes (VOL.sondes)
     e.salon       l'état du salon — p, v, horloge lus ; versAstre et eclat
                   ÉCRITS (voir plus bas)
     e.repere      { av, dr } — le repère du regard dans la pièce, soit
                   `regardSalon()`. Reçu calculé : le module ne connaît ni
                   `salon.lacet` ni `salon.tangage`, qui appartiennent à
                   l'arpentage.
     e.horizon     PHYSIQUE.R_HORIZON, pour la vitesse mesurée localement
     e.cross, e.dot, e.len, e.norm    les quatre opérations de PHYSIQUE

   ---------------------------------------------------------------------------
   LA CAMÉRA DU SALON ÉCRIT DANS `salon`, ET C'EST VOULU

   `salon.versAstre` et `salon.eclat` sont la direction et l'intensité de la
   SOURCE dans le repère de la pièce. Ils ne se calculent qu'ici, parce qu'ils
   tombent du même repère que la caméra — et `habitacle.js` est leur seul
   lecteur. Deux fonctions qui les calculeraient chacune de leur côté, ce serait
   deux lois pour un même espace, et l'œil verrait la lumière balayer le sol au
   décalage près. Un seul écrivain, donc, et il est ici. C'est écrit noir sur
   blanc plutôt que subi : le module n'est pas pur, il a UNE sortie latérale,
   nommée.
   ============================================================================ */

(function(global){
"use strict";

/* La focale, et une seule. `mvpSalon()` la reprend pour son P[0]/P[5], le
   nuanceur la reçoit dans `uFocal`, et `projette`/`surLePlan` la lisent dans
   `cam.focale`. Trois lecteurs, une valeur — c'est ce qui fait que l'astre vu
   par la baie est au même endroit que l'astre vu en vue libre.               */
const FOCAL = 1.55;

/* L'objet que la page détient. Les valeurs de départ sont celles de la vue
   d'ouverture — 21 rayons de recul, à peine au-dessus du plan du disque, pour
   qu'on voie l'anneau s'ouvrir sans être dedans.                             */
function etat(){
  return {
    dist: 21, elev: 0.17, azim: 0.6,
    focale: FOCAL,
    pos: [0, 0, 0],
    base: { d:[1,0,0], h:[0,1,0], a:[0,0,1] },
    // Vitesse mesurée par l'observateur statique local : c'est elle qui
    // gouverne l'aberration, et elle vaut zéro partout sauf à bord d'une sonde.
    vitesse: [0, 0, 0],
    // Où l'on tourne la tête quand on est embarqué. Séparé de `dist/elev/azim`,
    // qui pilotent la vue libre : ce sont deux commandes distinctes, et les
    // confondre ferait sauter la caméra au moment d'embarquer.
    regard: { lacet: 0, tangage: 0 },
  };
}

/* -------------------------------------------------------------- la vue libre
   Une caméra en orbite autour de l'origine, qui regarde toujours l'astre.    */
function majLibre(cam, e){
  const { cross, norm } = e;
  // On redescend à zéro : sans ça, la vitesse de la dernière sonde quittée
  // resterait dans l'uniforme d'aberration et le ciel entier resterait penché.
  cam.vitesse = [0, 0, 0];
  const ce = Math.cos(cam.elev), se = Math.sin(cam.elev);
  cam.pos = [ cam.dist*ce*Math.cos(cam.azim), cam.dist*se, cam.dist*ce*Math.sin(cam.azim) ];
  const a = norm([-cam.pos[0], -cam.pos[1], -cam.pos[2]]);
  const d = norm(cross(a, [0,1,0]));
  cam.base = { d, h: cross(d, a), a };
}

/* -------------------------------------------------------------------- le salon
   Depuis le salon, la caméra est celle d'une personne debout derrière la baie.
   Le vaisseau orbite lentement, en temps réel — le salon ne triche pas.      */
function majSalon(cam, e){
  const { cross, dot, len, norm, salon, repere } = e;
  const P = salon.p;
  cam.pos = [P[0], P[1], P[2]];
  /* ON REDESCEND À ZÉRO, COMME LA VUE LIBRE. Cette ligne manquait.
     Le bouton du salon appelle `vaAu("salon")` sans repasser par la vue libre :
     on quittait donc une sonde à 0,3 c et l'on entrait dans la pièce avec sa
     vitesse encore dans l'uniforme d'aberration. Tout le ciel vu par la baie
     restait penché, à la vitesse d'un objet qu'on venait de quitter.

     Trouvé le 8 août par les deux agents qui écrivaient l'outil de la caméra et
     celui du recul, chacun de son côté, en lisant le module extrait. Le défaut
     était dans la page depuis le début et n'a jamais été vu — ce n'est pas un
     effet de l'extraction, c'est ce qu'elle a montré.

     ZÉRO N'EST PAS LA RÉPONSE PHYSIQUE, et c'est une question pour Hugo, écrite
     dans `A-REGARDER.md` : le vaisseau du salon orbite pour de vrai, donc son
     ciel DEVRAIT être aberré — de SA vitesse à lui, pas de celle d'une sonde
     quittée. Zéro est le comportement voulu jusqu'ici, sur toute la partie sauf
     après une sonde ; on rétablit ce qui était voulu, et on lui demande. */
  cam.vitesse = [0, 0, 0];
  // Repère de la pièce dans le monde. La baie regarde l'astre — mais PAS
  // exactement : un vaisseau ne se recale pas en permanence. Sans ce décalage,
  // l'astre reste cloué au centre de la fenêtre et rien ne semble bouger,
  // alors même qu'on file autour de lui.
  const vise = norm([-P[0], -P[1], -P[2]]);
  const nOrb = norm(cross(salon.p, salon.v));
  // En temps RÉEL, pas en temps simulé : TEMPS.geo est accéléré 850 fois, et la
  // dérive devenait un balayage frénétique. Une respiration de trente secondes.
  const ts = salon.horloge;
  /* LE DEMI-TOUR, ET IL PASSE PAR LA MÊME ROTATION QUE LA DÉRIVE — 11 août 2026.

     La baie regarde l'astre. C'est ce qui rend le recul visible : on part, et
     l'on voit rétrécir ce qu'on quitte. Mais on arrive alors DOS à sa
     destination — le système solaire est au bout du rayon qu'on a suivi, donc
     derrière la coque. Le vaisseau se retourne, comme il le ferait vraiment.

     `salon.retourne` va de 0 à 1 et vaut un demi-tour. La page en est le seul
     écrivain, et c'est délibéré : c'est elle qui sait qu'on vient d'arriver. Le
     module, lui, n'ajoute qu'un angle à celui qu'il tournait déjà — même axe,
     même formule de Rodrigues. Une seconde rotation écrite à côté aurait été
     une seconde loi pour l'orientation d'une même pièce.

     `salon.versAstre` reste calculé dans le repère RÉSULTANT : l'astre passe
     donc derrière, et la lumière avec lui. C'est ce qu'on veut — à vingt-sept
     mille années-lumière il n'éclaire plus rien, et `eclat` le dit déjà. */
  const ang = 0.10*Math.sin(ts*0.21) + 0.045*Math.sin(ts*0.073)
            + Math.PI * (salon.retourne || 0);
  // rotation de `vise` autour de la normale orbitale (formule de Rodrigues)
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const cr = cross(nOrb, vise), pd = dot(nOrb, vise);
  const f = norm([
    vise[0]*ca + cr[0]*sa + nOrb[0]*pd*(1-ca),
    vise[1]*ca + cr[1]*sa + nOrb[1]*pd*(1-ca),
    vise[2]*ca + cr[2]*sa + nOrb[2]*pd*(1-ca),
  ]);
  const d0 = norm(cross(f, [0,1,0]));
  const h0 = cross(d0, f);
  // Le regard tourne dans ce repère, exactement comme dans la pièce. Il arrive
  // tout calculé : le lacet et le tangage du promeneur sont à l'arpentage, pas
  // à la caméra, et les lire ici en ferait un second interprète.
  const { av, dr } = repere;
  const versMonde = v => [
    v[0]*d0[0] + v[1]*h0[0] - v[2]*f[0],
    v[0]*d0[1] + v[1]*h0[1] - v[2]*f[1],
    v[0]*d0[2] + v[1]*h0[2] - v[2]*f[2],
  ];
  const a = norm(versMonde(av)), d = norm(versMonde(dr));
  cam.base = { d, h: cross(d, a), a };

  /* LA SORTIE LATÉRALE, ANNONCÉE DANS L'EN-TÊTE.

     Où est l'astre DANS la pièce ? C'est lui la source : quand il dérive dans
     la baie, la lumière doit balayer le sol et les parois avec lui. Le calcul
     tombe du repère qu'on vient d'établir — le refaire ailleurs donnerait deux
     lois pour un même espace, et l'éclairage se décalerait de l'image.       */
  salon.versAstre = norm([dot(vise, d0), dot(vise, h0), -dot(vise, f)]);
  // Et il éclaire d'autant plus qu'on est près : le flux suit l'angle solide.
  const r = len(P);
  salon.eclat = Math.min(3.2, Math.pow(16/Math.max(r, 4), 2));
}

/* -------------------------------------------------------------------- la sonde
   Caméra dans une sonde en orbite : on est en chute libre, donc on regarde
   l'astre et l'on tourne la tête autour de lui.                              */
function majSonde(cam, e){
  const { cross, dot, len, norm, sondes, horizon } = e;
  const s = sondes[e.sonde];
  cam.pos = [...s.p];
  const r = len(cam.pos);
  const rh = [cam.pos[0]/r, cam.pos[1]/r, cam.pos[2]/r];

  // Vitesse telle que la mesure l'observateur statique local : son temps est
  // ralenti de √(1−r_s/r) et sa règle radiale étirée d'autant. C'est cette
  // vitesse-là qui gouverne l'aberration, pas la vitesse en coordonnées.
  const f  = Math.max(1 - horizon/r, 1e-3);
  const vr = dot(s.v, rh);
  const vt = [s.v[0]-vr*rh[0], s.v[1]-vr*rh[1], s.v[2]-vr*rh[2]];
  const nt = len(vt);
  const th = nt > 1e-9 ? [vt[0]/nt, vt[1]/nt, vt[2]/nt] : [0,0,0];
  const vrl = vr/f, vtl = nt/Math.sqrt(f);
  let vl = [ vrl*rh[0]+vtl*th[0], vrl*rh[1]+vtl*th[1], vrl*rh[2]+vtl*th[2] ];
  const n = len(vl);
  // Plafond à 0,97 c : au-delà, l'aberration replie le ciel entier en un point
  // et le nuanceur perd sa précision avant que la physique ne perde son sens.
  if(n > 0.97) vl = [vl[0]*0.97/n, vl[1]*0.97/n, vl[2]*0.97/n];
  cam.vitesse = vl;

  // Repère de base : on regarde le trou noir, « haut » = normale de l'orbite.
  const a0 = [-rh[0], -rh[1], -rh[2]];
  let no = cross(s.p, s.v);
  if(len(no) < 1e-9) no = [0,1,0];
  no = norm(no);
  if(no[1] < 0) no = [-no[0], -no[1], -no[2]];       // garder le nord en haut
  let d0 = cross(a0, no);
  if(len(d0) < 1e-6) d0 = cross(a0, [1,0,0]);
  d0 = norm(d0);
  const h0 = cross(d0, a0);

  const cl = Math.cos(cam.regard.lacet), sl = Math.sin(cam.regard.lacet);
  const ct = Math.cos(cam.regard.tangage), st = Math.sin(cam.regard.tangage);
  const a = norm([
    ct*(cl*a0[0] + sl*d0[0]) + st*h0[0],
    ct*(cl*a0[1] + sl*d0[1]) + st*h0[1],
    ct*(cl*a0[2] + sl*d0[2]) + st*h0[2],
  ]);
  const d = norm([ cl*d0[0]-sl*a0[0], cl*d0[1]-sl*a0[1], cl*d0[2]-sl*a0[2] ]);
  cam.base = { d, h: cross(d, a), a };
}

/* La caméra suit le LIEU, elle ne le devine pas.

   Elle interrogeait autrefois les drapeaux dans un ordre convenu — salon, puis
   sonde, puis vue libre — et c'est précisément ce qui rendait un conflit muet :
   deux drapeaux vrais, et elle prenait le premier sans rien dire. Ici il n'y a
   qu'une valeur, et les trois branches la couvrent entièrement : la dernière
   prend « libre » ET tout ce qui ne serait pas un lieu connu — un état
   impossible atterrit dans la vue la plus inoffensive.

   Mais elle ne RENOMME pas ce qu'elle ne connaît pas. Un quatrième lieu — la
   salle de tir est annoncée — verrait sinon son nom silencieusement remplacé
   par « libre » à la première image, et l'on chercherait la faute dans `vaAu`.
   Le lieu ressort tel qu'il est entré ; seule la sonde évaporée le change.

   ELLE N'ÉCRIT PAS `lieu`, ELLE LE DEMANDE. Quand la sonde suivie a chuté ou
   fui entre deux images, il faut redescendre — mais `vaAu()` est l'unique
   écrivain de `lieu`, et `vaAu()` appelle justement cette fonction. Écrire
   `lieu` ici en ferait un second écrivain, exactement la maladie qui a donné le
   disque à 622× ; l'appeler d'ici ferait un cycle. On rend donc `decroche`, et
   la page en fait ce qu'elle veut — au minimum ce qu'elle faisait déjà.       */
function maj(cam, e){
  let lieu = e.lieu, sonde = e.sonde;

  if(lieu === "salon"){ majSalon(cam, e); return { lieu, sonde, decroche:false }; }

  if(lieu === "sonde"){
    // La sonde a pu tomber ou fuir entre-temps : on redescend proprement plutôt
    // que de rester accroché à un objet qui n'existe plus.
    if(sonde !== null && e.sondes[sonde]){
      majSonde(cam, e);
      return { lieu, sonde, decroche:false };
    }
    majLibre(cam, e);
    return { lieu:"libre", sonde:null, decroche:true };
  }

  majLibre(cam, e);
  return { lieu, sonde, decroche:false };
}

/* --------------------------------------------------------- monter, descendre

   La DÉCISION seulement. Le changement de lieu passe par `vaAu`, le bouton par
   `bouton()`, le son par la page : rien de tout cela n'a sa place ici.

   Un piège à ne pas déplacer, écrit dans `vaAu` : l'indice de la sonde doit
   être posé AVANT d'entrer dans le lieu « sonde », sinon la précondition de
   `vaAu` va chercher une sonde toute seule et l'on embarque sur une autre que
   celle qu'on a désignée. L'ordre est donc : lire ce descripteur, poser
   `sondeSuivie`, puis appeler `vaAu(lieu)`.                                   */
function embarque(cam, i, sondes){
  if(i === null || !sondes[i]) return { lieu:"libre", sonde:null, monte:false };
  // On remet le regard droit : garder l'orientation de la sonde précédente
  // ferait démarrer la nouvelle vue le nez dans le vide, sans que rien ne le
  // dise. Le regard appartient à la place, pas au passager.
  cam.regard.lacet = 0;
  cam.regard.tangage = 0;
  return { lieu:"sonde", sonde:i, monte:true };
}

/* La sonde la plus proche d'une orbite tenable, pour que la vue dure.

   40 n'est pas une distance, c'est un refus : sous 3,4 rayons on est déjà
   dedans, et embarquer là revient à offrir trois secondes de chute. La pénalité
   déclasse ces sondes derrière n'importe quelle autre sans les interdire — s'il
   n'y a qu'elles, on monte quand même.                                        */
function meilleureSonde(sondes){
  let best = -1, score = Infinity;
  for(let i = 0; i < sondes.length; i++){
    const s = sondes[i];
    if(s.sort !== "orbite" || s.gel) continue;
    const r = Math.hypot(s.p[0], s.p[1], s.p[2]);
    const e = Math.abs(r - 6) + (r < 3.4 ? 40 : 0);
    if(e < score){ score = e; best = i; }
  }
  return best >= 0 ? best : null;
}

/* Le bouton reflète l'état, il ne le décide pas.

   Il ne peut pas entrer dans ce module — il touche trois nœuds du document — et
   il ne peut pas non plus rester une évidence : la page doit savoir QUOI peindre
   sans redériver la règle. D'où un descripteur, que la page pose telle quelle.

   Une seule clé pour « monter » : le bouton portait deux noms selon qu'on en
   était déjà redescendu, et les consignes de mission en désignent un seul.    */
function bouton(sonde){
  const dessus = sonde !== null && sonde !== undefined;
  return { dessus, cle: dessus ? "dock.sonde.redescendre" : "dock.sonde" };
}

/* ------------------------------------------------------------- les deux ponts

   Ils sont écrits sans `e` et sans dépendance : trois multiplications et un
   `Math.hypot` valent mieux qu'un objet d'appel sur un chemin parcouru plusieurs
   milliers de fois par image. Les quatre opérations de PHYSIQUE sont recopiées
   ici à l'identique — `len` EST `Math.hypot`, ce n'est pas une approximation.

   `vue` est le seul argument qui vient de l'extérieur du domaine, et c'est la
   raison d'être de ce contrat : la taille de l'image est décidée ailleurs, elle
   change sous les pieds (la barre d'adresse d'un téléphone se rétracte au
   défilement), et les DEUX fonctions doivent recevoir la MÊME — voir l'en-tête.
                                                                              */

// monde -> pixel. Projection DROITE : la lentille n'est pas prise en compte,
// c'est un calque de repérage posé par-dessus l'image relativiste. Un repère
// qui suivrait la déflexion mentirait sur ce qu'il repère.
function projette(cam, p, vue){
  const b = cam.base;
  const qx = p[0]-cam.pos[0], qy = p[1]-cam.pos[1], qz = p[2]-cam.pos[2];
  const z = qx*b.a[0] + qy*b.a[1] + qz*b.a[2];
  if(z <= 0.05) return null;
  const x = qx*b.d[0] + qy*b.d[1] + qz*b.d[2];
  const y = qx*b.h[0] + qy*b.h[1] + qz*b.h[2];
  const W = vue.W, H = vue.H, F = cam.focale;
  return [ (x/z*F*H + W)/2, H - (y/z*F*H + H)/2 ];
}

/* Vrai si le trou noir passe entre la caméra et le point.

   On cherche le point du SEGMENT le plus proche du centre : t est le paramètre
   qui minimise |pos + t·q|, et les deux bornes écartées disent que l'astre est
   derrière soi ou derrière le point — dans les deux cas il ne cache rien.
   `rOmbre` n'est pas l'horizon mais le rayon APPARENT de l'ombre, plus grand :
   ce qui compte pour masquer un repère, c'est ce que l'œil voit noir.        */
function occulte(cam, p, rOmbre){
  const c = cam.pos;
  const qx = p[0]-c[0], qy = p[1]-c[1], qz = p[2]-c[2];
  const qq = qx*qx + qy*qy + qz*qz;
  const t = -(c[0]*qx + c[1]*qy + c[2]*qz) / qq;
  if(t <= 0 || t >= 1) return false;
  return Math.hypot(c[0]+qx*t, c[1]+qy*t, c[2]+qz*t) < rOmbre;
}

// pixel -> point du plan du disque (y = 0). L'inverse exact de `projette`,
// à condition qu'on lui donne la même `vue` — voir l'en-tête.
function surLePlan(cam, px, py, vue){
  const b = cam.base, F = cam.focale;
  const W = vue.W, H = vue.H;
  const ux = (px*2 - W)/H, uy = ((H - py)*2 - H)/H;
  const dx = b.d[0]*ux + b.h[0]*uy + b.a[0]*F;
  const dy = b.d[1]*ux + b.h[1]*uy + b.a[1]*F;
  const dz = b.d[2]*ux + b.h[2]*uy + b.a[2]*F;
  const l = Math.hypot(dx, dy, dz) || 1;
  const dir = [dx/l, dy/l, dz/l];
  // Un rayon rasant coupe le plan à l'infini : on refuse, plutôt que de rendre
  // une coordonnée de dix mille rayons qui passerait tous les tests de borne.
  if(Math.abs(dir[1]) < 1e-4) return null;
  const t = -cam.pos[1] / dir[1];
  if(t <= 0) return null;                       // le plan est derrière soi
  return [ cam.pos[0]+dir[0]*t, 0, cam.pos[2]+dir[2]*t ];
}

global.CAMERA = {
  FOCAL, etat, maj, majLibre, majSalon, majSonde,
  projette, surLePlan, occulte, meilleureSonde, embarque, bouton,
};

})(window);
