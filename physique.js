/* ============================================================================
   La physique, extraite du bloc.

   Elle vivait au milieu de trois mille cinq cents lignes en portée globale,
   mêlée au rendu, à l'interface et au contenu. Rien ne l'y obligeait : elle ne
   touche ni au document, ni à WebGL, ni à quoi que ce soit d'un navigateur.
   Elle n'en sortait pas parce que la sortir n'a aucun effet visible — et c'est
   exactement pourquoi il fallait le décider plutôt que l'attendre.

   ---------------------------------------------------------------------------
   CE QUE ÇA ACHÈTE, ET CE N'EST PAS COSMÉTIQUE

   Le banc d'essai devient exécutable **en Node**. Jusqu'ici, vérifier que le
   moteur retrouve la sphère des photons demandait d'ouvrir une page, donc un
   navigateur, donc WebGL — `index.html` jette au chargement s'il en manque. Les
   quatre grandeurs se contrôlent maintenant depuis une ligne de commande, sur
   n'importe quelle machine, sans que personne ne regarde.

   C'est le premier morceau du chantier F2, et il a été choisi pour ça.

   ---------------------------------------------------------------------------
   UNITÉS

   La longueur vaut un rayon de Schwarzschild, la vitesse vaut c. Pour
   Sagittarius A* (4,3 × 10⁶ M☉) : r_s = 1,269 × 10⁷ km, et la lumière met
   42,3 s à le franchir. Tout le reste en découle.
   ============================================================================ */

