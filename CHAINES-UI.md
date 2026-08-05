# Les chaînes d'interface en dur dans `index.html`

Inventaire des chaînes destinées à être lues, écrites en français directement
dans `index.html` — balisage et script confondus. Elles sont ce qui reste à
sortir avant que l'anglais tienne debout, le contenu pédagogique étant déjà
isolé dans `contenu.js` / `contenu.en.js`.

**Sont exclus** : les commentaires, les identifiants et noms de classes, les
clés d'objets, tout ce qui vient de `CONTENU`, les symboles (`←`, `▸`, `✕`,
`γ`, `νLν`), les unités et les formules.

Les numéros de ligne sont ceux du fichier au moment de l'inventaire. Le fichier
étant en cours d'édition, ils dérivent — chaque entrée porte donc aussi sa
chaîne exacte, qui est la vraie ancre.

Les traductions marquées **(établi)** reprennent une formulation déjà présente
dans `contenu.en.js`, qui fait autorité : le contenu anglais nomme déjà
plusieurs boutons de l'interface, et un libellé qui ne correspondrait pas à ce
que la consigne annonce serait pire qu'une mauvaise traduction.

---

## Synthèse

| Zone | Clés | Chaînes |
|---|---|---:|
| Document | `doc.*` | 2 |
| Titre et colonne de gauche | `titre.*` | 5 |
| Navigation des fiches | `fiches.*` | 2 |
| Compteurs, haut à droite | `stats.*` | 5 |
| Barre du bas | `dock.*` | 12 |
| Panneau du temps | `temps.*` | 9 |
| Panneau du spectre | `spectre.*` | 3 |
| Réglages (le rouage) | `panneau.*` | 42 |
| Lumen et sa bulle | `lumen.*` | 7 |
| Quête d'accueil | `quete.*` | 3 |
| Panneau des missions | `mission.*` | 3 |
| Écran d'accueil et menu | `accueil.*` | 19 |
| Dossier et banc d'essai | `dossier.*`, `banc.*` | 26 |
| Bandeau chiffré | `lecture.*` | 4 |
| Le salon : écrans et manette | `salon.*` | 12 |
| Cockpit de la sonde | `cockpit.*` | 8 |
| Messages et avis | `msg.*` | 8 |
| **Total** | | **170** |

À quoi s'ajoutent **5 points de formatage** localisés à la française, qui ne
sont pas des chaînes mais bloquent tout autant (section *Formats*).

---

## Document

- **« fr »** — L2, attribut `lang` de `<html>`
  `doc.langue` → **“en”**

- **« Périastre — une expérience de l'espace-temps »** — L6, `<title>`
  `doc.titre` → **“Periastron — an experience of spacetime”**

---

## Titre et colonne de gauche

- **« Périastre »** — L823, titre du site (`h1`)
  `titre.site` → **“Periastron”** *(voir « À trancher »)*

- **« Cours ▸ »** — L823 (bouton), réécrit L3984 à la mise en place de la vue libre
  `titre.cours` → **“Notes ▸”**

- **« Afficher le cours »** — L823 (`title`), réécrit L3114
  `titre.cours.montrer` → **“Show the notes”**

- **« Replier le cours »** — L3114, `title` quand le panneau est déplié
  `titre.cours.replier` → **“Collapse the notes”**

- **« Sagittarius A* — rien de ce que tu vois derrière n'est vraiment là. »** — L824, sous-titre
  `titre.sous` → **“Sagittarius A* — nothing you see behind this is really there.”**

---

## Navigation des fiches

- **« Fiche précédente »** — L835, `aria-label` de la flèche gauche
  `fiches.precedente` → **“Previous card”**

- **« Fiche suivante »** — L837, `aria-label` de la flèche droite
  `fiches.suivante` → **“Next card”**

---

## Compteurs, haut à droite

- **« en orbite »** — L844, légende du compteur bleu
  `stats.orbite` → **“in orbit”**

