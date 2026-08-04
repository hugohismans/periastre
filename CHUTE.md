# La chute — physique sourcée de la séquence de franchissement

Document de référence pour la mission « franchir l'horizon de Sagittarius A* ».
Il fixe ce que la séquence a le droit de montrer, ce qu'elle doit raconter aux
trois niveaux de lecture, et d'où sort chaque chiffre. Aucun code ici : que de
la physique.

**Conventions.** Chaque affirmation porte une clé de source entre crochets,
au format du registre `sources` de `contenu.js`. Les clés déjà présentes dans
le registre sont réutilisées telles quelles ; les clés nouvelles sont définies
en §8 et sont à ajouter au registre. `[calcul]` signale une valeur recalculée
ici à partir des constantes ci-dessous, avec le calcul en note quand le
résultat surprend — même convention que `SOURCES.md`.

**Constantes.** CODATA/IAU (G = 6,674 30 × 10⁻¹¹ m³ kg⁻¹ s⁻²,
c = 299 792 458 m/s, M☉ = 1,988 92 × 10³⁰ kg) et M = 4,297 × 10⁶ M☉
[gravity2021]. Dérivées, identiques au tableau de `SOURCES.md` :

| Grandeur | Valeur | Rôle |
|---|---|---|
| GM/c³ | 21,17 s | l'unité de temps naturelle du trou noir |
| r_s = 2GM/c² | 1,269 × 10⁷ km | rayon de l'horizon |
| r_s/c | 42,34 s | temps de traversée lumière de r_s |
| πGM/c³ | **66,5 s** | temps propre maximal sous l'horizon |
| (4/3)GM/c³ | **28,2 s** | temps propre sous l'horizon, chute depuis l'infini |

**Scénario de référence.** Chute **radiale libre depuis le repos à l'infini**
(énergie conservée par unité de masse E = 1, la trajectoire « pluie » des
manuels [taylor2000] [hartle2003]). C'est la trajectoire la plus simple à
sourcer et celle que la littérature de visualisation utilise [muller2008]
[riazuelo2019]. Un vaisseau qui se laisse tomber depuis notre orbite de
22 r_s en diffère de moins de 3 % sur les durées intérieures [calcul] — la
table de §5 reste valable.

---

## 1. Le temps propre disponible sous l'horizon

### Découverte

Une fois la frontière franchie, il te reste **moins d'une minute et demie à
vivre, quoi que tu fasses**. Ce n'est pas une question de solidité du
vaisseau : c'est le temps lui-même qui s'épuise. À l'intérieur, se rapprocher
du centre n'est plus un choix, comme demain n'est pas un choix. Et voici le
plus étrange : **allumer les moteurs à fond pour résister fait mourir plus
tôt**. Le mieux que tu puisses faire, c'est de te laisser tomber. Pour notre
trou noir, la limite absolue est de 66 secondes ; en tombant tout droit sans
freiner, tu en auras 28 [misner1973] [lewis2007] [calcul].

### Curieux

Sous l'horizon, la coordonnée r n'est plus une distance mais un **temps** :
r = 0 est un instant futur, pas un lieu [misner1973]. Le temps propre restant
est donc borné. La borne vaut

> τ_max = π GM/c³ ≈ **66,5 s** pour Sgr A* [misner1973] [lewis2007] [calcul]

et elle est atteinte par une seule trajectoire : la chute **libre** qui
franchit l'horizon avec une vitesse nulle « au repos à l'horizon » (E = 0, cas
limite). Tomber depuis très loin donne moins — 28,2 s — parce qu'on traverse
l'horizon déjà lancé : à l'intérieur, bouger par rapport à la trajectoire
optimale « dilate » ton temps exactement comme en relativité restreinte, et
du temps dilaté ici, c'est du temps perdu [lewis2007].

Le point contre-intuitif : **pousser vers l'extérieur raccourcit la vie**.
Lewis et Kwan l'ont quantifié : une poussée brève et bien dosée peut ramener
une trajectoire trop rapide vers l'optimum (donc gagner du temps), mais toute
poussée au-delà — notamment « résister » en continu — fait perdre du temps
propre. Se débattre tue plus vite ; la borne des 66 s reste infranchissable
[lewis2007].

### Astrophysicien

Pour une trajectoire radiale d'énergie conservée Ẽ = E/mc² en Schwarzschild,
le temps propre entre l'horizon et la singularité vaut

> τ(Ẽ) = ∫₀^{r_s} dr / ( c √( Ẽ² − 1 + r_s/r ) )  [misner1973]

- Ẽ = 0 : τ = (π/2) r_s/c = **π GM/c³ = 66,5 s**. C'est le maximum global :
  parmi toutes les lignes d'univers de genre temps joignant l'horizon à
  r = 0, la géodésique maximise τ (principe variationnel), et parmi les
  géodésiques radiales τ(Ẽ) est maximal en Ẽ = 0 [lewis2007] [calcul].
