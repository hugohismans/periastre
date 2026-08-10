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

**Dernière remise à plat de `cap.html` : 10 août 2026.**

---

## 10 août 2026 — le plan du système solaire, et sa première marche

Hugo : « fais-moi un plan à partir de ce cap », avec un élément à lui —
« j'aimerais bien qu'on puisse voir le système solaire bientôt ». Il a tranché
**d'abord la vue de loin, puis la Terre**, et **regarder devant/derrière dans le
même lot**.

**Trois défauts sont sortis en écrivant le plan**, aucun n'était cherché.

1. **Le voyage ne savait pas où il arrivait.** `d.id` existait depuis le premier
   jour de la table des destinations et n'était lu nulle part. On partait
   vingt-sept mille années-lumière pour le système solaire et l'on arrivait
   devant les dix orbites du centre galactique — **à la même taille apparente**
   qu'à l'arrivée aux étoiles S, puisque `ETOILES_S.cadre` pose
   `échelle = arrivée / distance` et atteint donc la taille un à toute arrivée.
   Sept millions de fois trop grandes. Et le pied du panneau écrivait « le trou
   noir est là, au centre » à qui venait de s'en éloigner.
2. **Le rythme qu'il a jugé n'est pas celui que le site joue.** `poseRythme`
   n'est appelé que par la séance et les outils : le bouton demandé le 7 août n'a
   jamais été posé, et le jeu tourne sur le défaut `fidele`. Mesuré sur le vrai
   trajet de 33,7 s — **3,93 décades sur 9,10 dans la première seconde**, puis
   onze secondes d'écran figé. Et `contenu.js` avoue déjà ce réglage : le site
   annonce un bouton qui n'existe pas.
3. **On lui ramène la tête vers le trou noir pendant tout le vol.** `recentre`
   tire la visée vers l'astre à chaque image, sans condition. Sa demande du
   9 août n'est pas d'abord une affaire de vitres.

**Étape 1 faite : le voyage sait où il arrive.** La décision est une **donnée**
portée par la destination (`carte:`) et non un test dans le rendu — c'est ce qui
permet de la vérifier sans lire une ligne de dessin. Un pied de panneau par
destination, dans les deux langues. Le lieu d'aveu `arrivee` s'est dédoublé, pour
que l'aveu de la carte des étoiles ne se pose plus là où cette carte ne se montre
pas. `poseArrivee` reçoit enfin la destination, au lieu d'un calcul qu'il
n'ouvrait jamais sous deux formes d'argument différentes.

Deux contrôles, et **les deux savent échouer** : `outil-verif-arrivee.js`
(9 contrôles, cinq sabotages dont celui de sa propre découpe) et
`VERIF.arriveeJuste()` dans la page. Le second est différentiel et joue la **même
mesure sur deux destinations** — 59 008 pixels ajoutés aux étoiles S, −28 au
système solaire. Éprouvé en remettant le défaut dans un navigateur : le système
solaire passe à 57 998 et il rougit.

Le plafond de taille monte de 3 821 à 3 865, et **c'est la première fois qu'il
monte pour réparer une chose fausse** plutôt que pour en ajouter une.

## 10 août 2026 — la remise à plat du cap

Hugo a perdu le fil des conversations et a demandé le contexte complet. Deux
journées de travail — le 8 et le 9 — n'étaient écrites nulle part sauf dans les
messages de commit : c'est exactement le cas que la règle prévoit. Journal
rattrapé ci-dessous, `cap.html` remis d'aplomb.

État relevé ce jour-là : **38 outils, 1 654 contrôles hors navigateur, aucun
échec**. 117 contrôles dans la page. La file de `?juge` est vide.

---

## 9 août 2026

Grosse journée. Elle a fermé P2 et ouvert P3.

- **Le ciel de là-bas, sourcé** — huit références vérifiées, fiche à trois
  niveaux, deux langues. La réponse déborde la question : **il n'y fait jamais
  nuit** (le fond intégré pèse des centaines de pleines lunes), la vraie
  nébulosité a une forme (trois bras ionisés, un anneau opaque), et la poussière
  qui nous cache le centre est de notre côté. Notre fond noir est donc faux en
  soi, pas seulement mal peuplé. C'est la case 2.7, et elle appartient à Hugo.
- **L'aveu dénonçait une nébuleuse que la bascule venait d'éteindre.** Défaut de
  ma main, en ligne depuis la veille. Un aveu peut désormais porter `selonMode` :
  en cinéma il dit ce que le mode ajoute, en simulation ce qui reste faux une
  fois la nébuleuse éteinte. *Un aveu faux est pire qu'un aveu absent — il apprend
  à ne plus les lire.*
- **Le choix du rendu se pose au premier passage**, à côté de la langue, une
  seule fabrique pour les deux sélecteurs.
- **P2 est close sauf 2.7.** Deux séances, sept questions, sept verdicts.
- **P3 s'ouvre.** Le quadrillage sait dire les années-lumière, dans les deux
  langues — il écrivait « une case = 1 000 UA » en dur, en français, pendant tout
  le trajet d'un lecteur anglais. Table `DESTINATIONS` morte supprimée : deux
  vérités pour une chose, dont une fausse et invisible.
