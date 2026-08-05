# Où on en est

Carnet de situation, au 5 août 2026. Le site est en ligne, en français et en
anglais, et il se vérifie tout seul.

---

## Ce qui a changé de nature

Jusqu'ici, chaque avancée coûtait une séance de vérification à la main. Quand
personne ne pouvait regarder — Hugo sans son téléphone, la vignette du navigateur
non affichée de mon côté — le projet s'arrêtait.

**Ce n'est plus vrai.** Il y a maintenant deux harnais en page et cinq outils en
ligne de commande :

| ce qui vérifie | où | combien |
|---|---|---|
| `?verif` | dans la page | 62 contrôles |
| `?test` | dans la page | 5 questions de jugement, posées sur le vif |
| `outil-banc.js` | Node | 5 |
| `outil-verif-vol.js` | Node | 30 |
| `outil-verif-ncorps.js` | Node | 63 |
| `outil-verif-lune.js` | Node | 58 |
| `outil-verif-etoiles.js` | Node | — |

Chacun a été éprouvé en cassant volontairement ce qu'il surveille : **un test qui
n'échoue jamais ne teste rien.** Et `PROTOCOLE-TEST.md` est là pour ce qu'aucun
d'eux ne peut faire — le donner à quelqu'un qui a un autre téléphone.

C'est le seul changement qui compte vraiment. Les autres en découlent.

---

## La règle qui s'est imposée

**Tout défaut trouvé à l'œil devient un contrôle.**

Elle vient d'un cas précis. Le disque d'accrétion tournait *six cent vingt-deux
fois trop vite* en temps réel, et c'est Hugo qui l'a vu en jouant. Or aucun œil
ne peut vérifier un facteur de temps — on ne sait pas si un gaz tourne six cents
fois trop vite en le regardant, on le soupçonne. Une horloge, elle, se compare.

Le défaut a été corrigé, puis huit contrôles ont été ajoutés pour qu'il ne
revienne pas. En les éprouvant — en réinjectant le bug — l'un d'eux affiche
« rapport 601 », sa signature exacte.

Deux autres cas ont suivi la même règle dans la foulée : les ralentissements
signalés sur iPhone, et la profondeur de l'échelle de résolution.

---

## Ce qui est en production

**Le voyage.** Le télescope est un lieu : on s'y met, on choisit une destination,
le vaisseau part. La pièce s'assombrit en quittant sa source de lumière, le
quadrillage prouve qu'on bouge, et à l'arrivée dix orbites d'étoiles tournent
autour d'un point vide. Le retour ramène en orbite.

**Le système solaire, refusé.** On peut le demander ; le télescope répond avec le
prix — vingt ans à bord, vingt-sept mille au loin, et 780 000 tonnes de carburant
par kilo arrivé. C'est plus honnête qu'un voyage offert sans son prix.

**Le trou noir d'étude**, distinct de Sagittarius A*, où les hypothèses sont chez
elles. **Le carnet de bord**, qui accumule l'avance prise sur ceux qui sont
restés. **La note de la rédaction**, quinze points classés en trois : ce qu'on a
écarté exprès, ce que personne ne sait, ce que notre calcul fait mal.

**Le bilingue est complet** : 215 clés, contenu, unités, ponctuation des nombres
et conventions régionales.

**Trois optimisations mesurées.** Les écrans de bord sont passés de 0,417 ms à
0,069 ; on ne lance plus de rayons derrière la coque du vaisseau — 22,8 % de
l'écran à calculer face à la baie, zéro ailleurs ; et la résolution adaptative a
cinq paliers au lieu de deux, avec une première réaction en vingt-quatre images
au lieu de quatre-vingt-dix.

---

## Les erreurs sorties, et comment

Aucune n'était visible à l'œil. Toutes sont venues d'un calcul qui a refusé
d'arrondir.

