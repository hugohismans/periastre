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
  /* CE CONTRÔLE A CHANGÉ DE CIBLE LE 7 AOÛT 2026, ET IL FAUT DIRE POURQUOI.

     Il exigeait la moyenne GÉOMÉTRIQUE à mi-course : la signature d'un recul
     uniforme en décades, qui était la mise en scène d'alors. Hugo a tranché
     autrement le soir même — « on reste dans l'idée de la simulation, donc il
     faut que ce soit précis. Au début ça va aller doucement, puis au milieu à
     sa vitesse maximale, puis ça va re-ralentir parce qu'on décélère. »

     Un vol à 1 g couvre la MOITIÉ DE LA DISTANCE à la moitié du temps propre,
     par symétrie entre l'accélération et le freinage. C'est donc la moyenne
     ARITHMÉTIQUE qu'on attend maintenant, et l'ancienne exigence est devenue
     l'erreur à détecter : si elle revenait, c'est qu'une courbe de confort
     serait rentrée par la fenêtre. */
  const attendu = (d0 + d1)/2;                        // moyenne ARITHMÉTIQUE
  ok("à mi-course, on a franchi la moitié du chemin",
     Math.abs(R.etat.distance - attendu) / attendu < 1e-4,
     attendu.toExponential(4), R.etat.distance.toExponential(4),
     "c'est la symétrie du vol à 1 g : freiner coûte ce qu'a coûté d'accélérer. "
     + "La moyenne géométrique, " + Math.sqrt(d0*d1).toExponential(4)
     + ", signerait le retour d'un lissage");

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

// ═════════════════════════════ 5 ter. les deux rythmes, et leur honnêteté
/* Décision d'Hugo : les deux existent, en réglage. Ce qui doit rester vrai dans
   les DEUX, c'est que le chiffre affiché corresponde à la position — sinon on
   aurait fabriqué un mode où la vitesse ment. Et ils doivent réellement
   différer, sans quoi le réglage ne réglerait rien. */
groupe("Les deux rythmes, et ce qui ne change pas entre eux");
{
  const d0 = 16 * R.RS_M, d1 = 16000 * R.RS_M, D = d1 - d0;
  const joue = r => {
    R.poseRythme(r);
    Object.assign(R.etat, { actif:true, d0, d1, t:0, duree:10, distance:d0 });
    const dec = [], ecarts = [];
    for(let i = 0; i < 600; i++){
      R.avance(10/600);
      if(i % 60 === 0){
        dec.push(Math.log10(R.etat.distance));
        // la vitesse affichée doit correspondre à la distance ATTEINTE
        const attendu = faux.VOYAGE.etat(D, faux.VOYAGE.enChemin(D, R.etat.parcouru).tau);
        ecarts.push(Math.abs(R.etat.vol.beta - attendu.beta));
      }
    }
    const pas = [];
    for(let i = 1; i < dec.length; i++) pas.push(dec[i] - dec[i-1]);
    return { pas, pireEcart: Math.max(...ecarts), fin: R.etat.distance };
  };

  const fid = joue("fidele"), reg = joue("regulier");
  R.poseRythme("fidele");

  ok("le rythme fidèle dit la vérité sur sa vitesse", fid.pireEcart < 1e-9,
     "< 1e-9", fid.pireEcart.toExponential(1));
  ok("le rythme régulier aussi", reg.pireEcart < 1e-6, "< 1e-6", reg.pireEcart.toExponential(1),
     "c'est le point qui rend le compromis acceptable : seule la cadence est "
     + "retouchée, jamais le chiffre");

  /* CE QUI SÉPARE LES DEUX MODES, ET CE N'EST PAS CE QUE J'AVAIS ÉCRIT.

     J'exigeais du mode réglé un pas CONSTANT, et il rendait 0,725 d'écart. Il
     n'est pas constant, il est SYMÉTRIQUE : lent, rapide au milieu, lent — ce
     qu'Hugo décrivait quand il disait « au début ça va aller doucement, puis au
     milieu à sa vitesse maximale, puis ça va re-ralentir ». Le mode fidèle, lui,
     ralentit sans arrêt du début à la fin. C'est cette opposition-là qui fait
     que le réglage a un sens. */
  const decroit = p => p.every((v, i) => i === 0 || v <= p[i-1] + 1e-9);
  const sommet = p => p.indexOf(Math.max(...p));
  const pic = Math.max(...reg.pas), i = sommet(reg.pas), n = reg.pas.length;

  ok("le rythme réglé va lentement, puis vite au milieu, puis lentement",
     i > n*0.25 && i < n*0.75
       && reg.pas[0] < pic*0.6 && reg.pas[n-1] < pic*0.6,
     "sommet au milieu, extrémités sous 60 % du sommet",
     "sommet au " + Math.round(100*i/(n-1)) + " %, début "
     + Math.round(100*reg.pas[0]/pic) + " %, fin "
     + Math.round(100*reg.pas[n-1]/pic) + " %",
     "c'est le défilement qu'Hugo décrivait — et il ne se mesure pas par une "
     + "symétrie exacte, l'échantillonnage étant décalé d'une image");
  ok("le rythme fidèle, lui, ne fait que ralentir", decroit(fid.pas) && !decroit(reg.pas),
     "décroissant, et l'autre non",
     decroit(fid.pas) ? "décroissant" : "PAS décroissant",
     "0,58 décade sur le premier dixième du trajet, 0,03 sur l'avant-dernier : "
     + "c'est ce qu'on verrait vraiment, et c'est ce que le réglage permet de refuser");
  ok("les deux arrivent au même endroit",
     Math.abs(fid.fin - reg.fin)/d1 < 1e-6, d1.toExponential(4),
     fid.fin.toExponential(4) + " et " + reg.fin.toExponential(4));
}

