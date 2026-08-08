/* ============================================================================
   L'ACCUEIL — LES CHEMINS D'ENTRÉE, ÉPROUVÉS SANS PAGE

       node outil-verif-accueil.js

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL EXISTE

   L'accueil est le seul domaine du site que personne ne regarde jamais. Il ne
   se joue qu'une fois par visiteur — et dès le deuxième rechargement, la
   mémoire porte `deja`, l'écran d'entrée mène droit au menu, et le premier
   passage devient invisible à celui qui développe. Les chemins du premier
   arrivant sont donc exactement ceux que personne n'a éprouvés, et ce sont les
   seuls que voit un testeur qui reçoit un lien.

   Quatre chemins au moins, aucun visité jusqu'ici :

       premier passage / avec la voix      premier passage / en silence
       déjà venu       / avec la voix      déjà venu       / en silence

   Ils sont joués ici de bout en bout, du choix de la langue jusqu'à la porte
   de départ, sans qu'un pixel soit dessiné et sans rien écrire nulle part.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ  (règle 3)

   Surtout pas d'`accueil.js` recopié en face de lui-même. Quatre sources, toutes
   extérieures au module :

   1. `index.html`, le code que ce module remplace. Ses vingt et une clés de
      libellé, relevées au caractère près (`CLES_PAGE` ci-dessous), disent ce que
      l'accueil est censé dire. Si le module en invente une, en oublie une, ou en
      traduit une lui-même, l'écart se voit ici et nulle part ailleurs.
   2. `ui.fr.js` et `ui.en.js`, les deux tables de langue. Une clé produite par
      le module et absente d'une des deux s'affiche en identifiant nu à l'écran —
      et seulement dans une langue, donc seulement pour quelqu'un d'autre.
   3. `contenu.js` et `contenu.en.js`, qui portent les niveaux, leurs libellés,
      les expériences et la présentation. Les parcours se jouent sur les VRAIES
      listes, pas sur des listes inventées qui s'accorderaient avec le module.
   4. `progression.js`, l'autre module de ce domaine. C'est lui qui lit la
      mémoire et qui filtre les valeurs ; l'outil enchaîne les deux modules pour
      voir ce qui arrive réellement à l'accueil quand la mémoire est pourrie.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le dernier groupe casse le module en mémoire — six sabotages, les uns par
   enveloppe, les autres sur une copie EN MÉMOIRE du source, jamais sur le
   fichier — et exige que le contrôle correspondant TOMBE. Un sabotage qui ne
   fait tomber que des contrôles déjà rouges ne compte pas : on compare à un
   relevé de référence pris sur le module intact.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS

   Rien de ce que la page PEINT : qu'une carte s'affiche, qu'une classe tombe,
   que le fondu de la présentation soit joli. Cela se juge à l'œil. Ce qui est
   mesuré ici, c'est la DÉCISION : qui arrive, ce qu'on lui montre, dans quel
   ordre, et ce qu'on range.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN = path.join(ICI, "accueil.js");

console.log("\n  L'ACCUEIL — QUI ARRIVE, ET CE QU'ON LUI MONTRE");
console.log("  ═════════════════════════════════════════════");

/* Quand `carnet` n'est pas nul, `ok()` range au lieu d'imprimer : c'est ce qui
   permet de rejouer les mêmes contrôles sur un module saboté sans salir la
   sortie, et sans réécrire les assertions — ce qui reviendrait à saboter aussi
   le contrôle du sabotage. */
let n = 0, echecs = 0, carnet = null;
const groupe = t => { if(!carnet) console.log("\n  " + t + "\n  " + "─".repeat(t.length)); };
function ok(nom, vrai, attendu, mesure, note){
  if(carnet){ carnet.push({ nom, vrai: !!vrai }); return; }
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
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
   échouer.                                                                    */
if(!fs.existsSync(CHEMIN))
  stop("accueil.js n'existe pas — RIEN N'A ÉTÉ MESURÉ", [
    "Cet outil est la condition du branchement du module dans la page.",
    "Tant que le fichier manque, il refuse de conclure.",
  ]);

const SRC = fs.readFileSync(CHEMIN, "utf8");

/* Le module ne doit toucher NI au DOM, NI à la mémoire du navigateur, NI à la
   langue du navigateur : tout cela lui ARRIVE. On ne le lui demande pas
   gentiment — on empoisonne les noms. Toute lecture d'une propriété de
   `document`, de `localStorage` ou de `navigator` lève, au chargement comme à
   l'usage, et le contrôle qui l'a déclenchée tombe.

   `navigator` est dans la liste et ce n'est pas décoratif : la langue du
   navigateur est précisément ce que ce domaine consulte, et c'est précisément
   ce qu'il ne doit pas aller chercher tout seul. */
const NOMS_INTERDITS = ["document", "localStorage", "sessionStorage", "navigator",
                        "location", "alert", "fetch", "XMLHttpRequest",
                        "requestAnimationFrame", "setTimeout", "setInterval"];
function poison(nom){
  const boum = cle => { throw new Error("le module a touché `" + nom
                                        + (cle ? "." + String(cle) : "()") + "`"); };
  return new Proxy(function(){}, { get: (_, cle) => boum(cle), apply: () => boum(null) });
}
function chargeEmpoisonne(src){
  const bac = {};
  new Function("window", "global", "globalThis", "self", ...NOMS_INTERDITS, src)
    (bac, bac, bac, bac, ...NOMS_INTERDITS.map(poison));
  return bac;
}
function chargeModule(src){ return chargeEmpoisonne(src).ACCUEIL || null; }

let A;
try { A = chargeModule(SRC); }
catch(err){
  stop("accueil.js ne se charge pas hors navigateur — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "",
    "Le module doit pouvoir s'évaluer sans DOM, sans `localStorage` et sans",
    "`navigator`. C'est ce qui rend tous les modules du dépôt vérifiables en",
    "ligne de commande.",
  ]);
}
if(!A) stop("accueil.js s'est chargé mais n'expose pas `ACCUEIL`", [
  "attendu   global.ACCUEIL = { … }",
]);

/* ─────────────────────────────────── LES SOURCES EXTÉRIEURES */
const chargeFichier = (f, dansQuoi) => {
  const w = dansQuoi || {};
  new Function("window", fs.readFileSync(path.join(ICI, f), "utf8"))(w);
  return w;
};
const CONTENU    = chargeFichier("contenu.js").CONTENU;
const CONTENU_EN = chargeFichier("contenu.en.js").CONTENU;
// `ui.en.js` SURCHARGE `ui.fr.js` : il faut donc charger le français d'abord,
// dans le même sac, exactement comme la page le fait.
const UI_FR = chargeFichier("ui.fr.js").UI;
const UI_EN = chargeFichier("ui.en.js", chargeFichier("ui.fr.js")).UI;

if(!CONTENU || !Array.isArray(CONTENU.niveaux) || !Array.isArray(CONTENU.niveauxLibelle)
   || !Array.isArray(CONTENU.experiences) || !CONTENU.accueil)
  stop("contenu.js ne porte pas l'accueil — RIEN N'A ÉTÉ MESURÉ", [
    "Les parcours se jouent sur les VRAIES listes : niveaux, libellés,",
    "expériences et présentation. Une liste inventée s'accorderait avec le",
    "module au lieu de l'arbitrer.",
  ]);
if(!UI_FR || !UI_EN)
  stop("les tables de langue ne se chargent pas — RIEN N'A ÉTÉ MESURÉ", [
    "`ui.fr.js` et `ui.en.js` arbitrent les clés de libellé du module.",
  ]);

const NIVEAUX      = CONTENU.niveaux;
const LIBELLES     = CONTENU.niveauxLibelle;
const EXPERIENCES  = CONTENU.experiences.filter(x => x.id !== "jumeaux");   // comme la page
const PRESENTATION = (CONTENU.accueil && CONTENU.accueil.presentation) || [];
const MISSIONS     = (CONTENU.missions || []).filter(m => m.id !== "m-jumeaux" && m.id !== "m-bord");

/* Les vingt et une clés de libellé de l'accueil, relevées dans `index.html` le
   8 août 2026 par
       grep -o '"\(accueil\|pr\)\.[a-zA-Z0-9._-]*"' index.html | sort -u

   Elles sont écrites ICI plutôt que relues à chaque exécution, pour une raison
   simple : le jour où la page sera recousue autour du module, elles
   disparaîtront d'`index.html`. Un arbitre qui s'efface au moment où l'on
   branche n'arbitre rien. La liste reste donc, datée, et c'est elle qui décide
   si le remplacement est interchangeable.                                     */
const CLES_PAGE = [
  "accueil.titre", "accueil.entrer.voix", "accueil.entrer.muet",
  "accueil.niveau.titre",
  "accueil.depart.titre", "accueil.depart.chapo",
  "accueil.porte.libre.titre", "accueil.porte.libre.detail",
  "accueil.porte.salon.titre", "accueil.porte.salon.detail",
  "accueil.porte.missions.titre", "accueil.porte.missions.detail",
  "accueil.reprise", "accueil.reprise.un", "accueil.chapo",
  "accueil.oubli", "accueil.commencer", "accueil.retour",
  "pr.passer", "pr.suivant", "pr.entrer",
];
const CHEMINS_CONTENU = ["accueil.bienvenue", "accueil.niveau"];

/* ─────────────────────────────────── LA FAUSSE MÉMOIRE DE LA LANGUE

   Un sac, une clé, du TEXTE BRUT dedans — la langue n'est pas rangée en JSON
   dans la page, c'est une chaîne nue. Reproduire ça compte : `JSON.parse` d'une
   chaîne nue lèverait, et un adaptateur trop malin masquerait le vrai
   comportement.                                                               */
