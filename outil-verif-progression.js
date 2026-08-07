/* ============================================================================
   LA PROGRESSION — LES MISSIONS, LA QUÊTE ET LA MÉMOIRE, ÉPROUVÉES SANS PAGE

       node outil-verif-progression.js

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL EXISTE, ET POURQUOI IL EXISTE AVANT LE BRANCHEMENT

   `progression.js` est le seul domaine du site qui ÉCRIT dans la mémoire du
   navigateur. Le 7 août 2026, un réglage laissé dans cette mémoire par une
   séance de jugement a divisé par huit la cadence sur le téléphone d'Hugo, et
   personne ne l'a vu venir pour une raison simple : rien de ce qui touchait à
   cette mémoire n'était éprouvable hors navigateur.

   Le module est écrit mais pas encore branché dans la page. Cet outil est la
   condition du branchement : il joue les douze prédicats un champ à la fois, il
   fait l'aller-retour complet dans une fausse mémoire, et il déroule les deux
   parcours du début à la fin sans qu'un pixel soit dessiné.

   Il n'écrit rien : ni dans un vrai `localStorage`, ni sur le disque. La mémoire
   de test est un objet en variable, et la clé `periastre.v1` y vit dans un sac
   ordinaire — ce qui permet en prime de distinguer « clé enlevée » de « clé qui
   contient null », distinction qu'`oublie()` doit tenir.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ  (règle 3)

   Surtout pas de `progression.js` recopié en face de lui-même. Quatre sources,
   toutes extérieures au module :

   1. `index.html`, le code que ce module remplace. Ses `sauve()` / `charge()`
      (autour de la ligne 4808) donnent la liste EXACTE des clés rangées et des
      clés relues, et le fait que `spin` se range sans se relire. Le module doit
      rester interchangeable avec lui : c'est l'arbitre le plus dur qu'on ait.
   2. `contenu.js`, qui porte les missions et les étapes, leurs identifiants et
      leurs consignes. Les parcours se jouent sur la VRAIE liste, pas sur une
      liste inventée qui s'accorderait avec le module.
   3. La convention du repère du salon, relevée dans `index.html` (« Avant = −z,
      la baie est de ce côté ») et redérivée ici. Elle permet de vérifier que la
      pose du réveil tourne bien le DOS à la baie — ce que le module affirme en
      commentaire sans que personne n'ait jamais pu le mesurer.
   4. `registre.js`, l'autre module de ce dépôt qui écrit dans la même mémoire.
      Il refuse les NaN et les infinis À LA LECTURE. Deux modules qui écrivent
      dans la même mémoire ne peuvent pas avoir deux lois (règle 4).

   ---------------------------------------------------------------------------
   LA MÉTHODE DES PRÉDICATS

   Pour chaque prédicat : un faux `jeu` où RIEN n'est atteint, un seul champ
   poussé, puis les DOUZE prédicats évalués. La bonne mission doit basculer, et
   elle seule. Un prédicat qui se coche pour la mauvaise raison ne se voit
   autrement qu'en rejouant la partie à la main.

   Puis les BORNES, des deux côtés. « Lâcher cinquante sondes » doit être faux à
   quarante-neuf et vrai à cinquante. Un `>` écrit à la place d'un `>=` ne se
   voit jamais en jouant : il faudrait compter les sondes à l'écran.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le dernier groupe casse le module en mémoire — cinq sabotages, les uns par
   enveloppe, les autres sur une copie EN MÉMOIRE du source, jamais sur le
   fichier — et exige que le contrôle correspondant TOMBE. Un sabotage qui ne
   fait tomber que des contrôles déjà rouges ne compte pas : on compare à un
   relevé de référence pris sur le module intact.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS

   Rien de ce que la page PEINT. Le module rend des descripteurs et des ordres ;
   qu'une pastille s'allume, qu'une classe tombe, qu'une bulle se lise — cela se
   juge à l'œil, dans `?juge`. Ce qui est mesuré ici, c'est la décision.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN = path.join(ICI, "progression.js");

console.log("\n  LA PROGRESSION — MISSIONS, QUÊTE, MÉMOIRE");
console.log("  ═════════════════════════════════════════");

/* Quand `carnet` n'est pas nul, `ok()` range au lieu d'imprimer : c'est ce qui
   permet de rejouer les mêmes contrôles sur un module saboté sans salir la
   sortie, et sans écrire une seconde fois les assertions — ce qui reviendrait à
   saboter aussi le contrôle du sabotage. */
let n = 0, echecs = 0, carnet = null;
const groupe = t => { if(!carnet) console.log("\n  " + t + "\n  " + "─".repeat(t.length)); };
function ok(nom, vrai, attendu, mesure, note){
  if(carnet){ carnet.push({ nom, vrai: !!vrai }); return; }
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
// Ce que l'outil a vu et n'a pas transformé en verdict. Ça se dit, ça ne se cache pas.
const observations = [];
function vu(t){ if(!carnet){ observations.push(t); console.log("  ·   " + t); } }
function stop(titre, lignes){
  console.log("\n  ❌  " + titre);
  console.log("  " + "─".repeat(titre.length + 4));
  for(const l of lignes) console.log("      " + l);
  console.log("");
  process.exit(1);
}

/* ══════════════════════════════════════════ 0. LE MODULE EST-IL LÀ, ET PROPRE ?

   S'il manque, on ne rend PAS un zéro échec : un outil qui n'a rien mesuré et
   qui sort en code 0 endort exactement comme un contrôle qui ne peut pas
   échouer. `node tout.js` afficherait un filet complet sur un trou. */
if(!fs.existsSync(CHEMIN))
  stop("progression.js n'existe pas — RIEN N'A ÉTÉ MESURÉ", [
    "Cet outil est la condition du branchement du module dans la page.",
    "Tant que le fichier manque, il refuse de conclure.",
  ]);

const SRC = fs.readFileSync(CHEMIN, "utf8");

/* Le module ne doit toucher NI au DOM, NI à `localStorage` : c'est ce qui le
   rend vérifiable, et c'est aussi ce qui garantit que la mémoire lui arrive au
   lieu qu'il se serve. On ne le lui demande pas gentiment — on empoisonne les
   noms. Toute lecture d'une propriété de `document` ou de `localStorage` lève,
   au chargement comme à l'usage, et le contrôle qui l'a déclenchée tombe. */
const NOMS_INTERDITS = ["document", "localStorage", "sessionStorage", "navigator",
                        "location", "alert", "fetch", "XMLHttpRequest",
                        "requestAnimationFrame", "setTimeout", "setInterval"];
function poison(nom){
  const boum = cle => { throw new Error("le module a touché `" + nom
                                        + (cle ? "." + String(cle) : "()") + "`"); };
  return new Proxy(function(){}, { get: (_, cle) => boum(cle), apply: () => boum(null) });
}
function chargeModule(src){
  const bac = {};
  new Function("window", "global", "globalThis", "self", ...NOMS_INTERDITS, src)
    (bac, bac, bac, bac, ...NOMS_INTERDITS.map(poison));
  return bac.PROGRESSION || null;
}

let P;
try { P = chargeModule(SRC); }
catch(err){
  stop("progression.js ne se charge pas hors navigateur — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "",
    "Le module doit pouvoir s'évaluer sans DOM et sans `localStorage`. C'est ce",
    "qui rend tous les autres modules du dépôt vérifiables en ligne de commande.",
  ]);
}
if(!P) stop("progression.js s'est chargé mais n'expose pas `PROGRESSION`", [
  "attendu   global.PROGRESSION = { … }",
]);

// La vérité d'ailleurs nº2 : le contenu réel, celui que la page donnera au module.
const chargeFichier = f => {
  const w = {};
  new Function("window", fs.readFileSync(path.join(ICI, f), "utf8"))(w);
  return w;
};
const CONTENU = chargeFichier("contenu.js").CONTENU;
if(!CONTENU || !Array.isArray(CONTENU.missions) || !Array.isArray(CONTENU.accueilQuete))
  stop("contenu.js ne rend pas les missions et la quête — RIEN N'A ÉTÉ MESURÉ", [
    "Les parcours se jouent sur la VRAIE liste. Une liste inventée s'accorderait",
    "avec le module au lieu de l'arbitrer.",
  ]);
const MISSIONS_TOUTES = CONTENU.missions;
const QUETE = CONTENU.accueilQuete;

/* ─────────────────────────────────────────────── LE FAUX MONDE

   `jeuNeuf()` : un monde où RIEN n'est atteint. Chacun de ses champs est
   volontairement à côté de son seuil, jamais dessus — sinon « pousser un seul
   champ » ne voudrait rien dire.                                             */

// Le repère du salon, redérivé depuis sa convention (index.html : « Avant = −z,
// la baie est de ce côté ») et non depuis le module. Lacet nul = face à la baie.
function repere(lacet, tangage){
  const cl = Math.cos(lacet), sl = Math.sin(lacet);
  const ct = Math.cos(tangage), st = Math.sin(tangage);
  const av = [ct * sl, st, -ct * cl];
  const dr = [cl, 0, sl];
  const ht = [dr[1]*av[2] - dr[2]*av[1], dr[2]*av[0] - dr[0]*av[2], dr[0]*av[1] - dr[1]*av[0]];
  return { av, dr, ht };
}
const sondeSimple = () => ({ sort: "chute", gel: false, age: 0 });

function jeuNeuf(){
  const j = {
    compte: { chute: 0, essaisPres: 0 },
    sondes: [],
    photons: [],
    TEMPS: { cran: 3 },              // le temps est accéléré, pas au cran réel
    horloge: { mere: 0, bord: 0 },
    reelCible: 0,
    sondeSuivie: null,
    salon: { facteur: 240 },
    questionsOuvertes: false,
    repere: repere(Math.PI, 0),      // dos à la baie
  };
  j.regardSalon = () => j.repere;
  return j;
}

/* La poussée d'un seul champ, par mission. Elles sont ADDITIVES : la même table
   sert à l'isolement (sur un monde neuf) et à l'enchaînement complet (sur un
   monde qui se remplit), donc rien ne peut diverger entre les deux. */
const POUSSEE = {
  "m-chute":   j => { j.compte.chute = 1; },
  "m-orbite":  j => { j.sondes.push({ sort: "orbite", gel: false, age: 5 }); },
  "m-pluie":   j => { while(j.sondes.length < 50) j.sondes.push(sondeSimple()); },
  "m-limite":  j => { j.compte.essaisPres = 1; },
  "m-photon":  j => { j.photons.push({}); j.TEMPS.cran = 0; },
  "m-reel":    j => { j.reelCible = 1; },
  "m-bord":    j => { j.sondeSuivie = 0; },
  "m-jumeaux": j => { j.horloge.mere = 2000; },
};
const POUSSEE_QUETE = {
  "a-baie":      j => { j.repere = repere(0, 0); },        // pile en face de la vitre
  "a-lumen":     (j, etat) => { etat.queteVues.add("lumen"); },
  "a-temps":     j => { j.salon.facteur = 1; },
  "a-telescope": (j, etat) => { etat.queteVues.add("telescope"); },
};

