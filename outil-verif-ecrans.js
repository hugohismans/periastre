/* ============================================================================
   LES ÉCRANS DE BORD, ÉPROUVÉS SANS NAVIGATEUR

       node outil-verif-ecrans.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   `ecrans.js` est le plus gros module sorti d'`index.html`, et c'était le seul
   sans gardien. Il porte les deux seuls objets du vaisseau qui affichent des
   CHIFFRES : le rayon en rₛ, la date de la Terre, celle du bord, et l'écart qui
   se creuse entre les deux. Un chiffre faux y serait cru, parce qu'il est posé
   sur un instrument et non dans un texte.

   Mais il porte aussi un compromis assumé — du dessin à deux dimensions plaqué
   sur une paroi à trois — et ce compromis a deux garde-fous géométriques qui ne
   se voient PAS quand ils marchent. On ne remarque un écran qui refuse de se
   déformer que le jour où il cesse de refuser. À ce moment-là, le cadre suit la
   paroi et le contenu non, et personne ne sait dire depuis quand.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI  (règle 3)

   Surtout pas de la matrice de la page, ni de `projette` confronté à lui-même.
   Trois sources, toutes extérieures au module :

   1. UNE CAMÉRA À STÉNOPÉ, redérivée en bas de ce fichier sans aucune matrice.
      Un point du monde, un œil, un repère orthonormé, une focale : le pixel se
      calcule en quatre produits scalaires. C'est la définition d'une projection
      perspective, pas une réécriture de `projette`. La matrice 4×4, elle, est
      construite ICI par la formule OpenGL standard et donnée au module — s'il
      recopiait la page au lieu de calculer, il tomberait dessus.

   2. `vaisseau.js`, chargé pour de vrai. C'est lui qui sait où sont les
      cloisons, où s'ouvre la baie, et à quelle hauteur se tiennent les yeux.
      Rien de tout ça n'est réécrit ici.

   3. LA GÉOMÉTRIE DES DALLES, RETROUVÉE ET NON RECOPIÉE. Les coordonnées des
      deux écrans sont écrites en dur dans `dessine()` ; les relire ici ferait
      un contrôle qui approuve tout ce qu'on écrira. On fait donc l'inverse :
      on regarde le quadrilatère tracé à l'écran depuis DEUX points de vue, on
      renvoie les huit rayons dans la pièce, et l'on cherche le plan où les deux
      relevés se superposent. Ce plan et ce rectangle sont alors des mesures.
      Elles se confrontent ensuite à la coque : est-on sur une cloison ? à
      hauteur d'yeux ? au-dessus du vide de la baie ?

   ---------------------------------------------------------------------------
   COMMENT ON ÉPROUVE UN DESSIN SANS ÉCRAN

   Même technique qu'`outil-verif-cockpit.js` : un faux contexte 2D qui ne
   dessine rien et note tout, matrice affine tenue à jour, points relevés en
   coordonnées d'écran. Trois ajouts, parce qu'ici ce sont d'autres choses qui
   sont en jeu :

   · L'OPACITÉ EST RELEVÉE À CHAQUE TRACÉ, et `save`/`restore` la remettent en
     place comme le ferait une vraie toile. Sans ça l'atténuation du premier
     écran se multiplierait dans le second, et le contrôle de l'extinction
     mesurerait un cumul au lieu d'un fondu.
   · LES DÉGRADÉS GARDENT LEURS ARRÊTS. Une lueur posée à pleine opacité et une
     lueur posée à un pour cent sont deux `fillRect` identiques si l'on ne
     regarde que la géométrie. Ce fichier a trouvé un défaut par là.
   · LA TOILE HORS CHAMP EST UN VRAI FAUX CANEVAS. `e.fabriqueToile()` rend un
     objet dont `getContext("2d")` est un second enregistreur : c'est là que le
     texte des écrans est réellement écrit, et c'est le seul moyen de le lire.

   L'HORLOGE EST FAUSSE, ET C'EST INDISPENSABLE. Le module lit `performance.now()`
   comme variable libre ; on la lui fournit en paramètre de `new Function`. Le
   cache de 250 ms se contrôle donc au millième près, sans attendre une seconde
   et sans qu'un contrôle dépende de la charge de la machine.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le dernier groupe rejoue les contrôles sur des copies EN MÉMOIRE du module,
   volontairement cassées — le seuil de biais, le délai du cache, le
   suréchantillonnage, le plan de coupure, la distance à la cloison, le compteur,
   une clé de texte — plus un sabotage par l'environnement (`e.len` qui ment)
   qui ne dépend d'aucune ligne de code particulière. Le fichier sur le disque
   n'est jamais touché. Ce qui tombe est écrit à côté de chaque sabotage.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS, ET IL FAUT LE DIRE

   Les couleurs, les contrastes, la lisibilité réelle du texte à cette taille,
   la découpe par `clip` (le faux contexte ne la modélise pas), et le rendu
   WebGL derrière. Ces choses-là se jugent à l'œil, dans `?juge`.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN = path.join(ICI, "ecrans.js");
const CHEMIN_VAISSEAU = path.join(ICI, "vaisseau.js");

console.log("\n  LES ÉCRANS DE BORD — CONTRÔLE NUMÉRIQUE");
console.log("  ═══════════════════════════════════════");

let n = 0, echecs = 0;
/* Quand `carnet` n'est pas nul, `ok()` range au lieu d'imprimer : c'est ce qui
   permet de rejouer les mêmes assertions sur un module saboté sans salir la
   sortie, et sans les écrire une seconde fois — ce qui reviendrait à saboter
   aussi le contrôle du sabotage. */
let carnet = null;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  if(carnet){ carnet.push({ nom, vrai: !!vrai }); return; }
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
function stop(titre, lignes){
  console.log("\n  ❌  " + titre);
  console.log("  " + "─".repeat(titre.length + 4));
  for(const l of lignes) console.log("      " + l);
  console.log("");
  process.exit(1);
}

/* ══════════════════════════════════════ 0. LE MODULE EST-IL LÀ, ET CHARGEABLE ?

   S'il manque ou s'il explose, on ne rend PAS un zéro échec. Un outil qui n'a
   rien mesuré et qui sort en code 0 endort exactement comme un contrôle qui ne
   peut pas échouer : `node tout.js` afficherait un filet complet sur un trou. */
for(const f of [CHEMIN, CHEMIN_VAISSEAU])
  if(!fs.existsSync(f))
    stop(path.basename(f) + " est introuvable — RIEN N'A ÉTÉ MESURÉ", [
      "Ce contrôle a besoin des deux : le module, et la géométrie du vaisseau",
      "dont il tire sa vérité. Sans elle il ne resterait qu'à croire le module.",
    ]);

const SRC = fs.readFileSync(CHEMIN, "utf8");

/* L'horloge du banc. Le module lit `performance.now()` en variable libre : on
   la lui passe en paramètre de `new Function`, et le temps devient une valeur
   qu'on pose. Sans ça, tout contrôle du cache reviendrait à faire dormir le
   processus 250 ms et à espérer que la machine ne soit pas chargée. */
let TEMPS = 0;
const FAUSSE_HORLOGE = { now: () => TEMPS };

/* Le module se referme sur un faux global. On lui tend tous les noms sous
   lesquels un module de ce dépôt peut se déclarer, plutôt que d'imposer une
   forme d'écriture. Aucun DOM, aucun WebGL : si le module en touchait un, il
   lèverait ici — et c'est précisément la garantie qu'on veut. */
function charge(src, quoi){
  const bac = {};
  const mod = { exports: bac };
  new Function("window", "global", "globalThis", "self", "module", "exports",
               "performance", "document", src)
    (bac, bac, bac, bac, mod, bac, FAUSSE_HORLOGE, undefined);
  return bac[quoi] || (mod.exports && mod.exports[quoi]) || null;
}

let VAISSEAU;
try { VAISSEAU = charge(fs.readFileSync(CHEMIN_VAISSEAU, "utf8"), "VAISSEAU"); }
catch(err){
  stop("vaisseau.js ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "C'est de lui que ce contrôle tire la position des cloisons et de la baie.",
  ]);
}

/* Un module neuf à chaque scénario : le cache des toiles vit dans une `Map`
   fermée sur le module, donc le seul moyen de repartir d'un cache vide est de
   réévaluer la source. C'est aussi ce qui rend les sabotages possibles. */
let REGISTRE = [];      // les toiles hors champ fabriquées pour le module courant
function neuf(src){
  REGISTRE = []; TEMPS = 0;
  let E;
  try { E = charge(src || SRC, "ECRANS"); }
  catch(err){ return { erreur: err }; }
  return { ECRANS: E };
}

const premier = neuf();
if(premier.erreur)
  stop("ecrans.js ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    premier.erreur.name + " : " + premier.erreur.message,
    ...(premier.erreur.stack || "").split("\n").slice(1, 4).map(l => l.trim()),
    "",
    "Le module doit pouvoir s'évaluer hors navigateur : ni DOM, ni WebGL, ni",
    "`document` au chargement. C'est ce qui rend les modules de ce dépôt",
    "vérifiables sans ouvrir la page.",
  ]);
let ECR = premier.ECRANS;
if(!ECR || typeof ECR.dessine !== "function" || typeof ECR.projette !== "function"
        || typeof ECR.toile !== "function")
  stop("ecrans.js s'est chargé mais ne tient pas son contrat", [
    "attendu   global.ECRANS = { dessine, projette, toile }",
    "trouvé    " + (ECR ? "ECRANS = " + JSON.stringify(Object.keys(ECR))
                        : "aucun ECRANS sur le global"),
  ]);

/* ══════════════════════════════════════════ L'ARBITRE : UNE CAMÉRA À STÉNOPÉ

   Aucune matrice ici. Un point du monde, un œil, trois axes orthonormés, une
   focale : les coordonnées caméra sont trois produits scalaires, et le pixel
   suit de la définition même de la projection perspective. C'est cette
   fonction-là, et rien d'autre, qui juge `ECRANS.projette`.               */
const dot   = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const norme = a => Math.hypot(a[0], a[1], a[2]);
const norm  = a => { const l = norme(a) || 1; return [a[0]/l, a[1]/l, a[2]/l]; };
const moins = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
const dist  = (a, b) => norme(moins(a, b));

const FOCALE = 1.55;          // tan(demi-champ vertical) = 1/f

/* Un repère orthonormé direct autour d'une direction de regard QUELCONQUE.
   Volontairement pas la paramétrisation lacet/tangage de la page : un module
   qui ne saurait projeter que les matrices de `mvpSalon()` doit tomber ici. */
