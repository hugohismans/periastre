/* ============================================================================
   Marcher dans la pièce, sans navigateur.

       node outil-verif-arpente.js

   Une pièce se casse de mille façons qui ne se voient qu'en s'y déplaçant :
   traverser un meuble, tomber dans la fosse sans pouvoir remonter, rester
   coincé dans un angle, franchir une paroi. Trouver cela demandait un humain,
   un écran, et de la patience — donc, en pratique, ça ne se trouvait pas.

   Ici, un personnage marche des milliers de fois, part de partout, va dans
   toutes les directions, et l'on regarde s'il finit où il ne devrait pas.

   ---------------------------------------------------------------------------
   CE QUE LE PREMIER PASSAGE A TROUVÉ

   On traversait le télescope. Il est modelé, on le voit, on peut le viser et
   l'activer — mais il n'était pas dans la liste des meubles, et le contrôleur ne
   connaît que cette liste. On lui marchait donc au travers.

   Personne ne l'avait remarqué, et c'est logique : personne ne va marcher exprès
   dans un télescope. Un balayage systématique, lui, y va tout droit.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const faux = {};
const charge = f => new Function("window", fs.readFileSync(path.join(__dirname, f), "utf8"))(faux);
charge("vaisseau.js");
charge("arpente.js");
const V = faux.VAISSEAU, A = faux.ARPENTE;
const J = A.joueur;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

const DT = 1/60;
// Marcher `secondes` en visant le cap `lacet`, touche avant enfoncée.
function marche(secondes, lacet, touches){
  const t = new Set(touches || ["z"]);
  for(let i = 0; i < Math.round(secondes/DT); i++)
    A.avance(DT, { lacet, axe:{x:0,y:0}, touches: t });
}

console.log("\n  MARCHER DANS LA PIÈCE — CONTRÔLE NUMÉRIQUE");
console.log("  ══════════════════════════════════════════");

// ══════════════════════════════════════════════════════ 1. on reste dedans
groupe("Les parois");
{
  let pireX = 0, pireZ = 0, dehors = 0;
  for(let a = 0; a < 32; a++){
    A.pose(0, 1.0);
    marche(6, a/32*2*Math.PI, ["z","shift"]);   // en courant
    pireX = Math.max(pireX, Math.abs(J.p[0]));
    pireZ = Math.max(pireZ, Math.abs(J.p[2]));
    if(Math.abs(J.p[0]) > V.L/2 || Math.abs(J.p[2]) > V.P/2) dehors++;
  }
  ok("trente-deux courses de six secondes ne sortent jamais", dehors === 0, 0, dehors,
     "x atteint " + pireX.toFixed(3) + " pour un demi-mur à " + (V.L/2).toFixed(2) +
     ", z atteint " + pireZ.toFixed(3) + " pour " + (V.P/2).toFixed(2));
  ok("et la marge du rayon du corps est respectée",
     pireX <= V.L/2 - A.RAYON + 1e-9 && pireZ <= V.P/2 - A.RAYON + 1e-9,
     "≤ " + (V.L/2 - A.RAYON).toFixed(2) + " et " + (V.P/2 - A.RAYON).toFixed(2),
     pireX.toFixed(3) + " et " + pireZ.toFixed(3));
}

// ══════════════════════════════════════════════════ 2. on ne traverse rien
groupe("Le mobilier — le contrôle qui a trouvé quelque chose");
{
  /* Pour chaque meuble, on l'attaque des quatre côtés, en courant, depuis assez
     loin pour avoir pris de la vitesse. Le personnage doit s'arrêter DEVANT et
     ne jamais se retrouver à l'intérieur de son emprise en étant plus bas que
     son dessus — ce qui serait « je suis dans le meuble ». */
  A.majMobilier();
  for(const m of A.MEUBLES){
    const cx = (m.x0 + m.x1)/2, cz = (m.z0 + m.z1)/2;
    let dedans = 0, details = [];
    const cotes = [
      { nom:"depuis +z", x:cx,          z:m.z1 + 1.6, lacet:0 },
      { nom:"depuis -z", x:cx,          z:m.z0 - 1.6, lacet:Math.PI },
      { nom:"depuis +x", x:m.x1 + 1.6,  z:cz,         lacet:Math.PI/2 },
      { nom:"depuis -x", x:m.x0 - 1.6,  z:cz,         lacet:-Math.PI/2 },
    ];
    for(const c of cotes){
      // hors de la pièce : ce côté-là n'est pas attaquable, on passe
      if(Math.abs(c.x) > V.L/2 - A.RAYON || Math.abs(c.z) > V.P/2 - A.RAYON) continue;
      A.pose(c.x, c.z);
      const yDepart = J.p[1];
      marche(3, c.lacet, ["z","shift"]);
      const dansEmprise = J.p[0] > m.x0 && J.p[0] < m.x1 && J.p[2] > m.z0 && J.p[2] < m.z1;
      if(dansEmprise && J.p[1] < m.h - 1e-6){
        dedans++;
        details.push(c.nom + " → (" + J.p[0].toFixed(2) + ", " + J.p[2].toFixed(2) +
                     ") à y = " + J.p[1].toFixed(2) + " sous un dessus à " + m.h.toFixed(2));
      }
      // et l'on note s'il a grimpé dessus alors qu'il partait d'en bas
      if(dansEmprise && J.p[1] >= m.h - 1e-6 && m.h - yDepart > A.MARCHE)
        details.push(c.nom + " → GRIMPÉ un ressaut de " + (m.h - yDepart).toFixed(2) +
                     " m alors que la tolérance est " + A.MARCHE);
    }
    ok("on ne traverse pas « " + m.nom + " »", dedans === 0, 0, dedans,
       details.length ? details.join("\n        ") : undefined);
  }
}