// ════════════════════════════════════════════ 5 bis. le temps d'écran suit
/* Une durée fixe ne peut pas servir 3,87 décades et 9,10. Mesuré : à vingt-deux
   secondes, le grand trajet renumérote la grille 1,68 fois par seconde au
   milieu ; à cadence constante il durerait cinquante-deux secondes. Hugo a
   tranché pour la racine — ce que ce groupe garde, avec ses deux bouts. */
groupe("Le temps d'écran suit la longueur du trajet");
{
  const PARSEC = 3.0856775814913673e16;
  const depart = 16 * R.RS_M;
  const etoiles = 10000 * R.UA_M;
  const soleil = 8277 * PARSEC;

  const dEtoiles = R.duree(depart, etoiles);
  const dSoleil  = R.duree(depart, soleil);

  ok("le recul d'aujourd'hui garde ses vingt-deux secondes",
     Math.abs(dEtoiles - 22) < 0.5, "≈ 22 s", dEtoiles.toFixed(1) + " s",
     "c'est le trajet sur lequel la durée a été calibrée : le changer serait "
     + "modifier ce qu'Hugo a déjà jugé bon");
  ok("et le système solaire dure environ trente-quatre secondes",
     dSoleil > 32 && dSoleil < 36, "32 à 36 s", dSoleil.toFixed(1) + " s",
     "ni cinquante-deux — trop long à regarder — ni vingt-deux, qui ferait "
     + "défiler deux fois et demie plus vite");
  ok("le long trajet dure plus que le court", dSoleil > dEtoiles,
     "plus long", dSoleil.toFixed(1) + " > " + dEtoiles.toFixed(1));

  // La cadence par décade se resserre, mais jamais du simple au double.
  const parDecade = (d0, d1) => R.duree(d0, d1) / Math.abs(Math.log10(d1) - Math.log10(d0));
  const rapport = parDecade(depart, etoiles) / parDecade(depart, soleil);
  ok("et la cadence ne double jamais", rapport > 1 && rapport < 2,
     "entre 1 et 2", rapport.toFixed(2),
     "au-delà, le grand trajet ne ressemblerait plus au petit — c'est "
     + "exactement ce qu'on refusait en gardant vingt-deux secondes");

  ok("un trajet minuscule ne devient pas un saut d'image",
     R.duree(depart, depart * 1.01) >= 8, "≥ 8 s",
     R.duree(depart, depart * 1.01).toFixed(1) + " s",
     "sous huit secondes le quadrillage n'a pas le temps de changer "
     + "d'étiquette une seule fois, et le voyage se lit comme un raté");

  let mauvais = null;
  for(const [a, b] of [[0, soleil], [depart, 0], [depart, depart], [NaN, soleil], [depart, Infinity]]){
    const v = R.duree(a, b);
    if(!Number.isFinite(v) || v <= 0) mauvais = a + " → " + b + " = " + v;
  }
  ok("et aucune distance absurde ne rend une durée absurde", mauvais === null,
     "toujours un nombre fini positif", mauvais || "toujours",
     "une durée nulle fige l'animation, une durée infinie ne se termine jamais");
}

// ════════════════════════════════════════════════════ 6. l'étiquette parle
/* CE QU'ON GARDE VRAIMENT ICI : QU'UN NOMBRE RESTE LISIBLE SUR NEUF DÉCADES.

   Le recul allait aux étoiles S — quatre décades, où deux unités suffisaient.
   Le trajet vers le système solaire en fait neuf, et sans troisième unité la
   maille d'arrivée s'écrirait « 1 700 000 000 000 UA ». Ce n'est pas une faute
   de calcul, c'est une étiquette que personne ne lit — et l'étiquette est TOUT
   le dispositif : c'est son saut, décade après décade, qui fait sentir la
   distance. Le contrôle balaie donc le vrai trajet et exige que chaque
   étiquette reste courte. */
