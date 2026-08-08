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
  /* L'étiquette BCP 47, pour `toLocaleString` et les dates. Elle est distincte
     de `u.langue` : celle-ci commande la ponctuation des nombres, celle-là le
     pays dont on prend les conventions. */
  "u.locale":              "fr-FR",
  "u.pluriel":             "s",
  "u.an":                  "an",
  "u.jour":                "jour",
  /* L'abréviation, pour les cadrans étroits du bord — « 1 j 3 h 8 min ».
     Elle n'était pas dans l'inventaire : elle se lit sur un écran tracé au
     pinceau, pas dans le balisage, et l'inventaire ne fouillait pas là. */
  "u.jourCourt":           "j",
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

  "pr.suivant":             "Suivant",

  "pr.entrer":             "Entrer",

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
  "chrono.vitesse":        "vitesse",
  "chrono.dilatation":     "dilatation",
  "chrono.parcouru":       "parcouru",
  "chrono.accelere":       "on accélère",
  "chrono.freine":         "on freine",
  "chrono.retour":         "Retour",
  "chrono.retourRegistre": "Retour au trou noir",

  /* ==========================================================================
     Ce qui suit sort de `index.html`, zone par zone, dans l'ordre où le
     visiteur le rencontre. Les accolades `{…}` sont des trous que le script
     remplit : leurs noms ne se traduisent pas, leur ORDRE peut changer.
     ========================================================================== */

  // ---- le document ----
  "doc.titre":             "Périastre — une expérience de l'espace-temps",

  // ---- le titre et la colonne de gauche ----
  "titre.site":            "Périastre",
  "titre.cours":           "Cours ▸",
  "titre.cours.montrer":   "Afficher le cours",
  "titre.cours.replier":   "Replier le cours",
  "titre.sous":            "Sagittarius A* — rien de ce que tu vois derrière n'est vraiment là.",

  // ---- la navigation des fiches ----
  "fiches.precedente":     "Fiche précédente",
  "fiches.suivante":       "Fiche suivante",

  // ---- les compteurs, en haut à droite ----
  "stats.orbite":          "en orbite",
  "stats.figees":          "figées",
  "stats.echappees":       "échappées",
  "stats.menu":            "← Menu",
  "stats.reglages":        "Réglages — Échap",

  // ---- le panneau du temps ----
  "temps.titre":           "Vitesse du temps",
  "temps.v0":              "temps réel",
  "temps.v1":              "1 min / s",
  "temps.v2":              "10 min / s",
  "temps.v3":              "1 h / s",
  "temps.note0":
    "Rien ne bouge, ou presque. C'est l'échelle réelle : la lumière met " +
    "11 min 31 s pour un tour d'anneau.",
  "temps.note1":           "Une minute par seconde. Le disque commence à peine à tourner.",
  "temps.note2":
    "Dix minutes par seconde. Le gaz interne défile, le bord externe rampe encore.",
  "temps.note3":
    "Une heure par seconde. Le bord externe boucle son orbite en quelques " +
    "secondes — quatre heures en vrai.",

  // ---- le panneau du spectre ----
  "spectre.lecon.titre":   "Le spectre électromagnétique",
  "spectre.lecon.compris": "J'ai compris, ouvre l'outil",
  "spectre.axe.radio":     "radio",

  // ---- les réglages (le rouage) ----
  "panneau.etiq.affichage": "Affichage",
  "panneau.etiq.voix":      "Voix de Lumen",
  "panneau.etiq.spin":      "Rotation — non mesurée",
  "panneau.etiq.volume":    "Volume de la voix",
  "panneau.etiq.musique":   "Musique et ambiance",
  "panneau.etiq.acces":     "Dans le vaisseau",
  "panneau.etiq.lumen":     "Lumen, le guide",
  "panneau.etiq.taille":    "Taille des sondes",
  "panneau.etiq.guide":     "Guide",

  "panneau.missions":      "Missions",
  "panneau.quete":         "Refaire l'introduction",
  "panneau.methode":       "Pourquoi c'est exact ?",
  "panneau.journal":      "Le journal : qui a écrit ce site, et comment →",

  "panneau.spin.note":
    "On ne connaît pas le spin de Sagittarius A*. Ces quatre valeurs sont des " +
    "hypothèses, pas des mesures.",
  "panneau.spin.aucune":   "aucune",
  "panneau.spin.aucune.note":
    "Cas de référence, non une mesure : l'ombre est un cercle parfait et " +
    "l'image est sans défaut.",
  "panneau.spin.moderee":  "modérée",
  "panneau.spin.moderee.note":
    "Hypothèse. L'ombre se décentre du côté où la rotation vient vers toi.",
  "panneau.spin.rapide":   "rapide",
  "panneau.spin.rapide.note":
    "Hypothèse. L'asymétrie de l'ombre, mesurée dans notre propre calcul, vaut " +
    "2,30 rayons d'un côté contre 2,40 de l'autre.",
  "panneau.spin.extreme":  "extrême",
  "panneau.spin.extreme.note":
    "Hypothèse haute, proche de la limite de Thorne. C'est la forme de Gargantua.",
  "panneau.spin.couture":
    " Une fine couture apparaît sur l'axe : c'est la singularité de " +
    "coordonnées, pas un défaut de calcul.",

  "panneau.taille.minuscule": "à peine visible",
  "panneau.taille.normale":   "normale",
  "panneau.taille.grosse":    "grosse",
  "panneau.taille.enorme":    "énorme",

  "panneau.volume.discret":   "discret",
  "panneau.volume.normal":    "normal",
  "panneau.volume.fort":      "fort",
  "panneau.volume.tresfort":  "très fort",

  "panneau.musique.silence":  "silence",
  "panneau.musique.discret":  "discret",
  "panneau.musique.present":  "présent",
  "panneau.musique.fort":     "fort",

  "panneau.acces.objets":     "les objets",
  "panneau.acces.barre":      "la barre",

  "panneau.lumen.bavard":     "bavard",
  "panneau.lumen.mesure":     "mesuré",
  "panneau.lumen.discret":    "discret",
  "panneau.lumen.silencieux": "silencieux",
  "panneau.lumen.absent":     "absent",

  // ---- Lumen et sa bulle ----
  "lumen.parler":          "Parler à Lumen",
  "lumen.voix.lire":       "Lire à voix haute",
  "lumen.fermer":          "Fermer",
  "lumen.voix.couper":     "Couper la voix",
  "lumen.voix.activer":    "Activer la voix",
  "lumen.justif":          "d'où ça sort ?",

