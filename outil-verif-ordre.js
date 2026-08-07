/* ============================================================================
   L'ORDRE DES DÉCLARATIONS — le contrôle qui manquait depuis deux morts.

       node outil-verif-ordre.js

   ---------------------------------------------------------------------------
   LE MODE DE PANNE QU'IL SURVEILLE

   Le code de la page vit en portée globale, avec des `const` et des `let`. Un
   nom employé AVANT sa ligne de déclaration ne rend pas `undefined` : il jette
   une `ReferenceError` de zone morte temporelle, qui tue le bloc ENTIER. Pas de
   message dans la page, pas de moitié de site — rien. C'est arrivé deux fois.

   `VERIF.vivant()` sait dire que le bloc est mort. C'est une autopsie : il ne
   tourne que dans un navigateur, et il ne dit jamais QUEL nom a été employé
   trop tôt. Cet outil-ci le dit avant le commit, en quarante millisecondes.

   ---------------------------------------------------------------------------
   DEUX ESPÈCES D'INVERSION, ET DEUX CLIQUETS

   ARMÉE — la référence est dans une instruction qui s'exécute au chargement,
   avant la ligne de déclaration. C'est la mort immédiate. Cliquet dur : ZÉRO,
   toujours, sans exception.

   DIFFÉRÉE — la référence est dans un corps de fonction. Elle ne s'exécute
   qu'après, donc elle marche aujourd'hui. Mais elle EXPLOSE au premier
   déplacement de code, et le chantier F2 en déplace beaucoup. Cliquet mou :
   le compte ne remonte jamais. Chaque domaine sorti dans un module en détruit
   — un nom posé par une balise `<script src>` chargée avant n'a pas de zone
   morte.

   ---------------------------------------------------------------------------
   CE QU'IL SAIT ET CE QU'IL NE SAIT PAS

   Il ne fait pas d'analyse syntaxique complète : il enlève commentaires,
   chaînes et expressions régulières, puis suit les accolades. Deux limites
   assumées, toutes deux dans le sens du bruit et non du silence :

   - une variable locale ou un paramètre qui porte le nom d'un global déclaré
     plus bas est compté comme différé. Faux, mais inoffensif : c'est le cliquet
     MOU, calibré sur ce qu'on mesure.
   - le cliquet DUR, lui, ne regarde que la portée du sommet, où aucune variable
     locale n'existe. C'est pour ça qu'on peut exiger zéro sans crainte.

   Et il refuse de conclure si sa profondeur d'accolades ne revient pas à zéro
   en fin de bloc : un compteur perdu rendrait zéro inversion et passerait au
   vert sans rien mesurer.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const { decoupe } = require("./outils/blocs.js");
const { nettoie } = require("./outils/nettoie.js");

// ─────────────────────────────────────────────────────────────── les cliquets
/* ZÉRO, et ce n'est pas négociable : une seule inversion armée tue la page. */
const ARMEES = 0;

/* Relevé le 8 août 2026 sur le code tel qu'il est : vingt-trois noms `const` ou
   `let` employés, depuis un corps de fonction, avant leur ligne de déclaration.
   Il ne remonte JAMAIS ; il descend à chaque domaine sorti dans un module.

   Ce ne sont QUE des `const`/`let` : une `function` est remontée par le moteur,
   l'appeler plus haut est sûr pour toujours. Le premier jet comptait les deux
   et annonçait soixante-trois mines, dont quarante inoffensives — un chiffre
   qu'on apprend à ignorer. */
const DIFFEREES = 23;

const ici = __dirname;
const page = fs.readFileSync(path.join(ici, "index.html"), "utf8");

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// ══════════════════════════════════════════════════ 1. enlever ce qui n'est pas du code
/* Il vivait ici, et il avait un défaut : le corps d'un `${…}` était recopié TEL
   QUEL, en comptant simplement les accolades. Les chaînes qui s'y trouvent
   survivaient donc à leur propre effacement, et le site en est plein —
   `` `<span>${T("accueil.entrer.voix")}</span>` `` rendait `accueil` comme un
   identifiant lu.

   Ici la conséquence était douce : un nom doit AUSSI figurer parmi les
   déclarations pour compter, donc seuls les homonymes d'une vraie variable
   faisaient du bruit. Dans l'outil des noms orphelins, où il suffit d'être lu,
   c'était cinq faux positifs sur six.

   La loi est donc partie dans `outils/nettoie.js`, comme la découpe est dans
   `outils/blocs.js`, et pour la même raison : deux implémentations recopiées
   divergent, et le jour où elles divergent, l'un des deux outils lit un fichier
   que l'autre ne voit pas. C'est ce qui venait d'arriver. */