/* ─────────────────────────────────────────────── LA FAUSSE MÉMOIRE

   Un sac ordinaire, une clé, du texte dedans. C'est exactement la forme d'un
   `localStorage` — et c'est la seule façon de distinguer « la clé a été
   enlevée » de « la clé contient null », distinction qu'`oublie()` doit tenir
   et qu'un simple `contenu = null` ne saurait pas éprouver.

   Le JSON est fait ICI, comme l'adaptateur de la page le fera : ce qui traverse
   est donc ce qui traverserait vraiment, `Set` compris — c'est-à-dire pas
   compris, si le module ne s'en occupe pas.                                  */
const CLE = "periastre.v1";          // relevée dans index.html
function fausseMemoire(texte){
  const sac = Object.create(null);
  if(texte !== undefined) sac[CLE] = texte;
  const m = {
    lectures: 0, ecritures: 0, effacements: 0,
    refuseLecture: false, refuseEcriture: false,
    lit(){
      m.lectures++;
      if(m.refuseLecture) throw new Error("SecurityError: accès refusé");
      const t = sac[CLE];
      if(t === undefined) return null;
      try { return JSON.parse(t); } catch(_){ return null; }
    },
    ecrit(o){
      m.ecritures++;
      if(m.refuseEcriture) throw new Error("QuotaExceededError");
      sac[CLE] = JSON.stringify(o);
    },
    efface(){ m.effacements++; delete sac[CLE]; },
    get texte(){ return sac[CLE]; },
    get objet(){ return sac[CLE] === undefined ? undefined : JSON.parse(sac[CLE]); },
    get presente(){ return CLE in sac; },
    get cles(){ return Object.keys(sac); },
  };
  return m;
}
// L'adaptateur de la navigation privée, tel que l'en-tête du module le décrit :
// c'est LUI qui porte les try/catch, et il rend la main sans rien dire.
function memoireMuette(){
  const m = { lectures: 0, ecritures: 0, effacements: 0,
    lit(){ m.lectures++; try { throw new Error("privé"); } catch(_){ return null; } },
    ecrit(){ m.ecritures++; try { throw new Error("privé"); } catch(_){ } },
    efface(){ m.effacements++; try { throw new Error("privé"); } catch(_){ } } };
  return m;
}

/* ─────────────────────────────────────── LES RÉGLAGES, ET CE QU'ILS DEVIENNENT

   Relevé dans `index.html` — le `sauve()` et le `charge()` que ce module
   remplace — et NON dans `progression.js`. C'est la vérité d'ailleurs : si le
   module range une clé de plus, en oublie une, ou en relit une qui ne devait
   plus l'être, l'écart se voit ici et nulle part ailleurs.                   */
const RANGE_ATTENDU = ["niveau", "acquis", "voix", "anecdotes", "taille", "volume",
                       "spin", "musique", "boutons", "mascotte", "deja"];
const RELU_ATTENDU = {                 // clé rangée → nom vivant dans la page
  niveau: "iNiveau", voix: "voixActive", anecdotes: "intervalleAnecdote",
  taille: "zoomSonde", volume: "volumeVoix", musique: "volumeMusique",
  boutons: "modeBoutons", mascotte: "mascotte",
};
// `spin` se range et ne se relit PLUS : 13,8 ms l'image contre 1,6 (index.html).

// Deux jeux de réglages, aux booléens inversés : deux allers-retours suffisent
// alors à prendre n'importe quel échange de deux champs, y compris entre
// booléens, que des valeurs numériques distinctes ne sauraient pas voir.
const REGLAGES = { iNiveau: 2, voixActive: true, intervalleAnecdote: 45000,
                   zoomSonde: 1.4, volumeVoix: 0.7, spin: 0.35,
                   volumeMusique: 0.25, modeBoutons: false, mascotte: true };
const REGLAGES_BIS = { iNiveau: 0, voixActive: false, intervalleAnecdote: 12000,
                       zoomSonde: 0.6, volumeVoix: 0.1, spin: -0.9,
                       volumeMusique: 0.9, modeBoutons: true, mascotte: false };

const memeEnsemble = (a, b) => a.length === b.length
  && [...a].sort().join("|") === [...b].sort().join("|");
const IMG = 16;                       // une image, à la cadence que le module suppose

// Le tableau des seuils, rempli par le groupe des bornes et imprimé à la fin :
// c'est ce qu'on relit avant de brancher.
const RECAP = [];

/* ════════════════════════════════════════════════════════ 1. LE CONTRAT EST-IL LÀ ? */
function controleContrat(P){
  const ATTENDU = {
    MIS_DE_COTE: "object", CHAMPS: "object", VERIFS: "object", VERIFS_QUETE: "object",
    missions: "function", etatNeuf: "function", sauve: "function", charge: "function",
    oublie: "function", panneauMission: "function", panneauQuete: "function",
    veilleMission: "function", veilleQuete: "function", lanceQuete: "function",
    finQuete: "function",
  };
  const manque = Object.keys(ATTENDU).filter(k => typeof P[k] !== ATTENDU[k]);
  ok("les quinze noms du contrat sont là, du bon genre", manque.length === 0,
     "15 noms", manque.length ? "manquent ou faux : " + manque.join(", ") : "15",
     "la liste vient de l'en-tête du module, pas de son code");

  const etat = P.etatNeuf();
  const CHAMPS_ETAT = ["iMission", "missionFinie", "tMission", "missionsActives", "acquis",
                       "iQuete", "queteActive", "queteFinie", "tQuete", "tRegard", "queteVues"];
  ok("`etatNeuf()` rend les onze champs annoncés",
     memeEnsemble(Object.keys(etat), CHAMPS_ETAT), CHAMPS_ETAT.length + " champs",
     Object.keys(etat).length + " : " + Object.keys(etat).join(", "));
  ok("et il est vraiment NEUF",
     etat.iMission === 0 && etat.missionFinie === false && etat.missionsActives === true
     && etat.acquis instanceof Set && etat.acquis.size === 0
     && etat.iQuete === 0 && etat.queteActive === false && etat.queteFinie === false
     && etat.tRegard === 0 && etat.queteVues instanceof Set && etat.queteVues.size === 0,
     "tout à zéro, deux Set vides", JSON.stringify({ iMission: etat.iMission,
       acquis: etat.acquis.size, iQuete: etat.iQuete, tRegard: etat.tRegard }));
  const a = P.etatNeuf(), b = P.etatNeuf();
  a.acquis.add("m-chute"); a.iMission = 4;
  ok("deux états ne se partagent rien",
     b.acquis.size === 0 && b.iMission === 0 && a.acquis !== b.acquis,
     "indépendants", b.acquis.size + " acquis, iMission " + b.iMission,
     "le module n'a aucune variable vivante : deux parties peuvent tourner côte "
     + "à côte, et un contrôle repart d'un état propre sans rien réinitialiser");

  // Aucune mission sans prédicat, aucun prédicat orphelin — dans les deux sens.
  const idsM = MISSIONS_TOUTES.map(m => m.id), idsV = Object.keys(P.VERIFS);
  ok("chaque mission de `contenu.js` a son prédicat, et réciproquement",
     memeEnsemble(idsM, idsV), idsM.length + " missions",
     memeEnsemble(idsM, idsV) ? idsV.length + " prédicats, mêmes identifiants"
       : "missions " + idsM.join(",") + " / prédicats " + idsV.join(","),
     "un prédicat orphelin ne se coche jamais ; une mission sans prédicat bloque "
     + "le parcours pour toujours, et personne ne saurait dire pourquoi");
  const idsQ = QUETE.map(q => q.id), idsVQ = Object.keys(P.VERIFS_QUETE);
  ok("chaque étape de la quête a son prédicat, et réciproquement",
     memeEnsemble(idsQ, idsVQ), idsQ.length + " étapes",
     memeEnsemble(idsQ, idsVQ) ? idsVQ.length + " prédicats, mêmes identifiants"
       : "étapes " + idsQ.join(",") + " / prédicats " + idsVQ.join(","));

  // Le filtre de la bêta, dans les deux sens.
  const jouables = P.missions(MISSIONS_TOUTES);
  ok("`missions()` écarte les deux mises de côté",
     jouables.length === MISSIONS_TOUTES.length - P.MIS_DE_COTE.length
     && jouables.every(m => !P.MIS_DE_COTE.includes(m.id)),
     MISSIONS_TOUTES.length - P.MIS_DE_COTE.length + " jouables",
     jouables.length + " : " + jouables.map(m => m.id).join(", "));
  ok("et rend la liste ENTIÈRE si on le lui demande",
     P.missions(MISSIONS_TOUTES, []).length === MISSIONS_TOUTES.length,
     MISSIONS_TOUTES.length, P.missions(MISSIONS_TOUTES, []).length,
     "sans cet argument, les deux prédicats mis de côté ne seraient éprouvables "
     + "par aucun chemin — c'est écrit dans le module, et c'est vrai");
  ok("une liste absente ne fait pas lever", P.missions().length === 0
     && P.missions(null, []).length === 0, "0", P.missions().length);
}

/* ══════════════════════════════════ 2. LES PRÉDICATS, UN SEUL CHAMP À LA FOIS */
function tousLesPredicats(P, jeu, etat){
  const vrais = [];
  for(const [id, v] of Object.entries(P.VERIFS)) if(v(jeu, etat)) vrais.push(id);
  for(const [id, v] of Object.entries(P.VERIFS_QUETE)) if(v(jeu, etat)) vrais.push(id);
  return vrais;
}

