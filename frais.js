/* ============================================================================
   LA PAGE FRAÎCHE — se rendre compte qu'on lit une vieille page.

   Hugo, le 9 août 2026, après une publication vérifiée : « Le ?juge a changé ?
   Je vois pareil qu'avant. » Le site était bien à jour. Son navigateur, non.

   ---------------------------------------------------------------------------
   LE TROU QUE L'ESTAMPILLE NE BOUCHE PAS

   `outils/version.mjs` réécrit le `?v=` de chaque script à chaque publication,
   et ça marche : une adresse qui change est une adresse que le cache ne connaît
   pas. Mais cette protection est écrite DANS `index.html` — et `index.html`,
   lui, n'a pas d'adresse qui change.

   GitHub Pages le sert avec `Cache-Control: max-age=600` (mesuré). Pendant dix
   minutes, un visiteur déjà venu reçoit l'ANCIENNE page, donc les anciennes
   adresses estampillées, donc l'ancien site — en croyant avoir rechargé. Et sur
   un téléphone, forcer un vrai rechargement n'est pas à la portée du geste.

   C'est la troisième fois que ce piège coûte du temps dans ce dépôt, et la
   première où il coûte celui d'Hugo : il a ouvert la séance pour juger, a vu les
   anciennes questions, et en a conclu que rien n'avait été publié.

   ---------------------------------------------------------------------------
   CE QU'ON FAIT

   On demande au serveur la page telle qu'elle est VRAIMENT, sans cache, et l'on
   compare son estampille à celle qu'on a chargée. Si elles diffèrent, on va
   chercher la vraie — une seule fois.

   Toute la DÉCISION est ici, sans navigateur : quelle estampille porte un texte,
   faut-il recharger, et vers quelle adresse. La page ne fait que le `fetch` et
   le saut. C'est ce qui permet d'éprouver le cas « boucle de rechargement »
   sans jamais risquer d'en provoquer une chez quelqu'un.

   ---------------------------------------------------------------------------
   LE CONTRAT

     FRAIS.estampille(texte)        l'estampille lue dans un HTML, ou null
     FRAIS.doitRecharger(a, b, fait) faut-il aller chercher la vraie page ?
     FRAIS.adresse(url, v)          l'adresse à demander, avec son cache-buster

   Rien ne lit `window`, rien ne touche au document, rien ne recharge : ce
   fichier ne peut pas, à lui seul, faire clignoter le site de qui que ce soit.
   ============================================================================ */

(function(global){
"use strict";

/* L'estampille d'un texte HTML. On prend la PREMIÈRE, parce que `version.mjs`
   les écrit toutes identiques — s'il en restait une ancienne isolée, ce serait
   un défaut de l'estampillage, pas quelque chose à rattraper ici. */
function estampille(texte){
  const m = String(texte || "").match(/\?v=([0-9a-f]{7,40})\b/);
  return m ? m[1] : null;
}

/* Faut-il recharger ?

   `dejaFait` est ce que la page a retenu de sa dernière tentative, dans la
   mémoire de session. Il est là pour une raison précise : sans lui, une page
   servie par un cache têtu — celui qui redonne la même chose après un
   rechargement — ferait clignoter le site indéfiniment. Une fois, pas deux.

   On ne recharge JAMAIS sur une réponse illisible : un serveur qui rend une
   page d'erreur, une coupure réseau, un texte tronqué n'ont aucune estampille,
   et prendre ça pour « la page a changé » serait transformer une panne
   passagère en boucle. Dans le doute, on laisse le visiteur tranquille. */
function doitRecharger(mienne, serveur, dejaFait){
  if(!mienne || !serveur) return false;      // illisible d'un côté ou de l'autre
  if(mienne === serveur) return false;       // à jour, le cas de loin le plus fréquent
  if(dejaFait === serveur) return false;     // on a déjà tenté celle-là
  return true;
}

/* L'adresse à demander. On ajoute un paramètre plutôt que d'appeler `reload()` :
   un rechargement ordinaire peut être servi par le même cache qui nous a menti,
   alors qu'une adresse jamais vue ne le peut pas.

   Le reste de l'adresse est conservé — `?juge` en particulier, sans quoi la
   manœuvre déposerait le visiteur ailleurs que là où il allait, ce qui est une
   façon plus discrète de lui faire perdre son temps. */
function adresse(url, v){
  const s = String(url || "");
  const diese = s.indexOf("#");
  const ancre = diese >= 0 ? s.slice(diese) : "";
  let base = diese >= 0 ? s.slice(0, diese) : s;
  base = base.replace(/[?&]_v=[^&]*/g, "");            // jamais deux fois le nôtre
  const sep = base.indexOf("?") >= 0 ? "&" : "?";
  return base + sep + "_v=" + v + ancre;
}

global.FRAIS = { estampille, doitRecharger, adresse };

})(typeof window !== "undefined" ? window : globalThis);
