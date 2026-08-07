/* ============================================================================
   LES SEUILS QUI PRONONCENT UN VERDICT.

       node outil-verif-banc.js

   Le banc d'essai affiche « juste », « passable » ou « faux » à côté de chaque
   mesure. Les deux seuils qui décident de ce mot vivaient dans `index.html`,
   là où aucun outil ne pouvait les jouer. Un chiffre qui prononce un jugement
   à l'écran doit pouvoir être éprouvé — sinon c'est une opinion.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ

   De `physique.js`, qui est un autre fichier et un autre auteur. Les quatre
   repères y portent leur valeur théorique ET leur mesure ; ce module-ci ne fait
   que les habiller. On exige donc que la boucle se referme : les quatre essais
   du site, joués pour de vrai, doivent tous être déclarés « juste ».

   C'est le seul contrôle qui puisse dire que les seuils sont bien réglés — trop
   serrés, ils crieraient au loup sur du code sain ; trop larges, ils
   laisseraient passer une erreur de formule.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const ici = __dirname;

const w = {};
new Function("window", fs.readFileSync(path.join(ici, "physique.js"), "utf8"))(w);
new Function("window", fs.readFileSync(path.join(ici, "banc.js"), "utf8"))(w);
const B = w.BANC, PH = w.PHYSIQUE;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

console.log("\n  LE BANC D'ESSAI");
console.log("  ═══════════════");

// ═══════════════════════════════ 1. la boucle se referme sur les vrais repères
/* Le contrôle qui vaut tous les autres : on joue les quatre essais du site,
   pour de vrai, et l'on exige que les seuils les déclarent justes. Si l'un
   tombe, soit le moteur a régressé, soit les seuils sont mal réglés — et dans
   les deux cas il faut regarder. */
groupe("Les quatre repères du site passent leur propre verdict");
const essais = B.essais(PH.REPERES);
ok("il y a bien quatre essais", essais.length === 4, 4, essais.length,
   "un zéro voudrait dire que `physique.js` n'expose plus ses repères, "
   + "pas que le banc va bien");
for(const e of essais){
  const v = e.mesure();
  const ec = B.ecart(v, e.theorie);
  ok(e.id + " — mesuré, comparé, jugé", B.verdict(ec) === "ok",
     "juste (écart < " + (B.JUSTE*100) + " %)",
     (ec*100).toFixed(4) + " %   (" + v.toPrecision(7) + " contre " + e.theorie + ")");
}

// ══════════════════════════════════════════ 2. les seuils mordent aux bords
/* Un seuil ne se vérifie qu'en le franchissant, des deux côtés, au millième. */
groupe("Les deux seuils basculent exactement où ils le disent");
{
  const j = B.JUSTE, p = B.PASSABLE;
  ok("juste en dessous du premier seuil", B.verdict(j*0.999) === "ok", "ok", B.verdict(j*0.999));
  ok("au premier seuil, ce n'est déjà plus juste", B.verdict(j) === "bof", "bof", B.verdict(j));
  ok("juste en dessous du second", B.verdict(p*0.999) === "bof", "bof", B.verdict(p*0.999));
  ok("au second seuil, c'est faux", B.verdict(p) === "non", "non", B.verdict(p));
  ok("le premier est bien plus serré que le second", j < p, "JUSTE < PASSABLE",
     j + " < " + p);
}

// ════════════════════════════════════ 3. rien ne passe en douce
/* Un écart qui n'est pas un nombre doit être jugé FAUX, pas « juste ». C'est le
   cas qui se produit quand une mesure explose : sans ce point, un NaN passerait
   au vert, ce qui est exactement le pire verdict possible. */
groupe("Ce qui n'est pas un nombre est faux, jamais juste");
{
  ok("un NaN est faux", B.verdict(NaN) === "non", "non", B.verdict(NaN));
  ok("un infini est faux", B.verdict(Infinity) === "non", "non", B.verdict(Infinity));
  ok("un écart négatif compte en valeur absolue", B.verdict(-0.001) === "ok", "ok", B.verdict(-0.001));
  ok("une théorie nulle ne divise pas par zéro",
     B.ecart(1, 0) === Infinity, "Infinity", B.ecart(1, 0),
     "sans ça l'écart vaudrait NaN et le verdict deviendrait imprévisible");
  ok("une mesure absente est franchement fausse",
     B.verdict(B.ecart(NaN, 2.6)) === "non", "non", B.verdict(B.ecart(NaN, 2.6)));
}

// ═══════════════════════════════════════ 4. les clés, pas les mots
/* Le banc parle deux langues. Ce module n'en connaît aucune : il pose des CLÉS.
   On vérifie qu'elles existent réellement dans les deux fichiers de langue —
   une clé inventée rendrait son propre nom à l'écran, ce qui ne se voit qu'en
   ouvrant la page dans la bonne langue. */
groupe("Chaque clé posée existe dans les deux langues");
{
  const gFr = {}; new Function("window", fs.readFileSync(path.join(ici, "ui.fr.js"), "utf8"))(gFr);
  const fr = Object.assign({}, gFr.UI);
  new Function("window", fs.readFileSync(path.join(ici, "ui.en.js"), "utf8"))(gFr);
  const en = gFr.UI;
  const manquantes = [];
  for(const e of essais)
    for(const cle of [e.nom, e.quoi, e.attendu])
      if(typeof fr[cle] !== "string" || typeof en[cle] !== "string") manquantes.push(cle);
  for(const c of ["ok", "bof", "non"]){
    const cle = "banc.verdict." + c;
    if(typeof fr[cle] !== "string" || typeof en[cle] !== "string") manquantes.push(cle);
  }
  ok("les quinze clés du banc sont traduites des deux côtés", manquantes.length === 0,
     0, manquantes.length + (manquantes.length ? " — " + manquantes.join(", ") : ""));
}

// ═══════════════════════════════════════ 5. cet outil sait échouer
/* Règle 2. On desserre le premier seuil d'un facteur mille dans une copie en
   mémoire : le groupe des bords doit alors tomber. */
groupe("Cet outil sait échouer");
{
  const casse = fs.readFileSync(path.join(ici, "banc.js"), "utf8")
                  .replace("const JUSTE = 0.005", "const JUSTE = 5");
  const g = {}; new Function("window", casse)(g);
  ok("un seuil desserré est vu", g.BANC.verdict(0.5) === "ok",
     "le module cassé déclare « juste » un écart de 50 %", g.BANC.verdict(0.5),
     "si ce point échouait, le groupe des bords ne prouverait rien");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
