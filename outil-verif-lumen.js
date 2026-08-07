/* ============================================================================
   LUMEN — QUAND IL PARLE ET CE QU'IL DIT, ÉPROUVÉ SANS PAGE

       node outil-verif-lumen.js

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL EXISTE

   Le défaut d'origine tient en une phrase d'Hugo, en lançant des photons à la
   chaîne : « ils balancent toujours la même phrase, c'est super chiant, moi je
   veux juste mettre des photons ». La correction fut un repos de soixante-quinze
   secondes par motif — et depuis, RIEN ne la surveillait.

   C'est le genre de règle qu'on ne peut pas éprouver en jouant. Pour savoir si
   le seuil est au bon endroit il faudrait cliquer deux fois à la milliseconde
   près ; pour savoir s'il est par motif ou global, il faudrait tenir deux
   chronomètres et se souvenir de ce qu'on a entendu il y a une minute. Une
   personne devant l'écran ne peut ni l'un ni l'autre. Un calcul, si.

   Trois choses vivent ici et n'étaient mesurées nulle part :

     · le repos, et de quel côté du seuil il bascule ;
     · le fait qu'il soit PAR MOTIF — sans quoi lancer un photon rendrait Lumen
       muet sur tout le reste, ce qui est exactement le contraire du but ;
     · la durée d'affichage, trois bornes et une pente, dont personne n'avait
       jamais vérifié qu'une réplique enrobée de balises se lise aussi longtemps
       que la même réplique nue.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ  (règle 3)

   Jamais de `lumen.js` recopié en face de lui-même. Quatre sources, toutes
   extérieures au module :

   1. `index.html`, le code que ce module remplace. Tant que l'original y est,
      cet outil en EXTRAIT les nombres — 75000, 16000, 5200, 3000, 54 — et les
      compare à ceux du module. C'est l'arbitre le plus dur qu'on ait : il rend
      l'extraction interchangeable ou il la refuse. Le jour où la page aura été
      opérée, l'arbitre disparaît de lui-même et le dit en observation ; les
      valeurs restent alors transcrites ci-dessous, avec leur provenance.
   2. `contenu.js`, qui porte les vraies répliques. Les motifs se jouent sur la
      VRAIE table, pas sur une table inventée qui s'accorderait avec le module.
      C'est aussi elle qui arbitre les niveaux de lecture : `accueil` porte trois
      versions dont les identifiants finissent par 0, 1 et 2.
   3. L'arithmétique, faite à la main. Les durées attendues aux quatre bornes
      sont écrites en clair — 5200, 5214, 15960, 16000 — et non recalculées par
      la formule qu'on prétend contrôler.
   4. Les appels de la page eux-mêmes : `reagit("…")` dans `index.html` et
      `ordres.reaction` dans `lieux.js` donnent la liste des motifs réellement
      demandés. Un motif demandé qui n'existe pas dans `contenu.js` se dit.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le dernier groupe casse le module en mémoire — sept sabotages, sur une copie
   EN MÉMOIRE du source, jamais sur le fichier — et exige que le contrôle visé
   TOMBE. Un sabotage qui ne fait tomber que des contrôles déjà rouges ne compte
   pas : on compare à un relevé de référence pris sur le module intact.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS

   Rien de ce que la page PEINT ni de ce qu'elle FAIT ENTENDRE. Que la bulle
   s'affiche, que le bouton « d'où ça sort ? » s'ouvre, qu'une voix ne coupe pas
   l'autre — cela se juge à l'œil et à l'oreille, dans `?juge`. Ce qui est mesuré
   ici, c'est la décision : parler ou se taire, quoi dire, combien de temps.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN = path.join(ICI, "lumen.js");

console.log("\n  LUMEN — LE REPOS, LE CHOIX, LA DURÉE");
console.log("  ════════════════════════════════════");

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
   échouer. */
if(!fs.existsSync(CHEMIN))
  stop("lumen.js n'existe pas — RIEN N'A ÉTÉ MESURÉ", [
    "Cet outil est la condition du branchement du module dans la page.",
    "Tant que le fichier manque, il refuse de conclure.",
  ]);

const SRC = fs.readFileSync(CHEMIN, "utf8");

/* Le module ne doit toucher NI au document, NI au son, NI à l'horloge. On ne le
   lui demande pas gentiment — on empoisonne les noms. Toute lecture d'une
   propriété de `performance`, `Date` ou `document` lève, au chargement comme à
   l'usage, et le contrôle qui l'a déclenchée tombe.

   `performance` et `Date` sont les deux qui comptent vraiment ici : l'original
   appelait `performance.now()` trois fois pour un seul geste, et c'est
   précisément ce qui rendait le repos inéprouvable. */
const NOMS_INTERDITS = ["document", "localStorage", "sessionStorage", "navigator",
                        "location", "alert", "fetch", "XMLHttpRequest",
                        "requestAnimationFrame", "setTimeout", "setInterval",
                        "performance", "Date", "Audio"];
function poison(nom){
  const boum = cle => { throw new Error("le module a touché `" + nom
                                        + (cle ? "." + String(cle) : "()") + "`"); };
  return new Proxy(function(){}, { get: (_, cle) => boum(cle), apply: () => boum(null) });
}

/* `Math` aussi entre par la porte, et son `random` est sous surveillance.

   Le sac de tirage a le droit de tirer au sort — c'est son métier — mais un
   module qui tire au sort SANS QU'ON LE LUI DEMANDE n'est pas reproductible, et
   le déterminisme est la condition de tout le reste de ce fichier. Par défaut,
   `Math.random` LÈVE : si le module s'en sert alors qu'on lui a passé une
   source de hasard, tout tombe d'un coup et l'on sait pourquoi. Un seul contrôle
   le remplace par un compteur, pour prouver que le repli existe quand même. */
function fauxMath(surRandom){
  return new Proxy(Math, { get: (c, k) => k === "random" ? surRandom : c[k] });
}
const RANDOM_INTERDIT = () => {
  throw new Error("le module a appelé `Math.random()` alors qu'`e.alea` lui était donné");
};

function chargeModule(src, surRandom){
  const bac = {};
  new Function("window", "global", "globalThis", "self", "Math", ...NOMS_INTERDITS, src)
    (bac, bac, bac, bac, fauxMath(surRandom || RANDOM_INTERDIT), ...NOMS_INTERDITS.map(poison));
  return bac.LUMEN || null;
}

let L;
try { L = chargeModule(SRC); }
catch(err){
  stop("lumen.js ne se charge pas hors navigateur — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "",
    "Le module doit pouvoir s'évaluer sans document, sans son et sans horloge.",
    "C'est ce qui rend tous les modules de ce dépôt vérifiables en ligne de commande.",
  ]);
}
if(!L) stop("lumen.js s'est chargé mais n'expose pas `LUMEN`", [
  "attendu   global.LUMEN = { … }",
]);

