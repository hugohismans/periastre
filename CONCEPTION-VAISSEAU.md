# Le salon d'observation

Conception de l'habitacle. Tout est décrit en formes et en coordonnées : aucune
ligne de code ici, aucun modèle importé, aucune texture. Repère : **x** vers
tribord, **y** vers le haut, **z** vers l'arrière. L'œil par défaut reste en
(0 ; 1,62 ; 2,55).

---

## 0. Avertissement de repère — à lire avant de coder

Toutes les cotes de ce document sont calculées sur la coque telle qu'elle était
au moment de la conception : **L = 9,0 / H = 3,0 / P = 6,5**, baie de 5,4 m,
seuil à y = 0,55. **`vaisseau.js` a changé pendant la rédaction** et vaut
désormais L = 10,0 / H = 3,25 / P = 7,4, baie de 6,2 m, seuil à **y = 0,30**,
avec une `FOSSE` à −0,58.

Le raisonnement ne bouge pas — il est ancré sur le **plan de la baie** et sur la
**hauteur du seuil**, pas sur le centre de la pièce. La transposition est
mécanique :

| grandeur | ancien | nouveau | règle |
|---|---|---|---|
| parois latérales | x = ±4,50 | x = ±5,00 | tout ce qui est **posé sur une paroi** glisse de 0,50 vers l'extérieur ; le mobilier libre garde son x |
| plan de la baie | z = −3,25 | z = −3,70 | tout ce qui est **accroché à la baie** glisse de −0,45 en z |
| paroi arrière | z = +3,25 | z = +3,70 | idem, +0,45 |
| plafond | y = 3,00 | y = 3,25 | la coursive gagne 0,25 de garde (2,71 m) |
| profondeur gagnée | — | +0,90 | **à donner entièrement au puits** : z ∈ [−3,70 ; −1,40], soit 2,30 de profondeur. L'arête du pont reste en z = −1,40 et toutes les cotes du gradin sont inchangées. |
| largeur gagnée | — | +1,00 | 0,50 à la nef bâbord (x ∈ [−5,00 ; −2,80]), 0,50 à la coursive (x ∈ [+2,75 ; +5,00]) |
| montants de baie | −1,35 / +0,90 | **−1,60 / +0,90** | le montant tribord reste **verrouillé sur l'arête du puits** ; l'autre se recale pour donner des vitrages de 1,50 / 2,50 / 2,20 |

**Deux conséquences du seuil descendu à 0,30, qui ne sont pas cosmétiques :**

1. **Le puits doit descendre à y = −1,05, pas −0,80.** Tout le §2 repose sur le
   fait que le seuil arrive à hauteur de poitrine quand on est debout dans le
   puits. Avec un seuil à 0,30 et un plancher à −0,80, il n'arrive qu'à 1,10 —
   à la taille. On ne s'y accoude plus, on **bascule par-dessus**. À −1,05, on
   retrouve 1,35 et l'appui fonctionne. Les gradins suivent : girons à −0,70 et
   −0,35, contremarches de 0,35.
   *La `FOSSE` actuelle à −0,58 est encore plus exposée : 0,88 sous le seuil,
   soit la mi-cuisse. C'est une balustrade à hauteur de chute.*
2. **La lisse d'appui du seuil tribord (#24) devient obligatoire.** Debout sur
   le pont, un seuil à 0,30 passe **sous le genou**. Sans la lisse à 1,05, la
   station debout est une corniche.

Un point du §2 se dégrade et je le signale plutôt que de le masquer : assis sur
le gradin, l'œil est à 0,43 et le seuil à 0,30, soit **3° sous le regard** au
lieu de 5° au-dessus. L'effet « le sol de la pièce disparaît » n'est plus exact,
on aperçoit une bande de paroi sous la vitre. Pour le récupérer : remonter
`BAIE.bas` vers 0,45, ou descendre l'assise du gradin à −0,48.

---

## 1. Le parti pris

C'est un **poste de quart**, pas un salon : la pièce où une personne à la fois
vient regarder, longtemps, et où deux ou trois autres peuvent la rejoindre sans
la déranger. Elle est faite pour des gens qui vivent ici depuis des mois et pour
qui l'astre n'est plus un événement mais un climat — donc rien de cérémonieux,
rien de neuf, des surfaces qui portent l'usure de l'usage.

La sensation cherchée est celle du **phare** et de la salle de contrôle
d'observatoire : on est au chaud, à l'abri, dans le noir, et on descend vers la
lumière. La pièce ne se présente pas au visiteur — elle lui tourne à moitié le
dos et le laisse trouver sa place.

Une seule règle de composition en découle, et elle commande tout le reste :
**le sol descend vers la baie**. On entre en haut par le sas, on descend d'un
niveau sur le pont, on descend encore dans le puits. Personne ne décide de
regarder : la pente le fait.

---

## 2. Le plan

### Les trois niveaux

