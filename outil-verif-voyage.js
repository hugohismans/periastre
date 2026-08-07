/* ============================================================================
   LE VOL À 1 g, ÉPROUVÉ HORS NAVIGATEUR

       node outil-verif-voyage.js

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL N'EXISTAIT PAS, ET POURQUOI IL EXISTE MAINTENANT

   `voyage1g.js` calculait les durées d'un trajet depuis des semaines sans le
   moindre outil dédié — `node tout.js` le signalait à chaque exécution, dans la
   liste de ce qui n'est gardé par personne.

   Ça n'était pas urgent tant que ces durées ne servaient qu'à un panneau qu'on
   lit à l'arrivée. Ça le devient le jour où l'on affiche une VITESSE EN VOL :
   un chiffre qui bouge à l'écran pendant qu'on voyage sera cru, et un chiffre
   faux qui bouge est pire qu'un chiffre faux immobile.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI

   Règle 3 du dépôt : un contrôle tire sa vérité d'ailleurs que de ce qu'il
   contrôle. Quatre sources indépendantes, et aucune n'est une valeur recopiée :

   1. **Les différences finies.** ds/dτ doit valoir c·sinh η — la vitesse propre —
      et dt/dτ doit valoir γ. C'est le contrôle qui attrape une erreur de
      formule, parce qu'il ne connaît que s(τ) et t(τ) et redérive le reste.
   2. **`trajet()`, écrit séparément.** Au demi-tour, `etat()` doit retrouver la
      vitesse et le facteur de Lorentz que `trajet()` calcule par un autre
      chemin.
   3. **`enChemin()`, écrit séparément aussi.** Il donne τ en fonction de la
      distance ; `etat()` donne la distance en fonction de τ. Les composer doit
      rendre l'identité.
   4. **La limite newtonienne.** Sur un trajet court, la relativité doit
      disparaître : s → ½aτ², v → aτ, et les deux horloges doivent se rejoindre.
      Une formule relativiste qui ne redonne pas Newton en bas est fausse.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE

   En remplaçant `cosh` par `sinh` dans `s(τ)` : les différences finies passent
   de 1e-9 à 100 % d'écart, la composition avec `enChemin` casse, et la limite
   newtonienne rend 0 au lieu de ½aτ². Trois familles crient, pas une seule.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const faux = {};
new Function("window", fs.readFileSync(path.join(__dirname, "voyage1g.js"), "utf8"))(faux);
const V = faux.VOYAGE;
const { C, G_N, AL, AN, UA } = V;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
const rel = (a, b) => Math.abs(b) < 1e-30 ? Math.abs(a) : Math.abs(a - b)/Math.abs(b);

/* Des trajets qui couvrent tous les régimes, du pas-du-tout-relativiste au
   ridiculement relativiste. Un contrôle qui ne teste qu'un régime ne dit rien
   des autres — et c'est justement aux deux extrêmes que les formules cassent. */
const TRAJETS = [
  { nom: "1 000 km",            d: 1e6 },
  { nom: "la Lune",             d: 3.84e8 },
  { nom: "Mars au plus près",   d: 7.8e10 },
  { nom: "120 UA, l'héliopause", d: 120*UA },
  { nom: "Proxima, 4,24 al",    d: 4.24*AL },
  { nom: "le centre galactique", d: 27000*AL },
  { nom: "Andromède",           d: 2.5e6*AL },
];

console.log("\n  LE VOL À 1 g");
console.log("  ════════════");

// ───────────────────────────────────────────────────── 1. les deux extrémités
groupe("On part à l'arrêt et l'on arrive à l'arrêt");
for(const tr of TRAJETS){
  const a = V.etat(tr.d, 0), b = V.etat(tr.d, V.etat(tr.d, 0).tauTotal);
  ok(tr.nom + " — immobile au départ et à l'arrivée",
     a.beta < 1e-12 && b.beta < 1e-12 && a.gamma < 1 + 1e-12 && b.gamma < 1 + 1e-12,
     "β = 0", "départ " + a.beta.toExponential(1) + ", arrivée " + b.beta.toExponential(1));
}
{
  const tr = TRAJETS[5];
  const f = V.etat(tr.d, V.etat(tr.d, 0).tauTotal);
  ok("on arrive bien AU BOUT, pas avant ni après", rel(f.s, tr.d) < 1e-9,
     tr.d.toExponential(6), f.s.toExponential(6),
     "un trajet qui ne finit pas où il devait invalide toute distance affichée");
}

