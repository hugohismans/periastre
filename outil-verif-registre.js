/* ============================================================================
   LE REGISTRE TEMPOREL, ÉPROUVÉ AVEC UNE FAUSSE MÉMOIRE.

       node outil-verif-registre.js

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL EXISTE

   Le 7 août 2026, Hugo est tombé à deux images par seconde sur son téléphone.
   La cause était un réglage laissé dans la mémoire du navigateur par une séance
   de jugement. Personne ne l'a vu venir, et pour une raison simple : **rien de
   ce qui touchait à cette mémoire n'était éprouvable hors navigateur.**

   Le registre écrit dans cette même mémoire, à chaque voyage. On lui donne donc
   une fausse, on joue cent trajets, et l'on regarde ce qui se passe — sans
   navigateur, sans rien salir.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ

   De `voyage1g.js`, qui calcule les durées par un autre chemin, et de la
   physique : un voyage relativiste fait TOUJOURS vieillir le voyageur moins que
   celui qui reste. Un écart négatif n'est donc pas un paradoxe, c'est une ligne
   corrompue — et le registre doit le savoir.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const ici = __dirname;
const w = {};
new Function("window", fs.readFileSync(path.join(ici, "voyage1g.js"), "utf8"))(w);
new Function("window", fs.readFileSync(path.join(ici, "registre.js"), "utf8"))(w);
const R = w.REGISTRE, V = w.VOYAGE;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// Une fausse mémoire qui compte ce qu'on lui demande — c'est elle qui permet de
// vérifier qu'on écrit à chaque voyage, et pas une fois sur deux.
function fausseMemoire(depart){
  let contenu = depart === undefined ? null : depart;
  const m = { lectures: 0, ecritures: 0,
    lit(){ m.lectures++; return contenu; },
    ecrit(l){ m.ecritures++; contenu = JSON.parse(JSON.stringify(l)); },
    get contenu(){ return contenu; } };
  return m;
}

console.log("\n  LE REGISTRE TEMPOREL");
console.log("  ════════════════════");

// ═══════════════════════════════════ 1. il écrit vraiment, à chaque voyage
groupe("Chaque trajet laisse sa trace");
{
  const m = fausseMemoire();
  R.pose(m);
  const trajets = [4.24, 25, 27000].map(al => V.trajet(al * V.AL));
  trajets.forEach((t, i) => R.inscrit("essai" + i, t));
  ok("trois voyages, trois lignes", R.tout().length === 3, 3, R.tout().length);
  ok("et trois écritures en mémoire", m.ecritures === 3, 3, m.ecritures,
     "une écriture manquante ne se verrait qu'au rechargement suivant");
  ok("la mémoire contient bien ce qu'on croit",
     Array.isArray(m.contenu) && m.contenu.length === 3, 3,
     Array.isArray(m.contenu) ? m.contenu.length : typeof m.contenu);
}

// ═══════════════════════════════ 2. l'écart, contre le calcul indépendant
/* `voyage1g.js` donne les deux durées ; le registre en fait la somme. On
   recalcule la somme ici, à partir des mêmes trajets mais sans passer par le
   registre — deux chemins pour un nombre. */
groupe("L'écart accumulé est bien la somme des écarts");
{
  const m = fausseMemoire();
  R.pose(m);
  const D = [4.24, 25, 100, 27000].map(al => al * V.AL);
  let attendu = 0;
  for(const d of D){ const t = V.trajet(d); R.inscrit("x", t); attendu += t.t - t.tau; }
  const vu = R.ecart();
  ok("la somme tombe juste", Math.abs(vu - attendu) / attendu < 1e-12,
     attendu.toExponential(6) + " s", vu.toExponential(6) + " s",
     "c'est le seul chiffre qui compte : le temps gagné sur ceux qui sont restés");
  ok("et il est franchement positif", vu > 0, "> 0", vu > 0,
     "un voyage relativiste fait toujours vieillir le voyageur MOINS");
}

// ═══════════════════════════════════════ 3. ce qui est mal formé n'entre pas
groupe("Une ligne mal formée n'entre jamais");
{
  const m = fausseMemoire();
  R.pose(m);
  ok("un trajet absent est refusé", R.inscrit("x", null) === false, false, R.inscrit("x", null));
  ok("un NaN est refusé", R.inscrit("x", { tau: NaN, t: 3 }) === false, false,
     R.inscrit("x", { tau: NaN, t: 3 }));
  ok("un infini est refusé", R.inscrit("x", { tau: 1, t: Infinity }) === false, false,
     R.inscrit("x", { tau: 1, t: Infinity }));
  ok("et rien n'a été écrit", m.ecritures === 0, 0, m.ecritures,
     "un refus qui écrit quand même salit la mémoire pour rien");
  ok("le registre est resté vide", R.tout().length === 0, 0, R.tout().length);
}

// ══════════════════════════ 4. une mémoire d'une ancienne version ne casse rien
/* La mémoire d'un navigateur survit aux versions du site. Une ligne écrite il y
   a six mois peut ne plus avoir la forme attendue — et si elle passe, la somme
   rend `NaN`, qui se propage à tout l'affichage sans lever la moindre erreur. */