| niveau | y | surface au sol | garde au plafond | rôle |
|---|---|---|---|---|
| **Coursive** | **+0,54** | 1,75 × 3,85 m (tribord arrière) | 2,46 m | entrée par le sas, circulation, console |
| **Pont** | **0,00** | ~28 m² en L | 3,00 m | station debout, fauteuil de quart, seuil tribord |
| **Puits** | **−0,80** | 3,25 × 1,85 m (bâbord avant) | 3,80 m | l'observation assise et debout au vitrage |

Dénivelé total : 1,34 m sur 6,5 m de profondeur. Le plafond reste plat à 3,00 m —
c'est le **sol** qui travaille, pas le volume. Une vraie mezzanine était
impossible : il faut 3,6 m de hauteur libre pour empiler deux niveaux habitables,
on n'en a que 3,0. Creuser était la seule sortie, et c'est la bonne : le puits
regarde vers le haut, une mezzanine aurait regardé vers le bas.

### Répartition en plan

```
                 ← bâbord (−x)                    tribord (+x) →
                                BAIE  x ∈ [−2,70 ; +2,70]
       ┌────────────────────────────────────────────────────────┐
z=−3,25│                       ║ mont.        ║ mont.           │
       │      P U I T S   y = −0,80           │   S E U I L     │
       │ ▒                                    │    debout       │
       │ ▒  gradin        ⬡ hublot de pont    │  ▬▬▬ lisse      │
z=−2,0 │ ▒  latéral                           │      ■ colonne  │
       │ ▒  −0,40                             │      d'instrum. │
z=−1,4 ├────────────────────────────┬─────────┤                 │
       │   gradin arrière  −0,40    │ garde-  │                 │
z=−0,85├────────────────────────────┤ corps   │   ┌─ escalier ──┤
z=−0,60│                            │         │   │ +0,18 +0,36 │
z=−0,30└───────────┐                │         │   ├─────────────┤
       │           │                          │   │             │
       │ ▐ paroi   │      P O N T   y = 0     │   │  COURSIVE   │
z=+0,6 │ ▐ cannelée│   ▭ fauteuil de quart    │   │   y = +0,54 │
       │ ▐         │                          │   │  ▬ console  │
z=+1,3 │           │                          │   ╠═ cloison ═══┤
       │                                      │   ║             │
z=+3,25└──────────────────────────────────────┴───╨────⬡ sas ───┘
                                                    x=+2,75
```

### Coupe longitudinale (au droit de x ≈ 0)

```
 y
3,00 ─┬──────────────────────────────────────────────────────┬─ plafond
      │   ▄▄ poutre        ▄▄ poutre              ▄▄ poutre  │
2,55 ─┤ ╔═══════════════════════╗                            │
      │ ║                       ║                            │
      │ ║      B A I E          ║          œil 1,62  ●──►    │
1,05 ─┤ ║ ▬ lisse (seuil trib.) ║                            │
0,55 ─┤ ╚═══════════════════════╝──────┐                     │
0,00 ─┤                                │      P O N T ───────┤
−0,40─┤                          ┌─────┘ gradin              │
−0,80─┴────── P U I T S ─────────┘                           │
       z=−3,25            −1,40  −0,85 −0,30            +3,25
```

### Emprises exactes

- **Puits** : plancher y = −0,80, x ∈ [−2,35 ; +0,90], z ∈ [−3,25 ; −1,40].
- **Gradin arrière** (2 contremarches de 0,40, assise) : x ∈ [−2,35 ; −0,20],
  giron intermédiaire y = −0,40 sur z ∈ [−1,40 ; −0,85], puis le pont à z = −0,30.
- **Gradin latéral bâbord** (une seule marche, assise face au vitrage) :
  y = −0,40, x ∈ [−2,80 ; −2,35], z ∈ [−3,25 ; −1,40].
- **Arête franche tribord du puits** : x = +0,90 sur z ∈ [−3,25 ; −1,40] et
  z = −1,40 sur x ∈ [−0,20 ; +0,90]. Chute de 0,80 m → garde-corps obligatoire.
- **Pont (y = 0)** : bande bâbord x ∈ [−4,50 ; −2,80] sur tout z ; puis
  x ∈ [−2,35 ; −0,20] à partir de z = −0,30 ; x ∈ [−0,20 ; +0,90] à partir de
  z = −1,40 ; et tout x ∈ [+0,90 ; +2,75] sur tout z (le seuil debout).
- **Coursive (y = +0,54)** : x ∈ [+2,75 ; +4,50], z ∈ [−0,60 ; +3,25].

### Pourquoi ces chiffres tiennent

- **Le seuil de la baie (y = 0,55) est à 1,35 m du plancher du puits.** C'est
  exactement la hauteur d'appui poitrine d'un adulte debout : on s'accoude au
  seuil et toute la fenêtre est au-dessus de soi. C'est la sensation Cupola,
  obtenue sans coupole.
- **Assis sur le gradin (assise y = −0,40), l'œil est à 0,38 m.** Le bas de la
  baie est alors 5° au-dessus de l'horizontale du regard : **le sol de la pièce
  disparaît du champ**, il ne reste que l'astre. C'est la seule position d'où
  l'habitacle cesse d'exister.
