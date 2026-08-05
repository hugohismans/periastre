/* ============================================================================
   LE CONTRAT DU CONTENU.

   Ce que doit porter une information pour avoir le droit d'entrer dans le site.
   Pas une recommandation dans un document que personne ne relit : un contrôle
   qui refuse.

   ---------------------------------------------------------------------------
   POURQUOI UN CONTRAT ET PAS UNE CONSIGNE

   Il existait déjà `SOURCES.md` (l'audit), `REFERENCES.md` (l'index mécanique)
   et `outils/sources.mjs` (qui signale les textes sans source). Trois bonnes
   choses, et un défaut commun : elles constatent APRÈS. Rien n'empêchait
   d'écrire une affirmation sans source, de la publier, et de découvrir le trou
   au prochain audit — s'il avait lieu.

   Un contrat s'exécute. Une information incomplète fait sortir le contrôle en
   code 1, et c'est tout.

   ---------------------------------------------------------------------------
   CE QU'UNE INFORMATION DOIT PORTER

     · elle se dit en FRANÇAIS et en ANGLAIS — les deux, pas l'un puis l'autre
       un jour ;
     · elle cite au moins une SOURCE ;
     · cette source porte sa référence complète ET un lien qui mène quelque
       part — un DOI ou une adresse. « Machin 2019 » sans lien oblige le lecteur
       à faire lui-même le travail de recherche, ce qui revient à ne pas sourcer ;
     · elle dit À QUOI elle sert, dans les deux langues ;
     · et, quand c'est possible, elle propose D'ALLER PLUS LOIN : un cours, une
       vidéo, un article de vulgarisation. Un article de recherche prouve ;
       il n'enseigne pas.

   ---------------------------------------------------------------------------
   LE CLIQUET

   Tout ne peut pas être exigé du jour au lendemain — dix sources sur trente-six
   n'ont aucun lien, et aucune n'a encore de quoi aller plus loin. Exiger la
   perfection immédiatement, c'est se condamner à désactiver le contrôle.

   Alors le contrat mémorise des PLANCHERS. La couverture ne peut jamais
   descendre, et chaque progrès relève le plancher. C'est plus lent qu'une
   exigence absolue, et c'est la seule forme qui ne se fait pas contourner.
   ============================================================================ */

