# Le Quiz de Quaregnon

Un quiz sur Quaregnon, le Borinage, le borain et la Belgique. Seul ou à
plusieurs, chacun sur son téléphone.

C'est un tas de fichiers, sans rien à installer. Tu peux ouvrir `index.html`
directement pour jouer seul ; pour le multijoueur il faut que le site soit en
ligne (voir plus bas).

---

## Ce qu'il y a dedans

**Trois niveaux**, parce que le même quiz doit servir à ta cousine de Gand et à
quelqu'un qui a grandi rue du Coron :

- **Touriste** — on débarque du train à Mons.
- **Borain** — on est du coin, et ça se sent.
- **Quaregnonnais pur jus** — on a un terril dans le jardin.

**Quatre thèmes** : Quaregnon, le Borinage, le borain, la Belgique. On peut
allumer et éteindre ce qu'on veut ; le tirage fait exprès de répartir les
questions entre les thèmes allumés, sinon Quaregnon prenait toute la place.

**57 questions**, et chacune porte sa source. Quand la réponse tombe, le lien
vers l'endroit où je l'ai lue s'affiche. C'est le seul moyen d'avoir un quiz
qui ne raconte pas de bêtises.

---

## Ce que j'ai besoin de toi

### 1. Le multijoueur — cinq minutes, une seule fois

Tout est écrit dans **`config.js`**. En résumé : tu crées un projet gratuit sur
`console.firebase.google.com`, tu y ajoutes une « Realtime Database » en mode
test, et tu colles l'adresse qu'elle te donne dans la ligne prévue.

Une seule adresse à copier. Pas de mot de passe, pas de compte pour les joueurs.
Tant que la ligne est vide, le solo marche et le multijoueur affiche poliment
qu'il lui manque sa clé.

Quand le mode test expire (Google le referme au bout de trente jours), les
règles à coller sont dans `REGLES-FIREBASE.md`.

### 2. Les photos

Je n'ai pas pu en télécharger : la machine sur laquelle je travaille n'a pas
accès à Wikipédia ni au site de la commune. Le décor du site est donc **dessiné**
— les terrils, le chevalement, la file des corons.

Si tu veux une vraie photo derrière, dépose-la dans `images/fond.jpg` et elle
apparaîtra toute seule, sans rien changer d'autre. Les détails sont dans
`images/LISEZ-MOI.md`.

Pareil pour le **Q**. Celui du site est un Q que j'ai dessiné : un anneau rouge
et une queue dorée. Ce n'est **pas** le logo de la commune, que je n'ai pas pu
voir. Si tu veux le vrai, il faudra me le donner — et vérifier qu'on a le droit
de s'en servir, parce que le logo d'une commune n'est pas libre par défaut.

### 3. Relire le borain

**Douze questions attendent ton oreille.** Je les ai tirées de dictionnaires et
de lexiques, jamais de ma mémoire — mais je n'ai jamais entendu parler cette
langue, et toi si. `node verifier.js` te les liste à chaque fois.

Si l'une sonne faux, c'est elle qui a tort. Et surtout : **ajoute les tiennes**.
Les mots que tu as entendus chez tes grands-parents ne sont dans aucun de mes
livres, et ce sont les meilleures questions du site.

---

## Ajouter ou corriger une question

Tout est dans **`questions.js`**, et le mode d'emploi est écrit en haut du
fichier. Le principe :

```js
{
  id: "un-nom-court-unique",
  theme: "borain",            // ou quaregnon, borinage, belgique
  niveau: 3,                  // 1 touriste, 2 borain, 3 pur jus
  q: "Ta question ?",
  r: ["la bonne", "une fausse", "une fausse", "une fausse"],
  bonne: 0,                   // la place de la bonne réponse
  pourquoi: "Ce qu'on apprend quand la réponse tombe.",
  sources: ["wp-borain"]      // une clé de sources.js
},
```

Les réponses sont mélangées à chaque partie, donc mets la bonne en premier si
ça t'arrange.

Puis :

