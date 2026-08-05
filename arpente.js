/* ============================================================================
   Marcher dans la pièce.

   Quatrième tranche du chantier F2, après `physique.js`, `vol.js` et `temps.js`.
   Elle sort du bloc le contrôleur du personnage : une position, un sol donné par
   une fonction, une tolérance de marche.

   ---------------------------------------------------------------------------
   CE N'EST PAS UN MOTEUR PHYSIQUE, ET CE SERAIT UNE ERREUR D'EN IMPORTER UN

   Un moteur de corps rigides simule des caisses qui tombent. Quelqu'un qui
   marche n'est pas une caisse : il ne glisse pas sur les pentes, il monte les
   marches, il s'arrête net et il ne bascule jamais. Les studios qui embarquent
   un moteur du commerce écrivent quand même leur contrôleur à la main, pour
   cette raison exactement.

   ---------------------------------------------------------------------------
   POURQUOI L'AVOIR SORTIE : POUR POUVOIR MARCHER SANS NAVIGATEUR

   C'est le gain concret, et il n'est pas théorique. Une pièce se casse de mille
   façons qui ne se voient qu'en s'y déplaçant : traverser un meuble, tomber dans
   la fosse sans pouvoir remonter, rester coincé dans un angle, franchir une
   paroi. Trouver cela demandait un humain, un écran, et de la patience.

   Depuis que ce fichier ne touche ni au document ni à WebGL, `outil-verif-
   arpente.js` promène un personnage dans la pièce, des milliers de fois, et
   vérifie qu'il ne passe pas là où il ne doit pas.

   Le premier passage a d'ailleurs trouvé quelque chose.

   ---------------------------------------------------------------------------
   CE QU'IL FAUT LUI DONNER

   Il ne connaît ni le clavier ni l'écran. On lui passe, à chaque image, la
   direction du regard et l'état des commandes — c'est l'appelant qui sait d'où
   elles viennent, d'un clavier ou d'un pouce.
   ============================================================================ */

