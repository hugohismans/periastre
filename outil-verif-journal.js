/* ============================================================================
   Le journal, en trois langues — contrôle de parité.

       node outil-verif-journal.js

   Un fichier trilingue dérive en silence, et c'est sa nature : on corrige une
   phrase en français, on oublie l'espagnol, et personne ne s'en aperçoit avant
   qu'un lecteur hispanophone tombe sur un paragraphe qui n'a plus de sens.

   Le même risque a été traité pour `contenu.js` par un contrat qui refuse. On
   applique ici la même idée, en plus léger : le journal ne porte pas
   d'affirmations factuelles sourcées, mais il porte une STRUCTURE, et c'est
   elle qui doit rester identique d'une langue à l'autre.

   Il vérifie aussi les formules : elles sont écrites en LaTeX dans des chaînes
   JavaScript, ce qui veut dire que chaque antislash doit être doublé. Un seul
   oublié et `\frac` devient une tabulation suivie de « rac ». Ça m'est arrivé
   trois fois en écrivant cette page — d'où ce contrôle.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const faux = {};
new Function("window", fs.readFileSync(path.join(__dirname, "journal.js"), "utf8"))(faux);
const J = faux.JOURNAL;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

const LANGUES = ["fr", "en", "es"];
const CLES = ["langue", "marque", "versLeSite", "numero", "titre", "chapeau",
              "niveaux", "schema", "graphe", "pied", "corps"];

console.log("\n  LE JOURNAL — PARITÉ DES TROIS LANGUES");
console.log("  ═════════════════════════════════════");

// ══════════════════════════════════════════════════════════ 1. la structure
groupe("Les trois langues ont la même forme");
ok("les trois langues existent", LANGUES.every(l => !!J[l]),
   LANGUES.join(", "), Object.keys(J).join(", "));

for(const l of LANGUES){
  if(!J[l]) continue;
  const manque = CLES.filter(c => J[l][c] === undefined);
  ok("« " + l + " » porte toutes les rubriques", manque.length === 0,
     CLES.length + " rubriques", manque.length ? "il manque " + manque.join(", ") : "complet");
}

groupe("Les niveaux et le schéma se correspondent");
for(const l of LANGUES){
  if(!J[l]) continue;
  ok("« " + l + " » a trois niveaux de lecture", J[l].corps.length === 3, 3, J[l].corps.length);
  ok("« " + l + " » nomme ses trois niveaux", J[l].niveaux.length === 3, 3, J[l].niveaux.length);
  ok("« " + l + " » a les quatre étapes de la boucle",
     J[l].schema.etapes.length === 4, 4, J[l].schema.etapes.length);
  const mal = J[l].schema.etapes.filter(e => e.length !== 3);
  ok("et chaque étape porte ses trois libellés", mal.length === 0, 0, mal.length,
     "une étiquette, un titre, une précision");
}

// ═══════════════════════════════════════════════ 2. les titres de chapitres
/* Le niveau technique se rend en chapitres repliables, découpés sur les `<h2>`.
   Si une langue en a un de plus ou de moins, elle n'offre pas la même table —
   et le graphe, qui s'ancre sur un chapitre, peut atterrir ailleurs. */
groupe("Le niveau technique offre la même table dans les trois langues");
{
  const compte = l => (J[l].corps[2].match(/<h2>/g) || []).length;
  const c = LANGUES.map(compte);
  ok("même nombre de chapitres partout", new Set(c).size === 1,
     "identique", LANGUES.map((l, i) => l + "=" + c[i]).join("  "));
  for(const l of LANGUES){
    const h2 = (J[l].corps[0].match(/<h2>/g) || []).length;
    ok("« " + l + " » : le niveau d'accueil a ses sections", h2 >= 5, "≥ 5", h2);
  }
}

// ══════════════════════════════════════════════════════════ 3. les formules
/* Le piège qui m'a eu trois fois : le LaTeX vit dans une chaîne JavaScript, donc
   `\frac` doit s'écrire `\\frac` dans le fichier. Un antislash oublié et JS
   avale la séquence — `\f` devient un saut de page, `\t` une tabulation — sans
   la moindre erreur. La page affiche alors « rac{2GM} » et tout le monde
   regarde ailleurs. */
groupe("Les formules ont survécu à leur chaîne JavaScript");
{
  const SUSPECTS = [
    ["", "un saut de page — c'était `\\frac`"],
    ["	", "une tabulation — c'était `\\text` ou `\\tfrac`"],
    ["\r",     "un retour chariot — c'était `\\rightarrow`"],
    ["\b",     "un retour arrière — c'était `\\begin`"],
  ];
  for(const l of LANGUES){
    const tout = J[l].corps.join("\n");
    const trouves = SUSPECTS.filter(([c]) => tout.indexOf(c) >= 0);
    ok("« " + l + " » : aucun antislash avalé", trouves.length === 0,
       "aucun", trouves.length ? trouves.map(t => t[1]).join(" ; ") : "aucun");
  }

  // Et les délimiteurs doivent aller par paires, sinon KaTeX ne voit rien.
  for(const l of LANGUES){
    const d = (J[l].corps.join("").match(/\$\$/g) || []).length;
    ok("« " + l + " » : les délimiteurs vont par paires", d > 0 && d % 2 === 0,
       "pair et non nul", d);
  }

  const nb = l => ((J[l].corps.join("").match(/\$\$/g) || []).length) / 2;
  const f = LANGUES.map(nb);
  ok("même nombre de formules dans les trois langues", new Set(f).size === 1,
     "identique", LANGUES.map((l, i) => l + "=" + f[i]).join("  "));
}

// ═══════════════════════════════════════════════ 4. l'ancre du graphe existe
/* Le graphe se pose dans le chapitre qui contient la formule du recul. L'ancre
   est la formule elle-même, non traduite — si elle bouge dans une langue, la
   figure y disparaît sans bruit. */
groupe("Le graphe trouve son chapitre");
{
  const ANCRE = "log_{10} d(t)";
  for(const l of LANGUES)
    ok("« " + l + " » : l'ancre du graphe est présente",
       J[l].corps[2].indexOf(ANCRE) >= 0, ANCRE,
       J[l].corps[2].indexOf(ANCRE) >= 0 ? "présente" : "ABSENTE — la figure disparaîtrait");
}

// ════════════════════════════════════════════ 5. rien n'est resté en français
/* Le défaut le plus courant d'une traduction faite d'un bloc : une rubrique
   oubliée, qui garde le texte source. On compare donc les titres visibles. */
groupe("Rien n'est resté dans la langue d'origine");
for(const l of ["en", "es"]){
  const identiques = ["chapeau", "numero", "marque"].filter(c => J[l][c] === J.fr[c]);
  ok("« " + l + " » ne recopie pas le français", identiques.length === 0,
     "aucune rubrique identique", identiques.length ? identiques.join(", ") : "aucune",
     "le titre « Hello World » est volontairement commun aux trois, il n'est pas compté");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
