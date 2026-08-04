# Audit des trois niveaux — `contenu.js`

Audit du contenu pédagogique au 4 août 2026. Périmètre : les 9 fiches, les
6 questions, les répliques de Lumen, les missions, le module spectre et le
dossier « méthode » de `contenu.js`, confrontés au code (`index.html`,
`kerr.js`), aux engagements de `SOURCES.md`, `REFERENCES.md`, `IDEES.md`, et
au standard fixé par `CHUTE.md`. Toutes les valeurs recalculées le sont avec
les constantes de `SOURCES.md` (M = 4,297 × 10⁶ M☉, R₀ = 8 277 pc,
GM/c³ = 21,17 s, r_s = 1,269 × 10⁷ km).

État général : **la plupart des erreurs relevées par `SOURCES.md` ont été
corrigées** (densité, marées, 27 000 al, 11 min 31 s, VLBI/Cassini, Verlet,
renormalisation, R_IN suit désormais l'ISCO). Ce qui suit est ce qui reste,
plus ce que la fusion du moteur de Kerr a rendu faux depuis.

---

## Tableau de synthèse

| Fiche | Découverte | Curieux | Astrophysicien |
|---|---|---|---|
| 1. Sagittarius A* | ✅ bon | ⚠️ 3 % → 2,5 % ; « bille de 12,7 Mkm » = rayon ; Nobel sans le partage | ❌ barres d'erreur fausses, « (GRAVITY, 2021) » |
| 2. L'horizon | ✅ bon | ✅ bon | ✅ bon, substantiel |
| 3. Pourquoi la lumière tourne | ✅ bon | ✅ bon | ⚠️ exact mais VLBI/Cassini toujours sans clé |
| 4. Anneau et ombre | ✅ bon | ✅ bon | ⚠️ « rayon […] ~52 μas » = diamètre ; e^(−π) mal attribué ; BHEX non sourcé |
| 5. Pourquoi ça brille | ⚠️ « machine la plus efficace » à borner | ⚠️ idem | ✅ bon (réf. EHT 2024 à ajouter) |
| 6. Un côté plus brillant | ✅ bon | ⚠️ « éclat ×10 » : mauvaise grandeur | ⚠️ β ambigu ; « jet aligné » est une hypothèse |
| 7. La dernière orbite stable | ✅ bon | ⚠️ « là que s'arrête le disque » — pas pour Sgr A* | ✅ bon (réf. de spin à ajouter) |
| 8. Quand le trou noir tourne | ✅ bon | ❌ « presque cinq fois » = 3,8 ; 42 % sans dire que c'est l'extrême | ⚠️ « seul autre paramètre » (la charge existe) ; mesure 2,30/2,40 invérifiée |
| 9. Est-ce que c'est vrai ? | ✅ bon | ✅ bon | ❌ « métrique statique » périmé ; phrase cassée |
| Dossier méthode | ⚠️ « qu'avec des antennes radio » | ❌ « trou noir immobile » périmé | ❌ périmé (spin) ; contredit la fiche 9 (10 % vs 32 %) ; banc mal décrit |
| Questions | ✅ (q5-0 : glosser « années-lumière ») | ✅ bon | ❌ q2-2 « ≈ 60 s » ; q6-2 périmé (spin) |
| Lumen / missions | ✅ bon | — | ❌ inactif-6 : 26 675 ans (distance pré-2021) ; ⚠️ vitesse-reel : persona photon |
| Spectre | ✅ bon | ✅ bon | ⚠️ « brillerait surtout en X » ; « million de fois trop pâle » ambigu ; une attribution GRAVITY fausse |

Le niveau **Astrophysicien est le point fort du site** : aucune fiche n'est une
paraphrase du niveau Curieux, toutes apportent formules, valeurs ou résultats
récents. Les problèmes sont des erreurs ponctuelles, pas un déficit de
substance. Le niveau **Découverte tient presque partout son contrat de zéro
acquis**. Le gros du travail restant est la **péremption due au moteur de
Kerr** et une **poignée de chiffres**.

---

## I. Faux, périmé, ou contradictoire — à corriger d'abord

### I.1 ❌ Le moteur de Kerr existe, quatre textes affirment encore le contraire

C'est la contradiction la plus grave du site : la fiche 8 dit « Ce que cette
page simule : l'ombre asymétrique […] et le bord interne du disque qui suit
l'ISCO », la réplique `inactif-4` dit « Monte le curseur de rotation », le code
le confirme (`kerr.js` intègre les géodésiques de Kerr en Boyer-Lindquist ;
`index.html` l. 3880 fait suivre au bord interne du disque l'ISCO de Kerr).
Quatre textes datent d'avant et disent l'inverse :

**a) `q6-2` (question « Ce que je vois, c'est vraiment ça ? », Astrophysicien) :**
> « Manquent : le spin (Kerr, frame-dragging, ergosphère, ISCO déplacée), le
> transfert radiatif […] »

Remplacement proposé :
> `Optique gravitationnelle exacte, astrophysique décorative. La métrique par
> défaut est statique ; le curseur de rotation passe le moteur en Kerr —
> ombre asymétrique et ISCO déplacée comprises (<i>fiche 8</i>). Manquent,
> dans les deux modes : le transfert radiatif en plasma optiquement mince, la
> géométrie épaisse d'un RIAF, la variabilité. Un vrai rendu part d'un
> post-traitement GRMHD ; ici l'émissivité est posée à la main.`

(et le `dire` correspondant — la voix est à régénérer).

**b) Fiche 9 « Est-ce que c'est vrai ? », Astrophysicien :**
> « <b>Approximé</b> — métrique statique (a = 0 : ni frame-dragging ni
> ergosphère). »

Remplacement proposé :
> `<b>Approximé</b> — métrique statique par défaut ; le mode rotation intègre
> Kerr (fiche 8), avec ses propres réserves : ergosphère non figurée, curseur
> borné à a* = 0,95.`

**c) Dossier méthode, Curieux, dernier paragraphe :**
> « Et la métrique employée est celle d'un trou noir <b>immobile</b>, alors
> que les vrais tournent. »

