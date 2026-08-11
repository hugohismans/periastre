# Périastre

Simulateur pédagogique de Sagittarius A*, en WebGL, français et anglais.
Statique, sans dépendance, en ligne sur **https://hugohismans.github.io/periastre/**.

**L'image du trou noir** est calculée à partir des équations d'Einstein — la
déviation, l'ombre, la sphère des photons, le disque. C'est la promesse du site,
et elle contraint tout ce qui touche au trou noir.

**Elle ne s'étend pas au reste du ciel.** Amendé par Hugo le 11 août 2026, devant
un Jupiter dessiné à la main qu'il a jugé « une merde orange » : *« tu ne
t'acharnes pas trop avec cette promesse de tout est calculé, si on importe des
trucs, aussi bien. »* Une carte photographique d'une planète est une OBSERVATION,
au même titre que les rayons et les masses du JPL que le site importe déjà — et
elle est plus honnête qu'un motif que j'ai inventé, qui est le seul genre de
chose au monde à n'avoir aucune source. Ce qui est importé porte donc ses
références comme tout le reste, et rien de plus n'est exigé de lui.

---

## Comment on travaille — à lire avant tout

**Hugo n'est pas le développeur.** Il délègue l'architecture et la technique. Il
apporte l'intention, les idées, et son œil. Il parle en vocal, de façon fluide et
spontanée ; la transcription est parfois cassée — demander plutôt que deviner.

**Ne lui parle pas technique.** Il l'a demandé explicitement. Dis ce que ça change
pour le site, pas comment c'est écrit. Les détails techniques ne viennent que
s'il les demande.

**Ce qu'il peut faire et que personne d'autre ne peut :** regarder. C'est la
seule ressource rare du projet. Ne jamais lui faire vérifier ce qu'un calcul
vérifie mieux, et ne jamais lui poser une question sur une chose qu'on ne lui
montre pas.

**La boucle de test.** `?juge` le met dans le vaisseau, pose une question,
recueille un commentaire libre, et rend **un message écrit pour Claude** qu'il
colle dans la conversation. Le champ doit rester large : il écrit des phrases.
Le bouton « la question elle-même ne va pas » existe parce que la moitié des
défauts trouvés étaient dans mes questions.

**Il faut lui dire d'arrêter.** Signale-lui quand tu t'entêtes sur quelque chose
que son œil trancherait en trois secondes.

---

## Les règles dures

1. **Tout défaut trouvé à l'œil devient un contrôle.** Sans exception. Le disque
   à 622×, les orbites de S14, la barre d'espace : chacun a laissé un test
   derrière lui.
2. **Un contrôle doit pouvoir échouer**, et on le prouve en cassant volontairement
   ce qu'il surveille. Un test qui n'échoue jamais ne teste rien.
3. **Un contrôle tire sa vérité d'ailleurs que de ce qu'il contrôle.** Deux fois
   je me suis fait avoir par un test qui s'adaptait au tableau qu'on lui donnait.
4. **C'est une SIMULATION, pas une animation.** Aucune loi inventée, aucune
   approximation exagérée, jamais une courbe choisie « parce qu'elle est jolie ».
   Un gros compromis pour la performance peut s'entendre — il se déclare alors
   dans `contrat.js`, avec son lieu et son aveu. Mais entre deux objets qui
   décrivent le même espace il ne peut y avoir **qu'une seule loi** : le
   quadrillage et les orbites en ont eu deux pendant une soirée, et l'œil d'Hugo
   l'a vu avant que je le sache.

   Et sa règle du 7 août 2026, qui va avec : **« ce genre de questions, tu peux
   me les poser. N'hésite pas. »** Une hésitation entre le fidèle et le lisible
   ne se tranche pas seul — on la lui pose, avec l'outil à boutons, et l'on
   attend. Il l'a demandé explicitement, en notant que je ne le faisais pas assez.
5. **Un contrôle maîtrise l'état d'où il mesure, et le vérifie avant de conclure.**
   `couture()` réglait la caméra à 0,54 et l'ouverture cinématique la remettait à
   1,05 sans rien dire : il mesurait un travelling depuis un point de vue qu'il
   n'avait pas choisi. Le piège se referme sur soi — en rejouant le contrôle à la
   main, les neuf secondes d'animation sont écoulées et tout paraît normal. Un
   contrôle d'accord avec lui-même seulement quand on l'observe est un contrôle
   qui ment.
6. **Aucune affirmation factuelle hors de `contenu.js`**, et chacune porte ses
   clés de sources. `node outil-verif-contenu.js` refuse le reste.
7. **Jamais de valeur recopiée de mémoire.** On la dérive d'une source, ou on la
   relève et on l'écrit dans un fichier de sources.
