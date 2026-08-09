/* ============================================================================
   LA PAGE FRAÎCHE — SANS NAVIGATEUR.

       node outil-verif-frais.js

   Ce module a un pouvoir désagréable : il peut faire recharger la page de
   quelqu'un. Mal réglé, il la fait clignoter sans fin — et le pire est qu'on ne
   s'en apercevrait pas en le testant sur une machine à jour, puisque le cas
   normal est « tout va bien, on ne fait rien ».

   Le contrôle porte donc surtout sur les cas où il NE DOIT PAS agir : réponse
   illisible, panne réseau, page d'erreur, tentative déjà faite. C'est l'inverse
   de l'habitude — ici, l'échec dangereux est le faux positif.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const faux = {};
new Function("window", fs.readFileSync(path.join(ICI, "frais.js"), "utf8"))(faux);
const F = faux.FRAIS;
const PAGE = fs.readFileSync(path.join(ICI, "index.html"), "utf8");

console.log("\n  LA PAGE FRAÎCHE");
console.log("  ═══════════════");

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// ══════════════════════════════ 1. lire une estampille
groupe("Lire l'estampille d'une page");
{
  ok("dans la vraie page du site", /^[0-9a-f]{7,40}$/.test(String(F.estampille(PAGE))),
     "une estampille", F.estampille(PAGE),
     "si `version.mjs` changeait de forme, tout ce fichier deviendrait muet "
     + "sans rien signaler — c'est le seul contrôle qui lit le vrai `index.html`");

  ok("dans un fragment", F.estampille('<script src="a.js?v=abc1234"></script>') === "abc1234",
     "abc1234", F.estampille('<script src="a.js?v=abc1234"></script>'));

  let mauvais = null;
  for(const t of ["", null, undefined, 42, {}, "<html>rien</html>",
                  "?v=", "?v=zzz", "?v=abc"]){
    if(F.estampille(t) !== null) mauvais = JSON.stringify(t) + " → " + F.estampille(t);
  }
  ok("et rien nulle part ailleurs", mauvais === null, "null partout", mauvais || "null partout",
     "« ?v=abc » est trop court pour être un commit : le prendre pour une "
     + "estampille ferait recharger sur du bruit");
}

// ══════════════════════════════ 2. quand NE PAS recharger
groupe("Quand il ne faut surtout pas recharger");
{
  ok("quand les deux estampilles s'accordent",
     F.doitRecharger("abc1234", "abc1234", null) === false, "non", "non",
     "le cas de loin le plus fréquent : ne rien faire doit être gratuit");

  ok("quand le serveur n'a rien de lisible",
     F.doitRecharger("abc1234", null, null) === false, "non", "non",
     "coupure réseau, page d'erreur, texte tronqué — une panne passagère ne "
     + "doit pas devenir une boucle de rechargement");

  ok("quand notre propre page n'a pas d'estampille",
     F.doitRecharger(null, "def5678", null) === false, "non", "non");

  ok("quand on a DÉJÀ tenté celle-là",
     F.doitRecharger("abc1234", "def5678", "def5678") === false, "non", "non",
     "c'est la garde contre le cache têtu : celui qui redonne la même page "
     + "après le saut ferait clignoter le site indéfiniment");

  let coupable = null;
  for(const [a, b, f] of [["", "", null], [undefined, undefined, undefined],
                          ["abc1234", "", null], ["", "def5678", null]]){
    if(F.doitRecharger(a, b, f) !== false) coupable = JSON.stringify([a, b, f]);
  }
  ok("et sur toutes les combinaisons vides", coupable === null,
     "non partout", coupable || "non partout");
}

// ══════════════════════════════ 3. quand il FAUT
groupe("Et quand il le faut vraiment");
{
  ok("estampilles différentes, jamais tenté",
     F.doitRecharger("abc1234", "def5678", null) === true, "oui", "oui");
  ok("différentes, et la tentative portait sur une AUTRE",
     F.doitRecharger("abc1234", "def5678", "0000000") === true, "oui", "oui",
     "deux publications coup sur coup pendant qu'on lit : le second saut est "
     + "légitime, il ne boucle pas puisque la cible a changé");
}

// ══════════════════════════════ 4. l'adresse où l'on saute
groupe("L'adresse gardée entière");
{
  const a = F.adresse("https://x.fr/periastre/?juge", "abc1234");
  ok("le mode de la page survit", a.indexOf("?juge") >= 0, "?juge conservé", a,
     "sans ça, on déposerait Hugo sur l'accueil alors qu'il allait juger — une "
     + "façon plus discrète de lui faire perdre son temps");
  ok("et le cache-buster est là", /[?&]_v=abc1234/.test(a), "_v=abc1234", a);

  const b = F.adresse("https://x.fr/periastre/", "abc1234");
  ok("sur une adresse nue, on ouvre la question", /\?_v=abc1234$/.test(b), "?_v=…", b);

  const c = F.adresse("https://x.fr/periastre/?juge&_v=vieille", "neuve12");
  ok("le nôtre ne s'empile jamais",
     (c.match(/_v=/g) || []).length === 1 && c.indexOf("vieille") < 0,
     "un seul _v", c,
     "à la troisième publication l'adresse deviendrait un chapelet, et le "
     + "paramètre finirait par peser plus que la page");

  const d = F.adresse("https://x.fr/periastre/?juge#bas", "abc1234");
  ok("l'ancre reste à la fin", /#bas$/.test(d) && d.indexOf("_v=abc1234") < d.indexOf("#"),
     "…_v=abc1234#bas", d);
}

// ══════════════════════════════ 5. la page s'en sert vraiment
groupe("Et la page s'en sert — lu dans `index.html`");
{
  ok("`frais.js` est chargé", /src="frais\.js/.test(PAGE), "chargé",
     /src="frais\.js/.test(PAGE) ? "chargé" : "ABSENT");
  ok("la page demande le serveur sans cache", /cache:\s*"no-store"/.test(PAGE),
     "no-store", /cache:\s*"no-store"/.test(PAGE) ? "no-store" : "ABSENT",
     "sans ça on redemanderait au cache ce que le cache vient de nous mentir");
  ok("elle passe par `FRAIS.doitRecharger`", /FRAIS\.doitRecharger\(/.test(PAGE),
     "par le module", /FRAIS\.doitRecharger\(/.test(PAGE) ? "par le module" : "EN DUR",
     "une comparaison écrite dans la page serait la seule chose de ce dispositif "
     + "que rien n'éprouve, et c'est celle qui peut faire clignoter le site");
  ok("et elle retient sa tentative", /sessionStorage/.test(PAGE), "une mémoire de session",
     /sessionStorage/.test(PAGE) ? "présente" : "ABSENTE",
     "c'est elle qui rend la boucle impossible");
}

// ══════════════════════════════ 6. les sabotages
groupe("Et ces contrôles savent tomber");
{
  const bac = sup => Object.assign({}, F, sup);

  const bavard = bac({ doitRecharger: (a, b) => a !== b });
  ok("un test qui ignore la tentative précédente est vu",
     bavard.doitRecharger("abc1234", "def5678", "def5678") === true,
     "vu", bavard.doitRecharger("abc1234", "def5678", "def5678") ? "vu" : "PASSÉ INAPERÇU");

  const credule = bac({ doitRecharger: (a, b) => a !== b });
  ok("un test qui recharge sur une réponse vide est vu",
     credule.doitRecharger("abc1234", null) === true, "vu",
     credule.doitRecharger("abc1234", null) ? "vu" : "PASSÉ INAPERÇU",
     "c'est le faux positif dangereux : une panne réseau deviendrait une boucle");

  const empileur = bac({ adresse: (u, v) => u + "&_v=" + v });
  const trois = empileur.adresse(empileur.adresse("https://x.fr/?juge", "a1"), "b2");
  ok("une adresse qui empile les paramètres est vue",
     (trois.match(/_v=/g) || []).length > 1, "vu",
     (trois.match(/_v=/g) || []).length > 1 ? "vu" : "PASSÉ INAPERÇU");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
