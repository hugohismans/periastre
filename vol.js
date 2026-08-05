/* ============================================================================
   Ce qui vole : les sondes et les photons.

   Deuxième tranche du chantier F2, après `physique.js`. Elle sort du bloc le
   cycle de vie complet d'un corps lancé — son avenir calculé au départ, son
   avancée image par image, sa fin.

   ---------------------------------------------------------------------------
   POURQUOI CELLE-CI, ET POURQUOI MAINTENANT

   Ce n'est pas le morceau le plus gros ni le plus emmêlé. C'est celui dont
   dépend la suite : la salle de tir balistique, telle qu'elle est décrite dans
   le carnet, N'EST QUE ÇA — `destin()` avec une vitesse choisie à la main au
   lieu d'une vitesse tirée au sort, et une vue depuis le corps lancé. Le
   mémorial des disparus lit la même fin de vie. Le registre des sondes nommées
   lit la même liste.

   Autant que ce socle soit propre avant qu'on bâtisse trois pièces dessus.

   ---------------------------------------------------------------------------
   IL NE PARLE PAS, IL RACONTE

   L'ancien code appelait `flash()`, `message()` et `reagit()` depuis le cœur de
   la boucle physique. C'était commode et c'était faux : ça voulait dire qu'une
   sonde ne pouvait se figer QUE dans une page, QUE en produisant un éclair, et
   toujours le même.

   Or la salle balistique voudra autre chose de cet instant précis — une entrée
   au mémorial, un nom à saisir, un silence. Le mémorial ne veut pas d'éclair.

   Alors `avance()` ne dit plus rien : elle REND la liste de ce qui vient
   d'arriver, et laisse à qui l'appelle le soin d'en faire un éclair, une
   ligne de registre, ou rien. Le découplage n'est pas une propreté d'école ; il
   est la condition pour que le même moteur serve trois pièces différentes.

   Effet de bord bienvenu : le vol devient jouable sans navigateur.
   `outil-verif-vol.js` en profite.
   ============================================================================ */