| l'erreur | ce qui l'a trouvée |
|---|---|
| **Le disque tournait 622 fois trop vite** en temps réel : deux mécanismes écrivaient la même horloge | l'œil d'Hugo, puis une mesure image par image |
| **758 000 tonnes** de carburant, quand la fiche voisine en disait 780 000 | la remise à plat du carnet : même formule, distance abandonnée |
| **`arctan` au lieu d'`arcsin`** pour le diamètre apparent d'une sphère | le contrôle numérique du module lunaire |
| **Le Soleil n'a pas de diamètre apparent** à la distance de la Lune — son rayon vaut 1,81 fois cette distance, la Terre serait dedans | le même, en trouvant `arcsin` hors domaine |
| **√(1 − 1/16)** pour la cadence du temps, formule de l'observateur immobile alors qu'on orbite | la relecture du carnet, contre ses propres chiffres cités vingt lignes plus loin |
| **Lumen ne parlait jamais sur téléphone** — une règle masquait son conteneur, et la bulle vit dedans | la mesure de l'élément qui reçoit le toucher |
| **Le ciel s'éteignait** au loin, parce que je croyais le lanceur de rayons devenu inutile | la lecture des pixels : il rendait toujours la nébuleuse |
| **Cinq boutons de vingt pixels**, dont trois croix de fermeture | le harnais, premier passage |
| **La résolution n'avait que deux crans** : un appareil trop lent pour le second n'avait nulle part où descendre | les ralentissements signalés, puis le comptage des crans |

Et une erreur qui n'en était pas une : mon contrôle de la précession annonçait
**46 % d'écart** sur un moteur juste, parce que j'avais écrit `6πM/L²` au lieu de
`6πM²/L²` et que je comparais au mauvais rayon. *Un contrôle faux est pire que
pas de contrôle — il fait corriger ce qui marche.*

---

## Les fondations

**F1 est fait.** Un seul `lieu` remplace les drapeaux qui s'excluaient deux à
deux. Être à deux endroits est devenu impossible à écrire au lieu d'être interdit
si l'on y pense.

**F2 est engagé.** Deux tranches sont sorties du bloc de 3 500 lignes :

- `physique.js` — géodésiques, orbites, les quatre repères du banc. Son extraction
  a rendu le banc d'essai **exécutable sans navigateur**.
- `vol.js` — les sondes et les photons : leur avenir intégré au départ, leur
  avancée, leur fin. Ce n'était pas le morceau le plus emmêlé, c'était celui dont
  dépend la suite : **la salle de tir balistique n'est que `destin()` avec une
  vitesse choisie**, et le mémorial lit la même fin de vie.

Le module ne parle plus, il raconte : l'ancien code appelait `flash()` et
`message()` depuis le cœur de la boucle physique, ce qui voulait dire qu'une
sonde ne pouvait se figer qu'en produisant un éclair, toujours le même. Le
mémorial ne veut pas d'éclair. `avance()` rend maintenant la liste de ce qui
vient d'arriver, et la page décide.

**F3 est fait**, hors du site : `ncorps.js`, gravitation mutuelle, symplectique,
63 contrôles. Ordres de convergence mesurés 2,0002 et 3,9998. Reste à le brancher.

---

## Ce que le contrôle du vol a appris

Il devait seulement prouver la non-régression. Il a prouvé mieux.

Le terme correctif `3L²/r²` du moteur n'est pas un ornement : le rapport des
fréquences orbitale et épicyclique qu'il produit vaut

    Ω/κ = 1/√(1 − 6M/r)

**exactement** le résultat de Schwarzschild — pas au premier ordre. La précession
mesurée y colle à trois millionièmes, à quatre rayons comme à quarante. Et le
zéro de κ tombe en `r = 6M` : **la dernière orbite stable n'est pas un nombre
écrit dans le code, c'est ce zéro-là.**

Le même calcul a sorti une limite, désormais déclarée dans la note de la
rédaction en deux langues : le potentiel employé pour la matière donne une
vitesse de libération égale à *c* en `r = 2 r_s` au lieu de l'horizon. Entre un
et deux rayons, nos sondes sont prisonnières un peu trop tôt.

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
2. **La salle de tir balistique.** Les fondations sont posées : `vol.js` fait
   déjà tout le travail, il lui manque une pièce, une visée et une vue depuis le
   corps lancé.
3. **F2**, tranche suivante. Le bloc a perdu 140 lignes nettes ; il en reste
   beaucoup.
4. **Le panthéon**, débranché exprès en attendant la salle balistique — c'est
   elle qui lui donnera des noms à inscrire.
5. **Sourcer les constantes de `ncorps.js`**, recopiées de mémoire — justes à
   10⁻³, mais la règle du dépôt veut une source.

Ce qui attend des yeux est dans `A-REGARDER.md`, et rien n'y bloque.
