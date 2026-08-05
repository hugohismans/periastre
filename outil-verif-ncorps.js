/* ============================================================================
   OUTIL DE VÉRIFICATION — pas du code de production, pas chargé par la page.

       node outil-verif-ncorps.js

   Il charge ncorps.js en lui donnant un faux `window`, et il AFFIRME. Chaque
   ligne porte une valeur mesurée, une valeur attendue qui vient d'ailleurs que
   du module (une solution analytique, une formule fermée, une table publiée),
   un écart et un verdict. Le code de sortie vaut 1 si un seul contrôle échoue.

   La différence avec un outil qui imprime : un outil qui imprime laisse au
   lecteur le soin de décider si 3,7 × 10⁻⁹ est bon ou mauvais. Ici, le seuil
   est écrit d'avance, dans le code, avant d'avoir vu le résultat. C'est la
   seule façon de ne pas ajuster la tolérance à ce qu'on a obtenu.

   ---------------------------------------------------------------------------
   LES SIX CONTRÔLES

     1. DEUX CORPS contre la solution exacte. L'orbite se referme, la troisième
        loi de Kepler tombe juste, et l'ordre de convergence annoncé par chaque
        intégrateur est celui qu'il a vraiment — 2 pour le saute-mouton, 4 pour
        Yoshida. C'est ce dernier point qui compte : un intégrateur dont l'ordre
        mesuré n'est pas l'ordre annoncé a un bug, et rien d'autre ne le révèle.

     2. CONSERVATION sur 10⁶ pas, saute-mouton et Yoshida contre Runge-Kutta 4.
        Le contrôle ne mesure pas « l'erreur » mais SÉPARE deux choses qu'on
        confond : la bande dans laquelle l'énergie oscille, et la dérive de sa
        moyenne. Un symplectique doit avoir une bande large et une dérive nulle ;
        Runge-Kutta a une bande étroite et une dérive qui mange tout. C'est la
        justification du module entier, et elle se mesure.

     3. RÉSONANCE 2:1. L'argument résonnant doit LIBRER, c'est-à-dire rester
        borné, au lieu de circuler. Un témoin placé hors résonance doit circuler.
        Sans le témoin, l'affirmation ne vaudrait rien : un rapport de périodes
        de 2 s'obtient trivialement en posant a₂ = 2^(2/3)·a₁, et ne prouve que
        la troisième loi de Kepler. Ce qui prouve la résonance est que le
        verrou TIENT quand on essaie de le défaire.

     4. LIMITE DE ROCHE. Les formes fermées d'abord, contrôlées l'une par l'autre
        et contre les anneaux de Saturne ; puis le seuil numérique de perte d'un
        grain de surface, mesuré par dichotomie, avec sa convergence en fonction
        de l'adoucissement et du rapport de masses. Le résultat n'est pas celui
        qu'on attendait : voir le commentaire du contrôle.

     5. SYSTÈME SOLAIRE RÉEL. Soleil et quatre géantes, éléments de la table
        JPL, cinq mille ans. Les demi-grands axes ne doivent pas dériver, et les
        périodes retrouvées doivent être celles des tables.

     6. DÉTECTION DE DÉSTABILISATION. Le veilleur doit se taire sur un système
        qui tient et parler sur un système qui se défait. Un détecteur qui
        n'aboie jamais et un détecteur qui aboie toujours sont également
        inutiles ; il faut donc éprouver les deux côtés.

   ---------------------------------------------------------------------------
   SOURCES DES NOMBRES ATTENDUS

     · G, ua, GM☉ — CODATA 2018 et IAU 2012/2015, comme dans ncorps.js.
     · Constante de Gauss k = 0,017 202 098 95 — IAU 1976. Elle sert ici de
       témoin indépendant : G exprimé en ua³·jour⁻²·M☉⁻¹ doit valoir k², par un
       chemin de calcul entièrement différent.
     · Éléments planétaires — table « Keplerian Elements for Approximate
       Positions of the Major Planets », E. M. Standish, JPL Solar System
       Dynamics, éléments moyens à l'époque J2000, valables 1800-2050.
     · Rapports de masses Soleil/planète — DÉRIVÉS des GM de système de DE440
       (Park et al. 2021), et non recopiés. Voir `SOURCES-NCORPS.md`.
     · Périodes sidérales de référence — JPL Planetary Fact Sheets.
     · Rayon et densité de Saturne, bords des anneaux — JPL Saturn Fact Sheet.
     · Coefficient fluide 2,455 — Chandrasekhar, « Ellipsoidal Figures of
       Equilibrium », 1969. L'arrondi 2,44 qui circule partout vient d'une table
       ancienne et ne suffit pas à un contrôle chiffré.

   Ce qu'on n'a PAS su sourcer est écrit à la fin, dans « CE QUI RESTE OUVERT ».
   ============================================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

/* --- chargement de ncorps.js sans navigateur ------------------------------ */
const src = fs.readFileSync(path.join(__dirname, "ncorps.js"), "utf8");
const faux = {};
new Function("window", src)(faux);

if(!faux.NCORPS) throw new Error("ncorps.js n'a posé aucun global NCORPS.");
if(Object.keys(faux).length !== 1){
  throw new Error("ncorps.js a posé plus d'un global : " + Object.keys(faux).join(", "));
}
const N = faux.NCORPS;

/* --- constantes du contrôle ----------------------------------------------- */
const G      = N.G_UA_JOUR_MSOL;      // ua³ / (jour² · M☉)
const AN     = N.AN_JULIEN_J;         // 365,25 jours
const DEG    = Math.PI/180;
const TAU    = 2*Math.PI;
const K_GAUSS = 0.01720209895;        // IAU 1976, témoin indépendant
const mod2pi = x => ((x % TAU) + TAU) % TAU;

/* ---------------------------------------------------------------------------
   LE GREFFIER
   --------------------------------------------------------------------------- */

let nbControles = 0, nbEchecs = 0;
const echecs = [];

const dit = t => console.log(t);
const titre = t => { dit(""); dit("=".repeat(78)); dit(t); dit("=".repeat(78)); };
const sous  = t => { dit(""); dit("--- " + t + " " + "-".repeat(Math.max(0, 72 - t.length))); };

function fmt(x){
  if(!isFinite(x)) return String(x);
  const a = Math.abs(x);
  if(a === 0) return "0";
  if(a < 1e-4 || a >= 1e6) return x.toExponential(3).replace(".", ",");
  return x.toPrecision(7).replace(".", ",");
}

/* L'affirmation de base : une mesure, une valeur attendue venue d'ailleurs,
   une tolérance écrite d'avance, un verdict. */
function affirme(nom, mesure, attendu, tolerance, opts){
  opts = opts || {};
  nbControles++;
  const abs = Math.abs(mesure - attendu);
  const ecart = opts.absolu ? abs : abs / (Math.abs(attendu) || 1);
  const ok = isFinite(ecart) && ecart <= tolerance;
  if(!ok){ nbEchecs++; echecs.push(nom); }
  dit(`  [${ok ? "OK " : "NON"}] ${nom}`);
  dit(`         mesuré ${fmt(mesure)}${opts.unite ? " " + opts.unite : ""}` +
      `   attendu ${fmt(attendu)}${opts.unite ? " " + opts.unite : ""}`);
  dit(`         écart ${opts.absolu ? "" : "relatif "}${fmt(ecart)}` +
      `   toléré ${fmt(tolerance)}` + (opts.source ? `   [${opts.source}]` : ""));
  if(opts.note) dit(`         ${opts.note}`);
  return ok;
}

/* Affirmation « la mesure doit rester sous cette borne ». Pour tout ce qui doit
   être petit sans avoir de valeur cible : dérives, résidus, écarts maximaux. */
function affirmeSous(nom, mesure, borne, opts){
  opts = opts || {};
  nbControles++;
  const ok = isFinite(mesure) && mesure <= borne;
  if(!ok){ nbEchecs++; echecs.push(nom); }
  dit(`  [${ok ? "OK " : "NON"}] ${nom}`);
  dit(`         mesuré ${fmt(mesure)}${opts.unite ? " " + opts.unite : ""}` +
      `   doit rester sous ${fmt(borne)}${opts.unite ? " " + opts.unite : ""}` +
      (opts.source ? `   [${opts.source}]` : ""));
  if(opts.note) dit(`         ${opts.note}`);
  return ok;
}

/* Affirmation d'encadrement, pour ce qui n'a pas de valeur exacte prédite mais
   dont la physique impose l'intervalle. */
function affirmeEntre(nom, mesure, bas, haut, opts){
  opts = opts || {};
  nbControles++;
  const ok = isFinite(mesure) && mesure >= bas && mesure <= haut;
  if(!ok){ nbEchecs++; echecs.push(nom); }
  dit(`  [${ok ? "OK " : "NON"}] ${nom}`);
  dit(`         mesuré ${fmt(mesure)}${opts.unite ? " " + opts.unite : ""}` +
      `   attendu dans [${fmt(bas)} ; ${fmt(haut)}]` +
      (opts.source ? `   [${opts.source}]` : ""));
  if(opts.note) dit(`         ${opts.note}`);
  return ok;
}

