/* ============================================================================
   Single source of truth for the site's content — English.

   Twin of contenu.fr.js: same structure, same ids, same source keys.
   An `id` is the SAME in every language. It is what says "this sentence and
   its translation are the same sentence".

   Three consumers read this file:
     - index.html          for display
     - outils/voix.py      to generate Lumen's MP3s (the `id`s are the file
                           names, they must never change)
     - outils/sources.py   to produce SOURCES.md and allow auditing

   Rule: no factual claim may live anywhere but this file, and each one must
   carry at least one `sources` key.
   ============================================================================ */

window.CONTENU = {

// The language of this file. It is used for the voice path, and one day it
// will tell the page which set of texts it has loaded.
langue: "en",


// ---------------------------------------------------------------- references
sources: {
  gravity2021: {
    ref: "GRAVITY Collaboration (Abuter et al.), “The mass distribution in the Galactic Centre from interferometric astrometry of multiple stellar orbits”, Astronomy & Astrophysics 657, L12 (2022)",
    doi: "10.1051/0004-6361/202142465",
    sert: "Mass of Sgr A* (4.297 × 10⁶ M☉) and distance (8,277 pc)",
  },
  gravity2020: {
    ref: "GRAVITY Collaboration, “Detection of the Schwarzschild precession in the orbit of the star S2”, Astronomy & Astrophysics 636, L5 (2020)",
    doi: "10.1051/0004-6361/202037813",
    sert: "Schwarzschild precession of S2, ~12′ per orbit",
  },
  gravity2018: {
    ref: "GRAVITY Collaboration, “Detection of the gravitational redshift in the orbit of the star S2”, Astronomy & Astrophysics 615, L15 (2018)",
    doi: "10.1051/0004-6361/201833718",
    sert: "Gravitational redshift measured at the 2018 pericenter passage; speed of S2 at pericenter",
  },
  eht2022: {
    ref: "Event Horizon Telescope Collaboration, “First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way”, ApJL 930, L12 (2022)",
    doi: "10.3847/2041-8213/ac6674",
    sert: "Image of Sgr A*, ring diameter 51.8 ± 2.3 μas, inclination constraints",
  },
  eht2019: {
    ref: "Event Horizon Telescope Collaboration, “First M87 Event Horizon Telescope Results. V. Physical Origin of the Asymmetric Ring”, ApJL 875, L5 (2019)",
    doi: "10.3847/2041-8213/ab0f43",
    sert: "Doppler asymmetry as an indicator of the direction of rotation of M87*",
  },
  nobel2020: {
    ref: "2020 Nobel Prize in Physics, Reinhard Genzel and Andrea Ghez, “for the discovery of a supermassive compact object at the centre of our galaxy”",
    url: "https://www.nobelprize.org/prizes/physics/2020/summary/",
    sert: "Award of the 2020 Nobel Prize for the stellar monitoring of the galactic center",
  },
  schwarzschild1916: {
    ref: "K. Schwarzschild, “Über das Gravitationsfeld eines Massenpunktes nach der Einsteinschen Theorie”, Sitzungsberichte der Königlich Preussischen Akademie der Wissenschaften (1916), 189-196",
    url: "https://arxiv.org/abs/physics/9905030",
    sert: "Schwarzschild metric, radius r_s = 2GM/c²",
  },
  dyson1920: {
    ref: "F. W. Dyson, A. S. Eddington, C. Davidson, “A Determination of the Deflection of Light by the Sun's Gravitational Field, from Observations Made at the Total Eclipse of May 29, 1919”, Phil. Trans. R. Soc. A 220, 291-333 (1920)",
    doi: "10.1098/rsta.1920.0009",
    sert: "Measurement of the 1.75″ deflection at the solar limb, twice the Newtonian value",
  },
  bardeen1972: {
    ref: "J. M. Bardeen, W. H. Press, S. A. Teukolsky, “Rotating Black Holes: Locally Nonrotating Frames, Energy Extraction, and Scalar Synchrotron Radiation”, ApJ 178, 347 (1972)",
    doi: "10.1086/151796",
    sert: "ISCO at 6GM/c² (Schwarzschild), GM/c² (extremal prograde Kerr), 9GM/c² (retrograde); efficiencies 5.7% and 42%",
  },
  bardeen1973: {
    ref: "J. M. Bardeen, “Timelike and null geodesics in the Kerr metric”, in Black Holes (Les Houches 1972), DeWitt & DeWitt (eds.), Gordon & Breach (1973)",
    url: "https://inspirehep.net/literature/1361769",
    sert: "Apparent radius of the shadow, critical impact parameter b_c = √27 GM/c²",
  },
  luminet1979: {
    ref: "J.-P. Luminet, “Image of a spherical black hole with thin accretion disk”, Astronomy & Astrophysics 75, 228-235 (1979)",
    url: "https://inspirehep.net/literature/1730378",
    sert: "First computed image of a thin-disk black hole: secondary image, Doppler asymmetry",
  },
  gralla2019: {
    ref: "S. E. Gralla, D. E. Holz, R. M. Wald, “Black hole shadows, photon rings, and lensing rings”, Physical Review D 100, 024018 (2019)",
    doi: "10.1103/PhysRevD.100.024018",
    sert: "Shadow / photon ring distinction; spacing of order-n subrings as e^(−π)",
  },
  shakura1973: {
    ref: "N. I. Shakura, R. A. Sunyaev, “Black holes in binary systems. Observational appearance”, Astronomy & Astrophysics 24, 337-355 (1973)",
    url: "https://inspirehep.net/literature/73651",
    sert: "Thin disk model, α viscosity",
  },
  balbus1991: {
    ref: "S. A. Balbus, J. F. Hawley, “A powerful local shear instability in weakly magnetized disks. I”, ApJ 376, 214 (1991)",
    doi: "10.1086/170270",
    sert: "Magnetorotational instability (MRI) as the source of the effective viscosity",
  },
  yuan2014: {
    ref: "F. Yuan, R. Narayan, “Hot Accretion Flows Around Black Holes”, Annual Review of Astronomy and Astrophysics 52, 529-588 (2014)",
    doi: "10.1146/annurev-astro-082812-141003",
    sert: "RIAF/ADAF regime, Sgr A* extremely underluminous, geometrically thick disk H/R ~ 1",
  },
  penrose1965: {
    ref: "R. Penrose, “Gravitational Collapse and Space-Time Singularities”, Physical Review Letters 14, 57 (1965)",
    doi: "10.1103/PhysRevLett.14.57",
    sert: "Singularity theorem; 2020 Nobel Prize shared for this result",
  },
  amps2013: {
    ref: "A. Almheiri, D. Marolf, J. Polchinski, J. Sully, “Black holes: complementarity or firewalls?”, JHEP 2013, 62 (2013)",
    doi: "10.1007/JHEP02(2013)062",
    sert: "The firewall argument at the horizon",
  },
  penington2020: {
    ref: "G. Penington, “Entanglement wedge reconstruction and the information paradox”, JHEP 2020, 2; and A. Almheiri et al., “The entropy of bulk quantum fields and the entanglement wedge of an evaporating black hole”, JHEP 2019, 63",
    doi: "10.1007/JHEP09(2020)002",
    sert: "Page curve reconstructed from quantum extremal surfaces (islands)",
  },
  birkhoff1923: {
    ref: "G. D. Birkhoff, Relativity and Modern Physics, Harvard University Press (1923), p. 253",
    url: "https://openlibrary.org/works/OL22104343W",
    sert: "Birkhoff's theorem: outside a spherical distribution, the metric depends only on M",
  },
  chandrasekhar1983: {
    ref: "S. Chandrasekhar, The Mathematical Theory of Black Holes, Oxford University Press (1983), chap. 3",
    url: "https://openlibrary.org/works/OL3267036W",
    sert: "Geodesic equation (Binet form) for Schwarzschild, photon sphere at 3GM/c²",
  },
  kerr1963: {
    ref: "R. P. Kerr, “Gravitational Field of a Spinning Mass as an Example of Algebraically Special Metrics”, Physical Review Letters 11, 237 (1963)",
    doi: "10.1103/PhysRevLett.11.237",
    sert: "Kerr metric: the solution describing a rotating black hole",
  },
  lense1918: {
    ref: "J. Lense, H. Thirring, Physikalische Zeitschrift 19, 156 (1918); measurement around the Earth: C. W. F. Everitt et al., “Gravity Probe B: Final Results of a Space Experiment to Test General Relativity”, Physical Review Letters 106, 221101 (2011)",
    doi: "10.1103/PhysRevLett.106.221101",
    sert: "Frame dragging by a rotating mass, predicted in 1918 and measured around the Earth in 2011",
  },
  penrose1969: {
    ref: "R. Penrose, “Gravitational Collapse: The Role of General Relativity”, Rivista del Nuovo Cimento 1, 252 (1969)",
    doi: "10.1023/A:1016578408204",
    sert: "Extraction of rotational energy from the ergosphere (Penrose process)",
  },
  blandford1977: {
    ref: "R. D. Blandford, R. L. Znajek, “Electromagnetic extraction of energy from Kerr black holes”, MNRAS 179, 433-456 (1977)",
    doi: "10.1093/mnras/179.3.433",
    sert: "Mechanism powering the jets: magnetic extraction of rotational energy",
  },
  yuan2003: {
    ref: "F. Yuan, E. Quataert, R. Narayan, “Nonthermal Electrons in Radiatively Inefficient Accretion Flow Models of Sagittarius A*”, ApJ 598, 301 (2003)",
    doi: "10.1086/378716",
    sert: "Spectral energy distribution of Sgr A*: radio rise, submillimeter peak, infrared trough, X-ray bump",
  },
  genzel2010: {
    ref: "R. Genzel, F. Eisenhauer, S. Gillessen, “The Galactic Center massive black hole and nuclear star cluster”, Reviews of Modern Physics 82, 3121 (2010)",
    doi: "10.1103/RevModPhys.82.3121",
    sert: "Review of the galactic center: SED, infrared and X-ray flares, bolometric luminosity ~10⁻⁹ L_Edd",
  },
  balick1974: {
    ref: "B. Balick, R. L. Brown, “Intense sub-arcsecond structure in the galactic center”, ApJ 194, 265 (1974)",
    doi: "10.1086/153242",
    sert: "Discovery of Sgr A* at radio wavelengths, in 1974",
  },
  bussard1960: {
    ref: "R. W. Bussard, “Galactic Matter and Interstellar Flight”, Astronautica Acta 6, 179-194 (1960)",
    sert: "Interstellar ramjet: scoop up hydrogen from the interstellar medium, fuse it, throw it out the back — so you never carry your own fuel",
  },
  zubrin1989: {
    ref: "D. G. Andrews, R. M. Zubrin, “Magnetic Sails and Interstellar Travel”, Journal of the British Interplanetary Society 43, 265-272 (1990); see also A. Bond, JBIS 27, 674 (1974)",
    sert: "The ramjet's magnetic scoop produces more drag than thrust: the concept brakes instead of accelerating",
  },
  dyson1968: {
    ref: "F. J. Dyson, “Interstellar Transport”, Physics Today 21, 10, 41-45 (1968); and A. Bond et al., “Project Daedalus”, JBIS Supplement (1978)",
    doi: "10.1063/1.3034534",
    sert: "Pulsed nuclear propulsion (Orion) and pulsed fusion (Daedalus): the only concepts on an engineering scale, ~3 to 12% of c",
  },
  misner1973: {
    ref: "C. W. Misner, K. S. Thorne, J. A. Wheeler, Gravitation, W. H. Freeman (1973), §25 and §31",
    url: "https://openlibrary.org/works/OL4461077W",
    sert: "Tides going as M/r³, regular free fall through the horizon, maximum proper time πGM/c³",
  },
  gillessen2017: {
    ref: "S. Gillessen, P. M. Plewa, F. Eisenhauer, R. Sari, I. Waisberg, M. Habibi, O. Pfuhl, E. George, J. Dexter, S. von Fellenberg, T. Ott, R. Genzel, “An Update on Monitoring Stellar Orbits in the Galactic Center”, The Astrophysical Journal 837, 30 (2017)",
    doi: "10.3847/1538-4357/aa5c41",
    sert: "Orbital elements of the 40 S-stars; multi-star fit M = 4.28 ± 0.10 × 10⁶ M☉ at R₀ = 8.32 ± 0.07 kpc",
  },
  maoz1998: {
    ref: "E. Maoz, “Dynamical Constraints on Alternatives to Supermassive Black Holes in Galactic Nuclei”, The Astrophysical Journal 494, L181 (1998)",
    doi: "10.1086/311194",
    sert: "Maximum lifetime of a cluster of dark objects, set by relaxation and collisions",
  },
  schoedel2003: {
    ref: "R. Schödel, R. Genzel, T. Ott, A. Eckart, N. Mouawad, T. Alexander, “Stellar dynamics in the central arcsecond of our galaxy”, The Astrophysical Journal 596, 1015 (2003)",
    doi: "10.1086/378122",
    sert: "Dark cluster as a Plummer model: central density > 2.2 × 10¹⁷ M☉/pc³, lifetime < 10⁵ years; fermion ball and boson star ruled out",
  },
  ghez1998: {
    ref: "A. M. Ghez, B. L. Klein, M. Morris, E. E. Becklin, “High Proper-Motion Stars in the Vicinity of Sgr A*: Evidence for a Supermassive Black Hole at the Center of Our Galaxy”, The Astrophysical Journal 509, 678 (1998)",
    doi: "10.1086/306528",
    sert: "Diffraction-limited imaging at the Keck 10 m, 1995-1997: 90 stars, velocities up to 1,400 ± 100 km/s",
  },
  habibi2017: {
    ref: "M. Habibi, S. Gillessen, F. Martins, F. Eisenhauer et al., “Twelve Years of Spectroscopic Monitoring in the Galactic Center: The Closest Look at S-stars near the Black Hole”, The Astrophysical Journal 847, 120 (2017)",
    doi: "10.3847/1538-4357/aa876f",
    sert: "Stellar nature of the S-stars: spectral type B0-B3V, masses 8-14 M☉, age of S2 6.6 (+3.4 / −4.7) Myr",
  },

  /* The sky out there — the eight references of 9 August 2026. They serve the
     card “The sky out there” and the background-sky admission: the site used to
     show an invented background and say only that it was invented. It now says
     what is really there, and how we know. */
  gallegocano2018: {
    ref: "E. Gallego-Cano, R. Schödel, H. Dong, F. Nogueras-Lara, A. T. Gallego-Calvente, P. Amaro-Seoane, H. Baumgardt, “The distribution of old stars around the Milky Way's central black hole I: Star counts”, Astronomy & Astrophysics 609, A26 (2018)",
    doi: "10.1051/0004-6361/201730451",
    sert: "Deep star counts of the nuclear cluster: power-law cusp with exponent γ = 1.23 ± 0.05 out to 2-3 pc; flat profile of the bright giants below 0.3 pc",
  },
  schodel2018: {
    ref: "R. Schödel, E. Gallego-Cano, H. Dong, F. Nogueras-Lara, A. T. Gallego-Calvente, P. Amaro-Seoane, H. Baumgardt, “The distribution of stars around the Milky Way's central black hole II: Diffuse light from sub-giants and dwarfs”, Astronomy & Astrophysics 609, A27 (2018)",
    doi: "10.1051/0004-6361/201730452",
    sert: "Measured stellar density (2.3 ± 0.3) × 10⁷ M☉/pc³ at 0.01 pc from Sgr A*, i.e. 180 ± 20 M☉ within that radius; same exponent γ = 1.23 ± 0.05 from diffuse light",
  },
  schodel2009: {
    ref: "R. Schödel, D. Merritt, A. Eckart, “The nuclear star cluster of the Milky Way: proper motions and mass”, Astronomy & Astrophysics (2009)",
    doi: "10.1051/0004-6361/200810922",
    sert: "Extended stellar mass of the central parsec, 0.5 to 1.5 × 10⁶ M☉, from proper motions of more than six thousand stars",
  },
  fritz2011: {
    ref: "T. K. Fritz, S. Gillessen, K. Dodds-Eden, D. Lutz, R. Genzel, W. Raab, T. Ott, O. Pfuhl, F. Eisenhauer, F. Yusef-Zadeh, “Line derived infrared extinction towards the Galactic Center”, The Astrophysical Journal 737, 73 (2011)",
    doi: "10.1088/0004-637X/737/2/73",
    sert: "Extinction towards the Galactic Center A_Ks = 2.42 ± 0.10, extrapolated to A_V > 33; dust mostly in the Galactic disk, and A_Ks < 0.1 measured inside the central parsec",
  },
  paumard2006: {
    ref: "T. Paumard, R. Genzel, F. Martins, S. Nayakshin, A. M. Beloborodov, Y. Levin, S. Trippe, F. Eisenhauer, T. Ott, S. Gillessen, R. Abuter, J. Cuadra, T. Alexander, A. Sternberg, “The Two Young Star Disks in the Central Parsec of the Galaxy: Properties, Dynamics and Formation”, The Astrophysical Journal 643, 1011 (2006)",
    url: "https://arxiv.org/abs/astro-ph/0601268",
    sert: "About eighty young massive stars (OB and Wolf-Rayet) in the central parsec, in two disks aged 6 ± 2 million years",
  },
  ferriere2012: {
    ref: "K. Ferrière, “Interstellar gas within ~10 pc of Sgr A*”, Astronomy & Astrophysics (2012)",
    doi: "10.1051/0004-6361/201117181",
    sert: "Compilation of the gas at the centre: the Sgr A West minispiral (three arms, ~2.5 × 1 pc, electron densities from 10³ to 10⁵ cm⁻³), masses in the central cavity, and a factor-hundred disagreement on the mass of the circumnuclear disk",
  },
  lau2013: {
    ref: "R. M. Lau, T. L. Herter, M. R. Morris, E. E. Becklin, J. D. Adams, “SOFIA/FORCAST Imaging of the Circumnuclear Ring at the Galactic Center”, The Astrophysical Journal 775, 37 (2013)",
    doi: "10.1088/0004-637X/775/1/37",
    sert: "Circumnuclear disk: inner edge near 1.4 pc, dense clumps, dust at 65-85 K, inner edge structured like a classical HII region",
  },
  bovy2017: {
    ref: "J. Bovy, “Stellar Inventory of the Solar Neighborhood using Gaia DR1”, Monthly Notices of the Royal Astronomical Society 470, 1360 (2017)",
    doi: "10.1093/mnras/stx1277",
    sert: "Stellar density of the solar neighbourhood, 0.040 ± 0.002 M☉/pc³ — the yardstick for the density at the centre",
  },
},

// -------------------------------------------------------------------- levels
niveaux: ["Newcomer", "Curious", "Astrophysicist"],

// --------------------------------------------------------------------- voice
// `id` = file name: voix/<language>/<voice>/<id>.mp3. Never rename an id
// without regenerating, or the line goes silent.
voix: [
  { id:"remy", nom:"Rémy", modele:"fr-FR-RemyMultilingualNeural" },
],

// --------------------------------------------- electromagnetic spectrum
// The fact to get across: wavelength is what decides whether the shadow is
// visible. In the radio the accretion flow is opaque and forms a photosphere
// that blocks everything; towards the millimeter it turns transparent and the
// ring appears. That is the whole reason the EHT works at 1.3 mm.
//
// `sed`: spectral distribution, in [log₁₀(λ in m), log₁₀(νLν in erg/s)].
// Orders of magnitude after Yuan+2003 and the Genzel+2010 review.
spectre: {
  sed: [
    [-0.52, 33.5], [-1.52, 34.0], [-2.52, 34.7], [-2.89, 35.0],
    [-3.52, 35.5], [-4.00, 35.2], [-4.52, 34.0], [-5.66, 33.5],
    [-6.22, 32.5], [-7.00, 32.0], [-8.90, 33.3], [-9.90, 33.2],
    [-12.1, 31.0],
  ],
  // A beginner opening this tool lands on a slider and an unlabelled curve.
  // We explain first, and we only do it once.
  lecon: { niv:[
    `<b>Hold on a second — this is an astronomer's tool.</b>
     <br><br>What you call “light” is only a <i>very narrow window</i>.
     The same waves exist in longer and shorter versions: the radio waves in
     your car, the warmth you feel next to a fire, the X-rays at the hospital.
     Same thing, different lengths. Your eye picks up one tiny band of it;
     astronomers have instruments for all the others.
     <br><br>The <b>curve</b> below shows how much energy Sgr A* sends out at
     each wavelength. The higher it goes, the brighter it shines in that band.
     You are about to see something unsettling: it barely shines at all where
     your eye is looking.
     <br><br>The <b>buttons</b> are the wavelengths where something important
     happened. Each one tells you what.`,

    `The curve is the <b>spectral energy distribution</b> of Sgr A*: the energy
     emitted at each wavelength, as measured. It climbs in the radio, peaks in
     the submillimeter, collapses in the visible, and picks up again in X-rays.
     <br><br>The thing to keep: the <b>transparency</b> of the gas depends on
     wavelength. In the radio it is opaque and hides the shadow. That is why
     the EHT had to go all the way down to 1.3 mm.`,

    `SED of Sgr A* after Yuan, Quataert &amp; Narayan (2003) and the review by
     Genzel, Eisenhauer &amp; Gillessen (2010) — orders of magnitude in νLν.
     <br><br>The synchrotron photosphere is modeled with an apparent size
     scaling roughly as λ, anchored on the τ ~ 1 transition near 230 GHz.
     Colors outside the visible are conventional.`,
  ]},

  // Wavelengths where something happens, and why we stop there.
  reperes: [
    { nom:"3 cm", lg:-1.52, sous:"The discovery, 1974",
      pourquoi:`Balick and Brown find a tiny, fierce source here at the center
                of the Galaxy. All anyone sees is a smudge: at this wavelength the gas
                is <b>opaque</b>, and it hides everything going on underneath.`,
      sources:["balick1974"] },
    { nom:"1.3 mm", lg:-2.886, sous:"The eye of the Event Horizon Telescope",
      pourquoi:`The window. The gas turns <b>transparent</b> and the shadow finally shows.
                That single fact is why the EHT observes at this wavelength —
                and it took an interferometer the size of the Earth to resolve it.`,
      sources:["eht2022"] },
    { nom:"300 μm", lg:-3.52, sous:"The emission peak",
      pourquoi:`The top of the submillimeter bump: this is where Sgr A* radiates most.
                A well-fed black hole of this mass would shine mostly in the ultraviolet;
                this one, underfed, shines in a band the eye never notices.`,
      sources:["yuan2003"] },
    { nom:"2.2 μm", lg:-5.66, sous:"K band — the flares",
      pourquoi:`Quiet most of the time, then <b>flares</b> several times a day,
                up to a hundred times brighter. This is what the GRAVITY instrument
                watches, and it is how we came to see matter orbiting a few
                horizon radii out.`,
      sources:["gravity2018","genzel2010"] },
    { nom:"600 nm", lg:-6.22, sous:"The human eye",
      pourquoi:`Almost nothing. All that orange beauty in the pictures is a convention:
                at this wavelength, the black hole gives itself away only through the
                <b>bent starlight</b> behind it.`,
      sources:["yuan2003"] },
    { nom:"1 keV", lg:-8.9, sous:"Chandra",
      pourquoi:`Faint emission, but <b>far more spread out</b> than the black hole:
                it comes from gas captured a long way out, thousands of radii away.
                Plus flares. Here Sgr A* is a million times too dim for its mass.`,
      sources:["genzel2010","yuan2014"] },
  ],
  bandes: [
    { id:"radio",   nom:"Radio waves",  min:-2.0,  max:0.5,
      note:`This is where it was <b>discovered</b>, in 1974. But the gas is opaque here:
            it forms a photosphere that hides the shadow completely.`,
      sources:["balick1974","yuan2003"] },
    { id:"submm",   nom:"Submillimeter", min:-3.3, max:-2.0,
      note:`The <b>emission peak</b>, and the Event Horizon Telescope's window at 1.3 mm.
            The gas turns transparent: it is the only band where the ring appears.`,
      sources:["eht2022","yuan2003"] },
    { id:"ir",      nom:"Infrared",   min:-6.15, max:-3.3,
      note:`Quiet, with <b>flares</b> several times a day — this is what
            GRAVITY watches. The emission becomes compact.`,
      sources:["gravity2018","genzel2010"] },
    { id:"visible", nom:"Visible light", min:-6.40, max:-6.15,
      note:`Almost <b>nothing</b>. Nothing shines to the naked eye here. The black hole
            gives itself away only through the bent starlight behind it.`,
      sources:["yuan2003"] },
    { id:"uv",      nom:"Ultraviolet",  min:-8.0,  max:-6.40,
      note:`Still almost nothing, and on the way to Earth everything is absorbed
            by dust in the galactic disk.`,
      sources:["genzel2010"] },
    { id:"x",       nom:"X-rays",     min:-11.0, max:-8.0,
      note:`Faint and <b>spread out</b> emission, far wider than the black hole,
            plus flares. Chandra has been watching it since 1999.`,
      sources:["genzel2010","yuan2014"] },
    { id:"gamma",   nom:"Gamma rays", min:-13.0, max:-11.0,
      note:`Nothing we know how to pin on Sgr A* itself. The galactic center does
            emit some, but other sources are mixed in with it.`,
      sources:["genzel2010"] },
  ],
},

// ----------------------------------------------------------- destination
// The lounge travels. Changing system means changing these values — not the
// code. `arrivee` resets the clock: the ship has been in orbit here since that
// date, and the onboard screens display it.
destination: {
  id: "sgr-a",
  nom: "Sagittarius A*",
  sous: "Supermassive black hole · center of the Milky Way",
  arrivee: "2026-08-04T06:00:00Z",
  distance: "8,277 pc from Earth",
  masse: "4.297 × 10⁶ solar masses",
  // What follows appears on the flight parameters screen
  orbite: "apoapsis at 16 Schwarzschild radii",
  sources: ["gravity2021"],
},

// --------------------------------------------------------------- welcome
// Three beats: the image, the question of level, the menu. Short throughout —
// a beginner does not read, they listen and they click.
accueil: {
  bienvenue: { id:"intro-bienvenue",
    t:`What you are looking at is not a picture. It is a calculation, redone sixty times a second.`,
    sources:["chandrasekhar1983"] },
  /* The opening, played once, after sound has been accepted.

     Three beats and no more. Hugo's brief: short but landing — nobody should
     think "why is this thing throwing text at me". The third beat drops the
     physics and talks about a family you never see again, because that is the
     only way a Lorentz factor of thirteen thousand becomes real.

     The durations are recomputed at display time, never written in: thirty-nine
     years aboard, fifty-four thousand on Earth, for a round trip to the
     galactic centre at one g. */
  presentation: [
    { sur: "A teaching simulation",
      t: `You are not about to read a lecture on black holes.
          You are about to approach one.` },

    { sur: "All of it computed",
      t: `Not one imported texture, not one hand-painted star.
          Three liberties only — and we will flag each one as you meet it.` },

    { sur: "What it would cost",
      t: `To the centre of the galaxy and back: <b>thirty-nine years</b> for you.
          <b>Fifty-four thousand</b> for Earth.` },
  ],

  niveau: { id:"intro-niveau",
    t:`Before I take you aboard: where are you with astronomy? I adapt — there is no wrong answer.` },
},

// The three answers reuse the `niveau-*` lines: one set of texts serves the
// routing, the cards and the voice.
niveauxLibelle: [
  { titre:"I'm hopeless at this",     detail:"We start from nothing, and we take our time." },
  { titre:"Keen amateur",             detail:"You know the basics — let's dig in." },
  { titre:"I'm an astronomer",        detail:"Recent results and raw numbers." },
],

// --------------------------------------------------------- Lumen's lines
// `t`: displayed (HTML allowed).  `dire`: read aloud, when different.
// `sources`: keys from `sources` above, mandatory as soon as there is a fact.
reactions: {
  accueil: { niv:[
    { id:"accueil-0", t:`Hello. I'm <b>Lumen</b>, this ship's onboard system.
       <br><br>I may as well say it straight away: I'm not very clever. I can only say what
       I was taught, and I don't understand a word you write. But what I was taught,
       I say well. Click on me whenever you like, I have answers ready.`,
      dire:`Hello. I'm Lumen, this ship's onboard system. I may as well say it straight away: I'm not very clever. I can only say what I was taught, and I don't understand a word you write. But what I was taught, I say well. Click on me whenever you like, I have answers ready.` },

    { id:"accueil-1", t:`<b>Lumen</b>, onboard assistance. Let's be clear: I'm not a
       conversational intelligence, more of a <i>slightly fancy audio guide</i> —
       answers written in advance, picked according to what you do.
       <br><br>In exchange, everything I say is checked and sourced. You can ask me
       where any number comes from.` },

    { id:"accueil-2", t:`<b>Lumen</b>, onboard assistance. Neither a language model nor a dialogue:
       a finite corpus of lines, indexed on the state of the simulation and the level you chose.
       <br><br>Every claim carries its references, one click away. It is less impressive
       than a conversation, but it is <b>checkable</b>.` },
  ]},
  pluie: [
    { id:"pluie-0", t:`Eighty probes at once. Watch the colors: <i>blue</i> they hold, <i>pink</i> they fall, <i>green</i> they leave. It all comes down to the speed they start with.` },
    { id:"pluie-1", t:`Same place, same black hole — and three different fates. The only thing that changes is how much too fast, or not fast enough, they were going.` },
  ],
  avalee: [
    { id:"avalee-0", t:`Watch it closely: it does not <b>cross</b>. Seen from here it slows, reddens, and goes out without ever reaching the edge. For it, the crossing has already happened.`,
      sources:["misner1973"] },
    { id:"avalee-1", t:`It wasn't “sucked in”: it fell, like a stone that misses its turn. And from where we stand, it is <i>still falling</i>. It always will be.`,
      sources:["misner1973"] },
    { id:"avalee-2", t:`That's why people used to say “frozen star”. From far away, nothing ever crosses the horizon — the image stalls on the threshold and fades out.`,
      sources:["misner1973"] },
  ],
  photon: { id:"photon", t:`Photon dropped on the ridge: too slow it falls, too fast it leaves. Nobody gets to stay. <i>Switch to real time</i> to see how slow this really is.`,
    sources:["chandrasekhar1983"] },
  photonAvale: { id:"photon-avale", t:`Right. It slipped off the wrong side of the ridge.` },
  photonFuite: { id:"photon-fuite", t:`It gets away. Now it flies straight for 27,000 years before anyone sees it.`,
    sources:["gravity2021"] },
  traj: { id:"traj", t:`There is everyone's future, already drawn. An orbit isn't decided along the way: the starting speed contains the whole story.` },
  embarque: { id:"embarque", t:`You're aboard. Careful — at this speed the sky is not where you think it is: <b>aberration</b> bunches it up ahead of you. What you see off to the sides actually comes from behind you.`,
    dire:`You're aboard. Careful, at this speed the sky is not where you think it is: aberration bunches it up ahead of you. What you see off to the sides actually comes from behind you.`,
    sources:["misner1973"] },
  salon: { id:"salon",
    t:`Welcome to the lounge. We're in an <b>eccentric orbit</b>: the ship moves in,
       moves out, and the black hole swells then shrinks behind the window.
       <br><br>One full lap takes <i>4 h 44</i> for real. We speed it up so you can see
       it happen — the screens tell you by how much.`,
    dire:`Welcome to the lounge. We're in an eccentric orbit: the ship moves in, moves out, and the black hole swells then shrinks behind the window. One full lap takes four hours and forty-four minutes for real. We speed it up so you can see it happen. The screens tell you by how much.`,
    pourquoi:`The orbit is not decorative: the ship follows the same timelike geodesic as
              the probes, the one the test bench validates. Hence the precession of
              periapsis — the ellipse slowly turns on itself, a purely relativistic
              effect, visible on the position screen.`,
    sources:["bardeen1972","gravity2020"] },
  jumeauxDepart: { id:"jumeaux-depart",
    t:`You're aboard. Your twin stays up there, a very long way off.
       <br><br>Look at the <b>two clocks</b> at the bottom of the screen: they agree for
       now. Go down with the scroll wheel — or two fingers — and watch them come apart.
       <i>Yours is going to fall behind.</i>`,
    dire:`You're aboard. Your twin stays up there, a very long way off. Look at the two clocks at the bottom of the screen: they agree for now. Go down with the scroll wheel, or two fingers, and watch them come apart. Yours is going to fall behind.`,
    pourquoi:`This is not an optical illusion, nor a trick of the game. On a circular
              Schwarzschild orbit, proper time runs at
              $d\\tau/dt = \\sqrt{1 - 3GM/rc^{2}}$ relative to a distant observer.
              Gravitational dilation and the dilation due to speed combine in it.
              <br><br>At the last stable orbit, r = 3 r<sub>s</sub>, that factor is
              exactly $\\sqrt{1/2} \\approx 70.7\\,\\%$ — and it is the <b>floor</b>:
              you cannot slow down any further around a black hole that does not spin.`,
    sources:["misner1973","bardeen1972"] },
  reel: { id:"reel", t:`Here is the truth, and it is austere: in visible light, the disk is <b>almost silent</b>. Sgr A* radiates in the submillimeter. What would give it away is the twisted stars behind it.`,
    dire:`Here is the truth, and it is austere: in visible light, the disk is almost silent. Sagittarius A star radiates in the submillimeter. What would give it away is the twisted stars behind it.`,
    sources:["yuan2014","eht2022"] },
  vitesse0: { id:"vitesse-reel", t:`Now you're in <b>real time</b>. The photon moves two hundredths of a radius per second. Go and make a coffee: it needs <i>11 min 31 s</i> for one lap.`,
    dire:`Now you're in real time. The photon moves two hundredths of a radius per second. Go and make a coffee: it needs eleven minutes and thirty-one seconds for one lap.`,
    sources:["gravity2021","chandrasekhar1983"] },
  vitesse3: { id:"vitesse-heure", t:`One hour per second. At this rate the outer edge of the disk finishes its orbit in a few seconds — when in reality it takes <i>nearly four hours</i>.`,
    dire:`One hour per second. At this rate, the outer edge of the disk finishes its orbit in a few seconds, when in reality it takes nearly four hours.`,
    sources:["gravity2021","bardeen1972"] },
  niveau: { niv:[
    { id:"niveau-0", t:`Back to basics, I promise, and no jargon.` },
    { id:"niveau-1", t:`Up a notch.` },
    { id:"niveau-2", t:`Good. I'll spare you nothing from here.` },
  ]},
  inactif: [
    { id:"inactif-0", t:`A black hole doesn't suck things in. If the Sun turned into one <i>at the same mass</i>, the Earth would keep exactly the same orbit. It would just get very cold.`,
      sources:["birkhoff1923"] },
    { id:"inactif-1", t:`The heavier a black hole, the less dense it is. I weigh <i>a thousand times water</i> — but M87*, a thousand times heavier, is <b>less dense than air</b>.`,
      dire:`The heavier a black hole, the less dense it is. I weigh a thousand times water. But M 87 star, a thousand times heavier, is less dense than air.`,
      pourquoi:`The radius grows as the mass, so the volume grows as its cube: the mean
                density falls as $1/M^{2}$.
                <br><br>For Sgr A*, $\\rho = M/\\tfrac{4}{3}\\pi r_s^{3} \\approx 1.0\\times10^{6}$ kg/m³,
                that is <b>a thousand times water</b> — the received wisdom saying the
                opposite is wrong at this mass. The water threshold sits near
                $1.4\\times10^{8}\\,M_\\odot$.
                M87*, at $6.5\\times10^{9}\\,M_\\odot$, drops to 0.44 kg/m³, below the 1.2 of air.`,
      sources:["gravity2021","schwarzschild1916","eht2019"] },
    { id:"inactif-2", t:`The shadow you're looking at is 52 millionths of an arcsecond across the sky. That's an <i>orange sitting on the Moon</i>.`,
      sources:["eht2022"] },
    { id:"inactif-3", t:`You'd never see anyone cross the horizon. From far away they slow, redden, and freeze. They themselves go through without noticing a thing.`,
      sources:["misner1973"] },
    { id:"inactif-4", t:`This black hole spins, and it drags space around with it. Push the spin slider up: the shadow shifts off-center, and one edge comes closer. <i>Card 8.</i>`,
      dire:`This black hole spins on itself, and it drags space around with it. Push the spin slider up: the shadow shifts off-center, and one edge comes closer. Go and read card eight.`,
      sources:["eht2022","bardeen1972"] },
    { id:"inactif-11", t:`Second announcement to passengers, in the same spirit. Our engine holds <b>1 g</b> indefinitely, which is extremely convenient and completely implausible. Engineering has never agreed to explain how it works, and I believe that's because they don't know either.`,
      dire:`Second announcement to passengers, in the same spirit. Our engine holds one g indefinitely, which is extremely convenient and completely implausible. Engineering has never agreed to explain how it works, and I believe that's because they don't know either.`,
      pourquoi:`The hard part isn't the thrust, it's keeping it up. A rocket that wants to
                change its rapidity by $\\Delta\\eta$ has to carry a mass ratio
                $M_i/M_f = e^{\\Delta\\eta / (v_e/c)}$: the fuel has to push the fuel,
                and the bill climbs <b>exponentially</b>.
                <br><br>To reach the galactic center at 1 g, the accumulated rapidity
                comes to 20.47. Even with the most efficient engine physics allows —
                total conversion of mass into energy, thrown out exactly backwards —
                you would need about <b>780,000 tonnes of fuel per kilogram
                delivered</b>. With chemical propellants, whose exhaust speed is a
                hundred-thousandth of the speed of light, the exponent gets so large
                that the required mass exceeds that of the observable universe.
                <br><br>So this is not an engineering problem waiting to be solved:
                it's the Tsiolkovsky equation that forbids the journey, not the
                technology.`,
      sources:["misner1973"] },
    { id:"inactif-10", t:`Attention passengers. We are in orbit, therefore in free fall, therefore you should all be floating. <b>For reasons of comfort and plot, management has decreed that gravity aboard shall be magic.</b> It is the only lie on this ship. Everything else is calculated.`,
      dire:`Attention passengers. We are in orbit, therefore in free fall, therefore you should all be floating. For reasons of comfort and plot, management has decreed that gravity aboard shall be magic. It is the only lie on this ship. Everything else is calculated.`,
      pourquoi:`Nothing presses a body to the floor of an orbiting ship: the cabin and its
                occupant follow the same geodesic, and the occupant floats. That is why
                the crew of the International Space Station is weightless while Earth's
                gravity up there is still <b>88 %</b> of its value at the ground —
                at 420 km altitude, $(6371/6791)^{2} = 0.88$. Weightlessness isn't the
                absence of gravity, it's free fall.
                Artificial gravity by rotation would be physically honest, but it would
                set the view spinning in the bay: the object would sweep past on a loop
                and become unreadable. So we had to choose between an accurate ship and
                an observable black hole. We chose the black hole.`,
      sources:["misner1973"] },
    { id:"inactif-5", t:`The disk shines because the gas rubs against itself as it falls. Nothing is burning in there — the falling is what makes the light.`,
      sources:["shakura1973","balbus1991"] },
    { id:"inactif-6", t:`A ship holding <i>1 g</i> the whole way — half of it accelerating, half of it braking — would arrive here <b>19.8 years</b> older. On Earth, 27,000 years would have gone by. Nobody would be waiting for you.`,
      dire:`A ship holding one g the whole way, half of it accelerating and half of it braking, would arrive here nineteen years and ten months older. On Earth, twenty-seven thousand years would have gone by. Nobody would be waiting for you.`,
      pourquoi:`Relativistic rocket at constant proper acceleration. The time lived aboard is
                $\\tau = \\tfrac{2c}{g}\\,\\operatorname{arccosh}\\!\\left(\\tfrac{gd}{2c^{2}}+1\\right)$ —
                it grows as the <b>logarithm</b> of the distance, while Earth time grows
                in proportion. That is the whole business.
                <br><br>For d = 26,996 ly: <b>19.8 years</b> aboard against ~27,000 on Earth,
                with γ = 13,935 at turnaround. Nothing exotic, this is special relativity
                from 1905. The fuel, on the other hand, is out of reach — ask me about it.`,
      sources:["gravity2021","misner1973"] },
    { id:"inactif-7", t:`With the same <i>1 g</i> push, Andromeda is <b>28.6 years</b> of your life away. Two and a half million light-years. The distance barely counts any more, because your time contracts along with it — what's left is the fuel, and there it's hopeless.`,
      dire:`With the same one g push, Andromeda is twenty-eight and a half years of your life away. Two and a half million light-years. The distance barely counts any more, because your time contracts along with it. What's left is the fuel, and there, it's hopeless.`,
      pourquoi:`Same formula as for the galactic center. A hundred times further costs only
                nine more years of your life, because time aboard grows as the logarithm
                of the distance.
                <br><br>A limit that often gets forgotten: the expansion of the universe.
                Beyond about <b>16 billion comoving light-years</b>, space stretches
                faster than you can cross it — those galaxies are out of reach for good,
                whatever your acceleration. That is 4.5 % of the observable volume.`,
      sources:["misner1973"] },
    /* 780,000 tonnes, not 758,000 — see the French file for the full story: the
       old figure was the same formula applied to an older distance, the 8,178
       parsecs of GRAVITY 2019, which the site abandoned for the 8,277 of the
       2022 measurement. Two figures for one journey. */
    { id:"inactif-8", t:`The fuel, then. Even a <b>perfect photon rocket</b> — all its mass turned into light — would have to annihilate <i>780,000 tonnes</i> of it for a single kilogram to arrive here. With fusion, the ratio exceeds the mass of the observable universe.`,
      dire:`The fuel, then. Even a perfect photon rocket, all its mass turned into light, would have to annihilate seven hundred and eighty thousand tonnes of it for a single kilogram to arrive here. With fusion, the ratio exceeds the mass of the observable universe.`,
      pourquoi:`Relativistic rocket equation: the mass ratio is
                $e^{\\Delta\\eta/(v_e/c)}$, where $\\eta = \\operatorname{arccosh}\\gamma$ is
                the rapidity. Accelerating then braking all the way to the galactic center
                accumulates <b>20.47</b>.
                <br><br>With a photon rocket — the best conceivable, 100 % of the mass
                converted — that gives $e^{20.47} = 7.8\\times10^{8}$: 780,000 tonnes
                annihilated per kilogram delivered. With deuterium-helium-3 fusion
                ($v_e \\approx 0.12c$), the ratio reaches $10^{75}$.`,
      sources:["misner1973","dyson1968"] },
    { id:"inactif-9", t:`Hence <b>Bussard's</b> idea, in 1960: don't carry your fuel, scoop it up on the way with an enormous magnetic net. Elegant. Except it has since been shown that the net <i>brakes more than it pushes</i>.`,
      dire:`Hence Bussard's idea, in 1960: don't carry your fuel, scoop it up on the way with an enormous magnetic net. Elegant. Except it has since been shown that the net brakes more than it pushes.`,
      sources:["bussard1960","zubrin1989"] },
  ],
},

// ---------------------------------------------------------- experiences
// The home screen. You choose what you want to live through, you read first
// what is going to happen, and the experience sets its own speed, camera and
// displays. Nobody should ever have to hunt for a setting.
experiences: [
{
  id: "libre",
  titre: "Explore the black hole",
  duree: "at your own pace",
  resume: "Launch probes and see which ones hold.",
  quoi: `Eight missions, one single thing to understand per mission.
         You don't need to know anything in advance.`,
},
{
  id: "jumeaux",
  titre: "The twin experiment",
  duree: "3 minutes",
  resume: "Your time is going to slow down. Not theirs.",
  quoi: `You go down very close, another ship stays far away. Your two clocks
         come apart, and the gap is never made up.
         It's <i>Interstellar</i>, with the real numbers.`,
},
{
  id: "reelle",
  titre: "See it in real light",
  duree: "1 minute",
  resume: "Cut the colors. Find it again.",
  quoi: `That beautiful orange disk — a human eye would not see it.
         All that's left is bent stars around the emptiness. Up to you to find it.`,
},
{
  id: "exact",
  titre: "How we know this is true",
  duree: "a read",
  resume: "The site checks its own calculation in front of you.",
  quoi: `Nothing was drawn. We explain the method, we say what is
         approximated, and a test bench checks the engine live.`,
},
],

// -------------------------------------------------------------- missions
// One mission = one gesture, and one single thing understood at the end. No
// points, no badges: the reward is that something happens on screen and you
// know why. This is the way in for someone who knows nothing.
// The checking lives in index.html, indexed by `id`.
missions: [
{
  id: "m-chute",
  titre: "Make something fall",
  consigne: "Put your finger on the orange disk and pull <b>very gently</b>, then let go.",
  reussi: { id:"m-chute-ok",
    t:`Watch it closely: it doesn't cross. Seen from here it slows, reddens, and goes out on the edge. <b>Nothing ever crosses the horizon</b>, for those of us watching from far away.`,
    dire:`Watch it closely: it doesn't cross. Seen from here, it slows, reddens, and goes out on the edge. Nothing ever crosses the horizon, for those of us watching from far away.`,
    sources:["misner1973"] },
},
{
  id: "m-orbite",
  titre: "Now put one into orbit",
  consigne: "Try again, but pull <b>harder</b>. The line turns green when the speed is right.",
  reussi: { id:"m-orbite-ok",
    t:`There. What decides everything isn't the distance — it's the <b>speed</b>. Too slow you fall, too fast you leave. An orbit is a fall that misses its target forever.`,
    dire:`There. What decides everything isn't the distance, it's the speed. Too slow you fall, too fast you leave. An orbit is a fall that misses its target forever.`,
    sources:["bardeen1972"] },
},
{
  id: "m-pluie",
  titre: "Drop eighty of them at once",
  consigne: "The <b>Drop 80 probes</b> button, at the bottom. Then watch the colors.",
  reussi: { id:"m-pluie-ok",
    t:`Three fates, one single difference: the starting speed. <i>Blue</i> they hold, <i>pink</i> they fall, <i>green</i> they escape. Press <b>Trajectories</b> to see their future, already drawn.`,
    dire:`Three fates, one single difference: the starting speed. Blue they hold, pink they fall, green they escape. Press Trajectories to see their future, already drawn.`,
    sources:["bardeen1972"] },
},
{
  id: "m-limite",
  titre: "Find the limit",
  consigne: "Try to put a probe into orbit <b>very close in</b>, inside the dotted circle.",
  reussi: { id:"m-limite-ok",
    t:`You won't manage it, and that isn't a flaw in the game. Below this limit, <b>no orbit holds</b>, whatever your speed. Around a star, that doesn't exist. Around a black hole, it does.`,
    dire:`You won't manage it, and that isn't a flaw in the game. Below this limit, no orbit holds, whatever your speed. Around a star, that doesn't exist. Around a black hole, it does.`,
    sources:["bardeen1972"] },
},
{
  id: "m-photon",
  titre: "Fire a ray of light",
  consigne: "The <b>Photon</b> button. Then set the speed of time to <b>real time</b>, in the cog.",
  reussi: { id:"m-photon-ok",
    t:`Take your time, it needs <b>eleven and a half minutes</b> — for one lap. Light is the fastest thing in the universe, and here it looks slow. That's because this thing is <i>enormous</i>.`,
    dire:`Take your time, it needs eleven and a half minutes. For one lap. Light is the fastest thing in the universe, and here it looks slow. That's because this thing is enormous.`,
    sources:["gravity2021","chandrasekhar1983"] },
},
{
  id: "m-reel",
  titre: "Turn off the light",
  consigne: "Press <b>Real light</b>, at the bottom. And go looking for the black hole. The same button brings the colors back.",
  reussi: { id:"m-reel-ok",
    t:`It's still there. That beautiful orange disk — in reality you would <b>not</b> see it: it shines in waves the eye can't pick up. What gives it away is the <i>bent</i> stars around it. That's how we really go looking for them.`,
    dire:`It's still there. That beautiful orange disk, in reality you would not see it: it shines in waves the eye can't pick up. What gives it away is the bent stars around it. That's how we really go looking for them.`,
    sources:["yuan2014","eht2022"] },
},
{
  id: "m-bord",
  titre: "Come aboard",
  consigne: "The <b>Come aboard</b> button. You take the probe's place.",
  reussi: { id:"m-bord-ok",
    t:`Look at the “time passing” dial. It's <b>below 100 %</b>: here, your time runs more slowly than elsewhere. This isn't a feeling. You age less than someone who stayed far away.`,
    dire:`Look at the “time passing” dial. It is below one hundred per cent: here, your time runs more slowly than elsewhere. This isn't a feeling. You age less than someone who stayed far away.`,
    sources:["misner1973","gravity2018"] },
},
{
  id: "m-jumeaux",
  titre: "The twins' journey",
  consigne: "Stay aboard and <b>go down as close as you can</b>: scroll wheel, or two fingers. The mother ship is waiting for you far off, and your two clocks are going to diverge.",
  reussi: { id:"m-jumeaux-ok",
    t:`Half an hour of difference, and it will never be made up. Your twin, who stayed far away, has <b>aged more than you</b> — they are the one who lost time, not you. But look at the counter: at best your time drops to <i>70.7 %</i>. You can't do better here, because this black hole <b>doesn't spin</b>. The 61,000 years per hour in <i>Interstellar</i> need a rotating black hole, one that drags space along and lets you hold on much closer in.`,
    dire:`Half an hour of difference, and it will never be made up. Your twin, who stayed far away, has aged more than you. They are the one who lost time, not you. But look at the counter: at best, your time drops to seventy point seven per cent. You can't do better here, because this black hole does not spin. The sixty-one thousand years per hour in Interstellar need a rotating black hole, one that drags space along and lets you hold on much closer in.`,
    sources:["misner1973","bardeen1972","gravity2018"] },
},
],

/* The onboarding quest, played aboard.

   It doesn't teach relativity: it teaches the place. Four gestures, all of them
   already possible, each revealing a control you would never guess at — that
   you can turn your head, that there is someone aboard, that time is sped up
   and can be put back to the truth, and that the telescope is a door.

   The third step is the only one that teaches a fact, and it is a confession:
   we cheat with time so the orbit can be seen. Saying it early beats letting
   someone find out. */
accueilQuete: [
{
  id: "a-baie",
  titre: "Look out through the bay",
  consigne: "Drag the mouse — or your finger — to turn your head towards the window.",
  reussi: { id:"a-baie-ok",
    t:`Stop for a second on what is in front of you.<br><br><b>Nobody has ever seen this.</b> No camera has ever been here. And it is not an artist's impression: every point of this image is a ray of light that was followed, one by one, through spacetime bent by four million Suns.<br><br>The ring wasn't drawn. Nor was the underside of the disk, the part you see passing over the top — that is light that went all the way round. The side that shines brighter is the side coming towards you.<br><br>So let's be exact: <b>the shape, you really would see it like this.</b> The colors, no — and I'll tell you why. But the geometry you are looking at is the one Einstein's equations give, without a single pixel arranged.`,
    dire:`Stop for a second on what is in front of you. Nobody has ever seen this. No camera has ever been here. And it is not an artist's impression: every point of this image is a ray of light that was followed, one by one, through spacetime bent by four million Suns. The ring wasn't drawn. Nor was the underside of the disk, the part you see passing over the top: that is light that went all the way round. The side that shines brighter is the side coming towards you. So let's be exact. The shape, you really would see it like this. The colors, no, and I'll tell you why. But the geometry you are looking at is the one Einstein's equations give, without a single pixel arranged.`,
    pourquoi:`Every pixel of the image fires a null geodesic integrated backwards in time
              in the Schwarzschild metric, in the Cartesian form
              $\\mathbf{a} = -\\tfrac{3}{2}h^{2}\\mathbf{r}/r^{5}$. Nothing is pasted on:
              the photon sphere at 1.5 r_s, the shadow at $\\sqrt{27}/2$, the
              higher-order images and the Doppler asymmetry are consequences, and the
              site's test bench measures them live — 0.002 % error on the shadow
              radius. The colors, on the other hand, are invented: Sgr A* radiates in
              the submillimeter and would be invisible to the naked eye.`,
    sources:["gravity2021","eht2022","misner1973"] },
},
{
  id: "a-lumen",
  titre: "You're not alone aboard",
  consigne: "A small drone is doing its rounds. <b>Click on it</b> to ask it a question.",
  reussi: { id:"a-lumen-ok",
    t:`I'm the onboard system of the <b>Periastron</b>. Not an intelligence: a guide, with a finite number of prepared answers.<br><br>What we are doing here fits in one sentence. Sagittarius A* is the <b>only reachable place</b> where gravity is strong enough to be seen bending light. On Earth it curves space so faintly that you need atomic clocks to measure it; here it turns rays of light right around. Everything we think we know about relativity holds at this distance, or doesn't hold at all.<br><br>That's why people accepted a one-way trip. Not to bring anything back — to <i>look</i>.<br><br>When I quote a number, the <i>where's that from?</i> button gives you the calculation, then the reference.`,
    dire:`I'm the onboard system of the Periastron. Not an intelligence: a guide, with a finite number of prepared answers. What we are doing here fits in one sentence. Sagittarius A star is the only reachable place where gravity is strong enough to be seen bending light. On Earth, it curves space so faintly that you need atomic clocks to measure it. Here, it turns rays of light right around. Everything we think we know about relativity holds at this distance, or doesn't hold at all. That's why people accepted a one-way trip. Not to bring anything back: to look. When I quote a number, the “where's that from” button gives you the calculation, then the reference.`,
    sources:["gravity2021","eht2022"] },
},
{
  id: "a-temps",
  titre: "Time is rigged, and you need to know it",
  consigne: "On the console, five levers set the speed. <b>Push the shortest one</b>: real time.",
  reussi: { id:"a-temps-ok",
    t:`Thank you. At this speed nothing moves any more — and that is the truth: one lap of the orbit takes <b>4 h 44</b>. Speeding it up is a comfort choice, and it is the only place on this site where we lie to you. Put back whatever you like.<br><br>While we're on the subject of time, you should know how we got here. This ship pushed at <i>1 g</i> — Earth gravity — half the trip accelerating, the other half braking. <b>About twenty years</b> of life aboard. On Earth, <b>twenty-seven thousand</b> went by.<br><br>Not one of the people who watched us leave was there to see us arrive. This isn't a plot licence: it's what the equations give, and the button below shows you which ones.`,
    dire:`Thank you. At this speed, nothing moves any more, and that is the truth: one lap of the orbit takes four hours and forty-four minutes. Speeding it up is a comfort choice, and it is the only place on this site where we lie to you. Put back whatever you like. While we're on the subject of time, you should know how we got here. This ship pushed at one g, Earth gravity, half the trip accelerating and the other half braking. About twenty years of life aboard. On Earth, twenty-seven thousand went by. Not one of the people who watched us leave was there to see us arrive. This isn't a plot licence: it's what the equations give.`,
    pourquoi:`Relativistic rocket at constant proper acceleration. The proper time of a trip
              where you accelerate then brake is
              $\\tau = \\tfrac{2c}{a}\\,\\operatorname{arccosh}\\!\\left(\\tfrac{ad}{2c^{2}}+1\\right)$.
              For $a = g$ and $d = 8\\,277$ pc, you get about twenty proper years,
              while the time measured from Earth stays barely above $d/c$, that is
              around 27,000 years: at these speeds the ship follows the light very
              closely. The journey therefore fits inside a lifetime — it's the return
              that doesn't.`,
    sources:["misner1973","gravity2021"] },
},
{
  id: "a-telescope",
  titre: "Move to the telescope",
  consigne: "Go down into the pit, to port. <b>Click on the instrument</b> — it gives you control of everything else.",
  reussi: { id:"a-telescope-ok",
    t:`Here you are at the instrument. From here you launch probes, you change wavelength, you make the black hole spin on itself. Go on, break something — we can go back up to the ship whenever you like.`,
    dire:`Here you are at the instrument. From here, you launch probes, you change wavelength, you make the black hole spin on itself. Go on, break something. We can go back up to the ship whenever you like.`,
    sources:[] },
},
],

questions: [
{ q:"What exactly is a black hole?", niv:[
  { id:"q1-0", t:`Matter packed so tight that nothing can get out of it any more, <b>not even light</b>. It's not a hole and it's not a vacuum cleaner: just a place you don't come back from.`,
    sources:["schwarzschild1916"] },
  { id:"q1-1", t:`A region where the speed you'd need to escape exceeds the speed of light. Since nothing goes faster, nothing gets out. It isn't a solid object: it's a <b>region of spacetime</b> bounded by a horizon.`,
    sources:["schwarzschild1916"] },
  { id:"q1-2", t:`A vacuum solution of Einstein's equations possessing an event horizon — the boundary of the causal past of future null infinity. The <b>Penrose-Hawking</b> singularity theorems guarantee that sufficient collapse produces one; cosmic censorship, on the other hand, remains conjectural.`,
    sources:["penrose1965","schwarzschild1916"] },
]},
{ q:"What happens if I fall in?", niv:[
  { id:"q2-0", t:`On this one, you'd cross the line <b>without feeling anything</b>. After that, no direction takes you back: falling becomes as unavoidable as the passing of time. And further down, you'd be stretched out like a spaghetti.`,
    sources:["misner1973"] },
  { id:"q2-1", t:`On Sgr A*, the stretching at the horizon doesn't exceed <i>a ten-thousandth of a g</i> across the size of a body: you go through without noticing. Inside, the distance to the center stops being a direction in space and becomes a <b>direction in time</b> — the bottom is no longer a place, it's a future.`,
    dire:`On Sagittarius A star, the stretching at the horizon doesn't exceed a ten-thousandth of a g across the size of a body: you go through without noticing. Inside, the distance to the center stops being a direction in space and becomes a direction in time. The bottom is no longer a place, it's a future.`,
    sources:["misner1973","gravity2021"] },
  { id:"q2-2", t:`Regular crossing in Eddington-Finkelstein. In the Schwarzschild interior r becomes timelike: reaching r = 0 is unavoidable and the remaining proper time is bounded above by <i>πGM/c³ ≈ 66.5 s</i> here. Tides diverge as M/r³, so they are negligible at the horizon of a supermassive. The open question is quantum: firewall, or strictly nothing.`,
    dire:`Regular crossing in Eddington-Finkelstein. In the Schwarzschild interior, r becomes timelike: reaching r equals zero is unavoidable, and the remaining proper time is bounded above by pi G M over c cubed, about sixty seconds here. Tides diverge as M over r cubed, so they are negligible at the horizon of a supermassive. The open question is quantum: firewall, or strictly nothing.`,
    sources:["misner1973","amps2013"] },
]},
{ q:"Why is it black in the middle?", niv:[
  { id:"q3-0", t:`Because no light coming from there can reach you. It isn't a black object, it's an <b>absence</b>. And that circle is bigger than the black hole itself: light passing too close is caught on its way by.`,
    sources:["bardeen1973"] },
  { id:"q3-1", t:`It's the shadow. Any ray whose path, traced backwards, ends up under the horizon gives you black. The threshold falls at <i>2.6 horizon radii</i> — much wider than the horizon, because grazing it is enough to be captured.`,
    dire:`It's the shadow. Any ray whose path, traced backwards, ends up under the horizon gives you black. The threshold falls at two point six horizon radii, much wider than the horizon, because grazing it is enough to be captured.`,
    sources:["bardeen1973"] },
  { id:"q3-2", t:`Capture cross-section: critical impact parameter b_c = √27 GM/c², giving an apparent radius of <i>2.598 r<sub>s</sub></i>. The edge is in fact a ring stacking the order-n images, spaced by a factor e<sup>−π</sup> in flux. That structure is what the EHT is aiming at.`,
    dire:`Capture cross-section: the critical impact parameter is root twenty-seven G M over c squared, giving an apparent radius of two point five nine eight Schwarzschild radii. The edge is in fact a ring stacking the order n images, spaced by a factor e to the power minus pi in flux. That structure is what the E H T is aiming at.`,
    sources:["bardeen1973","gralla2019","eht2022"] },
]},
{ q:"How do you weigh something invisible?", niv:[
  { id:"q4-0", t:`You watch what goes round it. A star called <b>S2</b> goes all the way round in 16 years; its speed and the size of its orbit give the mass — exactly the way we weigh the Sun by watching the Earth go round.`,
    sources:["gravity2021"] },
  { id:"q4-1", t:`Kepler's third law. S2 completes its orbit in <i>16.05 years</i>, comes closest at 120 astronomical units and tears past at 7,650 km/s. Semi-major axis and period are enough: 4.3 million solar masses, in a volume too small for a star cluster.`,
    dire:`Kepler's third law. S 2 completes its orbit in sixteen years, comes closest at a hundred and twenty astronomical units, and tears past at seven thousand six hundred and fifty kilometers per second. Semi-major axis and period are enough: four point three million solar masses, in a volume too small for a star cluster.`,
    sources:["gravity2021","gravity2018"] },
  { id:"q4-2", t:`Infrared astrometry and spectroscopy of the S cluster over three decades (Keck, VLT/GRAVITY). Beyond Kepler, S2 supplies testable post-Newtonian physics: gravitational redshift detected at the 2018 pericenter passage, <b>Schwarzschild precession</b> of 12.1′/orbit confirmed in 2020. 2020 Nobel Prize in Physics to Genzel and Ghez.`,
    dire:`Infrared astrometry and spectroscopy of the S cluster over three decades, at Keck and the V L T. Beyond Kepler, S 2 supplies testable post-Newtonian physics: gravitational redshift detected at the pericenter passage in 2018, Schwarzschild precession of twelve arcminutes per orbit confirmed in 2020. Nobel Prize in Physics 2020 to Genzel and Ghez.`,
    sources:["gravity2021","gravity2018","gravity2020","nobel2020"] },
]},
{ q:"Could it swallow the Earth?", niv:[
  { id:"q5-0", t:`No. A black hole doesn't pull any harder than a star of the same mass. If the Sun became one right now, the Earth would keep <b>exactly</b> the same orbit — it would just go dark and very cold. And this one is 27,000 light-years away.`,
    sources:["birkhoff1923","gravity2021"] },
  { id:"q5-1", t:`No: gravity depends only on mass and distance, not on compactness. At 150 million km, the field of a one-solar-mass black hole is identical to the Sun's. You have to come within a few horizon radii for anything at all to change.`,
    sources:["birkhoff1923"] },
  { id:"q5-2", t:`<b>Birkhoff's theorem</b> guarantees that outside a spherical distribution the metric depends only on M: a spherically symmetric collapse leaves the outer orbits untouched. Relativistic departures only emerge for r of order a few r<sub>s</sub>. Sgr A* is 8.3 kpc away.`,
    dire:`Birkhoff's theorem guarantees that outside a spherical distribution, the metric depends only on the mass: a spherically symmetric collapse leaves the outer orbits untouched. Relativistic departures only emerge for r of order a few Schwarzschild radii. Sagittarius A star is eight point three kiloparsecs away.`,
    sources:["birkhoff1923","gravity2021"] },
]},
{ q:"Is what I'm seeing really it?", niv:[
  { id:"q6-0", t:`The <b>shape</b>, yes: it's computed with the real equations, nobody drew it. The colors, no. The real Sgr A* is very faint and can only be observed at radio wavelengths. This is the picture you'd get with far more sensitive eyes.`,
    dire:`The shape, yes: it's computed with the real equations, nobody drew it. The colors, no. The real Sagittarius A star is very faint and can only be observed at radio wavelengths. This is the picture you'd get with far more sensitive eyes.`,
    sources:["eht2022","yuan2014"] },
  { id:"q6-1", t:`The geometry is exact: ring, shadow, disk folded over the top, all of it comes out of integrating the paths of light. The disk, on the other hand, is a <b>plausible invention</b>, not an observation — Sgr A* accretes very little, and its EHT image is a fuzzy ring at radio wavelengths, not this show.`,
    dire:`The geometry is exact: ring, shadow, disk folded over the top, all of it comes out of integrating the paths of light. The disk, on the other hand, is a plausible invention, not an observation. Sagittarius A star accretes very little, and its E H T image is a fuzzy ring at radio wavelengths, not this show.`,
    sources:["eht2022","yuan2014","luminet1979"] },
  { id:"q6-2", t:`Exact gravitational optics, decorative astrophysics. The spin is there: at a ≠ 0 we switch to Kerr, with frame dragging, ergosphere and displaced ISCO, in Kerr-Schild coordinates where the polar axis is no longer singular. Missing, on the other hand: radiative transfer in optically thin plasma, the thick geometry of a RIAF, and variability. A real render starts from GRMHD post-processing; here the emissivity is set by hand. <i>Card 8.</i>`,
    dire:`Exact gravitational optics, decorative astrophysics. The spin is there: at non-zero spin, we switch to Kerr, with frame dragging, ergosphere and displaced I S C O, in Kerr-Schild coordinates, where the polar axis is no longer singular. Missing, on the other hand: radiative transfer in optically thin plasma, the thick geometry of a R I A F, and variability. A real render starts from G R M H D post-processing. Here, the emissivity is set by hand.`,
    sources:["bardeen1972","yuan2014","eht2022"] },
]},
{ q:"Why don't the stars fall in?", niv:[
  { id:"q7-0", t:`For the same reason the Earth doesn't fall into the Sun: they are moving <b>sideways</b>. Something that falls while going fast enough misses its target and starts again, forever. An orbit is a fall that never lands.`,
    sources:["misner1973"] },
  { id:"q7-1", t:`They are falling, constantly — but with angular momentum, and that is conserved. The path is then an ellipse whose pericentre is a <i>minimum distance</i>, not a destination. For S2 that minimum is 120 AU, about <b>1,400 Schwarzschild radii</b>: a thousand times too far out for the horizon to come into it.`,
    dire:`They are falling, constantly, but with angular momentum, and that is conserved. The path is then an ellipse whose pericentre is a minimum distance, not a destination. For S 2 that minimum is a hundred and twenty astronomical units, about fourteen hundred Schwarzschild radii: a thousand times too far out for the horizon to come into it.`,
    sources:["gravity2018","misner1973"] },
  { id:"q7-2", t:`S2's specific angular momentum is far above the capture threshold: the innermost stable orbit is at 3 r<sub>s</sub>, its pericentre is at ~1,400. The regime is first-order post-Newtonian — $\\Delta\\varphi \\simeq 12'$ per period, measurable, but a long way from strong field. And nothing will bring it down within its own lifetime: the two-body relaxation time in the Galactic Centre is 10¹⁰ to 2 × 10¹¹ years, while S2 is about 7 × 10⁶ years old.`,
    dire:`S 2's specific angular momentum is far above the capture threshold: the innermost stable orbit is at three Schwarzschild radii, its pericentre is at fourteen hundred. The regime is first-order post-Newtonian: twelve arcminutes per period, measurable, but a long way from strong field. And nothing will bring it down within its own lifetime: the two-body relaxation time in the Galactic Centre runs to tens of billions of years, while S 2 is about seven million years old.`,
    sources:["gravity2018","genzel2010","bardeen1972","habibi2017"] },
]},
{ q:"If it was photographed in 2022, why say we knew before?", niv:[
  { id:"q8-0", t:`Because the proof wasn't a photograph, it was in the <b>motion</b>. Seeing stars go round an empty point and measuring how much that point weighs was enough. We knew what to expect thirty years before the image arrived — and the image confirmed, it did not reveal.`,
    sources:["gravity2021","eht2022","nobel2020"] },
  { id:"q8-1", t:`The two measurements are not about the same thing. The orbits give a <b>mass</b> and a <b>minimum density</b>. The EHT image gives an <i>apparent size</i>: a ring of 51.8 ± 2.3 μas, consistent with the shadow expected for that mass at that distance. The second checks the first on a scale hundreds of times smaller — 2.6 horizon radii for the shadow, against 1,400 for S2's pericentre.`,
    dire:`The two measurements are not about the same thing. The orbits give a mass and a minimum density. The E H T image gives an apparent size: a ring of about fifty-two microarcseconds, consistent with the shadow expected for that mass at that distance. The second checks the first on a scale hundreds of times smaller: two point six horizon radii for the shadow, against fourteen hundred for S 2's pericentre.`,
    sources:["gravity2018","eht2022","bardeen1973"] },
  { id:"q8-2", t:`Two independent constraints on one object. The orbits constrain $M$ and $R_{0}$, correlated, plus a minimum density and a bound on extended mass. The EHT constrains the angular diameter of the ring, $51.8 \\pm 2.3\\ \\mu\\mathrm{as}$, hence $GM/(c^{2}D)$ through the critical impact parameter $\\sqrt{27}\\,GM/c^{2}$. The two agree, which was in no way guaranteed: instruments, wavelengths and systematics have nothing in common. That <b>redundancy</b> is what makes the result solid, not either measurement on its own.`,
    dire:`Two independent constraints on one object. The orbits constrain the mass and the distance, which are correlated, plus a minimum density and a bound on extended mass. The E H T constrains the angular diameter of the ring, hence G M over c squared D, through the critical impact parameter. The two agree, which was in no way guaranteed: instruments, wavelengths and systematics have nothing in common. That redundancy is what makes the result solid, not either measurement on its own.`,
    sources:["gravity2021","eht2022","bardeen1973"] },
]},
{ q:"Are we really seeing the stars move?", niv:[
  { id:"q9-0", t:`Yes, but not like a video. What exists is <b>photographs</b>, taken year after year for thirty years, on which each star has shifted a little. The animation you are watching joins those points up: the points are real, the motion between two points is computed.`,
    sources:["gravity2021"] },
  { id:"q9-1", t:`What the papers publish is dated positions and radial velocities, not a film. For S2: 128 positions from adaptive optics, 82 from the interferometer, about a hundred spectra, between 1992 and 2021. The orbit is a <b>fit</b> passing as well as it can through those points; the animation replays that fit at whatever speed you like. The shape is measured, the smoothness is added.`,
    dire:`What the papers publish is dated positions and radial velocities, not a film. For S 2: a hundred and twenty-eight positions from adaptive optics, eighty-two from the interferometer, about a hundred spectra, between 1992 and 2021. The orbit is a fit passing as well as it can through those points; the animation replays that fit at whatever speed you like. The shape is measured, the smoothness is added.`,
    sources:["gravity2021","gillessen2017"] },
  { id:"q9-2", t:`This scene solves Kepler on the osculating elements of Gillessen et al. 2017, <b>with no relativistic term</b>: the Schwarzschild precession, 12′ per period for S2, is not rendered. For the long orbits in the same table the uncertainty on <i>a</i> and <i>P</i> reaches tens of per cent — S85 is published at 3,580 ± 2,550 years — and one row, S111, carries a formally negative semi-major axis, hence a hyperbolic orbit, excluded from any ellipse. The stars shown here are the ones whose period is short and well sampled. This is not a complete sample, and it does not claim to be.`,
    dire:`This scene solves Kepler on the osculating elements of Gillessen and collaborators, twenty seventeen, with no relativistic term: the Schwarzschild precession, twelve arcminutes per period for S 2, is not rendered. For the long orbits in the same table the uncertainty on the semi-major axis and the period reaches tens of per cent, and one row carries a formally negative semi-major axis, hence a hyperbolic orbit, excluded from any ellipse. The stars shown here are the ones whose period is short and well sampled. This is not a complete sample, and it does not claim to be.`,
    sources:["gillessen2017","gravity2020"] },
]},
],

// ---------------------------------------------------------------- cards
// The eight cards, three levels each. They used to live hard-coded in
// index.html, with no source key — and the audit found nine errors out of ten
// in them. They are here to be proofread like everything else.
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
   `In the middle of our galaxy, there is a black hole. It weighs <i>4 million times the Sun</i>.
    <br><br>Nobody has ever seen it with the naked eye. We found out it was there because
    astronomers watched the same small patch of sky <b>for thirty years</b>, night after
    night — and ended up seeing stars going round <i>nothing</i>.
    An emptiness that made them turn.
    <br><br>It took until 2022 to get a picture of it. Take a second on that:
    we photographed a thing that no light comes out of.`,

   `Sagittarius A* is 4.3 million solar masses packed into a ball of
    <i>12.7 million km</i> — it would fit inside Mercury's orbit.
    Its mass was measured by following the star S2 for thirty years; S2 goes all the way
    round in 16 years, and grazes <b>2.5 % of the speed of light</b> at its closest approach.
    That work earned the <b>2020 Nobel Prize in Physics</b>.`,

   `M = (4.297 ± 0.012 ± 0.040) × 10⁶ M☉ at R₀ = 8,277 ± 9 ± 30 pc (GRAVITY, 2022), from infrared
    astrometry of S2 — whose <b>Schwarzschild precession</b> of 12′ per orbit has been
    measured. EHT image from May 2022: a ring of <i>51.8 ± 2.3 μas</i>, consistent with a
    low inclination, spin poorly constrained. Accretion in the RIAF regime at ~10⁻⁹ L_Edd:
    it is one of the most underluminous supermassive black holes known.`,
  ]
},
{
  id: "f-horizon",
  titre: "The event horizon",
  sources: [
    ["misner1973"],
    ["schwarzschild1916", "misner1973"],
    ["schwarzschild1916", "misner1973", "amps2013", "penington2020"],
  ],
  t: [
   `The horizon is not a wall. There is nothing to touch, nothing to see, no barrier at all.
    It is simply the place from which you would have to go faster than light to come back —
    and nothing and nobody goes faster than light.
    <br><br>The most unsettling part: crossing it, <b>you would feel absolutely nothing</b>.
    No shock, no sound, no border. You would go through, that's all.
    And at that exact moment, <i>every</i> path ahead of you would lead to the same place.`,

   `Its radius is r<sub>s</sub> = 2GM/c², that is <i>12.7 million km</i> here. It is not
    a place where matter gets crushed: the curvature there is perfectly finite. On a black hole
    this massive, the stretching at the horizon does not exceed <b>a ten-thousandth of a g</b>
    across the size of a human body. You would cross it without noticing. Afterwards is another matter.`,

   `A null surface, not a singularity: the Kretschmann invariant K = 48G²M²/c⁴r⁶ stays finite
    at r<sub>s</sub>. The degeneracy of the Schwarzschild metric there is a coordinate
    artifact, lifted in Eddington-Finkelstein or Kruskal-Szekeres. The open questions bear
    less on the horizon itself than on its quantum content:
    <b>firewalls</b> (AMPS 2012), complementarity, and since 2019 Page curves
    reconstructed from quantum extremal surfaces — the information would come back out,
    with no local mechanism identified.`,
  ]
},
{
  id: "f-lentille",
  titre: "Why light goes around",
  sources: [
    ["chandrasekhar1983"],
    ["luminet1979", "chandrasekhar1983"],
    ["chandrasekhar1983", "dyson1920"],
  ],
  t: [
   `Light always travels straight. Always. What changes is <b>what “straight” means</b>.
    <br><br>Put a heavy ball on a stretched sheet: the sheet sags. A light ball rolling
    past follows that dip. It is not being pulled — it goes straight, in something that is
    no longer flat. Space does the same thing around a mass.
    <br><br>Einstein worked this out in 1915, <i>with a pencil</i>. It took four more
    years before anyone could go and check it in the sky.`,

   `This is <b>gravitational lensing</b>. Look just above the black disk:
    you are seeing the <i>underside</i> of the disk, the part that is behind and below it.
    Its light sets off downwards, goes round the back of the black hole, and comes back down to you.
    You are literally seeing the object's back over the top of its head.`,

   `Null geodesics of Schwarzschild. The orbital equation reduces to
    $d^{2}u/d\\varphi^{2} + u = 3GMu^{2}/c^{2}$ with u = 1/r; the right-hand side is the purely
    relativistic term, the one that <b>doubles</b> the Newtonian deflection. 1.75″ at the solar
    limb is the <i>prediction</i>: the 1919 measurements gave 1.98″ ± 0.12 at Sobral and
    1.61″ ± 0.30 at Príncipe — where Eddington was, and it is the less precise of the two
    results. Today γ is constrained to 1.2 × 10⁻⁴ by VLBI, and to 2 × 10⁻⁵ by the Shapiro
    delay from Cassini. It is that equation that gets integrated on screen, not an approximation.`,
  ]
},
{
  id: "f-anneau",
  titre: "The photon ring and the shadow",
  sources: [
    ["bardeen1973"],
    ["bardeen1973", "chandrasekhar1983"],
    ["bardeen1973", "gralla2019", "eht2022"],
  ],
  t: [
   `Get close enough, and light goes flat out <b>into orbit</b>. It goes round and round,
    sometimes several times, before heading off again. A ray of light going all the way round
    an object: that is already hard to picture.
    <br><br>And the black circle you can see is not the black hole — it is its <b>shadow</b>,
    and it is <i>two and a half times bigger</i> than it is. All the light that grazes
    too close gets caught on its way by.
    <br><br>What you are looking at is a hole in the sky.`,

   `The photon sphere sits at 1.5 times the radius of the horizon. The orbit there is
    <b>unstable</b>: the slightest deviation, and the photon either escapes or falls — like a
    marble balanced on a ridge. The shadow, meanwhile, is 2.6 horizon radii: that gap is why
    we see a black disk far wider than the object itself.
    <i>Fire a photon</i> to watch one hold on the ridge.`,

   `Photon sphere at r = 3GM/c², shadow of apparent radius √27 GM/c² ≈ 2.598 r<sub>s</sub>,
    — a diameter of ~53 μas for Sgr A* — hence interferometry on the scale of the globe. The
    n ≥ 1 subrings, carrying the light that has gone round half a turn more, are spaced by a factor
    $e^{-\\pi} \\approx 0.043$ in flux and are almost insensitive to the astrophysics of the disk.
    This is the target of the <b>space EHT</b> (BHEX): the n = 1 ring would become a direct
    measurement of the metric.`,
  ]
},
{
  id: "f-disque",
  titre: "Why it shines",
  sources: [
    ["shakura1973"],
    ["shakura1973", "bardeen1972"],
    ["shakura1973", "balbus1991", "bardeen1972", "yuan2014"],
  ],
  t: [
   `Nothing is burning in there. No fire, no combustion, nothing.
    <br><br>The gas going round rubs against itself, and that friction heats it.
    Rub your hands together hard: you feel the heat. It is exactly the same principle,
    millions of times more violent — up to <i>millions of degrees</i>.
    <br><br><b>The falling is what makes the light.</b> And for turning matter into
    light, a black hole is the most efficient machine in the entire universe.
    Far better than a star.`,

   `The nearby layers turn faster than the distant ones, and that shear dissipates the energy
    of the fall as heat. The efficiency is enormous: up to <i>6 %</i> of the mass energy
    converted into light, against 0.7 % for nuclear fusion in the core of a star.
    <b>A black hole is the most efficient machine in the universe</b> for turning matter
    into radiation.`,

   `Shakura-Sunyaev thin disk (1973), α viscosity carried by the MRI (Balbus-Hawley 1991).
    Efficiency 5.7 % in Schwarzschild, up to 42 % in extremal prograde Kerr.
    Sgr A* is not in that regime: at Ṁ ~ 10⁻⁸ M☉/yr it is in <b>RIAF/ADAF</b>,
    optically thin, cooling inefficient, with most of the energy advected instead of
    being radiated. GRMHD codes (KHARMA, BHAC) reproduce the EHT ring but still
    struggle with the intra-day variability.`,
  ]
},
{
  id: "f-doppler",
  titre: "One side brighter",
  sources: [
    ["luminet1979"],
    ["luminet1979", "eht2019"],
    ["eht2019", "luminet1979", "bardeen1972"],
  ],
  t: [
   `Look carefully at the disk: <b>one side shines much brighter than the other</b>.
    This is not a defect in the image.
    <br><br>The gas is going round at a good fraction of the speed of light. And at those
    speeds, whatever comes towards you looks brighter, whatever moves away goes dim.
    <br><br>It is a bit like an ambulance siren, higher-pitched as it comes closer.
    Except that here it is <i>light</i>, and the contrast is more than a factor of ten.`,

   `This is <b>relativistic beaming</b>. In the inner region, the gas tears along at 30-40 %
    of the speed of light. The approaching side has its brightness multiplied by ten
    and its color shifted towards the blue; the other side dims and reddens.
    This asymmetry is a <i>direct measurement of the direction of rotation</i> of the disk.`,

   `Doppler factor D = 1/(γ(1 − β·n̂)), observed intensity as D³ for a monochromatic
    source, D⁴ integrated bolometric. β ≈ 0.4 at the Schwarzschild ISCO.
    It is on this asymmetry that the EHT concluded M87* rotates clockwise
    and has a jet aligned with the spin. Superimposed on it is the <b>gravitational
    redshift</b> √(1 − r<sub>s</sub>/r), which depends only on the emission radius.`,
  ]
},
{
  id: "f-isco",
  titre: "The last stable orbit",
  sources: [
    ["bardeen1972"],
    ["bardeen1972"],
    ["bardeen1972", "chandrasekhar1983"],
  ],
  t: [
   `Around the Earth, you can put a satellite as low as you like, as long as it avoids the
    atmosphere. You just have to go at the right speed.
    <br><br>Around a black hole, no. There is a distance below which
    <b>no orbit holds any more</b>. You fall, whatever you do, whatever your speed,
    whatever your engine power. The dotted circle marks that border.
    <br><br>This rule does not exist anywhere else. It only shows up here.`,

   `This is the <b>ISCO</b>, the innermost stable circular orbit, at 3 times the radius of the horizon.
    In Newtonian gravity there is always a balance available: too fast and you move away,
    too slow and you move in. In relativity, below the ISCO, that balance disappears —
    <i>the well no longer has a bottom</i>. That is where the accretion disk stops.`,

   `r<sub>ISCO</sub> = 6GM/c² for a = 0; it drops to GM/c² in extremal prograde Kerr and
    rises to 9GM/c² retrograde. It comes out of the effective potential
    $V = -\\dfrac{GM}{r} + \\dfrac{L^{2}}{2r^{2}} - \\dfrac{GML^{2}}{c^{2}r^{3}}$: the r⁻³ term removes the minimum below it.
    Its position fixes the radiative efficiency, and it is by fitting the inner edge of the disk
    that the <b>continuum-fitting method</b> constrains the spin — the main alternative to
    the broadening of the iron Kα line at 6.4 keV.`,
  ]
},
{
  id: "f-rotation",
  titre: "When the black hole spins",
  sources: [
    ["lense1918", "bardeen1972"],
    ["lense1918", "bardeen1972", "blandford1977"],
    ["kerr1963", "bardeen1972", "penrose1969", "blandford1977", "lense1918"],
  ],
  t: [
   `A motionless mass <i>dents</i> space. A spinning mass does something more:
    it <b>drags space along with it</b>, like water round a plughole.
    <br><br>And that changes everything. Around a rotating black hole there is a zone where
    space rushes past so fast that <b>nothing can stay still</b> — no engine, however
    powerful, lets you hold position. You are forced to turn with it.
    <br><br>Another consequence, visible on screen: turning <i>the same way</i> it does,
    you can get much closer in. That is why its shadow is no longer round — it flattens
    on the side where the rotation is coming towards you.
    <br><br>No real black hole is motionless. They are born from stars that were spinning,
    and they feed on gas that is spinning.`,

   `Frame dragging was predicted in 1918 and measured around the Earth in 2011,
    where the effect is tiny. Near a black hole, it dominates everything.
    <br><br>The last stable orbit stops being symmetric:
    3 radii either way with no rotation, but <b>1.16 radii</b> in the direction of the
    rotation at a* = 0.9, against 4.36 going the other way. Almost four times closer on one
    side than on the other.
    <br><br>Hence the point that really changes everything: if matter falls closer in before
    settling, it releases far more energy. The efficiency goes from <i>5.7 %</i>
    of the mass converted into light to 16 % at a* = 0.9, and up to <b>42 %</b> at the
    extremal limit — when nuclear fusion in a star
    tops out at 0.7 %. A rotating black hole is sixty times more efficient than fusion.
    <br><br>That is what makes quasars the most luminous objects in the universe.`,

   `Kerr metric (1963), the only other parameter allowed by the no-hair theorem.
    Frame dragging $\\omega = 2Mar/A$ generates the ergosphere
    $r_E = M + \\sqrt{M^2 - a^2\\cos^2\\theta}$, where no static observer exists.
    <br><br>The ISCO splits:
    $r_{\\text{ISCO}} = 6GM/c^2$ for $a = 0$, dropping to $GM/c^2$ in extremal prograde and
    rising to $9GM/c^2$ retrograde. The radiative efficiency
    $1 - E_{\\text{ISCO}}/mc^2$ goes from <b>5.72 %</b> ($1-\\sqrt{8/9}$) to
    <b>42.3 %</b> ($1 - 1/\\sqrt{3}$).
    <br><br>The rotational energy is <b>extractable</b>: up to 29 % of the mass through the
    Penrose process, and in practice through the Blandford-Znajek mechanism, where magnetic
    field lines threading the horizon power the jets — the one from M87*
    runs for five thousand light-years.
    <br><br><b>What this page simulates:</b> the asymmetric shadow, measured at 2.30 against
    2.40 in theory at a* = 0.9, and the inner edge of the disk following the ISCO.
    <b>What it does not simulate:</b> the ergosphere is not drawn, the slider stops
    at a* = 0.95 because the integrator loses its grip when the prograde photon orbit sticks to
    the horizon. The polar axis no longer carries a seam: the engine now integrates
    in Kerr-Schild, where those coordinates are not singular.`,
  ]
},
{
  /* Written 9 August 2026, because the “simulation” mode needed a fact before it
     could have a switch: what that background sky REALLY looks like. The answer
     outgrew the question — it is never night there, the dust that hides the
     centre is on our side of the galaxy, and the nebulosity out there does exist
     but has a shape. The third level deliberately separates what is measured
     from what we derived here: no paper computes that sky. */
  id: "f-ciel",
  titre: "The sky out there",
  sources: [
    ["schodel2018", "schodel2009", "fritz2011"],
    ["schodel2018", "gallegocano2018", "bovy2017", "paumard2006", "ferriere2012", "lau2013", "fritz2011"],
    ["gallegocano2018", "schodel2018", "schodel2009", "fritz2011", "ferriere2012", "lau2013"],
  ],
  t: [
   `Look at the background: black, with stars scattered about. It looks like the
    sky you know.
    <br><br>The real sky out there looks nothing like it. We are <b>inside</b>
    the densest star cluster in the galaxy. Within a bubble three light years
    across around the ship there is enough material for <b>a million stars</b>.
    The same volume around the Sun holds exactly one: ours.
    <br><br>So it is <i>never night</i> there. All those stars together shine
    like hundreds of full moons — bright enough to read by.
    <br><br>And here is the strangest part: you would see it clearly. From
    Earth this centre is hidden behind so much dust that no eye can reach it.
    But that dust lies along <b>our</b> line of sight, not out there. On site it
    has all but vanished — that is measured. The sky at the centre of the galaxy
    is a clear one, and nobody has ever seen it.`,

   `The numbers are measured, and they are brutal. At one hundredth of a parsec
    from the black hole — two thousand times the Earth-Sun distance — the
    stellar density reaches <b>2.3 × 10⁷ solar masses per cubic parsec</b>. The
    Sun's neighbourhood holds 0.040: that is <i>six hundred million times</i>
    denser.
    <br><br>The density climbs steadily inwards, as a power law of exponent
    <b>1.23 ± 0.05</b> — measured twice, by two independent methods: counting
    the stars one by one, and measuring the diffuse light of those that can no
    longer be told apart.
    <br><br>And yet nothing collides. Even there the nearest neighbour stays
    five or six hundred astronomical units away, nearly twenty times Neptune's
    orbit: countless brilliant points, <b>never disks</b>. Add about eighty
    young massive stars, born together six million years ago.
    <br><br>There is gas too — but not ours. Three ionised arms, the
    “minispiral”, cross the central parsec; and further out, from 1.4 parsecs,
    a ring of gas and dust thick enough to cut a black band across that sky.
    <br><br>As for the dust between us and it: seeing the centre from here means
    crossing <b>more than thirty magnitudes</b> of extinction, a factor of ten
    trillion in visible light. Almost all of it sits in the disk of the galaxy,
    between the centre and us. On site, inside the central parsec, the measured
    extinction falls below a tenth of a magnitude in the infrared.`,

   `<b>The profile.</b> A single power law, density going as <i>r</i><sup>−γ</sup>
    with γ = 1.23 ± 0.05, established twice independently — deep star counts on
    one side, diffuse light from sub-giants and dwarfs at Ks ≈ 19-20 on the
    other — and valid out to the influence radius, 2 to 3 pc. Normalisation:
    ρ(0.01 pc) = (2.3 ± 0.3) × 10⁷ M☉/pc³, i.e. 180 ± 20 M☉ within that radius.
    <br><br><b>The authors' caveats, which matter.</b> That normalisation assumes
    a constant mass-to-light ratio and does not count compact remnants; there is
    no direct measurement below 0.01 pc. And the bright giants do show a
    <i>flat</i> profile below 0.3 pc: the cusp appears only in the faint stars.
    The authors write that some mechanism must have altered their distribution
    or their luminosity. The question is open.
    <br><br><b>What follows is derived here, not published.</b> No refereed paper
    computes the sky seen from inside — the “million stars to the naked eye”
    that circulates goes back to a television series. Taking the measured mass of
    the central parsec, 0.5 to 1.5 × 10⁶ M☉, and 0.5 M☉ per star (standard mass
    function, assumption declared): one to three million stars. At 0.5 pc the
    distance modulus is −6.5, so the naked-eye limit drops to absolute magnitude
    12.5 — nearly the whole cusp clears it. The result is of order a million
    visible stars, against nine thousand over the entire terrestrial sky: a
    factor of one hundred to five hundred, the exact value depending on the mass
    function chosen. At that density the eye no longer separates them all: part
    of it merges into a continuous glow.
    <br><br><b>Integrated brightness</b>, derived as well: 3 × 10⁶ to 3 × 10⁷ L☉
    in the central parsec, seen from 0.5 to 1 pc, i.e. a bolometric magnitude of
    −17 to −20 — between fifty and a thousand full moons, 10 to 250 lux. A
    permanent twilight, still a thousand times fainter than broad daylight.
    <br><br><b>Extinction.</b> A_Ks = 2.42 ± 0.10 measured on the recombination
    lines of the minispiral, extrapolated to A_V > 33 with a law steeper than the
    classical one. Almost all of it lies in the Galactic disk, not at the centre:
    within the central parsec the authors bound A_Ks < 0.1. Locally only two
    things count — crossing an arm of the minispiral, 10⁴ cm⁻³ over 0.1 pc, about
    1.6 visible magnitudes, and the circumnuclear disk, which is frankly opaque,
    its measured clumps giving tens of magnitudes. Its mass, on the other hand,
    remains uncertain by a factor of a hundred between authors, from 10⁴ to
    10⁶ M☉: opaque either way, but we cannot quote its weight.`,
  ]
},
{
  id: "f-etoiles",
  titre: "Stars going round nothing",
  sources: [
    ["gravity2021", "eht2022"],
    ["gravity2020", "gravity2021"],
    ["gillessen2017", "gravity2020", "gravity2021"],
  ],
  t: [
   `Back away. Keep going. The black hole shrinks to a dot, then to nothing at all:
    there is literally nothing left to see in the middle of the screen.
    <br><br>The stars are still there. And they are <b>going round</b>.
    Each one traces a long loop about the same empty spot. A loop like that is
    called an <i>orbit</i>: the path an object follows when something else's
    gravity holds on to it. The Earth traces one around the Sun, the Moon one
    around the Earth. There is always something in the middle.
    <br><br>Except that here, in the middle, there is no star. Nothing.
    And it is that nothing that holds them.
    <br><br>To get this picture, astronomers photographed the same small patch of
    sky for <b>thirty years</b>. That is where the discovery is — not in the 2022
    image, which came long afterwards.`,

   `What you are looking at is a set of ellipses sharing a <b>focus</b>. Not a
    centre: a focus. The empty point sits off to one side along the major axis,
    and that offset is already the signature of a Keplerian orbit. From there, two
    measurements are enough.
    <br><br>Follow one star through a complete revolution, read off its semi-major
    axis <i>a</i> and its period <i>P</i>. Kepler's third law gives the mass at the
    focus, $P^{2} = 4\\pi^{2}a^{3}/GM$, which sheds every constant if you count
    <i>a</i> in astronomical units, <i>P</i> in years and <i>M</i> in solar masses:
    $M = a^{3}/P^{2}$.
    <br><br>For S2, using the published values: apparent semi-major axis 0.125″,
    which is 1,031 AU at 8,247 pc, and a period of 16.05 years. The arithmetic
    fits on one line, $1031^{3}/16.05^{2} \\simeq 4.26 \\times 10^{6}$. Four and a
    quarter million suns — and the full published fit gives
    <b>4.261 ± 0.012 × 10⁶ M☉</b>. A law from 1619, right to within a thousandth.`,

   `The elements plotted here come from <b>Gillessen et al. 2017</b>, the table of
    forty orbits: <i>a</i> in arcseconds, <i>e</i>, the three angles <i>i</i>, Ω, ω,
    the epoch of pericentre, the period. They are <b>osculating elements</b> — the
    orbit is Keplerian only to first order, and the parameters hold for a reference
    epoch, the 2010 apocentre in GRAVITY's case.
    <br><br>Converting angle to length goes through R₀, so mass and distance are
    correlated, as $M \\propto R_{0}^{2}$ for an astrometric fit. That is why the
    published values move from paper to paper with none of them being wrong:
    G17 gives 4.28 ± 0.10 × 10⁶ M☉ at 8.32 kpc, GRAVITY 2020 gives 4.261 ± 0.012
    at 8,246.7 pc, GRAVITY 2022 gives 4.297 ± 0.012 at 8,277 pc. <b>Never mix rows
    from different tables into one set of elements.</b>
    <br><br>The modern fit has fourteen parameters per star: six orbital elements,
    R₀, M•, five coordinates for the on-sky position and the 3D velocity of the
    mass relative to the astrometric frame, and one dimensionless parameter for the
    post-Newtonian effect under test. Combining four stars — S2, S29, S38, S55 —
    GRAVITY obtains $f_{SP} = 0.997 \\pm 0.144$: the relativistic precession
    measured to 14 %.`,
  ]
},
{
  id: "f-s2",
  titre: "S2, the witness",
  sources: [
    ["gravity2018", "gillessen2017"],
    ["gravity2018", "gravity2020", "habibi2017"],
    ["gravity2020", "gravity2021"],
  ],
  t: [
   `Of all the stars you can see going round, one does nearly all the work:
    <b>S2</b>.
    <br><br>It has three qualities, and having them together is rare. It is among
    the brightest of the set, so it is easy to track in a very crowded place. It
    completes its circuit in just <i>sixteen years</i> — few enough that an
    astronomer sees several in one career. And its orbit is very elongated: it
    dives in close, then swings far out again.
    <br><br>In May 2018 it made its closest approach. At a hundred and twenty times
    the Earth-Sun distance, travelling at <b>7,650 kilometres per second</b>, two
    and a half per cent of the speed of light. Everyone was watching, and had been
    for sixteen years.`,

   `S2 is a young, hot star: spectral type B0 to B3 on the main sequence, between
    8 and 14 solar masses for the S-stars studied, an age of order
    <i>7 million years</i>. Nothing exotic. What matters is its orbit:
    $e = 0.884$, period 16.05 years, pericentre at 120 AU, about
    <b>1,400 Schwarzschild radii</b>.
    <br><br>At that distance general relativity stops being an invisible
    correction. At the 2018 passage the expected redshift was measured — the
    combined gravitational redshift and transverse Doppler effect, about 200 km/s
    expressed as a velocity. Parameterising the departure from Newton by a factor
    <i>f</i> equal to 0 for Newton and 1 for Einstein, the measurement gives
    <i>f</i> = 0.90 ± 0.09 (stat) ± 0.15 (sys). The S2 data are <b>inconsistent
    with pure Newtonian dynamics</b>.
    <br><br>Two years later, the pericentre precession: the major axis of the
    ellipse swings round by <i>12 arcminutes per revolution</i>. The orbit does not
    close on itself — it slowly traces a rosette.`,

   `A fourteen-parameter fit, osculating elements referred to the 2010 apocentre.
    GRAVITY 2020, on data up to the end of 2019: $a = 125.058 \\pm 0.041$ mas,
    $e = 0.884649$, $P = 16.0455 \\pm 0.0013$ yr, $t_{p} = 2018.379$,
    $f_{SP} = 1.10 \\pm 0.19$ — the Schwarzschild precession detected,
    $\\Delta\\varphi \\simeq 12'$ per period.
    <br><br>The S2 data set spans <b>1992.2 to 2021.6</b>: 128 NACO astrometric
    positions, 92 SINFONI spectra, 82 GRAVITY positions, plus 3 Keck spectra,
    2 NACO and 4 GNIRS/Gemini. Three techniques, one orbit.
    <br><br>What it constrains: M• and R₀, correlated; the first-order
    post-Newtonian terms, gravitational redshift ($f = 0.90 \\pm 0.09 \\pm 0.15$ in
    2018, later $1.04 \\pm 0.05$) and pericentre precession; and a bound on any
    extended mass inside the orbit. What it does not constrain: the <b>spin</b>.
    It appears in none of these fits — the fourteen-parameter model has no term for
    it. Kerr geometry is not tested by stellar orbits; that is another
    instrument's job.`,
  ]
},
{
  id: "f-preuve",
  titre: "Why it can't be anything else",
  sources: [
    ["schoedel2003", "maoz1998"],
    ["genzel2010", "maoz1998", "gravity2021"],
    ["genzel2010", "maoz1998", "schoedel2003", "gravity2021"],
  ],
  t: [
   `“Four million suns in a tiny space.” Fine — but why a black hole? Why not
    simply <i>a lot of stars</i>, packed tight, too faint for us to see from here?
    <br><br>Because a pile of objects that tightly packed <b>does not hold
    together</b>. They graze each other, they collide, they trade speed on the way
    past: some get flung outwards, others fall towards the centre. The pile drains
    and collapses. We can work out how long that takes, and the answer is
    <b>less than a hundred thousand years</b>.
    <br><br>A hundred thousand years, against a galaxy that has been around for ten
    billion, is the blink of an eye. We would have to have turned up at exactly the
    right moment to catch it. Nobody bets on that.`,

   `The argument is an <b>elimination</b>, not a direct observation. You measure a
    mass and a volume, hence a density, and then ask what could hold that density
    up.
    <br><br>The proper motions detected between 1996 and 1998 — of order 1,000 km/s
    over 0.02 parsec — already required 10¹² solar masses per cubic parsec, which
    capped the lifetime of a cluster of dark objects at 10⁷-10⁸ years. Orbit
    tracking since 2002, S2 above all, gained <i>four orders of magnitude</i>:
    about 10¹⁶ M☉/pc³. At that density a cluster of brown dwarfs, white dwarfs,
    neutron stars, stellar black holes or even rocks is destroyed by relaxation and
    collisions — core collapse, evaporation — in <b>a few hundred thousand
    years</b>.
    <br><br>There is better now. Combining four stars, GRAVITY shows the potential
    is that of a <i>single point mass</i>: any additional extended mass out to
    230 milliarcseconds is limited to <b>3,000 solar masses</b>, one thousandth of
    the total.`,

   `The chronology of the elimination. 1996-1998: proper motions of the S-stars, of
    order $10^{3}$ km/s on a scale of 0.02 pc, require
    $\\rho \\gtrsim 10^{12}\\,M_{\\odot}\\,\\mathrm{pc}^{-3}$; at that density a
    collisional cluster lives $\\sim 10^{7-8}$ yr (Maoz 1998). Orbits, from 2002 on,
    gain four orders of magnitude,
    $\\sim 10^{16}\\,M_{\\odot}\\,\\mathrm{pc}^{-3}$, and the lifetime drops below a few
    $10^{5}$ yr — a vanishing fraction of the lifetime of the stars in the central
    cusp. Schödel et al. 2003 put the same argument as a Plummer model: the central
    density would have to exceed
    $2.2 \\times 10^{17}\\,M_{\\odot}\\,\\mathrm{pc}^{-3}$.
    <br><br>The collisionless alternatives need separate treatment. A degenerate
    <b>fermion ball</b> accounting for <i>all</i> the dark concentrations in
    galactic nuclei is excluded; a <b>boson star</b> would in any case end up
    collapsing to a black hole by accreting the gas and dust of the Galactic
    Centre.
    <br><br>Current state: a Plummer profile of scale length 0.3″ fitted jointly
    with everything else, $M_{\\mathrm{ext}} \\lesssim 3{,}000\\,M_{\\odot}$ out to
    230 mas; the enclosed mass only tentatively exceeds M• beyond
    $r \\gtrsim 2.5''$, consistent with the expected stellar distribution. No dark
    matter component and no intermediate-mass black hole above
    $10^{3}\\,M_{\\odot}$ is required by, or compatible with, the data. What this
    route does not settle is the existence of a <i>horizon</i>: orbits constrain a
    mass and a compactness, not a surface of no return.`,
  ]
},
{
  id: "f-nobel",
  titre: "Thirty years for a proof",
  sources: [
    // Ghez 1998 is the Keck work this level describes: it is the source for
    // the claim that two teams shared nothing and still agreed.
    ["nobel2020", "penrose1965", "ghez1998"],
    ["gravity2021", "gravity2018", "genzel2010"],
    ["gravity2021", "nobel2020", "penrose1965", "eht2022"],
  ],
  t: [
   `The 2020 Nobel Prize in Physics rewarded exactly this reasoning.
    <br><br>One half went to <b>Reinhard Genzel</b> and <b>Andrea Ghez</b>, a
    quarter each, “<i>for the discovery of a supermassive compact object at the
    centre of our galaxy</i>”. Two teams with nothing in common: one measuring at
    ESO's VLT in Chile, the other at the Keck telescope in Hawaii. They tracked the
    same stars for thirty years, each on their own, taking nothing on trust from
    the other — and they agreed.
    <br><br>The other half went to <b>Roger Penrose</b>, and this is the thing not
    to confuse: his work has nothing to do with these measurements. In 1965, with
    paper and pencil, he proved that the formation of a black hole is an
    <i>unavoidable consequence</i> of Einstein's theory. He observed nothing. He
    showed it had to exist.`,

   `What it took, technically, for this picture to exist.
    <br><br>At the start, atmospheric turbulence limited images to
    <i>0.4-0.5 arcseconds</i> across: at that resolution the Galactic Centre is a
    smear and the S-stars run into one another. <b>Adaptive optics</b> — a
    deformable mirror correcting the turbulence in real time — brought 8-to-10-metre
    class telescopes down to <i>50-60 milliarcseconds</i>, with positions measured
    to 300-500 microarcseconds.
    <br><br>Then <b>interferometry</b>. You combine the light of the four VLT
    telescopes, and the whole thing resolves as a mirror as wide as their
    separation would. That is GRAVITY, in service since 2016: a beam of
    <i>2 × 4 milliarcseconds</i>, and positions to
    <b>30-100 microarcseconds</b>. A factor of ten gained on precision — just in
    time for the pericentre passage of May 2018.`,

   `The instrumental gain, in numbers. Seeing-limited imaging: 0.4-0.5″ FWHM.
    Adaptive optics on 8-10 m class: 50-60 mas, astrometry 300-500 μas.
    GRAVITY/VLTI: a 2 × 4 mas beam, astrometry 30-100 μas, sensitivity
    $m_{K} = 20$ when combining one night's data.
    <br><br><b>Spectroscopy</b> is not a garnish. Astrometry alone gives an orbit
    in units of angle; it is the radial velocity, in kilometres per second, that
    supplies the physical scale and lets R₀ be extracted jointly with M•. Without
    it the orbit stays degenerate along the line of sight — which is precisely why
    some stars in Gillessen's table, S55 for one, are less well constrained than
    their short period would suggest.
    <br><br>Nobel 2020: one half to Penrose for the 1965 <b>singularity
    theorem</b>, a theoretical result unrelated to infrared astrometry; a quarter
    to Genzel, a quarter to Ghez, for the discovery of a supermassive compact
    object at the centre of our galaxy. The official wording does say
    “<i>supermassive compact object</i>”, not “black hole”. The committee was
    careful, and it was right to be: orbits constrain a mass and a density, not a
    horizon. The horizon was the EHT's business, two years later.`,
  ]
},
{
  id: "f-exact",
  titre: "Is this true?",
  sources: [
    ["chandrasekhar1983"],
    ["chandrasekhar1983", "bardeen1973"],
    ["chandrasekhar1983", "bardeen1972", "yuan2014", "eht2022"],
  ],
  t: [
   `Yes. And it is the best part of the whole story.
    <br><br>Nobody drew this picture. For each of the two million points on your
    screen, the computer fires a ray of light and follows it <i>backwards</i>, obeying
    equations written in 1915. The ring, the shadow, the disk folded over the top:
    <b>all of it comes out of the calculation, on its own</b>.
    <br><br>People wrote those equations with a pencil, more than a hundred years ago, with no
    computer, having never seen a black hole — some of them doubted the things even existed.
    A century later, a machine applies them and finds <b>exactly</b> what the
    telescopes eventually photograph.
    <br><br>That is what physics is. And it is mad.`,

   `This is geodesic ray tracing, not a warp filter. Every pixel integrates the
    path of a photon in the Schwarzschild metric. The proof that it is not
    rigged: the photon sphere falls <i>exactly</i> at 1.5 horizon radii, the shadow at
    2.598, and the disk's secondary image shows up without anyone asking for it.
    <b>These are results, not settings.</b>`,

   `<b>Exact</b> — null geodesics integrated in Cartesian form,
    $\\mathbf{a} = -\\tfrac{3}{2}h^{2}\\mathbf{r}/r^{5}$ with $h = \\lVert\\mathbf{r}\\times\\dot{\\mathbf{r}}\\rVert$, equivalent to the Binet form $d^{2}u/d\\varphi^{2} + u = 3Mu^{2}$:
    hence the photon sphere at 1.5 r<sub>s</sub>, the shadow at √27/2, order-n images,
    Keplerian Ω in r<sup>−3/2</sup>, and the photon orbital period 6√3·πGM/c³.<br><br>
    <b>Approximated</b> — the disk, not the geometry: rotation is available and
    wired into Kerr, with the caveat about the polar axis described below.
    Geometrically thin and optically thin disk, ad hoc emissivity instead of a GRMHD,
    no radiative transfer. The <i>gravitational redshift</i> is applied only as g¹ to the
    luminosity, with a floor, where the law goes as g³ — and with no color shift:
    the same flaw we own up to for the Doppler. That one takes β in
    coordinates, caps it at 0.85 and omits γ, giving an error of γ³−1 ≈ 32 % at the inner edge,
    and not 10 %. The trajectory overlay is projected straight, with no lensing. The probes
    follow the timelike geodesic (same equation plus the Newtonian term), integrated in
    <i>coordinate time</i> and not in proper time.`,
  ]
},
],

