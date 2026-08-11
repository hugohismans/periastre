# Les cartes de planètes

Ce dossier est **vide à dessein**. Il attend des photographies.

Hugo, le 11 août 2026, après deux tentatives de Jupiter dessiné à la main :
*« tu peux dire ce que tu veux, mais c'est super moche. Ce n'est pas
simulation, c'est juste vraiment moche. »* Puis : *« tu ne t'acharnes pas trop
avec cette promesse de tout est calculé, si on importe des trucs, aussi bien. »*

Il a raison sur les deux points. Le procédural ne montera pas au niveau voulu
quand une planète occupe tout l'écran : il faut du détail vrai sur toute la
surface, et du bruit n'en fabrique pas — il fabrique du flou. Et une carte
photographique est une **observation**, du même genre que les rayons et les
masses du JPL que le site dérive déjà. C'est le dessin fait à la main qui était
l'anomalie : le seul objet du site à n'avoir aucune source.

**Tout le chemin est câblé et éprouvé.** Il ne manque que les fichiers.

---

## Ce qu'il faut déposer

Une image par astre, en **projection cylindrique équidistante** — la longitude
en largeur, la latitude en hauteur, linéairement. C'est le format de toutes les
cartes planétaires publiées, on n'a donc rien à convertir.

| fichier attendu | astre |
|---|---|
| `cartes/jupiter.jpg` | Jupiter |
| `cartes/saturne.jpg` | Saturne |
| `cartes/mars.jpg` | Mars |
| `cartes/terre.jpg` | la Terre |
| `cartes/neptune.jpg` | Neptune |
| `cartes/lune.jpg` | la Lune |

Un astre sans carte est **dessiné** comme aujourd'hui, et la page l'avoue. Rien
ne casse si le dossier reste à moitié plein : on peut n'en déposer qu'une.

## Deux contraintes, et la première est un piège

**1. Les deux côtés doivent être des puissances de deux.** `1024×512` ou
`2048×1024`. C'est la contrainte de WebGL 1, et elle est brutale : une carte de
360×180 — un pixel par degré, la taille la plus naturelle du monde — donnait un
disque **entièrement noir**, sans message ni erreur. La page rattrape désormais
le cas, mais au prix d'une couture visible à la longitude 180°. Une image bien
dimensionnée n'a pas de couture.

**2. Le poids.** Ces images pèsent plus que tout le reste du site réuni.
`2048×1024` en JPEG de qualité moyenne suffit largement : à la taille où
Jupiter s'affiche, on ne distingue pas mieux. Le chargement est paresseux —
rien n'est téléchargé pour un astre qu'on ne regarde pas.

## Et la source, qui n'est pas optionnelle

Une carte n'entre pas sans **sa source et sa licence**. `RIVAGE.carteValide`
les exige, et huit affirmations d'`outil-verif-rivage.js` gardent cette
serrure — dont cinq refus et une contre-épreuve.

Ce n'est pas du formalisme. Une image qu'on n'a pas le droit de servir est un
défaut qui ne se voit sur **aucun écran** : seul un contrôle peut l'attraper.
Et une carte dont on ignore l'origine ne vaut pas mieux que le dessin qu'elle
remplace — on aurait troqué une invention contre un objet ramassé.

Les cartes du domaine public existent : la NASA et l'USGS en publient, et le
JPL sert déjà de source aux rayons et aux masses de ce site.

**Une fois les fichiers déposés, dire d'où ils viennent.** L'entrée se rédige
alors dans `RIVAGE.CARTES` :

```js
{ cle:"jupiter", fichier:"cartes/jupiter.jpg",
  source:"…d'où vient l'image, précisément…",
  licence:"…à quelles conditions on a le droit de la servir…" }
```

Et l'astre bascule du dessin à la photographie sans qu'on touche au nuanceur.
