/* ============================================================================
   OUTIL DE VÉRIFICATION — pas du code de production, pas chargé par la page.

       node outil-verif-rivage.js

   Il éprouve `rivage.js` : la scène où l'on se tient sur la Terre, la nuit, et
   où l'on remplace la Lune par autre chose.

   ---------------------------------------------------------------------------
   D'OÙ VIENT SA VÉRITÉ — la règle 3 du projet

   Le module calcule la marée par le développement au second ordre :

       h(θ) = (GM/GM_T)·(R⁴/d³)·P₂(cos θ)

   Si l'outil vérifiait cette formule avec la même formule, il ne vérifierait
   rien du tout. Il ne la connaît donc pas. Il repart de la LOI DE NEWTON NUE :
   pour un point de la surface, il calcule la distance EXACTE à l'astre, en
   prend le potentiel −GM/s, lui retranche le terme de chute libre du référentiel
   terrestre, et divise par g. Aucune série, aucun P₂, aucun rapport de masses.

   Les deux chemins n'ont en commun que GM et une géométrie. S'ils tombent
   d'accord à quelques millionièmes, c'est que le développement du module est
   juste — et l'écart résiduel qu'ils laissent est le terme d'ordre 3, dont
   l'outil vérifie AUSSI qu'il a la bonne taille (R/d), au lieu de le balayer.

   ---------------------------------------------------------------------------
   ET DES ANCRES EXTÉRIEURES AU DÉPÔT

   Trois chiffres que ce projet n'a pas produits et ne peut pas ajuster :

     • la marée d'équilibre lunaire vaut 54 cm  (Darwin 1898 ; toute la
       littérature océanographique depuis) ;
     • la marée solaire vaut 46 % de la lunaire (rapport universellement cité,
       et c'est le rapport qui fait les vives-eaux) ;
     • l'intervalle entre deux marées hautes est 12 h 25 min (tous les
       almanachs de marée du monde).

   Le module ne contient aucun de ces trois nombres. S'il les retrouve, c'est
   qu'il a raison pour de bon.

   ---------------------------------------------------------------------------
   LE CONTRÔLE QUI PORTE LA DÉMONSTRATION

   Le trou noir de masse lunaire doit donner LA MÊME marée que la Lune, au bit
   près — pas « à peu près », à l'identique — tout en n'ayant aucun diamètre
   apparent visible. C'est ce que la scène montre à l'œil, et c'est ce que cette
   ligne garde.

   ---------------------------------------------------------------------------
   ET IL DOIT POUVOIR ÉCHOUER (règle 2)

       node outil-verif-rivage.js --casse

   remplace la marée du module par la même chose à 5 % près et rejoue tout.
   L'ancre lunaire, l'ancre solaire et l'arbitre newtonien doivent tomber. Un
   outil qui passe encore après ça ne surveille rien.
   ============================================================================ */
"use strict";

const fs   = require("fs");
const path = require("path");

// --- chargement sans navigateur --------------------------------------------
const faux = {};
new Function("window", fs.readFileSync(path.join(__dirname, "lune.js"), "utf8"))(faux);
// `atlas.js` AVANT `rivage.js` : depuis le 16 août, le registre des cartes vit
// là-bas et `rivage.js` le relaie. Charger dans l'autre ordre le laisserait
// relayer un `undefined`, et les quatre contrôles de cartes tomberaient sur une
// panne au lieu de mesurer quoi que ce soit.
new Function("window", fs.readFileSync(path.join(__dirname, "atlas.js"), "utf8"))(faux);
new Function("window", fs.readFileSync(path.join(__dirname, "rivage.js"), "utf8"))(faux);
const L = faux.LUNE, R = faux.RIVAGE;

if(!L){ console.error("lune.js n'a rien posé."); process.exit(2); }
if(!R){ console.error("rivage.js n'a rien posé."); process.exit(2); }

const CASSE = process.argv.includes("--casse");
if(CASSE){
  const vrai = R.hauteurMaree;
  R.hauteurMaree = (l,a,d,t) => vrai(l,a,d,t) * 1.05;
  const vraiM = R.marnage;
  R.marnage = (l,a,d) => vraiM(l,a,d) * 1.05;
  /* Et l'on glisse au passage une carte comme quelqu'un de pressé en écrirait
     une : la clé mal tapée, le fichier jamais déposé. Elle passe la serrure —
     elle porte bien une source et une licence — et c'est précisément pour cela
     que la section 11 bis doit la voir tomber. */
  R.CARTES.push({ cle:"jupiterr", fichier:"cartes/jamais-deposee.jpg",
    source:"une provenance assez longue pour franchir la serrure",
    licence:"domaine public" });
}

// --- affirmation ------------------------------------------------------------
let echecs = 0, total = 0;

function fr(x, dec){
  if(x === null || x === undefined || !isFinite(x)) return "—";
  if(x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3))
    return x.toExponential(dec === undefined ? 4 : dec).replace(".", ",");
  return x.toFixed(dec === undefined ? 4 : dec).replace(".", ",");
}

function affirme(quoi, attendu, mesure, tol, unite){
  total++;
  const ecart = attendu === 0 ? Math.abs(mesure) : Math.abs(mesure - attendu)/Math.abs(attendu);
  const ok = ecart <= tol;
  if(!ok) echecs++;
  console.log(
    (ok ? "  ok   " : "  ÉCHEC ") + quoi.padEnd(52) +
    " attendu " + fr(attendu) + (unite ? " " + unite : "") +
    " · mesuré " + fr(mesure) + (unite ? " " + unite : "") +
    " · écart " + (ecart*100).toFixed(4).replace(".", ",") + " %"
  );
}

