/* ============================================================================
   Le cliquet — le bloc de script ne doit plus grossir.

       node outil-verif-taille.js

   ---------------------------------------------------------------------------
   POURQUOI CE CHANTIER NE SE FERAIT JAMAIS SANS LUI

   Le bloc principal d'`index.html` vit en portée globale, avec des `const` non
   hissés. Une variable employée avant sa ligne le tue ENTIÈREMENT, et le
   symptôme est muet : le bloc s'arrête, la moitié du site disparaît, aucun
   message. C'est arrivé deux fois.

   `CHANTIERS.md` annonçait 3 500 lignes. Le 6 août 2026 il en faisait 4 276.
   Personne n'avait décidé qu'il grossirait — il a simplement grossi, parce que
   chaque ajout y était plus rapide qu'ailleurs et que rien ne comptait.

   C'est le défaut classique du chantier structurel : il n'a AUCUN effet
   visible, donc il ne se fera jamais « quand on aura le temps ».

   ---------------------------------------------------------------------------
   UN CLIQUET, PAS UN OBJECTIF

   On n'exige pas de découper aujourd'hui. On exige seulement que ça ne monte
   plus. Chaque sortie de domaine abaisse le plafond, et le plafond ne remonte
   jamais — c'est la même mécanique que les planchers de `contrat.js`, et c'est
   la seule forme qui ne se fait pas contourner : elle ne demande jamais un
   effort qu'on n'a pas le temps de fournir.

   ENTRETIEN : quand l'outil annonce qu'on peut descendre le plafond, on le
   descend. C'est tout ce que ce fichier demande.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

/* Le plafond. Il ne remonte JAMAIS.

   4 310 le 6 août 2026, après la précondition d'entrée des lieux et le réglage
   du ciel. Le point de départ est ce qu'il est : on ne récrit pas l'histoire,
   on l'empêche de continuer.

   Ce chiffre a d'ailleurs été posé à 4 291 au premier jet — une estimation — et
   l'outil a refusé de passer dès sa première exécution. C'est exactement le
   comportement qu'on lui demande, et il l'a prouvé avant même d'être commis. */
