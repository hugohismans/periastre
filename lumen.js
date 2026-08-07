/* ============================================================================
   LUMEN — QUAND IL PARLE, ET CE QU'IL DIT.

   La mascotte du site est la seule chose qui prenne la parole sans qu'on la lui
   donne. Trois questions se posaient au même endroit dans la page : faut-il
   parler, que dire, et combien de temps le laisser à l'écran. Les trois étaient
   mêlées au document, au son et à l'horloge — c'est-à-dire invérifiables.

   Ce fichier ne tient que la DÉCISION. Le document, le son et l'horloge restent
   à la page.

   ---------------------------------------------------------------------------
   LA RÈGLE QUI COMPTE, ET D'OÙ ELLE VIENT

   Hugo, en lançant des photons à la chaîne : « ils balancent toujours la même
   phrase, c'est super chiant, moi je veux juste mettre des photons ».

   Le geste se répète, donc la réaction se répétait avec lui. Un guide qui redit
   la même chose quand on insiste est pire que silencieux : il transforme une
   action en punition. On retient donc la dernière fois qu'un MOTIF a parlé, et
   on lui impose soixante-quinze secondes de repos.

   Le délai est long à dessein. Ce n'est pas un anti-rebond de quelques
   secondes, c'est l'engagement de ne pas se répéter tant qu'on n'a pas eu le
   temps d'oublier. Le geste reste possible autant qu'on veut ; c'est le
   commentaire qui se tait.

   Et le repos est PAR MOTIF, jamais global : lancer un photon ne doit pas
   museler la réaction d'une sonde qui tombe. Ce sont deux choses différentes,
   et taire la seconde parce qu'on a dit la première rendrait le guide muet
   pendant qu'il se passe justement quelque chose de neuf.

   ---------------------------------------------------------------------------
   POURQUOI `now` ARRIVE EN ARGUMENT

   Le code d'origine appelait `performance.now()` trois fois dans le même geste
   — une fois dans `reagit`, deux fois dans `dit`. Trois lectures de l'horloge
   pour un seul instant, et aucune façon de rejouer la scène.

   Ici l'instant entre par la porte. Un contrôle peut alors se poser à 74 999 ms
   puis à 75 000 ms du même motif et regarder ce qui change — ce qu'aucune
   partie jouée à la main ne saurait faire, puisqu'on ne sait pas cliquer à la
   milliseconde près.

   ---------------------------------------------------------------------------
   POURQUOI LE HASARD ARRIVE AUSSI EN ARGUMENT

   Le choix d'une réplique n'est pas un dé, c'est un SAC : on mélange le paquet
   et on le vide avant d'en refaire un, sinon l'effet anniversaire fait entendre
   un doublon au bout de quelques tirages. Cette mécanique est de la décision
   pure, elle appartient donc ici — mais elle tire au sort, et un module qui
   tire au sort tout seul n'est pas reproductible.

   `e.alea` est donc une fonction qui rend un nombre dans [0, 1). La page ne
   passe rien et l'on retombe sur `Math.random` ; un outil passe un générateur
   à graine et rejoue deux fois la même partie. C'est le même partage que la
   mémoire locale dans `progression.js` : ce qui vient du dehors entre par `e`.

   ---------------------------------------------------------------------------
   CE QUI N'EST PAS ICI, ET POURQUOI

   Le module DÉCIDE, la page PEINT — comme pour la progression.

   - `elBulleTxt.innerHTML`, le bouton « d'où ça sort ? », `composeMaths` :
     du document, rien que du document.
   - `parle`, `tais`, `MUSIQUE` : du son. Et le son porte une règle que ce
     module ne peut pas connaître — une voix commencée va au bout. La page peut
     donc RECEVOIR un ordre et ne pas l'exécuter parce que Lumen parle encore.
     C'est exactement ce que faisait l'original, où `reagit` marquait le repos
     avant d'appeler `dit`, lequel pouvait renoncer : un motif peut être tu
     soixante-quinze secondes sans avoir jamais été montré. Reproduit tel quel.
   - `tMasque`, l'instant où la bulle doit s'effacer : la page le tient, parce
     que c'est elle qui l'écrit en peignant. Il ENTRE ici en argument.

   ---------------------------------------------------------------------------
   LE CONTRAT

     LUMEN.REPOS                 75000 — le silence dû à un motif qui vient de
                                 parler, en millisecondes
     LUMEN.DUREE                 { plancher, plafond, socle, parCaractere }

     LUMEN.etatNeuf()            { derniereFois:Map, sacs:WeakMap }

     LUMEN.longueur(html)        le nombre de caractères VISIBLES
     LUMEN.duree(html)           combien de temps laisser la bulle à l'écran
     LUMEN.texte(replique)       le html d'une réplique (ou d'une chaîne)

     LUMEN.tire(etat, liste, alea)     une réplique du sac
     LUMEN.resous(etat, x, e)          e = { iNiveau, alea? }
                                 déroule les tableaux et les { niv:[…] }
                                 jusqu'à une réplique

     LUMEN.reagit(etat, e, now)  la décision. Rend `null`, ou des ORDRES.

   Ce que `e` porte pour `reagit`, et rien de plus :

     cle                le motif — « photon », « pluie », « inactif »…
     doux               vrai quand c'est le monde qui déclenche et non un clic
     reactions          la table de `contenu.js`
     iNiveau            le niveau de lecture choisi (0, 1, 2)
     questionsOuvertes  vrai quand les questions de Lumen sont à l'écran
     tMasque            l'instant où la bulle en cours doit s'effacer, ou 0
     alea               facultatif — la source de hasard

   Les ordres, quand il y en a :

     cle      le motif qui a parlé, pour qui veut le tracer
     bulle    { replique, texte, ms, prioritaire }
              `replique` est l'objet de `contenu.js` — la page en tire la voix
              et le bouton de justification ; `texte` est son html ; `ms` est
              la durée d'affichage ; `prioritaire` vaut toujours faux ici, une
              réaction ne coupant jamais une parole en cours.

   ---------------------------------------------------------------------------
   QUATRE CHOSES DE L'ORIGINAL QUI SONT REPRODUITES TELLES QUELLES

   Elles paraissent discutables. Rien n'est corrigé ici : ce fichier doit rester
   interchangeable avec ce qu'il remplace, et une correction glissée dans une
   extraction est une correction que personne n'a relue. Les quatre sortent en
   observation dans `outil-verif-lumen.js`, pour qu'on les tranche à froid.

   1. **Un motif qui parle à l'instant ZÉRO n'est pas retenu**, et reparle donc
      aussitôt. `derniereFois.get(cle) || JAMAIS` prend le zéro rangé pour une
      absence, puisque zéro est faux. Dans la page, `performance.now()` ne vaut
      jamais zéro au moment d'une réaction : le défaut y est inatteignable, et
      c'est exactement pour cela qu'il a survécu. Maintenant que l'instant entre
      par la porte, un appelant peut le déclencher.

   2. **Les clés héritées d'`Object.prototype` passent pour des motifs connus.**
      `reactions["toString"]` trouve une fonction, et l'ordre qui en sort porte
      un texte indéfini. Aucun appel de la page ne peut produire ces noms.

   3. **Une liste de répliques VIDE fait lever.** `tire([])` rend `undefined`,
      `resous` le laisse passer, et `texte(undefined)` lit `.t` sur rien. Comme
      `reagit("inactif")` est appelé depuis la boucle de rendu, une table de
      contenu mal remplie n'y ferait pas une réplique manquante mais une boucle
      morte.

   4. **La borne haute est atteinte à 241 caractères visibles**, soit une
      quarantaine de mots. Trois répliques de `contenu.js` la dépassent
      largement : elles ont donc exactement seize secondes, quelle que soit leur
      longueur réelle. La pente ne sert qu'entre 41 et 240 caractères. C'est
      l'oreille d'Hugo qui a posé ces trois nombres, ils ne bougent pas d'ici.
   ============================================================================ */

