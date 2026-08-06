/* ============================================================================
   GÉODÉSIQUES DE KERR EN COORDONNÉES DE KERR-SCHILD CARTÉSIENNES.

   Pourquoi ce fichier existe : Boyer-Lindquist est singulier sur l'axe polaire
   PAR CONSTRUCTION. dφ/dλ ~ L/(Σ sin²θ) y diverge, et φ doit basculer de π en
   un point. Aucun pas fini ne résout ça — d'où la fine couture verticale que le
   site déclarait comme limite assumée, et qu'Hugo a lue comme un bug malgré la
   déclaration. Une déclaration qu'il faut lire ne répare pas ce qu'on voit.

   Kerr-Schild n'a aucune singularité de coordonnées hors de l'anneau r = 0,
   z = 0, qui est physique. En prime, ces coordonnées traversent l'horizon : un
   rayon n'a plus à s'arrêter juste avant, la terminaison redevient géométrique.

   ---------------------------------------------------------------------------
   LA MÉTRIQUE, ET POURQUOI ELLE EST SI COMMODE

     g_μν = η_μν + f k_μ k_ν          g^μν = η^μν − f k^μ k^ν

   L'inverse est aussi simple que la métrique — c'est la propriété qui définit la
   forme de Kerr-Schild, et elle vient de ce que k est nul pour η ET pour g.

     f    = 2 M r³ / (r⁴ + a² z²)
     k_μ  = ( 1, (r x + a y)/(r²+a²), (r y − a x)/(r²+a²), z/r )

   et r est la racine positive de

     r⁴ − (ρ² − a²) r² − a² z² = 0,        ρ² = x² + y² + z²

   soit r² = ½[ (ρ²−a²) + √((ρ²−a²)² + 4a²z²) ]. C'est EXACTEMENT le rayon que
   `versBL()` calcule déjà dans le nuanceur — la moitié de la transformée
   existait donc avant ce fichier.

   ---------------------------------------------------------------------------
   CONVENTION D'AXE — À LIRE AVANT DE BRANCHER QUOI QUE CE SOIT

   Ici, l'axe de rotation est **z**, comme dans toute la littérature.

   Le site, lui, met le haut en **y** : `versBL` lit `p.y` comme composante
   axiale et prend (x, z) pour le plan équatorial. Le passage se fait donc au
   branchement, et nulle part ailleurs :

       physique (x, y, z)  ←→  site (x, z, y)

   Mélanger les deux conventions à l'intérieur du module serait la meilleure
   façon de produire une image plausible et fausse.

   ---------------------------------------------------------------------------
   UNITÉS

   G = c = 1 et M = 1/2, de sorte que r_s = 2M = 1 — les mêmes unités que
   `kerr.js` et que le reste du site. Le spin réduit est a* = a/M ∈ [0, 1], donc
   a ∈ [0, 0.5].

   ---------------------------------------------------------------------------
   CE QUI EST DANGEREUX ICI

   Les dérivées analytiques. Une erreur de signe dans ∂r/∂xⁱ ne plante pas : elle
   rend une image plausible et fausse, et personne ne la voit. C'est pour ça que
   `outil-verif-kerrschild.js` les compare à des différences finies AVANT que
   quoi que ce soit ne parte dans le nuanceur.
   ============================================================================ */

