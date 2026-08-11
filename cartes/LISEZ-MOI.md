# Les cartes de planètes

Ce dossier contient six photographies de surfaces planétaires. Elles ont
remplacé, le 11 août 2026, les motifs que j'avais dessinés à la main.

Hugo, après deux tentatives de Jupiter dessiné : *« tu peux dire ce que tu
veux, mais c'est super moche. Ce n'est pas simulation, c'est juste vraiment
moche. »* Puis : *« tu ne t'acharnes pas trop avec cette promesse de tout est
calculé, si on importe des trucs, aussi bien. »*

Il avait raison sur les deux points. Le procédural ne monte pas au niveau voulu
quand une planète occupe tout l'écran : il faut du détail vrai sur toute la
surface, et du bruit n'en fabrique pas — il fabrique du flou. Et une carte
photographique est une **observation**, du même genre que les rayons et les
masses du JPL que le site dérive déjà. C'est le dessin fait à la main qui était
l'anomalie : le seul objet du site à n'avoir aucune source.

---

## Ce qui est déposé

| fichier | astre | d'où elle vient |
|---|---|---|
| `jupiter.jpg` | Jupiter | Cassini (NASA/JPL/SSI), mosaïque PIA07782 |
| `mars.jpg` | Mars | Viking (USGS Astrogeology / NASA Ames), MDIM 2.1 colorisé |
| `terre.jpg` | la Terre | MODIS/Terra (NASA Earth Observatory), Blue Marble août 2004 |
| `lune.jpg` | la Lune | LRO (NASA Scientific Visualization Studio), CGI Moon Kit |
| `saturne.jpg` | Saturne | Solar System Scope, CC BY 4.0 |
| `neptune.jpg` | Neptune | Solar System Scope, CC BY 4.0 |

Toutes en **2048×1024**, toutes sous **400 Ko**, 1,3 Mo au total. La provenance
complète de chacune — mission, instrument, URL, licence — vit dans
`RIVAGE.CARTES`, dans `rivage.js`, et nulle part ailleurs.

**Quatre sur six sont des observations au sens plein.** Les deux autres ne le
sont qu'à moitié, et il faut le dire : aucune agence ne publie de carte globale
de Saturne ni de Neptune — ni Voyager ni Cassini n'en ont couvert la surface
entière —, et les seules cartes libres de droits pour ces deux-là sont des
textures dérivées d'imagerie NASA, aux couleurs retouchées et aux manques
comblés. C'est écrit en toutes lettres dans leur `source`.

**Ce qui a été écarté.** Les cartes de Björn Jónsson sont les meilleures qui
existent pour Saturne et Neptune. Sa page de conditions autorise leur usage
mais demande expressément qu'on n'en héberge pas de copie — un site statique ne
peut pas faire autrement. Elles sont donc refusées, malgré leur qualité.

---

## Pour en déposer une de plus

Une image en **projection cylindrique équidistante** — la longitude en largeur,
la latitude en hauteur, linéairement. C'est le format de toutes les cartes
planétaires publiées, on n'a donc rien à convertir.

Un astre sans carte est **dessiné** comme avant, et la page l'avoue à l'écran.
Rien ne casse si l'on en retire une.

### Deux contraintes, et la première est un piège

**1. Les deux côtés doivent être des puissances de deux.** `1024×512` ou
`2048×1024`. C'est la contrainte de WebGL 1, et elle est brutale : une carte de
360×180 — un pixel par degré, la taille la plus naturelle du monde — donnait un
disque **entièrement noir**, sans message ni erreur. La page rattrape désormais
le cas, mais au prix d'une couture visible à la longitude 180°.
`outil-verif-rivage.js` mesure maintenant les fichiers eux-mêmes et refuse le
cas tout court.

**2. Le poids.** Moins de 400 Ko par carte. À la taille où Jupiter s'affiche,
on ne distingue pas mieux. Le chargement est paresseux — rien n'est téléchargé
pour un astre qu'on ne regarde pas.

### Et la source, la licence, et le crédit à l'écran

```js
{ cle:"jupiter", fichier:"cartes/jupiter.jpg",
  credit:"…la ligne courte qui s'affiche dans la scène…",
  source:"…mission, instrument, auteur, URL — assez pour la retrouver…",
  licence:"…à quelles conditions on a le droit de la servir…" }
```

`RIVAGE.carteValide` exige la source et la licence ; l'outil exige en plus que
le crédit arrive **jusqu'à l'écran**, parce que deux de ces licences sont des
Creative Commons Attribution : le droit de servir l'image est conditionnel, et
la condition est de citer l'auteur. Une citation enfouie dans un fichier de
code n'en est pas une.

Ce n'est pas du formalisme. Une image qu'on n'a pas le droit de servir est un
défaut qui ne se voit sur **aucun écran** : seul un contrôle peut l'attraper.
Et une carte dont on ignore l'origine ne vaudrait pas mieux que le dessin
qu'elle remplace — on aurait troqué une invention contre un objet ramassé.

**Aller LIRE la page de licence, ne jamais la deviner.** C'est la règle 7 du
projet appliquée aux pixels : aucune valeur recopiée de mémoire.
