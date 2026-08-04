/* ============================================================================
   L'occupant du salon.

   Généré par le calcul, comme tout le reste du site : rien n'est importé.
   C'est aussi ce que le style impose — une grosse tête ronde, un corps trapu,
   des membres simples. Des primitives suffisent, et le résultat pèse quelques
   kilo-octets au lieu de plusieurs mégas.

   Chaque partie a sa propre matrice, ce qui permet de l'animer : la
   respiration, le balancement, la tête qui suit l'astre par la baie.

   Unités : le mètre. Le personnage mesure environ 1,55 m, debout sur y = 0.
   ============================================================================ */

(function(global){
"use strict";

// --------------------------------------------------------------- primitives
function pousse(T, p, n, c){
  T.pos.push(p[0], p[1], p[2]);
  T.nor.push(n[0], n[1], n[2]);
  T.tei.push(c[0], c[1], c[2]);
}

function quad(T, a, b, c, d, teinte){
  const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
  const v = [d[0]-a[0], d[1]-a[1], d[2]-a[2]];
  let n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
  const l = Math.hypot(n[0], n[1], n[2]) || 1;
  n = [n[0]/l, n[1]/l, n[2]/l];
  for(const s of [a, b, c, a, c, d]) pousse(T, s, n, teinte);
}

// Boîte centrée en `c`, de demi-dimensions `d`. La brique de base.
function boite(T, c, d, teinte){
  const [x,y,z] = c, [a,b,e] = d;
  const P = [
    [x-a,y-b,z-e],[x+a,y-b,z-e],[x+a,y+b,z-e],[x-a,y+b,z-e],
    [x-a,y-b,z+e],[x+a,y-b,z+e],[x+a,y+b,z+e],[x-a,y+b,z+e],
  ];
  quad(T, P[5],P[4],P[7],P[6], teinte);   // avant  (+z)
  quad(T, P[0],P[1],P[2],P[3], teinte);   // arrière
  quad(T, P[4],P[0],P[3],P[7], teinte);   // gauche
  quad(T, P[1],P[5],P[6],P[2], teinte);   // droite
  quad(T, P[3],P[2],P[6],P[7], teinte);   // dessus
  quad(T, P[4],P[5],P[1],P[0], teinte);   // dessous
}

// Sphère à facettes assumées : peu de segments, c'est le style.
function sphere(T, c, r, seg, teinte, aplat){
  const ay = aplat || 1;
  const pt = (i, j) => {
    const th = Math.PI*j/seg, ph = 2*Math.PI*i/seg;
    return [ c[0] + r*Math.sin(th)*Math.cos(ph),
             c[1] + r*ay*Math.cos(th),
             c[2] + r*Math.sin(th)*Math.sin(ph) ];
  };
  for(let j = 0; j < seg; j++)
    for(let i = 0; i < seg; i++)
      quad(T, pt(i,j+1), pt(i+1,j+1), pt(i+1,j), pt(i,j), teinte);
}

// ------------------------------------------------------------- morphologie
// Grosse tête, corps trapu, membres courts : c'est ce qui rend le bonhomme
// sympathique. Les proportions réalistes le rendraient quelconque.
const T_COMBI  = [0.62, 0.42, 0.18];   // orange de combinaison spatiale
const T_TORSE  = [0.72, 0.50, 0.22];
const T_CASQUE = [0.30, 0.33, 0.38];
const T_VISIERE= [0.06, 0.09, 0.14];
const T_PEAU   = [0.42, 0.62, 0.38];   // vert pâle : ce n'est pas un humain
const T_SAC    = [0.26, 0.26, 0.30];

const PARTS = {};

function construitPieces(){
  // -- torse : le pivot de la respiration --
  { const T = { pos:[], nor:[], tei:[] };
    boite(T, [0, 0, 0], [0.20, 0.24, 0.14], T_TORSE);
    boite(T, [0, 0.10, -0.16], [0.16, 0.18, 0.05], T_SAC);   // sac dorsal
    boite(T, [0, -0.20, 0], [0.21, 0.04, 0.15], T_COMBI);    // ceinture
    PARTS.torse = T; }

  // -- tête sous casque --
  { const T = { pos:[], nor:[], tei:[] };
    sphere(T, [0, 0, 0], 0.155, 8, T_PEAU, 1.05);
    sphere(T, [0, 0.01, 0], 0.185, 10, T_CASQUE, 1.0);
    // visière : une calotte sombre tournée vers l'avant
    for(let j = 2; j < 6; j++)
      for(let i = 0; i < 12; i++){
        const th0 = Math.PI*j/8, th1 = Math.PI*(j+1)/8;
        const ph0 = -0.75 + 1.5*i/12, ph1 = -0.75 + 1.5*(i+1)/12;
        const p = (th, ph) => [0.187*Math.sin(th)*Math.sin(ph),
                               0.01 + 0.187*Math.cos(th),
                               0.187*Math.sin(th)*Math.cos(ph)];
        quad(T, p(th1,ph0), p(th1,ph1), p(th0,ph1), p(th0,ph0), T_VISIERE);
      }
    PARTS.tete = T; }

  // -- membres : une boîte allongée, pivotée par sa matrice --
  { const T = { pos:[], nor:[], tei:[] };
    boite(T, [0, -0.14, 0], [0.055, 0.16, 0.055], T_COMBI);
    boite(T, [0, -0.31, 0], [0.062, 0.045, 0.062], T_CASQUE);   // gant
    PARTS.bras = T; }

  { const T = { pos:[], nor:[], tei:[] };
    boite(T, [0, -0.16, 0], [0.068, 0.18, 0.068], T_COMBI);
    boite(T, [0, -0.35, 0.02], [0.075, 0.045, 0.10], T_CASQUE); // botte
    PARTS.jambe = T; }
}

// ------------------------------------------------------------------ rendu
const gpu = {};

function construit(gl){
  construitPieces();
  let total = 0;
  for(const [nom, T] of Object.entries(PARTS)){
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const attache = (arr, loc, taille) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, taille, gl.FLOAT, false, 0, 0);
    };
    attache(T.pos, 0, 3); attache(T.nor, 1, 3); attache(T.tei, 2, 3);
    gl.bindVertexArray(null);
    gpu[nom] = { vao, n: T.pos.length/3 };
    total += T.pos.length/3;
  }
  return total;
}

