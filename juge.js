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

     Ce qui reste : cinq questions, toutes signalées « ça coince ». */

  { id: "presentation",
    titre: "La présentation d'entrée",
    libre: true,
    quoi: "Trois écrans. Le rythme est-il bon ? Le dernier atteint-il ?",
    pose: () => { cinema.actif = true; cinema.t = 0; vaAu("libre"); jouePresentation(() => {}); },
  },

  { id: "quadrillage",
    titre: "Le quadrillage pendant le recul",
    libre: true,
    quoi: "On part. Tu sens qu'on s'éloigne, ou c'est du désordre ?",
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

  { id: "carte-etoiles",
    titre: "La carte des étoiles S",
    libre: true,
    quoi: "Dix orbites autour d'un point vide. On comprend, sans lire ?",
    pose: () => { auSalon(0, 0.6, 0, -0.05); TELESCOPE.carte = 1; ETOILES_S.vue.annee = 1992; },
    rend: () => { TELESCOPE.carte = 0; },
  },

  { id: "scintillement",
    titre: "Le scintillement des étoiles",
    libre: true,
    quoi: "Tourne lentement et regarde le fond. Ça grouille encore ?",
    pose: () => { vaAu("libre"); cinema.actif = false; cam.dist = 26; cam.elev = 0.5; },
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

  q(".pas").textContent = erreur
    ? "⚠ la scène n'a pas pu se poser : " + erreur
    : (avertissement || "Rien n'est envoyé. Écris autant que tu veux, le rapport se copie à la fin.");

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
  bCache.onclick = () => boite.classList.toggle("replie");
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
                get etape(){ return i; }, demarre };

/* Elle attend qu'on soit ENTRÉ.

   Au premier essai, la séance s'ouvrait sur l'écran d'accueil : le panneau
   était bien là, dessous, et le menu par-dessus. Pire, la première décision
   emmenait au salon avant qu'on ait choisi d'y aller — elle se battait avec
   l'entrée du site au lieu de l'attendre.

   Trente millisecondes de patience valent mieux qu'un panneau qu'on cherche. */
function demarre(){
  boite.style.display = "";
  debut = Date.now();
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
