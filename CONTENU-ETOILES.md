# Contenu de la scène « les étoiles S » — prêt à coller

**Ce fichier ne modifie rien.** Il contient du texte à recopier dans `contenu.js`,
`contenu.en.js` et leurs blocs `sources`. Aucun fichier existant n'a été touché.

**Trois avertissements avant de coller.**

1. **Barres obliques inverses.** Tout ce qui suit est écrit tel qu'il doit
   apparaître **dans le fichier `.js`**, chaînes de gabarit comprises. Les
   formules portent donc déjà `\\pi`, `\\simeq`, `\\Delta`, `\\gtrsim` — barre
   **doublée**. Ne les simplifie pas en recopiant : c'est exactement le piège qui
   avait donné quatre formules en charabia.
2. **Clés de sources.** Cinq clés nouvelles sont nécessaires : `gillessen2017`,
   `gravity2022b` *(non — voir plus bas, aucune)*, `maoz1998`, `schoedel2003`,
   `ghez1998`, `habibi2017`. Elles sont rédigées au § 1.1 (fr) et § 2.1 (en).
   `genzel2010`, `gravity2018`, `gravity2020`, `gravity2021`, `nobel2020`,
   `penrose1965`, `eht2022`, `bardeen1972`, `bardeen1973`, `misner1973` existent
   déjà et sont réutilisées telles quelles.
3. **Les `id`.** Ceux des répliques (`q7-0`, `q8-1`…) sont des noms de fichiers
   de voix. Ils sont neufs et ne collisionnent avec aucun `id` existant de
   `contenu.js` (dernière question existante : `q6-*`). Les mêmes `id` sont
   employés dans les deux langues, comme le veut `ARCHITECTURE-LANGUES.md`.

Une chose que j'ai vérifiée et qui te concerne, en dehors de cette scène :
`contenu.js` écrit `R₀ = 8 277 ± 9 ± 33 pc`. Le texte de GRAVITY 2022 dit
« *systematics that are ≈30 pc for R₀ and ≈40 000 M☉ for M•* ». Le `± 0,040`
sur la masse est donc exact ; le `± 33` sur la distance ne l'est pas dans cet
article-là. Voir § 5, point 6. Je n'ai rien modifié.

---

## 1. Français — à coller dans `contenu.js`

### 1.1 Ajouts au bloc `sources`

```js
  gillessen2017: {
    ref: "S. Gillessen, P. M. Plewa, F. Eisenhauer, R. Sari, I. Waisberg, M. Habibi, O. Pfuhl, E. George, J. Dexter, S. von Fellenberg, T. Ott, R. Genzel, « An Update on Monitoring Stellar Orbits in the Galactic Center », The Astrophysical Journal 837, 30 (2017)",
    doi: "10.3847/1538-4357/aa5c41",
    sert: "Éléments orbitaux des 40 étoiles S ; ajustement multi-étoiles M = 4,28 ± 0,10 × 10⁶ M☉ à R₀ = 8,32 ± 0,07 kpc",
  },
  gravity2020b: {
    ref: "GRAVITY Collaboration (Abuter et al.), « Mass distribution in the Galactic Centre based on interferometric astrometry of multiple stellar orbits », Astronomy & Astrophysics 657, L12 (2022)",
    doi: "10.1051/0004-6361/202142465",
    sert: "NE PAS AJOUTER — doublon de gravity2021 déjà présent. Ligne laissée ici pour mémoire.",
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
```

> **Retire la ligne `gravity2020b` avant de coller** : `gravity2021` couvre déjà
> l'article A&A 657, L12 (2022). Je l'ai laissée pour que tu voies que je m'en
> suis aperçu et que je ne l'ai pas dupliquée en douce.

### 1.2 Fiches — à ajouter au tableau `fiches`

```js
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
    ["nobel2020", "penrose1965"],
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
```

### 1.3 Questions — à ajouter au tableau `questions`

```js
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
```

---

## 2. English — à coller dans `contenu.en.js`

### 2.1 Ajouts au bloc `sources`

```js
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
```

### 2.2 Cards — à ajouter au tableau `fiches`

