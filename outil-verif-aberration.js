/* ============================================================================
   L'ABERRATION — SANS NAVIGATEUR.

       node outil-verif-aberration.js

   D'OÙ VIENT LA VÉRITÉ ICI. Pas du module : de la physique, sous trois formes
   indépendantes.

   1. DES CAS CONNUS. Au repos, rien ne bouge. Vers l'avant et vers l'arrière,
      rien ne bouge non plus — ce sont les deux points fixes de la
      transformation, et ils sont fixes quelle que soit la vitesse.

   2. DE LA RÉCIPROCITÉ. `versBord` et `versCiel` doivent se défaire l'une
      l'autre. C'est le contrôle qui attrape l'erreur de signe — celle qui
      donnerait un ciel se resserrant DERRIÈRE, et que personne ne verrait en
      regardant l'image, puisqu'un ciel resserré quelque part reste un ciel
      resserré.

   3. DES INVARIANTS. Le resserrement est monotone, l'avant est toujours plus
      brillant que l'arrière, et le facteur Doppler au travers vaut exactement
      1/γ — le décalage transverse, qui est le seul du lot qu'un calcul
      newtonien ne produirait jamais.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const faux = {};
new Function("window", fs.readFileSync(path.join(__dirname, "aberration.js"), "utf8"))(faux);
const A = faux.AB;

console.log("\n  L'ABERRATION — LE CIEL QUI SE RESSERRE");
console.log("  ══════════════════════════════════════");

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
const deg = c => (Math.acos(Math.min(1, Math.max(-1, c))) * 180 / Math.PI);
const VITESSES = [0, 0.1, 0.5, 0.9, 0.99, 0.999, 0.9999, 0.999999];

// ══════════════════════════════ 1. les cas où l'on connaît la réponse
groupe("Les cas dont on connaît la réponse d'avance");
{
  let bouge = null;
  for(let c = -1; c <= 1; c += 0.1)
    if(Math.abs(A.versBord(c, 0) - c) > 1e-12) bouge = c.toFixed(1);
  ok("à l'arrêt, le ciel ne bouge pas", bouge === null, "aucun déplacement", bouge || "aucun",
     "c'est le contrôle le plus bête et le plus utile : un facteur oublié se "
     + "verrait ici avant de se voir nulle part ailleurs");

  let avant = null, arriere = null;
  for(const b of VITESSES){
    if(Math.abs(A.versBord(1, b) - 1) > 1e-12) avant = b;
    if(Math.abs(A.versBord(-1, b) + 1) > 1e-12) arriere = b;
  }
  ok("droit devant reste droit devant", avant === null, "point fixe", avant || "fixe partout");
  ok("et droit derrière reste droit derrière", arriere === null, "point fixe",
     arriere || "fixe partout",
     "les deux pôles sont les seules directions que l'aberration laisse en place");
}

// ══════════════════════════════ 2. le sens du resserrement
groupe("Le ciel se resserre DEVANT, et jamais derrière");
{
  let faute = null;
  for(const b of VITESSES.slice(1))
    if(A.versBord(0, b) <= 0) faute = "β = " + b;
  ok("une étoile au travers se déplace vers l'avant", faute === null,
     "cos θ' > 0", faute || "toujours",
     "c'est LE signe de l'affaire. À l'envers, le ciel se resserrerait derrière "
     + "— une image tout aussi spectaculaire, et fausse");

  const table = VITESSES.slice(1).map(b => b + " → " + A.demiCiel(b).toFixed(3) + " rad ("
                                        + (A.demiCiel(b)*180/Math.PI).toFixed(1) + "°)");
  let croissant = true;
  for(let i = 1; i < VITESSES.length - 1; i++)
    if(A.demiCiel(VITESSES[i+1]) > A.demiCiel(VITESSES[i])) croissant = false;
  ok("et il se resserre de plus en plus vite", croissant, "monotone décroissant",
     croissant ? "monotone" : "IL REBROUSSE",
     "moitié avant du ciel : " + table.join(" · "));

  ok("à 0,99 c, un hémisphère tient dans moins de dix degrés",
     A.demiCiel(0.99)*180/Math.PI < 10, "< 10°",
     (A.demiCiel(0.99)*180/Math.PI).toFixed(1) + "°",
     "c'est la phrase qui dit la chose en un mot, et elle est vérifiable");
}

// ══════════════════════════════ 3. les deux sens se défont
groupe("Les deux sens se défont l'un l'autre");
{
  let pire = 0, ou = "";
  for(const b of VITESSES)
    for(let c = -1; c <= 1.0001; c += 0.05){
      const cc = Math.min(1, c);
      const retour = A.versCiel(A.versBord(cc, b), b);
      const e = Math.abs(retour - cc);
      if(e > pire){ pire = e; ou = "β = " + b + ", cos θ = " + cc.toFixed(2); }
    }
  ok("aller puis revenir rend le point de départ", pire < 1e-9,
     "erreur < 1e-9", pire.toExponential(2) + (ou ? "  (" + ou + ")" : ""),
     "c'est le contrôle qui attrape l'erreur de signe : un ciel resserré à "
     + "l'envers reste un ciel resserré, et l'œil ne le dénoncerait pas");

  // Et le nuanceur emploie `versCiel` : sa borne doit tenir aux extrêmes.
  let horsBornes = null;
  for(const b of VITESSES)
    for(const c of [-1, -0.999, 0, 0.999, 1]){
      const v = A.versCiel(c, b);
      if(!(v >= -1 && v <= 1)) horsBornes = "β = " + b + ", cos = " + c + " → " + v;
    }
  ok("et rien ne sort jamais de [−1, 1]", horsBornes === null, "borné", horsBornes || "borné",
     "un cosinus qui déborde donne un `acos` NaN, donc un pixel noir dont "
     + "personne ne trouve l'origine");
}

// ══════════════════════════════ 4. la couleur et l'éclat
groupe("La couleur et l'éclat suivent");
{
  let bleu = null, rouge = null;
  for(const b of VITESSES.slice(1)){
    if(A.doppler(1, b) <= 1)  bleu = b;
    if(A.doppler(-1, b) >= 1) rouge = b;
  }
  ok("ce qui est devant bleuit", bleu === null, "D > 1", bleu || "toujours");
  ok("et ce qui est derrière rougit", rouge === null, "D < 1", rouge || "toujours");

  /* LE DÉCALAGE TRANSVERSE. À 90° vu du bord, le Doppler vaut exactement 1/γ —
     c'est du pur ralentissement des horloges, sans la moindre composante de
     rapprochement. Aucun calcul classique ne le produit : c'est le contrôle qui
     distingue cette formule d'une approximation qui marcherait « à peu près ». */
  let pire = 0;
  for(const b of VITESSES){
    const e = Math.abs(A.doppler(0, b) - 1/A.gamma(b));
    if(e > pire) pire = e;
  }
  ok("au travers, D vaut exactement 1/γ", pire < 1e-12, "1/γ", pire.toExponential(2),
     "le décalage transverse : rien de classique ne le donne");

  ok("l'éclat suit la puissance quatrième",
     Math.abs(A.eclat(2) - 16) < 1e-12 && Math.abs(A.eclat(0.5) - 0.0625) < 1e-12,
     "16 et 0,0625", A.eclat(2) + " et " + A.eclat(0.5));

  /* J'avais écrit « plus d'un milliard » de tête, et ce contrôle m'a repris :
     à 0,9999 c, D = γ(1+β) ≈ 141 et D⁴ ≈ 4 × 10⁸. Le milliard arrive plus haut.
     La leçon n'est pas dans le chiffre, elle est dans le fait qu'un ordre de
     grandeur estimé ressemble à s'y méprendre à un ordre de grandeur calculé. */
  const D = A.doppler(1, 0.9999);
  ok("à 0,9999 c, l'avant gagne quatre cents millions",
     A.eclat(D) > 3.5e8 && A.eclat(D) < 4.5e8,
     "≈ 4 × 10⁸", A.eclat(D).toExponential(2),
     "c'est ça, plus que le resserrement, qui rend le ciel d'arrière noir");
  const arriere = A.eclat(A.doppler(-1, 0.9999));
  ok("et l'arrière perd autant", arriere < 1e-8, "< 10⁻⁸", arriere.toExponential(2),
     "le ciel derrière s'éteint : ce n'est pas une licence d'image, c'est le "
     + "même facteur pris à l'envers");
}

