/* ============================================================================
   L'ATLAS — le registre des cartes photographiques, et lui seul

   SORTI DE `rivage.js` LE 16 AOÛT 2026, et il faut dire pourquoi.

   Hugo, en jugeant l'arrivée : « la terre et la lune utilise des vrai photo,
   ont les a dans le projet ». Il avait raison — `cartes/terre.jpg` et
   `cartes/lune.jpg` étaient là depuis le 11 août, sourcées et gardées, et
   SEULE la page du rivage s'en servait. La scène de l'arrivée dessinait encore
   des taches à la main.

   Le registre vivait dans `rivage.js`, avec les marées, la limite de Roche et
   le piquet. La page principale ne charge pas ce module, et le charger entier
   pour six entrées aurait fait entrer une scène de plage dans le vaisseau. La
   tentation était d'en recopier une seconde liste. C'est exactement la maladie
   que ce dépôt traque : deux tables décrivant la même chose, dont l'une
   diverge en silence. Un fichier ne coûte rien ; deux vérités coûtent une
   soirée.

   `rivage.js` continue d'exposer `CARTES`, `carteDe`, `carteValide` et
   `creditDe` sous `RIVAGE` — sa page et son outil les appellent par ces noms —
   mais il ne les POSSÈDE plus : il les relaie depuis ici. Un seul écrivain.

   Ce module ne dessine pas. Il ne connaît ni canevas, ni WebGL, ni la manière
   dont une carte cylindrique se pose sur une sphère : `rivage.html` le fait en
   WebGL, `terrelune.js` en projection orthographique, et ni l'un ni l'autre
   n'a besoin de l'autre pour être vrai.
   ============================================================================ */

