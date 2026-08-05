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

// ---------------------------------------------------------------- references
sources: {
  gravity2021: {
    ref: "GRAVITY Collaboration (Abuter et al.), “Mass distribution in the Galactic Centre based on interferometric astrometry of multiple stellar orbits”, Astronomy & Astrophysics 657, L12 (2022)",
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
    sert: "Apparent radius of the shadow, critical impact parameter b_c = √27 GM/c²",
  },
  luminet1979: {
    ref: "J.-P. Luminet, “Image of a spherical black hole with thin accretion disk”, Astronomy & Astrophysics 75, 228-235 (1979)",
    sert: "First computed image of a thin-disk black hole: secondary image, Doppler asymmetry",
  },
  gralla2019: {
    ref: "S. E. Gralla, D. E. Holz, R. M. Wald, “Black hole shadows, photon rings, and lensing rings”, Physical Review D 100, 024018 (2019)",
    doi: "10.1103/PhysRevD.100.024018",
    sert: "Shadow / photon ring distinction; spacing of order-n subrings as e^(−π)",
  },
  shakura1973: {
    ref: "N. I. Shakura, R. A. Sunyaev, “Black holes in binary systems. Observational appearance”, Astronomy & Astrophysics 24, 337-355 (1973)",
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
    sert: "Birkhoff's theorem: outside a spherical distribution, the metric depends only on M",
  },
  chandrasekhar1983: {
    ref: "S. Chandrasekhar, The Mathematical Theory of Black Holes, Oxford University Press (1983), chap. 3",
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
    sert: "Tides going as M/r³, regular free fall through the horizon, maximum proper time πGM/c³",
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
