# Les constantes de `ncorps.js`, et d'où elles viennent

Relevé le 5 août 2026, directement aux sources.

Ces valeurs servent de **repères de contrôle** à `outil-verif-ncorps.js` : c'est
contre elles qu'on juge si l'intégrateur dit vrai. Une valeur de contrôle
recopiée de mémoire ne contrôle rien — elle transforme une vérification en
opinion. Elles étaient justes ; elles ne l'étaient pas *démontrablement*.

---

## Ce que le relevé a appris

**Les rapports de masse écrits de mémoire étaient justes à 10⁻⁶**, et non à 10⁻³
comme le disait prudemment la note. Mais ils ne sont plus recopiés du tout :
**ils se calculent** à partir des GM de DE440, à l'exécution. Une valeur dérivée
d'une constante sourcée ne peut plus dériver toute seule.

| | de mémoire | dérivé de DE440 | écart |
|---|---|---|---|
| Soleil / Jupiter | 1047,348644 | 1047,348631 | 1,2 × 10⁻⁸ |
| Soleil / Saturne | 3497,9018 | 3497,901801 | 2,3 × 10⁻¹⁰ |
| Soleil / Uranus | 22902,98 | 22902,950783 | 1,3 × 10⁻⁶ |
| Soleil / Neptune | 19412,24 | 19412,259776 | 1,0 × 10⁻⁶ |

**Les éléments orbitaux étaient exacts, chiffre pour chiffre** — les vingt-quatre
nombres de la table de Standish, relus un par un.

**Deux valeurs d'anneaux étaient fausses au quatrième chiffre.** Le bord externe
de l'anneau A et le rayon de l'anneau F. Sans conséquence sur les conclusions —
la limite de Roche calculée tombe à 3 % du bord de l'anneau A, et 5 km n'y
changent rien — mais elles sont corrigées.

---

## Gravitation

