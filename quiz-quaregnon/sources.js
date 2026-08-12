/* ============================================================================
   SOURCES — d'où vient chaque réponse.

   Un quiz qui se trompe est pire qu'un quiz ennuyeux : on repart avec une
   fausseté dans la tête, et on la répète. Alors chaque question du site pointe
   vers l'endroit où l'on a lu sa réponse, et le joueur peut aller vérifier.

   Pour ajouter une source : une clé courte, un titre, un lien, la date où on
   l'a lue. `outil-verif-quiz.js` refuse toute question dont la clé de source
   n'existe pas ici, et toute source que plus aucune question n'utilise.
   ============================================================================ */

"use strict";

const SOURCES = {

  "quaregnon-histoire": {
    titre: "Quaregnon, cœur du Borinage — Histoire et patrimoine",
    ou: "Commune de Quaregnon",
    lien: "https://www.quaregnon.be/loisirs/tourisme/histoire-et-patrimoine",
    lu: "2026-08-12"
  },

  "quaregnon-charte": {
    titre: "La Charte de Quaregnon",
    ou: "Commune de Quaregnon, pôle muséal",
    lien: "https://www.quaregnon.be/loisirs/tourisme/pole-museal/charte",
    lu: "2026-08-12"
  },

  "quaregnon-celebres": {
    titre: "Personnages célèbres de Quaregnon",
    ou: "Commune de Quaregnon",
    lien: "https://www.quaregnon.be/loisirs/tourisme/histoire-et-patrimoine/personnages-celebres",
    lu: "2026-08-12"
  },

  "quaregnon-patrimoine": {
    titre: "Patrimoine quaregnonnais",
    ou: "Commune de Quaregnon",
    lien: "https://www.quaregnon.be/loisirs/tourisme/histoire-et-patrimoine/patrimoine-quaregnonnais",
    lu: "2026-08-12"
  },

  "wp-charte": {
    titre: "Charte de Quaregnon",
    ou: "Wikipédia (fr)",
    lien: "https://fr.wikipedia.org/wiki/Charte_de_Quaregnon",
    lu: "2026-08-12"
  },

  "wp-quaregnon": {
    titre: "Quaregnon",
    ou: "Wikipédia (fr)",
    lien: "https://fr.wikipedia.org/wiki/Quaregnon",
    lu: "2026-08-12"
  },

  "wp-borain": {
    titre: "Borain (langue)",
    ou: "Wikipédia (fr)",
    lien: "https://fr.wikipedia.org/wiki/Borain",
    lu: "2026-08-12"
  },

  "wp-picard": {
    titre: "Picard language",
    ou: "Wikipedia (en)",
    lien: "https://en.wikipedia.org/wiki/Picard_language",
    lu: "2026-08-12"
  },

  "uvcw-fiche": {
    titre: "Quaregnon en fiche : coordonnées, bourgmestre, superficie",
    ou: "Union des Villes et Communes de Wallonie",
    lien: "https://www.uvcw.be/fiches-locales/53065",
    lu: "2026-08-12"
  },

  "hainaut-fiche": {
    titre: "Fiche communale de Quaregnon, édition 2023",
    ou: "Hainaut Développement",
    lien: "https://www.hainaut-developpement.be/documents/hainautstat/Quaregnon.pdf",
    lu: "2026-08-12"
  },

  "genealexis": {
    titre: "Histoire de Quaregnon — cartes postales et charbonnages",
    ou: "Le site de généalogie d'Alexis",
    lien: "https://www.genealexis.fr/cartes-postales/quaregnon.php",
    lu: "2026-08-12"
  },

  "borigines": {
    titre: "Vincent Van Gogh au Borinage, décembre 1878 – octobre 1880",
    ou: "Borigines",
    lien: "https://vangoghborinage.canalblog.com/",
    lu: "2026-08-12"
  },

  "visitmons-vangogh": {
    titre: "Van Gogh au Borinage, la naissance de l'artiste",
    ou: "visitMons",
    lien: "https://www.visitmons.be/a-voir-a-faire/l-incontournable/vincent-van-gogh/van-gogh-au-borinage-la-naissance-de-l-artiste",
    lu: "2026-08-12"
  },

  "culture-boraine": {
    titre: "Le Borinage",
    ou: "La culture boraine",
    lien: "https://culture-boraine.be/le-borinage/",
    lu: "2026-08-12"
  },

  "areaw-larcin": {
    titre: "Georges Larcin, Dictionnaire français-picard borain, "
         + "Le trésor lexical du Borinage, Micromania-Lingua, 2021, 1064 pages",
    ou: "AREAW",
    lien: "https://www.areaw.be/georges-larcin-dictionnaire-francais-picard-borain-le-tresor-lexical-du-borinage-micromania-lingua-2021-1064-pages/",
    lu: "2026-08-12"
  },

  "capron-ruelle": {
    titre: "Pierre Ruelle et le Borinage",
    ou: "André Capron",
    lien: "https://sites.google.com/site/andcapron/telechargements/pierre-ruelle-et-le-borinage",
    lu: "2026-08-12"
  },

  "britannica-belgique": {
    titre: "Belgium — History, Flag, Map, Population, Facts",
    ou: "Encyclopædia Britannica",
    lien: "https://www.britannica.com/place/Belgium",
    lu: "2026-08-12"
  },

  "monarchie-be": {
    titre: "Monarchy of Belgium",
    ou: "Wikipedia (en) / monarchie.be",
    lien: "https://en.wikipedia.org/wiki/Monarchy_of_Belgium",
    lu: "2026-08-12"
  },

  "visitmons-terrils": {
    titre: "À l'assaut des terrils",
    ou: "visitMons",
    lien: "https://www.visitmons.be/blog/a-l-assaut-des-terrils",
    lu: "2026-08-12"
  }

};

if (typeof module !== "undefined" && module.exports) module.exports = { SOURCES };