(function(global){
"use strict";

const V = global.VAISSEAU;

const TAILLE = 1.62, RAYON = 0.34, MARCHE = 0.36;
const VITESSE = 2.7, COURSE = 4.8, SAUT = 3.6, PESANTEUR = 9.2;

const joueur = {
  p:[0.6, 0, 2.7],        // position des PIEDS, en coordonnées de la pièce
  v:[0, 0, 0],
  auSol:true, pas:0,      // `pas` fait osciller la tête quand on marche
  vue:1,                  // 1 = première personne, 3 = troisième
  touches:new Set(),
};

/* Le mobilier : on monte dessus s'il est bas, il arrête s'il est haut. La même
   règle sert aux deux, ce qui évite d'entretenir deux listes qui divergeraient.

   Les deux instruments — le télescope à bâbord, et la console de tir quand elle
   est posée — sont ici EUX AUSSI, et ils n'y étaient pas. On les traversait.
   Personne ne s'en était aperçu parce que personne ne va marcher exprès dans un
   télescope ; le contrôle en ligne de commande, lui, y va tout droit. */
const MEUBLES = [
  { nom:"banquette", x0:-4.45, x1:-1.45, z0:-2.50, z1:-1.80, h:V.FOSSE + 0.40 },
  { nom:"pupitre",   x0: 1.85, x1: 3.85, z0:-3.05, z1:-2.45, h:V.FOSSE + 0.97 },
  { nom:"télescope", x0:V.TELESCOPE.x - 0.34, x1:V.TELESCOPE.x + 0.34,
                     z0:V.TELESCOPE.z - 0.42, z1:V.TELESCOPE.z + 0.42, h:V.FOSSE + 1.05 },
];

// La console de tir n'existe pas toujours : elle attend un œil pour choisir sa
// place. Le mobilier la suit plutôt que de la supposer.
function majMobilier(){
  const i = MEUBLES.findIndex(m => m.nom === "console de tir");
  if(i >= 0) MEUBLES.splice(i, 1);
  if(V.TIR && V.TIR.actif) MEUBLES.push({
    nom:"console de tir",
    x0:V.TIR.x - 0.36, x1:V.TIR.x + 0.36,
    z0:V.TIR.z - 0.32, z1:V.TIR.z + 0.32, h:V.FOSSE + 1.05,
  });
}

/* La hauteur du sol sous un point.

   Deux niveaux, et une rampe à bâbord. On peut sauter dans la fosse de
   n'importe où — la chute est libre —, mais on n'en remonte que par la rampe,
   puisque le ressaut de 58 cm dépasse la tolérance de marche. Ce n'est pas une
   limitation, c'est ce qui donne un sens au plan : il y a une entrée. */
function hauteurSol(x, z){
  let h = V.FOSSE;
  if(z >= V.ZF) h = 0;
  else {
    const R = V.RAMPE;
    if(x > R.x0 && x < R.x1 && z > V.ZF - R.long)
      h = V.FOSSE * (V.ZF - z)/R.long;
  }
  for(const m of MEUBLES)
    if(x > m.x0 - RAYON && x < m.x1 + RAYON && z > m.z0 - RAYON && z < m.z1 + RAYON)
      h = Math.max(h, m.h);
  return h;
}

/* Une image de marche. `lacet` est la direction du regard, `axe` l'état du
   manche tactile ({x, y}), `touches` un ensemble de touches enfoncées. */
function avance(dt, cmd){
  const t = cmd.touches || joueur.touches;
  const axe = cmd.axe || { x:0, y:0 };
  const lacet = cmd.lacet || 0;
  const enf = (...l) => l.some(k => t.has(k));

  // Le clavier donne 0 ou 1, le manche une valeur continue : on les additionne,
  // puis on borne. Les deux peuvent servir en même temps.
  const av = Math.max(-1, Math.min(1,
    (enf("z","w","arrowup") ? 1 : 0) - (enf("s","arrowdown") ? 1 : 0) - axe.y));
  const dr = Math.max(-1, Math.min(1,
    (enf("d","arrowright") ? 1 : 0) - (enf("q","a","arrowleft") ? 1 : 0) + axe.x));

  // On se déplace dans le plan : le tangage sert à regarder, pas à voler.
  const c = Math.cos(lacet), si = Math.sin(lacet);
  let dx = si*av + c*dr, dz = -c*av + si*dr;
  const n = Math.hypot(dx, dz);
  if(n > 0){
    // On garde l'intensité du manche : marcher doucement au bord de la fosse
    // doit rester possible. Le clavier sature à 1, donc rien ne change pour lui.
    const vit = (enf("shift") ? COURSE : VITESSE) * Math.min(1, n);
    dx = dx/n*vit; dz = dz/n*vit;
  }

  // Amortissement plutôt qu'affectation : le départ et l'arrêt gardent un peu
  // d'inertie, sans quoi la marche a l'air d'un curseur qu'on fait glisser. En
  // l'air on n'a presque plus de prise — on ne se dirige pas dans le vide.
  const k = Math.min(1, dt*(joueur.auSol ? 14 : 3.2));
  joueur.v[0] += (dx - joueur.v[0])*k;
  joueur.v[2] += (dz - joueur.v[2])*k;

  // Horizontal, un axe à la fois : buter contre un mur ne doit pas annuler le
  // glissement le long de ce mur, sinon on se colle dans les angles.
  const bx = V.L/2 - RAYON, bz = V.P/2 - RAYON;
  const essaie = (i, d) => {
    const q = joueur.p.slice();
    q[i] = Math.min(i === 0 ? bx : bz, Math.max(i === 0 ? -bx : -bz, q[i] + d));
    if(joueur.auSol && hauteurSol(q[0], q[2]) - joueur.p[1] > MARCHE) return;
    joueur.p[i] = q[i];
  };
  essaie(0, joueur.v[0]*dt);
  essaie(2, joueur.v[2]*dt);

  // Vertical.
  if(joueur.auSol && enf(" ")){ joueur.v[1] = SAUT; joueur.auSol = false; }
  joueur.v[1] -= PESANTEUR*dt;
  joueur.p[1] += joueur.v[1]*dt;

  const sol = hauteurSol(joueur.p[0], joueur.p[2]);
  if(joueur.p[1] <= sol){
    joueur.p[1] = sol;
    if(joueur.v[1] < 0) joueur.v[1] = 0;
    joueur.auSol = true;
  } else if(joueur.p[1] > sol + 0.02) joueur.auSol = false;
  joueur.p[1] = Math.min(joueur.p[1], V.H - TAILLE - 0.05);

  // Le balancement du pas. Deux centimètres — mais c'est lui qui sépare marcher
  // de glisser, et on le remarque surtout quand il manque.
  const allure = Math.hypot(joueur.v[0], joueur.v[2]);
  joueur.pas += dt*allure*2.6;
  if(allure < 0.05) joueur.pas *= Math.max(0, 1 - dt*6);
}

// Poser le personnage quelque part, proprement : sur le sol, à l'arrêt.
function pose(x, z){
  joueur.p = [x, hauteurSol(x, z), z];
  joueur.v = [0, 0, 0];
  joueur.auSol = true;
  joueur.pas = 0;
}

global.ARPENTE = {
  joueur, MEUBLES, TAILLE, RAYON, MARCHE, VITESSE, COURSE, SAUT, PESANTEUR,
  hauteurSol, avance, pose, majMobilier,
};

})(typeof window !== "undefined" ? window : globalThis);
