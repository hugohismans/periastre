## ~~ARRÊT — 3.13 est en cours d'écriture dans une AUTRE session~~ — LEVÉ le 11 août

> La session voisine a fusionné : `approche.js`, `etiquettes.js`, `solaire.js` et
> le rivage sont sur `main`. La case 3.5 s'est branchée dessus plutôt qu'à côté —
> elle en est la dernière marche. L'avertissement ci-dessous reste pour mémoire.

## ARRÊT (levé) — 3.13 était en cours d'écriture dans une AUTRE session, 11 août 9 h 40

Le hook vient de me pousser sur 3.13, et il a raison de le faire : la case est
vide. Mais `solaire.js` est déjà écrit et publié, et `etiquettes.js` est en train
d'être écrit à cette minute par la session « Le Soleil et les étiquettes »
(`claude/periastre-scene-solaire`), lancée exprès pour ça.

**L'écrire ici en ferait une deuxième version du même module.** C'est mot pour
mot la maladie que ce dépôt traque — deux vérités pour une chose, dont une
invisible — et on la paierait au moment de la fusion, sur le seul fichier que
personne ne peut arbitrer à ma place.

Et la seconde raison est honnête : **la mémoire de cette conversation est
épuisée**. Elle a porté la remise à plat du cap, le plan, quatre étapes, deux
séances et le branchement de ce hook. Écrire un module neuf maintenant produirait
du code que je ne pourrais plus relire.

**Comment lever cet arrêt** — supprimer ces lignes quand la branche
`claude/periastre-scene-solaire` est fusionnée sur `main` et la case 3.13 cochée.
Un réveil est armé pour 11 h 40 et fait exactement ça.

*Ceci n'est pas un contournement du hook : c'est la porte de sortie qu'il décrit
lui-même, employée pour la raison qu'elle prévoit — quelque chose qui ne se
tranche pas en enchaînant.*

---

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
> 2. ~~**Le rythme jugé n'est pas celui que le site joue.**~~ **RÉPARÉ LE
>    11 AOÛT — voir 3.2a.** `poseRythme` n'était appelé que par `juge.js` et les
>    outils : le bouton demandé le 7 août n'avait jamais été posé, et le jeu
>    tournait sur le défaut `"fidele"`. Mesuré sur le vrai trajet de 33,7 s —
>    **3,93 décades sur 9,10 dans la première seconde**, puis douze secondes
>    d'écran figé. Et `contenu.js` avouait déjà ce réglage : le site annonçait un
>    bouton qui n'existait pas. Le bouton est posé, gardé par un contrôle qui
>    exige qu'un aveu de réglage trouve son réglage. **Et le DÉFAUT est tranché :
>    séance du 11 août sur iPhone, `fidele` reste — le premier choix qui engage
>    vraiment, puisque le bouton existe.**
> 3. **On te ramène la tête vers le trou noir pendant tout le vol.** `recentre`
>    (`recul.js:403`, 0,8/s) tire `salon.lacet` vers l'astre à chaque image, et
>    `index.html:4017` l'applique sans condition : la main du joueur est reprise
>    l'image suivante. « Regarder devant » n'est pas d'abord une affaire de
>    vitres.
>
> L'ordre qui suit : 3.11 → 3.12 → 3.13 → 3.8 → 3.7 → 3.2 → 3.3 → 3.5.
>
> *Au 11 août : 3.11, 3.12, 3.13, 3.10, 3.14 et 3.8 sont clos. Reste 3.2 — le
> rythme symétrique, qu'il y a maintenant de quoi débloquer, puisqu'il y a enfin
> quelque chose vers quoi s'approcher.*

