/* ============================================================================
   Le recul — s'éloigner jusqu'à ce que le trou noir disparaisse.

   L'idée, d'Hugo : plutôt qu'une scène séparée pour les étoiles S, le vaisseau
   s'éloigne et l'on regarde l'astre rétrécir par la baie. Ce n'est pas de
   l'esthétique. Le disque devient invisible à cette distance, et c'est
   précisément le propos : on ne voit plus le trou noir, on voit des étoiles
   tourner autour de rien. C'est ainsi qu'on l'a découvert, trente ans avant
   d'en avoir une image.

   ---------------------------------------------------------------------------
   POURQUOI C'EST LOGARITHMIQUE

   Le rayon de Schwarzschild vaut 1,27 × 10^10 m ; le demi-grand axe de S2
   environ 1,5 × 10^14 m. Quatre décades. Un recul proportionnel au temps
   passerait quatre-vingt-dix-neuf pour cent du trajet à ne plus rien voir.

   On avance donc à vitesse constante EN DÉCADES : le nombre de chiffres croît
   linéairement. Chaque seconde multiplie la distance par le même facteur, ce
   qui est exactement ce que l'œil sait lire — il perçoit les rapports, pas les
   différences.

   ---------------------------------------------------------------------------
   LE QUADRILLAGE, ET POURQUOI IL EST INDISPENSABLE

   Dans le vide, rien ne prouve qu'on bouge. Pas de parallaxe, pas de bord qui
   défile : quatre décades ressemblent à un écran figé qui s'assombrit, et l'on
   conclut que ça a planté. Il faut un étalon.

   Sa maille vaut une puissance de dix ronde et porte sa valeur écrite. Le
   détail qui fait tout : elle garde la même taille à l'écran et se RENUMÉROTE
   en franchissant chaque décade. C'est ce saut d'étiquette, répété quatre
   fois, qui fait sentir la distance — bien plus qu'un compteur qu'on ne lit
   pas.

   Il ne paraît que pendant le mouvement, et se déclare pour ce qu'il est :
   rien ne quadrille l'espace. C'est la règle posée dans IDEES.md — la baie est
   honnête, la surcouche est déclarée.
   ============================================================================ */

