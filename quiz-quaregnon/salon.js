/* ============================================================================
   LE SALON — comment les téléphones se parlent.

   ---------------------------------------------------------------------------
   POURQUOI PAS LA BIBLIOTHÈQUE DE GOOGLE

   Firebase propose une bibliothèque JavaScript de plusieurs centaines de
   kilo-octets, qu'il faut aller chercher sur un serveur de Google à chaque
   chargement de la page. Sa base de données sait aussi se parler en HTTP tout
   simple, et le navigateur sait déjà faire ça tout seul, depuis toujours :

     - pour écrire, une requête PUT ou PATCH sur une adresse qui finit en .json ;
     - pour suivre les changements en direct, un `EventSource`, c'est-à-dire un
       tuyau que le serveur garde ouvert et dans lequel il pousse chaque
       modification.

   Donc : aucune dépendance, rien à télécharger, le site reste un tas de
   fichiers qu'on peut ouvrir à la main. Et surtout, la moitié de ce fichier
   devient vérifiable sans navigateur et sans réseau.

   ---------------------------------------------------------------------------
   CE QUI EST ÉPROUVÉ ET CE QUI NE L'EST PAS — à dire franchement

   `outil-verif-salon.js` éprouve tout ce qui est plus bas sous le titre
   « LA PARTIE CALCULÉE » : le miroir, le tirage des codes, les points, le
   classement, l'oubli des partis. Ce sont des fonctions pures : mêmes entrées,
   mêmes sorties, aucun réseau.

   Il n'éprouve PAS que Firebase se comporte comme je le crois. Un contrôle
   écrit par moi contre une imitation écrite par moi ne prouverait que ma
   propre cohérence — c'est exactement le piège où l'on tombe deux fois. La
   forme des événements `put` et `patch` vient de la documentation de Google,
   citée dans REGLES-FIREBASE.md ; la seule preuve qu'elle est juste, c'est une
   vraie partie à deux téléphones.
   ============================================================================ */

"use strict";

