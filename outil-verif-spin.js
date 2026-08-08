/* ============================================================================
   LA ROTATION DU TROU NOIR D'ÉTUDE, SANS NAVIGATEUR.

       node outil-verif-spin.js

   Hugo a demandé le 9 août que la rotation devienne un curseur continu au lieu
   de quatre boutons. Le risque d'un continuum n'est pas le curseur — c'est ce
   qui se trouve AUX BORDS et ENTRE les anciennes valeurs.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ

   1. LES QUATRE ANCIENNES VALEURS. Elles étaient posées à l'œil et documentées :
      0 · 0,6 · 0,9 · 0,95. Poser le curseur sur l'une d'elles doit retrouver
      EXACTEMENT la note qu'elle affichait avant. C'est le contrôle qui garantit
      qu'on n'a rien perdu en changeant la forme du réglage.

   2. `kerr.js`, chargé pour de vrai. La borne à 0,998 n'a de sens que si les
      formules fermées de Bardeen, Press & Teukolsky y répondent encore : on
      vérifie que l'ISCO et l'horizon restent finis, ordonnés et décroissants sur
      toute la plage offerte. Un curseur qui mène à un `NaN` éteindrait l'image
      sans un mot — c'est le mode de panne du nuanceur.

   3. LA MONOTONIE, qui est le fait physique : plus le trou noir tourne, plus la
      dernière orbite stable descend. Si le curseur pouvait la faire remonter,
      il montrerait le contraire de ce que le site enseigne.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const faux = {};
new Function("window", fs.readFileSync(path.join(ICI, "spin.js"), "utf8"))(faux);
const S = faux.SPIN;

const gk = {};
new Function("window", fs.readFileSync(path.join(ICI, "kerr.js"), "utf8"))(gk);
const K = gk.KERR;

console.log("\n  LA ROTATION DU TROU NOIR D'ÉTUDE");
console.log("  ════════════════════════════════");

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// ══════════════════════════════ 1. les quatre valeurs d'avant
groupe("Les quatre anciennes valeurs retrouvent leur note");
{
  /* C'est le contrôle qui dit qu'on n'a rien perdu en passant du bouton au
     curseur. Les notes sont écrites, sourcées et traduites : les réécrire parce
     que le réglage change de forme serait refaire un travail déjà relu. */
  const AVANT = [
    [0,    "panneau.spin.aucune.note"],
    [0.6,  "panneau.spin.moderee.note"],
    [0.9,  "panneau.spin.rapide.note"],
    [0.95, "panneau.spin.extreme.note"],
  ];
  for(const [v, cle] of AVANT)
    ok("spin " + v + " → sa note d'origine", S.bande(v).cle === cle, cle, S.bande(v).cle);

  ok("et les quatre tombent dans quatre bandes distinctes",
     new Set(AVANT.map(([v]) => S.bande(v).i)).size === 4, 4,
     new Set(AVANT.map(([v]) => S.bande(v).i)).size,
     "si deux partageaient une bande, le curseur aurait perdu une nuance que "
     + "les boutons portaient");
}

// ══════════════════════════════ 2. les bornes
groupe("Rien ne sort de [0 ; 0,998]");
{
  ok("la borne haute est celle de Thorne", S.MAX === 0.998, 0.998, S.MAX,
     "au-delà, un disque d'accrétion ne peut plus accélérer son trou noir : le "
     + "rayonnement qu'il émet le freine autant qu'il le pousse (Thorne 1974)");

  /* `Infinity` RETOMBE À ZÉRO, et non au maximum — j'avais écrit l'inverse.

     Le module teste la finitude AVANT de borner, donc un infini n'est pas
     « très grand » mais « pas un nombre », et il retombe sur l'état neutre.
     C'est le bon choix, et c'est celui que `progression.js` a fait le 9 août
     pour la même raison : `1e400` est du JSON valide, une mémoire abîmée en
     contient, et le remède est de revenir au défaut plutôt que de pousser un
     réglage à fond. Mon attente était fausse, pas le module. */
  const absurdes = [[-1, 0], [-0.0001, 0], [1, S.MAX], [42, S.MAX],
                    [NaN, 0], [Infinity, 0], [-Infinity, 0],
                    ["0.5", 0.5], ["", 0], [null, 0], [undefined, 0], [{}, 0]];
  let coupable = null;
  for(const [e, a] of absurdes){
    const r = S.borne(e);
    if(r !== a) coupable = String(e) + " → " + r + " au lieu de " + a;
  }
  ok("douze entrées absurdes sont ramenées dans les bornes", coupable === null,
     "toutes bornées", coupable || "toutes bornées",
     "une mémoire d'il y a six mois, un curseur qui arrondit autrement, un NaN — "
     + "aucun ne doit pouvoir sortir d'ici");

  ok("un infini retombe sur « aucune rotation », pas sur le maximum",
     S.borne(Infinity) === 0, 0, S.borne(Infinity),
     "`1e400` est du JSON valide : une mémoire abîmée en contient, et pousser "
     + "le réglage à fond serait le pire des deux choix");
}

