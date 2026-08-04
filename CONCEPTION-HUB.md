# Le Périastre — conception du hub

*Document de conception du vaisseau habitable. Il décrit un plan, des postes,
des cotes, une lumière et un ordre de construction — pas du code. Le repère
global est celui de `vaisseau.js` : x vers tribord, y vers le haut, z vers
l'arrière ; la baie du salon est en z = −3,25 ; le sol du salon est y = 0 ;
tout est en mètres. Le salon existant n'est pas déplacé : tout le reste se
construit autour de lui.*

---

## 1. Le parti pris

**Le menu du site devient la géographie du vaisseau.** On ne « quitte » plus
le salon par un bouton : on marche jusqu'au télescope et on y colle l'œil.
On ne « ouvre » plus les missions : on se penche sur la table de veille de la
passerelle. Chaque grande fonction du site est un *poste* — un objet qui a
une adresse, une forme qui raconte ce qu'il fait, et qu'on active en
l'approchant. Le corollaire est impitoyable pour le plan : un poste qu'on
met trente secondes à rejoindre est une régression sur un menu. Tout le
vaisseau est donc **compact et vertical**, ramassé autour d'un point
d'arrivée d'où chaque poste se rejoint en moins de dix secondes de marche —
les distances sont chiffrées en §2.4, et elles ont dessiné le plan autant
que l'esthétique.

Le second principe donne son relief à cette géographie : **on descend
toujours vers la lumière.** Le joueur arrive sur la passerelle, dans une
pénombre d'instruments ; devant lui le plancher s'interrompt, et par cette
trouée il voit le salon deux mètres soixante plus bas, la fosse, la baie, et
le disque d'accrétion qui balaie tout de sa lumière orange. La lumière vraie
n'entre que par un seul grand orifice — la baie — et la distance à la baie
mesure le droit de tricher avec le temps : le salon colle à la vitre et le
temps y est réel ; la salle d'immersion, tout à l'arrière et aveugle, est le
seul endroit où l'on accélère le temps et lance des sondes ; la salle des
machines est sous la ligne de flottaison de la lumière, et l'on y descend
vérifier *pourquoi tout le reste est exact*. Le plan n'est pas un décor qui
range des menus : c'est le contrat pédagogique du site, rendu marchable.

---

## 2. Les postes — le menu devenu géographie

### 2.1 La table d'affectation

Un poste par fonction ferait quinze postes, c'est-à-dire un menu déguisé en
mobilier. Le vaisseau en compte **six**, chacun regroupant des fonctions qui
partagent un sens — et le lieu dit lequel.

| poste | lieu | fonctions hébergées | pourquoi elles vont ensemble |
|---|---|---|---|
| **Le Télescope** | la Coupole (pont haut, bâbord) | la vue télescope ; les filtres de longueur d'onde ; le module sur le spectre électromagnétique | tout ce qui *observe le vrai ciel autrement* : on change d'yeux, pas de monde. Le spectre n'est pas une leçon à côté du télescope, c'est le mode d'emploi de ses filtres |
| **La Table de veille** | la Passerelle | missions ; quêtes journalières ; monnaie ; destination courante du vaisseau | tout ce qui *engage l'avenir* : ce qu'on va faire, ce qu'on a gagné, où va le bord. C'est le poste de commande demandé — on y veille, on n'y pilote pas |
| **La Plate-forme d'immersion** | la Salle d'immersion (pont bas, arrière) — et son annexe, la Cabine des jumeaux | le simulateur libre : sondes, rotation du trou noir, angle de vue ; en annexe, le paradoxe des jumeaux | l'aile des *expériences sur le temps* : on y triche (simulateur) ou on y suit un jumeau qui part et revient. Les deux exigent de quitter le temps réel, donc les deux sont loin de la baie |
| **Le Banc d'essai** | la Salle des machines (sous-pont) | la section « pourquoi cette simulation est exacte » ; les quatre tests numériques rejoués en direct | la preuve habite la cale : le moteur du site *est* l'intégrateur, la salle des machines est son atelier de métrologie |
| **La Galerie** | la nacelle tribord (pont haut) | les 9 fiches pédagogiques ; le choix du niveau de lecture (plaque des trois niveaux, à l'entrée) | on règle *comment on lit* à l'endroit où *on lit*. Le niveau choisi s'affiche ensuite sur chaque pupitre |
| **Le Quartier d'équipage** | pont haut, bâbord arrière | la garde-robe de l'avatar (le miroir) ; les réglages : volume, voix, première/troisième personne (le panneau de chevet) | tout ce qui *te* concerne, toi et personne d'autre : ton apparence, tes oreilles, ta caméra. La seule pièce domestique du bord |

La cabine des jumeaux est un lieu à part entière mais pas un septième poste :
c'est l'annexe de l'aile des expériences, porte dans la paroi bâbord de la
salle d'immersion. Thématiquement et physiquement, elle appartient au même
geste — s'éloigner de la baie pour faire des choses au temps.

### 2.2 La grammaire de l'interaction

Comment sait-on qu'un objet s'active, sans tutoriel ? Une seule règle,
apprise en dix secondes parce qu'elle est partout la même : **ce qui respire
s'active.** Chaque poste porte un *liseré d'appel* — une arête émissive
ambre qui pulse lentement (période ~4 s, entre 0,03 et 0,08). Rien d'autre
à bord ne pulse : les bandeaux d'ambiance sont fixes. L'œil humain repère le
mouvement lumineux avant la couleur ; c'est l'affordance la moins bavarde
qui soit. Ensuite, trois cercles concentriques :

1. **À moins de 2,5 m**, le liseré cesse de pulser et monte à 0,2 — l'objet
   « se réveille » — et une inscription émissive apparaît en fondu au sol
   devant lui (Blanc de lecture, 0,1) : son nom, un mot.
2. **Sous le regard** (réticule sur le poste), la plaque de nom passe à 0,3.
3. **Au clic**, activation.

À l'activation, deux régimes — et le choix est tranché par une question :
*la fonction est-elle une vue ?*

- **Postes-consoles** — Table de veille, pupitres de la Galerie, miroir et
  panneau du Quartier, stèles du Banc d'essai, pupitre des jumeaux : l'écran
  s'allume *dans le décor*, la caméra glisse en 0,4 s face à la console, et
  on reste debout dans le vaisseau, libre de s'éloigner pour rompre. Pas de
  plein écran : la continuité du monde est exactement ce que ce hub vend, et
  un menu plein écran la casserait six fois par visite.
- **Postes-immersion** — le Télescope et la Plate-forme : là, la fonction
  *est* une vue, donc le plein écran est légitime et la transition est
  diégétique. Au télescope, un iris octogonal se ferme puis rouvre sur la
  vue instrumentée (on a collé l'œil à l'oculaire) ; sur la plate-forme,
  l'anneau au sol monte en intensité et le fondu se fait par le blanc
  (on plonge). Échap, ou un pas en arrière au télescope : on se redresse,
  le vaisseau est toujours là.

### 2.3 La sortie de secours

Une barre d'accès direct demeure, en bas de l'écran — pour le mobile, pour
l'accessibilité, pour qui ne veut pas marcher. Mais elle ne coexiste pas
avec les lieux : elle **les dessert**. Six entrées, les six postes, mêmes
noms, mêmes silhouettes (l'octogone du télescope, l'anneau de la
plate-forme…). Un clic n'ouvre pas un menu parallèle : il transporte la
caméra au poste et l'active — la barre est un plan du vaisseau, pas un
second système. Au survol, une ligne indique où c'est (« Coupole, pont
haut »), si bien que la barre *enseigne* la géographie au lieu de la rendre
inutile. Seule exception, l'urgence vraie : le volume est aussi une glissière
directement dans la barre, parce que couper le son ne doit jamais demander
un déplacement, même téléporté.

