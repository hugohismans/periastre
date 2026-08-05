# Vérification numérique des orbites d'étoiles S

Constat produit par `outil-verif-etoiles.js` (`node outil-verif-etoiles.js`), qui
charge `etoiles.js` tel quel en lui passant un faux `window`. **`etoiles.js` n'a
pas été modifié** — ce fichier est un diagnostic, la correction reste à appliquer.

Le point à trancher était celui signalé en commentaire lignes 56-58 : dans
Gillessen et al. 2017, Ω désignerait le nœud où l'astre **s'approche**, l'inverse
de l'usage en binaires visuelles. Une erreur de signe retourne l'orbite dans la
profondeur.

---

## 1. La réponse : la convention est RETOURNÉE

`position()` implémente exactement la convention Thiele-Innes classique des
binaires visuelles. Sa troisième composante vaut

```
zi = yw · sin i = r · sin(ω + ν) · sin i
```

c'est-à-dire le `Z = C·x + H·y` du formalisme standard, où **Z est compté
positif en s'éloignant** de l'observateur et où Ω est le nœud **ascendant, celui
où l'astre s'éloigne**. C'est précisément la convention dont le commentaire dit
qu'elle est l'inverse de celle de l'article.

L'essai numérique le confirme. Vitesse radiale de S2 rendue par le code
(dérivée temporelle de la troisième composante, convertie à 4,74 km/s par UA/an) :

| époque | dz/dt (km/s) | \|v\| (km/s) | r (UA) |
|---|---:|---:|---:|
| 2017,40 | +1 906 | 2 736 | 692,2 |
| 2018,00 | +3 154 | 4 413 | 334,7 |
| 2018,20 | **+4 014** | 6 203 | 184,0 |
| 2018,30 | +3 267 | 7 636 | 125,2 |
| 2018,35 | +1 553 | 7 719 | 122,7 |
| **2018,40** | −120 | 7 105 | 143,3 |
| 2018,45 | −1 069 | 6 343 | 176,7 |
| 2018,50 | −1 523 | 5 700 | 214,4 |
| 2018,60 | **−1 832** | 4 794 | 290,7 |
| 2019,00 | −1 745 | 3 211 | 552,8 |
| 2019,40 | −1 532 | 2 546 | 760,1 |

Extremum positif : **+4 052 km/s en 2018,225**, soit *avant* le périastre.
Extremum négatif : **−1 879 km/s en 2018,694**, soit *après*.

Le code fait donc **s'éloigner S2 avant le périastre et s'approcher après**.
La réalité est l'inverse : S2 approche avant mai 2018, s'éloigne après. Le signe
de la troisième composante est **retourné**.

## 2. La correction à appliquer

Une seule chose à changer, **ligne 102 de `etoiles.js`** :

```js
  return [ xw*cO - yi*sO, xw*sO + yi*cO, zi ];
```

devient

```js
  return [ xw*cO - yi*sO, xw*sO + yi*cO, -zi ];
```

Équivalent, si tu préfères que la correction se voie à l'endroit où la
convention est en cause, ligne 101 : `zi = -yw*si`.

**Pourquoi cette correction-là et pas une autre.** Si le Ω de l'article est le
nœud où l'astre s'approche, alors pour repasser en convention standard il faut
Ω → Ω+180°, et *aussi* ω → ω+180°, puisque ω y est compté depuis ce même nœud.
Or ces deux rotations de 180° combinées laissent les deux premières composantes
inchangées et ne retournent que la troisième. Autrement dit : **les positions
projetées sur le ciel sont déjà justes**, seule la profondeur est inversée. La
correction est donc bien une simple négation de `z`, et rien d'autre — surtout
pas un ±180° sur Ω seul, qui casserait les positions sur le ciel.

Effet visible : `projette()` consomme `p[2]`, donc la correction change quelles
orbites passent devant et lesquelles passent derrière le trou noir.

## 3. Une réserve à connaître, sur les grandeurs

Le brief donnait la bascule comme « environ −2 000 km/s puis environ
+4 000 km/s ». Les deux grandeurs sont retrouvées **très exactement** (1 879 et
4 052), mais dans l'ordre inverse de celui annoncé : le grand extremum tombe
avant le périastre, le petit après.

Ce n'est pas un artefact du code, et **aucune correction de signe ne peut le
changer**. La vitesse radiale képlérienne vaut `K·[cos(ω+ν) + e·cos ω]`, ses deux
extrema tombent en ν = −ω (avant le périastre) et ν = 180°−ω (après), et valent
`K(1+e·cos ω)` et `−K(1−e·cos ω)`. Avec e = 0,8839 et ω = 65,51°, e·cos ω = +0,366,
et le rapport des grandeurs vaut **2,16 en faveur de l'extremum antérieur**, quel
que soit le signe de z. Pour que le grand extremum tombe après le périastre, il
faudrait cos ω < 0 — un ω autour de 245°, pas 65°.

