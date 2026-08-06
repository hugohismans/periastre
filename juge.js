/* ============================================================================
   La séance de jugement.

       http://…/?juge

   Il y a des questions qu'aucun calcul ne tranche : est-ce beau, est-ce lisible,
   est-ce que ça se sent. Elles s'accumulaient dans `A-REGARDER.md`, un document
   qu'il faut lire, se rappeler, puis aller vérifier une par une en naviguant
   dans le site. C'est-à-dire : elles ne se traitaient jamais.

   Ici, on ne lit rien et on ne navigue pas. La séance VA CHERCHER la chose, la
   pose sous les yeux, demande, et passe à la suivante. Le seul travail demandé
   est celui que personne d'autre ne peut faire — regarder et dire.

   ---------------------------------------------------------------------------
   CE QUI CHANGE VRAIMENT : LES VARIANTES

   Certaines décisions ne sont pas « est-ce bien ? » mais « laquelle ? ». Pour
   celles-là, les options se comparent EN DIRECT, sur la même vue, d'un bouton à
   l'autre. La console de tir a coûté une heure de tâtonnement parce que je ne
   savais pas dire ce que je voyais ; à l'écran, le choix entre trois places se
   fait en trois secondes.

   Un jugement porté sur deux images côte à côte vaut dix jugements portés de
   mémoire, à vingt minutes d'intervalle.

   ---------------------------------------------------------------------------
   RIEN N'EST ENVOYÉ

   Comme `carnet.html` et `essai.js` : pas de serveur, pas de compte. Le rapport
   se copie à la fin, en Markdown, et s'envoie à la main si on le veut.
   ============================================================================ */

