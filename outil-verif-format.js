/* ============================================================================
   LES DEUX FORMATEURS, ÉPROUVÉS.

       node outil-verif-format.js

   Ils ont déjà menti : le bandeau de lecture a affiché « 2.31 tour ». Deux
   fautes dans trois mots, aucune erreur levée, et rien pour les attraper —
   parce qu'ils vivaient dans la page.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ

   De trois sources qui ne se connaissent pas :

   1. **L'arithmétique.** Une durée reformatée doit valoir ce qu'on lui a donné :
      on relit la sortie et l'on recompose les secondes. C'est le contrôle qui
      attrape un `Math.floor` de travers ou un modulo oublié.
   2. **Les deux langues, lues dans `ui.fr.js` et `ui.en.js`.** Les clés du
      pluriel ne sont pas recopiées ici : on les charge, et l'on exige qu'elles
      existent des deux côtés.
   3. **Les bords eux-mêmes.** Aux deux seuils — quatre-vingt-dix secondes et
      quatre-vingt-dix minutes — on mesure de part et d'autre, à un centième.
      Un seuil ne se vérifie qu'en le franchissant.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ici = __dirname;
const w = {};
new Function("window", fs.readFileSync(path.join(ici, "format.js"), "utf8"))(w);
const F = w.FORMAT;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// Les deux ponctuations, telles que la page les pose.
const vgFr = x => String(x).replace(".", ",");
const vgEn = x => String(x);

console.log("\n  LES DEUX FORMATEURS");
console.log("  ══════════════════");

// ══════════════════════════════════════ 1. la durée dit ce qu'on lui a donné
/* On relit la sortie et l'on recompose les secondes. C'est le seul contrôle qui
   ne suppose rien de la forme : il ne connaît que « ce qui entre doit ressortir ».
   Un `Math.floor` de travers, un modulo oublié, un `padStart` sur la mauvaise
   grandeur — tout se voit ici, et nulle part ailleurs. */
groupe("Une durée reformatée vaut toujours ce qu'on lui a donné");
{
  const relis = txt => {
    let m;
    if((m = txt.match(/^([\d,.]+) s$/)))          return parseFloat(m[1].replace(",", "."));
    if((m = txt.match(/^(\d+) min (\d+) s$/)))    return +m[1]*60 + +m[2];
    if((m = txt.match(/^(\d+) h (\d+) min$/)))    return (+m[1]*60 + +m[2])*60;
    return NaN;
  };
  const CAS = [0, 0.4, 3.7, 9.94, 10, 42, 89.4, 90, 121, 599, 3600, 5399, 5400,
               7322, 86400, 359999];
  let pire = 0, pireCas = null;
  for(const s of CAS){
    const txt = F.temps(s, vgFr);
    const lu = relis(txt);
    if(!Number.isFinite(lu)){ pire = Infinity; pireCas = s + " → « " + txt + " » illisible"; break; }
    /* La tolérance dépend du palier, et de la façon dont il tronque : les
       secondes sont ARRONDIES (0,6 s d'écart au plus), les minutes du palier
       horaire sont PLANCHÉES (jusqu'à 60 s perdues). Mon premier jet exigeait
       31 s là où la troncature en perd 59 — c'était le seuil qui était faux,
       pas le module. */
    const tol = s < 90 ? (s < 10 ? 0.06 : 0.6) : (Math.floor(s/60) < 90 ? 0.6 : 60);
    const ecart = Math.abs(lu - s);
    if(ecart/Math.max(tol, 1e-9) > pire/Math.max(tol, 1e-9) || pireCas === null){
      if(ecart > tol){ pire = ecart; pireCas = s + " → « " + txt + " » relu " + lu; }
    }
  }
  ok("seize durées se relisent sans perte", pireCas === null || pire === 0,
     "chacune dans la tolérance de son palier", pireCas || "toutes justes",
     "on ne vérifie pas la forme, on vérifie que l'information survit");
}

// ══════════════════════════════════════════════ 2. les seuils, des deux côtés
/* Un seuil ne se vérifie qu'en le FRANCHISSANT. On mesure donc à un centième
   de part et d'autre : c'est là, et seulement là, qu'une inégalité stricte se
   distingue d'une inégalité large. */
groupe("Les deux seuils basculent au bon endroit");
{
  ok("89,99 s reste en secondes", /s$/.test(F.temps(89.99, vgFr)) && !/min/.test(F.temps(89.99, vgFr)),
     "des secondes", F.temps(89.99, vgFr));
  ok("90 s passe en minutes", /min/.test(F.temps(90, vgFr)), "des minutes", F.temps(90, vgFr));
  const t89 = F.temps(89.9*60, vgFr), t90 = F.temps(90*60, vgFr);
  ok("89,9 min reste en minutes", /min/.test(t89) && !/h/.test(t89), "des minutes", t89);
  ok("90 min passe en heures", /h/.test(t90), "des heures", t90);
  ok("sous dix secondes, la décimale apparaît", /,\d/.test(F.temps(3.7, vgFr)),
     "un chiffre après la virgule", F.temps(3.7, vgFr),
     "au-dessus de dix, elle disparaît : « 42 s » et non « 42,0 s »");
  ok("au-dessus de dix, elle disparaît", !/[.,]\d/.test(F.temps(42, vgFr)),
     "aucune décimale", F.temps(42, vgFr));
}

