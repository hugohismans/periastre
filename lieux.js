/* ============================================================================
   LES LIEUX — l'endroit où l'on se trouve, et le seul chemin pour en changer.

   C'est la fondation F1. Avant elle, se déplacer voulait dire basculer un
   drapeau puis recopier une liste de conséquences chez chaque appelant : il
   suffisait d'en oublier une pour laisser un état mort — un voyage armé pour
   toujours, une sonde fantôme, une capture de pointeur qu'on ne récupérait
   plus. La refonte a rangé tout cela derrière une valeur unique, `lieu`, avec
   UNE seule écriture et deux fonctions qui énumèrent ce que coûte une sortie et
   ce que coûte une entrée.

   Ce fichier sort cette machine de la page. Ce qu'elle garantissait n'était
   éprouvable qu'en ouvrant un navigateur ; c'est maintenant éprouvable en
   ligne de commande, et la salle de tir balistique arrivera dans un fichier
   qu'un outil interroge plutôt que dans quatre mille lignes de portée globale.

   ---------------------------------------------------------------------------
   LE CONTRAT — TROIS RÈGLES ABSOLUES

   1. Une IIFE qui pose `global.LIEUX = { … }`, et rien d'autre.
   2. **Aucune lecture de `window`** dans le corps du module. Le seul `window`
      du fichier est l'argument de l'IIFE, à la dernière ligne, comme dans tous
      les autres modules du dépôt ; un outil passe un objet nu à la place.
   3. **Tout arrive en argument.** Aucune portée lexicale sur quoi que ce soit
      de la page : ni `lieu`, ni `sondes`, ni `TELESCOPE`, ni `document`, ni
      `T`. Le module ne connaît que ce qu'on lui tend.

   ---------------------------------------------------------------------------
   LE MONDE — l'état, qui n'est pas dans le module

   Le module n'a aucune variable vivante. Il reçoit `monde`, le sac des cinq
   morceaux d'état qu'une transition touche, et il écrit DEDANS. C'est ce qui
   rend l'invariant observable : après un appel, tout ce qui a bougé est dans
   l'objet qu'on a passé, et il n'y a rien à aller chercher ailleurs.

     monde.lieu          "libre" | "salon" | "sonde"   ← lecture ET écriture
     monde.sondeSuivie   l'indice embarqué, ou null    ← lecture ET écriture
     monde.telescope     { ouvert, trajet, retour, … }   l'objet TELESCOPE
     monde.recul         { actif, … }                    l'objet RECUL.etat
     monde.cinema        { actif }                       le plan d'ouverture

   Dans la page, `lieu` et `sondeSuivie` sont deux `let` du bloc A, lus à des
   dizaines d'endroits. L'adaptateur les expose en accesseurs :

       const monde = { telescope: TELESCOPE, recul: RECUL.etat, cinema };
       Object.defineProperty(monde, "lieu", {
         get(){ return lieu; }, set(v){ lieu = v; } });        // ← l'unique écriture
       Object.defineProperty(monde, "sondeSuivie", {
         get(){ return sondeSuivie; }, set(v){ sondeSuivie = v; } });

   C'est exactement le motif que la page emploie déjà pour `salon.actif`, et il
   laisse le compte des écritures de `lieu` là où F1 l'a mis : une.

   Le module n'écrit JAMAIS `salon.actif`. `salon.actif` est une vue sur `lieu`,
   et son `set` rappelle `vaAu` : y écrire d'ici serait une récursion muette.

   **Pas de `mondeNeuf()` ici, délibérément.** Un contrôle qui prendrait sa
   fixture dans le module qu'il contrôle validerait le module contre lui-même —
   c'est la règle 3 du projet. L'outil déclare la forme qu'il croit juste ; si
   elle est incomplète, le module casse bruyamment, ce qui est le bon échec.

   ---------------------------------------------------------------------------
   LE CONTEXTE — ce qui arrive à chaque appel

     e.meilleureSonde()   rend un indice de sonde tenable, ou null.
                          FACULTATIF (voir « la garde », plus bas).
     e.ouvreLaQuete       vrai le temps d'entrer au salon pour la quête
                          d'accueil, ce qui musèle la réplique d'arrivée.

   Rien de plus. `e` peut être omis.

   ---------------------------------------------------------------------------
   CE QUE LE MODULE EXPOSE

     LIEUX.CONNUS                      ["libre", "salon", "sonde"]
     LIEUX.quitteLieu(monde, ancien)   → ordres partiels
     LIEUX.entreLieu(monde, nouveau, e)→ ordres partiels
     LIEUX.barre(monde)                → { auSalon, cle }   (descripteur)
     LIEUX.vaAu(monde, vers, e)        → le résultat, décrit ci-dessous

   `CONNUS` est une DONNÉE du module. Un contrôle qui s'en servirait comme
   référence se rendrait complice : ajouter « tir » à cette liste sans rien
   câbler lui ferait accepter `lieu === "tir"`. Qu'il énumère ses lieux
   lui-même, et qu'il vérifie que les deux listes coïncident — l'écart devient
   alors un échec au lieu d'un angle mort.

   ---------------------------------------------------------------------------
   `vaAu` REND TOUJOURS UN OBJET

     { de, vers, change, refus, ordres }

     change   vrai si `monde.lieu` a effectivement changé
     refus    null · "deja-la" · "aucune-sonde"
     ordres   {} quand `change` est faux

   Jamais `null`. Rendre `null` confondrait « on y était déjà » et « le lieu a
   refusé qu'on y entre », et c'est précisément la distinction que la refonte a
   payée : `VERIF.lieux()` éprouve la diagonale (aller là où l'on est doit être
   un non-événement) ET le refus (entrer sur une sonde quand il n'y en a
   aucune). Deux choses différentes, deux réponses différentes.

   ---------------------------------------------------------------------------
   LES ORDRES — et l'ordre dans lequel la page les exécute

   Le module DÉCIDE et pose l'état ; la page PEINT et appelle les domaines qui
   ne sont pas les siens. Toutes les clés sont vraies quand elles sont là et
   absentes sinon — jamais `false`, pour qu'un `if(ordres.x)` suffise.

     1. cacheChrono       retirer « vu » de #chrono
     2. fermeInstrument   retirer « vu » de #instrument
                          (`monde.telescope.ouvert` est DÉJÀ posé par le module)
     3. relachePointeur   document.exitPointerLock()
     4. boutonSonde       majBoutonSonde()
     5. poseSalon         poseSalon()
     6. reaction          reagit(ordres.reaction)
     7. barre             peindre la barre du bas depuis le descripteur
     8. majCamera         majCamera()

   **Cet ordre est le contrat, pas une suggestion.** Il reproduit celui de la
   page, et une contrainte y est dure : `poseSalon` (5) place le vaisseau, et
   `majCamera` (8) lit cette place. Les inverser donnerait une image de
   l'orbite précédente à l'entrée du salon.

   Le descripteur de la barre :

       { auSalon: booléen, cle: "dock.salon.quitter" | "dock.salon" }

   Ni `T` ni sélecteur : la page traduit et peint les trois bascules — la classe
   « actif » du bouton, son texte, la classe « au-salon » du corps de page. Un
   contrôle peut alors exiger, pour chaque lieu connu, que
   `barre(monde).auSalon === (monde.lieu === "salon")`, sans table de langue.

   ---------------------------------------------------------------------------
   L'INVARIANT QUI COMPTE, ET COMMENT IL SE VÉRIFIE DE DEHORS

   Après n'importe quel `vaAu`, quel qu'en soit le résultat :

     1. `monde.lieu` vaut exactement une valeur de `CONNUS`
     2. `monde.sondeSuivie !== null`  ⟺  `monde.lieu === "sonde"`
     3. `monde.telescope.trajet` est nul dès que `monde.lieu !== "salon"`
     4. `monde.recul.actif` est faux dès que `monde.lieu !== "salon"`
     5. `monde.cinema.actif` est faux dès que `monde.lieu !== "libre"`
     6. `monde.telescope.ouvert` est faux dès que `monde.lieu !== "salon"`
     7. `barre(monde).auSalon === (monde.lieu === "salon")`

   Il n'y a **pas** de `LIEUX.invariants()` dans ce fichier, et c'est voulu. Un
   module qui exécute les transitions ET déclare ce qui est vrai après elles se
   corrige tout seul : on oublie d'éteindre le voyage, on ajuste l'invariant
   d'à côté, et le contrôle passe. La liste ci-dessus est de la PROSE ; l'outil
   la réécrit en code, chez lui, et sa vérité vient d'ailleurs que d'ici.

   Ce que le module garantit en revanche, et qui est ce qui rend la
   vérification possible : **tout ce qu'une transition touche est dans `monde`**.
   Rien ne fuit par une variable de page, rien ne se cache dans le DOM. Les
   sept lignes ci-dessus se lisent sur un objet, dans un processus node, en
   quelques millisecondes.

   ---------------------------------------------------------------------------
   LA GARDE `typeof meilleureSonde === "function"`

   Elle est gardée, et son sens change.

   Dans la page, elle ne pouvait pas être fausse : `meilleureSonde` est une
   déclaration de fonction, hissée dès le début de son bloc — le nom existe
   avant la première ligne exécutée. Elle est née défensive dans le commit qui a
   ajouté la précondition, sans avoir jamais rien attrapé. Deux cas la rendent
   réelle aujourd'hui : le découpage du 8 août a mis `meilleureSonde` dans le
   bloc A et `vaAu` dans le bloc B, et un bloc A qui ne se compile pas laisse un
   bloc B vivant sans ce nom ; surtout, `meilleureSonde` est désormais une
   DÉPENDANCE INJECTÉE, qu'un appelant peut légitimement ne pas fournir —
   `verif.js` et `juge.js` appellent `vaAu` pour remettre un lieu en place, pas
   pour embarquer.

   Sans la garde, `vaAu(monde, "sonde")` sans contexte jetterait une exception
   au lieu de refuser. Refuser est le comportement documenté ; jeter ne l'est
   pas.

   ---------------------------------------------------------------------------
   CE QUI N'A PAS PU RESTER PUR

   `quitteLieu` et `entreLieu` écrivent dans `monde.telescope`, `monde.recul` et
   `monde.cinema`, qui appartiennent à trois autres domaines. On aurait pu les
   faire sortir en ordres, comme `poseSalon` — mais alors trois des sept
   invariants ne seraient plus vérifiables ici : ils diraient « le module a bien
   demandé qu'on éteigne le voyage », pas « le voyage est éteint ». Or c'est
   l'extinction qui a été payée une fois, pas la demande. Ces trois écritures
   sont l'exception assumée, et c'est ce qui met les invariants 3, 4, 5 et 6 à
   portée d'un outil sans navigateur.

   La ligne de partage retenue : ce qui peut être FAUX sort de ce fichier
   posé ; ce qui n'est que de la peinture ou du calcul d'un autre domaine sort
   en ordre.

   ---------------------------------------------------------------------------
   REPRODUIT TEL QUEL, ET SIGNALÉ PLUTÔT QUE CORRIGÉ

   1. **`vaAu` n'a pas de liste blanche.** `vaAu(monde, "telescope")` pose
      `monde.lieu = "telescope"` sans un mot, ce que l'invariant 1 déclare
      impossible. Ce n'est pas théorique : `verif.js` le fait, ligne 767, et
      tourne trois cents images dans cet état avant de restaurer. Ajouter le
      refus ici casserait ce contrôle-là — c'est un arbitrage, pas une
      extraction, et il ne se glisse pas dans un déménagement.

   2. **La sortie du salon ferme l'instrument, toujours.** `fermeTelescope()`
      est appelée hors du `if(trajet)`, donc `telescope.ouvert` retombe même
      quand rien n'était ouvert. Sans effet, et conservé.

   3. **`monde.telescope.carte` et `.grille` survivent à la sortie du salon.**
      Le fondu vers la carte des étoiles n'est éteint par aucune branche ; seul
      `trajet` et `retour` le sont. La page le rattrape ailleurs, à l'image.
      Aucun invariant ne le couvre, et rien n'est ajouté ici.
   ============================================================================ */

