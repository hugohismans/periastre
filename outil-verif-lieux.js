/* ============================================================================
   LES LIEUX, ÉPROUVÉS SANS NAVIGATEUR

       node outil-verif-lieux.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   « Où l'on se trouve » — vue libre, salon, à bord d'une sonde — est la
   première fondation du projet, et elle ne tient qu'à une chose : UN SEUL
   ÉCRIVAIN pour `lieu`. Le dépôt a affirmé pendant des semaines que c'était le
   cas ; c'était faux. La mise à jour de la caméra écrivait aussi, en
   court-circuitant les trois fonctions de transition. Personne ne l'a vu à
   l'œil, parce qu'un second écrivain ne casse rien : il laisse simplement, une
   fois sur vingt, un voyage armé pour toujours, une sonde fantôme, un pointeur
   qu'on ne récupère plus.

   La garantie de ce domaine ne se lit donc pas. Elle se mesure. Jusqu'ici elle
   ne se mesurait qu'en ouvrant un navigateur et en tapant `VERIF.lieux()` ;
   elle se mesure maintenant en quelques millisecondes, ici, sur un objet nu.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI  (règle 3 du projet)

   Rien n'est repris du corps de `lieux.js`. Cinq sources, toutes extérieures :

   1. LA PROSE DU CONTRAT. Les sept invariants de l'en-tête du module sont
      volontairement écrits en français et non en code — « l'outil la réécrit en
      code, chez lui, et sa vérité vient d'ailleurs que d'ici ». C'est fait
      ci-dessous, et l'équivalence à deux faces y est SÉPARÉE en deux lignes :
      un module qui inverserait le sens en passerait une et pas l'autre.

   2. LA TABLE DES ORDRES, transcrite du contrat (les huit ordres numérotés, et
      la phrase « un ordre ne sort que quand il a lieu d'être »), pas du code.
      Elle est écrite comme une fonction indépendante, `ordresAttendus`, et
      confrontée mot pour mot au résultat — clés en trop comprises.

   3. LA LISTE DES LIEUX, DÉCLARÉE ICI. `LIEUX.CONNUS` est une DONNÉE du module :
      s'en servir comme référence rendrait le contrôle complice — ajouter « tir »
      à cette liste sans rien câbler lui ferait accepter `lieu === "tir"`. Le
      contrôle énumère donc ses trois lieux lui-même et exige que les deux listes
      coïncident, dans les deux sens.

   4. UNE MACHINE À ÉTATS ÉNUMÉRÉE EXHAUSTIVEMENT. Trois lieux, neuf couples, la
      diagonale comprise, sur trois états de départ (salon chargé, salon nu,
      quête d'accueil). Les cases qu'on ne regarde pas sont celles qui cassent.

   5. UN JOURNAL PRIS EN DEHORS DU MODULE. `vaAu` appelle `quitteLieu` et
      `entreLieu` par leurs noms internes : remplacer `LIEUX.quitteLieu` du
      dehors ne changerait rien. On charge donc un SECOND exemplaire du module,
      depuis une copie EN MÉMOIRE du source où les deux fonctions poussent leur
      nom dans un journal. Le fichier sur le disque n'est jamais touché, et un
      contrôle vérifie que le jumeau instrumenté rend exactement les mêmes
      résultats que l'original sur les neuf transitions — sans quoi on
      mesurerait un autre module.

   ---------------------------------------------------------------------------
   CE QUE LE MONDE EST, ICI

   Le module n'a aucune variable vivante : il reçoit `monde` et écrit dedans.
   L'en-tête interdit explicitement un `mondeNeuf()` dans le module — une
   fixture prise dans ce qu'on contrôle validerait le module contre lui-même.
   La forme est donc DÉCLARÉE ici, et si elle est incomplète le module doit
   casser bruyamment. C'est le bon échec.

   Deux formes de monde sont utilisées :

     · un objet nu, pour la table des neuf et les instantanés avant/après ;
     · un monde ESPION, dont `lieu` et `sondeSuivie` sont des accesseurs qui
       comptent leurs écritures. C'est exactement le motif que la page emploiera
       pour brancher le module, et c'est ce qui permet de mesurer « une seule
       écriture » au lieu de l'espérer.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Treize sabotages. Chacun réécrit UN endroit du source dans une copie en
   mémoire, recharge le module mutant, rejoue en silence le groupe de contrôles
   visé et exige qu'il tombe. Les trois qui comptent le plus :

     · un `quitteLieu` qui n'efface pas la sonde en quittant « sonde » — dès la
       transition suivante l'équivalence est fausse ;
     · un `vaAu` sans la précondition d'entrée — on entre sur une sonde qu'on
       n'a pas ;
     · un `vaAu` qui traite « aller là où l'on est déjà » comme une vraie
       transition — le panneau se refermerait sous les doigts du joueur, et au
       salon le voyage en cours mourrait d'un clic sur le bouton qui n'était
       censé rien faire.

   Le fichier échoue si un sabotage passe inaperçu. Un contrôle incapable de
   prouver qu'il sait tomber ne surveille rien.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS, ET IL FAUT LE DIRE

   `VERIF.lieux()`, dans la page, éprouve un invariant que celui-ci NE PEUT PAS
   éprouver : « `salon.actif` suit `lieu` ». `salon.actif` est une vue de la
   page sur `lieu`, dont le `set` rappelle `vaAu` ; le module ne l'écrit jamais
   et ne la voit pas. Le seul reflet vérifiable d'ici est `barre(monde).auSalon`,
   qui est le descripteur que la page peint — c'est le contrôle 7, et il ne dit
   rien de l'accesseur `salon.actif` lui-même.

   Ne sont pas couverts non plus : que `lanceVoyage()` arme réellement un
   trajet (on en fabrique un ici), que `meilleureSonde()` soit branchée sur le
   vrai tableau `sondes`, et tout ce que la page fait des ordres une fois
   rendus — la classe « vu » de #chrono, `document.exitPointerLock()`, la
   peinture de la barre. Le module DÉCIDE, la page PEINT : cet outil garde la
   décision, pas la peinture.

   ---------------------------------------------------------------------------
   CE QUI EST SIGNALÉ ET NON CORRIGÉ

   Cet outil est le portier : il n'écrit pas dans `lieux.js`. Les constats sont
   IMPRIMÉS en fin de course sous « ⚠ », sans être comptés comme des échecs —
   la décision appartient à qui tient le module. Chacun porte, en toutes
   lettres, l'assertion qu'il n'y aurait qu'à armer le jour où le module change.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN = path.join(ICI, "lieux.js");

/* La graine. Un contrôle qui ne tombe qu'un jour sur dix, et qu'on ne sait pas
   rejouer, se fait désactiver dans la semaine. Elle est ÉCRITE, jamais tirée. */
const GRAINE = 20260808;

console.log("\n  LES LIEUX — CONTRÔLE HORS NAVIGATEUR");
console.log("  ════════════════════════════════════");

let n = 0, echecs = 0;
/* Quand `carnet` n'est pas nul, `ok()` range au lieu d'imprimer. C'est ce qui
   permet de rejouer les mêmes contrôles sur un module saboté sans salir la
   sortie de faux échecs — et sans réécrire les assertions une seconde fois, ce
   qui reviendrait à saboter aussi le contrôle du sabotage. */
let carnet = null;
const groupe = t => { if(carnet) return;
                      console.log("\n  " + t + "\n  " + "─".repeat(t.length)); };
