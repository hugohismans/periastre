/* ============================================================================
   La séance de jugement.

       http://…/?juge

   Il y a des questions qu'aucun calcul ne tranche : est-ce beau, est-ce lisible,
   est-ce que ça se sent. Elles s'accumulaient dans `A-REGARDER.md`, un document
   qu'il faut lire, se rappeler, puis aller vérifier une par une en naviguant
   dans le site. C'est-à-dire : elles ne se traitaient jamais.

   Ici, on ne lit rien et on ne navigue pas. La séance VA CHERCHER la chose, la
   pose sous les yeux, demande, et passe à la suivante. Le seul travail demandé
   est celui que personne d'autre ne peut faire — regarder et dire.

   ---------------------------------------------------------------------------
   CE QUI CHANGE VRAIMENT : LES VARIANTES

   Certaines décisions ne sont pas « est-ce bien ? » mais « laquelle ? ». Pour
   celles-là, les options se comparent EN DIRECT, sur la même vue, d'un bouton à
   l'autre. La console de tir a coûté une heure de tâtonnement parce que je ne
   savais pas dire ce que je voyais ; à l'écran, le choix entre trois places se
   fait en trois secondes.

   Un jugement porté sur deux images côte à côte vaut dix jugements portés de
   mémoire, à vingt minutes d'intervalle.

   ---------------------------------------------------------------------------
   RIEN N'EST ENVOYÉ

   Comme `carnet.html` et `essai.js` : pas de serveur, pas de compte. Le rapport
   se copie à la fin, en Markdown, et s'envoie à la main si on le veut.
   ============================================================================ */