- [x] 3.11 **le voyage sait où il arrive** — fait le 10 août. La décision est une **donnée** portée par la destination (`carte:`), pas un test dans le rendu : c'est ce qui permet de la vérifier sans lire une ligne de dessin. Un pied par destination dans les deux langues, le lieu d'aveu `arrivee` dédoublé, `poseArrivee` qui reçoit enfin la destination. `outil-verif-arrivee.js` (9 contrôles, 5 sabotages) et `VERIF.arriveeJuste()` — différentiel, la même mesure sur deux destinations : 59 008 pixels ajoutés aux étoiles S, −28 au système solaire ; défaut remis, il passe à 57 998 et rougit
- [x] 3.12 **sourcer le système solaire** — **fait le 10 août**, dans une session ouverte sur le réseau, expressément lancée pour ça : la précédente ne joignait ni `ssd.jpl.nasa.gov`, ni `arxiv.org`, ni `adsabs.harvard.edu`, ni `aanda.org`, et elle a eu raison de ne rien écrire plutôt que d'écrire de mémoire. **Cinq sources relevées à leur source publiée**, chaque page ouverte, chaque chiffre lu à sa table — `SOURCES-SOLAIRE.md` garde l'adresse et la ligne : les demi-grands axes (table 1 du JPL, d'après Standish & Williams 1992, avec ses deux réserves écrites — un ajustement n'est pas une moyenne, et la ligne « Terre » est le barycentre Terre-Lune) ; l'unité astronomique, dont la résolution UAI 2012 B2 a été lue dans le document primaire et citée via la brochure du BIPM, faute d'adresse stable chez l'UAI ; les valeurs nominales et le point zéro bolométrique de Prša et al. 2016 ; les masses de DE440 ; et le nuage de Oort par Dones, Weissman, Levison & Duncan 2004, trouvé en accès libre chez ASP après que *Comets II* et *Space Science Reviews* eurent refusé. Plus la fiche **`f-solaire`, « Le système solaire vu du dehors »**, trois niveaux dans les deux langues, patron `f-ciel` : elle sépare ce qui est publié de ce qui est dérivé ici, et elle porte les réserves des auteurs plutôt que de les taire. Planchers relevés : 47 sources avec lien (de 42), 246 textes sourcés (de 240). **`outil-verif-solaire.js`, 49 contrôles**, et sa vérité vient d'ailleurs (règle 3) : il ne porte PAS les demi-grands axes, il les **reconstruit** par la troisième loi de Kepler depuis la colonne voisine des taux de longitude moyenne et les (𝒢M) de DE440 — il retombe à 20 ppm de Mercure à Saturne, 400 ppm sur Neptune, et il **avoue** ce qu'il ne peut pas voir. Il ferme aussi une boucle que personne ne fermait : ce que la fiche AFFIRME et ce que le code CALCULE sont désormais le même nombre. Six sabotages en mémoire, quatre sabotages sur les vrais fichiers, tous rougissent. **Relevé au passage** : l'UA a **quatre** écrivains et non cinq — `index.html:3877` déclare le parsec ; et la page JPL *Astrodynamic Parameters* attribue l'UA à « IAU 2012 Resolution B1 », alors que c'est B2. `jplSatellites`, `jplElements`, `jplPlanetes` et `codata2018` restent dans `lune.js` : la fiche n'en dit rien, et le contrat refuse à raison une source que personne ne cite
- [x] 3.13 **le Soleil et les étiquettes** — **fait le 11 août**, et la case en a emporté 3.10 avec elle. Trois modules neufs et rien de tout ça dans la page. **`etiquettes.js`** : le mécanisme générique « point du monde → étiquette », dont la première responsabilité est de SE TAIRE — trois silences distincts (derrière le plan de coupure, hors du cadre, trop près d'une étiquette déjà posée) et **aucun seuil de repli**, un appelant qui ne dit pas son écartement n'obtient rien. Sa loi est la MÊME que celle de `solaire.js`, et c'est prouvé et non affirmé : `outil-verif-etiquettes.js` (19 contrôles, 5 sabotages) confronte les deux réponses sur 73 distances, de 30 à 30 000 ua, et exige l'accord partout. Les deux tests de `solaire.js` — « assez loin du Soleil », « assez loin de la dernière retenue » — s'y révèlent être le même test, le Soleil n'étant qu'une étiquette de plus. Le sabotage qui compte est celui que la ligne ne voit pas : comparer à la seule dernière retenue reste vert sur les planètes et rougit sur cent vingt points serrés. **Le Soleil** est dans `solaire.js`, doctrine de `lune.js:41-54` : son disque reste sous le demi-pixel PARTOUT dans la scène — 9 millièmes de pixel à 1 000 ua, le premier pixel à 8,8 ua, c'est-à-dire dans l'orbite de Saturne — donc on ne dessine jamais de disque, on dit le grossissement qu'il faudrait. Mais il RAYONNE, et c'est la différence avec le trou noir de masse lunaire : magnitude bolométrique apparente **dérivée** de la luminosité nominale et du point zéro de l'UAI, jamais recopiée. La boucle se referme sur la fiche : elle affirme −5,3 au bord du nuage, le module calcule −5,33 ; elle dit « un dixième de seconde d'arc », il trouve 0,096″ ; et l'irradiance à 1 ua retombe sur les 1 361 W/m² de la même table, que personne n'a écrits
- [x] 3.10 **le système solaire vu de loin** — **fait le 11 août**, cadrage d'Hugo respecté à la lettre : on arrive dans le nuage de Oort à **20 000 ua** — le bord interne du nuage externe, Dones et al. 2004, le chiffre que la fiche porte déjà — et l'on TOMBE. `approche.js` tient la scène, `outil-verif-approche.js` la garde (38 contrôles, 6 sabotages). **L'arrivée ne s'écrit pas** : elle se cherche par la loi de nommage elle-même, à la distance où le cinquième nom tient debout — 119,7 ua, quatre fois l'orbite de Neptune, et la consigne « plus loin que 1 000 ua » est tenue avec une marge de huit. **La chute est un vrai vol à 1 g** — un an à bord, dix-sept secondes d'écran — et c'est LA MÊME LOI que le grand trajet : elle a été sortie du corps d'`avance` dans `RECUL.ou` pour ça, et les deux trajets s'y accordent à 8 × 10⁻¹⁵ près. La vérité vient de la physique et pas du module : un vol qui accélère puis freine est à mi-DISTANCE à mi-temps propre, ce qu'aucune courbe de confort ne fait — et le sabotage le prouve, puisqu'une droite passe elle aussi au milieu et n'est attrapée que par la comparaison à `RECUL.ou`. **Ce qu'on dessine sont des ANNEAUX, pas des orbites** : les colonnes du JPL donnent le demi-grand axe et rien d'autre — ni la phase, ni l'inclinaison vue d'ici — donc on trace le cercle qui BORNE l'écart au Soleil, et l'aveu `anneaux-solaires` le dit au visiteur. Deux régimes mesurés : 0 nom depuis le nuage, 5 en bas, aucun perdu en chemin, et quatre apparitions séparées — le passage EST la scène
- [x] 3.14 **le vaisseau se retourne en arrivant** — **défaut trouvé à l'œil le 11 août**, en regardant la première image de la scène : le Soleil n'était pas mal placé, il était ABSENT. La baie regarde l'astre pendant tout le vol, ce qui est exactement ce qui rend le recul visible — mais on arrive alors DOS à sa destination, puisqu'elle est au bout du rayon qu'on a suivi. Vingt-sept mille années-lumière pour arriver le nez contre une cloison. Aucun outil ne pouvait le dire : `approche.js` rendait les bons nombres, et il les rendait ; ce qui manquait était l'orientation de la pièce autour de lui. Le remède tient en une ligne dans `camera.js` — un demi-tour AJOUTÉ à la dérive que la baie faisait déjà, même axe, même formule de Rodrigues, parce qu'une seconde rotation écrite à côté aurait été une seconde loi pour l'orientation d'une même pièce. Trois secondes de manœuvre, derrière le panneau d'arrivée. Règle 1 : `VERIF.sceneSolaire()`, 8 contrôles dans la page, dont les deux moitiés qui doivent être vraies ensemble — avant le demi-tour rien, après quelque chose. **Et sa mesure aussi m'a repris** : elle comptait tous les pixels peints, le voile de la scène couvre toute la baie à n'importe quelle distance, et « bien moins qu'en bas » passait au vert à vingt-deux pixels près en ne mesurant rien. On compte les pixels CLAIRS : 972 en bas, 75 dans le nuage, 0 quand on regarde ailleurs


- [ ] 3.1 le départ — ~~la destination s'accepte, le prix reste affiché~~ **fait le 9 août : on part, et la carte porte le prix sur sa propre ligne** ; ~~`inactif-8` (780 000 t) + MP3~~ **fait**. Reste la comparaison sondes réelles, sourcée
- [ ] 3.2 le recul galactique — **le quadrillage tient les neuf décades** (année-lumière, et les mots viennent enfin de la page : il écrivait « une case = 1 000 UA » en dur, en français) ; ~~table `DESTINATIONS` morte supprimée~~ **fait**. Reste `echelle.js`, et **le rythme**, en deux temps :
  - [x] **3.2a le bouton — POSÉ le 11 août, ET LE DÉFAUT EST TRANCHÉ** : séance du 11 août sur iPhone, « ça va » sur « fidèle, au départ ». **`fidele` reste**, et c'est le premier choix qui engage vraiment, puisque le bouton existe. L'angle qu'il a gardé est celui où fidèle est bon — son défaut mesuré est à la FIN (douze secondes à l'arrêt), et `A-REGARDER.md` le dit — le site avouait un réglage qui n'avait pas de bouton : `poseRythme` n'était appelé que par `juge.js` et par les outils, quatre jours après le « fais les deux, paramétrable dans les options » du 7 août. Le sélecteur est dans les réglages, à côté du rendu, fabrique unique et liste de repeints ; le choix se range sous sa propre clé (`periastre.rythme`), écrite au clic et jamais ailleurs — `CHAMPS` ne range pas de chaînes, et la panne du 7 août venait d'une mémoire écrite trop souvent. **Trouvé en posant le bouton** : `rangeGrandTrajet` remettait « fidele » en dur à la sortie de séance ; c'était juste tant que rien n'était réglable, ça effaçait désormais le choix du joueur — la séance retient maintenant ce qu'elle a trouvé et le repose. **Le contrôle qui manquait** est dans `outil-verif-aveu.js` (groupe 8) : un aveu posé dans un panneau de réglage doit nommer son hôte (`regle:`), cet hôte doit exister dans le balisage **et** la page doit le remplir — un `<div>` vide sous une étiquette est encore un réglage qui n'existe pas. Sa vérité vient de deux fichiers qui ne se connaissent pas, `contenu.js` et `index.html`. Éprouvé faillible trois fois sur le vrai dépôt (hôte renommé, sélecteur retiré, `regle` effacé) et trois fois sur des pages fabriquées. Vingt-deux contrôles de plus dans `outil-verif-recul.js`, dont la liste des rythmes prouvée **par le comportement** de `avance` et non crue sur parole. Mesuré sur le vrai trajet (9,10 décades, 33,7 s) : fidèle 3,93 décade dans la première seconde et douze secondes finales à l'arrêt, freinage à 50 % ; régulier 0,00 et freinage à 79,8 %. **Le défaut reste `fidele`, et c'est désormais SON choix** — rendu le 11 août, sur iPhone, le bouton en main. Un contrôle garde ce défaut pour qu'il ne bascule pas par accident : le jour où il répond, c'est cette ligne-là qu'on change, exprès
  - [x] **3.2c les coquilles se DESSINENT, et le vaisseau a une vitre avant** — **fait le 14 août.** La loi était posée et gardée par 133 contrôles depuis le 12 ; personne ne dessinait rien. **La seconde forme a disparu au lieu d'être écrite** : une coquille est une sphère, ses parallèles sont θ constant, et **la silhouette EST une parallèle**, celle de θ = acos(R/d), qui n'existe que si R < d — c'est-à-dire exactement quand la coquille est franchie. Le cercle qui rétrécit derrière et les anneaux qu'on traverse devant sont le même trait à deux valeurs de θ ; rien n'est ajouté pour le régime du dehors, il apparaît et disparaît seul. **Aucune échelle** : le vaisseau se déplace vraiment dans le repère du monde (`majVoyage` pose `salon.p`), dont l'unité est le rayon de Schwarzschild, donc 10ⁿ rₛ se dessine à 10ⁿ. **Le contrôle qui porte la critique d'Hugo** : sur tout le trajet le rayon d'une coquille ne dérive pas de 8 × 10⁻¹⁶ sur douze décades, quand la maille du quadrillage est multipliée par 1,0 × 10⁹ — le témoin est nécessaire, sans lui « ça ne bouge pas » ne prouverait rien. **Deux contrôles m'ont repris** : j'ai d'abord exigé que le rayon ANGULAIRE du bord ne saute pas à la traversée (mesuré 1,549 rad) en confondant l'angle polaire du trait, qui tend vers 0, avec l'angle sous-tendu, qui tend vers π/2 — et le second ne DOIT pas être continu, dedans la coquille couvre tout le ciel et dehors la moitié ; puis les trois sabotages sont restés verts parce que je remplaçais les fonctions sur l'objet exporté quand le dessin les appelle par leur nom de module. On casse le FICHIER, par `casse`. **Et l'angle sous-tendu est MAXIMAL au point de tangence**, donc une erreur d'angle ne s'y voit qu'au second ordre — c'est la tangence qui réagit au premier ordre. **Le quadrillage reste sous la main** dans les réglages : les deux portent les neuf décades, donc aucun calcul ne les départage, et le geste se juge à l'œil (plafond de taille +42, argumenté sur place ; la dette écrite est l'unification des trois fabriques de sélecteurs). **La vitre avant** ouvre la cloison arrière — piège évité : la faire entrer dans `vitres()` aurait déplacé l'ancre Terre–Lune, qui est la moyenne de cette liste. **Deux défauts trouvés à l'œil** : le repère s'éteignait dès qu'on se retournait (`enVue` mesurait l'astre et non l'AXE — `enVueAxe`), et surtout **le nuage de Oort était peint pendant tout le grand trajet** — `APPROCHE.dessine` testait `S()`, qui rend un module toujours chargé, et le calque ne se découpant qu'à la baie, qui regarde en arrière, la scène était peinte et jetée à chaque image depuis des jours. Une ouverture neuve a été le premier outil capable de le voir. 153 contrôles dans `outil-verif-recul.js`, 23 dans `outil-verif-arpente.js`, 40 dans `outil-verif-approche.js`
  - **3.2b le rythme symétrique** — et c'est là qu'est le piège de la règle 4 : le quadrillage et la carte des orbites ne s'accordent aujourd'hui que **par coïncidence**, chacun employant 1/distance de son côté (`verif.js:1034` l'exige). La sortie propre n'est pas d'exempter le système solaire, c'est d'**écrire la loi une seule fois** et de la faire lire par les deux. Ce qui casse : les 13 contrôles de `outil-verif-recul.js:105-210` pilotent le dessin dans un état de trajet dégénéré (`d0 === d1`) — c'est la règle 5 ; le contrôle 358 **resterait vert pour de mauvaises raisons** ; le 233 verrait son sens inversé ; le 476 ne verrait pas le yo-yo rₛ→UA→al→UA→rₛ. **Et aucun des 80 contrôles ne balaie le temps** : rien ne vérifie qu'une frontière de décade se traverse sans saut. Trois contrôles à écrire
- [x] 3.8 **regarder autour de soi pendant le vol** — **fait et jugé « ça va » le 10 août au soir**, angle « en partant, je tourne », fenêtre 1 078 × 1 304. Il n'a pas fallu de vitres : le recentrage se tait dès que la main touche à la visée, et pour le reste du trajet. Trois contrôles dans `outil-verif-recul.js`, dont celui qui rend les autres sérieux — « main au repos, il ramène bien la visée », sans quoi un recentrage mort passerait au vert. Les vitres aux quatre coins restent possibles, non urgentes, et appartiennent à P4. *(trace de la demande d'origine ci-dessous)* — demandé le 9 août : « qu'on puisse regarder devant, comme dans un cockpit, ou derrière ; peut-être des vitres sur les quatre coins ». **La cause vraie n'est pas la baie** : `recentre` te reprend la visée à chaque image. Le plus petit remède honnête est que la main du joueur gagne — le recentrage garde son rôle quand on ne fait rien, et se tait dès qu'on tourne la tête. Les vitres aux quatre coins sont une décision de vaisseau (`vaisseau.js:40-67`), plus lourde, et elles appartiennent à P4.
- [x] 3.15 **l'arrivée refaite après son « super nul »** — **fait le 16 août**, sur ses trois points. **Les vraies photos** : il avait raison, les cartes de la NASA étaient dans le dépôt depuis le 11 août et seule `rivage.html` s'en servait ; le registre sort dans `atlas.js` (recopier la liste aurait donné deux tables pour six images) et la projection orthographique est écrite en pixels, éprouvée contre le nuanceur du rivage — deux algèbres sans une ligne commune, d'accord à 10⁻¹² sur 1 748 points, ce qui attrape une inversion du nord qu'aucun œil ne rattrape sur la Lune. **Les étiquettes** : `etiquettes.js` était écrit, éprouvé et déjà chargé, personne ne l'appelait ; la Lune est au rang zéro, donc c'est elle qui parle quand les deux se marchent dessus — le sabotage échange les rangs et le COMPTE d'étiquettes ne bouge pas, seule celle qui compte disparaît. **Le voyage d'un seul tenant** : les deux cartes du panneau sont parties, le raccord se dérive du demi-pixel de la Terre et de son demi-grand axe (1,08 ua du Soleil), 119,7 ua cesse d'être une fin pour devenir un passage, le disque du Soleil suit enfin `soleilVu.dessinable` puisqu'on descend sous 8,8 ua, et le carnet reçoit UNE ligne qui est la somme des deux trajets calculés. **Trois défauts trouvés en chemin** : l'aveu disait « reliefs évoqués » devant une photographie (les deux moitiés justes, la faute dans leur rapport) ; une question de séance n'avait jamais déclaré sa forme et passait au vert grâce à la prose qui la suivait ; et la dernière marche avançait dans `dessineVoyage`, donc le TEMPS de la scène dépendait de son AFFICHAGE — la maladie de `couture()` en plus discret. Deux compromis déclarés (la face qu'on regarde, le rayon qu'on descend). `outil-verif-atlas.js` (25 contrôles), `outil-verif-terrelune.js` (95, de 81), `VERIF.voyageDunSeulTenant()` (10 contrôles, 4 sabotages sur le vrai dépôt)
- [ ] 3.16 **les vraies ellipses des orbites** — sa question du 16 août : « les orbites sont circulaire ? je pensais que c'etait plus eliptique que ca ». **BLOQUÉ PAR LE RÉSEAU, PAS PAR LE TRAVAIL** : le dépôt ne porte l'excentricité d'aucune planète, la table du JPL qui les donne n'était joignable depuis aucune adresse de cette machine, et l'on n'écrit rien de mémoire (règle 7 — tenue exactement ici le 10 août). Tout est préparé dans `SOURCES-SOLAIRE.md` §7 : l'adresse de la table, les deux colonnes qu'il faut (e et la longitude du périhélie), et le rappel que b se dérive. **À reprendre depuis une machine en réseau.**
- [ ] 3.9 **l'aberration relativiste** — « que si tu t'approches de la vitesse de la lumière, visuellement on voit le ciel qui se resserre devant nous ». C'est du VRAI calcul, pas un effet : le champ d'étoiles se contracte vers l'avant et se décale en couleur. Le vaisseau passe l'essentiel du trajet au-dessus de 0,9999 c, donc l'effet y est extrême. À faire dans un module éprouvable, puis dans le nuanceur.
- [x] 3.10 — **fait**, remonté avec 3.13 et 3.14 (voir plus haut). *(le cadrage tranché par Hugo le 10 août au soir, et le chiffrage qui l'a servi, restent dans `A-REGARDER.md`.)*

- [ ] 3.3 le retournement à mi-parcours — sa seconde d'animation, les deux horloges en direct
- [ ] 3.4 les moments de cours (touche H) et le PREMIER cours : le voyage, sur `journal.js`, un seul, complet
- [x] 3.5 **l'arrivée : la Terre et la Lune** — **FAIT LE 11 AOÛT.** La contradiction du dépôt est tranchée par Hugo : `lune.js` est branché, et sa raison était juste — « tu m'en parles, tu m'en parles, mais toujours pas vu ». **Elle est la DERNIÈRE MARCHE de la scène solaire**, pas une arrivée concurrente : la session voisine a posé le même jour l'arrivée dans le nuage de Oort et la chute vers les géantes (3.10, 3.13), et une troisième carte du panneau — « continuer jusqu'à la Terre » — ne paraît qu'une fois cette chute finie. Les deux mouvements se suivent : rien à voir, puis les noms deviennent vrais, puis chez nous. `terrelune.js` fait tomber le vaisseau vers le couple, du demi-pixel de `lune.js` (le seuil sous lequel on ne dessine rien — la Terre APPARAÎT au lieu d'être déjà là) jusqu'à la moitié de la baie, à taux relatif constant, la loi de `recul.js`. **Aucun chiffre d'astre dans le module**, et un contrôle relit son source pour l'exiger : rayons, masses et demi-grand axe viennent de `lune.js`. Les pixels viennent de la focale du site. Le terminateur est calculé, une seule lumière pour les deux astres — et c'est physique, leurs directions d'éclairement diffèrent de 0,147°. **Ce que la scène est venue dire** : trente diamètres terrestres d'écart, donc au dernier instant où la Lune tient dans la baie la Terre ne fait que dix-huit pixels ; aucune image ne peut montrer les deux gros à la fois, et la chute traverse ce moment au lieu de s'y arrêter. **Trois défauts trouvés EN REGARDANT, chacun devenu un contrôle** : la scène posée dans le dos du joueur (`projette` rendait `null`), le voile qui tombait d'un coup, et l'azimut de la Lune — sur lequel le contrôle m'a corrigé en chiffrant ce que je croyais avoir vu. **Et l'aveu qui est le vrai apport** : le vaisseau ne se déplace jamais, donc la baie peignait encore le trou noir qu'on venait de quitter pendant que le panneau écrivait qu'il était à vingt-sept mille années-lumière derrière. On voile, et on le déclare — douzième compromis, sous `arrivee-soleil`. Fiche « La Terre et la Lune, de loin » et quatre sources montées du registre parallèle de `lune.js`, les trois pages du JPL rouvertes. `outil-verif-terrelune.js`, 76 contrôles, six sabotages. **Reste à trancher par Hugo, dans `?juge`** : le moment « les deux ensemble » est-il trop maigre ? On peut décaler le cadrage pour y doubler la Terre, au prix d'un cadrage choisi et non subi
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
