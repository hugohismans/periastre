# Ce qui attend des yeux

> ## 👉 Ne lis pas ce fichier. Ouvre ça :
> ### **https://hugohismans.github.io/periastre/?juge**
>
> Les décisions ci-dessous s'y jouent une par une. La séance **va chercher
> la chose et la pose sous tes yeux** — tu ne navigues pas, tu ne lis pas. Là où
> il y a plusieurs options, elles se comparent en direct, sur la même vue, d'un
> bouton à l'autre. À la fin, un bouton « Copier » : ce qui sort est un **message
> écrit pour Claude**, prêt à coller dans la conversation.
>
> Compte dix minutes. Ce document n'est que sa source.

Tout ce qui ne peut pas se vérifier par la mesure, et qui attend donc qu'un
humain regarde. **Rien ici ne bloque quoi que ce soit** — c'est une file, pas
une dette. Elle existe pour que ça ne se perde pas dans une conversation.

Mise à jour le 6 août 2026, après la troisième séance.

---

## D'abord : la séance elle-même faussait les verdicts

À retenir avant de lire le reste. Le panneau de `?juge` **grandissait de
cinquante-six pixels à chaque question** — il empilait une rangée de boutons
sans retirer la précédente. Cent quarante-deux pixels de haut à la première
question, trois cent dix à la quatrième, et ce en état replié.

La cinquième question était la rotation du trou noir d'étude. Le « ça coince »
rendu ce jour-là, avec pour seul mot « l'interface de test bloque encore
l'interface », ne portait donc pas sur la rotation.

Corrigé, et deux contrôles posés : la fenêtre se déplace maintenant à la souris
et au doigt, et la séance vérifie à chaque question qu'elle n'a pas recommencé à
enfler. **Les verdicts de la troisième séance sont à relire avec ça en tête.**

---

## ❓ DEUX QUESTIONS POUR TOI — 8 août 2026

Les deux sont sorties du même chantier, et aucune ne se tranche par un calcul.

### 1. Le quadrillage se lève trop tôt sur ton téléphone, et c'est mesurable

Tu m'avais dit : *« le quadrillage se levait alors qu'on regardait encore
ailleurs… une apparition buguée »*. On avait réglé ça avec un seuil : le
quadrillage n'apparaît que si le trou noir est **dans le champ**.

Le seuil vaut un angle de **56,6°**. Sur un écran d'ordinateur en 16:9, le coin
de l'image est à 52,8° — le seuil tombe donc juste au-delà du coin, et c'est
parfaitement réglé. C'est ton œil qui l'a posé, sur ton écran.

**En portrait sur iPhone, le coin descend à 35,4°.** Le quadrillage se lève donc
alors que le trou noir est encore à **vingt et un degrés hors de l'écran**.
C'est exactement le défaut que tu avais signalé, revenu par la porte du format.

La règle juste se déduit : le seuil devrait suivre la focale et la forme de
l'écran, au lieu d'être un nombre fixe. Ça reproduirait ton réglage à
l'identique sur ordinateur, et ne changerait la chose que là où elle est
fausse.

**Je ne l'ai pas fait, parce que c'est ton chiffre.** Dis-moi si je le rends
automatique.

### 2. Le salon devrait-il avoir sa propre aberration ?

Le vaisseau du salon orbite pour de vrai. Physiquement, le ciel vu par la baie
devrait donc être **déformé par sa vitesse à lui** — les couleurs poussées vers
l'avant, l'image resserrée devant.

Aujourd'hui il ne l'est pas : la vitesse est à zéro dans le salon.

Ce n'est pas un oubli qu'on vient de faire — c'est le comportement depuis le
début, et je viens de le rétablir là où il s'était perdu (voir plus bas). Mais
c'est une entorse à la simulation, et tu as été clair là-dessus.

**Ça se voit ou pas ?** Le vaisseau va vite, donc l'effet ne serait pas
discret. Ça peut aussi rendre la pièce désagréable à regarder. C'est un choix,
pas un calcul.

---

## Trois choses réparées que personne n'avait vues — 8 août 2026

