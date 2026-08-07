/* ============================================================================
   L'habitacle — la passe WebGL du salon, posée AVANT le ciel.

   Elle ne dessine pas une image de plus par-dessus les autres : elle remplit
   le tampon de profondeur. La baie n'est pas un objet, c'est l'absence
   d'objet — la profondeur y reste au maximum, et c'est par ce trou que le
   triangle plein écran du lancer de géodésiques passera juste après, avec son
   test « inférieur ou égal ». Deux fragments sur trois cessent ainsi d'être
   calculés pour être recouverts.

   Ce module ne modèle rien : la géométrie vit dans `vaisseau.js`, l'occupant
   dans `personnage.js`, le drone dans `robot.js`. Ici on ORDONNE — on active
   le programme du salon, on pousse ses uniformes, et on décide qui brille.

   ---------------------------------------------------------------------------
   POURQUOI CE MODULE NE CHERCHE RIEN DANS `window`

   Même règle qu'`ecrans.js` et `vaisseau.js` : `gl` arrive en argument, et
   tout le reste avec lui. C'est la seule passe WebGL du chantier F2, donc la
   seule qui ne pourra jamais tourner sans machine graphique — raison de plus
   pour que tout le reste soit remplaçable par un faux. Avec un `gl` qui note
   ses appels, un faux `VAISSEAU` et un faux `ROBOT`, on peut vérifier hors
   navigateur ce qu'aucun œil ne voit vite : qu'on n'active le programme
   qu'une fois, que `uForce` retombe bien à 0 après les postes, qu'un poste
   modelé n'est pas recouvert de sa propre boîte de visée, et que Lumen ne
   reçoit son ancre que pendant l'étape qui la demande.

   La conséquence pratique : une dépendance oubliée lève une exception au
   premier appel, là où une lecture dans `window` aurait continué de marcher
   dans la page et de casser dans le contrôle.

   ---------------------------------------------------------------------------
   LE CONTRAT

     HABITACLE.dessine(gl, e)   pose l'habitacle, et rend le NOMBRE de volumes
                                réellement posés : la coque, chaque poste
                                dessiné, chaque occupant, soi-même s'il y a
                                lieu, et Lumen.

   Ce que `e` doit porter :

     e.prog        le programme du salon, déjà lié — on l'active ici, et un
                   `gl.uniform*` ne s'applique qu'au programme COURANT : c'est
                   la faute qui avait figé la caméra sur la première image.
     e.uniformes   les emplacements, créés à l'initialisation de la page et
                   jamais redemandés :
                     uMVP, uModele, uVersAstre, uEclatAstre, uLampes,
                     uBaieX, uBaieBas, uBaieHaut, uBaieZ,
                     uOeil, uTeinteF, uEmiF, uForce
     e.M           la matrice de la pièce (`mvpSalon()`)
     e.oeil        la position de l'œil dans la pièce (`oeilSalon()`) — la
                   MÊME que celle d'où `e.M` a été bâtie, sans quoi le
                   spéculaire se pose ailleurs que le regard
     e.salon       l'état du salon : versAstre, eclat, vise, horloge, facteur,
                   lacet
     e.vaisseau    VAISSEAU — on y lit BAIE, P, FOSSE, POSTES, AMBRE, CYAN, et
                   ses deux fonctions de tracé
     e.postes      { POSTE_LUMEN } — seul POSTE_LUMEN est lu, et comparé à
                   `salon.vise` par IDENTITÉ. La LISTE des postes, elle, vient
                   de `e.vaisseau.POSTES` : c'est le vaisseau qui la tient.
     e.lumen       où Lumen se trouve À CET INSTANT, soit `ROBOT.pose(horloge)`
                   — ce n'est PAS `POSTE_LUMEN.c`, qui n'est réécrit que
                   lorsqu'on vise et que la bulle suivrait donc en retard.
     e.lampes      l'état des lampes du bord (booléen)

   Ce qui a été AJOUTÉ au contrat imposé, faute de quoi il aurait fallu aller
   le chercher dans `window` :

     e.personnage  PERSONNAGE — les occupants et soi-même
     e.robot       ROBOT — sa ronde, son attente, son tracé
     e.joueur      le corps : `vue` (1 ou 3) et `p`
     e.quete       { QUETE, iQuete, actif } — l'étape courante désigne le poste
                   à mettre en avant. Même objet que celui d'`ecrans.js`, pour
                   que la page n'en compose pas deux.
     e.projette    (p, M) -> [x, y] en pixels CSS, ou null derrière la coupure
     e.regard      () -> { av, dr } — le repère du regard dans la pièce
     e.vue         { W, H } — la fenêtre en pixels CSS, pour borner la bulle
     e.bulle       l'élément de la bulle de Lumen. C'est du DOM dans une passe
                   WebGL, et ça n'y a pas sa place — voir la note plus bas.
     e.questionsOuvertes   vrai quand on parle au drone : il reste alors
                   pleinement éveillé même si l'on ne le vise plus
   ============================================================================ */

