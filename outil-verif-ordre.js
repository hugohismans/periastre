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
   TROIS ESPÈCES D'INVERSION, ET TROIS CLIQUETS

   ARMÉE — la référence est dans une instruction qui s'exécute au chargement,
   avant la ligne de déclaration. C'est la mort immédiate. Cliquet dur : ZÉRO,
   toujours, sans exception.

   ARMÉE PAR APPEL — la référence est dans un corps de fonction, mais cette
   fonction est ATTEINTE DEPUIS LE SOMMET. Elle s'exécute donc au chargement, à
   la ligne de l'appel et non à la ligne où elle est écrite. Aussi mortelle que
   la précédente, et invisible à l'œil : c'est ce qui a tué le bloc une
   quatrième fois, le 9 août. Cliquet dur lui aussi.

   DIFFÉRÉE — la référence est dans un corps de fonction qu'aucun appel de
   sommet n'atteint. Elle ne s'exécute qu'après, donc elle marche aujourd'hui.
   Mais elle EXPLOSE au premier déplacement de code, et le chantier F2 en
   déplace beaucoup. Cliquet mou : le compte ne remonte jamais. Chaque domaine
   sorti dans un module en détruit — un nom posé par une balise `<script src>`
   chargée avant n'a pas de zone morte.

   ---------------------------------------------------------------------------
   LE 9 AOÛT, IL EST RESTÉ VERT PENDANT QUE LE BLOC MOURAIT

       poseAveux($("dossier"), "salon");     // ← appel AU SOMMET, ligne 3267
       // … trois cents lignes …
       let aveuxVus = new Set();             // ← déclaré ici, ligne 3508
       function annonceAveux(ou){
         const a = AVEU.annonce(CONTENU, ou, aveuxVus);   // ← la lecture
       }
       function poseAveux(hote, ou){ annonceAveux(ou); … }

   `poseAveux` est une DÉCLARATION de fonction, donc hissée : l'appel ligne 3267
   marche. Mais son corps appelle `annonceAveux`, dont le corps lit `aveuxVus`,
   déclaré deux cent quarante lignes plus bas. À l'exécution : zone morte,
   exception, bloc mort. L'outil comptait cette lecture comme différée parce
   qu'elle est ÉCRITE dans un corps de fonction — il ne suivait pas les appels,
   donc il ignorait que cette fonction est ATTEINTE depuis le sommet.

   Un appel hissé transforme une différée en armée. Maintenant on le mesure :
   on construit l'ensemble des fonctions atteignables depuis le code de sommet
   par fermeture transitive, et pour chacune la ligne effective est celle du
   premier appel de sommet qui y mène. Toute lecture d'un `const`/`let` déclaré
   APRÈS cette ligne-là est armée, où qu'elle soit écrite.

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

   Le suivi des appels, lui, exige zéro alors qu'il regarde DEDANS les fonctions.
   Il ne peut donc pas se payer le bruit du cliquet mou, et tout ce qui est
   douteux est écarté au lieu d'être crié :

   - les paramètres de la fonction et les noms qu'elle déclare chez elle sont
     retenus et exclus — sans quoi `function peint(couleur)` accuserait le
     `couleur` global déclaré plus bas ;
   - une lecture écrite dans une fonction IMBRIQUÉE (flèche, rappel, méthode)
     n'est pas comptée : rien ne dit que l'englobante l'exécute ;
   - un nom déclaré deux fois au sommet, ou à la fois `function` et variable,
     sort du graphe : on ne sait plus quel corps est appelé ;
   - seuls les APPELS écrits — `nom(…)` — font une arête. Une fonction PASSÉE
     comme valeur (`addEventListener("click", f)`, `setTimeout(f, 0)`) n'est pas
     un appel de sommet : elle s'exécute bien plus tard. Un gestionnaire écrit
     en toutes lettres (`el.onclick = () => f()`) ne l'est pas non plus, parce
     que le corps de la flèche est déjà un corps de fonction.

   Et il refuse de conclure si sa profondeur d'accolades ne revient pas à zéro
   en fin de bloc : un compteur perdu rendrait zéro inversion et passerait au
   vert sans rien mesurer.

   ---------------------------------------------------------------------------
   LES ANGLES MORTS QUI RESTENT — écrits avant qu'ils mordent

   Celui du 9 août n'était écrit nulle part avant de coûter un bloc. Ceux-ci le
   sont. Chacun laisse passer un mort possible ; aucun ne crie faux.

   1. UNE FONCTION APPELÉE À TRAVERS UNE VALEUR. `const f = () => …` puis
      `f()`, ou `obj.methode()`, ou `tableau.forEach(pose)`, ou `f.call(…)` :
      aucune arête n'est faite. Le graphe ne connaît que `nom(…)` où `nom` est
      une `function` déclarée au sommet. Un appel de sommet qui passe par une
      méthode d'objet reste invisible — et le site en a beaucoup.

   2. UN RAPPEL QUI S'EXÉCUTE TOUT DE SUITE. `[…].forEach(x => pose(x))` au
      sommet s'exécute au sommet, mais le corps de la flèche est traité comme
      un corps de fonction, donc ni point d'entrée ni arête. Même chose pour
      une IIFE. C'est le prix du choix inverse : compter les flèches ferait
      entrer tous les gestionnaires, et le cliquet crierait faux.

   3. UNE LECTURE ÉCRITE DANS UNE FONCTION IMBRIQUÉE, mais exécutée quand même
      — une flèche appelée immédiatement dans le corps d'une fonction atteinte.
      Non comptée, pour la même raison.

   4. L'EXÉCUTION CONDITIONNELLE. `if(x) pose();` au sommet compte comme un
      appel de sommet même si la condition est fausse ce jour-là. C'est du côté
      du bruit, mais un bruit qui a du sens : la branche existe.

   5. LES `try/catch`. Le cas qui reste dans la page est réel et ne tue pas la
      page, parce qu'un `catch` l'avale. L'outil ne fait pas la différence entre
      une inversion qui éteint tout et une qui casse une fonctionnalité en
      silence — et c'est voulu : la seconde est plus dure à trouver.

   6. LA PORTÉE DE BLOC. Un `const` déclaré dans un `{ … }` de sommet n'est pas
      relevé du tout, ni comme déclaration ni comme risque.
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
const DIFFEREES = 20;

