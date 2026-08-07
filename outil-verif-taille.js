/* ============================================================================
   Le cliquet — le bloc de script ne doit plus grossir.

       node outil-verif-taille.js

   ---------------------------------------------------------------------------
   POURQUOI CE CHANTIER NE SE FERAIT JAMAIS SANS LUI

   Le bloc principal d'`index.html` vit en portée globale, avec des `const` non
   hissés. Une variable employée avant sa ligne le tue ENTIÈREMENT, et le
   symptôme est muet : le bloc s'arrête, la moitié du site disparaît, aucun
   message. C'est arrivé deux fois.

   `CHANTIERS.md` annonçait 3 500 lignes. Le 6 août 2026 il en faisait 4 276.
   Personne n'avait décidé qu'il grossirait — il a simplement grossi, parce que
   chaque ajout y était plus rapide qu'ailleurs et que rien ne comptait.

   C'est le défaut classique du chantier structurel : il n'a AUCUN effet
   visible, donc il ne se fera jamais « quand on aura le temps ».

   ---------------------------------------------------------------------------
   UN CLIQUET, PAS UN OBJECTIF

   On n'exige pas de découper aujourd'hui. On exige seulement que ça ne monte
   plus. Chaque sortie de domaine abaisse le plafond, et le plafond ne remonte
   jamais — c'est la même mécanique que les planchers de `contrat.js`, et c'est
   la seule forme qui ne se fait pas contourner : elle ne demande jamais un
   effort qu'on n'a pas le temps de fournir.

   ENTRETIEN : quand l'outil annonce qu'on peut descendre le plafond, on le
   descend. C'est tout ce que ce fichier demande.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

/* Le plafond. Il ne remonte JAMAIS.

   4 310 le 6 août 2026, après la précondition d'entrée des lieux et le réglage
   du ciel. Le point de départ est ce qu'il est : on ne récrit pas l'histoire,
   on l'empêche de continuer.

   Ce chiffre a d'ailleurs été posé à 4 291 au premier jet — une estimation — et
   l'outil a refusé de passer dès sa première exécution. C'est exactement le
   comportement qu'on lui demande, et il l'a prouvé avant même d'être commis. */
