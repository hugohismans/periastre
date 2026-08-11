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
     DOI de la réédition « Golden Oldie » pour Penrose.

     42 sur 44 le 9 août 2026 : les huit références du ciel de l'amas nucléaire
     sont entrées avec leur lien, vérifié un par un sur arXiv AVANT d'écrire la
     ligne de bibliographie — et ce n'était pas une formalité. Deux titres et une
     initiale d'auteur étaient faux dans ce que j'allais recopier. Les deux
     manquantes restent les mêmes revues d'astronautique non indexées.

     47 sur 49 le 10 août 2026 : les cinq sources du système solaire entrent
     avec leur lien, chacune ouverte et lue avant d'être écrite — le tableau du
     JPL, la brochure du BIPM qui porte l'unité astronomique et l'attribue à la
     résolution de 2012, Prša et al. pour les valeurs nominales, DE440 pour les
     masses, Dones et al. pour le nuage de Oort. Les deux manquantes n'ont pas
     bougé, et ne bougeront pas.

     51 sur 53 le 11 août 2026 : les quatre sources de la Terre et de la Lune
     montent enfin. Elles vivaient dans le registre parallèle de `lune.js`
     depuis le 5 août, et `SOURCES-SOLAIRE.md` avait écrit pourquoi elles
     n'étaient pas montées le 10 — le contrat refuse une source que personne ne
     cite, et il a raison. Il fallait une fiche qui les emploie ; l'arrivée du
     voyage la donne. Les trois pages du JPL ont été rouvertes ce jour-là et les
     quatre nombres relus à leur ligne, plutôt que recopiés du module. Les deux
     manquantes sont toujours les mêmes revues d'astronautique non indexées. */
  sourcesAvecLien: 51,
  sourcesAvecPlus: 0,    // rien encore : le champ vient de naître

  /* 228 unités de texte sur 248 citent une source. Les vingt qui n'en citent
     pas ne sont pas des oublis : ce sont les répliques d'accueil de Lumen et les
     trois écrans de présentation — de la mise en scène, pas des affirmations.
     Le plancher les gèle : si quelqu'un ajoute un texte factuel sans source, le
     compte tombe et le contrôle échoue.

     236 sur 276 le 9 août 2026, mesuré avant et après plutôt qu'estimé : la
     fiche « Le ciel de là-bas » apporte six textes (trois niveaux, deux langues)
     tous sourcés, et l'aveu du fond de ciel passe de nu à sourcé dans les deux
     langues — il affirmait « des millions d'étoiles » depuis le début sans
     jamais dire d'où ça sortait.

     240 sur 280 le même jour : l'aveu du fond de ciel se dédouble selon le rendu
     — quatre textes de plus (deux modes, deux langues), tous sourcés.

     246 sur 286 le 10 août 2026 : la fiche « Le système solaire vu du dehors »
     apporte six textes (trois niveaux, deux langues), tous sourcés.

     252 sur 292 le 11 août 2026 : la fiche « La Terre et la Lune, de loin »
     apporte six textes de plus, tous sourcés. C'est ce que l'arrivée du voyage
     AFFIRME, séparé de ce qu'elle dessine — la scène, elle, ne porte pas une
     phrase.

     254 sur 294 le même jour : le voile du ciel de l'arrivée entre comme
     compromis déclaré, dans les deux langues, avec sa source. */
  textesSources: 254,

  /* LES COMPROMIS DÉCLARÉS.

     Le site promet que tout est calculé. C'est vrai de la géométrie, des
     orbites, des durées, de la déviation de la lumière — et faux du fond de
     ciel, de l'éclat du disque, de la gravité du salon. Ces écarts étaient
     écrits, bien écrits même, mais en prose et dans un panneau qu'on ouvre
     rarement.

     Hugo, le 5 août 2026 : « chaque compromis doit se déclarer LÀ OÙ ON LE
     RENCONTRE, pas seulement dans une liste rangée ailleurs. » Un aveu global
     dans un dossier qu'on n'ouvre pas ne vaut rien.

     Un compromis déclaré porte donc quatre choses : un `id` stable, un `ou` qui
     nomme l'endroit où on le croise, un `aveu` court destiné à être posé là-bas,
     et le texte long qui reste dans le dossier.

     Neuf le 6 août 2026, onze depuis — le plancher était resté à neuf alors que
     la mesure disait onze, ce qui est le contraire d'un cliquet : deux compromis
     auraient pu disparaître sans que rien ne tombe. Remis d'aplomb le 9 août
     2026, à la valeur mesurée.

     Le plancher garantit qu'aucun ne disparaît en silence — et disparaître en
     silence est exactement ce qu'un compromis gênant aimerait faire.

     Douze le 11 août 2026, et le douzième a été TROUVÉ EN REGARDANT — aucun
     calcul ne pouvait l'attraper, puisque aucun nombre n'était faux. Le
     vaisseau ne se déplace jamais : à l'arrivée au système solaire, la baie
     peignait encore le trou noir qu'on venait de quitter, pendant que le
     panneau écrivait qu'il était à vingt-sept mille années-lumière derrière.
     On voile ce ciel pour montrer la Terre, et l'on dit qu'on le voile. */
  compromisDeclares: 12,
};

