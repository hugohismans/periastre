# Chantier des fondations — la liste que le hook lit

Ce fichier n'est pas de la décoration : **le hook `Stop` le lit à chaque fin de
tour**. Tant qu'il reste une case vide, il refuse l'arrêt et me force à
enchaîner. C'est la « condition réelle » sans laquelle une continuation forcée
ne peut jamais finir.

Deux façons de s'arrêter, et deux seulement :

- **cocher toutes les cases** — le chantier est fini ;
- **écrire `## ARRÊT` en tête d'une ligne** — quand j'ai besoin de l'œil d'Hugo,
  quand une décision lui revient, ou quand quelque chose est cassé. J'efface la
  ligne quand il a répondu.

Le détail de chaque étape est dans le plan approuvé. Ici, seulement l'état.

---

## Étape 0 — armer les gardes

- [x] le cliquet compte la somme des blocs, pas le plus gros
- [x] `outil-verif-ordre.js` — zéro inversion armée, 23 différées
- [x] chaque contrôle de la page sous filet
- [x] `tout.js` exige une raison écrite pour tout module hors page

## Étape 1 — couper le bloc en trois

- [x] les deux coutures, un témoin par bloc

## Étape 2 — les faciles

- [x] 2.1 cockpit → `cockpit.js` + son outil
- [x] 2.2 formateurs → `format.js` + son outil
- [x] 2.3 spectre → `spectre.js` + son outil
- [x] 2.4 banc d'essai → `banc.js` + son outil
- [x] 2.5 dossier et fiches → `dossier.js` + son outil

## Étape 3 — le nœud de l'état partagé

- [ ] 3.1 les poignées DOM montent en tête du bloc A
- [ ] 3.2 les libellés deviennent des données → `libelles.js` + son outil
- [ ] 3.3 l'état partagé devient `VUE`, puis `etat.js`

## Étape 4 — les gros de dessin

- [x] 4.1 écrans de bord → `ecrans.js`
- [ ] 4.1 bis l'outil des écrans de bord
- [x] 4.2 calque → `calque.js` + son outil
- [ ] 4.3 habitacle → `habitacle.js` + son outil
- [ ] 4.4 résolution adaptative → `resolution.js` + son outil

## Étape 5 — les gros de logique

- [ ] 5.1 caméra → `camera.js` + son outil
- [ ] 5.2 lieux → `lieux.js` + son outil
- [ ] 5.3 registre → `registre.js` + son outil
- [ ] 5.4 voyage → vers `voyage1g.js`
- [ ] 5.5 Lumen → `lumen.js` + son outil
- [ ] 5.6 missions et progression → `progression.js` + son outil
- [ ] 5.7 manette → `manette.js` + son outil
- [ ] 5.8 accueil → `accueil.js` + son outil
- [ ] 5.9 gestes → `gestes.js` + son outil

## Les deux fondations qui restent

- [ ] F3 — un compagnon au trou noir d'étude, pour brancher `ncorps.js`
- [ ] F4 — la forme visuelle de l'aveu, et le contrôle qui l'exige

## Pour finir

- [ ] `PLAFOND` sous 2 400 lignes
- [ ] `CHANTIERS.md` et `cap.html` remis d'aplomb
- [ ] une séance `?juge` sur ce qui reste à l'œil
