/* ============================================================================
   LE COMPAGNON — une orbite newtonienne peut-elle se poser sur cette scène ?

       node outil-verif-compagnon.js

   Cet outil ne construit rien. Il répond à une question, et la réponse a le
   droit d'être « non ».

   ---------------------------------------------------------------------------
   LA QUESTION

   F3 veut donner un COMPAGNON au trou noir d'étude — une étoile, ou un second
   trou noir — mû par `ncorps.js`, et dessiné sur le calque à deux dimensions,
   par-dessus l'image que le nuanceur calcule.

   `ncorps.js` est NEWTONIEN. La scène ne l'est pas. Deux lois pour un même
   espace, c'est exactement l'incident du quadrillage : un repère tracé selon
   une loi, posé sur une image calculée selon une autre, et l'œil qui voit le
   décalage sans pouvoir le nommer.

   Alors : à quelles séparations les deux lois s'accordent-elles assez pour
   qu'on puisse montrer la première par-dessus la seconde ? Et cette séparation
   est-elle REGARDABLE, ou est-ce une orbite si lointaine que le compagnon
   serait un point immobile ?

   ---------------------------------------------------------------------------
   PREMIÈRE CHOSE APPRISE, ET ELLE CORRIGE L'ÉNONCÉ

   La consigne disait « la scène est en Kerr ». C'est vrai de la LUMIÈRE et faux
   de la MATIÈRE, et la distinction décide de tout ce qui suit.

     · la lumière : le nuanceur reçoit `uSpin`, et le bord interne du disque est
       posé à `KERR.rIsco(spin·M, true)`. Kerr, donc, avec ses quatre spins ;
     · la matière : sondes et vaisseau passent par `PHYSIQUE.integre`, dont
       l'accélération −M/r³·(1 + 3L²/r²)·r⃗ est la géodésique EXACTE de
       Schwarzschild — sans aucun terme de rotation. Spin zéro, toujours.

   Le dépôt porte donc déjà deux lois pour un même espace. Ce n'est pas une
   faute : la matière visible du site est du décor mobile, pas le sujet. Mais
   cela veut dire que le compagnon ne se compare pas à « Kerr » — il se compare
   à ce qui bouge vraiment dans la scène, qui est Schwarzschild. Le spin est
   traité à part, plus bas, avec les formes fermées de Bardeen.

   ---------------------------------------------------------------------------
   LA GRANDEUR QUI DÉCIDE, ET POURQUOI ELLE NE DÉPEND DE RIEN

   `PHYSIQUE.integre` intègre en TEMPS PROPRE : la vitesse d'une orbite
   circulaire y vaut √(M/(r−3M)), qui est r·dφ/dτ. La période de la scène, à un
   rayon r, vaut donc 2πr/v_circ, quand Newton donne 2π√(r³/M). Leur rapport est
   exactement √(1 − 3M/r), c'est-à-dire `PHYSIQUE.cadence(r)` — la cadence des
   horloges du paradoxe des jumeaux, retrouvée là où on ne l'attendait pas.

   D'où la dérive de phase après UN tour de la scène :

       Δφ = 2π (1 − √(1 − 3M/r))   radians

   qui vaut, en LONGUEUR d'arc parcouru par le compagnon :

       r·Δφ  →  3πM = 4,712 r_s   quand r grandit

   Cette longueur ne dépend pas de r. Elle ne dépend pas non plus de l'écran, ni
   du zoom, ni de la vitesse du temps : c'est une propriété des deux lois. Et
   comme le diamètre apparent de l'ombre vaut 2·R_OMBRE = 5,10 r_s, le rapport

       dérive par tour / diamètre de l'ombre

   est un nombre PUR, compris entre 0,92 et 1,09 depuis l'ISCO jusqu'à l'infini.
   Autrement dit : **le compagnon newtonien décale d'environ une largeur de trou
   noir par tour, à toutes les distances, sur tous les écrans.** S'éloigner ne
   sert à rien — l'erreur et l'objet rapetissent ensemble, à la même vitesse.

   C'est ce nombre-là que l'outil mesure, et c'est lui qui rend le verdict.

   ---------------------------------------------------------------------------
   CE QUE L'OUTIL CONTRÔLE, ET CE QU'IL SE CONTENTE DE MESURER

   Il doit passer au vert. Ses contrôles portent sur la MESURE — elle est juste,
   elle est reproductible, elle sait voir un désaccord qu'on a mis exprès — et
   jamais sur le verdict. Un outil dont le vert dépendrait de la réponse ne
   serait plus une mesure, ce serait un vœu.

   Les auto-tests sont donc au cœur du fichier :

     · deux lois qu'on sait IDENTIQUES doivent donner une dérive nulle ;
     · un désaccord fabriqué de taille connue — G décalé de 10⁻⁴, 10⁻³, 10⁻² —
       doit ressortir à la bonne taille, et la réponse doit être LINÉAIRE ;
     · en retirant le terme relativiste de la loi de la scène, la dérive doit
       s'effondrer. C'est le contrôle qui compte : il prouve que ce qu'on mesure
       vient bien de la relativité et non de deux intégrateurs différents, de
       deux jeux de conditions initiales, ou d'une erreur de repère.

   ---------------------------------------------------------------------------
   D'OÙ VIENNENT LES NOMBRES

   Aucune constante n'est écrite ici de mémoire. Toutes se relisent :

     · `physique.js`   M, R_HORIZON, R_ISCO, R_OMBRE, SEC_PAR_UNITE,
                       KM_PAR_UNITE, integre, vCirc, cadence
     · `ncorps.js`     G, GM☉, les trois coefficients de Roche, l'intégrateur
                       symplectique et la période képlérienne de référence
     · `kerr.js`       rIsco de Bardeen 1972, l'arbitre des formes fermées
     · `camera.js`     la focale et la projection réelle du calque
     · `temps.js`      les quatre crans de la barre du temps
     · `index.html`    la butée de la molette — relue par expression régulière,
                       pas recopiée, pour qu'elle suive si elle change
     · `contenu.js`    la masse de Sagittarius A*, seule source factuelle
     · `lune.js`       le rayon du Soleil, 695 700 km, UAI 2015 B3

   UNE SEULE VALEUR sort de `physique.js` et de `contenu.js` : le rayon du
   Soleil, qui n'existe nulle part ailleurs dans le dépôt que dans `lune.js`.
   Elle y porte sa source, et on le dit plutôt que de la choisir.

   La masse du trou noir est calculée DEUX FOIS par deux chemins sans rapport —
   depuis r_s et le temps de traversée de la lumière d'un côté, lue dans
   `contenu.js` de l'autre — et l'accord des deux est un contrôle.

   ---------------------------------------------------------------------------
   CE QUE CETTE MESURE NE SAIT PAS VOIR

   Écrit ici et répété à la fin, parce qu'un outil qui prétend couvrir ce qu'il
   ne couvre pas endort au lieu de garder.

     · Elle ne regarde que le plan équatorial. Une orbite inclinée ajouterait
       la précession de Lense-Thirring, que ni `integre` ni `ncorps.js` ne
       connaissent — donc un troisième désaccord, non mesuré ici.
     · Elle ne regarde que des orbites peu excentriques. La précession du
       périastre est contrôlée contre sa forme fermée, mais l'approche de la
       limite de Roche se ferait sur une orbite très excentrique, où le premier
       ordre ne vaut plus.
     · Elle ne mesure pas de géodésique de Kerr de type temps : le spin n'entre
       que par les formes fermées de Bardeen, contrôlées contre `kerr.js`.
     · Elle ne dit rien du rayonnement gravitationnel, qui décide de la spirale
       d'un vrai couple serré et qu'aucun des deux moteurs ne porte.
     · Elle ne dit rien de la LISIBILITÉ. Un décalage d'un pixel peut se voir
       s'il fait battre un trait, et un décalage de dix peut passer inaperçu au
       milieu du disque. Le seuil du pixel est une borne de sécurité, pas un
       seuil de perception : celui-là ne se calcule pas, il se regarde.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

/* ---------------------------------------------------------------------------
   CHARGEMENT — chaque module dans un faux `window`, sans navigateur
   --------------------------------------------------------------------------- */

const lis = f => fs.readFileSync(path.join(__dirname, f), "utf8");

const faux = {};
const MODULES = ["physique.js", "ncorps.js", "kerr.js", "camera.js", "temps.js"];
for(const m of MODULES) new Function("window", lis(m))(faux);

/* `lune.js` a son propre `window` : on ne lui demande qu'une chose — le rayon
   du Soleil et sa source — et l'isoler évite qu'il pose des globaux dans le
   décompte du chargement principal, qui est lui-même un contrôle. */
const fauxLune = {};
new Function("window", lis("lune.js"))(fauxLune);

const P = faux.PHYSIQUE, N = faux.NCORPS, K = faux.KERR,
      CAM = faux.CAMERA, TPS = faux.TEMPS, L = fauxLune.LUNE;

const { M, R_HORIZON, R_ISCO, R_OMBRE, SEC_PAR_UNITE, KM_PAR_UNITE,
        integre, vCirc, cadence, len, cross, norm } = P;

/* ---------------------------------------------------------------------------
   LE GREFFIER — même forme que les autres outils du dépôt
   --------------------------------------------------------------------------- */

let n = 0, echecs = 0;
const rates = [];
const dit = t => console.log(t);
const groupe = t => { dit(""); dit("  " + t); dit("  " + "─".repeat(t.length)); };
const titre = t => { dit(""); dit("  " + "═".repeat(74)); dit("  " + t);
                     dit("  " + "═".repeat(74)); };