Rien à regarder ici, c'est de l'entretien. C'est noté parce que les trois se
sont trouvées toutes seules, en rangeant, et qu'aucune n'était visible.

**1. Le clic visait à côté sur téléphone.** Deux fonctions inverses l'une de
l'autre — celle qui place un repère sur l'image, celle qui retrouve le point
qu'on a touché — mesuraient la hauteur de l'image de deux façons différentes.
Quand la barre d'adresse de ton iPhone se rétracte, l'écart fait soixante-quatre
pixels : tu touchais une sonde et tu en désignais une autre, horizontalement
seulement. Ça ressemblait à une erreur de physique. C'était une erreur d'unité.
**Si tu avais déjà eu l'impression de rater ce que tu visais, c'était ça.**

**2. Le carnet de bord plantait.** Le panneau qui liste tes trajets et le temps
que tu as gagné sur la Terre lisait quelque chose qui n'existait plus depuis
qu'on a rangé ce domaine dans son propre fichier. Il ne s'ouvre qu'après un
voyage, donc personne n'était tombé dessus.

**3. Lumen ne se replaçait plus dans le salon.** Quand tu t'éloignes de plus de
deux mètres, il doit venir se remettre devant toi. Le code lui demandait où tu
regardes en appelant la mauvaise chose — deux noms qui se ressemblent, et
l'extraction avait pris le mauvais.

**4. Le ciel du salon restait penché quand tu venais d'une sonde.** Si tu
montais sur une sonde — qui file à 0,6 fois la vitesse de la lumière — et que tu
appuyais ensuite sur le bouton du salon, la pièce gardait la vitesse de la
sonde. Tout le ciel vu par la baie restait déformé par une vitesse qui n'était
plus la tienne. Depuis toujours, et par le chemin le plus court : deux boutons.

Deux agents l'ont trouvé **le même jour, chacun de son côté**, simplement en
lisant le domaine une fois qu'il était sorti dans son propre fichier. C'est
l'argument le plus net que j'aie pour ce chantier : le défaut était là depuis le
début, il ne s'est pas vu tant que le code vivait au milieu de six mille lignes.

Ce qui a rendu les deux dernières visibles : le filet ne s'arrête plus au
premier contrôle qui trébuche. Il note « celui-là est tombé » et continue. Ces
deux morts silencieuses emportaient **treize vérifications** avec elles, sans
rien dire. Le filet est passé de 93 à 106 contrôles au vert, et je n'en ai écrit
aucun — ils étaient déjà là, ils ne s'exécutaient plus.

---

## ❗ À CONFIRMER DE TON ŒIL — les écrans du salon ont bougé de 44 cm

**8 août 2026.** Le contrôle des écrans de bord a trouvé que chaque dalle
**débordait de trente centimètres sur l'ouverture de la baie** : dix-neuf pour
cent de sa surface était peinte sur le vide, c'est-à-dire par-dessus le trou
noir, au lieu d'être sur du métal.

Ce n'était pas un choix : le module dit lui-même que les écrans sont
« réellement posés sur les parois ». **J'ai corrigé** — les dalles reculent de
44 cm vers l'extérieur et tiennent entièrement sur la bande pleine, qui fait
1,90 m pour une dalle de 1,62 m.

**Ce qu'il faut que tu regardes :** est-ce que le salon est toujours équilibré
avec les écrans plus près des angles ? C'est le seul aspect qui relève de l'œil ;
le reste est de la géométrie.

Corrigé aussi, sans discussion possible : **la lueur que chaque dalle jette sur
la cloison ne suivait pas le fondu.** Elle restait à pleine intensité pendant
toute l'extinction, puis disparaissait d'un coup — une auréole sans écran.

### Et un chiffre pour ta décision, qui n'est pas un défaut

Les deux garde-fous de lisibilité — l'angle de vue et l'erreur de plaquage —
font que les écrans **ne se lisent que depuis 56 % du sol du salon**, au meilleur
cas. Se planter à 2,5 m d'un écran et se décaler de 30° suffit à l'éteindre.
C'est le prix déclaré du compromis (une toile 2D ne sait pas faire de vraie
perspective), pas un bogue. Mais c'est peut-être trop sévère, et ça se juge à
l'œil.