const CLE_LANGUE = "periastre.langue";      // relevée dans index.html
function memoireLangue(texte){
  const sac = Object.create(null);
  if(texte !== undefined) sac[CLE_LANGUE] = texte;
  const m = {
    lectures: 0, ecritures: 0,
    lit(){ m.lectures++; const t = sac[CLE_LANGUE]; return t === undefined ? null : t; },
    ecrit(c){ m.ecritures++; sac[CLE_LANGUE] = String(c); },
    get texte(){ return sac[CLE_LANGUE]; },
  };
  return m;
}
// L'adaptateur de la navigation privée : il avale et rend la main sans rien dire.
function memoireMuette(){
  const m = { lectures: 0, ecritures: 0,
    lit(){ m.lectures++; try { throw new Error("privé"); } catch(_){ return null; } },
    ecrit(){ m.ecritures++; try { throw new Error("privé"); } catch(_){ } } };
  return m;
}

/* ─────────────────────────────────── LES OUTILS DE LECTURE DES DESCRIPTEURS */

// Toutes les clés de libellé d'un descripteur, à n'importe quelle profondeur.
function cles(o, sortie){
  sortie = sortie || new Set();
  if(!o || typeof o !== "object") return sortie;
  if(typeof o.cle === "string") sortie.add(o.cle);
  for(const k of Object.keys(o)) cles(o[k], sortie);
  return sortie;
}
// Idem pour les chemins dans `contenu.js`.
function cheminsContenu(o, sortie){
  sortie = sortie || new Set();
  if(!o || typeof o !== "object") return sortie;
  if(typeof o.contenu === "string") sortie.add(o.contenu);
  for(const k of Object.keys(o)) cheminsContenu(o[k], sortie);
  return sortie;
}
// Toutes les chaînes portées par un descripteur, pour traquer une traduction.
function chaines(o, sortie){
  sortie = sortie || [];
  if(typeof o === "string"){ sortie.push(o); return sortie; }
  if(!o || typeof o !== "object") return sortie;
  for(const k of Object.keys(o)) chaines(o[k], sortie);
  return sortie;
}
/* Ce qui ne doit jamais sortir d'un calcul : un nombre non fini, ou une chaîne
   qui trahit un `undefined` recollé. On ne cherche pas « NaN » dans du texte
   pédagogique — seulement les valeurs EXACTES qui signent l'accident. */
function malsain(o, chemin, sortie){
  sortie = sortie || []; chemin = chemin || "·";
  if(typeof o === "number" && !Number.isFinite(o)) sortie.push(chemin + " = " + o);
  else if(typeof o === "string" && (o === "undefined" || o === "NaN" || o.indexOf("[object ") >= 0))
    sortie.push(chemin + " = " + JSON.stringify(o));
  else if(o && typeof o === "object")
    for(const k of Object.keys(o)) malsain(o[k], chemin + "." + k, sortie);
  return sortie;
}
const resous = (racine, chemin) =>
  chemin.split(".").reduce((o, k) => (o === undefined || o === null) ? undefined : o[k], racine);
const memeEnsemble = (a, b) => [...a].length === [...b].length
  && [...a].sort().join("|") === [...b].sort().join("|");

/* ═════════════════════════════════════════════════ LE PARCOURS D'ENTRÉE COMPLET

   Un chemin d'entrée joué du premier octet lu jusqu'à la porte de départ. Le
   pilote suit EXACTEMENT l'enchaînement de la page — langue, restauration,
   écran d'entrée, clic, présentation, embarquement, quête (jouée ailleurs),
   question du niveau, portes — et il note tout ce qui sort.

   Il ne connaît aucune des réponses : il ne fait qu'appeler et ranger. Ce sont
   les contrôles qui jugent, plus bas, contre les listes relevées ailleurs.    */
function parcours(A, e){
  e = e || {};
  const etat = A.etatNeuf();
  const journal = [];
  const rangements = [];
  const pose = (etape, o) => { journal.push({ etape, o }); return o; };

  pose("langue", A.langue({ memoire: memoireLangue(e.langueRangee),
                            navigateur: e.navigateur }));
  /* `iNiveau` est ce que la PAGE a en main à cet instant, c'est-à-dire ce que
     `progression.js` a bien voulu relire : un champ qui rate son contrôle de
     type n'est pas reposé, et la valeur du code — zéro — reste en place. Le
     pilote reproduit ce filtre plutôt que de tendre au module la valeur brute,
     qui ne lui arrive jamais dans la vraie vie. */
  const iNiveau = e.iNiveau !== undefined ? e.iNiveau
                : (e.brut && Number.isInteger(e.brut.niveau) ? e.brut.niveau : 0);
  pose("arrivee", A.arrivee(etat, { brut: e.brut, iNiveau, nNiveaux: NIVEAUX.length }));
  pose("intro", A.ouvre(etat));

  const ent = pose("entre", A.entre(etat, { son: e.son, volumeMusique: e.volumeMusique }));
  if(ent && ent.enregistre) rangements.push("entre");

  if(!ent || ent.suite === "menu"){
    pose("menu", A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS,
                                     acquis: e.acquis || [] }));
    return { etat, journal, rangements, presentationJouee: false };
  }

  // Le premier passage : la présentation, puis l'embarquement.
  const pr = pose("presentation", A.presentation({
    temps: e.temps === undefined ? PRESENTATION : e.temps }));
  pose("embarque", A.finPresentation(etat));

  /* Ici se joue la quête — elle appartient à `progression.js` et rien de ce
     domaine-ci n'y touche. À sa fin, la page redonne la main à l'accueil. */
  if(A.faudraDemanderNiveau(etat)){
    pose("ecran-niveau", A.ecranNiveau({ niveaux: LIBELLES }));
    const ch = pose("choisit-niveau", A.choisitNiveau(etat, {
      i: e.repond === undefined ? 1 : e.repond, nNiveaux: NIVEAUX.length }));
    if(ch && ch.enregistre) rangements.push("niveau");
    pose("depart", A.ecranDepart());
    pose("porte", A.choisitPorte(etat, { id: e.porte || "libre" }));
  }
  return { etat, journal, rangements, presentationJouee: !!(pr && pr.joue) };
}

// La suite des écrans réellement traversés, dans l'ordre.
function suiteDesEcrans(r){
  const s = [];
  for(const x of r.journal){
    if(x.o && typeof x.o.ecran === "string") s.push(x.o.ecran);
    else if(x.etape === "presentation" && x.o && x.o.joue) s.push("presentation");
    else if(x.etape === "embarque") s.push("quete");
    else if(x.etape === "porte" && x.o) s.push(x.o.suite);
  }
  return s;
}
const etape = (r, nom) => (r.journal.find(x => x.etape === nom) || {}).o;

/* Les quatre chemins, et rien d'autre au départ : c'est le point de tout
   l'exercice. Ils sont décrits en DONNÉES pour que la même table serve aux
   contrôles, au relevé final et aux sabotages. */
const CHEMINS = [
  { nom: "premier passage, avec la voix", son: true,  brut: null,
    ecrans: ["intro", "presentation", "quete", "niveau", "depart", "jeu"] },
  { nom: "premier passage, en silence",   son: false, brut: null,
    ecrans: ["intro", "presentation", "quete", "niveau", "depart", "jeu"] },
  /* Le `niveau: 0` du troisième chemin n'est pas décoratif : c'est le cas le
     plus fréquent du site réel, puisque franchir la porte range `niveau: 0`
     avant que personne n'ait répondu (voir les observations). Et c'est aussi le
     seul qui distingue « déjà venu » lu sur `deja` de « déjà venu » lu sur
     n'importe quel autre champ — avec un niveau à 1, les deux se confondent. */
  { nom: "déjà venu, avec la voix",  son: true,
    brut: { deja: true, niveau: 0, acquis: ["m-chute"] },  ecrans: ["intro", "menu"] },
  { nom: "déjà venu, en silence",    son: false,
    brut: { deja: true, niveau: 2, acquis: ["m-chute"] },  ecrans: ["intro", "menu"] },
];
const RECAP = [];

/* ══════════════════════════════════════════════════════ 1. LE CONTRAT EST-IL LÀ ? */
function controleContrat(A){
  const ATTENDU = {
    LANGUES: "object", LANGUE_DEFAUT: "string", PORTES: "object",
    DELAI_NIVEAU_ABANDON: "number",
    langue: "function", boutonsLangue: "function", choisitLangue: "function",
    niveauValide: "function", etatNeuf: "function", arrivee: "function",
    ouvre: "function", entre: "function", presentation: "function",
    finPresentation: "function", faudraDemanderNiveau: "function",
    ecranNiveau: "function", choisitNiveau: "function", ecranDepart: "function",
    choisitPorte: "function", ecranMenu: "function", ecranDetail: "function",
    choisitExperience: "function", oublieTout: "function", rejoue: "function",
  };
  const manque = Object.keys(ATTENDU).filter(k => typeof A[k] !== ATTENDU[k]);
  ok("les vingt-quatre noms du contrat sont là, du bon genre", manque.length === 0,
     "24 noms", manque.length ? "manquent ou faux : " + manque.join(", ") : "24",
     "la liste vient de l'en-tête du module, pas de son code");

  const etat = A.etatNeuf();
  const CHAMPS = ["ecran", "dejaVenu", "dejaNiveau", "voixActive", "entree",
                  "presentationVue", "embarque", "niveauRepondu"];
  ok("`etatNeuf()` rend les huit champs annoncés", memeEnsemble(Object.keys(etat), CHAMPS),
     CHAMPS.length + " champs", Object.keys(etat).length + " : " + Object.keys(etat).join(", "));
  ok("et il est vraiment NEUF",
     etat.ecran === "aucun" && etat.dejaVenu === false && etat.dejaNiveau === false
     && etat.voixActive === false && etat.entree === false && etat.embarque === false
     && etat.presentationVue === false && etat.niveauRepondu === false,
     "tout à faux, écran « aucun »", JSON.stringify(etat));

  const a = A.etatNeuf(), b = A.etatNeuf();
  A.ouvre(a); a.dejaVenu = true;
  ok("deux états ne se partagent rien",
     b.ecran === "aucun" && b.dejaVenu === false,
     "indépendants", b.ecran + " / " + b.dejaVenu,
     "le module n'a aucune variable vivante : deux parcours peuvent se jouer "
     + "côte à côte, et un contrôle repart d'un état propre sans rien réinitialiser");

  ok("les deux langues et les trois portes sont celles du site",
     memeEnsemble(A.LANGUES, ["fr", "en"]) && memeEnsemble(A.PORTES, ["libre", "salon", "missions"]),
     "[fr, en] / [libre, salon, missions]",
     "[" + A.LANGUES.join(", ") + "] / [" + A.PORTES.join(", ") + "]");
}

