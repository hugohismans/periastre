/* ============================================================================
   LES FICHES ET LE DOSSIER — le peu qui n'est pas du câblage.

   Ces deux domaines sont presque entièrement du DOM : créer des boutons, poser
   du texte, basculer une classe. Il n'y a pas de module à en tirer, et
   prétendre le contraire produirait une indirection sans rien acheter.

   Reste deux choses qui méritent de vivre ici, parce qu'elles peuvent être
   FAUSSES sans que rien ne le dise :

   1. **La navigation circulaire.** Passer de la dernière fiche à la première
      demande un modulo qui accepte les pas négatifs — `(i + d + n) % n` et non
      `(i + d) % n`, qui rend −1 quand on recule depuis la première. La faute
      est classique, silencieuse, et ne se voit qu'en cliquant « précédent » sur
      la première fiche.

   2. **La forme du contenu.** Le dossier lit `CONTENU.notes` — un titre, un
      chapeau, des groupes, des points — et le construit sans jamais vérifier
      que la forme est là. Une clé renommée dans `contenu.js` donnerait un
      panneau à moitié vide, sans erreur. `valide` rend la liste de ce qui
      manque, et l'outil s'en sert.
   ============================================================================ */

(function(global){
"use strict";

/* L'indice suivant, circulaire, qui accepte les pas négatifs.
   `(i + d) % n` rend −1 quand on recule depuis zéro : on ajoute `n` avant. */
function suivante(i, d, n){
  if(!Number.isFinite(n) || n <= 0) return 0;
  return ((i + d) % n + n) % n;
}

/* Ce qui manque dans `CONTENU.notes` pour que le dossier se construise.
   Rend un tableau de chaînes ; vide veut dire que la forme est complète. */
function valide(notes){
  const manque = [];
  if(!notes || typeof notes !== "object") return ["notes absentes"];
  if(typeof notes.titre !== "string" || !notes.titre) manque.push("notes.titre");
  if(typeof notes.chapeau !== "string" || !notes.chapeau) manque.push("notes.chapeau");
  if(!Array.isArray(notes.groupes) || !notes.groupes.length){
    manque.push("notes.groupes");
    return manque;
  }
  notes.groupes.forEach((g, i) => {
    const ou = "notes.groupes[" + i + "]";
    if(typeof g.titre !== "string" || !g.titre) manque.push(ou + ".titre");
    if(typeof g.chapeau !== "string" || !g.chapeau) manque.push(ou + ".chapeau");
    if(!Array.isArray(g.points) || !g.points.length){ manque.push(ou + ".points"); return; }
    g.points.forEach((p, j) => {
      /* Un point est soit une chaîne, soit un compromis déclaré — que
         `contrat.js` valide par ailleurs, et qui porte alors son texte en `t`.
         Tout le reste donnerait une puce vide dans le panneau. */
      const bon = typeof p === "string" ? p.length > 0
                : (p && typeof p === "object" && typeof p.t === "string" && p.t.length > 0);
      if(!bon) manque.push(ou + ".points[" + j + "]");
    });
  });
  return manque;
}

/* Les fiches, même exigence : trois niveaux de lecture, tous présents. Une
   fiche à qui il manque le niveau « découverte » s'afficherait vide pour
   exactement les gens à qui elle s'adresse. */
function valideFiches(fiches, nbNiveaux){
  const manque = [];
  if(!Array.isArray(fiches) || !fiches.length) return ["fiches absentes"];
  fiches.forEach((f, i) => {
    const ou = "fiches[" + i + "]";
    if(typeof f.titre !== "string" || !f.titre) manque.push(ou + ".titre");
    if(!Array.isArray(f.t) || f.t.length < nbNiveaux){ manque.push(ou + ".t"); return; }
    f.t.forEach((txt, n) => {
      if(typeof txt !== "string" || !txt.trim()) manque.push(ou + ".t[" + n + "]");
    });
  });
  return manque;
}

global.DOSSIER = { suivante, valide, valideFiches };

})(window);
