/* ============================================================================
   Le cockpit — le seul endroit du site où l'on LIT ce que la position fait au
   temps.

   Le reste de la page le montre : le disque s'étire, le ciel se replie, les
   horloges divergent. Ici on met des chiffres dessus. C'est la contrepartie
   nécessaire d'une image calculée — sans cadran, un spectateur ne peut pas
   distinguer un effet relativiste d'un effet de rendu.

   D'où la règle de ce fichier : RIEN N'EST DÉCORATIF. Les quatre cadrans ne
   sont pas quatre nombres choisis pour meubler une console ; ce sont quatre
   conséquences de la même position `r`. Le cadre du hublot, les montants et
   l'occupant vu de dos sont, eux, du décor assumé — et ils ne portent aucun
   chiffre.

   ---------------------------------------------------------------------------
   LES UNITÉS, ET POURQUOI LES DEUX CONSTANTES NE SONT PAS DES RÉGLAGES

   L'unité de longueur du site vaut UN rayon de Schwarzschild. Donc rs = 2M = 1,
   et M = 1/2. Tout ce qui suit s'écrit à partir de là, et c'est ce qui rend les
   deux formules vérifiables au lieu d'ajustables :

   dτ/dt d'une orbite circulaire vaut √(1 − 3M/r), donc √(1 − 1,5/r) ici. Le
   1,5 n'est pas un coefficient de confort : c'est la sphère des photons, que le
   banc mesure à 1,500033. Le cadran tombe donc à zéro exactement là où il n'y a
   plus d'orbite matérielle possible, et pas un cheveu avant.

   La marée va en M/r³ ; le facteur retenu la met à 1/r³, ce que la même unité
   rend cohérent. On n'affiche d'ailleurs pas une accélération en g mais un
   nombre sans dimension — c'est une échelle de gravité, et le cadran ne
   prétend pas à mieux.

   Même famille : la jauge d'altitude sature à r = 3, la dernière orbite
   circulaire stable, que le banc mesure à 3,00223. Sous ce seuil il n'y a plus
   d'orbite où se poser, et la jauge est pleine. Je ne sais pas si c'était voulu
   à l'écriture ; ça reste vrai.

   ---------------------------------------------------------------------------
   POURQUOI CE MODULE NE CONNAÎT NI LE DOM NI WEBGL

   Même raison qu'`etoiles.js` et `recul.js` : le contexte de dessin arrive en
   argument, la taille aussi, et l'état de vol aussi. Un faux contexte qui note
   les appels suffit alors à éprouver le cockpit sans navigateur — y compris la
   seule chose qu'un œil ne saurait pas vérifier vite, à savoir que le nombre
   écrit sous « ton temps s'écoule à » est bien celui que la position impose.

   Tout arrive par `e`, et jamais depuis `window`. Le bénéfice n'est pas
   théorique : une dépendance oubliée lève une exception au premier appel, là
   où une lecture globale aurait continué de marcher dans la page et de casser
   dans le contrôle.
   ============================================================================ */

