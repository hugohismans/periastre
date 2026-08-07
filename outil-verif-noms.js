/* ============================================================================
   LES NOMS ORPHELINS — lu quelque part, déclaré nulle part.

       node outil-verif-noms.js

   ---------------------------------------------------------------------------
   LE DÉFAUT EXACT QU'IL SURVEILLE

   Le 7 août 2026, le registre temporel est sorti du bloc géant dans
   `registre.js`. Trois lectures d'un tableau `registre` sont restées derrière
   dans `index.html`, deux autres dans `verif.js`. Le tableau, lui, n'existait
   plus. Le panneau du carnet de bord levait une `ReferenceError` à l'ouverture.

   Personne ne l'a vu. Les vingt-trois outils en ligne de commande ne chargent
   pas la page, et le panneau ne s'ouvre pas tout seul : il a fallu qu'un
   contrôle du navigateur tombe dessus par hasard, trois extractions plus tard.

   Il reste une dizaine de domaines à sortir. Le même défaut se reproduira à
   chaque fois — c'est la forme normale de l'erreur quand on déplace du code :
   ce qui part emporte sa déclaration et laisse ses lecteurs.

   Cet outil cherche donc UNE chose : un identifiant employé dans le code de la
   page, et déclaré nulle part. Il ne charge rien, il lit.

   ---------------------------------------------------------------------------
   CE QU'IL LIT, ET D'OÙ VIENNENT LES NOMS CONNUS

   Sources examinées : les blocs `<script>` sans `src` d'`index.html` (les
   nuanceurs GLSL sont écartés par `outils/blocs.js`), plus `verif.js` et
   `juge.js`, qui vivent dehors mais lisent la portée de la page.

   Un nom est CONNU s'il vient de l'un des trois ensembles :

     1. il est déclaré dans l'une de ces sources — `const`, `let`, `var`,
        `function`, `class`, paramètres, destructuration, `catch(e)`, boucles ;
     2. un module le pose sur le global (`global.NOM =`, `window.NOM =`) ET ce
        module est chargé par `index.html`. Les modules sont scannés, jamais
        écrits en dur : le jour où l'un d'eux change de nom, l'outil suit.
        Un module qui existe mais qu'aucune balise ne charge NE COMPTE PAS —
        son global n'existe pas à l'exécution, et c'est précisément un cas à
        signaler. `pantheon.js` est dans ce cas, délibérément ;
     3. il appartient au langage ou au navigateur — la liste est écrite plus
        bas, courte et volontairement incomplète. Le cliquet absorbe le reste.

   ---------------------------------------------------------------------------
   LA PORTÉE EST TRAITÉE À PLAT, ET C'EST UN CHOIX

   Toutes les déclarations de toutes les sources tombent dans un seul sac. Une
   variable locale d'une fonction « couvre » donc un orphelin global du même
   nom, et les trois blocs de la page se prêtent leurs noms — ce qui est vrai,
   ils partagent la portée globale.

   Ce choix penche du côté du SILENCE et non du bruit, à l'inverse
   d'`outil-verif-ordre.js`. La raison est le cliquet : un outil qui crie tout
   le temps ne se lit plus, et celui-ci n'a de valeur que si sa liste se lit
   ligne à ligne. On rate quelques orphelins masqués par un homonyme local ;
   on n'en invente aucun.

   ---------------------------------------------------------------------------
   LE CLIQUET

   Comme `PLAFOND` dans `outil-verif-taille.js` et `DIFFEREES` dans
   `outil-verif-ordre.js` : `INCONNUS` porte la valeur mesurée aujourd'hui, le
   contrôle échoue si le compte MONTE, et l'outil annonce quand il peut
   descendre. C'est ce qui le rend utile dès la première minute — il reste
   quelques faux positifs, ils sont nommés dans la liste, et aucune extraction
   future ne peut ajouter un nom orphelin sans faire rougir le contrôle.

   Le compte porte sur les NOMS distincts, pas sur les sites : un même nom lu
   douze fois est un orphelin, pas douze.

   ---------------------------------------------------------------------------
   CE QU'IL NE SAIT PAS FAIRE

   Ce n'est pas un analyseur syntaxique. Il enlève commentaires, chaînes et
   expressions régulières, découpe en jetons, et suit une pile de parenthèses.
   Ses angles morts, tous assumés :

   - il ne distingue pas les portées, voir plus haut ;
   - les corps de `class` sont traités sommairement (il n'y en a aucun dans les
     sources lues au moment où ces lignes sont écrites) ;
   - un littéral d'objet qu'il prendrait pour un bloc rendrait ses noms de
     méthodes comme des références. Le contrôle « la mesure sait voir » plus
     bas éprouve ce point précis ;
   - `typeof machin` est toujours licite en JavaScript, même sur un nom absent :
     l'outil ne le signale donc jamais.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");
const { decoupe } = require("./outils/blocs.js");

/* ───────────────────────────────────────────────────────────────── LE CLIQUET

   Relevé le 8 août 2026, après la réparation des cinq lectures du `registre`.
   Il ne remonte JAMAIS. Chaque nom de la liste imprimée plus bas est soit un
   vrai orphelin qui attend qu'on le traite, soit un angle mort de l'analyse
   qu'on garde sous le compteur plutôt que d'affaiblir la mesure pour lui.

   ENTRETIEN : quand l'outil annonce qu'il peut descendre, on le descend.

   ZÉRO le jour même. La marge de trois était une prudence de rédaction — la
   mesure n'en avait pas besoin. Et zéro vaut bien mieux que trois : à trois, on
   ne sait pas si la liste est vide ou si elle contient trois choses qu'on a
   cessé de lire. À zéro, la première extraction qui laisse un lecteur derrière
   elle fait rougir la ligne, et on la voit le jour où on la commet au lieu de
   trois extractions plus tard. */
const INCONNUS = 0;

