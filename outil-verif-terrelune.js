/* ============================================================================
   L'ARRIVÉE TERRE–LUNE, ÉPROUVÉE

       node outil-verif-terrelune.js

   ---------------------------------------------------------------------------
   D'OÙ IL TIRE SA VÉRITÉ — et c'est la règle 3, qui s'est déjà refermée
   deux fois sur ce dépôt

   Le module calcule des angles apparents par `LUNE.diametreApparent`. Le
   contrôler avec la même fonction ne prouverait rien : deux appels d'accord
   entre eux restent deux appels. On l'éprouve donc par TROIS voies qui ne
   passent pas par lui :

     1. LA CORDE. Une sphère de rayon R vue de d sous-tend un demi-angle α avec
        sin α = R/d. On peut le vérifier sans trigonométrie inverse : la
        tangente issue de l'œil touche la sphère, et le triangle œil–centre–point
        de contact est rectangle en ce point. On reconstruit donc d à partir de
        l'angle rendu — R / sin(α) doit redonner d au dernier chiffre — et l'on
        compare aussi à arctan, qui doit S'ÉCARTER : si les deux formules
        donnaient le même nombre, c'est que l'écart mesuré serait un bruit.

     2. LA PROJECTION DE LA PAGE. Les pixels ne sont pas crus sur parole : on
        rejoue `CAMERA.projette` sur un point placé exactement à l'angle voulu,
        et l'on exige que le décalage relevé à l'écran soit celui que le module
        annonce. C'est le seul contrôle qui puisse attraper un facteur deux dans
        l'échelle — la faute la plus probable et la moins visible.

     3. LA GÉOMÉTRIE DU TRIANGLE. La Lune est plus loin que la Terre parce que
        la ligne de visée est perpendiculaire à la ligne Terre–Lune. On le
        recalcule par Pythagore, et l'on exige aussi la propriété qui trahirait
        une erreur de sens : l'écart angulaire doit DÉCROÎTRE quand on s'éloigne
        et CROÎTRE quand on s'approche.

   Les valeurs des astres, elles, ne sont pas recopiées : on les lit dans
   `lune.js`, et `outil-verif-lune.js` les garde contre leurs sources.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ici = __dirname;
const charge = (f, w) => { new Function("window", fs.readFileSync(path.join(ici, f), "utf8"))(w); return w; };

const W = {};
charge("lune.js", W);
charge("camera.js", W);
charge("terrelune.js", W);
const L = W.LUNE, TL = W.TERRELUNE, CAM = W.CAMERA;

const FOCALE = 1.55;                 // celle de `camera.js`, relue plus bas
const DEG = 180/Math.PI;

let echecs = 0, total = 0;
function point(nom, ok, attendu, mesure, note){
  total++; if(!ok) echecs++;
  console.log(`  ${ok ? "✅" : "❌"}  ${nom}`);
  if(attendu !== undefined) console.log(`        attendu ${attendu}   mesuré ${mesure}`);
  if(note) console.log(`        ${note}`);
}
function proche(a, b, tol){ return Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)); }
function titre(t){ console.log(`\n  ${t}\n  ${"─".repeat(t.length)}`); }

console.log("\n  L'ARRIVÉE — LA TERRE ET LA LUNE");
console.log("  ═══════════════════════════════");

/* -------------------------------------------------------------------------
   0. Le module tient debout, et il ne s'invente pas de chiffres. */
titre("Le module est là, et il n'a pas de table à lui");

point("`terrelune.js` s'expose", !!TL, "un global TERRELUNE", TL ? "oui" : "NON");
point("`lune.js` lui donne ses astres", !!(L && L.ASTRES && L.ASTRES.length),
      "une table d'astres", L && L.ASTRES ? L.ASTRES.length + " astres" : "AUCUN");

/* AUCUN CHIFFRE D'ASTRE DANS LE FICHIER. C'est la promesse de son en-tête, et
   une promesse d'en-tête ne vaut rien si personne ne la relit. On lit son
   source et l'on exige que les nombres des astres n'y soient pas. */
const src = fs.readFileSync(path.join(ici, "terrelune.js"), "utf8");
/* On regarde le CODE, pas les commentaires : citer 384 400 km dans une phrase
   qui explique la géométrie est de la documentation, pas une seconde table.
   C'est la valeur employée par un calcul que l'on interdit. */