function affirmeVrai(quoi, condition, detail){
  total++;
  if(!condition) echecs++;
  console.log((condition ? "  ok   " : "  ÉCHEC ") + quoi.padEnd(52) + (detail || ""));
}

const titre = s => console.log("\n" + s + "\n" + "-".repeat(s.length));

/* ============================================================================
   L'ARBITRE — la marée par Newton nu, sans le développement du module

   Repère : l'astre est sur l'axe z, à la distance d du centre de la Terre. Un
   point de la surface à l'angle θ est en (R sinθ, 0, R cosθ). Sa distance à
   l'astre est exacte, pas développée.

   Dans le référentiel de la Terre — qui tombe librement vers l'astre à
   a = GM/d² — le potentiel ressenti est

       Φ(θ) = −GM/s(θ)  +  (GM/d²)·R cosθ

   le second terme étant le potentiel de la pseudo-force d'inertie. La surface
   de l'océan est une équipotentielle : elle monte de h = −(Φ − Φ_ref)/g.

   Aucun P₂. Aucun rapport de masses. Aucune puissance quatrième du rayon.  */
function mareeNewtonNu(a, distance_km, theta){
  const T   = L.ASTRES.find(x => x.cle === "terre");
  const GM  = L.gmDe(a);
  const GMT = L.gmDe(T);
  const Rt  = L.rayonDe(T) * 1000;
  const d   = distance_km * 1000;
  const g   = GMT / (Rt*Rt);

  const phi = (th) => {
    const x = Rt*Math.sin(th), z = Rt*Math.cos(th);
    const s = Math.sqrt(x*x + (d - z)*(d - z));
    return -GM/s + (GM/(d*d)) * z;
  };
  // Référence prise au quart de tour, comme le module : seule la DIFFÉRENCE
  // de potentiel a un sens physique.
  const ref = phi(Math.PI/2);
  return -(phi(theta) - ref) / g + hRefModule(a, distance_km);
}
/* Le module mesure h depuis le géoïde non déformé, l'arbitre depuis le quart
   de tour. Ce décalage constant est LU chez le module en un seul point, pour
   que les deux échelles coïncident — et il ne peut pas masquer une erreur de
   forme, puisqu'il est le même pour tous les θ. */
function hRefModule(a, distance_km){
  return R.hauteurMaree(L, a, distance_km, Math.PI/2);
}

/* ============================================================================
   1. L'ARBITRE CONTRE LE MODULE, SUR TOUTE LA COURBE                       */
titre("1. La marée du module contre la loi de Newton nue (aucune série)");

const lune = L.ASTRES.find(a => a.cle === "lune");
let pireEcart = 0;
for(let i = 0; i <= 12; i++){
  const th = Math.PI * i / 12;
  const mod = R.hauteurMaree(L, lune, L.D_LUNE_KM, th);
  const arb = mareeNewtonNu(lune, L.D_LUNE_KM, th);
  pireEcart = Math.max(pireEcart, Math.abs(mod - arb));
}
/* LA TOLÉRANCE N'EST PAS CHOISIE, ELLE EST DÉRIVÉE.

   Premier jet, cet outil exigeait un accord à 0,1 mm et échouait. La faute
   était à lui : Newton nu contient TOUS les ordres, le module s'arrête au
   second, et ce qui les sépare est le terme d'ordre 3 — qui vaut R/d fois le
   second, soit environ 9 mm pour la Lune. Exiger mieux, c'était exiger que le
   module soit faux.

   La borne vaut donc deux fois le terme d'ordre 3, et elle se calcule ici. */
const rSurD = (L.rayonDe(L.ASTRES.find(a=>a.cle==="terre"))) / L.D_LUNE_KM;
const ordre3 = Math.abs(R.marnage(L, lune, L.D_LUNE_KM)) * rSurD;

affirmeVrai(
  "les deux chemins coïncident sur 13 angles",
  pireEcart < 2*ordre3,
  "pire écart " + fr(pireEcart*1000, 3) + " mm, borne " + fr(2*ordre3*1000, 3) + " mm"
);

/* ET LE PIÈGE INVERSE, QUI EST LE PLUS DANGEREUX DES DEUX.

   Si l'écart tombait à zéro, cela ne prouverait pas l'excellence du module :
   cela prouverait que l'arbitre a cessé d'être indépendant — qu'il calcule la
   même série au lieu de la loi nue. Un accord PARFAIT entre deux chemins qui
   devraient différer au troisième ordre est un aveu, pas un succès.

   Cette ligne exige donc que l'écart existe, et qu'il ait la bonne taille. */
affirmeVrai(
  "…et diffèrent bien au troisième ordre (preuve d'indépendance)",
  pireEcart > 0.3*ordre3,
  "R/d = " + fr(rSurD, 5) + " · attendu ~" + fr(ordre3*1000, 3) +
  " mm · vu " + fr(pireEcart*1000, 3) + " mm"
);

/* ============================================================================
   2. LES ANCRES EXTÉRIEURES                                                 */
titre("2. Trois chiffres que ce dépôt n'a pas produits");

affirme("marnage d'équilibre de la Lune", 0.54,
        R.marnage(L, lune, L.D_LUNE_KM), 0.03, "m");

const soleil = L.ASTRES.find(a => a.cle === "soleil");
const rapportSL = R.marnage(L, soleil, L.UA_KM) / R.marnage(L, lune, L.D_LUNE_KM);
affirme("marée solaire / marée lunaire (aux vraies distances)", 0.46,
        rapportSL, 0.03, "");

const T_maree_h = R.periodeMaree_s(L, lune, L.D_LUNE_KM) / 3600;
affirme("intervalle entre deux marées hautes", 12 + 25/60,
        T_maree_h, 0.003, "h");

