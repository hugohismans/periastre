/* ============================================================================
   Lumen, en trois dimensions.

   Il cessait d'être un personnage à force d'être un panneau dans la marge. Un
   guide de bord n'est pas une zone de l'interface : c'est quelqu'un qu'on
   croise, qu'on regarde, et à qui on s'adresse parce qu'on est allé le voir.
   Alors il devient un objet du vaisseau — un petit drone qui patrouille, et
   qu'on interpelle en le visant.

   La conséquence est plus qu'esthétique. Un bouton est toujours disponible,
   donc jamais remarqué ; un drone qui passe se remarque, et l'on choisit de
   l'arrêter. C'est la même règle que pour la commande du temps : ce qui se
   manipule est dans le décor, pas autour.

   Trois pièces, chacune avec sa matrice. Rien n'est importé.
   ============================================================================ */

(function(global){
"use strict";

// --------------------------------------------------------------- primitives
function quad(T, a, b, c, d, teinte, emi){
  const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
  const v = [d[0]-a[0], d[1]-a[1], d[2]-a[2]];
  const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
  const l = Math.hypot(n[0], n[1], n[2]) || 1;
  const N = [n[0]/l, n[1]/l, n[2]/l], e = emi || 0;
  for(const s of [a, b, c, a, c, d]){
    T.pos.push(s[0], s[1], s[2]);
    T.nor.push(N[0], N[1], N[2]);
    T.tei.push(teinte[0], teinte[1], teinte[2]);
    T.emi.push(e);
  }
}

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

// Sphère à facettes assumées : peu de segments, c'est le style de la maison.
function sphere(T, c, r, seg, teinte, emi){
  const pt = (i, j) => {
    const th = Math.PI*j/seg, ph = 2*Math.PI*i/seg;
    return [ c[0] + r*Math.sin(th)*Math.cos(ph),
             c[1] + r*Math.cos(th),
             c[2] + r*Math.sin(th)*Math.sin(ph) ];
  };
  for(let j = 0; j < seg; j++)
    for(let i = 0; i < seg; i++)
      quad(T, pt(i,j+1), pt(i+1,j+1), pt(i+1,j), pt(i,j), teinte, emi);
}

// Disque plat, dans le plan xy, tourné vers +z.
function disque(T, r, seg, teinte, emi){
  for(let i = 0; i < seg; i++){
    const a = 2*Math.PI*i/seg, b = 2*Math.PI*(i+1)/seg;
    quad(T, [0,0,0], [r*Math.cos(a), r*Math.sin(a), 0],
            [r*Math.cos(b), r*Math.sin(b), 0], [0,0,0], teinte, emi);
  }
}

// ------------------------------------------------------------- morphologie
const COQUE  = [0.155, 0.150, 0.170];
const METAL  = [0.230, 0.220, 0.240];
const LENTILLE = [1.000, 0.640, 0.260];   // l'ambre de la maison

const R = 0.135;                          // rayon de la coque
const PIECES = {};

function construitPieces(){
  { const T = { pos:[], nor:[], tei:[], emi:[] };
    sphere(T, [0,0,0], R, 8, COQUE, 0);
    // une ceinture équatoriale, qui casse la boule et lui donne un « devant »
    boite(T, [0, 0, 0], [R*0.98, R*0.16, R*0.98], METAL, 0);
    // et un petit dos technique
    boite(T, [0, 0.02, -R*0.86], [R*0.34, R*0.30, R*0.22], METAL, 0);
    PIECES.coque = T; }

  { const T = { pos:[], nor:[], tei:[], emi:[] };
    disque(T, R*0.46, 14, LENTILLE, 1);          // l'œil
    disque(T, R*0.66, 14, LENTILLE, 0.22);       // son halo, en retrait
    PIECES.oeil = T; }

  { const T = { pos:[], nor:[], tei:[], emi:[] };
    boite(T, [0, 0, 0], [0.062, 0.007, 0.020], METAL, 0);
    boite(T, [0.058, 0, 0], [0.012, 0.005, 0.012], LENTILLE, 0.75);
    PIECES.ailette = T; }
}

// ------------------------------------------------------------------ rendu
const gpu = {};

function construit(gl){
  construitPieces();
  let total = 0;
  for(const [nom, T] of Object.entries(PIECES)){
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const attache = (arr, loc, taille) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, taille, gl.FLOAT, false, 0, 0);
    };
    attache(T.pos, 0, 3); attache(T.nor, 1, 3);
    attache(T.tei, 2, 3); attache(T.emi, 3, 1);
    gl.bindVertexArray(null);
    gpu[nom] = { vao, n: T.pos.length/3 };
    total += T.pos.length/3;
  }
  return total;
}

// --------------------------------------------------------------- matrices
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
const rotX = a => { const c=Math.cos(a), s=Math.sin(a);
  return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; };
const rotY = a => { const c=Math.cos(a), s=Math.sin(a);
  return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; };
const rotZ = a => { const c=Math.cos(a), s=Math.sin(a);
  return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]; };

/* Où se trouve Lumen à l'instant t.

   Une ronde lente au-dessus de la fosse, sur un huit couché : deux périodes
   incommensurables, donc le trajet ne se referme jamais tout à fait et l'on ne
   surprend pas la boucle. Il flotte, et il respire un peu en flottant. */