function controlePredicatsIsoles(P){
  {
    const vrais = tousLesPredicats(P, jeuNeuf(), P.etatNeuf());
    ok("sur un monde où rien n'est atteint, aucun des douze ne se coche",
       vrais.length === 0, "aucun", vrais.length ? vrais.join(", ") : "aucun",
       "sans ce point de départ, « une seule bascule » ne voudrait rien dire : "
       + "il suffirait que tout soit vrai depuis le début");
  }
  const tous = Object.keys(P.VERIFS).concat(Object.keys(P.VERIFS_QUETE));
  for(const id of tous){
    const jeu = jeuNeuf(), etat = P.etatNeuf();
    (POUSSEE[id] || POUSSEE_QUETE[id])(jeu, etat);
    const vrais = tousLesPredicats(P, jeu, etat);
    ok("« " + id + " » bascule seule quand on pousse son champ",
       vrais.length === 1 && vrais[0] === id, "[" + id + "]",
       "[" + vrais.join(", ") + "]",
       vrais.length > 1 ? "elle en entraîne d'autres : une mission se cocherait "
                          + "sans qu'on ait fait ce qu'elle demande" : undefined);
  }
  // Les conjonctions : deux prédicats exigent DEUX choses, et le vérifient.
  {
    const j1 = jeuNeuf(); j1.photons.push({});                     // le photon seul
    const j2 = jeuNeuf(); j2.TEMPS.cran = 0;                       // le temps réel seul
    ok("« m-photon » demande le photon ET le temps réel, pas l'un des deux",
       !P.VERIFS["m-photon"](j1, P.etatNeuf()) && !P.VERIFS["m-photon"](j2, P.etatNeuf()),
       "faux dans les deux cas à moitié",
       (P.VERIFS["m-photon"](j1, P.etatNeuf()) ? "le photon seul suffit" : "")
       + (P.VERIFS["m-photon"](j2, P.etatNeuf()) ? " le cran seul suffit" : "") || "faux, faux");
    const j3 = jeuNeuf(); j3.TEMPS.cran = "0";
    ok("et le cran du temps se compare sans conversion",
       !P.VERIFS["m-photon"](Object.assign(j3, { photons: [{}] }), P.etatNeuf()),
       "faux pour la chaîne « 0 »", "vrai — le prédicat convertit");
    const e4 = P.etatNeuf(); e4.queteVues.add("lumen");
    const j4 = jeuNeuf(); j4.questionsOuvertes = true;
    ok("« a-lumen » attend que les questions soient REFERMÉES",
       !P.VERIFS_QUETE["a-lumen"](j4, e4), "faux tant qu'elles sont ouvertes", "vrai",
       "sans ça, la récompense écrase la bulle : les six questions apparaissent "
       + "une fraction de seconde puis disparaissent");
  }
  // Les deux disqualifications de « m-orbite », qui n'ont pas de borne numérique.
  {
    const gel = jeuNeuf(); gel.sondes.push({ sort: "orbite", gel: true, age: 5 });
    const chute = jeuNeuf(); chute.sondes.push({ sort: "chute", gel: false, age: 5 });
    ok("« m-orbite » refuse une sonde gelée", !P.VERIFS["m-orbite"](gel, P.etatNeuf()),
       "faux", "vrai");
    ok("« m-orbite » refuse une sonde qui n'est pas en orbite",
       !P.VERIFS["m-orbite"](chute, P.etatNeuf()), "faux", "vrai");
  }
}

/* ══════════════════════════════════════════════ 3. LES BORNES, DES DEUX CÔTÉS

   C'est le contrôle le plus utile du fichier. Les seuils sont écrits ici en
   clair, tirés de l'en-tête du module (« lâcher cinquante sondes »), de
   `contenu.js` (« une demi-heure d'écart ») ou d'un calcul (le demi-angle du
   cône de la baie vaut arccos 0,80). Si quelqu'un déplace un seuil dans le
   code, l'outil tombe et l'on en parle — c'est le but.                       */
const BORNES = [
  { id: "m-chute", grandeur: "sondes tombées", seuil: "> 0",
    sous: { nom: "aucune chute", f: j => { j.compte.chute = 0; } },
    sur:  { nom: "une chute", f: j => { j.compte.chute = 1; } },
    note: "le compteur est entier : la seule borne qui existe est zéro / un" },

  { id: "m-orbite", grandeur: "l'âge de la sonde en orbite", seuil: "> 4",
    sous: { nom: "âge 4 tout rond", f: j => { j.sondes.push({ sort:"orbite", gel:false, age:4 }); } },
    sur:  { nom: "âge 4,0001", f: j => { j.sondes.push({ sort:"orbite", gel:false, age:4.0001 }); } },
    note: "seuil STRICT : à 4 pile, la mission ne se coche pas. Le but est qu'une "
        + "orbite se soit vue tourner, pas qu'elle ait été déclarée" },

  { id: "m-pluie", grandeur: "le nombre de sondes lâchées", seuil: ">= 50",
    sous: { nom: "49 sondes", f: j => { while(j.sondes.length < 49) j.sondes.push(sondeSimple()); } },
    sur:  { nom: "50 sondes", f: j => { while(j.sondes.length < 50) j.sondes.push(sondeSimple()); } },
    note: "la consigne de `contenu.js` en promet QUATRE-VINGTS — voir les "
        + "observations en bas de cette sortie" },

  { id: "m-limite", grandeur: "les essais au plus près", seuil: ">= 1",
    sous: { nom: "aucun essai", f: j => { j.compte.essaisPres = 0; } },
    sur:  { nom: "un essai", f: j => { j.compte.essaisPres = 1; } },
    note: "un seul essai suffit : la mission demande d'ESSAYER, pas de réussir — "
        + "et c'est exprès, puisqu'elle est impossible" },

  { id: "m-reel", grandeur: "la cible du rendu réel", seuil: "> 0,5",
    sous: { nom: "0,5 tout rond", f: j => { j.reelCible = 0.5; } },
    sur:  { nom: "0,5 + 10⁻⁹", f: j => { j.reelCible = 0.5 + 1e-9; } },
    note: "c'est une cible de fondu : à mi-chemin exactement, la lumière réelle "
        + "n'est pas encore établie" },

  { id: "m-bord", grandeur: "l'indice de la sonde suivie", seuil: "!== null",
    sous: { nom: "aucune sonde suivie", f: j => { j.sondeSuivie = null; } },
    sur:  { nom: "la sonde nº 0", f: j => { j.sondeSuivie = 0; } },
    note: "l'indice ZÉRO compte : un `if(sondeSuivie)` aurait perdu la première "
        + "sonde de la liste, et personne n'aurait su pourquoi" },

  { id: "m-jumeaux", grandeur: "l'écart des deux horloges", seuil: "> 1800 s",
    sous: { nom: "1800 s tout rond", f: j => { j.horloge.mere = 1800; j.horloge.bord = 0; } },
    sur:  { nom: "1800,001 s", f: j => { j.horloge.mere = 1800.001; j.horloge.bord = 0; } },
    note: "1800 s = une demi-heure, ce que la récompense annonce dans `contenu.js` "
        + "(« Une demi-heure d'écart »). Seuil strict" },

  { id: "a-baie", grandeur: "le cosinus du regard vers la baie", seuil: "> 0,80",
    sous: { nom: "36,88° d'écart", f: j => { j.repere = repere(Math.acos(0.80) + 1e-6, 0); } },
    sur:  { nom: "36,86° d'écart", f: j => { j.repere = repere(Math.acos(0.80) - 1e-6, 0); } },
    note: "le cône vaut arccos 0,80 = 0,6435 rad, soit 36,87° de demi-angle — "
        + "calculé ici, pas recopié du module" },
];

function controleBornes(P){
  for(const b of BORNES){
    const v = P.VERIFS[b.id] || P.VERIFS_QUETE[b.id];
    const sous = jeuNeuf(), sur = jeuNeuf();
    b.sous.f(sous); b.sur.f(sur);
    const rSous = !!v(sous, P.etatNeuf()), rSur = !!v(sur, P.etatNeuf());
    ok("« " + b.id + " » — " + b.grandeur + " " + b.seuil,
       rSous === false && rSur === true,
       "faux à « " + b.sous.nom + " », vrai à « " + b.sur.nom + " »",
       (rSous ? "VRAI" : "faux") + " / " + (rSur ? "vrai" : "FAUX"),
       b.note);
    if(!carnet) RECAP.push({ id: b.id, grandeur: b.grandeur, seuil: b.seuil,
                             sous: b.sous.nom, sur: b.sur.nom,
                             vert: rSous === false && rSur === true });
  }

  /* Les deux seuils de TEMPS ne vivent pas dans un prédicat mais dans les
     machines. Ils se mesurent donc en appelant la veille de part et d'autre. */
  {
    // Le regard tenu : `tRegard += 16` par image, seuil 1800 → 113 images.
    const liste = QUETE;
    const joue = images => {
      const etat = P.etatNeuf(), jeu = jeuNeuf();
      P.lanceQuete(etat, { voixActive: false });
      jeu.repere = repere(0, 0);                    // pile en face, sans jamais lâcher
      let dernier = null;
      for(let i = 0; i < images; i++) dernier = P.veilleQuete(etat, { quete: liste, jeu }, (i+1) * IMG);
      return { dernier, etat };
    };
    const a = joue(112), b = joue(113);
    ok("« a-baie » — le regard doit être TENU 113 images (1808 ms comptées)",
       a.dernier === null && !a.etat.queteFinie && b.dernier !== null && b.etat.queteFinie,
       "rien à 112 images, validé à 113",
       (a.dernier ? "validé à 112" : "rien à 112") + " / "
       + (b.dernier ? "validé à 113" : "RIEN à 113"),
       "le module compte des IMAGES déguisées en millisecondes (16 par appel) : "
       + "à 60 Hz cela fait 1,8 s, à 120 Hz 0,9 s. C'est le point 2 de l'en-tête, "
       + "reproduit tel quel — le seuil éprouvé ici est donc un seuil d'images");
    if(!carnet) RECAP.push({ id: "a-baie (tenue)", grandeur: "images de regard tenu",
                             seuil: ">= 1800 par pas de 16", sous: "112 images",
                             sur: "113 images",
                             vert: a.dernier === null && b.dernier !== null });

    // Et il faut le TENIR : une image de rupture remet le compteur à zéro.
    const etat = P.etatNeuf(), jeu = jeuNeuf();
    P.lanceQuete(etat, { voixActive: false });
    jeu.repere = repere(0, 0);
    let t = 0, o = null;
    for(let i = 0; i < 112; i++) o = P.veilleQuete(etat, { quete: liste, jeu }, t += IMG);
    jeu.repere = repere(Math.PI, 0);                            // on détourne les yeux
    o = P.veilleQuete(etat, { quete: liste, jeu }, t += IMG);
    jeu.repere = repere(0, 0);
    for(let i = 0; i < 112; i++) o = P.veilleQuete(etat, { quete: liste, jeu }, t += IMG);
    ok("« a-baie » — une image de rupture remet le compteur à zéro",
       o === null && !etat.queteFinie, "rien après 112 + rupture + 112",
       o ? "validé quand même" : "rien",
       "sinon un balayage rapide validerait sans qu'on ait rien regardé — c'est "
       + "la raison d'être du seuil, écrite dans le module");
  }
  {
    // Le temps de lire la chute : 4200 ms, seuil STRICT.
    const prepare = () => {
      const etat = P.etatNeuf(), jeu = jeuNeuf(), e = { missions: MISSIONS_TOUTES, jeu };
      POUSSEE["m-chute"](jeu);
      P.veilleMission(etat, e, 1000);                 // valide, et arme la fenêtre
      return { etat, e };
    };
    const a = prepare(), b = prepare();
    const oa = P.veilleMission(a.etat, a.e, 1000 + 4200);
    const ob = P.veilleMission(b.etat, b.e, 1000 + 4201);
    ok("la fenêtre de félicitations dure 4200 ms, seuil strict",
       oa === null && a.etat.iMission === 0
       && ob !== null && ob.avance === true && b.etat.iMission === 1,
       "rien à +4200, on avance à +4201",
       (oa ? "avancé à +4200" : "rien à +4200") + " / "
       + (ob ? "avancé à +4201" : "RIEN à +4201"),
       "c'est le temps de lire la chute. Trop court, la récompense est mangée ; "
       + "trop long, la consigne suivante n'arrive plus");
    if(!carnet) RECAP.push({ id: "LECTURE", grandeur: "la fenêtre de félicitations",
                             seuil: "> 4200 ms", sous: "+4200 ms", sur: "+4201 ms",
                             vert: oa === null && ob !== null });
  }
}

