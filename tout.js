/* ============================================================================
   TOUT — une commande, un verdict.

       node tout.js

   Il y avait neuf outils de contrôle et soixante et onze contrôles dans la page.
   Pour savoir si le dépôt allait bien, il fallait connaître la liste, la taper
   à la main, et se souvenir de ce qui manquait. Autant dire qu'on ne le faisait
   qu'après un doute — c'est-à-dire trop tard.

   ---------------------------------------------------------------------------
   IL SIGNALE CE QUI N'EST GARDÉ PAR PERSONNE

   `recul.js` a vécu un mois sans le moindre contrôle. Personne ne l'avait
   décidé : il n'y avait simplement rien pour dire qu'il n'en avait pas. Un
   inventaire écrit à la main aurait le même défaut, puisqu'il faudrait penser à
   le tenir.

   On croise donc les modules de la racine avec les `outil-verif-*.js` qui les
   chargent, et l'on NOMME les orphelins. La liste se fabrique toute seule.

   ---------------------------------------------------------------------------
   IL NE MENT PAS SUR SA COUVERTURE

   Les soixante et onze contrôles de `verif.js` exigent un vrai navigateur : ils
   lisent des pixels, mesurent des mises en page, compilent des nuanceurs. Rien
   ici ne peut en piloter un — le dépôt n'a aucune dépendance, et ce n'est pas
   négociable pour un site qui se veut statique.

   Cet outil ne les joue donc pas, et il le dit. Un contrôle qui prétend couvrir
   ce qu'il ne couvre pas est pire que pas de contrôle : il endort.
   ============================================================================ */

"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ici = __dirname;
const C = { gras:"\x1b[1m", vert:"\x1b[32m", rouge:"\x1b[31m",
            jaune:"\x1b[33m", gris:"\x1b[90m", zero:"\x1b[0m" };
// Une sortie redirigée ne veut pas de codes de couleur.
const couleur = process.stdout.isTTY;
const c = (t, k) => couleur ? C[k] + t + C.zero : t;

// ─────────────────────────────────────────────────────── les outils à jouer
/* `outil-verif-publication.js` est écarté À DESSEIN.

   Il regarde si le site EN LIGNE correspond à ce qu'on a poussé. Or avoir des
   commits non publiés est l'état normal du dépôt : l'inclure ici ferait échouer
   `node tout.js` presque toujours, et un contrôle qui échoue en permanence se
   fait désactiver dans la semaine.

   Il se lance seul, après une publication. */
const HORS_FILET = new Set(["outil-verif-publication.js"]);

const outils = fs.readdirSync(ici)
  .filter(f => /^outil-.*\.js$/.test(f) && !HORS_FILET.has(f))
  .sort();

console.log("\n  " + c("PÉRIASTRE — LE FILET COMPLET", "gras"));
console.log("  " + "═".repeat(28) + "\n");

let echecs = 0, total = 0;
const rates = [];
const depart = Date.now();

for(const o of outils){
  process.stdout.write("  " + o.padEnd(28));
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [path.join(ici, o)], { encoding:"utf8" });
  const ms = Date.now() - t0;
  total++;
  if(r.status === 0){
    // On relève le compte de contrôles que l'outil annonce, s'il en annonce un.
    const m = (r.stdout || "").match(/TOUT PASSE\s*—\s*(\d+)/);
    console.log(c("✅", "vert") + "  " + (m ? m[1] + " contrôles" : "passe").padEnd(16)
                + c(ms + " ms", "gris"));
  } else {
    echecs++;
    rates.push({ o, sortie: (r.stdout || "") + (r.stderr || "") });
    console.log(c("❌  ÉCHEC", "rouge") + "        " + c(ms + " ms", "gris"));
  }
}

// ──────────────────────────────────────── qui garde quoi, et qui ne garde rien
/* Un module est « gardé » si un outil le charge, ou si un autre module gardé le
   charge. `contrat.js` n'est jamais chargé par la page : il l'est par
   `outil-verif-contenu.js`, et c'est très bien — il vit au moment du contrôle. */
const modules = fs.readdirSync(ici)
  .filter(f => f.endsWith(".js") && !/^outil-/.test(f) && f !== "tout.js")
  .sort();

