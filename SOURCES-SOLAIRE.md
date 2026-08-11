# Le système solaire — le relevé

**Relevé le 10 août 2026**, chaque page ouverte, chaque chiffre lu à sa source.
La session du 10 août n'avait joint ni `ssd.jpl.nasa.gov`, ni `arxiv.org`, ni
`adsabs.harvard.edu`, ni `aanda.org` : elle a eu raison de ne rien écrire plutôt
que d'écrire de mémoire. Ce fichier est ce qu'elle attendait.

Ce n'est pas un doublon de `contenu.js`. `contenu.js` porte l'affirmation et la
clé ; ce fichier porte **l'adresse exacte, la table, la ligne** — de quoi
recommencer le relevé sans refaire la recherche.

---

## 1. Les demi-grands axes, de Mercure à Neptune

**Adresse relevée :** <https://ssd.jpl.nasa.gov/planets/approx_pos.html>
— NASA/JPL Solar System Dynamics, *Approximate Positions of the Planets*,
**table 1**, colonne `a` (ua), valide **1800–2050**. La page déclare sa
provenance : « This content is from an article written by E. M. Standish and
J. G. Williams in 1992 » — le chapitre des éphémérides de l'*Explanatory
Supplement to the Astronomical Almanac*.

| corps | a (ua) | Ldot (deg/siècle julien) |
|---|---|---|
| Mercure | 0.38709927 | 149472.67411175 |
| Vénus | 0.72333566 | 58517.81538729 |
| **EM Bary** | 1.00000261 | 35999.37244981 |
| Mars | 1.52371034 | 19140.30268499 |
| Jupiter | 5.20288700 | 3034.74612775 |
| Saturne | 9.53667594 | 1222.49362201 |
| Uranus | 19.18916464 | 428.48202785 |
| Neptune | 30.06992276 | 218.45945325 |

**Deux réserves que la page écrit elle-même, et qu'il ne faut pas taire :**

> « Such elements are not intended to represent any sort of mean; they are
> simply the result of being adjusted for a best fit. As such, it must be noted
> that the elements are not valid outside the given time-interval over which
> they were fit. »

Et la ligne de la Terre n'est **pas** la Terre : c'est `EM Bary`, le barycentre
Terre–Lune. La page le note en pied de table.

La table 2a donne un second jeu, ajusté sur 3000 av. J.-C. – 3000 apr. J.-C.
Les deux jeux diffèrent au sixième chiffre. On prend le premier, celui de notre
époque, et on le dit.

---

## 2. L'unité astronomique

**Adresse relevée (primaire) :** le document de résolutions de la XXVIIIᵉ
Assemblée générale de l'UAI (Pékin, 2012), page 3, *Resolution B2 on the
re-definition of the astronomical unit of length*, clause `recommends` 1 :

> « that the astronomical unit be re-defined to be a conventional unit of length
> equal to **149 597 870 700 m exactly**, in agreement with the value adopted in
> IAU 2009 Resolution B2 »

et clause 5 : « that the unique symbol "au" be used for the astronomical unit ».

Ce document n'a **pas d'adresse stable** : l'UAI a démonté ses anciennes URL
(`iau.org/static/resolutions/IAU2012_English.pdf` rend 404) et sert désormais
ses résolutions depuis Google Drive, ce qui n'est pas une référence qu'on met
dans un site.

**Adresse citée dans `contenu.js` :** le BIPM, *Le Système international
d'unités*, 9ᵉ édition (2019),
<https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-EN.pdf> — tableau
des unités hors SI admises, p. 145 du PDF : `astronomical unit (j) au — 1 au =
149 597 870 700 m`, avec la note (j) : « Defined by Resolution B2 of the XXVIII
General Assembly of the International Astronomical Union in 2012. »

C'est-à-dire : la valeur ET son origine, dans un document permanent.

