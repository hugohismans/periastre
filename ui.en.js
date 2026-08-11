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
  // British conventions: the rest of this file already spells "colours" and
  // "centre", and a date must not read American in a British sentence.
  "u.locale":              "en-GB",
  "u.pluriel":             "s",
  "u.an":                  "year",
  "u.jour":                "day",
  "u.jourCourt":           "d",     // "1 d 3 h 8 min" on the narrow bridge dials
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

  "pr.suivant":             "Next",

  "pr.entrer":             "Enter",

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
  /* ONE FOOTER PER DESTINATION — 10 August 2026. There was only one, and it
     described the ten orbits of the galactic centre to anyone who had just
     arrived in the solar system. */
  "tele.arrive.pied.etoiles":
    "The black hole is right there, at the centre, and you cannot see it: at " +
    "this distance it falls far below a single pixel. What you can see are ten " +
    "measured orbits, and every one of them turns around the same empty point. " +
    "That is how we knew it was there — thirty years before we had a picture. " +
    "The sky behind them, on the other hand, is scenery: its stars are scattered " +
    "at random and its nebula is invented. What is exact here are the orbits, and " +
    "the way gravity bends light.",
  "tele.arrive.pied.soleil":
    "The journey ends here. What you were looking at a moment ago — the black " +
    "hole and the ten measured orbits around it — is now twenty-seven thousand " +
    "light years behind you, and nothing can pick it out any more: the orbits " +
    "you watched turning now fall far below a single pixel, just as the black " +
    "hole itself did earlier. What you have just been shown is the distance.",
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
  /* This destination used to be REFUSED, and its refusal was read here: "the
     ship stays here". On 9 August 2026 we leave anyway — the lesson was never
     in the refusal, it was in the figure, and the figure stays on the card. */
  "dest.soleil.quoi":
    "Home, twenty-seven thousand light years away. An ideal rocket, converting " +
    "all of its mass to energy with nothing wasted, would still have to carry " +
    "what is written below. No known technology comes close — and we are going.",
  "dest.prix":             "  ·  you would have to carry ",

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
  // The traveller's log — 10 August. "Stay in orbit" names the lines the lounge
  // writes on the way out; the lived-time sentence only appears once there is
  // truly something to tell.
  "carnet.sejour":         "Stay in orbit",
  "carnet.vecu":           "Since your first mission you have lived {toi} — Earth has lived {terre}.",

  // ---- the trip clock ----
  "chrono.abord":          "aboard",
  "chrono.auloin":         "back home",
  "chrono.note":           "The ship holds one g. These are the durations it would really take.",
  "chrono.vitesse":        "speed",
  "chrono.dilatation":     "time stretch",
  "chrono.parcouru":       "covered",
  "chrono.accelere":       "burning",
  "chrono.freine":         "braking",
  "chrono.retour":         "Return",
  "chrono.retourRegistre": "Back to the black hole",

  /* ==========================================================================
     Everything below comes out of `index.html`, zone by zone, in the order a
     visitor meets it. The braces `{…}` are holes the script fills: their names
     do not translate, their ORDER may.

     ---------------------------------------------------------------------------
     THE NAME — decided by Hugo, 5 August 2026

     "Keep the French name for the app, and anglicise it where necessary."

     So: the SITE is **Périastre**, accent and all, in every language. It is a
     proper noun, and a proper noun does not translate — one does not rename a
     place because a visitor speaks another tongue.

     What does anglicise is the word used INSIDE the English prose, where French
     would read as a foreign body: the ship is *the Periastron* in
     `contenu.en.js`. That is not an inconsistency, it is the rule working —
     the name of the thing stays, the way it sits in a sentence adapts.

     A third language would do the same: keep "Périastre" for the site, and let
     the ship take whatever form the language wants for it.
     ========================================================================== */

  // ---- the document ----
  "doc.titre":             "Périastre — an experience of spacetime",

  // ---- the title and the left column ----
  "titre.site":            "Périastre",
  "titre.cours":           "Notes ▸",
  "titre.cours.montrer":   "Show the notes",
  "titre.cours.replier":   "Collapse the notes",
  "titre.sous":            "Sagittarius A* — nothing you see behind this is really there.",

  // ---- moving through the cards ----
  "fiches.precedente":     "Previous card",
  "fiches.suivante":       "Next card",

  // ---- the counters, top right ----
  "stats.orbite":          "in orbit",
  "stats.figees":          "frozen",
  "stats.echappees":       "escaped",
  "stats.menu":            "← Menu",
  "stats.reglages":        "Settings — Esc",

  // ---- the time panel ----
  "temps.titre":           "Speed of time",
  "temps.v0":              "real time",
  "temps.v1":              "1 min / s",
  "temps.v2":              "10 min / s",
  "temps.v3":              "1 h / s",
  "temps.note0":
    "Almost nothing moves. This is the real scale: light takes 11 min 31 s to " +
    "go once round the ring.",
  "temps.note1":           "One minute per second. The disk is barely starting to turn.",
  "temps.note2":
    "Ten minutes per second. The inner gas streams past; the outer edge still crawls.",
  "temps.note3":
    "One hour per second. The outer edge completes its orbit in a few seconds — " +
    "four hours for real.",

  // ---- the spectrum panel ----
  "spectre.lecon.titre":   "The electromagnetic spectrum",
  "spectre.lecon.compris": "Got it — open the tool",
  "spectre.axe.radio":     "radio",

  // ---- settings (the cog) ----
  "panneau.etiq.affichage": "Display",
  "panneau.etiq.voix":      "Lumen's voice",
  "panneau.etiq.spin":      "Spin — not measured",
  "panneau.etiq.volume":    "Voice volume",
  "panneau.etiq.musique":   "Music and ambience",
  "panneau.etiq.acces":     "Aboard the ship",
  "panneau.etiq.lumen":     "Lumen, the guide",
  "panneau.etiq.taille":    "Probe size",
  "panneau.etiq.guide":     "Guide",

  "panneau.missions":      "Missions",
  "panneau.quete":         "Replay the introduction",
  "panneau.methode":       "Why is this accurate?",
  "panneau.journal":      "The journal: who wrote this site, and how →",

  "panneau.spin.note":
    "We don't know the spin of Sagittarius A*. These four values are " +
    "hypotheses, not measurements.",
  "panneau.spin.aucune":   "none",
  "panneau.spin.aucune.note":
    "Reference case, not a measurement: the shadow is a perfect circle and the " +
    "image is free of artefacts.",
  "panneau.spin.moderee":  "moderate",
  "panneau.spin.moderee.note":
    "Hypothesis. The shadow shifts off-centre, towards the side where the " +
    "rotation is coming at you.",
  "panneau.spin.rapide":   "fast",
  "panneau.spin.rapide.note":
    "Hypothesis. The asymmetry of the shadow, measured in our own calculation, " +
    "comes to 2.30 radii on one side against 2.40 on the other.",
  "panneau.spin.extreme":  "extreme",
  "panneau.spin.extreme.note":
    "High-end hypothesis, close to the Thorne limit. This is the shape of Gargantua.",
  "panneau.spin.couture":
    " A fine seam appears along the axis: that is the coordinate singularity, " +
    "not a flaw in the calculation.",

  "panneau.taille.minuscule": "barely visible",
  "panneau.taille.normale":   "normal",
  "panneau.taille.grosse":    "large",
  "panneau.taille.enorme":    "huge",

  "panneau.volume.discret":   "quiet",
  "panneau.volume.normal":    "normal",
  "panneau.volume.fort":      "loud",
  "panneau.volume.tresfort":  "very loud",

  "panneau.musique.silence":  "off",
  "panneau.musique.discret":  "quiet",
  "panneau.musique.present":  "present",
  "panneau.musique.fort":     "loud",

  "panneau.acces.objets":     "the objects",
  "panneau.acces.barre":      "the bar",

  "panneau.lumen.bavard":     "chatty",
  "panneau.lumen.mesure":     "measured",
  "panneau.lumen.discret":    "sparing",
  "panneau.lumen.silencieux": "silent",
  "panneau.lumen.absent":     "gone",

  // ---- Lumen and the speech bubble ----
  "lumen.parler":          "Talk to Lumen",
  "lumen.voix.lire":       "Read aloud",
  "lumen.fermer":          "Close",
  "lumen.voix.couper":     "Mute the voice",
  "lumen.voix.activer":    "Turn the voice on",
  "lumen.justif":          "where's that from?",