// ══════════════════════════════════════════════════════ 1. enlever ce qui n'est pas du code
/* Repris d'`outil-verif-ordre.js`, avec deux différences.

   En mode normal on blanchit commentaires, chaînes et expressions régulières en
   gardant les sauts de ligne — les numéros de ligne restent justes et plus rien
   ne peut ressembler à un identifiant. L'intérieur des gabarits `${…}` est
   CONSERVÉ : c'est du vrai code.

   ---------------------------------------------------------------------------
   PREMIÈRE DIFFÉRENCE — LE `${…}` EST RENETTOYÉ, PAS RECOPIÉ

   `outil-verif-ordre.js` recopie le corps d'un `${…}` tel quel, en comptant
   simplement les accolades. Les chaînes qui s'y trouvent survivent donc à leur
   propre effacement, et le site en est plein :

       `<span>${T("accueil.entrer.voix")}</span>`

   `accueil` ressort alors comme un identifiant lu — cinq faux positifs sur six
   au premier relevé de cet outil, tous de cette seule cause. Là-bas c'est sans
   conséquence, parce que le nom doit AUSSI figurer parmi les déclarations pour
   compter ; ici il suffit d'être lu.

   Le gabarit est donc traité comme un vrai mode du lecteur, avec sa pile : on
   entre en mode texte au premier accent grave, on ressort en mode code à chaque
   `${`, et l'on y revient à l'accolade appariée — les chaînes du dedans passent
   par le même blanchiment que les autres, aussi profondément qu'il le faut.

   SECONDE DIFFÉRENCE — la porte `gardeChaines`, où seuls les commentaires
   partent. C'est ce qui sert à savoir quels modules la page charge : la réponse
   est dans des chaînes (`document.write('<script src="…">')`), et il faut
   pouvoir les lire — sans pour autant croire un nom de fichier cité dans un
   commentaire. */
function nettoie(src, gardeChaines){
  let out = "", i = 0;
  const n = src.length;
  const cache = c => (gardeChaines ? c : (c === "\n" ? "\n" : " "));
  // Ce qui précède décide si un `/` ouvre une expression régulière ou divise.
  const avantRegex = () => {
    for(let k = out.length - 1; k >= 0; k--){
      const c = out[k];
      if(c === " " || c === "\n" || c === "\t") continue;
      return "(,=:[!&|?{};+-*%~^<>".includes(c);
    }
    return true;
  };

  /* `texte` : on est dans le corps littéral d'un gabarit, entre les accents.
     `retours` : à quoi revenir en fermant — "code" pour un accent grave,
     "texte" pour un `${`. `profs` retient la profondeur d'accolades du code
     qu'on a quitté en entrant dans un `${`. */
  let texte = false, prof = 0;
  const retours = [], profs = [];

  while(i < n){
    const c = src[i], d = src[i+1];

    if(texte){
      if(c === "\\"){ out += gardeChaines ? src.slice(i, i+2) : "  "; i += 2; continue; }
      if(c === "`"){
        out += gardeChaines ? "`" : " "; i++;
        texte = retours.pop() === "texte";
        continue;
      }
      if(c === "$" && d === "{"){
        out += gardeChaines ? "${" : "  "; i += 2;
        retours.push("texte"); profs.push(prof); prof = 0; texte = false;
        continue;
      }
      out += cache(c); i++; continue;
    }

    if(c === "/" && d === "/"){
      while(i < n && src[i] !== "\n"){ out += " "; i++; }
      continue;
    }
    if(c === "/" && d === "*"){
      out += "  "; i += 2;
      while(i < n && !(src[i] === "*" && src[i+1] === "/")){ out += src[i] === "\n" ? "\n" : " "; i++; }
      out += "  "; i += 2;
      continue;
    }
    if(c === "'" || c === '"'){
      out += gardeChaines ? c : " "; i++;
      while(i < n && src[i] !== c){
        if(src[i] === "\\"){ out += gardeChaines ? src.slice(i, i+2) : "  "; i += 2; continue; }
        out += cache(src[i]); i++;
      }
      out += gardeChaines ? (src[i] || "") : " "; i++;
      continue;
    }
    if(c === "`"){
      out += gardeChaines ? "`" : " "; i++;
      retours.push("code"); texte = true;
      continue;
    }
    if(c === "{"){ prof++; out += c; i++; continue; }
    if(c === "}"){
      if(prof === 0 && retours.length && retours[retours.length-1] === "texte"){
        retours.pop(); prof = profs.pop() || 0; texte = true;
        out += gardeChaines ? "}" : " "; i++; continue;
      }
      prof--; out += c; i++; continue;
    }
    if(c === "/" && !gardeChaines && avantRegex()){
      let j = i + 1, dansClasse = false, ferme = false;
      while(j < n){
        if(src[j] === "\\"){ j += 2; continue; }
        if(src[j] === "\n") break;
        if(src[j] === "[") dansClasse = true;
        else if(src[j] === "]") dansClasse = false;
        else if(src[j] === "/" && !dansClasse){ ferme = true; break; }
        j++;
      }
      if(ferme){
        for(let k = i; k <= j; k++) out += " ";
        i = j + 1;
        while(i < n && /[gimsuyd]/.test(src[i])){ out += " "; i++; }
        continue;
      }
    }
    out += c; i++;
  }
  return out;
}

// ══════════════════════════════════════════════════════ 2. les jetons
/* Découper en jetons plutôt que de marcher caractère par caractère : la moitié
   des faux positifs possibles vient de « ce qui précède » et « ce qui suit », et
   les lire sur des jetons est infiniment plus sûr que sur des caractères. */
const MOTS = new Set([
  "const","let","var","function","class","return","if","else","for","while","do",
  "switch","case","default","break","continue","new","typeof","instanceof","in","of",
  "this","null","true","false","undefined","void","delete","try","catch","finally",
  "throw","await","async","yield","export","import","extends","super","static",
  "arguments","debugger","with","enum",
]);
/* `get` et `set` sont absents, comme dans `outil-verif-ordre.js` : ce sont des
   noms ordinaires que la grammaire traite à part dans un littéral d'objet. Ils
   sont reconnus comme modificateurs plus bas, et seulement là. */
const MODIFS = new Set(["get","set","static"]);

const OPS = ["...","===","!==",">>>=","<<=",">>=","&&=","||=","??=","**=",">>>",
             "=>","==","!=","<=",">=","&&","||","??","?.","++","--",
             "+=","-=","*=","/=","%=","&=","|=","^=","**","<<",">>"]
            .sort((a, b) => b.length - a.length);

