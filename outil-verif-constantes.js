/* ============================================================================
   LES CONSTANTES ASTRONOMIQUES — UNE SEULE VÉRITÉ, ET ELLE SE DÉRIVE

       node outil-verif-constantes.js

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL EXISTE

   L'unité astronomique est écrite QUATRE FOIS dans le dépôt, l'année-lumière
   trois, le parsec deux. Neuf déclarations pour trois grandeurs, dans des
   fichiers qui ne se parlent pas — `echelle.js`, `recul.js`, `voyage1g.js`,
   `lune.js`, `index.html`.

   Elles s'accordent aujourd'hui. C'est précisément ce qui rend la chose
   dangereuse : rien ne les y oblige, et le dépôt a déjà payé cette maladie deux
   fois. Le disque tournait 622 fois trop vite parce que deux mécanismes
   écrivaient la même horloge. Et le 9 août, une table de destinations morte
   portait des distances DIFFÉRENTES de celles de la page — mille unités
   astronomiques ici, dix mille là-bas — sans que personne puisse le voir.

   Réunir les neuf déclarations en une seule demanderait un module partagé que
   `lune.js` et `echelle.js` devraient charger, alors qu'aucun des deux n'est
   branché à la page. Ce serait une dette de plus, pas une de moins. On garde
   donc les copies ET ON LES GARDE — c'est le même remède que pour la liste des
   lieux d'aveu, recopiée dans `aveu.js` et surveillée depuis `contrat.js`.

   ---------------------------------------------------------------------------
   D'OÙ IL TIRE SA VÉRITÉ — et c'est ce qui le sauve d'être un miroir

   Comparer les copies entre elles ne prouverait RIEN sur leur justesse : neuf
   fichiers d'accord sur une valeur fausse restent neuf fichiers faux. C'est le
   piège de la règle 3, et il s'est déjà refermé deux fois sur ce dépôt.

   Deux des trois grandeurs se DÉRIVENT, exactement, de choses qui ne sont pas
   dans ces fichiers :

     l'année-lumière   c × 365,25 × 86 400, où c = 299 792 458 m/s est exact par
                       la définition du mètre, et où l'année julienne de 365,25
                       jours est celle que l'UAI emploie pour cette unité ;

     le parsec         (648 000 / π) × ua — c'est sa définition même : la
                       distance d'où une unité astronomique sous-tend une
                       seconde d'arc, et 648 000/π est le nombre de secondes
                       d'arc dans un radian.

   La troisième, l'unité astronomique, n'est pas mesurée : c'est une CONVENTION
   fixée par l'UAI en 2012 (résolution B2), 149 597 870 700 mètres exactement.
   On l'exige donc au chiffre près, comme on exigerait la valeur de c.

   Les deux dérivations tombent juste au dernier chiffre représentable en double
   précision — écart relatif exactement nul. Ce n'est pas une tolérance choisie
   pour faire passer le test : c'est ce que ces définitions donnent.
   ============================================================================ */

"use strict";
const fs = require("fs");

/* La vérité, et elle n'est pas dans les fichiers contrôlés. */
const C_EXACT   = 299792458;            // m/s — exact par la définition du mètre
const JOUR      = 86400;                // s   — le jour julien
const AN_JULIEN = 365.25;               // jours — l'année de l'année-lumière
const UA_UAI    = 149597870700;         // m   — UAI 2012, résolution B2, exact
const AL_DERIVEE = C_EXACT * AN_JULIEN * JOUR;
const PC_DERIVE  = (648000 / Math.PI) * UA_UAI;

/* Où chercher. On nomme les fichiers plutôt que de balayer le dépôt : un
   balayage attraperait cet outil lui-même, et les valeurs qu'il porte sont sa
   référence, pas une copie de plus. */
const FICHIERS = ["echelle.js", "recul.js", "voyage1g.js", "lune.js", "index.html",
                  "etoiles.js", "physique.js", "verif.js"];

/* Les trois grandeurs, avec ce qui les identifie et ce qu'on attend.
   `facteur` ramène une déclaration en kilomètres à des mètres : `lune.js` porte
   la sienne en km, et l'exclure du contrôle serait exclure le seul fichier qui
   la porte avec une clé de source. */
const GRANDEURS = [
  { nom: "l'unité astronomique", motif: /\b(?:UA|UA_M|UA_KM)\s*=\s*([0-9.e+]+)/g,
    attendu: UA_UAI, dit: "UAI 2012 résolution B2, exact" },
  { nom: "l'année-lumière", motif: /\b(?:AL|AL_M)\s*=\s*([0-9.e+]+)/g,
    attendu: AL_DERIVEE, dit: "c × 365,25 × 86 400" },
  { nom: "le parsec", motif: /\b(?:PC|PARSEC_M)\s*=\s*([0-9.e+]+)/g,
    attendu: PC_DERIVE, dit: "(648 000 / π) × ua" },
];

let echecs = 0, total = 0;
function point(nom, ok, attendu, mesure, note){
  total++; if(!ok) echecs++;
  console.log(`  ${ok ? "✅" : "❌"}  ${nom}`);
  if(attendu !== undefined) console.log(`        attendu ${attendu}   mesuré ${mesure}`);
  if(note) console.log(`        ${note}`);
}
function titre(t){ console.log(`\n  ${t}\n  ${"─".repeat(t.length)}`); }

