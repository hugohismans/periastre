# La descente au périastre — la liste que le hook lit

Ce fichier n'est pas de la décoration : **le hook `Stop` le lit à chaque fin de
tour** (`outils/encore.js`), et refuse l'arrêt tant qu'une case qui m'appartient
reste vide. Les cases marquées **(HUGO)** demandent son œil ou sa voix — elles
sont écartées du compte, me pousser dessus produirait du remplissage.

Le plan complet, avec le pourquoi de chaque pièce, est dans le plan de session
« La descente au périastre ». Le nom : les fondations étaient l'apoastre — loin,
lent, à consolider. Maintenant le passage au plus près, où la vitesse est
maximale et où tout se voit.

Une ligne `## ARRÊT — <pourquoi>` en tête de ce fichier suspend le hook.

## P1 — Le carnet du voyageur

- [x] 1.1 l'ordre `inscritSejour` dans `lieux.js` quand on quitte le salon, avec son épreuve dans `outil-verif-lieux.js`
- [x] 1.2 la ligne de séjour dans `registre.js` (type « séjour », les deux durées), éprouvée dans `outil-verif-registre.js`
- [x] 1.3 la phrase à la première personne dans le carnet — « depuis ta première mission tu as vécu…, la Terre a vécu… »
- [x] 1.4 vérifié dans la page (`VERIF`), publié, cliquets d'aplomb

## P2 — Simulation / cinéma

- [x] 2.1 sourcer la densité du champ d'étoiles depuis l'amas nucléaire → `contenu.js`, gardé par `outil-verif-contenu.js` — fait, et la réponse déborde : fiche « Le ciel de là-bas », 8 sources vérifiées, 3 niveaux, 2 langues
- [ ] 2.7 **peindre le ciel** — la recherche dit qu'il n'y fait jamais nuit, que la vraie nébulosité a une forme (minispirale, anneau opaque) et que le champ est cent à cinq cents fois plus riche. Ce n'est plus un uniforme, c'est une image : à ouvrir en regardant **(HUGO)**
- [x] 2.2 le module du mode (quels uniformes chaque mode commande), avec son outil
- [x] 2.3 le choix au premier passage, à côté de la langue — sous les deux lettres, une seule fabrique pour les deux sélecteurs, gardée par `outil-verif-rendu.js` (24 contrôles)
- [x] 2.4 le sort du bouton « Lumière réelle » — **il reste un bouton à part**. Jugé le 9 août au soir : « ça va » depuis l'angle « simulation + lumière réelle » — or cette vue n'existe que si les deux réglages sont indépendants. En faire un cran les rendrait exclusifs et supprimerait ce qu'il vient de juger bon.
- [x] 2.5 les aveux disent ce que « cinéma » ajoute (`aveu.js`) — et ce qui reste faux quand on l'éteint ; `selonMode` gardé par le contrat (5 sabotages) et par `outil-verif-aveu.js` (33 contrôles)
- [x] 2.6 séance `?juge` : les deux modes, en inspection — **faite le 9 août au soir, sur iPhone. Deux « ça va ». La file est vide** : sept questions, sept verdicts, deux séances.

## P3 — Le voyage vers le système solaire

- [ ] 3.1 le départ : la destination s'accepte, le prix reste affiché ; ~~corriger `inactif-8` (780 000 t) + MP3~~ **fait le 9 août** ; la comparaison sondes réelles, sourcée
- [ ] 3.2 le recul galactique : ~5 décades de plus sur le moteur de `RECUL`, `echelle.js` payé ; la table `DESTINATIONS` morte supprimée
- [ ] 3.3 le retournement à mi-parcours — sa seconde d'animation, les deux horloges en direct
- [ ] 3.4 les moments de cours (touche H) et le PREMIER cours : le voyage, sur `journal.js`, un seul, complet
- [ ] 3.5 l'arrivée : la Terre et la Lune — `lune.js` branché, la dette devient la récompense
- [ ] 3.6 les textes des moments de cours — sa voix, sourcée **(HUGO)**
- [ ] 3.7 séances `?juge` : le retournement, l'arrivée **(HUGO)**

## P4 — Le vaisseau à ponts

- [ ] 4.1 la maquette d'UN pont nouveau au moteur maison (`habitacle.js`, `vaisseau.js`, `arpente.js`), le pont = un LIEU
- [ ] 4.2 la décision moteur — maison ou commerce — en regardant la maquette, pas sur un argument **(HUGO)**

## P5 — La salle de tir et le mémorial

- [ ] 5.1 le tir à zéro et l'aperçu de trajectoire (`integre` + `montreTraj`), avec leur outil
- [ ] 5.2 le mémorial : circonstance en entier, noms composés, « disparu » — et `CHUTE.md` branché
- [ ] 5.3 la vue extérieure d'une sonde (module neuf, patron `robot.js`)
- [ ] 5.4 séance `?juge` sur la salle entière **(HUGO)**

## Le solde

- [x] la raison de `ncorps.js` dans `tout.js` réécrite vers le bac à sable (décidé le 10 août)
- [ ] la réplique de Lumen au poste horaire — sa voix **(HUGO)**
- [ ] l'aberration du salon, la vitesse du manche, les écrans à 44 cm **(HUGO)**