function jetons(code){
  const J = [];
  let i = 0, ligne = 1;
  const n = code.length;
  while(i < n){
    const c = code[i];
    if(c === "\n"){ ligne++; i++; continue; }
    if(c === " " || c === "\t" || c === "\r"){ i++; continue; }
    if(/[A-Za-z_$]/.test(c)){
      let j = i; while(j < n && /[A-Za-z0-9_$]/.test(code[j])) j++;
      J.push({ v: code.slice(i, j), ligne, nom: true }); i = j; continue;
    }
    if(/[0-9]/.test(c)){
      let j = i;
      while(j < n && /[0-9A-Za-z_.]/.test(code[j])){
        const av = code[j]; j++;
        if(/[eE]/.test(av) && /[+\-]/.test(code[j] || "")) j++;   // 1e-5
      }
      J.push({ v: code.slice(i, j), ligne, nombre: true }); i = j; continue;
    }
    let op = null;
    for(const o of OPS) if(code.startsWith(o, i)){ op = o; break; }
    if(!op) op = c;
    J.push({ v: op, ligne }); i += op.length;
  }
  return J;
}

// ══════════════════════════════════════════════════════ 3. déclarations et références
/* Un sac à déclarations qui COMPTE les doublons.

   Le nombre ne sert pas au verdict — un nom déclaré une fois ou trois fois est
   connu pareil. Il sert au groupe de sabotage : pour prouver qu'effacer une
   déclaration se voit, encore faut-il en choisir une qui soit la SEULE de son
   nom. Le premier jet effaçait `const now`, dont un paramètre de `boucle(now)`
   portait déjà le nom ; le sabotage ne cassait rien et l'outil se déclarait
   incapable de mordre alors qu'il mordait très bien. */
function sacDeNoms(){
  const m = new Map();
  return {
    add(nom){ m.set(nom, (m.get(nom) || 0) + 1); },
    has(nom){ return m.has(nom); },
    fois(nom){ return m.get(nom) || 0; },
    noms(){ return [...m.keys()]; },
    get taille(){ return m.size; },
  };
}

const PAIRES = { "(": ")", "[": "]", "{": "}" };

// Index du jeton qui SUIT le fermant apparié de `k`.
function apparie(J, k){
  const ouvre = J[k].v, ferme = PAIRES[ouvre];
  let d = 0;
  for(let i = k; i < J.length; i++){
    if(J[i].v === ouvre) d++;
    else if(J[i].v === ferme){ d--; if(!d) return i + 1; }
  }
  return J.length;
}

/* Un `{` ouvre-t-il un littéral d'objet ? La réponse se lit sur le jeton d'avant.

   Le sens de l'erreur compte : prendre un objet pour un bloc transforme ses noms
   de méthodes en références et FABRIQUE des orphelins ; prendre un bloc pour un
   objet en avale quelques-uns. La liste est donc généreuse, et le contrôle
   « un nom qui n'existe que comme clé n'est jamais signalé » l'éprouve. */
const OUVRE_OBJET = new Set([
  "=", "(", ",", ":", "[", "?", "&&", "||", "??", "!", "...",
  "+", "-", "*", "/", "%", "==", "===", "!=", "!==", "<", ">", "<=", ">=",
  "return", "typeof", "of", "in", "throw", "case", "await", "yield",
]);

// Les identifiants « nus » d'un fragment : ni après un point, ni suivis de `:`.
// Sert aux valeurs par défaut d'une destructuration et aux clés calculées.
function refsSimples(J, a, b, refs){
  for(let k = a; k < b; k++){
    const t = J[k];
    if(!t.nom || MOTS.has(t.v)) continue;
    const p = k > 0 ? J[k-1].v : "";
    if(p === "." || p === "?.") continue;
    if(J[k+1] && J[k+1].v === ":") continue;
    refs.push({ nom: t.v, ligne: t.ligne });
  }
}

/* `= valeur` dans un motif de destructuration ou une liste de paramètres : la
   valeur n'est pas déclarée, elle est LUE. On saute jusqu'à la virgule de même
   profondeur en récoltant ses noms. */
function sauteDefaut(J, k, fin, refs){
  if(!J[k] || J[k].v !== "=") return k;
  let d = 0, m = k + 1;
  while(m < fin){
    const v = J[m].v;
    if(v === "(" || v === "[" || v === "{") d++;
    else if(v === ")" || v === "]" || v === "}"){ if(d === 0) break; d--; }
    else if(v === "," && d === 0) break;
    m++;
  }
  refsSimples(J, k + 1, m, refs);
  return m;
}

/* Un motif de liaison : un nom, ou une destructuration. Rend l'index d'après.

   `{ a, b: c, d = 1, [k]: e, ...f }` déclare a, c, d, e, f — et lit `k` et `1`.
   `[ a, , b = z, ...c ]` déclare a, b, c — et lit `z`. */
function declareMotif(J, i, declares, refs){
  const t = J[i];
  if(!t) return i;
  if(t.v === "...") return declareMotif(J, i + 1, declares, refs);
  if(t.nom && !MOTS.has(t.v)){ declares.add(t.v); return i + 1; }
  if(t.v === "{" || t.v === "["){
    const fin = apparie(J, i);            // index APRÈS le fermant
    const objet = t.v === "{";
    let k = i + 1;
    while(k < fin - 1){
      const avant = k;
      const j = J[k];
      if(j.v === "," ){ k++; continue; }
      if(j.v === "..."){ k++; continue; }
      if(objet && j.v === "["){                       // clé calculée
        const f2 = apparie(J, k);
        refsSimples(J, k + 1, f2 - 1, refs);
        k = f2;
        if(J[k] && J[k].v === ":") k = declareMotif(J, k + 1, declares, refs);
        k = sauteDefaut(J, k, fin - 1, refs);
        if(k === avant) k++;
        continue;
      }
      if(objet && j.nom && J[k+1] && J[k+1].v === ":"){  // `clé: cible`
        k = declareMotif(J, k + 2, declares, refs);
        k = sauteDefaut(J, k, fin - 1, refs);
        if(k === avant) k++;
        continue;
      }
      k = declareMotif(J, k, declares, refs);
      k = sauteDefaut(J, k, fin - 1, refs);
      if(k === avant) k++;
    }
    return fin;
  }
  return i + 1;      // rien de reconnaissable : on avance pour ne pas boucler
}

