/* ============================================================================
   LA CAMÉRA, ÉPROUVÉE SANS ÉCRAN

       node outil-verif-camera.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   `camera.js` est le seul endroit du site qui décide D'OÙ l'on regarde. Trois
   mondes en dépendent — le lancer de géodésiques en WebGL, le calque à deux
   dimensions où l'on pose les sondes, et le pointeur qui désigne un endroit du
   disque — et ils ne s'accordent que parce qu'ils partagent la même position,
   la même base et la même focale.

   Le danger de ce domaine n'est pas qu'il plante : c'est qu'il MENTE SANS
   BRUIT. Une base qui perd son orthogonalité, une caméra posée à 1,0001 fois
   sa distance, deux mesures de l'image entre l'aller et le retour : rien ne
   casse. Les sondes se mettent simplement à tourner autour d'un centre décalé,
   le clic vise à côté du point qu'on lui montrait, et l'écart se voit
   horizontalement mais pas verticalement — ce qui est la PIRE des signatures,
   parce qu'elle ressemble à un défaut de physique. C'est arrivé, et l'on a
   cherché une heure une erreur qui n'existait pas.

   L'extraction du domaine hors d'`index.html` vient de refermer ce piège en
   faisant passer `vue` en argument, la MÊME aux deux fonctions. Cet outil est
   là pour qu'il reste fermé.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI  (règle 3)

   Aucun contrôle ne recopie une formule du module en face d'elle-même. Six
   sources, toutes extérieures :

   1. UNE IDENTITÉ. `projette` et `surLePlan` sont inverses exactes — c'est
      démontré dans l'en-tête du module, pas espéré. Un aller-retour se referme
      ou ne se referme pas ; il n'y a rien à interpréter. Et l'on éprouve LES
      DEUX SENS, monde → pixel → monde et pixel → monde → pixel, parce qu'une
      paire de fonctions qui ignoreraient toutes deux `vue.H` refermerait
      parfaitement la boucle en étant fausse.

   2. LA TRIGONOMÉTRIE SPHÉRIQUE, prise à l'envers. Le module va de
      (dist, elev, azim) vers un vecteur cartésien ; le contrôle revient du
      vecteur vers les trois angles, par `asin` et `atan2`. C'est le chemin
      inverse, pas le même recopié.

   3. LA GÉOMÉTRIE DE LA PROJECTION. « La caméra regarde l'origine » n'est pas
      vérifié sur la formule qui pose `a`, mais sur sa CONSÉQUENCE OBSERVABLE :
      le centre du trou noir doit tomber au pixel exact ⌊W/2, H/2⌋. Et
      « tan(demi-champ) = 1/F » se vérifie en posant un point à l'angle
      atan(1/F) au-dessus de l'axe et en exigeant qu'il atterrisse sur le bord
      haut de l'image, à py = 0.

   4. LA MÉTRIQUE DE SCHWARZSCHILD, pour la vitesse locale. En posant
      f = 1 − r_s/r, le temps du statique bat dτ = √f·dt et sa règle radiale
      est étirée de 1/√f. Une particule dont la vitesse EN COORDONNÉES vaut
      (dr/dt, r·dφ/dt) = (f·β·cos θ, √f·β·sin θ) est donc mesurée localement à
      β exactement, QUEL QUE SOIT r et quel que soit θ. C'est une prédiction
      indépendante du module, et elle est invariante en rayon — ce qui la rend
      redoutable : une erreur d'un √f quelque part la fait dériver avec r.

   5. UN MINIMUM ÉCHANTILLONNÉ CONTRE UN MINIMUM ANALYTIQUE. `occulte` résout
      en forme fermée le point du segment le plus proche du centre. L'arbitre
      parcourt le segment en vingt mille pas et prend le plus petit rayon vu.
      Deux façons sans rapport de répondre à la même question.

   6. DES SEUILS TROUVÉS PAR BISSECTION, jamais recopiés. Le refus des sondes
      trop basses, la pénalité qui les déclasse, le rayon où l'éclat sature :
      chacun est retrouvé en cherchant où le comportement bascule, puis
      confronté à ce que le module annonce.

   ---------------------------------------------------------------------------
   LE SENS DE LA BASE — VÉRIFIÉ, PAS SUPPOSÉ

   Les trois branches posent `cam.base = { d, h: cross(d, a), a }`. Donc
   h = d × a, et par la formule du double produit vectoriel,

       d × h = d × (d × a) = d·(d·a) − a·(d·d) = −a       (car d ⟂ a et |d| = 1)

   La base (d, h, a) est donc INDIRECTE au sens usuel : d × h = −a, et non +a.
   Ce n'est pas une faute, c'est la convention d'une caméra qui regarde vers
   son PROPRE +z — `projette` prend x = q·d vers la droite, y = q·h vers le
   haut, z = q·a vers l'avant. L'attente écrite plus bas est donc −a, et elle a
   été mesurée avant d'être écrite, dans les trois lieux.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le dernier groupe copie l'objet `CAMERA` en mémoire, remplace UNE fonction
   par une version subtilement fausse, rejoue en silence le groupe de contrôles
   correspondant et exige qu'il tombe. Neuf sabotages, dont les trois qui
   comptent le plus :

     · une `surLePlan` qui lit `vue.W` là où elle doit lire `vue.H` — la faute
       d'origine, celle des deux mesures pour une seule image ;
     · une `majLibre` dont `h` est penché d'un centième de radian sur `d` : la
       base reste unitaire, elle n'est plus orthogonale, et rien à l'écran ne
       le dirait ;
     · une `majSonde` sans le plafond à 0,97 c, obtenue en remplaçant le seuil
       dans une copie EN MÉMOIRE du source — le fichier sur le disque n'est
       jamais touché.

   Le fichier échoue si un sabotage passe inaperçu : un contrôle incapable de
   prouver qu'il sait tomber ne surveille rien.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS, ET IL FAUT LE DIRE

   La déflexion : `projette` est une projection DROITE, posée par-dessus une
   image relativiste. Le calque de repérage et le ciel calculé ne coïncident
   donc pas exactement près de l'ombre, et c'est assumé dans le module — un
   repère qui suivrait la lentille mentirait sur ce qu'il repère. Rien ici ne
   mesure cet écart ; il se juge à l'œil.

   Ne sont pas couverts non plus : le confort de la commande (vitesse de
   rotation, inertie), le raccord visuel au moment d'embarquer, et tout ce que
   `?juge` existe pour recueillir.

   ---------------------------------------------------------------------------
   CE QUI EST SIGNALÉ ET NON CORRIGÉ

   Cet outil est le portier : il n'écrit pas dans `camera.js`. Trois constats
   sont ressortis de sa rédaction et sont IMPRIMÉS en fin de course, sous
   « ⚠ », sans être comptés comme des échecs — la décision appartient à qui
   tient le module :

     · `majSalon` ne remet pas `cam.vitesse` à zéro. `majLibre` le fait
       explicitement, avec son commentaire ; la branche du salon ne le fait
       pas. Le chemin sonde → salon est atteignable en un bouton.
     · une sonde au centre EXACT rend une base entièrement NaN. L'état n'est
       pas atteignable — `vol.js` gèle une sonde dès 1,05 rayon — mais
       `cockpit.js` a jugé bon d'y survivre.
     · la pénalité de `meilleureSonde` vaut 40, ce qui ne déclasse pas une
       sonde basse « derrière n'importe quelle autre » comme l'annonce son
       commentaire, mais derrière celles à moins d'une cinquantaine de rayons.

   Aucun n'est un contrat trahi : ce sont des décisions à prendre. Les deux
   premiers portent l'assertion qui les armerait, écrite en toutes lettres à
   côté du constat — il n'y a qu'à la poser le jour où le module change.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN      = path.join(ICI, "camera.js");
const CHEMIN_PHYS = path.join(ICI, "physique.js");

console.log("\n  LA CAMÉRA — CONTRÔLE NUMÉRIQUE");
console.log("  ══════════════════════════════");

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

   S'il en manque un, on ne rend PAS un zéro échec. Un outil qui n'a rien
   mesuré et qui sort en code 0 endort exactement comme un contrôle incapable
   d'échouer : `node tout.js` afficherait un filet complet sur un trou. */
for(const [f, quoi] of [[CHEMIN_PHYS, "physique.js"], [CHEMIN, "camera.js"]])
  if(!fs.existsSync(f))
    stop(quoi + " n'existe pas — RIEN N'A ÉTÉ MESURÉ", [
      "Cet outil charge les deux modules hors navigateur et refuse de conclure",
      "tant qu'il n'a pas les deux sous la main.",
    ]);

const SRC      = fs.readFileSync(CHEMIN, "utf8");
const SRC_PHYS = fs.readFileSync(CHEMIN_PHYS, "utf8");

/* Les deux modules se referment sur un faux global. `camera.js` finit par
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

let PHYSIQUE, CAMERA;
try {
  PHYSIQUE = charge(SRC_PHYS, "PHYSIQUE");
  CAMERA   = charge(SRC, "CAMERA");
} catch(err){
  stop("un module ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "",
    "Les modules doivent pouvoir s'évaluer hors navigateur : ni DOM, ni WebGL,",
    "ni `document` au chargement. C'est ce qui les rend vérifiables sans écran.",
  ]);
}

const CONTRAT = ["FOCAL", "etat", "maj", "majLibre", "majSalon", "majSonde",
                 "projette", "surLePlan", "occulte", "meilleureSonde",
                 "embarque", "bouton"];
if(!CAMERA)
  stop("camera.js s'est chargé mais n'expose pas `CAMERA`", [
    "attendu   global.CAMERA = { " + CONTRAT.join(", ") + " }",
  ]);
{
  const manque = CONTRAT.filter(k => CAMERA[k] === undefined);
  if(manque.length)
    stop("camera.js n'expose pas tout son contrat", [
      "manquant  " + manque.join(", "),
      "trouvé    " + Object.keys(CAMERA).join(", "),
    ]);
}
if(!PHYSIQUE || typeof PHYSIQUE.cross !== "function")
  stop("physique.js n'expose pas ses opérations vectorielles", [
    "attendu   PHYSIQUE.{ cross, dot, len, norm }",
  ]);

/* Les quatre opérations viennent de PHYSIQUE, elles ne sont pas réécrites ici.
   Les réécrire ferait DEUX LOIS POUR UN MÊME ESPACE — c'est la maladie que ce
   dépôt traque, et un outil qui l'attrape ne peut pas la dénoncer. */
