/* ============================================================================
   CE QUI EST EN LIGNE EST-IL CE QU'ON A POUSSÉ ?

       node outil-verif-publication.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   Le 6 août 2026, j'ai annoncé « c'est publié » quatre fois dans la journée. Je
   vérifiais que `git push` avait réussi, et je m'arrêtais là.

   Or `git push` ne publie rien : il envoie. C'est GitHub Pages qui construit
   ensuite, et **ses constructions échouaient depuis 9 h 32 du matin**. Le site
   est resté figé sur une version d'avant pendant que je décrivais à Hugo des
   correctifs qu'il ne pouvait pas voir — jusqu'à ce qu'il juge un moteur
   réécrit et me rende un verdict sur l'ancien.

   Une séance de jugement rendue sur du code périmé est pire qu'une séance non
   jouée : elle consomme la seule ressource rare du projet, et elle rend un
   résultat faux qu'on croit vrai.

   ---------------------------------------------------------------------------
   CE QU'IL NE FAUT PAS EN FAIRE

   Il n'entre PAS dans `node tout.js`. Avoir des commits non publiés est l'état
   normal du dépôt, et un contrôle qui échoue en permanence se fait désactiver.
   Celui-ci se lance APRÈS une publication, et lui seul dit si elle a eu lieu.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const { execSync } = require("child_process");

const RACINE = "https://hugohismans.github.io/periastre/";
const DEPOT  = "hugohismans/periastre";

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

const estampilleDe = t => (t.match(/physique\.js\?v=([0-9a-f]+)/) || [])[1] || null;

(async function(){
  console.log("\n  LA PUBLICATION A-T-ELLE EU LIEU ?");
  console.log("  ═════════════════════════════════");

  // ────────────────────────────────────────────── 1. ce qu'on a poussé
  groupe("Ce que le dépôt distant contient");
  let local = null, distant = null;
  try {
    local   = execSync("git rev-parse --short main", { cwd: __dirname }).toString().trim();
    execSync("git fetch -q origin", { cwd: __dirname });
    distant = execSync("git rev-parse --short origin/main", { cwd: __dirname }).toString().trim();
  } catch(e){ /* pas de réseau : on le dira plus bas */ }

  ok("`main` local et distant sont au même commit", local && local === distant,
     local || "?", distant || "injoignable",
     "sans ça, rien n'a été envoyé — inutile de regarder le site");

  const attendue = estampilleDe(fs.readFileSync(path.join(__dirname, "index.html"), "utf8"));
  ok("l'index local porte une estampille", !!attendue, "une version", attendue || "AUCUNE");

  // ─────────────────────────────────────── 2. ce que GitHub a construit
  groupe("Ce que GitHub Pages a réellement construit");
  let builds = null;
  try {
    builds = JSON.parse(execSync("gh api repos/" + DEPOT + "/pages/builds", { cwd: __dirname }).toString());
  } catch(e){ /* gh absent ou non connecté */ }

  if(!builds){
    console.log("  ·   `gh` indisponible — on saute au contrôle décisif, celui du site.");
  } else {
    const dernier = builds[0];
    const rates = builds.slice(0, 6).filter(b => b.status === "errored");
    ok("la dernière construction n'est pas en échec", dernier.status !== "errored",
       "built ou building", dernier.status + " (" + dernier.commit.slice(0, 7) + ")",
       dernier.status === "building" ? "elle tourne encore : relancer cet outil dans une minute" : undefined);
    ok("aucune des six dernières n'a échoué", rates.length === 0, 0,
       rates.length + (rates.length ? " — " + rates.map(b => b.commit.slice(0,7)).join(", ") : ""),
       rates.length ? "une construction en échec laisse le site sur la version PRÉCÉDENTE, en silence" : undefined);
  }

  // ──────────────────────────────────── 3. le seul contrôle qui tranche
  /* On demande la page au serveur en interdisant tout cache, et l'on regarde ce
     qu'elle contient VRAIMENT. C'est le seul contrôle qui ne peut pas être
     trompé — ni par git, ni par l'API, ni par le navigateur. */
  groupe("Ce que le serveur sert, cache désactivé");
  try {
    const r = await fetch(RACINE + "index.html?casse=" + Date.now(), { cache: "no-store" });
    const t = await r.text();
    const enLigne = estampilleDe(t);
    ok("le site sert bien l'estampille attendue", enLigne === attendue,
       attendue, enLigne || "aucune",
       enLigne !== attendue
         ? "LE SITE EST EN RETARD. Ne pas demander de séance de jugement dessus."
         : undefined);
    ok("la page en ligne n'est pas vide", t.length > 100000, "> 100 000 octets", t.length);
  } catch(e){
    ok("le site répond", false, "une page", e.message,
       "sans réseau, cet outil ne peut rien affirmer — et il ne prétend pas le contraire");
  }

  console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                               : "✅  LA PUBLICATION EST EFFECTIVE — " + n + " contrôles") + "\n");
  process.exit(echecs ? 1 : 0);
})();
