/* ============================================================================
   LES LIBELLÉS, ÉPROUVÉS SANS NAVIGATEUR.

       node outil-verif-libelles.js

   Le défaut qu'il attrape : une clé qui n'existe dans aucun des deux fichiers
   de langue. `T` rend alors la clé elle-même, et le bouton affiche
   « panneau.etiq.volumme » en toutes lettres. C'est le bon comportement — le
   manque se voit — mais il ne se voit qu'en ouvrant la page DANS CETTE
   LANGUE-LÀ. Personne n'ouvre les deux langues à chaque commit. Ici, c'est une
   commande de quarante millisecondes.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ (règle 3 : jamais de la table qu'on contrôle)

   De trois sources qui ne se connaissent pas, et dont aucune n'est
   `libelles.js` :

   1. **Les deux fichiers de langue**, chargés — pas recopiés. `ui.fr.js` puis
      `ui.en.js` PAR-DESSUS, dans l'ordre exact de la page : le second fait
      `Object.assign(window.UI, …)`, il surcharge le premier au lieu de le
      remplacer. Le charger seul dans un faux `window` vide explose. On garde
      donc les deux états : le français plein, et l'anglais tel qu'il se
      DÉFINIT lui-même — parce qu'une clé absente d'`ui.en.js` retombe
      silencieusement sur du français, ce qui est un défaut visible seulement
      pour qui lit l'anglais.
   2. **Le balisage d'`index.html`**, relu en arbre. On ne cherche pas
      `id="…"` à la ficelle : on reconstruit parenté et voisinage, parce que
      deux des trois tables en dépendent. L'étiquette d'un bloc de réglages est
      le `previousElementSibling` d'un conteneur, et un identifiant qui existe
      dans un gabarit de chaîne à l'intérieur d'un `<script>` n'existe PAS au
      moment où les libellés se posent. Une recherche à la ficelle confondrait
      les deux.
   3. **La page elle-même, tant qu'elle porte encore ses tables en dur.**
      L'extraction a été faite à la main ; une virgule déplacée passerait tous
      les autres contrôles sans bruit. On relit donc les trois littéraux dans
      `index.html` et on exige qu'ils correspondent au module, à l'ordre près
      de rien du tout. Le jour où la page appellera `LIBELLES` au lieu de
      porter les listes, ce groupe se déclarera SANS OBJET au lieu d'échouer —
      un contrôle qui se sait périmé vaut mieux qu'un contrôle qu'on désactive.

   Le module, lui, n'est chargé que pour être jugé. Il ne sert jamais de
   référence à quoi que ce soit.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ici = __dirname;
const lis = f => fs.readFileSync(path.join(ici, f), "utf8");

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// ═════════════════════════════════════════════════════ source 1 : les langues
/* L'ORDRE EST LE PIÈGE, et il est vérifié : `ui.en.js` commence par
   `Object.assign(window.UI, …)`. Dans un `window` vide, `window.UI` vaut
   `undefined` et l'appel jette. On charge donc le français d'abord, on prend
   une copie de son état, puis on laisse l'anglais écrire par-dessus le même
   objet — c'est mot pour mot ce que font les deux `document.write` de la page.

   On garde en plus ce qu'`ui.en.js` définit TOUT SEUL, dans un `window` où l'on
   a posé un `UI` vide : c'est la seule façon de distinguer « traduit » de
   « retombé sur le français ». */
const g = {};
new Function("window", lis("ui.fr.js"))(g);
const FR = Object.assign({}, g.UI);
new Function("window", lis("ui.en.js"))(g);
const FUSION = g.UI;                      // ce que la page a réellement en anglais
const gEn = { UI: {} };
new Function("window", lis("ui.en.js"))(gEn);
const EN = gEn.UI;                        // ce qu'`ui.en.js` porte de son propre chef

// ═══════════════════════════════════════════════════ source 2 : le balisage
/* Un lecteur de balises minimal, mais qui rend la PARENTÉ et le VOISINAGE —
   les deux seules choses dont les tables ont besoin. Le contenu des `<script>`
   et des `<style>` est sauté : ce qui y ressemble à du balisage n'en est pas,
   et un `id` qui n'y vit que dans un gabarit de chaîne n'existe pas encore
   quand les libellés se posent. */
const VIDES = new Set(["area","base","br","col","embed","hr","img","input","link",
                       "meta","param","source","track","wbr"]);
const OPAQUES = new Set(["script","style","textarea"]);

