/* ============================================================================
   LE HOOK QUI REFUSE L'ARRÊT, ÉPROUVÉ AVANT D'ÊTRE BRANCHÉ.

       node outil-verif-encore.js

   `outils/encore.js` bloque la fin de mon tour tant qu'une case du chantier
   reste à cocher. Un hook pareil a deux pannes possibles, et elles ne coûtent
   pas le même prix : ne jamais bloquer coûte une continuation manquée, qu'on
   voit tout de suite. Bloquer sans fin produit du remplissage jusqu'à la
   coupure de Claude Code, au bout de huit blocages.

   D'où ce fichier, écrit AVANT que le hook soit branché. Trois vrais défauts en
   sont sortis, tous du côté cher :

     · une entrée illisible supprimait le garde-fou anti-boucle — le commentaire
       du script disait « pas de JSON : on ne bloque pas » et le code faisait
       exactement l'inverse ;
     · une entrée vide faisait pareil, par le `|| "{}"` qui la rendait valide ;
     · la porte de sortie n'acceptait qu'`ARRÊT` accentué, c'est-à-dire qu'elle
       échouait au moment précis où l'on en a besoin — quand quelque chose est
       cassé et qu'on écrit vite.

   Le bac d'essai est un dossier jetable : on n'écrit JAMAIS dans le vrai
   `CHANTIER-F2.md`, qui est la liste dont dépend tout le chantier. Le script
   lit sa liste en remontant d'un cran depuis son propre dossier — il suffit
   donc de reproduire cette forme.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync } = require("child_process");

const SOURCE = __dirname;
const BAC = fs.mkdtempSync(path.join(os.tmpdir(), "hook-"));
fs.mkdirSync(path.join(BAC, "outils"));
fs.copyFileSync(path.join(SOURCE, "outils/encore.js"), path.join(BAC, "outils/encore.js"));

const LISTE = path.join(BAC, "CHANTIER-F2.md");
const SCRIPT = path.join(BAC, "outils/encore.js");

function joue(contenu, entree){
  fs.writeFileSync(LISTE, contenu, "utf8");
  const sortie = execFileSync("node", [SCRIPT], { input: entree, encoding: "utf8" });
  return /"decision"\s*:\s*"block"/.test(sortie);
}

let n = 0, ko = 0;
function ok(nom, vrai, attendu){
  n++; if(!vrai) ko++;
  console.log("  " + (vrai ? "OK  " : "KO  ") + nom.padEnd(52) + attendu);
}

const AVEC_CASE   = "# essai\n\n- [x] faite\n- [ ] une qui reste\n";
const TOUT_FAIT   = "# essai\n\n- [x] faite\n- [x] une autre\n";
const QUE_HUGO    = "# essai\n\n- [x] faite\n- [ ] son oeil **(HUGO)**\n";
const MELANGE     = "# essai\n\n- [ ] a moi\n- [ ] son oeil **(HUGO)**\n";

ok("une case a moi -> il bloque",            joue(AVEC_CASE, "{}") === true,  "bloque");
ok("plus aucune case -> il se tait",         joue(TOUT_FAIT, "{}") === false, "passe");
ok("il ne reste que celles d'Hugo",          joue(QUE_HUGO,  "{}") === false, "passe");
ok("melange : la mienne le fait bloquer",    joue(MELANGE,   "{}") === true,  "bloque");
ok("deja en continuation forcee",            joue(AVEC_CASE, '{"stop_hook_active":true}') === false, "passe");
ok("entree illisible",                       joue(AVEC_CASE, "pas du json") === false, "passe");
ok("entree vide",                            joue(AVEC_CASE, "") === false, "passe");
ok("BOM en tete de l'entree",                joue(AVEC_CASE, "\uFEFF{}") === true, "bloque quand meme");

for(const mot of ["ARRÊT", "ARRET", "arrêt", "Arrêt"])
  ok("porte de sortie ecrite « " + mot + " »",
     joue("## " + mot + " — parce que\n\n" + AVEC_CASE, "{}") === false, "passe");

ok("« ARRETE » ailleurs dans le texte ne compte pas",
   joue("# essai\n\nun mot ARRÊT au milieu\n\n- [ ] a moi\n", "{}") === true, "bloque");

fs.rmSync(BAC, { recursive: true, force: true });
console.log("\n  " + (ko ? ko + " ECHEC(S) sur " + n : "TOUT PASSE — " + n + " cas") + "\n");
process.exit(ko ? 1 : 0);