(function(global){
"use strict";

/* Les planchers. Ils ne descendent JAMAIS. Quand le contrôle annonce qu'on peut
   les relever, on les relève — c'est le seul entretien que demande ce fichier. */
const PLANCHERS = {
  /* 34 sur 36 le 5 août 2026. Il en manque deux, et elles sont nommées plutôt
     que passées sous silence : Bussard 1960 (Astronautica Acta) et Andrews &
     Zubrin 1990 (JBIS). Ces deux revues d'astronautique ne sont indexées ni par
     CrossRef, ni par INSPIRE, ni par ADS — il n'existe pas d'adresse stable à
     donner. Mettre un lien approximatif serait pire que de ne pas en mettre.

     Les huit autres ont été trouvées et VÉRIFIÉES une par une, en chargeant
     chaque adresse : traduction arXiv pour Schwarzschild, INSPIRE pour Bardeen,
     Luminet et Shakura, OpenLibrary pour Birkhoff, Chandrasekhar et MTW, et le
     DOI de la réédition « Golden Oldie » pour Penrose. */
  sourcesAvecLien: 34,
  sourcesAvecPlus: 0,    // rien encore : le champ vient de naître

  /* 228 unités de texte sur 248 citent une source. Les vingt qui n'en citent
     pas ne sont pas des oublis : ce sont les répliques d'accueil de Lumen et les
     trois écrans de présentation — de la mise en scène, pas des affirmations.
     Le plancher les gèle : si quelqu'un ajoute un texte factuel sans source, le
     compte tombe et le contrôle échoue. */
  textesSources: 228,
};

const TYPES_PLUS = new Set(["cours", "video", "article", "livre", "outil", "musee"]);
const LANGUES = new Set(["fr", "en"]);

/* --------------------------------------------------------------------------
   Le contrôle. Il ne connaît ni le navigateur ni Node : on lui passe les deux
   contenus, et il rend une liste de manquements. C'est ce qui lui permet de
   tourner dans le harnais de la page ET en ligne de commande.
   -------------------------------------------------------------------------- */
function controle(FR, EN, options){
  const opt = options || {};
  const durs = [];      // ce qui fait échouer
  const doux = [];      // ce qui se compte, sous cliquet
  const dur  = (ou, quoi) => durs.push({ ou, quoi });

  // ---- 1. les deux contenus existent et ont la même forme ----
  if(!FR || !EN){ dur("contenu", "un des deux contenus manque"); return bilan(durs, doux, {}); }

  const clesFR = Object.keys(FR).sort().join(",");
  const clesEN = Object.keys(EN).sort().join(",");
  if(clesFR !== clesEN)
    dur("contenu", "les deux langues n'ont pas les mêmes rubriques :\n      fr " + clesFR + "\n      en " + clesEN);

  // ---- 2. les sources ----
  const SF = FR.sources || {}, SE = EN.sources || {};
  const kf = Object.keys(SF), ke = Object.keys(SE);

  for(const k of kf) if(!ke.includes(k)) dur("sources." + k, "existe en français, pas en anglais");
  for(const k of ke) if(!kf.includes(k)) dur("sources." + k, "existe en anglais, pas en français");

  let avecLien = 0, avecPlus = 0;
  for(const k of kf){
    const f = SF[k], e = SE[k] || {};

    if(!f.ref || !String(f.ref).trim()) dur("sources." + k, "pas de référence");
    if(!e.ref || !String(e.ref).trim()) dur("sources." + k, "pas de référence en anglais");

    // « à quoi ça sert », dans les deux langues. C'est ce qui permet de relire
    // l'audit sans rouvrir les articles.
    if(!f.sert || !String(f.sert).trim()) dur("sources." + k, "ne dit pas à quoi elle sert");
    if(!e.sert || !String(e.sert).trim()) dur("sources." + k, "ne dit pas à quoi elle sert, en anglais");

    // Un lien, sinon le lecteur refait la recherche lui-même.
    const lien = f.doi || f.url;
    if(lien){
      avecLien++;
      if(f.url && !/^https:\/\//.test(f.url)) dur("sources." + k, "adresse non sécurisée : " + f.url);
      if(f.doi && !/^10\.\d{4,9}\//.test(f.doi)) dur("sources." + k, "ce n'est pas un DOI : " + f.doi);
    }

    // Aller plus loin. Facultatif, mais sous cliquet.
    const plus = f.plus || [];
    if(!Array.isArray(plus)) dur("sources." + k, "`plus` doit être une liste");
    else if(plus.length){
      avecPlus++;
      plus.forEach((p, i) => {
        const ou = "sources." + k + ".plus[" + i + "]";
        if(!p.titre || !String(p.titre).trim()) dur(ou, "sans titre");
        if(!p.url || !/^https:\/\//.test(p.url)) dur(ou, "sans adresse sécurisée");
        if(!TYPES_PLUS.has(p.type))
          dur(ou, "type inconnu « " + p.type + " » — attendus : " + [...TYPES_PLUS].join(", "));
        if(!LANGUES.has(p.langue))
          dur(ou, "langue inconnue « " + p.langue + " » — attendues : fr, en");
      });
    }
  }

  doux.push({ nom: "sources avec un lien", valeur: avecLien, total: kf.length,
              plancher: PLANCHERS.sourcesAvecLien });
  doux.push({ nom: "sources proposant d'aller plus loin", valeur: avecPlus, total: kf.length,
              plancher: PLANCHERS.sourcesAvecPlus });

  // ---- 3. toute clé citée existe, toute source déclarée sert ----
  const citees = new Set();
  const orphelins = [];
  ramasse(FR, "fr", citees, orphelins, SF, dur);
  ramasse(EN, "en", citees, orphelins, SE, dur);

  for(const k of kf) if(!citees.has(k))
    dur("sources." + k, "déclarée mais citée nulle part — une référence morte ment sur ce qui a été lu");

  // Les textes sans source : durs seulement si l'appelant le demande, parce que
  // le seuil de « ce qui est une affirmation » est un jugement, pas une règle.
  doux.push({ nom: "textes sourcés", valeur: orphelins.total - orphelins.nus,
              total: orphelins.total, plancher: PLANCHERS.textesSources,
              liste: orphelins.liste });

  return bilan(durs, doux, { sources: kf.length, avecLien, avecPlus });
}

/* Parcourt un contenu et ramasse les clés de sources citées. La forme du
   contenu n'est pas uniforme — fiches par niveau, dossier méthode, répliques —
   et c'est le prix de textes écrits pour être lus plutôt que pour être rangés. */
function ramasse(C, langue, citees, orphelins, S, dur){
  orphelins.total = orphelins.total || 0;
  orphelins.nus   = orphelins.nus   || 0;
  orphelins.liste = orphelins.liste || [];

  const propre = t => String(t || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const compte = (ou, txt, cles) => {
    orphelins.total++;
    if(!cles.length){ orphelins.nus++; orphelins.liste.push(langue + " · " + ou + " — " + txt.slice(0, 80)); }
    for(const k of cles){
      citees.add(k);
      if(!S[k]) dur(ou, "cite une source qui n'existe pas : « " + k + " » (" + langue + ")");
    }
  };

  (C.fiches || []).forEach((f, i) =>
    (f.t || []).forEach((txt, n) =>
      compte("fiches[" + i + "].t[" + n + "]", propre(txt), (f.sources || [])[n] || [])));

  (C.methode || []).forEach((txt, n) =>
    compte("methode[" + n + "]", propre(txt), (C.methodeSources || [])[n] || []));

  const vu = new Set();
  (function descend(x, chemin){
    if(!x || typeof x !== "object" || vu.has(x)) return;
    vu.add(x);
    if(Array.isArray(x)) return x.forEach((v, i) => descend(v, chemin + "[" + i + "]"));
    const txt = propre(x.t || x.dire || x.note || x.pourquoi);
    if(txt && txt.length > 60) compte(chemin, txt, x.sources || []);
    for(const [k, v] of Object.entries(x))
      if(k !== "sources" && k !== "plus" && v && typeof v === "object") descend(v, chemin + "." + k);
  })({ reactions: C.reactions, questions: C.questions, experiences: C.experiences,
       missions: C.missions, spectre: C.spectre, notes: C.notes, accueil: C.accueil }, "");
}

function bilan(durs, doux, chiffres){
  const casses = doux.filter(d => d.valeur < d.plancher);
  const aRelever = doux.filter(d => d.plancher > 0 && d.valeur > d.plancher);
  return {
    durs, doux, chiffres, casses, aRelever,
    ok: durs.length === 0 && casses.length === 0,
  };
}

global.CONTRAT = { controle, PLANCHERS, TYPES_PLUS };

})(typeof window !== "undefined" ? window : globalThis);
