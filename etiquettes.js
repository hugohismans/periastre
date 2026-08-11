/* ============================================================================
   LES ÉTIQUETTES — poser un nom sur un point du monde, et surtout SE TAIRE.

   Ce module ne dessine rien et ne connaît ni le document ni WebGL. Il reçoit
   des points DÉJÀ PROJETÉS — ce que `CAMERA.projette` a rendu — et il rend la
   liste de ceux qui ont le droit de parler, avec l'endroit où poser leur texte.
   La page peint. C'est ce qui le rend éprouvable sans navigateur, comme le
   reste du dépôt.

   ---------------------------------------------------------------------------
   SA PREMIÈRE RESPONSABILITÉ EST LE SILENCE, PAS LE PLACEMENT

   Ce n'est pas une précaution, c'est la commande. Hugo voulait « une vision
   depuis le nuage dehors, avec des tags : ça c'est Jupiter, ça c'est truc ». Le
   chiffrage a dit que ça ne se pouvait pas de là-bas : les huit planètes y
   tiennent dans deux pixels, et deux étiquettes y pointeraient LE MÊME POINT.

   « Jupiter est ici » désignant l'endroit où se trouve aussi Saturne n'est pas
   un défaut d'affichage — c'est une affirmation fausse, le genre exact que ce
   site existe pour ne pas faire. Une liste vide EST une réponse, et c'est la
   bonne réponse depuis le nuage de Oort.

   ---------------------------------------------------------------------------
   TROIS FAÇONS DE SE TAIRE, ET ELLES NE SE RESSEMBLENT PAS

     1. LE POINT EST DERRIÈRE. `CAMERA.projette` rend `null` au-delà du plan de
        coupure, et `null` N'EST PAS (0, 0). Rabattre un point du dos au centre
        de l'image était le défaut du 9 août — le trou noir suivait le regard.
        On refuse donc tout ce qui n'est pas une paire de nombres finis.

     2. LE POINT EST HORS DU CADRE. Une étiquette clouée au bord désigne un
        endroit qu'on ne voit pas, et l'œil la lit comme désignant le bord.

     3. LE POINT EST TROP PRÈS D'UNE ÉTIQUETTE DÉJÀ POSÉE. C'est la règle de
        fond, et c'est la seule qui demande à être écrite une fois pour toutes
        (voir plus bas).

   ---------------------------------------------------------------------------
   UNE SEULE LOI, ET ELLE EST ICI

   `solaire.js` connaît déjà le droit de nommer, mais sur UN CAS : des planètes
   rangées le long d'une ligne, à leur écart maximal au Soleil. Il y applique
   deux tests — « assez loin du Soleil » et « assez loin de la dernière
   retenue ». Ce module n'en a qu'un, parce que le Soleil n'y est qu'une
   étiquette de plus : **au moins `ecartMin` de tout ce qui est déjà posé.**

   Les deux tests de `solaire.js` sont donc le même test, vu depuis un cas
   particulier. `outil-verif-etiquettes.js` le prouve en confrontant les deux
   réponses sur cent distances : elles doivent tomber d'accord partout, sans
   quoi il y aurait deux lois pour décider d'une même chose — la maladie que la
   règle 4 nomme, et que le quadrillage et les orbites ont eue une soirée.

   ---------------------------------------------------------------------------
   `ecartMin` N'A PAS DE VALEUR PAR DÉFAUT, ET LE MANQUE REND LE SILENCE

   Le seuil ne se choisit pas : dans le système solaire il vaut la hauteur d'une
   ligne de texte, et c'est `solaire.js` qui le dérive de la typographie du site.
   Une valeur de repli écrite ici en serait une seconde, pour la même décision.

   Un appelant qui ne le donne pas n'obtient donc RIEN. C'est cohérent avec tout
   ce qui précède : quand ce module ne sait pas, il se tait. Et un contrôle le
   surveille, sans quoi l'oubli passerait pour une scène vide.

   ---------------------------------------------------------------------------
   LE CONTRAT

     ETIQUETTES.placements(points, vue, reglages)   -> [ placement ]

       points     [{ cle, ecran, rang }]
                  `ecran` : [x, y] en pixels CSS, ou `null` — la sortie de
                  `CAMERA.projette`, telle quelle.
                  `rang`  : qui parle en premier quand deux se disputent la
                  place. Le plus petit gagne. Absent, on garde l'ordre reçu.

       vue        { W, H } — la MÊME mesure d'image que celle donnée à
                  `projette`. Deux mesures différentes, et l'aller-retour ne se
                  referme plus : c'est écrit au long dans `camera.js`.

       reglages   { ecartMin, marge, decalage }
                  `ecartMin` : la distance sous laquelle deux étiquettes
                  désignent le même endroit. Sans elle, silence total.
                  `marge`    : combien il faut être DANS le cadre. Défaut 0.
                  `decalage` : de combien le texte s'écarte de son point.
                  Défaut 0.

       placement  { cle, px, py, x, y, ancre }
                  `px, py` : le point désigné. `x, y` : où poser le texte.
                  `ancre`  : "droite" ou "gauche" — de quel côté du point le
                  texte s'étale. La page traduit en `textAlign` ; le module ne
                  connaît pas de contexte de dessin.

   Rien n'est mutable ici, rien n'est retenu d'une image à l'autre : la même
   entrée rend la même sortie. Un état interne aurait fait clignoter les
   étiquettes au bord du seuil sans que rien ne le dise.
   ============================================================================ */

