/* ============================================================================
   Le voyage à 1 g.

   Une seule fiction, déclarée : le vaisseau tient une accélération propre de
   1 g aussi longtemps qu'il faut. On n'explique pas comment. Tout le reste —
   les durées, le retournement, l'écart entre les deux horloges — sort des
   équations et ne se négocie pas.

   ---------------------------------------------------------------------------
   LA FORMULE

   Pour un trajet où l'on accélère la première moitié puis freine la seconde,
   à accélération propre constante `a`, sur une distance `d` :

       temps propre         τ = (2c/a) · arcosh( a·d / 2c² + 1 )
       temps du départ      t = (2c/a) · sinh( a·τ / 2c )

   Attention au facteur : chaque moitié du trajet couvre d/2, et une phase
   d'accélération seule vaut (c/a)·arcosh(a·s/c² + 1). Le doubler donne la
   forme ci-dessus. Je m'étais trompé une première fois en écrivant 4c/a, ce
   qui donne un temps trop long d'un facteur √2 — l'erreur est invisible à
   l'œil et saute immédiatement au contrôle newtonien, où τ doit tendre vers
   2·√(d/a).

   La dépendance de τ en `d` est logarithmique, et c'est tout l'intérêt : les
   distances vont de un à un million entre le voisinage du trou noir et le
   système solaire, les durées vécues de quelques mois à quelques décennies.
   C'est ce rapport-là qui fait comprendre pourquoi la galaxie est hors
   d'atteinte — bien mieux qu'une phrase.

   ---------------------------------------------------------------------------
   CE QUE ÇA COÛTERAIT VRAIMENT

   Accorder le moteur sans dire son prix serait de la magie molle. Une fusée
   idéale, à conversion parfaite masse-énergie, demande un rapport de masses
   e^(2Δη) où Δη est la rapidité accumulée. Jusqu'au centre galactique cela
   donne des centaines de milliers de tonnes par kilogramme arrivé.

   On accorde donc le moteur, et l'on dit pourquoi personne ne le construira.
   ============================================================================ */

