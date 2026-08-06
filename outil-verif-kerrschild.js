/* ============================================================================
   Le moteur de Kerr-Schild, sans navigateur et avant tout portage.

       node outil-verif-kerrschild.js

   Ce fichier passe AVANT que la moindre ligne parte dans le nuanceur, et c'est
   tout son intérêt. Les dérivées analytiques de la métrique sont le morceau
   dangereux du chantier : une erreur de signe dans ∂r/∂xⁱ ne plante pas, elle
   rend une image plausible et fausse. Personne ne la verrait.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ

   Règle 3 du projet : un contrôle tire sa vérité d'ailleurs que de ce qu'il
   contrôle. Ici, de quatre sources indépendantes du module :

     · les DIFFÉRENCES FINIES — elles ne savent rien de mon algèbre ;
     · BARDEEN 1972, via les formules fermées de `kerr.js`, qui donnent les
       orbites de photons et l'ISCO en fonction du spin sans intégrer quoi que
       ce soit ;
     · l'IDENTITÉ SPHÉROÏDALE, qui doit tenir exactement ;
     · les INVARIANTS du mouvement, qui ne dépendent que de la symétrie.

   Et le contrôle qui donne son nom au chantier : la déviation d'un rayon qui
   rase l'axe de rotation doit varier CONTINÛMENT. C'est la couture, mesurée
   sans écran.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const faux = {};
const charge = f => new Function("window", fs.readFileSync(path.join(__dirname, f), "utf8"))(faux);
charge("kerr.js");
charge("kerrschild.js");
const K = faux.KERR, KS = faux.KERRSCHILD;
const M = KS.M;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// Un générateur reproductible : un contrôle qui change de points à chaque
// exécution échoue un jour sur deux et se fait désactiver la semaine suivante.
let graine = 20260806;
const alea = () => (graine = (graine*1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

const SPINS = [0, 0.6, 0.9, 0.95].map(s => s*M);      // les quatre du site, en a

console.log("\n  KERR-SCHILD — CONTRÔLE NUMÉRIQUE");
console.log("  ════════════════════════════════");

// ═══════════════════════════════════════════ 1. la géométrie tient debout
groupe("L'identité sphéroïdale, dont tout le reste dépend");
{
  let pire = 0;
  for(const a of SPINS){
    for(let i = 0; i < 4000; i++){
      const p = [(alea()-0.5)*60, (alea()-0.5)*60, (alea()-0.5)*60];
      if(Math.hypot(p[0], p[1], p[2]) < 1.2) continue;
      const r = KS.rayon(p, a);
      const id = (p[0]*p[0] + p[1]*p[1])/(r*r + a*a) + p[2]*p[2]/(r*r);
      pire = Math.max(pire, Math.abs(id - 1));
    }
  }
  ok("(x²+y²)/(r²+a²) + z²/r² vaut 1 partout", pire < 1e-11,
     "< 1e-11", pire.toExponential(2),
     "si elle se casse, k cesse d'être nul et tout le moteur est faux en silence");
}

groupe("Le vecteur k est bien nul");
{
  let pire = 0;
  for(const a of SPINS){
    for(let i = 0; i < 3000; i++){
      const p = [(alea()-0.5)*40, (alea()-0.5)*40, (alea()-0.5)*40];
      if(Math.hypot(p[0], p[1], p[2]) < 1.2) continue;
      const k = KS.vecteurK(p, a);
      pire = Math.max(pire, Math.abs(Math.hypot(k[0], k[1], k[2]) - 1));
    }
  }
  ok("la partie spatiale de k est unitaire", pire < 1e-11, "< 1e-11", pire.toExponential(2),
     "c'est ce qui rend k nul pour η, donc l'inverse aussi simple que la métrique");
}

// ═════════════════════════════ 2. les dérivées, contre des différences finies
/* LE CONTRÔLE QUI COMPTE. Les différences finies ne savent rien de mon algèbre :
   elles ne peuvent pas se tromper de la même façon que moi. On les prend
   centrées, au pas h = 1e-5 — plus petit, l'annulation en double précision
   commence à mordre ; plus grand, l'erreur de troncature domine. */
function ecartDerivee(f, p, a, analytique, h){
  const pas = h || 1e-5;
  let pire = 0;
  for(let i = 0; i < 3; i++){
    const pp = p.slice(), pm = p.slice();
    pp[i] += pas; pm[i] -= pas;
    const num = (f(pp, a) - f(pm, a)) / (2*pas);
    const ana = analytique[i];
    const ech = Math.max(1, Math.abs(num), Math.abs(ana));
    pire = Math.max(pire, Math.abs(num - ana) / ech);
  }
  return pire;
}