// ══════════════════════════════════════════════════ 2. lire déclarations et références
const MOTS = new Set([
  "const","let","var","function","class","return","if","else","for","while","do",
  "switch","case","default","break","continue","new","typeof","instanceof","in","of",
  "this","null","true","false","undefined","void","delete","try","catch","finally",
  "throw","await","async","yield","export","import","extends","super","static",
]);
/* `get` et `set` ne sont PAS des mots réservés : ce sont des noms ordinaires
   que la grammaire traite à part dans un objet. Les mettre ici empêchait de
   reconnaître `set(v){ … }` comme une méthode, donc son corps comme différé —
   et `Object.defineProperty(salon,"actif",{ set(v){ vaAu(…) } })` faisait
   passer `vaAu` pour employé au sommet, neuf cents lignes trop tôt. */

const EST_DEBUT = c => /[A-Za-z_$]/.test(c);
const EST_SUITE = c => /[A-Za-z0-9_$]/.test(c);

/* Rend { declarations: Map(nom → ligne), references: [{nom, ligne, differee}] }
   plus `profondeurFinale`, qui doit valoir zéro. */
function analyse(src){
  const code = nettoie(src);
  const declarations = new Map();
  const references = [];

  /* La pile des accolades. Chaque entrée dit si ce qu'elle ouvre est un CORPS
     DE FONCTION (donc différé), un OBJET (où `nom:` est une clé, pas une
     référence), ou un simple bloc. */
  const pile = [];
  const dansFonction = () => pile.some(e => e.fonction);
  const dansObjet = () => pile.length && pile[pile.length-1].objet;

  let ligne = 1, i = 0, parens = 0;
  /* `declMode` : on est entre un `const`/`let`/`var` et le `;` qui le termine.
     `apresEgal` : on a franchi le `=`, donc ce qui suit n'est plus un nom
     déclaré mais une valeur — et une valeur contient des RÉFÉRENCES.

     Sans ce second drapeau, chaque identifiant qui suivait un `const` était
     compté comme une déclaration jusqu'au bout du fichier. Le premier jet
     rendait `window`, `document` et `localStorage` comme « déclarés à la ligne
     3628 », et soixante-trois inversions armées qui n'existaient pas. */
  let declMode = false, apresEgal = false, declParens = 0, genreDecl = "const";
  let vuFleche = false, flecheJusqu = -1;
  let precedent = "";
  const methode = [];              // ce groupe de parenthèses est-il `nom(…)` ?
  let dernierParMethode = false;

  const dernierSigne = k => {
    for(let j = k - 1; j >= 0; j--){
      const c = code[j];
      if(c === " " || c === "\n" || c === "\t") continue;
      return c;
    }
    return "";
  };
  // Avance jusqu'à la parenthèse fermante appariée, en comptant les lignes.
  const sautePar = k => {
    let prof = 0;
    while(k < code.length){
      if(code[k] === "(") prof++;
      else if(code[k] === ")"){ prof--; if(!prof) return k + 1; }
      else if(code[k] === "\n") ligne++;
      k++;
    }
    return k;
  };
  /* Le groupe de parenthèses qui commence en `k` est-il suivi d'une flèche ?

     `sautePar` fait avancer le compteur de lignes ; il faut le remettre APRÈS
     l'appel, à la valeur d'AVANT. Le premier jet capturait la valeur après
     coup, donc restaurait la dérive au lieu de l'annuler — et l'outil accusait
     des lignes de commentaire d'employer des noms trop tôt. */
  const estParamsFleche = k => {
    const l = ligne;
    let f = sautePar(k);
    ligne = l;
    while(f < code.length && /[ \t\n]/.test(code[f])) f++;
    return code[f] === "=" && code[f+1] === ">";
  };

  while(i < code.length){
    const c = code[i];
    if(c === "\n"){ ligne++; i++; continue; }
    if(c === " " || c === "\t"){ i++; continue; }

    if(c === "("){
      /* Les paramètres d'une flèche ne sont ni des déclarations globales ni des
         références : on saute le groupe entier. Ceux de `function` et `catch`
         sont sautés à la lecture du mot-clé, plus bas. */
      if(estParamsFleche(i)){ i = sautePar(i); precedent = ")"; continue; }
      /* `nom(…)` suivi d'une accolade est une MÉTHODE ABRÉGÉE, pas un appel
         suivi d'un bloc — et son corps est différé. Sans cette distinction, le
         `set(v){ … }` de `Object.defineProperty(salon,"actif",…)` faisait
         passer `vaAu` pour employé au sommet, mille lignes trop tôt. Les mots
         de contrôle (`if`, `for`, `while`…) sont exclus : leur bloc, lui,
         s'exécute bien tout de suite. */
      methode.push(!MOTS.has(precedent) && /^[A-Za-z_$]/.test(precedent));
      parens++; precedent = "("; i++; continue;
    }
    if(c === ")"){
      parens--; dernierParMethode = methode.pop() || false;
      if(declMode && parens < declParens) declMode = false;   // `for(const x of y)`
      precedent = ")"; i++; continue;
    }

    if(c === "{"){
      const s = dernierSigne(i);
      const objet = "=(,:[?&|+".includes(s) || precedent === "return";
      const fonction = precedent === "=>" || precedent === "fonction"
                    || (precedent === ")" && dernierParMethode);
      pile.push({ objet, fonction });
      precedent = "{"; i++; continue;
    }
    if(c === "}"){ pile.pop(); precedent = "}"; i++; continue; }

    if(c === "=" && code[i+1] === ">"){
      precedent = "=>"; i += 2;
      let j = i; while(j < code.length && /[ \t\n]/.test(code[j])) j++;
      if(code[j] !== "{"){ vuFleche = true; flecheJusqu = pile.length; }
      continue;
    }
    if(c === "="){ if(declMode) apresEgal = true; precedent = "="; i++; continue; }
    if(c === ","){
      if(declMode && parens === declParens) apresEgal = false;   // `const a=1, b=2`
      if(vuFleche && pile.length <= flecheJusqu) vuFleche = false;
      precedent = ","; i++; continue;
    }
    if(c === ";"){
      declMode = false; apresEgal = false;
      if(vuFleche && pile.length <= flecheJusqu) vuFleche = false;
      precedent = ";"; i++; continue;
    }

    if(EST_DEBUT(c)){
      let j = i; while(j < code.length && EST_SUITE(code[j])) j++;
      const mot = code.slice(i, j);
      const avant = dernierSigne(i);
      let k = j; while(k < code.length && /[ \t\n]/.test(code[k])) k++;
      const suivi = code[k];

      if(mot === "function"){
        precedent = "fonction"; i = j;
        // le nom, puis la liste de paramètres, sautés d'un bloc
        let m = i; while(m < code.length && /[ \t\n]/.test(code[m])) m++;
        if(EST_DEBUT(code[m])){
          let f = m; while(f < code.length && EST_SUITE(code[f])) f++;
          const nomFn = code.slice(m, f);
          if(pile.length === 0 && parens === 0 && !declarations.has(nomFn))
            declarations.set(nomFn, { ligne, genre: "fonction" });
          m = f;
        }
        while(m < code.length && /[ \t\n]/.test(code[m])) m++;
        if(code[m] === "(") m = sautePar(m);
        i = m; continue;
      }
      if(mot === "catch"){
        precedent = "catch"; i = j;
        let m = i; while(m < code.length && /[ \t\n]/.test(code[m])) m++;
        if(code[m] === "(") m = sautePar(m);
        i = m; continue;
      }
      if(mot === "const" || mot === "let" || mot === "var"){
        declMode = true; apresEgal = false; declParens = parens; genreDecl = mot;
        precedent = mot; i = j; continue;
      }

      if(!MOTS.has(mot) && avant !== "."){
        if(declMode && !apresEgal){
          // un nom en cours de déclaration — global seulement au sommet
          if(pile.length === 0 && parens === 0 && !declarations.has(mot))
            declarations.set(mot, { ligne, genre: genreDecl });
        } else if(!(dansObjet() && suivi === ":")){
          references.push({ nom: mot, ligne, differee: dansFonction() || vuFleche });
        }
      }
      precedent = mot; i = j; continue;
    }

    precedent = c; i++;
  }
  return { declarations, references, profondeurFinale: pile.length };
}