/* 4 314 le 7 août 2026 au soir. **LE PLAFOND MONTE POUR LA PREMIÈRE FOIS**, et
   ça se justifie ici comme l'outil l'exige.

   Il était à 4 310 toute la semaine, je l'ai descendu à 4 298 le matin même en
   retirant du code — puis le bandeau de vol demandé par Hugo (vitesse en
   fraction de c, dilatation, distance parcourue, phase) a coûté treize lignes
   de câblage dans la page.

   CE QUI A ÉTÉ TENTÉ D'ABORD, et qui a rendu quinze lignes : tout le formatage
   est parti dans `voyage1g.js` — `joli.vitesse`, `joli.dilatation` —, où il est
   éprouvable hors navigateur au lieu de vivre dans le bloc géant. C'est le bon
   mouvement, et il ne suffit pas.

   CE QUI N'A PAS ÉTÉ FAIT, et pourquoi : sortir la mise à jour du chronomètre
   dans un module. Elle ne touche que le DOM ; un module qui touche le DOM n'est
   pas éprouvable hors navigateur, donc l'extraction n'aurait servi qu'à
   déplacer des lignes pour satisfaire ce compteur. Truquer un contrôle coûte
   plus cher que treize lignes.

   Il reste treize lignes de câblage irréductible, plus trois de repli. Le
   plafond monte donc de 4 298 à 4 314, et redescendra au prochain domaine
   sorti.

   PUIS 4 343, LE MÊME SOIR ET POUR LE MÊME CHANTIER. Le découpage de la carte
   à l'ouverture de la baie — « la trace des orbites est devant la vitre dans le
   vaisseau » — demande de projeter les trois vitres et de tailler le calque.

   Là encore le cliquet a fait son travail avant de céder : la GÉOMÉTRIE des
   vitres est partie dans `vaisseau.js`, où elle vit à côté des montants qu'elle
   doit éviter et où une formule dupliquée aurait fini par diverger. Ce qui
   reste dans la page est la projection et la taille du calque, qui ne peuvent
   pas en sortir — elles ont besoin de la caméra de la pièce et du contexte de
   dessin.

   Deux hausses en une soirée, c'est beaucoup, et c'est le même chantier qui les
   demande. Le prochain qui touche à ce bloc devrait sortir un domaine entier
   plutôt qu'ajouter une ligne : la marge est consommée.

   ---------------------------------------------------------------------------
   4 382 LE 8 AOÛT — ET CE N'EST PAS UNE TROISIÈME HAUSSE.

   Le critère a changé, donc le chiffre change avec lui. On mesurait le plus
   gros bloc (4 343) ; on mesure maintenant la SOMME des blocs de code de la
   page (4 343 + 14 + 25 = 4 382). Pas une ligne n'a été ajoutée entre les deux
   relevés.

   La raison est écrite plus haut, près de la découpe : le chantier F2 commence
   par couper le bloc en trois, ce qui aurait fait tomber l'ancien compteur à
   ~2 400 sans que rien ne sorte du fichier. Un cliquet qu'on désarme en
   déplaçant une frontière ne cliquette pas.

   À partir d'ici il ne fait plus que descendre. Cible du chantier : ~2 300.

   4 255 le 8 août — LA PREMIÈRE DESCENTE DU CHANTIER. La coupe en trois blocs
   avait coûté huit lignes (deux `"use strict"` et deux commentaires de deux
   lignes) ; sortir le cockpit en rend cent trente-cinq. Le solde est payé dans
   le même commit, pour ne pas laisser une marge traîner.

   4 213 — les deux formateurs de durée dans `format.js`, et le calcul du
   spectre dans `spectre.js`.

   4 208 — le banc d'essai dans `banc.js`. Le gain en lignes est petit ; ce qui
   sort vaut mieux que sa taille : les deux seuils qui prononcent « juste » ou
   « faux » à l'écran vivaient dans une page qu'aucun outil ne lisait.

   3 892 — les écrans de bord dans `ecrans.js`. Le plus gros morceau du
   chantier : trois cent dix-neuf lignes d'un coup, et une ligne morte retirée
   au passage. Sous la barre des quatre mille pour la première fois.

   3 539 — la caméra dans `camera.js`. Cent quatre-vingt-dix-huit lignes, et
   trois choses qui valent mieux que le compte :

   · `lieu` n'a plus qu'UN écrivain. La fondation F1 en faisait sa garantie
     centrale, et c'était faux depuis des semaines — `majCamera` écrivait
     `lieu = "libre"` de son côté, à trois cents lignes d'une ligne qui se
     déclarait « l'unique écriture de tout le fichier ». On ne pouvait pas
     passer par la porte tant que le calcul vivait dedans : `vaAu` appelle
     `majCamera`. Le module rend maintenant `decroche` et la page ouvre la
     porte. Sorti le domaine, le nœud se défait tout seul.

   · `projette` et `surLePlan` lisent enfin la MÊME mesure de l'image. Elles
     sont l'inverse exacte l'une de l'autre et lisaient deux hauteurs
     différentes ; sur un téléphone dont la barre d'adresse se rétracte, le
     clic visait à côté du point qu'on lui montrait. L'aller-retour se referme
     à 1,7·10⁻¹⁴ près, et c'est désormais un contrôle.

   · Le filet est passé de 93 à 106 contrôles au vert SANS qu'on en écrive un
     seul. Deux noms morts, laissés par les extractions du registre et de
     l'habitacle, faisaient lever deux contrôles et emportaient en silence tout
     ce qui venait après eux dans le même bloc. Le `try` de l'étape 0.3 les a
     montrés du doigt ; treize assertions ne s'exécutaient plus. C'est la
     démonstration la plus nette du chantier : ce qu'on ne mesure pas, on ne
     l'a pas. */
