/* ============================================================================
   LES GESTES — ce qu'un doigt qui glisse VEUT DIRE

   Dans le bloc d'`index.html`, un geste mêlait trois choses de natures
   différentes, et c'est ce mélange qui le rendait impossible à éprouver :

     · ÉCOUTER l'événement — `pointerdown`, `pointermove`, la capture du
       pointeur, le bouton droit. Ça ne peut pas sortir : c'est le navigateur.
     · TOUCHER le document — `setPointerCapture`, le curseur, le manche posé
       sous le pouce, le rectangle du canevas. Ça ne peut pas sortir non plus.
     · CALCULER ce que le geste VEUT DIRE — une vitesse de lancer, un
       écartement de pince, un nouvel angle de tête. Ça, ça doit sortir.

   Ce fichier est la troisième part, et rien d'autre. Il ne connaît ni
   `document`, ni `window`, ni le canevas. On peut donc lui poser la question
   « ce glissement-là, il lance une sonde à quelle vitesse ? » sans navigateur
   — et surtout sans jouer, ce qui est la seule façon de voir un seuil mal
   placé. Un seuil mal placé ne se voit JAMAIS en jouant : on croit qu'on a mal
   visé.

   ---------------------------------------------------------------------------
   LE GESTE CENTRAL DU SITE, ET SES TROIS RÈGLES

   On tire au doigt depuis un point du plan du disque, on lâche, une sonde part
   avec cette vitesse-là. Tout le jeu tient dans ce geste. Il porte trois règles,
   et chacune répare quelque chose de précis.

   1. UNE ZONE MORTE à 0,012 hauteur d'écran. Sous ce seuil, la fonction rend
      `null` et rien ne part. Sans elle, un doigt simplement POSÉ sur le disque
      lancerait une sonde à vitesse nulle — c'est-à-dire une chute droit dans le
      trou noir, offerte à qui voulait seulement regarder. Le seuil se compte en
      HAUTEURS D'ÉCRAN, pas en pixels : le même geste doit vouloir dire la même
      chose sur un téléphone et sur un grand écran.

   2. UN PLAFOND à 0,9. La vitesse demandée croît avec la longueur du geste,
      mais s'arrête là. Au-delà on ne simule plus grand-chose d'intéressant : la
      sonde part en ligne droite et sort du champ.

   3. LE RABATTEMENT DU REPÈRE ÉCRAN DANS LE PLAN DU DISQUE. C'est la règle
      qu'on oublie, et celle qui compte le plus. Le glissement se lit à l'écran ;
      la sonde, elle, part dans le plan du disque. Vu presque par la tranche,
      quelques pixels vers le haut de l'écran valent des dizaines d'unités dans
      le plan. On prend donc les deux axes de l'écran — droite et haut, lus dans
      la base de la caméra —, on les RABAT dans le plan (on annule leur
      composante verticale, on renormalise), et l'on compose le geste dans ce
      repère-là. Un lancer qui suivrait bêtement les pixels partirait de travers
      dès qu'on incline la vue, et personne ne saurait dire pourquoi.

   LES DEUX AXES DU GESTE SONT DIVISÉS PAR LA MÊME MESURE — la hauteur, pour
   les deux. Ce n'est pas une étourderie : c'est ce qui rend le geste ISOTROPE.
   Diviser l'horizontale par la largeur et la verticale par la hauteur ferait
   dépendre la DIRECTION du lancer de la forme de la fenêtre, et un même geste
   à 45° partirait ailleurs selon qu'on est en portrait ou en paysage. La
   largeur de l'image n'est donc pas lue ici, et ne doit pas l'être.

   ---------------------------------------------------------------------------
   LE CAS DÉGÉNÉRÉ — ÉCRIT ICI PLUTÔT QUE DÉCOUVERT UN JOUR

   Rabattre les axes de l'écran dans le plan du disque suppose qu'ils y laissent
   quelque chose. Il y a deux orientations où ce n'est pas le cas, et
   `norm([0,0,0])` — dont le repli est `|| 1` — rend alors le vecteur NUL au
   lieu de protester.

     · LA CAMÉRA EXACTEMENT DANS LE PLAN (élévation nulle). Le « haut » de
       l'écran est alors exactement vertical : son rabattement est nul. La part
       verticale du geste ne veut plus rien dire dans le plan — ce qui est
       géométriquement juste — mais elle continue de compter dans la LONGUEUR
       du geste, donc dans la vitesse. Un glissement vers le haut lance donc
       vite, et de côté. Et un glissement PUREMENT vertical rend
       `v = [0, 0, 0]` avec un champ `vitesse` non nul : les deux façons de dire
       la même chose se contredisent, sur cette orientation-là seulement.

     · LA CAMÉRA EXACTEMENT AU-DESSUS (élévation ±π/2). Là c'est la base
       elle-même qui dégénère en amont, dans `camera.js` : `d` et `h` y sont
       nuls. Tout geste rend alors `v = [0, 0, 0]` avec une `vitesse` non nulle.
       Cet état n'est pas atteignable par les commandes — l'élévation est serrée
       à ±1,35 dans la page — mais rien ne l'interdit à un appelant.

   RIEN DE TOUT CELA N'EST CORRIGÉ ICI, et c'est délibéré : ce module est une
   extraction, pas une réparation. Le comportement d'aujourd'hui est reproduit à
   l'identique. Ce qui change, c'est qu'il est maintenant ÉCRIT, et ÉPROUVÉ —
   `outil-verif-gestes.js` épingle ces deux cas, de sorte que le jour où
   quelqu'un décide de les traiter, le contrôle le dira au lieu de se taire.

   ---------------------------------------------------------------------------
   POURQUOI `cam`, `vue` ET `norm` ARRIVENT PAR ARGUMENT

   Dans la page, la fonction lisait `cv.clientHeight` et `cam.base` toute seule.
   Les trois raisons de le lui interdire sont celles de `camera.js`, et elles
   sont payées d'avance :

     `vue`   La taille de l'image est décidée ailleurs et CHANGE SOUS LES PIEDS
             — la barre d'adresse d'un téléphone se rétracte au défilement. Une
             fonction qui va chercher sa propre mesure peut en choisir une autre
             que sa voisine, et deux mesures pour une seule image donnent un
             écart qui ressemble à un défaut de physique. C'est arrivé, entre
             `projette` et `surLePlan`, et l'on a cherché une heure.

     `cam`   La caméra est UN OBJET détenu par la page, que `camera.js`
             remplit. Le module lit `cam.base` au moment de l'appel, donc la
             base du moment. Garder une référence à la base plutôt qu'à la
             caméra figerait celle de l'image où le module a été chargé.

     `norm`  Celle-là surprend, et c'est pour une raison précise : c'est son
             repli `|| 1` qui DÉCIDE de tout le cas dégénéré ci-dessus. La
             recopier ici en ferait une seconde loi pour le même espace, et le
             jour où `PHYSIQUE.norm` changerait d'avis sur le vecteur nul, ce
             fichier continuerait tranquillement de dire l'inverse. La page
             passe `PHYSIQUE.norm`, celle que tout le reste du site emploie.

   ---------------------------------------------------------------------------
   LA PINCE À DEUX DOIGTS, ET CE QU'ELLE NE VÉRIFIE PAS

   `centreDoigts` fait la moyenne de TOUS les contacts. `ecartDoigts` prend les
   DEUX PREMIERS et les seuls deux premiers — elle déstructure sans compter.
   Avec un seul doigt, elle lève une exception ; avec trois, elle mesure entre
   les deux premiers pendant que le centre, lui, en compte trois.

   Aujourd'hui c'est sans conséquence : les deux appels de la page sont sous un
   `doigts.size === 2`. La fonction n'est donc pas fausse, elle est NUE, et elle
   le reste ici — corriger en passant reviendrait à changer un comportement sous
   couvert de déménagement. Mais le jour où un troisième doigt se pose pendant
   une pince, la pince mélangera deux lois pour un même geste. Le contrôle
   épingle les deux comportements pour que ce jour-là fasse du bruit.

   ---------------------------------------------------------------------------
   LE REGARD SE REÇOIT ET SE REND — IL NE SE LIE PAS

   `regard()` ne touche à rien : elle reçoit un lacet, un tangage, un
   déplacement, et rend le nouveau couple. C'est la leçon de `nChute`, écrite
   noir sur blanc dans `index.html` : UN SCALAIRE RÉASSIGNÉ NE SE PARTAGE PAS
   ENTRE DEUX FICHIERS. Lier `salon.lacet` ici figerait la valeur du moment du
   chargement, et le module tournerait la tête d'un promeneur imaginaire pendant
   que le vrai resterait immobile. C'est la page qui garde l'état, et elle seule.

   LE TANGAGE EST SERRÉ, LE LACET NE L'EST PAS. On peut se retourner autant de
   fois qu'on veut — le lacet doit pouvoir faire plusieurs tours, et le serrer
   « pour faire propre » bloquerait le promeneur face à un mur. Le tangage, lui,
   ne dépasse pas ±1,15 radian : on ne se casse pas la nuque, et au-delà de la
   verticale l'image se retourne.

   ---------------------------------------------------------------------------
   LE CONTRAT

     GESTES.K_GLISSE      1,6 — unités de vitesse par hauteur d'écran glissée.
                          Un réglage d'œil : il fixe combien de doigt il faut
                          pour une orbite. On n'y touche pas sans regarder.
     GESTES.ZONE_MORTE    0,012 hauteur d'écran — sous ce seuil, rien ne part.
     GESTES.V_MAX         0,9 — le plafond de la vitesse demandée.
     GESTES.SENS          0,0032 radian par pixel — la sensibilité du regard.
     GESTES.TANGAGE_MAX   1,15 radian — la nuque.

     GESTES.vitesseDepuisGlisse(cam, visee, vue, norm)
                          Rend `{ v:[x, 0, z], vitesse }`, ou `null` sous la
                          zone morte. `v` est TOUJOURS dans le plan du disque :
                          sa composante verticale est nulle, exactement.

                          cam    la caméra ; seule `cam.base.d` et `cam.base.h`
                                 sont lues
                          visee  { x, y, x0, y0 } en pixels du canevas — le
                                 point de départ du geste et le point courant
                          vue    { H } — la hauteur de l'image en pixels CSS.
                                 La largeur n'est pas lue : voir l'isotropie.
                          norm   `PHYSIQUE.norm`

     GESTES.centreDoigts(doigts)   la moyenne des contacts. `doigts` est la
                          `Map` de la page, ou n'importe quoi qui porte
                          `.values()` et `.size`. Rend `[x, y]`.

     GESTES.ecartDoigts(doigts)    la distance entre les DEUX PREMIERS
                          contacts. Lève si le second manque — voir plus haut.

     GESTES.regard(lacet, tangage, dx, dy, sens)
                          Rend `{ lacet, tangage }`, le nouveau couple. `dx` et
                          `dy` sont en pixels : à droite et vers le BAS, comme
                          l'écran. Le lacet augmente vers la droite, le tangage
                          diminue vers le bas — on regarde là où l'on pousse.
   ============================================================================ */