(function(global){
"use strict";

const $$ = id => document.getElementById(id);

/* Poser une scène ne doit JAMAIS casser la séance. Une décision qui n'arrive pas
   à s'afficher se signale et se saute — sans quoi une seule erreur emporterait
   les huit autres, et le testeur repartirait sans rien avoir jugé. */
function sur(f){ try { f(); return null; } catch(e){ return e.message; } }

/* Un élément d'interface est-il réellement sous les yeux ?

   Rend `null` si tout va bien, sinon la raison, en clair. On remonte les
   ancêtres pour l'opacité : un panneau parfaitement opaque posé dans un conteneur
   à zéro est invisible, et c'est très exactement l'état d'`#instrument` tant
   qu'il n'a pas sa classe `vu`. */
function introuvable(quoi){
  let el;
  try { el = quoi(); } catch(e){ return "l'élément à regarder est introuvable : " + e.message; }
  if(!el) return "l'élément à regarder n'existe pas";
  if(!el.isConnected) return "l'élément à regarder n'est pas dans la page";

  const r = el.getBoundingClientRect();
  if(r.width < 1 || r.height < 1) return "l'élément à regarder ne fait aucune taille";
  if(r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight)
    return "l'élément à regarder est hors de l'écran";

  for(let n = el; n && n !== document.body; n = n.parentElement){
    const s = getComputedStyle(n);
    if(s.display === "none")      return "l'élément à regarder est masqué";
    if(s.visibility === "hidden") return "l'élément à regarder est caché";
    if(parseFloat(s.opacity) < 0.05)
      return "l'élément à regarder est transparent — le panneau qui le porte n'est pas ouvert";
  }
  return null;
}

// Se placer dans le salon, debout, à un endroit donné, en regardant où il faut.
function auSalon(x, z, lacet, tangage){
  cinema.actif = false;
  if(lieu !== "salon") vaAu("salon");
  joueur.p = [x, hauteurSol(x, z), z];
  joueur.v = [0, 0, 0];
  salon.lacet = lacet;
  salon.tangage = tangage;
}

// ============================================================ les décisions
/* `ignore: true` retire une question de la file SANS effacer son code.

   Une question répondue disparaît normalement d'ici, commentaire compris — on
   ne garde pas de file morte. Mais l'arrivée du voyage est un cas différent :
   elle est refusée en attendant une refonte, et son gréement (rejouer les deux
   dernières secondes, neutraliser le panneau, rendre le monde comme on l'a
   pris) resservira tel quel. L'effacer pour le réécrire dans trois jours serait
   du gaspillage ; la laisser dans la file coûterait l'œil d'Hugo sur un verdict
   qu'il a déjà rendu.

   ---------------------------------------------------------------------------
   LE 9 AOÛT AU SOIR, CINQ VERDICTS D'UN COUP — et la file s'est retrouvée
   entièrement répondue. Elles portent donc toutes `ignore: true`, avec leur
   verdict et l'angle qu'il a gardé (le tout aussi dans `A-REGARDER.md`).

   Elles ne sont pas effacées, et c'est un choix : le rendu vient de changer
   l'image partout, et le jour où l'on peindra vraiment le ciel de l'amas —
   jamais nuit, la minispirale, la bande opaque — il faudra sans doute rejuger
   le quadrillage et les orbites SOUS CE CIEL-LÀ. Le gréement resservira tel
   quel ; retirer le `ignore` suffira. Ce qui coûte son œil, ce n'est pas le
   code qui dort, c'est la question qu'on lui repose.

   Le même soir, les deux questions du rendu ont suivi. LA FILE EST DONC VIDE —
   sept questions, sept verdicts, en deux séances. `termine()` porte désormais
   ce cas : elle dit « tout est répondu » au lieu de rendre un rapport creux. */
const TOUTES = [

  /* TROIS QUESTIONS ONT DISPARU D'ICI, ET C'EST LE BUT.

     Une séance de jugement doit rétrécir. Les lampes du bord — gardées, avec
     les lampes ; le disque en lumière visible — gardé travaillé ; la bulle de
     Lumen — ça va. Des questions qui dormaient dans le carnet depuis des
     semaines, tranchées en deux séances, et qu'on ne repose plus.

     La console de tir a disparu aussi, mais pour une autre raison : la réponse
     d'Hugo n'était pas un choix parmi les miens. « Quand je dis agrandir, je
     veux dire agrandir LE VAISSEAU, et mettre le canon dans une nouvelle
     salle. » Ce n'est plus une question de taille de meuble, c'est une aile de
     plus — et ça ne se tranche pas en trois secondes devant un écran.

     TROISIÈME SÉANCE, 6 AOÛT — DEUX DE PLUS S'EN VONT.

     La présentation d'entrée : « ça va ». Trois écrans, le rythme est bon, on
     ne la repose plus.

     La carte des étoiles S s'en va autrement. Trois séances, trois « ça
     coince », et cette fois la raison : « à discuter dans Claude Code avec
     Hugo ». Une question qu'on repose à l'identique après trois refus n'est pas
     une question, c'est une insistance. Ce qui coince n'est pas dans l'image —
     sinon il l'aurait dit — donc l'écran n'est pas le bon endroit pour en
     parler. Elle sort de la séance et devient une conversation.

     QUATRIÈME SÉANCE, 6 AOÛT AU SOIR — DEUX DE PLUS.

     Le quadrillage : « ça va ». Les arêtes verticales font leur travail, après
     trois demandes. Rayé.

     Le scintillement : « je garde celui d'aujourd'hui ». Et la phrase qui compte
     est celle d'à côté — « très peu de changement entre les trois ciels, le
     bruit est très léger, ce n'est pas bloquant ». Les deux autres ciels sont
     partis du code avec l'uniforme qui permettait de basculer.

     Ce qui reste : une question, et c'est celle que j'avais mal posée. */

  /* LA ROTATION DU TROU NOIR D'ÉTUDE — POSÉE QUATRE FOIS, ENFIN RÉPONDUE.

     7 août 2026 : « ça va ». Trois des quatre séances précédentes avaient été
     gâchées par mes propres fautes — une fenêtre qui mangeait l'écran, des
     boutons construits dans un panneau posé en vue libre, et une fois un moteur
     qui n'était pas encore déployé, si bien qu'il a jugé le code d'avant.

     La couture de l'axe est réglée, l'effet de rotation se voit, et la question
     sort de la file. */

  /* LA QUESTION SUR L'IMAGE APRÈS LA RÉÉCRITURE A ÉTÉ POSÉE, ET RÉPONDUE.

     7 août 2026 : « rien n'a bougé, tout a l'air conforme ». Aucune régression
     visible après le passage en Kerr-Schild. Elle sort donc de la séance.

     ---------------------------------------------------------------------------
     ET ELLE ÉTAIT MAL ÉCRITE, CE QUI VAUT D'ÊTRE GARDÉ.

     Ses quatre variantes n'étaient pas des choix de conception : c'étaient
     quatre points de vue pour inspecter la même chose. La séance a pourtant
     produit sa consigne habituelle — « garde celle-ci, enlève les autres » —
     qui, appliquée à la lettre, aurait supprimé les rotations 0,6, 0,9 et 0,95
     du site. C'est-à-dire effacer une fonctionnalité parce qu'il a dit qu'elle
     marchait.

     Leçon : une question d'INSPECTION ne doit pas emprunter la forme d'une
     question de CHOIX. Si l'on remet des variantes qui ne sont que des angles
     de vue, il faudra un type distinct dans la séance, dont le rendu ne parle
     ni de garder ni d'enlever. */

  /* LE VOYAGE REFAIT. C'est la question qui compte, et elle est large exprès :
     quatre choses ont changé en même temps et je ne sais pas laquelle il verra
     en premier. Deux entrées, parce que quatorze secondes pour rejuger deux
     secondes d'arrivée serait une insulte à son temps. */
  /* RÉPONDUE, ET C'EST LA RÉPONSE LA PLUS UTILE DE LA SÉANCE. 9 août :

       « le trou noir est toujours au centre du regard du joueur, pas au centre
         de la vitre. Si je regarde à gauche, le trou noir suit la caméra et part
         à gauche. »

     La carte des étoiles est un DIAGRAMME : elle se centrait sur le milieu de
     l'image. Découpée à la baie, elle paraissait bien derrière la vitre — mais
     elle restait collée au regard, et l'astre qu'on venait de quitter tournait
     avec la tête. Réparé : elle se pose sur la position réelle du trou noir.

     Il a aussi dit ne pas savoir si « le trajet entier » relançait le voyage.
     C'est la même cause : rien ne semblait bouger, puisque l'astre suivait. La
     question repart donc DE DOS, où le mouvement est indiscutable — et son
     verdict tranchera les deux d'un coup. */
  /* LE RYTHME DU GRAND TRAJET. Question d'image, posée parce qu'il l'a demandée :
     « je veux le voir avant de trancher ». Les deux rythmes existent déjà et
     sont réglables ; ce qui change, c'est qu'un trajet de neuf décades les
     sépare brutalement là où quatre les rendait comparables. */
  /* LA MAIN GAGNE — posée le 10 août 2026.

     Sa demande du 9 août : « qu'on puisse regarder devant, comme dans un
     cockpit, ou derrière ». Je l'avais rangée dans « il faut des vitres », et
     c'était passer à côté : le vrai coupable était le recentrage, qui reprenait
     la visée à chaque image pendant tout le vol.

     La question n'est donc PAS « est-ce que ça marche » — ça se mesure, et
     `outil-verif-recul.js` s'en charge. C'est : maintenant qu'on peut regarder
     ailleurs, est-ce qu'on a envie de le faire, et est-ce qu'on retrouve son
     chemin après ? Un recentrage qui se tait rend aussi possible de finir le
     voyage le nez dans un mur, et ça, aucun calcul ne me le dira. */
  /* ET J'AI REFAIT LA FAUTE QUE CE FICHIER RACONTE PLUS BAS — 10 août au soir.

     J'ai écrit cette question SANS `inspection: true`. Les huit autres l'ont.
     Ses trois options sont des angles de vue — d'où l'on regarde le vol — et la
     séance les a présentées comme trois propositions concurrentes. Hugo a donc
     répondu ce que l'écran lui demandait : « je garde en partant, je tourne,
     enlève les autres. »

     Appliqué à la lettre, cela supprimerait deux façons de regarder un vol qui
     marche. C'est mot pour mot le cas décrit au rendu des boutons, et le remède
     y était déjà écrit. Je ne l'ai pas employé.

     LE COÛT VRAI N'EST PAS LÀ. Un « je garde celle-ci » n'est pas un verdict :
     une question non-inspection ne produit ni « ça va » ni « ça coince ». Sa
     séance ne m'a donc pas dit ce que je lui demandais — est-ce qu'on retrouve
     son chemin quand plus rien ne recadre. Il a regardé, il n'a rien signalé,
     et c'est tout ce que je sais. La question reste donc ouverte, corrigée, et
     ne lui coûtera que le temps d'un départ.

     `outil-verif-juge.js` refuse désormais une question à options qui ne dit pas
     laquelle des deux formes elle prend. Déclarée, jamais devinée — la même
     manœuvre que `carte:` sur les destinations, ce matin. */
  { id: "main-gagne",
    titre: "Regarder ailleurs pendant le vol",
    libre: true,
    inspection: true,
    quoi: "Tu me l'avais demandé le 9 août. Pendant le voyage, le vaisseau te "
        + "ramenait la tête vers le trou noir à chaque image : tu regardais "
        + "devant, on te retournait. C'est fini — dès que tu touches à la visée, "
        + "le recentrage se tait pour tout le reste du trajet. Pars, tourne la "
        + "tête, regarde où tu vas, reviens. Est-ce que ça te rend le voyage, ou "
        + "est-ce que tu te sens perdu sans la main qui recadrait ?",
    pose: () => rejoueVoyageTourne(120),
    options: [
      { nom: "en partant, je tourne",  fait: () => rejoueVoyageTourne(120) },
      { nom: "au milieu du trajet",    fait: () => rejoueVoyage(0.45) },
      { nom: "juste avant l'arrivée",  fait: () => rejoueVoyage(0.86) },
    ],
    rend: () => rangeVoyage(),
  },

  { id: "rythme-grand-trajet", ignore: true,   // ✅ ça va, 9 août au soir — angle gardé : « régulier, au départ », avec la remarque sur les deux moitiés
    titre: "Le voyage vers le système solaire : quel rythme ?",
    libre: true,
    inspection: true,
    quoi: "On part vraiment, maintenant — vingt-sept mille années-lumière, "
        + "vingt ans à bord. Deux façons de le montrer en trente-quatre "
        + "secondes. « Fidèle » suit l'horloge du bord : la moitié du voyage "
        + "défile dans la première seconde, puis l'écran ne bouge presque plus "
        + "pendant qu'on freine — c'est ce qu'on verrait vraiment. « Régulier » "
        + "étale les décades : le quadrillage se renumérote à cadence égale. "
        + "Regarde les deux et dis-moi lequel raconte le voyage.",
    pose: () => rejoueGrandTrajet("fidele", 0),
    options: [
      { nom: "fidèle, au départ",    fait: () => rejoueGrandTrajet("fidele", 0) },
      { nom: "fidèle, en freinage",  fait: () => rejoueGrandTrajet("fidele", 0.72) },
      { nom: "régulier, au départ",  fait: () => rejoueGrandTrajet("regulier", 0) },
      { nom: "régulier, au milieu",  fait: () => rejoueGrandTrajet("regulier", 0.45) },
    ],
    rend: () => rangeGrandTrajet(),
  },

  { id: "voyage-refait", ignore: true,   // ✅ ça va, 9 août au soir — angle gardé : « en partant de dos ».
    titre: "Le trou noir reste-t-il en place ?",
    libre: true,
    inspection: true,
    quoi: "Tu avais vu que le trou noir suivait ton regard : tu tournais la tête "
        + "et il partait avec. Il reste maintenant où il est, comme ce qu'on voit "
        + "par une fenêtre — tourne la tête pendant le trajet et il doit sortir du "
        + "champ. Le quadrillage aussi est découpé à la vitre, désormais.",
    pose: () => rejoueVoyageTourne(120),
    options: [
      { nom: "en partant de dos",   fait: () => rejoueVoyageTourne(180) },
      { nom: "de trois quarts",     fait: () => rejoueVoyageTourne(120) },
      { nom: "l'arrivée seule",     fait: () => rejoueVoyage(0.90) },
    ],
    rend: () => rangeVoyage(),
  },

  /* LA QUESTION PRÉCISE, celle de son verdict. J'ai mesuré que la carte ne
     peint plus un pixel hors du cadre de la baie — mais « ne pas déborder » et
     « avoir l'air d'être dehors » sont deux choses différentes, et la seconde
     ne se mesure pas. */
  /* RÉPONDUE LE 9 AOÛT : « je garde juste avant l'arrivée ». Les deux variantes
     deviennent une, et la question se pose désormais à 0,86 — le moment qu'il a
     retenu, celui où la carte est montée et où le découpage se juge vraiment.
     Le milieu du trajet ne montrait presque rien : la carte y est encore à
     peine levée, et l'on jugeait un fondu au lieu d'un cadrage. */
  { id: "carte-dehors", ignore: true,   // ✅ ça va, 9 août au soir — angle gardé : « juste avant l'arrivée ».
    titre: "Les orbites ont-elles l'air d'être dehors ?",
    libre: true,
    quoi: "Tu disais : « la trace des orbites est devant la vitre, on n'a pas "
        + "l'impression que c'est à l'extérieur. » Elle est découpée aux trois "
        + "vitres, et depuis le 9 août elle reste POSÉE SUR LE TROU NOIR au lieu "
        + "de suivre ton regard. Est-ce que ça suffit à la faire passer dehors ?",
    pose: () => rejoueVoyage(0.86),
    rend: () => rangeVoyage(),
  },

  /* LE BANDEAU — RÉPONDU LE 9 AOÛT : « ça va ». Vitesse en fraction de c,
     dilatation, distance parcourue, phase : ça se lit, et rien ne manque. La
     question sort de la séance ; ce qu'elle gardait de vrai est dans le contrôle
     du bandeau, pas dans une question qu'on repose à quelqu'un qui a répondu.

     `montre` reste dans le harnais pour les suivantes : c'est la garde qui a
     évité, le 7 août, qu'on lui fasse juger des boutons qu'il n'avait pas sous
     les yeux. */

  /* LE QUADRILLAGE QUI SE LÈVE AVANT QU'ON VOIE QUOI QUE CE SOIT.

     C'est une question d'INSPECTION, pas de choix — et l'en-tête de ce fichier
     dit ce que coûte de confondre les deux. Les deux entrées ci-dessous sont
     deux angles de vue sur la même chose, pas deux propositions entre
     lesquelles trancher. Rien ne doit être « gardé » ou « enlevé » d'après la
     réponse.

     CE QUI A DÉJÀ ÉTÉ RÉPARÉ : le seuil était un angle fixe, posé à l'œil sur un
     écran 16:9. Mesuré, il était faux aux deux extrêmes — trop large en portrait
     (le quadrillage montait sur un astre encore à vingt degrés hors de l'écran)
     et trop serré en très large (2560 × 1080 : il refusait de monter alors que
     l'astre était visible dans le coin). Il se calcule maintenant à partir de la
     forme de l'écran, en partant du réglage d'Hugo : sur son 16:9 il rend 0,551
     au lieu de 0,55, et le trajet s'y déroule image pour image comme avant.

     CE QUI RESTE, et qui n'est pas mesurable : le quadrillage monte trois fois
     plus vite que la pièce ne se retourne. Si l'on part sans regarder l'astre,
     il a le temps d'arriver presque en entier avant lui. Est-ce que ça se voit
     comme un défaut, ou comme une annonce ? Aucun calcul ne tranche ça. */
  /* LA FORME DE L'AVEU — F4.

     Question d'INSPECTION, comme celle du quadrillage : les trois entrées sont
     trois endroits où le badge apparaît, pas trois propositions à départager.

     POURQUOI ON NE PROPOSE PAS DÉJÀ TROIS FORMES. Le plan prévoyait « deux ou
     trois formes, Hugo tranche ». C'est prématuré : on ne sait pas encore si la
     première est fautive. Dessiner trois variantes avant de savoir ça, c'est
     lui faire choisir entre trois réponses à une question qu'on ne lui a pas
     posée. S'il dit que ça coince, on dessine — pas avant.

     Ce qui est déjà tranché et n'a pas à l'être : le texte est LISIBLE et non
     replié derrière un bouton. Un aveu qu'il faut déplier pour lire est un aveu
     qu'on ne lit pas, et c'est le défaut même que F4 répare. */
  /* REPOSÉE APRÈS SON VERDICT DU 9 AOÛT : « ça se voit pas assez, fais un genre
     de centre des notifications, ce genre d'info doit être comme une
     notification ».

     Le badge dans le panneau n'a pas bougé — un compromis se déclare là où on le
     rencontre, c'est sa règle du 5 août. Ce qui s'ajoute, c'est de le remarquer.
     La question porte donc sur ce qui est NEUF, et lui montre les trois formes
     ensemble : la bulle qui prévient, la pastille qui compte, le centre qui
     garde. */
  /* LE CERCLE DE LA DERNIÈRE ORBITE STABLE, ET LA ROTATION.

     Trouvé le 9 août en mesurant si F3 était possible. Le cercle du calque reste
     à 3 quelle que soit la rotation ; le bord du disque, lui, se resserre —
     2,12 à spin 0,5, 1,16 à 0,9. À 0,9 le cercle est deux fois et demie trop
     loin, tracé par-dessus le disque au lieu d'en marquer le bord.

     CE N'EST PAS UNE ERREUR À CORRIGER, et c'est pour ça qu'elle est ici plutôt
     que réparée. Le disque est calculé en Kerr : la rotation compte. Les sondes,
     elles, se déplacent par `PHYSIQUE.integre`, qui est du Schwarzschild sans
     terme de rotation. Le cercle dit VRAI pour les sondes et FAUX pour la
     lumière. Le faire suivre l'accorderait à ce qu'on voit et le brouillerait
     avec ce qu'on lance.

     Question d'INSPECTION : les trois entrées sont trois rotations, pas trois
     propositions. Ce qu'il juge, c'est l'écart — pas la valeur du spin. */
  { id: "cercle-isco", ignore: true,   // ✅ ça va, 9 août au soir — angle gardé : « rotation rapide ».
    titre: "Le cercle de la dernière orbite stable",
    libre: true,
    inspection: true,
    quoi: "Sur le trou noir d'étude, monte la rotation et regarde le cercle qui "
        + "marque la dernière orbite stable. Il reste au même endroit, pendant "
        + "que le bord du disque se resserre — à 0,9 il est deux fois et demie "
        + "trop loin. Il dit vrai pour les sondes que tu lances, qui ignorent la "
        + "rotation, et faux pour la lumière, qui la voit. Est-ce que l'écart se "
        + "voit, et est-ce qu'il gêne ?",
    /* Des VALEURS depuis que la rotation est un curseur. On garde les trois que
       les anciens boutons proposaient, plus la borne : c'est là qu'on voit le
       plus, et il reconnaît les nombres qu'il manipulait avant. */
    pose: () => montreEtude(0.9),
    options: [
      { nom: "rotation 0,9",         fait: () => montreEtude(0.9) },
      { nom: "à la limite — 0,998",  fait: () => montreEtude(SPIN.MAX) },
      { nom: "sans rotation",        fait: () => montreEtude(0) },
    ],
    rend: () => rangeEtude(),
  },

  { id: "forme-aveu", ignore: true,   // ✅ ça va, 9 août au soir — angle gardé : « la bulle qui prévient ».
    titre: "Les aveux, en notification",
    libre: true,
    inspection: true,
    quoi: "Tu disais que ça ne se voyait pas assez. Maintenant une bulle prévient "
        + "quand tu arrives quelque part où la simulation s'autorise un écart, "
        + "une pastille sur le losange compte ce qui te reste à croiser, et le "
        + "centre garde les onze rangés par endroit. Le badge dans le panneau "
        + "n'a pas bougé. Est-ce que ça se remarque, maintenant — et est-ce que "
        + "ça dérange ?",
    pose: () => montreAveux("bulle"),
    options: [
      { nom: "la bulle qui prévient", fait: () => montreAveux("bulle") },
      { nom: "le centre",             fait: () => montreAveux("centre") },
      { nom: "le badge du panneau",   fait: () => montreAveux("telescope") },
    ],
    rend: () => rangeAveux(),
  },

  { id: "quadrillage-avance", ignore: true,   // ✅ ça va, 9 août au soir — angle gardé : « en le regardant ».
    titre: "Le quadrillage arrive-t-il trop tôt ?",
    libre: true,
    // Angles de vue, pas propositions. Voir « TROIS TYPES » plus bas : sans ce
    // drapeau, la séance demanderait d'en « garder une et enlever les autres »,
    // ce qui ne veut rien dire ici et a déjà failli coûter une fonctionnalité.
    inspection: true,
    quoi: "Tu pars du salon SANS regarder le trou noir. La pièce se retourne "
        + "toute seule vers lui, et le quadrillage se lève pendant ce temps-là — "
        + "donc avant qu'il soit entré dans l'image. Sur un téléphone tenu debout "
        + "ça fait environ une seconde. Regarde le départ : est-ce que le "
        + "quadrillage a l'air d'arriver trop tôt, ou est-ce qu'il annonce bien "
        + "ce qui vient ?",
    pose: () => rejoueVoyageTourne(90),
    options: [
      { nom: "en partant de côté",   fait: () => rejoueVoyageTourne(90) },
      { nom: "en partant de dos",    fait: () => rejoueVoyageTourne(180) },
      { nom: "en le regardant",      fait: () => rejoueVoyageTourne(0) },
    ],
    rend: () => rangeVoyage(),
  },

  /* L'ARRIVÉE — LES DEUX VARIANTES ONT ÉTÉ REFUSÉES, ET C'ÉTAIT LA BONNE RÉPONSE.

     Je cherchais ce qui « pop » à l'arrivée, et je lui proposais de trancher
     entre deux mises en scène. Il a répondu à côté de mes boutons, et il a eu
     raison de le faire :

       « Ça va pas. La trace des orbites est devant la vitre dans le vaisseau,
         on n'a pas l'impression que c'est à l'extérieur. Et on doit vraiment
         avoir l'impression qu'on s'éloigne : la taille des orbites doit être
         relative à la distance à laquelle on est du trou noir pendant le
         voyage. »

     Puis, le même jour : les orbites doivent se voir DÈS LE DÉBUT du recul et ne
     se révéler en entier qu'à l'arrivée, naturellement. Et il veut lire pendant
     le vol la vitesse en fraction de c, le décalage temporel, la distance au
     point de départ — les deux phases, accélération et freinage.

     Aucune de mes deux variantes ne pouvait répondre à ça : le défaut n'était
     pas dans l'animation, il était dans le fait que la carte est un calque plat
     posé par-dessus l'écran, sans lien ni avec la vitre ni avec le trajet.

     LA QUESTION SORT DONC DE LA SÉANCE le temps que la partie voyage soit
     refaite. La reposer sur les mêmes variantes coûterait son œil pour un
     verdict qu'il a déjà rendu.

     Le morceau qui existe déjà : `VOYAGE.etat(d, τ)` rend la position, les deux
     horloges, β, γ et la phase, gardé par 54 contrôles. Le reste s'y branche. */

  /* LES DEUX RENDUS. Sa tête de file, livrée le 9 août : le site promettait que
     tout est calculé, ce qui est vrai de la géométrie et faux du fond de ciel.

     La question est étroite EXPRÈS. Une seule chose change entre les deux modes
     — le voile mauve — et il faut savoir si ce peu se voit avant d'en promettre
     davantage. La recherche, elle, en promet beaucoup : là-bas il ne fait jamais
     nuit, la vraie nébulosité a une forme, le champ est cent fois plus riche.
     Tout ça se peint, et se peint mal si on s'y met sans avoir regardé d'abord.

     Ce qu'on ne lui demande PAS ici : quel mode doit accueillir un visiteur. Le
     défaut reste « cinéma », c'est-à-dire l'image que ses amis testent depuis le
     début, et le changer serait une décision à lui — pas un effet de bord d'une
     séance sur la lisibilité. */
  { id: "rendu-deux-modes", ignore: true,   // ✅ ça va, 9 août au soir, sur iPhone — angle gardé : « cinéma ».
    titre: "Cinéma ou simulation, est-ce que ça se voit ?",
    libre: true,
    inspection: true,
    quoi: "Il y a maintenant un choix de rendu, à l'accueil sous la langue et "
        + "dans les réglages. En simulation, le voile mauve du fond s'éteint : "
        + "il était inventé, et c'était le seul décor du site. Le reste ne bouge "
        + "pas — la géométrie était déjà calculée. Bascule et regarde le fond du "
        + "ciel : est-ce que la différence se voit ? Est-ce que « simulation » "
        + "paraît plus pauvre, ou plus honnête ? Et l'aveu qui change avec le "
        + "mode, tu le lis ou tu le sautes ?",
    pose: () => montreRendu("cinema", false),
    options: [
      { nom: "cinéma",     fait: () => montreRendu("cinema", false) },
      { nom: "simulation", fait: () => montreRendu("simulation", false) },
    ],
    rend: () => rangeRendu(),
  },

  /* LE SORT DE « LUMIÈRE RÉELLE ». La question 2.4 du chantier, et elle ne se
     tranche qu'en regardant : le bouton existe depuis longtemps, il ferme le
     diaphragme et rend au disque son éclat mesuré. Est-ce un troisième cran du
     même réglage, ou une autre chose qui doit rester à part ?

     Je ne tranche pas moi-même parce que les deux lectures se défendent. « Un
     cran de plus » range trois états sur une seule ligne, ce qui est simple à
     comprendre — mais la lumière réelle est un choix qu'on fait pour DIX
     SECONDES, le temps de voir, alors qu'un rendu est un choix qu'on garde. Un
     réglage qu'on garde et un geste qu'on essaie n'ont pas la même place.

     RÉPONDUE LE 9 AOÛT AU SOIR, et l'ANGLE répond mieux que le verdict.

     Le verdict est « ça va », ce qui sur une inspection veut dire « rien ne
     coince » et ne choisit aucun des deux camps. Mais l'angle qu'il a regardé,
     lui, tranche : **« simulation + lumière réelle »**. Cette vue-là n'existe
     QUE parce que les deux réglages sont indépendants. En faire un troisième
     cran du sélecteur les rendrait exclusifs — cinéma, ou simulation, ou
     lumière réelle — et la chose qu'il vient de juger bonne deviendrait
     impossible à obtenir.

     « Lumière réelle » reste donc un bouton à part. Ce n'est pas mon
     arbitrage : c'est ce que son angle rend nécessaire. */
  { id: "reel-ou-mode", ignore: true,   // ✅ ça va, 9 août au soir — angle gardé : « simulation + lumière réelle ».
    titre: "« Lumière réelle » : un cran du rendu, ou autre chose ?",
    libre: true,
    inspection: true,
    quoi: "Trois états à comparer. Cinéma, c'est l'image d'aujourd'hui. "
        + "Simulation éteint le voile mauve. « Lumière réelle » ferme le "
        + "diaphragme et rend au disque son éclat mesuré — c'est le bouton qui "
        + "existe déjà, en bas. Question : est-ce que « lumière réelle » te "
        + "paraît être un troisième cran du même réglage, ou une chose à part "
        + "qu'on allume dix secondes pour voir puis qu'on éteint ?",
    pose: () => montreRendu("cinema", false),
    options: [
      { nom: "cinéma",                     fait: () => montreRendu("cinema", false) },
      { nom: "simulation",                 fait: () => montreRendu("simulation", false) },
      { nom: "simulation + lumière réelle", fait: () => montreRendu("simulation", true) },
    ],
    rend: () => rangeRendu(),
  },

  { id: "arrivee-hors-file", ignore: true,
    titre: "L'arrivée du voyage",
    libre: true,
    quoi: "",
    pose: () => rejoueArrivee(false),
    options: [
      { nom: "l'arrivée telle quelle",   fait: () => rejoueArrivee(false) },
      { nom: "sans le panneau qui s'ouvre", fait: () => rejoueArrivee(true) },
    ],
    /* On rend le monde comme on l'a pris. Sans ça, la séance se termine et le
       voyage armé continue : on est emmené à l'arrivée en pleine lecture du
       rapport. Un protocole qui laisse le site dans un état qu'il n'avait pas
       fausse ce qu'on regardera ensuite. */
    rend: () => {
      rendPoseArrivee();
      fermeTelescope();
      if(TELESCOPE.trajet){ TELESCOPE.trajet = null; TELESCOPE.retour = false; }
      RECUL.etat.actif = false;
      TELESCOPE.carte = 0;
      $$("chrono").classList.remove("vu");
      poseSalon();
    },
  },
];

const DECISIONS = TOUTES.filter(d => !d.ignore);

/* Rejouer les deux dernières secondes d'un voyage, en supprimant au besoin le
   panneau d'arrivée. On remplace `poseArrivee` plutôt que de l'empêcher d'être
   appelée : c'est le seul point par lequel le panneau se lève, et le rendre
   muet ne change rien d'autre à la scène. */
let vraiePoseArrivee = null;
function rendPoseArrivee(){
  if(vraiePoseArrivee){ global.poseArrivee = vraiePoseArrivee; vraiePoseArrivee = null; }
}
function rejoueArrivee(sansPanneau){ rejoueVoyage(0.90, sansPanneau); }

/* On rend le monde comme on l'a pris. Sans ça, la séance se termine et le
   voyage armé continue : on est emmené à l'arrivée en pleine lecture du
   rapport. Un protocole qui laisse le site dans un état qu'il n'avait pas
   fausse ce qu'on regardera ensuite. */
/* RAMENER LE VAISSEAU À SON ORBITE — défaut trouvé par Hugo le 9 août 2026 :
   « ça ne me retéléporte pas à Sagittarius quand je clique sur une des options
   du juge ».

   `lanceVoyage` prend `distanceVaisseau()` comme point de départ, et cette
   distance vient de la POSITION DU VAISSEAU dans le monde — que le voyage
   précédent a déplacée. Après un premier essai on repartait donc du système
   solaire POUR le système solaire : un trajet de longueur nulle, et un écran
   qui ne bouge plus. `auSalon` ne le rattrapait pas, il replace le joueur DANS
   le salon, pas le salon sur son orbite.

   Le défaut dormait depuis toujours dans `rejoueVoyage` : tant qu'on regardait
   une destination une seule fois, on partait forcément de l'orbite. C'est la
   comparaison de deux rythmes — donc le fait de REJOUER — qui l'a réveillé. */
function rameneAuDepart(){
  poseSalon();                       // le vaisseau retrouve son orbite et ses horloges
  RECUL.etat.actif = false;
  RECUL.etat.distance = distanceVaisseau();
}

/* LE GRAND TRAJET, ET SON RYTHME — armé le 9 août 2026.

   Le voyage vers le système solaire fait 9,10 décades là où le recul vers les
   étoiles S en fait 3,87, et la mesure dit que le rythme « fidèle » n'y survit
   pas : 4,76 décades dans la PREMIÈRE seconde, puis rien pendant quatre. Hugo a
   demandé à le voir avant de trancher, ce qui est exactement la bonne réponse à
   une question d'image.

   On rejoue donc le vrai départ, à la seule différence près qu'on saute au
   moment intéressant : `depuis` place l'animation là où les deux rythmes
   divergent le plus. Le rythme se remet à « fidèle » à la sortie — c'est le
   défaut du site, et une séance ne change pas un réglage en douce. */
function rejoueGrandTrajet(rythme, depuis){
  rendPoseArrivee();
  fermeTelescope();
  auSalon(0, 0.6, 0, -0.05);
  if(TELESCOPE.trajet){ TELESCOPE.trajet = null; TELESCOPE.retour = false; }
  rameneAuDepart();
  TELESCOPE.carte = 0;
  RECUL.poseRythme(rythme);
  const d = DESTINATIONS.find(x => x.id === "soleil");
  lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
  RECUL.etat.t = depuis || 0;
}

function rangeGrandTrajet(){
  RECUL.poseRythme("fidele");
  rangeVoyage();
}

function rangeVoyage(){
  rendPoseArrivee();
  fermeTelescope();
  if(TELESCOPE.trajet){ TELESCOPE.trajet = null; TELESCOPE.retour = false; }
  RECUL.etat.actif = false;
  TELESCOPE.carte = 0;
  $$("chrono").classList.remove("vu");
  poseSalon();
}

/* Rejouer un voyage depuis l'avancement qu'on veut. `depuis` vaut 0 pour le
   trajet entier, 0,90 pour ne revoir que l'arrivée — personne ne doit attendre
   quatorze secondes pour juger deux secondes. */
/* Le même trajet, mais en partant SANS REGARDER OÙ L'ON VA.

   `rejoueVoyage` pose toujours la vue face à l'astre, et c'est le cas courant :
   on entre au salon, on ouvre le télescope, on part — mesuré, on est pile en
   face. Le quadrillage n'a alors aucune avance sur lui, et il n'y a rien à
   juger.

   Le défaut ne se montre qu'à partir d'une trentaine de degrés d'écart : le
   quadrillage se lève pendant que la pièce se retourne encore, donc avant que le
   trou noir soit entré dans l'image. Mesuré sur un écran de 390 × 844, en
   balayant l'orientation de départ : 0 image d'avance à 0°, 44 à 30°, 64 à 60°
   et au-delà — la pièce se retourne à vitesse constante, d'où le palier.

   Cette fonction reproduit donc exactement la situation où il y a quelque chose
   à voir, et sur un téléphone tenu debout, qui est là où c'est le plus marqué. */
/* Ouvrir le panneau où un aveu se pose, et le refermer proprement.

   On passe par les VRAIS boutons, jamais par `poseAveux` en direct : ce qu'il
   doit juger est ce qu'il verra en jouant, pas ce qu'une fonction de contrôle
   sait fabriquer. Une séance qui montre une scène montée n'apprend rien. */
/* Montrer une des trois formes de l'aveu.

   On passe par les VRAIS boutons, jamais par les fonctions de peinture : ce
   qu'il doit juger est ce qu'il verra en jouant. Une séance qui montre une scène
   montée n'apprend rien.

   `bulle` OUBLIE d'abord ce qui a été croisé : la notification ne sort que sur du
   neuf, et sans ça il jugerait une bulle qui ne vient pas. C'est le seul endroit
   du dépôt qui efface cette mémoire, et c'est pour la lui montrer. */
/* Poser le trou noir d'étude à une rotation donnée, par les VRAIS boutons.

   `poseEtude` construit les boutons de rotation à chaque ouverture ; on clique
   celui qu'on veut, exactement comme lui. Une séance qui poserait `spin` en
   direct montrerait une scène que le site ne sait pas produire. */
/* Poser le trou noir d'étude à une rotation donnée.

   Depuis le 9 août la rotation est un CURSEUR et non quatre boutons : on pose
   donc une valeur et l'on déclenche les mêmes événements que le doigt — `input`
   pour repeindre, `change` pour ranger. Poser `spin` en direct montrerait une
   scène que le site ne sait pas produire. */
function montreEtude(v){
  rangeEtude();
  ouvreTelescope();
  poseEtude();
  const c = $$("etude-spin") && $$("etude-spin").querySelector("input[type=range]");
  if(!c) return;
  c.value = v;
  c.dispatchEvent(new Event("input"));
  c.dispatchEvent(new Event("change"));
}

function rangeEtude(){
  fermeTelescope();
  if(typeof vaAu === "function") vaAu("libre");
}

function montreAveux(quoi){
  rangeAveux();
  if(quoi === "bulle"){
    if(typeof aveuxVus !== "undefined"){ aveuxVus.clear(); majPastilleAveux(); }
    $$("rouage").click();
  }
  else if(quoi === "centre")         ouvreAveux();
  else if(quoi === "reglage-temps")  $$("b-temps").click();
  else if(quoi === "telescope")      ouvreTelescope();
  else                               $$("rouage").click();
}

/* LE RENDU — on emprunte le chemin du visiteur, pas un raccourci.

   Le mode se change en cliquant le vrai sélecteur des réglages : si un jour la
   bascule cesse de repeindre quelque chose, la séance le montrera au lieu de le
   contourner. Les boutons existent dès le chargement, panneau ouvert ou non.

   `rendAvant` retient l'état d'avant la séance. Une séance qui laisse le site
   dans un autre rendu que celui qu'on avait choisi serait une séance qui abîme
   ce qu'elle vient juger — et personne ne comprendrait pourquoi son image a
   changé le lendemain. */
let rendAvant = null;
function montreRendu(mode, avecReel){
  if(rendAvant === null)
    rendAvant = { mode: modeRendu, reel: reelCible > 0.5 };
  if($$("panneau").classList.contains("vu")) $$("rouage").click();
  fermeTelescope();
  const i = RENDU.MODES.indexOf(mode);
  const b = i >= 0 && $$("rendu-choix").children[i];
  if(b) b.click();
  if(!!avecReel !== (reelCible > 0.5)) $$("b-reel").click();
}

function rangeRendu(){
  if(rendAvant) montreRendu(rendAvant.mode, rendAvant.reel);
  rendAvant = null;
  if($$("panneau").classList.contains("vu")) $$("rouage").click();
}

function rangeAveux(){
  fermeTelescope();
  if($$("panneau").classList.contains("vu")) $$("rouage").click();
  if($$("temps").classList.contains("vu"))   $$("b-temps").click();
  $$("aveux").classList.remove("vu");
  $$("notif").classList.remove("vu");
}

function rejoueVoyageTourne(ecart){
  rejoueVoyage(0);
  const va = salon.versAstre;
  if(va){
    salon.lacet = Math.atan2(va[0], -va[2]) + ecart*Math.PI/180;
    salon.tangage = 0;
  }
  TELESCOPE.grille = 0;        // sinon il reste levé du trajet précédent
}

function rejoueVoyage(depuis, sansPanneau){
  rendPoseArrivee();
  if(sansPanneau){
    vraiePoseArrivee = global.poseArrivee;
    global.poseArrivee = function(){ /* muet, le temps de la comparaison */ };
  }
  fermeTelescope();
  auSalon(0, 0.6, 0, -0.05);
  if(TELESCOPE.trajet){ TELESCOPE.trajet = null; TELESCOPE.retour = false; }
  rameneAuDepart();
  TELESCOPE.carte = 0;                      // on repart d'une carte éteinte
  const d = DESTINATIONS[0];
  lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
  RECUL.etat.t = depuis;
}

// ================================================================== l'écran
const style = document.createElement("style");
style.textContent = `
  #juge {
    position:fixed; z-index:90; left:50%; bottom:20px; transform:translateX(-50%);
    width:min(470px, 94vw); pointer-events:auto;
    background:color-mix(in srgb, #0b0a16 95%, transparent); backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,.15); border-radius:5px; padding:14px 16px 13px;
    font-family:-apple-system, system-ui, sans-serif; color:#c7c2d9;
  }
  #juge .sur {
    font-family:ui-monospace, monospace; font-size:8.5px; letter-spacing:.18em;
    text-transform:uppercase; color:#7fd8ff; margin-bottom:6px;
  }
  #juge h4 { font-size:14.5px; font-weight:500; color:#fff; margin:0 0 4px; }
  #juge p  { font-size:12px; line-height:1.55; margin:0 0 10px; }
  #juge .variantes { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; align-items:center; }
  #juge .titre-var {
    flex-basis:100%; font-family:ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size:9px; letter-spacing:.16em; text-transform:uppercase;
    color:#6b6880; margin-bottom:1px;
  }
  #juge .variantes button {
    flex:1 1 auto; min-width:88px; padding:8px 6px; font-size:11.5px; cursor:pointer;
    border-radius:3px; border:1px solid rgba(127,216,255,.28);
    background:rgba(127,216,255,.05); color:#a8d8ee; font-family:inherit;
  }
  #juge .variantes button.la { background:rgba(127,216,255,.20); color:#fff; border-color:rgba(127,216,255,.6); }
  /* Le champ libre était haut de quarante-quatre pixels, avec « Un mot, si tu
     veux » pour invitation. Hugo a voulu écrire des phrases — « la question est
     mal posée », « le robot n'était pas visible » — et le champ lui disait le
     contraire. Une boîte de la taille d'un mot ne reçoit que des mots.

     Cent pixels, et une invitation qui demande explicitement le désaccord. */
  #juge textarea {
    width:100%; box-sizing:border-box; min-height:100px; resize:vertical;
    background:rgba(0,0,0,.32); border:1px solid rgba(255,255,255,.12);
    border-radius:3px; color:#e4e0f0; font:inherit; font-size:12.5px;
    line-height:1.5; padding:8px 10px;
  }
  #juge textarea:focus { border-color:rgba(127,216,255,.45); outline:none; }
  #juge .rangee { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  #juge .mauvaise {
    border-color:rgba(255,200,110,.45) !important; color:#ffd08a !important;
    flex-basis:100%;
  }
  #juge .note-libre {
    border-style:dashed !important; color:#8f8aa6 !important;
    background:transparent !important; font-size:11px !important;
  }
  #juge .note-libre:hover { color:#fff !important; }
  #juge .rangee button {
    flex:1; padding:9px 8px; cursor:pointer; border-radius:3px; font-family:inherit;
    border:1px solid rgba(255,255,255,.16); background:rgba(255,255,255,.04);
    color:#c7c2d9; font-size:11.5px;
  }
  #juge .rangee button:hover { background:rgba(255,255,255,.09); color:#fff; }
  #juge .oui { border-color:rgba(110,255,180,.4) !important; color:#8ff0c0 !important; }
  #juge .non { border-color:rgba(255,120,120,.4) !important; color:#ffa8a8 !important; }
  #juge .pas { font-family:ui-monospace, monospace; font-size:9px; color:#6b6880; margin-top:8px; }
  /* Replié, il ne reste qu'un bandeau — le titre et de quoi rouvrir.

     Hugo, deuxième séance : « le champ du test est devant la présentation » et
     « je n'ai pas accès au bouton avec l'interface de test ». Un panneau posé au
     milieu de l'écran cache justement ce qu'il demande de regarder, et couvre
     les commandes qu'il demande d'essayer. Les questions qui envoient explorer
     le site s'ouvrent donc REPLIÉES. */
  #juge.replie { padding:7px 11px; width:auto; max-width:min(420px, 92vw); }
  #juge.replie h4, #juge.replie p, #juge.replie .variantes,
  #juge.replie textarea, #juge.replie .rangee:not(.replie-visible),
  #juge.replie .pas { display:none; }
  #juge.replie .sur { margin-bottom:0; color:#a8d8ee; }
  #juge .rangee.replie-visible { margin-top:6px; }

  /* LA FENÊTRE SE DÉPLACE, ET C'EST LA BARRE DU HAUT QUI SERT DE POIGNÉE.

     Elle est le seul élément qui survit au repli — le panneau reste donc
     saisissable dans les deux états, ce qui est exactement le moment où l'on
     en a besoin : replié pour regarder, et toujours au mauvais endroit. */
  #juge .sur { cursor:grab; touch-action:none; padding-bottom:3px; }
  #juge .sur::before { content:"⠿"; margin-right:7px; letter-spacing:0; color:#565270; }
  #juge.bouge { cursor:grabbing; }
  #juge.bouge .sur { cursor:grabbing; }
  #juge.bouge::after {
    content:""; position:absolute; inset:0; border-radius:5px;
    border:1px solid rgba(127,216,255,.45); pointer-events:none;
  }
`;
document.head.appendChild(style);

const boite = document.createElement("div");
boite.id = "juge";
boite.className = "hud";
boite.innerHTML =
  '<div class="sur"></div><h4></h4><p></p>' +
  '<div class="variantes"></div>' +
  '<textarea placeholder="Écris ce que tu veux, et autant que tu veux.\n' +
  'Y compris : la question est mal posée, on ne voit pas ce dont tu parles, ' +
  'ça n\'a rien à voir avec ce que fait ce bouton…"></textarea>' +
  '<div class="rangee"></div><div class="pas"></div>';
document.body.appendChild(boite);

const q = s => boite.querySelector(s);

/* ======================================================= la fenêtre se déplace

   Le panneau était cloué en bas au centre. Deux séances de suite, Hugo a jugé
   une scène qu'il ne voyait qu'à moitié : « le champ du test est devant la
   présentation », puis « l'interface de test bloque encore l'interface ».

   Le repli avait été ma première réponse, et il ne suffit pas : replié, le
   bandeau reste posé au même endroit, et il y a toujours une question pour
   demander de regarder précisément ce coin-là. Tant que la fenêtre ne bouge
   pas, c'est MOI qui décide de ce qu'il a le droit de voir — et je décide mal,
   puisque je ne vois pas son écran.

   La place choisie est gardée d'une question à l'autre : la déplacer une fois
   par séance doit suffire. */

const MARGE = 8;              // ce qui doit toujours rester à l'écran, en pixels
let place = null;             // {x, y} une fois qu'on a bougé ; null tant qu'on n'a pas

/* Ramener la fenêtre dans l'écran.

   Appelée après chaque déplacement, mais aussi après chaque repli et chaque
   dépli — parce que ces deux-là CHANGENT SA TAILLE. Une fenêtre posée tout en
   bas alors qu'elle était réduite à son bandeau redevient haute de trois cents
   pixels en se dépliant, et sort par le bas en emportant les boutons de
   réponse. C'est le même défaut que celui qu'on est en train de corriger, à
   ceci près qu'il cacherait la réponse au lieu de la question. */
function recadre(){
  if(!place) return;
  const r = boite.getBoundingClientRect();
  const maxX = Math.max(MARGE, innerWidth  - r.width  - MARGE);
  const maxY = Math.max(MARGE, innerHeight - r.height - MARGE);
  place.x = Math.min(Math.max(place.x, MARGE), maxX);
  place.y = Math.min(Math.max(place.y, MARGE), maxY);
  boite.style.left      = place.x + "px";
  boite.style.top       = place.y + "px";
  boite.style.bottom    = "auto";
  boite.style.transform = "none";
}

const poignee = q(".sur");
poignee.title = "Attrape ici pour déplacer la fenêtre";

poignee.addEventListener("pointerdown", e => {
  /* La scène écoute le pointeur sur le CANEVAS, pas sur la page : empoigner la
     fenêtre ne fait donc pivoter aucun ciel. On arrête quand même l'événement,
     parce que « aucun autre écouteur aujourd'hui » n'est pas une propriété
     qu'on peut laisser à la charge du prochain qui touchera au fichier. */
  e.preventDefault();
  e.stopPropagation();

  const r = boite.getBoundingClientRect();
  if(!place) place = { x: r.left, y: r.top };
  const prise = { x: e.clientX - r.left, y: e.clientY - r.top };

  boite.classList.add("bouge");

  /* On suit le pointeur SUR LA FENÊTRE, pas sur la poignée.

     `setPointerCapture` serait plus direct, mais il exige un pointeur réellement
     actif : un contrôle qui rejoue un déplacement avec des événements
     synthétiques se fait jeter, et le geste ne serait donc vérifiable que par
     quelqu'un qui a une main. Écouter la fenêtre marche dans les deux cas, et
     ne perd rien — le glissé s'arrête au relâchement d'où qu'il vienne. */
  const suit = ev => {
    place.x = ev.clientX - prise.x;
    place.y = ev.clientY - prise.y;
    recadre();
  };
  const lache = () => {
    removeEventListener("pointermove", suit);
    removeEventListener("pointerup",     lache);
    removeEventListener("pointercancel", lache);
    boite.classList.remove("bouge");
  };
  addEventListener("pointermove", suit);
  addEventListener("pointerup",     lache);
  addEventListener("pointercancel", lache);
});

addEventListener("resize", recadre);

/* ------------------------------------- la fenêtre se contrôle elle-même

   Règle du projet : tout défaut trouvé à l'œil devient un contrôle. Celui-ci
   naît du verdict du 6 août — « l'interface de test bloque encore l'interface »
   — et il a ceci de particulier qu'il ne protège pas le site mais l'INSTRUMENT.

   Un outil de mesure qui masque ce qu'il mesure ne rend pas des résultats
   faibles, il en rend des faux : ce jour-là le verdict portait sur la rotation
   du trou noir d'étude, et il ne nous a rien appris d'elle. Une séance entière
   peut se perdre comme ça, et on ne s'en aperçoit qu'à la lecture du rapport.

   Il ne vit pas dans `verif.js` parce qu'il exige `?juge` pour avoir un objet à
   contrôler. Il tourne donc ici, au démarrage de CHAQUE séance — c'est-à-dire
   exactement quand il sert, et sans que personne ait à y penser. */
function eprouve(){
  const ecarts = [];
  const garde = place ? { x: place.x, y: place.y } : null;
  const dep = boite.getBoundingClientRect();

  /* UN PANNEAU NON COMPOSÉ NE SE MESURE PAS, ET NE SE JUGE DONC PAS.

     Avant `demarre()`, la fenêtre est en `display:none` : sa boîte fait zéro sur
     zéro, aucun déplacement ne s'y lit, et le contrôle rendait « la poignée ne
     la déplace pas » sur un instrument parfaitement sain. C'est une fausse
     alerte dans l'outil même qui existe pour n'en produire aucune — et je l'ai
     vue en l'appelant à la main sur le site en ligne.

     Le seul appelant réel est `demarre()`, qui affiche la fenêtre juste avant.
     Ce garde-fou ne masque donc rien : il refuse de conclure là où il n'y a
     rien à mesurer, au lieu d'inventer un verdict. */
  if(dep.width < 1 || dep.height < 1) return ecarts;

  const envoie = (cible, type, x, y) => cible.dispatchEvent(new PointerEvent(type,
    { clientX:x, clientY:y, bubbles:true, cancelable:true, pointerId:1 }));

  // 1. La poignée déplace la fenêtre.
  const vise = { x: Math.round(innerWidth * 0.42), y: Math.round(innerHeight * 0.3) };
  envoie(poignee, "pointerdown", dep.left + 12, dep.top + 6);
  envoie(window,  "pointermove", vise.x, vise.y);
  const apres = boite.getBoundingClientRect();
  if(Math.abs(apres.left - dep.left) < 1 && Math.abs(apres.top - dep.top) < 1)
    ecarts.push("la poignée ne la déplace pas");

  /* 2. On ne peut pas la perdre. Elle serait alors plus gênante qu'avant : on
        ne la voit plus, et elle couvre toujours un coin de la scène. */
  envoie(window, "pointermove", innerWidth + 4000, innerHeight + 4000);
  const bd = boite.getBoundingClientRect();
  if(bd.right > innerWidth + 1 || bd.bottom > innerHeight + 1)
    ecarts.push("elle sort de l'écran en bas à droite");
  envoie(window, "pointermove", -4000, -4000);
  const hg = boite.getBoundingClientRect();
  if(hg.left < -1 || hg.top < -1)
    ecarts.push("elle sort de l'écran en haut à gauche");

  // 3. Le relâchement arrête le glissé — sinon elle colle au pointeur à vie.
  envoie(window, "pointerup", 0, 0);
  const fixe = boite.getBoundingClientRect();
  envoie(window, "pointermove", vise.x, vise.y);
  if(Math.abs(boite.getBoundingClientRect().left - fixe.left) > 1)
    ecarts.push("elle suit encore le pointeur après le relâchement");

  // Un contrôle ne laisse pas de trace : on la remet exactement où on l'a prise.
  if(garde){ place.x = garde.x; place.y = garde.y; recadre(); }
  else {
    place = null;
    boite.style.left = boite.style.top = "";
    boite.style.bottom = boite.style.transform = "";
  }
  return ecarts;
}

let instrumentCasse = [];

// ================================================================== la séance
const verdicts = [];
/* Ce qu'on remarque en passant, et qui n'est la réponse à rien.

   La première version ne recevait que des réponses à MES questions. Hugo :
   « je ne pouvais pas commenter, ne fût-ce que ce que je voyais dans la scène ».
   C'est le reproche le plus juste qu'on puisse faire à un protocole : il ne
   récolte que ce qu'il a prévu, et ce qu'on n'a pas prévu est précisément ce
   qu'on avait besoin d'apprendre. */
const remarques = [];
let i = 0, choisie = null, debut = Date.now();

function montre(){
  if(i >= DECISIONS.length){ termine(); return; }
  const d = DECISIONS[i];
  choisie = null;

  q(".sur").textContent = "jugement " + (i + 1) + " sur " + DECISIONS.length;
  q("h4").textContent = d.titre;
  q("p").textContent  = d.quoi;
  q("textarea").value = "";

  const erreur = sur(d.pose);

  /* La séance vérifie qu'elle montre bien ce dont elle parle.

     Quand une décision déclare une `cible`, on projette ce point à l'écran. S'il
     n'y est pas, on le DIT au lieu de laisser quelqu'un chercher — c'est le
     défaut exact qu'Hugo a subi sur le drone. */
  let avertissement = null;
  if(!erreur && d.cible){
    try {
      const c = d.cible();
      const { av } = regardSalon();
      const oe = oeilSalon();
      const versCible = [c[0]-oe[0], c[1]-oe[1], c[2]-oe[2]];
      const dist = Math.hypot(versCible[0], versCible[1], versCible[2]) || 1;
      const devant = (versCible[0]*av[0] + versCible[1]*av[1] + versCible[2]*av[2]) / dist;
      if(devant < 0.55) avertissement = "⚠ la cible n'est pas dans le champ (cos = " + devant.toFixed(2) + ")";
    } catch(e){ avertissement = "⚠ cible introuvable : " + e.message; }
  }

  /* ET CE QU'ON DOIT AVOIR SOUS LES YEUX, quand c'est un élément d'interface.

     `cible` garde les points du MONDE — un drone, un meuble. Il ne dit rien d'un
     panneau : le 6 août au soir, la question sur la rotation a été posée avec
     ses quatre boutons construits dans un panneau resté fermé, et la réponse a
     été « je ne vois pas où modifier la rotation ». Deux fois le même défaut, sur
     deux natures de choses différentes, parce que la garde ne couvrait qu'une
     des deux.

     On vérifie APRÈS le fondu. `#instrument` s'ouvre en trois dixièmes de
     seconde, et mesurer pendant l'animation rendrait « invisible » sur un
     panneau qui s'ouvre très bien — le piège des transitions CSS est déjà écrit
     deux fois dans ce dépôt. */
  if(!erreur && d.montre){
    const monTour = i;
    setTimeout(() => {
      if(i !== monTour) return;                 // on a changé de question entre-temps
      const mal = introuvable(d.montre);
      if(mal) ditEtat(erreur, "⚠ " + mal);
    }, 450);
  }

  /* Ce qu'on a à dire sur l'état des choses s'écrit À LA FIN de `montre()` :
     la rangée de notes n'existe pas encore ici, et c'est elle qu'on doit
     compter avant de se déclarer en bon état. Voir `ditEtat()`. */

  /* Les variantes. Le bouton de validation NOMME celle qui est sélectionnée, et
     il change quand on bascule.

     Hugo, sur la première version : « je garde celle-ci, ça veut dire je garde
     la réponse que j'ai sélectionnée ou aucune réponse ne fonctionne ? Je ne
     trouve pas ça très clair. » Il avait raison — un bouton qui dit « celle-ci »
     sans dire laquelle oblige à reconstituer mentalement ce qu'on vient de
     cliquer. Le libellé porte maintenant le nom. */
  const boiteVar = q(".variantes");
  boiteVar.innerHTML = "";
  if(d.options){
    const titre = document.createElement("div");
    titre.className = "titre-var";
    // Une inspection ne compare pas des propositions, elle regarde la même chose
    // sous plusieurs angles. Le mot le dit, sinon le bouton ment déjà ici.
    titre.textContent = d.inspection ? "Bascule pour regarder :" : "Bascule pour comparer :";
    boiteVar.appendChild(titre);
    d.options.forEach((o, k) => {
      const b = document.createElement("button");
      b.textContent = o.nom;
      b.onclick = () => {
        const e = sur(o.fait);
        if(e){ q(".pas").textContent = "⚠ " + e; return; }
        choisie = o.nom;
        [...boiteVar.querySelectorAll("button")].forEach((c, j) => c.classList.toggle("la", j === k));
        const val = boite.querySelector(".valider");
        if(val && !d.inspection) val.textContent = "✓  Je garde « " + o.nom + " »";
      };
      boiteVar.appendChild(b);
    });
  }

  // Les verdicts. Ils ne disent pas la même chose selon le type de décision :
  // « laquelle ? » se répond en choisissant, « est-ce bien ? » en tranchant.
  const rang = q(".rangee");
  rang.innerHTML = "";
  const bouton = (txt, cls, verdict) => {
    const b = document.createElement("button");
    b.textContent = txt;
    if(cls) b.className = cls;
    b.onclick = () => repond(verdict);
    rang.appendChild(b);
  };
  /* TROIS TYPES, ET LE TROISIÈME A COÛTÉ UNE FONCTIONNALITÉ.

     Le 7 août, une question d'INSPECTION portait des variantes qui n'étaient que
     des angles de vue. La séance a produit sa consigne habituelle — « garde
     celle-ci, enlève les autres » — qui, appliquée à la lettre, aurait supprimé
     trois rotations du site. C'est-à-dire effacer une fonctionnalité parce qu'il
     avait dit qu'elle marchait.

     L'en-tête de ce fichier en tirait la conséquence : « il faudra un type
     distinct, dont le rendu ne parle ni de garder ni d'enlever ». Le voici. Avec
     `inspection: true`, les variantes restent des angles de vue et les verdicts
     redeviennent « ça va » / « ça coince » — on juge la CHOSE, jamais la
     variante depuis laquelle on la regarde. */
  if(d.options && !d.inspection){
    bouton("✓  Je garde celle-ci", "oui valider", "retenu");
    bouton("✕  Aucune de ces " + d.options.length + " ne convient", "non", "aucune");
  } else {
    bouton("✓  Ça va", "oui", "ça va");
    bouton("✕  Ça coince", "non", "ça coince");
  }
  bouton("→  Passer, je ne sais pas", "", "passé");

  /* LE QUATRIÈME BOUTON, ET C'EST LE PLUS UTILE.

     Sans lui, quelqu'un à qui l'on pose une mauvaise question n'a que de
     mauvaises réponses : « ça coince » accuse le site alors que c'est la
     question qui est fausse, et « passer » perd l'information entièrement.

     Hugo a vécu les deux. Une question actionnait le mauvais bouton ; une autre
     lui demandait de juger un drone qu'on ne voyait pas. Dans les deux cas le
     défaut était chez moi, et rien ne lui permettait de me le dire. */
  bouton("↺  La question elle-même ne va pas", "mauvaise", "question");

  /* Et de quoi noter ce qui n'est la réponse à rien. On peut en poser autant
     qu'on veut, sans quitter la scène ni répondre. */
  /* LA RANGÉE DE NOTES SE REMPLACE, ELLE NE S'AJOUTE PAS.

     `rang.innerHTML = ""` plus haut ne vide que la PREMIÈRE rangée. Celle-ci est
     un second élément, inséré à côté — et rien ne retirait le précédent. Le
     panneau gagnait donc cinquante-six pixels par question : cent quarante-deux
     à la première, trois cent dix à la quatrième, et ce en état REPLIÉ.

     La cinquième question de la séance du 6 août était la rotation du trou noir
     d'étude. Le verdict rendu ce jour-là est « ça coince », avec pour seul mot
     « l'interface de test bloque encore l'interface ». Il ne portait pas sur la
     rotation : il portait sur une fenêtre deux fois plus haute qu'à l'ouverture.

     Un instrument qui grossit à mesure qu'on s'en sert fausse d'autant plus qu'on
     avance — c'est-à-dire exactement quand on lui fait le plus confiance. */
  boite.querySelectorAll(".rangee.replie-visible").forEach(n => n.remove());

  const notes = document.createElement("div");
  notes.className = "rangee";
  const bNote = document.createElement("button");
  bNote.className = "note-libre";
  bNote.textContent = "+  Noter autre chose (sans répondre)";
  bNote.onclick = () => {
    const txt = q("textarea").value.trim();
    if(!txt){ q("textarea").focus(); return; }
    remarques.push({ ou: d.titre, txt, minute: Math.round((Date.now() - debut)/60000) });
    q("textarea").value = "";
    q(".pas").textContent = "Noté (" + remarques.length + "). Tu peux en ajouter d'autres.";
  };
  const bCache = document.createElement("button");
  bCache.className = "note-libre";
  bCache.textContent = "👁  Replier pour regarder";
  bCache.onclick = () => { boite.classList.toggle("replie"); recadre(); };
  notes.className = "rangee replie-visible";      // seul rang visible une fois replié
  notes.appendChild(bNote); notes.appendChild(bCache);
  rang.parentElement.insertBefore(notes, q(".pas"));

  /* Les questions qui envoient EXPLORER s'ouvrent repliées : sinon le panneau
     couvre la présentation qu'il faut regarder, ou les boutons qu'il faut
     essayer. On déplie quand on est prêt à répondre. */
  boite.classList.toggle("replie", !!d.libre);
  bCache.textContent = d.libre ? "▸  Déplier pour répondre" : "👁  Replier pour regarder";
  if(d.libre) q(".sur").textContent += "  ·  " + d.titre;

  /* La première variante s'applique d'office, mais SEULEMENT MAINTENANT : son
     gestionnaire écrit dans le bouton de validation, qui vient d'être créé.
     Placé plus haut, il écrivait dans un bouton qui n'existait pas encore. */
  const premiere = boiteVar.querySelector("button");
  if(premiere) premiere.click();

  ditEtat(erreur, avertissement);

  // La question suivante n'a pas la même hauteur que la précédente : si la
  // fenêtre a été déplacée, elle peut déborder sans qu'on ait rien touché.
  recadre();
}

/* La ligne du bas, et le contrôle qu'elle porte.

   Un instrument en panne se dit à CHAQUE question, jamais une seule fois au
   début : le message d'ouverture d'une séance de dix minutes n'est plus lu à la
   troisième, et c'est précisément là qu'on rendrait le verdict faussé.

   Le compte des rangées est un contrôle vivant, pas un souvenir. Il doit y en
   avoir deux : celle des verdicts, celle des notes. Trois veut dire que le
   panneau s'est remis à empiler, donc à grandir, donc à cacher — le défaut du
   6 août, qui a coûté un verdict. Il tourne à chaque question parce qu'il ne
   coûte rien, et parce qu'un défaut qui grandit se voit mieux tard que tôt. */
function ditEtat(erreur, avertissement){
  const maux = instrumentCasse.slice();

  const rangees = boite.querySelectorAll(".rangee").length;
  if(rangees !== 2) maux.push("le panneau empile ses rangées (" + rangees + " au lieu de 2)");

  const panne = maux.length ? "⚠ l'instrument déraille : " + maux.join(" ; ") + " — dis-le-moi.  ·  " : "";
  q(".pas").textContent = panne + (erreur
    ? "⚠ la scène n'a pas pu se poser : " + erreur
    : (avertissement || "Attrape ⠿ en haut pour déplacer cette fenêtre. Rien n'est envoyé."));
}

function repond(verdict){
  const d = DECISIONS[i];
  verdicts.push({ id: d.id, titre: d.titre, verdict,
                  option: d.options ? choisie : null,
                  inspection: !!d.inspection,
                  mot: q("textarea").value.trim(),
                  minute: Math.round((Date.now() - debut)/60000) });
  if(d.rend) sur(d.rend);
  i++;
  montre();
}

// ================================================================== le rapport
function materiel(){
  const g = document.createElement("canvas").getContext("webgl2");
  const d = g && g.getExtension("WEBGL_debug_renderer_info");
  return [
    "navigateur   " + navigator.userAgent,
    "écran        " + screen.width + " × " + screen.height +
      "   fenêtre " + innerWidth + " × " + innerHeight,
    "densité      " + (devicePixelRatio || 1) + "   points tactiles " + (navigator.maxTouchPoints || 0),
    "échelle      " + (typeof echelle !== "undefined" ? echelle : "?") +
      "   (la résolution adaptative a choisi ce palier)",
    "graphique    " + (d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : "inconnu"),
  ].join("\n");
}

/* Ce qui sort d'ici n'est PAS un rapport à ranger dans un dossier. C'est un
   message adressé à Claude, prêt à coller dans la conversation — les décisions
   sont formulées comme des consignes, pas comme des observations.

   La différence est tout le sujet : un rapport demande à quelqu'un de le lire,
   de le traduire en travail, puis de s'en souvenir. Un message se colle, et le
   travail commence à la ligne suivante. */
function termine(){
  rendTout();                 // on rend le monde comme on l'a pris — voir `emprunte`

  /* LA FILE PEUT ÊTRE VIDE, et elle l'est depuis le 9 août au soir : les sept
     questions ont été répondues en deux séances.

     Sans ce cas, `montre()` saute directement ici et la séance annonce « Fini.
     Colle ça dans la conversation » avec un rapport qui ne contient que
     l'en-tête et le bloc matériel. On croit avoir raté quelque chose, on
     recharge, on cherche. Une file vide n'est pas une séance ratée : c'est une
     file vide, et le dire coûte dix lignes. */
  if(!DECISIONS.length){
    q(".sur").textContent = "rien à juger";
    q("h4").textContent   = "Tout est répondu.";
    q("p").textContent    = "Aucune question n'attend ton œil pour l'instant. "
                          + "La prochaine viendra avec le prochain morceau visible.";
    q(".variantes").innerHTML = "";
    q("textarea").style.display = "none";
    const seul = q(".rangee");
    seul.innerHTML = "";
    const f = document.createElement("button");
    f.textContent = "Fermer";
    f.onclick = () => boite.remove();
    seul.appendChild(f);
    global.JUGE.rapport = "";
    return;
  }

  const dits = verdicts.filter(v => v.verdict !== "passé");
  const l = ["Voilà ma séance de jugement sur Périastre. Applique ce qui suit.", ""];

  /* Les questions ratées passent EN PREMIER, et séparément.

     Si une question est mal posée, la réponse ne vaut rien et corriger le site
     serait corriger la mauvaise chose. C'est donc le premier travail, pas une
     note de bas de page. */
  const ratees = dits.filter(v => v.verdict === "question");
  if(ratees.length){
    l.push("## D'abord : des questions que tu as mal posées");
    l.push("");
    for(const v of ratees){
      l.push("- **" + v.titre + "**" + (v.option ? "  (variante affichée : " + v.option + ")" : ""));
      if(v.mot) l.push("  > " + v.mot.split("\n").join("\n  > "));
      else l.push("  > (sans précision)");
    }
    l.push("");
    l.push("Répare la question avant de toucher au site.");
    l.push("");
    l.push("## Ce que j'ai pu juger");
    l.push("");
  }

  for(const v of dits){
    if(v.verdict === "question") continue;               // déjà dit plus haut
    if(v.verdict === "retenu" && v.option)
      l.push("- **" + v.titre + "** → je garde « " + v.option + " ». Pose-la et enlève les autres.");
    else if(v.verdict === "retenu")
      l.push("- **" + v.titre + "** → j'ai validé, mais aucune variante n'était sélectionnée. À vérifier.");
    else if(v.verdict === "aucune")
      l.push("- **" + v.titre + "** → aucune des variantes ne va. Cherche autre chose.");
    /* Sur une INSPECTION, on nomme l'angle depuis lequel il a regardé — c'est un
       renseignement — mais la consigne ne parle jamais de garder ni d'enlever.
       C'est toute la différence, et elle vaut une fonctionnalité. */
    else if(v.verdict === "ça va")
      l.push("- **" + v.titre + "** → ça va" + (v.inspection && v.option ? " (regardé « " + v.option + " »)" : "")
             + ". Raye-le de `A-REGARDER.md`.");
    else
      l.push("- **" + v.titre + "** → ça coince" + (v.inspection && v.option ? " (regardé « " + v.option + " »)" : "")
             + ". À reprendre.");
    if(v.mot) l.push("  > " + v.mot.split("\n").join("\n  > "));
  }

  const passes = verdicts.filter(v => v.verdict === "passé");
  if(passes.length){
    l.push("");
    l.push("Pas tranché cette fois : " + passes.map(v => v.titre).join(" · ") + ".");
  }

  // Ce que je n'avais pas demandé, et qui vaut souvent mieux.
  if(remarques.length){
    l.push("");
    l.push("## Ce que j'ai remarqué au passage");
    l.push("");
    for(const r of remarques){
      l.push("- *(pendant « " + r.ou + " »)*");
      l.push("  > " + r.txt.split("\n").join("\n  > "));
    }
  }

  l.push("");
  l.push("<details><summary>matériel</summary>");
  l.push("");
  l.push("```");
  l.push(materiel());
  l.push("```");
  l.push("</details>");
  const texte = l.join("\n");

  q(".sur").textContent = "séance terminée";
  q("h4").textContent = "Fini. Colle ça dans la conversation.";
  q("p").textContent  = dits.length + " décision(s) tranchée(s). Le texte est déjà écrit pour Claude.";
  q(".variantes").innerHTML = "";
  q("textarea").value = texte;
  q("textarea").style.minHeight = "180px";
  const rang = q(".rangee");
  rang.innerHTML = "";
  const b1 = document.createElement("button");
  b1.className = "oui"; b1.textContent = "Copier";
  b1.onclick = () => navigator.clipboard.writeText(texte)
    .then(() => { q(".pas").textContent = "Copié."; },
          () => { q("textarea").select(); q(".pas").textContent = "Sélectionné — copie à la main."; });
  const b2 = document.createElement("button");
  b2.textContent = "Fermer";
  b2.onclick = () => boite.remove();
  rang.appendChild(b1); rang.appendChild(b2);
  global.JUGE.rapport = texte;
}

/* Exposé pour que la séance soit elle-même éprouvable : un script la déroule
   d'un bout à l'autre sans qu'un doigt ne touche l'écran. Un protocole qu'on ne
   peut pas tester serait une plaisanterie — c'est déjà la règle d'`essai.js`. */
global.JUGE = { DECISIONS, verdicts, montre, repond, termine, rapport: null,
                get etape(){ return i; }, demarre,
                // La fenêtre elle-même, pour que son déplacement soit contrôlable.
                boite, poignee, recadre, eprouve, get place(){ return place; } };

/* Elle attend qu'on soit ENTRÉ.

   Au premier essai, la séance s'ouvrait sur l'écran d'accueil : le panneau
   était bien là, dessous, et le menu par-dessus. Pire, la première décision
   emmenait au salon avant qu'on ait choisi d'y aller — elle se battait avec
   l'entrée du site au lieu de l'attendre.

   Trente millisecondes de patience valent mieux qu'un panneau qu'on cherche. */
/* CE QUE LA SÉANCE EMPRUNTE AU SITE, ET QU'ELLE DOIT RENDRE.

   Le 7 août au soir, Hugo : « c'est hyper lent, j'ai deux images par seconde ».
   Cause trouvée en dix minutes de mesure : son réglage sauvegardé contenait
   `"spin": 0.95`. Une séance de jugement lui avait fait comparer les quatre
   rotations, la rotation est PERSISTÉE dans ses préférences, et personne ne
   l'avait remise à zéro. Depuis, chaque chargement faisait tourner la branche
   Kerr — huit fois plus chère que la branche immobile, 13,8 ms contre 1,6 sur
   une machine de bureau. Sur un téléphone, ça vide l'écran.

   La restauration existait, portée par une question ; j'ai retiré la question
   le matin même et emporté la restauration avec elle. Une protection accrochée
   à un cas particulier n'est pas une protection.

   Elle vit donc ICI, au niveau de la séance : ce qu'on emprunte au monde pour
   poser une question, on le rend en partant, quelle que soit la question. */
let etatEmprunte = null;
function emprunte(){
  etatEmprunte = { spin, lieu };
}
function rendTout(){
  if(!etatEmprunte) return;
  spin = etatEmprunte.spin;
  if(typeof sauve === "function") sauve();   // la rotation est persistée : il faut la RÉÉCRIRE
  etatEmprunte = null;
}

function demarre(){
  boite.style.display = "";
  debut = Date.now();
  emprunte();                           // avant tout, on note ce qu'on va déranger
  instrumentCasse = eprouve();          // avant la première question, jamais après
  montre();
}

const attendEntree = () => {
  const dedans = document.body.classList.contains("dedans")
              || (elAccueil && elAccueil.classList.contains("parti"))
              || !document.body.classList.contains("au-menu");
  if(dedans) demarre();
  else setTimeout(attendEntree, 120);
};
boite.style.display = "none";
attendEntree();

})(window);