/* ══════════════════════════════════════════════════════════════ 2. LA LANGUE */
function controleLangue(A){
  // ── choisie : ce qui est rangé gagne sur tout le reste.
  {
    const r = A.langue({ memoire: memoireLangue("en"), navigateur: "fr-BE" });
    ok("la langue rangée gagne sur celle du navigateur",
       r.code === "en" && r.source === "memoire", "en, depuis la mémoire",
       r.code + ", depuis " + r.source,
       "quelqu'un dont le navigateur est en français peut très bien vouloir lire "
       + "en anglais : le choix ne se redemande pas, et il ne se contredit pas");
  }
  // ── déduite : le navigateur, quand rien n'est rangé.
  {
    const cas = [["fr", "fr"], ["fr-BE", "fr"], ["FR-ca", "fr"],
                 ["en", "en"], ["en-US", "en"], ["de-DE", "en"], ["ja", "en"]];
    const faux = cas.filter(([nav, att]) =>
      A.langue({ memoire: memoireLangue(), navigateur: nav }).code !== att);
    ok("la langue se déduit du navigateur quand rien n'est rangé", faux.length === 0,
       cas.map(c => c[0] + "→" + c[1]).join(" "),
       faux.length ? faux.map(c => c[0] + " donne "
         + A.langue({ memoire: memoireLangue(), navigateur: c[0] }).code).join(" ") : "les sept",
       "grossier volontairement : le site n'a que deux langues, un arbitrage plus "
       + "fin donnerait l'illusion d'un choix qui n'existe pas");
  }
  // ── le navigateur muet : l'original replie sur `fr` AVANT de tester.
  {
    const vide = A.langue({ memoire: memoireLangue(), navigateur: "" });
    const nul  = A.langue({ memoire: memoireLangue(), navigateur: null });
    const abs  = A.langue({ memoire: memoireLangue() });
    ok("un navigateur muet donne du français, pas de l'anglais",
       vide.code === "fr" && nul.code === "fr" && abs.code === "fr"
       && vide.source === "defaut",
       "fr par défaut dans les trois cas",
       [vide.code, nul.code, abs.code].join(" / ") + ", source " + vide.source,
       "`navigator.language || \"fr\"` : le repli se fait AVANT le test, donc un "
       + "navigateur sans langue lit du français. Le contraire aurait été aussi "
       + "défendable ; c'est celui-ci qui est en place");
  }
  // ── une mémoire de langue corrompue ne dérange rien.
  {
    const sales = ["", "  ", "FR", "fr-BE", "de", "null", "[]", "{}", "1", "🙂"];
    const leves = [], mauvais = [];
    for(const t of sales){
      let r = null;
      try { r = A.langue({ memoire: memoireLangue(t), navigateur: "de-DE" }); }
      catch(err){ leves.push(t + " : " + err.message); continue; }
      if(r.code !== "en" || r.source !== "navigateur") mauvais.push(JSON.stringify(t) + "→" + r.code + "/" + r.source);
    }
    ok("une langue rangée qui n'est ni « fr » ni « en » est ignorée sans lever",
       leves.length === 0 && mauvais.length === 0,
       "les dix retombent sur la déduction",
       leves.length ? "lève : " + leves.join(" ; ") : (mauvais.join(" ") || "les dix"),
       "« FR » en capitales n'est PAS accepté — la comparaison est stricte, et "
       + "c'est bien : la page ne range jamais que « fr » ou « en » en minuscules");
  }
  // ── une mémoire qui refuse (navigation privée).
  {
    const m = memoireMuette();
    let r = null, leve = null;
    try { r = A.langue({ memoire: m, navigateur: "fr-FR" }); } catch(err){ leve = err; }
    ok("une mémoire qui refuse ne casse pas le choix de la langue",
       leve === null && r && r.code === "fr" && r.source === "navigateur",
       "fr, déduit", leve ? leve.message : r && r.code + "/" + r.source,
       "en navigation privée l'adaptateur avale et rend la main : le module ne "
       + "doit pas s'en apercevoir");
    ok("et une mémoire absente non plus",
       A.langue({}).code === "fr" && A.langue().code === "fr", "fr",
       A.langue({}).code);
  }
  // ── les fichiers, et leur ORDRE.
  {
    const fr = A.langue({ memoire: memoireLangue("fr") });
    const en = A.langue({ memoire: memoireLangue("en") });
    ok("chaque langue nomme UN seul fichier de contenu",
       fr.fichierContenu === "contenu.js" && en.fichierContenu === "contenu.en.js",
       "contenu.js / contenu.en.js", fr.fichierContenu + " / " + en.fichierContenu,
       "les deux posent `window.CONTENU` et le second gagnerait : il ne peut y "
       + "en avoir qu'un");
    ok("l'interface charge le français d'abord, l'anglais par-dessus",
       fr.fichiersInterface.join(",") === "ui.fr.js"
       && en.fichiersInterface.join(",") === "ui.fr.js,ui.en.js",
       "[ui.fr.js] / [ui.fr.js, ui.en.js]",
       "[" + fr.fichiersInterface.join(", ") + "] / ["
       + en.fichiersInterface.join(", ") + "]",
       "l'ORDRE est la substance du choix : une clé oubliée en anglais retombe "
       + "sur une vraie phrase française, jamais sur un identifiant nu. Inverser "
       + "les deux lignes ne se verrait qu'en anglais, et seulement sur les clés "
       + "manquantes — c'est-à-dire jamais, chez qui les a toutes");
    ok("et les quatre fichiers nommés existent vraiment",
       ["contenu.js", "contenu.en.js", "ui.fr.js", "ui.en.js"]
         .every(f => fs.existsSync(path.join(ICI, f))),
       "les quatre sur le disque", "");
  }
  // ── la fabrique des boutons : UNE seule, pour les deux emplacements.
  {
    const b = A.boutonsLangue("en");
    ok("la fabrique des boutons rend les deux langues, l'actif marqué une fois",
       b.length === 2 && b.filter(x => x.actif).length === 1
       && b.find(x => x.code === "en").actif === true
       && b.every(x => x.nom && x.court === x.code.toUpperCase()),
       "2 boutons, 1 actif, un nom long et un nom court",
       b.length + " boutons, " + b.filter(x => x.actif).length + " actif(s)",
       "la page en pose DEUX exemplaires — réglages et accueil. Deux fabriques "
       + "pour un seul réglage, c'est la garantie qu'un jour l'une des deux "
       + "oubliera d'enregistrer");
    ok("une langue inconnue ne marque aucun bouton comme actif",
       A.boutonsLangue("de").filter(x => x.actif).length === 0, "0 actif",
       A.boutonsLangue("de").filter(x => x.actif).length);
  }
  // ── le clic.
  {
    ok("cliquer la langue en cours ne fait rien",
       A.choisitLangue({ code: "fr", courante: "fr" }) === null, "null",
       JSON.stringify(A.choisitLangue({ code: "fr", courante: "fr" })));
    const o = A.choisitLangue({ code: "en", courante: "fr" });
    ok("cliquer l'autre langue la range et demande un rechargement",
       o && o.range === "en" && o.recharge === true, "{ range:en, recharge:true }",
       JSON.stringify(o),
       "changer de langue change le fichier de contenu : tout le texte du site "
       + "en vient, y compris ce qui est déjà à l'écran. Un rechargement est "
       + "honnête et instantané ; reconstruire l'interface en place ferait la "
       + "même chose en plus fragile");
    ok("une langue inconnue est refusée net",
       A.choisitLangue({ code: "de", courante: "fr" }) === null
       && A.choisitLangue({}) === null && A.choisitLangue() === null, "null",
       JSON.stringify(A.choisitLangue({ code: "de", courante: "fr" })),
       "la page ne pose que deux boutons, donc ce chemin ne s'ouvre pas depuis "
       + "l'écran. Il s'ouvre depuis un outil, et c'est là qu'on veut un refus net");
  }
}