/* Relever une grandeur dans un texte. Rend la liste des valeurs EN MÈTRES, avec
   le fichier et la ligne — sans le lieu, un désaccord serait signalé sans qu'on
   sache où aller le corriger. */
function releve(sources, g){
  const vus = [];
  for(const [fichier, texte] of sources){
    g.motif.lastIndex = 0;
    let m;
    while((m = g.motif.exec(texte))){
      const brut = Number(m[1]);
      if(!Number.isFinite(brut) || brut <= 0) continue;
      // Une déclaration en kilomètres se reconnaît à son nom, pas à sa taille :
      // deviner d'après l'ordre de grandeur marcherait jusqu'au jour où non.
      const km = /_KM\s*=$/.test(m[0].slice(0, m[0].indexOf(m[1]))) ||
                 /_KM\s*=/.test(m[0]);
      vus.push({ fichier, valeur: km ? brut * 1000 : brut,
                 ligne: texte.slice(0, m.index).split("\n").length });
    }
  }
  return vus;
}

function controle(sources){
  return GRANDEURS.map(g => {
    const vus = releve(sources, g);
    const distinctes = [...new Set(vus.map(v => v.valeur))];
    const faux = vus.filter(v => v.valeur !== g.attendu);
    return { g, vus, distinctes, faux };
  });
}

const sources = FICHIERS.filter(f => fs.existsSync(f))
                        .map(f => [f, fs.readFileSync(f, "utf8")]);

console.log("\n  LES CONSTANTES ASTRONOMIQUES");
console.log("  ════════════════════════════");

const r = controle(sources);

titre("La mesure elle-même tient debout");
const totalVus = r.reduce((n, x) => n + x.vus.length, 0);
point("on a bien relevé des déclarations", totalVus >= 8,
      "≥ 8", totalVus,
      "un zéro voudrait dire que les expressions ne mordent plus, pas que les "
      + "constantes ont disparu — et tout le reste passerait au vert à vide");

titre("Une seule valeur par grandeur");
for(const x of r)
  point(`${x.g.nom} — ${x.vus.length} déclaration(s)`, x.distinctes.length <= 1,
        "1 valeur distincte", x.distinctes.length,
        x.vus.map(v => `${v.fichier}:${v.ligne}`).join(", "));

titre("Et cette valeur est celle que la définition donne");
for(const x of r)
  point(`${x.g.nom} vaut ${x.g.dit}`, x.faux.length === 0,
        x.g.attendu, x.faux.length ? x.faux.map(v => `${v.fichier} ${v.valeur}`).join(", ")
                                   : x.g.attendu,
        "la vérité vient de la définition, pas des autres copies — neuf fichiers "
        + "d'accord sur une valeur fausse restent neuf fichiers faux");

/* --------------------------------------------------------------------------
   ET CET OUTIL SAIT ÉCHOUER — règle 2, éprouvée en cassant pour de vrai. */
titre("Cet outil sait échouer");

const abime = (f, avant, apres) =>
  sources.map(([n, t]) => [n, n === f ? t.replace(avant, apres) : t]);

const cas = [
  ["une copie qui diverge des autres", "recul.js",
   "const UA_M = 1.495978707e11;", "const UA_M = 1.4959e11;", 0, "distinctes"],
  ["toutes les copies fausses ensemble", null, null, null, 0, "faux"],
  ["l'année-lumière qui ne suit plus sa définition", "recul.js",
   "const AL_M = 9.4607304725808e15;", "const AL_M = 9.46e15;", 1, "faux"],
];

for(const [nom, fichier, avant, apres, i, quoi] of cas){
  let s;
  if(fichier) s = abime(fichier, avant, apres);
  else s = sources.map(([n, t]) => [n, t.replace(/1\.495978707e11/g, "1.4959e11")
                                        .replace(/1\.495978707e8/g, "1.4959e8")]);
  const v = controle(s)[i];
  const vu = quoi === "distinctes" ? v.distinctes.length > 1 : v.faux.length > 0;
  point(nom, vu, "signalé", vu ? "signalé" : "RIEN — l'outil serait aveugle",
        quoi === "faux" && !fichier
          ? "c'est le cas que la comparaison des copies entre elles ne verrait PAS"
          : undefined);
}

const muet = controle(sources.map(([n, t]) => [n, t.replace(/\bUA\w*\s*=/g, "ZZZ =")]));
point("des expressions qui cessent de mordre sont vues",
      muet.reduce((n, x) => n + x.vus.length, 0) < 8,
      "moins de 8 relevés", muet.reduce((n, x) => n + x.vus.length, 0),
      "c'est le point « la mesure tient debout » qui l'attrape, et il faut qu'il soit vrai");

console.log("");
if(echecs){ console.log(`  ❌  ${echecs} ÉCHEC(S) sur ${total} contrôles\n`); process.exit(1); }
console.log(`  ✅  TOUT PASSE — ${total} contrôles\n`);
process.exit(0);
