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

// La langue de ce fichier. Elle sert au chemin des voix, et elle dira un jour
// à la page quel jeu de textes elle a chargé.
langue: "fr",


// ---------------------------------------------------------------- références
sources: {
  gravity2021: {
    ref: "GRAVITY Collaboration (Abuter et al.), « The mass distribution in the Galactic Centre from interferometric astrometry of multiple stellar orbits », Astronomy & Astrophysics 657, L12 (2022)",
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
    url: "https://arxiv.org/abs/physics/9905030",
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
    url: "https://inspirehep.net/literature/1361769",
    sert: "Rayon apparent de l'ombre, paramètre d'impact critique b_c = √27 GM/c²",
  },
  luminet1979: {
    ref: "J.-P. Luminet, « Image of a spherical black hole with thin accretion disk », Astronomy & Astrophysics 75, 228-235 (1979)",
    url: "https://inspirehep.net/literature/1730378",
    sert: "Premier calcul d'image d'un trou noir à disque mince : image secondaire, asymétrie Doppler",
  },
  gralla2019: {
    ref: "S. E. Gralla, D. E. Holz, R. M. Wald, « Black hole shadows, photon rings, and lensing rings », Physical Review D 100, 024018 (2019)",
    doi: "10.1103/PhysRevD.100.024018",
    sert: "Distinction ombre / anneau de photons ; espacement des sous-anneaux d'ordre n en e^(−π)",
  },
  shakura1973: {
    ref: "N. I. Shakura, R. A. Sunyaev, « Black holes in binary systems. Observational appearance », Astronomy & Astrophysics 24, 337-355 (1973)",
    url: "https://inspirehep.net/literature/73651",
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
    url: "https://openlibrary.org/works/OL22104343W",
    sert: "Théorème de Birkhoff : à l'extérieur d'une distribution sphérique, la métrique ne dépend que de M",
  },
  chandrasekhar1983: {
    ref: "S. Chandrasekhar, The Mathematical Theory of Black Holes, Oxford University Press (1983), chap. 3",
    url: "https://openlibrary.org/works/OL3267036W",
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
    doi: "10.1023/A:1016578408204",
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
    url: "https://openlibrary.org/works/OL4461077W",
    sert: "Marées en M/r³, chute libre régulière à travers l'horizon, temps propre maximal πGM/c³",
  },
  gillessen2017: {
    ref: "S. Gillessen, P. M. Plewa, F. Eisenhauer, R. Sari, I. Waisberg, M. Habibi, O. Pfuhl, E. George, J. Dexter, S. von Fellenberg, T. Ott, R. Genzel, « An Update on Monitoring Stellar Orbits in the Galactic Center », The Astrophysical Journal 837, 30 (2017)",
    doi: "10.3847/1538-4357/aa5c41",
    sert: "Éléments orbitaux des 40 étoiles S ; ajustement multi-étoiles M = 4,28 ± 0,10 × 10⁶ M☉ à R₀ = 8,32 ± 0,07 kpc",
  },
  maoz1998: {
    ref: "E. Maoz, « Dynamical Constraints on Alternatives to Supermassive Black Holes in Galactic Nuclei », The Astrophysical Journal 494, L181 (1998)",
    doi: "10.1086/311194",
    sert: "Durée de vie maximale d'un amas d'objets sombres, limitée par la relaxation et les collisions",
  },
  schoedel2003: {
    ref: "R. Schödel, R. Genzel, T. Ott, A. Eckart, N. Mouawad, T. Alexander, « Stellar dynamics in the central arcsecond of our galaxy », The Astrophysical Journal 596, 1015 (2003)",
    doi: "10.1086/378122",
    sert: "Amas sombre en modèle de Plummer : densité centrale > 2,2 × 10¹⁷ M☉/pc³, durée de vie < 10⁵ ans ; exclusion de la boule de fermions et de l'étoile à bosons",
  },
  ghez1998: {
    ref: "A. M. Ghez, B. L. Klein, M. Morris, E. E. Becklin, « High Proper-Motion Stars in the Vicinity of Sgr A*: Evidence for a Supermassive Black Hole at the Center of Our Galaxy », The Astrophysical Journal 509, 678 (1998)",
    doi: "10.1086/306528",
    sert: "Imagerie à la limite de diffraction au Keck 10 m, 1995-1997 : 90 étoiles, vitesses jusqu'à 1 400 ± 100 km/s",
  },
  habibi2017: {
    ref: "M. Habibi, S. Gillessen, F. Martins, F. Eisenhauer et al., « Twelve Years of Spectroscopic Monitoring in the Galactic Center: The Closest Look at S-stars near the Black Hole », The Astrophysical Journal 847, 120 (2017)",
    doi: "10.3847/1538-4357/aa876f",
    sert: "Nature stellaire des étoiles S : type spectral B0-B3V, masses 8-14 M☉, âge de S2 6,6 (+3,4 / −4,7) Myr",
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
                le plus. Un trou noir bien nourri de cette masse brillerait surtout en ultraviolet ;
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
  orbite: "apoastre à 16 rayons de Schwarzschild",
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

  /* La présentation, jouée une fois, après que le son a été accepté.

     Elle dit trois choses et pas une de plus : ce que c'est, ce qu'on s'accorde
     comme libertés, et pourquoi ça vaut le détour. Le troisième temps ne parle
     pas de physique mais d'une famille qu'on ne revoit pas — c'est le seul
     moyen de faire sentir un facteur de Lorentz de treize mille.

     Les durées y sont exactes et recalculées à l'affichage, jamais écrites en
     dur : trente-neuf ans à bord, cinquante-quatre mille sur Terre, pour un
     aller-retour au centre de la galaxie à un g. */
  presentation: [
    { sur: "Simulation pédagogique",
      t: `Vous n'allez pas lire un cours sur les trous noirs.
          Vous allez en approcher un.` },

    { sur: "Tout est calculé",
      t: `Pas une texture importée, pas une étoile peinte à la main.
          Trois libertés seulement — on vous les signalera à chaque fois.` },

    { sur: "Ce que ça coûte",
      t: `Aller au centre de la galaxie et revenir : <b>trente-neuf ans</b> pour
          vous. <b>Cinquante-quatre mille</b> pour la Terre.` },
  ],
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
  vitesse0: { id:"vitesse-reel", t:`Là tu es en <b>temps réel</b>. Le photon avance de deux centièmes de rayon par seconde. Va faire un café : il lui faut <i>11 min 31 s</i> pour un tour.`,
    dire:`Là tu es en temps réel. Le photon avance de deux centièmes de rayon par seconde. Va faire un café : il lui faut onze minutes et trente et une secondes pour un tour.`,
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
    { id:"inactif-11", t:`Second avis aux passagers, dans le même esprit. Notre moteur tient <b>1 g</b> indéfiniment, ce qui est très commode et parfaitement invraisemblable. Le service technique n'a jamais voulu expliquer comment il fonctionne, et je crois que c'est parce qu'il ne le sait pas non plus.`,
      dire:`Second avis aux passagers, dans le même esprit. Notre moteur tient un g indéfiniment, ce qui est très commode et parfaitement invraisemblable. Le service technique n'a jamais voulu expliquer comment il fonctionne, et je crois que c'est parce qu'il ne le sait pas non plus.`,
      pourquoi:`La difficulté n'est pas la poussée, c'est de l'entretenir. Une fusée qui
                veut changer sa rapidité de $\\Delta\\eta$ doit emporter un rapport de
                masses $M_i/M_f = e^{\\Delta\\eta / (v_e/c)}$ : le carburant doit pousser
                le carburant, et la note grimpe de façon <b>exponentielle</b>.
                <br><br>Pour rejoindre le centre galactique à 1 g, la rapidité accumulée
                vaut 20,47. Même avec le moteur le plus efficace que la physique autorise
                — conversion totale de la masse en énergie, éjectée exactement à
                l'arrière — il faudrait environ <b>780 000 tonnes de carburant par
                kilogramme arrivé</b>. Avec des ergols chimiques, dont la vitesse
                d'éjection est cent-millième de celle de la lumière, l'exposant devient si
                grand que la masse requise dépasse celle de l'univers observable.
                <br><br>Ce n'est donc pas une question d'ingénierie à perfectionner :
                c'est l'équation de Tsiolkovski qui interdit le voyage, pas la
                technologie.`,
      sources:["misner1973"] },
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
    { id:"inactif-6", t:`Un vaisseau qui tiendrait <i>1 g</i> tout le trajet — la moitié en accélérant, la moitié en freinant — arriverait ici en <b>19,8 ans</b> de vie à bord. Sur Terre il se serait écoulé 27 000 ans. Personne ne t'attendrait.`,
      dire:`Un vaisseau qui tiendrait un g tout le trajet, la moitié en accélérant, la moitié en freinant, arriverait ici en dix-neuf ans et dix mois de vie à bord. Sur Terre, il se serait écoulé vingt-sept mille ans. Personne ne t'attendrait.`,
      pourquoi:`Fusée relativiste à accélération propre constante. Le temps vécu à bord vaut
                $\\tau = \\tfrac{2c}{g}\\,\\operatorname{arccosh}\\!\\left(\\tfrac{gd}{2c^{2}}+1\\right)$ —
                il croît comme le <b>logarithme</b> de la distance, alors que le temps
                terrestre croît proportionnellement. C'est toute l'affaire.
                <br><br>Pour d = 26 996 al : <b>19,8 ans</b> à bord contre ~27 000 sur Terre,
                avec γ = 13 935 au demi-tour. Rien d'exotique, c'est de la relativité
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
    /* 780 000 tonnes, et non 758 000.

       L'ancien chiffre n'était pas un autre calcul : c'était la MÊME formule
       appliquée à une AUTRE distance — les 8 178 parsecs de GRAVITY 2019, que le
       site a cessé d'employer en passant aux 8 277 de la mesure de 2022. La
       fiche voisine disait donc 780 000 et celle-ci 758 000, pour un seul et
       même trajet.

       Recalculé : k = a·d/2c² = 13 934, η = arcosh(k+1) = 10,2353,
       e^(2η) = 7,77 × 10⁸, soit 777 000 tonnes — que l'on arrondit à 780 000
       comme partout ailleurs. */
    { id:"inactif-8", t:`Le carburant, justement. Même une fusée <b>à photons parfaite</b> — toute sa masse changée en lumière — devrait en annihiler <i>780 000 tonnes</i> pour qu'un seul kilo arrive ici. Avec de la fusion, le rapport dépasse la masse de l'univers observable.`,
      dire:`Le carburant, justement. Même une fusée à photons parfaite, toute sa masse changée en lumière, devrait en annihiler sept cent quatre-vingt mille tonnes pour qu'un seul kilo arrive ici. Avec de la fusion, le rapport dépasse la masse de l'univers observable.`,
      pourquoi:`Équation de la fusée relativiste : le rapport de masses vaut
                $e^{\\Delta\\eta/(v_e/c)}$, où $\\eta = \\operatorname{arccosh}\\gamma$ est la
                rapidité. Accélérer puis freiner jusqu'au centre galactique en accumule
                <b>20,47</b>.
                <br><br>Avec une fusée à photons — le meilleur concevable, 100 % de la masse
                convertie — cela donne $e^{20{,}47} = 7{,}8\\times10^{8}$ : 780 000 tonnes
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
  quoi: `Huit missions, une seule chose à comprendre par mission.
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

/* La quête d'accueil, jouée à bord.

   Elle n'enseigne pas la relativité : elle apprend le lieu. Quatre gestes, tous
   déjà possibles, dont chacun révèle une commande qu'on ne devinerait pas —
   qu'on peut tourner la tête, qu'il y a quelqu'un à bord, que le temps est
   accéléré et qu'on peut le remettre au vrai, et que le télescope est une porte.

   La troisième étape est la seule qui enseigne un fait, et c'est un aveu : on
   triche avec le temps pour que l'orbite se voie. Le dire tôt vaut mieux que
   le laisser découvrir. */
accueilQuete: [
{
  id: "a-baie",
  titre: "Regarde par la baie",
  consigne: "Fais glisser la souris — ou ton doigt — pour tourner la tête vers la vitre.",
  reussi: { id:"a-baie-ok",
    t:`Arrête-toi une seconde sur ce que tu as devant toi.<br><br><b>Personne n'a jamais vu ça.</b> Aucune caméra n'a jamais été ici. Et ce n'est pas une vue d'artiste : chaque point de cette image est un rayon lumineux qu'on a suivi, un par un, dans l'espace-temps déformé par quatre millions de Soleils.<br><br>L'anneau n'a pas été dessiné. Le dessous du disque, que tu vois passer par-dessus, non plus — c'est la lumière qui a fait le tour. Le côté qui brille plus fort est celui qui vient vers toi.<br><br>Alors soyons exacts : <b>la forme, tu la verrais vraiment comme ça.</b> Les couleurs, non — et je te dirai pourquoi. Mais la géométrie que tu regardes est celle que donnent les équations d'Einstein, sans un pixel arrangé.`,
    dire:`Arrête-toi une seconde sur ce que tu as devant toi. Personne n'a jamais vu ça. Aucune caméra n'a jamais été ici. Et ce n'est pas une vue d'artiste : chaque point de cette image est un rayon lumineux qu'on a suivi, un par un, dans l'espace-temps déformé par quatre millions de Soleils. L'anneau n'a pas été dessiné. Le dessous du disque, que tu vois passer par-dessus, non plus : c'est la lumière qui a fait le tour. Le côté qui brille plus fort est celui qui vient vers toi. Alors soyons exacts. La forme, tu la verrais vraiment comme ça. Les couleurs, non, et je te dirai pourquoi. Mais la géométrie que tu regardes est celle que donnent les équations d'Einstein, sans un pixel arrangé.`,
    pourquoi:`Chaque pixel de l'image lance une géodésique nulle intégrée à rebours du temps
              dans la métrique de Schwarzschild, sous la forme cartésienne
              $\\mathbf{a} = -\\tfrac{3}{2}h^{2}\\mathbf{r}/r^{5}$. Rien n'est plaqué :
              la sphère des photons à 1,5 r_s, l'ombre à $\\sqrt{27}/2$, les images
              d'ordre supérieur et l'asymétrie Doppler sont des conséquences, et le banc
              d'essai du site les mesure en direct — 0,002 % d'écart sur le rayon de
              l'ombre. Les couleurs, elles, sont inventées : Sgr A* rayonne dans le
              submillimétrique et serait invisible à l'œil nu.`,
    sources:["gravity2021","eht2022","misner1973"] },
},
{
  id: "a-lumen",
  titre: "Tu n'es pas seul à bord",
  consigne: "Un petit drone fait sa ronde. <b>Clique dessus</b> pour lui poser une question.",
  reussi: { id:"a-lumen-ok",
    t:`Je suis le système de bord du <b>Périastre</b>. Pas une intelligence : un guide, avec un nombre fini de réponses préparées.<br><br>Ce que nous faisons ici tient en une phrase. Sagittarius A* est le <b>seul endroit atteignable</b> où la gravité est assez forte pour qu'on la voie plier la lumière. Sur Terre elle courbe l'espace de façon si ténue qu'il faut des horloges atomiques pour la mesurer ; ici elle fait faire demi-tour aux rayons lumineux. Tout ce que nous croyons savoir de la relativité tient à cette distance, ou ne tient pas.<br><br>C'est pour ça que des gens ont accepté un aller sans retour. Pas pour en rapporter quelque chose — pour <i>regarder</i>.<br><br>Quand je cite un chiffre, le bouton <i>d'où ça sort ?</i> donne le calcul, puis la référence.`,
    dire:`Je suis le système de bord du Périastre. Pas une intelligence : un guide, avec un nombre fini de réponses préparées. Ce que nous faisons ici tient en une phrase. Sagittarius A star est le seul endroit atteignable où la gravité est assez forte pour qu'on la voie plier la lumière. Sur Terre, elle courbe l'espace de façon si ténue qu'il faut des horloges atomiques pour la mesurer. Ici, elle fait faire demi-tour aux rayons lumineux. Tout ce que nous croyons savoir de la relativité tient à cette distance, ou ne tient pas. C'est pour ça que des gens ont accepté un aller sans retour. Pas pour en rapporter quelque chose : pour regarder. Quand je cite un chiffre, le bouton « d'où ça sort » donne le calcul, puis la référence.`,
    sources:["gravity2021","eht2022"] },
},
{
  id: "a-temps",
  titre: "Le temps est truqué, et il faut que tu le saches",
  consigne: "Sur le pupitre, cinq lames règlent la vitesse. <b>Mets la plus courte</b> : le temps réel.",
  reussi: { id:"a-temps-ok",
    t:`Merci. À cette vitesse plus rien ne bouge — et c'est la vérité : un tour d'orbite dure <b>4 h 44</b>. L'accélération est un choix de confort, et c'est le seul endroit du site où l'on te ment. Remets ce que tu veux.<br><br>Tant qu'on parle du temps, tu devrais savoir comment nous sommes arrivés ici. Ce vaisseau a poussé à <i>1 g</i> — la pesanteur terrestre — la moitié du trajet en accélérant, l'autre en freinant. <b>Une vingtaine d'années</b> de vie à bord. Sur Terre, il s'en est écoulé <b>vingt-sept mille</b>.<br><br>Personne de ceux qui nous ont regardés partir n'était là pour nous voir arriver. Ce n'est pas une licence de scénario : c'est ce que donnent les équations, et le bouton ci-dessous te montre lesquelles.`,
    dire:`Merci. À cette vitesse, plus rien ne bouge, et c'est la vérité : un tour d'orbite dure quatre heures quarante-quatre. L'accélération est un choix de confort, et c'est le seul endroit du site où l'on te ment. Remets ce que tu veux. Tant qu'on parle du temps, tu devrais savoir comment nous sommes arrivés ici. Ce vaisseau a poussé à un g, la pesanteur terrestre, la moitié du trajet en accélérant et l'autre en freinant. Une vingtaine d'années de vie à bord. Sur Terre, il s'en est écoulé vingt-sept mille. Personne de ceux qui nous ont regardés partir n'était là pour nous voir arriver. Ce n'est pas une licence de scénario : c'est ce que donnent les équations.`,
    pourquoi:`Fusée relativiste à accélération propre constante. Le temps propre d'un trajet
              où l'on accélère puis freine vaut
              $\\tau = \\tfrac{2c}{a}\\,\\operatorname{arccosh}\\!\\left(\\tfrac{ad}{2c^{2}}+1\\right)$.
              Pour $a = g$ et $d = 8\\,277$ pc, il vient une vingtaine d'années propres,
              tandis que le temps mesuré depuis la Terre reste à peine supérieur à $d/c$,
              soit environ 27 000 ans : à ces vitesses le vaisseau suit la lumière de très
              près. Le voyage tient donc dans une vie — c'est le retour qui n'y tient pas.`,
    sources:["misner1973","gravity2021"] },
},
{
  id: "a-telescope",
  titre: "Passe au télescope",
  consigne: "Descends dans la fosse, à bâbord. <b>Clique sur l'instrument</b> — il donne la main sur tout le reste.",
  reussi: { id:"a-telescope-ok",
    t:`Te voilà à l'instrument. D'ici tu lances des sondes, tu changes de longueur d'onde, tu fais tourner le trou noir sur lui-même. Vas-y, casse quelque chose — on revient au vaisseau quand tu veux.`,
    dire:`Te voilà à l'instrument. D'ici, tu lances des sondes, tu changes de longueur d'onde, tu fais tourner le trou noir sur lui-même. Vas-y, casse quelque chose. On revient au vaisseau quand tu veux.`,
    sources:[] },
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
  { id:"q2-2", t:`Traversée régulière en Eddington-Finkelstein. En intérieur de Schwarzschild r devient de type temps : atteindre r = 0 est inévitable et le temps propre restant est majoré par <i>πGM/c³ ≈ 66,5 s</i> ici. Les marées divergent en M/r³, donc négligeables à l'horizon d'un supermassif. La question ouverte est quantique : firewall, ou strictement rien.`,
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
  { id:"q6-2", t:`Optique gravitationnelle exacte, astrophysique décorative. Le spin est là : à a ≠ 0 on bascule sur Kerr, avec frame-dragging, ergosphère et ISCO déplacée, en coordonnées de Kerr-Schild où l'axe polaire n'a plus rien de singulier. Manquent en revanche le transfert radiatif en plasma optiquement mince, la géométrie épaisse d'un RIAF, et la variabilité. Un vrai rendu part d'un post-traitement GRMHD ; ici l'émissivité est posée à la main. <i>Fiche 8.</i>`,
    dire:`Optique gravitationnelle exacte, astrophysique décorative. Le spin est là : à spin non nul, on bascule sur Kerr, avec frame-dragging, ergosphère et I S C O déplacée, en coordonnées de Kerr-Schild, où l'axe polaire n'a plus rien de singulier. Manquent en revanche le transfert radiatif en plasma optiquement mince, la géométrie épaisse d'un R I A F, et la variabilité. Un vrai rendu part d'un post-traitement G R M H D. Ici, l'émissivité est posée à la main.`,
    sources:["bardeen1972","yuan2014","eht2022"] },
]},
{ q:"Pourquoi les étoiles ne tombent pas dedans ?", niv:[
  { id:"q7-0", t:`Pour la même raison que la Terre ne tombe pas sur le Soleil : elles vont <b>de côté</b>. Une chose qui tombe en avançant assez vite rate sa cible et recommence, indéfiniment. Une orbite, c'est une chute qui n'en finit pas.`,
    sources:["misner1973"] },
  { id:"q7-1", t:`Elles tombent en permanence — mais avec du moment cinétique, et celui-ci se conserve. La trajectoire est alors une ellipse dont le périastre est une <i>distance minimale</i>, pas un point d'arrivée. Pour S2, ce minimum vaut 120 UA, environ <b>1 400 rayons de Schwarzschild</b> : mille fois trop loin pour que l'horizon entre en jeu.`,
    dire:`Elles tombent en permanence, mais avec du moment cinétique, et celui-ci se conserve. La trajectoire est alors une ellipse dont le périastre est une distance minimale, pas un point d'arrivée. Pour S 2, ce minimum vaut cent vingt unités astronomiques, environ mille quatre cents rayons de Schwarzschild : mille fois trop loin pour que l'horizon entre en jeu.`,
    sources:["gravity2018","misner1973"] },
  { id:"q7-2", t:`Le moment cinétique spécifique de S2 est très au-dessus du seuil de capture : la dernière orbite stable est à 3 r<sub>s</sub>, son périastre est à ~1 400. Le régime est post-newtonien d'ordre 1 — $\\Delta\\varphi \\simeq 12'$ par période, mesurable, mais très loin du champ fort. Et rien ne viendra la faire tomber à l'échelle de sa vie : le temps de relaxation à deux corps au centre galactique est de 10¹⁰ à 2 × 10¹¹ ans, quand S2 a environ 7 × 10⁶ ans.`,
    dire:`Le moment cinétique spécifique de S 2 est très au-dessus du seuil de capture : la dernière orbite stable est à trois rayons de Schwarzschild, son périastre est à mille quatre cents. Le régime est post-newtonien d'ordre un : douze minutes d'arc par période, mesurable, mais très loin du champ fort. Et rien ne viendra la faire tomber à l'échelle de sa vie : le temps de relaxation à deux corps au centre galactique se compte en dizaines de milliards d'années, quand S 2 en a sept millions.`,
    sources:["gravity2018","genzel2010","bardeen1972","habibi2017"] },
]},
{ q:"Si on l'a photographié en 2022, pourquoi dire qu'on savait avant ?", niv:[
  { id:"q8-0", t:`Parce que la preuve n'était pas une photo, elle était dans le <b>mouvement</b>. Voir des étoiles tourner autour d'un point vide et mesurer combien pèse ce point, ça suffisait. On savait à quoi s'attendre trente ans avant que l'image arrive — et l'image a confirmé, elle n'a pas révélé.`,
    sources:["gravity2021","eht2022","nobel2020"] },
  { id:"q8-1", t:`Les deux mesures ne portent pas sur la même chose. Les orbites donnent une <b>masse</b> et une <b>densité minimale</b>. L'image de l'EHT donne une <i>taille apparente</i> : un anneau de 51,8 ± 2,3 μas, compatible avec l'ombre attendue pour cette masse à cette distance. La seconde vérifie la première à une échelle des centaines de fois plus petite — 2,6 rayons d'horizon pour l'ombre, contre 1 400 pour le périastre de S2.`,
    dire:`Les deux mesures ne portent pas sur la même chose. Les orbites donnent une masse et une densité minimale. L'image de l'E H T donne une taille apparente : un anneau de cinquante et une microsecondes d'arc, compatible avec l'ombre attendue pour cette masse à cette distance. La seconde vérifie la première à une échelle des centaines de fois plus petite : deux virgule six rayons d'horizon pour l'ombre, contre mille quatre cents pour le périastre de S 2.`,
    sources:["gravity2018","eht2022","bardeen1973"] },
  { id:"q8-2", t:`Deux contraintes indépendantes sur le même objet. Les orbites contraignent $M$ et $R_{0}$, corrélés, plus une densité minimale et une borne sur la masse étendue. L'EHT contraint le diamètre angulaire de l'anneau, $51{,}8 \\pm 2{,}3\\ \\mu\\mathrm{as}$, donc $GM/(c^{2}D)$ via le paramètre d'impact critique $\\sqrt{27}\\,GM/c^{2}$. Les deux s'accordent, ce qui n'était nullement acquis : instruments, longueurs d'onde et systématiques n'ont rien de commun. C'est cette <b>redondance</b> qui fait la solidité du résultat, pas l'une des deux mesures prise seule.`,
    dire:`Deux contraintes indépendantes sur le même objet. Les orbites contraignent la masse et la distance, qui sont corrélées, plus une densité minimale et une borne sur la masse étendue. L'E H T contraint le diamètre angulaire de l'anneau, donc le rapport G M sur c carré D, via le paramètre d'impact critique. Les deux s'accordent, ce qui n'était nullement acquis : instruments, longueurs d'onde et systématiques n'ont rien de commun. C'est cette redondance qui fait la solidité du résultat, pas l'une des deux mesures prise seule.`,
    sources:["gravity2021","eht2022","bardeen1973"] },
]},
{ q:"Les étoiles qui bougent, on les voit vraiment ?", niv:[
  { id:"q9-0", t:`Oui, mais pas comme une vidéo. On a des <b>photos</b>, prises année après année pendant trente ans, sur lesquelles chaque étoile a un peu bougé. L'animation que tu regardes relie ces points : les points sont réels, le mouvement entre deux points est calculé.`,
    sources:["gravity2021"] },
  { id:"q9-1", t:`Ce que publient les articles, ce sont des positions datées et des vitesses radiales, pas un film. Pour S2 : 128 positions à l'optique adaptative, 82 à l'interféromètre, une centaine de spectres, entre 1992 et 2021. L'orbite est un <b>ajustement</b> qui passe au mieux par ces points ; l'animation rejoue cet ajustement à la vitesse qu'on veut. La forme est mesurée, la fluidité est ajoutée.`,
    dire:`Ce que publient les articles, ce sont des positions datées et des vitesses radiales, pas un film. Pour S 2 : cent vingt-huit positions à l'optique adaptative, quatre-vingt-deux à l'interféromètre, une centaine de spectres, entre 1992 et 2021. L'orbite est un ajustement qui passe au mieux par ces points ; l'animation rejoue cet ajustement à la vitesse qu'on veut. La forme est mesurée, la fluidité est ajoutée.`,
    sources:["gravity2021","gillessen2017"] },
  { id:"q9-2", t:`Cette scène résout Kepler sur les éléments osculateurs de Gillessen et al. 2017, <b>sans terme relativiste</b> : la précession de Schwarzschild, 12′ par période pour S2, n'est pas rendue. Sur les orbites longues du même tableau, l'incertitude sur <i>a</i> et <i>P</i> atteint plusieurs dizaines de pour cent — S85 est publiée à 3 580 ± 2 550 ans — et une ligne, S111, porte un demi-grand axe formellement négatif, donc une orbite hyperbolique, exclue de tout tracé d'ellipse. Les étoiles montrées ici sont celles dont la période est courte et bien échantillonnée. Ce n'est pas un échantillon complet, et ça ne prétend pas l'être.`,
    dire:`Cette scène résout Kepler sur les éléments osculateurs de Gillessen et collaborateurs, deux mille dix-sept, sans terme relativiste : la précession de Schwarzschild, douze minutes d'arc par période pour S 2, n'est pas rendue. Sur les orbites longues du même tableau, l'incertitude sur le demi-grand axe et la période atteint plusieurs dizaines de pour cent, et une ligne porte un demi-grand axe formellement négatif, donc une orbite hyperbolique, exclue de tout tracé d'ellipse. Les étoiles montrées ici sont celles dont la période est courte et bien échantillonnée. Ce n'est pas un échantillon complet, et ça ne prétend pas l'être.`,
    sources:["gillessen2017","gravity2020"] },
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
    en 16 ans et frôle <b>2,5 % de la vitesse de la lumière</b> à son passage au plus près.
    Ce travail a valu le <b>prix Nobel de physique 2020</b>.`,

   `M = (4,297 ± 0,012 ± 0,040) × 10⁶ M☉ à R₀ = 8 277 ± 9 ± 30 pc (GRAVITY, 2022), par astrométrie
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
    $d^{2}u/d\\varphi^{2} + u = 3GMu^{2}/c^{2}$ avec u = 1/r ; le membre de droite est le terme purement
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
    — un diamètre de ~53 μas pour Sgr A* — d'où l'interférométrie à l'échelle du globe. Les sous-anneaux
    n ≥ 1, portant la lumière ayant bouclé un demi-tour de plus, sont espacés d'un facteur
    $e^{-\\pi} \\approx 0{,}043$ en flux et sont quasi insensibles à l'astrophysique du disque.
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
    $V = -\\dfrac{GM}{r} + \\dfrac{L^{2}}{2r^{2}} - \\dfrac{GML^{2}}{c^{2}r^{3}}$ : le terme en r⁻³ supprime le minimum en deçà.
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
    rotation à a* = 0,9, contre 4,36 à contresens. Presque quatre fois plus près d'un côté
    que de l'autre.
    <br><br>D'où le point qui change vraiment tout : si la matière tombe plus près avant
    de se stabiliser, elle libère bien plus d'énergie. Le rendement passe de <i>5,7 %</i>
    de la masse convertie en lumière à 16 % à a* = 0,9, et jusqu'à <b>42 %</b> à la
    limite extrême — quand la fusion nucléaire d'une étoile
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
    l'horizon. L'axe polaire, lui, ne porte plus de couture depuis que le moteur
    intègre en Kerr-Schild : ces coordonnées n'y sont pas singulières.`,
  ]
},
{
  id: "f-etoiles",
  titre: "Des étoiles autour de rien",
  sources: [
    ["gravity2021", "eht2022"],
    ["gravity2020", "gravity2021"],
    ["gillessen2017", "gravity2020", "gravity2021"],
  ],
  t: [
   `Recule. Recule encore. Le trou noir devient un point, puis plus rien du tout :
    il n'y a littéralement plus rien à voir au milieu de l'écran.
    <br><br>Les étoiles, elles, sont toujours là. Et elles <b>tournent</b>.
    Chacune décrit une longue boucle autour du même endroit vide. Une boucle comme
    ça s'appelle une <i>orbite</i> : c'est le chemin que suit un objet retenu par
    la gravité d'un autre. La Terre en décrit une autour du Soleil, la Lune une
    autour de la Terre. Il faut toujours quelque chose au milieu.
    <br><br>Sauf qu'ici, au milieu, il n'y a aucune étoile. Rien.
    Et c'est ce rien qui les tient.
    <br><br>Pour obtenir ce dessin, des astronomes ont photographié le même petit
    coin de ciel pendant <b>trente ans</b>. La découverte est là — pas dans la
    photo de 2022, qui est arrivée bien après.`,

   `Ce que tu regardes est un jeu d'ellipses partageant un <b>foyer</b>. Pas un
    centre : un foyer. Le point vide est décalé sur le grand axe, et ce décalage
    est déjà la signature d'une orbite képlérienne. À partir de là, deux mesures
    suffisent.
    <br><br>Suis une étoile sur une révolution complète, relève son demi-grand axe
    <i>a</i> et sa période <i>P</i>. La troisième loi de Kepler donne la masse au
    foyer, $P^{2} = 4\\pi^{2}a^{3}/GM$, qui perd toutes ses constantes si l'on compte
    <i>a</i> en unités astronomiques, <i>P</i> en années et <i>M</i> en masses
    solaires : $M = a^{3}/P^{2}$.
    <br><br>Pour S2, avec les valeurs publiées : demi-grand axe apparent 0,125″,
    soit 1 031 UA à 8 247 pc, et période 16,05 ans. Le calcul tient sur une ligne,
    $1031^{3}/16{,}05^{2} \\simeq 4{,}26 \\times 10^{6}$. Quatre millions et quart de
    soleils — et l'ajustement complet publié donne
    <b>4,261 ± 0,012 × 10⁶ M☉</b>. La loi de 1619 tombe juste au millième près.`,

   `Les éléments tracés viennent de <b>Gillessen et al. 2017</b>, tableau des
    quarante orbites : <i>a</i> en secondes d'arc, <i>e</i>, les trois angles
    <i>i</i>, Ω, ω, l'époque du périastre, la période. Ce sont des <b>éléments
    osculateurs</b> — l'orbite n'est képlérienne qu'au premier ordre et les
    paramètres valent pour une époque de référence, l'apocentre de 2010 chez
    GRAVITY.
    <br><br>La conversion angle → longueur passe par R₀, si bien que masse et
    distance sont corrélées, en $M \\propto R_{0}^{2}$ pour un ajustement
    astrométrique. C'est pourquoi les valeurs publiées se déplacent d'un article à
    l'autre sans qu'aucune soit fausse : G17 donne 4,28 ± 0,10 × 10⁶ M☉ à
    8,32 kpc, GRAVITY 2020 4,261 ± 0,012 à 8 246,7 pc, GRAVITY 2022
    4,297 ± 0,012 à 8 277 pc. <b>Ne jamais mélanger deux lignes de tableaux
    différents dans un même jeu d'éléments.</b>
    <br><br>L'ajustement moderne compte quatorze paramètres par étoile : six
    éléments orbitaux, R₀, M•, cinq coordonnées pour la position sur le ciel et la
    vitesse à trois dimensions de la masse relativement au repère astrométrique,
    et un paramètre sans dimension pour l'effet post-newtonien testé. En
    combinant quatre étoiles — S2, S29, S38, S55 — GRAVITY obtient
    $f_{SP} = 0{,}997 \\pm 0{,}144$, soit la précession relativiste mesurée à 14 %.`,
  ]
},
{
  id: "f-s2",
  titre: "S2, l'étoile témoin",
  sources: [
    ["gravity2018", "gillessen2017"],
    ["gravity2018", "gravity2020", "habibi2017"],
    ["gravity2020", "gravity2021"],
  ],
  t: [
   `Parmi les étoiles que tu vois tourner, une seule fait presque tout le
    travail : <b>S2</b>.
    <br><br>Elle a trois qualités et c'est rare de les avoir ensemble. Elle est
    parmi les plus brillantes du lot, donc facile à suivre dans un endroit très
    encombré. Elle boucle son tour en <i>seize ans</i> seulement — assez peu pour
    qu'un astronome en voie plusieurs dans une carrière. Et son orbite est très
    allongée : elle plonge tout près, puis repart très loin.
    <br><br>En mai 2018, elle est passée au plus près. À cent vingt fois la
    distance de la Terre au Soleil, filant à <b>7 650 kilomètres par seconde</b>,
    deux et demi pour cent de la vitesse de la lumière. Tout le monde regardait,
    et depuis seize ans.`,

   `S2 est une étoile jeune et chaude : type spectral B0 à B3 de la séquence
    principale, entre 8 et 14 masses solaires pour les étoiles S étudiées, un âge
    de l'ordre de <i>7 millions d'années</i>. Rien d'exotique. Ce qui compte, c'est
    son orbite : $e = 0{,}884$, période 16,05 ans, périastre à 120 UA, soit environ
    <b>1 400 rayons de Schwarzschild</b>.
    <br><br>À cette distance, la relativité générale cesse d'être une correction
    invisible. Au passage de 2018 on a mesuré le décalage vers le rouge attendu —
    la somme du décalage gravitationnel et de l'effet Doppler transverse, soit
    environ 200 km/s exprimés en vitesse. En paramétrant l'écart au newtonien par
    un facteur <i>f</i> valant 0 pour Newton et 1 pour Einstein, la mesure donne
    <i>f</i> = 0,90 ± 0,09 (stat.) ± 0,15 (syst.). Les données de S2 sont
    <b>incompatibles avec la dynamique newtonienne pure</b>.
    <br><br>Deux ans plus tard, la précession du périastre : le grand axe de
    l'ellipse pivote de <i>12 minutes d'arc par révolution</i>. L'orbite ne se
    referme pas sur elle-même — elle dessine lentement une rosette.`,

   `Ajustement à quatorze paramètres, éléments osculateurs rapportés à l'apocentre
    de 2010. GRAVITY 2020, sur les données jusqu'à fin 2019 : $a = 125{,}058 \\pm
    0{,}041$ mas, $e = 0{,}884649$, $P = 16{,}0455 \\pm 0{,}0013$ an,
    $t_{p} = 2018{,}379$, $f_{SP} = 1{,}10 \\pm 0{,}19$ — la précession de
    Schwarzschild détectée, $\\Delta\\varphi \\simeq 12'$ par période.
    <br><br>Le jeu de données de S2 couvre <b>1992,2 à 2021,6</b> : 128 positions
    astrométriques NACO, 92 spectres SINFONI, 82 positions GRAVITY, plus 3 spectres
    Keck, 2 NACO et 4 GNIRS/Gemini. Trois techniques, une seule orbite.
    <br><br>Ce que ça contraint : M• et R₀, corrélés ; les termes post-newtoniens
    d'ordre 1, décalage gravitationnel ($f = 0{,}90 \\pm 0{,}09 \\pm 0{,}15$ en 2018,
    puis $1{,}04 \\pm 0{,}05$) et précession du périastre ; et une borne sur toute
    masse étendue à l'intérieur de l'orbite. Ce que ça ne contraint pas : le
    <b>spin</b>. Il ne figure dans aucun de ces ajustements — le modèle à quatorze
    paramètres n'en comporte pas de terme. La géométrie de Kerr n'est pas testée
    par les orbites stellaires ; c'est un autre instrument qui s'en charge.`,
  ]
},
{
  id: "f-preuve",
  titre: "Pourquoi ça ne peut pas être autre chose",
  sources: [
    ["schoedel2003", "maoz1998"],
    ["genzel2010", "maoz1998", "gravity2021"],
    ["genzel2010", "maoz1998", "schoedel2003", "gravity2021"],
  ],
  t: [
   `« Quatre millions de soleils dans un tout petit espace. » D'accord — mais
    pourquoi un trou noir ? Pourquoi pas simplement <i>beaucoup d'étoiles</i>,
    serrées, trop sombres pour qu'on les voie d'ici ?
    <br><br>Parce qu'un tas d'objets aussi serré <b>ne tient pas</b>. Ils se
    frôlent, se percutent, s'échangent de la vitesse au passage : les uns sont
    éjectés vers l'extérieur, les autres tombent vers le centre. Le tas se vide et
    s'effondre. On sait calculer en combien de temps, et la réponse est
    <b>moins de cent mille ans</b>.
    <br><br>Cent mille ans, à l'échelle d'une galaxie qui en a dix milliards, c'est
    un battement de cils. Il faudrait que nous soyons tombés pile au bon moment
    pour l'observer. Personne ne mise là-dessus.`,

   `L'argument est une <b>élimination</b>, pas une observation directe. On mesure
    une masse et un volume, donc une densité, et l'on demande ce qui peut soutenir
    cette densité-là.
    <br><br>Les mouvements propres détectés entre 1996 et 1998 — de l'ordre de
    1 000 km/s sur 0,02 parsec — imposaient déjà 10¹² masses solaires par parsec
    cube, ce qui bornait la durée de vie d'un amas d'objets sombres à 10⁷-10⁸ ans.
    Le suivi des orbites depuis 2002, S2 en tête, a gagné <i>quatre ordres de
    grandeur</i> : environ 10¹⁶ M☉/pc³. À cette densité, un amas de naines brunes,
    de naines blanches, d'étoiles à neutrons, de trous noirs stellaires ou même de
    cailloux est détruit par relaxation et par collisions — effondrement du cœur,
    évaporation — en <b>quelques centaines de milliers d'années</b>.
    <br><br>Il y a mieux depuis. En combinant quatre étoiles, GRAVITY montre que le
    potentiel est celui d'une <i>masse ponctuelle unique</i> : toute masse étendue
    supplémentaire jusqu'à 230 millisecondes d'arc est limitée à
    <b>3 000 masses solaires</b>, un millième du total.`,

   `Chronologie de l'exclusion. 1996-1998 : les mouvements propres des étoiles S,
    de l'ordre de $10^{3}$ km/s à l'échelle de 0,02 pc, imposent
    $\\rho \\gtrsim 10^{12}\\,M_{\\odot}\\,\\mathrm{pc}^{-3}$ ; à cette densité un amas
    collisionnel vit $\\sim 10^{7-8}$ ans (Maoz 1998). Les orbites, à partir de
    2002, gagnent quatre ordres de grandeur,
    $\\sim 10^{16}\\,M_{\\odot}\\,\\mathrm{pc}^{-3}$, et la durée de vie tombe sous
    quelques $10^{5}$ ans — une fraction infime de la durée de vie des étoiles du
    cusp central. Schödel et al. 2003 posent le même argument sous forme de modèle
    de Plummer : la densité centrale devrait excéder
    $2{,}2 \\times 10^{17}\\,M_{\\odot}\\,\\mathrm{pc}^{-3}$.
    <br><br>Les alternatives non collisionnelles demandent un autre traitement.
    Une <b>boule de fermions</b> dégénérés qui rendrait compte de <i>toutes</i> les
    concentrations sombres des noyaux de galaxies est exclue ; une <b>étoile à
    bosons</b> finirait de toute façon par s'effondrer en trou noir en accrétant le
    gaz et la poussière du centre galactique.
    <br><br>État actuel : profil de Plummer de longueur d'échelle 0,3″ ajusté
    conjointement au reste, $M_{\\mathrm{ext}} \\lesssim 3\\,000\\,M_{\\odot}$ jusqu'à
    230 mas ; l'excès de masse sur M• n'apparaît qu'au-delà de
    $r \\gtrsim 2{,}5''$, en accord avec la distribution stellaire attendue. Aucune
    composante de matière noire ni trou noir de masse intermédiaire au-dessus de
    $10^{3}\\,M_{\\odot}$ n'est requise ni compatible avec les données. Ce qui reste
    non tranché par cette voie, c'est l'existence d'un <i>horizon</i> : les orbites
    contraignent une masse et une compacité, pas une surface de non-retour.`,
  ]
},
{
  id: "f-nobel",
  titre: "Trente ans pour une preuve",
  sources: [
    // Ghez 1998 est le travail du Keck dont ce niveau parle : c'est la source
    // de l'affirmation « deux équipes qui ne partageaient rien ».
    ["nobel2020", "penrose1965", "ghez1998"],
    ["gravity2021", "gravity2018", "genzel2010"],
    ["gravity2021", "nobel2020", "penrose1965", "eht2022"],
  ],
  t: [
   `Le prix Nobel de physique 2020 a récompensé exactement ce raisonnement.
    <br><br>Une moitié est allée à <b>Reinhard Genzel</b> et <b>Andrea Ghez</b>, un
    quart chacun, « <i>pour la découverte d'un objet compact supermassif au centre
    de notre galaxie</i> ». Deux équipes qui ne partageaient rien : l'une mesurait
    au VLT de l'ESO, au Chili, l'autre au télescope Keck, à Hawaï. Elles ont suivi
    les mêmes étoiles pendant trente ans, chacune de son côté, sans se croire sur
    parole — et sont tombées d'accord.
    <br><br>L'autre moitié est allée à <b>Roger Penrose</b>, et il ne faut surtout
    pas confondre : son travail n'a rien à voir avec ces mesures. Il avait
    démontré en 1965, avec du papier et un crayon, que la formation d'un trou noir
    est une <i>conséquence inévitable</i> de la théorie d'Einstein. Lui n'a rien
    observé. Il a montré que ça devait exister.`,

   `Ce qu'il a fallu, techniquement, pour que ce dessin existe.
    <br><br>Au début, la turbulence de l'atmosphère limitait les images à
    <i>0,4-0,5 seconde d'arc</i> de largeur : à cette résolution le centre
    galactique est une bouillie et les étoiles S sont confondues les unes avec les
    autres. L'<b>optique adaptative</b> — un miroir déformable qui corrige la
    turbulence en temps réel — a fait descendre les télescopes de la classe
    8 à 10 mètres à <i>50-60 millisecondes d'arc</i>, avec une position mesurée à
    300-500 microsecondes d'arc près.
    <br><br>Puis l'<b>interférométrie</b>. On combine la lumière des quatre
    télescopes du VLT, et l'ensemble sépare comme le ferait un miroir aussi large
    que leur écartement. C'est GRAVITY, en service depuis 2016 : un lobe de
    <i>2 × 4 millisecondes d'arc</i>, et des positions à
    <b>30-100 microsecondes d'arc</b>. Un facteur dix gagné sur la précision —
    juste à temps pour le périastre de mai 2018.`,

   `Le gain instrumental, chiffré. Imagerie limitée par le <i>seeing</i> :
    0,4-0,5″ de largeur à mi-hauteur. Optique adaptative sur classe 8-10 m :
    50-60 mas, astrométrie 300-500 μas. GRAVITY/VLTI : lobe de 2 × 4 mas,
    astrométrie 30-100 μas, sensibilité $m_{K} = 20$ en cumulant les données d'une
    nuit.
    <br><br>La <b>spectroscopie</b> n'est pas un supplément d'âme. L'astrométrie
    seule donne une orbite en unités d'angle ; c'est la vitesse radiale, en
    kilomètres par seconde, qui fournit l'échelle physique et permet d'extraire
    R₀ conjointement à M•. Sans elle, l'orbite reste dégénérée le long de la ligne
    de visée — et c'est précisément pourquoi certaines étoiles du tableau de
    Gillessen, S55 par exemple, sont moins bien contraintes que leur courte période
    ne le laisserait croire.
    <br><br>Nobel 2020 : une moitié à Penrose pour le <b>théorème de singularité</b>
    de 1965, résultat théorique sans rapport avec l'astrométrie infrarouge ; un
    quart à Genzel, un quart à Ghez, pour la découverte d'un objet compact
    supermassif au centre de notre galaxie. La formulation officielle dit bien
    « <i>objet compact supermassif</i> », et non « trou noir ». Le comité a été
    prudent, et il avait raison de l'être : les orbites contraignent une masse et
    une densité, pas un horizon. L'horizon, c'est l'affaire de l'EHT, deux ans
    plus tard.`,
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
    l'intégration de $\\mathbf{a} = -\\tfrac{3}{2}h^{2}\\mathbf{r}/r^{5}$ avec $h = \\lVert\\mathbf{r}\\times\\dot{\\mathbf{r}}\\rVert$, équivalente à la Binet $d^{2}u/d\\varphi^{2} + u = 3Mu^{2}$ :
    d'où sphère des photons à 1,5 r<sub>s</sub>, ombre à √27/2, images d'ordre n,
    Ω képlérien en r<sup>−3/2</sup>, et la période orbitale du photon 6√3·πGM/c³.<br><br>
    <b>Approximé</b> — le disque, pas la géométrie : la rotation est disponible et
    branchée sur Kerr, avec la réserve sur l'axe polaire décrite plus bas.
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

/* La note de la rédaction.

   Le dossier promettait depuis le début « et ce qui, dedans, ne l'est pas »,
   sans jamais le dire. Voici la liste, et elle est classée en trois — parce que
   « c'est faux » recouvre trois choses très différentes, et que les confondre
   est précisément ce qui rend un site invérifiable :

   ce qu'on a CHOISI d'écarter pour que ce soit jouable ;
   ce que la science IGNORE encore ;
   ce que notre calcul, lui, ne fait pas bien.

   Elle s'affiche aux trois niveaux de lecture : ce n'est pas du contenu
   avancé, c'est le contrat. */
notes: {
  titre: "Note de la rédaction",
  chapeau: "Tout le reste du site est calculé. Voici les endroits où il ne l'est pas, ou pas complètement.",
  groupes: [
    {
      titre: "Ce qu'on a écarté exprès",
      chapeau: "Des choix assumés, pour que ce soit jouable ou lisible.",
      points: [
        { id:"gravite-vaisseau", ou:"salon",
          aveu:"La gravité du salon est magique : en orbite, on devrait flotter.",
          t:"<b>La gravité dans le vaisseau.</b> On est en orbite : on devrait flotter, et tout ce qui n'est pas fixé aussi. Un salon en apesanteur étant injouable, nous avons décidé que la gravité y était magique. C'est la seule chose du vaisseau qui viole franchement la physique, et c'est volontaire." },
        { id:"temps-accelere", ou:"reglage-temps",
          aveu:"Le temps est accéléré. Le premier cran du réglage est le temps réel.",
          t:"<b>Le temps accéléré.</b> À l'échelle réelle, un tour d'orbite dure des heures et il ne se passe rien à l'écran. Chaque cran du réglage annonce son facteur, et le premier est le temps réel — celui où presque tout s'immobilise." },
        { id:"taille-sondes", ou:"reglages",
          aveu:"Les sondes sont grossies pour exister à l'écran.",
          t:"<b>La taille des sondes.</b> Un vaisseau réel ferait quelques millionièmes de pixel. On les grossit pour qu'elles existent, et le réglage laisse le choix plutôt que d'imposer une taille." },
        { id:"rotation-couteuse", ou:"etude",
          aveu:"La rotation coûte neuf fois plus de calcul. Elle n'existe qu'ici.",
          t:"<b>Pourquoi seul ce trou noir tourne.</b> Faire tourner l'espace-temps oblige à intégrer les rayons dans une géométrie où plus rien n'est symétrique : chaque image coûte environ neuf fois celle d'un trou noir immobile. Les trous noirs de présentation restent donc figés, et la rotation vit ici, à ce poste, où l'on vient exprès et où le coût se paie volontairement." },
        { id:"rythme-voyage", ou:"reglages",
          aveu:"Le défilement du voyage a deux rythmes : l'un fidèle, l'autre adouci.",
          t:"<b>Le rythme du voyage.</b> Vu du hublot, un vaisseau qui s'éloigne rétrécit très vite au début puis de plus en plus lentement — doubler une petite distance change tout, doubler une grande ne change presque rien. C'est fidèle, et c'est inégal. Le second rythme répartit le défilement pour qu'on parte doucement, qu'on file au milieu du trajet et qu'on ralentisse à l'arrivée. Dans les deux cas, la vitesse et le décalage temporel affichés restent ceux de la position réelle : seule la cadence est retouchée." },
        { id:"moteur-1g", ou:"telescope",
          aveu:"Le moteur à un g est accordé. Personne ne sait le construire.",
          t:"<b>Le moteur à un g.</b> Personne ne sait le construire, et rien ne s'en approche. On l'accorde pour pouvoir voyager — mais le télescope affiche ce qu'il coûterait vraiment en carburant, et le chiffre est écrasant." },
        { id:"texture-radio", ou:"spectre",
          aveu:"La texture du disque est un effet d'apparence, pas un transfert radiatif.",
          t:"<b>La texture du disque en ondes radio.</b> C'est un effet d'apparence, pas un calcul de transfert radiatif. Les tailles, elles, viennent des mesures : à trois centimètres de longueur d'onde, la région qui émet atteint bien trente-sept rayons." },
        { id:"quadrillage-recul", ou:"recul",
          aveu:"Rien ne quadrille l'espace. Ce repère n'existe que pendant le mouvement.",
          t:"<b>Le quadrillage pendant le recul.</b> Rien ne quadrille l'espace. Il n'existe que pendant le mouvement, parce que dans le vide absolu rien ne prouve qu'on avance — et sans lui, quatre décades ressemblent à un écran figé." },
        { id:"carte-etoiles", ou:"arrivee",
          aveu:"C'est une reconstruction, pas une vue : personne n'a vu ces orbites tourner.",
          t:"<b>La carte des étoiles S.</b> C'est une reconstruction, pas une vue. Ces orbites durent de seize à trois cent trente et un ans : personne ne les a jamais vues tourner. On les a mesurées pendant trente ans, et c'est justement le sujet." },
        { id:"decor-personnages", ou:"salon",
          aveu:"Le vaisseau et les gens sont dessinés, pas mesurés.",
          t:"<b>Le décor et les personnages.</b> Tout est calculé, rien n'est importé — mais un vaisseau et des gens ne sont pas des mesures." },
        { id:"fond-ciel", ou:"partout",
          aveu:"Le fond est faux, sa déformation est juste.",
          t:"<b>Le fond du ciel.</b> Les étoiles y sont posées au hasard, et la nébuleuse mauve est un décor : ce ne sont ni des positions relevées ni un rayonnement calculé. Ce qu'on verrait vraiment depuis là-bas serait d'ailleurs plus impressionnant — on est à l'intérieur de l'amas nucléaire, des millions d'étoiles en quelques années-lumière. Ce qui est exact dans cette image, c'est la façon dont la gravité en dévie la lumière : le fond est faux, sa déformation est juste." },
      ],
    },
    {
      titre: "Ce que personne ne sait",
      chapeau: "Des inconnues réelles, qui ne tiennent pas à nous.",
      points: [
        "<b>La rotation de Sagittarius A*.</b> Elle n'est pas mesurée. Les quatre valeurs proposées dans les réglages sont des hypothèses, pas des observations, et le panneau le dit à chaque fois. C'est pourquoi il existe à côté un trou noir d'étude, où les hypothèses sont chez elles.",
        "<b>L'orientation en profondeur de l'essaim d'étoiles.</b> Leurs positions sur le ciel sont solides. Le sens de la profondeur, lui, dépend d'une convention que les articles citent sans la réécrire, et départager les deux lectures demanderait une donnée que nous n'avons pas su retrouver. La vue n'indique donc aucune direction vers la Terre et ne marque aucun côté proche : l'écart, s'il existe, n'est pas visible.",
      ],
    },
    {
      titre: "Ce que notre calcul fait mal",
      chapeau: "Nos limites à nous, pas celles de la physique.",
      points: [
        "<b>Les écrans du bord sont dessinés à plat.</b> Ils n'ont pas de perspective véritable, et rien ne passe devant eux.",
        "<b>Le disque s'arrête à onze rayons.</b> Un vrai flot d'accrétion s'étend beaucoup plus loin, mais sa partie externe est froide et sombre ; la couper là coûte peu à l'image et beaucoup moins cher à calculer.",
        "<b>Le puits est trop profond tout près du bord.</b> La lumière, elle, suit les vraies géodésiques. Mais les sondes sont calculées avec un raccourci : la gravité de Newton plus un terme correctif. Ce raccourci est excellent — il retrouve exactement la dernière orbite stable, et exactement l'avance du périastre qu'on a mesurée sur l'étoile S2. Sa limite est ailleurs : sous deux rayons, il faudrait dépasser la vitesse de la lumière pour repartir, alors que la vraie réponse est un rayon. Autrement dit, entre un et deux rayons, nos sondes sont prisonnières un peu trop tôt.",
      ],
    },
  ],
},

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
   <li>Le rayon apparent de l'ombre : $\\sqrt{27}/2 \\approx 2{,}598$</li>
   <li>La déflexion à grande distance : $\\alpha = 4GM/c^{2}b$</li>
   <li>La dernière orbite stable pour la matière : <i>3</i> rayons</li>
 </ul>
 <p>Le troisième est le plus parlant. Newton <b>aussi</b> prédisait une déviation de la
 lumière — mais deux fois plus faible. C'est ce facteur 2 qu'Eddington est allé mesurer
 pendant l'éclipse de 1919, et qui a rendu Einstein célèbre en une nuit. Si le moteur
 de cette page donnait la valeur newtonienne, il serait faux, et le banc d'essai
 ci-dessous te le montrerait.</p>

 <h3>La limite, dite franchement</h3>
 <p>L'optique est exacte ; l'astrophysique ne l'est pas. Le disque est une texture
 plausible, pas une simulation d'écoulement de plasma.</p>
 <p>La rotation, elle, <b>est</b> simulée : le curseur de spin bascule sur la métrique de
 Kerr, l'ombre se décentre et l'ISCO se déplace. Elle a longtemps porté une fine couture sur
 l'axe de rotation — un défaut des coordonnées employées, non du calcul. Le moteur
 intègre désormais en Kerr-Schild, où cet axe n'a rien de singulier, et elle a disparu.</p>`,

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
 que le GLSL, mais un pas vingt à cent fois plus fin et un plafond porté à deux millions
 de pas au lieu de 240 : il mesure
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
   <li><b>Spin — partiellement simulé.</b> Deux moteurs cohabitent et l'on branche sur
       la valeur de <i>a</i>. À a = 0, l'intégration cartésienne de Schwarzschild, sans
       aucune singularité de coordonnées. À a ≠ 0, un hamiltonien en Kerr-Schild cartésien : frame-dragging, ergosphère, ISCO déplacée et asymétrie
       prograde/rétrograde sont alors présents. La validation porte sur
       l'<i>asymétrie</i> du paramètre d'impact critique — 2,30 mesuré contre 2,40 attendu
       à a* = 0,9 — et non sur les valeurs absolues, le plancher de la mesure par pixels
       étant de 5 à 7 %. L'axe polaire ne porte plus de couture : le passage en Kerr-Schild a été fait, et
       ces coordonnées n'y sont pas singulières. Mesuré avant et après sur la même
       caméra, la discontinuité sur l'axe tombe de 78-310 niveaux à 2-26.</li>
   <li><b>La photosphère radio.</b> Son rayon suit une loi tirée des mesures — le
       flux devient opaque à grande longueur d'onde, et c'est pour cette raison
       que l'ombre est inobservable en radio et que l'Event Horizon Telescope
       travaille à 1,3 mm. En revanche son <i>aspect</i> est composé :
       l'assombrissement centre-bord est celui d'une sphère lumineuse, mais la
       moucheture qui l'anime est un bruit déterministe, pas une carte de
       brillance mesurée. Elle sert à faire comprendre qu'on regarde à travers
       un gaz plutôt qu'un aplat de peinture. Rien n'est prédit là-dedans.</li>
   <li><b>Transfert radiatif.</b> Émissivité ad hoc en bruit fractal, absorption grossière.
       Pas d'opacité, pas de synchrotron, pas de comptonisation. Un rendu publiable part
       d'un GRMHD (KHARMA, BHAC) post-traité par un code de transfert (ipole, RAPTOR).</li>
   <li><b>Géométrie du disque.</b> Mince et plan, alors qu'un RIAF comme Sgr A* est
       géométriquement épais, H/R ~ 1.</li>
   <li><b>Doppler.</b> <code>D = 1/(1 − β·n̂)</code> sans le facteur γ. L'erreur sur
       l'intensité allant en D³, l'erreur d'amplitude est d'ordre γ³−1 ≈ 32 % au bord
       interne : l'asymétrie qualitative est
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
