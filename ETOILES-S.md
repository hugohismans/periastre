# Éléments orbitaux des étoiles S autour de Sgr A*

**Nature de ce document.** Ce fichier ne contient que des valeurs **recopiées** de tableaux
publiés. Aucun élément n'a été ajusté, recalculé ou converti ici. Chaque bloc indique
l'article, l'année, le numéro de tableau et la ligne d'où la valeur provient.

Statut : document partiel, constitué en une session courte. Ce qui manque est signalé
explicitement dans la section « Ce qui manque » en fin de fichier.

---

## Sources utilisées

| Clé | Référence complète | Vérification |
|---|---|---|
| **G17** | Gillessen S., Plewa P. M., Eisenhauer F., Sari R., Waisberg I., Habibi M., Pfuhl O., George E., Dexter J., von Fellenberg S., Ott T., Genzel R., « An Update on Monitoring Stellar Orbits in the Galactic Center », *The Astrophysical Journal* **837**, 30 (2017). DOI 10.3847/1538-4357/aa5c41 — arXiv:1611.09144 | Source LaTeX de la soumission arXiv téléchargée et lue directement (les valeurs ci‑dessous sont copiées du code source du tableau, pas d'une lecture d'image ou de PDF) |
| **GR18** | GRAVITY Collaboration (Abuter R. *et al.*), « Detection of the gravitational redshift in the orbit of the star S2 near the Galactic centre massive black hole », *Astronomy & Astrophysics* **615**, L15 (2018). arXiv:1807.09409 | idem, source LaTeX arXiv |
| **GR20** | GRAVITY Collaboration (Abuter R. *et al.*), « Detection of the Schwarzschild precession in the orbit of the star S2 near the Galactic centre massive black hole », *Astronomy & Astrophysics* **636**, L5 (2020). arXiv:2004.07187 | idem, source LaTeX arXiv |

---

## 1. S2 — l'orbite la mieux contrainte

### 1.1 G17 — Table 3, ligne « S2 »

Tableau : *« Orbital parameters of the 40 stars for which we were able to determine orbits »*
(annexe de l'article, `\label{orbitsTable}` dans la source LaTeX ; **troisième tableau** du
document, donc « Table 3 »).

> ⚠️ **Numéro de tableau à vérifier sur la version publiée.** Dans la source arXiv, l'ordre des
> tableaux est : (1) *The gravitational potential based on orbital fitting*, (2) *Table of stars
> for which we have measured a reliable acceleration*, (3) *Orbital parameters of the 40
> stars…*, (4) *Laws of motions of stars in the central arcsecond*. La numérotation de la
> version IOP n'a pas pu être confirmée dans le temps imparti (une lecture automatique de la
> page IOP a suggéré « Table 2 », sans fiabilité). **En cas de citation, citer par la légende**
> — elle, est certaine — et non par le seul numéro.
Colonnes du tableau : `Star | a['']| e | i[°] | Ω[°] | ω[°] | t_P[yr] | T[yr] | Sp | m_K | r`.