affirme("période orbitale lunaire (Kepler, deux corps)", 27.32,
        R.periodeOrbite_s(L, lune, L.D_LUNE_KM) / 86400, 0.005, "j");

/* La géométrie de l'horizon, vérifiée à la main : √(2Rh) pour h ≪ R. */
const T = L.ASTRES.find(a => a.cle === "terre");
affirme("horizon depuis 1,70 m", Math.sqrt(2 * L.rayonDe(T)*1000 * 1.70),
        R.horizonM(L.rayonDe(T)*1000, 1.70), 1e-6, "m");

/* ============================================================================
   3. LA DÉMONSTRATION — le trou noir et la Lune                            */
titre("3. Ce que la scène doit montrer : même masse, même mer, ciel vide");

const trou = L.ASTRES.find(a => a.cle === "trounoir");
const sLune = R.scene(L, "lune",     L.D_LUNE_KM, 0.37);
const sTrou = R.scene(L, "trounoir", L.D_LUNE_KM, 0.37);

affirmeVrai("la mer est identique au bit près",
  sLune.mer_m === sTrou.mer_m,
  "Lune " + fr(sLune.mer_m, 6) + " m · trou noir " + fr(sTrou.mer_m, 6) + " m");
affirmeVrai("le marnage est identique au bit près",
  sLune.marnage_m === sTrou.marnage_m,
  fr(sLune.marnage_m, 6) + " m");
affirmeVrai("le rythme est identique au bit près",
  sLune.periodeMaree_s === sTrou.periodeMaree_s);

/* Et le ciel, lui, doit être vide — 0,109 mm à 384 400 km. La comparaison est
   faite en secondes d'arc contre l'anneau de Sgr A*, le plus fin détail jamais
   photographié : le trou noir est très en dessous. */
const trouSecArc = sTrou.diametreApparent_deg * 3600;
affirmeVrai("le trou noir est invisible dans le ciel",
  trouSecArc * 1e6 < L.SGRA_ANNEAU_UAS,
  fr(trouSecArc*1e6, 3) + " µas, contre " + L.SGRA_ANNEAU_UAS + " µas pour Sgr A*");
affirmeVrai("…alors que la Lune fait un demi-degré",
  Math.abs(sLune.diametreApparent_deg - 0.5181) < 0.001,
  fr(sLune.diametreApparent_deg, 4) + "°");

/* ============================================================================
   4. LE SUJET DE LA SCÈNE — les tailles, ressenties en Lunes               */
titre("4. « C'était à la place de la Lune » — l'échelle en Lunes");

/* PREMIER JET DE CET OUTIL : une table écrite de mémoire — « Mars 2,06 » — et
   Mars échouait à 5 %. Le module avait raison. Le rapport des rayons sourcés
   donne 3 389,5 / 1 737,4 = 1,95, et aucune ligne du dépôt ne dit 2,06 : je
   l'avais inventé. C'est très exactement la règle 7 du projet, et elle vient
   de se refermer sur l'outil censé la faire respecter.

   Les attendus se DÉRIVENT donc, ici, des rayons de la table sourcée, par la
   demi-ouverture du cône tangent — sin α = R/d — recalculée dans ce fichier
   sans appeler le module. */
const dLune = L.D_LUNE_KM;
const theta = (rayon_km) => 2 * Math.asin(rayon_km / dLune) * 180/Math.PI;
const thetaLuneIci = theta(L.rayonDe(lune));

for(const cle of ["lune","mars","terre","neptune","saturne","jupiter"]){
  const a = L.ASTRES.find(x => x.cle === cle);
  const s = R.scene(L, cle, dLune, 0);
  affirme("« " + s.court + " » en largeurs de Lune",
          theta(L.rayonDe(a)) / thetaLuneIci, s.enLunes, 1e-9, "×");
}

/* UNE ANCRE HORS DU DÉPÔT, celle-là vraie et vérifiable par n'importe qui :
   la Terre vue depuis la Lune fait à peu près quatre fois la Lune vue de la
   Terre. C'est ce que les équipages d'Apollo avaient au-dessus de la tête, et
   c'est le seul point de vue de toute la scène qu'un humain ait occupé. */
affirme("la Terre vue de la Lune (ancre Apollo)", 3.7,
        R.scene(L, "terre", dLune, 0).enLunes, 0.02, "×");

/* Et le piège des aires, que la note de Jupiter annonce : quarante Lunes de
   LARGE font seize cents Lunes de SURFACE. L'œil reçoit des aires. */
const jup = R.scene(L, "jupiter", dLune, 0);
affirmeVrai("quarante Lunes de large = seize cents Lunes d'aire",
  Math.abs(jup.enLunes*jup.enLunes - 1600) < 250,
  fr(jup.enLunes, 1) + "² = " + fr(jup.enLunes*jup.enLunes, 0) + " Lunes de surface");

/* ============================================================================
   5. EST-CE QU'ON PEUT SE TENIR DEBOUT                                     */
titre("5. Le verdict : le rivage existe-t-il encore");

affirmeVrai("la Lune laisse un rivage",     R.verdict(L, lune, L.D_LUNE_KM) === "rivage");
affirmeVrai("Jupiter laisse un rivage",     R.verdict(L, L.ASTRES.find(a=>a.cle==="jupiter"), L.D_LUNE_KM) === "rivage");
affirmeVrai("Saturne laisse un rivage",     R.verdict(L, L.ASTRES.find(a=>a.cle==="saturne"), L.D_LUNE_KM) === "rivage");
affirmeVrai("le Soleil, non : on est dedans", R.verdict(L, soleil, L.D_LUNE_KM) === "englouti");