/* THE ADMISSIONS CENTRE — 9 August 2026. The word "admission" never appears on
   screen: we don't apologise, we state what the simulation allows itself. */
/* The recession grid. These words used to be hardcoded in French inside
   `recul.js`, and an English reader saw them as-is for the whole trip. The
   light-year arrived on 9 August with the journey to the solar system: in AU, a
   grid cell at arrival would be one thousand seven hundred billion. */
"recul.case":            "one cell = ",
"recul.distance":        "distance ",
"recul.rs":              " rₛ",
"recul.ua":              " AU",
"recul.al":              " ly",

/* The render — simulation or cinema, 10 August. Both are exact where it
   matters; one adds what a film would add, the other declines. */
"rendu.etiq":            "Render",
"rendu.cinema":          "Cinema",
"rendu.simulation":      "Simulation",
"rendu.cinema.note":     "The image adds what a film would add: the purple veil "
                       + "in the background, which does not exist — and says so.",
"rendu.simulation.note": "The purple veil goes out. What is still false says so "
                       + "on the spot: the stars are scattered at random, and "
                       + "this blackness does not exist — out there it is never night.",

/* The pace of the journey, 11 August. Both tell the truth about speed and about
   the clocks; they do not spread the screen time the same way. */
"rythme.etiq":             "Journey pace",
"rythme.fidele":           "Faithful",
"rythme.regulier":         "Even",
"rythme.fidele.note":      "What you would see through the window, untouched: you "
                         + "pull away very fast at first, then the view barely "
                         + "moves while you brake.",
