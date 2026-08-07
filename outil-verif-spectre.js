/* ============================================================================
   LE SPECTRE DE SGR A*, ÉPROUVÉ HORS NAVIGATEUR

       node outil-verif-spectre.js
       node outil-verif-spectre.js <chemin>   (pour éprouver l'outil sur une
                                               maquette, sans rien poser dans le dépôt)

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL EXISTE AVANT LE MODULE QU'IL CONTRÔLE

   `spectre.js` est écrit en parallèle, par quelqu'un d'autre. Cet outil est
   écrit depuis le CONTRAT, jamais depuis l'implémentation — règle 3 : un
   contrôle tire sa vérité d'ailleurs que de ce qu'il contrôle. Écrit après, il
   aurait fini par recopier ce qu'il devait juger : c'est la panne dont ce dépôt
   s'est fait avoir deux fois.

   L'enjeu n'est pas décoratif. La réglette du spectre dit UNE chose, et c'est
   la plus importante de la page : c'est la longueur d'onde qui décide si
   l'ombre est visible. En radio le flux d'accrétion est opaque et bouche tout ;
   vers le millimétrique il devient transparent, et c'est pour cette unique
   raison que l'EHT observe à 1,3 mm. Une photosphère qui se lèverait au mauvais
   endroit ferait mentir la page exactement là où elle a quelque chose à
   apprendre.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI

   Quatre sources, et aucune n'est une valeur recopiée de mémoire :

   1. **`contenu.js`**, chargé dans un faux `window`. C'est LA source : la table
      SED, les bandes, les repères, et leurs clés de références. L'outil
      recalcule tout depuis cette table — le maximum, les segments, le pavage —
      et n'accepte du module que ce qui s'accorde avec elle. Si l'on change la
      table, les attentes changent avec, et un module qui aurait recopié les
      chiffres en dur tombe aussitôt (groupe 7).

   2. **Deux faits observés, cités par la page elle-même.** À 1,3 mm le gaz est
      devenu transparent à l'échelle de l'horizon — c'est ce qui permet à l'EHT
      d'y voir l'ombre — et en centimétrique il masque des dizaines de rayons.
      Le rayon de l'ombre n'est pas non plus recopié : il se dérive,
      b_c = 3√3·GM/c² et R_s = 2GM/c², donc b_c = (3√3/2)·R_s ≈ 2,598 R_s.
      L'énoncé « à 1,3 mm l'EHT voit l'ombre » devient alors une inégalité
      vérifiable : la photosphère doit être PLUS PETITE que l'ombre, sinon il
      n'y a rien à photographier.

   3. **Les constantes du SI, exactes par définition depuis 2019** : c, h, e.
      Elles servent à convertir les repères de `contenu.js` (« 230 GHz »,
      « 1 keV ») en longueurs d'onde, et donc à contrôler la source contre
      elle-même avant de s'en servir comme étalon (groupe 0).

   4. **Une interpolation arbitre, écrite ici**, à partir de la LOI annoncée
      (linéaire en log-log, plate hors table) et non du code du module. Les
      contrôles demandés point par point — exactitude aux nœuds, milieu égal à
      la moyenne — sont écrits en clair par-dessus, parce qu'ils se lisent.

   ---------------------------------------------------------------------------
   UNE AMBIGUÏTÉ DU CONTRAT, TRANCHÉE ICI ET SIGNALÉE

   Le contrat dit « sed(lg) → νLν interpolé linéairement en log-log ». La table
   de `contenu.js` est en [log₁₀(λ), log₁₀(νLν)], et `eclat` vaut
   10^((sed − sedMax)·0,45) : cette formule n'a de sens que sur des logarithmes
   (sinon l'exposant vaut 10³⁵ et tout sature). L'outil exige donc que `sed`
   rende le LOGARITHME, c'est-à-dire la seconde colonne de la table telle
   quelle. Si le module a lu le contrat dans l'autre sens, le contrôle
   « sed rend le logarithme » le dira en toutes lettres — et c'est alors le
   contrat qu'il faut corriger, pas le module en douce.

   Même remarque pour `COUL_BANDE`, dont le contrat ne décrit pas la forme :
   elle est imposée par le consommateur, `gl.uniform3fv(uTeinte, …)` dans
   `index.html`, qui exige trois flottants. C'est ce que l'outil vérifie.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le groupe 8 casse volontairement ce qui est surveillé, dans des copies EN
   MÉMOIRE, et exige que les contrôles tombent. Le fichier sur le disque n'est
   jamais touché, et `spectre.js` n'est jamais modifié — si un contrôle échoue,
   il est rapporté, pas apaisé.

     · PAR L'ENVIRONNEMENT, sans toucher une ligne du module :
       — on décale toutes les longueurs d'onde d'un demi-ordre de grandeur.
         Tombent : les nœuds de la table, le pavage lu par `bande`, le
         basculement d'unité de `longueur`, l'éclat au pic, et l'ancrage EHT
         de la photosphère (qui se lève à 3,8 R_s alors que l'ombre en fait 2,6).
       — on pose une table dont on a déplacé le pic. Tombent : `sedMax`,
         l'éclat, et l'interpolation.
       — on pose des bandes décalées de 0,4. Tombe : `bande`.
       — on pose une table VIDE. Un module qui répond quand même a recopié la
         table chez lui : c'est la panne que la règle 3 vise.
     · PAR LE TEXTE, dans une copie du source : 0.079 → 0.9, puis 2.886 → 2.2,
       puis 0.45 → 1.0. Tombent respectivement les deux ancrages de la
       photosphère, et la compression de l'éclat. Si un motif n'existe pas dans
       le source, on le DIT au lieu de faire semblant de l'avoir essayé.

   ---------------------------------------------------------------------------
   IL REFUSE DE CONCLURE PLUTÔT QUE DE PASSER AU VERT

   Si `spectre.js` n'existe pas, ne se charge pas, n'expose pas `pose`, ou si la
   table de `contenu.js` est vide : l'outil sort en code 1 en disant que RIEN
   N'A ÉTÉ MESURÉ. Un outil qui n'a rien mesuré et qui rend 0 endort exactement
   comme un contrôle incapable d'échouer — `node tout.js` afficherait un filet
   complet par-dessus un trou.

   Et il vérifie l'état d'où il mesure AVANT de conclure (règle 5, l'affaire de
   `couture()`) : le groupe 9 redemande au module, à la toute fin, ce qu'il
   répondait au début. Les sabotages travaillent sur des copies ; si l'original
   avait bougé quand même, tout ce qui précède serait à jeter.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS, ET IL FAUT LE DIRE

   Le choix des couleurs (une convention, pas un fait), l'allure de la courbe à
   l'écran, la lisibilité de la réglette, ce que le shader fait de `rPhotosphere`,
   et la justesse astrophysique de la SED elle-même — celle-là relève des
   sources de `contenu.js` et de `outil-verif-contenu.js`. Ces choses-là se
   jugent à l'œil, dans `?juge`.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN = (process.argv[2] && fs.existsSync(process.argv[2]))
  ? path.resolve(process.argv[2])
  : path.join(ICI, "spectre.js");

console.log("\n  LE SPECTRE ÉLECTROMAGNÉTIQUE — CONTRÔLE NUMÉRIQUE");
console.log("  ═════════════════════════════════════════════════");

/* ─────────────────────────────────────────────────────── la mécanique du filet
   `carnet` non nul : `ok()` range au lieu d'imprimer. C'est ce qui permet de
   rejouer les MÊMES assertions sur un module saboté sans réécrire une ligne —
   les réécrire reviendrait à saboter aussi le contrôle du sabotage. */