/* 3 507 — le pilotage du recul rejoint `recul.js` : le recentrage de la pièce
   vers ce qu'elle quitte, le lever du quadrillage, le lever de la carte des
   étoiles. Trente-deux lignes seulement, et ce n'est pas le point.

   Ces trois règles ont TOUTES ÉTÉ RÉGLÉES PAR L'ŒIL D'HUGO, chacune après un
   défaut qu'il avait vu — l'astre qui s'en va de biais puis saute au centre, le
   quadrillage qui entre brutalement quand la visée pivote, la carte qui coupait
   le recul en deux. Elles vivaient dans une page qu'aucun outil ne lisait.
   Elles ont maintenant vingt-cinq contrôles, dont quatre sabotages qui prouvent
   qu'ils mordent, et deux cent mille tirages qui démontrent que rien n'a bougé. */
/* 3 492 — les gestes dans `gestes.js`. La zone morte du doigt, le plafond de
   vitesse, le rabattement du repère écran dans le plan du disque, et le regard
   borné. Dix-sept lignes, et quatre-vingt-un contrôles là où il n'y en avait
   aucun : le seuil de la zone morte se trouve par bissection, le lancer ne
   dépasse jamais la vitesse de la lumière, le tangage touche sa borne quatorze
   mille fois sans jamais la franchir, et le lacet fait mille dix-huit tours
   sans être serré. */
/* 3 448 — la progression dans `progression.js`. Les huit missions, la quête
   d'accueil, et la mémoire locale. C'est le seul domaine du site qui garde une
   trace de qui joue, et le seul dont le branchement a ATTENDU son outil : le
   7 août, un réglage laissé dans cette mémoire a divisé par huit la cadence sur
   le téléphone d'Hugo, et rien de ce qui y touche n'était éprouvable hors
   navigateur.

   L'outil, écrit d'abord, a trouvé du premier coup que la mémoire laissait
   entrer des infinis — `1e400` est du JSON valide. Les prédicats des missions
   sont maintenant éprouvés SEUIL PAR SEUIL, des deux côtés : « lâcher cinquante
   sondes » ne se coche pas à quarante-neuf, et on le sait au lieu de l'espérer.

   Le branchement a tué le dernier bloc à la première tentative — une propriété
   abrégée `{ QUETE, iQuete }` renommée en `{ QUETE, PROG.iQuete }`, syntaxe
   invalide, bloc mort en silence. Trouvé en trente secondes par `vivant()`, qui
   existe exactement pour ça. C'est la troisième fois que ce mode de panne
   frappe, et la première où il ne coûte rien. */
/* 3 405 le 9 août — **LE PLAFOND MONTE POUR LA TROISIÈME FOIS**, et ça se
   justifie ici comme cet outil l'exige.

   Il était à 3 400 après la sortie de Lumen et de la manette. L'extraction de
   l'accueil a trouvé, SANS MÊME ÊTRE BRANCHÉE, un défaut qui touche tout le
   monde : **la question du niveau de lecture ne se posait plus à qui rechargeait
   tôt.** Elle se décidait sur la PRÉSENCE de `niveau` en mémoire, or franchir la
   porte d'entrée range déjà `niveau: 0` — la valeur du code, pas un choix. On
   entrait, on rechargeait, et l'on restait en « Découverte » sans avoir rien
   demandé.

   La réparation demande un drapeau à part, posé au seul endroit où l'on répond
   vraiment : une entrée dans `CHAMPS`, une variable, sa lecture, son écriture,
   et de quoi expliquer pourquoi deux notions qui se ressemblent ne se
   confondent pas.

   CE QUI A ÉTÉ RENDU D'ABORD : `PR_DUREE` et sa minuterie, morts depuis qu'on ne
   fait plus défiler la présentation tout seul — la durée n'était plus lue nulle
   part, la minuterie jamais armée, seulement éteinte deux fois.

   CE QUI N'A PAS ÉTÉ FAIT, et pourquoi : tailler dans les commentaires pour
   repasser sous la barre. Ce compteur existe pour empêcher le bloc de grossir
   sans qu'on le décide — pas pour faire disparaître l'explication d'un défaut
   qu'on vient de mettre trois semaines à voir. Truquer le contrôle coûte plus
   cher que cinq lignes.

   Il redescendra quand `accueil.js` sera branché : sa chirurgie rend plus de
   deux cents lignes, et elle attend d'être faite d'un bloc. */
