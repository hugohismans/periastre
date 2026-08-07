/* ============================================================================
   CE QUI EST EN LIGNE EST-IL CE QU'ON A POUSSÉ ?

       node outil-verif-publication.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   Le 6 août 2026, j'ai annoncé « c'est publié » quatre fois dans la journée. Je
   vérifiais que `git push` avait réussi, et je m'arrêtais là.

   Or `git push` ne publie rien : il envoie. C'est GitHub qui construit ensuite.
   Hugo a fini par juger un moteur réécrit et me rendre un verdict sur l'ancien.

   Une séance de jugement rendue sur du code périmé est pire qu'une séance non
   jouée : elle consomme la seule ressource rare du projet, et elle rend un
   résultat faux qu'on croit vrai.

   ---------------------------------------------------------------------------
   ET POURQUOI IL A ÉTÉ RÉÉCRIT LE LENDEMAIN

   La première version demandait à GitHub s'il avait bien construit. Elle a
   alors annoncé l'échec pendant que le site marchait — le symétrique exact de
   la faute qu'elle était censée empêcher, et tout aussi coûteux.

   Ce dépôt est dans un état mixte : `build_type` vaut encore `legacy` alors
   qu'une action `pages-build-deployment` dépose le contenu. Résultat, TROIS
   signaux d'état, et les trois se trompent :

       pages/builds            « Page build failed » à chaque commit depuis
                               9 h 32 le 6 août — le pipeline Jekyll hérité
                               échoue, mais ce n'est plus lui qui sert.
       actions/runs            conclusion « failure », toujours après très
                               exactement dix minutes : l'étape de dépôt attend
                               une confirmation qui n'arrive pas, et abandonne.
       l'onglet Pages          « Your site is live », ce qui était vrai.

   Pendant ces trois échecs annoncés, le contenu arrivait. Vérifié le 7 août :
   `origin/main` portait l'estampille 1452ed8, le serveur servait 1452ed8.

   ---------------------------------------------------------------------------
   CE QU'ON EN TIRE, ET QUI TIENT MÊME SI GITHUB CHANGE D'AVIS

   Un seul fait tranche : **ce que le serveur envoie quand on le lui demande,
   cache interdit.** Il ne dépend d'aucune API, d'aucun tableau de bord, et
   d'aucune interprétation. Tout le reste est indicatif et ne peut PAS faire
   échouer cet outil — sinon il redevient ce qu'il était, un crieur de loup.

   Deuxième correction : on compare à l'estampille COMMITTÉE SUR `origin/main`,
   pas à celle du dossier de travail. `node outils/version.mjs` estampille avant
   de committer, donc le dossier de travail est légitimement en avance dès qu'on
   prépare une publication. La première version comparait à lui et accusait le
   serveur d'être en retard sur du code jamais envoyé.

   ---------------------------------------------------------------------------
   CE QU'IL NE FAUT PAS EN FAIRE

   Il n'entre PAS dans `node tout.js`. Avoir des commits non publiés est l'état
   normal du dépôt, et un contrôle qui échoue en permanence se fait désactiver.
   Celui-ci se lance APRÈS une publication, et lui seul dit si elle a eu lieu.
   ============================================================================ */

"use strict";
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
// Ce qu'on regarde sans lui donner le droit de conclure.
const note = (nom, valeur) => console.log("  ·   " + nom.padEnd(34) + valeur);

const git = c => execSync(c, { cwd: __dirname }).toString().trim();
const estampilleDe = t => (t.match(/physique\.js\?v=([0-9a-f]+)/) || [])[1] || null;

