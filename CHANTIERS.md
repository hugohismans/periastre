# Ce qui reste à faire, dans l'ordre

Liste courte et ordonnée. Le détail de chaque point est dans `IDEES.md`, qui
sert d'archive ; ce fichier-ci sert à savoir quoi prendre ensuite.

Mis à jour le 9 août 2026, pendant le chantier des fondations.

**État en une ligne :** F1 fait, et sa garantie est enfin MESURÉE · F2 en
chantier, 4 382 → 3 457 lignes · **F3 ouvert, et c'est le seul qui n'a pas
commencé** · F4 fermée, un aveu jamais montré fait désormais échouer un
contrôle · F5 fait.

**Deux choses attendent l'œil d'Hugo**, et rien d'autre ne les tranchera : la
forme du badge d'aveu, et ce que Lumen doit répondre quand on touche le poste
horaire — le code lui demande de réagir et la réplique n'a jamais été écrite.
Les deux sont dans `A-REGARDER.md`, avec les mesures.

---

## Fait, et branché

| | chantier | ce qui existe |
|---|---|---|
| 1 | **Interface** | Barre en rail, menu en index, panneaux en commandes segmentées. **En production.** |
| 3 | **Le voyage à 1 g** | Le télescope est un lieu : on choisit une destination, le vaisseau part, le chronomètre dit ce que le trajet coûte vraiment aux deux horloges. `VOYAGE.enChemin` calcule le temps propre en cours de route au lieu de l'interpoler. |
| 4 | **Le recul logarithmique** | Vécu depuis le salon, par la baie, avec le quadrillage qui se renumérote à chaque décade. |
| 5 | **Les étoiles S** | Dix orbites sourcées, avec étalon, date, et la mention qu'il s'agit d'une reconstruction. Orientable et zoomable. |
| 11 | **Trou noir d'étude** | Un objet distinct, nommé comme tel, à rotation libre. La masse n'y est pas — et le panneau dit pourquoi c'est le point le plus instructif. |
| 12 | **Registre temporel** | Chaque trajet inscrit son écart ; le total se lit dans le carnet de bord. Se fige hors connexion. |

## En cours

| | chantier | état |
|---|---|---|
| 6 | **Le bilingue** | Sélecteur fait, contenu traduit, unités et ponctuation des nombres suivent la langue. **Restent environ cent quarante chaînes en dur**, toutes inventoriées dans `CHAINES-UI.md` avec leur clé et leur traduction — c'est du travail mécanique, pas de la conception. |
| 2 | **Chemin de progression** | Menu en index, base posée. Rien de plus. |

## Les fondations — *ce qui décide si la suite est possible*

Hugo, le 5 août 2026 : les grands chantiers ne sont pas à faire maintenant,
mais à connaître, **pour que les fondations soient adaptées**. Voici donc ce
qui, dans l'état actuel, ouvre la porte — et ce qui la ferme.

### Ce qui tient déjà, et qu'il ne faut pas casser

- **Une destination est une donnée, pas du code.** Jupiter est
  architecturalement la même chose que Sagittarius A*.
- **Les modules sont des fichiers séparés** posant un seul global, éprouvables
  hors page. `voyage1g.js` a été vérifié contre quatre références sans qu'un
  navigateur soit ouvert. C'est le bon patron : tout nouveau calcul doit
  naître ainsi.
- **Le vaisseau est un point de vue**, distinct de la scène qu'il regarde.
  C'est ce qui permettra de voir un cataclysme depuis une orbite plutôt que
  d'une caméra extérieure.
- **Le contenu est source unique, à trois niveaux, sourcé, bilingue.**

### F1 — La soupe de drapeaux doit devenir un lieu — ✅ **FAIT**

*Ce paragraphe a décrit l'état d'avant la refonte pendant plusieurs jours après
qu'elle a eu lieu, et le 6 août il m'a fait afficher à Hugo une feuille de route
où F1 était en rouge. Le document était périmé, pas le code. Corrigé ici.*

`lieu` est l'unique autorité. `salon.actif` n'est plus une donnée mais un
accesseur dérivé (`Object.defineProperty`). Les transitions sont énumérées à un
seul endroit, `quitteLieu` / `entreLieu`.

