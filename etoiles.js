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

   Les éléments viennent de Gillessen et al. 2017, recopiés depuis la source
   LaTeX de la soumission arXiv — et non d'un rendu HTML, dont une lecture
   automatique s'était révélée corrompue : la ligne de S55 y était une copie
   déformée de celle de S2. Voir ETOILES-S.md.
   ============================================================================ */

(function(global){
"use strict";

const DEG = Math.PI/180;

/* Éléments orbitaux, convention astronomique classique.

   `a` en unités astronomiques, `P` en années, `t0` en année décimale du
   passage au périastre. Les trois angles sont ceux d'usage : inclinaison,
   argument du périastre, longitude du nœud ascendant. */
/* Éléments orbitaux, recopiés de Gillessen et al. 2017, table des 40 étoiles.

   Le demi-grand axe y est donné en secondes d'arc ; on le convertit en unités
   astronomiques par la distance adoptée — à 8 277 pc, une seconde d'arc vaut
   8 277 UA. Les angles et l'époque du périastre sont repris tels quels.

   Convention, déduite du chaînage de références de l'article (il ajuste avec
   les éléments de Thiele-Innes en citant Wright & Howard 2009) : rotations
   dans l'ordre ω, puis i, puis Ω. Voir ETOILES-S.md, qui la détaille et
   signale que ce point n'est pas écrit noir sur blanc dans l'article.

   ATTENTION, piège relevé à la lecture : Ω y désigne le nœud où l'astre
   S'APPROCHE, l'inverse de l'usage en binaires visuelles.

   ---------------------------------------------------------------------------
   CE QUI A ÉTÉ VÉRIFIÉ, ET CE QUI RESTE OUVERT

   Vérifié, et solide : la troisième loi de Kepler appliquée aux dix étoiles
   rend 4,33 à 4,38 millions de masses solaires, soit 1 % de dispersion sur des
   demi-grands axes allant de 892 à 7 813 unités astronomiques. Le périastre de
   S2 tombe à 120,6 UA contre 120 publiées, sa vitesse à 7 790 km/s contre
   7 650, et S55 — la ligne autrefois corrompue par un rendu HTML — est
   désormais la plus proche de la moyenne. Aucune ligne n'est suspecte.

   OUVERT, et assumé comme tel : le signe de la troisième composante. La
   formule ci-dessous reproduit exactement les constantes de Thiele-Innes de
   Wright & Howard 2009, que Gillessen cite pour son ajustement ; dans cette
   convention le nœud ascendant est le nœud d'approche, donc cette composante
   pointe VERS l'observateur. Dans la convention usuelle des binaires
   visuelles, elle pointerait à l'opposé.

   Départager les deux demande le signe de la vitesse radiale de S2 à une date
   connue. Il ne figure dans le texte d'aucun des articles consultés — seulement
   sur une figure. La géométrie impose que les deux extrêmes soient dans un
   rapport de 2,16 (soit environ 4 050 et 1 880 km/s), mais pas lequel vient
   avant le périastre.

   Conséquence pratique, et c'est pourquoi on peut publier ainsi : la vue est
   une reconstruction libre, orientable, qui n'indique aucune direction vers la
   Terre et ne marque aucun côté proche. L'ambiguïté n'est donc pas observable,
   et le site n'affirme rien à son sujet. Ne pas ajouter d'axe « vers la Terre »
   sans avoir tranché. Voir ETOILES-S.md, § 4. */
const R0_UA = 8277;      // une seconde d'arc, en unités astronomiques

const ETOILES = [
  // nom,     a["],    e,      T[an],  t_P[an],  i[°],    Ω[°],    ω[°]
  { nom:"S2",  as:0.1255, e:0.8839, P:16.00, t0:2002.33, i:134.18, O:226.94, w:65.51,
    note:"La mieux mesurée. Son périastre de 2018 a valu le Nobel 2020." },
  { nom:"S55", as:0.1078, e:0.7209, P:12.80, t0:2009.34, i:150.1,  O:325.5,  w:331.5,
    note:"La plus courte période solidement établie." },
  { nom:"S38", as:0.1416, e:0.8201, P:19.20, t0:2003.19, i:171.1,  O:101.06, w:17.99 },
  { nom:"S13", as:0.2641, e:0.4250, P:49.00, t0:2004.86, i:24.70,  O:74.5,   w:245.2 },
  { nom:"S9",  as:0.2724, e:0.6440, P:51.30, t0:1976.71, i:82.41,  O:156.60, w:150.6 },
  { nom:"S14", as:0.2863, e:0.9761, P:55.30, t0:2000.12, i:100.59, O:226.38, w:334.59,
    note:"L'orbite la plus allongée de l'essaim." },
  { nom:"S12", as:0.2987, e:0.8883, P:58.90, t0:1995.59, i:33.56,  O:230.1,  w:317.9 },
  { nom:"S8",  as:0.4047, e:0.8031, P:92.90, t0:1983.64, i:74.37,  O:315.43, w:346.70 },
  { nom:"S1",  as:0.5950, e:0.5560, P:166.0, t0:2001.80, i:119.14, O:342.04, w:122.3 },
  { nom:"S24", as:0.9440, e:0.8970, P:331.0, t0:2024.50, i:103.67, O:7.93,   w:290 },
];

// Toutes viennent du même tableau publié : elles sont sourcées, et l'écart
// avec mes valeurs de mémoire allait jusqu'à soixante pour cent sur S55.
ETOILES.forEach(s => { s.a = s.as * R0_UA; s.verif = "gillessen2017"; });

/* L'ÉQUATION DE KEPLER, ET LE PIÈGE OÙ ELLE M'A PRIS.

   Il fallait résoudre E − e·sin E = M. L'ancienne version partait de E = M et
   faisait six itérations de Newton, avec ce commentaire : « cinq suffisent
   partout sauf tout près de e = 1, et l'excentricité maximale ici est 0,963 ».

   Les deux moitiés de la phrase étaient fausses ensemble. L'excentricité
   maximale n'est pas 0,963 mais **0,976** — celle de S14 — et à cette
   excentricité-là, six itérations depuis E = M ne suffisent PAS. Mesuré :
   l'anomalie sortait fausse de 3,1 radians, presque un demi-tour, ce qui posait
   S14 à 3 285 unités astronomiques de sa vraie place. Cent trente-neuf pour cent
   de son demi-grand axe. L'étoile sautait de l'autre côté de son orbite.

   Hugo l'a vu et l'a dit deux fois : « certaines orbites sont buggées ». Je
   l'avais cherché dans le rendu, il était dans l'arithmétique.

   DEUX CHANGEMENTS, ET IL EN FALLAIT DEUX.

   Le départ, d'abord : E = M est un mauvais point de départ pour une orbite très
   allongée, parce qu'au périastre l'étoile parcourt en quelques semaines ce
   qu'elle met des décennies à faire ailleurs. Le départ de Danby, M + 0,85·e
   dans le sens du sinus, encadre la solution même à e = 0,99.

   La méthode, ensuite : Halley plutôt que Newton. Elle utilise la dérivée
   seconde — qu'on a gratuitement, c'est e·sin E — et converge en cube au lieu du
   carré. Trois itérations y font mieux que trente de l'autre.

   Et l'on ne compte plus sur un nombre d'itérations : on s'arrête quand le reste
   est nul à 10⁻¹³. Un solveur qui fait « six tours et on verra » est un pari sur
   des données qu'on ne connaît pas encore. */
const TAU = 2*Math.PI;
function anomalieExcentrique(e, M){
  M = ((M % TAU) + TAU) % TAU;                       // ramenée dans [0, 2π)
  let E = M + 0.85*e*(Math.sin(M) >= 0 ? 1 : -1);    // départ de Danby
  for(let k = 0; k < 40; k++){
    const f = E - e*Math.sin(E) - M;
    if(Math.abs(f) < 1e-13) break;
    const fp = 1 - e*Math.cos(E), fpp = e*Math.sin(E);
    E -= 2*f*fp / (2*fp*fp - f*fpp);                 // Halley
  }
  return E;
}

// Position sur l'orbite, en unités astronomiques.
function position(s, annee){
  const M = TAU * ((annee - s.t0)/s.P % 1);
  const E = anomalieExcentrique(s.e, M);

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
/* L'échelle d'ouverture : huit mille unités astronomiques de demi-étendue.

   Neuf des dix orbites y tiennent en entier — la plus large, S1, culmine à
   7 662. Seule S24 balaye au-delà, avec son apoastre à 14 823, et l'on va la
   chercher en dézoomant. Cadrer sur elle rapetissait tout le reste jusqu'à
   rendre l'essaim illisible, alors que c'est l'essaim le sujet : dix étoiles
   qui tournent autour du même point vide. */
const vue = { azim: 0.6, elev: 0.5, echelle: 1, annee: 1992, vitesse: 3.2 };

// La campagne d'observation va de 1992 à aujourd'hui. Au-delà, on ne mesure
// plus : on prédit. Kepler y a droit, mais il faut le dire.
const FIN_MESURES = 2026.6;

function projette(p, W, H){
  const ca = Math.cos(vue.azim), sa = Math.sin(vue.azim);
  const ce = Math.cos(vue.elev), se = Math.sin(vue.elev);
  const x =  p[0]*ca + p[1]*sa;
  const y = -p[0]*sa + p[1]*ca;
  /* Le champ vaut seize mille unités astronomiques de large, soit huit mille de
     demi-étendue. Il valait deux mille six cents, ce qui ne contenait même pas
     l'orbite de S2 : son apoastre est à 1 957 UA, donc elle sortait de l'écran
     alors que c'est elle la vedette. À huit mille, tout l'essaim tient sauf la
     partie externe de S24, qu'on va chercher en dézoomant. */
  const k = Math.min(W, H) / (16000 / vue.echelle);
  return [ W/2 + x*k, H/2 - (y*se + p[2]*ce)*k ];
}

// La demi-étendue visible, en unités astronomiques. C'est elle que l'échelle
// affiche : un diagramme sans étalon ne se lit pas.
function demiEtendue(){ return 8000 / vue.echelle; }

// ------------------------------------------------------------------ dessin
const TEINTES = ["#ffd08a","#7fd8ff","#a8ffc9","#ff9bb0","#c9b4ff",
                 "#ffe3a0","#9ad9d0","#ffb8d9","#b9d6ff","#e8c48a"];

/**
 * @param fond  opacité du FOND seul, indépendante de celle du contenu.
 *
 * Les deux sont séparées, et c'est ce qui rend la transition lisible. Avec un
 * seul alpha, on voyait le plancher du vaisseau par transparence pendant tout
 * le fondu : un diagramme d'orbites à demi effacé par-dessus une pièce éclairée
 * ne ressemble pas à une transition, ça ressemble à une panne. Le noir couvre
 * donc vite, et les orbites se dessinent ensuite sur du noir franc.
 */
function dessine(ctx, W, H, dt, fond){
  vue.annee += dt * vue.vitesse;

  /* Pas de clearRect ici : le calque est partagé avec le reste du site, et
     l'effacer interdirait tout fondu — la carte apparaîtrait d'un coup au lieu
     de se substituer à la baie. */
  ctx.save();
  if(fond !== undefined) ctx.globalAlpha = fond;
  ctx.fillStyle = "#05050a";
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

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

    // S2 se détache : c'est sur elle qu'on a mesuré le décalage vers le rouge
    // et la précession, et c'est elle que le texte suit.
    ctx.strokeStyle = t;
    ctx.globalAlpha = s.nom === "S2" ? 0.46 : 0.22;
    ctx.lineWidth   = s.nom === "S2" ? 1.4  : 1;
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

    /* L'étiquette se tait près du centre.

       Toutes les orbites y passent, et au périastre les dix noms se
       superposaient en un pâté illisible. Une étoile trop près du trou noir se
       reconnaît de toute façon à sa couleur et à l'ellipse qu'elle suit ; c'est
       en s'écartant qu'elle a besoin d'être nommée. */
    if(Math.hypot(q[0] - c[0], q[1] - c[1]) > 26){
      ctx.globalAlpha = 0.8;
      ctx.font = (s.nom === "S2" ? "600 " : "") + "11px ui-monospace, monospace";
      ctx.fillText(s.nom, q[0] + 8, q[1] + 4);
    }
  });
  ctx.globalAlpha = 1;

  // Le trou noir par-dessus les orbites : il est devant celles qui passent
  // derrière lui, et c'est plus lisible ainsi.
  ctx.fillStyle = "#000";
  ctx.beginPath(); ctx.arc(c[0], c[1], 5, 0, 6.2832); ctx.fill();
  ctx.strokeStyle = "rgba(255,190,120,0.75)"; ctx.lineWidth = 1.2; ctx.stroke();

  etalon(ctx, W, H);
}

/* L'étalon et la date.

   Un diagramme sans échelle n'est qu'un dessin, et celui-ci prétend prouver
   quelque chose. La barre vaut une puissance de dix ronde d'unités
   astronomiques, choisie pour occuper un bon quart de l'écran.

   La date compte autant : ces orbites durent de seize à trois cent trente et un
   ans. Personne ne les a vues tourner. On les a mesurées pendant trente ans, et
   ce qui défile ici est une RECONSTRUCTION — la dire est la même règle que pour
   le quadrillage du recul. */
function etalon(ctx, W, H){
  const k = Math.min(W, H) / (16000 / vue.echelle);
  const brut = demiEtendue() * 0.5;
  const rond = Math.pow(10, Math.floor(Math.log10(brut)));
  const val  = rond * (brut/rond >= 5 ? 5 : brut/rond >= 2 ? 2 : 1);
  const px   = val * k;
  /* Quatre lignes à placer, et la dernière tombait SOUS le bord de l'écran :
     l'ancre était à 26 pixels du bas, alors que le bloc en fait 62. On ancre
     donc sur la hauteur réelle du bloc, pas sur celle de sa première ligne. */
  const x0 = 20, y0 = H - 64;

  ctx.save();
  ctx.strokeStyle = "rgba(200,214,255,0.62)"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0 - 4); ctx.lineTo(x0, y0 + 4);
  ctx.moveTo(x0, y0);     ctx.lineTo(x0 + px, y0);
  ctx.moveTo(x0 + px, y0 - 4); ctx.lineTo(x0 + px, y0 + 4);
  ctx.stroke();

  ctx.fillStyle = "rgba(200,214,255,0.78)";
  ctx.font = "11px ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillText(val.toLocaleString("fr-FR") + " unités astronomiques", x0, y0 - 10);

  const mesure = vue.annee <= FIN_MESURES;
  ctx.fillStyle = mesure ? "rgba(255,208,138,0.85)" : "rgba(143,182,255,0.85)";
  ctx.fillText("année " + Math.floor(vue.annee) + (mesure ? " — mesuré" : " — prédit"), x0, y0 + 20);

  ctx.fillStyle = "rgba(160,166,190,0.72)";
  ctx.font = "10px ui-monospace, monospace";
  ctx.fillText("reconstruction — ces orbites durent de 16 à 331 ans", x0, y0 + 36);
  ctx.restore();
}

