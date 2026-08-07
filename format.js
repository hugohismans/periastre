/* ============================================================================
   LES DEUX FORMATEURS QUI ONT DÉJÀ MENTI.

   Le bandeau de lecture a affiché « 2.31 tour ». Deux fautes dans trois mots :
   le point décimal au lieu de la virgule en français, et le singulier pour une
   valeur supérieure à deux. Aucune des deux ne casse rien, aucune ne lève
   d'erreur, et toutes deux se voient immédiatement — par quelqu'un d'autre.

   Elles vivaient dans la page, donc aucun outil ne pouvait les jouer. Ici,
   `node outil-verif-format.js` les joue en quarante millisecondes.

   ---------------------------------------------------------------------------
   POURQUOI `virgule` ET `T` ARRIVENT EN ARGUMENT

   La ponctuation décimale et les mots dépendent de la langue, qui vit dans la
   page. Un module qui irait les chercher dans `window` cesserait d'être
   éprouvable hors navigateur — c'est la règle qui fait tenir tout le reste. On
   les reçoit donc, explicitement, à chaque appel. La page pose deux alias d'une
   ligne et ses sites d'appel n'ont pas bougé d'un caractère.
   ============================================================================ */

(function(global){
"use strict";

/* Une durée courte, telle qu'on la lit à bord.

   Les suffixes « s », « min », « h » s'écrivent pareil dans les deux langues —
   c'est la DÉCIMALE qui change, et elle passe donc par `virgule` plutôt que par
   un `replace` codé en dur.

   Les deux seuils sont à quatre-vingt-dix et non à soixante : « 89 s » se lit
   mieux que « 1 min 29 s », et « 89 min » mieux que « 1 h 29 min ». Passé
   quatre-vingt-dix, l'unité du dessus devient plus parlante que la précision. */
function temps(s, virgule){
  const v = virgule || (x => String(x));
  if(s < 90) return v(s.toFixed(s < 10 ? 1 : 0)) + " s";
  const m = Math.floor(s/60);
  if(m < 90) return m + " min " + String(Math.round(s%60)).padStart(2, "0") + " s";
  const h = Math.floor(m/60);
  return h + " h " + String(m%60).padStart(2, "0") + " min";
}

/* Un nombre de tours, avec son pluriel.

   Le pluriel part de DEUX, en français comme en anglais : « 1,80 tour » mais
   « 2,00 tours ». Le mot vient des chaînes d'interface — le module ne sait pas
   dire « tour » —, le seuil reste ici parce que c'est une règle de langue, pas
   un libellé. */
function tours(n, virgule, T){
  const v = virgule || (x => String(x));
  const mot = T ? T(n >= 2 ? "lecture.tour.pl" : "lecture.tour.un")
                : (n >= 2 ? "tours" : "tour");
  return v(n.toFixed(2)) + " " + mot;
}

global.FORMAT = { temps, tours };

})(window);