### 2.4 Les distances, chiffrées

Le point d'arrivée est sur la passerelle, au bord de la table de veille
(x ≈ 0 ; z ≈ 5,0 ; y = 3,30) — c'est aussi le point d'où l'on voit presque
tout (§4). À une vitesse de marche de 1,6 m/s :

| poste | trajet | distance | temps |
|---|---|---|---|
| Table de veille | on y est | 1 m | 1 s |
| Balcon (vue du salon) | trois pas vers l'avant | 2 m | 1 s |
| Télescope (Coupole) | porte bâbord de la passerelle | 5 m | 3 s |
| Salon / la baie | balcon, puis échelle de coupée | 7 m | 4 s |
| Galerie (fiches, niveau) | porte arrière, coursive haute, palier | 10 m | 6 s |
| Quartier (garde-robe, réglages) | idem, porte bâbord du palier | 10 m | 6 s |
| Plate-forme d'immersion | coursive haute, escalier, coursive basse | 15 m | 9 s |
| Banc d'essai (machines) | idem jusqu'à la trappe, échelle | 14 m + échelle | 10 s |
| Cabine des jumeaux | traversée de la salle d'immersion | 20 m | 12 s |

Tout tient sous dix secondes sauf les jumeaux — assumé : c'est le poste
qu'on visite une fois pour comprendre, pas dix fois par session. Ce qui
garde les trajets courts sans écraser le vaisseau, c'est la **verticalité** :
les salles sont empilées plutôt qu'alignées, et le point d'arrivée est au
centre de gravité de la pile, pas à une extrémité. La clé de ce compactage
est l'**échelle de coupée** (§3), qui relie directement le balcon au salon :
sans elle, la pièce principale serait à quatorze mètres de l'arrivée par
l'unique escalier — inacceptable pour la salle vedette.

---

## 3. Le plan coté

Deux ponts et un sous-pont. Le pont bas (sols à y = 0, fosse à −0,55) porte
le salon, la coursive, la salle d'immersion et l'annexe des jumeaux. Le pont
haut (sol à y = 3,30, sous plafond 2,60) porte la passerelle, la coupole, le
quartier d'équipage et la galerie. Le sous-pont (sol à y = −3,10) ne porte
que la salle des machines. Le plan est **asymétrique à dessein** : la
circulation longe tribord, les salles se développent à bâbord et vers
l'arrière, la galerie déborde de la coque en nacelle tribord et la coupole
en tourelle bâbord — deux excroissances de formes et de positions
différentes, donc pas de symétrie retrouvée par accident. Un vaisseau où
l'on vit n'est pas un rendu d'architecte.

