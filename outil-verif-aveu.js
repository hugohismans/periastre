/* ============================================================================
   Les aveux, sans navigateur.

       node outil-verif-aveu.js

   `contrat.js` garantit qu'un compromis est bien DÉCLARÉ : un lieu connu, un
   aveu court, les deux langues. Il ne garantit pas qu'il soit MONTRÉ. Ce
   fichier éprouve la moitié qui manquait — celle qui va de la déclaration à
   l'endroit où on la rencontre.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI

   Pas du module. Trois sources indépendantes :

   1. LE SOURCE DE `contrat.js`, lu comme du texte, pour en extraire sa liste de
      lieux et la confronter à celle d'`aveu.js`. `aveu.js` recopie cette liste
      — il ne peut pas l'importer sans faire dépendre la page d'un module de
      contrôle — et une recopie non gardée finit toujours par diverger. C'est
      arrivé le 8 août pour la découpe des blocs, entre deux outils.

   2. LE PLANCHER DE `contrat.js` : `compromisDeclares`. Si le module en trouve
      moins que le contrat n'en exige, l'un des deux ment.

   3. DES CONTENUS FABRIQUÉS À LA MAIN, dont on connaît la réponse avant de
      demander. C'est là que se jugent le tri, « partout », et les doublons.

   ---------------------------------------------------------------------------
   CE QUI N'EST PAS COUVERT, ET IL FAUT LE DIRE

   Que le badge soit réellement POSÉ dans le document, à l'endroit déclaré, et
   qu'il porte le bon texte : ça demande la page. C'est `VERIF.aveux()`, dans
   `verif.js`, et c'est lui qui ferme la boucle. Ici on garantit seulement que
   le module rend la bonne liste — sans quoi le contrôle de la page comparerait
   la page à elle-même.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const faux = {};
new Function("window", fs.readFileSync(path.join(ICI, "aveu.js"), "utf8"))(faux);
const A = faux.AVEU;

const gFR = {};
new Function("window", fs.readFileSync(path.join(ICI, "contenu.js"), "utf8"))(gFR);
const FR = gFR.CONTENU;

const gEN = {};
new Function("window", fs.readFileSync(path.join(ICI, "contenu.en.js"), "utf8"))(gEN);
const EN = gEN.CONTENU;

const SRC_CONTRAT = fs.readFileSync(path.join(ICI, "contrat.js"), "utf8");

console.log("\n  LES AVEUX — CONTRÔLE NUMÉRIQUE");
console.log("  ══════════════════════════════");

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// ══════════════════════════════ 1. la recopie des lieux est gardée
groupe("La liste des lieux ne peut pas diverger de `contrat.js`");
{
  /* On lit le source plutôt que d'exécuter `contrat.js` : sa liste est une
     constante interne qu'il n'expose pas, et l'exposer pour un contrôle
     changerait le module pour l'arranger. */
  const m = SRC_CONTRAT.match(/LIEUX_COMPROMIS\s*=\s*new Set\(\[([\s\S]*?)\]\)/);
  ok("on retrouve la liste dans le source de `contrat.js`", !!m,
     "trouvée", m ? "trouvée" : "INTROUVABLE — le contrôle ne peut plus comparer",
     "si elle a été renommée, ce contrôle doit être réparé, pas contourné");
  if(m){
    const duContrat = [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]).sort();
    const duModule = [...A.LIEUX].sort();
    ok("les deux listes sont identiques",
       duContrat.join(",") === duModule.join(","),
       duContrat.join(", "), duModule.join(", "),
       "`aveu.js` recopie cette liste faute de pouvoir l'importer : c'est ce "
       + "contrôle-ci qui la tient d'accord, et rien d'autre");
  }
}

// ══════════════════════════════ 2. le compte s'accorde au plancher du contrat
groupe("Le compte s'accorde au plancher de `contrat.js`");
{
  const p = SRC_CONTRAT.match(/compromisDeclares\s*:\s*(\d+)/);
  const plancher = p ? +p[1] : null;
  const trouvesFR = A.tous(FR).length, trouvesEN = A.tous(EN).length;
  ok("on lit le plancher dans `contrat.js`", plancher !== null, "un nombre", plancher);
  ok("le module trouve au moins autant de compromis que le plancher",
     plancher !== null && trouvesFR >= plancher, "≥ " + plancher, trouvesFR,
     "en trouver MOINS voudrait dire que l'arbre en cache : le contrat les compte "
     + "autrement, et l'un des deux mentirait");
  ok("le français et l'anglais en ont le même nombre", trouvesFR === trouvesEN,
     trouvesFR, trouvesEN,
     "un aveu qui n'existe que dans une langue est invisible pour l'autre moitié "
     + "des visiteurs");
  const idFR = A.tous(FR).map(c => c.id).sort().join(",");
  const idEN = A.tous(EN).map(c => c.id).sort().join(",");
  ok("et exactement les mêmes identifiants", idFR === idEN, idFR, idEN);
}