- **Debout sur le pont au seuil tribord, l'œil est à 1,62 m** et le seuil est à
  0,55 : on regarde vers le bas et vers l'extérieur. Deux rapports opposés à la
  même fenêtre, à trois mètres l'un de l'autre.
- Depuis l'œil par défaut (0 ; 1,62 ; 2,55), la ligne de vue rasant l'arête du
  pont atteint y = −0,76 au mur avant : **tout le plancher du puits est visible**,
  il occupe le bas du cadre entre −22° et −32°, sous la baie. La composition par
  défaut est donc : puits en bas, baie au-dessus, et c'est réglé sans bouger la
  caméra.

### Trois stations de vue (pour le déplacement dans le vaisseau)

| station | œil | lacet | ce qu'on y voit |
|---|---|---|---|
| **Pont** (défaut, inchangé) | (0 ; 1,62 ; 2,55) | 0 | la pièce entière, le puits en contrebas |
| **Puits** | (−0,90 ; 0,82 ; −2,45) | −0,10 | rien que l'astre, le seuil à hauteur de poitrine |
| **Console** | (+3,60 ; 2,16 ; −0,20) | −0,55 | la console, et la pièce en enfilade vers la baie |

---

## 3. Les éléments

Primitives disponibles : **quad** (le `quad()` existant), **boîte** (6 quads, ou
moins quand des faces sont invisibles), **prisme** (extrusion d'un polygone),
**cylindre à n pans** (n quads + 2 couvercles). Rien d'autre n'est nécessaire.

### 3.1 Coque et ouvertures

| # | élément | description | primitive |
|---|---|---|---|
| 1 | Plafond | y = 3,00, x ∈ [−4,50 ; 4,50], z ∈ [−3,25 ; 3,25] | 1 quad *(existant)* |
| 2 | Paroi avant | z = −3,25, percée de la baie, **descendue à y = −0,80** sur x ∈ [−2,35 ; +0,90] | 5 quads *(reprise du `murPerce` existant)* |
| 3 | Paroi bâbord | x = −4,50 | 1 quad *(existant)* |
| 4 | Paroi tribord | x = +4,50 | 1 quad *(existant)* |
| 5 | Paroi arrière | z = +3,25, **percée du sas** | 4 quads + 4 triangles |
| 6 | Sas | ouverture **octogonale** inscrite dans un carré de 1,20, centre (+3,60 ; 1,40 ; +3,25), chanfreins de 0,35 | bandes autour du carré + 4 chanfreins |
| 7 | Embrasure du sas | jambage de 0,26 de profondeur (z de +3,25 à +2,99) | 8 quads, un par pan |
| 8 | Hiloire du sas | seuil relevé : bas de l'ouverture à y = 0,80, soit **0,26 au-dessus de la coursive** — on enjambe | inclus dans #7 |

> **Le sas n'est pas centré** (x = +3,60 sur une paroi de −4,5 à +4,5) et il est
> au niveau haut. C'est le premier signal d'asymétrie : la pièce a un côté par
> lequel on arrive, et ce côté est haut et à tribord.

### 3.2 La baie et ses montants

| # | élément | description | primitive |
|---|---|---|---|
| 9 | Ouverture | x ∈ [−2,70 ; +2,70], y ∈ [0,55 ; 2,55] — **inchangée** | absence de géométrie |
| 10 | Montant bâbord | **x = −1,35**, épaisseur 0,055, profondeur **0,16** (z de −3,25 à −3,09), y ∈ [0,55 ; 2,55] | 3 quads |
| 11 | Montant tribord | **x = +0,90**, mêmes sections | 3 quads |
| 12 | Traverse d'appui | z de −3,25 à −3,09 à y = 0,55, sur toute la largeur | 1 quad |
| 13 | Linteau | idem à y = 2,55 | 1 quad |

> **Les deux montants passent de x = ±0,90 à x = −1,35 et +0,90.** Les vitrages
> deviennent inégaux : 1,35 / 2,25 / 1,80 m. Ce n'est pas arbitraire — le montant
> tribord tombe **exactement sur l'arête tribord du puits**, et sépare donc le
> vitrage du puits de celui du seuil debout. La fenêtre cesse d'être un rectangle
> miroir et devient le résultat du plan. C'est la correction la plus rentable de
> tout le document : elle coûte deux constantes.

### 3.3 Le puits

| # | élément | description | primitive |
|---|---|---|---|
| 14 | Plancher du puits | y = −0,80, x ∈ [−2,35 ; +0,90], z ∈ [−3,25 ; −1,40] | 1 quad (percé, voir #18) |
| 15 | Joue tribord | x = +0,90, y ∈ [−0,80 ; 0], z ∈ [−3,25 ; −1,40] | 1 quad |
| 16 | Gradin arrière | giron y = −0,40 sur x ∈ [−2,35 ; −0,20], z ∈ [−1,40 ; −0,85] ; contremarches en z = −1,40 (y −0,80→−0,40) et z = −0,85 (y −0,40→0) | 4 quads |
| 17 | Gradin latéral bâbord | giron y = −0,40, x ∈ [−2,80 ; −2,35], z ∈ [−3,25 ; −1,40] ; contremarches en x = −2,35 (y −0,80→−0,40) et x = −2,80 (y −0,40→0) | 4 quads |
| 18 | **Hublot de pont** | ouverture **octogonale Ø 0,90** dans le plancher du puits, centre (−1,30 ; −0,80 ; −2,55) | absence de géométrie + 8 quads de plancher en éventail |
| 19 | Cadre du hublot de pont | jonc octogonal, section 0,07 × 0,05, débordant de 0,04 au-dessus du plancher | 16 quads |
| 20 | Croisillons du hublot | 2 plats de 0,05 × 0,03 croisés à 90°, dans le plan y = −0,79 | 4 quads |
| 21 | Garde-corps du puits | main courante **cylindre 8 pans Ø 0,042**, y = 1,05 : de (+0,90 ; 1,05 ; −3,15) à (+0,90 ; 1,05 ; −1,40), puis de (+0,90 ; 1,05 ; −1,40) à (−0,20 ; 1,05 ; −1,40) | 2 cylindres |
| 22 | Lisse basse | idem à y = 0,52, mêmes tracés | 2 cylindres |
| 23 | Montants du garde-corps | **cylindre 6 pans Ø 0,05**, de y = 0 à 1,08, en (+0,90 ; −3,15), (+0,90 ; −2,30), (+0,90 ; −1,40), (+0,35 ; −1,40), (−0,20 ; −1,40) | 5 cylindres |

> **Le hublot de pont est le pari du projet.** Il ne coûte rien — un trou dans le
> plancher montre le lancer de géodésiques, exactement comme la baie, puisque les
> deux passes partagent la caméra. Et il est visible depuis la station par défaut,
> en bas à gauche du cadre. On se tient dans un puits et il y a une fenêtre sous
> ses pieds.
> **Repli si ça se lit comme un bug de profondeur** : garder le cadre et les
> croisillons, et boucher avec un octogone plein en teinte `CADRE` — le hublot
> existe, mais il est fermé. Ne pas supprimer le cadre : c'est lui qui rend le
> trou lisible comme un vitrage.

### 3.4 Le seuil tribord (station debout)

| # | élément | description | primitive |
|---|---|---|---|
| 24 | Lisse d'appui | **cylindre 8 pans Ø 0,045**, de (+0,95 ; 1,05 ; −3,05) à (+2,68 ; 1,05 ; −3,05) | 1 cylindre |
| 25 | Montants de lisse | **cylindre 6 pans Ø 0,05**, y = 0 → 1,08, en (+1,00 ; −3,05) et (+2,62 ; −3,05) | 2 cylindres |
| 26 | Socle d'instrument | tronc de prisme **hexagonal**, base circonscrite Ø 0,72 en y = 0, sommet Ø 0,50 en y = 1,15, centre (+2,25 ; · ; −2,60) | 6 quads + 1 dessus |
| 27 | Chape et fourche | boîte 0,44 × 0,30 × 0,22 à y ∈ [1,15 ; 1,37] ; deux joues 0,06 × 0,26 × 0,42 écartées de 0,32 | 10 quads |
| 28 | Fût de l'instrument | **cylindre 8 pans Ø 0,26, longueur 0,85**, axe partant de (+2,25 ; 1,58 ; −2,60), incliné de **+20° au-dessus de l'horizontale**, pointé vers −z | 8 quads + 2 couvercles |
| 29 | Pare-lumière | jupe conique 8 pans, Ø 0,26 → 0,34 sur 0,14, en bout de fût | 8 quads |

> **La colonne d'instrument mange volontairement l'angle tribord de la baie.**
> Depuis l'œil par défaut elle occulte le coin bas-droit du vitrage. C'est
> l'intervention qui casse le plus efficacement la symétrie du **cadrage** —
> pas du plan, du cadrage, ce qui est plus fort. Et c'est le futur support du
> télescope à filtres, qui est déjà au programme.

### 3.5 La coursive

| # | élément | description | primitive |
|---|---|---|---|
| 30 | Plancher de coursive | y = +0,54, x ∈ [+2,75 ; +4,50], z ∈ [−0,60 ; +3,25] | 1 quad |
| 31 | Escalier (3 marches de 0,18) | x ∈ [+2,75 ; +3,65] ; girons y = 0,36 sur z ∈ [−0,90 ; −0,60] et y = 0,18 sur z ∈ [−1,20 ; −0,90] ; contremarches en z = −0,60, −0,90, −1,20 | 5 quads |
| 32 | Bandeau de rive | face verticale de la coursive, x = +2,75 (partie sans escalier) et z = −0,60, y ∈ [0 ; 0,54] | 2 quads |
| 33 | Main courante de coursive | **cylindre 8 pans Ø 0,042**, y = 1,44 (0,90 au-dessus de la coursive), de (+2,80 ; 1,44 ; −0,45) à (+2,80 ; 1,44 ; +1,25) | 1 cylindre |
| 34 | Montants | **6 pans Ø 0,05**, y = 0,54 → 1,47, en z = −0,45, +0,40, +1,25 | 3 cylindres |
| 35 | Cloison | panneau x = +2,75, épaisseur 0,10, y ∈ [0,54 ; 2,30], z ∈ [+1,30 ; +3,25] | 6 quads |
| 36 | Console | plateau incliné **16° sur l'horizontale**, 1,40 × 0,66 : arête arrière (y = 1,50 ; z = +0,28), arête avant (y = 1,32 ; z = −0,35), x ∈ [+2,95 ; +4,35] | 1 quad + 4 joues |
| 37 | Piètement de console | 2 boîtes 0,08 × 0,08 × 0,78, en x = +3,05 et +4,25, y de 0,54 à 1,32 | 12 quads |
| 38 | Coffres | 3 boîtes de 0,58 × 0,52 × 0,44 alignées contre x = +4,50, à z = +1,55, +2,20, +2,85, posées sur la coursive | 15 quads |

### 3.6 La paroi cannelée (l'instrument de lumière)

Dix lames verticales sur la paroi bâbord, **z ∈ [−1,58 ; +0,58]**, pas de 0,24.

- Lame k (k = 0…9) : `z_k = −1,58 + 0,24·k`, angle `α_k = 74° − 4,67°·k`
  (donc 74° à l'avant, 32° à l'arrière).
- Chaque lame : plaque de **0,22 de saillie × 0,05 d'épaisseur**, y ∈ [0,15 ; 2,35],
  partant du plan x = −4,50, dans la direction horizontale `(cos α, 0, sin α)`.
  Pointe en `(−4,50 + 0,22·cos α_k , y , z_k + 0,22·sin α_k)`.
- Primitive : **4 quads** (deux grandes faces, le chant supérieur, le chant
  extérieur). 40 quads au total.

**Pourquoi cet angle-là.** La normale de la face éclairée vaut `(sin α, 0, −cos α)`.
La direction vers la baie, depuis une lame, fait un angle φ avec −z qui **balaie
d'environ 25° quand l'astre traverse la fenêtre**. À l'avant du panneau (z = −1,58)
φ balaie 52° → 76° ; à l'arrière (z = +0,58) il balaie 29° → 60°. En donnant à
α le gradient **inverse** de celui de φ, chaque lame culmine à un moment différent
de la dérive : **une vague de clarté remonte le long de la paroi au fil de
l'orbite**, sans qu'aucune lame ne bouge.

> Ces 42° de gradient sont un point de départ, pas une valeur exacte : à valider
> à l'écran et à resserrer si la vague est trop rapide. C'est le seul élément du
> document dont je ne garantis pas les constantes.
>
> **Pourquoi le panneau s'arrête à z = +0,58** et ne court pas toute la paroi :
> au-delà, le terme `ouvert` du nuanceur tombe à son plancher de 0,15 et la
> distance au carré fait le reste — les lames y recevraient environ **13 %** de
> la lumière des lames avant. Un panneau de 5 m serait 60 % de géométrie noire.
> Devant (z < −1,58), c'est l'inverse : φ n'y balaie plus que 5°, la vague
> s'arrête. Le panneau est exactement aussi long que la zone où l'effet existe.

### 3.7 Plafond et servitudes

| # | élément | description | primitive |
|---|---|---|---|
| 39 | Poutres (3) | boîtes de 9,00 × 0,26 (z) × 0,20 (retombée, y de 2,80 à 3,00), en **z = −2,10, −0,35, +2,05** | 4 quads chacune |
| 40 | Gaine technique | **cylindre 10 pans Ø 0,34**, axe horizontal en (x = +4,26 ; y = 2,55), de z = −1,20 à +3,25 | 10 quads |
| 41 | Colliers de gaine | 3 cylindres 10 pans Ø 0,42 × 0,10, en z = −0,60, +1,00, +2,50 | 30 quads |

> **Les poutres sont irrégulièrement espacées** (1,75 m puis 2,40 m) et la gaine
> n'existe que d'un côté. Un vaisseau réel range ses fluides sur une face et pas
> sur l'autre — c'est la logique des baies d'équipement de l'ISS, où chaque face
> du module a une affectation différente. Ici : **fluides à tribord, lumière à
> bâbord.**

### 3.8 Mobilier

| # | élément | description | primitive |
|---|---|---|---|
| 42 | Fauteuil de quart | assise 0,52 × 0,50 × 0,10 à y = 0,42 ; dossier 0,52 × 0,09 × 0,55 incliné de 12° ; fût **cylindre 8 pans Ø 0,18** de y = 0 à 0,42 ; embase Ø 0,44 × 0,05. Centre **(−1,55 ; · ; +0,60)**, **pivoté de 24° vers la baie** | 14 quads |
| 43 | Coussins du gradin | 3 plaques de 0,04 d'épaisseur posées sur le giron y = −0,40, longueurs **0,74 / 0,52 / 0,96** avec des jeux de 0,08, à partir de x = −2,28 | 9 quads |

> **Un seul fauteuil**, décentré, tourné de travers. C'est le signal le plus
> économique qu'il y a ici quelqu'un plutôt que des gens. Et les coussins du
> gradin sont de longueurs inégales : personne n'a mesuré, on a posé ce qu'on
> avait. Trois quads pour dire ça.

### 3.9 Les volets de baie

Quatre lames horizontales à persienne, **à l'extérieur de la paroi**, en z = −3,31.

- Lame j (j = 0…3) : axe de rotation horizontal en `y_j = 0,80 + 0,50·j`,
  parallèle à x, de x = −2,70 à +2,70.
- Lame fermée : plaque 5,40 × 0,50 × 0,03 dans le plan z = −3,31.
- Lame ouverte : la même, **pivotée de 78° autour de son axe** — vue de la pièce,
  elle se réduit à un trait.
- Primitive : **4 quads par lame** (deux faces, deux chants). 16 quads.

> Aucune modification du nuanceur n'est nécessaire pour que ça marche : le modèle
> d'éclairage échantillonne la baie en z = −3,25, donc **en arrière des lames**.
> Leurs faces tournées vers la pièce reçoivent zéro et se rendent au terme
> ambiant : elles se découpent en **silhouettes noires devant l'astre**, ce qui
> est exactement le résultat voulu. C'est gratuit.

### 3.10 Le balisage

Bandes minces (quads décalés de 0,005 de leur support), teinte `BALISE`. Environ
22 quads au total.

- Bandeau de 0,03 sous la rive de coursive (face tournée vers −y), sur toute sa
  longueur.
- Bandeau de 0,03 sur la face **arrière** (+z) des contremarches du gradin et de
  l'escalier.
- Bandeau de 0,04 sur le jambage du sas, en fond d'embrasure.
- Deux bandeaux verticaux de 0,03 sur les montants du garde-corps, y ∈ [0,10 ; 0,40].

> **Règle absolue : jamais de balise sur une face qui voit la baie.** Le nuanceur
> multiplie la teinte par la lumière ; une teinte saturée sur une face éclairée
> vire au rouge fluorescent et vole la vedette. Sur une face aveugle, elle ne
> reçoit que le terme ambiant de 0,075 et se rend à **≈ 0,26 de rouge après
> gamma** : un balisage juste visible, exactement le rendu d'une salle de contrôle
> passée au rouge.

### Budget

| poste | quads |
|---|---|
| Coque, baie, sas | ~40 |
| Puits, gradins, hublot de pont | ~45 |
| Coursive, escalier, cloison, console, coffres | ~50 |
| Paroi cannelée | 40 |
| Poutres, gaine, colliers | 52 |
| Garde-corps, lisses, montants (cylindres 6–8 pans) | ~70 |
| Colonne d'instrument | ~35 |
| Mobilier, volets, balisage | ~60 |
| **total** | **≈ 390 quads → 780 triangles → ≈ 2 340 sommets** |

Contre 120 sommets aujourd'hui, et pour un budget annoncé de « quelques
milliers ». Il reste de la marge, mais **pas assez pour du bruit décoratif** :
tout ce qui s'ajouterait doit prendre la place d'autre chose.

---

## 4. Les matériaux

Six teintes, pas une de plus. Elles sont toutes légèrement froides sauf une :
l'unique source est chaude (`CHAUD = (1,00 ; 0,72 ; 0,44)` dans le nuanceur),
donc **le froid des teintes de base ne survit que dans l'ombre**. C'est ce qui
fait qu'une pièce grise paraît bleue dans les coins et ambrée près de la fenêtre,
sans qu'on ait ajouté la moindre lumière.

| nom | RVB | ce qu'elle habille | pourquoi |
|---|---|---|---|
| `COQUE` | **0,058 ; 0,056 ; 0,074** | parois, plafond, cloison, joues du puits | Plus sombre que l'existant (0,115). Les parois doivent **reculer** ; on ne doit pas pouvoir dire où est le coin arrière. |
| `PONT` | **0,092 ; 0,084 ; 0,094** | tous les plans de marche : pont, puits, girons, coursive | Un cran au-dessus de la coque, et **presque neutre** : c'est la surface que la bande de reflet balaie, elle doit prendre la couleur de l'astre sans en ajouter. |
| `STRUCTURE` | **0,132 ; 0,126 ; 0,152** | poutres, lames de la paroi cannelée, gaine, montants, socle d'instrument, contremarches | Le gris moyen qui **porte tout le relief**. C'est la teinte des lames : c'est sur elle que la vague de lumière se lit. |
| `CADRE` | **0,215 ; 0,198 ; 0,222** | montants et traverses de baie, jonc du hublot de pont, hiloire du sas, volets, mains courantes | La plus claire, et **réservée à ce qui borde une ouverture**. Un seul rôle, tenu partout : quand une arête est claire, c'est qu'on peut passer au travers. |
| `GARNITURE` | **0,118 ; 0,096 ; 0,100** | fauteuil, coussins du gradin, plateau de console | Légèrement rouge, seule teinte à ne pas être bleutée. C'est ce qui la fait lire comme du textile contre du métal, **sans texture**. |
| `BALISE` | **0,62 ; 0,085 ; 0,055** | uniquement les 22 bandes de balisage | Saturée, mais posée seulement sur des faces aveugles. Elle exploite le terme ambiant du nuanceur : **une lueur sans source de lumière**. |

Les cinq premières valeurs tiennent dans un rapport de 1 à 3,7 (0,058 → 0,215).
C'est volontairement resserré : au-delà, les surfaces claires commencent à
concurrencer la baie dès qu'on approche du périastre et que `uEclatAstre`
triple.

---

## 5. Ce qui bouge

**Deux choses, et rien d'autre.** Le reste est fixe par principe : dans une pièce
dont la lumière balaie déjà, tout mouvement supplémentaire brouille la lecture de
l'orbite.

### 5.1 Les volets — le seul vrai mécanisme

C'est l'élément qui a le plus à gagner à réagir à l'orbite, et c'est justifié :
les hublots de la Cupola ont de vrais volets, manœuvrés à la main, fermés par
défaut, qui protègent le vitrage des débris et du rayonnement. Ici, le flux
**triple entre l'apoastre et le périastre** (`salon.eclat` va de 1 à 3,2) — donc
on ferme en approchant.

- Angle des lames : `θ = 78° · (1 − clamp((eclat − 1,4)/1,6 , 0 , 1))`.
  θ = 78° (ouvert, trait fin) tant que `eclat < 1,4` ; θ → 0 (fermé) quand
  `eclat ≥ 3,0`.
- **Ne jamais fermer complètement** : plafonner à 88 % de course. On garde
  toujours une fente. Un vaisseau qui aveugle son propre salon au moment le plus
  intéressant est un vaisseau mal conçu.
- Mouvement lent, amorti : constante de temps de l'ordre de 8 s en temps de bord,
  pas asservie image par image à `eclat` — sinon les lames tremblent.

**Effet obtenu sans toucher au nuanceur** : les lames coupent l'astre en tranches
noires. C'est déjà spectaculaire.

**Effet obtenu avec une ligne** : si l'on veut que la pièce s'assombrisse
réellement quand les volets se ferment, pondérer l'échantillonnage de la baie —
`w *= mix(1.0, 0.22, uFermeture)` dans la double boucle du `fs-salon`. Un
uniforme de plus, une multiplication. À faire, sinon la pièce reste
incohérente : on voit les volets fermés et le sol reste éclairé.

### 5.2 Le fût de l'instrument — la poursuite

Le fût (#28) s'oriente sur `salon.versAstre` : deux angles, aucune géométrie
supplémentaire. Le vaisseau dérive dans son assiette (le `sin(ts·0,21)` déjà
en place), donc **le fût contre-braque en permanence** : il reste pointé pendant
que la pièce tourne autour de lui. C'est le meilleur indicateur possible que
c'est le vaisseau qui bouge, pas l'astre — et c'est précisément le
contresens que la scène risque d'induire.

- Limiter la course à ±22° en site et ±35° en gisement, avec butée franche.
  Un instrument qui peut tout viser ne raconte rien.

### 5.3 Ce qui ne bouge surtout pas

- **Les lames de la paroi cannelée.** Tentation forte, erreur certaine : si les
  lames tournent *et* que la lumière balaie, on ne peut plus attribuer la vague
  à l'orbite. La paroi est un instrument de mesure, elle doit être fixe pour
  mesurer.
- **Le fauteuil.** Il ne pivote pas, il ne s'oriente pas. Il est là où quelqu'un
  l'a laissé.
- **Les volets du hublot de pont.** Un seul mécanisme animé suffit à établir que
  le vaisseau en a.
- Aucun clignotant, aucune diode, aucun ventilateur. Rien qui ait sa propre
  horloge.

---

## 6. Ce que j'écarte

**La coupole à facettes.** C'était la référence la plus évidente — la Cupola,
1,50 m de haut, 2,95 m de diamètre, sept hublots. Écartée pour trois raisons.
Une géométrie coûte des centaines de quads et multiplie les arêtes claires
devant l'astre, exactement ce qu'on ne veut pas. Le terme `ouvert` du nuanceur,
purement fonction de z, suppose une boîte et deviendrait faux. Et surtout : une
coupole se lit comme une **capsule**, une paroi plate de 9 m se lit comme un
**bâtiment**. La Cupola est un poste pour une personne coincée ; on veut un lieu
où l'on vit. On en garde la leçon (les volets, la main courante partout, le
seuil à hauteur de poitrine) sans en garder la forme.

**Le cadran solaire, la fente de lumière, l'ombre portée mobile.** L'idée la plus
séduisante pour exploiter la lumière tournante : un gnomon dont l'ombre traverse
le sol au fil de l'orbite. **Le nuanceur n'a pas d'ombres portées** — il ne
calcule que `dot(n, direction de la baie)`. Une lame en surplomb n'assombrit rien
sous elle. Tout ce qui repose sur une ombre serait un mensonge, ou exigerait une
passe d'ombrage complète. C'est pour ça que la paroi cannelée fonctionne par
**orientation de faces** et pas par occultation : c'est la seule mécanique que le
rendu sait réellement produire. Contrainte respectée jusqu'au bout, tous les
éléments du chapitre 3 en découlent.

**Tout éclairage intérieur réel.** Une rampe, un panneau, un liseré émissif :
chacun oblige à un deuxième terme dans le nuanceur, et le jour où la pièce a sa
propre lumière, l'astre n'est plus la source, il n'est plus qu'un décor derrière
une vitre. Le balisage (§3.10) donne l'**apparence** d'un éclairage de sécurité
pour zéro lumen, en exploitant le terme ambiant existant. C'est la bonne
tricherie : elle ne coûte rien et elle ne ment pas sur la physique de la scène.

**Les afficheurs holographiques flottants, les liserés bleus, les couloirs à
néons.** Cliché, et techniquement coûteux (transparence, tri en profondeur,
bloom). La seule information affichée reste sur les deux écrans 2D existants —
avec **une correction à faire** : ils sont aujourd'hui parfaitement en miroir
(x ∈ [−4,42 ; −2,80] et [+2,80 ; +4,42], même y, même z), ce qui contredit tout
le reste. Proposition : garder l'écran bâbord tel quel, et remplacer celui de
tribord par un panneau **plus petit, plus bas, et déhanché de 14° vers la pièce** —
sommets a = (+2,92 ; 1,94 ; −3,238), b = (+4,24 ; 1,94 ; −2,919),
c = (+4,24 ; 1,06 ; −2,919), d = (+2,92 ; 1,06 ; −3,238). Rapport 1,5:1 conservé,
donc le tracé Canvas 300 × 200 n'est pas déformé. Un troisième écran peut prendre
place sur la console (#36) — mais il ne sera lisible que depuis la station
Console, un plateau incliné à 16° étant illisible de loin. C'est une raison de
plus de faire les trois stations.

**La verdure, le module de culture.** Présents dans tous les projets d'habitat
sérieux, et j'aurais aimé. Mais un feuillage vert sous une source unique orange
devient une bouillie brune, et une feuille crédible demande soit une texture,
soit des dizaines de quads. Cent plantes, c'est le budget entier du salon.

**La fosse circulaire, le mobilier arrondi.** Un puits rond coûterait vingt fois
ses quads en pans et, surtout, un cercle est la forme la plus symétrique qui
existe. Le puits est un rectangle décentré : moins joli sur le plan, beaucoup
plus juste dans la vue.

**Toute figure humaine.** À ce budget, un personnage est un mannequin. Et il
fixerait l'échelle plus fort que la fenêtre, ce qui est exactement l'inverse du
but. L'échelle est donnée par les mains courantes, la hauteur des marches et le
seuil : des objets dont on connaît la taille sans y penser.

**Le second hublot dans la paroi bâbord.** Envisagé (une vue latérale le long de
l'orbite, gratuite comme le hublot de pont). Écarté : le nuanceur n'éclaire la
pièce que par la baie, donc une deuxième ouverture laisserait passer une image
sans laisser passer de lumière. L'incohérence serait visible. Le hublot de pont
échappe à l'objection parce qu'il est **dans le sol du puits**, où l'on n'attend
de toute façon aucun apport de lumière.

**Le détail de coque, les lignes de panneaux, la visserie.** Le réflexe du
*greebling*. Sans texture, chaque ligne de panneau est un quad. Le relief vient
d'ailleurs : dix lames, trois poutres, une gaine, un escalier. Quatre gestes qui
portent, plutôt que deux cents qui ne portent rien.

---

## Références

- [Cupola (ISS module) — Wikipedia](https://en.wikipedia.org/wiki/Cupola_(ISS_module)) et
  [ISS: Cupola — eoPortal](https://www.eoportal.org/satellite-missions/iss-cupola) :
  dimensions (1,50 m de haut, 2,95 m de diamètre), hublot central de 80 cm,
  volets à manœuvre manuelle en Kevlar/Nextel, aménagement intérieur organisé
  autour de mains courantes haute et basse.
- [Rigged for Red — The Tides of History](https://thetidesofhistory.com/2024/09/22/rigged-for-red-why-are-there-red-lights-on-a-submarine/) :
  passage au rouge du poste de commandement 30 min avant l'immersion
  périscopique, 30 à 45 min nécessaires à l'adaptation à l'obscurité.
- [ESO — Paranal Science Operations](https://www.eso.org/sci/facilities/paranal/sciops.html) et
  [The VLT control room](https://www.eso.org/public/images/eso0021j/) :
  salle de contrôle en modules distincts par télescope, éclairage blanc et rouge
  sur variateurs, électronique et personnel sortis de la coupole.
- [NASA-STD-3001 Vol. 2 — Human Factors, Habitability](https://standards.nasa.gov/standard/NASA/NASA-STD-3001_VOL_2) :
  profils de mains courantes et enveloppes de dégagement. Les valeurs Ø 0,042 et
  Ø 0,05 retenues ici sont dans la fourchette usuelle des barres de préhension à
  main nue ; à resserrer si un jour la question se pose vraiment.