const code = src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
const interdits = ["6371", "1737", "384400", "384 400", "5.97217", "4.902800"];
const trouves = interdits.filter(n => code.indexOf(n) >= 0);
point("aucune valeur d'astre n'est recopiée dans le module", trouves.length === 0,
      "aucune", trouves.length ? trouves.join(", ") : "aucune",
      "une seconde table décrivant les mêmes astres serait deux lois pour un "
      + "seul espace — c'est la règle 4, et l'œil d'Hugo l'a déjà attrapée");

/* La focale n'est pas non plus recopiée : on la relit dans `camera.js` et l'on
   exige qu'elle soit celle qu'on emploie ici. Sinon tout ce qui suit mesure
   une optique qui n'est pas celle du site. */
const srcCam = fs.readFileSync(path.join(ici, "camera.js"), "utf8");
const mF = srcCam.match(/const FOCAL\s*=\s*([0-9.]+)/);
point("la focale employée est celle de `camera.js`", !!mF && Number(mF[1]) === FOCALE,
      FOCALE, mF ? mF[1] : "INTROUVABLE",
      "sans ça le contrôle éprouverait une optique imaginaire");

/* -------------------------------------------------------------------------
   1. LA CORDE — l'angle apparent, repris par l'inverse. */
titre("1. L'angle apparent, repris par sa réciproque");

const RT = L.rayonDe(L.ASTRES.find(a => a.cle === "terre"));
const RL = L.rayonDe(L.ASTRES.find(a => a.cle === "lune"));
const A  = L.D_LUNE_KM;

for(const d of [1e7, 1e6, 384400, 60000, 20000]){
  const s = TL.scene(d);
  const reconstruit = RT / Math.sin(s.terre.alpha);
  point(`à ${d.toExponential(1)} km, R/sin(α) redonne la distance`,
        proche(reconstruit, d, 1e-12), d, reconstruit.toPrecision(12),
        "c'est la définition de la tangente à une sphère, et elle ne passe pas "
        + "par la fonction contrôlée");
}

/* L'écart avec arctan doit EXISTER, et grandir avec l'angle. Un module qui
   emploierait arctan passerait les contrôles ci-dessus sans broncher aux
   petits angles : c'est ce piège-là qu'on referme. */
{
  const petit = TL.scene(1e7).terre.alpha;
  const gros  = TL.scene(20000).terre.alpha;
  const tPetit = Math.atan(RT/1e7), tGros = Math.atan(RT/20000);
  const ecartPetit = Math.abs(petit - tPetit)/petit;
  const ecartGros  = Math.abs(gros - tGros)/gros;
  point("arcsin et arctan se confondent aux petits angles",
        ecartPetit < 1e-6, "< 1e-6", ecartPetit.toExponential(2));
  point("et se séparent quand l'astre est gros",
        ecartGros > 1e-2, "> 1 %", (ecartGros*100).toFixed(2) + " %",
        "si cet écart était nul, le contrôle précédent ne prouverait rien : "
        + "les deux formules seraient interchangeables et l'on ne saurait pas "
        + "laquelle tourne");
}

/* Dedans, il n'y a pas de silhouette : on exige NaN, et surtout pas 360°. */
{
  const s = TL.scene(RT * 0.5);
  point("dans la Terre, il n'y a pas de diamètre apparent",
        Number.isNaN(s.terre.alpha), "NaN", String(s.terre.alpha),
        "rendre 360° laisserait croire à une réponse — `lune.js` a déjà tranché "
        + "ça pour le Soleil");
}

/* -------------------------------------------------------------------------
   2. LA PROJECTION DE LA PAGE — les pixels ne sont pas crus sur parole. */
titre("2. Les pixels viennent de la caméra du site, et on la rejoue");

