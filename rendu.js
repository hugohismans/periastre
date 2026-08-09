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

   · LE CIEL DE L'AMAS NUCLÉAIRE. La recherche est FAITE (9 août 2026) et elle
     est dans `contenu.js`, fiche « Le ciel de là-bas », huit sources vérifiées.
     Elle dit quatre choses, et aucune n'est une manette d'une ligne :

       — la densité mesurée vaut six cents millions de fois celle du voisinage
         solaire, soit de l'ordre du million d'étoiles à l'œil nu contre neuf
         mille chez nous (facteur cent à cinq cents, dérivé ici et déclaré) ;
       — il n'y fait JAMAIS nuit : le fond intégré pèse des dizaines à des
         centaines de pleines lunes. Un fond noir est donc faux en soi, et pas
         seulement mal peuplé ;
       — la nébulosité de là-bas EXISTE, mais elle a une forme — trois bras
         ionisés et un anneau de poussière opaque qui découperait une bande
         noire. Éteindre notre voile mauve est donc juste, et insuffisant ;
       — la poussière qui nous cache le centre est dans NOTRE ligne de visée,
         pas là-bas : sur place le ciel est limpide.

     Éteindre la nébuleuse reste la seule chose que ce module peut faire
     honnêtement aujourd'hui. Le reste demande de peindre un ciel, pas de
     pousser un uniforme — et un champ densifié au jugé serait exactement le
     mensonge que ce mode vient corriger.

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
