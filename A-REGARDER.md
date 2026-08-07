# Ce qui attend des yeux

> ## 👉 Ne lis pas ce fichier. Ouvre ça :
> ### **https://hugohismans.github.io/periastre/?juge**
>
> Les décisions ci-dessous s'y jouent une par une. La séance **va chercher
> la chose et la pose sous tes yeux** — tu ne navigues pas, tu ne lis pas. Là où
> il y a plusieurs options, elles se comparent en direct, sur la même vue, d'un
> bouton à l'autre. À la fin, un bouton « Copier » : ce qui sort est un **message
> écrit pour Claude**, prêt à coller dans la conversation.
>
> Compte dix minutes. Ce document n'est que sa source.

Tout ce qui ne peut pas se vérifier par la mesure, et qui attend donc qu'un
humain regarde. **Rien ici ne bloque quoi que ce soit** — c'est une file, pas
une dette. Elle existe pour que ça ne se perde pas dans une conversation.

Mise à jour le 6 août 2026, après la troisième séance.

---

## D'abord : la séance elle-même faussait les verdicts

À retenir avant de lire le reste. Le panneau de `?juge` **grandissait de
cinquante-six pixels à chaque question** — il empilait une rangée de boutons
sans retirer la précédente. Cent quarante-deux pixels de haut à la première
question, trois cent dix à la quatrième, et ce en état replié.

La cinquième question était la rotation du trou noir d'étude. Le « ça coince »
rendu ce jour-là, avec pour seul mot « l'interface de test bloque encore
l'interface », ne portait donc pas sur la rotation.

Corrigé, et deux contrôles posés : la fenêtre se déplace maintenant à la souris
et au doigt, et la séance vérifie à chaque question qu'elle n'a pas recommencé à
enfler. **Les verdicts de la troisième séance sont à relire avec ça en tête.**

---

## Séance du 7 août 2026 — la file est vide

**Deux questions sont closes, et la troisième a été refusée pour de bonnes
raisons.** Il n'y a plus rien à faire juger tant que la partie voyage n'est pas
refaite : reposer les mêmes variantes coûterait son œil pour un verdict déjà
rendu.

| quoi | verdict |
|---|---|
| **La rotation du trou noir d'étude** | ✅ « ça va ». Posée quatre fois, ratée trois fois par ma faute. Close. |
| **L'image après la réécriture du moteur** | ✅ « rien n'a bougé, tout a l'air conforme ». Aucune régression visible après le passage en Kerr-Schild. Close. |
| **L'arrivée du voyage** | ❌ **Les deux variantes refusées, et il a répondu à côté de mes boutons — à juste titre.** Voir le chantier ci-dessous. |
| **La carte des orbites qui tourne** | ✅ **Corrigé le jour même.** « On a l'impression que le vaisseau tourne autour du trou noir. » Une dérive d'azimut que j'avais ajoutée « pour que le volume se lise » ; elle fabriquait un déplacement inexistant. Gardé par `VERIF.carteFixe()`. |

### Le chantier qui sort de cette séance : refaire le voyage

Ses mots, dans l'ordre où ils sont venus :

> « La trace des orbites est devant la vitre dans le vaisseau, on n'a pas
> l'impression que c'est à l'extérieur. Et on doit vraiment avoir l'impression
> qu'on s'éloigne : la taille des orbites doit être relative à la distance à
> laquelle on est du trou noir pendant le voyage. »

> « Si on voit une trace d'orbite, on les voit depuis le début qu'on recule, et
> c'est une fois qu'on arrive à la destination qu'on la voit en entier. Mais ça
> doit se faire de manière très naturelle. »

> « Il faudrait mettre notre vitesse actuelle pendant le voyage, en vitesse de la
> lumière. La phase d'accélération, la phase de décélération. Le décalage
> temporel pendant le voyage, à quelle distance on est de notre point de départ.
> Je trouve que la partie voyage est à retravailler en tout cas. »

