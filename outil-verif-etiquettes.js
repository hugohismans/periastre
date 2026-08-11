/* ============================================================================
   LES ÉTIQUETTES — ET D'ABORD LEUR SILENCE

       node outil-verif-etiquettes.js

   ---------------------------------------------------------------------------
   CE QU'IL Y A DE DIFFICILE À SURVEILLER ICI

   Un silence est indistinguable d'une fonction morte. Ce fichier surveille un
   module dont la commande principale est de ne rien rendre : sans le premier
   groupe, tout ce qui suit passerait au vert sur un `return []` en première
   ligne. C'est la même précaution qu'`outil-verif-nommables.js`, et pour la
   même raison — les deux gardent la même décision, vue de deux côtés.

   ---------------------------------------------------------------------------
   D'OÙ VIENT SA VÉRITÉ — RÈGLE 3

   Pas d'un tableau de placements attendus, qui ne serait qu'une photographie de
   ce que le module rend aujourd'hui. De trois sources qui lui sont extérieures :

     · `solaire.js`, déjà gardé par ses quatorze contrôles, et qui répond à la
       MÊME question sur le cas particulier des planètes rangées sur une ligne.
       Les deux doivent tomber d'accord partout — c'est le contrôle central de
       ce fichier, et c'est la règle 4 : une seule loi pour une même décision ;

     · des propriétés que la réponse doit avoir quoi qu'elle vaille — l'écart
       jamais rompu, la monotonie, l'absence de mémoire d'un appel à l'autre ;

     · le défaut du 9 août, reproduit tel quel : un point derrière le plan de
       coupure rabattu au centre de l'image.

   ---------------------------------------------------------------------------
   ET IL SAIT ÉCHOUER — RÈGLE 2

   Cinq sabotages, joués sur le vrai fichier, chacun rejouant un défaut qu'on
   peut vraiment écrire. Un test qui n'échoue jamais ne teste rien.
   ============================================================================ */

"use strict";
const fs = require("fs");

const w = {};
new Function("window", fs.readFileSync("etiquettes.js", "utf8"))(w);
const E = w.ETIQUETTES;

const ws = {};
new Function("window", fs.readFileSync("solaire.js", "utf8"))(ws);
const S = ws.SOLAIRE;

const FOCALE = 1.55;      // celle de `camera.js` — le champ réel du site
const H = 1080;

let echecs = 0, total = 0;
function point(nom, ok, attendu, mesure, note){
  total++; if(!ok) echecs++;
  console.log(`  ${ok ? "✅" : "❌"}  ${nom}`);
  if(attendu !== undefined) console.log(`        attendu ${attendu}   mesuré ${mesure}`);
  if(note) console.log(`        ${note}`);
}
function titre(t){ console.log(`\n  ${t}\n  ${"─".repeat(t.length)}`); }

console.log("\n  LES ÉTIQUETTES");
console.log("  ══════════════");

/* Le cadre de l'épreuve d'équivalence est VOLONTAIREMENT plus large qu'un
   écran : on y éprouve la règle d'écartement seule, et un bord qui viendrait
   tailler la liste mêlerait deux causes. La règle du cadre a son propre groupe,
   plus bas, sur une image de vraie taille. */
const LARGE = { W: 20000, H };
const CX = 10000, CY = H / 2;

/* Les points de la scène solaire, tels que la page les fabrique : le Soleil au
   centre, chaque planète sur une ligne à son écart maximal. Le Soleil est une
   étiquette comme les autres, et c'est tout l'intérêt — c'est ce qui fait que
   « assez loin du Soleil » n'a pas besoin d'être une règle en plus. */
function pointsSolaires(dUa, cx, cy, h){
  const pts = [{ cle: "Soleil", ecran: [cx, cy], rang: 0 }];
  S.ORDRE.forEach((nom, i) => {
    pts.push({ cle: nom, ecran: [cx + S.enPixels(nom, dUa, FOCALE, h), cy], rang: i + 1 });
  });
  return pts;
}

const REGLAGE = { ecartMin: S.ECART_MIN };