// ─────────────────────────────────── 2. le demi-tour, contre une autre formule
groupe("Au demi-tour, `etat()` doit retrouver `trajet()`");
for(const tr of TRAJETS){
  const t = V.trajet(tr.d);
  const e = V.etat(tr.d, t.tau/2);
  ok(tr.nom + " — même vitesse et même facteur de Lorentz",
     rel(e.beta, t.vmax) < 1e-9 && rel(e.gamma, t.gamma) < 1e-9,
     "β = " + t.vmax.toFixed(12), "β = " + e.beta.toFixed(12),
     "γ = " + e.gamma.toExponential(4));
}

// ─────────────────────────────────────────── 3. la symétrie des deux moitiés
groupe("Freiner coûte exactement ce qu'a coûté d'accélérer");
for(const tr of TRAJETS){
  const T = V.etat(tr.d, 0).tauTotal;
  let pire = 0;
  for(const f of [0.1, 0.25, 0.4, 0.5]){
    const a = V.etat(tr.d, T*f), b = V.etat(tr.d, T*(1-f));
    pire = Math.max(pire, rel(a.s + b.s, tr.d), rel(a.beta, b.beta));
  }
  ok(tr.nom + " — la trajectoire est son propre miroir", pire < 1e-9,
     "< 1e-9", pire.toExponential(1));
}

// ──────────────────────── 4. les dérivées, contre des différences finies
/* Le contrôle décisif. Il ne connaît que s(τ) et t(τ), et redérive tout le
   reste sans jamais lire ni η ni β. Une erreur de formule y est visible même
   quand toutes les autres vérifications passent. */
groupe("Les dérivées redonnent la vitesse propre et la dilatation");
for(const tr of TRAJETS){
  const T = V.etat(tr.d, 0).tauTotal;
  let pireV = 0, pireT = 0;
  for(const f of [0.05, 0.2, 0.35, 0.65, 0.8, 0.95]){
    const tau = T*f, h = T*1e-6;
    const m = V.etat(tr.d, tau - h), p = V.etat(tr.d, tau + h), c = V.etat(tr.d, tau);
    const dsdtau = (p.s - m.s)/(2*h);          // doit valoir c·sinh η
    const dtdtau = (p.t - m.t)/(2*h);          // doit valoir γ
    pireV = Math.max(pireV, rel(dsdtau, C*Math.sinh(c.eta)));
    pireT = Math.max(pireT, rel(dtdtau, c.gamma));
  }
  ok(tr.nom + " — ds/dτ = c·sinh η  et  dt/dτ = γ", pireV < 1e-5 && pireT < 1e-5,
     "< 1e-5", "vitesse " + pireV.toExponential(1) + ", horloge " + pireT.toExponential(1));
}

// ───────────────────────────── 5. composition avec `enChemin`, écrit à part
groupe("`etat()` et `enChemin()` sont réciproques");
for(const tr of TRAJETS){
  const T = V.etat(tr.d, 0).tauTotal;
  let pire = 0;
  for(const f of [0.15, 0.5, 0.85]){
    const e = V.etat(tr.d, T*f);
    const r = V.enChemin(tr.d, e.s);
    pire = Math.max(pire, rel(r.tau, e.tau), rel(r.t, e.t));
  }
  ok(tr.nom + " — aller par la distance et revenir par le temps", pire < 1e-6,
     "< 1e-6", pire.toExponential(1),
     "deux fonctions écrites séparément : si l'une ment, la boucle ne se referme pas");
}

// ────────────────────────────────────────────── 6. la limite newtonienne
/* En bas, la relativité doit DISPARAÎTRE. C'est le contrôle qui ne dépend
   d'aucune autre partie du module : il compare à la physique du lycée. */