(function(global){
"use strict";

const C   = 299792458;          // m/s
const G_N = 9.80665;            // m/s², l'accélération de référence
const AL  = 9.4607304725808e15; // mètres dans une année-lumière
const AN  = 365.25 * 86400;     // secondes dans une année julienne
const UA  = 1.495978707e11;     // mètres dans une unité astronomique

/* Durées d'un trajet accélération-puis-freinage.
   @param d_m  distance, en mètres
   @param a    accélération propre, en m/s² (1 g par défaut)
   Rend les deux durées en secondes, plus la rapidité et le facteur de Lorentz
   atteints au demi-tour. */
function trajet(d_m, a){
  a = a || G_N;
  const k = a*d_m / (2*C*C);
  // `acosh(k+1)` perd ses chiffres quand k est petit — voir la note de
  // `phaseDepuisDistance`. Aux distances interstellaires k est énorme et rien
  // ne change ; sur un trajet court, tout change.
  const tau = (4*C/a) * Math.asinh(Math.sqrt(k/2)); // vécu à bord
  const t   = (2*C/a) * Math.sinh(a*tau/(2*C));     // écoulé au départ
  const eta = a*tau/(2*C);                          // rapidité au demi-tour
  return { tau, t, eta, gamma: Math.cosh(eta), vmax: Math.tanh(eta) };
}

/* Le prix en carburant d'une fusée idéale, en masse initiale par masse finale.
   Une fusée à conversion parfaite change sa rapidité de Δη en dépensant un
   rapport de masses e^(Δη). Un aller simple accélère jusqu'à η puis freine de
   η, soit Δη = 2η. C'est une borne INFÉRIEURE, et aucune technologie connue
   n'en approche : elle suppose que toute la masse devient de l'énergie et
   qu'elle sort exactement à l'arrière. */
function rapportDeMasses(eta){ return Math.exp(2*eta); }

// Un exposant en vrais chiffres supérieurs : « 10^8 » est une notation de
// clavier, pas de typographie, et le site en affiche partout ailleurs.
const CHIFFRES_HAUT = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const exposant = n => String(n).split("")
  .map(c => c === "-" ? "⁻" : (CHIFFRES_HAUT[+c] || c)).join("");

/* Les unités et la ponctuation des nombres suivent la langue.

   Le français met une virgule décimale et sépare les milliers d'une espace ;
   l'anglais fait l'inverse. Une durée affichée « 7.7 jours » ou « 7,7 days »
   est fautive des deux côtés, et cela se voit tout de suite.

   Les mots sont pris dans `window.UI` s'il est là, avec le français en repli —
   le module reste donc utilisable seul, y compris dans le banc d'essai qui
   n'ouvre aucune page. */
function mot(cle, repli){
  return (typeof window !== "undefined" && window.UI && window.UI["u." + cle]) || repli;
}
function enAnglais(){
  return typeof window !== "undefined" && window.UI && window.UI["u.langue"] === "en";
}
function nombre(x, d){
  const s = x.toFixed(d);
  return enAnglais() ? s : s.replace(".", ",");
}
/* La convention régionale vient des chaînes, elle n'est pas écrite ici.

   Elle l'était — « en-US » en dur — alors que l'interface avait choisi
   « en-GB ». Sans conséquence sur les nombres, où les deux s'accordent, mais
   c'était deux sources d'autorité pour une seule décision : le jour où l'on
   ajoute une date ou une troisième langue, elles divergent en silence. */
function millier(x){
  return Math.round(x).toLocaleString(mot("locale", enAnglais() ? "en-GB" : "fr-FR"));
}
// Le pluriel part de deux en français comme en anglais pour ces unités-ci.
const pluriel = (n, s) => n >= 2 ? s + mot("pluriel", "s") : s;

const joli = {
  /* Exposé le 7 août pour le bandeau de vol. C'est `nombre` qui met la virgule
     ou le point selon la langue : le formater à la main ailleurs redonnerait
     « 0.998 c » en français, faute que le site a déjà payée sur les unités. */
  nombre,
  /* La vitesse en fraction de c. Près de la limite, « 1,000 c » serait un
     mensonge d'arrondi : on bascule sur ce qui MANQUE à la vitesse de la
     lumière, seule façon honnête d'écrire 0,999999997. */
  vitesse(beta){
    if(beta > 0.9995){
      /* Le remplacement de chaîne d'avant rendait « c − 4.1·10⁻4 » : point
         décimal anglais en français, et exposant en chiffres ordinaires alors
         que `masses` et le reste du site les mettent en haut. On le lisait
         pendant presque tout le voyage vers le système solaire, où le vaisseau
         passe l'essentiel du trajet au-dessus de ce seuil. */
      const [mantisse, puissance] = (1 - beta).toExponential(1).split("e");
      return "c − " + nombre(+mantisse, 1) + "·10" + exposant(+puissance);
    }
    return nombre(beta, beta < 0.01 ? 4 : 3) + " c";
  },
  dilatation(gamma){ return "× " + nombre(gamma, gamma < 10 ? 3 : 0); },
  duree(s){
    const an = s/AN;
    /* LE SÉPARATEUR DES MILLIERS. Il manquait, et personne ne l'avait vu parce
       qu'aucun trajet n'atteignait mille ans : le voyage vers le système
       solaire en compte vingt-sept mille, et la carte affichait « 26998 ans »
       à côté d'un « 8 483 UA » correctement espacé. `distance` et `masses`
       passaient déjà par `millier` ; celle-ci ne le faisait pas. */
    if(an >= 1000) return millier(an) + " " + pluriel(an, mot("an", "an"));
    if(an >= 1) return nombre(an, an < 10 ? 1 : 0) + " " + pluriel(an, mot("an", "an"));
    const j = s/86400;
    if(j >= 1)  return nombre(j, j < 10 ? 1 : 0) + " " + pluriel(j, mot("jour", "jour"));
    const h = s/3600;
    if(h >= 1)  return nombre(h, 1) + " " + mot("heure", "h");
    return Math.round(s/60) + " " + mot("minute", "min");
  },
  distance(m){
    if(m >= 0.05*AL){
      const al = m/AL;
      return (al < 1 ? nombre(al, 3) : millier(al)) + " " + mot("al", "années-lumière");
    }
    if(m >= 100*UA) return millier(m/UA) + " " + mot("ua", "unités astronomiques");
    return nombre(m/UA, 1) + " " + mot("ua", "unités astronomiques");
  },
  masses(r){
    const suffixe = " " + mot("masses", "kg par kg arrivé");
    if(r < 1e4) return millier(r) + suffixe;
    const e = Math.floor(Math.log10(r));
    return nombre(r/Math.pow(10, e), 1) + " × 10" + exposant(e) + suffixe;
  },
};

/* IL Y AVAIT ICI UNE TABLE DE DESTINATIONS, et elle était morte.

   Trois entrées, une distance chacune, un commentaire qui la disait « contrat
   de destination » — et personne ne la lisait. La page porte la sienne depuis
   longtemps, avec des distances DIFFÉRENTES : mille unités astronomiques ici,
   dix mille là-bas, parce qu'à mille on est encore au milieu de l'essaim des
   étoiles S. Deux vérités pour une seule chose, dont une fausse et invisible.

   Supprimée le 9 août 2026, en ouvrant le voyage vers le système solaire. Ce
   module calcule des trajets ; il n'a pas à savoir où l'on va. */

/* Où en est-on EN COURS DE ROUTE.

   Le chronomètre du bord ne peut pas interpoler linéairement : le temps propre
   ne croît pas comme la distance, c'est tout le sujet. On le calcule donc
   exactement à mi-chemin près.

   Pour une phase d'accélération seule, depuis l'arrêt, sur une distance s :

       τ(s) = (c/a) · arcosh( a·s/c² + 1 )
       t(s) = (c/a) · sinh( a·τ/c )

   La seconde moitié est le miroir de la première : freiner sur les derniers s
   coûte exactement ce qu'a coûté d'accélérer sur les premiers s. On calcule
   donc la première moitié directement, et la seconde par différence.

   @param d_m  longueur totale du trajet
   @param s_m  distance déjà parcourue
   Rend les deux durées écoulées, en secondes. */
function enChemin(d_m, s_m, a){
  a = a || G_N;
  const phase = s => {                       // accélération seule sur s
    // Même identité stable que partout ailleurs dans ce fichier, mais écrite
    // ici séparément : `outil-verif-voyage.js` vérifie que cette fonction et
    // `etat()` sont réciproques, et ce contrôle ne vaut que si les deux
    // chemins restent indépendants.
    const tau = (2*C/a) * Math.asinh(Math.sqrt(a*s/(2*C*C)));
    return { tau, t: (C/a) * Math.sinh(a*tau/C) };
  };
  const s = Math.max(0, Math.min(d_m, s_m));
  const moitie = phase(d_m/2), total = { tau: 2*moitie.tau, t: 2*moitie.t };
  if(s <= d_m/2){
    const p = phase(s);
    return { tau: p.tau, t: p.t };
  }
  const reste = phase(d_m - s);              // ce qu'il reste à freiner
  return { tau: total.tau - reste.tau, t: total.t - reste.t };
}

/* ---------------------------------------------------------------------------
   L'ÉTAT À UN INSTANT DU VOL — ce qu'il faut pour l'AFFICHER pendant le trajet.

   Hugo, 7 août 2026 : « il faudrait mettre notre vitesse actuelle pendant le
   voyage, en vitesse de la lumière. La phase d'accélération, la phase de
   décélération, qu'on ait des informations qui nous disent à quelle vitesse on
   va, le décalage temporel pendant le voyage, à quelle distance on est de notre
   point de départ. »

   POURQUOI CE N'EST PAS QU'UN AFFICHAGE. Le recul visible suivait une courbe de
   confort — un lissage sur le logarithme de la distance — pendant que le
   chronomètre, lui, calculait le vrai vol à 1 g. Les deux ne décrivaient pas le
   même voyage. Afficher une vitesse tirée de la courbe de confort aurait donné
   un chiffre faux à l'écran, ce que ce dépôt n'autorise pas.

   On donne donc l'état exact en fonction du temps PROPRE écoulé — celui que lit
   l'horloge du bord, et celui qu'une animation sait avancer. Le reste s'en
   déduit sans rien inventer.

       accélération, depuis l'arrêt :
           η(τ) = aτ/c            la rapidité, qui croît linéairement
           s(τ) = (c²/a)·(cosh η − 1)
           t(τ) = (c/a)·sinh η

       freinage : le miroir exact de l'accélération. Freiner sur les derniers s
       coûte ce qu'a coûté d'accélérer sur les premiers s, donc on calcule le
       temps qui RESTE et l'on retranche.

   La vitesse est c·tanh η. Elle vaut zéro aux deux bouts — on part à l'arrêt et
   l'on arrive à l'arrêt — et passe par son maximum au demi-tour. C'est ce qui
   rend les deux phases lisibles sans qu'on ait à les annoncer.

   @param d_m   longueur totale du trajet, en mètres
   @param tau_s temps propre écoulé depuis le départ, en secondes
   Rend { s, tau, t, eta, v, beta, gamma, phase, tauTotal, tTotal }. */
function etat(d_m, tau_s, a){
  a = a || G_N;
  const demi = phaseDepuisDistance(d_m/2, a);       // le demi-tour
  const tauTotal = 2*demi.tau, tTotal = 2*demi.t;
  const tau = Math.max(0, Math.min(tauTotal, tau_s));

  /* `cosh η − 1` est un piège en flottant : à η ≈ 10⁻⁶, cosh vaut
     1,0000000000002 et la soustraction jette treize chiffres. Sur un trajet de
     mille kilomètres, la distance sortait fausse de trois millionièmes et la
     dérivée de CENT POUR CENT — c'est `outil-verif-voyage.js` qui l'a trouvé le
     jour de son écriture, en comparant à Newton.

     L'identité `cosh x − 1 = 2 sinh²(x/2)` est exacte et n'annule rien. */
  const avance = tp => {                            // accélération pure, depuis l'arrêt
    const eta = a*tp/C;
    const demi = Math.sinh(eta/2);
    return { eta, s: (C*C/a)*2*demi*demi, t: (C/a)*Math.sinh(eta) };
  };

  let s, t, eta, phase;
  if(tau <= demi.tau){
    const p = avance(tau);
    s = p.s; t = p.t; eta = p.eta; phase = "acceleration";
  } else {
    const p = avance(tauTotal - tau);               // ce qu'il reste à freiner
    s = d_m - p.s; t = tTotal - p.t; eta = p.eta; phase = "freinage";
  }
  /* `gMoins1` n'est PAS un doublon de `gamma`. Ce qu'on affiche comme
     « décalage temporel » est γ − 1, et l'écrire ainsi depuis `gamma` retombe
     dans l'annulation qu'on vient de fuir : à faible vitesse γ vaut
     1,0000000000196 et la soustraction perd six chiffres sur onze.

     Le module rend donc la quantité stable, pour qu'aucun appelant n'ait à
     redécouvrir le piège. Aux grandes vitesses les deux se confondent. */
  const demiEta = Math.sinh(eta/2);
  return { s, tau, t, eta, v: C*Math.tanh(eta), beta: Math.tanh(eta),
           gamma: Math.cosh(eta), gMoins1: 2*demiEta*demiEta,
           phase, tauTotal, tTotal };
}

/* Le temps propre et le temps du départ pour une accélération seule sur `s`.

   `enChemin` calcule la même chose et n'est VOLONTAIREMENT pas refactorisé pour
   passer par ici. C'est le seul endroit du dépôt où je duplique sciemment une
   formule : `outil-verif-voyage.js` vérifie que `etat()` et `enChemin()` sont
   réciproques, et cette vérification ne vaut que tant que les deux chemins sont
   écrits séparément. Les factoriser rendrait le contrôle d'accord avec
   lui-même — la faute exacte que la cinquième règle dure interdit. */
function phaseDepuisDistance(s_m, a){
  a = a || G_N;
  // `acosh(1 + x)` souffre de la même annulation que `cosh x − 1` quand x est
  // petit. L'identité `acosh(1 + x) = 2·asinh(√(x/2))` est exacte et stable.
  const x = a*Math.max(0, s_m)/(C*C);
  const tau = (2*C/a) * Math.asinh(Math.sqrt(x/2));
  return { tau, t: (C/a) * Math.sinh(a*tau/C) };
}

/* La distance parcourue est la DIFFÉRENCE entre deux rayons, pas le rayon de
   l'arrivée : on part d'où l'on est. */
function entre(depuis_m, vers_m, a){
  const d = Math.abs(vers_m - depuis_m);
  const r = trajet(d, a);
  r.d_m = d;
  r.masses = rapportDeMasses(r.eta);
  return r;
}

global.VOYAGE = { trajet, entre, enChemin, etat, rapportDeMasses, joli,
                  C, G_N, AL, AN, UA };

})(window);