function ok(nom, vrai, attendu, mesure, note){
  if(carnet){ carnet.push({ nom, vrai: !!vrai }); return; }
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
function stop(titre, lignes){
  console.log("\n  ❌  " + titre);
  console.log("  " + "─".repeat(titre.length + 4));
  for(const l of lignes) console.log("      " + l);
  console.log("");
  process.exit(1);
}

/* ═══════════════════════════════════════════════ 0. le module est-il seulement là ?

   S'il manque, on ne rend PAS un zéro échec. Un outil qui n'a rien mesuré et
   qui sort en code 0 endort exactement comme un contrôle incapable d'échouer :
   `node tout.js` afficherait un filet complet sur un trou. */
if(!fs.existsSync(CHEMIN))
  stop("lieux.js n'existe pas — RIEN N'A ÉTÉ MESURÉ", [
    "Cet outil charge le module hors navigateur et refuse de conclure sans lui.",
  ]);

const SRC = fs.readFileSync(CHEMIN, "utf8");

/* Le module se referme sur un faux global. On tend tous les noms sous lesquels
   un module de ce dépôt peut se déclarer, plutôt que d'imposer une écriture. */
function evalue(src){
  const bac = {};
  const mod = { exports: bac };
  new Function("window", "global", "globalThis", "self", "module", "exports", src)
    (bac, bac, bac, bac, mod, bac);
  return bac;
}

/* ── LE JUMEAU INSTRUMENTÉ.

   `vaAu` appelle `quitteLieu` et `entreLieu` par leurs noms internes : les
   remplacer sur l'objet `LIEUX` du dehors ne changerait rien à ce que `vaAu`
   traverse. On pose donc une ligne de journal en tête de chaque fonction, dans
   une copie EN MÉMOIRE du source. `global` y est le paramètre de l'IIFE, c'est
   à dire notre faux `window` : le journal n'a nulle part où fuir. */
function instrumente(src){
  let nQ = 0, nE = 0;
  let s = src.replace(/function\s+quitteLieu\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/,
    (m, a, b) => { nQ++; return m + 'if(global.__J) global.__J.push("quitte:"+' + b + ');'; });
  s = s.replace(/function\s+entreLieu\s*\(\s*(\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/,
    (m, a, b) => { nE++; return m + 'if(global.__J) global.__J.push("entre:"+' + b + ');'; });
  return { src: s, nQ, nE };
}

/* Bâtit le couple { module, jumeau instrumenté, journal } depuis un source.
   Rend un objet `{ erreur }` plutôt que de jeter : les sabotages s'en servent
   aussi, et un sabotage qui ne se charge plus doit se DIRE, pas planter. */
function batir(src){
  let inst;
  try { inst = instrumente(src); } catch(e){ return { erreur: "instrumentation : " + e.message }; }
  if(inst.nQ !== 1 || inst.nE !== 1)
    return { erreur: "les deux fonctions de transition ne se repèrent plus dans le source "
                     + "(quitteLieu ×" + inst.nQ + ", entreLieu ×" + inst.nE + ")" };
  let bac, bacI;
  try { bac = evalue(src); bacI = evalue(inst.src); }
  catch(e){ return { erreur: e.name + " : " + e.message }; }
  if(!bac.LIEUX || !bacI.LIEUX) return { erreur: "le module ne pose plus `global.LIEUX`" };
  bacI.__J = [];
  return { L: bac.LIEUX, LI: bacI.LIEUX, J: bacI.__J };
}

let SAIN;
try { SAIN = batir(SRC); }
catch(err){
  stop("lieux.js ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
  ]);
}
if(SAIN.erreur)
  stop("lieux.js ne se laisse pas charger hors navigateur — RIEN N'A ÉTÉ MESURÉ", [
    SAIN.erreur,
    "",
    "Le module doit pouvoir s'évaluer sans DOM, sans WebGL, sans `document` au",
    "chargement. C'est ce qui le rend vérifiable sans écran.",
  ]);

const CONTRAT = ["CONNUS", "quitteLieu", "entreLieu", "barre", "vaAu"];
{
  const manque = CONTRAT.filter(k => SAIN.L[k] === undefined);
  if(manque.length)
    stop("lieux.js n'expose pas tout son contrat", [
      "manquant  " + manque.join(", "),
      "trouvé    " + Object.keys(SAIN.L).join(", "),
    ]);
}

/* ══════════════════════════════════════════ ce que le contrôle déclare, lui

   Ces deux listes sont la référence. Elles ne sont PAS lues dans le module —
   c'est tout leur intérêt : l'écart entre ce que le module connaît et ce que
   la page sait peindre doit devenir un échec, pas un angle mort. */
const LIEUX_ATTENDUS = ["libre", "salon", "sonde"];

/* Les neuf ordres, dans l'ordre où la page les exécute. Le rang est transcrit
   du contrat, et il sert à imprimer la table — la contrainte dure y est que
   `poseSalon` (6) place le vaisseau et que `majCamera` (9) lit cette place.

   `inscritSejour` (10 août) vient EN PREMIER : il lit les horloges du salon,
   que `poseSalon` remettrait à zéro — l'inscription doit donc précéder toute
   entrée. Il sort à CHAQUE sortie du salon, inconditionnellement : c'est la
   page qui applique le seuil d'affichage, pas le module, qui ne voit pas les
   horloges. */
const RANG_ORDRE = {
  inscritSejour: 1,
  cacheChrono: 2, fermeInstrument: 3, relachePointeur: 4, boutonSonde: 5,
  poseSalon: 6, reaction: 7, barre: 8, majCamera: 9,
};
const ORDRES_CONNUS = Object.keys(RANG_ORDRE);

// ─────────────────────────────────────────────────────────── petites commodités
function stable(v){
  if(v === null || typeof v !== "object") return v;
  if(Array.isArray(v)) return v.map(stable);
  const o = {};
  for(const k of Object.keys(v).sort()) o[k] = stable(v[k]);
  return o;
}
const jsn  = v => JSON.stringify(stable(v));
const meme = (a, b) => jsn(a) === jsn(b);
const cles = o => Object.keys(o).sort().join("+") || "∅";

/* Un générateur pseudo-aléatoire À GRAINE (mulberry32). Les tirages doivent
   être les mêmes à chaque exécution et sur chaque machine, sans quoi un échec
   ne se rejoue pas. */
function alea(graine){
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ══════════════════════════════════════════════════════════ LE MONDE, DÉCLARÉ ICI

   `chargé` : l'état le plus chargé qui reste LÉGITIME pour ce lieu — au salon
   un voyage armé, un recul en cours, l'instrument ouvert ; en vue libre le plan
   d'ouverture en train de jouer ; à bord une sonde désignée. C'est l'état où
   une transition a le plus à éteindre.

   `nu` : le même lieu sans rien d'armé. C'est lui qui prouve qu'un ordre ne
   sort pas quand il n'a pas lieu d'être. */
function trajetFactice(){
  return { dest: { nom: "chrono.essai" }, calcul: { d_m: 1e14, tau: 3, t: 9 },
           depart: 16, arrive: false };
}
function mondeNeuf(depart, opts){
  const o = opts || {};
  const arme = !o.nu;
  const salon = depart === "salon" && arme;
  return {
    lieu: depart,
    sondeSuivie: depart === "sonde" ? (o.sonde === undefined ? 3 : o.sonde) : null,
    telescope: { ouvert: salon, trajet: salon ? trajetFactice() : null, retour: salon,
                 carte: 0.5, grille: 0.25 },
    recul:  { actif: salon, t: 0.4, distance: 16 },
    cinema: { actif: depart === "libre" && arme },
  };
}

/* Le monde ESPION. `lieu` et `sondeSuivie` passent par des accesseurs qui
   comptent leurs écritures — c'est le motif exact que la page emploiera pour
   brancher le module, et c'est ce qui rend « une seule écriture » mesurable. */
function mondeEspion(depart, opts){
  const socle = mondeNeuf(depart, opts);
  let lieu = socle.lieu, sonde = socle.sondeSuivie;
  const m = { telescope: socle.telescope, recul: socle.recul, cinema: socle.cinema };
  Object.defineProperty(m, "lieu", { enumerable: true,
    get(){ return lieu; }, set(v){ m.ecrituresLieu++; lieu = v; } });
  Object.defineProperty(m, "sondeSuivie", { enumerable: true,
    get(){ return sonde; }, set(v){ m.ecrituresSonde++; sonde = v; } });
  Object.defineProperty(m, "ecrituresLieu",  { writable: true, value: 0 });
  Object.defineProperty(m, "ecrituresSonde", { writable: true, value: 0 });
  return m;
}

/* ══════════════════════════════════════ LES SEPT INVARIANTS, RÉÉCRITS EN CODE

   Transcrits de la prose de l'en-tête du module. L'équivalence du deuxième est
   coupée en DEUX FACES : un module qui la tiendrait dans un sens et pas dans
   l'autre passerait une ligne et pas l'autre, et l'on saurait laquelle. */
function invariants(m, L){
  let b = null, bErr = null;
  try { b = L.barre(m); } catch(e){ bErr = e.message; }
  return [
    ["le lieu est l'un des trois lieux connus",
     LIEUX_ATTENDUS.indexOf(m.lieu) >= 0, "lieu=" + m.lieu],
    ["à bord d'une sonde, on en a forcément une  (lieu ⇒ sonde)",
     m.lieu !== "sonde" || m.sondeSuivie !== null,
     "lieu=" + m.lieu + " sondeSuivie=" + m.sondeSuivie],
    ["une sonde suivie veut dire qu'on est à bord  (sonde ⇒ lieu)",
     m.sondeSuivie === null || m.lieu === "sonde",
     "lieu=" + m.lieu + " sondeSuivie=" + m.sondeSuivie],
    ["aucun voyage ne survit hors du salon",
     m.lieu === "salon" || !m.telescope.trajet,
     "lieu=" + m.lieu + " trajet=" + (m.telescope.trajet ? "ARMÉ" : "aucun")],
    ["aucun recul ne survit hors du salon",
     m.lieu === "salon" || !m.recul.actif,
     "lieu=" + m.lieu + " recul=" + m.recul.actif],
    ["le plan d'ouverture ne survit pas à une prise de commande",
     m.lieu === "libre" || !m.cinema.actif,
     "lieu=" + m.lieu + " cinema=" + m.cinema.actif],
    ["l'instrument est fermé hors du salon",
     m.lieu === "salon" || !m.telescope.ouvert,
     "lieu=" + m.lieu + " ouvert=" + m.telescope.ouvert],
    ["la barre du bas reflète le lieu",
     !bErr && !!b && b.auSalon === (m.lieu === "salon"),
     bErr ? "barre a jeté : " + bErr : "auSalon=" + (b && b.auSalon) + " lieu=" + m.lieu],
  ];
}
function premierFaux(m, L){
  for(const [nom, vrai, mesure] of invariants(m, L))
    if(!vrai) return nom + "  [" + mesure + "]";
  return null;
}

/* ═══════════════════════════════════ LA TABLE DES ORDRES, TRANSCRITE DU CONTRAT

   Écrite à la main depuis l'en-tête du module et depuis la liste numérotée des
   huit ordres, jamais recopiée du corps de `lieux.js`. Elle rend l'objet ENTIER
   attendu : une clé en trop est donc un échec, pas un silence.

     quitter  · le salon INSCRIT LE SÉJOUR au carnet (10 août — à chaque sortie,
                sans condition : le seuil d'affichage appartient à la page),
                éteint un voyage EN COURS (donc `cacheChrono` seulement s'il y
                en avait un), referme l'instrument, relâche le pointeur
     quitter  · une sonde repeint son bouton
     entrer   · au salon on pose le vaisseau, et l'on réagit — sauf si c'est la
                quête d'accueil qui nous dépose, une seule voix à la fois
     toujours · le descripteur de barre et la mise à jour de la caméra          */
function ordresAttendus(de, vers, etat, ctx){
  const o = {};
  if(de === "salon"){
    o.inscritSejour = true;
    if(etat.trajetArme) o.cacheChrono = true;
    o.fermeInstrument = true;
    o.relachePointeur = true;
  }
  if(de === "sonde") o.boutonSonde = true;
  if(vers === "salon"){
    o.poseSalon = true;
    if(!ctx.ouvreLaQuete) o.reaction = "salon";
  }
  o.barre = { auSalon: vers === "salon",
              cle: vers === "salon" ? "dock.salon.quitter" : "dock.salon" };
  o.majCamera = true;
  return o;
}

/* ══════════════════════════════════════════════════════════════════════════════
   LES CONTRÔLES

   Chacun est une fonction du module, pour pouvoir être rejoué tel quel sur un
   module saboté. `M` est le couple { L, LI, J } : le module, son jumeau
   instrumenté, et le journal de ce jumeau.
   ══════════════════════════════════════════════════════════════════════════════ */

const ctxSonde = () => ({ meilleureSonde: () => 2 });

// ── 1. le contrat de surface, et la liste des lieux confrontée à la nôtre
function ctrlContrat(M){
  const L = M.L;
  const c = L.CONNUS;
  ok("`CONNUS` est un tableau de lieux", Array.isArray(c),
     "un tableau", typeof c + (Array.isArray(c) ? "" : " — le reste ne prouve rien"));
  const enTrop  = (Array.isArray(c) ? c : []).filter(x => LIEUX_ATTENDUS.indexOf(x) < 0);
  const manquant = LIEUX_ATTENDUS.filter(x => (Array.isArray(c) ? c : []).indexOf(x) < 0);
  ok("le module ne connaît aucun lieu que ce contrôle ignore", enTrop.length === 0,
     "aucun", enTrop.length ? enTrop.join(", ") : "aucun",
     "un lieu ajouté à `CONNUS` sans être câblé ici doit faire ROUGE, pas passer");
  ok("le contrôle ne réclame aucun lieu que le module ignore", manquant.length === 0,
     "aucun", manquant.length ? manquant.join(", ") : "aucun");
  for(const k of ["quitteLieu", "entreLieu", "barre", "vaAu"])
    ok("`LIEUX." + k + "` est une fonction", typeof L[k] === "function",
       "function", typeof L[k]);
}

// ── 2. l'invariant central, ses deux faces, séparément
function ctrlFaceLieuVersSonde(M){          // lieu === "sonde" ⇒ sondeSuivie !== null
  const L = M.L;
  for(const de of ["libre", "salon"]){
    const m = mondeNeuf(de);
    L.vaAu(m, "sonde", ctxSonde());
    ok(de + " → sonde : si l'on y est, on a une sonde",
       m.lieu !== "sonde" || m.sondeSuivie !== null,
       "sondeSuivie non nulle", "lieu=" + m.lieu + " sondeSuivie=" + m.sondeSuivie);
  }
  // Et le cas qui rend la face intéressante : personne à embarquer.
  for(const de of ["libre", "salon"]){
    const m = mondeNeuf(de);
    L.vaAu(m, "sonde", {});
    ok(de + " → sonde sans sonde : on n'y entre pas du tout",
       m.lieu === de && m.sondeSuivie === null,
       de + " · sondeSuivie=null", m.lieu + " · sondeSuivie=" + m.sondeSuivie);
  }
}
function ctrlFaceSondeVersLieu(M){          // sondeSuivie !== null ⇒ lieu === "sonde"
  const L = M.L;
  for(const vers of ["libre", "salon"]){
    const m = mondeNeuf("sonde");
    L.vaAu(m, vers, ctxSonde());
    ok("sonde → " + vers + " : plus de sonde suivie",
       m.sondeSuivie === null, "null", String(m.sondeSuivie),
       "sinon l'équivalence est fausse dès la transition d'après");
  }
  // Une sonde suivie ne doit pas non plus apparaître en allant ailleurs.
  const m = mondeNeuf("libre");
  L.vaAu(m, "salon", ctxSonde());
  ok("libre → salon n'invente pas de sonde suivie", m.sondeSuivie === null,
     "null", String(m.sondeSuivie));
}

// ── 3. les invariants tenus APRÈS chacune des neuf transitions
function ctrlInvariantsApresChaque(M){
  const L = M.L;
  for(const nu of [false, true])
    for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
      const m = mondeNeuf(de, { nu });
      let jete = null;
      try { L.vaAu(m, vers, ctxSonde()); } catch(e){ jete = e.message; }
      const faux = jete ? "a jeté : " + jete : premierFaux(m, L);
      ok((nu ? "nu   " : "chargé") + "  " + de + " → " + vers
         + " : les huit invariants tiennent",
         !faux, "tous vrais", faux || "tous vrais");
    }
}

// ── 4. la table des neuf : lieu d'arrivée, réponse, et ordres au mot près
function tableUne(M, de, vers, opts, ctx){
  const L = M.L;
  const m = mondeNeuf(de, opts);
  const trajetArme = !!m.telescope.trajet;
  const r = L.vaAu(m, vers, ctx);
  const objet = !!r && typeof r === "object";
  const attendus = (de === vers) ? {} : ordresAttendus(de, vers, { trajetArme }, ctx);
  return { m, r, objet, attendus, trajetArme,
           ordres: objet && r.ordres ? r.ordres : null };
}
function ctrlTableChargee(M){
  const lignes = [];
  for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
    const t = tableUne(M, de, vers, {}, ctxSonde());
    const arriveeAttendue = (de === vers) ? de : vers;
    const changeAttendu = de !== vers;
    const refusAttendu = de === vers ? "deja-la" : null;
    ok(de + " → " + vers + " : arrivée, `change` et `refus`",
       t.objet && t.m.lieu === arriveeAttendue && t.r.change === changeAttendu
         && t.r.refus === refusAttendu && t.r.de === de && t.r.vers === vers,
       arriveeAttendue + " · change=" + changeAttendu + " · refus=" + refusAttendu,
       !t.objet ? "`vaAu` n'a pas rendu d'objet"
                : t.m.lieu + " · change=" + t.r.change + " · refus=" + t.r.refus);
    ok(de + " → " + vers + " : les ordres rendus, au mot près",
       t.ordres !== null && meme(t.ordres, t.attendus),
       cles(t.attendus), t.ordres ? cles(t.ordres) : "aucun objet `ordres`",
       t.ordres && !meme(t.ordres, t.attendus)
         ? "attendu " + jsn(t.attendus) + "\n        obtenu  " + jsn(t.ordres) : undefined);
    lignes.push([de, vers, t]);
  }
  return lignes;
}
function ctrlTableNue(M){
  let faux = null, compte = 0;
  for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
    const t = tableUne(M, de, vers, { nu: true }, ctxSonde());
    compte++;
    if(!t.objet || !t.ordres || !meme(t.ordres, t.attendus)){
      faux = de + " → " + vers + " : attendu " + cles(t.attendus)
             + ", obtenu " + (t.ordres ? cles(t.ordres) : "rien");
      break;
    }
  }
  ok("sur un monde NU, aucun ordre ne sort qui n'ait lieu d'être",
     !faux, compte + " transitions conformes", faux || compte + " transitions conformes",
     "en particulier `cacheChrono`, qui ne doit sortir que si un voyage était armé");
}
function ctrlTableQuete(M){
  let faux = null;
  for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
    const ctx = { meilleureSonde: () => 2, ouvreLaQuete: true };
    const t = tableUne(M, de, vers, {}, ctx);
    if(!t.objet || !t.ordres || !meme(t.ordres, t.attendus)){
      faux = de + " → " + vers + " : attendu " + cles(t.attendus)
             + ", obtenu " + (t.ordres ? cles(t.ordres) : "rien");
      break;
    }
    if(t.ordres && t.ordres.reaction !== undefined){
      faux = de + " → " + vers + " : la réplique d'arrivée sort quand même";
      break;
    }
  }
  ok("la quête d'accueil musèle la réplique d'arrivée du salon", !faux,
     "aucune `reaction`", faux || "aucune `reaction`",
     "une seule voix à la fois");
}

