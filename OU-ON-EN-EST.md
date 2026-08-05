# Où on en est

Carnet de situation, au 5 août 2026. Le site est en ligne, en français et en
anglais, et il se vérifie tout seul.

---

## Ce qui a changé de nature

Jusqu'ici, chaque avancée coûtait une séance de vérification à la main. Quand
personne ne pouvait regarder — Hugo sans son ordinateur, la vignette du
navigateur non affichée de mon côté — le projet s'arrêtait.

**Ce n'est plus vrai.** `verif.js` fait cinquante-cinq contrôles en une passe et
se charge d'un `?verif` dans l'adresse. Il a été éprouvé en cassant volontairement
cinq choses, qu'il a toutes vues : un test qui n'échoue jamais ne teste rien.

C'est le seul changement de cette séance qui compte vraiment. Les autres en
découlent.

---

## Ce qui est en production

**Le voyage.** Le télescope est un lieu : on s'y met, on choisit une destination,
le vaisseau part. La pièce s'assombrit en quittant sa source de lumière, le
quadrillage prouve qu'on bouge, et à l'arrivée dix orbites d'étoiles tournent
autour d'un point vide. Le retour ramène en orbite.

**Le système solaire, refusé.** On peut le demander ; le télescope répond avec
le prix — vingt ans à bord, vingt-sept mille au loin, et 780 000 tonnes de
carburant par kilo arrivé. C'est plus honnête qu'un voyage offert sans son prix.

**Le trou noir d'étude**, distinct de Sagittarius A*, où les hypothèses sont
chez elles. **Le carnet de bord**, qui accumule l'avance prise sur ceux qui sont
restés. **La note de la rédaction**, treize points classés en trois : ce qu'on a
écarté exprès, ce que personne ne sait, ce que notre calcul fait mal.

**Le bilingue est complet** : 215 clés, contenu, unités, ponctuation des nombres
et conventions régionales.

**Deux optimisations mesurées.** Les écrans de bord sont passés de 0,417 ms à
0,069 ; et l'on ne lance plus de rayons derrière la coque du vaisseau — 22,8 %
de l'écran à calculer face à la baie, zéro ailleurs.

---

## Les erreurs sorties, et comment

Aucune n'était visible à l'œil. Toutes sont venues d'un calcul qui a refusé
d'arrondir.

| l'erreur | ce qui l'a trouvée |
|---|---|
| **758 000 tonnes** de carburant, quand la fiche voisine en disait 780 000 | la remise à plat du carnet : même formule, distance abandonnée |
| **`arctan` au lieu d'`arcsin`** pour le diamètre apparent d'une sphère | le contrôle numérique du module lunaire |
| **Le Soleil n'a pas de diamètre apparent** à la distance de la Lune — son rayon vaut 1,81 fois cette distance, la Terre serait dedans | le même, en trouvant `arcsin` hors domaine |
| **√(1 − 1/16)** pour la cadence du temps, formule de l'observateur immobile alors qu'on orbite | la relecture du carnet, contre ses propres chiffres cités vingt lignes plus loin |
| **Lumen ne parlait jamais sur téléphone** — une règle masquait son conteneur, et la bulle vit dedans | la mesure de l'élément qui reçoit le toucher |
| **Le ciel s'éteignait** au loin, parce que je croyais le lanceur de rayons devenu inutile | la lecture des pixels : il rendait toujours la nébuleuse |
| **Cinq boutons de vingt pixels**, dont trois croix de fermeture | le harnais, premier passage |

---

## Les fondations

**F1 est fait.** Un seul `lieu` remplace les drapeaux qui s'excluaient deux à
deux. Être à deux endroits est devenu impossible à écrire au lieu d'être
interdit si l'on y pense. Prouvé par non-régression : le harnais rend le même
verdict qu'avant.

**F2 reste** — découper le bloc de 3 500 lignes. Trois fonctions en sont déjà
sorties. Aucun effet visible, donc ce chantier ne se fera jamais « quand on aura
le temps » : il faut le décider.

**F3 est fait**, hors du site : `ncorps.js`, gravitation mutuelle, symplectique,
63 contrôles. Les ordres de convergence mesurés valent 2,0002 et 3,9998. Sur un
million de pas, il oscille sans dériver là où un Runge-Kutta témoin dérive de
4,6 × 10⁻³.

Reste à le brancher — ce qui débloque poser une planète, les résonances, la
dislocation d'une lune et la formation d'un anneau.

---

## Les modules écrits et pas encore branchés

- `ncorps.js` — la gravitation à N corps
- `lune.js` — remplacer la Lune depuis la Terre
- `echelle.js` — dix-sept décades, du rayon de Schwarzschild à l'univers
  observable. Il posait le même nom global que le voyage à 1 g : une mine
  désamorcée avant qu'elle ne saute.

---

## Ce qui vient

1. **Brancher `ncorps.js`** — c'est ce qui a le plus de conséquences.
2. **F2**, la découpe. Le premier morceau est la physique : une fois dans son
   fichier, le banc d'essai devient exécutable sans navigateur.
3. **Le protocole de test joué**, dans le site : une adresse `?test` qui déroule
   une piste, coche ce qui se contrôle seul, et pose les questions de jugement
   au moment exact où l'on vient de vivre la chose.
4. **Le panthéon**, chargé mais débranché depuis un moment. Cinq idées en
   dépendent.
5. **Sourcer les constantes de `ncorps.js`**, recopiées de mémoire — justes à
   10⁻³, mais la règle du dépôt veut une source.

Ce qui attend des yeux est dans `A-REGARDER.md`, et rien n'y bloque.