let n = 0, echecs = 0, carnet = null;
const groupe = t => { if(!carnet) console.log("\n  " + t + "\n  " + "─".repeat(t.length)); };
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
/* LA PONCTUATION ARRIVE EN ARGUMENT, depuis le 8 août.

   Cet outil avait raison de crier : la réglette écrivait « 3.16 m » en français.
   Le contrat que j'avais donné disait `longueur(lg)` — c'était lui qui était
   incomplet, un module ne peut pas ponctuer sans savoir la langue. Il dit
   maintenant `longueur(lg, virgule)`, et l'outil passe la ponctuation française,
   celle où le défaut se voyait. */
const VIRGULE = x => String(x).replace(".", ",");

const rel = (a, b) => Math.abs(b) < 1e-30 ? Math.abs(a) : Math.abs(a - b)/Math.abs(b);
const fini = v => typeof v === "number" && Number.isFinite(v);

/* Les constantes du SI, exactes PAR DÉFINITION depuis la révision de 2019 :
   ce ne sont pas des mesures recopiées, ce sont les définitions du mètre, du
   joule-seconde et du coulomb. Elles convertissent les repères de la source. */
const C_LUM = 299792458;            // m/s
const H_PLANCK = 6.62607015e-34;    // J·s
const Q_ELEC = 1.602176634e-19;     // C
const HC_EV = H_PLANCK*C_LUM/Q_ELEC;  // eV·m — pour lire « 1 keV » en longueur d'onde

/* Le rayon apparent de l'ombre d'un trou noir de Schwarzschild, DÉRIVÉ :
   b_c = 3√3·GM/c², R_s = 2GM/c², donc b_c/R_s = 3√3/2. C'est l'étalon contre
   lequel se juge la photosphère : plus grande qu'elle, l'ombre est cachée. */
const R_OMBRE = 3*Math.sqrt(3)/2;

/* ══════════════════════════════════════════════ 0. LA SOURCE, AVANT DE S'EN SERVIR

   `contenu.js` est l'étalon. On ne mesure pas avec un étalon qu'on n'a pas
   regardé : ce groupe vérifie que la table est utilisable et qu'elle est
   d'accord avec elle-même, AVANT que quoi que ce soit d'autre s'y appuie. */
function chargeFauxWindow(f){
  const w = {};
  new Function("window", fs.readFileSync(path.join(ICI, f), "utf8"))(w);
  return w;
}
let CONTENU;
try { CONTENU = chargeFauxWindow("contenu.js").CONTENU; }
catch(err){
  stop("contenu.js ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "Sans la source, cet outil n'a aucun étalon et ne peut rien affirmer.",
  ]);
}
const SRC = CONTENU && CONTENU.spectre;
if(!SRC || !Array.isArray(SRC.sed) || SRC.sed.length < 2
        || !Array.isArray(SRC.bandes) || !SRC.bandes.length)
  stop("CONTENU.spectre est vide ou inutilisable — RIEN N'A ÉTÉ MESURÉ", [
    "Attendu   { sed: [[lg, y], …], bandes: [{ id, min, max, … }, …] }",
    "Trouvé    " + JSON.stringify(SRC && Object.keys(SRC)),
    "",
    "Sur une table vide, tous les contrôles passeraient sans rien établir.",
    "C'est exactement le vert qu'il ne faut jamais rendre.",
  ]);

/* L'empreinte de la source AVANT tout appel. `pose(donnees)` REÇOIT la table,
   elle ne la possède pas : un module qui la trierait sur place changerait
   l'ordre lu par `index.html`, qui lit le même objet. */
const EMPREINTE_SOURCE = JSON.stringify(SRC);

const NOEUDS = SRC.sed.map(p => [+p[0], +p[1]]).sort((a, b) => a[0] - b[0]);
const XMIN = NOEUDS[0][0], XMAX = NOEUDS[NOEUDS.length - 1][0];
const YMAX = Math.max(...NOEUDS.map(p => p[1]));
const PIC  = NOEUDS.find(p => p[1] === YMAX);
const BANDES = SRC.bandes.slice().sort((a, b) => a.min - b.min);

/* L'arbitre : la LOI annoncée, écrite à part. Linéaire en log-log entre deux
   nœuds, PLATE hors table — pas d'extrapolation. */
function sedRef(lg){
  if(lg <= XMIN) return NOEUDS[0][1];
  if(lg >= XMAX) return NOEUDS[NOEUDS.length - 1][1];
  for(let i = 0; i < NOEUDS.length - 1; i++){
    const [x0, y0] = NOEUDS[i], [x1, y1] = NOEUDS[i + 1];
    if(lg >= x0 && lg <= x1) return y0 + (y1 - y0)*(lg - x0)/(x1 - x0);
  }
  return NaN;
}

groupe("La source elle-même, avant de s'en servir comme étalon");
ok("la table SED est exploitable",
   NOEUDS.length >= 2 && NOEUDS.every(p => fini(p[0]) && fini(p[1])),
   "au moins deux points finis", NOEUDS.length + " points, de lg " + XMIN + " à " + XMAX);
ok("le maximum de la SED est unique",
   NOEUDS.filter(p => p[1] === YMAX).length === 1,
   "un seul pic", "νLν = 10^" + YMAX + " à lg = " + PIC[0],
   "deux pics ex æquo rendraient « l'éclat vaut 1 au maximum » ambigu");

/* Les repères portent un nom lisible (« 3 cm », « 600 nm », « 1 keV ») ET un
   `lg`. Les deux doivent dire la même chose. C'est un contrôle sur la source,
   et c'est aussi ce qui me donne mes ancrages sans recopier un seul chiffre. */
const UNITES = { pm:1e-12, nm:1e-9, "µm":1e-6, "μm":1e-6, um:1e-6, mm:1e-3, cm:1e-2, m:1 };
function lgDuNom(nom){
  const t = String(nom).replace(/ | /g, " ").trim();
  let m = /^([\d]+(?:[.,]\d+)?)\s*(pm|nm|µm|μm|um|mm|cm|m)$/.exec(t);
  if(m) return Math.log10(parseFloat(m[1].replace(",", "."))*UNITES[m[2]]);
  m = /^([\d]+(?:[.,]\d+)?)\s*(k?eV)$/.exec(t);
  if(m) return Math.log10(HC_EV/(parseFloat(m[1].replace(",", "."))*(m[2] === "keV" ? 1e3 : 1)));
  return null;
}
{
  const reperes = Array.isArray(SRC.reperes) ? SRC.reperes : [];
  let lus = 0, pire = 0, nomPire = "";
  for(const r of reperes){
    const l = lgDuNom(r.nom);
    if(l === null) continue;
    lus++;
    const e = Math.abs(l - r.lg);
    if(e > pire){ pire = e; nomPire = r.nom; }
  }
  ok("chaque repère est à la longueur d'onde que son nom annonce",
     lus >= 4 && pire < 0.01, "< 0,01 en log₁₀", lus + " repères lus, pire écart "
     + pire.toFixed(4) + (nomPire ? " sur « " + nomPire + " »" : ""),
     "converti par c, h et e — un repère mal placé fausserait tous mes ancrages");
}