// ── 5. aller là où l'on est déjà ne doit RIEN faire
function ctrlDiagonale(M){
  const L = M.L;
  for(const ou of LIEUX_ATTENDUS){
    const m = mondeNeuf(ou);
    const avant = jsn(m);
    const r = L.vaAu(m, ou, ctxSonde());
    const objet = !!r && typeof r === "object";
    ok(ou + " → " + ou + " : le monde n'a pas bougé d'un cheveu",
       jsn(m) === avant, "identique", jsn(m) === avant ? "identique" : "MODIFIÉ",
       "sinon on refermerait le panneau sous les doigts du joueur");
    ok(ou + " → " + ou + " : `vaAu` rend un objet, pas `null`", objet,
       "{ de, vers, change, refus, ordres }", objet ? "un objet" : String(r),
       "rendre `null` confondrait « on y était déjà » et « le lieu a refusé »");
    ok(ou + " → " + ou + " : non-événement déclaré comme tel",
       objet && r.change === false && r.refus === "deja-la" && meme(r.ordres, {}),
       "change=false · refus=deja-la · ordres={}",
       objet ? "change=" + r.change + " · refus=" + r.refus + " · ordres=" + cles(r.ordres)
             : "pas d'objet");
  }
  // Le cas qui mord vraiment : au salon, un voyage en cours ne doit pas mourir
  // d'un clic sur le bouton qui n'était censé rien faire.
  const m = mondeNeuf("salon");
  L.vaAu(m, "salon", ctxSonde());
  ok("salon → salon ne tue pas le voyage en cours",
     !!m.telescope.trajet && m.recul.actif === true && m.telescope.ouvert === true,
     "trajet armé · recul actif · instrument ouvert",
     "trajet=" + (m.telescope.trajet ? "armé" : "MORT") + " · recul=" + m.recul.actif
     + " · ouvert=" + m.telescope.ouvert);
}