(function(global){
"use strict";

/* La matrice neutre, pour la pièce elle-même : elle est donnée dans les
   coordonnées du salon, il n'y a rien à lui appliquer. Constante, donc
   allouée une fois — la reconstruire à chaque image ferait un déchet de plus
   par image pour un tableau qui ne change jamais. */
const IDENTITE = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);

/* Le point de la PIÈCE où Lumen vient attendre.

   Il vit ici, et pas dans la page, parce que c'est ici qu'il est posé et
   qu'il est oublié — un état à deux écrivains est la maladie qui a donné le
   disque à 622×. Il se fixe au moment où l'on demande au drone de venir, et
   il ne bouge plus tant qu'on ne s'en éloigne pas vraiment. */
let ancreLumen = null;

/* La matrice d'un poste : une boîte unité mise à l'échelle de `d` et posée en
   `c`. Colonne majeure, comme tout ce que WebGL attend. Le cube de
   `vaisseau.js` est le même pour tous les postes ; seule cette matrice change,
   ce qui évite de reconstruire de la géométrie pour changer une couleur. */
function matricePoste(p){
  return new Float32Array([
    p.d[0],0,0,0,  0,p.d[1],0,0,  0,0,p.d[2],0,  p.c[0],p.c[1],p.c[2],1 ]);
}

function dessine(gl, e){
  const { prog, uniformes:U, M, oeil, salon, vaisseau:V, postes, lumen, lampes,
          personnage, robot, joueur, quete, projette, regard, vue, bulle,
          questionsOuvertes } = e;

  /* On compte les volumes posés plutôt que de rendre `undefined`.

     Ce n'est pas de la politesse d'API : c'est la seule prise qu'un contrôle
     a sur cette fonction. Un poste qui cesse d'être dessiné, un occupant qui
     disparaît, la coque qui ne part plus — tout cela est invisible depuis
     dehors si la fonction se tait, et parfaitement visible si elle compte. */
  let volumes = 0;

  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(prog);
  gl.uniformMatrix4fv(U.uMVP, false, M);
  gl.uniform3fv(U.uVersAstre, salon.versAstre);
  gl.uniform1f(U.uEclatAstre, salon.eclat);
  gl.uniform1f(U.uLampes, lampes ? 1 : 0);
  /* L'ouverture de la baie part au nuanceur : c'est par elle que la lumière
     de l'astre entre, et le fragment a besoin de savoir s'il la voit. La
     géométrie de l'ouverture appartient au vaisseau, jamais à la page. */
  gl.uniform1f(U.uBaieX, V.BAIE.x/2);
  gl.uniform1f(U.uBaieBas, V.BAIE.bas);
  gl.uniform1f(U.uBaieHaut, V.BAIE.haut);
  gl.uniform1f(U.uBaieZ, -V.P/2);
  gl.uniform3fv(U.uOeil, oeil);
  gl.uniform1f(U.uForce, 0);
  gl.uniformMatrix4fv(U.uModele, false, IDENTITE);
  V.dessine(gl);
  volumes++;

  // Les postes. Le cran retenu est ambre et franc ; les autres sont cyan et
  // sourds ; celui qu'on vise s'éclaire. C'est tout ce qu'il faut pour qu'on
  // comprenne qu'un objet du décor se manipule, sans une ligne de didacticiel.
  gl.uniform1f(U.uForce, 1);
  // L'étape en cours, s'il y en a une : elle désigne le poste à mettre en avant.
  const attendu = (quete.actif && quete.QUETE[quete.iQuete])
                ? quete.QUETE[quete.iQuete].id : null;
  for(const p of V.POSTES){
    /* Deux familles de postes, et la distinction n'est pas cosmétique.

       Les lames du temps N'ONT PAS de géométrie propre : le cube dessiné ici
       EST la lame. Le télescope et la console de tir, eux, sont modelés dans
       `vaisseau.js` — leur boîte ne sert qu'à les viser, et la dessiner
       poserait un pavé cyan de soixante-dix centimètres sur l'instrument.

       Je l'ai appris en posant la console : elle apparaissait comme un bloc
       bleu uniforme, et j'ai cherché la faute dans ses teintes, dans son
       placement, jusque dans l'alignement des attributs de sommets. La vraie
       géométrie était dessous, cachée par sa propre zone de visée. */
    if(p.id === "telescope" || p.id === "tir"){
      const appele = attendu === "a-telescope" && p.id === "telescope";
      if(salon.vise !== p && !appele) continue;
      gl.uniform3fv(U.uTeinteF, V.AMBRE);
      gl.uniform1f(U.uEmiF, salon.vise === p ? 0.17
                   : 0.05 + 0.06*Math.sin(salon.horloge*3.1));
      gl.uniformMatrix4fv(U.uModele, false, matricePoste(p));
      V.dessineCube(gl);
      volumes++;
      continue;
    }
    const retenu = p.valeur === salon.facteur;
    const vise = salon.vise === p;
    /* Ce qui respire s'active.

       Sur un téléphone il n'y a pas de survol : rien n'indiquait qu'on
       pouvait toucher ces lames, et l'étape restait bloquée. Elles pulsent
       donc — mais seulement pendant l'étape qui les demande, et seulement
       celles-là. Un décor où tout clignote ne désigne plus rien. */
    const battement = attendu === "a-temps"
                    ? 0.30 + 0.30*Math.sin(salon.horloge*3.1) : 0;
    gl.uniform3fv(U.uTeinteF, retenu ? V.AMBRE : V.CYAN);
    gl.uniform1f(U.uEmiF, retenu ? 1.0 : Math.max(vise ? 0.72 : 0.20, battement));
    gl.uniformMatrix4fv(U.uModele, false, matricePoste(p));
    V.dessineCube(gl);
    volumes++;
  }
  /* On rend `uForce` à 0 AVANT les corps.

     Les postes imposent leur teinte et leur émission à tout le maillage ;
     les occupants, eux, portent les leurs par sommet. Oublier cette ligne ne
     casse rien de visible tant qu'on ne vise personne — et repeint ensuite
     les trois personnages et le drone en ambre uni. */
  gl.uniform1f(U.uForce, 0);

  // Les occupants. Ils sont dans la fosse, accoudés à la main courante, et
  // regardent là où est l'astre. Deux suffisent à ce que le lieu soit habité.
  const versAstre = Math.atan2(salon.versAstre[0], -salon.versAstre[2]);
  const envoie = Mo => gl.uniformMatrix4fv(U.uModele, false, Mo);
  personnage.dessine(gl, envoie,
    [1,0,0,0, 0,1,0,0, 0,0,1,0, -1.40,V.FOSSE,-3.05,1],
    salon.horloge, versAstre);
  personnage.dessine(gl, envoie,
    [1,0,0,0, 0,1,0,0, 0,0,1,0, 1.95,V.FOSSE,-2.70,1],
    salon.horloge + 11.3, versAstre);
  volumes += 2;

  // Soi-même, à la troisième personne. En première on ne se dessine pas :
  // on verrait l'intérieur de son propre casque.
  if(joueur.vue === 3){
    const c = Math.cos(salon.lacet), si = Math.sin(salon.lacet);
    personnage.dessine(gl, envoie,
      [c,0,-si,0, 0,1,0,0, si,0,c,0, joueur.p[0],joueur.p[1],joueur.p[2],1],
      salon.horloge, 0);
    volumes++;
  }

  /* La bulle suit le drone à l'écran. On la place sous lui, bornée aux
     marges : sinon elle sort du cadre dès qu'il passe près d'un bord, et
     l'on perd le lien qu'on cherchait justement à établir.

     C'est le seul bloc du fichier qui touche au DOM, et il est ici par
     accrétion, pas par nature : il n'a besoin de la passe que pour sa
     projection. Il reste tel quel — l'élément arrive par `e.bulle` au lieu
     d'être lu dans `window`, ce qui suffit à ce qu'un faux le remplace. */
  if(bulle.classList.contains("vu")){
    /* La position de Lumen et la matrice viennent de `e`, l'une et l'autre
       calculées une seule fois pour l'image : l'original rappelait ici
       `mvpSalon()`, qui refaisait le repère du regard et la projection pour
       rendre exactement la matrice déjà poussée dix lignes plus haut. */
    const q = projette(lumen, M);
    if(q){
      const marge = 170;
      const x = Math.max(marge, Math.min(vue.W - marge, q[0]));
      /* On dégage la hauteur du drone, qui n'est pas une constante.

         Trente-quatre pixels étaient toujours à l'intérieur de lui : à une
         longueur de bras et demie, sa silhouette fait déjà soixante pixels de
         rayon sur un téléphone. La bulle démarre donc sous son bord, et non
         sous son centre. */
      const rayonDrone = Math.max(46, vue.H*0.085);
      // On borne avec la hauteur RÉELLE de la bulle, pas avec une constante :
      // elle varie du simple au quintuple selon la longueur de la réplique.
      const h = bulle.offsetHeight || 140;
      const y = Math.max(60, Math.min(vue.H - h - 18, q[1] + rayonDrone));
      bulle.style.setProperty("--bulle-x", x + "px");
      bulle.style.setProperty("--bulle-y", y + "px");
    }
  }

  // Lumen. Il fait sa ronde, sauf quand l'étape demande qu'on lui parle :
  // il vient alors se placer à portée, et cesse de se dérober au doigt.
  if(attendu === "a-lumen"){
    /* L'ancre se calcule UNE FOIS, et elle reste dans la PIÈCE.

       Elle se recalculait à chaque image depuis la direction du regard : le
       drone était donc rivé à un point fixe de l'ÉCRAN et suivait la tête au
       degré près. On ne voyait plus un objet dans la salle mais une vignette
       plaquée sur l'objectif, et le viser revenait à se courir après —
       impossible au doigt.

       Elle ne se refait que si l'on s'en est vraiment éloigné, pour qu'il
       vienne nous retrouver quand on change de coin sans nous coller quand on
       tourne simplement la tête. La hauteur ignore le tangage : lever les yeux
       ne doit pas l'envoyer au plafond. */
    const oe = oeil;
    if(!ancreLumen ||
       Math.hypot(oe[0]-ancreLumen[0], oe[2]-ancreLumen[2]) > 2.4){
      const { av, dr } = regard();
      const pl = Math.hypot(av[0], av[2]) || 1;          // le regard, mis à plat
      ancreLumen = [ oe[0] + (av[0]/pl)*1.45 + dr[0]*0.42,
                     oe[1] - 0.06,
                     oe[2] + (av[2]/pl)*1.45 + dr[2]*0.42 ];
    }
    robot.veutAttendre(1, ancreLumen);
  } else { robot.veutAttendre(0); ancreLumen = null; }
  robot.dessine(gl, envoie, salon.horloge, oeil,
    (salon.vise === postes.POSTE_LUMEN || questionsOuvertes) ? 1
    : (attendu === "a-lumen" ? 0.55 : 0));
  volumes++;

  return volumes;
}

global.HABITACLE = { dessine };

})(window);