Remplacement proposé :
> `La métrique par défaut est celle d'un trou noir immobile ; le curseur de
> rotation passe en métrique de Kerr — c'est la fiche 8.`

**d) Dossier méthode, Astrophysicien, liste « Ce qui n'est délibérément pas
simulé », premier point :**
> « <b>Spin.</b> Métrique statique, a = 0. Ni frame-dragging, ni ergosphère,
> ni ISCO déplacée, ni asymétrie prograde/rétrograde. »

Remplacement proposé :
> `<li><b>Spin, partiellement.</b> Le rendu par défaut est en Schwarzschild.
> Le mode rotation intègre les géodésiques de Kerr en Boyer-Lindquist
> (formulation hamiltonienne, E et L_z conservés, quatre équations) ; il ne
> figure pas l'ergosphère et le curseur s'arrête à a* = 0,95. Le spin réel de
> Sgr A* est non nul mais mal contraint.</li>`

Au passage, le dossier méthode ne décrit nulle part le schéma de Kerr alors
qu'il décrit le schéma de Schwarzschild en détail ; le point d) ci-dessus en
donne le minimum, un paragraphe dédié serait mieux (hamiltonien 2H = [P + Δp_r²
+ p_θ²]/Σ − Q/(ΣΔ), contrôle par l'équation radiale standard avec constante de
Carter — c'est déjà dans l'en-tête de `kerr.js`, il suffit de le raconter).

### I.2 ❌ `q2-2` : « πGM/c³ ≈ 60 s » — la valeur est 66,5 s

Question « Qu'est-ce qui se passe si je tombe dedans ? », Astrophysicien :
> « le temps propre restant est majoré par <i>πGM/c³ ≈ 60 s</i> ici »

Recalcul : π × 21,17 s = **66,5 s**. C'est aussi la valeur que `CHUTE.md`
établit et affiche partout (66,5 s / « 66 secondes ») : le site se contredira
dès que la séquence de chute sera publiée. Remplacement : `πGM/c³ ≈ 66 s`,
et dans le `dire` : « environ soixante-six secondes » (MP3 à régénérer).

### I.3 ❌ `inactif-6` : 26 675 ans — c'est la distance d'avant GRAVITY 2021

> « arriverait ici en <b>19,8 ans</b> de vie à bord. Sur Terre il se serait
> écoulé 26 675 ans. » — et le `pourquoi` : « Pour d = 26 673 al »

26 673 al = 8 178 pc : c'est **R₀ de GRAVITY 2019**, pas les 8 277 pc de la
source citée (`gravity2021`), qui donnent 26 996 al. Le site dit lui-même
« 27 000 ans » dans `photon-fuite` et `q5-0` : contradiction interne. Les
19,8 ans à bord ne bougent pas (dépendance logarithmique). Remplacements :

- t : `…arriverait ici en <b>19,8 ans</b> de vie à bord. Sur Terre il se
  serait écoulé 27 000 ans. Personne ne t'attendrait.`
- pourquoi : `…Pour d = 26 996 al : <b>19,8 ans</b> à bord contre ~27 000 sur
  Terre, avec γ = 13 935 au demi-tour…`
- `dire` à régénérer (« vingt-sept mille ans »).

Corollaire dans `inactif-8` : la rapidité accumulée devient Δη = 20,47 et le
rapport de masses e^(20,47) = 7,8 × 10⁸, soit **environ 780 000 tonnes** par
kilo arrivé (au lieu de 20,45 / 758 000 t). L'ordre de grandeur ne change pas,
mais si on corrige la distance, corriger ces deux chiffres avec.

### I.4 ❌ Dossier méthode (Astrophysicien) contredit la fiche 9 sur l'erreur Doppler

Méthode, liste des approximations :
> « <b>Doppler.</b> <code>D = 1/(1 − β·n̂)</code> sans le facteur γ. L'erreur
> sur l'amplitude est d'ordre γ−1 ≈ 10 % au bord interne »

