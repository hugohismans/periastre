# Carnet

Tout ce qui a été demandé, dans l'ordre où on compte le traiter.
Mis à jour le 4 août 2026.

---

## Fait

- **Moteur de rendu** — géodésiques nulles de Schwarzschild intégrées par pixel,
  disque d'accrétion, Doppler, redshift gravitationnel, images multiples.
- **Banc d'essai intégré** — mesure en direct la sphère des photons, le rayon de
  l'ombre, la déflexion et l'ISCO, et les compare aux valeurs analytiques.
  Il a trouvé une vraie erreur : la direction du photon était renormalisée à
  chaque pas, ce qui n'est pas licite en paramètre affine et donnait une ombre
  55 % trop grande. Corrigé, tout tombe désormais à 0,07 % ou mieux.
- **Sondes** — lancer au glisser, pluie de 80, classement orbite / chute / fuite,
  traînées, affichage de toutes les trajectoires.
- **Gel à l'horizon** — les sondes ne franchissent plus l'horizon : vues de loin,
  elles ralentissent, rougissent et s'éteignent. Le site montrait l'inverse de ce
  qu'il affirmait.
- **Photon témoin** — lancé sur la sphère des photons, lensé dans le shader,
  avec le temps de vol en secondes réelles.
- **Vitesse du temps** — du temps réel à une heure par seconde.
- **8 fiches × 3 niveaux** — de « aucun acquis » à « contraindre le spin ».
- **Dossier « pourquoi c'est exact » × 3 niveaux** — méthode, équations, et la
  liste explicite de ce qui n'est pas simulé.
- **Lumen** — mascotte photon, réactions contextuelles, 6 questions × 3 niveaux.
- **Voix** — 4 voix neuronales pré-synthétisées (`outils/voix.py`), sélecteur
  dans le site. 10,7 Mo, soit 1 % du quota GitHub Pages.
- **`contenu.js`** — registre de 19 sources primaires ; répliques de Lumen
  extraites avec leurs `id` et leurs clés de sources.

---

## À faire

### 1. Vérification des faits par un agent
Faire relire chaque affirmation du site par un agent qui remonte aux sources
primaires, et produire `SOURCES.md` consultable. Bon candidat pour une
sous-tâche : c'est indépendant du reste et demande de la recherche.
**Bloquant avant publication.**

### 2. Finir l'extraction du contenu
Les fiches et le dossier « méthode » sont encore en dur dans `index.html`.
Les déplacer dans `contenu.js` avec leurs `id` et leurs sources, pour que la
règle « aucun fait hors du fichier de contenu » soit vraie partout.
*Prérequis de 1.*

### 3. Mise en ligne
`gh` s'installe. Ensuite : dépôt, push, activation de Pages.
Rapide, et ça donne un site réel à montrer.

### 4. Mode cours guidé
Un bouton « lecture » où Lumen déroule un vrai cours, adapté au niveau, avec
la caméra chorégraphiée (zoom, pivot, lancers de sondes au bon moment) et la
narration audio. C'est la fonctionnalité qui transforme la démo en site
pédagogique. Gros morceau : il faut une piste de scénario (temps → action +
réplique) et un moteur qui la joue.

### 5. Dézoom vers la Voie lactée
Voyage à la molette, en échelle logarithmique, de l'horizon jusqu'à la galaxie
entière, avec des repères qui apparaissent au fil du trajet : orbite de S2,
système solaire, bras spiraux, les 26 000 années-lumière qui nous séparent du
centre. À fusionner avec le mode cours — c'est la même mécanique de caméra.

### 6. Mode Kerr (trou noir en rotation)
La vraie réponse à « pourquoi Gargantua n'est pas ronde » : avec du spin,
l'ombre s'aplatit d'un côté. Exige de passer en Boyer-Lindquist et d'intégrer
avec la constante de Carter — la forme cartésienne compacte disparaît, donc
réécriture complète du shader. Le morceau le plus lourd, et le plus payant
pour l'exactitude.

### 7. Mode « vue réelle »
Ce qu'un humain verrait vraiment : Sgr A* est pâle et ne s'observe qu'en radio,
donc quasiment rien à l'œil nu. Et en chute libre, l'aberration comprime tout
le ciel vers l'avant. Léger comparé à Kerr, et frappant.

### 8. Objets du voisinage
Pendant le dézoom, pouvoir s'arrêter sur une planète, sur S2, sur l'amas S.
Dépend de 5.

---

## Notes

- **Pas d'API dans le navigateur.** Une clé dans du JS statique est publique dès
  la première indexation. Si un jour on veut un vrai dialogue avec Lumen, il
  faudra un proxy (Cloudflare Worker) qui garde la clé.
- **`contenu.js` est la source de vérité.** Trois consommateurs le lisent :
  l'affichage, la génération audio, l'audit des sources. Un `id` ne se renomme
  pas sans régénérer la voix.
- **Ne jamais affirmer sans pouvoir montrer.** Quand une grandeur est calculable,
  un test exécutable vaut mieux qu'une citation.
