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

- [x] 3.1 les poignées DOM — atteint par la coupe en trois : elles sont en tête du bloc B, et aucun domaine ne dépend plus de leur position (zéro inversion armée, et elles ne figurent pas dans les différées)
- [x] 3.2 les libellés deviennent des données → `libelles.js` + son outil
- [ ] 3.3 l'état partagé devient `VUE`, puis `etat.js` — **repoussé après l'étape 5** : 469 références sur trois fichiers, c'est la seule étape du chantier qui ne se rattrape pas d'un git revert propre. Elle se fait en début de session, pas en fin.

## Étape 4 — les gros de dessin

- [x] 4.1 écrans de bord → `ecrans.js`
- [x] 4.1 bis l'outil des écrans de bord — 79 contrôles, et deux vrais défauts corrigés
- [x] 4.2 calque → `calque.js` + son outil
- [x] 4.3 habitacle → `habitacle.js` + son outil
- [x] 4.4 résolution adaptative → `resolution.js` + son outil

## Étape 5 — les gros de logique

- [x] 5.1 caméra → `camera.js` — branchée, 198 lignes, et le second écrivain de `lieu` a disparu avec : le module DEMANDE le décrochage, la page ouvre la porte. F1 dit enfin vrai. Son outil est en cours d'écriture
- [ ] 5.2 lieux → `lieux.js` écrit, **pas branché**. Son outil existe désormais (133 contrôles, dont un monde espion qui COMPTE les écritures de `lieu` : « un seul écrivain » est mesuré, pas supposé). La chirurgie est la prochaine
- [x] 5.9 gestes → `gestes.js` + son outil — 81 contrôles, extraction identique au bit près sur 450 000 tirages
- [x] 5.3 registre → `registre.js` + son outil — ⚠ l'extraction avait laissé trois lecteurs morts derrière elle, réparés le 8 août
- [x] 5.3 bis les deux noms morts — `registre` (carnet de bord) et `regard` passé à la place de `regardSalon` (l'ancre de Lumen). Ils emportaient treize contrôles en silence ; le filet passe de 93 à 106 sans qu'on en écrive un
- [ ] 5.3 ter `outil-verif-noms.js` — un nom lu et déclaré nulle part doit rougir hors navigateur. Les deux ci-dessus ont été trouvés par hasard, trois extractions trop tard
- [ ] 5.4 voyage → vers `voyage1g.js`
- [ ] 5.5 Lumen → `lumen.js` + son outil
- [x] 5.6 missions et progression → `progression.js` + son outil — **branché**. 153 contrôles écrits AVANT la chirurgie, et c'est ce qui a trouvé les infinis dans la mémoire
- [ ] 5.7 manette → `manette.js` + son outil
- [ ] 5.8 accueil → `accueil.js` + son outil

## Les deux fondations qui restent

- [ ] F3 — un compagnon au trou noir d'étude, pour brancher `ncorps.js`
- [ ] F4 — la forme visuelle de l'aveu, et le contrôle qui l'exige

## La cible est-elle atteignable ? — mesuré le 8 août, à 3 539

Le plan annonçait « ≈ 2 300 lignes » sur une estimation à vue. Vérifié depuis,
en classant les 3 544 lignes du bloc par nature :

| | lignes | part | |
|---|---:|---:|---|
| commentaires | 955 | 27 % | un actif du projet, jamais une dette |
| DOM | 560 | 16 % | ne peut pas sortir — un module qui touche au document cesse d'être éprouvable |
| WebGL | 61 | 2 % | l'uniforme s'adresse au programme courant |
| lignes vides | 421 | 12 % | |
| **le reste** | **1 547** | **44 %** | **tout ce qui peut encore partir** |

**Plancher absolu : 1 997 lignes**, si absolument tout ce qui peut sortir sort.
La cible de 2 400 est donc atteignable, et elle ne demande pas d'y arriver — il
reste 400 lignes de marge pour le câblage et l'orchestration qui doivent rester.

Ce qui ne se fera pas pour tenir un chiffre : couper des commentaires. Ce serait
truquer le contrôle, et c'est la seule chose que ce chantier ne s'autorise pas.

## Pour finir

- [ ] `PLAFOND` sous 2 400 lignes
- [ ] `CHANTIERS.md` et `cap.html` remis d'aplomb
- [ ] une séance `?juge` sur ce qui reste à l'œil