(function(global){
"use strict";

/* --------------------------------------------------------------------------
   LES CARTES — la porte ouverte le 11 août 2026 par Hugo

   Il a regardé mon Jupiter dessiné à la main et tranché : « très très moche,
   on dirait une merde orange… tu ne t'acharnes pas trop avec cette promesse de
   tout est calculé, si on importe des trucs, aussi bien. »

   Il a raison, et le renversement mérite d'être écrit noir sur blanc : une
   carte photographique est une OBSERVATION, du même genre que les rayons et les
   masses du JPL que ce module dérive déjà. Mes bandes, elles, ne viennent de
   nulle part. **L'objet importé est le plus sourcé des deux.**

   POUR EN AJOUTER UNE, il faut trois choses, et `carteValide` les exige :

     { cle:"jupiter", fichier:"cartes/jupiter.jpg", source:"…", licence:"…" }

   Une carte sans source ne peut pas entrer — c'est la règle 6 appliquée aux
   pixels comme aux phrases. Une carte sans licence non plus : une image qu'on
   n'a pas le droit de servir est un défaut juridique, pas un défaut d'image, et
   il ne se voit sur aucun écran.

   Tant qu'un astre n'a pas de carte, la page le DESSINE, comme aujourd'hui, et
   l'avoue. Les deux chemins cohabitent sans que l'un attende l'autre.

   ---------------------------------------------------------------------------
   CE QUI A ÉTÉ RAPATRIÉ, ET CE QUI A ÉTÉ REFUSÉ

   Les six cartes ci-dessous sont toutes en 2048×1024 — deux puissances de deux,
   parce qu'en dessous de cette exigence WebGL 1 rend un disque entièrement noir
   sans le dire — et toutes sous 400 Ko.

   Quatre sont des OBSERVATIONS au sens plein : Jupiter est une mosaïque Cassini,
   Mars une mosaïque Viking, la Terre un composite MODIS, la Lune une mosaïque
   LROC. Deux ne le sont qu'à moitié : aucune agence ne publie de carte globale
   de Saturne ni de Neptune — Voyager et Cassini n'en ont jamais couvert la
   surface entière —, et les seules cartes libres de droits pour ces deux-là sont
   des textures dérivées d'imagerie NASA, aux couleurs retouchées. C'est écrit
   dans leur `source`, en toutes lettres, parce que c'est le genre de chose qu'on
   ne voit pas sur un écran.

   Les cartes de Björn Jónsson — les meilleures qui existent pour Saturne et
   Neptune — ont été ÉCARTÉES après lecture de ses conditions : il autorise leur
   usage mais demande expressément qu'on n'en héberge pas de copie. Un site
   statique ne peut pas faire autrement que d'en héberger une.                */
const CARTES = [
  { cle:"jupiter", fichier:"cartes/jupiter.jpg",
    credit:"NASA/JPL/Space Science Institute — Cassini",
    source:"NASA/JPL/Space Science Institute — Cassini, caméra à champ étroit, " +
           "36 images en deux longueurs d'onde prises en neuf heures fin décembre 2000 ; " +
           "mosaïque cylindrique PIA07782, « Cassini's Best Maps of Jupiter (Cylindrical Map) », " +
           "https://science.nasa.gov/photojournal/cassinis-best-maps-of-jupiter-cylindrical-map/ " +
           "— original 3601×1801, réduit ici à 2048×1024",
    licence:"Domaine public. Le contenu de la NASA n'est en général pas soumis au " +
            "droit d'auteur aux États-Unis ; la seule obligation est de citer la source, " +
            "ce que fait cette entrée. https://www.nasa.gov/nasa-brand-center/images-and-media/" },

  { cle:"mars", fichier:"cartes/mars.jpg",
    credit:"USGS Astrogeology / NASA — Viking",
    source:"USGS Astrogeology Science Center / NASA Ames — « Mars Viking Colorized " +
           "Global Mosaic 232m », colorisation posée sur le Mars Digital Image Model " +
           "MDIM 2.1, lui-même bâti sur environ 4 600 images des orbiteurs Viking ; " +
           "projection cylindrique simple, −90° à +90°, −180° à +180°, " +
           "https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m " +
           "— version 21339×10670, réduite ici à 2048×1024",
    licence:"Domaine public. La fiche USGS porte « Access Constraints: Public domain » " +
            "et « Use Constraints: None »." },

  { cle:"terre", fichier:"cartes/terre.jpg",
    credit:"NASA Earth Observatory — MODIS/Terra",
    source:"NASA Earth Observatory — « Blue Marble: Next Generation », composite " +
           "mensuel d'août 2004 avec relief et bathymétrie, monté par Reto Stöckli " +
           "à partir des observations de MODIS sur le satellite Terra ; " +
           "https://visibleearth.nasa.gov/images/73776/ " +
           "(fichier world.topo.bathy.200408.3x5400x2700.jpg, 5400×2700, réduit ici " +
           "à 2048×1024)",
    licence:"Domaine public. La page de production demande de créditer « NASA Earth " +
            "Observatory », ce que fait cette entrée. " +
            "https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation" },

  { cle:"lune", fichier:"cartes/lune.jpg",
    credit:"NASA Scientific Visualization Studio — LRO",
    source:"NASA Scientific Visualization Studio — « CGI Moon Kit » (2019), carte " +
           "couleur bâtie par les équipes de la caméra grand angle et de l'altimètre " +
           "laser de Lunar Reconnaissance Orbiter ; les régions polaires, mal " +
           "éclairées, sont complétées par le relief LOLA. " +
           "https://svs.gsfc.nasa.gov/4720/ (fichier lroc_color_poles_4k.tif, " +
           "4096×2048, réduit ici à 2048×1024)",
    licence:"Domaine public. Le SVS demande de créditer « NASA's Scientific " +
            "Visualization Studio », ce que fait cette entrée." },

  { cle:"saturne", fichier:"cartes/saturne.jpg",
    credit:"Solar System Scope — CC BY 4.0",
    source:"Solar System Scope (INOVE), jeu « Solar Textures » — PAS une mosaïque " +
           "brute : une texture dérivée d'imagerie NASA, dont l'auteur déclare que " +
           "les couleurs sont un peu plus saturées que la réalité et que les zones " +
           "jamais cartographiées sont comblées. Aucune agence ne publie de carte " +
           "globale de Saturne. https://www.solarsystemscope.com/textures/ " +
           "(fichier 8k_saturn.jpg, 4096×2048, réduit ici à 2048×1024)",
    licence:"Creative Commons Attribution 4.0 International, telle qu'annoncée sur " +
            "la page de téléchargement : usage, adaptation et partage libres, y " +
            "compris commercial, contre citation de l'auteur. " +
            "https://creativecommons.org/licenses/by/4.0/" },

  { cle:"neptune", fichier:"cartes/neptune.jpg",
    credit:"Solar System Scope — CC BY 4.0",
    source:"Solar System Scope (INOVE), jeu « Solar Textures » — même réserve que " +
           "Saturne : texture dérivée des images de Voyager 2, couleurs retouchées, " +
           "et Voyager 2 n'a survolé Neptune qu'une fois, en 1989. " +
           "https://www.solarsystemscope.com/textures/ (fichier 2k_neptune.jpg, " +
           "2048×1024, servi tel quel)",
    licence:"Creative Commons Attribution 4.0 International, telle qu'annoncée sur " +
            "la page de téléchargement. https://creativecommons.org/licenses/by/4.0/" },
];

function carteValide(c){
  return !!c && typeof c.cle === "string" && typeof c.fichier === "string"
      && typeof c.source === "string" && c.source.length > 12
      && typeof c.licence === "string" && c.licence.length > 3;
}

/* Rend la carte d'un astre, ou null. Une entrée mal formée ne passe PAS en
   silence : elle est refusée ici et signalée par l'outil. */
function carteDe(cle){
  const c = CARTES.find(x => x && x.cle === cle);
  return carteValide(c) ? c : null;
}

/* --------------------------------------------------------------------------
   LE CRÉDIT À L'ÉCRAN — une obligation, pas une politesse

   Deux des six licences sont des Creative Commons Attribution : elles donnent
   le droit de servir l'image CONTRE citation de l'auteur, et une citation
   enfouie dans un fichier de code n'est pas une citation. Les quatre autres
   viennent d'agences publiques qui demandent, elles aussi, d'être créditées.

   Le crédit se pose donc DANS LA SCÈNE, sous les yeux de qui regarde l'astre.
   Et il rend au passage un service que rien d'autre ne rendait : la page
   AVOUE, astre par astre, si l'on regarde une photographie ou un dessin.    */
function creditDe(cle){
  const c = carteDe(cle);
  return (c && typeof c.credit === "string" && c.credit) ? c.credit : null;
}

/* --------------------------------------------------------------------------
   POSER UNE CARTE CYLINDRIQUE SUR UNE SPHÈRE — en pixels, et sans navigateur

   `rivage.html` fait ce travail en WebGL, dans un nuanceur. La scène de
   l'arrivée dessine sur un canevas 2D, et n'a pas de nuanceur sous la main.
   Écrire la projection deux fois donnerait deux lois pour une même géométrie —
   la maladie connue — mais les deux moteurs sont trop différents pour partager
   du code. Ce qu'ils PEUVENT partager est la seule chose qui compte : le
   résultat. `outil-verif-atlas.js` confronte donc cette projection à la formule
   du nuanceur, point par point, plutôt que de croire l'une ou l'autre.

   POURQUOI C'EST ÉCRIT SUR DES TABLEAUX ET NON SUR UN CANEVAS. `projette` prend
   deux objets `{ data, width, height }` — exactement la forme d'un `ImageData`,
   et exactement celle d'un `Uint8ClampedArray` fabriqué à la main. Le module ne
   touche donc ni au DOM ni à une image : la page lui tend les pixels, il les
   rend, et tout se joue en ligne de commande. C'est la même manœuvre que
   `fabriqueToile` dans `ecrans.js`.

   LE COÛT EST PAYÉ UNE FOIS. Le disque ne change pas quand l'astre grossit —
   c'est le MÊME disque, plus grand. On projette donc une fois à un rayon de
   référence, et chaque image n'est plus qu'une mise à l'échelle.

   ---------------------------------------------------------------------------
   LE POINT SOUS L'OBSERVATEUR — un compromis pour la Terre, un fait pour la Lune

   On ne sait pas quelle face de la Terre est tournée vers nous : il faudrait
   l'heure, et le site n'a pas de date. C'est le même aveu que les orbites — on
   sait où la planète tourne, pas où elle en est. On prend donc l'ORIGINE du
   repère, longitude et latitude nulles, parce que c'est le seul choix qui ne
   soit pas un choix : prendre la face « qui rend le mieux » serait exactement
   ce que la règle 4 interdit. C'est déclaré dans `contrat.js`.

   Pour la LUNE, ce n'est pas un compromis du tout. Sa rotation est synchrone :
   elle présente toujours la même face, et cette face EST la longitude nulle du
   repère lunaire. La carte du LRO est orientée ainsi. Le même code donne donc
   un aveu d'un côté et une vérité de l'autre, et il faut que ce soit écrit,
   sinon on croirait tricher deux fois.                                        */

/* --------------------------------------------------------------------------
   ET LE REPLI N'EST PAS UN CAS D'ERREUR — c'est le comportement normal.

   Tant que la photographie n'est pas là — pas encore chargée, ou jamais —
   l'appelant doit dessiner le globe calculé de `lune.js`. Une carte qui manque
   ne laisse jamais un trou dans la baie. C'est la doctrine de `poseCarte` dans
   `rivage.html`, et elle se garde en deux points : `projette` rend **zéro**
   plutôt que de lever quand la source est vide, et `TERRELUNE.poseCartes`
   accepte de ne rien recevoir.

   Un échec est définitif pour la session : on ne réessaie pas une image qui n'a
   pas chargé, sinon une panne de réseau lance une requête par image.

   `TOILE` est le côté du disque de référence, en pixels. Il vit ici et non dans
   la page parce que c'est lui qui décide de la finesse de la projection, et que
   c'est `outil-verif-atlas.js` qui doit pouvoir la mesurer.                   */
const TOILE = 1024;

const SOUS_OBS = { lat: 0, lon: 0 };

/* Un pixel du carré vers un point de la sphère unité, en coordonnées de la
   carte. `dx`, `dy` sont réduits au rayon : le disque est |(dx,dy)| ≤ 1.

   `dy` DESCEND, comme un écran ; la latitude MONTE. Le signe est donc renversé
   ici, une fois, plutôt que chez trois appelants — une inversion de nord se
   voit mal sur une planète et pas du tout sur la Lune.

   Rend `null` hors du disque : c'est le bord de l'astre, pas une erreur. */
function latLon(dx, dy, sousObs){
  const rho2 = dx*dx + dy*dy;
  if(rho2 > 1) return null;
  const rho = Math.sqrt(rho2);
  const o = sousObs || SOUS_OBS;
  // Au centre exact, `c` vaut 0 et la formule générale divise par rho : on rend
  // le point sous l'observateur, qui en est la limite.
  if(rho < 1e-12) return { lat: o.lat, lon: o.lon };
  const c = Math.asin(Math.min(1, rho));
  const sc = Math.sin(c), cc = Math.cos(c);
  const nord = -dy;                                   // l'écran descend, pas le ciel
  const sinLat = cc*Math.sin(o.lat) + (nord*sc*Math.cos(o.lat))/rho;
  const lat = Math.asin(Math.max(-1, Math.min(1, sinLat)));
  const lon = o.lon + Math.atan2(dx*sc,
                                 rho*cc*Math.cos(o.lat) - nord*sc*Math.sin(o.lat));
  return { lat, lon };
}

/* Point de la sphère → case de la carte cylindrique. La convention est celle
   des cartes employées ici, et elle est vérifiable sur l'image : x croît vers
   l'est depuis −180°, y descend depuis le pôle nord. */
function uv(lat, lon){
  let l = lon;
  while(l >  Math.PI) l -= 2*Math.PI;                 // ramener dans ]−π, π]
  while(l <= -Math.PI) l += 2*Math.PI;
  return { u: (l + Math.PI) / (2*Math.PI),
           v: (Math.PI/2 - lat) / Math.PI };
}

/* Remplit `dest` (un carré de côté `dest.width`) avec le disque de l'astre vu
   depuis `sousObs`. Hors du disque, alpha = 0 : l'appelant pose ce qu'il veut
   derrière, et le bord reste celui de la sphère et non celui d'un carré.

   Rend le nombre de pixels peints — un contrôle peut ainsi vérifier que la
   projection a MORDU, plutôt que de constater qu'elle n'a pas planté. */
function projette(source, dest, sousObs){
  if(!source || !dest || !source.data || !dest.data) return 0;
  const T = dest.width;
  if(!(T > 0) || dest.height !== T) return 0;
  const SW = source.width, SH = source.height;
  if(!(SW > 0) || !(SH > 0)) return 0;

  const R = T/2, o = sousObs || SOUS_OBS;
  const s = source.data, d = dest.data;
  let peints = 0;

  for(let py = 0; py < T; py++){
    const dy = (py + 0.5 - R) / R;
    for(let px = 0; px < T; px++){
      const dx = (px + 0.5 - R) / R;
      const k = (py*T + px) * 4;
      const p = latLon(dx, dy, o);
      if(!p){ d[k+3] = 0; continue; }
      const c = uv(p.lat, p.lon);
      let sx = Math.floor(c.u * SW); if(sx >= SW) sx = SW - 1; if(sx < 0) sx = 0;
      let sy = Math.floor(c.v * SH); if(sy >= SH) sy = SH - 1; if(sy < 0) sy = 0;
      const j = (sy*SW + sx) * 4;
      d[k] = s[j]; d[k+1] = s[j+1]; d[k+2] = s[j+2]; d[k+3] = 255;
      peints++;
    }
  }
  return peints;
}

global.ATLAS = { LISTE: CARTES, carteDe, carteValide, creditDe,
                 TOILE, SOUS_OBS, latLon, uv, projette };

})(typeof window !== "undefined" ? window : globalThis);