groupe("Les dérivées analytiques disent la même chose que les différences finies");
{
  const zones = [
    ["au loin",              () => [(alea()-0.5)*60, (alea()-0.5)*60, (alea()-0.5)*60], 8],
    ["près de l'horizon",    () => [(alea()-0.5)*4,  (alea()-0.5)*4,  (alea()-0.5)*4],  1.05],
    ["à ras de l'axe",       () => [(alea()-0.5)*1e-3, (alea()-0.5)*1e-3, (alea()-0.5)*20], 1.2],
    ["dans le plan équatorial", () => [(alea()-0.5)*30, (alea()-0.5)*30, (alea()-0.5)*1e-4], 1.2],
  ];

  for(const [nom, tire, rmin] of zones){
    let pR = 0, pF = 0, pK = 0, vus = 0;
    for(const a of SPINS){
      for(let i = 0; i < 700; i++){
        const p = tire();
        if(Math.hypot(p[0], p[1], p[2]) < rmin) continue;
        vus++;
        const r = KS.rayon(p, a);
        pR = Math.max(pR, ecartDerivee(KS.rayon,   p, a, KS.gradRayon(p, a, r)));
        pF = Math.max(pF, ecartDerivee(KS.facteur, p, a, KS.gradFacteur(p, a, r)));
        // ∂k : trois fonctions scalaires, une par composante
        const dk = KS.gradK(p, a, r);
        for(let j = 0; j < 3; j++){
          const comp = (q, aa) => KS.vecteurK(q, aa)[j];
          pK = Math.max(pK, ecartDerivee(comp, p, a, [dk[0][j], dk[1][j], dk[2][j]]));
        }
      }
    }
    ok(nom + " — ∂r, ∂f et ∂k", Math.max(pR, pF, pK) < 2e-5,
       "< 2e-5", "∂r " + pR.toExponential(1) + "  ∂f " + pF.toExponential(1)
                 + "  ∂k " + pK.toExponential(1),
       vus + " points examinés");
  }
}

/* Et la preuve que ce contrôle sait tomber. On casse un signe — celui de
   ∂r/∂z, le plus facile à écrire à l'envers — et l'on vérifie qu'il hurle.
   Sans cette ligne, « les dérivées sont justes » serait une affirmation qu'on
   ne peut pas mettre en doute, donc sans valeur. */
groupe("Et il sait tomber — on inverse un signe exprès");
{
  const vrai = KS.gradRayon;
  const casse = (p, a, r) => { const g = vrai(p, a, r); return [g[0], g[1], -g[2]]; };
  const p = [3.1, 2.2, 1.7], a = 0.45;
  const bon  = ecartDerivee(KS.rayon, p, a, vrai(p, a));
  const faux2 = ecartDerivee(KS.rayon, p, a, casse(p, a));
  ok("un ∂r/∂z inversé est bien détecté", faux2 > 1e-3 && bon < 2e-5,
     "sain < 2e-5, cassé > 1e-3",
     "sain " + bon.toExponential(1) + "   cassé " + faux2.toExponential(1));
}

// ══════════════════════════════════════ 3. les invariants le long d'un rayon
groupe("Ce qui doit se conserver le long d'un rayon");
{
  for(const a of SPINS){
    const t = KS.photon([-30, 3.2, 1.4], [1, 0, 0], a, { trace: true, pas: 0.02 });
    // nullité : elle doit rester à zéro
    ok("a = " + (a/M).toFixed(2) + " — la condition de nullité tient",
       t.deriveNullite < 5e-6, "< 5e-6", t.deriveNullite.toExponential(2),
       t.pas + " pas, " + (t.avale ? "avalé" : "échappé"));

    // L_z = x p_y − y p_x, conservé par axisymétrie autour de z
    let lz0 = null, pireLz = 0;
    for(const e of t.trace){
      const lz = e[0]*e[4] - e[1]*e[3];
      if(lz0 === null) lz0 = lz;
      pireLz = Math.max(pireLz, Math.abs(lz - lz0));
    }
    ok("a = " + (a/M).toFixed(2) + " — le moment cinétique axial se conserve",
       pireLz < 1e-5, "< 1e-5", pireLz.toExponential(2),
       "l'axisymétrie l'impose, et elle ne dépend d'aucune de mes dérivées");
  }
}

// ══════════════════════════ 4. Bardeen : le rayon critique de capture
/* L'oracle extérieur. `kerr.js` donne le paramètre d'impact critique en forme
   fermée (Bardeen 1972) ; on le retrouve en cherchant par bissection la
   frontière entre « avalé » et « échappé ». Les deux calculs n'ont rien en
   commun — l'un est une formule, l'autre une intégration. */
