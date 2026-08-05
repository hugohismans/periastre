/* ============================================================================
   Le protocole de test, joué.

       http://…/?test

   `carnet.html` existe déjà et fait très bien son travail : cinq notes, trois
   questions, le matériel détecté, un rendu en Markdown qu'on copie. Mais il
   demande de se souvenir. On le remplit après coup, à froid, en reconstituant
   une impression — et ce dont on se souvient le mieux est ce qui a agacé, pas ce
   qui a manqué.

   Celui-ci pose la question AU MOMENT OÙ LA CHOSE VIENT D'ÊTRE VÉCUE. « Est-ce
   que le recul s'est senti ? » se demande à la seconde où l'on arrive, pas
   vingt minutes plus tard dans un formulaire.

   ---------------------------------------------------------------------------
   IL NE DEMANDE QUE CE QU'IL NE PEUT PAS SAVOIR

   Tout ce qui se contrôle se contrôle : `verif.js` coche seul le bloc de script,
   les clés d'interface, les quatre grandeurs du banc, la mise en page, les
   pixels non peints. Aucune de ces questions n'est posée à un humain — on ne
   fait pas travailler quelqu'un à vérifier ce qu'une machine vérifie mieux.

   Restent les questions de jugement, et elles seules : est-ce beau, est-ce
   lisible, est-ce que ça se sent. Cinq moments, pas trente.

   ---------------------------------------------------------------------------
   RIEN N'EST ENVOYÉ

   Comme `carnet.html` : pas de serveur, pas de compte, pas de traqueur. Le
   rapport se copie et s'envoie à la main, par qui l'a écrit, s'il le veut.
   ============================================================================ */