function litArbre(html){
  const racine = { tag:"#racine", attrs:"", enfants:[], parent:null };
  let cour = racine, opaque = null;
  const pile = [], ecarts = [];
  const balise = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>|<!--[\s\S]*?-->|<![^>]*>/g;
  let m;
  while((m = balise.exec(html))){
    if(m[2] === undefined) continue;                       // commentaire, doctype
    const fermante = m[1] === "/", tag = m[2].toLowerCase();
    if(opaque){ if(fermante && tag === opaque) opaque = null; continue; }
    if(fermante){
      let k = pile.length - 1;
      while(k >= 0 && pile[k].tag !== tag) k--;
      if(k < 0){ ecarts.push("</" + tag + "> sans ouvrante"); continue; }
      if(k !== pile.length - 1)
        ecarts.push("</" + tag + "> referme " + (pile.length - 1 - k) + " balise(s) laissée(s) ouverte(s)");
      pile.length = k;
      cour = pile.length ? pile[pile.length - 1] : racine;
    } else {
      const e = { tag, attrs: m[3] || "", enfants: [], parent: cour };
      cour.enfants.push(e);
      if(VIDES.has(tag) || m[4] === "/") continue;
      if(OPAQUES.has(tag)) opaque = tag; else { pile.push(e); cour = e; }
    }
  }
  if(pile.length) ecarts.push(pile.length + " balise(s) jamais fermée(s) : " + pile.map(p => p.tag).join(", "));
  return { racine, ecarts };
}

const SRC = lis("index.html");
const { racine, ecarts } = litArbre(SRC);

const attr = (e, a) => { const m = new RegExp("\\b" + a + "\\s*=\\s*\"([^\"]*)\"").exec(e.attrs || ""); return m ? m[1] : null; };
const PAR_ID = {};
(function plonge(e){
  const id = attr(e, "id");
  if(id) (PAR_ID[id] = PAR_ID[id] || []).push(e);
  e.enfants.forEach(plonge);
})(racine);

// Les `id` qui n'apparaissent QUE dans un `<script>`/`<style>` : ils existent
// dans le fichier, pas dans la page au chargement. La nuance a des dents.
const ID_SCRIPT = new Set();
for(const m of SRC.matchAll(/<(script|style)\b[^>]*>([\s\S]*?)<\/\1>/g))
  for(const q of m[2].matchAll(/\bid\s*=\s*"([^"]+)"/g)) ID_SCRIPT.add(q[1]);

const voisinGauche = e => {
  const f = e.parent && e.parent.enfants;
  if(!f) return null;
  const i = f.indexOf(e);
  return i > 0 ? f[i - 1] : null;
};

// ══════════════════════════════════════════ source 3 : les tables de la page
/* On remonte depuis l'ancre de fin en équilibrant les crochets : c'est la seule
   façon de ne pas dépendre du nombre de lignes ni de la mise en forme. */
function littéral(ancre){
  const fin = SRC.indexOf(ancre);
  if(fin < 0) return null;
  let d = 0, i = fin;
  for(; i >= 0; i--){
    if(SRC[i] === "]") d++;
    else if(SRC[i] === "["){ d--; if(d === 0) break; }
  }
  return i >= 0 ? SRC.slice(i, fin + 1) : null;
}
const ANCRES = {
  textes:    "].forEach(([id, cle]) => { const e = $(id); if(e) e.textContent = T(cle); });",
  attributs: "].forEach(([id, attr, cle]) => { const e = $(id); if(e) e.setAttribute(attr, T(cle)); });",
  elements:  "].forEach(([e, cle]) => {",
};

// ═══════════════════════════════════════════════════════ le module, à juger
const gm = {};
new Function("window", lis("libelles.js"))(gm);
const L = gm.LIBELLES;

console.log("\n  LES LIBELLÉS DE L'INTERFACE");
console.log("  ══════════════════════════");

// ─────────────────────────────────────────────────────── 0. les fondations
groupe("Les sources se lisent");
{
  ok("le module expose ses trois tables",
     !!L && Array.isArray(L.textes) && Array.isArray(L.attributs) && Array.isArray(L.elements),
     "textes, attributs, elements",
     L ? Object.keys(L).join(", ") : "aucun LIBELLES");
  ok("les deux langues se chargent dans l'ordre de la page",
     Object.keys(FR).length > 100 && Object.keys(EN).length > 100,
     "deux dictionnaires garnis",
     Object.keys(FR).length + " fr / " + Object.keys(EN).length + " en",
     "l'anglais surcharge le français : chargé seul dans un window vide, il jette");
  ok("le balisage se relit sans écart de structure", ecarts.length === 0,
     "aucun écart", ecarts.length ? ecarts.slice(0, 3).join(" | ") : "aucun",
     "sans cela, parenté et voisinage ne voudraient rien dire");
}