La fiche 9 (Astrophysicien) dit, elle, correctement : « une erreur de
γ³−1 ≈ 32 % au bord interne, **et non 10 %** ». Deux textes du même niveau se
contredisent sur le même chiffre. Remplacement du point de méthode :
> `<li><b>Doppler.</b> <code>D = 1/(1 − β·n̂)</code> sans le facteur γ, β pris
> en coordonnées et borné à 0,85. L'intensité allant en D³, l'erreur
> d'amplitude est d'ordre γ³−1 ≈ 32 % au bord interne : l'asymétrie
> qualitative est bonne, le contraste absolu non.</li>`

### I.5 ❌ Dossier méthode (Astrophysicien) : le banc d'essai est mal décrit

> « mais un pas des milliers de fois plus fin et sans plafond de pas »

Le code (`index.html` l. 3261-3266) : pas `max(0,0004, r·0,004/|d|)` — soit
**20 à 110 fois** plus fin que le shader selon r, pas des milliers — et un
plafond existe : **2 000 000 de pas** (contre 240). C'est la promesse
d'auditabilité du site, la description doit coller au code. Remplacement :
> `mais un pas vingt à cent fois plus fin et un plafond porté à deux millions
> de pas au lieu de 240 : il mesure la justesse de la <i>formulation</i>, pas
> celle du budget temps réel du shader.`

### I.6 ❌ Fiche 8, Curieux : « presque cinq fois plus près » — c'est 3,8

> « <b>1,16 rayon</b> dans le sens de la rotation à a* = 0,9, contre 4,36 à
> contresens. Presque cinq fois plus près d'un côté que de l'autre. »

Les deux valeurs d'ISCO sont justes (recalcul Bardeen-Press-Teukolsky :
2,321 M = 1,161 r_s et 8,717 M = 4,359 r_s), mais 4,36/1,16 = **3,76**.
Remplacement : `Presque quatre fois plus près d'un côté que de l'autre.`

Dans le même paragraphe, le rendement :
> « Le rendement passe de <i>5,7 %</i> de la masse convertie en lumière à
> <b>42 %</b> »

42 % est la limite **extrême** (a* → 1), pas la valeur de l'exemple à
a* = 0,9 qui vient d'être donné (15,6 %). Remplacement :
> `Le rendement passe de <i>5,7 %</i> de la masse convertie en lumière à 16 %
> à a* = 0,9, et jusqu'à <b>42 %</b> à la limite extrême — quand la fusion
> nucléaire d'une étoile plafonne à 0,7 %.`

### I.7 ❌ Fiche 1, Astrophysicien : barres d'erreur et année fausses

> « M = 4,297 ± 0,013 × 10⁶ M☉ à R₀ = 8 277 ± 31 pc (GRAVITY, 2021) »

L'article (A&A 657, L12) est de **2022** et publie M = (4,297 ± 0,012 stat
± 0,040 sys) × 10⁶ M☉, R₀ = 8 277 ± 9 stat ± 33 sys pc. Ni « ± 0,013 » ni
« ± 31 » n'existent dans le papier. Déjà relevé par `SOURCES.md` (§2.1), pas
corrigé. Remplacement :
> `M = (4,297 ± 0,012 ± 0,040) × 10⁶ M☉ à R₀ = 8 277 ± 9 ± 33 pc
> (GRAVITY, 2022), par astrométrie…`