function bCritique(a, signe){
  // signe = +1 : décalage vers +y, donc L_z < 0, rétrograde.
  const tire = b => {
    const t = KS.photon([-45, signe*b, 0], [1, 0, 0], a, { pas: 0.02, rMax: 80 });
    return t.avale;
  };
  let lo = 0.5, hi = 12;
  if(!tire(lo)) return NaN;                    // rien n'est avalé : mauvaise mise
  for(let i = 0; i < 46; i++){
    const mid = 0.5*(lo + hi);
    if(tire(mid)) lo = mid; else hi = mid;
  }
  return 0.5*(lo + hi);
}

groupe("Le rayon critique de capture, contre Bardeen 1972");
for(const a of SPINS){
  const retro = bCritique(a, +1);              // L_z < 0
  const pro   = bCritique(a, -1);              // L_z > 0
  const attR = K.bPhoton(a, false), attP = K.bPhoton(a, true);
  const eR = Math.abs(retro - attR), eP = Math.abs(pro - Math.abs(attP));
  ok("a* = " + (a/M).toFixed(2) + " — rétrograde", eR < 6e-3,
     attR.toFixed(4), retro.toFixed(4) + "  (écart " + eR.toExponential(1) + ")");
  ok("a* = " + (a/M).toFixed(2) + " — prograde", eP < 6e-3,
     Math.abs(attP).toFixed(4), pro.toFixed(4) + "  (écart " + eP.toExponential(1) + ")",
     a === 0 ? "à a = 0 les deux valent √27·M = 2,598 — l'ombre publiée" : undefined);
}

// ══════════════════════════════════ 5. LA COUTURE : continuité près de l'axe
/* LE CONTRÔLE QUI A MOTIVÉ TOUT LE CHANTIER.

   On fait tourner le point d'impact d'un rayon depuis le plan équatorial
   jusqu'à l'axe de rotation, à paramètre d'impact constant. La déviation doit
   varier continûment : rien de physique ne distingue l'axe, c'est un artefact
   de coordonnées.

   On mesure la DIFFÉRENCE SECONDE de la déviation le long du balayage. Une
   couture s'y voit comme un pic — c'est la signature d'une cassure, là où une
   courbe lisse rend une différence seconde du même ordre que le pas au carré. */
groupe("La déviation reste continue quand le rayon rase l'axe");
for(const a of SPINS){
  if(a === 0) continue;                        // sans rotation, pas d'axe privilégié
  const b = 6, D = 45, N = 90;
  const ang = [];
  for(let i = 0; i <= N; i++){
    const psi = (Math.PI/2) * i/N;             // 0 = équatorial, π/2 = au-dessus du pôle
    const o = [-D, b*Math.cos(psi), b*Math.sin(psi)];
    const d = KS.deviation(o, [1, 0, 0], a, { pas: 0.03, rMax: 70 });
    ang.push(d.avale ? NaN : d.angle);
  }
  const bons = ang.filter(v => !isNaN(v)).length;
  let pire = 0, ou = 0;
  for(let i = 1; i < N; i++){
    if(isNaN(ang[i-1]) || isNaN(ang[i]) || isNaN(ang[i+1])) continue;
    const d2 = Math.abs(ang[i+1] - 2*ang[i] + ang[i-1]);
    if(d2 > pire){ pire = d2; ou = i; }
  }
  ok("a* = " + (a/M).toFixed(2) + " — aucune cassure sur le balayage",
     pire < 2e-4, "< 2e-4 rad", pire.toExponential(2),
     bons + "/" + (N+1) + " rayons échappés, pic à ψ = "
     + ((90*ou/N).toFixed(1)) + "° de l'équateur");
}

// ═══════════════════════════════ 6. à spin nul, on retombe sur Schwarzschild
/* PREMIÈRE VERSION DE CE CONTRÔLE : FAUSSE, ET ELLE A ACCUSÉ LE MOTEUR.

   Je testais à b = 20 M contre α = 4M/b, avec deux pour cent de tolérance, et
   j'ai lu 18 % d'écart. Le moteur n'y était pour rien : à b = 20 M le
   développement au premier ordre ne vaut plus, et les ordres suivants pèsent
   quinze pour cent.

     ordre 1                 0,200000
     + ordre 2  15πM²/4b²    0,229452
     + ordre 3  128M³/3b³    0,234786
     mesuré                  0,236081

   La mesure tombe juste au-delà de l'ordre 3, exactement là où doit être la
   valeur convergée. C'était donc une confirmation, lue comme un échec.

   On teste maintenant là où la loi simple est vraie : à b = 1000 M, le second
   ordre pèse trois millièmes du premier, et un pour cent de tolérance veut
   enfin dire quelque chose. */
