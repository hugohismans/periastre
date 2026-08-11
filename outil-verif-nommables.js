/* ============================================================================
   LE DROIT DE NOMMER — `solaire.js`, et surtout son silence

       node outil-verif-nommables.js

   `outil-verif-solaire.js` garde déjà les CHIFFRES du système solaire : il
   reconstruit les demi-grands axes par Kepler et les confronte à ce que la fiche
   publiée affirme. Celui-ci garde autre chose, et c'est la partie qu'aucun autre
   ne regarde : **à partir de quand le site a le droit de nommer une planète.**

   ---------------------------------------------------------------------------
   POURQUOI C'EST UN CONTRÔLE ET PAS UN RÉGLAGE

   Hugo voulait « des tags : ça c'est Jupiter, ça c'est truc ». Depuis le nuage
   de Oort, les huit planètes tiennent dans deux pixels : deux étiquettes y
   pointeraient LE MÊME POINT. Ce n'est pas une imperfection d'affichage, c'est
   une affirmation fausse — « Jupiter est ici » désignant l'endroit où se trouve
   aussi Saturne.

   Le module doit donc SE TAIRE, et se taire est difficile à surveiller : un
   silence est indistinguable d'une fonction cassée. D'où le premier groupe
   ci-dessous, sans lequel tout le reste passerait au vert sur un module mort.

   ---------------------------------------------------------------------------
   D'OÙ VIENT SA VÉRITÉ

   Pas d'un tableau de résultats attendus, qui ne serait qu'une copie de ce que
   le module rend aujourd'hui. Des PROPRIÉTÉS que la réponse doit avoir quoi
   qu'elle vaille :

     · l'invariant, qui est la définition même du droit de nommer — deux
       étiquettes retenues ne sont jamais plus proches que le seuil ;
     · la monotonie — on ne perd pas une étiquette en s'approchant ;
     · le refus de répondre quand on est DEDANS, plutôt qu'un nombre plausible ;
     · et la borne du problème : le nuage de Oort ne nomme rien. C'est le fait
       qui a fait trancher Hugo, et s'il cessait d'être vrai, sa décision aussi.

   Les demi-grands axes, eux, sont confrontés à ceux que `outil-verif-solaire.js`
   a déjà validés contre la fiche — le module ne les porte pas, il les dérive.
   ============================================================================ */

"use strict";
const fs = require("fs");
const w = {};
new Function("window", fs.readFileSync("solaire.js", "utf8"))(w);
const S = w.SOLAIRE;

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

console.log("\n  LE DROIT DE NOMMER");
console.log("  ══════════════════");

titre("Le module est vivant — sans quoi son silence ne prouverait rien");
const pres = S.nommables(300, FOCALE, H);
point("de près, il nomme des planètes", pres.length >= 3,
      "≥ 3 à 300 ua", pres.length + " (" + pres.map(p => p.nom).join(", ") + ")",
      "un module mort se tait partout, et satisferait tout ce qui suit");
point("les demi-grands axes sont ceux du système solaire",
      Math.abs(S.demiGrandAxe("Terre") - 1) < 1e-4 &&
      Math.abs(S.demiGrandAxe("Neptune") - 30.06) < 0.01,
      "Terre ≈ 1 ua, Neptune ≈ 30,06",
      S.demiGrandAxe("Terre").toFixed(6) + " / " + S.demiGrandAxe("Neptune").toFixed(3),
      "dérivés par Kepler, jamais écrits — `outil-verif-solaire.js` les confronte "
      + "en plus à ce que la fiche publiée affirme");

titre("Et il se tait là où il le doit");
for(const d of [10000, 20000, 100000])
  point(`à ${d.toLocaleString("fr-FR")} ua, rien n'est nommable`,
        S.nommables(d, FOCALE, H).length === 0,
        0, S.nommables(d, FOCALE, H).length,
        d === 20000 ? "c'est le fait sur lequel Hugo a tranché le 10 août : depuis "
                    + "le nuage, deux étiquettes pointeraient le même point" : undefined);

titre("L'invariant : deux étiquettes ne se marchent jamais dessus");
let pireEcart = Infinity, ouPire = null;
for(let d = 50; d <= 5000; d *= 1.05){
  const n = S.nommables(d, FOCALE, H);
  for(let i = 1; i < n.length; i++){
    const e = n[i].px - n[i - 1].px;
    if(e < pireEcart){ pireEcart = e; ouPire = d; }
  }
  // et jamais sous le seuil par rapport au Soleil lui-même
  if(n.length && n[0].px < S.ECART_MIN){ pireEcart = n[0].px; ouPire = d; }
}
point("sur tout le domaine, l'écart minimal tient le seuil",
      pireEcart >= S.ECART_MIN,
      "≥ " + S.ECART_MIN + " px", pireEcart.toFixed(2) + " px (à " + Math.round(ouPire) + " ua)",
      "c'est la définition même du droit de nommer, balayée sur 96 distances");