(function(global){
"use strict";

/* Trois lieux aujourd'hui. Le télescope n'en est pas un : on s'y tient DANS le
   salon, debout devant l'instrument, et son panneau est un état d'interface —
   pas un endroit. Le centre de contrôle et la salle de tir, eux, en seront :
   un mot dans cette liste, et une branche dans chacune des deux fonctions
   ci-dessous. */
const CONNUS = ["libre", "salon", "sonde"];

/* ---------------------------------------------------------------------------
   QUITTER — ce qu'un lieu emporte avec lui

   Écrit une fois, ici. Chaque branche répond à une question unique : qu'est-ce
   qui n'a plus de sens une fois qu'on n'est plus là ?                        */
function quitteLieu(monde, ancien){
  const ordres = {};

  if(ancien === "salon"){
    /* LE SÉJOUR S'INSCRIT AU CARNET — l'ordre du carnet du voyageur, 10 août.

       Les deux horloges du salon tournent depuis l'entrée (`poseSalon` les
       remet à zéro) et s'affichent sur un écran de bord — puis leur contenu
       était JETÉ à la sortie. Calculé, montré, perdu : la moitié manquante de
       la « meilleure mécanique proposée » du carnet d'idées.

       Le module DEMANDE l'inscription, il ne la fait pas : les horloges vivent
       dans `salon`, qui appartient à la page, et le registre est à elle aussi.
       C'est le même partage que `decroche` dans `camera.js`. La page applique
       aussi le seuil d'affichage — un séjour dont l'écart s'afficherait
       « +0 min » n'apprend rien. */
    ordres.inscritSejour = true;
    /* Un voyage en cours meurt avec le salon.

       L'avancement du trajet n'est calculé que depuis la branche du salon : en
       sortir pendant un vol le laissait armé pour toujours, sans jamais
       avancer, et la carte des étoiles restait figée à l'opacité qu'elle avait.
       On ne pouvait plus ni arriver ni revenir. Ce défaut a été payé une fois. */
    if(monde.telescope.trajet){
      monde.telescope.trajet = null;
      monde.telescope.retour = false;
      monde.recul.actif = false;
      ordres.cacheChrono = true;
    }
    /* `fermeTelescope()` coupée en deux : l'état est posé ici, où un outil le
       lit ; la classe qui le montre sort en ordre. */
    monde.telescope.ouvert = false;
    ordres.fermeInstrument = true;
    /* La capture du pointeur n'a de sens que dans le salon : la vue libre se
       pilote à la souris, et la garder prisonnière oblige à deviner Échap pour
       récupérer le curseur. */
    ordres.relachePointeur = true;
  }

  /* On vide la sonde ICI, directement, sans repasser par `embarque` — qui
     rappellerait `vaAu` en pleine transition. Le cycle serait silencieux et
     sans fin : exactement le genre de piège que cette refonte doit supprimer,
     pas déplacer. */
  if(ancien === "sonde"){
    monde.sondeSuivie = null;
    ordres.boutonSonde = true;
  }

  return ordres;
}

/* ---------------------------------------------------------------------------
   ENTRER — ce qu'un lieu demande en arrivant                                 */
function entreLieu(monde, nouveau, e){
  const ctx = e || {};
  const ordres = {};

  // Toute prise de commande interrompt le plan d'ouverture : on n'impose pas
  // d'attendre la fin d'une animation à quelqu'un qui a touché quelque chose.
  if(nouveau !== "libre") monde.cinema.actif = false;

  if(nouveau === "salon"){
    ordres.poseSalon = true;
    // Muette quand c'est la quête d'accueil qui nous dépose : une seule voix
    // à la fois.
    if(!ctx.ouvreLaQuete) ordres.reaction = "salon";
  }

  return ordres;
}

/* ---------------------------------------------------------------------------
   LA BARRE DU BAS reflète le lieu, elle ne le décide pas.

   Fonction pure de `monde.lieu`, sans DOM et sans langue : la page peint, un
   contrôle compare.                                                          */
function barre(monde){
  const auSalon = monde.lieu === "salon";
  return { auSalon, cle: auSalon ? "dock.salon.quitter" : "dock.salon" };
}

/* ---------------------------------------------------------------------------
   ALLER QUELQUE PART — le seul chemin                                        */
function vaAu(monde, vers, e){
  const ctx = e || {};
  const de = monde.lieu;

  if(vers === de) return { de, vers, change: false, refus: "deja-la", ordres: {} };

  /* UN LIEU PEUT REFUSER QU'ON Y ENTRE.

     `embarque()` pose `sondeSuivie` AVANT d'appeler `vaAu`, et c'est le seul
     chemin légitime — mais rien ne l'impose. `vaAu` sur « sonde » appelé seul
     laisserait `lieu === "sonde"` avec `sondeSuivie === null`, c'est-à-dire
     exactement l'état que l'invariant déclare impossible.

     La précondition vit ici, à côté de l'unique écriture qu'elle protège. Elle
     ne change rien aujourd'hui ; elle changera tout le jour où la salle de tir
     ajoutera un quatrième lieu avec sa propre condition d'entrée, et c'est ce
     jour-là qu'on ne veut pas avoir à y penser. */
  if(vers === "sonde" && monde.sondeSuivie === null){
    // Voir « LA GARDE » dans l'en-tête : dépendance injectée, donc absente est
    // un cas légitime, et l'on refuse au lieu de jeter.
    const i = (typeof ctx.meilleureSonde === "function") ? ctx.meilleureSonde() : null;
    if(i === null || i === undefined)
      return { de, vers, change: false, refus: "aucune-sonde", ordres: {} };
    monde.sondeSuivie = i;
  }

  const ordres = quitteLieu(monde, de);
  monde.lieu = vers;                    // ← l'unique écriture du domaine
  Object.assign(ordres, entreLieu(monde, vers, ctx));
  ordres.barre = barre(monde);
  ordres.majCamera = true;

  return { de, vers, change: true, refus: null, ordres };
}

global.LIEUX = { CONNUS, quitteLieu, entreLieu, barre, vaAu };

})(window);
