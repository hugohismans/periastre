/* ============================================================================
   LE RENDU — simulation ou cinéma, et ce que chaque mode commande.

   Idée d'Hugo, 5 août 2026, en découvrant que la nébuleuse du fond est un
   décor : le site promet que tout est calculé, c'est vrai de la géométrie et
   faux du fond de ciel. Deux rendus séparés rendent la promesse lisible —
   l'un ajoute ce qu'un film ajouterait, l'autre s'en prive.

   Sa précision, qui est devenue F4 : « même le mode simulation gardera des
   compromis — et chaque compromis doit se déclarer là où on le rencontre. »
   Les aveux existent depuis le 9 août ; ce module dit lesquels chaque mode
   rend nécessaires.

   ---------------------------------------------------------------------------
   CE QUE CHAQUE MODE COMMANDE — version 1, délibérément étroite

   La seule manette de cette version est LA NÉBULEUSE, parce que c'est la seule
   dont le statut est tranché : elle est inventée, l'aveu « fond-ciel » le dit
   depuis le début, et l'éteindre ne demande aucun fait nouveau.

   Ce qui N'EST PAS encore commandé ici, et pourquoi :

   · LA DENSITÉ DU CHAMP D'ÉTOILES. On est DANS l'amas nucléaire : le vrai ciel
     y est immensément plus riche que le nôtre, mais d'un facteur qui doit être
     SOURCÉ avant d'être montré — la recherche est en cours, et un champ densifié
     au jugé serait exactement le mensonge que ce mode vient corriger.
   · L'EXPOSITION ET L'ÉCLAT DU DISQUE. Ils appartiennent à « Lumière réelle »
     (`uReel`), qui existe déjà et fait ce travail. Son sort — devenir un cran
     du mode ou rester un bouton — se tranche en séance, pas ici.

   ---------------------------------------------------------------------------
   LE CONTRAT

     RENDU.MODES              ["cinema", "simulation"]
     RENDU.DEFAUT             "cinema" — le regard actuel du site. On ne change
                              pas l'image de qui n'a rien demandé ; la bascule
                              est un choix, jamais une surprise.
     RENDU.borne(m)           ramène n'importe quoi sur un mode connu
     RENDU.uniformes(m)       { nebuleuse: 0|1 } — ce que la page pousse au
                              nuanceur, une valeur par manette
     RENDU.descripteur(m)     { mode, cle, uniformes } — `cle` est la clé du
                              libellé, la page traduit

   Rien ne lit `window`, rien ne touche au document : la page tient le mode
   (rangé par `progression.js`), pousse les uniformes, et peint le sélecteur.
   ============================================================================ */

(function(global){
"use strict";

const MODES = ["cinema", "simulation"];

/* « Cinéma » par défaut, et c'est un choix qu'il faut défendre : le mode
   honnête serait un meilleur étendard. Mais le regard actuel du site — celui
   que les amis testent, celui des séances de jugement — EST le rendu cinéma.
   Changer l'image sous les pieds de tout le monde pour un principe serait
   traiter le visiteur comme un argument. Le choix se propose ; il ne s'impose
   pas — la même règle que la voix et la langue. */
const DEFAUT = "cinema";

function borne(m){
  return MODES.indexOf(m) >= 0 ? m : DEFAUT;
}

/* Une valeur par manette, toutes numériques : le nuanceur reçoit des flottants,
   et un booléen déguisé finit toujours par vouloir devenir un fondu. */
function uniformes(m){
  return { nebuleuse: borne(m) === "cinema" ? 1 : 0 };
}

function descripteur(m){
  const mode = borne(m);
  return { mode, cle: "rendu." + mode, uniformes: uniformes(mode) };
}

global.RENDU = { MODES, DEFAUT, borne, uniformes, descripteur };

})(window);