(La clé `gravity2021` peut rester — les id ne se renomment pas — mais le champ
`ref` dit déjà 2022 ; c'est le texte affiché qui est faux.)

### I.8 ❌ Fiche 4, Astrophysicien : « rayon apparent […] soit ~52 μas » — 52 μas est le diamètre

> « ombre de rayon apparent √27 GM/c² ≈ 2,598 r<sub>s</sub>, soit ~52 μas
> pour Sgr A* »

Recalcul : θ_g = 5,13 μas → rayon = √27 θ_g = **26,6 μas**, diamètre =
53,3 μas. La phrase accroche le chiffre du diamètre à un rayon (et 51,8 μas
est le diamètre de l'**anneau** EHT, pas de l'ombre). `inactif-2`, qui parle
bien d'un diamètre, est correcte. Remplacement :
> `…ombre de rayon apparent √27 GM/c² ≈ 2,598 r<sub>s</sub> — un diamètre de
> ~53 μas pour Sgr A*, d'où l'interférométrie à l'échelle du globe.`

### I.9 ❌ `vitesse-reel` : Lumen parle encore comme un photon

> « Là tu es en <b>temps réel</b>. Je me déplace de deux centièmes de rayon
> par seconde. […] il me faut <i>11 min 31 s</i> pour un tour. »

Depuis la refonte, Lumen est « le système de bord de ce vaisseau »
(`accueil-0`) ; le vaisseau boucle son orbite en 4 h 44, pas en 11 min 31 s,
et ne va pas à la vitesse de la lumière. Les chiffres sont ceux du **photon
témoin** (exacts : 0,024 r_s/s ; 6√3 πGM/c³ = 691 s), c'est le « je » qui est
un vestige de l'ancien Lumen-photon. Remplacement :
> `Là tu es en <b>temps réel</b>. Le photon avance de deux centièmes de rayon
> par seconde. Va faire un café : il lui faut <i>11 min 31 s</i> pour un
> tour.`

(MP3 à régénérer.)

### I.10 ❌ `destination.orbite` : « 22 rayons de Schwarzschild » ne correspond pas à l'orbite simulée

Le salon orbite avec apoastre 16 r_s et k = 0,82 (`index.html` l. 1395), soit
un demi-grand axe de 12,7 r_s — c'est précisément ce qui donne le « tour
complet en 4 h 44 » que Lumen annonce (recalcul : 17 060 s = 4 h 44 ✅). Les
« 22 rayons » ne décrivent ni l'apoastre, ni le demi-grand axe (c'est
peut-être l'ancienne distance caméra, 21 r_s). Le champ n'est actuellement
affiché nulle part, mais `CHUTE.md` reprend « notre orbite de 22 r_s ».
Correction proposée : `orbite: "apoastre à 16 rayons de Schwarzschild"` — et
aligner `CHUTE.md` (son argument « moins de 3 % d'écart sur les durées
intérieures » n'en est que renforcé).

### I.11 ❌ Spectre, repère 300 μm : « Un trou noir bien nourri brillerait surtout en X »

C'est vrai pour un trou noir **stellaire** (disque à 10⁷ K), pas pour un
supermassif : un disque mince autour de 4 × 10⁶ M☉ nourri à l'Eddington
culmine dans l'**ultraviolet** (T ∝ M^(−1/4) ; c'est le « big blue bump » des
quasars). C'est exactement l'espèce d'erreur « vraie pour un autre objet ».
Remplacement :
> `Le maximum de la bosse submillimétrique : c'est là que Sgr A* rayonne le
> plus. Un trou noir bien nourri de cette masse brillerait surtout en
> ultraviolet ; celui-ci, sous-alimenté, brille dans une bande que l'œil
> ignore.`

### I.12 ⚠️ `q6-0` et méthode Découverte : « ne s'observe qu'en ondes radio »

> `q6-0` : « Le vrai Sgr A* est très pâle et ne s'observe qu'en ondes radio. »
> Méthode niv. 0 : « on ne le voit qu'avec des antennes radio »

Le module spectre du même site consacre deux boutons aux sursauts
**infrarouges** (GRAVITY) et aux rayons **X** (Chandra) : « qu'en radio »
contredit le reste du contenu. Remplacement pour `q6-0` :
> `…Le vrai Sgr A* est très pâle : à l'œil nu on ne verrait rien. On
> l'observe surtout avec des antennes radio. Ce serait l'image qu'on aurait
> avec des yeux beaucoup plus sensibles.`

et pour la méthode : `…on ne le voit bien qu'avec des antennes radio, pas
avec des yeux.`

### I.13 ⚠️ Fiche 6, Curieux : « son éclat multiplié par dix » — mauvaise grandeur

> « Le côté qui approche voit son éclat multiplié par dix et sa couleur
> décalée vers le bleu ; l'autre s'éteint et rougit. »

À β ≈ 0,4, l'éclat du côté qui approche vaut ×4,8 par rapport au repos ; le
**rapport entre les deux côtés** vaut ((1+β)/(1−β))³ ≈ 13,5. Le niveau
Découverte dit correctement « le contraste dépasse un facteur dix » (rapport
entre côtés) : le niveau Curieux doit dire la même chose. Remplacement :
> `Le côté qui approche est une dizaine de fois plus brillant que celui qui
> s'éloigne, et sa couleur se décale vers le bleu ; l'autre s'éteint et
> rougit.`

### I.14 ⚠️ Fiche 6, Astrophysicien : β ambigu, et « jet aligné » est une hypothèse

> « β ≈ 0,4 à l'ISCO de Schwarzschild. C'est sur cette asymétrie que l'EHT a
> conclu au sens horaire de rotation de M87* et à un jet aligné sur le spin. »

Deux points. (1) 0,41 est la vitesse **en coordonnées** (√(M/r)) ; celle qui
entre dans le facteur Doppler est la vitesse mesurée par l'observateur
statique local, **0,50** à l'ISCO. À ce niveau, il faut dire laquelle.
(2) EHT M87 Paper V déduit le sens de rotation **sous l'hypothèse** que jet et
spin sont alignés — l'alignement est une prémisse, pas une conclusion.
Remplacement :
> `β ≈ 0,5 à l'ISCO de Schwarzschild pour l'observateur statique local
> (0,41 en coordonnées — c'est cette dernière qu'utilise le shader). C'est
> sur cette asymétrie que l'EHT a déduit le sens horaire de rotation de M87*,
> sous l'hypothèse d'un jet aligné sur le spin.`

### I.15 ⚠️ Fiche 1, Curieux : trois retouches

> « tassées dans une bille de <i>12,7 millions de km</i> » — c'est le
> **rayon** ; la fiche 2 dit correctement « Son rayon vaut […] 12,7 millions
> de km » : lu ensemble, c'est incohérent. Remplacement : `tassées dans une
> bille de 25 millions de km de diamètre — ça tiendrait à l'intérieur de
> l'orbite de Mercure`.

> « en 16 ans à 3 % de la vitesse de la lumière » — 7 650 km/s = 2,55 %.
> Remplacement : `à 2,5 % de la vitesse de la lumière` (cohérent avec `q4-1`).

> « Ce travail a valu le <b>prix Nobel de physique 2020</b> » — le prix est
> divisé : moitié à Penrose, moitié conjointe Genzel/Ghez. Remplacement :
> `Ce travail a valu à Genzel et Ghez la moitié du prix Nobel de physique
> 2020 — l'autre moitié récompensant Penrose, pour avoir montré que
> l'effondrement en trou noir est une prédiction robuste de la relativité.`
> Même retouche dans `q4-2` (« Nobel de physique 2020, moitié Genzel-Ghez »)
> et dans le champ `sert` de `nobel2020`.

### I.16 ⚠️ Fiche 5 : « la machine la plus efficace de tout l'univers »

Niveaux Découverte et Curieux. L'annihilation matière-antimatière fait 100 %.
Remplacement (niv. 0) : `…un trou noir est la machine naturelle la plus
efficace de tout l'univers. Bien meilleure qu'une étoile.` — et niv. 1 :
`<b>Un trou noir est le mécanisme naturel le plus efficace de l'univers</b>
pour transformer de la matière en rayonnement.`

### I.17 ⚠️ Fiche 7, Curieux : « C'est là que s'arrête le disque d'accrétion »

Vrai pour un disque mince — et pour celui du rendu — faux pour le vrai
Sgr A*, dont le flux épais n'a pas de bord net (la fiche 5 niv. 2 le dit).
Remplacement : `C'est là que s'arrête un disque mince comme celui qu'on
affiche — le vrai flux de Sgr A*, épais et dilué, n'a pas de bord aussi
net.`

### I.18 ⚠️ Fiche 8, Astrophysicien : « le seul autre paramètre admis par le théorème de calvitie »

Le théorème en admet trois : masse, moment cinétique, **charge**. Remplacement :
`Métrique de Kerr (1963) : le spin est, avec la masse, le seul paramètre
astrophysiquement pertinent du théorème de calvitie — la charge, troisième
paramètre autorisé, se neutralise en pratique.`

### I.19 ⚠️ Jumeaux : « impossible de ralentir davantage »

`jumeauxDepart.pourquoi` : « c'est le <b>plancher</b> : impossible de
ralentir davantage autour d'un trou noir qui ne tourne pas ». Vrai pour les
**orbites stables** (c'est ce que le jeu propose), mais faux en général : en
orbite circulaire instable sous 3 r_s le facteur descend sous 70,7 %, et un
vaisseau suspendu à ses moteurs sous 2 r_s aussi. Remplacement : `…et c'est
le <b>plancher</b> : aucune orbite stable ne fait mieux autour d'un trou noir
qui ne tourne pas.` Même nuance dans `m-jumeaux-ok` (« au mieux ton temps
tombe à 70,7 % » → « au mieux, en orbite stable, ton temps tombe à
70,7 % »).

### I.20 ⚠️ Fiche 9, Astrophysicien : phrase cassée en tête

> « <b>Exact</b> — géodésiques nulles intégrées sous forme cartésienne
> l'intégration de $\mathbf{a} = …$ »

Syntaxe brisée (télescopage de deux formulations). Remplacement :
> `<b>Exact</b> — géodésiques nulles intégrées sous forme cartésienne,
> $\mathbf{a} = -\tfrac{3}{2}h^{2}\mathbf{r}/r^{5}$ avec
> $h = \lVert\mathbf{r}\times\dot{\mathbf{r}}\rVert$, équivalente à la Binet
> $d^{2}u/d\varphi^{2} + u = 3Mu^{2}$ : …`

---

## II. Sources : attributions fausses ou clés manquantes

Le registre ne contient **aucune référence inventée** : les 31 entrées avaient
été vérifiées via Crossref (`SOURCES.md` §1), et j'ai revérifié en ligne les
moins standard (Bussard 1960, Astronautica Acta 6, 179-194 ✅ ; Andrews &
Zubrin, JBIS 43, 265-272, 1990 ✅ ; Lewis & Kwan, PASA 24, 46-52, 2007, DOI
10.1071/AS07012 ✅). Les problèmes sont des **attributions**, pas des
fabrications :

1. **`dyson1920`, champ `sert`** : « Mesure de la déflexion de 1,75″ » — la
   fiche 3 a été corrigée (1,75″ = prédiction ; mesures 1,98″ ± 0,12 et
   1,61″ ± 0,30) mais le registre dit encore l'inverse. Remplacement du
   `sert` : `Prédiction relativiste de 1,75″ au limbe (double de la valeur
   newtonienne) ; mesures 1919 : 1,98″ ± 0,12 (Sobral), 1,61″ ± 0,30
   (Príncipe)`.
2. **`misner1973`, champ `sert`** : « temps propre maximal πGM/c³ » — la
   localisation dans MTW est douteuse (`SOURCES.md` §1, `CHUTE.md` §8) ; la
   référence vérifiée est **Lewis & Kwan 2007**, prête dans `CHUTE.md` §8, à
   ajouter au registre et à citer dans `q2-2`.
3. **`gralla2019`** : sert encore de caution au facteur e^(−π) (fiche 4
   niv. 2, `q3-2`), que ce papier ne démontre pas — ajouter
   **Johnson et al. 2020**, Science Advances 6, eaaz1310
   (doi 10.1126/sciadv.aaz1310), et garder `gralla2019` pour la seule
   taxinomie n = 0/1/≥2. Déjà recommandé par `SOURCES.md` §4.6, pas fait.
4. **Spectre, repère 2,2 μm** : « c'est ainsi qu'on a vu de la matière
   tourner à quelques rayons de l'horizon », sourcé `gravity2018` — ce papier
   est la détection du **redshift de S2**. Les mouvements orbitaux des
   sursauts sont GRAVITY Collaboration, « Detection of orbital motions near
   the last stable circular orbit of the massive black hole SgrA* », A&A 618,
   L10 (2018), doi 10.1051/0004-6361/201834294. Ajouter une clé
   `gravity2018b`.
5. **`inactif-7`, pourquoi** : la limite d'atteignabilité (~16 milliards
   d'al comobiles, 4,5 % du volume observable) est sourcée `misner1973`, qui
   n'en parle pas. Référence adaptée : T. M. Davis & C. H. Lineweaver,
   « Expanding Confusion », PASA 21, 97 (2004), doi 10.1071/AS03040.
   Plus largement, `misner1973` sert de fourre-tout aux répliques de fusée
   relativiste (`inactif-6/7/8`) : l'équation est de la relativité restreinte
   standard, mais MTW n'est pas un traité de propulsion — une clé dédiée
   serait plus honnête.
6. **Fiche 3, niv. 2** : les contraintes γ (VLBI 1,2 × 10⁻⁴ ; Cassini
   2 × 10⁻⁵) sont exactes mais toujours sans clé — Lambert & Le
   Poncin-Lafitte, A&A 529, A70 (2011) et Bertotti, Iess & Tortora, Nature
   425, 374 (2003), listées par `SOURCES.md` §5.3, jamais ajoutées.
7. **Fiche 4, niv. 2, BHEX** : mission **proposée** (lancement visé 2031),
   aucune clé — arXiv:2406.12917. Préciser « projet » dans le texte :
   `C'est la cible du projet d'EHT spatial (BHEX)…`
8. **Fiche 5, niv. 2** : « les GRMHD butent encore sur la variabilité » —
   c'est EHT Sgr A* Paper V, ApJL 964, L25 (2024), absent du registre.
9. **Fiche 7, niv. 2** : méthode du continuum et raie Kα — aucune référence
   de mesure de spin au registre (Reynolds, ARA&A 59, 117, 2021 couvrirait
   les deux méthodes).
10. **`inactif-1`** : la masse et la densité de M87* sont sourcées
    `eht2019` (Paper V, l'anneau asymétrique) ; la masse 6,5 × 10⁹ M☉ vient
    des Papers I/VI de la même série. Mineur, mais la clé ne soutient pas le
    chiffre.
11. **Spectre, repère 2,2 μm** : « jusqu'à cent fois plus brillants » — le
    sursaut ×100 est Do et al., ApJL 882, L27 (2019), pas `genzel2010`
    (qui documente des facteurs ~10). Ajouter la clé ou écrire « dix à cent
    fois ».
12. **Outillage** : l'en-tête de `contenu.js` annonce `outils/sources.py`,
    le script réel est `outils/sources.mjs`. Et **`REFERENCES.md` est
    périmé** : il cite des répliques disparues (« Salut, Lumen, photon en
    orbite », « Ça, je ne le simule pas ») — à régénérer, sinon l'index
    contredit le contenu qu'il indexe.

### Repère 1 keV : « un million de fois trop pâle pour sa masse »

Ambigu au point d'être faux selon la lecture : rapporté à l'Eddington de sa
masse, Sgr A* est ~10⁹ fois sous-lumineux (bolométrique), ~10¹¹ en X. Le
« million » correct est la comparaison au gaz capturé (luminosité de Bondi
attendue ~10³⁹ erg/s contre ~2 × 10³³ observés). Remplacement :
> `Sgr A* rayonne ici un million de fois moins que ce que le gaz qu'il
> capture devrait fournir.`

---

## III. Invérifiable — déclaré plutôt que validé

- **Fiche 8, niv. 2 : « l'ombre asymétrique, mesurée à 2,30 contre 2,40 en
  théorie à a* = 0,9 »**. La mesure est interne au banc ; je n'ai pas
  recalculé la valeur théorique de ce rayon moyen d'ombre de Kerr (elle
  dépend de l'inclinaison et de la métrique de mesure choisie). L'ordre est
  plausible (l'ombre de Kerr rétrécit et se décentre), mais je ne peux ni
  confirmer 2,40 ni la façon dont 2,30 est mesuré.
- **Méthode, niv. 2 : « le second anneau du disque est visible à l'œil, et un
  troisième existe sous le seuil de résolution »**. Avec 240 pas au shader,
  `SOURCES.md` §8.5 doutait déjà que n = 2 soit atteint ; toujours pas
  mesuré. À vérifier au banc ou à mettre au conditionnel.
- **« Une demi-heure d'écart » (`m-jumeaux-ok`)** : dépend de la trajectoire
  effective du joueur ; non vérifié.
- **La SED du module spectre** : les treize points sont annoncés comme ordres
  de grandeur d'après Yuan+2003 / Genzel+2010 — cohérents avec L_bol ~ 10³⁶
  erg/s et le pic submillimétrique, mais je ne les ai pas confrontés point par
  point aux figures des papiers.
- **Ouvrages papier** : MTW §25/§31, Birkhoff p. 253, chapitre 3 de
  Chandrasekhar — non consultables en ligne, inchangé depuis `SOURCES.md`.
- **Spin de Sgr A*** : « mal contraint » reste l'état de l'art à ce jour
  (les analyses EHT et la littérature 2024-2026 donnent des intervalles
  larges et dépendants du modèle) — la formulation du site est donc toujours
  la bonne, mais c'est un point à re-surveiller à chaque publication EHT.

---

## IV. Calibrage des niveaux

### Découverte : le contrat « zéro acquis » est presque tenu

Vérifié terme à terme sur les 9 fiches et les questions. Tout ce qui est
technique est glosé au moment où il apparaît : « horizon » (fiche 2, défini
avant d'être nommé), « ombre » (fiche 4), « lentille » (réservée au niveau
Curieux), « aberration » (`embarque` : « le tasse vers l'avant »), « orbite
excentrique » (`salon` : « s'approche, s'éloigne »), « seconde d'arc »
(`inactif-2`, ancrée par l'orange sur la Lune), « photon » (mission « Lance
un rayon de lumière »). Ni référentiel, ni géodésique, ni redshift, ni
singularité n'apparaissent au niveau 0. Les restes :

- **`q5-0`** : « celui-ci est à 27 000 années-lumière » — seule occurrence
  de niveau 0 où « année-lumière » n'est pas déplié. Remplacement : `Et
  celui-ci est si loin que sa lumière met 27 000 ans à nous parvenir.`
- **Fiche 8, niv. 0** : la plus longue du niveau (4 paragraphes) et la
  phrase « Il existe autour d'un trou noir en rotation une zone où l'espace
  file si vite que plus rien ne peut rester immobile — aucun moteur, aussi
  puissant soit-il, ne permet de tenir en place. » est à la limite haute.
  Coupe possible : `…une zone où l'espace file si vite que rien ne peut
  rester immobile. Aucun moteur n'y suffit : tu es forcé de tourner avec
  lui.`
- **Fiche 6, niv. 0, l'ambulance** : l'analogie porte sur la hauteur du son
  (fréquence) pour expliquer une différence de **brillance** — elle est
  signalée comme approximative (« un peu comme ») et le décalage de couleur
  existe bien, je la laisse, mais une demi-phrase la rendrait exacte :
  `…plus aiguë quand elle approche — et plus forte, aussi.`
- **Structurel** : les missions et la plupart des réactions de Lumen ne sont
  **pas déclinées par niveau** : `m-jumeaux-ok` (« Les 61 000 ans par heure
  d'Interstellar exigent un trou noir en rotation, qui entraîne l'espace… »)
  est servi tel quel à quelqu'un qui a répondu « je suis vraiment nul ».
  C'est un choix de framework, pas une faute d'écriture — mais c'est la plus
  grosse brèche du contrat découverte. À trancher : soit décliner les
  `reussi` des missions clés, soit assumer que les missions parlent au
  niveau curieux.

### Curieux : bien calibré

Rien à signaler au-delà des erreurs de la section I. Le niveau fait ce qu'il
promet : vocabulaire courant, notions structurantes réexpliquées (ISCO,
beaming, lentille).

### Astrophysicien : réellement technique, fiche par fiche

- **Fiche 1** ✅ (masse/distance avec erreurs — à corriger, cf. I.7 — précession, EHT, RIAF).
- **Fiche 2** ✅ Kretschmann exact (48 G²M²/c⁴r⁶ ✅ recalculé), artefact de
  coordonnées, firewalls, courbes de Page : rien de tout ça n'est dans une
  page de vulgarisation.
- **Fiche 3** ✅ Binet nulle exacte, les vraies valeurs de 1919 avec la
  nuance Sobral/Príncipe, γ moderne. Exemplaire.
- **Fiche 4** ✅ b_c, e^(−π) (0,043 ✅), BHEX.
- **Fiche 5** ✅ α-disque, MRI, 5,7/42 % (recalculés : 1−√(8/9) = 5,72 %,
  1−1/√3 = 42,3 % ✅), Ṁ, codes GRMHD nommés.
- **Fiche 6** ✅ D³/D⁴ correct (I_ν/ν³ invariant), redshift ⊥ Doppler.
- **Fiche 7** ✅ potentiel effectif exact, lien rendement-spin, continuum et
  Kα.
- **Fiche 8** ✅ la plus riche : ω, ergosphère, ISCO(a), 1−√(8/9) et
  1−1/√3 explicites, Penrose 29 % (= 1−1/√2 ✅), Blandford-Znajek, et un
  paragraphe « ce que cette page simule / ne simule pas » qui est exactement
  le standard à généraliser.
- **Fiche 9** ✅ une fois la phrase d'ouverture réparée.

Aucune fiche n'appelle d'enrichissement de fond ; les seules « couches »
manquantes sont celles déjà listées en II (références) et I.1 (décrire le
schéma de Kerr dans la méthode).

---

## V. Confort de lecture

- Fiche 3, niv. 2 : « 1,61″ ± 0,30 à Príncipe — là où se trouvait Eddington,
  et c'est le résultat le moins précis des deux. » Deux incises enchâssées ;
  proposer : `…1,61″ ± 0,30 à Príncipe, où se trouvait Eddington — le moins
  précis des deux résultats.`
- Fiche 8, niv. 1 : cinq paragraphes dont trois commencent par un connecteur
  (« D'où », « C'est ce qui ») — l'enchaînement ISCO → rendement → quasars
  est bon, mais le paragraphe rendement corrigé (I.6) gagnerait à rester en
  une phrase par idée.
- `inactif-10` (gravité magique) et méthode niv. 0 : excellents, ne pas
  toucher.
- Le `dire` de `q3-2` épèle « deux virgule cinq cent quatre-vingt-dix-huit » :
  à l'oreille c'est lourd ; « environ deux virgule six » suffirait à l'oral,
  l'écrit gardant la précision.

---

## Ce qui est bien — à ne pas casser

- **Le registre est sain.** 31 références, toutes réelles, DOI résolvant,
  aucune fabrication. C'est le pire défaut possible et le site ne l'a pas.
- **Les corrections de l'audit précédent ont été faites presque partout** :
  densité (« mille fois l'eau », recalcul exact, seuil à 1,4 × 10⁸ M☉ ✅),
  marées (10⁻⁴ g, la comparaison lunaire fausse a disparu), 27 000 al,
  11 min 31 s, « quatre heures » du bord externe (recalculé : 3 h 49 ✅),
  Verlet-vitesse, non-renormalisation, bord interne du disque asservi à
  l'ISCO. Le circuit trouve-corrige fonctionne.
- **Les trois niveaux disent la même chose à des profondeurs différentes**
  dans 8 fiches sur 9 — le seul vrai accroc de cohérence est le spin (I.1).
- **La fiche 9 et le dossier méthode** assument les approximations restantes
  (Doppler sans γ, redshift en g¹ avec plancher, calque non lensé, temps
  coordonnée) : l'honnêteté déclarative demandée par `IDEES.md` est réelle.
- **Le niveau Découverte a un ton** : « une chute qui rate sa cible pour
  toujours », « un trou dans le ciel », la gravité magique du salon. C'est
  précis sans être condescendant.
- **Les recalculs indépendants tombent juste** : 19,8 ans à bord, γ = 13 768
  (pour la distance utilisée), e^(20,45) = 7,6 × 10⁸, 88 % de gravité à
  l'ISS, orange sur la Lune, 4 h 44 du salon, 70,7 % à l'ISCO. Les chiffres
  de ce site sont massivement bons ; les erreurs de la section I sont
  l'exception, pas la règle.

---

## Ce que je n'ai pas pu vérifier

Voir section III pour le détail. En résumé : la mesure interne 2,30/2,40 de
l'ombre de Kerr, la visibilité réelle des anneaux n ≥ 2 avec 240 pas, la
demi-heure des jumeaux, les points de la SED un à un, les ouvrages papier
(MTW, Birkhoff, Chandrasekhar), et l'exhaustivité de la littérature 2026 sur
le spin de Sgr A* (l'état « mal contraint » est confirmé par ce que j'ai pu
consulter, sans garantie qu'un résultat très récent ne m'ait échappé).
Je n'ai pas non plus rejoué le shader : les affirmations « mesuré à 0,07 % »
du banc d'essai sont prises sur parole de `IDEES.md`.

---

## Remarques sur la commande elle-même

Deux exigences se heurtent à la structure actuelle, autant le dire que le
contourner :

1. **« Chaque affirmation porte une clé »** : les fiches portent leurs clés
   **par niveau**, pas par affirmation. C'est suffisant pour l'audit tant que
   les niveaux restent courts, mais une fiche comme la 8 (niv. 2, cinq
   paragraphes, cinq clés) ne permet plus de savoir quelle clé couvre quelle
   phrase. Je n'ai pas traité ça comme une violation ; c'est une limite de
   granularité à connaître.
2. **« Le niveau découverte ne suppose rien »** ne peut pas être tenu par les
   seules fiches tant que les missions et réactions ne sont pas déclinées par
   niveau (cf. IV) — la règle est bien posée, mais elle porte sur un contenu
   qui n'a pas aujourd'hui le mécanisme pour la respecter.