const SALON = (function () {

  /* ======================================================================
     LA PARTIE CALCULÉE — pas de réseau ici, tout est éprouvable hors ligne.
     ====================================================================== */

  /* Les lettres du code d'un salon. Ni I ni O ni Q : au téléphone, on les
     confond avec 1, 0 et O, et le salon est introuvable. */
  const ALPHABET = "ABCDEFGHJKLMNPRSTUVWXYZ";

  function codeDepuis(tirage, longueur) {
    const n = longueur || 4;
    let code = "";
    for (let i = 0; i < n; i++) {
      const r = tirage();
      const j = Math.floor(r * ALPHABET.length);
      code += ALPHABET[Math.min(Math.max(j, 0), ALPHABET.length - 1)];
    }
    return code;
  }

  function copie(o) {
    return (o && typeof o === "object" && !Array.isArray(o))
      ? Object.assign({}, o) : (Array.isArray(o) ? o.slice() : {});
  }

  /* Pose une valeur à un chemin et rend le NOUVEAU miroir. On ne modifie jamais
     l'ancien sur place : c'est la maladie des deux écrivains pour une valeur,
     et elle ne se voit qu'une fois la partie commencée.

     `null` efface — c'est ainsi que Firebase supprime, et un miroir qui
     garderait la clé afficherait éternellement des joueurs déjà partis. */
  function poser(miroir, chemin, valeur) {
    const bouts = String(chemin || "/").split("/").filter(Boolean);
    if (bouts.length === 0) return valeur === null ? null : valeur;

    const racine = copie(miroir);
    let noeud = racine;
    for (let i = 0; i < bouts.length - 1; i++) {
      const k = bouts[i];
      const suite = (noeud[k] && typeof noeud[k] === "object") ? copie(noeud[k]) : {};
      noeud[k] = suite;
      noeud = suite;
    }

    const feuille = bouts[bouts.length - 1];
    if (valeur === null) delete noeud[feuille];
    else noeud[feuille] = valeur;
    return racine;
  }

  /* Applique UN événement du tuyau au miroir local, et rend le nouveau miroir.
     `ev` : { type: "put" | "patch", chemin: "/joueurs/xyz", donnee: … }

     Les clés d'un `patch` sont des CHEMINS, pas des noms. C'est ce qui permet
     au meneur de poser tous les scores d'un coup avec { "h/score": 800,
     "z/score": 550 } — et c'est aussi la subtilité qui, mal lue, faisait
     apparaître les points chez le meneur et nulle part ailleurs. */
  function appliquer(miroir, ev) {
    if (!ev) return miroir;
    if (ev.type === "put") return poser(miroir, ev.chemin, ev.donnee);
    if (ev.type !== "patch") return miroir;

    const socle = String(ev.chemin || "/").replace(/\/+$/, "");
    let courant = miroir;
    for (const cle in ev.donnee) {
      if (!Object.prototype.hasOwnProperty.call(ev.donnee, cle)) continue;
      courant = poser(courant, socle + "/" + cle, ev.donnee[cle]);
    }
    return courant;
  }

  /* Les points. Juste et vite vaut mieux que juste et lent, mais une réponse
     juste vaut toujours la moitié : on ne punit pas celui qui réfléchit. */
  function points(juste, ms, limiteMs) {
    if (!juste) return 0;
    if (!(limiteMs > 0)) return 500;
    const reste = Math.min(Math.max(1 - (ms / limiteMs), 0), 1);
    return 500 + Math.round(500 * reste);
  }

  /* Le classement. À égalité de points, l'ordre alphabétique — pas l'ordre
     d'arrivée dans la base, qui changerait d'un téléphone à l'autre et
     donnerait deux podiums différents pour la même partie. */
  function classement(joueurs) {
    const liste = [];
    for (const id in joueurs) {
      if (!Object.prototype.hasOwnProperty.call(joueurs, id)) continue;
      const j = joueurs[id] || {};
      liste.push({ id: id, nom: j.nom || "?", score: j.score || 0, rep: j.rep || null });
    }
    liste.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.nom.localeCompare(b.nom, "fr");
    });
    return liste;
  }

  /* Qui est parti sans le dire. On ne compare JAMAIS à l'horloge locale : deux
     téléphones ne sont pas à la même heure, et le meneur jetterait dehors des
     joueurs bien présents. On compare les joueurs entre eux — le plus frais
     donne l'heure. */
  function absents(joueurs, seuilMs) {
    let plusFrais = -Infinity;
    for (const id in joueurs) {
      const vu = (joueurs[id] || {}).vu;
      if (typeof vu === "number" && vu > plusFrais) plusFrais = vu;
    }
    if (plusFrais === -Infinity) return [];
    const partis = [];
    for (const id in joueurs) {
      const vu = (joueurs[id] || {}).vu;
      if (typeof vu === "number" && plusFrais - vu > seuilMs) partis.push(id);
    }
    return partis.sort();
  }

  /* Tout le monde a-t-il répondu à la manche en cours ? */
  function tousOntRepondu(joueurs, indexManche) {
    let un = false;
    for (const id in joueurs) {
      const j = joueurs[id] || {};
      un = true;
      if (!j.rep || j.rep.manche !== indexManche) return false;
    }
    return un;
  }

  /* Firebase rend un tableau quand les clés sont 0,1,2… et un objet sinon.
     Sans ce passage, une partie se casse au moment où un trou apparaît. */
  function enTableau(x) {
    if (Array.isArray(x)) return x.filter(function (v) { return v !== null && v !== undefined; });
    if (x && typeof x === "object") {
      return Object.keys(x)
        .sort(function (a, b) { return Number(a) - Number(b); })
        .map(function (k) { return x[k]; })
        .filter(function (v) { return v !== null && v !== undefined; });
    }
    return [];
  }

  /* Découpe un message du tuyau. Le format vient de la documentation de
     Firebase : un bloc `event:` puis un bloc `data:` contenant { path, data }. */
  function lireEvenement(nomEvenement, texte) {
    if (nomEvenement === "keep-alive") return null;
    if (nomEvenement === "cancel") return { type: "cancel" };
    if (nomEvenement === "auth_revoked") return { type: "cancel" };
    if (nomEvenement !== "put" && nomEvenement !== "patch") return null;
    let charge;
    try { charge = JSON.parse(texte); } catch (e) { return null; }
    if (!charge || typeof charge !== "object") return null;
    return { type: nomEvenement, chemin: charge.path || "/", donnee: charge.data };
  }

  /* ======================================================================
     LA PARTIE QUI PARLE AU RÉSEAU.
     ====================================================================== */

  /* Une vraie base Firebase est toujours en https. La machine locale fait
     exception : sans elle, la mécanique du salon ne serait éprouvable qu'en
     production, c'est-à-dire jamais avant qu'un joueur ne tombe dessus.

     L'exception est étroite à dessein : `localhost` et `127.0.0.1`, rien
     d'autre. Un `http://` vers l'extérieur reste refusé — l'adresse de la base
     passerait en clair sur le réseau. */
  function adresseAcceptable(url) {
    if (typeof url !== "string" || !url) return false;
    if (/^https:\/\/./.test(url)) return true;
    return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(url);
  }

  function configure() {
    return typeof CONFIG !== "undefined" && adresseAcceptable(CONFIG.base);
  }

  function adresse(chemin) {
    const base = String(CONFIG.base).replace(/\/+$/, "");
    return base + "/" + String(chemin).replace(/^\/+/, "") + ".json";
  }

  function envoyer(methode, chemin, valeur) {
    return fetch(adresse(chemin), {
      method: methode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valeur)
    }).then(function (r) {
      if (!r.ok) throw new Error("La base a répondu " + r.status);
      return r.json();
    });
  }

  const ecrire   = function (chemin, valeur) { return envoyer("PUT", chemin, valeur); };
  const modifier = function (chemin, valeur) { return envoyer("PATCH", chemin, valeur); };
  const effacer  = function (chemin) {
    return fetch(adresse(chemin), { method: "DELETE" });
  };
  const lire = function (chemin) {
    return fetch(adresse(chemin)).then(function (r) {
      if (!r.ok) throw new Error("La base a répondu " + r.status);
      return r.json();
    });
  };

  /* L'horloge du serveur. Chaque téléphone a la sienne, fausse à sa façon ;
     celle-là est la même pour tout le monde. */
  const MAINTENANT = { ".sv": "timestamp" };

  /* Ouvre le tuyau et rend un objet qu'on peut refermer. `surMiroir` reçoit le
     miroir complet à chaque changement. */
  function ecouter(chemin, surMiroir, surSouci) {
    let miroir = null;
    const source = new EventSource(adresse(chemin));

    function recevoir(nom) {
      return function (e) {
        const ev = lireEvenement(nom, e.data);
        if (!ev) return;
        if (ev.type === "cancel") {
          if (surSouci) surSouci(new Error("La base a fermé le tuyau."));
          return;
        }
        miroir = appliquer(miroir, ev);
        surMiroir(miroir);
      };
    }

    source.addEventListener("put", recevoir("put"));
    source.addEventListener("patch", recevoir("patch"));
    source.addEventListener("cancel", recevoir("cancel"));
    source.addEventListener("auth_revoked", recevoir("auth_revoked"));
    source.onerror = function () {
      /* EventSource se reconnecte tout seul ; on ne prévient que si la
         connexion est vraiment close. */
      if (source.readyState === 2 && surSouci) {
        surSouci(new Error("Connexion perdue."));
      }
    };

    return { fermer: function () { source.close(); } };
  }

  function nouvelIdentifiant() {
    return "j" + Math.random().toString(36).slice(2, 9);
  }

  return {
    codeDepuis: codeDepuis,
    appliquer: appliquer,
    poser: poser,
    points: points,
    classement: classement,
    absents: absents,
    tousOntRepondu: tousOntRepondu,
    enTableau: enTableau,
    lireEvenement: lireEvenement,

    configure: configure,
    adresseAcceptable: adresseAcceptable,
    adresse: adresse,
    ecrire: ecrire,
    modifier: modifier,
    effacer: effacer,
    lire: lire,
    ecouter: ecouter,
    MAINTENANT: MAINTENANT,
    nouvelIdentifiant: nouvelIdentifiant,
    ALPHABET: ALPHABET
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = { SALON };
