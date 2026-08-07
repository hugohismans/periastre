/* ============================================================================
   Le calque — la couche de repérage à deux dimensions posée sur l'image.

   Sous lui, le rendu WebGL : le ciel replié, le disque, l'ombre, tout ce qui
   sort des équations d'Einstein. Lui ne montre rien de ce que l'univers fait ;
   il montre ce que NOUS y avons mis. Le cercle de la dernière orbite stable,
   les traînées des sondes, l'élastique de la visée : des annotations, pas des
   observations.

   C'est pour ça que la projection y est DROITE, sans lentille (voir `projette`
   dans la page). Un repère plié par la gravité ne serait plus un repère, il
   deviendrait un objet de plus dans la scène, et l'on ne saurait plus lequel
   des deux dit la vérité sur l'autre.

   Et c'est pour ça, aussi, que le calque se tait au salon : depuis le vaisseau
   on regarde par une fenêtre, pas dans un instrument. Vu par la tranche, le
   cercle de l'ISCO devenait un mystérieux pointillé en travers de l'astre.

   ---------------------------------------------------------------------------
   POURQUOI « LIGHTER » PARTOUT, SAUF DEUX FOIS

   Les traînées se superposent — dix sondes lâchées ensemble repassent au même
   endroit. En composition normale, la dernière posée efface les précédentes et
   dix passages se lisent comme un seul. En `lighter`, les lumières s'ajoutent :
   là où beaucoup de matière est passée, le trait est plus vif. C'est la seule
   composition qui rende une DENSITÉ, et c'est bien ce qu'on veut lire.

   Deux choses en sortent volontairement, et repassent en `source-over` :
   le cercle de l'ISCO, qui est une graduation et non un flux — additionné au
   disque il disparaîtrait exactement là où il sert ; et tout ce qui vient
   après le calque, cockpit et écrans, qui sont des surfaces opaques.

   ---------------------------------------------------------------------------
   CE QUE CE FICHIER NE FAIT PAS

   Il ne dessine ni le cockpit ni les écrans de bord : ils vivent déjà dans
   `cockpit.js` et `ecrans.js`. Mais l'ORDRE dans lequel on les appelle, lui,
   appartient au calque — les écrans passent à la place du calque et non après,
   le cockpit passe après tout le reste et seulement quand on est à bord. Cette
   séquence était écrite ici ; la sortir d'ici la casserait en deux endroits qui
   devraient s'accorder sans se voir.

   D'où deux points d'extension, `e.ecrans` et `e.cockpit`, appelés exactement
   là où les appels étaient. Tous deux facultatifs : sans eux le calque dessine
   ce qui lui appartient et rien d'autre, ce qui est précisément l'état dans
   lequel on l'éprouve sans navigateur.

   ---------------------------------------------------------------------------
   POURQUOI CE MODULE NE CONNAÎT NI LE DOM NI WEBGL

   Même règle qu'`ecrans.js` et `cockpit.js` : le contexte de dessin, la taille,
   l'état de vol, la projection et l'occultation arrivent en argument. Un faux
   contexte qui note les appels suffit alors à éprouver le calque sans page —
   y compris ce qu'un œil ne saurait pas trancher vite : qu'une sonde passée
   derrière la caméra ne laisse aucune encre, et que le calque se tait vraiment
   au salon au lieu de dessiner sous les cloisons.

   Rien ne se lit dans `window`. Une dépendance oubliée lève alors une exception
   au premier appel, là où une lecture globale aurait continué de marcher dans
   la page et de casser dans le contrôle.

   ---------------------------------------------------------------------------
   LE CONTRAT

     CALQUE.trace(ctx, pts, sur, alpha, ep, projette)

       Une polyligne projetée, coupée quand elle passe derrière la caméra.
       `sur` est la TEINTE, un triplet [r, g, b] — pas la projection : celle-ci
       est le sixième argument (voir « ce qui a été ajouté », plus bas).
       Rend 1 si au moins un segment a été posé, 0 sinon.

     CALQUE.dessine(ctx, W, H, e)

       La passe complète du calque. Rend le NOMBRE de tracés posés.

     Ce que `e` doit porter :

       e.salon        l'état du salon — seul `actif` est lu
       e.sondes       les sondes : { p, sort, gel, chemin, trace }
       e.photons      les photons : { trace }
       e.TEINTES      { orbite, chute, fuite } -> [r, g, b]
       e.destin(p, v) l'avenir d'un lancer, dont on ne lit que `.chemin`
       e.projette(p)  monde -> [x, y] en pixels CSS, ou null derrière la caméra
       e.occulte(p)   vrai si le trou noir passe entre l'œil et le point
       e.vCirc(r)     la vitesse d'une orbite circulaire au rayon r
       e.sondeSuivie  l'indice de la sonde suivie, ou null
       e.montreTraj   montre-t-on les trajectoires ?
       e.zoomSonde    le grossissement des sondes
       e.visee        { depart, x, y, x0, y0 } ou null — le point visé
       e.vitesseDepuisGlisse(visee)   la vitesse du lancer en cours, ou null
       e.R_ISCO       le rayon de la dernière orbite stable
       e.ecrans()     facultatif — la passe des écrans de bord (`ECRANS`)
       e.cockpit()    facultatif — la passe du cockpit (`COCKPIT`)

   ---------------------------------------------------------------------------
   CE QUI A ÉTÉ AJOUTÉ AU CONTRAT, ET POURQUOI

   1. `trace` reçoit `projette` en SIXIÈME argument. Le contrat imposé s'arrête
      à cinq et dit que `sur` est la projection ; c'est un lapsus, `sur` est la
      couleur du trait dans l'original comme ici. Or `trace` projette chacun de
      ses points : sans cette fonction il faudrait aller la chercher dans
      `window`, ce qui est justement ce que l'extraction sert à interdire. Elle
      est donc ajoutée à la fin, pour que les cinq premiers ne bougent pas.

   2. `e.ecrans` et `e.cockpit`, facultatifs — voir plus haut.

   3. `e.vitesseDepuisGlisse` est appelée AVEC la visée en argument. Le contrat
      l'écrit sans argument ; une fermeture qui n'en prend pas l'ignore, tandis
      que la fonction de la page, elle, en attend une. Passer l'argument fait
      donc marcher les deux branchements, ne pas le passer n'en fait marcher
      qu'un.

   ---------------------------------------------------------------------------
   CE QU'ON APPELLE UN « TRACÉ POSÉ »

   Un objet dessiné, une unité. Le compte additionne :

     · le cercle de l'ISCO                                              (0 ou 1)
     · chaque trajectoire complète, si on les montre                (0 ou 1 pièce)
     · chaque traînée vive, de sonde ou de photon                  (0 ou 1 pièce)
     · chaque tête de sonde — le halo et le cœur sont UNE tête       (1 par tête)
     · le chemin prédit de la visée                                     (0 ou 1)
     · l'élastique de la visée, son point de départ compris             (0 ou 1)

   Une polyligne entièrement derrière la caméra vaut 0 : elle a bien coûté un
   `stroke()`, mais elle n'a pas laissé d'encre, et c'est l'encre qu'on compte.
   Au salon le calque rend 0, quoi que les écrans aient posé — leur compte est
   à eux, et `ECRANS.dessine` le rend déjà.
   ============================================================================ */

