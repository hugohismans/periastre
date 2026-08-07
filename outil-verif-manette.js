/* ============================================================================
   LA MANETTE, ÉPROUVÉE SANS ÉCRAN

       node outil-verif-manette.js

   ---------------------------------------------------------------------------
   POURQUOI CE FICHIER EXISTE

   `manette.js` calcule ce qu'un pouce posé sur la moitié gauche de l'écran VEUT
   DIRE : dans quelle direction on marche, à quelle intensité, et si le clavier
   doit piloter ou se taire. Trois calculs qui ont vécu des mois dans le bloc
   d'`index.html` sans qu'aucun contrôle ne les touche, parce qu'ils étaient
   collés à un `getElementById`, à trois écouteurs de pointeur et à une classe
   CSS.

   LE DANGER DE CE DOMAINE N'EST PAS QU'IL PLANTE : C'EST QU'IL SE SENT. Une
   zone morte à 14 % ou à 20 %, une rampe continue ou en falaise, un anneau à 46
   ou à 60 pixels — dans tous les cas le personnage marche. La différence ne se
   VOIT pas : elle se sent, et confusément. On croit qu'on a le doigt lourd. On
   recommence. On finit par penser que la commande tactile est mauvaise.

   Et le pire de tout, celui qui a coûté une soirée : dans n'importe quel champ
   de texte du site, taper un espace ne l'écrivait pas ET lâchait quatre-vingts
   sondes. Hugo l'a trouvé en essayant d'écrire un commentaire dans la séance de
   jugement — dans l'outil même bâti pour recueillir ses commentaires. Trois
   gestionnaires de clavier, deux qui se gardaient des champs de saisie, un qui
   ne s'en gardait pas ; et aucun des deux tests ne connaissait
   `contenteditable`. C'est ce défaut-là que le neuvième sabotage rejoue.

   ---------------------------------------------------------------------------
   D'OÙ VIENT LA VÉRITÉ, ICI  (règle 3)

   Aucun contrôle ne recopie une formule du module en face d'elle-même. Sept
   sources, toutes extérieures :

   1. UN SEUIL TROUVÉ PAR BISSECTION, jamais lu. On cherche où l'axe BASCULE de
      zéro à non-zéro, puis on confronte à ce que le module annonce. Un seuil et
      une constante qui divergeraient, c'est un commentaire qui ment.

   2. LA DÉFINITION D'UNE FONCTION CONTINUE. Une rampe continue ne saute pas :
      on balaye le pouce au millième de pixel et l'on exige que l'amplitude ne
      fasse jamais un bond. C'est la définition, pas la formule — et une falaise
      au seuil, celle qu'un `g = n` naïf produirait, y laisse un bond de 0,14.

   3. LA DÉFINITION D'UNE FONCTION AFFINE : ses différences secondes sont
      nulles. C'est ce qui établit que la rampe est une RAMPE et non une courbe
      choisie parce qu'elle est jolie — la règle 4 du dépôt.

   4. UNE ALGÈBRE ÉLÉMENTAIRE : pour qu'une rampe parte de 0 au seuil et arrive
      à 1 au bord, il FAUT que sa largeur vaille `1 − seuil`. On l'exige donc au
      bit près, sans quoi les deux nombres peuvent dériver l'un sans l'autre.

   5. `atan2` SUR LE VECTEUR DU DOIGT. L'angle attendu est fabriqué à partir des
      PIXELS de la poussée, jamais à partir de ce que le module a rendu.

   6. DES SYMÉTRIES — isotropie et invariance par translation. Un manche posé au
      coin de l'écran doit répondre comme un manche posé au milieu, et une
      poussée à 45° doit valoir une poussée tout droit de même longueur. Ce sont
      des propriétés, pas des formules : elles tiennent quelle que soit la loi,
      pourvu que la loi soit la même partout.

   7. LE SOURCE LUI-MÊME, LU COMME UN TEXTE. `moyen` porte une règle — on ne
      devine pas le matériel, on observe l'usage — et cette règle s'énonce par
      une ABSENCE : ni `navigator`, ni `matchMedia`, ni `ontouchstart`. Une
      absence ne se mesure pas en appelant la fonction ; elle se lit. Le contrôle
      dépouille les commentaires et regarde le code.

   ---------------------------------------------------------------------------
   CE QUI EST ÉPINGLÉ PLUTÔT QUE CORRIGÉ

   Un comportement d'aujourd'hui est ÉPINGLÉ : le contrôle exige qu'il reste tel
   quel, non parce qu'il est bon — il ne l'est probablement pas — mais pour que
   le jour où quelqu'un le change, ce soit une décision et pas un accident.

     · au-delà de l'anneau, l'amplitude DÉCROÎT en `R_STICK / d` au lieu de
       saturer. `d` est mesuré avant le bornage et réutilisé après.

   Il ressort en fin de course sous « ⚠ », sans compter comme un échec, avec les
   chiffres qui permettent de trancher.

   ---------------------------------------------------------------------------
   ÉPROUVÉ FAILLIBLE  (règle 2)

   Le dernier groupe casse le module EN MÉMOIRE — soit en enveloppant une
   fonction, soit en remplaçant un morceau dans une copie du source — rejoue en
   silence le groupe de contrôles correspondant, et exige qu'il TOMBE. Le fichier
   sur le disque n'est jamais touché. Onze sabotages, dont les trois qui
   comptent le plus :

     · la zone morte retirée ;
     · le bornage à `R_STICK` retiré ;
     · `enSaisie` qui oublie `contentEditable` — le vrai défaut historique.

   Le fichier échoue si un sabotage passe inaperçu : un contrôle incapable de
   prouver qu'il sait tomber ne surveille rien.

   ---------------------------------------------------------------------------
   CE QU'IL NE COUVRE PAS, ET IL FAUT LE DIRE

   Le CONFORT. Que 46 pixels soient le bon rayon, que 14 % soit la bonne zone
   morte : rien ici ne peut le dire, et rien ne le prétend. Ce sont des réglages
   de pouce, posés sur un vrai téléphone, et `?juge` existe pour les recueillir.

   Ne sont pas couverts non plus : l'écoute des pointeurs, le partage de l'écran
   en deux moitiés, la priorité de la visée sur la marche, le placement du
   manche dans la page, et le passage de l'axe au pas de marche — c'est
   `arpente.js`, et `outil-verif-arpente.js` s'en charge.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const ICI = __dirname;
const CHEMIN = path.join(ICI, "manette.js");

console.log("\n  LA MANETTE — CONTRÔLE NUMÉRIQUE");
console.log("  ═══════════════════════════════");

let n = 0, echecs = 0;
/* Quand `carnet` n'est pas nul, `ok()` range au lieu d'imprimer. C'est ce qui
   permet de rejouer les mêmes contrôles sur un module saboté sans salir la
   sortie de faux échecs — et sans réécrire les assertions une seconde fois, ce
   qui reviendrait à saboter aussi le contrôle du sabotage. */
let carnet = null;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  if(carnet){ carnet.push({ nom, vrai: !!vrai }); return; }
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

/* ══════════════════════════════════════════════════ 0. le module est-il là ?

   S'il manque, on ne rend PAS un zéro échec. Un outil qui n'a rien mesuré et qui
   sort en code 0 endort exactement comme un contrôle incapable d'échouer :
   `node tout.js` afficherait un filet complet sur un trou. */
if(!fs.existsSync(CHEMIN))
  stop("manette.js n'existe pas — RIEN N'A ÉTÉ MESURÉ", [
    "Cet outil charge le module hors navigateur et refuse de conclure sans lui.",
  ]);

const SRC = fs.readFileSync(CHEMIN, "utf8");

/* Le module se referme sur un faux global. On lui tend tous les noms sous
   lesquels un module de ce dépôt peut se déclarer, plutôt que d'imposer une
   forme d'écriture — et surtout, on ne lui donne NI `document` NI `navigator` :
   s'il en lisait un au chargement, il exploserait ici, ce qui est le but. */