// ══════════════════════════════ 3. chaque compromis est montrable
groupe("Aucun compromis ne peut rester invisible");
{
  const t = A.tous(FR);
  const sansLieu = t.filter(c => !A.LIEUX.has(c.ou));
  ok("tous les lieux déclarés sont connus", sansLieu.length === 0, 0,
     sansLieu.length ? sansLieu.map(c => c.id + " → « " + c.ou + " »").join(", ") : 0,
     "un `ou` inventé ne serait affiché nulle part, et personne ne le saurait");

  /* LE CONTRÔLE QUI DONNE SON SENS AU FICHIER : chaque compromis doit ressortir
     d'au moins un appel à `pour()`. Un compromis déclaré dans les règles, mais
     qu'aucun lieu ne rend, est exactement le défaut que F4 vient fermer. */
  const rendus = new Set();
  for(const ou of A.LIEUX) for(const c of A.pour(FR, ou)) rendus.add(c.id || c.aveu);
  const perdus = t.filter(c => !rendus.has(c.id || c.aveu));
  ok("chacun ressort d'au moins un lieu", perdus.length === 0, 0,
     perdus.length ? perdus.map(c => c.id).join(", ") : 0,
     "déclaré et jamais rendu : le défaut exact que ce fichier existe pour attraper");
}

// ══════════════════════════════ 4. « partout » veut dire partout
groupe("« partout » sort à chaque lieu");
{
  const global_ = A.tous(FR).filter(c => c.ou === "partout");
  ok("il y a bien au moins un compromis « partout »", global_.length > 0, "> 0", global_.length,
     "sinon ce groupe ne prouve rien — c'est le fond du ciel, faux partout");
  let manque = null;
  for(const ou of A.LIEUX){
    if(ou === "partout") continue;
    const ids = A.pour(FR, ou).map(c => c.id);
    for(const g of global_) if(!ids.includes(g.id)) manque = ou + " n'a pas " + g.id;
  }
  ok("et il sort à TOUS les autres lieux", manque === null, "aucun manquant", manque || "aucun");
  ok("`pour(\"partout\")` ne se duplique pas lui-même",
     A.pour(FR, "partout").length === global_.length, global_.length,
     A.pour(FR, "partout").length,
     "sinon le fond du ciel s'afficherait deux fois sur son propre panneau");
}

// ══════════════════════════════ 5. le tri, sur un contenu fabriqué
groupe("Le tri, sur un contenu dont on connaît la réponse");
{
  const faux1 = {
    a: { ou: "salon",   aveu: "A", id: "a" },
    b: { profond: { c: { ou: "spectre", aveu: "B", id: "b" } } },
    liste: [ { ou: "partout", aveu: "C", id: "c" } ],
    bruit1: { ou: "salon" },                       // `ou` sans `aveu`
    bruit2: { aveu: "pas de lieu" },               // `aveu` sans `ou`
    bruit3: { ou: 4, aveu: 7 },                    // les deux, mauvais type
  };
  const t = A.tous(faux1).map(c => c.id).sort();
  ok("il faut `ou` ET `aveu`, tous deux en texte", t.join(",") === "a,b,c",
     "a,b,c", t.join(",") || "(rien)",
     "trois leurres écartés : un `ou` seul, un `aveu` seul, et les deux au mauvais type");
  ok("le salon rend le sien plus le « partout »",
     A.pour(faux1, "salon").map(c => c.id).sort().join(",") === "a,c", "a,c",
     A.pour(faux1, "salon").map(c => c.id).sort().join(","));
  ok("un lieu inconnu ne rend rien et ne lève pas",
     A.pour(faux1, "cuisine").length === 0, 0, A.pour(faux1, "cuisine").length);

  const faux2 = { x: { ou:"salon", aveu:"même", id:"dup" }, y: { ou:"salon", aveu:"même", id:"dup" } };
  ok("le même compromis atteint deux fois ne sort qu'une",
     A.tous(faux2).length === 1, 1, A.tous(faux2).length,
     "deux badges identiques côte à côte se liraient comme un défaut, et c'en serait un");

  ok("un contenu vide, nul ou scalaire ne fait pas lever",
     A.tous({}).length === 0 && A.tous(null).length === 0 && A.tous(5).length === 0,
     "0 partout", [A.tous({}).length, A.tous(null).length, A.tous(5).length].join(" / "));
}

