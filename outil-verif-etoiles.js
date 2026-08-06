/* ============================================================================
   OUTIL DE VÉRIFICATION — pas du code de production, pas chargé par la page.

       node outil-verif-etoiles.js

   Il charge etoiles.js en lui donnant un faux `window`, puis éprouve trois
   choses sur les éléments recopiés de Gillessen et al. 2017 :

     1. le SIGNE de la troisième composante de position() — un astre qui
        s'éloigne doit-il donner un z croissant ? Le juge est la vitesse
        radiale de S2 au périastre de 2018, publiée et sans ambiguïté ;
     2. la troisième loi de Kepler, étoile par étoile, qui doit rendre la même
        masse centrale partout — une ligne mal recopiée s'y voit tout de suite ;
     3. quelques ordres de grandeur (périastre et vitesse de S2).

   Résultat dans VERIF-ETOILES.md.
   ============================================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

// --- chargement d'etoiles.js sans navigateur -------------------------------
const src = fs.readFileSync(path.join(__dirname, "etoiles.js"), "utf8");
const faux = {};
// le module se termine par })(window); — on lui passe notre objet à la place
new Function("window", src)(faux);
const { ETOILES, position } = faux.ETOILES_S;

// --- constantes ------------------------------------------------------------
const UA_AN_EN_KMS = 4.74047;   // une unité astronomique par an, en km/s
const MASSE_ATTENDUE = 4.3e6;   // masses solaires

// vitesse par différence centrée, en UA/an, puis en km/s
function vitesse(s, annee, h = 1e-4){
  const a = position(s, annee - h), b = position(s, annee + h);
  return [0,1,2].map(k => (b[k] - a[k]) / (2*h) * UA_AN_EN_KMS);
}

const S2 = ETOILES.find(s => s.nom === "S2");

// --- 1. le signe -----------------------------------------------------------
const lignes = [];
const dit = t => { lignes.push(t); console.log(t); };

dit("## 1. Signe de la troisième composante — vitesse radiale de S2");
dit("");
dit("| époque | dz/dt (km/s) | |v| (km/s) | r (UA) |");
dit("|---|---:|---:|---:|");
for(const an of [2017.4, 2018.0, 2018.2, 2018.3, 2018.35, 2018.4, 2018.45, 2018.5, 2018.6, 2019.0, 2019.4]){
  const v = vitesse(S2, an);
  const p = position(S2, an);
  const norme = Math.hypot(...v);
  const r = Math.hypot(...p);
  dit(`| ${an.toFixed(2)} | ${v[2].toFixed(0)} | ${norme.toFixed(0)} | ${r.toFixed(1)} |`);
}
dit("");

// extrema de dz/dt autour du périastre
let min = {v: Infinity}, max = {v: -Infinity};
for(let an = 2017.5; an <= 2019.5; an += 0.0005){
  const vz = vitesse(S2, an)[2];
  if(vz < min.v) min = {v: vz, an};
  if(vz > max.v) max = {v: vz, an};
}
dit(`Extremum négatif : ${min.v.toFixed(0)} km/s en ${min.an.toFixed(3)}`);
dit(`Extremum positif : ${max.v.toFixed(0)} km/s en ${max.an.toFixed(3)}`);
dit("");

// date du périastre effective (distance minimale)
let peri = {r: Infinity};
for(let an = 2017.5; an <= 2019.5; an += 0.0005){
  const r = Math.hypot(...position(S2, an));
  if(r < peri.r) peri = {r, an};
}
dit(`Périastre calculé : r = ${peri.r.toFixed(1)} UA en ${peri.an.toFixed(3)}`);
dit(`a(1−e) attendu    : ${(S2.a*(1-S2.e)).toFixed(1)} UA`);
const vPeri = Math.hypot(...vitesse(S2, peri.an));
dit(`Vitesse au périastre : ${vPeri.toFixed(0)} km/s = ${(vPeri/299792.458*100).toFixed(2)} % de c`);
dit("");

// --- 1 bis. le même résultat, mais analytique ------------------------------
// La vitesse radiale képlérienne vaut K·[cos(ω+ν) + e·cos ω], avec
// K = 2πa·sin i / (P·√(1−e²)). Ses deux extrema tombent en ω+ν = 0 et = 180°,
// c'est-à-dire en ν = −ω (AVANT le périastre, puisque ν y passe par zéro) et
// ν = 180−ω (APRÈS). Leurs valeurs sont K(1+e·cos ω) et −K(1−e·cos ω).
//
// Conséquence qui tranche : le rapport des deux extrema ne dépend que de e et
// de ω, jamais du signe de z. Aucune correction de signe ne peut échanger
// leurs grandeurs — elle ne peut qu'échanger leurs signes.
dit("## 1 bis. Contrôle analytique des deux extrema de vitesse radiale");
dit("");
{
  const K = 2*Math.PI * S2.a * Math.sin(S2.i*DEG_()) /
            (S2.P * Math.sqrt(1 - S2.e*S2.e)) * UA_AN_EN_KMS;
  const ec = S2.e * Math.cos(S2.w*DEG_());
  dit(`K = ${Math.abs(K).toFixed(0)} km/s, e·cos ω = ${ec.toFixed(4)}`);
  dit(`Extremum AVANT le périastre (ν = −ω) : ${(K*(1+ec)).toFixed(0)} km/s`);
  dit(`Extremum APRÈS le périastre (ν = 180−ω) : ${(-K*(1-ec)).toFixed(0)} km/s`);
  dit(`Rapport des grandeurs : ${Math.abs((1+ec)/(1-ec)).toFixed(2)} — le plus ` +
      `grand tombe forcément AVANT le périastre tant que cos ω > 0.`);
}
dit("");

function DEG_(){ return Math.PI/180; }

// --- 2. Kepler -------------------------------------------------------------
dit("## 2. Troisième loi de Kepler, étoile par étoile");
dit("");
dit("| étoile | a (UA) | P (an) | M = a³/P² (M☉) | écart à 4,3e6 |");
dit("|---|---:|---:|---:|---:|");
const masses = [];
for(const s of ETOILES){
  const M = s.a**3 / s.P**2;
  masses.push({nom: s.nom, M});
  const ecart = (M/MASSE_ATTENDUE - 1) * 100;
  dit(`| ${s.nom} | ${s.a.toFixed(0)} | ${s.P.toFixed(1)} | ${(M/1e6).toFixed(2)} × 10⁶ | ${ecart >= 0 ? "+" : ""}${ecart.toFixed(1)} % |`);
}
const moy = masses.reduce((t,m) => t + m.M, 0) / masses.length;
dit("");
dit(`Moyenne : ${(moy/1e6).toFixed(2)} × 10⁶ M☉ (écart à 4,3e6 : ${((moy/MASSE_ATTENDUE-1)*100).toFixed(1)} %)`);
dit("");

/* --- 3. L'ÉQUATION DE KEPLER, CONTRE UN ARBITRE INDÉPENDANT ----------------

   Ce contrôle existe parce qu'il manquait, et que son absence a coûté cher.

   Le solveur partait de E = M et faisait six itérations de Newton. À
   l'excentricité de S14 — 0,976 — il sortait une anomalie fausse de 3,1
   radians, presque un demi-tour, et posait l'étoile à 3 285 unités
   astronomiques de sa vraie place : cent trente-neuf pour cent de son
   demi-grand axe. L'étoile sautait de l'autre côté de son orbite.

   Rien ne le voyait. La troisième loi de Kepler passait — elle ne teste que les
   ÉLÉMENTS, a et P, pas la résolution qui les emploie. Il a fallu qu'Hugo
   regarde la carte tourner et dise « certaines orbites sont buggées ».

   L'arbitre est une bissection : lente, bête, et incapable de diverger. Elle
   n'a rien de commun avec Halley sinon la réponse. C'est ce qui en fait un
   arbitre plutôt qu'un miroir. */