function charge(src, cle){
  const bac = {};
  const mod = { exports: bac };
  new Function("window", "global", "globalThis", "self", "module", "exports", src)
    (bac, bac, bac, bac, mod, bac);
  return bac[cle] || (mod.exports && mod.exports[cle]) || null;
}

let MANETTE;
try { MANETTE = charge(SRC, "MANETTE"); }
catch(err){
  stop("manette.js ne se charge pas — RIEN N'A ÉTÉ MESURÉ", [
    err.name + " : " + err.message,
    "",
    "Le module doit pouvoir s'évaluer hors navigateur : ni DOM, ni `document`,",
    "ni `navigator` au chargement. C'est ce qui le rend vérifiable sans écran.",
  ]);
}

const CONTRAT = ["R_STICK", "ZONE_MORTE", "RAMPE", "bougeStick", "enSaisie", "moyen"];
if(!MANETTE)
  stop("manette.js s'est chargé mais n'expose pas `MANETTE`", [
    "attendu   global.MANETTE = { " + CONTRAT.join(", ") + " }",
  ]);
{
  const manque = CONTRAT.filter(k => MANETTE[k] === undefined);
  if(manque.length)
    stop("manette.js n'expose pas tout son contrat", [
      "manquant  " + manque.join(", "),
      "trouvé    " + Object.keys(MANETTE).join(", "),
    ]);
}

// ── petites commodités
const ampl   = a => Math.hypot(a.x, a.y);
// l'écart entre deux angles, ramené dans (−π, π]
const ecartA = (a, b) => Math.abs(Math.atan2(Math.sin(a-b), Math.cos(a-b)));

/* Le double immédiatement inférieur, et le suivant. C'est la seule façon de
   départager un `<` d'un `<=` : il faut pouvoir se poser à un ulp du seuil, pas
   à 1e-12. */
function voisin(x, pas){
  const b = new Float64Array(1), i = new BigInt64Array(b.buffer);
  b[0] = x; i[0] += BigInt(pas); return b[0];
}
const precedent = x => voisin(x, -1), suivant = x => voisin(x, 1);

/* Un générateur pseudo-aléatoire À GRAINE. Un contrôle qui ne tombe qu'un jour
   sur trois se fait désactiver dans la semaine : les tirages doivent être les
   mêmes à chaque exécution, sur chaque machine. */
