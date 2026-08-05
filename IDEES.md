# Carnet

L'archive des idées, rangée par thème. Pour savoir **quoi prendre ensuite**,
voir `CHANTIERS.md` — liste courte et ordonnée. Ici, c'est le pourquoi.

Réorganisé le 5 août 2026 : le fichier avait grossi par ajouts successifs
jusqu'à n'être qu'une pile chronologique. Rien n'a été supprimé.



---

# Les principes


## Le parti pris, dit une bonne fois

Hugo, en résumé : *« C'est un jeu pour jouer à l'astronome, et sans limite. On
est des astronomes mais on fait l'expérience des jumeaux parce qu'on est des
ouf. On n'a pas de règle, on est dans une simulation — mais la simulation
tourne avec les vraies lois, et on peut l'accélérer, la ralentir, la vivre. »*

C'est la ligne directrice du projet, et elle tranche une question qui revient
sans cesse : **on ne simplifie jamais la physique, on donne la manette.** Un
site de vulgarisation raconte ; ici on fait l'expérience, y compris celles que
personne ne pourra jamais faire. La liberté porte sur le temps, l'échelle et le
point de vue — jamais sur les équations.

### Le leitmotiv

Et le mot d'ordre, dans les termes d'Hugo : *« C'est avant tout un outil
pédagogique. On peut aller jusqu'à expliquer l'équation du trou noir. C'est un
peu notre effet : on est une simulation, on explique, on dit — ce n'est pas
n'importe quoi que vous voyez, c'est un vrai trou noir, comme si vous y
étiez. »*

**Public visé : de 6 à 160 ans.** La borne basse n'est pas affaire de niveau —
le mode découverte ne suppose rien, pas même la notion de référentiel. C'est
affaire de bon sens : à trois ans on ne regarde pas un écran, on regarde
ailleurs, et c'est très bien. La borne haute est fixée au jugé, et on la
relèvera si quelqu'un se plaint.

Étant entendu que ces 160 ans s'entendent **en temps propre**. Si vous avez
séjourné près de Sagittarius A*, comptez large : à trois rayons de
Schwarzschild, votre horloge tourne à 71 % de la nôtre, et vous avez donc droit
à un supplément que nous honorerons sans discuter.

Ce n'est pas un slogan, c'est un critère de tri. Toute fonctionnalité doit
passer ce test : **est-ce qu'elle aide à comprendre, et est-ce qu'on peut
montrer d'où elle sort ?** Le jeu, les tenues, la monnaie, le vaisseau sont des
moyens ; si l'un d'eux se met à concurrencer la compréhension, c'est lui qui
cède.

Et ça décide aussi de ce qu'on refuse. Une belle image qu'on ne peut pas
justifier vaut moins qu'une image plus modeste qu'on peut démonter devant le
visiteur. C'est déjà pour ça que le banc d'essai existe, que chaque affirmation
porte ses sources, et qu'on avoue la seule chose qu'on triche — la pesanteur du
salon.


## La baie est honnête, la surcouche est déclarée

C'est le principe qui se dégage de trois idées d'Hugo arrivées séparément — le
quadrillage du dézoom, la vitre en réalité augmentée, et le refus des fausses
étoiles. Elles disent toutes la même chose, et il vaut mieux l'écrire une fois :

> **Ce qu'on voit par la vitre est ce qu'on verrait.** Tout le reste — repères,
> noms, trajectoires, quadrillages — est un instrument posé par-dessus, qui se
> nomme comme tel et qu'on peut éteindre.

La force de cette règle est qu'elle autorise beaucoup au lieu d'interdire. On
peut afficher l'orbite d'une lune, nommer un anneau, tracer une trajectoire —
à condition que ce soit visiblement une surimpression et non une prétention
d'observation. C'est la différence entre une règle posée à côté d'un fossile et
un fossile repeint.

Un réglage unique commande donc l'ensemble : **surcouche visible ou non**. Et
la vue nue reste toujours atteignable, parce que c'est elle l'argument du site.


## Le vaisseau magique — la deuxième fiction, et la seule

Hugo pose le présupposé des voyages : **le vaisseau tient 1 g indéfiniment.** On
n'explique pas comment. On l'accorde, on le dit, et on n'en parle plus.

C'est le même contrat que pour la pesanteur du salon, et c'est ce qui rend
l'aveu solide : **une fiction déclarée, et tout ce qui en découle rigoureux.**
Le moteur est accordé ; les durées de trajet, elles, ne sont pas négociables —
elles sortent de la formule.

### Ce que le voyage doit montrer

Trois temps, et le deuxième est le plus beau :

1. On accélère à 1 g pendant la moitié du trajet. À bord, on a un poids normal.
2. **On retourne le vaisseau.** Le bas devient le haut, et l'on freine. C'est un
   moment réel, physiquement obligatoire, et personne ne le raconte jamais —
   il mérite sa seconde d'animation.
3. On décélère jusqu'à l'arrêt.

Avec le chronomètre qui donne les deux durées côte à côte : celle vécue à bord
et celle écoulée au loin. Elles ne se ressemblent pas, et c'est tout le propos.

L'explication du calcul est **proposée, jamais imposée** — la règle vaut ici
comme partout : un bouton, pas un passage obligé.

### L'honnêteté qui rend la fiction acceptable

Accorder le moteur sans dire ce qu'il coûterait serait de la magie molle. Or le
site a déjà le chiffre, et il est vertigineux : à 1 g jusqu'au centre
galactique, le rapport de masses d'une fusée idéale atteint **e^20,47**, soit
de l'ordre de **780 000 tonnes de carburant par kilogramme arrivé** — et cela
en supposant une conversion parfaite en énergie, ce qu'aucune technologie
connue n'approche.

Le bon ton est donc : *on t'accorde le moteur, et voici pourquoi personne ne le
construira jamais.* La fiction assumée devient alors elle-même une leçon, au
lieu d'un trou dans le raisonnement.

### La carte

Voir où l'on se situe dans la Voie lactée pendant le trajet. Elle sert deux
choses à la fois : donner un repère au voyage, et préparer le dézoom vers la
galaxie déjà prévu. C'est le même moteur d'échelle logarithmique, et le même
quadrillage.


## Deux objets, pas un curseur ambigu

Hugo, sur le spin : *« qu'on puisse modifier la valeur, ou une fois dans le
télescope passer sur un trou noir modifiable et voir ce que ça change. »*

C'est mieux que l'arbitrage que je lui proposais, parce que ça règle le
problème au lieu de le trancher. Deux objets nommés, et non un réglage qui
brouille les deux :

- **Sagittarius A***. Ce qu'on mesure. Masse et distance connues à un pour cent
  près ; spin **inconnu**, et le dire. Les valeurs proposées sont des
  hypothèses déclarées.
- **Un trou noir d'étude**, atteint depuis le télescope. On y tourne tous les
  boutons — masse, spin, inclinaison, taille du disque — et l'on regarde ce que
  ça change. Il n'est plus Sagittarius A*, et l'interface le dit.

La distinction n'est pas cosmétique : elle sépare **ce qu'on sait** de **ce que
la physique autorise**. C'est exactement la frontière que le site défend
partout ailleurs, et elle méritait d'exister dans les commandes.

### Ce qui est fait

Le cadrage. Le réglage s'intitule désormais « Rotation — non mesurée », zéro
est présenté comme le **cas de référence** et non comme la vérité, et chaque
valeur porte le mot « hypothèse ». Présenter zéro par défaut laissait croire que
Sgr A* ne tourne pas — or aucun trou noir réel n'est immobile, ils naissent
d'étoiles qui tournaient. Nous ignorons seulement de combien.

### Ce qui reste

Le trou noir d'étude lui-même, dans le télescope, avec ses paramètres libres.
Et une réserve technique à ne pas oublier : en rotation, l'axe polaire est
singulier dans les coordonnées employées, d'où une couture fine. La corriger
demande de passer en coordonnées de Kerr-Schild, soit une réécriture du moteur.
Tant que ce n'est pas fait, le cas de référence reste le seul sans artefact —
ce qui justifie qu'il ouvre le site, mais ne le rend pas plus vrai.


## Discipline de branches — *à partir du 4 août 2026*