/* L'ancrage de la photosphère : la page dit « calée sur la transition à τ ~ 1
   vers 230 GHz », et l'EHT observe à 1,3 mm. Ce sont deux façons de nommer la
   même longueur d'onde. On lit la fréquence DANS la source plutôt que de
   l'écrire ici, et on vérifie qu'elle retombe sur le repère de l'EHT. */
let LG_EHT = null;
{
  const texte = JSON.stringify(SRC.lecon || {}) + JSON.stringify(SRC.reperes || []);
  const f = /(\d+(?:[.,]\d+)?)\s*GHz/.exec(texte);
  const parFreq = f ? Math.log10(C_LUM/(parseFloat(f[1].replace(",", "."))*1e9)) : null;
  const rep = (SRC.reperes || []).find(r => /Event Horizon|EHT/i.test((r.sous || "") + (r.pourquoi || "")));
  const parNom = rep ? rep.lg : null;
  LG_EHT = parFreq !== null ? parFreq : parNom;
  ok("la fréquence de l'EHT et le repère « 1,3 mm » désignent la même onde",
     parFreq !== null && parNom !== null && Math.abs(parFreq - parNom) < 0.01,
     "deux chemins, un même lg", parFreq === null ? "aucune fréquence lue dans la source"
       : "par " + f[1] + " GHz : " + parFreq.toFixed(4) + "   par le repère : " + parNom,
     "λ = c/ν — c'est la seule façon d'ancrer la photosphère sans recopier un chiffre");
}
if(LG_EHT === null)
  stop("impossible d'ancrer l'EHT depuis la source — RIEN N'A ÉTÉ MESURÉ", [
    "Ni fréquence en GHz, ni repère mentionnant l'Event Horizon Telescope dans",
    "CONTENU.spectre. Le contrôle de la photosphère perdrait son fait de référence,",
    "et se réduirait à recopier la formule du module.",
  ]);
/* Le second ancrage : le centimétrique, là où la découverte de 1974 n'a montré
   qu'une tache. On prend le repère de la source dont la longueur d'onde tombe
   dans la décade centimétrique, plutôt que d'écrire « 3 cm » ici. */
const LG_CM = (() => {
  for(const r of (SRC.reperes || [])){
    const l = lgDuNom(r.nom);
    if(l !== null && l >= -2 && l <= -1) return l;
  }
  return -1.5;   // milieu de la décade centimétrique, si la source n'a pas de repère là
})();

/* ═══════════════════════════════════════════════════ 1. LE MODULE EST-IL LÀ ? */
if(!fs.existsSync(CHEMIN))
  stop("spectre.js n'existe pas encore — RIEN N'A ÉTÉ MESURÉ", [
    "Le module est écrit en parallèle ; cet outil l'attend et refuse de conclure.",
    "Il tient prête une soixantaine de vérifications et se déclenchera seul dès que",
    path.relative(process.cwd(), CHEMIN) + " exposera",
    "",
    "    global.SPECTRE_CALC = { pose, sed, bande, rPhotosphere,",
    "                            eclat, longueur, COUL_BANDE, sedMax };",
    "",
    "Le contrat attendu, et l'ambiguïté qu'il faudra trancher sur `sed`, sont",
    "écrits en tête de ce fichier.",
  ]);

const TEXTE = fs.readFileSync(CHEMIN, "utf8");

/* Le module se referme sur un faux global. On lui tend tous les noms sous
   lesquels un module de ce dépôt peut se déclarer, plutôt que d'imposer une
   forme d'écriture à quelqu'un qui travaille en parallèle. */
function charge(src){
  const bac = {};
  const mod = { exports: bac };
  new Function("window", "global", "globalThis", "self", "module", "exports", src)
    (bac, bac, bac, bac, mod, bac);
  return bac.SPECTRE_CALC || (mod.exports && mod.exports.SPECTRE_CALC) || null;
}
let M;
try { M = charge(TEXTE); }
catch(err){
  stop("spectre.js ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "",
    "Le module doit pouvoir s'évaluer hors navigateur : ni DOM, ni WebGL, ni",
    "`document` au chargement. C'est ce qui rend les autres modules vérifiables.",
  ]);
}
if(!M || typeof M.pose !== "function")
  stop("spectre.js s'est chargé mais n'expose pas `pose` — RIEN N'A ÉTÉ MESURÉ", [
    "attendu   global.SPECTRE_CALC = { pose, sed, bande, rPhotosphere, eclat,",
    "                                  longueur, COUL_BANDE, sedMax }",
    "trouvé    " + (M ? "SPECTRE_CALC = " + JSON.stringify(Object.keys(M))
                      : "aucun SPECTRE_CALC sur le global"),
    "",
    "Sans `pose`, l'outil ne peut pas fixer l'état d'où il mesure.",
  ]);

const lireSedMax = m => (typeof m.sedMax === "function" ? m.sedMax() : m.sedMax);

/* ══════════════════════════════════════════════════════ 2. LE CONTRAT, NOM PAR NOM */
groupe("Le contrat est-il honoré — les huit noms");
const ATTENDUS = [
  ["pose", "function"], ["sed", "function"], ["bande", "function"],
  ["rPhotosphere", "function"], ["eclat", "function"], ["longueur", "function"],
  ["COUL_BANDE", "object"], ["sedMax", "number"],
];
for(const [nom, type] of ATTENDUS){
  const v = M[nom];
  /* Ici on ne contrôle que la PRÉSENCE et la forme, et rien d'autre : on est
     avant `pose`, donc avant qu'il existe des données. `sedMax` vaut alors ce
     qu'il veut — l'infini négatif est même la réponse honnête d'un maximum
     dérivé d'une table vide. Exiger un nombre fini à cet instant reviendrait à
     mesurer depuis un état dont le contrat ne dit rien (règle 5, appliquée à
     l'outil lui-même : ma première version échouait ici, et c'est elle qui
     avait tort). Sa VALEUR est contrôlée après `pose`, au groupe suivant.
     Une fonction est acceptée aussi : le contrat l'écrit comme une valeur,
     mais un accesseur rend le même service et se déclare. */
  const bon = nom === "sedMax" ? (typeof v === "number" || typeof v === "function")
                               : (typeof v === type && v !== null);
  ok("`" + nom + "` est exposé", bon, nom === "sedMax" ? "number (valeur vue après `pose`)" : type,
     v === undefined ? "absent" : (typeof v === "number" ? String(v) : typeof v));
}

/* ═════════════════════════ 3. L'ÉTAT D'OÙ L'ON MESURE (règle 5, garde-fou n° 9)

   On pose la vraie table, et on vérifie que le module RÉPOND — pas qu'il
   réponde juste, c'est le travail des groupes suivants. La distinction est
   celle entre « je ne peux pas mesurer » et « la mesure est fausse » : la
   première ne doit jamais se déguiser en la seconde, ni l'inverse. */
