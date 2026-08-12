/* ============================================================================
   LA SEULE LIGNE QUE TU DOIS REMPLIR, HUGO.

   Le multijoueur a besoin d'un endroit où les téléphones se parlent. Google
   prête ça gratuitement, et il ne faut qu'UNE adresse — pas de mot de passe,
   pas de clé secrète, pas de compte à créer pour les joueurs.

   ---------------------------------------------------------------------------
   COMMENT L'OBTENIR — cinq minutes, une seule fois

   1. Va sur  https://console.firebase.google.com  et connecte-toi avec ton
      compte Google.
   2. « Créer un projet ». Appelle-le par exemple  quiz-quaregnon.
      Tu peux refuser Google Analytics, on n'en a pas besoin.
   3. Dans le menu de gauche : « Créer » → « Realtime Database » → « Créer une
      base de données ».
      - Emplacement : choisis  **Belgium (europe-west1)**  si on te le propose.
      - Règles de sécurité : choisis  **mode test**.
   4. En haut de la page de la base, une adresse s'affiche. Elle ressemble à :

          https://quiz-quaregnon-default-rtdb.europe-west1.firebasedatabase.app

      Copie-la et colle-la ci-dessous, entre les guillemets, à la place du vide.

   C'est tout. Enregistre le fichier, recharge le site, le multijoueur s'allume.

   ---------------------------------------------------------------------------
   DEUX AVERTISSEMENTS HONNÊTES

   Le « mode test » ouvre la base à qui connaît l'adresse, et Google la referme
   au bout de trente jours. C'est parfait pour jouer entre nous ce mois-ci, et
   ce n'est pas fait pour durer.

   Quand les trente jours approchent, ou si tu veux verrouiller tout de suite,
   remplace les règles par celles écrites dans REGLES-FIREBASE.md : elles
   n'autorisent que les salons du quiz, et rien d'autre.
   ============================================================================ */

"use strict";

const CONFIG = {

  /* ↓↓↓  COLLE TON ADRESSE ICI  ↓↓↓ */
  base: "",
  /* ↑↑↑                        ↑↑↑ */

  /* Le temps laissé pour répondre, en secondes. */
  secondesParQuestion: 25,

  /* Combien de questions dans une partie. */
  questionsParPartie: 10,

  /* Au-delà de ce silence, le meneur considère qu'un joueur est parti.
     Mesuré entre joueurs, jamais contre l'horloge du téléphone : deux
     téléphones ne sont jamais à la même heure, et on s'est déjà fait avoir. */
  secondesAvantOubli: 45
};

if (typeof module !== "undefined" && module.exports) module.exports = { CONFIG };