Dès que les amis reçoivent le lien, `main` cesse d'être un brouillon : c'est ce
que des gens utilisent. Hugo l'a posé au bon moment, et ça change la façon de
travailler.

**La règle :**

- `main` est en production. On n'y pousse que ce qui est fini et vérifié.
- `dev` est l'endroit où l'on travaille. Toute nouveauté y naît.
- On fusionne dans `main` quand ça marche, pas quand ça compile.

**Pourquoi ça compte ici en particulier.** Cette session a montré deux fois le
même piège : une modification de nuanceur qui casse la compilation tue tout le
bloc de script, et le symptôme est **muet** — la page se charge, le trou noir
s'affiche, et seule la moitié des fonctions manque. Sur un site que personne
n'utilise, on s'en aperçoit à l'essai suivant. Sur un site que dix personnes
ouvrent, on ne s'en aperçoit pas du tout.

**Le contrôle minimal avant toute fusion**, tiré de ces deux incidents : après
une modification de nuanceur ou de script, vérifier qu'une variable déclarée
*tard* dans le fichier existe encore. Si `salon` ou `$` a disparu, le bloc est
mort quelque part au-dessus.

`kerr` reste comme témoin de la branche d'exploration qui a servi au moteur de
Kerr. Elle n'a plus d'usage courant.


## Ce qui a marché comme méthode

À garder, parce que ça a trouvé cinq vrais bugs que la relecture n'aurait pas
vus :

- **Mesurer plutôt que regarder.** Le banc d'essai a trouvé l'ombre 55 % trop
  grande, la période du photon fausse d'un facteur √3, et l'orbite circulaire
  newtonienne au lieu de relativiste.
- **Un contrôle qui doit tomber juste par construction.** Kerr à spin nul *est*
  Schwarzschild : tout écart est un bug, sans discussion possible.
- **Isoler avant de corriger.** Remplacer le ciel par une fonction lisse a
  prouvé en un test que l'artefact venait de la trajectoire, pas du rendu.
- **Ne pas mettre de scotch.** La borne sur sin θ « pour éviter la singularité »
  *était* le bug. Quand un garde-fou masque un symptôme, il fausse souvent
  l'équation.
- **Séparer ce qui marche de ce qu'on explore.** `main` n'a jamais été cassé,
  tout le travail risqué vit sur `kerr`.


## Notes

- **Pas d'API dans le navigateur.** Une clé dans du JS statique est publique dès
  la première indexation. Si un jour on veut un vrai dialogue avec Lumen, il
  faudra un proxy (Cloudflare Worker) qui garde la clé.
- **`contenu.js` est la source de vérité.** Trois consommateurs le lisent :
  l'affichage, la génération audio, l'audit des sources. Un `id` ne se renomme
  pas sans régénérer la voix.
- **Ne jamais affirmer sans pouvoir montrer.** Quand une grandeur est calculable,
  un test exécutable vaut mieux qu'une citation.



---

# Le voyage et les échelles


## Deux vaisseaux, et le voyage comme mécanique

Idée d'Hugo, en trois morceaux qui n'ont pas du tout le même coût.

### Le morceau qui vaut le plus, et qui coûte le moins : voyager

Se déplacer ne serait pas une téléportation mais **un voyage**, poussé à 1 g,
avec un chronomètre annonçant la durée réelle. La coque tremble, l'astre
s'éloigne, et l'on arrive.

C'est la meilleure idée de l'ensemble parce qu'elle transforme **chaque
déplacement en leçon**, sans rien ajouter de pédagogique : la formule de la
fusée relativiste est déjà dans le site, et elle s'applique à n'importe quelle
distance.

Le fait qui rend la mécanique jouable, et que j'ai calculé ici — **à vérifier** :

$$\tau = \tfrac{4c}{g}\,\operatorname{arccosh}\!\left(\tfrac{gd}{4c^{2}}+1\right)$$

- du salon jusqu'à la distance d'observation des étoiles S (mille unités
  astronomiques, soit 0,016 année-lumière) : **environ trois mois** de temps
  propre ;
- jusqu'au système solaire (27 000 années-lumière) : **une vingtaine d'années**.

Le rapport est énorme alors que les distances vont de un à un million : c'est
la signature logarithmique de l'accélération constante, et c'est exactement ce
qu'il faut faire sentir. Les déplacements locaux coûtent des mois, les
interstellaires des décennies. La mécanique enseigne donc toute seule pourquoi
la galaxie est hors de portée.

### Le morceau structurant : deux vaisseaux

Un **vaisseau commun**, le lobby, en orbite autour de l'objet du moment,
partagé par tout le monde et honnête sur le temps. Et un **vaisseau personnel**
qu'on déplace où l'on veut, qui est son instance.

C'est la bonne réponse à une tension déjà écrite dans `OBJECTIFS.md` : le salon
doit être partagé et en temps réel, le simulateur personnel et permissif. Deux
vaisseaux au lieu d'un règlent la contradiction au lieu de la contourner.

**Mais le partage n'existe pas encore.** Les règles Firestore ne sont toujours
pas publiées, le panthéon tourne en mémoire locale. Tant que ce n'est pas fait,
« vaisseau commun » et « vaisseau personnel » désignent la même chose, et la
distinction ne se voit pas.

### Le morceau que je repousserais : la carte des vaisseaux

Voir où sont les autres sur une carte de l'univers est séduisant et c'est le
plus cher au bénéfice rendu : il faut l'état partagé, une carte à dix-sept
décades, et une position par joueur tenue à jour. Ça pose aussi une question
qu'on n'a pas eue jusqu'ici — afficher la position de quelqu'un, même sous un
pseudonyme composé, est une information sur lui.

Rien d'insurmontable, mais c'est la troisième étape, pas la première.

### L'ordre que je propose

1. **Le voyage** sur le vaisseau actuel : animation, chronomètre, distance
   choisie. Aucun partage requis, et ça donne immédiatement le dézoom vers les
   étoiles S que réclame la scène des orbites.
2. **Les règles Firestore**, qui débloquent tout le reste.
3. **La séparation des deux vaisseaux**, une fois qu'il y a vraiment quelque
   chose à partager.
4. **La carte**, si elle se justifie encore à ce moment-là.


## Le recul — comment la scène des étoiles doit vraiment se faire

Idée d'Hugo, et elle remplace celle que j'avais commencée : plutôt qu'une scène
séparée, **le vaisseau s'éloigne**. On voit le trou noir rétrécir par la baie
jusqu'à ce qu'il ne soit plus rien, et à ce moment-là les orbites des étoiles
apparaissent.

C'est bien meilleur, pour une raison qui n'est pas d'esthétique : **le disque
d'accrétion devient invisible à cette distance**, et c'est précisément le
propos. On ne voit plus le trou noir. On voit des étoiles tourner autour de
rien — et c'est comme ça qu'on l'a découvert, trente ans avant d'en avoir une
image.

Un changement d'échelle raconte donc l'argument tout seul, là où deux scènes
juxtaposées auraient demandé de l'expliquer.

### Ce que ça implique

- **Le recul est continu**, pas une coupure. On garde la baie, on garde le
  lieu, et la seule chose qui change est la distance. Il faut donc que le
  lanceur de géodésiques et la scène des orbites cohabitent dans la même image
  pendant la transition — le premier s'éteint quand l'astre passe sous le
  pixel, la seconde s'allume.
- **Le temps s'adapte à l'échelle.** À dix rayons on compte en minutes, à mille
  unités astronomiques en années. L'accélération doit suivre le recul, sinon
  l'un des deux est illisible.
- **Le module `etoiles.js` sur `dev` reste valable** pour le calcul des orbites
  — Kepler, les trois rotations, les tracés. C'est son mode d'affichage séparé
  qui tombe.

### Le rapport d'échelle, qui est le vrai obstacle

Le rayon de Schwarzschild vaut 1,3 × 10^10 m ; le demi-grand axe de S2 environ
1,5 × 10^14 m. Quatre décades. Un recul linéaire passerait l'essentiel du
trajet dans le vide : il faut une progression **logarithmique**, ce qui est
exactement le moteur de zoom décrit dans `OBJECTIFS.md` et jamais construit.
C'est l'occasion de le faire, et il resservira pour le dézoom vers la Voie
lactée.