/* Relevé le 8 août 2026, le jour où le suivi des appels a été écrit : UN. Ce
   n'est pas une valeur de confort, c'est ce que la mesure rend sur le dépôt tel
   qu'il est — et la toute première mesure a trouvé un vrai cas, que personne ne
   cherchait.

   Le cas du 9 août, lui, est bien réparé dans la page : l'appel à `poseAveux`
   est descendu SOUS le `let aveuxVus` que sa chaîne finit par lire.

   CELUI QUI RESTE — `appliqueEtat` lit `$` :

       BLOC A (ligne 2827)   function appliqueEtat(e){
                               try{ if(!salon.actif) $("b-salon").click(); …
       BLOC A (ligne 2865)   if(location.hash.startsWith("#etat=")){
                               try{ appliqueEtat(JSON.parse(…)); } catch(_){}
       BLOC B (ligne 3163)   const $ = id => document.getElementById(id);

   `$` est déclaré dans le bloc SUIVANT. Deux balises `<script>` classiques
   partagent la même portée globale, mais pas le même moment : quand le bloc A
   s'exécute, le `const $` du bloc B n'existe pas encore. La lecture jette.

   Elle ne tue pas la page, et c'est la seule raison pour laquelle on la
   tolère : les deux `try/catch` l'avalent. Le prix est ailleurs — le lien
   `#etat=…` que la touche C fabrique NE REMET PLUS LA SCÈNE EN PLACE. Il
   s'ouvre, il ne restaure rien, et il ne dit rien non plus.

   La réparation tient en une ligne et n'est pas de mon ressort ici : descendre
   `appliqueEtat` et son appel dans le bloc qui déclare `$`, ou monter `$`.
   Le jour où c'est fait, l'outil annonce lui-même que le cliquet peut tomber
   à zéro. Il ne remonte jamais, comme ARMEES. */