/* ─────────────────────────────────── LA VÉRITÉ Nº2 : LE CONTENU RÉEL */
const chargeFichier = f => {
  const w = {};
  new Function("window", fs.readFileSync(path.join(ICI, f), "utf8"))(w);
  return w;
};
const CONTENU = chargeFichier("contenu.js").CONTENU;
if(!CONTENU || !CONTENU.reactions)
  stop("contenu.js ne rend pas les réactions — RIEN N'A ÉTÉ MESURÉ", [
    "Les motifs se jouent sur la VRAIE table. Une table inventée s'accorderait",
    "avec le module au lieu de l'arbitrer.",
  ]);
const REACTIONS = CONTENU.reactions;
const CLES = Object.keys(REACTIONS);

/* ─────────────────── LA VÉRITÉ Nº1 : L'ORIGINAL, TANT QU'IL EST ENCORE LÀ

   Ces cinq nombres sont l'oreille d'Hugo. Ils sont transcrits ici avec leur
   provenance, et confrontés au source de la page tant que le bloc d'origine y
   vit. Après l'opération, la confrontation n'a plus lieu et l'outil le dit :
   mieux vaut un arbitre qui se déclare absent qu'un arbitre qui s'invente.   */
const ATTENDU = { REPOS: 75000, plafond: 16000, plancher: 5200,
                  socle: 3000, parCaractere: 54 };

let PAGE = "";
try { PAGE = fs.readFileSync(path.join(ICI, "index.html"), "utf8"); } catch(_){ }

function controleOriginal(L){
  const mRepos = /const REPOS = (\d+);/.exec(PAGE);
  const mDuree = /Math\.min\((\d+),\s*Math\.max\((\d+),\s*(\d+)\s*\+\s*n\s*\*\s*(\d+)\)\)/.exec(PAGE);
  const mBalises = PAGE.includes('html.replace(/<[^>]+>/g, "").length');

  if(mRepos)
    ok("le repos du module est celui d'index.html", Number(mRepos[1]) === L.REPOS,
       mRepos[1] + " ms (relevé dans index.html)", L.REPOS + " ms",
       "l'extraction doit être interchangeable avec ce qu'elle remplace : ce n'est "
       + "pas au module de décider ce que vaut le silence de Lumen");
  else
    vu("index.html ne contient plus `const REPOS = …` : l'original a été retiré de "
       + "la page, et l'arbitre le plus dur de cet outil n'est plus disponible. Les "
       + "75000 ms restent transcrits ici avec leur provenance.");

  if(mDuree){
    const p = mDuree.map(Number);
    ok("les quatre nombres de la durée sont ceux d'index.html",
       p[1] === L.DUREE.plafond && p[2] === L.DUREE.plancher
       && p[3] === L.DUREE.socle && p[4] === L.DUREE.parCaractere,
       "plafond " + p[1] + ", plancher " + p[2] + ", socle " + p[3] + ", pente " + p[4],
       "plafond " + L.DUREE.plafond + ", plancher " + L.DUREE.plancher
       + ", socle " + L.DUREE.socle + ", pente " + L.DUREE.parCaractere,
       "relevés dans le `dit()` de la page — ils y sont écrits en dur, sans nom");
  } else {
    vu("index.html ne contient plus la formule de durée : l'arbitre d'origine a "
       + "disparu avec l'opération. Les quatre nombres restent transcrits ici.");
  }

  if(!mBalises)
    vu("index.html ne contient plus le retrait des balises avant le compte des "
       + "caractères : même remarque.");

  // Et le filet de sécurité, qui ne dépend de rien : la transcription elle-même.
  ok("les cinq constantes valent ce que l'oreille d'Hugo a posé",
     L.REPOS === ATTENDU.REPOS && L.DUREE.plafond === ATTENDU.plafond
     && L.DUREE.plancher === ATTENDU.plancher && L.DUREE.socle === ATTENDU.socle
     && L.DUREE.parCaractere === ATTENDU.parCaractere,
     JSON.stringify(ATTENDU),
     JSON.stringify(Object.assign({ REPOS: L.REPOS }, L.DUREE)),
     "aucune n'est calculée, aucune n'est justifiable ailleurs qu'à l'usage : "
     + "elles se relisent, elles ne se dérivent pas");
}

/* ─────────────────────────────────────────── LE HASARD, À GRAINE

   Un générateur congruentiel, écrit ici et non pris ailleurs : il n'a pas à
   être bon, il a seulement à être le MÊME deux fois de suite. C'est ce qui
   permet d'exiger du module qu'il rende exactement la même réplique quand on
   lui repasse la même partie.                                                */
function graine(s){
  let x = (s >>> 0) || 1;
  return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; };
}

// L'entrée type de `reagit`, avec de quoi la retoucher champ par champ.
function entree(cle, sup){
  return Object.assign({ cle, doux: false, reactions: REACTIONS, iNiveau: 0,
                         questionsOuvertes: false, tMasque: 0, alea: graine(7) }, sup);
}

/* ══════════════════════════════════════════════════════ 1. LE CONTRAT */
function controleContrat(L){
  const GENRES = {
    REPOS: "number", DUREE: "object", etatNeuf: "function", longueur: "function",
    duree: "function", texte: "function", tire: "function", resous: "function",
    reagit: "function",
  };
  const manque = Object.keys(GENRES).filter(k => typeof L[k] !== GENRES[k]);
  ok("les neuf noms du contrat sont là, du bon genre", manque.length === 0,
     "9 noms", manque.length ? "manquent ou faux : " + manque.join(", ") : "9",
     "la liste vient de l'en-tête du module, pas de son code");

  const etat = L.etatNeuf();
  ok("`etatNeuf()` rend la mémoire des dernières fois et les sacs",
     etat.derniereFois instanceof Map && etat.derniereFois.size === 0
     && typeof etat.sacs === "object" && typeof etat.sacs.get === "function",
     "une Map vide et un sac", Object.keys(etat).join(", "));

  const a = L.etatNeuf(), b = L.etatNeuf();
  a.derniereFois.set("photon", 1000);
  ok("deux états ne se partagent rien",
     b.derniereFois.size === 0 && a.derniereFois !== b.derniereFois && a.sacs !== b.sacs,
     "indépendants", b.derniereFois.size + " motif(s) dans le second",
     "le module n'a aucune variable vivante : deux parties peuvent tourner côte "
     + "à côte, et un contrôle repart d'un état propre sans rien réinitialiser");

  // La forme d'un ordre, une fois pour toutes.
  const o = L.reagit(L.etatNeuf(), entree("photon"), 0);
  ok("un ordre porte son motif et sa bulle complète",
     o && o.cle === "photon" && o.bulle && typeof o.bulle.texte === "string"
     && typeof o.bulle.ms === "number" && o.bulle.prioritaire === false
     && o.bulle.replique === REACTIONS.photon,
     "{ cle, bulle:{ replique, texte, ms, prioritaire:false } }",
     o ? JSON.stringify({ cle: o.cle, ms: o.bulle.ms,
                          prioritaire: o.bulle.prioritaire,
                          replique: o.bulle.replique === REACTIONS.photon }) : "null",
     "`replique` est l'objet de `contenu.js` lui-même : la page en tire la voix "
     + "et le bouton de justification, qu'elle ne saurait pas reconstruire "
     + "depuis le seul html");
  ok("une réaction n'est JAMAIS prioritaire",
     CLES.every(c => { const r = L.reagit(L.etatNeuf(), entree(c), 1000);
                       return !r || r.bulle.prioritaire === false; }),
     "faux pour les " + CLES.length + " motifs",
     CLES.filter(c => { const r = L.reagit(L.etatNeuf(), entree(c), 1000);
                        return r && r.bulle.prioritaire !== false; }).join(", ")
     || "faux partout",
     "seule une demande explicite — cliquer sur Lumen, choisir une question, "
     + "changer de voix — coupe une parole en cours, et ces chemins-là n'entrent "
     + "pas ici");
}