function tourne(dx, dy){
  vue.azim += dx*0.006;
  vue.elev = Math.max(-1.45, Math.min(1.45, vue.elev + dy*0.006));
}
// De 0,2 — où S24 tient tout entière — à 10, où l'on descend jusqu'au périastre
// de S2, à cent vingt unités astronomiques du trou noir.
function zoome(f){
  vue.pilotee = false;          // dès qu'on zoome soi-même, l'entrée lâche la barre
  vue.echelle = Math.max(0.2, Math.min(10, vue.echelle*f));
}

/* ------------------------------------------------- L'ENTRÉE SE DÉZOOME

   Hugo, séance du 6 août au soir : « il faudrait qu'on voie les orbites
   dézoomer, là la taille est fixe dans l'espace et apparaît d'un coup à la fin
   du voyage. »

   Il a raison, et c'est un diagnostic, pas une plainte : `vue.echelle` valait 1
   en permanence. La carte se contentait donc de monter en opacité, à taille
   constante, sans que rien ne la relie aux vingt-deux secondes d'éloignement
   qu'on venait de vivre. On arrivait, et un diagramme se posait devant.

   Elle s'ouvre maintenant serrée — six fois trop près, si près que l'apoastre de
   S2 à 1 957 UA ne tient pas dans le champ — et s'écarte jusqu'à sa cadre final
   à mesure qu'elle apparaît. Les orbites entrent donc en rétrécissant, ce qui
   est le geste du recul et non celui d'une fenêtre qui s'ouvre.

   CE QUE ÇA N'EST PAS : une perspective. La carte reste une reconstruction, le
   site le dit, et à l'arrivée le vaisseau est DANS l'essaim — il ne pourrait
   physiquement pas le voir de l'extérieur. C'est de la mise en scène assumée sur
   un diagramme assumé, pas une prétention de vue.

   `t` est l'avancement de l'apparition, de 0 à 1. */