/* ═══════════════════════ 4. LES PRÉDICATS NE VONT RIEN CHERCHER TOUT SEULS

   C'est la première exigence de l'en-tête, et elle n'est mesurable que d'ici :
   dans la page, chaque prédicat lisait un global d'un autre domaine. On les
   emballe donc dans des espions et l'on regarde ce qu'ils touchent.          */
const CONTRAT_JEU = ["compte", "sondes", "photons", "TEMPS", "horloge", "reelCible",
                     "sondeSuivie", "salon", "regardSalon", "questionsOuvertes"];
function controleLectures(P){
  const luJeu = new Set(), luEtat = new Set(), muets = [], etatParMission = new Map();
  const tous = Object.entries(P.VERIFS).concat(Object.entries(P.VERIFS_QUETE));
  for(const [id, v] of tous){
    const jeu = jeuNeuf(), etat = P.etatNeuf();
    (POUSSEE[id] || POUSSEE_QUETE[id])(jeu, etat);           // satisfait : il lit tout
    const vues = new Set(), vuesE = new Set();
    const pj = new Proxy(jeu, { get(c, k){ if(typeof k === "string") vues.add(k); return c[k]; } });
    const pe = new Proxy(etat, { get(c, k){ if(typeof k === "string") vuesE.add(k); return c[k]; } });
    if(!v(pj, pe)) muets.push(id + " (ne se coche plus)");
    /* Au moins UNE lecture, du monde ou de la progression : « a-telescope »
       n'interroge légitimement que `etat.queteVues`, et ce n'est pas un défaut —
       ce qu'on traque, c'est le prédicat qui ne regarde rien du tout. */
    if(vues.size === 0 && vuesE.size === 0) muets.push(id + " (ne lit rien)");
    vues.forEach(k => luJeu.add(k));
    vuesE.forEach(k => luEtat.add(k));
    if(P.VERIFS[id]) etatParMission.set(id, [...vuesE]);
  }
  ok("chaque prédicat lit au moins un champ du monde", muets.length === 0,
     "aucun prédicat muet", muets.length ? muets.join(", ") : "aucun",
     "un prédicat qui ne lit rien est une constante déguisée : il se coche "
     + "toujours, ou jamais, et le parcours ne bouge plus");
  const hors = [...luJeu].filter(k => !CONTRAT_JEU.includes(k));
  ok("ils ne lisent rien hors du contrat de `e.jeu`", hors.length === 0,
     "aucune clé hors des dix annoncées", hors.length ? hors.join(", ") : "aucune",
     "une lecture hors contrat est une dépendance cachée : elle casse le jour où "
     + "l'appelant change, sans que personne ne l'ait touchée");
  const inutiles = CONTRAT_JEU.filter(k => !luJeu.has(k));
  ok("et le contrat ne promet rien d'inutile", inutiles.length === 0,
     "les dix clés servent", inutiles.length ? "jamais lues : " + inutiles.join(", ") : "les dix",
     "un champ promis et jamais lu, c'est du travail que la page ferait pour rien "
     + "à chaque image");
  const fautives = [...etatParMission].filter(([, k]) => k.length > 0);
  ok("aucune mission ne lit la progression", fautives.length === 0,
     "les missions ne regardent que le monde",
     fautives.length ? fautives.map(([id, k]) => id + " lit " + k.join(",")).join(" ; ") : "aucune",
     "la signature est `(jeu, etat)` : le monde d'abord. Une mission qui lirait "
     + "sa propre progression pourrait se valider d'avoir été validée");
  ok("et la quête ne lit de la progression que `queteVues`",
     memeEnsemble([...luEtat], ["queteVues"]), "[queteVues]", "[" + [...luEtat].join(", ") + "]",
     "les deux étapes de poste ont besoin de ce qui appartient à ce domaine-ci, "
     + "et de rien d'autre");
}

/* ══════════════════════════════════════════ 5. LA MÉMOIRE — L'ALLER-RETOUR */
function controleAllerRetour(P){
  for(const [nom, reglages] of [["premier jeu", REGLAGES], ["booléens inversés", REGLAGES_BIS]]){
    const mem = fausseMemoire();
    const etat = P.etatNeuf();
    ["m-chute", "m-pluie", "m-reel"].forEach(id => etat.acquis.add(id));
    etat.queteVues.add("lumen");
    const ecrit = P.sauve({ memoire: mem, reglages, etat });

    ok(nom + " — `sauve` rend l'objet réellement écrit",
       ecrit && typeof ecrit === "object" && mem.ecritures === 1,
       "un objet, une écriture", (ecrit ? typeof ecrit : "rien") + ", " + mem.ecritures + " écriture(s)",
       "un `return` muet ne se distinguerait pas d'une écriture vide, et "
       + "l'appelant n'aurait aucune prise dessus");
    ok(nom + " — les clés rangées sont EXACTEMENT celles d'index.html",
       memeEnsemble(Object.keys(mem.objet || {}), RANGE_ATTENDU),
       "[" + RANGE_ATTENDU.join(", ") + "]",
       "[" + Object.keys(mem.objet || {}).join(", ") + "]",
       "la liste vient du `sauve()` de la page, pas du module : c'est elle qui "
       + "décide si le remplacement est interchangeable");

    // Le relecteur repart d'un état NEUF : rien de l'écriture ne peut lui rester.
    const relu = P.etatNeuf();
    const r = P.charge({ memoire: mem, etat: relu });
    ok(nom + " — les réglages relus sont exactement ceux qu'index.html relisait",
       r && memeEnsemble(Object.keys(r.reglages), Object.values(RELU_ATTENDU)),
       "[" + Object.values(RELU_ATTENDU).join(", ") + "]",
       r ? "[" + Object.keys(r.reglages).join(", ") + "]" : "charge a rendu null");
    const faux = r ? Object.keys(r.reglages).filter(k => r.reglages[k] !== reglages[k]) : ["tout"];
    ok(nom + " — et chaque valeur revient à l'identique", faux.length === 0,
       "huit valeurs intactes",
       faux.length ? faux.map(k => k + " : " + JSON.stringify(reglages[k]) + " → "
                                 + JSON.stringify(r.reglages[k])).join(" ; ") : "huit",
       "deux allers-retours aux booléens inversés : un échange entre deux champs "
       + "de même type ne peut pas passer les deux");
    ok(nom + " — `spin` se range et ne se relit JAMAIS",
       mem.objet.spin === reglages.spin && !("spin" in r.reglages),
       "rangé, absent des réglages",
       "rangé " + JSON.stringify(mem.objet.spin) + ", relu " + ("spin" in r.reglages),
       "13,8 ms l'image contre 1,6. L'exception est une donnée du module et non "
       + "un commentaire, justement pour qu'un contrôle puisse l'exiger");

    // LE PIÈGE CLASSIQUE : un `Set` ne se sérialise pas tout seul.
    ok(nom + " — les missions acquises traversent le JSON",
       relu.acquis instanceof Set && memeEnsemble([...relu.acquis], ["m-chute", "m-pluie", "m-reel"]),
       "un Set de trois identifiants",
       (relu.acquis instanceof Set ? "Set " : typeof relu.acquis + " ")
       + JSON.stringify([...(relu.acquis || [])]),
       "`JSON.stringify(new Set)` rend `{}` : sans le passage explicite par un "
       + "tableau, toute la progression disparaît au premier rechargement, et "
       + "personne ne s'en aperçoit avant d'avoir tout refait");
    ok(nom + " — et le Set relu est un objet NEUF",
       relu.acquis !== etat.acquis, "un autre Set", "le même objet",
       "deux écrivains pour une valeur est la maladie que ce dépôt nomme en premier");
    ok(nom + " — `deja` marque le passage", mem.objet.deja === true && r.brut.deja === true,
       "true", JSON.stringify(mem.objet.deja),
       "c'est ce que la page lit pour savoir si c'est un premier passage");
  }

  // Ce qui ne traverse PAS, et qui doit être dit.
  {
    const mem = fausseMemoire(), etat = P.etatNeuf();
    etat.queteVues.add("lumen"); etat.queteVues.add("telescope");
    etat.iMission = 5; etat.iQuete = 2;
    P.sauve({ memoire: mem, reglages: REGLAGES, etat });
    ok("`queteVues`, `iMission` et `iQuete` ne sont PAS rangés",
       !("queteVues" in mem.objet) && !("iMission" in mem.objet) && !("iQuete" in mem.objet),
       "absents de la mémoire",
       Object.keys(mem.objet).filter(k => ["queteVues","iMission","iQuete"].includes(k)).join(",")
       || "absents",
       "c'est le comportement d'index.html, et il se tient : la quête se rejoue "
       + "en entier ou pas du tout. Mais la page devra retrouver `iMission` "
       + "depuis `acquis` à la reprise, sinon la première mission se refait");
  }
  // Un réglage absent ne s'invente pas.
  {
    const mem = fausseMemoire(), etat = P.etatNeuf();
    P.sauve({ memoire: mem, reglages: {}, etat });
    const relu = P.etatNeuf();
    const r = P.charge({ memoire: mem, etat: relu });
    ok("des réglages vides ne rangent que `acquis` et `deja`",
       memeEnsemble(Object.keys(mem.objet), ["acquis", "deja"]) ,
       "[acquis, deja]", "[" + Object.keys(mem.objet).join(", ") + "]",
       "`undefined` disparaît au passage du JSON — et c'est ce qu'on veut : "
       + "la valeur en place dans la page reste celle du code");
    ok("et ils ne ressortent pas non plus", Object.keys(r.reglages).length === 0,
       "aucun réglage", JSON.stringify(r.reglages));
  }
}