/* ═════════════════════════════ 2. LE REPOS, DES DEUX CÔTÉS DU SEUIL

   Le contrôle le plus utile du fichier, et celui qu'aucune partie jouée ne
   remplacerait : personne ne sait cliquer à la milliseconde près.

   Le seuil est STRICT dans l'original — `now - dernier < REPOS` refuse — donc à
   75000 ms tout ronds, Lumen reparle. Un `<=` écrit à la place ne se verrait
   jamais autrement qu'ici.                                                   */
function parleA(L, ecart, cle){
  const etat = L.etatNeuf();
  const c = cle || "photon";
  const premier = L.reagit(etat, entree(c), 100000);
  const second  = L.reagit(etat, entree(c), 100000 + ecart);
  return { premier: !!premier, second: !!second };
}

function controleRepos(L){
  ok("la toute première fois, un motif parle sans condition",
     parleA(L, 0).premier === true, "il parle",
     parleA(L, 0).premier ? "il parle" : "il se tait",
     "aucune date n'est encore rangée pour lui : le module ne doit pas traiter "
     + "l'absence comme un silence tout frais");

  const justeAvant = parleA(L, ATTENDU.REPOS - 1);
  const pile       = parleA(L, ATTENDU.REPOS);
  ok("le repos dure exactement 75000 ms — il se tait à 74999, il parle à 75000",
     justeAvant.second === false && pile.second === true,
     "muet à +74999 ms, parlant à +75000 ms",
     (justeAvant.second ? "PARLE à +74999" : "muet à +74999") + " / "
     + (pile.second ? "parle à +75000" : "MUET à +75000"),
     "c'est un `<` ou un `<=` qui décide, et un seuil déplacé d'une milliseconde "
     + "ne se voit jamais en jouant");

  const large = parleA(L, ATTENDU.REPOS + 100);
  const court = parleA(L, ATTENDU.REPOS - 100);
  ok("et de part et d'autre à cent millisecondes, même verdict",
     court.second === false && large.second === true,
     "muet à 74,9 s, parlant à 75,1 s",
     (court.second ? "PARLE à 74,9 s" : "muet") + " / "
     + (large.second ? "parle à 75,1 s" : "MUET à 75,1 s"));

  // Le repos court depuis la DERNIÈRE prise de parole, pas depuis la première.
  {
    const etat = L.etatNeuf();
    L.reagit(etat, entree("photon"), 0);
    L.reagit(etat, entree("photon"), ATTENDU.REPOS);            // reparle : l'heure bouge
    const trop = L.reagit(etat, entree("photon"), ATTENDU.REPOS + ATTENDU.REPOS - 1);
    const juste = L.reagit(L.etatNeuf(), entree("photon"), 1);
    ok("le repos repart de la dernière fois, pas de la première",
       trop === null && juste !== null, "muet à 149999 ms du départ",
       trop ? "il reparle" : "muet",
       "sinon le silence se raccourcirait à chaque prise de parole, jusqu'à ne "
       + "plus rien retenir du tout");
  }

  /* Un motif qu'on essaie sans arrêt reste muet. C'est le geste d'Hugo :
     il n'a pas lâché un photon, il en a lâché vingt.

     Le compte part de 1000 ms et non de zéro, et ce n'est pas de la coquetterie :
     voir l'observation sur l'instant zéro, en bas de cette sortie. */
  {
    const etat = L.etatNeuf();
    let paroles = 0;
    for(let t = 1000; t < 1000 + ATTENDU.REPOS; t += 500)
      if(L.reagit(etat, entree("photon"), t)) paroles++;
    ok("cent cinquante photons d'affilée ne donnent qu'UNE phrase", paroles === 1,
       "1 parole sur 150 gestes", paroles + " parole(s)",
       "« ils balancent toujours la même phrase, c'est super chiant, moi je veux "
       + "juste mettre des photons » — c'est ce geste-là qui a fait la règle");
  }
}

/* ═══════════════════════════════════ 3. LE REPOS EST PAR MOTIF, PAS GLOBAL

   C'est la moitié du sens de la règle, et c'est la moitié qu'un repos global
   détruirait sans qu'on s'en aperçoive : le site continuerait de parler, mais
   il parlerait de la mauvaise chose au mauvais moment.                       */
function controleParMotif(L){
  {
    const etat = L.etatNeuf();
    const photon = L.reagit(etat, entree("photon"), 1000);
    const pluie  = L.reagit(etat, entree("pluie"),  1001);
    const encore = L.reagit(etat, entree("photon"), 1002);
    ok("le repos est PAR MOTIF : un photon ne muselle pas la pluie de sondes",
       !!photon && !!pluie && encore === null,
       "photon parle, pluie parle, photon se tait",
       (photon ? "photon" : "RIEN") + " / " + (pluie ? "pluie" : "RIEN")
       + " / " + (encore ? "PHOTON ENCORE" : "photon muet"),
       "un repos global rendrait Lumen muet sur tout ce qui arrive de neuf "
       + "pendant qu'on répète un geste — exactement le contraire du but");
  }
  {
    // Tous les motifs de `contenu.js`, dans la même seconde : tous doivent parler.
    const etat = L.etatNeuf();
    const muets = CLES.filter((c, i) => !L.reagit(etat, entree(c), 1000 + i));
    ok("les quinze motifs du contenu peuvent parler dans la même seconde",
       muets.length === 0, "aucun muet",
       muets.length ? muets.join(", ") : "aucun",
       "chacun a sa propre horloge ; rien ne se partage entre deux motifs");
    // …et aucun ne reparle ensuite.
    const bavards = CLES.filter((c, i) => L.reagit(etat, entree(c), 1000 + i + 60000));
    ok("et une minute plus tard, aucun n'a repris la parole", bavards.length === 0,
       "aucun", bavards.length ? bavards.join(", ") : "aucun");
  }
}

/* ═════════════════════════════════════════ 4. LA DURÉE SUIT LE TEXTE

   Trois bornes et une pente. Les durées attendues sont calculées À LA MAIN
   ci-dessous et non par la formule qu'on contrôle : 3000 + 41 × 54 = 5214 se
   pose sur une feuille, pas dans le module.

   Les quatre bornes exactes :
     n = 40  → 3000 + 2160 = 5160, sous le plancher → 5200
     n = 41  → 3000 + 2214 = 5214, premier point du régime linéaire
     n = 240 → 3000 + 12960 = 15960, dernier point du régime linéaire
     n = 241 → 3000 + 13014 = 16014, au-dessus du plafond → 16000            */