(function(global){
"use strict";

/* Un point est-il utilisable ? `null` d'abord, parce que c'est le cas qui a
   coûté une soirée : `projette` le rend pour tout ce qui passe derrière le plan
   de coupure, et le lire comme une coordonnée ramène l'objet au centre. */
function utilisable(ecran){
  return Array.isArray(ecran) && ecran.length >= 2
      && Number.isFinite(ecran[0]) && Number.isFinite(ecran[1]);
}

/* Dans le cadre, avec sa marge. On compare aux BORDS de l'image reçue, jamais à
   une taille devinée : la barre d'adresse d'un téléphone se rétracte au
   défilement et change `H` sous les pieds. */
function dansLeCadre(x, y, vue, marge){
  return x >= marge && x <= vue.W - marge && y >= marge && y <= vue.H - marge;
}

function placements(points, vue, reglages){
  const r = reglages || {};
  const ecartMin = r.ecartMin;
  /* LE SILENCE PAR DÉFAUT. Voir l'en-tête : le seuil appartient à celui qui
     sait de quelle typographie il parle, et il n'y a pas de second endroit où
     l'écrire. Sans lui on ne place rien — on ne devine pas. */
  if(!(Number.isFinite(ecartMin) && ecartMin > 0)) return [];
  if(!Array.isArray(points) || !vue || !(vue.W > 0) || !(vue.H > 0)) return [];

  const marge = Number.isFinite(r.marge) ? r.marge : 0;
  const decalage = Number.isFinite(r.decalage) ? r.decalage : 0;

  /* On ordonne par `rang`, et l'ordre d'entrée départage les égalités. Le tri
     est fait sur une COPIE indexée : `Array.prototype.sort` n'a été garanti
     stable que tard, et un dépôt sans dépendance ne choisit pas son moteur. */
  const candidats = [];
  for(let i = 0; i < points.length; i++){
    const p = points[i];
    if(!p || !utilisable(p.ecran)) continue;              // 1. derrière soi
    const px = p.ecran[0], py = p.ecran[1];
    if(!dansLeCadre(px, py, vue, marge)) continue;        // 2. hors du cadre
    candidats.push({ p, px, py, i, rang: Number.isFinite(p.rang) ? p.rang : i });
  }
  candidats.sort((a, b) => (a.rang - b.rang) || (a.i - b.i));

  /* 3. LA RÈGLE DE FOND, ET ELLE N'EST ÉCRITE QU'ICI.

     Chaque candidat se compare à TOUT ce qui est déjà posé, pas seulement au
     précédent. Sur une ligne les deux reviennent au même — c'est ce qui permet
     à `solaire.js` de ne regarder que la dernière retenue — mais dès qu'un
     point sort de la ligne, « le précédent » ne veut plus rien dire.

     Ce qui compte n'est jamais « cette planète est-elle loin du centre » mais
     « les étiquettes POSÉES se marchent-elles dessus ». Une étiquette tue par
     une voisine qu'on a finalement tue devrait pouvoir parler, et elle le peut
     ici puisqu'on ne compare qu'aux retenues. */
  const gardees = [];
  for(const c of candidats){
    let libre = true;
    for(const g of gardees){
      if(Math.hypot(c.px - g.px, c.py - g.py) < ecartMin){ libre = false; break; }
    }
    if(!libre) continue;
    /* De quel côté s'étale le texte : celui où il y a la place. Un nom posé à
       droite d'un point collé au bord droit sortirait de l'image, et l'on
       aurait tu une étiquette pour en afficher une illisible. */
    const ancre = (c.px + decalage <= vue.W - marge) ? "droite" : "gauche";
    gardees.push({
      cle: c.p.cle, px: c.px, py: c.py,
      x: c.px + (ancre === "droite" ? decalage : -decalage),
      y: c.py, ancre,
    });
  }
  return gardees;
}

/* Combien parleraient — sans fabriquer la liste. Écrit parce qu'une scène a
   besoin de savoir « y a-t-il quelque chose à dire » avant de préparer quoi que
   ce soit, et qu'un appelant qui compterait lui-même redériverait la règle. */
function combien(points, vue, reglages){
  return placements(points, vue, reglages).length;
}

global.ETIQUETTES = { placements, combien };

})(typeof window !== "undefined" ? window : globalThis);