const sourceVerif = fs.readFileSync(path.join(ici, "verif.js"), "utf8");
const sourcesOutils = outils.map(o => fs.readFileSync(path.join(ici, o), "utf8")).join("\n");
/* TOUTES les pages, pas seulement le simulateur.

   La première version ne lisait qu'`index.html` et accusait donc `journal.js`
   d'être branché à rien — il est dans `journal.html`. Même angle mort que
   `outils/version.mjs`, corrigé le même jour : dès qu'une seconde page existe,
   tout outil qui n'en connaît qu'une ment. */
const PAGES = fs.readdirSync(ici).filter(f => f.endsWith(".html"));
const page = PAGES.map(f => fs.readFileSync(path.join(ici, f), "utf8")).join("\n");

/* UN MODULE PEUT ÊTRE GARDÉ DE DEUX FAÇONS, ET LA PREMIÈRE VERSION N'EN VOYAIT
   QU'UNE. Elle cherchait le nom de FICHIER dans les outils, et déclarait donc
   orphelins `kerr.js`, `voyage1g.js`, `personnage.js` — qui sont contrôlés dans
   la page, mais par leur nom de GLOBAL. Un inventaire qui crie au loup sur du
   code gardé se fait ignorer en trois jours, ce qui revient à ne pas l'avoir. */
const globalDe = m => {
  const s = fs.readFileSync(path.join(ici, m), "utf8");
  // `global.X =` dans les modules refermés sur un faux `window`, `window.X =`
  // dans ceux qui ne le sont pas — les deux existent, et l'oubli du second
  // faisait passer `ui.fr.js` pour un orphelin.
  const g = s.match(/(?:global|window)\.([A-Z][A-Z0-9_]*)\s*=/);
  return g ? g[1] : null;
};

const orphelins = [], horsPage = [];
for(const m of modules){
  const nom = globalDe(m);
  const parOutil = sourcesOutils.includes(m);
  /* On cherche le global AU MOT PRÈS dans `verif.js`. Chercher la chaîne entre
     guillemets ne voyait que la liste de présence, et déclarait donc orphelin
     `temps.js` — que `tempsJuste()` éprouve d'un bout à l'autre. */
  const parLaPage = !!nom && new RegExp("\\b" + nom + "\\b").test(sourceVerif);
  const dansPage = new RegExp(m.replace(".", "\\.") + "\\?v=").test(page)
                || page.includes('"' + m + '"') || page.includes("'" + m + "'");

  if(!parOutil && !parLaPage) orphelins.push({ m, nom });
  else if(!dansPage && !/^(contrat|verif)\.js$/.test(m)) horsPage.push(m);
}

/* Le titre dit ce que la mesure sait, pas plus. Un module peut se garder
   lui-même — `juge.js` rejoue son propre déplacement au démarrage de chaque
   séance — et cette liste ne le verra jamais. C'est un signal à regarder, pas
   un verdict à opposer. */
console.log("\n  " + c("MODULES SANS OUTIL DÉDIÉ NI CONTRÔLE DANS verif.js", "gras"));
console.log("  " + "─".repeat(50));
if(orphelins.length === 0){
  console.log("  " + c("✅", "vert") + "  tout module est gardé, par un outil ou par la page");
} else {
  for(const o of orphelins)
    console.log("  " + c("·", "jaune") + "   " + o.m.padEnd(18)
                + c(o.nom ? "global " + o.nom : "aucun global exporté", "gris"));
  console.log("  " + c("    Certains se gardent eux-mêmes — à regarder, pas à corriger d'office.", "gris"));
}

/* UN MODULE NON BRANCHÉ DOIT PORTER SA RAISON, SINON L'OUTIL ÉCHOUE.

   Trois modules étaient signalés du même ton depuis des semaines — et l'un des
   trois n'est PAS une dette : `kerrschild.js` est l'arbitre du nuanceur, il tire
   sa vérité d'ailleurs précisément parce qu'il ne tourne jamais dans la page.
   Le mettre sur la même ligne que `ncorps.js`, écrit et oublié, apprend à
   ignorer la liste entière.

   Chaque module hors page porte donc une raison écrite ici. Un module qui n'en
   a pas fait ÉCHOUER `node tout.js` : on ne peut plus en oublier un en silence,
   et on ne peut plus faire semblant qu'une dette est un choix. */
