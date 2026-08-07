/* ============================================================================
   Le recul et son quadrillage, sans navigateur.

       node outil-verif-recul.js

   Le quadrillage du recul existe pour une seule raison : dans le vide, rien ne
   prouve qu'on bouge. C'est l'étalon qui rend l'éloignement visible.

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   Hugo a demandé TROIS FOIS que ce quadrillage se lise en volume. Trois séances
   de jugement, le même mot à chaque fois : « vertical aussi », « en volume, pas
   à plat », et le 6 août « là on a qu'une grille horizontale ». Entre chacune,
   rien ne surveillait la forme du repère — il n'y avait donc aucune raison
   qu'elle ne reparte pas à plat au premier remaniement.

   Une demande qu'on doit formuler trois fois n'est pas une demande mal
   formulée : c'est un contrôle qui manque.

   ---------------------------------------------------------------------------
   COMMENT ON CONTRÔLE UN DESSIN SANS ÉCRAN

   On ne regarde pas des pixels. On donne à `dessineQuadrillage` une projection
   qui ne projette rien — elle numérote les points du MONDE qu'on lui présente —
   et un contexte de dessin qui note les segments au lieu de les tracer. Ce qui
   ressort est la liste des arêtes en coordonnées de monde, et l'on interroge
   leur direction.

   Le contrôle tire donc sa vérité d'ailleurs que du dessin : de la géométrie
   demandée, pas de ce que le code a bien voulu produire.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const faux = {};
/* LE VRAI `VOYAGE`, PLUS UN LEURRE.

   Il y avait ici `{ entre: () => ({ tau: 0, t: 0 }) }`, au motif que `lance()`
   seul s'en servait et qu'on ne mesurait pas son résultat. Depuis le 7 août la
   POSITION vient de `VOYAGE.etat` : un leurre qui rend zéro ferait alors un
   vaisseau immobile, et tous les contrôles de décades mesureraient une scène
   figée en croyant mesurer un voyage.

   On charge donc le module réel. C'est aussi plus honnête : ce fichier vérifie
   le recul tel qu'il tourne, pas une version de laboratoire. */
new Function("window", fs.readFileSync(path.join(__dirname, "voyage1g.js"), "utf8"))(faux);
new Function("window", fs.readFileSync(path.join(__dirname, "recul.js"), "utf8"))(faux);
const R = faux.RECUL;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

/* Relève les segments d'un appel à `dessineQuadrillage`, en coordonnées de
   monde. La projection rend l'indice du point qu'on vient de lui donner ; le
   contexte reconstitue les paires. */
function releve(force){
  const points = [], segments = [];
  const projette = p => { points.push(p.slice()); return [points.length - 1, 0]; };

  let debut = null, alpha = 1;
  const ctx = {
    strokeStyle:"", fillStyle:"", font:"", textAlign:"", lineWidth:1,
    get globalAlpha(){ return alpha; },
    set globalAlpha(v){ alpha = v; },
    save(){}, restore(){}, beginPath(){}, stroke(){}, fillText(){},
    moveTo(i){ debut = i; },
    lineTo(i){
      if(debut !== null) segments.push({ a: points[debut], b: points[i], alpha });
      debut = null;
    },
  };
  R.dessineQuadrillage(ctx, 1600, 900, projette, force);
  return segments;
}

// La direction d'un segment : "x", "y", "z", ou "oblique".
function sens(s){
  const d = [Math.abs(s.b[0]-s.a[0]), Math.abs(s.b[1]-s.a[1]), Math.abs(s.b[2]-s.a[2])];
  const m = Math.max(...d);
  if(m === 0) return "point";
  const axes = d.map(v => v / m > 1e-9);
  if(axes.filter(Boolean).length !== 1) return "oblique";
  return axes[0] ? "x" : axes[1] ? "y" : "z";
}

console.log("\n  LE RECUL ET SON QUADRILLAGE — CONTRÔLE NUMÉRIQUE");
console.log("  ════════════════════════════════════════════════");