(function(global){
"use strict";

const $$ = id => document.getElementById(id);

/* Poser une scène ne doit JAMAIS casser la séance. Une décision qui n'arrive pas
   à s'afficher se signale et se saute — sans quoi une seule erreur emporterait
   les huit autres, et le testeur repartirait sans rien avoir jugé. */
function sur(f){ try { f(); return null; } catch(e){ return e.message; } }

// Se placer dans le salon, debout, à un endroit donné, en regardant où il faut.
function auSalon(x, z, lacet, tangage){
  cinema.actif = false;
  if(lieu !== "salon") vaAu("salon");
  joueur.p = [x, hauteurSol(x, z), z];
  joueur.v = [0, 0, 0];
  salon.lacet = lacet;
  salon.tangage = tangage;
}

// ============================================================ les décisions
const DECISIONS = [

  /* TROIS QUESTIONS ONT DISPARU D'ICI, ET C'EST LE BUT.

     Une séance de jugement doit rétrécir. Les lampes du bord — gardées, avec
     les lampes ; le disque en lumière visible — gardé travaillé ; la bulle de
     Lumen — ça va. Des questions qui dormaient dans le carnet depuis des
     semaines, tranchées en deux séances, et qu'on ne repose plus.

     La console de tir a disparu aussi, mais pour une autre raison : la réponse
     d'Hugo n'était pas un choix parmi les miens. « Quand je dis agrandir, je
     veux dire agrandir LE VAISSEAU, et mettre le canon dans une nouvelle
     salle. » Ce n'est plus une question de taille de meuble, c'est une aile de
     plus — et ça ne se tranche pas en trois secondes devant un écran.

     TROISIÈME SÉANCE, 6 AOÛT — DEUX DE PLUS S'EN VONT.

     La présentation d'entrée : « ça va ». Trois écrans, le rythme est bon, on
     ne la repose plus.

     La carte des étoiles S s'en va autrement. Trois séances, trois « ça
     coince », et cette fois la raison : « à discuter dans Claude Code avec
     Hugo ». Une question qu'on repose à l'identique après trois refus n'est pas
     une question, c'est une insistance. Ce qui coince n'est pas dans l'image —
     sinon il l'aurait dit — donc l'écran n'est pas le bon endroit pour en
     parler. Elle sort de la séance et devient une conversation.

     Ce qui reste : trois questions. */

  { id: "quadrillage",
    titre: "Le quadrillage pendant le recul",
    libre: true,
    /* La question a changé, et c'est le point. « Tu sens qu'on s'éloigne ? »
       avait déjà reçu son « ça va » — la reposer telle quelle aurait rendu le
       même oui, sur une chose qui n'était pas celle en cause. Ce qu'il faut
       savoir maintenant, c'est si les arêtes verticales font leur travail. */
    quoi: "Le quadrillage a des arêtes verticales maintenant. Tu vois un volume, ou encore un tapis ?",
    pose: () => {
      auSalon(0, 0.6, 0, -0.05);
      const d = DESTINATIONS[0];
      lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
    },
    rend: () => {
      if(TELESCOPE.trajet){ TELESCOPE.trajet = null; TELESCOPE.retour = false;
                            RECUL.etat.actif = false; $$("chrono").classList.remove("vu"); }
    },
  },

  /* Trois séances, trois « ça coince », zéro précision — et c'est normal : la
     cause n'était pas regardable. Les étoiles étaient tranchées par la frontière
     de leur propre cellule, et le trait de coupe se déplaçait sur elles.

     Maintenant qu'elle est trouvée et corrigée, la question change de nature.
     Elle ne demande plus « est-ce que ça grouille » — on sait que non, c'est
     mesuré. Elle demande ce que le remède COÛTE : le ciel propre à toutes les
     hauteurs éteint la couche la plus fine, donc il y a moins d'étoiles. Ça,
     aucun calcul ne le tranche. */
  { id: "scintillement",
    titre: "Le scintillement des étoiles",
    libre: true,
    quoi: "Trois ciels. Bascule entre eux, tourne lentement, regarde le fond. "
        + "Le premier ne grouille plus mais a moins d'étoiles fines — est-ce que ça vaut l'échange ?",
    pose: () => { vaAu("libre"); cinema.actif = false; cam.dist = 26; cam.elev = 0.5; },
    options: [
      { nom: "celui d'aujourd'hui", fait: () => { CIEL.mode = 2; } },
      { nom: "l'ancien, qui grouille", fait: () => { CIEL.mode = 0; } },
      { nom: "toutes les étoiles, un peu de grouillement", fait: () => { CIEL.mode = 1; } },
    ],
    rend: () => { CIEL.mode = 2; },
  },

  { id: "trou-noir-etude",
    titre: "La rotation du trou noir d'étude",
    libre: true,
    quoi: "Passe les quatre rotations. L'effet se voit, ou pas ?",
    pose: () => { vaAu("libre"); cinema.actif = false; if(typeof poseEtude === "function") poseEtude(); },
  },
];

// ================================================================== l'écran
const style = document.createElement("style");
style.textContent = `
  #juge {
    position:fixed; z-index:90; left:50%; bottom:20px; transform:translateX(-50%);
    width:min(470px, 94vw); pointer-events:auto;
    background:color-mix(in srgb, #0b0a16 95%, transparent); backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,.15); border-radius:5px; padding:14px 16px 13px;
    font-family:-apple-system, system-ui, sans-serif; color:#c7c2d9;
  }
  #juge .sur {
    font-family:ui-monospace, monospace; font-size:8.5px; letter-spacing:.18em;
    text-transform:uppercase; color:#7fd8ff; margin-bottom:6px;
  }
  #juge h4 { font-size:14.5px; font-weight:500; color:#fff; margin:0 0 4px; }
  #juge p  { font-size:12px; line-height:1.55; margin:0 0 10px; }
  #juge .variantes { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; align-items:center; }
  #juge .titre-var {
    flex-basis:100%; font-family:ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size:9px; letter-spacing:.16em; text-transform:uppercase;
    color:#6b6880; margin-bottom:1px;
  }
  #juge .variantes button {
    flex:1 1 auto; min-width:88px; padding:8px 6px; font-size:11.5px; cursor:pointer;
    border-radius:3px; border:1px solid rgba(127,216,255,.28);
    background:rgba(127,216,255,.05); color:#a8d8ee; font-family:inherit;
  }
  #juge .variantes button.la { background:rgba(127,216,255,.20); color:#fff; border-color:rgba(127,216,255,.6); }
  /* Le champ libre était haut de quarante-quatre pixels, avec « Un mot, si tu
     veux » pour invitation. Hugo a voulu écrire des phrases — « la question est
     mal posée », « le robot n'était pas visible » — et le champ lui disait le
     contraire. Une boîte de la taille d'un mot ne reçoit que des mots.

     Cent pixels, et une invitation qui demande explicitement le désaccord. */
  #juge textarea {
    width:100%; box-sizing:border-box; min-height:100px; resize:vertical;
    background:rgba(0,0,0,.32); border:1px solid rgba(255,255,255,.12);
    border-radius:3px; color:#e4e0f0; font:inherit; font-size:12.5px;
    line-height:1.5; padding:8px 10px;
  }
  #juge textarea:focus { border-color:rgba(127,216,255,.45); outline:none; }
  #juge .rangee { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  #juge .mauvaise {
    border-color:rgba(255,200,110,.45) !important; color:#ffd08a !important;
    flex-basis:100%;
  }
  #juge .note-libre {
    border-style:dashed !important; color:#8f8aa6 !important;
    background:transparent !important; font-size:11px !important;
  }
  #juge .note-libre:hover { color:#fff !important; }
  #juge .rangee button {
    flex:1; padding:9px 8px; cursor:pointer; border-radius:3px; font-family:inherit;
    border:1px solid rgba(255,255,255,.16); background:rgba(255,255,255,.04);
    color:#c7c2d9; font-size:11.5px;
  }
  #juge .rangee button:hover { background:rgba(255,255,255,.09); color:#fff; }
  #juge .oui { border-color:rgba(110,255,180,.4) !important; color:#8ff0c0 !important; }
  #juge .non { border-color:rgba(255,120,120,.4) !important; color:#ffa8a8 !important; }
  #juge .pas { font-family:ui-monospace, monospace; font-size:9px; color:#6b6880; margin-top:8px; }
  /* Replié, il ne reste qu'un bandeau — le titre et de quoi rouvrir.

     Hugo, deuxième séance : « le champ du test est devant la présentation » et
     « je n'ai pas accès au bouton avec l'interface de test ». Un panneau posé au
     milieu de l'écran cache justement ce qu'il demande de regarder, et couvre
     les commandes qu'il demande d'essayer. Les questions qui envoient explorer
     le site s'ouvrent donc REPLIÉES. */
  #juge.replie { padding:7px 11px; width:auto; max-width:min(420px, 92vw); }
  #juge.replie h4, #juge.replie p, #juge.replie .variantes,
  #juge.replie textarea, #juge.replie .rangee:not(.replie-visible),
  #juge.replie .pas { display:none; }
  #juge.replie .sur { margin-bottom:0; color:#a8d8ee; }
  #juge .rangee.replie-visible { margin-top:6px; }

  /* LA FENÊTRE SE DÉPLACE, ET C'EST LA BARRE DU HAUT QUI SERT DE POIGNÉE.

     Elle est le seul élément qui survit au repli — le panneau reste donc
     saisissable dans les deux états, ce qui est exactement le moment où l'on
     en a besoin : replié pour regarder, et toujours au mauvais endroit. */
  #juge .sur { cursor:grab; touch-action:none; padding-bottom:3px; }
  #juge .sur::before { content:"⠿"; margin-right:7px; letter-spacing:0; color:#565270; }
  #juge.bouge { cursor:grabbing; }
  #juge.bouge .sur { cursor:grabbing; }
  #juge.bouge::after {
    content:""; position:absolute; inset:0; border-radius:5px;
    border:1px solid rgba(127,216,255,.45); pointer-events:none;
  }
`;
document.head.appendChild(style);

const boite = document.createElement("div");
boite.id = "juge";
boite.className = "hud";
boite.innerHTML =
  '<div class="sur"></div><h4></h4><p></p>' +
  '<div class="variantes"></div>' +
  '<textarea placeholder="Écris ce que tu veux, et autant que tu veux.\n' +
  'Y compris : la question est mal posée, on ne voit pas ce dont tu parles, ' +
  'ça n\'a rien à voir avec ce que fait ce bouton…"></textarea>' +
  '<div class="rangee"></div><div class="pas"></div>';
document.body.appendChild(boite);

const q = s => boite.querySelector(s);

/* ======================================================= la fenêtre se déplace

   Le panneau était cloué en bas au centre. Deux séances de suite, Hugo a jugé
   une scène qu'il ne voyait qu'à moitié : « le champ du test est devant la
   présentation », puis « l'interface de test bloque encore l'interface ».

   Le repli avait été ma première réponse, et il ne suffit pas : replié, le
   bandeau reste posé au même endroit, et il y a toujours une question pour
   demander de regarder précisément ce coin-là. Tant que la fenêtre ne bouge
   pas, c'est MOI qui décide de ce qu'il a le droit de voir — et je décide mal,
   puisque je ne vois pas son écran.

   La place choisie est gardée d'une question à l'autre : la déplacer une fois
   par séance doit suffire. */

const MARGE = 8;              // ce qui doit toujours rester à l'écran, en pixels
let place = null;             // {x, y} une fois qu'on a bougé ; null tant qu'on n'a pas

/* Ramener la fenêtre dans l'écran.

   Appelée après chaque déplacement, mais aussi après chaque repli et chaque
   dépli — parce que ces deux-là CHANGENT SA TAILLE. Une fenêtre posée tout en
   bas alors qu'elle était réduite à son bandeau redevient haute de trois cents
   pixels en se dépliant, et sort par le bas en emportant les boutons de
   réponse. C'est le même défaut que celui qu'on est en train de corriger, à
   ceci près qu'il cacherait la réponse au lieu de la question. */
function recadre(){
  if(!place) return;
  const r = boite.getBoundingClientRect();
  const maxX = Math.max(MARGE, innerWidth  - r.width  - MARGE);
  const maxY = Math.max(MARGE, innerHeight - r.height - MARGE);
  place.x = Math.min(Math.max(place.x, MARGE), maxX);
  place.y = Math.min(Math.max(place.y, MARGE), maxY);
  boite.style.left      = place.x + "px";
  boite.style.top       = place.y + "px";
  boite.style.bottom    = "auto";
  boite.style.transform = "none";
}

const poignee = q(".sur");
poignee.title = "Attrape ici pour déplacer la fenêtre";

poignee.addEventListener("pointerdown", e => {
  /* La scène écoute le pointeur sur le CANEVAS, pas sur la page : empoigner la
     fenêtre ne fait donc pivoter aucun ciel. On arrête quand même l'événement,
     parce que « aucun autre écouteur aujourd'hui » n'est pas une propriété
     qu'on peut laisser à la charge du prochain qui touchera au fichier. */
  e.preventDefault();
  e.stopPropagation();

  const r = boite.getBoundingClientRect();
  if(!place) place = { x: r.left, y: r.top };
  const prise = { x: e.clientX - r.left, y: e.clientY - r.top };

  boite.classList.add("bouge");

  /* On suit le pointeur SUR LA FENÊTRE, pas sur la poignée.

     `setPointerCapture` serait plus direct, mais il exige un pointeur réellement
     actif : un contrôle qui rejoue un déplacement avec des événements
     synthétiques se fait jeter, et le geste ne serait donc vérifiable que par
     quelqu'un qui a une main. Écouter la fenêtre marche dans les deux cas, et
     ne perd rien — le glissé s'arrête au relâchement d'où qu'il vienne. */
  const suit = ev => {
    place.x = ev.clientX - prise.x;
    place.y = ev.clientY - prise.y;
    recadre();
  };
  const lache = () => {
    removeEventListener("pointermove", suit);
    removeEventListener("pointerup",     lache);
    removeEventListener("pointercancel", lache);
    boite.classList.remove("bouge");
  };
  addEventListener("pointermove", suit);
  addEventListener("pointerup",     lache);
  addEventListener("pointercancel", lache);
});

addEventListener("resize", recadre);

/* ------------------------------------- la fenêtre se contrôle elle-même

   Règle du projet : tout défaut trouvé à l'œil devient un contrôle. Celui-ci
   naît du verdict du 6 août — « l'interface de test bloque encore l'interface »
   — et il a ceci de particulier qu'il ne protège pas le site mais l'INSTRUMENT.

   Un outil de mesure qui masque ce qu'il mesure ne rend pas des résultats
   faibles, il en rend des faux : ce jour-là le verdict portait sur la rotation
   du trou noir d'étude, et il ne nous a rien appris d'elle. Une séance entière
   peut se perdre comme ça, et on ne s'en aperçoit qu'à la lecture du rapport.

   Il ne vit pas dans `verif.js` parce qu'il exige `?juge` pour avoir un objet à
   contrôler. Il tourne donc ici, au démarrage de CHAQUE séance — c'est-à-dire
   exactement quand il sert, et sans que personne ait à y penser. */
function eprouve(){
  const ecarts = [];
  const garde = place ? { x: place.x, y: place.y } : null;
  const dep = boite.getBoundingClientRect();

  /* UN PANNEAU NON COMPOSÉ NE SE MESURE PAS, ET NE SE JUGE DONC PAS.

     Avant `demarre()`, la fenêtre est en `display:none` : sa boîte fait zéro sur
     zéro, aucun déplacement ne s'y lit, et le contrôle rendait « la poignée ne
     la déplace pas » sur un instrument parfaitement sain. C'est une fausse
     alerte dans l'outil même qui existe pour n'en produire aucune — et je l'ai
     vue en l'appelant à la main sur le site en ligne.

     Le seul appelant réel est `demarre()`, qui affiche la fenêtre juste avant.
     Ce garde-fou ne masque donc rien : il refuse de conclure là où il n'y a
     rien à mesurer, au lieu d'inventer un verdict. */
  if(dep.width < 1 || dep.height < 1) return ecarts;

  const envoie = (cible, type, x, y) => cible.dispatchEvent(new PointerEvent(type,
    { clientX:x, clientY:y, bubbles:true, cancelable:true, pointerId:1 }));

  // 1. La poignée déplace la fenêtre.
  const vise = { x: Math.round(innerWidth * 0.42), y: Math.round(innerHeight * 0.3) };
  envoie(poignee, "pointerdown", dep.left + 12, dep.top + 6);
  envoie(window,  "pointermove", vise.x, vise.y);
  const apres = boite.getBoundingClientRect();
  if(Math.abs(apres.left - dep.left) < 1 && Math.abs(apres.top - dep.top) < 1)
    ecarts.push("la poignée ne la déplace pas");

  /* 2. On ne peut pas la perdre. Elle serait alors plus gênante qu'avant : on
        ne la voit plus, et elle couvre toujours un coin de la scène. */
  envoie(window, "pointermove", innerWidth + 4000, innerHeight + 4000);
  const bd = boite.getBoundingClientRect();
  if(bd.right > innerWidth + 1 || bd.bottom > innerHeight + 1)
    ecarts.push("elle sort de l'écran en bas à droite");
  envoie(window, "pointermove", -4000, -4000);
  const hg = boite.getBoundingClientRect();
  if(hg.left < -1 || hg.top < -1)
    ecarts.push("elle sort de l'écran en haut à gauche");

  // 3. Le relâchement arrête le glissé — sinon elle colle au pointeur à vie.
  envoie(window, "pointerup", 0, 0);
  const fixe = boite.getBoundingClientRect();
  envoie(window, "pointermove", vise.x, vise.y);
  if(Math.abs(boite.getBoundingClientRect().left - fixe.left) > 1)
    ecarts.push("elle suit encore le pointeur après le relâchement");

  // Un contrôle ne laisse pas de trace : on la remet exactement où on l'a prise.
  if(garde){ place.x = garde.x; place.y = garde.y; recadre(); }
  else {
    place = null;
    boite.style.left = boite.style.top = "";
    boite.style.bottom = boite.style.transform = "";
  }
  return ecarts;
}

let instrumentCasse = [];

// ================================================================== la séance
const verdicts = [];
/* Ce qu'on remarque en passant, et qui n'est la réponse à rien.

   La première version ne recevait que des réponses à MES questions. Hugo :
   « je ne pouvais pas commenter, ne fût-ce que ce que je voyais dans la scène ».
   C'est le reproche le plus juste qu'on puisse faire à un protocole : il ne
   récolte que ce qu'il a prévu, et ce qu'on n'a pas prévu est précisément ce
   qu'on avait besoin d'apprendre. */
const remarques = [];
let i = 0, choisie = null, debut = Date.now();

function montre(){
  if(i >= DECISIONS.length){ termine(); return; }
  const d = DECISIONS[i];
  choisie = null;

  q(".sur").textContent = "jugement " + (i + 1) + " sur " + DECISIONS.length;
  q("h4").textContent = d.titre;
  q("p").textContent  = d.quoi;
  q("textarea").value = "";

  const erreur = sur(d.pose);

  /* La séance vérifie qu'elle montre bien ce dont elle parle.

     Quand une décision déclare une `cible`, on projette ce point à l'écran. S'il
     n'y est pas, on le DIT au lieu de laisser quelqu'un chercher — c'est le
     défaut exact qu'Hugo a subi sur le drone. */
  let avertissement = null;
  if(!erreur && d.cible){
    try {
      const c = d.cible();
      const { av } = regardSalon();
      const oe = oeilSalon();
      const versCible = [c[0]-oe[0], c[1]-oe[1], c[2]-oe[2]];
      const dist = Math.hypot(versCible[0], versCible[1], versCible[2]) || 1;
      const devant = (versCible[0]*av[0] + versCible[1]*av[1] + versCible[2]*av[2]) / dist;
      if(devant < 0.55) avertissement = "⚠ la cible n'est pas dans le champ (cos = " + devant.toFixed(2) + ")";
    } catch(e){ avertissement = "⚠ cible introuvable : " + e.message; }
  }

  /* Ce qu'on a à dire sur l'état des choses s'écrit À LA FIN de `montre()` :
     la rangée de notes n'existe pas encore ici, et c'est elle qu'on doit
     compter avant de se déclarer en bon état. Voir `ditEtat()`. */

  /* Les variantes. Le bouton de validation NOMME celle qui est sélectionnée, et
     il change quand on bascule.

     Hugo, sur la première version : « je garde celle-ci, ça veut dire je garde
     la réponse que j'ai sélectionnée ou aucune réponse ne fonctionne ? Je ne
     trouve pas ça très clair. » Il avait raison — un bouton qui dit « celle-ci »
     sans dire laquelle oblige à reconstituer mentalement ce qu'on vient de
     cliquer. Le libellé porte maintenant le nom. */
  const boiteVar = q(".variantes");
  boiteVar.innerHTML = "";
  if(d.options){
    const titre = document.createElement("div");
    titre.className = "titre-var";
    titre.textContent = "Bascule pour comparer :";
    boiteVar.appendChild(titre);
    d.options.forEach((o, k) => {
      const b = document.createElement("button");
      b.textContent = o.nom;
      b.onclick = () => {
        const e = sur(o.fait);
        if(e){ q(".pas").textContent = "⚠ " + e; return; }
        choisie = o.nom;
        [...boiteVar.querySelectorAll("button")].forEach((c, j) => c.classList.toggle("la", j === k));
        const val = boite.querySelector(".valider");
        if(val) val.textContent = "✓  Je garde « " + o.nom + " »";
      };
      boiteVar.appendChild(b);
    });
  }

  // Les verdicts. Ils ne disent pas la même chose selon le type de décision :
  // « laquelle ? » se répond en choisissant, « est-ce bien ? » en tranchant.
  const rang = q(".rangee");
  rang.innerHTML = "";
  const bouton = (txt, cls, verdict) => {
    const b = document.createElement("button");
    b.textContent = txt;
    if(cls) b.className = cls;
    b.onclick = () => repond(verdict);
    rang.appendChild(b);
  };
  if(d.options){
    bouton("✓  Je garde celle-ci", "oui valider", "retenu");
    bouton("✕  Aucune de ces " + d.options.length + " ne convient", "non", "aucune");
  } else {
    bouton("✓  Ça va", "oui", "ça va");
    bouton("✕  Ça coince", "non", "ça coince");
  }
  bouton("→  Passer, je ne sais pas", "", "passé");

  /* LE QUATRIÈME BOUTON, ET C'EST LE PLUS UTILE.

     Sans lui, quelqu'un à qui l'on pose une mauvaise question n'a que de
     mauvaises réponses : « ça coince » accuse le site alors que c'est la
     question qui est fausse, et « passer » perd l'information entièrement.

     Hugo a vécu les deux. Une question actionnait le mauvais bouton ; une autre
     lui demandait de juger un drone qu'on ne voyait pas. Dans les deux cas le
     défaut était chez moi, et rien ne lui permettait de me le dire. */
  bouton("↺  La question elle-même ne va pas", "mauvaise", "question");

  /* Et de quoi noter ce qui n'est la réponse à rien. On peut en poser autant
     qu'on veut, sans quitter la scène ni répondre. */
  /* LA RANGÉE DE NOTES SE REMPLACE, ELLE NE S'AJOUTE PAS.

     `rang.innerHTML = ""` plus haut ne vide que la PREMIÈRE rangée. Celle-ci est
     un second élément, inséré à côté — et rien ne retirait le précédent. Le
     panneau gagnait donc cinquante-six pixels par question : cent quarante-deux
     à la première, trois cent dix à la quatrième, et ce en état REPLIÉ.

     La cinquième question de la séance du 6 août était la rotation du trou noir
     d'étude. Le verdict rendu ce jour-là est « ça coince », avec pour seul mot
     « l'interface de test bloque encore l'interface ». Il ne portait pas sur la
     rotation : il portait sur une fenêtre deux fois plus haute qu'à l'ouverture.

     Un instrument qui grossit à mesure qu'on s'en sert fausse d'autant plus qu'on
     avance — c'est-à-dire exactement quand on lui fait le plus confiance. */
  boite.querySelectorAll(".rangee.replie-visible").forEach(n => n.remove());

  const notes = document.createElement("div");
  notes.className = "rangee";
  const bNote = document.createElement("button");
  bNote.className = "note-libre";
  bNote.textContent = "+  Noter autre chose (sans répondre)";
  bNote.onclick = () => {
    const txt = q("textarea").value.trim();
    if(!txt){ q("textarea").focus(); return; }
    remarques.push({ ou: d.titre, txt, minute: Math.round((Date.now() - debut)/60000) });
    q("textarea").value = "";
    q(".pas").textContent = "Noté (" + remarques.length + "). Tu peux en ajouter d'autres.";
  };
  const bCache = document.createElement("button");
  bCache.className = "note-libre";
  bCache.textContent = "👁  Replier pour regarder";
  bCache.onclick = () => { boite.classList.toggle("replie"); recadre(); };
  notes.className = "rangee replie-visible";      // seul rang visible une fois replié
  notes.appendChild(bNote); notes.appendChild(bCache);
  rang.parentElement.insertBefore(notes, q(".pas"));

  /* Les questions qui envoient EXPLORER s'ouvrent repliées : sinon le panneau
     couvre la présentation qu'il faut regarder, ou les boutons qu'il faut
     essayer. On déplie quand on est prêt à répondre. */
  boite.classList.toggle("replie", !!d.libre);
  bCache.textContent = d.libre ? "▸  Déplier pour répondre" : "👁  Replier pour regarder";
  if(d.libre) q(".sur").textContent += "  ·  " + d.titre;

  /* La première variante s'applique d'office, mais SEULEMENT MAINTENANT : son
     gestionnaire écrit dans le bouton de validation, qui vient d'être créé.
     Placé plus haut, il écrivait dans un bouton qui n'existait pas encore. */
  const premiere = boiteVar.querySelector("button");
  if(premiere) premiere.click();

  ditEtat(erreur, avertissement);

  // La question suivante n'a pas la même hauteur que la précédente : si la
  // fenêtre a été déplacée, elle peut déborder sans qu'on ait rien touché.
  recadre();
}

/* La ligne du bas, et le contrôle qu'elle porte.

   Un instrument en panne se dit à CHAQUE question, jamais une seule fois au
   début : le message d'ouverture d'une séance de dix minutes n'est plus lu à la
   troisième, et c'est précisément là qu'on rendrait le verdict faussé.

   Le compte des rangées est un contrôle vivant, pas un souvenir. Il doit y en
   avoir deux : celle des verdicts, celle des notes. Trois veut dire que le
   panneau s'est remis à empiler, donc à grandir, donc à cacher — le défaut du
   6 août, qui a coûté un verdict. Il tourne à chaque question parce qu'il ne
   coûte rien, et parce qu'un défaut qui grandit se voit mieux tard que tôt. */
function ditEtat(erreur, avertissement){
  const maux = instrumentCasse.slice();

  const rangees = boite.querySelectorAll(".rangee").length;
  if(rangees !== 2) maux.push("le panneau empile ses rangées (" + rangees + " au lieu de 2)");

  const panne = maux.length ? "⚠ l'instrument déraille : " + maux.join(" ; ") + " — dis-le-moi.  ·  " : "";
  q(".pas").textContent = panne + (erreur
    ? "⚠ la scène n'a pas pu se poser : " + erreur
    : (avertissement || "Attrape ⠿ en haut pour déplacer cette fenêtre. Rien n'est envoyé."));
}

function repond(verdict){
  const d = DECISIONS[i];
  verdicts.push({ id: d.id, titre: d.titre, verdict,
                  option: d.options ? choisie : null,
                  mot: q("textarea").value.trim(),
                  minute: Math.round((Date.now() - debut)/60000) });
  if(d.rend) sur(d.rend);
  i++;
  montre();
}

// ================================================================== le rapport
function materiel(){
  const g = document.createElement("canvas").getContext("webgl2");
  const d = g && g.getExtension("WEBGL_debug_renderer_info");
  return [
    "navigateur   " + navigator.userAgent,
    "écran        " + screen.width + " × " + screen.height +
      "   fenêtre " + innerWidth + " × " + innerHeight,
    "densité      " + (devicePixelRatio || 1) + "   points tactiles " + (navigator.maxTouchPoints || 0),
    "échelle      " + (typeof echelle !== "undefined" ? echelle : "?") +
      "   (la résolution adaptative a choisi ce palier)",
    "graphique    " + (d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : "inconnu"),
  ].join("\n");
}

/* Ce qui sort d'ici n'est PAS un rapport à ranger dans un dossier. C'est un
   message adressé à Claude, prêt à coller dans la conversation — les décisions
   sont formulées comme des consignes, pas comme des observations.

   La différence est tout le sujet : un rapport demande à quelqu'un de le lire,
   de le traduire en travail, puis de s'en souvenir. Un message se colle, et le
   travail commence à la ligne suivante. */
function termine(){
  const dits = verdicts.filter(v => v.verdict !== "passé");
  const l = ["Voilà ma séance de jugement sur Périastre. Applique ce qui suit.", ""];

  /* Les questions ratées passent EN PREMIER, et séparément.

     Si une question est mal posée, la réponse ne vaut rien et corriger le site
     serait corriger la mauvaise chose. C'est donc le premier travail, pas une
     note de bas de page. */
  const ratees = dits.filter(v => v.verdict === "question");
  if(ratees.length){
    l.push("## D'abord : des questions que tu as mal posées");
    l.push("");
    for(const v of ratees){
      l.push("- **" + v.titre + "**" + (v.option ? "  (variante affichée : " + v.option + ")" : ""));
      if(v.mot) l.push("  > " + v.mot.split("\n").join("\n  > "));
      else l.push("  > (sans précision)");
    }
    l.push("");
    l.push("Répare la question avant de toucher au site.");
    l.push("");
    l.push("## Ce que j'ai pu juger");
    l.push("");
  }

  for(const v of dits){
    if(v.verdict === "question") continue;               // déjà dit plus haut
    if(v.verdict === "retenu" && v.option)
      l.push("- **" + v.titre + "** → je garde « " + v.option + " ». Pose-la et enlève les autres.");
    else if(v.verdict === "retenu")
      l.push("- **" + v.titre + "** → j'ai validé, mais aucune variante n'était sélectionnée. À vérifier.");
    else if(v.verdict === "aucune")
      l.push("- **" + v.titre + "** → aucune des variantes ne va. Cherche autre chose.");
    else if(v.verdict === "ça va")
      l.push("- **" + v.titre + "** → ça va. Raye-le de `A-REGARDER.md`.");
    else
      l.push("- **" + v.titre + "** → ça coince. À reprendre.");
    if(v.mot) l.push("  > " + v.mot.split("\n").join("\n  > "));
  }

  const passes = verdicts.filter(v => v.verdict === "passé");
  if(passes.length){
    l.push("");
    l.push("Pas tranché cette fois : " + passes.map(v => v.titre).join(" · ") + ".");
  }

  // Ce que je n'avais pas demandé, et qui vaut souvent mieux.
  if(remarques.length){
    l.push("");
    l.push("## Ce que j'ai remarqué au passage");
    l.push("");
    for(const r of remarques){
      l.push("- *(pendant « " + r.ou + " »)*");
      l.push("  > " + r.txt.split("\n").join("\n  > "));
    }
  }

  l.push("");
  l.push("<details><summary>matériel</summary>");
  l.push("");
  l.push("```");
  l.push(materiel());
  l.push("```");
  l.push("</details>");
  const texte = l.join("\n");

  q(".sur").textContent = "séance terminée";
  q("h4").textContent = "Fini. Colle ça dans la conversation.";
  q("p").textContent  = dits.length + " décision(s) tranchée(s). Le texte est déjà écrit pour Claude.";
  q(".variantes").innerHTML = "";
  q("textarea").value = texte;
  q("textarea").style.minHeight = "180px";
  const rang = q(".rangee");
  rang.innerHTML = "";
  const b1 = document.createElement("button");
  b1.className = "oui"; b1.textContent = "Copier";
  b1.onclick = () => navigator.clipboard.writeText(texte)
    .then(() => { q(".pas").textContent = "Copié."; },
          () => { q("textarea").select(); q(".pas").textContent = "Sélectionné — copie à la main."; });
  const b2 = document.createElement("button");
  b2.textContent = "Fermer";
  b2.onclick = () => boite.remove();
  rang.appendChild(b1); rang.appendChild(b2);
  global.JUGE.rapport = texte;
}

/* Exposé pour que la séance soit elle-même éprouvable : un script la déroule
   d'un bout à l'autre sans qu'un doigt ne touche l'écran. Un protocole qu'on ne
   peut pas tester serait une plaisanterie — c'est déjà la règle d'`essai.js`. */
global.JUGE = { DECISIONS, verdicts, montre, repond, termine, rapport: null,
                get etape(){ return i; }, demarre,
                // La fenêtre elle-même, pour que son déplacement soit contrôlable.
                boite, poignee, recadre, eprouve, get place(){ return place; } };

/* Elle attend qu'on soit ENTRÉ.

   Au premier essai, la séance s'ouvrait sur l'écran d'accueil : le panneau
   était bien là, dessous, et le menu par-dessus. Pire, la première décision
   emmenait au salon avant qu'on ait choisi d'y aller — elle se battait avec
   l'entrée du site au lieu de l'attendre.

   Trente millisecondes de patience valent mieux qu'un panneau qu'on cherche. */
function demarre(){
  boite.style.display = "";
  debut = Date.now();
  instrumentCasse = eprouve();          // avant la première question, jamais après
  montre();
}

const attendEntree = () => {
  const dedans = document.body.classList.contains("dedans")
              || (elAccueil && elAccueil.classList.contains("parti"))
              || !document.body.classList.contains("au-menu");
  if(dedans) demarre();
  else setTimeout(attendEntree, 120);
};
boite.style.display = "none";
attendEntree();

})(window);