/* ═════════════════ 6. LA MÉMOIRE — VIDE, MAL FORMÉE, D'UNE AUTRE ÉPOQUE

   La mémoire d'un navigateur survit aux versions du site. `registre.js` a déjà
   cette leçon écrite dans son commentaire : une ligne mal formée s'écarte à la
   LECTURE, pas à l'usage. Ici, tout ce qui entre passe par du VRAI texte JSON,
   comme dans un vrai `localStorage` — donc rien de ce qui est éprouvé ci-dessous
   n'est hors d'atteinte.                                                     */
function controleCorruption(P){
  const cas = [
    { nom: "vide (aucune clé)", texte: undefined, brutNul: true },
    { nom: "la chaîne « null »", texte: "null", brutNul: true },
    { nom: "un nombre tout seul", texte: "5", brutNul: true },
    { nom: "une chaîne", texte: "\"bonjour\"", brutNul: true },
    { nom: "un booléen", texte: "true", brutNul: true },
    { nom: "du JSON illisible", texte: "{acquis:[", brutNul: true },
    { nom: "un tableau", texte: "[1,2,3]", brutNul: false },
    { nom: "un objet vide", texte: "{}", brutNul: false },
    { nom: "tous les types faux", brutNul: false,
      texte: JSON.stringify({ niveau: "deux", voix: 1, anecdotes: "souvent",
                              taille: null, volume: [], musique: {}, boutons: "oui",
                              mascotte: 0, acquis: "m-chute", deja: "peut-être" }) },
    { nom: "une version d'il y a six mois", brutNul: false,
      texte: JSON.stringify({ v: 0, level: 2, unlocked: ["m-chute"], son: true }) },
    { nom: "un niveau à virgule", brutNul: false,
      texte: JSON.stringify({ niveau: 1.5, acquis: [] }) },
  ];
  for(const c of cas){
    const mem = fausseMemoire(c.texte);
    const etat = P.etatNeuf();
    etat.acquis.add("m-photon");                 // pour voir si la lecture l'écrase
    let r, leve = null;
    try { r = P.charge({ memoire: mem, etat }); } catch(err){ leve = err; }
    ok("mémoire « " + c.nom + " » — la lecture ne lève pas", leve === null,
       "aucune exception", leve ? leve.name + " : " + leve.message : "aucune");
    if(leve) continue;
    ok("mémoire « " + c.nom + " » — " + (c.brutNul ? "elle est refusée en bloc"
                                                   : "elle ne rend aucun réglage"),
       c.brutNul ? r === null : (r !== null && Object.keys(r.reglages).length === 0),
       c.brutNul ? "null" : "un brut, zéro réglage",
       r === null ? "null" : "brut + " + Object.keys(r.reglages).length + " réglage(s) : "
                             + JSON.stringify(r.reglages),
       c.brutNul ? undefined
         : "un champ absent, du mauvais type ou d'une autre époque n'entre pas : "
           + "la valeur en place dans la page reste celle du code");
    if(c.brutNul)
      ok("mémoire « " + c.nom + " » — l'état en cours n'est pas touché",
         etat.acquis.has("m-photon"), "acquis intact", [...etat.acquis].join(",") || "vidé",
         "il n'y a rien à restaurer : effacer ce que la partie a déjà gagné serait pire "
         + "que ne rien lire");
    else
      ok("mémoire « " + c.nom + " » — `acquis` repart vide plutôt que faux",
         etat.acquis instanceof Set && etat.acquis.size === 0, "un Set vide",
         (etat.acquis instanceof Set ? "Set de " + etat.acquis.size : typeof etat.acquis));
  }

  /* ─── Les nombres non finis. C'est ici que ça se joue.

     `JSON.parse('{"volume":1e400}')` rend `Infinity` — c'est du JSON parfaitement
     valide, et l'adaptateur le plus fidèle du monde le rendra tel quel. Or
     `typeof Infinity === "number"` : le contrôle de type du module dit oui.

     La promesse du module est que « la page applique ce qu'elle reçoit, sans
     avoir à revérifier ». Un `zoomSonde` infini, un `intervalleAnecdote` infini,
     et l'on est exactement dans le mode de panne du 7 août : un réglage qui
     survit au rechargement et qu'on ne pense plus à soupçonner. */
  {
    const mem = fausseMemoire('{"anecdotes":1e400,"taille":-1e400,"volume":1e400,'
                              + '"musique":1e400,"niveau":1e400,"acquis":[]}');
    const etat = P.etatNeuf();
    const r = P.charge({ memoire: mem, etat });
    const sales = r ? Object.entries(r.reglages)
                        .filter(([, v]) => typeof v === "number" && !Number.isFinite(v))
                        .map(([k, v]) => k + " = " + v) : [];
    ok("aucun réglage relu n'est un nombre non fini", sales.length === 0,
       "aucun", sales.length ? sales.join(", ") : "aucun",
       "`1e400` est du JSON valide et rend `Infinity` : le chemin est ouvert avec "
       + "l'adaptateur le plus fidèle. `registre.js` refuse les infinis À LA "
       + "LECTURE, dans la MÊME mémoire — deux modules qui décrivent le même "
       + "espace ne peuvent pas avoir deux lois");
    ok("et un entier infini est bien refusé, lui", r && !("iNiveau" in r.reglages),
       "absent", r && "iNiveau" in r.reglages ? r.reglages.iNiveau : "absent",
       "`Number.isInteger(Infinity)` est faux : les champs « entier » sont protégés "
       + "par accident, les champs « nombre » ne le sont pas");
  }
  // Ce qui est bon passe quand même, au milieu de ce qui ne l'est pas.
  {
    const mem = fausseMemoire(JSON.stringify({
      niveau: 2, voix: "oui", anecdotes: 45000, taille: "grand", volume: 0.5,
      musique: null, boutons: true, mascotte: "non", acquis: ["m-chute", "m-reel"],
    }));
    const etat = P.etatNeuf();
    const r = P.charge({ memoire: mem, etat });
    ok("dans une mémoire à moitié pourrie, seul le sain traverse",
       r && memeEnsemble(Object.keys(r.reglages), ["iNiveau", "intervalleAnecdote",
                                                   "volumeVoix", "modeBoutons"])
       && r.reglages.iNiveau === 2 && r.reglages.volumeVoix === 0.5,
       "[iNiveau, intervalleAnecdote, volumeVoix, modeBoutons]",
       r ? "[" + Object.keys(r.reglages).join(", ") + "]" : "null",
       "quatre champs sur huit étaient inutilisables — le tri se fait champ par "
       + "champ, pas en bloc");
    ok("et les missions acquises aussi",
       memeEnsemble([...etat.acquis], ["m-chute", "m-reel"]), "[m-chute, m-reel]",
       "[" + [...etat.acquis].join(", ") + "]");
  }
  // Sans état, la lecture doit quand même rendre les réglages.
  {
    const mem = fausseMemoire(JSON.stringify({ niveau: 1, acquis: ["m-chute"] }));
    let r, leve = null;
    try { r = P.charge({ memoire: mem }); } catch(err){ leve = err; }
    ok("`charge` sans état ne lève pas et rend quand même les réglages",
       leve === null && r && r.reglages.iNiveau === 1, "iNiveau 1",
       leve ? leve.message : (r ? JSON.stringify(r.reglages) : "null"),
       "la page lit `brut.deja` avant même d'avoir un état à remplir");
  }
}

/* ══════════════════════════════ 7. EFFACER, ET UNE MÉMOIRE QUI REFUSE */
function controleEfface(P){
  const mem = fausseMemoire();
  const etat = P.etatNeuf();
  ["m-chute", "m-orbite"].forEach(id => etat.acquis.add(id));
  etat.iMission = 2;
  P.sauve({ memoire: mem, reglages: REGLAGES, etat });
  const avant = mem.ecritures;
  P.oublie({ memoire: mem, etat });

  ok("`oublie` enlève la clé", mem.presente === false && mem.cles.length === 0,
     "aucune clé", mem.cles.length + " clé(s) : " + mem.cles.join(","),
     "un `null` écrit à la place laisserait la clé en vie — c'est pour ça "
     + "qu'`efface()` a dû être ajouté à l'interface");
  ok("et il n'écrit rien à la place", mem.ecritures === avant && mem.effacements === 1,
     "0 écriture, 1 effacement",
     (mem.ecritures - avant) + " écriture(s), " + mem.effacements + " effacement(s)");
  ok("la partie repart à zéro", etat.acquis.size === 0 && etat.iMission === 0,
     "acquis vide, iMission 0", etat.acquis.size + " acquis, iMission " + etat.iMission);
  ok("et la relecture ne trouve plus rien",
     P.charge({ memoire: mem, etat: P.etatNeuf() }) === null, "null",
     JSON.stringify(P.charge({ memoire: mem, etat: P.etatNeuf() })));

  /* La navigation privée. L'en-tête du module est explicite : c'est
     l'adaptateur de la page qui porte les try/catch. On éprouve donc l'adaptateur
     conforme — celui qui avale et rend la main — et l'on exige que la partie
     aille jusqu'au bout sans rien perdre de ce qu'elle a compris. */
  {
    const mem = memoireMuette();
    const etat = P.etatNeuf(), jeu = jeuNeuf();
    const e = { missions: MISSIONS_TOUTES, jeu };
    let leve = null, ordres = 0;
    try {
      const r = P.charge({ memoire: mem, etat });
      ok("mémoire refusée — la lecture rend null sans rien casser", r === null, "null",
         JSON.stringify(r));
      let t = 0;
      for(const m of MISSIONS_TOUTES){
        POUSSEE[m.id](jeu, etat);
        for(let i = 0; i < 400; i++){
          const o = P.veilleMission(etat, e, t += IMG);
          if(o){ ordres++; if(o.enregistre) P.sauve({ memoire: mem, reglages: REGLAGES, etat }); }
          if(o && o.avance) break;
        }
      }
      P.oublie({ memoire: mem, etat: P.etatNeuf() });
    } catch(err){ leve = err; }
    ok("mémoire refusée — la partie va jusqu'au bout", leve === null && ordres === 16,
       "16 ordres, aucune exception",
       leve ? leve.name + " : " + leve.message : ordres + " ordres",
       "en navigation privée, la progression vit le temps de la visite — ce qui "
       + "vaut mieux qu'une page morte");
    ok("mémoire refusée — mais on a bien essayé d'écrire à chaque acquis",
       mem.ecritures === MISSIONS_TOUTES.length, MISSIONS_TOUTES.length, mem.ecritures,
       "une écriture manquante ne se verrait qu'au rechargement suivant");
  }
  // Et la mémoire BRUTE qui lève — ce que le module ne rattrape pas, exprès.
  {
    const rale = { lit(){ throw new Error("refusé"); },
                   ecrit(){ throw new Error("plein"); },
                   efface(){ throw new Error("refusé"); } };
    let leveEcriture = false, leveLecture = false;
    try { P.sauve({ memoire: rale, reglages: REGLAGES, etat: P.etatNeuf() }); }
    catch(_){ leveEcriture = true; }
    try { P.charge({ memoire: rale, etat: P.etatNeuf() }); } catch(_){ leveLecture = true; }
    if(leveEcriture || leveLecture)
      vu("une mémoire BRUTE qui lève traverse le module sans être rattrapée "
         + "(sauve : " + leveEcriture + ", charge : " + leveLecture + "). C'est le "
         + "contrat — l'adaptateur de la page porte les try/catch — mais la page "
         + "devra vraiment les porter, sur les TROIS méthodes, `efface` comprise.");
  }
}