try { M.pose(SRC); }
catch(err){
  stop("`pose(CONTENU.spectre)` a levé une exception — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "L'outil ne peut fixer aucun état de mesure ; tout ce qui suivrait serait faux.",
  ]);
}
{
  const sondes = [M.sed(PIC[0]), M.sed(XMIN), M.rPhotosphere(LG_CM), M.eclat(PIC[0])];
  if(!sondes.every(fini) || typeof M.bande(PIC[0]) !== "object" || M.bande(PIC[0]) === null)
    stop("le module ne rend pas de nombres après `pose` — RIEN N'A ÉTÉ MESURÉ", [
      "sed(pic) = " + sondes[0] + "   sed(bord) = " + sondes[1],
      "rPhotosphere = " + sondes[2] + "   eclat = " + sondes[3],
      "bande(pic) = " + JSON.stringify(M.bande(PIC[0])),
      "",
      "Des NaN ou des `undefined` feraient passer la plupart des comparaisons",
      "au vert par accident. On refuse de conclure.",
    ]);
}

/* ══════════════════════════════════════════════════ LES GROUPES REJOUABLES

   Chacun ne tire ses attentes que de `contenu.js` et des deux faits observés.
   Le groupe 8 les rejoue tels quels sur des modules sabotés. */

// ─────────────────────────────────────────────────── 4. l'interpolation annoncée
function controleSed(m){
  groupe("L'interpolation est bien celle qu'on annonce");

  /* Le contrat dit « νLν interpolé » ; la table est en log₁₀ et `eclat` élève
     10 à la puissance de la différence. Une seule lecture tient debout. */
  ok("`sed` rend le LOGARITHME de νLν, pas νLν lui-même",
     Math.abs(m.sed(PIC[0])) < 100, "un nombre de l'ordre de " + YMAX,
     String(m.sed(PIC[0])),
     "si celui-ci tombe seul, c'est le CONTRAT qui est ambigu — voir l'en-tête");

  let pire = 0, ou = "";
  for(const [x, y] of NOEUDS){
    const e = Math.abs(m.sed(x) - y);
    if(e > pire){ pire = e; ou = "lg = " + x; }
  }
  ok("aux " + NOEUDS.length + " points de la table, la valeur tabulée est rendue exactement",
     pire < 1e-12, "écart nul", pire.toExponential(2) + (ou ? "  (" + ou + ")" : ""),
     "un point de mesure déplacé par l'interpolation n'est plus un point de mesure");

  let pireMil = 0, ouMil = "";
  for(let i = 0; i < NOEUDS.length - 1; i++){
    const [x0, y0] = NOEUDS[i], [x1, y1] = NOEUDS[i + 1];
    const e = Math.abs(m.sed((x0 + x1)/2) - (y0 + y1)/2);
    if(e > pireMil){ pireMil = e; ouMil = "entre " + x0 + " et " + x1; }
  }
  ok("au milieu d'un segment, la moyenne des deux extrémités",
     pireMil < 1e-12, "écart nul", pireMil.toExponential(2) + "  " + ouMil);

  /* Le milieu SEUL ne prouve pas la linéarité : une interpolation lissée
     (smoothstep, cosinus, spline symétrique) passe elle aussi par le milieu.
     Les quarts la démasquent. */
  let pireQ = 0, ouQ = "";
  for(let i = 0; i < NOEUDS.length - 1; i++){
    const [x0, y0] = NOEUDS[i], [x1, y1] = NOEUDS[i + 1];
    for(const t of [0.1, 0.25, 0.5, 0.75, 0.9]){
      const e = Math.abs(m.sed(x0 + t*(x1 - x0)) - (y0 + t*(y1 - y0)));
      if(e > pireQ){ pireQ = e; ouQ = "t = " + t + " entre " + x0 + " et " + x1; }
    }
  }
  ok("et aux quarts aussi — c'est une droite, pas une courbe lissée",
     pireQ < 1e-12, "écart nul", pireQ.toExponential(2) + "  " + ouQ,
     "une smoothstep passe par le milieu : seuls les quarts la trahissent");

  let pireBal = 0;
  for(let i = 0; i <= 600; i++){
    const lg = XMIN - 1 + (XMAX - XMIN + 2)*i/600;
    pireBal = Math.max(pireBal, Math.abs(m.sed(lg) - sedRef(lg)));
  }
  ok("sur 601 points de tout l'axe, l'arbitre et le module s'accordent",
     pireBal < 1e-12, "< 1e-12", pireBal.toExponential(2),
     "l'arbitre est écrit depuis la LOI, jamais depuis le module");

  const yBas = NOEUDS[0][1], yHaut = NOEUDS[NOEUDS.length - 1][1];
  ok("sous la table, c'est plat — et non extrapolé",
     [0.5, 2, 5].every(d => m.sed(XMIN - d) === yBas),
     "toujours " + yBas, [0.5, 2, 5].map(d => m.sed(XMIN - d)).join(" / "));
  ok("au-dessus de la table, c'est plat aussi",
     [0.5, 2, 5].every(d => m.sed(XMAX + d) === yHaut),
     "toujours " + yHaut, [0.5, 2, 5].map(d => m.sed(XMAX + d)).join(" / "));
  {
    /* Ce que la platitude évite concrètement : trois décades plus bas, une
       extrapolation de la dernière pente rendrait un chiffre inventé. */
    const pente = (NOEUDS[1][1] - NOEUDS[0][1])/(NOEUDS[1][0] - NOEUDS[0][0]);
    const invente = yBas - 3*pente;
    ok("trois décades sous la table, on ne prolonge pas la dernière pente",
       Math.abs(m.sed(XMIN - 3) - invente) > 0.5 || Math.abs(pente) < 1e-9,
       "≠ " + invente.toFixed(2) + " (la valeur inventée)", String(m.sed(XMIN - 3)),
       "hors mesure, on répète le dernier point mesuré ; on n'invente pas");
  }

  ok("`sedMax` est bien le maximum de la table posée",
     rel(lireSedMax(m), YMAX) < 1e-12, String(YMAX), String(lireSedMax(m)));
  ok("aucun point de l'axe ne dépasse `sedMax`",
     (() => { for(let i = 0; i <= 400; i++){
       const lg = XMIN - 1 + (XMAX - XMIN + 2)*i/400;
       if(m.sed(lg) > lireSedMax(m) + 1e-12) return false; } return true; })(),
     "sed ≤ sedMax partout", "401 points");
}