dit("## 3. L'équation de Kepler, contre une bissection arbitre");
dit("");

const TAU_ = 2*Math.PI;
function bissecte(e, M){
  M = ((M % TAU_) + TAU_) % TAU_;
  let lo = 0, hi = TAU_;
  for(let k = 0; k < 300; k++){ const m = (lo+hi)/2; if(m - e*Math.sin(m) < M) lo = m; else hi = m; }
  return (lo+hi)/2;
}
function posArbitre(s, annee){
  const M = TAU_*((annee - s.t0)/s.P % 1), E = bissecte(s.e, M);
  const x = s.a*(Math.cos(E) - s.e), y = s.a*Math.sqrt(1 - s.e*s.e)*Math.sin(E);
  const D = DEG_();
  const cw = Math.cos(s.w*D), sw = Math.sin(s.w*D);
  const ci = Math.cos(s.i*D), si = Math.sin(s.i*D);
  const cO = Math.cos(s.O*D), sO = Math.sin(s.O*D);
  const xw = x*cw - y*sw, yw = x*sw + y*cw, yi = yw*ci, zi = yw*si;
  return [xw*cO - yi*sO, xw*sO + yi*cO, zi];
}

dit("| étoile | e | écart max de position | en % du demi-grand axe |");
dit("|---|---:|---:|---:|");
let pireEcart = 0, pireNom = "";
for(const s of ETOILES){
  let p = 0;
  for(let i = 0; i < 4000; i++){
    const annee = s.t0 + s.P*i/4000;
    const a = position(s, annee), b = posArbitre(s, annee);
    p = Math.max(p, Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]));
  }
  if(p > pireEcart){ pireEcart = p; pireNom = s.nom; }
  dit(`| ${s.nom} | ${s.e.toFixed(3)} | ${p.toExponential(2)} ua | ${(100*p/s.a).toExponential(1)} % |`);
}
dit("");
const tolerance = 1e-6;   // en unités astronomiques
const kepplerOk = pireEcart < tolerance;
dit(`Pire écart : **${pireEcart.toExponential(3)} ua** sur ${pireNom}. ` +
    (kepplerOk ? "✅ sous la tolérance de 10⁻⁶ ua."
               : `❌ AU-DELÀ de ${tolerance} ua — une étoile est ailleurs qu'où elle doit être.`));
