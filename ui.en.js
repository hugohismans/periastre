/* ============================================================================
   Interface strings, English.

   This file OVERLAYS ui.fr.js rather than replacing it. Anything missing here
   falls back to a real French sentence instead of a bare key — ugly on screen
   is one thing, but a bare key also hides the gap from whoever proofreads.

   Several labels below are not open choices. The English pedagogical content
   already names them in its mission instructions — "Drop 80 probes", "Real
   light", "Come aboard", "the lounge" — and an instruction that points at a
   button spelled differently points at a button that does not exist.
   ============================================================================ */

Object.assign(window.UI, {

  // ---- units, read by voyage1g.js under the `u.` prefix ----
  "u.langue":              "en",
  "u.pluriel":             "s",
  "u.an":                  "year",
  "u.jour":                "day",
  "u.heure":               "h",
  "u.minute":              "min",
  "u.al":                  "light years",
  "u.ua":                  "astronomical units",
  "u.masses":              "kg for every kg that arrives",
  "dest.mais":             ", but ",

  // ---- the bottom bar ----
  "dock.pluie":            "Drop 80 probes",
  "dock.photon":           "Photon",
  "dock.effacer":          "Clear",
  "dock.reel":             "Real light",
  "dock.reel.rallumer":    "Bring the colours back",
  "dock.spectre":          "Spectrum",
  "dock.temps":            "Time",
  "dock.salon":            "The lounge",
  "dock.salon.quitter":    "Leave the lounge",
  "dock.sonde":            "Come aboard",
  "dock.sonde.redescendre": "Come back down",
  "panneau.traj":          "Trajectories",
  "panneau.langue":        "Langue — Language",

  "pr.passer":             "Skip",

  // ---- the telescope ----
  "tele.titre":            "The telescope",
  "tele.sous":             "Where are we going?",
  "tele.fermer":           "Back to the lounge",
  "tele.rouvrir":          "The telescope",
  "tele.pied":
    "The ship holds one g for as long as it takes: that is the only thing you " +
    "are granted, and nobody knows how to build it. The durations come out of " +
    "the equations, and those are not negotiable.",

  "tele.arrive.sous":      "Here we are.",
  "tele.arrive.pied":
    "The black hole is right there, at the centre, and you cannot see it: at " +
    "this distance it falls far below a single pixel. What you can see are ten " +
    "measured orbits, and every one of them turns around the same empty point. " +
    "That is how we knew it was there — thirty years before we had a picture. " +
    "The sky behind them, on the other hand, is scenery: its stars are scattered " +
    "at random and its nebula is invented. What is exact here are the orbits, and " +
    "the way gravity bends light.",
  "tele.retour.etiq":      "return",
  "tele.retour.titre":     "Back towards the black hole",
  "tele.retour.quoi":      "The same trip the other way, at the same price in time.",

  // ---- destinations ----
  "dest.abord":            "aboard",
  "dest.auloin":           "back home",
  "dest.etoiles.nom":      "Watch the stars go round",
  "dest.etoiles.quoi":
    "Far enough for the black hole to vanish — and for the orbits of the S " +
    "stars to fit in view. This is how it was discovered, thirty years before " +
    "anyone had an image of it.",
  "dest.soleil.nom":       "The solar system",
  "dest.soleil.quoi":
    "Home, twenty-seven thousand light years away. The trip would fit inside " +
    "one lifetime — but look at what you would have to carry.",
  "dest.soleil.refus.a":   "Twenty years aboard, twenty-seven thousand back home — and an ideal " +
                           "rocket, converting all of its mass to energy with nothing wasted, " +
                           "would still have to carry ",
  "dest.soleil.refus.b":   ". No known technology comes close. The ship stays here.",

  // ---- the study black hole ----
  "etude.etiq":            "hypothesis",
  "etude.nom":             "The study black hole",
  "etude.quoi":
    "A different object, with free parameters. This one is not Sagittarius A* — " +
    "it is where we try out what physics allows.",
  "etude.sous":            "This is not Sagittarius A*.",
  "etude.rotation":        "Spin",
  "etude.retour":          "Back to the destinations",
  "etude.pied":
    "Mass is not adjustable, and that is the most instructive thing here: it " +
    "would change nothing in the image. Everything is measured in Schwarzschild " +
    "radii, and doubling the mass doubles the radius — the figure would stay " +
    "identical line for line, only the scale would move. A ten-solar-mass black " +
    "hole and Sagittarius A* look exactly alike, except that one is four hundred " +
    "thousand times smaller.",

  // ---- the logbook ----
  "carnet.titre":          "Your logbook",
  "carnet.total":          "ahead of everyone who stayed behind",

  // ---- the trip clock ----
  "chrono.abord":          "aboard",
  "chrono.auloin":         "back home",
  "chrono.note":           "The ship holds one g. These are the durations it would really take.",
  "chrono.retour":         "Return",
  "chrono.retourRegistre": "Back to the black hole",
});