function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai){ echecs++; rates.push(nom); }
  dit("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) dit("        attendu " + attendu + "   mesuré " + mesure);
  if(note) dit("        " + note);
  return vrai;
}
const pc  = x => (100*x).toFixed(4) + " %";
const rel = (a, b) => Math.abs(a - b) / (Math.abs(b) || 1);

dit("");
dit("  LE COMPAGNON — NEWTON PAR-DESSUS LA SCÈNE, MESURÉ");
dit("  " + "═".repeat(49));

/* ═══════════════════════════════════════════ 0. LE SOL SUR LEQUEL ON MESURE */
titre("0. LE SOL — les modules, les constantes, et deux chemins vers la même masse");

groupe("Les modules se chargent et posent chacun leur seul global");
{
  const poses = Object.keys(faux).sort().join(", ");
  ok("les cinq modules ne posent que leurs cinq globaux",
     poses === "CAMERA, KERR, NCORPS, PHYSIQUE, TEMPS",
     "CAMERA, KERR, NCORPS, PHYSIQUE, TEMPS", poses,
     "un module qui en pose deux écraserait quelque chose en silence — c'est " +
     "déjà arrivé dans ce dépôt avec window.VOYAGE");
  ok("lune.js, isolé, ne pose que LUNE",
     Object.keys(fauxLune).join(",") === "LUNE",
     "LUNE", Object.keys(fauxLune).join(","));
}

groupe("Les unités du site, relues et non recopiées");
{
  const cSite = KM_PAR_UNITE / SEC_PAR_UNITE;          // km/s, dérivée du site
  const cExact = L.C / 1000;                            // 299 792,458 km/s, LUNE
  ok("c déduite de r_s et de son temps de traversée retombe sur c",
     rel(cSite, cExact) < 3e-4, cExact.toFixed(3) + " km/s",
     cSite.toFixed(3) + " km/s  (écart " + pc(rel(cSite, cExact)) + ")",
     "SEC_PAR_UNITE est arrondie à 42,34 s : l'écart de 2,5 dix-millièmes est " +
     "cet arrondi, et rien d'autre");
}

/* La masse, par deux chemins qui n'ont rien en commun. */
const M_SUR_MSOL_DERIVEE = (() => {
  const rs = KM_PAR_UNITE * 1000;                       // m
  const c  = (KM_PAR_UNITE / SEC_PAR_UNITE) * 1000;     // m/s
  return rs * c * c / (2 * N.GM_SOLEIL);                // r_s = 2GM/c²
})();

const M_SUR_MSOL_CONTENU = (() => {
  /* On relit la phrase de `contenu.js` plutôt que d'écrire le nombre : c'est la
     seule source factuelle du dépôt, et la règle 6 veut qu'on y aille. */
  const src = lis("contenu.js");
  const m = src.match(/masse:\s*"([\d,\s]+)\s*×\s*10⁶\s*masses solaires"/);
  return m ? parseFloat(m[1].replace(",", ".").replace(/\s/g, "")) * 1e6 : NaN;
})();

groupe("La masse de Sagittarius A*, par deux chemins sans rapport");
ok("r_s c²/2GM☉ retrouve la masse écrite dans contenu.js",
   isFinite(M_SUR_MSOL_CONTENU) &&
   rel(M_SUR_MSOL_DERIVEE, M_SUR_MSOL_CONTENU) < 5e-3,
   M_SUR_MSOL_CONTENU.toExponential(4) + " M☉  [contenu.js]",
   M_SUR_MSOL_DERIVEE.toExponential(4) + " M☉  (écart "
   + pc(rel(M_SUR_MSOL_DERIVEE, M_SUR_MSOL_CONTENU)) + ")",
   "l'un vient de physique.js et de GM☉ ; l'autre est une phrase sourcée. " +
   "S'ils s'accordent, mes unités sont celles du site");

groupe("Les deux ISCO du site, et le seul spin où ils sont d'accord");
{
  ok("à spin nul, KERR.rIsco et PHYSIQUE.R_ISCO donnent le même rayon",
     Math.abs(K.rIsco(0, true) - R_ISCO) < 1e-9,
     R_ISCO.toFixed(6), K.rIsco(0, true).toFixed(6),
     "c'est le SEUL spin où ils s'accordent — voir la mesure du groupe 6");
}

/* ═══════════════════════════════════════════════ 1. L'APPAREIL DE MESURE */
titre("1. L'APPAREIL — deux lois, un même départ, une même horloge");

/* La loi de la SCÈNE : `PHYSIQUE.integre`, telle quelle, sans copie.
   Départ à [r, 0, 0], vitesse v_circ dans le plan du disque (x, z), qui est
   celui où le calque trace déjà le cercle de l'ISCO.                        */
function scene(r, duree, nPas){
  let p = [r, 0, 0], v = [0, 0, vCirc(r)];
  const dt = duree / nPas;
  let phi = 0, prec = 0;
  for(let i = 0; i < nPas; i++){
    [p, v] = integre(p, v, dt);
    const a = Math.atan2(p[2], p[0]);
    let d = a - prec;
    if(d >  Math.PI) d -= 2*Math.PI;
    if(d < -Math.PI) d += 2*Math.PI;
    phi += d; prec = a;
  }
  return { phi, r: len(p) };
}

/* La loi de NEWTON : `ncorps.js`, tel quel, avec son intégrateur symplectique.
   Le plan de `etatDepuisElements` est (x, y) — l'angle se lit donc là, et se
   tromper de plan donne un compagnon immobile qui ressemble à une dérive
   totale. C'est l'erreur qu'on a faite en premier.                          */
function newton(r, duree, nPas, opts){
  opts = opts || {};
  const G = opts.G === undefined ? 1 : opts.G;
  const m1 = opts.m1 === undefined ? M : opts.m1;
  const s = N.deuxCorps(m1, opts.m2 || 0, r, 0, { G });
  const h = duree / nPas;
  const ang = () => Math.atan2(s.p[4] - s.p[1], s.p[3] - s.p[0]);
  let phi = 0, prec = ang();
  for(let i = 0; i < nPas; i++){
    N.pas(s, h);
    const a = ang();
    let d = a - prec;
    if(d >  Math.PI) d -= 2*Math.PI;
    if(d < -Math.PI) d += 2*Math.PI;
    phi += d; prec = a;
  }
  return { phi, r: Math.hypot(s.p[3]-s.p[0], s.p[4]-s.p[1], s.p[5]-s.p[2]) };
}

/* Les deux périodes en forme fermée, chacune vérifiée plus bas contre une
   intégration. `T_SCENE` est celle du temps propre, celle que la barre du
   temps du site fait défiler ; `T_NEWTON` est celle de `periodeKepler`.     */
const T_SCENE  = r => 2*Math.PI*r / vCirc(r);
const T_NEWTON = r => N.periodeKepler(r, M, 0, 1);

/* Combien de pas pour une mesure : proportionnel au nombre de tours, jamais
   moins de vingt mille. Le pas reste FIXE pendant une mesure — `ncorps.js`
   rappelle qu'un pas variable tue la symplecticité, et un pas variable dans
   `integre` ferait dériver la comparaison au lieu de la mesurer.            */
const pasPour = tours => Math.min(1.6e6, Math.max(20000, Math.round(tours*2000)));

/* La dérive cumulée, MESURÉE : on lâche les deux au même endroit, on les fait
   avancer la même durée, et on lit l'écart d'angle. Rien n'est déduit d'une
   formule ici — c'est la mesure que les formules doivent retrouver.         */
function derive(r, duree, opts){
  const tours = duree / T_SCENE(r);
  const nPas = pasPour(tours);
  const a = scene(r, duree, nPas);
  const b = newton(r, duree, nPas, opts);
  const dphi = b.phi - a.phi;
  /* LE PIÈGE, ET IL S'EST REFERMÉ SUR MOI À LA PREMIÈRE EXÉCUTION.

     La séparation des deux points vaut 2r·|sin(Δφ/2)| : c'est une CORDE, donc
     elle est périodique. Un compagnon en retard de quinze tours et demi se
     retrouve exactement au même endroit que l'autre, et la corde vaut zéro. Le
     balayage a trouvé comme ça une « fenêtre » d'une seule séparation, à
     r = 10,7 — une coïncidence de phase, pas un accord.

     On rend donc `credible`, qui est faux dès que le retard dépasse un
     demi-tour. Au-delà, les deux compagnons ne sont pas décalés : ils sont à
     deux endroits sans rapport, et le fait qu'ils se croisent parfois ne
     prouve rien. C'est la règle 5 du dépôt — un contrôle qui n'est d'accord
     avec lui-même qu'au moment où on le regarde est un contrôle qui ment. */
  return {
    tours, dphi,
    corde: 2*Math.abs(Math.sin(dphi/2)),
    credible: Math.abs(dphi) <= Math.PI,
    retard: Math.abs(dphi)/(2*Math.PI),
    rScene: a.r, rNewton: b.r,
  };
}

/* La session dont on parle partout : dix minutes de temps réel, jouées à l'un
   des quatre crans de la barre du temps. Les crans viennent de `temps.js` et
   ne sont pas recopiés — le jour où l'un d'eux change, ce fichier suit.     */
const SESSION_S = 600;
const dureeGeo = mult => SESSION_S*mult/SEC_PAR_UNITE;
const DIAM_OMBRE = 2*R_OMBRE;