- **« figées »** — L845, légende du compteur rouge (sondes figées à l'horizon)
  `stats.figees` → **“frozen”**

- **« échappées »** — L846, légende du compteur vert
  `stats.echappees` → **“escaped”**

- **« ← Menu »** — L848, bouton de retour au menu
  `stats.menu` → **“← Menu”**

- **« Réglages — Échap »** — L849, `title` du rouage
  `stats.reglages` → **“Settings — Esc”**

---

## Barre du bas

- **« Lâcher 80 sondes »** — L879, bouton du dock
  `dock.pluie` → **“Drop 80 probes”** *(établi)*

- **« Photon »** — L880, bouton du dock
  `dock.photon` → **“Photon”** *(établi)*

- **« Effacer »** — L881, bouton du dock
  `dock.effacer` → **“Clear”**

- **« Lumière réelle »** — L884, bouton du dock
  `dock.reel` → **“Real light”** *(établi)*

- **« Spectre »** — L885, bouton du dock
  `dock.spectre` → **“Spectrum”**

- **« Temps »** — L886, bouton du dock
  `dock.temps` → **“Time”**

- **« Le salon »** — L889, bouton du dock
  `dock.salon` → **“The lounge”** *(établi)*

- **« Monter à bord »** — L890, bouton du dock
  `dock.sonde` → **“Come aboard”** *(établi)*

- **« Quitter le salon »** — L2764, libellé du même bouton une fois au salon
  `dock.salon.quitter` → **“Leave the lounge”**

- **« Rallumer les couleurs »** — L2796, libellé de `b-reel` quand la lumière réelle est active
  `dock.reel.rallumer` → **“Bring the colors back”**

- **« Redescendre »** — L2399, libellé de `b-sonde` quand on est embarqué
  `dock.sonde.redescendre` → **“Come back down”**

- **« Monter dans une sonde »** — L2399, libellé de `b-sonde` au retour
  `dock.sonde` → **“Come aboard”** — *incohérent avec L890, voir « Fautif »*

---

## Panneau du temps

- **« Vitesse du temps »** — L896, titre du panneau
  `temps.titre` → **“Speed of time”**

- **« temps réel »** — L2594, premier cran
  `temps.v0` → **“real time”** *(établi)*

- **« 1 min / s »** — L2595, deuxième cran
  `temps.v1` → **“1 min / s”**

- **« 10 min / s »** — L2596, troisième cran
  `temps.v2` → **“10 min / s”**

- **« 1 h / s »** — L2597, quatrième cran
  `temps.v3` → **“1 h / s”**

- **« Rien ne bouge, ou presque. C'est l'échelle réelle : la lumière met 11 min 31 s pour un tour d'anneau. »** — L2804, conséquence du cran 0
  `temps.note0` → **“Almost nothing moves. This is the real scale: light takes 11 min 31 s to go once round the ring.”**

- **« Une minute par seconde. Le disque commence à peine à tourner. »** — L2805
  `temps.note1` → **“One minute per second. The disk is barely starting to turn.”**

- **« Dix minutes par seconde. Le gaz interne défile, le bord externe rampe encore. »** — L2806
  `temps.note2` → **“Ten minutes per second. The inner gas streams past; the outer edge still crawls.”**

- **« Une heure par seconde. Le bord externe boucle son orbite en quelques secondes — quatre heures en vrai. »** — L2807
  `temps.note3` → **“One hour per second. The outer edge completes its orbit in a few seconds — four hours for real.”**

---

## Panneau du spectre

- **« Le spectre électromagnétique »** — L3707, titre de la leçon d'ouverture
  `spectre.lecon.titre` → **“The electromagnetic spectrum”**

- **« J'ai compris, ouvre l'outil »** — L3710, bouton qui sort de la leçon
  `spectre.lecon.compris` → **“Got it — open the tool”**

- **« radio »** — L3675, étiquette d'axe tracée sur le graphe de la SED
  `spectre.axe.radio` → **“radio”**

---

## Réglages (le rouage)

### Étiquettes de blocs

- **« Affichage »** — L920 · `panneau.etiq.affichage` → **“Display”**
- **« Voix de Lumen »** — L926 · `panneau.etiq.voix` → **“Lumen's voice”**
- **« Rotation — non mesurée »** — L930 · `panneau.etiq.spin` → **“Spin — not measured”**
- **« Volume de la voix »** — L935 · `panneau.etiq.volume` → **“Voice volume”**
- **« Musique et ambiance »** — L939 · `panneau.etiq.musique` → **“Music and ambience”**
- **« Dans le vaisseau »** — L943 · `panneau.etiq.acces` → **“Aboard the ship”**
- **« Lumen, le guide »** — L947 · `panneau.etiq.lumen` → **“Lumen, the guide”**
- **« Taille des sondes »** — L951 · `panneau.etiq.taille` → **“Probe size”**
- **« Guide »** — L955 · `panneau.etiq.guide` → **“Guide”**

### Boutons du panneau

- **« Trajectoires »** — L922, bascule d'affichage des trajectoires
  `panneau.traj` → **“Trajectories”** *(établi)*

- **« Missions »** — L956, bascule du panneau des missions
  `panneau.missions` → **“Missions”**

- **« Refaire l'introduction »** — L963, relance la quête d'accueil
  `panneau.quete` → **“Replay the introduction”**

- **« Pourquoi c'est exact ? »** — L965, ouvre le dossier de méthode
  `panneau.methode` → **“Why is this accurate?”** *(voir « À trancher »)*

### Rotation

- **« On ne connaît pas le spin de Sagittarius A*. Ces quatre valeurs sont des hypothèses, pas des mesures. »** — L932, note sous la grille
  `panneau.spin.note` → **“We don't know the spin of Sagittarius A*. These four values are hypotheses, not measurements.”**

- **« aucune »** — L3444 · `panneau.spin.aucune` → **“none”**
- **« Cas de référence, non une mesure : l'ombre est un cercle parfait et l'image est sans défaut. »** — L3444
  `panneau.spin.aucune.note` → **“Reference case, not a measurement: the shadow is a perfect circle and the image is free of artifacts.”**

- **« modérée »** — L3445 · `panneau.spin.moderee` → **“moderate”**
- **« Hypothèse. L'ombre se décentre du côté où la rotation vient vers toi. »** — L3445
  `panneau.spin.moderee.note` → **“Hypothesis. The shadow shifts off-center towards the side where the rotation is coming at you.”**

- **« rapide »** — L3446 · `panneau.spin.rapide` → **“fast”**
- **« Hypothèse. Asymétrie mesurée dans notre calcul : 2,30 contre 2,40 en théorie. »** — L3446
  `panneau.spin.rapide.note` → **“Hypothesis. Asymmetry measured in our own calculation: 2.30 against 2.40 in theory.”** — *formulation obscure, voir « Fautif »*

- **« extrême »** — L3447 · `panneau.spin.extreme` → **“extreme”**
- **« Hypothèse haute, proche de la limite de Thorne. C'est la forme de Gargantua. »** — L3447
  `panneau.spin.extreme.note` → **“High-end hypothesis, close to the Thorne limit. This is the shape of Gargantua.”**

- **« Une fine couture apparaît sur l'axe : c'est la singularité de coordonnées, pas un défaut de calcul. »** — L3448, suffixe ajouté à la note dès que le spin est non nul
  `panneau.spin.couture` → **“A fine seam appears along the axis: that is the coordinate singularity, not a flaw in the calculation.”**

### Taille des sondes

- **« à peine visible »** — L2733 · `panneau.taille.minuscule` → **“barely visible”**
- **« normale »** — L2733 · `panneau.taille.normale` → **“normal”**
- **« grosse »** — L2733 · `panneau.taille.grosse` → **“large”**
- **« énorme »** — L2733 · `panneau.taille.enorme` → **“huge”**

### Volume de la voix

- **« discret »** — L3463 · `panneau.volume.discret` → **“quiet”**
- **« normal »** — L3463 · `panneau.volume.normal` → **“normal”**
- **« fort »** — L3463 · `panneau.volume.fort` → **“loud”**
- **« très fort »** — L3463 · `panneau.volume.tresfort` → **“very loud”**

### Musique et ambiance

- **« silence »** — L3481 · `panneau.musique.silence` → **“off”**
- **« discret »** — L3481 · `panneau.musique.discret` → **“quiet”**
- **« présent »** — L3481 · `panneau.musique.present` → **“present”**
- **« fort »** — L3481 · `panneau.musique.fort` → **“loud”**

### Dans le vaisseau

- **« les objets »** — L3501, on interagit avec le décor
  `panneau.acces.objets` → **“the objects”**
- **« la barre »** — L3501, on retrouve les boutons du dock
  `panneau.acces.barre` → **“the bar”**

### Lumen, le guide

- **« bavard »** — L3521 · `panneau.lumen.bavard` → **“chatty”**
- **« mesuré »** — L3521 · `panneau.lumen.mesure` → **“measured”**
- **« discret »** — L3521 · `panneau.lumen.discret` → **“sparing”**
- **« silencieux »** — L3522 · `panneau.lumen.silencieux` → **“silent”**
- **« absent »** — L3522, dernier cran : l'avatar disparaît
  `panneau.lumen.absent` → **“gone”**

---

## Lumen et sa bulle

- **« Parler à Lumen »** — L969, `aria-label` du corps de la mascotte
  `lumen.parler` → **“Talk to Lumen”**

- **« Lire à voix haute »** — L1001, `title` du bouton haut-parleur
  `lumen.voix.lire` → **“Read aloud”**

- **« Fermer »** — L1005, `title` et `aria-label` de la croix de la bulle
  `lumen.fermer` → **“Close”**

- **« Couper la voix »** — L3540, `title` quand la voix est active
  `lumen.voix.couper` → **“Mute the voice”**

- **« Activer la voix »** — L3540, `title` quand la voix est coupée
  `lumen.voix.activer` → **“Turn the voice on”**

- **« d'où ça sort ? »** — L3327, bouton de justification sous une affirmation
  `lumen.justif` → **“where's that from?”** *(établi — la formule apparaît déjà dans les répliques anglaises)*

- **« Vas-y, demande : »** — L3399, en-tête de la liste des questions
  `lumen.questions` → **“Go ahead, ask:”**

---

## Quête d'accueil

- **« Passer l'introduction »** — L863, `title` de la croix
  `quete.passer` → **“Skip the introduction”**

- **« {n} sur {total} »** — L3834, compteur d'étapes
  `quete.num` → **“{n} of {total}”**

- **« Bien »** — L3870, titre affiché quand l'étape est validée
  `quete.bien` → **“Good”**

---

## Panneau des missions

- **« Masquer les missions »** — L853, `title` de la croix
  `mission.masquer` → **“Hide the missions”**

- **« Mission {n} sur {total} »** — L3917, numéro de la mission courante
  `mission.num` → **“Mission {n} of {total}”**

- **« Réussi »** — L3942, remplace le numéro quand la mission est validée
  `mission.reussi` → **“Done”**

---

## Écran d'accueil et menu

- **« Trou noir »** — L1013, `h1` du bloc d'accueil dans le balisage
  `accueil.titre.statique` → **“Black hole”** — *chaîne morte, voir « Fautif »*

- **« Tout ce que tu vas voir est calculé à partir des équations d'Einstein, pas dessiné. Choisis par quoi commencer. »** — L1014, chapô du bloc d'accueil dans le balisage
  `accueil.chapo.statique` → **“Everything you are about to see is calculated from Einstein's equations, not drawn. Choose where to begin.”** — *chaîne morte, voir « Fautif »*

- **« Périastre »** — L4049 et L4194, titre de l'écran d'accueil et du menu
  `accueil.titre` → **“Periastron”**

- **« 🔊 Entrer, avec la voix de Lumen »** — L4057, premier bouton d'entrée
  `accueil.entrer.voix` → **“🔊 Enter, with Lumen's voice”**

- **« Entrer en silence »** — L4058, second bouton d'entrée
  `accueil.entrer.muet` → **“Enter in silence”**

- **« Où en es-tu ? »** — L4122, titre de la question sur le niveau de lecture
  `accueil.niveau.titre` → **“Where are you starting from?”**

- **« Par où veux-tu commencer ? »** — L4155, titre du choix de porte d'entrée
  `accueil.depart.titre` → **“Where do you want to start?”**

- **« Tu pourras changer à tout moment. Ce n'est qu'une porte d'entrée. »** — L4156, chapô du même écran
  `accueil.depart.chapo` → **“You can change at any time. This is only a way in.”**

- **« Regarder le trou noir »** — L4174, titre de la première porte
  `accueil.porte.libre.titre` → **“Look at the black hole”**

- **« La vue libre, autour de l'astre. On tourne, on zoome, on lance des sondes. Le plus léger, et ce qui marche le mieux sur téléphone. »** — L4175, détail de la première porte
  `accueil.porte.libre.detail` → **“The free view, around the object. You turn, you zoom, you launch probes. The lightest option, and the one that works best on a phone.”**

- **« Monter à bord »** — L4179, titre de la deuxième porte
  `accueil.porte.salon.titre` → **“Come aboard”** *(établi)*

- **« Le salon d'un vaisseau en orbite, avec une baie vitrée. On s'y déplace à pied, on parle au robot de bord, on règle la vitesse du temps au mur. Plus gourmand — mieux vaut un ordinateur. »** — L4180, détail de la deuxième porte
  `accueil.porte.salon.detail` → **“The lounge of a ship in orbit, with a picture window. You move around on foot, you talk to the onboard robot, you set the speed of time on the wall. Heavier — better on a computer.”**

- **« Apprendre, guidé »** — L4185, titre de la troisième porte
  `accueil.porte.missions.titre` → **“Learn, guided”**

- **« Huit missions, une chose à comprendre par mission. On n'a besoin de rien savoir d'avance, et la première dure trois minutes. »** — L4186, détail de la troisième porte
  `accueil.porte.missions.detail` → **“Eight missions, one thing to understand per mission. You need to know nothing in advance, and the first takes three minutes.”**

- **« Tu as déjà compris {n} chose{s} sur {total}. On continue ? »** — L4197, chapô du menu quand des missions sont acquises
  `accueil.reprise` → **“You've understood {n} thing{s} out of {total}. Shall we go on?”** — *pluriel fabriqué en dur, voir « Fautif »*

- **« Le point d'une orbite où l'on passe au plus près. Choisis par quoi commencer. »** — L4198, chapô du menu au premier passage
  `accueil.chapo` → **“The point of an orbit where you pass closest. Choose where to begin.”** — *glose du titre, voir « À trancher »*

- **« Tout recommencer »** — L4214, efface la mémoire locale
  `accueil.oubli` → **“Start over”**

- **« Commencer »** — L4227, bouton du détail d'une expérience
  `accueil.commencer` → **“Begin”**

- **« Retour »** — L4228, bouton du détail d'une expérience
  `accueil.retour` → **“Back”**

---

## Dossier « pourquoi c'est exact » et banc d'essai

- **« Pourquoi cette image est exacte »** — L1025, titre du dossier
  `dossier.titre` → **“Why this image is accurate”**

- **« Et ce qui, dedans, ne l'est pas. »** — L1026, chapeau du dossier
  `dossier.chapeau` → **“And what, inside it, is not.”**

- **« Fermer »** — L1024, `aria-label` de la croix du dossier
  `dossier.fermer` → **“Close”**

- **« Vérifier le moteur maintenant »** — L1030, bouton qui lance le banc d'essai
  `banc.lancer` → **“Check the engine now”** *(voir « À trancher »)*

- **« Calcul en cours… »** — L4384, libellé du bouton pendant les mesures
  `banc.calcul` → **“Calculating…”**

- **« Relancer la vérification »** — L4411, libellé du bouton une fois fini
  `banc.relancer` → **“Run the check again”**

- **« Grandeur »** — L4389, en-tête de colonne · `banc.col.grandeur` → **“Quantity”**
- **« Théorie »** — L4389, en-tête de colonne · `banc.col.theorie` → **“Theory”**
- **« Mesuré ici »** — L4389, en-tête de colonne · `banc.col.mesure` → **“Measured here”**
- **« Écart »** — L4389, en-tête de colonne · `banc.col.ecart` → **“Difference”**

- **« Sphère des photons »** — L4328 · `banc.essai.photon.nom` → **“Photon sphere”**
- **« Rayon de l'orbite circulaire de la lumière »** — L4329
  `banc.essai.photon.quoi` → **“Radius of light's circular orbit”**
- **« 3M = 1,5 »** — L4331, valeur attendue · `banc.essai.photon.attendu` → **“3M = 1.5”**

- **« Rayon de l'ombre »** — L4338 · `banc.essai.ombre.nom` → **“Shadow radius”**
- **« Paramètre d'impact critique de capture »** — L4339
  `banc.essai.ombre.quoi` → **“Critical capture impact parameter”**
- **« √27·M ≈ 2,598 »** — L4341 · `banc.essai.ombre.attendu` → **“√27·M ≈ 2.598”**

- **« Déflexion de la lumière »** — L4345 · `banc.essai.deflexion.nom` → **“Light deflection”**
- **« Déviation d'un rayon rasant à b = 1000 »** — L4346
  `banc.essai.deflexion.quoi` → **“Deflection of a grazing ray at b = 1000”**
- **« 4M/b = 0,002 »** — L4348 · `banc.essai.deflexion.attendu` → **“4M/b = 0.002”**

- **« Dernière orbite stable »** — L4355 · `banc.essai.isco.nom` → **“Last stable orbit”**
- **« En deçà, aucune orbite de matière ne tient »** — L4356
  `banc.essai.isco.quoi` → **“Below it, no orbit of matter holds”**
- **« 6M = 3 »** — L4358 · `banc.essai.isco.attendu` → **“6M = 3”**

- **« conforme »** — L4424, verdict sous 0,5 % d'écart · `banc.verdict.ok` → **“matches”**
- **« proche »** — L4424, verdict sous 3 % · `banc.verdict.bof` → **“close”**
- **« écart »** — L4424, verdict au-delà · `banc.verdict.non` → **“off”**

- **« Calculé en {t} s dans ton navigateur, avec l'équation qui dessine l'image ci-derrière. Aucune de ces quatre valeurs n'est écrite dans le code : ce sont des sorties. Sur la déflexion, l'écart résiduel n'est pas une erreur : `4M/b` n'est que le premier ordre. Le terme suivant vaut `15πM²/4b² = {x}`, soit précisément le décalage mesuré — l'intégration est plus juste que la formule de référence. Et Newton, lui, prédisait {y} rad : exactement la moitié. C'est ce facteur 2 qu'Eddington est allé mesurer en 1919. »** — L4399, paragraphe de conclusion du banc
  `banc.apres` → **“Calculated in {t} s in your browser, with the equation that draws the image behind this. None of these four values is written into the code: they are outputs. On the deflection, the residual gap is not an error: `4M/b` is only the first order. The next term is `15πM²/4b² = {x}`, which is exactly the offset measured — the integration is more accurate than the reference formula. And Newton predicted {y} rad: exactly half. That factor of 2 is what Eddington went to measure in 1919.”**

---

## Bandeau chiffré

- **« de vol · {n} tour »** — L3143, temps de vol du photon suivi
  `lecture.vol` → **“in flight · {n} turns”** — *accord jamais fait en français, voir « Fautif »*

- **« {x} millions de km parcourus à la vitesse de la lumière. »** — L3144, note sous le chiffre
  `lecture.km` → **“{x} million km covered at the speed of light.”**

- **« par tour d'anneau »** — L3147, libellé du chiffre par défaut
  `lecture.tour` → **“per lap of the ring”**

- **« C'est le temps, chronométré d'ici, que met un photon pour boucler la sphère des photons : 6√3·πGM/c³. Il est déjà 15 min plus vieux quand il t'arrive. »** — L3148, note par défaut
  `lecture.note` → **“That is the time, clocked from here, a photon takes to go once round the photon sphere: 6√3·πGM/c³. It is already 15 min older by the time it reaches you.”**

---

## Le salon : écrans de bord et manette

- **« Tourne ton téléphone — le trou noir est large. »** — L872, conseil de rotation en portrait
  `salon.tourne` → **“Turn your phone sideways — the black hole is wide.”** *(voir « Fautif »)*

- **« saut »** — L1042, bouton de la manette tactile
  `salon.manette.saut` → **“jump”**

- **« POSITION »** — L4679, titre de l'écran de gauche
  `salon.ecran.position` → **“POSITION”**

- **« ORBITE EXCENTRIQUE »** — L4684, sous-titre de l'écran de gauche
  `salon.ecran.orbite` → **“ECCENTRIC ORBIT”**

- **« NOUS »** — L4721, étiquette du vaisseau sur le schéma d'orbite
  `salon.ecran.nous` → **“US”**

- **« TEMPS DE BORD »** — L4760, titre de l'écran de droite
  `salon.ecran.temps` → **“SHIP TIME”**

- **« EN ORBITE ICI DEPUIS »** — L4772, étiquette du compteur d'ancienneté
  `salon.ecran.depuis` → **“IN ORBIT HERE FOR”**

- **« PENDANT CE TEMPS »** — L4801, étiquette du bloc des deux horloges
  `salon.ecran.pendant` → **“MEANWHILE”**

- **« SUR TERRE »** — L4802, première horloge
  `salon.ecran.terre` → **“ON EARTH”**

- **« À BORD »** — L4803, seconde horloge
  `salon.ecran.bord` → **“ABOARD”**

- **« Tu as pris {t} de retard sur eux · ton horloge tourne à {x} % »** — L4809, pied de l'écran de droite
  `salon.ecran.retard` → **“You have fallen {t} behind them · your clock runs at {x} %”**

- **« Mouvement accéléré ×{f} pour qu'il se voie. »** — L4811, aveu sous le retard
  `salon.ecran.accelere` → **“Motion sped up ×{f} so you can see it.”**

---

## Cockpit de la sonde

- **« ton temps s'écoule à »** — L4872, cadran (affiché en capitales)
  `cockpit.temps` → **“your time runs at”**

- **« ta vitesse »** — L4873, cadran
  `cockpit.vitesse` → **“your speed”**

- **« ton altitude »** — L4874, cadran
  `cockpit.altitude` → **“your altitude”**

- **« marée »** — L4876, cadran conditionnel
  `cockpit.maree` → **“tidal”** *(voir « À trancher »)*

- **« TOI, ICI »** — L4913, en-tête de l'horloge de gauche
  `cockpit.toi` → **“YOU, HERE”**

- **« TON JUMEAU, RESTÉ LOIN »** — L4915, en-tête de l'horloge de droite
  `cockpit.jumeau` → **“YOUR TWIN, LEFT BEHIND”**

- **« il a vieilli de {t} de plus que toi »** — L4928, sous les deux horloges quand l'écart est net
  `cockpit.ecart` → **“they have aged {t} more than you”**

- **« descends plus près, et regarde-les s'écarter »** — L4931, invitation quand l'écart est encore nul
  `cockpit.invite` → **“go down closer, and watch them come apart”**

---

## Messages et avis

- **« figée à l'horizon »** — L2669, message fugace quand une sonde se fige
  `msg.figee` → **“frozen at the horizon”**

- **« photon absorbé »** — L2696, message fugace
  `msg.photonAvale` → **“photon absorbed”**

- **« photon échappé »** — L2697, message fugace
  `msg.photonFuite` → **“photon escaped”**

- **« Position copiée. Colle le lien dans ton rapport : elle se rouvrira ici même. »** — L2170, après la touche C au salon
  `msg.copie.ok` → **“Position copied. Paste the link into your report: it will reopen right here.”**

- **« Copie refusée par le navigateur. Le lien est dans la barre d'adresse. »** — L2171, repli quand le presse-papiers est refusé
  `msg.copie.non` → **“The browser refused the copy. The link is in the address bar.”**

- **« Si tu n'entends rien : le petit interrupteur sur la tranche de l'iPhone coupe aussi le son des pages web. »** — L4105, avertissement iOS
  `msg.ios.texte` → **“If you can't hear anything: the little switch on the side of the iPhone mutes web pages too.”**

- **« J'ai compris »** — L4107, bouton de l'avertissement iOS
  `msg.ios.compris` → **“Got it”**

- **« Ton navigateur ne supporte pas WebGL2. »** — L1766, page de repli si le contexte WebGL2 manque
  `msg.webgl` → **“Your browser does not support WebGL2.”**

---

## Formats

Ce ne sont pas des chaînes, mais ils fabriquent du texte français et se
verraient tout autant qu'un bouton oublié. Ils appellent une fonction par
langue, pas une clé.

- **L3130-3135, `tempsFr()`** — virgule décimale, et les suffixes « s », « min »,
  « h » accolés dans l'ordre français (`11 min 31 s`). L'anglais dit
  `11 min 31 s` de la même façon, mais `1,5 s` doit devenir `1.5 s`.

- **L4379, `nb()`** — `toLocaleString("fr-FR", …)`, codé en dur. Sert à tous les
  chiffres du banc d'essai.

- **L4788-4790** — `toLocaleDateString("fr-FR", …)` et `toLocaleTimeString("fr-FR")`
  pour les deux horloges de l'écran de droite. Une date en anglais s'écrit dans
  un autre ordre, ce qui change aussi la largeur de la colonne.

- **L4686, L4872-4876** — trois `.replace(".", ",")` isolés, sur le rayon affiché
  à l'écran de gauche et sur les trois cadrans du cockpit.

- **L4331, L4341, L4348** — les valeurs attendues du banc d'essai portent des
  virgules décimales *dans la chaîne* (`3M = 1,5`, `√27·M ≈ 2,598`,
  `4M/b = 0,002`). Elles ont donc besoin d'une traduction, pas d'un formateur.

---

## À trancher

Les chaînes dont la traduction engage un choix éditorial. Aucune n'a de bonne
réponse évidente, et les décider une fois vaut mieux que les décider dix fois.

**1. Le nom du site.** `contenu.en.js` appelle le vaisseau **“the Periastron”**
(réplique `a-lumen-ok`). Le site, lui, s'appelle « Périastre ». Trois options :
garder « Périastre » tel quel comme nom propre, l'angliciser en « Periastron »
au risque de le confondre avec le vaisseau, ou choisir un troisième nom. Ce
choix commande le point suivant.

**2. Le chapô du menu, L4198.** « Le point d'une orbite où l'on passe au plus
près » n'est pas une phrase d'accroche : c'est la **définition du mot du titre**.
Elle ne fonctionne que si le titre reste un mot dont le sens se laisse gloser. Si
le site devient « Periastron », la glose tient (« periastron » est un mot
anglais). Si le titre change, cette phrase devient orpheline et doit être
réécrite, pas traduite.

**3. « Cours ».** Le panneau contient des fiches à trois niveaux de lecture, pas
un cours suivi. « Course » est lourd et trompeur en anglais ; « Notes » est sobre
et juste ; « Read » serait plus invitant mais perd l'idée de matière. Proposé :
**“Notes”**.

**4. « Pourquoi c'est exact ? » (L965) et « Pourquoi cette image est exacte »
(L1025).** Le français a déjà deux formulations pour la même chose, et l'anglais
en a une troisième : `contenu.en.js` intitule l'expérience correspondante
**“How we know this is true”**. Trois formules pour un seul objet. Il faut choisir
si l'anglais s'aligne sur la formule déjà traduite — auquel cas le bouton devient
« How we know this is true » et le titre du dossier suit — ou s'il garde la
distinction bouton/titre du français.

**5. « Vérifier le moteur maintenant » (L1030).** « Moteur » est ambigu même en
français : moteur de rendu, moteur physique, moteur d'intégration ? Ce que le
banc vérifie, ce sont les équations. « Check the engine now » conserve
l'ambiguïté ; « Run the check now » ou « Check the physics now » la lèvent mais
changent le sens.

**6. « marée » (L4876).** Le cadran affiche un nombre sans unité. « Tide » seul
évoque la mer et non la force de marée. « Tidal » en adjectif seul est étrange ;
« tidal force » est plus juste mais deux fois plus long, et le cadran est étroit.

**7. « figées » (L845).** Le compteur des sondes arrêtées à l'horizon. « Frozen »
est le terme reçu (*frozen star*) et je le recommande, mais il dit « gelé » à qui
ne connaît pas l'expression. « Stalled » ou « held » seraient plus littéraux et
moins justes.

**8. « discret » dans trois groupes.** Le mot sert de libellé pour le volume de
la voix (L3463), pour la musique (L3481) et pour la fréquence des interventions
de Lumen (L3521). Trois sens : *pas fort*, *pas fort*, *pas souvent*. Il faut
décider si l'anglais garde un mot unique — ce qui n'est pas possible sans perdre
le troisième — ou trois mots distincts. Proposé ci-dessus : *quiet* / *quiet* /
*sparing*.

**9. « les objets » / « la barre » (L3501).** Deux libellés très courts pour un
choix qui n'est pas évident sans son étiquette (« Dans le vaisseau »). Un anglais
littéral (*the objects* / *the bar*) est aussi opaque. Il faudrait peut-être
allonger : *touch the objects* / *use the bar*.

**10. Les capitales des écrans de bord.** « NOUS » → « US » fait deux lettres et
peut se lire comme le sigle des États-Unis sur un écran de vaisseau. « TON
JUMEAU, RESTÉ LOIN » perd son participe en anglais (*left behind* déplace la
responsabilité : c'est toi qui es parti). Ces cinq ou six étiquettes méritent
d'être relues ensemble, dans le rendu, plutôt qu'une par une.

**11. Le format des dates.** Voir la section *Formats*. La question n'est pas
seulement laquelle est correcte, mais si les deux langues doivent afficher la
même chose : les deux horloges du salon sont côte à côte et se comparent au
caractère près.

---

## Fautif, obsolète ou incohérent

Ce qui mérite un coup d'œil avant traduction, puisque traduire une erreur la
duplique.

**1. Le bouton « Monter à bord » a deux noms.** Le balisage dit « Monter à bord »
(L890), mais `embarque()` réécrit le libellé en « Monter dans une sonde »
(L2399) dès qu'on est redescendu une fois. Le bouton change donc de nom en cours
de session, sans que rien ne l'ait justifié. Par ailleurs `contenu.en.js` et les
consignes de missions annoncent « Come aboard » : c'est L890 qui a raison.

**2. Deux chaînes mortes dans `#accueil`.** Le `<h1>Trou noir</h1>` (L1013) et son
paragraphe (L1014) ne s'affichent jamais : `intro()` écrit `elTitre.textContent =
"Périastre"` et `elChapo.innerHTML = CONTENU.accueil.bienvenue.t` avant tout
rendu. Ce sont les seuls textes du fichier à ne servir à rien. À supprimer plutôt
qu'à traduire — mais la décision revient à l'auteur, puisqu'ils font peut-être
office de repli si le script échoue.

**3. Le pluriel de « tour » n'est jamais fait.** L3143 écrit `${x} tour` sans
accord : le bandeau affiche « 2.31 tour ». En français c'est déjà fautif ; en
anglais « 2.31 turn » le sera tout autant. Il faut un accord, dans les deux
langues.

**4. Le pluriel de « chose » est fabriqué en dur.** L4197 :
`chose${n>1?"s":""}`. Ça marche en français, ça marche par chance en anglais
(*thing/things*), et ça ne marchera dans aucune troisième langue. Puisqu'on
ouvre le chantier des langues, c'est le moment de le sortir de la chaîne.

**5. La note du spin « rapide » est obscure (L3446).** « Asymétrie mesurée dans
notre calcul : 2,30 contre 2,40 en théorie » — asymétrie de quoi, et en quelle
unité ? Les trois autres notes de la même grille sont des phrases complètes ;
celle-ci lâche deux nombres nus. Elle demande à être réécrite en français avant
d'être traduite.

**6. « Rotation » et « spin » cohabitent dans le même bloc.** L'étiquette dit
« Rotation — non mesurée » (L930), la note juste dessous dit « On ne connaît pas
le spin » (L932). Deux mots pour une seule grandeur, à trois lignes d'écart.

**7. « Tourne ton téléphone » s'affiche aussi hors téléphone.** Le conseil de
rotation (L872) est déclenché par l'orientation seule, donc il apparaît sur une
tablette en portrait, et sur une fenêtre de bureau étroite et haute. Le mot
« téléphone » y est faux. Une formule sans appareil (« Tourne l'écran ») serait
juste partout.

**8. Le bloc « Guide » contient deux choses sans rapport.** L'étiquette « Guide »
(L955) chapeaute « Missions » et « Refaire l'introduction ». Le second n'est pas
un guide, c'est une remise à zéro. L'étiquette ne décrit qu'un de ses deux
boutons.

**9. Un commentaire obsolète sur la touche « v ».** L3120 affirme que « la touche
« v » menait à la vue embarquée, retirée de la bêta ». Or « v » est toujours
active et bascule la première/troisième personne au salon (L2116-2122, et `"v"`
est bien dans `TOUCHES_JEU`). Ce n'est pas une chaîne d'interface, mais le
commentaire égare quiconque touche à cette zone — et rien dans l'interface
n'annonce cette touche au visiteur.

**10. `title="Réglages — Échap"` (L849) est vrai à moitié.** Échap n'ouvre le
panneau que si le dossier n'est pas ouvert (L3125), et sert par ailleurs à
fermer le dossier (L4286). L'infobulle promet une bascule inconditionnelle.