// ──────────────────────────────── 1. LE CONTRÔLE QUI JUSTIFIE TOUT LE RESTE
groupe("Chaque clé existe dans les DEUX langues");
{
  const toutes = [
    ...L.textes.map(([id, c]) => [c, "textes/" + id]),
    ...L.attributs.map(([id, a, c]) => [c, "attributs/" + id + "@" + a]),
    ...L.elements.map(([id, r, c]) => [c, "elements/" + id]),
  ];
  const nuesFr = toutes.filter(([c]) => typeof FR[c] !== "string");
  const nuesEn = toutes.filter(([c]) => typeof FUSION[c] !== "string");
  ok(toutes.length + " clés posées, aucune inconnue du français", nuesFr.length === 0,
     "0 clé nue", nuesFr.length + (nuesFr.length ? " : " + nuesFr.map(x => x[0] + " (" + x[1] + ")").join(", ") : ""),
     "une clé absente des deux fichiers s'affiche telle quelle à l'écran");
  ok("aucune inconnue de l'anglais", nuesEn.length === 0,
     "0 clé nue", nuesEn.length + (nuesEn.length ? " : " + nuesEn.map(x => x[0] + " (" + x[1] + ")").join(", ") : ""));

  /* La parité, qui est autre chose. `ui.en.js` ne REMPLACE pas le français, il
     le surcharge : une clé qu'il oublie retombe sur une vraie phrase française.
     Rien ne casse, rien ne s'affiche nu — et c'est bien le problème, puisque
     seul un lecteur anglophone voit le trou. */
  const franco = toutes.filter(([c]) => typeof EN[c] !== "string");
  ok("aucune ne retombe en français faute d'être traduite", franco.length === 0,
     "0 clé non traduite",
     franco.length + (franco.length ? " : " + franco.map(x => x[0]).join(", ") : ""),
     "le repli est voulu et il sauve la page — mais il rend le trou invisible");
}

// ─────────────────────────────────────────────── 2. les identifiants existent
groupe("Chaque identifiant existe dans le balisage d'index.html");
{
  const cibles = [
    ...L.textes.map(([id]) => ["textes", id]),
    ...L.attributs.map(([id]) => ["attributs", id]),
    ...L.elements.map(([id]) => ["elements", id]),
  ];
  const absents = cibles.filter(([, id]) => !PAR_ID[id]);
  // Un `id` connu du seul `<script>` est un piège plus vicieux qu'un `id` absent.
  const tardifs = absents.filter(([, id]) => ID_SCRIPT.has(id));
  const doubles = [...new Set(cibles.map(x => x[1]))].filter(id => PAR_ID[id] && PAR_ID[id].length > 1);
  ok(cibles.length + " désignations, toutes ancrées dans la page", absents.length === 0,
     "0 identifiant introuvable",
     absents.length + (absents.length ? " : " + absents.map(x => x[1] + " (" + x[0] + ")").join(", ") : ""));
  ok("aucun n'existe seulement dans un gabarit de <script>", tardifs.length === 0,
     "0", tardifs.length + (tardifs.length ? " : " + tardifs.map(x => x[1]).join(", ") : ""),
     "un élément créé plus tard n'est pas là quand les libellés se posent");
  ok("aucun identifiant n'est porté par deux éléments", doubles.length === 0,
     "0 doublon dans le balisage", doubles.length ? doubles.join(", ") : "0",
     "$() ne rendrait que le premier, et l'autre resterait en français");
}