// ══════════════════════════════════════════════════════════ 3. le verdict
console.log("\n  L'ORDRE DES DÉCLARATIONS");
console.log("  ═══════════════════════");

const { code: blocs } = decoupe(page);

groupe("Ce qu'on lit");
console.log("  blocs de code             " + String(blocs.length).padStart(5));

const parBloc = blocs.map(b => {
  const a = analyse(b.contenu);
  a.depart = b.depart;
  return a;
});

// La position globale : les blocs s'exécutent dans l'ordre du document.
const position = (iBloc, ligne) => iBloc * 1e7 + ligne;

// Toutes les déclarations, avec le bloc où elles vivent.
const toutesDecl = new Map();
parBloc.forEach((a, iB) => a.declarations.forEach((d, nom) => {
  if(!toutesDecl.has(nom))
    toutesDecl.set(nom, { bloc: iB, ligne: d.ligne, genre: d.genre,
                          pos: position(iB, d.ligne) });
}));

const tdz = [...toutesDecl.values()].filter(d => d.genre === "const" || d.genre === "let");
console.log("  noms déclarés au sommet   " + String(toutesDecl.size).padStart(5)
            + "   dont " + tdz.length + " en zone morte (const/let)");

/* CE QUI EST DANGEREUX ET CE QUI NE L'EST PAS.

   `function f(){}` est REMONTÉE par le moteur : l'appeler cent lignes plus haut
   est parfaitement sûr, et le sera toujours. `var` aussi est remontée — elle
   rend `undefined`, ce qui est un autre problème, pas la mort silencieuse.

   Seuls `const` et `let` ont une zone morte temporelle, et c'est elle qui tue
   le bloc entier. Compter les fonctions gonflait le chiffre de cinquante et
   noyait les vraies mines dans du bruit inoffensif. */