{
  const H = 1304, Wp = 1078;
  const vue = { W: Wp, H };
  const cam = { pos:[0,0,0], focale: FOCALE,
                base: { d:[1,0,0], h:[0,1,0], a:[0,0,1] } };
  const k = TL.echelle(FOCALE, H);

  point("l'échelle vaut F·H/2 pixels par radian", k === FOCALE*H/2,
        FOCALE*H/2, k);

  /* On place un point à l'angle α de l'axe et l'on demande à `CAMERA.projette`
     où il tombe. Le module dit tan(α)·k ; la caméra doit dire pareil. */
  let pire = 0, pireOu = "";
  for(const alphaDeg of [0.001, 0.05, 0.5, 5, 17.9, 30]){
    const alpha = alphaDeg/DEG;
    const p = [Math.tan(alpha), 0, 1];         // z = 1, x/z = tan α
    const vu = CAM.projette(cam, p, vue);
    const dxCamera = vu[0] - Wp/2;
    const dxModule = TL.pixels(alpha, k);
    const err = Math.abs(dxCamera - dxModule);
    if(err > pire){ pire = err; pireOu = alphaDeg + "°"; }
  }
  point("le décalage annoncé est celui que `CAMERA.projette` produit",
        pire < 1e-9, "< 1e-9 px", pire.toExponential(2) + " px (pire : " + pireOu + ")",
        "c'est le seul contrôle capable d'attraper un facteur deux dans "
        + "l'échelle — l'erreur la plus probable et la moins visible");

  /* Le seuil du demi-pixel. On ne croit pas la formule : on mesure le diamètre
     rendu à la distance qu'elle donne. */
  const d0 = TL.distanceDemiPixel(k);
  const diam = 2 * TL.pixels(TL.scene(d0).terre.alpha, k);
  point("au départ de la chute, la Terre mesure exactement un demi-pixel",
        proche(diam, 0.5, 1e-9), 0.5, diam.toPrecision(10),
        "c'est le seuil de `lune.js` — sous lui on ne dessine rien — et c'est "
        + "pour ça que la Terre APPARAÎT au lieu d'être déjà là");
  point("et ce demi-pixel n'est pas dessiné, il est au seuil",
        TL.visible(diam/2) === true, "visible au seuil", String(TL.visible(diam/2)));
  point("un cheveu plus loin, on ne dessine plus rien",
        TL.visible(0.24) === false, "rien sous le demi-pixel", String(TL.visible(0.24)));

  /* Le but de la chute : la Terre à la moitié de la hauteur de la baie. */
  const d1 = TL.distanceTerreCadree(FOCALE);
  const hTerre = 2 * TL.pixels(TL.scene(d1).terre.alpha, k);
  point("au bout de la chute, la Terre occupe la part déclarée de la baie",
        proche(hTerre, TL.REGLAGES.PART_TERRE * H, 1e-9),
        TL.REGLAGES.PART_TERRE * H, hTerre.toPrecision(10));

  /* Et cette distance NE DOIT PAS dépendre de la taille de la fenêtre : une
     taille apparente se compare à un champ. Tourner le téléphone ne peut pas
     déplacer le vaisseau. */
  const parts = [400, 800, 1304, 2000].map(h =>
    2 * TL.pixels(TL.scene(d1).terre.alpha, TL.echelle(FOCALE, h)) / h);
  const ecart = Math.max(...parts) - Math.min(...parts);
  point("le but de la chute ne dépend pas de la taille de la fenêtre",
        ecart < 1e-12, "< 1e-12", ecart.toExponential(2),
        "sinon le vaisseau s'arrêterait ailleurs selon qu'on tient le "
        + "téléphone droit ou couché");
}

/* -------------------------------------------------------------------------
   3. LE TRIANGLE — la Lune est plus loin, et l'écart se resserre en s'éloignant. */
titre("3. Le triangle Terre–Lune–œil");

for(const d of [1e6, 384400, 100000, 20752]){
  const s = TL.scene(d);
  const attendu = Math.hypot(d, A);
  point(`à ${d} km, la Lune est à √(d² + a²)`,
        proche(s.lune.d, attendu, 1e-14), attendu.toPrecision(12), s.lune.d.toPrecision(12),
        d === 1e6 ? "la visée est perpendiculaire à la ligne Terre–Lune : c'est "
                  + "le point de vue déclaré, et il rend la Lune plus lointaine" : undefined);
  const ecartAttendu = Math.atan(A/d);
  point(`et l'écart angulaire vaut arctan(a/d) = ${(ecartAttendu*DEG).toFixed(2)}°`,
        proche(s.ecart, ecartAttendu, 1e-14), ecartAttendu, s.ecart);
}