```bash
node verifier.js
```

Il attrape ce qu'une relecture à l'œil laisse passer : une virgule oubliée, une
source qui n'existe pas, deux questions avec le même nom, deux propositions
identiques dans la même question — la faute qui rend une question impossible
sans que personne s'en aperçoive avant la partie.

---

## Vérifier

```bash
node verifier.js            # tout, d'un coup
```

**1 686 contrôles**, aucun navigateur nécessaire. Ils couvrent la banque de
questions, le tirage, le barème, le classement, le miroir du multijoueur,
l'écriture des nombres — et le fait que chaque question tienne debout toute
seule.

Ce dernier vient d'un défaut vu à l'œil sur une capture d'écran : une partie
s'ouvrait sur « Quel parti **l'**a adoptée ? ». Adoptée quoi ? La question
d'avant parlait de la Charte, mais les questions sont tirées dans le désordre.
Quatorze questions étaient dans ce cas ; elles sont réécrites, et un contrôle
veille désormais à ce que ça ne revienne pas.

Chacun a été prouvé capable d'échouer : j'ai cassé volontairement les seize
choses qu'ils surveillent, et les seize ont été attrapées. Un contrôle qui
n'échoue jamais ne teste rien.

### La partie à deux

```bash
npm install playwright        # une fois
node essai-partie-a-deux.js
```

Celui-là ouvre **deux vrais navigateurs** et leur fait jouer une partie entière
l'un contre l'autre : le salon s'ouvre, l'invité rejoint, les deux voient la
même question dans le même ordre, le meneur marque, l'invité se trompe, le
podium tombe pareil des deux côtés, et le joueur qui s'en va disparaît de la
liste. Tout passe.

C'est le seul outil qui demande d'installer quelque chose, et c'est pourquoi
`node verifier.js` ne le joue pas : le reste du dossier marche sans rien
installer.

**Ce que rien de tout ça ne couvre**, et il vaut mieux le dire : la partie à
deux tourne contre une **imitation** de Firebase que j'ai écrite, d'après la
même lecture de la documentation que le reste. Elle prouve que le jeu est juste
— pas que Google se comporte comme je le crois. Ça, seule une vraie partie sur
ta vraie base le dira, et c'est le premier truc à faire une fois `config.js`
rempli.

---

## Mettre en ligne

Le dossier est autonome : n'importe quel hébergement de fichiers statiques fait
l'affaire. Si tu le laisses ici, il sera à
`hugohismans.github.io/periastre/quiz-quaregnon/` une fois fusionné.

Mais il n'a rien à faire dans le dépôt du simulateur de trou noir. Dis-moi et je
le sors dans son propre dépôt — c'est une commande, et les fichiers ne changent
pas d'une ligne.

---

## Les fichiers

| fichier | ce qu'il tient |
|---|---|
| `index.html` | la page, et le décor dessiné |
| `style.css` | les couleurs du Borinage |
| `questions.js` | **les questions** — c'est là que tu écris |
| `sources.js` | d'où vient chaque réponse |
| `quiz.js` | le jeu : tirage, barème, écrans |
| `salon.js` | le multijoueur, en HTTP nu |
| `config.js` | **la ligne à remplir** |
| `verifier.js` | tout vérifier d'un coup |
| `outil-verif-quiz.js` | la banque et le tirage |
| `outil-verif-salon.js` | la mécanique du salon |
| `essai-partie-a-deux.js` | une partie complète, deux navigateurs |
| `REGLES-FIREBASE.md` | les règles à coller quand le mode test expire |

---

## Deux ou trois idées, si tu veux continuer

- Un **mode « ducasse »** : dix questions chronométrées d'affilée, sans pause,
  pour faire un score et le comparer.
- Des **questions en borain**, où c'est l'énoncé lui-même qui est dans la langue.
- Une **question à photo** : on montre un coin de Quaregnon, il faut le
  reconnaître. Ça, il faut tes photos.
- Un **classement qui dure**, gardé d'une soirée à l'autre.