groupe("L'étiquette reste lisible sur les neuf décades du vrai trajet");
{
  ok("une petite maille se dit en rayons", /rₛ$/.test(R.etiquette(3)), "en rₛ", R.etiquette(3));
  ok("une grande maille se dit en UA", /UA$/.test(R.etiquette(1e5)), "en UA", R.etiquette(1e5));
  ok("et une très grande en années-lumière",
     / al$/.test(R.etiquette(8277 * 3.0856775814913673e16 / R.RS_M)),
     "en al", R.etiquette(8277 * 3.0856775814913673e16 / R.RS_M));

  /* Le balayage. De seize rayons au système solaire, dix points par décade :
     aucune étiquette ne doit dépasser douze signes, unité comprise. Douze,
     c'est « 27 000 al » avec de la marge — au-delà on est dans le nombre qu'on
     ne lit pas. */
  const arrivee = 8277 * 3.0856775814913673e16 / R.RS_M;
  let pire = "", pireN = 0, chiffresDeSuite = 0;
  for(let l = Math.log10(16); l <= Math.log10(arrivee) + 1e-9; l += 0.1){
    const e = R.etiquette(Math.pow(10, l));
    if(e.length > pireN){ pireN = e.length; pire = e; }
    const n = (e.match(/\d/g) || []).length;
    if(n > chiffresDeSuite) chiffresDeSuite = n;
  }
  ok("aucune étiquette ne dépasse douze signes", pireN <= 12, "≤ 12", pireN + " (« " + pire + " »)",
     "une étiquette trop longue n'est pas une erreur de calcul : c'est le "
     + "dispositif qui cesse de fonctionner, puisque c'est son saut qui fait "
     + "sentir la distance");
  ok("et jamais plus de six chiffres d'affilée", chiffresDeSuite <= 6, "≤ 6", chiffresDeSuite);

  /* Les trois unités se succèdent sans trou ni retour en arrière.

     On balaie les MAILLES, pas la distance, et c'est la correction d'une erreur
     que ce contrôle a attrapée sur moi : à seize rayons — le départ du salon —
     on est déjà à 1,4 UA, donc un balayage parti de là ne voit jamais l'unité
     des rayons et n'en compte que deux. La maille fine, elle, vaut 10^(décade−1)
     et descend bien à un rayon au début du recul. C'est elle qu'on étiquette. */
  const unite = rs => (R.etiquette(rs).match(/[^\d\s.,  ]+$/) || [""])[0];
  const suite = [];
  for(let l = 0; l <= Math.log10(arrivee); l += 0.05){
    const u = unite(Math.pow(10, l));
    if(u !== suite[suite.length - 1]) suite.push(u);
  }
  ok("les trois unités se succèdent une fois chacune, dans l'ordre",
     suite.length === 3 && /rₛ/.test(suite[0]) && /UA/.test(suite[1]) && /al/.test(suite[2]),
     "rₛ → UA → al", suite.length + " : " + suite.join(" → "),
     "une unité qui reviendrait en arrière ferait un yo-yo d'étiquettes au "
     + "milieu d'un trajet où l'on compte sur elles pour savoir où l'on est");

  /* LES MOTS VIENNENT DE LA PAGE, et le repli est du français lisible. Une page
     qui oublierait `poseMots` ne doit pas afficher de clé nue — c'est le défaut
     qu'on traque partout ailleurs, et il serait ici invisible pendant tout un
     recul avant que quelqu'un s'en aperçoive. */
  ok("sans `poseMots`, l'étiquette reste une phrase française",
     / (rₛ|UA|al)$/.test(R.etiquette(3)) && / (rₛ|UA|al)$/.test(R.etiquette(1e9)),
     "des unités écrites", R.etiquette(3) + " / " + R.etiquette(1e9));

  R.poseMots({ ua: " AU", al: " ly", rs: " rs", locale: "en-US" });
  ok("et la page peut les remplacer", / AU$/.test(R.etiquette(1e5)) && / ly$/.test(R.etiquette(arrivee)),
     "en anglais", R.etiquette(1e5) + " / " + R.etiquette(arrivee));
  ok("le séparateur des milliers suit la langue",
     R.etiquette(arrivee).indexOf(",") >= 0 || /\d{4}/.test(R.etiquette(arrivee)),
     "à l'anglaise", R.etiquette(arrivee));
  R.poseMots({ ua: " UA", al: " al", rs: " rₛ", locale: "fr-FR" });   // on rend la scène propre
  ok("et on retrouve le français ensuite", / al$/.test(R.etiquette(arrivee)), "en al", R.etiquette(arrivee));

  // Les clés existent dans les deux fichiers de langue — sinon la page pose des
  // clés nues dans le module, et l'étiquette dirait « recul.ua ».
  const fs2 = require("fs"), path2 = require("path");
  const FR = fs2.readFileSync(path2.join(__dirname, "ui.fr.js"), "utf8");
  const EN = fs2.readFileSync(path2.join(__dirname, "ui.en.js"), "utf8");
  let manque = null;
  for(const c of ["recul.case", "recul.distance", "recul.rs", "recul.ua", "recul.al"]){
    if(FR.indexOf('"' + c + '"') < 0) manque = "fr · " + c;
    if(EN.indexOf('"' + c + '"') < 0) manque = "en · " + c;
  }
  ok("les cinq mots existent dans les deux langues", manque === null, "toutes", manque || "toutes");
}

/* ══════════════════════════════════════════════════════════════════════════
   LE PILOTAGE — les trois règles de mise en scène

   Elles vivaient dans `majVoyage()`, au milieu du câblage de la page, et rien
   ne les lisait. Les trois ont été posées par l'œil d'Hugo après qu'il ait vu
   le défaut correspondant : l'astre qui saute du coin au centre, le quadrillage
   qui entre brutalement quand la visée pivote, la carte qui coupe le recul en
   deux. Trois défauts vus, donc trois contrôles — règle 1.

   D'OÙ VIENT LA VÉRITÉ ICI. Le recentrage vise l'angle que porte la direction
   de l'astre : on le prend d'`atan2` et d'`asin` appliqués à cette direction,
   pas de ce que le module recalcule. Et l'écart le plus court se mesure par
   `atan2(sin Δ, cos Δ)`, qui est une autre dérivation du même repliement que la
   boucle `while` qu'on éprouve — deux chemins, pas un miroir.
   ══════════════════════════════════════════════════════════════════════════ */

/* Le devant du regard dans la pièce : avant = −z, la baie est de ce côté.

   C'est la DÉFINITION géométrique, celle que `regardSalon()` applique dans la
   page. Elle est récrite ici parce qu'un contrôle doit pouvoir juger une visée
   sans monter le document autour — et `recul.js` ne la contient pas : il reçoit
   ce repère tout calculé, précisément pour qu'il n'y ait qu'une seule loi. */