/* Contre-épreuve du verdict : Jupiter DOIT briser la Terre si on l'approche
   sous sa limite de Roche. Un verdict qui dit toujours « rivage » ne dit rien. */
const rocheJ = R.limiteRoche_km(L, L.ASTRES.find(a=>a.cle==="jupiter"));
affirmeVrai("Jupiter brise la Terre sous sa limite de Roche",
  R.verdict(L, L.ASTRES.find(a=>a.cle==="jupiter"), rocheJ*0.9) === "brisee",
  "limite à " + fr(rocheJ, 0) + " km, la Lune est à " + L.D_LUNE_KM + " km");

/* ============================================================================
   6. LE CADRAN NE SE RECOPIE PAS                                           */
titre("6. Le cadran est LUNE.ASTRES, pas une liste écrite à la main");

const c = R.crans(L);
affirmeVrai("un cran par astre, dans le même ordre",
  c.length === L.ASTRES.length && c.every((x,i) => x.cle === L.ASTRES[i].cle),
  c.map(x => x.court).join(" · "));

/* ============================================================================
   7. L'ÉTALON NE PEUT PAS DIVERGER DE CE QU'IL MESURE                       */
titre("7. L'étalon de la Lune, et le rapport qu'il donne à voir");

/* Le disque de référence est dimensionné par `etalonLune`, et le texte annonce
   `enLunes`. Si les deux venaient d'endroits différents, l'image pourrait dire
   « quarante fois » en dessinant trente — la maladie des deux écrivains, celle
   qui a donné le disque à 622×. Cette ligne interdit l'écart. */
for(const cle of ["mars","terre","neptune","saturne","jupiter"]){
  const s = R.scene(L, cle, dLune, 0);
  affirme("« " + s.court + " » : dessin et texte s'accordent",
          s.diametreApparent_deg / R.etalonLune(L, dLune), s.enLunes, 1e-12, "×");
}
affirmeVrai("l'étalon vaut exactement la Lune de la table",
  R.etalonLune(L, dLune) === R.scene(L, "lune", dLune, 0).diametreApparent_deg,
  fr(R.etalonLune(L, dLune), 4) + "°");

/* ============================================================================
   8. LA PAGE SE COMPILE — le piège de l'accent grave

   Payé le 11 août 2026, et il aurait été payé EN LIGNE. Le nuanceur de
   `rivage.html` est écrit dans un texte délimité par des accents graves ; un
   commentaire à l'intérieur citait un nom de fonction entre accents graves, et
   a donc FERMÉ le texte qui le portait. La page ne construisait plus rien : ni
   cadran, ni ciel. Aucun outil du dépôt ne l'aurait vu, parce que le défaut est
   dans une page et non dans un module.

   Celui-ci le voit, sans navigateur : il extrait le script de la page et le
   fait analyser par le moteur. `new Function` analyse sans exécuter — le DOM
   n'est jamais touché.                                                       */
titre("8. Le script de rivage.html s'analyse sans erreur");

const page = fs.readFileSync(path.join(__dirname, "rivage.html"), "utf8");
const bloc = page.match(/<script>\n([\s\S]*?)\n<\/script>/);
affirmeVrai("la page contient bien un script à analyser", !!bloc);
if(bloc){
  let erreur = null;
  try { new Function(bloc[1]); } catch(e){ erreur = e.message; }
  affirmeVrai("il s'analyse", erreur === null, erreur || "");

  /* Et la contre-épreuve, pour que cette ligne ne soit pas décorative : le
     même script avec un accent grave de trop DOIT être refusé. */
  let refuse = false;
  try { new Function(bloc[1].replace("uniform vec2  uRes;", "uniform vec2 `uRes;")); }
  catch(e){ refuse = true; }
  affirmeVrai("…et un accent grave de trop serait refusé", refuse);
}

/* ============================================================================
   9. L'ÉCHELLE DU CIEL NE DÉPEND PAS DE LA FORME DE L'ÉCRAN

   Hugo, le 11 août 2026, sans avoir eu besoin d'ouvrir la page : « c'est basé
   sur le seize neuvième des écrans standards, il faut que ce soit une autre
   dimension d'écran, ça fonctionne, responsive ». Il visait juste — le champ
   était alors un ANGLE fixe, et un angle fixe ne dit rien tant qu'on ne sait
   pas quelle surface le porte.

   L'invariant qui remplace cet angle : UN PIXEL VAUT TOUJOURS LE MÊME ANGLE DE
   CIEL. Une fenêtre plus grande montre plus de ciel, jamais une Lune plus
   grosse.

   Le contrôle prend la fonction telle qu'elle est ÉCRITE DANS LA PAGE et la
   fait tourner ici, avec de fausses fenêtres. Il ne recopie pas la formule : il
   exécute celle qui sera servie, et exige d'elle une propriété énoncée
   ailleurs — la constance, que la formule ne mentionne nulle part.          */
titre("9. La Lune fait le même nombre de pixels sur toutes les fenêtres");

const mDeg = page.match(/const DEG_PAR_PIXEL\s*=\s*([0-9.]+)/);
const mFn  = page.match(/function champ\(\)\{[\s\S]*?\n\}/);
affirmeVrai("la page expose son échelle et sa fonction de champ", !!mDeg && !!mFn);