const ARMEES_PAR_APPEL = 0;

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

/* Rend
     declarations : Map(nom → { ligne, genre })  — le sommet seulement
     references   : [{ nom, ligne, differee, hote, appel }]
     occurrences  : [{ nom, genre, ligne }]      — TOUTES, doublons compris
     locaux       : Map(nomFonction → Set)       — paramètres et noms du dedans
   plus `profondeurFinale`, qui doit valoir zéro.

   `hote` est le nom de la fonction de sommet dans le corps DIRECT de laquelle
   la référence est écrite, ou null. `appel` dit que le nom est suivi d'une
   parenthèse ouvrante, donc appelé et pas seulement lu — c'est ce qui fait les
   arêtes du graphe.

   `occurrences` garde les doublons alors que `declarations` retient la première
   : c'est ce qui permet de reconnaître un nom déclaré deux fois, ou à la fois
   `function` et variable, et de le sortir du graphe plutôt que de deviner. */
function analyse(src){
  const code = nettoie(src);
  const declarations = new Map();
  const references = [];
  const occurrences = [];
  const locaux = new Map();
  const ajouteLocal = (f, nom) => {
    if(!locaux.has(f)) locaux.set(f, new Set());
    locaux.get(f).add(nom);
  };
  const identifiants = t => t.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || [];

  /* La pile des accolades. Chaque entrée dit si ce qu'elle ouvre est un CORPS
     DE FONCTION (donc différé), un OBJET (où `nom:` est une clé, pas une
     référence), ou un simple bloc. Un corps de fonction porte en plus le nom
     de la fonction, quand c'est une `function nom(){}` écrite AU SOMMET —
     ailleurs il vaut null, et rien ne lui est attribué. */
  const pile = [];
  const dansFonction = () => pile.some(e => e.fonction);
  const dansObjet = () => pile.length && pile[pile.length-1].objet;
  /* Le corps de fonction le plus INTÉRIEUR. Si ce n'est pas celui d'une
     fonction de sommet nommée — une flèche, un rappel, une méthode, une
     fonction imbriquée — on rend null : rien ne prouve que l'englobante
     exécute ce corps-là, et on ne crie pas sur ce qu'on ne sait pas. */
  const hoteCourant = () => {
    if(vuFleche) return null;
    for(let k = pile.length - 1; k >= 0; k--)
      if(pile[k].fonction) return pile[k].nomFonction || null;
    return null;
  };
  let nomFnEnAttente = null;   // `function nom` lu, son `{` pas encore ouvert

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
      pile.push({ objet, fonction, nomFonction: fonction ? nomFnEnAttente : null });
      nomFnEnAttente = null;
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
        precedent = "fonction"; i = j; nomFnEnAttente = null;
        // le nom, puis la liste de paramètres, sautés d'un bloc
        let m = i; while(m < code.length && /[ \t\n]/.test(code[m])) m++;
        if(EST_DEBUT(code[m])){
          let f = m; while(f < code.length && EST_SUITE(code[f])) f++;
          const nomFn = code.slice(m, f);
          if(pile.length === 0 && parens === 0){
            occurrences.push({ nom: nomFn, genre: "fonction", ligne });
            if(!declarations.has(nomFn)) declarations.set(nomFn, { ligne, genre: "fonction" });
            nomFnEnAttente = nomFn;
          }
          m = f;
        }
        while(m < code.length && /[ \t\n]/.test(code[m])) m++;
        if(code[m] === "("){
          const debut = m; m = sautePar(m);
          /* Les paramètres sont des noms LOCAUX. Sans ça, `function peint(couleur)`
             accuserait le `couleur` global déclaré plus bas — un cri faux, et un
             cri faux sur un cliquet dur fait démonter le cliquet. On ne les
             retient que pour une fonction de sommet nommée : ailleurs, aucune
             référence ne lui est attribuée, donc ça ne servirait à rien. */
          if(nomFnEnAttente)
            for(const p of identifiants(code.slice(debut, m))) ajouteLocal(nomFnEnAttente, p);
        }
        i = m; continue;
      }
      if(mot === "catch"){
        precedent = "catch"; i = j;
        let m = i; while(m < code.length && /[ \t\n]/.test(code[m])) m++;
        if(code[m] === "("){
          const debut = m; m = sautePar(m);
          // `catch(e)` lie `e` dans le corps, qui reste attribué à l'hôte.
          const h = hoteCourant();
          if(h) for(const p of identifiants(code.slice(debut, m))) ajouteLocal(h, p);
        }
        i = m; continue;
      }
      if(mot === "const" || mot === "let" || mot === "var"){
        declMode = true; apresEgal = false; declParens = parens; genreDecl = mot;
        precedent = mot; i = j; continue;
      }

      if(!MOTS.has(mot) && avant !== "."){
        if(declMode && !apresEgal){
          // un nom en cours de déclaration — global seulement au sommet
          if(pile.length === 0 && parens === 0){
            occurrences.push({ nom: mot, genre: genreDecl, ligne });
            if(!declarations.has(mot)) declarations.set(mot, { ligne, genre: genreDecl });
          } else {
            // ailleurs : un nom LOCAL, qu'il faut retenir pour ne pas l'accuser
            const h = hoteCourant();
            if(h) ajouteLocal(h, mot);
          }
        } else if(!(dansObjet() && suivi === ":")){
          references.push({ nom: mot, ligne, differee: dansFonction() || vuFleche,
                            hote: hoteCourant(), appel: suivi === "(" });
        }
      }
      precedent = mot; i = j; continue;
    }

    precedent = c; i++;
  }
  return { declarations, references, occurrences, locaux,
           profondeurFinale: pile.length };
}