const avant = (lacet, tangage) => {
  const cl = Math.cos(lacet), sl = Math.sin(lacet);
  const ct = Math.cos(tangage), st = Math.sin(tangage);
  return [ ct*sl, st, -ct*cl ];
};
// L'écart le plus court entre deux caps, par un tout autre chemin que le module.
const ecart = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

/* Une copie de `recul.js` dont on a cassé une règle, en mémoire.

   Elle rend `null` quand l'ancre a disparu du fichier : sans ça, un renommage
   rendrait les auto-tests muets — ils compareraient un module intact à
   lui-même et resteraient verts en ne prouvant plus rien. */
function casse(...remplacements){
  let src = fs.readFileSync(path.join(__dirname, "recul.js"), "utf8");
  for(const [de, vers] of remplacements){
    if(!src.includes(de)) return null;
    src = src.split(de).join(vers);
  }
  const g = {};
  new Function("window", fs.readFileSync(path.join(__dirname, "voyage1g.js"), "utf8"))(g);
  new Function("window", src)(g);
  return g.RECUL;
}

/* ---------------------------------------------------------------------------
   LES QUATRE ÉPREUVES FALSIFIABLES

   Chacune rend un verdict et une mesure. On les joue d'abord sur le vrai
   module, où elles doivent passer ; puis, tout en bas, sur des copies dont on a
   cassé exactement la règle qu'elles surveillent, où elles doivent TOMBER.
   Une épreuve qui reste verte sur une règle cassée ne contrôle rien. */

// Des caps de part et d'autre de la couture ±π, plus un témoin loin d'elle.
const COUTURES = [
  [-3.10,  3.10],   // cinq degrés d'écart, vus comme six radians par un naïf
  [ 3.10, -3.10],   // le même, en miroir : il doit tourner dans l'AUTRE sens
  [-3.05,  3.05],
  [ 3.05, -3.05],
  [ 6.50,  0.20],   // un lacet jamais normalisé — la page ne le ramène pas
  [-6.50, -0.20],
  [ 0.10, -0.10],   // témoin : loin de la couture, rien ne doit changer
];

const DT = 1/60;
const K = Math.min(1, DT * 0.8);   // le réglage d'Hugo, écrit ici en clair

function epreuveCouture(M){
  let pireDetour = 0, pireSaut = 0, sensJuste = true, ou = "";
  for(const [l0, cible] of COUTURES){
    const va = avant(cible, 0);
    const court = Math.abs(ecart(cible, l0));      // vérité indépendante
    let l = l0, chemin = 0;
    for(let i = 0; i < 3000; i++){
      const p = M.recentre(va, l, 0, DT);
      const pas = p.lacet - l;
      if(i === 0){
        if(Math.sign(pas) !== Math.sign(ecart(cible, l0))){ sensJuste = false; ou = l0 + "→" + cible; }
        pireSaut = Math.max(pireSaut, Math.abs(pas) / K);
      }
      chemin += Math.abs(pas);
      l = p.lacet;
    }
    // Le chemin parcouru ne peut pas dépasser l'écart le plus court : un fondu
    // qui approche sa cible sans jamais la dépasser parcourt exactement ça.
    pireDetour = Math.max(pireDetour, chemin / court);
    if(Math.abs(ecart(l, cible)) > 1e-9){ sensJuste = false; ou = "n'arrive pas : " + l0; }
  }
  return {
    ok: sensJuste && pireDetour <= 1 + 1e-6 && pireSaut <= Math.PI + 1e-9,
    detour: pireDetour, saut: pireSaut, sensJuste, ou,
  };
}

function epreuvePlafond(M){
  const cible = 2.4, tCible = -0.31, va = avant(cible, tCible);
  let pire = "";
  for(const dt of [DT, 0.5, 1.25, 3, 60, 1e6]){
    let l = -1.2, t = 0.9, prec = Infinity;
    for(let i = 0; i < 200; i++){
      const p = M.recentre(va, l, t, dt);
      l = p.lacet; t = p.tangage;
      const e = Math.hypot(ecart(l, cible), t - tCible);
      // Jamais plus loin qu'à l'image d'avant : c'est ça, « ne pas dépasser ».
      if(!(e <= prec + 1e-12)) return { ok:false, ou:"dt=" + dt + ", image " + i
                                                   + " : " + prec.toExponential(2)
                                                   + " → " + e.toExponential(2) };
      prec = e;
    }
    // Au-delà d'une seconde et quart, le plafond vaut 1 : on arrive PILE.
    if(dt >= 1.25 && (Math.abs(ecart(l, cible)) > 1e-12 || Math.abs(t - tCible) > 1e-12))
      pire = "dt=" + dt + " n'arrive pas pile";
  }
  return { ok: pire === "", ou: pire || "aucun dépassement, aucune oscillation" };
}