(function(global){
"use strict";

const RS_M = 1.269e10;            // rayon de Schwarzschild de Sgr A*, en mètres
const UA_M = 1.495978707e11;

const etat = {
  actif: false,
  d0: 16*RS_M, d1: 16*RS_M,       // départ et arrivée, en mètres
  t: 0, duree: 0,                 // avancement de 0 à 1, et durée en secondes
  distance: 16*RS_M,              // distance courante
  tauBord: 0, tauLoin: 0,         // ce que le trajet aura coûté, en secondes
  parcouru: 0,                    // distance déjà franchie, en mètres
  vol: null,                      // l'état physique courant — voir `avance`
};

/* Lance un recul. La durée à l'écran n'a rien à voir avec la durée réelle du
   voyage : on montre en une quinzaine de secondes ce qui prendrait des mois.
   Le chronomètre, lui, dit la vérité. */
/* LE TEMPS D'ÉCRAN D'UN TRAJET — décision d'Hugo, 9 août 2026.

   Vingt-deux secondes avaient été calibrées sur le recul vers les étoiles S,
   c'est-à-dire sur 3,87 décades. Le trajet vers le système solaire en fait 9,10,
   et les deux réponses simples sont mauvaises : garder la même cadence par
   décade donne cinquante-deux secondes à regarder une grille se renuméroter, et
   garder vingt-deux secondes la fait changer d'étiquette presque deux fois par
   seconde au milieu du trajet.

   Il a tranché pour le compromis : la durée suit la RACINE du nombre de
   décades. Le grand trajet dure trente-quatre secondes, les courts ne bougent
   pas, et rien n'est calibré à la main destination par destination — ce qui
   serait une table de plus à tenir à jour.

   Le plancher de huit secondes n'est pas de la prudence : sous cette durée, un
   déplacement se lit comme un saut d'image plutôt que comme un voyage, et le
   quadrillage n'a pas le temps de changer d'étiquette une seule fois. */
const DECADES_REF = 3.87, BASE_S = 22, PLANCHER_S = 8;
function duree(d0, d1, base){
  const b = base || BASE_S;
  const dec = Math.abs(Math.log10(d1) - Math.log10(d0));
  if(!Number.isFinite(dec) || dec <= 0) return b;
  return Math.max(PLANCHER_S, b * Math.sqrt(dec / DECADES_REF));
}

function lance(vers_m, secondesEcran){
  const v = global.VOYAGE.entre(etat.distance, vers_m);
  etat.actif = true;
  etat.d0 = etat.distance;
  etat.d1 = vers_m;
  etat.t = 0;
  etat.duree = secondesEcran || 14;
  etat.tauBord = v.tau;
  etat.tauLoin = v.t;
  etat.parcouru = 0;
  etat.vol = null;
  return v;
}

/* ---------------------------------------------------------------------------
   LA POSITION EST CELLE DU VRAI VOL À 1 g. IL N'Y A PLUS DE COURBE DE CONFORT.

   Il y avait ici une interpolation lissée du logarithme de la distance, choisie
   parce qu'elle était agréable, pendant que le chronomètre calculait le vrai
   vol relativiste. Deux descriptions du même voyage, qui ne se ressemblaient
   pas.

   J'AI HÉSITÉ, ET JE ME SUIS TROMPÉ DANS LES DEUX SENS. D'abord j'ai basculé
   sur le profil physique, puis je suis revenu à la courbe de confort en voyant
   que la seconde moitié du trajet couvrait à peine trois dixièmes de décade
   contre deux virgule sept pour la première — j'ai lu ça comme « la seconde
   moitié ne bouge plus ».

   C'était la DÉCÉLÉRATION, et c'est le sujet. Hugo, 7 août au soir : « on reste
   dans l'idée de la simulation, donc il faut que ce soit précis. Au début ça va
   aller doucement, puis au milieu du trajet à sa vitesse maximale, puis ça va
   re-ralentir parce qu'on décélère jusqu'à l'arrivée. » Ce que je prenais pour
   un défaut d'animation est exactement ce qu'un vaisseau qui freine donne à
   voir.

   Le temps d'écran est donc proportionnel au temps PROPRE, et la position vient
   de `VOYAGE.etat`. Trois conséquences :

   - le mouvement vu et le chiffre affiché ne peuvent plus diverger, puisqu'ils
     sortent du même calcul ;
   - le départ et l'arrivée sont doux GRATUITEMENT, la vitesse valant zéro aux
     deux bouts — c'est ce que l'ancienne courbe imitait à la main ;
   - le seul artifice restant est la COMPRESSION du temps, quatorze secondes
     d'écran pour des mois de vol, et le site le déclare déjà.                */
/* DEUX RYTHMES, ET C'EST UN RÉGLAGE — décision d'Hugo, 7 août 2026 au soir :
   « fais les deux, paramétrable dans les options ; le choix par défaut changera
   quand on aura l'option cinéma ou réaliste ».

   Il avait demandé un défilement lent-rapide-lent, et la physique en donne un
   autre : la VITESSE du vaisseau fait bien zéro-max-zéro, mais la TAILLE
   APPARENTE change le plus vite au début, quand on est encore près. Doubler une
   petite distance change tout, doubler une grande ne change presque rien.
   Mesuré : 0,58 décade franchie sur le premier dixième du trajet, 0,03 sur
   l'avant-dernier. Les deux faits sont vrais en même temps, et aucun n'est
   négociable — d'où un réglage plutôt qu'un arbitrage.

   `fidele`  — le temps d'écran est proportionnel au temps PROPRE. C'est ce
               qu'on verrait par le hublot, sans retouche.
   `regulier` — le temps d'écran est réparti en décades, ce qui donne un
               défilement égal. La position n'est plus celle de l'horloge, mais
               les chiffres affichés restent VRAIS : on demande à `enChemin` le
               temps propre correspondant à la distance atteinte. Le vaisseau a
               réellement cette vitesse là où il est ; seule la cadence est
               retouchée, et c'est un compromis déclaré.

   Dans les deux cas `etat.vol` sort du même calcul que la position. Il ne peut
   pas y avoir de chiffre qui contredise ce qu'on voit.

   ---------------------------------------------------------------------------
   CE QUE LE VRAI VOYAGE FAIT À CES DEUX RYTHMES — mesuré le 9 août 2026

   Le recul allait jusqu'aux étoiles S : 3,87 décades. Le trajet vers le système
   solaire en fait 9,10. Mesuré seconde d'écran par seconde d'écran, sur les
   quatorze secondes d'animation, en décades franchies :

     étoiles S · fidèle     1,88  0,60  0,35  0,25  0,19 … 0,02  0,01  0
     étoiles S · régulier   0,01  0,04  0,11  0,21  0,34  0,51  0,72  0,72 …
     système solaire · fidèle    4,76  0,82  0,67  0,64  0,64  0,64  0,64  0,25
                                 0,04  0,01  0  0  0  0
     système solaire · régulier  0,01  0,09  0,25  0,49  0,81  1,21  1,68  1,68 …

   **Le rythme fidèle ne survit pas au vrai trajet.** La PREMIÈRE seconde en
   franchit 4,76 sur 9,10 — plus de la moitié du voyage — et les quatre
   dernières n'en franchissent aucune : l'écran est figé pendant qu'on freine.
   Ce n'est pas un défaut du calcul, c'est ce que la fidélité donne à voir quand
   on l'étire sur neuf décades, et c'est illisible.

   Le rythme régulier tient, mais sa pointe passe de 0,72 à 1,68 décade par
   seconde : la grille se renumérote presque deux fois par seconde au milieu du
   trajet. La manœuvre évidente est d'allonger le temps d'écran avec le nombre
   de décades — 14 s pour 3,87, environ 33 s pour 9,10 — ce qui rendrait au
   régulier exactement la cadence d'aujourd'hui. Elle ne répare pas le fidèle,
   dont le défaut est de forme et non de durée.

   ---------------------------------------------------------------------------
   ET CE QUE LE RÉGULIER COÛTE — trouvé par Hugo le 9 août au soir, mesuré après

   Il a jugé le régulier « ça va », puis a ajouté : « j'ai pas l'impression que
   c'est un voyage où la première moitié est de l'accélération et la deuxième une
   décélération ». Il a raison, et ça se chiffre — le freinage commence à :

     régulier   82 % du temps d'écran   (28 s d'accélération, 6 de freinage)
     fidèle     53 %                     (la bonne moitié, et l'œil ne la voit pas)

   LA CAUSE EST STRUCTURELLE, pas un réglage à corriger. Le régulier étale les
   DÉCADES DEPUIS LE DÉPART — et le milieu du VOYAGE, à 13 500 années-lumière,
   tombe à 88 % de ces décades. On passe donc l'essentiel de l'animation à monter
   en puissances de dix alors qu'on n'a pas encore fait la moitié du chemin.

   LE REMÈDE, et il n'est pas ici : compter les décades DEPUIS SAGITTARIUS pour
   la première moitié, puis VERS LE SOLEIL pour la seconde. Le quadrillage
   monterait puis redescendrait, ce qui est à la fois symétrique et vrai — on
   quitte quelque chose, puis on s'approche d'autre chose.

   Ce remède exige qu'il y ait quelque chose à approcher. C'est exactement ce
   qu'Hugo a demandé le même jour : « une vision du système solaire de loin, avec
   des tags ». Les deux ne font qu'un chantier, et celui-là vient d'abord.

   C'est une décision d'image, elle n'est pas prise ici.

   ---------------------------------------------------------------------------
   LE BOUTON A MIS QUATRE JOURS À ARRIVER — 11 août 2026

   Hugo avait dit « fais les deux, paramétrable dans les options ». Les deux
   rythmes ont été écrits ce soir-là ; l'option, non. `poseRythme` n'était appelé
   que par la séance de jugement et par les outils, et `contenu.js` avouait
   pourtant un réglage — « Le défilement du voyage a deux rythmes ». Un aveu qui
   décrit un bouton absent est pire qu'un aveu absent : il apprend à ne plus les
   lire. C'est la leçon écrite le 9 août, et elle s'est retournée contre nous.

   Conséquence directe : ce qu'il a jugé « ça va » le 9 août au soir — le
   régulier — n'a jamais été ce que le site jouait. `juge.js` reposait « fidele »
   en sortant de séance, exprès, parce qu'une séance ne change pas un réglage en
   douce. Le verdict portait donc sur un rythme que personne ne voyait en jouant.
   (Depuis que le bouton existe, la séance repose le rythme QU'ELLE A TROUVÉ :
   remettre le défaut effacerait maintenant le choix du joueur.)

   LE DÉFAUT RESTE « fidele », ET CE N'EST PAS UNE PRÉFÉRENCE. C'est une décision
   d'image, elle appartient à Hugo, et elle lui est posée. Ma recommandation est
   « regulier » : c'est celui qu'il a jugé « ça va », et sur le vrai trajet vers
   le système solaire — 9,10 décades, 33,7 s d'écran — le fidèle franchit 3,93
   décades dans la PREMIÈRE seconde puis fige l'écran une douzaine de secondes
   pendant le freinage. Mais tant qu'il n'a pas tranché, on ne change pas l'image
   sous les pieds de qui n'a rien demandé : même règle que la langue et le rendu.

   `borneRythme` existe pour la même raison que `RENDU.borne` : le choix se range
   en chaîne dans le navigateur, et tout ce qui en revient doit retomber sur un
   rythme connu — jamais sur un état que `avance` ne saurait pas jouer.        */
const RYTHMES = ["fidele", "regulier"];
const RYTHME_DEFAUT = "fidele";
function borneRythme(r){ return RYTHMES.indexOf(r) >= 0 ? r : RYTHME_DEFAUT; }

let rythme = RYTHME_DEFAUT;
function poseRythme(r){ rythme = borneRythme(r); }

// Une courbe douce aux deux bouts, pour le rythme régulier seulement.
const adouci = x => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2;

/* OÙ EN EST-ON D'UN TRAJET À 1 g — et cette loi n'est écrite qu'ICI.

   Elle vivait dans le corps d'`avance`, ce qui allait tant qu'il n'y avait
   qu'un trajet. Il y en a deux depuis le 11 août : le recul depuis Sagittarius,
   et la CHUTE vers le Soleil, qui se joue dans un tout autre espace — des
   unités astronomiques et non des rayons de Schwarzschild, et qui ne peut donc
   pas passer par `etat`, sous peine de donner deux sens à une même valeur.

   Deux copies d'une loi de mouvement finissent toujours par diverger, et l'œil
   d'Hugo l'a déjà vu une fois : le quadrillage et les orbites employaient
   chacun 1/distance de son côté. C'est la règle 4. On sort donc la loi, PURE —
   elle ne lit ni n'écrit `etat` — et les deux scènes la lisent.

   Le rythme reste celui du module, parce que c'est un réglage du visiteur et
   qu'il vaut pour tout ce qui bouge à l'écran. Un appelant peut le forcer, et
   c'est ce dont les contrôles ont besoin pour éprouver les deux branches sans
   toucher au réglage courant.

   @param d0, d1  départ et arrivée, en mètres, dans l'espace de l'appelant
   @param t       avancement de 0 à 1
   @return { distance, parcouru, vol } — jamais autre chose, jamais d'effet */
function ou(d0, d1, t, r){
  const D = Math.abs(d1 - d0);
  const sens = d1 >= d0 ? 1 : -1;
  const V = global.VOYAGE;
  if(!(D > 0) || !V || !V.etat) return { distance: d1, parcouru: 0, vol: null };
  if((r || rythme) === "regulier"){
    const l0 = Math.log10(d0), l1 = Math.log10(d1);
    const distance = Math.pow(10, l0 + (l1 - l0)*adouci(t));
    const parcouru = Math.min(D, Math.abs(distance - d0));
    return { distance, parcouru, vol: V.etat(D, V.enChemin(D, parcouru).tau) };
  }
  const e = V.etat(D, t * V.etat(D, 0).tauTotal);
  return { distance: d0 + sens*e.s, parcouru: e.s, vol: e };
}

function avance(dt){
  if(!etat.actif) return;
  etat.t = Math.min(1, etat.t + dt/etat.duree);

  const p = ou(etat.d0, etat.d1, etat.t);
  etat.distance = p.distance;
  etat.parcouru = p.parcouru;
  etat.vol = p.vol;

  if(etat.t >= 1) etat.actif = false;
}

/* ============================================================================
   LE PILOTAGE — ce qui se joue à chaque image, en plus de la position.

   Trois règles de mise en scène. Les trois ont été posées par l'œil d'Hugo
   APRÈS qu'il ait vu le défaut correspondant, et les trois vivaient jusqu'ici
   au milieu du câblage de la page, là où aucun contrôle ne pouvait les
   atteindre. Une règle qu'on ne peut pas éprouver finit toujours par repartir
   de travers au premier remaniement : c'est la seule raison de ce déplacement.
   Les quatre réglages — 0,8, 2,2, 0,85, 0,55 — sont ceux d'avant, au chiffre
   près. Ils ne se calculent pas, ils se regardent.

   ---------------------------------------------------------------------------
   1. ON SE TOURNE VERS CE QU'ON QUITTE

   Sans recentrage, la visée reste braquée là où le joueur regardait au départ
   et l'astre s'en va DE BIAIS — il rétrécit dans un coin. Puis la carte des
   étoiles arrive, elle centrée sur le trou noir : on voyait donc l'objet sauter
   du coin au centre au moment du relais, ce qui cassait net l'illusion du même
   lieu vu de plus loin. Hugo l'a vu tout de suite.

   Le recentrage est lent, et il n'interdit rien : on peut continuer à tourner
   la tête, la visée revient simplement d'elle-même. C'est aussi ce qu'on ferait
   — on regarde ce qu'on abandonne.

   LE PLUS COURT CHEMIN EST LE CŒUR DU TRUC. L'écart de lacet se ramène dans
   ]−π, π] avant d'être suivi. Sans cela, deux visées presque identiques posées
   de part et d'autre de la couture — +3,10 rad et −3,10 rad, soit cinq degrés
   d'écart — feraient faire à la pièce un tour complet dans le mauvais sens. Le
   défaut ne se lit pas dans le code, il se voit quand la pièce part à l'envers,
   et il ne se déclenche que sur un secteur étroit de la boussole : c'est
   exactement le genre de faute qu'un contrôle attrape et qu'une relecture non.

   ---------------------------------------------------------------------------
   2. LE QUADRILLAGE NE SE LÈVE QUE SI L'ASTRE EST DANS LE CHAMP

   Il ne paraît que pendant le mouvement — rien ne quadrille l'espace — ET
   seulement quand on regarde ce qu'il quadrille. Sans la seconde condition il
   montait pendant qu'on regardait ailleurs : centré sur le trou noir, il était
   hors écran, puis il ENTRAIT brutalement quand la visée pivotait. Hugo l'a vu
   comme une apparition buguée, et c'en était une.

   ---------------------------------------------------------------------------
   3. LA CARTE NE PARAÎT QU'À L'ARRIVÉE

   Elle se levait autrefois passé une distance seuil, en plein trajet, et se
   substituait au ciel : le recul se trouvait coupé en deux et le fond étoilé
   effacé au moment le plus intéressant. Or l'ordre juste est celui du récit —
   on s'éloigne, le trou noir disparaît, ET ALORS le télescope montre ce qui
   tourne autour de ce vide. D'abord le constat, ensuite l'explication.

   ---------------------------------------------------------------------------
   OÙ VIT L'ÉTAT, ET POURQUOI PAS AU MÊME ENDROIT POUR LES QUATRE

   Un scalaire réassigné ne se partage pas entre deux fichiers : le lier ici en
   figerait la valeur du moment. La leçon est déjà payée dans ce dépôt, c'est
   l'histoire de `nChute`. Rien de mutable ne descend donc dans ce module. Mais
   les quatre valeurs pilotées n'ont pas le même propriétaire, et le contrat
   suit cette frontière au lieu de l'effacer :

     · `grille` et `carte` sont AU RECUL. Le quadrillage est son étalon, la
       carte est son arrivée, et la page ne fait que les lire pour peindre. On
       reçoit donc l'objet qui les tient — c'est `TELESCOPE` — et on les
       REMPLIT, exactement comme `CAMERA.maj` remplit `cam`. Un seul écrivain
       pour chacune, et il est ici.

     · `lacet` et `tangage` sont À L'ARPENTAGE. Le promeneur les écrit à la
       souris pendant le voyage lui-même, et `camera.js` a déjà tranché : « le
       lacet et le tangage du promeneur sont à l'arpentage, pas à la caméra ».
       On les RENVOIE donc, et la page pose. Écrire dans `salon` d'ici ferait un
       second écrivain pour une valeur qui appartient à quelqu'un d'autre — la
       maladie qui a donné le disque à 622×.

   `actif` ne s'argumente pas : c'est l'état du recul, il est dans ce fichier,
   et le faire entrer par la porte ne ferait qu'offrir à la page l'occasion de
   le passer faux un jour.

   ---------------------------------------------------------------------------
   L'ORDRE D'APPEL, QUI N'EST PAS UN DÉTAIL

   Le quadrillage juge la visée d'APRÈS le recentrage. La page recentre, pose
   les deux angles, PUIS calcule son repère de regard et le donne à `enVue`.
   Inverser les deux ferait juger la visée d'avant, et le quadrillage
   commenterait une image en retard ce qu'il est censé accompagner. C'est ce que
   la page faisait déjà ; c'est écrit ici pour que ça le reste.

   ---------------------------------------------------------------------------
   LE CONTRAT

     RECUL.recentre(va, lacet, tangage, dt)   -> { lacet, tangage }, les
                                  nouveaux angles. `va` est la direction de
                                  l'astre DANS LA PIÈCE (`salon.versAstre`) ;
                                  absente, on ne touche à rien.

     RECUL.enVue(av, va)          0 à 1 — le cosinus entre la visée et l'astre,
                                  plancher à 0 pour qu'un astre dans le dos ne
                                  compte pas négativement. `av` est le devant du
                                  regard, calculé par la page : ce repère est à
                                  l'arpentage, et deux lois pour un même espace
                                  se paient toujours.

     RECUL.fondus(tele, dt, vue)  remplit `tele.grille` et `tele.carte`, lit
                                  `tele.retour`. Ne rend rien : l'objet EST la
                                  sortie.

     RECUL.fondu(v, cible, dt, vitesse)   la primitive des deux, exposée pour
                                  qu'un contrôle puisse éprouver la borne sans
                                  monter un télescope autour.
   ============================================================================ */

const RECENTRAGE  = 0.8;    // par seconde — la visée revient d'elle-même
const LEVE_GRILLE = 2.2;    // par seconde — le quadrillage paraît vite
const LEVE_CARTE  = 0.85;   // par seconde — la carte prend son temps
/* LE SEUIL « DANS LE CHAMP » SUIT LA FORME DE L'ÉCRAN, IL N'EST PLUS UN NOMBRE.

   Hugo avait posé 0,55 — un cosinus, donc un angle de 56,6°. Sur son écran en
   16:9 le coin de l'image est à 52,8° : le seuil tombait quatre degrés au-delà
   du coin, et le quadrillage commençait à monter juste avant que l'astre
   n'entre. Réglage d'œil, et il est juste.

   MAIS UN ANGLE FIXE NE SAIT RIEN DE L'ÉCRAN. Mesuré le 8 août, en jouant le
   même trajet dans deux fenêtres :

     1280 × 720   coin à 52,8°   quadrillage à l'image 86, astre à 187 px du
                                 bord, il entre à l'image 97 — 0,18 s plus tard,
                                 le quadrillage est alors à 36 %. C'est bien.

     375 × 812    coin à 35,4°   quadrillage à l'image 86, astre à 745 px du
                                 bord — DEUX largeurs d'écran dehors. Il entre à
                                 l'image 177, une seconde et demie plus tard, et
                                 le quadrillage est déjà à 97 %.

   Sur un téléphone en portrait, le quadrillage paraît donc en entier une
   seconde et demie avant qu'il y ait quoi que ce soit à quadriller. C'est mot
   pour mot le défaut qu'Hugo avait signalé — « il se levait alors qu'on
   regardait encore ailleurs, une apparition buguée » — revenu par la porte du
   format. Et il est sur iPhone.

   On garde donc son réglage, mais on garde ce qu'il VOULAIT dire : « un peu
   au-delà du coin de l'image ». Les quatre degrés sont à lui ; le coin, lui, se
   calcule. Sur son écran, la valeur rendue est 0,5505 — son 0,55 à un
   demi-millième près, et ce n'est pas un hasard, c'est de là qu'on part.

   Reverser tient en une ligne : rendre MARGE_CHAMP puis `Math.cos` d'un angle
   fixe. Le chiffre n'est pas perdu, il est devenu une règle. */
const MARGE_CHAMP = 0.0663;   // radians — 3,8°, l'écart d'Hugo au coin de SON écran

function seuilEnVue(focale, W, H){
  // Le demi-champ DIAGONAL : c'est le coin qui décide, pas le bord. tan du
  // demi-champ vertical vaut 1/F, l'horizontal (W/H)/F, et la diagonale les
  // compose — même géométrie que `projette`, qui divise par F et multiplie par H.
  if(!(focale > 0) || !(W > 0) || !(H > 0)) return 0.55;   // repli sur le réglage d'origine
  return Math.cos(Math.atan(Math.hypot(1, W/H) / focale) + MARGE_CHAMP);
}

/* Un fondu de premier ordre, borné PAR CONSTRUCTION.

   `Math.min(1, dt*vitesse)` n'est pas une précaution de style, c'est ce qui
   rend le fondu monotone quel que soit `dt`. Un onglet passé en arrière-plan
   rend la main avec plusieurs secondes d'un coup : sans le plafond, le pas
   dépasse la cible, la valeur sort de [0, 1] et l'on voit clignoter au retour.
   Le même plafond gouverne le recentrage, pour la même raison. */
function fondu(v, cible, dt, vitesse){
  return v + (cible - v) * Math.min(1, dt * vitesse);
}

/* LA MAIN GAGNE — demande d'Hugo du 9 août 2026, réparée le 10.

   « Qu'on puisse regarder devant, comme dans un cockpit, ou derrière ; peut-être
   des vitres sur les quatre coins. »

   J'ai d'abord lu ça comme une demande de vitres, et c'était passer à côté. La
   vraie cause est ici : pendant TOUT le vol, `majVoyage` ramenait la visée vers
   l'astre à chaque image, à 0,8 par seconde. On tournait la tête vers l'avant,
   et on se la faisait tourner en arrière l'image suivante. Le voyage ne se
   subissait pas de profil par manque de fenêtre — il s'y subissait parce qu'on
   ne pouvait pas regarder ailleurs.

   Le recentrage garde son rôle, qui est réel : au départ, il cadre ce qu'on
   quitte pour qui ne fait rien. Mais dès que la main prend la visée, il se tait,
   et pour le reste du trajet. Pas de reprise en douceur au bout de quelques
   secondes : on regarderait devant, et l'astre reviendrait tout seul se mettre
   au milieu — ce qui est exactement le défaut, avec un délai.

   `mainPrise` arrive en argument plutôt que d'être un état du module : c'est la
   page qui sait qu'on a touché à la visée, et un module qui garderait ce
   drapeau aurait un second écrivain pour une même vérité. */
function recentre(va, lacet, tangage, dt, mainPrise){
  if(mainPrise) return { lacet, tangage };
  if(!va) return { lacet, tangage };
  let dl = Math.atan2(va[0], -va[2]) - lacet;
  while(dl >  Math.PI) dl -= 2*Math.PI;      // ]−π, π] : toujours le plus court
  while(dl < -Math.PI) dl += 2*Math.PI;      // chemin, jamais le tour complet
  // Le tangage n'a pas de couture : il vit dans [−π/2, π/2] et n'en sort pas.
  // Le `clamp` est là pour l'arrondi, `va` étant unitaire à 10⁻¹⁶ près.
  const dtg = Math.asin(Math.max(-1, Math.min(1, va[1]))) - tangage;
  const k = Math.min(1, dt * RECENTRAGE);
  return { lacet: lacet + dl*k, tangage: tangage + dtg*k };
}

// Le plancher à zéro, et non la valeur brute : un astre dans le dos donne un
// cosinus négatif, qui comparé à un seuil positif dirait la même chose — mais
// une échelle qui descend sous zéro se retrouve tôt ou tard multipliée par
// quelque chose, et alors elle ment.
function enVue(av, va){
  if(!va) return 1;
  const c = av[0]*va[0] + av[1]*va[1] + av[2]*va[2];
  return c > 0 ? c : 0;
}

/* `seuil` arrive de l'appelant parce qu'il dépend de la TAILLE DE L'IMAGE, que
   ce module ne connaît pas et ne doit pas connaître — même raison que la `vue`
   de `camera.js`. Il est facultatif : sans lui, on retombe sur le réglage
   d'origine, ce qui garde un appelant ancien exact au lieu de le casser. */
function fondus(tele, dt, vue, seuil){
  const s = Number.isFinite(seuil) ? seuil : 0.55;
  const veutGrille = (etat.actif && vue > s) ? 1 : 0;
  const veutCarte  = (!etat.actif && !tele.retour) ? 1 : 0;
  tele.grille = fondu(tele.grille, veutGrille, dt, LEVE_GRILLE);
  tele.carte  = fondu(tele.carte,  veutCarte,  dt, LEVE_CARTE);
}

/* La décade courante et l'avancement dedans. C'est ce couple qui commande le
   quadrillage : la maille garde sa taille tant qu'on est dans la décade, et
   l'étiquette saute quand on en change. */
function decade(){
  const l = Math.log10(etat.distance / RS_M);   // en rayons de Schwarzschild
  return { entiere: Math.floor(l), fraction: l - Math.floor(l), log: l };
}

/* LES MOTS DU QUADRILLAGE, ET POURQUOI ILS ARRIVENT DE LA PAGE.

   Ils étaient en dur, en français, dans le dessin : un visiteur anglais lisait
   « une case = 1 000 UA » pendant tout le recul. Le module ne peut pas résoudre
   une clé lui-même — il ne connaît pas `T` et ne doit pas le connaître — donc la
   page lui tend ses mots une fois. Le français reste le repli : une page qui
   oublierait de les poser afficherait des phrases, jamais des clés nues. */
const MOTS = {
  case: "une case = ", distance: "distance ",
  rs: " rₛ", ua: " UA", al: " al", locale: "fr-FR",
};
function poseMots(m){ Object.assign(MOTS, m || {}); }

const AL_M = 9.4607304725808e15;     // année-lumière, définie exactement

/* L'étiquette d'une maille, dans l'unité qui parle à cette échelle.

   TROIS UNITÉS DEPUIS LE 9 AOÛT, et c'est ce qui rend le vrai voyage lisible.
   Le recul allait jusqu'aux étoiles S — quatre décades, où les UA suffisent. Le
   trajet vers le système solaire en fait NEUF : à l'arrivée, une maille vaudrait
   « 1 700 000 000 000 UA », c'est-à-dire un nombre que personne ne lit. En
   années-lumière elle en vaut 27 000, et le saut d'étiquette redevient ce qu'il
   doit être — la chose qui fait sentir la distance.

   Les seuils sont à la MOITIÉ de l'unité suivante : on bascule un peu avant, de
   sorte qu'on ne lise jamais « 0,7 UA » quand « 105 000 rₛ » dirait la même
   chose plus mal. */
function etiquette(rs){
  const m = rs * RS_M;
  if(m >= 0.5*AL_M) return arrondi(m/AL_M) + MOTS.al;
  if(m >= 0.5*UA_M) return arrondi(m/UA_M) + MOTS.ua;
  return arrondi(rs) + MOTS.rs;
}
function arrondi(x){
  if(x >= 100) return Math.round(x).toLocaleString(MOTS.locale);
  if(x >= 10)  return Math.round(x).toString();
  const s = x >= 1 ? x.toFixed(1) : x.toFixed(2);
  // La virgule décimale suit la langue, comme le séparateur des milliers.
  return MOTS.locale === "fr-FR" ? s.replace(".", ",") : s;
}

/* Un seul étage du quadrillage, à une maille donnée.

   Trois nappes parallèles plutôt qu'une seule : le repère doit se lire comme un
   VOLUME. Une nappe unique, vue de biais, ressemble à un tapis posé dans le
   vide avec le trou noir posé dessus — on croit voir un objet là où il n'y a
   qu'une aide de lecture. Trois nappes espacées, dont deux plus pâles, donnent
   l'épaisseur, et le point de fuite se lit alors dans les trois.

   Chaque ligne porte en outre son propre alpha, décroissant vers le bord, pour
   que la grille se dissolve au lieu de s'arrêter net sur un rectangle. */
const N = 7;                                        // lignes de part et d'autre
const ETAGES = [[0, 1], [-3, 0.42], [3, 0.42]];     // hauteur en mailles, opacité

function nappe(ctx, projette, maille, force, W, H){
  if(force <= 0.004) return;
  const n = N;

  for(const [h, poids] of ETAGES){
    const y = h * maille;
    for(let i = -n; i <= n; i++){
      ctx.globalAlpha = 0.22 * force * poids * (1 - Math.abs(i)/(n + 1));
      if(ctx.globalAlpha < 0.004) continue;
      ctx.beginPath();
      const a = projette([i*maille, y, -n*maille]);
      const b = projette([i*maille, y,  n*maille]);
      if(a && b){ ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
      const c = projette([-n*maille, y, i*maille]);
      const e = projette([ n*maille, y, i*maille]);
      if(c && e){ ctx.moveTo(c[0], c[1]); ctx.lineTo(e[0], e[1]); }
      ctx.stroke();
    }
  }
  montants(ctx, projette, maille, force, W, H);
}

/* LES MONTANTS — ce qui fait qu'on voit un volume et non des tapis.

   Trois nappes empilées se lisent encore comme trois nappes : rien ne dit
   qu'elles appartiennent au même objet, et l'œil n'a de fuite que dans le plan.
   Hugo, trois fois plutôt qu'une, la dernière le 6 août : « j'aimerai que le
   quadrillage soit 3d, vertical aussi, là on a qu'une grille horizontale. »

   Ce sont les arêtes verticales qui donnent la troisième fuite. Elles relient
   les étages, et c'est cette liaison — pas leur nombre — qui fait le volume.

   TROIS CHOIX, ET LEURS RAISONS :

   Une colonne sur deux. Les poser toutes rendrait la baie illisible ; le repère
   doit rester une aide de lecture, et il est déjà déclaré comme telle.

   Aucune ne passe par le centre. Les indices sont impairs, si bien que le
   trou noir n'est jamais barré par un trait vertical — il est le sujet, pas un
   nœud du quadrillage.

   Elles ne sont PAS assombries. Premier jet, je les avais mises à moitié
   d'opacité, en supposant qu'une arête verticale traverse toute la hauteur de
   l'image et pèserait donc plus lourd à l'œil. Mesure faite sur une vraie image
   depuis la baie : elles font 803 pixels de long en moyenne contre 1060 aux
   horizontales — elles sont plus COURTES, pas plus longues, parce qu'elles ne
   couvrent que six mailles de haut là où les autres en traversent quatorze.

   À 0,081 contre 0,217, elles étaient sous le seuil du visible, et la demande
   serait revenue une quatrième fois. Le léger retrait qui reste vient de la
   décroissance par anneau, qui commence à un cran du centre.

   On les groupe par anneau parce que leur opacité ne dépend que de
   l'éloignement au centre : quatre tracés au lieu de soixante-quatre.

   ---------------------------------------------------------------------------
   POURQUOI ON DÉCOUPE, ET POURQUOI ON JETTE LES TRONÇONS TROP LONGS

   `projette` rend `null` en deçà du plan rapproché. Une arête tracée d'un seul
   trait disparaît donc ENTIÈREMENT dès qu'une seule de ses deux extrémités passe
   derrière ce plan — et comme un montant est haut de six mailles, c'est-à-dire
   la moitié de la distance au trou noir, ça lui arrive tout le temps. Mesuré
   depuis la baie, en pleine décade : deux montants dessinés sur soixante-quatre.

   Les deux survivants étaient pires que l'absence. Une extrémité posée juste au
   bord du plan rapproché projette à l'infini : ils faisaient quatorze mille
   pixels de long, deux traits qui balaient l'écran sans rien vouloir dire.

   On découpe donc chaque montant, et l'on juge tronçon par tronçon. Ce qui
   passe derrière le plan tombe seul, le reste tient. Et l'on écarte tout
   tronçon dont la longueur à l'écran n'a plus de sens — c'est le symptôme d'une
   extrémité rasant le plan rapproché, jamais celui d'une arête honnête. */
const DECOUPE = 6;                 // tronçons par montant

function montants(ctx, projette, maille, force, W, H){
  const n = N;
  const bas  = Math.min(...ETAGES.map(e => e[0])) * maille;
  const haut = Math.max(...ETAGES.map(e => e[0])) * maille;
  const limite = 2 * Math.hypot(W, H);          // au-delà, c'est une aberration

  for(let anneau = 1; anneau <= n; anneau += 2){
    ctx.globalAlpha = 0.22 * force * (1 - anneau/(n + 1));
    if(ctx.globalAlpha < 0.004) continue;
    ctx.beginPath();
    let trace = false;
    for(let i = -n; i <= n; i += 2)
      for(let j = -n; j <= n; j += 2){
        if(Math.max(Math.abs(i), Math.abs(j)) !== anneau) continue;
        let prec = projette([i*maille, bas, j*maille]);
        for(let k = 1; k <= DECOUPE; k++){
          const y = bas + (haut - bas) * k/DECOUPE;
          const p = projette([i*maille, y, j*maille]);
          if(prec && p && Math.hypot(p[0]-prec[0], p[1]-prec[1]) < limite){
            ctx.moveTo(prec[0], prec[1]); ctx.lineTo(p[0], p[1]); trace = true;
          }
          prec = p;
        }
      }
    if(trace) ctx.stroke();
  }
}

/* Dessine le quadrillage sur le calque à deux dimensions.

   La maille se donne en rayons, sans aucun facteur d'échelle : elle vaut le
   dixième de la distance en début de décade et le centième en fin, si bien que
   sa taille apparente décroît de six degrés à un demi-degré. C'est ce
   resserrement, répété quatre fois, qui fait sentir le recul.

   ---------------------------------------------------------------------------
   POURQUOI DEUX MAILLES À LA FOIS

   Avec une seule, la grille SAUTE à chaque décade : dix lignes sur onze
   disparaissent d'un coup et l'on voit un à-coup au lieu d'un éloignement.
   C'est le défaut qu'Hugo a relevé, et il est juste.

   On en dessine donc deux en permanence, distantes d'un facteur dix, fondues
   l'une dans l'autre par la position dans la décade. La fine se resserre et
   s'éteint ; la grossière, d'abord trop lâche pour être lue, s'allume à mesure
   qu'elle devient la bonne. À aucun instant la densité apparente ne change
   brutalement — les nœuds se rapprochent, et d'autres naissent entre eux.

   @param projette  fonction monde → écran, celle du salon
   @param force     0 à 1, pour l'apparition et l'effacement */
/* CE QUE LE QUADRILLAGE MONTRE, SÉPARÉ DE SA PEINTURE.

   Cette loi vivait dans le corps de `dessineQuadrillage`, donc derrière un
   `ctx` et une projection : aucun outil ne pouvait l'atteindre sans monter un
   canevas. Le chantier P3 le disait en une ligne — « aucun des 80 contrôles ne
   balaie le temps : rien ne vérifie qu'une frontière de décade se traverse
   sans saut ». On ne peut pas éprouver ce qu'on ne peut pas appeler.

   Elle est donc pure, et elle ne lit rien d'autre que la distance qu'on lui
   tend. `dessineQuadrillage` la lit et se contente de peindre. Un seul
   écrivain de la loi, comme partout ailleurs.

   LE POINT DÉLICAT, celui qui vaut ce déplacement : à la traversée d'une
   décade, `entiere` monte d'un cran et `fine` est multipliée par dix, tandis
   que le fondu `f` retombe de 1 à 0. La maille 10ⁿ passe donc du rôle de nappe
   GROSSIÈRE à celui de nappe FINE en gardant la même opacité — c'est ce qui
   fait que la grille coule au lieu de sauter. Rien ne le garantissait.

   @param distance_m  en mètres ; par défaut celle du trajet en cours
   @return { nappes: [{maille, alpha}], dominante, f }  mailles en rayons de
           Schwarzschild, alpha entre 0 et 1, avant le fondu d'apparition */
function quadrillage(distance_m){
  const l = Math.log10((distance_m === undefined ? etat.distance : distance_m) / RS_M);
  const entiere = Math.floor(l), fraction = l - entiere;
  // Un fondu adouci aux deux bouts : au milieu de la décade les deux nappes
  // coexistent franchement, ce qui est exactement le moment où l'œil a besoin
  // des deux pour ne pas perdre le fil.
  const f = fraction * fraction * (3 - 2*fraction);
  const fine = Math.pow(10, entiere - 1);
  return {
    nappes: [ { maille: fine,      alpha: 1 - f },
              { maille: fine * 10, alpha: f     } ],
    // L'étiquette suit la maille DOMINANTE, et c'est elle qui fait sentir les
    // décades — un chiffre qui saute une fois, quand la grille, elle, coule.
    dominante: f < 0.5 ? fine : fine * 10,
    f,
  };
}

function dessineQuadrillage(ctx, W, H, projette, force){
  if(force <= 0.01) return;
  const echelle = etat.distance / RS_M;
  const q = quadrillage();

  ctx.save();
  ctx.strokeStyle = "#8fb6ff";
  ctx.lineWidth = 1;

  for(const n of q.nappes) nappe(ctx, projette, n.maille, force * n.alpha, W, H);

  const maille = q.dominante;
  ctx.globalAlpha = 0.85 * force;
  ctx.fillStyle = "#a9c6ff";
  ctx.font = "11px ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillText(MOTS.case + etiquette(maille), 18, H - 46);
  ctx.globalAlpha = 0.55 * force;
  ctx.fillText(MOTS.distance + etiquette(echelle), 18, H - 30);
  ctx.restore();
}

global.RECUL = { etat, lance, avance, ou, decade, etiquette, dessineQuadrillage,
                 quadrillage,
                 poseRythme, poseMots, duree, RS_M, UA_M, AL_M,
                 RYTHMES, RYTHME_DEFAUT, borneRythme,
                 recentre, enVue, fondu, fondus, seuilEnVue,
                 get rythme(){ return rythme; },
                 get actif(){ return etat.actif; } };

})(window);
