# Périastre

*Périastre* : le point d'une orbite où l'on passe au plus près.

Un site pour comprendre Sagittarius A*, le trou noir supermassif au centre de
notre galaxie. L'image n'est pas une illustration : c'est une intégration des
géodésiques de la relativité générale, pixel par pixel, en temps réel.

Trois niveaux de lecture, du néophyte complet à l'astrophysicien.

## Ce qui est calculé, et ce qui ne l'est pas

**Exact.** Le rendu intègre les géodésiques nulles de Schwarzschild sous forme
cartésienne `a = −(3/2)h²r/r⁵` (h = |r × ṙ|), équivalente à l'équation de Binet
`d²u/dφ² + u = 3Mu²`. Rien n'est peint à la main : la sphère des photons, l'ombre,
les images d'ordre supérieur et le disque replié par-dessus le trou noir sont des
conséquences du calcul.

Le site embarque son propre banc d'essai — bouton **« Pourquoi c'est exact ? »**,
puis **« Vérifier le moteur »**. Il rejoue les mêmes équations et compare aux
valeurs analytiques :

| grandeur | théorie | mesuré | écart |
|---|---|---|---|
| Sphère des photons | 1,5 r<sub>s</sub> | 1,500033 | 0,002 % |
| Rayon de l'ombre | 2,598076 r<sub>s</sub> | 2,598070 | 0,0002 % |
| Déflexion (b = 1000) | 0,002 rad | 0,002003 | 0,148 % |
| Dernière orbite stable | 3 r<sub>s</sub> | 3,00223 | 0,074 % |

L'écart sur la déflexion n'est pas une erreur : `4M/b` n'est que le premier ordre,
et le décalage mesuré vaut exactement le terme suivant, `15πM²/4b²`.

**Approximé, et assumé.** Métrique statique — pas de spin, donc ni frame-dragging
ni ergosphère. Disque géométriquement mince, émissivité posée à la main, sans
transfert radiatif. Doppler sans le facteur γ. Les détails sont dans le site,
au niveau « Astrophysicien ».

## Organisation

    index.html      rendu, simulation, interface
    physique.js     géodésiques, orbites, les quatre repères du banc
    vol.js          sondes et photons : leur avenir, leur avancée, leur fin
    temps.js        l'horloge — un seul écrivain, garanti par la structure
    arpente.js      marcher dans la pièce : sol, meubles, collisions
    contrat.js      ce qu'une information doit porter pour entrer
    contenu.js      source de vérité : textes, sources, répliques de Lumen
    voix/           MP3 pré-synthétisés, un dossier par voix
    outils/         génération de la voix
    SOURCES.md      audit des affirmations et de leurs références
    IDEES.md        carnet : ce qui est fait, ce qui reste

Aucune affirmation factuelle ne doit exister ailleurs que dans `contenu.js`, et
chacune porte ses clés de sources.

## Vérifier

Rien ici ne demande un œil humain. C'est délibéré : tant que la vérification
dépendait de quelqu'un qui regarde, le projet n'avançait qu'en sa présence.

**Sans navigateur** — les modules de physique ne touchent ni au document ni à
WebGL, donc ils s'exécutent en ligne de commande. Chacun sort en code 0 ou 1.

```bash
node outil-banc.js          # sphère des photons, ombre, déflexion, ISCO
node outil-verif-vol.js     # invariants, précession du périastre, l'horizon
node outil-verif-arpente.js # marcher dans la pièce : parois, meubles, rampe, saut
node outil-verif-contenu.js # le contrat : sources, liens, parité des deux langues
node outil-verif-ncorps.js  # énergie, moment cinétique, résonances, Roche
node outil-verif-lune.js    # la Lune remplacée : tangentes, diamètres apparents
node outil-verif-etoiles.js # les orbites des étoiles S
```

Le banc compare à **deux** choses, et la distinction est le sujet : la théorie,
qui ne bougera jamais, et les valeurs mesurées publiées plus bas, qui bougent si
le moteur change. La première dit « le calcul est juste », la seconde dit « le
calcul n'a pas changé ».

**Dans la page** — ce qui a besoin du rendu, du DOM ou d'une vraie boucle.

    ?verif    cinquante contrôles : le bloc de script vit, aucune clé nue,
              aucun pixel non peint, les zones tactiles sont atteignables,
              le temps avance à la vitesse demandée, le budget d'image tient.
              VERIF.sain() ne casse rien ; VERIF.tout() va jusqu'au parcours.

    ?test     le protocole joué. Il coche seul tout ce qui se contrôle et ne
              pose que les cinq questions qu'une machine ne peut pas trancher,
              au moment où la chose vient d'être vécue. Rend un Markdown.

    ?juge     la séance de jugement. Huit décisions qu'aucun calcul ne tranche —
              est-ce beau, est-ce lisible, LAQUELLE des trois. Elle va chercher
              la chose et la pose sous les yeux ; là où il y a des options,
              elles se comparent en direct sur la même vue. Rend un message
              écrit pour Claude, prêt à coller.

Un contrôle qui ne peut pas échouer ne contrôle rien : chacun a été éprouvé en
cassant volontairement ce qu'il surveille.

## Régénérer la voix

Les répliques de la mascotte sont scriptées, donc synthétisées une fois hors ligne
plutôt qu'à la volée : pas de clé d'API, pas de serveur, et la même voix pour tout
le monde quel que soit son système.

```bash
pip install edge-tts
python outils/voix.py          # ne régénère que ce qui manque
python outils/voix.py --tout   # tout refaire
```

Les `id` de `contenu.js` sont les noms des fichiers audio : les renommer sans
régénérer rend la réplique muette.

## Développement

Le site est entièrement statique. Il suffit de le servir :

```bash
python -m http.server 8765
```

WebGL2 requis.

### Avant chaque publication

```bash
node outils/version.mjs
```

GitHub Pages sert ses fichiers avec « garde ça dix minutes ». Le navigateur
obéit, et une correction déployée reste **invisible** : on recharge, on ne voit
rien, on conclut que rien n'a été poussé. C'est arrivé six fois en une journée,
et une fois le cache a même rendu un « tout va bien » sur une page qui ne
contenait pas le module qu'on venait d'écrire — une vérification faussement
rassurante, ce qui est pire qu'une vérification en échec.

Ce script réécrit le `?v=` de chaque script local avec le commit courant. Une
adresse qui change est une adresse que le cache ne connaît pas.