// ── 6. entrer dans « sonde » sans sonde désignée : refusé, et l'état intact
function ctrlRefusSonde(M){
  const L = M.L;
  for(const de of ["libre", "salon"]){
    for(const [quoi, ctx] of [["aucun contexte", undefined],
                              ["`meilleureSonde` absente", {}],
                              ["`meilleureSonde` rend null", { meilleureSonde: () => null }],
                              ["`meilleureSonde` rend undefined", { meilleureSonde: () => undefined }]]){
      const m = mondeNeuf(de);
      const avant = jsn(m);
      let r = null, jete = null;
      try { r = L.vaAu(m, "sonde", ctx); } catch(e){ jete = e.message; }
      const objet = !!r && typeof r === "object";
      ok(de + " → sonde, " + quoi + " : refusé sans jeter",
         !jete && objet && r.change === false && r.refus === "aucune-sonde"
           && meme(r.ordres, {}),
         "change=false · refus=aucune-sonde · ordres={}",
         jete ? "a jeté : " + jete
              : objet ? "change=" + r.change + " · refus=" + r.refus + " · ordres=" + cles(r.ordres)
                      : "pas d'objet",
         "refuser est le comportement documenté ; jeter ne l'est pas");
      ok(de + " → sonde, " + quoi + " : l'état est laissé exactement où il était",
         jsn(m) === avant, "identique", jsn(m) === avant ? "identique" : "MODIFIÉ");
    }
  }
}

