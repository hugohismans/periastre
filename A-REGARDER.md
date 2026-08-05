# Ce qui attend des yeux

> ## 👉 Ne lis pas ce fichier. Ouvre ça :
> ### **https://hugohismans.github.io/periastre/?juge**
>
> Les huit décisions ci-dessous s'y jouent une par une. La séance **va chercher
> la chose et la pose sous tes yeux** — tu ne navigues pas, tu ne lis pas. Là où
> il y a plusieurs options, elles se comparent en direct, sur la même vue, d'un
> bouton à l'autre. À la fin, un bouton « Copier » : ce qui sort est un **message
> écrit pour Claude**, prêt à coller dans la conversation.
>
> Compte dix minutes. Ce document n'est que sa source.

Tout ce qui ne peut pas se vérifier par la mesure, et qui attend donc qu'un
humain regarde. **Rien ici ne bloque quoi que ce soit** — c'est une file, pas
une dette. Elle existe pour que ça ne se perde pas dans une conversation.

Mise à jour le 5 août 2026.

---

## À regarder en priorité, parce que c'est neuf et jamais vu

| quoi | où | état |
|---|---|---|
| **La carte des étoiles S** | arrivée du voyage | ❌ **Ça coince** — verdict d'Hugo, séance du 6 août. Sans précision : à rejouer avec une question mieux posée. |
| **Le scintillement des étoiles** | partout | ❌ **Ça coince** — verdict du 6 août. Les cœurs font pourtant au moins un pixel, mesuré. Autre chose grouille. |
| **La présentation d'entrée** | premier chargement | Pas tranchée le 6 août. Trois écrans. Le rythme est-il bon ? Le dernier atteint-il ? |
| **La rotation du trou noir d'étude** | trou noir d'étude | Pas tranchée le 6 août. L'effet est calculé et réel ; est-il visible ? |
| **Les lampes du bord** | dans le salon | Question posée avec le mauvais bouton le 6 août. L'interrupteur existe maintenant vraiment. À rejouer. |
| **La console de tir** | fosse du salon | « Aucune » aux trois emplacements, avec un mot : **agrandir**. Trois tailles à comparer désormais. |

### Tranché le 6 août — plus besoin de personne

- **Le quadrillage pendant le recul** → ça va.
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