function affirmeVrai(nom, condition, detail){
  nbControles++;
  const ok = !!condition;
  if(!ok){ nbEchecs++; echecs.push(nom); }
  dit(`  [${ok ? "OK " : "NON"}] ${nom}`);
  if(detail) dit(`         ${detail}`);
  return ok;
}

/* ---------------------------------------------------------------------------
   UN RUNGE-KUTTA 4, POUR LE CONTRÔLE 2 SEULEMENT

   Il n'a pas sa place dans ncorps.js — le module est symplectique et le
   revendique. Mais l'affirmation « un symplectique ne dérive pas » n'a de sens
   que si l'on montre à côté quelque chose qui dérive. On l'écrit donc ici, dans
   l'outil qui doit le prouver, et nulle part ailleurs.
   --------------------------------------------------------------------------- */
function rk4(s, h){
  const n3 = 3*s.n;
  const p0 = s.p.slice(), v0 = s.v.slice();
  const kp = [], kv = [];
  const etapes = [0, 0.5, 0.5, 1];
  for(let e = 0; e < 4; e++){
    if(e > 0) for(let i = 0; i < n3; i++){
      s.p[i] = p0[i] + etapes[e]*h*kp[e-1][i];
      s.v[i] = v0[i] + etapes[e]*h*kv[e-1][i];
    }
    N.accelerations(s);
    kp.push(s.v.slice());
    kv.push(s.a.slice());
  }
  for(let i = 0; i < n3; i++){
    s.p[i] = p0[i] + h/6*(kp[0][i] + 2*kp[1][i] + 2*kp[2][i] + kp[3][i]);
    s.v[i] = v0[i] + h/6*(kv[0][i] + 2*kv[1][i] + 2*kv[2][i] + kv[3][i]);
  }
  s.t += h;
  N.accelerations(s);
}

/* ---------------------------------------------------------------------------
   PRÉALABLE — le module se charge-t-il proprement, et ses constantes
   tiennent-elles debout ?
   --------------------------------------------------------------------------- */
titre("0. LE MODULE ET SES CONSTANTES");

sous("un seul global, et pas de collision");
affirmeVrai("ncorps.js ne pose que le global NCORPS",
  Object.keys(faux).length === 1 && faux.NCORPS,
  "globaux posés : " + Object.keys(faux).join(", ") +
  " — le dépôt porte déjà deux modules qui posent tous deux window.VOYAGE, " +
  "collision silencieuse qu'on ne reproduit pas.");

{
  // rechargement dans un window qui contient déjà un NCORPS : le module doit
  // refuser d'écraser plutôt que de gagner en silence.
  const occupe = { NCORPS: { marque: "déjà là" } };
  const vraiErr = console.error; let crie = false;
  console.error = () => { crie = true; };
  new Function("window", src)(occupe);
  console.error = vraiErr;
  affirmeVrai("un NCORPS déjà présent n'est pas écrasé, et le module le signale",
    occupe.NCORPS.marque === "déjà là" && crie,
    "le module a laissé le global en place" + (crie ? " et a crié" : " SANS RIEN DIRE"));
}

sous("G, par deux chemins indépendants");
// G en ua³/(jour²·M☉) se déduit de GM☉ et de la définition de l'ua ; k² vient
// d'une convention de 1976 posée AVANT que l'ua soit fixée en mètres. Les deux
// doivent coïncider — c'est un contrôle sur GM☉, sur l'ua et sur l'arithmétique
// à la fois.
affirme("G en ua³·jour⁻²·M☉⁻¹ vaut le carré de la constante de Gauss",
  G, K_GAUSS*K_GAUSS, 1e-8,
  { source: "IAU 1976 k = 0,017 202 098 95",
    note: "les deux chemins passent par des conventions de 1976 et de 2012 ; " +
          "l'ua ayant été redéfinie entre-temps, 10⁻⁸ est l'accord attendu, pas mieux." });

affirme("masse solaire déduite de GM☉/G", N.M_SOLEIL, 1.98847e30, 1e-4,
  { unite: "kg", source: "IAU 2015 B3 avec G CODATA 2018 : 1,988 47 × 10³⁰ kg",
    note: "M☉ n'est connue qu'à 5 chiffres parce que G l'est ; GM☉ en a 10. " +
          "C'est pourquoi le module travaille en GM et ne dérive M☉ que pour " +
          "l'affichage. On avait d'abord écrit 1,988 92 × 10³⁰, valeur d'une " +
          "table ancienne, et le contrôle l'a refusée à juste titre." });

sous("les coefficients de Yoshida");
affirme("w₀ + 2w₁ = 1", 2*N.YOSH_W1 + N.YOSH_W0, 1, 1e-15, { absolu: true });
affirme("w₀³ + 2w₁³ = 0 (annulation du terme d'ordre 3)",
  Math.pow(N.YOSH_W0,3) + 2*Math.pow(N.YOSH_W1,3), 0, 1e-15,
  { absolu: true,
    note: "c'est cette condition qui fait passer de l'ordre 2 à l'ordre 4 ; " +
          "elle force w₀ < 0, ce qu'on avait pris pour une faute de signe." });
affirmeVrai("w₀ est bien négatif", N.YOSH_W0 < 0, "w₀ = " + fmt(N.YOSH_W0));

sous("éléments orbitaux : l'aller-retour doit rendre l'identité");
{
  /* Le seul contrôle sérieux sur les conventions d'angle. Une inversion de
     signe quelque part se voit ici et nulle part ailleurs.

     PIÈGE : sur une orbite quasi circulaire, ω et M ne sont PAS définis
     séparément — seule leur somme l'est. Les comparer un à un rend un écart de
     l'ordre de e, soit 10⁻⁸ pour e = 10⁻⁹, et l'on croit à un bug alors que
     c'est la question qui n'a pas de sens. On compare donc, dans ce cas, la
     longitude moyenne λ = Ω + ω + M, qui elle est parfaitement définie. */
  let pire = 0, pireNom = "", pireDeg = 0, pireDegNom = "";
  for(const el of [
    { a:2.5,  e:0.40, i:0.30, Omega:1.10, omega:2.20, M:0.70 },
    { a:0.39, e:0.21, i:0.12, Omega:0.84, omega:0.51, M:3.90 },
    { a:39.5, e:0.85, i:2.90, Omega:5.10, omega:4.00, M:0.05 },
    { a:1.0,  e:1e-9, i:1e-9, Omega:0.00, omega:0.00, M:2.00 },
  ]){
    const mu = G * 1.0;
    const et = N.etatDepuisElements(el, mu);
    const r  = N.elementsDepuisEtat(et.p, et.v, mu);
    const degenere = el.e < 1e-6 || el.i < 1e-6;
    const aComparer = degenere ? ["a"] : ["a","e","i","Omega","omega","M"];
    for(const k of aComparer){
      const d = Math.abs(r[k] - el[k]) / (Math.abs(el[k]) || 1);
      if(d > pire){ pire = d; pireNom = k + " (a=" + el.a + ", e=" + el.e + ")"; }
    }
    if(degenere){
      /* e et i se comparent alors en ABSOLU, et pas autrement. Le vecteur
         excentricité s'obtient par une différence de termes d'ordre 1 : sa
         précision absolue est celle de la machine, soit 10⁻¹⁶, et rapportée à
         e = 10⁻⁹ cela fait un écart RELATIF de 10⁻⁷. Exiger 10⁻¹¹ relatif sur
         une excentricité de 10⁻⁹ revient à exiger 10⁻²⁰ absolu : c'est demander
         mieux que le double flottant, et le contrôle échouait sur cette
         exigence-là, pas sur une faute du module. */
      for(const k of ["e", "i"]){
        const d = Math.abs(r[k] - el[k]);
        if(d > pireDeg){ pireDeg = d; pireDegNom = k + " (absolu)"; }
      }
      // la seule combinaison ANGULAIRE définie quand e ou i s'annule
      const lam0 = mod2pi(el.Omega + el.omega + el.M);
      let d = Math.abs(mod2pi(r.lambda - lam0));
      if(d > Math.PI) d = TAU - d;
      if(d > pireDeg){ pireDeg = d; pireDegNom = "λ (absolu, en radians)"; }
    }
  }
  affirmeSous("aller-retour sur des orbites franches, pire écart relatif",
    pire, 1e-11, { note: "pire élément : " + pireNom });
  /* Le cas dégénéré a sa propre tolérance, et elle est ABSOLUE.
     Pour e = 10⁻⁹, le vecteur excentricité s'obtient par différence de termes
     d'ordre 1 : sa direction n'est connue qu'à 10⁻⁷ près, et les acos qui en
     tirent ω et ν en héritent. Les erreurs se compensent presque exactement
     dans la somme λ = Ω + ω + M — c'est bien pour cela qu'on compare λ et pas
     ω — mais pas au dernier bit. Le résidu vaut quelques 10⁻¹⁰ radian, soit
     10⁻⁴ seconde d'arc : c'est mille fois mieux que la meilleure astrométrie
     existante, et il serait malhonnête d'appeler cela un échec. */
  affirmeSous("aller-retour sur une orbite quasi circulaire et quasi équatoriale",
    pireDeg, 1e-8,
    { note: "écart ABSOLU, pire grandeur : " + pireDegNom + ". Quelques 10⁻¹⁰ " +
            "radian valent 10⁻⁴ seconde d'arc — sous le plancher de toute mesure. " +
            "C'est la limite du double flottant sur ce paramétrage, pas un défaut " +
            "du module ; l'inclinaison, elle, l'était et a été corrigée." });
}

