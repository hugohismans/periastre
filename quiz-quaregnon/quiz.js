/* ============================================================================
   LE JEU.

   Une seule loi pour les deux modes : seul ou à plusieurs, c'est le même tirage
   de questions, le même mélange des réponses, le même barème. Un quiz où l'on
   marque plus de points tout seul qu'en salon serait un quiz à deux règles, et
   deux règles pour une même chose finissent toujours par se contredire.

   Ce qui est en haut du fichier — le tirage, le mélange, la mention finale —
   ne touche ni au DOM ni au réseau, et `outil-verif-quiz.js` s'en sert
   directement. Ce qui est en bas ne s'exécute que dans un navigateur.
   ============================================================================ */

"use strict";

/* ==========================================================================
   LA PARTIE CALCULÉE
   ========================================================================== */

/* Mélange de Fisher-Yates. `alea` est passé de l'extérieur pour qu'un contrôle
   puisse lui donner une suite connue et vérifier le résultat. */
function melanger(tableau, alea) {
  const t = tableau.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    const g = t[i]; t[i] = t[j]; t[j] = g;
  }
  return t;
}

/* Le tirage d'une partie.

   Il répartit les questions entre les thèmes demandés au lieu de tirer au
   hasard dans le tas : sans ça, une partie de dix questions tombait trois fois
   sur quatre entièrement sur Quaregnon, qui est le thème le plus fourni, et le
   borain ne sortait jamais. */
function choisirQuestions(banque, niveaux, themes, combien, alea) {
  const retenues = banque.filter(function (q) {
    return niveaux.indexOf(q.niveau) !== -1 && themes.indexOf(q.theme) !== -1;
  });
  if (retenues.length === 0) return [];

  const paquets = {};
  themes.forEach(function (t) { paquets[t] = []; });
  retenues.forEach(function (q) { paquets[q.theme].push(q); });

  const dispo = themes.filter(function (t) { return paquets[t].length > 0; });
  dispo.forEach(function (t) { paquets[t] = melanger(paquets[t], alea); });

  const tirees = [];
  let tour = 0;
  while (tirees.length < combien && tirees.length < retenues.length) {
    const theme = dispo[tour % dispo.length];
    if (paquets[theme].length > 0) tirees.push(paquets[theme].pop());
    tour++;
    if (tour > retenues.length * 2 + dispo.length) break;
  }
  return melanger(tirees, alea).slice(0, combien);
}

/* Les milliers séparés par une espace FINE INSÉCABLE — U+202F, celle que la
   typographie française demande. « 10000 points » se lit mal ; une espace
   ordinaire, elle, laisserait le nombre se couper en fin de ligne. Le
   caractère ci-dessous est indiscernable d'une espace normale à l'œil : ne pas
   le retaper au clavier, et se fier au contrôle qui le distingue. */
const FINE = "\u202F";

function nombre(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, FINE);
}

/* Le pluriel. « 1 bonnes réponses » sur l'écran de fin, c'est la faute que
   personne ne relit et que tout le monde voit. */
function accord(n, singulier, pluriel) {
  return n > 1 ? (pluriel !== undefined ? pluriel : singulier + "s") : singulier;
}

/* La mention finale, sur cent. */
function mention(pourcent) {
  if (pourcent >= 100) return "Sans faute. Tu es né rue du Coron.";
  if (pourcent >= 80)  return "Quaregnonnais pur jus.";
  if (pourcent >= 60)  return "Bon Borain.";
  if (pourcent >= 40)  return "Tu connais le chemin de Mons.";
  if (pourcent >= 20)  return "Touriste appliqué.";
  return "Il va falloir revenir.";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { melanger: melanger, choisirQuestions: choisirQuestions,
                     mention: mention, nombre: nombre, accord: accord };
}

/* ==========================================================================
   LA PARTIE QUI S'AFFICHE — rien ici hors d'un navigateur.
   ========================================================================== */