groupe("À rotation nulle, la déflexion classique est retrouvée");
{
  const b = 1000*M;
  const d = KS.deviation([-20000, b, 0], [1, 0, 0], 0,
                         { pas: 0.05, pasMax: 20, rMax: 25000, nMax: 200000 });
  const ordre1 = 4*M/b;
  const ordre2 = 15*Math.PI*M*M/(4*b*b);
  const ecart = Math.abs(d.angle - ordre1)/ordre1;
  ok("déflexion à b = 1000 M", ecart < 0.01, ordre1.toFixed(8) + " rad",
     d.angle.toFixed(8) + " rad  (écart " + (100*ecart).toFixed(3) + " %)",
     "le second ordre vaut " + ordre2.toExponential(2)
     + " rad ici, soit trois millièmes — la loi en 4M/b est donc mesurable telle quelle");
}

/* ═══════════════ 7. LA TÉTRADE : l'ombre a-t-elle la bonne taille ?

   La caméra du site est à neuf ou trente rayons, pas à l'infini. À cette
   distance f vaut encore un dixième, et prendre bêtement p_i = direction
   déformerait l'image d'autant. `momentDepuisVue` construit donc le moment à
   partir de ce qu'un observateur VOIT — et cette construction, je l'ai dérivée,
   ce qui suffit à la rendre suspecte.

   L'oracle est une formule fermée de manuel : pour un observateur statique à la
   distance r en Schwarzschild, le rayon angulaire de l'ombre vaut

       sin α = 3√3 M √(1 − 2M/r) / r

   On le mesure en cherchant par bissection l'angle qui sépare les rayons avalés
   de ceux qui s'échappent. Si la tétrade était fausse, l'ombre aurait la
   mauvaise taille — et ce serait exactement le genre d'erreur qui donne une
   image plausible que personne ne conteste. */
groupe("La tétrade tient : l'ombre a la taille que la théorie lui donne");
for(const D of [9, 20, 60]){
  // la caméra regarde le trou noir ; on ouvre l'angle jusqu'à rater la cible
  const cam = [-D, 0, 0];
  const avaleA = ang => {
    const d = [Math.cos(ang), Math.sin(ang), 0];
    return KS.photon(cam, d, 0, { observateur: true, pas: 0.02, rMax: 400, nMax: 40000 }).avale;
  };
  let lo = 0, hi = 0.9;                        // 0 = droit dessus, avalé
  if(!avaleA(lo)) { ok("caméra à " + D + " M — mise en place", false, "rayon central avalé", "il ne l'est pas"); continue; }
  for(let i = 0; i < 44; i++){
    const mid = 0.5*(lo + hi);
    if(avaleA(mid)) lo = mid; else hi = mid;
  }
  const mesure = 0.5*(lo + hi);
  const attendu = Math.asin(3*Math.sqrt(3)*M*Math.sqrt(1 - 2*M/D)/D);
  const ecart = Math.abs(mesure - attendu)/attendu;
  ok("caméra à " + D + " M — rayon angulaire de l'ombre", ecart < 3e-3,
     attendu.toFixed(6) + " rad", mesure.toFixed(6) + " rad  (écart "
     + (100*ecart).toFixed(3) + " %)",
     D === 9 ? "c'est la distance de travail du site, celle où l'erreur ferait le plus de dégâts" : undefined);
}

/* Et la preuve que cet oracle-là sait tomber : sans la tétrade, à neuf rayons,
   l'ombre doit sortir visiblement fausse. */
groupe("Et sans la tétrade, l'ombre est bien fausse");
{
  const D = 9, cam = [-D, 0, 0];
  const avaleA = ang => KS.photon(cam, [Math.cos(ang), Math.sin(ang), 0], 0,
                                  { pas: 0.02, rMax: 400, nMax: 40000 }).avale;
  let lo = 0, hi = 0.9;
  for(let i = 0; i < 44; i++){ const m = 0.5*(lo+hi); if(avaleA(m)) lo = m; else hi = m; }
  const sans = 0.5*(lo + hi);
  const attendu = Math.asin(3*Math.sqrt(3)*M*Math.sqrt(1 - 2*M/D)/D);
  const ecart = Math.abs(sans - attendu)/attendu;
  ok("l'écart sans tétrade est visible", ecart > 0.01, "> 1 %",
     (100*ecart).toFixed(2) + " %",
     "si ce contrôle passait au vert, c'est que la tétrade ne servirait à rien");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
