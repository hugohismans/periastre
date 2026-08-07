/* ============================================================================
   LA DÉCOUPE DES BLOCS DE CODE D'UNE PAGE — une seule loi, deux lecteurs.

   `outil-verif-taille.js` compte les lignes, `outil-verif-ordre.js` cherche les
   inversions d'ordre. Les deux doivent découper la page EXACTEMENT pareil :
   deux expressions recopiées divergent, et le jour où elles divergent, l'un des
   deux outils mesure un fichier que l'autre ne voit pas.

   ---------------------------------------------------------------------------
   CE QUI EST UN BLOC DE CODE, ET CE QUI N'EN EST PAS

   - avec `src` : c'est un module chargé, exactement ce qu'on encourage. Écarté.
   - `type="x-shader/…"` : c'est du GLSL. Sept cent soixante-dix-sept lignes
     dans cette page. Les compter comme de la portée globale JavaScript ferait
     sauter le cliquet d'un coup, ou pire, le ferait monter « pour faire passer ».
   ============================================================================ */

"use strict";

const EST_JS = t => !t || /^(text\/javascript|application\/javascript|module)$/i.test(t.trim());

/* Rend { code, autres } — les blocs sans `src`, séparés selon leur type.
   Chaque bloc porte sa ligne de départ (1 = première ligne du fichier), son
   contenu brut, et son nombre de lignes. */
function decoupe(page){
  const code = [], autres = [];
  const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while((m = re.exec(page)) !== null){
    const type = ((m[1] || "").match(/\btype\s*=\s*["']([^"']*)["']/i) || [])[1];
    // La ligne de la balise ouvrante ; le contenu commence à la suivante.
    const depart = page.slice(0, m.index).split("\n").length;
    const b = { depart, contenu: m[2], lignes: m[2].split("\n").length - 1,
                type: type || "(aucun)" };
    (EST_JS(type) ? code : autres).push(b);
  }
  return { code, autres };
}

module.exports = { decoupe, EST_JS };