// ── 7. quitter « sonde » vide la sonde suivie
function ctrlQuitteSonde(M){
  const L = M.L;
  for(const vers of ["libre", "salon"]){
    const m = mondeNeuf("sonde");
    const r = L.vaAu(m, vers, ctxSonde());
    ok("sonde → " + vers + " : la sonde suivie est vidée, et le bouton repeint",
       m.sondeSuivie === null && r && r.ordres && r.ordres.boutonSonde === true,
       "sondeSuivie=null · boutonSonde",
       "sondeSuivie=" + m.sondeSuivie + " · ordres=" + (r && r.ordres ? cles(r.ordres) : "?"),
       "sinon l'invariant est faux dès la transition d'après");
  }
  // Et `quitteLieu` appelée seule fait la même chose : c'est la même porte.
  const m = mondeNeuf("sonde");
  const o = L.quitteLieu(m, "sonde");
  ok("`quitteLieu(monde, \"sonde\")` appelée seule vide aussi la sonde",
     m.sondeSuivie === null && o.boutonSonde === true,
     "sondeSuivie=null · boutonSonde", "sondeSuivie=" + m.sondeSuivie + " · " + cles(o));
}

// ── 8. l'hygiène des ordres : jamais faux, jamais inconnu, jamais deux fois
function ctrlOrdres(M){
  const L = M.L;
  const vus = new Set();
  let valeurFausse = null, inconnu = null, surChangeFaux = null, sansBarre = null;
  for(const nu of [false, true])
    for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
      const m = mondeNeuf(de, { nu });
      const r = L.vaAu(m, vers, ctxSonde());
      if(!r || typeof r !== "object" || !r.ordres){ inconnu = de + "→" + vers + " : pas d'ordres"; continue; }
      for(const [k, v] of Object.entries(r.ordres)){
        vus.add(k);
        if(v === false && !valeurFausse) valeurFausse = de + "→" + vers + " : " + k + " = false";
        if(!(k in RANG_ORDRE) && !inconnu) inconnu = de + "→" + vers + " : « " + k + " »";
      }
      const aBarre = r.ordres.barre !== undefined, aCam = r.ordres.majCamera !== undefined;
      if(!r.change && (aBarre || aCam) && !surChangeFaux)
        surChangeFaux = de + "→" + vers + " : des ordres alors que rien n'a changé";
      if(r.change && (!aBarre || !aCam) && !sansBarre)
        sansBarre = de + "→" + vers + " : " + (aBarre ? "" : "barre ") + (aCam ? "" : "majCamera ") + "manquant";
    }
  ok("aucune clé d'ordre ne vaut `false`", !valeurFausse,
     "présente ou absente, jamais false", valeurFausse || "aucune",
     "pour qu'un `if(ordres.x)` suffise à la page");
  ok("aucun ordre inconnu de la page ne sort du module", !inconnu,
     ORDRES_CONNUS.length + " ordres connus", inconnu || "aucun",
     "un ordre neuf que la page n'exécute pas serait un ordre perdu en silence");
  ok("rien ne sort quand rien n'a changé", !surChangeFaux, "ordres={}", surChangeFaux || "ordres={}");
  ok("`barre` et `majCamera` sortent à chaque vraie transition", !sansBarre,
     "les deux", sansBarre || "les deux");

  /* « Jamais deux fois pour une transition » : `vaAu` fusionne les ordres de
     `quitteLieu` et ceux d'`entreLieu` par `Object.assign`. Si les deux jeux
     partageaient une clé, l'un écraserait l'autre SANS BRUIT. On exige donc
     qu'ils soient disjoints, couple par couple. */
  let collision = null;
  for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
    if(de === vers) continue;
    const m = mondeNeuf(de);
    const q = L.quitteLieu(m, de);
    m.lieu = vers;
    const e = L.entreLieu(m, vers, {});
    const communes = Object.keys(q).filter(k => k in e);
    if(communes.length){ collision = de + "→" + vers + " : " + communes.join(", "); break; }
  }
  ok("aucun ordre n'est rendu deux fois dans une même transition", !collision,
     "quitter ∩ entrer = ∅", collision || "quitter ∩ entrer = ∅",
     "sinon `Object.assign` en écraserait un sans bruit");

  const oublies = ORDRES_CONNUS.filter(k => !vus.has(k));
  ok("les huit ordres du contrat sont tous atteignables", oublies.length === 0,
     "aucun oublié", oublies.length ? oublies.join(", ") : "aucun oublié",
     "un ordre que rien ne déclenche est un ordre mort dans la page");
}

// ── 9. l'ordre de traversée, lu dans le journal du jumeau instrumenté
function ctrlJournal(M){
  for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
    const m = mondeNeuf(de);
    M.J.length = 0;
    try { M.LI.vaAu(m, vers, ctxSonde()); } catch(e){ /* dit par l'assertion */ }
    const vu = M.J.slice();
    const attendu = (de === vers) ? [] : ["quitte:" + de, "entre:" + vers];
    ok(de + " → " + vers + " : quitter puis entrer, une seule fois chacun",
       meme(vu, attendu), "[" + attendu.join(", ") + "]", "[" + vu.join(", ") + "]",
       de === vers ? "la diagonale ne traverse NI l'un NI l'autre"
                   : "l'ordre compte : on éteint le lieu qu'on quitte avant d'allumer l'autre");
  }
  // Le refus non plus ne doit rien traverser.
  const m = mondeNeuf("libre");
  M.J.length = 0;
  M.LI.vaAu(m, "sonde", {});
  ok("un refus ne traverse ni `quitteLieu` ni `entreLieu`", M.J.length === 0,
     "[]", "[" + M.J.join(", ") + "]");
}

// ── 10. une seule écriture de `lieu`, mesurée sur un monde à accesseurs
function ctrlEcritureUnique(M){
  const L = M.L;
  let faux = null;
  for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
    const m = mondeEspion(de);
    const r = L.vaAu(m, vers, ctxSonde());
    const attendu = (r && r.change) ? 1 : 0;
    if(m.ecrituresLieu !== attendu){
      faux = de + "→" + vers + " : " + m.ecrituresLieu + " écriture(s) pour change="
             + (r && r.change); break;
    }
  }
  ok("`lieu` n'est écrit qu'une fois par transition, et jamais sur un refus",
     !faux, "1 si change, 0 sinon", faux || "1 si change, 0 sinon",
     "c'est la garantie d'un seul écrivain, mesurée et non supposée");

  // Et l'on refuse SANS écrire : ni le lieu, ni la sonde.
  const m = mondeEspion("libre");
  L.vaAu(m, "sonde", {});
  ok("un refus n'écrit ni `lieu` ni `sondeSuivie`",
     m.ecrituresLieu === 0 && m.ecrituresSonde === 0,
     "0 et 0", m.ecrituresLieu + " et " + m.ecrituresSonde);
}

// ── 11. la barre du bas, pure et fidèle
function ctrlBarre(M){
  const L = M.L;
  for(const ou of LIEUX_ATTENDUS){
    const m = mondeNeuf(ou);
    const avant = jsn(m);
    const b = L.barre(m);
    ok("barre(" + ou + ") : `auSalon` suit le lieu", !!b && b.auSalon === (ou === "salon"),
       String(ou === "salon"), b ? String(b.auSalon) : "rien");
    ok("barre(" + ou + ") : la clé de texte suit `auSalon`",
       !!b && b.cle === (ou === "salon" ? "dock.salon.quitter" : "dock.salon"),
       ou === "salon" ? "dock.salon.quitter" : "dock.salon", b ? b.cle : "rien");
    ok("barre(" + ou + ") ne touche à rien", jsn(m) === avant,
       "identique", jsn(m) === avant ? "identique" : "MODIFIÉ",
       "la barre reflète le lieu, elle ne le décide pas");
  }
}

