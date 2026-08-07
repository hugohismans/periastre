/* ============================================================================
   LES GESTES, ÉPROUVÉS SANS ÉCRAN

       node outil-verif-gestes.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   `gestes.js` calcule ce qu'un doigt qui glisse VEUT DIRE : à quelle vitesse
   une sonde part, de combien la pince a écarté, où la tête regarde après ce
   mouvement-là. Trois calculs qui ont vécu des mois dans le bloc d'`index.html`
   sans qu'aucun contrôle ne les touche, parce qu'ils étaient collés à des
   écouteurs d'événements et à un canevas.

   LE DANGER DE CE DOMAINE N'EST PAS QU'IL PLANTE : C'EST QU'IL SE JOUE. Un
   seuil placé à 0,012 ou à 0,02, un plafond à 0,9 ou à 1,2, un tangage serré à
   1,15 ou à 1,4 — dans tous les cas le site marche, les sondes partent, la tête
   tourne. La différence ne se voit pas : elle se SENT, et confusément. On croit
   qu'on a mal visé. On rejoue. On finit par penser que le jeu est dur.

   C'est exactement le genre de défaut qu'aucune paire d'yeux ne peut trancher
   et qu'un calcul tranche en une milliseconde. D'où ce fichier.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI  (règle 3)

   Aucun contrôle ne recopie une formule du module en face d'elle-même. Sept
   sources, toutes extérieures :

   1. DES SEUILS TROUVÉS PAR BISSECTION, jamais lus. La zone morte et le point
      de saturation sont retrouvés en cherchant où le comportement BASCULE,
      puis confrontés à ce que le module annonce. Un seuil et une constante qui
      divergeraient, c'est un commentaire qui ment.

   2. UNE BASE DE CAMÉRA CONSTRUITE À LA MAIN, dont on connaît le rabattement
      dans le plan sans passer par le module : deux vecteurs horizontaux
      orthonormés, u et w. L'attendu est alors une propriété de géométrie
      élémentaire — le rabattement est une ISOMÉTRIE du repère écran vers le
      plan, donc il conserve les angles — et non la formule du module. On exige
      que l'angle du geste À L'ÉCRAN, mesuré en pixels par `atan2`, se retrouve
      exactement dans le plan du disque.

   3. UNE ÉQUIVARIANCE. Faire tourner la caméra d'un angle α autour de la
      verticale doit faire tourner la vitesse rendue d'exactement α, pour un
      geste inchangé. C'est une symétrie, pas une formule : elle tient quelle
      que soit la loi, à condition que la loi soit la même partout.

   4. UNE ISOTROPIE. Les deux axes du geste sont divisés par la MÊME mesure, ce
      qui veut dire que la direction du lancer ne doit dépendre ni de la hauteur
      de l'image, ni — surtout — de sa largeur. C'est le contrôle qui attrape la
      faute d'aspect, celle qui a déjà coûté une heure entre `projette` et
      `surLePlan`.

   5. DEUX FAÇONS DE DIRE LA MÊME CHOSE. `v` et `vitesse` sortent ensemble ;
      |v| doit valoir `vitesse`. Deux sorties d'accord par construction qui se
      mettraient à diverger, c'est la maladie que ce dépôt traque.

   6. LA RÉVERSIBILITÉ ET L'ADDITIVITÉ D'UNE INTÉGRATION, pour le regard. Un
      geste suivi de son opposé ramène au point de départ ; un geste découpé en
      cent morceaux vaut le geste entier. Ce sont des propriétés d'une somme, et
      elles ne disent rien de la formule. Mieux : leur PERTE est la signature
      observable d'un serrage, ce qui donne un moyen de voir la borne sans la
      lire.

   7. LA GÉOMÉTRIE ÉLÉMENTAIRE, pour la pince. Un triangle 3-4-5 a une
      hypoténuse de 5 — Pythagore, pas `Math.hypot`. Le milieu de deux points
      est à égale distance des deux ET sur le segment. Et un barycentre se
      translate exactement comme ses points.

   ---------------------------------------------------------------------------
   CE QUI EST ÉPINGLÉ PLUTÔT QUE CORRIGÉ

   Trois comportements d'aujourd'hui sont ÉPINGLÉS : le contrôle exige qu'ils
   restent tels quels, non parce qu'ils sont bons, mais pour que le jour où
   quelqu'un les change, ce soit une décision et pas un accident.

     · caméra exactement dans le plan du disque : `v` sort nul avec une
       `vitesse` non nulle ;
     · base entièrement dégénérée (vue exactement du dessus) : idem, pour tout
       geste ;
     · `ecartDoigts` lève une exception à un seul doigt, et ignore le troisième.

   Ils ressortent en fin de course sous « ⚠ », sans compter comme des échecs.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le dernier groupe copie l'objet `GESTES` en mémoire, remplace UNE fonction
   par une version subtilement fausse, rejoue en silence le groupe de contrôles
   correspondant et exige qu'il TOMBE. Neuf sabotages, dont les trois qui
   comptent le plus :

     · le plafond retiré, par remplacement du seuil dans une copie EN MÉMOIRE
       du source — le fichier sur le disque n'est jamais touché ;
     · le tangage qui n'est plus serré ;
     · la zone morte déplacée d'un chouïa, d'un millième de hauteur d'écran.

   Le fichier échoue si un sabotage passe inaperçu : un contrôle incapable de
   prouver qu'il sait tomber ne surveille rien.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS, ET IL FAUT LE DIRE

   Le CONFORT. Que 1,6 soit le bon réglage, que 26 pixels soient la bonne
   tolérance au doigt, que 0,0032 radian par pixel soit la bonne sensibilité :
   rien ici ne peut le dire, et rien ne le prétend. Ce sont des réglages d'œil,
   et `?juge` existe pour les recueillir. Ce fichier garantit seulement qu'ils
   valent ce qu'ils annoncent, partout, et qu'ils ne dérivent pas en silence.

   Ne sont pas couverts non plus : l'écoute des événements, la capture du
   pointeur, la pince elle-même (le zoom et la rotation à deux doigts sont
   restés dans la page), et le passage du geste à la sonde — c'est `vol.js`.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN      = path.join(ICI, "gestes.js");
const CHEMIN_PHYS = path.join(ICI, "physique.js");

console.log("\n  LES GESTES — CONTRÔLE NUMÉRIQUE");
console.log("  ═══════════════════════════════");

let n = 0, echecs = 0;
/* Quand `carnet` n'est pas nul, `ok()` range au lieu d'imprimer. C'est ce qui
   permet de rejouer les mêmes contrôles sur un module saboté sans salir la
   sortie de faux échecs — et sans réécrire les assertions une seconde fois, ce
   qui reviendrait à saboter aussi le contrôle du sabotage. */
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

/* ══════════════════════════════════════════════════ 0. les modules sont-ils là ?

   S'il en manque un, on ne rend PAS un zéro échec. Un outil qui n'a rien mesuré
   et qui sort en code 0 endort exactement comme un contrôle incapable
   d'échouer : `node tout.js` afficherait un filet complet sur un trou. */
for(const [f, quoi] of [[CHEMIN_PHYS, "physique.js"], [CHEMIN, "gestes.js"]])
  if(!fs.existsSync(f))
    stop(quoi + " n'existe pas — RIEN N'A ÉTÉ MESURÉ", [
      "Cet outil charge les deux modules hors navigateur et refuse de conclure",
      "tant qu'il n'a pas les deux sous la main.",
    ]);

const SRC      = fs.readFileSync(CHEMIN, "utf8");
const SRC_PHYS = fs.readFileSync(CHEMIN_PHYS, "utf8");

/* Les deux modules se referment sur un faux global. `gestes.js` finit par
   `})(window)` et `physique.js` par `})(typeof window !== "undefined" ? …)` :
   on tend donc tous les noms sous lesquels un module de ce dépôt peut se
   déclarer, plutôt que d'imposer une forme d'écriture. */
function charge(src, cle){
  const bac = {};
  const mod = { exports: bac };
  new Function("window", "global", "globalThis", "self", "module", "exports", src)
    (bac, bac, bac, bac, mod, bac);
  return bac[cle] || (mod.exports && mod.exports[cle]) || null;
}

let PHYSIQUE, GESTES;
try {
  PHYSIQUE = charge(SRC_PHYS, "PHYSIQUE");
  GESTES   = charge(SRC, "GESTES");
} catch(err){
  stop("un module ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "",
    "Les modules doivent pouvoir s'évaluer hors navigateur : ni DOM, ni WebGL,",
    "ni `document` au chargement. C'est ce qui les rend vérifiables sans écran.",
  ]);
}

const CONTRAT = ["K_GLISSE", "ZONE_MORTE", "V_MAX", "SENS", "TANGAGE_MAX",
                 "vitesseDepuisGlisse", "centreDoigts", "ecartDoigts", "regard"];
if(!GESTES)
  stop("gestes.js s'est chargé mais n'expose pas `GESTES`", [
    "attendu   global.GESTES = { " + CONTRAT.join(", ") + " }",
  ]);
{
  const manque = CONTRAT.filter(k => GESTES[k] === undefined);
  if(manque.length)
    stop("gestes.js n'expose pas tout son contrat", [
      "manquant  " + manque.join(", "),
      "trouvé    " + Object.keys(GESTES).join(", "),
    ]);
}
if(!PHYSIQUE || typeof PHYSIQUE.norm !== "function")
  stop("physique.js n'expose pas ses opérations vectorielles", [
    "attendu   PHYSIQUE.{ dot, len, norm }",
  ]);