/* ═══════════════════════════════════════ 3. L'ARRIVÉE — CE QUE LA MÉMOIRE DIT */
function controleArrivee(A){
  {
    const etat = A.etatNeuf();
    const r = A.arrivee(etat, { brut: null, iNiveau: 0, nNiveaux: NIVEAUX.length });
    ok("une mémoire vide donne un premier passage",
       r.premierPassage === true && r.dejaVenu === false && r.dejaNiveau === false
       && r.restaure === false && etat.dejaVenu === false,
       "premier passage, rien à restaurer",
       JSON.stringify({ premier: r.premierPassage, restaure: r.restaure }));
  }
  {
    const etat = A.etatNeuf();
    const r = A.arrivee(etat, { brut: { deja: true, niveau: 2 }, iNiveau: 2,
                                nNiveaux: NIVEAUX.length });
    ok("une mémoire qui porte `deja` donne un retour",
       r.dejaVenu === true && r.premierPassage === false && r.restaure === true
       && etat.dejaVenu === true,
       "déjà venu, à restaurer", JSON.stringify({ deja: r.dejaVenu, restaure: r.restaure }),
       "`deja` est écrit par `progression.js` au premier enregistrement ; c'est "
       + "la seule chose qui distingue quelqu'un qui revient");
    ok("et le niveau rangé se rend tel qu'il est arrivé",
       r.iNiveau === 2 && r.niveauHorsBornes === false, "2, dans les bornes",
       r.iNiveau + ", hors bornes " + r.niveauHorsBornes,
       "reçu et rendu, jamais lié : `iNiveau` vit dans la page, il est lu par "
       + "les fiches, le dossier et Lumen. Un scalaire réassigné ne se partage "
       + "pas entre deux fichiers — c'est le piège payé sur `nChute`");
  }
  /* Le champ, et rien que le champ. Un `deja` lu sur autre chose — le niveau,
     la voix, la seule PRÉSENCE d'un objet — donnerait un domaine qui a l'air de
     marcher : tout le monde revient toujours, et personne ne revoit jamais le
     premier passage. C'est exactement le mode de panne qu'on ne remarque pas,
     puisqu'il ressemble à la vie normale du développeur. */
  {
    const essai = brut => {
      const etat = A.etatNeuf();
      return A.arrivee(etat, { brut, iNiveau: 0, nNiveaux: NIVEAUX.length }).dejaVenu;
    };
    const cas = [[{ niveau: 2 }, false], [{ voix: true }, false], [{}, false],
                 [{ deja: false, niveau: 2 }, false], [{ deja: true }, true],
                 [{ deja: 1 }, true], [{ deja: true, niveau: 0 }, true]];
    const faux = cas.filter(([b, att]) => essai(b) !== att);
    ok("« déjà venu » se lit sur `deja`, et sur aucun autre champ",
       faux.length === 0, "les sept cas",
       faux.length ? faux.map(c => JSON.stringify(c[0]) + " donne " + essai(c[0])).join(" ")
                   : "les sept",
       "un `deja` lu ailleurs donne un site où tout le monde revient toujours : "
       + "le premier passage devient injouable, et personne ne s'en aperçoit "
       + "puisque c'est déjà ce que voit celui qui développe");
  }
}

/* ══════════════ 4. LA MÉMOIRE CORROMPUE — VALIDE, MAIS DE LA MAUVAISE FORME

   Une mémoire de navigateur survit aux versions du site. `registre.js` porte
   déjà la leçon : une ligne mal formée s'écarte à la LECTURE, pas à l'usage.  */
function controleCorruption(A){
  const cas = [
    { nom: "absente",                   brut: null,        venu: false, niv: false },
    { nom: "un nombre tout seul",       brut: 5,           venu: false, niv: false },
    { nom: "une chaîne",                brut: "bonjour",   venu: false, niv: false },
    { nom: "un booléen",                brut: true,        venu: false, niv: false },
    { nom: "un tableau",                brut: [1, 2, 3],   venu: false, niv: false },
    { nom: "un objet vide",             brut: {},          venu: false, niv: false },
    { nom: "`deja` en chaîne",          brut: { deja: "peut-être" },   venu: true,  niv: false },
    { nom: "`deja` à faux",             brut: { deja: false, niveau: 1 }, venu: false, niv: false },
    { nom: "un niveau en toutes lettres", brut: { deja: true, niveau: "deux" }, venu: true, niv: false },
    { nom: "un niveau à virgule",       brut: { deja: true, niveau: 1.5 },     venu: true, niv: false },
    { nom: "un niveau infini",          brut: { deja: true, niveau: Infinity }, venu: true, niv: false },
    { nom: "un niveau NaN",             brut: { deja: true, niveau: NaN },      venu: true, niv: false },
    { nom: "un niveau négatif",         brut: { deja: true, niveau: -5 },       venu: true, niv: false },
    { nom: "un niveau trop grand",      brut: { deja: true, niveau: 999 },      venu: true, niv: false },

    /* LES TROIS QUI DISENT LA LOI RÉPARÉE — 9 août.

       « A-t-on répondu » ne se déduit plus de la présence de `niveau`. Franchir
       la porte range `niveau: 0` tout seul, et le déduire de là privait de la
       question quiconque rechargeait tôt. Le drapeau est maintenant explicite,
       posé au seul endroit où l'on répond vraiment. */
    { nom: "sortie de porte : un niveau rangé, mais pas de choix",
      brut: { deja: true, niveau: 0 },                        venu: true, niv: false },
    { nom: "on a vraiment répondu",
      brut: { deja: true, niveau: 2, niveauChoisi: true },     venu: true, niv: true },
    { nom: "un drapeau de réponse mal formé ne compte pas",
      brut: { deja: true, niveau: 2, niveauChoisi: "oui" },    venu: true, niv: false },
    { nom: "une version d'il y a six mois", brut: { v: 0, level: 2, unlocked: ["m-chute"] },
      venu: false, niv: false },
  ];
  for(const c of cas){
    const etat = A.etatNeuf();
    /* Le niveau tendu au module est celui que la PAGE aurait en main : un champ
       qui rate le contrôle de type de `progression.js` n'est pas reposé, et
       zéro — la valeur du code — reste en place. */
    const iNiveau = (c.brut && Number.isInteger(c.brut.niveau)) ? c.brut.niveau : 0;
    let r = null, leve = null;
    try { r = A.arrivee(etat, { brut: c.brut, iNiveau, nNiveaux: NIVEAUX.length }); }
    catch(err){ leve = err; }
    ok("mémoire « " + c.nom + " » — l'arrivée ne lève pas", leve === null,
       "aucune exception", leve ? leve.name + " : " + leve.message : "aucune");
    if(leve) continue;
    ok("mémoire « " + c.nom + " » — les deux verdicts sont ceux de la page",
       r.dejaVenu === c.venu && r.dejaNiveau === c.niv,
       "déjà venu " + c.venu + ", niveau connu " + c.niv,
       "déjà venu " + r.dejaVenu + ", niveau connu " + r.dejaNiveau,
       "`!!(m && m.deja)` pour l'un ; pour l'autre `m.niveauChoisi === true`, et "
       + "PLUS `Number.isInteger(m.niveau)` — la porte d'entrée range `niveau: 0` "
       + "toute seule, donc le déduire de là privait de la question quiconque "
       + "rechargeait avant la fin de la quête");
    const sale = malsain(r);
    ok("mémoire « " + c.nom + " » — rien de non fini ne sort", sale.length === 0,
       "aucun", sale.length ? sale.join(", ") : "aucun");
  }

  /* ─── L'INFINI, ET OÙ LA GARDE DOIT VIVRE.

     `JSON.parse('{"musique":1e400}')` rend `Infinity` — du JSON parfaitement
     valide. `progression.js` a été corrigé aujourd'hui pour le refuser à la
     lecture. La question posée ici est celle du chaînage : que reçoit
     réellement l'accueil quand la mémoire porte un infini ? On enchaîne donc
     les DEUX modules, comme la page le fait. */
  {
    let P = null;
    try { P = chargeEmpoisonne(fs.readFileSync(path.join(ICI, "progression.js"), "utf8")).PROGRESSION; }
    catch(_){ P = null; }
    if(!P || !P.charge){
      vu("`progression.js` ne s'est pas chargé : le chaînage des deux modules "
         + "n'a pas pu être éprouvé. C'est LUI qui garde la mémoire contre les "
         + "infinis, et l'accueil ne se garde pas tout seul.");
    } else {
      const mem = { lit: () => JSON.parse('{"musique":1e400,"volume":1e400,'
                                          + '"niveau":1e400,"deja":true,"acquis":[]}') };
      const r = P.charge({ memoire: mem });
      const vol = r.reglages.volumeMusique;
      const etat = A.etatNeuf();
      A.arrivee(etat, { brut: r.brut, iNiveau: r.reglages.iNiveau, nNiveaux: NIVEAUX.length });
      const o = A.entre(etat, { son: true, volumeMusique: vol });
      ok("une mémoire à volume infini n'arrive pas jusqu'à la musique",
         vol === undefined && o.musique === null,
         "volume écarté en amont, aucune musique",
         "volume relu " + JSON.stringify(vol) + ", musique " + JSON.stringify(o.musique),
         "`progression.js` refuse les non finis À LA LECTURE, et c'est le bon "
         + "endroit : deux modules qui décrivent le même espace ne peuvent pas "
         + "avoir deux lois. L'accueil n'a donc AUCUNE garde à lui — ce qui est "
         + "juste tant que celle-là tient, et seulement tant qu'elle tient");
      const su = A.arrivee(A.etatNeuf(), { brut: r.brut, iNiveau: r.reglages.iNiveau,
                                           nNiveaux: NIVEAUX.length });
      ok("et le niveau infini ne se fait pas passer pour une réponse",
         su.dejaNiveau === false,
         "niveau inconnu", su.dejaNiveau ? "niveau CONNU" : "niveau inconnu",
         "`Number.isInteger(Infinity)` est faux : le champ « niveau » est protégé "
         + "par la forme du contrôle, pas par une intention. C'est écrit ici pour "
         + "que ça reste vrai");
    }
    // Et sans garde en amont, l'infini traverse. Figé, pas approuvé.
    const brut = A.entre(Object.assign(A.etatNeuf(), { dejaVenu: false }),
                         { son: true, volumeMusique: Infinity });
    /* `String` et non `JSON.stringify` : `JSON.stringify(Infinity)` rend « null »,
       et l'on afficherait donc « null » à côté d'un contrôle vert qui vient
       justement de constater un infini. Un relevé qui ment est pire qu'un relevé
       absent. */
    ok("passé DIRECTEMENT, un volume infini traverse `entre()` (figé, non approuvé)",
       brut.musique === Infinity, "Infinity", String(brut.musique),
       "le module reproduit `volumeMusique > 0` sans revérifier. C'est voulu — "
       + "une seconde loi serait pire — mais cela veut dire que toute la sûreté "
       + "de ce chemin repose sur `progression.js`, et sur rien d'autre");
  }
}

