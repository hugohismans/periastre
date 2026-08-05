# Ce qui reste à faire, dans l'ordre

Liste courte et ordonnée. Le détail de chaque point est dans `IDEES.md`, qui
sert d'archive ; ce fichier-ci sert à savoir quoi prendre ensuite.

Mis à jour le 5 août 2026.

---

## En cours

| | chantier | où | état |
|---|---|---|---|
| 1 | **Interface** — panneaux réglages et spectre au vocabulaire du bord | `dev` | barre et menu faits |
| 2 | **Chemin de progression** — l'orbite qu'on remonte, un palier par notion | `dev` | menu en index, base posée |

## Prêt à brancher

| | chantier | où | état |
|---|---|---|---|
| 3 | **Le voyage à 1 g** — durées, retournement, chronomètre | `dev` | `voyage1g.js` vérifié |
| 4 | **Le recul logarithmique** et son quadrillage | `dev` | `recul.js` vérifié |
| 5 | **Les étoiles S** — dix orbites sourcées | `dev` | `etoiles.js`, convention à éprouver |
| 6 | **Le bilingue** — sélecteur, extraction des chaînes en dur | `dev` | `contenu.en.js` fait |

## Ensuite

| | chantier | dépend de |
|---|---|---|
| 7 | **Voix anglaise** — 10 Mo à synthétiser | textes anglais relus |
| 8 | **Carnet d'apprentissage** — relevé de ce qui a été lu | — |
| 9 | **Questionnaire diagnostique** — sans note, avec porte de sortie | 8 |
| 10 | **Renvois de lecture par langue** — distincts des sources | 6 |
| 11 | **Trou noir d'étude** — paramètres libres, depuis le télescope | 3 |
| 12 | **Registre temporel** — le décalage accumulé, avec ses formules | 3 |
| 13 | **Le panthéon gravé** — la paroi, Firestore est prêt | mission de chute |
| 14 | **La chute derrière l'horizon** — `CHUTE.md` est écrit | — |

## Plus tard

Hub à plusieurs ponts · deux vaisseaux dont un commun · système solaire planète
par planète · vitre en réalité augmentée · avatars et garde-robe · mesurer
l'expansion au peigne de raies · cours sur les jumeaux au diagramme de
Minkowski · sondes réelles et assistance gravitationnelle · musique · carte des
vaisseaux.

---

## Dettes connues

- **Couture sur l'axe polaire** en rotation : coordonnées de Boyer-Lindquist
  singulières. Corriger demande de réécrire en Kerr-Schild.
- **Écrans du bord en deux dimensions** : pas de perspective vraie, rien ne les
  occulte. La solution est de les passer en géométrie texturée.
- **Cockpit enfermé dans une bande** sur écran large et court.
- **Saut d'image une fois par orbite** : non reproduit, hypothèse de la bascule
  de résolution traitée. Hugo doit presser `C` au moment du saut.
- **Convention d'orientation des étoiles S** déduite, non citée : à éprouver
  numériquement avant publication.
