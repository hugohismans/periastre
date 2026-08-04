/* ============================================================================
   Le salon du vaisseau, en trois dimensions.

   L'idée qui rend ça simple : le lancer de géodésiques est DÉJÀ une passe
   plein écran. Il suffit donc de dessiner l'habitacle par-dessus, avec un test
   de profondeur. La baie vitrée n'est pas un objet — c'est l'endroit où il n'y
   a pas de géométrie. Et comme les deux passes partagent la même caméra et le
   même champ, la perspective s'aligne toute seule.

   Rien n'est importé : la géométrie est calculée, comme le reste du site.

   Unités : le mètre. La caméra est placée à hauteur d'yeux dans la pièce.
   ============================================================================ */

(function(global){
"use strict";

// ------------------------------------------------------------- dimensions
// Une pièce large et basse de plafond : le regard va vers la baie, pas en l'air.
const L = 9.0;    // largeur (x)
const H = 3.0;    // hauteur (y)
const P = 6.5;    // profondeur (z) — la baie est en -z
const OEIL = 1.62;

// Ouverture de la baie, dans le mur du fond
const BAIE = { x:7.4, bas:0.55, haut:2.55, montants:3 };

// ------------------------------------------------------------- géométrie
// Un quadrilatère, deux triangles, normale calculée. Les sommets sont donnés
// dans le sens direct vu de l'intérieur.
function quad(T, a, b, c, d, teinte){
  const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
  const v = [d[0]-a[0], d[1]-a[1], d[2]-a[2]];
  const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
  const l = Math.hypot(n[0], n[1], n[2]) || 1;
  const N = [n[0]/l, n[1]/l, n[2]/l];
  for(const s of [a, b, c, a, c, d]){
    T.pos.push(s[0], s[1], s[2]);
    T.nor.push(N[0], N[1], N[2]);
    T.tei.push(teinte[0], teinte[1], teinte[2]);
  }
}

// Un mur percé d'une ouverture rectangulaire : quatre bandes autour du trou.
function murPerce(T, y0, y1, x0, x1, z, ouv, teinte){
  quad(T, [x0,y0,z], [x1,y0,z], [x1,ouv.bas,z], [x0,ouv.bas,z], teinte);      // sous
  quad(T, [x0,ouv.haut,z], [x1,ouv.haut,z], [x1,y1,z], [x0,y1,z], teinte);    // dessus
  const g = -ouv.x/2, d = ouv.x/2;
  quad(T, [x0,ouv.bas,z], [g,ouv.bas,z], [g,ouv.haut,z], [x0,ouv.haut,z], teinte);
  quad(T, [d,ouv.bas,z], [x1,ouv.bas,z], [x1,ouv.haut,z], [d,ouv.haut,z], teinte);
}

function construitGeometrie(){
  const T = { pos:[], nor:[], tei:[] };

  // Matériaux sombres : l'astre doit rester le sujet, la pièce l'encadre.
  const SOL     = [0.085, 0.080, 0.105];
  const PLAFOND = [0.055, 0.052, 0.072];
  const PAROI   = [0.115, 0.108, 0.140];
  const CADRE   = [0.190, 0.175, 0.215];
  const MOBILE  = [0.145, 0.130, 0.165];

  const x0 = -L/2, x1 = L/2, z0 = -P/2, z1 = P/2;

  quad(T, [x0,0,z0], [x1,0,z0], [x1,0,z1], [x0,0,z1], SOL);
  quad(T, [x0,H,z1], [x1,H,z1], [x1,H,z0], [x0,H,z0], PLAFOND);
  quad(T, [x0,0,z1], [x0,0,z0], [x0,H,z0], [x0,H,z1], PAROI);   // gauche
  quad(T, [x1,0,z0], [x1,0,z1], [x1,H,z1], [x1,H,z0], PAROI);   // droite
  quad(T, [x1,0,z1], [x0,0,z1], [x0,H,z1], [x1,H,z1], PAROI);   // arrière

  // La façade avant, percée de la baie
  murPerce(T, 0, H, x0, x1, z0, BAIE, PAROI);

  // Montants verticaux : ils donnent l'échelle et rappellent qu'on est derrière
  // une vitre. Sans eux, la baie ne se lit pas comme une ouverture.
  const n = BAIE.montants, ep = 0.055, pr = 0.10;
  for(let i = 1; i <= n; i++){
    const x = -BAIE.x/2 + BAIE.x*i/(n+1);
    const a = x - ep/2, b = x + ep/2;
    quad(T, [a,BAIE.bas,z0], [b,BAIE.bas,z0], [b,BAIE.haut,z0], [a,BAIE.haut,z0], CADRE);
    quad(T, [a,BAIE.bas,z0+pr], [a,BAIE.bas,z0], [a,BAIE.haut,z0], [a,BAIE.haut,z0+pr], CADRE);
    quad(T, [b,BAIE.bas,z0], [b,BAIE.bas,z0+pr], [b,BAIE.haut,z0+pr], [b,BAIE.haut,z0], CADRE);
  }
  // Traverse basse, à hauteur d'appui
  quad(T, [-BAIE.x/2,BAIE.bas,z0+pr], [BAIE.x/2,BAIE.bas,z0+pr],
          [BAIE.x/2,BAIE.bas,z0], [-BAIE.x/2,BAIE.bas,z0], CADRE);

  // Une banquette face à la baie : de quoi s'asseoir et regarder.
  const bz = z0 + 1.5, bh = 0.42, bp = 0.55, bl = 3.2;
  quad(T, [-bl/2,bh,bz-bp/2], [bl/2,bh,bz-bp/2], [bl/2,bh,bz+bp/2], [-bl/2,bh,bz+bp/2], MOBILE);
  quad(T, [-bl/2,0,bz+bp/2], [bl/2,0,bz+bp/2], [bl/2,bh,bz+bp/2], [-bl/2,bh,bz+bp/2], MOBILE);
  quad(T, [bl/2,0,bz-bp/2], [-bl/2,0,bz-bp/2], [-bl/2,bh,bz-bp/2], [bl/2,bh,bz-bp/2], MOBILE);

  return {
    pos: new Float32Array(T.pos),
    nor: new Float32Array(T.nor),
    tei: new Float32Array(T.tei),
    n: T.pos.length/3,
  };
}

// --------------------------------------------------------------- rendu
let vao = null, nSommets = 0;

function construit(gl){
  const g = construitGeometrie();
  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const attache = (data, loc, taille) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, taille, gl.FLOAT, false, 0, 0);
  };
  attache(g.pos, 0, 3);
  attache(g.nor, 1, 3);
  attache(g.tei, 2, 3);
  gl.bindVertexArray(null);
  nSommets = g.n;
  return nSommets;
}

function dessine(gl){
  if(!vao) return;
  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, nSommets);
  gl.bindVertexArray(null);
}

global.VAISSEAU = { L, H, P, OEIL, BAIE, construit, dessine,
                    get sommets(){ return nSommets; } };

})(window);