// ═══════════════════════════════════ 3. classer — la même loi pour la page et pour les épreuves
/* Tout ce qui suit travaille sur un TABLEAU d'analyses, une par bloc de code.
   La page réelle en fournit cinq, une source fabriquée en fournit une. C'est
   volontairement le même chemin : une épreuve qui passerait par un raccourci
   ne prouverait rien sur ce que l'outil mesure vraiment. Le premier jet avait
   deux classements — celui de la page et celui des épreuves — et c'est
   exactement la faute que `outils/nettoie.js` a déjà coûté une fois. */

// La position globale : les blocs s'exécutent dans l'ordre du document.
const position = (iBloc, ligne) => iBloc * 1e7 + ligne;

/* La ligne du FICHIER, à partir de la ligne du bloc.

   `depart` est la ligne de la balise `<script>` ouvrante, et le contenu du bloc
   commence sur cette ligne-là — juste après le `>`. La ligne 1 du bloc est donc
   la ligne `depart` du fichier, pas la suivante : il faut retrancher un.

   Sans ce `-1`, tout ce que l'outil imprime pointe une ligne trop bas. C'est
   sans effet sur les comptes — les comparaisons se font sur `position`, pas sur
   l'affichage — mais un cliquet dur dont on va relire les lignes doit désigner
   la bonne. `vueW` est employé ligne 3000 et déclaré ligne 5734 ; l'outil
   annonçait 3001 et 5735 depuis le premier jour. */
const ligneFichier = (a, ligne) => a.depart + ligne - 1;

/* Les noms sur lesquels on refuse de raisonner : déclarés deux fois au sommet,
   ou déclarés sous deux genres — `function f(){}` quelque part et `let f` plus
   loin. On ne sait plus quel corps un appel atteint ; alors on ne compte pas.
   C'est un trou volontaire, du côté du silence et non du cri faux. */
function ambiguites(parBloc){
  const vues = new Map();
  for(const a of parBloc) for(const o of a.occurrences){
    if(!vues.has(o.nom)) vues.set(o.nom, []);
    vues.get(o.nom).push(o.genre);
  }
  const ambigus = new Set();
  vues.forEach((genres, nom) => { if(genres.length > 1) ambigus.add(nom); });
  return ambigus;
}