---

## Trouvé en sortant la progression — sept choses, dont la maladie connue

**8 août 2026.** Le domaine des missions et de la quête d'accueil est le plus
couplé du fichier. En l'extrayant, sept défauts sont apparus. Aucun n'a été
corrigé : une extraction est un déplacement.

**1. Deux écrivains pour une même valeur — la maladie qui a donné le disque à
622×.** La mémoire du site n'a pas qu'un point d'écriture : le bouton de quête
fait son propre lire-modifier-écrire pour retirer le drapeau « déjà venu », hors
de la fonction de sauvegarde. Pire, celle-ci le réécrit **inconditionnellement**
— donc n'importe quel changement de réglage pendant l'intro rejouée annule ce
que le bouton venait de faire. C'est nommé dans `CLAUDE.md` comme la maladie à
soigner en premier.

**2. Un panneau qui se contredit pendant quatre secondes.** À la fin de
n'importe quelle étape de quête, la jauge s'allume **entièrement** pendant que
le numéro annonce « étape 1 sur 4 ». Mesuré : la jauge rend `1111` quand le
panneau rend `0000`. Puis elle retombe. Les missions, elles, n'allument que le
fait.

**3. Un compte d'images déguisé en millisecondes.** Le temps de regard s'incrémente
de 16 par image pour un seuil à 1 800 : cela fait 1,88 s à 60 Hz mais **0,94 s à
120 Hz**, alors que le commentaire annonce « deux secondes ». Sur un téléphone
récent, l'étape se valide deux fois trop vite.

**4. Une écriture morte.** Une clé de mémoire est écrite à deux endroits et lue
nulle part dans tout le dépôt.

**5. `MISE_EN_PLACE.jumeaux` cherche une mission dans une liste qui l'exclut**,
donc rend −1. Inoffensif aujourd'hui parce que l'expérience est filtrée du menu,
mais c'est un accès à l'indice −1 en attente. Le commentaire voisin annonce huit
missions ; il en reste six.

**6. Deux règles pour le même panneau.** Cliquer « missions » dans les quatre
secondes qui suivent une réussite efface « réussi » et remet la consigne, alors
que la classe visuelle « fini » reste posée.

---

## Trouvé en sortant le calque — la couleur qui enseigne sature en blanc

**8 août 2026.** Quand on tire une sonde, la trajectoire prévue change de
couleur — du rose au vert — selon qu'elle tombera, tournera ou s'échappera.
C'est le seul endroit du site où l'on apprend qu'une orbite est un **accord
entre une distance et une vitesse**.

Or toute la visée est dessinée en mode **additif**. La couleur s'ajoute donc au
disque d'accrétion, qui est lumineux — et elle **sature en blanc précisément là
où l'on vise le plus**, c'est-à-dire près de l'astre. L'information disparaît à
l'endroit exact où elle compte.

Deux autres, plus légères, au même endroit :
- les têtes de sondes grossissent **linéairement** avec le réglage de taille
  alors que leurs traînées suivent une **racine carrée** : à fond, les têtes
  quadruplent et les traînées ne font que doubler.
- deux tracés sont morts — un point unique, et une opacité nulle.

---

## Trouvé en sortant le spectre — deux réglages portent un fait

**8 août 2026.** Le panneau du spectre enseigne un fait central : à 1,3 mm le gaz
devient transparent, et c'est ce qui permet à l'EHT de voir l'ombre.

Or ce fait ne sort d'aucune source. Il sort de **deux constantes d'affichage** :
`10^(0,079 + lg + 2,886)`, avec un seuil d'extinction à 1,5 rayon. Le `0,079`
n'est justifié nulle part — ni dans `contenu.js`, ni dans `contrat.js`, ni dans
les sources — et c'est lui, avec le seuil, qui décide que la photosphère
s'éteint à 1,63 mm et donc que 1,3 mm est dégagé.

Deux réglages de rendu portent la démonstration du panneau. C'est un manquement
à la sixième règle dure — *aucune affirmation factuelle hors de `contenu.js`,
et chacune porte ses clés de sources.*