// ── 12. la garde `typeof meilleureSonde === "function"`, et l'indice zéro
function ctrlGarde(M){
  const L = M.L;
  for(const [quoi, ctx] of [["absent", {}],
                            ["un nombre", { meilleureSonde: 3 }],
                            ["une chaîne", { meilleureSonde: "2" }],
                            ["nul", { meilleureSonde: null }]]){
    const m = mondeNeuf("libre");
    let r = null, jete = null;
    try { r = L.vaAu(m, "sonde", ctx); } catch(e){ jete = e.message; }
    ok("`meilleureSonde` " + quoi + " : on refuse au lieu de jeter",
       !jete && r && r.refus === "aucune-sonde" && m.lieu === "libre",
       "refus aucune-sonde", jete ? "a JETÉ : " + jete : (r ? r.refus : "rien"));
  }
  // La sonde d'indice ZÉRO est une vraie sonde. Un `if(!i)` la refuserait.
  {
    const m = mondeNeuf("libre");
    const r = L.vaAu(m, "sonde", { meilleureSonde: () => 0 });
    ok("la sonde d'indice 0 est acceptée",
       !!r && r.change === true && m.lieu === "sonde" && m.sondeSuivie === 0,
       "sonde · sondeSuivie=0", (r ? "change=" + r.change + " · " : "") + m.lieu
       + " · sondeSuivie=" + m.sondeSuivie,
       "un test de vérité au lieu d'un test de nullité interdirait la première sonde");
  }
  // Et l'on ne la consulte pas quand on en a déjà une (le chemin d'`embarque`).
  {
    const m = mondeNeuf("libre");
    m.sondeSuivie = null;
    let appels = 0;
    L.vaAu(m, "sonde", { meilleureSonde: () => { appels++; return 5; } });
    ok("`meilleureSonde` n'est consultée qu'une fois quand il le faut", appels === 1,
       "1 appel", appels + " appel(s)");
  }
  {
    const m = mondeNeuf("salon");
    m.sondeSuivie = 7;                      // ce que fait `embarque` avant d'appeler
    let appels = 0;
    L.vaAu(m, "sonde", { meilleureSonde: () => { appels++; return 5; } });
    ok("`meilleureSonde` n'est pas consultée quand une sonde est déjà désignée",
       appels === 0 && m.sondeSuivie === 7, "0 appel · sondeSuivie=7",
       appels + " appel(s) · sondeSuivie=" + m.sondeSuivie,
       "`embarque` pose la sonde AVANT d'appeler : le module ne doit pas la remplacer");
  }
  // `e` peut être omis, partout.
  {
    let jete = null;
    try {
      const m = mondeNeuf("libre");
      L.vaAu(m, "salon");
      L.entreLieu(m, "salon");
    } catch(e){ jete = e.message; }
    ok("le contexte peut être omis sans que rien ne jette", !jete,
       "aucune exception", jete ? "a JETÉ : " + jete : "aucune exception");
  }
}

// ── 13. la séquence : vingt et quelques transitions au hasard, reproductibles
function ctrlSequence(M){
  const L = M.L;
  const rnd = alea(GRAINE);
  const m = mondeEspion("libre");
  let faux = null, pas = 0;
  const TOTAL = 240;
  for(let k = 0; k < TOTAL; k++){
    const vers = LIEUX_ATTENDUS[Math.floor(rnd() * LIEUX_ATTENDUS.length)];
    const dispo = rnd() < 0.6;
    const ctx = { meilleureSonde: dispo ? () => Math.floor(rnd() * 4) : () => null,
                  ouvreLaQuete: rnd() < 0.2 };
    const de = m.lieu;
    m.ecrituresLieu = 0;
    let r = null;
    try { r = L.vaAu(m, vers, ctx); } catch(e){ faux = "étape " + k + " : a jeté — " + e.message; break; }
    pas++;
    if(!r || typeof r !== "object"){ faux = "étape " + k + " : `vaAu` n'a pas rendu d'objet"; break; }
    const mal = premierFaux(m, L);
    if(mal){ faux = "étape " + k + " (" + de + " → " + vers + ") : " + mal; break; }
    if(m.ecrituresLieu !== (r.change ? 1 : 0)){
      faux = "étape " + k + " (" + de + " → " + vers + ") : " + m.ecrituresLieu
             + " écriture(s) de `lieu` pour change=" + r.change; break;
    }
    /* Les autres domaines continuent de vivre entre deux transitions : au salon
       on arme parfois un voyage, en vue libre le plan d'ouverture repart. C'est
       ce qui donne à `quitteLieu` quelque chose à éteindre au tour suivant. */
    if(m.lieu === "salon" && rnd() < 0.5){
      m.telescope.trajet = trajetFactice();
      m.telescope.retour = rnd() < 0.5;
      m.telescope.ouvert = rnd() < 0.5;
      m.recul.actif = true;
    }
    if(m.lieu === "libre" && rnd() < 0.3) m.cinema.actif = true;
  }
  ok("une séquence de " + TOTAL + " transitions tient les huit invariants à CHAQUE pas",
     !faux, TOTAL + " pas", faux || (pas + " pas"),
     "graine " + GRAINE + " — écrite dans le fichier, jamais tirée : un échec se rejoue");
}

/* ══════════════════════════════════════════════════════════════════════════════
   LA COURSE SUR LE MODULE SAIN
   ══════════════════════════════════════════════════════════════════════════════ */

groupe("Le contrat de surface");
ctrlContrat(SAIN);

/* Le module ne doit RIEN lire de la page. Le seul `window` du fichier est
   l'argument de l'IIFE, à la dernière ligne. On enlève les commentaires avant
   de compter — l'en-tête, lui, parle de `document` et de `TELESCOPE` à longueur
   de paragraphe, et c'est très bien. */
{
  const code = SRC.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
  const fenetres = code.match(/\bwindow\b/g) || [];
  ok("le corps du module ne lit `window` qu'une fois, à la dernière ligne",
     fenetres.length === 1 && /\}\)\(\s*window\s*\)\s*;?\s*$/.test(code.trim()),
     "1 occurrence, en clôture d'IIFE", fenetres.length + " occurrence(s)",
     "un outil doit pouvoir passer un objet nu à la place");
  const fuites = ["document", "TELESCOPE", "RECUL", "ETOILES_S", "salon\\.actif"]
    .filter(x => new RegExp("\\b" + x + "\\b").test(code));
  ok("le corps du module ne nomme aucun objet de la page", fuites.length === 0,
     "aucun", fuites.length ? fuites.join(", ") : "aucun",
     "tout arrive en argument : c'est ce qui rend ce fichier mesurable ici");
}

/* Le jumeau instrumenté doit être le MÊME module, sinon les contrôles d'ordre
   mesureraient autre chose que ce qui tourne dans la page. */
{
  let ecart = null;
  for(const de of LIEUX_ATTENDUS) for(const vers of LIEUX_ATTENDUS){
    const a = mondeNeuf(de), b = mondeNeuf(de);
    const ra = SAIN.L.vaAu(a, vers, ctxSonde());
    SAIN.J.length = 0;
    const rb = SAIN.LI.vaAu(b, vers, ctxSonde());
    if(!meme(ra, rb) || jsn(a) !== jsn(b)){ ecart = de + " → " + vers; break; }
  }
  ok("le jumeau instrumenté se comporte exactement comme l'original", !ecart,
     "aucun écart sur les 9", ecart || "aucun écart sur les 9",
     "sans quoi le journal parlerait d'un module qui n'est pas celui du disque");
}

groupe("L'invariant central — sens 1 : à bord, on a une sonde");
ctrlFaceLieuVersSonde(SAIN);

groupe("L'invariant central — sens 2 : une sonde veut dire qu'on est à bord");
ctrlFaceSondeVersLieu(SAIN);

groupe("Les neuf transitions — arrivée, réponse, ordres");
const TABLE = ctrlTableChargee(SAIN);

groupe("Les neuf transitions — les deux autres états de départ");
ctrlTableNue(SAIN);
ctrlTableQuete(SAIN);

groupe("Les neuf transitions — les huit invariants après chacune");
ctrlInvariantsApresChaque(SAIN);

groupe("Les neuf transitions — quitter puis entrer, une seule fois chacun");
ctrlJournal(SAIN);

groupe("Aller là où l'on est déjà ne doit rien faire");
ctrlDiagonale(SAIN);