/* LA FERMETURE TRANSITIVE — quelles fonctions s'exécutent au chargement.

   On part des appels ÉCRITS dans le code de sommet : `f()` hors de tout corps
   de fonction. Chacun donne à `f` une position effective — celle de l'appel,
   pas celle où `f` est écrite. Puis on propage : si `f` appelle `g` dans son
   corps direct, `g` s'exécute au même moment, donc hérite de la position. Si
   deux chemins mènent à `g`, c'est le PLUS PETIT numéro qui compte — le pire
   cas, celui qui décide de la vie du bloc.

   Rend Map(nomFonction → { pos, ou }) où `ou` est la ligne absolue du site
   d'appel de sommet, pour pouvoir la montrer. */
function fermeture(parBloc, toutesDecl, ambigus){
  const estFonctionSure = nom => {
    const d = toutesDecl.get(nom);
    return !!d && d.genre === "fonction" && !ambigus.has(nom);
  };

  // Les arêtes : nomFonction → noms qu'elle appelle dans son corps DIRECT.
  const aretes = new Map();
  for(const a of parBloc) for(const r of a.references){
    if(!r.appel || !r.hote) continue;
    if(!aretes.has(r.hote)) aretes.set(r.hote, new Set());
    aretes.get(r.hote).add(r.nom);
  }

  const eff = new Map(), file = [];
  const pose = (nom, pos, ou) => {
    if(!estFonctionSure(nom)) return;
    const v = eff.get(nom);
    if(v && v.pos <= pos) return;
    eff.set(nom, { pos, ou });
    file.push(nom);
  };

  // Les points d'entrée : les appels écrits au sommet.
  parBloc.forEach((a, iB) => {
    for(const r of a.references){
      if(!r.appel || r.differee) continue;       // `differee` = dans un corps
      pose(r.nom, position(iB, r.ligne), ligneFichier(a, r.ligne));
    }
  });

  let garde = 0;
  while(file.length){
    if(++garde > 1e6) break;                     // ceinture : jamais atteint
    const f = file.shift(), v = eff.get(f);
    for(const g of (aretes.get(f) || [])) pose(g, v.pos, v.ou);
  }
  return eff;
}

/* CE QUI EST DANGEREUX ET CE QUI NE L'EST PAS.

   `function f(){}` est REMONTÉE par le moteur : l'appeler cent lignes plus haut
   est parfaitement sûr, et le sera toujours. `var` aussi est remontée — elle
   rend `undefined`, ce qui est un autre problème, pas la mort silencieuse.

   Seuls `const` et `let` ont une zone morte temporelle, et c'est elle qui tue
   le bloc entier. Compter les fonctions gonflait le chiffre de cinquante et
   noyait les vraies mines dans du bruit inoffensif. */
const EN_ZONE_MORTE = g => g === "const" || g === "let";

function classifie(parBloc){
  // Toutes les déclarations, avec le bloc où elles vivent.
  const toutesDecl = new Map();
  parBloc.forEach((a, iB) => a.declarations.forEach((d, nom) => {
    if(!toutesDecl.has(nom))
      toutesDecl.set(nom, { bloc: iB, ligne: d.ligne, genre: d.genre,
                            pos: position(iB, d.ligne) });
  }));
  const ambigus = ambiguites(parBloc);
  const eff = fermeture(parBloc, toutesDecl, ambigus);

  const armees = [], differees = [], hissees = [], parAppel = [];

  /* LES ARMÉES PAR APPEL, D'ABORD — parce qu'une lecture ainsi classée SORT des
     différées. Elle n'est plus une mine pour plus tard : elle explose au
     chargement. La compter deux fois ferait remonter le cliquet mou pour une
     raison qui n'est pas la sienne.

     La comparaison ne regarde PAS où la lecture est écrite : une lecture écrite
     après la déclaration est quand même mortelle si l'appel, lui, est avant.
     C'est tout le cas du 9 août — `annonceAveux` est écrite SOUS `aveuxVus`. */
  const promues = new Set();
  parBloc.forEach((a, iB) => {
    for(const r of a.references){
      if(!r.hote) continue;
      const v = eff.get(r.hote);
      if(!v) continue;                                   // jamais atteinte du sommet
      const d = toutesDecl.get(r.nom);
      if(!d || !EN_ZONE_MORTE(d.genre)) continue;
      if(d.pos <= v.pos) continue;                       // déclaré avant l'appel : licite
      const local = a.locaux.get(r.hote);
      if(local && local.has(r.nom)) continue;            // paramètre ou nom du dedans
      promues.add(iB + ":" + r.ligne + ":" + r.nom);
      parAppel.push({ nom: r.nom, ou: ligneFichier(a, r.ligne),
                      declare: ligneFichier(parBloc[d.bloc], d.ligne), genre: d.genre,
                      fonction: r.hote, appel: v.ou });
    }
  });

  parBloc.forEach((a, iB) => {
    for(const r of a.references){
      const d = toutesDecl.get(r.nom);
      if(!d) continue;
      if(position(iB, r.ligne) >= d.pos) continue;      // dans le bon ordre
      if(promues.has(iB + ":" + r.ligne + ":" + r.nom)) continue;
      const cible = { nom: r.nom, ou: ligneFichier(a, r.ligne),
                      declare: ligneFichier(parBloc[d.bloc], d.ligne), genre: d.genre };
      if(d.genre === "fonction" || d.genre === "var"){ hissees.push(cible); continue; }
      (r.differee ? differees : armees).push(cible);
    }
  });

  return { toutesDecl, ambigus, eff, armees, differees, hissees, parAppel };
}