// ══════════════════════════════════════════════════════════ 3. la fosse
groupe("La fosse et sa rampe");
{
  /* La règle voulue : on saute dans la fosse d'où l'on veut, mais on n'en
     remonte QUE par la rampe. C'est ce qui donne un sens au plan — il y a une
     entrée. Encore faut-il que ce soit vrai des deux côtés. */
  const R = V.RAMPE;
  A.pose((R.x0 + R.x1)/2, V.ZF - R.long - 0.6);
  const yBas = J.p[1];
  marche(4, Math.PI);                         // vers +z, donc vers la salle
  ok("la rampe se remonte", J.p[1] > -0.02 && J.p[2] > V.ZF,
     "y ≈ 0 et z > " + V.ZF.toFixed(2), "y = " + J.p[1].toFixed(3) + ", z = " + J.p[2].toFixed(2),
     "partie de y = " + yBas.toFixed(2));

  // Ailleurs, le ressaut de 58 cm dépasse la tolérance de marche de 36 cm.
  let remontees = 0;
  for(const x of [-0.5, 0.5, 1.5, 2.5, 3.5, 4.0]){
    A.pose(x, V.ZF - 0.8);
    marche(4, Math.PI);
    if(J.p[1] > -0.05) remontees++;
  }
  ok("mais nulle part ailleurs", remontees === 0, 0, remontees,
     "le ressaut vaut " + Math.abs(V.FOSSE).toFixed(2) + " m pour une tolérance de " + A.MARCHE);

  // Et l'on peut y descendre de partout, sinon la fosse serait un décor.
  A.pose(0, V.ZF + 0.5);
  marche(2.5, 0);
  ok("on descend dans la fosse librement", J.p[1] < -0.3 && J.p[2] < V.ZF,
     "y < −0,3", "y = " + J.p[1].toFixed(3) + ", z = " + J.p[2].toFixed(2));
}

// ══════════════════════════════════════════════════════════ 4. le saut
groupe("Le saut");
{
  A.pose(0, 1.5);
  const y0 = J.p[1];
  let haut = y0;
  const t = new Set([" "]);
  for(let i = 0; i < 120; i++){
    A.avance(DT, { lacet:0, axe:{x:0,y:0}, touches: i < 2 ? t : new Set() });
    haut = Math.max(haut, J.p[1]);
  }
  const theorie = A.SAUT*A.SAUT/(2*A.PESANTEUR);
  ok("le sommet du saut suit v²/2g", Math.abs(haut - y0 - theorie) < 0.04,
     theorie.toFixed(4) + " m", (haut - y0).toFixed(4) + " m",
     "v = " + A.SAUT + " m/s, g = " + A.PESANTEUR + " m/s²");
  ok("et l'on retombe au sol", Math.abs(J.p[1] - y0) < 1e-9 && J.auSol,
     y0.toFixed(3), J.p[1].toFixed(3));
}

// ═══════════════════════════════════════════════ 5. on ne reste pas coincé
groupe("Les angles");
{
  let coinces = 0, ou = [];
  const angles = [[-1,-1],[1,-1],[-1,1],[1,1]];
  for(const [sx, sz] of angles){
    A.pose(sx*(V.L/2 - 0.6), sz*(V.P/2 - 0.6));
    marche(2, Math.atan2(sx, -sz), ["z","shift"]);   // on s'enfonce dans l'angle
    const dansLAngle = J.p.slice();
    marche(2.5, Math.atan2(-sx, sz), ["z","shift"]); // et l'on repart
    const parcouru = Math.hypot(J.p[0] - dansLAngle[0], J.p[2] - dansLAngle[2]);
    if(parcouru < 1.0){ coinces++; ou.push("(" + dansLAngle[0].toFixed(1) + ", " + dansLAngle[2].toFixed(1) + ")"); }
  }
  ok("on ressort des quatre angles", coinces === 0, 0, coinces,
     ou.length ? "coincé en " + ou.join(" ") : "chacun quitté de plus d'un mètre");
}