/* Le sens, qui est ce qu'une erreur de signe casserait en silence. */
{
  const loin = TL.scene(1e7), pres = TL.scene(5e4);
  point("l'écart angulaire CROÎT quand on s'approche",
        pres.ecart > loin.ecart,
        "près > loin", (pres.ecart*DEG).toFixed(2) + "° > " + (loin.ecart*DEG).toFixed(4) + "°");
  point("les deux disques GRANDISSENT quand on s'approche",
        pres.terre.alpha > loin.terre.alpha && pres.lune.alpha > loin.lune.alpha,
        "les deux", "Terre " + (pres.terre.alpha > loin.terre.alpha)
                    + ", Lune " + (pres.lune.alpha > loin.lune.alpha));
}

/* -------------------------------------------------------------------------
   4. LE FAIT QUE LA SCÈNE EST VENUE DIRE

   On ne peut pas avoir la Terre grosse ET la Lune dans le cadre. C'est la
   leçon, et si elle cessait d'être vraie la scène n'aurait plus d'objet. */
titre("4. On ne peut pas avoir les deux gros — et c'est le sujet");

{
  const H = 1304, Wp = 1078, k = TL.echelle(FOCALE, H);
  const dC = TL.distanceCouple(k, Wp);
  const d1 = TL.distanceTerreCadree(FOCALE);

  point("le moment où le couple tient dans la baie est PLUS LOIN que le but",
        dC > d1, "dCouple > d1",
        Math.round(dC) + " km > " + Math.round(d1) + " km",
        "la chute le traverse : on voit le couple, puis la Lune sort et la "
        + "Terre grandit. S'arrêter là aurait donné une Terre minuscule");

  const rTc = TL.pixels(TL.scene(dC).terre.alpha, k);
  point("et à ce moment-là la Terre est petite — c'est le gouffre qu'on montre",
        2*rTc < 0.06*H, "< 6 % de la hauteur",
        (2*rTc).toFixed(1) + " px sur " + H,
        "trente diamètres terrestres d'écart : aucune image ne peut montrer "
        + "les deux astres gros à la fois, et c'est ça qu'on est venu voir");

  const s1 = TL.scene(d1);
  point("au bout, la Lune est hors du champ de la baie",
        Math.tan(s1.ecart)*k > Wp/2, "au-delà de la demi-largeur",
        Math.round(Math.tan(s1.ecart)*k) + " px > " + Wp/2,
        "la légende doit alors dire où elle est allée, et elle le fait");
}

/* -------------------------------------------------------------------------
   5. LA LOI DE CHUTE — celle de `recul.js`, pas une quatrième. */
titre("5. La chute est à taux relatif constant, comme le recul");

{
  const d0 = 1e7, d1 = 2e4;
  point("elle part de d₀", TL.distanceA(0, d0, d1) === d0, d0, TL.distanceA(0, d0, d1));
  point("elle arrive à d₁", proche(TL.distanceA(1, d0, d1), d1, 1e-12), d1, TL.distanceA(1, d0, d1));
  /* Le taux relatif : d(u+h)/d(u) doit être le MÊME partout. C'est ce qui
     distingue cette loi d'une interpolation linéaire, laquelle passerait les
     deux contrôles ci-dessus sans problème. */
  const r = [];
  for(let u = 0; u < 0.9; u += 0.1) r.push(TL.distanceA(u+0.1, d0, d1) / TL.distanceA(u, d0, d1));
  const etendueR = Math.max(...r) - Math.min(...r);
  point("et son taux relatif est constant d'un bout à l'autre",
        etendueR < 1e-12, "< 1e-12", etendueR.toExponential(2),
        "une interpolation linéaire passerait les deux points précédents et "
        + "échouerait ici — c'est le seul contrôle qui distingue les deux lois");
  const lineaire = [];
  for(let u = 0; u < 0.9; u += 0.1){
    const f = (x) => d0 + (d1 - d0)*x;
    lineaire.push(f(u+0.1)/f(u));
  }
  point("et ce contrôle sait refuser une loi linéaire",
        Math.max(...lineaire) - Math.min(...lineaire) > 1e-3,
        "> 1e-3", (Math.max(...lineaire) - Math.min(...lineaire)).toExponential(2));
}

/* -------------------------------------------------------------------------
   6. LA LUMIÈRE — une seule direction, et un terminateur calculé. */
titre("6. Une seule lumière pour les deux astres");

