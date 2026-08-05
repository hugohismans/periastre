/* ============================================================================
   Les chaînes de l'interface, en français.

   Le contenu pédagogique vit dans `contenu.js` ; ici ne se trouvent que les
   mots de la machine — libellés de boutons, titres de panneaux, étiquettes.
   Les deux sont séparés parce qu'ils ne changent pas au même rythme : le
   contenu se relit et se source, l'interface se déplace et se renomme.

   ---------------------------------------------------------------------------
   CE FICHIER EST LE REPLI

   Il se charge TOUJOURS, dans les deux langues, et `ui.en.js` ne fait que le
   surcharger. Une clé oubliée en anglais retombe donc sur une vraie phrase
   française, jamais sur un identifiant nu affiché à l'écran — ce qui est laid,
   mais surtout ce qui rend le manque invisible au relecteur.

   Cent soixante-dix chaînes restent en dur dans `index.html` ; celles-ci sont
   les premières, choisies parce que le contenu anglais les NOMME déjà dans ses
   consignes de mission. Une consigne qui dit « press Real light » devant un
   bouton marqué « Lumière réelle » désigne un bouton qui n'existe pas.
   L'inventaire complet est dans CHAINES-UI.md.
   ============================================================================ */

window.UI = {

  /* ---- les unités, lues par voyage1g.js ----
     Elles portent le préfixe `u.` parce que le module les cherche sous ce nom
     sans rien connaître du reste de l'interface. */
  "u.langue":              "fr",
  "u.pluriel":             "s",
  "u.an":                  "an",
  "u.jour":                "jour",
  "u.heure":               "h",
  "u.minute":              "min",
  "u.al":                  "années-lumière",
  "u.ua":                  "unités astronomiques",
  "u.masses":              "kg par kg arrivé",
  "dest.mais":             ", mais ",

  // ---- la barre du bas ----
  "dock.pluie":            "Lâcher 80 sondes",
  "dock.photon":           "Photon",
  "dock.effacer":          "Effacer",
  "dock.reel":             "Lumière réelle",
  "dock.reel.rallumer":    "Rallumer les couleurs",
  "dock.spectre":          "Spectre",
  "dock.temps":            "Temps",
  "dock.salon":            "Le salon",
  "dock.salon.quitter":    "Quitter le salon",
  "dock.sonde":            "Monter à bord",
  "dock.sonde.redescendre": "Redescendre",
  "panneau.traj":          "Trajectoires",
  "panneau.langue":        "Langue — Language",

  "pr.passer":             "Passer",

  // ---- le télescope ----
  "tele.titre":            "Le télescope",
  "tele.sous":             "Où allons-nous ?",
  "tele.fermer":           "Revenir au salon",
  "tele.rouvrir":          "Le télescope",
  "tele.pied":
    "Le vaisseau tient une accélération d'un g aussi longtemps qu'il faut : c'est " +
    "la seule chose qu'on vous accorde, et personne ne sait la construire. Les " +
    "durées, elles, sortent des équations et ne se négocient pas.",

  "tele.arrive.sous":      "Nous y sommes.",
  "tele.arrive.pied":
    "Le trou noir est là, au centre, et vous ne le voyez pas : à cette distance " +
    "il tient très loin sous le pixel. Ce que vous voyez sont dix orbites " +
    "mesurées, et elles tournent toutes autour du même point vide. C'est ainsi " +
    "qu'on a su qu'il existait — trente ans avant d'en avoir une image. " +
    "En revanche, le fond du ciel derrière elles est un décor : ses étoiles sont " +
    "posées au hasard et sa nébuleuse est inventée. Ce qui est exact ici, ce sont " +
    "les orbites et la façon dont la gravité dévie la lumière.",
  "tele.retour.etiq":      "retour",
  "tele.retour.titre":     "Revenir près du trou noir",
  "tele.retour.quoi":      "Le même trajet dans l'autre sens, et le même prix en temps.",

  // ---- les destinations ----
  "dest.abord":            "à bord",
  "dest.auloin":           "au loin",
  "dest.etoiles.nom":      "Voir les étoiles tourner",
  "dest.etoiles.quoi":
    "Assez loin pour que le trou noir disparaisse — et pour que les orbites " +
    "des étoiles S tiennent dans le champ. C'est ainsi qu'on l'a découvert, " +
    "trente ans avant d'en avoir une image.",
  "dest.soleil.nom":       "Le système solaire",
  "dest.soleil.quoi":
    "La maison, à vingt-sept mille années-lumière. Le trajet tiendrait dans " +
    "une vie — mais regardez ce qu'il faudrait emporter.",
  "dest.soleil.refus.a":   "Vingt ans à bord, vingt-sept mille au loin — et une fusée idéale, qui " +
                           "convertirait toute sa masse en énergie sans rien perdre, devrait emporter ",
  "dest.soleil.refus.b":   ". Aucune technologie connue n'en approche. Le vaisseau reste ici.",

  // ---- le trou noir d'étude ----
  "etude.etiq":            "hypothèse",
  "etude.nom":             "Le trou noir d'étude",
  "etude.quoi":
    "Un autre objet, aux paramètres libres. Ce n'est pas Sagittarius A* — c'est " +
    "là qu'on essaie ce que la physique autorise.",
  "etude.sous":            "Ce n'est pas Sagittarius A*.",
  "etude.rotation":        "Rotation",
  "etude.retour":          "Revenir aux destinations",
  "etude.pied":
    "La masse n'est pas réglable, et c'est ce qu'il y a de plus instructif ici : " +
    "elle ne changerait rien à l'image. Tout se mesure en rayons de Schwarzschild, " +
    "et doubler la masse double le rayon — la figure resterait identique au trait " +
    "près, seule l'échelle bougerait. Un trou noir de dix masses solaires et " +
    "Sagittarius A* se ressemblent exactement, à ceci près que l'un est quatre " +
    "cent mille fois plus petit.",

  // ---- le carnet de bord ----
  "carnet.titre":          "Votre carnet de bord",
  "carnet.total":          "d'avance sur ceux qui sont restés",

  // ---- le chronomètre du trajet ----
  "chrono.abord":          "à bord",
  "chrono.auloin":         "au loin",
  "chrono.note":           "Le vaisseau tient un g. Ces durées sont celles qu'il faudrait vraiment.",
  "chrono.retour":         "Retour",
  "chrono.retourRegistre": "Retour au trou noir",
};
