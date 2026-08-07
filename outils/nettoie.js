/* ============================================================================
   EFFACER CE QUI N'EST PAS DU CODE — une seule loi, deux lecteurs.

   `outil-verif-ordre.js` cherche les inversions d'ordre, `outil-verif-noms.js`
   cherche les noms orphelins. Les deux commencent par la même opération :
   blanchir commentaires, chaînes et expressions régulières, pour que plus rien
   ne puisse ressembler à un identifiant. Les sauts de ligne sont conservés —
   les numéros de ligne restent justes.

   C'est le même geste que `outils/blocs.js` pour la découpe, et pour la même
   raison : deux implémentations recopiées divergent, et le jour où elles
   divergent, l'un des deux outils lit un fichier que l'autre ne voit pas.

   ---------------------------------------------------------------------------
   CE FICHIER EXISTE PARCE QUE LA DIVERGENCE A EU LIEU

   `outil-verif-ordre.js` avait sa propre version, et elle recopiait le corps
   d'un `${…}` TEL QUEL — elle comptait les accolades et copiait les caractères
   sans les renettoyer. Les chaînes vivant dans un gabarit survivaient donc à
   leur propre effacement :

       `<span>${T("accueil.entrer.voix")}</span>`

   `accueil` en ressortait comme un identifiant lu. Là-bas la conséquence était
   douce — un nom doit AUSSI figurer parmi les déclarations pour compter, donc
   seuls les homonymes d'une vraie variable faisaient du bruit. Dans l'outil des
   noms orphelins, où il suffit d'être lu, c'était cinq faux positifs sur six au
   premier relevé, tous de cette seule cause.

   Le gabarit est donc traité ici comme un vrai MODE du lecteur, avec sa pile :
   on entre en mode texte au premier accent grave, on ressort en mode code à
   chaque `${`, et l'on y revient à l'accolade appariée. Les chaînes du dedans
   passent par le même blanchiment que les autres, aussi profondément qu'il le
   faut — un gabarit dans un gabarit dans un gabarit se lit correctement.

   ---------------------------------------------------------------------------
   LA PORTE `gardeChaines`

   Avec, seuls les commentaires partent. Ça sert à savoir quels modules la page
   charge : la réponse est dans des chaînes — `document.write('<script src="…">')`
   — et il faut pouvoir les lire, sans pour autant croire un nom de fichier cité
   dans un commentaire.
   ============================================================================ */

"use strict";

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

module.exports = { nettoie };