if(mDeg && mFn){
  const champDe = new Function("cv","loupe","DEG_PAR_PIXEL",
                               mFn[0] + "\nreturn champ();");
  const DEG = parseFloat(mDeg[1]);
  const diamLune = R.scene(L, "lune", dLune, 0).diametreApparent_deg;

  /* Quatre fenêtres de formes franchement différentes — portrait de téléphone,
     tablette, seize neuvième, ultra-large. Seule la HAUTEUR entre dans le
     calcul, ce qui est le point : la largeur ne peut pas changer l'échelle. */
  const fenetres = [[390,844],[768,1024],[900,600],[1440,600],[2560,1080]];
  let refPx = null, pire = 0;
  for(const [w,h] of fenetres){
    const c  = champDe({clientWidth:w, clientHeight:h}, 1, DEG);
    const px = diamLune / (c/h);          // la Lune, en pixels CSS
    if(refPx === null) refPx = px;
    pire = Math.max(pire, Math.abs(px - refPx)/refPx);
  }
  affirmeVrai("la Lune garde la même taille sur cinq fenêtres",
    pire < 1e-12,
    fenetres.map(f => f[0]+"×"+f[1]).join(" · ") + " → " + fr(refPx,1) + " px");

  /* Et la mesure au navigateur, jouée à part, confirme ce compte : 24,0 px CSS
     sur quatre formes d'écran (rapports 0,46 à 2,40). Cette ligne-ci exige que
     le calcul retombe sur ce que l'image a montré — sinon les deux chemins ont
     divergé, et c'est l'image qui a raison. */
  affirme("…et ce compte est celui mesuré à l'écran", 24.0, refPx, 0.03, "px");

  /* CONTRE-ÉPREUVE. Si l'échelle dépendait de la forme de l'écran — un angle
     fixe, comme au deuxième jet — la Lune changerait de taille d'une fenêtre à
     l'autre. Le contrôle doit le VOIR, sinon il ne surveille rien. */
  const champFixe = new Function("cv","loupe","DEG_PAR_PIXEL","return 26/loupe;");
  const pxFixe = fenetres.map(([w,h]) => diamLune / (champFixe({clientHeight:h},1,DEG)/h));
  affirmeVrai("…et un champ fixe serait démasqué",
    Math.max(...pxFixe)/Math.min(...pxFixe) > 1.5,
    "de " + fr(Math.min(...pxFixe),1) + " à " + fr(Math.max(...pxFixe),1) + " px");

  /* La loupe grossit, elle ne déforme pas : deux fois la loupe, deux fois la
     Lune, sur n'importe quelle fenêtre. */
  const px1 = diamLune / (champDe({clientHeight:844},1,DEG)/844);
  const px2 = diamLune / (champDe({clientHeight:844},2,DEG)/844);
  affirme("la loupe ×2 double exactement la Lune", 2, px2/px1, 1e-12, "×");
}

/* ============================================================================
   10. LES MODULES DE LA PAGE PORTENT LEUR ESTAMPILLE

   Payé le 11 août 2026, devant Hugo. Il a rechargé la page publiée et n'a rien
   vu changer. La cause immédiate était le cache de GitHub Pages, qui garde dix
   minutes — mais dessous il y avait un vrai défaut : `rivage.html` chargeait
   ses deux modules SANS estampille de version, donc un navigateur qui les avait
   déjà pouvait servir l'ancien ciel indéfiniment.

   `outils/version.mjs` le criait pourtant, à chaque publication. Je n'avais pas
   ignoré son avertissement : j'avais redirigé sa sortie vers le néant dans ma
   commande de publication. L'outil disait vrai, et personne n'écoutait.

   Un avertissement qu'on peut faire taire n'est pas un garde-fou. Celui-ci est
   une AFFIRMATION : elle traverse `node tout.js`, elle sort en code 1, et
   aucune redirection ne la rend muette.                                      */
titre("10. Aucun module servi sans estampille de version");

const scripts = (page.match(/src="(?!https?:)[^"]+\.js[^"]*"/g) || []);
const nus = scripts.filter(s => !/\?v=/.test(s));
affirmeVrai("la page charge bien des modules locaux", scripts.length >= 2,
  scripts.join(" · "));
affirmeVrai("…et aucun n'est servi sans estampille", nus.length === 0,
  nus.length ? "SANS ESTAMPILLE : " + nus.join(", ") : scripts.length + " estampillés");

/* ============================================================================
   11. AUCUNE CARTE NE PEUT ENTRER SANS SA SOURCE NI SA LICENCE

   Hugo a ouvert la porte aux images importées le 11 août 2026. Elle doit être
   une porte, pas un trou : ce qui entre porte ses références comme le reste du
   site, et une image qu'on n'a pas le droit de servir est un défaut qui ne se
   voit sur AUCUN écran — donc que seul un contrôle peut attraper.

   Cette section garde la serrure ET, depuis que le registre n'est plus vide,
   les fichiers eux-mêmes. Elle prouve d'abord que la serrure refuse ce qu'elle
   doit refuser, pour que le jour où quelqu'un ajoute une carte à la hâte elle
   soit déjà là.                                                              */
titre("11. La serrure des cartes importées");

affirmeVrai("le registre est un tableau", Array.isArray(R.CARTES),
  R.CARTES.length + " carte(s)");

/* Chaque carte réellement déclarée doit être complète. */
for(const c of R.CARTES)
  affirmeVrai("« " + (c && c.cle) + " » porte source et licence", R.carteValide(c),
    (c && c.source ? c.source.slice(0, 46) + "…" : "—"));

const refus = [
  ["sans source",   {cle:"jupiter", fichier:"cartes/j.jpg", licence:"domaine public"}],
  ["sans licence",  {cle:"jupiter", fichier:"cartes/j.jpg", source:"NASA/JPL, Cassini ISS, carte cylindrique"}],
  ["sans fichier",  {cle:"jupiter", source:"NASA/JPL, Cassini ISS, carte cylindrique", licence:"domaine public"}],
  ["source vide",   {cle:"jupiter", fichier:"cartes/j.jpg", source:"NASA", licence:"domaine public"}],
  ["rien du tout",  null],
];
for(const [quoi, c] of refus)
  affirmeVrai("une carte " + quoi + " est refusée", R.carteValide(c) === false);

