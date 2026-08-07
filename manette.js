/* ============================================================================
   LA MANETTE — le manche flottant, et QUI pilote

   La commande tactile du salon : un manche virtuel dans la moitié gauche de
   l'écran, pour marcher au doigt. Dans le bloc d'`index.html`, ce geste-là
   mêlait trois choses de natures différentes, exactement comme les gestes du
   doigt avant `gestes.js` :

     · ÉCOUTER — `pointerdown`, `pointermove`, `pointerup`, la moitié d'écran,
       le doigt qu'on retient pour ne pas le confondre avec celui qui oriente le
       regard. Ça ne peut pas sortir : c'est le navigateur.
     · PLACER — `getElementById("stick")`, `style.left`, `style.transform`, la
       classe `tactile` sur le corps du document. Ça ne peut pas sortir non plus.
     · CALCULER — de combien le pouce a poussé, dans quelle direction, avec
       quelle intensité ; et si le clavier doit piloter ou se taire. Ça, ça doit
       sortir.

   Ce fichier est la troisième part, et rien d'autre. Il reçoit des NOMBRES et
   rend des NOMBRES ; la page place les pixels. On peut donc lui demander « un
   pouce poussé de six pixels, ça marche à quelle vitesse ? » sans navigateur —
   et c'est la seule façon de voir une zone morte mal placée, parce qu'une zone
   morte mal placée ne se voit JAMAIS en jouant. On croit qu'on a le doigt lourd.

   ---------------------------------------------------------------------------
   LA ZONE MORTE — LE CŒUR DE CE FICHIER

   Le pouce est borné à `R_STICK` = 46 px du centre du manche. Sous 14 % de ce
   rayon, l'axe reste à ZÉRO. Sans cette bande, un doigt simplement POSÉ sur la
   moitié gauche de l'écran ferait dériver le personnage : personne ne pose son
   pouce au pixel près, et la dérive se lit comme un défaut du sol.

   Au-dessus du seuil, la rampe vaut `(n − 0,14) / 0,86`. Les deux nombres vont
   ensemble et ce n'est pas un hasard : 0,86 est la LARGEUR de la bande utile,
   c'est-à-dire `1 − 0,14`, et l'égalité est exacte en binaire. C'est ce qui rend
   la rampe CONTINUE — elle vaut 0 pile au seuil, 1 pile au bord de l'anneau.
   Une rampe qui sauterait à 0,14 au franchissement du seuil se sentirait au
   pouce comme un à-coup, et l'on accuserait le personnage d'être nerveux. Le
   contrôle exige donc `ZONE_MORTE + RAMPE = 1` : déplacer l'un sans l'autre
   rouvre la falaise sans que rien ne le dise.

   Les trois constantes — 46, 0,14, 0,86 — sont des réglages de POUCE. Elles ont
   été posées à la main, sur un vrai téléphone, et rien ici ne peut dire si elles
   sont bonnes. `outil-verif-manette.js` garantit seulement qu'elles valent ce
   qu'elles annoncent, partout, et qu'elles ne dérivent pas en silence.

   ---------------------------------------------------------------------------
   CE QUI EST REPRODUIT TEL QUEL, ET QU'IL FAUT LIRE AVANT DE S'EN SERVIR

   `d` est mesuré AVANT le bornage, et il est réutilisé APRÈS pour normaliser.
   Conséquence : au-delà de l'anneau, l'amplitude ne sature pas, elle DÉCROÎT en
   `R_STICK / d`. Le pouce à 46 px marche à 100 % ; à 100 px, à 46 % ; à 300 px,
   à 15 %. Pousser plus fort fait donc marcher moins vite, alors que le disque
   dessiné, lui, reste sagement collé au bord de l'anneau : l'image et l'effet ne
   disent plus la même chose.

   RIEN DE CELA N'EST CORRIGÉ ICI, et c'est délibéré : ce module est une
   extraction, pas une réparation. Corriger en passant reviendrait à changer un
   comportement sous couvert de déménagement, et à changer la sensation du jeu
   sans que personne ne l'ait décidé. Le contrôle ÉPINGLE la décroissance et la
   ressort sous « ⚠ », de sorte que le jour où quelqu'un la traite, ce soit une
   décision et pas un accident.

   De même, `Math.max(d, 1e-3)` au dénominateur est un garde-fou qui ne sert
   jamais : sous 1e-3 px, `n` vaut 2e-5 et la zone morte a déjà tout mis à zéro.
   Il est gardé parce qu'il ne coûte rien et que le supprimer serait, encore une
   fois, changer un fichier au lieu de le déplacer.

   ---------------------------------------------------------------------------
   ON NE DEVINE PAS LE MATÉRIEL, ON OBSERVE L'USAGE

   `moyen` porte une règle, et la règle vaut plus que la fonction.

   Tester la CAPACITÉ tactile est faux. Beaucoup d'écrans de portable en ont une
   tout en étant pilotés à la souris, et le manche venait alors encombrer l'image
   de quelqu'un qui a un clavier sous les doigts. On regarde donc le DERNIER
   MOYEN RÉELLEMENT EMPLOYÉ : un contact au doigt allume la manette, un clic de
   souris l'éteint, une touche de déplacement l'éteint aussi — puisqu'une touche
   de déplacement prouve un clavier. Le dernier usage gagne, dans les deux sens,
   et la manette apparaît ou s'efface avec lui, y compris sur les appareils
   hybrides où l'on passe de l'un à l'autre au cours de la même session.

   C'est pour cette règle que le module ne lit ni `navigator`, ni `matchMedia`,
   ni `ontouchstart` — et que le contrôle le vérifie dans le source. La tentation
   de « détecter le tactile » revient toute seule à chaque relecture.

   Un usage inconnu — un stylet, par exemple — ne change RIEN. C'est le
   comportement d'aujourd'hui : l'ancien gestionnaire ne traitait que `touch` et
   `mouse`, et laissait passer le reste sans toucher à l'état.

   ---------------------------------------------------------------------------
   EST-ON EN TRAIN D'ÉCRIRE ? UNE SEULE DÉFINITION, ET IL EN FALLAIT UNE

   Trois gestionnaires de clavier vivent dans `index.html`. Deux se gardaient des
   champs de saisie, le troisième non — celui qui donne la barre d'espace à la
   pluie de sondes. Résultat : dans n'importe quel champ de texte du site, taper
   un espace ne l'écrivait pas ET lâchait quatre-vingts sondes.

   Hugo l'a trouvé en essayant d'écrire un commentaire dans la séance de
   jugement, c'est-à-dire dans l'outil même bâti pour recueillir ses
   commentaires. Le champ qu'on venait d'agrandir refusait les espaces.

   LA RÈGLE VAUT AUSSI POUR `contenteditable`, qui n'est ni un `input` ni un
   `textarea` et que les deux anciens tests laissaient passer. C'est le vrai
   défaut historique, et c'est celui que le sabotage doit faire mordre.

   `enSaisie` reçoit LA CIBLE, pas un événement. Deux raisons : elle n'a besoin
   que de `tagName` et `isContentEditable`, donc réclamer un événement entier
   serait réclamer plus qu'on ne lit ; et une cible se fabrique à la main, ce qui
   permet à un outil de lui tendre un faux nœud sans navigateur. La page écrit
   donc `MANETTE.enSaisie(e.target)`.

   LE MOTIF EST ANCRÉ — `^…$`. Sans les ancres, un élément personnalisé nommé
   `<mon-input>` passerait pour un champ de saisie et le clavier du jeu se
   tairait devant lui, sans que rien ne l'explique.

   ---------------------------------------------------------------------------
   L'AXE SE REND, IL NE SE LIE PAS

   `bougeStick` RETOURNE l'axe ; elle ne l'écrit nulle part. C'est la leçon de
   `nChute`, écrite noir sur blanc dans `index.html` : UN SCALAIRE RÉASSIGNÉ NE
   SE PARTAGE PAS ENTRE DEUX FICHIERS. `axe.x` et `axe.y` sont relus à chaque
   image par `ARPENTE.avance` ; les lier ici figerait leur valeur du chargement,
   et le module ferait marcher un promeneur imaginaire pendant que le vrai
   resterait planté. C'est la page qui garde l'état — le doigt qui marche et
   l'axe —, et elle seule.

   ---------------------------------------------------------------------------
   LE CONTRAT

     MANETTE.R_STICK      46 px — le rayon de l'anneau. Le pouce dessiné n'en
                          sort jamais.
     MANETTE.ZONE_MORTE   0,14 — en FRACTION du rayon, soit 6,44 px. Sous ce
                          seuil, l'axe est nul, exactement.
     MANETTE.RAMPE        0,86 — la largeur de la bande utile. Vaut
                          `1 − ZONE_MORTE`, exactement, et doit le rester.

     MANETTE.bougeStick(pouce, x, y)
                          Rend `{ dx, dy, axe:{ x, y } }`.

                          pouce   { x, y } — où le doigt s'est posé, en pixels
                                  client ; c'est le centre du manche
                          x, y    où le doigt se trouve maintenant

                          dx, dy  le décalage du pouce DESSINÉ, en pixels, borné
                                  à `R_STICK` — la page n'a qu'à le poser
                          axe     la marche demandée : direction du doigt, et
                                  intensité entre 0 et 1. `axe.y` est compté
                                  vers le BAS, comme l'écran ; `arpente.js`
                                  retourne ce signe pour avancer.

     MANETTE.enSaisie(cible)
                          Écrit-on dans ce nœud ? `cible` n'a besoin de porter
                          que `tagName` et `isContentEditable`. Rend un booléen
                          franc, et ne lève jamais — pas même sur `null`.

     MANETTE.moyen(tactile, usage)
                          Le nouvel état de la manette. `tactile` est l'état
                          courant, `usage` vaut "touch", "mouse", "clavier", ou
                          n'importe quoi d'autre — et n'importe quoi d'autre
                          laisse l'état INCHANGÉ.
   ============================================================================ */

