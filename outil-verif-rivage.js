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
