/* ============================================================================
   L'ACCUEIL — QUI ARRIVE, ET CE QU'ON LUI MONTRE

   C'est la porte du site : l'écran d'entrée, la présentation, la question du
   niveau de lecture, les trois portes de départ, le menu des expériences. Tout
   le monde passe par là, et personne ne l'a jamais éprouvé.

   ---------------------------------------------------------------------------
   POURQUOI CE DOMAINE-LÀ EST DANGEREUX

   Il ne se joue qu'une fois par visiteur, et jamais pour celui qui développe :
   dès le deuxième rechargement, la mémoire porte `deja` et l'on ne revoit plus
   le premier passage. Les chemins du premier arrivant sont donc exactement ceux
   que personne ne regarde — et ce sont les seuls qui comptent, puisqu'un
   testeur qui reçoit un lien n'a que celui-là.

   Le bouton « rejouer la quête » existe d'ailleurs pour ça : il efface `deja`
   pour qu'un rechargement rejoue le premier passage en entier.

   ---------------------------------------------------------------------------
   CE QUI SORT ICI, ET CE QUI RESTE DANS LA PAGE

   Le partage est celui de `progression.js` : le module DÉCIDE, la page PEINT.

   - Les DESCRIPTEURS disent QUOI montrer : un titre, un chapô, des cartes, des
     boutons. Ils portent des CLÉS de libellé (`{ cle:"accueil.titre" }`) et des
     CHEMINS dans `contenu.js` (`{ contenu:"accueil.bienvenue" }`), jamais du
     texte traduit. Un contrôle peut alors comparer des clés sans charger une
     table de langue, et l'on voit tout de suite si le module s'est mis à
     traduire tout seul.
   - Les ORDRES disent QUOI FAIRE : cacher l'accueil, entrer au salon, ranger,
     lancer la quête, se taire. La page les exécute, dans l'ordre où elle les
     exécutait déjà.

   Ne sortent pas, et ne sortiront jamais : les nœuds du document, les classes
   CSS, le `document.write` des fichiers de langue, et le son. Le module dit
   « il y a de la musique à lancer, à ce volume » ; c'est tout ce qu'il en sait.

   ---------------------------------------------------------------------------
   LA MÉMOIRE ARRIVE, ELLE NE SE PREND PAS

   Comme dans `progression.js`, et pour la même raison : un réglage qui survit à
   un rechargement est un réglage qu'on ne pense plus à soupçonner.

   Ce domaine touche à DEUX mémoires, sous deux clés différentes, et c'est
   pourquoi il reçoit deux adaptateurs plutôt qu'un :

       e.memoire        la mémoire de la langue — `{ lit, ecrit }`
                        `lit()` rend la chaîne rangée, ou null.

   Le reste — ce que `deja` et `niveau` valent — n'arrive pas par un adaptateur
   du tout : il arrive DÉJÀ LU, en `e.brut`, parce que c'est `progression.js`
   qui tient cette clé-là et qui l'a déjà filtrée. Deux modules qui liraient la
   même clé chacun de son côté, c'est la soupe de drapeaux : un seul lecteur.

   ---------------------------------------------------------------------------
   `iNiveau` SE REÇOIT ET SE REND — IL NE SE LIE PAS

   Le piège du dépôt, payé une fois sur `nChute` : un scalaire réassigné ne se
   partage pas entre deux fichiers. `iNiveau` vit dans la page, il est lu par
   les fiches, par le dossier, par Lumen. Le module ne le garde nulle part : il
   le reçoit en argument quand il en a besoin, et il le rend en ORDRE quand il
   change (`{ iNiveau: i }`). C'est la page qui écrit.

   ---------------------------------------------------------------------------
   L'ÉTAT N'EST PAS DANS LE MODULE

   `etatNeuf()` rend un objet que l'appelant garde et repasse. Aucune variable
   vivante ici : deux parcours peuvent se jouer côte à côte dans le même
   processus, et un contrôle repart d'un état propre sans rien réinitialiser.

   ---------------------------------------------------------------------------
   LE CONTRAT

     ACCUEIL.LANGUES              ["fr","en"]
     ACCUEIL.LANGUE_DEFAUT        "fr" — celle d'un navigateur muet
     ACCUEIL.PORTES               ["libre","salon","missions"]
     ACCUEIL.DELAI_NIVEAU_ABANDON 500 ms — quand la quête est refermée à la croix

     ACCUEIL.langue(e)            e = { memoire, navigateur }
                                  → { code, source, html,
                                      fichierContenu, fichiersInterface }
     ACCUEIL.boutonsLangue(code)  la fabrique des deux boutons
     ACCUEIL.choisitLangue(e)     e = { code, courante } → { range, recharge } ou null
     ACCUEIL.niveauValide(i, n)   le prédicat des bornes

     ACCUEIL.etatNeuf()           { ecran, dejaVenu, dejaNiveau, voixActive,
                                    entree, presentationVue, embarque,
                                    niveauRepondu }

     ACCUEIL.arrivee(etat, e)     e = { brut, iNiveau, nNiveaux }
     ACCUEIL.ouvre(etat)          l'écran d'entrée
     ACCUEIL.entre(etat, e)       e = { son, volumeMusique } → les ordres
     ACCUEIL.presentation(e)      e = { temps } → les trois écrans, ou { joue:false }
     ACCUEIL.finPresentation(etat)  → les ordres de l'embarquement
     ACCUEIL.faudraDemanderNiveau(etat)
     ACCUEIL.ecranNiveau(e)       e = { niveaux }
     ACCUEIL.choisitNiveau(etat, e) e = { i, nNiveaux }
     ACCUEIL.ecranDepart()
     ACCUEIL.choisitPorte(etat, e)  e = { id }
     ACCUEIL.ecranMenu(etat, e)   e = { experiences, missions, acquis }
     ACCUEIL.ecranDetail(x)
     ACCUEIL.choisitExperience(etat, e)  e = { id }
     ACCUEIL.oublieTout(etat)
     ACCUEIL.rejoue(brut)         la mémoire sans `deja`, pour rejouer l'entrée

   ---------------------------------------------------------------------------
   CINQ CHOSES DE L'ORIGINAL QUI SONT REPRODUITES TELLES QUELLES

   Elles paraissent fausses. Elles le sont probablement. Rien n'est corrigé ici :
   ce fichier doit rester interchangeable avec ce qu'il remplace, et une
   correction glissée dans une extraction est une correction que personne n'a
   relue. Chacune a son contrôle dans `outil-verif-accueil.js`, qui la FIGE sans
   l'approuver.

   1. **`dejaNiveau` ne dit pas « a répondu », il dit « est déjà venu ».**
      La page le calcule une fois, au chargement, par
      `Number.isInteger(memoire.niveau)`. Or le simple fait de franchir la porte
      appelle `sauve()`, qui range `niveau: 0` — la valeur du code, pas une
      réponse. Quiconque entre puis recharge avant la fin de la quête ne se verra
      donc JAMAIS poser la question du niveau de lecture, et restera au niveau 0
      sans l'avoir choisi. C'est le défaut le plus lourd de ce domaine.

   2. **Et dans l'autre sens : `dejaNiveau` est figé pour la session.** Une
      seconde fin de quête dans la même session (bouton « rejouer ») redemande
      le niveau, puisque la constante n'a pas bougé depuis le chargement.

   3. **Un `niveau` hors bornes entre sans être vu.** `Number.isInteger(-5)` est
      vrai : un `-5` ou un `999` rangé par une version antérieure traverse le
      contrôle de type de `progression.js`, et la fiche affiche alors le texte
      `undefined`. L'ENTRÉE, elle, n'en souffre pas — c'est ce que le contrôle
      mesure. Le module le SIGNALE (`niveauHorsBornes`) sans rien corriger : la
      page est libre d'ignorer le signal, et elle l'ignore aujourd'hui.

   4. **Deux délais pour la même question.** La fin normale de la quête demande
      le niveau après 1200 ms (`progression.js`), la croix de la quête après
      500 ms (ici). Deux nombres pour un seul geste.

   5. **`PR_DUREE` et sa minuterie sont mortes** dans la page : l'auto-défilement
      de la présentation a été retiré, les 5200 ms ne servent plus à rien et
      `clearTimeout` nettoie une minuterie que personne n'arme. Rien de tout cela
      n'est repris ici — ce qui EST une différence, mais une différence sur du
      code mort, et elle est écrite noir sur blanc.
   ============================================================================ */