groupe("La durée d'une session, et les crans qui la peuplent");
ok("les quatre crans de la barre du temps sont lus dans temps.js",
   TPS.VITESSES.length === 4 && TPS.VITESSES[0].mult === 1,
   "quatre crans dont le premier est le temps réel",
   TPS.VITESSES.map(v => "×" + v.mult).join("  ") + "   →   dix minutes valent "
   + TPS.VITESSES.map(v => dureeGeo(v.mult).toFixed(0)).join(", ")
   + " unités géométriques");

groupe("Chaque loi retrouve sa propre période");
for(const r of [4, 10, 40, 200]){
  const T = T_SCENE(r);
  const a = scene(r, T, pasPour(1));
  ok("la scène boucle un tour en 2πr/v_circ à r = " + r,
     rel(a.phi, 2*Math.PI) < 2e-4, "2π = 6,283185",
     a.phi.toFixed(6) + " rad en " + T.toFixed(2) + " unités  (écart "
     + pc(rel(a.phi, 2*Math.PI)) + ")");
  const Tn = T_NEWTON(r);
  const b = newton(r, Tn, pasPour(1));
  ok("Newton boucle un tour en 2π√(r³/GM) à r = " + r,
     rel(b.phi, 2*Math.PI) < 2e-4, "2π = 6,283185",
     b.phi.toFixed(6) + " rad en " + Tn.toFixed(2) + " unités  (écart "
     + pc(rel(b.phi, 2*Math.PI)) + ")",
     r === 4 ? "periodeKepler est la référence analytique de ncorps.js, pas " +
               "une sortie de son intégrateur" : undefined);
}

groupe("Les orbites restent circulaires — sinon on mesurerait un battement");
for(const r of [4, 40]){
  const d = derive(r, 6*T_SCENE(r));
  const e1 = Math.abs(d.rScene - r)/r, e2 = Math.abs(d.rNewton - r)/r;
  ok("après six tours à r = " + r + ", les deux rayons tiennent",
     e1 < 2e-3 && e2 < 2e-3, "< 0,2 %",
     "scène " + pc(e1) + "   Newton " + pc(e2));
}

groupe("Le rapport des périodes EST la cadence des horloges");
for(const r of [3.5, 6, 20, 100, 1000]){
  const mesure = T_SCENE(r) / T_NEWTON(r);
  ok("T_scène / T_Newton = √(1 − 3M/r) à r = " + r,
     rel(mesure, cadence(r)) < 1e-12,
     cadence(r).toFixed(9) + "  [PHYSIQUE.cadence]", mesure.toFixed(9),
     r === 3.5 ? "la même fonction que les horloges du paradoxe des jumeaux, " +
                 "retrouvée là où on ne l'attendait pas" : undefined);
}

/* ═══════════════════════════════════════ 2. AUTO-TESTS — la mesure sait voir */
titre("2. AUTO-TESTS — une mesure qui ne voit pas un écart mis exprès ne prouve rien");

groupe("Elle ne crie pas au loup : deux lois identiques ne dérivent pas");
{
  const r = 30, duree = 40*T_NEWTON(r);
  const nPas = pasPour(40);
  const a = newton(r, duree, nPas);
  const b = newton(r, duree, nPas);
  ok("Newton contre Newton, quarante tours : dérive nulle",
     Math.abs(a.phi - b.phi) < 1e-9, "< 1e-9 rad",
     Math.abs(a.phi - b.phi).toExponential(2) + " rad",
     "un détecteur qui aboie toujours est aussi inutile qu'un détecteur muet");
}

groupe("Elle voit un désaccord fabriqué, et à la BONNE taille");
/* On décale G d'une fraction connue. La période va comme G^(−1/2), donc dans une
   DURÉE fixée le corps fait √(1+ε) fois plus de tours, et la dérive de phase
   après T tours de référence vaut 2πT(√(1+ε) − 1) ≈ πTε. Trois tailles : si la
   réponse n'est pas linéaire, la mesure ne mesure pas ce qu'elle croit.

   Le signe compte, et la première version l'avait à l'envers : plus de gravité,
   c'est plus vite, donc une AVANCE. Une mesure d'écart en valeur absolue aurait
   avalé l'erreur sans rien dire — c'est pourquoi on compare la valeur signée. */
{
  const r = 30, tours = 40, duree = tours*T_NEWTON(r), nPas = pasPour(tours);
  const ref = newton(r, duree, nPas);
  const pentes = [];
  for(const eps of [1e-4, 1e-3, 1e-2]){
    const casse = newton(r, duree, nPas, { G: 1 + eps });
    const mesure = casse.phi - ref.phi;
    const attendu = 2*Math.PI*tours*(Math.sqrt(1 + eps) - 1);
    pentes.push(mesure/eps);
    ok("G décalé de " + eps.toExponential(0) + " ressort à la taille prévue",
       rel(mesure, attendu) < 5e-3, attendu.toExponential(4) + " rad",
       mesure.toExponential(4) + " rad  (écart " + pc(rel(mesure, attendu)) + ")");
  }
  const ecartPente = Math.max(...pentes.map(p => Math.abs(p/pentes[0] - 1)));
  ok("la réponse est linéaire sur deux décades de perturbation",
     ecartPente < 6e-3, "pentes égales à 0,6 % près",
     "dispersion " + pc(ecartPente),
     "une mesure qui saturerait, ou qui ne verrait que les gros écarts, " +
     "annoncerait « rien à signaler » exactement là où ça compte");
}

groupe("Et surtout : elle ISOLE la cause");
/* LE CONTRÔLE QUI COMPTE.

   On rejoue la loi de la scène en lui retirant son seul terme relativiste — le
   3L²/r² de `acceleration` — et rien d'autre. Même intégrateur, même pas, mêmes
   conditions initiales, même lecture d'angle. Si la dérive s'effondre, alors ce
   que la mesure voit vient bien de la relativité, et pas de deux intégrateurs
   qui ne se ressemblent pas, ni d'un repère mal lu.

   Sans cette ligne, tout le reste du fichier serait une affirmation qu'on ne
   peut pas mettre en doute, donc sans valeur.                                */
{
  const accelNewton = p => {
    const r3 = Math.pow(len(p), 3);
    return [-M*p[0]/r3, -M*p[1]/r3, -M*p[2]/r3];
  };
  // le même schéma point-milieu que `integre`, au terme correctif près
  const integreNewton = (p, v, dt) => {
    const a  = accelNewton(p);
    const pm = [p[0]+v[0]*dt*0.5, p[1]+v[1]*dt*0.5, p[2]+v[2]*dt*0.5];
    const vm = [v[0]+a[0]*dt*0.5, v[1]+a[1]*dt*0.5, v[2]+a[2]*dt*0.5];
    const am = accelNewton(pm);
    return [[p[0]+vm[0]*dt, p[1]+vm[1]*dt, p[2]+vm[2]*dt],
            [v[0]+am[0]*dt, v[1]+am[1]*dt, v[2]+am[2]*dt]];
  };
  const sceneSansRelativite = (r, duree, nPas) => {
    // vitesse circulaire NEWTONIENNE, cohérente avec l'accélération retirée
    let p = [r, 0, 0], v = [0, 0, Math.sqrt(M/r)];
    const dt = duree/nPas;
    let phi = 0, prec = 0;
    for(let i = 0; i < nPas; i++){
      [p, v] = integreNewton(p, v, dt);
      const a = Math.atan2(p[2], p[0]);
      let d = a - prec;
      if(d >  Math.PI) d -= 2*Math.PI;
      if(d < -Math.PI) d += 2*Math.PI;
      phi += d; prec = a;
    }
    return phi;
  };

  const r = 30, tours = 20, duree = tours*T_NEWTON(r), nPas = pasPour(tours);
  const avec  = Math.abs(newton(r, duree, nPas).phi - scene(r, duree, nPas).phi);
  const sans  = Math.abs(newton(r, duree, nPas).phi - sceneSansRelativite(r, duree, nPas));
  ok("le terme 3L²/r² retiré, la dérive s'effondre",
     sans < avec/300 && avec > 1, "sans ≪ avec, d'un facteur > 300",
     "avec " + avec.toFixed(5) + " rad   sans " + sans.toExponential(2)
     + " rad   (facteur " + Math.round(avec/sans) + ")",
     "ce que la mesure voit est la relativité, pas une différence " +
     "d'intégrateur ni un repère mal lu");
}

groupe("Elle ne confond pas « au même endroit » et « d'accord »");
/* CE CONTRÔLE EXISTE PARCE QUE LA PREMIÈRE EXÉCUTION A MENTI.

   Le balayage du verdict avait trouvé une « fenêtre » d'une seule séparation,
   r = 10,7 au cran le plus rapide. Vérification faite, le compagnon newtonien
   y avait quinze tours et demi de retard : il repassait simplement au même
   endroit. La séparation mesurée — une corde — était nulle, et l'accord était
   une coïncidence de phase.

   On fabrique donc exactement ce cas et l'on vérifie que la mesure le refuse
   maintenant. C'est la règle 1 du dépôt : tout défaut trouvé devient un
   contrôle, y compris quand c'est mon propre outil qui l'a produit. */
{
  const r = 10.7, D = dureeGeo(3600);
  const d = derive(r, D);
  ok("un compagnon en retard de plusieurs tours n'est pas déclaré d'accord",
     d.retard > 1 && !d.credible,
     "retard de plus d'un tour, mesure refusée",
     "retard " + d.retard.toFixed(2) + " tour" + (d.retard > 1 ? "s" : "")
     + ", corde " + d.corde.toFixed(4) + " r  →  "
     + (d.credible ? "ACCEPTÉE" : "refusée"),
     "la corde est périodique : sans ce garde-fou, elle rend l'accord parfait " +
     "une fois par tour de retard");
  // et le garde-fou doit laisser passer un vrai petit écart
  const p = derive(300, dureeGeo(600));
  ok("mais un petit retard, lui, passe",
     p.retard < 0.5 && p.credible,
     "retard sous un demi-tour, mesure acceptée",
     "retard " + p.retard.toFixed(5) + " tour  →  "
     + (p.credible ? "acceptée" : "REFUSÉE"),
     "un garde-fou qui refuserait tout serait aussi inutile qu'un garde-fou " +
     "qui accepterait tout");
}