/* Et la contre-épreuve : une carte COMPLÈTE doit passer. Une serrure qui
   refuse tout est aussi inutile qu'une serrure qui accepte tout. */
affirmeVrai("…et une carte complète est acceptée",
  R.carteValide({cle:"jupiter", fichier:"cartes/jupiter.jpg",
                 source:"NASA/JPL-Caltech, mosaïque Cassini ISS, carte cylindrique équidistante",
                 licence:"domaine public (NASA)"}) === true);

affirmeVrai("un astre sans carte rend null, sans jeter",
  R.carteDe("nexistepas") === null && R.carteDe("soleil") === null);

/* ============================================================================
   11 bis. LES FICHIERS EUX-MÊMES — mesurés, pas crus sur parole

   Trois défauts qu'aucun œil ne rattrape à temps, et que les octets sur le
   disque tranchent en une milliseconde :

   1. LES PUISSANCES DE DEUX. WebGL 1 n'accepte l'enroulement en longitude que
      sur des textures dont les DEUX côtés en sont. Une mire de 360×180 — un
      pixel par degré, la taille la plus naturelle du monde pour une carte
      planétaire — a rendu un disque ENTIÈREMENT NOIR le 11 août 2026, sans
      message, sans erreur, sans rien. La page rattrape désormais le cas au prix
      d'une couture à la longitude 180° ; ici on refuse le cas tout court.

   2. LE RAPPORT DEUX POUR UN. Une carte cylindrique équidistante couvre 360° de
      longitude et 180° de latitude : elle est deux fois plus large que haute.
      Une carte carrée s'afficherait sans erreur, avec les pôles au mauvais
      endroit et les continents étirés — un défaut d'image, mais qui se mesure.

   3. LE POIDS. Ces images pèsent plus que tout le reste du site réuni. Une
      carte qu'on remplace par la version pleine résolution ne casse rien, ne
      prévient pas, et fait payer le téléphone d'Hugo.

   SA VÉRITÉ VIENT D'AILLEURS QUE DU REGISTRE (règle 3) : rien ici ne fait
   confiance à ce que `rivage.js` déclare. On ouvre le fichier, on lit l'en-tête
   JPEG, on prend les dimensions que le décodeur prendra.                     */
titre("11 bis. Les fichiers de cartes, mesurés sur le disque");

/* Les dimensions d'un JPEG vivent dans un marqueur SOF. On parcourt les
   segments jusqu'à en trouver un : c'est exactement ce que fait le navigateur,
   donc on lit le même nombre que lui. */
function tailleJPEG(octets){
  if(octets.length < 4 || octets[0] !== 0xFF || octets[1] !== 0xD8) return null;
  let i = 2;
  while(i + 9 < octets.length){
    if(octets[i] !== 0xFF){ i++; continue; }
    const marq = octets[i+1];
    if(marq === 0xFF){ i++; continue; }
    if(marq === 0xD8 || marq === 0x01 || (marq >= 0xD0 && marq <= 0xD7)){ i += 2; continue; }
    const longueur = octets.readUInt16BE(i+2);
    const estSOF = marq >= 0xC0 && marq <= 0xCF
                && marq !== 0xC4 && marq !== 0xC8 && marq !== 0xCC;
    if(estSOF) return { h: octets.readUInt16BE(i+5), l: octets.readUInt16BE(i+7) };
    i += 2 + longueur;
  }
  return null;
}

const pot = n => n > 0 && (n & (n-1)) === 0;
const PLAFOND_KO = 400;
let poidsTotal = 0;

affirmeVrai("il y a au moins une carte déposée", R.CARTES.length >= 1,
  R.CARTES.length + " carte(s)");

for(const c of R.CARTES){
  const chemin = path.join(__dirname, c.fichier);
  const la = fs.existsSync(chemin);
  affirmeVrai(c.cle + " : le fichier existe", la, c.fichier);
  if(!la) continue;

  const octets = fs.readFileSync(chemin);
  const ko = octets.length / 1024;
  poidsTotal += ko;
  const t = tailleJPEG(octets);

  affirmeVrai(c.cle + " : l'en-tête JPEG se lit", !!t,
    t ? t.l + "×" + t.h : "illisible");
  if(!t) continue;

  affirmeVrai(c.cle + " : les deux côtés sont des puissances de deux",
    pot(t.l) && pot(t.h), t.l + "×" + t.h);
  affirmeVrai(c.cle + " : deux fois plus large que haute", t.l === 2*t.h,
    "rapport " + fr(t.l/t.h, 3));
  affirmeVrai(c.cle + " : sous " + PLAFOND_KO + " Ko", ko <= PLAFOND_KO,
    fr(ko, 0) + " Ko");
}

/* Le poids total est un CHIFFRE À REGARDER, pas un seuil : c'est ce que coûte
   le rivage à quelqu'un qui parcourt tout le cadran sur son forfait. */
affirmeVrai("le dossier des cartes reste sous 3 Mo", poidsTotal < 3072,
  fr(poidsTotal/1024, 2) + " Mo pour " + R.CARTES.length + " cartes");

/* Et la contre-épreuve du couple carte/astre : chaque clé déclarée doit
   correspondre à un astre qui existe vraiment chez la Lune. Une faute de frappe
   dans une clé donnerait une carte que rien ne va jamais chercher — un fichier
   téléchargé pour rien, et un astre qui reste dessiné sans qu'on comprenne. */