const DUREES_A_LA_MAIN = [
  { n: 0,    ms: 5200,  regime: "plancher", note: "un texte vide reste quand même 5,2 s "
      + "à l'écran : c'est le temps de comprendre que quelqu'un a parlé" },
  { n: 40,   ms: 5200,  regime: "plancher" },
  { n: 41,   ms: 5214,  regime: "pente",    note: "3000 + 41 × 54 = 5214" },
  { n: 100,  ms: 8400,  regime: "pente",    note: "3000 + 100 × 54 = 8400" },
  { n: 200,  ms: 13800, regime: "pente",    note: "3000 + 200 × 54 = 13800" },
  { n: 240,  ms: 15960, regime: "pente",    note: "3000 + 240 × 54 = 15960" },
  { n: 241,  ms: 16000, regime: "plafond",  note: "3000 + 241 × 54 = 16014, écrêté" },
  { n: 2000, ms: 16000, regime: "plafond",  note: "une tirade entière ne tient pas "
      + "l'écran plus longtemps qu'une phrase de quarante mots" },
];

function controleDuree(L){
  const rate = DUREES_A_LA_MAIN.filter(c => L.duree("x".repeat(c.n)) !== c.ms);
  ok("la durée suit le texte sur les huit points calculés à la main",
     rate.length === 0, "8 sur 8",
     rate.length ? rate.map(c => "n=" + c.n + " attendu " + c.ms + " rendu "
                                 + L.duree("x".repeat(c.n))).join(" ; ") : "8 sur 8",
     "les valeurs viennent de l'arithmétique, pas de la formule qu'on éprouve");

  // Les bornes, une par une et des deux côtés — les trois régimes, pas un tiers.
  ok("la durée — le plancher tient : 5200 ms pour un texte vide comme pour 40 signes",
     L.duree("") === 5200 && L.duree("x".repeat(40)) === 5200
     && L.duree("x".repeat(41)) === 5214,
     "5200 / 5200 / 5214",
     L.duree("") + " / " + L.duree("x".repeat(40)) + " / " + L.duree("x".repeat(41)),
     "sans plancher, une réplique de six mots passerait en 3,3 s et personne "
     + "n'aurait le temps de lever les yeux");
  ok("la durée — le plafond tient : 15960 ms à 240 signes, 16000 au-delà",
     L.duree("x".repeat(240)) === 15960 && L.duree("x".repeat(241)) === 16000
     && L.duree("x".repeat(10000)) === 16000,
     "15960 / 16000 / 16000",
     L.duree("x".repeat(240)) + " / " + L.duree("x".repeat(241)) + " / "
     + L.duree("x".repeat(10000)),
     "sans plafond, une tirade de mille signes occuperait l'écran cinquante-sept "
     + "secondes, et l'on ne pourrait plus rien faire");
  ok("la durée — la pente vaut 54 ms par caractère entre les deux bornes",
     L.duree("x".repeat(101)) - L.duree("x".repeat(100)) === 54
     && L.duree("x".repeat(200)) - L.duree("x".repeat(100)) === 5400,
     "54 ms de plus par signe, 5400 pour cent",
     (L.duree("x".repeat(101)) - L.duree("x".repeat(100))) + " / "
     + (L.duree("x".repeat(200)) - L.duree("x".repeat(100))),
     "les trois régimes sont éprouvés, pas un seul : une formule juste au milieu "
     + "et fausse aux bords se lit tous les jours et ne se voit jamais");
  ok("la durée ne décroît jamais quand le texte s'allonge",
     (() => { let p = 0;
              for(let i = 0; i <= 400; i++){ const d = L.duree("x".repeat(i));
                if(d < p) return false; p = d; } return true; })(),
     "croissante sur 0…400 signes",
     (() => { let p = 0;
              for(let i = 0; i <= 400; i++){ const d = L.duree("x".repeat(i));
                if(d < p) return "elle redescend à " + i + " signes"; p = d; }
              return "croissante"; })());
}

/* ═════════════════════════ 5. LES BALISES NE SE LISENT PAS, DONC NE SE COMPTENT PAS

   Le vrai contenu est truffé de `<b>`, `<i>` et `<br>`. Si les balises
   comptaient, c'est le BALISAGE qui déciderait du temps de lecture : deux
   phrases identiques, l'une soulignée, resteraient l'une seize secondes et
   l'autre onze. Personne ne le verrait — on ne compare pas deux affichages qui
   n'arrivent jamais ensemble.                                                */
function controleBalises(L){
  const nu = "Un trou noir n'aspire rien du tout, il tombe dessus.";
  const orne = "<b>Un trou noir</b> n'aspire <i>rien du tout</i>, il tombe dessus.";
  ok("les balises ne se comptent pas : le même texte, nu ou enrobé, dure pareil",
     L.duree(nu) === L.duree(orne) && L.longueur(nu) === L.longueur(orne),
     nu.length + " signes visibles des deux côtés",
     L.longueur(nu) + " nus contre " + L.longueur(orne) + " enrobés — "
     + L.duree(nu) + " ms contre " + L.duree(orne) + " ms",
     "sinon c'est le balisage qui décide du rythme de lecture, et il en décide "
     + "en secret");

  // Un cas construit pour tomber de part et d'autre d'une borne si on se trompe.
  {
    const dix = "un deux trois quatre cinq six sept huit neuf dix";   // 48 signes
    const gras = "<b>" + dix + "</b>";
    ok("dix mots enrobés de `<b>` donnent la durée des dix mots nus",
       L.duree(gras) === L.duree(dix) && L.duree(dix) === 3000 + 48 * 54,
       "5592 ms des deux côtés",
       L.duree(dix) + " nus / " + L.duree(gras) + " enrobés",
       "48 signes tombent dans le régime linéaire : les 7 signes de `<b></b>` "
       + "vaudraient 378 ms de plus, soit une différence bien réelle");
  }
  ok("un long enrobage ne fait pas franchir le plafond",
     L.duree("<span class='justif'>" + "x".repeat(200) + "</span>") === 13800,
     "13800 ms (200 signes visibles)",
     L.duree("<span class='justif'>" + "x".repeat(200) + "</span>"),
     "les attributs comptent parmi les caractères d'une balise, pas parmi ceux "
     + "d'un texte");

  // Et la vraie table de contenu passe par là.
  {
    const brut = REACTIONS.embarque.t;
    ok("une vraie réplique de `contenu.js` se mesure sur son texte visible",
       L.longueur(brut) === brut.replace(/<[^>]+>/g, "").length
       && L.longueur(brut) < brut.length,
       "moins de signes que la source brute",
       L.longueur(brut) + " visibles sur " + brut.length + " bruts");
  }
}

/* ══════════════════════════ 6. `doux` — LE MONDE N'INTERROMPT PAS LA LECTURE

   Une réaction douce vient du monde : une sonde avalée, un photon qui s'échappe.
   Elle n'a rien demandé, donc elle attend. Une réaction non douce vient d'un
   clic : on a demandé quelque chose, on attend une réponse tout de suite.    */