/* 4 314 le 7 août 2026 au soir. **LE PLAFOND MONTE POUR LA PREMIÈRE FOIS**, et
   ça se justifie ici comme l'outil l'exige.

   Il était à 4 310 toute la semaine, je l'ai descendu à 4 298 le matin même en
   retirant du code — puis le bandeau de vol demandé par Hugo (vitesse en
   fraction de c, dilatation, distance parcourue, phase) a coûté treize lignes
   de câblage dans la page.

   CE QUI A ÉTÉ TENTÉ D'ABORD, et qui a rendu quinze lignes : tout le formatage
   est parti dans `voyage1g.js` — `joli.vitesse`, `joli.dilatation` —, où il est
   éprouvable hors navigateur au lieu de vivre dans le bloc géant. C'est le bon
   mouvement, et il ne suffit pas.

   CE QUI N'A PAS ÉTÉ FAIT, et pourquoi : sortir la mise à jour du chronomètre
   dans un module. Elle ne touche que le DOM ; un module qui touche le DOM n'est
   pas éprouvable hors navigateur, donc l'extraction n'aurait servi qu'à
   déplacer des lignes pour satisfaire ce compteur. Truquer un contrôle coûte
   plus cher que treize lignes.

   Il reste treize lignes de câblage irréductible, plus trois de repli. Le
   plafond monte donc de 4 298 à 4 314, et redescendra au prochain domaine
   sorti.

   PUIS 4 343, LE MÊME SOIR ET POUR LE MÊME CHANTIER. Le découpage de la carte
   à l'ouverture de la baie — « la trace des orbites est devant la vitre dans le
   vaisseau » — demande de projeter les trois vitres et de tailler le calque.

   Là encore le cliquet a fait son travail avant de céder : la GÉOMÉTRIE des
   vitres est partie dans `vaisseau.js`, où elle vit à côté des montants qu'elle
   doit éviter et où une formule dupliquée aurait fini par diverger. Ce qui
   reste dans la page est la projection et la taille du calque, qui ne peuvent
   pas en sortir — elles ont besoin de la caméra de la pièce et du contexte de
   dessin.

   Deux hausses en une soirée, c'est beaucoup, et c'est le même chantier qui les
   demande. Le prochain qui touche à ce bloc devrait sortir un domaine entier
   plutôt qu'ajouter une ligne : la marge est consommée.

   ---------------------------------------------------------------------------
   4 382 LE 8 AOÛT — ET CE N'EST PAS UNE TROISIÈME HAUSSE.

   Le critère a changé, donc le chiffre change avec lui. On mesurait le plus
   gros bloc (4 343) ; on mesure maintenant la SOMME des blocs de code de la
   page (4 343 + 14 + 25 = 4 382). Pas une ligne n'a été ajoutée entre les deux
   relevés.

   La raison est écrite plus haut, près de la découpe : le chantier F2 commence
   par couper le bloc en trois, ce qui aurait fait tomber l'ancien compteur à
   ~2 400 sans que rien ne sorte du fichier. Un cliquet qu'on désarme en
   déplaçant une frontière ne cliquette pas.

   À partir d'ici il ne fait plus que descendre. Cible du chantier : ~2 300.

   4 255 le 8 août — LA PREMIÈRE DESCENTE DU CHANTIER. La coupe en trois blocs
   avait coûté huit lignes (deux `"use strict"` et deux commentaires de deux
   lignes) ; sortir le cockpit en rend cent trente-cinq. Le solde est payé dans
   le même commit, pour ne pas laisser une marge traîner.

   4 213 — les deux formateurs de durée dans `format.js`, et le calcul du
   spectre dans `spectre.js`.

   4 208 — le banc d'essai dans `banc.js`. Le gain en lignes est petit ; ce qui
   sort vaut mieux que sa taille : les deux seuils qui prononcent « juste » ou
   « faux » à l'écran vivaient dans une page qu'aucun outil ne lisait.

   3 892 — les écrans de bord dans `ecrans.js`. Le plus gros morceau du
   chantier : trois cent dix-neuf lignes d'un coup, et une ligne morte retirée
   au passage. Sous la barre des quatre mille pour la première fois. */
const PLAFOND = 3659;   // le dossier, le calque, l'habitacle, puis les libelles

// Le nombre de modules déjà sortis. Il ne descend jamais non plus : un module
// qu'on ferait rentrer dans le bloc serait le contraire exact du chantier.
// Monté de 24 à 26 le 7 août 2026 : `kerrschild.js` et `contrat.js` — l'outil
// l'avait signalé lui-même, c'est le seul entretien qu'il demande.
const MODULES_SORTIS = 26;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

const ici = __dirname;
const page = fs.readFileSync(path.join(ici, "index.html"), "utf8");

/* Les blocs SANS `src` seulement : une balise qui charge un module est
   précisément ce qu'on encourage, et la compter serait absurde.

   ---------------------------------------------------------------------------
   ON COMPTE LA SOMME, PAS LE PLUS GROS — ET C'EST UNE CORRECTION.

   Cet outil ne regardait que `blocs[0]`, le plus gros. Or le chantier F2
   commence par COUPER le bloc en trois pour qu'une panne n'emporte plus toute
   la page. Le plus gros serait alors tombé de 4 343 à ~2 400 sans qu'une seule
   ligne soit sortie du fichier : la première étape du chantier aurait truqué le
   contrôle censé le mesurer.

   Le cliquet porte donc sur la SOMME du code de la page, qui ne peut pas être
   réduite en déplaçant une frontière. Le plus gros bloc reste affiché, parce
   qu'il dit autre chose — le rayon d'une mort silencieuse.

   ---------------------------------------------------------------------------
   ET LES NUANCEURS NE SONT PAS DU CODE DE PAGE.

   `<script id="fs" type="x-shader/x-fragment">` n'a pas de `src` non plus, et
   l'ancienne expression les attrapait — sans conséquence tant qu'on ne prenait
   que le maximum, fatale dès qu'on somme : 777 lignes de GLSL entreraient dans
   un compteur qui parle de portée globale JavaScript. On filtre donc sur le
   `type`, et un contrôle plus bas exige qu'on en ait bien écarté.

   La découpe elle-même vit dans `outils/blocs.js`, partagée avec
   `outil-verif-ordre.js` : deux expressions recopiées divergent tôt ou tard, et
   le jour où elles divergent, l'un des deux outils mesure un fichier que
   l'autre ne voit pas. */
