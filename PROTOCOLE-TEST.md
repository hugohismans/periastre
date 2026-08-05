# Essayer Périastre en dix minutes

À donner à quelqu'un qui a un téléphone. **Surtout si ce n'est pas un iPhone
récent** — c'est là qu'on ne sait rien.

👉 **https://hugohismans.github.io/periastre/**

---

## Avant de commencer

Rien à installer, rien à créer. Ça s'ouvre dans le navigateur.

Une seule chose à savoir : **on ne cherche pas des bugs**. La machine les cherche
déjà toute seule, et elle est meilleure que nous à ça. Ce qu'on cherche, c'est ce
qu'elle ne peut pas savoir : est-ce que c'est joli, est-ce qu'on comprend, est-ce
que le doigt tombe où il faut.

Si quelque chose t'agace pendant deux secondes, c'est un résultat. Note-le.

---

## Les cinq gestes

Ils couvrent les cinq endroits où ça peut casser. Rien d'autre n'est demandé.

### 1. Entrer

Ouvre la page. Attends que ça bouge tout seul, sans rien toucher — il y a une
ouverture d'une dizaine de secondes.

> **Ce qu'on veut savoir**
> Est-ce que ça démarre vite ? Est-ce que l'image est fluide, ou est-ce que ça
> hache ? Est-ce que tu as compris ce que tu regardais avant qu'on te le dise ?

### 2. Bouger au doigt

Entre à bord. Regarde autour de toi en faisant glisser le doigt. Marche.
Approche-toi de la grande baie vitrée.

> **Ce qu'on veut savoir**
> Est-ce que la vue suit le doigt naturellement ? Trop lente, trop nerveuse ?
> Est-ce que tu arrives à aller où tu veux, ou est-ce que tu te bats ?

### 3. Toucher le petit drone

Il y a une mascotte qui flotte dans la pièce, un petit drone. **Touche-la.**

> **Ce qu'on veut savoir**
> Combien d'essais ? Ce geste précis a déjà cassé trois fois, pour trois raisons
> différentes. Si tu n'y arrives pas du premier coup, dis-le.

### 4. Partir en voyage

Va au télescope. Choisis une destination. Laisse partir le vaisseau et attends
l'arrivée — c'est une vingtaine de secondes.

> **Ce qu'on veut savoir**
> Est-ce que tu **sens** qu'on s'éloigne ? Le quadrillage aide ou gêne ? Vingt
> secondes, c'est trop long, trop court, ou bien ?
> Et à l'arrivée : est-ce qu'on comprend, sans lire, que ces orbites tournent
> autour de quelque chose d'invisible ?

Puis reviens.

### 5. Changer de langue

Il y a **FR** et **EN** quelque part. Bascule, promène-toi un peu, rebascule.

> **Ce qu'on veut savoir**
> Est-ce qu'il reste des bouts non traduits ? Des mots bizarres ? Est-ce que
> quelque chose se casse au moment de la bascule ?

---

## Rendre compte

Le plus simple : ouvre la même adresse en ajoutant **`?test`** à la fin.

    https://hugohismans.github.io/periastre/?test

Le site pose alors les questions **au moment où tu viens de vivre la chose** —
pas vingt minutes plus tard dans un formulaire. Deux boutons, un champ libre si
tu veux dire un mot. À la fin, il fabrique un compte rendu à copier-coller, avec
le matériel détecté dedans.

Rien n'est envoyé nulle part. Tu copies, tu envoies à qui tu veux, ou pas.

Sinon, trois phrases dans un message suffisent. Vraiment.

---

## Ce qu'il ne sert à rien de vérifier

La machine le fait déjà, à chaque fois, et mieux :

- que les textes s'affichent dans les deux langues, sans clé technique qui traîne
- que la physique est juste — sphère des photons, ombre, déflexion, dernière
  orbite stable, précession du périastre
- que les boutons sont assez grands pour un pouce
- que rien ne déborde de l'écran sur les tailles de téléphone courantes
- que le temps du simulateur avance à la vitesse annoncée
- que l'image tient son budget, et que la résolution baisse quand ça rame

Pour la lancer soi-même : ajouter **`?verif`** à l'adresse, puis, dans la console,
`VERIF.sain()`.

---

## Si ça ne marche pas du tout

Écran noir, message d'erreur, rien qui s'affiche : **c'est le résultat le plus
utile de tous.** Dis simplement quel téléphone et quel navigateur.

Le site demande WebGL2. Un appareil d'avant 2017 environ peut ne pas l'avoir —
et savoir *lequel* vaut mieux que le supposer.
