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
};
