# Sources et vérification factuelle

Audit de l'ensemble des affirmations vérifiables du site (`index.html` : `FICHES`,
`METHODE`, `ESSAIS`, HUD, commentaires d'unités ; `contenu.js` : `sources`,
`reactions`, `questions`).

**Légende** — ✅ confirmé · ⚠️ imprécis, à nuancer ou trompeur au niveau où c'est
écrit · ❌ faux · ❔ non vérifiable en ligne (à confirmer sur l'ouvrage papier).

Les valeurs numériques marquées « calcul » ont été recalculées ici à partir des
constantes CODATA/IAU (G = 6,674 30 × 10⁻¹¹, c = 299 792 458 m/s,
M☉ = 1,988 92 × 10³⁰ kg, pc = 3,085 677 6 × 10¹⁶ m) et de
M = 4,297 × 10⁶ M☉, R₀ = 8 277 pc. Constantes dérivées utilisées partout :

| Grandeur | Valeur |
|---|---|
| GM/c² | 6,3467 × 10⁶ km |
| r_s = 2GM/c² | 1,269 34 × 10⁷ km |
| r_s / c | 42,34 s |
| GM/c³ | 21,170 s |
| πGM/c³ | **66,51 s** |
| θ_g = GM/(c²R₀) | 5,126 μas |
| densité moyenne | **9,98 × 10⁵ kg/m³** |

---

## 1. Registre `sources` de `contenu.js` — état des 21 références

Aucune référence inventée. Les 13 DOI présents résolvent tous, et tous pointent
sur le bon article (vérifié via l'API Crossref, titre + auteurs + volume + page +
année). Trois entrées demandent une correction, aucune n'est fabriquée.

| clé | statut | vérification |
|---|---|---|
| `gravity2021` | ⚠️ | Article correct : *Mass distribution in the Galactic **Center** based on interferometric astrometry of multiple stellar orbits*, A&A **657**, L12 (**2022**), doi [10.1051/0004-6361/202142465](https://doi.org/10.1051/0004-6361/202142465). Deux écarts : le titre réel écrit « Center » et non « Centre » ; et la **clé s'appelle `gravity2021` alors que l'article est de 2022** — la fiche 1 (niveau expert) écrit d'ailleurs « (GRAVITY, 2021) ». Le A&A 647, A59 de 2021 est un autre article (*Improved GRAVITY astrometric accuracy from modeling optical aberrations*), qui ne porte pas ces valeurs. |
| `gravity2020` | ✅ | A&A **636**, L5 (2020), doi [10.1051/0004-6361/202037813](https://doi.org/10.1051/0004-6361/202037813). Titre complet : « …in the orbit of the star S2 **near the Galactic centre massive black hole** » (le registre tronque, sans conséquence). |
| `gravity2018` | ✅ | A&A **615**, L15 (2018), doi [10.1051/0004-6361/201833718](https://doi.org/10.1051/0004-6361/201833718). Même troncature de titre. |
| `eht2022` | ✅ | ApJL **930**, L12 (2022), doi [10.3847/2041-8213/ac6674](https://doi.org/10.3847/2041-8213/ac6674). Titre et auteurs exacts. |
| `eht2019` | ✅ | ApJL **875**, L5 (2019), doi [10.3847/2041-8213/ab0f43](https://doi.org/10.3847/2041-8213/ab0f43). Exact. **Jamais citée** par aucune réplique (voir §9). |
| `nobel2020` | ⚠️ | Formulation officielle exacte, mais incomplète : le prix est **divisé**, une moitié à Roger Penrose « for the discovery that black hole formation is a robust prediction of the general theory of relativity », l'autre moitié **conjointement** à Genzel et Ghez avec la citation reproduite. |
| `schwarzschild1916` | ✅ | Sitzungsberichte der Königlich Preussischen Akademie der Wissenschaften (1916), 189–196. Titre et pagination conformes. |
| `dyson1920` | ⚠️ | Article correct : Phil. Trans. R. Soc. A **220**, 291–333 (1920), doi [10.1098/rsta.1920.0009](https://doi.org/10.1098/rsta.1920.0009). Mais le champ `sert` est faux : **1,75″ n'est pas la valeur mesurée, c'est la prédiction d'Einstein**. Les mesures publiées sont 1,98″ ± 0,12 (Sobral) et 1,61″ ± 0,30 (Príncipe). **Jamais citée** par aucune réplique. |
| `bardeen1972` | ✅ | ApJ **178**, 347 (1972), doi [10.1086/151796](https://doi.org/10.1086/151796). Auteurs et titre exacts ; référence canonique pour ISCO 6M / M / 9M et les rendements. |
| `bardeen1973` | ✅ | *Timelike and null geodesics in the Kerr metric*, Les Houches 1972, DeWitt & DeWitt (éds.), Gordon & Breach 1973. Référence canonique pour l'ombre et b_c. |
| `luminet1979` | ✅ | A&A **75**, 228–235 (1979). Titre, volume et pagination conformes. |
| `gralla2019` | ⚠️ | Article correct : PRD **100**, 024018 (2019), doi [10.1103/PhysRevD.100.024018](https://doi.org/10.1103/PhysRevD.100.024018). Mais **le champ `sert` sur-attribue** : GHW 2019 établit la taxinomie image directe / anneau de lentille / anneau de photons, pas le facteur e^(−π). Voir §5. |
| `shakura1973` | ✅ | A&A **24**, 337–355 (1973). Conforme. |
| `balbus1991` | ✅ | ApJ **376**, 214 (1991), doi [10.1086/170270](https://doi.org/10.1086/170270). Le titre déposé chez Crossref réunit les parties I et II. |
| `yuan2014` | ✅ | ARA&A **52**, 529–588 (2014), doi [10.1146/annurev-astro-082812-141003](https://doi.org/10.1146/annurev-astro-082812-141003). Conforme. |
| `penrose1965` | ✅ | PRL **14**, 57–59 (1965), doi [10.1103/PhysRevLett.14.57](https://doi.org/10.1103/PhysRevLett.14.57). Conforme. |
| `amps2013` | ✅ | JHEP 2013(2):062, doi [10.1007/JHEP02(2013)062](https://doi.org/10.1007/JHEP02\(2013\)062). Conforme. (Le préprint est de 2012, ce que la fiche 2 note correctement.) |
| `penington2020` | ✅ | JHEP 2020(9):002, doi [10.1007/JHEP09(2020)002](https://doi.org/10.1007/JHEP09\(2020\)002). Conforme. **Jamais citée** par aucune réplique. |
| `birkhoff1923` | ❔ | *Relativity and Modern Physics*, Harvard UP 1923, p. 253. Pagination non vérifiable en ligne ; c'est la pagination habituellement citée dans la littérature. |
| `chandrasekhar1983` | ❔ | *The Mathematical Theory of Black Holes*, OUP 1983. Le chapitre 3 est bien « The Schwarzschild space-time » ; contenu conforme à l'usage annoncé. |
| `misner1973` | ❔ | MTW, *Gravitation*, W. H. Freeman 1973. **§25 et §31 sont plausibles mais non vérifiés** : §25 traite du « pit in the potential » (marées, orbites), §31 de la géométrie de Schwarzschild (Eddington-Finkelstein, Kruskal, chute libre). En revanche le **temps propre maximal πGM/c³ n'est pas clairement en §25/§31** — la référence moderne dédiée est G. F. Lewis & J. Kwan, *No Way Back: Maximizing survival time below the Schwarzschild event horizon*, PASA **24**, 46 (2007), [arXiv:0705.1029](https://arxiv.org/abs/0705.1029). Vérifier la section, ou ajouter cette référence. |

`IDEES.md` annonce « 19 sources primaires » ; le registre en contient **21**.

---

## 2. Sagittarius A* : masse, distance, taille

### 2.1 Masse et distance
> « M = 4,297 ± 0,013 × 10⁶ M☉ à R₀ = 8 277 ± 31 pc (GRAVITY, 2021) »
> — `index.html`, `FICHES[0]`, niveau Astrophysicien

**⚠️** Les valeurs centrales sont exactes, les **barres d'erreur et l'année ne le
sont pas**. GRAVITY Collab. (Abuter et al.), A&A 657, L12 (**2022**) publie :

- M = (4,297 ± **0,012** stat ± **0,040** sys) × 10⁶ M☉
- R₀ = (8 277 ± **9** stat ± **33** sys) pc

Le site donne « ± 0,013 » et « ± 31 » — ni la statistique ni la systématique. À
remplacer par les deux jeux d'erreurs, ou par l'erreur totale
(≈ ± 0,042 × 10⁶ M☉ et ≈ ± 34 pc en quadrature).
Source : [10.1051/0004-6361/202142465](https://doi.org/10.1051/0004-6361/202142465).

### 2.2 « 4 millions de fois le Soleil » / « 4,3 millions de masses solaires »
`FICHES[0]` niv. 0 et 1, `q4-1`, `q4-0`. **✅** Conforme à 4,297 × 10⁶ M☉.

### 2.3 « 26 000 années-lumière »
> « il est si loin que sa lumière met 26 000 ans à nous parvenir » — `FICHES[0]` niv. 0
> « celui-ci est à 26 000 années-lumière » — `contenu.js`, `q5-0`
> « il file tout droit pendant 26 000 ans » — `contenu.js`, `photon-fuite`

**⚠️ Incohérent avec la source retenue.** Calcul : 8 277 pc = **26 996 al**.
La valeur cohérente avec GRAVITY est **27 000 années-lumière**. À l'inverse,
26 000 al correspond à 7 972 pc, soit la valeur *pré-GRAVITY*. Les trois
occurrences sont à harmoniser.
`q5-2` dit « Sgr A* est à 8,3 kpc » : **✅** exact.

### 2.4 Rayon de Schwarzschild et temps de traversée
> « rs = 1,269e7 km, et la lumière met 42,3 s à le franchir » — `index.html` l. 550-557
> « Son rayon vaut r_s = 2GM/c², soit 12,7 millions de km » — `FICHES[1]` niv. 1

**✅** Calcul : r_s = 2GM/c² = 1,269 34 × 10⁷ km ; r_s/c = **42,34 s**.
Les constantes `SEC_PAR_UNITE = 42.34` et `KM_PAR_UNITE = 1.269e7` sont justes.
Source : `schwarzschild1916` + `gravity2021`.

> « tassées dans une bille de 12,7 millions de km — ça tiendrait à l'intérieur de
> l'orbite de Mercure » — `FICHES[0]` niv. 1

**⚠️** 12,7 × 10⁶ km est un **rayon** ; « une bille de 12,7 millions de km » se lit
naturellement comme un diamètre. Le diamètre réel de l'horizon est 25,4 × 10⁶ km.
La comparaison à Mercure reste **✅ vraie** (périhélie de Mercure : 46 × 10⁶ km).
Reformuler en « une bille de 25 millions de km de diamètre ».

### 2.5 « Sgr A* est moins dense que l'eau »
> « Sagittarius A* est énorme, mais sa densité moyenne est ridicule : *moins dense
> que l'eau*. Plus un trou noir est massif, moins il est dense. »
> — `contenu.js`, `inactif-1` (sources : `gravity2021`, `schwarzschild1916`)

**❌ FAUX.** Calcul direct : ρ = M / (4/3 π r_s³) = **9,98 × 10⁵ kg/m³**, soit
**≈ 1 000 fois la densité de l'eau** (≈ celle d'un lingot de plomb, en ordre de
grandeur). La densité moyenne d'un trou noir de Schwarzschild vaut
ρ = 3c⁶/(32πG³M²) ; elle n'égale celle de l'eau qu'à partir de
M ≈ **1,36 × 10⁸ M☉**, soit ~32 fois la masse de Sgr A*.

- La deuxième phrase (« plus il est massif, moins il est dense ») est **✅ exacte**.
- L'exemple correct est M87* (6,5 × 10⁹ M☉) : ρ ≈ **0,44 kg/m³**, moins dense que
  l'air. Pour Sgr A*, la formulation défendable est « à peu près la densité du
  plomb, sur un volume plus grand que l'orbite de Mercure ».

### 2.6 Luminosité et taux d'accrétion
> « Accrétion en régime RIAF à ~10⁻⁹ L_Edd » — `FICHES[0]` niv. 2
> « à Ṁ ~ 10⁻⁸ M☉/an il est en RIAF/ADAF » — `FICHES[4]` niv. 2

**✅** L_Edd(4,297 × 10⁶ M☉) = 5,4 × 10⁴⁴ erg/s ; L_bol(Sgr A*) ~ 10³⁶ erg/s →
rapport ≈ 2 × 10⁻⁹. Le taux d'accrétion près de l'horizon est estimé à
10⁻⁹–10⁻⁷ M☉/an par la rotation Faraday, ~10⁻⁸ étant la valeur usuelle.
Source : `yuan2014`.

---

## 3. L'étoile S2 et la pesée du trou noir

### 3.1 Période orbitale
> « en fait le tour en 16 ans » (`q4-0`) · « S2 boucle son orbite en 16,05 ans » (`q4-1`)
> · « suivant pendant trente ans l'étoile S2, qui en fait le tour en 16 ans » (`FICHES[0]` niv. 1)

**✅** P = 16,05 ans (GRAVITY 2018/2020/2022).

### 3.2 Périastre et vitesse
> « passe au plus près à 120 unités astronomiques et y file à 7 650 km/s » — `q4-1`

**✅ Exact et sourcé au bon article.** GRAVITY Collab., A&A 615, L15 (2018) :
« a pericentre distance […] ≈ 14 mas or **120 AU** », « an orbital speed of
**≈ 7 650 km s⁻¹** », soit β = 2,55 × 10⁻².
Source : [10.1051/0004-6361/201833718](https://doi.org/10.1051/0004-6361/201833718).

> « en 16 ans à 3 % de la vitesse de la lumière » — `FICHES[0]` niv. 1

**⚠️** 7 650 km/s = **2,55 %** de c. « 3 % » arrondit vers le haut de 18 %.
Écrire « près de 3 % » ou « 2,5 % ».

### 3.3 Précession de Schwarzschild
> « précession de Schwarzschild de 12′ par orbite est mesurée » — `FICHES[0]` niv. 2
> « précession de Schwarzschild de 12,1′/orbite confirmée en 2020 » — `q4-2`

**✅** GRAVITY Collab., A&A 636, L5 (2020) : f_SP = 1,10 ± 0,19, détection à 5–6 σ,
avance du périastre **≈ 12′ par orbite**. La valeur GR calculée à partir des
éléments orbitaux (a ≈ 1 034 UA, e = 0,885) est Δφ = 6πGM/(c²a(1−e²)) = **12,2′**.
Le « 12,1′ » du site est donc à la bonne valeur, mais **le papier écrit « ≈ 12′ »** :
préférer cette écriture, moins précise que ce que la source autorise.
Source : [10.1051/0004-6361/202037813](https://doi.org/10.1051/0004-6361/202037813).

### 3.4 Redshift gravitationnel au périastre 2018
> « redshift gravitationnel détecté au périastre 2018 » — `q4-2`. **✅** `gravity2018`.

### 3.5 Nobel 2020
> « Ce travail a valu le prix Nobel de physique 2020 » (`FICHES[0]` niv. 1)
> « Nobel de physique 2020 à Genzel et Ghez » (`q4-2`)

**⚠️** Vrai mais incomplet : le prix est divisé, **une moitié à Penrose**, l'autre
moitié conjointement à Genzel et Ghez. Le site mentionne Penrose ailleurs
(`penrose1965`) mais jamais dans ce contexte — au niveau Découverte, « a valu le
prix Nobel » sans mention du partage est un raccourci trompeur.

---

## 4. Optique du trou noir : sphère des photons, ombre, ISCO

### 4.1 Sphère des photons à 3GM/c²
> « Sphère des photons à r = 3GM/c² » (`FICHES[3]` niv. 2) · « à 1,5 fois le rayon
> de l'horizon » (niv. 1) · « photon piégé sur la sphère à 1,5 r_s » (`accueil-2`)
> · « La sphère des photons à 1,5 rayon de Schwarzschild » (`METHODE`, Curieux)

**✅** 3GM/c² = 1,5 r_s. Orbite instable. Sources : `chandrasekhar1983`, `bardeen1973`.

### 4.2 Ombre à √27 GM/c²
> « ombre de rayon apparent √27 GM/c² ≈ 2,598 r_s, soit ~52 μas pour Sgr A* »
> — `FICHES[3]` niv. 2

**✅** pour la géométrie : b_c = √27 GM/c² = 3√3 GM/c² = 2,598 r_s. Conforme à
`bardeen1973`.

**⚠️** pour le chiffre : la phrase attache « ~52 μas » à un **rayon apparent**.
Calcul : θ_g = 5,126 μas → rayon apparent de l'ombre = √27 θ_g = **26,6 μas**,
**diamètre = 53,3 μas**. C'est le diamètre qui vaut ~52 μas. À corriger en
« soit ~53 μas de diamètre ».

Même grandeur ailleurs, correctement présentée comme un diamètre :
> « L'ombre que tu regardes fait 52 millionièmes de seconde d'arc » — `inactif-2` **✅**

> « Section efficace de capture : paramètre d'impact critique b_c = √27 GM/c², d'où
> un rayon apparent de 2,598 r_s » — `q3-2` **✅**
> « Le seuil tombe à 2,6 rayons d'horizon » — `q3-1` **✅**
> « elle est deux fois et demie plus grande que lui » — `FICHES[3]` niv. 0 **✅**

### 4.3 Diamètre de l'anneau EHT
> « Image EHT de mai 2022 : anneau de 51,8 ± 2,3 μas, compatible avec une
> inclinaison faible, spin mal contraint » — `FICHES[0]` niv. 2

**✅** EHT Collab., ApJL 930, L12 (2022) : diamètre d'anneau **51,8 ± 2,3 μas**,
diamètre d'ombre déduit 48,7 μas, image publiée le 12 mai 2022, inclinaison faible
favorisée, spin non contraint.
Source : [10.3847/2041-8213/ac6674](https://doi.org/10.3847/2041-8213/ac6674).

### 4.4 « Une orange posée sur la Lune »
`inactif-2`. **✅** Une orange de 10 cm à 384 400 km sous-tend 54 μas. Analogie juste.

### 4.5 ISCO à 6GM/c²
> « r_ISCO = 6GM/c² pour a = 0 ; elle descend à GM/c² en Kerr extrême prograde et
> monte à 9GM/c² en rétrograde » — `FICHES[6]` niv. 2
> « à 3 fois le rayon de l'horizon » — niv. 1 · `attendu: "6M = 3"` — `ESSAIS[3]`

**✅** Valeurs canoniques de Bardeen, Press & Teukolsky 1972,
[10.1086/151796](https://doi.org/10.1086/151796). 6GM/c² = 3 r_s.

> « V = −GM/r + L²/2r² − GML²/c²r³ » **✅** potentiel effectif correct ;
> le terme en r⁻³ supprime bien le minimum sous 6M.

**⚠️** « C'est là que s'arrête le disque d'accrétion » (niv. 1) : vrai pour un
disque mince (Shakura-Sunyaev), **faux pour Sgr A***, qui est un RIAF
géométriquement épais sans bord interne net — le site l'admet en `FICHES[5]` niv. 2
et dans `METHODE`, mais l'affirmation reste non nuancée là où elle est écrite.

**⚠️ Incohérence interne :** le disque rendu commence à `R_IN = 2.6` r_s
(`index.html` l. 361) alors que l'ISCO tracée est à `R_ISCO = 3.0`. L'image montre
donc du gaz **à l'intérieur** de la « dernière orbite stable » que le texte
présente comme le bord du disque, et que le calque dessine en pointillés.

### 4.6 Espacement des sous-anneaux en e^(−π)
> « Les sous-anneaux n ≥ 1 […] sont espacés d'un facteur e^(−π) ≈ 0,043 en flux »
> — `FICHES[3]` niv. 2 · « espacées d'un facteur e^(−π) en flux » — `q3-2`
> (sources : `bardeen1973`, `gralla2019`, `eht2022`)

**✅ pour la physique** : pour Schwarzschild l'exposant de Lyapunov du lensing vaut
γ = π, et les sous-images successives sont démagnifiées d'un facteur
e^(−π) ≈ 0,043. e^(−π) = 0,043 21.

**⚠️ pour l'attribution.** Gralla, Holz & Wald 2019 introduit la distinction
image directe / anneau de lentille (n = 1) / anneau de photons (n ≥ 2) et
**démontre au contraire que l'excès de brillance de l'anneau de photons n'est que
logarithmique** (« of no relevance to present observations »). Le facteur e^(−π)
comme démagnification universelle vient de :

- M. D. Johnson et al., *Universal interferometric signatures of a black hole's
  photon ring*, Science Advances **6**, eaaz1310 (2020),
  doi [10.1126/sciadv.aaz1310](https://doi.org/10.1126/sciadv.aaz1310) ;
- S. E. Gralla & A. Lupsasca, *Lensing by Kerr black holes*, PRD **101**, 044031 (2020).

**Recommandation : ajouter `johnson2020` au registre** et le citer ici, en gardant
`gralla2019` pour la seule taxinomie n = 0/1/≥2.

### 4.7 BHEX
> « C'est la cible de l'EHT spatial (BHEX) : l'anneau n = 1 deviendrait une mesure
> directe de la métrique » — `FICHES[3]` niv. 2

**✅** Le Black Hole Explorer est une mission VLBI spatiale submillimétrique
(3,5 m, 80–320 GHz, résolution ~6 μas, lancement proposé 2031) dont l'objectif
scientifique premier est la détection de l'anneau de photons de M87* et Sgr A* et
la mesure directe du spin. Réf. : *The Black Hole Explorer: Motivation and Vision*,
[arXiv:2406.12917](https://arxiv.org/abs/2406.12917).
**Non sourcé dans le registre** (voir §9). Préciser qu'il s'agit d'une mission
**proposée**, pas d'un instrument en vol.

---

## 5. Déflexion de la lumière et l'éclipse de 1919

### 5.1 L'équation
> « d²u/dφ² + u = 3GMu²/c² avec u = 1/r ; le membre de droite est le terme purement
> relativiste, celui qui double la déflexion newtonienne » — `FICHES[2]` niv. 2

**✅** Équation de Binet nulle de Schwarzschild, correcte. Source :
`chandrasekhar1983`. La formule au premier ordre α = 4GM/c²b (`METHODE`, Curieux ;
`ESSAIS[2]`) est **✅ exacte**, ainsi que le second ordre 15πM²/4b² utilisé dans le
commentaire du banc d'essai (`index.html` l. 1546-1548) **✅**.

### 5.2 « 1,75″ au limbe solaire, mesuré par Eddington en 1919 »
`FICHES[2]` niv. 2 ; champ `sert` de `dyson1920`.

**⚠️** Deux imprécisions :

1. **1,75″ est la prédiction de la relativité générale, pas une mesure.** Les
   valeurs publiées par Dyson, Eddington & Davidson 1920 sont
   **1,98″ ± 0,12** (Sobral) et **1,61″ ± 0,30** (Príncipe) ;
2. **Eddington n'a pas mesuré la valeur retenue.** Il était à Príncipe (le résultat
   le moins précis) ; Sobral était l'expédition de Crommelin et Davidson. Les
   résultats ont été annoncés le 6 novembre 1919 par Dyson, Eddington et Crommelin.

Formulation défendable : « 1,75″ prédit au limbe solaire, encadré en 1919 par les
mesures de Sobral (1,98″ ± 0,12) et de Príncipe (1,61″ ± 0,30) ».
Source : [10.1098/rsta.1920.0009](https://doi.org/10.1098/rsta.1920.0009).

`METHODE` (Curieux) : « C'est ce facteur 2 qu'Eddington est allé mesurer pendant
l'éclipse de 1919 » — **✅ acceptable** à ce niveau de vulgarisation (c'est bien le
facteur 2 qui était en jeu, et Eddington a bien monté l'expédition).

### 5.3 « aujourd'hui contraint à 10⁻⁵ près par VLBI »
`FICHES[2]` niv. 2.

**❌ FAUX au niveau expert.** La meilleure contrainte VLBI est
γ = 0,999 92 ± 0,000 12, soit **1,2 × 10⁻⁴** (S. Lambert & C. Le Poncin-Lafitte,
*Improved determination of γ by VLBI*, A&A **529**, A70, 2011,
doi [10.1051/0004-6361/201016370](https://doi.org/10.1051/0004-6361/201016370)).
Le niveau 10⁻⁵ — γ − 1 = (2,1 ± 2,3) × 10⁻⁵ — vient de **Cassini**, par retard
Shapiro sur le lien radio, pas de VLBI (B. Bertotti, L. Iess & P. Tortora,
*Nature* **425**, 374, 2003, doi [10.1038/nature01997](https://doi.org/10.1038/nature01997)).

Correction : « contraint à 10⁻⁴ près par VLBI, et à 2 × 10⁻⁵ par le retard Shapiro
mesuré sur Cassini ». **Deux références sont à ajouter au registre.**

---

## 6. Chute dans le trou noir, horizon, marées

### 6.1 Temps propre maximal à l'intérieur de l'horizon
> « le temps propre restant est majoré par πGM/c³ ≈ 60 s ici » — `q2-2`

**⚠️ Formule exacte, valeur numérique fausse de 10 %.** πGM/c³ = π × 21,170 s =
**66,5 s**. Écrire « ≈ 66 s » (ou « à peine plus d'une minute »).
La majoration πGM/c³ elle-même est **✅ correcte** (temps propre maximal entre le
franchissement de l'horizon et r = 0, atteint par la chute libre depuis le repos
à l'horizon). Sur la référence, voir la réserve sur `misner1973` au §1.

### 6.2 « Les marées divergent en M/r³ »
`q2-2`. **✅** Le gradient de marée radial vaut 2GM/r³ ; il diverge bien en r⁻³.

### 6.3 « L'étirement à l'horizon est plus faible que celui que la Lune t'inflige »
> « Sur Sgr A*, l'étirement à l'horizon est plus faible que celui que la Lune
> t'inflige : tu passes sans le remarquer » — `contenu.js`, `q2-1`
> « les forces d'étirement à l'horizon sont plus faibles que celles que la Lune
> exerce sur toi » — `index.html`, `FICHES[1]` niv. 1

**❌ FAUX, de neuf ordres de grandeur.** Calcul :

| | gradient de marée |
|---|---|
| horizon de Sgr A* (2GM/r_s³) | **5,58 × 10⁻⁴ s⁻²** |
| Lune sur un corps à la surface de la Terre | **1,73 × 10⁻¹³ s⁻²** |
| Terre elle-même, à sa surface | 3,08 × 10⁻⁶ s⁻² |

La marée à l'horizon de Sgr A* est **3,2 × 10⁹ fois plus forte** que celle de la
Lune, et 180 fois plus forte que celle de la Terre à sa surface. Il faudrait un
trou noir de **2,4 × 10¹¹ M☉** — 57 000 fois Sgr A* — pour que l'égalité tienne.

**La conclusion pédagogique, elle, reste ✅ vraie** : sur un corps de 1,8 m,
l'écart d'accélération tête-pieds vaut 1,0 × 10⁻³ m/s², soit **≈ 10⁻⁴ g** —
strictement imperceptible. Il suffit donc de remplacer la comparaison par un
chiffre absolu : « l'étirement à l'horizon vaut environ un dix-millième de la
pesanteur terrestre sur la longueur de ton corps : tu ne le sens pas ».

Aucune comparaison courante ne sauve la phrase : même la marée que la Terre exerce
sur toi, debout à sa surface, est 180 fois plus faible.

### 6.4 Le reste de la fiche « horizon »
> « l'invariant de Kretschmann K = 48G²M²/c⁴r⁶ reste fini en r_s » — `FICHES[1]` niv. 2
**✅** Valeur exacte pour Schwarzschild.

> « La dégénérescence de la métrique de Schwarzschild y est un artefact de
> coordonnées, levé en Eddington-Finkelstein ou Kruskal-Szekeres » **✅**

> « firewalls (AMPS 2012) » **✅** (préprint arXiv juillet 2012, publié JHEP 2013).

> « depuis 2019 les courbes de Page reconstruites par surfaces quantiques extrémales
> — l'information ressortirait, sans mécanisme local identifié » **✅** conforme à
> `penington2020` (et Almheiri et al. 2019), qui n'est pourtant citée nulle part.

> « la distance au centre cesse d'être une direction d'espace pour devenir une
> direction de temps » (`q2-1`), « En intérieur de Schwarzschild r devient de type
> temps » (`q2-2`) **✅**

> « la frontière du passé causal de l'infini nul futur » (`q1-2`) **✅** définition
> standard de l'horizon des événements (∂J⁻(𝓘⁺)).

> « Les théorèmes de singularité de Penrose-Hawking garantissent qu'un effondrement
> suffisant en produit une ; la censure cosmique, elle, reste conjecturale »
> **✅** (`penrose1965`) — sous réserve des conditions d'énergie, non mentionnées,
> ce qui est acceptable au niveau expert d'un site grand public.

### 6.5 Image figée sur l'horizon
`avalee-0/1/2`, `inactif-3`, `FICHES[1]` niv. 0. **✅** Décalage vers le rouge et
gel apparent de l'image vus de l'extérieur ; traversée régulière pour l'infalling.
Le terme historique « étoile gelée » (*frozen star*, littérature soviétique des
années 1960) est **✅** correct.

---

## 7. Le disque : brillance, Doppler, rendements

### 7.1 Rendements 5,7 % et 42 %
> « Rendement 5,7 % en Schwarzschild, jusqu'à 42 % en Kerr extrême prograde »
> — `FICHES[4]` niv. 2

**✅** Calcul : 1 − √(8/9) = **5,719 %** ; 1 − 1/√3 = **42,26 %**. Valeurs de
Bardeen, Press & Teukolsky 1972, [10.1086/151796](https://doi.org/10.1086/151796).

> « jusqu'à 6 % de l'énergie de masse convertie en lumière, contre 0,7 % pour la
> fusion nucléaire » — `FICHES[4]` niv. 1 **✅** (H → He : 0,7 %).

> « Un trou noir est la machine la plus efficace de l'univers pour transformer de la
> matière en rayonnement » **⚠️** vrai pour les processus astrophysiques connus,
> mais l'annihilation matière-antimatière fait 100 %. Formulation à borner
> (« le mécanisme naturel le plus efficace »).

### 7.2 Modèle de disque
> « Disque mince Shakura-Sunyaev (1973), viscosité α portée par la MRI
> (Balbus-Hawley 1991) » **✅** attributions exactes.

> « RIAF/ADAF, optiquement mince, refroidissement inefficace, l'essentiel de
> l'énergie étant advecté » **✅** conforme à `yuan2014`.

> « Les GRMHD (KHARMA, BHAC) reproduisent l'anneau EHT mais butent encore sur la
> variabilité intra-journalière » **✅** EHT Sgr A* Paper V : tous les modèles de la
> bibliothèque échouent à au moins une contrainte, la variabilité de la courbe de
> lumière étant la plus sévère, éliminant presque tous les modèles MAD.
> Réf. : EHT Collab., ApJL **964**, L25 (2024),
> [arXiv:2311.09478](https://arxiv.org/abs/2311.09478) — **absente du registre**.

> « jusqu'à des millions de degrés » (`FICHES[4]` niv. 0) **✅** pour un disque
> mince autour d'un supermassif. (Pour le vrai Sgr A*, les électrons sont bien plus
> chauds — 10¹⁰–10¹¹ K — mais c'est le disque représenté qui est décrit ici.)

### 7.3 Facteur Doppler
> « Facteur Doppler D = 1/(γ(1 − β·n̂)), intensité observée en D³ pour une source
> monochromatique, D⁴ en bolométrique intégrée » — `FICHES[5]` niv. 2

**✅** Correct : I_ν/ν³ est l'invariant, donc I_ν^obs = D³ I_ν^em et
I^bol = D⁴ I^bol_em.

### 7.4 « β ≈ 0,4 à l'ISCO de Schwarzschild »
`FICHES[5]` niv. 2.

**⚠️** Ambigu et, pour le calcul Doppler, faux. La vitesse **mesurée par un
observateur statique local** — celle qui entre dans le facteur Doppler — vaut
v = √(GM/(r − r_s)) → **β = 0,500 à l'ISCO**. Le 0,408 = √(M/r) est la vitesse
**en coordonnées** (r dφ/dt), qui est aussi celle qu'utilise le shader
(`sqrt(0.5/r)`, l. 441). Au niveau Astrophysicien, il faut dire laquelle.

### 7.5 « son éclat multiplié par dix »
> « Le côté qui approche voit son éclat multiplié par dix » — `FICHES[5]` niv. 1

**⚠️ Trompeur au niveau où c'est écrit.** À β = 0,4, D³ = 4,8 : le côté qui
approche est ~5 fois plus brillant qu'en l'absence de beaming. Le facteur **10 est
plutôt le rapport entre les deux côtés** — ((1+β)/(1−β))³ = 13,5 à β = 0,4, 27 à
β = 0,5. Le lecteur du niveau Curieux comprendra « ×10 par rapport au repos ».
Reformuler en « une dizaine de fois plus brillant que le côté qui s'éloigne ».

### 7.6 Sens de rotation de M87*
> « C'est sur cette asymétrie que l'EHT a conclu au sens horaire de rotation de M87*
> et à un jet aligné sur le spin » — `FICHES[5]` niv. 2

**⚠️ Conclusion inversée sur un point.** EHT M87 Paper V établit que l'asymétrie
sud implique que **l'axe de spin pointe à l'opposé de la Terre** (écoulement
tournant dans le sens horaire sur le ciel) — **si** le spin et le jet à grande
échelle sont alignés. L'alignement est une **hypothèse** du raisonnement, pas une
conclusion. Le papier précise en outre que l'asymétrie combine beaming Doppler,
lentille et aberration, et non le seul Doppler.
Source : [10.3847/2041-8213/ab0f43](https://doi.org/10.3847/2041-8213/ab0f43).

> « une mesure directe du sens de rotation du disque » (niv. 1) **✅** avec la même
> réserve : c'est l'indicateur principal, pas un mesurande pur.

> « Dans la partie interne, le gaz file à 30-40 % de la vitesse de la lumière »
> **✅** ordre de grandeur juste (√(M/r) = 0,32 à r = 5 r_s, 0,41 à l'ISCO).

> « redshift gravitationnel √(1 − r_s/r), qui lui ne dépend que du rayon d'émission »
> **✅**

---

## 8. Revendications d'exactitude de la simulation

Cette section vérifie les affirmations du site **sur lui-même** (`METHODE`, les
trois niveaux, et `FICHES[7]` « Est-ce que c'est vrai ? »), en les confrontant au
code de `index.html`.

### 8.1 Ce qui est effectivement exact — ✅
- Le shader intègre bien une **géodésique nulle de Schwarzschild** :
  `acc = -1.5 * h2 * pos / pow(r,5)` (l. 500), avec 2M = 1, donc 3M = 1,5 : forme
  cartésienne correcte, équivalente à d²u/dφ² + u = 3Mu².
- Les **conditions initiales** (l. 457-476) sont exactes pour un observateur
  statique : h = r sinψ/√(1 − r_s/r), |dr/dλ|² = 1 + h²/r³ − h²/r² + h²/r² = 1 + h²/r³.
  La normalisation correspond à E = 1, λ → longueur d'arc à l'infini. Correct.
- **Pas de renormalisation** de la direction : le commentaire de code (l. 461, 499)
  est juste, λ est affine et la « vitesse » ne l'est pas.
- **h² conservé** comme diagnostic : légitime.
- Les quatre valeurs du banc d'essai (1,5 ; √27·M ; 4M/b ; 6M) sont des sorties du
  schéma, pas des paramètres : **✅ la revendication tient**.
- Le développement au second ordre 15πM²/4b² invoqué pour expliquer l'écart
  résiduel sur la déflexion est **✅ correct**.
- « Un post-traitement en espace écran ne peut pas produire d'images d'ordre n :
  il est une bijection du plan image sur lui-même » **✅** — l'argument est valide
  et c'est effectivement le bon discriminant.
- « pour chacun des deux millions de points de ton écran » **✅** (~2,1 Mpx en 1080p).

### 8.2 Contradictions entre `METHODE` (Astrophysicien) et le code — ❌
> « **Intégrateur position-Verlet** à pas adaptatif dt = clamp(0,085 r ; 0,045 ; 1,4),
> **direction renormalisée à chaque pas**, 240 pas au maximum »

Trois écarts avec le shader :

1. **« position-Verlet » ❌** — le code fait du **Verlet-vitesse** (l. 499-503 :
   accélération réévaluée en fin de pas et moyennée), et le commentaire du code le
   dit explicitement.
2. **« direction renormalisée à chaque pas » ❌** — le shader écrit l'inverse en
   toutes lettres : « *surtout pas de normalize sur nd, λ est un paramètre affine* »
   (l. 499), et le commentaire l. 460-461 explique pourquoi ce serait faux. La
   phrase de `METHODE` décrit donc un bug que le code prend soin de ne pas avoir.
3. **le pas** est `clamp(r*0.085, 0.045, 1.4) / vn` — la division par la vitesse
   affine `vn` est omise dans le texte, et le pas est encore réduit près d'un
   photon témoin.

`240 pas` **✅** et `r < 1` / `r > 70` **✅** sont exacts.

> « Le banc d'essai ci-dessous rejoue ces géodésiques en JavaScript **avec la même
> équation et les mêmes constantes que le GLSL** — la version shader en est la
> transcription littérale. »

**❌ Faux sur les constantes.** L'équation est bien la même
(`integrePhoton`, l. 672-682), mais le banc utilise r₀ = 20 000 (400 000 pour la
déflexion), **2 000 000 de pas maximum** et un pas
`max(0.0004, r*0.004/|d|)` — soit ~20 fois plus fin que le shader, avec 8 000 fois
plus de pas. Le banc valide **l'équation**, pas les réglages numériques du rendu.
Comme c'est précisément la promesse d'auditabilité du site, la phrase doit être
corrigée : « rejoue la même équation, avec un pas beaucoup plus fin que le rendu
temps réel ».

### 8.3 Incohérence d'unités du photon témoin — ❌
> « **6 min 39 s** par tour d'anneau. C'est le temps que met un photon pour boucler
> la sphère des photons. » — `index.html`, `majLecture()`, l. 960
> « je boucle un tour toutes les **six minutes et demie** » — `contenu.js`, `accueil-1`
> « il me faut **6 min 39 s** pour un tour » — `contenu.js`, `vitesse-reel`

**❌ Sous-estimé d'un facteur √3.** La période en temps coordonnée d'un photon sur
la sphère des photons vaut T = 6√3 π GM/c³ = **691 s = 11 min 31 s**.

Le 399 s affiché (= 6 min 39 s) est la circonférence coordonnée 2π × 1,5 r_s
divisée par c, c'est-à-dire la valeur **plate**. Deux causes se composent :

1. `lancePhoton()` (l. 757-766) initialise `h2 = |p × d|²` avec `|d| = 1`, alors
   que la normalisation du shader impose |dr/dλ| = √3 à r = 1,5 : le paramètre
   affine y est √3 fois trop rapide ;
2. `f.parcours` accumule **Δλ** et non le temps coordonnée : il manque le facteur
   dt/dλ = 1/(1 − r_s/r), qui vaut 3 sur la sphère des photons.

Les deux erreurs ne se compensent pas exactement : le produit vaut √3 ≈ 1,732, et
691 / 399 = 1,732. Toutes les durées de vol affichées par le HUD sont donc
sous-estimées près du trou noir (retard de Shapiro ignoré) ; loin, elles sont
justes, car λ → ct à l'infini.

Corollaires : « 2 centièmes de rayon par seconde » (`vitesse-reel`) est **✅**
(1/42,34 = 0,0236 r_s/s à la vitesse de la lumière) ; « il est déjà 15 min plus
vieux quand il arrive jusqu'à toi » est **✅** cohérent avec la distance caméra
par défaut (21 r_s × 42,34 s = 889 s ≈ 14,8 min).

### 8.4 Le tour du bord externe du disque — ❌
> « Une heure par seconde. À ce rythme le bord externe du disque fait son tour
> pendant que tu clignes des yeux — et ça reste **un mois de vrai temps**. »
> — `contenu.js`, `vitesse-heure` (**aucune source rattachée**)

**❌ Faux d'un facteur ~190.** Le bord externe du disque est à `R_OUT = 11` r_s
(l. 362). Période képlérienne : T = 2π r^{3/2}/√(GM) = **1,37 × 10⁴ s = 3 h 49 min**,
soit 0,16 jour et non un mois. À une heure par seconde, ce tour prend **3,8 s** de
temps réel — ce qui n'est pas non plus « un clignement d'yeux ».

Pour obtenir un mois, il faudrait un bord externe à ~360 r_s. Soit corriger le
texte (« presque quatre heures de vrai temps, quatre secondes à l'écran »), soit
éloigner `R_OUT`.

### 8.5 La liste des approximations est-elle honnête et complète ?

Ce qui est déclaré est **✅ exact et bien vu** : spin nul (ni frame-dragging, ni
ergosphère, ni ISCO déplacée), pas de transfert radiatif, disque mince alors qu'un
RIAF est épais (H/R ~ 1, conforme à `yuan2014`), Doppler sans γ, simultanéité
ignorée, sondes intégrées en temps coordonnée. Les codes cités (KHARMA, BHAC,
ipole, RAPTOR) sont **✅** les bons.

**⚠️ La liste est cependant incomplète**, et une entrée est mal placée :

1. **Le redshift gravitationnel est présenté comme exact alors qu'il ne l'est pas.**
   `FICHES[7]` niv. 2 le range dans la colonne « **Exact** — […] redshift
   gravitationnel √(1−r_s/r) ». Le shader (l. 447) applique
   `lum *= sqrt(max(1.0 - 1.0/r, 0.02))`, c'est-à-dire **g¹ sur la seule luminosité**,
   avec un plancher à 0,02, et **sans décalage de couleur**. La loi correcte est g³
   (ou g⁴ bolométrique), exactement comme pour le Doppler que le site range, lui,
   dans les approximations. **À déplacer dans la colonne « Approximé ».**
2. **β est la vitesse en coordonnées**, `sqrt(0.5/r)` (l. 441), et non la vitesse
   mesurée localement √(M/(r − 2M)) ; le facteur est en outre **clampé à ±0,85**
   (l. 442) et les décalages de couleur (`pow(dop, 0.55)`, `pow(dop,-0.45)`, l. 445)
   sont ad hoc. L'erreur induite dépasse le seul facteur γ déclaré.
3. **L'erreur due à l'omission de γ est sous-estimée.** `METHODE` annonce
   « d'ordre γ−1 ≈ 10 % au bord interne ». Comme l'intensité va en D³, l'erreur
   d'amplitude est γ³ − 1, soit **32 % à β = 0,4** et **54 % à β = 0,5**.
4. **Le bord interne du disque est sous l'ISCO** : `R_IN = 2.6` contre
   `R_ISCO = 3.0` (voir §4.5). Non mentionné.
5. **Le nombre de pas plafonne l'ordre des images.** `STEPS = 240` : la
   revendication « le second anneau du disque est visible à l'œil, et un troisième
   existe sous le seuil de résolution » n'a **pas pu être vérifiée** ici. Le budget
   de pas rend n = 1 atteignable et n = 2 très serré. À mesurer avant de
   l'affirmer, ou à formuler au conditionnel.
6. **Le calque de trajectoires n'est pas lensé.** `projette()` (l. 615-623) est une
   projection rectiligne — les trajectoires des sondes dessinées par-dessus l'image
   ne subissent aucune déviation, alors que l'image derrière, si. Le commentaire du
   code le dit honnêtement ; **`METHODE` ne le dit pas**, alors que c'est
   directement visible à l'écran.
7. **`R_OMBRE = 2.55`** (l. 562) est une constante en dur utilisée pour
   l'occlusion du calque, alors que la valeur exacte est 2,598. C'est sans effet sur
   l'image ray-tracée, mais `METHODE` (Découverte) affirme « personne n'a décidé de
   la taille du rond noir » : la nuance mérite d'être posée, le rond de l'**image**
   sort bien du calcul, celui du **calque** est posé à la main.

### 8.6 Autres affirmations de `METHODE`
> « la valeur qui en sort est exactement celle que des physiciens ont trouvée avec
> un papier et un crayon, bien avant les ordinateurs : 2,6 fois la taille du trou
> noir » — Découverte. **✅** (Hilbert 1917 pour b_c, Synge 1966 et Bardeen 1973
> pour l'ombre observée.) Non sourcé.

> « Le vrai Sagittarius A* est beaucoup plus pâle, et on ne le voit qu'avec des
> antennes radio » — Découverte / `q6-0`. **✅** (EHT à 230 GHz, λ = 1,3 mm.)

> « Et le vrai tourne sur lui-même » — Découverte. **⚠️** Le spin de Sgr A* est
> **mal contraint** ; `METHODE` (Astrophysicien) le dit correctement (« non nul mais
> mal contraint »), le niveau Découverte l'affirme sans réserve.

---

## 9. Affirmations factuelles sans aucune source

### 9.1 Le problème structurel
`contenu.js` pose en règle, dans son en-tête : « *aucune affirmation factuelle ne
doit exister ailleurs que dans ce fichier, et chacune doit porter au moins une clé
de `sources`* ».

**Cette règle est violée à grande échelle** : les 8 fiches × 3 niveaux (`FICHES`),
les 3 niveaux du dossier (`METHODE`) et le banc d'essai (`ESSAIS`) vivent tous en
dur dans `index.html` et **ne portent aucune clé de source**. C'est là que se
trouve la quasi-totalité des affirmations expertes, et notamment toutes les erreurs
listées en §10.

Corollaire mesurable : trois entrées du registre — **`dyson1920`, `eht2019`,
`penington2020`** — ne sont citées par **aucune** réplique, précisément parce que
les affirmations qu'elles étayent (déflexion 1919, sens de rotation de M87*,
courbes de Page) sont dans `FICHES` et non dans `contenu.js`.

L'outil `outils/sources.py`, annoncé dans l'en-tête de `contenu.js` comme le
générateur de ce fichier, **n'existe pas** (`outils/` ne contient que `lignes.mjs`
et `voix.py`).

### 9.2 Répliques de `contenu.js` sans clé `sources`
Sans conséquence (pas de fait vérifiable) : `accueil-0`, `pluie-0`, `pluie-1`,
`photon-avale`, `traj`, `niveau-0`, `niveau-1`, `niveau-2`, `q1-0`.

**Avec un fait vérifiable — et faux** : `vitesse-heure` (« un mois de vrai
temps », voir §8.4).

### 9.3 Affirmations sourçables non sourcées
Références manquantes du registre, par ordre d'importance :

| affirmation | emplacement | référence à ajouter |
|---|---|---|
| démagnification e^(−π) des sous-anneaux | `FICHES[3]` niv. 2, `q3-2` | Johnson et al. 2020, Sci. Adv. 6, eaaz1310 |
| contrainte moderne sur la déflexion | `FICHES[2]` niv. 2 | Lambert & Le Poncin-Lafitte 2011 (VLBI) ; Bertotti, Iess & Tortora 2003 (Cassini) |
| GRMHD reproduisant l'anneau mais pas la variabilité | `FICHES[4]` niv. 2 | EHT Sgr A* Paper V, ApJL 964, L25 (2024) |
| BHEX / EHT spatial | `FICHES[3]` niv. 2 | arXiv:2406.12917 |
| temps propre maximal πGM/c³ | `q2-2` | Lewis & Kwan 2007, PASA 24, 46 |
| méthode du continuum, raie Kα du fer à 6,4 keV | `FICHES[6]` niv. 2 | McClintock et al. 2014 / Reynolds 2021 (aucune référence de spin) |
| toutes les fiches et tout `METHODE` | `index.html` | migration vers `contenu.js` ou ajout d'un champ `sources` |

### 9.4 Affirmation demandée et absente du site
L'affirmation selon laquelle **l'équipe d'*Interstellar* aurait retiré l'asymétrie
Doppler à la demande de Nolan** ne figure **nulle part** dans `index.html`,
`contenu.js` ni `IDEES.md` (recherche sur « Interstellar », « Nolan », « Thorne »,
« Double Negative », y compris dans l'historique git). Rien à corriger.

Pour mémoire, si elle devait être ajoutée : la référence est O. James,
E. von Tunzelmann, P. Franklin & K. S. Thorne, *Gravitational lensing by spinning
black holes in astrophysics, and in the movie Interstellar*, Class. Quantum Grav.
**32**, 065001 (2015), doi
[10.1088/0264-9381/32/6/065001](https://doi.org/10.1088/0264-9381/32/6/065001),
[arXiv:1502.03808](https://arxiv.org/abs/1502.03808). Le papier documente bien que
le disque physiquement réaliste était « exceedingly lopsided » et jugé inacceptable
pour le film, d'où l'omission du décalage Doppler et du beaming. **Je n'ai pas pu
récupérer la phrase exacte du §6** : attribuer nommément la décision à Nolan
demande une citation littérale que je n'ai pas vérifiée. À ne pas écrire sans
avoir ouvert le PDF.

---

## 10. Récapitulatif par gravité

### ❌ Erreurs factuelles
| # | affirmation | emplacement | valeur juste |
|---|---|---|---|
| 1 | « moins dense que l'eau » | `contenu.js` `inactif-1` | ρ = 9,98 × 10⁵ kg/m³ ≈ 1 000 × l'eau (calcul) |
| 2 | marée à l'horizon < marée lunaire | `contenu.js` `q2-1` ; `FICHES[1]` niv. 1 | 3,2 × 10⁹ fois plus forte ; mais ≈ 10⁻⁴ g sur un corps → imperceptible (calcul) |
| 3 | « contraint à 10⁻⁵ près par VLBI » | `FICHES[2]` niv. 2 | VLBI : 1,2 × 10⁻⁴ ; 10⁻⁵ = Cassini |
| 4 | tour du photon en 6 min 39 s | `majLecture()` l. 960 ; `accueil-1` ; `vitesse-reel` | 6√3 πGM/c³ = 691 s = 11 min 31 s |
| 5 | « un mois de vrai temps » | `contenu.js` `vitesse-heure` | 3 h 49 min à R_OUT = 11 r_s |
| 6 | « direction renormalisée à chaque pas » | `METHODE`, Astrophysicien | le code fait l'inverse, exprès |
| 7 | « intégrateur position-Verlet » | `METHODE`, Astrophysicien | Verlet-vitesse |
| 8 | « les mêmes constantes que le GLSL » | `METHODE`, Astrophysicien | pas 20 × plus fin, 8 000 × plus de pas |
| 9 | redshift gravitationnel rangé dans « Exact » | `FICHES[7]` niv. 2 | appliqué en g¹ sur la luminosité seule, plancher 0,02, sans couleur |
| 10 | 1,75″ « mesuré par Eddington » | `FICHES[2]` niv. 2 ; `sert` de `dyson1920` | 1,75″ = prédiction ; mesures 1,98″ ± 0,12 et 1,61″ ± 0,30 |

### ⚠️ Imprécisions et formulations trompeuses
| # | affirmation | emplacement | correction |
|---|---|---|---|
| 11 | « 26 000 années-lumière » | `FICHES[0]` niv. 0 ; `q5-0` ; `photon-fuite` | 27 000 al (8 277 pc) |
| 12 | « ± 0,013 » et « ± 31 pc » | `FICHES[0]` niv. 2 | ± 0,012 stat ± 0,040 sys ; ± 9 stat ± 33 sys |
| 13 | « (GRAVITY, 2021) » et clé `gravity2021` | `FICHES[0]` niv. 2 ; `contenu.js` | l'article est de **2022** (A&A 657, L12) |
| 14 | « πGM/c³ ≈ 60 s » | `q2-2` | 66,5 s |
| 15 | ombre « √27 GM/c² […] soit ~52 μas » | `FICHES[3]` niv. 2 | 52-53 μas est le **diamètre** ; le rayon fait 26,6 μas |
| 16 | « β ≈ 0,4 à l'ISCO » | `FICHES[5]` niv. 2 | 0,408 en coordonnées ; **0,500** mesuré localement |
| 17 | « éclat multiplié par dix » | `FICHES[5]` niv. 1 | ×4,8 vs repos ; ×13,5 vs côté opposé |
| 18 | « l'EHT a conclu […] à un jet aligné sur le spin » | `FICHES[5]` niv. 2 | l'alignement est une hypothèse, pas une conclusion |
| 19 | « 3 % de la vitesse de la lumière » | `FICHES[0]` niv. 1 | 2,55 % |
| 20 | « une bille de 12,7 millions de km » | `FICHES[0]` niv. 1 | rayon ; diamètre = 25,4 × 10⁶ km |
| 21 | erreur Doppler « d'ordre γ−1 ≈ 10 % » | `METHODE`, Astrophysicien | γ³ − 1 : 32 % à β = 0,4 |
| 22 | « le prix Nobel de physique 2020 » | `FICHES[0]` niv. 1 ; `q4-2` | moitié à Penrose, moitié partagée Genzel/Ghez |
| 23 | « le vrai tourne sur lui-même » | `METHODE`, Découverte | spin non nul mais **mal contraint** |
| 24 | « c'est là que s'arrête le disque » | `FICHES[6]` niv. 1 | vrai pour un disque mince, pas pour un RIAF |
| 25 | « la machine la plus efficace de l'univers » | `FICHES[4]` niv. 1 | le mécanisme **naturel** le plus efficace |
| 26 | disque rendu de 2,6 à 11 r_s | `index.html` l. 361-362 | bord interne **sous** l'ISCO à 3 r_s |
| 27 | « un troisième [anneau] existe sous le seuil » | `METHODE`, Astrophysicien | **non vérifié** — STEPS = 240 |
| 28 | trajectoires du calque non lensées | `projette()` l. 615 | absent de la liste des approximations |
| 29 | attribution de e^(−π) | `gralla2019` | Johnson et al. 2020 / Gralla & Lupsasca 2020 |

### ❔ Non vérifié
- Pagination de `birkhoff1923` (p. 253) et sections MTW §25/§31 de `misner1973` —
  ouvrages papier, non consultables en ligne. La localisation du temps propre
  maximal πGM/c³ dans MTW est en particulier **douteuse**.
- Chapitre 3 de `chandrasekhar1983` : le contenu correspond, la pagination exacte
  n'a pas été contrôlée.
- Capacité effective du shader à produire l'image d'ordre n = 2 (voir #27).