### Le quadrillage — sans quoi le recul ne se voit pas

Hugo, en réponse au recul logarithmique : *« on ne va pas se rendre compte
qu'on dézoome à ce point, mets un petit quadrillage temporaire. »*

C'est le problème central de toute visualisation d'échelle, et il est plus
sérieux qu'il n'en a l'air : **dans le vide, rien ne prouve qu'on bouge.** Pas
de parallaxe, pas de bord qui défile. Quatre décades de recul ressemblent alors
à un écran figé qui s'assombrit — et le spectateur conclut que ça a planté,
pas qu'il s'éloigne. C'est ce qui fait rater la plupart des animations de ce
genre.

**La solution est un étalon qui défile.** Un quadrillage dans le plan de
l'orbite, dont la maille vaut une puissance de dix ronde, avec sa valeur
écrite dessus.

Trois détails qui font toute la différence, et qu'il ne faut pas rater :

- **Il se renumérote en franchissant chaque décade.** La maille reste de la
  même taille à l'écran, mais son étiquette passe de « 100 rayons » à « 1 000 »
  puis à « 10 000 ». C'est ce saut d'étiquette, répété quatre fois, qui fait
  *sentir* la distance — bien plus qu'un compteur continu qu'on ne lit pas.
- **Il n'apparaît que pendant le mouvement**, et s'efface à l'arrivée. C'est un
  instrument de mesure, pas un décor : une fois qu'on est là, il n'a plus rien
  à dire et il encombrerait les orbites.
- **Il est déclaré comme une fiction.** Rien ne quadrille l'espace. Le site
  affirme partout que ce qu'on voit est calculé, donc cet ajout-là doit être
  nommé pour ce qu'il est — un instrument posé sur l'image, comme la règle
  qu'on met à côté d'un fossile sur une photographie.

Et l'arrivée dit le reste toute seule : le trou noir a disparu sous le pixel,
les orbites emplissent l'écran, et il ne reste que des étoiles tournant autour
de rien. C'est exactement ce qu'ont vu les astronomes pendant trente ans.

### Aucune étoile inventée

Hugo, sans détour : *« je n'aimerais pas trop que tu mettes des fausses
étoiles. »* C'est la règle du site et elle ne souffre pas d'exception ici.

**On ne montre que les étoiles dont l'orbite est publiée**, avec leur
référence. S'il n'y en a que six ou huit bien contraintes, on en montre six ou
huit. Le champ paraîtra clairsemé, et ce sera juste : ce sont exactement celles
qu'on sait suivre. La rareté fait partie du propos — elle dit le prix qu'a
coûté cette mesure.

Ce qui serait tentant et qu'il faut refuser : peupler l'arrière-plan de points
« plausibles » pour faire riche. Ils ne prouveraient rien, ils ne seraient
sourçables nulle part, et un seul lecteur averti qui les compte aurait raison
de douter du reste.

Le champ d'étoiles du fond, dans le rendu actuel, est déjà une texture
procédurale — c'est admis dans la fiche « ce qui n'est pas vrai ». Il ne doit
pas servir d'alibi : décorer un fond lointain n'est pas prétendre suivre un
astre nommé sur une orbite mesurée.

C'est d'ailleurs pourquoi le quadrillage est la bonne réponse à l'échelle. Il
ne fait semblant de rien : il se déclare comme un instrument, alors qu'une
étoile ajoutée se ferait passer pour une observation.


## Les étoiles S — *la preuve, et le meilleur reste à faire*

Idée d'Hugo : se placer en vue extérieure, voir les étoiles référencées tourner
autour de Sagittarius A* en accéléré, et comprendre qu'on détecte un trou noir
**parce qu'il attire ce qui l'entoure**.

C'est la meilleure idée qui reste au carnet, et il faut dire pourquoi : le site
montre aujourd'hui à quoi ressemble un trou noir, jamais **comment on sait
qu'il est là**. Or l'image de 2022 est arrivée après trente ans de mesures
d'orbites. La preuve est venue avant la photo.

### Le raisonnement, qui tient en trois lignes

On suit une étoile pendant une révolution. On mesure son demi-grand axe et sa
période. La troisième loi de Kepler donne la masse au foyer. On trouve quatre
millions de soleils dans un volume plus petit que l'orbite — et rien de connu
ne peut être aussi dense sans s'effondrer.

C'est tout. Aucune image n'est nécessaire, et c'est ce qui a valu le prix Nobel
de physique 2020 à Genzel et Ghez.

### Ce que la scène doit montrer

**S2 d'abord**, la mieux mesurée : environ seize ans de période, une excentricité
proche de 0,88, et un périastre à quelque cent vingt unités astronomiques — soit
à peu près la taille de la bulle du système solaire. Le rapprochement est déjà
noté dans `OBJECTIFS.md` : la même distance se retrouve aux deux bouts du
voyage.

À ce périastre elle file à près de **2,5 % de la vitesse de la lumière**, ce qui
est visible à l'œil quand on accélère : elle rampe pendant des années puis fouette
en quelques mois. C'est la deuxième loi de Kepler qui devient une évidence.

**Puis l'essaim.** Une dizaine d'étoiles aux orbites inclinées dans tous les
sens, sans plan commun — ce désordre est lui-même une information : elles ne
sont pas nées là.

**Et deux effets relativistes réellement mesurés**, qui font le lien avec le
reste du site : le décalage vers le rouge gravitationnel au périastre de 2018,
et la précession du périastre — l'orbite ne se referme pas sur elle-même,
exactement comme celle de Mercure mais bien plus fort.

### Avant de construire

Toutes les valeurs ci-dessus sont de mémoire et doivent être **re-sourcées une
par une** : éléments orbitaux de chaque étoile retenue, barres d'erreur, année
de mesure. Les clés `gravity2021`, `gravity2018` et `nobel2020` existent déjà
au registre ; il en faudra d'autres.

Attention en particulier aux étoiles à très courte période annoncées ces
dernières années : certaines sont contestées, et le site ne doit pas trancher un
débat en cours. Une seule règle, la même que partout — ce dont on n'est pas sûr
se déclare, ou ne se met pas.

### Le coût, honnêtement

Plus faible qu'il n'y paraît. Les orbites sont képlériennes à cette distance :
des ellipses calculées depuis leurs éléments, pas des géodésiques intégrées. La
précession relativiste s'ajoute comme une lente rotation du grand axe. Il faut
une vue extérieure, un curseur de temps en années, et de quoi désigner une
étoile pour lire ses chiffres.

**C'est la tête d'affiche de la version suivante**, pas de la bêta : elle mérite
d'être faite proprement, et rien ne doit bouger pendant que les amis testent.


## Ce qu'on sait vraiment faire — le contrepoids du vaisseau magique

Idée d'Hugo : montrer les vraies sondes, leurs vitesses réelles, et l'assistance
gravitationnelle. À rattacher au **premier voyage**, au moment précis où l'on
vient d'accepter la fiction du moteur à 1 g.

C'est le bon endroit. On vient de dire « on t'accorde le moteur » ; on montre
alors ce qu'on sait faire sans lui, et l'aveu prend tout son poids.

### La comparaison qui porte

À vérifier — calcul de ma part : les sondes qui quittent le système solaire
filent autour de **17 kilomètres par seconde**. À cette vitesse, les
27 000 années-lumière jusqu'au centre galactique demanderaient de l'ordre de
**cinq cents millions d'années**.

Le vaisseau magique met dix-neuf ans et dix mois. Le rapport est de vingt-cinq
millions. Aucune phrase ne dit mieux ce que « hors d'atteinte » signifie.

### L'assistance gravitationnelle, et le contresens qu'elle permet de lever

C'est le morceau le plus pédagogique, parce que presque tout le monde s'en fait
une idée fausse. Une sonde ne « gagne » pas d'énergie en frôlant une planète :
vue de la planète, elle repart exactement aussi vite qu'elle est arrivée. C'est
vu **du Soleil** qu'elle a changé de vitesse — elle a échangé de la quantité de
mouvement avec la planète, qui a ralenti d'une quantité rigoureusement
inobservable.