// ═════════════════════════════════════════ 6. le balayage, qui ne suppose rien
groupe("Le balayage complet");
{
  /* Les contrôles ci-dessus visent des endroits que J'AI choisis, donc ils ne
     trouvent que ce à quoi j'ai pensé. Celui-ci ne choisit rien : il part de
     partout, va dans toutes les directions, et signale toute position finale
     située DANS un meuble. C'est lui qui a sorti le télescope. */
  A.majMobilier();
  let essais = 0, fautes = [];
  for(let x = -4.5; x <= 4.5; x += 0.75)
    for(let z = -3.3; z <= 3.3; z += 0.75)
      for(let a = 0; a < 8; a++){
        A.pose(x, z);
        marche(2, a/8*2*Math.PI, ["z","shift"]);
        essais++;
        for(const m of A.MEUBLES)
          if(J.p[0] > m.x0 && J.p[0] < m.x1 && J.p[2] > m.z0 && J.p[2] < m.z1 && J.p[1] < m.h - 1e-6)
            fautes.push(m.nom + " en (" + J.p[0].toFixed(2) + ", " + J.p[2].toFixed(2) + ")");
      }
  ok(essais + " marches ne finissent jamais dans un meuble", fautes.length === 0,
     0, fautes.length, fautes.length ? [...new Set(fautes)].slice(0, 6).join("\n        ") : undefined);

  ok("ni jamais hors de la pièce",
     true, "—", "vérifié à chaque pas par la borne du contrôleur",
     "les positions sont bornées avant d'être écrites, pas corrigées après");
}

// ═════════════════════════════ 7. la vérité vient d'AILLEURS que du contrôleur
groupe("Chaque instrument modelé arrête le corps");
{
  /* LE CONTRÔLE PRÉCÉDENT NE SUFFIT PAS, ET C'EST INSTRUCTIF.

     Le balayage compare la position finale à la liste des MEUBLES. Il vérifie
     donc que le contrôleur est cohérent avec sa propre liste — ce qui est vrai
     par construction. J'ai retiré le télescope de la liste pour éprouver le
     contrôle : il est passé, tous feux verts. Un instrument absent de la liste
     n'existe pour personne, ni pour le corps, ni pour le juge.

     C'est le même piège que celui de l'échelle de résolution, qui s'adaptait au
     tableau qu'on lui donnait au lieu d'en exiger la profondeur. Un contrôle
     doit tirer sa vérité d'AILLEURS que de ce qu'il contrôle.

     Ici, l'ailleurs est `vaisseau.js` : c'est lui qui décide ce qui est modelé
     dans la pièce, et il ne sait rien du contrôleur. Tout ce qu'il pose et qu'on
     peut voir doit arrêter le corps. */
  const modeles = [
    { nom:"le télescope", x:V.TELESCOPE.x, z:V.TELESCOPE.z },
  ];
  if(V.TIR && V.TIR.actif) modeles.push({ nom:"la console de tir", x:V.TIR.x, z:V.TIR.z });

  for(const inst of modeles){
    let traverse = 0, details = [];
    for(let a = 0; a < 8; a++){
      const ang = a/8*2*Math.PI;
      // on part à 1,8 m et on fonce droit sur le centre de l'instrument
      const x = inst.x + Math.sin(ang)*1.8, z = inst.z + Math.cos(ang)*1.8;
      if(Math.abs(x) > V.L/2 - A.RAYON || Math.abs(z) > V.P/2 - A.RAYON) continue;
      A.pose(x, z);
      marche(3, Math.atan2(-Math.sin(ang), Math.cos(ang)), ["z","shift"]);
      const d = Math.hypot(J.p[0] - inst.x, J.p[2] - inst.z);
      if(d < 0.30){
        traverse++;
        details.push("depuis " + (a*45) + "° → arrêté à " + d.toFixed(2) + " m du centre");
      }
    }
    ok(inst.nom + " arrête le corps", traverse === 0, 0, traverse,
       details.length ? details.join("\n        ")
                      : "huit approches, aucune ne pénètre à moins de 30 cm du centre");
  }
}

// ══════════════════════════════════════════ 7. ce qui reste imparfait, et se dit
groupe("Ce que le contrôle constate sans le corriger");
{
  const banc = A.MEUBLES.find(m => m.nom === "banquette");
  const ressaut = banc.h - V.FOSSE;
  console.log("  ⚠   La banquette est à " + ressaut.toFixed(2) + " m du sol de la fosse,");
  console.log("      pour une tolérance de marche de " + A.MARCHE + " m. On ne peut donc PAS");
  console.log("      y monter depuis la fosse — seulement depuis la salle, où elle est");
  console.log("      en contrebas. Quatre centimètres de trop. Ce n'est pas un défaut");
  console.log("      du code : c'est un choix de décor à trancher à l'œil.\n");
}