// ────────────────────────────────────────────── 5. les bandes pavent l'axe
function controleBandes(m){
  groupe("Les bandes pavent l'axe, et `bande` rend celle qui contient");

  /* Le pavage est une propriété de la SOURCE. On l'établit d'abord : sans lui,
     « bande(lg) rend celle qui contient lg » n'a pas de sens. */
  let trou = null, chevauche = null;
  for(let i = 0; i < BANDES.length - 1; i++){
    if(BANDES[i].max < BANDES[i + 1].min) trou = BANDES[i].id + " → " + BANDES[i + 1].id;
    if(BANDES[i].max > BANDES[i + 1].min) chevauche = BANDES[i].id + " ∩ " + BANDES[i + 1].id;
  }
  ok("aucun trou entre deux bandes", !trou, "bord à bord", trou || "aucun");
  ok("aucun recouvrement", !chevauche, "bord à bord", chevauche || "aucun");
  ok("chaque bande a une largeur positive et un id unique",
     BANDES.every(b => b.max > b.min) && new Set(BANDES.map(b => b.id)).size === BANDES.length,
     BANDES.length + " bandes distinctes", BANDES.map(b => b.id).join(" "));
  ok("le pavage couvre toute la table SED",
     BANDES[0].min <= XMIN && BANDES[BANDES.length - 1].max >= XMAX,
     "de " + XMIN + " à " + XMAX,
     "de " + BANDES[0].min + " à " + BANDES[BANDES.length - 1].max,
     "un point de la courbe hors de toute bande n'aurait ni nom ni couleur");

  let faux = [];
  for(const b of BANDES){
    for(const t of [0.02, 0.25, 0.5, 0.75, 0.98]){
      const lg = b.min + t*(b.max - b.min);
      const r = m.bande(lg);
      if(!r || r.id !== b.id) faux.push(b.id + "@" + lg.toFixed(2) + "→" + (r ? r.id : "rien"));
    }
  }
  ok("pour chacune des " + BANDES.length + " bandes, cinq points intérieurs y retombent",
     faux.length === 0, "la bande qui contient lg",
     faux.length ? faux.slice(0, 4).join(", ") : (5*BANDES.length) + " points, tous justes");

  /* Aux frontières, le contrat ne dit pas de quel côté on penche. Deux choses
     seulement doivent tenir : personne ne se les partage à moitié, et la
     convention ne change pas d'une frontière à l'autre. Un contrôle qui
     imposerait un côté inventerait une règle que le contrat n'a pas. */
  {
    const cotes = new Set();
    for(let i = 0; i < BANDES.length - 1; i++){
      const r = m.bande(BANDES[i].max);
      cotes.add(!r ? "rien" : r.id === BANDES[i].id ? "gauche"
                : r.id === BANDES[i + 1].id ? "droite" : "ailleurs");
    }
    ok("aux frontières, la convention est unique et ne flotte pas",
       cotes.size === 1 && !cotes.has("rien") && !cotes.has("ailleurs"),
       "toujours du même côté", [...cotes].join(" / "),
       "le contrat ne dit pas lequel — il dit qu'il n'y en a qu'un");
  }

  {
    let nul = null;
    for(let lg = -14; lg <= 1.5; lg += 0.05){
      const r = m.bande(lg);
      if(!r || typeof r.id !== "string") { nul = lg.toFixed(2); break; }
    }
    ok("`bande` ne rend jamais rien, même hors du pavage", nul === null,
       "toujours une bande nommée", nul === null ? "311 points" : "rien à lg = " + nul,
       "le rendu fait `COUL_BANDE[bande(lg).id]` : un vide y devient un plantage");
  }

  /* La forme de COUL_BANDE n'est pas dans le contrat : elle est imposée par
     `gl.uniform3fv(uTeinte, COUL_BANDE[…])` dans `index.html`, qu'on ne
     réécrit pas. Trois flottants, un par bande, et pas deux fois la même —
     deux bandes de même teinte ne se distinguent plus à l'écran. */
  const C = m.COUL_BANDE || {};
  const manquantes = BANDES.filter(b => !Array.isArray(C[b.id]) && !(C[b.id] && C[b.id].length === 3));
  ok("chaque bande a sa teinte", manquantes.length === 0, BANDES.length + " teintes",
     manquantes.length ? "manque " + manquantes.map(b => b.id).join(", ") : "toutes présentes");
  const malFormees = BANDES.filter(b => {
    const c = C[b.id];
    return !c || c.length !== 3 || ![...c].every(v => fini(v) && v >= 0 && v <= 1);
  });
  ok("chaque teinte est trois flottants entre 0 et 1", malFormees.length === 0,
     "3 nombres dans [0;1]",
     malFormees.length ? malFormees.map(b => b.id + "=" + JSON.stringify(C[b.id])).join(" ") : "conformes",
     "c'est ce qu'attend `uniform3fv` — un « #ff5a3d » y rendrait du noir");
  ok("deux bandes n'ont pas la même teinte",
     new Set(BANDES.map(b => JSON.stringify(C[b.id] && [...C[b.id]]))).size === BANDES.length,
     BANDES.length + " teintes distinctes",
     new Set(BANDES.map(b => JSON.stringify(C[b.id] && [...C[b.id]]))).size + " distinctes");
}

// ────────────────────────────── 6. la photosphère, contre les faits qui la justifient
function controlePhoto(m){
  groupe("La photosphère, contre les deux faits qui la justifient");

  const rEHT = m.rPhotosphere(LG_EHT);
  ok("à 1,3 mm, elle laisse voir l'ombre — c'est toute la raison d'être de l'EHT",
     fini(rEHT) && rEHT < R_OMBRE, "< " + R_OMBRE.toFixed(3) + " R_s (le rayon de l'ombre)",
     rEHT + " R_s",
     "b_c = 3√3·GM/c² et R_s = 2GM/c² : le rayon de l'ombre se dérive, il ne se recopie pas");

  const rCm = m.rPhotosphere(LG_CM);
  ok("en centimétrique, elle en masque des dizaines",
     fini(rCm) && rCm >= 10 && rCm <= 60, "entre 10 et 60 R_s",
     rCm.toFixed(2) + " R_s  (à lg = " + LG_CM.toFixed(3) + ")",
     "1974 : on n'y voit qu'une tache, et c'est pour cette raison-là");

  {
    let pireDecade = Infinity, ou = 0;
    for(let lg = -2; lg <= -1; lg += 0.02){
      const r = m.rPhotosphere(lg);
      if(r < pireDecade){ pireDecade = r; ou = lg; }
    }
    ok("sur toute la décade centimétrique, l'ombre reste cachée",
       pireDecade > R_OMBRE, "> " + R_OMBRE.toFixed(3) + " R_s partout",
       "minimum " + pireDecade.toFixed(2) + " à lg = " + ou.toFixed(2),
       "si elle passait sous l'ombre quelque part, la page dirait le contraire de la page");
  }

  {
    let recule = null;
    for(let lg = -14; lg < 1.5; lg += 0.02){
      if(m.rPhotosphere(lg + 0.02) < m.rPhotosphere(lg) - 1e-12){ recule = lg.toFixed(2); break; }
    }
    ok("elle ne recule jamais quand la longueur d'onde grandit", recule === null,
       "croissante sur tout l'axe", recule === null ? "775 pas" : "elle recule à lg = " + recule);
  }

  /* La fenêtre où elle n'est ni éteinte ni plafonnée, TROUVÉE en balayant —
     pas déduite de la formule, qu'on ne veut pas recopier ici. */
  const dedans = [];
  for(let lg = -6; lg <= 1.5; lg += 0.01){
    const r = m.rPhotosphere(lg);
    if(r > 1e-9 && r < 60*(1 - 1e-9)) dedans.push([lg, r]);
  }
  ok("il existe une plage où elle grandit vraiment", dedans.length > 20,
     "une fenêtre ouverte", dedans.length + " points" + (dedans.length
       ? " (lg " + dedans[0][0].toFixed(2) + " → " + dedans[dedans.length - 1][0].toFixed(2) + ")" : ""));
  if(dedans.length > 20){
    let strict = true;
    for(let i = 1; i < dedans.length; i++) if(dedans[i][1] <= dedans[i - 1][1]) strict = false;
    ok("et sur cette plage elle croît STRICTEMENT", strict, "jamais de palier",
       strict ? "monotone" : "un palier au milieu de la fenêtre");
    /* `contenu.js` l'annonce : « une taille apparente variant à peu près comme
       λ ». Une proportionnalité se contrôle par la pente en log-log, qui doit
       valoir 1 — c'est le fait, pas la formule. */
    const a = dedans[0], b = dedans[dedans.length - 1];
    const pente = (Math.log10(b[1]) - Math.log10(a[1]))/(b[0] - a[0]);
    ok("elle varie comme λ, ce que la source annonce", Math.abs(pente - 1) < 0.05,
       "pente 1,00 en log-log", pente.toFixed(4),
       "doubler la longueur d'onde double la tache : c'est ce que dit la leçon");
  }

  ok("sous son seuil, elle est exactement nulle",
     [-14, -10, -6, -4].every(lg => m.rPhotosphere(lg) === 0),
     "0", [-14, -10, -6, -4].map(lg => m.rPhotosphere(lg)).join(" / "),
     "aux courtes longueurs d'onde il n'y a pas de brouillard du tout, pas un peu");
  ok("elle est plafonnée à 60 rayons",
     [0, 0.5, 1, 3].every(lg => m.rPhotosphere(lg) === 60),
     "60", [0, 0.5, 1, 3].map(lg => m.rPhotosphere(lg)).join(" / "),
     "sans plafond, la caméra reculerait à l'infini pour rester hors du brouillard");

  {
    let mauvais = null;
    const points = [];
    for(let lg = -14; lg <= 2; lg += 0.01) points.push(lg);
    for(const [x] of NOEUDS) points.push(x);
    for(const b of BANDES){ points.push(b.min, b.max); }
    for(const lg of points){
      const r = m.rPhotosphere(lg);
      if(!fini(r) || r < 0 || r > 60){ mauvais = lg + " → " + r; break; }
    }
    ok("jamais de NaN, jamais hors de [0 ; 60], sur tout l'axe", mauvais === null,
       "fini et borné", mauvais === null ? points.length + " points" : mauvais,
       "un NaN passé au shader efface l'image entière sans rien dire");
  }
}