dit("");

// La marge : jusqu'où le solveur tient si une orbite plus allongée arrive.
let pireReste = 0;
for(const e of [0.976, 0.99, 0.999, 0.9999])
  for(let i = 0; i < 2000; i++){
    const M = TAU_*i/2000, E = bissecte(e, M);
    void E;
    // on éprouve le solveur du module en lui redemandant la même chose
    const s = { e, a:1, P:1, t0:0, w:0, i:0, O:0 };
    const p = position(s, M/TAU_);
    const q = posArbitre(s, M/TAU_);
    pireReste = Math.max(pireReste, Math.hypot(p[0]-q[0], p[1]-q[1], p[2]-q[2]));
  }
dit(`Marge : jusqu'à e = 0,9999 l'écart reste sous **${pireReste.toExponential(2)}** ` +
    `(demi-grand axe unité). L'excentricité la plus forte du catalogue est ${
      Math.max(...ETOILES.map(s => s.e)).toFixed(3)}.`);
dit("");

/* ------------------------------------------------- L'ENTRÉE DE LA CARTE

   Hugo, 6 août au soir : « il faudrait qu'on voie les orbites dézoomer, là la
   taille est fixe dans l'espace et apparaît d'un coup à la fin du voyage. »

   `vue.echelle` valait 1 en permanence : la carte montait en opacité, à taille
   constante. Elle s'ouvre maintenant serrée et s'écarte à mesure qu'elle
   apparaît. Ce contrôle garde les trois choses qui comptent — qu'elle parte
   bien serrée, qu'elle finisse au cadre nominal, et qu'elle n'aille jamais à
   rebours en chemin, ce qui se verrait comme un à-coup. */
let entreeOk = true, pire = "";
{
  const ETOILES_S = faux.ETOILES_S;
  const V = ETOILES_S ? ETOILES_S.vue : null;
  if(!V){ entreeOk = false; pire = "module non chargé"; }
  else {
    ETOILES_S.entree(0);
    const debut = V.echelle;
    ETOILES_S.entree(1);
    const fin = V.echelle;

    // monotone : l'échelle ne doit que décroître, sinon l'œil voit un rebond
    let prec = Infinity, monotone = true;
    for(let i = 0; i <= 60; i++){
      ETOILES_S.entree(i/60);
      if(V.echelle > prec + 1e-9) monotone = false;
      prec = V.echelle;
    }
    /* CRITÈRE ABSOLU, ET C'EST LE POINT.

       La première version comparait `debut` à `ZOOM_ENTREE` — donc mettre cette
       constante à 1 supprimait tout dézoom ET faisait passer le contrôle, qui
       annonçait fièrement << de 1× à 1× >>. Il mesurait sa propre hypothèse.

       On exige donc un dézoom RÉEL : au moins un facteur trois, sans quoi le
       geste ne se voit pas et la question d'Hugo reviendrait. */
    if(!(debut >= 3*fin)){ entreeOk = false; pire = "le dézoom est trop faible pour se voir : " + debut.toFixed(2) + "× → " + fin.toFixed(2) + "×"; }
    else if(Math.abs(fin - 1) > 1e-9){ entreeOk = false; pire = "elle ne finit pas au cadre nominal : " + fin; }
    else if(!monotone){ entreeOk = false; pire = "l'échelle remonte en chemin — l'œil y verrait un à-coup"; }

    // et la main de l'utilisateur doit l'emporter
    ETOILES_S.entree(0.5);
    ETOILES_S.zoome(1.2);
    const apresZoom = V.echelle;
    ETOILES_S.entree(0.9);
    if(Math.abs(V.echelle - apresZoom) > 1e-9){
      entreeOk = false; pire = "l'entrée reprend la barre après un zoom manuel";
    }
    ETOILES_S.entree(0);            // on rend l'état comme on l'a pris
  }
}
dit(`Entrée de la carte : ${entreeOk
  ? `**elle se dézoome** — de ${faux.ETOILES_S.ZOOM_ENTREE}× à 1×, sans rebond, et un zoom manuel lui reprend la barre. ✅`
  : `❌ ${pire}`}`);
dit("");

// Le constat rédigé est dans VERIF-ETOILES.md ; ici on ne fait que l'imprimer.
void lignes;
process.exit(kepplerOk && entreeOk ? 0 : 1);
