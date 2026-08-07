/* ============================================================================
   LA PROGRESSION — les missions, la quête d'accueil, et la mémoire locale.

   C'est le seul domaine du site qui garde une trace de qui joue. Tout le reste
   se recalcule à chaque image ; ici on retient qu'une chose a été comprise, et
   on l'écrit dans le navigateur. D'où deux exigences qui n'existent nulle part
   ailleurs dans le chantier F2.

   ---------------------------------------------------------------------------
   PREMIÈRE EXIGENCE — LES PRÉDICATS NE VONT RIEN CHERCHER

   `VERIFS` et `VERIFS_QUETE` sont la substance du domaine : huit et quatre
   phrases qui disent ce que « avoir compris » veut dire. Dans la page, chacune
   lisait un global d'un autre domaine — `compte`, `sondes`, `photons`, `TEMPS`,
   `horloge`, `salon`, `regardSalon`. Une mission validée par erreur, ou jamais
   validée, ne se voit qu'en rejouant la partie à la main.

   Ils reçoivent donc l'état du jeu en ARGUMENT, et n'ont plus de portée
   lexicale sur quoi que ce soit. Un contrôle fabrique alors un faux `jeu`,
   pousse un seul champ à la fois, et vérifie que la bonne mission bascule et
   qu'elle seule. C'est la seule façon de prouver que « lâcher cinquante
   sondes » ne se coche pas à quarante-neuf.

   Leur signature est `(jeu, etat)` : le monde d'abord, la progression ensuite.
   Deux étapes de la quête interrogent `etat.queteVues`, qui appartient à ce
   domaine-ci et non au jeu.

   ---------------------------------------------------------------------------
   DEUXIÈME EXIGENCE — LA MÉMOIRE ARRIVE, ELLE NE SE PREND PAS

   `localStorage` est le seul point de ce module qui écrit hors de lui-même, et
   c'est celui qui a déjà fait mal : le 7 août, une séance de jugement y a
   laissé un réglage lourd et divisé par huit la cadence sur le téléphone
   d'Hugo. Un réglage qui survit à un rechargement est un réglage qu'on ne
   pense plus à soupçonner.

   Le module ne connaît donc pas `localStorage`. Il reçoit `e.memoire` :

       memoire.lit()          rend l'objet rangé, ou null
       memoire.ecrit(objet)   range l'objet
       memoire.efface()       enlève la clé

   C'est l'adaptateur de la page qui tient la clé `periastre.v1`, le
   `JSON.parse`/`stringify` et les `try/catch` de la navigation privée. Un outil
   branche une fausse mémoire — un simple objet en variable — et éprouve
   l'aller-retour complet sans navigateur et sans rien salir sur la machine.

   `efface()` ne figurait pas dans l'interface demandée ; il a fallu l'ajouter,
   parce qu'`oublie()` fait un vrai `removeItem` et qu'écrire `null` à la place
   laisserait la clé en vie.

   ---------------------------------------------------------------------------
   POURQUOI CE MODULE NE TOUCHE PAS AU DOM

   Les six fonctions d'affichage étaient de la peinture pure : `$("m-titre")`,
   `innerHTML`, une classe posée, une classe enlevée. Rien de tout cela ne peut
   vivre ici sans ramener `document`.

   Le partage retenu est celui-ci : le module DÉCIDE, la page PEINT.

   - `panneauMission` et `panneauQuete` rendent un DESCRIPTEUR — du texte et un
     tableau de booléens pour la jauge. Aucune balise, aucun sélecteur.
   - `veilleMission` et `veilleQuete` font avancer la machine et rendent des
     ORDRES : repeindre, poser la classe « fini », dire une réplique, frapper
     une note, enregistrer. La page les exécute.

   Ni `T` ni `remplit` n'entrent ici : le descripteur porte la CLÉ du libellé et
   ses valeurs (`{ cle:"quete.num", vals:{ n, total } }`), la page traduit. Un
   contrôle compare alors des nombres, sans avoir à charger une table de langue.

   ---------------------------------------------------------------------------
   L'ÉTAT N'EST PAS DANS LE MODULE

   `etatNeuf()` rend un objet neuf que l'appelant garde et repasse. Le module
   n'a aucune variable vivante : deux parties peuvent tourner côte à côte dans
   le même processus, et un contrôle repart d'un état propre sans avoir à
   réinitialiser quoi que ce soit.

   La page écrit dans cet état depuis dehors — `etat.queteVues.add(...)` au clic
   sur un poste, `etat.iMission` à la reprise, `etat.missionsActives` au bouton.
   C'est assumé : ces écritures existaient déjà, et les cacher derrière des
   accesseurs n'aurait rien acheté.

   ---------------------------------------------------------------------------
   LE CONTRAT

     PROGRESSION.etatNeuf()          l'état du domaine, tout neuf :
                                     { iMission, missionFinie, tMission,
                                       missionsActives, acquis:Set,
                                       iQuete, queteActive, queteFinie,
                                       tQuete, tRegard, queteVues:Set }

     PROGRESSION.MIS_DE_COTE         les identifiants gardés hors bêta
     PROGRESSION.missions(liste, misDeCote)   la liste filtrée
     PROGRESSION.CHAMPS              la table des réglages persistés
     PROGRESSION.VERIFS              { id: (jeu, etat) => booléen }
     PROGRESSION.VERIFS_QUETE        idem, pour les étapes d'accueil

     PROGRESSION.sauve(e)            e = { memoire, reglages, etat }
                                     rend l'objet écrit.
     PROGRESSION.charge(e)           e = { memoire, etat? }
                                     rend { brut, reglages } ou null ; si `etat`
                                     est fourni, y pose `acquis`.
     PROGRESSION.oublie(e)           e = { memoire, etat }

     PROGRESSION.panneauMission(etat, e)   e = { missions }
     PROGRESSION.panneauQuete(etat, e)     e = { quete }
                                     rendent { parti:true } ou
                                     { parti:false, num, titre, consigne, jauge }

     PROGRESSION.veilleMission(etat, e, now)   e = { missions, jeu }
     PROGRESSION.veilleQuete(etat, e, now)     e = { quete, jeu }
                                     rendent null, ou des ordres (voir plus bas)

     PROGRESSION.lanceQuete(etat, e)  e = { voixActive } — rend les ordres du
                                      réveil : la pose, l'ouverture musicale.
     PROGRESSION.finQuete(etat)       rend les ordres du passage aux missions.

   Ce que `e.jeu` doit porter, et rien de plus :

     jeu.compte           { chute, essaisPres }        — VOL
     jeu.sondes           le tableau des sondes         — VOL
     jeu.photons          le tableau des photons        — VOL
     jeu.TEMPS            { cran }                      — temps.js
     jeu.horloge          { mere, bord }                — TEMPS.horloge
     jeu.reelCible        la cible du rendu réel
     jeu.sondeSuivie      l'indice embarqué, ou null
     jeu.salon            { facteur }
     jeu.regardSalon()    rend { av, dr, ht } — une FONCTION, pas un vecteur.
                          Elle ne coûte que sur l'étape « regarder la baie » ;
                          la précalculer à chaque image la ferait payer tout le
                          temps, pour une étape qui dure quinze secondes.
     jeu.questionsOuvertes   vrai tant que les six questions de Lumen sont là

   ---------------------------------------------------------------------------
   TROIS CHOSES DE L'ORIGINAL QUI SONT REPRODUITES TELLES QUELLES

   Elles paraissent fausses. Elles le sont peut-être. Rien n'est corrigé ici —
   ce fichier doit rester interchangeable avec ce qu'il remplace, et une
   correction glissée dans une extraction est une correction que personne n'a
   relue.

   1. **La jauge de quête s'allume ENTIÈREMENT** à la fin de n'importe quelle
      étape (`jaugePleine` ci-dessous), pendant que `q-num` continue d'annoncer
      « étape 1 sur 4 ». Le panneau se contredit lui-même pendant 4,2 secondes.
      La jauge des missions, elle, n'allume que ce qui est fait.

   2. **Le regard se compte en images, pas en temps** : `tRegard += 16` suppose
      soixante images par seconde. Sur un écran à 120 Hz l'étape se valide en
      0,9 seconde réelle, sur une machine qui rame elle demande le double. Le
      commentaire d'origine annonce d'ailleurs « deux secondes » pour un seuil
      à 1800.

   3. **Le descripteur ignore `missionFinie`/`queteFinie`**, exactement comme
      `majMission`/`majQuete` les ignoraient. Repeindre pendant la fenêtre de
      félicitations efface donc « réussi » et remet la consigne, en laissant la
      classe « fini » posée.
   ============================================================================ */

