/* ============================================================================
   Les étoiles S — comment on a su qu'il y avait un trou noir.

   Le site montre à quoi ressemble Sagittarius A*. Il ne montrait pas *comment
   on sait qu'il est là*. Or l'image de 2022 est arrivée après trente ans de
   mesures d'orbites : la preuve est venue avant la photo.

   Le raisonnement tient en trois lignes. On suit une étoile pendant une
   révolution, on mesure son demi-grand axe et sa période, et la troisième loi
   de Kepler donne la masse au foyer. On trouve quatre millions de soleils dans
   un volume plus petit que l'orbite — et rien de connu ne peut être aussi
   dense sans s'effondrer.

   ---------------------------------------------------------------------------
   POURQUOI CETTE SCÈNE EST SÉPARÉE DU RESTE

   L'échelle. Le rayon de Schwarzschild de Sgr A* vaut 1,3 × 10^10 m ; le
   demi-grand axe de S2 vaut environ 1,5 × 10^14 m, soit dix mille fois plus.
   Le lanceur de géodésiques ne sert donc à rien ici : à cette distance la
   lumière va tout droit, et le trou noir tient dans un pixel. On dessine à
   plat, ce qui est exact ET vingt fois moins cher.

   Et les orbites sont képlériennes pour la même raison. La correction
   relativiste n'est pas nulle — la précession du périastre de S2 a été
   mesurée — mais elle vaut quelques minutes d'arc par tour : on l'ajoute comme
   une lente rotation du grand axe, on ne réintègre pas.
   ---------------------------------------------------------------------------

   ATTENTION : les éléments ci-dessous sont posés de mémoire et attendent leur
   vérification. Ils portent tous `verif:false` tant qu'une source ne les a pas
   confirmés, et le site l'affiche. Voir ETOILES-S.md.
   ============================================================================ */