// ─────────────────────────────────────────────────────────── 7. l'éclat
function controleEclat(m){
  groupe("L'éclat vaut exactement 1 au maximum, et décroît partout ailleurs");

  ok("au pic de la SED, l'éclat vaut 1", rel(m.eclat(PIC[0]), 1) < 1e-12,
     "1", String(m.eclat(PIC[0])) + "  (lg = " + PIC[0] + ")",
     "c'est la normalisation : le pic est la référence, pas une valeur parmi d'autres");

  let sup = null, egal = null;
  for(let i = 0; i <= 500; i++){
    const lg = XMIN - 1 + (XMAX - XMIN + 2)*i/500;
    const e = m.eclat(lg);
    if(e > 1 + 1e-12) sup = lg.toFixed(3) + " → " + e;
    if(Math.abs(sedRef(lg) - YMAX) > 1e-9 && e >= 1 - 1e-12) egal = lg.toFixed(3);
  }
  ok("nulle part il ne dépasse 1", sup === null, "≤ 1 partout", sup || "501 points");
  ok("et il est strictement plus petit dès qu'on quitte le pic", egal === null,
     "< 1 hors du pic", egal === null ? "501 points" : "encore 1 à lg = " + egal);

  {
    let ordre = true;
    for(let i = 0; i <= 200; i++){
      const a = XMIN + (XMAX - XMIN)*i/200, b = XMIN + (XMAX - XMIN)*((i + 1)%201)/200;
      const ds = m.sed(a) - m.sed(b), de = m.eclat(a) - m.eclat(b);
      if(Math.abs(ds) > 1e-9 && Math.sign(ds) !== Math.sign(de)) ordre = false;
    }
    ok("il suit l'ordre de la SED : plus brillant ici, plus brillant là",
       ordre, "même sens partout", ordre ? "201 couples" : "une inversion");
  }

  /* La compression, énoncée comme un fait d'affichage plutôt que comme un
     chiffre : log₁₀(eclat) doit être affine en sed, de pente CONSTANTE et
     strictement comprise entre 0 et 1. Pente 1 : on n'a rien compressé et
     l'écran est noir sur quatre décades. Pente 0 : tout brille pareil. */
  {
    const pts = [];
    for(let i = 0; i <= 40; i++){
      const lg = XMIN + (XMAX - XMIN)*i/40;
      const e = m.eclat(lg);
      if(e > 0) pts.push([m.sed(lg), Math.log10(e)]);
    }
    let pmin = Infinity, pmax = -Infinity;
    for(let i = 0; i < pts.length; i++) for(let j = i + 1; j < pts.length; j++){
      if(Math.abs(pts[i][0] - pts[j][0]) < 0.05) continue;
      const p = (pts[i][1] - pts[j][1])/(pts[i][0] - pts[j][0]);
      pmin = Math.min(pmin, p); pmax = Math.max(pmax, p);
    }
    ok("la compression est la même partout", pmax - pmin < 1e-9,
       "une pente unique", "de " + pmin.toFixed(6) + " à " + pmax.toFixed(6));
    ok("et elle compresse vraiment — pente strictement entre 0 et 1",
       pmin > 0.01 && pmax < 0.999, "0 < pente < 1", pmin.toFixed(4),
       "à pente 1, quatre décades d'écart rendraient la page noire hors du pic");
    /* Le seul contrôle de ce groupe qui répète un chiffre du contrat. S'il
       tombe seul, pendant que les précédents passent, c'est le CONTRAT qu'il
       faut rouvrir — pas le module qu'il faut plier en silence. */
    ok("et cette pente est bien le 0,45 du contrat", Math.abs(pmin - 0.45) < 1e-6,
       "0,45", pmin.toFixed(6), "conformité littérale — voir la note ci-dessus");
  }

  {
    let mauvais = null;
    for(let lg = -14; lg <= 2; lg += 0.01){
      const e = m.eclat(lg);
      if(!fini(e) || e <= 0){ mauvais = lg.toFixed(2) + " → " + e; break; }
    }
    ok("jamais de NaN ni de zéro sur tout l'axe", mauvais === null,
       "fini et > 0", mauvais || "1601 points");
  }
}

