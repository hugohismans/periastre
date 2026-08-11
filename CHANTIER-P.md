# La descente au périastre — la liste que le hook lit

Ce fichier n'est pas de la décoration : **le hook `Stop` le lit à chaque fin de
tour** (`outils/encore.js`), et refuse l'arrêt tant qu'une case qui m'appartient
reste vide. Les cases marquées **(HUGO)** demandent son œil ou sa voix — elles
sont écartées du compte, me pousser dessus produirait du remplissage.

Le plan complet, avec le pourquoi de chaque pièce, est dans le plan de session
« La descente au périastre ». Le nom : les fondations étaient l'apoastre — loin,
lent, à consolider. Maintenant le passage au plus près, où la vitesse est
maximale et où tout se voit.

Une ligne `## ARRÊT — <pourquoi>` en tête de ce fichier suspend le hook.

## P1 — Le carnet du voyageur

- [x] 1.1 l'ordre `inscritSejour` dans `lieux.js` quand on quitte le salon, avec son épreuve dans `outil-verif-lieux.js`
- [x] 1.2 la ligne de séjour dans `registre.js` (type « séjour », les deux durées), éprouvée dans `outil-verif-registre.js`
- [x] 1.3 la phrase à la première personne dans le carnet — « depuis ta première mission tu as vécu…, la Terre a vécu… »
- [x] 1.4 vérifié dans la page (`VERIF`), publié, cliquets d'aplomb

## P2 — Simulation / cinéma

- [x] 2.1 sourcer la densité du champ d'étoiles depuis l'amas nucléaire → `contenu.js`, gardé par `outil-verif-contenu.js` — fait, et la réponse déborde : fiche « Le ciel de là-bas », 8 sources vérifiées, 3 niveaux, 2 langues
- [x] 2.2 le module du mode (quels uniformes chaque mode commande), avec son outil
- [x] 2.3 le choix au premier passage, à côté de la langue — sous les deux lettres, une seule fabrique pour les deux sélecteurs, gardée par `outil-verif-rendu.js` (24 contrôles)
- [x] 2.4 le sort du bouton « Lumière réelle » — **il reste un bouton à part**. Jugé le 9 août au soir : « ça va » depuis l'angle « simulation + lumière réelle » — or cette vue n'existe que si les deux réglages sont indépendants. En faire un cran les rendrait exclusifs et supprimerait ce qu'il vient de juger bon.
- [x] 2.5 les aveux disent ce que « cinéma » ajoute (`aveu.js`) — et ce qui reste faux quand on l'éteint ; `selonMode` gardé par le contrat (5 sabotages) et par `outil-verif-aveu.js` (33 contrôles)
- [x] 2.6 séance `?juge` : les deux modes, en inspection — **faite le 9 août au soir, sur iPhone. Deux « ça va ». La file est vide** : sept questions, sept verdicts, deux séances.
- [ ] 2.7 **peindre le ciel** — la recherche dit qu'il n'y fait jamais nuit, que la vraie nébulosité a une forme (minispirale, anneau opaque) et que le champ est cent à cinq cents fois plus riche. Ce n'est plus un uniforme, c'est une image : à ouvrir en regardant **(HUGO)**

> **P2 est close sauf 2.7.** Les six cases qui m'appartenaient sont faites,
> vérifiées et publiées. La septième est une décision d'image, et elle ouvre en
> vrai le chantier suivant du ciel — elle n'attend pas P3.

## P3 — Le voyage vers le système solaire

