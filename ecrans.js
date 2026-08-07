/* ============================================================================
   Les écrans de bord — les deux dalles plaquées sur la cloison du salon.

   Elles disent où l'on est et quelle heure il est *pour qui*. Ce sont les seuls
   objets du vaisseau qui portent des chiffres, et donc les seuls endroits où le
   voyage cesse d'être une image pour devenir une mesure : le rayon en rₛ, la
   trajectoire réellement parcourue, la date de la Terre et celle du bord qui
   s'écartent l'une de l'autre.

   ---------------------------------------------------------------------------
   POURQUOI DU DESSIN À DEUX DIMENSIONS SUR UNE PAROI À TROIS

   Les écrans sont tracés sur le calque 2D, mais projetés par la MÊME matrice
   que l'habitacle. Ils sont donc réellement posés sur les cloisons et suivent
   le regard : on ne les lit pas « par-dessus » la scène, on les lit dedans.

   Le prix de ce raccourci est connu et payé deux fois dans `ecran()` :

   1. Le calque 2D n'a pas de tampon de profondeur, donc rien n'occulte un
      écran tout seul. La géométrie qui manque est remise à la main — la face
      arrière d'abord, l'aire projetée ensuite.

   2. Une toile 2D ne sait faire que des transformations AFFINES, qui envoient
      un rectangle sur un parallélogramme. Une vraie perspective rétrécit le
      bord lointain ; l'affine ne le peut pas. Au lieu de mentir sur la
      géométrie, on éteint la dalle — et c'est aussi ce que fait un écran plat
      réel au-delà de soixante degrés hors axe. Ce refus est délibéré : ne pas
      le « réparer » en croyant corriger un bogue.

   ---------------------------------------------------------------------------
   POURQUOI CE MODULE NE CONNAÎT NI LE DOM NI WEBGL

   Même règle qu'`etoiles.js` et `cockpit.js` : le contexte de dessin, la
   taille, l'état du salon, la matrice, l'œil et jusqu'au fabricant de canevas
   arrivent en argument. Un faux contexte qui note les appels suffit alors à
   éprouver les écrans sans navigateur — y compris ce qu'un œil ne saurait pas
   vérifier vite : que le retard affiché est bien celui que la position impose,
   et qu'un écran vu de trop biais se tait au lieu de se déformer.

   La conséquence pratique : une dépendance oubliée lève une exception au
   premier appel, là où une lecture dans `window` aurait continué de marcher
   dans la page et de casser dans le contrôle.

   ---------------------------------------------------------------------------
   LE CONTRAT

     ECRANS.projette(p, M, taille)     un point de la pièce -> [x, y] en pixels
                                       CSS, ou null derrière le plan de coupure.
                                       taille = { W, H }.

     ECRANS.toile(cle, dedans, fabrique)   la toile hors champ mise en cache.
                                       `fabrique()` rend un canevas neuf : c'est
                                       la PAGE qui le fournit, le module ne
                                       touche pas à `document`.

     ECRANS.dessine(ctx, W, H, e)      pose tous les écrans du salon, et rend le
                                       NOMBRE d'écrans réellement dessinés.

   Ce que `e` doit porter :

     e.M              la matrice de la pièce (`mvpSalon()`)
     e.oeil           la position de l'œil dans la pièce (`oeilSalon()`)
     e.salon          l'état du salon : p, apo, trace, horloge, vise, t0,
                      tTerre, tBord, facteur
     e.vaisseau       VAISSEAU — on y lit H (le centre de la pièce), P (la
                      profondeur, qui donne le z de la cloison) et FOSSE
     e.telescope      le poste du télescope, { x, z } — VAISSEAU.TELESCOPE
     e.postes         { POSTES, POSTE_LUMEN } — seul POSTE_LUMEN est lu, pour
                      comparer avec `salon.vise` par IDENTITÉ
     e.lumen          où Lumen se trouve À CET INSTANT, soit
                      `ROBOT.boiteVisee(salon.horloge).c`. Ce n'est PAS
                      `POSTE_LUMEN.c`, qui n'est rafraîchi que lorsqu'on vise :
                      l'anneau se poserait alors sur la dernière position connue
                      du drone au lieu du drone.
     e.destination    CONTENU.destination — { nom, arrivee }
     e.quete          { QUETE, iQuete, actif, finie } — l'étape courante
     e.len            la longueur d'un vecteur
     e.occulte        accepté par symétrie avec les autres calques, mais JAMAIS
                      lu ici : on est dans une pièce éclairée, le trou noir ne
                      passe pas entre l'œil et une cloison à quatre mètres. Les
                      deux occultations qui comptent (face arrière, biais) sont
                      calculées dans `ecran()`.
     e.cadence(r)     le facteur de dilatation à la distance r
     e.T, e.remplit, e.virgule, e.tempsFr, e.LOCALE     le texte
     e.fabriqueToile  () => un canevas hors champ
   ============================================================================ */