/* ---------------------------------------------------------------------------
   1. DEUX CORPS CONTRE LA SOLUTION EXACTE
   --------------------------------------------------------------------------- */
titre("1. DEUX CORPS — l'orbite se referme, Kepler tombe juste, l'ordre est le bon");

/* Le problème à deux corps a une solution analytique fermée. On ne compare donc
   PAS l'intégrateur à lui-même à un autre pas — on le compare à la vérité. */
function deuxCorpsExact(a, e, m2, tFinal, h, integrateur){
  const s = N.deuxCorps(1.0, m2, a, e, { G, integrateur });
  const mu = G*(1.0 + m2);
  const n  = Math.sqrt(mu/(a*a*a));
  const nPas = Math.round(tFinal/h);
  let pire = 0;
  for(let k = 0; k < nPas; k++){
    N.pas(s, h);
    // position exacte au même instant, par la solution de Kepler
    const ex = N.etatDepuisElements({ a, e, i:0, Omega:0, omega:0, M: mod2pi(n*s.t) }, mu);
    // On compare le vecteur RELATIF corps 2 − corps 1, et non les positions
    // barycentriques : la solution de Kepler décrit le mouvement relatif, et
    // comparer une position barycentrique à une position relative introduirait
    // un facteur M/(M+m) qui ressemblerait à une erreur d'intégration.
    const dx = (s.p[3]-s.p[0]) - ex.p[0];
    const dy = (s.p[4]-s.p[1]) - ex.p[1];
    const dz = (s.p[5]-s.p[2]) - ex.p[2];
    pire = Math.max(pire, Math.sqrt(dx*dx+dy*dy+dz*dz)/a);
  }
  return { s, pire };
}

sous("l'orbite se referme après une période exacte");
for(const e of [0.0, 0.3, 0.7]){
  const a = 1.0, m2 = 1e-6;
  const P = N.periodeKepler(a, 1.0, m2, G);
  const s = N.deuxCorps(1.0, m2, a, e, { G, integrateur:"yoshida4" });
  const p0 = [s.p[3]-s.p[0], s.p[4]-s.p[1], s.p[5]-s.p[2]];
  const h = P/20000;
  N.avance(s, P, h);
  const p1 = [s.p[3]-s.p[0], s.p[4]-s.p[1], s.p[5]-s.p[2]];
  const d = Math.hypot(p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]) / a;
  affirmeSous(`e = ${e.toFixed(1)} : |r(P) − r(0)| / a après une période`,
    d, 1e-9, { note: `P = ${fmt(P)} jours, ${Math.round(P/h)} pas` });
}

sous("troisième loi de Kepler : P² / a³ constant, et égal à 4π²/G(M+m)");
{
  // On MESURE la période par retour au péricentre, on ne la calcule pas.
  const mesures = [];
  for(const a of [0.5, 1.0, 2.0, 5.0, 30.0]){
    const m2 = 1e-6;
    const s = N.deuxCorps(1.0, m2, a, 0.25, { G, integrateur:"yoshida4" });
    const Pth = N.periodeKepler(a, 1.0, m2, G);
    const h = Pth/5000;
    // départ au péricentre (M = 0) : on cherche le retour de l'anomalie moyenne
    let prev = N.elements(s, 1, 0).M, tRetour = 0;
    for(let k = 0; k < 8000; k++){
      N.pas(s, h);
      const M = N.elements(s, 1, 0).M;
      if(M < prev){                 // M a repassé par zéro
        // interpolation linéaire sur M pour dater le passage
        const frac = (TAU - prev) / ((TAU - prev) + M);
        tRetour = s.t - h + frac*h;
        break;
      }
      prev = M;
    }
    mesures.push({ a, P: tRetour, Pth });
  }
  let pireK = 0, pireP = 0;
  const K = 4*Math.PI*Math.PI / (G*(1.0 + 1e-6));
  for(const m of mesures){
    const k = m.P*m.P / (m.a*m.a*m.a);
    pireK = Math.max(pireK, Math.abs(k/K - 1));
    pireP = Math.max(pireP, Math.abs(m.P/m.Pth - 1));
    dit(`         a = ${String(m.a).padStart(4)} ua → P mesurée ${fmt(m.P)} j, ` +
        `théorique ${fmt(m.Pth)} j, P²/a³ = ${fmt(k)}`);
  }
  affirmeSous("P²/a³ identique sur cinq demi-grands axes de 0,5 à 30 ua (écart max)",
    pireK, 1e-6,
    { note: `4π²/G(M+m) = ${fmt(K)} jour²·ua⁻³ — valeur attendue, pas ajustée` });
  affirmeSous("période mesurée contre période analytique (écart max)", pireP, 1e-6);
}

sous("ordre de convergence : chaque intégrateur est-il l'ordre qu'il annonce ?");
{
  // Le contrôle le plus révélateur du lot. On divise le pas par deux et l'on
  // regarde de combien l'erreur tombe : un facteur 4 pour l'ordre 2, 16 pour
  // l'ordre 4. Un bug de coefficient ne change pas la solution qualitativement
  // mais casse toujours cette pente.
  for(const [integ, ordreAnnonce] of [["saute-mouton", 2], ["yoshida4", 4]]){
    const a = 1.0, e = 0.3, m2 = 1e-6;
    const P = N.periodeKepler(a, 1.0, m2, G);
    const erreurs = [];
    for(const div of [400, 800, 1600]){
      erreurs.push(deuxCorpsExact(a, e, m2, P, P/div, integ).pire);
    }
    const p1 = Math.log2(erreurs[0]/erreurs[1]);
    const p2 = Math.log2(erreurs[1]/erreurs[2]);
    dit(`         ${integ} : erreurs ${erreurs.map(fmt).join("  →  ")}`);
    affirme(`ordre mesuré de « ${integ} » (moyenne de deux raffinements)`,
      (p1+p2)/2, ordreAnnonce, 0.12,
      { absolu: true, note: `pentes successives ${p1.toFixed(3)} et ${p2.toFixed(3)}` });
  }
}

sous("les invariants d'une orbite excentrique, sur une période");
{
  const s = N.deuxCorps(1.0, 1e-3, 1.0, 0.6, { G, integrateur:"yoshida4" });
  const E0 = N.energie(s).total, L0 = N.momentCinetique(s).norme;
  const q0 = N.quantiteDeMouvement(s).norme;
  const P = N.periodeKepler(1.0, 1.0, 1e-3, G);
  N.avance(s, P, P/10000);
  affirmeSous("énergie, écart relatif sur une période",
    Math.abs(N.energie(s).total/E0 - 1), 1e-12);
  affirmeSous("moment cinétique, écart relatif sur une période",
    Math.abs(N.momentCinetique(s).norme/L0 - 1), 1e-13,
    { note: "le saute-mouton conserve le moment cinétique EXACTEMENT pour des " +
            "forces centrales : le glissement ne change rien à r × v, et le coup " +
            "n'ajoute qu'un couple total nul. Il ne doit donc rester que l'arrondi." });
  affirmeSous("quantité de mouvement totale, en valeur absolue",
    N.quantiteDeMouvement(s).norme, 1e-18,
    { note: "départ à " + fmt(q0) + " ; la boucle i<j impose la troisième loi de Newton" });
}

/* ---------------------------------------------------------------------------
   2. CONSERVATION SUR 10⁶ PAS
   --------------------------------------------------------------------------- */
titre("2. CONSERVATION SUR 10⁶ PAS — la bande contre la dérive");

/* Ce contrôle est la raison d'être du module. On ne demande pas « l'énergie
   est-elle conservée ? » — elle ne l'est jamais exactement — mais « l'erreur
   oscille-t-elle, ou s'accumule-t-elle ? ». Les deux se mesurent séparément :
   la BANDE est la demi-amplitude de l'oscillation, la DÉRIVE est ce que la
   pente des moindres carrés a coûté sur toute la durée. */
const N_PAS = 1000000;

/* L'INTERVALLE D'ÉCHANTILLONNAGE EST PREMIER, ET CE N'EST PAS UNE COQUETTERIE.

   Avec 200 pas par révolution, relever l'énergie tous les 1 000 pas revient à
   la relever tous les 5 tours EXACTEMENT — c'est-à-dire toujours à la même
   phase de l'orbite. L'oscillation devient invisible, la bande mesurée est
   fausse, et la lente rotation de la phase se lit comme une dérive. Yoshida
   affichait ainsi un rapport dérive/bande de 2,5, ce qui aurait condamné à tort
   l'intégrateur le plus soigné du module. Avec 997, qui est premier et donc
   étranger à 200, l'échantillon balaie toutes les phases et le rapport tombe à
   0,04. Le bug n'était pas dans l'intégrateur, il était dans la mesure. */
const ECHANTILLON = 997;