(function(global){
"use strict";

/* Les cinq moments. Chacun attend une condition — c'est le même mécanisme que
   les étapes de la quête d'accueil, qui enchaîne consigne → condition →
   réplique, et qui a fait ses preuves. */
const PISTE = [
  { id: "entree",
    attend: () => typeof salon !== "undefined" && salon.actif,
    titre: "Tu viens d'arriver à bord.",
    question: "Est-ce que tu as compris où tu es, et ce que tu regardes ?" },

  { id: "regard",
    attend: () => vuDepuis.regard > 1.2,          // on a tourné la tête d'un bon angle
    titre: "Tu as tourné la tête.",
    question: "Est-ce que ça répond bien au doigt ? Trop lent, trop vif, juste ?" },

  { id: "depart",
    attend: () => typeof TELESCOPE !== "undefined" && TELESCOPE.trajet,
    titre: "Le vaisseau est parti.",
    question: "Est-ce que tu sens qu'on s'éloigne ? Le quadrillage aide-t-il, ou gêne-t-il ?" },

  { id: "arrivee",
    attend: () => typeof TELESCOPE !== "undefined" && TELESCOPE.carte > 0.9,
    titre: "Tu es arrivé, et le trou noir a disparu.",
    question: "Est-ce qu'on comprend, sans lire, que ces orbites tournent autour de rien ?" },

  { id: "retour",
    attend: () => vuDepuis.arrivee && typeof TELESCOPE !== "undefined"
                  && !TELESCOPE.trajet && salon.actif,
    titre: "Te voilà revenu.",
    question: "Le voyage valait-il ses vingt-deux secondes ? Trop long, trop court ?" },
];

// Ce qu'on a observé du comportement, pour déclencher les moments au bon instant.
const vuDepuis = { regard: 0, arrivee: false, lacet: null };

const reponses = [];
let iEtape = 0, enAttente = false, debut = Date.now();

// ------------------------------------------------------------------ l'écran
const style = document.createElement("style");
style.textContent = `
  #essai {
    position:fixed; z-index:9; left:50%; bottom:22px; transform:translateX(-50%);
    width:min(430px, 92vw); pointer-events:auto; display:none;
    background:color-mix(in srgb, #0b0a16 94%, transparent); backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,.14); border-radius:5px; padding:15px 17px 14px;
    font-family:-apple-system, system-ui, sans-serif; color:#c7c2d9;
  }
  #essai.vu { display:block; }
  #essai .sur {
    font-family:ui-monospace, monospace; font-size:8.5px; letter-spacing:.18em;
    text-transform:uppercase; color:#ff9d4d; margin-bottom:7px;
  }
  #essai h4 { font-size:14px; font-weight:500; color:#fff; margin:0 0 4px; }
  #essai p  { font-size:12px; line-height:1.55; margin:0 0 11px; }
  #essai textarea {
    width:100%; box-sizing:border-box; min-height:52px; resize:vertical;
    background:rgba(0,0,0,.32); border:1px solid rgba(255,255,255,.12);
    border-radius:3px; color:#e4e0f0; font:inherit; font-size:12px; padding:7px 9px;
  }
  #essai .rangee { display:flex; gap:7px; margin-top:9px; }
  #essai button {
    flex:1; padding:9px 8px; cursor:pointer; border-radius:3px;
    border:1px solid rgba(255,255,255,.16); background:rgba(255,255,255,.04);
    color:#c7c2d9; font:inherit; font-size:11.5px;
  }
  #essai button:hover { background:rgba(255,255,255,.09); color:#fff; }
  #essai button.oui { border-color:rgba(110,255,180,.4); color:#8ff0c0; }
  #essai button.non { border-color:rgba(255,120,120,.4); color:#ffa8a8; }
  #essai .pas { font-family:ui-monospace, monospace; font-size:9px; color:#6b6880; margin-top:9px; }
`;
document.head.appendChild(style);

const boite = document.createElement("div");
boite.id = "essai";
boite.className = "hud";
boite.innerHTML =
  '<div class="sur"></div><h4></h4><p></p>' +
  '<textarea placeholder="Un mot, si tu veux. Facultatif."></textarea>' +
  '<div class="rangee">' +
    '<button class="oui">Ça va</button>' +
    '<button class="non">Ça coince</button>' +
    '<button class="passe">Passer</button>' +
  '</div><div class="pas"></div>';
document.body.appendChild(boite);

const q = s => boite.querySelector(s);

function pose(etape){
  q(".sur").textContent = "essai " + (iEtape + 1) + " sur " + PISTE.length;
  q("h4").textContent = etape.titre;
  q("p").textContent  = etape.question;
  q("textarea").value = "";
  q(".pas").textContent = "Rien n'est envoyé. Le rapport se copie à la fin.";
  boite.classList.add("vu");
  enAttente = true;
}

function repond(verdict){
  const e = PISTE[iEtape];
  reponses.push({ id: e.id, titre: e.titre, question: e.question,
                  verdict, mot: q("textarea").value.trim(),
                  seconde: Math.round((Date.now() - debut)/1000) });
  boite.classList.remove("vu");
  enAttente = false;
  iEtape++;
  if(iEtape >= PISTE.length) termine();
}

q(".oui").onclick   = () => repond("ça va");
q(".non").onclick   = () => repond("ça coince");
q(".passe").onclick = () => repond("passé");

/* La veille. Elle ne demande rien tant que la condition du moment n'est pas
   remplie — donc on joue normalement, et la question surgit quand elle a lieu
   d'être. */
function veille(){
  // ce qu'on observe du comportement
  if(typeof salon !== "undefined"){
    if(vuDepuis.lacet === null) vuDepuis.lacet = salon.lacet;
    vuDepuis.regard += Math.abs(salon.lacet - vuDepuis.lacet);
    vuDepuis.lacet = salon.lacet;
  }
  if(typeof TELESCOPE !== "undefined" && TELESCOPE.carte > 0.9) vuDepuis.arrivee = true;

  if(!enAttente && iEtape < PISTE.length){
    let ok = false;
    try { ok = PISTE[iEtape].attend(); } catch(e){ ok = false; }
    if(ok) pose(PISTE[iEtape]);
  }
  requestAnimationFrame(veille);
}

// ------------------------------------------------------------------ le rapport
function materiel(){
  const gl = document.createElement("canvas").getContext("webgl2");
  const d = gl && gl.getExtension("WEBGL_debug_renderer_info");
  return [
    "navigateur   " + navigator.userAgent,
    "écran        " + screen.width + " × " + screen.height +
      "   fenêtre " + innerWidth + " × " + innerHeight,
    "densité      " + (devicePixelRatio || 1) + "   points tactiles " + (navigator.maxTouchPoints || 0),
    "langue       " + (global.LANGUE || "?"),
    "graphique    " + (d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : "inconnu"),
  ].join("\n");
}

function termine(){
  /* Le harnais coche tout seul ce qui se contrôle. On ne l'a jamais demandé au
     testeur, et il apparaît ici pour que le rapport soit complet.

     Il tourne AVANT qu'on réécrive le panneau, et l'ordre compte : mesurer la
     mise en page pendant que la boîte se redispose donne un faux échec — la
     zone tactile d'un bouton en cours de placement n'est pas celle qu'il aura.
     C'est arrivé au premier essai, et c'était le harnais qui avait raison sur
     l'instant : il mesurait bien ce qu'il y avait à cet instant-là.

     Accessoirement, c'est aussi l'état juste : on veut la page telle que le
     testeur l'a laissée, pas telle que le rapport la laisse. */
  let auto = "non exécuté — charger avec ?verif&test pour l'inclure";
  if(global.VERIF){
    try { const b = global.VERIF.sain();
          // Le DÉTAIL, pas seulement le compte : « 1 échec » sans dire lequel
          // n'apprend rien à celui qui lira le rapport.
          auto = b.ok ? (b.total + " contrôles automatiques, aucun échec")
                      : (b.echoues + " ÉCHECS sur " + b.total + " contrôles automatiques :\n" +
                         b.echecs.map(x => "  · " + x.nom + " — attendu " +
                            JSON.stringify(x.attendu) + ", mesuré " + JSON.stringify(x.mesure) +
                            (x.note ? "\n      " + x.note : "")).join("\n"));
    } catch(e){ auto = "le harnais a jeté : " + e.message; }
  }

  const l = [
    "# Essai joué — Périastre",
    "",
    "**Date :** " + new Date().toLocaleString("fr-FR"),
    "**Durée :** " + Math.round((Date.now() - debut)/60000) + " min",
    "",
    "## Ce que la machine a vérifié seule",
    "```",
    auto,
    "```",
    "",
    "## Ce que seul un humain pouvait dire",
    "",
  ];
  for(const r of reponses){
    l.push("**" + r.titre + "**  — *" + r.verdict + "*, à " + r.seconde + " s");
    l.push("> " + r.question);
    if(r.mot) l.push("> ");
    if(r.mot) l.push("> « " + r.mot + " »");
    l.push("");
  }
  l.push("## Matériel");
  l.push("```");
  l.push(materiel());
  l.push("```");

  const texte = l.join("\n");
  q(".sur").textContent = "essai terminé";
  q("h4").textContent = "Merci — c'est fini.";
  q("p").textContent = "Le rapport est prêt. Copie-le et envoie-le à Hugo.";
  q("textarea").value = texte;
  q("textarea").style.minHeight = "170px";
  q(".oui").textContent = "Copier";
  q(".oui").onclick = () => {
    navigator.clipboard.writeText(texte)
      .then(() => { q(".pas").textContent = "Copié."; },
            () => { q("textarea").select(); q(".pas").textContent = "Sélectionné — copie à la main."; });
  };
  q(".non").style.display = "none";
  q(".passe").textContent = "Fermer";
  q(".passe").onclick = () => boite.classList.remove("vu");
  boite.classList.add("vu");
  global.ESSAI.rapport = texte;
}

/* `veille` et `repond` sont exposés pour que le protocole soit lui-même
   éprouvable : un script peut le dérouler d'un bout à l'autre sans qu'un doigt
   ne touche l'écran. Un protocole de test qu'on ne peut pas tester serait une
   plaisanterie. */
global.ESSAI = { PISTE, reponses, termine, veille, repond, rapport: null,
                 get etape(){ return iEtape; },
                 get enAttente(){ return enAttente; } };

requestAnimationFrame(veille);

})(window);
