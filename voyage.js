/* ============================================================================
   Moteur de voyage d'échelle.

   Une seule variable pilote tout : `decade`, le logarithme décimal de la
   largeur du champ en mètres. On va de 10,1 (rayon de Schwarzschild de
   Sgr A*) à 26,6 (univers observable), soit dix-sept décades.

   PRÉCISION — c'est le vrai piège. Un flottant 32 bits porte ~7 chiffres
   significatifs : à 10²⁶ m il ne reste rien. Chaque scène range donc sa
   géométrie dans ses propres unités (divisée par 10^ancre au moment de la
   construction), et le moteur applique un simple facteur d'échelle à
   l'affichage. Les auteurs de scènes écrivent en mètres et n'y pensent jamais.

   Une scène s'enregistre ainsi :

     VOYAGE.enregistre({
       id: "systeme-solaire",
       nom: "Le système solaire",
       echelle: [10.6, 13.4],       // décades où elle est visible
       ancre: 11.17,                // sa décade de référence
       fiches: [...], repliques: [...],
       construit(B){ ... },         // une fois, avec la boîte à outils
       anime(t, vue){ ... },        // optionnel, par image
     });

   Elle ne connaît aucune autre scène. Le seul couplage est l'axe.
   ============================================================================ */

(function(global){
"use strict";

const UA = 1.495978707e11;      // mètres
const AL = 9.4607304725808e15;  // année-lumière
const PC = 3.0856775814913673e16;

const scenes = [];
let gl = null, cv = null, progPoints = null, progLignes = null;
let vue = { decade: 11.17, cible: 11.17, azim: 0.5, elev: 0.35, dt: 0, t: 0 };

// ------------------------------------------------------------------ shaders
const VS_POINTS = `#version 300 es
in vec3 aPos; in vec4 aCoul; in float aTaille;
uniform mat4 uMVP; uniform float uEchelle; uniform float uFondu; uniform float uH;
out vec4 vCoul;
void main(){
  vec4 p = uMVP * vec4(aPos * uEchelle, 1.0);
  gl_Position = p;
  // taille en pixels, atténuée par la distance mais jamais sous 1 px :
  // un point d'étoile qui disparaît est pire qu'un point trop gros
  gl_PointSize = max(1.0, aTaille * uH / max(p.w, 1e-6));
  vCoul = vec4(aCoul.rgb, aCoul.a * uFondu);
}`;

const FS_POINTS = `#version 300 es
precision highp float;
in vec4 vCoul; out vec4 oCoul;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d);
  if(r > 0.25) discard;
  oCoul = vec4(vCoul.rgb, vCoul.a * smoothstep(0.25, 0.0, r));
}`;

const VS_LIGNES = `#version 300 es
in vec3 aPos; in vec4 aCoul;
uniform mat4 uMVP; uniform float uEchelle; uniform float uFondu;
out vec4 vCoul;
void main(){
  gl_Position = uMVP * vec4(aPos * uEchelle, 1.0);
  vCoul = vec4(aCoul.rgb, aCoul.a * uFondu);
}`;

const FS_LIGNES = `#version 300 es
precision highp float;
in vec4 vCoul; out vec4 oCoul;
void main(){ oCoul = vCoul; }`;

function compile(type, src){
  const s = gl.createShader(type);
  gl.shaderSource(s, src.trim()); gl.compileShader(s);
  if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}
function programme(vs, fs){
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, "aPos");
  gl.bindAttribLocation(p, 1, "aCoul");
  gl.bindAttribLocation(p, 2, "aTaille");
  gl.linkProgram(p);
  if(!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return { p, u:{
    MVP: gl.getUniformLocation(p, "uMVP"),
    echelle: gl.getUniformLocation(p, "uEchelle"),
    fondu: gl.getUniformLocation(p, "uFondu"),
    H: gl.getUniformLocation(p, "uH"),
  }};
}

// ------------------------------------------------------------ maths caméra
function perspective(fov, aspect, pres, loin){
  const f = 1/Math.tan(fov/2), nf = 1/(pres - loin);
  return new Float32Array([
    f/aspect,0,0,0,  0,f,0,0,  0,0,(loin+pres)*nf,-1,  0,0,2*loin*pres*nf,0,
  ]);
}
function regarde(oeil, cible, haut){
  const z = norme(sous(oeil, cible)), x = norme(produit(haut, z)), y = produit(z, x);
  return new Float32Array([
    x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0,
    -pointe(x,oeil), -pointe(y,oeil), -pointe(z,oeil), 1,
  ]);
}
const sous    = (a,b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
const pointe  = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const produit = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const norme   = v => { const l = Math.hypot(v[0],v[1],v[2])||1; return [v[0]/l,v[1]/l,v[2]/l]; };
function multiplie(a, b){
  const o = new Float32Array(16);
  for(let i=0;i<4;i++) for(let j=0;j<4;j++){
    let s = 0;
    for(let k=0;k<4;k++) s += a[k*4+j]*b[i*4+k];
    o[i*4+j] = s;
  }
  return o;
}

// ------------------------------------------------------- boîte à outils
// Tout est reçu en MÈTRES. La division par 10^ancre a lieu ici, une fois.
function Boite(scene){
  const lots = { points:[], lignes:[] };
  const k = Math.pow(10, -scene.ancre);
  const coul = c => Array.isArray(c) ? c : [1,1,1,1];

  return {
    UA, AL, PC,

    /** Nuage de points. `pos` : tableau plat [x,y,z, x,y,z, ...] en mètres. */
    points(pos, o = {}){
      const n = pos.length/3;
      const P = new Float32Array(n*3), C = new Float32Array(n*4), T = new Float32Array(n);
      const c = coul(o.couleur), t = o.taille ?? 2;
      for(let i = 0; i < n; i++){
        P[i*3] = pos[i*3]*k; P[i*3+1] = pos[i*3+1]*k; P[i*3+2] = pos[i*3+2]*k;
        const cc = typeof c[0] === "number" ? c : c[i];
        C.set(cc, i*4);
        T[i] = Array.isArray(t) ? t[i] : t;
      }
      lots.points.push({ P, C, T, n });
    },

    /** Polyligne ouverte. `pos` en mètres, même format. */
    ligne(pos, o = {}){
      const n = pos.length/3;
      const P = new Float32Array(n*3), C = new Float32Array(n*4);
      const c = coul(o.couleur);
      for(let i = 0; i < n; i++){
        P[i*3] = pos[i*3]*k; P[i*3+1] = pos[i*3+1]*k; P[i*3+2] = pos[i*3+2]*k;
        C.set(c, i*4);
      }
      lots.lignes.push({ P, C, n, boucle: !!o.boucle });
    },

    /**
     * Orbite képlérienne à partir des éléments osculateurs.
     * a en mètres, angles en degrés. Rend aussi le tableau de points, pour
     * qu'une scène puisse y placer un corps.
     */
    orbite(el, o = {}){
      const n = o.segments ?? 256;
      const { a, e = 0, i = 0, noeud = 0, periastre = 0 } = el;
      const ri = i*Math.PI/180, rN = noeud*Math.PI/180, rw = periastre*Math.PI/180;
      const pts = new Float64Array(n*3);
      for(let j = 0; j < n; j++){
        const nu = j/n * 2*Math.PI;
        const r = a*(1 - e*e)/(1 + e*Math.cos(nu));
        const u = rw + nu;
        // repère équatorial classique, puis on bascule en Y vertical
        const X = r*(Math.cos(rN)*Math.cos(u) - Math.sin(rN)*Math.sin(u)*Math.cos(ri));
        const Y = r*(Math.sin(rN)*Math.cos(u) + Math.cos(rN)*Math.sin(u)*Math.cos(ri));
        const Z = r*(Math.sin(u)*Math.sin(ri));
        pts[j*3] = X; pts[j*3+1] = Z; pts[j*3+2] = Y;
      }
      if(o.trace !== false) this.ligne(pts, { couleur:o.couleur, boucle:true });
      return pts;
    },

    /** Coquille sphérique de points répartis uniformément entre deux rayons. */
    coquille(rMin, rMax, n, o = {}){
      const pts = new Float64Array(n*3);
      for(let i = 0; i < n; i++){
        // r ∝ (uniforme)^(1/3) pour une densité constante en volume
        const u = Math.random();
        const r = Math.cbrt(u*(rMax**3 - rMin**3) + rMin**3);
        const c = 1 - 2*Math.random(), s = Math.sqrt(1 - c*c), p = Math.random()*2*Math.PI;
        pts[i*3] = r*s*Math.cos(p); pts[i*3+1] = r*c; pts[i*3+2] = r*s*Math.sin(p);
      }
      this.points(pts, o);
      return pts;
    },

    _lots: lots,
  };
}

// --------------------------------------------------------------- scènes
function enregistre(scene){
  for(const champ of ["id", "nom", "echelle", "ancre"])
    if(scene[champ] === undefined) throw new Error(`scène « ${scene.id || "?"} » : champ ${champ} manquant`);
  if(scenes.some(s => s.id === scene.id)) throw new Error(`scène en double : ${scene.id}`);
  scenes.push(scene);
  if(gl) prepare(scene);
}

function prepare(scene){
  if(scene._prete) return;
  const B = Boite(scene);
  if(scene.construit) scene.construit(B);
  scene._gpu = { points:[], lignes:[] };
  for(const l of B._lots.points) scene._gpu.points.push(televerse(l, true));
  for(const l of B._lots.lignes) scene._gpu.lignes.push(televerse(l, false));
  scene._prete = true;
}

function televerse(lot, avecTaille){
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const bind = (data, loc, taille) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, taille, gl.FLOAT, false, 0, 0);
  };
  bind(lot.P, 0, 3);
  bind(lot.C, 1, 4);
  if(avecTaille) bind(lot.T, 2, 1);
  gl.bindVertexArray(null);
  return { vao, n: lot.n, boucle: lot.boucle };
}

// Opacité d'une scène : pleine au cœur de sa plage, éteinte aux bords.
function fondu(scene, d){
  const [a, b] = scene.echelle;
  if(d <= a || d >= b) return 0;
  const marge = Math.min(0.55, (b - a)*0.28);
  return Math.min(1, Math.min((d - a)/marge, (b - d)/marge));
}

// ---------------------------------------------------------------- rendu
function dessine(dt){
  vue.dt = dt; vue.t += dt;
  // approche douce de la décade visée
  vue.decade += (vue.cible - vue.decade) * Math.min(1, dt*6);

  gl.viewport(0, 0, cv.width, cv.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);      // additif : rien ne masque rien
  gl.disable(gl.DEPTH_TEST);

  const aspect = cv.width/cv.height;
  const D = 2.6;
  const ce = Math.cos(vue.elev), se = Math.sin(vue.elev);
  const oeil = [D*ce*Math.cos(vue.azim), D*se, D*ce*Math.sin(vue.azim)];
  const MVP = multiplie(perspective(0.9, aspect, 0.01, 100), regarde(oeil, [0,0,0], [0,1,0]));

  for(const s of scenes){
    const f = fondu(s, vue.decade);
    if(f <= 0.002) continue;
    prepare(s);
    if(s.anime) s.anime(vue.t, vue);
    const ech = Math.pow(10, s.ancre - vue.decade);

    for(const [prog, lots, mode] of [
      [progLignes, s._gpu.lignes, null],
      [progPoints, s._gpu.points, gl.POINTS],
    ]){
      if(!lots.length) continue;
      gl.useProgram(prog.p);
      gl.uniformMatrix4fv(prog.u.MVP, false, MVP);
      gl.uniform1f(prog.u.echelle, ech);
      gl.uniform1f(prog.u.fondu, f);
      if(prog.u.H) gl.uniform1f(prog.u.H, cv.height*0.5);
      for(const l of lots){
        gl.bindVertexArray(l.vao);
        gl.drawArrays(mode ?? (l.boucle ? gl.LINE_LOOP : gl.LINE_STRIP), 0, l.n);
      }
    }
  }
  gl.bindVertexArray(null);
}

// --------------------------------------------------------------- public
function demarre(canvas){
  cv = canvas;
  gl = cv.getContext("webgl2", { antialias:true, alpha:false });
  if(!gl) throw new Error("WebGL2 indisponible");
  progPoints = programme(VS_POINTS, FS_POINTS);
  progLignes = programme(VS_LIGNES, FS_LIGNES);
  scenes.forEach(prepare);
}

// Nom lisible de l'échelle courante — c'est ce qui donne le vertige.
function legende(d){
  const m = Math.pow(10, d);
  if(m < 1e9)  return `${(m/1e3).toPrecision(3)} km`;
  if(m < 1e12) return `${(m/UA).toPrecision(3)} unités astronomiques`;
  if(m < 1e17) return `${(m/UA).toPrecision(3)} UA — ${(m/AL).toPrecision(2)} année-lumière`;
  if(m < 1e22) return `${(m/AL).toPrecision(3)} années-lumière`;
  return `${(m/(1e6*AL)).toPrecision(3)} millions d'années-lumière`;
}

global.VOYAGE = {
  UA, AL, PC,
  enregistre, demarre, dessine, legende, scenes,
  vue,
  vaVers: d => { vue.cible = Math.max(10.1, Math.min(26.6, d)); },
  zoome:  dz => { vue.cible = Math.max(10.1, Math.min(26.6, vue.cible + dz)); },
};

})(window);