**Cinq points, et le dernier commande les autres.**

1. La carte des orbites est un **calque plat posé sur tout l'écran** — d'où le
   fait qu'elle passe devant la vitre. Il faut la découper à l'ouverture de la
   baie, dont `projetteSalon()` sait déjà donner les coins.
2. Son échelle suit l'ouverture du panneau, pas la distance. Elle doit suivre
   `RECUL.etat.distance`.
3. Elle apparaît à la fin. Elle doit être là dès le début du recul et se révéler
   en se resserrant.
4. Il n'y a **aucune information de vol** : ni vitesse, ni facteur de dilatation,
   ni distance parcourue.
5. **Et la cause profonde** : le recul visible suivait une courbe de confort — un
   lissage sur le logarithme de la distance — pendant que le chronomètre
   calculait le vrai vol à 1 g. Afficher une vitesse tirée de cette courbe
   donnerait un chiffre faux en mouvement à l'écran.

Fait le 7 août : `VOYAGE.etat(d, τ)` rend la position, les deux horloges, β, γ et
la phase, gardé par 54 contrôles dans `outil-verif-voyage.js`. Le reste s'y
branche — c'est la fondation, elle est posée et prouvée.

<details><summary>L'état d'avant cette séance, gardé pour mémoire</summary>

| quoi | où | état |
|---|---|---|
| **L'arrivée du voyage** | fin du recul | ❗ **Neuf, 6 août au soir.** « L'apparition du cercle d'orbite des étoiles autour du trou noir n'est pas fluide, ça *pop* d'un coup à la fin. » Relevé au passage, pas en réponse à une question — c'est le quatrième défaut trouvé par ce champ libre. |
| **La couture de l'axe polaire** | trou noir d'étude, en rotation | ❗ **La question a enfin été posée, et la réponse n'est pas celle que j'attendais.** « Il y a une trace verticale buguée quand on met une rotation. » C'est la couture de l'axe polaire — une dette connue, déclarée à **sept endroits** du contenu, dont le panneau qu'il avait sous les yeux. **Il l'a lue comme un bug malgré la déclaration.** |

</details>

## Ce qui reste en file, sans être une question de séance

| quoi | où | état |
|---|---|---|
| **La carte des étoiles S** | arrivée du voyage | ❌ **Ça coince** aux trois séances. Le 6 août : « à discuter dans Claude Code avec Hugo ». Ce n'est plus une question à poser devant un écran — elle sort de la séance et devient une conversation. |
| **La console de tir** | fosse du salon | Sortie de la séance. « Quand je dis agrandir, je veux dire agrandir LE VAISSEAU, et mettre le canon dans une nouvelle salle. » C'est une aile de plus, pas un choix de taille. |
| **Les lampes du bord** | dans le salon | Question posée avec le mauvais bouton. L'interrupteur existe maintenant vraiment. À rejouer un jour. |

### ✅ La couture de l'axe — tranchée et faite le 6 août au soir

**Hugo a choisi la route 1 : réécrire le moteur.** C'est fait. La branche en
rotation intègre en Kerr-Schild, où l'axe polaire n'a rien de singulier.

Mesuré avant/après, même caméra, même code : la discontinuité sur l'axe passe de
**78-310 niveaux à 2-26**, avec un témoin à rotation nulle qui donne 1,3 dans les
deux cas — c'est lui qui prouve que la mesure ne raconte pas d'histoire.
`VERIF.couture()` la garde désormais.

La branche du trou noir immobile n'a pas été touchée, et la table d'or est
identique au chiffre près. Le coût passe de 18,2 à 19,9 ms par image en rotation,
soit sept pour cent.

**Il reste ton œil.** Aucun de ces chiffres ne dit si c'est beau — et la question
qui a déclenché le chantier t'attend dans la séance.

<details><summary>Le raisonnement d'origine, gardé pour mémoire</summary>