titre("Le module est vivant — sans quoi son silence ne prouverait rien");
const pres = E.placements(pointsSolaires(200, CX, CY, H), LARGE, REGLAGE);
point("de près, il pose des étiquettes", pres.length >= 5,
      "≥ 5 à 200 ua (le Soleil et quatre planètes)",
      pres.length + " (" + pres.map(p => p.cle).join(", ") + ")",
      "un module qui rendrait toujours la liste vide satisferait tout ce qui suit");
point("et il rend un placement complet", pres.length > 0 &&
      Number.isFinite(pres[0].x) && Number.isFinite(pres[0].y) &&
      (pres[0].ancre === "droite" || pres[0].ancre === "gauche"),
      "x, y finis et une ancre nommée",
      pres.length ? `${pres[0].x}, ${pres[0].y}, ${pres[0].ancre}` : "rien");

titre("Il se tait là où il le doit");
point("depuis le nuage de Oort, seul le Soleil parle",
      E.placements(pointsSolaires(20000, CX, CY, H), LARGE, REGLAGE)
       .filter(p => p.cle !== "Soleil").length === 0,
      "aucune planète nommée",
      E.placements(pointsSolaires(20000, CX, CY, H), LARGE, REGLAGE)
       .filter(p => p.cle !== "Soleil").length,
      "c'est le fait sur lequel Hugo a tranché le 10 août : huit planètes dans "
      + "deux pixels, deux étiquettes y pointeraient le même endroit");

/* LE DÉFAUT DU 9 AOÛT, REPRODUIT TEL QUEL.

   `CAMERA.projette` rend `null` derrière le plan de coupure. Le lire comme une
   coordonnée ramène l'objet au centre de l'image, et l'on voit alors le trou
   noir suivre le regard. Ici ce serait pire : une étiquette apparaîtrait au
   milieu de l'écran en désignant quelque chose qui est dans le dos. */
const avecDos = [
  { cle: "devant",  ecran: [CX, CY],  rang: 0 },
  { cle: "derriere", ecran: null,     rang: 1 },
  { cle: "cassé",   ecran: [NaN, CY], rang: 2 },
  { cle: "creux",   ecran: [CX + 400],rang: 3 },
];
const vusDos = E.placements(avecDos, LARGE, REGLAGE).map(p => p.cle);
point("un point derrière soi ne devient pas une étiquette au centre",
      vusDos.length === 1 && vusDos[0] === "devant",
      "« devant » seul", vusDos.join(", ") || "rien",
      "`null` n'est pas (0, 0) — le rabattement au centre ÉTAIT le défaut du 9 août");

point("sans seuil d'écartement, il ne place rien du tout",
      E.placements(pointsSolaires(200, CX, CY, H), LARGE, {}).length === 0 &&
      E.placements(pointsSolaires(200, CX, CY, H), LARGE, { ecartMin: 0 }).length === 0,
      "0 et 0",
      E.placements(pointsSolaires(200, CX, CY, H), LARGE, {}).length + " et " +
      E.placements(pointsSolaires(200, CX, CY, H), LARGE, { ecartMin: 0 }).length,
      "le seuil se dérive de la typographie, ailleurs. Un repli écrit ici serait "
      + "un second endroit où se décide une même chose");

titre("Une seule loi — le module et `solaire.js` répondent la même chose");
/* LE CONTRÔLE CENTRAL. `solaire.js` décide du droit de nommer avec DEUX tests —
   assez loin du Soleil, assez loin de la dernière retenue. Ce module n'en a
   qu'un, le Soleil n'étant qu'une étiquette de plus. Si les deux ne rendaient
   pas exactement la même liste, il y aurait deux lois pour une même décision,
   et l'écart se verrait un jour à l'écran sans qu'on sache le nommer. */
