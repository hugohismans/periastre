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
  { id:"vivienne", nom:"Vivienne", modele:"fr-FR-VivienneMultilingualNeural" },
  { id:"remy",     nom:"Rémy",     modele:"fr-FR-RemyMultilingualNeural"     },
  { id:"denise",   nom:"Denise",   modele:"fr-FR-DeniseNeural"               },
  { id:"henri",    nom:"Henri",    modele:"fr-FR-HenriNeural"                },
],

// ------------------------------------------------------- répliques de Lumen
// `t` : affiché (HTML autorisé).  `dire` : lu à voix haute, si différent.
// `sources` : clés de `sources` ci-dessus, obligatoires dès qu'il y a un fait.
reactions: {
  accueil: { niv:[
    { id:"accueil-0", t:`Salut ! Moi c'est <b>Lumen</b>, je suis un photon. Je tourne autour de ce truc depuis un moment. Clique sur moi si tu as des questions.` },
    { id:"accueil-1", t:`Salut, <b>Lumen</b>, photon en orbite. Pose-moi ce que tu veux, j'ai le temps : je boucle un tour toutes les onze minutes et demie.`,
      sources:["gravity2021","chandrasekhar1983"] },
    { id:"accueil-2", t:`<b>Lumen</b>, photon piégé sur la sphère à 1,5 r<sub>s</sub>. Orbite instable, donc je ne suis pas là pour longtemps. Clique si tu veux parler métrique.`,
      dire:`Lumen, photon piégé sur la sphère à un virgule cinq rayon de Schwarzschild. Orbite instable, donc je ne suis pas là pour longtemps. Clique si tu veux parler métrique.`,
      sources:["chandrasekhar1983"] },
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
  photon: { id:"photon", t:`Ah, un collègue ! Il est sur la crête : trop lent il tombe, trop vite il part. Personne ne reste. <i>Passe en temps réel</i> pour voir à quel point c'est lent.`,
    sources:["chandrasekhar1983"] },
  photonAvale: { id:"photon-avale", t:`Bon. Il a glissé du mauvais côté de la crête.` },
  photonFuite: { id:"photon-fuite", t:`Il s'en sort. Maintenant il file tout droit pendant 26 000 ans avant que quelqu'un le voie.`,
    sources:["gravity2021"] },
  traj: { id:"traj", t:`Voilà l'avenir de tout le monde, déjà tracé. Une orbite ne se décide pas en route : la vitesse de départ contient toute l'histoire.` },
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
      sources:["gravity2021","schwarzschild1916","eht2019"] },
    { id:"inactif-2", t:`L'ombre que tu regardes fait 52 millionièmes de seconde d'arc dans le ciel. C'est une <i>orange posée sur la Lune</i>.`,
      sources:["eht2022"] },
    { id:"inactif-3", t:`Tu ne verrais jamais personne franchir l'horizon. De loin, il ralentit, rougit, et se fige. Lui, il passe sans rien remarquer.`,
      sources:["misner1973"] },
    { id:"inactif-4", t:`Ce trou noir-là tourne sur lui-même et entraîne l'espace avec lui. Ça, je ne le simule pas : ma version est immobile. <i>Fiche 8.</i>`,
      dire:`Ce trou noir-là tourne sur lui-même et entraîne l'espace avec lui. Ça, je ne le simule pas : ma version est immobile. Va voir la fiche huit.`,
      sources:["eht2022","bardeen1972"] },
    { id:"inactif-5", t:`Le disque brille parce que le gaz frotte contre lui-même en tombant. Rien ne brûle là-dedans — c'est la chute qui fait la lumière.`,
      sources:["shakura1973","balbus1991"] },
  ],
},

questions: [
{ q:"C'est quoi un trou noir, exactement ?", niv:[
  { id:"q1-0", t:`De la matière tellement tassée que plus rien ne peut s'en échapper, <b>même pas la lumière</b>. Ce n'est ni un trou ni un aspirateur : juste un endroit d'où on ne revient pas.` },
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
  { id:"q5-0", t:`Non. Un trou noir n'attire pas plus qu'une étoile de la même masse. Si le Soleil en devenait un tout de suite, la Terre garderait <b>exactement</b> la même orbite — il ferait juste nuit et très froid. Et celui-ci est à 26 000 années-lumière.`,
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
};