if (typeof document !== "undefined") (function () {

  const $ = function (id) { return document.getElementById(id); };
  const LETTRES = ["A", "B", "C", "D", "E", "F"];

  const etat = {
    niveaux: [1, 2, 3],
    themes: Object.keys(THEMES),
    mode: "solo",
    liste: [], i: 0, score: 0, justes: 0,
    ordre: [0, 1, 2, 3], repondu: false, debut: 0, minuteur: null,

    code: null, moi: null, hote: false, miroir: null,
    tuyau: null, battement: null, gardien: null, mancheVue: -1, etatVu: null
  };

  const LIMITE = function () { return (CONFIG.secondesParQuestion || 25) * 1000; };
  const COMBIEN = function () { return CONFIG.questionsParPartie || 10; };

  /* ------------------------------------------------------------- écrans */

  function montrer(id) {
    ["accueil", "multi", "salle", "jeu", "fin"].forEach(function (e) {
      $(e).classList.toggle("actif", e === id);
    });
    window.scrollTo(0, 0);
  }

  function dire(ouId, texte, genre) {
    const n = $(ouId);
    n.textContent = texte || "";
    n.className = "etat" + (texte ? " visible " + (genre || "info") : "");
  }

  /* ------------------------------------------------- réglages de l'accueil */

  function souvenir() {
    try {
      localStorage.setItem("quiz-quaregnon", JSON.stringify({
        niveaux: etat.niveaux, themes: etat.themes
      }));
    } catch (e) { /* navigation privée : tant pis, on joue quand même */ }
  }

  function rappel() {
    try {
      const b = JSON.parse(localStorage.getItem("quiz-quaregnon") || "null");
      if (b && Array.isArray(b.niveaux) && b.niveaux.length) etat.niveaux = b.niveaux;
      if (b && Array.isArray(b.themes) && b.themes.length) etat.themes = b.themes;
    } catch (e) { /* idem */ }
  }

  function bascule(liste, valeur) {
    const i = liste.indexOf(valeur);
    if (i === -1) liste.push(valeur);
    else if (liste.length > 1) liste.splice(i, 1);   /* jamais tout éteindre */
    return liste;
  }

  function peindreReglages() {
    const zn = $("choix-niveaux");
    zn.innerHTML = "";
    NIVEAUX.forEach(function (niv) {
      const b = document.createElement("button");
      b.className = "pastille";
      b.setAttribute("aria-pressed", etat.niveaux.indexOf(niv.n) !== -1);
      b.innerHTML = "<b>" + niv.nom + "</b><span>" + niv.sous + "</span>";
      b.onclick = function () {
        bascule(etat.niveaux, niv.n); souvenir(); peindreReglages();
      };
      zn.appendChild(b);
    });

    const zt = $("choix-themes");
    zt.innerHTML = "";
    Object.keys(THEMES).forEach(function (cle) {
      const b = document.createElement("button");
      b.className = "pastille";
      b.setAttribute("aria-pressed", etat.themes.indexOf(cle) !== -1);
      b.textContent = THEMES[cle].nom;
      b.onclick = function () {
        bascule(etat.themes, cle); souvenir(); peindreReglages();
      };
      zt.appendChild(b);
    });

    const n = QUESTIONS.filter(function (q) {
      return etat.niveaux.indexOf(q.niveau) !== -1 && etat.themes.indexOf(q.theme) !== -1;
    }).length;
    $("compte-questions").textContent =
      n + " " + accord(n, "question") + " " + accord(n, "correspond", "correspondent")
      + " à ces réglages" + (n < COMBIEN() ? " — la partie sera plus courte." : ".");
    $("b-solo").disabled = n === 0;
    $("b-multi").disabled = n === 0;
  }

  /* --------------------------------------------------------- une question */

  function questionParId(id) {
    for (let i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].id === id) return QUESTIONS[i];
    return null;
  }

  function poser(q, ordre, numero, total) {
    etat.repondu = false;
    etat.ordre = ordre;
    etat.debut = Date.now();

    $("compteur").textContent = "Question " + numero + " / " + total;
    const th = THEMES[q.theme];
    const et = $("etiquette");
    et.textContent = th.nom;
    et.style.background = th.couleur + "26";
    et.style.color = th.couleur;
    $("enonce").textContent = q.q;
    $("verdict").innerHTML = "";
    $("b-suite").style.display = "none";

    const zone = $("reponses");
    zone.innerHTML = "";
    ordre.forEach(function (indexVrai, place) {
      const b = document.createElement("button");
      b.className = "reponse";
      b.innerHTML = '<span class="lettre">' + LETTRES[place] + "</span><span></span>";
      b.lastChild.textContent = q.r[indexVrai];
      b.onclick = function () { repondre(place); };
      zone.appendChild(b);
    });

    lancerJauge();
    montrer("jeu");
  }

  function lancerJauge() {
    arreterJauge();
    const barre = $("jauge").firstElementChild;
    const debut = Date.now();
    etat.minuteur = setInterval(function () {
      const passe = Date.now() - debut;
      const reste = Math.max(0, 1 - passe / LIMITE());
      barre.style.transform = "scaleX(" + reste + ")";
      $("jauge").classList.toggle("urgent", reste < 0.25);
      if (reste <= 0) {
        arreterJauge();
        if (!etat.repondu) repondre(-1);
      }
    }, 100);
  }

  function arreterJauge() {
    if (etat.minuteur) { clearInterval(etat.minuteur); etat.minuteur = null; }
  }

  function repondre(place) {
    if (etat.repondu) return;
    etat.repondu = true;
    arreterJauge();

    const ms = Date.now() - etat.debut;
    const q = etat.liste[etat.i];
    const juste = place >= 0 && etat.ordre[place] === q.bonne;

    if (etat.mode === "multi") {
      SALON.ecrire("salons/" + etat.code + "/joueurs/" + etat.moi + "/rep",
        { manche: etat.i, choix: place, ms: ms })["catch"](function () {});
      marquerReponses(place, q);
      $("verdict").innerHTML =
        '<div class="verdict"><h3>Réponse envoyée</h3>'
        + "<p>On attend les autres…</p></div>";
      return;
    }

    const gagne = SALON.points(juste, ms, LIMITE());
    etat.score += gagne;
    if (juste) etat.justes++;
    $("tableau-score").innerHTML = "<b>" + nombre(etat.score) + "</b> points";

    marquerReponses(place, q);
    peindreVerdict(q, juste, gagne);
    $("b-suite").style.display = "block";
    $("b-suite").textContent = (etat.i + 1 < etat.liste.length) ? "Suite" : "Voir le résultat";
    $("b-suite").onclick = suiteSolo;
  }

  function marquerReponses(place, q) {
    const boutons = $("reponses").children;
    for (let k = 0; k < boutons.length; k++) {
      boutons[k].disabled = true;
      if (etat.ordre[k] === q.bonne) boutons[k].classList.add("juste");
      else if (k === place) boutons[k].classList.add("fausse");
      else boutons[k].classList.add("terne");
    }
  }

  function peindreVerdict(q, juste, gagne) {
    const src = (q.sources || []).map(function (cle) {
      const s = SOURCES[cle];
      if (!s) return "";
      return '<a href="' + s.lien + '" target="_blank" rel="noopener">'
           + s.titre + " — " + s.ou + "</a>";
    }).filter(Boolean).join(" · ");

    $("verdict").innerHTML =
      '<div class="verdict">'
      + '<h3 class="' + (juste ? "oui" : "non") + '">'
      + (juste ? "Juste — " + gagne + " points" : "Raté") + "</h3>"
      + "<p>" + q.pourquoi + "</p>"
      + (src ? "<p>" + src + "</p>" : "")
      + "</div>";
  }

  /* ----------------------------------------------------------- le solo */

  function demarrerSolo() {
    etat.mode = "solo";
    etat.liste = choisirQuestions(QUESTIONS, etat.niveaux, etat.themes,
                                  COMBIEN(), Math.random);
    etat.i = 0; etat.score = 0; etat.justes = 0;
    $("tableau-score").innerHTML = "<b>0</b> points";
    $("liste-jeu").innerHTML = "";
    poserCourante();
  }

  function poserCourante() {
    const q = etat.liste[etat.i];
    poser(q, melanger([0, 1, 2, 3].slice(0, q.r.length), Math.random),
          etat.i + 1, etat.liste.length);
  }

  function suiteSolo() {
    etat.i++;
    if (etat.i >= etat.liste.length) return finirSolo();
    poserCourante();
  }

  function finirSolo() {
    const max = etat.liste.length * 1000;
    const pourcent = etat.liste.length
      ? Math.round(100 * etat.justes / etat.liste.length) : 0;
    $("titre-fin").textContent = "Fini";
    $("score-final").textContent = nombre(etat.score);
    $("score-sur").textContent =
      "points sur " + nombre(max) + " — " + etat.justes + " "
      + accord(etat.justes, "bonne réponse", "bonnes réponses")
      + " sur " + etat.liste.length;
    $("mention").textContent = mention(pourcent);
    $("podium").innerHTML = "";
    montrer("fin");
  }

  /* ------------------------------------------------------ le multijoueur */

  function ouvrirMulti() {
    if (!SALON.configure()) {
      dire("etat-multi",
        "Le multijoueur n'est pas encore branché : il manque l'adresse de la "
        + "base dans le fichier config.js. Tout est écrit dedans, il n'y a "
        + "qu'une ligne à remplir.", "souci");
      $("b-creer").disabled = true;
      $("b-rejoindre").disabled = true;
    } else {
      dire("etat-multi", "");
      $("b-creer").disabled = false;
      $("b-rejoindre").disabled = false;
    }
    const dansLien = new URLSearchParams(location.search).get("salon");
    if (dansLien) $("champ-code").value = dansLien.toUpperCase().slice(0, 4);
    montrer("multi");
  }

  function creerSalon() {
    const nom = ($("champ-nom").value || "").trim() || "Le meneur";
    const code = SALON.codeDepuis(Math.random, 4);
    etat.mode = "multi"; etat.hote = true;
    etat.code = code; etat.moi = SALON.nouvelIdentifiant();

    const salon = {
      cree: SALON.MAINTENANT,
      hote: etat.moi,
      etat: "attente",
      joueurs: {}
    };
    salon.joueurs[etat.moi] = { nom: nom, score: 0, vu: SALON.MAINTENANT };

    dire("etat-multi", "Ouverture…", "info");
    SALON.ecrire("salons/" + code, salon).then(function () {
      entrerDansSalle();
    })["catch"](function (e) {
      dire("etat-multi", "Impossible d'ouvrir le salon : " + e.message
        + " — vérifie l'adresse dans config.js et que la base est bien en mode test.",
        "souci");
    });
  }

  function rejoindreSalon() {
    const code = ($("champ-code").value || "").trim().toUpperCase();
    const nom = ($("champ-nom").value || "").trim();
    if (code.length !== 4) return dire("etat-multi", "Le code fait quatre lettres.", "souci");
    if (!nom) return dire("etat-multi", "Il me faut ton prénom.", "souci");

    dire("etat-multi", "On frappe à la porte…", "info");
    SALON.lire("salons/" + code).then(function (salon) {
      if (!salon) throw new Error("Aucun salon avec ce code.");
      if (salon.etat && salon.etat !== "attente") {
        throw new Error("La partie a déjà commencé dans ce salon.");
      }
      etat.mode = "multi"; etat.hote = false;
      etat.code = code; etat.moi = SALON.nouvelIdentifiant();
      return SALON.ecrire("salons/" + code + "/joueurs/" + etat.moi,
        { nom: nom, score: 0, vu: SALON.MAINTENANT });
    }).then(function () {
      entrerDansSalle();
    })["catch"](function (e) {
      dire("etat-multi", e.message, "souci");
    });
  }

  function entrerDansSalle() {
    dire("etat-multi", "");
    $("affiche-code").textContent = etat.code;
    const lien = location.origin + location.pathname + "?salon=" + etat.code;
    $("affiche-lien").innerHTML = "ou ce lien : <br>" + lien;
    $("b-lancer").style.display = etat.hote ? "block" : "none";
    $("aide-lancer").textContent = etat.hote
      ? "C'est toi qui mènes : la partie avance quand tu appuies."
      : "On attend que le meneur lance la partie.";
    montrer("salle");

    etat.tuyau = SALON.ecouter("salons/" + etat.code, surMiroir, function (e) {
      dire("etat-salle", e.message, "souci");
    });

    etat.battement = setInterval(function () {
      SALON.modifier("salons/" + etat.code + "/joueurs/" + etat.moi,
        { vu: SALON.MAINTENANT })["catch"](function () {});
    }, 8000);

    if (etat.hote) {
      etat.gardien = setInterval(function () {
        const j = (etat.miroir || {}).joueurs || {};
        const partis = SALON.absents(j, (CONFIG.secondesAvantOubli || 45) * 1000);
        partis.forEach(function (id) {
          if (id !== etat.moi) SALON.effacer("salons/" + etat.code + "/joueurs/" + id);
        });
      }, 15000);
    }

    window.addEventListener("beforeunload", quitterVite);
  }

  function quitterVite() {
    if (!etat.code || !etat.moi) return;
    try {
      fetch(SALON.adresse("salons/" + etat.code + "/joueurs/" + etat.moi),
        { method: "DELETE", keepalive: true });
    } catch (e) { /* on part, tant pis */ }
  }

  function quitterSalon() {
    quitterVite();
    if (etat.tuyau) { etat.tuyau.fermer(); etat.tuyau = null; }
    if (etat.battement) { clearInterval(etat.battement); etat.battement = null; }
    if (etat.gardien) { clearInterval(etat.gardien); etat.gardien = null; }
    if (etat.hote && etat.code) SALON.effacer("salons/" + etat.code);
    arreterJauge();
    etat.code = null; etat.moi = null; etat.hote = false; etat.miroir = null;
    etat.mancheVue = -1; etat.etatVu = null;
    window.removeEventListener("beforeunload", quitterVite);
    montrer("accueil");
  }

  /* Le cœur du multijoueur : à chaque changement dans la base, on redessine. */
  function surMiroir(salon) {
    etat.miroir = salon;
    if (!salon) { dire("etat-salle", "Le salon a été fermé.", "souci"); return; }

    const joueurs = salon.joueurs || {};
    peindreJoueurs("liste-attente", joueurs, false);
    peindreJoueurs("liste-jeu", joueurs, salon.etat === "question");

    if (etat.hote) {
      $("b-lancer").disabled = SALON.classement(joueurs).length < 1;
    }

    if (salon.etat === "attente") {
      if (etat.etatVu !== "attente") { montrer("salle"); etat.mancheVue = -1; }
      etat.etatVu = "attente";
      return;
    }

    if (salon.etat === "question" && salon.manche) {
      if (etat.mancheVue !== salon.manche.i) {
        etat.mancheVue = salon.manche.i;
        const q = questionParId(salon.manche.id);
        if (q) {
          const total = SALON.enTableau((salon.reglages || {}).liste).length;
          poser(q, SALON.enTableau(salon.manche.ordre), salon.manche.i + 1, total);
          etat.i = salon.manche.i;
          etat.liste[salon.manche.i] = q;
          const moi = joueurs[etat.moi] || {};
          $("tableau-score").innerHTML = "<b>" + nombre(moi.score || 0) + "</b> points";
        }
      }
      if (etat.hote && SALON.tousOntRepondu(joueurs, salon.manche.i)) reveler();
      etat.etatVu = "question";
      return;
    }

    if (salon.etat === "revelation" && salon.manche) {
      if (etat.etatVu !== "revelation") {
        etat.etatVu = "revelation";
        arreterJauge();
        const q = questionParId(salon.manche.id);
        const moi = joueurs[etat.moi] || {};
        const rep = moi.rep && moi.rep.manche === salon.manche.i ? moi.rep : null;
        const place = rep ? rep.choix : -1;
        etat.ordre = SALON.enTableau(salon.manche.ordre);
        const juste = place >= 0 && etat.ordre[place] === q.bonne;
        etat.repondu = true;
        marquerReponses(place, q);
        peindreVerdict(q, juste, juste ? SALON.points(true, rep.ms, LIMITE()) : 0);
        $("tableau-score").innerHTML = "<b>" + nombre(moi.score || 0) + "</b> points";

        const total = SALON.enTableau((salon.reglages || {}).liste).length;
        const b = $("b-suite");
        if (etat.hote) {
          b.style.display = "block";
          b.disabled = false;
          b.textContent = (salon.manche.i + 1 < total) ? "Suite" : "Voir le classement";
          b.onclick = function () { b.disabled = true; suiteHote(); };
        } else {
          b.style.display = "block";
          b.disabled = true;
          b.textContent = "On attend le meneur…";
        }
      }
      return;
    }

    if (salon.etat === "fin") {
      if (etat.etatVu !== "fin") { etat.etatVu = "fin"; finirMulti(joueurs); }
    }
  }

  function peindreJoueurs(ouId, joueurs, montrerAttente) {
    const ul = $(ouId);
    const rangs = SALON.classement(joueurs);
    ul.innerHTML = "";
    rangs.forEach(function (j) {
      const li = document.createElement("li");
      if (j.id === etat.moi) li.className = "moi";
      const nom = document.createElement("span");
      nom.textContent = j.nom + (j.id === (etat.miroir || {}).hote ? " ·  meneur" : "");
      li.appendChild(nom);
      const d = document.createElement("span");
      if (montrerAttente) {
        const manche = ((etat.miroir || {}).manche || {}).i;
        const a = j.rep && j.rep.manche === manche;
        d.className = a ? "ok" : "att";
        d.textContent = a ? "a répondu" : "réfléchit…";
      } else {
        d.className = "pts";
        d.textContent = nombre(j.score) + " pts";
      }
      li.appendChild(d);
      ul.appendChild(li);
    });
  }

  function lancerPartie() {
    const tirees = choisirQuestions(QUESTIONS, etat.niveaux, etat.themes,
                                    COMBIEN(), Math.random);
    if (!tirees.length) return;
    etat.liste = tirees;
    const ids = tirees.map(function (q) { return q.id; });

    const remiseAZero = {};
    const joueurs = (etat.miroir || {}).joueurs || {};
    for (const id in joueurs) {
      remiseAZero[id + "/score"] = 0;
      remiseAZero[id + "/rep"] = null;
    }

    SALON.modifier("salons/" + etat.code + "/joueurs", remiseAZero)
      .then(function () {
        return SALON.ecrire("salons/" + etat.code + "/reglages",
          { liste: ids, limite: LIMITE() });
      })
      .then(function () { return mancheHote(0); })
      ["catch"](function (e) { dire("etat-salle", e.message, "souci"); });
  }

  function mancheHote(i) {
    const q = etat.liste[i];
    const ordre = melanger([0, 1, 2, 3].slice(0, q.r.length), Math.random);
    return SALON.ecrire("salons/" + etat.code + "/manche",
      { i: i, id: q.id, ordre: ordre })
      .then(function () {
        return SALON.ecrire("salons/" + etat.code + "/etat", "question");
      })
      .then(function () {
        /* Le filet : si quelqu'un ne répond jamais, la manche se ferme seule. */
        setTimeout(function () {
          const s = etat.miroir || {};
          if (s.etat === "question" && s.manche && s.manche.i === i) reveler();
        }, LIMITE() + 1500);
      });
  }

  function reveler() {
    const salon = etat.miroir || {};
    if (salon.etat !== "question" || !salon.manche) return;
    const q = questionParId(salon.manche.id);
    if (!q) return;
    const ordre = SALON.enTableau(salon.manche.ordre);
    const joueurs = salon.joueurs || {};
    const limite = (salon.reglages || {}).limite || LIMITE();

    const maj = {};
    for (const id in joueurs) {
      const j = joueurs[id] || {};
      const rep = (j.rep && j.rep.manche === salon.manche.i) ? j.rep : null;
      const juste = !!rep && rep.choix >= 0 && ordre[rep.choix] === q.bonne;
      maj[id + "/score"] = (j.score || 0) + SALON.points(juste, rep ? rep.ms : limite, limite);
    }

    SALON.modifier("salons/" + etat.code + "/joueurs", maj)
      .then(function () {
        return SALON.ecrire("salons/" + etat.code + "/etat", "revelation");
      })["catch"](function () {});
  }

  function suiteHote() {
    const salon = etat.miroir || {};
    const total = SALON.enTableau((salon.reglages || {}).liste).length;
    const suivant = (salon.manche || {}).i + 1;
    if (suivant >= total) {
      SALON.ecrire("salons/" + etat.code + "/etat", "fin")["catch"](function () {});
      return;
    }
    mancheHote(suivant);
  }

  function finirMulti(joueurs) {
    arreterJauge();
    const rangs = SALON.classement(joueurs);
    const moi = rangs.filter(function (j) { return j.id === etat.moi; })[0];
    const total = SALON.enTableau(((etat.miroir || {}).reglages || {}).liste).length;

    $("titre-fin").textContent = "Le classement";
    $("score-final").textContent = nombre(moi ? moi.score : 0);
    $("score-sur").textContent = "points sur " + nombre(total * 1000);
    $("mention").textContent = rangs.length && rangs[0].id === etat.moi
      ? "Premier. Personne ne discute."
      : mention(moi && total ? Math.round(100 * moi.score / (total * 1000)) : 0);

    const ul = $("podium");
    ul.innerHTML = "";
    rangs.forEach(function (j, k) {
      const li = document.createElement("li");
      const r = document.createElement("span");
      r.className = "rang"; r.textContent = (k + 1);
      const n = document.createElement("span");
      n.className = "nom"; n.textContent = j.nom + (j.id === etat.moi ? " (toi)" : "");
      const p = document.createElement("span");
      p.className = "pts"; p.textContent = nombre(j.score);
      li.appendChild(r); li.appendChild(n); li.appendChild(p);
      ul.appendChild(li);
    });
    montrer("fin");
  }

  /* ------------------------------------------------------------- démarrage */

  /* Si une vraie photo est déposée dans images/, elle passe devant le dessin.
     On ne l'impose pas : tant que le fichier n'existe pas, rien ne casse et
     rien ne clignote. */
  function chercherPhoto() {
    const img = new Image();
    img.onload = function () {
      document.body.style.setProperty("--photo-fond", 'url("images/fond.jpg")');
      document.body.classList.add("avec-photo");
    };
    img.src = "images/fond.jpg";
  }

  rappel();
  peindreReglages();
  chercherPhoto();
  $("pied-compte").textContent =
    QUESTIONS.length + " questions, "
    + Object.keys(SOURCES).length + " sources.";

  $("b-solo").onclick = demarrerSolo;
  $("b-multi").onclick = ouvrirMulti;
  $("b-retour-accueil").onclick = function () { montrer("accueil"); };
  $("b-creer").onclick = creerSalon;
  $("b-rejoindre").onclick = rejoindreSalon;
  $("b-quitter-salle").onclick = quitterSalon;
  $("b-lancer").onclick = lancerPartie;
  $("b-rejouer").onclick = function () {
    if (etat.mode === "multi" && etat.hote) {
      SALON.ecrire("salons/" + etat.code + "/etat", "attente")["catch"](function () {});
      etat.etatVu = null;
    } else if (etat.mode === "multi") {
      montrer("salle");
    } else {
      demarrerSolo();
    }
  };
  $("b-accueil-fin").onclick = function () {
    if (etat.mode === "multi") quitterSalon();
    else montrer("accueil");
  };

  /* Un lien ?salon=ABCD emmène directement à la porte du salon. */
  if (new URLSearchParams(location.search).get("salon")) ouvrirMulti();

  /* Répondre au clavier : A, B, C, D — ou 1, 2, 3, 4. */
  document.addEventListener("keydown", function (e) {
    if (!$("jeu").classList.contains("actif") || etat.repondu) return;
    const k = e.key.toUpperCase();
    let place = LETTRES.indexOf(k);
    if (place === -1 && /^[1-6]$/.test(k)) place = Number(k) - 1;
    if (place >= 0 && place < $("reponses").children.length) {
      e.preventDefault();
      repondre(place);
    }
  });

})();