```js
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
   `"Four million suns in a tiny space." Fine — but why a black hole? Why not
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
    ["nobel2020", "penrose1965"],
    ["gravity2021", "gravity2018", "genzel2010"],
    ["gravity2021", "nobel2020", "penrose1965", "eht2022"],
  ],
  t: [
   `The 2020 Nobel Prize in Physics rewarded exactly this reasoning.
    <br><br>One half went to <b>Reinhard Genzel</b> and <b>Andrea Ghez</b>, a
    quarter each, "<i>for the discovery of a supermassive compact object at the
    centre of our galaxy</i>". Two teams with nothing in common: one measuring at
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
    "<i>supermassive compact object</i>", not "black hole". The committee was
    careful, and it was right to be: orbits constrain a mass and a density, not a
    horizon. The horizon was the EHT's business, two years later.`,
  ]
},
```

### 2.3 Questions — à ajouter au tableau `questions`

```js
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
```

---

## 3. Sources — chaque chiffre, son article

Toutes les vérifications ont été faites contre les articles eux-mêmes (résumés
arXiv reproduits mot pour mot, ou texte extrait du PDF de l'éditeur), et non de
mémoire. Les six références nouvelles sont listées en tête ; les autres existent
déjà dans `contenu.js`.

### Références

| Clé | Référence |
|---|---|
| **G17** `gillessen2017` | Gillessen S., Plewa P. M., Eisenhauer F., Sari R., Waisberg I., Habibi M., Pfuhl O., George E., Dexter J., von Fellenberg S., Ott T., Genzel R., « An Update on Monitoring Stellar Orbits in the Galactic Center », *ApJ* **837**, 30 (2017). arXiv:1611.09144 |
| **GR18** `gravity2018` | GRAVITY Collaboration (Abuter R. *et al.*), « Detection of the gravitational redshift in the orbit of the star S2… », *A&A* **615**, L15 (2018). arXiv:1807.09409 |
| **GR20** `gravity2020` | GRAVITY Collaboration, « Detection of the Schwarzschild precession in the orbit of the star S2… », *A&A* **636**, L5 (2020). arXiv:2004.07187 |
| **GR22** `gravity2021` | GRAVITY Collaboration, « Mass distribution in the Galactic Centre based on interferometric astrometry of multiple stellar orbits », *A&A* **657**, L12 (2022). arXiv:2112.07478 |
| **GEG10** `genzel2010` | Genzel R., Eisenhauer F., Gillessen S., « The Galactic Center massive black hole and nuclear star cluster », *Rev. Mod. Phys.* **82**, 3121 (2010). arXiv:1006.0064 |
| **M98** `maoz1998` | Maoz E., « Dynamical Constraints on Alternatives to Supermassive Black Holes in Galactic Nuclei », *ApJ* **494**, L181 (1998). arXiv:astro-ph/9710309 |
| **S03** `schoedel2003` | Schödel R., Genzel R., Ott T., Eckart A., Mouawad N., Alexander T., « Stellar dynamics in the central arcsecond of our galaxy », *ApJ* **596**, 1015 (2003). arXiv:astro-ph/0306214 |
| **H17** `habibi2017` | Habibi M., Gillessen S., Martins F., Eisenhauer F. *et al.*, « Twelve Years of Spectroscopic Monitoring in the Galactic Center… », *ApJ* **847**, 120 (2017). arXiv:1708.06353 |
| **G98** `ghez1998` | Ghez A. M., Klein B. L., Morris M., Becklin E. E., « High Proper-Motion Stars in the Vicinity of Sgr A*… », *ApJ* **509**, 678 (1998). arXiv:astro-ph/9807210 |
| **EHT22** `eht2022` | EHT Collaboration, « First Sagittarius A* EHT Results. I. », *ApJL* **930**, L12 (2022) |
| **NOB** `nobel2020` | Prix Nobel de physique 2020 |

### Affirmation → source

**Ce qu'on voit, le raisonnement**

| Affirmation | Source | Où |
|---|---|---|
| Suivi sur trente ans (données de S2 : 1992,2 – 2021,6) | GR22 | § 2, liste des données : « *These data cover the timespan of 1992.2-2021.6.* » |
| Image de Sgr A* publiée en 2022 | EHT22 | déjà dans `contenu.js` |
| S2 : a = 125,058 ± 0,041 mas, e = 0,884649, P = 16,0455 ± 0,0013 an, t_p = 2018,379 | GR20 | Table E.1 (annexe E) |
| R₀ = 8 246,7 ± 9,3 pc dans le même ajustement | GR20 | Table E.1 |
| 0,125058″ × 8 246,7 pc = 1 031 UA ; 1 031³/16,0455² = 4,26 × 10⁶ | *arithmétique* | calcul refait ici à partir des deux lignes ci-dessus |
| M• = 4,261 ± 0,012 × 10⁶ M☉ | GR20 | Table E.1 |
| M ∝ R₀² pour un ajustement astrométrique | GR22 | note de la Table B.1 : « *using $M \propto R_0^2$ (Gillessen et al. 2017)* » |
| G17 : 4,28 ± 0,10 × 10⁶ M☉ à 8,32 ± 0,07 kpc | G17 | Table 1, ligne 9 (ajustement multi-étoiles, 17 étoiles) |
| GR22 : M• = 4,297 ± 0,012 × 10⁶ M☉, R₀ = 8 277 ± 9 pc (erreurs statistiques) | GR22 | § 4 et Table B.1 |
| f_SP = 0,997 ± 0,144 sur l'ajustement à quatre étoiles ; « 14 % measurement precision » | GR22 | Table B.1 et § 4 |
| Éléments osculateurs, rapportés à l'apocentre de 2010 pour S2 | GR20, GR22 | légendes des tableaux |
| Ajustement à 14 paramètres, énumérés | GR22 | § 3 « Analysis » |

**S2**

| Affirmation | Source | Où |
|---|---|---|
| Périastre à 120 UA, ~1 400 rayons de Schwarzschild, v ≈ 7 650 km/s | GR18 | résumé, phrase 2 (verbatim) |
| 7 650 km/s = 2,55 % de c | *arithmétique* | 7 650 / 299 792,458 |
| Passage au périastre en mai 2018 | GR18 | résumé : « *the pericentre approach in May 2018* » ; t_p = 2018,379 |
| Décalage mesuré z ≈ 200 km/s / c ; f = 0,90 ± 0,09 (stat.) ± 0,15 (syst.) | GR18 | résumé (verbatim) |
| « Les données de S2 sont incompatibles avec la dynamique newtonienne pure » | GR18 | résumé, dernière phrase (traduction littérale) |
| f_gr = 1,04 ± 0,05 (mesure ultérieure) | GR22 | § 3, rappel des valeurs de f_gr publiées |
| Précession de Schwarzschild Δφ = 12′ par période ; f_SP = 1,10 ± 0,19 | GR20 | résumé (verbatim) |
| Type spectral B0-B3V, masses 8-14 M☉, âge de S2 6,6 (+3,4 / −4,7) Myr | H17 | résumé (verbatim) |
| Décompte des données de S2 : 128 NACO, 92 SINFONI, 3 Keck, 2 NACO, 4 GNIRS, 82 GRAVITY | GR22 | § 2, liste à puces |
| S2 est brillante : m_K = 13,95 (G17) / K = 14,1 (GR22) | G17, GR22 | Table des 40 orbites ; § 4 |
| Aucun terme de spin dans l'ajustement | GR20 | liste des paramètres de la Table E.1 : a, e, i, ω, Ω, P, t_peri, M, R₀, x₀, y₀, vx₀, vy₀, vz₀, f_SP, f_RS — pas de spin |

**Pourquoi rien d'autre**

| Affirmation | Source | Où |
|---|---|---|
| 1996-1998 : mouvements propres O(10³ km/s) à 0,02 pc ⇒ ρ ≈ 10¹² M☉/pc³ | GEG10 | § IV, texte extrait du PDF |
| À cette densité, un amas collisionnel vit ~10⁷⁻⁸ ans | GEG10 citant M98 | *idem*, verbatim : « *relaxation and collisions lead to core collapse and/or evaporation on a time scale of ~10⁷⁻⁸ yr (Maoz 1998)* » |
| Les orbites depuis 2002 gagnent quatre ordres de grandeur, ~10¹⁶ M☉/pc³ | GEG10 | *idem*, verbatim |
| À cette densité, durée de vie « inférieure à quelques 10⁵ ans » | GEG10 citant M98 | *idem*, verbatim : « *a dark astrophysical cluster would have a lifetime less than a few 10⁵ years (Maoz 1998), just a small fraction of the lifetime of the stars in the central cusp* » |
| Modèle de Plummer : densité centrale > 2,2 × 10¹⁷ M☉/pc³, durée de vie < 10⁵ ans | S03 | § 7.1, verbatim |
| Mécanismes : évaporation (échappement par diffusion gravitationnelle faible) et collisions | M98 | corps de l'article |
| Boule de fermions unique excluse ; étoile à bosons s'effondrant par accrétion | S03 | § 7.1, verbatim |
| Masse étendue ≲ 3 000 M☉ jusqu'à 230 mas ; profil de Plummer de longueur d'échelle 0,3″ | GR22 | résumé et § 4 : « *The measurement errors leave room for at most ≲3000 M☉ in extended mass out to 230 mas.* » |
| Excès de masse seulement au-delà de r ≳ 2,5″ | GR22 | § 4 |
| Aucune matière noire ni trou noir de masse intermédiaire > 10³ M☉ requis ou compatible | GR22 | légende de la Fig. 4 (verbatim) |
| Une galaxie a une dizaine de milliards d'années | M98 | l'argument tout entier est bâti sur la comparaison à l'âge de la galaxie, « ~10 Gyr » |

**Le Nobel, et ce que ça a coûté**

| Affirmation | Source | Où |
|---|---|---|
| Moitié à Penrose, quart à Genzel, quart à Ghez | NOB | communiqué officiel ; formulations reprises par l'ESO (communiqué eso2017) et l'université d'Oxford |
| « pour la découverte d'un objet compact supermassif au centre de notre galaxie » | NOB | citation officielle, Genzel & Ghez |
| « pour la découverte que la formation des trous noirs est une prédiction robuste de la relativité générale » | NOB | citation officielle, Penrose |
| Théorème de singularité de Penrose, 1965 | `penrose1965` | déjà dans `contenu.js` |
| Ghez : Keck 10 m, imagerie à la limite de diffraction, 1995-1997 | G98 | résumé (verbatim) |
| Genzel : NACO/SINFONI au VLT de l'ESO | GR18, GR20 | résumés (verbatim) |
| Accord entre les jeux NTT/VLT et Keck | GEG10 | § IV : « *The data from the NTT/VLT and Keck telescopes agreed very well* » |
| Seeing 0,4-0,5″ → optique adaptative 50-60 mas, astrométrie 300-500 μas → GRAVITY 2 × 4 mas, astrométrie 30-100 μas | GR22 | légende de la Fig. 1 (verbatim) |
| GRAVITY = combinateur interférométrique à quatre télescopes du VLTI, en service depuis 2016 | GR18, GR20, GR22 | résumés (verbatim) |
| Sensibilité m_K = 20 en cumulant une nuit | GR22 | résumé (verbatim) |

**Les questions**

| Affirmation | Source | Où |
|---|---|---|
| Dernière orbite stable à 3 r_s | `bardeen1972` | déjà dans `contenu.js` |
| Ombre de rayon apparent 2,598 r_s, b_c = √27 GM/c² | `bardeen1973` | déjà dans `contenu.js` |
| Anneau EHT de 51,8 ± 2,3 μas | `eht2022` | déjà dans `contenu.js` |
| Temps de relaxation à deux corps au centre galactique : 1 à 20 × 10¹⁰ ans | GEG10 | légende de la Fig. 2.1.1 : « *the two-body relaxation time in the Galactic Center, T_NR ~ 1-20 × 10¹⁰ yr* » |
| S85 : T = 3 580 ± 2 550 ans ; S111 : demi-grand axe négatif, orbite hyperbolique | G17 | table des 40 orbites, recopiée dans `ETOILES-S.md` § 3 |
| 2,6 r_s contre 1 400 r_s : rapport ≈ 540, « des centaines de fois » | *arithmétique* | 1 400 / 2,598 |

---

## 4. Incertitudes — ce que je n'affirme pas

1. **L'âge de la galaxie n'est pas sourcé ici.** Le niveau Découverte de
   `f-preuve` dit « une galaxie qui en a dix milliards ». C'est l'ordre de
   grandeur sur lequel Maoz bâtit tout son argument (« *~10 Gyr* »), mais je
   n'ai pas de mesure d'âge de la Voie lactée à te donner. Si tu veux la
   phrase blindée, remplace par « à l'échelle d'une galaxie, cent mille ans
   n'est rien ».

2. **La masse propre de S2 n'est pas publiée séparément.** Habibi et al. 2017
   donnent 8-14 M☉ pour **l'échantillon de huit étoiles**, et un âge individuel
   pour S2 (6,6 Myr). J'ai donc écrit « entre 8 et 14 masses solaires pour les
   étoiles S étudiées », et non « S2 pèse tant ». Les valeurs qui circulent
   pour la masse de S2 seule (souvent « 15 M☉ » ou « 20 M☉ ») ne viennent pas
   de cet article et je ne les reprends pas.

3. **L'ampleur de l'effet Lense-Thirring sur S2 n'est pas chiffrée.** J'ai
   seulement écrit que le spin ne figure dans aucun de ces ajustements, ce qui
   se lit directement dans la liste des paramètres. Je n'écris pas « le spin est
   dix fois plus petit », « quarante fois plus petit » ni aucun facteur : je
   n'ai pas la valeur publiée sous les yeux.

4. **Le pourcentage de la vitesse de la lumière au périastre.** GR18 publie
   7 650 km/s, soit **2,55 %** de c. `contenu.js` écrit aujourd'hui « 3 % de la
   vitesse de la lumière » dans `f-sgra` niveau 1. Les deux ne sont pas
   compatibles à l'arrondi près. J'ai écrit 2,5 % dans mes entrées ; l'écart
   avec l'existant est à trancher par toi, je n'ai touché à rien.

5. **La densité minimale a plusieurs valeurs publiées, toutes justes.**
   ~10¹⁶ M☉/pc³ (GEG10, densité minimale de l'objet central déduite des
   orbites) ; 2,2 × 10¹⁷ M☉/pc³ (S03, densité **centrale** d'un modèle de
   Plummer, ce qui n'est pas la même grandeur) ; > 3 × 10¹⁹ M☉/pc³ (S03,
   argument radio combinant mouvement propre et taille de source, encore une
   autre grandeur). Je n'utilise que les deux premières, en les distinguant.
   Ne les fusionne pas.

6. **`contenu.js` porte une systématique de distance que je n'ai pas
   retrouvée.** Le texte de GR22 dit : « *see Gravity Coll. 2021 for a
   discussion of the systematics that are ≈30 pc for R₀ and ≈40 000 M☉ for
   M•* ». Le `± 0,040 × 10⁶ M☉` du site est donc bon. Le `± 33 pc`, lui, n'est
   pas dans cet article — il vient peut-être de GRAVITY Coll. 2021 (A&A 647,
   A59), que je n'ai pas dépouillé. À vérifier avant la prochaine relecture de
   `f-sgra`.

7. **Numéros de tableaux.** Comme le signale déjà `ETOILES-S.md`, la
   numérotation des tableaux de G17 dans la version IOP n'est pas confirmée.
   Je cite donc G17 par la légende (« table des quarante orbites », « Table 1,
   ligne 9 ») et jamais par un numéro seul.

8. **Qui a mesuré le premier.** Je ne l'écris nulle part. Les deux groupes ont
   publié des mouvements propres à quelques mois d'intervalle au milieu des
   années 1990, et la question de l'antériorité n'est pas tranchée par les
   sources que j'ai lues. Le texte dit « deux équipes, chacune de son côté, et
   elles sont tombées d'accord », ce qui est ce que GEG10 constate.

9. **La convention angulaire des orbites tracées reste une déduction.**
   `ETOILES-S.md` § 4.4 le dit : l'identification des angles de G17 avec la
   convention de Wright & Howard 2009 n'est pas une citation, et le sens du
   nœud ascendant peut retourner l'orbite. Rien de ce que j'écris ci-dessus ne
   dépend de ce point — je ne fais aucune affirmation sur le **sens** de
   rotation d'une étoile, ni sur l'orientation du plan orbital d'aucune d'elles.
   Si l'essai numérique révèle une inversion, aucun texte n'est à corriger.

10. **S62, S4711-S4715, S4716 restent hors du site.** Leurs périodes plus
    courtes que celle de S2 feraient un bel effet, et je n'en parle nulle part :
    orbites contestées dans la littérature, absentes de G17. Décision déjà prise
    dans `ETOILES-S.md` § 5, je m'y tiens.

11. **Une donnée tentante que je n'ai pas utilisée, et pourquoi.** GR22 donne
    S29 : e = 0,969, périastre en 2021,41 à **100 UA seulement**, à
    ~8 740 km/s. C'est plus près et plus vite que S2. Je ne l'ai pas mis en
    avant parce que S2 est l'étoile du Nobel et de la précession, et que
    mélanger les deux vedettes brouille le récit. Le chiffre est exact et
    sourcé (GR22 § 4) si tu veux l'ajouter.
