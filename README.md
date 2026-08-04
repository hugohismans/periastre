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
    contenu.js      source de vérité : textes, sources, répliques de Lumen
    voix/           MP3 pré-synthétisés, un dossier par voix
    outils/         génération de la voix
    SOURCES.md      audit des affirmations et de leurs références
    IDEES.md        carnet : ce qui est fait, ce qui reste

Aucune affirmation factuelle ne doit exister ailleurs que dans `contenu.js`, et
chacune porte ses clés de sources.

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
