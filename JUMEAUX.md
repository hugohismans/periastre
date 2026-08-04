# Le voyage des jumeaux — mis de côté, pas abandonné

Retiré de la bêta le 4 août 2026. Le contenu et la mécanique restent en place :
retirer `"m-jumeaux"` de l'ensemble `MIS_DE_COTE` dans `index.html`, et rendre
son entrée à `EXPERIENCES`, suffit à tout restaurer.

## Ce qui ne va pas, dans les mots d'Hugo

> « Ça te faisait monter dans un vaisseau bizarre, je n'aimais pas la vue que ça
> faisait, et je ne sais pas quel objet c'est ni par quoi c'est représenté dans
> le vaisseau. »

Trois défauts distincts, et aucun ne porte sur la physique.

**On ne sait pas ce qu'on incarne.** L'expérience appelle `embarque()`, qui
attache la caméra à une sonde — un point sans corps ni cabine. Les compteurs du
bas sont les siens, mais rien ne dit qu'on est *dessus*. La question « on est
dans quoi ? » n'a pas de réponse à l'écran.

**La vue change sans prévenir.** On passe du salon au cockpit, dont le cadre
enferme le rendu dans une bande horizontale — désastreux sur un téléphone
couché, où il ne reste qu'un tiers de la hauteur.

**Elle n'a pas de lieu.** C'est la contradiction de fond avec le principe que
le vaisseau doit incarner : toute fonction devrait être un poste qu'on rejoint.
Les jumeaux s'ouvrent depuis un menu, donc depuis nulle part.

Et un défaut de placement : c'était la **huitième mission sur huit**, donc la
dernière impression. Un testeur juge l'ensemble sur elle.

## Pourquoi ça vaut la peine d'y revenir

C'est le contenu le plus fort du site après l'ombre elle-même. On ne lit pas la
dilatation du temps, on la **regarde diverger** : deux compteurs, une descente,
et l'écart qui s'installe sans retour possible. Le paradoxe des jumeaux devient
une chose qu'on a faite.

Une partie du travail est d'ailleurs déjà faite ailleurs : les deux horloges du
salon montrent exactement ce phénomène, en continu, sans changer de vue ni de
corps. C'est peut-être la vraie leçon — **le bon support existait déjà**.

## Ce qu'il faudrait avant de la remettre

1. **Un lieu.** Une nacelle, un module qu'on rejoint à pied depuis le salon, et
   dont on voit qu'on y monte. Pas une bascule de caméra.
2. **Un corps.** Le personnage existe déjà (`personnage.js`) : on doit se voir
   embarquer, et voir la cabine autour de soi.
3. **Un cockpit qui remplit l'écran**, en particulier sur un écran large et
   court. Le cadre actuel perd les deux tiers de la hauteur.
4. **Un retour explicite.** On doit savoir qu'on peut remonter, et ce qu'on
   perd si l'on descend plus bas.
5. **La placer plus tôt**, ou hors de la série. Une expérience qui demande de
   comprendre ne devrait pas être ce sur quoi on juge l'ensemble.

Voir aussi le cours sur les jumeaux dans `IDEES.md` — la formulation par la
longueur de la ligne d'univers, et le piège de la géodésique qui ne maximise le
temps propre que localement.