(function(global){
"use strict";

/* ---------------------------------------------------------------------------
   LES MISSIONS

   Mis de côté pour la bêta, sans être supprimé. Le contenu reste dans
   `contenu.js` et la mécanique dans `MISE_EN_PLACE` : vider cet ensemble suffit
   à tout rendre. Le motif est écrit dans `JUMEAUX.md` — l'expérience embarque
   sur une sonde sans expliquer ce qu'on incarne ni pourquoi la vue change, et
   elle arrive en dernier, c'est-à-dire là où l'on juge l'ensemble.           */
const MIS_DE_COTE = ["m-jumeaux", "m-bord"];

/* La liste jouable. `misDeCote` arrive en argument pour qu'un contrôle puisse
   demander la liste ENTIÈRE — sinon les deux prédicats mis de côté ne seraient
   éprouvables par aucun chemin. */
function missions(liste, misDeCote){
  const hors = new Set(misDeCote || MIS_DE_COTE);
  return (liste || []).filter(m => !hors.has(m.id));
}

/* La porte d'entrée pour qui ne connaît rien : un geste, une chose comprise.
   Chaque condition lit l'état réel du jeu — rien n'est validé sans l'être. */
const VERIFS = {
  "m-chute":  jeu => jeu.compte.chute > 0,
  "m-orbite": jeu => jeu.sondes.some(s => s.sort === "orbite" && !s.gel && s.age > 4),
  "m-pluie":  jeu => jeu.sondes.length >= 50,
  "m-limite": jeu => jeu.compte.essaisPres >= 1,
  "m-photon": jeu => jeu.photons.length > 0 && jeu.TEMPS.cran === 0,
  "m-reel":   jeu => jeu.reelCible > 0.5,
  "m-bord":   jeu => jeu.sondeSuivie !== null,
  "m-jumeaux":jeu => jeu.horloge.mere - jeu.horloge.bord > 1800,
};

/* ---------------------------------------------------------------------------
   LA QUÊTE D'ACCUEIL

   Même mécanique que les missions : un prédicat par étape, évalué à chaque
   image, et la main rendue toute seule. Elle s'en distingue sur un point qui
   compte : elle se joue DANS le salon, où le panneau des missions est masqué
   par le CSS. Elle a donc son propre panneau, et elle n'écrit pas dans
   `acquis` — apprendre où sont les boutons n'est pas comprendre quelque chose,
   et cette monnaie-là ne se gagne qu'en comprenant.                          */
const VERIFS_QUETE = {
  // Regarder la baie : la direction du regard doit pointer vers la vitre.
  // Un seuil sur le produit scalaire, tenu deux secondes — sinon un balayage
  // rapide validerait sans qu'on ait rien regardé.
  "a-baie": jeu => -jeu.regardSalon().av[2] > 0.80,
  /* On attend que les questions soient refermées.

     Sans ce `!questionsOuvertes`, l'étape se validait dans la foulée du
     contact et sa récompense écrasait la bulle : les six questions
     apparaissaient une fraction de seconde, puis disparaissaient. On demandait
     donc d'interroger quelqu'un tout en empêchant de l'interroger.

     Maintenant l'étape se termine quand on a effectivement consulté le drone
     et refermé — ce qui est aussi ce que la consigne promet. */
  "a-lumen": (jeu, etat) => etat.queteVues.has("lumen") && !jeu.questionsOuvertes,
  "a-temps": jeu => jeu.salon.facteur === 1,
  "a-telescope": (jeu, etat) => etat.queteVues.has("telescope"),
};

/* ---------------------------------------------------------------------------
   L'ÉTAT                                                                     */

function etatNeuf(){
  return {
    iMission: 0, missionFinie: false, tMission: 0, missionsActives: true,
    acquis: new Set(),
    iQuete: 0, queteActive: false, queteFinie: false, tQuete: 0, tRegard: 0,
    // les postes déjà activés, pour les étapes 2 et 4
    queteVues: new Set(),
  };
}

/* ---------------------------------------------------------------------------
   LA MÉMOIRE LOCALE

   Tout reste dans le navigateur : pas de serveur, pas de compte, rien qui sorte
   de la machine. En contrepartie, c'est par appareil, et vider l'historique
   efface tout. On le dit plutôt que de faire semblant.

   UNE SEULE TABLE POUR LES DEUX SENS. Écriture et relecture divergeaient
   naturellement dans la page — deux listes de champs à tenir d'accord à la
   main, et rien pour le dire quand elles ne l'étaient plus. Ici le nom rangé,
   le nom vivant et le contrôle de type sont une donnée, et l'aller-retour est
   vérifiable champ par champ.

     cle    le nom dans la mémoire        nom  le nom dans la page
     type   ce qu'il faut être pour être relu
     relit  faux quand le champ est écrit mais délibérément jamais repris    */
const CHAMPS = [
  { cle:"niveau",    nom:"iNiveau",            type:"entier"  },
  { cle:"voix",      nom:"voixActive",         type:"booleen" },
  { cle:"anecdotes", nom:"intervalleAnecdote", type:"nombre"  },
  { cle:"taille",    nom:"zoomSonde",          type:"nombre"  },
  { cle:"volume",    nom:"volumeVoix",         type:"nombre"  },
  /* La rotation se range encore — le registre et la reprise s'en servent — mais
     elle ne se RELIT plus : 13,8 ms l'image contre 1,6. `VERIF.rotationCalme`.
     L'exception est ici une donnée et non un commentaire, pour qu'un contrôle
     puisse exiger qu'elle reste vraie. */
  { cle:"spin",      nom:"spin",               type:"nombre", relit:false },
  { cle:"musique",   nom:"volumeMusique",      type:"nombre"  },
  { cle:"boutons",   nom:"modeBoutons",        type:"booleen" },
  { cle:"mascotte",  nom:"mascotte",           type:"booleen" },
];

function estDuType(v, type){
  if(type === "entier")  return Number.isInteger(v);
  if(type === "nombre")  return typeof v === "number";
  if(type === "booleen") return typeof v === "boolean";
  return false;
}

/* Range tout : les réglages, les missions acquises, et le fait d'être déjà
   venu. Rend l'objet réellement écrit — un `return` muet ne se distinguerait
   pas d'une écriture vide, et l'appelant n'aurait aucune prise dessus. */
function sauve(e){
  const r = e.reglages || {};
  const o = { acquis: [...e.etat.acquis], deja: true };
  for(const c of CHAMPS) o[c.cle] = r[c.nom];
  e.memoire.ecrit(o);
  return o;
}

/* Rend `{ brut, reglages }`, ou null s'il n'y a rien de rangé.

   `reglages` ne porte QUE les champs qui ont passé leur contrôle de type : la
   page applique ce qu'elle reçoit, sans avoir à revérifier. Un champ absent, du
   mauvais type, ou marqué `relit:false` n'y figure pas — et la valeur en place
   dans la page reste donc celle du code.

   `brut` est l'objet rangé tel quel : la page y lit `deja` et `niveau` pour
   savoir si c'est un premier passage. */
function charge(e){
  const d = e.memoire.lit();
  /* Plus strict que l'original, qui acceptait un JSON valide mais scalaire et
     le rendait tel quel. `memoire` étant maintenant injectable, elle peut
     recevoir n'importe quoi d'un outil : on refuse ici plutôt que de laisser
     passer un `5` qui traverserait tout le module sans rien casser de visible. */
  if(d === null || typeof d !== "object") return null;

  const reglages = {};
  for(const c of CHAMPS){
    if(c.relit === false) continue;
    if(estDuType(d[c.cle], c.type)) reglages[c.nom] = d[c.cle];
  }
  if(e.etat) e.etat.acquis = new Set(Array.isArray(d.acquis) ? d.acquis : []);
  return { brut: d, reglages };
}

function oublie(e){
  e.memoire.efface();
  e.etat.acquis = new Set();
  e.etat.iMission = 0;
}

/* ---------------------------------------------------------------------------
   LES DESCRIPTEURS — ce que le panneau doit dire, sans dire comment le dire

   `jauge` est un tableau de booléens, un par étape : à la page d'en faire des
   pastilles. C'est la seule forme qu'un contrôle peut comparer sans analyser du
   HTML — et la jauge est justement la partie qui se contredit (voir l'en-tête).

   Ni l'un ni l'autre ne consulte `missionFinie`/`queteFinie` : c'est le
   comportement d'origine, et le point 3 de l'en-tête dit ce qu'il coûte.     */

function jauge(n, seuil){
  const t = [];
  for(let i = 0; i < n; i++) t.push(i < seuil);
  return t;
}

function jaugePleine(n){
  const t = [];
  for(let i = 0; i < n; i++) t.push(true);
  return t;
}

function panneauMission(etat, e){
  const liste = e.missions;
  if(!etat.missionsActives || etat.iMission >= liste.length) return { parti: true };
  const m = liste[etat.iMission];
  return {
    parti: false,
    num: { cle: "mission.num", vals: { n: etat.iMission + 1, total: liste.length } },
    titre: m.titre,
    consigne: m.consigne,
    jauge: jauge(liste.length, etat.iMission),
  };
}

function panneauQuete(etat, e){
  const liste = e.quete;
  if(!etat.queteActive || etat.iQuete >= liste.length) return { parti: true };
  const q = liste[etat.iQuete];
  return {
    parti: false,
    num: { cle: "quete.num", vals: { n: etat.iQuete + 1, total: liste.length } },
    titre: q.titre,
    consigne: q.consigne,
    jauge: jauge(liste.length, etat.iQuete),
  };
}

/* ---------------------------------------------------------------------------
   LES MACHINES

   Chacune rend `null` quand rien ne s'est passé — le cas de l'écrasante
   majorité des images — ou des ordres. Les ordres possibles, tous facultatifs :

     avance     l'étape précédente est rangée : enlever la classe « fini »
     repeint    redemander le descripteur et repeindre
     reussi     l'étape ou la mission validée (l'objet de `contenu.js`)
     libelle    la clé du texte de félicitations à poser sur le numéro
     jauge      la jauge à peindre pendant les félicitations
     bulle      { texte, ms, prioritaire } — pour `dit()`
     frappe     la force de la note — pour `MUSIQUE.frappe()`
     enregistre il faut appeler `sauve()` : quelque chose a été acquis
     fin        les ordres de `finQuete`, quand la dernière étape vient d'être
                rangée                                                        */

// Le temps de lire la chute, pour une étape comme pour une mission.
const LECTURE = 4200;

function veilleMission(etat, e, now){
  const liste = e.missions;
  if(!etat.missionsActives || etat.iMission >= liste.length) return null;

  if(etat.missionFinie){
    if(now - etat.tMission > LECTURE){
      etat.missionFinie = false;
      etat.iMission++;
      return { avance: true, repeint: true };
    }
    return null;
  }

  const m = liste[etat.iMission];
  const v = VERIFS[m.id];
  if(!v || !v(e.jeu, etat)) return null;

  etat.missionFinie = true;
  etat.tMission = now;
  etat.acquis.add(m.id);
  return {
    reussi: m,
    libelle: "mission.reussi",
    // `i <= iMission` : celle qu'on vient de finir compte déjà.
    jauge: jauge(liste.length, etat.iMission + 1),
    bulle: { texte: m.reussi, ms: 12000 },
    enregistre: true,
  };
}

function veilleQuete(etat, e, now){
  const liste = e.quete;
  if(!etat.queteActive || etat.iQuete >= liste.length) return null;

  if(etat.queteFinie){
    if(now - etat.tQuete > LECTURE){
      etat.queteFinie = false;
      etat.iQuete++;
      // La classe « fini » retombe dans les deux cas, y compris celui où la
      // quête s'achève — c'est l'ordre de l'original.
      if(etat.iQuete >= liste.length) return { avance: true, fin: finQuete(etat) };
      return { avance: true, repeint: true };
    }
    return null;
  }

  const q = liste[etat.iQuete];
  const v = VERIFS_QUETE[q.id];
  if(!v) return null;

  /* La première étape demande de tenir le regard : on compte le temps passé à
     viser plutôt que l'instant où l'on passe devant.

     Le 16 est un nombre d'images déguisé en millisecondes — voir le point 2 de
     l'en-tête. Il est reproduit tel quel. */
  if(q.id === "a-baie"){
    etat.tRegard = v(e.jeu, etat) ? etat.tRegard + 16 : 0;
    if(etat.tRegard < 1800) return null;
  } else if(!v(e.jeu, etat)) return null;

  etat.queteFinie = true;
  etat.tQuete = now;
  return {
    reussi: q,
    libelle: "quete.bien",
    // Toute la jauge s'allume, y compris les étapes qui restent. Point 1.
    jauge: jaugePleine(liste.length),
    bulle: { texte: q.reussi, ms: 13000, prioritaire: true },
    /* Le premier regard mérite plus que les autres : c'est le seul moment du
       parcours où l'on découvre quelque chose au lieu d'apprendre un bouton. */
    frappe: q.id === "a-baie" ? 1 : 0.45,
  };
}

/* La fin de la quête dépose au télescope, c'est-à-dire dans la vue libre, et
   passe le relais aux missions. On demande le niveau de lecture ICI et pas à
   l'entrée : personne ne sait répondre à « où en es-tu ? » avant d'avoir vu de
   quoi on parle.

   Les deux ordres qui sortent du module :

     marqueQuete    la page range `periastre.quete`. Cette clé-là n'est LUE nulle
                    part dans le dépôt — c'est une écriture morte, reproduite
                    telle quelle, et signalée plutôt que supprimée.
     demandeNiveau  le délai, en millisecondes. La page garde son propre test
                    `dejaNiveau` au moment où le délai échoit ; c'est une
                    constante de la page, le module n'a pas à la connaître.   */
function finQuete(etat){
  etat.queteActive = false;
  etat.missionsActives = true;          // les missions prennent le relais
  etat.iMission = 0;
  return {
    enQuete: false,                     // enlever la classe du corps de page
    repeintMission: true,
    repeintQuete: true,
    marqueQuete: true,
    demandeNiveau: 1200,
  };
}

function lanceQuete(etat, e){
  etat.queteActive = true;
  etat.queteFinie = false;
  etat.iQuete = 0;
  etat.tRegard = 0;
  etat.queteVues.clear();
  etat.missionsActives = false;         // une seule consigne à l'écran à la fois
  return {
    /* On se réveille DOS à la baie. Sans ça, la première consigne — tourner la
       tête vers la vitre — se validait toute seule au bout de deux secondes,
       puisqu'on regardait déjà dans la bonne direction. Et l'ouverture y gagne :
       on découvre le trou noir en se retournant, au lieu de l'avoir sous le nez
       avant d'avoir compris où l'on est.

       La pose sort en ORDRE plutôt que d'être écrite dans `salon` et `joueur` :
       ces deux objets appartiennent à d'autres domaines, et c'est justement le
       genre d'écriture croisée qui a donné le disque à 622×. */
    pose: { lacet: Math.PI * 0.62, tangage: -0.04, p: [0.9, 0, 2.4], v: [0, 0, 0] },
    /* Le lever de rideau : quelques secondes de grave au réveil, puis plus rien.
       Uniquement si le son a été accepté — et il ne recouvre pas l'ambiance de
       qui l'a explicitement allumée. */
    ouverture: e.voixActive ? 38 : null,
    repeintMission: true,
    repeintQuete: true,
  };
}

global.PROGRESSION = {
  MIS_DE_COTE, CHAMPS, VERIFS, VERIFS_QUETE,
  missions, etatNeuf,
  sauve, charge, oublie,
  panneauMission, panneauQuete,
  veilleMission, veilleQuete, lanceQuete, finQuete,
};

})(window);