let desaccords = 0, ouPremier = null, detail = "";
let nDistances = 0, cumul = 0;
for(let d = 30; d <= 30000; d *= 1.1){
  nDistances++;
  const attendu = S.nommables(d, FOCALE, H).map(p => p.nom).join("|");
  const obtenu  = E.placements(pointsSolaires(d, CX, CY, H), LARGE, REGLAGE)
                   .filter(p => p.cle !== "Soleil").map(p => p.cle).join("|");
  cumul += obtenu ? obtenu.split("|").length : 0;
  if(attendu !== obtenu){
    desaccords++;
    if(ouPremier === null){ ouPremier = d; detail = `[${attendu}] vs [${obtenu}]`; }
  }
}
point(`les deux tombent d'accord sur ${nDistances} distances`, desaccords === 0,
      "0 désaccord", desaccords + (ouPremier ? ` (à ${Math.round(ouPremier)} ua : ${detail})` : ""),
      "de 30 à 30 000 ua. C'est la règle 4 : entre deux objets qui décrivent le "
      + "même espace, une seule loi");
point("et l'accord n'est pas un accord sur le vide", cumul > 100,
      "> 100 étiquettes cumulées", cumul,
      "deux modules muets seraient d'accord partout, et ne prouveraient rien");

titre("L'invariant : deux étiquettes ne se marchent jamais dessus");
let pire = Infinity, ouPire = null;
for(let d = 30; d <= 30000; d *= 1.1){
  const p = E.placements(pointsSolaires(d, CX, CY, H), LARGE, REGLAGE);
  for(let i = 0; i < p.length; i++) for(let j = i + 1; j < p.length; j++){
    const e = Math.hypot(p[i].px - p[j].px, p[i].py - p[j].py);
    if(e < pire){ pire = e; ouPire = d; }
  }
}
point("sur tout le domaine, l'écart minimal tient le seuil", pire >= S.ECART_MIN,
      "≥ " + S.ECART_MIN + " px", pire.toFixed(2) + " px (à " + Math.round(ouPire) + " ua)",
      "c'est la définition même du droit de nommer");

/* ET IL FAUT LE VÉRIFIER HORS DE LA LIGNE — sur une ligne, « comparer à la
   dernière retenue » et « comparer à toutes » reviennent au même, et un module
   qui ne ferait que la première passerait tout ce qui précède. */
const enVrac = [];
for(let i = 0; i < 120; i++){
  /* Un semis SERRÉ, dans un carré de cent soixante pixels de côté : il faut que
     beaucoup de points se disputent la place, sinon la règle ne mord jamais et
     le sabotage d'en bas ne prouverait rien. Les deux pas sont premiers avec le
     côté et différents l'un de l'autre, donc le semis ne retombe pas sur une
     droite ; les rangs sont mêlés exprès, pour que l'ordre de passage ne suive
     pas la géométrie. */
  enVrac.push({ cle: "p" + i, rang: (i * 47) % 120,
                ecran: [CX - 80 + (i * 97) % 160, CY - 80 + (i * 37) % 160] });
}
const posesVrac = E.placements(enVrac, LARGE, REGLAGE);
let pireVrac = Infinity;
for(let i = 0; i < posesVrac.length; i++) for(let j = i + 1; j < posesVrac.length; j++)
  pireVrac = Math.min(pireVrac, Math.hypot(posesVrac[i].px - posesVrac[j].px,
                                           posesVrac[i].py - posesVrac[j].py));
point("hors de la ligne aussi, sur cent vingt points serrés",
      posesVrac.length >= 4 && posesVrac.length < enVrac.length && pireVrac >= S.ECART_MIN,
      "entre 4 et " + (enVrac.length - 1) + " posées, écart ≥ " + S.ECART_MIN,
      posesVrac.length + " posées, écart " + pireVrac.toFixed(2),
      "c'est ici que « comparer à toutes les retenues » se distingue de "
      + "« comparer à la dernière » — sur une ligne les deux sont indiscernables. "
      + "Et il faut que la règle MORDE : un semis assez clairsemé pour que tout "
      + "passe ne prouverait rien du tout");