const { decoupe } = require("./outils/blocs.js");

const { code, autres: ecartes } = decoupe(page);
const blocs = code.slice().sort((a, b) => b.lignes - a.lignes);

const somme = blocs.reduce((s, b) => s + b.lignes, 0);
const gros = blocs[0] || { lignes: 0, depart: 0 };
const totalPage = page.split("\n").length;

console.log("\n  LA TAILLE DU BLOC PRINCIPAL — CLIQUET");
console.log("  ════════════════════════════════════");

groupe("Ce qu'on mesure");
console.log("  index.html                " + String(totalPage).padStart(5) + " lignes");
console.log("  blocs de code sans src    " + String(blocs.length).padStart(5)
            + "   (" + ecartes.length + " nuanceur(s) écarté(s))");
console.log("  LA SOMME — le cliquet     " + String(somme).padStart(5) + " lignes");
console.log("  le plus gros              " + String(gros.lignes).padStart(5)
            + " lignes, à partir de la ligne " + gros.depart);
console.log("  part du fichier           " + String(Math.round(100*somme/totalPage)).padStart(5) + " %");

groupe("Le cliquet");
ok("le code de la page n'a pas grossi", somme <= PLAFOND,
   "≤ " + PLAFOND, somme,
   somme > PLAFOND
     ? "il a pris " + (somme - PLAFOND) + " lignes. Sortir un domaine, ou "
       + "expliquer ici pourquoi le plafond doit monter."
     : "marge : " + (PLAFOND - somme) + " lignes");

if(somme < PLAFOND){
  console.log("\n  ⬇  LE PLAFOND PEUT DESCENDRE : " + PLAFOND + " → " + somme);
  console.log("     Modifier `PLAFOND` dans ce fichier. C'est le seul entretien qu'il demande.");
}

const modules = fs.readdirSync(ici)
  .filter(f => f.endsWith(".js") && !/^(outil-|tout\.js)/.test(f)).length;
ok("aucun module n'est rentré dans le bloc", modules >= MODULES_SORTIS,
   "≥ " + MODULES_SORTIS + " modules", modules + " modules",
   "un domaine qui repasserait en portée globale est le contraire du chantier");

if(modules > MODULES_SORTIS){
  console.log("\n  ⬆  MODULES_SORTIS PEUT MONTER : " + MODULES_SORTIS + " → " + modules);
}

/* Et un garde-fou sur la mesure elle-même : si la découpe des blocs cesse de
   marcher, l'outil rendrait zéro et passerait au vert en ne mesurant rien. */
groupe("La mesure elle-même tient debout");
ok("on a bien trouvé des blocs de script", blocs.length > 0, "> 0", blocs.length);
ok("et le plus gros n'est pas vide", gros.lignes > 500, "> 500 lignes", gros.lignes,
   "un zéro voudrait dire que l'expression de découpe ne mord plus, pas que le "
   + "bloc a disparu — et le contrôle passerait au vert sans rien mesurer");

/* Le filtre sur le type est le seul point où l'on peut se tromper de 777 lignes
   sans s'en apercevoir : s'il cessait de mordre, les nuanceurs entreraient dans
   la somme et le plafond sauterait d'un coup — ou pire, on le monterait pour
   « faire passer », en croyant que le code a grossi. */
ok("les nuanceurs sont bien écartés du compte", ecartes.length >= 4,
   "≥ 4 blocs de nuanceur", ecartes.length,
   ecartes.length ? ecartes.map(b => b.type + " (" + b.lignes + " l)").join(" · ")
                  : "AUCUN — le filtre sur le type ne mord plus");
ok("la somme est cohérente avec le plus gros", somme >= gros.lignes,
   "≥ " + gros.lignes, somme,
   "trivial, sauf si le filtre a laissé passer un bloc dans un compte et pas dans l'autre");

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