/* 3 457 le 9 août — **LE PLAFOND MONTE POUR LA QUATRIÈME FOIS**, et c'est la
   hausse la plus lourde du chantier. Elle se justifie, mais elle se dit.

   F4 EST FERMÉE. Les onze compromis du site s'affichent désormais LÀ OÙ ON LES
   RENCONTRE — c'était la demande d'Hugo du 5 août, et elle n'était tenue qu'à
   moitié : `contrat.js` garantissait qu'un compromis était bien DÉCLARÉ, rien
   ne garantissait qu'il soit MONTRÉ. On pouvait en écrire un dans les règles,
   passer les onze contrôles du contrat, et ne le poser nulle part.

   `VERIF.aveux()` ferme la boucle : il ouvre chaque panneau pour de vrai et
   exige d'y trouver le texte annoncé. Éprouvé faillible en neutralisant le
   poseur de badges — neuf contrôles tombent.

   CE QUE ÇA COÛTE : cinquante-deux lignes, dont trente-sept pour la fonction qui
   peint et huit appels dans les panneaux. Ce sont des lignes de DOM, et le
   tableau des irréductibles de ce chantier les nomme depuis le début : « un
   module qui ferait ça cesserait d'être éprouvable hors navigateur ». Elles ne
   peuvent pas sortir. La moitié éprouvable, elle, est sortie : `aveu.js` et ses
   vingt et un contrôles décident QUI va OÙ, la page ne fait que peindre.

   CE QUI N'A PAS ÉTÉ FAIT, pour la troisième fois de la journée : tailler dans
   les commentaires pour repasser sous la barre. Le compteur existe pour
   empêcher le bloc de grossir SANS QU'ON LE DÉCIDE. Ici on le décide, on l'écrit,
   et on ferme une fondation en échange.

   Il redescendra de plus de deux cents lignes au branchement d'`accueil.js`. */
/* 3 607 le 9 août au soir — **CINQUIÈME HAUSSE**, la plus grosse, et la seule
   demandée par Hugo lui-même.

   Séance de jugement : « ça se voit pas assez, fais un genre de centre des
   notifications, ce genre d'info doit être comme une notification ». Les badges
   de F4 étaient posés au bon endroit et personne ne les voyait — un badge dans
   un panneau qu'on a ouvert pour autre chose ne se lit pas.

   Ce qui est arrivé : une bulle qui prévient à l'arrivée quelque part, un centre
   qui garde tout ce qu'on a croisé, une pastille qui compte ce qui reste. Cent
   cinquante lignes, presque toutes du DOM — la construction des nœuds, les deux
   panneaux, la mémoire du déjà-vu. La DÉCISION, elle, est partie dans `aveu.js`
   avec le reste : `neufs`, `annonce`, `centre`, `resteAVoir`.

   ET CE CHANTIER-LÀ A TUÉ LE BLOC UNE QUATRIÈME FOIS. `poseAveux` est hissée,
   son appel au sommet marchait — mais son corps lit un `let` déclaré trois cents
   lignes plus bas. Zone morte, exception, moitié du site éteinte.

   `outil-verif-ordre.js` est resté vert, et c'était son angle mort : la lecture
   est dans un corps de fonction, donc « différée » — il ne savait pas que cette
   fonction est APPELÉE au sommet. Un appel hissé transforme une différée en
   armée.

   IL SAIT LE VOIR DEPUIS LE MÊME SOIR : il suit les appels de proche en proche,
   et compte une troisième catégorie, `ARMEES_PAR_APPEL`, tenue à zéro. Il a
   trouvé du premier coup un second cas que personne ne cherchait — le lien
   `#etat=` de la touche C, qui ne remettait plus la scène depuis le découpage
   du bloc. C'est le protocole de test d'Hugo, et il était muet.

   Le plafond redescendra au branchement d'`accueil.js`, qui rend plus de deux
   cents lignes. */