8. **Git** : travailler sur `dev`, fusionner sur `main` en avance rapide.
   `node outils/version.mjs` avant chaque publication, sinon le cache de GitHub
   Pages rend la correction invisible pendant dix minutes.

---

## Vérifier

En ligne de commande, sans navigateur — tous sortent en code 0 ou 1 :

```bash
node outil-banc.js           # sphère des photons, ombre, déflexion, ISCO
node outil-verif-vol.js      # invariants, précession du périastre, l'horizon
node outil-verif-arpente.js  # marcher dans la pièce : parois, meubles, rampe
node outil-verif-etoiles.js  # les orbites S, contre une bissection arbitre
node outil-verif-ncorps.js   # énergie, moment cinétique, résonances, Roche
node outil-verif-lune.js     # la Lune remplacée
node outil-verif-terrelune.js # l'arrivée : la Terre et la Lune, la chute, le terminateur
node outil-verif-contenu.js  # le contrat : sources, liens, parité fr/en
```

Ou tout d'un coup, ce qui évite d'avoir à connaître la liste :

```bash
node tout.js
```

Ou tout d'un coup : **45 outils**, `node tout.js`.

Dans la page : `?verif` puis `VERIF.sain()`. `?test` le protocole joué, `?juge`
la séance de jugement.

---

## Le cap — ce qu'Hugo lit, lui

`cap.html` est sa feuille de route : le but du jeu, une ligne du temps, l'état
des fondations, les chantiers, ses propres idées, et une boîte à idées de mon
côté. Elle n'est liée depuis aucune page et porte `noindex`. Tous les autres
documents du dépôt sont écrits pour moi ; **celui-là est écrit pour lui**, et il
ne doit jamais devenir un dossier technique.

Elle ne se met **pas** à jour à chaque session — il l'a explicitement refusé, ce
serait trop lourd. À la place :

1. J'écris quelques lignes dans `JOURNAL-DE-BORD.md` en fin de session.
2. Quand ce fichier a assez grossi, ou qu'une direction change, je propose :
   **« on refait le cap ? »**
3. On remet `cap.html` d'aplomb, et la date en tête change.

Il peut aussi le déclencher lui-même : « on refait le cap ».

---

## Architecture

