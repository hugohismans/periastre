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