> **Remis en ordre le 10 août 2026**, après le cap. Hugo : « fais-moi un plan
> pour qu'on avance », et « j'aimerais bien qu'on puisse voir le système solaire
> bientôt ». Il a tranché deux points : **d'abord la vue de loin, puis la Terre**,
> et **regarder devant et derrière part dans le même lot**.
>
> **Trois défauts vérifiés en préparant ce plan, et ils commandent l'ordre :**
>
> 1. **Le voyage ne sait pas où il arrive.** `d.id` est défini
>    (`index.html:3877-3891`) et lu nulle part. On arrive au système solaire et
>    `index.html:4185` dessine les dix orbites d'étoiles S, pendant que
>    `ui.fr.js:80-87` écrit « le trou noir est là, au centre ». Une affirmation
>    fausse à l'écran, en ligne aujourd'hui.
> 2. **Le rythme jugé n'est pas celui que le site joue.** `poseRythme` n'est
>    appelé que par `juge.js` et les outils : le bouton demandé le 7 août n'a
>    jamais été posé, et le jeu tourne sur le défaut `"fidele"`. Mesuré sur le
>    vrai trajet de 33,7 s — **3,93 décades sur 9,10 dans la première seconde**,
>    puis onze secondes d'écran figé. Et `contenu.js:1564` avoue déjà ce réglage :
>    le site annonce un bouton qui n'existe pas.
> 3. **On te ramène la tête vers le trou noir pendant tout le vol.** `recentre`
>    (`recul.js:403`, 0,8/s) tire `salon.lacet` vers l'astre à chaque image, et
>    `index.html:4017` l'applique sans condition : la main du joueur est reprise
>    l'image suivante. « Regarder devant » n'est pas d'abord une affaire de
>    vitres.
>
> L'ordre qui suit : 3.11 → 3.12 → 3.13 → 3.8 → 3.7 → 3.2 → 3.3 → 3.5.

- [x] 3.11 **le voyage sait où il arrive** — fait le 10 août. La décision est une **donnée** portée par la destination (`carte:`), pas un test dans le rendu : c'est ce qui permet de la vérifier sans lire une ligne de dessin. Un pied par destination dans les deux langues, le lieu d'aveu `arrivee` dédoublé, `poseArrivee` qui reçoit enfin la destination. `outil-verif-arrivee.js` (9 contrôles, 5 sabotages) et `VERIF.arriveeJuste()` — différentiel, la même mesure sur deux destinations : 59 008 pixels ajoutés aux étoiles S, −28 au système solaire ; défaut remis, il passe à 57 998 et rougit
- [x] 3.12 **sourcer le système solaire** — **fait le 10 août**, dans une session ouverte sur le réseau, expressément lancée pour ça : la précédente ne joignait ni `ssd.jpl.nasa.gov`, ni `arxiv.org`, ni `adsabs.harvard.edu`, ni `aanda.org`, et elle a eu raison de ne rien écrire plutôt que d'écrire de mémoire. **Cinq sources relevées à leur source publiée**, chaque page ouverte, chaque chiffre lu à sa table — `SOURCES-SOLAIRE.md` garde l'adresse et la ligne : les demi-grands axes (table 1 du JPL, d'après Standish & Williams 1992, avec ses deux réserves écrites — un ajustement n'est pas une moyenne, et la ligne « Terre » est le barycentre Terre-Lune) ; l'unité astronomique, dont la résolution UAI 2012 B2 a été lue dans le document primaire et citée via la brochure du BIPM, faute d'adresse stable chez l'UAI ; les valeurs nominales et le point zéro bolométrique de Prša et al. 2016 ; les masses de DE440 ; et le nuage de Oort par Dones, Weissman, Levison & Duncan 2004, trouvé en accès libre chez ASP après que *Comets II* et *Space Science Reviews* eurent refusé. Plus la fiche **`f-solaire`, « Le système solaire vu du dehors »**, trois niveaux dans les deux langues, patron `f-ciel` : elle sépare ce qui est publié de ce qui est dérivé ici, et elle porte les réserves des auteurs plutôt que de les taire. Planchers relevés : 47 sources avec lien (de 42), 246 textes sourcés (de 240). **`outil-verif-solaire.js`, 49 contrôles**, et sa vérité vient d'ailleurs (règle 3) : il ne porte PAS les demi-grands axes, il les **reconstruit** par la troisième loi de Kepler depuis la colonne voisine des taux de longitude moyenne et les (𝒢M) de DE440 — il retombe à 20 ppm de Mercure à Saturne, 400 ppm sur Neptune, et il **avoue** ce qu'il ne peut pas voir. Il ferme aussi une boucle que personne ne fermait : ce que la fiche AFFIRME et ce que le code CALCULE sont désormais le même nombre. Six sabotages en mémoire, quatre sabotages sur les vrais fichiers, tous rougissent. **Relevé au passage** : l'UA a **quatre** écrivains et non cinq — `index.html:3877` déclare le parsec ; et la page JPL *Astrodynamic Parameters* attribue l'UA à « IAU 2012 Resolution B1 », alors que c'est B2. `jplSatellites`, `jplElements`, `jplPlanetes` et `codata2018` restent dans `lune.js` : la fiche n'en dit rien, et le contrat refuse à raison une source que personne ne cite
- [ ] 3.13 **le Soleil et les étiquettes** — `solaire.js` et `etiquettes.js`, deux modules neufs : il n'existe aujourd'hui **aucun** mécanisme d'étiquette posée sur un objet du monde, et **aucune** loi magnitude → éclat. Réemployer `lune.js:255` (`2·arcsin(R/d)`, qui refuse de répondre quand on est dedans) et surtout sa doctrine `lune.js:41-54` : **sous le demi-pixel on ne dessine rien**, on montre le grossissement qu'il faudrait — c'est mot pour mot « on ne le verrait même pas ». `etiquettes.js` ne touche ni au DOM ni à WebGL : il reçoit des points projetés et rend des placements, la page dessine. Vérité d'ailleurs : positions recalculées par une seconde voie, magnitudes dérivées de la luminosité