function controleDoux(L){
  const T_MASQUE = 50000;
  const mot = o => o ? "elle parle" : "muette";
  {
    const etat = L.etatNeuf();
    const doux = L.reagit(etat, entree("avalee", { doux: true, tMasque: T_MASQUE }),
                          T_MASQUE - 1);
    ok("`doux` ne coupe pas une bulle en cours", doux === null, "muette", mot(doux),
       "une sonde qu'on regarde tomber ne doit pas chasser la phrase qu'on est "
       + "en train de lire");
  }
  {
    const etat = L.etatNeuf();
    const dur = L.reagit(etat, entree("avalee", { doux: false, tMasque: T_MASQUE }),
                         T_MASQUE - 1);
    ok("une réaction NON douce, elle, coupe la bulle en cours", dur !== null,
       "elle parle", mot(dur),
       "un bouton pressé attend une réponse : la faire attendre la fin d'une "
       + "phrase qu'on n'a pas demandée serait un site qui n'écoute pas");
  }
  {
    const etat = L.etatNeuf();
    const apres = L.reagit(etat, entree("avalee", { doux: true, tMasque: T_MASQUE }),
                           T_MASQUE + 1);
    ok("et une fois la bulle effacée, la réaction douce passe", apres !== null,
       "elle parle", mot(apres),
       "le refus tient à la bulle, pas au caractère doux");
  }
  {
    const etat = L.etatNeuf();
    const rien = L.reagit(etat, entree("avalee", { doux: true, tMasque: 0 }), 1000);
    ok("`tMasque` à zéro veut dire « aucune bulle » et non « bulle éternelle »",
       rien !== null, "elle parle", mot(rien),
       "une bulle refermée remet `tMasque` à zéro : si le module y lisait « masqué "
       + "pour toujours », Lumen ne dirait plus jamais rien de spontané après la "
       + "première fermeture, et personne ne saurait rattacher ce silence au clic "
       + "qui l'a causé");
  }
  {
    // Le refus doux ne consomme pas le repos : le motif doit pouvoir parler après.
    const etat = L.etatNeuf();
    L.reagit(etat, entree("avalee", { doux: true, tMasque: T_MASQUE }), T_MASQUE - 1);
    const apres = L.reagit(etat, entree("avalee", { doux: true, tMasque: 0 }), T_MASQUE);
    ok("une réaction refusée pour cause de bulle ne brûle pas son repos",
       apres !== null, "elle parle une milliseconde plus tard", mot(apres),
       "sinon un refus d'une milliseconde coûterait soixante-quinze secondes de "
       + "silence, et le motif serait puni d'avoir été poli");
  }
}

/* ══════════════════════════ 7. LES QUESTIONS OUVERTES COUPENT TOUT

   Six boutons sont à l'écran et l'on attend un choix. Écrire par-dessus
   effacerait la question qu'on était en train de lire — c'est le défaut qui
   avait déjà mangé l'étape « a-lumen » de la quête d'accueil.                */
function controleQuestions(L){
  const etat = L.etatNeuf();
  const cas = [
    { nom: "douce", sup: { doux: true, questionsOuvertes: true } },
    { nom: "non douce", sup: { doux: false, questionsOuvertes: true } },
  ];
  const parlantes = cas.filter(c => L.reagit(etat, entree("photon", c.sup), 1000));
  ok("les questions ouvertes coupent tout, douce ou non",
     parlantes.length === 0, "les deux muettes",
     parlantes.map(c => c.nom).join(", ") || "les deux muettes",
     "six boutons attendent un choix : écrire par-dessus efface la question "
     + "qu'on était en train de lire");
  const apres = L.reagit(etat, entree("photon", { questionsOuvertes: false }), 1001);
  ok("et le refus des questions ne brûle pas le repos du motif", apres !== null,
     "il parle dès que les questions se referment", apres ? "il parle" : "muet",
     "un refus qui coûte soixante-quinze secondes de silence est un refus qui "
     + "punit");
}

/* ══════════════════════════════ 8. UN MOTIF INCONNU NE FAIT RIEN

   Ce n'est pas un cas d'école : la page appelle `reagit("vitesse")` au clic sur
   un poste horaire du salon, et `reagit("vitesse" + i)` pour quatre crans dont
   deux seulement ont une réplique. Trois motifs demandés sur quinze n'existent
   pas dans `contenu.js`.                                                     */
function controleInconnu(L){
  const etat = L.etatNeuf();
  // Les motifs réellement demandés par la page et absents de `contenu.js`, plus
  // la clé vide, qu'une concaténation ratée produirait.
  const faux = ["vitesse", "vitesse1", "vitesse2", ""];
  let leve = null, parle = [];
  try {
    for(const c of faux) if(L.reagit(etat, entree(c), 1000)) parle.push(c);
  } catch(err){ leve = err; }
  ok("un motif inconnu ne fait rien et ne lève pas",
     leve === null && parle.length === 0, "aucune parole, aucune exception",
     leve ? leve.name + " : " + leve.message : (parle.join(", ") || "rien"),
     "ce ne sont pas des cas d'école : la page appelle bel et bien ces trois-là");

  /* Un appel resté sans réponse ne doit pas marquer l'heure. On le prouve en
     donnant au motif une réplique ENTRE les deux appels : s'il a été muselé au
     premier, il se taira au second alors qu'il aurait dû parler. */
  const doteDeVitesse = Object.assign({}, REACTIONS, { vitesse: REACTIONS.photon });
  const apres = (() => {
    const e2 = L.etatNeuf();
    L.reagit(e2, entree("vitesse"), 1000);                       // rien à dire
    return L.reagit(e2, entree("vitesse", { reactions: doteDeVitesse }), 2000);
  })();
  ok("une clé inconnue ne consomme pas le repos d'une clé qui existe",
     apres !== null, "elle parle dès qu'elle a une réplique",
     apres ? "elle parle" : "elle a été muselée",
     "sinon écrire un jour la réplique manquante la ferait taire soixante-quinze "
     + "secondes après un appel qui n'avait rien dit");

  ok("une table de réactions absente ne fait pas lever",
     (() => { try { return L.reagit(L.etatNeuf(),
                { cle: "photon", reactions: undefined, iNiveau: 0 }, 0) === null; }
              catch(_){ return false; } })(),
     "null", "une exception",
     "la page branche la table au chargement du contenu ; un ordre parti avant "
     + "ne doit pas emporter la boucle de rendu");
}

/* ══════════════════════════════════ 9. LE DÉTERMINISME

   Sans lui, rien de ce qui précède n'est éprouvable : un module qui rend une
   réponse différente à chaque fois ne se contrôle pas, il s'observe.

   La difficulté est réelle et assumée : le choix d'une réplique tire au sort.
   C'est pour ça que la source de hasard entre par `e.alea`. On rejoue donc deux
   fois la même partie avec la même graine, et l'on exige le même journal — puis
   on change la graine, et l'on exige qu'il change, sans quoi le contrôle
   passerait aussi sur un module qui dit toujours la même chose.              */