const { cross, dot, len, norm, R_HORIZON, R_OMBRE, R_ISCO, R_PHOTON, M } = PHYSIQUE;
const OPS = { cross, dot, len, norm, horizon: R_HORIZON };

// ── petites commodités, toutes bâties sur les quatre opérations ci-dessus
const moins  = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
const fois   = (a, k) => [a[0]*k, a[1]*k, a[2]*k];
const plus   = (a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
const ecartV = (a, b) => len(moins(a, b));
const fini   = v => v.every(Number.isFinite);

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

/* ════════════════════════════════════════════════ les mesures d'image éprouvées

   Le carré est là pour la couverture, et l'on note tout de suite ce qu'il ne
   peut PAS faire : quand W = H, une fonction qui confondrait les deux mesures
   se comporterait exactement comme la bonne. Il ne prouve donc rien à lui seul,
   et c'est pourquoi il n'est jamais seul.

   Les deux téléphones portent la même largeur et deux hauteurs : c'est le cas
   réel de la barre d'adresse qui se rétracte au défilement, celui-là même qui a
   produit le défaut que l'extraction vient de réparer. */
const VUES = [
  { nom: "grand écran",                W: 1440, H:  900 },
  { nom: "téléphone, barre déployée",  W:  390, H:  620 },
  { nom: "téléphone, barre rétractée", W:  390, H:  684 },
  { nom: "téléphone couché",           W:  844, H:  390 },
  { nom: "tablette debout",            W: 1024, H: 1366 },
  { nom: "carré — aveugle au rapport", W:  900, H:  900 },
];

/* ═══════════════════════════════════════════════ les trois lieux, montés à la main

   Chacun rend une caméra RANGÉE, prête à être interrogée. On les rebâtit à
   chaque fois plutôt que de les partager : un contrôle qui hérite de l'état
   laissé par le précédent mesure depuis un point de vue qu'il n'a pas choisi
   (règle 5), et c'est exactement le piège qui s'était refermé sur `couture()`. */

function envLibre(){
  return Object.assign({ lieu: "libre", sonde: null, sondes: [] }, OPS);
}

function camLibre(C, dist, elev, azim){
  const cam = C.etat();
  if(dist !== undefined) cam.dist = dist;
  if(elev !== undefined) cam.elev = elev;
  if(azim !== undefined) cam.azim = azim;
  C.majLibre(cam, envLibre());
  return cam;
}

/* Une sonde dont la vitesse locale vaut EXACTEMENT β, quel que soit son rayon.

   C'est l'arbitre du plafond, et il vient de la métrique, pas du module. Avec
   f = 1 − r_s/r, la règle radiale du statique est étirée de 1/√f et son horloge
   ralentie de √f. Une vitesse en coordonnées de composantes

       dr/dt = f·β·cos θ        r·dφ/dt = √f·β·sin θ

   est donc mesurée localement à √(β²cos²θ + β²sin²θ) = β, sans dépendre de r.
   Un √f oublié quelque part ferait dériver ce nombre avec le rayon. */
function sondeA(r, beta, theta, direction){
  const rh = norm(direction || [0.3, 0.5, 0.8]);
  const p  = fois(rh, r);
  const th = norm(cross(rh, [0, 1, 0]));          // une tangente, ⟂ à rh
  const f  = 1 - R_HORIZON/r;
  const v  = plus(fois(rh, f*beta*Math.cos(theta)),
                  fois(th, Math.sqrt(f)*beta*Math.sin(theta)));
  return { p, v, sort: "orbite" };
}

function camSonde(C, sonde, lacet, tangage){
  const cam = C.etat();
  cam.regard.lacet   = lacet   || 0;
  cam.regard.tangage = tangage || 0;
  C.majSonde(cam, Object.assign({ sondes: [sonde], sonde: 0 }, OPS));
  return cam;
}

/* Le repère du regard dans la pièce. Le module le REÇOIT tout calculé — le
   lacet et le tangage du promeneur appartiennent à l'arpentage — et le contrat
   n'exige de lui qu'une chose : que { av, dr } soit orthonormé.

   Il est construit ici SANS recopier `regardSalon()` d'`index.html` : on part
   d'une direction de visée, on prend une horizontale qui lui est
   perpendiculaire, et l'on tourne autour d'elle. À roulis nul cela retombe sur
   ce que la page produit ; avec un roulis, cela couvre plus large que ce
   qu'elle produit aujourd'hui, ce qui est le rôle d'un contrôle. */
function repereSalon(lacet, tangage, roulis){
  const ct = Math.cos(tangage), st = Math.sin(tangage);
  const av = [ct*Math.sin(lacet), st, -ct*Math.cos(lacet)];
  const d0 = norm(cross(av, [0, 1, 0]));
  const h0 = cross(d0, av);
  const cr = Math.cos(roulis || 0), sr = Math.sin(roulis || 0);
  return { av, dr: plus(fois(d0, cr), fois(h0, sr)) };
}

function etatSalon(r, ts, incline){
  const u = norm([0.6, 0.28, -0.75]);
  const p = fois(u, r);
  // une vitesse quelconque, non colinéaire à p : elle ne sert qu'à donner une
  // normale orbitale, et un module qui prendrait p pour normale se ferait voir
  const v = norm(cross(p, incline || [0.2, 1, 0.35]));
  return { p, v: fois(v, 0.14), horloge: ts };
}

function camSalon(C, salon, repere){
  const cam = C.etat();
  C.majSalon(cam, Object.assign({ salon, repere }, OPS));
  return cam;
}

/* ══════════════════════════════════════ 1. LE GARDE-FOU : a-t-on mesuré quelque chose ?

   Le piège que ce groupe existe pour éviter : une caméra qui ne serait jamais
   rangée, ou un `surLePlan` qui rendrait `null` partout, laissent une récolte
   VIDE. Tous les contrôles suivants deviennent alors des « rien de faux n'a été
   vu », c'est-à-dire du vert sur du néant. */
groupe("Le garde-fou : la mesure a bien eu lieu");
{
  const a = CAMERA.etat(), b = CAMERA.etat();
  a.pos[0] = 99; a.base.d[1] = 99; a.regard.lacet = 99;
  ok("`etat()` rend un objet NEUF à chaque appel",
     b.pos[0] === 0 && b.base.d[1] === 0 && b.regard.lacet === 0,
     "aucun partage", b.pos[0] === 0 && b.base.d[1] === 0 && b.regard.lacet === 0
       ? "trois écritures sans écho" : "une caméra en a modifié une autre",
     "deux caméras qui partageraient leurs tableaux, c'est la soupe de drapeaux "
     + "sous un autre nom — et l'on chercherait la faute dans la physique");

  const cam = camLibre(CAMERA);
  ok("la vue libre range la caméra", len(cam.pos) > 1 && fini(cam.pos) && fini(cam.base.a),
     "une position et une base finies",
     fini(cam.pos) ? "|pos| = " + len(cam.pos).toFixed(3) : "des NaN");
  ok("`cam.focale` porte bien la focale du module",
     cam.focale === CAMERA.FOCAL && CAMERA.FOCAL > 0,
     "cam.focale === CAMERA.FOCAL", cam.focale + " / " + CAMERA.FOCAL,
     "trois lecteurs partagent cette valeur — le nuanceur, la matrice du salon "
     + "et les deux ponts. Deux valeurs, et l'astre vu par la baie n'est plus "
     + "au même endroit que l'astre vu en vue libre");

  let touches = 0;
  for(let i = 1; i < 10; i++) for(let j = 1; j < 10; j++)
    if(CAMERA.surLePlan(cam, 1440*i/10, 900*j/10, { W:1440, H:900 })) touches++;
  if(touches < 20)
    stop("`surLePlan` ne touche presque jamais le plan — JE REFUSE DE CONCLURE", [
      touches + " pixels sur 81 rencontrent le plan du disque.",
      "Le contrôle de l'aller-retour compterait alors une poignée de cas et",
      "passerait au vert sans rien avoir éprouvé.",
    ]);
  ok("et le pointeur rencontre bien le plan du disque", touches >= 20,
     "≥ 20 pixels sur 81", touches,
     "sans cela, l'aller-retour ci-dessous serait vert sur une récolte vide");
}

/* ══════════════════════════ 2. `projette` ET `surLePlan` SE REFERMENT

   L'identité centrale du module, et la seule chose qui fasse qu'un clic tombe
   là où l'on regarde. On l'éprouve DANS LES DEUX SENS :

     · pixel → plan → pixel, qui se mesure en pixels, l'unité de la faute ;
     · plan → pixel → plan, qui se mesure en rayons, l'unité du monde.

   Et sur les trois lieux, parce que la base change de branche en branche mais
   pas l'identité.                                                            */
function controleAllerRetour(C){
  const scenes = [
    ["vue libre", () => camLibre(C, 21, 0.17, 0.6)],
    ["vue libre rasante", () => camLibre(C, 9, 0.06, 2.4)],
    ["à bord d'une sonde", () => camSonde(C, sondeA(9.5, 0.3, 0.8, [0.4, 0.42, -0.81]), 0.3, -0.2)],
    ["depuis le salon", () => camSalon(C, etatSalon(16, 7), repereSalon(0.4, -0.15, 0))],
  ];

  for(const [nomScene, monte] of scenes){
    const cam = monte();
    let pirePx = 0, pireMonde = 0, tours = 0, ouPx = "", ouMonde = "";

    for(const vue of VUES){
      for(let i = 1; i < 12; i++) for(let j = 1; j < 12; j++){
        const px = vue.W*i/12, py = vue.H*j/12;
        const q = C.surLePlan(cam, px, py, vue);
        if(!q) continue;
        // Un point à dix mille rayons n'est plus un point du disque : c'est un
        // rayon rasant, et sa précision absolue ne veut plus rien dire.
        if(len(q) > 400) continue;
        if(Math.abs(q[1]) > 1e-9){
          ok(nomScene + " — `surLePlan` rend un point HORS du plan y = 0", false,
             "y = 0", q[1].toExponential(2));
          return;
        }
        const r = C.projette(cam, q, vue);
        if(!r) continue;
        tours++;
        const dPx = Math.max(Math.abs(r[0] - px), Math.abs(r[1] - py));
        if(dPx > pirePx){ pirePx = dPx; ouPx = vue.nom; }

        const q2 = C.surLePlan(cam, r[0], r[1], vue);
        if(!q2){
          ok(nomScene + " — le retour se perd en route", false,
             "un point", "null en " + vue.nom + " (" + px.toFixed(0) + ", " + py.toFixed(0) + ")");
          return;
        }
        const dM = ecartV(q2, q) / Math.max(1, len(q));
        if(dM > pireMonde){ pireMonde = dM; ouMonde = vue.nom; }
      }
    }

    ok(nomScene + " — la boucle a bien tourné", tours >= 200, "≥ 200 allers-retours",
       tours, "six mesures d'image, cent vingt et un pixels chacune");
    ok(nomScene + " — pixel → plan → pixel se referme au milliardième de pixel",
       tours >= 200 && pirePx < 1e-9, "< 1e-9 px",
       pirePx.toExponential(2) + " px" + (pirePx > 0 ? "   (" + ouPx + ")" : ""),
       "c'est l'unité de la faute : un clic qui vise à côté se compte en pixels");
    ok(nomScene + " — plan → pixel → plan se referme au milliardième de rayon",
       tours >= 200 && pireMonde < 1e-9, "< 1e-9 en écart relatif",
       pireMonde.toExponential(2) + (pireMonde > 0 ? "   (" + ouMonde + ")" : ""));
  }

  /* LA HAUTEUR SERT VRAIMENT.

     Deux fonctions qui ignoreraient toutes deux `vue.H` refermeraient la boucle
     à la perfection en étant fausses — l'aller-retour seul ne les distinguerait
     pas. On exige donc que les deux mesures du même téléphone donnent des
     résultats DIFFÉRENTS, et d'un écart qui se voit. */
  const cam = camLibre(C, 21, 0.17, 0.6);
  const A = VUES[1], B = VUES[2];                 // 390×620 et 390×684
  {
    const p = [7.5, 0, -4.2];
    const a = C.projette(cam, p, A), b = C.projette(cam, p, B);
    const d = a && b ? Math.hypot(a[0]-b[0], a[1]-b[1]) : -1;
    ok("la hauteur de l'image change réellement la projection", d > 1,
       "> 1 px d'écart entre 390×620 et 390×684", d.toFixed(1) + " px",
       "sinon `vue.H` serait décoratif, et l'aller-retour se refermerait sur du vide");

    const u = C.surLePlan(cam, 210, 380, A), v = C.surLePlan(cam, 210, 380, B);
    const e = u && v ? ecartV(u, v) : -1;
    ok("et elle change réellement la lecture du pointeur", e > 0.05,
       "> 0,05 rayon d'écart", e.toFixed(4) + " rayon");
  }

  /* LA FAUTE D'ORIGINE, TOUJOURS VISIBLE D'ICI.

     C'est le contrôle qui prouve que le précédent a des dents : si l'on projette
     avec une mesure et que l'on relit avec l'autre — ce que faisaient `projette`
     et `surLePlan` avant que `vue` ne passe en argument — la boucle NE SE
     REFERME PAS, et l'écart se voit en pixels. */
  {
    const p = [7.5, 0, -4.2];
    const a = C.projette(cam, p, A);
    const q = a ? C.surLePlan(cam, a[0], a[1], B) : null;
    const enMonde = q ? ecartV(q, p) : -1;
    const r = q ? C.projette(cam, q, A) : null;
    const enPixels = r && a ? Math.hypot(r[0]-a[0], r[1]-a[1]) : -1;
    ok("mélanger les deux mesures NE se referme pas — la faute d'origine se voit",
       enMonde > 0.05 && enPixels > 1,
       "un écart franc", enMonde.toFixed(4) + " rayon, soit " + enPixels.toFixed(1) + " px",
       "projeté en barre déployée, relu en barre rétractée : c'est exactement ce "
       + "que faisait la page avant que `vue` ne passe en argument");
  }
}
groupe("`projette` et `surLePlan` sont inverses exactes");
controleAllerRetour(CAMERA);

/* ══════════════════════════════════ 3. LA BASE EST ORTHONORMÉE, DANS LES TROIS LIEUX

   Une base qui dérive de l'orthonormalité ne casse rien : elle fait tourner les
   sondes autour d'un centre légèrement décalé, et cisaille le calque sans que
   personne ne sache pourquoi. C'est le défaut le plus silencieux du domaine, et
   le seul moyen de le voir est de mesurer.

   Le sens attendu est d × h = −a. Voir l'en-tête : il découle de h = cross(d, a)
   par le double produit vectoriel, et il a été mesuré avant d'être écrit.     */
function controleBase(C){
  const cas = [];
  for(const elev of [-1.35, -0.7, -0.001, 0, 0.17, 0.9, 1.35])
    for(const azim of [0, 1.7, 4.9])
      cas.push(["vue libre", () => camLibre(C, 21, elev, azim)]);
  for(const r of [1.05, 3, 6, 40])
    for(const lacet of [0, 1.1, -2.4])
      for(const tangage of [0, 0.8, -1.4, Math.PI/2])
        cas.push(["à bord", () => camSonde(C, sondeA(r, 0.4, 0.9), lacet, tangage)]);
  for(const r of [10, 16, 30])
    for(const ts of [0, 7, 41])
      for(const roulis of [0, 0.5])
        cas.push(["salon", () => camSalon(C, etatSalon(r, ts), repereSalon(0.4, -0.15, roulis))]);

  const pire = { unite: 0, ortho: 0, sens: 0 };
  const ou   = { unite: "", ortho: "", sens: "" };
  for(const [nom, monte] of cas){
    const b = monte().base;
    const u = Math.max(Math.abs(len(b.d)-1), Math.abs(len(b.h)-1), Math.abs(len(b.a)-1));
    const o = Math.max(Math.abs(dot(b.d, b.h)), Math.abs(dot(b.d, b.a)), Math.abs(dot(b.h, b.a)));
    const s = ecartV(cross(b.d, b.h), fois(b.a, -1));
    if(u > pire.unite){ pire.unite = u; ou.unite = nom; }
    if(o > pire.ortho){ pire.ortho = o; ou.ortho = nom; }
    if(s > pire.sens){ pire.sens = s; ou.sens  = nom; }
  }

  ok("les trois vecteurs sont unitaires — " + cas.length + " configurations",
     pire.unite < 1e-12, "< 1e-12", pire.unite.toExponential(2)
     + (pire.unite > 0 ? "   (" + ou.unite + ")" : ""));
  ok("les trois produits scalaires sont nuls", pire.ortho < 1e-12, "< 1e-12",
     pire.ortho.toExponential(2) + (pire.ortho > 0 ? "   (" + ou.ortho + ")" : ""),
     "un centième de radian de travers suffit à décaler le centre autour duquel "
     + "les sondes tournent, et rien à l'écran ne le dirait");
  ok("et le sens est celui qu'impose h = d × a, soit d × h = −a",
     pire.sens < 1e-12, "< 1e-12 d'écart à −a", pire.sens.toExponential(2)
     + (pire.sens > 0 ? "   (" + ou.sens + ")" : ""),
     "convention d'une caméra qui regarde son propre +z : x à droite, y en haut, "
     + "z devant. Un signe inversé retournerait l'image en miroir");
}
groupe("La base est orthonormée, et de sens constant");
controleBase(CAMERA);

/* ═══════════════════════ 4. EN VUE LIBRE, ON EST À `dist` ET L'ON REGARDE L'ORIGINE

   La vérité ne vient pas de la formule du module mais de deux chemins qui ne
   passent pas par elle : la trigonométrie sphérique prise À L'ENVERS — du
   vecteur vers les angles, par `asin` et `atan2` — et la conséquence
   OBSERVABLE de « la caméra regarde l'origine », qui est que le trou noir
   tombe au pixel central de l'image.                                          */
function controleVueLibre(C){
  const DIST = [3, 8, 21, 90, 4000];
  const ELEV = [-1.35, -0.4, 0, 0.17, 1.1, 1.35];
  const AZIM = [0, 0.6, 2.9, -1.4, 5.7];

  let pireR = 0, pireE = 0, pireA = 0, pireCol = 0, sensBon = true;
  for(const dist of DIST) for(const elev of ELEV) for(const azim of AZIM){
    const cam = camLibre(C, dist, elev, azim);
    const r = len(cam.pos);
    pireR = Math.max(pireR, Math.abs(r - dist)/dist);
    // le chemin inverse : du cartésien vers les angles
    pireE = Math.max(pireE, Math.abs(Math.asin(cam.pos[1]/r) - elev));
    const dAz = Math.atan2(cam.pos[2], cam.pos[0]) - azim;
    pireA = Math.max(pireA, Math.abs(Math.atan2(Math.sin(dAz), Math.cos(dAz))));
    // l'axe de visée est colinéaire à −pos, et dans le bon sens
    pireCol = Math.max(pireCol, len(cross(cam.base.a, cam.pos))/r);
    if(dot(cam.base.a, cam.pos) >= 0) sensBon = false;
  }
  const N = DIST.length*ELEV.length*AZIM.length;

  ok("|pos| vaut exactement `cam.dist` — " + N + " configurations",
     pireR < 1e-12, "< 1e-12 en relatif", pireR.toExponential(2),
     "c'est cos² + sin² = 1, redemandé à la position elle-même");
  ok("l'élévation se relit dans la position, par asin", pireE < 1e-12,
     "< 1e-12 rad", pireE.toExponential(2),
     "le module va des angles vers le vecteur ; on revient du vecteur vers les angles");
  ok("l'azimut aussi, par atan2", pireA < 1e-12, "< 1e-12 rad", pireA.toExponential(2));
  ok("l'axe de visée est colinéaire à −pos", pireCol < 1e-12 && sensBon,
     "< 1e-12, et dirigé vers l'origine", pireCol.toExponential(2)
     + (sensBon ? "" : "  — MAIS À L'ENVERS"));

  /* La conséquence observable, et c'est elle qui compte : si la caméra regarde
     vraiment l'origine, le trou noir tombe au pixel central. Ce contrôle passe
     par `projette`, donc par un tout autre morceau du module. */
  let pirePx = 0;
  for(const vue of VUES) for(const elev of ELEV) for(const azim of AZIM){
    const cam = camLibre(C, 21, elev, azim);
    const p = C.projette(cam, [0, 0, 0], vue);
    if(!p){ pirePx = Infinity; break; }
    pirePx = Math.max(pirePx, Math.abs(p[0] - vue.W/2), Math.abs(p[1] - vue.H/2));
  }
  ok("et le trou noir tombe au centre exact de l'image", pirePx < 1e-9,
     "< 1e-9 px du centre", Number.isFinite(pirePx) ? pirePx.toExponential(2) + " px"
                                                    : "l'origine n'est pas projetée",
     "la seule preuve qui ne relise pas la formule qui pose `a` : elle passe par "
     + "`projette`, sur les six mesures d'image");

  /* LA FOCALE A UN SENS GÉOMÉTRIQUE, ET IL SE VÉRIFIE.

     Le contrat dit tan(demi-champ) = 1/F. Alors un point posé exactement à
     l'angle atan(1/F) au-dessus de l'axe de visée doit atterrir sur le bord
     HAUT de l'image, à py = 0, quelle que soit la mesure. Le demi-champ
     horizontal, lui, dépend du rapport de l'image : x/z = W/(F·H) tombe sur
     px = 0. C'est toute l'histoire de l'aspect, en deux lignes. */
  {
    const cam = camLibre(C, 21, 0.4, 1.1);
    const b = cam.base, F = cam.focale;
    let pireHaut = 0, pireGauche = 0;
    for(const vue of VUES){
      const haut = plus(cam.pos, plus(fois(b.a, 10), fois(b.h, 10/F)));
      const g = plus(cam.pos, plus(fois(b.a, 10), fois(b.d, -10*vue.W/(F*vue.H))));
      const ph = C.projette(cam, haut, vue), pg = C.projette(cam, g, vue);
      pireHaut   = Math.max(pireHaut,   ph ? Math.abs(ph[1]) : Infinity);
      pireGauche = Math.max(pireGauche, pg ? Math.abs(pg[0]) : Infinity);
    }
    ok("tan(demi-champ vertical) vaut bien 1/F", pireHaut < 1e-9,
       "py = 0 au bord haut", Number.isFinite(pireHaut) ? pireHaut.toExponential(2) + " px" : "non projeté",
       "demi-champ = " + (Math.atan(1/F)*180/Math.PI).toFixed(2) + "°, la même valeur "
       + "que `uFocal` envoie au nuanceur");
    ok("et le champ horizontal suit le rapport de l'image", pireGauche < 1e-9,
       "px = 0 au bord gauche", Number.isFinite(pireGauche) ? pireGauche.toExponential(2) + " px" : "non projeté");
  }
}
groupe("En vue libre : à `dist` de l'origine, et l'œil dessus");
controleVueLibre(CAMERA);

/* ══════════════════════════ 5. LA VITESSE LOCALE, ET SON PLAFOND À 0,97 c

   L'arbitre est la métrique de Schwarzschild, pas le module : voir `sondeA()`.
   Une sonde construite pour valoir β localement doit être mesurée à β, à TOUS
   les rayons — et le plafond doit mordre, sans jamais être dépassé.          */
function controlePlafond(C){
  const PLAFOND = 0.97;

  // ── la mesure est juste tant qu'on reste sous le plafond
  {
    let pire = 0, ou = "";
    for(const r of [1.2, 1.6, 2, 3, 6, 20, 300, 5000])
      for(const beta of [0.05, 0.3, 0.7, 0.9, 0.96])
        for(const theta of [0, 0.7, 1.5, 2.6, -1.1]){
          const cam = camSonde(C, sondeA(r, beta, theta), 0, 0);
          const e = Math.abs(len(cam.vitesse) - beta);
          if(e > pire){ pire = e; ou = "r = " + r + ", β = " + beta; }
        }
    ok("la vitesse locale vaut β, à tous les rayons — 200 cas", pire < 1e-12,
       "< 1e-12", pire.toExponential(2) + (pire > 0 ? "   (" + ou + ")" : ""),
       "la prédiction est INVARIANTE en rayon : un √f oublié la ferait dériver, "
       + "et c'est justement ce qu'un contrôle à un seul rayon laisserait passer");
  }

  // ── le plafond ne se dépasse jamais, y compris sur des entrées absurdes
  {
    const absurdes = [
      { nom: "sonde collée à l'horizon, vitesse folle",
        s: { p: [1.0005, 0, 0], v: [3, -4, 5] } },
      { nom: "sonde SOUS l'horizon",
        s: { p: [0.4, 0.2, -0.1], v: [0.9, 0.9, 0.9] } },
      { nom: "sonde radiale à 0,999 c en coordonnées",
        s: sondeA(1.02, 0.999, 0) },
      { nom: "sonde tangentielle à 0,999 c",
        s: sondeA(1.02, 0.999, Math.PI/2) },
      { nom: "sonde immobile, juste au-dessus de l'horizon",
        s: { p: [1.0000001, 0, 0], v: [0, 0, 0] } },
      { nom: "sonde en chute purement radiale",
        s: { p: [0.6, 0.5, -0.7], v: [-0.6, -0.5, 0.7] } },
      { nom: "sonde très loin, vitesse supraluminique en coordonnées",
        s: { p: [5000, 0, 0], v: [12, 0, 0] } },
    ];
    /* Le centre EXACT, r = 0, n'est pas dans cette liste et ce n'est pas un
       oubli : `vol.js` gèle une sonde dès 1,05 rayon et la retire au bout de
       quatorze secondes, donc l'état n'est pas atteignable. Ce que le module y
       fait est tout de même signalé en fin de course, sous « ⚠ ». */
    let debord = null, sale = null, touche = 0;
    for(const c of absurdes){
      const cam = camSonde(C, c.s, 0.3, -0.6);
      const v = len(cam.vitesse);
      if(!fini(cam.vitesse) || !fini(cam.base.a)){ sale = c.nom; break; }
      if(v > PLAFOND + 1e-12){ debord = c.nom + " : " + v.toFixed(6) + " c"; break; }
      if(Math.abs(v - PLAFOND) < 1e-12) touche++;
    }
    ok("aucune entrée absurde ne salit la caméra", sale === null,
       "tout fini", sale ? sale + " rend des NaN"
                         : absurdes.length + " entrées, rien de NaN",
       "sous l'horizon on est hors du monde simulé — on n'y demande pas une "
       + "vitesse juste, seulement qu'elle ne contamine pas la base");
    ok("la vitesse locale ne dépasse jamais 0,97 c", debord === null,
       "≤ 0,97 c", debord || absurdes.length + " entrées absurdes, aucune au-dessus");
    ok("et le plafond MORD — il est touché, pas seulement respecté", touche >= 3,
       "≥ 3 des " + absurdes.length + " exactement à 0,97", touche,
       "un plafond qu'aucune entrée n'atteint n'est pas éprouvé : c'est un "
       + "commentaire, pas un garde-fou");
  }

  // ── juste sous, juste au-dessus : la bascule est franche et à la bonne place
  {
    const sous  = len(camSonde(C, sondeA(6, PLAFOND*(1 - 1e-9), 0.9), 0, 0).vitesse);
    const dessus = len(camSonde(C, sondeA(6, PLAFOND*(1 + 1e-6), 0.9), 0, 0).vitesse);
    ok("juste sous le plafond, rien n'est rogné",
       Math.abs(sous - PLAFOND*(1 - 1e-9)) < 1e-12,
       (PLAFOND*(1 - 1e-9)).toFixed(12), sous.toFixed(12));
    ok("juste au-dessus, on est ramené exactement à 0,97",
       Math.abs(dessus - PLAFOND) < 1e-12, PLAFOND.toFixed(12), dessus.toFixed(12));
  }

  /* La limite lointaine, qui encadre tout le reste : à mille rayons, f → 1 et
     la vitesse locale rejoint la vitesse en coordonnées. Sans elle, un facteur
     constant faux passerait inaperçu partout ailleurs. */
  {
    const s = { p: [4000, 0, 0], v: [0, 0.2, 0.1] };
    const cam = camSonde(C, s, 0, 0);
    ok("très loin, la vitesse locale rejoint la vitesse en coordonnées",
       ecartV(cam.vitesse, s.v) < 3e-4, "< 3e-4 d'écart", ecartV(cam.vitesse, s.v).toExponential(2),
       "f = 1 − 1/4000 : l'écart résiduel EST la courbure, il n'est pas nul et "
       + "ne doit pas l'être");
  }

  /* La direction est conservée par la mise à l'échelle du plafond : une vitesse
     rognée qui changerait aussi d'orientation ferait pivoter le ciel entier. */
  {
    const lent = camSonde(C, sondeA(2, 0.5, 1.2), 0, 0).vitesse;
    const fort = camSonde(C, sondeA(2, 0.99, 1.2), 0, 0).vitesse;
    /* L'angle se mesure par le SINUS, pas par `acos`. Près de zéro, acos(1 − δ)
       vaut √(2δ) : la moitié des chiffres est perdue, et un écart de 1e-16 se
       présente comme 1,4e-8. Un contrôle qui exigerait 1e-12 sur cette
       formulation échouerait sur du code exact, et l'on rognerait le seuil
       jusqu'à ce qu'il ne dise plus rien. */
    const angle = len(cross(norm(lent), norm(fort)));
    ok("rogner la vitesse ne change pas sa direction", angle < 1e-12,
       "< 1e-12 rad", angle.toExponential(2),
       "même rayon, même angle d'attaque, deux normes : le plafond doit être une "
       + "homothétie, pas une rotation");
  }
}
groupe("La vitesse locale et son plafond à 0,97 c");
controlePlafond(CAMERA);

/* ══════════════════ 6. LA VITESSE RETOMBE À ZÉRO QUAND ON REDESCEND

   Le module le fait dans la branche libre, et il dit pourquoi : sans cela, la
   vitesse de la dernière sonde quittée resterait dans l'uniforme d'aberration
   et le ciel entier resterait penché. On éprouve donc la TRANSITION, pas la
   ligne — la caméra doit être sale AVANT pour que le contrôle veuille dire
   quelque chose.                                                             */
function controleRetourAuCalme(C){
  const chemins = [
    ["sonde → vue libre", cam => C.majLibre(cam, envLibre())],
    ["sonde → `maj` en lieu libre",
     cam => C.maj(cam, Object.assign({ lieu: "libre", sonde: null, sondes: [] }, OPS))],
    ["sonde → décrochage (la sonde s'est évaporée)",
     cam => C.maj(cam, Object.assign({ lieu: "sonde", sonde: 4, sondes: [] }, OPS))],
    ["sonde → lieu inconnu, qui atterrit en vue libre",
     cam => C.maj(cam, Object.assign({ lieu: "tir", sonde: null, sondes: [] }, OPS))],
  ];
  for(const [nom, redescend] of chemins){
    const cam = camSonde(C, sondeA(1.4, 0.9, 1.1), 0.4, 0.2);
    const avant = len(cam.vitesse);
    redescend(cam);
    const apres = len(cam.vitesse);
    ok(nom + " — la caméra était bien lancée avant", avant > 0.5, "> 0,5 c",
       avant.toFixed(4) + " c");
    ok(nom + " — et la vitesse retombe à zéro EXACT",
       cam.vitesse[0] === 0 && cam.vitesse[1] === 0 && cam.vitesse[2] === 0,
       "[0, 0, 0]", "[" + cam.vitesse.map(x => x.toExponential(1)).join(", ") + "]  → "
       + apres.toExponential(1) + " c");
  }
}
groupe("En redescendant, le ciel se redresse");
controleRetourAuCalme(CAMERA);

/* ═══════════════════════ 7. `maj` RANGE LA CAMÉRA, MAIS NE DÉCIDE PAS DU LIEU

   Deux propriétés que le module revendique explicitement, et qui sont la raison
   d'être de la refonte de `lieu` :

     · elle ne RENOMME pas un lieu qu'elle ne connaît pas. La salle de tir est
       annoncée ; le jour où elle arrive, son nom ne doit pas être silencieusement
       remplacé par « libre » à la première image, sous peine de chercher la
       faute dans `vaAu`.
     · elle DEMANDE le décrochage au lieu de l'exécuter. `vaAu()` est l'unique
       écrivain de `lieu` — un second écrivain ici, c'est exactement la maladie
       qui a donné le disque à 622×.                                            */
function controleMaj(C){
  const sondes = [sondeA(6, 0.4, 1.2), sondeA(9, 0.3, 0.5)];
  const salon  = etatSalon(16, 3);
  const rep    = repereSalon(0.4, -0.15, 0);
  const env = sup => Object.assign({ sondes, salon, repere: rep }, OPS, sup);

  // ── le quatrième lieu, qui n'existe pas encore
  {
    const cam = C.etat();
    const r = C.maj(cam, env({ lieu: "tir", sonde: null }));
    ok("`maj` ne renomme pas le lieu qu'elle ne connaît pas",
       r.lieu === "tir", "\"tir\"", JSON.stringify(r.lieu),
       "la salle de tir est annoncée ; le jour où elle arrive, son nom ne doit "
       + "pas être remplacé en silence");
    ok("elle ne décroche pas non plus", r.decroche === false && r.sonde === null,
       "decroche false, sonde null",
       "decroche " + r.decroche + ", sonde " + JSON.stringify(r.sonde));
    const libre = camLibre(C);
    ok("et elle range quand même la caméra en vue libre",
       ecartV(cam.pos, libre.pos) < 1e-12 && ecartV(cam.base.a, libre.base.a) < 1e-12,
       "la même caméra que `majLibre`",
       "écart " + ecartV(cam.pos, libre.pos).toExponential(1),
       "un état impossible atterrit dans la vue la plus inoffensive — mais sous "
       + "son propre nom");
  }

  // ── le décrochage : demandé, jamais exécuté
  for(const [nom, sonde] of [["indice hors du tableau", 7], ["aucune sonde suivie", null]]){
    const cam = C.etat();
    const r = C.maj(cam, env({ lieu: "sonde", sonde }));
    ok("sonde absente (" + nom + ") — elle demande le décrochage",
       r.lieu === "libre" && r.sonde === null && r.decroche === true,
       "{ libre, null, true }",
       "{ " + JSON.stringify(r.lieu) + ", " + JSON.stringify(r.sonde) + ", " + r.decroche + " }");
  }
  {
    const cam = C.etat();
    const r = C.maj(cam, env({ lieu: "sonde", sonde: 1 }));
    ok("sonde présente — elle ne décroche pas",
       r.lieu === "sonde" && r.sonde === 1 && r.decroche === false,
       "{ sonde, 1, false }",
       "{ " + JSON.stringify(r.lieu) + ", " + JSON.stringify(r.sonde) + ", " + r.decroche + " }");
    ok("et la caméra est posée SUR cette sonde-là",
       ecartV(cam.pos, sondes[1].p) < 1e-12, "|pos − p₁| = 0",
       ecartV(cam.pos, sondes[1].p).toExponential(1),
       "prendre la sonde 0 par étourderie donnerait une vue plausible et fausse");
  }
  /* L'indice ZÉRO est une sonde comme les autres. `if(sonde)` au lieu de
     `if(sonde !== null)` décrocherait de la première sonde du tableau — et
     seulement d'elle, ce qui est le genre de défaut qu'on met un mois à voir. */
  {
    const cam = C.etat();
    const r = C.maj(cam, env({ lieu: "sonde", sonde: 0 }));
    ok("l'indice 0 n'est pas confondu avec « pas de sonde »",
       r.lieu === "sonde" && r.sonde === 0 && r.decroche === false
         && ecartV(cam.pos, sondes[0].p) < 1e-12,
       "{ sonde, 0, false }",
       "{ " + JSON.stringify(r.lieu) + ", " + JSON.stringify(r.sonde) + ", " + r.decroche + " }");
  }
  // ── le salon
  {
    const cam = C.etat();
    const r = C.maj(cam, env({ lieu: "salon", sonde: null }));
    ok("le salon garde son nom et ne décroche pas",
       r.lieu === "salon" && r.decroche === false, "{ salon, …, false }",
       "{ " + JSON.stringify(r.lieu) + ", " + r.decroche + " }");
    ok("et la caméra est posée dans le vaisseau",
       ecartV(cam.pos, salon.p) < 1e-12, "|pos − salon.p| = 0",
       ecartV(cam.pos, salon.p).toExponential(1));
  }
}
groupe("`maj` range la caméra et rend la main sur le lieu");
controleMaj(CAMERA);

/* ══════════════════════════════ 8. EMBARQUER, DÉBARQUER, ET LE BOUTON

   `embarque` est une DÉCISION, pas une action : elle ne touche ni au lieu, ni
   au son, ni au document. La seule chose qu'elle change dans la caméra est le
   regard, et elle le remet droit — garder l'orientation de la sonde précédente
   ferait démarrer la nouvelle vue le nez dans le vide.                        */
function controleEmbarque(C){
  const sondes = [sondeA(6, 0.4, 1.2), sondeA(9, 0.3, 0.5)];
  {
    const cam = C.etat();
    cam.regard.lacet = 2.1; cam.regard.tangage = -0.9;
    const d = C.embarque(cam, 1, sondes);
    ok("monter sur une sonde existante", d.lieu === "sonde" && d.sonde === 1 && d.monte === true,
       "{ sonde, 1, true }",
       "{ " + JSON.stringify(d.lieu) + ", " + d.sonde + ", " + d.monte + " }");
    ok("et le regard est remis droit", cam.regard.lacet === 0 && cam.regard.tangage === 0,
       "lacet 0, tangage 0", cam.regard.lacet + " / " + cam.regard.tangage,
       "le regard appartient à la place, pas au passager");

    // conséquence observable : le regard droit met l'astre au centre de l'image
    C.majSonde(cam, Object.assign({ sondes, sonde: 1 }, OPS));
    const p = C.projette(cam, [0, 0, 0], VUES[0]);
    ok("le regard droit remet l'astre au centre de l'image",
       p && Math.abs(p[0] - 720) < 1e-9 && Math.abs(p[1] - 450) < 1e-9,
       "[720, 450]", p ? "[" + p[0].toFixed(6) + ", " + p[1].toFixed(6) + "]" : "non projeté");
  }
  for(const [nom, i] of [["aucune désignée", null], ["indice hors du tableau", 9]]){
    const cam = C.etat();
    const d = C.embarque(cam, i, sondes);
    ok("refuser d'embarquer (" + nom + ")",
       d.lieu === "libre" && d.sonde === null && d.monte === false,
       "{ libre, null, false }",
       "{ " + JSON.stringify(d.lieu) + ", " + JSON.stringify(d.sonde) + ", " + d.monte + " }");
  }
  {
    const cam = C.etat();
    const d = C.embarque(cam, 0, sondes);
    ok("l'indice 0 embarque bien", d.monte === true && d.sonde === 0,
       "{ sonde, 0, true }", "{ " + JSON.stringify(d.lieu) + ", " + d.sonde + ", " + d.monte + " }");
  }
  // ── le bouton reflète l'état, il ne le décide pas
  for(const [nom, s, dessus] of [["null", null, false], ["undefined", undefined, false],
                                 ["indice 0", 0, true], ["indice 3", 3, true]]){
    const b = C.bouton(s);
    ok("bouton, sonde " + nom, b.dessus === dessus && typeof b.cle === "string" && b.cle.length > 0,
       "dessus " + dessus + " et une clé", "dessus " + b.dessus + ", clé « " + b.cle + " »");
  }
  ok("les deux états du bouton ne portent pas la même clé",
     C.bouton(null).cle !== C.bouton(0).cle, "deux clés distinctes",
     "« " + C.bouton(null).cle + " » et « " + C.bouton(0).cle + " »",
     "la page appelle T(cle) et peint : une clé unique rendrait le bouton muet "
     + "sur ce qu'il fait");
}
groupe("Embarquer, débarquer, et ce que le bouton dit");
controleEmbarque(CAMERA);

/* ═══════════════════════════ 9. `occulte` — CE QUE L'OMBRE CACHE VRAIMENT

   L'arbitre ne refait pas la minimisation en forme fermée du module : il
   PARCOURT le segment en vingt mille pas et garde le plus petit rayon vu. Deux
   façons sans rapport de répondre à la même question.

   Le domaine de comparaison est restreint aux configurations où l'œil ET le
   point sont hors de l'ombre, et c'est délibéré : quand l'un des deux est
   DEDANS, le minimum du segment est atteint à une extrémité, là où le module
   répond « rien ne me cache » par construction. Ce désaccord est signalé plus
   bas, il n'est pas mesuré ici — un contrôle qui mêlerait les deux régimes ne
   dirait plus lequel des deux il surveille.                                   */
function controleOcculte(C){
  const faux = { pos: [0, 0, 0] };
  const camA = p => ({ pos: p });

  // ── les trois cas que le commentaire du module revendique
  {
    const cas = [
      ["l'ombre est entre l'œil et le point", camA([0, 0, -10]), [0, 0, 10], true],
      ["l'astre est derrière l'œil",          camA([0, 0, 10]),  [0, 0, 22], false],
      ["l'astre est derrière le point",       camA([0, 0, -22]), [0, 0, -10], false],
      ["l'ombre est de côté, loin du segment",camA([12, 6, -10]),[12, 6, 10], false],
    ];
    for(const [nom, cam, p, veut] of cas){
      const r = C.occulte(cam, p, R_OMBRE);
      ok(nom, r === veut, String(veut), String(r));
    }
  }

  /* Le bord, par bissection. Le module doit basculer exactement quand la
     distance du CENTRE au segment franchit `rOmbre` — et l'on retrouve cette
     distance sans jamais l'écrire, en cherchant où la réponse change. Le rayon
     est ensuite passé en argument à deux valeurs différentes : la bascule doit
     suivre l'argument, pas une constante cachée dans le module. */
  for(const rayon of [R_OMBRE, Math.sqrt(27)*M]){
    let a = 0, b = 40;                    // a : caché,  b : visible
    for(let i = 0; i < 200; i++){
      const m = (a + b)/2;
      if(C.occulte(camA([m, 0, -10]), [m, 0, 10], rayon)) a = m; else b = m;
    }
    const seuil = (a + b)/2;
    ok("le bord de l'ombre tombe à " + rayon.toFixed(3) + " rayons",
       Math.abs(seuil - rayon) < 1e-9, rayon.toFixed(9), seuil.toFixed(9),
       "trouvé par bissection sur un segment qui frôle le centre : la valeur "
       + "n'est pas écrite ici, elle est cherchée");
  }

  /* ── l'arbitre : un minimum échantillonné contre un minimum analytique */
  {
    const tire = alea(20260808);
    const dansLIntervalle = (x, a, b) => a + x*(b - a);
    let desaccords = [], caches = 0, vus = 0, sautes = 0;
    for(let k = 0; k < 400; k++){
      const dir = norm([tire()*2-1, tire()*2-1, tire()*2-1]);
      const cam = camA(fois(dir, dansLIntervalle(tire(), 3, 60)));
      /* Un tirage entièrement libre ne cache presque jamais rien : l'ombre est
         un petit objet dans un grand volume, et l'on validerait une fonction
         qui répondrait toujours « visible ». Une moitié des tirages VISE donc
         l'autre côté du trou noir, avec un écart transverse de quelques rayons
         — c'est la seule zone où la question se pose vraiment. */
      let p;
      if(k % 2){
        const t1 = norm(cross(dir, [0.31, 0.87, -0.39]));
        const t2 = cross(dir, t1);
        const phi = tire()*2*Math.PI, ray = dansLIntervalle(tire(), 0, 7);
        p = plus(fois(dir, -dansLIntervalle(tire(), 3, 60)),
                 plus(fois(t1, ray*Math.cos(phi)), fois(t2, ray*Math.sin(phi))));
      } else {
        p = [dansLIntervalle(tire(), -30, 30),
             dansLIntervalle(tire(), -30, 30),
             dansLIntervalle(tire(), -30, 30)];
      }
      if(len(p) <= R_OMBRE || len(cam.pos) <= R_OMBRE) continue;

      const q = moins(p, cam.pos);
      let mini = Infinity;
      for(let i = 0; i <= 20000; i++)
        mini = Math.min(mini, len(plus(cam.pos, fois(q, i/20000))));
      // Le pas d'échantillonnage ne peut pas trancher à un cheveu du bord : on
      // ne compare pas là où l'arbitre lui-même n'a pas d'avis.
      if(Math.abs(mini - R_OMBRE) < 1e-3){ sautes++; continue; }

      const veut = mini < R_OMBRE;
      const r = C.occulte(cam, p, R_OMBRE);
      if(veut) caches++; else vus++;
      if(r !== veut && desaccords.length < 4)
        desaccords.push("œil " + cam.pos.map(x => x.toFixed(1)).join("/")
                        + " → point " + p.map(x => x.toFixed(1)).join("/")
                        + " : module " + r + ", segment échantillonné à "
                        + mini.toFixed(3) + " du centre");
    }
    ok("400 tirages : le module dit ce que dit le segment parcouru",
       desaccords.length === 0, "aucun désaccord",
       desaccords.length ? desaccords.length + " — " + desaccords.join(" ; ") : "aucun");
    ok("et les deux réponses sont représentées", caches > 20 && vus > 20,
       "> 20 cachés et > 20 visibles", caches + " cachés, " + vus + " visibles"
       + (sautes ? "  (" + sautes + " au bord, écartés)" : ""),
       "un tirage qui ne produirait qu'une seule réponse validerait une fonction "
       + "qui rendrait toujours la même");
  }
}
groupe("`occulte` — ce que l'ombre cache, et ce qu'elle ne cache pas");
controleOcculte(CAMERA);

/* ══════════════════════════ 10. `meilleureSonde` — LE REFUS DES ORBITES QUI NE TIENNENT PAS

   40 n'est pas une distance, c'est un refus : sous 3,4 rayons on est déjà
   dedans, et embarquer là revient à offrir trois secondes de chute.

   Les deux nombres — le seuil et la pénalité — sont retrouvés PAR BISSECTION
   sur le comportement, pas recopiés depuis le source. Puis confrontés à ce que
   le module annonce.                                                          */
function controleMeilleure(C){
  const orbite = (r, sup) => Object.assign(sondeA(r, 0.2, 1.0, [0.5, -0.3, 0.81]), sup);

  ok("une liste vide ne rend rien", C.meilleureSonde([]) === null, "null",
     JSON.stringify(C.meilleureSonde([])));
  ok("une liste sans aucune orbite tenable non plus",
     C.meilleureSonde([orbite(6, { sort: "chute" }), orbite(7, { gel: true })]) === null,
     "null", JSON.stringify(C.meilleureSonde([orbite(6, { sort: "chute" }),
                                              orbite(7, { gel: true })])));
  ok("une sonde gelée est ignorée même si elle est parfaite",
     C.meilleureSonde([orbite(6, { gel: true }), orbite(11)]) === 1, 1,
     JSON.stringify(C.meilleureSonde([orbite(6, { gel: true }), orbite(11)])));
  ok("la plus proche de six rayons l'emporte",
     C.meilleureSonde([orbite(30), orbite(6.4), orbite(14)]) === 1, 1,
     JSON.stringify(C.meilleureSonde([orbite(30), orbite(6.4), orbite(14)])));
  ok("sous 3,4 rayons, une orbite tenable passe devant",
     C.meilleureSonde([orbite(3.0), orbite(10)]) === 1, 1,
     JSON.stringify(C.meilleureSonde([orbite(3.0), orbite(10)])),
     "embarquer à trois rayons, c'est offrir trois secondes de chute");
  ok("mais s'il n'y a QUE ça, on monte quand même",
     C.meilleureSonde([orbite(2.8)]) === 0, 0,
     JSON.stringify(C.meilleureSonde([orbite(2.8)])),
     "la pénalité déclasse, elle n'interdit pas : une vue courte vaut mieux que "
     + "pas de vue");
  ok("l'indice 0 est un résultat, pas un « rien »",
     C.meilleureSonde([orbite(6), orbite(40)]) === 0, 0,
     JSON.stringify(C.meilleureSonde([orbite(6), orbite(40)])),
     "`best >= 0 ? best : null` — un `best || null` rendrait null sur la sonde 0");

  /* Le seuil, cherché et non lu. Référence à neuf rayons, donc à trois du
     centre de la fenêtre ; un candidat sans pénalité la bat dès qu'il est à
     moins de trois rayons de six, un candidat pénalisé ne la bat jamais. La
     bascule est donc exactement le seuil. */
  {
    let a = 3.0, b = 4.0;                  // a : la référence gagne,  b : le candidat gagne
    for(let i = 0; i < 200; i++){
      const m = (a + b)/2;
      if(C.meilleureSonde([orbite(m), orbite(9)]) === 0) b = m; else a = m;
    }
    const seuil = (a + b)/2;
    ok("le refus commence à 3,4 rayons", Math.abs(seuil - 3.4) < 1e-9, "3,400000000",
       seuil.toFixed(9),
       "trouvé par bissection sur le vainqueur du duel — la valeur n'est pas lue "
       + "dans le source");
    ok("et ce seuil est au-dessus de la dernière orbite stable", seuil > R_ISCO,
       "> " + R_ISCO + " (ISCO)", seuil.toFixed(3),
       "sous l'ISCO aucune orbite circulaire ne tient : le refus doit couvrir au "
       + "moins ça, et il couvre un peu plus");
    ok("et bien au-dessus de la sphère des photons", seuil > R_PHOTON,
       "> " + R_PHOTON, seuil.toFixed(3));
  }

  /* La pénalité, cherchée de la même façon : un candidat à trois rayons vaut
     3 + pénalité ; on écarte la référence jusqu'à ce qu'elle perde. */
  const penalite = (() => {
    let a = 1, b = 200;                    // a : la référence gagne,  b : le candidat gagne
    for(let i = 0; i < 200; i++){
      const m = (a + b)/2;
      if(C.meilleureSonde([orbite(3), orbite(6 + m)]) === 0) b = m; else a = m;
    }
    return (a + b)/2 - 3;
  })();
  ok("la pénalité vaut 40", Math.abs(penalite - 40) < 1e-6, "40,000000",
     penalite.toFixed(6),
     "elle déclasse donc une sonde basse derrière toute sonde située à moins de "
     + (6 + 3 + penalite).toFixed(0) + " rayons du centre — voir le constat en fin de course");
}
groupe("`meilleureSonde` refuse les orbites qui ne tiennent pas");
controleMeilleure(CAMERA);

/* ══════════════════════ 11. LE SALON ÉCRIT `versAstre` ET `eclat` — LA SORTIE LATÉRALE

   C'est la seule impureté du module, et elle est annoncée : la direction et
   l'intensité de la SOURCE dans le repère de la pièce ne se calculent qu'ici,
   parce qu'elles tombent du même repère que la caméra. Deux fonctions qui les
   calculeraient chacune de leur côté, ce serait deux lois pour un même espace,
   et l'œil verrait la lumière balayer le sol au décalage près.

   D'où vient la vérité ici : `versMonde` est une ISOMÉTRIE. Les angles y sont
   donc conservés, et cela donne une identité qui ne passe par aucune formule du
   module :

       versAstre · av  =  vise · a          (et de même avec dr et d)

   où `vise` = norm(−salon.p) est calculé par l'outil, et `a`, `d` sont lus dans
   la base rendue. Si quelqu'un recalculait `versAstre` ailleurs, ou changeait
   une convention de signe, cette égalité tomberait la première.               */
function controleSalon(C){
  const vise = salon => norm(fois(salon.p, -1));

  // ── la sortie latérale existe, et elle est bien écrite par cette branche
  {
    const salon = etatSalon(16, 5);
    ok("`versAstre` et `eclat` n'existent pas avant l'appel",
       salon.versAstre === undefined && salon.eclat === undefined,
       "absents", "versAstre " + salon.versAstre + ", eclat " + salon.eclat);
    camSalon(C, salon, repereSalon(0.4, -0.15, 0));
    ok("et ils sont là après", Array.isArray(salon.versAstre)
       && typeof salon.eclat === "number" && fini(salon.versAstre)
       && Number.isFinite(salon.eclat),
       "un vecteur et un nombre finis",
       "versAstre " + (salon.versAstre || []).map(x => x.toFixed(3)).join("/")
       + ", eclat " + salon.eclat);
  }

  // ── l'identité des angles, sur un grand échantillon
  {
    let pireU = 0, pireAv = 0, pireDr = 0;
    for(const r of [10, 16, 30, 60])
      for(const ts of [0, 3, 7, 19, 41, 97])
        for(const lacet of [0, 0.6, -1.2, 2.8])
          for(const [tangage, roulis] of [[-0.03, 0], [0.5, 0], [-0.9, 0.7]]){
            const salon = etatSalon(r, ts);
            const rep = repereSalon(lacet, tangage, roulis);
            const cam = camSalon(C, salon, rep);
            const u = vise(salon);
            pireU  = Math.max(pireU,  Math.abs(len(salon.versAstre) - 1));
            pireAv = Math.max(pireAv, Math.abs(dot(salon.versAstre, rep.av) - dot(u, cam.base.a)));
            pireDr = Math.max(pireDr, Math.abs(dot(salon.versAstre, rep.dr) - dot(u, cam.base.d)));
          }
    ok("`versAstre` est unitaire — 288 configurations", pireU < 1e-12, "< 1e-12",
       pireU.toExponential(2),
       "c'est une direction : une norme qui dérive ferait varier l'éclairage avec "
       + "l'orientation de la pièce");
    ok("l'astre est au même endroit pour la pièce et pour la caméra",
       pireAv < 1e-12 && pireDr < 1e-12, "< 1e-12",
       "avant " + pireAv.toExponential(2) + ", droite " + pireDr.toExponential(2),
       "versMonde est une isométrie : les angles passent d'un repère à l'autre "
       + "sans bouger. C'est le contrôle qui tombe si quelqu'un refait ce calcul ailleurs");
  }

  /* ── L'ÉCLAT SUIT L'ANGLE SOLIDE, ET IL SATURE.

     La vérité est la loi en carré inverse, pas la formule du module : hors
     saturation, eclat × r² doit être CONSTANT. On ne lit donc ni le 16 ni le
     carré — on vérifie que le produit ne bouge pas. */
  {
    const eclatA = r => { const s = etatSalon(r, 11);
                          camSalon(C, s, repereSalon(0.3, -0.1, 0)); return s.eclat; };
    const loin = [12, 20, 50, 200, 1000, 9000];
    const produits = loin.map(r => eclatA(r)*r*r);
    const etendue = Math.max(...produits) - Math.min(...produits);
    ok("loin, l'éclat suit exactement le carré inverse",
       etendue/produits[0] < 1e-12, "eclat × r² constant",
       "étendue relative " + (etendue/produits[0]).toExponential(2)
       + "   (produit = " + produits[0].toFixed(3) + ")",
       "c'est le flux d'une source ponctuelle : rien d'inventé, et rien de recopié "
       + "du module");

    let pire = 0, monte = true, av = -1;
    for(const r of [0.2, 1, 3, 6, 8, 9, 10, 14, 25, 80, 400, 5000].slice().reverse()){
      const e = eclatA(r);
      pire = Math.max(pire, e);
      if(e < av - 1e-15) monte = false;
      av = e;
    }
    ok("l'éclat est borné à 3,2", pire <= 3.2 + 1e-12, "≤ 3,2", pire.toFixed(6),
       "y compris au centre exact, où le carré inverse partirait à l'infini");
    ok("et il croît quand on approche", monte, "jamais décroissant en approchant",
       monte ? "douze rayons, de 5 000 à 0,2" : "une inversion",
       "le sens du gradient : inversé, la pièce s'assombrirait en plongeant");

    // le rayon de saturation, cherché et non lu
    let a = 1, b = 200;
    for(let i = 0; i < 200; i++){
      const m = (a + b)/2;
      if(eclatA(m) >= 3.2 - 1e-15) a = m; else b = m;
    }
    const rSat = (a + b)/2;
    ok("la saturation commence là où le carré inverse atteint 3,2",
       Math.abs(eclatA(rSat*1.001)*(rSat*1.001)**2 - produits[0]) < 1e-9
         && Math.abs(3.2*rSat*rSat - produits[0]) < 1e-9,
       "3,2 × r² = " + produits[0].toFixed(3), (3.2*rSat*rSat).toFixed(3),
       "soit " + rSat.toFixed(4) + " rayons — trouvé par bissection, puis recoupé "
       + "avec le produit mesuré au loin");
  }

  /* ── L'ASTRE DÉRIVE DANS LA BAIE, MAIS N'EN SORT PAS.

     Le module fait tourner la visée autour de la normale orbitale : sans ce
     décalage, l'astre reste cloué au centre de la fenêtre et rien ne semble
     bouger, alors même qu'on file autour de lui. Les deux bornes comptent —
     une dérive nulle, et la respiration disparaît ; une dérive trop ample, et
     l'astre quitte la baie. */
  {
    let maxAng = 0, minAng = Infinity;
    for(let i = 0; i < 4000; i++){
      const salon = etatSalon(16, i*0.037);
      camSalon(C, salon, repereSalon(0, 0, 0));
      // versAstre · (0,0,−1) est le cosinus de l'angle à l'axe de la baie
      const ang = Math.acos(Math.max(-1, Math.min(1, -salon.versAstre[2])));
      maxAng = Math.max(maxAng, ang); minAng = Math.min(minAng, ang);
    }
    ok("l'astre dérive vraiment dans la baie", maxAng > 0.05,
       "> 0,05 rad (2,9°)", maxAng.toFixed(4) + " rad (" + (maxAng*180/Math.PI).toFixed(1) + "°)",
       "sans dérive, on file autour d'un astre parfaitement immobile — et le "
       + "vaisseau paraît à l'arrêt");
    ok("mais il ne quitte jamais la fenêtre", maxAng < 0.20,
       "< 0,20 rad (11,5°)", maxAng.toFixed(4) + " rad",
       "le demi-champ vaut " + (Math.atan(1/CAMERA.FOCAL)*180/Math.PI).toFixed(1)
       + "° : la dérive doit rester très en deçà");
    ok("et il repasse par le centre", minAng < 0.01, "< 0,01 rad",
       minAng.toFixed(5) + " rad",
       "une dérive qui ne reviendrait jamais serait un décalage constant, pas une "
       + "respiration");
  }
}
groupe("Le salon écrit `versAstre` et `eclat` — la sortie latérale");
controleSalon(CAMERA);

/* ══════════════════════════════════ 12. LE CONTRÔLE SAIT-IL ÉCHOUER ?  (règle 2)

   On copie l'objet `CAMERA`, on remplace UNE fonction par une version
   subtilement fausse, on rejoue EN SILENCE le groupe qui la surveille, et l'on
   exige qu'il tombe. Aucun fichier n'est touché sur le disque.

   Les sabotages sont écrits comme des ENVELOPPES autour de la vraie fonction
   partout où c'est possible : une copie réécrite à la main apprendrait par cœur
   ce que le module fait, y compris ses fautes, et l'on ne saurait plus si le
   contrôle mord ou si les deux copies divergent. Un seul sabotage passe par le
   texte du source — celui du plafond, qui ne peut pas s'envelopper.           */
groupe("Le contrôle sait échouer — on casse le module pour le prouver");

function essaie(nom, C, controles, note){
  carnet = [];
  try { for(const f of controles) f(C); }
  catch(err){ carnet.push({ nom: "exception : " + err.message, vrai: false }); }
  const lot = carnet; carnet = null;
  const tombes = lot.filter(c => !c.vrai);
  ok(nom, tombes.length > 0, "au moins un contrôle tombe",
     tombes.length + " tombés sur " + lot.length,
     tombes.length ? "→ " + tombes.slice(0, 3).map(c => c.nom).join(" ; ")
                   : "AUCUN — le groupe visé ne surveille donc rien" + (note ? ". " + note : ""));
}
const copie = sup => Object.assign({}, CAMERA, sup);

/* ── 1. LA FAUTE D'ORIGINE : deux mesures pour une seule image.
   `surLePlan` reçoit une `vue` dont la hauteur vaut la largeur — c'est ce que
   produit une fonction qui lit `vue.W` là où elle doit lire `vue.H`. Sur un
   écran carré elle serait invisible ; c'est pour cela que les mesures éprouvées
   ne sont pas carrées. */
essaie("une `surLePlan` qui lit `vue.W` au lieu de `vue.H`",
       copie({ surLePlan: (cam, px, py, vue) =>
                 CAMERA.surLePlan(cam, px, py, { W: vue.W, H: vue.W }) }),
       [controleAllerRetour]);

/* ── 2. LA BASE QUI DÉRIVE. `h` est penché d'un centième de radian sur `d`,
   puis renormalisé : les trois vecteurs restent unitaires, la base n'est plus
   orthogonale, et rien à l'écran ne le dirait. */
essaie("une `majLibre` dont la base n'est plus orthogonale",
       copie({ majLibre: (cam, e) => {
                 CAMERA.majLibre(cam, e);
                 const b = cam.base;
                 cam.base = { d: b.d, h: norm(plus(b.h, fois(b.d, 0.01))), a: b.a };
               } }),
       [controleBase]);

/* ── 3. LE PLAFOND RETIRÉ. Celui-là ne peut pas s'envelopper : le rognage a
   lieu au milieu de la fonction, et l'annuler après coup demanderait de
   recalculer la vitesse — donc de recopier la formule qu'on éprouve. On
   remplace donc le seuil dans une COPIE EN MÉMOIRE du source, et l'on recharge
   le module entier. Le fichier sur le disque n'est jamais touché. */
{
  const motif = /(?<![\d.])0\.97(?![\d])/g;
  if(!motif.test(SRC)){
    ok("le plafond 0,97 se retrouve dans le source pour être saboté", false,
       "le motif 0.97", "introuvable",
       "sans lui, ce fichier ne peut plus prouver que le contrôle du plafond mord. "
       + "Si le seuil a changé de forme, ce sabotage doit être réécrit — pas supprimé");
  } else {
    let sansPlafond = null;
    try { sansPlafond = charge(SRC.replace(motif, "1e9"), "CAMERA"); }
    catch(err){ /* on le dira juste en dessous */ }
    if(!sansPlafond || typeof sansPlafond.majSonde !== "function"){
      ok("le module saboté se charge encore", false, "un module mutant",
         "il ne se charge plus — sabotage inexploitable");
    } else {
      essaie("une `majSonde` sans le plafond à 0,97 c", sansPlafond, [controlePlafond]);
    }
  }
}

/* ── 4. LA CAMÉRA POSÉE UN POIL TROP LOIN. La base est intacte, l'astre reste
   au centre : seul |pos| = dist tombe. C'est ce qui montre que les groupes 3 et
   4 ne surveillent pas la même chose. */
essaie("une `majLibre` qui pose la caméra à 1,0001 × dist",
       copie({ majLibre: (cam, e) => { CAMERA.majLibre(cam, e);
                                       cam.pos = fois(cam.pos, 1.0001); } }),
       [controleVueLibre]);

/* ── 5. LE LIEU RENOMMÉ EN SILENCE — le comportement d'avant l'extraction. */
essaie("une `maj` qui renomme en « libre » le lieu qu'elle ne connaît pas",
       copie({ maj: (cam, e) => {
                 const r = CAMERA.maj(cam, e);
                 if(e.lieu !== "salon" && e.lieu !== "sonde") r.lieu = "libre";
                 return r;
               } }),
       [controleMaj]);

/* ── 6. LA VITESSE QUI RESTE. `majLibre` calcule tout correctement mais oublie
   de redescendre à zéro : le ciel reste penché de la dernière sonde quittée. */
essaie("une `majLibre` qui oublie de remettre la vitesse à zéro",
       copie({ majLibre: (cam, e) => { const v = cam.vitesse;
                                       CAMERA.majLibre(cam, e); cam.vitesse = v; } }),
       [controleRetourAuCalme]);

/* ── 7. LE SEGMENT DEVENU DEMI-DROITE. En allongeant q d'un facteur un million,
   le paramètre t ne dépasse plus jamais 1 : c'est exactement `occulte` sans son
   garde-fou du bout, et l'astre situé DERRIÈRE le point se met à le cacher. */
essaie("un `occulte` qui a perdu la borne du fond (t ≥ 1)",
       copie({ occulte: (cam, p, r) =>
                 CAMERA.occulte(cam, plus(cam.pos, fois(moins(p, cam.pos), 1e6)), r) }),
       [controleOcculte]);

/* ── 8. LA PÉNALITÉ RETIRÉE. Le seul sabotage réécrit à la main, parce qu'il
   n'y a rien à envelopper : une sonde à trois rayons redevient la meilleure. */
essaie("une `meilleureSonde` sans la pénalité des orbites trop basses",
       copie({ meilleureSonde: sondes => {
                 let best = -1, score = Infinity;
                 for(let i = 0; i < sondes.length; i++){
                   const s = sondes[i];
                   if(s.sort !== "orbite" || s.gel) continue;
                   const e = Math.abs(len(s.p) - 6);
                   if(e < score){ score = e; best = i; }
                 }
                 return best >= 0 ? best : null;
               } }),
       [controleMeilleure]);

/* ── 9. DEUX LOIS POUR UN MÊME ESPACE. `versAstre` garde sa norme mais change
   de convention de signe sur le troisième axe — la faute typique de quelqu'un
   qui refait ce calcul dans `habitacle.js`. L'éclairage balaierait le sol à
   l'envers, et l'image, elle, ne bougerait pas. */
essaie("un `majSalon` dont `versAstre` suit une autre convention de signe",
       copie({ majSalon: (cam, e) => {
                 CAMERA.majSalon(cam, e);
                 const u = e.salon.versAstre;
                 e.salon.versAstre = [u[0], u[1], -u[2]];
               } }),
       [controleSalon]);

/* ══════════════════════════════════ CE QUI EST SIGNALÉ ET NON CORRIGÉ

   Cet outil n'écrit pas dans `camera.js`. Deux constats sont sortis de sa
   rédaction ; ils ne sont pas comptés comme des échecs, parce que ce ne sont
   pas des contrats trahis — ce sont des décisions à prendre par qui tient le
   module.                                                                     */
{
  console.log("\n  Constats — signalés, non corrigés, non comptés");
  console.log("  ─────────────────────────────────────────────");

  const cam = camSonde(CAMERA, sondeA(1.4, 0.9, 1.1), 0.4, 0.2);
  const avant = len(cam.vitesse);
  CAMERA.majSalon(cam, Object.assign({ salon: etatSalon(16, 3),
                                       repere: repereSalon(0.3, -0.1, 0) }, OPS));
  const apres = len(cam.vitesse);
  if(apres > 1e-12){
    console.log("  ⚠   `majSalon` ne remet pas `cam.vitesse` à zéro.");
    console.log("        sonde à " + avant.toFixed(3) + " c → salon : la caméra garde "
                + apres.toFixed(3) + " c.");
    console.log("        `majLibre` le fait explicitement, avec son commentaire ; la");
    console.log("        branche du salon ne le fait pas, et le chemin sonde → salon");
    console.log("        est atteignable en un bouton (`b-salon` appelle vaAu(\"salon\")");
    console.log("        sans repasser par la vue libre). Le ciel vu par la baie serait");
    console.log("        alors aberré à la vitesse de la sonde quittée.");
    console.log("        L'assertion à armer le jour où le module change :");
    console.log("            ok(\"sonde → salon remet la vitesse à zéro\",");
    console.log("               cam.vitesse.every(x => x === 0), \"[0,0,0]\", …);");
  } else {
    console.log("  ·   `majSalon` remet bien la vitesse à zéro — le constat est levé,");
    console.log("      l'assertion ci-dessus peut être armée pour de bon.");
  }

  console.log("");
  const centre = CAMERA.etat();
  CAMERA.majSonde(centre, Object.assign({ sondes: [{ p: [0, 0, 0], v: [0, 0, 0] }],
                                          sonde: 0 }, OPS));
  if(!fini(centre.base.a) || !fini(centre.base.d) || !fini(centre.vitesse)){
    console.log("  ⚠   Une sonde au centre EXACT rend une base entièrement NaN.");
    console.log("        `majSonde` divise par r sans garde-fou ; à r = 0 la base et la");
    console.log("        vitesse partent en NaN, et un NaN dans `uBasis` éteint l'image");
    console.log("        entière sans un mot dans la console. `majSonde` protège pourtant");
    console.log("        déjà deux autres dégénérescences (len(no) et len(d0)).");
    console.log("        Ce n'est pas atteignable aujourd'hui : `vol.js` gèle une sonde");
    console.log("        dès 1,05 rayon et la retire après quatorze secondes. C'est pour");
    console.log("        cela que ce cas ne compte pas comme un échec — mais `cockpit.js`,");
    console.log("        lui, a jugé bon de survivre à r = 0.");
    console.log("        L'assertion à armer le jour où le module se garde :");
    console.log("            ok(\"une sonde au centre exact ne salit pas la base\",");
    console.log("               fini(cam.base.a) && fini(cam.vitesse), …);");
    console.log("");
  }

  console.log("  ⚠   La pénalité de `meilleureSonde` vaut 40, et son commentaire dit");
  console.log("        qu'elle déclasse une sonde basse « derrière n'importe quelle");
  console.log("        autre ». Mesuré : elle la déclasse derrière celles situées à");
  console.log("        moins de 49 rayons du centre, pas au-delà. Une sonde à trois");
  console.log("        rayons l'emporte donc encore sur une sonde à cent rayons.");
  console.log("        Le code ou le commentaire dit faux ; ce n'est pas à un outil");
  console.log("        de trancher lequel.");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
