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
  const tau = (2*C/a) * Math.acosh(k + 1);          // vécu à bord
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
  duree(s){
    const an = s/AN;
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

/* Les destinations. Chacune donne sa distance depuis le trou noir et l'échelle
   à laquelle on l'observe. Rien n'est en dur ailleurs : c'est le contrat de
   destination d'OBJECTIFS.md.

   Les distances des deux premières sont fixées par l'orbite du salon et par
   les demi-grands axes des étoiles S ; celle du système solaire est la
   distance au centre galactique adoptée par le site. */
const DESTINATIONS = [
  { id:"salon",   nom:"Notre orbite",
    d_m: 16 * 1.269e10,          // seize rayons de Schwarzschild
    quoi:"L'ombre emplit la baie. C'est d'ici qu'on regarde." },
  { id:"etoiles", nom:"Voir les étoiles tourner",
    d_m: 1000 * 1.495978707e11,  // mille unités astronomiques
    quoi:"Assez loin pour que le trou noir disparaisse — et pour que les orbites des étoiles S tiennent dans le champ." },
  { id:"soleil",  nom:"Le système solaire",
    d_m: 8277 * 3.0856775814913673e16,   // 8 277 parsecs
    quoi:"La maison. Vingt-sept mille années-lumière." },
];

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
    const tau = (C/a) * Math.acosh(a*s/(C*C) + 1);
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

/* La distance parcourue est la DIFFÉRENCE entre deux rayons, pas le rayon de
   l'arrivée : on part d'où l'on est. */
function entre(depuis_m, vers_m, a){
  const d = Math.abs(vers_m - depuis_m);
  const r = trajet(d, a);
  r.d_m = d;
  r.masses = rapportDeMasses(r.eta);
  return r;
}

global.VOYAGE = { trajet, entre, enChemin, rapportDeMasses, joli, DESTINATIONS,
                  C, G_N, AL, AN, UA };

})(window);
