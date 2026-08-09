/* ============================================================================
   LE RENDU — simulation ou cinéma — SANS NAVIGATEUR.

       node outil-verif-rendu.js

   Le module est petit et c'est voulu : une manette (la nébuleuse), deux modes.
   Ce qui mérite d'être gardé n'est pas sa taille, c'est ses COUTURES — trois
   endroits où il peut mentir sans que rien ne crie :

   1. LES CLÉS DE LIBELLÉ. `descripteur` rend « rendu.cinema » et la page fait
      `T(cle)` : une clé absente d'un fichier de langue s'afficherait telle
      quelle à l'écran. On lit donc les DEUX fichiers de langue et on exige
      chaque clé dans chacun.

   2. LE NUANCEUR. Le mode ne vaut que si `uNebuleuse` existe dans le fragment,
      s'il est poussé par la page, et si `ciel()` s'en sert. On lit `index.html`
      comme du texte et on exige les trois — sans quoi le sélecteur serait un
      bouton posé sur rien, ce qui est arrivé à d'autres (le cercle de l'ISCO
      disait « dernière orbite stable » sur un disque qui ne l'écoutait pas).

   3. LA MÉMOIRE ABÎMÉE. Le choix se range en chaîne dans le navigateur : tout
      ce qui en revient passe par `borne`, et n'importe quoi doit retomber sur
      le mode par défaut — jamais sur un état inconnu du nuanceur.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const faux = {};
new Function("window", fs.readFileSync(path.join(ICI, "rendu.js"), "utf8"))(faux);
const R = faux.RENDU;

const PAGE = fs.readFileSync(path.join(ICI, "index.html"), "utf8");
const UI_FR = fs.readFileSync(path.join(ICI, "ui.fr.js"), "utf8");
const UI_EN = fs.readFileSync(path.join(ICI, "ui.en.js"), "utf8");

console.log("\n  LE RENDU — SIMULATION OU CINÉMA");
console.log("  ═══════════════════════════════");

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

// ══════════════════════════════ 1. les deux modes, et le défaut
groupe("Les modes");
{
  ok("il y a exactement deux modes", R.MODES.length === 2, 2, R.MODES.length,
     "cinéma et simulation — un troisième serait une décision, pas un détail");
  ok("le défaut est un mode connu", R.MODES.indexOf(R.DEFAUT) >= 0,
     "membre de MODES", R.DEFAUT);
  ok("et le défaut est « cinema » — le regard actuel du site",
     R.DEFAUT === "cinema", "cinema", R.DEFAUT,
     "changer l'image sous les pieds de qui n'a rien demandé serait traiter le "
     + "visiteur comme un argument ; si cette attente change un jour, c'est une "
     + "décision d'Hugo, pas un accident");
}

// ══════════════════════════════ 2. ce que chaque mode commande
groupe("Les uniformes");
{
  ok("cinéma allume la nébuleuse", R.uniformes("cinema").nebuleuse === 1,
     1, R.uniformes("cinema").nebuleuse);
  ok("simulation l'éteint", R.uniformes("simulation").nebuleuse === 0,
     0, R.uniformes("simulation").nebuleuse);
  let nonNumerique = null;
  for(const m of R.MODES)
    for(const [k, v] of Object.entries(R.uniformes(m)))
      if(!Number.isFinite(v)) nonNumerique = m + "." + k + " = " + v;
  ok("toutes les manettes sont des nombres finis", nonNumerique === null,
     "nombres partout", nonNumerique || "nombres partout",
     "le nuanceur reçoit des flottants ; un booléen déguisé finit toujours par "
     + "vouloir devenir un fondu");
}

// ══════════════════════════════ 3. la mémoire abîmée
groupe("N'importe quoi retombe sur le défaut");
{
  const absurdes = ["Cinema", "SIMULATION", "cinéma", "", null, undefined,
                    42, {}, [], "reel", "netflix", "simulation "];
  let coupable = null;
  for(const e of absurdes)
    if(R.borne(e) !== R.DEFAUT && R.MODES.indexOf(R.borne(e)) < 0)
      coupable = String(e) + " → " + R.borne(e);
  const horsListe = absurdes.filter(e => R.MODES.indexOf(e) < 0);
  let passePas = null;
  for(const e of horsListe)
    if(R.borne(e) !== R.DEFAUT) passePas = String(e) + " → " + R.borne(e);
  ok("douze mémoires abîmées retombent sur le défaut", passePas === null,
     "toutes sur « " + R.DEFAUT + " »", passePas || "toutes",
     "la casse compte : « Cinema » n'est PAS un mode, et le laisser passer "
     + "fabriquerait un état que le nuanceur ne connaît pas");
  ok("et les deux modes légitimes passent inchangés",
     R.borne("cinema") === "cinema" && R.borne("simulation") === "simulation",
     "identité", R.borne("cinema") + " / " + R.borne("simulation"));
}

// ══════════════════════════════ 4. les clés de libellé existent, deux langues
groupe("Chaque clé du descripteur existe dans les deux langues");
{
  const cles = [];
  for(const m of R.MODES){
    cles.push(R.descripteur(m).cle);
    cles.push(R.descripteur(m).cle + ".note");
  }
  cles.push("rendu.etiq");
  let manqueFR = null, manqueEN = null;
  for(const c of cles){
    if(UI_FR.indexOf('"' + c + '"') < 0) manqueFR = c;
    if(UI_EN.indexOf('"' + c + '"') < 0) manqueEN = c;
  }
  ok("en français", manqueFR === null, "toutes présentes", manqueFR || "toutes",
     "une clé absente s'affiche telle quelle à l'écran — « rendu.cinema » en "
     + "toutes lettres devant un visiteur");
  ok("en anglais", manqueEN === null, "toutes présentes", manqueEN || "toutes");
}

// ══════════════════════════════ 5. le nuanceur écoute vraiment
groupe("Le nuanceur écoute — lu dans `index.html`, pas supposé");
{
  ok("`uNebuleuse` est déclaré dans le nuanceur",
     /uniform\s+float\s+uNebuleuse/.test(PAGE), "déclaré",
     /uniform\s+float\s+uNebuleuse/.test(PAGE) ? "déclaré" : "ABSENT");
  ok("la page le pousse à chaque image",
     /gl\.uniform1f\(uNebuleuse/.test(PAGE), "poussé",
     /gl\.uniform1f\(uNebuleuse/.test(PAGE) ? "poussé" : "JAMAIS POUSSÉ",
     "un uniforme jamais poussé vaut zéro : le mode cinéma perdrait sa nébuleuse "
     + "en silence");
  ok("et `ciel()` s'en sert",
     /neb\s*\*\s*uNebuleuse/.test(PAGE), "employé",
     /neb\s*\*\s*uNebuleuse/.test(PAGE) ? "employé" : "IGNORÉ",
     "sans quoi le sélecteur serait un bouton posé sur rien");
  ok("la page passe par `RENDU.uniformes`, pas par un nombre en dur",
     /RENDU\.uniformes\(/.test(PAGE), "par le module",
     /RENDU\.uniformes\(/.test(PAGE) ? "par le module" : "EN DUR",
     "deux endroits qui décident du même rendu, c'est la maladie du dépôt");
}

// ══════════════════════════════ 6. le choix se pose à DEUX endroits
/* « Le choix se pose au premier passage, à côté de celui de la langue, et se
   change ensuite dans les réglages » — CHANTIERS.md §15. Deux sélecteurs pour un
   seul réglage, c'est exactement la situation où l'un des deux finit par oublier
   d'enregistrer, ou par marquer l'actif pendant que l'autre reste sur l'ancien.
   La langue a déjà payé ce prix : sa fabrique est unique et son commentaire le
   dit. On exige donc ici la même discipline, lue dans le source de la page. */