(function(global){
"use strict";

/* Rend `true` s'il a dessiné, `false` si la sonde manque.

   Ce n'est pas de la politesse d'API. C'est la seule prise qu'un contrôle a sur
   la question « le cockpit sait-il se taire ? » : un `return` muet ne se
   distingue pas d'un dessin vide, et l'appelant n'a alors aucun moyen de savoir
   s'il vient de demander l'impossible ou de rater son propre état.            */
function dessine(ctx, W, H, e){
  const s = e.sonde;
  if(!s) return false;

  // Tout par `e`, rien par `window` — voir l'en-tête.
  const { T, remplit, virgule, tempsFr, horloge } = e;

  const r = e.len(s.p);
  const v = e.len(e.vitesseLocale);
  // orbite circulaire en Schwarzschild : dτ/dt = √(1 − 3M/r)
  const tau = Math.sqrt(Math.max(0, 1 - 1.5/r));
  const maree = 1.0/(r*r*r);                  // ∝ M/r³, en unités du site

  /* Toute la géométrie se mesure en `m`, le petit côté. Une console cotée en
     largeur seule se retrouve à cheval sur un téléphone tenu debout, où W et H
     sont dans un rapport de un à deux. */
  const m  = Math.min(W, H);
  /* Les 72 pixels de la bande basse sont réservés à la barre d'actions, qui est
     en HTML PAR-DESSUS ce calque. C'est le point faible du dessin : deux
     fichiers savent la même hauteur, et l'un des deux la sait en dur. */
  const bx = m*0.055, by = m*0.045, bas = m*0.115 + 72;

  /* ---- hublot : on assombrit hors du cadre ----

     Un seul chemin, deux sous-chemins, et `evenodd` fait le reste : le
     rectangle plein écran moins le cadre arrondi. C'est un trou, pas quatre
     bandes assemblées — les coins arrondis d'un cadre bricolé en quatre
     rectangles laissent toujours une amorce visible sur fond sombre.          */
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  const rc = m*0.05;
  ctx.moveTo(bx + rc, by);
  ctx.arcTo(W - bx, by,        W - bx, H - bas,  rc);
  ctx.arcTo(W - bx, H - bas,   bx,     H - bas,  rc);
  ctx.arcTo(bx,     H - bas,   bx,     by,       rc);
  ctx.arcTo(bx,     by,        W - bx, by,       rc);
  ctx.closePath();
  ctx.fillStyle = "rgba(6,5,12,0.97)";
  ctx.fill("evenodd");
  ctx.restore();

  /* ---- montants ----

     Ils s'écartent vers le bas — 0,30 W en haut, 0,40 W en bas. C'est ce léger
     évasement qui fait qu'on est DEDANS : deux traits parallèles se lisent
     comme un dessin posé sur l'image, deux traits fuyants comme une structure
     devant l'œil.                                                             */
  ctx.strokeStyle = "rgba(150,150,175,0.16)";
  ctx.lineWidth = m*0.011;
  for(const c of [-1, 1]){
    ctx.beginPath();
    ctx.moveTo(W/2 + c*W*0.30, by);
    ctx.lineTo(W/2 + c*W*0.40, H - bas);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(190,190,215,0.22)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx, by, W - 2*bx, H - bas - by);

  // ---- console ----
  const cy = H - bas/2;
  ctx.fillStyle = "rgba(9,8,18,0.94)";
  ctx.fillRect(0, H - bas, W, bas);
  ctx.strokeStyle = "rgba(127,216,255,0.18)";
  ctx.beginPath(); ctx.moveTo(0, H - bas); ctx.lineTo(W, H - bas); ctx.stroke();

  // « Temps qui passe » d'abord : c'est le cadran qui explique les horloges.
  // La marée disparaît quand elle est négligeable — un cadran qui affiche
  // toujours « négligeable » n'apprend rien et prend la place.
  const cadrans = [
    [T("cockpit.temps"),    virgule((tau*100).toFixed(1)) + " %",  1 - tau],
    [T("cockpit.vitesse"),  virgule(v.toFixed(3)) + " c",          v],
    [T("cockpit.altitude"), virgule(r.toFixed(2)) + " rₛ",    Math.min(1, 3/r)],
  ];
  if(maree > 0.01) cadrans.push([T("cockpit.maree"), virgule(maree.toFixed(3)), Math.min(1, maree*20)]);
  /* La largeur d'un cadran est plafonnée, et c'est le plafond qui compte : sans
     lui, trois cadrans sur un écran large s'étalent jusqu'à ce que le mot et le
     nombre n'aient plus l'air d'appartenir au même objet. Le groupe reste donc
     centré et serré, quelle que soit la place disponible.                     */
  const larg = Math.min(W/cadrans.length, m*0.34);
  const gauche = W/2 - larg*cadrans.length/2;
  cadrans.forEach(([nom, val, jauge], i) => {
    const x = gauche + larg*i + larg/2;
    ctx.textAlign = "center";
    ctx.fillStyle = "#7d7894";
    ctx.font = `${(m*0.0125).toFixed(1)}px -apple-system, Segoe UI, sans-serif`;
    ctx.fillText(nom.toUpperCase(), x, cy - m*0.022);
    ctx.fillStyle = "#dcd8ea";
    ctx.font = `500 ${(m*0.026).toFixed(1)}px -apple-system, Segoe UI, sans-serif`;
    ctx.fillText(val, x, cy + m*0.008);
    /* La jauge a un minimum de 2 % : à zéro elle disparaît, et un cadran sans
       jauge se lit comme un cadran en panne plutôt que comme un cadran à zéro. */
    const jw = larg*0.52;
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fillRect(x - jw/2, cy + m*0.022, jw, 2);
    ctx.fillStyle = jauge > 0.72 ? "#ff5d7a" : "#7fd8ff";
    ctx.fillRect(x - jw/2, cy + m*0.022, jw*Math.max(0.02, Math.min(1, jauge)), 2);
  });
  ctx.textAlign = "center";

  // ---- les deux horloges ----
  // Quand elles tournent, c'est LE sujet : on leur donne la taille et les mots
  // qui vont avec, au lieu de les glisser entre deux cadrans.
  const ecart = horloge.mere - horloge.bord;
  /* Avant la première seconde, l'écart est du bruit d'arrondi et le bloc
     afficherait deux fois « 0,0 s » — soit précisément l'inverse de ce qu'il
     est là pour montrer. Il attend donc d'avoir quelque chose à dire.         */
  if(horloge.mere > 1){
    const hy = H - bas - m*0.105;
    const dx = m*0.155;

    ctx.fillStyle = "rgba(6,5,13,0.86)";
    ctx.fillRect(W/2 - m*0.30, hy - m*0.05, m*0.60, m*0.115);
    ctx.strokeStyle = "rgba(255,157,77,0.22)";
    ctx.lineWidth = 1;
    ctx.strokeRect(W/2 - m*0.30, hy - m*0.05, m*0.60, m*0.115);

    ctx.font = `${(m*0.0135).toFixed(1)}px -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = "#8f8aa6";
    ctx.fillText(T("cockpit.toi"), W/2 - dx, hy - m*0.028);
    ctx.fillStyle = "#8f8aa6";
    ctx.fillText(T("cockpit.jumeau"), W/2 + dx, hy - m*0.028);

    /* Les deux durées en chasse fixe, et la couleur qui les sépare est celle
       des écrans du salon : bleu pour le bord, ambre pour le lointain. Un même
       code de couleur d'un bout à l'autre du vaisseau vaut mieux qu'une légende. */
    ctx.font = `500 ${(m*0.036).toFixed(1)}px ui-monospace, Consolas, monospace`;
    ctx.fillStyle = "#7fd8ff"; ctx.fillText(tempsFr(horloge.bord), W/2 - dx, hy + m*0.008);
    ctx.fillStyle = "#ffd08a"; ctx.fillText(tempsFr(horloge.mere), W/2 + dx, hy + m*0.008);

    // le séparateur, pour qu'on lise deux colonnes et non une phrase
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.beginPath(); ctx.moveTo(W/2, hy - m*0.038); ctx.lineTo(W/2, hy + m*0.018); ctx.stroke();

    /* Sous vingt secondes d'écart, on n'annonce rien : on INVITE à descendre.
       Le chiffre existe pourtant dès la première seconde, et l'afficher tout de
       suite apprendrait qu'un jumeau vieillit d'une demi-seconde de plus — ce
       qui ressemble à une erreur d'arrondi et enterre le sujet.                */
    ctx.font = `${(m*0.0155).toFixed(1)}px -apple-system, Segoe UI, sans-serif`;
    if(ecart > 20){
      ctx.fillStyle = "#ff9d4d";
      ctx.fillText(remplit("cockpit.ecart", { t: tempsFr(ecart) }), W/2, hy + m*0.048);
    } else {
      ctx.fillStyle = "#6a6580";
      ctx.fillText(T("cockpit.invite"), W/2, hy + m*0.048);
    }
  }
  ctx.textAlign = "left";

  /* ---- l'occupant, vu de dos ----

     Une silhouette presque noire dans le coin bas droit, et c'est tout ce qu'il
     faut : elle donne l'échelle du hublot et dit que quelqu'un regarde. De face
     ou détaillée, elle deviendrait un personnage — et le sujet du plan est
     derrière la vitre, pas devant.

     Le seul trait clair est le reflet sur la visière, un arc court en haut à
     gauche. C'est lui qui fait la sphère ; sans lui le casque est un disque.   */
  const px = W - bx - m*0.10, py = H - bas - m*0.005;
  const t = m*0.052;
  ctx.fillStyle = "rgba(18,16,32,0.96)";
  ctx.beginPath();                                   // épaules
  ctx.moveTo(px - t, py);
  ctx.quadraticCurveTo(px - t*0.92, py - t*0.62, px, py - t*0.66);
  ctx.quadraticCurveTo(px + t*0.92, py - t*0.62, px + t, py);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();                                   // casque
  ctx.arc(px, py - t*0.86, t*0.46, 0, 6.2832);
  ctx.fill();
  ctx.strokeStyle = "rgba(140,200,255,0.30)";        // reflet sur la visière
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(px, py - t*0.86, t*0.46, Math.PI*1.08, Math.PI*1.52);
  ctx.stroke();

  return true;
}

global.COCKPIT = { dessine };

})(window);