function epreuveBornes(M){
  let hors = 0, mono = true, fini = true, ou = "";
  for(const vitesse of [0.85, 2.2]){
    for(const dt of [1e-3, DT, 0.25, 0.5, 1, 2, 5, 60, 1e6]){
      for(const [depart, cible] of [[0,1], [1,0], [0.37,1], [0.61,0]]){
        let v = depart;
        for(let i = 0; i < 60; i++){
          const w = M.fondu(v, cible, dt, vitesse);
          // Un fondu qui diverge finit par rendre l'infini, puis NaN — et NaN
          // avale toute comparaison en silence. On le nomme au lieu de le laisser
          // traverser la mesure.
          if(!Number.isFinite(w)){ fini = false; ou = "dt=" + dt + " diverge"; break; }
          hors = Math.max(hors, -w, w - 1);
          if(cible > depart ? w < v - 1e-12 : w > v + 1e-12){
            mono = false; ou = "dt=" + dt + ", vitesse " + vitesse;
          }
          v = w;
        }
      }
    }
  }
  return { ok: fini && hors <= 1e-12 && mono, hors, mono, fini,
           ecart: fini ? hors.toExponential(2) : "divergé (" + ou + ")", ou };
}

function epreuveChamp(M){
  const joue = (actif, vue, depart, retour) => {
    M.etat.actif = actif;
    const tele = { grille: depart, carte: 0, retour: !!retour };
    for(let i = 0; i < 600; i++) M.fondus(tele, DT, vue);
    return tele;
  };
  const cas = {
    monte:  joue(true,  0.97, 0).grille,   // on bouge et on regarde l'astre
    baisse: joue(true,  0.20, 1).grille,   // on bouge mais on regarde ailleurs
    eteint: joue(false, 0.97, 0).grille,   // on ne bouge plus : rien ne se lève
    tombe:  joue(false, 0.97, 1).grille,   // ... et ce qui était levé redescend
    juste:  joue(true,  0.56, 0).grille,   // juste au-dessus du seuil d'Hugo
    sous:   joue(true,  0.54, 1).grille,   // juste en dessous
  };
  M.etat.actif = false;
  return {
    ok: cas.monte > 0.99 && cas.baisse < 0.01 && cas.eteint === 0
        && cas.tombe < 0.01 && cas.juste > 0.99 && cas.sous < 0.01,
    cas,
  };
}

// ══════════════════════════════════════════ 7. le recentrage vise vraiment l'astre
groupe("Le recentrage ramène la visée sur ce qu'on quitte");
{
  const lCible = 2.4, tCible = -0.31;
  const va = avant(lCible, tCible);
  let l = -1.2, t = 0.62;
  for(let i = 0; i < 3000; i++){
    const p = R.recentre(va, l, t, DT);
    l = p.lacet; t = p.tangage;
  }
  /* La vérité vient de la DIRECTION, pas du module : ce sont les angles que
     porte `va` elle-même. Si `recentre` visait un autre point, il pourrait très
     bien y converger proprement — et ce contrôle le verrait quand même. */
  const lVrai = Math.atan2(va[0], -va[2]);
  const tVrai = Math.asin(va[1]);

  /* On compare des CAPS, pas des nombres. La page ne normalise jamais le lacet
     — il s'accumule à la souris et peut valoir −3,88 là où l'astre en porte
     2,40 : c'est le même cap, atteint par le court chemin, et c'est justement
     pour ça que le repliement de l'écart doit être juste. Exiger l'égalité des
     nombres ferait échouer ce contrôle sur du code parfait. */
  ok("le lacet finit sur celui de l'astre", Math.abs(ecart(l, lVrai)) < 1e-9,
     "écart nul avec " + lVrai.toFixed(6),
     l.toFixed(6) + ", soit un écart de " + ecart(l, lVrai).toExponential(2),
     "vérité prise sur `atan2` de la direction, pas sur le calcul qu'on éprouve");
  ok("le tangage aussi", Math.abs(t - tVrai) < 1e-9, tVrai.toFixed(9), t.toFixed(9));
  ok("et l'astre est alors droit devant",
     R.enVue(avant(l, t), va) > 1 - 1e-12, "≈ 1", R.enVue(avant(l, t), va).toFixed(12),
     "sans quoi la carte des étoiles ferait sauter l'objet du coin au centre");

  const rien = R.recentre(null, 1.3, -0.2, DT);
  ok("sans direction connue, il ne touche à rien",
     rien.lacet === 1.3 && rien.tangage === -0.2, "1.3 / -0.2",
     rien.lacet + " / " + rien.tangage);
}

// ═══════════════════════════════════ 8. la couture ±π — le contrôle qui compte
/* Le défaut le plus discret du domaine. Il ne se déclenche que sur un secteur
   étroit de la boussole : deux visées à cinq degrés l'une de l'autre, posées de
   part et d'autre de ±π, et la pièce part faire un tour complet à l'envers.
   Relire le code ne l'attrape pas ; le mesurer, si. */
groupe("Le recentrage prend le plus court chemin, même par-dessus la couture");
{
  const e = epreuveCouture(R);
  ok("il tourne toujours du bon côté", e.sensJuste, "le sens de l'écart replié",
     e.sensJuste ? "les sept cas" : "faux sur " + e.ou,
     "+3,10 et −3,10 rad sont voisins : ils doivent tourner en sens OPPOSÉS");
  ok("et il ne fait jamais le tour long", e.detour <= 1 + 1e-6, "≤ 1,000000",
     e.detour.toFixed(6),
     "chemin parcouru rapporté à l'écart le plus court, mesuré par `atan2` — "
     + "le tour long donnerait 74");
  ok("aucun premier pas ne vaut plus d'un demi-tour", e.saut <= Math.PI + 1e-9,
     "≤ " + Math.PI.toFixed(6), e.saut.toFixed(6),
     "l'écart suivi doit tenir dans ]−π, π] avant d'être multiplié par le pas");
}