// ══════════════════════════════════════════════════════════ 4. le verdict
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

const { toutesDecl, eff, armees, differees, hissees, parAppel } = classifie(parBloc);

const tdz = [...toutesDecl.values()].filter(d => EN_ZONE_MORTE(d.genre));
console.log("  noms déclarés au sommet   " + String(toutesDecl.size).padStart(5)
            + "   dont " + tdz.length + " en zone morte (const/let)");

// On dédoublonne par nom pour le compte du cliquet mou : un même nom employé
// douze fois trop tôt est UNE inversion, pas douze.
const nomsDifferes = [...new Set(differees.map(d => d.nom))];
const nomsArmes = [...new Set(armees.map(d => d.nom))];
const nomsParAppel = [...new Set(parAppel.map(d => d.nom))];

console.log("  références en avance      "
            + String(armees.length + differees.length).padStart(5)
            + "   (+ " + hissees.length + " vers des noms remontés, sans danger)");
console.log("  fonctions atteintes du sommet " + String(eff.size).padStart(3)
            + "   (appels suivis de proche en proche)");

/* ════════════════════════════════════ LA MESURE SAIT-ELLE VOIR ?

   Un détecteur qui rend zéro doit prouver qu'il aurait vu quelque chose. On lui
   donne des sources fabriquées dont on connaît la réponse, dans les deux sens :
   il doit crier sur une vraie zone morte, et se taire sur ce qui est licite.

   Sans ce groupe, l'outil pourrait ne rien mordre du tout — l'expression de
   nettoyage cassée, la pile d'accolades perdue — et passer au vert en beauté.
   C'est exactement le piège qui a coûté quatre contrôles fautifs le 7 août.

   `classe` passe par `classifie`, le MÊME chemin que la page réelle, avec un
   seul bloc au lieu de cinq. Une épreuve qui aurait son propre classement ne
   prouverait rien sur ce que l'outil mesure vraiment. */
/* `src` est une source, ou un TABLEAU de sources — un par balise `<script>`.
   La page réelle en a cinq, et l'ordre entre elles est la moitié du problème :
   deux balises classiques partagent la portée globale mais pas le moment. */
function classe(src){
  const sources = Array.isArray(src) ? src : [src];
  const parB = sources.map(s => {
    const a = analyse(s);
    a.depart = 1;                  // une source fabriquée EST son propre fichier
    return a;
  });
  const c = classifie(parB);
  return { armees: c.armees.length, differees: c.differees.length,
           hissees: c.hissees.length, parAppel: c.parAppel.length,
           atteintes: c.eff.size };
}