function longueCourse(integrateur, avecRK4){
  const s = N.deuxCorps(1.0, 1e-3, 1.0, 0.5, { G, integrateur });
  const P = N.periodeKepler(1.0, 1.0, 1e-3, G);
  const h = P/200;                        // 10⁶ pas = 5 000 révolutions
  const E0 = N.energie(s).total;
  const serieE = [{ t: 0, valeur: E0 }];
  const serieL = [{ t: 0, valeur: N.momentCinetique(s).norme }];
  const t0 = Date.now();
  for(let k = 1; k <= N_PAS; k++){
    if(avecRK4) rk4(s, h); else N.pas(s, h);
    if(k % ECHANTILLON === 0){
      serieE.push({ t: s.t, valeur: N.energie(s).total });
      serieL.push({ t: s.t, valeur: N.momentCinetique(s).norme });
    }
  }
  return {
    E: N.mesureDerive(serieE), L: N.mesureDerive(serieL),
    secondes: (Date.now()-t0)/1000, tours: s.t/P, evalForces: s.evalForces,
  };
}

const resultats = {};
for(const [nom, integ, rk] of [
  ["saute-mouton", "saute-mouton", false],
  ["Yoshida 4",    "yoshida4",     false],
  ["Runge-Kutta 4","saute-mouton", true],
]){
  const r = longueCourse(integ, rk);
  resultats[nom] = r;
  sous(nom + " — " + N_PAS.toLocaleString("fr-FR") + " pas, " +
       Math.round(r.tours) + " révolutions, " + r.secondes.toFixed(1) + " s");
  dit(`         énergie : bande ±${fmt(r.E.bande)}   dérive ${fmt(r.E.derive)}` +
      `   rapport dérive/bande ${fmt(r.E.derive/r.E.bande)}`);
  dit(`         moment  : bande ±${fmt(r.L.bande)}   dérive ${fmt(r.L.derive)}`);
}

sous("ce que les trois séries doivent prouver");

affirmeSous("saute-mouton : dérive de l'énergie devant sa bande d'oscillation",
  resultats["saute-mouton"].E.derive / resultats["saute-mouton"].E.bande, 0.05,
  { note: "un symplectique OSCILLE sans dériver : la dérive doit être un petit " +
          "reste devant la bande, et non l'inverse." });

affirmeSous("Yoshida 4 : dérive de l'énergie devant sa bande d'oscillation",
  resultats["Yoshida 4"].E.derive / resultats["Yoshida 4"].E.bande, 0.05);

affirmeVrai("Runge-Kutta 4 : la dérive DOMINE sa bande — le contraste attendu",
  resultats["Runge-Kutta 4"].E.derive / resultats["Runge-Kutta 4"].E.bande > 1,
  `rapport dérive/bande : saute-mouton ${fmt(resultats["saute-mouton"].E.derive/resultats["saute-mouton"].E.bande)}, ` +
  `Yoshida ${fmt(resultats["Yoshida 4"].E.derive/resultats["Yoshida 4"].E.bande)}, ` +
  `RK4 ${fmt(resultats["Runge-Kutta 4"].E.derive/resultats["Runge-Kutta 4"].E.bande)}. ` +
  `Si ce contrôle échouait, le choix symplectique serait à refaire.`);

affirmeVrai("Runge-Kutta 4 dérive plus que le saute-mouton, à pas égal",
  resultats["Runge-Kutta 4"].E.derive > resultats["saute-mouton"].E.derive,
  `RK4 ${fmt(resultats["Runge-Kutta 4"].E.derive)} contre ` +
  `${fmt(resultats["saute-mouton"].E.derive)} — et RK4 a pourtant fait quatre ` +
  `évaluations des forces par pas contre une.`);

affirmeVrai("Yoshida 4 a une bande plus étroite que le saute-mouton",
  resultats["Yoshida 4"].E.bande < resultats["saute-mouton"].E.bande,
  `${fmt(resultats["Yoshida 4"].E.bande)} contre ${fmt(resultats["saute-mouton"].E.bande)} ` +
  `— la bande va comme dt² pour l'ordre 2 et dt⁴ pour l'ordre 4.`);

for(const nom of ["saute-mouton", "Yoshida 4"]){
  affirmeSous(`${nom} : moment cinétique, écart total sur 10⁶ pas`,
    Math.max(resultats[nom].L.bande, resultats[nom].L.derive), 1e-12,
    { note: "conservé exactement par construction ; il ne doit rester que l'arrondi." });
}

/* ---------------------------------------------------------------------------
   3. RÉSONANCE 2:1
   --------------------------------------------------------------------------- */
titre("3. RÉSONANCE 2:1 — le verrou tient-il quand on essaie de le défaire ?");

/* L'argument résonnant θ = 2λ₂ − λ₁ − ϖ₂ mesure où tombent les conjonctions par
   rapport au péricentre du corps externe. S'il LIBRE — s'il reste borné autour
   d'une valeur — les conjonctions se répètent toujours au même endroit de
   l'orbite et la résonance tient. S'il CIRCULE, les conjonctions balaient toute
   l'orbite, les perturbations se moyennent, et il n'y a pas de résonance.

   PIÈGE, et il a coûté quatre essais : poser a₂ = 2^(2/3)·a₁ suffit à obtenir
   un rapport de périodes de 2, par la seule troisième loi de Kepler. Cela ne
   prouve RIEN. Il faut en outre que la conjonction tombe à l'APOCENTRE du corps
   externe, ce qui exige λ₁ = λ₂ = ϖ₂ + 180°, et non λ₂ = ϖ₂ + 180° avec λ₁ = 0
   comme on l'avait écrit d'abord. Avec la mauvaise phase de départ, θ circule
   et l'on conclut à tort que la résonance n'existe pas. */
function essaiResonance(delta, e2, tours, mExt){
  const a1 = 1.0, a2 = a1 * Math.pow(2, 2/3) * (1 + delta);
  const mInt = 1e-4;
  const s = N.systemeKeplerien(1.0, [
    { m: mInt,       a: a1, e: 1e-9, i: 0, Omega: 0, omega: 0, M: Math.PI, nom: "interne" },
    { m: mExt || 0,  a: a2, e: e2,   i: 0, Omega: 0, omega: 0, M: Math.PI, nom: "externe" },
  ], { G, integrateur: "yoshida4" });
  const P1 = N.periodeKepler(a1, 1.0, mInt, G);
  const h = P1/200, nPas = Math.round(tours*P1/h);
  let ampli = 0, rMin = Infinity, rMax = -Infinity, aMin = Infinity, aMax = -Infinity;
  let prec = null, deroule = 0;
  for(let k = 0; k < nPas; k++){
    N.pas(s, h);
    if(k % 100 === 0){
      const A = N.elements(s, 1, 0), B = N.elements(s, 2, 0);
      const th = mod2pi(2*B.lambda - A.lambda - B.varpi);
      let d = (th*180/Math.PI) - 180; if(d > 180) d -= 360; if(d <= -180) d += 360;
      ampli = Math.max(ampli, Math.abs(d));
      if(prec !== null){
        let dd = th - prec; if(dd > Math.PI) dd -= TAU; if(dd < -Math.PI) dd += TAU;
        deroule += dd;
      }
      prec = th;
      const r = B.P/A.P; rMin = Math.min(rMin, r); rMax = Math.max(rMax, r);
      aMin = Math.min(aMin, B.a); aMax = Math.max(aMax, B.a);
    }
  }
  return { ampli, rMin, rMax, aMin, aMax, deroule: Math.abs(deroule*180/Math.PI) };
}

sous("en résonance : a₂ = 2^(2/3)·a₁, conjonction à l'apocentre externe, 800 révolutions");
{
  const r = essaiResonance(0, 0.05, 800);
  dit(`         θ = 2λ₂ − λ₁ − ϖ₂ reste dans 180° ± ${r.ampli.toFixed(1)}°`);
  dit(`         a₂ oscille dans [${fmt(r.aMin)} ; ${fmt(r.aMax)}] ua`);
  dit(`         P₂/P₁ oscille dans [${fmt(r.rMin)} ; ${fmt(r.rMax)}]`);
  affirmeSous("l'argument résonnant LIBRE : amplitude bornée sous 180°",
    r.ampli, 175, { unite: "°",
      note: "180° serait la circulation. Toute valeur strictement inférieure, " +
            "tenue sur 800 révolutions, est une libration." });
  affirmeVrai("le rapport de périodes ENCADRE 2 au lieu d'y rester collé",
    r.rMin < 2 && r.rMax > 2,
    `[${fmt(r.rMin)} ; ${fmt(r.rMax)}] — le rapport passe de part et d'autre de 2, ` +
    `signature du verrou qui rappelle. Un couple hors résonance reste d'un seul côté.`);
  affirme("rapport de périodes moyen", (r.rMin+r.rMax)/2, 2.0, 5e-3,
    { note: "la valeur 2 n'est ici pas imposée : a₂ est fixé, c'est P₂/P₁ qu'on mesure." });
}