// ═════════════════════════════════════ 9. il ne dépasse pas, même après un gel
/* Un onglet passé en arrière-plan rend la main avec plusieurs secondes d'un
   coup. `k = min(1, dt·0,8)` est plafonné pour ça : on arrive pile, on
   n'oscille pas autour de la cible. */
groupe("Le recentrage ne dépasse pas, quel que soit le pas de temps");
{
  const e = epreuvePlafond(R);
  ok("l'écart ne remonte jamais, et un pas énorme arrive pile", e.ok,
     "aucun dépassement", e.ou,
     "pas de temps éprouvés : 1/60 s jusqu'à un million de secondes");
}

// ═══════════════════════════════════════════ 10. les deux fondus restent chez eux
groupe("Les deux fondus sont monotones et bornés");
{
  const e = epreuveBornes(R);
  ok("jamais hors de [0, 1]", e.fini && e.hors <= 1e-12, "0", e.ecart,
     "une opacité négative ou au-delà de 1 se voit : c'est un clignotement");
  ok("et jamais un pas en arrière", e.mono, "monotone",
     e.mono ? "monotone" : "recul sur " + e.ou,
     "quatre départs, deux vitesses, neuf pas de temps dont un million de secondes");
}

// ═════════════════════════════════════════ 11. le quadrillage suit le regard
groupe("Le quadrillage ne se lève que pendant le mouvement, et face à l'astre");
{
  const e = epreuveChamp(R);
  const c = e.cas;
  ok("il monte quand on bouge en regardant l'astre", c.monte > 0.99, "> 0,99",
     c.monte.toFixed(4));
  ok("il descend quand on détourne le regard", c.baisse < 0.01, "< 0,01",
     c.baisse.toFixed(4),
     "sans cette condition il se levait hors écran, puis ENTRAIT brutalement "
     + "quand la visée pivotait — l'apparition buguée qu'Hugo a vue");
  ok("il reste à zéro quand on ne bouge plus", c.eteint === 0, "0", c.eteint,
     "rien ne quadrille l'espace : le repère n'existe que pour prouver le mouvement");
  ok("et ce qui était levé redescend à l'arrêt", c.tombe < 0.01, "< 0,01",
     c.tombe.toFixed(4));
  ok("le seuil d'Hugo sépare bien les deux cas",
     c.juste > 0.99 && c.sous < 0.01, "0,56 monte et 0,54 descend",
     c.juste.toFixed(4) + " et " + c.sous.toFixed(4),
     "0,55 de cosinus, soit 57° — c'est un réglage de l'œil, pas un calcul");
}

// ══════════════════════════════ 12. un vol entier, dans l'ordre du récit
/* Le contrôle de bout en bout : on part DOS À L'ASTRE, on fait le voyage, on
   arrive. Ce qui doit tenir tout du long, c'est l'ORDRE — on s'éloigne, le trou
   noir disparaît, ET ALORS la carte montre ce qui tourne autour de ce vide. */
groupe("Un vol entier : chaque chose à son moment");
{
  R.poseRythme("fidele");
  R.etat.distance = 16 * R.RS_M;
  R.lance(16000 * R.RS_M, 22);

  /* Pendant un recul RADIAL, la direction de l'astre ne bouge pratiquement pas
     dans le repère de la pièce — on s'écarte en gardant son cap. On la tient
     donc fixe, et le contrôle porte alors sur le pilotage seul. */
  const va = avant(0.9, -0.12);
  let lacet = 0.9 + Math.PI, tangage = 0.5;      // on commence en regardant ailleurs
  const tele = { grille: 0, carte: 0, retour: false };

  let carteEnVol = 0, grilleMax = 0, grilleHorsChamp = 0, images = 0, leve = -1;
  while(R.etat.actif && images < 4000){
    R.avance(DT);
    const p = R.recentre(va, lacet, tangage, DT);
    lacet = p.lacet; tangage = p.tangage;
    const vue = R.enVue(avant(lacet, tangage), va);
    R.fondus(tele, DT, vue);
    images++;
    /* L'image d'arrivée est la PREMIÈRE où la carte a le droit de commencer :
       `avance` y éteint `actif`. On ne mesure donc le vol que tant qu'il dure,
       sans quoi on reprocherait à la règle de s'appliquer. */
    if(!R.etat.actif) break;
    carteEnVol = Math.max(carteEnVol, tele.carte);
    grilleMax  = Math.max(grilleMax, tele.grille);
    if(vue <= 0.55) grilleHorsChamp = Math.max(grilleHorsChamp, tele.grille);
    if(leve < 0 && tele.grille > 0.5) leve = images;
  }

  ok("la carte reste éteinte pendant TOUT le trajet", carteEnVol < 1e-12,
     "0", carteEnVol.toExponential(2),
     "elle se levait autrefois passé un seuil de distance : le recul se trouvait "
     + "coupé en deux et le fond étoilé effacé au moment le plus intéressant");
  ok("le quadrillage, lui, s'est bien levé en route", grilleMax > 0.99, "> 0,99",
     grilleMax.toFixed(4), "levé à l'image " + leve + " sur " + images);
  ok("mais jamais tant qu'on regardait ailleurs", grilleHorsChamp <= 0.01,
     "≤ 0,01", grilleHorsChamp.toFixed(4),
     "on part dos à l'astre : le recentrage doit l'avoir ramené AVANT que le "
     + "repère ne paraisse");
  ok("et le voyage s'est bien terminé", !R.etat.actif && images < 4000,
     "arrivé", images + " images");

  // Dix secondes de plus, à l'arrêt : l'instrument prend la main.
  for(let i = 0; i < 600; i++){
    R.avance(DT);
    R.fondus(tele, DT, R.enVue(avant(lacet, tangage), va));
  }
  ok("à l'arrivée, la carte se lève", tele.carte > 0.99, "> 0,99", tele.carte.toFixed(4));
  ok("et le quadrillage s'efface", tele.grille < 0.01, "< 0,01", tele.grille.toFixed(4),
     "on ne bouge plus, donc il n'a plus rien à prouver");

  /* Le retour est l'autre moitié de la règle : on rentre, la carte s'efface et
     ne doit PAS se relever à l'arrivée — sinon on finirait le voyage devant un
     télescope alors qu'on est revenu regarder par la baie. */
  const rentre = { grille: 0, carte: 1, retour: true };
  R.etat.actif = false;
  for(let i = 0; i < 600; i++) R.fondus(rentre, DT, 0.97);
  ok("au retour, la carte s'efface et ne revient pas", rentre.carte < 0.01,
     "< 0,01", rentre.carte.toFixed(4));
}

