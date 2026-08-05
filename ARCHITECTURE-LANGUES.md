# Rendre le site bilingue, puis multilingue

Décidé le 5 août 2026. Français d'abord, anglais ensuite, et la porte ouverte
pour la suite sans réécriture.

## L'essentiel du travail était déjà fait

La règle posée dès le début — **aucun fait hors du fichier de contenu** — se
révèle être exactement ce qu'il fallait. Mesure : **11 160 mots** dans
`contenu.js`, contre une centaine de chaînes courtes ailleurs. Quatre-vingt-dix-
neuf pour cent du volume est déjà isolé.

C'est un bénéfice qu'on n'avait pas prévu en posant la règle, et il mérite
d'être noté : une contrainte de rigueur a produit une architecture.

## La forme retenue

`contenu.js` devient `contenu.fr.js`, et l'anglais est son jumeau
`contenu.en.js` — **même structure, mêmes identifiants, mêmes clés de sources**.
Un fichier par langue, chargé selon le choix.

### Pourquoi les identifiants ne bougent jamais

Ils ne sont pas décoratifs : `id` sert de clé à trois choses à la fois — le
fichier audio, le registre des sources, et l'outil d'audit. Renommer un `id`
casserait la voix sans que rien ne le signale.

Un `id` est donc **le même dans toutes les langues**. C'est lui qui dit « cette
phrase-ci et sa traduction sont la même phrase ».

### La voix

Les fichiers passent de `voix/<voix>/<id>.mp3` à `voix/<langue>/<voix>/<id>.mp3`.
La synthèse est refaite par langue avec `outils/voix.py`, qui prend déjà une
voix en paramètre — il suffit d'y ajouter la langue.

Coût à prévoir : environ dix mégaoctets par langue et par voix. Il faudra sans
doute n'offrir qu'une ou deux voix en anglais plutôt que quatre.

### Ce qui reste en dur, et qu'il faut sortir

Une centaine de chaînes courtes : libellés de boutons, titres de panneaux,
consignes de l'interface, et les textes tracés sur les écrans du vaisseau. Elles
rejoignent le fichier de contenu dans une section `ui`, avec des clés parlantes.

C'est un travail mécanique mais il ne doit pas être bâclé : une chaîne oubliée
laisse un bouton français au milieu d'une page anglaise, et ça se remarque plus
qu'une mauvaise traduction.

### Le choix de la langue

Proposé d'après `navigator.language` au premier chargement, modifiable dans les
réglages, mémorisé comme le reste. Jamais imposé : quelqu'un dont le navigateur
est en anglais peut vouloir lire en français.

## L'ordre, et ce qui peut aller en parallèle

1. **La traduction de `contenu.js`** — indépendante de tout le reste, c'est le
   gros du volume, et le fichier est stable. Délégable immédiatement.
2. **L'extraction des chaînes en dur** — dans `index.html`, sans toucher au
   contenu. Se fait pendant que la traduction tourne.
3. **La plomberie** — chargement du bon fichier, sélecteur, mémorisation.
4. **La synthèse vocale anglaise**, une fois les textes figés. Pas avant : un
   `dire` qui change après coup oblige à tout régénérer.

## Ce qui ne se traduit pas

- Les **références bibliographiques** du registre. Un article s'appelle comme il
  s'appelle.
- Les **identifiants**, on l'a dit.
- Les **formules**, évidemment — mais leurs légendes, oui.
- Les **noms propres** d'objets célestes, sauf usage établi : Sagittarius A*
  reste Sagittarius A*, la Voie lactée devient the Milky Way.

## L'exigence qui compte le plus

Les trois niveaux de lecture doivent survivre à la traduction. En particulier
le premier, dont le contrat est de **ne rien supposer** : ce n'est pas une
contrainte de vocabulaire mais de pensée, et une traduction littérale la perd
systématiquement. Mieux vaut une phrase anglaise différente qui tient le
contrat qu'un décalque fidèle qui l'abandonne.