const EPREUVES = [
  { nom: "une zone morte au sommet est vue",
    src: "const a = b;\nconst b = 1;",
    veut: r => r.armees === 1 && r.differees === 0 && r.parAppel === 0 },
  { nom: "la même dans une fonction est vue comme différée",
    src: "function f(){ return b; }\nconst b = 1;",
    veut: r => r.armees === 0 && r.differees === 1 && r.parAppel === 0 },
  { nom: "une fonction appelée avant sa ligne n'est PAS une mine",
    src: "f();\nfunction f(){ return 1; }",
    veut: r => r.armees === 0 && r.differees === 0 && r.hissees === 1 && r.parAppel === 0 },
  { nom: "le bon ordre ne déclenche rien",
    src: "const b = 1;\nconst a = b;",
    veut: r => r.armees === 0 && r.differees === 0 && r.parAppel === 0 },
  { nom: "un corps de méthode abrégée est différé, pas armé",
    src: "const o = { set x(v){ return z; } };\nconst z = 1;",
    veut: r => r.armees === 0 && r.differees === 1 && r.parAppel === 0 },
  { nom: "ce qui est dans un commentaire ou une chaîne ne compte pas",
    src: "const a = 1; // b\nconst s = \"b\";\nconst b = 2;",
    veut: r => r.armees === 0 && r.differees === 0 && r.parAppel === 0 },

  /* ── LE 9 AOÛT, REPRODUIT À L'IDENTIQUE ────────────────────────────────────
     L'appel est au sommet, la fonction appelée est hissée, et son corps appelle
     une seconde fonction dont le corps lit un `let` déclaré plus bas que
     l'appel. Noter que la lecture est ÉCRITE sous la déclaration : l'ancien
     classement ne la voyait même pas comme différée. C'est l'épreuve qui rend
     l'outil capable de voir le mort sur lequel il est resté vert. */
  { nom: "LE 9 AOÛT — appel au sommet, deux corps, un `let` plus bas",
    src: "poseAveux(hote, \"salon\");\n"
       + "const CLE_AVEUX = \"periastre.aveux\";\n"
       + "let aveuxVus = new Set();\n"
       + "function annonceAveux(ou){ const a = AVEU.annonce(CONTENU, ou, aveuxVus); return a; }\n"
       + "function poseAveux(hote, ou){ annonceAveux(ou); }",
    veut: r => r.parAppel === 1 && r.armees === 0 && r.differees === 0 },

  { nom: "la chaîne à deux niveaux est suivie jusqu'au bout",
    src: "demarre();\n"
       + "let etat = 1;\n"
       + "function lit(){ return etat; }\n"
       + "function passe(){ lit(); }\n"
       + "function demarre(){ passe(); }",
    veut: r => r.parAppel === 1 && r.armees === 0 && r.atteintes === 3 },

  { nom: "le même appel APRÈS la déclaration est licite — rien",
    src: "let etat = 1;\n"
       + "demarre();\n"
       + "function lit(){ return etat; }\n"
       + "function demarre(){ lit(); }",
    veut: r => r.parAppel === 0 && r.armees === 0 && r.differees === 0 },

  /* Un gestionnaire n'est pas du code de sommet : il s'exécute quand on clique,
     bien après la fin du bloc. Deux formes, parce qu'elles échouent pour deux
     raisons différentes — le corps de la flèche EST déjà un corps de fonction,
     et une fonction passée comme valeur n'est pas un appel écrit. */
  { nom: "un appel dans un `onclick` reste différé, pas armé",
    src: "bouton.onclick = () => { montre(); };\n"
       + "function montre(){ return etat; }\n"
       + "let etat = 1;",
    veut: r => r.parAppel === 0 && r.differees === 1 && r.atteintes === 0 },

  { nom: "une fonction seulement PASSÉE à addEventListener n'est pas un appel",
    src: "addEventListener(\"click\", montre);\n"
       + "setTimeout(montre, 0);\n"
       + "function montre(){ return etat; }\n"
       + "let etat = 1;",
    veut: r => r.parAppel === 0 && r.differees === 1 && r.atteintes === 0 },

  { nom: "une fonction jamais appelée du sommet reste différée",
    src: "function jamais(){ return etat; }\n"
       + "let etat = 1;",
    veut: r => r.parAppel === 0 && r.differees === 1 && r.atteintes === 0 },

  /* Les deux épreuves qui empêchent le cri faux. Sans elles, le cliquet dur
     sauterait sur du code parfaitement légal, et un cliquet qui crie faux finit
     démonté — ce qui coûte plus cher que de ne pas l'avoir écrit. */
  { nom: "un paramètre qui porte le nom d'un global n'est pas accusé",
    src: "demarre();\n"
       + "let couleur = \"rouge\";\n"
       + "function peint(couleur){ return couleur; }\n"
       + "function demarre(){ peint(\"bleu\"); }",
    veut: r => r.parAppel === 0 && r.armees === 0 },

  { nom: "un `const` local qui porte le nom d'un global n'est pas accusé",
    src: "demarre();\n"
       + "let etat = 1;\n"
       + "function calcule(){ const etat = 2; return etat; }\n"
       + "function demarre(){ calcule(); }",
    veut: r => r.parAppel === 0 && r.armees === 0 },

  /* Une flèche imbriquée dans une fonction atteinte : rien ne dit que
     l'englobante l'exécute. On se tait — du côté du silence, jamais du cri. */
  { nom: "une flèche imbriquée dans une fonction atteinte n'est pas comptée",
    src: "demarre();\n"
       + "let etat = 1;\n"
       + "function demarre(){ cible.onclick = () => { return etat; }; }",
    veut: r => r.parAppel === 0 && r.armees === 0 },

  /* ── D'UNE BALISE `<script>` À LA SUIVANTE ─────────────────────────────────
     C'est le cas que la page réelle a rendu au premier relevé, et il ne se voit
     que si l'on tient l'ordre des blocs. Le premier bloc appelle une fonction
     qui lit un `const` du second : il partage sa portée, mais il n'a pas encore
     eu son tour. Rien dans le premier bloc n'est « en avance » à la lecture —
     seul l'ordre des balises le dit. */
  { nom: "un bloc qui appelle une fonction lisant un `const` du bloc SUIVANT",
    src: ["function pose(){ return $(\"x\"); }\npose();",
          "const $ = id => document.getElementById(id);"],
    veut: r => r.parAppel === 1 && r.armees === 0 },

  { nom: "le même dans l'autre sens — le bloc suivant lit le précédent — est licite",
    src: ["const $ = id => document.getElementById(id);",
          "function pose(){ return $(\"x\"); }\npose();"],
    veut: r => r.parAppel === 0 && r.armees === 0 && r.differees === 0 },
];