- [ ] 3.1 le départ — ~~la destination s'accepte, le prix reste affiché~~ **fait le 9 août : on part, et la carte porte le prix sur sa propre ligne** ; ~~`inactif-8` (780 000 t) + MP3~~ **fait**. Reste la comparaison sondes réelles, sourcée
- [ ] 3.2 le recul galactique — **le quadrillage tient les neuf décades** (année-lumière, et les mots viennent enfin de la page : il écrivait « une case = 1 000 UA » en dur, en français) ; ~~table `DESTINATIONS` morte supprimée~~ **fait**. Reste `echelle.js`, et **le rythme**, en deux temps :
  - **3.2a le bouton et le défaut** — le site avoue un réglage qui n'a pas de bouton. Réparation courte. Le défaut est **(HUGO)** : ma recommandation est *régulier*, celui qu'il a jugé « ça va », parce que *fidèle* fige l'écran onze secondes sur ce trajet
  - **3.2b le rythme symétrique** — et c'est là qu'est le piège de la règle 4 : le quadrillage et la carte des orbites ne s'accordent aujourd'hui que **par coïncidence**, chacun employant 1/distance de son côté (`verif.js:1034` l'exige). La sortie propre n'est pas d'exempter le système solaire, c'est d'**écrire la loi une seule fois** et de la faire lire par les deux. Ce qui casse : les 13 contrôles de `outil-verif-recul.js:105-210` pilotent le dessin dans un état de trajet dégénéré (`d0 === d1`) — c'est la règle 5 ; le contrôle 358 **resterait vert pour de mauvaises raisons** ; le 233 verrait son sens inversé ; le 476 ne verrait pas le yo-yo rₛ→UA→al→UA→rₛ. **Et aucun des 80 contrôles ne balaie le temps** : rien ne vérifie qu'une frontière de décade se traverse sans saut. Trois contrôles à écrire
- [x] 3.8 **regarder autour de soi pendant le vol** — **fait et jugé « ça va » le 10 août au soir**, angle « en partant, je tourne », fenêtre 1 078 × 1 304. Il n'a pas fallu de vitres : le recentrage se tait dès que la main touche à la visée, et pour le reste du trajet. Trois contrôles dans `outil-verif-recul.js`, dont celui qui rend les autres sérieux — « main au repos, il ramène bien la visée », sans quoi un recentrage mort passerait au vert. Les vitres aux quatre coins restent possibles, non urgentes, et appartiennent à P4. *(trace de la demande d'origine ci-dessous)* — demandé le 9 août : « qu'on puisse regarder devant, comme dans un cockpit, ou derrière ; peut-être des vitres sur les quatre coins ». **La cause vraie n'est pas la baie** : `recentre` te reprend la visée à chaque image. Le plus petit remède honnête est que la main du joueur gagne — le recentrage garde son rôle quand on ne fait rien, et se tait dès qu'on tourne la tête. Les vitres aux quatre coins sont une décision de vaisseau (`vaisseau.js:40-67`), plus lourde, et elles appartiennent à P4.
- [ ] 3.9 **l'aberration relativiste** — « que si tu t'approches de la vitesse de la lumière, visuellement on voit le ciel qui se resserre devant nous ». C'est du VRAI calcul, pas un effet : le champ d'étoiles se contracte vers l'avant et se décale en couleur. Le vaisseau passe l'essentiel du trajet au-dessus de 0,9999 c, donc l'effet y est extrême. À faire dans un module éprouvable, puis dans le nuanceur.
- [ ] 3.10 **le système solaire vu de loin, avec ses étiquettes** — et c'est aussi ce qui débloque le rythme symétrique : compter les décades depuis Sagittarius, puis VERS le Soleil, demande qu'il y ait quelque chose à approcher — « une vision depuis le nuage dehors, avec des tags : ça c'est Jupiter, ça c'est truc — tout petit évidemment, on ne le verrait même pas, on verrait juste le Soleil ». L'honnêteté du site rend la chose belle : à cette distance il n'y a rien à voir, et les étiquettes disent où sont les choses qu'on ne voit pas.