// ══════════════════════════════ 6. le descripteur ne porte pas de balise
groupe("Le descripteur est du texte, jamais du HTML");
{
  let coupable = null;
  for(const c of A.tous(FR)){
    const d = A.descripteur(c);
    for(const [k, v] of Object.entries(d))
      if(typeof v === "string" && /[<>]/.test(v)) coupable = c.id + "." + k;
  }
  ok("aucun champ ne contient `<` ni `>`", coupable === null, "aucun", coupable || "aucun",
     "la page fabrique ses nœuds : un descripteur qui porterait des balises "
     + "ouvrirait une injection par le contenu");
  const d = A.descripteur({ ou:"salon", aveu:"court" });
  ok("un compromis sans titre ni détail donne quand même un descripteur",
     d.aveu === "court" && d.titre === null && d.detail === null,
     "aveu seul", JSON.stringify(d));
}

// ══════════════════════════════ 7. l'aveu suit le rendu
/* Le défaut que ce groupe ferme est ARRIVÉ, et je l'avais fabriqué moi-même en
   livrant la bascule : en mode simulation la nébuleuse s'éteint, et l'aveu
   continuait de dénoncer « la nébuleuse mauve ». Le site avouait une chose
   absente de l'écran. Un aveu faux est pire qu'un aveu absent — il apprend à
   ne plus les lire, ce qui défait tout F4.

   La vérité des noms de modes vient de `rendu.js`, jamais d'une liste écrite
   ici : `aveu.js` applique la clé qu'on lui tend, `contrat.js` ignore que les
   modes existent, et c'est ce fichier qui recoud les trois. */
groupe("L'aveu suit le rendu — les modes viennent de `rendu.js`");
{
  const gR = {};
  new Function("window", fs.readFileSync(path.join(ICI, "rendu.js"), "utf8"))(gR);
  const MODES = gR.RENDU.MODES;

  const avecMode = c => c.selonMode && Object.keys(c.selonMode).length;
  const listeFR = A.tous(FR).filter(avecMode);
  const listeEN = A.tous(EN).filter(avecMode);

  let inconnu = null, incomplet = null;
  for(const [langue, liste] of [["fr", listeFR], ["en", listeEN]])
    for(const c of liste){
      const cles = Object.keys(c.selonMode);
      for(const m of cles) if(MODES.indexOf(m) < 0) inconnu = langue + " · " + c.id + " · " + m;
      for(const m of MODES) if(cles.indexOf(m) < 0) incomplet = langue + " · " + c.id + " · " + m;
    }

  ok("aucun mode inventé dans le contenu", inconnu === null,
     "des modes de rendu.js : " + MODES.join(", "), inconnu || "aucun",
     "une clé que `rendu.js` ne connaît pas ne serait jamais appliquée — l'aveu "
     + "resterait le générique sans que personne ne le sache");
  ok("et chaque mode est couvert quand `selonMode` existe", incomplet === null,
     "tous les modes", incomplet || "tous",
     "un mode oublié retombe sur l'aveu générique, c'est-à-dire sur celui qu'on "
     + "voulait justement corriger");

  ok("au moins un compromis dépend du rendu", listeFR.length > 0, "> 0", listeFR.length,
     "sinon la machinerie est un décor, et la bascule ment de nouveau");

  const fc = A.tous(FR).find(c => c.id === "fond-ciel");
  const parMode = MODES.map(m => A.descripteur(fc, m).aveu);
  ok("l'aveu du fond de ciel change avec le rendu",
     fc && new Set(parMode).size === MODES.length,
     MODES.length + " textes distincts", new Set(parMode).size,
     "c'est le cas qui a motivé tout ce groupe : la nébuleuse éteinte, l'aveu "
     + "doit cesser de la dénoncer — et dire à la place ce qui reste faux");

  ok("sans mode, on retrouve l'aveu générique",
     A.descripteur(fc).aveu === fc.aveu, "le générique",
     A.descripteur(fc).aveu === fc.aveu ? "le générique" : "AUTRE CHOSE",
     "la page peut appeler sans mode — un contrôle, un centre ouvert avant que "
     + "le rendu soit lu — et ça ne doit jamais rendre `undefined`");
  ok("un mode inconnu retombe sur le générique",
     A.descripteur(fc, "imax").aveu === fc.aveu, "le générique",
     A.descripteur(fc, "imax").aveu);

  // Le mode traverse `annonce` et `centre`, pas seulement `descripteur`.
  for(const m of MODES){
    const an = A.annonce(FR, "partout", new Set(), m);
    ok("`annonce` ne parle pas du lieu « partout » (mode " + m + ")", an === null,
       "null", String(an),
       "« partout » accompagne chaque lieu : l'annoncer le ferait revenir sans fin");
    const grp = A.centre(FR, new Set(), m).find(g => g.ou === "partout");
    const e = grp && grp.entrees.find(x => x.id === "fond-ciel");
    ok("`centre` applique le mode " + m, !!e && e.aveu === fc.selonMode[m].aveu,
       "l'aveu du mode", e ? e.aveu.slice(0, 40) + "…" : "ABSENT");
  }

  let balise = null;
  for(const c of listeFR)
    for(const m of MODES){
      const d = A.descripteur(c, m);
      for(const [k, v] of Object.entries(d))
        if(k !== "detail" && typeof v === "string" && /[<>]/.test(v)) balise = c.id + "." + m + "." + k;
    }
  ok("les aveux par mode restent du texte", balise === null, "aucun", balise || "aucun",
     "le texte long garde ses balises — il part dans le dossier — mais l'aveu "
     + "court est posé par `textContent` et ne doit rien porter");
}