groupe("La mesure sait voir — épreuves sur des sources fabriquées");
for(const e of EPREUVES){
  const r = classe(e.src);
  ok(e.nom, e.veut(r), "vu", "armées " + r.armees + ", par appel " + r.parAppel
     + ", différées " + r.differees + ", remontées " + r.hissees
     + ", atteintes " + r.atteintes);
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

groupe("Le second cliquet dur — les inversions ARMÉES PAR APPEL");
ok("aucune fonction atteinte du sommet ne lit un nom déclaré plus bas que son appel",
   nomsParAppel.length <= ARMEES_PAR_APPEL,
   "≤ " + ARMEES_PAR_APPEL, nomsParAppel.length,
   nomsParAppel.length
     ? "c'est le mode de panne du 9 août — l'appel est hissé, la lecture ne l'est pas"
     : "un appel hissé transforme une différée en armée ; c'est maintenant mesuré");

if(nomsParAppel.length < ARMEES_PAR_APPEL){
  console.log("\n  ⬇  ARMEES_PAR_APPEL PEUT DESCENDRE : "
              + ARMEES_PAR_APPEL + " → " + nomsParAppel.length);
}

if(parAppel.length){
  console.log("\n  Chaque cas, un par ligne :");
  for(const p of parAppel)
    console.log("      " + p.nom.padEnd(16) + "lu ligne " + p.ou
                + " dans " + p.fonction + "(), appelée ligne " + p.appel
                + ", déclaré ligne " + p.declare);
  console.log("      La lecture s'exécute à la ligne de l'APPEL, pas à la sienne.");
}

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