// ════════════════════════════════════════════ 1. le repère se lit en volume
groupe("Le quadrillage a trois directions");
{
  R.etat.distance = 160 * R.RS_M;              // au milieu d'une décade
  const seg = releve(1);
  const par = { x:0, y:0, z:0, oblique:0, point:0 };
  seg.forEach(s => par[sens(s)]++);

  ok("il y a des arêtes VERTICALES", par.y > 0, "> 0", par.y,
     "sans elles, trois nappes empilées se lisent comme trois tapis — c'est la"
     + " remarque d'Hugo, faite trois fois");
  ok("les deux directions horizontales sont là", par.x > 0 && par.z > 0,
     "> 0 et > 0", par.x + " et " + par.z);
  ok("aucune arête oblique", par.oblique === 0, 0, par.oblique,
     "une oblique voudrait dire qu'on relie deux nœuds qui ne se font pas face");

  /* Le volume ne tient pas au nombre d'arêtes verticales mais au fait qu'elles
     RELIENT les étages. Une arête qui ne monterait que d'un étage laisserait les
     deux nappes extrêmes libres l'une de l'autre.

     ATTENTION — DEUX MAILLES COEXISTENT. C'est le remède au saut de décade :
     une maille fine qui s'éteint, une dix fois plus grossière qui s'allume. Le
     relevé mélange donc deux quadrillages, et un contrôle qui n'attend qu'une
     seule hauteur d'arête échoue sur du code juste. Il a commencé par le faire.

     On raisonne donc par maille : pour chaque hauteur d'arête verticale, les
     trois nappes qu'elle doit relier doivent exister. */
  const nappes = new Set(seg.filter(s => sens(s) !== "y").map(s => s.a[1].toPrecision(9)));

  /* Un montant est une CHAÎNE de tronçons, pas un trait. Il est découpé pour
     survivre au plan rapproché — voir `montants()` dans recul.js. On mesure donc
     l'étendue de la colonne, pas la longueur d'un tronçon : c'est la colonne qui
     relie les étages, et c'est elle qui fait le volume. Un contrôle qui mesurait
     le tronçon a échoué sur du code juste dès que le découpage est arrivé. */
  const colonnes = new Map();
  for(const s of seg.filter(s => sens(s) === "y")){
    const cle = s.a[0].toPrecision(9) + "|" + s.a[2].toPrecision(9);
    const c = colonnes.get(cle) || { bas: Infinity, haut: -Infinity, morceaux: 0 };
    c.bas = Math.min(c.bas, s.a[1], s.b[1]);
    c.haut = Math.max(c.haut, s.a[1], s.b[1]);
    c.morceaux++;
    colonnes.set(cle, c);
  }
  const etendues = [...new Set([...colonnes.values()].map(c => +(c.haut - c.bas).toPrecision(9)))]
                     .sort((p, q) => p - q);

  ok("deux mailles coexistent, comme prévu", etendues.length === 2, 2, etendues.length,
     "une fine qui s'éteint, une dix fois plus grossière qui s'allume");
  ok("d'un facteur dix exactement",
     etendues.length === 2 && Math.abs(etendues[1]/etendues[0] - 10) < 1e-9,
     10, etendues.length === 2 ? (etendues[1]/etendues[0]).toFixed(6) : "—");

  const y = v => nappes.has(v.toPrecision(9));
  const relient = etendues.every(h => y(-h/2) && y(0) && y(h/2));
  ok("chaque colonne va de la nappe du bas à celle du haut", relient,
     "les trois étages", relient ? "les trois étages" : "il en manque",
     "étendues relevées : " + etendues.map(h => h.toExponential(3)).join(", "));

  const decoupe = [...colonnes.values()].every(c => c.morceaux > 1);
  ok("et elle est découpée en tronçons", decoupe, "> 1 par colonne",
     decoupe ? "oui" : "au moins une colonne est d'un seul tenant",
     "d'un seul trait, un montant disparaît entièrement dès qu'une extrémité"
     + " passe derrière le plan rapproché — deux survivants sur soixante-quatre");

  ok("trois nappes par maille, le zéro étant commun", nappes.size === 5, 5, nappes.size,
     "0, ±3 mailles fines, ±3 mailles grossières");
}