// ──────────────────────────────────────────── 8. les unités de longueur d'onde
function controleLongueur(m){
  groupe("`longueur` bascule d'unité au bon endroit");

  const FACT = { pm:1e-12, nm:1e-9, "µm":1e-6, "μm":1e-6, mm:1e-3, m:1 };
  function lit(s){
    if(typeof s !== "string") return null;
    const t = s.replace(/ | /g, " ").trim();
    const mm = /^(.+?)\s*(pm|nm|µm|μm|mm|m)$/.exec(t);
    if(!mm) return null;
    const v = parseFloat(mm[1].replace(/[\s]/g, "").replace(",", "."));
    return fini(v) ? { v, u: mm[2], virgule: /,/.test(mm[1]) || !/\./.test(mm[1]) } : null;
  }
  const attendue = lam => lam < 1e-9 ? "pm" : lam < 1e-6 ? "nm" : lam < 1e-3 ? "µm"
                        : lam < 1 ? "mm" : "m";
  const memeU = (a, b) => (a === "μm" ? "µm" : a) === (b === "μm" ? "µm" : b);

  /* Le contrôle qui vaut : la chaîne relue doit redonner la longueur d'onde.
     Une réglette qui affiche « 1,30 mm » pour 13 mm ment sur toute la page.
     Tolérance à 5 % pour ne pas imposer un nombre de décimales que le contrat
     ne fixe pas. */
  {
    let pireU = null, pireV = 0, ouV = "";
    for(let i = 0; i <= 60; i++){
      const lg = -13 + 13.5*i/60, lam = Math.pow(10, lg);
      const s = m.longueur(lg, VIRGULE), r = lit(s);
      if(!r){ pireU = lg.toFixed(2) + " → " + JSON.stringify(s); break; }
      if(!memeU(r.u, attendue(lam))) pireU = lg.toFixed(2) + " → « " + s + " », attendu en " + attendue(lam);
      const e = rel(r.v*FACT[r.u === "μm" ? "µm" : r.u], lam);
      if(e > pireV){ pireV = e; ouV = "« " + s + " » pour " + lam.toExponential(3) + " m"; }
    }
    ok("l'unité choisie est celle qu'annonce le contrat, sur 61 longueurs d'onde",
       pireU === null, "l'unité de la décade", pireU || "61 justes");
    ok("et le nombre affiché, relu avec son unité, redonne la longueur d'onde",
       pireV < 0.05, "< 5 % d'écart", (100*pireV).toFixed(2) + " %  " + ouV,
       "c'est le contrôle qui attrape un facteur mille dans la conversion");
  }

  /* Les quatre seuils, des deux côtés. Math.pow(10, -9) vaut exactement 1e-9
     en flottant : le point de bascule est donc réellement observable, et pas
     seulement approchable. */
  const SEUILS = [[-9, "pm", "nm"], [-6, "nm", "µm"], [-3, "µm", "mm"], [0, "mm", "m"]];
  for(const [lg, dessous, dessus] of SEUILS){
    const bas = lit(m.longueur(lg - 1e-6, VIRGULE)), haut = lit(m.longueur(lg + 1e-6, VIRGULE));
    ok("au seuil 10^" + lg + " m : " + dessous + " juste en dessous, " + dessus + " juste au-dessus",
       bas && haut && memeU(bas.u, dessous) && memeU(haut.u, dessus),
       dessous + " puis " + dessus,
       (bas ? "« " + m.longueur(lg - 1e-6, VIRGULE) + " »" : "illisible") + " puis "
       + (haut ? "« " + m.longueur(lg + 1e-6, VIRGULE) + " »" : "illisible"));
    const pile = lit(m.longueur(lg, VIRGULE));
    ok("et au seuil exact, c'est " + dessus + " — « sous 10^" + lg + " » exclut 10^" + lg,
       pile && memeU(pile.u, dessus), dessus, pile ? "« " + m.longueur(lg, VIRGULE) + " »" : "illisible");
  }

  {
    /* Le site est en français, et le contrat écrit « 1,30 mm » : « 1.30 mm »
       est une faute d'affichage, pas un détail de style. Et une mantisse à
       quatre chiffres signale une unité mal choisie. */
    let point = null, gros = null;
    for(let lg = -12; lg <= 0.5; lg += 0.25){
      const s = m.longueur(lg, VIRGULE), r = lit(s);
      if(typeof s === "string" && /\d\.\d/.test(s)) point = s;
      if(r && Math.abs(r.v) >= 1000) gros = s;
    }
    ok("la décimale est une virgule, jamais un point", point === null,
       "« 1,30 mm »", point || "51 affichages");
    ok("la mantisse reste sous mille — sinon l'unité au-dessus existait",
       gros === null, "< 1000", gros || "51 affichages");

    /* La notation scientifique, elle, ne se voit qu'au cheveu près sous un
       seuil, quand l'arrondi remonte la mantisse à 1000. La fenêtre est
       minuscule — mais c'est une réglette qu'on fait glisser, et « 1,00e+3 pm »
       est illisible pour quelqu'un à qui l'on vient d'expliquer ce qu'est un
       nanomètre. On échantillonne donc juste sous chaque seuil, là où personne
       ne pense à regarder. */
    let expo = null;
    const bords = [];
    for(let lg = -12; lg <= 0.5; lg += 0.25) bords.push(lg);
    for(const s of [-9, -6, -3, 0]) bords.push(s - 1e-6, s - 1e-9, s, s + 1e-6);
    for(const lg of bords){
      const s = m.longueur(lg, VIRGULE);
      if(typeof s === "string" && /e[+-]?\d/i.test(s)){ expo = "à lg = " + lg + " : « " + s + " »"; break; }
    }
    ok("jamais de notation scientifique dans la réglette", expo === null,
       "« 1000 pm » ou « 1,00 nm »", expo || bords.length + " affichages");
  }
}

const GROUPES = [controleSed, controleBandes, controlePhoto, controleEclat, controleLongueur];
for(const g of GROUPES) g(M);

/* ══════════════════════ 9. LES DONNÉES VIENNENT-ELLES VRAIMENT DE LA SOURCE ?

   Le piège que la règle 3 vise : un module qui porterait sa propre copie de la
   table passerait tous les contrôles ci-dessus et ne lirait jamais `contenu.js`.
   On lui pose alors des tables FABRIQUÉES, sur des copies fraîches, et on exige
   que ses réponses suivent. C'est le contrôle qui attrape une constante
   recopiée en dur — celle-là même que `sedMax` invite à écrire. */
groupe("Les chiffres suivent-ils la table qu'on pose ?");
function copie(){ try { return charge(TEXTE); } catch(e){ return null; } }
const clone = o => JSON.parse(JSON.stringify(o));

{
  const vierge = copie();
  let reponse = "—", memes = 0;
  try {
    const a = vierge.sed(PIC[0]), b = vierge.sed(XMIN);
    reponse = "sed = " + a;
    if(a === M.sed(PIC[0])) memes++;
    if(b === M.sed(XMIN)) memes++;
  } catch(err){ reponse = "il refuse : " + err.name; }
  ok("sans `pose`, le module ne connaît pas encore la SED", memes < 2,
     "il refuse, ou répond autre chose", reponse,
     memes >= 2 ? "il rend DÉJÀ les vraies valeurs : la table est recopiée dans le module"
                : "il ne peut donc pas les tenir de lui-même");
}

