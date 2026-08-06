# Ce qui reste à faire, dans l'ordre

Liste courte et ordonnée. Le détail de chaque point est dans `IDEES.md`, qui
sert d'archive ; ce fichier-ci sert à savoir quoi prendre ensuite.

Mis à jour le 6 août 2026, après la passe sur les fondations.

**État en une ligne :** F1 fait et gardé · F2 sous cliquet · **F3 ouvert, et
c'est le seul** · F4 fait · F5 fait. Les fonctionnalités attendent F3.

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

`lieu` est l'unique autorité, avec **une seule écriture dans tout le fichier**
(`vaAu`, index.html). `salon.actif` n'est plus une donnée mais un accesseur
dérivé (`Object.defineProperty`). Les transitions sont énumérées à un seul
endroit, `quitteLieu` / `entreLieu`.

**Gardé** depuis le 6 août par `VERIF.lieux()` : les neuf transitions
ordonnées, six invariants après chacune, et le cas du voyage encore armé après
la sortie du salon rejoué en entier. Un lieu peut désormais **refuser** qu'on y
entre — la précondition vit à côté de l'unique écriture qu'elle protège, ce qui
est ce qui comptera quand la salle de tir ajoutera un quatrième endroit.

### F2 — Le bloc de script unique est la vraie limite — 🔒 **sous cliquet**

**4 310 lignes** le 6 août 2026, mesurées, dans un seul `<script>` en portée
globale avec des `const` non hissés. Le document annonçait 3 500 : il a pris
huit cents lignes sans que personne le décide.

Il est mort deux fois parce qu'une variable était employée avant sa ligne — et
le symptôme est muet : le bloc s'arrête, la moitié du site disparaît sans un
message.

Il n'a aucun effet visible, donc il ne se fera jamais « quand on aura le
temps ». D'où `outil-verif-taille.js` : on n'exige pas de découper aujourd'hui,
on exige que **ça ne monte plus**, et le plafond descend tout seul dès que ça
descend. Il a refusé sa première ligne le jour même de son écriture.

### F3 — Il manque un intégrateur à N corps — ⚠️ **écrit, éprouvé, branché à rien**

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

À vérifier avant de coder : la densité réelle du champ d'étoiles vu depuis
l'orbite du salon, qui est à l'intérieur de l'amas nucléaire. C'est le seul
chiffre du tableau qui demande une source, et il décide de tout le mode
simulation.

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

- **Couture sur l'axe polaire** en rotation : coordonnées de Boyer-Lindquist
  singulières. Corriger demande de réécrire en Kerr-Schild.
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