// ══════════════════════════════ 5. rien d'absurde n'en sort
groupe("Rien d'absurde n'en sort");
{
  let mauvais = null;
  const absurdes = [NaN, Infinity, -Infinity, null, undefined, "vite", {}, 2, -2, 1, -1];
  for(const b of absurdes)
    for(const c of absurdes.concat([0, 0.5])){
      for(const f of [A.versBord, A.versCiel, A.doppler]){
        const v = f(c, b);
        if(!Number.isFinite(v)) mauvais = f.name + "(" + String(c) + ", " + String(b) + ") = " + v;
      }
    }
  ok("aucune entrée absurde ne rend un non-nombre", mauvais === null,
     "toujours fini", mauvais || "toujours fini",
     "ces valeurs partent dans un uniforme : un NaN y peint un écran noir");

  ok("et β = 1 est ramené juste en dessous",
     Number.isFinite(A.versBord(0, 1)) && A.borne(1) < 1, "borné", A.borne(1),
     "le vol à 1 g s'en approche de si près que la différence se perd dans les "
     + "flottants — on borne plutôt que de laisser diverger γ");
}

// ══════════════════════════════ 6. et ces contrôles savent tomber
groupe("Et ces contrôles savent tomber");
{
  const bac = sup => Object.assign({}, A, sup);

  // L'erreur de signe : le ciel se resserre derrière.
  const envers = bac({ versBord: (c, b) => (c - b) / (1 - b*c) });
  ok("un resserrement à l'envers est vu", envers.versBord(0, 0.9) < 0, "vu",
     envers.versBord(0, 0.9) < 0 ? "vu" : "PASSÉ INAPERÇU");

  // Le Doppler pris sur l'angle du repos plutôt que sur l'angle aberré.
  const ordreInverse = bac({ doppler: (c, b) => 1 / (A.gamma(b) * (1 - b*A.versCiel(c, b))) });
  ok("un Doppler pris sur le mauvais angle est vu",
     Math.abs(ordreInverse.doppler(0, 0.9) - 1/A.gamma(0.9)) > 1e-6, "vu",
     Math.abs(ordreInverse.doppler(0, 0.9) - 1/A.gamma(0.9)) > 1e-6 ? "vu" : "PASSÉ INAPERÇU",
     "c'est la faute plausible : les deux angles existent, ils diffèrent, et "
     + "l'image reste crédible avec le mauvais");

  const cube = bac({ eclat: D => Math.pow(D, 3) });
  ok("un éclat en puissance trois est vu", Math.abs(cube.eclat(2) - 16) > 1e-9,
     "vu", Math.abs(cube.eclat(2) - 16) > 1e-9 ? "vu" : "PASSÉ INAPERÇU");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