(function(global){
"use strict";

/* Le réglage d'œil du lancer : glisser toute la hauteur de l'écran demande 1,6
   unité de vitesse. La valeur n'a pas été calculée, elle a été trouvée en
   jouant — c'est elle qui fait qu'une orbite est atteignable au doigt sans être
   donnée. Elle ne se change pas sans regarder l'écran. */
const K_GLISSE = 1.6;

/* Sous 1,2 % de la hauteur de l'écran, ce n'est plus un geste, c'est un doigt
   posé. Rendre une vitesse ici lancerait une sonde à l'arrêt — donc une chute —
   à qui voulait seulement toucher le disque. */
const ZONE_MORTE = 0.012;

/* Au-delà, la sonde part tout droit et quitte le champ avant qu'on ait vu
   quoi que ce soit. Le plafond garde le geste dans la zone où il y a quelque
   chose à voir. */
const V_MAX = 0.9;

/* Sensibilité du regard, en radians par pixel. Assez lent pour qu'on puisse
   viser un objet, assez vif pour faire demi-tour d'un geste. */
const SENS = 0.0032;

// On ne se casse pas la nuque.
const TANGAGE_MAX = 1.15;

/* Le glissement se lit en repère écran, pas dans le plan du disque : vu presque
   par la tranche, quelques pixels vers le haut valent des dizaines d'unités.

   L'ORDRE DES TROIS RÈGLES COMPTE. La zone morte se juge sur la LONGUEUR du
   geste, avant tout rabattement : c'est le geste qu'on mesure, pas son ombre
   dans le plan. Sans quoi, une caméra rasante rendrait la zone morte immense
   dans une direction et nulle dans l'autre, et le seuil ne voudrait plus dire
   la même chose selon l'endroit d'où l'on regarde. */
function vitesseDepuisGlisse(cam, visee, vue, norm){
  const H = vue.H;
  // Les DEUX axes par la hauteur : c'est ce qui rend le geste isotrope.
  const dx = (visee.x - visee.x0)/H, dy = (visee.y0 - visee.y)/H;
  const l = Math.hypot(dx, dy);
  if(l < ZONE_MORTE) return null;
  const b = cam.base;
  const rp = norm([b.d[0], 0, b.d[2]]);   // axes de l'écran rabattus
  const hp = norm([b.h[0], 0, b.h[2]]);   // dans le plan du disque
  const dir = norm([ rp[0]*dx + hp[0]*dy, 0, rp[2]*dx + hp[2]*dy ]);
  const vitesse = Math.min(l*K_GLISSE, V_MAX);
  return { v:[dir[0]*vitesse, 0, dir[2]*vitesse], vitesse };
}

/* Le centre de la pince compte TOUS les contacts présents. C'est ce qui fait
   qu'elle ne saute pas quand un doigt se pose ou se lève pendant le geste —
   elle glisse. */
function centreDoigts(doigts){
  let x = 0, y = 0;
  for(const p of doigts.values()){ x += p[0]; y += p[1]; }
  return [x/doigts.size, y/doigts.size];
}

/* L'écartement, lui, ne regarde que les deux premiers, et ne compte pas.
   GARDÉ TEL QUEL, ET SIGNALÉ — voir l'en-tête : les deux appels de la page sont
   sous un `doigts.size === 2`, donc la fonction dit vrai aujourd'hui. Ajouter
   ici une garde serait changer un comportement sous couvert de déménagement, et
   masquer la vraie question, qui est de savoir ce que la PINCE doit faire quand
   un troisième doigt se pose. */
function ecartDoigts(doigts){
  const [a, b] = [...doigts.values()];
  return Math.hypot(a[0]-b[0], a[1]-b[1]);
}

/* Le regard se reçoit et se rend — voir l'en-tête, c'est la leçon de `nChute`.

   Le tangage est serré, le lacet ne l'est pas, et ce n'est pas une omission :
   on doit pouvoir faire plusieurs tours sur soi-même. Le serrer bloquerait le
   promeneur face à un mur au bout de quelques gestes, sans que rien ne le dise. */
function regard(lacet, tangage, dx, dy, sens){
  return {
    lacet: lacet + dx*sens,
    tangage: Math.max(-TANGAGE_MAX, Math.min(TANGAGE_MAX, tangage - dy*sens)),
  };
}

global.GESTES = {
  K_GLISSE, ZONE_MORTE, V_MAX, SENS, TANGAGE_MAX,
  vitesseDepuisGlisse, centreDoigts, ecartDoigts, regard,
};

})(window);