La verticalité sert quatre fois : la **trouée** (le plafond du salon est
percé sous la passerelle, chaque pont voit l'autre) ; l'**échelle de
coupée**, raide et courte, qui relie le balcon au salon ; l'**escalier à
quart-tournant**, qui fait vivre la montée principale ; et l'**échelle des
machines**, qui fait de la vérification du moteur une descente dans la cale
— on va *au fond des choses*, littéralement.

### Le Salon d'observation *(existant, retouché)*

- **Rôle** : le temps réel, l'orbite vraie, les autres visiteurs, Lumen près
  de la baie. Aucune interface de triche ; le salon est la seule pièce sans
  poste, et c'est un choix : on y est spectateur.
- **Cotes** : 9,0 × 6,5 m, plafond à 3,0 m, fosse à −0,55. x ∈ [−4,5 ; 4,5],
  z ∈ [−3,25 ; 3,25].
- **Retouches** : une porte de 0,95 × 2,05 dans le mur arrière en
  (x = 2,4 ; z = 3,25) vers la coursive ; la **trouée** : plafond percé sur
  x ∈ [−3,2 ; 2,0], z ∈ [1,05 ; 3,05] (5,2 × 2,0 m), chanfreinée, sous le
  garde-corps du balcon ; et l'**échelle de coupée** : un escalier de
  navire à 62°, largeur 0,72 m, deux limons et dix marches-boîtes, plaqué
  contre le bord tribord de la trouée (x ≈ 2,0), du balcon (y = 3,30) au
  sol du salon. Main courante des deux côtés, seuils rayés en haut et en
  bas.
- **Vue** : la totalité de la baie. La seule salle où le trou noir occupe le
  champ.
- **Coût** : ~2 400 triangles (existant + porte + tableau de la trouée +
  échelle de coupée).

### La Passerelle *(pont haut — poste : la Table de veille)*

- **Rôle** : missions, quêtes journalières, monnaie, et la **destination
  courante** du vaisseau (OBJECTIFS.md : la destination est une donnée —
  elle s'affiche ici). Point d'arrivée des visiteurs.
- **Cotes** : 7,1 × 5,0 m, sol y = 3,30, plafond y = 5,90. x ∈ [−4,5 ; 2,6],
  z ∈ [3,05 ; 8,05]. Le bord avant (z = 3,05) est le **balcon** :
  garde-corps au-dessus de la trouée, départ de l'échelle de coupée côté
  tribord.
- **Le poste** : la table de veille, 2,2 × 1,1 × 0,95 m, au centre
  (x ≈ −0,4 ; z ≈ 5,2) — une table à cartes, pas un tableau de bord :
  plateau incliné de 8°, l'orbite courante en hologramme filaire au-dessus
  (des `barre()` fines émissives), le périastre marqué d'un point ambre.
  Trois faces d'écran sur le plateau : missions, quêtes, journal de bord.
  Liseré d'appel sur le chant du plateau. Volontairement pas de siège de
  capitaine — personne ne pilote, on veille.
- **Accès** : porte arrière (z = 8,05, x = 2,0) depuis la coursive haute ;
  porte bâbord (x = −4,5, z ≈ 5,1) vers la coupole ; échelle de coupée vers
  le salon.
- **Vue** : en plongée, à travers la trouée puis la baie : le trou noir bas
  dans le champ, encadré par le salon. Partielle, donc désirable.
- **Coût** : ~3 500 triangles.

### La Coupole *(tourelle bâbord du pont haut — poste : le Télescope)*

- **Rôle** : la vue télescope, les filtres de longueur d'onde, et le module
  sur le spectre électromagnétique — qui cesse d'être une leçon abstraite
  pour devenir *le mode d'emploi de l'instrument* : on comprend le spectre
  parce qu'on tourne ses filtres.
- **Cotes** : tourelle octogonale de 3,4 m entre plats, accolée à la paroi
  bâbord de la passerelle : x ∈ [−7,9 ; −4,5], z ∈ [3,4 ; 6,8], sol
  y = 3,30, plafond en dôme à huit pans culminant à y = 6,20, percé d'une
  fente d'ouverture (0,5 m de large) par laquelle passe le tube.
- **Le poste** : le télescope raconte sa fonction par sa forme — un tube en
  trois tronçons octogonaux emboîtés (Ø 0,55 → 0,40 → 0,30, longueur
  totale 2,6 m), monture en fourche sur un fût central, contrepoids
  sphérique à facettes, et un oculaire à hauteur d'œil où l'on clique. Le
  tube *suit réellement* le trou noir pendant l'orbite (une rotation de
  matrice) : en entrant, on voit l'instrument vivre. Autour du tambour, à
  hauteur de main, le **bandeau spectral** : un anneau émissif gradué du
  rouge « infrarouge » au violet « ultraviolet », interrompu par quatre
  poignées-filtres (radio, IR, visible, X). C'est ici qu'on explique
  pourquoi Sgr A* s'observe en radio et en X.
- **Vue** : pas de baie — la coupole est fermée hors la fente, car son
  spectacle passe par l'instrument. C'est le seul « regard sur le vrai
  ciel » qui soit médiatisé, et c'est le propos.
- **Coût** : ~2 800 triangles (tourelle 1 400, télescope 1 000, bandeau et
  poignées 400).

### La Coursive *(basse et haute) et l'escalier*

- **Rôle** : la colonne vertébrale. Aucun contenu, mais tout le rythme.
- **Coursive basse** : 2,2 m de large, 2,5 m sous plafond, x ∈ [1,3 ; 3,5],
  z ∈ [3,25 ; 10,25]. Dessert le salon, la trappe des machines, et débouche
  sur la salle d'immersion.
- **Escalier** : quart-tournant en x ∈ [1,3 ; 3,5], z ∈ [7,2 ; 10,25].
  Volée basse de 9 marches (0,183 × 0,26), palier intermédiaire à y = 1,65,
  volée haute de 9 marches en retour. Marches-boîtes, nez émissifs.
- **Coursive haute + palier** : mêmes x, z ∈ [8,05 ; 11,9], sol y = 3,30 ;
  le palier s'élargit en x ∈ [−0,6 ; 3,5] sur z ∈ [10,25 ; 11,9] pour
  desservir le quartier d'équipage et la galerie.
- **Vue** : aucune. La coursive est aveugle exprès — l'obscurité entre deux
  éclats donne leur valeur aux salles.
- **Coût** : ~4 200 triangles.

### La Salle d'immersion *(pont bas, arrière — poste : la Plate-forme)*

- **Rôle** : l'entrée du simulateur libre — sondes, rotation du trou noir,
  angle de vue. La salle est une antichambre : on monte sur la plate-forme
  et on plonge (transition vers le rendu plein écran existant).
- **Cotes** : 8,0 × 7,0 m, 3,4 m sous plafond (la plus haute du pont bas).
  x ∈ [−4,0 ; 4,0], z ∈ [10,25 ; 17,25]. Plafond replié en fausse voûte par
  deux rangs de chanfreins.
- **Le poste** : plate-forme octogonale centrale, rayon 1,9 m, surélevée de
  0,18 m, cerclée d'un anneau émissif au sol — la forme dit « on se place
  ici et il se passe quelque chose », grammaire de plongeoir. Deux consoles
  murales côté avant (réglage du spin, catalogue de sondes) ; râtelier
  décoratif de trois sondes (sphère à facettes + tube, ~120 triangles
  pièce) contre tribord.
- **Accès** : plein débouché de la coursive basse (2,2 m).
- **Vue** : **aucune, et c'est le point pédagogique.** On y triche avec le
  temps ; le vrai ciel n'a pas le droit d'y entrer, sinon le contrat
  salon/simulateur s'effondre. Le seul ciel est celui qu'on fabrique.
- **Coût** : ~4 500 triangles.

### La Cabine des jumeaux *(annexe bâbord de la salle d'immersion)*

- **Rôle** : le paradoxe des jumeaux — l'autre expérience sur le temps,
  d'où sa place dans cette aile. Deux couchettes rigoureusement identiques,
  face à face, chacune sous une horloge. **La seule pièce symétrique du
  vaisseau** — parce que le paradoxe naît d'une symétrie apparente — et une
  seule chose y est asymétrique : l'horloge de droite retarde. Le pupitre
  entre les deux (le poste-console) explique pourquoi : qui a accéléré ?
  On y relie l'orbite excentrique du bord : le temps propre du vaisseau
  lui-même dérive, chiffré en direct.
- **Cotes** : 3,4 × 3,1 m, 2,4 m sous plafond. x ∈ [−7,4 ; −4,0],
  z ∈ [11,5 ; 14,6] — un pod hors coque bâbord, pendant basse de la coupole.
  Porte dans la paroi bâbord de la salle d'immersion (x = −4,0 ; z = 13,0).
- **Vue** : aucune. La pièce est un dispositif, pas un belvédère.
- **Coût** : ~1 500 triangles (pod compris).

### La Salle des machines *(sous-pont — poste : le Banc d'essai)*

- **Rôle** : la section « pourquoi cette simulation est exacte ». Le moteur
  du site *est* l'intégrateur : sa salle des machines est un atelier de
  métrologie. Quatre stèles, une par grandeur vérifiée (sphère des photons,
  ombre, déflexion, dernière orbite stable), chacune affichant
  théorie / mesuré / écart, surmontée d'une colonne de verdict verte quand
  le test passe — relancé en direct devant le visiteur, depuis le pupitre
  d'essai au centre.
- **Cotes** : 6,0 × 4,5 m, 2,4 m sous plafond. Sol y = −3,10,
  x ∈ [−3,0 ; 3,0], z ∈ [5,0 ; 9,5].
- **Accès** : trappe dans le sol de la coursive basse en (x = 2,4 ;
  z = 9,5), échelle verticale de 3,1 m (deux montants, neuf barreaux),
  seuil rayé.
- **Vue** : aucune — on est sous la ligne de flottaison de la lumière. La
  salle la plus sombre du bord, et c'est voulu : la confiance se fabrique
  dans le noir, au contact des chiffres.
- **Coût** : ~2 200 triangles.

### Le Quartier d'équipage *(pont haut, bâbord — poste : miroir et chevet)*

- **Rôle** : tout ce qui concerne le joueur lui-même. Le **miroir** —
  panneau émissif blanc chaud devant lequel l'avatar est simplement dessiné
  une seconde fois, inversé en x — ouvre la garde-robe ; c'est ici que
  Lumen remet les tenues (OBJECTIFS.md). Trois mannequins sur podiums
  (pièces de `personnage.js`, figées) présentent les tenues du moment. Le
  **panneau de chevet**, petite console murale près de la couchette, porte
  les réglages : volume, voix, première/troisième personne — des boutons
  physiques à bascule, pas une liste.
- **Cotes** : 3,9 × 3,85 m, 2,4 m sous plafond. x ∈ [−4,5 ; −0,6],
  z ∈ [8,05 ; 11,9]. Porte depuis le palier haut (x = −0,6 ; z = 10,8).
- **Vue** : un unique hublot octogonal à bâbord (x = −4,5). Le trou noir
  n'y passe presque jamais — on s'habille dos au spectacle, et c'est très
  bien : c'est la pièce domestique du bord.
- **Coût** : ~2 200 triangles + 3 mannequins ≈ 2 400 → **~4 600**.

### La Galerie *(nacelle tribord du pont haut — poste : les pupitres)*

- **Rôle** : les 9 fiches, sorties des menus et posées dans l'espace. Neuf
  alcôves le long du bord extérieur, chacune : un pupitre lumineux (la
  fiche), trois voyants empilés — découverte, curieux, astrophysicien —
  allumés selon ce qui a déjà été lu, et un hublot octogonal. À l'entrée,
  la **plaque des trois niveaux** : on y choisit son niveau de lecture par
  défaut, là où on lit, et le choix se reflète aussitôt sur les neuf
  pupitres.
- **Cotes** : nacelle en surplomb hors coque tribord : 2,8 m de large,
  10,9 m de long, 2,6 m sous plafond. x ∈ [3,5 ; 6,3], z ∈ [1,0 ; 11,9],
  sol y = 3,30. Alcôves de 1,1 m au pas de 1,16 m sur le mur x = 6,3.
  Accès depuis le palier haut (z = 10,9), en enfilade.
- **Vue** : les neuf hublots regardent vers +x. Le vaisseau orbite, donc
  **le sujet des fiches passe lui-même devant les hublots une fois par
  orbite** — on lit, et l'objet dont on parle traverse le champ. Le
  meilleur argument de la nacelle.
- **Coût** : ~3 800 triangles (dont ~150 par hublot octogonal).

### Récapitulatif du budget

| élément | triangles |
|---|---|
| Salon (retouché, échelle de coupée comprise) | 2 400 |
| Passerelle + table de veille | 3 500 |
| Coupole + télescope | 2 800 |
| Coursives + escalier | 4 200 |
| Salle d'immersion + plate-forme | 4 500 |
| Cabine des jumeaux (pod) | 1 500 |
| Salle des machines + échelle | 2 200 |
| Quartier d'équipage + mannequins | 4 600 |
| Galerie | 3 800 |
| Portes, bandeaux, rayures, joints, liserés d'appel | 5 000 |
| 4 PNJ (~900 chacun) | 3 600 |
| **Total** | **≈ 38 100** |

Sous les 40 000, avec ~1 900 triangles de réserve. Si la réserve se révèle
trop juste, la première variable d'ajustement est un PNJ de moins, pas un
poste de moins.

---

## 4. La circulation

**On marche partout.** Deux transitions non marchées dans tout le vaisseau,
toutes deux diégétiques : l'iris du télescope et le plongeon de la
plate-forme (§2.2). Ni ascenseur ni téléporteur — sauf celui, assumé et
hors-monde, de la barre d'accès direct.

La circulation forme une **vraie boucle**, grâce aux deux liaisons
verticales : salon → coursive basse → escalier → coursive haute →
passerelle → échelle de coupée → salon. On peut faire le tour du bord sans
repasser deux fois au même endroit, et c'est ce qui fait qu'un plan de ce
gabarit — vingt mètres hors tout — paraît plus grand qu'il n'est. Les autres
salles sont des impasses courtes greffées sur la boucle : on entre dans une
pièce *pour* son poste, on n'y passe pas par hasard.

**Le point d'où l'on voit presque tout** est le **balcon de la passerelle**
(y = 3,30 ; z = 3,05), à deux pas du point d'arrivée. De là : le salon en
contrebas avec ses occupants, la fosse, la baie, le trou noir, Lumen près de
la vitre ; à main gauche, la porte de la coupole et le tube du télescope qui
dépasse ; derrière, la table de veille et son orbite holographique ; par la
porte arrière, la perspective en pointillés de la coursive haute. Cinq
postes sur six se signalent d'ici par leur lumière. La seconde vue mémorable
est l'inverse : depuis la fosse du salon, lever les yeux et voir des
silhouettes accoudées au garde-corps, à contre-jour de leurs consoles — le
vaisseau habité, prouvé d'un coup d'œil.

---

## 5. La lumière, salle par salle

Règle de bord : **une salle = une teinte émissive dominante**, jamais deux à
égalité. Le disque d'accrétion reste la seule lumière *mobile* du vaisseau ;
l'éclairage interne est fixe et provient de surfaces émissives — plus le
liseré d'appel des postes, seule lumière *pulsante* (§2.2). Comme il n'y a
pas d'éclairage global, la direction et l'intensité du disque sont passées
en uniformes au shader de l'habitacle, et un terme de rebond très simple
(une fraction de la lumière du disque appliquée aux surfaces tournées vers
la baie, atténuée avec la profondeur en z) prolonge sa présence à quelques
mètres derrière la vitre. Intensités relatives, le disque au périastre
valant 1,0.

- **Salon** — la salle du disque. Éclairage interne minimal et chaud :
  plinthe ambrée continue (0,08), nez de marche émissifs, deux caissons de
  plafond soulignés d'ambre. Tout est réglé pour que la lumière orange qui
  tourne (0,3 → 1,0 selon l'orbite) reste sans rivale : les ombres portées
  des membrures qui pivotent lentement sur le sol *sont* le spectacle
  secondaire.
- **Passerelle** — pénombre d'instruments. Dominante cyan : table de veille
  et son hologramme (0,25), pupitres muraux (0,2), liseré au pied du
  garde-corps (0,06). Et le meilleur effet du bord, gratuit : au périastre,
  la lumière du disque monte par la trouée et lèche le plafond de la
  passerelle en une tache orange mouvante (~0,3). Le poste de commande
  *respire* au rythme de l'orbite sans une ligne de code dédiée.
- **Coupole** — presque noire au sommet du dôme : la nuit d'un observatoire.
  Deux sources seulement : le bandeau spectral (0,25), qui teinte la pièce
  en dégradé du rouge au violet selon l'endroit où l'on se tient — se
  déplacer autour du tube, c'est se déplacer dans le spectre — et le voyant
  d'oculaire (Blanc de lecture, 0,1). Quand un filtre est saisi, le bandeau
  s'éteint hors de la bande choisie : la pièce entière devient la longueur
  d'onde qu'on regarde.
- **Coursives et escalier** — les vallées sombres du rythme. Aucune lumière
  chaude : des cerceaux cyan très faibles (0,05) au plafond, un par
  membrure, au pas de 1,45 m — la perspective en pointillés dit la
  profondeur. Nez de marche émissifs. En sortir vers n'importe quelle salle
  est une arrivée.
- **Salle d'immersion** — cyan froid, stable, cérémoniel : l'anneau de la
  plate-forme (0,35, la surface émissive la plus intense du bord), consoles
  (0,2), liseré de voûte (0,08). Aucune teinte chaude : l'opposé exact du
  salon. L'alternance chaud-mouvant / froid-stable est le rythme
  fondamental de la circulation.
- **Cabine des jumeaux** — deux plafonniers blancs froids rigoureusement
  identiques (0,12), un par couchette. La symétrie de l'éclairage fait
  partie de l'énoncé du paradoxe ; seuls les chiffres des horloges
  diffèrent.
- **Salle des machines** — la plus sombre (fond à 0,02). Quatre colonnes de
  verdict vertes (0,3) au-dessus des stèles, chiffres émissifs blancs,
  rayures de seuil ambrées (0,1) au pied de l'échelle. Le vert n'existe
  nulle part ailleurs à bord : c'est la couleur de la preuve, et on descend
  la chercher.
- **Quartier d'équipage** — la seule pièce *chaude et vive* : bandeaux
  ambrés hauts et bas (0,2), miroir émissif blanc chaud (0,3), podiums
  soulignés. On doit y voir les couleurs des tenues mieux que partout
  ailleurs — c'est sa fonction. Le contraste avec la coursive est maximal :
  on pousse la porte et il fait *bon*.
- **Galerie** — neuf pupitres blanc-chaud (0,15) en enfilade, leurs voyants
  de niveau (0,1), et rien d'autre : entre deux alcôves, la pénombre. Quand
  l'orbite s'y prête, le disque balaie les hublots et imprime neuf
  octogones orange qui glissent lentement sur le mur intérieur —
  l'événement lumineux de la salle, deux fois par orbite.

Le rythme d'ensemble, en circulant : orange mouvant (salon) → pointillés
sombres (coursive) → cyan stable (immersion) → noir et vert (machines) →
remontée → ambre vif (quartier) → pénombre ponctuée de blanc (galerie) →
spectre en dégradé (coupole) → et retour au balcon, où l'orange mouvant
revient d'en bas. Aucune salle ne ressemble à sa voisine, et la baie reste
l'unique source qui bouge.

---

## 6. La palette

Elle est tirée **des bases polaires** : des boîtes sombres posées dans un
environnement écrasant, signalées d'orange sécurité, éclairées de
l'intérieur par leurs instruments. C'est exactement la situation du
vaisseau, et ça l'arrache au gris-bleu générique : ici les sombres tirent
sur l'aubergine, et les accents sont francs comme de la peinture de
chantier — le côté cartoon assumé — tandis que les émissifs, peu nombreux
et disciplinés, font la lumière moderne.

| nom | RVB (0–1) | usage |
|---|---|---|
| Basalte | 0,085, 0,080, 0,105 | sols (existant : `SOL`) |
| Aubergine de coque | 0,115, 0,108, 0,140 | parois (existant : `PAROI`) |
| Étain | 0,190, 0,175, 0,215 | châssis, cadres, mains courantes, joints (existant : `CADRE`) |
| Orange de chantier | 0,85, 0,44, 0,12 | *peint, non émissif* : portes, rayures, mobilier repère — l'écho des combinaisons |
| Ambre de bord | 0,98, 0,75, 0,42 | *émissif* : plinthes, quartier, nez de marche — et les liserés d'appel des postes, seuls à pulser |
| Cyan d'instrument | 0,36, 0,86, 0,92 | *émissif* : consoles, cerceaux de coursive, anneau de la plate-forme — le froid technique |
| Vert de verdict | 0,45, 0,90, 0,55 | *émissif* : salle des machines uniquement — la couleur de la preuve |
| Rouge de consigne | 0,85, 0,25, 0,18 | *émissif faible* : portes scellées, interdits |
| Blanc de lecture | 0,93, 0,90, 0,85 | *émissif* : pupitres, miroir, chiffres, inscriptions au sol |

Discipline d'usage : les trois sombres partout ; un seul accent peint
(l'orange de chantier) ; par salle, une seule dominante émissive. Le vert et
le rouge sont des couleurs *rares* — leur rareté leur donne un sens. Et une
règle de mouvement plutôt que de teinte : rien ne pulse, sauf l'appel des
postes.

---

## 7. Le vocabulaire de formes

Tout repose sur les quatre primitives déjà en place — `quad`, `boite`,
`barre`, sphère à facettes — et sur des motifs répétés au millimètre près.
C'est la répétition disciplinée qui fait qu'un décor procédural a l'air
conçu.

1. **Le module de 1,45 m.** Le pas des membrures existantes devient la maille
   du vaisseau entier : membrures, joints de panneaux, cerceaux lumineux et
   alcôves s'y accrochent (les alcôves de la galerie au demi-pas). Une porte
   se centre toujours entre deux membrures, jamais sur l'une d'elles.
2. **La membrure.** Boîte de section 0,12 × 0,22 plaquée contre paroi et
   plafond, teinte Étain, une par module. Dans les salles hautes (passerelle,
   immersion), elle se prolonge au plafond en arceau à trois segments (deux
   boîtes inclinées à 45° + une horizontale).
3. **Le chanfrein de 12 cm.** Toute ouverture — porte, trouée, hublot,
   trappe, fente de coupole — est bordée d'un pan coupé à 45° de 12 cm,
   teinte Étain : un quad par arête. C'est le motif qui distingue « percé
   dans une coque épaisse » de « découpé dans du carton », déjà prouvé par
   le tableau de la baie.
4. **Le hublot octogonal.** Le cercle est hors budget ; l'octogone est le
   cercle du bord — et il revient partout : hublots, plate-forme, coupole,
   iris du télescope, silhouettes de la barre d'accès. Ouverture octogonale
   inscrite dans un carré de 0,70 m, cadre Étain de 0,10 m de large et
   0,18 m de profondeur, chanfreiné. Le « verre » est l'absence de
   géométrie — la passe de géodésiques fait le reste. ~150 triangles pièce.
5. **Le bandeau lumineux.** Boîte émissive de 6 cm de haut, 2 cm de saillie,
   en plinthe (y = 0,12) ou en linteau (y = 2,10), qui s'arrête toujours à
   20 cm d'un angle : une lumière qui tourne le coin a l'air d'un néon
   collé, une lumière qui s'interrompt a l'air encastrée.
6. **Le liseré d'appel.** La signature des postes : une arête émissive
   Ambre de bord de 2 cm de section courant sur le chant de l'objet
   activable (plateau de table, cadre de miroir, cerclage d'oculaire), qui
   pulse entre 0,03 et 0,08 sur ~4 s tant qu'on est loin, se fixe à 0,2 en
   deçà de 2,5 m. Un seul par poste ; jamais sur du mobilier inerte.
7. **L'inscription au sol.** Plaque émissive Blanc de lecture, 0,9 × 0,25 m,
   affleurante devant chaque poste, apparaissant en fondu à l'approche : le
   nom du poste, un mot, en capitales. C'est la signalétique entière du
   bord — pas de panneaux muraux.
8. **La rayure d'avertissement.** Alternance de boîtes plates inclinées à
   45°, 12 cm de pas, Orange de chantier / Basalte, non émissive. Sur les
   nez de la fosse, les seuils de trappe et d'échelles, les portes scellées.
9. **La porte.** 0,95 × 2,05, vantail Orange de chantier, encadrement Étain
   de 14 cm chanfreiné, plaque émissive Blanc de lecture (0,50 × 0,12)
   au-dessus portant le nom de la salle. Le vantail coulisse dans la cloison
   (une translation en x local — seule pièce animée du décor avec le tube du
   télescope).
10. **La porte scellée.** Le même cadre, vantail Basalte barré de deux
    rayures d'avertissement croisées et d'un voyant Rouge de consigne.
    C'est le motif qui rend le chantier diégétique : une salle pas encore
    construite est une salle *scellée*, pas un mur nu.
11. **Le joint de panneau.** Baguette Étain de 2 cm × 1,5 cm de saillie,
    quadrillant les grandes parois au pas du module et à mi-hauteur. Trois
    quads suffisent (dessus + deux flancs) : c'est lui qui casse les aplats
    sans coûter.
12. **L'ombre d'angle peinte.** Pas un objet : une règle de teinte. Les
    sommets à moins de 25 cm d'un angle rentrant voient leur teinte
    assombrie de 30 % à la construction — une occlusion ambiante de pauvre,
    calculée, gratuite au rendu, qui « assoit » chaque pièce au sol.

---

## 8. Ce que j'écarte, et pourquoi

**Un poste par fonction.** Quinze objets cliquables dispersés dans huit
salles, c'est un menu déguisé en mobilier — pire qu'un menu, puisqu'il faut
marcher. Le regroupement en six postes thématiques (§2.1) est la vraie
traduction de « les options sont des lieux » : un lieu a un sens, une entrée
de menu n'en a pas besoin.

**L'ascenseur.** Il promet du vaisseau et livre une boîte noire : un temps
d'attente, une coupure de la continuité spatiale, de l'animation à
maintenir. L'escalier et l'échelle de coupée coûtent ensemble ~1 800
triangles et fabriquent, à leurs extrémités, les deux meilleures vues du
site. Un ascenseur n'a droit de cité que le jour où il y aura cinq ponts —
il n'y en aura pas cinq.

**La symétrie du plan.** Un vaisseau symétrique se lit d'un coup d'œil et
s'oublie aussi vite ; surtout, on s'y perd — deux couloirs identiques sont
indiscernables. Ici la circulation longe tribord, la galerie déborde en
nacelle tribord, la coupole en tourelle bâbord : chaque direction a une
signature, et retrouver un poste, c'est se souvenir d'un lieu. La seule
symétrie du bord est dans la cabine des jumeaux, où elle est *l'énoncé du
problème*.

**Une baie dans la salle d'immersion.** L'idée la plus tentante — « la
grande salle du fond mérite la grande vue » — et la plus fausse. Le contrat
du site (OBJECTIFS.md) repose sur salon = temps réel / simulateur = bac à
sable. Une fenêtre honnête dans la salle où l'on accélère le temps
montrerait deux ciels contradictoires dans le même champ. La salle
d'immersion est aveugle par principe, pas par économie.

**Le hangar à sondes praticable.** Un sas, des portes de soute, une sonde
grandeur nature qu'on regarde partir : très séduisant, et prématuré. C'est
3 000 triangles, de l'animation, et un doublon — le lancement de sondes
existe déjà dans le simulateur, là où l'on peut tricher avec le temps pour
le voir aboutir. Le râtelier de la salle d'immersion garde l'imaginaire ;
le hangar attendra d'avoir une fonction propre.

**La coque courbe.** Coursives cylindriques, baie bombée : le cliché du
genre, cher en facettes pour rester lisse, et dissolvant pour le vocabulaire
orthogonal-chanfreiné qui fait l'identité du bord. La courbure est réservée
aux sphères à facettes *assumées* (têtes, sondes, contrepoids) — partout
ailleurs, l'angle et le pan coupé. La coupole elle-même est un octogone,
pas un dôme lisse.

**Sur les contraintes elles-mêmes**, deux remarques plutôt qu'une objection.
La contrainte n° 2 (le disque comme lumière principale) exige, pour les
salles profondes, un terme de rebond simulé — direction et intensité du
disque passées en uniformes, appliquées en dégradé aux surfaces tournées
vers la baie ; sans lui, le « rebond » s'arrête net au plan de la vitre et
l'œil le remarque. Et le budget de 40 000 triangles est en réalité
confortable : sur ce type de scène, le coût vrai est le nombre d'appels de
dessin et le remplissage, pas les sommets. D'où une règle de construction :
tout le décor statique dans **un seul VAO**, un seul appel — seuls les
personnages, les vantaux, le tube du télescope et les chiffres vivent à
part.

---

## 9. L'ordre de construction

Le principe : après chaque étape, le vaisseau est *fini quelque part* et
*scellé ailleurs* — jamais en chantier apparent. Chaque porte qui ne mène
encore nulle part est posée en version scellée (motif n° 10) dès l'étape 1 :
le plan complet est visible et prometteur dès le premier jour. Et la barre
d'accès direct suit le chantier : une entrée par poste livré, si bien que la
barre dit aussi l'avancement.

1. **La trouée et la boucle.** Percer le plafond du salon, poser passerelle
   nue + garde-corps, échelle de coupée, coursive basse, escalier, coursive
   haute, et toutes les portes scellées. À la fin de cette étape le vaisseau
   a un étage, la boucle se marche dans les deux sens, le balcon existe —
   l'essentiel de l'effet « vrai vaisseau » est acquis pour ~10 000
   triangles. Déplacer le point d'apparition sur la passerelle.
2. **La grammaire des postes + la table de veille.** Implémenter une fois le
   trio liseré d'appel / inscription au sol / caméra de console, puis le
   premier poste complet : missions, quêtes, destination. La gamification a
   une adresse, et tous les postes suivants héritent de la grammaire.
3. **La coupole et le télescope.** Le poste emblème — c'est lui que le
   propriétaire a nommé — et l'absorption du module spectre par les
   filtres. Gros gain de caractère pour 2 800 triangles.
4. **La salle d'immersion.** L'entrée du simulateur déménage des menus vers
   la plate-forme. Le plus gros gain d'usage : les deux moitiés du site —
   l'honnête et le bac à sable — sont désormais deux *lieux*.
5. **Le quartier d'équipage.** Miroir, mannequins, panneau de chevet. La
   boucle de progression (comprendre → gagner → s'habiller) devient
   marchable, et les réglages quittent le dernier menu.
6. **La galerie.** Les neuf fiches quittent les menus pour les alcôves ; la
   plaque des trois niveaux reprend le choix du niveau de lecture.
7. **Les machines.** Trappe, échelle, stèles, verdicts verts. Le banc
   d'essai devient une descente.
8. **La cabine des jumeaux.** Le dernier pod, la dernière porte descellée.
9. **La passe d'ambiance**, en continu à partir de l'étape 2 : bandeaux,
   joints, rayures, ombre d'angle, rebond du disque, PNJ. Une demi-journée
   par salle, au fil de l'eau, jamais « à la fin ».