// ══════════════════════════ 13. et ces quatre contrôles savent tomber
/* Règle 2. On casse dans une copie en mémoire exactement la règle que chaque
   épreuve surveille, et l'épreuve doit virer au rouge. Si elle restait verte,
   elle ne contrôlerait rien — et les groupes 8 à 11 ne prouveraient rien non
   plus. Les ancres sont vérifiées : un renommage rend `casse()` nulle, et le
   contrôle échoue au lieu de se taire. */
groupe("Ces contrôles savent tomber");
{
  const sansCouture = casse(["while(dl >  Math.PI)", "while(false && dl >  Math.PI)"],
                            ["while(dl < -Math.PI)", "while(false && dl < -Math.PI)"]);
  ok("sans le repliement en ]−π, π], la couture est vue",
     sansCouture !== null && epreuveCouture(sansCouture).ok === false,
     "l'épreuve tombe",
     sansCouture === null ? "ANCRE INTROUVABLE dans recul.js"
       : (epreuveCouture(sansCouture).ok ? "elle reste verte" : "détour ×"
          + epreuveCouture(sansCouture).detour.toFixed(1)));

  const sansPlafondK = casse(["Math.min(1, dt * RECENTRAGE)", "(dt * RECENTRAGE)"]);
  ok("sans le plafond du recentrage, le dépassement est vu",
     sansPlafondK !== null && epreuvePlafond(sansPlafondK).ok === false,
     "l'épreuve tombe",
     sansPlafondK === null ? "ANCRE INTROUVABLE dans recul.js"
       : (epreuvePlafond(sansPlafondK).ok ? "elle reste verte" : "vue"));

  const sansPlafondF = casse(["Math.min(1, dt * vitesse)", "(dt * vitesse)"]);
  ok("sans le plafond du fondu, la sortie de [0, 1] est vue",
     sansPlafondF !== null && epreuveBornes(sansPlafondF).ok === false,
     "l'épreuve tombe",
     sansPlafondF === null ? "ANCRE INTROUVABLE dans recul.js"
       : (epreuveBornes(sansPlafondF).ok ? "elle reste verte"
          : epreuveBornes(sansPlafondF).ecart));

  const sansChamp = casse(["(etat.actif && vue > s)", "(etat.actif)"]);
  ok("sans la condition de champ, l'apparition buguée est vue",
     sansChamp !== null && epreuveChamp(sansChamp).ok === false,
     "l'épreuve tombe",
     sansChamp === null ? "ANCRE INTROUVABLE dans recul.js"
       : (epreuveChamp(sansChamp).ok ? "elle reste verte" : "quadrillage à "
          + epreuveChamp(sansChamp).cas.baisse.toFixed(3) + " le regard détourné"));
}