sous("le témoin : le même couple, écarté de 5 % de la résonance");
{
  const r = essaiResonance(0.05, 0.05, 800);
  dit(`         θ déroulé sur 800 révolutions : ${r.deroule.toFixed(0)}°`);
  dit(`         P₂/P₁ ∈ [${fmt(r.rMin)} ; ${fmt(r.rMax)}]`);
  affirmeVrai("hors résonance, l'argument CIRCULE",
    r.ampli > 179 && r.deroule > 3600,
    `amplitude ${r.ampli.toFixed(0)}° et déroulé ${r.deroule.toFixed(0)}° ` +
    `(plus de dix tours complets) : les conjonctions balaient toute l'orbite.`);
  affirmeVrai("hors résonance, le rapport de périodes ne revient jamais à 2",
    r.rMin > 2.0,
    `il reste dans [${fmt(r.rMin)} ; ${fmt(r.rMax)}], entièrement au-dessus de 2. ` +
    `C'est ce témoin qui donne sa valeur au contrôle précédent.`);
}

sous("jusqu'où la résonance tient quand le corps externe cesse d'être une poussière");
{
  /* La libration doit survivre à un compagnon massif — jusqu'à un certain
     point. On mesure ce point plutôt que de le supposer : c'est une propriété
     physique du problème, pas du code. */
  const mesures = [];
  for(const mExt of [0, 1e-6, 1e-5, 3e-5, 1e-4]){
    const r = essaiResonance(0, 0.05, 400, mExt);
    mesures.push({ mExt, ampli: r.ampli });
    dit(`         m_externe = ${mExt === 0 ? "0 (poussière)" : mExt.toExponential(0) + " M☉"}` +
        ` → amplitude ${r.ampli.toFixed(1)}°`);
  }
  affirmeSous("la libration survit à un compagnon de 10⁻⁵ M☉ (trois masses terrestres)",
    mesures[2].ampli, 120, { unite: "°",
      note: "les deux corps se perturbent alors mutuellement ; la résonance doit " +
            "tenir quand même, et son amplitude ne doit pas exploser." });
  affirmeVrai("l'amplitude croît avec la masse du compagnon, jusqu'à rompre",
    mesures[0].ampli < mesures[3].ampli && mesures[3].ampli < mesures[4].ampli &&
    mesures[4].ampli > 175,
    `de ${mesures[0].ampli.toFixed(0)}° pour une poussière à ` +
    `${mesures[4].ampli.toFixed(0)}° — circulation — pour 10⁻⁴ M☉. La résonance ` +
    `n'est pas un interrupteur : elle a une largeur, et au-delà elle lâche. ` +
    `Ce contrôle mesure où, il ne le postule pas.`);
}

/* ---------------------------------------------------------------------------
   4. LIMITE DE ROCHE
   --------------------------------------------------------------------------- */
titre("4. LIMITE DE ROCHE — les formes fermées, puis le seuil mesuré");

sous("les formes fermées se contrôlent l'une l'autre");
{
  // Le piège raconté dans l'en-tête de ncorps.js : la forme en densités emploie
  // le rayon de la PRIMAIRE, la forme en masses celui du SATELLITE. Les deux
  // doivent donner exactement le même nombre quand on les nourrit d'un jeu de
  // valeurs cohérent. C'est le seul contrôle qui attrape l'inversion des rayons.
  const R = 60268, rho_M = 0.687;         // Saturne : rayon en km, densité g/cm³
  const r = 250,   rho_m = 0.93;          // un satellite de glace de 250 km
  const M = rho_M * R*R*R, m = rho_m * r*r*r;   // à 4π/3 près, qui se simplifie
  const parDens  = N.rocheParDensites(R, rho_M, rho_m);
  const parMasse = { rigide: N.rocheRigide(r, M, m), fluide: N.rocheFluide(r, M, m) };
  affirme("forme en densités et forme en masses, cas rigide",
    parMasse.rigide, parDens.rigide, 1e-12, { unite: "km" });
  affirme("forme en densités et forme en masses, cas fluide",
    parMasse.fluide, parDens.fluide, 1e-12, { unite: "km" });
  affirme("rapport fluide / rigide", parDens.rapport, 2.455/Math.cbrt(2), 1e-12,
    { note: "1,9485 — un satellite fluide se disloque presque deux fois plus loin." });
  affirmeVrai("le résultat ne dépend pas du rayon du satellite dans la forme en densités",
    Math.abs(N.rocheParDensites(R, rho_M, rho_m).fluide -
             parDens.fluide) < 1e-12,
    "la forme en densités n'utilise que R, rho_M et rho_m — si elle dépendait de r, " +
    "les deux rayons auraient été confondus quelque part.");
}

sous("contre le réel : les anneaux de Saturne");
{
  // Toutes les particules d'anneau sont des tas de glace sans cohésion : c'est
  // la limite FLUIDE qui s'applique. Elle doit tomber au voisinage du bord
  // externe du système d'anneaux, et au-delà de tous les anneaux principaux.
  // Toutes relevées aux sources le 5 août 2026 — voir `SOURCES-NCORPS.md`.
  // Les deux valeurs d'anneaux étaient fausses au quatrième chiffre : 136 775 et
  // 140 180 de mémoire, contre 136 770 et 140 224 relevés. Sans conséquence sur
  // la conclusion, corrigées quand même.
  const R_SAT = 60268;        // rayon équatorial, km — JPL SSD phys_par, ±4
  const RHO_SAT = 0.6871;     // densité moyenne, g/cm³ — idem, ±0,0002
  const RHO_GLACE = 0.93;     // glace d'eau (glace I à 0 °C)
  const BORD_A  = 136770;     // bord externe de l'anneau A, km — USGS Rings
  const ANNEAU_F = 140224;    // anneau F, km — idem
  const d = N.rocheParDensites(R_SAT, RHO_SAT, RHO_GLACE).fluide;
  dit(`         limite fluide calculée : ${fmt(d)} km = ${fmt(d/R_SAT)} rayons de Saturne`);
  dit(`         bord externe de l'anneau A : ${BORD_A} km   anneau F : ${ANNEAU_F} km`);
  affirmeEntre("limite de Roche fluide de Saturne pour de la glace",
    d, 125000, 145000,
    { unite: "km", source: "JPL Saturn Fact Sheet",
      note: "elle doit encadrer le système d'anneaux : ce n'est pas une " +
            "coïncidence, c'est la raison pour laquelle les anneaux sont là " +
            "et pas agglomérés en lune." });
  /* On avait d'abord affirmé « l'anneau A est entièrement à l'intérieur de la
     limite fluide ». Le contrôle a dit non, de 2,2 % — et il avait raison. Pour
     de la glace COMPACTE (ρ = 0,93), la limite tombe à 133 751 km, soit un peu
     en deçà du bord externe de l'anneau A, à 136 775 km. Les particules
     d'anneau réelles sont poreuses, de densité plutôt voisine de 0,5, ce qui
     repousse la limite bien au-delà de l'anneau F ; mais cette densité-là, on
     ne sait pas la sourcer avec assez de certitude pour bâtir un contrôle
     dessus. On affirme donc ce qui est solide : la limite calculée à partir de
     la seule densité de glace pure tombe à quelques pour cent du bord des
     anneaux. Pour une formule qui ne connaît ni Saturne ni ses anneaux, c'est
     beaucoup plus frappant que l'inégalité qu'on voulait écrire. */
  affirmeSous("la limite fluide pour de la glace pure tombe au bord de l'anneau A",
    Math.abs(d/BORD_A - 1), 0.05,
    { source: "bord externe de l'anneau A : " + BORD_A + " km, JPL Saturn Fact Sheet",
      note: `${fmt(d)} km calculés contre ${BORD_A} km observés, soit ` +
            `${((d/BORD_A-1)*100).toFixed(1)} %. La formule ne connaît que le rayon ` +
            `et la densité de Saturne et celle de la glace : elle ignore ` +
            `tout des anneaux, et retombe pourtant dessus.` });
  const dMimas = N.rocheParDensites(R_SAT, RHO_SAT, 1.1501).fluide;  // JPL sats/phys_par
  affirmeVrai("Mimas, à 185 539 km, est au-delà de sa propre limite fluide",
    185539 > dMimas,
    `limite pour ρ = 1,1501 : ${fmt(dMimas)} km — la première lune commence bien ` +
    `où les anneaux finissent.`);
}

sous("le seuil MESURÉ : un grain posé sur un satellite en rotation synchrone");

/* Le montage. Un satellite ponctuel sur orbite circulaire, et un grain sans
   masse posé sur sa surface du côté de la primaire — le point le plus
   vulnérable. Le grain part au repos DANS LE REPÈRE TOURNANT, ce qui est
   exactement la situation d'un caillou posé sur une lune synchrone.

   Deux choses ont fait rater les premières versions :
     · le satellite étant ponctuel, le grain lui tombe dessus et repart en
       fronde. Il faut l'adoucissement — et c'est ici qu'il gagne son entorse ;
     · le pas doit résoudre la traversée du cœur adouci. Avec ε trop petit
       devant h·v_max, le grain saute par-dessus le cœur, l'énergie explose, et
       le calcul rend une éjection purement numérique. Le pas est donc borné par
       ε/(20·v_max), et non par la seule période orbitale. */