/* ══════════════════════════════════════════════════ 8. LES DESCRIPTEURS */
const MISSIONS_FICTIVES = [
  { id: "m-chute",  titre: "TITRE-A", consigne: "CONSIGNE-A", reussi: { id: "ok-a" } },
  { id: "m-orbite", titre: "TITRE-B", consigne: "CONSIGNE-B", reussi: { id: "ok-b" } },
  { id: "m-pluie",  titre: "TITRE-C", consigne: "CONSIGNE-C", reussi: { id: "ok-c" } },
];
function controleDescripteurs(P){
  const e = { missions: MISSIONS_FICTIVES };
  const etat = P.etatNeuf();
  const d = P.panneauMission(etat, e);

  ok("le descripteur porte une CLÉ de libellé et ses valeurs",
     d.num && typeof d.num.cle === "string" && /^[a-z]+\.[a-z]+$/.test(d.num.cle)
     && d.num.vals && Object.values(d.num.vals).every(v => typeof v === "number"),
     "{ cle:\"mission.num\", vals:{ n, total } }", JSON.stringify(d.num),
     "ni `T` ni `remplit` n'entrent ici : un contrôle compare des nombres sans "
     + "avoir à charger une table de langue");
  ok("et ses valeurs sont le rang et le total",
     d.num.vals.n === 1 && d.num.vals.total === MISSIONS_FICTIVES.length,
     "n 1, total " + MISSIONS_FICTIVES.length, JSON.stringify(d.num.vals));
  const balise = Object.values(d).filter(v => typeof v === "string" && /[<>]/.test(v));
  ok("le module n'ajoute aucune balise de son cru", balise.length === 0,
     "aucun < ni >", balise.length ? balise.join(" ; ") : "aucun");
  ok("il ne traduit rien : les textes sont ceux qu'on lui a donnés, à l'identité près",
     d.titre === MISSIONS_FICTIVES[0].titre && d.consigne === MISSIONS_FICTIVES[0].consigne,
     "les objets de l'appelant, tels quels",
     JSON.stringify([d.titre, d.consigne]),
     "si quelqu'un glissait un `T(...)` ou un échappement là-dedans, l'identité "
     + "tomberait et ce contrôle avec");

  // La jauge : autant de cases que de missions, et le compte des vraies.
  for(let i = 0; i <= MISSIONS_FICTIVES.length; i++){
    const et = P.etatNeuf(); et.iMission = i;
    const p = P.panneauMission(et, e);
    if(i === MISSIONS_FICTIVES.length){
      ok("passé la dernière mission, le panneau part",
         p.parti === true && Object.keys(p).length === 1, "{ parti:true } et rien d'autre",
         JSON.stringify(p));
      break;
    }
    ok("jauge à " + i + " mission(s) faite(s) — " + MISSIONS_FICTIVES.length
       + " cases, " + i + " allumée(s)",
       Array.isArray(p.jauge) && p.jauge.length === MISSIONS_FICTIVES.length
       && p.jauge.filter(Boolean).length === i
       && p.jauge.every(v => typeof v === "boolean"),
       MISSIONS_FICTIVES.length + " cases dont " + i,
       Array.isArray(p.jauge) ? p.jauge.length + " cases dont "
                                + p.jauge.filter(Boolean).length : typeof p.jauge,
       i === 0 ? "un tableau de booléens : la seule forme qu'un contrôle peut "
                 + "comparer sans analyser du HTML" : undefined);
  }
  {
    const et = P.etatNeuf(); et.missionsActives = false;
    const p = P.panneauMission(et, e);
    ok("panneau fermé au bouton, le descripteur part aussi",
       p.parti === true && Object.keys(p).length === 1, "{ parti:true }", JSON.stringify(p));
  }
  // La quête, même forme, et sa contradiction reproduite volontairement.
  {
    const eq = { quete: QUETE };
    const et = P.etatNeuf(); et.queteActive = true; et.iQuete = 1;
    const p = P.panneauQuete(et, eq);
    ok("la quête a le même descripteur, avec sa propre clé",
       p.parti === false && p.num.cle === "quete.num" && p.num.vals.n === 2
       && p.num.vals.total === QUETE.length && p.jauge.length === QUETE.length
       && p.jauge.filter(Boolean).length === 1,
       "quete.num, étape 2 sur " + QUETE.length + ", 1 case allumée",
       JSON.stringify(p.num) + ", " + p.jauge.filter(Boolean).length + " case(s)");
    const et2 = P.etatNeuf(); et2.queteActive = true; et2.iQuete = QUETE.length;
    const inactive = P.panneauQuete(P.etatNeuf(), eq), finie = P.panneauQuete(et2, eq);
    ok("quête inactive ou finie, le panneau part",
       inactive.parti === true && finie.parti === true,
       "{ parti:true } dans les deux cas",
       JSON.stringify(inactive) + " et " + JSON.stringify(finie));
  }

  /* Ce que le module laisse passer sans y toucher. Le descripteur qu'il
     construit ne porte aucune balise — mais `titre` et `consigne` sont les
     objets de `contenu.js`, rendus tels quels. */
  {
    const vraies = P.missions(MISSIONS_TOUTES, []);
    const et = P.etatNeuf();
    const d = P.panneauMission(et, { missions: vraies });
    const eq = P.etatNeuf(); eq.queteActive = true;
    const dq = P.panneauQuete(eq, { quete: QUETE });
    const balises = [d.titre, d.consigne, dq.titre, dq.consigne]
      .filter(t => typeof t === "string" && /[<>]/.test(t));
    if(balises.length)
      vu("le descripteur porte des BALISES quand on lui donne le vrai contenu : "
         + balises.length + " des quatre textes de la première mission et de la "
         + "première étape contiennent `<` ou `>` (« " + balises[0].slice(0, 46)
         + "… »). Elles viennent de `contenu.js`, pas du module, qui les rend à "
         + "l'identité — mais la page devra donc les injecter en HTML, et le "
         + "descripteur n'est pas « sans balise » en pratique.");
  }
}

/* ═══════════════════════ 9. LES ORDRES — LE SILENCE, PUIS LE PARCOURS ENTIER

   Un ordre « repeindre » qui sortirait à chaque image ferait repeindre la page
   soixante fois par seconde pour ne rien changer. La veille doit se taire dans
   l'écrasante majorité des cas, et ne parler qu'aux deux instants qui comptent :
   la validation, et la fin de la fenêtre de félicitations.                   */
function parcoursMissions(P, liste){
  const etat = P.etatNeuf(), jeu = jeuNeuf(), mem = fausseMemoire();
  const e = { missions: liste, jeu };
  const journal = [];
  let now = 0, nuls = 0, images = 0, poussee = -1, silence = 0;
  while(images < 40000 && etat.iMission < liste.length){
    images++;
    if(!etat.missionFinie && poussee < etat.iMission){
      if(silence >= 40){ POUSSEE[liste[etat.iMission].id](jeu, etat); poussee = etat.iMission; silence = 0; }
      else silence++;
    }
    now += IMG;
    const avant = etat.iMission;
    const o = P.veilleMission(etat, e, now);
    if(o){
      journal.push({ o, images, iAvant: avant, acquis: [...etat.acquis],
                     panneau: P.panneauMission(etat, e) });
      if(o.enregistre) P.sauve({ memoire: mem, reglages: REGLAGES, etat });
    } else nuls++;
  }
  return { etat, jeu, e, mem, journal, nuls, images };
}