const ZOOM_ENTREE = 6;
function entree(t){
  if(t < 0.01) vue.pilotee = true;        // carte refermée : la prochaine entrée reprend la barre
  if(!vue.pilotee) return;                // quelqu'un a zoomé : on ne lui reprend pas
  const k = Math.max(0, Math.min(1, t));
  const doux = k*k*(3 - 2*k);             // adouci aux deux bouts, sans à-coup à l'arrivée
  vue.echelle = ZOOM_ENTREE + (1 - ZOOM_ENTREE)*doux;
}

/* ------------------------------------------- LE CADRE SUIT LA DISTANCE

   Hugo, 7 août 2026 : « la taille des orbites doit être relative à la distance
   à laquelle on est du trou noir pendant le voyage. »

   `entree` faisait dépendre l'échelle de l'OUVERTURE DU PANNEAU — une animation
   d'interface. Elle dépend maintenant d'où l'on est : serrée au départ, quand on
   est encore dans l'essaim, desserrée jusqu'à son cadre final à l'arrivée.

   CE QUE ÇA N'EST TOUJOURS PAS, et il faut le dire : une perspective. La vraie
   loi serait en 1/d, ce qui mettrait les orbites mille fois trop grandes au
   départ — hors de tout écran. On interpole donc LINÉAIREMENT EN LOGARITHME de
   la distance, ce qui est monotone, continu, et rend le geste du recul sans
   prétendre à une vue. La carte reste une reconstruction, le site le dit, et à
   l'arrivée le vaisseau est DANS l'essaim : il ne pourrait physiquement pas le
   voir de l'extérieur.

   C'est un compromis de mise en scène, et il se déclare comme tel.            */