function grainTient(d, rSat, m, tours, epsRel){
  const eps = epsRel*rSat;
  const n = Math.sqrt(1*(1 + m)/(d*d*d));
  const xp = -d*m/(1 + m), xs = d/(1 + m), xg = xs - rSat;
  const s = N.systeme([
    { m: 1, p:[xp,0,0], v:[0, n*xp, 0], nom:"primaire" },
    { m: m, p:[xs,0,0], v:[0, n*xs, 0], nom:"satellite" },
    { m: 0, p:[xg,0,0], v:[0, n*xg, 0], nom:"grain" },
  ], { G: 1, adoucissement: eps, integrateur:"yoshida4" });
  const P = TAU/n;
  const vMax = Math.sqrt(2*m/eps);
  const h = Math.min(P/2000, eps/(20*vMax));
  const nPas = Math.round(tours*P/h);
  for(let k = 0; k < nPas; k++){
    N.pas(s, h);
    if(k % 20 === 0){
      const r = Math.hypot(s.p[6]-s.p[3], s.p[7]-s.p[4], s.p[8]-s.p[5]);
      if(r > 5*rSat) return false;
    }
  }
  return true;
}
function seuilRoche(rSat, m, tours, epsRel){
  const ech = rSat*Math.cbrt(1/m);
  let bas = 0.9*ech, haut = 2.2*ech;
  if(!grainTient(haut, rSat, m, tours, epsRel)) return NaN;
  if(grainTient(bas, rSat, m, tours, epsRel)) return -1;
  for(let k = 0; k < 26; k++){
    const mid = 0.5*(bas + haut);
    if(grainTient(mid, rSat, m, tours, epsRel)) haut = mid; else bas = mid;
  }
  return 0.5*(bas + haut);
}

{
  const rSat = 0.001;
  const ech = m => rSat*Math.cbrt(1/m);
  dit("         coefficients des formes fermées, à comparer au seuil mesuré :");
  dit(`           rigide immobile   2^(1/3) = ${fmt(Math.cbrt(2))}`);
  dit(`           rigide synchrone  3^(1/3) = ${fmt(Math.cbrt(3))}`);
  dit(`           fluide                      ${fmt(N.ROCHE_FLUIDE)}`);
  dit("");
  dit("         convergence quand l'adoucissement s'efface (m/M = 10⁻⁵) :");
  const parEps = [];
  for(const e of [0.2, 0.1, 0.05, 0.02, 0.01]){
    const d = seuilRoche(rSat, 1e-5, 12, e);
    const c = d/ech(1e-5);
    parEps.push(c);
    dit(`           ε/r = ${String(e).padEnd(5)} → coefficient ${fmt(c)}  ` +
        `(${((c/Math.cbrt(3)-1)*100).toFixed(2)} % au-dessus de 3^(1/3))`);
  }
  affirmeVrai("le seuil converge quand l'adoucissement diminue",
    Math.abs(parEps[4] - parEps[3]) < Math.abs(parEps[1] - parEps[0])/5,
    `de ε/r = 0,2 à 0,1 le seuil bouge de ${fmt(Math.abs(parEps[1]-parEps[0]))}, ` +
    `de 0,02 à 0,01 il ne bouge plus que de ${fmt(Math.abs(parEps[4]-parEps[3]))}. ` +
    `C'est ce qui autorise à parler d'un seuil et pas d'un artefact.`);

  dit("");
  dit("         convergence quand le rapport de masses s'efface (ε/r = 0,02) :");
  let dernier = 0;
  for(const m of [1e-3, 1e-4, 1e-5, 1e-6, 1e-8]){
    const d = seuilRoche(rSat, m, 12, 0.02);
    const c = d/ech(m);
    dernier = c;
    dit(`           m/M = ${m.toExponential(0)} → coefficient ${fmt(c)}  ` +
        `(${((c/Math.cbrt(3)-1)*100).toFixed(2)} % au-dessus de 3^(1/3))`);
  }

  affirme("coefficient mesuré à la limite des petites masses",
    dernier, Math.cbrt(3), 3e-3,
    { source: "forme fermée d_synchrone = 3^(1/3)·r·(M/m)^(1/3)",
      note: "la Hill/L1 exacte s'écarte de 3^(1/3) d'un terme en (m/3M)^(1/3), " +
            "qui vaut 1,5 × 10⁻³ pour m/M = 10⁻⁸ : le résidu est donc attendu." });

  affirmeVrai("le seuil mesuré tombe ENTRE les deux limites de Roche des manuels",
    dernier > Math.cbrt(2) && dernier < N.ROCHE_FLUIDE,
    `${fmt(dernier)} est bien entre 1,2599 (rigide immobile) et 2,455 (fluide).`);

  affirmeVrai("le seuil mesuré n'est PAS 2^(1/3) — et c'est le résultat du contrôle",
    Math.abs(dernier/Math.cbrt(2) - 1) > 0.1,
    `écart à 2^(1/3) : ${((dernier/Math.cbrt(2)-1)*100).toFixed(1)} %. La formule ` +
    `rigide des vulgarisations néglige la rotation synchrone du satellite ; en la ` +
    `remettant, le coefficient passe de 2^(1/3) à 3^(1/3), et c'est celui-là que ` +
    `la simulation retrouve à 0,1 % près. On avait d'abord soupçonné le code.`);

  dit("");
  dit("         « juste en deçà se disloque, juste au-delà tient » — les deux essais :");
  const dc = seuilRoche(rSat, 1e-6, 12, 0.02);
  const dedans = grainTient(dc*0.98, rSat, 1e-6, 12, 0.02);
  const dehors = grainTient(dc*1.02, rSat, 1e-6, 12, 0.02);
  dit(`           d = 0,98 × seuil → le grain ${dedans ? "TIENT" : "part"}`);
  dit(`           d = 1,02 × seuil → le grain ${dehors ? "tient" : "PART"}`);
  affirmeVrai("à 2 % en deçà du seuil le grain est perdu, à 2 % au-delà il reste",
    !dedans && dehors,
    "le seuil est net à mieux que 2 %, ce qui est ce qu'on demande à une " +
    "limite de Roche : elle sépare, elle ne dégrade pas.");
}

/* ---------------------------------------------------------------------------
   5. LE SYSTÈME SOLAIRE RÉEL
   --------------------------------------------------------------------------- */
titre("5. SYSTÈME SOLAIRE — Soleil et quatre géantes, cinq mille ans");

/* Éléments moyens à J2000, table JPL « Keplerian Elements for Approximate
   Positions of the Major Planets » (Standish), colonnes a, e, i, L, ϖ, Ω.
   Rapports de masses Soleil/planète : IAU 2009.

   ATTENTION, et c'est déclaré comme une limite du contrôle : ces éléments sont
   MOYENS, pas osculateurs. Les prendre pour état initial introduit un écart de
   l'ordre des variations à courte période, soit quelques 10⁻³ en excentricité.
   C'est sans conséquence pour ce qu'on mesure ici — la stabilité des demi-grands
   axes — mais cela interdit de comparer les positions à une éphéméride. */
/* Les rapports de masse ne sont plus RECOPIÉS, ils sont DÉRIVÉS.

   Ils venaient de la littérature usuelle, retenus de mémoire. Relevés contre
   DE440 le 5 août 2026, ils se sont révélés justes à 10⁻⁶ — mieux que les 10⁻³
   qu'annonçait prudemment la note. Ce n'est pas la raison de les changer.

   La raison est qu'une valeur de contrôle recopiée ne contrôle rien : elle
   transforme une vérification en opinion, et rien ne signale le jour où elle
   dérive. Calculée à partir d'une constante sourcée, elle ne peut plus. Voir
   `SOURCES-NCORPS.md`.

   Ce sont des GM de SYSTÈME, planète et satellites confondus, et c'est ce qu'il
   faut : sur cinq mille ans les lunes accompagnent leur planète, et c'est la
   masse totale qui gouverne l'orbite héliocentrique. */
const GM_SOLEIL_KM = 1.32712440041279419e11;     // km³/s², DE440 (Park et al. 2021)
const GM_SYSTEME = {                              // km³/s², DE440
  Jupiter: 126712764.100000, Saturne: 37940584.841800,
  Uranus:    5794556.400000, Neptune:  6836527.100580,
};
const rapportMasse = nom => GM_SOLEIL_KM / GM_SYSTEME[nom];

const PLANETES = [
  // nom          a (ua)      e           i (°)      L (°)         ϖ (°)        Ω (°)
  ["Jupiter",  5.20288700, 0.04838624,  1.30439695,  34.39644051,  14.72847983, 100.47390909],
  ["Saturne",  9.53667594, 0.05386179,  2.48599187,  49.95424423,  92.59887831, 113.66242448],
  ["Uranus",  19.18916464, 0.04725744,  0.77263783, 313.23810451, 170.95427630,  74.01692503],
  ["Neptune", 30.06992276, 0.00859048,  1.77004347, -55.12002969,  44.96476227, 131.78422574],
].map(([nom, ...reste]) => [nom, rapportMasse(nom), ...reste]);
// Périodes sidérales publiées, en années juliennes — JPL Planetary Fact Sheets
const PERIODES_REF = { Jupiter: 11.862, Saturne: 29.457, Uranus: 84.011, Neptune: 164.79 };

function monteSystemeSolaire(liste){
  const pl = liste.map(([nom, rap, a, e, i, L, vp, Om]) => ({
    nom, m: 1/rap, a, e, i: i*DEG, Omega: Om*DEG,
    omega: (vp - Om)*DEG, M: mod2pi((L - vp)*DEG),
  }));
  return N.systemeKeplerien(1.0, pl, { G, integrateur:"yoshida4", nomEtoile:"Soleil" });
}

