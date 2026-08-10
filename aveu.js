/* ============================================================================
   L'AVEU — dire le compromis LÀ OÙ ON LE RENCONTRE.

   Hugo, le 5 août 2026 : « chaque compromis doit se déclarer là où on le
   rencontre, pas seulement dans une liste rangée ailleurs. » Un aveu global,
   dans un dossier qu'on n'ouvre pas, ne vaut rien.

   `contrat.js` fait déjà respecter beaucoup : il refuse un compromis sans lieu,
   sans aveu, dans une seule langue, ou dont l'aveu dépasse deux cents signes.
   Onze sont déclarés dans `contenu.js`, et le plancher garantit qu'aucun ne
   disparaît en silence.

   ---------------------------------------------------------------------------
   CE QUI MANQUAIT EXACTEMENT, ET C'EST TOUT L'OBJET DE CE FICHIER

   **Rien ne garantissait qu'un aveu écrit soit AFFICHÉ.**

   On pouvait déclarer un compromis dans les règles, avec son lieu et son texte
   court, satisfaire les onze contrôles de `contrat.js`, et ne jamais le poser
   nulle part. Le contrat vérifiait la DÉCLARATION ; personne ne vérifiait la
   RENCONTRE. C'est la leçon la plus chère du dépôt, écrite ailleurs dans ces
   mêmes termes : une déclaration qu'il faut lire ne répare pas ce qu'on voit.

   ---------------------------------------------------------------------------
   POURQUOI C'EST UN MODULE, ET PAS QUINZE LIGNES DANS LA PAGE

   Parce que le contrôle qui ferme la boucle a besoin de la même liste que la
   page. Si la page décidait toute seule quels aveux poser, le contrôle
   comparerait la page à elle-même — la maladie que ce dépôt traque en premier.
   Ici, le module rend la liste, la page peint, et `VERIF.aveux()` exige que ce
   qui est à l'écran corresponde à ce que le module a rendu.

   ---------------------------------------------------------------------------
   LE CONTRAT

     AVEU.LIEUX                l'ensemble des lieux connus, recopié de
                               `contrat.js` — voir plus bas pourquoi il est
                               recopié et non importé.

     AVEU.tous(contenu)        les onze compromis, à plat, dans l'ordre où on
                               les rencontre en parcourant le contenu.

     AVEU.pour(contenu, ou)    ceux d'un lieu. « partout » sort à CHAQUE lieu,
                               en plus des siens : c'est ce que le mot dit.

     AVEU.descripteur(c)       { id, aveu, titre, detail } — ce que la page a
                               besoin de peindre, et rien d'autre. Ni balise ni
                               sélecteur : la page fabrique les nœuds.

   `contenu` arrive en ARGUMENT et n'est jamais lu sur `window`. Un outil lui
   tend un contenu fabriqué et vérifie le tri sans charger le vrai site ; et le
   jour où l'anglais diverge du français, on éprouve les deux.

   ---------------------------------------------------------------------------
   LES LIEUX SONT RECOPIÉS, ET C'EST UNE DETTE ASSUMÉE

   `contrat.js` porte déjà `LIEUX_COMPROMIS`, mais il ne l'expose pas : c'est
   une constante interne à son contrôle. La recopier crée deux listes pour une
   seule vérité — exactement ce que ce dépôt refuse ailleurs.

   Elle est donc recopiée ET GARDÉE : `outil-verif-aveu.js` lit le source de
   `contrat.js`, en extrait sa liste, et exige qu'elles soient identiques. Si
   l'une bouge sans l'autre, l'outil rougit. C'est le même remède que pour la
   découpe des blocs, qui vit dans `outils/blocs.js` depuis qu'elle avait
   divergé — sauf qu'ici on ne peut pas partager le fichier sans faire dépendre
   la page d'un module de contrôle.
   ============================================================================ */

