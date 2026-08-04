/* ============================================================================
   Le salon du vaisseau, en trois dimensions.

   L'idée qui rend ça simple : le lancer de géodésiques est DÉJÀ une passe
   plein écran. Il suffit donc de dessiner l'habitacle par-dessus, avec un test
   de profondeur. La baie vitrée n'est pas un objet — c'est l'endroit où il n'y
   a pas de géométrie. Et comme les deux passes partagent la même caméra et le
   même champ, la perspective s'aligne toute seule.

   Rien n'est importé : la géométrie est calculée, comme le reste du site.

   Deux choses font qu'un décor procédural cesse d'avoir l'air d'une boîte.

   La première, ce sont les PANNEAUX. Un mur d'une seule teinte plate n'existe
   nulle part ; les vraies coques sont faites de tôles rapportées, chacune un
   peu différente, séparées par des joints sombres. On pave donc chaque paroi
   de petits quadrilatères légèrement en saillie, avec un bruit déterministe
   sur la teinte. Le coût est dérisoire et le gain est le plus grand du fichier.

   La seconde, c'est l'ÉMISSION. Le disque d'accrétion est la seule source de
   lumière, et une pièce éclairée par une seule source lointaine est un
   diorama. Les vaisseaux s'éclairent aussi eux-mêmes : bandeaux au ras du sol,
   corniches, écrans, voyants. Un quatrième attribut par sommet dit « cette
   surface brille toute seule », et c'est ce qui donne la profondeur.

   Unités : le mètre. La caméra est placée à hauteur d'yeux dans la pièce.
   ============================================================================ */