Rien n'est créé. On emprunte, à quelque chose d'assez gros pour ne pas s'en
apercevoir. Et ça se démontre en une figure : la même vitesse dans un repère,
une autre dans le second.

### Ce qu'il faudrait avant de le construire

Tout est à sourcer : vitesses des sondes, dates, enchaînements de survols,
gains obtenus. Rien de tout cela ne doit être écrit de mémoire — la leçon de la
formule fausse d'aujourd'hui vaut ici aussi.

Et une réserve de portée : simuler des trajectoires interplanétaires réelles
est un autre métier que ce que fait le site. Le raisonnable est de **montrer et
d'expliquer** des trajectoires connues, pas de proposer d'en calculer.

### Où ça se place

Dans l'explication du premier voyage, en regard du chronomètre. D'un côté ce
que coûterait le trajet à 1 g ; de l'autre ce qu'il coûterait avec ce qu'on a
réellement lancé. Deux colonnes, et la leçon se lit sans être écrite.


## Le système solaire, planète par planète — *le long terme*

Hugo : aller au système solaire, se mettre en orbite autour de chaque planète,
et lire ce qu'il y a à voir — les anneaux, les lunes, leurs trajectoires.

### Ce qui est déjà en place sans qu'on l'ait fait exprès

Le **contrat de destination** d'`OBJECTIFS.md` dit qu'une destination est une
donnée et non du code : une scène avec sa plage d'échelles, ses fiches et son
rendu. Jupiter est donc, architecturalement, la même chose que Sagittarius A*.
Et le **voyage à 1 g** donne le moyen d'y aller en disant ce qu'il en coûte.

### Ce qui coûte vraiment

Pas le code — le **contenu**. Chaque destination réclame ses faits sourcés en
trois niveaux, et c'est là que part le temps. Une planète bâclée vaut moins que
pas de planète : elle transformerait un site rigoureux en encyclopédie tiède.

Donc peu de destinations, très bien faites. Jupiter et Saturne d'abord, qui
ont de quoi remplir une visite — et qui donnent chacune une leçon que le trou
noir ne donne pas : la mécanique des résonances pour les lunes de l'une, la
dynamique des anneaux pour l'autre.

### La personnalisation du vaisseau

Décorer, meubler, en avoir plusieurs. C'est cohérent avec la garde-robe déjà
prévue et avec la règle qui la gouverne — **on ne débloque qu'en comprenant**.
Un objet rapporté d'une destination visitée est un souvenir de voyage, pas un
achat : il dit où l'on est allé.

Réserve technique : tout le mobilier est calculé, donc chaque élément est du
code à écrire. Ça plaide pour un petit catalogue de pièces combinables plutôt
qu'un long catalogue d'objets uniques.

### L'ordre, encore

Rien de tout cela avant le voyage et le dézoom vers les étoiles S. Ce sont eux
qui prouvent que le changement d'échelle fonctionne — et si ça ne fonctionne
pas, le reste ne tient pas debout.



---

# Apprendre, et le prouver


## Le carnet d'apprentissage, et le questionnaire qui n'est pas une note

Idée d'Hugo : une barre de progression de ce qu'on a appris, un relevé de ce
qu'on a lu, un résumé en quelques points, et un questionnaire à choix multiple
sur les notions vues — avec, en cas d'erreur, de quoi aller comprendre.

### Le substrat existe déjà

C'est ce qui rend l'idée peu coûteuse. `acquis` retient les missions
comprises ; chaque affirmation porte ses clés de sources ; chaque réplique a un
identifiant. « Ce que tu as appris » et « où le relire » sont donc déjà des
données — il manque leur présentation.

Ce qu'il faut ajouter : retenir aussi **ce qui a été lu**, pas seulement ce qui
a été validé. Une fiche ouverte, une justification dépliée, un niveau consulté.
C'est ce relevé qui permet de bâtir un questionnaire sur ce qu'on a vu plutôt
que sur un catalogue général.

### Le questionnaire diagnostique, il ne note pas

C'est le point où l'on peut tout gâcher. Un questionnaire qui donne une note
transforme la compréhension en performance, et l'on se met à jouer contre le
test au lieu d'apprendre. Or la règle du site est qu'**on ne débloque qu'en
comprenant**.

Donc : pas de score, pas d'échec, pas de pourcentage. Une erreur ne dit pas
« tu as faux » mais **« voici ce qui n'est pas encore clair, et voilà par où le
prendre »**. C'est un instrument de diagnostic, comme le banc d'essai l'est
pour le calcul.

Et il ne porte que sur ce que la personne a réellement vu. Interroger sur une
fiche jamais ouverte n'apprend rien à personne.

### En cas d'erreur : une porte, pas une correction

C'est la meilleure part de l'idée, et c'est le prolongement naturel du bouton
« d'où ça sort ? ». Se tromper doit ouvrir quelque chose : le passage exact de
la fiche, la justification, et une lecture pour aller plus loin.

### La distinction qui commande la traduction

Hugo demande que les références suivent la langue. Il faut ici séparer deux
objets qu'on confond souvent :

- **La source** prouve. C'est un article, il a un titre, une revue, un
  identifiant. Elle **ne se traduit pas** — Gillessen 2017 s'appelle Gillessen
  2017 en toutes langues, et la littérature primaire est presque entièrement
  en anglais. Prétendre l'inverse serait mentir sur ce qui existe.
- **La lecture pour aller plus loin** explique. Une page d'encyclopédie, un
  cours, une vidéo. Celle-là **doit** suivre la langue, et c'est elle qu'on
  propose après une erreur.

Chaque notion porterait donc deux champs distincts : sa source, commune à
toutes les langues, et son renvoi de lecture, propre à chacune. Confondre les
deux donnerait soit des sources traduites qui n'existent pas, soit des
explications en anglais devant un lecteur francophone qui vient justement de
buter.

Réserve à porter : un renvoi vers un site tiers peut mourir. Il faut le dater,
et accepter qu'un lien cassé vaut mieux qu'une explication inventée.

### Le résumé de fin

Quelques points, écrits comme la personne les dirait — pas comme un bulletin.
« Tu sais maintenant pourquoi rien ne franchit l'horizon vu de loin. » C'est le
leitmotiv appliqué à la sortie : on ressort grandi, donc on doit pouvoir dire
de combien.


## Le carnet de bord temporel — la meilleure mécanique proposée

Idée d'Hugo : chaque joueur accumule son **décalage propre** avec la Terre.
Tout ce qu'il fait y contribue — le temps passé en orbite, les voyages à 1 g,
les allers-retours. Le décalage persiste, et il peut en consulter le détail :
chaque entrée, sa formule, ce qu'elle a coûté.

### Pourquoi c'est la meilleure

Le paradoxe des jumeaux cesse d'être un chapitre qu'on lit pour devenir
**quelque chose qui vous est arrivé**. On ne comprend pas la dilatation du
temps en la lisant ; on la comprend en découvrant qu'on a soi-même trois cents
ans de retard et en cherchant d'où ils viennent.

Elle unifie aussi les deux relativités dans un seul nombre, ce qui est
exactement la formulation profonde déjà notée plus haut : **le temps propre est
la longueur de la ligne d'univers**. Rester au fond d'un puits de gravité et
partir vite sont deux façons de raccourcir le même chemin.

Et elle est **auditable**, ce qui la rend cohérente avec tout le reste du site :
chaque entrée porte sa formule et son calcul. C'est le bouton « d'où ça sort ? »
appliqué à la progression du joueur.

### La forme : un registre, pas une simulation

Chaque action ajoute une ligne — la date, ce qui a été fait, la formule
employée, le décalage produit. On n'intègre rien en continu, on **enregistre**.
C'est plus simple, c'est vérifiable, et ça se relit.

Deux régimes s'y côtoient, et leur écart est en soi une leçon :

- **Rester en orbite.** À seize rayons, l'horloge tourne à √(1 − 1/16) = 0,968
  de celle du loin, soit 3,2 % de moins. Une heure de jeu coûte deux minutes.
- **Voyager à 1 g.** L'aller au système solaire coûte une vingtaine d'années
  vécues contre vingt-sept mille écoulées.