> ⚠ **CE PARAGRAPHE A AFFIRMÉ UNE CHOSE FAUSSE PENDANT DES SEMAINES.** Il disait
> « une seule écriture dans tout le fichier ». Il y en avait **deux** : `vaAu`,
> et `majCamera` qui écrivait `lieu = "libre"` quand la sonde suivie
> disparaissait. Trouvé le 8 août 2026 en extrayant le domaine des lieux, dans
> l'endroit même où ce document se félicitait de l'avoir soigné.
>
> **Réparé le même jour, en sortant la caméra dans `camera.js`.** On ne pouvait
> pas y passer par la porte tant que le calcul vivait dedans : `vaAu` appelle
> `majCamera`, donc l'appeler de là aurait fait un cycle. Le module rend
> maintenant `decroche` — il DEMANDE — et la page, qui est en dehors de lui,
> ouvre la porte. Le nœud s'est défait en déplaçant le calcul, pas en ajoutant
> une garde.
>
> Ce qui a changé pour de vrai : le décrochage passe désormais par `quitteLieu`,
> `entreLieu` et `majBarreLieu`, qu'il court-circuitait. Éprouvé en faisant
> s'évaporer la sonde suivie sous la caméra — `lieu`, le bouton et la classe
> `a-bord` suivent tous les trois.

**Gardé** depuis le 6 août par `VERIF.lieux()` : les neuf transitions
ordonnées, six invariants après chacune, et le cas du voyage encore armé après
la sortie du salon rejoué en entier. Un lieu peut désormais **refuser** qu'on y
entre — la précondition vit à côté de l'unique écriture qu'elle protège, ce qui
est ce qui comptera quand la salle de tir ajoutera un quatrième endroit.

### F2 — Le bloc de script unique — 🔨 **en chantier, 4 382 → 3 457**

**4 310 lignes** le 6 août 2026, dans un seul `<script>` en portée globale avec
des `const` non hissés. Le document annonçait 3 500 : il avait pris huit cents
lignes sans que personne le décide. Il est monté à **4 382** avant que le
chantier commence.

Il est mort deux fois parce qu'une variable était employée avant sa ligne — et
le symptôme est muet : le bloc s'arrête, la moitié du site disparaît sans un
message. **Il est mort une troisième fois pendant le chantier**, sur une
propriété abrégée renommée — et cette fois `vivant()` l'a nommé en trente
secondes. C'est la première fois que ce défaut n'a rien coûté.

Il n'a aucun effet visible, donc il ne se ferait jamais « quand on aura le
temps ». D'où `outil-verif-taille.js` : on n'exige pas de découper aujourd'hui,
on exige que **ça ne monte plus**.

#### Où on en est — 9 août 2026

**3 457 lignes**, réparties en cinq blocs au lieu d'un. Vingt et un domaines
sortis en modules éprouvables hors navigateur : la caméra, les lieux, le
registre, la progression, les gestes, la manette, Lumen, le pilotage du recul,
les écrans, le calque, l'habitacle, le cockpit, les libellés, la résolution, le
spectre, le format, le banc, le dossier, les aveux…

Le filet est passé de **13 outils à 32**, et de **93 contrôles de page à 117**.

**Ce que le chantier a trouvé, et qui ne se voyait pas avant :** le clic qui
visait à côté sur téléphone · le ciel du salon penché à la vitesse d'une sonde
quittée · Lumen qui ne se replaçait plus · le carnet de bord qui plantait · la
mémoire qui acceptait des infinis · la question du niveau de lecture qui ne se
posait plus à qui rechargeait tôt · et le second écrivain de `lieu`, qui rendait
faux ce que F1 garantissait.

**Ce qui reste :** l'accueil (écrit et gardé, sa chirurgie tient en treize points
dans le chemin d'entrée et se fait d'un bloc), et l'état partagé — 469
références, la seule étape qu'un `git revert` ne rattrape pas proprement.

**Le plafond a monté quatre fois**, toujours avec sa raison écrite dans l'outil.
Deux fois pour du câblage qu'Hugo avait demandé, une fois pour la réparation du
niveau de lecture, une fois pour fermer F4. Ce qui n'a jamais été fait : tailler
dans les commentaires pour repasser sous la barre.

### F3 — Il manque un intégrateur à N corps — 🛑 **MESURÉ LE 9 AOÛT : ON NE PEUT PAS**