let attente = 0;          // 0 : il vaque ; 1 : il vient se placer et se tient là

/* Quand on lui demande de venir, il vient.

   Il patrouillait pendant qu'on essayait de l'atteindre, ce qui rendait la
   consigne « clique dessus » pénible au doigt : la cible se dérobait. Il glisse
   donc vers un point stable, à hauteur d'yeux et à portée, et n'y garde qu'une
   respiration — assez pour rester vivant, assez peu pour se laisser toucher.

   C'est aussi plus juste : on l'appelle, il répond. Un guide qui continue sa
   ronde pendant qu'on lui parle n'écoute pas. */
let posteAttente = [0.75, 1.46, -1.35];

/* Il vient À VOUS, pas à un endroit de la pièce.

   Un point fixe le laissait à quatre mètres, où un drone de vingt-sept
   centimètres n'est qu'une tache. On lui donne donc la place à tenir, calculée
   depuis l'observateur : une longueur de bras et demie devant, un peu de côté
   pour ne pas masquer la baie, à hauteur d'yeux. */
function veutAttendre(v, ou){
  if(ou) posteAttente = ou;
  attente += (v - attente) * 0.035;
}

function pose(t){
  const libre = [
    Math.sin(t*0.21)*2.25 + Math.sin(t*0.083)*0.55,
    1.34 + Math.sin(t*0.47)*0.085 + Math.sin(t*0.19)*0.11,
    -1.95 + Math.sin(t*0.42 + 1.1)*0.72,
  ];
  if(attente < 0.01) return libre;
  /* Il TOURNE autour de sa place, il ne s'y plante pas.

     Immobile, il ne se distinguait plus d'un élément d'interface collé devant
     soi — et c'est précisément ce qu'Hugo a vu. Un petit cercle de vingt-deux
     centimètres, parcouru en une douzaine de secondes, suffit à dire que c'est
     un objet posé dans la pièce et non une vignette plaquée sur l'écran.

     Le rayon reste sous celui de la boîte à viser, qui vaut trente centimètres
     en attente : il bouge assez pour qu'on le voie vivre, pas assez pour qu'on
     le manque. */
  const a = t*0.52;
  const tenu = [ posteAttente[0] + Math.cos(a)*0.22,
                 posteAttente[1] + Math.sin(t*0.9)*0.030,   // il respire encore
                 posteAttente[2] + Math.sin(a)*0.22 ];
  const k = attente;
  return [ libre[0]*(1-k) + tenu[0]*k,
           libre[1]*(1-k) + tenu[1]*k,
           libre[2]*(1-k) + tenu[2]*k ];
}

/**
 * @param envoie  fonction qui pousse une matrice de modèle
 * @param t       temps réel, en secondes
 * @param vers    position de l'observateur : l'œil se tourne vers lui
 * @param eveil   0 à 1 — il s'anime quand on le vise ou qu'il parle
 */
function dessine(gl, envoie, t, vers, eveil){
  const p = pose(t);
  const e = eveil || 0;

  // Il fait face à qui le regarde. Un guide qui parle de profil ne parle à
  // personne.
  const lacet = Math.atan2(vers[0] - p[0], vers[2] - p[2]);
  const tang  = Math.atan2(vers[1] - p[1],
                           Math.hypot(vers[0] - p[0], vers[2] - p[2]));

  const base = mul(trans(p[0], p[1], p[2]), rotY(lacet));

  const piece = (nom, M) => {
    envoie(M);
    gl.bindVertexArray(gpu[nom].vao);
    gl.drawArrays(gl.TRIANGLES, 0, gpu[nom].n);
  };

  // Un léger roulis dans le sens du déplacement : il s'incline pour tourner.
  piece("coque", mul(base, rotZ(Math.cos(t*0.21)*0.16)));
  piece("oeil",  mul(base, mul(rotX(-tang), trans(0, 0, R*0.99))));

  // Trois ailettes en ronde. Elles accélèrent quand on s'adresse à lui : c'est
  // le seul signal dont on ait besoin pour savoir qu'il écoute.
  const vit = t*(0.9 + e*3.4);
  for(let i = 0; i < 3; i++){
    const a = vit + i*2.0944;
    piece("ailette", mul(base, mul(rotY(a),
      mul(trans(0, -0.02 + Math.sin(a*2.0)*0.012, R*1.42), rotZ(0.35)))));
  }

  gl.bindVertexArray(null);
}

// La boîte à viser. Généreuse : on interpelle quelqu'un, on ne le chirurgie pas.
// La boîte à viser. Généreuse, et davantage encore quand il attend qu'on
// vienne lui parler : à ce moment-là, le manquer est un échec de la consigne.
function boiteVisee(t){
  // Il grossit peu en attendant : il s'est rapproché, c'est déjà l'essentiel.
  const g = R * (1.7 + attente*0.5);
  return { c: pose(t), d: [g, g, g] };
}

global.ROBOT = { construit, dessine, pose, boiteVisee, veutAttendre, R,
                 get pieces(){ return Object.keys(gpu).length; } };

})(window);