// ═══════════════════════════════════════════ 2. le trou noir n'est pas barré
groupe("Le sujet reste dégagé");
{
  R.etat.distance = 160 * R.RS_M;
  const verticales = releve(1).filter(s => sens(s) === "y");
  const auCentre = verticales.filter(s => Math.abs(s.a[0]) < 1e-9 && Math.abs(s.a[2]) < 1e-9);
  ok("aucune verticale ne traverse le centre", auCentre.length === 0, 0, auCentre.length,
     "le trou noir est le sujet, pas un nœud du quadrillage");
}

/* ══════════════════════════════════════ 3. les verticales se VOIENT

   Le contrôle qui compte, et le seul qui aurait évité la quatrième demande.

   Poser des arêtes verticales ne sert à rien si on les pose sous le seuil du
   visible : le premier jet les mettait à moitié d'opacité, soit 0,081 contre
   0,217, et sur le fond noir de la baie elles n'existaient pas. Le contrôle
   « il y a des arêtes verticales » passait pourtant au vert.

   On encadre donc leur poids des deux côtés. Trop pâles, la demande revient ;
   trop marquées, le repère devient un décor et masque le sujet. */
groupe("Les verticales se voient, sans écraser");
{
  R.etat.distance = 160 * R.RS_M;
  const seg = releve(1);
  const al = f => Math.max(...seg.filter(f).map(s => s.alpha));
  const pireV = al(s => sens(s) === "y");
  const pireH = al(s => sens(s) !== "y");
  // Les nappes pâles portent 0,42 du poids de celle du milieu : c'est le plancher
  // sous lequel une arête verticale n'est plus qu'une rumeur.
  const plancher = pireH * 0.42;

  ok("elles ne sont pas sous le seuil du visible", pireV > plancher,
     "> " + plancher.toFixed(4), pireV.toFixed(4),
     "à 0,081 contre 0,217, le premier jet ne se voyait pas — mesuré depuis la baie");
  ok("et elles ne dominent pas la nappe du milieu", pireV <= pireH,
     "≤ " + pireH.toFixed(4), pireV.toFixed(4),
     "le quadrillage est une aide de lecture, pas un décor");
}

// ════════════════════════════════════════════════ 4. il sait disparaître
groupe("Il ne s'impose pas");
{
  ok("rien n'est tracé à force nulle", releve(0).length === 0, 0, releve(0).length,
     "le quadrillage ne paraît que pendant le mouvement");
  ok("quelque chose est tracé à pleine force", releve(1).length > 0, "> 0", releve(1).length);
}

// ═══════════════════════════════════════════════ 5. le recul est logarithmique
groupe("Le recul se compte en décades");
{
  const d0 = 16 * R.RS_M, d1 = 16000 * R.RS_M;
  Object.assign(R.etat, { actif:true, d0, d1, t:0, duree:10, distance:d0 });
  for(let i = 0; i < 300; i++) R.avance(10/600);      // la moitié du trajet
  const attendu = Math.sqrt(d0 * d1);                 // moyenne GÉOMÉTRIQUE
  ok("à mi-course, on est à la moyenne géométrique",
     Math.abs(R.etat.distance - attendu) / attendu < 1e-6,
     attendu.toExponential(4), R.etat.distance.toExponential(4),
     "en interpolation linéaire on serait à " + ((d0 + d1)/2).toExponential(4)
     + " — soit déjà presque arrivé, et trois décades sautées sans rien voir");

  for(let i = 0; i < 300; i++) R.avance(10/600);
  ok("on arrive exactement où l'on visait",
     Math.abs(R.etat.distance - d1) / d1 < 1e-9, d1.toExponential(4),
     R.etat.distance.toExponential(4));
  ok("et le recul s'arrête", R.etat.actif === false, "false", String(R.etat.actif));
}

// ═══════════════════════════════════ 5 bis. les chiffres de vol sont vrais
/* Ce que le voyage AFFICHE désormais — vitesse, dilatation, distance franchie —
   ne vient pas du temps d'écran mais de la position. Ces contrôles vérifient
   que la traduction est juste, et surtout que les DEUX PHASES sont réellement
   traversées : Hugo veut qu'on comprenne qu'on accélère puis qu'on freine, et
   un trajet qui ne montrerait jamais le freinage le tromperait. */