> **Le compagnon newtonien ne se branchera pas. La mesure dit non, et voici
> pourquoi — `outil-verif-compagnon.js`, 66 contrôles.**
>
> Un compagnon mû par `ncorps.js` dérive de **4,71 rayons par tour** par rapport
> à ce que la relativité impose. L'ombre du trou noir en fait 5,10. Le compagnon
> se retrouve donc décalé d'**une largeur d'ombre à chaque tour**.
>
> **Et s'éloigner n'y change rien.** C'est le résultat qui ferme la question :
> la dérive tend vers `3πM`, une CONSTANTE, pendant que l'objet rétrécit. Le
> rapport des deux reste entre 0,92 et 1,05 de l'ISCO à trois mille rayons.
> L'erreur et l'objet maigrissent exactement au même rythme.
>
> Les trois exigences ne se croisent pas — cadrable `r ≤ 37`, regardable
> `r ≤ 321`, d'accord `r ≥ 533`. Un facteur quatorze entre elles.
>
> **La limite de Roche** tombe à 21,9 rayons : cadrable, mais en plein dans la
> zone de désaccord. Et une orbite newtonienne à deux corps est une ellipse
> fermée — elle ne s'approche jamais. Mesuré : le périastre bouge de 2,5·10⁻⁸
> sur deux cents tours. Faire tomber l'étoile demanderait une loi de décroissance
> inventée, ce que la règle 4 interdit.
>
> **`ncorps.js` n'apportait rien ici de toute façon.** La gravitation mutuelle
> d'une étoile autour de Sgr A* vaut 1,2·10⁻⁷ contre 3,8·10⁻² de relativité
> négligée — **330 000 fois plus petite**. On aurait branché un moteur pour un
> effet trois cent mille fois inférieur à l'erreur qu'il introduit.
>
> **Ce qui reste possible, si un compagnon est voulu** : le mouvoir par
> `PHYSIQUE.integre`, comme toute la matière du site. Il n'a alors pas besoin de
> `ncorps.js` — et `ncorps.js` reste une dette à assumer autrement, par un vrai
> système à plusieurs corps ailleurs, ou par son retrait.
>
> **Une correction à l'énoncé, au passage.** Ce document disait « la scène est en
> Kerr ». Elle l'est pour la LUMIÈRE seulement : la matière — sondes, vaisseau —
> passe par `PHYSIQUE.integre`, qui est la géodésique de Schwarzschild sans terme
> de rotation. Le dépôt portait donc déjà deux lois pour un même espace, et ne le
> savait pas. C'est de là que sort la question du cercle de l'ISCO, dans
> `A-REGARDER.md`.

<details><summary>L'état d'avant, gardé pour mémoire</summary>

**écrit, éprouvé, branché à rien**

`ncorps.js`, 1 026 lignes, contrôlé par `outil-verif-ncorps.js` — énergie,
moment cinétique, résonances, limite de Roche. **Absent d'`index.html`.**

C'est la pire forme de dette parce qu'elle ne ressemble pas à une dette : au
tableau ça compte comme un acquis, dans la page ça n'existe pas. `node tout.js`
le signale à chaque exécution, avec `lune.js` (1 103 lignes) et `echelle.js`.

Décision d'Hugo le 6 août : **brancher N corps, laisser la Lune de côté** — le
carnet lui reproche de ne pas être sourçable, et le désaccord n'a jamais été
tranché.

Reste à décider **de quoi il sera l'usage visible**. Charger n'est pas brancher :
un module chargé et inutilisé reste le troisième état. Proposition à faire
juger : un compagnon au trou noir d'étude, qui existe déjà comme objet distinct
et orientable.

</details>

### F4 — La frontière du simulable, à écrire une fois pour toutes — ✅ **FAIT**

`FRONTIERE.md` dit en un seul endroit ce qui est **calculé** (et par quel
outil), ce qui est **approché** (et pourquoi), ce qui est **décor** (et où on le
rencontre). Et ce qui ne se simule pas du tout : on sait faire l'avant et
l'après d'une collision, jamais son instant.

