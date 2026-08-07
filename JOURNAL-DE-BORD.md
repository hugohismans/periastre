# Journal de bord

Le relevé au fil de l'eau : on a fait ci, on a fait ça. Écrit pour ne rien
coûter — quelques lignes par session, pas une rédaction.

**Il alimente `cap.html`**, la feuille de route lisible par un humain. Celle-ci
ne se met PAS à jour à chaque fois : c'est trop lourd, et Hugo l'a dit le
7 août 2026. La règle est donc :

1. J'écris ici à chaque session, en fin de session, court.
2. De temps en temps — quand ce fichier a assez grossi, ou qu'une direction a
   changé — je propose : *« on refait le cap ? »*
3. On remet `cap.html` d'aplomb ensemble, et on note ici la date de la remise.

Hugo peut aussi le déclencher à tout moment : « on refait le cap ».

**Dernière remise à plat de `cap.html` : 7 août 2026.**

---

## 7 août 2026

- **Le contrôle de la couture mesurait les étoiles.** Il a échoué à spin 0,9 en
  rendant 36. Un seul pixel, sur une seule rangée, bleuté : une étoile du fond,
  pas une couture. Corrigé par une médiane sur cinq azimuts — ce qui est collé à
  la scène survit, ce qui est collé au ciel disparaît.
- **Et la caméra n'obéissait pas aux contrôles.** On demandait azimut 0,54, elle
  se plaçait à 1,05 : l'ouverture cinématique la réécrit pendant neuf secondes.
  Tout contrôle lancé sur une page fraîche mesurait un travelling. Coupé dans
  `fige()`, donc pour tous les contrôles qui lisent des pixels, pas seulement
  celui qui l'a révélé. **Cinquième règle dure** ajoutée à `CLAUDE.md`.
- **Troisième question de jugement** ajoutée : l'image après la réécriture du
  moteur, les quatre rotations sur la même vue.
- **La publication réparée pour de bon.** Le dépôt était en état mixte — réglage
  Jekyll hérité, action moderne — et les trois signaux d'état mentaient. Une
  action écrite (`.github/workflows/pages.yml`) remplace tout ça : la publication
  passe désormais en une minute au lieu de rater bruyamment pendant dix.
  Au passage, j'ai basculé le réglage avant d'avoir écrit l'action : plus rien ne
  pouvait être publié entre les deux. Sans coupure du site, mais c'était une
  faute.
- **`outil-verif-publication.js` réécrit** : un seul fait tranche, ce que le
  serveur envoie cache interdit. Les relevés d'API restent affichés mais ne
  peuvent plus faire échouer quoi que ce soit.
- **Idée d'Hugo au carnet** : le cours attaché à l'expérience — touche H,
  trois niveaux, sourcé, et des curseurs pour essayer soi-même. Pas en chantier.
- **`cap.html` créé** — la feuille de route pour Hugo, non liée et non indexée.

État en milieu de journée : 81 contrôles dans la page, 12 outils hors
navigateur, tout au vert.

### Le soir — la séance de jugement, et ce qu'elle a ouvert

- **Deux questions closes.** La rotation du trou noir d'étude : « ça va », après
  quatre tentatives dont trois gâchées par mes propres fautes. L'image après la
  réécriture du moteur : « rien n'a bougé, tout a l'air conforme ».
- **Ma question sur l'image était mal écrite.** Ses quatre variantes étaient des
  points de vue d'inspection, pas des choix ; la séance a donc produit « garde
  celle-ci, enlève les autres », ce qui appliqué à la lettre aurait supprimé les
  rotations du site. Une question d'inspection ne doit pas emprunter la forme
  d'une question de choix.
- **La carte des orbites tournait toute seule** — `vue.azim += dt*0.05`, ajouté
  par moi. Elle fabriquait un déplacement du vaisseau qui n'existe pas. Retiré,
  gardé par `VERIF.carteFixe()`.
- **Trois défauts de mes propres contrôles sont sortis en chemin** : un contrôle
  qui n'exerçait rien, une bande de mesure en pixels durs qui rendait `couture()`
  dépendante de la taille de la fenêtre — et qui aurait menti précisément sur un
  téléphone — et un témoin posé sur le bord de l'ombre, qui n'est pas une
  colonne mais une rampe.
- **`VOYAGE.etat(d, τ)`** — la position, les deux horloges, β, γ et la phase à
  chaque instant du vol. 54 contrôles dans `outil-verif-voyage.js`, qui a trouvé
  au passage une annulation catastrophique vieille de plusieurs semaines dans
  `trajet()` et `enChemin()`.
- **Le cliquet de taille descend** de 4 310 à 4 298 lignes.

**Chantier ouvert, et il est gros : refaire la partie voyage.** Cinq points,
détaillés dans `A-REGARDER.md`. La fondation est posée ; le reste s'y branche.

État à la fin de la journée : 86 contrôles dans la page, 13 outils hors
navigateur, tout au vert. Séance de jugement vide — rien à faire juger tant que
le voyage n'est pas refait.