// ------------------------------------------------- the “this is exact” dossier
methodeSources: [
  ["chandrasekhar1983", "eht2022"],
  ["chandrasekhar1983", "dyson1920", "bardeen1973", "bardeen1972"],
  ["chandrasekhar1983", "bardeen1972", "bardeen1973", "yuan2014", "eht2022", "luminet1979"],
],

/* The editor's note.

   The dossier promised "and what, inside it, is not" from the very beginning,
   and never delivered. Here is the list, sorted into three — because "it's
   wrong" covers three very different things, and conflating them is exactly
   what makes a site impossible to check:

   what we CHOSE to bend so it would be playable;
   what science does not yet KNOW;
   what our own code does badly.

   It shows at all three reading levels: this is not advanced material, it is
   the contract. */
notes: {
  titre: "Editor's note",
  chapeau: "Everything else on this site is computed. Here are the places where it is not, or not entirely.",
  groupes: [
    {
      titre: "What we bent on purpose",
      chapeau: "Deliberate choices, so that it stays playable and legible.",
      points: [
        { id:"gravite-vaisseau", ou:"salon",
          aveu:"Gravity in the lounge is magic: in orbit you should be floating.",
          t:"<b>Gravity inside the ship.</b> We are in orbit: we should be floating, and so should everything not bolted down. Since a weightless lounge is unplayable, we decided gravity here is magic. It is the one thing about the ship that plainly breaks physics, and it is on purpose." },
        { id:"temps-accelere", ou:"reglage-temps",
          aveu:"Time is sped up. The first notch of the dial is real time.",
          t:"<b>Sped-up time.</b> At true scale one orbit takes hours and nothing happens on screen. Every setting states its factor, and the first one is real time — where almost everything stops moving." },
        { id:"taille-sondes", ou:"reglages",
          aveu:"Probes are enlarged so they exist on screen.",
          t:"<b>The size of the probes.</b> A real spacecraft would be a few millionths of a pixel across. We enlarge them so they exist at all, and the setting offers a choice rather than imposing one size." },
        { id:"rotation-couteuse", ou:"etude",
          aveu:"Spin costs nine times the computation. It lives only here.",
          t:"<b>Why only this black hole spins.</b> Setting spacetime rotating means integrating rays through a geometry where nothing stays symmetric: each frame costs about nine times one of a still black hole. The display black holes therefore stay frozen, and spin lives here, at this station, where you come on purpose and where the cost is paid deliberately." },
        { id:"rythme-voyage", ou:"reglages",
          aveu:"The journey has two paces: one faithful, one evened out.",
          t:"<b>The pace of the journey.</b> Seen from the window, a receding ship shrinks very fast at first and then ever more slowly — doubling a small distance changes everything, doubling a large one barely shows. That is faithful, and it is uneven. The second pace spreads the motion out so you leave gently, race through the middle of the trip and slow down on arrival. In both, the speed and time stretch on display remain those of the real position: only the cadence is retouched." },
        { id:"moteur-1g", ou:"telescope",
          aveu:"The one-g drive is granted. Nobody knows how to build it.",
          t:"<b>The one-g engine.</b> Nobody knows how to build it, and nothing comes close. We grant it so that travel is possible — but the telescope shows what it would actually cost in fuel, and the figure is crushing." },
        { id:"texture-radio", ou:"spectre",
          aveu:"The disc texture is a look, not radiative transfer.",
          t:"<b>The texture of the disc at radio wavelengths.</b> That is an appearance effect, not a radiative transfer calculation. The sizes are measured, though: at three centimetres, the emitting region really does reach thirty-seven radii." },
        { id:"quadrillage-recul", ou:"recul",
          aveu:"Nothing grids space. This reference exists only while moving.",
          t:"<b>The grid during the retreat.</b> Nothing grids space. It exists only while moving, because in true emptiness nothing proves you are travelling — and without it, four decades look like a frozen screen." },
        { id:"carte-etoiles", ou:"arrivee-etoiles",
          aveu:"A reconstruction, not a view: nobody has watched these orbits turn.",
          t:"<b>The chart of the S stars.</b> It is a reconstruction, not a view. These orbits last from sixteen to three hundred and thirty-one years: nobody has ever watched them go round. They were measured over thirty years, and that is precisely the point." },
        { id:"decor-personnages", ou:"salon",
          aveu:"The ship and the people are drawn, not measured.",
          t:"<b>The set and the people.</b> Everything is computed and nothing is imported — but a ship and its crew are not measurements." },
        { id:"fond-ciel", ou:"partout",
          aveu:"The background is false; the way gravity bends it is right.",
          sources:["schodel2018", "bovy2017", "ferriere2012", "lau2013"],
          /* The admission follows the render mode, since 9 August 2026 — because
             the nebula is switched off in simulation, and an admission that
             denounces something absent from the screen teaches people to stop
             reading admissions at all. */
          selonMode:{
            cinema:{
              aveu:"The purple veil is the cinema part: it does not exist.",
              sources:["schodel2018"],
              t:"<b>The background sky, in cinema.</b> What this mode adds is right in front of you: the purple nebula and its coloured bands, which do not exist. Switch to simulation and they go out. What does not change: the stars are still scattered at random, and the background is still black — while out there it is never night. What is exact in both modes is the way gravity bends that light." },
            simulation:{
              aveu:"The nebula is off. This black sky is still false: out there, it is never night.",
              sources:["schodel2018", "bovy2017", "ferriere2012", "lau2013"],
              t:"<b>The background sky, in simulation.</b> The purple veil is gone: it was invented. What remains false is harder to see. The stars are scattered at random, there are a hundred times too few of them, and above all this blackness does not exist — inside the nuclear cluster the whole sky weighs hundreds of full moons. There is real nebulosity out there too, three arms of ionised gas and an opaque ring of dust, which we do not paint. What is exact here as in cinema is the way gravity bends that light." },
          },
          t:"<b>The background sky.</b> Its stars are scattered at random, and the purple nebula is scenery: neither surveyed positions nor computed emission. The real sky out there is far richer — the measured density in the nuclear cluster is six hundred million times that of the solar neighbourhood, and it is never night there. There is even real nebulosity on site, but it has a shape: three arms of ionised gas and an opaque ring of dust, nothing like our purple veil. What is exact in this image is the way gravity bends that light: the background is invented, its distortion is not." },
      ],
    },
    {
      titre: "What nobody knows",
      chapeau: "Real unknowns, and none of them our doing.",
      points: [
        "<b>The spin of Sagittarius A*.</b> It has not been measured. The four values offered in the settings are hypotheses, not observations, and the panel says so every time. That is why a separate study black hole exists, where hypotheses belong.",
        "<b>The depth orientation of the star swarm.</b> Their positions on the sky are solid. The direction of depth depends on a convention the papers cite without restating, and telling the two readings apart would need a figure we could not recover. So the view marks no direction towards Earth and no near side: the discrepancy, if there is one, cannot be seen.",
      ],
    },
    {
      titre: "What our own code does badly",
      chapeau: "Our limits, not physics'.",
      points: [
        "<b>The onboard screens are drawn flat.</b> They have no true perspective, and nothing passes in front of them.",
        "<b>The disc stops at eleven radii.</b> A real accretion flow reaches much further, but its outer part is cold and dark; cutting it there costs the image little and saves a great deal of computation.",
        "<b>The well is too deep right near the edge.</b> Light does follow the true geodesics. But the probes are computed with a shortcut: Newton's gravity plus a correction term. That shortcut is excellent — it recovers the innermost stable orbit exactly, and exactly the periastron advance measured on the star S2. Its limit lies elsewhere: below two radii you would need to exceed the speed of light to leave, whereas the true answer is one radius. In other words, between one and two radii our probes are trapped a little too early.",
      ],
    },
  ],
},