Les neuf compromis assumés portent maintenant un identifiant, un lieu de
rencontre lisible par la machine, et un aveu court destiné à être posé là-bas —
c'est la règle d'Hugo du 5 août, « chaque compromis se déclare là où on le
rencontre ». `contrat.js` refuse un compromis sans lieu, sans aveu, présent dans
une seule langue, dont l'aveu dépasse deux cents signes, ou dont le lieu diffère
entre les langues.

**Reste la forme visuelle de l'aveu**, qui est un choix d'œil et passera par une
séance de jugement.

### F5 — Le filet doit tenir en une commande — ✅ **FAIT**

`node tout.js` joue les dix outils hors navigateur, agrège, sort en 0 ou 1, et
**fabrique tout seul** la liste de ce qui n'est gardé par personne. C'était la
vraie raison de l'écrire : `recul.js` a vécu un mois sans le moindre contrôle,
et rien ne disait qu'il n'en avait pas.

Il déclare aussi franchement les contrôles de `verif.js` qu'il ne joue pas,
faute de navigateur, et donne l'adresse pour les jouer. Un outil qui prétend
couvrir ce qu'il ne couvre pas endort au lieu de garder.

---

## Le prochain, et il est important

### 15 — Deux rendus au choix : simulation ou cinéma

Idée d'Hugo, le 5 août 2026, en découvrant que la nébuleuse du fond est un
décor. Elle règle un problème de fond plutôt qu'un défaut ponctuel.

Le site promet que tout est calculé. C'est vrai de la géométrie, des orbites,
des durées, de la déviation de la lumière — et faux du fond de ciel, de
l'exposition, de l'éclat du disque. Aujourd'hui les deux sont mêlés sans qu'on
puisse les séparer, et c'est ce mélange qui abîme la promesse : le visiteur ne
peut pas savoir ce qu'il regarde.

**Le choix se pose au premier passage, à côté de celui de la langue**, et se
change ensuite dans les réglages. Formulation à tenir : les deux sont exacts
là où ça compte ; l'un ajoute ce qu'un film ajouterait, l'autre s'en prive.

#### Le principe qui commande tout le reste

Précision d'Hugo, et elle est plus exigeante que la note de la rédaction :

> même le mode simulation gardera des compromis — et **chaque compromis doit se
> déclarer là où on le rencontre**, pas seulement dans une liste rangée
> ailleurs.

Un aveu global dans un dossier qu'on ouvre rarement ne vaut pas un aveu au
moment où l'on regarde la chose. Le fond de ciel doit se dénoncer quand on le
fixe ; la gravité du vaisseau, quand on marche dedans ; l'éclat du disque,
quand on le règle.

Ce qui reste à concevoir, c'est la **forme** de cet aveu : assez présente pour
qu'on la voie, assez discrète pour ne pas hacher la contemplation. Une piste :
la même que le bouton « d'où ça sort ? », qui existe déjà et que les gens
comprennent — un signe sobre qu'on peut ignorer, et qui répond si on le presse.

Premier cas déjà traité en attendant : le panneau d'arrivée du télescope
déclare, sur place, que le fond du ciel est un décor.

Ce que chaque mode commanderait :

| | simulation | cinéma |
|---|---|---|
| fond de ciel | champ d'étoiles dense, sans nébuleuse inventée | nébuleuse et bandes colorées |
| exposition | mesurée, sans halo | halo et éclat |
| disque | son éclat réel selon la bande observée | rehaussé pour qu'on le voie |
| étoiles | densité de l'amas nucléaire, ordre de grandeur réel | densité choisie pour la lisibilité |

#### La réponse, le 9 août 2026 — et elle déborde la question

La densité était le seul chiffre du tableau qui demandait une source. Elle est
sourcée : huit références vérifiées une par une, dans `contenu.js`, et une fiche
entière — **« Le ciel de là-bas »**, trois niveaux, deux langues. Le troisième
niveau sépare exprès ce qui est mesuré de ce qu'on a dérivé nous-mêmes, parce
qu'**aucun article ne calcule le ciel vu de l'intérieur**.

Ce que la recherche a répondu ne tient pas dans la case « densité » :

- **six cents millions de fois** la densité du voisinage solaire à 0,01 pc ;
  de l'ordre du million d'étoiles à l'œil nu contre neuf mille chez nous ;
- **il n'y fait jamais nuit** — des dizaines à des centaines de pleines lunes
  de fond intégré. Un fond noir est faux en soi, pas seulement mal peuplé.
  C'est la découverte qui coûtera le plus cher à l'image ;