(function(global){
"use strict";

/* --------------------------------------------------------------------------
   LE CACHE HORS CHAMP — une optimisation mesurée, pas une précaution

   Mesuré : `dessineEcrans()` coûtait 0,417 ms sur 1,757 ms de boucle — un quart
   du temps processeur, sur une machine rapide. Sur téléphone, où le texte en
   Canvas 2D est bien plus lent, c'est la première cause de saccade.

   Or leur contenu ne change pas à la cadence de l'affichage : l'horloge avance
   à la seconde, le tracé d'orbite d'un point tous les quelques dixièmes. On les
   dessine donc dans une toile hors champ quatre fois par seconde, et chaque
   image ne fait plus qu'un `drawImage` déformé — ce que le processeur graphique
   sait faire pour rien.

   Le balayage y est cuit aussi : c'étaient quatre-vingt-quatre rectangles par
   écran et par image, soit cent soixante-huit qu'on refaisait pour un motif
   rigoureusement identique.

   Le suréchantillonnage à deux compense la déformation : la toile est tracée à
   600 × 400 pour être posée sur un quadrilatère qui, de près, dépasse la taille
   nominale.                                                                  */
const TOILES = new Map();
const SUR_ECH = 2;              // suréchantillonnage de la toile hors champ
const RAFRAICHI = 250;          // millisecondes entre deux rasterisations
const EC_LARG = 300, EC_HAUT = 200;

/* La seule horloge du module. `performance.now()` quand elle existe — elle est
   monotone, donc un changement d'heure système ne fige pas les écrans pendant
   une seconde. Sinon `Date.now()`, qui suffit à un test hors navigateur. Le
   choix se fait à chaque appel mais ne mélange pas les deux échelles au sein
   d'une comparaison : `quand` et `now` viennent du même appel de fonction.   */
function horlogeMur(){
  return (typeof performance !== "undefined" && performance && performance.now)
       ? performance.now() : Date.now();
}

// Point de la pièce -> pixel. Rend null derrière la caméra.
function projette(p, M, taille){
  const w = M[3]*p[0] + M[7]*p[1] + M[11]*p[2] + M[15];
  if(w <= 0.02) return null;
  const x = (M[0]*p[0] + M[4]*p[1] + M[8]*p[2]  + M[12]) / w;
  const y = (M[1]*p[0] + M[5]*p[1] + M[9]*p[2]  + M[13]) / w;
  return [(x + 1)/2 * taille.W, (1 - y)/2 * taille.H];
}

function toile(cle, dedans, fabrique){
  let e = TOILES.get(cle);
  if(!e){
    const c = fabrique();
    c.width = EC_LARG*SUR_ECH; c.height = EC_HAUT*SUR_ECH;
    e = { c, o: c.getContext("2d"), quand: -1e9 };
    TOILES.set(cle, e);
  }
  const now = horlogeMur();
  if(now - e.quand > RAFRAICHI){
    e.quand = now;
    const o = e.o;
    o.setTransform(SUR_ECH, 0, 0, SUR_ECH, 0, 0);
    o.clearRect(0, 0, EC_LARG, EC_HAUT);
    dedans(o);
    // le balayage, cuit une fois pour toutes dans la toile
    o.fillStyle = "rgba(0,0,0,0.16)";
    for(let y = 0; y < EC_HAUT; y += EC_HAUT*0.012) o.fillRect(0, y, EC_LARG, EC_HAUT*0.006);
  }
  return e.c;
}

/* Le cache est accroché à `toile` plutôt qu'exposé comme quatrième clé : le
   contrat en impose trois, et un contrôle qui veut savoir combien de
   rasterisations ont eu lieu, ou forcer la prochaine, n'a pas besoin d'élargir
   l'interface pour ça. `toile.cache.get("temps").quand = -1e9` périme un écran. */
toile.cache = TOILES;
toile.SUR_ECH = SUR_ECH;
toile.RAFRAICHI = RAFRAICHI;
toile.LARG = EC_LARG;
toile.HAUT = EC_HAUT;

function tempsDepuis(iso, T){
  const s = Math.max(0, (Date.now() - Date.parse(iso))/1000);
  const j = Math.floor(s/86400), h = Math.floor(s%86400/3600), mn = Math.floor(s%3600/60);
  return j ? `${j} ${T("u.jourCourt")} ${h} h ${mn} min` : `${h} h ${mn} min`;
}

/* Écran plaqué sur une paroi. Un vrai écran dans une pièce sombre n'est pas un
   rectangle noir : il a un biseau, il émet de la lumière autour de lui, et sa
   dalle se trahit par un balayage. Sans ça on lit un panneau de débogage.

   Rend `true` s'il a effectivement posé quelque chose, `false` s'il s'est tu.
   Ce n'est pas de la politesse d'API : c'est la seule prise qu'un contrôle a
   sur la question « les garde-fous se déclenchent-ils ? ». Un `return` muet ne
   se distingue pas d'un écran dessiné noir sur noir.                          */
function ecran(ctx, taille, M, coins, dessineDedans, cle, e){
  /* Un écran est plaqué sur une cloison : on ne doit pas le voir depuis
     l'autre côté. Le tracé se fait sur un calque à deux dimensions, sans
     tampon de profondeur, donc rien ne l'occulte tout seul — d'où ces deux
     garde-fous, qui sont la géométrie que le calque n'a pas.

     D'abord la face arrière : la normale du quadrilatère contre la direction
     de l'œil. Ensuite l'aire projetée : quand un coin frôle le plan de
     coupure, la projection explose et l'écran s'étale sur toute l'image. */
  const u = [coins[1][0]-coins[0][0], coins[1][1]-coins[0][1], coins[1][2]-coins[0][2]];
  const v = [coins[3][0]-coins[0][0], coins[3][1]-coins[0][1], coins[3][2]-coins[0][2]];
  const nrm = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
  /* On ne suppose RIEN de l'enroulement des sommets : selon l'ordre où ils
     sont donnés, la normale sort de la pièce ou y entre, et un test de signe
     en dur rejette alors précisément les écrans visibles — ce qu'il faisait.
     On compare donc au centre de la pièce, qui est à l'intérieur par
     construction : l'écran se voit si l'œil est du même côté que lui. */
  const oe = e.oeil;
  const cote = q => nrm[0]*(q[0]-coins[0][0]) + nrm[1]*(q[1]-coins[0][1])
                  + nrm[2]*(q[2]-coins[0][2]);
  if(cote(oe) * cote([0, e.vaisseau.H/2, 0]) <= 0) return false;

  /* Un écran vu de biais s'efface.

     Ce n'est pas un caprice : la toile à deux dimensions ne sait faire que des
     transformations affines, qui envoient un rectangle sur un parallélogramme.
     Un panneau vu sous un angle rasant demande une vraie perspective — le bord
     lointain doit rétrécir — et l'approximation se voit alors franchement : le
     cadre suit la paroi, le contenu non.

     Plutôt que de mentir sur la géométrie, on éteint. C'est d'ailleurs ce que
     fait une dalle réelle : au-delà de soixante degrés hors axe, un écran plat
     se délave et devient illisible. On rend donc le défaut invisible en le
     remplaçant par un comportement vrai. */
  const ln = Math.hypot(nrm[0], nrm[1], nrm[2]) || 1;
  const centre = [(coins[0][0]+coins[2][0])/2, (coins[0][1]+coins[2][1])/2,
                  (coins[0][2]+coins[2][2])/2];
  const vv = [oe[0]-centre[0], oe[1]-centre[1], oe[2]-centre[2]];
  const lv = Math.hypot(vv[0], vv[1], vv[2]) || 1;
  const face = Math.abs(nrm[0]*vv[0] + nrm[1]*vv[1] + nrm[2]*vv[2]) / (ln*lv);
  const lisible = Math.min(1, Math.max(0, (face - 0.34) / 0.26));   // 0 à 70°, 1 à 45°
  if(lisible <= 0.01) return false;

  const a = projette(coins[0], M, taille), b = projette(coins[1], M, taille),
        c = projette(coins[2], M, taille), d = projette(coins[3], M, taille);
  if(!a || !b || !c || !d) return false;

  const aire = Math.abs((b[0]-a[0])*(d[1]-a[1]) - (d[0]-a[0])*(b[1]-a[1]));
  if(aire > 9 * taille.W * taille.H) return false;

  /* L'erreur de perspective, mesurée plutôt que devinée.

     Le premier garde-fou regardait l'angle de vue, et il visait à côté : de
     près, un écran occupe un grand angle, donc son bord proche et son bord
     lointain diffèrent beaucoup — et une affine ne peut pas rendre ça, même
     vu de face. Or l'affine envoie un rectangle sur un PARALLÉLOGRAMME, dont
     les côtés opposés sont égaux par définition. Il suffit donc de comparer
     les deux côtés opposés du quadrilatère réellement projeté : leur écart
     EST l'erreur qu'on commettrait. On mesure le défaut au lieu d'en deviner
     la cause, et cette fois le critère attrape les deux situations. */
  const cote1 = [b[0]-a[0], b[1]-a[1]], cote2 = [c[0]-d[0], c[1]-d[1]];
  const l1 = Math.hypot(cote1[0], cote1[1]) || 1;
  const gauchi = Math.hypot(cote1[0]-cote2[0], cote1[1]-cote2[1]) / l1;
  const droit = Math.min(1, Math.max(0, (0.26 - gauchi) / 0.14));   // 1 sous 12 %, 0 au-delà de 26 %
  if(droit <= 0.01) return false;

  const chemin = () => {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath();
  };
  const cx = (a[0]+b[0]+c[0]+d[0])/4, cy = (a[1]+b[1]+c[1]+d[1])/4;
  const rayon = Math.hypot(b[0]-a[0], b[1]-a[1]);

  // La lueur que la dalle jette sur la cloison
  ctx.save();
  const halo = ctx.createRadialGradient(cx, cy, rayon*0.25, cx, cy, rayon*0.95);
  halo.addColorStop(0, "rgba(120,180,255,0.11)");
  halo.addColorStop(1, "rgba(120,180,255,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(cx - rayon, cy - rayon*0.9, rayon*2, rayon*1.8);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha *= Math.min(lisible, droit);
  // biseau : un liseré clair en haut, sombre en bas, comme un cadre encastré
  chemin();
  ctx.lineWidth = 3.5; ctx.strokeStyle = "rgba(28,25,42,0.95)"; ctx.stroke();
  ctx.lineWidth = 1.1; ctx.strokeStyle = "rgba(150,160,190,0.22)"; ctx.stroke();

  chemin(); ctx.clip();

  // dalle : pas un noir plat, un dégradé bleuté
  const g = ctx.createLinearGradient(a[0], a[1], d[0], d[1]);
  g.addColorStop(0, "rgba(11,16,30,0.97)");
  g.addColorStop(1, "rgba(6,9,19,0.97)");
  ctx.fillStyle = g; ctx.fill();

  // (0,0)->a, (1,0)->b, (0,1)->d : l'affine qui redresse l'écriture
  ctx.transform(b[0]-a[0], b[1]-a[1], d[0]-a[0], d[1]-a[1], a[0], a[1]);
  // Une seule image posée, balayage compris — voir `toile`.
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(toile(cle, dessineDedans, e.fabriqueToile), 0, 0, 1, 1);
  ctx.restore();
  return true;
}

function dessine(ctx, W, H, e){
  // Tout par `e`, rien par `window` — voir l'en-tête.
  const { M, salon, quete, postes, telescope, vaisseau, lumen,
          len, cadence, T, remplit, virgule, tempsFr, LOCALE } = e;
  const taille = { W, H };
  const D = e.destination;
  const z = -vaisseau.P/2 + 0.012, y0 = 0.86, y1 = 2.34;
  const g0 = -4.42, g1 = -2.80, d0 = 2.80, d1 = 4.42;
  let poses = 0;

  /* Repère local commun : 300 × 200 « pixels d'écran », marge de 22.

     La toile hors champ étant DÉJÀ dans ce repère, il n'y a plus de mise à
     l'échelle à faire ici — c'était le rôle de `local()`, devenu inutile.

     Et le contexte arrive en PARAMÈTRE, nommé `ctx` : il masque le global dans
     tout le corps des deux fonctions ci-dessous, qui n'ont donc pas eu à
     changer d'une ligne alors qu'elles dessinent désormais ailleurs. */
  const LARG = EC_LARG, HAUT = EC_HAUT, MG = 22;
  const titre = (ctx, t) => {
    ctx.textAlign = "left";
    ctx.fillStyle = "#5f7ba8"; ctx.font = "10px ui-monospace, monospace";
    ctx.fillText(t, MG, 26);
    ctx.strokeStyle = "rgba(120,160,220,0.18)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(MG, 36); ctx.lineTo(LARG-MG, 36); ctx.stroke();
  };

  // --- écran de gauche : où sommes-nous ---
  if(ecran(ctx, taille, M, [[g0,y1,z], [g1,y1,z], [g1,y0,z], [g0,y0,z]], ctx => {
    titre(ctx, T("salon.ecran.position"));

    ctx.fillStyle = "#dce6f5"; ctx.font = "22px KaTeX_Main, Georgia, serif";
    ctx.fillText(D.nom, MG, 68);
    ctx.fillStyle = "#5f7ba8"; ctx.font = "9.5px ui-monospace, monospace";
    ctx.fillText(T("salon.ecran.orbite"), MG, 86);
    ctx.fillStyle = "#9fd4ff"; ctx.font = "13px ui-monospace, monospace";
    ctx.fillText(virgule(len(salon.p).toFixed(1)) + " r\u209B", MG, 106);

    // Schéma d'orbite vu de dessus. L'ombre au centre, l'orbite en pointillé,
    // le vaisseau qui avance pour de bon.
    const cx = LARG/2, cy = 143, R = 42;
    ctx.strokeStyle = "rgba(120,160,220,0.30)"; ctx.lineWidth = 1;
    // La vraie trajectoire, pas un cercle de convention : on trace le chemin
    // parcouru. C'est aussi ainsi qu'on voit le périastre précesser.
    const ech0 = R/salon.apo;
    if(salon.trace.length > 2){
      ctx.beginPath();
      salon.trace.forEach(([px, pz], i) => {
        const X = cx + px*ech0, Y = cy + pz*ech0;
        i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      });
      ctx.strokeStyle = "rgba(120,160,220,0.30)"; ctx.lineWidth = 1;
      ctx.stroke();
    }

    const lueur = ctx.createRadialGradient(cx, cy, 6, cx, cy, 22);
    lueur.addColorStop(0, "rgba(255,157,77,0.55)");
    lueur.addColorStop(1, "rgba(255,157,77,0)");
    ctx.fillStyle = lueur;
    ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "#04040a";
    ctx.beginPath(); ctx.arc(cx, cy, 8.5, 0, 6.2832); ctx.fill();

    const rr = len(salon.p), ech = R/salon.apo;
    const vx = cx + salon.p[0]*ech, vy = cy + salon.p[2]*ech;
    ctx.strokeStyle = "rgba(160,210,255,0.30)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(vx, vy); ctx.stroke();
    ctx.fillStyle = "#9fd4ff";
    ctx.beginPath(); ctx.arc(vx, vy, 3.6, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "#5f7ba8"; ctx.font = "8px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(T("salon.ecran.nous"), vx, vy - 9);
  }, "position", e)) poses++;

  /* L'aura de ce qu'il faut toucher.

     La pulsation de l'objet lui-même ne suffisait pas : sur un petit écran, un
     drone qui brille un peu plus reste un drone qui brille. Il faut un signe
     qui n'appartienne pas au décor — un anneau qui se resserre, comme on en
     pose autour de ce qu'on désigne du doigt.

     Il ne s'affiche que pendant l'étape qui demande cet objet-là, et il
     disparaît dès qu'on le vise : une fois qu'on a compris, l'insistance
     devient du bruit.

     Ce bloc n'est PAS un écran : il dessine sur le calque principal, entre les
     deux dalles, et ne compte donc pas dans le nombre rendu. Il vit ici parce
     qu'il partage la projection de la pièce, pas parce qu'il est de la même
     famille. */
  if(quete.actif && quete.QUETE[quete.iQuete] && !quete.finie){
    const ou = {
      "a-lumen":     () => lumen,
      "a-temps":     () => [2.85, 0.56, -2.78],
      "a-telescope": () => [telescope.x, vaisseau.FOSSE + 1.05, telescope.z],
    }[quete.QUETE[quete.iQuete].id];
    const deja = (quete.QUETE[quete.iQuete].id === "a-lumen"  && salon.vise === postes.POSTE_LUMEN)
              || (quete.QUETE[quete.iQuete].id === "a-temps"  && salon.vise && salon.vise.id === "vitesse")
              || (quete.QUETE[quete.iQuete].id === "a-telescope" && salon.vise && salon.vise.id === "telescope");
    const q = ou && !deja ? projette(ou(), M, taille) : null;
    if(q){
      const ph = (salon.horloge * 0.9) % 1;          // un cycle par seconde environ
      const r = 62 - 30*ph;                          // l'anneau se resserre
      ctx.save();
      ctx.globalAlpha = 0.55 * Math.min(1, ph*4) * (1 - ph);
      ctx.strokeStyle = "#ffb163"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(q[0], q[1], r, 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 0.30;
      ctx.beginPath(); ctx.arc(q[0], q[1], 30, 0, 6.2832); ctx.stroke();
      ctx.restore();
    }
  }

  // --- écran de droite : le temps, et l'aveu ---
  if(ecran(ctx, taille, M, [[d0,y1,z], [d1,y1,z], [d1,y0,z], [d0,y0,z]], ctx => {
    titre(ctx, T("salon.ecran.temps"));

    const filet = y => {
      ctx.strokeStyle = "rgba(120,160,220,0.12)";
      ctx.beginPath(); ctx.moveTo(MG, y); ctx.lineTo(LARG-MG, y); ctx.stroke();
    };
    const etiq = (t, y) => {
      ctx.textAlign = "left"; ctx.fillStyle = "#5f7ba8";
      ctx.font = "8.5px ui-monospace, monospace"; ctx.fillText(t, MG, y);
    };

    ctx.textAlign = "left";
    etiq(T("salon.ecran.depuis"), 50);
    ctx.fillStyle = "#ff9d4d"; ctx.font = "20px ui-monospace, monospace";
    ctx.fillText(tempsDepuis(D.arrivee, T), MG, 72);
    filet(84);

    /* Les deux dates. Elles ne partent pas d'une origine inventée : le zéro est
       l'heure vraie de la machine à l'instant où l'on est monté à bord. On lit
       donc une date réelle qui défile, et celle du bord qui prend du retard —
       le paradoxe des jumeaux cesse d'être un chapitre pour devenir un cadran.

       Le retard vient de √(1 − r_s/r), accumulé image par image : il grandit
       vite au périastre et lentement à l'apoastre, ce qui est le phénomène
       lui-même et non une moyenne commode. */
    const t0 = salon.t0 || Date.now();
    const dTerre = new Date(t0 + (salon.tTerre || 0)*1000);
    const dBord  = new Date(t0 + (salon.tBord  || 0)*1000);
    /* Les deux horloges sont côte à côte et se comparent au caractère près :
       elles prennent donc la MÊME convention, celle de la langue lue. */
    const jour = d => d.toLocaleDateString(LOCALE(),
                        { day:"numeric", month:"short", year:"numeric" });
    const heure = d => d.toLocaleTimeString(LOCALE());

    const pendule = (nom, d, teinte, y) => {
      ctx.textAlign = "left"; ctx.fillStyle = teinte;
      ctx.font = "9px ui-monospace, monospace"; ctx.fillText(nom, MG, y);
      ctx.textAlign = "right"; ctx.fillStyle = "#8ea6c8";
      ctx.font = "9px ui-monospace, monospace"; ctx.fillText(jour(d), LARG-MG, y);
      ctx.textAlign = "left"; ctx.fillStyle = "#dce6f5";
      ctx.font = "15px ui-monospace, monospace"; ctx.fillText(heure(d), MG, y + 18);
    };

    etiq(T("salon.ecran.pendant"), 100);
    pendule(T("salon.ecran.terre"), dTerre, "#ffd08a", 116);
    pendule(T("salon.ecran.bord"),  dBord,  "#7fd8ff", 152);
    filet(166);

    const retard = (salon.tTerre || 0) - (salon.tBord || 0);
    ctx.textAlign = "left"; ctx.fillStyle = "#4d6389";
    ctx.font = "8.5px -apple-system, sans-serif";
    ctx.fillText(remplit("salon.ecran.retard", {
      t: tempsFr(retard),
      x: virgule((cadence(len(salon.p))*100).toFixed(1)),
    }), MG, 180);
    ctx.fillText(remplit("salon.ecran.accelere", { f: salon.facteur }), MG, 193);
  }, "temps", e)) poses++;

  return poses;
}

global.ECRANS = { dessine, projette, toile };

})(window);