Deux autres, plus légers, notés au même endroit :
- le plafond à **60 rayons** est un bord de scène, pas une physique. La caméra
  recule à `rPhotosphere × 2,1`, soit 126 rayons quand il sature.
- l'exposant **0,45** de l'éclat est une compression tonale, pas une grandeur
  photométrique, et il n'est déclaré dans aucun compromis.
- `dessineSED` fixe **30,5** comme plancher de l'axe vertical alors que le
  minimum de la SED vaut 31,0.

---

## Deux choses trouvées en sortant le cockpit

### La console du cockpit passe peut-être sous deux panneaux

Mesuré le 8 août : les valeurs des cadrans tombent à **81 px du bas** sur grand
écran et **55 px** sur téléphone ; les jauges à 66 et 48 px. Or le CSS pose
`#lecture-flottant` à 82 px et `#mission` à 64 px du bas.

Il y a donc de bonnes chances qu'un panneau HTML recouvre les cadrans dans
certaines situations — pas la barre de boutons, qui est plus bas. Ça ne se
tranche pas au calcul : il faut regarder, en vol, avec une mission en cours.

### Un chiffre faux à l'écran

**8 août 2026, découvert pendant l'extraction de `cockpit.js`.** Le cadran
« ton temps s'écoule à » affiche `√(1 − 3M/r)`, qui est le rapport dτ/dt d'une
orbite **circulaire**. Or le cadran paraît pour n'importe quelle sonde : chute
radiale, ellipse, trajectoire de fuite. Pour toutes celles-là, le chiffre est
faux — et l'étiquette est une affirmation sur l'observateur, pas sur une orbite
hypothétique.

La vitesse réelle est affichée juste à côté, dans le cadran voisin. De quoi le
calculer honnêtement.

**Pas corrigé volontairement** : une extraction est un déplacement, pas une
correction, et mélanger les deux rend la trace d'or inutilisable. À traiter
comme son propre chantier, avec sa mesure. C'est un manquement à la quatrième
règle dure — *c'est une simulation, pas une animation*.

---

## La file est de nouveau pleine — le voyage refait attend ton œil

Trois questions, le 7 août au soir. Le chantier ouvert plus bas est fait :

| quoi | ce qu'il faut regarder |
|---|---|
| **Le voyage, refait** | Large exprès : quatre choses ont changé en même temps. Deux entrées, le trajet entier ou l'arrivée seule. |
| **Les orbites ont-elles l'air d'être dehors ?** | J'ai mesuré qu'elles ne peignent plus un pixel hors du cadre de la baie. Mais « ne pas déborder » et « avoir l'air d'être dehors » sont deux choses différentes, et la seconde ne se mesure pas. |
| **Ce qu'on lit pendant le vol** | La forme du bandeau que tu as demandé. Les chiffres sont vrais ; c'est la lisibilité qui se juge. |

---

## Séance du 7 août 2026, au matin — appliquée

**Deux questions sont closes, et la troisième a été refusée pour de bonnes
raisons.** Il n'y a plus rien à faire juger tant que la partie voyage n'est pas
refaite : reposer les mêmes variantes coûterait son œil pour un verdict déjà
rendu.

| quoi | verdict |
|---|---|
| **La rotation du trou noir d'étude** | ✅ « ça va ». Posée quatre fois, ratée trois fois par ma faute. Close. |
| **L'image après la réécriture du moteur** | ✅ « rien n'a bougé, tout a l'air conforme ». Aucune régression visible après le passage en Kerr-Schild. Close. |
| **L'arrivée du voyage** | ❌ **Les deux variantes refusées, et il a répondu à côté de mes boutons — à juste titre.** Voir le chantier ci-dessous. |
| **La carte des orbites qui tourne** | ✅ **Corrigé le jour même.** « On a l'impression que le vaisseau tourne autour du trou noir. » Une dérive d'azimut que j'avais ajoutée « pour que le volume se lise » ; elle fabriquait un déplacement inexistant. Gardé par `VERIF.carteFixe()`. |

### Le chantier qui sort de cette séance : refaire le voyage

Ses mots, dans l'ordre où ils sont venus :