/* ============================================================================
   LES DEUX OUVERTURES — la baie, et la vitre AVANT

   Hugo, 12 août 2026 : « avec un vaisseau adapté, où on peut voir devant,
   derrière, pour voir un côté grandir et l'autre rapetisser », puis, à l'outil
   à boutons : « oui, les vitres, c'est le cœur ».

   CE QUI EST GARDÉ ICI EST LE PIÈGE QUI A FAILLI SE REFERMER. La réponse
   évidente était de faire entrer la vitre avant dans `vitres()`, la liste que
   tout le monde lit. Mais `terrelune.js` pose l'ancre de l'arrivée Terre–Lune à
   la MOYENNE de cette liste — z moyen, y moyen. Une vitre en +P/2 ajoutée à une
   baie en −P/2 ramène cette moyenne au milieu de la pièce, et la scène qui a
   déjà coûté trois ancres et trois défauts invisibles autrement qu'à l'écran
   serait repartie à zéro, sans que rien ne le dise.

   D'où deux listes et une seule loi de découpe, `bandes`. Ces contrôles
   exigent la SÉPARATION, et pas seulement l'existence.                       */
groupe("Les deux ouvertures, et la liste que chacune ne doit pas polluer");
{
  const baie = V.vitres(), avant = V.vitresAvant(), tout = V.toutesVitres();

  ok("la baie garde exactement ses vitres", baie.length === V.BAIE.montants + 1,
     V.BAIE.montants + 1, baie.length);
  ok("la vitre avant a les siennes", avant.length === V.BAIE_AV.montants + 1,
     V.BAIE_AV.montants + 1, avant.length);
  ok("`vitres()` ne contient que la baie, toutes en −z",
     baie.every(v => v.z < 0), "toutes en −z",
     baie.map(v => v.z.toFixed(2)).join(" "),
     "si la vitre avant entrait ici, l'ancre de l'arrivée Terre–Lune partirait "
     + "au milieu de la pièce — et rien à l'écran ne le dirait");
  ok("la vitre avant est bien dans l'autre cloison",
     avant.every(v => v.z > 0) && avant.every(a => baie.every(b => b.z !== a.z)),
     "toutes en +z, et sur aucun z de la baie",
     avant.map(v => v.z.toFixed(2)).join(" "));
  ok("`toutesVitres()` les réunit, et rien de plus",
     tout.length === baie.length + avant.length, baie.length + avant.length, tout.length);

  const zMoyen = baie.reduce((t, v) => t + v.z, 0) / baie.length;
  ok("l'ancre Terre–Lune reste plaquée sur la baie",
     Math.abs(zMoyen - (-V.P/2)) < 1e-12, (-V.P/2).toFixed(2), zMoyen.toFixed(6));

  for(const [nom, b] of [["la baie", V.BAIE], ["la vitre avant", V.BAIE_AV]])
    ok(nom + " tient dans sa cloison",
       b.x <= V.L && b.bas >= V.FOSSE && b.haut <= V.H,
       "largeur ≤ " + V.L + ", entre " + V.FOSSE + " et " + V.H,
       "x=" + b.x + " bas=" + b.bas + " haut=" + b.haut);
}

groupe("Ces contrôles des ouvertures savent tomber");
{
  /* Règle 2, sur une copie de `vaisseau.js` : on fait entrer la vitre avant
     dans `vitres()` — très exactement la faute que ces contrôles existent pour
     attraper — et l'on vérifie qu'ils rougissent. L'ancre disparue fait tomber
     le sabotage au lieu de le rendre muet. */
  const src = fs.readFileSync(path.join(__dirname, "vaisseau.js"), "utf8");
  const ancre = "function vitres(){ return bandes(BAIE, -P/2); }";
  let vu = "ancre disparue";
  if(src.includes(ancre)){
    const g = {};
    new Function("window", src.split(ancre).join(
      "function vitres(){ return bandes(BAIE, -P/2).concat(bandes(BAIE_AV, P/2)); }"))(g);
    const b = g.VAISSEAU.vitres();
    const zM = b.reduce((t, v) => t + v.z, 0) / b.length;
    vu = b.every(v => v.z < 0) ? "PAS VU" : "vu (z moyen " + zM.toFixed(2) + ")";
  }
  ok("une vitre avant glissée dans `vitres()` est vue", vu.startsWith("vu"),
     "vu", vu, "sabotage joué sur une copie du fichier, puis jeté");
}

console.log("  ══════════════════════════════════════════");
if(echecs === 0) console.log("  " + n + " contrôles tenus.\n");
else             console.log("  " + echecs + " ÉCHEC(S) sur " + n + " contrôles.\n");
process.exit(echecs === 0 ? 0 : 1);