> **Erreur relevée au passage.** La page JPL *Astrodynamic Parameters*
> (<https://ssd.jpl.nasa.gov/astro_par.html>) attribue l'unité astronomique à
> « IAU 2012 Resolution B1 ». C'est B2 — B1 de 2012 porte sur les bandes
> passantes photométriques. Le document primaire et la brochure du BIPM
> s'accordent contre le JPL sur ce point.

---

## 3. La luminosité du Soleil et le point zéro des magnitudes bolométriques

**Adresse relevée :** A. Prša et al., « Nominal Values for Selected Solar and
Planetary Quantities: IAU 2015 Resolution B3 », *The Astronomical Journal* 152,
41 (2016), DOI [10.3847/0004-6256/152/2/41](https://doi.org/10.3847/0004-6256/152/2/41),
manuscrit d'auteur lu à <https://arxiv.org/abs/1605.09788> (source LaTeX
`units.tex`, table `tab:nompars` et remarques techniques 2 et 3).

Constantes de conversion **nominales — exactes par définition, et ce ne sont
pas des mesures**, l'article y insiste :

| grandeur | valeur nominale |
|---|---|
| rayon solaire | 6,957 × 10⁸ m |
| irradiance solaire totale | 1 361 W m⁻² |
| **luminosité solaire** | **3,828 × 10²⁶ W** |
| température effective | 5 772 K |
| (𝒢M)☉ | 1,327 124 4 × 10²⁰ m³ s⁻² |
| rayon terrestre équatorial | 6,3781 × 10⁶ m |
| rayon terrestre polaire | 6,3568 × 10⁶ m |
| rayon jovien équatorial | 7,1492 × 10⁷ m |
| rayon jovien polaire | 6,6854 × 10⁷ m |
| (𝒢M)⊕ | 3,986 004 × 10¹⁴ m³ s⁻² |
| (𝒢M)♃ | 1,266 865 3 × 10¹⁷ m³ s⁻² |

Remarque technique 3 du même article, qui porte la **résolution B2 de 2015** :

> « A radiation source with absolute bolometric magnitude M_Bol = 0 mag is
> assumed to have a radiative power of exactly **L₀ = 3,0128 × 10²⁸ W** […]
> M_Bol = −2,5 log L + 71,197425… The nominal solar luminosity is 3,828 × 10²⁶ W,
> which, given the adopted IAU bolometric magnitude zero point, corresponds
> approximately to **M_Bol☉ = 4,74 mag**. »

Remarque technique 2 du même article : « Resolution B2 of the 2012 IAU General
Assembly adopted an exact value for the astronomical unit […] the notes to
Resolution B2 of the 2015 IAU General Assembly define the parsec to also be an
exact value, 1 pc = 648000 π⁻¹ au. » — c'est exactement la définition dont
`outil-verif-constantes.js` dérive le parsec, et elle a maintenant une adresse.

**Le point zéro apparent**, non repris dans Prša et al., est relevé au texte de
la résolution elle-même : E. E. Mamajek et al., « IAU 2015 Resolution B2 on
Recommended Zero Points for the Absolute and Apparent Bolometric Magnitude
Scales », <https://arxiv.org/abs/1510.06262> :

> f₀ = 2,518 021 002… × 10⁻⁸ W m⁻²   et   m_Bol = −2,5 log f − 18,997351…

**Recoupements faits ici**, et ils tombent juste :

- −2,5 log(3,828 × 10²⁶ / 3,0128 × 10²⁸) = **4,7400** — le 4,74 de l'article ;
- 2,5 log(3,0128 × 10²⁸) = **71,197426** — le 71,197425… de l'article ;
- −2,5 log(2,518021002 × 10⁻⁸) = **18,997352** — le 18,997351… de la résolution ;
- L☉ᴺ / (4π ua²) = **1 361,17 W m⁻²** — l'irradiance nominale 1 361 de la même
  table, dérivée depuis la luminosité et l'unité astronomique. Trois sources
  indépendantes se referment sur elles-mêmes.

---

## 4. Le nuage de Oort

**Adresse relevée :** L. Dones, P. R. Weissman, H. F. Levison, M. J. Duncan,
« Oort Cloud Formation and Dynamics », *ASP Conference Series* 323, 371–383
(2004), texte intégral libre : <https://www.aspbooks.org/publications/323/371.pdf>

C'est la version en actes du chapitre de *Comets II* que le dépôt cherchait. Le
chapitre de *Comets II* lui-même (Univ. Arizona Press, p. 153) n'est pas
accessible : le site du LPI est derrière Cloudflare, et la revue *Space Science
Reviews* qui porte la revue plus récente des mêmes auteurs (Dones, Brasser, Kaib
& Rickman 2015, DOI 10.1007/s11214-015-0223-2) ne sert que le résumé.

Ce que la version relevée dit, mot pour mot :

- **la taille du nuage**, p. 372 : « This condition yields a cloud of comets with
  semi-major axes of order **10 000 to 100 000 AU** » ;
- **les deux nuages**, p. 376 : le nuage externe classique est
  **20 000 ua ≤ a < 200 000 ua**, le nuage interne **2 000 ua ≤ a < 20 000 ua** ;
- **on ne l'a jamais vu**, p. 371, première page : « since typical cometary
  nuclei have sizes of a few km, but orbit at distances of 10¹²–10¹³ km, **we
  still have little direct knowledge of the cloud** » ;
- **et pourquoi**, p. 377 : « The sample of new comets that reach the region of
  the terrestrial planets is biased to objects with a ≳ 10 000 AU because of the
  "Jupiter barrier". Thus the population of the inner Oort cloud, at distances of
  thousands of AU, **remains uncertain**. » Les bornes internes sont donc un
  **résultat de modèle**, pas une observation, et l'article le dit.

Le même fait, dit autrement par une seconde revue lue en entier — A. Morbidelli,
« Origin and Dynamical Evolution of Comets and their Reservoirs »,
<https://arxiv.org/abs/astro-ph/0512256>, §3 : « our information on the inner
Oort cloud does not come from the observations of comets, but solely from models
of Oort cloud formation ».

---

## 5. Les masses des systèmes planétaires

**Adresse relevée :** <https://ssd.jpl.nasa.gov/astro_par.html>, section
*Planetary Masses*, données de l'éphéméride **DE440** (R. S. Park, W. M. Folkner,
J. G. Williams, D. H. Boggs, « The JPL Planetary and Lunar Ephemerides DE440 and
DE441 », *The Astronomical Journal* 161, 105 (2021), DOI
[10.3847/1538-3881/abd414](https://doi.org/10.3847/1538-3881/abd414), vérifié
chez Crossref).

GM en km³ s⁻² : Mercure 22 031,868551 · Vénus 324 858,592 · Terre 398 600,435507 ·
Lune 4 902,800118 · Mars 42 828,375816 · Jupiter 126 712 764,1 ·
Saturne 37 940 584,8418 · Uranus 5 794 556,4 · Neptune 6 836 527,100 58.
La même page donne GM☉ = 1,327 124 400 412 794 19 × 10²⁰ m³ s⁻².

**Dérivé ici :** la somme des huit systèmes vaut **1/745** du Soleil, et Jupiter
en fait à lui seul 71 %.

---

## 6. Ce qui restait dans `lune.js` — **monté le 11 août 2026**

Cette section disait, le 10 août : « elles monteront avec la fiche qui les
emploiera — `lune.js` branché, ou la fiche des tailles apparentes ». C'est fait.
`lune.js` est entré dans la page, l'arrivée du voyage montre la Terre et la Lune,
et la fiche **« La Terre et la Lune, de loin »** les cite toutes les quatre.

**Les trois pages du JPL ont été rouvertes ce jour-là** et les valeurs relues à
leur ligne, plutôt que recopiées du module — la règle 7 vaut aussi pour un
chiffre déjà écrit dans le dépôt :

| clé | ce qui a été relu, et où |
|---|---|
| `jplPlanetes` | rayon moyen de la Terre **6 371,0084 km**, masse **5,972 17 × 10²⁴ kg** — `ssd.jpl.nasa.gov/planets/phys_par.html` |
| `jplSatellites` | rayon moyen de la Lune **1 737,4 km**, GM **4 902,800 km³/s²** — `ssd.jpl.nasa.gov/sats/phys_par/` |
| `jplElements` | demi-grand axe lunaire **384 400 km**, et sur la même ligne l'excentricité **0,0554**, l'éphéméride **DE405/LE405**, plan écliptique, époque 2000-01-01,5 — `ssd.jpl.nasa.gov/sats/elem/` |
| `codata2018` | G = **6,674 30 × 10⁻¹¹** — `ssd.jpl.nasa.gov/astro_par.html` |

**Trois réserves relevées au passage**, et la fiche les porte plutôt que de les
taire : 384 400 km est un demi-grand axe et non une distance du jour (± 5,5 % au
fil du mois) ; les deux nombres de la Lune ne viennent pas de la même éphéméride
(GM de DE440, éléments moyens de DE405/LE405) ; et c'est GM qui est mesuré, pas
la masse — repasser à une masse coûte les six chiffres de G, d'où un rapport
Terre/Lune de 81,30 à cinq chiffres et non onze.

`birkhoff1923` et `schwarzschild1916` restent dans le registre de `lune.js` sans
monter : la fiche de l'arrivée ne parle pas de l'anticlimax du trou noir de masse
lunaire, et le contrat refuse toujours, à raison, une source que personne ne cite.

Les deux registres portent donc encore des entrées communes — `iau2015b3`,
`jplPlanetes`, `jplSatellites`, `jplElements`, `codata2018`. C'est une copie, et
elle est assumée pour la même raison que les neuf déclarations de l'unité
astronomique : le remède est de les GARDER, pas de les fondre dans un module que
`lune.html`, page autonome, devrait charger. Elle disparaîtra quand `lune.js`
lira le contrat.