> « La trace des orbites est devant la vitre dans le vaisseau, on n'a pas
> l'impression que c'est à l'extérieur. Et on doit vraiment avoir l'impression
> qu'on s'éloigne : la taille des orbites doit être relative à la distance à
> laquelle on est du trou noir pendant le voyage. »

> « Si on voit une trace d'orbite, on les voit depuis le début qu'on recule, et
> c'est une fois qu'on arrive à la destination qu'on la voit en entier. Mais ça
> doit se faire de manière très naturelle. »

> « Il faudrait mettre notre vitesse actuelle pendant le voyage, en vitesse de la
> lumière. La phase d'accélération, la phase de décélération. Le décalage
> temporel pendant le voyage, à quelle distance on est de notre point de départ.
> Je trouve que la partie voyage est à retravailler en tout cas. »

**Cinq points, et le dernier commande les autres.**

1. La carte des orbites est un **calque plat posé sur tout l'écran** — d'où le
   fait qu'elle passe devant la vitre. Il faut la découper à l'ouverture de la
   baie, dont `projetteSalon()` sait déjà donner les coins.
2. Son échelle suit l'ouverture du panneau, pas la distance. Elle doit suivre
   `RECUL.etat.distance`.
3. Elle apparaît à la fin. Elle doit être là dès le début du recul et se révéler
   en se resserrant.
4. Il n'y a **aucune information de vol** : ni vitesse, ni facteur de dilatation,
   ni distance parcourue.
5. **Et la cause profonde** : le recul visible suivait une courbe de confort — un
   lissage sur le logarithme de la distance — pendant que le chronomètre
   calculait le vrai vol à 1 g. Afficher une vitesse tirée de cette courbe
   donnerait un chiffre faux en mouvement à l'écran.

Fait le 7 août : `VOYAGE.etat(d, τ)` rend la position, les deux horloges, β, γ et
la phase, gardé par 54 contrôles dans `outil-verif-voyage.js`. Le reste s'y
branche — c'est la fondation, elle est posée et prouvée.

<details><summary>L'état d'avant cette séance, gardé pour mémoire</summary>

| quoi | où | état |
|---|---|---|
| **L'arrivée du voyage** | fin du recul | ❗ **Neuf, 6 août au soir.** « L'apparition du cercle d'orbite des étoiles autour du trou noir n'est pas fluide, ça *pop* d'un coup à la fin. » Relevé au passage, pas en réponse à une question — c'est le quatrième défaut trouvé par ce champ libre. |
| **La couture de l'axe polaire** | trou noir d'étude, en rotation | ❗ **La question a enfin été posée, et la réponse n'est pas celle que j'attendais.** « Il y a une trace verticale buguée quand on met une rotation. » C'est la couture de l'axe polaire — une dette connue, déclarée à **sept endroits** du contenu, dont le panneau qu'il avait sous les yeux. **Il l'a lue comme un bug malgré la déclaration.** |

</details>

## Ce qui reste en file, sans être une question de séance

| quoi | où | état |
|---|---|---|
| **La carte des étoiles S** | arrivée du voyage | ❌ **Ça coince** aux trois séances. Le 6 août : « à discuter dans Claude Code avec Hugo ». Ce n'est plus une question à poser devant un écran — elle sort de la séance et devient une conversation. |
| **La console de tir** | fosse du salon | Sortie de la séance. « Quand je dis agrandir, je veux dire agrandir LE VAISSEAU, et mettre le canon dans une nouvelle salle. » C'est une aile de plus, pas un choix de taille. |
| **Les lampes du bord** | dans le salon | Question posée avec le mauvais bouton. L'interrupteur existe maintenant vraiment. À rejouer un jour. |

### ✅ La couture de l'axe — tranchée et faite le 6 août au soir

**Hugo a choisi la route 1 : réécrire le moteur.** C'est fait. La branche en
rotation intègre en Kerr-Schild, où l'axe polaire n'a rien de singulier.

Mesuré avant/après, même caméra, même code : la discontinuité sur l'axe passe de
**78-310 niveaux à 2-26**, avec un témoin à rotation nulle qui donne 1,3 dans les
deux cas — c'est lui qui prouve que la mesure ne raconte pas d'histoire.
`VERIF.couture()` la garde désormais.