groupe("Entrer sur une sonde qu'on n'a pas doit être refusé");
ctrlRefusSonde(SAIN);

groupe("Quitter « sonde » vide la sonde suivie");
ctrlQuitteSonde(SAIN);

groupe("Les ordres — un ordre ne sort que quand il a lieu d'être");
ctrlOrdres(SAIN);

groupe("Un seul écrivain pour `lieu`");
ctrlEcritureUnique(SAIN);

groupe("La barre du bas");
ctrlBarre(SAIN);

groupe("La garde sur `meilleureSonde`");
ctrlGarde(SAIN);

groupe("La séquence, au hasard mais reproductible");
ctrlSequence(SAIN);

/* ══════════════════════════════════════════════════ LA TABLE, IMPRIMÉE POUR L'ŒIL

   Ce n'est pas un contrôle : c'est ce qui se relit avant de brancher. Les neuf
   couples, ce que chacun fait, et dans quel ordre la page doit l'exécuter. */
{
  console.log("\n  Les neuf transitions, telles que constatées");
  console.log("  ──────────────────────────────────────────");
  console.log("        (départ chargé : au salon un voyage armé, un recul en cours,");
  console.log("         l'instrument ouvert ; en vue libre le plan d'ouverture)\n");
  for(const [de, vers, t] of TABLE){
    const o = t.ordres || {};
    const liste = Object.keys(o).sort((a, b) => RANG_ORDRE[a] - RANG_ORDRE[b])
      .map(k => k === "barre" ? "barre(" + (o.barre && o.barre.auSalon ? "au salon" : "dehors") + ")"
                              : k === "reaction" ? 'reaction:"' + o.reaction + '"' : k);
    const etat = t.r && t.r.change
      ? "→ " + t.m.lieu + ", sondeSuivie=" + t.m.sondeSuivie
      : "rien (" + (t.r ? t.r.refus : "?") + ")";
    console.log("    " + (de + " → " + vers).padEnd(18) + etat.padEnd(30)
                + (liste.length ? liste.join("  ") : "aucun ordre"));
  }
}

/* ══════════════════════════════════════════════════════════════════════════════
   ÉPROUVÉ FAILLIBLE — TREIZE SABOTAGES

   Chacun réécrit UN endroit dans une copie en mémoire du source, recharge le
   module mutant, rejoue en silence le groupe visé, et exige qu'il tombe. Le
   fichier sur le disque n'est jamais touché.
   ══════════════════════════════════════════════════════════════════════════════ */

function variante(motif, remplacement){
  const global = new RegExp(motif.source, motif.flags.includes("g") ? motif.flags : motif.flags + "g");
  const trouves = SRC.match(global);
  if(!trouves) return { erreur: "motif introuvable dans le source : " + motif };
  if(trouves.length !== 1)
    return { erreur: "motif trouvé " + trouves.length + " fois, il en faut une : " + motif };
  const mute = SRC.replace(motif, remplacement);
  if(mute === SRC) return { erreur: "le remplacement n'a rien changé : " + motif };
  return batir(mute);
}

function essaie(nom, v, controles, note){
  if(v.erreur){
    ok("le sabotage « " + nom + " » se construit encore", false,
       "un module mutant", v.erreur,
       "si le source a changé de forme, ce sabotage doit être RÉÉCRIT — pas supprimé, "
       + "sans quoi le contrôle qu'il éprouve n'est plus éprouvé");
    return;
  }
  carnet = [];
  try { for(const f of controles) f(v); }
  catch(err){ carnet.push({ nom: "exception : " + err.message, vrai: false }); }
  const lot = carnet; carnet = null;
  const tombes = lot.filter(c => !c.vrai);
  ok(nom, tombes.length > 0, "au moins un contrôle tombe",
     tombes.length + " tombés sur " + lot.length,
     tombes.length ? "→ " + tombes.slice(0, 2).map(c => c.nom).join(" ; ")
                   : "AUCUN — le groupe visé ne surveille donc rien"
                     + (note ? ". " + note : ""));
}

groupe("Éprouvé faillible — treize modules cassés exprès");

/* ── 1. LE PREMIER DES TROIS. La sonde n'est pas effacée en quittant « sonde ».
   L'équivalence devient fausse dès la transition suivante, et l'on se retrouve
   au salon en « suivant » une sonde qu'on ne voit plus. */
essaie("un `quitteLieu` qui n'efface pas la sonde en quittant « sonde »",
       variante(/monde\.sondeSuivie = null;/, "/* effacement retiré */;"),
       [ctrlFaceSondeVersLieu, ctrlQuitteSonde, ctrlInvariantsApresChaque, ctrlSequence]);

/* ── 2. LE DEUXIÈME. La précondition d'entrée saute : on entre sur une sonde
   qu'on n'a pas, et `lieu === "sonde"` avec `sondeSuivie === null` — exactement
   l'état que l'invariant déclare impossible. */
essaie("un `vaAu` sans la précondition d'entrée sur « sonde »",
       variante(/vers === "sonde" && monde\.sondeSuivie === null/, "false"),
       [ctrlRefusSonde, ctrlFaceLieuVersSonde, ctrlInvariantsApresChaque, ctrlSequence]);

/* ── 3. LE TROISIÈME. La diagonale devient une vraie transition : au salon, le
   bouton qui n'était censé rien faire tue le voyage en cours. */