titre("La monotonie : on ne perd pas une étiquette en s'approchant");
let ruptures = 0, precedent = 0;
for(let d = 30000; d >= 30; d /= 1.1){
  const n = E.placements(pointsSolaires(d, CX, CY, H), LARGE, REGLAGE).length;
  if(n < precedent) ruptures++;
  precedent = n;
}
point("le compte ne redescend jamais quand on tombe", ruptures === 0, 0, ruptures,
      "une scène qui perdrait des noms en s'en approchant serait absurde à l'œil, "
      + "et c'est exactement le mouvement qu'Hugo a demandé le 10 août");

titre("Le cadre — une étiquette clouée au bord désigne le bord");
const ECRAN = { W: 1920, H: 1080 };
const auBord = [
  { cle: "dedans",  ecran: [960, 540],  rang: 0 },
  { cle: "dehors-d", ecran: [1960, 540], rang: 1 },
  { cle: "dehors-g", ecran: [-40, 540],  rang: 2 },
  { cle: "dehors-h", ecran: [960, -10],  rang: 3 },
  { cle: "sur-marge", ecran: [1915, 300], rang: 4 },
];
const vusBord = E.placements(auBord, ECRAN, { ecartMin: 12, marge: 10 }).map(p => p.cle);
point("ce qui sort de l'image ne parle pas",
      vusBord.length === 1 && vusBord[0] === "dedans",
      "« dedans » seul", vusBord.join(", ") || "rien",
      "la marge de dix pixels emporte aussi celle qui touche le bord");

const colle = E.placements([{ cle:"a", ecran:[1900, 540], rang:0 }], ECRAN,
                           { ecartMin: 12, decalage: 40 });
point("près du bord droit, le texte s'étale vers la gauche",
      colle.length === 1 && colle[0].ancre === "gauche" && colle[0].x === 1860,
      "ancre gauche, x = 1860",
      colle.length ? colle[0].ancre + ", x = " + colle[0].x : "rien",
      "sinon on tairait une étiquette pour en afficher une illisible");

titre("Il n'a pas de mémoire — règle 5, l'état d'où l'on mesure");
const a1 = JSON.stringify(E.placements(pointsSolaires(300, CX, CY, H), LARGE, REGLAGE));
E.placements(pointsSolaires(20000, CX, CY, H), LARGE, REGLAGE);
E.placements(enVrac, LARGE, REGLAGE);
const a2 = JSON.stringify(E.placements(pointsSolaires(300, CX, CY, H), LARGE, REGLAGE));
point("la même entrée rend la même sortie, quoi qu'on ait demandé entre-temps",
      a1 === a2, "identique", a1 === a2 ? "identique" : "DIFFÉRENT",
      "un état retenu d'un appel à l'autre ferait clignoter les étiquettes au "
      + "bord du seuil, et rien ne le dirait");
point("et `combien` compte ce que `placements` pose",
      E.combien(pointsSolaires(300, CX, CY, H), LARGE, REGLAGE) ===
      E.placements(pointsSolaires(300, CX, CY, H), LARGE, REGLAGE).length,
      "les deux d'accord", "les deux d'accord");

/* --------------------------------------------------------------------------
   ET CET OUTIL SAIT ÉCHOUER — règle 2, en cassant pour de vrai. */
titre("Cet outil sait échouer");
const src = fs.readFileSync("etiquettes.js", "utf8");
/* Chaque sabotage est une suite de remplacements, et l'on EXIGE que chacun
   morde. Sans ce refus, un jour où le texte visé aurait bougé d'un espace, le
   sabotage ne changerait plus rien — et l'outil déclarerait fièrement qu'il
   sait échouer en jouant le module intact. */
function casse(...paires){
  let texte = src;
  for(const [avant, apres] of paires){
    if(!texte.includes(avant))
      throw new Error("le sabotage ne mord plus : " + avant.slice(0, 60));
    texte = texte.replace(avant, apres);
  }
  const v = {};
  new Function("window", texte)(v);
  return v.ETIQUETTES;
}

const sansSilence = casse(
  ["if(!(Number.isFinite(ecartMin) && ecartMin > 0)) return [];",
   "if(!(Number.isFinite(ecartMin) && ecartMin > 0)) return placements(points, vue, { ecartMin: 12 });"]);