#### La couture de l'axe — la décision qu'Hugo devait prendre

Le 6 août au soir, quatrième séance : « regarde le screenshot que je t'ai envoyé,
il y a une trace verticale buguée quand on met une rotation au trou noir ».

**Ce que c'est.** À rotation non nulle, le moteur passe en Boyer-Lindquist, où
l'axe polaire est singulier *par construction*. Le code lutte déjà : il borne
`sin θ` à 10⁻², interdit à un rayon de sauter par-dessus le pôle en un pas — ce
qui avait supprimé une colonne d'artefacts bien plus large — et réfléchit
correctement en inversant p_θ et en décalant φ de π. Ce qui reste vient de la
borne : sous 0,01 radian de l'axe, les termes métriques sont bridés, donc faux.
La physique est juste ; c'est sa **description** qui s'y casse.

**Ce que ça nous apprend, et qui vaut plus que la couture.** Le site déclare ce
défaut à sept endroits, dont le panneau ouvert devant lui au moment du verdict :
« une fine couture apparaît sur l'axe : c'est la singularité de coordonnées, pas
un défaut de calcul ». **Il a quand même écrit « buguée ».** Une déclaration
qu'on doit lire ne répare pas ce qu'on voit — c'est exactement la règle du
5 août, « chaque compromis se déclare là où on le rencontre », et cet aveu-là est
dans un paragraphe, pas sur la couture.

**Les trois routes, du plus cher au moins cher :**

1. **Réécrire en Kerr-Schild.** La vraie correction : ces coordonnées ne sont pas
   singulières sur l'axe, et la couture disparaît. C'est un chantier de moteur,
   pas un correctif.
2. **Resserrer la borne** de 10⁻² vers 10⁻³, avec le limiteur de pas qui suit.
   La couture rétrécit sans mentir — on brida moins. Coût : des pas
   supplémentaires près de l'axe, à mesurer.
3. **Poser l'aveu sur la couture elle-même** plutôt que dans un paragraphe.
   Ne change rien à l'image, change tout à sa lecture.

Les routes 2 et 3 ne s'excluent pas, et aucune n'interdit la 1 plus tard.

*Note d'après coup : la route 2 n'existait pas. J'avais annoncé une borne
`sin θ ≥ 10⁻²` à resserrer ; elle valait déjà `10⁻⁷`, et le commentaire du code
expliquait qu'on l'y avait mise exprès — la brider à 10⁻² causait une colonne
d'artefacts bien pire. Il n'y avait pas de demi-mesure.*

</details>

### Le bruit de fond du ciel — à revoir plus tard, sans urgence

Verdict du 6 août au soir, après comparaison des trois ciels en direct : « très
peu de changement entre les trois, le bruit est très léger, ce n'est pas
bloquant, donc on regardera ça plus tard ». Le ciel corrigé est gardé, les deux
autres sont partis du code. **Il reste un bruit léger, et il n'est pas
diagnostiqué** — ce n'est plus la coupure aux cellules, qui est mesurée à zéro.

### Tranché — plus besoin de personne

- **Le quadrillage pendant le recul** → **ça va** (6 août au soir). Demandé
  trois fois en volume, fait, et validé à la quatrième. `outil-verif-recul.js`
  garde la forme du repère *et* la visibilité des arêtes — le premier jet les
  avait posées sous le seuil du visible, et la demande serait revenue une
  cinquième fois.
- **Le scintillement des étoiles** → **tranché** (6 août au soir). Les étoiles
  étaient tranchées par la frontière de leur cellule ; mesuré, corrigé, gardé à
  zéro discontinuité de 390 à 1440 pixels de haut. Voir ci-dessus pour le bruit
  résiduel, qui est autre chose.
- **La présentation d'entrée** → ça va (6 août, troisième séance).
- **La bulle de Lumen** → ça va.

---

## À regarder quand l'occasion se présente