titre("La monotonie : on ne perd pas une étiquette en s'approchant");
let ruptures = 0;
let precedent = 0;
for(let d = 5000; d >= 50; d /= 1.05){
  const n = S.nommables(d, FOCALE, H).length;
  if(n < precedent) ruptures++;
  precedent = n;
}
point("le compte ne redescend jamais quand on approche", ruptures === 0,
      0, ruptures,
      "une scène qui perdrait des noms en s'en approchant serait absurde à l'œil, "
      + "et personne ne saurait dire pourquoi");

titre("Il refuse de répondre plutôt que de répondre faux");
point("dedans, l'écart n'est pas un nombre", Number.isNaN(S.ecartMax("Neptune", 10)),
      "NaN", String(S.ecartMax("Neptune", 10)),
      "à dix unités astronomiques on est À L'INTÉRIEUR de l'orbite de Neptune : "
      + "il n'y a plus d'élongation, et un nombre plausible serait un mensonge");
/* CE POINT M'A REPRIS, ET C'EST POUR ÇA QU'IL EST ÉCRIT COMME ÇA.

   J'avais exigé « rien n'est nommable de là ». Faux, et le contrôle l'a dit :
   depuis dix unités astronomiques, Jupiter s'écarte du Soleil de plus de trente
   degrés. On est dedans pour Neptune, pas pour Jupiter. Le module avait raison,
   mon attente était paresseuse — j'avais confondu « on est à l'intérieur du
   système » et « on est à l'intérieur de CETTE orbite ».

   Ce qu'il faut vraiment exiger, c'est que le refus se PROPAGE : les planètes
   dont on a franchi l'orbite disparaissent de la liste, les autres restent. */
const de10 = S.nommables(10, FOCALE, H).map(p => p.nom);
point("les orbites qu'on a franchies sortent de la liste",
      !de10.includes("Uranus") && !de10.includes("Neptune") && de10.length > 0,
      "ni Uranus ni Neptune, mais pas vide", de10.join(", ") || "vide",
      "le `NaN` du refus doit se propager jusqu'ici — sans quoi on nommerait une "
      + "planète dont on a dépassé l'orbite, ce qui n'a pas de sens");

titre("La distance parlante se cherche, elle ne s'écrit pas");
const dp = S.distanceParlante(FOCALE, H);
point("elle tombe dans le domaine attendu", dp > 100 && dp < 5000,
      "entre 100 et 5 000 ua", Math.round(dp) + " ua",
      "elle dépend du champ de la caméra : un nombre écrit en dur deviendrait "
      + "faux au premier changement d'optique");
point("et elle est bien la frontière", S.nommables(dp * 0.98, FOCALE, H).length > 0 &&
      S.nommables(dp * 1.02, FOCALE, H).length === 0,
      "nommable juste avant, muette juste après",
      S.nommables(dp * 0.98, FOCALE, H).length + " / " + S.nommables(dp * 1.02, FOCALE, H).length);

/* --------------------------------------------------------------------------
   ET CET OUTIL SAIT ÉCHOUER — règle 2, en cassant pour de vrai. */
titre("Cet outil sait échouer");
const casse = (avant, apres) => {
  const v = {};
  new Function("window", fs.readFileSync("solaire.js", "utf8").replace(avant, apres))(v);
  return v.SOLAIRE;
};

const sansSilence = casse("if(p.px < seuil) continue;", "");
point("un module qui cesse de se taire est vu",
      sansSilence.nommables(20000, FOCALE, H).length > 0,
      "des noms au nuage de Oort", sansSilence.nommables(20000, FOCALE, H).length,
      "c'est le défaut que ce fichier existe pour interdire");

const sansEcart = casse("if(derniere && p.px - derniere.px < seuil) continue;", "");
let vuChevauche = false;
for(let d = 50; d <= 5000; d *= 1.05){
  const n = sansEcart.nommables(d, FOCALE, H);
  for(let i = 1; i < n.length; i++) if(n[i].px - n[i-1].px < sansEcart.ECART_MIN) vuChevauche = true;
}
point("deux étiquettes qui se chevauchent sont vues", vuChevauche,
      "l'invariant rompu quelque part", vuChevauche ? "rompu" : "RIEN — l'outil serait aveugle");

const sansNaN = casse("return x >= 1 ? NaN : Math.asin(x);", "return Math.asin(Math.min(1, x));");
point("un module qui répond quand il est dedans est vu",
      !Number.isNaN(sansNaN.ecartMax("Neptune", 10)),
      "un nombre là où il devrait refuser", String(sansNaN.ecartMax("Neptune", 10)));

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