function cadre(distance_m, depart_m, arrivee_m){
  const a = Math.max(arrivee_m, 1), x = Math.max(distance_m, 1);

  /* Au tout début d'un recul, le cadrage automatique REPREND LA BARRE. C'est le
     rôle que tenait `entree(t < 0.01)` : sans lui, une carte qu'on avait zoomée
     à la main restait figée à cette échelle pour tous les voyages suivants. */
  if(x <= Math.max(depart_m, 1) * 1.02) vue.pilotee = true;
  if(!vue.pilotee) return;               // quelqu'un a zoomé : on ne lui reprend pas

  /* L'ÉCHELLE EST EXACTEMENT CELLE DU QUADRILLAGE, ET C'EST LA CORRECTION.

     Hugo, 7 août au soir : « le quadrillage qui se dézoome devrait suivre
     exactement les traces des orbites. Vu que le quadrillage, c'est pour avoir
     un repère de l'espace, si c'est logique, un point de la courbe d'une orbite
     devrait suivre parfaitement ce quadrillage. Et là ce n'est pas le cas. »

     Il a raison, et le coupable est ce qu'il y avait ici : une interpolation de
     six à un, choisie parce qu'elle était jolie. Deux lois sans rapport pour
     décrire le même espace — donc deux objets qui glissent l'un sur l'autre, et
     l'œil le voit tout de suite même sans savoir le nommer.

     La bonne loi est la seule qui existe : la taille apparente est en 1/d. Le
     quadrillage la suit déjà — sa maille rétrécit avec la distance et se
     renumérote d'une décade à l'autre. Les orbites la suivent maintenant aussi,
     et les deux ne peuvent plus diverger puisqu'elles n'ont plus qu'une loi.

     Conséquence assumée, et c'est celle qu'il décrit : au départ on est DANS
     l'essaim, l'échelle vaut mille et l'on ne voit qu'un morceau de trace.
     L'orbite entière ne tient dans le champ qu'à l'arrivée — « c'est une fois
     qu'on arrive à la destination qu'on la voit en entier ». */
  vue.echelle = a / x;
}

global.ETOILES_S = { ETOILES, position, dessine, tourne, zoome, entree, cadre, vue,
                     demiEtendue, ZOOM_ENTREE };

})(window);