Le registre montre donc de lui-même que **le voyage écrase le séjour** — et
qu'il faut descendre très près de l'horizon pour que rester devienne
comparable. Personne n'a besoin de l'expliquer : les deux colonnes le disent.

### Hors connexion, le temps se fige — *tranché*

Hugo penchait pour que le décalage continue de courir même déconnecté, puis a
retenu l'inverse. La raison vient de ses propres règles.

Faire courir le compteur en l'absence du joueur reviendrait à **récompenser
l'attente** : il suffirait de laisser son vaisseau en orbite basse pour
accumuler. Or la règle posée depuis le début est qu'on ne débloque qu'en
comprenant. Un décalage qui grandit tout seul est le contraire.

Le registre enregistre donc **ce qu'on a vécu**, et se fige quand on part. Ce
qui se défend aussi en fiction : le vaisseau est amarré, on n'y est pas.

### Le lobby comme lieu hors du temps

Hugo l'a bien vu : si chacun a sa temporalité, un lieu commun devient
impossible — sauf à le déclarer magique. C'est cohérent avec la seule autre
triche du site, la pesanteur du salon, et il faut le dire de la même façon,
franchement et avec humour.

Le lobby est donc l'endroit où toutes les lignes d'univers se rejoignent, ce
qui n'a aucun sens physique et qu'on assume. Le prix à payer est faible et le
gain est net : on peut s'y retrouver et comparer ses registres.

### Ce que ça demande

Peu de choses, en réalité : une liste d'entrées dans le profil, une formule par
type d'action, et un écran qui les affiche. La persistance existe déjà en
mémoire locale, et passera au partagé quand Firestore le sera.

C'est donc une mécanique à fort rendement — beaucoup de sens pédagogique pour
peu de code. Elle mérite de venir juste après le voyage, dont elle est la
conséquence naturelle.


## Un vrai cours sur les jumeaux, avec le diagramme de Minkowski — *pour plus tard*

Demande d'Hugo, et son diagnostic est le bon : ce n'est pas si compliqué, et le
diagramme d'espace-temps est ce qui le rend évident.

### La formulation à viser, et pourquoi elle bat « c'est le changement de référentiel »

L'explication courante — la situation n'est pas symétrique parce que l'un des
deux change de référentiel — est juste, et c'est par là qu'il faut entrer. Mais
elle décrit le **mécanisme**, pas la cause, et elle laisse croire que
l'accélération « use » les horloges. Elle ne les use pas.

La formulation qui porte tout :

> **Le temps propre est la longueur de votre ligne d'univers.** Deux jumeaux
> qui se séparent et se retrouvent ont parcouru deux chemins différents entre
> les deux mêmes événements. Ils n'ont pas vécu des durées différentes parce
> que l'un a subi quelque chose — mais parce que leurs chemins n'avaient pas la
> même longueur.

Et la bizarrerie qui fait tout le sel, à énoncer franchement : dans
l'espace-temps, **la ligne droite est la plus LONGUE**. L'inverse exact de la
géométrie du plan. Le jumeau qui ne bouge pas suit la droite, donc vieillit le
plus ; celui qui part fait un détour, et tout détour raccourcit.

$$\tau = \int \sqrt{1 - v^2/c^2}\;\mathrm{d}t$$

Le facteur sous la racine est toujours inférieur à 1 dès qu'on bouge. C'est
tout le calcul. Il tient en une ligne, et le diagramme le montre à l'œil.

### Ce que le diagramme doit montrer, dans cet ordre

1. Les deux lignes d'univers, et leurs longueurs qu'on peut lire.
2. Les **lignes de simultanéité** du voyageur — inclinées, et qui basculent
   d'un coup au demi-tour. C'est là que se voit le fameux « saut » : pendant le
   virage, l'instant que le voyageur appelle « maintenant, chez mon frère »
   fait un bond de plusieurs années. Rien n'est arrivé au frère ; c'est la
   découpe du temps qui a changé.
3. Les signaux lumineux échangés, qui prouvent qu'aucun des deux ne triche.

### La variante qui tue l'objection

Il faut la donner, parce qu'elle balaie l'idée que l'accélération serait la
cause. On remplace le voyageur par **deux voyageurs qui se croisent** : l'un
s'éloigne, l'autre revient, et au croisement le second recopie l'heure du
premier. Personne n'accélère, aucun référentiel n'est quitté — et l'écart final
est **exactement le même**. Ce qui compte est le chemin, pas la secousse.

### Le raccord avec la relativité générale, qui est la même phrase

C'est là que le site prend l'avantage sur un cours classique : les deux moitiés
sont déjà simulées, et la formulation les unifie sans effort.

> Le temps propre reste la longueur de la ligne d'univers. La gravité courbe
> l'espace-temps, donc elle courbe les chemins — et les longueurs changent.

Autour de Sgr A*, pour qui se maintient à distance fixe :
$\mathrm{d}\tau/\mathrm{d}t = \sqrt{1 - r_s/r}$. Le site mesure déjà **91,3 %**
à $r = 9$ et **72,9 %** à $r = 3{,}2$ — ces chiffres sont vérifiés, ils peuvent
servir de fin de cours.

**Le piège à traiter, et qui vaut le niveau astrophysicien.** En espace plat,
celui qui ne fait rien vieillit le plus. On aimerait conclure que la chute libre
maximise toujours le temps propre — c'est faux en général. La géodésique ne le
maximise que **localement**. Près d'un trou noir, celui qui se maintient sur
place avec ses moteurs vieillit **plus** que celui qui orbite au même rayon :
$\sqrt{1 - r_s/r} > \sqrt{1 - 3M/r}$. Le « paresseux gagne » de la relativité
restreinte ne se transpose pas tel quel, et le dire est plus honnête que de
laisser l'analogie filer.

### Ce qu'il faudra

Le diagramme calculé et manipulable — on tire le point de demi-tour, les
longueurs et l'écart final se recalculent. Trois niveaux comme partout. Et
aucune valeur numérique sans source, y compris celles qu'on croit connaître.

---


## Mesurer soi-même l'expansion de l'univers — *pour plus tard*

Idée d'Hugo. Elle mérite d'être notée en détail, parce que c'est la seule
proposée jusqu'ici où **le geste du joueur est exactement celui de
l'astronome** : on ne regarde pas une démonstration, on fait la mesure.

### Ce qui la rend forte

On ne reconnaît pas l'hydrogène à une raie, mais à un **motif** — un peigne de
raies aux écarts fixes. C'est ce qui rend la mesure irréfutable et c'est aussi
ce qui en fait une bonne mécanique de jeu : on fait glisser un peigne de
référence sur le spectre d'une galaxie jusqu'à ce que tout s'emboîte d'un coup.
Le déclic est immédiat, et il n'y a rien à croire sur parole. Un seul trait
déplacé ne prouverait rien ; six traits qui tombent juste ensemble ne laissent
aucune échappatoire.

### Le déroulé

1. On mesure le décalage : $z = (\lambda_\text{obs} - \lambda_\text{repos})/\lambda_\text{repos}$.
2. On en tire une vitesse d'éloignement, $v \simeq cz$ tant que $z$ reste petit.
3. On lit la distance sur une autre mesure — céphéides, supernovæ de type Ia.
4. On répète sur une dizaine de galaxies, et **le nuage de points s'aligne**.
   La pente est $H_0$. C'est la découverte de 1929, refaite à la main.

Raies de repos utiles : Hα 656,28 nm, Hβ 486,13 nm, Hγ 434,05 nm, et le doublet
K–H du calcium ionisé à 393,37 / 396,85 nm — en pratique le plus visible dans
le spectre d'une galaxie.

### Le point délicat, à ne pas rater

La formulation courante « les galaxies s'éloignent » est un raccourci, et
l'intuition d'Hugo — *c'est l'espace entre nous qui se dilate* — est la bonne.
Ce n'est pas un effet Doppler : rien ne traverse l'espace, c'est l'espace qui
s'étire pendant le trajet du photon. La distinction n'est pas un détail
pédant : elle est ce qui rend possible le fait suivant.

**Au-delà d'une certaine distance, la vitesse d'éloignement dépasse $c$ — et on
voit ces galaxies quand même.** Rien ne l'interdit, puisque aucune ne se déplace
plus vite que la lumière *dans* l'espace. C'est le genre de fait qui vaut à lui
seul une mission, et il tombe naturellement à la fin de celle-ci.