- **la nébulosité de là-bas existe**, mais elle a une forme : trois bras
  ionisés (la minispirale) et un anneau de poussière opaque qui découperait une
  bande noire. Éteindre notre voile mauve est juste, et insuffisant ;
- **la poussière qui nous cache le centre est de notre côté** : sur place,
  l'extinction mesurée tombe sous un dixième de magnitude. Le ciel du centre de
  la galaxie est limpide, et personne ne l'a jamais vu.

Conséquence pour le module : `rendu.js` ne commande que la nébuleuse, et son
en-tête dit maintenant pourquoi — le reste demande de **peindre un ciel**, pas
de pousser un uniforme. C'est un chantier d'image, à ouvrir avec son œil.

Recouvrement à trancher : le bouton **« Lumière réelle »** existe déjà et fait
une partie du travail. Soit il devient le mode, soit il en devient un cran.

---

## Ensuite

| | chantier | dépend de |
|---|---|---|
| 7 | **Voix anglaise** — 10 Mo à synthétiser | textes anglais relus |
| 8 | **Carnet d'apprentissage** — relevé de ce qui a été lu | — |
| 9 | **Questionnaire diagnostique** — sans note, avec porte de sortie | 8 |
| 10 | **Renvois de lecture par langue** — distincts des sources | 6 |
| 13 | **Le panthéon gravé** — la paroi, Firestore est prêt | mission de chute |
| 14 | **La chute derrière l'horizon** — `CHUTE.md` est écrit | — |

## Plus tard

Hub à plusieurs ponts · deux vaisseaux dont un commun · système solaire planète
par planète · vitre en réalité augmentée · avatars et garde-robe · mesurer
l'expansion au peigne de raies · cours sur les jumeaux au diagramme de
Minkowski · sondes réelles et assistance gravitationnelle · musique · carte des
vaisseaux.

---

## Dettes connues

- ~~**Couture sur l'axe polaire** en rotation~~ — **payée le 6 août 2026.** Le
  moteur de rotation est passé en Kerr-Schild, où l'axe n'est pas singulier.
  Mesuré avant/après sur la même caméra : la discontinuité sur l'axe tombe de
  78-310 niveaux à 2-26, et `VERIF.couture()` la garde. La branche a = 0 n'a pas
  bougé, la table d'or non plus.

  *Cette dette a tenu des semaines parce qu'elle était **déclarée** — sept fois
  dans le contenu, dont le panneau ouvert devant Hugo au moment où il a écrit
  « trace verticale buguée ». Une déclaration qu'il faut lire ne répare pas ce
  qu'on voit. C'est la leçon, et elle vaut plus que la couture.*
- **Écrans du bord en deux dimensions** : pas de perspective vraie, rien ne les
  occulte. La solution est de les passer en géométrie texturée.
- **Cockpit enfermé dans une bande** sur écran large et court.
- **Saut d'image une fois par orbite** : non reproduit, hypothèse de la bascule
  de résolution traitée. Hugo doit presser `C` au moment du saut.
- **Orientation des étoiles S : le signe de la profondeur reste ouvert.**
  Éprouvé numériquement, sans pouvoir trancher. La formule reproduit
  Thiele-Innes tel que Wright & Howard le définissent — convention que Gillessen
  cite —, et dans laquelle le nœud ascendant est le nœud d'approche. Départager
  cette lecture de l'usage des binaires visuelles demande le signe de la vitesse
  radiale de S2 à une date connue, lequel ne figure dans le TEXTE d'aucun
  article consulté : seulement sur une figure. La géométrie impose que les deux
  extrêmes soient dans un rapport de 2,16 — environ 4 050 et 1 880 km/s — mais
  pas lequel précède le périastre. Ce qui est en revanche vérifié et solide :
  les dix étoiles rendent la même masse centrale à 1 % près, le périastre de S2
  tombe à 120,6 UA contre 120 publiées, et S55 est saine.
  **Conséquence pratique** : la vue n'indique aucune direction vers la Terre et
  ne marque aucun côté proche, donc l'ambiguïté n'est pas observable et le site
  n'affirme rien. Ne pas ajouter d'axe « vers la Terre » sans avoir tranché.
- **Le titre de la page** reste français dans les deux langues.