- [ ] 3.3 le retournement à mi-parcours — sa seconde d'animation, les deux horloges en direct
- [ ] 3.4 les moments de cours (touche H) et le PREMIER cours : le voyage, sur `journal.js`, un seul, complet
- [ ] 3.5 l'arrivée : la Terre et la Lune — **et le dépôt se contredit sur ce point**. Cette case dit « `lune.js` branché » ; `tout.js:232-234` dit « ÉCARTÉ — décision d'Hugo du 6 août, on lui reproche de ne pas être sourçable ». Les deux ne peuvent pas être vraies : **question posée à Hugo le 10 août, sans réponse pour l'instant (HUGO)**. Si on le branche : 58 affirmations le gardent déjà et ses données viennent du JPL et de l'UAI, mais ses textes sont en français en dur (`lune.js:171-232, 851-963`) et son registre de sources est parallèle au contrat — mise aux normes, pas obstacle de fond
- [ ] 3.6 les textes des moments de cours — sa voix, sourcée **(HUGO)**
- [ ] 3.7 séances `?juge` : le retournement, l'arrivée **(HUGO)**

## P4 — Le vaisseau à ponts

- [ ] 4.1 la maquette d'UN pont nouveau au moteur maison (`habitacle.js`, `vaisseau.js`, `arpente.js`), le pont = un LIEU
- [ ] 4.2 la décision moteur — maison ou commerce — en regardant la maquette, pas sur un argument **(HUGO)**

## P5 — La salle de tir et le mémorial

- [ ] 5.1 le tir à zéro et l'aperçu de trajectoire (`integre` + `montreTraj`), avec leur outil
- [ ] 5.2 le mémorial : circonstance en entier, noms composés, « disparu » — et `CHUTE.md` branché
- [ ] 5.3 la vue extérieure d'une sonde (module neuf, patron `robot.js`)
- [ ] 5.4 séance `?juge` sur la salle entière **(HUGO)**

## Le solde

- [x] la raison de `ncorps.js` dans `tout.js` réécrite vers le bac à sable (décidé le 10 août)
- [ ] la réplique de Lumen au poste horaire — sa voix **(HUGO)**
- [ ] l'aberration du salon, la vitesse du manche, les écrans à 44 cm **(HUGO)**