function partie(L, s){
  const etat = L.etatNeuf(), alea = graine(s), journal = [];
  for(let t = 0, i = 0; t < 400000; t += 6000, i++){
    const cle = CLES[i % CLES.length];
    const o = L.reagit(etat, entree(cle, { alea }), t);
    journal.push(o ? o.cle + "|" + (o.bulle.replique && o.bulle.replique.id)
                     + "|" + o.bulle.ms : "—");
  }
  return journal.join("\n");
}

function controleDeterminisme(L){
  const a = partie(L, 12345), b = partie(L, 12345), c = partie(L, 999);
  ok("même état, même horloge, mêmes entrées → même sortie", a === b,
     "deux parties identiques",
     a === b ? "identiques" : "elles divergent",
     "c'est la condition de tout le reste : un module qu'on ne peut pas rejouer "
     + "ne se contrôle pas, il s'observe");
  ok("et une autre graine donne une autre partie", a !== c,
     "des parties différentes",
     a !== c ? "différentes" : "identiques malgré la graine",
     "sans ce second point, un module qui dirait toujours la même réplique "
     + "passerait le contrôle du dessus haut la main");

  // Le module ne lit pas l'horloge : on la lui donne, il ne la prend pas.
  {
    const etat = L.etatNeuf();
    const tot = L.reagit(etat, entree("traj"), 10);
    const tard = L.reagit(L.etatNeuf(), entree("traj"), 1e12);
    ok("l'instant vient de l'appelant : la même scène à deux époques dit pareil",
       !!tot && !!tard && tot.bulle.ms === tard.bulle.ms,
       "même durée à 10 ms et à 1e12 ms",
       (tot ? tot.bulle.ms : "rien") + " / " + (tard ? tard.bulle.ms : "rien"),
       "l'original lisait `performance.now()` trois fois pour un seul geste ; "
       + "ici l'horloge est empoisonnée et le module ne la touche pas");
  }
}

/* ═══════════════════════ 10. LE SAC DE TIRAGE, ET LES NIVEAUX DE LECTURE

   Le sac est de la décision pure : c'est lui qui garantit qu'on entend les
   douze répliques d'inactivité avant d'en réentendre une. Il se contrôle sur
   la VRAIE liste de `contenu.js`, sur deux cents graines, parce qu'une propriété
   de mélange ne se juge pas sur un tirage.                                   */
function controleSac(L){
  const liste = REACTIONS.inactif;
  ok("la table d'inactivité porte bien plusieurs répliques",
     Array.isArray(liste) && liste.length >= 3, "au moins 3", liste && liste.length,
     "sinon le contrôle du sac ne prouverait rien — il faut de quoi se répéter");

  let ratesPassage = 0, ratesCouture = 0, uniques = new Set();
  for(let s = 1; s <= 200; s++){
    const etat = L.etatNeuf(), alea = graine(s);
    const un = [], deux = [];
    for(let i = 0; i < liste.length; i++) un.push(L.tire(etat, liste, alea));
    for(let i = 0; i < liste.length; i++) deux.push(L.tire(etat, liste, alea));
    if(new Set(un).size !== liste.length || new Set(deux).size !== liste.length)
      ratesPassage++;
    if(deux[0] === un[un.length - 1]) ratesCouture++;
    uniques.add(un.map(r => r.id).join(","));
  }
  ok("toutes les répliques passent avant qu'aucune revienne", ratesPassage === 0,
     "0 paquet fautif sur 200", ratesPassage + " paquet(s) fautif(s)",
     "tirer au sort à chaque fois paraît juste et ne l'est pas : par l'effet "
     + "anniversaire on entend un doublon au bout de quelques tirages");
  ok("et la première du nouveau paquet n'est jamais la dernière de l'ancien",
     ratesCouture === 0, "0 couture audible sur 200", ratesCouture + " couture(s)",
     "c'est le seul doublon que le sac ne saurait pas éviter tout seul, et c'est "
     + "précisément celui qu'on entendrait");
  ok("le mélange mélange vraiment", uniques.size > 100,
     "plus de 100 ordres distincts sur 200 graines", uniques.size + " ordres",
     "un sac toujours rendu dans le même ordre serait une liste, pas un sac");

  ok("une liste d'une seule réplique rend toujours la même",
     L.tire(L.etatNeuf(), [REACTIONS.photon], graine(1)) === REACTIONS.photon,
     "la réplique",
     L.tire(L.etatNeuf(), [REACTIONS.photon], graine(1)) === REACTIONS.photon
       ? "la réplique" : "autre chose");

  // Deux états ne partagent pas leurs sacs.
  {
    const a = L.etatNeuf(), b = L.etatNeuf(), g = graine(3);
    for(let i = 0; i < liste.length; i++) L.tire(a, liste, g);
    const premierDeB = L.tire(b, liste, graine(3));
    const premierDeA2 = L.tire(L.etatNeuf(), liste, graine(3));
    ok("deux parties ne se partagent pas le sac", premierDeB === premierDeA2,
       "chacune repart d'un paquet neuf",
       premierDeB === premierDeA2 ? "chacune repart d'un paquet neuf"
                                  : "elles se le disputent",
       "deux écrivains pour une valeur est la maladie que ce dépôt nomme en premier");
  }

  /* ─── Les niveaux, arbitrés par `contenu.js` : `accueil` porte trois versions
         dont les identifiants finissent par 0, 1 et 2. Une réplique lue au
         mauvais niveau ne se remarque pas — elle est juste plus savante, ou
         plus naïve, que ce qu'on a demandé. */
  {
    const etat = L.etatNeuf();
    const rendus = [0, 1, 2].map(i =>
      L.resous(etat, REACTIONS.accueil, { iNiveau: i, alea: graine(1) }));
    ok("le niveau de lecture choisit la bonne version, arbitré par `contenu.js`",
       rendus.every((r, i) => r && r.id === "accueil-" + i),
       "accueil-0, accueil-1, accueil-2",
       rendus.map(r => r && r.id).join(", "),
       "les identifiants viennent du contenu, pas du module : c'est lui qui dit "
       + "quelle version correspond à quel niveau");
    ok("et `reagit` fait passer le niveau jusqu'à la réplique",
       [0, 1, 2].every(i => {
         const o = L.reagit(L.etatNeuf(), entree("accueil", { iNiveau: i }), 0);
         return o && o.bulle.replique.id === "accueil-" + i;
       }), "trois niveaux, trois répliques",
       [0, 1, 2].map(i => { const o = L.reagit(L.etatNeuf(), entree("accueil", { iNiveau: i }), 1000);
                            return o ? o.bulle.replique.id : "rien"; }).join(", "),
       "dans la page, `iNiveau` était un global lu par `resous` — le genre de "
       + "dépendance qu'on ne voit pas casser");
  }
  {
    // L'imbrication des deux formes, dans les deux sens.
    const etat = L.etatNeuf();
    const parNiveau = { niv: [["a", "b"], ["c"], ["d"]] };
    ok("un `{ niv }` peut contenir des tableaux, et réciproquement",
       ["c"].includes(L.resous(etat, parNiveau, { iNiveau: 1, alea: graine(1) }))
       && ["a", "b"].includes(L.resous(etat, parNiveau, { iNiveau: 0, alea: graine(1) }))
       && L.resous(etat, [{ niv: ["x", "y", "z"] }], { iNiveau: 2, alea: graine(1) }) === "z",
       "la récursion déroule les deux formes",
       L.resous(etat, [{ niv: ["x", "y", "z"] }], { iNiveau: 2, alea: graine(1) }) === "z"
         ? "les deux formes se déroulent" : "au moins une imbrication reste en l'état");
  }
}