/* 3 634 — sixième hausse, vingt-sept lignes, et c'est le prix d'un défaut
   qu'on vient de comprendre.

   Le lien `#etat=` de la touche C ne remettait plus la scène : `appliqueEtat`
   lisait un raccourci déclaré dans le bloc de script SUIVANT, l'exception était
   avalée par le `try` qui protège des liens abîmés, et le lien s'ouvrait sans
   rien restaurer. C'est le protocole de test d'Hugo — il me recolle un lien pour
   que je voie sa scène — et il était muet depuis le découpage du bloc.

   La restauration descend à la fin du démarrage, là où `$`, `vaAu` ET le
   `onclick` du bouton du salon existent tous les trois. Le reste des vingt-sept
   lignes explique pourquoi elle n'est plus là-haut, à l'endroit même où
   quelqu'un voudra la remonter.

   Le plafond redescendra au branchement d'`accueil.js`. */
/* 3 647 — treize lignes, PREMIÈRE ÉTAPE du branchement de l'accueil.

   Ce branchement-là se fait par étapes, et c'est délibéré : sa chirurgie tient
   en treize points DISPERSÉS dans le chemin d'entrée, la première chose que voit
   chaque visiteur. En treize d'un coup, une erreur laisse une porte cassée et
   personne ne sait laquelle des treize. Par étapes, chacune vérifiée et publiée,
   un arrêt laisse toujours le dépôt debout.

   Cette étape-ci branche l'état du domaine et la garde du niveau de lecture.
   Elle GROSSIT parce qu'elle explique pourquoi `niveauHorsBornes` est
   délibérément ignoré — un `niveau: -5` traverse le contrôle de type de
   `progression.js` et fait peindre `undefined` dans la fiche. Le corriger
   pendant un déménagement serait une correction que personne n'a relue ; le
   taire serait pire.

   Les étapes suivantes retirent les écrans — intro, présentation, niveau,
   départ, menu, détail — et là le plafond descend pour de bon : plus de deux
   cents lignes. */
/* 3 751 le 10 août — P1, le carnet du voyageur : premières lignes de la
   Descente au périastre.

   Trente-quatre lignes : l'exécution de l'ordre `inscritSejour` (le seuil
   d'affichage et sa raison), la phrase à la première personne du carnet, et son
   style. La DÉCISION, elle, est ailleurs : `lieux.js` rend l'ordre,
   `registre.js` tient le total vécu qui survit au plafond des quarante lignes —
   tous deux éprouvés hors navigateur (133 et 29 contrôles).

   C'était la moitié manquante de « la meilleure mécanique proposée » du carnet
   d'idées : les deux horloges du salon étaient calculées à chaque image,
   affichées sur un écran de bord, puis JETÉES à la sortie. */
/* 3 790 le 9 août — P2 : l'aveu du fond de ciel suit le rendu.

   Sept lignes, et j'en ai d'abord dépensé vingt-trois avant de resserrer trois
   fois : le plafond a fait son travail de plafond, il m'a fait relire ma propre
   prose. Ce qui reste est portant.

   Quatre pour le repeint du panneau des réglages — le sélecteur y vit, et sans
   lui le badge continuait de dénoncer l'autre rendu à trois centimètres du
   bouton qui le cause. Deux pour l'état du mode, remonté à côté de la mémoire
   des aveux : `poseAveux` lit les deux, depuis un appel de haut niveau, et
   `outil-verif-ordre.js` a refusé la page tant que la déclaration était en bas.
   Le reste dit pourquoi.

   La DÉCISION n'est pas ici : `aveu.js` choisit l'aveu selon le mode (33
   contrôles), `contrat.js` refuse un `selonMode` bancal (5 sabotages), et
   `rendu.js` reste seul à connaître les modes. La page ne fait que peindre. */
