# Périastre

Simulateur pédagogique de Sagittarius A*, en WebGL, français et anglais.
Statique, sans dépendance, en ligne sur **https://hugohismans.github.io/periastre/**.

Rien n'est importé : les images sont calculées à partir des équations d'Einstein.
C'est la promesse du site, et elle contraint tout le reste.

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
4. **Un contrôle maîtrise l'état d'où il mesure, et le vérifie avant de conclure.**
   `couture()` réglait la caméra à 0,54 et l'ouverture cinématique la remettait à
   1,05 sans rien dire : il mesurait un travelling depuis un point de vue qu'il
   n'avait pas choisi. Le piège se referme sur soi — en rejouant le contrôle à la
   main, les neuf secondes d'animation sont écoulées et tout paraît normal. Un
   contrôle d'accord avec lui-même seulement quand on l'observe est un contrôle
   qui ment.
5. **Aucune affirmation factuelle hors de `contenu.js`**, et chacune porte ses
   clés de sources. `node outil-verif-contenu.js` refuse le reste.
6. **Jamais de valeur recopiée de mémoire.** On la dérive d'une source, ou on la
   relève et on l'écrit dans un fichier de sources.
7. **Git** : travailler sur `dev`, fusionner sur `main` en avance rapide.
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
node outil-verif-contenu.js  # le contrat : sources, liens, parité fr/en
```

Ou tout d'un coup, ce qui évite d'avoir à connaître la liste :

```bash
node tout.js
```

Dans la page : `?verif` puis `VERIF.sain()` — 81 contrôles. `?test` le protocole
joué, `?juge` la séance de jugement.

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

Le gros de l'application est encore dans `index.html`. Le chantier **F2** en
extrait des domaines un par un ; quatre sont sortis.

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
| `contenu.js` / `.en.js` | **la seule source de vérité factuelle** |
| `ncorps.js`, `lune.js`, `echelle.js` | écrits, éprouvés, **pas encore branchés** |

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

---

## Où ça en est

**Fait :** la vérification sans humain, le sourçage, le bilingue, le voyage,
la carte des étoiles, quatre tranches de F2.

**Ouvert, et tranché par personne :**
- **Une nouvelle aile du vaisseau** avec la salle de tir balistique. C'est la
  demande d'Hugo : « agrandir le vaisseau, mettre le canon dans une nouvelle
  salle ». `vol.js` fait déjà toute la mécanique.
- Le quadrillage du recul doit se lire **en volume**, pas à plat. Dit deux fois.
- La carte des étoiles : « le rendu n'est vraiment pas bon », et le lien avec la
  vitesse du temps n'est pas clair. À rediscuter.
- L'arrivée du voyage n'est pas fluide.
- Le scintillement des étoiles : encore de petits clignotements.
- L'anglais n'a jamais été relu par quelqu'un dont c'est la langue.

`A-REGARDER.md` tient la file de ce qui attend des yeux.
`IDEES.md` contient plus d'idées que le projet ne peut en absorber — il faut en
tuer, et c'est à Hugo de le faire.

**Le déséquilibre à corriger :** beaucoup de vérification, peu de jeu neuf. Le
site vérifie magnifiquement une boucle de jeu qui reste mince.
