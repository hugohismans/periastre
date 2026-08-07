/* ============================================================================
   LA FORME DU CONTENU, ET LA NAVIGATION CIRCULAIRE.

       node outil-verif-dossier.js

   Deux choses que rien ne gardait.

   **La forme du contenu.** Le dossier « pourquoi c'est exact » et les fiches se
   construisent depuis `contenu.js` sans jamais vérifier que la forme attendue
   est là. Une clé renommée donnerait un panneau à moitié vide, sans erreur, sans
   trace — et le seul moyen de s'en apercevoir serait d'ouvrir le panneau, dans
   la bonne langue, au bon niveau de lecture.

   **La navigation circulaire.** Reculer depuis la première fiche demande un
   modulo qui accepte les pas négatifs. `(i + d) % n` rend −1, ce qui affiche une
   fiche indéfinie. C'est la faute la plus banale du métier, et elle ne se voit
   qu'en cliquant « précédent » au bon endroit.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ

   Du vrai `contenu.js`, dans les DEUX langues — pas d'une table fabriquée ici.
   Un contrôle qui validerait sa propre copie du contenu ne dirait rien du
   contenu réel, qui est le seul qu'on publie.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const ici = __dirname;

const charge = f => { const w = {}; new Function("window",
  fs.readFileSync(path.join(ici, f), "utf8"))(w); return w; };

const D = charge("dossier.js").DOSSIER;
const FR = charge("contenu.js").CONTENU;
const EN = charge("contenu.en.js").CONTENU;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

console.log("\n  LE DOSSIER ET LES FICHES");
console.log("  ════════════════════════");

// ═══════════════════════════ 1. la navigation circulaire, aux deux bouts
/* Un cycle ne se vérifie qu'aux BORDS : le milieu marche avec n'importe quelle
   formule fausse. On y ajoute les cas dégénérés, parce qu'un contenu vide est
   une chose qui arrive. */
groupe("La navigation circulaire tient aux deux bouts");
{
  const n8 = 8;
  ok("avancer depuis la dernière ramène à la première",
     D.suivante(7, +1, n8) === 0, 0, D.suivante(7, +1, n8));
  ok("reculer depuis la première ramène à la dernière",
     D.suivante(0, -1, n8) === 7, 7, D.suivante(0, -1, n8),
     "c'est ICI que `(i + d) % n` rend −1 et affiche une fiche indéfinie");
  ok("au milieu, rien de spécial", D.suivante(3, +1, n8) === 4, 4, D.suivante(3, +1, n8));
  ok("un grand pas négatif reste dans le cycle",
     D.suivante(2, -19, n8) >= 0 && D.suivante(2, -19, n8) < n8,
     "entre 0 et 7", D.suivante(2, -19, n8));
  ok("une seule fiche ne bouge pas", D.suivante(0, +1, 1) === 0, 0, D.suivante(0, +1, 1));
  ok("aucune fiche ne plante pas", D.suivante(0, +1, 0) === 0, 0, D.suivante(0, +1, 0));
}

// ══════════════════════════════ 2. la forme du contenu, dans les deux langues
groupe("Le dossier a tout ce qu'il lui faut, en français et en anglais");
for(const [langue, C] of [["français", FR], ["anglais", EN]]){
  const manque = D.valide(C.notes);
  ok("les notes en " + langue, manque.length === 0, 0,
     manque.length + (manque.length ? " — " + manque.slice(0, 5).join(", ") : ""),
     "une clé renommée donnerait un panneau à moitié vide, sans erreur");
}

groupe("Chaque fiche porte ses trois niveaux, dans les deux langues");
for(const [langue, C] of [["français", FR], ["anglais", EN]]){
  const nb = (C.niveaux || []).length;
  ok("il y a bien trois niveaux en " + langue, nb === 3, 3, nb);
  const manque = D.valideFiches(C.fiches, nb);
  ok("les fiches en " + langue, manque.length === 0, 0,
     manque.length + (manque.length ? " — " + manque.slice(0, 5).join(", ") : ""),
     "une fiche sans son niveau « découverte » s'afficherait vide pour "
     + "exactement les gens à qui elle s'adresse");
}

// ══════════════════════════════ 3. les deux langues racontent la même chose
/* La parité de structure, pas de traduction. Deux langues qui n'ont pas le même
   nombre de fiches ou de groupes ne montrent pas le même site — et c'est le
   genre d'écart qui s'installe en une seule session distraite. */
groupe("Les deux langues ont la même structure");
{
  ok("autant de fiches", FR.fiches.length === EN.fiches.length,
     FR.fiches.length, EN.fiches.length);
  ok("autant de groupes de notes", FR.notes.groupes.length === EN.notes.groupes.length,
     FR.notes.groupes.length, EN.notes.groupes.length);
  const ptsFr = FR.notes.groupes.reduce((s, g) => s + g.points.length, 0);
  const ptsEn = EN.notes.groupes.reduce((s, g) => s + g.points.length, 0);
  ok("autant de points au total", ptsFr === ptsEn, ptsFr, ptsEn,
     "un compromis déclaré dans une seule langue est un compromis caché à "
     + "la moitié des visiteurs");
}

// ═══════════════════════════════════════ 4. cet outil sait échouer
/* Règle 2. On abîme une copie du contenu — un titre effacé, un niveau retiré —
   et l'on exige que la validation le voie. Sans ce groupe, une validation qui
   rendrait toujours un tableau vide passerait au vert sur tout. */
groupe("Cet outil sait échouer");
{
  const copie = JSON.parse(JSON.stringify({ notes: FR.notes, fiches: FR.fiches }));
  copie.notes.groupes[0].titre = "";
  ok("un titre de groupe effacé est vu", D.valide(copie.notes).length > 0,
     "au moins un manquement", D.valide(copie.notes).join(", ") || "AUCUN");

  const copie2 = JSON.parse(JSON.stringify({ fiches: FR.fiches }));
  copie2.fiches[0].t = [copie2.fiches[0].t[0]];      // il ne reste qu'un niveau
  ok("une fiche amputée d'un niveau est vue", D.valideFiches(copie2.fiches, 3).length > 0,
     "au moins un manquement", D.valideFiches(copie2.fiches, 3).slice(0, 2).join(", ") || "AUCUN");

  const copie3 = JSON.parse(JSON.stringify({ notes: FR.notes }));
  copie3.notes.groupes[0].points[0] = { pasDeT: 1 };
  ok("un point sans texte est vu", D.valide(copie3.notes).length > 0,
     "au moins un manquement", D.valide(copie3.notes).slice(0, 2).join(", ") || "AUCUN");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