(function(global){
"use strict";

/* Une polyligne du monde, projetée point par point.

   La coupure est le seul endroit délicat. Un point derrière le plan de coupure
   ne rend pas de pixel : `projette` rend `null`. On ne peut ni le sauter en
   silence — la corde relierait alors deux points séparés par un passage hors
   champ, en travers de l'image — ni arrêter le tracé, puisque la courbe
   revient souvent. On rouvre donc un sous-chemin à chaque retour : `ouvert`
   retombe à faux dès qu'un point manque, et le suivant recommence par un
   `moveTo`.

   Le `stroke()` est appelé même quand rien n'a été posé, comme dans l'original.
   Il ne dessine rien sur un chemin vide, mais c'est un appel de moins qui
   diffère entre la page et ce fichier.                                        */
function trace(ctx, pts, sur, alpha, ep, projette){
  if(pts.length < 2) return 0;
  ctx.strokeStyle = `rgba(${sur[0]},${sur[1]},${sur[2]},${alpha})`;
  ctx.lineWidth = ep;
  ctx.beginPath();
  let ouvert = false, segments = 0;
  for(let i = 0; i < pts.length; i++){
    const q = projette(pts[i]);
    if(!q){ ouvert = false; continue; }
    if(ouvert){ ctx.lineTo(q[0], q[1]); segments++; }
    else { ctx.moveTo(q[0], q[1]); ouvert = true; }
  }
  ctx.stroke();
  return segments > 0 ? 1 : 0;
}

function dessine(ctx, W, H, e){
  ctx.clearRect(0, 0, W, H);
  /* SUSPECT, GARDÉ TEL QUEL : cette ligne ne sert à rien. Les deux branches qui
     suivent — le salon, puis le cercle de l'ISCO — remettent toutes les deux
     `source-over` avant le premier dessin. `clearRect`, lui, ignore la
     composition. C'est donc une affectation morte, laissée en place parce que
     l'extraction ne corrige pas : elle rapporte.                              */
  ctx.globalCompositeOperation = "lighter";

  /* Depuis le salon on regarde par une fenêtre, pas un instrument : les repères
     du simulateur — cercle de l'ISCO, traînées des sondes — n'ont rien à y
     faire. Vu par la tranche, ce cercle devenait un mystérieux trait pointillé
     en travers de l'astre.

     Les écrans prennent donc la place du calque, ils ne s'y ajoutent pas ; et
     le cockpit ne passe pas du tout, puisqu'on sort avant lui.                */
  if(e.salon.actif){
    ctx.globalCompositeOperation = "source-over";
    if(typeof e.ecrans === "function") e.ecrans();
    return 0;
  }

  const proj = e.projette;
  let n = 0;

  /* ---- le cercle repère : la dernière orbite stable ----

     Quatre-vingt-seize cordes, ce qui suffit : à ce diamètre la corde s'écarte
     du cercle de moins d'un dixième de pixel, et l'œil ne verra jamais le
     polygone. En pointillé court et à 13 % d'opacité, parce que c'est une
     graduation — dès qu'elle se lit comme un objet, on croit voir un anneau.  */
  ctx.globalCompositeOperation = "source-over";
  const cercle = [];
  for(let i = 0; i <= 96; i++){
    const a = i/96*6.2832;
    cercle.push([Math.cos(a)*e.R_ISCO, 0, Math.sin(a)*e.R_ISCO]);
  }
  ctx.setLineDash([2, 7]);
  n += trace(ctx, cercle, [255,255,255], 0.13, 1, proj);
  ctx.setLineDash([]);
  ctx.globalCompositeOperation = "lighter";

  /* ---- les trajectoires complètes ----

     Elles sont calculées AU LANCEMENT, pas suivies image par image : `s.chemin`
     est l'avenir entier de la sonde, connu d'avance. Les montrer, c'est montrer
     que la chute n'est pas improvisée — le trait passe déjà par où la sonde ira.

     L'épaisseur suit la racine du grossissement : à taille quadruple le trait
     ne double que, sinon quatre traînées voisines se rejoignent en une nappe.  */
  const ep = Math.sqrt(e.zoomSonde);
  if(e.montreTraj)
    for(const s of e.sondes) n += trace(ctx, s.chemin, e.TEINTES[s.sort], 0.17, ep, proj);

  /* ---- les traînées vives ----

     Le passé récent, celui-là réellement parcouru, à presque le double
     d'opacité de l'avenir. C'est ce contraste qui dit lequel des deux traits
     est déjà arrivé. Les photons n'ont pas de sort — ils vont tout droit dans
     un espace courbe — donc pas de teinte à choisir : un blanc chaud.         */
  for(const s of e.sondes)  n += trace(ctx, s.trace, e.TEINTES[s.sort], 0.30, 1.1*ep, proj);
  for(const f of e.photons) n += trace(ctx, f.trace, [255,250,235], 0.30, 1.1*ep, proj);

  /* ---- les têtes ----

     Deux disques concentriques : un halo large et pâle, un cœur petit et vif.
     C'est ce qui rend une sonde repérable sur un fond qui va du noir absolu au
     disque incandescent — le cœur seul se perd dans le disque, le halo seul se
     perd dans le noir.                                                        */
  for(let i = 0; i < e.sondes.length; i++){
    const s = e.sondes[i];
    if(i === e.sondeSuivie) continue;          // on est dedans
    if(e.occulte(s.p)) continue;
    const q = proj(s.p);
    if(!q) continue;
    let c = e.TEINTES[s.sort], a = 1;
    if(s.gel){
      /* Figée à l'horizon : elle rougit et son flux s'éteint exponentiellement.
         Ce n'est pas un effet de style. Pour nous qui restons loin, une sonde
         qui franchit l'horizon ne disparaît jamais : elle ralentit sans fin,
         sa lumière s'étire vers le rouge et s'éteint. La disparition franche
         serait le mensonge ; c'est l'extinction qui est fidèle.

         Les deux vont à des vitesses différentes, et c'est voulu : la couleur
         finit son virage en cinq secondes, la luminosité met plus longtemps à
         tomber. On voit donc le rouge s'installer AVANT de perdre la sonde. */
      const t = Math.min(1, s.gel/5);
      a = Math.exp(-s.gel/4.5);
      c = [ c[0]+(255-c[0])*t, c[1]+(38-c[1])*t, c[2]+(18-c[2])*t ];
    }
    ctx.fillStyle = `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${(0.20*a).toFixed(3)})`;
    ctx.beginPath(); ctx.arc(q[0], q[1], 4.2*e.zoomSonde, 0, 6.2832); ctx.fill();
    ctx.fillStyle = `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${(0.95*a).toFixed(3)})`;
    ctx.beginPath(); ctx.arc(q[0], q[1], 1.5*e.zoomSonde, 0, 6.2832); ctx.fill();
    n++;
  }

  /* ---- la visée ----

     Un élastique tiré depuis un point du plan du disque : la longueur donne la
     vitesse, la direction donne le sens. Et la COULEUR donne le verdict avant
     le lancer — elle vire du rose au vert à mesure que la vitesse demandée
     approche celle d'une orbite circulaire à ce rayon.

     C'est le seul endroit du site où l'on apprend qu'une orbite n'est pas une
     affaire de distance mais d'accord entre une distance et une vitesse. Le
     facteur 1,6 fixe la largeur de la fenêtre indulgente : au-delà d'environ
     60 % d'écart, le vert a complètement disparu.                             */
  const v = e.visee;
  if(v){
    const a = proj(v.depart);
    const g = e.vitesseDepuisGlisse(v);
    if(a){
      // `depart` sort de `surLePlan`, donc y = 0 : ce rayon cylindrique EST le
      // rayon sphérique, et `vCirc` reçoit bien ce qu'elle attend.
      const r0 = Math.hypot(v.depart[0], v.depart[2]);
      const bon = g ? Math.max(0, 1 - Math.abs(g.vitesse/e.vCirc(r0) - 1)*1.6) : 0;
      const c = [Math.round(255-128*bon), Math.round(120+96*bon), Math.round(140+115*bon)];
      if(g){
        /* L'avenir du lancer, calculé pour de bon à chaque image : c'est le même
           `destin` que celui qui servira au lancer réel, pas une approximation
           d'aperçu. Une prévision qui ne serait pas la trajectoire ferait du
           tir une loterie, et de la promesse du site un décor.                */
        ctx.setLineDash([4, 5]);
        n += trace(ctx, e.destin(v.depart, g.v).chemin, c, 0.6, 1.2, proj);
        ctx.setLineDash([]);
      }
      /* SUSPECT, GARDÉ TEL QUEL : ligne morte, deux fois. `trace` sort d'emblée
         sur un tableau d'un seul point, et même s'il ne sortait pas, l'alpha
         vaut 0. Elle ne peut donc rien poser dans aucun cas de figure — et elle
         ne compte pour rien dans `n`, ce qui la rend visible depuis un test.  */
      trace(ctx, [v.depart], c, 0, 1, proj);
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},0.85)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(v.x, v.y); ctx.stroke();
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},1)`;
      ctx.beginPath(); ctx.arc(a[0], a[1], 3.5, 0, 6.2832); ctx.fill();
      n++;
    }
  }

  /* Le cockpit ferme la passe, en composition normale : c'est une console
     opaque, additionnée au disque elle deviendrait transparente là où elle
     compte. Il ne passe que si l'on est à bord d'une sonde — et cette condition
     reste ici, parce que c'est le calque qui sait qu'« on est dedans » : c'est
     le même test qui, plus haut, a fait sauter la tête de cette sonde-là.     */
  ctx.globalCompositeOperation = "source-over";
  if(e.sondeSuivie !== null && typeof e.cockpit === "function") e.cockpit();

  return n;
}

global.CALQUE = { dessine, trace };

})(window);