/* 3 804 le 9 août — P2 encore : le choix du rendu se pose AUSSI sur l'accueil,
   « au premier passage, à côté de celui de la langue » (CHANTIERS §15).

   Quatorze lignes pour un second sélecteur, et c'est le prix de ne pas en
   écrire deux : la fabrique devient paramétrable (hôte, étiquette, note) et
   pousse son repeint dans `CHOIX_RENDU`, pour que basculer d'un côté mette
   l'autre d'accord. La langue avait payé cette leçon avant nous — sa fabrique
   est unique depuis, et son commentaire dit pourquoi. Sans la liste, on
   bascule sur l'accueil et les réglages montrent encore l'autre mode : le
   réglage serait juste, son image mentirait.

   `outil-verif-rendu.js` lit désormais la page pour exiger les deux poses, les
   deux hôtes, la fabrique unique et la liste de repeints — 24 contrôles. */
/* 3 809 le 9 août — P3 s'ouvre : cinq lignes pour que le quadrillage du recul
   parle la langue du visiteur.

   Elles paient un défaut qui était en ligne depuis toujours : `recul.js` écrivait
   « une case = 1 000 UA » en dur, en français, et un lecteur anglais lisait ça
   pendant tout le trajet — séparateur de milliers et virgule décimale compris.
   Le module ne peut pas résoudre une clé, il ne connaît pas `T` ; la page lui
   tend donc ses mots une fois. Le repli reste du français lisible, jamais une
   clé nue, et `outil-verif-recul.js` l'exige (74 contrôles).

   La même manœuvre a fait entrer l'année-lumière, sans quoi la maille d'arrivée
   du voyage vers le système solaire s'écrirait « 1 700 000 000 000 UA ». */
/* 3 821 le 9 août — douze lignes pour que la page se rende compte qu'elle est
   vieille, et c'est le plafond le mieux payé de la série.

   L'estampille protège les scripts, dont l'adresse change à chaque publication.
   Elle ne protège pas `index.html`, dont l'adresse ne change jamais et que
   GitHub Pages sert avec `max-age=600` — mesuré. Hugo a ouvert la séance de
   jugement après une publication vérifiée, a vu les anciennes questions, et en
   a conclu que rien n'avait été publié. C'est la première fois que ce piège
   coûte SON temps, et sur un téléphone il n'a aucun geste pour s'en sortir.

   Les douze lignes ne font que demander la page sans cache et sauter. Toute la
   décision — faut-il recharger, vers où, et surtout QUAND SE TAIRE — est dans
   `frais.js`, éprouvé par 22 contrôles dont la moitié porte sur les cas où il
   ne doit RIEN faire. C'est l'inverse de l'habitude : ici le faux positif est
   le danger, puisqu'il ferait clignoter le site de quelqu'un. */
/* 3 865 le 10 août — quarante-quatre lignes, et c'est la première fois que le
   plafond monte pour réparer une chose FAUSSE plutôt que pour en ajouter une.

   `d.id` existait dans la table des destinations depuis le premier jour et
   n'était lu nulle part. On partait donc vingt-sept mille années-lumière pour le
   système solaire, et l'on arrivait devant les dix orbites du centre galactique
   — dessinées à la même taille apparente qu'à l'arrivée aux étoiles S, puisque
   `ETOILES_S.cadre` pose `échelle = arrivée / distance` et atteint la taille un
   à toute arrivée. Sept millions de fois trop grandes. Et le pied du panneau
   écrivait « le trou noir est là, au centre » à qui venait de s'en éloigner.

   Ce qui coûte les lignes, ce n'est pas la condition — elle en fait deux. C'est
   d'avoir écrit POURQUOI aux trois endroits où la prochaine main passera :
   au départ du voyage, au dessin, et au pied du panneau. Le reste est parti
   ailleurs : la décision est une DONNÉE portée par la destination (`carte:`),
   pas un test dans le rendu, et c'est ce qui permet à `outil-verif-arrivee.js`
   de l'exiger sans lire une ligne de dessin.

   Au passage, `poseArrivee(v)` n'ouvrait jamais son paramètre et le recevait
   sous deux formes selon l'appelant. Il reçoit la destination, et il s'en sert. */