groupe("Une mémoire d'une autre époque ne contamine pas la somme");
{
  const vieux = [
    { q: "bon", tau: 100, t: 260 },
    { q: "sans t", tau: 50 },
    "une chaîne, écrite par on ne sait quoi",
    null,
    { q: "texte", tau: "cent", t: "deux cents" },
    { q: "bon aussi", tau: 10, t: 40 },
  ];
  R.pose(fausseMemoire(vieux));
  ok("seules les lignes saines survivent", R.tout().length === 2, 2, R.tout().length,
     "quatre lignes sur six étaient inutilisables");
  ok("et la somme reste un nombre", R.ecart() === 190, 190, R.ecart(),
     "sans le tri, elle rendrait NaN et tout l'affichage avec");
  R.pose(fausseMemoire("pas un tableau du tout"));
  ok("une mémoire qui n'est pas un tableau donne un registre vide",
     R.tout().length === 0, 0, R.tout().length);
}

// ═══════════════════════════════════════════ 5. le plafond de quarante
groupe("Le registre se souvient des quarante derniers voyages");
{
  const m = fausseMemoire();
  R.pose(m);
  for(let i = 0; i < 100; i++) R.inscrit("n" + i, { tau: 1, t: 2, d_m: 1 });
  ok("il en garde quarante", R.tout().length === R.MAX, R.MAX, R.tout().length);
  ok("et ce sont les DERNIERS", R.tout()[R.MAX-1].q === "n99", "n99", R.tout()[R.MAX-1].q,
     "les plus anciens sortent par le début : le registre sert à lire une "
     + "histoire, et une histoire de deux cents lignes ne se lit plus");
  ok("l'écart ne compte que ceux-là", R.ecart() === R.MAX, R.MAX, R.ecart());
}

// ═════════════════════════════ 6. personne ne peut écrire dans le dos du registre
groupe("On ne peut pas écrire dans le dos du registre");
{
  const m = fausseMemoire();
  R.pose(m);
  R.inscrit("un", { tau: 1, t: 5 });
  const copie = R.tout();
  copie.push({ q: "clandestin", tau: 0, t: 1000 });
  copie[0].t = 99999;
  ok("modifier la copie ne change rien", R.tout().length === 1 && R.ecart() === 4,
     "1 ligne, écart 4", R.tout().length + " ligne, écart " + R.ecart(),
     "deux écrivains pour une valeur est la maladie que ce dépôt nomme en "
     + "premier — ici la mémoire ne suivrait pas, et le registre mentirait au "
     + "rechargement suivant");
}

// ═══════════════════════════ 7. une mémoire absente ou qui refuse
/* En navigation privée, `localStorage` lève à la première écriture. Le registre
   doit marcher le temps de la visite et s'oublier en partant — ce qui vaut
   mieux qu'une page morte. */
groupe("Sans mémoire, il marche quand même");
{
  R.pose(null);
  ok("il accepte les voyages", R.inscrit("x", { tau: 1, t: 3 }) === true, true,
     R.inscrit("x", { tau: 1, t: 3 }));
  ok("et il compte juste", R.ecart() === 4, 4, R.ecart());

  const rale = { lit(){ throw new Error("refusé"); }, ecrit(){ throw new Error("plein"); } };
  R.pose(rale);
  ok("une mémoire qui lève à la lecture ne casse rien", R.tout().length === 0, 0, R.tout().length);
  ok("une mémoire qui lève à l'écriture non plus",
     R.inscrit("x", { tau: 2, t: 9 }) === true, true, R.inscrit("x", { tau: 2, t: 9 }),
     "en navigation privée, le registre vit le temps de la visite");
}

// ═══════════════════════════════════════════ 8. cet outil sait échouer
groupe("Cet outil sait échouer");
{
  const casse = fs.readFileSync(path.join(ici, "registre.js"), "utf8")
                  .replace("const MAX = 40;", "const MAX = 4000;");
  const g = {}; new Function("window", casse)(g);
  g.REGISTRE.pose(fausseMemoire());
  for(let i = 0; i < 100; i++) g.REGISTRE.inscrit("n", { tau: 1, t: 2 });
  ok("un plafond desserré est vu", g.REGISTRE.tout().length === 100,
     "le module cassé garde les cent", g.REGISTRE.tout().length);

  const casse2 = fs.readFileSync(path.join(ici, "registre.js"), "utf8")
                   .replace("return lignes.map(e => Object.assign({}, e));", "return lignes;");
  const g2 = {}; new Function("window", casse2)(g2);
  g2.REGISTRE.pose(fausseMemoire());
  g2.REGISTRE.inscrit("un", { tau: 1, t: 5 });
  g2.REGISTRE.tout().push({ q: "clandestin", tau: 0, t: 1000 });
  ok("une liste rendue sans copie est vue", g2.REGISTRE.tout().length === 2,
     "le module cassé laisse entrer le clandestin", g2.REGISTRE.tout().length);
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