// Une liste de paramètres `( … )`. Rend l'index d'après la parenthèse fermante.
function declareParams(J, i, declares, refs){
  const fin = apparie(J, i);
  let k = i + 1;
  while(k < fin - 1){
    const avant = k;
    if(J[k].v === ","){ k++; continue; }
    k = declareMotif(J, k, declares, refs);
    k = sauteDefaut(J, k, fin - 1, refs);
    if(k === avant) k++;
  }
  return fin;
}

/* Le cœur. Rend { declares:Set, refs:[{nom, ligne}], profondeurFinale }.

   `profondeurFinale` doit valoir zéro : une pile perdue voudrait dire que la
   lecture a déraillé, et un outil qui déraille rend une liste vide — c'est-à-dire
   qu'il passe au vert sans rien mesurer. */
function analyse(src, sac){
  const J = jetons(nettoie(src));
  const declares = sac || sacDeNoms();
  const refs = [];
  const pile = [];
  const genreHaut = () => (pile.length ? pile[pile.length-1].genre : "bloc");

  let i = 0;
  let declMode = false, declProfondeur = 0, attendMotif = false;
  let attendClasse = false;

  while(i < J.length){
    const t = J[i], v = t.v;
    const p = i > 0 ? J[i-1].v : "";
    const s = J[i+1] ? J[i+1].v : "";

    // ── les mots qui commandent
    if(v === "function"){
      i++;
      if(J[i] && J[i].v === "*") i++;
      if(J[i] && J[i].nom && !MOTS.has(J[i].v)){ declares.add(J[i].v); i++; }
      if(J[i] && J[i].v === "(") i = declareParams(J, i, declares, refs);
      continue;
    }
    if(v === "catch"){
      i++;
      if(J[i] && J[i].v === "(") i = declareParams(J, i, declares, refs);
      continue;
    }
    if(v === "class"){
      i++;
      if(J[i] && J[i].nom && J[i].v !== "extends"){ declares.add(J[i].v); i++; }
      attendClasse = true;
      continue;
    }
    if(v === "const" || v === "let" || v === "var"){
      declMode = true; declProfondeur = pile.length; attendMotif = true;
      i++; continue;
    }
    /* `typeof machin` ne lève jamais, même sur un nom qui n'existe pas : c'est
       le seul moyen légal de demander « ce nom est-il là ? ». Le signaler serait
       signaler du code correct. */
    if(v === "typeof"){
      i++;
      if(J[i] && J[i].nom && !MOTS.has(J[i].v) && (!J[i+1] || J[i+1].v !== ".")) i++;
      continue;
    }

    // ── le motif d'une déclaration en cours
    if(declMode && attendMotif && pile.length === declProfondeur
       && ((t.nom && !MOTS.has(v)) || v === "{" || v === "[")){
      i = declareMotif(J, i, declares, refs);
      attendMotif = false;
      continue;
    }

    // ── la ponctuation qui porte la structure
    if(v === "("){
      // `(…) =>` : des paramètres, pas des références.
      const fin = apparie(J, i);
      if(J[fin] && J[fin].v === "=>"){ i = declareParams(J, i, declares, refs); continue; }
      pile.push({ genre: "paren" }); i++; continue;
    }
    if(v === "["){ pile.push({ genre: "crochet" }); i++; continue; }
    if(v === ")" || v === "]"){
      pile.pop();
      if(declMode && pile.length < declProfondeur) declMode = false;   // `for(const x of y)`
      i++; continue;
    }
    if(v === "{"){
      let genre = "bloc";
      if(attendClasse){ genre = "classe"; attendClasse = false; }
      else if(OUVRE_OBJET.has(p)) genre = "objet";
      pile.push({ genre }); i++; continue;
    }
    if(v === "}"){
      pile.pop();
      if(declMode && pile.length < declProfondeur) declMode = false;
      i++; continue;
    }
    if(v === ";"){ declMode = false; attendMotif = false; i++; continue; }
    if(v === ","){
      if(declMode && pile.length === declProfondeur) attendMotif = true;
      i++; continue;
    }

    // ── un identifiant
    if(t.nom){
      if(MOTS.has(v)){ i++; continue; }
      if(p === "." || p === "?."){ i++; continue; }         // `a.nom`
      if(s === "=>"){ declares.add(v); i++; continue; }     // `x => …`

      /* Une clé, ou une étiquette. Les deux formes sont écartées PARTOUT et pas
         seulement dans un littéral d'objet reconnu : c'est ce qui rend inoffensif
         un objet que la détection aurait pris pour un bloc. En contrepartie on
         perd la lecture `a` de `f(x, a ? b : c)` — jamais rencontrée, et une
         référence perdue ne fabrique pas de fausse alerte. */
      if((p === "{" || p === ",") && s === ":"){ i++; continue; }
      if((p === "" || p === ";" || p === "}") && s === ":"){ i++; continue; }

      if(genreHaut() === "objet" && (p === "{" || p === ",")){
        if(s === "("){                                     // `nom(…){ … }`
          i++;
          i = declareParams(J, i, declares, refs);
          continue;
        }
        if(MODIFS.has(v) && J[i+1] && J[i+1].nom && J[i+2] && J[i+2].v === "("){
          i += 2;                                          // `get place(){ … }`
          i = declareParams(J, i, declares, refs);
          continue;
        }
      }
      /* Un corps de `class`. Il n'y en a aucun dans les sources lues aujourd'hui ;
         ces trois lignes existent pour que le jour où il y en aura, les noms de
         membres ne soient pas pris pour des lectures. */
      if(genreHaut() === "classe" && (p === "{" || p === "}" || p === ";")){
        if(s === "(" || s === "=" || s === ";" || s === "}"){
          i++;
          if(J[i] && J[i].v === "(") i = declareParams(J, i, declares, refs);
          continue;
        }
        if(MODIFS.has(v) || v === "async"){ i++; continue; }
      }

      refs.push({ nom: v, ligne: t.ligne });
      i++; continue;
    }

    i++;
  }
  return { declares, refs, profondeurFinale: pile.length };
}

// ══════════════════════════════════════════════════════ 4. les globaux posés par les modules
/* Jamais écrits en dur : on relit les fichiers. Un module renommé, un global
   ajouté, et l'outil suit sans qu'on y touche. */
const POSE = /\b(?:global|window|globalThis|self)\s*\.\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*=(?!=)/g;
function globauxPoses(src){
  const noms = new Set();
  const net = nettoie(src, true);       // commentaires ôtés, chaînes gardées
  let m;
  POSE.lastIndex = 0;
  while((m = POSE.exec(net)) !== null) noms.add(m[1]);
  return noms;
}