groupe("Un seul sélecteur pour deux endroits");
{
  const uneSeuleFabrique = (PAGE.match(/function\s+poseChoixRendu/g) || []).length;
  ok("il n'existe qu'une fabrique", uneSeuleFabrique === 1, 1, uneSeuleFabrique,
     "deux fabriques pour un réglage, c'est la divergence garantie — la leçon "
     + "est écrite au-dessus de `poseChoixLangue`");

  for(const [ou, hote] of [["les réglages", "rendu-choix"], ["l'accueil", "acc-rendu"]]){
    ok("le sélecteur est posé dans " + ou,
       new RegExp("poseChoixRendu\\(\\$\\(\"" + hote + "\"\\)").test(PAGE),
       "posé", new RegExp("poseChoixRendu\\(\\$\\(\"" + hote + "\"\\)").test(PAGE) ? "posé" : "ABSENT");
    ok("et son hôte existe dans le balisage de " + ou,
       new RegExp("id=\"" + hote + "\"").test(PAGE), "présent",
       new RegExp("id=\"" + hote + "\"").test(PAGE) ? "présent" : "ABSENT",
       "un sélecteur posé dans un hôte qui n'existe pas ne peint rien, en silence");
  }

  ok("les deux se repeignent l'un l'autre", /CHOIX_RENDU\.forEach/.test(PAGE),
     "une liste de repeints", /CHOIX_RENDU\.forEach/.test(PAGE) ? "présente" : "ABSENTE",
     "sans elle on bascule sur l'accueil et les réglages montrent encore l'autre "
     + "mode — le réglage serait juste, son image mentirait");

  ok("le repeint des aveux suit la bascule", /poseAveux\(\$\("panneau"\), "reglages"\)/.test(PAGE),
     "présent", /poseAveux\(\$\("panneau"\), "reglages"\)/.test(PAGE) ? "présent" : "ABSENT",
     "le badge du fond de ciel dépend du mode : sans repeint il dénonce l'autre "
     + "rendu à trois centimètres du bouton qui le cause");
}

// ══════════════════════════════ 7. et ces contrôles savent tomber
groupe("Et ces contrôles savent tomber");
{
  const bac = sup => Object.assign({}, R, sup);

  const passoire = bac({ borne: m => m });
  ok("une borne passoire est vue", passoire.borne("netflix") !== R.DEFAUT,
     "vue", passoire.borne("netflix") === R.DEFAUT ? "PASSÉE INAPERÇUE" : "vue");

  const booleen = bac({ uniformes: m => ({ nebuleuse: m === "cinema" }) });
  let vu = false;
  for(const m of R.MODES)
    for(const v of Object.values(booleen.uniformes(m)))
      if(!Number.isFinite(v)) vu = true;
  ok("un uniforme booléen est vu", vu, "vu", vu ? "vu" : "PASSÉ INAPERÇU");

  const cleFolle = bac({ descripteur: m => ({ mode: m, cle: "rendu.imax" }) });
  ok("une clé de libellé inventée est vue",
     UI_FR.indexOf('"' + cleFolle.descripteur("cinema").cle + '"') < 0,
     "absente des langues, donc vue", "vue");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