const armees = [], differees = [], hissees = [];
parBloc.forEach((a, iB) => {
  for(const r of a.references){
    const d = toutesDecl.get(r.nom);
    if(!d) continue;
    if(position(iB, r.ligne) >= d.pos) continue;      // dans le bon ordre
    const cible = { nom: r.nom, ou: parBloc[iB].depart + r.ligne,
                    declare: blocs[d.bloc].depart + d.ligne, genre: d.genre };
    if(d.genre === "fonction" || d.genre === "var"){ hissees.push(cible); continue; }
    (r.differee ? differees : armees).push(cible);
  }
});

// On dédoublonne par nom pour le compte du cliquet mou : un même nom employé
// douze fois trop tôt est UNE inversion, pas douze.
const nomsDifferes = [...new Set(differees.map(d => d.nom))];
const nomsArmes = [...new Set(armees.map(d => d.nom))];

console.log("  références en avance      " + String(armees.length + differees.length).padStart(5)
            + "   (+ " + hissees.length + " vers des noms remontés, sans danger)");

/* ════════════════════════════════════ LA MESURE SAIT-ELLE VOIR ?

   Un détecteur qui rend zéro doit prouver qu'il aurait vu quelque chose. On lui
   donne cinq sources fabriquées dont on connaît la réponse, dans les deux sens :
   il doit crier sur une vraie zone morte, et se taire sur ce qui est licite.

   Sans ce groupe, l'outil pourrait ne rien mordre du tout — l'expression de
   nettoyage cassée, la pile d'accolades perdue — et passer au vert en beauté.
   C'est exactement le piège qui a coûté quatre contrôles fautifs le 7 août. */
function classe(src){
  const a = analyse(src);
  const r = { armees: 0, differees: 0, hissees: 0 };
  for(const ref of a.references){
    const d = a.declarations.get(ref.nom);
    if(!d || ref.ligne >= d.ligne) continue;
    if(d.genre === "fonction" || d.genre === "var"){ r.hissees++; continue; }
    if(ref.differee) r.differees++; else r.armees++;
  }
  return r;
}