function controleOrdres(P){
  const liste = MISSIONS_TOUTES;                 // la liste ENTIÈRE : huit prédicats
  // ── le silence
  {
    const etat = P.etatNeuf(), jeu = jeuNeuf();
    let parle = 0;
    for(let i = 0; i < 600; i++) if(P.veilleMission(etat, { missions: liste, jeu }, (i+1)*IMG)) parle++;
    ok("tant que rien n'est fait, la veille se tait — 600 images", parle === 0,
       "0 ordre", parle + " ordre(s)",
       "un ordre « repeindre » à chaque image, c'est la page repeinte soixante "
       + "fois par seconde pour ne rien changer");
    const et2 = P.etatNeuf(); et2.missionsActives = false;
    let parle2 = 0;
    for(let i = 0; i < 100; i++) if(P.veilleMission(et2, { missions: liste, jeu }, (i+1)*IMG)) parle2++;
    ok("panneau fermé, elle se tait aussi", parle2 === 0, "0 ordre", parle2 + " ordre(s)");
  }

  // ── le parcours entier
  const r = parcoursMissions(P, liste);
  const reussis = r.journal.filter(x => x.o.reussi);
  const avances = r.journal.filter(x => x.o.avance);
  ok("le parcours arrive au bout des " + liste.length + " missions",
     r.etat.iMission === liste.length && r.images < 40000,
     "iMission " + liste.length, "iMission " + r.etat.iMission + " en " + r.images + " images");
  ok("exactement deux ordres par mission, et pas un de plus",
     r.journal.length === 2 * liste.length && reussis.length === liste.length
     && avances.length === liste.length,
     2 * liste.length + " ordres (" + liste.length + " réussites, " + liste.length + " avances)",
     r.journal.length + " ordres (" + reussis.length + " réussites, " + avances.length + " avances)");
  ok("et le reste du temps, elle se tait", r.nuls >= r.images - 2 * liste.length,
     "silencieuse sur " + (r.images - 2 * liste.length) + " images",
     r.nuls + " silences sur " + r.images + " images",
     "les fenêtres de félicitations comptent à elles seules 263 images chacune : "
     + "un ordre qui s'y glisserait repeindrait par-dessus le texte qu'on lit");
  ok("les missions sont validées dans l'ordre, une fois chacune",
     reussis.map(x => x.o.reussi.id).join(",") === liste.map(m => m.id).join(","),
     liste.map(m => m.id).join(","), reussis.map(x => x.o.reussi.id).join(","),
     "une mission validée deux fois donnerait deux fois la récompense et sauterait "
     + "la suivante — c'est exactement ce qu'un compteur mal remis fait");
  ok("chaque réussite porte sa récompense, sa clé et son enregistrement",
     reussis.every(x => x.o.libelle === "mission.reussi" && x.o.enregistre === true
                   && x.o.bulle && x.o.bulle.ms === 12000 && x.o.bulle.texte),
     "libelle + enregistre + bulle 12 s",
     reussis.filter(x => !(x.o.libelle === "mission.reussi" && x.o.enregistre === true
                   && x.o.bulle && x.o.bulle.ms === 12000)).length + " incomplète(s)");
  ok("la jauge des félicitations compte la mission qu'on vient de finir",
     reussis.every((x, i) => x.o.jauge.length === liste.length
                   && x.o.jauge.filter(Boolean).length === i + 1),
     "1, 2, … " + liste.length + " cases",
     reussis.map(x => x.o.jauge.filter(Boolean).length).join(","),
     "c'est l'ordre qui porte la jauge pleine du moment : le descripteur, lui, "
     + "ignore `missionFinie` — point 3 de l'en-tête du module");
  ok("hors félicitations, la jauge du panneau suit les missions acquises",
     avances.every(x => x.panneau.parti
                   || x.panneau.jauge.filter(Boolean).length === x.acquis.length),
     "autant de cases allumées que d'acquis",
     avances.map(x => x.panneau.parti ? "parti"
                 : x.panneau.jauge.filter(Boolean).length + "/" + x.acquis.length).join(" "));
  ok("chaque avance enlève la classe « fini » et redemande le panneau",
     avances.slice(0, -1).every(x => x.o.avance === true && x.o.repeint === true),
     "{ avance, repeint }", JSON.stringify(avances[0] && avances[0].o));
  ok("toutes les missions sont acquises, sans doublon",
     r.etat.acquis.size === liste.length
     && memeEnsemble([...r.etat.acquis], liste.map(m => m.id)),
     liste.length + " acquis", r.etat.acquis.size + " : " + [...r.etat.acquis].join(","));
  ok("la mémoire a été écrite une fois par mission",
     r.mem.ecritures === liste.length, liste.length, r.mem.ecritures);
  ok("et elle contient bien les huit identifiants",
     memeEnsemble(r.mem.objet.acquis || [], liste.map(m => m.id)),
     liste.length + " identifiants", JSON.stringify(r.mem.objet.acquis));

  // ── et après ? Le monde reste satisfait : rien ne doit plus sortir.
  {
    let apres = 0;
    for(let i = 0; i < 500; i++) if(P.veilleMission(r.etat, r.e, 1e6 + i * IMG)) apres++;
    ok("une fois fini, plus rien ne sort — même sur un monde tout satisfait",
       apres === 0 && P.panneauMission(r.etat, r.e).parti === true,
       "0 ordre, panneau parti", apres + " ordre(s)",
       "aucune mission ne peut se valider une seconde fois");
  }
  // ── la liste jouable, celle de la bêta
  {
    const jouables = P.missions(MISSIONS_TOUTES);
    const rr = parcoursMissions(P, jouables);
    ok("le parcours de la bêta va au bout de ses " + jouables.length + " missions",
       rr.etat.iMission === jouables.length && rr.journal.length === 2 * jouables.length,
       jouables.length + " missions, " + 2 * jouables.length + " ordres",
       rr.etat.iMission + " missions, " + rr.journal.length + " ordres",
       "les deux mises de côté n'y sont pas, et les six autres s'enchaînent quand même");
  }
}

/* ══════════════════════════ 10. LA QUÊTE — LE RÉVEIL, LES QUATRE ÉTAPES, LA MAIN */
function controleQuete(P){
  // ── l'arbitre s'éprouve lui-même : le repère du salon est bien orthonormé
  {
    const { av, dr, ht } = repere(0.7, -0.2);
    const norme = v => Math.hypot(v[0], v[1], v[2]);
    const scal = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    ok("le repère de référence est orthonormé",
       Math.abs(norme(av) - 1) < 1e-12 && Math.abs(norme(dr) - 1) < 1e-12
       && Math.abs(norme(ht) - 1) < 1e-12 && Math.abs(scal(av, dr)) < 1e-12,
       "trois vecteurs unitaires, avant ⟂ droite",
       norme(av).toFixed(12) + " / " + Math.abs(scal(av, dr)).toExponential(1),
       "il vient de la convention d'index.html — « Avant = −z, la baie est de ce "
       + "côté » — et non du module : c'est lui qui arbitre la pose du réveil");
  }

  // ── le réveil
  {
    const etat = P.etatNeuf();
    etat.queteVues.add("vieux-poste"); etat.iQuete = 3; etat.tRegard = 999;
    const o = P.lanceQuete(etat, { voixActive: true });
    ok("`lanceQuete` remet la quête à son début",
       etat.queteActive === true && etat.iQuete === 0 && etat.tRegard === 0
       && etat.queteFinie === false && etat.queteVues.size === 0
       && etat.missionsActives === false,
       "étape 0, regard 0, postes oubliés, missions muettes",
       JSON.stringify({ iQuete: etat.iQuete, tRegard: etat.tRegard,
                        vues: etat.queteVues.size, missions: etat.missionsActives }),
       "une seule consigne à l'écran à la fois");
    ok("il rend la pose du réveil et l'ouverture musicale",
       o.pose && typeof o.pose.lacet === "number" && Array.isArray(o.pose.p)
       && o.pose.p.length === 3 && o.ouverture === 38
       && o.repeintMission === true && o.repeintQuete === true,
       "pose + ouverture 38", JSON.stringify({ ouverture: o.ouverture, p: o.pose && o.pose.p }),
       "la pose sort en ORDRE plutôt que d'être écrite dans `salon` et `joueur` : "
       + "c'est le genre d'écriture croisée qui a donné le disque à 622×");
    ok("sans le son accepté, pas d'ouverture",
       P.lanceQuete(P.etatNeuf(), { voixActive: false }).ouverture === null, "null",
       JSON.stringify(P.lanceQuete(P.etatNeuf(), { voixActive: false }).ouverture));

    // LA VÉRIFICATION QUI N'AVAIT JAMAIS PU SE FAIRE : on se réveille DOS à la baie.
    const vue = repere(o.pose.lacet, o.pose.tangage);
    const cos = -vue.av[2];
    const jeu = jeuNeuf(); jeu.repere = vue;
    ok("on se réveille bel et bien DOS à la baie",
       cos < 0 && P.VERIFS_QUETE["a-baie"](jeu, P.etatNeuf()) === false,
       "cosinus négatif, première étape non validée",
       "cosinus " + cos.toFixed(4) + ", étape "
       + (P.VERIFS_QUETE["a-baie"](jeu, P.etatNeuf()) ? "DÉJÀ VALIDÉE" : "à faire"),
       "sans ça, la première consigne — tourner la tête vers la vitre — se valide "
       + "toute seule au bout de deux secondes, et l'on découvre le trou noir "
       + "avant d'avoir compris où l'on est. C'était écrit en commentaire ; "
       + "c'est maintenant mesuré, contre le repère de la page");
  }

  // ── les quatre étapes
  const etat = P.etatNeuf(), jeu = jeuNeuf();
  const e = { quete: QUETE, jeu };
  P.lanceQuete(etat, { voixActive: false });
  const journal = [];
  let now = 0, nuls = 0, images = 0, poussee = -1, silence = 0;
  while(images < 40000 && etat.queteActive){
    images++;
    if(!etat.queteFinie && poussee < etat.iQuete){
      if(silence >= 20){ POUSSEE_QUETE[QUETE[etat.iQuete].id](jeu, etat); poussee = etat.iQuete; silence = 0; }
      else silence++;
    }
    now += IMG;
    const o = P.veilleQuete(etat, e, now);
    if(o) journal.push({ o, images }); else nuls++;
  }
  const reussis = journal.filter(x => x.o.reussi);
  const avances = journal.filter(x => x.o.avance);
  ok("la quête va au bout de ses quatre étapes",
     etat.queteActive === false && images < 40000,
     "quête refermée", etat.queteActive ? "encore active après " + images + " images" : "refermée");
  ok("quatre réussites, quatre avances, dans l'ordre du contenu",
     reussis.length === QUETE.length && avances.length === QUETE.length
     && reussis.map(x => x.o.reussi.id).join(",") === QUETE.map(q => q.id).join(","),
     QUETE.map(q => q.id).join(","), reussis.map(x => x.o.reussi.id).join(","));
  ok("et le reste du temps, elle se tait aussi", nuls === images - journal.length,
     images - journal.length + " silences", nuls);
  ok("le premier regard frappe plus fort que les autres",
     reussis[0] && reussis[0].o.frappe === 1
     && reussis.slice(1).every(x => x.o.frappe === 0.45),
     "1 puis 0,45 × 3", reussis.map(x => x.o.frappe).join(", "),
     "c'est le seul moment du parcours où l'on découvre quelque chose au lieu "
     + "d'apprendre un bouton");
  ok("chaque étape parle avec priorité, treize secondes",
     reussis.every(x => x.o.libelle === "quete.bien" && x.o.bulle.ms === 13000
                   && x.o.bulle.prioritaire === true && x.o.bulle.texte === x.o.reussi.reussi),
     "quete.bien, 13 s, prioritaire, la récompense du contenu",
     reussis.map(x => x.o.libelle + "/" + x.o.bulle.ms + "/" + x.o.bulle.prioritaire
                 + "/" + (x.o.bulle.texte === x.o.reussi.reussi ? "récompense" : "AUTRE CHOSE"))
            .join("  "));
  ok("aucune étape n'écrit dans `acquis`", etat.acquis.size === 0, "0",
     etat.acquis.size + (etat.acquis.size ? " : " + [...etat.acquis].join(",") : ""),
     "apprendre où sont les boutons n'est pas comprendre quelque chose, et cette "
     + "monnaie-là ne se gagne qu'en comprenant");

  // La contradiction du point 1, reproduite volontairement : on la FIXE ici pour
  // que personne ne la corrige en douce, et pour qu'elle se voie si on la corrige.
  ok("la jauge de la quête s'allume ENTIÈREMENT dès la première étape (point 1)",
     reussis.every(x => x.o.jauge.length === QUETE.length && x.o.jauge.every(Boolean)),
     "quatre cases allumées à chaque fois",
     reussis.map(x => x.o.jauge.filter(Boolean).length).join(","),
     "le panneau se contredit pendant 4,2 s : la jauge est pleine pendant que le "
     + "numéro annonce « étape 1 sur 4 ». C'est le comportement d'origine, "
     + "reproduit tel quel — ce contrôle le fige, il ne l'approuve pas");

  // La main rendue aux missions.
  const fin = journal.filter(x => x.o.fin);
  ok("la dernière avance rend la main aux missions, une seule fois",
     fin.length === 1 && fin[0] === journal[journal.length - 1]
     && fin[0].o.fin.enQuete === false && fin[0].o.fin.repeintMission === true
     && fin[0].o.fin.repeintQuete === true && fin[0].o.fin.marqueQuete === true
     && fin[0].o.fin.demandeNiveau === 1200,
     "un seul ordre `fin`, à la toute fin, avec ses cinq consignes",
     fin.length + " ordre(s) `fin` : " + JSON.stringify(fin[0] && fin[0].o.fin));
  ok("et l'état bascule sur les missions",
     etat.queteActive === false && etat.missionsActives === true && etat.iMission === 0,
     "missions actives, mission 0",
     JSON.stringify({ quete: etat.queteActive, missions: etat.missionsActives,
                      iMission: etat.iMission }));
  {
    let apres = 0;
    for(let i = 0; i < 300; i++) if(P.veilleQuete(etat, e, 1e6 + i * IMG)) apres++;
    ok("la quête finie ne reparle plus jamais", apres === 0
       && P.panneauQuete(etat, e).parti === true, "0 ordre, panneau parti", apres);
  }
}