- **On part pour le système solaire.** La destination était refusée avec son prix
  pour toute réponse ; la leçon était dans le chiffre, pas dans le refus. Le prix
  reste sur la carte, sur sa propre ligne. La durée d'écran suit la longueur du
  trajet.
- **Deux formats trouvés en chemin** : « 26998 ans » sans espace de milliers — le
  chiffre le plus frappant du site — et « c − 4.1·10^-4 » avec un point décimal
  anglais en français.
- **La page ne savait pas qu'elle était vieille.** L'estampille protège les
  scripts, pas `index.html`, servi avec dix minutes de cache. Un visiteur déjà
  venu recevait l'ancien site en croyant avoir rechargé, sans aucun geste pour
  s'en sortir sur téléphone. `frais.js` : 22 contrôles, dont la moitié sur les cas
  où il ne doit **rien** faire — ici le faux positif est le danger.
- **L'aberration relativiste** — demandée le matin. Direction, couleur, éclat en
  D⁴, 19 contrôles dont la réciprocité des deux sens, celle qui attrape l'erreur
  de signe. Pas branchée au nuanceur : ce qui reste est de l'image, pas du calcul.
- **La séance ne ramenait pas le vaisseau à son orbite** — signalé par Hugo. On
  repartait du système solaire pour le système solaire : trajet nul, écran figé.
  Le défaut dormait depuis toujours ; c'est le fait de **rejouer** qui l'a
  réveillé.
- **Le voyage jugé « ça va »**, et sa remarque vaut plus que le verdict : il ne
  sentait pas la moitié d'accélération et la moitié de freinage. Il a raison, et
  c'est le **temps d'écran** qui ment — 28 secondes à accélérer, 6 à freiner. Le
  remède demande quelque chose vers quoi s'approcher : le système solaire vu de
  loin. Les deux ne font qu'un chantier, et c'est le suivant.

## 8 août 2026

- **La rotation devient un curseur**, comme demandé — le continuum était le sujet,
  quatre boutons n'en donnaient que quatre points. La borne 0,998 est un fait
  (limite de Thorne, 1974), pas un arrondi de confort. On n'enregistre qu'au
  relâchement : la leçon du 7 août, où une écriture en mémoire avait divisé par
  huit la cadence de son téléphone.
- **Cinq verdicts rayés** de la séance du soir.
- **La descente au périastre commence.** Les fondations étaient l'apoastre — loin,
  lent, à consolider ; maintenant le passage au plus près. Cinq chantiers, et le
  hook lit la liste.
- **P1 — le carnet du voyageur.** Les deux horloges du salon étaient calculées,
  montrées, puis jetées à la sortie. Elles s'inscrivent : *« Depuis ta première
  mission, tu as vécu 57 min — la Terre a vécu 1,0 h. »* Un vrai passage
  s'inscrit, un coup d'œil non.
- **P2 s'ouvre : la nébuleuse passe sous commande** — simulation ou cinéma. Le
  défaut reste « cinéma » : changer l'image sous les pieds de qui n'a rien demandé
  serait traiter le visiteur comme un argument.
- **Un angle mort dans l'outil de l'ordre, et il a mordu.** Une fonction déclarée
  est hissée : appelée depuis le sommet, tout ce que son corps lit devient mortel,
  et l'outil comptait ça comme inoffensif. Réparé le lendemain — il suit
  maintenant les appels, et il a trouvé du premier coup que **le lien de test de
  la touche C ne restaurait rien**.

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

### Le voyage refait, dans la foulée

- **La carte passe dehors.** Découpée aux trois vitres, projetées avec la caméra
  de la pièce. Mesuré par différence : elle ajoute 2 544 pixels dans la baie et
  zéro dehors.
- **Sa taille suit la distance** — 6 au départ, 1 à l'arrivée, interpolé en
  logarithme. Pas une perspective, et c'est déclaré.
- **Les traces se voient dès le départ**, le voile reste à l'arrivée.
- **Le « pop » avait une cause** : le recul s'arrête avant que le voile ne monte,
  et les traces retombaient à zéro dans l'intervalle. Chute maximale entre deux
  images après correction : **zéro**.
- **Le bandeau de vol** — vitesse en fraction de c, dilatation, distance
  parcourue, phase. Les chiffres viennent de la **position**, pas du temps
  d'écran.
- **J'ai fait fausse route d'abord** en faisant suivre à la position le vrai
  profil relativiste : fidèle, et mauvais — 2,7 décades dans la première moitié
  de l'animation, 0,3 dans la seconde. `outil-verif-recul.js` l'a refusé.
- **Le plafond de taille monte deux fois**, 4 298 → 4 343. Première hausse
  depuis sa création, justifiée par écrit. La marge est consommée.

**90 contrôles dans la page, 13 outils.** Séance de jugement remplie : trois
questions sur le voyage refait.

État à la fin de la journée : 86 contrôles dans la page, 13 outils hors
navigateur, tout au vert. Séance de jugement vide — rien à faire juger tant que
le voyage n'est pas refait.