/* ════════════════ 5. LES QUATRE CHEMINS D'ENTRÉE, JOUÉS DE BOUT EN BOUT

   Le point de tout l'exercice. Aucun de ces quatre chemins n'avait jamais été
   visité par autre chose qu'un humain qui recharge la page.                   */
function controleChemins(A){
  for(const c of CHEMINS){
    let r = null, leve = null;
    try { r = parcours(A, { son: c.son, brut: c.brut, navigateur: "fr-FR",
                            volumeMusique: 0.25, iNiveau: c.brut ? c.brut.niveau : 0,
                            acquis: (c.brut && c.brut.acquis) || [] }); }
    catch(err){ leve = err; }
    ok("chemin « " + c.nom + " » — il va au bout sans lever", leve === null,
       "aucune exception", leve ? leve.name + " : " + leve.message : "aucune");
    if(leve){
      if(!carnet) RECAP.push({ nom: c.nom, ecrans: "EXCEPTION", vert: false });
      continue;
    }

    const vus = suiteDesEcrans(r);
    ok("chemin « " + c.nom + " » — les écrans s'enchaînent dans l'ordre attendu",
       vus.join(" → ") === c.ecrans.join(" → "),
       c.ecrans.join(" → "), vus.join(" → "),
       c.brut ? "qui revient a déjà répondu : on ne rejoue ni la présentation, "
                + "ni la quête, ni la question du niveau"
              : "qui arrive n'explore pas, il regarde deux minutes : on le "
                + "dépose à bord et la quête lui apprend le lieu");
    // Le relevé n'accueille que les mesures RÉELLES : les sabotages rejouent les
    // mêmes groupes, et un tableau qui les gobe raconterait n'importe quoi.
    if(!carnet) RECAP.push({ nom: c.nom, ecrans: vus.join(" → "),
                             vert: vus.join(" → ") === c.ecrans.join(" → ") });
    ok("chemin « " + c.nom + " » — la présentation se joue au premier passage, "
       + "et seulement là",
       r.presentationJouee === !c.brut,
       c.brut ? "pas de présentation" : "présentation jouée",
       r.presentationJouee ? "jouée" : "pas jouée",
       "elle est imposée au premier passage — c'est le seul moment où l'on peut "
       + "dire ce qu'est ce site sans que personne ne l'ait décidé à notre place. "
       + "La rejouer à chaque visite serait la transformer en péage");

    const ent = etape(r, "entre");
    ok("chemin « " + c.nom + " » — la voix est enregistrée telle qu'elle a été "
       + "demandée",
       ent.voixActive === c.son && ent.enregistre === true
       && r.etat.voixActive === c.son,
       "voix " + c.son + ", enregistrée", "voix " + ent.voixActive
       + ", enregistrée " + ent.enregistre,
       "on demande AVANT de parler : une voix qui démarre toute seule est "
       + "désagréable, et elle se coupe toujours trop tard");
    ok("chemin « " + c.nom + " » — la musique et l'avis iOS suivent le son, pas "
       + "l'inverse",
       ent.avertitSon === c.son && ent.musique === (c.son ? 0.25 : null),
       "avis " + c.son + ", musique " + (c.son ? "0.25" : "null"),
       "avis " + ent.avertitSon + ", musique " + JSON.stringify(ent.musique),
       "entrer en silence doit rester silencieux de bout en bout : c'est la "
       + "seule promesse que fait le second bouton");

    const sale = malsain(r.journal);
    ok("chemin « " + c.nom + " » — rien de non fini, rien d'« undefined » recollé",
       sale.length === 0, "aucun", sale.length ? sale.join(", ") : "aucun");
  }

  // ── ce que chaque chemin range, et quand.
  {
    const premier = parcours(A, { son: true, brut: null, navigateur: "fr",
                                  volumeMusique: 0, repond: 1 });
    ok("le premier passage range DEUX fois : à la porte, puis au niveau",
       premier.rangements.join(",") === "entre,niveau", "entre,niveau",
       premier.rangements.join(",") || "rien",
       "la première écriture est celle qui pose `deja` — c'est elle qui fait "
       + "qu'on ne reverra plus jamais cet écran");
    const retour = parcours(A, { son: false, brut: { deja: true, niveau: 0 },
                                 navigateur: "fr" });
    ok("le retour ne range qu'une fois, à la porte",
       retour.rangements.join(",") === "entre", "entre",
       retour.rangements.join(",") || "rien");
  }

  // ── la présentation absente ne bloque pas l'entrée.
  {
    const r = parcours(A, { son: true, brut: null, navigateur: "fr", temps: [] });
    const pr = etape(r, "presentation");
    ok("un contenu sans présentation n'empêche pas d'embarquer",
       !!pr && pr.joue === false && pr.suite === "embarque"
       && r.etat.embarque === true,
       "on embarque quand même",
       JSON.stringify({ joue: pr && pr.joue, embarque: r.etat.embarque }),
       "un fichier de langue plus ancien ne doit pas fermer la porte du site");
  }
  // ── la présentation réelle : les points, et le dernier bouton.
  {
    const pr = A.presentation({ temps: PRESENTATION });
    ok("la présentation annonce d'emblée combien d'écrans il reste",
       pr.joue === true && pr.points === PRESENTATION.length
       && pr.ecrans.length === PRESENTATION.length,
       PRESENTATION.length + " points", pr.points,
       "on accepte volontiers trois écrans, on n'accepte pas un texte dont on ne "
       + "voit pas la fin");
    const dern = pr.ecrans[pr.ecrans.length - 1];
    ok("au dernier écran, le bouton dit « entrer » et non « suivant »",
       dern.dernier === true && dern.suite.cle === "pr.entrer"
       && pr.ecrans.slice(0, -1).every(x => x.suite.cle === "pr.suivant"),
       "pr.suivant × " + (pr.ecrans.length - 1) + " puis pr.entrer",
       pr.ecrans.map(x => x.suite.cle).join(", "),
       "au dernier écran, « Suivant » mentirait");
    ok("et le texte des écrans vient de `contenu.js`, tel quel",
       pr.ecrans.every((x, i) => x.sur === PRESENTATION[i].sur && x.t === PRESENTATION[i].t),
       "les " + PRESENTATION.length + " écrans du contenu",
       pr.ecrans.map(x => x.sur).join(" | "));
  }
}