// ──────────────────────────────────────────────── 3. la table est cohérente
groupe("La table ne se contredit pas");
{
  const vide = v => typeof v !== "string" || v.trim() === "";
  const mauvaises = [
    ...L.textes.filter(([id, c]) => vide(id) || vide(c)).map(x => "textes " + JSON.stringify(x)),
    ...L.attributs.filter(([id, a, c]) => vide(id) || vide(a) || vide(c)).map(x => "attributs " + JSON.stringify(x)),
    ...L.elements.filter(([id, r, c]) => vide(id) || vide(c) || typeof r !== "boolean").map(x => "elements " + JSON.stringify(x)),
  ];
  ok("aucune entrée vide, tronquée ou mal formée", mauvaises.length === 0,
     "0", mauvaises.length ? mauvaises.join(" | ") : "0",
     "une clé vide rendrait la chaîne vide : un bouton muet, sans la moindre erreur");

  const dbl = (liste, cle) => {
    const vus = new Set(), out = [];
    for(const e of liste){ const k = cle(e); if(vus.has(k)) out.push(k); vus.add(k); }
    return out;
  };
  const dT = dbl(L.textes, ([id]) => id);
  /* Ici c'est le COUPLE qui doit être unique : `b-bulle-fermer` porte
     légitimement `title` et `aria-label`, avec la même clé. Contrôler
     l'identifiant seul crierait au loup sur une entrée juste. */
  const dA = dbl(L.attributs, ([id, a]) => id + "@" + a);
  const dE = dbl(L.elements, ([id, r]) => id + (r ? "^" : ""));
  ok("aucun identifiant en double dans les textes", dT.length === 0, "0", dT.join(", ") || "0",
     "deux écrivains pour un même texte : le dernier gagne, en silence");
  ok("aucun couple (identifiant, attribut) en double", dA.length === 0, "0", dA.join(", ") || "0");
  ok("aucune étiquette posée deux fois", dE.length === 0, "0", dE.join(", ") || "0");
}

// ──────────────────────────────── 4. les étiquettes tombent sur une étiquette
/* La table des `elements` ne peint pas l'élément qu'elle nomme : elle peint son
   voisin de gauche, à condition qu'il porte la classe `etiq`. Si le balisage
   bouge — une ligne insérée, un bloc réorganisé — la page ne lève rien : elle
   ne peint simplement plus rien, et l'étiquette reste en français pour
   toujours. C'est exactement le genre de panne qu'aucun œil ne remarque. */
groupe("Chaque étiquette a bien une .etiq à coiffer");
{
  const rates = [];
  for(const [id, remonte, cle] of L.elements){
    const e0 = PAR_ID[id] && PAR_ID[id][0];
    const cible = remonte ? (e0 && e0.parent) : e0;
    const v = cible && voisinGauche(cible);
    const cls = v ? (attr(v, "class") || "") : "";
    if(!v || !cls.split(/\s+/).includes("etiq"))
      rates.push(id + (remonte ? " (parent)" : "") + " → " + (v ? "<" + v.tag + " class=\"" + cls + "\">" : "aucun voisin"));
  }
  ok(L.elements.length + " étiquettes trouvent leur .etiq", rates.length === 0,
     "0 orpheline", rates.length ? rates.join(" | ") : "0",
     "sinon la page ne peint rien, sans lever la moindre erreur");

  // Et le drapeau `remonte` doit être NÉCESSAIRE : s'il était faux partout, le
  // contrôle du dessus passerait quand même — il ne prouverait plus rien.
  const utile = L.elements.some(([, r]) => r) && L.elements.some(([, r]) => !r);
  ok("le drapeau `remonte` sépare vraiment deux cas", utile,
     "les deux valeurs présentes",
     L.elements.filter(([, r]) => r).length + " vrai / " + L.elements.filter(([, r]) => !r).length + " faux");
}