/* 3 902 le 11 août — trente-sept lignes, et la deuxième hausse qui répare une
   chose FAUSSE : le site annonçait un réglage qui n'existait pas.

   `contenu.js` avoue depuis le 9 août que « le défilement du voyage a deux
   rythmes ». Les deux étaient bien dans `recul.js` — la demande d'Hugo du 7,
   « fais les deux, paramétrable dans les options » — mais `poseRythme` n'était
   appelé que par la séance de jugement et par les outils. Aucun bouton. Le site
   jouait donc le fidèle, qui sur le vrai trajet vers le Soleil franchit 3,93
   décades sur 9,10 dans la PREMIÈRE seconde puis fige l'écran douze secondes.

   CE QUE ÇA COÛTE : le sélecteur et sa liste de repeints, plus la clé de mémoire
   et sa relecture. Ce sont des lignes de DOM — fabriquer des boutons, poser une
   classe « actif », écrire un `textContent` — et le tableau des irréductibles
   les nomme depuis le début. La moitié éprouvable est dehors : `recul.js` porte
   la liste des rythmes, le défaut et la borne, et `outil-verif-recul.js` prouve
   par le COMPORTEMENT que deux noms jouent bien deux défilements.

   CE QUI N'A PAS ÉTÉ TENTÉ : fondre cette fabrique avec celle du rendu. Elles se
   ressemblent, et ce serait la bonne économie le jour où une troisième arrive.
   Pour deux, généraliser aurait touché un réglage qui marche pour en poser un
   qui n'existait pas — le mauvais ordre. C'est noté, pas fait. */
const PLAFOND = 3902;   // ... l'arrivée qui sait où elle est, le rythme qui a son bouton

// Le nombre de modules déjà sortis. Il ne descend jamais non plus : un module
// qu'on ferait rentrer dans le bloc serait le contraire exact du chantier.
// Monté de 24 à 26 le 7 août 2026 : `kerrschild.js` et `contrat.js` — l'outil
// l'avait signalé lui-même, c'est le seul entretien qu'il demande.
const MODULES_SORTIS = 26;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

const ici = __dirname;
const page = fs.readFileSync(path.join(ici, "index.html"), "utf8");

/* Les blocs SANS `src` seulement : une balise qui charge un module est
   précisément ce qu'on encourage, et la compter serait absurde.

   ---------------------------------------------------------------------------
   ON COMPTE LA SOMME, PAS LE PLUS GROS — ET C'EST UNE CORRECTION.

   Cet outil ne regardait que `blocs[0]`, le plus gros. Or le chantier F2
   commence par COUPER le bloc en trois pour qu'une panne n'emporte plus toute
   la page. Le plus gros serait alors tombé de 4 343 à ~2 400 sans qu'une seule
   ligne soit sortie du fichier : la première étape du chantier aurait truqué le
   contrôle censé le mesurer.

   Le cliquet porte donc sur la SOMME du code de la page, qui ne peut pas être
   réduite en déplaçant une frontière. Le plus gros bloc reste affiché, parce
   qu'il dit autre chose — le rayon d'une mort silencieuse.

   ---------------------------------------------------------------------------
   ET LES NUANCEURS NE SONT PAS DU CODE DE PAGE.

   `<script id="fs" type="x-shader/x-fragment">` n'a pas de `src` non plus, et
   l'ancienne expression les attrapait — sans conséquence tant qu'on ne prenait
   que le maximum, fatale dès qu'on somme : 777 lignes de GLSL entreraient dans
   un compteur qui parle de portée globale JavaScript. On filtre donc sur le
   `type`, et un contrôle plus bas exige qu'on en ait bien écarté.

   La découpe elle-même vit dans `outils/blocs.js`, partagée avec
   `outil-verif-ordre.js` : deux expressions recopiées divergent tôt ou tard, et
   le jour où elles divergent, l'un des deux outils mesure un fichier que
   l'autre ne voit pas. */