groupe("Elle est reproductible : le pas ne fabrique pas le résultat");
{
  const r = 30, duree = 20*T_SCENE(r);
  const brut = (nPas) => newton(r, duree, nPas).phi - scene(r, duree, nPas).phi;
  const a = brut(40000), b = brut(160000);
  ok("quadrupler le nombre de pas ne déplace pas la mesure",
     rel(a, b) < 5e-3, b.toFixed(6) + " rad (pas fin)",
     a.toFixed(6) + " rad (pas grossier)   écart " + pc(rel(a, b)),
     "si le résultat bougeait avec le pas, on mesurerait l'intégrateur et non " +
     "la différence des deux lois");
}

groupe("Le convertisseur en pixels dit la même chose que la caméra du site");
/* Ma formule : un décalage transverse Δ à la profondeur z vaut Δ/z · F · H/2
   pixels. L'oracle est `CAMERA.projette`, qui est le code que la page exécute.
   Deux chemins, un seul résultat — sinon le seuil du pixel serait une opinion. */
const pxParUnite = (z, vueH) => CAM.FOCAL * vueH / (2*z);
{
  const e = { cross, norm };
  let pire = 0;
  for(const dist of [8, 21, 46]){
    for(const vue of [{W:1440,H:900}, {W:390,H:684}, {W:1024,H:1366}]){
      const cam = CAM.etat(); cam.dist = dist; CAM.majLibre(cam, e);
      const p = [3.1, 0.4, -2.2];
      const b = cam.base;
      const q = [p[0]-cam.pos[0], p[1]-cam.pos[1], p[2]-cam.pos[2]];
      const z = q[0]*b.a[0] + q[1]*b.a[1] + q[2]*b.a[2];
      const h = 1e-6;
      const p2 = [p[0]+h*b.d[0], p[1]+h*b.d[1], p[2]+h*b.d[2]];
      const mesure = (CAM.projette(cam, p2, vue)[0] - CAM.projette(cam, p, vue)[0]) / h;
      pire = Math.max(pire, rel(mesure, pxParUnite(z, vue.H)));
    }
  }
  ok("Δ/z · F · H/2 est bien ce que projette la caméra", pire < 1e-6,
     "< 1e-6", pire.toExponential(2),
     "neuf combinaisons de distance et d'écran, focale " + CAM.FOCAL
     + " lue dans camera.js");
}

groupe("Et le seuil du pixel sait, lui aussi, tomber");
{
  const z = 30, H = 900;
  const unPixel = 1/pxParUnite(z, H);
  ok("un décalage fabriqué d'un pixel se lit comme un pixel",
     Math.abs(unPixel*pxParUnite(z, H) - 1) < 1e-12, "1,000000",
     (unPixel*pxParUnite(z, H)).toFixed(6));
  ok("un décalage de quatre dixièmes de pixel passe sous le seuil",
     0.4*unPixel*pxParUnite(z, H) < 1, "< 1", (0.4).toFixed(3));
}

/* ═════════════════════════════════════════ 3. LA PRÉCESSION DU PÉRIASTRE */
titre("3. LA PRÉCESSION DU PÉRIASTRE — ce que Newton n'a pas du tout");

/* Kerr et Schwarzschild font avancer le périastre ; Newton le laisse fixe. La
   forme fermée est EXACTE pour une orbite peu excentrique :

       Δϖ = 2π ( 1/√(1 − 6M/r) − 1 )   par tour radial

   et elle diverge en r = 6M, c'est-à-dire à l'ISCO. C'est la formule que
   `outil-verif-vol.js` contrôle déjà ; on la reprend telle quelle, avec sa ruse
   du RAYON GUIDE — pousser une orbite circulaire lui donne du moment cinétique,
   donc elle se recentre plus haut, et comparer au rayon de départ mesure une
   erreur qu'on a soi-même introduite.                                       */
const precessionTheorie = r => 2*Math.PI*(1/Math.sqrt(1 - 6*M/r) - 1);
const rayonGuide = L2 => (L2 + Math.sqrt(L2*L2 - 12*M*M*L2)) / (2*M);

function precessionMesuree(r0){
  const dLnL = 0.5*(2 - r0/(r0 - 3*M));
  const v0 = vCirc(r0)*(1 + 0.002*dLnL);
  let p = [r0, 0, 0], v = [0, 0, v0];
  const rg = rayonGuide((r0*v0)**2);
  const angle = () => Math.atan2(p[2], p[0]);
  const dt = T_SCENE(r0)/20000;
  let phi = 0, prec = angle(), rPrec = len(p), montait = false;
  const sommets = [];
  for(let i = 0; i < 4000000 && sommets.length < 4; i++){
    [p, v] = integre(p, v, dt);
    let d = angle() - prec;
    if(d >  Math.PI) d -= 2*Math.PI;
    if(d < -Math.PI) d += 2*Math.PI;
    phi += d; prec = angle();
    const r = len(p);
    if(montait && r < rPrec) sommets.push(phi);
    montait = r > rPrec;
    rPrec = r;
  }
  if(sommets.length < 2) return null;
  let s = 0;
  for(let i = 1; i < sommets.length; i++) s += sommets[i] - sommets[i-1] - 2*Math.PI;
  return { avance: s/(sommets.length - 1), rg };
}

groupe("La scène précesse de ce que Schwarzschild prédit, Newton de rien");
for(const r0 of [3.5, 6, 20, 100]){
  const m = precessionMesuree(r0);
  const t = m ? precessionTheorie(m.rg) : NaN;
  ok("avance par tour à r = " + r0,
     m !== null && rel(m.avance, t) < 8e-3,
     (t*180/Math.PI).toFixed(4) + " °", m === null ? "—"
     : (m.avance*180/Math.PI).toFixed(4) + " °  (écart " + pc(rel(m.avance, t)) + ")",
     "rayon guide " + (m ? m.rg.toFixed(3) : "—"));
}
{
  // Et Newton, lui, ne précesse pas — mesuré, pas supposé.
  const r0 = 20, tours = 30;
  const s = N.deuxCorps(M, 0, r0, 0.03, { G: 1 });
  const nPas = 8*pasPour(tours);
  const h = tours*T_NEWTON(r0)/nPas;
  const om0 = N.elements(s, 1).omega;
  for(let i = 0; i < nPas; i++) N.pas(s, h);
  let dOm = Math.abs(N.elements(s, 1).omega - om0);
  if(dOm > Math.PI) dOm = 2*Math.PI - dOm;
  /* Le seuil ne se choisit pas dans l'absolu — le résidu qui reste est celui du
     pas, pas une précession. On le compare donc à ce que la scène accumule au
     même endroit : mille fois moins, et l'affirmation « Newton ne précesse
     pas » veut dire quelque chose. */
  const scenePrec = tours*precessionTheorie(r0);
  ok("l'ellipse de ncorps.js reste fermée sur trente tours",
     dOm < scenePrec/1000, "moins d'un millième de ce que la scène accumule",
     dOm.toExponential(2) + " rad contre " + scenePrec.toFixed(3) + " rad  (rapport 1/"
     + Math.round(scenePrec/dOm) + ")",
     "ce qui reste est le résidu du pas symplectique, pas une avance du " +
     "périastre : Newton n'en a aucune, et c'est tout le sujet");
}

/* ═══════════════════════════════ 4. LE TABLEAU — séparation par séparation */
titre("4. LE TABLEAU DES ÉCARTS");

const SEPARATIONS = [3.5, 4, 5, 6, 8, 10, 14, 20, 30, 50, 100, 300, 1000, 3000];

dit("");
dit("  Dix minutes de temps réel. La colonne « tours » et la colonne « dérive »");
dit("  sont MESURÉES en faisant tourner les deux moteurs côte à côte ; les");
dit("  colonnes « période » et « précession » sont les formes fermées, chacune");
dit("  contrôlée plus haut contre une intégration.");
dit("");
dit("     r     T scène    écart de   précession   dérive par tour");
dit("   (r_s)     (s)      période      (°/tour)    (r_s)  (ombres)");
dit("  " + "─".repeat(62));

const lignes = [];
for(const r of SEPARATIONS){
  const Ts = T_SCENE(r), Tn = T_NEWTON(r);
  const ecartT = (Tn - Ts)/Ts;                  // Newton est plus LENTE
  const prec = precessionTheorie(r)*180/Math.PI;
  // dérive après exactement un tour de la scène, mesurée
  const d1 = derive(r, Ts);
  const arc = Math.abs(d1.dphi)*r;
  lignes.push({ r, Ts, Tn, ecartT, prec, arc, ombres: arc/DIAM_OMBRE, dphi1: d1.dphi });
  dit("  " + String(r).padStart(6) + "  " + (Ts*SEC_PAR_UNITE).toExponential(2).padStart(9)
      + "  " + (100*ecartT).toFixed(3).padStart(9) + " %"
      + "  " + prec.toFixed(3).padStart(10)
      + "  " + arc.toFixed(3).padStart(8) + "  " + (arc/DIAM_OMBRE).toFixed(3).padStart(8));
}