La branche du trou noir immobile n'a pas été touchée, et la table d'or est
identique au chiffre près. Le coût passe de 18,2 à 19,9 ms par image en rotation,
soit sept pour cent.

**Il reste ton œil.** Aucun de ces chiffres ne dit si c'est beau — et la question
qui a déclenché le chantier t'attend dans la séance.

<details><summary>Le raisonnement d'origine, gardé pour mémoire</summary>

#### La couture de l'axe — la décision qu'Hugo devait prendre

Le 6 août au soir, quatrième séance : « regarde le screenshot que je t'ai envoyé,
il y a une trace verticale buguée quand on met une rotation au trou noir ».

**Ce que c'est.** À rotation non nulle, le moteur passe en Boyer-Lindquist, où
l'axe polaire est singulier *par construction*. Le code lutte déjà : il borne
`sin θ` à 10⁻², interdit à un rayon de sauter par-dessus le pôle en un pas — ce
qui avait supprimé une colonne d'artefacts bien plus large — et réfléchit
correctement en inversant p_θ et en décalant φ de π. Ce qui reste vient de la
borne : sous 0,01 radian de l'axe, les termes métriques sont bridés, donc faux.
La physique est juste ; c'est sa **description** qui s'y casse.

**Ce que ça nous apprend, et qui vaut plus que la couture.** Le site déclare ce
défaut à sept endroits, dont le panneau ouvert devant lui au moment du verdict :
« une fine couture apparaît sur l'axe : c'est la singularité de coordonnées, pas
un défaut de calcul ». **Il a quand même écrit « buguée ».** Une déclaration
qu'on doit lire ne répare pas ce qu'on voit — c'est exactement la règle du
5 août, « chaque compromis se déclare là où on le rencontre », et cet aveu-là est
dans un paragraphe, pas sur la couture.

**Les trois routes, du plus cher au moins cher :**

1. **Réécrire en Kerr-Schild.** La vraie correction : ces coordonnées ne sont pas
   singulières sur l'axe, et la couture disparaît. C'est un chantier de moteur,
   pas un correctif.
2. **Resserrer la borne** de 10⁻² vers 10⁻³, avec le limiteur de pas qui suit.
   La couture rétrécit sans mentir — on brida moins. Coût : des pas
   supplémentaires près de l'axe, à mesurer.
3. **Poser l'aveu sur la couture elle-même** plutôt que dans un paragraphe.
   Ne change rien à l'image, change tout à sa lecture.

Les routes 2 et 3 ne s'excluent pas, et aucune n'interdit la 1 plus tard.

*Note d'après coup : la route 2 n'existait pas. J'avais annoncé une borne
`sin θ ≥ 10⁻²` à resserrer ; elle valait déjà `10⁻⁷`, et le commentaire du code
expliquait qu'on l'y avait mise exprès — la brider à 10⁻² causait une colonne
d'artefacts bien pire. Il n'y avait pas de demi-mesure.*

</details>

### Le bruit de fond du ciel — à revoir plus tard, sans urgence

Verdict du 6 août au soir, après comparaison des trois ciels en direct : « très
peu de changement entre les trois, le bruit est très léger, ce n'est pas
bloquant, donc on regardera ça plus tard ». Le ciel corrigé est gardé, les deux
autres sont partis du code. **Il reste un bruit léger, et il n'est pas
diagnostiqué** — ce n'est plus la coupure aux cellules, qui est mesurée à zéro.

### Tranché — plus besoin de personne

- **Le quadrillage pendant le recul** → **ça va** (6 août au soir). Demandé
  trois fois en volume, fait, et validé à la quatrième. `outil-verif-recul.js`
  garde la forme du repère *et* la visibilité des arêtes — le premier jet les
  avait posées sous le seuil du visible, et la demande serait revenue une
  cinquième fois.
- **Le scintillement des étoiles** → **tranché** (6 août au soir). Les étoiles
  étaient tranchées par la frontière de leur cellule ; mesuré, corrigé, gardé à
  zéro discontinuité de 390 à 1440 pixels de haut. Voir ci-dessus pour le bruit
  résiduel, qui est autre chose.