essaie("un `vaAu` qui traite « aller là où l'on est déjà » comme une transition",
       variante(/if\(vers === de\) return \{/, "if(false) return {"),
       [ctrlDiagonale, ctrlTableChargee, ctrlJournal]);

/* ── 4. L'ORDRE DE TRAVERSÉE INVERSÉ. On entre avant d'être sorti. Les ordres
   rendus sont les MÊMES : seul le journal le voit. */
essaie("un `vaAu` qui entre avant de quitter",
       variante(/const ordres = quitteLieu\(monde, de\);([\s\S]*?)Object\.assign\(ordres, entreLieu\(monde, vers, ctx\)\);/,
                "const ordres = entreLieu(monde, vers, ctx);$1Object.assign(ordres, quitteLieu(monde, de));"),
       [ctrlJournal],
       "les ordres rendus sont identiques ; seul le journal peut le voir");

/* ── 5. LE VOYAGE QUI SURVIT. Le défaut d'origine, celui qui a été payé une
   fois : un trajet armé pour toujours, sans jamais avancer. */
essaie("un `quitteLieu` qui laisse le voyage armé en sortant du salon",
       variante(/monde\.telescope\.trajet = null;/, "/* trajet laissé armé */;"),
       [ctrlInvariantsApresChaque, ctrlSequence]);

/* ── 6. LE PLAN D'OUVERTURE QUI SURVIT à une prise de commande. */
essaie("un `entreLieu` qui n'interrompt pas le plan d'ouverture",
       variante(/if\(nouveau !== "libre"\) monde\.cinema\.actif = false;/, ";"),
       [ctrlInvariantsApresChaque, ctrlSequence]);

/* ── 7. L'INSTRUMENT QUI RESTE OUVERT en quittant le salon. */
essaie("un `quitteLieu` qui laisse l'instrument ouvert",
       variante(/monde\.telescope\.ouvert = false;/, ";"),
       [ctrlInvariantsApresChaque, ctrlSequence]);

/* ── 8. LA BARRE QUI MENT. Elle reflète le lieu, elle ne le décide pas — mais
   si elle le reflète mal, la page peint « quitter le salon » en vue libre. */
essaie("une `barre` qui s'allume sur le mauvais lieu",
       variante(/const auSalon = monde\.lieu === "salon";/,
                'const auSalon = monde.lieu === "sonde";'),
       [ctrlBarre, ctrlTableChargee, ctrlInvariantsApresChaque]);

/* ── 9. UN ORDRE QUI SORT SANS AVOIR LIEU D'ÊTRE. `cacheChrono` part même quand
   aucun voyage n'était armé : la page retire une classe qu'elle n'a pas mise. */
essaie("un `quitteLieu` qui cache le chronomètre même sans voyage",
       variante(/if\(monde\.telescope\.trajet\)\{/, "if(true){"),
       [ctrlTableNue]);

/* ── 10. LA RÉPLIQUE QUI PARLE PAR-DESSUS LA QUÊTE D'ACCUEIL. */
essaie("un `entreLieu` qui parle malgré la quête d'accueil",
       variante(/if\(!ctx\.ouvreLaQuete\) ordres\.reaction = "salon";/,
                'ordres.reaction = "salon";'),
       [ctrlTableQuete]);

/* ── 11. `vaAu` QUI REND `null` SUR LA DIAGONALE. Rendre `null` confondrait
   « on y était déjà » et « le lieu a refusé qu'on y entre ». */
essaie("un `vaAu` qui rend `null` au lieu d'un non-événement",
       variante(/return \{ de, vers, change: false, refus: "deja-la", ordres: \{\} \};/,
                "return null;"),
       [ctrlDiagonale, ctrlTableChargee]);

/* ── 12. DEUX ÉCRITURES POUR UNE TRANSITION. La maladie même que cette
   fondation existe pour empêcher. Rien ne casse : seul le compteur le voit. */
essaie("un `vaAu` qui écrit `lieu` deux fois",
       variante(/monde\.lieu = vers;/, "monde.lieu = vers; monde.lieu = vers;"),
       [ctrlEcritureUnique],
       "rien ne casse quand on écrit deux fois la même valeur : seul un compteur le voit");

/* ── 13. LA SONDE D'INDICE ZÉRO REFUSÉE, par un test de vérité au lieu d'un
   test de nullité. La première sonde du tableau deviendrait inembarquable. */
essaie("un `vaAu` qui prend l'indice 0 pour une absence de sonde",
       variante(/if\(i === null \|\| i === undefined\)/, "if(!i)"),
       [ctrlGarde]);

/* ══════════════════════════════════════════════ CE QUI EST SIGNALÉ ET NON CORRIGÉ

   Cet outil n'écrit pas dans `lieux.js`. Ce qui suit n'est pas compté comme un
   échec : ce ne sont pas des contrats trahis, ce sont des décisions à prendre
   par qui tient le module. Chacun porte l'assertion qu'il n'y aurait qu'à armer.
   ══════════════════════════════════════════════════════════════════════════════ */
{
  console.log("\n  Constats — signalés, non corrigés, non comptés");
  console.log("  ─────────────────────────────────────────────\n");

  // 1. `vaAu` n'a pas de liste blanche — l'en-tête du module l'annonce déjà.
  {
    const m = mondeNeuf("libre");
    const r = SAIN.L.vaAu(m, "telescope", ctxSonde());
    if(r && r.change && m.lieu === "telescope"){
      console.log("  ⚠   `vaAu` n'a pas de liste blanche. `vaAu(monde, \"telescope\")` pose");
      console.log("        `monde.lieu = \"telescope\"` sans un mot, ce que l'invariant 1 déclare");
      console.log("        impossible. C'est reproduit tel quel depuis la page, et `verif.js`");
      console.log("        en dépend pour tourner trois cents images dans cet état avant de");
      console.log("        restaurer. Les huit invariants ci-dessus ne valent donc que pour");
      console.log("        `vers` pris dans les trois lieux connus.");
      console.log("        L'assertion à armer le jour où la liste blanche arrive :");
      console.log("            ok(\"un lieu inconnu est refusé\",");
      console.log("               r.refus === \"lieu-inconnu\" && m.lieu === \"libre\", …);");
      console.log("");
    }
  }

  // 2. Le recul survit à la sortie du salon quand aucun trajet n'est armé.
  {
    const m = mondeNeuf("salon", { nu: true });
    m.recul.actif = true;                    // recul en cours, trajet nul
    SAIN.L.vaAu(m, "libre", ctxSonde());
    if(m.recul.actif){
      console.log("  ⚠   Le recul survit à la sortie du salon quand aucun trajet n'est armé.");
      console.log("        `RECUL.etat.actif = false` vit DANS le `if(monde.telescope.trajet)`,");
      console.log("        alors que `telescope.ouvert = false` en est sorti. Un salon avec");
      console.log("        `recul.actif` vrai et `trajet` nul quitté vers la vue libre laisse");
      console.log("        donc l'invariant 4 faux — et c'est justement l'invariant que");
      console.log("        `VERIF.lieux()` éprouve dans la page.");
      console.log("        Ce n'est pas atteignable aujourd'hui : `RECUL.lance()` n'est appelée");
      console.log("        que dans les deux lignes qui viennent d'armer `TELESCOPE.trajet`,");
      console.log("        et le recul s'éteint tout seul avant l'arrivée. C'est pour cela que");
      console.log("        ce cas ne compte pas comme un échec — mais la salle de tir, qui");
      console.log("        aura son propre recul, refermera ce piège sur elle.");
      console.log("        L'assertion à armer le jour où la ligne sort du `if` :");
      console.log("            ok(\"le recul meurt avec le salon, trajet ou pas\",");
      console.log("               !m.recul.actif, …);");
      console.log("");
    }
  }

  // 3. `fermeInstrument` sort même quand rien n'était ouvert.
  {
    const m = mondeNeuf("salon", { nu: true });
    const r = SAIN.L.vaAu(m, "libre", ctxSonde());
    if(r.ordres.fermeInstrument && !r.ordres.cacheChrono){
      console.log("  ⚠   `fermeInstrument` sort même quand l'instrument était déjà fermé.");
      console.log("        C'est le seul des huit ordres qui ne respecte pas « un ordre ne sort");
      console.log("        que quand il a lieu d'être » — `cacheChrono`, lui, est bien sous");
      console.log("        condition. Sans effet (la page retire une classe absente), signalé");
      console.log("        dans l'en-tête du module, et donc encodé comme tel dans la table de");
      console.log("        ce contrôle. Le jour où il passe sous condition, c'est ici qu'il");
      console.log("        faut changer `ordresAttendus`, pas ailleurs.");
      console.log("");
    }
  }

  // 4. La carte des étoiles et le quadrillage survivent à la sortie du salon.
  {
    const m = mondeNeuf("salon");
    SAIN.L.vaAu(m, "libre", ctxSonde());
    if(m.telescope.carte || m.telescope.grille){
      console.log("  ⚠   `telescope.carte` et `.grille` survivent à la sortie du salon.");
      console.log("        Le fondu vers la carte des étoiles n'est éteint par aucune branche ;");
      console.log("        seuls `trajet` et `retour` le sont. La page le rattrape ailleurs, à");
      console.log("        l'image. Aucun des huit invariants ne le couvre — c'est un choix,");
      console.log("        pas un oubli, et il est écrit dans l'en-tête du module.");
      console.log("");
    }
  }

  // 5. Ce que la page éprouve et que cet outil ne peut pas éprouver.
  console.log("  ⚠   `salon.actif` n'est pas vérifiable ici, et ne le sera jamais.");
  console.log("        `VERIF.lieux()` éprouve, dans la page, que `salon.actif` suit `lieu`.");
  console.log("        C'est un accesseur de la page dont le `set` rappelle `vaAu` ; le module");
  console.log("        ne l'écrit jamais et ne la voit pas. Le seul reflet mesurable d'ici est");
  console.log("        `barre(monde).auSalon`, qui est le descripteur que la page PEINT.");
  console.log("        Restent aussi attachés au navigateur : qu'un voyage s'arme vraiment");
  console.log("        par `lanceVoyage()`, et que `meilleureSonde()` soit branchée sur le");
  console.log("        vrai tableau `sondes`. Ces deux-là doivent rester dans `VERIF.lieux()`.");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