(function(global){
"use strict";

// ------------------------------------------------------------- dimensions
// Une pièce large et basse de plafond : le regard va vers la baie, pas en l'air.
const L = 10.0;   // largeur (x)
const H = 3.25;   // hauteur (y)
const P = 7.4;    // profondeur (z) — la baie est en -z
const OEIL = 1.62;

// Ouverture de la baie, dans le mur du fond
const BAIE = { x:6.2, bas:0.30, haut:2.72, montants:2 };

// La fosse d'observation : on descend vers la vitre.
const FOSSE = -0.58;

// ------------------------------------------------------------- palette
// Elle vient du matériel spatial soviétique et des sous-marins : vert-de-gris
// pâle, crème sali, garnitures anthracite, et l'ambre des voyants. Le bleu
// froid générique du vaisseau de science-fiction a été écarté — il aurait
// concurrencé l'orange du disque au lieu de le servir.
const COQUE    = [0.185, 0.205, 0.190];   // vert-de-gris des grands panneaux
const COQUE_B  = [0.230, 0.245, 0.225];   // sa variante claire
const CREME    = [0.300, 0.285, 0.245];   // panneaux crème, par plaques
const SOL      = [0.115, 0.115, 0.125];
const PLAFOND  = [0.075, 0.078, 0.086];
const STRUCT   = [0.105, 0.108, 0.120];   // membrures et caissons, sombres
const CADRE    = [0.155, 0.150, 0.145];
const MOBILE   = [0.135, 0.088, 0.062];   // garniture cuir-fauve du mobilier
const AMBRE    = [1.000, 0.560, 0.180];   // bandeaux et voyants
const CYAN     = [0.360, 0.860, 0.900];   // écrans et instruments
const NOIR     = [0.035, 0.035, 0.040];   // joints, entre les panneaux

// ------------------------------------------------------------- géométrie
// Un quadrilatère, deux triangles, normale calculée. Les sommets sont donnés
// dans le sens direct vu de l'intérieur. `emi` vaut 1 si la surface brille.
function quad(T, a, b, c, d, teinte, emi){
  const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
  const v = [d[0]-a[0], d[1]-a[1], d[2]-a[2]];
  const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
  const l = Math.hypot(n[0], n[1], n[2]) || 1;
  const N = [n[0]/l, n[1]/l, n[2]/l];
  const e = emi || 0;
  for(const s of [a, b, c, a, c, d]){
    T.pos.push(s[0], s[1], s[2]);
    T.nor.push(N[0], N[1], N[2]);
    T.tei.push(teinte[0], teinte[1], teinte[2]);
    T.emi.push(e);
  }
}

// Boîte pleine, centrée. La brique de tout le mobilier et de la structure.
function boite(T, c, d, teinte, emi){
  const [x,y,z] = c, [a,b,e] = d;
  const Q = [
    [x-a,y-b,z-e],[x+a,y-b,z-e],[x+a,y+b,z-e],[x-a,y+b,z-e],
    [x-a,y-b,z+e],[x+a,y-b,z+e],[x+a,y+b,z+e],[x-a,y+b,z+e],
  ];
  quad(T, Q[5],Q[4],Q[7],Q[6], teinte, emi);
  quad(T, Q[0],Q[1],Q[2],Q[3], teinte, emi);
  quad(T, Q[4],Q[0],Q[3],Q[7], teinte, emi);
  quad(T, Q[1],Q[5],Q[6],Q[2], teinte, emi);
  quad(T, Q[3],Q[2],Q[6],Q[7], teinte, emi);
  quad(T, Q[4],Q[5],Q[1],Q[0], teinte, emi);
}

// Tube à section carrée entre deux points : mains courantes et tuyauterie.
function barre(T, a, b, ep, teinte, emi){
  const d = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
  const c = [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2];
  boite(T, c, [Math.abs(d[0])/2 + ep, Math.abs(d[1])/2 + ep,
               Math.abs(d[2])/2 + ep], teinte, emi);
}

// Bruit déterministe : la même paroi donne toujours les mêmes plaques.
function hache(i, j){
  const s = Math.sin(i*127.1 + j*311.7) * 43758.5453;
  return s - Math.floor(s);
}

/* Pave une surface de plaques rapportées.

   `pt(u,v)` rend un point de la surface pour u, v dans [0,1]. `dep` est le
   déplacement appliqué aux plaques pour qu'elles saillent du fond sombre :
   c'est ce décalage qui creuse les joints, sans avoir à les modéliser. */
function panneaux(T, pt, nu, nv, dep, base, graine){
  const j = 0.055;   // largeur du joint, en fraction de plaque
  for(let i = 0; i < nu; i++)
    for(let k = 0; k < nv; k++){
      const h = hache(i + graine, k*3.3 + graine);
      // Une plaque sur sept est d'une autre matière : c'est ce qui empêche la
      // paroi de se lire comme une grille régulière.
      let c = h < 0.14 ? CREME : (h < 0.55 ? base : COQUE_B);
      const f = 0.90 + h*0.20;
      c = [c[0]*f, c[1]*f, c[2]*f];
      const u0 = (i+j)/nu, u1 = (i+1-j)/nu, v0 = (k+j)/nv, v1 = (k+1-j)/nv;
      const p = (u,v) => { const q = pt(u,v);
                           return [q[0]+dep[0], q[1]+dep[1], q[2]+dep[2]]; };
      quad(T, p(u0,v0), p(u1,v0), p(u1,v1), p(u0,v1), c);
    }
}

function construitGeometrie(){
  const T = { pos:[], nor:[], tei:[], emi:[] };

  const x0 = -L/2, x1 = L/2, z0 = -P/2, z1 = P/2;
  const zF = z0 + 2.6;    // bord de la fosse

  // ---- deux niveaux de sol ----
  // Le sol plat unique était une facilité, et c'est lui qui faisait « boîte » :
  // on descend maintenant vers la vitre au lieu de la regarder debout au
  // milieu de nulle part.
  // L'ordre des sommets n'est pas cosmétique : il décide de la normale, donc de
  // l'éclairement. Dans ce sens-ci elle pointe vers le haut. Dans l'autre, le
  // sol était éclairé comme un plafond et le reflet de la baie ne s'y posait
  // jamais — le test `n.y > 0.9` du nuanceur ne pouvait pas passer.
  quad(T, [x0,FOSSE,zF], [x1,FOSSE,zF], [x1,FOSSE,z0], [x0,FOSSE,z0], SOL);
  quad(T, [x0,0,z1], [x1,0,z1], [x1,0,zF], [x0,0,zF], SOL);

  // Le nez de marche, rayé d'avertissement. Les rayures ne sont pas un
  // ornement : c'est ce qui signale une dénivellation, et le motif fait
  // immédiatement « matériel », pas « architecture ».
  const nr = 26;
  for(let i = 0; i < nr; i++){
    const a = x0 + (x1-x0)*i/nr, b = x0 + (x1-x0)*(i+1)/nr;
    const jaune = i % 2 === 0;
    quad(T, [a,FOSSE,zF], [b,FOSSE,zF], [b,0,zF], [a,0,zF],
         jaune ? AMBRE : NOIR, jaune ? 0.30 : 0);
  }

  // Deux marches décalées vers la gauche : on n'entre pas par le milieu.
  for(let i = 0; i < 3; i++){
    const y = -0.193*(i+1), z = zF - 0.26*i;
    boite(T, [-2.6 + i*0.12, y + 0.096, z + 0.13], [1.25, 0.096, 0.13], CADRE);
  }

  quad(T, [x0,H,z1], [x1,H,z1], [x1,H,z0], [x0,H,z0], PLAFOND);

  // ---- parois : fond sombre, puis plaques rapportées par-dessus ----
  quad(T, [x0,FOSSE,z1], [x0,FOSSE,z0], [x0,H,z0], [x0,H,z1], NOIR);
  quad(T, [x1,FOSSE,z0], [x1,FOSSE,z1], [x1,H,z1], [x1,H,z0], NOIR);
  quad(T, [x1,0,z1], [x0,0,z1], [x0,H,z1], [x1,H,z1], NOIR);

  const lerp = (a,b,t) => a + (b-a)*t;
  panneaux(T, (u,v) => [x0, lerp(FOSSE,H,v), lerp(z0,z1,u)], 8, 5, [0.035,0,0], COQUE, 3);
  panneaux(T, (u,v) => [x1, lerp(FOSSE,H,v), lerp(z1,z0,u)], 8, 5, [-0.035,0,0], COQUE, 17);
  panneaux(T, (u,v) => [lerp(x1,x0,u), lerp(0,H,v), z1], 9, 4, [0,0,-0.035], COQUE, 41);

  // Façade de la baie : quatre bandes autour du trou, elles aussi panneautées.
  const g = -BAIE.x/2, d = BAIE.x/2;
  quad(T, [x0,FOSSE,z0], [x1,FOSSE,z0], [x1,BAIE.bas,z0], [x0,BAIE.bas,z0], NOIR);
  quad(T, [x0,BAIE.haut,z0], [x1,BAIE.haut,z0], [x1,H,z0], [x0,H,z0], NOIR);
  quad(T, [x0,BAIE.bas,z0], [g,BAIE.bas,z0], [g,BAIE.haut,z0], [x0,BAIE.haut,z0], NOIR);
  quad(T, [d,BAIE.bas,z0], [x1,BAIE.bas,z0], [x1,BAIE.haut,z0], [d,BAIE.haut,z0], NOIR);
  panneaux(T, (u,v) => [lerp(x0,x1,u), lerp(BAIE.haut,H,v), z0], 9, 2, [0,0,0.035], COQUE, 61);
  panneaux(T, (u,v) => [lerp(x0,g,u), lerp(BAIE.bas,BAIE.haut,v), z0], 2, 5, [0,0,0.035], COQUE, 71);
  panneaux(T, (u,v) => [lerp(d,x1,u), lerp(BAIE.bas,BAIE.haut,v), z0], 2, 5, [0,0,0.035], COQUE, 83);

  // ---- la baie a de l'épaisseur ----
  // Une ouverture sans tableau se lit comme un trou découpé dans du carton.
  // Ces quatre faces donnent la coque.
  const ep = 0.46;
  quad(T, [g,BAIE.bas,z0], [d,BAIE.bas,z0], [d,BAIE.bas,z0+ep], [g,BAIE.bas,z0+ep], CADRE);
  quad(T, [d,BAIE.haut,z0], [g,BAIE.haut,z0], [g,BAIE.haut,z0+ep], [d,BAIE.haut,z0+ep], CADRE);
  quad(T, [g,BAIE.bas,z0+ep], [g,BAIE.bas,z0], [g,BAIE.haut,z0], [g,BAIE.haut,z0+ep], CADRE);
  quad(T, [d,BAIE.bas,z0], [d,BAIE.bas,z0+ep], [d,BAIE.haut,z0+ep], [d,BAIE.haut,z0], CADRE);

  // Un liseré ambre court tout autour du tableau : il dessine l'ouverture même
  // quand l'astre est passé hors champ et que la baie est noire.
  const li = 0.030;
  boite(T, [0, BAIE.bas + li, z0+ep], [BAIE.x/2, li, li], AMBRE, 1);
  boite(T, [0, BAIE.haut - li, z0+ep], [BAIE.x/2, li, li], AMBRE, 1);

  // montants, avec leur retour dans le tableau
  const n = BAIE.montants;
  for(let i = 1; i <= n; i++){
    const x = g + BAIE.x*i/(n+1);
    boite(T, [x, (BAIE.bas+BAIE.haut)/2, z0 + ep*0.5],
             [0.048, (BAIE.haut-BAIE.bas)/2, ep*0.5], CADRE);
  }

  // ---- membrures : la coque se voit de l'intérieur ----
  // Des arceaux à intervalle régulier. C'est ce qui dit « vaisseau » plutôt
  // que « pièce », et ça donne une échelle au regard.
  for(let i = 0; i < 4; i++){
    const z = z0 + 1.55 + i*1.55;
    boite(T, [x0 + 0.07, (FOSSE+H)/2, z], [0.07, (H-FOSSE)/2, 0.13], STRUCT);
    boite(T, [x1 - 0.07, (FOSSE+H)/2, z], [0.07, (H-FOSSE)/2, 0.13], STRUCT);
    boite(T, [0, H - 0.07, z], [L/2 - 0.12, 0.07, 0.13], STRUCT);
  }

  // ---- corniches lumineuses ----
  // La lumière rasante qui sort de la jonction mur-plafond : c'est elle qui
  // détache les membrures et donne du relief quand l'astre est loin.
  boite(T, [x0 + 0.20, H - 0.16, 0], [0.025, 0.025, P/2 - 0.3], CYAN, 1);
  boite(T, [x1 - 0.20, H - 0.16, 0], [0.025, 0.025, P/2 - 0.3], CYAN, 1);
  // et au ras du sol de la fosse, côté vitre : un liseré qui guide vers la baie
  boite(T, [0, FOSSE + 0.025, zF - 0.10], [L/2 - 0.4, 0.022, 0.022], AMBRE, 1);

  // ---- main courante au bord de la fosse ----
  const yR = 0.96;
  barre(T, [-3.3, yR, zF - 0.08], [3.3, yR, zF - 0.08], 0.026, CADRE);
  for(const x of [-3.3, -1.4, 1.4, 3.3])
    barre(T, [x, 0, zF - 0.08], [x, yR, zF - 0.08], 0.022, CADRE);

  // ---- plaques au sol de la fosse ----
  // Le sol nu était le dernier grand aplat de la pièce. Des plaques rapportées
  // lui donnent une trame, et surtout une échelle : on mesure la fosse en
  // dalles au lieu de la deviner.
  panneaux(T, (u,v) => [lerp(x0,x1,u), FOSSE, lerp(z0,zF,v)], 7, 3, [0,0.012,0], SOL, 97);

  // ---- banquette, dans le tiers gauche de la fosse ----
  // Centrée, elle barrait la vitre comme un mur : le regard butait dessus au
  // lieu d'aller au trou noir. Décentrée et découpée en assises, elle meuble
  // sans occulter — et le vide qu'elle laisse à droite est ce qui fait qu'on
  // avance vers la baie.
  const bz = z0 + 1.55, bh = FOSSE + 0.40;
  boite(T, [-2.95, FOSSE + 0.09, bz], [1.42, 0.09, 0.26], STRUCT);      // socle en retrait
  for(let i = 0; i < 3; i++)
    boite(T, [-4.05 + i*1.10, bh - 0.14, bz], [0.50, 0.14, 0.30], MOBILE);
  boite(T, [-2.95, bh + 0.14, bz + 0.27], [1.55, 0.22, 0.055], MOBILE);  // dossier bas

  // ---- poste d'observation à droite : on n'est pas symétrique ----
  boite(T, [2.85, FOSSE + 0.46, z0 + 1.05], [0.95, 0.46, 0.36], STRUCT);
  boite(T, [2.85, FOSSE + 0.94, z0 + 0.95], [0.92, 0.03, 0.26], CADRE);
  // le pupitre incliné, ses écrans et sa rangée de voyants
  boite(T, [2.85, FOSSE + 1.04, z0 + 0.82], [0.72, 0.09, 0.02], CYAN, 1);
  for(let i = 0; i < 6; i++)
    boite(T, [2.30 + i*0.22, FOSSE + 0.90, z0 + 0.68], [0.035, 0.018, 0.012],
          i % 3 === 0 ? AMBRE : CYAN, 1);

  // ---- caissons techniques au plafond, décalés ----
  boite(T, [-2.9, H - 0.15, z0 + 3.9], [1.6, 0.15, 0.60], STRUCT);
  boite(T, [ 2.1, H - 0.11, z0 + 5.6], [1.2, 0.11, 0.44], STRUCT);
  // gaines qui courent le long de la paroi gauche
  for(const y of [H - 0.42, H - 0.60])
    barre(T, [x0 + 0.16, y, z0 + 0.6], [x0 + 0.16, y, z1 - 0.4], 0.045, STRUCT);

  return {
    pos: new Float32Array(T.pos),
    nor: new Float32Array(T.nor),
    tei: new Float32Array(T.tei),
    emi: new Float32Array(T.emi),
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
  attache(g.emi, 3, 1);
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

global.VAISSEAU = { L, H, P, OEIL, FOSSE, BAIE, construit, dessine,
                    get sommets(){ return nSommets; } };

})(window);
