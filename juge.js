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

  /* Celle-ci d'abord, parce que c'est la seule qui me DÉBLOQUE. Les autres
     améliorent ; celle-là décide si une pièce entière se construit. */
  { id: "console-tir",
    titre: "Où poser la console de tir ?",
    quoi: "Bascule entre les places. Laquelle se lit comme un instrument ?",
    pose: () => auSalon(0, 0.9, 0, -0.30),
    options: [
      { nom: "Aucune",        fait: () => VAISSEAU.poseTir(gl, null) },
      { nom: "Fosse, centre", fait: () => VAISSEAU.poseTir(gl, 1.2)  },
      { nom: "Tribord",       fait: () => VAISSEAU.poseTir(gl, 3.0)  },
      { nom: "Bâbord",        fait: () => VAISSEAU.poseTir(gl, -1.5) },
    ],
    // On repart toujours de l'état de production : éteinte.
    rend: () => VAISSEAU.poseTir(gl, null),
  },

  { id: "lumiere-salon",
    titre: "La lumière de la pièce",
    quoi: "Compare. Laquelle fait un vaisseau plutôt qu'un diorama ?",
    pose: () => auSalon(0, 1.2, 0.10, -0.05),
    options: [
      { nom: "Avec les lampes", fait: () => { if($$("b-reel").classList.contains("actif")) $$("b-reel").click(); } },
      { nom: "L'astre seul",    fait: () => { if(!$$("b-reel").classList.contains("actif")) $$("b-reel").click(); } },
    ],
    rend: () => { if($$("b-reel").classList.contains("actif")) $$("b-reel").click(); },
  },

  { id: "presentation",
    titre: "La présentation d'entrée",
    quoi: "Trois écrans. Le rythme est-il bon ? Le dernier atteint-il ?",
    pose: () => { cinema.actif = true; cinema.t = 0; vaAu("libre"); jouePresentation(() => {}); },
  },

  { id: "quadrillage",
    titre: "Le quadrillage pendant le recul",
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
    quoi: "Dix orbites autour d'un point vide. On comprend, sans lire ?",
    pose: () => { auSalon(0, 0.6, 0, -0.05); TELESCOPE.carte = 1; ETOILES_S.vue.annee = 1992; },
    rend: () => { TELESCOPE.carte = 0; },
  },

  { id: "bulle-lumen",
    titre: "La bulle de Lumen",
    quoi: "Elle chevauche le drone. Gênant, ou pas ?",
    pose: () => { auSalon(0, 1.4, 0, -0.02); reagit("salon", true); },
  },

  { id: "scintillement",
    titre: "Le scintillement des étoiles",
    quoi: "Tourne lentement et regarde le fond. Ça grouille encore ?",
    pose: () => { vaAu("libre"); cinema.actif = false; cam.dist = 26; cam.elev = 0.5; },
  },

  { id: "trou-noir-etude",
    titre: "La rotation du trou noir d'étude",
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
  #juge .variantes { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
  #juge .variantes button {
    flex:1 1 auto; min-width:88px; padding:8px 6px; font-size:11.5px; cursor:pointer;
    border-radius:3px; border:1px solid rgba(127,216,255,.28);
    background:rgba(127,216,255,.05); color:#a8d8ee; font-family:inherit;
  }
  #juge .variantes button.la { background:rgba(127,216,255,.20); color:#fff; border-color:rgba(127,216,255,.6); }
  #juge textarea {
    width:100%; box-sizing:border-box; min-height:44px; resize:vertical;
    background:rgba(0,0,0,.32); border:1px solid rgba(255,255,255,.12);
    border-radius:3px; color:#e4e0f0; font:inherit; font-size:12px; padding:6px 8px;
  }
  #juge .rangee { display:flex; gap:6px; margin-top:8px; }
  #juge .rangee button {
    flex:1; padding:9px 8px; cursor:pointer; border-radius:3px; font-family:inherit;
    border:1px solid rgba(255,255,255,.16); background:rgba(255,255,255,.04);
    color:#c7c2d9; font-size:11.5px;
  }
  #juge .rangee button:hover { background:rgba(255,255,255,.09); color:#fff; }
  #juge .oui { border-color:rgba(110,255,180,.4) !important; color:#8ff0c0 !important; }
  #juge .non { border-color:rgba(255,120,120,.4) !important; color:#ffa8a8 !important; }
  #juge .pas { font-family:ui-monospace, monospace; font-size:9px; color:#6b6880; margin-top:8px; }
  #juge.replie { padding:8px 12px; width:auto; }
  #juge.replie h4, #juge.replie p, #juge.replie .variantes,
  #juge.replie textarea, #juge.replie .pas { display:none; }
`;
document.head.appendChild(style);

const boite = document.createElement("div");
boite.id = "juge";
boite.className = "hud";
boite.innerHTML =
  '<div class="sur"></div><h4></h4><p></p>' +
  '<div class="variantes"></div>' +
  '<textarea placeholder="Un mot, si tu veux. Facultatif."></textarea>' +
  '<div class="rangee"></div><div class="pas"></div>';
document.body.appendChild(boite);

const q = s => boite.querySelector(s);

// ================================================================== la séance
const verdicts = [];
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
  q(".pas").textContent = erreur
    ? "⚠ la scène n'a pas pu se poser : " + erreur
    : "Rien n'est envoyé. Le rapport se copie à la fin.";

  // Les variantes, s'il y en a. La première est appliquée d'office.
  const boiteVar = q(".variantes");
  boiteVar.innerHTML = "";
  if(d.options){
    d.options.forEach((o, k) => {
      const b = document.createElement("button");
      b.textContent = o.nom;
      b.onclick = () => {
        const e = sur(o.fait);
        if(e){ q(".pas").textContent = "⚠ " + e; return; }
        choisie = o.nom;
        [...boiteVar.children].forEach((c, j) => c.classList.toggle("la", j === k));
      };
      boiteVar.appendChild(b);
    });
    boiteVar.children[0].click();
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
    bouton("Je garde celle-ci", "oui", "retenu");
    bouton("Aucune ne va", "non", "aucune");
  } else {
    bouton("Ça va", "oui", "ça va");
    bouton("Ça coince", "non", "ça coince");
  }
  bouton("Passer", "", "passé");
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

  for(const v of dits){
    if(v.option !== null && v.verdict === "retenu")
      l.push("- **" + v.titre + "** → je garde « " + v.option + " ». Pose-la et enlève les autres.");
    else if(v.option !== null)
      l.push("- **" + v.titre + "** → aucune des variantes ne va. Cherche autre chose.");
    else if(v.verdict === "ça va")
      l.push("- **" + v.titre + "** → ça va. Raye-le de `A-REGARDER.md`.");
    else
      l.push("- **" + v.titre + "** → ça coince. À reprendre.");
    if(v.mot) l.push("  > " + v.mot);
  }

  const passes = verdicts.filter(v => v.verdict === "passé");
  if(passes.length){
    l.push("");
    l.push("Pas tranché cette fois : " + passes.map(v => v.titre).join(" · ") + ".");
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
