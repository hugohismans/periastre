# Carnet

Tout ce qui a été demandé, dans l'ordre où on compte le traiter.
Mis à jour le 4 août 2026.

---

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

## Notes

- **Pas d'API dans le navigateur.** Une clé dans du JS statique est publique dès
  la première indexation. Si un jour on veut un vrai dialogue avec Lumen, il
  faudra un proxy (Cloudflare Worker) qui garde la clé.
- **`contenu.js` est la source de vérité.** Trois consommateurs le lisent :
  l'affichage, la génération audio, l'audit des sources. Un `id` ne se renomme
  pas sans régénérer la voix.
- **Ne jamais affirmer sans pouvoir montrer.** Quand une grandeur est calculable,
  un test exécutable vaut mieux qu'une citation.

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

# État des lieux — fin de la session du 4 août 2026

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