/* ══════════════════════ 6. LE NIVEAU DE LECTURE — APRÈS LA QUÊTE, UNE FOIS */
function controleNiveau(A){
  // ── jamais avant la fin de la quête.
  {
    const r = parcours(A, { son: true, brut: null, navigateur: "fr" });
    const iEmbarque = r.journal.findIndex(x => x.etape === "embarque");
    const iNiveau   = r.journal.findIndex(x => x.etape === "ecran-niveau");
    ok("le niveau n'est jamais demandé avant l'embarquement",
       iEmbarque >= 0 && iNiveau > iEmbarque,
       "l'écran du niveau vient APRÈS l'embarquement",
       "embarquement en " + iEmbarque + ", niveau en " + iNiveau,
       "personne ne sait répondre à « où en es-tu ? » avant d'avoir vu de quoi "
       + "on parle. C'est la raison d'être de tout cet ordre-là");
    const avant = r.journal.slice(0, iEmbarque + 1);
    const clesAvant = cles(avant.map(x => x.o));
    ok("et aucun écran d'avant ne parle du niveau",
       !clesAvant.has("accueil.niveau.titre")
       && !avant.some(x => x.o && x.o.ecran === "niveau"),
       "aucune trace de la question", [...clesAvant].join(", "));
  }
  // ── une seule fois : la garde tient sur la mémoire.
  {
    const etat = A.etatNeuf();
    A.arrivee(etat, { brut: { deja: true, niveau: 1, niveauChoisi: true },
                      iNiveau: 1, nNiveaux: NIVEAUX.length });
    ok("une mémoire où l'on a RÉPONDU ne redemande rien",
       A.faudraDemanderNiveau(etat) === false, "false", A.faudraDemanderNiveau(etat),
       "c'est la garde d'`index.html` : `if(!dejaNiveau)`");
    const neuf = A.etatNeuf();
    A.arrivee(neuf, { brut: { deja: true }, iNiveau: 0, nNiveaux: NIVEAUX.length });
    ok("une mémoire sans réponse, elle, pose la question",
       A.faudraDemanderNiveau(neuf) === true, "true", A.faudraDemanderNiveau(neuf));

    /* LE CONTRÔLE DE LA RÉPARATION, et c'est celui qui compte.

       Franchir la porte appelle `sauve()`, qui range `niveau: 0` — la valeur du
       code, pas un choix. Avant le 9 août, cette seule mémoire-là suffisait à
       taire la question pour toujours : on entrait, on rechargeait, on restait
       en « Découverte » sans avoir rien demandé. */
    const porte = A.etatNeuf();
    A.arrivee(porte, { brut: { deja: true, niveau: 0 }, iNiveau: 0, nNiveaux: NIVEAUX.length });
    ok("sortir par la porte ne vaut PAS avoir répondu",
       A.faudraDemanderNiveau(porte) === true, "true", A.faudraDemanderNiveau(porte),
       "`niveau: 0` est ce que la porte range toute seule ; le confondre avec un "
       + "choix privait de la question quiconque rechargeait tôt");
  }
  // ── la réponse se range, et au passage suivant la question ne revient plus.
  {
    const r = parcours(A, { son: true, brut: null, navigateur: "fr", repond: 2 });
    const ch = etape(r, "choisit-niveau");
    ok("répondre range le niveau et repeint la fiche",
       !!ch && ch.iNiveau === 2 && ch.enregistre === true && ch.repeintFiche === true
       && ch.valide === true && r.etat.niveauRepondu === true,
       "{ iNiveau:2, enregistre, repeintFiche }",
       ch ? JSON.stringify({ i: ch.iNiveau, e: ch.enregistre, f: ch.repeintFiche })
          : "la question n'a jamais été posée");
    /* La page range `niveau: iNiveau` ET `niveauChoisi: true` — c'est cette
       mémoire-là qu'on relit. Le second champ est ce que la réparation du 9 août
       a ajouté : sans lui, on ne saurait pas distinguer « a répondu 0 » de
       « a franchi la porte », puisque la porte range zéro toute seule. */
    const range = ch ? ch.iNiveau : 2;
    const suivant = A.etatNeuf();
    A.arrivee(suivant, { brut: { deja: true, niveau: range, niveauChoisi: true },
                         iNiveau: range, nNiveaux: NIVEAUX.length });
    ok("et au rechargement suivant, on ne la repose pas",
       A.faudraDemanderNiveau(suivant) === false, "false",
       A.faudraDemanderNiveau(suivant),
       "c'est le sens de la question : on ne demande pas deux fois à quelqu'un "
       + "où il en est");
  }
  /* ── LA MÊME SESSION, DEUX FOIS. Figé, PAS approuvé.

     La garde est une constante prise au chargement de la page. Elle ne bouge
     donc pas quand on répond : une seconde fin de quête dans la même session
     (bouton « rejouer ») repose la question. C'est le comportement d'origine et
     il est reproduit tel quel — ce contrôle le FIGE pour qu'on le voie si
     quelqu'un le corrige, il ne l'approuve pas. */
  {
    const etat = A.etatNeuf();
    A.arrivee(etat, { brut: null, iNiveau: 0, nNiveaux: NIVEAUX.length });
    A.choisitNiveau(etat, { i: 1, nNiveaux: NIVEAUX.length });
    ok("dans la MÊME session, une seconde fin de quête repose la question "
       + "(figé, non approuvé)",
       A.faudraDemanderNiveau(etat) === true && etat.niveauRepondu === true,
       "la garde n'a pas bougé, mais la réponse est notée",
       "garde " + A.faudraDemanderNiveau(etat) + ", répondu " + etat.niveauRepondu,
       "`etat.niveauRepondu` existe, se remplit, et n'est lu par personne : c'est "
       + "le crochet auquel se pendra la correction, le jour où on la fera");
  }
  // ── les bornes du niveau.
  {
    const bornes = [[-1, false], [0, true], [1, true], [NIVEAUX.length - 1, true],
                    [NIVEAUX.length, false], [999, false], [1.5, false],
                    [Infinity, false], [NaN, false], ["1", false], [null, false],
                    [undefined, false]];
    const faux = bornes.filter(([i, att]) => A.niveauValide(i, NIVEAUX.length) !== att);
    ok("`niveauValide` connaît les bornes des " + NIVEAUX.length + " niveaux de `contenu.js`",
       faux.length === 0, "0 et " + (NIVEAUX.length - 1) + " dedans, le reste dehors",
       faux.length ? faux.map(b => JSON.stringify(b[0])).join(", ") : "les douze cas",
       "le nombre de niveaux vient de `contenu.js` et non du module : c'est la "
       + "seule place du dépôt où l'on peut dire qu'un `-5` n'est pas un niveau");
  }
  // ── et un niveau hors bornes ne casse pas l'entrée.
  {
    const references = parcours(A, { son: true, brut: { deja: true, niveau: 1 },
                                     navigateur: "fr", iNiveau: 1 });
    for(const mauvais of [-5, 999, NIVEAUX.length]){
      let r = null, leve = null;
      try { r = parcours(A, { son: true, brut: { deja: true, niveau: mauvais },
                              navigateur: "fr", iNiveau: mauvais }); }
      catch(err){ leve = err; }
      ok("un niveau à " + mauvais + " ne casse pas l'entrée",
         leve === null && r
         && suiteDesEcrans(r).join(" → ") === suiteDesEcrans(references).join(" → ")
         && malsain(r.journal).length === 0,
         "le même parcours qu'avec un niveau sain",
         leve ? leve.message : (r ? suiteDesEcrans(r).join(" → ") : "—"));
      if(r) ok("… et il est SIGNALÉ hors bornes plutôt que corrigé en douce",
         etape(r, "arrivee").niveauHorsBornes === true, "true",
         etape(r, "arrivee").niveauHorsBornes,
         "le module ne clampe rien : une correction glissée dans une extraction "
         + "est une correction que personne n'a relue. Le signal existe, la page "
         + "l'ignore aujourd'hui, et c'est exactement l'état d'origine");
    }
  }
  // ── le délai de la croix.
  ok("le délai de la question après la croix de la quête est de 500 ms",
     A.DELAI_NIVEAU_ABANDON === 500, "500", A.DELAI_NIVEAU_ABANDON,
     "relevé dans `index.html`. La fin NORMALE de la quête en emploie un autre, "
     + "1200 ms, et il vient de `progression.js` : deux nombres pour un seul geste");
}

/* ════════════════ 7. LES DESCRIPTEURS — DES CLÉS, JAMAIS DU TEXTE TRADUIT */

// Tous les descripteurs que le module sait produire, en un seul sac.
function tousLesDescripteurs(A){
  const d = [];
  for(const c of CHEMINS){
    const r = parcours(A, { son: c.son, brut: c.brut, navigateur: "fr",
                            volumeMusique: 0.25, iNiveau: c.brut ? c.brut.niveau : 0,
                            acquis: (c.brut && c.brut.acquis) || [] });
    for(const x of r.journal) d.push(x.o);
  }
  const etat = A.etatNeuf();
  d.push(A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS, acquis: [] }));
  d.push(A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS,
                             acquis: ["m-chute"] }));
  d.push(A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS,
                             acquis: new Set(["m-chute", "m-reel"]) }));
  d.push(A.ecranDetail(EXPERIENCES[0]));
  d.push(A.ecranDepart());
  d.push(A.ecranNiveau({ niveaux: LIBELLES }));
  d.push(A.presentation({ temps: PRESENTATION }));
  return d;
}