Le gros de l'application est encore dans `index.html`, **coupé en trois blocs**
depuis le 8 août 2026 : A (jusqu'à la physique), B (interface, lieux, panneaux),
C (dessins, boucle). Ils partagent la même portée — `verif.js` lit `salon`
depuis dehors — mais **un bloc qui meurt n'emporte plus les précédents**, et
`VERIF.vivant()` teste un témoin par bloc, donc il dit lequel est tombé.

Deux outils gardent ce découpage : `outil-verif-taille.js` compte la **somme**
des blocs (le maximum se truquerait en déplaçant une frontière) et
`outil-verif-ordre.js` refuse toute inversion armée et fait descendre le compte
des inversions différées. **F2 est clos** — quarante-neuf domaines sortis, chacun
avec son outil ; ce qui reste dans `index.html` est du rendu et de l'orchestration.

| fichier | ce qu'il tient |
|---|---|
| `index.html` | rendu, interface, orchestration — encore trop gros |
| `physique.js` | géodésiques, orbites, les repères du banc |
| `vol.js` | sondes et photons : avenir calculé au départ, avancée, fin |
| `temps.js` | l'horloge — **un seul écrivain, garanti par la structure** |
| `arpente.js` | marcher dans la pièce : sol, meubles, collisions |
| `contrat.js` | ce qu'une information doit porter pour entrer |
| `vaisseau.js` | la géométrie du salon, calculée |
| `etoiles.js` | les dix étoiles S et leur carte |
| `solaire.js` | le système solaire vu du dehors, et **le droit de nommer** |
| `etiquettes.js` | point du monde → étiquette. Sa première charge est de **se taire** |
| `approche.js` | on arrive dans le nuage de Oort, et on tombe |
| `lune.js` | les astres, leurs rayons sourcés, l'angle apparent en arcsin |
| `terrelune.js` | la dernière marche : la Terre et la Lune |
| `contenu.js` / `.en.js` | **la seule source de vérité factuelle** |
| `ncorps.js`, `echelle.js`, `aberration.js` | écrits, éprouvés, **pas encore branchés** — `node tout.js` dit pourquoi, un par un |
| `kerrschild.js` | **arbitre, jamais chargé** : il éprouve le nuanceur du dehors (règle 3) |

Les modules ne touchent ni au DOM ni à WebGL : c'est ce qui les rend vérifiables
sans navigateur.

---

## Les pièges déjà payés

- **Le cache.** GitHub Pages garde les fichiers dix minutes. Il m'a rendu un
  « 0 échec » sur une page qui ne contenait pas le module que je venais
  d'écrire. Les scripts portent maintenant un `?v=<commit>`.
- **PowerShell et l'UTF-8.** `Get-Content` sans encodage explicite lit l'UTF-8
  comme de l'ANSI et massacre les accents. Passer par Python avec `encoding="utf-8"`.
- **Les transitions CSS** ne s'exécutent pas sur une page non composée : une
  mesure de position y lit l'état de départ.
- **Deux écrivains pour une valeur** : la maladie qui a donné le disque à 622×.
  Se soigne comme la soupe de drapeaux — un seul état, en lecture seule dehors.
- **`VERIF.sain()` en entier ne passe pas dans les machines du nuage.** Elles
  n'ont pas de carte graphique : Chromium rend en logiciel, et la passe complète
  dépasse tous les délais — essayée à 2 min puis à 9, tuée les deux fois.
  `carteDehors` avance 1 100 images à lui seul. **Jouer les contrôles un par un**
  (`VERIF.resultats.length = 0; VERIF[nom]()`), en ne prenant que ceux que la
  modification peut atteindre ; `vivant` d'abord, il dit en secondes si un bloc
  est mort. Chromium : `executablePath: '/opt/pw-browsers/chromium'`, args
  `--use-gl=swiftshader --enable-unsafe-swiftshader`, et passer l'accueil par
  `p.evaluate` — un clic sur le sélecteur de langue recharge la page et détruit
  le contexte. Coûté une heure à deux sessions le 11 août, dont une qui a tourné
  en rond assez longtemps pour qu'Hugo le voie depuis son téléphone.
  **`node tout.js` est le filet principal, et il n'a pas besoin de navigateur** :
  les contrôles en page sont un complément, jamais une condition de publication.

---

## Où ça en est

**Relevé au 10 août 2026.** Cette section s'est périmée sans prévenir une fois —
elle réclamait le quadrillage en volume et l'arrivée du voyage, réglés depuis. La
tenir à jour au moment du cap, ou ne pas s'y fier.

**Fait :** la vérification sans humain, le sourçage, le bilingue, le voyage, la
carte des étoiles, F1 à F5, le carnet du voyageur, le mode simulation/cinéma, le
départ pour le système solaire — et **l'arrivée**, depuis le 11 août : on arrive
dans le nuage de Oort, où il n'y a rien à voir, on tombe jusqu'à ce que les noms
deviennent vrais, puis on continue jusqu'à **la Terre et la Lune**. Deux sessions
du même jour, et les deux mouvements se suivent : la scène solaire pose la chute,
`terrelune.js` en est la dernière marche. Le chantier courant est **la descente
au périastre** (`CHANTIER-P.md`), P1 et P2 clos, P3 presque clos — il ne reste
que le rythme.

**Ouvert, et tranché par personne :**
- **Le rythme du grand trajet**, qui se sent faux parce que l'animation passe
  28 s à accélérer et 6 à freiner. Il attendait qu'il y ait quelque chose vers
  quoi s'approcher : c'est fait depuis le 11 août, il n'attend plus rien.
- **L'aberration** est calculée et éprouvée (`aberration.js`), pas branchée au
  nuanceur : jusqu'où l'atténuer se décide en regardant.
- **Peindre le ciel de l'amas** — il n'y fait jamais nuit ; notre fond noir est
  faux en soi. Décision d'image, elle appartient à Hugo (P2.7).
- **Le vaisseau ne se déplace jamais** — le voyage est un diagramme, le salon
  reste à seize rayons. À l'arrivée au système solaire, la baie peignait encore
  le trou noir qu'on venait de quitter ; on la voile, et c'est le douzième
  compromis déclaré. Le jour où le vaisseau bouge vraiment, le voile tombe seul.
- **Le cadrage de l'arrivée** : quand on voit la Terre ET la Lune, la Terre fait
  vingt pixels — trente diamètres terrestres d'écart, aucune image ne peut les
  montrer gros à la fois. Fidèle, ou décalé pour doubler la Terre ? Posé dans
  `?juge` le 11 août, il attend son œil.
- **Une nouvelle aile du vaisseau** avec la salle de tir balistique. C'est la
  demande d'Hugo du 6 août : « agrandir le vaisseau, mettre le canon dans une
  nouvelle salle ». `vol.js` fait déjà toute la mécanique. (P4, P5)
- La réplique de Lumen au poste horaire — sa voix.
- Le manche de marche sur téléphone : plus on pousse loin, moins on va vite.
- Le scintillement des étoiles : encore de petits clignotements.
- L'anglais n'a jamais été relu par quelqu'un dont c'est la langue.

`A-REGARDER.md` tient la file de ce qui attend des yeux.
`IDEES.md` contient plus d'idées que le projet ne peut en absorber — il faut en
tuer, et c'est à Hugo de le faire.

**Le déséquilibre à corriger :** beaucoup de vérification, peu de jeu neuf. Le
site vérifie magnifiquement une boucle de jeu qui reste mince.