// --------------------------------------------------------------- matrices
const I = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
function mul(A, B){
  const M = new Float32Array(16);
  for(let i=0;i<4;i++) for(let j=0;j<4;j++){
    let s = 0;
    for(let k=0;k<4;k++) s += A[k*4+j]*B[i*4+k];
    M[i*4+j] = s;
  }
  return M;
}
const trans = (x,y,z) => [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1];
const echelle = (x,y,z) => [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1];
const rotX = a => { const c=Math.cos(a), s=Math.sin(a);
  return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; };
const rotY = a => { const c=Math.cos(a), s=Math.sin(a);
  return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; };
const rotZ = a => { const c=Math.cos(a), s=Math.sin(a);
  return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]; };

/**
 * Dessine l'occupant.
 * @param base   matrice qui le place dans la pièce (translation + orientation)
 * @param t      temps réel, en secondes
 * @param regard angle horizontal vers lequel il tourne la tête
 */
function dessine(gl, envoieMatrice, base, t, regard){
  // Respiration : le torse se soulève à peine. C'est ce mouvement minuscule
  // qui fait la différence entre un mannequin et quelqu'un.
  const souffle = Math.sin(t*1.15);
  const balance = Math.sin(t*0.62)*0.045;      // report de poids
  const corps = mul(base, mul(trans(0, 0.86 + souffle*0.006, 0), rotZ(balance*0.25)));

  const piece = (nom, M) => {
    envoieMatrice(M);
    gl.bindVertexArray(gpu[nom].vao);
    gl.drawArrays(gl.TRIANGLES, 0, gpu[nom].n);
  };

  piece("torse", mul(corps, echelle(1, 1 + souffle*0.018, 1)));

  // La tête suit l'astre, avec un léger retard : personne ne tourne la tête
  // d'un bloc.
  const lacet = regard*0.55 + Math.sin(t*0.31)*0.10;
  piece("tete", mul(corps, mul(trans(0, 0.42, 0), mul(rotY(lacet), rotX(Math.sin(t*0.44)*0.05)))));

  // Les bras se balancent en opposition, très peu : on est debout, pas en marche.
  for(const c of [-1, 1]){
    const ep = mul(corps, trans(c*0.245, 0.17, 0));
    piece("bras", mul(ep, mul(rotZ(c*(0.14 + balance*0.5)), rotX(Math.sin(t*0.62 + (c>0?0:Math.PI))*0.06))));
  }
  for(const c of [-1, 1]){
    const h = mul(corps, trans(c*0.105, -0.24, 0));
    piece("jambe", mul(h, rotZ(-c*balance*0.35)));
  }

  gl.bindVertexArray(null);
}

global.PERSONNAGE = { construit, dessine, get pieces(){ return Object.keys(gpu).length; } };

})(window);
