# Ce qui reste à faire, dans l'ordre

Liste courte et ordonnée. Le détail de chaque point est dans `IDEES.md`, qui
sert d'archive ; ce fichier-ci sert à savoir quoi prendre ensuite.

Mis à jour le 5 août 2026.

---

## Fait, et branché

| | chantier | ce qui existe |
|---|---|---|
| 1 | **Interface** | Barre en rail, menu en index, panneaux en commandes segmentées. **En production.** |
| 3 | **Le voyage à 1 g** | Le télescope est un lieu : on choisit une destination, le vaisseau part, le chronomètre dit ce que le trajet coûte vraiment aux deux horloges. `VOYAGE.enChemin` calcule le temps propre en cours de route au lieu de l'interpoler. |
| 4 | **Le recul logarithmique** | Vécu depuis le salon, par la baie, avec le quadrillage qui se renumérote à chaque décade. |
| 5 | **Les étoiles S** | Dix orbites sourcées, avec étalon, date, et la mention qu'il s'agit d'une reconstruction. Orientable et zoomable. |
| 11 | **Trou noir d'étude** | Un objet distinct, nommé comme tel, à rotation libre. La masse n'y est pas — et le panneau dit pourquoi c'est le point le plus instructif. |
| 12 | **Registre temporel** | Chaque trajet inscrit son écart ; le total se lit dans le carnet de bord. Se fige hors connexion. |

## En cours

| | chantier | état |
|---|---|---|
| 6 | **Le bilingue** | Sélecteur fait, contenu traduit, unités et ponctuation des nombres suivent la langue. **Restent environ cent quarante chaînes en dur**, toutes inventoriées dans `CHAINES-UI.md` avec leur clé et leur traduction — c'est du travail mécanique, pas de la conception. |
| 2 | **Chemin de progression** | Menu en index, base posée. Rien de plus. |

## Ensuite

| | chantier | dépend de |
|---|---|---|
| 7 | **Voix anglaise** — 10 Mo à synthétiser | textes anglais relus |
| 8 | **Carnet d'apprentissage** — relevé de ce qui a été lu | — |
| 9 | **Questionnaire diagnostique** — sans note, avec porte de sortie | 8 |
| 10 | **Renvois de lecture par langue** — distincts des sources | 6 |
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
- **Orientation des étoiles S : le signe de la profondeur reste ouvert.**
  Éprouvé numériquement, sans pouvoir trancher. La formule reproduit
  Thiele-Innes tel que Wright & Howard le définissent — convention que Gillessen
  cite —, et dans laquelle le nœud ascendant est le nœud d'approche. Départager
  cette lecture de l'usage des binaires visuelles demande le signe de la vitesse
  radiale de S2 à une date connue, lequel ne figure dans le TEXTE d'aucun
  article consulté : seulement sur une figure. La géométrie impose que les deux
  extrêmes soient dans un rapport de 2,16 — environ 4 050 et 1 880 km/s — mais
  pas lequel précède le périastre. Ce qui est en revanche vérifié et solide :
  les dix étoiles rendent la même masse centrale à 1 % près, le périastre de S2
  tombe à 120,6 UA contre 120 publiées, et S55 est saine.
  **Conséquence pratique** : la vue n'indique aucune direction vers la Terre et
  ne marque aucun côté proche, donc l'ambiguïté n'est pas observable et le site
  n'affirme rien. Ne pas ajouter d'axe « vers la Terre » sans avoir tranché.
- **Le titre de la page** reste français dans les deux langues.