groupe("Le tableau se tient : la mesure retrouve la forme fermée");
{
  let pire = 0, ou = 0;
  for(const l of lignes){
    const attendu = 2*Math.PI*(1 - cadence(l.r));   // par tour de la SCÈNE
    const e = rel(Math.abs(l.dphi1), attendu);
    if(e > pire){ pire = e; ou = l.r; }
  }
  ok("la dérive mesurée par tour vaut 2π(1 − √(1 − 3M/r)) partout",
     pire < 6e-3, "< 0,6 % sur les quatorze séparations",
     pc(pire) + " au pire, à r = " + ou,
     "l'un est une intégration de deux moteurs différents, l'autre trois " +
     "lignes d'algèbre — ils ne peuvent pas se tromper de la même façon");
}

groupe("LE NOMBRE QUI DÉCIDE — il ne dépend d'aucune distance");
{
  const rap = lignes.map(l => l.ombres);
  const bas = Math.min(...rap), haut = Math.max(...rap);
  const limite = 3*Math.PI*M / DIAM_OMBRE;         // 3πM / 2R_OMBRE
  ok("la dérive par tour vaut UNE largeur d'ombre, de l'ISCO à 3 000 r_s",
     bas > 0.85 && haut < 1.15,
     "dans [0,85 ; 1,15] sur trois décades de séparation",
     "de " + bas.toFixed(3) + " à " + haut.toFixed(3) + " diamètre d'ombre",
     "limite au large : 3πM / 2R_OMBRE = " + limite.toFixed(4));
  ok("et elle tend bien vers cette limite quand on s'éloigne",
     rel(rap[rap.length - 1], limite) < 2e-3,
     limite.toFixed(5), rap[rap.length - 1].toFixed(5)
     + "  (à r = " + lignes[lignes.length-1].r + ")",
     "s'éloigner ne rapproche pas les deux lois : l'écart et l'objet " +
     "rapetissent ensemble, exactement à la même vitesse");
}

/* ═══════════════════════════════════════════════ 5. LA SESSION ET L'ÉCRAN */
titre("5. DIX MINUTES DE SESSION, ET CE QUE L'ÉCRAN EN MONTRE");

/* Les gabarits d'écran sont ceux dont `outil-verif-camera.js` se sert déjà :
   ce ne sont pas des constantes physiques, ce sont les appareils du dépôt. */
const ECRANS = [
  { nom: "grand écran",               W: 1440, H:  900 },
  { nom: "téléphone, barre déployée", W:  390, H:  620 },
  { nom: "téléphone couché",          W:  844, H:  390 },
  { nom: "tablette debout",           W: 1024, H: 1366 },
  { nom: "carré",                     W:  900, H:  900 },
];
const ECRAN_REF = ECRANS[0];

/* La butée de la molette se RELIT dans index.html. La recopier ici la ferait
   mentir le jour où quelqu'un la change ; et c'est justement la borne qui
   décide de tout ce chapitre.                                              */
