# Les règles de la base

Le « mode test » que `config.js` te fait choisir ouvre la base à qui connaît
l'adresse, et Google la referme automatiquement au bout de trente jours. Pour
jouer entre nous ce mois-ci, c'est parfait. Pour que ça dure, non.

Voici quoi coller à la place, et quand.

---

## Quand ?

Deux signes :

- Google t'envoie un courriel disant que les règles de test vont expirer.
- Ou le multijoueur se met à afficher « La base a répondu 401 ».

Dans les deux cas, c'est le même geste.

---

## Où ?

Dans la console Firebase : ta base → onglet **Règles** → tu remplaces tout ce
qu'il y a par le bloc ci-dessous → **Publier**.

---

## Quoi

```json
{
  "rules": {
    "salons": {
      "$code": {
        ".read": "$code.length === 4",
        ".write": "$code.length === 4",
        ".validate": "newData.hasChildren(['hote']) || !newData.exists()",

        "joueurs": {
          "$joueur": {
            "nom":   { ".validate": "newData.isString() && newData.val().length <= 20" },
            "score": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$autre": { ".validate": true }
          }
        }
      }
    },
    "$reste": {
      ".read": false,
      ".write": false
    }
  }
}
```

---

## Ce que ça change

- **Seuls les salons existent.** Le `$reste` à `false` ferme tout le reste de la
  base : personne ne peut se servir de ton projet Firebase pour y stocker
  autre chose.
- **Les codes font quatre lettres.** Une adresse fantaisiste est refusée.
- **Les noms sont bornés à vingt caractères** et les scores sont des nombres
  positifs. Sans ça, un plaisantin peut se donner neuf millions de points ou
  coller un roman à la place de son prénom.

Ce que ça ne change **pas**, et il faut le savoir : qui connaît un code de
salon peut y écrire. C'est le prix d'un jeu sans comptes ni mots de passe, et
pour une soirée entre nous c'est le bon compromis. Si un jour le quiz sert à
des inconnus, il faudra passer par une vraie authentification — dis-le-moi à ce
moment-là.

---

## D'où viennent ces règles

De la documentation de Firebase :

- Les règles de sécurité de la Realtime Database —
  <https://firebase.google.com/docs/database/security>
- L'API REST et le flux d'événements employés par `salon.js` —
  <https://firebase.google.com/docs/database/rest/retrieve-data>
- L'annonce du flux pour l'API REST, qui décrit les événements `put`, `patch`,
  `keep-alive`, `cancel` et `auth_revoked` —
  <https://firebase.blog/posts/2014/03/announcing-streaming-for-firebase-rest/>

`salon.js` ne charge aucune bibliothèque de Google : il parle à la base en HTTP
tout simple, et suit les changements avec un `EventSource`, que le navigateur
sait faire depuis toujours. C'est pour ça que le site n'a aucune dépendance.