// ─────────────────────────── 5. l'extraction est fidèle à ce que la page fait
groupe("Le module dit la même chose que la page");
{
  const litTextes = littéral(ANCRES.textes);
  const litAttrs  = littéral(ANCRES.attributs);
  const litElems  = littéral(ANCRES.elements);
  const migre = !litTextes && !litAttrs && !litElems;

  if(migre){
    console.log("  ·   SANS OBJET — la page ne porte plus ses tables en dur.");
    console.log("        Elle appelle LIBELLES : ce groupe n'a plus de référence à croiser,");
    console.log("        et les quatre groupes précédents restent, eux, entièrement valides.");
  } else {
    const cmp = (nom, attendu, mesure) =>
      ok(nom, JSON.stringify(attendu) === JSON.stringify(mesure),
         attendu.length + " entrées identiques",
         JSON.stringify(mesure) === JSON.stringify(attendu) ? "identiques"
           : "écart — page " + JSON.stringify(attendu).slice(0, 120) + " …");

    const paires = s => [...s.matchAll(/\[\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\]/g)].map(m => [m[1], m[2]]);
    const trios  = s => [...s.matchAll(/\[\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\]/g)].map(m => [m[1], m[2], m[3]]);
    const etiqs  = s => [...s.matchAll(/\[\s*\$\("([^"]+)"\)(\.parentElement)?\s*,\s*"([^"]+)"\s*\]/g)]
                          .map(m => [m[1], !!m[2], m[3]]);

    if(litTextes) cmp("les textes de la page, un à un", paires(litTextes), L.textes);
    else ok("les textes se relisent dans la page", false, "un littéral", "ancre introuvable");
    if(litAttrs) cmp("les attributs de la page, un à un", trios(litAttrs), L.attributs);
    else ok("les attributs se relisent dans la page", false, "un littéral", "ancre introuvable");
    if(litElems) cmp("les étiquettes de la page, une à une", etiqs(litElems), L.elements);
    else ok("les étiquettes se relisent dans la page", false, "un littéral", "ancre introuvable");
  }
}

// ═══════════════════════════════════════════════════ 6. cet outil sait échouer
/* Règle 2. On sabote une COPIE EN MÉMOIRE du module — jamais le fichier — et
   l'on exige que chaque contrôle tombe sur sa propre faute. Six sabotages pour
   six contrôles : un test qui n'échoue jamais ne teste rien, et un test qui
   n'échoue que d'une seule façon n'en teste qu'une. */
groupe("Cet outil sait échouer");
{
  const copie = () => JSON.parse(JSON.stringify({ t:L.textes, a:L.attributs, e:L.elements }));
  const cles = c => [...c.t.map(x => x[1]), ...c.a.map(x => x[2]), ...c.e.map(x => x[2])];

  const c1 = copie(); c1.t.push(["b-pluie", "panneau.etiq.volumme"]);
  /* On exige que la clé inventée soit VUE, pas qu'elle soit la seule : si le
     module est par ailleurs cassé, ce point doit rester lisible au lieu
     d'ajouter un faux échec au diagnostic. */
  const nues1 = cles(c1).filter(k => typeof FR[k] !== "string" && typeof FUSION[k] !== "string");
  ok("une clé inventée est vue", nues1.includes("panneau.etiq.volumme"),
     "panneau.etiq.volumme signalée", nues1.join(", ") || "aucune — LE CONTRÔLE 1 NE PROUVERAIT RIEN",
     "la faute exacte : une lettre en trop dans « volume »");

  const c2 = copie(); c2.t.push(["b-pluie", "u.langue"]);
  const enSeul = Object.assign({}, EN); delete enSeul["u.langue"];
  const franco2 = cles(c2).filter(k => typeof enSeul[k] !== "string");
  ok("une clé qui retombe en français est vue", franco2.includes("u.langue"),
     "u.langue signalée", franco2.join(", ").slice(0, 60) || "aucune",
     "on retire la clé de l'anglais en mémoire : rien ne casse à l'écran, tout est faux");

  const c3 = copie(); c3.e.push(["panneau-des-reglages", false, "panneau.langue"]);
  const abs3 = c3.e.filter(([id]) => !PAR_ID[id]).map(x => x[0]);
  ok("un identifiant qui n'est pas dans le HTML est vu", abs3.includes("panneau-des-reglages"),
     "panneau-des-reglages signalé", abs3.join(", ") || "aucun");

  const c4 = copie(); c4.a.push(["rouage", "title", "lumen.fermer"]);
  const vus = new Set(), dbl4 = [];
  for(const [id, a] of c4.a){ const k = id + "@" + a; if(vus.has(k)) dbl4.push(k); vus.add(k); }
  ok("un couple (identifiant, attribut) répété est vu", dbl4.includes("rouage@title"),
     "rouage@title signalé", dbl4.join(", ") || "aucun",
     "et `b-bulle-fermer`, légitimement présent deux fois, ne déclenche rien");

  const c5 = copie(); c5.t.push(["b-pluie", "   "]);
  const vide5 = c5.t.filter(([, k]) => typeof k !== "string" || k.trim() === "");
  ok("une clé vide est vue", vide5.length === 1, "1", vide5.length);

  // L'étiquette : on vise un élément réel dont le voisin de gauche n'est PAS
  // une `.etiq`. `b-photon` vit dans le dock, entre deux boutons.
  const e0 = PAR_ID["b-photon"] && PAR_ID["b-photon"][0];
  const v6 = e0 && voisinGauche(e0);
  const cls6 = v6 ? (attr(v6, "class") || "") : "";
  ok("une étiquette qui ne coiffe rien est vue", !!v6 && !cls6.split(/\s+/).includes("etiq"),
     "un voisin sans la classe etiq",
     v6 ? "<" + v6.tag + " class=\"" + cls6 + "\">" : "aucun voisin",
     "si ce point échouait, le groupe des étiquettes passerait sur n'importe quoi");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