function repere(avant){
  const av = norm(avant);
  const t = Math.abs(av[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const dr = norm(cross(av, t));
  return { av, dr, ht: cross(dr, av) };
}

// Le pixel, par la seule définition du sténopé. `null` derrière l'œil.
function stenope(p, oeil, R, W, H){
  const r = moins(p, oeil);
  const w = dot(r, R.av);                       // profondeur devant l'œil
  if(w <= 0) return null;
  const ndcX = (FOCALE/(W/H)) * dot(r, R.dr) / w;
  const ndcY =  FOCALE         * dot(r, R.ht) / w;
  return [(ndcX + 1)/2 * W, (1 - ndcY)/2 * H, w];
}

/* Le chemin inverse : d'un pixel vers le rayon qui l'a produit. Il sert à
   RETROUVER la géométrie des dalles à partir de ce qui a été tracé, au lieu de
   recopier les coordonnées écrites dans `dessine()`. */
function rayon(px, py, R, W, H){
  const ndcX = 2*px/W - 1, ndcY = 1 - 2*py/H, aspect = W/H;
  const a = ndcX*aspect/FOCALE, b = ndcY/FOCALE;
  return [R.dr[0]*a + R.ht[0]*b + R.av[0],
          R.dr[1]*a + R.ht[1]*b + R.av[1],
          R.dr[2]*a + R.ht[2]*b + R.av[2]];
}
// Où ce rayon perce le plan z = zw.
function surPlan(oeil, D, zw){
  const t = (zw - oeil[2]) / D[2];
  return [oeil[0] + t*D[0], oeil[1] + t*D[1], oeil[2] + t*D[2]];
}

/* La matrice 4×4 donnée au module, construite ici par la formule OpenGL
   standard, en colonnes. Elle n'est jamais l'arbitre — l'arbitre est le
   sténopé ci-dessus. Elle n'est que l'entrée qu'on tend au module. */
function matrice(oeil, R, W, H){
  const aspect = W/H, pres = 0.05, loin = 200, nf = 1/(pres - loin);
  const P = [FOCALE/aspect,0,0,0,  0,FOCALE,0,0,
             0,0,(loin+pres)*nf,-1,  0,0,2*loin*pres*nf,0];
  const { av, dr, ht } = R;
  const V = [dr[0], ht[0], -av[0], 0,
             dr[1], ht[1], -av[1], 0,
             dr[2], ht[2], -av[2], 0,
             -dot(dr, oeil), -dot(ht, oeil), dot(av, oeil), 1];
  const M = new Array(16).fill(0);
  for(let i = 0; i < 4; i++) for(let j = 0; j < 4; j++){
    let s = 0;
    for(let k = 0; k < 4; k++) s += P[k*4 + j] * V[i*4 + k];
    M[i*4 + j] = s;
  }
  return M;
}

/* ══════════════════════════════════════ LE FAUX CONTEXTE 2D QUI ENREGISTRE */
const opacite = couleur => {
  if(couleur && couleur.__stops)                       // un dégradé : son pic
    return couleur.__stops.reduce((m, s) => Math.max(m, opacite(s)), 0);
  const m = /rgba?\(([^)]*)\)/.exec(String(couleur));
  if(!m) return 1;
  const p = m[1].split(",");
  return p.length >= 4 ? Number(p[3]) : 1;
};

function fauxContexte(W, H, traces){
  let M = [1, 0, 0, 1, 0, 0];                          // a b c d e f
  const pile = [];
  const mul = (p, q) => [
    p[0]*q[0] + p[2]*q[1], p[1]*q[0] + p[3]*q[1],
    p[0]*q[2] + p[2]*q[3], p[1]*q[2] + p[3]*q[3],
    p[0]*q[4] + p[2]*q[5] + p[4], p[1]*q[4] + p[3]*q[5] + p[5],
  ];
  const pt = (x, y) => [M[0]*x + M[2]*y + M[4], M[1]*x + M[3]*y + M[5]];
  const boite = (x, y, w, h) => [pt(x, y), pt(x + w, y), pt(x + w, y + h), pt(x, y + h)];
  let chemin = [];
  const note = (op, pts, sup) => {
    traces.push(Object.assign({ op, pts, alpha: c.globalAlpha,
                                brut: null, chemin: null }, sup || {}));
    return traces[traces.length - 1];
  };
  const taille = () => { const m = /(-?[\d.]+)px/.exec(c.font); return m ? +m[1] : 10; };
  const degrade = () => { const g = { __stops: [], addColorStop(o, k){ g.__stops.push(k); } };
                          return g; };
  // Le remplissage courant, avec son opacité effective : c'est ce qui permet de
  // distinguer une lueur posée à plein et la même posée à un pour cent.
  const encre = () => ({ opacite: c.globalAlpha * opacite(c.fillStyle),
                         stops: c.fillStyle && c.fillStyle.__stops ? c.fillStyle.__stops : null });
  const trait = () => ({ opacite: c.globalAlpha * opacite(c.strokeStyle) });

  const c = {
    canvas: { width: W, height: H },
    fillStyle: "#000", strokeStyle: "#000", lineWidth: 1, lineCap: "butt",
    lineJoin: "miter", miterLimit: 10, lineDashOffset: 0, globalAlpha: 1,
    globalCompositeOperation: "source-over", shadowBlur: 0, shadowColor: "transparent",
    shadowOffsetX: 0, shadowOffsetY: 0, font: "10px sans-serif", textAlign: "start",
    textBaseline: "alphabetic", direction: "ltr", filter: "none",
    imageSmoothingEnabled: true, imageSmoothingQuality: "low",

    /* Une vraie toile empile TOUT l'état, pas seulement la matrice. `ecran()`
       atténue par `globalAlpha *= …` entre un `save` et un `restore` : sans
       cette pile, l'atténuation du premier écran se multiplierait dans le
       second et le fondu mesuré serait un cumul. */
    save(){ pile.push({ M: M.slice(), a: c.globalAlpha, f: c.fillStyle,
                        s: c.strokeStyle, w: c.lineWidth, p: c.font }); },
    restore(){ const e = pile.pop(); if(!e) return;
               M = e.M; c.globalAlpha = e.a; c.fillStyle = e.f;
               c.strokeStyle = e.s; c.lineWidth = e.w; c.font = e.p; },
    translate(x, y){ M = mul(M, [1, 0, 0, 1, x, y]); },
    rotate(a){ M = mul(M, [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]); },
    scale(x, y){ M = mul(M, [x, 0, 0, y, 0, 0]); },
    transform(a, b, d, e, f, g){ M = mul(M, [a, b, d, e, f, g]); },
    setTransform(a, b, d, e, f, g){ M = [a, b, d, e, f, g]; },
    resetTransform(){ M = [1, 0, 0, 1, 0, 0]; },
    getTransform(){ return { a:M[0], b:M[1], c:M[2], d:M[3], e:M[4], f:M[5] }; },

    beginPath(){ chemin = []; },
    closePath(){},
    moveTo(x, y){ const p = pt(x, y); chemin.push(p); note("moveTo", [p], { brut: [[x, y]] }); },
    lineTo(x, y){ const p = pt(x, y); chemin.push(p); note("lineTo", [p], { brut: [[x, y]] }); },
    fill(){   note("fill",   [], Object.assign({ chemin: chemin.slice() }, encre())); },
    stroke(){ note("stroke", [], Object.assign({ chemin: chemin.slice() }, trait())); },
    clip(){   note("clip",   [], { chemin: chemin.slice() }); },
    arcTo(x1, y1, x2, y2){ note("arcTo", [pt(x1, y1), pt(x2, y2)]); },
    quadraticCurveTo(a, b, x, y){ note("quadraticCurveTo", [pt(a, b), pt(x, y)]); },
    bezierCurveTo(a, b, d, e, x, y){ note("bezierCurveTo", [pt(a, b), pt(d, e), pt(x, y)]); },
    /* Un arc n'est relevé que par son CENTRE, avec son rayon à côté : une lueur
       radiale déborde légitimement de son cadre. */
    arc(x, y, r){ const p = pt(x, y); chemin.push(p);
                  note("arc", [p], { rayon: r, brut: [[x, y]], rBrut: r }); },
    ellipse(x, y, rx, ry){ note("ellipse", [pt(x, y)], { rayon: Math.max(rx, ry) }); },
    rect(x, y, w, h){ note("rect", boite(x, y, w, h), { pave: true, brut: [[x, y], [x+w, y+h]] }); },
    roundRect(x, y, w, h){ note("roundRect", boite(x, y, w, h), { pave: true }); },
    fillRect(x, y, w, h){ note("fillRect", boite(x, y, w, h),
                               Object.assign({ pave: true, brut: [[x, y], [x+w, y+h]] }, encre())); },
    strokeRect(x, y, w, h){ note("strokeRect", boite(x, y, w, h), { pave: true }); },
    clearRect(x, y, w, h){ note("clearRect", boite(x, y, w, h),
                                { pave: true, brut: [[x, y], [x+w, y+h]] }); },
    fillText(t, x, y){ note("fillText", [pt(x, y)],
                            { texte: String(t), corps: taille(), brut: [[x, y]] }); },
    strokeText(t, x, y){ note("strokeText", [pt(x, y)], { texte: String(t), corps: taille() }); },
    /* La destination d'un `drawImage` est le rectangle donné, PASSÉ PAR LA
       MATRICE COURANTE. C'est exactement le parallélogramme sur lequel la
       toile hors champ est posée — donc l'approximation affine elle-même. */
    drawImage(im, x, y, w, h){
      const X = x || 0, Y = y || 0, L = w === undefined ? 1 : w, Ht = h === undefined ? 1 : h;
      note("drawImage", boite(X, Y, L, Ht), { source: im });
    },
    measureText(t){
      const s = taille();
      return { width: String(t).length * s * 0.55, actualBoundingBoxAscent: s * 0.72,
               actualBoundingBoxDescent: s * 0.21, actualBoundingBoxLeft: 0,
               actualBoundingBoxRight: String(t).length * s * 0.55 };
    },
    createLinearGradient: degrade, createRadialGradient: degrade, createConicGradient: degrade,
    createPattern(){ return null; },
    setLineDash(){}, getLineDash(){ return []; },
    isPointInPath(){ return false; }, isPointInStroke(){ return false; },
  };
  return c;
}

/* La toile hors champ. Le module ne touche pas à `document` : il appelle
   `e.fabriqueToile()`. On lui rend un canevas dont le contexte est un second
   enregistreur — c'est là que le texte des écrans est réellement écrit, et
   c'est le seul endroit d'où on peut le lire. */
function fabriqueToile(){
  const traces = [];
  const t = { traces, larg: 0, haut: 0, ctx: null };
  const c = {
    get width(){ return t.larg; },  set width(v){ t.larg = v; },
    get height(){ return t.haut; }, set height(v){ t.haut = v; },
    getContext(k){
      if(k !== "2d") return null;
      if(!t.ctx) t.ctx = fauxContexte(0, 0, traces);
      return t.ctx;
    },
  };
  t.canvas = c;
  REGISTRE.push(t);
  return c;
}

/* ═══════════════════════════════════════════════ L'ÉTAT DU SALON, ET LE BANC

   Des valeurs choisies pour être RECONNAISSABLES : |p| vaut douze exactement
   (9,6² + 7,2² = 144), donc « 12,0 rₛ » ne peut pas sortir d'un hasard, et
   9,6 comme 7,2 se distinguent de leur norme — un module qui prendrait une
   coordonnée pour le rayon se ferait prendre. */
const P_SALON = [9.6, 0, -7.2];
const RETARD  = 24691.5;

function etatSalon(sup){
  return Object.assign({
    p: P_SALON.slice(), v: [0, 0, 0], apo: 20,
    trace: [[9.6,-7.2], [8,-6], [6,-4], [4,-2], [2,0], [0,2], [-2,4], [-4,6]],
    horloge: 12.5, vise: null,
    t0: Date.UTC(2026, 7, 6, 12, 0, 0),
    tTerre: 123456.75, tBord: 123456.75 - RETARD, facteur: 120,
  }, sup || {});
}

// Un écart choisi ici, donc vérifiable : trois jours, cinq heures, sept minutes.
const DEPUIS = { j: 3, h: 5, mn: 7 };
const ARRIVEE = () => new Date(Date.now()
  - ((DEPUIS.j*86400 + DEPUIS.h*3600 + DEPUIS.mn*60) + 30) * 1000).toISOString();

// La dilatation. Une vraie fonction du rayon, pas une constante : c'est ce qui
// permet de voir si le module lui passe bien |p| et non p[0] ou autre chose.
const cadenceVraie = r => Math.sqrt(Math.max(0, 1 - 1.5/r));

const CONTRAT = new Set(["M", "oeil", "salon", "vaisseau", "telescope", "postes",
                         "lumen", "destination", "quete", "len", "occulte",
                         "cadence", "T", "remplit", "virgule", "tempsFr",
                         "LOCALE", "fabriqueToile"]);

/* Un tir. `vue` porte l'œil et la direction du regard ; tout le reste a un
   défaut qu'on peut écraser. Le temps avance d'une seconde entre deux tirs,
   pour que le cache ne fasse pas passer le second pour le premier — sauf
   quand c'est justement le cache qu'on mesure (`gele`). */
function rend(ECRANS, vue, o){
  o = o || {};
  const W = o.W === undefined ? 1440 : o.W;
  const H = o.H === undefined ?  900 : o.H;
  if(!o.gele) TEMPS += 1000;
  for(const t of REGISTRE) t.traces.length = 0;

  const R = repere(vue.av);
  const M = o.M || matrice(vue.oeil, R, W, H);
  const traces = [], horsContrat = new Set();
  const ctx = fauxContexte(W, H, traces);
  const salon = o.salon || etatSalon();
  const POSTE_LUMEN = o.posteLumen || { id: "lumen", c: [-1.4, 1.1, -1.9], d: [0.2, 0.2, 0.2] };
  const appelsCadence = [], appelsLen = [];

  const base = {
    M, oeil: vue.oeil, salon, vaisseau: VAISSEAU,
    telescope: VAISSEAU.TELESCOPE,
    postes: { POSTES: VAISSEAU.POSTES, POSTE_LUMEN },
    lumen: o.lumen || [1.9, 1.35, -0.7],
    destination: { nom: "⟦DESTINATION⟧", arrivee: o.arrivee || ARRIVEE() },
    quete: o.quete || { QUETE: [{ id: "a-lumen" }], iQuete: 0, actif: false, finie: false },
    len: o.len ? (v => { appelsLen.push(v.slice()); return o.len(v); })
               : (v => { appelsLen.push(v.slice()); return norme(v); }),
    cadence: r => { appelsCadence.push(r); return cadenceVraie(r); },
    /* Des jetons, pas des phrases : on reconnaît un libellé par sa CLÉ. Le jour
       où « SUR TERRE » devient autre chose, ou qu'on lit la page en anglais,
       rien ne bouge ici. */
    T: cle => "⟦CLE " + String(cle) + "⟧",
    remplit: (cle, vals) => "⟦REMPLI " + String(cle) + " " + JSON.stringify(vals) + "⟧",
    virgule: s => "«" + String(s).replace(".", ",") + "»",
    tempsFr: s => "⟦TEMPS " + s + "⟧",
    LOCALE: () => o.locale || "fr-FR",
    fabriqueToile,
  };
  /* `e.occulte` est au contrat mais le contrat dit qu'il n'est JAMAIS lu ici —
     on est dans une pièce éclairée, le trou noir ne passe pas entre l'œil et
     une cloison à quatre mètres. Un piège plutôt qu'une valeur : s'il était
     lu, la moindre occultation deviendrait une dépendance invisible. */
  let occulteLu = false;
  Object.defineProperty(base, "occulte", {
    enumerable: true,
    get(){ occulteLu = true; return () => 1; },
  });

  const e = new Proxy(base, {
    get(cible, cle){
      if(typeof cle === "string" && !CONTRAT.has(cle)) horsContrat.add(cle);
      return cible[cle];
    },
  });

  let retour, erreur = null;
  try { retour = ECRANS.dessine(ctx, W, H, e); }
  catch(err){ erreur = err; }

  const toiles = REGISTRE.map(t => ({
    larg: t.larg, haut: t.haut, traces: t.traces.slice(),
    textes: t.traces.filter(x => x.texte !== undefined).map(x => x.texte),
    rasters: t.traces.filter(x => x.op === "clearRect").length,
  }));
  return {
    W, H, R, M, oeil: vue.oeil, traces, retour, erreur, horsContrat, occulteLu,
    salon, toiles, appelsCadence, appelsLen,
    textes: traces.filter(t => t.texte !== undefined).map(t => t.texte),
    tousTextes: [].concat(...toiles.map(t => t.textes),
                          traces.filter(t => t.texte !== undefined).map(t => t.texte)),
    points: [].concat(...traces.map(t => t.pts)),
  };
}

/* Ce qui a réellement été POSÉ. Un écran laisse, dans cet ordre : la lueur
   (un `fillRect` à dégradé), le contour, la découpe à quatre points, puis
   l'unique `drawImage` qui pose la toile. On les recoud ici. */
function poses(res){
  const out = [];
  let decoupe = null, lueur = null;
  for(const t of res.traces){
    if(t.op === "fillRect" && t.stops) lueur = t;
    if(t.op === "clip" && t.chemin && t.chemin.length === 4) decoupe = t.chemin;
    if(t.op === "drawImage"){
      out.push({ quad: decoupe, para: t.pts, alpha: t.alpha, lueur });
      decoupe = null; lueur = null;
    }
  }
  return out;
}

/* ══════════════════════════ 1. LE GARDE-FOU : LA MESURE A-T-ELLE EU LIEU ?  (8)

   Le piège que ce groupe existe pour éviter : un faux contexte qui n'intercepte
   pas la bonne méthode, ou un module qui sort par une porte de côté, laissent
   une récolte VIDE. Tous les contrôles suivants deviennent alors des « rien de
   faux n'a été vu », c'est-à-dire du vert sur du néant. On ne se contente donc
   pas de constater : on exige une récolte, et l'on s'arrête net si elle manque. */
const VUE_FACE = { nom: "debout au milieu, face à la baie", oeil: [0, 1.62, 1.20], av: [0, 0, -1] };
const VUE_BIAIS = { nom: "à bâbord, regard oblique", oeil: [-1.55, 1.31, 0.55], av: [0.22, 0.04, -1] };

groupe("Le garde-fou : la mesure a bien eu lieu");
{
  const res = rend(ECR, VUE_FACE);
  if(res.erreur)
    stop("le dessin a levé une exception — RIEN N'A ÉTÉ MESURÉ", [
      res.erreur.name + " : " + res.erreur.message,
      ...(res.erreur.stack || "").split("\n").slice(1, 4).map(l => l.trim()),
      "",
      "Tant que `dessine` explose, aucun contrôle de ce fichier ne veut rien dire.",
    ]);
  const p = poses(res);
  if(p.length === 0 || res.toiles.length === 0 || res.tousTextes.length < 6)
    stop("le faux contexte n'a presque rien enregistré — JE REFUSE DE CONCLURE", [
      p.length + " écran(s) posé(s), " + res.toiles.length + " toile(s) hors champ, "
        + res.tousTextes.length + " textes, " + res.traces.length + " tracés.",
      "Depuis le milieu de la pièce, face à la baie, les deux dalles sont",
      "franchement visibles : une récolte vide veut dire que le module dessine",
      "par une méthode que ce contexte n'intercepte pas, ou qu'il ne dessine",
      "plus. Dans les deux cas, un « tout passe » serait un mensonge.",
    ]);

  ok("depuis le milieu de la pièce, les deux dalles sont posées", p.length === 2,
     "2 écrans", p.length + " écran(s)",
     "c'est la situation la plus banale du jeu : si elle ne donne pas deux"
     + " écrans, tout ce qui suit mesure autre chose que ce qu'on croit");
  ok("chacune a sa toile hors champ", res.toiles.length === 2, "2 toiles",
     res.toiles.length + " toile(s)");
  ok("et du texte a bien été écrit dedans",
     res.toiles.every(t => t.textes.length >= 3),
     "≥ 3 textes par toile", res.toiles.map(t => t.textes.length).join(" et "));
  ok("aucune coordonnée n'est NaN ni infinie",
     res.points.every(q => Number.isFinite(q[0]) && Number.isFinite(q[1])),
     "toutes finies", res.points.length + " points relevés",
     "une seule coordonnée NaN et le chemin entier disparaît sans un mot");
  ok("il rend le nombre d'écrans, pas un booléen", typeof res.retour === "number",
     "un nombre", typeof res.retour + " (" + JSON.stringify(res.retour) + ")");
  ok("il ne lit rien hors du contrat", res.horsContrat.size === 0, "aucune clé",
     res.horsContrat.size ? [...res.horsContrat].join(", ") : "aucune",
     "une lecture hors contrat est une dépendance cachée : elle casse le jour"
     + " où l'appelant change, sans que personne ne l'ait touchée");
  ok("et il ne lit PAS `e.occulte`", res.occulteLu === false, "jamais lu",
     res.occulteLu ? "lu au moins une fois" : "jamais",
     "le contrat le dit : la pièce est éclairée, le trou noir ne passe pas entre"
     + " l'œil et une cloison à quatre mètres. Les deux occultations qui comptent"
     + " sont géométriques et calculées dans `ecran()`");
  ok("il n'a besoin ni du DOM ni de WebGL", true, "aucun accès",
     "chargé avec `document` indéfini",
     "le module a été évalué et appelé avec `document` indéfini et un faux"
     + " `window` : une dépendance oubliée lèverait ici plutôt que de marcher"
     + " dans la page et de casser en contrôle");
}

/* ═══════════════════════════ 2. LA PROJECTION, CONTRE UNE CAMÉRA À STÉNOPÉ  (7)

   `ECRANS.projette` est le seul morceau de ce module qu'on puisse éprouver
   point par point. On lui donne une matrice qu'on a construite, et l'on
   confronte son résultat à une projection calculée SANS matrice, par la
   définition du sténopé. Les deux chemins n'ont rien en commun : si l'un se
   trompe d'une convention — colonnes contre lignes, y vers le haut contre y
   vers le bas, aspect au numérateur — l'écart se voit tout de suite. */
function controleProjection(ECRANS){
  const W = 1287, H = 733;                  // ni carré, ni un format connu
  const oeil = [-0.83, 1.44, 0.91];
  const R = repere([0.31, -0.12, -1]);      // un regard oblique, pas un axe
  const M = matrice(oeil, R, W, H);

  // Des points pris partout dans la pièce, aucun sur un axe.
  const echantillons = [];
  for(const x of [-4.7, -1.3, 0.4, 3.9])
    for(const y of [-0.4, 0.7, 1.9, 3.1])
      for(const z of [-3.6, -1.1, 2.7])
        echantillons.push([x, y, z]);

  let pire = 0, ou = "", muet = null, refuses = 0;
  for(const p of echantillons){
    const vrai = stenope(p, oeil, R, W, H);
    const eu = ECRANS.projette(p, M, { W, H });
    if(!vrai || vrai[2] < 0.5){ if(eu) refuses++; continue; }   // trop près du plan : à part
    if(!eu){ muet = "[" + p + "] à " + vrai[2].toFixed(2) + " m devant l'œil rend null"; break; }
    const d = Math.hypot(eu[0] - vrai[0], eu[1] - vrai[1]);
    if(d > pire){ pire = d; ou = "[" + p + "]"; }
  }
  ok("quarante-huit points de la pièce, au pixel près",
     !muet && pire < 1e-6, "écart nul", muet ? muet : pire.toExponential(2) + " px en " + ou,
     "l'arbitre est un sténopé calculé sans aucune matrice — quatre produits"
     + " scalaires. Si `projette` recopiait la page au lieu de calculer, la"
     + " matrice construite ici ne lui irait pas");

  // La taille de l'image doit VRAIMENT servir : la même scène sur deux écrans.
  {
    const A = ECRANS.projette([2.2, 1.1, -3.0], M, { W, H });
    const B = ECRANS.projette([2.2, 1.1, -3.0], M, { W: 2*W, H: 2*H });
    ok("le pixel suit la taille de l'image donnée",
       A && B && Math.abs(B[0] - 2*A[0]) < 1e-9 && Math.abs(B[1] - 2*A[1]) < 1e-9,
       "doublée", A && B ? "[" + A.map(v => v.toFixed(1)) + "] → ["
                            + B.map(v => v.toFixed(1)) + "]" : "null",
       "`taille` est un argument, pas un décor : c'est ce qui permet à la page"
       + " de projeter dans une toile redimensionnée sans rien changer d'autre");
  }

  // Derrière le plan de coupure : `null`, et pas un pixel plausible.
  {
    const derriere = [];
    for(let d = 0.05; d <= 12; d += 0.37)
      derriere.push([oeil[0] - R.av[0]*d, oeil[1] - R.av[1]*d, oeil[2] - R.av[2]*d]);
    const fautifs = derriere.filter(p => ECRANS.projette(p, M, { W, H }) !== null);
    ok("tout ce qui est derrière l'œil rend null", fautifs.length === 0,
       "0 sur " + derriere.length, fautifs.length + " projetés quand même",
       "sans ce refus, un point derrière la caméra ressort DEVANT, symétrique"
       + " par rapport au point de fuite : un écran s'étale alors sur l'image");

    const devant = [];
    for(let d = 0.5; d <= 12; d += 0.37)
      devant.push([oeil[0] + R.av[0]*d + 0.2, oeil[1] + R.av[1]*d, oeil[2] + R.av[2]*d]);
    const perdus = devant.filter(p => ECRANS.projette(p, M, { W, H }) === null);
    ok("et rien de ce qui est devant n'est refusé", perdus.length === 0,
       "0 sur " + devant.length, perdus.length + " refusés",
       "un plan de coupure trop gourmand ferait clignoter les écrans quand on"
       + " s'en approche — le défaut est invisible tant qu'on reste au milieu");

    ok("la coupure se joue à moins de dix centimètres de l'œil", refuses === 0,
       "aucun point à moins de 0,5 m devant l'œil n'est accepté à tort",
       refuses + " acceptés dans la zone réservée",
       "on ne mesure pas la valeur exacte du plan — c'est un détail — mais qu'il"
       + " reste collé à l'œil et ne mange pas la pièce");
  }

  // Le centre de l'image, et le sens des axes : deux erreurs classiques.
  {
    const devant = [oeil[0] + R.av[0]*3, oeil[1] + R.av[1]*3, oeil[2] + R.av[2]*3];
    const q = ECRANS.projette(devant, M, { W, H });
    ok("un point droit devant tombe au centre de l'image",
       q && Math.abs(q[0] - W/2) < 1e-6 && Math.abs(q[1] - H/2) < 1e-6,
       "(" + (W/2) + ", " + (H/2) + ")",
       q ? "(" + q[0].toFixed(3) + ", " + q[1].toFixed(3) + ")" : "null");

    const haut = [devant[0] + R.ht[0], devant[1] + R.ht[1], devant[2] + R.ht[2]];
    const droite = [devant[0] + R.dr[0], devant[1] + R.dr[1], devant[2] + R.dr[2]];
    const qh = ECRANS.projette(haut, M, { W, H }), qd = ECRANS.projette(droite, M, { W, H });
    ok("le haut du monde va vers le haut de l'image, la droite vers la droite",
       qh && qd && qh[1] < H/2 && qd[0] > W/2, "y plus petit, x plus grand",
       qh && qd ? "y = " + qh[1].toFixed(0) + " et x = " + qd[0].toFixed(0) : "null",
       "en pixels l'axe vertical descend, en NDC il monte : c'est l'inversion"
       + " qu'on oublie, et elle rend un décor à l'endroit avec des écrans à l'envers");
  }
}
groupe("La projection, contre une caméra à sténopé");
controleProjection(ECR);

/* ═══════════════ 3. LES DALLES SONT-ELLES VRAIMENT SUR LA CLOISON ?  (9)

   Ici on ne lit AUCUNE coordonnée d'`ecrans.js`. On regarde le quadrilatère
   tracé depuis deux points de vue, on renvoie les huit rayons dans la pièce, et
   l'on cherche le plan z où les deux relevés se superposent. Ce plan est une
   mesure, et le rectangle qu'on en tire aussi. On les confronte ensuite à
   `vaisseau.js`, qui sait où sont la cloison, la baie et la hauteur des yeux.

   Un contrôle qui recopierait `g0 = -4.42` approuverait n'importe quel chiffre
   qu'on écrira demain. Celui-ci demande : « est-ce que c'est sur un mur ? ».  */
function dallesVues(ECRANS, vue, W, H){
  const res = rend(ECRANS, vue, { W, H });
  if(res.erreur) return null;
  const p = poses(res);
  if(p.length !== 2) return null;
  return { res, quads: p.map(x => x.quad) };
}
// Le rectangle de la pièce qu'un quadrilatère d'écran désigne, sur le plan z.
const remonte = (quad, res, zw) =>
  quad.map(q => surPlan(res.oeil, rayon(q[0], q[1], res.R, res.W, res.H), zw));

function retrouveDalles(ECRANS){
  const W = 1440, H = 900;
  const A = dallesVues(ECRANS, VUE_FACE, W, H);
  const B = dallesVues(ECRANS, VUE_BIAIS, W, H);
  if(!A || !B) return null;
  // Les deux vues nomment les dalles dans le même ordre si on les trie par
  // abscisse ; on prend un plan d'essai quelconque pour ce tri.
  const trie = (v, zw) => v.quads.slice().sort((p, q) =>
    remonte(p, v.res, zw)[0][0] - remonte(q, v.res, zw)[0][0]);
  const ecart = zw => {
    const a = trie(A, zw), b = trie(B, zw);
    let m = 0;
    for(let i = 0; i < 2; i++){
      const ra = remonte(a[i], A.res, zw), rb = remonte(b[i], B.res, zw);
      for(let k = 0; k < 4; k++) m = Math.max(m, dist(ra[k], rb[k]));
    }
    return m;
  };
  // Recherche ternaire : l'écart est nul au vrai plan et croît de part et
  // d'autre. Aucune valeur de z n'est écrite, elle est trouvée.
  let lo = -VAISSEAU.P/2 - 1.5, hi = -VAISSEAU.P/2 + 3.0;
  for(let i = 0; i < 300; i++){
    const p = lo + (hi - lo)/3, q = hi - (hi - lo)/3;
    if(ecart(p) < ecart(q)) hi = q; else lo = p;
  }
  const zw = (lo + hi)/2;
  const a = trie(A, zw);
  return { zw, residu: ecart(zw), dalles: a.map(q => remonte(q, A.res, zw)) };
}

let DALLES = null;
function controleGeometrie(ECRANS){
  const t = retrouveDalles(ECRANS);
  if(!t){
    ok("les deux dalles se laissent relever depuis deux points de vue", false,
       "2 écrans dans chaque vue", "moins que ça",
       "sans ce relevé, aucun des contrôles de géométrie ne veut rien dire");
    return null;
  }
  const { zw, residu, dalles } = t;
  const nom = ["dalle de bâbord", "dalle de tribord"];

  ok("le même rectangle est retrouvé depuis deux points de vue", residu < 1e-6,
     "< 1 µm", residu.toExponential(2) + " m",
     "c'est ce qui prouve que les dalles sont POSÉES dans la pièce et non"
     + " peintes par-dessus : un panneau d'interface ne se recouperait pas");

  ok("elles sont sur la cloison du fond, pas en l'air",
     Math.abs(zw + VAISSEAU.P/2) < 0.05,
     "à moins de 5 cm de z = " + (-VAISSEAU.P/2).toFixed(3) + " m",
     zw.toFixed(4) + " m, soit " + ((zw + VAISSEAU.P/2)*1000).toFixed(0) + " mm en avant",
     "la profondeur vient de `vaisseau.js` ; le plan mesuré vient du dessin. Rien"
     + " ne les oblige à coïncider sinon le fait que les écrans y soient plaqués");

  for(let i = 0; i < 2; i++){
    const d = dalles[i];
    const larg = dist(d[0], d[1]), haut = dist(d[0], d[3]);
    const larg2 = dist(d[3], d[2]), haut2 = dist(d[1], d[2]);
    const u = norm(moins(d[1], d[0])), v = norm(moins(d[3], d[0]));
    ok(nom[i] + " : c'est un rectangle",
       Math.abs(larg - larg2) < 1e-6 && Math.abs(haut - haut2) < 1e-6
         && Math.abs(dot(u, v)) < 1e-6,
       "côtés opposés égaux, angles droits",
       larg.toFixed(4) + "×" + haut.toFixed(4) + " m, cosinus "
         + Math.abs(dot(u, v)).toExponential(1));
  }

  const bornes = dalles.map(d => ({
    x0: Math.min(...d.map(p => p[0])), x1: Math.max(...d.map(p => p[0])),
    y0: Math.min(...d.map(p => p[1])), y1: Math.max(...d.map(p => p[1])),
  }));

  ok("les deux dalles ont la même taille",
     Math.abs((bornes[0].x1-bornes[0].x0) - (bornes[1].x1-bornes[1].x0)) < 1e-6 &&
     Math.abs((bornes[0].y1-bornes[0].y0) - (bornes[1].y1-bornes[1].y0)) < 1e-6,
     "identiques",
     bornes.map(b => (b.x1-b.x0).toFixed(2) + "×" + (b.y1-b.y0).toFixed(2)).join(" et "),
     "deux instruments du même bord, à quelques mètres l'un de l'autre : une"
     + " différence de taille se lirait comme une différence d'importance");

  ok("elles tiennent dans la coque",
     bornes.every(b => b.x0 >= -VAISSEAU.L/2 && b.x1 <= VAISSEAU.L/2
                    && b.y0 >= VAISSEAU.FOSSE && b.y1 <= VAISSEAU.H),
     "dans " + (-VAISSEAU.L/2) + "…" + (VAISSEAU.L/2) + " m en x, "
       + VAISSEAU.FOSSE + "…" + VAISSEAU.H + " m en y",
     bornes.map(b => "x " + b.x0.toFixed(2) + "…" + b.x1.toFixed(2)
                   + ", y " + b.y0.toFixed(2) + "…" + b.y1.toFixed(2)).join(" ; "));

  const hauteur = bornes.map(b => (b.y0 + b.y1)/2);
  ok("elles sont à hauteur d'yeux",
     hauteur.every(y => Math.abs(y - VAISSEAU.OEIL) < 0.5),
     "centre à moins de 50 cm de " + VAISSEAU.OEIL + " m",
     hauteur.map(y => y.toFixed(2) + " m").join(" et "),
     "la hauteur des yeux est déclarée par `vaisseau.js`, pas devinée ici : un"
     + " écran qu'on lit en levant la tête n'est pas un écran de bord");

  /* ═══ LE CONTRÔLE QUI A TROUVÉ QUELQUE CHOSE.

     La baie est un TROU dans la cloison du fond : entre ±BAIE.x/2 et entre
     BAIE.bas et BAIE.haut, il n'y a pas de coque, il y a le dehors. Le calque
     à deux dimensions n'a pas de tampon de profondeur, donc tout ce qu'on y
     peint devant l'ouverture se retrouve posé sur le trou noir.

     Une dalle « plaquée sur la cloison » — ce sont les mots de l'en-tête du
     module — doit donc rester sur la partie PLEINE de la cloison. La géométrie
     de l'ouverture vient de `vaisseau.js` ; celle des dalles vient d'être
     mesurée. Rien n'est recopié de part ni d'autre.                         */
  const B = VAISSEAU.BAIE, bx = B.x/2;
  const empiete = bornes.map(b => Math.max(0,
      Math.min(b.x1, bx) - Math.max(b.x0, -bx)) *
      (Math.min(b.y1, B.haut) > Math.max(b.y0, B.bas) ? 1 : 0));
  const total = empiete.reduce((a, b) => a + b, 0);
  ok("aucune dalle ne déborde sur l'ouverture de la baie", total < 1e-6,
     "0 cm de recouvrement",
     empiete.map((m, i) => nom[i] + " " + (m*100).toFixed(0) + " cm").join(", ")
       + (total > 0 ? " — soit "
          + (100*empiete[0]/(bornes[0].x1 - bornes[0].x0)).toFixed(0)
          + " % de la largeur d'un écran" : ""),
     "l'ouverture va de " + (-bx) + " à " + bx + " m et de " + B.bas + " à " + B.haut
     + " m : ce qui y est peint est peint DEVANT le trou noir, pas sur du métal");

  return dalles;
}
groupe("Les dalles sont-elles vraiment sur la cloison ?");
DALLES = controleGeometrie(ECR);
if(!DALLES)
  stop("la géométrie des écrans n'a pas pu être relevée — J'ARRÊTE LÀ", [
    "Les contrôles qui suivent projettent eux-mêmes les dalles pour les",
    "confronter au dessin. Sans rectangle de référence, ils compareraient",
    "du vide à du vide.",
  ]);

/* ═══════════════════════ 4. ELLES SUIVENT LE REGARD, AU PIXEL PRÈS  (5)

   Le rectangle mesuré au groupe précédent devient l'étalon : on le projette
   nous-mêmes, depuis des points de vue quelconques, et l'on exige que le
   quadrilatère tracé par le module tombe dessus. C'est la promesse de l'en-tête
   — « projetés par la MÊME matrice que l'habitacle », « on ne les lit pas
   par-dessus la scène, on les lit dedans » — transformée en mesure. */
const VUES = [
  VUE_FACE,
  VUE_BIAIS,
  { nom: "accroupi dans la fosse", oeil: [0.6, 0.42, -2.1], av: [-0.1, 0.25, -1] },
  { nom: "collé à bâbord", oeil: [-4.1, 1.70, -1.4], av: [0.35, -0.15, -1] },
  { nom: "au fond de la salle", oeil: [1.2, 1.62, 3.1], av: [-0.12, -0.02, -1] },
  { nom: "de trois quarts, vers tribord", oeil: [-2.0, 1.55, -0.9], av: [0.75, 0.05, -1] },
];

function controlePose(ECRANS, dalles){
  let pire = 0, ou = "", vus = 0;
  for(const vue of VUES){
    const res = rend(ECRANS, vue);
    if(res.erreur) continue;
    for(const p of poses(res)){
      // à quelle dalle ce quadrilatère répond-il ?
      let meilleure = null, dmin = 1e9;
      for(const d of dalles){
        const proj = d.map(q => stenope(q, res.oeil, res.R, res.W, res.H));
        if(proj.some(q => !q)) continue;
        const e = Math.max(...proj.map((q, i) =>
          Math.hypot(q[0] - p.quad[i][0], q[1] - p.quad[i][1])));
        if(e < dmin){ dmin = e; meilleure = d; }
      }
      vus++;
      if(dmin > pire){ pire = dmin; ou = vue.nom; }
    }
  }
  ok("le quadrilatère tracé est la projection du rectangle mesuré",
     vus > 0 && pire < 1e-6, "écart nul",
     vus + " dalles vues sur six points de vue, pire écart "
       + pire.toExponential(2) + " px (" + ou + ")",
     "la projection de référence est faite ici, par le sténopé, à partir d'un"
     + " rectangle qui a été MESURÉ et non recopié : deux chemins indépendants"
     + " qui doivent tomber au même pixel");

  /* Une toile 2D ne sait faire que des transformations AFFINES : elle envoie un
     rectangle sur un PARALLÉLOGRAMME. L'erreur commise est donc exactement
     l'écart entre le vrai quatrième coin et celui du parallélogramme, et on la
     calcule ici sans rien demander au module. */
  function gauchissement(d, res){
    const q = d.map(p => stenope(p, res.oeil, res.R, res.W, res.H));
    if(q.some(p => !p)) return null;
    const affine = [q[1][0] + q[3][0] - q[0][0], q[1][1] + q[3][1] - q[0][1]];
    const diag = Math.hypot(q[2][0] - q[0][0], q[2][1] - q[0][1]) || 1;
    return Math.hypot(q[2][0] - affine[0], q[2][1] - affine[1]) / diag;
  }

  let pireG = 0, ouG = "";
  for(const vue of VUES){
    const res = rend(ECRANS, vue);
    if(res.erreur) continue;
    for(const p of poses(res)){
      let meilleure = null, dmin = 1e9;
      for(const d of dalles){
        const proj = d.map(q => stenope(q, res.oeil, res.R, res.W, res.H));
        if(proj.some(q => !q)) continue;
        const e = Math.max(...proj.map((q, i) =>
          Math.hypot(q[0] - p.quad[i][0], q[1] - p.quad[i][1])));
        if(e < dmin){ dmin = e; meilleure = d; }
      }
      if(!meilleure) continue;
      const g = gauchissement(meilleure, res);
      if(g !== null && g > pireG){ pireG = g; ouG = vue.nom; }
    }
  }
  ok("là où elles sont dessinées, l'erreur d'affine reste tenue", pireG < 0.20,
     "< 20 % de la diagonale", (pireG*100).toFixed(1) + " % (" + ouG + ")",
     "mesuré ici : le quatrième coin vrai contre celui du parallélogramme. C'est"
     + " le défaut qu'on accepte de commettre, et il doit rester petit là où"
     + " l'écran s'affiche — sinon le cadre suit la paroi et le contenu non");

  // Le parallélogramme réellement posé doit être celui qu'on croit : trois
  // coins vrais, le quatrième déduit. Sinon l'écriture serait redressée de
  // travers dans un cadre juste.
  let pireP = 0;
  for(const vue of VUES){
    const res = rend(ECRANS, vue);
    if(res.erreur) continue;
    for(const p of poses(res)){
      const attendu = [p.quad[0], p.quad[1],
                       [p.quad[1][0] + p.quad[3][0] - p.quad[0][0],
                        p.quad[1][1] + p.quad[3][1] - p.quad[0][1]], p.quad[3]];
      for(let i = 0; i < 4; i++)
        pireP = Math.max(pireP, Math.hypot(p.para[i][0] - attendu[i][0],
                                           p.para[i][1] - attendu[i][1]));
    }
  }
  ok("l'affine qui redresse l'écriture s'appuie sur trois coins du cadre",
     pireP < 1e-9, "écart nul", pireP.toExponential(2) + " px",
     "(0,0)→a, (1,0)→b, (0,1)→d : le texte tombe alors dans le cadre tracé,"
     + " ce qui est la moitié de l'illusion");

  // Chaque écran est posé exactement une fois par image.
  {
    const res = rend(ECRANS, VUE_FACE);
    const pp = poses(res);
    const centres = pp.map(p => p.quad.reduce((a, q) => [a[0]+q[0]/4, a[1]+q[1]/4], [0, 0]));
    const distincts = centres.length < 2
      || Math.hypot(centres[0][0]-centres[1][0], centres[0][1]-centres[1][1]) > 10;
    ok("les deux dalles sont deux dalles, pas deux fois la même", distincts,
       "deux centres distincts",
       centres.map(q => "(" + q[0].toFixed(0) + ", " + q[1].toFixed(0) + ")").join(" et "));
  }

  // Une seule image posée par écran : c'est tout l'intérêt du cache.
  {
    const res = rend(ECRANS, VUE_FACE);
    const images = res.traces.filter(t => t.op === "drawImage").length;
    ok("une seule image posée par écran et par passe", images === 2,
       "2 drawImage", images + " drawImage",
       "si le module reposait le contenu trait par trait sur le calque"
       + " principal, le cache ne servirait plus à rien tout en restant en place");
  }
}
groupe("Elles suivent le regard, au pixel près");
controlePose(ECR, DALLES);

/* ══════════════════════════ 5. LE REFUS DE DESSINER DE BIAIS  (10)

   Le compromis déclaré du module. Il a DEUX garde-fous, et il a fallu les
   séparer pour les éprouver : ce fichier a d'abord exigé « pleine intensité
   jusqu'à quarante-cinq degrés » à trois mètres, et ça tombait — pas parce que
   le module a tort, mais parce que ma consigne en avait un seul en tête.

     · le garde-fou ANGULAIRE, qui éteint une dalle vue de trop biais parce
       qu'un écran plat réel s'y délave aussi. Il ne dépend que de l'angle ;
     · le garde-fou d'ERREUR, qui mesure de combien le quadrilatère projeté
       s'écarte d'un parallélogramme — c'est-à-dire exactement ce qu'une toile
       2D ne saura pas rendre. Il dépend de l'angle ET de la distance, et près
       d'un écran c'est lui qui parle en premier.

   On les éprouve donc séparément : le premier à neuf mètres, où l'erreur
   d'affine ne pèse plus ; le second sur une grille de distances et d'angles,
   contre une erreur que l'on calcule ICI, par le sténopé. */

// Le repère d'une dalle : son centre, sa direction longue, et la normale qui
// rentre dans la pièce.
function repereDalle(dalle){
  const centre = dalle.reduce((a, p) => [a[0]+p[0]/4, a[1]+p[1]/4, a[2]+p[2]/4], [0,0,0]);
  const u = norm(moins(dalle[1], dalle[0]));
  const n = norm(cross(moins(dalle[1], dalle[0]), moins(dalle[3], dalle[0])));
  return { centre, u, dedans: n[2] > 0 ? n : n.map(v => -v) };
}
const oeilAutour = (dalle, deg, d) => {
  const { centre, u, dedans } = repereDalle(dalle), a = deg*Math.PI/180;
  return [centre[0] + d*(Math.sin(a)*u[0] + Math.cos(a)*dedans[0]),
          centre[1] + d*(Math.sin(a)*u[1] + Math.cos(a)*dedans[1]),
          centre[2] + d*(Math.sin(a)*u[2] + Math.cos(a)*dedans[2])];
};

/* Une sonde : on pose l'œil quelque part, on regarde la dalle, et l'on relève
   ce que le module en a fait — plus l'erreur d'affine que NOUS mesurons sur le
   même quadrilatère. Les deux nombres viennent de deux calculs indépendants. */
function sonde(ECRANS, dalle, oeil, vers){
  const res = rend(ECRANS, { nom: "sonde", oeil, av: moins(vers || repereDalle(dalle).centre, oeil) },
                   { gele: true });
  if(res.erreur) return { erreur: res.erreur };
  const q = dalle.map(p => stenope(p, res.oeil, res.R, res.W, res.H));
  let gauchi = null;
  if(!q.some(p => !p)){
    const af = [q[1][0] + q[3][0] - q[0][0], q[1][1] + q[3][1] - q[0][1]];
    const diag = Math.hypot(q[2][0] - q[0][0], q[2][1] - q[0][1]) || 1;
    gauchi = Math.hypot(q[2][0] - af[0], q[2][1] - af[1]) / diag;
  }
  let vu = null;
  for(const p of poses(res))
    if(!q.some(x => !x) && Math.max(...q.map((x, i) =>
        Math.hypot(x[0] - p.quad[i][0], x[1] - p.quad[i][1]))) < 1e-6) vu = p;
  return { pose: !!vu, alpha: vu ? vu.alpha : 0,
           lueur: vu && vu.lueur ? vu.lueur.opacite : 0, gauchi };
}

function controleBiais(ECRANS, dalles){
  const D = dalles[0];
  /* Seize mètres, et il faut dire pourquoi : c'est plus que la diagonale du
     salon, donc une SONDE GÉOMÉTRIQUE et pas une position de jeu. À neuf mètres
     — la plus grande distance atteignable dans la pièce — le garde-fou d'erreur
     mordait encore à quarante-cinq degrés, et le contrôle mesurait alors les
     deux à la fois en croyant n'en mesurer qu'un. Il a commencé par échouer sur
     du code juste, exactement comme le groupe qui l'a précédé.
     Ce que ce balayage-là établit, c'est le SEUIL ANGULAIRE seul. */
  const LOIN = 16;
  const rel = [];
  for(let deg = 0; deg <= 89; deg++) rel.push(
    Object.assign({ deg }, sonde(ECRANS, D, oeilAutour(D, deg, LOIN))));

  ok("de face, la dalle est posée à pleine intensité",
     rel[0].pose && Math.abs(rel[0].alpha - 1) < 1e-9, "opacité 1",
     rel[0].pose ? rel[0].alpha.toFixed(4) : "pas posée");

  const jusqua45 = rel.filter(r => r.deg <= 45);
  ok("jusqu'à quarante-cinq degrés hors axe, elle reste entière",
     jusqua45.every(r => r.pose && r.alpha > 0.999), "opacité 1 partout",
     jusqua45.every(r => r.pose)
       ? "minimum " + Math.min(...jusqua45.map(r => r.alpha)).toFixed(4)
       : "éteinte dès " + (rel.find(r => !r.pose) || {}).deg + "°",
     "sondé à " + LOIN + " m, où l'erreur d'affine mesurée ici reste sous "
     + (100*Math.max(...jusqua45.map(r => r.gauchi || 0))).toFixed(0) + " % : c'est"
     + " donc bien le seuil ANGULAIRE seul qu'on éprouve. Un écran plat réel ne"
     + " se délave qu'assez tard, et l'éteindre plus tôt cacherait ce qu'on"
     + " venait lire");

  // Le refus rasant, à toutes les distances : c'est là qu'il doit être absolu.
  {
    const restent = [];
    for(const d of [1.5, 3, 6, 9, 20])
      for(let deg = 80; deg <= 89; deg++)
        if(sonde(ECRANS, D, oeilAutour(D, deg, d)).pose) restent.push(d + " m / " + deg + "°");
    ok("au-delà de quatre-vingts degrés, elle se tait à toute distance",
       restent.length === 0, "aucune pose sur 50 sondes",
       restent.length ? restent.slice(0, 4).join(", ") : "aucune",
       "une toile 2D n'y sait plus rien rendre de juste : le refus est le seul"
       + " comportement vrai, et c'est aussi ce que fait une dalle réelle");
  }

  const decroit = rel.every((r, i) => i === 0 || r.alpha <= rel[i-1].alpha + 1e-9);
  ok("l'intensité ne fait que baisser quand on tourne", decroit,
     "monotone sur 90 pas", decroit ? "monotone" : "au moins une remontée",
     "une remontée voudrait dire qu'un second critère reprend la main dans le"
     + " mauvais sens : deux lois pour un même effet, ce que la règle 4 interdit");

  /* L'ANGLE EXACT DE L'EXTINCTION, PAR BISSECTION.

     Avec un pas d'un degré on ne mesure pas un fondu, on mesure son
     échantillonnage : la dernière valeur relevée dépend de l'endroit où le pas
     est tombé, et un contrôle d'accord avec lui-même seulement quand le hasard
     coopère est un contrôle qui ment (règle 5). On cherche donc l'angle exact
     où la dalle passe de posée à muette, et l'on regarde ce qu'il en restait
     juste avant : si le fondu est vrai, il n'en reste presque rien. */
  function extinction(d){
    let a = 0, b = 89.999;                          // a posée, b muette
    if(!sonde(ECRANS, D, oeilAutour(D, a, d)).pose) return null;
    if(sonde(ECRANS, D, oeilAutour(D, b, d)).pose) return null;
    for(let i = 0; i < 44; i++){
      const m = (a + b)/2;
      if(sonde(ECRANS, D, oeilAutour(D, m, d)).pose) a = m; else b = m;
    }
    return Object.assign({ angle: a }, sonde(ECRANS, D, oeilAutour(D, a, d)));
  }
  const bordLoin = extinction(LOIN), bordPres = extinction(2.5);

  ok("l'extinction est un fondu, pas un interrupteur",
     bordLoin && bordPres && bordLoin.alpha <= 0.02 && bordPres.alpha <= 0.02,
     "≤ 2 % à l'angle même de l'extinction",
     bordLoin && bordPres
       ? (100*bordLoin.alpha).toFixed(2) + " % à " + bordLoin.angle.toFixed(2)
         + "° (" + LOIN + " m, le seuil angulaire) et "
         + (100*bordPres.alpha).toFixed(2) + " % à "
         + bordPres.angle.toFixed(2) + "° (2,5 m, le seuil d'erreur)"
       : "l'angle d'extinction n'a pas été trouvé",
     "les deux garde-fous s'éteignent chacun par un fondu : ce contrôle vaut"
     + " pour l'un comme pour l'autre, puisqu'il ne regarde que le bord");

  /* L'ANGLE lui-même, et non plus seulement le fondu. L'en-tête du module en
     donne la raison physique : « au-delà de soixante degrés hors axe, un écran
     plat se délave et devient illisible ». On encadre donc le seuil des deux
     côtés — trop tôt, on éteint ce qu'on venait lire ; trop tard, on montre une
     déformation qu'une affine ne sait pas rendre. */
  ok("et il tombe là où une vraie dalle se délave",
     bordLoin && bordLoin.angle >= 60 && bordLoin.angle <= 80,
     "entre 60° et 80° hors axe",
     bordLoin ? bordLoin.angle.toFixed(2) + "°" : "introuvable",
     "mesuré à " + LOIN + " m, donc sans l'autre garde-fou : c'est bien le seuil"
     + " angulaire qu'on encadre, et lui seul");

  /* ═══ LE SECOND DÉFAUT TROUVÉ ICI.

     La lueur que la dalle jette sur la cloison est peinte AVANT l'atténuation,
     dans son propre `save`/`restore`. Elle ne suit donc pas le fondu : elle
     reste à pleine force pendant toute la descente, puis disparaît d'un coup
     avec l'écran. Or c'est la lumière que la dalle ÉMET — une dalle éteinte
     n'éclaire pas le mur. Le fondu soigné du contenu est annulé par une lueur
     qui, elle, fait exactement le saut qu'on voulait éviter.                */
  ok("et la lueur qu'elle jette s'éteint avec elle",
     bordLoin && bordLoin.lueur <= 0.02 * (rel[0].lueur || 1),
     "≤ 2 % de la lueur de face",
     bordLoin ? bordLoin.lueur.toFixed(4) + " au bord contre "
                + rel[0].lueur.toFixed(4) + " de face" : "—",
     "la lueur est la lumière que la dalle émet : à un pour cent d'intensité"
     + " elle ne peut pas éclairer la cloison à plein. Et comme elle s'arrête"
     + " net avec l'écran, c'est elle qui fait le saut qu'on voulait éviter");

  /* ═══ LE SECOND GARDE-FOU, CONTRE UNE ERREUR CALCULÉE ICI.

     L'affine envoie un rectangle sur un parallélogramme, dont les côtés opposés
     sont égaux par définition. L'écart entre le vrai quatrième coin et celui du
     parallélogramme EST l'erreur qu'on commettrait — et on la calcule par le
     sténopé, sans rien demander au module. Reste à vérifier les deux sens : il
     ne dessine jamais ce qu'il déformerait, et il ne refuse pas ce qu'il
     rendrait juste. */
  {
    const bons = [], mauvais = [];
    let pireDessine = 0, ouPire = "";
    for(const d of [1.5, 2, 2.5, 3, 4, 6, 9, 14])
      for(let deg = 0; deg <= 75; deg += 3){
        const s = sonde(ECRANS, D, oeilAutour(D, deg, d));
        if(s.gauchi === null || s.gauchi === undefined) continue;
        if(s.pose && s.gauchi > pireDessine){ pireDessine = s.gauchi; ouPire = d + " m / " + deg + "°"; }
        if(s.gauchi <= 0.08) bons.push(s);
        if(s.gauchi >= 0.45) mauvais.push({ s, ou: d + " m / " + deg + "°" });
      }
    ok("il ne dessine jamais un quadrilatère qu'il déformerait franchement",
       pireDessine < 0.30 && bons.length > 10 && mauvais.length > 5,
       "erreur d'affine < 30 % partout où il dessine",
       (100*pireDessine).toFixed(0) + " % au pire (" + ouPire + "), sur "
       + (bons.length + mauvais.length) + " sondes contrastées",
       "au-delà, le cadre suit la paroi et le contenu non : c'est le défaut"
       + " qu'on refuse de montrer, et la raison d'être de tout le garde-fou");
    const survivants = mauvais.filter(m => m.s.pose);
    ok("et il refuse systématiquement au-delà de quarante-cinq pour cent",
       survivants.length === 0, "0 dessinée sur " + mauvais.length + " sondes gauchies",
       survivants.length ? survivants.slice(0, 3).map(m => m.ou).join(", ") : "aucune");
    const perdus = bons.filter(s => !s.pose);
    ok("il ne refuse pas ce qu'il rendrait juste",
       perdus.length === 0, "0 refusée sur " + bons.length + " sondes fidèles",
       perdus.length + " refusées",
       "un garde-fou trop gourmand éteindrait des écrans parfaitement rendables,"
       + " et ce défaut-là ne se voit pas : on croit simplement qu'il n'y a rien");
  }

  /* ═══ CE QUE LE COMPROMIS COÛTE, EN MÈTRES CARRÉS DE PIÈCE.

     Les écrans existent pour être LUS. Deux garde-fous qui les éteignent sont
     justes chacun de leur côté, mais leur somme se paie en surface habitable :
     depuis quelle part du salon peut-on encore lire ses instruments, en les
     regardant droit ? Ce n'est pas une question de code, c'est une question de
     jeu, et personne ne la posait. On la mesure ici pour qu'elle ait un chiffre. */
  {
    const pasM = 0.35, marge = 0.3;
    let total = 0, lisible = 0, aucune = 0;
    for(let x = -VAISSEAU.L/2 + marge; x <= VAISSEAU.L/2 - marge; x += pasM)
      for(let z = -VAISSEAU.P/2 + marge; z <= VAISSEAU.P/2 - marge; z += pasM){
        const sol = z < VAISSEAU.ZF ? VAISSEAU.FOSSE : 0;
        const oeil = [x, sol + VAISSEAU.OEIL, z];
        total++;
        let vues = 0;
        for(const d of dalles){
          const c = repereDalle(d).centre;
          if(dist(oeil, c) < 0.35) continue;
          if(sonde(ECRANS, d, oeil, c).alpha >= 0.5) vues++;
        }
        if(vues >= 1) lisible++;
        if(vues === 0) aucune++;
      }
    const part = lisible/total;
    /* La barre est basse À DESSEIN. Ce n'est pas un seuil esthétique inventé —
       la bonne valeur, personne ne la connaît et elle se juge à l'œil. C'est un
       fil tendu : il ne se rompt que si les écrans s'éteignent dans la moitié
       du salon, ce qu'un coup de pouce sur l'un des deux seuils ferait sans
       qu'aucun autre contrôle ne bronche. Le CHIFFRE, lui, est la vraie sortie
       de ce contrôle : c'est lui qu'on porte à l'œil d'Hugo. */
    ok("les écrans se lisent depuis une bonne part du salon", part >= 0.40,
       "≥ 40 % du sol", (100*part).toFixed(0) + " % (" + lisible + " points sur "
       + total + ", " + aucune + " sans aucun écran lisible)",
       "on se place au pas de " + pasM + " m sur tout le sol, à hauteur d'yeux, et"
       + " l'on REGARDE la dalle en face — c'est le meilleur cas possible pour le"
       + " joueur. Le reste du salon a ses instruments éteints, et c'est le prix"
       + " des deux garde-fous réunis : un chiffre à montrer, pas un défaut");
  }
}
groupe("Le refus de dessiner de biais");
controleBiais(ECR, DALLES);

/* ═══════════════════ 6. L'ŒIL DERRIÈRE LA CLOISON, ET LE COMPTEUR  (7)

   Le calque 2D n'a pas de tampon de profondeur : rien n'occulte un écran tout
   seul. Vu du dehors du vaisseau, une dalle plaquée sur la cloison du fond
   apparaîtrait donc en transparence à travers la coque. C'est le premier des
   deux garde-fous, et il ne se voit jamais quand il marche.

   Et le compteur : `dessine` rend le NOMBRE d'écrans posés. Un compteur qui
   ment est pire qu'aucun compteur — la page s'en sert pour savoir si la passe
   a servi à quelque chose. */
function controleCloison(ECRANS){
  const dehors = [
    { nom: "devant la baie, en plein espace", oeil: [0, 1.6, -5.4], av: [0, 0, 1] },
    { nom: "de biais, dehors à bâbord", oeil: [-3.2, 1.4, -6.0], av: [0.3, 0.05, 1] },
    { nom: "très loin devant la coque", oeil: [0.4, 2.0, -18], av: [0, -0.02, 1] },
  ];
  for(const vue of dehors){
    const res = rend(ECRANS, vue);
    ok("œil " + vue.nom + " — rien n'est peint",
       !res.erreur && res.retour === 0 && res.traces.length === 0,
       "0 écran, 0 tracé",
       res.erreur ? "exception : " + res.erreur.message
                  : res.retour + " écran(s), " + res.traces.length + " tracés",
       "sans ce garde-fou les écrans se verraient à travers la coque, à"
       + " l'endroit et bien lisibles : le calque 2D ne sait pas qu'il y a un mur");
  }

  // Le compteur, dans toutes les situations, y compris à zéro et à un.
  let faux = null, vus = new Set();
  const situations = VUES.concat(dehors).concat([
    { nom: "rasant la cloison à bâbord", oeil: [-4.42, 1.6, -3.5], av: [0.2, 0, 1] },
    { nom: "le nez sur la dalle", oeil: [-3.61, 1.60, -3.42], av: [0, 0, -1] },
  ]);
  for(const vue of situations){
    const res = rend(ECRANS, vue);
    if(res.erreur){ faux = vue.nom + " : exception"; break; }
    const images = res.traces.filter(t => t.op === "drawImage").length;
    const decoupes = res.traces.filter(t => t.op === "clip").length;
    vus.add(res.retour);
    if(res.retour !== images || res.retour !== decoupes){
      faux = vue.nom + " : rend " + res.retour + ", pose " + images
           + " image(s) et " + decoupes + " découpe(s)";
      break;
    }
  }
  ok("le nombre rendu est le nombre réellement posé", faux === null,
     "compteur = images posées, sur " + situations.length + " situations",
     faux || "accord partout, valeurs vues : " + [...vus].sort().join(", "),
     "un compteur qui ment est pire qu'aucun compteur : la page s'en sert pour"
     + " savoir si la passe des écrans a servi à quelque chose");
  ok("et il descend jusqu'à zéro et monte jusqu'à deux",
     vus.has(0) && vus.has(2), "0 et 2 rencontrés", [...vus].sort().join(", "),
     "un compteur qui ne dirait jamais zéro passerait le contrôle ci-dessus"
     + " sans rien surveiller");

  /* L'anneau de quête dessine sur le calque principal, entre les deux dalles.
     Le contrat dit qu'il ne compte PAS comme un écran — et c'est justement
     quand il est le seul tracé qu'un compteur laxiste se ferait prendre. */
  {
    const res = rend(ECRANS, dehors[0], {
      quete: { QUETE: [{ id: "a-temps" }], iQuete: 0, actif: true, finie: false },
    });
    const anneaux = res.traces.filter(t => t.op === "arc").length;
    ok("l'anneau de quête ne se compte pas comme un écran",
       !res.erreur && res.retour === 0 && anneaux > 0,
       "0 écran alors qu'un anneau est tracé",
       res.erreur ? "exception" : res.retour + " écran(s), " + anneaux + " arcs",
       "il partage la projection de la pièce, pas la famille : il vit dans ce"
       + " module par commodité et le compteur ne doit pas s'y tromper");
  }
}
groupe("L'œil derrière la cloison, et le compteur");
controleCloison(ECR);

/* ══════════════════════ 7. L'ANNEAU SE POSE SUR LE DRONE, PAS SUR SA TRACE  (4)

   Le contrat met en garde par écrit : `e.lumen` est la position du drone À CET
   INSTANT, tandis que `POSTE_LUMEN.c` n'est rafraîchi que lorsqu'on vise. Les
   confondre poserait l'anneau sur la dernière position connue — un halo
   accroché à un endroit vide, ce qui est exactement le contraire de ce qu'un
   repère doit faire. On leur donne donc DEUX positions bien distinctes. */
function controleAnneau(ECRANS){
  const LUMEN = [1.90, 1.35, -0.70];
  const PERIME = { id: "lumen", c: [-3.30, 0.55, 2.60], d: [0.2, 0.2, 0.2] };
  const quete = { QUETE: [{ id: "a-lumen" }], iQuete: 0, actif: true, finie: false };

  const res = rend(ECRANS, VUE_FACE, { quete, lumen: LUMEN, posteLumen: PERIME });
  const arcs = res.traces.filter(t => t.op === "arc");
  const vrai = stenope(LUMEN, res.oeil, res.R, res.W, res.H);
  const vieux = stenope(PERIME.c, res.oeil, res.R, res.W, res.H);
  const surLeDrone = arcs.length > 0 && vrai
    && Math.hypot(arcs[0].pts[0][0] - vrai[0], arcs[0].pts[0][1] - vrai[1]) < 1e-6;

  ok("l'anneau se pose sur la position vive du drone", surLeDrone,
     "au pixel du drone",
     arcs.length === 0 ? "aucun anneau"
       : "à " + (vrai ? Math.hypot(arcs[0].pts[0][0]-vrai[0], arcs[0].pts[0][1]-vrai[1]).toFixed(1)
                      : "?") + " px du drone, "
         + (vieux ? Math.hypot(arcs[0].pts[0][0]-vieux[0], arcs[0].pts[0][1]-vieux[1]).toFixed(1)
                  : "?") + " px de la position périmée",
     "le contrat le dit en toutes lettres : `POSTE_LUMEN.c` n'est réécrit que"
     + " lorsqu'on vise, donc il est périmé dès que le pointeur s'arrête");

  ok("il disparaît quand on vise déjà le drone",
     rend(ECRANS, VUE_FACE, { quete, lumen: LUMEN, posteLumen: PERIME,
                              salon: etatSalon({ vise: PERIME }) })
       .traces.filter(t => t.op === "arc").length === 0,
     "aucun anneau", "—",
     "une fois qu'on a compris, l'insistance devient du bruit");

  /* La comparaison doit se faire par IDENTITÉ, dit le contrat. Un objet de même
     contenu mais distinct est un AUTRE poste : l'anneau doit rester. */
  const jumeau = { id: "lumen", c: PERIME.c.slice(), d: PERIME.d.slice() };
  ok("mais un poste de même contenu n'est pas le même poste",
     rend(ECRANS, VUE_FACE, { quete, lumen: LUMEN, posteLumen: PERIME,
                              salon: etatSalon({ vise: jumeau }) })
       .traces.filter(t => t.op === "arc").length > 0,
     "l'anneau reste", "—",
     "l'égalité de contenu ferait disparaître le repère dès qu'un autre poste"
     + " se trouverait décrit pareil — le contrat impose l'identité");

  ok("quête finie, plus d'anneau",
     rend(ECRANS, VUE_FACE, { quete: { QUETE: [{ id: "a-lumen" }], iQuete: 0,
                                       actif: true, finie: true }, lumen: LUMEN })
       .traces.filter(t => t.op === "arc").length === 0,
     "aucun anneau", "—");
}
groupe("L'anneau se pose sur le drone, pas sur sa trace");
controleAnneau(ECR);

/* ═══════════════════════ 8. CE QUI EST ÉCRIT VIENT DE L'ÉTAT  (9)

   Les écrans sont les seuls objets du vaisseau qui affichent des chiffres. Ce
   groupe demande que chacun soit celui que l'état impose, et que chaque mot
   passe par les fonctions reçues — pas par du français en dur, qui ne parlerait
   pas anglais.

   Le texte est piégé À LA SOURCE : `T` rend « ⟦CLE …⟧ », `virgule` encadre de
   guillemets, `tempsFr` étiquette. On reconnaît donc un libellé par sa CLÉ, et
   un nombre par le chemin qu'il a pris. Un contrôle qui chercherait « SUR
   TERRE » se ferait désactiver à la première relecture de traduction. */
function controleTextes(ECRANS){
  const res = rend(ECRANS, VUE_FACE);
  const tous = res.tousTextes.join(" | ");
  const a = m => tous.includes(m);

  const CLES = ["salon.ecran.position", "salon.ecran.orbite", "salon.ecran.nous",
                "salon.ecran.temps", "salon.ecran.depuis", "salon.ecran.pendant",
                "salon.ecran.terre", "salon.ecran.bord", "u.jourCourt"];
  const manque = CLES.filter(c => !a("⟦CLE " + c + "⟧"));
  ok("les neuf libellés passent par `e.T`", manque.length === 0,
     "toutes les clés", manque.length ? "manquent : " + manque.join(", ") : "toutes vues",
     "y compris `u.jourCourt`, qui vaut « j » en français et « d » en anglais :"
     + " un module qui l'écrirait en dur ferait mentir la moitié anglaise du site");

  const REMPLIS = ["salon.ecran.retard", "salon.ecran.accelere"];
  const manque2 = REMPLIS.filter(c => !a("⟦REMPLI " + c));
  ok("les deux phrases à trous passent par `e.remplit`", manque2.length === 0,
     "les deux", manque2.length ? "manquent : " + manque2.join(", ") : "les deux vues",
     "ce sont les seules phrases du site à mêler du texte et des nombres :"
     + " les assembler à la main ici les rendrait intraduisibles");

  ok("le rayon affiché est bien |p|, passé par `e.len`", a("«12,0» rₛ"),
     "« 12,0 rₛ » via `virgule`",
     a("«12,0» rₛ") ? "vu" : res.tousTextes.filter(t => /rₛ/.test(t)).join(" ") || "aucun",
     "|p| vaut douze exactement alors que ses coordonnées valent 9,6 et 7,2 :"
     + " un module qui prendrait une coordonnée pour le rayon se verrait ici");

  const rDemande = res.appelsCadence[0];
  ok("la dilatation est demandée au RAYON, pas à une coordonnée",
     res.appelsCadence.length > 0 && Math.abs(rDemande - 12) < 1e-9,
     "cadence(12)", res.appelsCadence.length ? "cadence(" + rDemande + ")" : "jamais appelée");

  const pc = (cadenceVraie(12)*100).toFixed(1);
  ok("et le pourcentage affiché est cette dilatation, en pour cent",
     a('"x":"«' + pc.replace(".", ",") + '»"'),
     "x = " + pc.replace(".", ","),
     a('"x":"«' + pc.replace(".", ",") + '»"') ? "vu"
       : (/"x":"[^"]*"/.exec(tous) || ["absent"])[0],
     "le facteur cent est le genre de détail qui donne un site où l'horloge de"
     + " bord tourne à 0,9 % sans que personne ne s'en étonne");

  ok("le retard affiché est l'écart entre les deux horloges",
     a('"t":"⟦TEMPS ' + RETARD + '⟧"'), "t = " + RETARD + " s",
     a('"t":"⟦TEMPS ' + RETARD + '⟧"') ? "vu"
       : (/"t":"[^"]*"/.exec(tous) || ["absent"])[0],
     "c'est le sujet du site : l'écart, pas les deux dates séparément");

  ok("le facteur d'accélération affiché est celui du salon",
     a('{"f":120}'), "f = 120", a('{"f":120}') ? "vu"
       : (/⟦REMPLI salon\.ecran\.accelere[^⟧]*⟧/.exec(tous) || ["absent"])[0],
     "l'aveu : le mouvement est accéléré, et l'écran le dit au lieu de le taire");

  ok("le temps écoulé depuis l'arrivée est celui de la date donnée",
     a(DEPUIS.j + " ⟦CLE u.jourCourt⟧ " + DEPUIS.h + " h " + DEPUIS.mn + " min"),
     DEPUIS.j + " j " + DEPUIS.h + " h " + DEPUIS.mn + " min",
     (/\d+ ⟦CLE u\.jourCourt⟧[^|]*/.exec(tous) || ["absent"])[0].trim(),
     "la date d'arrivée est choisie ici à la seconde près : le compte des jours,"
     + " des heures et des minutes est donc une arithmétique indépendante");

  /* La preuve qu'aucune convention n'est en dur : les deux horloges se lisent
     à la langue de la page. On rejoue la même image en anglais et l'on exige
     que les dates changent — un module qui écrirait le format français en dur
     rendrait deux fois la même chose. */
  {
    const fr = rend(ECRANS, VUE_FACE, { locale: "fr-FR" }).tousTextes.join("|");
    const en = rend(ECRANS, VUE_FACE, { locale: "en-US" }).tousTextes.join("|");
    ok("les deux dates suivent la langue de lecture", fr !== en,
       "un affichage différent", fr === en ? "identique au caractère près" : "différent",
       "elles sont côte à côte et se comparent au caractère près : elles doivent"
       + " prendre la MÊME convention, et ce doit être celle qu'on lit");
  }
}
groupe("Ce qui est écrit vient de l'état");
controleTextes(ECR);

/* ═════════════════════════════ 9. LE CACHE HORS CHAMP  (8)

   Une optimisation MESURÉE, pas une précaution : 0,417 ms sur 1,757 ms de
   boucle, un quart du temps processeur. Elle n'a aucun effet visible tant
   qu'elle marche, et aucun contrôle ne tombe si elle cesse de mordre — la
   cadence baisse, c'est tout, et sur téléphone c'est la première cause de
   saccade. D'où ce groupe.

   L'horloge est fausse et posée à la main, donc le délai se mesure au
   millième sans faire dormir le processus. Le nombre de rasterisations se
   compte de DEHORS : chaque passe hors champ commence par un `clearRect` sur
   la toile, et on les compte. Rien n'est demandé au module. */
function controleCache(fabrique){
  const T = fabrique();
  if(T.erreur){ ok("le module se recharge pour le contrôle du cache", false,
                   "chargeable", T.erreur.message); return; }
  const E = T.ECRANS;
  const rasters = res => res.toiles.reduce((a, t) => a + t.rasters, 0);

  ok("le contrat affiche ses deux constantes",
     E.toile.RAFRAICHI === 250 && E.toile.SUR_ECH === 2,
     "250 ms et ×2", E.toile.RAFRAICHI + " ms et ×" + E.toile.SUR_ECH,
     "quatre rasterisations par seconde : l'horloge avance à la seconde, le"
     + " tracé d'orbite d'un point tous les quelques dixièmes");

  // Première image : tout se rasterise.
  TEMPS = 0;
  const a = rend(E, VUE_FACE, { gele: true });
  ok("la première image rasterise les deux toiles", rasters(a) === 2,
     "2 rasterisations", rasters(a) + " rasterisations");

  // Cent millisecondes plus tard : rien ne se refait, mais tout se repose.
  TEMPS = 100;
  const b = rend(E, VUE_FACE, { gele: true });
  ok("cent millisecondes plus tard, rien n'est refait", rasters(b) === 0,
     "0 rasterisation", rasters(b) + " rasterisation(s)",
     "c'est TOUTE l'optimisation : le contenu ne change pas à la cadence de"
     + " l'affichage, donc on ne le redessine pas à cette cadence-là");
  ok("mais les deux écrans sont quand même posés", b.retour === 2,
     "2 écrans", b.retour + " écran(s)",
     "un cache qui économiserait le rendu en escamotant l'affichage aurait"
     + " simplement supprimé la fonctionnalité");

  TEMPS = 249;
  ok("juste avant le délai, toujours rien", rasters(rend(E, VUE_FACE, { gele: true })) === 0,
     "0 rasterisation à 249 ms", "0");

  TEMPS = 251;
  const apres = rasters(rend(E, VUE_FACE, { gele: true }));
  ok("juste après, tout se refait", apres === 2,
     "2 rasterisations à 251 ms", apres + " rasterisation(s)",
     "le contenu doit finir par se rafraîchir : une horloge de bord figée"
     + " serait un défaut bien pire qu'une saccade");

  /* CE QUE ÇA ÉCONOMISE VRAIMENT. Le balayage seul, c'est quatre-vingt-quatre
     rectangles par écran ; avec le reste du contenu, une rasterisation coûte
     largement plus de cent appels. Une image qui n'en profite pas ne coûte que
     la lueur, le cadre, la découpe et une image posée. On compare les deux. */
  TEMPS = 900;                                           // au-delà du délai
  const plein = rend(E, VUE_FACE, { gele: true });        // celle-ci rasterise
  const horsChamp = Math.max(...plein.toiles.map(t => t.traces.length));
  let pire = 0;
  for(let i = 0; i < 12; i++){
    TEMPS += 5;                                          // douze images en 60 ms
    const r = rend(E, VUE_FACE, { gele: true });
    pire = Math.max(pire, r.traces.length / Math.max(1, r.retour));
    if(rasters(r) !== 0) pire = 1e9;
  }
  ok("une image qui profite du cache coûte une vingtaine d'appels par écran",
     pire < 30, "< 30 appels par écran", pire >= 1e9 ? "le cache a lâché" : pire.toFixed(0));
  ok("là où une rasterisation en coûte plus de cent",
     horsChamp > 100 && horsChamp > 4*pire, "> 100 appels, et 4× plus",
     horsChamp + " appels hors champ contre " + pire.toFixed(0) + " sur le calque",
     "le rapport EST le gain : c'est lui qui vaut le quart de boucle mesuré,"
     + " et c'est lui qui disparaîtrait sans que rien n'échoue");

  /* Le suréchantillonnage : la toile est tracée dans un repère de 300 × 200 et
     posée sur un canevas plus grand, parce que de près le quadrilatère dépasse
     la taille nominale. On mesure le rapport entre les coordonnées données et
     les coordonnées effectives — sans lire aucune constante du module. */
  TEMPS = 5000;
  const c = rend(E, VUE_FACE, { gele: true });
  const t0 = REGISTRE[0];
  const brut = t0.traces.filter(t => t.brut).map(t => t.brut[0][0]);
  const cuit = t0.traces.filter(t => t.brut).map(t => t.pts[0][0]);
  let rapport = 0;
  for(let i = 0; i < brut.length; i++)
    if(Math.abs(brut[i]) > 1e-6) rapport = Math.max(rapport, cuit[i]/brut[i]);
  ok("la toile hors champ est tracée à deux fois sa résolution nominale",
     Math.abs(rapport - 2) < 1e-9, "×2", rapport.toFixed(4) + "×",
     "sans ce suréchantillonnage, le texte des écrans est flou dès qu'on"
     + " s'approche : le quadrilatère dépasse alors la taille de la toile");

  const dedans = t0.traces.every(t => t.pts.every(p =>
    p[0] >= -40 && p[0] <= t0.larg + 40 && p[1] >= -40 && p[1] <= t0.haut + 40));
  ok("et tout son contenu tient dans le canevas demandé", dedans && t0.larg > 0,
     "dans " + t0.larg + "×" + t0.haut + " px", dedans ? "oui" : "des tracés dehors",
     "ce qui déborde est rogné en silence — pas d'exception, pas de trace,"
     + " juste une ligne de texte qui manque sur l'écran de quelqu'un");
}
groupe("Le cache hors champ");
controleCache(() => neuf());

/* ═══════════════════════ 10. LE CONTRÔLE SAIT-IL ÉCHOUER ?  (règle 2)

   On rejoue les groupes précédents sur des modules sabotés, en silence, et l'on
   exige qu'ils tombent. Deux natures de sabotage :

   · PAR L'ENVIRONNEMENT — `e.len` rend 80 % de la norme. Aucune ligne du module
     n'est touchée : il reste parfaitement cohérent avec lui-même et ne ment que
     par rapport au monde. C'est la seule forme qui s'applique à coup sûr quelle
     que soit la façon dont le module est écrit, et c'est aussi la plus proche
     du vrai danger — un rayon mal transmis.
   · PAR LE TEXTE — un motif remplacé dans une copie EN MÉMOIRE de la source. Le
     fichier sur le disque n'est jamais touché. Si le motif n'existe plus, on le
     dit au lieu de faire semblant de l'avoir essayé.                        */
groupe("Le contrôle sait échouer — on le casse pour le prouver");
// Joue un lot d'assertions en silence et rend ce qu'il en est sorti.
function recolte(jouer){
  carnet = [];
  try { jouer(); }
  catch(err){ carnet.push({ nom: "exception : " + err.message, vrai: false }); }
  const lot = carnet; carnet = null;
  return lot;
}
function essaie(nom, jouer){
  const lot = recolte(jouer);
  const tombes = lot.filter(c => !c.vrai);
  ok(nom, tombes.length > 0, "au moins un contrôle tombe",
     tombes.length + " tombés sur " + lot.length,
     tombes.length ? "→ " + tombes.slice(0, 3).map(c => c.nom).join(" ; ")
                   : "AUCUN — les contrôles ci-dessus ne surveillent donc rien");
}

essaie("un `e.len` qui rend 80 % de la norme fait mentir les écrans", () => {
  const res = rend(ECR, VUE_FACE, { len: v => 0.8*norme(v) });
  const tous = res.tousTextes.join(" | ");
  ok("rayon", tous.includes("«12,0» rₛ"));
  ok("cadence", Math.abs((res.appelsCadence[0] || 0) - 12) < 1e-9);
});

const SABOTAGES = [
  /* Le seuil angulaire est déplacé vers le HAUT — il devient trop gourmand et
     éteint des écrans encore parfaitement lisibles.

     Dans l'autre sens, 0.34 → 0.00, rien ne tombe, et il faut le dire : à
     quatre-vingts degrés le garde-fou d'erreur a déjà coupé, quelle que soit la
     distance, parce que le côté projeté qui sert de dénominateur s'effondre.
     Les deux garde-fous se recouvrent donc à l'angle rasant, et le seuil
     angulaire n'y est plus observable de l'extérieur. Ce n'est pas un trou du
     contrôle : c'est une redondance du module, et elle vaut d'être sue. */
  { nom: "le seuil de biais, 0.34 → 0.90",
    motif: /\(face - 0\.34\) \/ 0\.26/, par: "(face - 0.90) / 0.26",
    tombe: "le seuil angulaire",
    jouer: E => controleBiais(E, DALLES) },
  { nom: "le seuil d'erreur d'affine, 0.26 → 9.99",
    motif: /\(0\.26 - gauchi\) \/ 0\.14/, par: "(9.99 - gauchi) / 0.14",
    tombe: "le second garde-fou",
    jouer: E => controleBiais(E, DALLES) },
  { nom: "le fondu remplacé par un interrupteur",
    motif: /Math\.min\(1, Math\.max\(0, \(face - 0\.34\) \/ 0\.26\)\)/,
    par: "(face > 0.34 ? 1 : 0)",
    tombe: "l'extinction progressive",
    jouer: E => controleBiais(E, DALLES) },
  { nom: "le délai du cache, 250 → 0 ms",
    motif: /RAFRAICHI = 250/, par: "RAFRAICHI = 0",
    tombe: "le cache hors champ",
    jouer: E => controleCache(() => ({ ECRANS: E })) },
  { nom: "le suréchantillonnage, ×2 → ×1",
    motif: /SUR_ECH = 2\b/, par: "SUR_ECH = 1",
    tombe: "le cache hors champ",
    jouer: E => controleCache(() => ({ ECRANS: E })) },
  { nom: "le plan de coupure, 0.02 → −10⁹",
    motif: /w <= 0\.02/, par: "w <= -1e9",
    tombe: "la projection",
    jouer: E => controleProjection(E) },
  { nom: "les dalles décollées de 90 cm de la cloison",
    motif: /-vaisseau\.P\/2 \+ 0\.012/, par: "-vaisseau.P/2 + 0.90",
    tombe: "la géométrie relevée",
    jouer: E => controleGeometrie(E) },
  { nom: "le compteur qui répond toujours deux",
    motif: /return poses;/, par: "return 2;",
    tombe: "le compteur",
    jouer: E => controleCloison(E) },
  { nom: "un libellé écrit en français dans le code",
    motif: /T\("salon\.ecran\.position"\)/, par: '"POSITION"',
    tombe: "les textes",
    jouer: E => controleTextes(E) },
  { nom: "l'anneau posé sur la position périmée du drone",
    motif: /"a-lumen":\s*\(\) => lumen/, par: '"a-lumen":     () => postes.POSTE_LUMEN.c',
    tombe: "l'anneau de quête",
    jouer: E => controleAnneau(E) },
];

/* ON COMPARE À UN TÉMOIN, ET CE N'EST PAS UN LUXE.

   Un contrôle déjà rouge sur le module vrai retombe rouge sur le mutant, et il
   ferait alors passer n'importe quel sabotage pour mordant. Ce fichier a deux
   contrôles rouges — c'est justement pour ça qu'il existe. On rejoue donc
   chaque lot D'ABORD sur un module honnête et à cache vierge, et l'on n'exige
   pas « au moins un échec » mais « au moins un échec DE PLUS ». */
for(const s of SABOTAGES){
  if(!s.motif.test(SRC)){
    /* Pas un échec : le sabotage par l'environnement a déjà prouvé que le filet
       mord. Mais on ne fait pas semblant de l'avoir essayé. */
    console.log("  ·   " + s.nom + " — motif introuvable dans le source, non tenté");
    continue;
  }
  const temoin = neuf();
  const deja = new Set(recolte(() => s.jouer(temoin.ECRANS))
                        .filter(c => !c.vrai).map(c => c.nom));
  REGISTRE = [];

  const mutant = neuf(SRC.replace(s.motif, s.par));
  if(mutant.erreur || !mutant.ECRANS || typeof mutant.ECRANS.dessine !== "function"){
    ok("saboter " + s.nom + " donne un module chargeable", false,
       "un module mutant", "il ne se charge plus — sabotage inexploitable");
    REGISTRE = []; continue;
  }
  const lot = recolte(() => s.jouer(mutant.ECRANS));
  const neufs = lot.filter(c => !c.vrai && !deja.has(c.nom));
  ok("saboter " + s.nom + " fait tomber " + s.tombe,
     neufs.length > 0, "au moins un contrôle qui passait bascule",
     neufs.length + " basculés sur " + (lot.length - deja.size) + " au vert"
       + (deja.size ? " (" + deja.size + " déjà rouge" + (deja.size > 1 ? "s" : "")
                      + ", non comptés)" : ""),
     neufs.length ? "→ " + neufs.slice(0, 3).map(c => c.nom).join(" ; ")
                  : "AUCUN — les contrôles de ce lot ne surveillent donc rien");
  REGISTRE = [];
}
// On repart du module vrai : les compteurs de fin ne doivent rien au mutant.
{ const v = neuf(); ECR = v.ECRANS; }

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