(function(global){
"use strict";

/* Le rayon de l'anneau, en pixels d'écran. Un réglage de pouce : c'est la
   distance qu'un pouce parcourt confortablement sans lâcher le téléphone. Elle
   n'a pas été calculée, elle a été trouvée en marchant. */
const R_STICK = 46;

/* Sous 14 % du rayon — 6,44 px — ce n'est plus une poussée, c'est un doigt
   posé. Sans cette bande, le personnage dérive tout seul et l'on accuse le sol. */
const ZONE_MORTE = 0.14;

/* La largeur de la bande utile, entre le seuil et le bord. Elle vaut
   `1 − ZONE_MORTE`, exactement — l'égalité est vraie au bit près en binaire —
   et c'est CE QUI REND LA RAMPE CONTINUE : 0 pile au seuil, 1 pile au bord.
   Déplacer la zone morte sans déplacer celle-ci rouvrirait une falaise que le
   pouce sent comme un à-coup. Le contrôle refuse que les deux divergent. */
const RAMPE = 0.86;

/* Le motif est ANCRÉ. Sans `^…$`, un élément personnalisé `<mon-input>`
   passerait pour un champ de saisie et le clavier du jeu se tairait devant lui.
   Pas de drapeau `g` : un motif global garde un `lastIndex` entre deux appels,
   et le même nœud répondrait vrai puis faux. */
const SAISIE = /^(input|textarea|select)$/i;

/* Le manche flottant. Reçoit où le doigt s'est posé et où il se trouve, rend le
   pouce à dessiner ET la marche demandée — sans rien écrire nulle part.

   L'ORDRE COMPTE, et il est reproduit tel quel :

     1. le vecteur brut, du centre vers le doigt ;
     2. `d`, sa longueur, MESURÉE AVANT LE BORNAGE ;
     3. le bornage à `R_STICK` — c'est lui qui garde le pouce dessiné dans
        l'anneau, et lui qui empêche l'amplitude de dépasser 1 ;
     4. la rampe, sur le vecteur BORNÉ ;
     5. la normalisation, par `d` — donc par la longueur d'AVANT le bornage.

   Le pas 5 lit la mesure du pas 2 : au-delà de l'anneau, l'amplitude décroît en
   `R_STICK / d` au lieu de saturer. Voir l'en-tête : c'est épinglé, non corrigé. */
function bougeStick(pouce, x, y){
  let dx = x - pouce.x, dy = y - pouce.y;
  const d = Math.hypot(dx, dy);
  if(d > R_STICK){ dx = dx/d*R_STICK; dy = dy/d*R_STICK; }
  const n = Math.hypot(dx, dy)/R_STICK;
  const g = n < ZONE_MORTE ? 0 : (n - ZONE_MORTE)/RAMPE;
  /* `d ? … : 0` est le seul garde qui serve : un doigt PILE au centre donnerait
     sinon 0/0, c'est-à-dire un axe NaN — et un NaN dans la vitesse contamine la
     position, puis la caméra, et la pièce disparaît d'un coup sans message. */
  return {
    dx, dy,
    axe: {
      x: d ? dx/Math.max(d, 1e-3)*g : 0,
      y: d ? dy/Math.max(d, 1e-3)*g : 0,
    },
  };
}

/* Écrit-on dans ce nœud ? Une seule définition pour tout le site — voir
   l'en-tête : c'est l'absence de cette définition unique qui faisait tomber
   quatre-vingts sondes chaque fois qu'on tapait un espace dans un champ.

   Elle ne lève jamais. Un gestionnaire de clavier qui explose sur une cible
   inattendue emporte la touche, et l'on croit que la touche n'est pas branchée. */
function enSaisie(cible){
  if(!cible) return false;
  return SAISIE.test(cible.tagName || "") || !!cible.isContentEditable;
}

/* Le dernier usage gagne — voir l'en-tête, c'est la règle et elle vaut plus que
   la fonction. On n'interroge aucune capacité du matériel : la seule chose qui
   dise si quelqu'un se sert de son doigt, c'est qu'il vient de s'en servir.

   Un usage inconnu laisse l'état INCHANGÉ, et c'est le comportement
   d'aujourd'hui : l'ancien gestionnaire ne traitait que `touch` et `mouse`. Un
   stylet ne doit pas faire disparaître la manette de quelqu'un qui marche au
   pouce et annote au stylet. */
function moyen(tactile, usage){
  if(usage === "touch")   return true;
  if(usage === "mouse")   return false;
  if(usage === "clavier") return false;
  return !!tactile;
}

global.MANETTE = { R_STICK, ZONE_MORTE, RAMPE, bougeStick, enSaisie, moyen };

})(window);