const POURQUOI_PAS_BRANCHE = {
  "kerrschild.js":
    "ARBITRE, jamais chargé — il éprouve le nuanceur depuis dehors (règle 3). "
    + "Le brancher le rendrait complice de ce qu'il contrôle.",
  "ncorps.js":
    "DETTE F3, en cours — décision d'Hugo du 6 août : on branche N corps, on "
    + "laisse la Lune. Usage retenu : un compagnon au trou noir d'étude.",
  "lieux.js":
    "ÉCRIT, EN ATTENTE DE BRANCHEMENT — extrait le 8 août. `vaAu` y rend des "
    + "ORDRES au lieu d'agir, et l'état passe par un sac que la page tient. "
    + "C'est la fondation F1 : elle se recâble en début de session, avec "
    + "`VERIF.lieux()` sous les yeux, pas en fin de chantier.",
  "progression.js":
    "ÉCRIT, EN ATTENTE DE BRANCHEMENT — extrait le 8 août. Son contrat change "
    + "la forme de neuf fonctions et rend des ORDRES au lieu d'agir : la "
    + "chirurgie est sa propre étape, et la bâcler en fin de session serait la "
    + "pire façon de toucher à la mémoire du site.",
  "echelle.js":
    "EN ATTENTE D'UNE DÉCISION — moteur de voyage d'échelle sans lieu où vivre. "
    + "À trancher avec le chantier des scènes, pas avant.",
  "lune.js":
    "ÉCARTÉ — le carnet lui reproche de ne pas être sourçable, et le désaccord "
    + "n'a jamais été tranché. Décision d'Hugo du 6 août : on la laisse de côté.",
};

if(horsPage.length){
  const sansRaison = horsPage.filter(m => !POURQUOI_PAS_BRANCHE[m]);
  console.log("\n  " + c("HORS PAGE, ET POURQUOI", "gras"));
  console.log("  " + "─".repeat(23));
  for(const m of horsPage){
    const n = fs.readFileSync(path.join(ici, m), "utf8").split("\n").length;
    const r = POURQUOI_PAS_BRANCHE[m];
    console.log("  " + c(r ? "·" : "❌", r ? "gris" : "rouge") + "   " + m.padEnd(18)
                + String(n).padStart(5) + " lignes");
    console.log("      " + c(r || "AUCUNE RAISON ÉCRITE — ni acquis ni dette, "
                + "le troisième état. Décider, ou l'écrire dans POURQUOI_PAS_BRANCHE.",
                r ? "gris" : "rouge"));
  }
  if(sansRaison.length){
    echecs++;
    rates.push({ o: "tout.js — modules sans raison",
                 sortie: "❌ " + sansRaison.join(", ") + " : hors page et sans raison écrite." });
  }
}

// ──────────────────────────────────────────── ce que cet outil ne peut pas faire
console.log("\n  " + c("CE QUE CETTE COMMANDE NE COUVRE PAS", "gras"));
console.log("  " + "─".repeat(35));
console.log("  Les contrôles de " + c("verif.js", "gras")
            + " exigent un navigateur — pixels, mise en page, nuanceurs.");
console.log("  Ils ne sont " + c("pas", "gras") + " joués ici. Pour les jouer :\n");
console.log("      " + c("http://localhost:8765/?verif", "gris") + "   puis   "
            + c("VERIF.sain()", "gris"));
console.log("      " + c("http://localhost:8765/?juge", "gris")
            + "    la séance de jugement, pour ce qu'aucun calcul ne tranche\n");

// ────────────────────────────────────────────────────────────────── le verdict
if(rates.length){
  console.log("  " + c("LE DÉTAIL DES ÉCHECS", "gras"));
  console.log("  " + "─".repeat(20));
  for(const r of rates){
    console.log("\n  " + c("── " + r.o + " ──", "rouge"));
    const lignes = r.sortie.split("\n").filter(l => /❌|Error|error/.test(l));
    for(const l of lignes.slice(0, 12)) console.log("  " + l);
  }
  console.log("");
}

const verdict = echecs === 0;
const secondes = ((Date.now() - depart)/1000).toFixed(1);
console.log("  " + (verdict
  ? c("✅  LE FILET TIENT — " + total + " outils, aucun échec", "vert")
  : c("❌  " + echecs + " OUTIL(S) EN ÉCHEC sur " + total, "rouge"))
  + c("   " + secondes + " s", "gris"));
if(orphelins.length || horsPage.length)
  console.log("  " + c("    (" + (orphelins.length + horsPage.length)
              + " signalement(s) ci-dessus — ils n'échouent pas, ils attendent une décision)", "gris"));
console.log("");

process.exit(verdict ? 0 : 1);