/* LE CENTRE DES AVEUX — 9 août 2026. « Ce genre d'info doit être comme une
   notification. » Le mot « aveu » n'apparaît nulle part à l'écran : on ne
   s'excuse pas, on dit ce que la simulation s'autorise. */
"aveu.notif":            "ce que la simulation s'autorise",
"aveu.reste":            "et {n} autre(s) à cet endroit",
"aveu.centre.titre":     "Ce qu'on s'autorise",
"aveu.centre.pied":      "Tout le reste est calculé. Ces écarts-là sont assumés, "
                       + "et chacun est écrit à l'endroit où on le rencontre.",
"aveu.ou.salon":         "Dans le salon",
"aveu.ou.reglages":      "Dans les réglages",
"aveu.ou.reglage-temps": "Sur la vitesse du temps",
"aveu.ou.telescope":     "Au télescope",
"aveu.ou.spectre":       "Sur le spectre",
"aveu.ou.recul":         "Pendant le voyage",
"aveu.ou.arrivee":       "À l'arrivée",
"aveu.ou.etude":         "Sur le trou noir d'étude",
"aveu.ou.partout":       "Partout",
  "lumen.questions":       "Vas-y, demande :",

  // ---- la quête d'accueil ----
  "quete.passer":          "Passer l'introduction",
  "quete.num":             "{n} sur {total}",
  "quete.bien":            "Bien",

  // ---- le panneau des missions ----
  "mission.masquer":       "Masquer les missions",
  "mission.num":           "Mission {n} sur {total}",
  "mission.reussi":        "Réussi",

  // ---- l'écran d'accueil et le menu ----
  "accueil.titre":         "Périastre",
  "accueil.entrer.voix":   "🔊 Entrer, avec la voix de Lumen",
  "accueil.entrer.muet":   "Entrer en silence",
  "accueil.niveau.titre":  "Où en es-tu ?",
  "accueil.depart.titre":  "Par où veux-tu commencer ?",
  "accueil.depart.chapo":  "Tu pourras changer à tout moment. Ce n'est qu'une porte d'entrée.",
  "accueil.porte.libre.titre":  "Regarder le trou noir",
  "accueil.porte.libre.detail":
    "La vue libre, autour de l'astre. On tourne, on zoome, on lance des sondes. " +
    "Le plus léger, et ce qui marche le mieux sur téléphone.",
  "accueil.porte.salon.titre":  "Monter à bord",
  "accueil.porte.salon.detail":
    "Le salon d'un vaisseau en orbite, avec une baie vitrée. On s'y déplace à pied, " +
    "on parle au robot de bord, on règle la vitesse du temps au mur. " +
    "Plus gourmand — mieux vaut un ordinateur.",
  "accueil.porte.missions.titre": "Apprendre, guidé",
  "accueil.porte.missions.detail":
    "Huit missions, une chose à comprendre par mission. On n'a besoin de rien savoir " +
    "d'avance, et la première dure trois minutes.",

  /* Le pluriel n'est plus fabriqué dans la phrase : deux clés complètes, parce
     qu'une troisième langue n'aura ni le même seuil ni la même syntaxe. */
  "accueil.reprise.un":    "Tu as déjà compris <b>{n}</b> chose sur {total}. On continue ?",
  "accueil.reprise":       "Tu as déjà compris <b>{n}</b> choses sur {total}. On continue ?",
  "accueil.chapo":         "Le point d'une orbite où l'on passe au plus près. Choisis par quoi commencer.",
  "accueil.oubli":         "Tout recommencer",
  "accueil.commencer":     "Commencer",
  "accueil.retour":        "Retour",

  // ---- le salon : écrans de bord et manette ----
  "salon.tourne":          "Tourne l'écran — le trou noir est large.",
  "salon.manette.saut":    "saut",
  "salon.ecran.position":  "POSITION",
  "salon.ecran.orbite":    "ORBITE EXCENTRIQUE",
  "salon.ecran.nous":      "NOUS",
  "salon.ecran.temps":     "TEMPS DE BORD",
  "salon.ecran.depuis":    "EN ORBITE ICI DEPUIS",
  "salon.ecran.pendant":   "PENDANT CE TEMPS",
  "salon.ecran.terre":     "SUR TERRE",
  "salon.ecran.bord":      "À BORD",
  "salon.ecran.retard":    "Tu as pris {t} de retard sur eux · ton horloge tourne à {x} %",
  "salon.ecran.accelere":  "Mouvement accéléré ×{f} pour qu'il se voie.",

  // ---- messages et avis ----
  "msg.figee":             "figée à l'horizon",
  "msg.photonAvale":       "photon absorbé",
  "msg.photonFuite":       "photon échappé",
  "msg.copie.ok":          "Position copiée. Colle le lien dans ton rapport : elle se rouvrira ici même.",
  "msg.copie.non":         "Copie refusée par le navigateur. Le lien est dans la barre d'adresse.",
  "msg.ios.texte":
    "Si tu n'entends rien : le <b>petit interrupteur</b> sur la tranche de " +
    "l'iPhone coupe aussi le son des pages web.",
  "msg.ios.compris":       "J'ai compris",
  "msg.webgl":             "Ton navigateur ne supporte pas WebGL2.",

  // ---- le bandeau chiffré ----
  "lecture.vol":           "de vol · {n}",
  "lecture.tour.un":       "tour",
  "lecture.tour.pl":       "tours",
  "lecture.km":            "{x} millions de km parcourus à la vitesse de la lumière.",
  "lecture.tour":          "par tour d'anneau",
  "lecture.note":
    "C'est le temps, chronométré d'ici, que met un photon pour boucler la " +
    "sphère des photons : 6√3·πGM/c³. Il est déjà 15 min plus vieux quand il t'arrive.",

  // ---- le cockpit de la sonde ----
  "cockpit.temps":         "ton temps s'écoule à",
  "cockpit.vitesse":       "ta vitesse",
  "cockpit.altitude":      "ton altitude",
  "cockpit.maree":         "marée",
  "cockpit.toi":           "TOI, ICI",
  "cockpit.jumeau":        "TON JUMEAU, RESTÉ LOIN",
  "cockpit.ecart":         "il a vieilli de {t} de plus que toi",
  "cockpit.invite":        "descends plus près, et regarde-les s'écarter",

  // ---- le dossier « pourquoi c'est exact » ----
  "dossier.titre":         "Pourquoi cette image est exacte",
  "dossier.chapeau":       "Et ce qui, dedans, ne l'est pas.",
  "dossier.fermer":        "Fermer",

  // ---- le banc d'essai ----
  "banc.lancer":           "Vérifier le moteur maintenant",
  "banc.calcul":           "Calcul en cours…",
  "banc.relancer":         "Relancer la vérification",
  "banc.col.grandeur":     "Grandeur",
  "banc.col.theorie":      "Théorie",
  "banc.col.mesure":       "Mesuré ici",
  "banc.col.ecart":        "Écart",

  "banc.essai.photon.nom":     "Sphère des photons",
  "banc.essai.photon.quoi":    "Rayon de l'orbite circulaire de la lumière",
  "banc.essai.photon.attendu": "3M = 1,5",
  "banc.essai.ombre.nom":      "Rayon de l'ombre",
  "banc.essai.ombre.quoi":     "Paramètre d'impact critique de capture",
  "banc.essai.ombre.attendu":  "√27·M ≈ 2,598",
  "banc.essai.deflexion.nom":     "Déflexion de la lumière",
  "banc.essai.deflexion.quoi":    "Déviation d'un rayon rasant à b = 1000",
  "banc.essai.deflexion.attendu": "4M/b = 0,002",
  "banc.essai.isco.nom":       "Dernière orbite stable",
  "banc.essai.isco.quoi":      "En deçà, aucune orbite de matière ne tient",
  "banc.essai.isco.attendu":   "6M = 3",

  "banc.verdict.ok":       "conforme",
  "banc.verdict.bof":      "proche",
  "banc.verdict.non":      "écart",

  "banc.apres":
    "Calculé en {t} s dans ton navigateur, avec l'équation qui dessine l'image " +
    "ci-derrière. Aucune de ces quatre valeurs n'est écrite dans le code : ce sont " +
    "des <b>sorties</b>." +
    "<br><br>Sur la déflexion, l'écart résiduel n'est pas une erreur : " +
    "<code>4M/b</code> n'est que le premier ordre. Le terme suivant vaut " +
    "<code>15πM²/4b² = {x}</code>, soit précisément le décalage mesuré — " +
    "l'intégration est plus juste que la formule de référence." +
    "<br><br>Et Newton, lui, prédisait <b>{y} rad</b> : exactement la moitié. " +
    "C'est ce facteur 2 qu'Eddington est allé mesurer en 1919.",
};
