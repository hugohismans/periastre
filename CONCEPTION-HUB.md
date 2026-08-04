# Le Périastre — conception du hub

*Document de conception du vaisseau habitable. Il décrit un plan, des cotes,
une lumière et un ordre de construction — pas du code. Le repère global est
celui de `vaisseau.js` : x vers tribord, y vers le haut, z vers l'arrière ;
la baie du salon est en z = −3,25 ; le sol du salon est y = 0 ; tout est en
mètres. Le salon existant n'est pas déplacé : tout le reste se construit
autour de lui.*

---

## 1. Le parti pris

**On descend toujours vers la lumière.** Le joueur arrive désormais en haut,
sur la passerelle, dans une pénombre d'instruments ; devant lui, le plancher
s'interrompt, et par cette trouée il voit le salon deux mètres soixante plus
bas, la fosse, la baie, et le disque d'accrétion qui balaie tout ça de sa
lumière orange. La première impression doit être celle-là : *je suis dans un
vaisseau qui a un intérieur, et cet intérieur est organisé autour d'une chose
qui brille en contrebas.* Tout le plan découle de cette phrase. La lumière
vraie — celle du disque — n'entre que par un seul grand orifice, la baie du
salon ; plus on s'enfonce dans la coque, plus on s'en éloigne, et plus les
salles s'éclairent elles-mêmes. Revenir au salon est donc toujours un
événement lumineux, jamais une formalité.

Le second principe est un contrat : **la distance à la baie mesure le droit
de tricher avec le temps.** Le salon colle à la vitre et le temps y est réel,
non négociable. La passerelle surplombe la baie et on y *planifie* — missions,
quêtes, destination. La salle d'immersion, tout à l'arrière, n'a aucune vue
sur l'extérieur : c'est là qu'on accélère le temps, qu'on lance des sondes,
qu'on monte le spin — et c'est précisément parce qu'on n'y voit pas le vrai
ciel qu'on a le droit de le faire. La salle des machines, enfin, est sous la
ligne de flottaison de la lumière : on y descend par une échelle pour aller
voir *pourquoi tout le reste est exact*. Le plan n'est pas un décor qui range
des menus ; c'est le contrat pédagogique du site, rendu marchable.

---

## 2. Le plan coté

Deux ponts et un sous-pont. Le pont bas (sols à y = 0, fosse à −0,55) porte le
salon, la coursive, le Prisme et la salle d'immersion. Le pont haut (sol à
y = 3,30, sous plafond 2,60) porte la passerelle, le vestiaire, la galerie et
la cabine des jumeaux. Le sous-pont (sol à y = −3,10) ne porte que la salle
des machines. Le plan est **asymétrique à dessein** : la circulation longe
tribord (x > 0), les salles se développent à bâbord et vers l'arrière, et la
galerie déborde de la coque en nacelle à tribord. Un vaisseau où l'on vit
n'est pas un rendu d'architecte.

