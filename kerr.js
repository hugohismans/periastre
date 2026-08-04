/* ============================================================================
   Géodésiques de Kerr — trou noir en rotation.

   Formulation hamiltonienne en coordonnées de Boyer-Lindquist. La métrique
   étant stationnaire et axisymétrique, p_t et p_φ sont conservés : seuls
   (r, θ, p_r, p_θ) évoluent, soit quatre équations au lieu de huit.

     2H = [P + Δ p_r² + p_θ²]/Σ − Q/(ΣΔ)
     P(θ) = a² sin²θ E² + L²/sin²θ
     Q(r) = (r²+a²)² E² − 4Mar EL + a² L²

   On a vérifié que cette forme redonne exactement l'équation radiale standard
     Σ²(dr/dλ)² = [E(r²+a²) − aL]² − Δ[(L−aE)² + 𝒬]
   avec 𝒬 la constante de Carter.

   Unités : G = c = 1 et M = 1/2, de sorte que r_s = 2M = 1 quand a = 0 — les
   mêmes unités que le reste du site. Le spin réduit est a* = a/M ∈ [0, 1].
   ============================================================================ */

(function(global){
"use strict";

const M = 0.5;

// --------------------------------------------------------------- géométrie
// Grandeurs métriques en (r, θ). `s` et `c` sont sin θ et cos θ.
function geo(r, s, c, a){
  return {
    S: r*r + a*a*c*c,                                  // Σ
    D: r*r - 2*M*r + a*a,                              // Δ
    A: (r*r + a*a)*(r*r + a*a) - a*a*(r*r - 2*M*r + a*a)*s*s,
  };
}

const horizon      = a => M + Math.sqrt(Math.max(0, M*M - a*a));
const ergosphere   = (a, c) => M + Math.sqrt(Math.max(0, M*M - a*a*c*c));

// ------------------------------------------------- valeurs de référence
// Orbites circulaires de photons dans le plan équatorial (Bardeen 1972).
// Signe − : prograde (dans le sens de rotation).  + : rétrograde.
const rPhoton = (a, prograde) =>
  2*M * (1 + Math.cos((2/3) * Math.acos((prograde ? -1 : 1) * a/M)));

// Paramètre d'impact critique associé. À a = 0 les deux valent √27·M.
const bPhoton = (a, prograde) => {
  const g = prograde ? -1 : 1;
  return g*a + 6*M*Math.cos((1/3) * Math.acos(g * a/M));
};

// Dernière orbite circulaire stable (Bardeen, Press & Teukolsky 1972).
function rIsco(a, prograde){
  const x = a/M;
  const Z1 = 1 + Math.cbrt(1 - x*x) * (Math.cbrt(1 + x) + Math.cbrt(1 - x));
  const Z2 = Math.sqrt(3*x*x + Z1*Z1);
  return M * (3 + Z2 + (prograde ? -1 : 1) * Math.sqrt((3 - Z1)*(3 + Z1 + 2*Z2)));
}

// ------------------------------------------------------------- équations
// Second membre du système hamiltonien. `y` = [r, θ, p_r, p_θ].
// Les dérivées de la métrique sont analytiques : en différences finies, le
// pas près de l'horizon devient trop mal conditionné.
function derive(y, E, L, a){
  const r = y[0], th = y[1], pr = y[2], pt = y[3];
  const s = Math.sin(th), c = Math.cos(th);
  const s2 = Math.max(s*s, 1e-12);
  const { S, D } = geo(r, s, c, a);
  const Dp = Math.abs(D) < 1e-12 ? 1e-12 * Math.sign(D || 1) : D;

  const P  = a*a*s2*E*E + L*L/s2;
  const Q  = (r*r + a*a)*(r*r + a*a)*E*E - 4*M*a*r*E*L + a*a*L*L;
  const U  = P + Dp*pr*pr + pt*pt;
  const V  = Q/Dp;

  // ∂/∂r
  const dD = 2*r - 2*M;
  const dQ = 4*r*(r*r + a*a)*E*E - 4*M*a*E*L;
  const dU_r = dD*pr*pr;
  const dV_r = (dQ*Dp - Q*dD) / (Dp*Dp);
  const dH_r = (dU_r - dV_r)/S - (U - V)*(2*r)/(S*S);

  // ∂/∂θ
  const dP_th = 2*a*a*s*c*E*E - 2*L*L*c/(s2*s);
  const dS_th = -2*a*a*c*s;
  const dH_th = dP_th/S - (U - V)*dS_th/(S*S);

  return [
    Dp*pr/S,                                       // dr/dλ
    pt/S,                                          // dθ/dλ
    -0.5*dH_r,                                     // dp_r/dλ
    -0.5*dH_th,                                    // dp_θ/dλ
  ];
}

// Vitesse azimutale, utile pour reconstruire la position cartésienne.
function dPhi(y, E, L, a){
  const r = y[0], s = Math.sin(y[1]), c = Math.cos(y[1]);
  const s2 = Math.max(s*s, 1e-12);
  const { S, D } = geo(r, s, c, a);
  const Dp = Math.abs(D) < 1e-12 ? 1e-12 : D;
  return L/(S*s2) + (2*M*a*r*E - a*a*L)/(S*Dp);
}

// Runge-Kutta 4 — le Verlet ne s'applique pas, le système n'est pas séparable.
function pas(y, phi, E, L, a, h){
  const k1 = derive(y, E, L, a);
  const y2 = y.map((v, i) => v + 0.5*h*k1[i]);
  const k2 = derive(y2, E, L, a);
  const y3 = y.map((v, i) => v + 0.5*h*k2[i]);
  const k3 = derive(y3, E, L, a);
  const y4 = y.map((v, i) => v + h*k3[i]);
  const k4 = derive(y4, E, L, a);
  const yn = y.map((v, i) => v + h*(k1[i] + 2*k2[i] + 2*k3[i] + k4[i])/6);
  const dp = (dPhi(y, E, L, a) + 2*dPhi(y2, E, L, a) + 2*dPhi(y3, E, L, a) + dPhi(y4, E, L, a))/6;
  return [yn, phi + h*dp];
}

// ------------------------------------------------------- rayon de caméra
// Repère orthonormé du ZAMO (observateur en corotation nulle). C'est le seul
// repère défini partout à l'extérieur de l'horizon : l'observateur statique,
// lui, n'existe plus dans l'ergosphère.
function rayon(r, th, a, n){
  const s = Math.sin(th), c = Math.cos(th);
  const { S, D, A } = geo(r, s, c, a);
  const alpha = Math.sqrt(S*D/A);        // lapse
  const omega = 2*M*a*r/A;               // entraînement des repères
  const L = n.phi * s * Math.sqrt(A/S);
  return {
    E: alpha + omega*L,
    L,
    y: [r, th, n.r * Math.sqrt(S/D), n.th * Math.sqrt(S)],
  };
}

// ------------------------------------------------------------ intégration
// Suit un rayon jusqu'à la capture ou la fuite. Rend le rayon d'approche
// minimal, dont on déduit l'orbite circulaire de photons.
function suit(E, L, y0, a, opts){
  const o = Object.assign({ rMax: 1e5, pasRel: 0.004, nMax: 300000 }, opts);
  let y = y0.slice(), phi = 0, rmin = Infinity;
  const rh = horizon(a);
  for(let i = 0; i < o.nMax; i++){
    const r = y[0];
    if(r < rmin) rmin = r;
    if(r < rh*1.0005) return { capture:true, rmin, y, phi };
    if(r > o.rMax)    return { capture:false, rmin, y, phi };
    const h = Math.max(1e-4, (r - rh)*o.pasRel + r*o.pasRel);
    [y, phi] = pas(y, phi, E, L, a, h);
    if(!isFinite(y[0])) return { capture:true, rmin, y, phi, instable:true };
  }
  return { capture:false, rmin, y, phi, epuise:true };
}

// Photon équatorial venu de l'infini, de paramètre d'impact b = L/E.
// b > 0 : prograde (il tourne dans le sens du trou noir).
function equatorial(b, a, r0 = 4000){
  const E = 1, L = b;
  // à grande distance l'espace est presque plat : p_r ≈ −E, p_θ = 0
  const th = Math.PI/2;
  const { S, D } = geo(r0, 1, 0, a);
  const Q = (r0*r0 + a*a)*(r0*r0 + a*a)*E*E - 4*M*a*r0*E*L + a*a*L*L;
  const P = a*a*E*E + L*L;
  // p_r depuis la condition de genre nul : Δ²p_r² = Q − Δ(P + p_θ²)
  const pr2 = (Q - D*P)/(D*D);
  return { E, L, y: [r0, th, -Math.sqrt(Math.max(pr2, 0)), 0] };
}

// Paramètre d'impact critique mesuré : frontière capture / fuite.
// On bissecte sur le MODULE de b : dans les deux sens, un petit module est
// capturé et un grand s'échappe. Bissecter sur b signé inverse l'orientation
// du côté rétrograde, où b est négatif.
function bCritique(a, prograde){
  const signe = prograde ? 1 : -1;
  let bas = 0.2, haut = 12;                 // bas capturé, haut échappé
  for(let i = 0; i < 46; i++){
    const m = (bas + haut)/2;
    const { E, L, y } = equatorial(signe*m, a);
    if(suit(E, L, y, a).capture) bas = m; else haut = m;
  }
  return signe * (bas + haut)/2;
}

global.KERR = {
  M, geo, horizon, ergosphere,
  rPhoton, bPhoton, rIsco,
  derive, pas, rayon, suit, equatorial, bCritique,
};

})(window);