(function(global){
"use strict";

/* ---------------------------------------------------------------------------
   LA LANGUE

   Elle se décide AVANT tout le reste, puisque c'est elle qui décide du fichier
   de contenu à charger. Trois sources, dans cet ordre :

     1. ce qui est rangé — quelqu'un a cliqué un jour, on ne le contredit pas ;
     2. la langue du navigateur — proposée, jamais imposée ;
     3. le français, quand le navigateur ne dit rien.

   La déduction est volontairement grossière : `fr`, `fr-BE`, `fr-CA` sont du
   français, tout le reste est de l'anglais. Le site n'a que deux langues ; un
   arbitrage plus fin donnerait l'illusion d'un choix qui n'existe pas.        */
const LANGUES = ["fr", "en"];
const LANGUE_DEFAUT = "fr";

/* Les noms sont `fichierContenu` et `fichiersInterface`, et pas `contenu` :
   ailleurs dans ce module, `{ contenu:"accueil.bienvenue" }` désigne un CHEMIN
   dans `contenu.js`. Deux sens pour un même nom de champ, c'est une confusion
   qui se paie au premier outil qui parcourt les descripteurs — le premier l'a
   déjà payée. */
function fichiers(code){
  return {
    /* Le contenu : UN seul fichier, parce que les deux posent `window.CONTENU`
       et que le second gagnerait. */
    fichierContenu: code === "en" ? "contenu.en.js" : "contenu.js",
    /* L'interface : le français TOUJOURS, l'anglais PAR-DESSUS. L'ordre est la
       substance du choix — une clé oubliée en anglais retombe alors sur une
       vraie phrase française, jamais sur un identifiant nu. Inverser les deux
       lignes ne se verrait qu'en anglais, et seulement sur les clés manquantes. */
    fichiersInterface: code === "en" ? ["ui.fr.js", "ui.en.js"] : ["ui.fr.js"],
  };
}

function langue(e){
  e = e || {};
  const rangee = e.memoire ? e.memoire.lit() : null;
  if(LANGUES.indexOf(rangee) >= 0){
    const f = fichiers(rangee);
    return { code: rangee, source: "memoire", html: rangee,
             fichierContenu: f.fichierContenu, fichiersInterface: f.fichiersInterface };
  }
  /* `navigator.language` peut être vide, et l'original repliait alors sur `fr`
     AVANT de tester — donc un navigateur muet donne du français, pas de
     l'anglais. La distinction se voit ici, dans `source`, et nulle part
     ailleurs : à l'écran les deux chemins donnent la même page. */
  const dit = e.navigateur;
  const code = /^fr/i.test(dit || LANGUE_DEFAUT) ? "fr" : "en";
  const f = fichiers(code);
  return { code, source: dit ? "navigateur" : "defaut", html: code,
           fichierContenu: f.fichierContenu, fichiersInterface: f.fichiersInterface };
}

/* Les deux boutons de langue sortent d'ICI et d'un seul endroit, parce que la
   page en pose DEUX exemplaires — un dans les réglages, un sur l'accueil. Deux
   fabriques pour un seul réglage, c'est la garantie qu'un jour l'une des deux
   oubliera d'enregistrer, ou marquera l'actif au mauvais endroit. */
const NOMS_LANGUE = { fr: "Français", en: "English" };
function boutonsLangue(courante){
  return LANGUES.map(code => ({
    code, nom: NOMS_LANGUE[code], court: code.toUpperCase(),
    actif: code === courante,
  }));
}

/* Rend null quand il n'y a rien à faire — c'est le cas de loin le plus
   fréquent, puisqu'un des deux boutons porte toujours la langue en cours.
   Changer de langue change le fichier de contenu : il faut recharger. */
function choisitLangue(e){
  e = e || {};
  if(LANGUES.indexOf(e.code) < 0) return null;
  if(e.code === e.courante) return null;
  return { range: e.code, recharge: true };
}

/* ---------------------------------------------------------------------------
   LES BORNES DU NIVEAU DE LECTURE

   `progression.js` accepte tout entier ; il n'a aucun moyen de savoir combien
   de niveaux `contenu.js` porte. C'est donc ici, et seulement ici, qu'on peut
   dire qu'un `-5` n'est pas un niveau. Le prédicat est exposé pour que la page
   puisse s'en servir le jour où l'on décidera de corriger le point 3 de
   l'en-tête — il ne l'utilise pas encore.                                     */
function niveauValide(i, n){
  return Number.isInteger(i) && Number.isInteger(n) && i >= 0 && i < n;
}

/* ---------------------------------------------------------------------------
   L'ÉTAT                                                                     */

function etatNeuf(){
  return {
    // où l'on en est : aucun | intro | presentation | quete | niveau | depart
    //                  | menu | detail | jeu
    ecran: "aucun",
    dejaVenu: false,        // la mémoire portait `deja`
    dejaNiveau: false,      // la mémoire portait un `niveau` entier — voir point 1
    voixActive: false,      // la réponse à la porte
    entree: false,          // la porte a été franchie
    presentationVue: false,
    embarque: false,        // on a été déposé à bord
    niveauRepondu: false,   // on a répondu DANS CETTE SESSION — voir point 2
  };
}

/* ---------------------------------------------------------------------------
   L'ARRIVÉE — ce que la mémoire dit de qui se présente

   `e.brut` est l'objet rangé, tel que `progression.js` l'a rendu : soit null,
   soit un objet. Les deux expressions sont celles de la page, au caractère
   près, et elles sont naturellement solides — `brut && brut.deja` traverse
   sans lever un null, un nombre, une chaîne ou un tableau, et
   `Number.isInteger` dit non à `Infinity`, à `NaN`, à `1.5` et à `"deux"`.

   Rien n'est corrigé ; `niveauHorsBornes` est un SIGNAL, pas une correction.  */
function arrivee(etat, e){
  e = e || {};
  const brut = e.brut;
  const objet = !!brut && typeof brut === "object";
  const dejaVenu   = !!(brut && brut.deja);
  /* `niveauChoisi`, ET NON la présence de `niveau`.

     Ce module avait été écrit pour reproduire la page à la lettre, défaut
     compris — et le défaut était ici. « A-t-on répondu ? » se décidait sur la
     PRÉSENCE de `niveau` en mémoire, or franchir la porte d'entrée range déjà
     `niveau: 0` : la valeur du code, pas un choix. Quiconque entrait puis
     rechargeait avant la fin de la quête n'avait plus jamais la question, et
     restait en « Découverte » sans l'avoir demandé.

     Réparé dans la page le 9 août, avec un drapeau posé au seul endroit où l'on
     répond vraiment. Le module suit — sinon le brancher réintroduirait ce qu'on
     vient de corriger, ce qui est la pire façon de déménager du code.

     Les mémoires d'avant ne portent pas ce drapeau : elles reposeront la
     question une fois. C'est le bon défaut — on la repose à qui n'a peut-être
     pas répondu, plutôt que de la taire à qui n'a pas pu. */
  const dejaNiveau = !!(brut && brut.niveauChoisi === true);

  etat.dejaVenu = dejaVenu;
  etat.dejaNiveau = dejaNiveau;

  return {
    dejaVenu, dejaNiveau,
    premierPassage: !dejaVenu,
    /* La page ne repeint la fiche et ne marque les boîtiers que s'il y avait
       quelque chose à restaurer. Sur une mémoire absente, elle ne touche à
       rien : les valeurs du code restent en place. */
    restaure: objet,
    repeintFiche: objet,
    /* Reçu, rendu, jamais lié. La page repose ce nombre là où il vit. */
    iNiveau: e.iNiveau,
    niveauHorsBornes: objet && !niveauValide(e.iNiveau, e.nNiveaux),
  };
}

/* ---------------------------------------------------------------------------
   L'ÉCRAN D'ENTRÉE

   Premier temps : rien que l'image. Le décor tourne déjà derrière, autant le
   laisser parler avant d'expliquer quoi que ce soit. D'où `nu` — l'accueil sans
   ses cartes.

   Et l'on DEMANDE avant de parler : une voix qui démarre toute seule est
   désagréable, et elle se coupe toujours trop tard. Les deux boutons sont donc
   la même question posée deux fois, et il n'y a pas de troisième réponse.    */
function ouvre(etat){
  etat.ecran = "intro";
  return {
    ecran: "intro",
    nu: true,
    auMenu: true,
    cacheBoutonMenu: true,
    titre: { cle: "accueil.titre" },
    chapo: { contenu: "accueil.bienvenue" },
    colonnes: "1fr",
    centre: true,
    boutons: [
      { id: "acc-go",   cle: "accueil.entrer.voix", son: true  },
      { id: "acc-muet", cle: "accueil.entrer.muet", son: false },
    ],
  };
}

/* Franchir la porte.

   Trois choses s'y décident, et la troisième est l'aiguillage de tout le
   domaine :

     - la voix est acceptée ou refusée, et ça se range tout de suite ;
     - la musique ne démarre QUE si le son a été accepté ET qu'un volume non nul
       traîne dans les réglages ;
     - qui est déjà venu va droit au menu ; qui arrive pour la première fois a
       droit à la présentation, puis on l'embarque.

   `volumeMusique` traverse tel quel, sans être revérifié. Le contrôle de
   finitude est chez `progression.js`, à la LECTURE de la mémoire, et il doit
   rester au singulier : deux modules qui décrivent le même espace ne peuvent
   pas avoir deux lois. C'est écrit ici pour que personne n'ajoute la seconde. */
function entre(etat, e){
  e = e || {};
  const son = !!e.son;
  etat.voixActive = son;
  etat.entree = true;
  const suite = etat.dejaVenu ? "menu" : "presentation";
  etat.ecran = suite;
  return {
    voixActive: son,
    repeintBoutonVoix: true,
    enregistre: true,
    /* L'interrupteur latéral de l'iPhone coupe le son des pages web et rien ne
       permet de le détecter. Le module dit seulement qu'il y a lieu d'avertir ;
       la page décide si l'appareil est concerné et si l'avis a déjà été lu. */
    avertitSon: son,
    musique: son && e.volumeMusique > 0 ? e.volumeMusique : null,
    suite,
  };
}

/* La présentation, en trois temps et pas un de plus.

   Elle est imposée au premier passage — c'est le seul moment où l'on peut dire
   ce qu'est ce site sans que personne ne l'ait déjà décidé à notre place. Mais
   elle est courte, elle s'interrompt d'un geste, et les points disent d'emblée
   combien il en reste : on accepte volontiers trois écrans, on n'accepte pas un
   texte dont on ne voit pas la fin.

   Le libellé du bouton change au dernier écran, parce qu'au dernier écran
   « Suivant » mentirait.

   `joue:false` sur un contenu qui ne porte pas de présentation : un fichier de
   langue plus ancien ne doit pas bloquer l'entrée, il doit la laisser passer. */
function presentation(e){
  const temps = (e && Array.isArray(e.temps)) ? e.temps : [];
  if(temps.length === 0) return { joue: false, suite: "embarque" };
  const dernier = temps.length - 1;
  return {
    joue: true,
    cacheAccueil: true,
    auMenu: false,
    points: temps.length,
    passer: { cle: "pr.passer" },
    ecrans: temps.map((t, i) => ({
      i, sur: t.sur, t: t.t,
      dernier: i === dernier,
      suite: { cle: i === dernier ? "pr.entrer" : "pr.suivant" },
      /* Le premier écran arrive presque tout de suite ; les suivants attendent
         que le précédent ait fini de s'effacer. C'est du fondu, la page
         l'exécute — mais le nombre est une décision, alors il sort. */
      delai: i === 0 ? 40 : 560,
    })),
  };
}

function finPresentation(etat){
  etat.presentationVue = true;
  return embarque(etat);
}

/* L'embarquement.

   Un testeur qui reçoit un lien n'explore pas : il regarde deux minutes. On le
   dépose donc directement à bord, et la quête lui apprend le lieu. Le niveau de
   lecture attend la fin — on ne sait pas répondre à « où en es-tu ? » avant
   d'avoir vu de quoi il s'agit.

   `museleAccueil` couvre l'entrée au salon : sans lui, le passage de lieu
   rouvrirait l'accueil qu'on vient de refermer.                              */
function embarque(etat){
  etat.embarque = true;
  etat.ecran = "quete";
  return {
    cacheAccueil: true,
    auMenu: false,
    enQuete: true,
    museleAccueil: true,
    entreAuSalon: true,
    lanceQuete: true,
  };
}

/* ---------------------------------------------------------------------------
   LE NIVEAU DE LECTURE

   Demandé APRÈS la quête, jamais à l'entrée. Et une seule fois : la garde est
   `dejaNiveau`, c'est-à-dire l'état de la MÉMOIRE au chargement de la page.

   Ce que cette garde ne fait pas — et c'est le point 1 de l'en-tête — c'est
   distinguer « a répondu » de « est déjà venu ». Elle est reproduite telle
   quelle. `etat.niveauRepondu` existe à côté, se remplit, et n'est lu par
   personne : c'est le crochet auquel se pendra la correction, le jour où l'on
   décidera de la faire.

   500 ms est le délai quand la quête est refermée à la croix. La fin normale de
   la quête en emploie un autre, 1200 ms, et il vient de `progression.js`.     */
const DELAI_NIVEAU_ABANDON = 500;

function faudraDemanderNiveau(etat){
  return !etat.dejaNiveau;
}

/* On demande le niveau comme une QUESTION, pas comme un réglage. Les trois
   réponses réutilisent les libellés de `contenu.js` : un seul jeu de textes sert
   au routage, aux fiches et à la voix. */
function ecranNiveau(e){
  const libelles = (e && Array.isArray(e.niveaux)) ? e.niveaux : [];
  return {
    ecran: "niveau",
    nu: false,
    auMenu: true,
    titre: { cle: "accueil.niveau.titre" },
    chapo: { contenu: "accueil.niveau" },
    parle: { contenu: "accueil.niveau" },
    colonnes: "1fr",
    centre: false,
    cartes: libelles.map((n, i) => ({ i, titre: n.titre, detail: n.detail })),
  };
}

function choisitNiveau(etat, e){
  e = e || {};
  etat.niveauRepondu = true;
  etat.ecran = "depart";
  return {
    /* Rendu, pas lié. La page pose ce nombre dans son `iNiveau` à elle, repeint
       la fiche et marque le boîtier. */
    iNiveau: e.i,
    valide: niveauValide(e.i, e.nNiveaux),
    repeintFiche: true,
    marqueNiveau: e.i,
    enregistre: true,
    suite: "depart",
  };
}

/* ---------------------------------------------------------------------------
   PAR OÙ L'ON ENTRE

   Trois manières d'aborder le même objet, et elles ne demandent pas le même
   effort. La vue libre est légère et immédiate — c'est ce qu'il faut sur un
   téléphone, ou quand on veut juste voir. Le vaisseau est un lieu où l'on
   marche : plus lourd, plus lent à comprendre, mais c'est là qu'on a envie de
   rester. Les missions sont le chemin guidé.

   Poser la question évite le pire des défauts : imposer à quelqu'un venu
   regarder deux minutes un décor qu'il faut apprendre à habiter — et
   inversement, priver de vaisseau celui qui serait venu pour ça.             */
const PORTES = ["libre", "salon", "missions"];

function ecranDepart(){
  return {
    ecran: "depart",
    nu: false,
    auMenu: true,
    titre: { cle: "accueil.depart.titre" },
    chapo: { cle: "accueil.depart.chapo" },
    colonnes: "1fr",
    centre: false,
    portes: PORTES.map(id => ({
      id,
      titre:  { cle: "accueil.porte." + id + ".titre"  },
      detail: { cle: "accueil.porte." + id + ".detail" },
    })),
  };
}

/* Rend null sur une porte inconnue plutôt que d'inventer une destination. La
   page n'en pose que trois, donc ce chemin ne s'ouvre pas depuis l'écran ;
   il s'ouvre depuis un outil, et c'est justement là qu'on veut un refus net. */
function choisitPorte(etat, e){
  const id = e && e.id;
  if(PORTES.indexOf(id) < 0) return null;
  etat.ecran = id === "missions" ? "menu" : "jeu";
  return {
    tais: true,
    cinema: false,
    cacheAccueil: true,
    auMenu: false,
    montreBoutonMenu: true,
    entreAuSalon: id === "salon",
    suite: id === "missions" ? "menu" : "jeu",
  };
}

/* ---------------------------------------------------------------------------
   LE MENU DES EXPÉRIENCES

   Le chapô change selon ce qui a déjà été compris. Le pluriel n'est PAS recousu
   dans la phrase : chaque langue apporte ses deux phrases entières, parce
   qu'une phrase à trous se casse dès la troisième langue.

   `acquis` est accepté en `Set` comme en tableau : la page tient un `Set`, un
   outil trouve un tableau plus commode, et refuser l'un des deux ne protégerait
   de rien.                                                                    */
function ecranMenu(etat, e){
  e = e || {};
  const acquis = e.acquis instanceof Set ? [...e.acquis]
               : (Array.isArray(e.acquis) ? e.acquis : []);
  const missions = Array.isArray(e.missions) ? e.missions : [];
  const n = acquis.length;
  etat.ecran = "menu";
  return {
    ecran: "menu",
    nu: false,
    auMenu: true,
    cacheBoutonMenu: true,
    titre: { cle: "accueil.titre" },
    chapo: n === 0
      ? { cle: "accueil.chapo" }
      : { cle: n > 1 ? "accueil.reprise" : "accueil.reprise.un",
          vals: { n, total: missions.length } },
    colonnes: "",
    centre: false,
    cartes: (Array.isArray(e.experiences) ? e.experiences : []).map(x => ({
      id: x.id, duree: x.duree, titre: x.titre, resume: x.resume,
    })),
    /* Une pastille par mission jouable, allumée si elle est comprise. Elle ne
       paraît qu'à partir d'un acquis : sur un compteur à zéro, huit pastilles
       éteintes ressemblent à une punition. */
    pastilles: n ? missions.map(m => ({ id: m.id, titre: m.titre,
                                        acquis: acquis.indexOf(m.id) >= 0 })) : null,
    oubli: n ? { cle: "accueil.oubli" } : null,
  };
}

function ecranDetail(x){
  x = x || {};
  return {
    ecran: "detail",
    colonnes: "1fr",
    id: x.id, duree: x.duree, titre: x.titre, quoi: x.quoi,
    boutons: [
      { id: "acc-go",     cle: "accueil.commencer" },
      { id: "acc-retour", cle: "accueil.retour"    },
    ],
  };
}

function choisitExperience(etat, e){
  etat.ecran = "jeu";
  return {
    tais: true,
    cinema: false,
    miseEnPlace: e && e.id,
    cacheAccueil: true,
    auMenu: false,
    montreBoutonMenu: true,
    suite: "jeu",
  };
}

function oublieTout(etat){
  etat.ecran = "menu";
  return { oublie: true, repeintMission: true, suite: "menu" };
}

/* ---------------------------------------------------------------------------
   REJOUER LE PREMIER PASSAGE

   Le bouton « rejouer la quête » relançait la quête tout de suite, mais un
   rafraîchissement redéposait au menu : la présentation ne se rejouait jamais,
   et il fallait vider la mémoire du navigateur pour la revoir une seule fois.
   En enlevant `deja`, un rechargement rejoue le premier passage en entier.
   C'est ce qui rend ce domaine testable à l'œil.

   Rend l'objet À RANGER, ou null quand il n'y a rien à ranger. Trois cas :

     mémoire absente   → `{}`, exactement ce que l'original écrivait
                         (`JSON.parse(getItem() || "{}")`)
     objet ordinaire   → la copie sans `deja`
     autre chose       → null. L'original y réécrivait la valeur telle quelle,
                         ce qui est indiscernable de ne rien écrire — sauf que
                         sur `null` rangé il levait, et que son `try` avalait.
                         Le refus net est ici le même comportement observable. */
function rejoue(brut){
  if(brut === null || brut === undefined) return {};
  if(typeof brut !== "object" || Array.isArray(brut)) return null;
  const o = {};
  for(const k in brut)
    if(k !== "deja" && Object.prototype.hasOwnProperty.call(brut, k)) o[k] = brut[k];
  return o;
}

global.ACCUEIL = {
  LANGUES, LANGUE_DEFAUT, PORTES, DELAI_NIVEAU_ABANDON,
  langue, boutonsLangue, choisitLangue, niveauValide,
  etatNeuf, arrivee,
  ouvre, entre, presentation, finPresentation,
  faudraDemanderNiveau, ecranNiveau, choisitNiveau,
  ecranDepart, choisitPorte,
  ecranMenu, ecranDetail, choisitExperience, oublieTout,
  rejoue,
};

})(window);
