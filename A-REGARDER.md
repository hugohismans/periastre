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

## À regarder en priorité, parce que c'est neuf et jamais vu

| quoi | où | état |
|---|---|---|
| **L'arrivée du voyage** | fin du recul | ❗ **Neuf, 6 août au soir.** « L'apparition du cercle d'orbite des étoiles autour du trou noir n'est pas fluide, ça *pop* d'un coup à la fin. » Relevé au passage, pas en réponse à une question — c'est le quatrième défaut trouvé par ce champ libre. |
| **La rotation du trou noir d'étude** | télescope | ❌ **Ça coince deux fois de suite, et deux fois par ma faute.** Le matin, le verdict portait sur ma fenêtre qui mangeait l'écran. Le soir : « je ne vois pas où modifier la rotation » — la question l'envoyait en vue libre alors que les quatre boutons sont dans le panneau du télescope. Corrigé, et gardé par `montre` : la séance refuse désormais de poser une question dont l'objet n'est pas à l'écran. **À rejouer.** |
| **La carte des étoiles S** | arrivée du voyage | ❌ **Ça coince** aux trois séances. Le 6 août : « à discuter dans Claude Code avec Hugo ». Ce n'est plus une question à poser devant un écran — elle sort de la séance et devient une conversation. |
| **La console de tir** | fosse du salon | Sortie de la séance. « Quand je dis agrandir, je veux dire agrandir LE VAISSEAU, et mettre le canon dans une nouvelle salle. » C'est une aile de plus, pas un choix de taille. |
| **Les lampes du bord** | dans le salon | Question posée avec le mauvais bouton. L'interrupteur existe maintenant vraiment. À rejouer un jour. |

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