### Deux prolongements gratuits

- **La tension de Hubble.** Les deux méthodes ne donnent pas le même $H_0$ —
  environ 73 par l'échelle des distances, environ 67 par le fond diffus. L'écart
  résiste depuis des années. C'est une occasion rare de montrer une science
  **en cours**, plutôt qu'un savoir clos : le joueur qui vient de mesurer sa
  propre pente comprend immédiatement de quoi on parle.
- **Le lien avec le reste du site.** Le décalage gravitationnel est déjà simulé
  autour de Sgr A*. Trois décalages vers le rouge de natures différentes —
  gravitationnel, Doppler, cosmologique — et les distinguer est un excellent
  exercice pour le niveau astrophysicien.

### Ce qu'il faudra avant de construire

Rien n'entre sans sources : longueurs d'onde de repos, valeurs de $H_0$ et leurs
barres d'erreur, distances des galaxies retenues. Et les spectres affichés
doivent être **calculés**, comme tout le reste — pas des images d'archive.



---

# L'interface et la forme


## L'interface — *le prochain gros morceau*

Hugo, après avoir tout parcouru : *« Il y a une dimension un peu luxe, un peu
classe — et je ne la retrouve pas dans les boutons. L'interface, je ne la
trouve pas très jolie, on peut faire mieux. »*

Le diagnostic est juste et il est précis : le **rendu** a cette tenue, le
**mobilier de l'interface** ne l'a pas. Une barre de huit boutons rectangulaires
tous identiques, un panneau de réglages en grilles, des cartes de menu — c'est
fonctionnel et ça n'a aucun point de vue. Le contraste avec l'image est ce qui
le rend visible.

Trois contraintes qu'il a posées, dans ses mots :

- **Peu de mouvement.** *« Je ne pense pas à des trucs qui flottent. »* La
  retenue fait la classe ; l'animation en enlève. Ce qui bouge doit bouger
  parce que la simulation bouge, pas pour décorer.
- **Un peu quand même.** *« Peut-être un truc qui bouge. »* Donc du mouvement
  motivé, rare, et lent.
- **Ça reste une simulation sérieuse.** Le cinéma est un assaisonnement.

### Le chemin initiatique — l'idée forte

*« Peut-être un parcours initiatique à la Duolingo. Du chemin à suivre pour
comprendre le trou noir. Prends-moi par la main : on va commencer par là, on va
comprendre des choses. Et si tu veux tu peux faire autre chose, mais viens, suis
l'aventure principale. »*

C'est la meilleure réponse au problème réel du site : **on ne sait pas où on en
est ni où l'on va.** Huit missions existent, la progression est mémorisée, mais
rien ne se voit — le menu est une grille de quatre cartes sans ordre apparent.

Ce qu'il faudrait, et qui n'existe pas :

- **Un tracé visible**, avec les étapes franchies derrière et la suivante en
  avant. Le geste est celui de Duolingo, mais la forme doit venir d'ici : une
  orbite qu'on remonte vers l'astre, chaque palier à un rayon plus faible. La
  progression devient alors une descente, ce qui est vrai à la lettre.
- **Une étape suivante toujours désignée.** Pas un menu où l'on choisit : un
  endroit où l'on va, avec une porte de côté pour qui veut fouiller.
- **Ce qui est compris reste acquis et se voit.** La mémoire existe déjà
  (`acquis`), elle n'est affichée que par huit pastilles minuscules.

Cohérent avec la règle déjà posée — *on ne débloque qu'en comprenant* — et avec
le leitmotiv : on ressort grandi, donc on doit pouvoir mesurer de combien.

### Ce que je ferais, dans l'ordre

1. **La barre du bas.** Huit boutons égaux, dont trois seulement servent au
   premier passage. Hiérarchiser : ce qui agit sur la scène, ce qui change de
   lieu, ce qui règle. Le reste passe derrière un repli.
2. **Le tracé de progression**, en remplacement du menu de cartes.
3. **Les panneaux** (réglages, spectre, temps) : même vocabulaire que les écrans
   du vaisseau, qui eux ont déjà la bonne tenue — filets fins, capitales
   espacées, chiffres en chasse fixe.

Point de méthode : l'interface se juge à l'œil, donc elle ne se délègue pas à
un agent qui ne voit pas le résultat. C'est la leçon du vaisseau.


## Les écrans de bord — la vraie correction, pour plus tard

Hugo, sur iPhone : *« les écrans, ils ne sont pas droits quand tu les regardes
de côté. »* Constat juste, et la cause est structurelle.

Les écrans sont dessinés sur une **toile à deux dimensions** posée par-dessus le
rendu. Elle ne sait faire que des transformations **affines**, qui envoient un
rectangle sur un parallélogramme. Or un panneau vu sous un angle rasant demande
une vraie **perspective** : le bord lointain doit rétrécir. Le contour, lui, est
tracé à partir des quatre coins réellement projetés — il est donc un trapèze
exact. Cadre juste, contenu faux : c'est ce décalage qu'on voit.

**Ce qui est en place** est un contournement honnête plutôt qu'un correctif :
l'écran s'estompe avec l'angle et disparaît au-delà de soixante-dix degrés hors
axe. Ce n'est pas un mensonge — une dalle réelle se délave exactement comme ça.
Mesuré : 29° de face donne 1,00 ; 74° depuis la fosse donne 0,00, ce qui est
précisément la position d'où le défaut se voyait.

**Les deux vraies corrections**, par ordre de coût :

1. **Le découpage en bandes.** On dessine le contenu une fois dans une toile
   hors écran, puis on le reporte en vingt à trente bandes verticales, chacune
   avec sa propre affine interpolée entre les bords haut et bas. C'est
   l'astuce classique, et l'œil ne distingue plus la perspective vraie au-delà
   d'une vingtaine de bandes. Demande de pouvoir rediriger le contexte de
   dessin, donc une petite restructuration de `ecran()`.
2. **Passer les écrans en géométrie.** Le contenu devient une texture appliquée
   sur un quadrilatère dessiné dans la même passe que le vaisseau. La
   perspective devient exacte et gratuite, les écrans sont enfin occultés par
   ce qui passe devant, et le calque à deux dimensions disparaît. C'est la
   solution juste, et elle supprime aussi le fait que rien ne les occulte
   aujourd'hui.

La seconde est la bonne. Elle attend que le vaisseau cesse de bouger.


## De la musique — *pour plus tard*

Demandée par Hugo. Deux façons de s'y prendre, et une seule tient debout ici.

**Écartée : une piste importée.** Même sous licence libre, il faut vérifier
chaque fichier, créditer précisément, et un seul manquement salit un site
public. C'est le même raisonnement que pour les textures et les modèles, et il
donne la même réponse.

**Retenue : de la musique calculée**, par l'API Web Audio, comme tout le reste.
Une nappe lente construite sur quelques oscillateurs, un filtre qui respire, et
— l'idée qui la relie au sujet — **des paramètres pris dans la simulation** :
la hauteur suit le décalage gravitationnel, la densité suit le rayon orbital,
et l'ensemble se tend à l'approche du périastre. La musique devient alors une
seconde lecture des mêmes équations, pas un habillage. Elle ne pèse rien, elle
ne se répète jamais, et elle tient la promesse du site jusque dans le son.

Une réserve de méthode : coupée par défaut, et un réglage séparé de celui de la
voix. On a déjà appris qu'un son qu'on n'a pas demandé est désagréable.


## La forme de l'invitation — *tranché le 4 août*

Hugo : *« Le message que j'envoie à mes potes, c'est genre : j'ai fait un truc
cool, regarde ce lien. Et le lien envoie vers l'explication de ce que c'est,
puis à la fin c'est en mode "je me lance dans l'aventure", un bouton un peu
épique — et là tu arrives sur le trou noir, la quête, ça déchire. »*

Trois conséquences, à ne pas défaire :

- **Le message est court et ne vend rien.** Un texte qui explique déjà tout fait
  double emploi avec la page, et un enthousiasme appuyé dans un message privé
  sonne faux. « J'ai fait un truc, regarde » suffit.