/* ═══════════ LE SEUIL DU CHAMP SUIT LA FORME DE L'ÉCRAN

   Le défaut, mesuré dans la page le 8 août : un angle fixe de 56,6° tombe juste
   au-delà du coin d'un écran 16:9 (52,8°) — parfait, c'est là qu'Hugo l'a réglé
   — mais très loin au-delà du coin d'un téléphone en portrait (35,4°). Le
   quadrillage y paraissait EN ENTIER une seconde et demie avant que l'astre
   n'entre dans l'image : mot pour mot le défaut qu'il avait signalé.

   LA VÉRITÉ VIENT D'AILLEURS : on ne relit pas la formule du module. On
   fabrique la direction du coin de l'image en INVERSANT `projette` — dont le
   pixel vaut (x/z·F·H + W)/2 — et l'on interroge son cosinus. Deux propriétés
   suffisent, et elles valent pour n'importe quelle forme d'écran :

     · le coin de l'image est dans le champ (sinon le quadrillage ne monte pas
       alors qu'on voit l'astre) ;
     · une direction bien au-delà du coin ne l'est pas (c'est l'apparition
       buguée : lever sur ce qu'on ne voit pas).

   C'est la seconde que l'angle fixe viole, et sur les écrans étroits seulement. */
{
  groupe("Le seuil du champ suit la forme de l'écran");

  // Le réglage d'Hugo, sur l'écran où il l'a posé. Ce n'est pas une tolérance de
  // confort : si ce chiffre bouge, c'est qu'on a défait son travail.
  const bureau = R.seuilEnVue(1.55, 1280, 720);
  ok("sur un 16:9, on retrouve le 0,55 d'Hugo", Math.abs(bureau - 0.55) < 0.002,
     "0,55 ± 0,002", bureau.toFixed(4),
     "la règle PART de son réglage — un écart ici voudrait dire qu'on l'a perdu");

  const tel = R.seuilEnVue(1.55, 375, 812);
  ok("en portrait, le seuil se resserre", tel > bureau + 0.15,
     "> " + (bureau + 0.15).toFixed(3), tel.toFixed(4),
     "un écran plus étroit voit moins loin : le seuil DOIT monter, sinon rien n'a changé");

  // Le cosinus de la direction du coin, pour une forme d'écran donnée.
  const cosDuCoin = (F, W, H) => F / Math.hypot(W/H, 1, F);

  const formes = [[1280,720], [375,812], [900,900], [2560,1080], [768,1024]];
  const juge = seuil => {
    let coin = null, dehors = null;
    for(const [W, H] of formes){
      const F = 1.55, s = seuil(F, W, H), c = cosDuCoin(F, W, H);
      if(!(c > s)) coin = coin || { W, H, cos: +c.toFixed(4), seuil: +s.toFixed(4) };
      // Une fois et demie l'écart angulaire au coin : franchement dehors.
      const loin = Math.cos(Math.acos(c) * 1.5);
      if(!(loin < s)) dehors = dehors || { W, H, cos: +loin.toFixed(4), seuil: +s.toFixed(4) };
    }
    return { coin, dehors };
  };

  const v = juge(R.seuilEnVue);
  ok("le coin de l'image est TOUJOURS dans le champ — 5 formes",
     v.coin === null, "aucune forme en défaut", v.coin ? JSON.stringify(v.coin) : "aucune");
  ok("et une direction bien au-delà du coin ne l'est jamais — 5 formes",
     v.dehors === null, "aucune forme en défaut",
     v.dehors ? JSON.stringify(v.dehors) : "aucune");

  ok("une mesure absurde retombe sur le réglage d'origine",
     R.seuilEnVue(0, 1280, 720) === 0.55 && R.seuilEnVue(1.55, 0, 0) === 0.55,
     "0,55", R.seuilEnVue(1.55, 0, 0),
     "la page mesure 0×0 tant que la fenêtre n'a pas été mesurée : pas de NaN là");

  /* LE SABOTAGE, ET IL DOIT ÊTRE PRÉCIS. On rejoue le même jugement avec
     l'ancienne règle — l'angle fixe. Elle doit violer la seconde propriété, et
     seulement elle : un contrôle qui la rejetterait EN BLOC condamnerait le
     réglage d'Hugo au lieu de condamner le défaut. */
  const ancienne = juge(() => 0.55);

  /* L'ANGLE FIXE FAUTE DES DEUX CÔTÉS, ET JE M'ATTENDAIS À UN SEUL.

     J'avais écrit « le défaut est d'un seul côté : trop large sur écran
     étroit ». C'est faux, et c'est la mesure qui l'a dit. Le cosinus du coin,
     par forme :

         2560 × 1080   0,516   coin à 58,9°   SOUS le seuil fixe
         1280 ×  720   0,605   coin à 52,8°   au-dessus — le réglage d'Hugo
          900 ×  900   0,739   coin à 42,4°
          768 × 1024   0,778   coin à 38,9°
          375 ×  812   0,815   coin à 35,4°   très au-dessus

     Sur un écran très large, le coin est à 58,9° — au-DELÀ des 56,6° du seuil
     fixe. Le quadrillage refuse alors de monter alors que l'astre est visible
     dans le coin : le défaut exactement inverse de celui du téléphone, et tout
     aussi réel.

     Un angle fixe ne peut pas être juste sur deux formes d'écran différentes.
     Ce n'est pas un réglage à retoucher, c'est une grandeur qui manquait. */
  ok("l'angle fixe laisse passer ce qui est HORS de l'écran — écran étroit",
     ancienne.dehors !== null, "au moins une forme en défaut",
     ancienne.dehors ? JSON.stringify(ancienne.dehors) : "AUCUNE — le contrôle ne mord pas",
     "sans ça, ce groupe surveillerait une règle que l'ancienne satisfaisait déjà");
  ok("et il refuse le coin de l'écran alors qu'on l'y voit — écran très large",
     ancienne.coin !== null, "au moins une forme en défaut",
     ancienne.coin ? JSON.stringify(ancienne.coin) : "AUCUNE",
     "le défaut inverse, sur 2560×1080 : le quadrillage ne monte pas du tout");
  ok("le 16:9 d'Hugo n'est en défaut d'aucun des deux côtés",
     (!ancienne.coin   || !(ancienne.coin.W   === 1280 && ancienne.coin.H   === 720)) &&
     (!ancienne.dehors || !(ancienne.dehors.W === 1280 && ancienne.dehors.H === 720)),
     "le bureau hors de cause",
     "coin : " + (ancienne.coin ? ancienne.coin.W + "×" + ancienne.coin.H : "—")
     + " · dehors : " + (ancienne.dehors ? ancienne.dehors.W + "×" + ancienne.dehors.H : "—"),
     "c'est ce qui prouve qu'on corrige un défaut de format, pas un choix d'œil");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