methode: [
// ----------------------------------------------------------------- Newcomer
`<h3>First, what a fake looks like</h3>
 <p>The easy way to make a pretty black hole is to take a photo of stars and
 <b>twist it</b>, the way things look through the bottom of a bottle.
 You drop a black circle in the middle, an orange ring around it, and you're done. It can be
 very beautiful. But it doesn't mean anything: we could have made the circle twice as big
 and nobody would have spotted the difference.</p>

 <h3>What this page does</h3>
 <p>Here there is <b>no twisted photo and no drawn circle</b>. For each of the two
 million points on your screen, the computer asks itself one question:
 <i>where does the light arriving here come from?</i> And it walks that ray's path
 backwards, one small piece at a time, obeying the way a mass hollows out the
 space around it.</p>
 <p>The ray moves forward, it gets bent a little. It moves on, it gets bent a little more.
 At the end of the journey, three things can happen to it: it ends up inside the black hole
 — and the point is black; it passes through the burning gas — the point is orange;
 or it heads off towards the stars — the point is starry. That is the whole program.</p>

 <h3>Why this isn't just a nice drawing</h3>
 <p>Because <b>nobody decided the size of the black circle</b>. It comes out of the calculation.
 And the value that comes out is exactly the one physicists found
 with paper and pencil, long before computers: 2.6 times the size of the black hole.
 If the program were wrong, that number would be wrong.</p>
 <p>Same for the bright ring, for the fact that you see the <i>underside</i> of the disk
 over the top of it, for the side that shines more than the other. None of that was drawn
 by hand. They are <b>consequences</b>.</p>
 <p>And you don't have to take my word for it: the button at the bottom re-runs the calculation
 in front of you and compares what the machine finds against what the theory says.</p>

 <h3>What, on the other hand, is not true</h3>
 <p>Let's be honest. The colors are invented: the real Sagittarius A* is
 far fainter, and you only see it with radio antennas, not with eyes.
 The shape is right. The scenery is plausible, but hand-painted.</p>
 <p>And then there is the ship. We are in orbit, which means in <b>free fall</b>:
 in real life, everything would float. You, the person next to you, and the cup somebody
 left on the console.</p>
 <p>So, in full transparency: <b>for reasons of comfort and plot, management has
 decreed that gravity aboard shall be magic.</b> The cups had to go
 somewhere.</p>
 <p>That is the only lie on this page. Everything else is calculated, and I'd rather tell
 you before you notice — it saves me looking as though I'd forgotten.</p>`,

// ------------------------------------------------------------------- Curious
`<h3>The fake: a screen-space distortion</h3>
 <p>A cheap render applies a <b>radial displacement of the pixels</b> around a center,
 then lays a ring and a black disk on top. The signature is recognizable:
 no multiple images, the size of the shadow is a free slider, and the distortion
 doesn't react correctly when you change the viewing angle.</p>

 <h3>The real thing: we follow the light</h3>
 <p>Each pixel defines a starting direction. We integrate the photon's path
 in the <b>Schwarzschild metric</b> until it passes under the horizon, crosses
 the disk, or leaves for infinity. At each step we know the position and the direction,
 and we apply an acceleration:</p>
 $$\\mathbf{a} = -\\frac{3}{2}\\,\\frac{h^{2}\\,\\mathbf{r}}{r^{5}}
   \\qquad\\text{with } h = \\lVert \\mathbf{r}\\times\\mathbf{v} \\rVert \\text{ conserved}$$
 <p>That's all. Two lines, and the whole optics of the black hole follows from them.
 The <code>h</code> is the photon's angular momentum: it doesn't change along the ray,
 and the fact that it stays numerically constant is already a quality check.</p>

 <h3>The four numbers that settle it</h3>
 <p>An exact simulation has to recover, <b>without being fed them</b>, values
 computed analytically a century ago:</p>
 <ul>
   <li>The photon sphere at <i>1.5</i> Schwarzschild radii</li>
   <li>The apparent radius of the shadow: $\\sqrt{27}/2 \\approx 2.598$</li>
   <li>The deflection at large distance: $\\alpha = 4GM/c^{2}b$</li>
   <li>The last stable orbit for matter: <i>3</i> radii</li>
 </ul>
 <p>The third is the most telling. Newton <b>also</b> predicted a deflection of
 light — but half as large. It is that factor of 2 that Eddington went to measure
 during the 1919 eclipse, and that made Einstein famous overnight. If this page's
 engine gave the Newtonian value, it would be wrong, and the test bench
 below would show you.</p>

 <h3>The limit, said plainly</h3>
 <p>The optics is exact; the astrophysics is not. The disk is a plausible
 texture, not a simulation of plasma flow.</p>
 <p>Rotation, though, <b>is</b> simulated: the spin slider switches over to the
 Kerr metric, the shadow goes off-center and the ISCO moves. It long carried a thin seam on the rotation
 axis — a flaw of the coordinates used, not of the calculation. The engine now
 integrates in Kerr-Schild, where that axis is not singular, and the seam is gone.</p>`,

// ------------------------------------------------------------ Astrophysicist
`<h3>Formulation</h3>
 <p>Backward ray tracing of null geodesics in Schwarzschild. We integrate the
 Cartesian form</p>
 $$\\mathbf{a} \\;=\\; -\\frac{3}{2}\\,\\frac{h^{2}\\,\\mathbf{r}}{r^{5}},
    \\qquad h = \\lVert \\mathbf{r}\\times\\dot{\\mathbf{r}} \\rVert$$
 <p class="cm">Geometric units: $G = c = r_s = 1$, hence $M = \\tfrac{1}{2}$.</p>
 <p>equivalent to the Binet equation</p>
 $$\\frac{d^{2}u}{d\\varphi^{2}} + u = 3Mu^{2}, \\qquad u = 1/r$$
 <p>obtained by eliminating the affine parameter between the first integrals
 $E = \\left(1-\\tfrac{2M}{r}\\right)\\dot{t}$ and $L = r^{2}\\dot{\\varphi}$.
 The $3Mu^{2}$ term is the <b>only</b> departure from the Newtonian case: it is what
 carries all the general relativity in the image.</p>

 <h3>Numerical scheme</h3>
 <p>Velocity-Verlet integrator with adaptive step
 $\\Delta\\lambda = \\operatorname{clamp}(0.085\\,r;\\,0.045;\\,1.4)\\big/\\lVert\\dot{\\mathbf{r}}\\rVert$,
 240 steps at most, terminating on $r < 1$ (capture) or $r > 70$ while receding.
 The direction is <b>never</b> renormalized: $\\lambda$ is an affine parameter, where</p>
 $$\\left\\lVert \\frac{d\\mathbf{r}}{d\\lambda} \\right\\rVert^{2} = 1 + \\frac{2Mh^{2}}{r^{3}}$$
 <p>is not constant. Forcing the norm to 1 is the natural mistake, and it inflates
 the shadow by 55 % — it was the test bench below that flushed it out. $h^{2}$ is
 evaluated once at the start: it is not an imposed constraint but a constant
 of the motion.</p>
 <p>The bench replays these geodesics in JavaScript with the same equation and the same
 constants as the GLSL, but with a step twenty to a hundred times finer and a ceiling
 raised to two million steps instead of 240: it measures
 the correctness of the <i>formulation</i>, not that of the shader's real-time budget.
 The four quantities obtained are <b>outputs</b> of the scheme, never parameters.</p>

 <h3>The matter probes</h3>
 <p>They follow</p>
 $$\\mathbf{a} = -\\frac{M}{r^{3}}\\left(1 + \\frac{3h^{2}}{r^{2}}\\right)\\mathbf{r}$$
 <p>the Cartesian form of the timelike Binet equation
 $\\;\\dfrac{d^{2}u}{d\\varphi^{2}} + u = \\dfrac{M}{h^{2}} + 3Mu^{2}$.
 It gives back $h^{2} = \\dfrac{Mr^{2}}{r-3M}$ for circular orbits — hence the
 divergence at $r = 3M$, which <i>is</i> the photon sphere — and, by setting
 $V''_{\\text{eff}}$ to zero, the ISCO at exactly $6M$. Periapsis precession comes out
 at the right order.</p>
 <p><b>Caveat:</b> the integration is parameterized in coordinate time and not in proper time.
 The paths through space are right; the rate at which they are travelled
 is no longer right near the horizon.</p>

 <h3>What is deliberately not simulated</h3>
 <ul>
   <li><b>Spin — partially simulated.</b> Two engines coexist and we switch on
       the value of <i>a</i>. At a = 0, Cartesian Schwarzschild integration, with
       no coordinate singularity at all. At a ≠ 0, a Hamiltonian in Cartesian Kerr-Schild: frame dragging, ergosphere, displaced ISCO and
       prograde/retrograde asymmetry are then present. The validation bears on
       the <i>asymmetry</i> of the critical impact parameter — 2.30 measured against 2.40
       expected at a* = 0.9 — and not on the absolute values, the floor of the
       pixel-based measurement being 5 to 7 %. The polar axis no longer carries a seam: the move to Kerr-Schild has been made,
       and those coordinates are not singular there. Measured before and after on the
       same camera, the discontinuity on the axis drops from 78-310 levels to 2-26.</li>
   <li><b>The radio photosphere.</b> Its radius follows a law drawn from the
       measurements — the flow becomes opaque at long wavelength, and that is why
       the shadow is unobservable in the radio and why the Event Horizon Telescope
       works at 1.3 mm. Its <i>appearance</i>, on the other hand, is made up:
       the limb darkening is that of a luminous sphere, but the
       mottling that animates it is deterministic noise, not a measured
       brightness map. It is there to make clear that you are looking through
       a gas rather than at a flat coat of paint. Nothing in there is a prediction.</li>
   <li><b>Radiative transfer.</b> Ad hoc emissivity from fractal noise, crude absorption.
       No opacity, no synchrotron, no Comptonization. A publishable render starts
       from a GRMHD (KHARMA, BHAC) post-processed by a transfer code (ipole, RAPTOR).</li>
   <li><b>Disk geometry.</b> Thin and flat, whereas a RIAF like Sgr A* is
       geometrically thick, H/R ~ 1.</li>
   <li><b>Doppler.</b> <code>D = 1/(1 − β·n̂)</code> without the γ factor. Since the error
       on the intensity goes as D³, the amplitude error is of order γ³−1 ≈ 32 % at the
       inner edge: the qualitative asymmetry is
       right, the absolute contrast is not.</li>
   <li><b>Simultaneity.</b> The image is instantaneous; we ignore the fact that light coming
       from the back of the disk is older than light from the front edge.</li>
 </ul>

 <h3>The test that really tells them apart</h3>
 <p>A screen-space post-process <b>cannot</b> produce order-n images:
 it is a bijection of the image plane onto itself, whereas the true
 observer → source map is infinitely folded in the neighborhood of <code>b_c</code>.
 That is the discriminant. Here the disk's second ring is visible to the naked eye,
 and a third one exists below the resolution threshold.</p>`,
],

};