- **La présentation d'entrée** → ça va (6 août, troisième séance).
- **La bulle de Lumen** → ça va.

---

## À regarder quand l'occasion se présente

- **Le voyage entier**, d'un bout à l'autre, sans sauter. Vingt-deux secondes.
  Est-ce trop long ? Trop court ? Le recul se sent-il ?
- **Le trou noir d'étude** : passer les quatre rotations à la suite. L'effet est
  réel et calculé, mais est-il visible ?
- **Le carnet de bord** après plusieurs trajets : les chiffres parlent-ils ?
- **Les écrans de bord** depuis que leur contenu est mis en cache. Rien ne
  devrait avoir changé — mais « rien ne devrait » n'est pas « rien n'a ».
- **L'anglais**, en entier, par quelqu'un dont c'est la langue.

---

## La salle de tir : où je me suis arrêté, et pourquoi

**J'ai posé une console de tir dans le salon, puis je l'ai retirée.** Pas parce
qu'elle était fausse — parce que je n'arrivais pas à établir de façon fiable ce
que je voyais à l'écran, et que continuer à l'aveugle sur un objet en volume
n'avait plus de sens.

Ce qui est acquis, et ne sera pas à refaire :

- **La mécanique est prête.** `vol.js` fait déjà tout : `destin()` calcule
  l'avenir complet d'un tir avant qu'il parte, et rend le tracé. La salle n'est
  que ça, avec une vitesse choisie au lieu d'une vitesse tirée au sort.
- **La projection marche depuis la pièce.** `majCameraSalon()` alimente `basis`
  et `camPos` comme la vue libre, donc `projette()` sait déjà dessiner une
  trajectoire dans la baie. Rien à écrire pour ça.
- **Le point pédagogique est identifié**, et c'est le tien : un tir à zéro
  mètre par seconde depuis une station en orbite laisse la sonde **à côté du
  vaisseau, toujours en orbite**. Le tir actuel ne fait pas ça — il pose une
  vitesse absolue depuis un point du plan, sans hériter de rien.
- **Un piège trouvé et documenté** : tout poste qui n'est pas le télescope est
  DESSINÉ comme un cube cyan plein à la taille de sa boîte de visée. C'est
  ainsi que les cinq lames du temps existent — le cube EST la lame. Un poste
  qui a sa propre géométrie doit donc suivre la branche du télescope, sinon un
  pavé bleu de soixante-dix centimètres se pose sur l'instrument.

**Ce qu'il me faut de toi** : un coup d'œil, ou la permission de la poser
franchement et de te laisser juger sur pièce. La place proposée était la fosse,
à x = 1,2 — la seule portion vraiment vide, entre les deux occupants, avec le
trou noir dégagé au centre de la baie.

---

## Les décisions qui t'appartiennent

Elles ne sont pas techniques. Personne d'autre ne peut les prendre.

1. **Le conflit de lumière du salon.** Le document de conception veut une
   lumière qui vienne du trou noir seul ; l'implémentation a ajouté des sources
   dans la pièce. Cinq salles futures en dépendent. Il faudrait deux captures
   côte à côte.
2. **Acheter des choses.** Le carnet dit à un endroit « à laisser tomber » et à
   un autre « avatars, tenues, monnaie ». Une troisième voie y dort déjà : un
   objet rapporté d'une destination est un souvenir, pas un achat.
3. **La rencontre trou noir / Lune.** Tu la veux, le carnet la refuse — parce
   qu'elle n'est pas sourçable et qu'elle enseigne le contraire du but. La
   décision reste ouverte.
4. **« Lumière réelle » contre le mode simulation/cinéma.** Le bouton existe et
   fait déjà une partie du travail du futur réglage. Soit il devient le mode,
   soit il en devient un cran.

---

## Ce qui est réglé et n'a plus besoin de personne

Pour mémoire, et pour ne pas y revenir : le drone se touche au doigt (mesuré,
huit visées sur huit), Lumen parle sur téléphone (une règle le masquait depuis
toujours), le ciel ne s'éteint plus, la mise en page tient aux trois formats, et
le bilingue est complet. Tout cela se contrôle désormais tout seul.