(function(global){
"use strict";

const M = 0.5;

/* ---------------------------------------------------------------- le rayon

   Racine positive de r⁴ − (ρ²−a²)r² − a²z² = 0.

   On passe par la forme √ pour éviter l'annulation catastrophique quand
   ρ² ≫ a² : (ρ²−a²) y domine, et la soustraction directe perdrait les chiffres
   significatifs de a²z². */
function rayon(p, a){
  const x = p[0], y = p[1], z = p[2];
  const rho2 = x*x + y*y + z*z;
  const k = rho2 - a*a;
  const r2 = 0.5 * (k + Math.sqrt(k*k + 4*a*a*z*z));
  return Math.sqrt(Math.max(r2, 1e-300));
}

/* Le gradient du rayon, par dérivation implicite.

     F = r⁴ − (ρ²−a²)r² − a²z²  = 0
     ∂F/∂r = 4r³ − 2r(ρ²−a²)          ∂F/∂x = −2x r²
                                       ∂F/∂z = −2z r² − 2a²z

   et ∂r/∂xⁱ = −(∂F/∂xⁱ)/(∂F/∂r). En remplaçant ρ²−a² par r² − a²z²/r², le
   dénominateur se réduit à (r⁴ + a²z²)/r² — le même N que celui de f, ce qui
   n'est pas un hasard : les deux viennent de la même géométrie sphéroïdale.

     ∂r/∂x = x r³ / N       ∂r/∂y = y r³ / N       ∂r/∂z = z r (r²+a²) / N

   Contrôle de tête, à a = 0 : N = r⁴, donc ∂r/∂x = x/r et ∂r/∂z = z/r. C'est
   bien le gradient du rayon sphérique. */
function gradRayon(p, a, r){
  const z = p[2];
  const rr = r !== undefined ? r : rayon(p, a);
  const N = rr*rr*rr*rr + a*a*z*z;
  const inv = 1 / Math.max(N, 1e-300);
  return [ p[0]*rr*rr*rr*inv, p[1]*rr*rr*rr*inv, z*rr*(rr*rr + a*a)*inv ];
}

// ------------------------------------------------------------- f et son gradient
function facteur(p, a, r){
  const rr = r !== undefined ? r : rayon(p, a);
  const N = rr*rr*rr*rr + a*a*p[2]*p[2];
  return 2*M*rr*rr*rr / Math.max(N, 1e-300);
}

/* ∂_i f, avec f = 2M r³/N et N = r⁴ + a²z² :

     ∂_i f = 2M [ 3r² (∂_i r) N − r³ (4r³ ∂_i r + 2a² z δ_iz) ] / N²          */
function gradFacteur(p, a, r, dr){
  const rr = r !== undefined ? r : rayon(p, a);
  const g  = dr || gradRayon(p, a, rr);
  const z  = p[2];
  const N  = rr*rr*rr*rr + a*a*z*z;
  const N2 = Math.max(N*N, 1e-300);
  const r2 = rr*rr, r3 = r2*rr;
  const out = [0, 0, 0];
  for(let i = 0; i < 3; i++){
    const dN = 4*r3*g[i] + (i === 2 ? 2*a*a*z : 0);
    out[i] = 2*M * (3*r2*g[i]*N - r3*dN) / N2;
  }
  return out;
}

/* ------------------------------------------------------------ le vecteur nul

   k_μ = (1, (rx+ay)/(r²+a²), (ry−ax)/(r²+a²), z/r).

   Sa partie spatiale est de norme EUCLIDIENNE exactement 1 — c'est ce qui le
   rend nul pour η, et c'est l'identité sphéroïdale

     (x²+y²)/(r²+a²) + z²/r² = 1

   qui le garantit. `outil-verif-kerrschild.js` la vérifie plutôt que de la
   croire : si elle se casse, tout le reste est faux en silence. */
function vecteurK(p, a, r){
  const rr = r !== undefined ? r : rayon(p, a);
  const d = rr*rr + a*a;
  return [ (rr*p[0] + a*p[1]) / d, (rr*p[1] - a*p[0]) / d, p[2] / Math.max(rr, 1e-300) ];
}

/* ∂_i k_j, rendu comme un tableau de 3 lignes : `out[i][j]` = ∂k_j/∂xⁱ.

   Quotients ordinaires. Le seul piège est de ne pas oublier que r dépend de
   TOUTES les coordonnées : les δ de Kronecker ne suffisent pas, il y a partout
   un terme en ∂_i r. */
function gradK(p, a, r, dr){
  const rr = r !== undefined ? r : rayon(p, a);
  const g  = dr || gradRayon(p, a, rr);
  const x = p[0], y = p[1], z = p[2];
  const d  = rr*rr + a*a, d2 = d*d;
  const kx = rr*x + a*y, ky = rr*y - a*x;
  const ri = 1 / Math.max(rr, 1e-300);

  const out = [[0,0,0], [0,0,0], [0,0,0]];
  for(let i = 0; i < 3; i++){
    const dr_i = g[i];
    const dkx = (dr_i*x + (i === 0 ? rr : 0) + (i === 1 ? a : 0));
    const dky = (dr_i*y + (i === 1 ? rr : 0) - (i === 0 ? a : 0));
    out[i][0] = (dkx*d - kx*(2*rr*dr_i)) / d2;
    out[i][1] = (dky*d - ky*(2*rr*dr_i)) / d2;
    out[i][2] = ((i === 2 ? 1 : 0)*rr - z*dr_i) * ri * ri;
  }
  return out;
}

/* -------------------------------------------------------------- la dynamique

   Signature (−,+,+,+). k_t = 1, donc k^t = η^tt k_t = −1, constant : c'est ce
   qui fait disparaître un terme entier des équations du mouvement.

     H     = ½ g^μν p_μ p_ν = ½ [ −p_t² + |p⃗|² − f (k·p)² ]
     (k·p) = k^μ p_μ = −p_t + k⃗·p⃗

   d'où

     dxⁱ/dλ = ∂H/∂p_i = p_i − f (k·p) k_i
     dp_i/dλ = −∂H/∂xⁱ = ½ (∂_i f)(k·p)² + f (k·p) Σ_j (∂_i k_j) p_j

   `p_t` ne bouge pas — la métrique ne dépend pas de t — et c'est l'un des
   invariants que le contrôle surveille. */
function contracteKP(kv, mom, pt){ return -pt + kv[0]*mom[0] + kv[1]*mom[1] + kv[2]*mom[2]; }

// L'état est [x, y, z, p_x, p_y, p_z] ; `pt` est porté à part, il est constant.
function second(etat, a, pt){
  const p = [etat[0], etat[1], etat[2]];
  const m = [etat[3], etat[4], etat[5]];
  const r  = rayon(p, a);
  const dr = gradRayon(p, a, r);
  const f  = facteur(p, a, r);
  const df = gradFacteur(p, a, r, dr);
  const kv = vecteurK(p, a, r);
  const dk = gradK(p, a, r, dr);
  const kp = contracteKP(kv, m, pt);

  const out = new Array(6);
  for(let i = 0; i < 3; i++) out[i] = m[i] - f*kp*kv[i];
  for(let i = 0; i < 3; i++){
    let s = 0;
    for(let j = 0; j < 3; j++) s += dk[i][j]*m[j];
    out[3+i] = 0.5*df[i]*kp*kp + f*kp*s;
  }
  return out;
}

/* La condition de nullité, qu'on veut voir rester à zéro tout du long.

   On la rend en ABSOLU et non en relatif : au loin |p⃗|² vaut 1 et le rapport
   n'apprend rien, tandis que près de l'horizon f explose et un relatif
   diviserait par une quantité qui bouge. */
function nullite(etat, a, pt){
  const p = [etat[0], etat[1], etat[2]];
  const m = [etat[3], etat[4], etat[5]];
  const r = rayon(p, a);
  const f = facteur(p, a, r);
  const kv = vecteurK(p, a, r);
  const kp = contracteKP(kv, m, pt);
  return -pt*pt + (m[0]*m[0] + m[1]*m[1] + m[2]*m[2]) - f*kp*kp;
}

/* `p_t` tel que le rayon soit NUL, la partie spatiale étant donnée.

   La condition de nullité est un trinôme en p_t :

     (1+f) p_t² − 2 f A p_t − |p⃗|² + f A² = 0,      A = k⃗·p⃗

   dont le discriminant vaut |p⃗|² + f(|p⃗|² − A²), positif puisque |k⃗| = 1. On
   prend la racine qui donne p_t < 0, c'est-à-dire l'énergie E = −p_t positive :
   c'est le rayon dirigé vers le futur. */
function ptNul(p, mom, a){
  const r = rayon(p, a);
  const f = facteur(p, a, r);
  const kv = vecteurK(p, a, r);
  const A = kv[0]*mom[0] + kv[1]*mom[1] + kv[2]*mom[2];
  const p2 = mom[0]*mom[0] + mom[1]*mom[1] + mom[2]*mom[2];
  const disc = Math.max(p2 + f*(p2 - A*A), 0);
  return (f*A - Math.sqrt(disc)) / (1 + f);
}

/* ------------------------------- de la direction VISÉE au moment du photon

   La caméra n'est pas à l'infini. À neuf rayons de Schwarzschild, f vaut encore
   un dixième : prendre bêtement p_i = direction déformerait l'image d'autant, et
   l'ombre changerait de taille. L'ancienne branche construisait pour ça une
   tétrade de ZAMO ; il en faut l'équivalent ici.

   PREMIÈRE VERSION, FAUSSE, ET CE QU'ELLE M'A APPRIS.

   J'avais construit la tétrade de l'observateur NORMAL — celui du feuilletage
   t = const, dont le 3+1 s'écrit joliment. Le contrôle a rendu 11,6 % d'écart
   sur la taille de l'ombre, là où l'absence de tétrade n'en donnait que 6,2 % :
   j'avais rendu les choses pires.

   La raison est physique, pas algébrique. **En Kerr-Schild, l'observateur normal
   TOMBE** — ces coordonnées traversent l'horizon, et leur feuilletage est celui
   d'un observateur en chute libre radiale (β^i = f k_i/(1+f) ≠ 0). Ce qu'il voit
   est aberré. Le site, lui, veut la vue d'une caméra qui ne tombe pas.

   ---------------------------------------------------------------------------
   L'OBSERVATEUR STATIQUE, QUI EST CELUI QU'ON VEUT

   u^μ ∝ ∂_t, normalisé par g_tt (u^t)² = −1, donc u^t = 1/√(1−f). Il existe
   tant que f < 1 — et f = 1 est exactement l'ergosurface, que la caméra
   n'approche jamais.

   Un vecteur spatial pour LUI n'a pas de composante temporelle nulle : la
   condition u·v = 0 impose v^t = f (k·v⃗)/(1−f). En reportant, sa norme vaut

       |v|² = v⃗·v⃗ + (f/(1−f)) (k·v⃗)²

   soit la métrique spatiale h = δ + (f/(1−f)) k k. Contrôle de tête : dans la
   direction radiale elle vaut 1/(1−f) = 1/(1−2M/r), qui est exactement le
   facteur d'étirement radial de Schwarzschild. C'est bon signe.

   |k⃗| valant 1, sa racine inverse est fermée :

       h^{-1/2} = δ + (√(1−f) − 1) k k

   d'où la direction contravariante v⃗ = h^{-1/2} · vue, puis

       p_i = v⃗_i + k_i [ f/√(1−f) + f (k·v⃗)/(1−f) ]

   le premier crochet venant de u_i, le second de la composante temporelle de v.

   JE N'AI RIEN DÉRIVÉ SANS LE FAIRE JUGER. `outil-verif-kerrschild.js` compare
   le rayon angulaire de l'ombre, vu d'une caméra à distance finie, à la formule
   fermée sin α = 3√3 M √(1 − 2M/r) / r — qui suppose précisément un observateur
   statique. */
function momentDepuisVue(camera, vue, a){
  const n = Math.hypot(vue[0], vue[1], vue[2]) || 1;
  const v = [vue[0]/n, vue[1]/n, vue[2]/n];
  const r = rayon(camera, a);
  const f = Math.min(facteur(camera, a, r), 0.999999);   // hors ergosphère
  const kv = vecteurK(camera, a, r);
  const kdv = kv[0]*v[0] + kv[1]*v[1] + kv[2]*v[2];

  // v⃗ = h^{-1/2} · vue, la direction contravariante h-unitaire
  const c = Math.sqrt(1 - f) - 1;
  const w = [ v[0] + c*kdv*kv[0], v[1] + c*kdv*kv[1], v[2] + c*kdv*kv[2] ];
  const kdw = kv[0]*w[0] + kv[1]*w[1] + kv[2]*w[2];

  const lambda = f/Math.sqrt(1 - f) + f*kdw/(1 - f);
  return [ w[0] + lambda*kv[0], w[1] + lambda*kv[1], w[2] + lambda*kv[2] ];
}

/* --------------------------------------------------------------- le lanceur

   Un rayon part d'une origine avec une direction. Loin du trou noir l'espace
   est plat, donc la direction unitaire fait directement les p_i covariants — on
   se dispense d'une tétrade, et c'est l'autre confort de Kerr-Schild.

   Le pas s'adapte : petit près de l'horizon où la courbure varie vite, large au
   loin où il ne se passe rien. `rMax` arrête le rayon qui s'échappe, `rMin` celui
   qui est avalé. Aucun des deux n'est une marge numérique — l'horizon n'est plus
   un endroit dangereux pour ces coordonnées. */
function photon(origine, direction, a, options){
  const o = options || {};
  const rMax   = o.rMax   !== undefined ? o.rMax   : 60;
  const nMax   = o.nMax   !== undefined ? o.nMax   : 20000;
  const pas    = o.pas    !== undefined ? o.pas    : 0.02;
  /* Le plafond du pas. Il vaut 0,35 pour le rendu, où le rayon ne s'éloigne
     jamais beaucoup — mais un contrôle de déflexion doit partir à vingt mille
     rayons de là, et l'y traîner par bonds de 0,35 demanderait soixante mille
     pas pour ne rien mesurer. C'est un réglage, pas une constante. */
  const pasMax = o.pasMax !== undefined ? o.pasMax : 0.35;
  const garde  = !!o.trace;

  const n = Math.hypot(direction[0], direction[1], direction[2]) || 1;
  let dir = [direction[0]/n, direction[1]/n, direction[2]/n];

  /* `observateur` dit que la direction est celle qu'un observateur VOIT depuis
     l'origine, et non un moment covariant tout fait. C'est ce qu'il faut pour
     une caméra à distance finie ; le rendu s'en sert toujours.

     Les contrôles de champ lointain, eux, s'en passent : à quarante-cinq rayons
     f vaut deux centièmes et les deux lectures coïncident. */
  if(o.observateur) dir = momentDepuisVue(origine, dir, a);

  const pt = ptNul(origine, dir, a);

  let e = [origine[0], origine[1], origine[2], dir[0], dir[1], dir[2]];
  const rh = M + Math.sqrt(Math.max(M*M - a*a, 0));
  const trace = garde ? [e.slice()] : null;
  let i = 0, avale = false, derive = 0;

  for(; i < nMax; i++){
    const r = rayon([e[0], e[1], e[2]], a);
    if(r <= rh*0.985){ avale = true; break; }        // dedans, et sans marge
    if(r > rMax && (e[0]*e[3] + e[1]*e[4] + e[2]*e[5]) > 0) break;   // il s'en va

    // Pas proportionnel à la distance à l'horizon, borné des deux côtés.
    const h = Math.min(Math.max(pas * (r - rh) + pas*0.25, pas*0.1), pasMax);

    const k1 = second(e, a, pt);
    const e2 = e.map((v, j) => v + 0.5*h*k1[j]);
    const k2 = second(e2, a, pt);
    const e3 = e.map((v, j) => v + 0.5*h*k2[j]);
    const k3 = second(e3, a, pt);
    const e4 = e.map((v, j) => v + h*k3[j]);
    const k4 = second(e4, a, pt);
    e = e.map((v, j) => v + h*(k1[j] + 2*k2[j] + 2*k3[j] + k4[j])/6);

    const nu = Math.abs(nullite(e, a, pt));
    if(nu > derive) derive = nu;
    if(garde) trace.push(e.slice());
  }

  return { etat: e, pt, avale, pas: i, deriveNullite: derive, trace,
           position: [e[0], e[1], e[2]], direction: [e[3], e[4], e[5]] };
}

/* La déviation totale d'un rayon, en radians : l'angle entre la direction de
   départ et celle d'arrivée. C'est la grandeur que le banc compare, et c'est
   elle qui doit varier CONTINÛMENT quand on rase l'axe de rotation. */
function deviation(origine, direction, a, options){
  const t = photon(origine, direction, a, options);
  if(t.avale) return { avale: true, angle: NaN, sortie: t };
  const n0 = Math.hypot(direction[0], direction[1], direction[2]) || 1;
  const d0 = direction.map(v => v/n0);
  const d1 = t.direction;
  const n1 = Math.hypot(d1[0], d1[1], d1[2]) || 1;
  const c = (d0[0]*d1[0] + d0[1]*d1[1] + d0[2]*d1[2]) / n1;
  return { avale: false, angle: Math.acos(Math.min(1, Math.max(-1, c))), sortie: t };
}

const horizon = a => M + Math.sqrt(Math.max(0, M*M - a*a));

global.KERRSCHILD = {
  M, horizon,
  // géométrie
  rayon, gradRayon, facteur, gradFacteur, vecteurK, gradK,
  // dynamique
  second, nullite, ptNul, contracteKP, momentDepuisVue,
  // usage
  photon, deviation,
};

})(typeof window !== "undefined" ? window : globalThis);