- Ẽ = 1 (chute depuis l'infini au repos) : dr/dτ = −c√(r_s/r), d'où
  τ = (2/3) r_s/c = **(4/3) GM/c³ = 28,2 s** [taylor2000] [calcul].
- Stratégie optimale si l'on franchit avec Ẽ ≠ 0 : une poussée impulsionnelle
  vers Ẽ = 0, puis moteurs coupés. Toute poussée supplémentaire — dans
  n'importe quelle direction — diminue le τ restant. Lewis & Kwan notent que
  la formulation populaire « plus on se débat, moins on vit » est exacte à
  cette nuance près : la *première* correction de trajectoire peut aider, pas
  la résistance continue [lewis2007].

Note sur la source : `SOURCES.md` §1 signale que la localisation de ce
résultat dans MTW (§25/§31) n'est pas vérifiée sur l'ouvrage papier ; la
référence dédiée et vérifiée est Lewis & Kwan 2007 [lewis2007].

---

## 2. Ce qu'on ressent au passage de l'horizon : rien

### Découverte

Il n'y a **ni mur, ni secousse, ni alarme possible**. L'horizon n'est pas une
surface : c'est une ligne sur une carte, comme l'équateur. Personne n'a jamais
senti l'équateur en le franchissant. Si tu fermais les yeux, tu raterais le
moment — et aucun instrument à bord, aussi précis soit-il, ne peut sonner à
l'instant exact du passage [misner1973] [hartle2003]. La seule chose que ton
corps subit, l'étirement des marées, vaut ici un **dix-millième de la
pesanteur terrestre** : la tension totale sur tout ton corps pèse moins qu'un
trombone. Imperceptible [calcul].

### Curieux

Deux raisons profondes. D'abord le **principe d'équivalence** : en chute
libre, localement, la physique est celle de l'espace sans gravité ; seules
les *différences* de gravité entre ta tête et tes pieds (les marées) sont
détectables [misner1973] [hartle2003]. Ensuite, l'horizon n'est **pas une
propriété locale** de l'espace-temps : c'est une frontière définie par
l'avenir global des rayons lumineux — il faut connaître tout le futur pour
savoir où il est. Aucune mesure faite dans une cabine ne peut le repérer
[misner1973] [wald1984]. La courbure locale y est d'ailleurs parfaitement
finie : pour un trou noir aussi massif que Sgr A*, l'horizon est un endroit
*doux* [misner1973].

Les marées, maintenant, avec le bon ordre de grandeur — le site a déjà
publié une erreur à ce sujet (voir `SOURCES.md` §6.3), donc recalculons :
l'écart d'accélération entre tête et pieds à l'horizon est d'environ
**10⁻⁴ g**. C'est réel mais imperceptible : c'est un million de fois moins
que ce qu'il faut pour sentir quelque chose. Attention à la comparaison
inverse : ce même étirement est **des milliards de fois plus fort** que la
marée que la Lune exerce sur ton corps — c'est la comparaison précédente du
site qui était fausse, pas la conclusion [calcul].

### Astrophysicien

- **Localité.** L'invariant de Kretschmann à l'horizon,
  K = 48 G²M²/(c⁴r_s⁶), est fini et minuscule pour un supermassif ; la
  divergence de la métrique de Schwarzschild en r = r_s est un artefact de
  coordonnées, levé en Eddington-Finkelstein ou Gullstrand-Painlevé
  [misner1973]. L'horizon des événements est ∂J⁻(𝓘⁺), une notion
  téléologique : sa position dépend de tout le futur du spacetime, donc
  aucune expérience locale ne le détecte [wald1984].
- **Marées.** Gradient radial (étirement) : 2GM/r³ ; transverse
  (compression) : GM/r³ [misner1973]. À l'horizon de Sgr A* :
  2GM/r_s³ = **5,58 × 10⁻⁴ s⁻²** [calcul]. Sur un corps de 1,8 m :
  Δa = 1,0 × 10⁻³ m/s² ≈ **1,0 × 10⁻⁴ g**. Tension mécanique au centre d'un
  corps de 70 kg (modèle barre homogène, T = k·m·L/8) : ≈ 9 × 10⁻³ N, soit
  **le poids d'un gramme** — un trombone [calcul].
- **Comparaisons.** Marée lunaire sur un corps au sol :
  2GM_Lune/d³ = 1,7 × 10⁻¹³ s⁻² — l'horizon de Sgr A* fait **3,2 × 10⁹ fois
  plus** [calcul]. Marée terrestre à la surface de la Terre :
  3,1 × 10⁻⁶ s⁻², soit 180 fois moins que l'horizon [calcul]. La seule
  formulation défendable est donc le chiffre absolu (10⁻⁴ g), pas une
  comparaison à la Lune.
- Un candidat « quelque chose à sentir » existe dans la littérature
  spéculative — le firewall [amps2013] — mais c'est une conjecture de
  gravité quantique contestée, pas une prédiction de la relativité
  générale. La séquence ne doit rien montrer à l'horizon.

---

## 3. La vue vers l'extérieur

### Découverte

En tombant, tu **vois le ciel jusqu'au bout**. Pas de rideau qui se ferme,
pas de tunnel de lumière : les étoiles restent visibles pendant toute la
chute, même sous l'horizon. Ce qui change, c'est qu'une **tache noire
grandit sous tes pieds** — la direction du trou noir — cerclée d'un anneau
de lumière de plus en plus brillant. Au moment du passage, le noir occupe
un rond large comme 84° (grand, mais loin de tout couvrir) ; à la toute fin,
il remplit exactement la moitié du ciel, comme un sol infini et noir sous un
ciel qui s'éteint [muller2008] [riazuelo2019] [calcul].

Et non, tu ne vois **pas** le futur de l'univers défiler en accéléré. C'est
l'idée reçue la plus tenace, et elle est fausse : en tombant, tu fuis devant
la lumière qui te poursuit, et le monde extérieur t'apparaît au contraire
**au ralenti**, deux fois trop lent au passage de l'horizon. Entre l'horizon
et la fin, tu n'auras vu défiler que **12 secondes** de la vie du dehors
[taylor2000] [calcul].

### Curieux

Trois effets se combinent, et deux idées reçues tombent.

**L'aberration ouvre le ciel au lieu de le fermer.** C'est l'observateur
*immobile* près de l'horizon — celui qui brûle un carburant infini pour
rester sur place — qui voit le ciel extérieur se réduire à un petit rond au
zénith. Toi qui tombes, tu vas vite vers l'avant, et l'aberration repousse
les images vers l'avant (vers le bas) : les deux effets se compensent en
grande partie. Résultat : le ciel reste étalé sur la majorité de la sphère
céleste pendant toute la chute — encore 87 % du ciel à l'horizon, 50 % à la
fin [muller2008] [riazuelo2019] [calcul].

**Le décalage spectral dépend de la direction.** La réponse naïve « tout est
bleui par la gravité » est celle de l'observateur statique. En chute libre :
la lumière qui vient du zénith (droit derrière toi) est **rougie et
ralentie** — facteur exactement 1/2 à l'horizon —, tandis que la lumière
rasante, près du bord du disque noir, est **bleuie et intensifiée** (×3,9 à
l'horizon). Le ciel meurt par le milieu : rouge sombre au-dessus, un anneau
bleu éclatant autour du noir [taylor2000] [zaslavskii2020] [calcul].

**On ne voit pas l'avenir infini de l'univers.** Ta chute se termine en un
temps fini, donc seule la lumière partie de l'extérieur *avant une certaine
date* a le temps de te rattraper. Tout ce qui est émis après ne te concerne
plus. Depuis l'horizon jusqu'à la fin, tu ne reçois au zénith que
**11,9 secondes** d'histoire du monde extérieur, vues au ralenti — pas
l'éternité en accéléré. Voir l'univers vieillir en accéléré, c'est le
privilège de celui qui *reste* suspendu près de l'horizon, pas de celui qui
tombe [taylor2000] [muller2008] [calcul].

### Astrophysicien

Scénario pluie (Ẽ = 1), repère de Gullstrand-Painlevé, e_r̂ = ∂_r [taylor2000].

- **Cône du ciel / disque noir.** Pour l'observateur *statique*, le ciel
  extérieur occupe un cône de demi-angle ψ autour du zénith avec
  sin ψ = (3√3 GM/c²r) √(1 − r_s/r) — il se ferme en r → r_s
  [chandrasekhar1983] [misner1973]. Pour l'observateur en chute (pluie), la
  composition covariante donne pour le **rayon angulaire χ du disque noir**
  autour du nadir (x = rc²/GM, v = √(2/x)) :

  > cos χ = (v + k) / (1 + v k),  k = ±√( 1 − (27/x²)(1 − 2/x) )

  avec le signe + pour r > 3GM/c², − en dessous ; b_c = 3√3 GM/c² délimite
  les rayons venus de l'infini [bardeen1973] [calcul]. Valeurs : χ = 10,3° à
  10 r_s ; 24,2° à 3 r_s ; 35,3° sur la sphère des photons ; **42,1° à
  l'horizon** (valeur exacte : cos χ = 23/31) ; 53,3° à r_s/2 ; χ → 90°
  quand r → 0 : l'obscurité tend vers exactement la moitié du ciel, jamais
  plus [calcul]. Cohérent avec les rendus publiés [muller2008] [riazuelo2019].
- **Décalages.** Photon radial venu de l'infini reçu par l'observateur
  pluie : ω_obs/ω_∞ = 1/(1 + √(r_s/r)) — **redshift**, valant exactement 1/2
  à l'horizon et → 0 en r → 0 [taylor2000] [zaslavskii2020] [calcul]. Photon
  au bord du disque noir (b = b_c) : blueshift, ×1,45 à 10 r_s, ×3 sur la
  sphère des photons, ×31/8 = 3,88 à l'horizon, divergent en r → 0 — le
  ciel s'effondre spectralement sur l'anneau [zaslavskii2020] [calcul]. La
  divergence formelle concerne la mesure nulle b = b_c ; l'anneau réel est
  brillant mais fini.
- **Histoire extérieure visible.** Sur les rayons entrants radiaux,
  v̄ = t + r*/c est constant ; l'observateur atteint r = 0 à v̄ fini, donc
  l'histoire extérieure visible est finie [misner1973]. Quantitativement,
  entre l'horizon et la singularité :

  > Δt_vu = ∫ (ω_obs/ω_∞) dτ = (5/3 − 2 ln 2) r_s/c ≈ 0,280 r_s/c = **11,9 s**

  pour Sgr A* [calcul]¹. Le facteur de défilement apparent moyen est ~0,42 :
  du ralenti, pas de l'accéléré.

¹ Calcul : Δt = ∫₀^{r_s} dr/(v(1+v)) avec v = √(r_s/r) ; substitution
s = √(r/r_s) donne r_s[2/3 − (2 ln 2 − 1)] = (5/3 − 2 ln 2) r_s, en unités
c = 1. Avec r_s/c = 42,34 s : Δt = 0,2804 × 42,34 = 11,87 s.

---

## 4. La vue vers l'intérieur

### Découverte

Tu regardes « vers le centre » — et il n'y a **rien à voir**. Pas de boule,
pas de point noir qui grossit au loin : la singularité n'est pas un endroit
devant toi, c'est un **moment devant toi**, comme lundi prochain. On ne voit
pas lundi prochain ; on y arrive [misner1973] [hartle2003].

Sous tes pieds, il y a du noir — mais ce noir n'est pas « le centre ». C'est
la vieille lumière de tout ce qui est tombé avant toi, tellement affaiblie
et rougie qu'elle est invisible depuis longtemps. Et si un autre vaisseau
est tombé juste avant le tien, tu le **verras vraiment**, en dessous de toi,
de plus en plus rouge — au moment précis où tu franchis l'horizon, tu verras
même l'image de son propre franchissement. Mais tu ne le verras jamais
« arriver au bout » : ta propre fin viendra avant que cette image-là ne te
parvienne [toporensky2017] [ames1968].

### Curieux

**La singularité est un instant, pas un lieu.** À l'intérieur, les rôles de
r et t s'échangent : r devient une coordonnée de type temps, et « r décroît »
est aussi inévitable que « le temps passe ». La singularité r = 0 est dans le
**futur** de tout ce qui est entré — toutes les directions de l'espace mènent
au même instant final [misner1973] [hartle2003]. Conséquence optique : on ne
peut **pas la voir**, exactement comme on ne voit pas demain — aucune lumière
n'en provient, puisqu'elle n'est le passé de rien [misner1973].

**Ce qui remplit le champ visuel vers le bas** : le disque noir de §3 —
optiquement, c'est la surface de l'étoile qui s'est effondrée il y a des
milliards d'années (et de la matière tombée depuis), dont l'image s'éteint
exponentiellement : elle est noire au sens le plus fort du terme [ames1968]
[oppenheimer1939]. Autour, l'anneau de lumière bleuie ; au-dessus, le ciel.

**Voit-on les objets tombés avant nous ? Oui.** La lumière émise par un objet
à l'instant où il franchit l'horizon *reste sur l'horizon* — c'est une
surface faite de rayons lumineux. Quand tu franchis à ton tour, tu rattrapes
cette lumière : tu vois l'image de son passage, **décalée vers le rouge**.
À l'intérieur, tu continues de le voir en dessous de toi, de plus en plus
rouge et sombre ; tu ne le verras jamais atteindre la singularité — il y sera
avant toi, mais l'image de sa fin n'existe pas [toporensky2017].

### Astrophysicien

- **Structure causale.** Dans la région II de Schwarzschild, ∂_r est de type
  temps et la singularité r = 0 est une hypersurface **de genre espace**,
  future, atteinte par toute courbe causale entrante — elle n'est pas un
  point de l'espace mais un bord du temps [misner1973] [wald1984]. Sa
  généricité (au-delà de la symétrie sphérique) est le contenu du théorème
  de Penrose [penrose1965]. Aucun photon ne remonte de r = 0 : elle est
  invisible depuis l'intérieur, il n'y a pas de « mur qui approche » à
  rendre.
- **Lumière le long de l'horizon.** L'horizon est engendré par des
  géodésiques nulles ; un photon émis radialement vers l'extérieur *sur*
  l'horizon y demeure. Un observateur qui franchit plus tard le reçoit à son
  propre franchissement, avec un **redshift** (horizon externe non extrémal),
  calculé explicitement par Toporensky & Zaslavskii [toporensky2017]. Sous
  l'horizon, la lumière reçue d'un compagnon tombé avant reste à décalage
  fini tant qu'on la reçoit ; le cas radial pur tend vers le redshift
  infini près de r = 0, le cas non radial vers le blueshift [zaslavskii2020].
- **Kerr, brièvement.** Pour a ≠ 0, deux horizons :
  r_± = GM/c² ± √((GM/c²)² − a²) [kerr1963] [bardeen1972]. L'horizon
  intérieur r_− est un **horizon de Cauchy** : au-delà, la relativité perd
  son déterminisme (des données extérieures ne suffisent plus à prédire), et
  les diagrammes idéalisés le traversent vers « d'autres univers ». Mais il
  est le siège d'un **blueshift infini** de tout rayonnement entrant — vu
  depuis r_−, toute l'histoire future de l'extérieur arrive en un temps
  fini [simpson1973] — d'où l'« inflation de masse » : la courbure y croît
  sans borne, jusqu'à des échelles planckiennes [poisson1990]. Le statut
  moderne (Dafermos & Luk) : la métrique s'étend continûment (C⁰) à travers
  l'horizon de Cauchy, mais génériquement comme **singularité nulle faible**,
  au-delà de laquelle les équations d'Einstein classiques cessent d'avoir un
  sens [dafermos2017]. Le « passage vers un autre univers » relève donc du
  diagramme idéal, pas d'un trou noir astrophysique — et le spin de Sgr A*
  est de toute façon mal contraint [eht2022]. La séquence reste en
  Schwarzschild, comme le reste du site.

---

## 5. Chronologie complète (chute pluie, Ẽ = 1)

τ compté depuis le passage à 10 r_s. « v statique » : vitesse mesurée par un
observateur immobile local, v = c√(r_s/r) [taylor2000] [hartle2003] ; cette
notion cesse d'exister sous l'horizon (aucun observateur statique n'y est
possible). χ : rayon angulaire du disque noir vu du vaisseau (§3). Marées :
écart d'accélération sur 1,8 m [calcul pour toute la table].

| Étape | r | τ écoulé | τ restant | v statique | χ (noir) | ciel visible | marées (1,8 m) | Ce qu'on voit |
|---|---|---|---|---|---|---|---|---|
| Approche | 10 r_s | 0 | 14 min 53 s | 0,32 c | 10° | 99 % | 10⁻⁷ g | Tache noire de 21° de diamètre, anneau fin ; ciel intact |
| Plongée | 3 r_s | 12 min 26 s | 2 min 27 s | 0,58 c | 24° | 96 % | 4 × 10⁻⁶ g | Le noir gagne, l'anneau s'épaissit et bleuit ; zénith rougi ×0,63 |
| Sphère des photons | 1,5 r_s | 14 min 1 s | 51,9 s | 0,82 c | 35° | 91 % | 3 × 10⁻⁵ g | On croise l'orbite de la lumière ; images multiples au bord du noir |
| **Horizon** | 1 r_s | 14 min 25 s | **28,2 s** | → c | **42°** | 87 % | 10⁻⁴ g | Aucun événement local ; images rougies de ce qui est tombé avant, croisées sur l'horizon ; zénith ×0,5 |
| Mi-chemin | 0,5 r_s | 14 min 43 s | 10,0 s | — (n'existe plus) | 53° | 80 % | 8 × 10⁻⁴ g | Le noir dépasse l'hémisphère sud ; ciel comprimé et cisaillé vers l'anneau |
| Dernière seconde | 0,05 r_s | 14 min 52,4 s | 0,3 s | — | ~80° | ~59 % | **1 g puis ∞** | Étirement enfin sensible ; le ciel n'est plus qu'une bande éclatante à l'équateur |
| Singularité | 0 | **14 min 53 s** | 0 | — | → 90° | → 50 % | ∞ | Moitié noire, moitié ciel : anneau aveuglant à la taille, puis fin du temps |

Notes de calcul : τ restant jusqu'à r = 0 vaut (2/3)(r/r_s)^{3/2} × r_s/c
[taylor2000] [calcul] ; les χ sortent de la formule de §3 ; le seuil 1 g des
marées est atteint à r = 0,047 r_s, soit 0,29 s avant la fin, et ~100 g à
0,01 r_s, 0,03 s avant la fin [calcul]. La destruction du vaisseau occupe la
**dernière demi-seconde**, pas la traversée.

---

## 6. Ce que l'observateur extérieur voit de nous

### Découverte

Depuis le vaisseau resté au large, personne ne te voit jamais entrer. Ton
image ralentit, rougit, s'assombrit — et **se fige juste au-dessus de la
frontière**. Mais elle ne reste pas longtemps visible : elle s'éteint comme
une braise, en perdant la moitié de son éclat toutes les ~80 secondes. Au
bout de quelques minutes tu n'es plus qu'une ombre dans l'infrarouge ; au
bout de quelques heures, **plus un seul photon**. L'extérieur ne garde de toi
qu'une image éteinte, à jamais suspendue [ames1968] [misner1973].

### Curieux

Le « gel » est une illusion de perspective : la lumière que tu émets juste
avant l'horizon met de plus en plus longtemps à s'extraire, donc le film de
ta chute s'étire sans fin pour l'extérieur — pendant que toi tu traverses en
28 secondes de ton temps (§1). Deux temps caractéristiques, étonnamment
courts pour un objet de 4 millions de masses solaires :

- ton **rougissement** s'aggrave d'un facteur e toutes les
  4GM/c³ ≈ **85 s** [ames1968] [calcul] ;
- ta **luminosité** apparente s'effondre d'un facteur e toutes les
  3√3 GM/c³ ≈ **110 s** [ames1968] [calcul].

En une demi-heure, ton éclat a chuté d'un facteur ~10⁷. C'est le calcul
d'Ames et Thorne (1968) pour une étoile qui s'effondre — le même qui a valu
aux trous noirs leur ancien nom d'« étoiles gelées » [ames1968].

### Astrophysicien

Aux temps tardifs, pour un émetteur en chute vers r_s vu de loin :
1 + z ∝ e^{κt} avec κ = c³/4GM la gravité de surface — temps caractéristique
**4GM/c³ = 84,7 s** pour Sgr A* [ames1968] [calcul]. La luminosité bolométrique
reçue décroît en L ∝ e^{−t/(3√3 GM/c³)}, temps caractéristique
**110,0 s** : ce sont les photons stockés sur la sphère des photons qui
s'échappent, au taux de Lyapunov 1/(3√3 GM/c³) de l'orbite instable —
cohérent avec la démagnification e^{−π} par demi-tour des sous-anneaux
[ames1968] [bardeen1973] [calcul]. Ordre de grandeur du **dernier photon** :
pour un émetteur de ~kW optique, N ~ 10²¹ photons/s, l'extinction complète
(ln N ≈ 48 e-folds de luminosité) survient après ~1,5 heure — « quelques
heures » est l'ordre de grandeur défendable [calcul, non publié tel quel,
voir §9].

---

## 7. Les questions que les joueurs poseront

**« Est-ce qu'on est déchiré en entrant ? »** Non. Sur un trou noir
supermassif, l'étirement à l'horizon vaut 10⁻⁴ g — moins que le poids d'un
trombone réparti sur ton corps. La « spaghettification » existe, mais elle
tient toute dans la **dernière demi-seconde** avant la singularité
[misner1973] [calcul].

**« Est-ce qu'on peut faire demi-tour ? »** Non, et pas parce que les moteurs
manquent de puissance : à l'intérieur, s'éloigner du centre est impossible
comme il est impossible de reculer dans le temps. r est devenu un temps, et
il ne coule que dans un sens [misner1973] [hartle2003]. Pousser ne change que
le temps restant — et le raccourcit (§1) [lewis2007].

**« Est-ce qu'on ressort par un trou blanc ? »** Non. Le trou blanc est le
symétrique temporel du trou noir dans la solution mathématique *éternelle*
(l'extension maximale) [riazuelo2019]. Un trou noir réel, formé par
effondrement, n'a pas cette région : l'espace-temps d'Oppenheimer-Snyder
contient une étoile qui s'effondre, un horizon, une singularité — et aucune
sortie [oppenheimer1939].

**« Est-ce que le temps s'arrête à l'horizon ? »** Pas pour toi : ta montre,
ton cœur, ta pensée continuent au rythme normal, et la traversée ne dure
qu'un instant parmi d'autres. Le « temps arrêté » est ce que *l'extérieur
voit de toi* — un artefact du trajet de la lumière, pas ton vécu [misner1973]
[ames1968].

**« Est-ce qu'on voit l'univers mourir en tombant ? »** Non. Il faut rester
*dehors*, suspendu près de l'horizon, pour voir l'extérieur en accéléré. En
tombant, c'est l'inverse : le dehors passe au ralenti (moitié moins vite à
l'horizon), et entre l'horizon et la fin tu ne vois défiler que ~12 s
d'histoire extérieure [taylor2000] [calcul].

**« Est-ce qu'on voit ceux qui sont tombés avant ? »** Oui — en dessous de
toi, rougis et assombris. En franchissant l'horizon, tu croises même la
lumière qu'ils ont émise en le franchissant : vous partagez cette surface de
lumière. Mais personne ne voit jamais personne *finir* : l'image de leur fin
n'atteint jamais personne [toporensky2017].

---

## 8. Sources

Nouvelles clés à ajouter au registre `sources` de `contenu.js` (format
identique). Tous les DOI ci-dessous ont été résolus pendant la rédaction
(Crossref/éditeur) ; aucun n'est reconstruit de mémoire.

- **lewis2007** — G. F. Lewis, J. Kwan, « No Way Back: Maximizing survival
  time below the Schwarzschild event horizon », Publications of the
  Astronomical Society of Australia 24, 46-52 (2007). doi:10.1071/AS07012 ;
  arXiv:0705.1029. *Sert : temps propre maximal πGM/c³ sous l'horizon ;
  pousser au-delà de la correction optimale raccourcit le temps propre.*
- **ames1968** — W. L. Ames, K. S. Thorne, « The Optical Appearance of a
  Star that is Collapsing Through its Gravitational Radius », The
  Astrophysical Journal 151, 659 (1968). doi:10.1086/149465. *Sert : gel
  apparent, rougissement exponentiel (4GM/c³), extinction de la luminosité
  en e^{−t/(3√3GM/c³)}.*
- **muller2008** — T. Müller, « Falling into a Schwarzschild black hole »,
  General Relativity and Gravitation 40, 2185-2199 (2008).
  doi:10.1007/s10714-008-0623-7. *Sert : vue d'un observateur en chute libre
  radiale (aberration vs observateur statique), rendu du ciel pendant la
  chute.*
- **riazuelo2019** — A. Riazuelo, « Seeing relativity — I. Ray tracing in a
  Schwarzschild metric to explore the maximal analytic extension of the
  metric and making a proper rendering of the stars », International Journal
  of Modern Physics D 28, 1950042 (2019). doi:10.1142/S0218271819500421 ;
  arXiv:1511.06025. *Sert : rendu correct (aberration, Doppler, déflexion)
  jusque sous l'horizon ; régions de l'extension maximale et trou blanc.*
- **toporensky2017** — A. V. Toporensky, O. B. Zaslavskii, « Redshift of a
  photon emitted along the black hole horizon », The European Physical
  Journal C 77, 179 (2017). doi:10.1140/epjc/s10052-017-4747-3 ;
  arXiv:1611.09807. *Sert : un photon émis le long de l'horizon est reçu,
  décalé vers le rouge, par un observateur qui franchit plus tard — on voit
  ceux qui sont tombés avant.*
- **zaslavskii2020** — O. B. Zaslavskii, « Redshift/blueshift Inside the
  Schwarzschild Black Hole », General Relativity and Gravitation 52, 37
  (2020). doi:10.1007/s10714-020-02688-w ; arXiv:1910.00669. *Sert :
  décalages spectraux vus sous l'horizon — redshift radial, blueshift des
  rayons non radiaux près de r = 0.*
- **simpson1973** — M. Simpson, R. Penrose, « Internal instability in a
  Reissner-Nordström black hole », International Journal of Theoretical
  Physics 7, 183-197 (1973). *Sert : blueshift infini et instabilité de
  l'horizon de Cauchy intérieur.*
- **poisson1990** — E. Poisson, W. Israel, « Internal structure of black
  holes », Physical Review D 41, 1796 (1990). doi:10.1103/PhysRevD.41.1796.
  *Sert : inflation de masse à l'horizon de Cauchy — courbure non bornée.*
- **dafermos2017** — M. Dafermos, J. Luk, « The interior of dynamical vacuum
  black holes I: The C⁰-stability of the Kerr Cauchy horizon »,
  arXiv:1710.01722 (2017), prépublication. *Sert : statut moderne de
  l'horizon de Cauchy — extension C⁰ mais singularité nulle faible
  générique.*
- **oppenheimer1939** — J. R. Oppenheimer, H. Snyder, « On Continued
  Gravitational Contraction », Physical Review 56, 455 (1939).
  doi:10.1103/PhysRev.56.455. *Sert : l'espace-temps d'un effondrement réel
  ne contient ni trou blanc ni second univers.*
- **taylor2000** — E. F. Taylor, J. A. Wheeler, Exploring Black Holes:
  Introduction to General Relativity, Addison Wesley Longman (2000).
  *Sert : trajectoire « pluie » (Ẽ = 1), vitesse √(r_s/r) mesurée par les
  observateurs statiques, redshift 1/2 au zénith à l'horizon, temps de chute.*
  ❔ ouvrage papier, chapitres non vérifiés page à page.
- **hartle2003** — J. B. Hartle, Gravity: An Introduction to Einstein's
  General Relativity, Addison-Wesley (2003), chap. 12. *Sert : r de type
  temps sous l'horizon, principe d'équivalence, chute régulière.* ❔ ouvrage
  papier.
- **wald1984** — R. M. Wald, General Relativity, University of Chicago Press
  (1984). *Sert : définition globale (téléologique) de l'horizon,
  singularité de genre espace.* ❔ ouvrage papier.

Clés existantes réutilisées : [gravity2021] (masse — attention, `SOURCES.md`
§1 note que l'article est de 2022), [schwarzschild1916], [misner1973] (❔
sections non vérifiées, voir `SOURCES.md`), [bardeen1973], [bardeen1972],
[chandrasekhar1983], [kerr1963], [penrose1965], [amps2013], [eht2022].

---

## 9. Ce que je n'ai pas pu sourcer

Déclaré plutôt qu'enjolivé :

1. **La formule du disque noir en chute libre** (cos χ = (v+k)/(1+vk), et
   ses valeurs — 42,1° à l'horizon, 90° asymptotique). Je l'ai dérivée ici
   par aberration covariante dans le repère de Gullstrand-Painlevé, par deux
   chemins indépendants qui concordent, et elle est qualitativement conforme
   aux rendus de [muller2008] et [riazuelo2019]. Mais **je n'ai pas trouvé de
   publication donnant ces angles noir sur blanc**. Statut : [calcul]
   vérifiable, à faire relire avant publication, ou à confronter aux figures
   de Müller 2008 (qui trace exactement cette géométrie).
2. **Les 11,9 s d'histoire extérieure visibles depuis l'horizon.** Résultat
   d'une intégrale élémentaire (note ¹ de §3), qualitativement affirmé
   partout (« on ne voit pas le futur de l'univers », p. ex. Taylor-Wheeler),
   mais je n'ai pas de source publiant **ce chiffre** pour un trou noir de
   cette masse. Statut : [calcul] montré.
3. **« Quelques heures avant le dernier photon »** (§6). L'extinction
   exponentielle est sourcée [ames1968] ; le passage au « dernier photon »
   dépend du flux de l'émetteur, hypothèse arbitraire. Ordre de grandeur
   honnête, pas un fait sourcé.
4. **MTW §25/§31** : comme déjà noté dans `SOURCES.md`, les numéros de
   sections de [misner1973] n'ont pas été vérifiés sur l'ouvrage papier ;
   idem pour les chapitres précis de [taylor2000], [hartle2003], [wald1984].
   Les résultats correspondants sont tous doublés d'une source article
   vérifiée ou d'un calcul.
5. **Le récit « une poussée brève peut aider »** (§1) est dans [lewis2007],
   mais la valeur exacte du gain pour une trajectoire donnée n'est pas
   reprise ici : ne pas donner de chiffre là-dessus dans les répliques sans
   refaire l'intégrale.

---

## 10. Conséquences pour l'animation

**Durées.** La séquence a une colonne vertébrale non négociable : **28,2 s de
temps réel entre l'horizon et la fin** (scénario pluie). C'est court, jouable
tel quel, et c'est le chiffre le plus honnête du jeu : l'intérieur doit se
jouer en temps propre réel, sans accélération ni ralenti. L'approche
(10 r_s → horizon : 14 min 25 s) peut être compressée, à condition d'afficher
le facteur d'accélération comme le fait déjà le salon.

**Déroulé recommandé** (caméra libre extérieur/intérieur tout du long) :

1. *Approche 10 → 3 r_s* (réel : 12 min 26 s, compressé ×20 environ). Le
   disque noir passe de 21° à 48° de diamètre. Rien d'autre ne change :
   c'est le moment de dire que rien ne se sent (§2).
2. *3 r_s → sphère des photons* (réel : 94,8 s, jouable en réel). L'anneau
   photonique s'épaissit, images multiples au bord. À 1,5 r_s, dire : « on
   vient de croiser l'orbite de la lumière ».
3. *Sphère des photons → horizon* (réel : 23,7 s, en réel). Zénith rougi
   ×0,55 → ×0,5. À l'instant du franchissement : **aucun effet visuel**.
   Optionnel et sourcé : croiser les images rougies d'objets tombés avant
   [toporensky2017]. L'UI peut marquer le passage (les 28 s s'affichent),
   pas le monde.
4. *Intérieur* (réel : 28,2 s, strictement en réel). Le noir passe 42° → 53°
   → 80° de rayon ; le ciel restant se cisaille vers l'anneau équatorial qui
   bleuit et flambe ; le zénith s'éteint en rouge. Les étoiles individuelles
   défilent *au ralenti* (facteur 0,5 → 0).
5. *Dernière demi-seconde*. Seul moment où le corps sent quelque chose :
   étirement radial, compression latérale (1 g à −0,29 s, ~100 g à −0,03 s).
   Puis : moitié du ciel noire, moitié ciel, anneau aveuglant à la taille —
   et coupure. Pas de traversée, pas de rebond, pas de lumière au bout.

**Mensonges visuels à proscrire** (tous courants au cinéma) :

- ✗ **Le tunnel de lumière** : ciel extérieur réduit à un petit rond qui se
  referme. C'est la vue de l'observateur statique, physiquement impossible à
  l'horizon ; en chute libre le ciel occupe encore 87 % de la sphère céleste
  au franchissement (§3). À la place : le disque noir qui grandit par le bas.
- ✗ **Le bleuissement général / l'univers en accéléré**. C'est l'inverse :
  zénith rougi et ralenti, seul le bord du noir bleuit. Ne jamais montrer
  d'étoiles qui accélèrent ou d'univers qui vieillit.
- ✗ **La spaghettification à l'horizon**. 10⁻⁴ g : rien. Réserver l'étirement
  aux 0,3 dernières secondes — c'est plus effrayant, et c'est vrai.
- ✗ **Un mur, un flash, une membrane au passage**. Rien de local n'existe à
  l'horizon (§2). Le frisson doit venir de l'UI et de Lumen, pas du monde.
- ✗ **La singularité comme boule/point noir qu'on voit approcher**. Elle est
  invisible et future (§4). Ce qui approche, c'est un *instant* : le rendu
  honnête est l'obscurité qui monte de sous les pieds jusqu'à couper le ciel
  en deux, jamais un objet devant soi.
- ✗ **Le gel du temps vécu** (ralentir le joueur à l'horizon « parce que le
  temps s'arrête »). Le gel est ce que voit l'extérieur (§6) ; à bord, le
  temps coule normalement. Si la mission montre un écran « vue depuis le
  vaisseau resté au large », c'est là — et seulement là — qu'on gèle, rougit
  et éteint l'image du joueur, avec les temps caractéristiques 85 s / 110 s.

**Ce que la séquence gagne à montrer parce que c'est vrai** : les 66 s
affichées comme budget maximal théorique contre les 28 s réelles (§1) ; le
bouton « pousser pour remonter » qui *réduit* visiblement le compteur de
temps propre restant [lewis2007] ; la rencontre, sur l'horizon, de la lumière
de ceux qui sont tombés avant [toporensky2017] ; et l'extinction finale du
ciel en un anneau — une image que presque personne n'a jamais montrée et que
la physique donne gratuitement [zaslavskii2020] [calcul].