const { decoupe } = require("./outils/blocs.js");

const { code, autres: ecartes } = decoupe(page);
const blocs = code.slice().sort((a, b) => b.lignes - a.lignes);

const somme = blocs.reduce((s, b) => s + b.lignes, 0);
const gros = blocs[0] || { lignes: 0, depart: 0 };
const totalPage = page.split("\n").length;

console.log("\n  LA TAILLE DU BLOC PRINCIPAL — CLIQUET");
console.log("  ════════════════════════════════════");

groupe("Ce qu'on mesure");
console.log("  index.html                " + String(totalPage).padStart(5) + " lignes");
console.log("  blocs de code sans src    " + String(blocs.length).padStart(5)
            + "   (" + ecartes.length + " nuanceur(s) écarté(s))");
console.log("  LA SOMME — le cliquet     " + String(somme).padStart(5) + " lignes");
console.log("  le plus gros              " + String(gros.lignes).padStart(5)
            + " lignes, à partir de la ligne " + gros.depart);
console.log("  part du fichier           " + String(Math.round(100*somme/totalPage)).padStart(5) + " %");

groupe("Le cliquet");
ok("le code de la page n'a pas grossi", somme <= PLAFOND,
   "≤ " + PLAFOND, somme,
   somme > PLAFOND
     ? "il a pris " + (somme - PLAFOND) + " lignes. Sortir un domaine, ou "
       + "expliquer ici pourquoi le plafond doit monter."
     : "marge : " + (PLAFOND - somme) + " lignes");

if(somme < PLAFOND){
  console.log("\n  ⬇  LE PLAFOND PEUT DESCENDRE : " + PLAFOND + " → " + somme);
  console.log("     Modifier `PLAFOND` dans ce fichier. C'est le seul entretien qu'il demande.");
}

const modules = fs.readdirSync(ici)
  .filter(f => f.endsWith(".js") && !/^(outil-|tout\.js)/.test(f)).length;
ok("aucun module n'est rentré dans le bloc", modules >= MODULES_SORTIS,
   "≥ " + MODULES_SORTIS + " modules", modules + " modules",
   "un domaine qui repasserait en portée globale est le contraire du chantier");

if(modules > MODULES_SORTIS){
  console.log("\n  ⬆  MODULES_SORTIS PEUT MONTER : " + MODULES_SORTIS + " → " + modules);
}

/* Et un garde-fou sur la mesure elle-même : si la découpe des blocs cesse de
   marcher, l'outil rendrait zéro et passerait au vert en ne mesurant rien. */
groupe("La mesure elle-même tient debout");
ok("on a bien trouvé des blocs de script", blocs.length > 0, "> 0", blocs.length);
ok("et le plus gros n'est pas vide", gros.lignes > 500, "> 500 lignes", gros.lignes,
   "un zéro voudrait dire que l'expression de découpe ne mord plus, pas que le "
   + "bloc a disparu — et le contrôle passerait au vert sans rien mesurer");

/* Le filtre sur le type est le seul point où l'on peut se tromper de 777 lignes
   sans s'en apercevoir : s'il cessait de mordre, les nuanceurs entreraient dans
   la somme et le plafond sauterait d'un coup — ou pire, on le monterait pour
   « faire passer », en croyant que le code a grossi. */
ok("les nuanceurs sont bien écartés du compte", ecartes.length >= 4,
   "≥ 4 blocs de nuanceur", ecartes.length,
   ecartes.length ? ecartes.map(b => b.type + " (" + b.lignes + " l)").join(" · ")
                  : "AUCUN — le filtre sur le type ne mord plus");
ok("la somme est cohérente avec le plus gros", somme >= gros.lignes,
   "≥ " + gros.lignes, somme,
   "trivial, sauf si le filtre a laissé passer un bloc dans un compte et pas dans l'autre");

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