groupe("Sur un trajet court, on doit retrouver Newton");
{
  const d = 1e6;                                   // mille kilomètres
  const T = V.etat(d, 0).tauTotal;
  const tau = T*0.3;
  const e = V.etat(d, tau);
  const sNewton = 0.5*G_N*tau*tau;
  const vNewton = G_N*tau;
  ok("la distance suit ½aτ²", rel(e.s, sNewton) < 1e-9, sNewton.toFixed(6), e.s.toFixed(6));
  ok("la vitesse suit aτ", rel(e.v, vNewton) < 1e-9, vNewton.toFixed(6), e.v.toFixed(6));

  /* Ces deux-ci exigeaient d'abord que la dilatation soit NULLE, et ils
     échouaient — à juste titre. À trois kilomètres par seconde elle vaut
     réellement cinq cent-milliardièmes : elle est négligeable, pas absente.
     Un contrôle qui demande zéro là où la physique donne 5·10⁻¹¹ ne teste pas
     la précision, il teste ma capacité à écrire un seuil.

     On vérifie donc la bonne chose : que l'écart existe ET qu'il vaut ce que
     Newton prédit, γ − 1 → β²/2. */
  ok("les deux horloges se rejoignent à neuf chiffres", rel(e.t, e.tau) < 1e-9,
     "< 1e-9 d'écart relatif", rel(e.t, e.tau).toExponential(2),
     "soit " + (e.t - e.tau).toExponential(2) + " s sur " + e.tau.toFixed(1) + " s");
  ok("et le peu qui reste vaut exactement β²/2",
     rel(e.gMoins1, e.beta*e.beta/2) < 1e-9,
     (e.beta*e.beta/2).toExponential(9), e.gMoins1.toExponential(9),
     "la limite newtonienne du facteur de Lorentz, redérivée et non recopiée");
  ok("`gMoins1` est bien la version qui ne s'annule pas",
     rel(e.gMoins1, e.gamma - 1) < 1e-5 && e.gMoins1 !== e.gamma - 1,
     "d'accord avec γ−1 sans lui être identique",
     "écart " + rel(e.gMoins1, e.gamma - 1).toExponential(1),
     "cet écart EST la précision que la soustraction naïve a perdue");
}

// ───────────────────────────────────── 7. le régime où tout devient absurde
groupe("Et à l'autre bout, le régime ultra-relativiste");
{
  const d = 27000*AL;
  const t = V.trajet(d);
  const mi = V.etat(d, t.tau/2);
  ok("au centre galactique, β frôle 1 sans l'atteindre",
     mi.beta < 1 && 1 - mi.beta < 1e-8, "1 − β < 1e-8", (1 - mi.beta).toExponential(2));
  ok("le facteur de Lorentz dépasse mille", mi.gamma > 1000, "> 1000",
     Math.round(mi.gamma));
  /* Le fait qui vaut le voyage, et il se DÉRIVE ici plutôt que de se recopier :
     le temps à bord grandit comme le logarithme de la distance. */
  const court = V.trajet(27000*AL).tau/AN, loin = V.trajet(2.5e6*AL).tau/AN;
  ok("multiplier la distance par 92 n'ajoute qu'une poignée d'années à bord",
     loin - court > 5 && loin - court < 12, "entre 5 et 12 ans",
     (loin - court).toFixed(1) + " ans   (" + court.toFixed(1) + " → " + loin.toFixed(1) + ")",
     "c'est la croissance logarithmique du temps propre, calculée et non recopiée");
}

// ───────────────────────────────────────────── 8. la monotonie, bêtement
groupe("Rien ne recule et rien ne remonte le temps");
for(const tr of TRAJETS){
  const T = V.etat(tr.d, 0).tauTotal;
  let bon = true, sAv = -1, tAv = -1;
  for(let i = 0; i <= 200; i++){
    const e = V.etat(tr.d, T*i/200);
    if(e.s < sAv - 1e-6 || e.t < tAv - 1e-6) bon = false;
    sAv = e.s; tAv = e.t;
  }
  ok(tr.nom + " — distance et horloge croissent", bon, "toujours",
     bon ? "201 points" : "une inversion");
}

// ───────────────────────────────────────────────── 9. les bornes, sans piège
groupe("Hors du trajet, on ne rend pas n'importe quoi");
{
  const d = 4.24*AL, T = V.etat(d, 0).tauTotal;
  const avant = V.etat(d, -500), apres = V.etat(d, T*3);
  ok("un temps négatif est ramené au départ", avant.s === 0 && avant.tau === 0,
     "s = 0", avant.s);
  ok("un temps au-delà est ramené à l'arrivée", rel(apres.s, d) < 1e-9 && rel(apres.tau, T) < 1e-12,
     "s = d", apres.s.toExponential(4),
     "l'animation peut dépasser d'une image : elle ne doit pas faire sortir le vaisseau");
  ok("les deux phases sont nommées",
     V.etat(d, T*0.2).phase === "acceleration" && V.etat(d, T*0.8).phase === "freinage",
     "acceleration puis freinage",
     V.etat(d, T*0.2).phase + " puis " + V.etat(d, T*0.8).phase);
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