function controleDescripteurs(A){
  const tous = tousLesDescripteurs(A);
  const produites = new Set();
  for(const d of tous) cles(d, produites);

  ok("le module produit EXACTEMENT les vingt et une clés d'`index.html`",
     memeEnsemble(produites, CLES_PAGE), CLES_PAGE.length + " clés",
     produites.size + " : "
     + ([...produites].filter(k => !CLES_PAGE.includes(k)).map(k => "+" + k)
        .concat(CLES_PAGE.filter(k => !produites.has(k)).map(k => "−" + k)).join(" ")
        || "les mêmes"),
     "la liste vient du `grep` d'`index.html`, pas du module : c'est elle qui "
     + "décide si le remplacement est interchangeable. Une clé en plus est une "
     + "phrase que personne n'a écrite ; une clé en moins est un écran muet");

  const manqueFr = [...produites].filter(k => !(k in UI_FR));
  const manqueEn = [...produites].filter(k => !(k in UI_EN));
  ok("chaque clé produite existe dans `ui.fr.js`", manqueFr.length === 0,
     "aucune manquante", manqueFr.join(", ") || "aucune");
  ok("et dans `ui.en.js` par-dessus", manqueEn.length === 0,
     "aucune manquante", manqueEn.join(", ") || "aucune",
     "une clé absente d'une seule table s'affiche en identifiant nu, et seulement "
     + "dans une langue — donc seulement pour quelqu'un d'autre que celui qui "
     + "relit");

  const chemins = new Set();
  for(const d of tous) cheminsContenu(d, chemins);
  ok("les chemins dans `contenu.js` sont ceux attendus, et ils s'y résolvent",
     memeEnsemble(chemins, CHEMINS_CONTENU)
     && [...chemins].every(c => resous(CONTENU, c) && resous(CONTENU_EN, c)),
     "[" + CHEMINS_CONTENU.join(", ") + "] résolus dans les deux langues",
     "[" + [...chemins].join(", ") + "] — "
     + [...chemins].filter(c => !resous(CONTENU, c) || !resous(CONTENU_EN, c))
         .map(c => c + " introuvable").join(", ") || "tous résolus",
     "le chapô ne porte pas de clé d'interface mais un CHEMIN dans le contenu : "
     + "il est pédagogique, il se source, et il ne vit pas au même rythme que "
     + "les mots de la machine");

  /* Le module a-t-il traduit tout seul ? On regarde si une chaîne d'un
     descripteur est, mot pour mot, la valeur d'une des vingt et une clés. */
  const traduits = new Map();
  for(const k of CLES_PAGE){
    if(typeof UI_FR[k] === "string") traduits.set(UI_FR[k], k);
    if(typeof UI_EN[k] === "string") traduits.set(UI_EN[k], k);
  }
  const fautifs = [];
  for(const d of tous)
    for(const s of chaines(d))
      if(traduits.has(s)) fautifs.push(traduits.get(s) + " → « " + s + " »");
  ok("aucun descripteur ne porte de texte d'interface déjà traduit",
     fautifs.length === 0, "aucun",
     fautifs.length ? [...new Set(fautifs)].join(" ; ") : "aucun",
     "le descripteur porte la CLÉ et ses valeurs ; la page traduit. Un contrôle "
     + "compare alors des clés sans avoir à charger une table de langue — et "
     + "surtout, il voit tout de suite si le module s'est mis à traduire");

  // ── le chapô du menu : trois phrases, et le pluriel entier.
  {
    const etat = A.etatNeuf();
    const zero = A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS, acquis: [] });
    const un   = A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS, acquis: ["m-chute"] });
    const deux = A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS,
                                     acquis: new Set(["m-chute", "m-reel"]) });
    ok("le menu dit trois choses différentes selon ce qui a été compris",
       zero.chapo.cle === "accueil.chapo" && un.chapo.cle === "accueil.reprise.un"
       && deux.chapo.cle === "accueil.reprise",
       "chapo / reprise.un / reprise",
       [zero.chapo.cle, un.chapo.cle, deux.chapo.cle].join(" / "),
       "le pluriel n'est PAS recousu dans la phrase : chaque langue apporte ses "
       + "deux phrases entières, parce qu'une phrase à trous se casse dès la "
       + "troisième langue");
    ok("et il compte juste, sur le total des missions jouables",
       un.chapo.vals.n === 1 && deux.chapo.vals.n === 2
       && deux.chapo.vals.total === MISSIONS.length,
       "1 puis 2, sur " + MISSIONS.length,
       un.chapo.vals.n + " puis " + deux.chapo.vals.n + ", sur " + deux.chapo.vals.total);
    ok("les pastilles ne paraissent qu'à partir d'un acquis",
       zero.pastilles === null && zero.oubli === null
       && un.pastilles.length === MISSIONS.length
       && un.pastilles.filter(p => p.acquis).length === 1,
       "aucune à zéro, " + MISSIONS.length + " ensuite dont 1 allumée",
       (zero.pastilles === null ? "aucune" : zero.pastilles.length) + " / "
       + (un.pastilles ? un.pastilles.filter(p => p.acquis).length + " allumée(s)" : "—"),
       "sur un compteur à zéro, huit pastilles éteintes ressemblent à une punition");
    ok("un `Set` et un tableau donnent le même menu",
       JSON.stringify(A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS,
                                          acquis: ["m-chute", "m-reel"] }))
       === JSON.stringify(deux), "identiques", "différents");
  }
  // ── les portes : trois, nommées, avec leurs deux clés chacune.
  {
    const d = A.ecranDepart();
    ok("les trois portes portent chacune leur titre et leur détail",
       d.portes.length === 3
       && d.portes.map(p => p.id).join(",") === "libre,salon,missions"
       && d.portes.every(p => p.titre.cle.startsWith("accueil.porte.")
                              && p.detail.cle.startsWith("accueil.porte.")),
       "libre, salon, missions", d.portes.map(p => p.id).join(", "),
       "trois manières d'aborder le même objet, et elles ne demandent pas le "
       + "même effort. Le choix n'engage à rien : les trois mènent au même site");
    const etat = A.etatNeuf();
    ok("une porte inconnue est refusée plutôt qu'inventée",
       A.choisitPorte(etat, { id: "ailleurs" }) === null
       && A.choisitPorte(etat, {}) === null, "null",
       JSON.stringify(A.choisitPorte(etat, { id: "ailleurs" })));
    const salon = A.choisitPorte(A.etatNeuf(), { id: "salon" });
    const libre = A.choisitPorte(A.etatNeuf(), { id: "libre" });
    const miss  = A.choisitPorte(A.etatNeuf(), { id: "missions" });
    ok("seule la porte du vaisseau fait entrer au salon",
       salon.entreAuSalon === true && libre.entreAuSalon === false
       && miss.entreAuSalon === false && miss.suite === "menu",
       "salon seul", [salon, libre, miss].map(x => x.entreAuSalon).join(", "));
    ok("et les trois font taire la voix et coupent le travelling",
       [salon, libre, miss].every(x => x.tais === true && x.cinema === false
                                       && x.cacheAccueil === true),
       "tais + cinéma coupé + accueil caché", "");
  }
  // ── le détail d'une expérience.
  {
    const x = EXPERIENCES[0];
    const d = A.ecranDetail(x);
    ok("le détail d'une expérience porte sa durée, son titre et ses deux boutons",
       d.titre === x.titre && d.duree === x.duree && d.quoi === x.quoi
       && d.boutons.map(b => b.cle).join(",") === "accueil.commencer,accueil.retour",
       "titre + durée + [commencer, retour]", d.boutons.map(b => b.cle).join(", "));
    const etat = A.etatNeuf();
    const o = A.choisitExperience(etat, { id: x.id });
    ok("et le lancer demande la mise en place de CETTE expérience",
       o.miseEnPlace === x.id && o.tais === true && o.montreBoutonMenu === true,
       x.id, o.miseEnPlace);
  }
  // ── tout recommencer.
  {
    const etat = A.etatNeuf();
    const o = A.oublieTout(etat);
    ok("« tout recommencer » efface, repeint et revient au menu",
       o.oublie === true && o.repeintMission === true && o.suite === "menu",
       "{ oublie, repeintMission, menu }", JSON.stringify(o));
  }
}

/* ═════════════════════════════ 8. REJOUER LE PREMIER PASSAGE */
function controleRejoue(A){
  {
    const av = { deja: true, niveau: 2, voix: true, acquis: ["m-chute"] };
    const ap = A.rejoue(av);
    ok("rejouer enlève `deja` et ne touche à rien d'autre",
       ap && !("deja" in ap) && ap.niveau === 2 && ap.voix === true
       && JSON.stringify(ap.acquis) === '["m-chute"]',
       "tout sauf `deja`", JSON.stringify(ap),
       "sans ça, le bouton relançait la quête mais un rafraîchissement redéposait "
       + "au menu : la présentation ne se rejouait jamais, et il fallait vider la "
       + "mémoire du navigateur pour la revoir une seule fois");
    ok("et l'objet d'origine n'est pas modifié", av.deja === true, "intact",
       JSON.stringify(av.deja),
       "deux écrivains pour une valeur est la maladie que ce dépôt nomme en premier");
  }
  {
    ok("sans mémoire, il en range une vide — comme l'original",
       JSON.stringify(A.rejoue(null)) === "{}"
       && JSON.stringify(A.rejoue(undefined)) === "{}",
       "{}", JSON.stringify(A.rejoue(null)),
       "`JSON.parse(getItem() || \"{}\")` : l'original écrivait bien un objet vide");
    const sales = [5, "bonjour", true, [1, 2]];
    const leves = sales.filter(b => { try { A.rejoue(b); return false; } catch(_){ return true; } });
    ok("une mémoire d'une autre forme ne fait pas lever et ne se range pas",
       leves.length === 0 && sales.every(b => A.rejoue(b) === null),
       "null pour les quatre",
       leves.length ? "lève sur " + leves.join(", ")
                    : sales.map(b => JSON.stringify(A.rejoue(b))).join(", "),
       "l'original y réécrivait la valeur telle quelle, ce qui est indiscernable "
       + "de ne rien écrire — sauf sur `null` rangé, où il levait et où son `try` "
       + "avalait. Le refus net donne le même comportement observable");
  }
}

/* ═════════════════════════════════════════════ 9. LE DÉTERMINISME

   Mêmes entrées, mêmes sorties. Sans ça, rien de ce qui précède n'est
   éprouvable : un parcours qui dépend de l'ordre des appels, d'une variable
   restée vivante ou de l'heure qu'il est ne se rejoue pas.                    */
function controleDeterminisme(A){
  for(const c of CHEMINS){
    const e = { son: c.son, brut: c.brut, navigateur: "fr-FR", volumeMusique: 0.25,
                iNiveau: c.brut ? c.brut.niveau : 0, acquis: (c.brut && c.brut.acquis) || [] };
    const a = JSON.stringify(parcours(A, e).journal);
    const b = JSON.stringify(parcours(A, e).journal);
    ok("chemin « " + c.nom + " » — deux exécutions donnent le même parcours",
       a === b, "identiques", a === b ? "identiques" : "DIFFÉRENTS",
       "le module n'a aucune variable vivante : c'est ce qui permet de rejouer "
       + "un chemin sans avoir à réinitialiser quoi que ce soit");
  }
  // Et l'ordre des chemins entre eux ne change rien non plus.
  {
    const seul = JSON.stringify(parcours(A, { son: true, brut: null, navigateur: "fr" }).journal);
    parcours(A, { son: false, brut: { deja: true, niveau: 2 }, navigateur: "en" });
    parcours(A, { son: true, brut: { deja: true }, navigateur: "de" });
    const apres = JSON.stringify(parcours(A, { son: true, brut: null, navigateur: "fr" }).journal);
    ok("un parcours n'est pas teinté par ceux qui l'ont précédé", seul === apres,
       "identiques", seul === apres ? "identiques" : "DIFFÉRENTS",
       "deux visiteurs peuvent tourner côte à côte dans le même processus");
  }
}

/* ═══════════════ CE QUE L'OUTIL A VU ET N'A PAS TRANSFORMÉ EN VERDICT

   Rien ici n'est un échec, et rien ici n'a été corrigé — ce n'est pas le rôle
   d'un outil. Ce sont des écarts entre ce que le domaine fait et ce que le site
   promet ailleurs. Ils se disent, ils ne se rangent pas sous le tapis.        */
