# La frontière du simulable

Ce que ce site calcule, ce qu'il approche, et ce qu'il peint.

Écrit le 6 août 2026. Il n'y a qu'un seul document sur cette question, et c'est
celui-ci — c'est tout son intérêt.

---

## Pourquoi cette frontière décide de tout

Le site fait une promesse : **rien n'est importé.** Pas une texture, pas une
photographie, pas une étoile peinte à la main. Les images sortent des équations
d'Einstein, calculées à l'exécution.

Cette promesse est le seul capital du projet. Le jour où l'on colle une image en
espérant que personne ne demande, il n'y a plus rien à construire après.

Mais une promesse absolue est intenable, et prétendre le contraire serait la
briser d'une autre façon. Il y a des compromis. La question n'est donc pas de
les éviter — c'est de savoir **où ils sont, et de le dire à l'endroit où on les
rencontre.**

> Hugo, le 5 août 2026 : « chaque compromis doit se déclarer là où on le
> rencontre, pas seulement dans une liste rangée ailleurs. »

Un aveu global dans un dossier qu'on ouvre rarement ne vaut pas un aveu au
moment où l'on regarde la chose.

---

## Les trois régimes

### 1. Calculé

Dérivé d'équations, à l'exécution, et vérifiable par une mesure indépendante.
C'est le seul régime qui a le droit de porter une affirmation factuelle.

| quoi | contrôlé par |
|---|---|
| La sphère des photons, l'ombre, la déflexion, l'ISCO | `outil-banc.js`, contre la table d'or du README |
| Les géodésiques de type temps, la précession du périastre | `outil-verif-vol.js` |
| Les dix orbites d'étoiles S | `outil-verif-etoiles.js`, contre une bissection arbitre |
| Les durées de voyage à 1 g, les deux horloges | `outil-verif-vol.js` |
| L'énergie et le moment cinétique d'un système à N corps | `outil-verif-ncorps.js` |
| La marche dans le salon : sol, meubles, collisions | `outil-verif-arpente.js` |
| Le recul logarithmique, sa maille, ses décades | `outil-verif-recul.js` |
| Le champ d'étoiles : taille des cœurs, continuité aux cellules | `outil-verif-ciel.js` |
| Les demi-grands axes des planètes, le Soleil, le nuage de Oort | `outil-verif-solaire.js`, qui reconstruit la colonne par Kepler depuis d'autres colonnes |

**Règle** : aucune valeur recopiée de mémoire. On la dérive d'une source, ou on
la relève et on l'écrit dans un fichier de sources. `outil-verif-contenu.js`
refuse le reste.

### 2. Approché

Calculé, mais avec un modèle qu'on sait incomplet. Ce n'est pas du décor : les
ordres de grandeur tiennent, et les tendances sont vraies. C'est le régime le
plus délicat, parce qu'il ressemble au premier.

- **L'émissivité du disque.** L'optique gravitationnelle est exacte ;
  l'astrophysique ne l'est pas. Manquent le transfert radiatif en plasma
  optiquement mince, la géométrie épaisse d'un RIAF, la variabilité. Un vrai
  rendu part d'un post-traitement GRMHD ; ici l'émissivité est posée à la main.
- **La rotation de Sagittarius A\*.** Elle n'est pas mesurée. Les quatre valeurs
  proposées sont des hypothèses, et le panneau le dit à chaque fois. C'est
  pourquoi il existe à côté un trou noir d'étude, où les hypothèses sont chez
  elles.
- **L'orientation en profondeur de l'essaim d'étoiles.** Les positions sur le
  ciel sont solides ; le signe de la profondeur dépend d'une convention que les
  articles citent sans la réécrire. Conséquence assumée : la vue n'indique
  **aucune** direction vers la Terre et ne marque aucun côté proche, donc
  l'ambiguïté n'est pas observable et le site n'affirme rien.

### 3. Décor

Posé à la main, pour que ce soit jouable ou lisible. **Chacun est déclaré, porte
un identifiant, et nomme l'endroit où on le rencontre.**

C'est la liste tenue dans `contenu.js`, sous `notes.groupes`, et c'est
`contrat.js` qui refuse d'en laisser passer un incomplet.

| id | où on le rencontre | ce qu'on avoue |
|---|---|---|
| `gravite-vaisseau` | salon | La gravité du salon est magique : en orbite, on devrait flotter. |
| `temps-accelere` | réglage du temps | Le temps est accéléré. Le premier cran du réglage est le temps réel. |
| `taille-sondes` | réglages | Les sondes sont grossies pour exister à l'écran. |
| `moteur-1g` | télescope | Le moteur à un g est accordé. Personne ne sait le construire. |
| `texture-radio` | spectre | La texture du disque est un effet d'apparence, pas un transfert radiatif. |
| `quadrillage-recul` | recul | Rien ne quadrille l'espace. Ce repère n'existe que pendant le mouvement. |
| `carte-etoiles` | arrivée du voyage | C'est une reconstruction, pas une vue. |
| `decor-personnages` | salon | Le vaisseau et les gens sont dessinés, pas mesurés. |
| `fond-ciel` | partout | Le fond est faux, sa déformation est juste. |

---

## Ce que le contrat exige d'un compromis

`contrat.js` refuse, en code 1, tout compromis déclaré qui :

- n'a pas d'**identifiant** stable, ou en partage un avec un autre ;
- existe dans une langue et pas dans l'autre ;
- n'a pas d'**aveu court** dans les deux langues ;
- a un aveu de plus de **200 signes** — au-delà il ne se pose plus à côté de la
  chose, et l'on retombe dans le panneau qu'on voulait quitter ;
- ne dit pas **où** on le rencontre, ou nomme un endroit qui n'existe pas ;
- nomme un endroit **différent** selon la langue — l'aveu se poserait alors à
  deux endroits, et l'un des deux serait faux.

Le plancher `compromisDeclares` ne descend jamais. Un compromis ne peut donc pas
disparaître en silence — ce qui est exactement ce qu'un compromis gênant
aimerait faire.

---

## Ce qui reste à faire

**La forme de l'aveu sur place.** Le mécanisme existe : chaque compromis sait
où il se rencontre. Ce qui manque, c'est le signe qu'on pose là-bas — assez
présent pour qu'on le voie, assez discret pour ne pas hacher la contemplation.

Une piste, et c'est la même que le bouton « d'où ça sort ? » qui existe déjà et
que les gens comprennent : un signe sobre qu'on peut ignorer, et qui répond si
on le presse.

**Ce n'est pas une question de calcul.** C'est un choix d'œil, et il passera par
une séance `?juge` avec des variantes comparables en direct.

---

## Ce qui ne se simule pas du tout, et pourquoi

La gravitation se simule entièrement. La physique des matériaux — l'instant d'un
impact, les ondes de choc, la fusion — ne se simule pas, ni ici ni ailleurs sans
grappe de calcul.

On sait donc faire **l'avant et l'après** d'une collision, jamais son instant.
Toute idée future qui demanderait l'instant est à écarter d'emblée, ou à
reformuler autour de ce qu'on sait faire.