/* La page charge-t-elle ce fichier ?

   On lui ôte d'abord ses commentaires — ceux du HTML et ceux du JavaScript de
   ses blocs — puis on cherche le nom du fichier dans ce qui reste. Les
   commentaires sont le point qui compte : `pantheon.js` figure dans `index.html`
   à l'intérieur d'un `<!-- … -->`, avec sa balise complète, et il n'est
   justement PAS chargé. Le lire ferait entrer `PANTHEON` dans les noms connus.

   Ce qui reste attrape les trois façons dont cette page charge un script : la
   balise `<script src>`, le `document.write('<script src="…">')` qui choisit la
   langue, et le `s.src = "verif.js"` des harnais à la demande. */
function pageSansCommentaires(page, blocs){
  let out = page;
  for(const b of blocs){
    const k = out.indexOf(b.contenu);
    if(k < 0) continue;
    out = out.slice(0, k) + nettoie(b.contenu, true) + out.slice(k + b.contenu.length);
  }
  return out.replace(/<!--[\s\S]*?-->/g, " ");
}
const estCharge = (pageNette, fichier) =>
  new RegExp("(^|[^A-Za-z0-9_.\\-/])" + fichier.replace(/\./g, "\\.")).test(pageNette);

// ══════════════════════════════════════════════════════ 5. les globaux du langage et du navigateur
/* Une liste explicite, courte, et sciemment incomplète : chercher l'exhaustivité
   d'une plateforme qui bouge serait un travail sans fin, et le cliquet absorbe ce
   qui manque — un global oublié ici sort une fois dans la liste, se reconnaît en
   trois secondes, et se rajoute. */
const PLATEFORME = new Set([
  // le langage
  "Object","Array","String","Number","Boolean","Symbol","BigInt","Function",
  "Math","JSON","Date","RegExp","Map","Set","WeakMap","WeakSet","Promise",
  "Proxy","Reflect","Intl","Error","TypeError","RangeError","SyntaxError",
  "ReferenceError","EvalError","URIError","AggregateError","Infinity","NaN",
  "globalThis","parseInt","parseFloat","isNaN","isFinite","eval",
  "encodeURI","decodeURI","encodeURIComponent","decodeURIComponent",
  "ArrayBuffer","SharedArrayBuffer","DataView","Int8Array","Uint8Array",
  "Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array",
  "Float32Array","Float64Array","BigInt64Array","BigUint64Array",
  "structuredClone","queueMicrotask",
  // la fenêtre et le document
  "window","self","top","parent","frames","document","navigator","location",
  "history","screen","localStorage","sessionStorage","console","devicePixelRatio",
  "innerWidth","innerHeight","outerWidth","outerHeight","scrollX","scrollY",
  "matchMedia","getComputedStyle","getSelection","alert","confirm","prompt",
  "open","close","focus","blur","scrollTo","scrollBy","print","postMessage",
  "addEventListener","removeEventListener","dispatchEvent",
  // le temps et le réseau
  "setTimeout","clearTimeout","setInterval","clearInterval",
  "requestAnimationFrame","cancelAnimationFrame","requestIdleCallback",
  "cancelIdleCallback","performance","fetch","XMLHttpRequest","WebSocket",
  "Worker","navigator","caches","indexedDB","crypto",
  // ce qu'on construit avec `new`
  "Image","Audio","AudioContext","webkitAudioContext","OfflineAudioContext",
  "Blob","File","FileReader","FormData","URL","URLSearchParams",
  "Event","CustomEvent","MouseEvent","KeyboardEvent","TouchEvent","PointerEvent",
  "WheelEvent","DragEvent","ResizeObserver","IntersectionObserver",
  "MutationObserver","DOMParser","XMLSerializer","TextEncoder","TextDecoder",
  "Path2D","ImageData","OffscreenCanvas","createImageBitmap","atob","btoa",
  "SpeechSynthesisUtterance","speechSynthesis","visualViewport",
  // les types que le site touche vraiment
  "Element","HTMLElement","HTMLCanvasElement","HTMLImageElement","Node","NodeList",
  "CanvasRenderingContext2D","WebGLRenderingContext","WebGL2RenderingContext",
  "WebGLTexture","WebGLProgram","WebGLBuffer",
  // les bibliothèques posées par `vendor/`, chargées en `<script src>` mais
  // hors du dépôt : on ne va pas les analyser pour deux noms.
  "katex","renderMathInElement",
]);

// ══════════════════════════════════════════════════════ 6. la chasse elle-même
/* Prend un « monde » et rend ce qu'on y trouve. Tout passe par ici : le dépôt
   réel comme les sources fabriquées des auto-tests. C'est ce qui permet de
   prouver que la mesure sait voir — sans quoi elle ne prouve rien.

   monde = {
     page      : le texte d'index.html
     fichiers  : [{ nom, source }]  — les modules du dépôt
     extras    : [{ nom, source }]  — les sources hors page à analyser aussi
   } */