(function(global){
"use strict";

/* ---------------------------------------------------------------------------
   LE REPOS                                                                   */

const REPOS = 75000;

/* Quand un motif n'a jamais parlé, on le fait remonter très loin dans le passé
   plutôt que de traiter le cas à part : `now - (-1e9)` dépasse n'importe quel
   repos, et la première réaction sort sans condition. Un `if` de moins sur le
   chemin le plus fréquent du module.

   Le `||` qui l'utilise plus bas confond ce défaut avec un zéro rangé — point 1
   de l'en-tête. Reproduit tel quel, et surveillé par l'outil. */
const JAMAIS = -1e9;

/* ---------------------------------------------------------------------------
   LA DURÉE D'AFFICHAGE

   Trois bornes et une pente. Un texte court reste assez longtemps pour être lu
   même s'il tient en six mots ; un texte long ne monopolise pas l'écran ; entre
   les deux, on donne du temps à proportion de ce qu'il y a à lire.

   Les balises ne se lisent pas, donc elles ne se comptent pas : `<b>` autour de
   dix mots doit donner la même durée que les dix mots nus. Sans ce retrait, une
   réplique richement balisée resterait plus longtemps qu'une réplique nue de
   même longueur — et c'est le balisage qui déciderait du rythme de lecture.  */

const DUREE = { plancher: 5200, plafond: 16000, socle: 3000, parCaractere: 54 };

const BALISES = /<[^>]+>/g;

function longueur(html){
  return String(html).replace(BALISES, "").length;
}

function duree(html){
  const brut = DUREE.socle + longueur(html) * DUREE.parCaractere;
  return Math.min(DUREE.plafond, Math.max(DUREE.plancher, brut));
}

/* Une réplique est soit un objet de `contenu.js`, soit une chaîne toute nue —
   la page appelle `dit()` des deux façons. */
const texte = o => typeof o === "string" ? o : o.t;

/* ---------------------------------------------------------------------------
   L'ÉTAT

   Rien ne vit dans le module : `etatNeuf()` rend un objet que l'appelant garde
   et repasse. Deux parties peuvent tourner côte à côte dans le même processus,
   et un contrôle repart d'un état propre sans avoir à réinitialiser quoi que ce
   soit.

   `sacs` est faible parce qu'il est indexé par la LISTE elle-même : recharger
   le contenu remplace les tableaux, et les vieux sacs disparaissent tout seuls
   au lieu de retenir des répliques que plus personne ne dira.               */

function etatNeuf(){
  return { derniereFois: new Map(), sacs: new WeakMap() };
}

/* ---------------------------------------------------------------------------
   LE SAC DE TIRAGE — pas un dé

   Tirer au sort à chaque fois paraît juste et ne l'est pas : avec onze
   répliques, c'est une chance sur onze de répéter la précédente aussitôt, et
   par l'effet anniversaire on entend un doublon au bout de quelques tirages.
   Ce n'est pas une impression — c'est ce que fait une loi uniforme, et c'est
   exactement ce qu'on ne veut pas d'un guide qui parle tout seul.

   On mélange donc le paquet et on le vide avant d'en refaire un : toutes les
   répliques passent avant qu'aucune revienne. Et la première du nouveau sac
   n'est jamais la dernière de l'ancien, sans quoi la couture entre deux paquets
   rendrait le seul doublon audible qu'on cherchait à éviter.                */

function tire(etat, liste, alea){
  if(liste.length < 2) return liste[0];
  const hasard = alea || Math.random;
  let sac = etat.sacs.get(liste);
  if(!sac || !sac.reste.length){
    const ordre = liste.slice();
    for(let i = ordre.length - 1; i > 0; i--){       // mélange de Fisher-Yates
      const j = Math.floor(hasard()*(i + 1));
      const t = ordre[i]; ordre[i] = ordre[j]; ordre[j] = t;
    }
    const dernier = sac ? sac.dernier : null;
    if(ordre[0] === dernier){ ordre[0] = ordre[1]; ordre[1] = dernier; }
    sac = { reste: ordre, dernier };
    etat.sacs.set(liste, sac);
  }
  sac.dernier = sac.reste.shift();
  return sac.dernier;
}

/* Un tableau = tirage au sort. `{ niv:[…] }` = une version par niveau de
   lecture. Les deux s'imbriquent dans les deux sens, d'où la récursion.

   `iNiveau` ARRIVE, il ne se prend pas : dans la page c'était un global écrit
   par les boutons de niveau, et une réplique lue au mauvais niveau ne se
   remarque pas — elle est juste plus savante, ou plus naïve, que ce qu'on a
   demandé. Personne ne va s'en plaindre, et personne ne va le voir.         */
function resous(etat, x, e){
  const iNiveau = e ? e.iNiveau : undefined;
  const alea = e && e.alea;
  let v = x;
  for(;;){
    if(Array.isArray(v)){ v = tire(etat, v, alea); continue; }
    if(v && v.niv){ v = v.niv[iNiveau]; continue; }
    return v;
  }
}

/* ---------------------------------------------------------------------------
   LA DÉCISION

   Quatre refus, dans cet ordre exact, et l'ordre compte.

   1. Les questions ouvertes coupent tout. Six boutons sont à l'écran et l'on
      attend un choix : écrire par-dessus effacerait la question qu'on était en
      train de lire.

   2. `doux` — la réaction vient du MONDE et non d'un clic. Une sonde qu'on
      regarde tomber ne doit pas chasser la phrase qu'on est en train de lire ;
      un bouton qu'on presse, si, parce qu'on a demandé quelque chose et qu'on
      attend une réponse. C'est toute la différence entre un guide et une
      interruption.

      Le `tMasque &&` est REDONDANT et il est gardé : avec une horloge positive,
      `now < 0` dit déjà faux, et la bulle refermée laisse passer de toute façon.
      Il ne se justifie pas par un cas, il se justifie par ce qu'il déclare —
      « zéro veut dire aucune bulle » — et c'est le code d'origine. Le retirer
      serait une correction déguisée en nettoyage, dans un fichier qui ne doit
      contenir ni l'une ni l'autre.

   3. Le repos du motif — la règle du haut de ce fichier.

   4. Le motif inconnu. Il ne consomme PAS le repos, et c'est délibéré : la page
      appelle `reagit("vitesse")` et `reagit("vitesse1")` pour des motifs qui
      n'existent pas dans `contenu.js`. Si un motif inconnu marquait l'heure, il
      suffirait qu'on écrive un jour la réplique manquante pour qu'elle se taise
      soixante-quinze secondes après un appel qui n'avait rien dit.            */

function reagit(etat, e, now){
  if(e.questionsOuvertes) return null;
  if(e.doux && e.tMasque && now < e.tMasque) return null;
  if(now - (etat.derniereFois.get(e.cle) || JAMAIS) < REPOS) return null;

  const t = e.reactions && e.reactions[e.cle];
  if(!t) return null;

  etat.derniereFois.set(e.cle, now);

  const replique = resous(etat, t, e);
  const html = texte(replique);
  return {
    cle: e.cle,
    /* `prioritaire` reste faux : une réaction n'a jamais coupé la parole. Seule
       une demande explicite — cliquer sur Lumen, choisir une question, changer
       de voix — a ce droit, et ces trois chemins-là appellent `dit()` sans
       passer par ici. */
    bulle: { replique, texte: html, ms: duree(html), prioritaire: false },
  };
}

global.LUMEN = {
  REPOS, DUREE,
  etatNeuf,
  longueur, duree, texte,
  tire, resous, reagit,
};

})(window);