/* ═══════════════════ 11. LE MODULE NE VA RIEN CHERCHER TOUT SEUL

   Les noms interdits sont empoisonnés au chargement : si un contrôle ci-dessus
   avait touché `performance`, `document` ou `Date`, il serait déjà tombé. Reste
   le hasard, qui est le seul point où le module a le droit de sortir de
   lui-même — et l'on veut savoir OÙ.                                         */
function controleLectures(L){
  let appels = 0;
  const compteur = chargeModule(SRC, () => { appels++; return 0.5; });

  // Avec `alea`, pas un seul appel au hasard global.
  appels = 0;
  partie(compteur, 4242);
  ok("avec `e.alea`, le module n'appelle jamais `Math.random`", appels === 0,
     "0 appel", appels + " appel(s)",
     "un module qui tire au sort sans qu'on le lui dise n'est pas rejouable, et "
     + "tout ce fichier repose sur le fait qu'il l'est");

  // Sans `alea`, le repli existe — et il n'existe qu'à cet endroit.
  appels = 0;
  const etat = compteur.etatNeuf();
  compteur.tire(etat, REACTIONS.inactif, null);
  const auTirage = appels;
  appels = 0;
  compteur.duree("x".repeat(50));
  compteur.reagit(compteur.etatNeuf(),
                  { cle: "photon", reactions: REACTIONS, iNiveau: 0 }, 0);
  ok("sans `e.alea`, le repli sur `Math.random` existe, et seulement au tirage",
     auTirage > 0 && appels === 0, "des appels au tirage, aucun ailleurs",
     auTirage + " au tirage, " + appels + " ailleurs",
     "la page ne passera rien : le repli doit marcher. Mais il ne doit pas se "
     + "glisser dans la durée ni dans le repos, qui n'ont aucune raison d'être "
     + "aléatoires");
}

/* ═══════════ CE QUE L'OUTIL A VU ET N'A PAS TRANSFORMÉ EN VERDICT

   Rien ici n'est un échec, et rien ici n'a été corrigé — ce n'est pas le rôle
   d'un outil. Ce sont des écarts entre ce que le module fait et ce que le site
   promet ailleurs.                                                           */