(function(global){
"use strict";

const LIEUX = new Set([
  "salon", "reglages", "reglage-temps", "telescope", "spectre",
  "recul", "arrivee-etoiles", "arrivee-soleil", "etude", "partout",
]);

/* Le contenu n'a pas de liste de compromis : ils sont SEMÉS dans l'arbre, à
   côté de ce qu'ils concernent — un réglage, une fiche, une destination. C'est
   voulu, et c'est même le fond de l'affaire : un compromis rangé dans une liste
   à part est un compromis qu'on oublie d'afficher.

   On parcourt donc l'arbre, et l'on reconnaît un compromis à ce qu'il porte À
   LA FOIS un `ou` et un `aveu`. Les deux ensemble : `ou` seul est un mot
   courant, `aveu` seul ne saurait pas où se poser. */
function tous(contenu){
  const vus = [];
  const dejaVu = new Set();
  (function marche(o){
    if(!o || typeof o !== "object") return;
    if(Array.isArray(o)){ o.forEach(marche); return; }
    if(typeof o.ou === "string" && typeof o.aveu === "string"){
      // Un même compromis peut être atteint par deux chemins de l'arbre. On le
      // rend une fois : deux badges identiques côte à côte se lisent comme un
      // défaut d'affichage, et c'en serait un.
      const cle = o.id || (o.ou + "|" + o.aveu);
      if(!dejaVu.has(cle)){ dejaVu.add(cle); vus.push(o); }
      return;
    }
    Object.values(o).forEach(marche);
  })(contenu);
  return vus;
}

/* « partout » sort à chaque lieu, en plus des siens.

   C'est ce que le mot dit, et c'est le fond du ciel : il est faux partout, pas
   seulement dans la pièce d'où on le regarde. Le traiter comme un lieu ordinaire
   le ferait n'apparaître nulle part, puisque aucun panneau ne s'appelle
   « partout » — un compromis déclaré et jamais montré, c'est-à-dire exactement
   ce que ce fichier existe pour empêcher. */
function pour(contenu, ou){
  if(!LIEUX.has(ou)) return [];
  return tous(contenu).filter(c => c.ou === ou || (ou !== "partout" && c.ou === "partout"));
}

/* Ce que la page peint, et rien de plus.

   `titre` et `detail` sont facultatifs dans le contenu : l'aveu court suffit à
   poser un badge, le reste enrichit le dépliement. On ne rend pas de balise —
   la page fabrique ses nœuds, et un contrôle peut alors exiger qu'aucun
   descripteur ne contienne de `<`, ce qui interdit d'y glisser du HTML.

   ---------------------------------------------------------------------------
   LE RENDU CHANGE CE QU'IL Y A À AVOUER — 9 août 2026

   `rendu.js` éteint la nébuleuse en mode simulation. L'aveu du fond de ciel,
   lui, continuait de dénoncer « la nébuleuse mauve » : le site avouait une
   chose qui n'était plus à l'écran. Un aveu FAUX est pire qu'un aveu absent —
   il apprend à ne plus les lire, et c'est tout ce que F4 cherchait à éviter.

   Un compromis peut donc porter `selonMode` : { <mode>: { aveu, t } }, qui
   remplace l'aveu court et le texte long quand ce mode est actif. Facultatif,
   et il le restera — presque aucun compromis ne dépend du rendu.

   Ce module ne connaît PAS la liste des modes, et c'est délibéré : il applique
   la clé qu'on lui tend. C'est `outil-verif-aveu.js` qui lit `rendu.js` et
   exige que les clés employées dans le contenu soient exactement les siennes.
   Une troisième liste de modes ici serait la maladie que ce dépôt traque. */
function descripteur(c, mode){
  const m = (mode && c.selonMode && c.selonMode[mode]) || null;
  return { id: c.id || null,
           aveu:   (m && m.aveu) || c.aveu,
           titre:  c.titre || null,
           detail: (m && m.t) || c.detail || c.texte || null };
}

/* ---------------------------------------------------------------------------
   LE CENTRE DES AVEUX — demandé le 9 août 2026

   Hugo, séance de jugement : « ça se voit pas assez, fais un genre de centre des
   notifications, ce genre d'info doit être comme une notification ».

   Le badge dans le panneau ne bouge pas — un compromis se déclare là où on le
   rencontre, c'est sa demande du 5 août et elle tient. Ce qui manquait, c'est de
   le REMARQUER : un badge posé dans un panneau qu'on a ouvert pour autre chose
   ne se lit pas. On prévient donc à l'arrivée, et l'on garde.

   La DÉCISION est ici — qu'est-ce qui est neuf, qu'est-ce qu'on annonce — pour
   qu'un contrôle puisse l'éprouver sans navigateur. La page ne fait que peindre
   et tenir la mémoire du déjà-vu. */

/* Ce qu'on n'a jamais croisé, à ce lieu-là. `vus` est un `Set` d'identifiants
   que l'appelant garde ; le module ne le modifie pas — il dit, il ne range pas.

   `partout` est ÉCARTÉ de l'annonce, et c'est délibéré : il accompagne chaque
   lieu, donc il se rappellerait à chaque arrivée. Une notification qui revient
   partout devient un bruit qu'on apprend à ignorer, ce qui est le contraire du
   but. Il reste dans le centre, et son badge reste sur chaque panneau. */
function neufs(contenu, ou, vus){
  const vu = vus || new Set();
  return pour(contenu, ou).filter(c => c.ou !== "partout" && !vu.has(c.id || c.aveu));
}

/* Ce que la bulle doit dire. Un seul compromis : deux à la fois se
   chevaucheraient, et l'on n'en lirait aucun. Le reste attend le centre — c'est
   à ça qu'il sert.

   Rend `null` quand il n'y a rien de neuf, ce qui est le cas de l'écrasante
   majorité des arrivées. */
function annonce(contenu, ou, vus, mode){
  const n = neufs(contenu, ou, vus);
  if(!n.length) return null;
  return { descripteur: descripteur(n[0], mode), reste: n.length - 1,
           ids: n.map(c => c.id || c.aveu) };
}

/* Tout le contenu du centre, groupé par lieu, dans l'ordre des lieux connus.
   Chaque entrée porte son état : croisé ou pas. C'est ce qui permet au centre de
   montrer ce qu'on n'a pas encore vu sans le cacher pour autant — un aveu qu'on
   n'a pas croisé n'est pas un secret, c'est juste un endroit où l'on n'est pas
   allé. */
function centre(contenu, vus, mode){
  const vu = vus || new Set();
  const groupes = [];
  for(const ou of LIEUX){
    const l = tous(contenu).filter(c => c.ou === ou);
    if(!l.length) continue;
    groupes.push({ ou, entrees: l.map(c => Object.assign(descripteur(c, mode),
                     { vu: vu.has(c.id || c.aveu) })) });
  }
  return groupes;
}

// Combien reste-t-il à croiser ? Le chiffre de la pastille. « partout » compte :
// il est dans le centre, donc il se compte comme les autres.
function resteAVoir(contenu, vus){
  const vu = vus || new Set();
  return tous(contenu).filter(c => !vu.has(c.id || c.aveu)).length;
}

global.AVEU = { LIEUX, tous, pour, descripteur, neufs, annonce, centre, resteAVoir };

})(window);
