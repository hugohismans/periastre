/* ============================================================================
   LE BANC D'ESSAI — ce qui n'est pas du dessin.

   Les intégrations et les quatre repères vivent dans `physique.js`, avec le
   reste des équations. Ce qui restait dans la page tenait en deux choses : la
   façon de composer la liste des essais à partir des repères, et **les seuils
   qui décident du verdict**.

   Ces seuils sont le morceau qui comptait. Ils décidaient à l'écran si une
   mesure est juste, passable ou fausse — et ils vivaient dans une page qu'aucun
   outil ne lit. Un chiffre qui prononce un verdict doit pouvoir être éprouvé.

   ---------------------------------------------------------------------------
   LA VALEUR THÉORIQUE N'EST JAMAIS RECOPIÉE

   Elle vient du repère, qui la porte. Deux sources d'autorité pour un même
   nombre finissent toujours par diverger, et ce dépôt en a déjà fourni
   plusieurs exemples en une semaine.
   ============================================================================ */

(function(global){
"use strict";

/* Les deux seuils du verdict, en écart RELATIF.

   Un demi-pour-cent pour « juste » : c'est l'ordre de grandeur de ce qu'une
   intégration numérique honnête laisse passer sur ces quatre repères, et les
   valeurs publiées tombent toutes bien en dessous. Trois pour cent pour
   « passable » : au-delà, ce n'est plus une imprécision, c'est une erreur de
   formule — et le mot doit le dire. */
const JUSTE = 0.005, PASSABLE = 0.03;

function verdict(ecart){
  const e = Math.abs(ecart);
  if(!Number.isFinite(e)) return "non";
  return e < JUSTE ? "ok" : e < PASSABLE ? "bof" : "non";
}

/* La liste des essais, composée depuis les repères de `physique.js`.

   Chaque essai porte des CLÉS de traduction, pas des mots : le banc parle les
   deux langues sans que ce module en connaisse aucune. `deflexion` est le seul
   qui s'affiche en radians et à six chiffres — c'est une quantité sans unité de
   longueur, et son écart se joue sur la sixième décimale. */
function essais(reperes){
  return reperes.map(r => ({
    id:       r.id,
    nom:      "banc.essai." + r.id + ".nom",
    quoi:     "banc.essai." + r.id + ".quoi",
    attendu:  "banc.essai." + r.id + ".attendu",
    theorie:  r.theorie,
    unite:    r.id === "deflexion" ? " rad" : " r<sub>s</sub>",
    chiffres: r.id === "deflexion" ? 6 : 4,
    mesure:   r.mesure,
  }));
}

// L'écart relatif d'une mesure à sa théorie. Séparé parce que c'est lui qu'on
// compare aux seuils, et qu'une division par zéro y serait silencieuse.
function ecart(mesure, theorie){
  if(!Number.isFinite(mesure) || !Number.isFinite(theorie) || theorie === 0) return Infinity;
  return Math.abs(mesure - theorie) / Math.abs(theorie);
}

global.BANC = { essais, verdict, ecart, JUSTE, PASSABLE };

})(window);