point("un module qui se donne un seuil de repli est vu",
      sansSilence.placements(pointsSolaires(200, CX, CY, H), LARGE, {}).length > 0,
      "des étiquettes sans seuil donné",
      sansSilence.placements(pointsSolaires(200, CX, CY, H), LARGE, {}).length);

const sansEcart = casse(["if(Math.hypot(c.px - g.px, c.py - g.py) < ecartMin){ libre = false; break; }",
                         "if(false){ libre = false; break; }"]);
let vuChevauche = false;
for(let d = 30; d <= 30000; d *= 1.1){
  const p = sansEcart.placements(pointsSolaires(d, CX, CY, H), LARGE, REGLAGE);
  for(let i = 1; i < p.length; i++)
    if(Math.abs(p[i].px - p[i-1].px) < S.ECART_MIN) vuChevauche = true;
}
point("deux étiquettes qui se chevauchent sont vues", vuChevauche,
      "l'invariant rompu quelque part",
      vuChevauche ? "rompu" : "RIEN — l'outil serait aveugle");

/* Le sabotage qui remet le défaut du 9 août : `null` lu comme un centre. */
const rabat = casse(
  ["const px = p.ecran[0], py = p.ecran[1];",
   "const px = (p.ecran && p.ecran[0]) || vue.W/2, py = (p.ecran && p.ecran[1]) || vue.H/2;"],
  ["if(!p || !utilisable(p.ecran)) continue;", "if(!p) continue;"]);
point("un point du dos rabattu au centre est vu",
      rabat.placements(avecDos, LARGE, REGLAGE).length > 1,
      "plus d'une étiquette", rabat.placements(avecDos, LARGE, REGLAGE).length,
      "c'est le défaut du 9 août remis en place — il doit rougir");

const sansCadre = casse(["return x >= marge && x <= vue.W - marge && y >= marge && y <= vue.H - marge;",
                         "return true;"]);
point("une étiquette hors de l'image est vue",
      sansCadre.placements(auBord, ECRAN, { ecartMin: 12, marge: 10 }).length > 1,
      "plus d'une étiquette", sansCadre.placements(auBord, ECRAN, { ecartMin: 12, marge: 10 }).length);

/* LE SABOTAGE QUI COMPTE LE PLUS, et le seul que la ligne ne voit pas : ne
   comparer qu'à la DERNIÈRE retenue. Sur les planètes, tout resterait vert. */
const surLaDerniere = casse(
  ["for(const g of gardees){\n"
   + "      if(Math.hypot(c.px - g.px, c.py - g.py) < ecartMin){ libre = false; break; }\n"
   + "    }",
   "const g = gardees[gardees.length - 1];\n"
   + "    if(g && Math.hypot(c.px - g.px, c.py - g.py) < ecartMin) libre = false;"]);
const solairesEncoreBons = (() => {
  for(let d = 30; d <= 30000; d *= 1.1){
    const a = S.nommables(d, FOCALE, H).map(p => p.nom).join("|");
    const b = surLaDerniere.placements(pointsSolaires(d, CX, CY, H), LARGE, REGLAGE)
                           .filter(p => p.cle !== "Soleil").map(p => p.cle).join("|");
    if(a !== b) return false;
  }
  return true;
})();
const vracCasse = (() => {
  const p = surLaDerniere.placements(enVrac, LARGE, REGLAGE);
  for(let i = 0; i < p.length; i++) for(let j = i + 1; j < p.length; j++)
    if(Math.hypot(p[i].px - p[j].px, p[i].py - p[j].py) < S.ECART_MIN) return true;
  return false;
})();
point("comparer à la seule dernière retenue est vu — mais PAS par les planètes",
      vracCasse && solairesEncoreBons,
      "le vrac rougit, la ligne reste verte",
      "vrac " + (vracCasse ? "rougit" : "MUET") + ", ligne " +
      (solairesEncoreBons ? "verte" : "rougit"),
      "c'est la raison d'être des soixante points en vrac : sans eux, ce défaut "
      + "traverserait tout ce fichier sans être vu");

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