| grandeur | valeur | source |
|---|---|---|
| GM☉ | 1,327 124 400 412 794 19 × 10²⁰ m³·s⁻² | [JPL SSD, Astrodynamic Parameters](https://ssd.jpl.nasa.gov/astro_par.html) — DE440, Park et al. 2021 |
| GM Jupiter (système) | 126 712 764,100 000 km³·s⁻² | idem |
| GM Saturne (système) | 37 940 584,841 800 km³·s⁻² | idem |
| GM Uranus (système) | 5 794 556,400 000 km³·s⁻² | idem |
| GM Neptune (système) | 6 836 527,100 580 km³·s⁻² | idem |
| G | 6,674 30 × 10⁻¹¹ m³·kg⁻¹·s⁻² | CODATA 2018 |
| M☉ | 1,988 47 × 10³⁰ kg | IAU 2015 B3, avec G ci-dessus |
| k de Gauss | 0,017 202 098 95 | IAU 1976 |

**Ce sont des GM de SYSTÈME**, planète et satellites confondus, et c'est
précisément ce qu'il faut ici : sur cinq mille ans, les lunes accompagnent leur
planète, et c'est la masse totale qui gouverne l'orbite héliocentrique.

M☉ n'est connue qu'à cinq chiffres parce que G l'est ; GM☉ en a dix-huit. C'est
pourquoi le module travaille en GM et ne dérive M☉ que pour l'affichage.

---

## Éléments orbitaux — les quatre géantes

Table [« Keplerian Elements for Approximate Positions of the Major
Planets »](https://ssd.jpl.nasa.gov/planets/approx_pos.html), E. M. Standish,
JPL Solar System Dynamics. Éléments **moyens** à J2000, **valables 1800–2050**.

| | a (ua) | e | I (°) | L (°) | ϖ (°) | Ω (°) |
|---|---|---|---|---|---|---|
| Jupiter | 5,202 887 00 | 0,048 386 24 | 1,304 396 95 | 34,396 440 51 | 14,728 479 83 | 100,473 909 09 |
| Saturne | 9,536 675 94 | 0,053 861 79 | 2,485 991 87 | 49,954 244 23 | 92,598 878 31 | 113,662 424 48 |
| Uranus | 19,189 164 64 | 0,047 257 44 | 0,772 637 83 | 313,238 104 51 | 170,954 276 30 | 74,016 925 03 |
| Neptune | 30,069 922 76 | 0,008 590 48 | 1,770 043 47 | −55,120 029 69 | 44,964 762 27 | 131,784 225 74 |

**Limite déclarée, et elle compte** : ce sont des éléments MOYENS, pas
osculateurs. Les prendre pour état initial introduit un écart de l'ordre des
variations à courte période — quelques 10⁻³ en excentricité. Sans conséquence
pour ce que le contrôle mesure (la stabilité des demi-grands axes), mais cela
interdit de comparer les positions à une éphéméride.

C'est la même limite qui empêche de mesurer proprement l'amplitude de libration
de Pluton.

---

## Saturne et ses anneaux

| grandeur | valeur | source |
|---|---|---|
| rayon équatorial | 60 268 ± 4 km | [JPL SSD, Planetary Physical Parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html) (2019-12-12) |
| densité moyenne | 0,687 1 ± 0,000 2 g·cm⁻³ | idem, avec G CODATA 2018 |
| masse | 568,317 ± 0,026 × 10²⁴ kg | idem |
| bord externe de l'anneau A | 136 770 km | [USGS Gazetteer of Planetary Nomenclature, Rings](https://planetarynames.wr.usgs.gov/Page/Rings) |
| anneau F | 140 224 km | idem |
| bord interne de l'anneau D | 67 000 km | idem |
| anneau E | 180 000 – 480 000 km | idem |

Distances mesurées **depuis le centre de Saturne**, pas depuis son sommet de
nuages — la confusion vaut un facteur 60 268 km et ferait tomber la limite de
Roche au mauvais endroit.

| grandeur | valeur | source |
|---|---|---|
| Mimas, rayon moyen | 198,20 ± 0,40 km | [JPL SSD, Planetary Satellite Physical Parameters](https://ssd.jpl.nasa.gov/sats/phys_par/) |
| Mimas, densité | 1,150 1 ± 0,007 0 g·cm⁻³ | idem |
| Mimas, GM | 2,503 49 ± 0,000 14 km³·s⁻² | idem |
| Mimas, demi-grand axe | 185 539 km | idem, éléments moyens |
| glace d'eau | 0,93 g·cm⁻³ | densité de la glace I à 0 °C — valeur de manuel, pas une mesure planétaire |

---

## Limite de Roche

| grandeur | valeur | source |
|---|---|---|
| coefficient rigide, rotation synchrone | 3^(1/3) ≈ 1,442 25 | forme fermée |
| coefficient fluide | 2,455 | Chandrasekhar, *Ellipsoidal Figures of Equilibrium*, 1969 |

L'arrondi **2,44** qui circule partout vient d'une table ancienne. Et le **1,26**
qu'on lit souvent est 2^(1/3), qui suppose un satellite **non synchrone** — ce
n'est pas le même problème.

**Ce que le contrôle ne prouve pas, et le dit** : le coefficient fluide 2,455
n'est pas reproduit numériquement, et ne peut pas l'être avec des masses
ponctuelles. Il suppose un fluide incompressible qui se déforme en ellipsoïde
d'équilibre ; un tas de points sans cohésion ne fait pas cela — il s'effondre
d'abord sur lui-même. Ce qui est vérifié, c'est la forme fermée contre les
anneaux de Saturne ; ce qui est mesuré, c'est le seuil du cas rigide synchrone.

---

## Stabilité

| critère | valeur | source |
|---|---|---|
| séparation critique, trois planètes de masses égales | Δ ≈ 2√3 ≈ 3,46 rayons de Hill mutuels | Gladman 1993, *Icarus* **106**, 247 ; Chambers, Wetherill & Boss 1996, *Icarus* **119**, 261 |

Ce seuil sert de **juge extérieur** au détecteur de déstabilisation : on monte
trois systèmes de part et d'autre, et l'on demande au veilleur de les trier. Un
détecteur qui n'aboie jamais et un détecteur qui aboie toujours sont également
inutiles ; il faut les deux côtés, et une frontière qui vienne d'ailleurs que
de nous.

---

## Périodes sidérales de référence

| planète | années juliennes | source |
|---|---|---|
| Jupiter | 11,862 | [NASA Planetary Fact Sheets](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) |
| Saturne | 29,457 | idem |
| Uranus | 84,011 | idem |
| Neptune | 164,79 | idem |