for(const c of R.CARTES){
  affirmeVrai(c.cle + " : la clé désigne un astre de la table",
    L.ASTRES.some(a => a.cle === c.cle));
  affirmeVrai(c.cle + " : et carteDe la retrouve", R.carteDe(c.cle) === c);
}

/* LA CONTRE-ÉPREUVE DE L'INSTRUMENT. Les affirmations ci-dessus ne valent que
   si `tailleJPEG` lit vraiment quelque chose : un lecteur qui rendrait toujours
   2048×1024 les ferait toutes passer sans regarder un seul octet. On lui donne
   donc un en-tête fabriqué, de la taille EXACTE qui a rendu le disque noir le
   11 août — 360×180 —, et l'on exige qu'il la retrouve puis que le crible la
   refuse. Ce couple-là ne peut pas s'auto-satisfaire. */
const enTeteFactice = Buffer.from([
  0xFF,0xD8,                                  // début d'image
  0xFF,0xE0, 0x00,0x04, 0x00,0x00,            // un segment quelconque, sauté
  0xFF,0xC0, 0x00,0x11, 0x08,                 // SOF0, longueur, précision
  0x00,0xB4,                                  // hauteur 180
  0x01,0x68,                                  // largeur 360
  0x03, 0x01,0x11,0x00, 0x02,0x11,0x01, 0x03,0x11,0x01,
]);
const factice = tailleJPEG(enTeteFactice);
affirmeVrai("le lecteur d'en-tête retrouve une taille qu'il n'a pas choisie",
  !!factice && factice.l === 360 && factice.h === 180,
  factice ? factice.l + "×" + factice.h : "illisible");
affirmeVrai("…et le crible refuse ce 360×180 qui a noirci le disque",
  !!factice && !(pot(factice.l) && pot(factice.h)));

/* ============================================================================
   11 ter. LE CRÉDIT DOIT ÊTRE À L'ÉCRAN, PAS DANS LE CODE

   Deux des cartes servies sont sous Creative Commons Attribution : le droit de
   les servir est CONDITIONNEL, et la condition est de citer l'auteur. Les
   quatre autres viennent d'agences publiques qui demandent aussi d'être
   créditées. Une citation enfouie dans un fichier JavaScript ne remplit aucune
   de ces conditions.

   C'est le défaut parfait pour ce projet : il ne se voit sur aucun écran, il
   n'affecte aucun pixel, et il rend le site fautif. Seul un contrôle l'attrape,
   et il doit l'attraper des deux côtés — la donnée ET la page qui la montre. */
titre("11 ter. Le crédit des cartes, jusqu'à l'écran");

for(const c of R.CARTES){
  affirmeVrai(c.cle + " : porte un crédit court",
    typeof c.credit === "string" && c.credit.length >= 8, c.credit || "—");
  affirmeVrai(c.cle + " : et creditDe le rend", R.creditDe(c.cle) === c.credit);
}

/* Les deux cartes sous CC BY doivent nommer leur auteur dans le crédit COURT,
   celui qui va à l'écran — pas seulement dans la source longue que personne ne
   lit. La vérité vient d'ailleurs que du crédit : c'est la licence qui décide
   quelles entrées sont concernées. */
for(const c of R.CARTES.filter(x => /creativecommons\.org|CC BY/i.test(x.licence || "")))
  affirmeVrai(c.cle + " : son crédit d'écran nomme l'auteur exigé par CC BY",
    /Solar System Scope/i.test(c.credit || ""), c.credit);

affirmeVrai("un astre sans carte n'a pas de crédit à montrer",
  R.creditDe("soleil") === null && R.creditDe("trounoir") === null);

/* ET LA PAGE. Le module peut rendre le crédit parfait sans que rien ne
   l'affiche : c'est arrivé à d'autres valeurs de ce dépôt. On exige donc que
   `rivage.html` porte l'emplacement et l'appelle. */
affirmeVrai("la page réserve un emplacement au crédit",
  /id="credit"/.test(page));