- **Un seul lien.** Le carnet est atteint depuis la page, jamais envoyé à part :
  deux liens dans un message, c'est un formulaire, et personne ne clique.
- **L'appel à l'action est à la FIN**, pas au milieu. On lit d'abord ce que
  c'est, on comprend pourquoi c'est particulier, et on part au moment où l'on a
  envie de partir. Un bouton posé avant l'explication attrape ceux qui n'ont
  pas encore de raison d'y aller.



---

# Le journal


## Fait

- **Moteur de rendu** — géodésiques nulles de Schwarzschild intégrées par pixel,
  disque d'accrétion, Doppler, redshift gravitationnel, images multiples.
- **Banc d'essai intégré** — mesure en direct la sphère des photons, le rayon de
  l'ombre, la déflexion et l'ISCO, et les compare aux valeurs analytiques.
  Il a trouvé une vraie erreur : la direction du photon était renormalisée à
  chaque pas, ce qui n'est pas licite en paramètre affine et donnait une ombre
  55 % trop grande. Corrigé, tout tombe désormais à 0,07 % ou mieux.
- **Sondes** — lancer au glisser, pluie de 80, classement orbite / chute / fuite,
  traînées, affichage de toutes les trajectoires.
- **Gel à l'horizon** — les sondes ne franchissent plus l'horizon : vues de loin,
  elles ralentissent, rougissent et s'éteignent. Le site montrait l'inverse de ce
  qu'il affirmait.
- **Photon témoin** — lancé sur la sphère des photons, lensé dans le shader,
  avec le temps de vol en secondes réelles.
- **Vitesse du temps** — du temps réel à une heure par seconde.
- **8 fiches × 3 niveaux** — de « aucun acquis » à « contraindre le spin ».
- **Dossier « pourquoi c'est exact » × 3 niveaux** — méthode, équations, et la
  liste explicite de ce qui n'est pas simulé.
- **Lumen** — mascotte photon, réactions contextuelles, 6 questions × 3 niveaux.
- **Voix** — 4 voix neuronales pré-synthétisées (`outils/voix.py`), sélecteur
  dans le site. 10,7 Mo, soit 1 % du quota GitHub Pages.
- **`contenu.js`** — registre de 19 sources primaires ; répliques de Lumen
  extraites avec leurs `id` et leurs clés de sources.

---


## État des lieux — fin de la session du 4 août 2026

Écrit pour préparer une remise à plat. Tout ce qui suit est soit constaté, soit
mesuré ; rien n'y est supposé.


## Ce qui marche, et qui est en ligne

Le salon est un lieu où l'on se déplace : marche, course, saut, chute, vue à la
première et à la troisième personne, regard à la souris — au glissé ou par
capture du pointeur — et commandes tactiles qui apparaissent au premier contact
du doigt. On descend dans la fosse d'où l'on veut, on n'en remonte que par la
rampe à bâbord.

Deux postes sont des lieux plutôt que des boutons : la **commande du temps**
(cinq lames sur le pupitre, du temps réel à ×850) et le **télescope**, qui
donne la main sur le simulateur. **Lumen** est devenu un drone qui patrouille et
qu'on interpelle en le visant.

Trois portes à l'entrée — regarder, embarquer, apprendre — parce que les trois
ne demandent ni le même effort ni la même machine.


## Les quatre documents produits par les agents, non encore appliqués

| fichier | ce qu'il contient | état |
|---|---|---|
| `CONCEPTION-VAISSEAU.md` | plan coté du salon, paroi cannelée, volets de baie | **non appliqué** |
| `CONCEPTION-HUB.md` | hub à deux ponts, six postes, table d'affectation des fonctions | **non appliqué** |
| `CHUTE.md` | physique sourcée du franchissement de l'horizon | **non intégré au site** |
| `AUDIT-NIVEAUX.md` | neuf défauts dans le contenu | **partiellement corrigé** |


## Le conflit à trancher avant de bâtir le hub

Le concepteur du salon soutient : matériaux sombres, aucune lumière intérieure,
l'astre reste la seule source — parce que dès qu'on éclaire la pièce, le trou
noir cesse d'être une source et devient un décor derrière une vitre.

L'implémentation fait l'inverse : corniches, bandeaux, écrans émissifs. Motif :
sans eux la pièce est un diorama, et c'est le reproche qui avait été fait.

Les deux se défendent, mais pas en même temps. **À trancher explicitement**, car
cinq salles vont être bâties sur cette décision.


## Ce que l'audit a trouvé et qui n'est PAS corrigé

Corrigé : la contradiction sur la rotation (quatre textes), et πGM/c³ passé de
60 s à 66,5 s.

Restent :

- **`inactif-6`** : les 26 675 ans reposent sur la distance GRAVITY 2019
  (8 178 pc), pas sur les 8 277 pc adoptés ailleurs. Contradiction interne avec
  le « 27 000 ans » de `photon-fuite`. Corollaire sur `inactif-8`.
- **Méthode niveau 2 contre fiche 9** : erreur Doppler annoncée à 10 % ici,
  32 % là ; et la description du banc d'essai ne correspond pas au code.
- **Fiche 8 niveau 1** : « presque cinq fois plus près » vaut 3,8 ; et les 42 %
  sont la limite extrême, pas la valeur à a* = 0,9 (15,6 %).
- **Spectre** : « un trou noir bien nourri brillerait surtout en X » est vrai
  d'un trou noir stellaire, faux d'un supermassif (pic UV).
- **`vitesse-reel`** : Lumen, devenu système de bord, parle encore comme un photon.
- **`destination.orbite`** annonce 22 r_s ; l'orbite codée a un apoastre de 16.
- **Registre** : `dyson1920` contredit la fiche corrigée ; e^(−π) mal attribué ;
  le repère 2,2 μm attribué au mauvais article GRAVITY ; `lewis2007` jamais ajouté.
- **`REFERENCES.md` est périmé** : il cite des répliques qui n'existent plus.

Une régénération des MP3 sera nécessaire partout où un champ `dire` change.


## Firebase

Projet `periastre` créé, configuration web dans `pantheon.js`. Authentification
anonyme **activée puis retombée** en `configuration-not-found`. Règles Firestore
**non publiées** : lecture et écriture refusées. Le panthéon fonctionne en
mémoire locale, comme prévu — rien n'est cassé, mais rien n'est partagé.


## Limites connues, assumées

- Couture fine sur l'axe polaire quand la rotation est active : l'axe est
  singulier par construction en Boyer-Lindquist. L'image par défaut en est exempte.
- Les écrans du salon sont dessinés sur un calque à deux dimensions, sans tampon
  de profondeur. Le pare-face et le contrôle d'aire évitent qu'ils traversent les
  cloisons, mais rien ne les occulte encore quand un objet passe devant.
- Le son sur iPhone reste coupé par l'interrupteur latéral, sans moyen de le
  détecter. Un avis le signale.


## Ce qui reste en attente, par ordre d'importance

1. **Trancher le conflit de lumière** — bloque le hub.
2. **Corriger les huit défauts d'audit restants**, régénérer les voix concernées.
3. **Le hub à deux ponts**, une fois le contrat de lumière fixé.
4. **La chute derrière l'horizon** : `CHUTE.md` est prêt, il reste à l'animer.
   Cinq phases, l'intérieur en temps réel — 28,2 s —, et six mensonges visuels
   proscrits avec leur remplacement.
5. **Le panthéon** : la paroi gravée, une fois les règles publiées.
6. **Le tutoriel guidé** par Lumen, qui suppose le déplacement — désormais acquis.
7. **Avatars, tenues, monnaie, quêtes.** Règle déjà posée : on ne débloque qu'en
   comprenant.
8. **Une touche de rejeu** : « C » copie déjà un lien qui rouvre la scène au même
   endroit. À étendre au simulateur.


## Anecdotes proposées par Hugo

Chacune est vérifiée par le calcul avant d'entrer dans le site. Le statut dit
où elle en est.