// ══════════════════════════════ 8. les sabotages
groupe("Et ces contrôles savent tomber");
{
  /* On rejoue une assertion sur un module modifié en mémoire. Le fichier sur le
     disque n'est jamais touché. */
  const bac = (sup) => Object.assign({}, A, sup);

  // « partout » traité comme un lieu ordinaire — le défaut le plus facile à
  // commettre, et celui qui ferait disparaître le fond du ciel de partout.
  const sansPartout = bac({ pour: (c, ou) => A.tous(c).filter(x => x.ou === ou) });
  const g = A.tous(FR).filter(c => c.ou === "partout");
  let vu = false;
  for(const ou of A.LIEUX){
    if(ou === "partout") continue;
    const ids = sansPartout.pour(FR, ou).map(c => c.id);
    for(const x of g) if(!ids.includes(x.id)) vu = true;
  }
  ok("un `pour` qui oublie « partout » est vu", vu, "vu", vu ? "vu" : "PASSÉ INAPERÇU");

  // Le dédoublonnage retiré.
  const sansDedoublon = bac({ tous: (c) => {
    const v = [];
    (function m(o){
      if(!o || typeof o !== "object") return;
      if(Array.isArray(o)) return o.forEach(m);
      if(typeof o.ou === "string" && typeof o.aveu === "string") return void v.push(o);
      Object.values(o).forEach(m);
    })(c);
    return v;
  }});
  const faux2 = { x:{ou:"salon",aveu:"m",id:"d"}, y:{ou:"salon",aveu:"m",id:"d"} };
  ok("un `tous` qui garde les doublons est vu", sansDedoublon.tous(faux2).length !== 1,
     "vu", sansDedoublon.tous(faux2).length === 1 ? "PASSÉ INAPERÇU" : "vu");

  // Le filtre de type retiré : un `ou` numérique passerait.
  const sansType = bac({ tous: (c) => {
    const v = [];
    (function m(o){
      if(!o || typeof o !== "object") return;
      if(Array.isArray(o)) return o.forEach(m);
      if(o.ou && o.aveu) return void v.push(o);
      Object.values(o).forEach(m);
    })(c);
    return v;
  }});
  const faux3 = { bon:{ou:"salon",aveu:"A",id:"a"}, mauvais:{ou:4,aveu:7,id:"z"} };
  ok("un `tous` sans contrôle de type est vu", sansType.tous(faux3).length !== 1,
     "vu", sansType.tous(faux3).length === 1 ? "PASSÉ INAPERÇU" : "vu");

  /* Le descripteur d'avant le 9 août : il ignore le mode. C'est LE défaut réel,
     pas un défaut imaginé — il était en ligne entre la bascule et ce groupe. */
  const sourd = bac({ descripteur: c => ({ id: c.id || null, aveu: c.aveu,
                        titre: c.titre || null, detail: c.detail || null }) });
  const cible = A.tous(FR).find(c => c.id === "fond-ciel");
  ok("un descripteur sourd au mode est vu",
     sourd.descripteur(cible, "simulation").aveu === cible.aveu,
     "vu", sourd.descripteur(cible, "simulation").aveu === cible.aveu
             ? "vu" : "PASSÉ INAPERÇU");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