(async function(){
  console.log("\n  LA PUBLICATION A-T-ELLE EU LIEU ?");
  console.log("  ═════════════════════════════════");

  // ─────────────────────────────────────────────────── 1. l'envoi a-t-il eu lieu
  groupe("Ce que le dépôt distant contient");
  let local = null, distant = null, attendue = null;
  try {
    local = git("git rev-parse --short main");
    git("git fetch -q origin");
    distant = git("git rev-parse --short origin/main");
    attendue = estampilleDe(git("git show origin/main:index.html"));
  } catch(e){ /* pas de réseau, ou pas de distant : dit plus bas */ }

  ok("`main` local et distant sont au même commit", !!local && local === distant,
     local || "?", distant || "injoignable",
     "sans ça, rien n'a été envoyé — inutile de regarder le site");

  ok("l'index poussé porte une estampille", !!attendue, "une version",
     attendue || "AUCUNE",
     "c'est l'estampille de `origin/main`, pas celle du dossier de travail : "
     + "celui-ci a le droit d'être en avance");

  // ────────────────────────── 2. le seul contrôle qui tranche, et il est seul
  /* On demande la page au serveur en interdisant tout cache, et l'on regarde ce
     qu'elle contient VRAIMENT. C'est le seul fait qui ne puisse être démenti ni
     par git, ni par une API, ni par un cache de navigateur. */
  groupe("Ce que le serveur sert, cache désactivé");
  let servie = null;
  try {
    const r = await fetch(RACINE + "index.html?casse=" + Date.now(), { cache: "no-store" });
    const t = await r.text();
    servie = estampilleDe(t);
    ok("le site sert bien l'estampille poussée", !!attendue && servie === attendue,
       attendue || "?", servie || "aucune",
       servie !== attendue
         ? "LE SITE EST EN RETARD. Ne pas demander de séance de jugement dessus — "
           + "le déploiement prend parfois vingt minutes de plus que ce qu'il annonce."
         : undefined);
    ok("la page en ligne n'est pas vide", t.length > 100000, "> 100 000 octets", t.length);
  } catch(e){
    ok("le site répond", false, "une page", e.message,
       "sans réseau, cet outil ne peut rien affirmer — et il ne prétend pas le contraire");
  }

  // ───────────────────────────────────── 3. ce que GitHub raconte, pour mémoire
  /* Aucun de ces trois relevés ne peut faire échouer l'outil. Ils sont là parce
     qu'un jour ils redeviendront fiables, et qu'il faudra le voir. */
  groupe("Ce que GitHub raconte — indicatif, jamais décisif");
  /* `gh` écrit ses échecs sur la sortie d'erreur, qu'on laisse tomber : une
     absence de `gh` n'est pas un incident, et son message au milieu d'un
     rapport se lit comme un. */
  const api = chemin => JSON.parse(execSync("gh api " + chemin,
    { cwd: __dirname, stdio: ["ignore", "pipe", "ignore"] }).toString());

  try {
    const b = api("repos/" + DEPOT + "/pages/builds?per_page=1")[0];
    note("pipeline Jekyll hérité", b.status + " (" + b.commit.slice(0, 7) + ")");
  } catch(e){ note("pipeline Jekyll hérité", "gh indisponible"); }
  try {
    // L'action de Pages n'a pas de fichier dans le dépôt — son chemin est
    // `dynamic/pages/pages-build-deployment`, et on ne peut donc pas la
    // demander par nom de fichier. On prend la dernière exécution, tout court.
    const r = api("repos/" + DEPOT + "/actions/runs?per_page=1").workflow_runs[0];
    const min = Math.round((new Date(r.updated_at) - new Date(r.created_at))/60000);
    note("action de dépôt", (r.conclusion || r.status) + " en " + min + " min"
         + (r.conclusion === "failure" && min >= 10
            ? "   ← l'expiration connue : le contenu arrive quand même" : ""));
  } catch(e){ note("action de dépôt", "gh indisponible"); }
  try {
    const p = api("repos/" + DEPOT + "/pages");
    note("type de construction déclaré", p.build_type
         + (p.build_type === "legacy"
            ? "   ← la cause : réglage hérité, action moderne" : ""));
  } catch(e){ note("type de construction déclaré", "gh indisponible"); }

  console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHEC(S) sur " + n + " contrôles"
                               : "✅  LA PUBLICATION EST EFFECTIVE — " + n + " contrôles")
              + (servie ? "   le site sert " + servie : "") + "\n");
  process.exit(echecs ? 1 : 0);
})();