// ═══════════════════════════════════════ 3. la ponctuation suit la langue
groupe("La décimale suit la langue, jamais un `replace` en dur");
{
  ok("en français, une virgule", F.temps(3.7, vgFr).includes(","), "3,7 s", F.temps(3.7, vgFr));
  ok("en anglais, un point", F.temps(3.7, vgEn).includes("."), "3.7 s", F.temps(3.7, vgEn));
  ok("le module ne décide pas tout seul",
     F.temps(3.7, vgFr) !== F.temps(3.7, vgEn),
     "deux sorties différentes", F.temps(3.7, vgFr) + " / " + F.temps(3.7, vgEn),
     "s'il ponctuait lui-même, la langue n'aurait aucune prise — et c'est "
     + "exactement la faute qui a donné « 2.31 tour » en français");
}

// ═══════════════════════════════════════════════ 4. le pluriel part de DEUX
/* La faute d'origine, en entier : « 2.31 tour ». On vérifie donc le seuil, et
   surtout qu'il est à deux et non à un — c'est la règle du français comme de
   l'anglais pour une valeur décimale. */
groupe("Le pluriel part de deux, pas de un");
{
  const cle = n => F.tours(n, vgFr, c => c);   // le T rend la clé : on la lit
  ok("1,00 tour est au singulier", cle(1).endsWith("lecture.tour.un"), "…tour.un", cle(1));
  ok("1,80 tour est encore au singulier", cle(1.8).endsWith("lecture.tour.un"), "…tour.un", cle(1.8));
  ok("1,99 aussi", cle(1.99).endsWith("lecture.tour.un"), "…tour.un", cle(1.99));
  ok("2,00 bascule au pluriel", cle(2).endsWith("lecture.tour.pl"), "…tour.pl", cle(2));
  ok("2,31 est au pluriel — la faute d'origine",
     cle(2.31).endsWith("lecture.tour.pl") && cle(2.31).startsWith("2,31"),
     "2,31 …tour.pl", cle(2.31),
     "le bandeau affichait « 2.31 tour » : point décimal ET singulier");
}

// ══════════════════════════ 5. les deux langues portent bien les deux clés
/* On ne recopie pas les mots ici : on les charge. Une clé absente d'une des deux
   langues rendrait son propre nom à l'écran — visible, mais seulement pour qui
   ouvre la page dans cette langue-là. */
groupe("Les deux clés existent dans les deux langues");
{
  /* `ui.en.js` fait `Object.assign(window.UI, …)` : il SURCHARGE le français,
     il ne le remplace pas. Le charger dans un faux `window` vide explose — mon
     premier jet est tombé là-dessus. On charge donc le français d'abord, puis
     l'anglais par-dessus, exactement comme la page le fait. */
  const gFr = {}; new Function("window", fs.readFileSync(path.join(ici, "ui.fr.js"), "utf8"))(gFr);
  const fr = Object.assign({}, gFr.UI);
  new Function("window", fs.readFileSync(path.join(ici, "ui.en.js"), "utf8"))(gFr);
  const en = gFr.UI;
  for(const cle of ["lecture.tour.un", "lecture.tour.pl"]){
    ok(cle + " existe en français", typeof fr[cle] === "string", "une chaîne", fr[cle]);
    ok(cle + " existe en anglais", typeof en[cle] === "string", "une chaîne", en[cle]);
  }
  ok("et le singulier diffère du pluriel en français", fr["lecture.tour.un"] !== fr["lecture.tour.pl"],
     "deux mots distincts", fr["lecture.tour.un"] + " / " + fr["lecture.tour.pl"],
     "s'ils étaient identiques, tout ce groupe passerait sans rien prouver");
}

// ═══════════════════════════════════════ 6. l'outil sait échouer
/* Règle 2. On rejoue le module avec le seuil du pluriel déplacé de deux à un —
   la faute exacte d'origine — et l'on exige que le groupe 4 tombe. */
groupe("Cet outil sait échouer");
{
  const casse = fs.readFileSync(path.join(ici, "format.js"), "utf8")
                  .replace("n >= 2 ? \"lecture.tour.pl\"", "n >= 1 ? \"lecture.tour.pl\"");
  const g = {}; new Function("window", casse)(g);
  const avec1 = g.FORMAT.tours(1.8, vgFr, c => c);
  ok("un seuil de pluriel déplacé est vu", avec1.endsWith("lecture.tour.pl"),
     "le module cassé met 1,80 au pluriel", avec1,
     "si ce point échouait, le groupe du pluriel ne prouverait rien");
  const casse2 = fs.readFileSync(path.join(ici, "format.js"), "utf8")
                   .replace("if(s < 90)", "if(s < 900)");
  const g2 = {}; new Function("window", casse2)(g2);
  ok("un seuil de durée déplacé est vu", /s$/.test(g2.FORMAT.temps(300, vgFr)),
     "le module cassé garde 300 en secondes", g2.FORMAT.temps(300, vgFr));
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