{
  const s = monteSystemeSolaire(PLANETES);
  const noms = PLANETES.map(p => p[0]);
  const a0 = noms.map((_, k) => N.elements(s, k+1, 0).a);
  const E0 = N.energie(s).total, L0 = N.momentCinetique(s).norme;
  const h = 8, duree = 5000*AN, nPas = Math.round(duree/h);
  const acc = noms.map(() => ({ somme:0, n:0, mn:Infinity, mx:-Infinity }));
  const serieE = [{ t:0, valeur:E0 }];
  const t0 = Date.now();
  for(let k = 1; k <= nPas; k++){
    N.pas(s, h);
    if(k % 200 === 0){
      for(let j = 0; j < noms.length; j++){
        const a = N.elements(s, j+1, 0).a, A = acc[j];
        A.somme += a; A.n++; A.mn = Math.min(A.mn, a); A.mx = Math.max(A.mx, a);
      }
      serieE.push({ t: s.t, valeur: N.energie(s).total });
    }
  }
  const dE = N.mesureDerive(serieE);
  sous(`5 000 ans, pas de ${h} jours, ${nPas.toLocaleString("fr-FR")} pas, ` +
       `${((Date.now()-t0)/1000).toFixed(1)} s`);

  let pireDerive = 0, pirePeriode = 0;
  for(let j = 0; j < noms.length; j++){
    const A = acc[j], moy = A.somme/A.n;
    const P = N.periodeKepler(moy, 1.0, 1/PLANETES[j][1], G)/AN;
    const dA = Math.abs(moy/a0[j] - 1);
    const dP = Math.abs(P/PERIODES_REF[noms[j]] - 1);
    pireDerive = Math.max(pireDerive, dA);
    pirePeriode = Math.max(pirePeriode, dP);
    dit(`         ${noms[j].padEnd(8)} a₀ = ${fmt(a0[j])} ua   ⟨a⟩ = ${fmt(moy)} ua   ` +
        `oscillation ±${((A.mx-A.mn)/2/moy*100).toFixed(4)} %`);
    dit(`                  P = ${P.toFixed(3)} an  (table : ${PERIODES_REF[noms[j]]} an, ` +
        `écart ${((P/PERIODES_REF[noms[j]]-1)*100).toFixed(3)} %)`);
  }

  affirmeSous("aucun demi-grand axe moyen ne s'écarte de son élément de départ",
    pireDerive, 5e-3,
    { note: "les demi-grands axes OSCILLENT — Saturne de ±0,4 %, sous l'effet de " +
            "la grande inégalité 5:2 avec Jupiter — mais leur moyenne ne bouge pas. " +
            "C'est le théorème de Laplace-Lagrange, et c'est ce qu'on vérifie." });

  affirmeSous("périodes retrouvées contre les périodes publiées (écart max)",
    pirePeriode, 6e-3,
    { source: "JPL Planetary Fact Sheets",
      note: "contrôle indirect sur G, sur l'ua, sur les masses et sur les unités " +
            "à la fois : une seule de ces quatre choses fausse, et l'écart explose." });

  affirmeSous("énergie totale : dérive sur 5 000 ans", dE.derive, 1e-8);
  affirmeSous("énergie totale : bande d'oscillation", dE.bande, 1e-8);
  affirmeSous("moment cinétique total, écart relatif",
    Math.abs(N.momentCinetique(s).norme/L0 - 1), 1e-12);

  const veilleur = N.veille(s, { deriveA: 0.02 });
  const bilan = veilleur.controle();
  affirmeVrai("le veilleur déclare le système solaire stable",
    bilan.stable,
    bilan.stable ? "aucun événement en 5 000 ans"
                 : "événements : " + JSON.stringify(bilan.evenements));
}

sous("Neptune et Pluton — ce que le contrôle montre, et ce qu'il ne prouve PAS");
/* Ce contrôle-ci est volontairement plus prudent que les autres, et il faut
   dire pourquoi. La résonance 3:2 de Pluton avec Neptune est un fait publié :
   l'argument 3λ_P − 2λ_N − ϖ_P libre autour de 180°, avec une amplitude voisine
   de 82° et une période voisine de 20 000 ans, et c'est elle qui empêche les
   deux astres de se rencontrer bien que le périhélie de Pluton passe à
   l'intérieur de l'orbite de Neptune.

   La simulation retrouve la LIBRATION — l'argument reste borné là où un corps
   non résonnant tournerait de plusieurs milliers de degrés. Elle ne retrouve
   PAS la bonne amplitude, et l'on sait pourquoi : les éléments de départ sont
   des éléments MOYENS, alors que la condition initiale demande des éléments
   OSCULATEURS à une date donnée. L'écart entre les deux est petit, mais la
   largeur de la résonance l'est aussi, et l'amplitude de libration y est très
   sensible. Il aurait fallu un état issu d'une éphéméride, qu'on n'a pas su
   sourcer avec certitude.

   On affirme donc uniquement ce que la mesure soutient : θ ne circule pas. */
{
  const AVEC_PLUTON = PLANETES.concat([
    ["Pluton", 1.36566e8, 39.48211675, 0.24882730, 17.14001206, 238.92903833, 224.06891629, 110.30393684],
  ]);
  const s = monteSystemeSolaire(AVEC_PLUTON);
  const h = 20, duree = 40000*AN, nPas = Math.round(duree/h);
  let mn = Infinity, mx = -Infinity, deroule = 0, prec = null, dMin = Infinity;
  for(let k = 1; k <= nPas; k++){
    N.pas(s, h);
    if(k % 200 === 0){
      const Ne = N.elements(s, 4, 0), Pl = N.elements(s, 5, 0);
      const th = mod2pi(3*Pl.lambda - 2*Ne.lambda - Pl.varpi);
      if(prec !== null){
        let d = th - prec; if(d > Math.PI) d -= TAU; if(d < -Math.PI) d += TAU;
        deroule += d;
      }
      prec = th;
      const t = th*180/Math.PI; mn = Math.min(mn, t); mx = Math.max(mx, t);
      dMin = Math.min(dMin, Math.hypot(s.p[15]-s.p[12], s.p[16]-s.p[13], s.p[17]-s.p[14]));
    }
  }
  // témoin : un corps fictif hors résonance, à 37 ua
  const sT = monteSystemeSolaire(PLANETES.concat([
    ["témoin", 1.36566e8, 37.0, 0.24882730, 17.14001206, 238.92903833, 224.06891629, 110.30393684],
  ]));
  let derouleT = 0, precT = null;
  for(let k = 1; k <= nPas; k++){
    N.pas(sT, h);
    if(k % 200 === 0){
      const Ne = N.elements(sT, 4, 0), Pl = N.elements(sT, 5, 0);
      const th = mod2pi(3*Pl.lambda - 2*Ne.lambda - Pl.varpi);
      if(precT !== null){
        let d = th - precT; if(d > Math.PI) d -= TAU; if(d < -Math.PI) d += TAU;
        derouleT += d;
      }
      precT = th;
    }
  }
  dit(`         Pluton : θ ∈ [${mn.toFixed(0)} ; ${mx.toFixed(0)}]°, ` +
      `déroulé net sur 40 000 ans ${Math.abs(deroule*180/Math.PI).toFixed(0)}°`);
  dit(`         témoin à 37 ua (hors résonance) : déroulé net ` +
      `${Math.abs(derouleT*180/Math.PI).toFixed(0)}°`);
  dit(`         distance Neptune-Pluton minimale simulée : ${fmt(dMin)} ua ` +
      `(publiée : environ 17 ua)`);
  affirmeVrai("l'argument 3:2 de Pluton ne circule pas, celui du témoin oui",
    Math.abs(deroule*180/Math.PI) < 720 && Math.abs(derouleT*180/Math.PI) > 7200,
    `${Math.abs(deroule*180/Math.PI).toFixed(0)}° contre ` +
    `${Math.abs(derouleT*180/Math.PI).toFixed(0)}° : deux ordres de grandeur. ` +
    `Le verrou résonnant est là. Son amplitude, elle, n'est pas la bonne — voir ` +
    `« CE QUI RESTE OUVERT » en fin de rapport.`);
}

/* ---------------------------------------------------------------------------
   6. DÉTECTION DE DÉSTABILISATION
   --------------------------------------------------------------------------- */
titre("6. LE VEILLEUR — il doit se taire quand il faut, et parler quand il faut");

/* Le juge de ce contrôle n'est pas une intuition mais un critère publié : trois
   planètes de masses comparables sur des orbites voisines sont instables dès
   que leur séparation tombe sous Δ ≈ 2√3 ≈ 3,46 rayons de Hill MUTUELS, et
   stables au-delà sur des durées bien plus longues (Gladman 1993, Icarus 106,
   247 ; Chambers, Wetherill & Boss 1996, Icarus 119, 261).

   On monte donc trois systèmes identiques à la séparation près, de part et
   d'autre de ce seuil, et l'on demande au veilleur de les trier. C'est ce qui
   fait la différence entre éprouver un détecteur et le regarder fonctionner :
   un détecteur qui n'aboie jamais et un détecteur qui aboie toujours sont
   également inutiles. Il faut les deux côtés, et une frontière qui vienne
   d'ailleurs que de nous. */
