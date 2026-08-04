# Objectifs

Comment on découpe le travail pour que plusieurs agents puissent avancer en
même temps sans se marcher dessus.

---

## L'idée directrice

Un seul voyage continu, de l'horizon de Sagittarius A* jusqu'à l'univers
observable. Tout est posé sur **un axe unique** : le logarithme décimal de la
distance en mètres. C'est la colonne vertébrale, et c'est ce qui relie les
scènes entre elles.

| log₁₀(m) | échelle | repère |
|---|---|---|
| 10,10 | 1,3 × 10¹⁰ m | rayon de Schwarzschild de Sgr A* |
| 10,76 | | orbite de Mercure |
| 11,17 | 1 UA | orbite de la Terre |
| 12,65 | | orbite de Neptune |
| 13,25 | 120 UA | héliopause — et périastre de l'étoile S2 |
| 14,5 → 16,2 | | nuage d'Oort |
| 16,60 | 4,25 al | Proxima du Centaure |
| 20,41 | 8 277 pc | distance jusqu'au centre galactique |
| 20,98 | | diamètre du disque de la Voie lactée |
| 22,98 | | Groupe local |
| 24,02 | | superamas de la Vierge |
| 24,69 | | Laniakea |
| 26,64 | 46,5 Gal | horizon de l'univers observable |

Dix-sept décades. Un fait qui vaut à lui seul une scène : **S2 frôle le trou
noir à 120 unités astronomiques**, soit à peu près la taille de la bulle du
système solaire. La même distance, aux deux bouts du voyage.

---

## Le contrat

Chaque scène est un fichier autonome dans `scenes/`, qui exporte un objet
respectant strictement cette forme :

```js
export default {
  id: "systeme-solaire",
  nom: "Le système solaire",
  echelle: [10.6, 13.4],        // décades où la scène est visible
  ancre: 11.17,                 // décade où elle est « chez elle »

  fiches: [...],                // même forme que contenu.js : 3 niveaux + sources
  repliques: [...],             // répliques de Lumen, avec id et sources

  init(gl),                     // ressources GPU, appelé une fois
  dessine(gl, vue, t),          // vue = { decade, camera, dt }
  libere(gl),                   // relâche tout quand on sort de la plage
};
```

`vue.decade` est la position courante sur l'axe. La scène s'estompe seule aux
bords de sa plage. Rien d'autre n'est partagé.

**Le contrat est figé avant de lancer les agents.** C'est la condition pour
que le travail parallèle serve à quelque chose.

---

## Ce qui peut partir en parallèle

Chaque ligne est un agent, sur son propre fichier. Aucun ne touche
`index.html`, `contenu.js` ni `kerr.js`.

| agent | fichier | plage | contenu attendu |
|---|---|---|---|
| Système solaire | `scenes/systeme-solaire.js` | 10,6 → 13,4 | orbites réelles à l'échelle, inclinaisons, la vacuité du truc |
| Nuage d'Oort | `scenes/oort.js` | 13,4 → 16,4 | coquille, provenance des comètes longue période, le fait qu'on ne l'a jamais vu |
| Voisinage stellaire | `scenes/etoiles-proches.js` | 16,4 → 18,5 | Proxima, Alpha Cen, la densité réelle des étoiles |
| Voie lactée | `scenes/voie-lactee.js` | 18,5 → 21,2 | bras spiraux, position du Soleil, retour sur Sgr A* au centre |
| Groupe local → Laniakea | `scenes/grandes-structures.js` | 21,2 → 25 | Andromède, filaments, vides |

## Ce qui reste en série

- **Le moteur de zoom** — l'axe, la caméra, l'enchaînement des scènes. C'est le
  socle : il doit exister avant que les scènes aient un sens. Je le fais.
- **Le portage Kerr dans le shader** — touche le cœur du rendu.
- **Les corrections issues de l'audit factuel.**

---

## Règles que chaque agent doit respecter

1. **Aucun fait sans source.** Même règle que le reste du site : chaque
   affirmation porte ses clés de sources, ajoutées au registre de `contenu.js`.
   L'agent d'audit repassera derrière.
2. **Trois niveaux partout.** Découverte / Curieux / Astrophysicien. Le premier
   ne suppose aucun acquis.
3. **Tout est procédural, aucune image.** Deux raisons : la cohérence visuelle —
   mélanger des photos avec du WebGL casserait l'identité du site — et le droit.
   Les images NASA sont libres, celles de l'ESO et de Hubble demandent une
   attribution précise, et une seule erreur suffit à salir un site public.
   Ce qui est à l'écran est calculé, sans exception. C'est déjà la promesse
   qu'on tient sur le trou noir.
4. **Les distances sont vraies.** Aucune compression « pour que ça rentre ».
   Le vide est le sujet, pas un problème de mise en page.
5. **Ne toucher qu'à son fichier.** Les ajouts au registre de sources se font
   dans un fichier à part, que je fusionne.

---

## Ordre

1. Le moteur de zoom (moi) — sans lui rien ne s'assemble.
2. Vague d'agents sur les cinq scènes, en parallèle.
3. Fusion, audit factuel de l'ensemble, mise en ligne.
4. Portage Kerr dans le shader.

---

## Ce que je ne recommande pas

Une boucle d'agents qui s'améliorent tout seuls sans critère mesurable. Ce
projet a déjà montré ce qui rend une boucle utile : **le banc d'essai**. Un
agent à qui on demande « fais mieux » dérive et produit du remplissage ; un
agent à qui on demande « fais passer ce test » converge.

Donc toute boucle autonome, ici, doit avoir un tableau de bord : des tests qui
passent ou échouent. Pour Kerr, ce tableau existe. Pour « écris une belle scène
sur le nuage d'Oort », il n'existe pas — et c'est pour ça que ces scènes-là sont
relues par un humain et par l'agent d'audit avant publication.
