/* ============================================================================
   Source de vérité unique du contenu du site.

   Trois consommateurs lisent ce fichier :
     - index.html          pour l'affichage
     - outils/voix.py      pour générer les MP3 de Lumen (les `id` sont les noms
                           de fichiers, ils ne doivent jamais changer)
     - outils/sources.py   pour produire SOURCES.md et permettre l'audit

   Règle : aucune affirmation factuelle ne doit exister ailleurs que dans ce
   fichier, et chacune doit porter au moins une clé de `sources`.
   ============================================================================ */

window.CONTENU = {

// ---------------------------------------------------------------- références
sources: {
  gravity2021: {
    ref: "GRAVITY Collaboration (Abuter et al.), « Mass distribution in the Galactic Centre based on interferometric astrometry of multiple stellar orbits », Astronomy & Astrophysics 657, L12 (2022)",
    doi: "10.1051/0004-6361/202142465",
    sert: "Masse de Sgr A* (4,297 × 10⁶ M☉) et distance (8 277 pc)",
  },
  gravity2020: {
    ref: "GRAVITY Collaboration, « Detection of the Schwarzschild precession in the orbit of the star S2 », Astronomy & Astrophysics 636, L5 (2020)",
    doi: "10.1051/0004-6361/202037813",
    sert: "Précession de Schwarzschild de S2, ~12′ par orbite",
  },
  gravity2018: {
    ref: "GRAVITY Collaboration, « Detection of the gravitational redshift in the orbit of the star S2 », Astronomy & Astrophysics 615, L15 (2018)",
    doi: "10.1051/0004-6361/201833718",
    sert: "Redshift gravitationnel mesuré au périastre 2018 ; vitesse de S2 au périastre",
  },
  eht2022: {
    ref: "Event Horizon Telescope Collaboration, « First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way », ApJL 930, L12 (2022)",
    doi: "10.3847/2041-8213/ac6674",
    sert: "Image de Sgr A*, diamètre d'anneau 51,8 ± 2,3 μas, contraintes d'inclinaison",
  },
  eht2019: {
    ref: "Event Horizon Telescope Collaboration, « First M87 Event Horizon Telescope Results. V. Physical Origin of the Asymmetric Ring », ApJL 875, L5 (2019)",
    doi: "10.3847/2041-8213/ab0f43",
    sert: "Asymétrie Doppler comme indicateur du sens de rotation de M87*",
  },
  nobel2020: {
    ref: "Prix Nobel de physique 2020, Reinhard Genzel et Andrea Ghez, « for the discovery of a supermassive compact object at the centre of our galaxy »",
    url: "https://www.nobelprize.org/prizes/physics/2020/summary/",
    sert: "Attribution du Nobel 2020 pour le suivi stellaire du centre galactique",
  },
  schwarzschild1916: {
    ref: "K. Schwarzschild, « Über das Gravitationsfeld eines Massenpunktes nach der Einsteinschen Theorie », Sitzungsberichte der Königlich Preussischen Akademie der Wissenschaften (1916), 189-196",
    sert: "Métrique de Schwarzschild, rayon r_s = 2GM/c²",
  },
  dyson1920: {
    ref: "F. W. Dyson, A. S. Eddington, C. Davidson, « A Determination of the Deflection of Light by the Sun's Gravitational Field, from Observations Made at the Total Eclipse of May 29, 1919 », Phil. Trans. R. Soc. A 220, 291-333 (1920)",
    doi: "10.1098/rsta.1920.0009",
    sert: "Mesure de la déflexion de 1,75″ au limbe solaire, soit le double de la valeur newtonienne",
  },
  bardeen1972: {
    ref: "J. M. Bardeen, W. H. Press, S. A. Teukolsky, « Rotating Black Holes: Locally Nonrotating Frames, Energy Extraction, and Scalar Synchrotron Radiation », ApJ 178, 347 (1972)",
    doi: "10.1086/151796",
    sert: "ISCO à 6GM/c² (Schwarzschild), GM/c² (Kerr extrême prograde), 9GM/c² (rétrograde) ; rendements 5,7 % et 42 %",
  },
  bardeen1973: {
    ref: "J. M. Bardeen, « Timelike and null geodesics in the Kerr metric », dans Black Holes (Les Houches 1972), DeWitt & DeWitt (éds.), Gordon & Breach (1973)",
    sert: "Rayon apparent de l'ombre, paramètre d'impact critique b_c = √27 GM/c²",
  },
  luminet1979: {
    ref: "J.-P. Luminet, « Image of a spherical black hole with thin accretion disk », Astronomy & Astrophysics 75, 228-235 (1979)",
    sert: "Premier calcul d'image d'un trou noir à disque mince : image secondaire, asymétrie Doppler",
  },
  gralla2019: {
    ref: "S. E. Gralla, D. E. Holz, R. M. Wald, « Black hole shadows, photon rings, and lensing rings », Physical Review D 100, 024018 (2019)",
    doi: "10.1103/PhysRevD.100.024018",
    sert: "Distinction ombre / anneau de photons ; espacement des sous-anneaux d'ordre n en e^(−π)",
  },
  shakura1973: {
    ref: "N. I. Shakura, R. A. Sunyaev, « Black holes in binary systems. Observational appearance », Astronomy & Astrophysics 24, 337-355 (1973)",
    sert: "Modèle de disque mince, viscosité α",
  },
  balbus1991: {
    ref: "S. A. Balbus, J. F. Hawley, « A powerful local shear instability in weakly magnetized disks. I », ApJ 376, 214 (1991)",
    doi: "10.1086/170270",
    sert: "Instabilité magnétorotationnelle (MRI) comme source de la viscosité effective",
  },
  yuan2014: {
    ref: "F. Yuan, R. Narayan, « Hot Accretion Flows Around Black Holes », Annual Review of Astronomy and Astrophysics 52, 529-588 (2014)",
    doi: "10.1146/annurev-astro-082812-141003",
    sert: "Régime RIAF/ADAF, Sgr A* très sous-lumineux, disque géométriquement épais H/R ~ 1",
  },
  penrose1965: {
    ref: "R. Penrose, « Gravitational Collapse and Space-Time Singularities », Physical Review Letters 14, 57 (1965)",
    doi: "10.1103/PhysRevLett.14.57",
    sert: "Théorème de singularité ; Nobel 2020 partagé pour ce résultat",
  },
  amps2013: {
    ref: "A. Almheiri, D. Marolf, J. Polchinski, J. Sully, « Black holes: complementarity or firewalls? », JHEP 2013, 62 (2013)",
    doi: "10.1007/JHEP02(2013)062",
    sert: "Argument du firewall à l'horizon",
  },
  penington2020: {
    ref: "G. Penington, « Entanglement wedge reconstruction and the information paradox », JHEP 2020, 2 ; et A. Almheiri et al., « The entropy of bulk quantum fields and the entanglement wedge of an evaporating black hole », JHEP 2019, 63",
    doi: "10.1007/JHEP09(2020)002",
    sert: "Courbe de Page reconstruite par surfaces quantiques extrémales (îlots)",
  },
  birkhoff1923: {
    ref: "G. D. Birkhoff, Relativity and Modern Physics, Harvard University Press (1923), p. 253",
    sert: "Théorème de Birkhoff : à l'extérieur d'une distribution sphérique, la métrique ne dépend que de M",
  },
  chandrasekhar1983: {
    ref: "S. Chandrasekhar, The Mathematical Theory of Black Holes, Oxford University Press (1983), chap. 3",
    sert: "Équation des géodésiques (forme de Binet) pour Schwarzschild, sphère des photons à 3GM/c²",
  },
  kerr1963: {
    ref: "R. P. Kerr, « Gravitational Field of a Spinning Mass as an Example of Algebraically Special Metrics », Physical Review Letters 11, 237 (1963)",
    doi: "10.1103/PhysRevLett.11.237",
    sert: "Métrique de Kerr : la solution décrivant un trou noir en rotation",
  },
  lense1918: {
    ref: "J. Lense, H. Thirring, Physikalische Zeitschrift 19, 156 (1918) ; mesure autour de la Terre : C. W. F. Everitt et al., « Gravity Probe B: Final Results of a Space Experiment to Test General Relativity », Physical Review Letters 106, 221101 (2011)",
    doi: "10.1103/PhysRevLett.106.221101",
    sert: "Entraînement des repères par une masse en rotation, prédit en 1918 et mesuré autour de la Terre en 2011",
  },
  penrose1969: {
    ref: "R. Penrose, « Gravitational Collapse: The Role of General Relativity », Rivista del Nuovo Cimento 1, 252 (1969)",
    sert: "Extraction d'énergie de rotation depuis l'ergosphère (processus de Penrose)",
  },
  blandford1977: {
    ref: "R. D. Blandford, R. L. Znajek, « Electromagnetic extraction of energy from Kerr black holes », MNRAS 179, 433-456 (1977)",
    doi: "10.1093/mnras/179.3.433",
    sert: "Mécanisme alimentant les jets : extraction magnétique de l'énergie de rotation",
  },
  yuan2003: {
    ref: "F. Yuan, E. Quataert, R. Narayan, « Nonthermal Electrons in Radiatively Inefficient Accretion Flow Models of Sagittarius A* », ApJ 598, 301 (2003)",
    doi: "10.1086/378716",
    sert: "Distribution spectrale d'énergie de Sgr A* : montée radio, pic submillimétrique, creux infrarouge, bosse X",
  },
  genzel2010: {
    ref: "R. Genzel, F. Eisenhauer, S. Gillessen, « The Galactic Center massive black hole and nuclear star cluster », Reviews of Modern Physics 82, 3121 (2010)",
    doi: "10.1103/RevModPhys.82.3121",
    sert: "Revue du centre galactique : SED, sursauts infrarouges et X, luminosité bolométrique ~10⁻⁹ L_Edd",
  },
  balick1974: {
    ref: "B. Balick, R. L. Brown, « Intense sub-arcsecond structure in the galactic center », ApJ 194, 265 (1974)",
    doi: "10.1086/153242",
    sert: "Découverte de Sgr A* en ondes radio, en 1974",
  },
  bussard1960: {
    ref: "R. W. Bussard, « Galactic Matter and Interstellar Flight », Astronautica Acta 6, 179-194 (1960)",
    sert: "Statoréacteur interstellaire : collecter l'hydrogène du milieu interstellaire, le fusionner, l'éjecter — donc ne pas emporter son carburant",
  },
  zubrin1989: {
    ref: "D. G. Andrews, R. M. Zubrin, « Magnetic Sails and Interstellar Travel », Journal of the British Interplanetary Society 43, 265-272 (1990) ; voir aussi A. Bond, JBIS 27, 674 (1974)",
    sert: "Le collecteur magnétique du statoréacteur produit plus de traînée que de poussée : le concept freine au lieu d'accélérer",
  },
  dyson1968: {
    ref: "F. J. Dyson, « Interstellar Transport », Physics Today 21, 10, 41-45 (1968) ; et A. Bond et al., « Project Daedalus », JBIS Supplement (1978)",
    doi: "10.1063/1.3034534",
    sert: "Propulsion nucléaire pulsée (Orion) et fusion pulsée (Daedalus) : les seuls concepts à l'échelle de l'ingénierie, ~3 à 12 % de c",
  },
  misner1973: {
    ref: "C. W. Misner, K. S. Thorne, J. A. Wheeler, Gravitation, W. H. Freeman (1973), §25 et §31",
    sert: "Marées en M/r³, chute libre régulière à travers l'horizon, temps propre maximal πGM/c³",
  },
},

// ------------------------------------------------------------------- niveaux
niveaux: ["Découverte", "Curieux", "Astrophysicien"],

// --------------------------------------------------------------------- voix
// `id` = nom du fichier : voix/<voix>/<id>.mp3. Ne jamais renommer un id sans
// régénérer, sinon la réplique devient muette.
voix: [
  { id:"remy", nom:"Rémy", modele:"fr-FR-RemyMultilingualNeural" },
],

// ---------------------------------------------------- spectre électromagnétique
// Le fait à faire passer : c'est la longueur d'onde qui décide si l'ombre est
// visible. En radio le flux d'accrétion est opaque et forme une photosphère qui
// bouche tout ; vers le millimétrique il devient transparent et l'anneau
// apparaît. C'est la raison d'être de l'EHT à 1,3 mm.
//
// `sed` : distribution spectrale, en [log₁₀(λ en m), log₁₀(νLν en erg/s)].
// Ordres de grandeur d'après Yuan+2003 et la revue Genzel+2010.
spectre: {
  sed: [
    [-0.52, 33.5], [-1.52, 34.0], [-2.52, 34.7], [-2.89, 35.0],
    [-3.52, 35.5], [-4.00, 35.2], [-4.52, 34.0], [-5.66, 33.5],
    [-6.22, 32.5], [-7.00, 32.0], [-8.90, 33.3], [-9.90, 33.2],
    [-12.1, 31.0],
  ],
  // Un débutant qui ouvre l'outil tombe sur une réglette et une courbe sans
  // légende. On explique d'abord, et on ne le fait qu'une fois.
  lecon: { niv:[
    `<b>Une seconde — c'est un outil d'astronome.</b>
     <br><br>Ce que tu appelles « lumière » n'est qu'une <i>toute petite fenêtre</i>.
     Les mêmes ondes existent en plus long et en plus court : les ondes radio de
     ta voiture, la chaleur que tu sens près d'un feu, les rayons X de l'hôpital.
     C'est la même chose, avec des longueurs différentes. Ton œil n'en voit qu'une
     bande minuscule ; les astronomes ont des instruments pour toutes les autres.
     <br><br>La <b>courbe</b> ci-dessous montre combien Sgr A* envoie d'énergie
     dans chaque longueur d'onde. Plus elle est haute, plus il brille dans cette
     bande. Tu vas voir quelque chose de troublant : il ne brille presque pas
     là où ton œil regarde.
     <br><br>Les <b>boutons</b> sont les longueurs d'onde où il s'est passé
     quelque chose d'important. Chacun t'explique quoi.`,

    `La courbe est la <b>distribution spectrale</b> de Sgr A* : l'énergie émise
     à chaque longueur d'onde, mesurée. Elle monte en radio, culmine dans le
     submillimétrique, s'effondre dans le visible, et remonte un peu en X.
     <br><br>Le point à retenir : la <b>transparence</b> du gaz dépend de la
     longueur d'onde. En radio il est opaque et cache l'ombre. C'est pour ça que
     l'EHT a dû aller chercher 1,3 mm.`,

    `SED de Sgr A* d'après Yuan, Quataert &amp; Narayan (2003) et la revue de
     Genzel, Eisenhauer &amp; Gillessen (2010) — ordres de grandeur en νLν.
     <br><br>La photosphère synchrotron est modélisée avec une taille apparente
     variant à peu près comme λ, calée sur la transition à τ ~ 1 vers 230 GHz.
     Les couleurs sont conventionnelles hors du visible.`,
  ]},

  // Longueurs d'onde où il se passe quelque chose, et pourquoi on s'y arrête.
  reperes: [
    { nom:"3 cm", lg:-1.52, sous:"La découverte, 1974",
      pourquoi:`Balick et Brown trouvent ici une source minuscule et intense au centre
                de la Galaxie. On ne voit qu'une tache : à cette longueur d'onde le gaz
                est <b>opaque</b>, et il cache tout ce qui se passe en dessous.`,
      sources:["balick1974"] },
    { nom:"1,3 mm", lg:-2.886, sous:"L'œil de l'Event Horizon Telescope",
      pourquoi:`La fenêtre. Le gaz devient <b>transparent</b> et l'ombre apparaît enfin.
                C'est pour cette unique raison que l'EHT observe à cette longueur d'onde —
                et il a fallu un interféromètre grand comme la Terre pour la résoudre.`,
      sources:["eht2022"] },
    { nom:"300 μm", lg:-3.52, sous:"Le pic d'émission",
      pourquoi:`Le maximum de la bosse submillimétrique : c'est là que Sgr A* rayonne
                le plus. Un trou noir bien nourri brillerait surtout en X ;
                celui-ci, sous-alimenté, brille dans une bande que l'œil ignore.`,
      sources:["yuan2003"] },
    { nom:"2,2 μm", lg:-5.66, sous:"Bande K — les sursauts",
      pourquoi:`Calme la plupart du temps, puis des <b>sursauts</b> plusieurs fois par jour,
                jusqu'à cent fois plus brillants. C'est ce que l'instrument GRAVITY
                surveille, et c'est ainsi qu'on a vu de la matière tourner à quelques
                rayons de l'horizon.`,
      sources:["gravity2018","genzel2010"] },
    { nom:"600 nm", lg:-6.22, sous:"L'œil humain",
      pourquoi:`Presque rien. Toute la beauté orange des images est une convention :
                à cette longueur d'onde, le trou noir ne se trahit que par les
                <b>étoiles déformées</b> derrière lui.`,
      sources:["yuan2003"] },
    { nom:"1 keV", lg:-8.9, sous:"Chandra",
      pourquoi:`Une émission faible mais <b>bien plus étendue</b> que le trou noir :
                elle vient du gaz capturé loin, à des milliers de rayons. Plus des
                sursauts. Sgr A* est ici un million de fois trop pâle pour sa masse.`,
      sources:["genzel2010","yuan2014"] },
  ],
  bandes: [
    { id:"radio",   nom:"Ondes radio",  min:-2.0,  max:0.5,
      note:`C'est ici qu'on l'a <b>découvert</b>, en 1974. Mais le gaz y est opaque :
            il forme une photosphère qui masque complètement l'ombre.`,
      sources:["balick1974","yuan2003"] },
    { id:"submm",   nom:"Submillimétrique", min:-3.3, max:-2.0,
      note:`Le <b>pic d'émission</b>, et la fenêtre de l'Event Horizon Telescope à 1,3 mm.
            Le gaz devient transparent : c'est la seule bande où l'anneau apparaît.`,
      sources:["eht2022","yuan2003"] },
    { id:"ir",      nom:"Infrarouge",   min:-6.15, max:-3.3,
      note:`Calme, avec des <b>sursauts</b> plusieurs fois par jour — c'est ce que
            GRAVITY surveille. L'émission devient compacte.`,
      sources:["gravity2018","genzel2010"] },
    { id:"visible", nom:"Lumière visible", min:-6.40, max:-6.15,
      note:`Presque <b>rien</b>. Rien ne brille à l'œil nu ici. Le trou noir ne se
            trahit que par les étoiles déformées derrière lui.`,
      sources:["yuan2003"] },
    { id:"uv",      nom:"Ultraviolet",  min:-8.0,  max:-6.40,
      note:`Toujours presque rien, et sur le trajet depuis la Terre tout est absorbé
            par la poussière du disque galactique.`,
      sources:["genzel2010"] },
    { id:"x",       nom:"Rayons X",     min:-11.0, max:-8.0,
      note:`Une émission faible et <b>étendue</b>, bien plus large que le trou noir,
            plus des sursauts. Chandra l'observe depuis 1999.`,
      sources:["genzel2010","yuan2014"] },
    { id:"gamma",   nom:"Rayons gamma", min:-13.0, max:-11.0,
      note:`Rien qu'on sache attribuer à Sgr A* lui-même. Le centre galactique
            en émet, mais d'autres sources s'y mêlent.`,
      sources:["genzel2010"] },
  ],
},

// ----------------------------------------------------------- destination
// Le salon voyage. Changer de système, c'est changer ces valeurs — pas le code.
// `arrivee` remet le chronomètre à zéro : le vaisseau est en orbite ici depuis
// cette date, et les écrans de bord l'affichent.
destination: {
  id: "sgr-a",
  nom: "Sagittarius A*",
  sous: "Trou noir supermassif · centre de la Voie lactée",
  arrivee: "2026-08-04T06:00:00Z",
  distance: "8 277 pc de la Terre",
  masse: "4,297 × 10⁶ masses solaires",
  // Ce qui suit s'affiche sur l'écran des paramètres de vol
  orbite: "22 rayons de Schwarzschild",
  sources: ["gravity2021"],
},

// --------------------------------------------------------------- accueil
// Trois temps : l'image, la question du niveau, le menu. Court partout —
// un débutant ne lit pas, il écoute et il clique.
accueil: {
  bienvenue: { id:"intro-bienvenue",
    t:`Ce que tu regardes n'est pas une image. C'est un calcul, refait soixante fois par seconde.`,
    sources:["chandrasekhar1983"] },
  niveau: { id:"intro-niveau",
    t:`Avant de t'embarquer : tu en es où, en astronomie ? Je m'adapte, il n'y a pas de mauvaise réponse.` },
},

// Les trois réponses réutilisent les répliques `niveau-*` : un seul jeu de
// textes sert au routage, à l'affichage des fiches et à la voix.
niveauxLibelle: [
  { titre:"Je suis vraiment nul",     detail:"On part de zéro, tranquillement." },
  { titre:"Passionné amateur",        detail:"Tu connais les bases, on creuse." },
  { titre:"Je suis astronome",        detail:"Résultats récents et chiffres bruts." },
],

// ------------------------------------------------------- répliques de Lumen
// `t` : affiché (HTML autorisé).  `dire` : lu à voix haute, si différent.
// `sources` : clés de `sources` ci-dessus, obligatoires dès qu'il y a un fait.
reactions: {
  accueil: { niv:[
    { id:"accueil-0", t:`Bonjour. Je suis <b>Lumen</b>, le système de bord de ce vaisseau.
       <br><br>Autant te le dire tout de suite : je ne suis pas très malin. Je ne sais dire que
       ce qu'on m'a appris, et je ne comprends pas ce que tu écris. Mais ce qu'on m'a appris,
       je le dis bien. Clique sur moi quand tu veux, j'ai des réponses prêtes.`,
      dire:`Bonjour. Je suis Lumen, le système de bord de ce vaisseau. Autant te le dire tout de suite : je ne suis pas très malin. Je ne sais dire que ce qu'on m'a appris, et je ne comprends pas ce que tu écris. Mais ce qu'on m'a appris, je le dis bien. Clique sur moi quand tu veux, j'ai des réponses prêtes.` },

    { id:"accueil-1", t:`<b>Lumen</b>, assistance de bord. Soyons clairs : je ne suis pas une
       intelligence conversationnelle, plutôt un <i>guide sonore un peu perfectionné</i> —
       des réponses écrites à l'avance, choisies selon ce que tu fais.
       <br><br>En échange, tout ce que je dis est vérifié et sourcé. Tu peux me demander
       d'où sort chaque chiffre.` },

    { id:"accueil-2", t:`<b>Lumen</b>, assistance de bord. Ni modèle de langage ni dialogue :
       un corpus fini de répliques, indexées sur l'état de la simulation et le niveau choisi.
       <br><br>Chaque affirmation porte ses références, consultables d'un clic. C'est moins
       impressionnant qu'une conversation, mais c'est <b>vérifiable</b>.` },
  ]},
  pluie: [
    { id:"pluie-0", t:`Quatre-vingts sondes d'un coup. Regarde les couleurs : <i>bleu</i> elles tiennent, <i>rose</i> elles tombent, <i>vert</i> elles s'en vont. Tout se joue sur la vitesse de départ.` },
    { id:"pluie-1", t:`Même endroit, même trou noir — et trois destins différents. La seule chose qui change, c'est de combien elles vont trop vite ou pas assez.` },
  ],
  avalee: [
    { id:"avalee-0", t:`Regarde-la bien : elle ne <b>traverse</b> pas. Vue d'ici, elle ralentit, rougit, et s'éteint sans jamais atteindre le bord. Pour elle, la traversée a déjà eu lieu.`,
      sources:["misner1973"] },
    { id:"avalee-1", t:`Elle n'a pas été « aspirée » : elle est tombée, comme une pierre qui rate son virage. Et de notre point de vue, elle <i>tombe encore</i>. Elle tombera toujours.`,
      sources:["misner1973"] },
    { id:"avalee-2", t:`Voilà pourquoi on disait autrefois « étoile gelée ». De loin, rien ne franchit jamais l'horizon — l'image se fige sur le seuil et s'efface.`,
      sources:["misner1973"] },
  ],
  photon: { id:"photon", t:`Photon lâché sur la crête : trop lent il tombe, trop vite il part. Personne ne reste. <i>Passe en temps réel</i> pour voir à quel point c'est lent.`,
    sources:["chandrasekhar1983"] },
  photonAvale: { id:"photon-avale", t:`Bon. Il a glissé du mauvais côté de la crête.` },
  photonFuite: { id:"photon-fuite", t:`Il s'en sort. Maintenant il file tout droit pendant 27 000 ans avant que quelqu'un le voie.`,
    sources:["gravity2021"] },
  traj: { id:"traj", t:`Voilà l'avenir de tout le monde, déjà tracé. Une orbite ne se décide pas en route : la vitesse de départ contient toute l'histoire.` },
  embarque: { id:"embarque", t:`Te voilà à bord. Attention, à cette vitesse le ciel n'est plus où tu crois : l'<b>aberration</b> le tasse vers l'avant. Ce que tu vois sur les côtés vient en réalité de derrière toi.`,
    dire:`Te voilà à bord. Attention, à cette vitesse le ciel n'est plus où tu crois : l'aberration le tasse vers l'avant. Ce que tu vois sur les côtés vient en réalité de derrière toi.`,
    sources:["misner1973"] },
  salon: { id:"salon",
    t:`Bienvenue dans le salon. Nous sommes en <b>orbite excentrique</b> : le vaisseau
       s'approche, s'éloigne, et le trou noir grossit puis rétrécit derrière la vitre.
       <br><br>Un tour complet dure <i>4 h 44</i> en vrai. On l'accélère pour que ça se voie —
       les écrans te disent de combien.`,
    dire:`Bienvenue dans le salon. Nous sommes en orbite excentrique : le vaisseau s'approche, s'éloigne, et le trou noir grossit puis rétrécit derrière la vitre. Un tour complet dure quatre heures quarante-quatre en vrai. On l'accélère pour que ça se voie. Les écrans te disent de combien.`,
    pourquoi:`L'orbite n'est pas décorative : le vaisseau suit la même géodésique de type
              temps que les sondes, celle que le banc d'essai valide. D'où la précession du
              périastre — l'ellipse tourne lentement sur elle-même, effet purement
              relativiste, visible sur l'écran de position.`,
    sources:["bardeen1972","gravity2020"] },
  jumeauxDepart: { id:"jumeaux-depart",
    t:`Te voilà à bord. Ton jumeau, lui, reste là-haut, très loin.
       <br><br>Regarde les <b>deux horloges</b> en bas de l'écran : elles sont à égalité
       pour l'instant. Descends avec la molette — ou deux doigts — et regarde-les s'écarter.
       <i>La tienne va prendre du retard.</i>`,
    dire:`Te voilà à bord. Ton jumeau, lui, reste là-haut, très loin. Regarde les deux horloges en bas de l'écran : elles sont à égalité pour l'instant. Descends avec la molette, ou deux doigts, et regarde-les s'écarter. La tienne va prendre du retard.`,
    pourquoi:`Ce n'est pas une illusion d'optique ni un artifice du jeu. Sur une orbite
              circulaire en Schwarzschild, le temps propre s'écoule au rythme
              $d\\tau/dt = \\sqrt{1 - 3GM/rc^{2}}$ par rapport à un observateur lointain.
              La dilatation gravitationnelle et celle due à la vitesse s'y combinent.
              <br><br>À la dernière orbite stable, r = 3 r<sub>s</sub>, ce facteur vaut
              exactement $\\sqrt{1/2} \\approx 70{,}7\\,\\%$ — et c'est le <b>plancher</b> :
              impossible de ralentir davantage autour d'un trou noir qui ne tourne pas.`,
    sources:["misner1973","bardeen1972"] },
  reel: { id:"reel", t:`Voilà la vérité, et elle est austère : en lumière visible, le disque est <b>quasiment muet</b>. Sgr A* rayonne dans le submillimétrique. Ce qui le trahirait, ce sont les étoiles tordues derrière lui.`,
    dire:`Voilà la vérité, et elle est austère : en lumière visible, le disque est quasiment muet. Sagittarius A étoile rayonne dans le submillimétrique. Ce qui le trahirait, ce sont les étoiles tordues derrière lui.`,
    sources:["yuan2014","eht2022"] },
  vitesse0: { id:"vitesse-reel", t:`Là tu es en <b>temps réel</b>. Je me déplace de deux centièmes de rayon par seconde. Va faire un café : il me faut <i>11 min 31 s</i> pour un tour.`,
    dire:`Là tu es en temps réel. Je me déplace de deux centièmes de rayon par seconde. Va faire un café : il me faut onze minutes et trente et une secondes pour un tour.`,
    sources:["gravity2021","chandrasekhar1983"] },
  vitesse3: { id:"vitesse-heure", t:`Une heure par seconde. À ce rythme le bord externe du disque boucle son orbite en quelques secondes — alors qu'en vrai il lui faut <i>près de quatre heures</i>.`,
    dire:`Une heure par seconde. À ce rythme, le bord externe du disque boucle son orbite en quelques secondes, alors qu'en vrai il lui faut près de quatre heures.`,
    sources:["gravity2021","bardeen1972"] },
  niveau: { niv:[
    { id:"niveau-0", t:`Je repars des bases, promis, et sans jargon.` },
    { id:"niveau-1", t:`On monte d'un cran.` },
    { id:"niveau-2", t:`Très bien. Je ne t'épargne plus rien.` },
  ]},
  inactif: [
    { id:"inactif-0", t:`Un trou noir n'aspire pas. Si le Soleil en devenait un <i>à masse égale</i>, la Terre garderait exactement la même orbite. Il ferait juste très froid.`,
      sources:["birkhoff1923"] },
    { id:"inactif-1", t:`Plus un trou noir est massif, moins il est dense. Moi je pèse <i>mille fois l'eau</i> — mais M87*, mille fois plus lourd, est <b>moins dense que l'air</b>.`,
      dire:`Plus un trou noir est massif, moins il est dense. Moi je pèse mille fois l'eau. Mais M 87 étoile, mille fois plus lourd, est moins dense que l'air.`,
      pourquoi:`Le rayon croît comme la masse, donc le volume comme son cube : la densité
                moyenne chute comme $1/M^{2}$.
                <br><br>Pour Sgr A*, $\\rho = M/\\tfrac{4}{3}\\pi r_s^{3} \\approx 1{,}0\\times10^{6}$ kg/m³,
                soit <b>mille fois l'eau</b> — le lieu commun qui dit le contraire est faux
                à cette masse-là. Le seuil de l'eau se situe vers $1{,}4\\times10^{8}\\,M_\\odot$.
                M87*, à $6{,}5\\times10^{9}\\,M_\\odot$, tombe à 0,44 kg/m³, sous les 1,2 de l'air.`,
      sources:["gravity2021","schwarzschild1916","eht2019"] },
    { id:"inactif-2", t:`L'ombre que tu regardes fait 52 millionièmes de seconde d'arc dans le ciel. C'est une <i>orange posée sur la Lune</i>.`,
      sources:["eht2022"] },
    { id:"inactif-3", t:`Tu ne verrais jamais personne franchir l'horizon. De loin, il ralentit, rougit, et se fige. Lui, il passe sans rien remarquer.`,
      sources:["misner1973"] },
    { id:"inactif-4", t:`Ce trou noir-là tourne sur lui-même et entraîne l'espace avec lui. Monte le curseur de rotation : l'ombre se décentre, et un bord se rapproche. <i>Fiche 8.</i>`,
      dire:`Ce trou noir-là tourne sur lui-même, et il entraîne l'espace avec lui. Monte le curseur de rotation : l'ombre se décentre, et un bord se rapproche. Va voir la fiche huit.`,
      sources:["eht2022","bardeen1972"] },
    { id:"inactif-10", t:`Avis aux passagers. Nous orbitons, donc nous sommes en chute libre, donc vous devriez tous flotter. <b>Pour des raisons de confort et de scénario, la direction a décrété que la gravité serait magique à bord.</b> C'est le seul mensonge de ce vaisseau. Tout le reste est calculé.`,
      dire:`Avis aux passagers. Nous orbitons, donc nous sommes en chute libre, donc vous devriez tous flotter. Pour des raisons de confort et de scénario, la direction a décrété que la gravité serait magique à bord. C'est le seul mensonge de ce vaisseau. Tout le reste est calculé.`,
      pourquoi:`Rien ne plaque un corps au plancher d'un vaisseau en orbite : l'habitacle et son
                occupant suivent la même géodésique, et l'occupant flotte. C'est pour cette
                raison que l'équipage de la Station spatiale internationale est en apesanteur
                alors que la gravité terrestre y vaut encore <b>88 %</b> de sa valeur au sol —
                à 420 km d'altitude, $(6371/6791)^{2} = 0{,}88$. L'apesanteur n'est pas
                l'absence de gravité, c'est la chute libre.
                Une gravité artificielle par rotation serait physiquement honnête, mais elle
                ferait tourner le paysage dans la baie : l'astre défilerait en boucle et
                deviendrait illisible. Il a donc fallu choisir entre un vaisseau exact et un
                trou noir observable. On a choisi le trou noir.`,
      sources:["misner1973"] },
    { id:"inactif-5", t:`Le disque brille parce que le gaz frotte contre lui-même en tombant. Rien ne brûle là-dedans — c'est la chute qui fait la lumière.`,
      sources:["shakura1973","balbus1991"] },
    { id:"inactif-6", t:`Un vaisseau qui tiendrait <i>1 g</i> tout le trajet — la moitié en accélérant, la moitié en freinant — arriverait ici en <b>19,8 ans</b> de vie à bord. Sur Terre il se serait écoulé 26 675 ans. Personne ne t'attendrait.`,
      dire:`Un vaisseau qui tiendrait un g tout le trajet, la moitié en accélérant, la moitié en freinant, arriverait ici en dix-neuf ans et dix mois de vie à bord. Sur Terre, il se serait écoulé vingt-six mille six cent soixante-quinze ans. Personne ne t'attendrait.`,
      pourquoi:`Fusée relativiste à accélération propre constante. Le temps vécu à bord vaut
                $\\tau = \\tfrac{2c}{g}\\,\\operatorname{arccosh}\\!\\left(\\tfrac{gd}{2c^{2}}+1\\right)$ —
                il croît comme le <b>logarithme</b> de la distance, alors que le temps
                terrestre croît proportionnellement. C'est toute l'affaire.
                <br><br>Pour d = 26 673 al : <b>19,8 ans</b> à bord contre 26 675 sur Terre,
                avec γ = 13 768 au demi-tour. Rien d'exotique, c'est de la relativité
                restreinte de 1905. En revanche le carburant, lui, est hors d'atteinte —
                demande-moi.`,
      sources:["gravity2021","misner1973"] },
    { id:"inactif-7", t:`Avec la même poussée d'<i>1 g</i>, Andromède est à <b>28,6 ans</b> de vie. Deux millions et demi d'années-lumière. La distance ne compte presque plus, parce que ton temps se contracte avec elle — reste le carburant, et là c'est sans espoir.`,
      dire:`Avec la même poussée d'un g, Andromède est à vingt-huit ans et demi de vie. Deux millions et demi d'années-lumière. La distance ne compte presque plus, parce que ton temps se contracte avec elle. Reste le carburant, et là, c'est sans espoir.`,
      pourquoi:`Même formule que pour le centre galactique. Cent fois plus loin ne coûte que
                neuf années de vie de plus, parce que le temps à bord croît comme le
                logarithme de la distance.
                <br><br>Une limite qu'on oublie souvent : l'expansion de l'univers. Au-delà
                d'environ <b>16 milliards d'années-lumière comobiles</b>, l'espace s'étire
                plus vite qu'on ne le franchit — ces galaxies-là sont hors d'atteinte pour
                toujours, quelle que soit l'accélération. Soit 4,5 % du volume observable.`,
      sources:["misner1973"] },
    { id:"inactif-8", t:`Le carburant, justement. Même une fusée <b>à photons parfaite</b> — toute sa masse changée en lumière — devrait en annihiler <i>758 000 tonnes</i> pour qu'un seul kilo arrive ici. Avec de la fusion, le rapport dépasse la masse de l'univers observable.`,
      dire:`Le carburant, justement. Même une fusée à photons parfaite, toute sa masse changée en lumière, devrait en annihiler sept cent cinquante-huit mille tonnes pour qu'un seul kilo arrive ici. Avec de la fusion, le rapport dépasse la masse de l'univers observable.`,
      pourquoi:`Équation de la fusée relativiste : le rapport de masses vaut
                $e^{\\Delta\\eta/(v_e/c)}$, où $\\eta = \\operatorname{arccosh}\\gamma$ est la
                rapidité. Accélérer puis freiner jusqu'au centre galactique en accumule
                <b>20,45</b>.
                <br><br>Avec une fusée à photons — le meilleur concevable, 100 % de la masse
                convertie — cela donne $e^{20{,}45} = 7{,}6\\times10^{8}$ : 758 000 tonnes
                annihilées par kilo arrivé. Avec de la fusion deutérium-hélium 3
                ($v_e \\approx 0{,}12c$), le rapport atteint $10^{75}$.`,
      sources:["misner1973","dyson1968"] },
    { id:"inactif-9", t:`D'où l'idée de <b>Bussard</b>, en 1960 : ne pas emporter son carburant, mais le ramasser en route avec un immense filet magnétique. Élégant. Sauf qu'on a montré depuis que ce filet <i>freine plus qu'il ne pousse</i>.`,
      dire:`D'où l'idée de Bussard, en 1960 : ne pas emporter son carburant, mais le ramasser en route avec un immense filet magnétique. Élégant. Sauf qu'on a montré depuis que ce filet freine plus qu'il ne pousse.`,
      sources:["bussard1960","zubrin1989"] },
  ],
},

// ---------------------------------------------------------- expériences
// L'écran d'accueil. On choisit ce qu'on veut vivre, on lit d'abord ce qui va
// se passer, et l'expérience règle elle-même la vitesse, la caméra et les
// affichages. Personne ne devrait avoir à chercher un paramètre.
experiences: [
{
  id: "libre",
  titre: "Découvrir le trou noir",
  duree: "à ton rythme",
  resume: "Lance des sondes et vois lesquelles tiennent.",
  quoi: `Sept missions, une seule chose à comprendre par mission.
         Tu n'as besoin de rien savoir d'avance.`,
},
{
  id: "jumeaux",
  titre: "L'expérience des jumeaux",
  duree: "3 minutes",
  resume: "Ton temps va ralentir. Pas le sien.",
  quoi: `Tu descends tout près, un vaisseau reste au loin. Vos deux horloges
         s'écartent, et l'écart ne se rattrape jamais.
         C'est <i>Interstellar</i>, avec les vrais chiffres.`,
},
{
  id: "reelle",
  titre: "Le voir en vraie lumière",
  duree: "1 minute",
  resume: "Coupe les couleurs. Retrouve-le.",
  quoi: `Le beau disque orange, un œil humain ne le verrait pas.
         Il ne reste que les étoiles tordues autour du vide. À toi de le trouver.`,
},
{
  id: "exact",
  titre: "Comment on sait que c'est vrai",
  duree: "à lire",
  resume: "Le site vérifie son propre calcul devant toi.",
  quoi: `Rien n'a été dessiné. On explique la méthode, on dit ce qui est
         approximé, et un banc d'essai contrôle le moteur en direct.`,
},
],

// ------------------------------------------------------------- missions
// Une mission = un geste, et une seule chose comprise à la fin. Pas de points,
// pas de badges : la récompense est que quelque chose se passe à l'écran et
// qu'on sache pourquoi. C'est la porte d'entrée pour qui ne connaît rien.
// La vérification vit dans index.html, indexée par `id`.
missions: [
{
  id: "m-chute",
  titre: "Fais tomber quelque chose",
  consigne: "Pose ton doigt sur le disque orange et tire <b>tout doucement</b>, puis lâche.",
  reussi: { id:"m-chute-ok",
    t:`Regarde-la bien : elle ne traverse pas. Vue d'ici elle ralentit, rougit, et s'éteint sur le bord. <b>Rien ne franchit jamais l'horizon</b>, pour nous qui regardons de loin.`,
    dire:`Regarde-la bien : elle ne traverse pas. Vue d'ici, elle ralentit, rougit, et s'éteint sur le bord. Rien ne franchit jamais l'horizon, pour nous qui regardons de loin.`,
    sources:["misner1973"] },
},
{
  id: "m-orbite",
  titre: "Maintenant, mets-en une en orbite",
  consigne: "Recommence, mais tire <b>plus fort</b>. Le trait devient vert quand la vitesse est bonne.",
  reussi: { id:"m-orbite-ok",
    t:`Voilà. Ce qui décide de tout, ce n'est pas la distance — c'est la <b>vitesse</b>. Trop lent on tombe, trop vite on s'en va. Une orbite, c'est une chute qui rate sa cible pour toujours.`,
    dire:`Voilà. Ce qui décide de tout, ce n'est pas la distance, c'est la vitesse. Trop lent on tombe, trop vite on s'en va. Une orbite, c'est une chute qui rate sa cible pour toujours.`,
    sources:["bardeen1972"] },
},
{
  id: "m-pluie",
  titre: "Lâche-en quatre-vingts d'un coup",
  consigne: "Le bouton <b>Lâcher 80 sondes</b>, en bas. Puis regarde les couleurs.",
  reussi: { id:"m-pluie-ok",
    t:`Trois destins, une seule différence : la vitesse de départ. <i>Bleu</i> elles tiennent, <i>rose</i> elles tombent, <i>vert</i> elles s'échappent. Appuie sur <b>Trajectoires</b> pour voir leur avenir déjà tracé.`,
    dire:`Trois destins, une seule différence : la vitesse de départ. Bleu elles tiennent, rose elles tombent, vert elles s'échappent. Appuie sur Trajectoires pour voir leur avenir, déjà tracé.`,
    sources:["bardeen1972"] },
},
{
  id: "m-limite",
  titre: "Trouve la limite",
  consigne: "Essaie de mettre une sonde en orbite <b>très près</b>, à l'intérieur du cercle en pointillés.",
  reussi: { id:"m-limite-ok",
    t:`Tu n'y arriveras pas, et ce n'est pas un défaut du jeu. Sous cette limite, <b>aucune orbite ne tient</b>, quelle que soit ta vitesse. Autour d'une étoile ça n'existe pas. Autour d'un trou noir, si.`,
    dire:`Tu n'y arriveras pas, et ce n'est pas un défaut du jeu. Sous cette limite, aucune orbite ne tient, quelle que soit ta vitesse. Autour d'une étoile, ça n'existe pas. Autour d'un trou noir, si.`,
    sources:["bardeen1972"] },
},
{
  id: "m-photon",
  titre: "Lance un rayon de lumière",
  consigne: "Bouton <b>Photon</b>. Puis passe la vitesse du temps sur <b>temps réel</b>, dans le rouage.",
  reussi: { id:"m-photon-ok",
    t:`Prends ton temps, il en a pour <b>onze minutes et demie</b> — un seul tour. La lumière est ce qu'il y a de plus rapide dans l'univers, et ici elle a l'air lente. C'est que ce truc est <i>énorme</i>.`,
    dire:`Prends ton temps, il en a pour onze minutes et demie. Un seul tour. La lumière est ce qu'il y a de plus rapide dans l'univers, et ici elle a l'air lente. C'est que ce truc est énorme.`,
    sources:["gravity2021","chandrasekhar1983"] },
},
{
  id: "m-reel",
  titre: "Éteins la lumière",
  consigne: "Appuie sur <b>Lumière réelle</b>, en bas. Et cherche le trou noir. Le même bouton rallumera les couleurs.",
  reussi: { id:"m-reel-ok",
    t:`Il est toujours là. Le beau disque orange, en vrai, tu ne le verrais <b>pas</b> : il brille dans des ondes que l'œil ne capte pas. Ce qui le trahit, ce sont les étoiles <i>tordues</i> autour de lui. C'est comme ça qu'on les cherche vraiment.`,
    dire:`Il est toujours là. Le beau disque orange, en vrai, tu ne le verrais pas : il brille dans des ondes que l'œil ne capte pas. Ce qui le trahit, ce sont les étoiles tordues autour de lui. C'est comme ça qu'on les cherche, vraiment.`,
    sources:["yuan2014","eht2022"] },
},
{
  id: "m-bord",
  titre: "Monte à bord",
  consigne: "Bouton <b>Monter à bord</b>. Tu prends la place de la sonde.",
  reussi: { id:"m-bord-ok",
    t:`Regarde le cadran « temps qui passe ». Il est <b>en dessous de 100 %</b> : ici, ton temps s'écoule plus lentement qu'ailleurs. Ce n'est pas une impression. Tu vieillis moins vite que quelqu'un resté loin.`,
    dire:`Regarde le cadran « temps qui passe ». Il est en dessous de cent pour cent : ici, ton temps s'écoule plus lentement qu'ailleurs. Ce n'est pas une impression. Tu vieillis moins vite que quelqu'un resté loin.`,
    sources:["misner1973","gravity2018"] },
},
{
  id: "m-jumeaux",
  titre: "Le voyage des jumeaux",
  consigne: "Reste à bord et <b>descends au plus près</b> : molette, ou deux doigts. Le vaisseau-mère t'attend au loin, et vos deux horloges vont diverger.",
  reussi: { id:"m-jumeaux-ok",
    t:`Une demi-heure d'écart, et elle ne sera jamais rattrapée. Ton jumeau resté au loin a <b>vieilli plus que toi</b> — c'est bien lui qui a perdu du temps, pas toi. Mais regarde le compteur : au mieux ton temps tombe à <i>70,7 %</i>. Impossible de faire mieux ici, parce que ce trou noir <b>ne tourne pas</b>. Les 61 000 ans par heure d'<i>Interstellar</i> exigent un trou noir en rotation, qui entraîne l'espace et permet de tenir bien plus près.`,
    dire:`Une demi-heure d'écart, et elle ne sera jamais rattrapée. Ton jumeau resté au loin a vieilli plus que toi. C'est bien lui qui a perdu du temps, pas toi. Mais regarde le compteur : au mieux, ton temps tombe à soixante-dix virgule sept pour cent. Impossible de faire mieux ici, parce que ce trou noir ne tourne pas. Les soixante et un mille ans par heure d'Interstellar exigent un trou noir en rotation, qui entraîne l'espace et permet de tenir bien plus près.`,
    sources:["misner1973","bardeen1972","gravity2018"] },
},
],

questions: [
{ q:"C'est quoi un trou noir, exactement ?", niv:[
  { id:"q1-0", t:`De la matière tellement tassée que plus rien ne peut s'en échapper, <b>même pas la lumière</b>. Ce n'est ni un trou ni un aspirateur : juste un endroit d'où on ne revient pas.`,
    sources:["schwarzschild1916"] },
  { id:"q1-1", t:`Une région où la vitesse nécessaire pour s'échapper dépasse celle de la lumière. Comme rien ne va plus vite, rien ne sort. Ce n'est pas un objet solide : c'est une <b>région de l'espace-temps</b> délimitée par un horizon.`,
    sources:["schwarzschild1916"] },
  { id:"q1-2", t:`Une solution du vide des équations d'Einstein possédant un horizon des événements — la frontière du passé causal de l'infini nul futur. Les théorèmes de singularité de <b>Penrose-Hawking</b> garantissent qu'un effondrement suffisant en produit une ; la censure cosmique, elle, reste conjecturale.`,
    sources:["penrose1965","schwarzschild1916"] },
]},
{ q:"Qu'est-ce qui se passe si je tombe dedans ?", niv:[
  { id:"q2-0", t:`Sur celui-ci, tu franchirais la limite <b>sans rien sentir</b>. Ensuite, plus aucune direction ne te ramène en arrière : tomber devient aussi inévitable que le passage du temps. Et plus bas, tu serais étiré comme un spaghetti.`,
    sources:["misner1973"] },
  { id:"q2-1", t:`Sur Sgr A*, l'étirement à l'horizon ne dépasse pas <i>un dix-millième de g</i> sur la taille d'un corps : tu passes sans le remarquer. À l'intérieur, la distance au centre cesse d'être une direction d'espace pour devenir une <b>direction de temps</b> — le fond n'est plus un lieu, c'est un futur.`,
    dire:`Sur Sagittarius A étoile, l'étirement à l'horizon ne dépasse pas un dix-millième de g sur la taille d'un corps : tu passes sans le remarquer. À l'intérieur, la distance au centre cesse d'être une direction d'espace pour devenir une direction de temps. Le fond n'est plus un lieu, c'est un futur.`,
    sources:["misner1973","gravity2021"] },
  { id:"q2-2", t:`Traversée régulière en Eddington-Finkelstein. En intérieur de Schwarzschild r devient de type temps : atteindre r = 0 est inévitable et le temps propre restant est majoré par <i>πGM/c³ ≈ 60 s</i> ici. Les marées divergent en M/r³, donc négligeables à l'horizon d'un supermassif. La question ouverte est quantique : firewall, ou strictement rien.`,
    dire:`Traversée régulière en Eddington-Finkelstein. En intérieur de Schwarzschild, r devient de type temps : atteindre r égale zéro est inévitable, et le temps propre restant est majoré par pi G M sur c cube, environ soixante secondes ici. Les marées divergent en M sur r cube, donc négligeables à l'horizon d'un supermassif. La question ouverte est quantique : firewall, ou strictement rien.`,
    sources:["misner1973","amps2013"] },
]},
{ q:"Pourquoi c'est noir au milieu ?", niv:[
  { id:"q3-0", t:`Parce qu'aucune lumière venant de là ne peut t'atteindre. Ce n'est pas un objet noir, c'est une <b>absence</b>. Et ce rond est plus grand que le trou noir lui-même : la lumière qui passe trop près est happée au passage.`,
    sources:["bardeen1973"] },
  { id:"q3-1", t:`C'est l'ombre. Tout rayon dont la trajectoire, remontée à l'envers, finit sous l'horizon te donne du noir. Le seuil tombe à <i>2,6 rayons d'horizon</i> — bien plus large que l'horizon, parce que frôler suffit à être capturé.`,
    dire:`C'est l'ombre. Tout rayon dont la trajectoire, remontée à l'envers, finit sous l'horizon te donne du noir. Le seuil tombe à deux virgule six rayons d'horizon, bien plus large que l'horizon, parce que frôler suffit à être capturé.`,
    sources:["bardeen1973"] },
  { id:"q3-2", t:`Section efficace de capture : paramètre d'impact critique b_c = √27 GM/c², d'où un rayon apparent de <i>2,598 r<sub>s</sub></i>. Le bord est en fait un anneau empilant les images d'ordre n, espacées d'un facteur e<sup>−π</sup> en flux. C'est cette structure que l'EHT vise.`,
    dire:`Section efficace de capture : le paramètre d'impact critique vaut racine de vingt-sept G M sur c carré, d'où un rayon apparent de deux virgule cinq cent quatre-vingt-dix-huit rayons de Schwarzschild. Le bord est en fait un anneau empilant les images d'ordre n, espacées d'un facteur e puissance moins pi en flux. C'est cette structure que l'E H T vise.`,
    sources:["bardeen1973","gralla2019","eht2022"] },
]},
{ q:"Comment on pèse un truc invisible ?", niv:[
  { id:"q4-0", t:`On regarde ce qui tourne autour. Une étoile appelée <b>S2</b> en fait le tour en 16 ans ; sa vitesse et la taille de son orbite donnent la masse — exactement comme on pèse le Soleil en regardant la Terre tourner.`,
    sources:["gravity2021"] },
  { id:"q4-1", t:`Troisième loi de Kepler. S2 boucle son orbite en <i>16,05 ans</i>, passe au plus près à 120 unités astronomiques et y file à 7 650 km/s. Demi-grand axe et période suffisent : 4,3 millions de masses solaires, dans un volume trop petit pour un amas d'étoiles.`,
    dire:`Troisième loi de Kepler. S 2 boucle son orbite en seize ans, passe au plus près à cent vingt unités astronomiques, et y file à sept mille six cent cinquante kilomètres par seconde. Demi-grand axe et période suffisent : quatre virgule trois millions de masses solaires, dans un volume trop petit pour un amas d'étoiles.`,
    sources:["gravity2021","gravity2018"] },
  { id:"q4-2", t:`Astrométrie et spectroscopie infrarouge de l'amas S sur trois décennies (Keck, VLT/GRAVITY). Au-delà de Kepler, S2 fournit du post-newtonien testable : redshift gravitationnel détecté au périastre 2018, <b>précession de Schwarzschild</b> de 12,1′/orbite confirmée en 2020. Nobel de physique 2020 à Genzel et Ghez.`,
    dire:`Astrométrie et spectroscopie infrarouge de l'amas S sur trois décennies, au Keck et au V L T. Au-delà de Kepler, S 2 fournit du post-newtonien testable : redshift gravitationnel détecté au périastre en 2018, précession de Schwarzschild de douze minutes d'arc par orbite confirmée en 2020. Nobel de physique 2020 à Genzel et Ghez.`,
    sources:["gravity2021","gravity2018","gravity2020","nobel2020"] },
]},
{ q:"Est-ce que ça peut aspirer la Terre ?", niv:[
  { id:"q5-0", t:`Non. Un trou noir n'attire pas plus qu'une étoile de la même masse. Si le Soleil en devenait un tout de suite, la Terre garderait <b>exactement</b> la même orbite — il ferait juste nuit et très froid. Et celui-ci est à 27 000 années-lumière.`,
    sources:["birkhoff1923","gravity2021"] },
  { id:"q5-1", t:`Non : la gravité ne dépend que de la masse et de la distance, pas de la compacité. À 150 millions de km, le champ d'un trou noir d'une masse solaire est identique à celui du Soleil. Il faut s'approcher à quelques rayons d'horizon pour que quoi que ce soit change.`,
    sources:["birkhoff1923"] },
  { id:"q5-2", t:`Le <b>théorème de Birkhoff</b> garantit qu'à l'extérieur d'une distribution sphérique la métrique ne dépend que de M : un effondrement à symétrie sphérique ne touche pas aux orbites externes. Les écarts relativistes n'émergent que pour r de l'ordre de quelques r<sub>s</sub>. Sgr A* est à 8,3 kpc.`,
    dire:`Le théorème de Birkhoff garantit qu'à l'extérieur d'une distribution sphérique, la métrique ne dépend que de la masse : un effondrement à symétrie sphérique ne touche pas aux orbites externes. Les écarts relativistes n'émergent que pour r de l'ordre de quelques rayons de Schwarzschild. Sagittarius A étoile est à huit virgule trois kiloparsecs.`,
    sources:["birkhoff1923","gravity2021"] },
]},
{ q:"Ce que je vois, c'est vraiment ça ?", niv:[
  { id:"q6-0", t:`La <b>forme</b>, oui : elle est calculée avec les vraies équations, personne ne l'a dessinée. Les couleurs, non. Le vrai Sgr A* est très pâle et ne s'observe qu'en ondes radio. Ce serait l'image qu'on aurait avec des yeux beaucoup plus sensibles.`,
    dire:`La forme, oui : elle est calculée avec les vraies équations, personne ne l'a dessinée. Les couleurs, non. Le vrai Sagittarius A étoile est très pâle et ne s'observe qu'en ondes radio. Ce serait l'image qu'on aurait avec des yeux beaucoup plus sensibles.`,
    sources:["eht2022","yuan2014"] },
  { id:"q6-1", t:`La géométrie est exacte : anneau, ombre, disque replié par-dessus, tout sort de l'intégration des trajectoires de la lumière. En revanche le disque est une <b>invention plausible</b>, pas une observation — Sgr A* accrète très peu, et son image EHT est un anneau flou en ondes radio, pas ce spectacle.`,
    dire:`La géométrie est exacte : anneau, ombre, disque replié par-dessus, tout sort de l'intégration des trajectoires de la lumière. En revanche le disque est une invention plausible, pas une observation. Sagittarius A étoile accrète très peu, et son image de l'E H T est un anneau flou en ondes radio, pas ce spectacle.`,
    sources:["eht2022","yuan2014","luminet1979"] },
  { id:"q6-2", t:`Optique gravitationnelle exacte, astrophysique décorative. Manquent : le spin (Kerr, frame-dragging, ergosphère, ISCO déplacée), le transfert radiatif en plasma optiquement mince, la géométrie épaisse d'un RIAF, la variabilité. Un vrai rendu part d'un post-traitement GRMHD ; ici l'émissivité est posée à la main. <i>Fiche 8.</i>`,
    dire:`Optique gravitationnelle exacte, astrophysique décorative. Manquent : le spin, donc pas de Kerr, pas de frame-dragging, pas d'ergosphère, et une ISCO non déplacée ; le transfert radiatif en plasma optiquement mince ; la géométrie épaisse d'un RIAF ; et la variabilité. Un vrai rendu part d'un post-traitement G R M H D. Ici, l'émissivité est posée à la main.`,
    sources:["bardeen1972","yuan2014","eht2022"] },
]},
],

// ---------------------------------------------------------------- fiches
// Les huit fiches, trois niveaux chacune. Elles vivaient en dur dans
// index.html, sans clé de source — et l'audit y a trouvé neuf erreurs sur dix.
// Elles sont ici pour être relues comme le reste.
fiches: [
{
  id: "f-sgra",
  titre: "Sagittarius A*",
  sources: [
    ["gravity2021", "eht2022"],
    ["gravity2021", "gravity2018", "nobel2020"],
    ["gravity2021", "gravity2020", "eht2022", "yuan2014"],
  ],
  t: [
   `Au milieu de notre galaxie, il y a un trou noir. Il pèse <i>4 millions de fois le Soleil</i>.
    <br><br>Personne ne l'a jamais vu à l'œil nu. On a su qu'il était là parce que des
    astronomes ont regardé le même petit coin de ciel <b>pendant trente ans</b>, nuit après
    nuit — et qu'ils ont fini par voir des étoiles tourner autour de <i>rien</i>.
    Un vide qui les faisait tourner.
    <br><br>Il a fallu attendre 2022 pour en obtenir une image. Prends une seconde :
    on a photographié une chose dont aucune lumière ne sort.`,

   `Sagittarius A* fait 4,3 millions de masses solaires tassées dans une bille de
    <i>12,7 millions de km</i> — ça tiendrait à l'intérieur de l'orbite de Mercure.
    Sa masse a été mesurée en suivant pendant trente ans l'étoile S2, qui en fait le tour
    en 16 ans à 3 % de la vitesse de la lumière. Ce travail a valu le
    <b>prix Nobel de physique 2020</b>.`,

   `M = 4,297 ± 0,013 × 10⁶ M☉ à R₀ = 8 277 ± 31 pc (GRAVITY, 2021), par astrométrie
    infrarouge de S2 — dont la <b>précession de Schwarzschild</b> de 12′ par orbite est
    mesurée. Image EHT de mai 2022 : anneau de <i>51,8 ± 2,3 μas</i>, compatible avec une
    inclinaison faible, spin mal contraint. Accrétion en régime RIAF à ~10⁻⁹ L_Edd :
    c'est un des trous noirs supermassifs les plus sous-lumineux connus.`,
  ]
},
{
  id: "f-horizon",
  titre: "L'horizon des événements",
  sources: [
    ["misner1973"],
    ["schwarzschild1916", "misner1973"],
    ["schwarzschild1916", "misner1973", "amps2013", "penington2020"],
  ],
  t: [
   `L'horizon n'est pas un mur. Il n'y a rien à toucher, rien à voir, aucune paroi.
    C'est simplement l'endroit à partir duquel il faudrait aller plus vite que la lumière
    pour revenir — et rien ni personne ne va plus vite que la lumière.
    <br><br>Le plus troublant : en le franchissant, <b>tu ne sentirais rien du tout</b>.
    Pas de choc, pas de bruit, pas de frontière. Tu passerais, c'est tout.
    Et à cet instant précis, <i>tous</i> les chemins devant toi mèneraient au même endroit.`,

   `Son rayon vaut r<sub>s</sub> = 2GM/c², soit <i>12,7 millions de km</i> ici. Ce n'est pas
    un endroit où la matière s'écrase : la courbure y est parfaitement finie. Sur un trou noir
    aussi massif, l'étirement à l'horizon ne dépasse pas <b>un dix-millième de g</b> sur la
    taille d'un corps humain. Tu le franchirais sans t'en apercevoir. Après, c'est autre chose.`,

   `Surface nulle, pas singularité : l'invariant de Kretschmann K = 48G²M²/c⁴r⁶ reste fini
    en r<sub>s</sub>. La dégénérescence de la métrique de Schwarzschild y est un artefact de
    coordonnées, levé en Eddington-Finkelstein ou Kruskal-Szekeres. Les questions ouvertes
    portent moins sur l'horizon lui-même que sur son contenu quantique :
    <b>firewalls</b> (AMPS 2012), complémentarité, et depuis 2019 les courbes de Page
    reconstruites par surfaces quantiques extrémales — l'information ressortirait,
    sans mécanisme local identifié.`,
  ]
},
{
  id: "f-lentille",
  titre: "Pourquoi la lumière tourne",
  sources: [
    ["chandrasekhar1983"],
    ["luminet1979", "chandrasekhar1983"],
    ["chandrasekhar1983", "dyson1920"],
  ],
  t: [
   `La lumière va toujours tout droit. Toujours. Ce qui change, c'est <b>le sens de
    « tout droit »</b>.
    <br><br>Pose une bille lourde sur un drap tendu : le drap se creuse. Une bille légère
    qui passe à côté suit ce creux. Elle n'est pas tirée — elle va tout droit, dans quelque
    chose qui n'est plus plat. L'espace fait pareil autour d'une masse.
    <br><br>Einstein a compris ça en 1915, <i>avec un crayon</i>. Il a fallu attendre quatre
    ans pour aller le vérifier dans le ciel.`,

   `C'est la <b>lentille gravitationnelle</b>. Regarde juste au-dessus du disque noir :
    tu vois la face <i>inférieure</i> du disque, celle qui est derrière et en dessous.
    Sa lumière part vers le bas, contourne le trou noir par l'arrière, et redescend vers toi.
    Tu vois littéralement le dos de l'objet par-dessus sa tête.`,

   `Géodésiques nulles de Schwarzschild. L'équation orbitale se réduit à
    $d^{2}u/d\varphi^{2} + u = 3GMu^{2}/c^{2}$ avec u = 1/r ; le membre de droite est le terme purement
    relativiste, celui qui <b>double</b> la déflexion newtonienne. 1,75″ au limbe solaire est
    la <i>prédiction</i> : les mesures de 1919 donnèrent 1,98″ ± 0,12 à Sobral et
    1,61″ ± 0,30 à Príncipe — là où se trouvait Eddington, et c'est le résultat le moins précis
    des deux. Aujourd'hui γ est contraint à 1,2 × 10⁻⁴ par VLBI, et à 2 × 10⁻⁵ par le retard
    Shapiro de Cassini. C'est cette équation-là qui est intégrée à l'écran, pas une approximation.`,
  ]
},
{
  id: "f-anneau",
  titre: "L'anneau de photons et l'ombre",
  sources: [
    ["bardeen1973"],
    ["bardeen1973", "chandrasekhar1983"],
    ["bardeen1973", "gralla2019", "eht2022"],
  ],
  t: [
   `Approche-toi assez près, et la lumière se met carrément <b>en orbite</b>. Elle tourne
    en rond, parfois plusieurs fois, avant de repartir. Un rayon de lumière qui fait le tour
    d'un objet : c'est déjà difficile à se représenter.
    <br><br>Et le rond noir que tu vois n'est pas le trou noir — c'est son <b>ombre</b>,
    et elle est <i>deux fois et demie plus grande</i> que lui. Toute la lumière qui frôle
    de trop près est happée au passage.
    <br><br>Ce que tu regardes, c'est un trou dans le ciel.`,

   `La sphère des photons est à 1,5 fois le rayon de l'horizon. L'orbite y est
    <b>instable</b> : le moindre écart, et le photon s'échappe ou tombe — comme une bille
    en équilibre sur une crête. L'ombre, elle, fait 2,6 rayons d'horizon : c'est cet écart
    qui explique qu'on voie un disque noir bien plus large que l'objet.
    <i>Lance un photon</i> pour le voir tenir sur la crête.`,

   `Sphère des photons à r = 3GM/c², ombre de rayon apparent √27 GM/c² ≈ 2,598 r<sub>s</sub>,
    soit ~52 μas pour Sgr A* — d'où l'interférométrie à l'échelle du globe. Les sous-anneaux
    n ≥ 1, portant la lumière ayant bouclé un demi-tour de plus, sont espacés d'un facteur
    $e^{-\pi} \approx 0{,}043$ en flux et sont quasi insensibles à l'astrophysique du disque.
    C'est la cible de l'<b>EHT spatial</b> (BHEX) : l'anneau n = 1 deviendrait une mesure
    directe de la métrique.`,
  ]
},
{
  id: "f-disque",
  titre: "Pourquoi ça brille",
  sources: [
    ["shakura1973"],
    ["shakura1973", "bardeen1972"],
    ["shakura1973", "balbus1991", "bardeen1972", "yuan2014"],
  ],
  t: [
   `Rien ne brûle là-dedans. Pas de feu, pas de combustion, rien.
    <br><br>Le gaz qui tourne autour frotte contre lui-même, et ce frottement le chauffe.
    Frotte-toi les mains très fort : tu sens la chaleur. C'est exactement le même principe,
    des millions de fois plus violent — jusqu'à <i>des millions de degrés</i>.
    <br><br><b>C'est la chute qui fabrique la lumière.</b> Et pour transformer de la matière
    en lumière, un trou noir est la machine la plus efficace de tout l'univers.
    Bien meilleure qu'une étoile.`,

   `Les couches proches tournent plus vite que les couches éloignées, et ce cisaillement
    dissipe l'énergie de chute en chaleur. Le rendement est énorme : jusqu'à <i>6 %</i> de
    l'énergie de masse convertie en lumière, contre 0,7 % pour la fusion nucléaire au cœur
    d'une étoile. <b>Un trou noir est la machine la plus efficace de l'univers</b> pour
    transformer de la matière en rayonnement.`,

   `Disque mince Shakura-Sunyaev (1973), viscosité α portée par la MRI (Balbus-Hawley 1991).
    Rendement 5,7 % en Schwarzschild, jusqu'à 42 % en Kerr extrême prograde.
    Sgr A* n'est pas dans ce régime : à Ṁ ~ 10⁻⁸ M☉/an il est en <b>RIAF/ADAF</b>,
    optiquement mince, refroidissement inefficace, l'essentiel de l'énergie étant advecté
    au lieu d'être rayonné. Les GRMHD (KHARMA, BHAC) reproduisent l'anneau EHT mais
    butent encore sur la variabilité intra-journalière.`,
  ]
},
{
  id: "f-doppler",
  titre: "Un côté plus brillant",
  sources: [
    ["luminet1979"],
    ["luminet1979", "eht2019"],
    ["eht2019", "luminet1979", "bardeen1972"],
  ],
  t: [
   `Regarde bien le disque : <b>un côté brille beaucoup plus fort que l'autre</b>.
    Ce n'est pas un défaut d'image.
    <br><br>Le gaz tourne à une bonne fraction de la vitesse de la lumière. Et à ces
    vitesses-là, ce qui vient vers toi paraît plus lumineux, ce qui s'éloigne s'assombrit.
    <br><br>C'est un peu comme la sirène d'une ambulance, plus aiguë quand elle approche.
    Sauf qu'ici c'est la <i>lumière</i>, et que le contraste dépasse un facteur dix.`,

   `C'est le <b>beaming relativiste</b>. Dans la partie interne, le gaz file à 30-40 %
    de la vitesse de la lumière. Le côté qui approche voit son éclat multiplié par dix
    et sa couleur décalée vers le bleu ; l'autre s'éteint et rougit.
    Cette asymétrie est une <i>mesure directe du sens de rotation</i> du disque.`,

   `Facteur Doppler D = 1/(γ(1 − β·n̂)), intensité observée en D³ pour une source
    monochromatique, D⁴ en bolométrique intégrée. β ≈ 0,4 à l'ISCO de Schwarzschild.
    C'est sur cette asymétrie que l'EHT a conclu au sens horaire de rotation de M87*
    et à un jet aligné sur le spin. S'y superpose le <b>redshift gravitationnel</b>
    √(1 − r<sub>s</sub>/r), qui lui ne dépend que du rayon d'émission.`,
  ]
},
{
  id: "f-isco",
  titre: "La dernière orbite stable",
  sources: [
    ["bardeen1972"],
    ["bardeen1972"],
    ["bardeen1972", "chandrasekhar1983"],
  ],
  t: [
   `Autour de la Terre, on peut mettre un satellite aussi bas qu'on veut, tant qu'il évite
    l'atmosphère. Il suffit d'aller à la bonne vitesse.
    <br><br>Autour d'un trou noir, non. Il existe une distance en dessous de laquelle
    <b>plus aucune orbite ne tient</b>. On tombe, quoi qu'on fasse, quelle que soit sa
    vitesse, quelle que soit sa puissance. Le cercle en pointillés marque cette frontière.
    <br><br>Cette règle n'existe nulle part ailleurs. Elle n'apparaît qu'ici.`,

   `C'est l'<b>ISCO</b>, la dernière orbite circulaire stable, à 3 fois le rayon de l'horizon.
    En gravité newtonienne, il y a toujours un équilibre possible : trop vite on s'éloigne,
    trop lentement on se rapproche. En relativité, sous l'ISCO, cet équilibre disparaît —
    <i>le puits n'a plus de fond</i>. C'est là que s'arrête le disque d'accrétion.`,

   `r<sub>ISCO</sub> = 6GM/c² pour a = 0 ; elle descend à GM/c² en Kerr extrême prograde et
    monte à 9GM/c² en rétrograde. Elle sort du potentiel effectif
    $V = -\dfrac{GM}{r} + \dfrac{L^{2}}{2r^{2}} - \dfrac{GML^{2}}{c^{2}r^{3}}$ : le terme en r⁻³ supprime le minimum en deçà.
    Sa position fixe le rendement radiatif, et c'est en ajustant le bord interne du disque
    que la <b>méthode du continuum</b> contraint le spin — principale alternative à
    l'élargissement de la raie Kα du fer à 6,4 keV.`,
  ]
},
{
  id: "f-rotation",
  titre: "Quand le trou noir tourne",
  sources: [
    ["lense1918", "bardeen1972"],
    ["lense1918", "bardeen1972", "blandford1977"],
    ["kerr1963", "bardeen1972", "penrose1969", "blandford1977", "lense1918"],
  ],
  t: [
   `Une masse immobile <i>creuse</i> l'espace. Une masse qui tourne fait quelque chose
    de plus : elle <b>l'entraîne avec elle</b>, comme l'eau autour d'une bonde.
    <br><br>Et ça change tout. Il existe autour d'un trou noir en rotation une zone où
    l'espace file si vite que <b>plus rien ne peut rester immobile</b> — aucun moteur,
    aussi puissant soit-il, ne permet de tenir en place. Tu es forcé de tourner avec lui.
    <br><br>Autre conséquence, visible à l'écran : en tournant <i>dans le même sens</i>
    que lui, on peut s'approcher bien plus près. C'est pour ça que son ombre n'est plus
    ronde — elle s'aplatit du côté où la rotation vient vers toi.
    <br><br>Aucun trou noir réel n'est immobile. Ils naissent d'étoiles qui tournaient,
    et se nourrissent de gaz qui tourne.`,

   `L'entraînement des repères a été prédit en 1918 et mesuré autour de la Terre en 2011,
    où l'effet est minuscule. Près d'un trou noir, il domine tout.
    <br><br>La dernière orbite stable cesse d'être symétrique :
    3 rayons dans les deux sens sans rotation, mais <b>1,16 rayon</b> dans le sens de la
    rotation à a* = 0,9, contre 4,36 à contresens. Presque cinq fois plus près d'un côté
    que de l'autre.
    <br><br>D'où le point qui change vraiment tout : si la matière tombe plus près avant
    de se stabiliser, elle libère bien plus d'énergie. Le rendement passe de <i>5,7 %</i>
    de la masse convertie en lumière à <b>42 %</b> — quand la fusion nucléaire d'une étoile
    plafonne à 0,7 %. Un trou noir en rotation est soixante fois plus efficace que la fusion.
    <br><br>C'est ce qui fait des quasars les objets les plus lumineux de l'univers.`,

   `Métrique de Kerr (1963), le seul autre paramètre admis par le théorème de calvitie.
    L'entraînement des repères $\\omega = 2Mar/A$ engendre l'ergosphère
    $r_E = M + \\sqrt{M^2 - a^2\\cos^2\\theta}$, où aucun observateur statique n'existe.
    <br><br>L'ISCO se sépare :
    $r_{\\text{ISCO}} = 6GM/c^2$ pour $a = 0$, tombant à $GM/c^2$ en prograde extrême et
    montant à $9GM/c^2$ en rétrograde. Le rendement radiatif
    $1 - E_{\\text{ISCO}}/mc^2$ passe de <b>5,72 %</b> ($1-\\sqrt{8/9}$) à
    <b>42,3 %</b> ($1 - 1/\\sqrt{3}$).
    <br><br>L'énergie de rotation est <b>extractible</b> : jusqu'à 29 % de la masse par le
    processus de Penrose, et en pratique par le mécanisme de Blandford-Znajek, où des
    lignes de champ magnétique enfilant l'horizon alimentent les jets — celui de M87*
    court sur cinq mille années-lumière.
    <br><br><b>Ce que cette page simule :</b> l'ombre asymétrique, mesurée à 2,30 contre
    2,40 en théorie à a* = 0,9, et le bord interne du disque qui suit l'ISCO.
    <b>Ce qu'elle ne simule pas :</b> l'ergosphère n'est pas figurée, le curseur s'arrête
    à a* = 0,95 car l'intégrateur décroche quand l'orbite photonique prograde se colle à
    l'horizon, et une couture reste visible sur l'axe polaire — singularité des
    coordonnées de Boyer-Lindquist, non du calcul.`,
  ]
},
{
  id: "f-exact",
  titre: "Est-ce que c'est vrai ?",
  sources: [
    ["chandrasekhar1983"],
    ["chandrasekhar1983", "bardeen1973"],
    ["chandrasekhar1983", "bardeen1972", "yuan2014", "eht2022"],
  ],
  t: [
   `Oui. Et c'est le plus beau de toute l'histoire.
    <br><br>Personne n'a dessiné cette image. Pour chacun des deux millions de points de ton
    écran, l'ordinateur lance un rayon de lumière et le suit <i>à l'envers</i>, en respectant
    des équations écrites en 1915. L'anneau, l'ombre, le disque replié par-dessus :
    <b>tout ça sort du calcul, tout seul</b>.
    <br><br>Des gens ont écrit ces équations avec un crayon, il y a plus de cent ans, sans
    ordinateur, sans avoir jamais vu de trou noir — certains doutaient même que ça existe.
    Un siècle plus tard, une machine les applique et retrouve <b>exactement</b> ce que les
    télescopes finissent par photographier.
    <br><br>C'est ça, la physique. Et c'est fou.`,

   `C'est du lancer de géodésiques, pas un filtre de déformation. Chaque pixel intègre la
    trajectoire d'un photon dans la métrique de Schwarzschild. La preuve que ce n'est pas
    truqué : la sphère des photons tombe <i>exactement</i> à 1,5 rayon d'horizon, l'ombre à
    2,598, et l'image secondaire du disque apparaît sans avoir été demandée.
    <b>Ce sont des résultats, pas des réglages.</b>`,

   `<b>Exact</b> — géodésiques nulles intégrées sous forme cartésienne
    l'intégration de $\mathbf{a} = -\tfrac{3}{2}h^{2}\mathbf{r}/r^{5}$ avec $h = \lVert\mathbf{r}\times\dot{\mathbf{r}}\rVert$, équivalente à la Binet $d^{2}u/d\varphi^{2} + u = 3Mu^{2}$ :
    d'où sphère des photons à 1,5 r<sub>s</sub>, ombre à √27/2, images d'ordre n,
    Ω képlérien en r<sup>−3/2</sup>, et la période orbitale du photon 6√3·πGM/c³.<br><br>
    <b>Approximé</b> — métrique statique (a = 0 : ni frame-dragging ni ergosphère).
    Disque géométriquement mince et optiquement fin, émissivité ad hoc au lieu d'un GRMHD,
    sans transfert radiatif. Le <i>redshift gravitationnel</i> n'est appliqué qu'en g¹ sur la
    luminosité, avec un plancher, là où la loi est en g³ — et sans décalage de couleur :
    c'est le même défaut que celui qu'on assume pour le Doppler. Ce dernier prend β en
    coordonnées, le borne à 0,85 et omet γ, d'où une erreur de γ³−1 ≈ 32 % au bord interne,
    et non 10 %. Le calque de trajectoires est projeté droit, sans lentille. Les sondes
    suivent la géodésique de type temps (même équation plus le terme newtonien), intégrée en
    <i>temps coordonnée</i> et non en temps propre.`,
  ]
},
],

// ------------------------------------------------- dossier « c'est exact »
methodeSources: [
  ["chandrasekhar1983", "eht2022"],
  ["chandrasekhar1983", "dyson1920", "bardeen1973", "bardeen1972"],
  ["chandrasekhar1983", "bardeen1972", "bardeen1973", "yuan2014", "eht2022", "luminet1979"],
],

methode: [
// ---------------------------------------------------------------- Découverte
`<h3>D'abord, à quoi ressemble un faux</h3>
 <p>La manière facile de fabriquer un joli trou noir, c'est de prendre une photo
 d'étoiles et de la <b>tordre</b>, comme quand on regarde à travers le cul d'une bouteille.
 On pose un rond noir au milieu, un anneau orange autour, et c'est fini. Ça peut être
 très beau. Mais ça ne veut rien dire : on aurait pu faire le rond deux fois plus grand,
 personne n'y aurait vu de différence.</p>

 <h3>Ce que fait cette page</h3>
 <p>Ici, il n'y a <b>aucune image tordue et aucun rond dessiné</b>. Pour chacun des deux
 millions de points de ton écran, l'ordinateur se pose une question :
 <i>d'où vient la lumière qui arrive ici ?</i> Et il remonte le chemin de ce rayon
 à l'envers, petit bout par petit bout, en respectant la façon dont une masse
 creuse l'espace autour d'elle.</p>
 <p>Le rayon avance, il est un peu dévié. Il avance encore, il est dévié un peu plus.
 Au bout du voyage, trois choses peuvent lui arriver : il finit dans le trou noir
 — et le point est noir ; il traverse le gaz brûlant — le point est orange ;
 ou il repart vers les étoiles — le point est étoilé. C'est tout le programme.</p>

 <h3>Pourquoi ce n'est pas juste un joli dessin</h3>
 <p>Parce que <b>personne n'a décidé de la taille du rond noir</b>. Elle sort du calcul.
 Et la valeur qui en sort est exactement celle que des physiciens ont trouvée
 avec un papier et un crayon, bien avant les ordinateurs : 2,6 fois la taille du trou noir.
 Si le programme était faux, ce nombre serait faux.</p>
 <p>Même chose pour l'anneau lumineux, pour le fait qu'on voie le <i>dessous</i> du disque
 par-dessus, pour le côté qui brille plus que l'autre. Rien de tout ça n'a été dessiné
 à la main. Ce sont des <b>conséquences</b>.</p>
 <p>Et tu n'as pas à me croire sur parole : le bouton en bas relance le calcul
 sous tes yeux et compare ce que trouve la machine à ce que dit la théorie.</p>

 <h3>Ce qui, en revanche, n'est pas vrai</h3>
 <p>Autant être honnête. Les couleurs sont inventées : le vrai Sagittarius A* est
 beaucoup plus pâle, et on ne le voit qu'avec des antennes radio, pas avec des yeux.
 La forme est juste. Le décor est plausible, mais peint à la main.</p>
 <p>Et puis il y a le vaisseau. On est en orbite, c'est-à-dire en <b>chute libre</b> :
 dans la vraie vie, tout flotterait. Toi, ton voisin, et la tasse que quelqu'un a
 laissée sur le pupitre.</p>
 <p>Donc, en toute transparence : <b>pour des raisons de confort et de scénario, la
 direction a décrété que la gravité serait magique à bord.</b> Il fallait bien poser
 les tasses quelque part.</p>
 <p>C'est le seul mensonge de cette page. Tout le reste est calculé, et je préfère te
 le dire avant que tu le remarques — ça m'évite d'avoir l'air de l'avoir oublié.</p>`,

// ------------------------------------------------------------------- Curieux
`<h3>Le faux : une déformation d'écran</h3>
 <p>Un rendu bon marché applique un <b>déplacement radial des pixels</b> autour d'un centre,
 puis superpose un anneau et un disque noir. La signature est reconnaissable :
 pas d'images multiples, la taille de l'ombre est un curseur libre, et la déformation
 ne réagit pas correctement quand on change l'angle de vue.</p>

 <h3>Le vrai : on suit la lumière</h3>
 <p>Chaque pixel définit une direction de départ. On intègre la trajectoire du photon
 dans la <b>métrique de Schwarzschild</b> jusqu'à ce qu'il passe sous l'horizon, coupe
 le disque, ou parte à l'infini. À chaque pas on connaît la position et la direction,
 et on applique une accélération :</p>
 $$\\mathbf{a} = -\\frac{3}{2}\\,\\frac{h^{2}\\,\\mathbf{r}}{r^{5}}
   \\qquad\\text{avec } h = \\lVert \\mathbf{r}\\times\\mathbf{v} \\rVert \\text{ conservé}$$
 <p>C'est tout. Deux lignes, et toute l'optique du trou noir en découle.
 Le <code>h</code> est le moment cinétique du photon : il ne change pas le long du rayon,
 et le fait qu'il reste constant numériquement est déjà un contrôle de qualité.</p>

 <h3>Les quatre nombres qui tranchent</h3>
 <p>Une simulation exacte doit retrouver, <b>sans qu'on les lui souffle</b>, des valeurs
 calculées analytiquement il y a un siècle :</p>
 <ul>
   <li>La sphère des photons à <i>1,5</i> rayon de Schwarzschild</li>
   <li>Le rayon apparent de l'ombre : $\sqrt{27}/2 \approx 2{,}598$</li>
   <li>La déflexion à grande distance : $\alpha = 4GM/c^{2}b$</li>
   <li>La dernière orbite stable pour la matière : <i>3</i> rayons</li>
 </ul>
 <p>Le troisième est le plus parlant. Newton <b>aussi</b> prédisait une déviation de la
 lumière — mais deux fois plus faible. C'est ce facteur 2 qu'Eddington est allé mesurer
 pendant l'éclipse de 1919, et qui a rendu Einstein célèbre en une nuit. Si le moteur
 de cette page donnait la valeur newtonienne, il serait faux, et le banc d'essai
 ci-dessous te le montrerait.</p>

 <h3>La limite, dite franchement</h3>
 <p>L'optique est exacte ; l'astrophysique ne l'est pas. Le disque est une texture
 plausible, pas une simulation d'écoulement de plasma. Et la métrique employée est
 celle d'un trou noir <b>immobile</b>, alors que les vrais tournent.</p>`,

// ------------------------------------------------------------ Astrophysicien
`<h3>Formulation</h3>
 <p>Ray-tracing rétrograde de géodésiques nulles en Schwarzschild. On intègre la forme
 cartésienne</p>
 $$\\mathbf{a} \\;=\\; -\\frac{3}{2}\\,\\frac{h^{2}\\,\\mathbf{r}}{r^{5}},
    \\qquad h = \\lVert \\mathbf{r}\\times\\dot{\\mathbf{r}} \\rVert$$
 <p class="cm">Unités géométriques : $G = c = r_s = 1$, donc $M = \\tfrac{1}{2}$.</p>
 <p>équivalente à l'équation de Binet</p>
 $$\\frac{d^{2}u}{d\\varphi^{2}} + u = 3Mu^{2}, \\qquad u = 1/r$$
 <p>obtenue en éliminant le paramètre affine entre les intégrales premières
 $E = \\left(1-\\tfrac{2M}{r}\\right)\\dot{t}$ et $L = r^{2}\\dot{\\varphi}$.
 Le terme $3Mu^{2}$ est le <b>seul</b> écart au cas newtonien : c'est lui qui porte
 toute la relativité générale de l'image.</p>

 <h3>Schéma numérique</h3>
 <p>Intégrateur Verlet-vitesse à pas adaptatif
 $\\Delta\\lambda = \\operatorname{clamp}(0{,}085\\,r;\\,0{,}045;\\,1{,}4)\\big/\\lVert\\dot{\\mathbf{r}}\\rVert$,
 240 pas au maximum, terminaison sur $r < 1$ (capture) ou $r > 70$ en s'éloignant.
 La direction n'est <b>jamais</b> renormalisée : $\\lambda$ est un paramètre affine, où</p>
 $$\\left\\lVert \\frac{d\\mathbf{r}}{d\\lambda} \\right\\rVert^{2} = 1 + \\frac{2Mh^{2}}{r^{3}}$$
 <p>n'est pas constant. Forcer la norme à 1 est l'erreur naturelle, et elle gonfle
 l'ombre de 55 % — c'est le banc d'essai ci-dessous qui l'a débusquée. $h^{2}$ est
 évalué une fois au départ : ce n'est pas une contrainte imposée mais une constante
 du mouvement.</p>
 <p>Le banc rejoue ces géodésiques en JavaScript avec la même équation et les mêmes constantes
 que le GLSL, mais un pas des milliers de fois plus fin et sans plafond de pas : il mesure
 la justesse de la <i>formulation</i>, pas celle du budget temps réel du shader.
 Les quatre grandeurs obtenues sont des <b>sorties</b> du schéma, jamais des paramètres.</p>

 <h3>Les sondes de matière</h3>
 <p>Elles suivent</p>
 $$\\mathbf{a} = -\\frac{M}{r^{3}}\\left(1 + \\frac{3h^{2}}{r^{2}}\\right)\\mathbf{r}$$
 <p>forme cartésienne de la Binet de type temps
 $\\;\\dfrac{d^{2}u}{d\\varphi^{2}} + u = \\dfrac{M}{h^{2}} + 3Mu^{2}$.
 Elle redonne $h^{2} = \\dfrac{Mr^{2}}{r-3M}$ pour les orbites circulaires — d'où la
 divergence en $r = 3M$, qui <i>est</i> la sphère des photons — et, en annulant
 $V''_{\\text{eff}}$, l'ISCO à exactement $6M$. La précession du périastre en sort
 au bon ordre.</p>
 <p><b>Réserve :</b> l'intégration est paramétrée en temps coordonnée et non en temps propre.
 Les trajectoires dans l'espace sont bonnes ; la cadence à laquelle elles sont parcourues
 ne l'est plus près de l'horizon.</p>

 <h3>Ce qui n'est délibérément pas simulé</h3>
 <ul>
   <li><b>Spin.</b> Métrique statique, a = 0. Ni frame-dragging, ni ergosphère, ni ISCO
       déplacée, ni asymétrie prograde/rétrograde. Le spin réel de Sgr A* est non nul
       mais mal contraint.</li>
   <li><b>Transfert radiatif.</b> Émissivité ad hoc en bruit fractal, absorption grossière.
       Pas d'opacité, pas de synchrotron, pas de comptonisation. Un rendu publiable part
       d'un GRMHD (KHARMA, BHAC) post-traité par un code de transfert (ipole, RAPTOR).</li>
   <li><b>Géométrie du disque.</b> Mince et plan, alors qu'un RIAF comme Sgr A* est
       géométriquement épais, H/R ~ 1.</li>
   <li><b>Doppler.</b> <code>D = 1/(1 − β·n̂)</code> sans le facteur γ. L'erreur sur
       l'amplitude est d'ordre γ−1 ≈ 10 % au bord interne : l'asymétrie qualitative est
       bonne, le contraste absolu non.</li>
   <li><b>Simultanéité.</b> L'image est instantanée ; on ignore que la lumière venant de
       l'arrière du disque est plus vieille que celle du bord avant.</li>
 </ul>

 <h3>Le test qui distingue vraiment</h3>
 <p>Un post-traitement en espace écran ne <b>peut pas</b> produire d'images d'ordre n :
 il est une bijection du plan image sur lui-même, alors que la vraie application
 observateur → source est infiniment repliée au voisinage de <code>b_c</code>.
 C'est le discriminant. Ici le second anneau du disque est visible à l'œil,
 et un troisième existe sous le seuil de résolution.</p>`,
],

};