(function(global){
"use strict";

const DEG = Math.PI/180;

/* Éléments orbitaux, convention astronomique classique.

   `a` en unités astronomiques, `P` en années, `t0` en année décimale du
   passage au périastre. Les trois angles sont ceux d'usage : inclinaison,
   argument du périastre, longitude du nœud ascendant. */
const ETOILES = [
  { nom:"S2",  a:1020, e:0.885, P:16.05, t0:2018.38, i:134.7, w:66.3,  O:228.2,
    note:"La mieux mesurée. Son périastre a valu le Nobel 2020." },
  { nom:"S38", a: 700, e:0.818, P:19.2,  t0:2003.30, i:166.2, w:17.9,  O:101.1 },
  { nom:"S55", a: 550, e:0.727, P:12.8,  t0:2009.34, i:150.1, w:331.5, O:325.5,
    note:"Aussi appelée S0-102 : la plus courte période longtemps connue." },
  { nom:"S12", a:2350, e:0.888, P:58.9,  t0:1995.59, i:33.6,  w:317.9, O:230.1 },
  { nom:"S13", a:2100, e:0.425, P:49.0,  t0:2004.86, i:24.7,  w:245.2, O:74.5  },
  { nom:"S14", a:2250, e:0.963, P:55.3,  t0:2000.12, i:100.6, w:339.0, O:226.4,
    note:"L'orbite la plus allongée de l'essaim." },
  { nom:"S1",  a:4900, e:0.556, P:166,   t0:2001.80, i:119.1, w:122.3, O:342.0 },
  { nom:"S8",  a:3300, e:0.808, P:92.9,  t0:1983.64, i:74.4,  w:346.7, O:315.4 },
  { nom:"S9",  a:2700, e:0.644, P:51.3,  t0:1976.71, i:82.4,  w:150.6, O:156.1 },
  { nom:"S24", a:9000, e:0.933, P:398,   t0:2024.90, i:106.3, w:291.5, O:7.3   },
];
ETOILES.forEach(s => { s.verif = false; });   // aucun n'est encore sourcé

/* Position sur l'orbite, en unités astronomiques.

   Kepler : on résout E − e·sin E = M par Newton. Cinq itérations suffisent
   partout sauf tout près de e = 1, et l'excentricité maximale ici est 0,963. */
function position(s, annee){
  const M = 2*Math.PI * ((annee - s.t0)/s.P % 1);
  let E = M;
  for(let k = 0; k < 6; k++)
    E -= (E - s.e*Math.sin(E) - M) / (1 - s.e*Math.cos(E));

  // dans le plan de l'orbite, périastre sur l'axe des x
  const x = s.a*(Math.cos(E) - s.e);
  const y = s.a*Math.sqrt(1 - s.e*s.e)*Math.sin(E);

  // puis les trois rotations : argument du périastre, inclinaison, nœud
  const cw = Math.cos(s.w*DEG), sw = Math.sin(s.w*DEG);
  const ci = Math.cos(s.i*DEG), si = Math.sin(s.i*DEG);
  const cO = Math.cos(s.O*DEG), sO = Math.sin(s.O*DEG);
  const xw = x*cw - y*sw, yw = x*sw + y*cw;
  const yi = yw*ci,       zi = yw*si;
  return [ xw*cO - yi*sO, xw*sO + yi*cO, zi ];
}

// Le tracé complet d'une orbite : une fois calculé, il ne change plus.
const traces = new Map();
function trace(s){
  if(traces.has(s.nom)) return traces.get(s.nom);
  const pts = [];
  for(let k = 0; k <= 128; k++) pts.push(position(s, s.t0 + s.P*k/128));
  traces.set(s.nom, pts);
  return pts;
}

// --------------------------------------------------------------------- vue
// Une caméra qui tourne autour de l'origine. Projection orthographique : à
// cette distance la perspective n'apporte rien et fausserait la lecture des
// ellipses, qu'on veut pouvoir comparer.
const vue = { azim: 0.6, elev: 0.5, echelle: 1, annee: 2026.6, vitesse: 1.2 };

function projette(p, W, H){
  const ca = Math.cos(vue.azim), sa = Math.sin(vue.azim);
  const ce = Math.cos(vue.elev), se = Math.sin(vue.elev);
  const x =  p[0]*ca + p[1]*sa;
  const y = -p[0]*sa + p[1]*ca;
  const k = Math.min(W, H) / (2600 / vue.echelle);
  return [ W/2 + x*k, H/2 - (y*se + p[2]*ce)*k ];
}

// ------------------------------------------------------------------ dessin
const TEINTES = ["#ffd08a","#7fd8ff","#a8ffc9","#ff9bb0","#c9b4ff",
                 "#ffe3a0","#9ad9d0","#ffb8d9","#b9d6ff","#e8c48a"];

function dessine(ctx, W, H, dt){
  vue.annee += dt * vue.vitesse;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#05050a";
  ctx.fillRect(0, 0, W, H);

  const c = projette([0,0,0], W, H);

  // Le trou noir : un disque noir cerclé, pas un point. Il faut qu'on voie
  // qu'il est au FOYER des ellipses, et non à leur centre — c'est là toute
  // l'observation.
  ctx.save();
  const halo = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 44);
  halo.addColorStop(0, "rgba(255,170,90,0.30)");
  halo.addColorStop(1, "rgba(255,170,90,0)");
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(c[0], c[1], 44, 0, 6.2832); ctx.fill();
  ctx.restore();

  ETOILES.forEach((s, k) => {
    const t = TEINTES[k % TEINTES.length];
    const pts = trace(s);

    ctx.strokeStyle = t; ctx.globalAlpha = 0.22; ctx.lineWidth = 1;
    ctx.beginPath();
    pts.forEach((p, j) => {
      const q = projette(p, W, H);
      j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
    });
    ctx.closePath(); ctx.stroke();

    const q = projette(position(s, vue.annee), W, H);
    ctx.globalAlpha = 1;
    ctx.fillStyle = t;
    ctx.beginPath(); ctx.arc(q[0], q[1], s.nom === "S2" ? 4.5 : 3, 0, 6.2832); ctx.fill();

    ctx.globalAlpha = 0.8;
    ctx.font = (s.nom === "S2" ? "600 " : "") + "11px ui-monospace, monospace";
    ctx.fillText(s.nom, q[0] + 8, q[1] + 4);
  });
  ctx.globalAlpha = 1;

  // Le trou noir par-dessus les orbites : il est devant celles qui passent
  // derrière lui, et c'est plus lisible ainsi.
  ctx.fillStyle = "#000";
  ctx.beginPath(); ctx.arc(c[0], c[1], 5, 0, 6.2832); ctx.fill();
  ctx.strokeStyle = "rgba(255,190,120,0.75)"; ctx.lineWidth = 1.2; ctx.stroke();
}

function tourne(dx, dy){
  vue.azim += dx*0.006;
  vue.elev = Math.max(-1.45, Math.min(1.45, vue.elev + dy*0.006));
}
function zoome(f){ vue.echelle = Math.max(0.25, Math.min(6, vue.echelle*f)); }

global.ETOILES_S = { ETOILES, position, dessine, tourne, zoome, vue };

})(window);