const PORTEE = (() => {
  const src = lis("index.html");
  const re = /cam\.dist\s*=\s*Math\.max\((\d+(?:\.\d+)?),\s*Math\.min\((\d+(?:\.\d+)?),/g;
  const vus = [];
  let m;
  while((m = re.exec(src))) vus.push([parseFloat(m[1]), parseFloat(m[2])]);
  return vus;
})();

groupe("La portée de la caméra, relue dans la page");
ok("les deux commandes de zoom bornent la distance de la même façon",
   PORTEE.length >= 2 && PORTEE.every(v => v[0] === PORTEE[0][0] && v[1] === PORTEE[0][1]),
   "au moins deux bornages identiques",
   PORTEE.length + " trouvés : " + PORTEE.map(v => "[" + v[0] + " ; " + v[1] + "]").join(" "),
   "molette et pince — deux endroits qui doivent s'accorder sans se voir");

const DIST_MIN = PORTEE.length ? PORTEE[0][0] : 6;
const DIST_MAX = PORTEE.length ? PORTEE[0][1] : 46;

/* La distance à laquelle l'orbite ENTIÈRE tient dans l'écran, cherchée avec la
   vraie projection de la page et non avec une formule à moi. Rend null si même
   à la butée l'orbite déborde — auquel cas le compagnon n'est simplement pas
   cadrable, et la question du pixel ne se pose plus.                        */
function distanceDeCadrage(r, vue){
  const e = { cross, norm };
  const tient = dist => {
    const cam = CAM.etat(); cam.dist = dist; CAM.majLibre(cam, e);
    for(let i = 0; i < 144; i++){
      const a = i/144*2*Math.PI;
      const q = CAM.projette(cam, [Math.cos(a)*r, 0, Math.sin(a)*r], vue);
      if(!q || q[0] < 0 || q[0] > vue.W || q[1] < 0 || q[1] > vue.H) return false;
    }
    return true;
  };
  if(!tient(DIST_MAX)) return null;
  let bas = DIST_MIN, haut = DIST_MAX;
  if(tient(bas)) return bas;
  for(let i = 0; i < 40; i++){
    const m = 0.5*(bas + haut);
    if(tient(m)) haut = m; else bas = m;
  }
  return haut;
}

// Diamètre apparent de l'ombre, en pixels, à une distance donnée.
const ombreEnPx = (dist, vueH) => DIAM_OMBRE * pxParUnite(dist, vueH);

dit("");
dit("  Le cadrage : à quelle distance l'orbite entière tient-elle dans l'écran ?");
dit("  « — » veut dire qu'à la butée de " + DIST_MAX + " rayons elle déborde encore.");
dit("");
{
  let entete = "  " + "orbite r =".padEnd(32);
  const rTest = [6, 10, 20, 30, 40];
  for(const r of rTest) entete += String(r).padStart(8);
  dit(entete);
  dit("  " + "─".repeat(32 + 8*rTest.length));
  for(const v of ECRANS){
    let l = "  " + (v.nom + " " + v.W + "×" + v.H).padEnd(32);
    for(const r of rTest){
      const d = distanceDeCadrage(r, v);
      l += (d === null ? "—" : d.toFixed(1)).padStart(8);
    }
    dit(l);
  }
}

/* Le plus grand rayon cadrable, par écran — la borne haute du « regardable ». */
function plusGrandCadrable(vue){
  let bas = 1, haut = 200;
  if(distanceDeCadrage(bas, vue) === null) return 0;
  for(let i = 0; i < 34; i++){
    const m = 0.5*(bas + haut);
    if(distanceDeCadrage(m, vue) !== null) bas = m; else haut = m;
  }
  return bas;
}
const CADRABLE = ECRANS.map(v => ({ v, r: plusGrandCadrable(v) }));
const R_CADRABLE_MAX = Math.max(...CADRABLE.map(c => c.r));
const R_CADRABLE_REF = CADRABLE.find(c => c.v === ECRAN_REF).r;
/* Pour le verdict on prend systématiquement l'écran le PLUS FAVORABLE à l'idée :
   celui qui cadre la plus grande orbite, et dont la définition est la plus
   grossière, donc celui qui pardonne le plus de dérive. Juger sur le pire
   écran serait facile et malhonnête.                                        */
const ECRAN_GENEREUX = CADRABLE.reduce((a, b) => b.r > a.r ? b : a).v;

groupe("La plus grande orbite que le site sait cadrer");
for(const c of CADRABLE){
  const d = distanceDeCadrage(c.r*0.999, c.v);
  ok(c.v.nom + " — orbite maximale " + c.r.toFixed(1) + " r_s",
     c.r > 0 && c.r < 200, "une borne finie, imposée par la butée de zoom",
     c.r.toFixed(2) + " r_s à " + (d ? d.toFixed(1) : "—") + " rayons de recul",
     c === CADRABLE[0] ? "au-delà, le compagnon sort du champ la moitié du " +
                         "temps : il n'y a plus d'orbite à montrer" : undefined);
}

/* La session, un tableau par cran. Le « retard » est la grandeur honnête : dès
   qu'il dépasse un demi-tour, le compagnon est ailleurs sur son orbite et le
   nombre de pixels ne veut plus dire « décalé de tant », il veut dire
   « quelque part d'autre ». La colonne des pixels sature donc, et c'est normal
   — on la garde pour les petits retards, où elle est le seul chiffre utile. */
const session = [];
for(const l of lignes){
  const dc = distanceDeCadrage(l.r, ECRAN_REF);
  const z  = dc === null ? DIST_MAX : dc;
  const ligne = { r: l.r, dc, ombre: ombreEnPx(z, ECRAN_REF.H), crans: {} };
  const par = pxParUnite(z, ECRAN_REF.H);
  for(const mult of [600, 3600]){
    const d = derive(l.r, dureeGeo(mult));
    ligne.crans[mult] = { tours: d.tours, retard: d.retard, credible: d.credible,
                          px: d.corde*l.r*par };
  }
  session.push(ligne);
}

for(const mult of [600, 3600]){
  dit("");
  dit("  Cran ×" + mult + (mult === 600 ? " — celui de départ de la barre du temps"
                                        : " — le plus rapide du site")
      + ", sur " + ECRAN_REF.nom + " " + ECRAN_REF.W + "×" + ECRAN_REF.H + " :");
  dit("");
  dit("     r     cadrable    ombre     tours de     retard      dérive");
  dit("   (r_s)    à (r_s)     (px)     l'orbite     (tours)       (px)");
  dit("  " + "─".repeat(66));
  for(const s of session){
    const c = s.crans[mult];
    dit("  " + String(s.r).padStart(6)
        + "  " + (s.dc === null ? "—" : s.dc.toFixed(1)).padStart(9)
        + "  " + (s.dc === null ? "(" + s.ombre.toFixed(0) + ")"
                                : s.ombre.toFixed(0)).padStart(8)
        + "  " + c.tours.toFixed(2).padStart(11)
        + "  " + c.retard.toFixed(3).padStart(10)
        + "  " + (c.credible ? c.px.toExponential(2) : "≫").padStart(11)
        + (c.credible ? "" : "   ailleurs"));
  }
}
dit("");
dit("  « ailleurs » : au-delà d'un demi-tour de retard, les deux compagnons ne");
dit("  sont plus décalés, ils sont à deux endroits sans rapport de l'orbite. La");
dit("  colonne des pixels n'y veut plus rien dire — une corde ne peut pas");
dit("  dépasser le diamètre — et l'on écrit ≫ plutôt qu'un nombre saturé.");
dit("");
dit("  Les valeurs entre parenthèses sont calculées à la butée de zoom, pour une");
dit("  orbite qui n'y tient plus : elles ne décrivent aucune vue possible.");

groupe("La dérive dépasse le pixel partout où l'orbite est cadrable");
{
  const cadrables = session.filter(s => s.dc !== null);
  const pire = Math.min(...cadrables.map(s => Math.min(s.crans[600].px, s.crans[3600].px)));
  const retardMin = Math.min(...cadrables.map(s => s.crans[600].retard));
  ok("aucune séparation cadrable ne tient sous un pixel en dix minutes",
     cadrables.length > 0 && pire > 1, "> 1 px partout",
     "la plus petite dérive cadrable vaut " + pire.toFixed(1) + " px",
     cadrables.length + " séparations cadrables sur " + session.length
     + " ; le plus petit retard y vaut " + retardMin.toFixed(2) + " tour");
}

/* Où le pixel serait tenu, si l'on pouvait reculer autant qu'on veut ? */
function separationDAccord(mult, vue){
  // dérive en px à la distance de cadrage IDÉALE, sans butée de zoom
  const cadrageIdeal = r => {
    // la distance qui met l'orbite juste au bord, sans borne haute
    const e = { cross, norm };
    const tient = dist => {
      const cam = CAM.etat(); cam.dist = dist; CAM.majLibre(cam, e);
      for(let i = 0; i < 72; i++){
        const a = i/72*2*Math.PI;
        const q = CAM.projette(cam, [Math.cos(a)*r, 0, Math.sin(a)*r], vue);
        if(!q || q[0] < 0 || q[0] > vue.W || q[1] < 0 || q[1] > vue.H) return false;
      }
      return true;
    };
    let bas = Math.max(1e-3, r*0.2), haut = r*20;
    for(let i = 0; i < 40; i++){
      const m = 0.5*(bas + haut);
      if(tient(m)) haut = m; else bas = m;
    }
    return haut;
  };
  const pxDe = r => {
    const d = derive(r, dureeGeo(mult));
    return d.corde * r * pxParUnite(cadrageIdeal(r), vue.H);
  };
  let bas = 10, haut = 4e6;
  if(pxDe(haut) > 1) return { r: Infinity };
  for(let i = 0; i < 26; i++){
    const m = Math.sqrt(bas*haut);
    if(pxDe(m) > 1) bas = m; else haut = m;
  }
  return { r: haut, px: pxDe(haut), pxMoitie: pxDe(haut/2),
           cadrage: cadrageIdeal(haut) };
}

const ACCORD = {};
for(const mult of [600, 3600]) ACCORD[mult] = separationDAccord(mult, ECRAN_REF);

dit("");
groupe("À quelle distance faudrait-il aller pour tenir sous le pixel ?");
/* Le contrôle porte sur la RECHERCHE, pas sur son résultat : à la séparation
   trouvée la dérive doit valoir un pixel, et à la moitié de cette séparation
   elle doit franchement le dépasser. Une bissection qui converge n'importe où
   rendrait un nombre qu'on croirait. */
for(const mult of [600, 3600]){
  const a = ACCORD[mult];
  ok("cran ×" + mult + " — la bissection a bien trouvé le pixel",
     isFinite(a.r) && Math.abs(a.px - 1) < 0.02 && a.pxMoitie > 2,
     "1,00 px à la séparation trouvée, plus de 2 px à sa moitié",
     a.px.toFixed(3) + " px à r = " + a.r.toExponential(3) + " r_s ; "
     + a.pxMoitie.toFixed(2) + " px à r = " + (a.r/2).toExponential(2));
}
for(const mult of [600, 3600]){
  const a = ACCORD[mult];
  const ombre = ombreEnPx(a.cadrage, ECRAN_REF.H);
  const tours = dureeGeo(mult)/T_SCENE(a.r);
  dit("");
  dit("    cran ×" + mult + " : l'accord au pixel commence à r = "
      + a.r.toExponential(3) + " r_s,");
  dit("    soit " + (a.r/R_CADRABLE_REF).toFixed(0) + " fois la plus grande orbite "
      + "cadrable (" + R_CADRABLE_REF.toFixed(1) + " r_s).");
  dit("    Là-bas l'ombre du trou noir fait " + ombre.toFixed(2)
      + " px de diamètre, et le compagnon");
  dit("    fait " + tours.toFixed(3) + " tour en dix minutes.");
}

/* ═══════════════════════════ 6. CE QUE LE SPIN AJOUTE, ET QUI N'EST PAS MESURÉ */
titre("6. LE SPIN — la scène a déjà deux lois, et ce n'est pas celle-ci");

/* Les orbites circulaires équatoriales de Kerr, en forme fermée (Bardeen,
   Press & Teukolsky 1972). L'oracle est `kerr.js` : le zéro de la fréquence
   épicyclique doit tomber exactement sur son `rIsco`, qui est une autre forme
   fermée écrite par quelqu'un d'autre.                                      */
const sM = Math.sqrt(M);
const omegaKerr = (r, a, pro) => { const s = pro ? 1 : -1;
  return s*sM/(Math.pow(r, 1.5) + s*a*sM); };
const utKerr = (r, a, pro) => { const s = pro ? 1 : -1;
  return (Math.pow(r, 1.5) + s*a*sM) /
         (Math.pow(r, 0.75)*Math.sqrt(Math.pow(r, 1.5) - 3*M*Math.sqrt(r) + 2*s*a*sM)); };
const kappa2Kerr = (r, a, pro) => { const s = pro ? 1 : -1;
  return (M/(r*r*r))*(1 - 6*M/r + 8*s*a*sM/Math.pow(r, 1.5) - 3*a*a/(r*r)); };

const SPINS = [0, 0.6, 0.9, 0.95];       // les quatre du panneau

groupe("Mes formes fermées de Kerr retombent sur Bardeen");
for(const st of SPINS){
  const a = st*M;
  let bas = 0.3, haut = 9;
  for(let i = 0; i < 80; i++){
    const m = 0.5*(bas + haut);
    if(kappa2Kerr(m, a, true) < 0) bas = m; else haut = m;
  }
  const parKappa = 0.5*(bas + haut);
  ok("a* = " + st + " — le zéro de la fréquence épicyclique EST l'ISCO",
     rel(parKappa, K.rIsco(a, true)) < 1e-9,
     K.rIsco(a, true).toFixed(8) + "  [kerr.js, Bardeen 1972]",
     parKappa.toFixed(8),
     st === 0 ? "deux formes fermées sans rapport, écrites séparément" : undefined);
}
{
  const r = 10;
  ok("à spin nul, Kerr redonne exactement Schwarzschild",
     rel(omegaKerr(r, 0, true), Math.sqrt(M/(r*r*r))) < 1e-14 &&
     rel(utKerr(r, 0, true), 1/Math.sqrt(1 - 3*M/r)) < 1e-14,
     "Ω = √(M/r³) et u^t = 1/√(1 − 3M/r)",
     "écarts " + rel(omegaKerr(r, 0, true), Math.sqrt(M/(r*r*r))).toExponential(1)
     + " et " + rel(utKerr(r, 0, true), 1/Math.sqrt(1 - 3*M/r)).toExponential(1));
}

dit("");
dit("  Ce que le spin change à la PÉRIODE d'un compagnon, si la scène le lui");
dit("  appliquait — écart relatif à la période que `integre` lui donne :");
dit("");
dit("    a*        r = 6      r = 10      r = 20      r = 30    ISCO du disque");
dit("  " + "─".repeat(72));
for(const st of SPINS){
  const a = st*M;
  let l = "  " + st.toFixed(2).padStart(5) + " ";
  for(const r of [6, 10, 20, 30]){
    const Tk = 2*Math.PI/(omegaKerr(r, a, true)*utKerr(r, a, true));
    l += (100*(Tk - T_SCENE(r))/T_SCENE(r)).toFixed(3).padStart(11) + " %";
  }
  l += "      " + K.rIsco(a, true).toFixed(3);
  dit(l.replace(/ %/g, "%"));
}
dit("");
dit("  À comparer au " + (100*(T_NEWTON(20) - T_SCENE(20))/T_SCENE(20)).toFixed(2)
    + " % que Newton ajouterait au même rayon r = 20.");

groupe("Le désaccord que la page porte déjà, mesuré");
{
  /* Ce n'est pas le sujet de F3, mais c'est le même mal : `calque.js` trace le
     cercle de « la dernière orbite stable » à PHYSIQUE.R_ISCO = 3, quel que
     soit le spin, tandis que le nuanceur pose le bord interne du disque à
     KERR.rIsco(spin·M, true). Aux quatre spins du panneau, ce sont deux
     rayons différents dessinés sur la même image.                           */
  const ecarts = SPINS.map(st => Math.abs(K.rIsco(st*M, true) - R_ISCO)/R_ISCO);
  ok("les deux ISCO du site ne coïncident qu'à spin nul",
     ecarts[0] < 1e-12 && ecarts.slice(1).every(e => e > 0.3),
     "0 au spin nul, franchement séparés ailleurs",
     SPINS.map((st, i) => "a*=" + st + " → " + (100*ecarts[i]).toFixed(1) + " %").join("   "),
     "calque.js trace le cercle à " + R_ISCO + " ; le nuanceur pose le bord du " +
     "disque à KERR.rIsco. À a* = 0,9 : " + K.rIsco(0.9*M, true).toFixed(3)
     + " contre " + R_ISCO + ". C'est un constat, pas un contrôle de F3.");
}

/* ═════════════════════════════════════════════════ 7. LA LIMITE DE ROCHE */
titre("7. LA LIMITE DE ROCHE — tombe-t-elle dans la fenêtre ?");

const SOLEIL = L.ASTRES.find(a => a.cle === "soleil");
const R_SOLEIL_KM = SOLEIL.rayon_km;

groupe("Le rayon du Soleil vient de lune.js, et c'est dit");
ok("lune.js donne un rayon solaire sourcé",
   R_SOLEIL_KM > 0 && SOLEIL.source === "iau2015b3",
   "une valeur avec sa source", R_SOLEIL_KM + " km  [source « "
   + SOLEIL.source + " »]",
   "c'est la SEULE constante de cet outil qui ne vient ni de physique.js ni " +
   "de contenu.js — elle n'existe nulle part ailleurs dans le dépôt");

/* Les trois limites, en rayons de Schwarzschild. `ncorps.js` les rend en
   l'unité du rayon du satellite : on entre des kilomètres, on sort des
   kilomètres, et l'on divise par KM_PAR_UNITE.                              */
const rocheEnRs = f => f(R_SOLEIL_KM, M_SUR_MSOL_DERIVEE, 1) / KM_PAR_UNITE;
const ROCHE = {
  rigide:    rocheEnRs(N.rocheRigide),
  synchrone: rocheEnRs(N.rocheRigideSynchrone),
  fluide:    rocheEnRs(N.rocheFluide),
};

groupe("Les trois coefficients, contrôlés l'un par l'autre");
ok("fluide / rigide vaut bien 2,455 / 2^(1/3)",
   rel(ROCHE.fluide/ROCHE.rigide, N.ROCHE_FLUIDE/N.ROCHE_RIGIDE) < 1e-12,
   (N.ROCHE_FLUIDE/N.ROCHE_RIGIDE).toFixed(6),
   (ROCHE.fluide/ROCHE.rigide).toFixed(6),
   "Chandrasekhar 1969 contre le cas rigide — le rapport 1,949 de l'en-tête " +
   "de ncorps.js");
{
  /* LE PIÈGE DE ncorps.js, ÉPROUVÉ. La forme en RAPPORT DE DENSITÉS veut le
     rayon de la PRIMAIRE ; la forme en RAPPORT DE MASSES veut celui du
     SATELLITE. Les deux se ressemblent à s'y méprendre. Si l'on prend r_s pour
     rayon de la primaire et la densité moyenne dans r_s, les deux écritures
     doivent tomber sur le même nombre — et si l'on s'est trompé de rayon, on
     rate d'un facteur (r_s / R☉), c'est-à-dire de dix-huit.                 */
  const volume = R => 4/3*Math.PI*R*R*R;
  const rhoBH = M_SUR_MSOL_DERIVEE / volume(KM_PAR_UNITE);   // M☉ / km³
  const rhoSol = 1 / volume(R_SOLEIL_KM);
  const parDensites = N.rocheParDensites(KM_PAR_UNITE, rhoBH, rhoSol);
  ok("les deux écritures de Roche donnent la même distance",
     rel(parDensites.fluide/KM_PAR_UNITE, ROCHE.fluide) < 1e-9,
     ROCHE.fluide.toFixed(6) + " r_s  [par les masses]",
     (parDensites.fluide/KM_PAR_UNITE).toFixed(6) + " r_s  [par les densités]",
     "se tromper de rayon raterait d'un facteur "
     + (KM_PAR_UNITE/R_SOLEIL_KM).toFixed(1) + " — c'est l'erreur que " +
     "l'en-tête de ncorps.js raconte, et elle ne se voit pas dans la formule");
}

dit("");
dit("  Une étoile d'une masse solaire autour de Sagittarius A* :");
dit("");
dit("    horizon                        " + R_HORIZON.toFixed(2).padStart(8) + " r_s");
dit("    ISCO (spin nul)                " + R_ISCO.toFixed(2).padStart(8) + " r_s");
dit("    Roche, corps rigide            " + ROCHE.rigide.toFixed(2).padStart(8) + " r_s");
dit("    Roche, rigide synchrone        " + ROCHE.synchrone.toFixed(2).padStart(8)
    + " r_s   ← celui que ncorps.js mesure");
dit("    Roche, corps fluide            " + ROCHE.fluide.toFixed(2).padStart(8)
    + " r_s   ← le cas d'une étoile");
dit("    plus grande orbite cadrable    " + R_CADRABLE_MAX.toFixed(2).padStart(8)
    + " r_s   ← " + ECRAN_GENEREUX.nom + ", le cas le plus favorable");
dit("");

groupe("Où tombe l'événement de F3");
ok("la limite de Roche est cadrable — l'événement serait visible",
   ROCHE.fluide < R_CADRABLE_MAX && ROCHE.fluide > R_ISCO,
   "entre l'ISCO (" + R_ISCO + ") et " + R_CADRABLE_MAX.toFixed(1) + " r_s",
   ROCHE.fluide.toFixed(3) + " r_s",
   "la bonne nouvelle du chapitre, et la seule");
{
  const l = lignes.reduce((a, b) =>
    Math.abs(b.r - ROCHE.fluide) < Math.abs(a.r - ROCHE.fluide) ? b : a);
  ok("mais elle est en plein dans la zone de désaccord",
     l.ombres > 0.8,
     "> 0,8 largeur d'ombre de dérive par tour",
     l.ombres.toFixed(3) + " largeur d'ombre par tour à r = " + l.r,
     "le compagnon newtonien traverserait le trou noir à l'écran une fois par " +
     "tour avant d'atteindre la limite");
}
{
  /* Et le point qu'aucune tolérance ne rattrape : une orbite newtonienne à deux
     corps est une ellipse FERMÉE. Elle ne s'approche jamais. Pour faire tomber
     l'étoile sur la limite de Roche il faudrait ajouter une loi de décroissance
     qui n'est ni Newton ni la relativité — donc une loi inventée. */
  const r0 = 30, tours = 200;
  const s = N.deuxCorps(M, 0, r0, 0.4, { G: 1 });
  const el0 = N.elements(s, 1);
  const nPas = pasPour(tours), h = tours*T_NEWTON(r0)/nPas;
  for(let i = 0; i < nPas; i++) N.pas(s, h);
  const el1 = N.elements(s, 1);
  const dq = Math.abs(el1.a*(1-el1.e) - el0.a*(1-el0.e)) / (el0.a*(1-el0.e));
  ok("l'orbite de ncorps.js ne s'approche jamais toute seule",
     dq < 1e-6, "< 1e-6 de variation du périastre sur 200 tours",
     dq.toExponential(2),
     "deux corps newtoniens décrivent une ellipse fermée. Faire approcher " +
     "l'étoile demanderait une loi de décroissance inventée — ce que la " +
     "règle 4 interdit. `integre`, lui, capture pour de vrai.");
}

/* ══════════════════════════ 8. CE QUE N CORPS APPORTE, ET QUI NE SE VOIT PAS */
titre("8. CE QUE N CORPS APPORTERAIT DE PLUS, ET SA TAILLE À L'ÉCRAN");

/* `ncorps.js` existe pour la gravitation MUTUELLE : chaque corps tire sur tous
   les autres. Autour d'un astre de 4,3 millions de masses solaires, quelle
   masse faut-il au compagnon pour que cet apport dépasse un pixel ?         */
groupe("La gravitation mutuelle, mise à l'échelle de l'écran");
{
  const q = 1/M_SUR_MSOL_DERIVEE;             // une étoile d'une masse solaire
  const corrPeriode = Math.pow(1 + q, -0.5) - 1;
  const relativiste = 1 - cadence(20);
  ok("pour une étoile, l'apport de N corps est " +
     Math.round(relativiste/Math.abs(corrPeriode)).toExponential(1) +
     " fois plus petit que la relativité négligée",
     Math.abs(corrPeriode) < relativiste/1e4,
     "au moins dix mille fois plus petit",
     "mutuel " + Math.abs(corrPeriode).toExponential(2)
     + "   relativiste " + relativiste.toExponential(2) + "  (à r = 20)",
     "le module serait branché dans le seul régime où il n'apporte rien : " +
     "le compagnon est une particule d'épreuve");

  // La masse qu'il faudrait pour que le barycentre bouge d'un pixel
  const vue = ECRAN_REF;
  const r = 20, z = distanceDeCadrage(r, vue) || DIST_MAX;
  const qUnPixel = 1/(r*pxParUnite(z, vue.H));
  const masseUnPixel = qUnPixel*M_SUR_MSOL_DERIVEE;
  ok("il faudrait un compagnon de " + masseUnPixel.toExponential(2)
     + " M☉ pour déplacer le barycentre d'un pixel",
     masseUnPixel > 1e3,
     "bien au-delà d'une étoile", masseUnPixel.toExponential(3) + " M☉ à r = 20",
     "c'est un trou noir de masse intermédiaire, donc un couple serré de trous " +
     "noirs : le régime où Newton est le plus faux, et où il faudrait un " +
     "rayonnement gravitationnel qu'aucun des deux moteurs ne porte");
}

/* ═════════════════════════════════════════════════════════ 9. LE VERDICT */
titre("9. LE VERDICT");

const FENETRE = (() => {
  /* Une fenêtre existe s'il y a une séparation, à un cran quelconque de la
     barre du temps, qui soit à la fois :
       · cadrable   — l'orbite entière tient dans l'écran à la butée de zoom
       · regardable — au moins un tour complet en dix minutes réelles
       · d'accord   — dérive cumulée sous un pixel sur la même session

     On balaye les QUATRE crans, et non le plus rapide seulement : ralentir le
     temps réduit la dérive, et il fallait laisser cette porte ouverte plutôt
     que de la fermer par raisonnement. Elle se referme d'elle-même, et pour
     une raison qui vaut d'être vue — voir le contrôle qui suit.             */
  const trouvees = [];
  let examinees = 0;
  for(let i = 0; i <= 200; i++){
    const r = R_ISCO*Math.pow(R_CADRABLE_MAX*1.5/R_ISCO, i/200);
    const dc = distanceDeCadrage(r, ECRAN_GENEREUX);
    if(dc === null) continue;
    const par = pxParUnite(dc, ECRAN_GENEREUX.H);
    for(const v of TPS.VITESSES){
      const D = dureeGeo(v.mult);
      const tours = D / T_SCENE(r);
      if(tours < 1) continue;
      examinees++;
      const d = derive(r, D);
      const px = d.corde*r*par;
      // `credible` écarte les coïncidences de phase — voir le piège dans `derive`
      if(d.credible && px <= 1) trouvees.push({ r, mult: v.mult, px });
    }
  }
  return { trouvees, examinees };
})();

groupe("Y a-t-il une séparation à la fois cadrable, regardable et d'accord ?");
ok("la recherche a bien exploré la zone où une fenêtre pourrait être",
   FENETRE.examinees > 200,
   "plus de deux cents couples (séparation, cran) cadrables et regardables",
   FENETRE.examinees + " examinés, sur 201 séparations entre " + R_ISCO
   + " et " + (R_CADRABLE_MAX*1.5).toFixed(1) + " r_s × " + TPS.VITESSES.length
   + " crans, écran " + ECRAN_GENEREUX.nom,
   "le contrôle porte sur le BALAYAGE, pas sur son résultat : la mesure a le " +
   "droit de ne rien trouver, elle n'a pas le droit de ne pas chercher");

/* POURQUOI LA VITESSE DU TEMPS NE PEUT PAS SAUVER L'IDÉE, et c'est la forme la
   plus courte du résultat.

   « Au moins un tour » et « moins d'un pixel » se combinent en une condition
   qui ne contient plus l'horloge : au bout d'UN tour, la dérive vaut toujours
   2π(1 − √(1 − 3M/r))·r, quelle que soit la vitesse à laquelle ce tour a été
   parcouru. Exiger qu'elle tienne sous un pixel, c'est donc exiger que l'ombre
   du trou noir tienne, elle, dans un pixel virgule quelque chose. Ralentir le
   temps ne déplace pas cette borne — cela retire seulement le tour.        */
{
  let bas = Infinity, haut = 0, rBas = 0, rHaut = 0, vus = 0;
  for(let i = 0; i <= 40; i++){
    const r = R_ISCO*Math.pow(R_CADRABLE_MAX*1.5/R_ISCO, i/40);
    const dc = distanceDeCadrage(r, ECRAN_GENEREUX);
    if(dc === null) continue;
    vus++;
    const par = pxParUnite(dc, ECRAN_GENEREUX.H);
    const d = derive(r, T_SCENE(r));                 // exactement un tour
    const rapport = (d.corde*r*par) / ombreEnPx(dc, ECRAN_GENEREUX.H);
    if(rapport < bas){ bas = rapport; rBas = r; }
    if(rapport > haut){ haut = rapport; rHaut = r; }
  }
  ok("un tour de dérive vaut une ombre EN PIXELS, à toute distance et tout zoom",
     vus > 10 && bas > 0.85 && haut < 1.15,
     "dans [0,85 ; 1,15] de diamètre d'ombre",
     "de " + bas.toFixed(3) + " (r = " + rBas.toFixed(1) + ") à "
     + haut.toFixed(3) + " (r = " + rHaut.toFixed(1) + "), sur " + vus + " séparations",
     "d'où la conséquence qui ferme la question : demander un tour ET un pixel, " +
     "c'est demander que le trou noir tienne dans un pixel. L'horloge du site " +
     "n'entre pas dans cette condition — la ralentir ne fait que supprimer le tour.");
}

dit("");
if(FENETRE.trouvees.length === 0){
  dit("  ┌" + "─".repeat(70) + "┐");
  dit("  │  IL N'EXISTE AUCUNE FENÊTRE.                                         │");
  dit("  │                                                                      │");
  dit("  │  Un compagnon newtonien décale d'UNE LARGEUR DE TROU NOIR par tour,  │");
  dit("  │  à toutes les séparations, sur tous les écrans, à tous les zooms.    │");
  dit("  │  Ce n'est pas une question de distance : l'écart et l'objet          │");
  dit("  │  rapetissent ensemble, exactement au même rythme, et leur rapport    │");
  dit("  │  est un nombre pur. Ralentir le temps ne le change pas non plus —    │");
  dit("  │  cela retire seulement le tour, donc le mouvement à regarder.        │");
  dit("  │                                                                      │");
  dit("  │  F3 ne se branche pas sous cette forme.                              │");
  dit("  └" + "─".repeat(70) + "┘");
} else {
  const t = FENETRE.trouvees;
  dit("  UNE FENÊTRE EXISTE : de " + t[0].r.toFixed(1) + " à "
      + t[t.length-1].r.toFixed(1) + " r_s, aux crans ×"
      + [...new Set(t.map(x => x.mult))].join(", ×") + ".");
  dit("  " + t.length + " couples (séparation, cran) tiennent les trois conditions.");
}

dit("");
dit("  Les trois conditions, chiffrées — toutes prises dans le cas le plus");
dit("  favorable à l'idée, l'écran « " + ECRAN_GENEREUX.nom + " » :");
dit("");
dit("    cadrable    r ≤ " + R_CADRABLE_MAX.toFixed(1) + " r_s"
    + "   (butée de zoom à " + DIST_MAX + ")");
{
  const dMax = dureeGeo(3600);
  let bas = R_ISCO, haut = 1e5;
  for(let i = 0; i < 40; i++){
    const m = Math.sqrt(bas*haut);
    if(dMax/T_SCENE(m) >= 1) bas = m; else haut = m;
  }
  dit("    regardable  r ≤ " + bas.toFixed(0) + " r_s"
      + "   (un tour complet en dix minutes, cran ×3600)");
}
const ACCORD_GEN = separationDAccord(3600, ECRAN_GENEREUX);
dit("    d'accord    r ≥ " + ACCORD_GEN.r.toExponential(2)
    + " r_s   (un pixel de dérive cumulée, cran ×3600)");
dit("");
dit("  Et les deux premières prises ensemble se disent sans horloge : au bout");
dit("  d'un tour, la dérive vaut une largeur d'ombre, quelle que soit la vitesse");
dit("  à laquelle ce tour a été parcouru. Demander un tour ET un pixel revient");
dit("  donc à demander que le trou noir tienne dans un pixel. Aucun cran de la");
dit("  barre du temps n'ouvre cette porte — la ralentir retire le tour.");
dit("");
dit("  Les deux premières bornent par le haut, la troisième par le bas, et");
dit("  elles ne se croisent pas — il y a un facteur "
    + Math.round(ACCORD_GEN.r/R_CADRABLE_MAX) + " entre elles.");

/* ═════════════════════════════════════════════════════════════ CE QUI RESTE */
titre("CE QUE CETTE MESURE NE SAIT PAS VOIR");
dit("");
dit("    · Le plan équatorial seulement. Une orbite inclinée ajouterait la");
dit("      précession de Lense-Thirring, qu'aucun des deux moteurs ne porte.");
dit("      Ce serait un TROISIÈME désaccord, non mesuré ici.");
dit("");
dit("    · Les orbites peu excentriques seulement. L'approche de la limite de");
dit("      Roche se ferait sur une orbite très excentrique, où la forme fermée");
dit("      de la précession ne vaut plus.");
dit("");
dit("    · Aucune géodésique de Kerr de type temps n'est intégrée. Le spin");
dit("      n'entre que par des formes fermées, contrôlées contre kerr.js.");
dit("");
dit("    · Rien sur le rayonnement gravitationnel, qui décide de la spirale");
dit("      d'un vrai couple serré.");
dit("");
dit("    · Rien sur la LISIBILITÉ. Le pixel est une borne de sécurité, pas un");
dit("      seuil de perception. Un décalage d'un pixel peut se voir s'il fait");
dit("      battre un trait ; dix peuvent se perdre dans le disque. Ce seuil-là");
dit("      ne se calcule pas — il se regarde, et c'est une séance ?juge.");
dit("");
dit("    · Rien sur la question qui reste ouverte et qui n'est pas de mon");
dit("      ressort : faut-il un compagnon du tout ? La mesure dit seulement");
dit("      qu'il ne peut pas être newtonien.");

/* ══════════════════════════════════════════════════════════════════ BILAN */
dit("");
dit("  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                   : "✅  TOUT PASSE — " + n + " contrôles"));
if(echecs) for(const r of rates) dit("      ÉCHEC — " + r);
dit("");
process.exit(echecs ? 1 : 0);