Donc, honnêtement : le verdict « retourné » s'appuie sur **l'ordre des signes**
(approche puis éloignement), qui est la donnée physique robuste et sur laquelle
le brief et le code se contredisent franchement. Il ne s'appuie pas sur
l'appariement grandeur/date du brief, qui est géométriquement impossible avec
ces éléments et qui est donc, lui, à corriger dans le brief. Je n'ai pas pu
récupérer la courbe de vitesse radiale publiée elle-même pour lever cette
dernière ambiguïté : les trois sources tentées (aanda.org, les PDF arXiv et ESO)
n'ont pas rendu de texte exploitable dans le temps imparti. Si tu veux une
certitude complète, c'est la figure de vitesse radiale de GRAVITY 2018 ou du
papier de précession de 2020 qu'il faut regarder, et rien d'autre.

---

## 4. Troisième loi de Kepler, étoile par étoile

`a³/P²`, avec a en unités astronomiques et P en années, rend directement la masse
centrale en masses solaires.

| étoile | a (UA) | P (an) | M = a³/P² | écart à 4,3 × 10⁶ |
|---|---:|---:|---:|---:|
| S2  | 1 039 | 16,0 | 4,38 × 10⁶ | +1,8 % |
| S55 | 892 | 12,8 | 4,34 × 10⁶ | +0,8 % |
| S38 | 1 172 | 19,2 | 4,37 × 10⁶ | +1,6 % |
| S13 | 2 186 | 49,0 | 4,35 × 10⁶ | +1,2 % |
| S9  | 2 255 | 51,3 | 4,36 × 10⁶ | +1,3 % |
| S14 | 2 370 | 55,3 | 4,35 × 10⁶ | +1,2 % |
| S12 | 2 472 | 58,9 | 4,36 × 10⁶ | +1,3 % |
| S8  | 3 350 | 92,9 | 4,35 × 10⁶ | +1,3 % |
| S1  | 4 925 | 166,0 | 4,33 × 10⁶ | +0,8 % |
| S24 | 7 813 | 331,0 | 4,35 × 10⁶ | +1,3 % |

Moyenne : **4,35 × 10⁶ M☉**, dispersion **1 %** de bout en bout.

**Aucune ligne suspecte.** La cohérence est même remarquablement serrée : les dix
étoiles s'accordent à mieux que 1 % entre elles, sur des demi-grands axes qui
vont de 892 à 7 813 UA et des périodes de 12,8 à 331 ans. En particulier **S55,
qui avait été mal recopiée une fois** depuis un rendu HTML corrompu, est
aujourd'hui la plus proche de la moyenne (+0,8 %) : cette ligne-là est saine.

Le biais commun de +1,3 % n'est pas une erreur de recopie, c'est le choix de
`R0_UA = 8277` : la masse déduite varie comme le cube de la distance adoptée, et
un tel décalage de 1,3 % correspond à 0,4 % sur la distance. Rien à corriger.

## 5. Les contrôles d'ordre de grandeur

| grandeur | mesuré | attendu | écart |
|---|---:|---:|---:|
| périastre de S2, a(1−e) | 120,6 UA | 120 UA | +0,5 % |
| date du périastre | 2018,330 | 2018,38 (19 mai 2018) | −0,05 an |
| vitesse de S2 au périastre | 7 790 km/s | 7 650 km/s | +1,8 % |
| … en fraction de c | 2,60 % | 2,6 % | — |
| masse centrale moyenne | 4,35 × 10⁶ M☉ | 4,3 × 10⁶ M☉ | +1,3 % |

Tout tient. L'écart de +1,8 % sur la vitesse au périastre suit mécaniquement
celui de la masse, et l'écart de 0,05 an sur la date du périastre vient du `t0`
et de la période recopiés, arrondis au centième d'année.

---

## Ce qui reste à faire

1. Appliquer la négation ligne 102 (ou 101).
2. Mettre à jour le commentaire lignes 56-58 : le piège est vérifié, plus
   « à vérifier ». Noter que Ω y est le nœud d'approche et que la correction
   consiste en Ω+180° **et** ω+180°, dont l'effet net se réduit à z → −z.
3. Reporter dans `ETOILES-S.md`.
4. Si tu veux la certitude complète sur l'ordre des grandeurs (section 3),
   regarder la figure de vitesse radiale de GRAVITY 2018.