/* ═══════════════ CE QUE LE PORTIER A VU ET N'A PAS TRANSFORMÉ EN VERDICT

   Rien ici n'est un échec, et rien ici n'a été corrigé — ce n'est pas le rôle
   d'un outil. Ce sont des écarts entre ce que le module fait et ce que le site
   promet ailleurs. Ils se disent, ils ne se rangent pas sous le tapis.       */
function controleDoutes(P){
  // Le compte des sondes : le prédicat et la consigne ne disent pas le même nombre.
  {
    const m = MISSIONS_TOUTES.find(x => x.id === "m-pluie");
    const dits = (((m && (m.titre + " " + m.consigne)) || "").match(/\d+/g) || []);
    const jeu = jeuNeuf();
    while(jeu.sondes.length < 50) jeu.sondes.push(sondeSimple());
    if(P.VERIFS["m-pluie"](jeu, P.etatNeuf()) && !dits.includes("50"))
      vu("« m-pluie » se coche à CINQUANTE sondes, alors que la mission en promet "
         + (dits.join(" puis ") || "un autre nombre") + " (« " + m.titre + " »). "
         + "Le joueur qui appuie sur le bouton en lâche assez pour que l'écart ne "
         + "se voie jamais — mais quelqu'un qui en lâche cinquante à la main "
         + "gagnerait une mission qu'il n'a pas faite. Reproduit tel quel.");
  }
  // `!== null` laisse passer `undefined`.
  {
    const jeu = jeuNeuf(); jeu.sondeSuivie = undefined;
    if(P.VERIFS["m-bord"](jeu, P.etatNeuf()))
      vu("« m-bord » se coche aussi quand `sondeSuivie` vaut `undefined` : "
         + "`undefined !== null` est vrai. La page doit donc garantir un `null` "
         + "franc quand personne n'est embarqué — un champ jamais initialisé "
         + "validerait la mission au premier passage.");
  }
  // Rien ne dit à la reprise où l'on en était.
  {
    const mem = fausseMemoire(), etat = P.etatNeuf();
    etat.acquis.add("m-chute"); etat.acquis.add("m-orbite"); etat.iMission = 2;
    P.sauve({ memoire: mem, reglages: REGLAGES, etat });
    const reprise = P.etatNeuf();
    P.charge({ memoire: mem, etat: reprise });
    if(reprise.acquis.size === 2 && reprise.iMission === 0)
      vu("après un rechargement, `acquis` revient plein mais `iMission` repart à "
         + "zéro : le module ne dérive pas l'un de l'autre. La page devra le faire "
         + "elle-même à la reprise, sinon la première mission se refait et se "
         + "félicite une seconde fois. L'en-tête l'assume (« `etat.iMission` à la "
         + "reprise »), mais rien dans le module ne le rappelle à l'appelant.");
  }
}

/* ══════════════════════════════════════════════════════ LE DÉROULÉ */
const REJOUABLES = [controlePredicatsIsoles, controleBornes, controleLectures,
                    controleAllerRetour, controleCorruption, controleDescripteurs,
                    controleOrdres, controleQuete];

groupe("Le contrat du module, et les listes qu'il reçoit");
controleContrat(P);
groupe("Les prédicats — un seul champ poussé, une seule mission qui bascule");
controlePredicatsIsoles(P);
groupe("Les bornes — le contrôle qu'aucune partie jouée ne remplacerait");
controleBornes(P);
groupe("Les prédicats ne vont rien chercher tout seuls");
controleLectures(P);
groupe("La mémoire — l'aller-retour complet, contre le code qu'il remplace");
controleAllerRetour(P);
groupe("La mémoire — vide, mal formée, d'une autre époque");
controleCorruption(P);
groupe("Effacer, et une mémoire qui refuse");
controleEfface(P);
groupe("Les descripteurs — du texte, des nombres, aucune balise");
controleDescripteurs(P);
groupe("Les ordres — le silence, puis le parcours entier");
controleOrdres(P);
groupe("La quête d'accueil — le réveil dos à la baie, et la main rendue");
controleQuete(P);
controleDoutes(P);

/* ══════════════════════════════ 11. CET OUTIL SAIT-IL ÉCHOUER ?  (règle 2)

   On rejoue tous les groupes ci-dessus, en silence, sur des modules cassés
   exprès — les uns par enveloppe, les autres sur une copie EN MÉMOIRE du
   source. Le fichier sur le disque n'est jamais touché.

   Un sabotage ne compte que s'il fait tomber un contrôle qui était VERT sur le
   module intact : c'est pour ça qu'on prend d'abord un relevé de référence.
   Sans cette précaution, un contrôle déjà rouge validerait tous les sabotages
   du monde.                                                                  */
groupe("Cet outil sait échouer — on casse le module pour le prouver");

function releve(P){
  carnet = [];
  for(const g of REJOUABLES){
    try { g(P); } catch(err){ carnet.push({ nom: g.name + " — exception : " + err.message, vrai: false }); }
  }
  const lot = carnet; carnet = null;
  const m = new Map(); const vu = new Map();
  for(const c of lot){
    const k = (vu.get(c.nom) || 0); vu.set(c.nom, k + 1);
    m.set(c.nom + "#" + k, c.vrai);
  }
  return m;
}
const REFERENCE = releve(P);

function essaie(nom, mutant, attendu){
  if(!mutant){
    ok("saboter " + nom + " donne un module jouable", false, "un module mutant",
       "motif introuvable dans le source — sabotage non tenté");
    return;
  }
  let lot;
  try { lot = releve(mutant); }
  catch(err){ lot = new Map([["exception : " + err.message, false]]); }
  const tombes = [...lot].filter(([k, v]) => !v && REFERENCE.get(k) === true).map(([k]) => k);
  const vise = tombes.filter(k => k.includes(attendu));
  ok(nom + " → « " + attendu + " » tombe", vise.length > 0,
     "au moins un contrôle de ce nom passe au rouge",
     tombes.length + " contrôle(s) nouvellement rouges"
     + (tombes.length ? " : " + tombes.slice(0, 3).map(k => k.split("#")[0]).join(" ; ") : ""),
     vise.length ? undefined
       : "AUCUN — le contrôle visé ne surveille donc rien, et il faut le réécrire");
}

// 1. un seuil qui passe de `>=` à `>` — le mode de panne invisible en jouant
essaie("un `>=` changé en `>` sur les cinquante sondes",
       Object.assign({}, P, { VERIFS: Object.assign({}, P.VERIFS,
         { "m-pluie": jeu => jeu.sondes.length > 50 }) }),
       "m-pluie");

// 2. une sérialisation qui perd les `Set`
{
  const motif = "const o = { acquis: [...e.etat.acquis], deja: true };";
  let mutant = null;
  if(SRC.includes(motif))
    try { mutant = chargeModule(SRC.replace(motif, "const o = { acquis: e.etat.acquis, deja: true };")); }
    catch(_){ }
  essaie("une sérialisation qui range le `Set` tel quel", mutant, "traversent le JSON");
}

// 3. une veille qui émet son ordre à chaque appel
essaie("une veille qui parle à chaque image",
       Object.assign({}, P, { veilleMission: (etat, e, now) =>
         P.veilleMission(etat, e, now) || { repeint: true } }),
       "se tait");

// 4. un contrôle de type qui dit oui à tout
{
  const motif = "function estDuType(v, type){";
  let mutant = null;
  if(SRC.includes(motif))
    try { mutant = chargeModule(SRC.replace(motif, motif + " return true;")); } catch(_){ }
  essaie("un contrôle de type qui accepte n'importe quoi", mutant, "types faux");
}

// 5. une jauge décalée d'une case
{
  const motif = "for(let i = 0; i < n; i++) t.push(i < seuil);";
  let mutant = null;
  if(SRC.includes(motif))
    try { mutant = chargeModule(SRC.replace(motif, "for(let i = 0; i < n; i++) t.push(i <= seuil);")); }
    catch(_){ }
  essaie("une jauge décalée d'une case", mutant, "jauge");
}

/* ══════════════════════════════════════════════════════ LE RELEVÉ DES SEUILS */
console.log("\n  LES SEUILS ÉPROUVÉS DES DEUX CÔTÉS");
console.log("  " + "─".repeat(34));
for(const s of RECAP)
  console.log("  " + (s.vert ? "✅" : "❌") + "  " + s.id.padEnd(16) + s.seuil.padEnd(24)
              + "faux à « " + s.sous + " », vrai à « " + s.sur + " »");

if(observations.length){
  console.log("\n  CE QUI A ÉTÉ VU ET N'A PAS ÉTÉ TRANSFORMÉ EN VERDICT");
  console.log("  " + "─".repeat(51));
  for(const o of observations) console.log("  ·   " + o);
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHEC" + (echecs > 1 ? "S" : "")
                                  + " sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