affirmeVrai("…le remplit depuis le module", /R\.creditDe\(/.test(page));
affirmeVrai("…et le met à jour à chaque cran du cadran",
  /majCredit\(k\)/.test(page));

/* ============================================================================
   12. LE PIQUET RESTE LISIBLE POUR LA PLUS PETITE MARÉE

   Un défaut d'IMAGE, invisible dans un chiffre — et c'est précisément pour cela
   qu'il faut le mesurer. Un piquet gradué tous les mètres serait inutile pour
   la Lune ; un piquet trop court serait noyé avant d'avoir servi ; un piquet
   trop près sortirait du cadre. Aucune de ces trois fautes ne se voit dans une
   valeur de marée : elles ne se voient que dans le RAPPORT entre la graduation
   et la marée, et c'est ce rapport que cette section garde.

   Sa vérité vient d'ailleurs que du piquet : la marée, elle, sort de Newton.  */
titre("12. Le piquet de marée, confronté à ce qu'il doit montrer");

const lisLune = R.lisibilite(L, "lune", dLune);
affirmeVrai("la marée de la Lune balaie au moins 4 traits",
  lisLune.graduations >= 4,
  fr(lisLune.graduations, 1) + " traits de " + (R.PIQUET.graduation_m*100) + " cm");
affirmeVrai("…sans noyer le piquet", !lisLune.noye,
  "pleine mer " + fr(lisLune.haute_m, 2) + " m, sommet " + R.PIQUET.haut + " m");
affirmeVrai("…ni le déchausser", !lisLune.aDecouvert,
  "basse mer " + fr(lisLune.basse_m, 2) + " m, pied " + R.PIQUET.bas + " m");

/* LA DÉMONSTRATION, VUE DEPUIS L'INSTRUMENT. C'est la ligne qui compte : le
   trou noir doit faire monter la mer sur EXACTEMENT les mêmes traits que la
   Lune. Si un jour quelqu'un fait dépendre la marée d'autre chose que la masse
   et la distance, c'est ici que ça casse. */
const lisTrou = R.lisibilite(L, "trounoir", dLune);
affirmeVrai("le trou noir lit les mêmes traits que la Lune",
  lisTrou.graduations === lisLune.graduations
  && lisTrou.haute_m === lisLune.haute_m
  && lisTrou.basse_m === lisLune.basse_m,
  fr(lisTrou.graduations, 1) + " traits, pleine mer " + fr(lisTrou.haute_m, 4) + " m");

/* ET LA CONTRE-ÉPREUVE : le piquet doit être DÉBORDÉ par les gros astres.
   Un instrument qui reste lisible pour Jupiter mentirait sur quatorze
   kilomètres de marée. */
affirmeVrai("Jupiter noie le piquet, comme il se doit",
  R.lisibilite(L, "jupiter", dLune).noye);
affirmeVrai("Mars aussi", R.lisibilite(L, "mars", dLune).noye);

/* Le piquet doit tenir dans le champ, sinon on ne voit pas la mer ET le ciel.
   Premier jet : planté à 7,50 m, il couvrait 28° de haut pour une douzaine de
   degrés montrés. La hauteur visible se calcule ici, en trigonométrie nue. */
const sousOeil = (1.70 - R.PIQUET.bas), surOeil = (R.PIQUET.haut - 1.70);
const ouverture = (Math.atan(sousOeil/Math.abs(R.PIQUET.z))
                 + Math.atan(surOeil/Math.abs(R.PIQUET.z))) * 180/Math.PI;
affirmeVrai("il tient dans une douzaine de degrés de ciel",
  ouverture < 12, fr(ouverture, 1) + "° de haut à " + Math.abs(R.PIQUET.z) + " m");

/* ============================================================================
   13. LE PANNEAU — huit cases, huit astres, et rien qui déborde

   Le cadran était un menu flottant au-dessus de la scène : on cliquait DEVANT
   le monde, pas dedans, ce qu'Hugo refusait explicitement. Il est devenu un
   objet planté dans le sable, qu'on vise et qu'on touche.

   Ce qui se vérifie ici n'est pas son apparence — aucun outil ne voit une
   image — mais la CORRESPONDANCE entre ses cases et les astres. Une case en
   trop, une case manquante, un cran inatteignable : autant de défauts qui ne
   se voient qu'en visant précisément le bon pixel, donc jamais par hasard.   */
titre("13. Le panneau planté dans le sable");

const nCrans = R.crans(L).length;
affirmeVrai("autant de cases que d'astres",
  R.PANNEAU.colonnes * R.PANNEAU.lignes === nCrans,
  R.PANNEAU.colonnes + "×" + R.PANNEAU.lignes + " pour " + nCrans + " astres");

/* Tout cran doit être atteignable, et aucun point du panneau ne doit rendre
   un cran qui n'existe pas. On balaie la surface. */
const atteints = new Set();
let deborde = false;
for(let i = 0; i < 240; i++) for(let j = 0; j < 240; j++){
  const c = R.cranSous(-0.5 + i/239, -0.5 + j/239, nCrans);
  if(c >= 0){ atteints.add(c); if(c >= nCrans) deborde = true; }
}
affirmeVrai("chaque astre a sa case, et une seule zone",
  atteints.size === nCrans && !deborde,
  [...atteints].sort((a,b)=>a-b).join(" · "));

affirmeVrai("viser à côté ne change rien",
  R.cranSous(0.7, 0, nCrans) === -1 && R.cranSous(0, -0.9, nCrans) === -1
  && R.cranSous(-0.51, 0, nCrans) === -1);

/* Une case doit rester touchable au doigt. Le pouce couvre environ 1 cm sur
   l'écran ; à la distance du panneau, une case doit donc dépasser deux degrés,
   sans quoi on toucherait sa voisine. */
const dPanneau = Math.hypot(R.PANNEAU.x, R.PANNEAU.z);
const caseLarge = (R.PANNEAU.largeur/R.PANNEAU.colonnes);
const caseHaute = (R.PANNEAU.hauteur/R.PANNEAU.lignes);
const angleCase = Math.atan(caseHaute/dPanneau) * 180/Math.PI;
affirmeVrai("une case reste touchable au doigt", angleCase > 1.6,
  fr(caseLarge*100,0) + "×" + fr(caseHaute*100,0) + " cm à " + fr(dPanneau,1) +
  " m, soit " + fr(angleCase,1) + "° de haut");

/* Et il doit tenir dans le champ : un panneau plus large que l'écran cesse
   d'être un objet du lieu pour devenir un mur. Premier jet, à 4,20 m, il
   couvrait 15° des 19° montrés. */
const angleLarge = 2*Math.atan(R.PANNEAU.largeur/2/dPanneau) * 180/Math.PI;
affirmeVrai("le panneau laisse voir le rivage autour", angleLarge < 13,
  fr(angleLarge,1) + "° de large à " + fr(dPanneau,1) + " m");

/* ============================================================================ */
console.log("\n" + "=".repeat(72));
console.log(echecs === 0
  ? `TOUT PASSE — ${total} affirmations.`
  : `${echecs} ÉCHEC(S) sur ${total} affirmations.`);
if(CASSE){
  console.log("\nMode --casse : la marée a été faussée de 5 %. Des échecs ci-dessus");
  console.log("sont la PREUVE que cet outil surveille quelque chose.");
  process.exit(echecs > 0 ? 0 : 1);   // en mode casse, ne PAS échouer = l'échec
}
process.exit(echecs === 0 ? 0 : 1);