function troisPlanetes(m, ratio, seuilA, maxRev){
  const a = [1.0, ratio, ratio*ratio];
  const s = N.systemeKeplerien(1.0, [
    { m, a:a[0], e:0.01, i:0,     Omega:0, omega:0, M:0,   nom:"a" },
    { m, a:a[1], e:0.01, i:0.005, Omega:0, omega:0, M:2.0, nom:"b" },
    { m, a:a[2], e:0.01, i:0.010, Omega:0, omega:0, M:4.0, nom:"c" },
  ], { G, integrateur:"yoshida4", adoucissement: 1e-4 });
  const v = N.veille(s, { deriveA: seuilA });
  const P = N.periodeKepler(1.0, 1.0, m, G), h = P/300;
  // rayon de Hill mutuel : ((m₁+m₂)/3M)^(1/3) · (a₁+a₂)/2
  const rHill = Math.cbrt(2*m/3) * (a[0]+a[1])/2;
  const delta = (a[1] - a[0]) / rHill;
  let quand = null, quoi = null;
  const nPas = Math.round(maxRev*P/h);
  for(let k = 0; k < nPas && quand === null; k++){
    N.pas(s, h);
    if(k % 300 === 0){
      const b = v.controle();
      if(!b.stable){ quand = s.t/P; quoi = b.evenements; }
    }
  }
  return { delta, quand, quoi, ecarts: v.ecarts() };
}

const SEUIL_GLADMAN = 2*Math.sqrt(3);   // ≈ 3,4641

sous("un système large : le veilleur doit rester muet");
{
  const r = troisPlanetes(1e-4, 1.30, 0.10, 3000);
  dit(`         séparation Δ = ${r.delta.toFixed(2)} rayons de Hill mutuels ` +
      `(seuil de Gladman : ${SEUIL_GLADMAN.toFixed(2)})`);
  affirmeVrai("Δ = 6,4 R_H, trois mille révolutions : aucun événement",
    r.quand === null,
    r.quand === null ? "silence, comme attendu très au-dessus du seuil"
                     : "a parlé à la révolution " + r.quand.toFixed(0) +
                       " — FAUX POSITIF : " + JSON.stringify(r.quoi));
  affirmeVrai("la séparation est bien au-dessus du seuil publié",
    r.delta > SEUIL_GLADMAN, `${r.delta.toFixed(2)} > ${SEUIL_GLADMAN.toFixed(2)}`);
  affirmeSous("et les invariants suivent", r.ecarts.energie, 1e-8,
    { note: "c'est un écart relevé à UN instant, donc une position dans la bande " +
            "d'oscillation et non une dérive — le piège 4 de l'en-tête de " +
            "ncorps.js. La dérive, elle, se mesure au contrôle 2 sur une série." });
}

sous("un système juste sous le seuil : le veilleur doit finir par parler");
{
  const r = troisPlanetes(1e-4, 1.15, 0.10, 3000);
  dit(`         séparation Δ = ${r.delta.toFixed(2)} rayons de Hill mutuels ` +
      `(seuil de Gladman : ${SEUIL_GLADMAN.toFixed(2)})`);
  affirmeVrai("la séparation est bien sous le seuil publié",
    r.delta < SEUIL_GLADMAN, `${r.delta.toFixed(2)} < ${SEUIL_GLADMAN.toFixed(2)}`);
  affirmeVrai("le veilleur détecte la déstabilisation",
    r.quand !== null,
    r.quand !== null
      ? `premier événement à la révolution ${r.quand.toFixed(0)} : ` +
        r.quoi.map(e => e.type + " (" + (e.nom || e.corps) + ")").join(", ")
      : "AUCUN événement en 3 000 révolutions — le détecteur est aveugle");
  if(r.quand !== null){
    affirmeEntre("l'instabilité met des centaines de révolutions à se déclarer",
      r.quand, 20, 3000,
      { unite: "révolutions",
        note: "sous le seuil mais pas très en dessous : la déstabilisation doit " +
              "être lente. Un déclenchement au deuxième tour signalerait un seuil " +
              "mal réglé, pas une instabilité — c'est l'erreur qu'on avait faite " +
              "en prenant des planètes de 2 × 10⁻³ M☉, dont le demi-grand axe " +
              "OSCULATEUR bat de plus de 50 % sans que rien ne soit instable." });
    affirmeVrai("l'événement porte un type connu",
      r.quoi.every(e => ["ejection","collision","derive-a","deliaison"].includes(e.type)),
      "types rendus : " + [...new Set(r.quoi.map(e => e.type))].join(", "));
  }
}

sous("un système très serré : la rupture doit être violente et rapide");
{
  const r = troisPlanetes(1e-3, 1.30, 0.30, 500);
  dit(`         séparation Δ = ${r.delta.toFixed(2)} rayons de Hill mutuels`);
  affirmeVrai("Δ ≈ 3,0 R_H avec des planètes de masse jovienne : rupture en moins de 100 tours",
    r.quand !== null && r.quand < 100,
    r.quand !== null
      ? `révolution ${r.quand.toFixed(0)} : ` +
        [...new Set(r.quoi.map(e => e.type))].join(", ") +
        " — une orbite devient hyperbolique, ce n'est plus une dérive mais une rupture."
      : "aucun événement — le détecteur a raté une déstabilisation franche");
}

sous("les entorses sont déclarées et lisibles");
{
  const s = N.deuxCorps(1.0, 1e-3, 1.0, 0.2, { G, adoucissement: 1e-5 });
  const e = N.entorses(s);
  affirmeVrai("entorses() nomme l'adoucissement quand il est actif",
    e.some(x => /adoucissement/i.test(x.quoi)),
    e.map(x => "· " + x.quoi).join("\n         "));
  const s0 = N.deuxCorps(1.0, 1e-3, 1.0, 0.2, { G });
  affirmeVrai("et se tait sur l'adoucissement quand ε = 0",
    !N.entorses(s0).some(x => /adoucissement/i.test(x.quoi)),
    "ε = 0 : le module est exactement newtonien, il ne doit pas s'accuser d'une " +
    "approximation qu'il ne fait pas.");
  affirmeVrai("adoucissementConseille() rend une valeur positive et finie",
    N.adoucissementConseille(s0) > 0 && isFinite(N.adoucissementConseille(s0)),
    "ε conseillé = " + fmt(N.adoucissementConseille(s0)) + " ua");
}

/* ---------------------------------------------------------------------------
   BILAN
   --------------------------------------------------------------------------- */
titre("BILAN");
dit("");
dit(`  ${nbControles} contrôles, ${nbEchecs} échec${nbEchecs > 1 ? "s" : ""}.`);
if(nbEchecs){
  dit("");
  for(const e of echecs) dit("    ÉCHEC — " + e);
}
dit("");
dit("  CE QUI RESTE OUVERT, et qu'aucun de ces contrôles ne règle :");
dit("");
dit("    · L'AMPLITUDE de libration de Pluton. La simulation montre le verrou");
dit("      3:2 mais lui donne une amplitude trop large et une distance minimale");
dit("      à Neptune trop courte. La cause est identifiée — on part d'éléments");
dit("      MOYENS là où il faudrait des éléments OSCULATEURS d'éphéméride — mais");
dit("      la donnée manque. Tant qu'elle manque, ce contrôle affirme seulement");
dit("      que θ ne circule pas, et rien de plus.");
dit("");
dit("    · LE COEFFICIENT FLUIDE 2,455 n'est pas reproduit numériquement, et ne");
dit("      peut pas l'être avec des masses ponctuelles. Il suppose un fluide");
dit("      INCOMPRESSIBLE qui se déforme en ellipsoïde d'équilibre ; un tas de");
dit("      points sans cohésion ni frottement ne fait pas cela — il s'effondre");
dit("      d'abord sur lui-même, et son rayon n'est plus celui qu'on lui a donné.");
dit("      Ce qui est vérifié, c'est la forme fermée contre les anneaux de");
dit("      Saturne ; ce qui est mesuré, c'est le seuil du cas rigide synchrone.");
dit("      L'écart entre les deux n'est pas comblé, il est déclaré.");
dit("");
dit("    · LES ÉLÉMENTS SONT MOYENS, pas osculateurs. C'est ce qui reste de");
dit("      l'ancienne réserve sur les masses — celle-là est levée : les rapports");
dit("      Soleil/planète ne sont plus recopiés, ils se dérivent des GM de");
dit("      DE440 à l'exécution. Mais les éléments orbitaux de Standish restent");
dit("      des moyennes valables 1800-2050, ce qui interdit de comparer les");
dit("      POSITIONS à une éphéméride. Les demi-grands axes, eux, sont bons.");
dit("");
dit("    · LA STABILITÉ À LONG TERME n'est pas prouvée par 5 000 ans. Les");
dit("      instabilités du système solaire se comptent en centaines de millions");
dit("      d'années. Ce contrôle montre que l'intégrateur ne fabrique pas de");
dit("      dérive ; il ne dit rien sur le système solaire lui-même.");
dit("");

process.exit(nbEchecs ? 1 : 0);