{
  /* Une table fabriquée dont le pic n'est ni au même endroit ni à la même
     hauteur que le vrai. Une constante en dur y devient visible d'un coup. */
  const faux = { sed: [[-6, 20], [-4, 41.25], [-2, 30]], bandes: clone(SRC.bandes) };
  const m2 = copie();
  let bon = false, vu = "—", eclatPic = NaN;
  try { m2.pose(faux); vu = String(lireSedMax(m2)); bon = rel(lireSedMax(m2), 41.25) < 1e-12;
        eclatPic = m2.eclat(-4); } catch(err){ vu = err.name; }
  ok("sur une table fabriquée, `sedMax` devient 41,25", bon, "41.25", vu,
     "s'il reste à " + YMAX + ", c'est une constante recopiée et non un maximum calculé");
  ok("et l'éclat vaut 1 au pic de CETTE table", rel(eclatPic, 1) < 1e-12, "1", String(eclatPic));
  {
    let lin = 0;
    try { lin = Math.abs(m2.sed(-5) - 30.625); } catch(err){ lin = NaN; }
    ok("et l'interpolation suit la table fabriquée", lin < 1e-12,
       "30.625 au milieu de [-6;-4]", String(30.625 + (fini(lin) ? lin : NaN)));
  }
}
{
  /* Le même contrôle par l'autre bout : la vraie table, translatée. Si le
     module dérive bien son maximum, il doit se translater avec. */
  const decale = { sed: SRC.sed.map(p => [p[0], p[1] + 7]), bandes: clone(SRC.bandes) };
  const m3 = copie();
  let vu = "—", bon = false;
  try { m3.pose(decale); vu = String(lireSedMax(m3)); bon = rel(lireSedMax(m3), YMAX + 7) < 1e-12; }
  catch(err){ vu = err.name; }
  ok("sur la vraie table remontée de 7, `sedMax` remonte de 7 aussi", bon,
     String(YMAX + 7), vu);
}
ok("`pose` n'a pas modifié la source qu'on lui a prêtée",
   JSON.stringify(SRC) === EMPREINTE_SOURCE, "CONTENU.spectre intact",
   JSON.stringify(SRC) === EMPREINTE_SOURCE ? "intact" : "MODIFIÉ EN PLACE",
   "`index.html` lit le même objet : le trier sur place changerait la courbe affichée");

/* ═══════════════════════════ 10. LE CONTRÔLE SAIT-IL ÉCHOUER ?  (règle 2)

   On rejoue les cinq groupes, en silence, sur des modules cassés, et l'on exige
   qu'ils tombent. Aucun fichier n'est touché : les sabotages sont des copies en
   mémoire. Le détail de ce qui doit tomber est en tête de ce fichier. */
groupe("Le contrôle sait échouer — on le casse pour le prouver");
function essaie(nom, m, donnees, note){
  if(!m){ ok(nom, false, "un module saboté chargeable", "il ne se charge plus"); return; }
  carnet = [];
  try {
    if(donnees) m.pose(donnees);
    for(const g of GROUPES) g(m);
  } catch(err){ carnet.push({ nom: "exception : " + err.message, vrai: false }); }
  const lot = carnet; carnet = null;
  const tombes = lot.filter(c => !c.vrai);
  ok(nom, tombes.length > 0, "au moins un contrôle tombe",
     tombes.length + " tombés sur " + lot.length,
     tombes.length ? "→ " + tombes.slice(0, 3).map(c => c.nom).join(" ; ")
                   : "AUCUN — les contrôles ci-dessus ne surveillent donc rien" + (note ? " (" + note + ")" : ""));
}

/* a. par l'environnement : aucune ligne du module n'est touchée. On décale
      toutes les longueurs d'onde d'un demi-ordre de grandeur. Le module reste
      parfaitement cohérent avec lui-même ; il ne ment que par rapport au monde.
      C'est la forme de sabotage qui s'applique à coup sûr, quelle que soit la
      façon dont quelqu'un d'autre a écrit le module. */
{
  const d = 0.5;
  const enveloppe = f => (typeof f === "function" ? (lg => f(lg + d)) : f);
  const menteur = {
    pose: x => M.pose(x), sed: enveloppe(M.sed), bande: enveloppe(M.bande),
    rPhotosphere: enveloppe(M.rPhotosphere), eclat: enveloppe(M.eclat),
    longueur: enveloppe(M.longueur), COUL_BANDE: M.COUL_BANDE,
    get sedMax(){ return lireSedMax(M); },
  };
  essaie("décaler toutes les longueurs d'onde d'un demi-ordre fait tomber le filet", menteur, null);
}
essaie("poser une table dont le pic a bougé fait tomber le filet", copie(),
       { sed: NOEUDS.map(p => [p[0], YMAX + 1 - Math.abs(p[0] - XMIN)*0.3]), bandes: clone(SRC.bandes) });
essaie("poser des bandes décalées de 0,4 fait tomber le filet", copie(),
       { sed: clone(SRC.sed), bandes: SRC.bandes.map(b => ({ ...b, min: b.min + 0.4, max: b.max + 0.4 })) });
essaie("poser une table VIDE fait tomber le filet", copie(), { sed: [], bandes: [] },
       "un module qui répond sur une table vide porte sa propre copie des données");

/* b. par le texte, dans une copie en mémoire du source. Si le motif n'existe
      pas — le module peut être écrit tout autrement — on le DIT au lieu de
      faire semblant de l'avoir essayé. */
const SABOTAGES = [
  { nom: "le calage de la photosphère, 0.079 → 0.9", motif: /(?<![\d.])0\s*\.\s*079(?![\d])/, par: "0.9" },
  { nom: "le pivot de la photosphère, 2.886 → 2.2",  motif: /(?<![\d.])2\s*\.\s*886(?![\d])/, par: "2.2" },
  { nom: "la compression de l'éclat, 0.45 → 1.0",    motif: /(?<![\d.])0\s*\.\s*45(?![\d])/,  par: "1.0" },
];
for(const s of SABOTAGES){
  if(!s.motif.test(TEXTE)){
    console.log("  ·   " + s.nom + " — motif introuvable dans le source, non tenté");
    continue;
  }
  let mutant = null;
  try { mutant = charge(TEXTE.replace(s.motif, s.par)); } catch(err){ /* rien */ }
  essaie("saboter " + s.nom + " fait tomber le filet", mutant, SRC);
}

/* ════════════════ 11. L'ÉTAT D'OÙ L'ON A MESURÉ (règle 5, l'affaire de `couture()`)

   Tout ce qui précède ne vaut que si le module interrogé au premier groupe est
   encore celui-là au dernier. Les sabotages travaillent sur des copies — mais
   c'est précisément ce genre de « mais » qui a fait mesurer un travelling
   depuis un point de vue qu'on n'avait pas choisi. On redemande. */
groupe("L'état d'où l'on a mesuré n'a pas bougé pendant qu'on mesurait");
{
  const relu = { sed: M.sed(PIC[0]), max: lireSedMax(M), bande: M.bande(PIC[0]).id };
  ok("le module principal répond encore ce qu'il répondait au départ",
     rel(relu.sed, YMAX) < 1e-12 && rel(relu.max, YMAX) < 1e-12
       && relu.bande === BANDES.find(b => PIC[0] >= b.min && PIC[0] < b.max).id,
     "sed = " + YMAX + ", sedMax = " + YMAX,
     "sed = " + relu.sed + ", sedMax = " + relu.max + ", bande « " + relu.bande + " »",
     "si ceci tombe, les onze groupes précédents sont à jeter, pas à lire");
  ok("et la source n'a pas bougé non plus", JSON.stringify(SRC) === EMPREINTE_SOURCE,
     "CONTENU.spectre intact", JSON.stringify(SRC) === EMPREINTE_SOURCE ? "intact" : "MODIFIÉ");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