/* `norm` vient de PHYSIQUE, elle n'est pas réécrite ici — et c'est le point
   central de ce module : c'est SON repli sur le vecteur nul qui décide de tout
   le cas dégénéré. La réécrire ferait deux lois pour un même espace, et un
   outil qui attrape la maladie ne peut plus la dénoncer. */
const { dot, len, norm } = PHYSIQUE;

// ── petites commodités
const moins  = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
const fois   = (a, k) => [a[0]*k, a[1]*k, a[2]*k];
const plus   = (a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
const ecartV = (a, b) => len(moins(a, b));
const fini   = v => v.every(Number.isFinite);
// l'écart entre deux angles, ramené dans (−π, π]
const ecartA = (a, b) => Math.abs(Math.atan2(Math.sin(a-b), Math.cos(a-b)));

/* Un générateur pseudo-aléatoire À GRAINE. Un contrôle qui ne tombe qu'un jour
   sur trois se fait désactiver dans la semaine : les tirages doivent être les
   mêmes à chaque exécution, sur chaque machine. */
function alea(graine){
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ═══════════════════════════════════════════ les mesures d'image, et un geste

   Les deux téléphones portent la même largeur et deux hauteurs : c'est le cas
   réel de la barre d'adresse qui se rétracte au défilement. Le carré est là
   pour la couverture, et l'on note ce qu'il ne peut PAS faire : quand W = H,
   une fonction qui confondrait les deux mesures se comporterait exactement
   comme la bonne. Il n'est donc jamais seul. */
const VUES = [
  { nom: "grand écran",                W: 1440, H:  900 },
  { nom: "téléphone, barre déployée",  W:  390, H:  620 },
  { nom: "téléphone, barre rétractée", W:  390, H:  684 },
  { nom: "téléphone couché",           W:  844, H:  390 },
  { nom: "tablette debout",            W: 1024, H: 1366 },
  { nom: "carré — aveugle au rapport", W:  900, H:  900 },
];

/* Un geste, en pixels du canevas : parti de (x0, y0), rendu à (x, y).
   `dxpx` est vers la DROITE, `dypx` vers le HAUT — l'écran compte ses y vers le
   bas, et c'est le module qui retourne ce signe. On le retourne ici aussi, une
   fois, pour que tout le reste du fichier parle en « droite » et « haut ».

   LE GESTE PART DE L'ORIGINE, ET CE N'EST PAS UN DÉTAIL. Le module ne lit que
   des DIFFÉRENCES, donc le point de départ n'a aucune importance pour lui —
   mais il en a une pour le contrôle : `300 − (300 − t)` ne rend pas `t` quand
   `t` vaut un centième, et l'on mesurerait l'annulation catastrophique de sa
   propre soustraction en croyant mesurer un seuil. Partir de zéro rend les
   deux différences EXACTES, et permet d'exiger l'égalité au bit près. */
const glisse = (dxpx, dypx) => ({ x0: 0, y0: 0, x: dxpx, y: -dypx });

/* Le double immédiatement inférieur. C'est la seule façon de départager un `<`
   d'un `<=` : il faut pouvoir se poser à un ulp du seuil, pas à 1e-12. */
function precedent(x){
  const b = new Float64Array(1), i = new BigInt64Array(b.buffer);
  b[0] = x; i[0] -= 1n; return b[0];
}

/* ══════════════════════════════════ une caméra dont on connaît le rabattement

   C'est LA source de vérité du groupe « la direction suit le geste », et elle
   est construite sans ouvrir le module.

   On se donne deux vecteurs HORIZONTAUX orthonormés :

       u = [cos a, 0, sin a]        w = [−sin a, 0, cos a]

   et l'on pose la base de la caméra ainsi :

       d = u                        (l'axe « droite » de l'écran, déjà à plat)
       h = cos t·ŷ + sin t·w        (l'axe « haut », relevé d'un angle t)

   Rabattre `d` dans le plan rend u. Rabattre `h` rend sin t·w, donc w dès que
   sin t > 0. Les deux axes rabattus sont donc u et w : ORTHONORMÉS, connus, et
   obtenus sans écrire une ligne de la formule qu'on éprouve.

   Cette famille couvre exactement celle de la vue libre — `majLibre` pose un
   `d` horizontal et un `h` relevé de l'élévation —, ce qui est la seule
   configuration où un lancer est armé dans la page. */
function camMain(a, t){
  const u = [Math.cos(a), 0, Math.sin(a)];
  const w = [-Math.sin(a), 0, Math.cos(a)];
  const st = Math.sin(t), ct = Math.cos(t);
  return {
    cam: { base: { d: u, h: [st*w[0], ct, st*w[2]], a: [0, 0, 1] } },
    u, w,
  };
}

// rotation d'un angle α autour de la verticale : [cos α, 0, sin α] ↦ [cos(α+β)…]
const tourneY = (v, al) => [ v[0]*Math.cos(al) - v[2]*Math.sin(al), v[1],
                             v[2]*Math.cos(al) + v[0]*Math.sin(al) ];

/* ══════════════════════════════════════ 1. LE GARDE-FOU : a-t-on mesuré quelque chose ?

   Le piège que ce groupe existe pour éviter : une fonction qui rendrait `null`
   partout laisse une récolte VIDE, et tous les contrôles suivants deviennent
   des « rien de faux n'a été vu » — c'est-à-dire du vert sur du néant. */
function controleGardeFou(G){
  const { cam } = camMain(0.7, 0.9);
  let rendus = 0, nuls = 0;
  for(const vue of VUES)
    for(let i = -6; i <= 6; i++) for(let j = -6; j <= 6; j++){
      const g = G.vitesseDepuisGlisse(cam, glisse(i*13, j*11), vue, norm);
      if(g === null) nuls++; else rendus++;
    }
  if(rendus < 400)
    stop("`vitesseDepuisGlisse` ne rend presque jamais de vitesse — JE REFUSE DE CONCLURE", [
      rendus + " gestes sur " + (rendus + nuls) + " produisent un lancer.",
      "Tous les contrôles de la loi de vitesse compteraient alors une poignée de",
      "cas et passeraient au vert sans rien avoir éprouvé.",
    ]);
  ok("les deux réponses sont représentées — " + (rendus + nuls) + " gestes",
     rendus > 400 && nuls > 5, "des lancers ET des refus",
     rendus + " lancers, " + nuls + " refus",
     "un module qui rendrait toujours la même chose validerait tout le reste "
     + "sans rien surveiller");

  const g = G.vitesseDepuisGlisse(cam, glisse(60, 40), VUES[0], norm);
  ok("un lancer porte bien un vecteur et une vitesse finis",
     g && Array.isArray(g.v) && g.v.length === 3 && fini(g.v)
       && Number.isFinite(g.vitesse) && g.vitesse > 0,
     "{ v:[x,y,z], vitesse }",
     g ? "v = [" + g.v.map(x => x.toFixed(4)).join(", ") + "], vitesse = "
         + g.vitesse.toFixed(4) : "null");

  /* La fonction ne doit rien écrire dans ce qu'on lui prête. La visée est
     relue par le calque à chaque image et par `relache` au lâcher : un module
     qui la retoucherait ferait diverger l'aperçu du lancer réel. */
  const v = glisse(60, 40);
  const copieV = JSON.stringify(v);
  const b = JSON.stringify(cam.base);
  G.vitesseDepuisGlisse(cam, v, VUES[0], norm);
  ok("elle n'écrit ni dans la visée ni dans la caméra",
     JSON.stringify(v) === copieV && JSON.stringify(cam.base) === b,
     "les deux intacts",
     JSON.stringify(v) === copieV ? "intacts" : "la visée a été retouchée",
     "le calque relit la MÊME visée à chaque image ; une retouche ferait dériver "
     + "l'aperçu du lancer réel");
}

/* ══════════════════════════════════════════════════════ 2. LA ZONE MORTE

   Elle se juge des DEUX CÔTÉS du seuil, et le seuil lui-même est cherché par
   bissection — jamais lu dans le source, puis confronté à ce que le module
   annonce.

   Les bissections travaillent sur une image de hauteur 1. Ce n'est pas une
   image, c'est une unité : un geste de longueur t sur une hauteur 1 vaut
   EXACTEMENT t hauteurs d'écran, sans division approchée. La bissection mesure
   alors la loi, et pas l'arrondi d'un rapport de pixels. */
function controleZoneMorte(G){
  const { cam } = camMain(0.4, 1.1);
  const UN = { W: 1, H: 1 };
  // un glissement vertical pur de longueur t hauteurs d'écran
  const tire = (t, vue) => G.vitesseDepuisGlisse(cam, glisse(0, t*(vue||UN).H), vue||UN, norm);

  /* Le seuil, cherché. `a` refuse, `b` lance : on resserre jusqu'à la bascule. */
  const bascule = (fait) => {
    let a = 0, b = 1;
    for(let i = 0; i < 200; i++){
      const m = (a + b)/2;
      if(fait(m)) b = m; else a = m;
    }
    return (a + b)/2;
  };
  const seuil = bascule(t => tire(t) !== null);

  ok("la zone morte tombe à " + G.ZONE_MORTE + " hauteur d'écran",
     Math.abs(seuil - G.ZONE_MORTE) < 1e-15, G.ZONE_MORTE.toFixed(15),
     seuil.toFixed(15),
     "trouvée par bissection sur la bascule refus/lancer — la valeur n'est pas "
     + "lue dans le source, elle est cherchée, puis confrontée à l'annonce");

  /* Le seuil est-il une FRACTION DE L'ÉCRAN ou un nombre de pixels ? La
     question n'est pas rhétorique : c'est la différence entre un geste qui veut
     dire la même chose sur un téléphone et sur un grand écran, et un geste qui
     devient quatre fois plus exigeant sur un écran quatre fois plus haut. */
  {
    let pire = 0, ouPire = "";
    const pixels = [];
    for(const vue of VUES){
      const s = bascule(t => tire(t, vue) !== null);
      if(Math.abs(s - seuil) > pire){ pire = Math.abs(s - seuil); ouPire = vue.nom; }
      pixels.push(s*vue.H);
    }
    ok("et elle vaut la même fraction sur les six mesures d'image", pire < 1e-9,
       "< 1e-9 d'écart", pire.toExponential(2) + (pire > 0 ? "   (" + ouPire + ")" : ""),
       "en pixels ce sont pourtant six seuils différents : de "
       + Math.min(...pixels).toFixed(1) + " à " + Math.max(...pixels).toFixed(1)
       + " px — c'est bien une fraction d'écran, pas un compte de pixels");
    ok("donc le seuil EN PIXELS suit vraiment la hauteur de l'image",
       Math.max(...pixels) - Math.min(...pixels) > 5, "> 5 px d'étendue",
       (Math.max(...pixels) - Math.min(...pixels)).toFixed(1) + " px",
       "sans cela, le contrôle précédent serait vert sur un seuil en pixels figé");
  }

  /* Les deux côtés, au plus près. Et le seuil LUI-MÊME : `<` ou `<=` ne se
     départagent que là, et un geste pile sur la valeur est atteignable — c'est
     le sens de la hauteur 1. */
  {
    const Z = G.ZONE_MORTE;
    ok("à UN ULP sous le seuil, rien ne part", tire(precedent(Z)) === null,
       "null", JSON.stringify(tire(precedent(Z))),
       "pas « un peu en dessous » : le double immédiatement inférieur. C'est la "
       + "seule distance à laquelle un `<` et un `<=` ne disent pas la même chose");
    ok("un chouïa au-dessus, un lancer part", tire(Z*(1 + 1e-9)) !== null,
       "un lancer", tire(Z*(1 + 1e-9)) ? "un lancer" : "null");
    ok("et PILE sur le seuil, ça part — c'est un `<`, pas un `<=`",
       tire(Z) !== null, "un lancer", tire(Z) ? "un lancer" : "null",
       "l'écart entre les deux ne se verra jamais en jouant ; il se fige ici "
       + "pour que le jour où il change, ce soit une décision");
  }

  /* La zone morte porte sur la LONGUEUR du geste, pas sur l'un de ses axes.
     Un seuil qui ne regarderait que la verticale laisserait passer un geste
     horizontal minuscule, et l'on lancerait une sonde à l'arrêt en effleurant. */
  {
    let pire = 0, ou = "";
    for(const ang of [0, 0.3, Math.PI/4, 1.2, Math.PI/2, 2.5, Math.PI, -0.9, -2.2]){
      const dir = (t) => G.vitesseDepuisGlisse(
        cam, glisse(t*Math.cos(ang), t*Math.sin(ang)), UN, norm) !== null;
      let a = 0, b = 1;
      for(let i = 0; i < 200; i++){ const m = (a+b)/2; if(dir(m)) b = m; else a = m; }
      const s = (a + b)/2;
      if(Math.abs(s - seuil) > pire){ pire = Math.abs(s - seuil); ou = ang.toFixed(2) + " rad"; }
    }
    ok("le seuil porte sur la LONGUEUR du geste — neuf directions", pire < 1e-12,
       "< 1e-12 d'écart", pire.toExponential(2) + (pire > 0 ? "   (" + ou + ")" : ""),
       "un seuil qui ne regarderait qu'un axe laisserait effleurer dans l'autre, "
       + "et l'on lancerait une sonde à l'arrêt sans l'avoir voulu");
  }

  /* Le geste NUL — le doigt posé, exactement. C'est le cas que la zone morte
     existe pour attraper : sans elle, `lance()` recevrait une vitesse nulle et
     la sonde tomberait droit dans l'astre. */
  {
    let tousNuls = true;
    for(const vue of VUES) if(G.vitesseDepuisGlisse(cam, glisse(0, 0), vue, norm)) tousNuls = false;
    ok("un doigt posé sans bouger ne lance rien", tousNuls, "null partout",
       tousNuls ? "six mesures d'image, six refus" : "un lancer est parti",
       "c'est la raison d'être de la zone morte : une sonde lâchée à vitesse "
       + "nulle tombe droit dans le trou noir, offerte à qui voulait regarder");
  }
}

/* ═══════════════════════════════ 3. LA LOI DE LA VITESSE : LINÉAIRE, PUIS PLATE

   Deux régimes, et l'on éprouve LES DEUX. Ne contrôler que la saturation
   laisserait le facteur libre ; ne contrôler que le régime linéaire laisserait
   partir une sonde à seize fois la vitesse de la lumière.

   La linéarité est établie par HOMOGÉNÉITÉ — doubler le geste double la
   vitesse — et non en recopiant `l × K`. Un seul point d'ancrage suffit alors à
   fixer toute la droite, et cet ancrage est confronté à la constante annoncée. */
function controleLoiVitesse(G){
  const { cam } = camMain(1.9, 0.6);
  const UN = { W: 1, H: 1 };
  const vit = t => { const g = G.vitesseDepuisGlisse(cam, glisse(0, t), UN, norm);
                     return g ? g.vitesse : null; };

  // ── l'ancrage : un quart d'écran. Exact en binaire, un quart est une
  //    puissance de deux — donc l'égalité peut être demandée au bit près.
  {
    const g = G.vitesseDepuisGlisse(cam, glisse(0, 1024/4), { W: 1024, H: 1024 }, norm);
    ok("un quart de hauteur d'écran demande exactement un quart de K_GLISSE",
       g && g.vitesse === G.K_GLISSE/4, (G.K_GLISSE/4).toFixed(17),
       g ? g.vitesse.toFixed(17) : "null",
       "l'ancrage de la droite : un quart est une puissance de deux, donc "
       + "l'égalité se demande au bit près et pas à 1e-15 près");
  }

  // ── l'homogénéité : c'est elle qui fait la droite, sans recopier la formule
  {
    let pire = 0, ou = "";
    for(const t of [0.02, 0.05, 0.1, 0.2, 0.3, 0.5])
      for(const k of [0.5, 0.25, 0.125, 2]){
        if(t*k >= G.V_MAX/G.K_GLISSE || t*k < G.ZONE_MORTE) continue;   // hors régime linéaire
        const e = Math.abs(vit(t*k) - vit(t)*k);
        if(e > pire){ pire = e; ou = "t = " + t + ", k = " + k; }
      }
    ok("doubler le geste double la vitesse, le moitier la moitie", pire === 0,
       "égalité au bit près", pire === 0 ? "exacte" : pire.toExponential(2)
       + "   (" + ou + ")",
       "les facteurs sont des puissances de deux : la loi est linéaire ou elle "
       + "ne l'est pas, il n'y a pas d'arrondi à tolérer");
  }

  // ── la vitesse ne dépend que de la LONGUEUR, pas de la direction du geste
  {
    let pire = 0;
    const ref = 0.3;
    const v0 = G.vitesseDepuisGlisse(cam, glisse(ref, 0), UN, norm).vitesse;
    for(const ang of [0.1, 0.7, Math.PI/4, 1.9, 3.0, -0.5, -2.7])
      pire = Math.max(pire, Math.abs(G.vitesseDepuisGlisse(
        cam, glisse(ref*Math.cos(ang), ref*Math.sin(ang)), UN, norm).vitesse - v0));
    ok("et elle ne dépend pas de la direction du geste", pire < 1e-15,
       "< 1e-15", pire.toExponential(2),
       "sept angles, même longueur : le geste est isotrope, sinon lancer en "
       + "diagonale serait plus fort que lancer tout droit");
  }

  // ── la saturation, cherchée par bissection puis confrontée
  {
    let a = G.ZONE_MORTE, b = 100;      // a : la droite monte encore,  b : c'est plat
    for(let i = 0; i < 300; i++){
      const m = (a + b)/2;
      if(vit(m) >= vit(m*1.0000001)) b = m; else a = m;
    }
    const tSat = (a + b)/2;
    ok("le plafond commence là où la droite atteint V_MAX",
       Math.abs(tSat - G.V_MAX/G.K_GLISSE) < 1e-9,
       (G.V_MAX/G.K_GLISSE).toFixed(9) + " hauteur d'écran", tSat.toFixed(9),
       "deux constantes annoncées, une bascule mesurée : elles doivent tomber "
       + "au même endroit, sinon l'une des deux ment");
  }

  // ── le régime saturé : exactement V_MAX, jamais plus, et le plafond MORD
  {
    let pireHaut = 0, touche = 0, ouHaut = "";
    const enormes = [1, 2, 5, 10, 100, 5000];
    for(const vue of VUES) for(const t of enormes){
      const g = G.vitesseDepuisGlisse(cam, glisse(t*vue.H*0.7, t*vue.H*0.7), vue, norm);
      if(g.vitesse > pireHaut){ pireHaut = g.vitesse; ouHaut = vue.nom + ", " + t; }
      if(g.vitesse === G.V_MAX) touche++;
    }
    ok("un glissement énorme donne EXACTEMENT V_MAX", touche === VUES.length*enormes.length,
       VUES.length*enormes.length + " sur " + VUES.length*enormes.length,
       touche + " sur " + VUES.length*enormes.length,
       "le plafond mord : un plafond qu'aucun geste n'atteint n'est pas un "
       + "garde-fou, c'est un commentaire");
    ok("et jamais plus", pireHaut <= G.V_MAX, "≤ " + G.V_MAX,
       pireHaut + (pireHaut > G.V_MAX ? "   (" + ouHaut + ")" : ""));

    /* L'ANCRAGE QUI NE VIENT PAS DU MODULE : une sonde ne part pas plus vite
       que la lumière. Le site promet une simulation ; un lancer supraluminique
       n'est pas un réglage discutable, c'est une loi cassée. C'est ce contrôle
       qui reste debout quand la constante elle-même est sabotée. */
    let pire = 0, ou = "";
    for(const vue of VUES) for(let k = 0; k < 60; k++){
      const t = Math.pow(10, -2 + k/10);
      const g = G.vitesseDepuisGlisse(cam, glisse(t*vue.H, -0.4*t*vue.H), vue, norm);
      if(g && g.vitesse > pire){ pire = g.vitesse; ou = vue.nom + ", " + t.toFixed(3); }
    }
    ok("aucun geste ne demande une vitesse supraluminique", pire < 1, "< 1 c",
       pire.toFixed(6) + " c" + (pire >= 1 ? "   (" + ou + ")" : ""),
       "360 gestes, de 1 % à 1000 hauteurs d'écran. La vérité vient d'ailleurs : "
       + "c'est une simulation, pas une animation");
  }
}

/* ═══════════════ 4. LE LANCER EST DANS LE PLAN, ET SES DEUX SORTIES S'ACCORDENT

   Deux invariants que rien à l'écran ne dirait s'ils tombaient :

     · la composante verticale est nulle, EXACTEMENT. Un `y` de 1e-12 enverrait
       les sondes hors du plan du disque, où elles précesseraient lentement sans
       que personne ne comprenne pourquoi ;
     · |v| vaut le champ `vitesse` rendu à côté. Deux façons de dire la même
       chose qui divergeraient, c'est la maladie que ce dépôt traque — et le
       calque, lui, se sert de `vitesse` pour colorer l'élastique pendant que le
       lancer, lui, se sert de `v`. */
function controlePlanEtAccord(G){
  let pireY = 0, ouY = "", pireN = 0, ouN = "", cas = 0;
  const tire = alea(20260808);
  for(const vue of VUES)
    for(const a of [0, 0.9, 2.2, -1.4, 3.9])
      for(const t of [0.2, 0.8, 1.6, 2.4])          // t : jamais 0 ni π, sinon dégénéré
        for(let k = 0; k < 6; k++){
          const { cam } = camMain(a, t);
          const dxpx = (tire()*2 - 1)*vue.H*0.8, dypx = (tire()*2 - 1)*vue.H*0.8;
          const g = G.vitesseDepuisGlisse(cam, glisse(dxpx, dypx), vue, norm);
          if(!g) continue;
          cas++;
          if(Math.abs(g.v[1]) > pireY){ pireY = Math.abs(g.v[1]); ouY = vue.nom; }
          const e = Math.abs(len(g.v) - g.vitesse)/g.vitesse;
          if(e > pireN){ pireN = e; ouN = vue.nom + ", a = " + a.toFixed(1); }
        }

  ok("la composante verticale est nulle — " + cas + " lancers", pireY === 0,
     "0 exactement", pireY === 0 ? "0" : pireY.toExponential(2) + "   (" + ouY + ")",
     "pas « petite » : nulle. Une sonde à 1e-12 hors du plan y reste, et sa "
     + "trajectoire s'écarte lentement de ce que le calque avait dessiné");
  ok("et |v| vaut bien le champ `vitesse` rendu à côté", pireN < 1e-15,
     "< 1e-15 en relatif", pireN.toExponential(2)
     + (pireN > 0 ? "   (" + ouN + ")" : ""),
     "le calque colore l'élastique avec `vitesse`, `lance()` part avec `v` : "
     + "s'ils divergent, l'aperçu promet une orbite et le tir donne une chute");
  ok("la récolte n'était pas vide", cas >= 500, "≥ 500 lancers", cas);
}

/* ═════════════════════════════════════════════ 5. LA DIRECTION SUIT LE GESTE

   Le rabattement du repère écran dans le plan est une ISOMÉTRIE dès que les
   deux axes rabattus sont orthonormés — ce que la caméra construite à la main
   garantit par construction, voir `camMain`. Une isométrie conserve les angles.

   Donc : l'angle du geste À L'ÉCRAN, mesuré en pixels par `atan2`, doit se
   retrouver EXACTEMENT dans le repère (u, w) du plan. C'est une propriété de
   géométrie, pas la formule du module — et l'attendu est fabriqué à partir des
   pixels du geste, jamais à partir de ce que le module a rendu. */
function controleDirection(G){
  // ── les deux cas purs, d'abord, parce qu'ils se lisent
  {
    const { cam, u, w } = camMain(0.83, 1.0);
    const vue = VUES[0];
    const droite = G.vitesseDepuisGlisse(cam, glisse(120, 0), vue, norm);
    const haut   = G.vitesseDepuisGlisse(cam, glisse(0, 120), vue, norm);
    ok("tirer vers la DROITE lance le long de l'axe droit rabattu",
       ecartV(droite.v, fois(u, droite.vitesse)) < 1e-15,
       "v = vitesse × u", ecartV(droite.v, fois(u, droite.vitesse)).toExponential(2),
       "u est construit à la main, il ne sort pas du module");
    ok("tirer vers le HAUT lance le long de l'axe haut rabattu",
       ecartV(haut.v, fois(w, haut.vitesse)) < 1e-15,
       "v = vitesse × w", ecartV(haut.v, fois(w, haut.vitesse)).toExponential(2));
    ok("et tirer vers la gauche lance à l'opposé",
       ecartV(G.vitesseDepuisGlisse(cam, glisse(-120, 0), vue, norm).v,
              fois(u, -droite.vitesse)) < 1e-15,
       "v = −vitesse × u",
       ecartV(G.vitesseDepuisGlisse(cam, glisse(-120, 0), vue, norm).v,
              fois(u, -droite.vitesse)).toExponential(2),
       "un signe inversé ferait partir la sonde à l'opposé de l'élastique dessiné");
  }

  // ── l'angle, sur tout le tour, toutes orientations de caméra
  {
    let pire = 0, ou = "", cas = 0;
    for(const a of [0, 0.5, 1.9, -2.6, 4.4])
      for(const t of [0.25, 0.8, 1.5707963, 2.4, 3.0])
        for(let k = 0; k < 24; k++){
          const { cam, u, w } = camMain(a, t);
          const angEcran = -Math.PI + k*Math.PI/12 + 0.037;
          const dxpx = 150*Math.cos(angEcran), dypx = 150*Math.sin(angEcran);
          const g = G.vitesseDepuisGlisse(cam, glisse(dxpx, dypx), VUES[1], norm);
          // les coordonnées du lancer dans le repère (u, w), connu à la main
          const angPlan = Math.atan2(dot(g.v, w), dot(g.v, u));
          // l'attendu vient des PIXELS du geste, pas du module
          const e = ecartA(angPlan, Math.atan2(dypx, dxpx));
          cas++;
          if(e > pire){ pire = e; ou = "a = " + a + ", t = " + t.toFixed(2); }
        }
    ok("l'angle du geste à l'écran se retrouve dans le plan — " + cas + " cas",
       pire < 1e-14, "< 1e-14 rad", pire.toExponential(2) + "   (" + ou + ")",
       "le rabattement est une isométrie du repère écran vers le plan : il "
       + "conserve les angles. L'attendu sort de `atan2` sur les pixels");
  }

  /* ── L'ÉQUIVARIANCE. Faire tourner la caméra de α autour de la verticale doit
     faire tourner le lancer de α, exactement. C'est une symétrie du problème :
     elle tient quelle que soit la loi, pourvu que la loi soit la même partout.
     Une formule qui traiterait un quadrant différemment la casserait. */
  {
    let pire = 0, ou = "";
    for(const a of [0, 1.1, -2.0])
      for(const t of [0.6, 2.1])
        for(const al of [0.3, 1.5707963, 2.9, -1.2, 6.0]){
          const A = camMain(a, t), B = camMain(a + al, t);
          const ge = glisse(90, -55);
          const va = G.vitesseDepuisGlisse(A.cam, ge, VUES[2], norm).v;
          const vb = G.vitesseDepuisGlisse(B.cam, ge, VUES[2], norm).v;
          const e = ecartV(vb, tourneY(va, al));
          if(e > pire){ pire = e; ou = "α = " + al.toFixed(2); }
        }
    ok("tourner la caméra de α tourne le lancer de α", pire < 1e-15,
       "< 1e-15", pire.toExponential(2) + "   (" + ou + ")",
       "une équivariance, pas une formule : elle ne dit rien de la loi, elle "
       + "dit que c'est la même partout");
  }

  /* ── L'ISOTROPIE, ET LA LARGEUR QUI NE DOIT PAS ÊTRE LUE.

     Les deux axes du geste sont divisés par la MÊME mesure. Conséquence
     observable : la direction du lancer ne change pas quand l'image change de
     hauteur, et pas du tout quand elle change de largeur. Si quelqu'un divisait
     l'horizontale par la largeur — la faute d'aspect, déjà payée entre
     `projette` et `surLePlan` — un même geste partirait ailleurs en portrait et
     en paysage, et l'on chercherait l'erreur dans la physique. */
  {
    const { cam } = camMain(1.35, 0.75);
    let pireW = 0, pireH = 0;
    for(const dxpx of [40, 130, -90]) for(const dypx of [70, -110]){
      const ref = G.vitesseDepuisGlisse(cam, glisse(dxpx, dypx), { W: 900, H: 900 }, norm);
      const dirRef = norm(ref.v);
      for(const W of [200, 640, 3200, 12000]){
        const g = G.vitesseDepuisGlisse(cam, glisse(dxpx, dypx), { W, H: 900 }, norm);
        pireW = Math.max(pireW, ecartV(g.v, ref.v));
      }
      for(const H of [450, 1800, 3600]){
        const g = G.vitesseDepuisGlisse(cam, glisse(dxpx, dypx), { W: 900, H }, norm);
        pireH = Math.max(pireH, ecartV(norm(g.v), dirRef));
      }
    }
    ok("la largeur de l'image ne change RIEN au lancer", pireW === 0,
       "0 exactement", pireW === 0 ? "0" : pireW.toExponential(2),
       "quatre largeurs de 200 à 12 000 px, même hauteur : c'est le contrôle qui "
       + "attrape la faute d'aspect, celle qui ressemble à un défaut de physique");
    ok("et la hauteur n'en change que la vitesse, jamais la direction",
       pireH < 1e-15, "< 1e-15", pireH.toExponential(2),
       "les deux axes du geste sont divisés par la même mesure : c'est ce qui "
       + "rend un geste à 45° franchement diagonal sur toutes les fenêtres");

    // et la hauteur change bien la vitesse, sinon le contrôle ci-dessus serait creux
    const a = G.vitesseDepuisGlisse(cam, glisse(40, 30), { W: 900, H: 900 }, norm);
    const b = G.vitesseDepuisGlisse(cam, glisse(40, 30), { W: 900, H: 1800 }, norm);
    ok("doubler la hauteur de l'image moitie la vitesse demandée",
       b.vitesse === a.vitesse/2, (a.vitesse/2).toFixed(17), b.vitesse.toFixed(17),
       "le même geste en pixels vaut deux fois moins de hauteurs d'écran — sinon "
       + "le contrôle précédent serait vert sur une fonction qui ignore `vue`");
  }
}

/* ══════════════════════════════════ 6. LE CAS DÉGÉNÉRÉ, ÉPINGLÉ ET NON CORRIGÉ

   Rabattre les axes de l'écran dans le plan suppose qu'ils y laissent quelque
   chose. Deux orientations où ce n'est pas le cas, et `norm([0,0,0])` rend
   alors le vecteur nul au lieu de protester.

   CE GROUPE NE JUGE PAS, IL ÉPINGLE. Le comportement d'aujourd'hui est écrit
   noir sur blanc pour que le jour où quelqu'un le change, ce soit une décision
   — et pour qu'on cesse de le découvrir. Les deux constats ressortent sous
   « ⚠ » en fin de course. */
function controleDegenere(G){
  // ── la caméra exactement dans le plan du disque : l'axe « haut » est vertical
  {
    const { cam, u } = camMain(0.62, 0);            // t = 0 → h = ŷ, rabattu nul
    const vue = VUES[0];

    const vertical = G.vitesseDepuisGlisse(cam, glisse(0, 200), vue, norm);
    ok("caméra dans le plan, geste vertical pur : `v` sort NUL",
       vertical && vertical.v[0] === 0 && vertical.v[1] === 0 && vertical.v[2] === 0,
       "[0, 0, 0]", vertical ? "[" + vertical.v.join(", ") + "]" : "null",
       "épinglé, non corrigé : le « haut » de l'écran n'a pas d'ombre dans le "
       + "plan, et `norm` d'un vecteur nul rend un vecteur nul");
    ok("… avec pourtant une `vitesse` non nulle à côté — LES DEUX SE CONTREDISENT",
       vertical && vertical.vitesse > 0 && len(vertical.v) === 0,
       "vitesse > 0 et |v| = 0",
       vertical ? "vitesse = " + vertical.vitesse.toFixed(4) + ", |v| = " + len(vertical.v) : "null",
       "c'est la seule orientation où les deux sorties du module ne disent pas "
       + "la même chose. Voir le constat en fin de course");

    const oblique = G.vitesseDepuisGlisse(cam, glisse(60, 200), vue, norm);
    const seulX   = G.vitesseDepuisGlisse(cam, glisse(60, 0), vue, norm);
    ok("… et la part verticale du geste est ignorée par la DIRECTION",
       ecartV(norm(oblique.v), u) < 1e-15, "le lancer part le long de u",
       ecartV(norm(oblique.v), u).toExponential(2));
    ok("… mais comptée par la VITESSE", oblique.vitesse > seulX.vitesse*2,
       "nettement plus rapide que le même geste sans la verticale",
       oblique.vitesse.toFixed(4) + " contre " + seulX.vitesse.toFixed(4),
       "on tire vers le haut, la sonde part de côté — et vite. Le comportement "
       + "est géométriquement défendable ; il n'est écrit nulle part ailleurs");
  }

  // ── la base entièrement dégénérée : la vue exactement du dessus
  {
    const cam = { base: { d: [0, 0, 0], h: [0, 0, 0], a: [0, -1, 0] } };
    let tousNuls = true, vitesseVue = 0;
    for(const vue of VUES) for(const [dx, dy] of [[200, 0], [0, 200], [-90, 140]]){
      const g = G.vitesseDepuisGlisse(cam, glisse(dx, dy), vue, norm);
      if(!g || len(g.v) !== 0) tousNuls = false;
      if(g) vitesseVue = Math.max(vitesseVue, g.vitesse);
    }
    ok("vue exactement du dessus : TOUT geste rend un lancer nul", tousNuls,
       "[0, 0, 0] partout", tousNuls ? "18 gestes, 18 lancers nuls" : "un lancer non nul",
       "`camera.js` rend déjà une base nulle à l'élévation ±π/2 ; ce module la "
       + "propage sans broncher. L'état n'est pas atteignable — l'élévation est "
       + "serrée à ±1,35 dans la page — mais rien ne l'interdit à un appelant");
    ok("… avec là encore une `vitesse` non nulle", vitesseVue > 0, "> 0",
       vitesseVue.toFixed(4));
  }
}

/* ═══════════════════════════════════════════════════════════ 7. LA PINCE

   La vérité est la géométrie du collège, et rien d'autre : un triangle 3-4-5 a
   une hypoténuse de 5, un milieu est à égale distance des deux bouts ET sur le
   segment, un barycentre se translate exactement comme ses points.

   `ecartDoigts` est ÉPINGLÉE TELLE QU'ELLE EST — elle ne compte pas ses doigts.
   Les deux appels de la page sont sous un `doigts.size === 2`, donc elle dit
   vrai aujourd'hui ; ce groupe fige ce qu'elle fait ailleurs, pour que le jour
   où un troisième doigt se pose, le contrôle parle. */
function controlePince(G){
  const map = (...pts) => new Map(pts.map((p, i) => [i + 1, p]));
  const dist = (a, b) => Math.hypot(a[0]-b[0], a[1]-b[1]);

  // ── l'écartement : Pythagore, pas Math.hypot
  {
    ok("un triangle 3-4-5 mesure exactement 5",
       G.ecartDoigts(map([10, 20], [13, 24])) === 5, "5", G.ecartDoigts(map([10, 20], [13, 24])),
       "l'hypoténuse est connue avant d'ouvrir le module, et elle est entière — "
       + "donc l'égalité se demande au bit près");
    ok("un triangle 5-12-13 aussi",
       G.ecartDoigts(map([-4, 7], [1, -5])) === 13, "13", G.ecartDoigts(map([-4, 7], [1, -5])));
    ok("deux doigts au même endroit, écartement nul",
       G.ecartDoigts(map([88, 12], [88, 12])) === 0, "0", G.ecartDoigts(map([88, 12], [88, 12])));
    ok("l'ordre des doigts ne change rien",
       G.ecartDoigts(map([3, 9], [40, -12])) === G.ecartDoigts(map([40, -12], [3, 9])),
       "la même valeur", G.ecartDoigts(map([3, 9], [40, -12])).toFixed(9)
       + " / " + G.ecartDoigts(map([40, -12], [3, 9])).toFixed(9),
       "le zoom serait sinon inversé selon lequel des deux doigts s'est posé "
       + "le premier — et cela dépend de la main");

    // invariance par translation et par rotation : deux symétries, pas une formule
    let pireT = 0, pireR = 0;
    const tire = alea(1409);
    for(let k = 0; k < 200; k++){
      const A = [tire()*2000-1000, tire()*2000-1000], B = [tire()*2000-1000, tire()*2000-1000];
      const d0 = G.ecartDoigts(map(A, B));
      const T = [tire()*4000-2000, tire()*4000-2000];
      pireT = Math.max(pireT, Math.abs(
        G.ecartDoigts(map([A[0]+T[0], A[1]+T[1]], [B[0]+T[0], B[1]+T[1]])) - d0));
      const th = tire()*2*Math.PI, c = Math.cos(th), s = Math.sin(th);
      const R = p => [p[0]*c - p[1]*s, p[0]*s + p[1]*c];
      pireR = Math.max(pireR, Math.abs(G.ecartDoigts(map(R(A), R(B))) - d0)/Math.max(1, d0));
    }
    ok("l'écartement ne bouge pas si les deux doigts glissent ensemble",
       pireT < 1e-9, "< 1e-9", pireT.toExponential(2),
       "200 tirages à graine : la pince mesure un écart, pas une position");
    ok("ni si l'on tourne le téléphone", pireR < 1e-12, "< 1e-12 en relatif",
       pireR.toExponential(2));
  }

  // ── le centre : les propriétés du milieu, puis celles du barycentre
  {
    const c = G.centreDoigts(map([10, 40], [30, 0]));
    ok("le centre de deux doigts est à égale distance des deux",
       Math.abs(dist(c, [10, 40]) - dist(c, [30, 0])) < 1e-12,
       "0 d'écart", Math.abs(dist(c, [10, 40]) - dist(c, [30, 0])).toExponential(2));
    ok("… et sur le segment qui les joint",
       Math.abs(dist([10, 40], c) + dist(c, [30, 0]) - dist([10, 40], [30, 0])) < 1e-12,
       "l'inégalité triangulaire est une égalité",
       Math.abs(dist([10, 40], c) + dist(c, [30, 0]) - dist([10, 40], [30, 0])).toExponential(2),
       "à égale distance des deux SANS être sur le segment, c'est la médiatrice "
       + "entière : les deux propriétés ensemble ne laissent qu'un point");

    ok("un seul doigt : le centre est ce doigt",
       ecartV([...G.centreDoigts(map([17, -3])), 0], [17, -3, 0]) === 0,
       "[17, -3]", JSON.stringify(G.centreDoigts(map([17, -3]))));
    ok("trois doigts au même endroit : le centre est cet endroit",
       JSON.stringify(G.centreDoigts(map([5, 5], [5, 5], [5, 5]))) === JSON.stringify([5, 5]),
       "[5, 5]", JSON.stringify(G.centreDoigts(map([5, 5], [5, 5], [5, 5]))));

    // équivariance par translation : le barycentre suit exactement
    let pire = 0;
    const tire = alea(77);
    for(let k = 0; k < 200; k++){
      const pts = [];
      for(let i = 0; i < 2 + (k % 3); i++) pts.push([tire()*800-400, tire()*800-400]);
      const c0 = G.centreDoigts(map(...pts));
      const T = [tire()*600-300, tire()*600-300];
      const c1 = G.centreDoigts(map(...pts.map(p => [p[0]+T[0], p[1]+T[1]])));
      pire = Math.max(pire, Math.abs(c1[0] - c0[0] - T[0]), Math.abs(c1[1] - c0[1] - T[1]));
    }
    ok("le centre suit exactement les doigts qui glissent ensemble", pire < 1e-9,
       "< 1e-9", pire.toExponential(2),
       "200 tirages de deux à quatre doigts : c'est ce qui fait que la pince ne "
       + "saute pas quand un doigt se pose en cours de geste");

    /* Le centre compte TOUS les doigts — un `/2` en dur donnerait le même
       résultat à deux doigts et se verrait seulement au troisième. */
    const c2 = G.centreDoigts(map([0, 0], [100, 0]));
    const c3 = G.centreDoigts(map([0, 0], [100, 0], [200, 0]));
    ok("le troisième doigt déplace bien le centre", c2[0] === 50 && c3[0] === 100,
       "50 puis 100", c2[0] + " puis " + c3[0],
       "un « ÷ 2 » écrit en dur rendrait 50 puis 150 : invisible à deux doigts, "
       + "faux dès le troisième");
  }

  /* ── CE QUI EST ÉPINGLÉ : `ecartDoigts` ne compte pas ses doigts.

     Avec un seul, la déstructuration rend `undefined` et la lecture lève. Avec
     trois, elle mesure entre les deux PREMIERS pendant que le centre, lui, en
     compte trois — deux lois pour un même geste. Rien de tout cela n'est
     atteignable aujourd'hui ; tout est figé ici pour le jour où ça le devient. */
  {
    let leve = false;
    try { G.ecartDoigts(map([1, 2])); } catch(e){ leve = true; }
    ok("un seul doigt : `ecartDoigts` LÈVE — épinglé tel quel", leve,
       "une exception", leve ? "une exception" : "une valeur, sans broncher",
       "les deux appels de la page sont sous un `doigts.size === 2`, donc elle "
       + "dit vrai aujourd'hui. Voir le constat en fin de course");
    let leve0 = false;
    try { G.ecartDoigts(map()); } catch(e){ leve0 = true; }
    ok("aucun doigt : elle lève aussi", leve0, "une exception",
       leve0 ? "une exception" : "une valeur");

    const trois = map([0, 0], [30, 40], [1000, 1000]);
    ok("trois doigts : elle mesure les DEUX PREMIERS et ignore le reste",
       G.ecartDoigts(trois) === 50, "50 — la distance des deux premiers",
       G.ecartDoigts(trois),
       "pendant que `centreDoigts` en compte trois : deux lois pour un même "
       + "geste, le jour où un troisième doigt se pose pendant une pince");

    ok("aucun doigt : `centreDoigts` rend des NaN plutôt que de lever",
       G.centreDoigts(map()).every(Number.isNaN), "[NaN, NaN]",
       "[" + G.centreDoigts(map()).join(", ") + "]",
       "les deux sœurs ne se comportent pas pareil sur la même entrée vide — "
       + "figé, non corrigé");
  }
}

/* ═══════════════════════════ 8. LE REGARD : LE LACET LIBRE, LE TANGAGE SERRÉ

   D'où vient la vérité ici : l'ADDITIVITÉ et la RÉVERSIBILITÉ d'une
   intégration. Un geste découpé en cent morceaux vaut le geste entier ; un
   geste suivi de son opposé ramène au point de départ. Ce sont des propriétés
   d'une somme, elles ne disent rien de la formule.

   Et leur PERTE est la signature observable d'un serrage : au contact de la
   borne, l'aller-retour ne revient plus. C'est ainsi qu'on voit la borne sans
   la lire, et qu'on distingue « serré » de « juste très lent ». */
function controleRegard(G){
  const S = G.SENS;
  const suite = (l0, t0, gestes) => {
    let r = { lacet: l0, tangage: t0 };
    for(const [dx, dy] of gestes) r = G.regard(r.lacet, r.tangage, dx, dy, S);
    return r;
  };

  // ── elle reçoit et rend : aucun état caché, aucune écriture
  {
    const a = G.regard(0.3, -0.2, 40, 25, S);
    const b = G.regard(0.3, -0.2, 40, 25, S);
    G.regard(9, 9, 900, 900, S);                       // du bruit entre les deux
    const c = G.regard(0.3, -0.2, 40, 25, S);
    ok("deux appels identiques rendent la même chose, quoi qu'il se passe entre",
       a.lacet === b.lacet && a.tangage === b.tangage
         && a.lacet === c.lacet && a.tangage === c.tangage,
       "trois fois le même couple",
       a.lacet.toFixed(9) + " / " + a.tangage.toFixed(9),
       "un scalaire lié plutôt que reçu ferait dériver le second appel — c'est "
       + "la leçon de `nChute`, et elle se contrôle en une ligne");
    ok("et elle rend bien un couple nommé",
       typeof a.lacet === "number" && typeof a.tangage === "number",
       "{ lacet, tangage }", JSON.stringify(a));
  }

  // ── les sens : on regarde là où l'on pousse
  {
    const r = G.regard(0, 0, 100, 100, S);
    ok("pousser vers la droite fait tourner le lacet dans le sens positif",
       r.lacet > 0, "> 0", r.lacet.toFixed(6));
    ok("pousser vers le bas fait descendre le tangage", r.tangage < 0, "< 0",
       r.tangage.toFixed(6),
       "l'écran compte ses y vers le bas : c'est ce signe-là qui décide si la "
       + "commande est « naturelle » ou « inversée »");
    ok("ne rien pousser ne bouge rien",
       G.regard(0.7, -0.3, 0, 0, S).lacet === 0.7
         && G.regard(0.7, -0.3, 0, 0, S).tangage === -0.3,
       "le couple inchangé", JSON.stringify(G.regard(0.7, -0.3, 0, 0, S)));
    ok("une sensibilité nulle non plus",
       G.regard(0.7, -0.3, 5000, -5000, 0).lacet === 0.7,
       "0,7", G.regard(0.7, -0.3, 5000, -5000, 0).lacet);
  }

  // ── l'additivité : cent petits gestes valent un grand
  {
    let pire = 0;
    for(const [DX, DY] of [[300, 120], [-450, 200], [17, -9]]){
      for(const N of [2, 10, 100, 1000]){
        const un = suite(0.2, 0.1, [[DX, DY]]);
        const morceaux = [];
        for(let i = 0; i < N; i++) morceaux.push([DX/N, DY/N]);
        const cent = suite(0.2, 0.1, morceaux);
        pire = Math.max(pire, Math.abs(cent.lacet - un.lacet),
                              Math.abs(cent.tangage - un.tangage));
      }
    }
    ok("un geste découpé en mille vaut le geste entier", pire < 1e-12,
       "< 1e-12 rad", pire.toExponential(2),
       "c'est la propriété d'une somme, pas la formule de la somme — et elle "
       + "tient tant qu'on ne touche pas la borne");
  }

  // ── la réversibilité, LOIN de la borne
  {
    let pire = 0;
    const tire = alea(31415);
    for(let k = 0; k < 300; k++){
      const dx = (tire()*2-1)*200, dy = (tire()*2-1)*80;
      const r = suite(0.4, 0.05, [[dx, dy], [-dx, -dy]]);
      pire = Math.max(pire, Math.abs(r.lacet - 0.4), Math.abs(r.tangage - 0.05));
    }
    ok("loin de la borne, un geste et son opposé ramènent au départ", pire < 1e-12,
       "< 1e-12 rad", pire.toExponential(2), "300 tirages à graine");
  }

  /* ── LA BORNE, VUE PAR LA PERTE DE RÉVERSIBILITÉ.
     C'est la signature d'un serrage, et elle ne lit aucune constante : on pousse
     fort vers le bas, on revient exactement d'autant, et l'on n'est plus au
     point de départ. Un regard simplement lent reviendrait. */
  {
    const r = suite(0, 0, [[0, 100000], [0, -100000]]);
    ok("au contact de la borne, l'aller-retour NE revient plus",
       Math.abs(r.tangage) > 0.5, "> 0,5 rad d'écart au départ",
       Math.abs(r.tangage).toFixed(6) + " rad",
       "la signature observable d'un serrage : sans lui, un aller-retour exact "
       + "reviendrait exactement, comme il le fait pour le lacet");
    const l = suite(0, 0, [[100000, 0], [-100000, 0]]);
    ok("… alors que le lacet, lui, revient", Math.abs(l.lacet) < 1e-9,
       "< 1e-9 rad", Math.abs(l.lacet).toExponential(2),
       "les deux axes ne sont pas traités pareil, et c'est voulu");
  }

  /* ── LE SUP ATTEIGNABLE, BALAYÉ PUIS CONFRONTÉ.
     On ne lit pas la borne : on cherche la plus grande valeur qu'une suite de
     gestes puisse produire, sur des milliers de gestes, puis on la confronte à
     ce que le module annonce ET à ce qu'un cou peut faire. */
  {
    const tire = alea(2718);
    let sup = -Infinity, inf = Infinity, atteintHaut = 0, atteintBas = 0;
    let r = { lacet: 0, tangage: 0 };
    for(let k = 0; k < 20000; k++){
      const dy = (tire()*2-1)*Math.pow(10, tire()*7);      // de 1 px à 10 millions
      r = G.regard(r.lacet, r.tangage, (tire()*2-1)*500, dy, S);
      sup = Math.max(sup, r.tangage); inf = Math.min(inf, r.tangage);
      if(r.tangage === G.TANGAGE_MAX) atteintHaut++;
      if(r.tangage === -G.TANGAGE_MAX) atteintBas++;
    }
    ok("20 000 gestes : le tangage ne sort jamais de ce qu'il annonce",
       sup <= G.TANGAGE_MAX && inf >= -G.TANGAGE_MAX,
       "dans [−" + G.TANGAGE_MAX + ", " + G.TANGAGE_MAX + "]",
       "[" + inf.toFixed(9) + ", " + sup.toFixed(9) + "]");
    ok("… et la borne est ATTEINTE des deux côtés, pas seulement respectée",
       sup === G.TANGAGE_MAX && inf === -G.TANGAGE_MAX && atteintHaut > 50 && atteintBas > 50,
       "±" + G.TANGAGE_MAX + " exactement",
       atteintHaut + " fois en haut, " + atteintBas + " fois en bas",
       "une borne qu'aucun geste n'atteint n'est pas éprouvée");

    /* L'ANCRAGE QUI NE VIENT PAS DU MODULE. « On ne se casse pas la nuque » a
       un sens géométrique : au-delà de la verticale, le regard bascule
       par-dessus et l'image se retourne. Le serrage doit donc rester STRICTEMENT
       en deçà d'un quart de tour — et ne pas être si serré qu'on ne puisse plus
       regarder ses pieds. C'est ce contrôle qui reste debout quand la constante
       elle-même est déplacée. */
    ok("la borne est un angle de nuque plausible", sup > 0.6 && sup < Math.PI/2,
       "entre 0,6 et " + (Math.PI/2).toFixed(4) + " rad (le quart de tour)",
       sup.toFixed(6) + " rad, soit " + (sup*180/Math.PI).toFixed(1) + "°",
       "au-delà du quart de tour le regard passe par-dessus et l'image se "
       + "retourne ; en deçà de 0,6 on ne peut plus regarder ses pieds");

    // un seul geste énorme, d'un coup : le serrage n'a pas besoin de plusieurs pas
    ok("un `dy` énorme d'un seul coup est serré, pas accumulé",
       G.regard(0, 0, 0, 1e12, S).tangage === -G.TANGAGE_MAX
         && G.regard(0, 0, 0, -1e12, S).tangage === G.TANGAGE_MAX,
       "∓" + G.TANGAGE_MAX + " exactement",
       G.regard(0, 0, 0, 1e12, S).tangage + " / " + G.regard(0, 0, 0, -1e12, S).tangage);
    ok("… et même un `dy` infini", G.regard(0, 0, 0, Infinity, S).tangage === -G.TANGAGE_MAX,
       -G.TANGAGE_MAX, G.regard(0, 0, 0, Infinity, S).tangage,
       "la capture du pointeur livre `movementX/Y` bruts : rien ne garantit "
       + "qu'un pilote fou de souris ne rende pas une valeur absurde");
  }

  /* ── LE LACET N'EST PAS BORNÉ, ET ON LE VÉRIFIE.
     Le serrer « pour faire propre » bloquerait le promeneur face à un mur au
     bout de quelques gestes, sans que rien ne le dise. */
  {
    let r = { lacet: 0, tangage: 0 };
    for(let k = 0; k < 20000; k++) r = G.regard(r.lacet, r.tangage, 100, 0, S);
    const tours = Math.abs(r.lacet)/(2*Math.PI);
    ok("le lacet fait plusieurs tours sans jamais être serré", tours > 100,
       "> 100 tours", tours.toFixed(1) + " tours (" + r.lacet.toFixed(1) + " rad)",
       "20 000 gestes de 100 px vers la droite : on doit pouvoir tourner sur "
       + "soi-même indéfiniment");
    ok("… et il vaut exactement la somme des gestes",
       Math.abs(r.lacet - 20000*100*S)/Math.abs(r.lacet) < 1e-12,
       (20000*100*S).toFixed(6), r.lacet.toFixed(6),
       "la somme est calculée ici en une multiplication, le module l'a faite en "
       + "vingt mille additions : deux chemins pour le même nombre");
    ok("un seul geste gigantesque ne le borne pas non plus",
       Math.abs(G.regard(0, 0, 1e9, 0, S).lacet) > 1e5, "> 1e5 rad",
       G.regard(0, 0, 1e9, 0, S).lacet.toExponential(3));
  }

  /* ── LA SENSIBILITÉ ANNONCÉE A-T-ELLE UN SENS ? Un demi-tour doit tenir dans
     un geste de souris : ni trois pixels, ni trois écrans. C'est un ancrage
     d'usage, il ne sort pas du module. */
  {
    const pxDemiTour = Math.PI/G.SENS;
    ok("un demi-tour de regard tient dans un geste de souris",
       pxDemiTour > 300 && pxDemiTour < 3000,
       "entre 300 et 3 000 px", pxDemiTour.toFixed(0) + " px",
       "assez lent pour viser un objet, assez vif pour faire demi-tour d'un "
       + "geste — le réglage se juge à l'œil, l'ordre de grandeur se calcule");
    ok("et un pixel de souris avance le lacet d'exactement la sensibilité",
       G.regard(0, 0, 1, 0, G.SENS).lacet === G.SENS, G.SENS, G.regard(0, 0, 1, 0, G.SENS).lacet);
  }
}

// ══════════════════════════════════════════════════════ on joue tout, en clair
groupe("Le garde-fou : la mesure a bien eu lieu");
controleGardeFou(GESTES);
groupe("La zone morte — des deux côtés du seuil");
controleZoneMorte(GESTES);
groupe("La loi de la vitesse : la droite, puis le plafond");
controleLoiVitesse(GESTES);
groupe("Le lancer est dans le plan, et ses deux sorties s'accordent");
controlePlanEtAccord(GESTES);
groupe("La direction suit le geste");
controleDirection(GESTES);
groupe("Le cas dégénéré — épinglé, non corrigé");
controleDegenere(GESTES);
groupe("La pince à deux doigts");
controlePince(GESTES);
groupe("Le regard : le lacet libre, le tangage serré");
controleRegard(GESTES);

/* ══════════════════════════════════ 9. LE CONTRÔLE SAIT-IL ÉCHOUER ?  (règle 2)

   On copie l'objet `GESTES`, on remplace UNE fonction par une version
   subtilement fausse, on rejoue EN SILENCE le groupe qui la surveille, et l'on
   exige qu'il tombe. Aucun fichier n'est touché sur le disque.

   Les sabotages sont écrits comme des ENVELOPPES autour de la vraie fonction
   partout où c'est possible : une copie réécrite à la main apprendrait par cœur
   ce que le module fait, y compris ses fautes, et l'on ne saurait plus si le
   contrôle mord ou si les deux copies divergent. Deux sabotages font exception
   et sont dits sur place.                                                     */
groupe("Le contrôle sait échouer — on casse le module pour le prouver");

function essaie(nom, G, controles, note){
  carnet = [];
  try { for(const f of controles) f(G); }
  catch(err){ carnet.push({ nom: "exception : " + err.message, vrai: false }); }
  const lot = carnet; carnet = null;
  const tombes = lot.filter(c => !c.vrai);
  ok(nom, tombes.length > 0, "au moins un contrôle tombe",
     tombes.length + " tombés sur " + lot.length,
     tombes.length ? "→ " + tombes.slice(0, 3).map(c => c.nom).join(" ; ")
                   : "AUCUN — le groupe visé ne surveille donc rien"
                     + (note ? ". " + note : ""));
}
const copie = sup => Object.assign({}, GESTES, sup);
const vdg = GESTES.vitesseDepuisGlisse;

/* ── 1. LA ZONE MORTE DÉPLACÉE D'UN CHOUÏA : d'un millième de hauteur d'écran,
   soit moins d'un pixel sur un téléphone. Personne ne le sentirait jamais en
   jouant. L'enveloppe refuse la bande qui vient d'être ajoutée et ne touche à
   rien d'autre — c'est le seuil, et lui seul, qui bouge. */
essaie("une zone morte déplacée d'un millième de hauteur d'écran",
       copie({ vitesseDepuisGlisse: (cam, visee, vue, nrm) => {
                 const g = vdg(cam, visee, vue, nrm);
                 return g && g.vitesse < (GESTES.ZONE_MORTE + 0.001)*GESTES.K_GLISSE
                        ? null : g;
               } }),
       [controleZoneMorte]);

/* ── 2. LE PLAFOND RETIRÉ. Celui-là ne peut pas s'envelopper : le rognage a
   lieu au milieu de la fonction, et l'annuler après coup demanderait de
   recalculer la vitesse — donc de recopier la formule qu'on éprouve. On
   remplace donc le seuil dans une COPIE EN MÉMOIRE du source, et l'on recharge
   le module entier. Le fichier sur le disque n'est jamais touché. */
{
  const motif = /V_MAX = 0\.9;/;
  if(!motif.test(SRC)){
    ok("le plafond se retrouve dans le source pour être saboté", false,
       "le motif `V_MAX = 0.9;`", "introuvable",
       "sans lui, ce fichier ne peut plus prouver que le contrôle du plafond "
       + "mord. Si le seuil a changé de forme, ce sabotage doit être RÉÉCRIT, "
       + "pas supprimé");
  } else {
    let sansPlafond = null;
    try { sansPlafond = charge(SRC.replace(motif, "V_MAX = 1e9;"), "GESTES"); }
    catch(err){ /* dit juste en dessous */ }
    if(!sansPlafond || typeof sansPlafond.vitesseDepuisGlisse !== "function"){
      ok("le module saboté se charge encore", false, "un module mutant",
         "il ne se charge plus — sabotage inexploitable");
    } else {
      essaie("un lancer sans le plafond à 0,9", sansPlafond, [controleLoiVitesse]);
    }
  }
}

/* ── 3. LE TANGAGE QUI N'EST PLUS SERRÉ. Réécrit à la main, parce qu'il n'y a
   rien à envelopper : un serrage retiré après coup demanderait de savoir ce
   qu'il y avait avant. C'est le seul endroit du fichier où la formule du module
   est recopiée, et c'est du côté du saboteur — jamais du côté de l'arbitre. */
essaie("un regard dont le tangage n'est plus serré",
       copie({ regard: (lacet, tangage, dx, dy, sens) =>
                 ({ lacet: lacet + dx*sens, tangage: tangage - dy*sens }) }),
       [controleRegard]);

/* ── 4. LE LACET SERRÉ PAR ERREUR — le geste « propre » qui bloque le promeneur
   face à un mur au bout de quelques tours, sans qu'aucun message n'apparaisse. */
essaie("un regard qui borne AUSSI le lacet, « pour faire propre »",
       copie({ regard: (lacet, tangage, dx, dy, sens) => {
                 const r = GESTES.regard(lacet, tangage, dx, dy, sens);
                 return { lacet: Math.max(-Math.PI, Math.min(Math.PI, r.lacet)),
                          tangage: r.tangage };
               } }),
       [controleRegard]);

/* ── 5. LE LANCER QUI SORT DU PLAN. Un millionième de millionième de composante
   verticale : la sonde part hors du plan du disque et sa trajectoire s'écarte
   lentement de celle que le calque avait dessinée. Rien à l'écran ne le dirait
   avant plusieurs secondes de vol. */
essaie("un lancer dont la composante verticale n'est plus nulle",
       copie({ vitesseDepuisGlisse: (cam, visee, vue, nrm) => {
                 const g = vdg(cam, visee, vue, nrm);
                 return g && { v: [g.v[0], 1e-12*g.vitesse, g.v[2]], vitesse: g.vitesse };
               } }),
       [controlePlanEtAccord]);

/* ── 6. LES DEUX SORTIES QUI DIVERGENT. `vitesse` dit une chose, `v` en dit une
   autre, d'un millionième : l'élastique du calque promet une orbite et le tir
   donne une chute. C'est la maladie du disque à 622×, en miniature. */
essaie("un lancer dont `v` et `vitesse` ne disent plus la même chose",
       copie({ vitesseDepuisGlisse: (cam, visee, vue, nrm) => {
                 const g = vdg(cam, visee, vue, nrm);
                 return g && { v: [g.v[0]*1.000001, g.v[1], g.v[2]*1.000001],
                               vitesse: g.vitesse };
               } }),
       [controlePlanEtAccord]);

/* ── 7. LA FAUTE D'ASPECT — celle qui a déjà coûté une heure entre `projette` et
   `surLePlan`. L'horizontale du geste est divisée par la LARGEUR au lieu de la
   hauteur : sur un écran carré c'est invisible, ailleurs le lancer part de
   travers, d'autant plus que la fenêtre est allongée. */
essaie("un lancer dont l'horizontale est divisée par la largeur",
       copie({ vitesseDepuisGlisse: (cam, visee, vue, nrm) =>
                 vdg(cam, Object.assign({}, visee,
                       { x: visee.x0 + (visee.x - visee.x0)*vue.H/vue.W }), vue, nrm) }),
       [controleDirection]);

/* ── 8. LES DEUX AXES RABATTUS ÉCHANGÉS. Le geste part à quatre-vingt-dix
   degrés de l'élastique dessiné — et comme l'élastique, lui, est juste, on
   accuse la physique. */
essaie("un lancer dont les deux axes rabattus sont échangés",
       copie({ vitesseDepuisGlisse: (cam, visee, vue, nrm) =>
                 vdg({ base: { d: cam.base.h, h: cam.base.d, a: cam.base.a } },
                     visee, vue, nrm) }),
       [controleDirection]);

/* ── 9. LA PINCE EN DISTANCE DE MANHATTAN. Elle croît et décroît comme il faut,
   elle est nulle au même endroit, elle est symétrique : tout est plausible,
   sauf le facteur, qui vaut jusqu'à √2. Le zoom serait simplement « bizarre ». */
essaie("un écartement mesuré en distance de Manhattan",
       copie({ ecartDoigts: doigts => {
                 const [a, b] = [...doigts.values()];
                 return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
               } }),
       [controlePince]);

/* ── 10. LE CENTRE QUI DIVISE PAR DEUX EN DUR. Invisible à deux doigts —
   c'est-à-dire dans toute la pince d'aujourd'hui — et faux dès le troisième. */
essaie("un centre qui divise par deux au lieu de compter les doigts",
       copie({ centreDoigts: doigts => {
                 let x = 0, y = 0;
                 for(const p of doigts.values()){ x += p[0]; y += p[1]; }
                 return [x/2, y/2];
               } }),
       [controlePince]);

/* ══════════════════════════════════════ CE QUI EST SIGNALÉ ET NON CORRIGÉ

   Cet outil est le portier : il n'écrit pas dans `gestes.js`. Trois constats
   sont sortis de sa rédaction et sont IMPRIMÉS ici, sans être comptés comme des
   échecs — ce ne sont pas des contrats trahis, ce sont des décisions à prendre
   par qui tient le module. Chacun porte l'assertion qui l'armerait, écrite en
   toutes lettres : il n'y a qu'à la poser le jour où le module change.        */
{
  console.log("\n  Constats — signalés, non corrigés, non comptés");
  console.log("  ─────────────────────────────────────────────");

  const { cam } = camMain(0.62, 0);
  const g = GESTES.vitesseDepuisGlisse(cam, glisse(0, 200), VUES[0], norm);
  if(g && len(g.v) === 0 && g.vitesse > 0){
    console.log("  ⚠   Caméra exactement dans le plan du disque : les deux sorties se");
    console.log("        contredisent. `v` vaut [0, 0, 0] et `vitesse` vaut "
                + g.vitesse.toFixed(3) + ".");
    console.log("        Le « haut » de l'écran n'a pas d'ombre dans le plan, `norm` d'un");
    console.log("        vecteur nul rend un vecteur nul, et la longueur du geste continue");
    console.log("        de compter. Le calque colorerait donc un élastique prometteur");
    console.log("        au-dessus d'une sonde lâchée à l'arrêt, qui tombe droit dans");
    console.log("        l'astre. L'élévation exactement nulle est atteignable : `verif.js`");
    console.log("        la pose (cam.elev = 0.0), et l'ouverture cinématique la traverse.");
    console.log("        L'assertion à armer le jour où le module se garde :");
    console.log("            ok(\"caméra dans le plan : |v| vaut toujours `vitesse`\",");
    console.log("               Math.abs(len(g.v) - g.vitesse) < 1e-15, …);");
    console.log("");
  }

  console.log("  ⚠   `ecartDoigts` ne compte pas ses doigts, `centreDoigts` si.");
  console.log("        À un doigt la première lève une exception là où la seconde rend ce");
  console.log("        doigt ; à zéro elle lève encore, la seconde rend des NaN ; à trois");
  console.log("        elle mesure les deux premiers et la seconde en moyenne trois.");
  console.log("        Les deux appels de la page sont sous un");
  console.log("        `doigts.size === 2`, donc rien n'est faux aujourd'hui — mais la");
  console.log("        pince mélangerait deux lois pour un même geste au premier");
  console.log("        troisième doigt. La question n'est pas d'ajouter une garde : c'est");
  console.log("        de décider ce que la pince DOIT faire à trois doigts.");
  console.log("");

  console.log("  ⚠   Le geste est mesuré sur le canevas WebGL (`cv.clientHeight`) alors");
  console.log("        que le calque et les deux ponts de `camera.js` mesurent sur le");
  console.log("        canevas 2D (`ui`). Les deux sont en plein écran par la même règle");
  console.log("        CSS, donc les nombres coïncident — mais c'est exactement la forme");
  console.log("        du défaut que `camera.js` vient de refermer : deux mesures pour");
  console.log("        une seule image. Rien ici ne peut le voir, puisque la hauteur");
  console.log("        arrive maintenant en argument ; c'est au point d'appel de choisir.");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