La verticalité sert trois fois : la **trouée** (le plafond du salon est percé
sous la passerelle, donc chaque pont voit l'autre) ; l'**escalier à
quart-tournant**, qui fait vivre la montée au lieu de la téléporter ; et
l'**échelle des machines**, qui fait de la vérification du moteur une
descente dans la cale — on va *au fond des choses*, littéralement.

### Le Salon d'observation *(existant, retouché)*

- **Rôle** : le temps réel, l'orbite vraie, les autres visiteurs, Lumen près
  de la baie. Aucune interface de triche.
- **Cotes** : 9,0 × 6,5 m, plafond à 3,0 m, fosse à −0,55. x ∈ [−4,5 ; 4,5],
  z ∈ [−3,25 ; 3,25].
- **Retouches** : une porte de 0,95 × 2,05 dans le mur arrière en
  (x = 2,4 ; z = 3,25) vers la coursive ; et la **trouée** : le plafond est
  percé sur x ∈ [−3,2 ; 2,0], z ∈ [1,05 ; 3,05] (5,2 × 2,0 m), bordée d'un
  chanfrein et surplombée par le garde-corps de la passerelle.
- **Vue** : la totalité de la baie. C'est la seule salle où le trou noir
  occupe le champ.
- **Coût** : ~2 000 triangles (existant + porte + tableau de la trouée).

### La Passerelle *(pont haut — le poste de commande)*

- **Rôle** : le système de missions, les quêtes journalières, la monnaie, et
  la **destination courante** du vaisseau (OBJECTIFS.md : la destination est
  une donnée — elle s'affiche ici, sur la table centrale). C'est le point
  d'arrivée des nouveaux visiteurs.
- **Cotes** : 7,1 × 5,0 m, sol y = 3,30, plafond y = 5,90. x ∈ [−4,5 ; 2,6],
  z ∈ [3,05 ; 8,05]. Son bord avant (z = 3,05) est le **balcon** : un
  garde-corps au-dessus de la trouée du salon.
- **Accès** : par le balcon on ne fait que regarder ; on entre par la porte
  arrière (z = 8,05, x = 2,0) depuis la coursive haute.
- **Mobilier** : une table de veille centrale (2,2 × 1,1 × 0,95 m) portant
  l'orbite courante en hologramme filaire (des `barre()` fines émissives) ;
  trois pupitres inclinés contre le mur bâbord (missions, quêtes, journal de
  bord) ; volontairement pas de « siège de capitaine » — personne ne pilote,
  on veille.
- **Vue** : en plongée, à travers la trouée puis la baie : le trou noir bas
  dans le champ, encadré par le salon. Vue partielle, donc désirable.
- **Coût** : ~3 500 triangles.

### La Coursive *(basse et haute) et l'escalier*

- **Rôle** : la colonne vertébrale. Aucun contenu, mais tout le rythme.
- **Coursive basse** : 2,2 m de large, 2,5 m sous plafond, x ∈ [1,3 ; 3,5],
  z ∈ [3,25 ; 10,25]. Elle dessert le salon, le Prisme, la trappe des
  machines, et débouche sur la salle d'immersion.
- **Escalier** : quart-tournant logé en x ∈ [1,3 ; 3,5], z ∈ [7,2 ; 10,25].
  Volée basse de 9 marches (0,183 × 0,26) le long de tribord, palier
  intermédiaire à y = 1,65, volée haute de 9 marches en retour. Marches =
  boîtes, nez émissifs.
- **Coursive haute + palier** : mêmes x, z ∈ [8,05 ; 11,9], sol y = 3,30 ;
  le palier s'élargit en x ∈ [−0,6 ; 3,5] sur z ∈ [10,25 ; 11,9] pour
  desservir vestiaire, galerie et cabine des jumeaux.
- **Vue** : aucune. La coursive est aveugle exprès — c'est l'obscurité entre
  deux éclats qui donne leur valeur aux salles.
- **Coût** : ~4 200 triangles (coursives 2 800 + escalier 1 400).

### La Salle d'immersion *(pont bas, arrière — le simulateur)*

- **Rôle** : l'entrée du simulateur actuel — sondes, spin, temps accéléré.
  La salle est une antichambre : on s'avance sur la plate-forme centrale et
  on « plonge » (transition vers le rendu plein écran existant).
- **Cotes** : 8,0 × 7,0 m, 3,4 m sous plafond (la plus haute du pont bas —
  on sent qu'on entre dans le grand volume). x ∈ [−4,0 ; 4,0],
  z ∈ [10,25 ; 17,25]. Plafond replié en fausse voûte par deux rangs de
  chanfreins.
- **Accès** : plein débouché de la coursive basse (ouverture de 2,2 m).
- **Vue** : **aucune, et c'est le point pédagogique.** On y triche avec le
  temps ; le vrai ciel n'a pas le droit d'y entrer, sinon le contrat
  salon/simulateur s'effondre. Le seul « ciel » est celui qu'on fabrique.
- **Mobilier** : plate-forme octogonale centrale (rayon 1,9 m, surélevée de
  0,18 m) cerclée d'un anneau émissif au sol ; deux consoles de réglage
  (spin, sondes) sur le mur avant ; râtelier décoratif de trois sondes
  (sphère à facettes + tube, ~120 triangles pièce) contre bâbord.
- **Coût** : ~4 500 triangles.

### La Salle des machines *(sous-pont — le banc d'essai)*

- **Rôle** : la section « pourquoi cette simulation est exacte ». Le moteur
  du site *est* l'intégrateur : la salle des machines est donc le banc
  d'essai numérique. Quatre stèles, une par grandeur vérifiée (sphère des
  photons, ombre, déflexion, dernière orbite stable), chacune affichant
  théorie / mesuré / écart, et une colonne de verdict vert quand le test
  passe — relancé en direct devant le visiteur.
- **Cotes** : 6,0 × 4,5 m, 2,4 m sous plafond. Sol y = −3,10,
  x ∈ [−3,0 ; 3,0], z ∈ [5,0 ; 9,5].
- **Accès** : trappe dans le sol de la coursive basse en (x = 2,4 ; z = 9,5),
  échelle verticale de 3,1 m (deux montants + neuf barreaux), seuil rayé.
- **Vue** : aucune — on est sous la ligne de flottaison de la lumière. C'est
  la salle la plus sombre du vaisseau, et c'est voulu : la confiance se
  fabrique dans le noir, au contact des chiffres.
- **Coût** : ~2 200 triangles.

### Le Prisme *(pont bas, bâbord — le spectre électromagnétique)*

- **Rôle** : le module sur le spectre. Ici, la leçon *est* l'éclairage : un
  bandeau émissif court sur toute la longueur du mur du fond, gradué du
  « rouge infrarouge » au « violet ultraviolet », et des pupitres marquent
  radio, visible, X. On explique pourquoi Sgr A* s'observe en radio et en X
  — dans une pièce dont la couleur est le sujet.
- **Cotes** : 5,6 × 3,6 m, 2,5 m sous plafond. x ∈ [−4,5 ; 1,1],
  z ∈ [4,2 ; 7,8].
- **Accès** : porte sur la coursive basse (x = 1,1 ; z = 6,0).
- **Vue** : aucune — la pièce a besoin d'une obscurité contrôlée pour que sa
  propre lumière se lise. Une fenêtre la ruinerait.
- **Coût** : ~1 800 triangles.

### Le Vestiaire *(pont haut, bâbord — tenues, monnaie, Lumen boutiquier)*

- **Rôle** : l'avatar, les tenues à débloquer, la dépense de la monnaie.
  C'est ici que Lumen « remet les tenues » (OBJECTIFS.md). Trois mannequins
  sur podiums (réutilisation directe des pièces de `personnage.js`, figées)
  présentent les tenues du moment ; un « miroir » — panneau émissif blanc
  chaud devant lequel le rendu de l'avatar est simplement dessiné une
  seconde fois, inversé en x.
- **Cotes** : 3,9 × 3,85 m, 2,4 m sous plafond. x ∈ [−4,5 ; −0,6],
  z ∈ [8,05 ; 11,9].
- **Accès** : porte depuis le palier haut (x = −0,6 ; z = 10,8).
- **Vue** : un unique hublot octogonal à bâbord (x = −4,5). Le vaisseau
  orbite ; le trou noir n'y passe presque jamais — on s'habille dos au
  spectacle, et c'est très bien : le vestiaire est la seule pièce
  « domestique » du bord.
- **Coût** : ~2 200 triangles + 3 mannequins ≈ 2 400 → **~4 600**.

### La Galerie *(pont haut, tribord — les neuf fiches)*

- **Rôle** : les 9 fiches, sorties des menus et posées dans l'espace. Neuf
  alcôves le long du bord extérieur, chacune : un pupitre lumineux (la
  fiche), trois voyants empilés — découverte, curieux, astrophysicien —
  qui s'allument selon le niveau déjà lu, et un hublot octogonal.
- **Cotes** : nacelle en surplomb hors de la coque tribord : 2,8 m de large,
  10,9 m de long, 2,6 m sous plafond. x ∈ [3,5 ; 6,3], z ∈ [1,0 ; 11,9],
  sol y = 3,30. Alcôves de 1,1 m au pas de 1,16 m sur le mur x = 6,3.
- **Accès** : depuis le palier haut (z = 10,9), en enfilade.
- **Vue** : les neuf hublots regardent vers +x. Le vaisseau tourne autour du
  trou noir, donc **le sujet des fiches passe lui-même devant les hublots
  une fois par orbite** — on lit, et l'objet dont on parle traverse le
  champ. C'est le meilleur argument de la nacelle.
- **Coût** : ~3 800 triangles (dont ~150 par hublot octogonal).

### La Cabine des jumeaux *(pont haut, arrière)*

- **Rôle** : le paradoxe des jumeaux. Deux couchettes rigoureusement
  identiques, face à face, chacune sous une horloge. C'est **la seule pièce
  symétrique du vaisseau** — parce que le paradoxe naît d'une symétrie
  apparente — et une seule chose y est asymétrique : l'horloge de droite
  retarde, et le pupitre entre les deux explique pourquoi (qui a accéléré ?).
  On y relie l'orbite excentrique du bord : le temps propre du vaisseau
  lui-même dérive, chiffré en direct.
- **Cotes** : 3,5 × 3,1 m, 2,4 m sous plafond. x ∈ [−0,6 ; 2,9],
  z ∈ [11,9 ; 15,0].
- **Accès** : porte au fond du palier haut (z = 11,9).
- **Vue** : aucune. La pièce est un dispositif, pas un belvédère.
- **Coût** : ~1 300 triangles.

### Récapitulatif du budget

| salle | triangles |
|---|---|
| Salon (retouché) | 2 000 |
| Passerelle | 3 500 |
| Coursives + escalier | 4 200 |
| Salle d'immersion | 4 500 |
| Salle des machines + échelle | 2 200 |
| Prisme | 1 800 |
| Vestiaire + mannequins | 4 600 |
| Galerie | 3 800 |
| Cabine des jumeaux | 1 300 |
| Portes, bandeaux, rayures, joints | 5 000 |
| 4 PNJ (~900 chacun) | 3 600 |
| **Total** | **≈ 36 500** |

Sous les 40 000, avec ~3 500 triangles de réserve pour les repentirs.

---

## 3. La circulation

**On marche partout.** Une seule transition non marchée dans tout le
vaisseau : le plongeon depuis la plate-forme de la salle d'immersion vers le
simulateur plein écran — et elle est diégétique, c'est une immersion, pas un
menu. Ni ascenseur, ni téléporteur : l'escalier et l'échelle sont courts,
et c'est en les parcourant que le vaisseau acquiert une taille dans la tête
du joueur.

La boucle principale se lit en une phrase : *salon → coursive basse →
escalier → coursive haute → passerelle → balcon → (on redescend du regard
vers le salon)*. Elle se referme visuellement par la trouée : arrivé au
balcon, on voit l'endroit d'où l'on est parti. Les autres salles sont des
impasses courtes greffées sur cette boucle — une impasse courte est une
qualité : on entre dans une pièce *pour* elle, on n'y passe pas par hasard.

**Le point d'où l'on voit presque tout** est le **balcon de la passerelle**
(y = 3,30 ; z = 3,05, au bord de la trouée). De là : le salon en contrebas
avec ses occupants, la fosse, la baie, le trou noir, Lumen qui flotte près
de la vitre ; derrière soi, la table de veille et sa destination ; par la
porte arrière, la perspective de la coursive haute. C'est le plan d'affiche
du site, et c'est le point d'apparition des nouveaux arrivants. La deuxième
vue mémorable est son inverse : depuis la fosse du salon, lever les yeux et
voir des silhouettes accoudées au garde-corps, à contre-jour de leurs
consoles — le vaisseau habité, prouvé d'un coup d'œil.

---

## 4. La lumière, salle par salle

Règle de bord : **une salle = une teinte émissive dominante**, jamais deux à
égalité. Le disque d'accrétion reste la seule lumière *mobile* du vaisseau ;
tout l'éclairage interne est fixe et provient de surfaces émissives. Comme
il n'y a pas d'éclairage global, la direction et l'intensité du disque sont
passées en uniformes au shader de l'habitacle, et un terme de « rebond »
très simple (une fraction de la lumière du disque, appliquée aux surfaces
tournées vers la baie, atténuée avec la profondeur en z) prolonge sa
présence à quelques mètres derrière la vitre. Les intensités ci-dessous sont
relatives, le disque au périastre valant 1,0.

- **Salon** — la salle du disque. Éclairage interne minimal et chaud :
  plinthe ambrée continue (0,08), nez de marche émissifs, deux caissons du
  plafond soulignés d'ambre. Tout est réglé pour que la lumière orange qui
  tourne (0,3 → 1,0 selon l'orbite) reste sans rivale : les ombres portées
  des membrures qui pivotent lentement sur le sol *sont* le spectacle
  secondaire.
- **Passerelle** — pénombre d'instruments. Dominante cyan : pupitres (0,25),
  hologramme de la table (0,2), liseré au pied du garde-corps (0,06). Et le
  meilleur effet du vaisseau, gratuit : au périastre, la lumière du disque
  monte par la trouée et vient lécher le plafond de la passerelle en une
  tache orange mouvante (~0,3). Le poste de commande *respire* au rythme de
  l'orbite sans une ligne de code dédiée.
- **Coursives et escalier** — les vallées sombres du rythme. Aucune lumière
  chaude : des cerceaux cyan très faibles (0,05) au plafond, un par
  membrure, au pas de 1,45 m — la perspective en pointillés dit la
  profondeur. Nez de marche émissifs dans l'escalier. En sortir vers
  n'importe quelle salle est une arrivée.
- **Salle d'immersion** — cyan froid, stable, cérémoniel : l'anneau au sol
  autour de la plate-forme (0,35, la surface émissive la plus intense du
  bord), consoles (0,2), liseré de voûte (0,08). Aucune teinte chaude :
  l'opposé exact du salon. L'alternance chaud-mouvant / froid-stable est le
  rythme fondamental de la circulation.
- **Salle des machines** — la plus sombre (fond à 0,02). Quatre colonnes de
  verdict vertes (0,3) au-dessus des stèles, chiffres émissifs blancs,
  rayures de seuil ambrées (0,1) au pied de l'échelle. Le vert n'existe
  nulle part ailleurs à bord : c'est la couleur de la preuve, et on descend
  la chercher.
- **Le Prisme** — la pièce dont la lumière est le contenu : le bandeau
  spectral (0,3) est quasiment la seule source, et il teinte tout — sol,
  visages, combinaisons — en dégradé du rouge au violet selon l'endroit où
  l'on se tient. Se déplacer dans la pièce, c'est se déplacer dans le
  spectre.
- **Vestiaire** — la seule pièce *chaude et vive* : bandeaux ambrés hauts et
  bas (0,2), miroir émissif blanc chaud (0,3), podiums soulignés. On doit y
  voir les couleurs des tenues mieux que partout ailleurs — c'est sa
  fonction. Le contraste avec la coursive est maximal : on pousse la porte
  et il fait *bon*.
- **Galerie** — neuf pupitres blanc-chaud (0,15) en enfilade, leurs voyants
  de niveau (trois points, 0,1), et rien d'autre : entre deux alcôves, la
  pénombre. Quand l'orbite s'y prête, le disque balaie les hublots et
  imprime neuf octogones orange qui glissent lentement sur le mur intérieur
  — l'événement lumineux de la salle, deux fois par orbite.
- **Cabine des jumeaux** — deux plafonniers blancs froids rigoureusement
  identiques (0,12), un par couchette. La symétrie de l'éclairage fait
  partie de l'énoncé du paradoxe ; seuls les chiffres des deux horloges
  diffèrent.

Le rythme d'ensemble, en circulant : orange mouvant (salon) → pointillés
sombres (coursive) → cyan stable (immersion) → noir et vert (machines) →
remontée → ambre vif (vestiaire) → pénombre ponctuée de blanc (galerie) →
et retour au balcon, où l'orange mouvant revient d'en bas. Aucune salle ne
ressemble à sa voisine, et la baie reste l'unique source qui *bouge*.

---

## 5. La palette

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
| Ambre de bord | 0,98, 0,75, 0,42 | *émissif* : plinthes, vestiaire, nez de marche — le chaud habité |
| Cyan d'instrument | 0,36, 0,86, 0,92 | *émissif* : pupitres, cerceaux de coursive, anneau d'immersion — le froid technique |
| Vert de verdict | 0,45, 0,90, 0,55 | *émissif* : salle des machines uniquement — la couleur de la preuve |
| Rouge de consigne | 0,85, 0,25, 0,18 | *émissif faible* : portes scellées, interdits |
| Blanc de lecture | 0,93, 0,90, 0,85 | *émissif* : pupitres de la galerie, miroir, chiffres |

Discipline d'usage : les trois sombres partout ; un seul accent peint
(l'orange de chantier) ; et par salle, une seule dominante émissive. Le vert
et le rouge sont des couleurs *rares* — c'est leur rareté qui leur donne un
sens.

---

## 6. Le vocabulaire de formes

Tout repose sur les quatre primitives déjà en place — `quad`, `boite`,
`barre`, sphère à facettes — et sur des motifs répétés au millimètre près.
C'est la répétition disciplinée qui fait qu'un décor procédural a l'air
conçu.

1. **Le module de 1,45 m.** Le pas des membrures existantes devient la maille
   du vaisseau entier : membrures, joints de panneaux, cerceaux lumineux et
   alcôves s'y accrochent (les alcôves de la galerie au demi-pas). Une porte
   se centre toujours entre deux membrures, jamais sur l'une d'elles.
2. **La membrure.** Boîte de section 0,12 × 0,22 plaquée contre paroi et
   plafond, teinte Étain, une par module. Sur les parois hautes de la
   passerelle et de l'immersion, elle se prolonge au plafond en arceau à
   trois segments (deux boîtes inclinées à 45° + une horizontale).
3. **Le chanfrein de 12 cm.** Toute ouverture — porte, trouée, hublot,
   trappe — est bordée d'un pan coupé à 45° de 12 cm, teinte Étain : un
   quad par arête. C'est le motif qui distingue « percé dans une coque
   épaisse » de « découpé dans du carton », déjà prouvé par le tableau de
   la baie.
4. **Le hublot octogonal.** Le cercle est hors budget ; l'octogone est le
   cercle du bord. Ouverture octogonale inscrite dans un carré de 0,70 m,
   cadre Étain de 0,10 m de large et 0,18 m de profondeur, chanfreiné.
   Le « verre » est l'absence de géométrie — la passe de géodésiques fait
   le reste. ~150 triangles pièce.
5. **Le bandeau lumineux.** Boîte émissive de 6 cm de haut, 2 cm de saillie,
   posée soit en plinthe (y = 0,12) soit en linteau (y = 2,10), et qui
   s'arrête toujours à 20 cm d'un angle : une lumière qui tourne le coin a
   l'air d'un tube de néon collé, une lumière qui s'interrompt a l'air
   encastrée.
6. **La rayure d'avertissement.** Alternance de boîtes plates inclinées à
   45°, 12 cm de pas, Orange de chantier / Basalte, non émissive. Sur les
   nez de la fosse, les seuils de trappe, les pieds d'échelle, et les portes
   scellées.
7. **La porte.** 0,95 × 2,05, vantail Orange de chantier, encadrement Étain
   de 14 cm chanfreiné, plaque émissive Blanc de lecture (0,50 × 0,12)
   au-dessus, portant le nom de la salle. Le vantail coulisse dans la
   cloison (une translation en x local — seule pièce animée du décor).
8. **La porte scellée.** Le même cadre, vantail Basalte barré de deux
   rayures d'avertissement croisées et d'un voyant Rouge de consigne.
   C'est le motif qui rend le chantier diégétique : une salle pas encore
   construite est une salle *scellée*, pas un mur nu.
9. **Le joint de panneau.** Baguette Étain de 2 cm × 1,5 cm de saillie,
   quadrillant les grandes parois au pas du module (1,45 m) et à mi-hauteur.
   Trois quads suffisent (dessus + deux flancs) : c'est lui qui casse les
   aplats sans coûter.
10. **L'ombre d'angle peinte.** Pas un objet : une règle de teinte. Les
    sommets situés à moins de 25 cm d'un angle rentrant voient leur teinte
    assombrie de 30 % à la construction — une occlusion ambiante de pauvre,
    calculée, gratuite au rendu, et qui « assoit » chaque pièce au sol.

---

## 7. Ce que j'écarte, et pourquoi

**L'ascenseur.** Il promet du vaisseau et livre une boîte noire : un temps
d'attente, une coupure de la continuité spatiale, et de l'animation à
maintenir. L'escalier coûte 1 400 triangles et fabrique, à son sommet, la
meilleure vue du site. Un ascenseur n'a droit de cité que le jour où il y
aura cinq ponts — il n'y en aura pas cinq.

**La symétrie du plan.** Un vaisseau symétrique se lit d'un coup d'œil et
s'oublie aussi vite ; et surtout, on s'y perd — deux couloirs identiques
sont indiscernables. Ici la circulation longe tribord, la galerie déborde en
nacelle, le vestiaire se blottit à bâbord : chaque direction a une
signature. La seule symétrie du bord est dans la cabine des jumeaux, où elle
est *l'énoncé du problème*.

**Une baie dans la salle d'immersion.** C'est l'idée la plus tentante — « la
grande salle du fond mérite la grande vue » — et c'est la plus fausse. Le
contrat du site (OBJECTIFS.md) repose sur salon = temps réel / simulateur =
bac à sable. Une fenêtre honnête dans la salle où l'on accélère le temps
montrerait deux ciels contradictoires dans le même champ. La salle
d'immersion est aveugle par principe, pas par économie.

**Le hangar à sondes praticable.** Un sas, des portes de soute, une sonde
grandeur nature qu'on regarde partir : très séduisant, et prématuré. C'est
3 000 triangles, de l'animation, et surtout un doublon — le lancement de
sondes existe déjà, dans le simulateur, là où on peut tricher avec le temps
pour le voir aboutir. Le râtelier décoratif de la salle d'immersion garde
l'imaginaire ; le hangar attendra d'avoir une fonction propre.

**La coque courbe.** Des coursives cylindriques, une baie bombée : c'est le
cliché du genre, ça coûte cher en facettes pour rester lisse, et ça dissout
le vocabulaire orthogonal-chanfreiné qui fait l'identité du bord. La
courbure est réservée aux sphères à facettes *assumées* (têtes, sondes) —
partout ailleurs, l'angle et le pan coupé.

**Sur les contraintes elles-mêmes**, deux remarques plutôt qu'une objection.
La contrainte n° 2 (le disque comme lumière principale) exige, pour les
salles profondes, un terme de rebond simulé — direction et intensité du
disque passées en uniformes, appliquées en dégradé aux surfaces tournées
vers la baie ; sans lui, le « rebond » s'arrête net au plan de la vitre et
l'œil le remarque. Et le budget de 40 000 triangles est en réalité
confortable : sur ce type de scène, le coût vrai est le nombre d'appels de
dessin et le remplissage, pas les sommets. D'où une règle de construction :
tout le décor statique dans **un seul VAO**, un seul appel — seuls les
personnages, les vantaux et les chiffres vivent à part.

---

## 8. L'ordre de construction

Le principe : après chaque étape, le vaisseau est *fini quelque part* et
*scellé ailleurs* — jamais en chantier apparent. Chaque porte qui ne mène
encore nulle part est posée en version scellée (motif n° 8) dès l'étape 1 :
le plan complet est ainsi visible et prometteur dès le premier jour.

1. **La trouée et la boucle.** Percer le plafond du salon, poser passerelle
   nue + garde-corps, coursive basse, escalier, coursive haute, et toutes
   les portes scellées. À la fin de cette étape, le vaisseau a un étage, la
   boucle se marche, le balcon existe — l'essentiel de l'effet « vrai
   vaisseau » est acquis, pour ~9 000 triangles. Déplacer le point
   d'apparition sur la passerelle.
2. **La passerelle équipée.** Table de veille, hologramme de destination,
   pupitres de missions et de quêtes. Le poste de commande fonctionne ; la
   gamification a son adresse.
3. **La salle d'immersion.** L'entrée du simulateur déménage des menus vers
   la plate-forme. C'est le plus gros gain d'usage : les deux moitiés du
   site — l'honnête et le bac à sable — sont désormais deux *lieux*.
4. **Le vestiaire.** Mannequins, miroir, boutique de Lumen. La boucle de
   progression (comprendre → gagner → s'habiller) devient marchable.
5. **La galerie.** Les neuf fiches quittent les menus pour les alcôves ;
   les voyants de niveau relisent la progression existante.
6. **Les machines.** Trappe, échelle, stèles, verdicts verts. Le banc
   d'essai devient une descente.
7. **Le Prisme, puis la cabine des jumeaux.** Les deux modules spécialisés,
   les plus autonomes, ferment la liste des portes scellées.
8. **La passe d'ambiance**, en continu à partir de l'étape 2 : bandeaux,
   joints, rayures, ombre d'angle, rebond du disque, PNJ. Une demi-journée
   par salle, au fil de l'eau, jamais « à la fin ».