// Les endroits du site où l'on peut rencontrer un compromis. Fermé exprès : un
// `ou` inventé ne serait jamais affiché nulle part, et personne ne le saurait.
const LIEUX_COMPROMIS = new Set([
  "salon", "reglages", "reglage-temps", "telescope", "spectre",
  // `arrivee` s'est dédoublé le 10 août : la carte des étoiles S ne se montre
  // plus qu'à SON arrivée, donc son aveu ne peut plus se poser à l'autre.
  "recul", "arrivee-etoiles", "arrivee-soleil", "etude", "partout",
]);

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

  // ---- 4. la frontière du simulable : les compromis déclarés ----
  const nDeclares = compromis(FR, EN, dur);
  doux.push({ nom: "compromis déclarés, avec leur lieu et leur aveu",
              valeur: nDeclares.n, total: nDeclares.total,
              plancher: PLANCHERS.compromisDeclares });

  return bilan(durs, doux, { sources: kf.length, avecLien, avecPlus,
                             compromis: nDeclares.n });
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

/* LES COMPROMIS, ET CE QU'ILS DOIVENT PORTER POUR AVOIR LE DROIT D'EXISTER.

   Même esprit que le reste du contrat : on ne recommande pas, on refuse. Un
   compromis sans lieu de rencontre est un compromis qu'on ne pourra jamais
   avouer sur place, donc un compromis qui restera caché dans un panneau.

   Le `ou` n'est pas traduit, et c'est voulu : c'est une clé de machine, pas une
   phrase. Elle doit être IDENTIQUE dans les deux langues, sinon l'aveu se
   poserait à un endroit en français et à un autre en anglais. */
function compromis(FR, EN, dur){
  const listeDe = C => {
    const g = ((C.notes || {}).groupes || [])
      .map(x => x.points || []).reduce((a, b) => a.concat(b), []);
    return g.filter(p => p && typeof p === "object" && p.id);
  };
  const f = listeDe(FR), e = listeDe(EN);
  const totalF = ((FR.notes || {}).groupes || [])
    .map(x => (x.points || []).length).reduce((a, b) => a + b, 0);

  const parId = l => new Map(l.map(p => [p.id, p]));
  const mf = parId(f), me = parId(e);

  if(f.length !== new Set(mf.keys()).size)
    dur("compromis", "deux compromis portent le même identifiant en français");

  for(const [id, p] of mf){
    const ou = "compromis." + id;
    const q = me.get(id);

    if(!q){ dur(ou, "déclaré en français, pas en anglais"); continue; }

    if(!p.aveu || !String(p.aveu).trim()) dur(ou, "pas d'aveu court en français");
    if(!q.aveu || !String(q.aveu).trim()) dur(ou, "pas d'aveu court en anglais");

    /* L'aveu se pose À CÔTÉ de la chose, pas dans un dossier. Au-delà de deux
       cents signes il ne tient plus nulle part, et l'on retombe sur le panneau
       qu'on voulait quitter. */
    for(const [langue, txt] of [["français", p.aveu], ["anglais", q.aveu]])
      if(txt && String(txt).length > 200)
        dur(ou, "l'aveu " + langue + " fait " + String(txt).length
                + " signes — au-delà de 200 il ne se pose plus sur place");

    if(!p.ou) dur(ou, "ne dit pas où on le rencontre");
    else if(!LIEUX_COMPROMIS.has(p.ou))
      dur(ou, "lieu inconnu « " + p.ou + " » — attendus : " + [...LIEUX_COMPROMIS].join(", "));

    if(p.ou !== q.ou)
      dur(ou, "le lieu diffère entre les langues : « " + p.ou + " » contre « " + q.ou + " »");

    if(!p.t || !String(p.t).trim()) dur(ou, "pas de texte long en français");
    if(!q || !q.t || !String(q.t).trim()) dur(ou, "pas de texte long en anglais");

    /* LE RENDU CHANGE CE QU'IL Y A À AVOUER.

       Depuis `rendu.js`, la nébuleuse s'éteint en mode simulation — et l'aveu
       du fond de ciel dénonçait toujours « la nébuleuse mauve », c'est-à-dire
       une chose absente de l'écran. Un compromis peut donc porter `selonMode`,
       qui remplace son aveu et son texte quand ce mode est actif.

       Facultatif. Mais s'il existe, il existe DANS LES DEUX LANGUES et avec LES
       MÊMES MODES : sinon un anglophone lirait l'aveu de l'autre rendu, ce qui
       est exactement le mensonge que la manœuvre vient corriger.

       Les NOMS des modes ne sont pas vérifiés ici : ce fichier ignore que
       `rendu.js` existe, et une liste de modes de plus serait une vérité en
       double. C'est `outil-verif-aveu.js` qui exige qu'ils soient les siens. */
    const sf = p.selonMode, se = q.selonMode;
    if(!!sf !== !!se){
      dur(ou, "« selonMode » n'existe que dans une des deux langues");
    } else if(sf){
      const mf2 = Object.keys(sf).sort(), me2 = Object.keys(se).sort();
      if(mf2.join(",") !== me2.join(","))
        dur(ou, "les modes de « selonMode » diffèrent entre les langues : « "
                + mf2.join(", ") + " » contre « " + me2.join(", ") + " »");

      for(const m of mf2){
        for(const [langue, v] of [["français", sf[m]], ["anglais", se[m]]]){
          const la = "mode « " + m + " », " + langue + " : ";
          if(!v || typeof v !== "object"){ dur(ou, la + "rien à lire"); continue; }
          if(!v.aveu || !String(v.aveu).trim()) dur(ou, la + "pas d'aveu court");
          else if(String(v.aveu).length > 200)
            dur(ou, la + "l'aveu fait " + String(v.aveu).length
                    + " signes — au-delà de 200 il ne se pose plus sur place");
          if(!v.t || !String(v.t).trim()) dur(ou, la + "pas de texte long");
        }
      }
    }
  }

  for(const id of me.keys())
    if(!mf.has(id)) dur("compromis." + id, "déclaré en anglais, pas en français");

  return { n: f.length, total: totalF };
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