(function(global){
"use strict";

// ------------------------------------------------------------------ constantes
const SEC_PAR_UNITE = 42.34;      // secondes réelles pour 1 r_s à la vitesse c
const KM_PAR_UNITE  = 1.269e7;
const M         = 0.5;            // horizon en r = 2M = 1
const R_HORIZON = 1.0;
const R_PHOTON  = 1.5;            // sphère des photons
const R_ISCO    = 3.0;            // dernière orbite circulaire stable (6M)
const R_OMBRE   = 2.55;           // rayon apparent de l'ombre, pour l'occlusion

// -------------------------------------------------------------------- vecteurs
const cross = (u,v) => [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
const dot   = (u,v) => u[0]*v[0]+u[1]*v[1]+u[2]*v[2];
const len   = u     => Math.hypot(u[0],u[1],u[2]);
const norm  = v => { const l = len(v) || 1; return [v[0]/l, v[1]/l, v[2]/l]; };

// -------------------------------------------------------------------- matière
// Newton plus la correction relativiste, qui fait précesser le périastre et
// rend la capture possible même sans viser le centre.
function acceleration(p, v){
  const r = len(p);
  const L = cross(p, v);
  const k = -M / (r*r*r) * (1 + 3*dot(L,L)/(r*r));
  return [ k*p[0], k*p[1], k*p[2] ];
}

function integre(p, v, dt){
  const a  = acceleration(p, v);
  const pm = [ p[0]+v[0]*dt*0.5, p[1]+v[1]*dt*0.5, p[2]+v[2]*dt*0.5 ];
  const vm = [ v[0]+a[0]*dt*0.5, v[1]+a[1]*dt*0.5, v[2]+a[2]*dt*0.5 ];
  const am = acceleration(pm, vm);
  return [[ p[0]+vm[0]*dt, p[1]+vm[1]*dt, p[2]+vm[2]*dt ],
          [ v[0]+am[0]*dt, v[1]+am[1]*dt, v[2]+am[2]*dt ]];
}

/* Vitesse d'une orbite circulaire. Ce n'est PAS √(M/r) : le terme relativiste
   la fait diverger en r = 3M, qui est justement la sphère des photons. L'écart
   atteint 15 % à six rayons — assez pour qu'une sonde « circulaire » dérive
   visiblement. */
const vCirc = r => Math.sqrt(M/Math.max(r - 3*M, 1e-3));

/* Horloges du paradoxe des jumeaux. Pour une orbite circulaire en
   Schwarzschild, dτ/dt = √(1 − 3M/r) : la dilatation gravitationnelle et celle
   de la vitesse s'y combinent. À l'ISCO, r = 3 r_s, elle vaut √½ — et c'est le
   plancher. Sans rotation, on ne peut pas ralentir son temps de plus d'un
   facteur √2.

   Attention à ne pas la confondre avec √(1 − r_s/r), qui est la cadence de
   l'observateur IMMOBILE. La confusion a déjà été faite une fois dans le carnet
   d'idées, et elle donne 0,968 là où la vraie réponse est 0,952. */
const cadence = r => Math.sqrt(Math.max(0, 1 - 1.5/r));

// -------------------------------------------------------------------- lumière
/* Même équation que le nuanceur, en paramètre affine λ. h² est constant le long
   du rayon, et la « vitesse » |dr/dλ| ne l'est pas — d'où l'absence de
   renormalisation, qui fausserait la trajectoire.

   Verlet-vitesse : l'accélération est réévaluée à l'arrivée et moyennée. Un
   simple Euler sur la vitesse dérive assez pour faire passer un rayon SOUS la
   sphère des photons, ce qui est géométriquement impossible. */
function integrePhoton(p, d, h2, dt){
  const r = len(p);
  const k = -1.5*h2 / Math.pow(r, 5);
  const np = [ p[0] + d[0]*dt + 0.5*k*p[0]*dt*dt,
               p[1] + d[1]*dt + 0.5*k*p[1]*dt*dt,
               p[2] + d[2]*dt + 0.5*k*p[2]*dt*dt ];
  const kn = -1.5*h2 / Math.pow(len(np), 5);
  return [np, [ d[0] + 0.5*(k*p[0] + kn*np[0])*dt,
                d[1] + 0.5*(k*p[1] + kn*np[1])*dt,
                d[2] + 0.5*(k*p[2] + kn*np[2])*dt ]];
}

// Conditions initiales d'un rayon vu par un observateur statique en `p`, visant
// la direction unitaire locale `vue`. Rend h² et la vitesse affine de départ.
function rayonDepuis(p, vue){
  const r0 = len(p);
  const rh = [p[0]/r0, p[1]/r0, p[2]/r0];
  const c  = dot(vue, rh);
  const s  = Math.sqrt(Math.max(0, 1 - c*c));
  const h  = r0*s / Math.sqrt(Math.max(1 - R_HORIZON/r0, 1e-9));
  const h2 = h*h;
  if(s < 1e-9) return { h2:0, d:[Math.sign(c)*rh[0], Math.sign(c)*rh[1], Math.sign(c)*rh[2]] };
  const th = norm([vue[0]-c*rh[0], vue[1]-c*rh[1], vue[2]-c*rh[2]]);
  const vr = Math.sign(c) * Math.sqrt(Math.max(0, 1 + h2/(r0*r0*r0) - h2/(r0*r0)));
  return { h2, d:[ vr*rh[0] + h/r0*th[0], vr*rh[1] + h/r0*th[1], vr*rh[2] + h/r0*th[2] ] };
}

// ================================================================ le banc d'essai
// On rejoue les mêmes équations que le rendu et on compare aux valeurs
// analytiques. Toutes les grandeurs mesurées ici sont des SORTIES du schéma, pas
// des réglages : aucune n'est écrite dans le code.

/* Photon lancé de très loin, parallèle à z, à un paramètre d'impact b. Loin du
   trou noir l'espace est plat : h = b, et la vitesse affine vaut 1 à 10⁻¹⁰ près,
   ce qui donne des conditions initiales sans ambiguïté. */
function tirePhoton(b, r0 = 20000){
  const h2 = b*b;
  const rd = Math.hypot(b, r0);
  let p = [b, 0, -r0], d = [0, 0, Math.sqrt(1 + h2/(rd*rd*rd))];
  let rmin = Infinity;
  for(let i = 0; i < 2000000; i++){
    const r = len(p);
    if(r < rmin) rmin = r;
    if(r < 1.0) return { capture:true, rmin, d };
    if(r > rd && dot(p, d) > 0) return { capture:false, rmin, d };
    [p, d] = integrePhoton(p, d, h2, Math.max(0.0004, r*0.004/Math.max(len(d), 1e-6)));
  }
  return { capture:false, rmin, d };
}

/* Orbite circulaire de matière à r, perturbée vers l'intérieur à moment
   cinétique constant : elle revient (stable) ou elle plonge (instable).

   La fréquence épicyclique s'annule à l'ISCO ; juste au-dessus, le retour est
   très lent. D'où une perturbation faible et une intégration longue. */
function orbiteTient(r){
  const vt = Math.sqrt(M/(r - 3*M));
  const r2 = r*0.995, v2 = vt*r/r2;          // moment cinétique conservé
  let p = [r2, 0, 0], v = [0, 0, v2];
  for(let i = 0; i < 90000; i++){
    [p, v] = integre(p, v, 0.03);
    if(len(p) < 1.05) return false;
  }
  return true;
}

// La frontière capture / fuite, par bissection.
function bisecteCapture(){
  let bas = 1.5, haut = 5.0;                  // bas capturé, haut échappé
  for(let i = 0; i < 42; i++){
    const m = (bas + haut)/2;
    if(tirePhoton(m).capture) bas = m; else haut = m;
  }
  return (bas + haut)/2;
}

// Le rayon de la dernière orbite stable, par bissection sur `orbiteTient`.
function bisecteIsco(){
  let bas = 2.2, haut = 5.0;                  // bas instable, haut stable
  for(let i = 0; i < 18; i++){
    const m = (bas + haut)/2;
    if(orbiteTient(m)) haut = m; else bas = m;
  }
  return (bas + haut)/2;
}

/* Les quatre grandeurs, avec leur valeur analytique.

   Elles sont ici et non dans la page : c'est de la physique, et le jour où l'on
   voudra les vérifier ailleurs — en ligne de commande, dans une intégration
   continue — il ne faudra pas les recopier. */
const REPERES = [
  { id:"photon",    theorie: R_PHOTON,          mesure: () => tirePhoton(bisecteCapture()*(1 + 1e-9)).rmin },
  { id:"ombre",     theorie: Math.sqrt(27)*M,   mesure: () => bisecteCapture() },
  { id:"deflexion", theorie: 4*M/1000,          mesure: () => {
      const t = tirePhoton(1000, 400000);
      return Math.acos(Math.min(1, dot(norm(t.d), [0,0,1])));
    } },
  { id:"isco",      theorie: 6*M,               mesure: () => bisecteIsco() },
];

global.PHYSIQUE = {
  SEC_PAR_UNITE, KM_PAR_UNITE, M, R_HORIZON, R_PHOTON, R_ISCO, R_OMBRE,
  cross, dot, len, norm,
  acceleration, integre, vCirc, cadence,
  integrePhoton, rayonDepuis,
  tirePhoton, orbiteTient, bisecteCapture, bisecteIsco, REPERES,
};

})(typeof window !== "undefined" ? window : globalThis);