function controleDoutes(L){
  // Les motifs que la page demande et que le contenu ne porte pas.
  {
    const demandes = new Set();
    for(const m of PAGE.matchAll(/reagit\("([^"]*)"/g)) demandes.add(m[1]);
    for(const m of PAGE.matchAll(/reagit\("([^"]*)"\s*\+\s*i\)/g)) demandes.add(m[1] + "*");
    let lieux = "";
    try { lieux = fs.readFileSync(path.join(ICI, "lieux.js"), "utf8"); } catch(_){ }
    for(const m of lieux.matchAll(/ordres\.reaction\s*=\s*"([^"]*)"/g)) demandes.add(m[1]);
    const orphelins = [...demandes].filter(c => !c.endsWith("*") && !(c in REACTIONS));
    if(orphelins.length)
      vu("la page demande " + orphelins.length + " motif(s) que `contenu.js` ne porte "
         + "pas : " + orphelins.join(", ") + ". Le module se tait proprement, mais "
         + "le clic reste sans réponse — pour « vitesse », c'est le poste horaire du "
         + "salon, celui qu'on manipule le plus dans la quête d'accueil. Reproduit "
         + "tel quel : ce n'est pas à une extraction d'écrire du contenu.");
    if(demandes.has("vitesse*"))
      vu("`reagit(\"vitesse\" + i)` couvre quatre crans de temps, dont deux seulement "
         + "ont une réplique (`vitesse0`, `vitesse3`). Les crans 1 et 2 sont donc "
         + "muets par construction, et rien dans le code ne le dit.");
  }
  /* L'INSTANT ZÉRO. Trouvé par cet outil, sur le dépôt réel, en écrivant le
     contrôle des cent cinquante photons — qui a rendu ROUGE plutôt que de se
     plier. Le sabotage n'y était pour rien. */
  {
    const etat = L.etatNeuf();
    const a = L.reagit(etat, entree("photon"), 0);
    const b = L.reagit(etat, entree("photon"), 500);
    if(a && b)
      vu("un motif qui parle à l'instant ZÉRO n'est pas retenu, et reparle aussitôt : "
         + "`derniereFois.get(cle) || JAMAIS` prend un zéro rangé pour une absence, "
         + "puisque zéro est faux. Dans la page, `performance.now()` ne vaut jamais "
         + "zéro au moment d'une réaction — le défaut est donc inatteignable là-bas, "
         + "et c'est exactement pour ça qu'il a survécu. Maintenant que l'instant "
         + "entre par la porte, un appelant peut le déclencher. Comportement de "
         + "l'original, reproduit tel quel et non corrigé : `?? JAMAIS` au lieu de "
         + "`|| JAMAIS` suffirait, mais ce n'est pas à une extraction de le décider.");
  }
  /* Les clés héritées d'`Object.prototype`. */
  {
    const etat = L.etatNeuf();
    const heritees = ["toString", "constructor", "valueOf", "__proto__"]
      .filter(c => L.reagit(etat, entree(c), 1000));
    if(heritees.length)
      vu("« " + heritees.join(" », « ") + " » passent pour des motifs connus : "
         + "`reactions[cle]` trouve ce qui vient d'`Object.prototype`, et l'ordre "
         + "qui en sort porte un texte indéfini. Aucun appel de la page ne peut "
         + "produire ces noms — les motifs y sont des littéraux ou « vitesse » suivi "
         + "d'un chiffre — donc rien n'est cassé aujourd'hui. C'est le comportement "
         + "de l'original (`const t = REACTIONS[cle]; if(!t) return;`), reproduit "
         + "tel quel ; un `hasOwnProperty` le fermerait.");
  }
  // Une liste vide fait lever — dans la boucle de rendu.
  {
    let leve = null;
    try { L.reagit(L.etatNeuf(), entree("vide", { reactions: { vide: [] } }), 0); }
    catch(err){ leve = err; }
    if(leve)
      vu("une liste de répliques VIDE fait lever (" + leve.name + ") : `tire([])` rend "
         + "`undefined` et le texte se lit sur rien. Comme `reagit(\"inactif\")` est "
         + "appelé depuis la boucle de rendu, une table de contenu mal remplie n'y "
         + "ferait pas une réplique manquante mais une boucle morte. Comportement "
         + "de l'original, reproduit tel quel.");
  }
  // Le plafond, et ce qu'il coûte sur le vrai contenu.
  {
    const longues = [];
    for(const [cle, v] of Object.entries(REACTIONS)){
      const etat = L.etatNeuf();
      const r = L.resous(etat, v, { iNiveau: 2, alea: graine(1) });
      const t = r && (typeof r === "string" ? r : r.t);
      if(t && L.longueur(t) > 241) longues.push(cle);
    }
    if(longues.length)
      vu(longues.length + " motif(s) sur " + CLES.length + " dépassent les 241 signes "
         + "où le plafond s'applique (" + longues.join(", ") + ") : ils tiennent tous "
         + "l'écran exactement seize secondes, quelle que soit leur longueur réelle. "
         + "La pente ne sert donc qu'entre 41 et 240 signes. C'est l'oreille d'Hugo "
         + "qui a posé ces trois nombres — ils ne bougent pas d'ici, mais ils "
         + "méritent d'être regardés.");
  }
  // Le repos marqué avant l'affichage : un motif peut être tu sans avoir été vu.
  vu("le repos se marque au moment de la DÉCISION, pas de l'affichage. Si la page "
     + "laisse tomber l'ordre parce qu'une voix est en cours, le motif reste muselé "
     + "soixante-quinze secondes sans avoir jamais rien montré. C'est ce que faisait "
     + "l'original — `reagit` marquait l'heure avant d'appeler `dit`, lequel pouvait "
     + "renoncer — et c'est reproduit tel quel.");
}

/* ══════════════════════════════════════════════════════ LE DÉROULÉ */
const REJOUABLES = [controleContrat, controleRepos, controleParMotif, controleDuree,
                    controleBalises, controleDoux, controleQuestions, controleInconnu,
                    controleDeterminisme, controleSac];

groupe("Le contrat, et l'original comme arbitre");
controleContrat(L);
controleOriginal(L);
groupe("Le repos — des deux côtés du seuil, ce qu'aucune partie jouée ne dirait");
controleRepos(L);
groupe("Le repos est PAR MOTIF, pas global");
controleParMotif(L);
groupe("La durée suit le texte — les trois régimes, pas un tiers");
controleDuree(L);
groupe("Les balises ne se lisent pas, donc elles ne se comptent pas");
controleBalises(L);
groupe("`doux` — le monde n'interrompt pas la lecture, un clic si");
controleDoux(L);
groupe("Les questions ouvertes coupent tout");
controleQuestions(L);
groupe("Un motif inconnu ne fait rien, et ne lève pas");
controleInconnu(L);
groupe("Le déterminisme — la condition de tout le reste");
controleDeterminisme(L);
groupe("Le sac de tirage et les niveaux de lecture");
controleSac(L);
groupe("Le module ne va rien chercher tout seul");
controleLectures(L);
controleDoutes(L);

/* ══════════════════════════════ CET OUTIL SAIT-IL ÉCHOUER ?  (règle 2)

   On rejoue tous les groupes ci-dessus, en silence, sur des modules cassés
   exprès — sur une copie EN MÉMOIRE du source. Le fichier sur le disque n'est
   jamais touché.

   Un sabotage ne compte que s'il fait tomber un contrôle qui était VERT sur le
   module intact : d'où le relevé de référence. Sans cette précaution, un
   contrôle déjà rouge validerait tous les sabotages du monde.                */
groupe("Cet outil sait échouer — on casse le module pour le prouver");

function releve(M){
  carnet = [];
  for(const g of REJOUABLES){
    try { g(M); }
    catch(err){ carnet.push({ nom: g.name + " — exception : " + err.message, vrai: false }); }
  }
  const lot = carnet; carnet = null;
  const m = new Map(), vus = new Map();
  for(const c of lot){
    const k = vus.get(c.nom) || 0; vus.set(c.nom, k + 1);
    m.set(c.nom + "#" + k, c.vrai);
  }
  return m;
}
const REFERENCE = releve(L);

function mutant(motif, remplacement){
  if(!SRC.includes(motif)) return null;
  try { return chargeModule(SRC.replace(motif, remplacement)); } catch(_){ return null; }
}

function essaie(nom, M, attendu){
  if(!M){
    ok("saboter " + nom + " donne un module jouable", false, "un module mutant",
       "motif introuvable dans le source — sabotage non tenté");
    return;
  }
  let lot;
  try { lot = releve(M); }
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

// 1. LE SABOTAGE QUI COMPTE : le repos rendu global au lieu de par motif.
essaie("un repos global au lieu d'un repos par motif",
       mutant("etat.derniereFois.get(e.cle) || JAMAIS",
              'etat.derniereFois.get("*") || JAMAIS'),
       "PAR MOTIF");

// 2. une borne de durée retirée — le plafond
essaie("le plafond de la durée retiré",
       mutant("return Math.min(DUREE.plafond, Math.max(DUREE.plancher, brut));",
              "return Math.max(DUREE.plancher, brut);"),
       "plafond");

// 3. l'autre borne — le plancher
essaie("le plancher de la durée retiré",
       mutant("return Math.min(DUREE.plafond, Math.max(DUREE.plancher, brut));",
              "return Math.min(DUREE.plafond, brut);"),
       "plancher");

// 4. la longueur comptée AVEC les balises
essaie("la longueur comptée avec les balises",
       mutant('return String(html).replace(BALISES, "").length;',
              "return String(html).length;"),
       "balises");

// 5. un `<` changé en `<=` sur le seuil du repos
essaie("un `<` changé en `<=` sur le seuil du repos",
       mutant("|| JAMAIS) < REPOS) return null;", "|| JAMAIS) <= REPOS) return null;"),
       "75000 ms");

// 6. le garde `doux` retiré
essaie("le garde `doux` retiré",
       mutant("if(e.doux && e.tMasque && now < e.tMasque) return null;", ""),
       "doux");

// 7. les questions ouvertes ignorées
essaie("les questions ouvertes ignorées",
       mutant("if(e.questionsOuvertes) return null;", ""),
       "questions ouvertes");

// 8. le repos marqué AVANT le refus du motif inconnu
essaie("un motif inconnu qui consomme quand même le repos",
       mutant("  const t = e.reactions && e.reactions[e.cle];\n  if(!t) return null;\n\n"
              + "  etat.derniereFois.set(e.cle, now);",
              "  etat.derniereFois.set(e.cle, now);\n"
              + "  const t = e.reactions && e.reactions[e.cle];\n  if(!t) return null;"),
       "clé inconnue ne consomme");

/* ══════════════════════════════════════════════ LE RELEVÉ DES SEUILS */
console.log("\n  LES SEUILS ÉPROUVÉS DES DEUX CÔTÉS");
console.log("  " + "─".repeat(34));
console.log("  le repos        75000 ms strict     muet à +74999 ms, parlant à +75000 ms");
console.log("  le plancher     5200 ms             5200 à 40 signes, 5214 à 41");
console.log("  le plafond      16000 ms            15960 à 240 signes, 16000 à 241");
console.log("  la pente        54 ms / signe       entre 41 et 240 signes visibles");

if(observations.length){
  console.log("\n  CE QUI A ÉTÉ VU ET N'A PAS ÉTÉ TRANSFORMÉ EN VERDICT");
  console.log("  " + "─".repeat(51));
  for(const o of observations) console.log("  ·   " + o);
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHEC" + (echecs > 1 ? "S" : "")
                                + " sur " + n + " contrôles"
                           : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