groupe("Ce qu'on affiche pendant le vol");
{
  const d0 = 16 * R.RS_M, d1 = 16000 * R.RS_M, D = d1 - d0;
  Object.assign(R.etat, { actif:true, d0, d1, t:0, duree:10, distance:d0 });

  const vus = new Set();
  let betaMax = 0, gammaMax = 1, croissant = true, sAv = -1;
  for(let i = 0; i < 600; i++){
    R.avance(10/600);
    const v = R.etat.vol;
    if(!v) continue;
    vus.add(v.phase);
    betaMax = Math.max(betaMax, v.beta);
    gammaMax = Math.max(gammaMax, v.gamma);
    if(R.etat.parcouru < sAv - 1) croissant = false;
    sAv = R.etat.parcouru;
  }

  ok("les deux phases sont traversées", vus.has("acceleration") && vus.has("freinage"),
     "acceleration et freinage", [...vus].join(" + "),
     "sans le freinage, on laisserait croire qu'on arrive lancé");
  ok("la distance franchie ne recule jamais", croissant, "toujours croissante",
     croissant ? "600 images" : "une inversion");
  ok("on a bien franchi tout le trajet", Math.abs(R.etat.parcouru - D)/D < 1e-6,
     D.toExponential(4), R.etat.parcouru.toExponential(4));

  /* La vitesse de pointe doit être celle que `trajet()` calcule par un tout
     autre chemin — c'est le contrôle qui attrape une traduction fausse entre
     position et temps propre. */
  const ref = faux.VOYAGE.trajet(D);
  /* Deux bornes, et pas une égalité. Le maximum ÉCHANTILLONNÉ ne peut pas
     tomber pile sur le demi-tour — six cents images à cadence logarithmique le
     franchissent entre deux mesures — donc exiger l'égalité, c'est exiger que
     le hasard du pas coopère. Ce qui doit être vrai, en revanche, l'est dans
     les deux sens : on ne DÉPASSE jamais la vitesse du vol à 1 g, et l'on s'en
     approche à un pour cent. Une traduction fausse entre position et temps
     propre casserait l'une ou l'autre. */
  ok("la vitesse affichée ne dépasse jamais celle du vol à 1 g",
     betaMax <= ref.vmax * (1 + 1e-9),
     "≤ " + ref.vmax.toFixed(6) + " c", betaMax.toFixed(6) + " c");
  ok("et elle l'atteint à un pour cent près", betaMax > ref.vmax * 0.99,
     "> " + (ref.vmax*0.99).toFixed(6) + " c", betaMax.toFixed(6) + " c",
     "référence calculée par `trajet()`, qui ne sait rien du recul ni de son rythme");
  ok("le facteur de dilatation suit la même borne",
     gammaMax <= ref.gamma * (1 + 1e-9) && gammaMax > ref.gamma - 1e-3,
     ref.gamma.toFixed(6), gammaMax.toFixed(6));

  // Aux deux bouts, le vaisseau est à l'arrêt : c'est ce qui rend les phases
  // lisibles sans avoir à les annoncer.
  Object.assign(R.etat, { actif:true, d0, d1, t:0, duree:10, distance:d0 });
  R.avance(1e-6);
  ok("on part à l'arrêt", R.etat.vol && R.etat.vol.beta < 1e-3,
     "≈ 0 c", R.etat.vol ? R.etat.vol.beta.toExponential(2) : "aucun état");
  for(let i = 0; i < 600; i++) R.avance(10/600);
  ok("et l'on arrive à l'arrêt", R.etat.vol && R.etat.vol.beta < 1e-3,
     "≈ 0 c", R.etat.vol ? R.etat.vol.beta.toExponential(2) : "aucun état");
}

// ════════════════════════════════════════════════════ 6. l'étiquette parle
groupe("L'étiquette change d'unité quand il le faut");
{
  ok("une petite maille se dit en rayons", /rₛ$/.test(R.etiquette(3)), "en rₛ", R.etiquette(3));
  ok("une grande maille se dit en UA", /UA$/.test(R.etiquette(1e5)), "en UA", R.etiquette(1e5));
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
