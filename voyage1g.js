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

const joli = {
  duree(s){
    const an = s/AN;
    if(an >= 1)      return an.toFixed(an < 10 ? 1 : 0) + " an" + (an >= 2 ? "s" : "");
    const j = s/86400;
    if(j >= 1)       return j.toFixed(j < 10 ? 1 : 0) + " jour" + (j >= 2 ? "s" : "");
    const h = s/3600;
    if(h >= 1)       return h.toFixed(1) + " h";
    return Math.round(s/60) + " min";
  },
  distance(m){
    if(m >= 0.05*AL) return (m/AL).toFixed(m < AL ? 3 : 0) + " années-lumière";
    if(m >= 100*UA)  return Math.round(m/UA).toLocaleString("fr-FR") + " unités astronomiques";
    return (m/UA).toFixed(1) + " unités astronomiques";
  },
  masses(r){
    if(r < 1e4) return Math.round(r).toLocaleString("fr-FR") + " kg par kg arrivé";
    const e = Math.floor(Math.log10(r));
    return (r/Math.pow(10, e)).toFixed(1) + " × 10^" + e + " kg par kg arrivé";
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

/* La distance parcourue est la DIFFÉRENCE entre deux rayons, pas le rayon de
   l'arrivée : on part d'où l'on est. */
function entre(depuis_m, vers_m, a){
  const d = Math.abs(vers_m - depuis_m);
  const r = trajet(d, a);
  r.d_m = d;
  r.masses = rapportDeMasses(r.eta);
  return r;
}

global.VOYAGE = { trajet, entre, rapportDeMasses, joli, DESTINATIONS,
                  C, G_N, AL, AN, UA };

})(window);