- **Le voyage entier**, d'un bout à l'autre, sans sauter. Vingt-deux secondes.
  Est-ce trop long ? Trop court ? Le recul se sent-il ?
- **Le trou noir d'étude** : passer les quatre rotations à la suite. L'effet est
  réel et calculé, mais est-il visible ?
- **Le carnet de bord** après plusieurs trajets : les chiffres parlent-ils ?
- **Les écrans de bord** depuis que leur contenu est mis en cache. Rien ne
  devrait avoir changé — mais « rien ne devrait » n'est pas « rien n'a ».
- **L'anglais**, en entier, par quelqu'un dont c'est la langue.

---

## La salle de tir : où je me suis arrêté, et pourquoi

**J'ai posé une console de tir dans le salon, puis je l'ai retirée.** Pas parce
qu'elle était fausse — parce que je n'arrivais pas à établir de façon fiable ce
que je voyais à l'écran, et que continuer à l'aveugle sur un objet en volume
n'avait plus de sens.

Ce qui est acquis, et ne sera pas à refaire :

- **La mécanique est prête.** `vol.js` fait déjà tout : `destin()` calcule
  l'avenir complet d'un tir avant qu'il parte, et rend le tracé. La salle n'est
  que ça, avec une vitesse choisie au lieu d'une vitesse tirée au sort.
- **La projection marche depuis la pièce.** `majCameraSalon()` alimente `basis`
  et `camPos` comme la vue libre, donc `projette()` sait déjà dessiner une
  trajectoire dans la baie. Rien à écrire pour ça.
- **Le point pédagogique est identifié**, et c'est le tien : un tir à zéro
  mètre par seconde depuis une station en orbite laisse la sonde **à côté du
  vaisseau, toujours en orbite**. Le tir actuel ne fait pas ça — il pose une
  vitesse absolue depuis un point du plan, sans hériter de rien.
- **Un piège trouvé et documenté** : tout poste qui n'est pas le télescope est
  DESSINÉ comme un cube cyan plein à la taille de sa boîte de visée. C'est
  ainsi que les cinq lames du temps existent — le cube EST la lame. Un poste
  qui a sa propre géométrie doit donc suivre la branche du télescope, sinon un
  pavé bleu de soixante-dix centimètres se pose sur l'instrument.

**Ce qu'il me faut de toi** : un coup d'œil, ou la permission de la poser
franchement et de te laisser juger sur pièce. La place proposée était la fosse,
à x = 1,2 — la seule portion vraiment vide, entre les deux occupants, avec le
trou noir dégagé au centre de la baie.

---

## Les décisions qui t'appartiennent

Elles ne sont pas techniques. Personne d'autre ne peut les prendre.

1. **Le conflit de lumière du salon.** Le document de conception veut une
   lumière qui vienne du trou noir seul ; l'implémentation a ajouté des sources
   dans la pièce. Cinq salles futures en dépendent. Il faudrait deux captures
   côte à côte.
2. **Acheter des choses.** Le carnet dit à un endroit « à laisser tomber » et à
   un autre « avatars, tenues, monnaie ». Une troisième voie y dort déjà : un
   objet rapporté d'une destination est un souvenir, pas un achat.
3. **La rencontre trou noir / Lune.** Tu la veux, le carnet la refuse — parce
   qu'elle n'est pas sourçable et qu'elle enseigne le contraire du but. La
   décision reste ouverte.
4. **« Lumière réelle » contre le mode simulation/cinéma.** Le bouton existe et
   fait déjà une partie du travail du futur réglage. Soit il devient le mode,
   soit il en devient un cran.

---

## Ce qui est réglé et n'a plus besoin de personne

Pour mémoire, et pour ne pas y revenir : le drone se touche au doigt (mesuré,
huit visées sur huit), Lumen parle sur téléphone (une règle le masquait depuis
toujours), le ciel ne s'éteint plus, la mise en page tient aux trois formats, et
le bilingue est complet. Tout cela se contrôle désormais tout seul.