| anecdote | vérification | statut |
|---|---|---|
| Combien de temps met la lumière pour faire le tour | **11 min 31 s** = 6√3·πGM/c³. La version affichée disait 6 min 39 s — bug corrigé, mesuré à 0,004 % | intégrée |
| Rien ne franchit l'horizon vu de loin | Exact. La simulation montrait l'inverse | corrigée, intégrée |
| Le trou noir d'*Interstellar* n'est pas rond | Vrai, à cause du spin. Notre ombre est ronde parce que notre trou noir ne tourne pas | expliquée, mode Kerr à faire |
| Voir en vraie lumière | Le disque est quasi muet en visible : Sgr A* rayonne dans le submillimétrique | intégrée |
| Le paradoxe des jumeaux façon *Interstellar* | Attention au sens : **ceux qui descendent vieillissent moins**. Et sans rotation le plafond est √2 — d'où le spin de Gargantua | intégrée, avec la correction |
| Aller au centre galactique à 1 g | **19,8 ans à bord, 26 675 ans sur Terre.** γ = 13 768 au demi-tour | intégrée |
| Traverser l'univers observable en ~40 ans | **47,7 ans** en espace plat — mais l'expansion plafonne à ~16 milliards d'al comobiles, soit **4,5 % du volume observable**. Le reste est hors d'atteinte pour toujours | à intégrer |
| Andromède à 1 g | **28,6 ans** de vie. La distance cesse presque de compter | intégrée |
| Télescope à filtres (radio, submm, IR, visible, X) | Sgr A* change réellement de visage selon la longueur d'onde | à construire |

Au passage, deux corrections trouvées en vérifiant : Sgr A* n'est **pas** moins
dense que l'eau (mille fois plus ; c'est M87* qui est moins dense que l'air), et
8 277 pc font **27 000** années-lumière, pas 26 000.


## Pourquoi le vaisseau est là — *et l'idée d'Hugo à garder pour plus tard*

Hugo a proposé d'inventer une raison : capturer l'énergie du trou noir. Il s'est
retenu lui-même, à juste titre — une justification fausse abîmerait le seul
argument du site.

**La vraie raison est meilleure que la fiction**, et c'est elle qui est en jeu
dans la quête d'accueil : Sagittarius A* est le seul endroit atteignable où la
gravité est assez forte pour qu'on la voie plier la lumière. Sur Terre il faut
des horloges atomiques pour la mesurer ; ici elle fait faire demi-tour aux
rayons. On y va pour regarder, pas pour rapporter.

**Mais l'intuition d'Hugo est fondée**, et il faudra y revenir : on sait
extraire de l'énergie d'un trou noir en rotation. Le **processus de Penrose**
prend de l'énergie à un corps qui se scinde dans l'ergosphère ; le mécanisme
de **Blandford-Znajek** — dont la référence est déjà au registre — extrait
l'énergie de rotation par les lignes de champ magnétique, et c'est ainsi qu'on
explique les jets des noyaux actifs. Jusqu'à **29 %** de la masse d'un trou noir
de Kerr extrême est en principe récupérable.

La réserve, à dire si on l'emploie : **Sgr A* est calme**. Il n'alimente pas de
jet visible, donc « on est venus pomper de l'énergie » serait vrai d'un noyau
actif et faux d'ici — exactement l'espèce d'erreur que l'audit traque. Si on
veut cette histoire, elle appartient à une autre destination.



---

# Reste du carnet


## Carnet

Tout ce qui a été demandé, dans l'ordre où on compte le traiter.
Mis à jour le 4 août 2026.

---


## À faire

### 0. Le vaisseau comme cadre de tout le reste
L'idée qui unifie le reste : on n'est plus « devant » le trou noir, on est **à
bord**, en orbite. La vue par le hublot est la vraie vue. Le cours se suit
depuis le poste de pilotage, donné par Lumen. Le temps de l'orbite s'accélère
sans que le temps à bord change.

Déjà en place : caméra embarquée avec aberration relativiste, cockpit avec
cadrans réels (vitesse locale, dilatation du temps, marée), filtre lumière
réelle.

Reste à faire :
- **Le télescope à filtres.** L'objet le plus pédagogique de tout le projet.
  Sgr A* change complètement de visage selon la longueur d'onde, et c'est un
  fait, pas un effet : radio (c'est ainsi qu'on l'a découvert en 1974),
  submillimétrique (le pic d'émission, la fenêtre de l'EHT, là où l'anneau
  apparaît), infrarouge (calme, avec des sursauts plusieurs fois par jour),
  visible (rien), X (sursauts et émission diffuse). Chaque filtre doit montrer
  une image différente et sourcée.
- **Le cours guidé** depuis le poste : Lumen déroule le programme au niveau
  choisi, la caméra et les paramètres suivent.
- **Se déplacer dans le vaisseau** : hublot, télescope, console.

### 1. Vérification des faits par un agent
Faire relire chaque affirmation du site par un agent qui remonte aux sources
primaires, et produire `SOURCES.md` consultable. Bon candidat pour une
sous-tâche : c'est indépendant du reste et demande de la recherche.
**Bloquant avant publication.**

### 2. Finir l'extraction du contenu
Les fiches et le dossier « méthode » sont encore en dur dans `index.html`.
Les déplacer dans `contenu.js` avec leurs `id` et leurs sources, pour que la
règle « aucun fait hors du fichier de contenu » soit vraie partout.
*Prérequis de 1.*

### 3. Mise en ligne
`gh` s'installe. Ensuite : dépôt, push, activation de Pages.
Rapide, et ça donne un site réel à montrer.

### 4. Mode cours guidé
Un bouton « lecture » où Lumen déroule un vrai cours, adapté au niveau, avec
la caméra chorégraphiée (zoom, pivot, lancers de sondes au bon moment) et la
narration audio. C'est la fonctionnalité qui transforme la démo en site
pédagogique. Gros morceau : il faut une piste de scénario (temps → action +
réplique) et un moteur qui la joue.

### 5. Dézoom vers la Voie lactée
Voyage à la molette, en échelle logarithmique, de l'horizon jusqu'à la galaxie
entière, avec des repères qui apparaissent au fil du trajet : orbite de S2,
système solaire, bras spiraux, les 26 000 années-lumière qui nous séparent du
centre. À fusionner avec le mode cours — c'est la même mécanique de caméra.

### 6. Mode Kerr (trou noir en rotation)
La vraie réponse à « pourquoi Gargantua n'est pas ronde » : avec du spin,
l'ombre s'aplatit d'un côté. Exige de passer en Boyer-Lindquist et d'intégrer
avec la constante de Carter — la forme cartésienne compacte disparaît, donc
réécriture complète du shader. Le morceau le plus lourd, et le plus payant
pour l'exactitude.

### 7. Mode « vue réelle »
Ce qu'un humain verrait vraiment : Sgr A* est pâle et ne s'observe qu'en radio,
donc quasiment rien à l'œil nu. Et en chute libre, l'aberration comprime tout
le ciel vers l'avant. Léger comparé à Kerr, et frappant.

### 8. Objets du voisinage
Pendant le dézoom, pouvoir s'arrêter sur une planète, sur S2, sur l'amas S.
Dépend de 5.

---


## Chantiers ouverts, par ordre de valeur

1. **Fusionner `kerr` dans `main`.** L'ombre en D est mesurée conforme (2,30
   contre 2,40 à a* = 0,9), le disque suit l'ISCO, la fiche est écrite. Ce qui
   reste : la couture sur l'axe polaire en mode rotation — singularité de
   Boyer-Lindquist, réparable seulement en passant en coordonnées de
   Kerr-Schild, ce qui est une réécriture.
2. **La fusion de deux trous noirs.** L'idée la plus spectaculaire du carnet, et
   la plus lourde : la métrique d'un binaire n'a pas de forme analytique, il
   faut une relativité numérique. Piste réaliste : rejouer une forme d'onde
   déjà calculée (les catalogues SXS sont publics) plutôt que résoudre les
   équations, et lenser sur la géométrie approchée. À cadrer honnêtement — ce
   serait une reconstitution, pas un calcul, et il faudra le dire.
3. **Le télescope à filtres dans le vaisseau**, et le salon partagé.
4. **Le dézoom vers la Voie lactée**, moteur écrit (`voyage.js`) mais pas branché.
5. **Mode « vue réelle » depuis une chute libre** : aberration à l'approche.