function chasse(monde){
  const { code: blocs } = decoupe(monde.page);
  const pageNette = pageSansCommentaires(monde.page, blocs);

  const sources = blocs.map(b => ({
    fichier: "index.html",
    // `depart` est la ligne de la balise ouvrante, et le contenu commence sur
    // cette même ligne : la première ligne du bloc est donc `depart`, pas la
    // suivante.
    decalage: b.depart - 1,
    contenu: b.contenu,
  })).concat((monde.extras || []).map(e => ({
    fichier: e.nom, decalage: 0, contenu: e.source,
  })));

  // 1. ce qui est déclaré dans les sources, à plat
  const declares = sacDeNoms();
  const posesPage = new Set();
  const refs = [];
  const perdus = [];
  for(const s of sources){
    const a = analyse(s.contenu, declares);
    for(const r of a.refs) refs.push({ nom: r.nom, fichier: s.fichier, ligne: r.ligne + s.decalage });
    if(a.profondeurFinale !== 0) perdus.push(s.fichier + " (+" + a.profondeurFinale + ")");
    // Un bloc qui pose lui-même un global le rend disponible aux autres. Il
    // reste à part des déclarations, dont on compte les doublons.
    globauxPoses(s.contenu).forEach(g => posesPage.add(g));
  }

  // 2. les globaux des modules — comptés seulement si la page les charge
  const poses = new Map();        // nom → { fichier, charge }
  for(const f of (monde.fichiers || [])){
    const charge = estCharge(pageNette, f.nom);
    for(const g of globauxPoses(f.source)){
      const av = poses.get(g);
      if(!av || (!av.charge && charge)) poses.set(g, { fichier: f.nom, charge });
    }
  }

  const connus = new Set(declares.noms());
  posesPage.forEach(x => connus.add(x));
  PLATEFORME.forEach(x => connus.add(x));
  poses.forEach((info, nom) => { if(info.charge) connus.add(nom); });

  // 3. le verdict : lu quelque part, connu nulle part
  const parNom = new Map();
  for(const r of refs){
    if(connus.has(r.nom)) continue;
    if(!parNom.has(r.nom)) parNom.set(r.nom, { nom: r.nom, sites: [], dormant: null });
    parNom.get(r.nom).sites.push({ fichier: r.fichier, ligne: r.ligne });
  }
  for(const e of parNom.values()){
    e.sites.sort((a, b) => a.fichier.localeCompare(b.fichier) || a.ligne - b.ligne);
    const p = poses.get(e.nom);
    if(p && !p.charge) e.dormant = p.fichier;
  }
  const inconnus = [...parNom.values()].sort((a, b) =>
    a.sites[0].fichier.localeCompare(b.sites[0].fichier)
    || a.sites[0].ligne - b.sites[0].ligne);

  return { inconnus, connus, declares, poses, sources, refs, perdus, blocs };
}

// ══════════════════════════════════════════════════════════════ 7. le verdict
let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
function stop(titre, lignes){
  console.log("\n  ❌  " + titre);
  console.log("  " + "─".repeat(titre.length + 4));
  for(const l of lignes) console.log("      " + l);
  console.log("");
  process.exit(1);
}

console.log("\n  LES NOMS ORPHELINS — LU QUELQUE PART, DÉCLARÉ NULLE PART");
console.log("  ═══════════════════════════════════════════════════════");

const ICI = __dirname;
const page = fs.readFileSync(path.join(ICI, "index.html"), "utf8");

/* Les modules : tous les `.js` de la racine, moins les outils. Un `outil-*.js`
   n'est jamais chargé par la page — il tourne dans Node —, et l'en-tête de
   `outil-verif-cockpit.js` cite `global.COCKPIT = { dessine };` en exemple.
   Les compter reviendrait à créditer la page de globaux qui n'y sont pas. */
const fichiers = fs.readdirSync(ICI)
  .filter(f => f.endsWith(".js") && !/^outil-/.test(f) && f !== "tout.js")
  .map(nom => ({ nom, source: fs.readFileSync(path.join(ICI, nom), "utf8") }));

/* `verif.js` et `juge.js` vivent dehors mais lisent la portée de la page : ce
   sont EUX qui portaient deux des cinq lectures du `registre` disparu. Les
   laisser hors de la chasse laisserait le trou par où l'erreur est entrée. */
const HORS_PAGE = ["verif.js", "juge.js"];
for(const f of HORS_PAGE)
  if(!fs.existsSync(path.join(ICI, f)))
    stop(f + " est introuvable — RIEN N'A ÉTÉ MESURÉ", [
      "Cet outil lit index.html, verif.js et juge.js. Si l'un manque, un",
      "« tout passe » voudrait dire qu'on n'a pas regardé là où l'erreur est entrée.",
    ]);
const extras = HORS_PAGE.map(nom => ({
  nom, source: fs.readFileSync(path.join(ICI, nom), "utf8"),
}));

const R = chasse({ page, fichiers, extras });

groupe("Ce qu'on lit");
console.log("  sources analysées         " + String(R.sources.length).padStart(5)
            + "   (" + R.blocs.length + " blocs d'index.html + " + extras.length + " fichiers)");
console.log("  identifiants lus          " + String(R.refs.length).padStart(5));
console.log("  noms déclarés             " + String(R.declares.taille).padStart(5));
const charges = [...R.poses.values()].filter(p => p.charge).length;
console.log("  globaux posés par modules " + String(R.poses.size).padStart(5)
            + "   dont " + charges + " par un module que la page charge");
console.log("  noms connus au total      " + String(R.connus.size).padStart(5));
console.log("  ORPHELINS — le cliquet    " + String(R.inconnus.length).padStart(5));

/* ════════════════════════════════ LA MESURE SAIT-ELLE VOIR ?  (règle 2)

   Un détecteur qui rend une liste courte doit prouver qu'il aurait vu quelque
   chose. On lui fabrique des mondes minuscules dont on connaît la réponse, dans
   les DEUX sens : il doit crier sur un nom absent et se taire sur ce qui est
   licite. Les cinq premières épreuves sont exactement les cas demandés ; les
   suivantes gardent les angles où un faux positif peut naître.

   Sans ce groupe, l'outil pourrait ne rien mordre du tout — l'expression de
   nettoyage cassée, la pile perdue, la découpe des blocs muette — et passer au
   vert en beauté. */
const balise = f => '<script src="' + f + '"></script>\n';
function petitMonde(o){
  const blocs = (o.blocs || []).map(b => "<script>\n" + b + "\n</script>\n").join("");
  const tags  = (o.charges || []).map(balise).join("");
  return {
    page: "<html><body>\n" + tags + blocs + "</body></html>\n",
    fichiers: o.fichiers || [],
    extras: o.extras || [],
  };
}
const nomsDe = r => r.inconnus.map(x => x.nom);
const signale = (r, nom) => nomsDe(r).indexOf(nom) >= 0;