"rythme.regulier.note":    "The motion is spread out: a gentle start, full speed "
                         + "mid-journey, slowing down on arrival. Only the pacing "
                         + "is retouched — the figures stay true.",

"aveu.notif":            "what the simulation allows itself",
"aveu.reste":            "and {n} more here",
"aveu.centre.titre":     "What we allow ourselves",
"aveu.centre.pied":      "Everything else is computed. These departures are "
                       + "deliberate, and each one is stated where you meet it.",
"aveu.ou.salon":         "In the lounge",
"aveu.ou.reglages":      "In the settings",
"aveu.ou.reglage-temps": "On the speed of time",
"aveu.ou.telescope":     "At the telescope",
"aveu.ou.spectre":       "On the spectrum",
"aveu.ou.recul":         "During the journey",
"aveu.ou.arrivee":       "On arrival",
"aveu.ou.etude":         "On the study black hole",
"aveu.ou.partout":       "Everywhere",
  "lumen.questions":       "Go ahead, ask:",

  // ---- the opening quest ----
  "quete.passer":          "Skip the introduction",
  "quete.num":             "{n} of {total}",
  "quete.bien":            "Good",

  // ---- the missions panel ----
  "mission.masquer":       "Hide the missions",
  "mission.num":           "Mission {n} of {total}",
  "mission.reussi":        "Done",

  // ---- the opening screen and the menu ----
  "accueil.titre":         "Périastre",
  "accueil.entrer.voix":   "🔊 Enter, with Lumen's voice",
  "accueil.entrer.muet":   "Enter in silence",
  "accueil.niveau.titre":  "Where are you starting from?",
  "accueil.depart.titre":  "Where do you want to start?",
  "accueil.depart.chapo":  "You can change at any time. This is only a way in.",
  "accueil.porte.libre.titre":  "Look at the black hole",
  "accueil.porte.libre.detail":
    "The free view, around the object. You turn, you zoom, you launch probes. " +
    "The lightest option, and the one that works best on a phone.",
  "accueil.porte.salon.titre":  "Come aboard",
  "accueil.porte.salon.detail":
    "The lounge of a ship in orbit, with a picture window. You move around on " +
    "foot, you talk to the onboard robot, you set the speed of time on the " +
    "wall. Heavier — better on a computer.",
  "accueil.porte.missions.titre": "Learn, guided",
  "accueil.porte.missions.detail":
    "Eight missions, one thing to understand per mission. You need to know " +
    "nothing in advance, and the first takes three minutes.",

  "accueil.reprise.un":    "You've understood <b>{n}</b> thing out of {total}. Shall we go on?",
  "accueil.reprise":       "You've understood <b>{n}</b> things out of {total}. Shall we go on?",
  "accueil.chapo":         "The point of an orbit where you pass closest. Choose where to begin.",
  "accueil.oubli":         "Start over",
  "accueil.commencer":     "Begin",
  "accueil.retour":        "Back",

  // ---- the lounge: bridge screens and thumbstick ----
  "salon.tourne":          "Turn your screen — the black hole is wide.",
  "salon.manette.saut":    "jump",
  "salon.ecran.position":  "POSITION",
  "salon.ecran.orbite":    "ECCENTRIC ORBIT",
  "salon.ecran.nous":      "US",
  "salon.ecran.temps":     "SHIP TIME",
  "salon.ecran.depuis":    "IN ORBIT HERE FOR",
  "salon.ecran.pendant":   "MEANWHILE",
  "salon.ecran.terre":     "ON EARTH",
  "salon.ecran.bord":      "ABOARD",
  "salon.ecran.retard":    "You have fallen {t} behind them · your clock runs at {x} %",
  "salon.ecran.accelere":  "Motion sped up ×{f} so you can see it.",

  // ---- messages and notices ----
  "msg.figee":             "frozen at the horizon",
  "msg.photonAvale":       "photon absorbed",
  "msg.photonFuite":       "photon escaped",
  "msg.copie.ok":          "Position copied. Paste the link into your report: it will reopen right here.",
  "msg.copie.non":         "The browser refused the copy. The link is in the address bar.",
  "msg.ios.texte":
    "If you can't hear anything: the <b>little switch</b> on the side of the " +
    "iPhone mutes web pages too.",
  "msg.ios.compris":       "Got it",
  "msg.webgl":             "Your browser does not support WebGL2.",

  // ---- the figures banner ----
  "lecture.vol":           "in flight · {n}",
  "lecture.tour.un":       "turn",
  "lecture.tour.pl":       "turns",
  "lecture.km":            "{x} million km covered at the speed of light.",
  "lecture.tour":          "per lap of the ring",
  "lecture.note":
    "That is the time, clocked from here, a photon takes to go once round the " +
    "photon sphere: 6√3·πGM/c³. It is already 15 min older by the time it reaches you.",

  // ---- the probe cockpit ----
  "cockpit.temps":         "your time runs at",
  "cockpit.vitesse":       "your speed",
  "cockpit.altitude":      "your altitude",
  "cockpit.maree":         "tidal",
  "cockpit.toi":           "YOU, HERE",
  "cockpit.jumeau":        "YOUR TWIN, LEFT BEHIND",
  "cockpit.ecart":         "they have aged {t} more than you",
  "cockpit.invite":        "go down closer, and watch them come apart",

  // ---- the "why this is accurate" dossier ----
  "dossier.titre":         "Why this image is accurate",
  "dossier.chapeau":       "And what, inside it, is not.",
  "dossier.fermer":        "Close",

  // ---- the test bench ----
  "banc.lancer":           "Check the engine now",
  "banc.calcul":           "Calculating…",
  "banc.relancer":         "Run the check again",
  "banc.col.grandeur":     "Quantity",
  "banc.col.theorie":      "Theory",
  "banc.col.mesure":       "Measured here",
  "banc.col.ecart":        "Difference",

  "banc.essai.photon.nom":     "Photon sphere",
  "banc.essai.photon.quoi":    "Radius of light's circular orbit",
  "banc.essai.photon.attendu": "3M = 1.5",
  "banc.essai.ombre.nom":      "Shadow radius",
  "banc.essai.ombre.quoi":     "Critical capture impact parameter",
  "banc.essai.ombre.attendu":  "√27·M ≈ 2.598",
  "banc.essai.deflexion.nom":     "Light deflection",
  "banc.essai.deflexion.quoi":    "Deflection of a grazing ray at b = 1000",
  "banc.essai.deflexion.attendu": "4M/b = 0.002",
  "banc.essai.isco.nom":       "Last stable orbit",
  "banc.essai.isco.quoi":      "Below it, no orbit of matter holds",
  "banc.essai.isco.attendu":   "6M = 3",

  "banc.verdict.ok":       "matches",
  "banc.verdict.bof":      "close",
  "banc.verdict.non":      "off",

  "banc.apres":
    "Calculated in {t} s in your browser, with the equation that draws the image " +
    "behind this. None of these four values is written into the code: they are " +
    "<b>outputs</b>." +
    "<br><br>On the deflection, the residual gap is not an error: " +
    "<code>4M/b</code> is only the first order. The next term is " +
    "<code>15πM²/4b² = {x}</code>, which is exactly the offset measured — the " +
    "integration is more accurate than the reference formula." +
    "<br><br>And Newton predicted <b>{y} rad</b>: exactly half. That factor of 2 " +
    "is what Eddington went to measure in 1919.",
});