// ══════════════════════════════ 3. zéro est à part
groupe("Zéro est une bande à lui seul");
{
  ok("zéro n'est pas dans la bande de 0,001", S.bande(0).i !== S.bande(0.001).i,
     "deux bandes", S.bande(0).i + " et " + S.bande(0.001).i,
     "« aucune rotation » n'est pas le bas d'un continuum : pas de couture, pas "
     + "d'entraînement, la métrique redevient celle de Schwarzschild");
  ok("et la note de zéro est bien celle d'« aucune »",
     S.bande(0).cle === "panneau.spin.aucune.note",
     "panneau.spin.aucune.note", S.bande(0).cle);
}

// ══════════════════════════════ 4. la physique tient sur toute la plage
groupe("Kerr répond encore à 0,998 — la vérité vient de `kerr.js`");
{
  const M = 0.5;                       // même échelle que la page : r_s = 2M = 1
  let mauvais = null, remonte = null, precedent = Infinity;
  for(let i = 0; i <= 998; i++){
    const a = S.borne(i / 1000) * M;
    const isco = K.rIsco(a, true);
    const horizon = M * (1 + Math.sqrt(Math.max(0, 1 - (a/M)*(a/M))));
    if(!Number.isFinite(isco) || !Number.isFinite(horizon) || isco < horizon)
      mauvais = mauvais || { spin: i/1000, isco, horizon };
    if(isco > precedent + 1e-12) remonte = remonte || { spin: i/1000, isco, precedent };
    precedent = isco;
  }
  ok("l'ISCO et l'horizon restent finis et ordonnés — 999 valeurs",
     mauvais === null, "aucun défaut", mauvais ? JSON.stringify(mauvais) : "aucun",
     "un NaN dans le nuanceur éteint l'image sans un mot : c'est son mode de panne");

  ok("et l'ISBLE descend toujours quand la rotation monte",
     remonte === null, "strictement décroissant",
     remonte ? JSON.stringify(remonte) : "décroissant partout",
     "c'est le FAIT que la scène enseigne : plus il tourne, plus la matière peut "
     + "descendre. Un curseur qui le ferait remonter montrerait le contraire");

  const bas = K.rIsco(0, true), haut = K.rIsco(S.MAX * M, true);
  ok("et l'écart se voit : l'ISCO passe de 3 à moins de 1,3 rayon",
     Math.abs(bas - 3) < 1e-9 && haut < 1.3, "3 → < 1,3",
     bas.toFixed(3) + " → " + haut.toFixed(3),
     "c'est ce resserrement qu'Hugo veut pouvoir balayer au doigt");
}

// ══════════════════════════════ 5. le descripteur
groupe("Ce que la page peint");
{
  const d = S.descripteur(0.9);
  ok("le texte a trois décimales, comme le pas", d.texte === "0.900",
     "0.900", d.texte,
     "en afficher moins ferait croire que le curseur saute");
  ok("et la valeur est bornée avant d'être écrite",
     S.descripteur(5).texte === S.MAX.toFixed(3), S.MAX.toFixed(3),
     S.descripteur(5).texte);
  ok("le pas divise la plage en un nombre entier de crans",
     Math.abs(S.MAX / S.PAS - Math.round(S.MAX / S.PAS)) < 1e-9,
     "entier", (S.MAX / S.PAS).toFixed(4),
     "sinon la borne haute est injoignable au curseur, et le maximum affiché "
     + "n'est pas celui qu'on peut atteindre");
}

// ══════════════════════════════ 6. et ces contrôles savent tomber
groupe("Et ces contrôles savent tomber");
{
  const bac = sup => Object.assign({}, S, sup);

  // Zéro fondu dans la première bande — le défaut le plus facile à commettre.
  const sansZero = bac({ bande: v => ({ i: 1, cle: "panneau.spin.moderee.note" }) });
  ok("une bande qui avale zéro est vue",
     sansZero.bande(0).cle !== "panneau.spin.aucune.note", "vue",
     sansZero.bande(0).cle === "panneau.spin.aucune.note" ? "PASSÉE INAPERÇUE" : "vue");

  // Une borne qui ne borne pas.
  const sansBorne = bac({ borne: v => Number(v) });
  ok("une borne qui laisse passer 42 est vue",
     sansBorne.borne(42) !== S.MAX, "vue",
     sansBorne.borne(42) === S.MAX ? "PASSÉE INAPERÇUE" : "vue");

  // Un pas qui ne divise pas la plage.
  const pasFaux = 0.003;
  ok("un pas qui ne divise pas la plage est vu",
     Math.abs(S.MAX / pasFaux - Math.round(S.MAX / pasFaux)) > 1e-9, "vu",
     (S.MAX / pasFaux).toFixed(4));
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