const EPREUVES = [
  { nom: "un nom lu et jamais déclaré est signalé",
    monde: () => petitMonde({ blocs: ["const a = registre.length;"] }),
    veut: r => signale(r, "registre") },

  { nom: "déclaré dans un AUTRE bloc, il ne l'est plus — les blocs partagent la portée",
    monde: () => petitMonde({ blocs: ["const registre = [];", "const a = registre.length;"] }),
    veut: r => !signale(r, "registre") && r.inconnus.length === 0 },

  { nom: "une clé de littéral d'objet n'est jamais signalée",
    monde: () => petitMonde({ blocs: ["const o = { registre: 1, autre: 2 };"] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "ce qui suit un point non plus",
    monde: () => petitMonde({ blocs: ["const o = {}; o.registre = 1; const b = o.registre;"] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "un global posé par un module CHARGÉ est connu",
    monde: () => petitMonde({ blocs: ["TRUC.fait();"],
                              charges: ["truc.js"],
                              fichiers: [{ nom: "truc.js", source: "global.TRUC = { fait };" }] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "le MÊME module non chargé, et le nom est signalé",
    monde: () => petitMonde({ blocs: ["TRUC.fait();"],
                              fichiers: [{ nom: "truc.js", source: "global.TRUC = { fait };" }] }),
    veut: r => signale(r, "TRUC") },

  { nom: "et l'outil dit alors QUI le posait, pour qu'on sache quoi faire",
    monde: () => petitMonde({ blocs: ["TRUC.fait();"],
                              fichiers: [{ nom: "truc.js", source: "global.TRUC = { fait };" }] }),
    veut: r => r.inconnus.length === 1 && r.inconnus[0].dormant === "truc.js" },

  { nom: "une balise citée dans un commentaire HTML ne charge rien",
    monde: () => ({ page: "<html><body>\n<!-- " + balise("truc.js") + " -->\n"
                          + "<script>\nTRUC.fait();\n</script>\n</body></html>",
                    fichiers: [{ nom: "truc.js", source: "global.TRUC = {};" }] }),
    veut: r => signale(r, "TRUC") },

  { nom: "un paramètre de fonction, de flèche ou de `catch` est déclaré",
    monde: () => petitMonde({ blocs: [
      "function f(a, b){ return a + b; }\n"
      + "const g = (c, d) => c * d;\n"
      + "const h = e => e;\n"
      + "try { f(1,2); } catch(err){ console.log(err); }" ] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "une destructuration déclare ses noms, et lit ses valeurs par défaut",
    monde: () => petitMonde({ blocs: [
      "const { a, b: c, ...d } = source;\n"
      + "const [ e, f = manquant ] = liste;\n"
      + "console.log(a, c, d, e, f);" ] }),
    veut: r => nomsDe(r).sort().join(",") === "liste,manquant,source" },

  { nom: "une méthode abrégée est une clé, et ses paramètres sont déclarés",
    monde: () => petitMonde({ blocs: [
      "const o = { dessine(ctx, W){ return ctx + W; }, get place(){ return 1; } };\n"
      + "o.dessine(1, 2);" ] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "un nom dans un commentaire ou une chaîne ne compte pas",
    monde: () => petitMonde({ blocs: [
      "// registre\n/* registre */\nconst s = \"registre\" + `x ${1} registre`;" ] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "mais l'intérieur d'un gabarit `${…}` est bien du code",
    monde: () => petitMonde({ blocs: ["const s = `x ${registre} y`;"] }),
    veut: r => signale(r, "registre") },

  { nom: "une propriété entre crochets, écrite en chaîne, n'est pas un nom",
    monde: () => petitMonde({ blocs: ["const o = {}; const v = o[\"registre\"];"] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "`typeof machin` est licite même sur un nom absent",
    monde: () => petitMonde({ blocs: ["if(typeof registre !== \"undefined\") console.log(1);"] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "un nuanceur GLSL n'est pas du JavaScript",
    monde: () => ({ page: "<html><body>\n"
                    + "<script id=\"fs\" type=\"x-shader\">void main(){ vec3 registre; }</script>\n"
                    + "</body></html>", fichiers: [] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "une source hors page est lue elle aussi — c'est par là que c'est entré",
    monde: () => ({ page: "<html><body><script>const a = 1;</script></body></html>",
                    fichiers: [],
                    extras: [{ nom: "verif.js", source: "REGISTRE_DISPARU.tout();" }] }),
    veut: r => signale(r, "REGISTRE_DISPARU")
            && r.inconnus[0].sites[0].fichier === "verif.js" },

  { nom: "un global posé par la page elle-même est connu de ses autres blocs",
    monde: () => petitMonde({ blocs: ["window.POSE_ICI = 1;", "POSE_ICI += 1;"] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "une boucle `for` déclare son compteur, `for…of` sa variable",
    monde: () => petitMonde({ blocs: [
      "const l = [1]; for(let i = 0; i < l.length; i++) console.log(i);\n"
      + "for(const x of l) console.log(x);\n"
      + "for(const [k, v] of l) console.log(k, v);" ] }),
    veut: r => r.inconnus.length === 0 },

  { nom: "et le numéro de ligne rendu est le bon",
    monde: () => petitMonde({ blocs: ["const a = 1;\nconst b = 2;\nconst c = orphelin;"] }),
    // "<html><body>\n" = 1, "<script>" = 2, puis les trois lignes → 5
    veut: r => r.inconnus.length === 1 && r.inconnus[0].sites[0].ligne === 5 },
];

groupe("La mesure sait voir — épreuves sur des mondes fabriqués");
for(const e of EPREUVES){
  let r = null, boum = null;
  try { r = chasse(e.monde()); } catch(err){ boum = err; }
  ok(e.nom, !boum && e.veut(r),
     "vu", boum ? boum.name + " : " + boum.message
                : (r.inconnus.length ? nomsDe(r).join(", ") : "aucun orphelin"));
}

groupe("La mesure elle-même tient debout");
ok("les blocs de la page ont bien été découpés", R.blocs.length >= 3, "≥ 3", R.blocs.length,
   "un zéro voudrait dire que la découpe ne mord plus, et la liste serait vide"
   + " pour la pire des raisons");
ok("les parenthèses se referment dans chaque source", R.perdus.length === 0,
   "profondeur 0 partout", R.perdus.length ? R.perdus.join(", ") : "0",
   "une pile perdue rend une lecture qui déraille, donc une liste courte et fausse");
ok("on a bien récolté des références", R.refs.length > 2000, "> 2000", R.refs.length);
ok("et bien trouvé des déclarations", R.declares.taille > 300, "> 300", R.declares.taille);
ok("les modules du dépôt ont bien été lus", R.poses.size > 20, "> 20 globaux posés",
   R.poses.size, "aucun nom de module n'est écrit en dur dans ce fichier");
ok("et la page en charge une partie seulement", charges > 0 && charges < R.poses.size,
   "0 < chargés < posés", charges + " / " + R.poses.size,
   "si tout était compté chargé, un module oublié dans les balises passerait inaperçu");

/* ═══════════════════════ LE CONTRÔLE SAIT-IL ÉCHOUER SUR LE DÉPÔT RÉEL ? (règle 2)

   Les épreuves d'au-dessus tournent sur des mondes de trois lignes. Elles
   prouvent que l'analyse voit juste ; elles ne prouvent pas qu'elle mordrait
   dans un fichier de six mille lignes, où un seul détail mal lu suffirait à
   noyer un orphelin dans la masse des noms connus.

   On casse donc le VRAI dépôt, en mémoire, de deux façons — et rien n'est
   jamais écrit sur le disque.

   · ON RETIRE UNE BALISE. C'est le défaut du 7 août dans sa forme pure : le
     module est là, son global est là, la page ne le charge plus. Le module et
     le nom ne sont pas écrits ici — ils sont CHOISIS par le contrôle, parmi
     ceux que la page lit vraiment. Le sabotage survivra donc à un renommage.
   · ON EFFACE UNE DÉCLARATION. Un `const` de la page perd son nom, comme
     lorsqu'il part dans un module ; ses lecteurs restent. Là encore le nom est
     choisi et non écrit : le premier `const` de la page qui soit relu au moins
     trois fois ailleurs.

   Si l'un des deux sabotages passait inaperçu, cet outil échouerait. Un zéro
   qu'on ne sait pas faire remonter ne mesure rien. */
groupe("Le contrôle sait échouer sur le dépôt réel — on le casse pour le prouver");
{
  const lus = new Set(R.refs.map(r => r.nom));

  // ── sabotage 1 : une balise retirée
  let cible = null;
  R.poses.forEach((info, nom) => {
    if(!cible && info.charge && lus.has(nom)) cible = { nom, fichier: info.fichier };
  });
  if(!cible){
    ok("on trouve un module chargé dont la page lit le global", false,
       "au moins un", "aucun",
       "sans lui, ce groupe ne peut rien casser — et ne prouve donc rien");
  } else {
    const sansBalise = page.replace(
      new RegExp("<script[^>]*\\bsrc\\s*=\\s*[\"'][^\"']*"
                 + cible.fichier.replace(/\./g, "\\.") + "[^\"']*[\"'][^>]*>\\s*</script>", "g"), "");
    const change = sansBalise.length !== page.length;
    const r = change ? chasse({ page: sansBalise, fichiers, extras }) : null;
    ok("retirer la balise de " + cible.fichier + " fait ressortir « " + cible.nom + " »",
       change && r.inconnus.some(x => x.nom === cible.nom),
       "« " + cible.nom + " » signalé",
       !change ? "la balise n'a pas pu être retirée — sabotage inexploitable"
               : (r.inconnus.length ? r.inconnus.map(x => x.nom).join(", ") : "aucun orphelin"),
       "c'est le 7 août à l'identique : le module existe, la page ne le charge plus");
  }

  /* ── sabotage 2 : une déclaration effacée

     Deux conditions sur la victime, et la seconde a été apprise à la dure : le
     nom doit être relu au moins trois fois, ET n'être déclaré qu'UNE seule fois
     dans tout ce qu'on lit. Sans elle, le contrôle tombait sur `const now`,
     dont le paramètre de `boucle(now)` porte déjà le nom — la portée étant
     traitée à plat, l'homonyme reprenait aussitôt la place et le sabotage ne
     cassait rien. L'outil se déclarait alors incapable de mordre, alors qu'il
     mordait parfaitement. */
  const compte = new Map();
  for(const r of R.refs) compte.set(r.nom, (compte.get(r.nom) || 0) + 1);
  const netPage = nettoie(page);
  let victime = null;
  const re = /\bconst\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/g;
  let m;
  while((m = re.exec(netPage)) !== null){
    if((compte.get(m[1]) || 0) >= 3 && R.declares.fois(m[1]) === 1){ victime = m[1]; break; }
  }
  if(!victime){
    ok("on trouve un `const` de la page relu ailleurs et déclaré une seule fois",
       false, "au moins un", "aucun",
       "sans victime, ce sabotage ne prouve rien — et il ne faut pas faire semblant");
  } else {
    const mort = new RegExp("\\bconst\\s+" + victime + "\\s*=");
    const abimee = page.replace(mort, "const " + victime + "_PARTI =");
    const r = chasse({ page: abimee, fichiers, extras });
    ok("effacer la déclaration de « " + victime + " » le fait ressortir",
       abimee !== page && r.inconnus.some(x => x.nom === victime),
       "« " + victime + " » signalé",
       r.inconnus.length ? r.inconnus.map(x => x.nom).slice(0, 4).join(", ") : "aucun orphelin",
       "un domaine qui part en module emporte sa déclaration et laisse ses lecteurs :"
       + " c'est exactement cette forme-là");
  }
}

groupe("Le cliquet — les noms orphelins");
ok("le compte n'a pas monté", R.inconnus.length <= INCONNUS,
   "≤ " + INCONNUS, R.inconnus.length,
   R.inconnus.length > INCONNUS
     ? "Un nom est lu et n'existe nulle part. C'est la ReferenceError du "
       + "7 août : le bloc entier meurt, sans un mot dans la console."
     : "chaque extraction future qui laisserait un lecteur derrière elle "
       + "ferait rougir cette ligne");

if(R.inconnus.length < INCONNUS){
  console.log("\n  ⬇  LE PLAFOND PEUT DESCENDRE : " + INCONNUS + " → " + R.inconnus.length);
  console.log("     Modifier `INCONNUS` dans ce fichier. C'est le seul entretien qu'il demande.");
}

if(R.inconnus.length){
  console.log("\n  La liste, triée :");
  for(const e of R.inconnus){
    const s = e.sites[0];
    const suite = e.sites.length > 1
      ? "  (+ " + (e.sites.length - 1) + " : "
        + e.sites.slice(1, 4).map(x => x.fichier + ":" + x.ligne).join(", ")
        + (e.sites.length > 4 ? ", …" : "") + ")"
      : "";
    console.log("      " + (s.fichier + ":" + s.ligne).padEnd(22) + e.nom.padEnd(24)
                + (e.dormant ? "← posé par " + e.dormant + ", que la page ne charge PAS" : "")
                + suite);
  }
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