const EPREUVES = [
  { nom: "une zone morte au sommet est vue",
    src: "const a = b;\nconst b = 1;",
    veut: r => r.armees === 1 && r.differees === 0 },
  { nom: "la même dans une fonction est vue comme différée",
    src: "function f(){ return b; }\nconst b = 1;",
    veut: r => r.armees === 0 && r.differees === 1 },
  { nom: "une fonction appelée avant sa ligne n'est PAS une mine",
    src: "f();\nfunction f(){ return 1; }",
    veut: r => r.armees === 0 && r.differees === 0 && r.hissees === 1 },
  { nom: "le bon ordre ne déclenche rien",
    src: "const b = 1;\nconst a = b;",
    veut: r => r.armees === 0 && r.differees === 0 },
  { nom: "un corps de méthode abrégée est différé, pas armé",
    src: "const o = { set x(v){ return z; } };\nconst z = 1;",
    veut: r => r.armees === 0 && r.differees === 1 },
  { nom: "ce qui est dans un commentaire ou une chaîne ne compte pas",
    src: "const a = 1; // b\nconst s = \"b\";\nconst b = 2;",
    veut: r => r.armees === 0 && r.differees === 0 },
];

groupe("La mesure sait voir — épreuves sur des sources fabriquées");
for(const e of EPREUVES){
  const r = classe(e.src);
  ok(e.nom, e.veut(r), "vu", "armées " + r.armees + ", différées " + r.differees
     + ", remontées " + r.hissees);
}

groupe("La mesure elle-même tient debout");
const perdus = parBloc.filter(a => a.profondeurFinale !== 0);
ok("les accolades se referment dans chaque bloc", perdus.length === 0,
   "profondeur 0 partout", perdus.length ? perdus.map(a => a.profondeurFinale).join(", ") : "0",
   "un compteur perdu rendrait zéro inversion et passerait au vert sans rien mesurer");
ok("on a bien trouvé des déclarations", toutesDecl.size > 100, "> 100", toutesDecl.size,
   "un zéro voudrait dire que la lecture ne mord plus");

groupe("Le cliquet dur — les inversions ARMÉES");
ok("aucun nom n'est employé trop tôt au sommet", nomsArmes.length <= ARMEES,
   "≤ " + ARMEES, nomsArmes.length,
   nomsArmes.length
     ? nomsArmes.slice(0, 8).map(nom => {
         const x = armees.find(a => a.nom === nom);
         return nom + " (ligne " + x.ou + ", déclaré " + x.declare + ")";
       }).join(" · ") + "  ← CECI TUE LE BLOC ENTIER"
     : "c'est la mort immédiate : une seule suffit à éteindre la page");

groupe("Le cliquet mou — les inversions DIFFÉRÉES");
ok("le compte n'a pas remonté", nomsDifferes.length <= DIFFEREES,
   "≤ " + DIFFEREES, nomsDifferes.length,
   "elles marchent aujourd'hui et explosent au premier déplacement. "
   + "Chaque domaine sorti dans un module en détruit.");

if(nomsDifferes.length < DIFFEREES){
  console.log("\n  ⬇  DIFFEREES PEUT DESCENDRE : " + DIFFEREES + " → " + nomsDifferes.length);
}

if(nomsDifferes.length){
  console.log("\n  " + "Les dix plus grandes distances :");
  const parNom = nomsDifferes.map(nom => {
    const tous = differees.filter(d => d.nom === nom);
    const pire = tous.reduce((a, b) => (b.declare - b.ou) > (a.declare - a.ou) ? b : a);
    return { nom, ecart: pire.declare - pire.ou, ou: pire.ou, declare: pire.declare,
             sites: tous.length };
  }).sort((a, b) => b.ecart - a.ecart);
  for(const p of parNom.slice(0, 10))
    console.log("      " + String(p.ecart).padStart(5) + " lignes   " + p.nom.padEnd(20)
                + "employé " + p.ou + ", déclaré " + p.declare
                + (p.sites > 1 ? "   (" + p.sites + " sites)" : ""));
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