function alea(graine){
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Où le manche a été posé. Le module ne lit que des DIFFÉRENCES, donc le centre
   ne devrait rien changer — c'est justement ce qu'un contrôle vérifie. Mais pour
   tous les AUTRES, partir de l'origine rend les soustractions EXACTES :
   `300 − (300 − t)` ne rend pas `t` quand `t` vaut un centième, et l'on
   mesurerait l'annulation catastrophique de sa propre soustraction en croyant
   mesurer un seuil. */
const ORIGINE = { x: 0, y: 0 };
// une poussée de `r` pixels dans la direction `ang`, depuis le centre du manche
const pousse = (M, r, ang, centre) => M.bougeStick(
  centre || ORIGINE, (centre || ORIGINE).x + r*Math.cos(ang || 0),
                     (centre || ORIGINE).y + r*Math.sin(ang || 0));
// l'amplitude de marche demandée pour une poussée de `r` px vers la droite
const amp = (M, r) => ampl(M.bougeStick(ORIGINE, r, 0).axe);

/* ══════════════════════════ 1. LE GARDE-FOU : a-t-on mesuré quelque chose ?

   Le piège que ce groupe existe pour éviter : une fonction qui rendrait un axe
   nul partout laisserait une récolte VIDE, et tous les contrôles suivants
   deviendraient des « rien de faux n'a été vu » — c'est-à-dire du vert sur du
   néant. */
function controleGardeFou(M){
  let nuls = 0, vivants = 0;
  for(let r = 0; r <= 200; r += 0.5)
    for(let k = 0; k < 8; k++){
      const a = pousse(M, r, k*Math.PI/4).axe;
      if(ampl(a) === 0) nuls++; else vivants++;
    }
  if(vivants < 500)
    stop("`bougeStick` ne demande presque jamais de marche — JE REFUSE DE CONCLURE", [
      vivants + " poussées sur " + (vivants + nuls) + " mettent le personnage en marche.",
      "Tous les contrôles de la rampe compteraient alors une poignée de cas et",
      "passeraient au vert sans rien avoir éprouvé.",
    ]);
  ok("les deux réponses sont représentées — " + (vivants + nuls) + " poussées",
     vivants > 500 && nuls > 20, "des marches ET des refus",
     vivants + " marches, " + nuls + " refus",
     "un module qui rendrait toujours la même chose validerait tout le reste "
     + "sans rien surveiller");

  const r = M.bougeStick(ORIGINE, 30, -20);
  ok("une poussée rend un pouce à dessiner ET un axe, tous finis",
     r && Number.isFinite(r.dx) && Number.isFinite(r.dy) && r.axe
       && Number.isFinite(r.axe.x) && Number.isFinite(r.axe.y) && ampl(r.axe) > 0,
     "{ dx, dy, axe:{ x, y } }",
     r ? "dx=" + r.dx.toFixed(3) + " dy=" + r.dy.toFixed(3)
         + " axe=[" + r.axe.x.toFixed(4) + ", " + r.axe.y.toFixed(4) + "]" : "rien");

  /* Elle ne doit rien écrire dans ce qu'on lui prête. Le centre du manche est
     relu à chaque `pointermove` pendant tout le geste : un module qui le
     retoucherait ferait glisser le manche sous le doigt, lentement, et l'on
     accuserait l'écran. */
  const centre = { x: 300, y: 500 };
  const copie = JSON.stringify(centre);
  M.bougeStick(centre, 340, 470);
  ok("elle n'écrit pas dans le centre du manche qu'on lui prête",
     JSON.stringify(centre) === copie, copie, JSON.stringify(centre),
     "le centre est relu à chaque `pointermove` du geste ; une retouche ferait "
     + "glisser le manche sous le doigt sans que rien ne le dise");

  /* Et elle rend un axe NEUF à chaque appel : un objet partagé et réécrit
     ferait que la page, en gardant la référence, verrait sa valeur changer
     toute seule à la poussée suivante. C'est la maladie de `nChute`, à
     l'envers. */
  const a1 = M.bougeStick(ORIGINE, 40, 0);
  const a2 = M.bougeStick(ORIGINE, 0, 40);
  ok("chaque poussée rend un axe neuf, jamais le même objet réécrit",
     a1.axe !== a2.axe && a1.axe.x !== a2.axe.x, "deux objets distincts",
     a1.axe === a2.axe ? "le MÊME objet, réécrit" : "deux objets",
     "un objet partagé ferait changer sous les yeux de la page la valeur "
     + "qu'elle croit tenir");
}

/* ═══════════════════════════════════ 2. LA ZONE MORTE — DES DEUX CÔTÉS DU SEUIL

   Elle se juge des deux côtés, et le seuil lui-même est cherché par bissection
   — jamais lu dans le source, puis confronté à ce que le module annonce.

   Sans cette bande, un doigt simplement POSÉ fait dériver le personnage :
   personne ne pose son pouce au pixel près, et la dérive se lit comme un défaut
   du sol. C'est le cœur du domaine. */
function controleZoneMorte(M){
  /* Le seuil, cherché. `a` ne marche pas, `b` marche : on resserre jusqu'à la
     bascule. Deux cents halvings sur [0, R] descendent bien en deçà de l'ulp. */
  const bascule = fait => {
    let a = 0, b = M.R_STICK;
    for(let i = 0; i < 200; i++){ const m = (a + b)/2; if(fait(m)) b = m; else a = m; }
    return (a + b)/2;
  };
  const seuil = bascule(r => amp(M, r) > 0);
  const annonce = M.ZONE_MORTE*M.R_STICK;

  ok("la zone morte tombe à " + M.ZONE_MORTE + " du rayon, soit "
     + annonce.toFixed(2) + " px",
     Math.abs(seuil - annonce) < 1e-14, annonce.toFixed(15), seuil.toFixed(15),
     "trouvée par bissection sur la bascule immobile/marche — la valeur n'est "
     + "pas lue dans le source, elle est cherchée, puis confrontée à l'annonce");

  /* La zone morte est-elle un DISQUE ou un carré ? La question n'est pas
     rhétorique : un seuil posé sur chaque axe séparément laisserait le
     personnage dériver en diagonale et pas tout droit, ce qui se sentirait
     comme un sol en pente. */
  {
    let pire = 0, ou = "";
    for(let k = 0; k < 16; k++){
      const ang = -Math.PI + k*Math.PI/8 + 0.041;
      const s = bascule(r => ampl(pousse(M, r, ang).axe) > 0);
      if(Math.abs(s - seuil) > pire){ pire = Math.abs(s - seuil); ou = ang.toFixed(2) + " rad"; }
    }
    ok("et c'est un DISQUE : le même seuil dans seize directions", pire < 1e-12,
       "< 1e-12 px d'écart", pire.toExponential(2) + (pire > 0 ? "   (" + ou + ")" : ""),
       "un seuil posé axe par axe vaudrait √2 fois plus en diagonale, et le "
       + "personnage dériverait de biais seulement");
  }

  /* Les deux côtés, au plus près, et le seuil LUI-MÊME : `<` ou `<=` ne se
     départagent que là. */
  {
    ok("à UN ULP sous le seuil, l'axe est nul — exactement zéro",
       amp(M, precedent(annonce)) === 0, "0", amp(M, precedent(annonce)),
       "pas « petit » : nul. Une dérive à 1e-17 par image finit par traverser "
       + "la pièce, et rien à l'écran ne dirait d'où elle vient");
    ok("… et PILE sur le seuil aussi : c'est un `<`, pas un `<=`",
       amp(M, annonce) === 0, "0", amp(M, annonce),
       "l'écart entre les deux ne se verra jamais en jouant ; il se fige ici "
       + "pour que le jour où il change, ce soit une décision");
    ok("à UN ULP au-dessus, la marche démarre — non nulle",
       amp(M, suivant(annonce)) > 0, "> 0", amp(M, suivant(annonce)).toExponential(3),
       "le seuil sépare vraiment deux régimes ; sans cela on aurait pu borner "
       + "beaucoup plus haut sans que le contrôle bronche");
  }

  /* Le doigt POSÉ SANS BOUGER, exactement. C'est le cas que la zone morte
     existe pour attraper. */
  {
    let tousNuls = true;
    for(const c of [{x:0,y:0}, {x:12,y:900}, {x:-3.5,y:0.25}, {x:1e6,y:-1e6}]){
      const r = M.bougeStick(c, c.x, c.y);
      if(r.axe.x !== 0 || r.axe.y !== 0) tousNuls = false;
    }
    ok("un doigt posé sans bouger ne fait pas marcher", tousNuls, "axe nul partout",
       tousNuls ? "quatre manches, quatre axes nuls" : "un axe non nul",
       "c'est la raison d'être de la zone morte : personne ne pose son pouce au "
       + "pixel près, et une dérive permanente se lit comme un défaut du sol");
  }

  /* Le seuil ne dépend pas de l'endroit où le manche est né. Le manche est
     FLOTTANT : il naît sous le doigt, donc partout, y compris au bord de
     l'écran où les coordonnées sont grandes. */
  {
    let pire = 0, ou = "";
    for(const c of [{x:0,y:0}, {x:1,y:1}, {x:640,y:1200}, {x:-1000,y:250}, {x:1e5,y:1e5}]){
      const s = (() => { let a = 0, b = M.R_STICK;
        for(let i = 0; i < 120; i++){ const m = (a+b)/2;
          if(ampl(M.bougeStick(c, c.x + m, c.y).axe) > 0) b = m; else a = m; }
        return (a+b)/2; })();
      if(Math.abs(s - seuil) > pire){ pire = Math.abs(s - seuil); ou = "(" + c.x + ", " + c.y + ")"; }
    }
    ok("le seuil ne dépend pas de l'endroit où le manche est né", pire < 1e-9,
       "< 1e-9 px", pire.toExponential(2) + (pire > 0 ? "   " + ou : ""),
       "le manche est flottant : il naît sous le doigt, donc partout, y compris "
       + "là où les coordonnées d'écran sont grandes");
  }
}

/* ═════════════════════ 3. LA RAMPE : CONTINUE AU SEUIL, ET ÉGALE À 1 AU BORD

   Une rampe discontinue se sent au pouce comme un à-coup : le personnage part
   d'un bond au franchissement du seuil, et l'on croit qu'on a poussé trop fort.

   La vérité vient de la DÉFINITION d'une fonction continue — elle ne saute pas
   — et de celle d'une fonction affine — ses différences secondes sont nulles.
   Aucune des deux ne dit quoi que ce soit de la formule. */
function controleRampe(M){
  const seuil = M.ZONE_MORTE*M.R_STICK;

  /* L'algèbre, d'abord, et elle tient en une ligne : pour qu'une rampe parte de
     0 au seuil et arrive à 1 au bord, il FAUT que sa largeur vaille `1 − seuil`.
     Les deux constantes ne peuvent pas dériver l'une sans l'autre. */
  ok("la largeur de la rampe vaut exactement `1 − ZONE_MORTE`",
     M.ZONE_MORTE + M.RAMPE === 1, "1 au bit près",
     (M.ZONE_MORTE + M.RAMPE).toPrecision(20),
     "c'est la condition pour que la rampe arrive pile à 1 au bord de l'anneau. "
     + "Déplacer la zone morte sans déplacer la largeur rouvre la falaise");

  ok("au bord de l'anneau, l'amplitude vaut EXACTEMENT 1",
     amp(M, M.R_STICK) === 1, "1", amp(M, M.R_STICK).toPrecision(20),
     "pas 0,999 : un plein régime qu'on n'atteint jamais n'est pas un plein "
     + "régime, c'est un plafond de verre");

  /* La continuité au seuil, vue de très près. Une falaise — celle qu'un
     `g = n` naïf produirait — ferait sauter l'amplitude à 0,14 d'un coup. */
  {
    const juste = amp(M, seuil*(1 + 1e-9));
    ok("juste au-dessus du seuil, la marche est INFIME, pas franche",
       juste > 0 && juste < 1e-7, "> 0 et < 1e-7", juste.toExponential(3),
       "c'est la signature d'une rampe continue. Une falaise démarrerait à "
       + M.ZONE_MORTE + " — un pas franc au moindre frémissement du pouce");
  }

  /* La continuité PARTOUT, balayée au millième de pixel. La pente vaut
     1/(R×largeur) ≈ 0,025 par pixel, donc un pas de 0,001 px ne peut faire
     bouger l'amplitude que de 2,6e-5. Un bond plus gros est une falaise. */
  {
    let saut = 0, ou = 0, mini = Infinity, maxi = -Infinity;
    let a = amp(M, 0);
    for(let i = 1; i <= 400000; i++){
      const b = amp(M, i*0.001);
      const e = Math.abs(b - a);
      if(e > saut){ saut = e; ou = i*0.001; }
      mini = Math.min(mini, b); maxi = Math.max(maxi, b);
      a = b;
    }
    ok("400 000 pas de un millième de pixel : l'amplitude ne saute jamais",
       saut < 1e-4, "< 1e-4 par millième de pixel",
       saut.toExponential(3) + " à " + ou.toFixed(3) + " px",
       "la définition d'une fonction continue, pas la formule du module — et "
       + "une falaise au seuil y laisserait un bond de " + M.ZONE_MORTE);
    ok("… et le balayage a bien vu toute l'étendue de la rampe",
       mini === 0 && maxi === 1, "de 0 à 1", mini + " à " + maxi,
       "sans cela le contrôle précédent serait vert sur une fonction constante, "
       + "qui est parfaitement continue et parfaitement inutile");
  }

  /* AFFINE : les différences secondes sont nulles. C'est ce qui établit que la
     rampe est une RAMPE, et non une courbe choisie parce qu'elle est jolie —
     règle 4 du dépôt. */
  {
    let pire = 0, ou = 0;
    const h = 0.37;
    for(let r = seuil + h; r + h <= M.R_STICK; r += h){
      const e = Math.abs(amp(M, r + h) - 2*amp(M, r) + amp(M, r - h));
      if(e > pire){ pire = e; ou = r; }
    }
    ok("entre le seuil et le bord, la rampe est AFFINE", pire < 1e-13,
       "différences secondes nulles",
       pire.toExponential(2) + (pire > 0 ? " à " + ou.toFixed(2) + " px" : ""),
       "une courbe en S, ou un carré, marcheraient aussi bien à l'écran — et "
       + "seraient une loi inventée de plus dans une simulation");

    // et elle MONTE : une rampe affine décroissante passerait le test ci-dessus
    let monte = true;
    for(let r = seuil; r + 0.5 <= M.R_STICK; r += 0.5)
      if(amp(M, r + 0.5) <= amp(M, r)) monte = false;
    ok("… et elle monte, strictement", monte, "croissante sur toute la bande",
       monte ? "croissante" : "un palier ou une descente",
       "pousser plus fort doit marcher plus vite ; l'affinité seule "
       + "n'interdirait pas l'inverse");
  }
}

/* ══════════════════════════════════ 4. L'AMPLITUDE NE DÉPASSE JAMAIS 1

   `arpente.js` compose l'axe avec les touches du clavier et serre le résultat ;
   une amplitude de 7 ne ferait pas courir sept fois plus vite, elle écraserait
   simplement toute nuance — on marcherait à fond ou pas du tout, et la fosse
   deviendrait infranchissable au doigt.

   C'est le contrôle que le bornage à `R_STICK` existe pour tenir. */
function controleAmplitude(M){
  let pire = 0, ou = "", touche = 0, cas = 0;
  const tire = alea(20260808);
  for(const r of [0, 1, 6, 20, 45.99, 46, 46.01, 60, 100, 300, 1000, 12000])
    for(let k = 0; k < 12; k++){
      const ang = -Math.PI + k*Math.PI/6 + 0.017;
      const a = pousse(M, r, ang).axe;
      cas++;
      if(ampl(a) > pire){ pire = ampl(a); ou = r + " px, " + ang.toFixed(2) + " rad"; }
      if(ampl(a) === 1) touche++;
    }
  for(let k = 0; k < 3000; k++){
    const a = pousse(M, Math.pow(10, tire()*5 - 1), (tire()*2-1)*Math.PI).axe;
    cas++;
    if(ampl(a) > pire){ pire = ampl(a); ou = "tirage " + k; }
  }
  ok("l'amplitude ne dépasse jamais 1 — " + cas + " poussées", pire <= 1,
     "≤ 1", pire.toPrecision(17) + (pire > 1 ? "   (" + ou + ")" : ""),
     "jusqu'à cent mètres de pouce imaginaire. C'est le bornage à R_STICK qui "
     + "tient ce contrôle, et rien d'autre");
  ok("… et le plein régime est ATTEINT, pas seulement respecté", touche > 0 && pire === 1,
     "1 exactement", touche + " poussées à plein régime",
     "un plafond qu'aucune poussée n'atteint n'est pas un garde-fou, c'est un "
     + "commentaire");

  /* Le pouce DESSINÉ ne sort jamais de l'anneau non plus. C'est la même borne,
     vue par l'image : si les deux divergeaient, le disque sortirait du cercle
     ou s'arrêterait avant, et l'un des deux mentirait sur l'autre. */
  {
    let pireD = 0, ouD = "", colle = 0;
    for(const r of [0, 5, 30, 46, 47, 90, 500, 9000])
      for(let k = 0; k < 12; k++){
        const p = pousse(M, r, k*Math.PI/6 + 0.11);
        const d = Math.hypot(p.dx, p.dy);
        if(d - M.R_STICK > pireD){ pireD = d - M.R_STICK; ouD = r + " px"; }
        if(r > M.R_STICK && Math.abs(d - M.R_STICK) < 1e-12) colle++;
      }
    ok("le pouce dessiné ne sort jamais de l'anneau", pireD <= 1e-12,
       "≤ " + M.R_STICK + " px", (M.R_STICK + pireD).toFixed(12)
       + (pireD > 1e-12 ? "   (" + ouD + ")" : ""));
    ok("… et il s'y colle dès qu'on pousse plus loin", colle === 4*12,
       48 + " poussées collées", colle + " collées",
       "sinon le disque flotterait à l'intérieur du cercle et le manche "
       + "paraîtrait mou");
  }
}

/* ═════════════════════════════════════════ 5. LA DIRECTION EST CELLE DU DOIGT

   La vérité vient d'`atan2` sur les PIXELS de la poussée, jamais de la formule
   du module. Un axe qui partirait de travers ferait marcher le personnage à
   côté de là où le pouce pousse — et comme le disque dessiné, lui, suit le
   doigt, on accuserait le sol ou la caméra. */
function controleDirection(M){
  // ── les quatre cas purs, d'abord, parce qu'ils se lisent
  {
    const droite = M.bougeStick(ORIGINE, 30, 0).axe;
    const gauche = M.bougeStick(ORIGINE, -30, 0).axe;
    const bas    = M.bougeStick(ORIGINE, 0, 30).axe;
    const haut   = M.bougeStick(ORIGINE, 0, -30).axe;
    ok("pousser à droite donne un axe purement vers la droite",
       droite.x > 0 && droite.y === 0, "x > 0, y = 0",
       "[" + droite.x.toFixed(6) + ", " + droite.y + "]");
    ok("pousser vers le bas de l'écran donne un axe purement vers le bas",
       bas.y > 0 && bas.x === 0, "x = 0, y > 0",
       "[" + bas.x + ", " + bas.y.toFixed(6) + "]",
       "l'écran compte ses y vers le bas ; c'est `arpente.js` qui retourne ce "
       + "signe pour avancer, et le signe se décide ici une fois pour toutes");
    ok("et les opposés sont exactement opposés",
       gauche.x === -droite.x && gauche.y === -droite.y
         && haut.y === -bas.y && haut.x === -bas.x,
       "symétrie exacte", "[" + gauche.x.toFixed(6) + ", " + haut.y.toFixed(6) + "]",
       "un signe perdu d'un seul côté ferait marcher à reculons dans une "
       + "direction sur deux");
  }

  // ── l'angle, sur tout le tour, dedans et dehors de l'anneau
  {
    let pire = 0, ou = "", cas = 0;
    for(const r of [7, 12, 25, 45, 46, 50, 130, 300, 4000])
      for(let k = 0; k < 36; k++){
        const ang = -Math.PI + k*Math.PI/18 + 0.0231;
        const p = pousse(M, r, ang);
        // l'attendu vient des PIXELS de la poussée, pas du module
        const attendu = Math.atan2(r*Math.sin(ang), r*Math.cos(ang));
        const e = ecartA(Math.atan2(p.axe.y, p.axe.x), attendu);
        cas++;
        if(e > pire){ pire = e; ou = r + " px, " + ang.toFixed(3) + " rad"; }
      }
    ok("l'angle de l'axe est celui du doigt — " + cas + " poussées", pire < 1e-14,
       "< 1e-14 rad", pire.toExponential(2) + "   (" + ou + ")",
       "l'attendu sort de `atan2` sur les pixels ; neuf rayons, dont quatre "
       + "au-delà de l'anneau, où le bornage aurait pu tordre la direction");
  }

  // ── le pouce dessiné et l'axe pointent au même endroit
  {
    let pire = 0;
    for(const r of [8, 30, 46, 200, 2500])
      for(let k = 0; k < 12; k++){
        const p = pousse(M, r, k*Math.PI/6 + 0.29);
        pire = Math.max(pire, ecartA(Math.atan2(p.axe.y, p.axe.x),
                                     Math.atan2(p.dy, p.dx)));
      }
    ok("le pouce dessiné et l'axe pointent dans la même direction", pire < 1e-15,
       "< 1e-15 rad", pire.toExponential(2),
       "deux façons de dire la même chose : l'image et l'effet. Qu'elles "
       + "divergent est la maladie que ce dépôt traque");
  }

  // ── l'isotropie : à rayon égal, même amplitude quelle que soit la direction
  {
    let pire = 0, ou = "";
    for(const r of [7, 15, 33, 46, 80, 900]){
      const ref = ampl(pousse(M, r, 0).axe);
      for(let k = 1; k < 24; k++){
        const e = Math.abs(ampl(pousse(M, r, k*Math.PI/12 + 0.05).axe) - ref);
        if(e > pire){ pire = e; ou = r + " px"; }
      }
    }
    ok("à rayon égal, la marche est aussi rapide dans toutes les directions",
       pire < 1e-15, "< 1e-15", pire.toExponential(2) + (pire > 0 ? "   (" + ou + ")" : ""),
       "sinon marcher en diagonale serait plus rapide que marcher tout droit, "
       + "et l'on ferait le tour de la pièce de biais sans savoir pourquoi");
  }

  // ── l'invariance par translation : le manche est flottant
  {
    let pire = 0, ou = "";
    const tire = alea(4614);
    for(let k = 0; k < 400; k++){
      const dx = (tire()*2-1)*200, dy = (tire()*2-1)*200;
      const ref = M.bougeStick(ORIGINE, dx, dy);
      const c = { x: (tire()*2-1)*1500, y: (tire()*2-1)*1500 };
      const g = M.bougeStick(c, c.x + dx, c.y + dy);
      const e = Math.max(Math.abs(g.axe.x - ref.axe.x), Math.abs(g.axe.y - ref.axe.y),
                         Math.abs(g.dx - ref.dx), Math.abs(g.dy - ref.dy));
      if(e > pire){ pire = e; ou = "(" + c.x.toFixed(0) + ", " + c.y.toFixed(0) + ")"; }
    }
    ok("le manche répond pareil où qu'il soit né — 400 tirages", pire < 1e-12,
       "< 1e-12", pire.toExponential(2) + (pire > 0 ? "   " + ou : ""),
       "il naît sous le doigt : au milieu de l'écran comme dans un coin, et la "
       + "marche ne doit pas dépendre de l'endroit du contact");
  }
}

/* ══════════════════════════ 6. LE DOIGT PILE AU CENTRE — LA DIVISION PAR ZÉRO

   C'est le cas dégénéré évident, et il est atteignable à chaque geste : au
   `pointerdown`, le manche naît EXACTEMENT sous le doigt, donc la première
   image du geste a toujours un écart nul. Sans le garde, l'axe vaudrait 0/0 —
   et un NaN dans la vitesse contamine la position, puis la caméra, et la pièce
   disparaît d'un coup, sans message. */
function controleCentre(M){
  let pire = "", bon = true, cas = 0;
  for(const c of [{x:0,y:0}, {x:-7,y:3}, {x:512.5,y:284.25}, {x:1e7,y:-1e7},
                  {x:0.1,y:0.2}]){
    const r = M.bougeStick(c, c.x, c.y);
    cas++;
    const sain = r.axe.x === 0 && r.axe.y === 0 && r.dx === 0 && r.dy === 0;
    if(!sain){ bon = false; pire = "(" + c.x + ", " + c.y + ") → ["
      + r.axe.x + ", " + r.axe.y + "]"; }
  }
  ok("un doigt PILE au centre ne rend pas de NaN — " + cas + " manches", bon,
     "axe [0, 0] et pouce [0, 0]", bon ? "zéros exacts partout" : pire,
     "c'est la première image de CHAQUE geste : au `pointerdown`, le manche "
     + "naît exactement sous le doigt");

  // et tout autour, à des distances absurdement petites
  {
    let bon2 = true, ou = 0;
    for(const e of [1e-300, 1e-30, 1e-12, 1e-6, 1e-4, 1e-3]){
      const r = M.bougeStick(ORIGINE, e, -e);
      if(!Number.isFinite(r.axe.x) || !Number.isFinite(r.axe.y)
         || r.axe.x !== 0 || r.axe.y !== 0){ bon2 = false; ou = e; }
    }
    ok("… et à un millionième de pixel non plus", bon2, "axe nul et fini",
       bon2 ? "six distances, six axes nuls" : "à " + ou + " px",
       "la zone morte couvre tout ce voisinage ; le garde `Math.max(d, 1e-3)` "
       + "n'y sert donc jamais — voir le constat en fin de course");
  }

  // aucune poussée, où que ce soit, ne doit rendre de NaN
  {
    let sales = 0;
    const tire = alea(999331);
    for(let k = 0; k < 5000; k++){
      const c = { x: (tire()*2-1)*4000, y: (tire()*2-1)*4000 };
      const r = M.bougeStick(c, c.x + (tire()*2-1)*Math.pow(10, tire()*6-3),
                                c.y + (tire()*2-1)*Math.pow(10, tire()*6-3));
      if(!Number.isFinite(r.axe.x) || !Number.isFinite(r.axe.y)
         || !Number.isFinite(r.dx) || !Number.isFinite(r.dy)) sales++;
    }
    ok("5 000 poussées tirées à graine : aucun NaN, aucun infini", sales === 0,
       "0 sortie sale", sales + " sorties sales");
  }
}

/* ══════════════════════════════ 7. ÉCRIT-ON ? LE DÉFAUT QUI A COÛTÉ UNE SOIRÉE

   Dans n'importe quel champ de texte du site, taper un espace ne l'écrivait pas
   ET lâchait quatre-vingts sondes. Hugo l'a trouvé dans la séance de jugement,
   c'est-à-dire dans l'outil bâti pour recueillir ses commentaires.

   La vérité vient d'ici : une liste de faux nœuds écrite à la main, dont on sait
   ce qu'ils sont sans ouvrir le module. `contentEditable` y figure en toutes
   lettres — c'est le cas que les deux anciens tests laissaient passer. */
function controleSaisie(M){
  const OUI = [
    ["input",                 { tagName: "INPUT" }],
    ["input en minuscules",   { tagName: "input" }],
    ["input en casse mêlée",  { tagName: "InPuT" }],
    ["textarea",              { tagName: "TEXTAREA" }],
    ["select",                { tagName: "SELECT" }],
    ["un div contenteditable",{ tagName: "DIV", isContentEditable: true }],
    ["un p contenteditable",  { tagName: "P",   isContentEditable: true }],
    ["un span contenteditable", { tagName: "SPAN", isContentEditable: true }],
  ];
  const NON = [
    ["un div",       { tagName: "DIV" }],
    ["le canevas",   { tagName: "CANVAS" }],
    ["un bouton",    { tagName: "BUTTON" }],
    ["le corps",     { tagName: "BODY", isContentEditable: false }],
    ["un span",      { tagName: "SPAN" }],
    ["une étiquette",{ tagName: "LABEL" }],
  ];

  {
    const ratés = OUI.filter(([, c]) => M.enSaisie(c) !== true).map(([q]) => q);
    ok("les huit nœuds où l'on écrit sont reconnus", ratés.length === 0,
       "les huit", ratés.length ? "manqués : " + ratés.join(", ") : "les huit",
       "trois d'entre eux sont `contenteditable` : ni `input` ni `textarea`, et "
       + "invisibles aux deux anciens tests");
    const faux = NON.filter(([, c]) => M.enSaisie(c) !== false).map(([q]) => q);
    ok("les six nœuds ordinaires ne le sont pas", faux.length === 0,
       "aucun", faux.length ? "pris pour des champs : " + faux.join(", ") : "aucun",
       "un canevas classé « saisie » couperait tout le clavier du jeu");
  }

  /* LE MOTIF EST-IL ANCRÉ ? Sans `^…$`, un élément personnalisé passerait pour
     un champ de saisie et le clavier du jeu se tairait devant lui. */
  {
    const PIEGES = ["MON-INPUT", "INPUTS", "XSELECT", "SELECTION", "TEXTAREAS",
                    "INPUT-GROUP", "MY-TEXTAREA"];
    const pris = PIEGES.filter(t => M.enSaisie({ tagName: t }) !== false);
    ok("le motif est ANCRÉ : sept noms qui contiennent « input » sont refusés",
       pris.length === 0, "aucun pris", pris.length ? pris.join(", ") : "aucun",
       "un motif sans `^…$` classerait `<mon-input>` en champ de saisie, et le "
       + "clavier du jeu se tairait devant lui sans que rien ne l'explique");
  }

  /* ELLE NE LÈVE JAMAIS. Un gestionnaire de clavier qui explose sur une cible
     inattendue emporte la touche avec lui, et l'on croit que la touche n'est
     pas branchée. */
  {
    const BIZARRES = [null, undefined, 0, "", {}, { tagName: null },
                      { tagName: 123 }, { tagName: {} }, { isContentEditable: true },
                      Object.create(null)];
    let leve = "", rendus = [];
    for(const c of BIZARRES){
      try { rendus.push(M.enSaisie(c)); }
      catch(err){ leve = JSON.stringify(c) + " → " + err.message; break; }
    }
    ok("elle ne lève sur aucune cible bancale — dix formes", leve === "",
       "aucune exception", leve || "aucune exception",
       "une exception dans un gestionnaire de clavier emporte la touche, et "
       + "l'on croit que la touche n'est pas branchée");
    ok("… et rend toujours un booléen franc",
       leve === "" && rendus.every(r => r === true || r === false),
       "true ou false", leve === "" ? rendus.join(", ") : "non mesuré",
       "`undefined` marcherait aux points d'appel d'aujourd'hui et cesserait de "
       + "marcher au premier `=== false`");
    ok("une cible sans `tagName` mais contenteditable est bien une saisie",
       M.enSaisie({ isContentEditable: true }) === true, "true",
       M.enSaisie({ isContentEditable: true }));
  }

  /* Deux appels de suite sur le même nœud doivent dire la même chose. Un motif
     portant le drapeau `g` garde un `lastIndex` entre deux appels et répondrait
     vrai, puis faux, une fois sur deux. */
  {
    const c = { tagName: "INPUT" };
    let stable = true;
    for(let k = 0; k < 10; k++) if(M.enSaisie(c) !== true) stable = false;
    ok("dix appels de suite sur le même champ disent la même chose", stable,
       "true dix fois", stable ? "true dix fois" : "la réponse alterne",
       "un motif portant le drapeau `g` garde son `lastIndex` et répondrait une "
       + "fois sur deux — un défaut qui n'apparaît qu'à l'usage");
  }
}

/* ══════════════════════════════════════ 8. LE MOYEN — LE DERNIER USAGE GAGNE

   On ne devine pas le matériel, on observe l'usage. Tester la CAPACITÉ tactile
   est faux : beaucoup d'écrans de portable en ont une tout en étant pilotés à la
   souris, et la manette venait alors encombrer l'image de quelqu'un qui a un
   clavier sous les doigts.

   La vérité ici est une propriété d'ORDRE, pas une formule : quel que soit le
   passé, le dernier usage décide. */
function controleMoyen(M){
  {
    ok("un contact au doigt allume la manette, quel que soit l'état",
       M.moyen(false, "touch") === true && M.moyen(true, "touch") === true,
       "true dans les deux cas",
       M.moyen(false, "touch") + " / " + M.moyen(true, "touch"));
    ok("un clic de souris l'éteint, quel que soit l'état",
       M.moyen(true, "mouse") === false && M.moyen(false, "mouse") === false,
       "false dans les deux cas",
       M.moyen(true, "mouse") + " / " + M.moyen(false, "mouse"));
    ok("une touche de déplacement l'éteint aussi",
       M.moyen(true, "clavier") === false, "false", M.moyen(true, "clavier"),
       "une touche de déplacement prouve un clavier : la manette n'a plus lieu "
       + "d'être, et elle mange un quart de l'image");
  }

  /* LE DERNIER USAGE GAGNE, DANS LES DEUX SENS. C'est le cas de l'appareil
     hybride, où l'on passe du doigt à la souris au cours de la même session. */
  {
    const suite = usages => usages.reduce((e, u) => M.moyen(e, u), false);
    ok("souris après doigt : la manette s'efface",
       suite(["touch", "touch", "mouse"]) === false, "false",
       suite(["touch", "touch", "mouse"]));
    ok("doigt après souris : elle revient",
       suite(["mouse", "clavier", "touch"]) === true, "true",
       suite(["mouse", "clavier", "touch"]));
    let bon = true;
    for(let k = 0; k < 200; k++){
      const u = k % 2 ? "touch" : (k % 4 === 0 ? "mouse" : "clavier");
      const avant = k % 3 === 0;
      if(M.moyen(avant, u) !== (u === "touch")) bon = false;
    }
    ok("200 alternances : l'état d'avant ne pèse jamais sur la décision", bon,
       "seul le dernier usage compte", bon ? "toujours" : "l'état d'avant a pesé",
       "c'est une propriété d'ordre, pas une formule : elle tient quelle que "
       + "soit la loi, pourvu que la loi ne regarde que le dernier usage");
  }

  /* UN USAGE INCONNU NE CHANGE RIEN. C'est le comportement d'aujourd'hui —
     l'ancien gestionnaire ne traitait que `touch` et `mouse` — et il vaut mieux
     que l'alternative : un stylet ne doit pas faire disparaître la manette de
     quelqu'un qui marche au pouce et annote au stylet. */
  {
    let bon = true;
    for(const u of ["pen", "", undefined, null, "TOUCH", "souris", 0, {}])
      if(M.moyen(true, u) !== true || M.moyen(false, u) !== false) bon = false;
    ok("un usage inconnu — le stylet — laisse l'état INCHANGÉ", bon,
       "l'état d'avant, dans les deux sens",
       bon ? "huit usages inconnus, huit états conservés" : "un usage a décidé",
       "et la casse compte : « TOUCH » n'est pas un usage connu, donc il ne "
       + "décide de rien plutôt que d'allumer par erreur");
  }

  // ── elle reçoit et rend : aucun état caché
  {
    const a = M.moyen(false, "touch");
    M.moyen(true, "mouse"); M.moyen(false, "clavier"); M.moyen(true, "pen");
    const b = M.moyen(false, "touch");
    ok("deux appels identiques rendent la même chose, quoi qu'il se passe entre",
       a === b && a === true, "true les deux fois", a + " puis " + b,
       "un état retenu dans le module ferait diverger le second appel — c'est "
       + "la leçon de `nChute`, et elle se contrôle en une ligne");
  }
}

/* ═══════════════ 9. LE MODULE NE DEVINE PAS LE MATÉRIEL — LU DANS LE SOURCE

   Cette règle-là s'énonce par une ABSENCE, et une absence ne se mesure pas en
   appelant la fonction : il n'existe aucune entrée qui prouve qu'un module
   n'interroge PAS `navigator.maxTouchPoints`. Elle se lit.

   On dépouille donc les commentaires — qui parlent abondamment de tout ce qui
   est interdit, c'est même leur rôle — et l'on regarde le code qui reste. */
function codeSeul(src){
  return src.replace(/\/\*[\s\S]*?\*\//g, " ")     // les blocs
            .replace(/(^|[^:\\])\/\/[^\n]*/g, "$1"); // les fins de ligne
}
function controleSource(M){
  const code = codeSeul(SRC);
  // le dépouillement a-t-il seulement marché ?
  if(!/function\s+bougeStick/.test(code) || code.length > SRC.length*0.6)
    stop("le dépouillement des commentaires a échoué — JE REFUSE DE CONCLURE", [
      "Le contrôle du source lirait alors les commentaires, qui citent tout ce",
      "qui est interdit, et tomberait à tort — ou pire, passerait à tort.",
      "code retenu : " + code.length + " caractères sur " + SRC.length,
    ]);

  const INTERDITS = ["document", "navigator", "matchMedia", "ontouchstart",
                     "maxTouchPoints", "getElementById", "querySelector",
                     "classList", "addEventListener", "innerWidth", "innerHeight",
                     "localStorage", "getComputedStyle", "requestAnimationFrame"];
  const vus = INTERDITS.filter(m => code.includes(m));
  ok("le code ne touche ni au document ni au matériel — " + INTERDITS.length
     + " noms cherchés", vus.length === 0, "aucun", vus.length ? vus.join(", ") : "aucun",
     "c'est la règle du domaine, et elle s'énonce par une absence : on ne "
     + "devine pas le matériel, on observe l'usage. La tentation de « détecter "
     + "le tactile » revient à chaque relecture");

  const fois = (code.match(/window/g) || []).length;
  ok("`window` n'apparaît qu'une fois, pour se déclarer", fois === 1,
     "1 occurrence", fois + " occurrence" + (fois > 1 ? "s" : ""),
     "l'idiome de déclaration du dépôt — `})(window)` — et rien d'autre : tout "
     + "le reste arrive par argument");

  /* Et la preuve par les faits : le module vient d'être chargé sans `document`
     ni `navigator` dans sa portée. S'il en lisait un au chargement, cet outil
     se serait arrêté bien avant d'imprimer cette ligne. */
  ok("… et il s'évalue pour de bon sans navigateur", typeof M.bougeStick === "function",
     "chargé et fonctionnel", "chargé",
     "l'outil l'a évalué dans une portée où ni `document` ni `navigator` "
     + "n'existent : c'est la preuve par les faits, pas par le texte");
}

/* ══════════════════════ 10. CE QUI EST ÉPINGLÉ — LA DÉCROISSANCE AU-DELÀ DU BORD

   `d` est mesuré AVANT le bornage et réutilisé APRÈS pour normaliser.
   Conséquence : au-delà de l'anneau, l'amplitude décroît en `R_STICK / d` au
   lieu de saturer. Le pouce à 46 px marche à 100 % ; à 100 px, à 46 %.

   CE GROUPE NE JUGE PAS, IL ÉPINGLE. Le comportement d'aujourd'hui est écrit
   noir sur blanc pour que le jour où quelqu'un le change, ce soit une décision.
   Le constat ressort sous « ⚠ » en fin de course. */
function controlePin(M){
  const R = M.R_STICK;
  ok("au-delà de l'anneau, l'amplitude DÉCROÎT au lieu de saturer — épinglé",
     amp(M, 2*R) < amp(M, R)*0.6 && amp(M, 10*R) < amp(M, 2*R),
     "elle diminue quand on pousse plus loin",
     "à " + R + " px : " + amp(M, R).toFixed(3) + " — à " + (2*R) + " px : "
     + amp(M, 2*R).toFixed(3) + " — à " + (10*R) + " px : " + amp(M, 10*R).toFixed(3),
     "épinglé, non corrigé : `d` est mesuré avant le bornage et réutilisé "
     + "après. Voir le constat en fin de course");

  let pire = 0, ou = 0;
  for(const r of [47, 60, 100, 200, 300, 1000, 5000]){
    const e = Math.abs(amp(M, r) - R/r);
    if(e > pire){ pire = e; ou = r; }
  }
  ok("… et elle vaut exactement `R_STICK / d`", pire < 1e-15, "< 1e-15",
     pire.toExponential(2) + (pire > 0 ? " à " + ou + " px" : ""),
     "la loi de la décroissance est écrite ici, pas seulement constatée : si "
     + "quelqu'un la corrige en saturation, ce contrôle le dira");

  ok("… donc le plein régime n'est atteint qu'en UN SEUL point : le bord exact",
     amp(M, R) === 1 && amp(M, precedent(R)) < 1 && amp(M, suivant(R)) < 1,
     "1 au bord, moins d'un ulp de part et d'autre",
     "1 − " + (1 - amp(M, precedent(R))).toExponential(2) + "  /  " + amp(M, R)
     + "  /  1 − " + (1 - amp(M, suivant(R))).toExponential(2),
     "marcher à plein régime demande de tenir le pouce à 46 px du départ, au "
     + "pixel près. En pratique on marche donc presque toujours en dessous");
}

// ══════════════════════════════════════════════════════ on joue tout, en clair
groupe("Le garde-fou : la mesure a bien eu lieu");
controleGardeFou(MANETTE);
groupe("La zone morte — des deux côtés du seuil");
controleZoneMorte(MANETTE);
groupe("La rampe : continue au seuil, égale à 1 au bord");
controleRampe(MANETTE);
groupe("L'amplitude ne dépasse jamais 1");
controleAmplitude(MANETTE);
groupe("La direction est celle du doigt");
controleDirection(MANETTE);
groupe("Le doigt pile au centre — la division par zéro");
controleCentre(MANETTE);
groupe("Écrit-on ? Le défaut qui a coûté une soirée");
controleSaisie(MANETTE);
groupe("Le moyen de commande — le dernier usage gagne");
controleMoyen(MANETTE);
groupe("Le module ne devine pas le matériel — lu dans le source");
controleSource(MANETTE);
groupe("Ce qui est épinglé — la décroissance au-delà du bord");
controlePin(MANETTE);

/* ═══════════════════════════════ 11. LE CONTRÔLE SAIT-IL ÉCHOUER ?  (règle 2)

   On casse le module EN MÉMOIRE — soit en enveloppant une fonction, soit en
   remplaçant un morceau dans une copie du source —, on rejoue EN SILENCE le
   groupe qui la surveille, et l'on exige qu'il tombe. Aucun fichier n'est touché
   sur le disque.

   Les sabotages sont écrits comme des ENVELOPPES autour de la vraie fonction
   partout où c'est possible : une copie réécrite à la main apprendrait par cœur
   ce que le module fait, y compris ses fautes, et l'on ne saurait plus si le
   contrôle mord ou si les deux copies divergent. Ceux qui touchent au cœur du
   calcul font exception et passent par le source, faute de pouvoir défaire
   après coup ce qui a été fait au milieu.                                     */
groupe("Le contrôle sait échouer — on casse le module pour le prouver");

function essaie(nom, M, controles, note){
  carnet = [];
  try { for(const f of controles) f(M); }
  catch(err){ carnet.push({ nom: "exception : " + err.message, vrai: false }); }
  const lot = carnet; carnet = null;
  const tombes = lot.filter(c => !c.vrai);
  ok(nom, tombes.length > 0, "au moins un contrôle tombe",
     tombes.length + " tombés sur " + lot.length,
     tombes.length ? "→ " + tombes.slice(0, 2).map(c => c.nom).join(" ; ")
                   : "AUCUN — le groupe visé ne surveille donc rien"
                     + (note ? ". " + note : ""));
}
const copie = sup => Object.assign({}, MANETTE, sup);
const vraiBouge = MANETTE.bougeStick;

/* Un sabotage par le source : on remplace un morceau dans une COPIE EN MÉMOIRE
   et l'on recharge le module entier. Si le motif a disparu, on ne se tait pas —
   un sabotage muet est un contrôle qui a cessé de contrôler sans le dire. */
function parLeSource(nom, motif, remplacement, controles){
  if(!motif.test(SRC)){
    ok("le morceau à saboter se retrouve dans le source — " + nom, false,
       "le motif " + motif, "introuvable",
       "sans lui, ce fichier ne peut plus prouver que le contrôle mord. Si le "
       + "code a changé de forme, ce sabotage doit être RÉÉCRIT, pas supprimé");
    return;
  }
  let mutant = null;
  try { mutant = charge(SRC.replace(motif, remplacement), "MANETTE"); }
  catch(err){ /* dit juste en dessous */ }
  if(!mutant || typeof mutant.bougeStick !== "function"){
    ok("le module saboté se charge encore — " + nom, false, "un module mutant",
       "il ne se charge plus — sabotage inexploitable");
    return;
  }
  essaie(nom, mutant, controles);
}

/* ── 1. LA ZONE MORTE RETIRÉE. C'est le défaut que la bande existe pour
   empêcher : un doigt simplement posé fait dériver le personnage, lentement, et
   la dérive se lit comme un sol en pente. */
parLeSource("une manette sans zone morte",
            /n < ZONE_MORTE \? 0 : \(n - ZONE_MORTE\)\/RAMPE/,
            "n", [controleZoneMorte]);

/* ── 2. LE BORNAGE À `R_STICK` RETIRÉ. Le pouce dessiné s'échappe de l'anneau et
   l'amplitude part à sept, puis à soixante-dix : on ne marche plus qu'à fond. */
parLeSource("une manette sans bornage à R_STICK", /if\(d > R_STICK\)\{/,
            "if(false){", [controleAmplitude]);

/* ── 3. LA FALAISE AU SEUIL. La zone morte reste, mais la rampe ne repart pas de
   zéro : au franchissement du seuil, le personnage part d'un bond à 14 % de sa
   vitesse. Ça ne se voit pas, ça se sent — et l'on croit avoir poussé trop fort. */
parLeSource("une rampe en falaise, qui ne repart pas de zéro",
            /n < ZONE_MORTE \? 0 : \(n - ZONE_MORTE\)\/RAMPE/,
            "n < ZONE_MORTE ? 0 : n", [controleRampe]);

/* ── 4. LA LARGEUR DE RAMPE DÉSACCORDÉE DE LA ZONE MORTE. Les deux nombres
   dérivent l'un sans l'autre — exactement ce qui arrive quand on ajuste la zone
   morte à l'œil et qu'on oublie l'autre ligne. */
parLeSource("une largeur de rampe désaccordée de la zone morte",
            /const RAMPE = 0\.86;/, "const RAMPE = 0.7;", [controleRampe]);

/* ── 5. LE GARDE DU CENTRE RETIRÉ — la division par zéro rendue à elle-même.
   Un NaN dans la vitesse contamine la position, puis la caméra, et la pièce
   disparaît d'un coup sans message. */
essaie("un doigt au centre qui rend des NaN",
       copie({ bougeStick: (p, x, y) => {
                 const r = vraiBouge(p, x, y);
                 return Math.hypot(x - p.x, y - p.y) === 0
                        ? { dx: 0, dy: 0, axe: { x: NaN, y: NaN } } : r;
               } }),
       [controleCentre]);

/* ── 6. LES DEUX AXES ÉCHANGÉS. On pousse vers la droite et l'on marche vers le
   bas. Comme le disque dessiné, lui, suit bien le doigt, on accuse la caméra. */
essaie("un axe dont x et y sont échangés",
       copie({ bougeStick: (p, x, y) => {
                 const r = vraiBouge(p, x, y);
                 return { dx: r.dx, dy: r.dy, axe: { x: r.axe.y, y: r.axe.x } };
               } }),
       [controleDirection]);

/* ── 7. L'AMPLITUDE QUI SATURE AU LIEU DE DÉCROÎTRE. Celui-là est la CORRECTION
   probable, pas une faute — et c'est justement pour cela qu'il est ici : il
   prouve que l'épinglage est armé, et qu'il parlera le jour où quelqu'un
   décidera de traiter la décroissance. */
essaie("une amplitude qui sature au bord au lieu de décroître",
       copie({ bougeStick: (p, x, y) => {
                 const r = vraiBouge(p, x, y);
                 const d = Math.hypot(x - p.x, y - p.y);
                 const k = d > MANETTE.R_STICK ? d/MANETTE.R_STICK : 1;
                 return { dx: r.dx, dy: r.dy, axe: { x: r.axe.x*k, y: r.axe.y*k } };
               } }),
       [controlePin]);

/* ── 8. `enSaisie` QUI OUBLIE `contentEditable`. LE VRAI DÉFAUT HISTORIQUE :
   c'est exactement ce que faisaient les deux anciens tests, et c'est pour cela
   qu'un espace tapé dans la séance de jugement lâchait quatre-vingts sondes. */
essaie("une saisie qui oublie `contentEditable` — le défaut historique",
       copie({ enSaisie: c => !!c && /^(input|textarea|select)$/i.test(
                 (c && c.tagName) || "") }),
       [controleSaisie]);

/* ── 9. LE MOTIF SANS SES ANCRES. `<mon-input>` passe pour un champ de saisie, et
   le clavier du jeu se tait devant lui sans que rien ne l'explique. */
essaie("une saisie dont le motif n'est plus ancré",
       copie({ enSaisie: c => !!c && (/input|textarea|select/i.test(
                 (c && c.tagName) || "") || !!c.isContentEditable) }),
       [controleSaisie]);

/* ── 10. LE MOYEN QUI NE SAIT PLUS S'ÉTEINDRE. Une fois la manette allumée par
   un contact, elle ne s'efface plus : c'est le comportement de quelqu'un qui a
   DEVINÉ le matériel une fois pour toutes au lieu d'observer l'usage — et c'est
   la faute que la règle du domaine existe pour interdire. */
essaie("une manette qui ne s'éteint plus une fois allumée",
       copie({ moyen: (tactile, usage) => tactile || usage === "touch" }),
       [controleMoyen]);

/* ── 11. LE MOYEN QUI SE LAISSE ALLUMER PAR N'IMPORTE QUOI. Le stylet, la casse
   inattendue, un `pointerType` vide : tout allume. Sur un ordinateur à écran
   tactile, la manette apparaîtrait au premier événement bizarre. */
essaie("une manette qu'un usage inconnu allume",
       copie({ moyen: (tactile, usage) => usage !== "mouse" && usage !== "clavier" }),
       [controleMoyen]);

/* ══════════════════════════════════════ CE QUI EST SIGNALÉ ET NON CORRIGÉ

   Cet outil est le portier : il n'écrit pas dans `manette.js`. Trois constats
   sont sortis de sa rédaction et sont IMPRIMÉS ici, sans être comptés comme des
   échecs — ce ne sont pas des contrats trahis, ce sont des décisions à prendre
   par qui tient le module.                                                    */
{
  console.log("\n  Constats — signalés, non corrigés, non comptés");
  console.log("  ─────────────────────────────────────────────");

  const R = MANETTE.R_STICK;
  if(amp(MANETTE, 2*R) < 1){
    console.log("  ⚠   Au-delà de l'anneau, POUSSER PLUS FORT FAIT MARCHER MOINS VITE.");
    console.log("        `d` est mesuré avant le bornage et réutilisé après pour");
    console.log("        normaliser, donc l'amplitude vaut R_STICK/d au lieu de saturer :");
    for(const r of [R, 60, 100, 200, 300])
      console.log("            pouce à " + String(r).padStart(4) + " px  →  "
                  + (amp(MANETTE, r)*100).toFixed(0).padStart(4) + " % de la vitesse");
    console.log("        Le disque DESSINÉ, lui, reste collé au bord de l'anneau : l'image");
    console.log("        et l'effet ne disent plus la même chose, et c'est la forme exacte");
    console.log("        de la maladie qui a donné le disque à 622×. Le plein régime n'est");
    console.log("        atteint qu'à 46 px pile — au pixel près —, donc en pratique on");
    console.log("        marche presque toujours en dessous, d'autant plus qu'on pousse.");
    console.log("        C'est un réglage de POUCE : la correction se voit à l'écran, pas");
    console.log("        ici. À poser à Hugo avant de toucher quoi que ce soit.");
    console.log("        L'assertion à armer le jour où le module sature :");
    console.log("            ok(\"au-delà de l'anneau, l'amplitude reste à 1\",");
    console.log("               amp(M, 10*R) === 1, …);");
    console.log("");
  }

  console.log("  ⚠   Le garde `Math.max(d, 1e-3)` ne sert JAMAIS. Sous un millième de");
  console.log("        pixel, la zone morte a déjà tout mis à zéro — il faudrait 6,44 px");
  console.log("        pour sortir de la bande. Le seul garde utile est le `d ? … : 0`");
  console.log("        qui l'entoure. Gardé tel quel : il ne coûte rien, et le retirer");
  console.log("        serait changer un fichier au lieu de le déplacer.");
  console.log("");

  console.log("  ⚠   Un stylet ne change pas l'état de la manette. C'est le comportement");
  console.log("        d'aujourd'hui — l'ancien gestionnaire ne traitait que `touch` et");
  console.log("        `mouse` — et il est probablement bon : quelqu'un qui marche au");
  console.log("        pouce et annote au stylet ne veut pas voir le manche disparaître.");
  console.log("        Mais personne ne l'a décidé, et sur une tablette pilotée");
  console.log("        uniquement au stylet la manette reste dans l'état où le dernier");
  console.log("        doigt l'a laissée. Aucun appareil de test ici ne peut le dire.");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