function controleDoutes(A){
  /* LE PLUS LOURD. `dejaNiveau` ne dit pas « a répondu », il dit « a été
     enregistré ». Or franchir la porte appelle `sauve()`, qui range `niveau: 0`
     — la valeur du code, pas une réponse. */
  {
    const etat = A.etatNeuf();
    A.arrivee(etat, { brut: null, iNiveau: 0, nNiveaux: NIVEAUX.length });
    A.entre(etat, { son: false });                     // range { niveau: 0, deja: true }
    const suivant = A.etatNeuf();
    A.arrivee(suivant, { brut: { deja: true, niveau: 0 }, iNiveau: 0,
                         nNiveaux: NIVEAUX.length });
    if(!A.faudraDemanderNiveau(suivant))
      vu("Franchir la porte suffit à faire croire qu'on a répondu. `entre()` "
         + "enregistre, et `progression.js` range alors `niveau: 0` — la valeur du "
         + "code, pas un choix. Qui entre puis recharge avant la fin de la quête "
         + "ne se verra JAMAIS poser la question du niveau de lecture, et restera "
         + "en « Découverte » sans l'avoir demandé. C'est le défaut le plus lourd "
         + "de ce domaine, et il est reproduit tel quel.");
  }
  // Deux délais pour la même question.
  vu("La question du niveau arrive après 1200 ms quand la quête finit "
     + "normalement (`progression.js`) et après " + A.DELAI_NIVEAU_ABANDON
     + " ms quand on la referme à la croix (ici). Deux nombres pour un seul "
     + "geste, dans deux fichiers différents.");
  // Le compte du menu peut dépasser son total.
  {
    const etat = A.etatNeuf();
    const d = A.ecranMenu(etat, { experiences: EXPERIENCES, missions: MISSIONS,
                                  acquis: MISSIONS.map(m => m.id).concat(["m-bord", "m-jumeaux"]) });
    if(d.chapo.vals && d.chapo.vals.n > d.chapo.vals.total)
      vu("Le menu peut annoncer « " + d.chapo.vals.n + " choses comprises sur "
         + d.chapo.vals.total + " » : `acquis` compte TOUTES les missions rangées, "
         + "le total ne compte que les jouables. Une mémoire d'avant la mise de "
         + "côté des deux missions suffit. Reproduit tel quel.");
  }
  // La minuterie morte de la présentation.
  {
    const page = path.join(ICI, "index.html");
    if(fs.existsSync(page)){
      const html = fs.readFileSync(page, "utf8");
      if(/PR_DUREE\s*=/.test(html) && !/minuterie\s*=\s*setTimeout/.test(html))
        vu("`PR_DUREE = 5200` et sa minuterie sont mortes dans `index.html` : "
           + "l'auto-défilement de la présentation a été retiré, plus personne "
           + "n'arme la minuterie, et `clearTimeout` nettoie le vide. Le module "
           + "ne les reprend pas — c'est une différence, mais sur du code mort.");
      // Les clés de la page ont-elles bougé depuis le relevé ?
      const vues = new Set((html.match(/"(?:accueil|pr)\.[a-zA-Z0-9._-]+"/g) || [])
                             .map(s => s.slice(1, -1)));
      if(vues.size && !memeEnsemble(vues, CLES_PAGE))
        vu("Les clés de libellé d'`index.html` ne sont plus celles relevées le "
           + "8 août 2026 : " + [...vues].filter(k => !CLES_PAGE.includes(k)).map(k => "+" + k)
             .concat(CLES_PAGE.filter(k => !vues.has(k)).map(k => "−" + k)).join(" ")
           + ". Soit la page a été recousue autour du module — c'est attendu — "
           + "soit l'accueil a changé et le module n'est plus interchangeable.");
    }
  }
}

/* ══════════════════════════════════════════════════════ LE DÉROULÉ */
const REJOUABLES = [controleLangue, controleArrivee, controleCorruption,
                    controleChemins, controleNiveau, controleDescripteurs,
                    controleRejoue, controleDeterminisme];

groupe("Le contrat du module");
controleContrat(A);
groupe("La langue — choisie, déduite, ou par défaut");
controleLangue(A);
groupe("L'arrivée — ce que la mémoire dit de qui se présente");
controleArrivee(A);
groupe("La mémoire corrompue — valide, mais de la mauvaise forme");
controleCorruption(A);
groupe("LES QUATRE CHEMINS D'ENTRÉE, joués de bout en bout");
controleChemins(A);
groupe("Le niveau de lecture — après la quête, et une seule fois");
controleNiveau(A);
groupe("Les descripteurs — des clés, jamais du texte traduit");
controleDescripteurs(A);
groupe("Rejouer le premier passage");
controleRejoue(A);
groupe("Le déterminisme");
controleDeterminisme(A);
controleDoutes(A);

/* ══════════════════════════ 10. CET OUTIL SAIT-IL ÉCHOUER ?  (règle 2)

   On rejoue tous les groupes ci-dessus, en silence, sur des modules cassés
   exprès — les uns par enveloppe, les autres sur une copie EN MÉMOIRE du
   source. Le fichier sur le disque n'est jamais touché.

   Un sabotage ne compte que s'il fait tomber un contrôle qui était VERT sur le
   module intact : d'où le relevé de référence. Sans cette précaution, un
   contrôle déjà rouge validerait tous les sabotages du monde.                 */
groupe("Cet outil sait échouer — on casse le module pour le prouver");

function releve(A){
  carnet = [];
  for(const g of REJOUABLES){
    try { g(A); }
    catch(err){ carnet.push({ nom: g.name + " — exception : " + err.message, vrai: false }); }
  }
  const lot = carnet; carnet = null;
  const m = new Map(), vus = new Map();
  for(const c of lot){
    const k = (vus.get(c.nom) || 0); vus.set(c.nom, k + 1);
    m.set(c.nom + "#" + k, c.vrai);
  }
  return m;
}
const REFERENCE = releve(A);

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
     + (tombes.length ? " : " + [...new Set(tombes.slice(0, 3).map(k => k.split("#")[0]))].join(" ; ") : ""),
     vise.length ? undefined
       : "AUCUN — le contrôle visé ne surveille donc rien, et il faut le réécrire");
}
function mutantSource(motif, remplacement){
  if(!SRC.includes(motif)) return null;
  try { return chargeModule(SRC.replace(motif, remplacement)); } catch(_){ return null; }
}

// 1. « déjà venu » lu sur le mauvais champ — le mode de panne qu'on ne voit
//    jamais, puisqu'il ne se manifeste qu'au deuxième passage.
essaie("« déjà venu » lu sur `niveau` au lieu de `deja`",
       mutantSource("const dejaVenu   = !!(brut && brut.deja);",
                    "const dejaVenu   = !!(brut && brut.niveau);"),
       "déjà venu");

// 2. l'entrée qui mène toujours au menu : la présentation ne se joue plus jamais.
essaie("une entrée qui mène toujours au menu",
       Object.assign({}, A, { entre: (etat, e) =>
         Object.assign({}, A.entre(etat, e), { suite: "menu" }) }),
       "présentation");

// 3. la question du niveau reposée à chaque fois.
essaie("une garde du niveau qui dit toujours oui",
       mutantSource("function faudraDemanderNiveau(etat){\n  return !etat.dejaNiveau;\n}",
                    "function faudraDemanderNiveau(etat){\n  return true;\n}"),
       "ne redemande rien");

// 4. la déduction de langue inversée — invisible pour qui a la bonne langue.
essaie("une déduction de langue inversée",
       mutantSource("const code = /^fr/i.test(dit || LANGUE_DEFAUT) ? \"fr\" : \"en\";",
                    "const code = /^en/i.test(dit || LANGUE_DEFAUT) ? \"fr\" : \"en\";"),
       "se déduit du navigateur");

// 5. les deux tables de langue chargées à l'envers.
essaie("l'anglais chargé avant le français",
       mutantSource("fichiersInterface: code === \"en\" ? [\"ui.fr.js\", \"ui.en.js\"] : [\"ui.fr.js\"],",
                    "fichiersInterface: code === \"en\" ? [\"ui.en.js\", \"ui.fr.js\"] : [\"ui.fr.js\"],"),
       "français d'abord");

// 6. un module qui se met à traduire tout seul.
essaie("un descripteur qui porte du texte traduit",
       Object.assign({}, A, { ouvre: etat =>
         Object.assign({}, A.ouvre(etat), { titre: UI_FR["accueil.titre"] }) }),
       "texte d'interface");

// 7. les bornes du niveau qui acceptent n'importe quel entier.
essaie("des bornes de niveau qui ne bornent rien",
       mutantSource("return Number.isInteger(i) && Number.isInteger(n) && i >= 0 && i < n;",
                    "return Number.isInteger(i);"),
       "bornes");

/* ═══════════════════════════════════════ LE RELEVÉ DES CHEMINS D'ENTRÉE */
console.log("\n  LES CHEMINS D'ENTRÉE, VISITÉS");
console.log("  " + "─".repeat(29));
for(const c of RECAP)
  console.log("  " + (c.vert ? "✅" : "❌") + "  " + c.nom.padEnd(32) + c.ecrans);

if(observations.length){
  console.log("\n  CE QUI A ÉTÉ VU ET N'A PAS ÉTÉ TRANSFORMÉ EN VERDICT");
  console.log("  " + "─".repeat(51));
  for(const o of observations) console.log("  ·   " + o);
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHEC" + (echecs > 1 ? "S" : "")
                                + " sur " + n + " contrôles"
                           : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