| Élément | Valeur | Incertitude |
|---|---|---|
| a (demi‑grand axe, **secondes d'arc**) | 0,1255 | ± 0,0009 |
| e (excentricité) | 0,8839 | ± 0,0019 |
| i (inclinaison) | 134,18° | ± 0,40° |
| Ω (longitude du nœud ascendant) | 226,94° | ± 0,60° |
| ω (argument du périastre) | 65,51° | ± 0,57° |
| t_P (passage au périastre) | 2002,33 | ± 0,01 an |
| T (période) | 16,00 ans | ± 0,02 an |
| Type spectral | e (early‑type) | — |
| m_K | 13,95 | — |
| r (facteur de rééchelonnement des erreurs) | 1,13 | — |

Note de la légende du tableau G17 : les paramètres sont déterminés dans le potentiel obtenu
à partir du jeu de données combiné de S2 ; les erreurs citées sont les erreurs formelles
d'ajustement, rééchelonnées pour que le χ² réduit vaille 1, incertitudes du potentiel incluses.

### 1.2 GR18 — Table A.1

Tableau : *« Best-fit orbit parameters with and without Schwarzschild precession »*
(annexe A « Supplementary material », `\label{tab:a1}` ; **Table A.1** de l'article publié).
Deux colonnes de valeurs : sans / avec précession de Schwarzschild. Ajustement à 14 paramètres.

| Élément | Sans précession | Avec précession | Unité |
|---|---|---|---|
| a | 125,38 ± 0,18 | 125,40 ± 0,18 | **mas** |
| e | 0,88473 ± 0,00018 | 0,88466 ± 0,00018 | — |
| i | 133,817 ± 0,093 | 133,818 ± 0,093 | ° |
| ω | 66,12 ± 0,12 | 66,13 ± 0,12 | ° |
| Ω | 227,82 ± 0,19 | 227,85 ± 0,19 | ° |
| P (période) | 16,0526 | 16,0518 | an — *aucune incertitude publiée dans ce tableau* |
| t_peri | 2018,37965 ± 0,00015 | 2018,37974 ± 0,00015 | an |
| t_peri | 58257,667 ± 0,054 | 58257,698 ± 0,054 | MJD |
| M• | 4,106 ± 0,034 | 4,100 ± 0,034 | 10⁶ M☉ |
| R₀ | 8127 ± 31 | 8122 ± 31 | pc |
| x₀ | −0,88 ± 0,47 | −1,00 ± 0,47 | mas |
| y₀ | −0,97 ± 0,41 | −0,99 ± 0,41 | mas |
| ẋ₀ | 0,070 ± 0,031 | 0,076 ± 0,031 | mas/an |
| ẏ₀ | 0,178 ± 0,030 | 0,178 ± 0,030 | mas/an |
| ż₀ | 2,4 ± 3,0 | 1,9 ± 3,0 | km/s |
| f (0 = keplérien, 1 = RR+RG au 1er ordre) | 0,901 ± 0,090 | 0,945 ± 0,090 | — |
| χ²_réduit | 0,86 | 0,86 | — |

Note de bas de tableau, recopiée : dans le cas avec précession de Schwarzschild, les paramètres
orbitaux doivent être interprétés comme des **éléments osculateurs** ; ω et t_peri sont donnés
**pour l'époque du dernier apocentre, en 2010**.

### 1.3 GR20 — Table E.1

Tableau : *« Best-fit orbit parameters »* (annexe E « Details of the fit », `\label{tab:t1}` ;
**Table E.1** de l'article publié). Ajustement à 14 paramètres. Colonnes : valeur, erreur
d'ajustement, erreur MCMC.

| Élément | Valeur | Erreur d'ajustement | Erreur MCMC | Unité |
|---|---|---|---|---|
| a | 125,058 | 0,041 | 0,044 | **mas** |
| e | 0,884649 | 0,000066 | 0,000079 | — |
| i | 134,567 | 0,033 | 0,033 | ° |
| ω | 66,263 | 0,031 | 0,030 | ° |
| Ω | 228,171 | 0,031 | 0,031 | ° |
| P | 16,0455 | 0,0013 | 0,0013 | an |
| t_peri | 2018,37900 | 0,00016 | 0,00017 | an |
| M• | 4,261 | 0,012 | 0,012 | 10⁶ M☉ |
| R₀ | 8246,7 | 9,3 | 9,3 | pc |
| x₀ | −0,90 | 0,14 | 0,15 | mas |
| y₀ | 0,07 | 0,12 | 0,11 | mas |
| vx₀ | 0,080 | 0,010 | 0,010 | mas/an |
| vy₀ | 0,0341 | 0,0096 | 0,0096 | mas/an |
| vz₀ | −1,6 | 1,4 | 1,4 | km/s |
| f_SP (précession de Schwarzschild) | 1,10 | 0,19 | 0,21 | — |
| f_RS (décalage gravitationnel) | 1 | fixé | fixé | — |

Légende recopiée : « Les paramètres orbitaux doivent être interprétés comme les éléments
orbitaux **osculateurs**. L'argument du périastre ω et l'époque du passage au périastre t_peri
sont donnés **pour l'époque du dernier apocentre, en 2010**. »

> **Attention en lisant ces trois tableaux ensemble.** Les valeurs de a diffèrent (0,1255″ =
> 125,5 mas contre 125,40 et 125,058 mas) et Ω se déplace de 226,94° à 228,17°. Ce n'est pas
> une erreur de recopie : ce sont trois ajustements différents, sur des jeux de données
> différents, dans des potentiels différents, et avec (GR18/GR20) des éléments osculateurs
> rapportés à une époque précise. **Ne pas mélanger des lignes provenant de tableaux
> différents dans un même jeu d'éléments.**

---

## 2. Masse et distance de Sgr A* (pour mémoire, colonne du même tableau)

Ces valeurs ne sont pas des éléments orbitaux mais elles conditionnent l'échelle physique
(a en secondes d'arc → a en UA passe par R₀).

**G17, Table 1** (*« The gravitational potential based on orbital fitting »*,
`\label{tab_fit_s2}`), lignes numérotées dans le tableau :

| Ligne | Données / a priori / type | R₀ (kpc) | M• (10⁶ M☉) | χ²_réd |
|---|---|---|---|---|
| 1 | S2, VLT / aucun / keplérien | 8,17 ± 0,20 | 4,25 ± 0,20 | 1,19 |
| 2 | S2, VLT / 2D, v_z / keplérien | 8,13 ± 0,15 | 4,10 ± 0,16 | 1,28 |
| 3 | S2, combiné / 2D, v_z / keplérien | 8,33 ± 0,12 | 4,35 ± 0,13 | 1,48 |
| 4 | S2, combiné / aucun / keplérien | 8,17 ± 0,15 | 4,30 ± 0,15 | 1,41 |
| 8 | S2, combiné / 2D, v_z / **RG** | 8,41 ± 0,13 | 4,43 ± 0,14 | 1,47 |
| **9** | **multi‑étoiles (17 étoiles) / 2D, v_z / keplérien** | **8,32 ± 0,07** | **4,28 ± 0,10** | **0,98** |
| 10 | multi‑étoiles sans S2 | 8,19 (+0,16 / −0,11) | 4,08 (+0,25 / −0,14) | 0,97 |

La ligne 9 est le meilleur ajustement global de l'article. Le résumé de G17 y ajoute une
erreur systématique : M = 4,28 ± 0,10 (stat.) ± 0,21 (syst.) × 10⁶ M☉ et
R₀ = 8,32 ± 0,07 (stat.) ± 0,14 (syst.) kpc.

Valeurs GRAVITY correspondantes : GR18 Table A.1 → M• = 4,100 ± 0,034 × 10⁶ M☉,
R₀ = 8122 ± 31 pc ; GR20 Table E.1 → M• = 4,261 ± 0,012 × 10⁶ M☉, R₀ = 8246,7 ± 9,3 pc
(erreurs formelles d'ajustement seulement).

---

## 3. Les 40 étoiles de G17, Table 3 — recopie intégrale

Colonnes exactement comme publiées :
`a` en **secondes d'arc**, `i`, `Ω`, `ω` en degrés, `t_P` et `T` en années,
`Sp` = type spectral (`e` early‑type, `l` late‑type), `m_K` = magnitude en bande K,
`r` = facteur global de rééchelonnement des erreurs pour cette étoile.

| Étoile | a [″] | e | i [°] | Ω [°] | ω [°] | t_P [an] | T [an] | Sp | m_K | r |
|---|---|---|---|---|---|---|---|---|---|---|
| S1 | 0,595 ± 0,024 | 0,556 ± 0,018 | 119,14 ± 0,21 | 342,04 ± 0,32 | 122,3 ± 1,4 | 2001,80 ± 0,15 | 166,0 ± 5,8 | e | 14,7 | 1,75 |
| S2 | 0,1255 ± 0,0009 | 0,8839 ± 0,0019 | 134,18 ± 0,40 | 226,94 ± 0,60 | 65,51 ± 0,57 | 2002,33 ± 0,01 | 16,00 ± 0,02 | e | 13,95 | 1,13 |
| S4 | 0,3570 ± 0,0037 | 0,3905 ± 0,0059 | 80,33 ± 0,08 | 258,84 ± 0,07 | 290,8 ± 1,5 | 1957,4 ± 1,2 | 77,0 ± 1,0 | e | 14,4 | 1,25 |
| S6 | 0,6574 ± 0,0006 | 0,8400 ± 0,0003 | 87,24 ± 0,06 | 85,07 ± 0,12 | 116,23 ± 0,07 | 2108,61 ± 0,03 | 192,0 ± 0,17 | e | 15,4 | 1,58 |
| S8 | 0,4047 ± 0,0014 | 0,8031 ± 0,0075 | 74,37 ± 0,30 | 315,43 ± 0,19 | 346,70 ± 0,41 | 1983,64 ± 0,24 | 92,9 ± 0,41 | e | 14,5 | 1,18 |
| S9 | 0,2724 ± 0,0041 | 0,644 ± 0,020 | 82,41 ± 0,24 | 156,60 ± 0,10 | 150,6 ± 1,0 | 1976,71 ± 0,92 | 51,3 ± 0,70 | e | 15,1 | 1,65 |
| S12 | 0,2987 ± 0,0018 | 0,8883 ± 0,0017 | 33,56 ± 0,49 | 230,1 ± 1,8 | 317,9 ± 1,5 | 1995,59 ± 0,04 | 58,9 ± 0,22 | e | 15,5 | 2,37 |
| S13 | 0,2641 ± 0,0016 | 0,4250 ± 0,0023 | 24,70 ± 0,48 | 74,5 ± 1,7 | 245,2 ± 2,4 | 2004,86 ± 0,04 | 49,00 ± 0,14 | e | 15,8 | 3,25 |
| S14 | 0,2863 ± 0,0036 | 0,9761 ± 0,0037 | 100,59 ± 0,87 | 226,38 ± 0,64 | 334,59 ± 0,87 | 2000,12 ± 0,06 | 55,3 ± 0,48 | e | 15,7 | 2,16 |
| S17 | 0,3559 ± 0,0096 | 0,397 ± 0,011 | 96,83 ± 0,11 | 191,62 ± 0,21 | 326,0 ± 1,9 | 1991,19 ± 0,41 | 76,6 ± 1,0 | l | 15,3 | 3,00 |
| S18 | 0,2379 ± 0,0015 | 0,471 ± 0,012 | 110,67 ± 0,18 | 49,11 ± 0,18 | 349,46 ± 0,66 | 1993,86 ± 0,16 | 41,9 ± 0,18 | e | 16,7 | 2,28 |
| S19 | 0,520 ± 0,094 | 0,750 ± 0,043 | 71,96 ± 0,35 | 344,60 ± 0,62 | 155,2 ± 2,3 | 2005,39 ± 0,16 | 135 ± 14 | e | 16. | 2,57 |
| S21 | 0,2190 ± 0,0017 | 0,764 ± 0,014 | 58,8 ± 1,0 | 259,64 ± 0,62 | 166,4 ± 1,1 | 2027,40 ± 0,17 | 37,00 ± 0,28 | l | 16,9 | 1,60 |
| S22 | 1,31 ± 0,28 | 0,449 ± 0,088 | 105,76 ± 0,95 | 291,7 ± 1,4 | 95 ± 20 | 1996,9 ± 10,2 | 540 ± 63 | e | 16,6 | 2,78 |
| S23 | 0,253 ± 0,012 | 0,56 ± 0,14 | 48,0 ± 7,1 | 249 ± 13 | 39,0 ± 6,7 | 2024,7 ± 3,7 | 45,8 ± 1,6 | e | 17,8 | 2,08 |
| S24 | 0,944 ± 0,048 | 0,8970 ± 0,0049 | 103,67 ± 0,42 | 7,93 ± 0,37 | 290 ± 15 | 2024,50 ± 0,03 | 331 ± 16 | l | 15,6 | 1,54 |
| S29 | 0,428 ± 0,019 | 0,728 ± 0,052 | 105,8 ± 1,7 | 161,96 ± 0,80 | 346,5 ± 5,9 | 2025,96 ± 0,94 | 101,0 ± 2,0 | e | 16,7 | 3,32 |
| S31 | 0,449 ± 0,010 | 0,5497 ± 0,0025 | 109,03 ± 0,27 | 137,16 ± 0,30 | 308,0 ± 3,0 | 2018,07 ± 0,14 | 108. ± 1,2 | e | 15,7 | 3,16 |
| S33 | 0,657 ± 0,026 | 0,608 ± 0,064 | 60,5 ± 2,5 | 100,1 ± 5,5 | 303,7 ± 1,6 | 1928 ± 12 | 192,0 ± 5,2 | e | 16. | 2,21 |
| S38 | 0,1416 ± 0,0002 | 0,8201 ± 0,0007 | 171,1 ± 2,1 | 101,06 ± 0,24 | 17,99 ± 0,25 | 2003,19 ± 0,01 | 19,2 ± 0,02 | l | 17. | 2,48 |
| S39 | 0,370 ± 0,015 | 0,9236 ± 0,0021 | 89,36 ± 0,73 | 159,03 ± 0,10 | 23,3 ± 3,8 | 2000,06 ± 0,06 | 81,1 ± 1,5 | *(vide)* | 16,8 | 3,27 |
| S42 | 0,95 ± 0,18 | 0,567 ± 0,083 | 67,16 ± 0,66 | 196,14 ± 0,75 | 35,8 ± 3,2 | 2008,24 ± 0,75 | 335 ± 58 | e | 17,5 | 1,65 |
| S54 | 1,20 ± 0,87 | 0,893 ± 0,078 | 62,2 ± 1,4 | 288,35 ± 0,70 | 140,8 ± 2,3 | 2004,46 ± 0,07 | 477 ± 199 | e | 17,5 | 2,60 |
| S55 | 0,1078 ± 0,0010 | 0,7209 ± 0,0077 | 150,1 ± 2,2 | 325,5 ± 4,0 | 331,5 ± 3,9 | 2009,34 ± 0,04 | 12,80 ± 0,11 | *(vide)* | 17,5 | 1,61 |
| S60 | 0,3877 ± 0,0070 | 0,7179 ± 0,0051 | 126,87 ± 0,30 | 170,54 ± 0,85 | 29,37 ± 0,29 | 2023,89 ± 0,09 | 87,1 ± 1,4 | e | 16,3 | 1,65 |
| S66 | 1,502 ± 0,095 | 0,128 ± 0,043 | 128,5 ± 1,6 | 92,3 ± 3,2 | 134 ± 17 | 1771 ± 38 | 664 ± 37 | e | 14,8 | 1,70 |
| S67 | 1,126 ± 0,026 | 0,293 ± 0,057 | 136,0 ± 1,1 | 96,5 ± 6,4 | 213,5 ± 1,6 | 1705 ± 22 | 431 ± 10 | e | 12,1 | 1,43 |
| S71 | 0,973 ± 0,040 | 0,899 ± 0,013 | 74,0 ± 1,3 | 35,16 ± 0,86 | 337,8 ± 4,9 | 1695 ± 21 | 346 ± 11 | e | 16,1 | 1,87 |
| S83 | 1,49 ± 0,19 | 0,365 ± 0,075 | 127,2 ± 1,4 | 87,7 ± 1,2 | 203,6 ± 6,0 | 2046,8 ± 6,3 | 656 ± 69 | e | 13,6 | 1,82 |
| S85 | 4,6 ± 3,30 | 0,78 ± 0,15 | 84,78 ± 0,29 | 107,36 ± 0,43 | 156,3 ± 6,8 | 1930,2 ± 9,8 | 3580 ± 2550 | l | 15,6 | 1,50 |
| S87 | 2,74 ± 0,16 | 0,224 ± 0,027 | 119,54 ± 0,87 | 106,32 ± 0,99 | 336,1 ± 7,7 | 611 ± 154 | 1640 ± 105 | e | 13,6 | 1,38 |
| S89 | 1,081 ± 0,055 | 0,639 ± 0,038 | 87,61 ± 0,16 | 238,99 ± 0,18 | 126,4 ± 4,0 | 1783 ± 26 | 406 ± 27 | l | 15,3 | 1,16 |
| S91 | 1,917 ± 0,089 | 0,303 ± 0,034 | 114,49 ± 0,32 | 105,35 ± 0,74 | 356,4 ± 1,6 | 1108 ± 69 | 958 ± 50 | e | 12,2 | 1,33 |
| S96 | 1,499 ± 0,057 | 0,174 ± 0,022 | 126,36 ± 0,96 | 115,66 ± 0,59 | 233,6 ± 2,4 | 1646 ± 16 | 662 ± 29 | e | 10. | 1,31 |
| S97 | 2,32 ± 0,46 | 0,35 ± 0,11 | 113,0 ± 1,3 | 113,2 ± 1,4 | 28 ± 14 | 2132 ± 29 | 1270 ± 309 | e | 10,3 | 1,22 |
| S111 | −12,3 ± 8,4 | 1,092 ± 0,064 | 102,68 ± 0,40 | 52,34 ± 0,75 | 132,4 ± 3,3 | 1947,7 ± 4,5 | N.A. | l | 13,8 | 0,97 |
| S145 | 1,12 ± 0,18 | 0,50 ± 0,25 | 83,7 ± 1,6 | 263,92 ± 0,94 | 185 ± 16 | 1808 ± 58 | 426 ± 71 | l | 17,5 | 1,46 |
| S175 | 0,414 ± 0,039 | 0,9867 ± 0,0018 | 88,53 ± 0,60 | 326,83 ± 0,78 | 68,52 ± 0,40 | 2009,51 ± 0,01 | 96,2 ± 5,0 | e | 17,5 | 2,72 |
| R34 | 1,81 ± 0,15 | 0,641 ± 0,098 | 136,0 ± 8,3 | 330 ± 19 | 57,0 ± 8,0 | 1522 ± 52 | 877 ± 83 | e | 14. | 1,35 |
| R44 | 3,9 ± 1,4 | 0,27 ± 0,27 | 131,0 ± 5,2 | 80,5 ± 7,1 | 217 ± 24 | 1963 ± 85 | 2730 ± 1350 | e | 14. | 1,11 |

Remarques recopiées de la légende du tableau :

- Les valeurs `10.`, `14.`, `16.`, `17.`, `108.` sont écrites ainsi dans la source (un seul
  chiffre significatif après la virgule non renseigné) ; je les laisse telles quelles.
- **S111 a formellement un demi‑grand axe négatif**, ce qui indique une orbite hyperbolique
  avec e > 1 ; sa période est notée « N.A. ». À exclure de tout tracé d'ellipse.
- S39 et S55 n'ont pas de type spectral renseigné dans le tableau.

### Étoiles les mieux contraintes

G17 sélectionne **17 étoiles** pour son ajustement multi‑étoiles (ligne 9 de la Table 1). La
liste est donnée verbatim au § 5 de l'article : *« We selected thus the following 17 stars for
a multi-star fit: S2, S1, S4, S8, S9, S12, S13, S14, S17, S18, S19, S21, S24, S31, S38, S54,
and S55. »* Ce sont les orbites les mieux contraintes du lot.

Précision de la légende de la figure correspondante : pour **S55, aucune vitesse radiale**
n'est disponible.

En pratique, les orbites les plus courtes et les mieux échantillonnées du
tableau sont S2 (T = 16,00 ans), S55 (12,80), S38 (19,2), S21 (37,00), S13 (49,00), S9 (51,3),
S14 (55,3), S12 (58,9), S4 (77,0), S8 (92,9), S1 (166,0) — leur période a été parcourue au
moins en partie sur les 25 ans de suivi. À l'inverse, S85 (3580 ± 2550 ans), S54
(477 ± 199 ans), S22, S97, R44 ont des incertitudes relatives énormes sur a et T : ne pas
les utiliser pour une animation.

---

## 4. Note de convention

### 4.1 Ce que G17 dit lui‑même

G17 définit les six paramètres (§ « Orbital fitting », repris de Gillessen et al. 2009,
ApJ **692**, 1075, arXiv:0810.4674, §4) comme :

> « demi‑grand axe *a*, excentricité *e*, inclinaison *i*, angle de la ligne des nœuds Ω,
> angle du nœud ascendant au périastre ω, et instant du passage au périastre t_P. Si l'orbite
> n'est qu'approximativement keplérienne, ces paramètres doivent être interprétés comme les
> **éléments osculateurs**. »
> *(Gillessen et al. 2009, § 4 « Orbital fitting », traduit)*

**G17 ne redonne pas explicitement l'orientation des axes.** Ce qu'il donne, en revanche,
c'est la référence de la convention employée dans l'ajustement : dans son annexe « The art of
fitting multiple orbits », il écrit utiliser les **éléments de Thiele‑Innes** *(A, B, G, F)*
et *(C, H)*, en citant **Wright J. T. & Howard A. W. 2009, ApJS 182, 205** (arXiv:0904.3725).
C'est donc là qu'il faut aller chercher la convention exacte.

### 4.2 La convention Thiele‑Innes de Wright & Howard 2009 (§ 4, « Astrometry »)

Définitions recopiées de l'article (leurs équations 40‑45 et 50‑53) :

- **a** : demi‑grand axe de l'orbite apparente **sur le ciel**, en unité d'angle.
- **Ω** : longitude du **nœud ascendant** — l'article précise entre parenthèses
  *« the ascending (approaching) node »*, c'est‑à‑dire le nœud **où l'astre s'approche** de
  l'observateur —, mesurée comme un **angle de position sur le ciel** (donc à partir du Nord,
  vers l'Est).
- **i** : inclinaison de l'orbite sur le ciel, telle que **i = 0 correspond à une orbite vue de
  face parcourue dans le sens horaire** *(« such that i = 0 corresponds to a face-on, clockwise
  orbit »)*.
- **ω** : argument du périastre, compté dans le plan orbital depuis le nœud ascendant.

Constantes de Thiele‑Innes :

```
A = a( cos Ω cos ω − sin Ω sin ω cos i)
B = a( sin Ω cos ω + cos Ω sin ω cos i)
F = a(−cos Ω sin ω − sin Ω cos ω cos i)
G = a(−sin Ω sin ω + cos Ω cos ω cos i)
C = a sin ω sin i
H = a cos ω sin i
```

équivalentes, sous forme matricielle (leur éq. 46) :

```
| A  B  C |
| F  G  H |                = a · Rz(ω) · Rx(i) · Rz(Ω)
| a sin i sin Ω   −a sin i cos Ω   a cos i |
```

avec la matrice de rotation

```
          |  cos Ω   sin Ω   0 |
Rz(Ω) =   | −sin Ω   cos Ω   0 |
          |    0       0     1 |
```

**L'ordre d'application est donc Rz(Ω), puis Rx(i), puis Rz(ω)** (lu de droite à gauche dans
le produit `Rz(ω) Rx(i) Rz(Ω)`) — c'est‑à‑dire l'enchaînement classique nœud → inclinaison →
périastre, appliqué à un vecteur exprimé dans le plan orbital.

### 4.3 Comment calculer une position sur le ciel

Coordonnées rectangulaires elliptiques (leurs éq. 52‑53), avec *E* l'anomalie excentrique :

```
X = cos E − e
Y = √(1 − e²) · sin E
```

et *E* obtenu de l'anomalie moyenne par l'équation de Kepler
`M = E − e sin E`, avec `M = 2π (t − t_P) / T`.

Déplacement sur le ciel (leurs éq. 50‑51, en ne gardant que le terme orbital, sans parallaxe
ni mouvement propre) :

```
Δδ          =  A·X + F·Y      (vers le Nord)
Δα · cos δ  =  B·X + G·Y      (vers l'Est)
```

Autrement dit : **A et F portent la composante Nord (déclinaison), B et G la composante Est
(ascension droite)**. C et H portent la composante le long de la ligne de visée (vitesse
radiale).

### 4.4 Trois avertissements sur cette section

1. **Chaînage de références.** G17 ne dit pas mot pour mot « nos angles tabulés suivent
   Wright & Howard 2009 » ; il dit qu'il *ajuste* avec les éléments de Thiele‑Innes de
   Wright & Howard. L'identification des conventions du tableau 3 avec celles de cet article
   est donc une déduction raisonnable, pas une citation. **À vérifier par un test numérique**
   (recalculer la position de S2 à une date où l'article publie une figure, et comparer).
2. **Sens de rotation.** Le sens « i = 0 → orbite vue de face, sens horaire » est bien une
   citation de Wright & Howard 2009. La légende de la figure « Orientation of the orbital
   planes » de G17 dit de son côté : « une étoile sur une orbite vue de face et **de sens
   horaire** relativement à la ligne de visée serait située **en haut du graphique** », l'axe
   vertical portant *i*. C'est cohérent avec i = 0 en haut, mais la figure elle‑même est
   nécessaire pour lever l'ambiguïté haut = 0° ou haut = 180°. Je ne tranche pas.
3. **Nœud ascendant = nœud approchant.** Wright & Howard écrivent explicitement
   « ascending (approaching) node ». C'est l'**inverse** de la convention la plus répandue en
   binaires visuelles, où le nœud ascendant est celui où l'astre **s'éloigne**. Une erreur de
   signe ici retourne l'orbite. C'est le point à tester en premier.
4. **GRAVITY.** Ni GR18 ni GR20 ne redonnent explicitement leur convention angulaire dans le
   texte de l'article ou la légende des tableaux. Rien ne garantit *a priori* qu'elle soit
   identique à celle de G17 — même si les valeurs de i, ω et Ω de S2 sont très proches d'un
   article à l'autre, ce qui suggère fortement une convention commune.

---

## 5. Étoiles à très courte période annoncées depuis 2020 : NON INCLUSES

S62, S4711, S4712, S4713, S4714, S4715 (Peißker et al.) et S4716 ne figurent **pas** dans ce
document. Leurs orbites sont contestées dans la littérature et ce site ne tranche pas une
controverse en cours. Elles ne sont pas non plus dans G17.

---

## 6. Ce qui manque

- La **confirmation directe** que les angles de G17 Table 3 sont bien dans la convention
  Wright & Howard 2009 : c'est une déduction (voir § 4.4), pas une citation. Un test numérique
  est nécessaire.
- L'orientation exacte de l'axe *i* dans la figure « Orientation of the orbital planes » de
  G17, qui lèverait l'ambiguïté sur le sens de rotation.
- La **confirmation des numéros de tableaux dans les versions publiées** (IOP pour G17, A&A
  pour GR18 et GR20). Ils sont déduits de l'ordre et des annexes dans la source LaTeX arXiv :
  G17 → 3e tableau ; GR18 → annexe A, seul tableau (« Table A.1 ») ; GR20 → annexe E, seul
  tableau (« Table E.1 »). Les légendes, elles, sont recopiées mot pour mot et sont sûres.
- L'**incertitude sur P** dans GR18 Table A.1 : elle n'est pas publiée dans ce tableau
  (les deux valeurs 16,0526 et 16,0518 an sont données sans barre d'erreur).
- Les articles **GRAVITY 2021 / 2022** sur la masse et la distance (mesure sur orbites
  multiples) n'ont pas été dépouillés dans le temps imparti.
- G17 Table 3 ne donne **pas** de matrice de covariance ni de corrélations entre éléments ;
  les erreurs listées sont des erreurs formelles marginales.