{
  point("la direction d'éclairage vient de `lune.js`", !!(L.ECLAIRAGE),
        "LUNE.ECLAIRAGE", L.ECLAIRAGE ? JSON.stringify(L.ECLAIRAGE) : "ABSENTE",
        "deux éclairages sur un même globe, c'est la soupe de drapeaux : "
        + "l'ombre tomberait d'un côté et le reflet de l'autre");
  const phi = TL.directionSoleilEcran();
  point("et le module la lit plutôt que de la recopier",
        proche(phi, Math.atan2(L.ECLAIRAGE.dy, L.ECLAIRAGE.dx), 1e-15),
        Math.atan2(L.ECLAIRAGE.dy, L.ECLAIRAGE.dx), phi);
  /* Le reflet de `limbe` doit VRAIMENT employer cette valeur, pas la porter
     pour la forme : on relit son source. */
  const srcL = fs.readFileSync(path.join(ici, "lune.js"), "utf8");
  point("`limbe` s'en sert pour poser son reflet",
        /createRadialGradient\(\s*x \+ r\*ECLAIRAGE\.dx,\s*y \+ r\*ECLAIRAGE\.dy/.test(srcL),
        "le dégradé lit ECLAIRAGE",
        /ECLAIRAGE\.dx/.test(srcL) ? "oui" : "NON — la valeur serait décorative");

  /* La fraction éclairée : (1 + cos ψ)/2. Éprouvée aux trois cas où l'on sait
     la réponse sans calcul — pleine, moitié, nouvelle. */
  point("pleine face au Soleil", TL.fractionEclairee(0) === 1, 1, TL.fractionEclairee(0));
  point("moitié au quart de tour", proche(TL.fractionEclairee(Math.PI/2), 0.5, 1e-15),
        0.5, TL.fractionEclairee(Math.PI/2));
  point("noire à contre-jour", proche(TL.fractionEclairee(Math.PI), 0, 1e-15),
        0, TL.fractionEclairee(Math.PI));

  /* Le contour du terminateur. Il doit passer par les deux pôles, atteindre le
     limbe du côté du Soleil, et CHANGER DE CÔTÉ au-delà du quart de tour —
     c'est ce qui sépare une gibbeuse d'un croissant, et c'est la faute qu'un
     relecteur ne voit pas et que l'œil voit tout de suite. */
  const r = 100;
  for(const [psiDeg, nom, signe] of [[30, "gibbeuse", -1], [90, "moitié", 0], [140, "croissant", +1]]){
    const p = TL.contourEclaire(r, psiDeg/DEG, 64);
    const xs = p.map(q => q[0]);
    const extremeTerm = p[p.length - 33][0];        // le point du terminateur à t = 0
    const okLimbe = proche(Math.max(...xs), r, 1e-12);
    const okCote = signe === 0 ? Math.abs(extremeTerm) < 1e-9
                               : Math.sign(extremeTerm) === signe;
    point(`le terminateur d'une ${nom} tombe du bon côté`, okLimbe && okCote,
          signe === 0 ? "un trait droit" : (signe < 0 ? "bombé à l'opposé du Soleil"
                                                      : "bombé du côté du Soleil"),
          extremeTerm.toFixed(3));
  }
  /* Et l'aire du contour doit suivre la fraction éclairée : c'est la vérité
     qui ne passe pas par la construction du contour lui-même. */
  for(const psiDeg of [20, 60, 110, 160]){
    const p = TL.contourEclaire(r, psiDeg/DEG, 2048);
    let aire = 0;
    for(let i = 0; i < p.length; i++){
      const q = p[(i+1) % p.length];
      aire += p[i][0]*q[1] - q[0]*p[i][1];
    }
    aire = Math.abs(aire)/2;
    const attendu = Math.PI*r*r * TL.fractionEclairee(psiDeg/DEG);
    point(`à ψ = ${psiDeg}°, l'aire éclairée vaut (1 + cos ψ)/2 du disque`,
          proche(aire, attendu, 2e-6), attendu.toFixed(1), aire.toFixed(1),
          psiDeg === 20 ? "l'aire ne sait rien de la façon dont le contour a été "
                        + "construit : c'est elle qui attrape un croissant à l'envers" : undefined);
  }
}

/* -------------------------------------------------------------------------
   7. LE DÉROULÉ — un seul écrivain, et il refuse ce qu'il ne peut pas faire. */
titre("7. Le déroulé, et ce qu'il refuse");

{
  TL.ferme();
  point("fermée, la scène ne dessine rien",
        TL.dessine({}, 100, 100, { x:50, y:50, k:600 }) === null,
        "null", String(TL.dessine({}, 100, 100, { x:50, y:50, k:600 })));

  point("elle refuse de s'ouvrir sans échelle",
        TL.ouvre([1,0,0], 0, 1000, FOCALE) === false, "false",
        String(TL.ouvre([1,0,0], 0, 1000, FOCALE)));
  point("elle refuse de s'ouvrir sans focale",
        TL.ouvre([1,0,0], 600, 1000, 0) === false, "false",
        String(TL.ouvre([1,0,0], 600, 1000, 0)));

  const k = TL.echelle(FOCALE, 1304);
  point("et elle s'ouvre quand on lui donne de quoi",
        TL.ouvre([1,0,0], k, 1078, FOCALE) === true, "true", String(TL.etat.actif));
  point("la direction du monde est GELÉE à l'ouverture",
        TL.etat.dir && TL.etat.dir.length === 3, "trois nombres",
        JSON.stringify(TL.etat.dir),
        "sinon l'orbite du vaisseau ferait dériver l'arrivée pendant la chute");

  point("elle part du départ", TL.avancement() === 0, 0, TL.avancement());
  point("et la distance de départ est celle du demi-pixel",
        proche(TL.distance(), TL.distanceDemiPixel(k), 1e-12),
        TL.distanceDemiPixel(k).toPrecision(8), TL.distance().toPrecision(8));

  for(let i = 0; i < 200; i++) TL.avance(0.1);
  point("elle s'arrête au bout, elle ne dépasse pas",
        TL.avancement() === 1, 1, TL.avancement());
  point("et la distance d'arrivée est celle du cadrage",
        proche(TL.distance(), TL.distanceTerreCadree(FOCALE), 1e-12),
        TL.distanceTerreCadree(FOCALE).toPrecision(8), TL.distance().toPrecision(8));

  /* Un pas de temps aberrant — onglet en arrière-plan, machine qui rame — ne
     doit pas téléporter la scène. C'est le plafond que `lune.js` s'impose déjà. */
  TL.ouvre([1,0,0], k, 1078, FOCALE);
  TL.avance(1000);
  point("un pas de temps aberrant ne téléporte pas la chute",
        TL.avancement() <= 0.1/TL.etat.duree + 1e-12,
        "≤ un pas de 0,1 s", TL.avancement().toFixed(4),
        "un onglet en arrière-plan rend des dt de plusieurs secondes, et la "
        + "scène entière serait jouée pendant qu'on ne regarde pas");

  TL.ferme();
  point("fermée, elle oublie sa direction", TL.etat.dir === null, "null", String(TL.etat.dir));
}

/* -------------------------------------------------------------------------
   8. LES MOTS — aucun texte dans le module, et rien d'inventé. */
titre("8. Les mots viennent de la page, et rien ne s'invente");

{
  /* Le module ne doit porter aucune phrase affichable. On cherche dans son
     source les chaînes longues hors commentaire — un texte français en dur
     serait exactement le manquement à la règle 6 qui a tenu `lune.js` dehors. */
  /* On relève TOUTES les chaînes littérales avant de filtrer par longueur.
     Ne chercher que les longues désynchronise les guillemets — la première
     version de ce contrôle appariait la fermeture de « use strict » avec
     l'ouverture de la chaîne suivante, et rendait un faux positif d'un
     kilomètre. Un contrôle qui rougit pour la mauvaise raison est un contrôle
     qu'on désarme dans la semaine. */
  const chaines = (code.match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g) || [])
    .filter(s => s.length - 2 >= 18)
    .filter(s => !/^["'](rgba?\(|[0-9.]+px|ui-|px ui)/.test(s));
  point("aucune phrase affichable n'est écrite dans le module",
        chaines.length === 0, "aucune",
        chaines.length ? chaines.slice(0, 3).join(" · ") : "aucune",
        "c'est la règle 6, et c'est elle qui a tenu `lune.js` hors de la page "
        + "pendant cinq jours");

  TL.poseMots({});
  point("sans mots posés, la légende ne s'écrit pas",
        TL.legende({}, 800, 600, { terreVue:true, luneVue:false, scene: TL.scene(1e6),
                                   xLune: 0, yLune: 0 }) === false,
        "false", "elle se tait plutôt que d'afficher des identifiants nus");
}

/* -------------------------------------------------------------------------
   9. ET CET OUTIL SAIT ÉCHOUER — règle 2, en cassant pour de vrai. */
titre("9. Cet outil sait échouer");

{
  /* On rejoue les deux contrôles centraux sur des modules DÉLIBÉRÉMENT faux,
     chargés dans une portée à part. Si le contrôle reste vert, il ne contrôle
     rien. */
  function avecSource(remplace){
    const w = {};
    charge("lune.js", w);
    const t = remplace(fs.readFileSync(path.join(ici, "terrelune.js"), "utf8"));
    new Function("window", t)(w);
    return w.TERRELUNE;
  }

  const arctan = avecSource(s => s.replace(
    "return L.diametreApparent(L.rayonDe(a), d_km) * Math.PI/180 / 2;",
    "return L.diametreApparentTangente(L.rayonDe(a), d_km) * Math.PI/180 / 2;"));
  const dTest = 20000;
  const reconstruit = RT / Math.sin(arctan.scene(dTest).terre.alpha);
  point("un module passé à arctan est vu",
        !proche(reconstruit, dTest, 1e-9), "l'écart est signalé",
        "R/sin(α) rend " + reconstruit.toFixed(1) + " au lieu de " + dTest);

  const demiEchelle = avecSource(s => s.replace(
    "function echelle(focale, H){ return focale * H / 2; }",
    "function echelle(focale, H){ return focale * H / 4; }"));
  {
    const H = 1304, vue = { W: 1078, H };
    const cam = { pos:[0,0,0], focale: FOCALE, base:{ d:[1,0,0], h:[0,1,0], a:[0,0,1] } };
    const k = demiEchelle.echelle(FOCALE, H);
    const alpha = 5/DEG;
    const dxCam = CAM.projette(cam, [Math.tan(alpha), 0, 1], vue)[0] - vue.W/2;
    const dxMod = demiEchelle.pixels(alpha, k);
    point("un facteur deux dans l'échelle est vu",
          Math.abs(dxCam - dxMod) > 1, "l'écart est signalé",
          Math.abs(dxCam - dxMod).toFixed(1) + " px");
  }

  const plat = avecSource(s => s.replace(
    "return d0 * Math.pow(d1/d0, t);",
    "return d0 + (d1 - d0)*t;"));
  {
    const r = [];
    for(let u = 0; u < 0.9; u += 0.1) r.push(plat.distanceA(u+0.1, 1e7, 2e4) / plat.distanceA(u, 1e7, 2e4));
    point("une chute linéaire au lieu du taux relatif constant est vue",
          Math.max(...r) - Math.min(...r) > 1e-3, "l'écart est signalé",
          (Math.max(...r) - Math.min(...r)).toExponential(2));
  }

  const croissantInverse = avecSource(s => s.replace(
    "p.push([-k*r*Math.cos(t), r*Math.sin(t)]);",
    "p.push([k*r*Math.cos(t), r*Math.sin(t)]);"));
  {
    const p = croissantInverse.contourEclaire(100, 30/DEG, 2048);
    let aire = 0;
    for(let i = 0; i < p.length; i++){
      const q = p[(i+1) % p.length];
      aire += p[i][0]*q[1] - q[0]*p[i][1];
    }
    aire = Math.abs(aire)/2;
    const attendu = Math.PI*100*100 * TL.fractionEclairee(30/DEG);
    point("un terminateur inversé — gibbeuse rendue en croissant — est vu",
          !proche(aire, attendu, 2e-6), "l'écart est signalé",
          aire.toFixed(0) + " au lieu de " + attendu.toFixed(0),
          "c'est la faute qu'aucune relecture n'attrape et que l'œil voit en "
          + "une seconde");
  }

  const seuilMort = avecSource(s => s.replace(
    "function visible(r){ return 2*r >= DEMI_PIXEL; }",
    "function visible(r){ return true; }"));
  point("un seuil du demi-pixel désarmé est vu",
        seuilMort.visible(0.001) === true && TL.visible(0.001) === false,
        "la doctrine est armée ici et morte là-bas",
        "ici " + TL.visible(0.001) + ", saboté " + seuilMort.visible(0.001),
        "sans ce seuil, la Terre serait déjà là avant d'apparaître, et « rien à "
        + "voir » ne deviendrait jamais « ah, il y a quelque chose »");
}

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