(function(global){
"use strict";

const P = global.PHYSIQUE;
const { len, norm, cross, integre, integrePhoton, rayonDepuis, vCirc } = P;
const { R_HORIZON, R_ISCO, R_PHOTON } = P;

const MAX_SONDES = 420;

const sondes  = [];
const photons = [];

/* Les compteurs vivent dans un objet et non en variables libres. Ce n'est pas
   un détail de style : une variable réassignée ne peut pas être partagée entre
   deux fichiers — la lier ailleurs en fige la valeur du moment. Un champ, si. */
const compte = { chute: 0, fuite: 0, essaisPres: 0 };

// ================================================================ les sondes

/* L'avenir de la sonde, intégré UNE FOIS au lancement. Il donne à la fois son
   sort et le tracé complet à afficher — c'est ce qui permet de montrer où elle
   va avant même qu'elle y aille. */
function destin(p0, v0){
  let p = [...p0], v = [...v0];
  const chemin = [];
  let sort = "orbite";
  for(let i = 0; i < 2600; i++){
    [p, v] = integre(p, v, 0.10);
    if((i & 7) === 0) chemin.push([p[0], p[1], p[2]]);
    const r = len(p);
    if(r < R_HORIZON*1.05){ sort = "chute"; break; }
    if(r > 50){ sort = "fuite"; break; }
  }
  return { sort, chemin };
}

function lance(p, v){
  const { sort, chemin } = destin(p, v);
  if(len(p) < R_ISCO - 0.1) compte.essaisPres++;
  if(sondes.length >= MAX_SONDES) sondes.shift();
  const s = { p:[...p], v:[...v], sort, chemin, age:0, trace:[] };
  sondes.push(s);
  return s;
}

function pluie(n = 80){
  for(let i = 0; i < n; i++){
    const r = 2.2 + Math.random()*11;
    const a = Math.random()*6.2832;
    const p = [ Math.cos(a)*r, (Math.random()-0.5)*0.7, Math.sin(a)*r ];
    // tangentielle, plus ou moins vite que l'orbite circulaire — c'est ce
    // facteur qui décide de tout
    const t = norm(cross([0,1,0], p));
    const rad = norm([p[0], 0, p[2]]);
    // 1 = orbite circulaire, √2 ≈ 1,414 = vitesse de libération. Il faut couvrir
    // les deux seuils pour voir les trois familles se séparer.
    const f = 0.40 + Math.random()*1.25;
    const vc = vCirc(r);
    lance(p, [
      t[0]*vc*f + rad[0]*(Math.random()-0.5)*0.10,
      (Math.random()-0.5)*0.10,
      t[2]*vc*f + rad[2]*(Math.random()-0.5)*0.10,
    ]);
  }
}

// =============================================================== les photons

function lancePhoton(){
  // La sphère des photons est une crête : du bon côté le rayon s'échappe après
  // quelques tours, du mauvais il tombe. On tire donc chaque fois d'un point et
  // dans un sens différents — deux photons voisins ont des destins opposés,
  // et c'est précisément ce qu'il faut montrer.
  //
  // Les conditions initiales passent par rayonDepuis : poser naïvement |d| = 1
  // donnerait h² = r² = 2,25 au lieu de b_c² = 6,75, et ferait tourner le
  // photon √3 fois trop vite.
  const a = Math.random()*6.2832;
  const r = R_PHOTON * (0.975 + Math.random()*0.07);
  const p = [ Math.cos(a)*r, 0, Math.sin(a)*r ];
  const sens = Math.random() < 0.5 ? 1 : -1;          // prograde ou rétrograde
  const t = norm(cross([0,1,0], p)), rh = norm(p);
  const vise = norm([
    sens*t[0] + rh[0]*(Math.random()-0.5)*0.13,
    (Math.random()-0.5)*0.45,                          // un peu hors du plan
    sens*t[2] + rh[2]*(Math.random()-0.5)*0.13,
  ]);
  const ray = rayonDepuis(p, vise);
  if(photons.length >= 4) photons.shift();
  const f = { p, d:ray.d, h2:ray.h2, temps:0, angle:0, trace:[] };
  photons.push(f);
  return f;
}

// ================================================================== l'avancée

/* Rend la liste de ce qui est arrivé pendant ce pas. Quatre événements :

     { quoi:"figee",       sonde }    elle vient de disparaître à nos yeux
     { quoi:"tombee",      sonde }    son flux s'est éteint, on la retire
     { quoi:"photonAvale", photon }
     { quoi:"photonFuite", photon }

   « Figée » et « tombée » sont deux instants distincts et il ne faut pas les
   confondre : entre les deux il s'écoule quatorze unités de temps pendant
   lesquelles la sonde est encore là, rouge et immobile. C'est exactement ce
   qu'un observateur extérieur voit — et c'est aussi, le jour venu, l'intervalle
   pendant lequel le mémorial devra dire « en train de disparaître » plutôt que
   « disparue ». */
function avance(dtGeo, dtSec){
  const faits = [];

  const n = Math.max(1, Math.min(Math.ceil(dtGeo/0.03), 32));
  const pas = dtGeo/n;
  for(let i = sondes.length - 1; i >= 0; i--){
    const s = sondes[i];

    // Dilatation du temps : vue de loin, une sonde qui approche de l'horizon
    // ralentit et ne le franchit JAMAIS. Elle se fige, rougit, et s'éteint.
    // Le facteur (1 − r_s/r) est la relation entre temps propre et temps
    // coordonnée ; sans lui la sonde traverserait, ce qu'aucun observateur
    // extérieur ne peut voir.
    const dilat = Math.max(0, 1 - R_HORIZON/len(s.p));
    const pasEff = pas * dilat;
    for(let k = 0; k < n; k++){
      const [np, nv] = integre(s.p, s.v, pasEff);
      s.p = np; s.v = nv;
    }
    s.age += dtSec;
    s.trace.push([s.p[0], s.p[1], s.p[2]]);
    if(s.trace.length > 46) s.trace.shift();

    const r = len(s.p);
    // le flux perçu décroît exponentiellement, d'échelle ~ r_s/c
    if(dilat < 0.06){
      s.gel = (s.gel || 0) + dtGeo;
      if(s.gel > 14){ sondes.splice(i,1); compte.chute++; faits.push({ quoi:"tombee", sonde:s }); continue; }
      if(!s.vue){ s.vue = true; faits.push({ quoi:"figee", sonde:s }); }
    }
    if(r > 52){ sondes.splice(i,1); compte.fuite++; }
  }

  // photons — pas plus fin, ils frôlent l'horizon
  const np_ = Math.max(1, Math.min(Math.ceil(dtGeo/0.012), 96));
  const pasP = dtGeo/np_;
  for(let i = photons.length - 1; i >= 0; i--){
    const f = photons[i];
    for(let k = 0; k < np_; k++){
      const a0 = Math.atan2(f.p[2], f.p[0]);
      const [np2, nd] = integrePhoton(f.p, f.d, f.h2, pasP);
      f.p = np2; f.d = nd;
      let da = Math.atan2(f.p[2], f.p[0]) - a0;
      if(da >  Math.PI) da -= 6.2832;
      if(da < -Math.PI) da += 6.2832;
      f.angle += Math.abs(da);
      // λ est le paramètre affine, pas le temps. Ce qu'un observateur lointain
      // chronomètre, c'est t, et dt/dλ = E/(1 − r_s/r) : au ras de la sphère
      // des photons ce facteur vaut 3.
      f.temps += pasP / Math.max(1 - R_HORIZON/len(f.p), 1e-3);
    }
    f.trace.push([f.p[0], f.p[1], f.p[2]]);
    if(f.trace.length > 200) f.trace.shift();

    const r = len(f.p);
    if(r < R_HORIZON*1.02){ photons.splice(i,1); faits.push({ quoi:"photonAvale", photon:f }); }
    else if(r > 45)       { photons.splice(i,1); faits.push({ quoi:"photonFuite", photon:f }); }
  }

  return faits;
}

function vide(){
  sondes.length = 0; photons.length = 0;
  compte.chute = 0; compte.fuite = 0;
}

global.VOL = { MAX_SONDES, sondes, photons, compte,
               destin, lance, pluie, lancePhoton, avance, vide };

})(typeof window !== "undefined" ? window : globalThis);
