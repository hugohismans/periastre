/* ============================================================================
   N corps — la gravitation MUTUELLE, pour poser une planète et voir si ça tient.

   Tout ce que le site intégrait jusqu'ici tournait autour d'une masse fixe :
   une particule d'épreuve, un champ imposé, un astre qui ne bouge pas. C'est
   exact tant que le corps qu'on suit ne pèse rien. Dès qu'on veut poser une
   planète dans un système, ou demander « et si on en ajoutait une là ? », il
   faut que chaque corps tire sur tous les autres — et il faut pouvoir dire, au
   bout de dix mille ans simulés, si le système a tenu ou s'il s'est défait.

   Ce module ne dessine rien, ne connaît ni le DOM ni WebGL, ne dépend d'aucun
   autre fichier du dépôt. Il calcule, et il rend des nombres.

   ---------------------------------------------------------------------------
   POURQUOI SYMPLECTIQUE, ET PAS RUNGE-KUTTA

   C'est le choix qui commande tout le reste, et il est contre-intuitif.

   Runge-Kutta d'ordre 4 est plus précis que le saute-mouton sur UN pas : son
   erreur locale va comme dt⁵ contre dt³. Si l'on jugeait au pas, il gagnerait
   sans discussion. Mais ce n'est pas ce qu'on lui demande. On lui demande de
   tenir un million de pas, et là, la question n'est plus « de combien se
   trompe-t-il ? » mais « ses erreurs se compensent-elles ou s'accumulent-elles
   toujours dans le même sens ? ».

   Runge-Kutta ne conserve rien. Son erreur sur l'énergie a une composante
   systématique, et sur une orbite fermée elle repasse au même endroit à chaque
   tour : la planète spirale, lentement, indéfiniment. La dérive croît comme le
   nombre de tours. Au bout d'un million de pas, l'orbite s'est visiblement
   déplacée, et rien dans le résultat ne le signale.

   Le saute-mouton, lui, n'intègre pas exactement le hamiltonien H qu'on lui a
   donné : il intègre EXACTEMENT un hamiltonien voisin H̃ = H + dt²·(…), qu'on
   appelle le hamiltonien fantôme. Comme il le fait exactement, il conserve H̃
   pour toujours. Et comme H̃ ne s'écarte de H que de l'ordre de dt², l'énergie
   vraie OSCILLE dans une bande de largeur dt² — sans jamais en sortir. Un
   million de pas plus tard, la bande a la même largeur qu'au premier pas.

   Le contrôle 2 de `outil-verif-ncorps.js` ne fait rien d'autre que montrer
   cette différence, en faisant tourner les deux côte à côte.

   Deux intégrateurs sont fournis :

     · saute-mouton (Verlet en vitesses, forme coup-glissé-coup) — ordre 2,
       une évaluation des forces par pas. Le rapport qualité-prix de référence ;
     · Yoshida d'ordre 4 — composition de trois saute-moutons de pas w₁·dt,
       w₀·dt, w₁·dt avec w₁ = 1/(2 − 2^(1/3)) et w₀ = 1 − 2w₁. Trois évaluations
       par pas, mais une bande d'énergie en dt⁴ : à coût égal, on peut prendre
       un pas trois fois plus grand et gagner deux ordres de grandeur.

   Noter que w₀ est NÉGATIF (≈ −1,7024) : le composé recule dans le temps au
   pas du milieu. C'est normal, c'est même le seul moyen d'atteindre l'ordre 4
   par composition ; un théorème de Suzuki interdit des coefficients tous
   positifs au-delà de l'ordre 2. On a failli « corriger » ce signe.

   ---------------------------------------------------------------------------
   LES QUATRE PIÈGES, DONT TROIS ONT ÉTÉ TENDUS ICI

   1. LE PAS VARIABLE TUE LA SYMPLECTICITÉ. La tentation est immédiate : quand
      deux corps se rapprochent, réduire dt. C'est ce que fait tout intégrateur
      à pas adaptatif, et c'est exactement ce qu'il ne faut pas faire ici. Le
      hamiltonien fantôme dépend de dt ; changer dt en cours de route change de
      fantôme, et le nouveau ne conserve pas ce que l'ancien conservait. On
      obtient une dérive, souvent PIRE que celle de Runge-Kutta. Le pas est donc
      fixe, et il n'y a pas d'option pour le rendre variable.

   2. L'ADOUCISSEMENT DOIT DÉRIVER D'UN POTENTIEL. Le réflexe pour éviter la
      singularité en 1/r² est de plafonner la force : « si r < r_min, prendre
      r_min ». C'est un désastre silencieux. Une force plafonnée de cette
      façon ne dérive d'aucun potentiel, le système cesse d'être hamiltonien, et
      l'intégrateur symplectique n'a plus rien à conserver — on garde le coût du
      symplectique et on perd sa seule raison d'être. L'adoucissement retenu est
      celui de Plummer :

          U = − G·mᵢ·mⱼ / √(r² + ε²)        a = − G·m·r⃗ / (r² + ε²)^(3/2)

      qui EST un potentiel, dont la force ci-dessus est le gradient exact. Le
      système adouci reste hamiltonien, l'énergie reste conservée, et l'énergie
      calculée par `energie()` emploie le MÊME ε que les forces — sinon on
      mesurerait la conservation d'une quantité que l'intégrateur n'intègre pas.

   3. LES VITESSES DÉSYNCHRONISÉES. Dans la forme glissé-coup-glissé du
      saute-mouton, les vitesses vivent aux demi-pas et les positions aux pas
      entiers. Calculer l'énergie en mélangeant les deux donne une erreur en dt,
      pas en dt², et l'on conclut à tort que l'intégrateur est mauvais. La forme
      implémentée ici est coup-glissé-coup, où positions et vitesses sont
      synchronisées à la fin de chaque pas : `energie()` peut être appelée à
      tout instant sans précaution. C'est la raison de ce choix de forme, pas
      l'élégance.

   4. « L'ERREUR SUR L'ÉNERGIE » NE VEUT RIEN DIRE SANS DIRE LAQUELLE. L'énergie
      d'un symplectique oscille à la période orbitale, avec une amplitude qui
      dépend de l'excentricité. Mesurer l'écart à un instant tiré au hasard, c'est
      mesurer une phase. Ce qui compte est la DÉRIVE de la moyenne, et c'est une
      grandeur différente, plus petite de plusieurs ordres de grandeur. Le
      module rend les deux séparément, et l'outil de contrôle les distingue.

   ---------------------------------------------------------------------------
   L'ENTORSE, DÉCLARÉE

   Sur ce site, toute approximation se déclare. En voici une, et c'en est bien
   une : l'adoucissement ε n'est PAS de la physique. Deux corps ponctuels
   newtoniens s'attirent en 1/r² jusqu'à r = 0 ; l'adoucissement remplace ce
   comportement par celui d'une petite sphère de Plummer de rayon ε. Concrète-
   ment, en deçà de ε, la gravité devient plus faible que la vraie, et les
   rencontres serrées sont rendues trop douces.

   Pourquoi le faire quand même : sans lui, un passage à petite distance produit
   une accélération arbitrairement grande que le pas fixe ne peut pas suivre, et
   le corps est catapulté hors du système. On aurait alors une éjection NUMÉRIQUE
   indiscernable d'une éjection physique — précisément ce que le module est censé
   détecter. L'adoucissement échange une erreur silencieuse contre une
   approximation nommée.

   Comment le choisir : ε doit être PLUS PETIT que la plus petite distance qu'on
   veut voir juste, et PLUS GRAND que la distance en deçà de laquelle le pas ne
   suit plus. En pratique, ε de l'ordre du rayon physique des corps est le bon
   ordre — en deçà, deux corps se sont touchés de toute façon, et c'est une
   collision, pas une rencontre. `adoucissementConseille()` propose cette
   valeur ; `entorses()` liste ce que le système en cours a d'approché, avec le
   rayon en deçà duquel les résultats ne veulent plus rien dire.

   Par défaut, ε = 0 : le module est alors EXACTEMENT newtonien, ce qui est
   nécessaire pour que les contrôles à deux corps puissent se comparer à la
   solution analytique sans excuse.

   ---------------------------------------------------------------------------
   LA LIMITE DE ROCHE — DEUX FORMULES, ET LE PIÈGE QUI LES SÉPARE

   La distance en deçà de laquelle un satellite est déchiré par la marée de sa
   planète. Elle s'écrit sous deux formes fermées selon que le satellite se
   déforme ou non, et les deux diffèrent d'un facteur voisin de deux.

   CORPS RIGIDE — le satellite garde sa forme sphérique. On égale la marée qui
   arrache un grain de sa surface, 2GM·r/d³, à la gravité qui l'y retient,
   Gm/r² :

       d_rigide = r · (2M/m)^(1/3) = 1,26 · R · (ρ_M/ρ_m)^(1/3)

   CORPS FLUIDE — le satellite n'a aucune cohésion et se laisse allonger par la
   marée. Il s'étire, son point le plus avancé se rapproche, la marée y est plus
   forte, il s'étire davantage : l'emballement déplace la limite vers l'extérieur.
   Le calcul de l'ellipsoïde d'équilibre (Roche, puis Chandrasekhar 1969) donne

       d_fluide = 2,455 · r · (M/m)^(1/3) = 2,455 · R · (ρ_M/ρ_m)^(1/3)

   Les deux sont dans un rapport 2,455 / 2^(1/3) = 1,949. Un satellite fluide se
   disloque presque deux fois plus loin qu'un satellite rigide de même densité.

   ET UN TROISIÈME COEFFICIENT, que la simulation impose. La dérivation rigide
   ci-dessus oublie que le satellite TOURNE : présentant toujours la même face à
   sa planète, il tourne sur lui-même à la vitesse de son orbite, et un grain
   posé sur sa surface subit la force centrifuge en plus de la marée. La somme
   vaut 3n²x et non 2n²x, d'où

       d_synchrone = 3^(1/3) · r · (M/m)^(1/3) = 1,442 · r · (M/m)^(1/3)

   C'est le contrôle 4 qui a tranché, et il n'a pas dit ce qu'on attendait : le
   seuil mesuré converge vers 1,4433 quand le rapport de masses tend vers zéro,
   à 0,07 % de 3^(1/3), et pas du tout vers 1,26. On a d'abord cru à un défaut
   de la simulation avant de comprendre que c'était la formule des manuels qui
   répondait à une autre question — celle d'un satellite qui ne tournerait pas,
   et il n'en existe pas. Les trois coefficients sont donc fournis, et l'on dit
   lequel la simulation retrouve.

   LE PIÈGE, et il a failli passer : dans la forme en RAPPORT DE DENSITÉS, R est
   le rayon de la PLANÈTE ; dans la forme en RAPPORT DE MASSES, r est le rayon du
   SATELLITE. Les deux formules se ressemblent à s'y méprendre, le coefficient
   est le même, et mélanger les deux rayons donne un résultat faux d'un facteur
   (R/r) — c'est-à-dire de plusieurs ordres de grandeur pour un satellite normal.
   La première écriture de ce fichier employait le rayon du satellite avec les
   densités et sortait une limite de Roche de Saturne à quelques kilomètres, ce
   qui est absurde et ne saute pas aux yeux quand on ne lit que la formule. Les
   deux fonctions ci-dessous nomment donc leurs arguments sans ambiguïté, et
   `rocheParDensites` exige explicitement le rayon de la PRIMAIRE.

   LEQUEL S'APPLIQUE QUAND :
     · fluide — corps sans cohésion et déformable : gros satellites glacés ou
       rocheux (au-delà de ~200 km, la gravité l'emporte sur la résistance du
       matériau), comètes, tas de gravats, corps liquides ou gazeux. C'est le cas
       usuel pour tout ce qu'on appellerait « une lune ». C'est aussi celui qui
       s'applique aux anneaux de Saturne, tous à l'intérieur de cette limite ;
     · rigide — corps dont la forme est tenue par la résistance du matériau et
       non par sa propre gravité : petits astéroïdes monolithiques, satellites
       artificiels. Un corps assez solide peut d'ailleurs survivre BIEN à
       l'intérieur des deux limites : Métis et Pan orbitent en deçà de la limite
       fluide de leur planète et tiennent, parce qu'ils ont une cohésion.

   Autrement dit ces deux formules encadrent le réel, elles ne le déterminent
   pas. Un tas de gravats avec un peu de frottement interne se disloque quelque
   part entre les deux (Holsapple & Michel 2006), et où exactement dépend d'une
   propriété du matériau qu'aucune formule fermée ne contient. Le module rend
   les deux bornes et le dit.

   Une troisième distance, souvent confondue avec les deux précédentes, est
   fournie séparément : `rayonDeHill`, qui n'est pas une limite de Roche. Elle
   dit jusqu'où un satellite reste attaché à sa planète face à l'étoile, pas si
   le satellite se déchire. Les deux se calculent avec des exposants voisins et
   se confondent facilement.

   ---------------------------------------------------------------------------
   SOURCES DES CONSTANTES

     G = 6,674 30 × 10⁻¹¹ m³·kg⁻¹·s⁻²   CODATA 2018 (valeur déjà employée par
                                        le site, voir SOURCES.md)
     ua = 149 597 870 700 m, exactement  IAU 2012, résolution B2
     GM☉ = 1,327 124 400 41 × 10²⁰ m³/s² IAU 2015 résolution B3, valeur nominale
                                        (identique à DE440 aux 9 premiers chiffres)
     jour = 86 400 s, exactement

   G·M☉ est connu à 10 chiffres, M☉ seule à 5 seulement, parce que G est la
   constante fondamentale la moins bien mesurée. Toute la mécanique céleste de
   précision travaille donc en GM et jamais en M : c'est pourquoi le jeu
   d'unités ua-jour-masse solaire ci-dessous pose G = GM☉ numériquement, ce qui
   n'est pas une approximation mais un changement d'unité de masse.
   ============================================================================ */

(function(global){
"use strict";

/* Le dépôt porte déjà une collision silencieuse : deux fichiers posent
   `window.VOYAGE`, le second écrase le premier sans que rien ne le dise. On ne
   recommence pas. Le nom NCORPS a été vérifié libre contre KERR, VOYAGE,
   RECUL, ETOILES_S, VAISSEAU, PERSONNAGE, ROBOT, PANTHEON, MUSIQUE, CONTENU,
   UI et LANGUE ; et si quelqu'un le prend un jour, ce module refusera d'écraser
   plutôt que de gagner en silence. */
if(global.NCORPS){
  /* On crie sur la VRAIE console, pas sur `global.console`. Le module est
     chargé par l'outil de contrôle avec un faux `window` qui, lui, n'a pas de
     console : tester `global.console` faisait échouer l'avertissement
     exactement dans le seul cas où on avait besoin de l'entendre. */
  if(typeof console !== "undefined" && console.error){
    console.error("ncorps.js : un global nommé NCORPS existe déjà. " +
                  "Chargement abandonné pour ne pas l'écraser en silence.");
  }
  return;
}

/* ---------------------------------------------------------------------------
   CONSTANTES ET JEUX D'UNITÉS
   --------------------------------------------------------------------------- */

const G_SI       = 6.67430e-11;              // m³·kg⁻¹·s⁻², CODATA 2018
const UA_M       = 1.495978707e11;           // m, IAU 2012 (exact par définition)
const JOUR_S     = 86400;                    // s, exact
const AN_JULIEN_J= 365.25;                   // jours, exact par définition
const GM_SOLEIL  = 1.32712440041e20;         // m³/s², IAU 2015 B3 (nominal)
const M_SOLEIL   = GM_SOLEIL / G_SI;         // kg — dérivée, donc à 5 chiffres

/* G dans le jeu ua / jour / masse solaire.
   Poser G = GM☉ exprimé en ua³·jour⁻² revient à prendre la masse solaire pour
   unité de masse. La valeur obtenue, 2,959 × 10⁻⁴, est le carré de la constante
   de Gauss k = 0,017 202 098 95 — c'est le même nombre, redécouvert par le
   changement d'unités, et c'est un contrôle en soi. */
const G_UA_JOUR_MSOL = GM_SOLEIL * (JOUR_S*JOUR_S) / (UA_M*UA_M*UA_M);

const UNITES = {
  SI:            { G: G_SI,            longueur:"m",  temps:"s",     masse:"kg" },
  UA_JOUR_MSOL:  { G: G_UA_JOUR_MSOL,  longueur:"ua", temps:"jour",  masse:"M☉" },
  UA_AN_MSOL:    { G: G_UA_JOUR_MSOL * AN_JULIEN_J*AN_JULIEN_J,
                   longueur:"ua", temps:"an julien", masse:"M☉" },
};

/* ---------------------------------------------------------------------------
   POSER UN SYSTÈME
   --------------------------------------------------------------------------- */

/* Construit un système à N corps.

   @param corps    tableau d'objets { m, p:[x,y,z], v:[vx,vy,vz], nom, rayon }
                   `rayon` est le rayon physique du corps, facultatif, et ne
                   sert qu'à la détection de collision et au conseil sur ε.
   @param options  { G, adoucissement, integrateur, t0 }
                   G par défaut : celui du SI. Choisir un jeu d'unités cohérent
                   est la responsabilité de l'appelant, et le module ne peut pas
                   le deviner — d'où UNITES, qui donne les combinaisons sûres.

   Les tableaux sont plats et typés (Float64Array) : pour un million de pas, la
   différence avec un tableau d'objets se compte en minutes. */
function systeme(corps, options){
  options = options || {};
  const n = corps.length;
  const s = {
    n,
    G:  options.G !== undefined ? options.G : G_SI,
    eps: options.adoucissement || 0,
    integrateur: options.integrateur || "saute-mouton",
    t:  options.t0 || 0,
    m:  new Float64Array(n),
    p:  new Float64Array(3*n),
    v:  new Float64Array(3*n),
    a:  new Float64Array(3*n),
    rayon: new Float64Array(n),
    nom: new Array(n),
    pas: 0,                       // nombre de pas effectués
    evalForces: 0,                // nombre d'évaluations des forces
  };
  for(let i = 0; i < n; i++){
    const c = corps[i];
    s.m[i] = c.m;
    s.rayon[i] = c.rayon || 0;
    s.nom[i] = c.nom || ("corps " + i);
    for(let k = 0; k < 3; k++){
      s.p[3*i+k] = (c.p && c.p[k]) || 0;
      s.v[3*i+k] = (c.v && c.v[k]) || 0;
    }
  }
  if(!(s.integrateur === "saute-mouton" || s.integrateur === "yoshida4")){
    throw new Error("ncorps : intégrateur inconnu « " + s.integrateur +
                    " » — attendu « saute-mouton » ou « yoshida4 ».");
  }
  accelerations(s);               // l'état doit être complet avant le premier pas
  return s;
}

/* Une copie indépendante, pour comparer deux intégrations du même départ. */
function copie(s){
  const c = Object.assign({}, s);
  c.m = s.m.slice(); c.p = s.p.slice(); c.v = s.v.slice();
  c.a = s.a.slice(); c.rayon = s.rayon.slice(); c.nom = s.nom.slice();
  return c;
}

/* ---------------------------------------------------------------------------
   LES FORCES
   --------------------------------------------------------------------------- */

/* Accélérations mutuelles, avec adoucissement de Plummer.

       a⃗ᵢ = Σ_{j≠i}  G·mⱼ · (x⃗ⱼ − x⃗ᵢ) / (r²ᵢⱼ + ε²)^(3/2)

   La boucle est en i<j et applique le couple aux deux corps à la fois : la
   troisième loi de Newton est ainsi vraie à l'arrondi près, ce qui n'est pas
   qu'une économie de moitié. Calculer les deux accélérations séparément laisse
   subsister un déséquilibre de l'ordre de l'epsilon machine qui, sur un million
   de pas, fait dériver la quantité de mouvement totale. En l'imposant par
   construction, le centre de masse ne bouge pas — et le contrôle sur le moment
   cinétique mesure alors l'intégrateur, pas la sommation. */
function accelerations(s){
  const {n, G, eps, m, p, a} = s;
  const eps2 = eps*eps;
  a.fill(0);
  for(let i = 0; i < n; i++){
    const xi = p[3*i], yi = p[3*i+1], zi = p[3*i+2];
    for(let j = i+1; j < n; j++){
      const dx = p[3*j]   - xi;
      const dy = p[3*j+1] - yi;
      const dz = p[3*j+2] - zi;
      const r2 = dx*dx + dy*dy + dz*dz + eps2;
      const inv = 1 / (r2 * Math.sqrt(r2));      // 1/r³, adouci
      const gi = G * m[j] * inv;
      const gj = G * m[i] * inv;
      a[3*i]   += gi*dx;  a[3*i+1] += gi*dy;  a[3*i+2] += gi*dz;
      a[3*j]   -= gj*dx;  a[3*j+1] -= gj*dy;  a[3*j+2] -= gj*dz;
    }
  }
  s.evalForces++;
  return a;
}

/* ---------------------------------------------------------------------------
   L'INTÉGRATION
   --------------------------------------------------------------------------- */

/* Un saute-mouton coup-glissé-coup de pas h.

   Le premier demi-coup emploie l'accélération DÉJÀ en mémoire, calculée à la
   fin du pas précédent ; c'est ce qui ramène le coût à une seule évaluation des
   forces par pas malgré les deux coups. L'accélération laissée en mémoire à la
   sortie est celle des positions finales, ce qui rend l'état complet et
   synchronisé — voir le piège 3 de l'en-tête. */
function sauteMouton(s, h){
  const {n, p, v, a} = s;
  const demi = 0.5*h;
  for(let k = 0; k < 3*n; k++) v[k] += demi * a[k];
  for(let k = 0; k < 3*n; k++) p[k] += h * v[k];
  accelerations(s);
  for(let k = 0; k < 3*n; k++) v[k] += demi * a[k];
  s.t += h;
}

/* Coefficients de Yoshida d'ordre 4. w₀ est négatif ; ce n'est pas une faute
   de signe, c'est la seule façon d'annuler le terme d'erreur en h³ par
   composition (voir l'en-tête). */
const CBRT2 = Math.cbrt(2);
const YOSH_W1 = 1 / (2 - CBRT2);          // ≈ +1,351 207
const YOSH_W0 = 1 - 2*YOSH_W1;            // ≈ −1,702 414

/* Un pas de longueur h. Le pas est FIXE par construction : voir le piège 1.

   Le temps est recalé sur t₀ + h à la sortie plutôt que laissé à la somme des
   sous-pas. En arithmétique exacte c'est la même chose ; en flottants, w₁ + w₀ +
   w₁ ne vaut pas 1 au dernier bit, et l'écart s'accumule sur un million de pas
   jusqu'à fausser les périodes mesurées au huitième chiffre. */
function pas(s, h){
  if(!(h > 0) && !(h < 0)) throw new Error("ncorps : pas de temps nul ou non fini.");
  const t0 = s.t;
  if(s.integrateur === "yoshida4"){
    sauteMouton(s, YOSH_W1*h);
    sauteMouton(s, YOSH_W0*h);
    sauteMouton(s, YOSH_W1*h);
    s.t = t0 + h;         // recalage : la somme des trois sous-pas vaut h
  } else {
    sauteMouton(s, h);
    s.t = t0 + h;
  }
  s.pas++;
  return s;
}

/* Avance d'une DURÉE, en pas de h.

   Rend le nombre de pas effectués. La durée demandée est découpée en un nombre
   ENTIER de pas, arrondi au plus proche : on ne termine pas par un pas plus
   court pour tomber juste. Un dernier pas de longueur différente changerait de
   hamiltonien fantôme au dernier instant, exactement le piège 1, et
   contaminerait la seule mesure qui compte. La durée réellement parcourue peut
   donc différer de la durée demandée de moins d'un demi-pas ; `s.t` dit
   toujours la vérité. */
function avance(s, duree, h){
  const k = Math.max(1, Math.round(Math.abs(duree/h)));
  const signe = duree < 0 ? -1 : 1;
  for(let i = 0; i < k; i++) pas(s, signe*h);
  return k;
}

/* ---------------------------------------------------------------------------
   LES INVARIANTS
   --------------------------------------------------------------------------- */

/* Énergie totale : cinétique + potentiel, avec le MÊME adoucissement que les
   forces. Employer le potentiel non adouci ici donnerait une « non
   conservation » qui ne serait qu'un désaccord entre deux formules. */
function energie(s){
  const {n, G, eps, m, p, v} = s;
  const eps2 = eps*eps;
  let T = 0, U = 0;
  for(let i = 0; i < n; i++){
    const vx = v[3*i], vy = v[3*i+1], vz = v[3*i+2];
    T += 0.5 * m[i] * (vx*vx + vy*vy + vz*vz);
    for(let j = i+1; j < n; j++){
      const dx = p[3*j]   - p[3*i];
      const dy = p[3*j+1] - p[3*i+1];
      const dz = p[3*j+2] - p[3*i+2];
      U -= G * m[i] * m[j] / Math.sqrt(dx*dx + dy*dy + dz*dz + eps2);
    }
  }
  return { T, U, total: T + U };
}

/* Moment cinétique total, autour de l'origine du repère.

   Il n'est indépendant de l'origine que si la quantité de mouvement totale est
   nulle. `centre()` permet de s'y ramener, et c'est ce qu'on fait avant tout
   contrôle sérieux : sinon on mesure la dérive du barycentre, pas celle du
   moment cinétique. */
function momentCinetique(s){
  const {n, m, p, v} = s;
  let lx = 0, ly = 0, lz = 0;
  for(let i = 0; i < n; i++){
    const x = p[3*i], y = p[3*i+1], z = p[3*i+2];
    const vx = v[3*i], vy = v[3*i+1], vz = v[3*i+2];
    lx += m[i]*(y*vz - z*vy);
    ly += m[i]*(z*vx - x*vz);
    lz += m[i]*(x*vy - y*vx);
  }
  return { x:lx, y:ly, z:lz, norme: Math.sqrt(lx*lx + ly*ly + lz*lz) };
}

function quantiteDeMouvement(s){
  const {n, m, v} = s;
  let px = 0, py = 0, pz = 0;
  for(let i = 0; i < n; i++){
    px += m[i]*v[3*i]; py += m[i]*v[3*i+1]; pz += m[i]*v[3*i+2];
  }
  return { x:px, y:py, z:pz, norme: Math.sqrt(px*px + py*py + pz*pz) };
}

function centreDeMasse(s){
  const {n, m, p, v} = s;
  let M = 0, x=0,y=0,z=0, vx=0,vy=0,vz=0;
  for(let i = 0; i < n; i++){
    M += m[i];
    x += m[i]*p[3*i]; y += m[i]*p[3*i+1]; z += m[i]*p[3*i+2];
    vx += m[i]*v[3*i]; vy += m[i]*v[3*i+1]; vz += m[i]*v[3*i+2];
  }
  return { M, p:[x/M, y/M, z/M], v:[vx/M, vy/M, vz/M] };
}

/* Ramène le système dans le repère de son barycentre, immobile à l'origine.
   À faire AVANT d'intégrer, jamais pendant : c'est un changement de repère
   galiléen, donc légitime à tout instant, mais l'appliquer en cours de route
   brouillerait la lecture des invariants. */
function centre(s){
  const c = centreDeMasse(s);
  for(let i = 0; i < s.n; i++) for(let k = 0; k < 3; k++){
    s.p[3*i+k] -= c.p[k];
    s.v[3*i+k] -= c.v[k];
  }
  accelerations(s);
  return s;
}

/* ---------------------------------------------------------------------------
   ÉLÉMENTS OSCULATEURS
   --------------------------------------------------------------------------- */

/* Éléments képlériens instantanés du corps `i` relativement au corps `centre`.

   « Osculateur » veut dire : les éléments de l'ellipse que le corps suivrait si
   toutes les autres masses disparaissaient à cet instant. C'est la bonne
   grandeur pour dire si un système a dérivé, parce qu'elle sépare ce qui
   oscille (la position sur l'orbite) de ce qui doit rester constant (la forme
   de l'orbite).

   μ = G(m_centre + m_i) et non G·m_centre : le problème à deux corps se réduit
   au mouvement relatif avec la masse TOTALE. Oublier m_i est sans conséquence
   pour une poussière, mais fausse la période de Jupiter d'un dixième de pour
   cent — largement de quoi ruiner un contrôle sur mille ans. */
function elements(s, i, iCentre){
  const c = iCentre === undefined ? 0 : iCentre;
  const mu = s.G * (s.m[c] + s.m[i]);
  const r = [s.p[3*i]-s.p[3*c], s.p[3*i+1]-s.p[3*c+1], s.p[3*i+2]-s.p[3*c+2]];
  const v = [s.v[3*i]-s.v[3*c], s.v[3*i+1]-s.v[3*c+1], s.v[3*i+2]-s.v[3*c+2]];
  return elementsDepuisEtat(r, v, mu);
}

function elementsDepuisEtat(r, v, mu){
  const R = Math.sqrt(r[0]*r[0] + r[1]*r[1] + r[2]*r[2]);
  const V2 = v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
  const rv = r[0]*v[0] + r[1]*v[1] + r[2]*v[2];

  const h = [ r[1]*v[2]-r[2]*v[1], r[2]*v[0]-r[0]*v[2], r[0]*v[1]-r[1]*v[0] ];
  const H = Math.sqrt(h[0]*h[0] + h[1]*h[1] + h[2]*h[2]);

  // vecteur d'excentricité — sa norme donne e, sa direction le péricentre
  const e_ = [0,0,0];
  for(let k = 0; k < 3; k++) e_[k] = ((V2 - mu/R)*r[k] - rv*v[k]) / mu;
  const e = Math.sqrt(e_[0]*e_[0] + e_[1]*e_[1] + e_[2]*e_[2]);

  const energieSpec = V2/2 - mu/R;
  const a = -mu / (2*energieSpec);        // négatif si hyperbolique : c'est voulu
  const lie = energieSpec < 0;

  /* Inclinaison par atan2 et non par acos(h_z/H).

     Les deux sont mathématiquement identiques et numériquement très
     différentes. Pour une orbite presque équatoriale, h_z/H vaut 1 − i²/2 :
     pour i = 10⁻⁹ cela fait 1 − 5 × 10⁻¹⁹, qui s'arrondit à 1 exactement en
     double précision, et acos rend zéro. L'inclinaison disparaît purement et
     simplement. La faute est classique — acos perd la moitié de ses chiffres
     près de ses bornes — et le contrôle 0 l'a attrapée : l'aller-retour
     éléments → état → éléments rendait i = 0 au lieu de 10⁻⁹.

     atan2 du couple (composante dans le plan, composante hors du plan) n'a pas
     ce défaut : les deux arguments restent du même ordre que leur propre
     précision, et la petite inclinaison survit. */
  const hxy = Math.sqrt(h[0]*h[0] + h[1]*h[1]);
  const i = Math.atan2(hxy, h[2]);

  // ligne des nœuds
  const nx = -h[1], ny = h[0];
  const N = Math.sqrt(nx*nx + ny*ny);
  let Omega = N > 0 ? Math.atan2(ny, nx) : 0;

  let omega, nu;
  if(N > 0 && e > 1e-12){
    omega = Math.acos(Math.max(-1, Math.min(1, (nx*e_[0] + ny*e_[1]) / (N*e))));
    if(e_[2] < 0) omega = 2*Math.PI - omega;
  } else if(e > 1e-12){                   // orbite équatoriale
    omega = Math.atan2(e_[1], e_[0]);
    if(h[2] < 0) omega = 2*Math.PI - omega;
  } else {
    omega = 0;                            // orbite circulaire : ϖ indéfini
  }

  if(e > 1e-12){
    nu = Math.acos(Math.max(-1, Math.min(1,
          (e_[0]*r[0] + e_[1]*r[1] + e_[2]*r[2]) / (e*R))));
    if(rv < 0) nu = 2*Math.PI - nu;
  } else {
    // circulaire : on repère par l'argument de latitude
    nu = N > 0 ? Math.atan2(r[2]/Math.sin(i || 1), (r[0]*nx + r[1]*ny)/N)
               : Math.atan2(r[1], r[0]);
    if(!isFinite(nu)) nu = Math.atan2(r[1], r[0]);
    nu = mod2pi(nu - omega);
  }

  // anomalies excentrique puis moyenne (cas elliptique seulement)
  let E = 0, M = 0, P = Infinity;
  if(lie && e < 1){
    E = 2*Math.atan2(Math.sqrt(1-e)*Math.sin(nu/2), Math.sqrt(1+e)*Math.cos(nu/2));
    M = mod2pi(E - e*Math.sin(E));
    P = 2*Math.PI*Math.sqrt(a*a*a/mu);
  }

  return {
    a, e, i, Omega: mod2pi(Omega), omega: mod2pi(omega), nu: mod2pi(nu),
    M, E, P, r: R, v: Math.sqrt(V2), h: H, mu, lie,
    varpi: mod2pi(Omega + omega),                 // longitude du péricentre
    lambda: mod2pi(Omega + omega + M),            // longitude moyenne
    peri: a*(1-e), apo: lie ? a*(1+e) : Infinity,
  };
}

/* Éléments → position et vitesse. La réciproque exacte de la précédente ;
   `outil-verif-ncorps.js` contrôle qu'aller-retour rend l'identité, ce qui est
   le seul moyen sérieux de se convaincre qu'aucune convention d'angle ne s'est
   inversée en route.

   @param el {a, e, i, Omega, omega, M} — angles en RADIANS. Le module ne
             travaille jamais en degrés : les tables astronomiques en donnent, et
             c'est à l'appelant de convertir une fois, à l'entrée. */
function etatDepuisElements(el, mu){
  const {a, e} = el;
  const inc = el.i || 0, Om = el.Omega || 0, om = el.omega || 0;
  // Kepler : M = E − e·sin E, par Newton. Le départ E₀ = M + e·sin M donne la
  // convergence en trois ou quatre itérations jusqu'à e ≈ 0,9.
  let E = el.M + e*Math.sin(el.M);
  for(let k = 0; k < 60; k++){
    const f = E - e*Math.sin(E) - el.M;
    const fp = 1 - e*Math.cos(E);
    const d = f/fp;
    E -= d;
    if(Math.abs(d) < 1e-15) break;
  }
  const cosE = Math.cos(E), sinE = Math.sin(E);
  const b = a*Math.sqrt(1 - e*e);
  // dans le plan orbital, péricentre sur +x
  const x = a*(cosE - e), y = b*sinE;
  const r = a*(1 - e*cosE);
  const n = Math.sqrt(mu/(a*a*a));
  const vx = -a*n*sinE / (1 - e*cosE);
  const vy =  b*n*cosE / (1 - e*cosE);
  // rotations ω, puis i, puis Ω — l'ordre standard
  const co = Math.cos(om), so = Math.sin(om);
  const ci = Math.cos(inc), si = Math.sin(inc);
  const cO = Math.cos(Om), sO = Math.sin(Om);
  const R = ([u, w]) => [
    (cO*co - sO*so*ci)*u + (-cO*so - sO*co*ci)*w,
    (sO*co + cO*so*ci)*u + (-sO*so + cO*co*ci)*w,
    (so*si)*u + (co*si)*w,
  ];
  return { p: R([x, y]), v: R([vx, vy]), r };
}

const mod2pi = x => ((x % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);

/* ---------------------------------------------------------------------------
   LA LIMITE DE ROCHE
   --------------------------------------------------------------------------- */

/* Coefficient du cas fluide. 2,455 est la valeur de l'ellipsoïde de Roche
   calculée exactement ; l'arrondi 2,44 qui circule partout vient d'une table
   ancienne et suffit à un ordre de grandeur, pas à un contrôle chiffré. */
const ROCHE_FLUIDE = 2.455;
const ROCHE_RIGIDE = Math.cbrt(2);            // ≈ 1,259 921

/* Limite de Roche RIGIDE, en rapport de masses.
   @param rSatellite  rayon du SATELLITE (pas de la primaire)
   @param M           masse de la primaire, @param m masse du satellite
   Rendue dans l'unité de rSatellite. */
function rocheRigide(rSatellite, M, m){
  return ROCHE_RIGIDE * rSatellite * Math.cbrt(M/m);
}

/* Limite de Roche FLUIDE, en rapport de masses. Mêmes arguments. */
function rocheFluide(rSatellite, M, m){
  return ROCHE_FLUIDE * rSatellite * Math.cbrt(M/m);
}

/* Limite RIGIDE d'un satellite EN ROTATION SYNCHRONE — le troisième coefficient,
   celui qu'on ne trouve pas dans les vulgarisations et que la simulation rend.

   La dérivation classique du cas rigide oublie que le satellite tourne. Un
   satellite réel présente toujours la même face à sa planète : il tourne sur
   lui-même à la vitesse de son orbite. Un grain posé sur sa surface subit donc,
   en plus de la marée, la force centrifuge de cette rotation. Les deux
   s'ajoutent, la somme vaut 3n²x au lieu de 2n²x, et le coefficient passe de
   2^(1/3) à 3^(1/3) :

       d_synchrone = 3^(1/3) · r · (M/m)^(1/3) ≈ 1,442 · r · (M/m)^(1/3)

   C'est exactement la condition « le rayon du satellite dépasse son rayon de
   Hill », et c'est ce que mesure le contrôle 4 : la simulation converge vers
   1,4433 quand le rapport de masses tend vers zéro, contre 1,442 25 prédit,
   soit 0,07 % d'écart. Elle ne converge PAS vers 1,26.

   Le coefficient 1,26 des manuels n'est donc pas faux, il répond à une autre
   question : celle d'un satellite qui ne tournerait pas. Il n'en existe pas.
   On garde les deux, et l'on dit lequel la simulation retrouve. */
function rocheRigideSynchrone(rSatellite, M, m){
  return Math.cbrt(3) * rSatellite * Math.cbrt(M/m);
}

/* Les deux limites en rapport de DENSITÉS.
   @param rPrimaire  rayon de la PRIMAIRE — et c'est bien celui-là. Voir le
                     piège raconté dans l'en-tête : c'est l'erreur qu'on a
                     faite, et elle ne se voit pas dans la formule.
   @param rhoPrimaire, rhoSatellite  densités moyennes, même unité. */
function rocheParDensites(rPrimaire, rhoPrimaire, rhoSatellite){
  const f = rPrimaire * Math.cbrt(rhoPrimaire/rhoSatellite);
  return { rigide: ROCHE_RIGIDE * f, fluide: ROCHE_FLUIDE * f,
           rapport: ROCHE_FLUIDE/ROCHE_RIGIDE };
}

/* Rayon de Hill — ce n'est PAS une limite de Roche, et la confusion est
   fréquente parce que les deux vont en (m/M)^(1/3).

   Roche dit : à quelle distance de ma planète suis-je déchiré par sa marée ?
   Hill dit  : jusqu'où puis-je garder une lune malgré l'étoile ?

       r_H = d · (1 − e) · (m / 3M)^(1/3)

   Le facteur (1 − e) prend le péricentre, où la contrainte est la plus dure ;
   sans lui, on surestime la zone stable d'une orbite excentrique. */
function rayonDeHill(d, M, m, e){
  return d * (1 - (e || 0)) * Math.cbrt(m / (3*M));
}

/* Un satellite cohésionné à l'intérieur de la limite fluide n'est pas une
   anomalie : Pan et Métis en sont. La question utile est de savoir de combien
   on est en deçà, et sous quelle hypothèse. Cette fonction rend le diagnostic
   complet plutôt qu'un booléen, parce qu'un booléen ici mentirait. */
function diagnosticRoche(d, rSatellite, M, m){
  const dr = rocheRigide(rSatellite, M, m);
  const df = rocheFluide(rSatellite, M, m);
  return {
    d, rigide: dr, fluide: df,
    ratioRigide: d/dr, ratioFluide: d/df,
    verdict: d > df ? "au-delà des deux limites — intact dans tous les cas"
           : d > dr ? "entre les deux — un corps fluide se disloque, un corps " +
                      "rigide tient ; un tas de gravats dépend de son frottement"
                    : "en deçà des deux — seule la cohésion du matériau peut le sauver",
  };
}

/* ---------------------------------------------------------------------------
   DÉTECTER QU'UN SYSTÈME S'EST DÉFAIT
   --------------------------------------------------------------------------- */

/* Un veilleur : il retient l'état de départ et sait dire, à tout instant, ce
   qui a changé au point qu'on ne puisse plus parler du même système.

   Trois façons pour un système de se défaire, et il faut les trois. Se
   contenter du demi-grand axe rate l'éjection (a devient négatif, ce qui peut
   passer pour une valeur numérique parmi d'autres) ; se contenter de la
   distance rate la collision ; se contenter des collisions rate la lente
   migration qui finit par tout casser mille ans plus tard.

     · ÉJECTION — le corps n'est plus lié au reste (énergie relative au
       barycentre positive) ET s'éloigne au-delà de `distanceEjection`. Les deux
       conditions, pas une seule : un corps sur une orbite très excentrique est
       momentanément loin sans être libre, et un corps passant au péricentre
       d'une orbite hyperbolique est libre sans être encore loin.
     · COLLISION — la distance entre deux corps passe sous la somme de leurs
       rayons. Détectée APRÈS coup : avec un pas fixe, deux corps rapides
       peuvent se traverser entre deux pas sans qu'on le voie. La détection est
       donc fiable pour des rencontres lentes devant le pas, et le veilleur le
       signale quand la distance parcourue en un pas dépasse la somme des
       rayons — c'est le seul honnête moyen de dire « je n'ai peut-être rien vu ».
     · DÉRIVE DU DEMI-GRAND AXE — |a(t) − a(0)|/a(0) au-delà d'un seuil. C'est
       le signe d'un système qui se réorganise sans que rien de spectaculaire
       n'arrive, et c'est celui qui se voit le moins à l'œil.

   ATTENTION au réglage de `deriveA`, et c'est un piège qu'on s'est tendu. Le
   demi-grand axe employé ici est OSCULATEUR : il oscille naturellement, à la
   période synodique, d'une amplitude qui croît avec la masse des perturbateurs.
   Pour des planètes de 10⁻⁵ masse solaire, cette oscillation vaut quelques
   pour mille et un seuil de 2 % convient ; pour des planètes de 10⁻³, elle
   dépasse 50 % dès les premières révolutions et TOUT seuil raisonnable se
   déclenche au deuxième tour, sur un système parfaitement sain. Le seuil doit
   donc être choisi au-dessus de l'oscillation propre du système, ce que le
   module ne peut pas deviner : c'est pourquoi il est un paramètre et non une
   constante. En cas de doute, faire tourner quelques dizaines de révolutions,
   regarder de combien `a` bat, et prendre le triple. */
function veille(s, options){
  options = options || {};
  const iCentre = options.centre === undefined ? 0 : options.centre;
  const seuilA  = options.deriveA === undefined ? 0.05 : options.deriveA;
  const cdm0 = centreDeMasse(s);
  let etendue = 0;
  for(let i = 0; i < s.n; i++){
    const dx = s.p[3*i]-cdm0.p[0], dy = s.p[3*i+1]-cdm0.p[1], dz = s.p[3*i+2]-cdm0.p[2];
    etendue = Math.max(etendue, Math.sqrt(dx*dx+dy*dy+dz*dz));
  }
  const dEject = options.distanceEjection || 100*etendue;

  const a0 = [];
  for(let i = 0; i < s.n; i++) a0.push(i === iCentre ? NaN : elements(s, i, iCentre).a);
  const E0 = energie(s).total;
  const L0 = momentCinetique(s).norme;

  return {
    a0, E0, L0, etendue, dEject, iCentre, seuilA,

    /* Rend { stable, evenements[] }. Aucun effet de bord sur le système. */
    controle(){
      const ev = [];
      const cdm = centreDeMasse(s);

      for(let i = 0; i < s.n; i++){
        // --- éjection
        const dx = s.p[3*i]-cdm.p[0], dy = s.p[3*i+1]-cdm.p[1], dz = s.p[3*i+2]-cdm.p[2];
        const wx = s.v[3*i]-cdm.v[0], wy = s.v[3*i+1]-cdm.v[1], wz = s.v[3*i+2]-cdm.v[2];
        const r = Math.sqrt(dx*dx+dy*dy+dz*dz);
        let Mautres = 0;
        for(let j = 0; j < s.n; j++) if(j !== i) Mautres += s.m[j];
        const eSpec = 0.5*(wx*wx+wy*wy+wz*wz) - s.G*Mautres/Math.max(r, 1e-300);
        if(eSpec > 0 && r > this.dEject){
          ev.push({ type:"ejection", corps:i, nom:s.nom[i], t:s.t, r,
                    detail:"énergie relative au barycentre positive et distance " +
                           "au-delà du seuil" });
        }

        // --- dérive du demi-grand axe
        if(i !== iCentre && isFinite(this.a0[i]) && this.a0[i] > 0){
          const el = elements(s, i, iCentre);
          if(!el.lie){
            ev.push({ type:"deliaison", corps:i, nom:s.nom[i], t:s.t,
                      detail:"orbite devenue hyperbolique autour du corps de référence" });
          } else {
            const d = Math.abs(el.a - this.a0[i]) / this.a0[i];
            if(d > this.seuilA){
              ev.push({ type:"derive-a", corps:i, nom:s.nom[i], t:s.t,
                        a0:this.a0[i], a:el.a, ecart:d });
            }
          }
        }
      }

      // --- collisions, et l'aveu quand on n'a peut-être rien vu
      for(let i = 0; i < s.n; i++) for(let j = i+1; j < s.n; j++){
        const dx = s.p[3*j]-s.p[3*i], dy = s.p[3*j+1]-s.p[3*i+1], dz = s.p[3*j+2]-s.p[3*i+2];
        const r = Math.sqrt(dx*dx+dy*dy+dz*dz);
        const somme = s.rayon[i] + s.rayon[j];
        if(somme > 0 && r < somme){
          ev.push({ type:"collision", corps:[i,j], nom:[s.nom[i],s.nom[j]], t:s.t,
                    r, rayons:somme });
        }
      }

      return { stable: ev.length === 0, evenements: ev, t: s.t };
    },

    /* La dérive des invariants depuis le départ, séparée en ce qui oscille et
       ce qui dérive — voir le piège 4. Ne peut pas se calculer sur un seul
       point : il faut la série, d'où `mesureDerive` plus bas. */
    ecarts(){
      const E = energie(s).total, L = momentCinetique(s).norme;
      return {
        energie: Math.abs((E - this.E0) / this.E0),
        moment:  this.L0 > 0 ? Math.abs((L - this.L0) / this.L0) : Math.abs(L),
      };
    },
  };
}

/* Sépare l'oscillation de la dérive dans une série d'invariants.

   La bande : demi-écart entre le maximum et le minimum, rapportée à la valeur
   de départ. C'est ce qu'un symplectique garde constant.
   La dérive : pente de la droite des moindres carrés, ramenée sur toute la
   durée de la série. C'est ce qu'un symplectique garde nul et ce que
   Runge-Kutta laisse filer.

   Les deux ensemble, et jamais l'une sans l'autre : une bande large avec une
   dérive nulle est un bon intégrateur au pas grossier ; une bande étroite avec
   une dérive non nulle est un intégrateur qui a l'air bon et qui ne l'est pas.
   C'est exactement la distinction que le contrôle 2 doit rendre visible. */
function mesureDerive(serie){
  const n = serie.length;
  if(n < 2) throw new Error("ncorps : série trop courte pour mesurer une dérive.");
  const v0 = serie[0].valeur;
  let min = Infinity, max = -Infinity;
  let st = 0, sv = 0, stt = 0, stv = 0;
  const t0 = serie[0].t;
  for(const e of serie){
    min = Math.min(min, e.valeur); max = Math.max(max, e.valeur);
    const t = e.t - t0;
    st += t; sv += e.valeur; stt += t*t; stv += t*e.valeur;
  }
  const den = n*stt - st*st;
  const pente = den !== 0 ? (n*stv - st*sv) / den : 0;
  const duree = serie[n-1].t - t0;
  const ref = Math.abs(v0) > 0 ? Math.abs(v0) : 1;
  return {
    bande:  (max - min) / 2 / ref,          // demi-amplitude relative
    derive: Math.abs(pente * duree) / ref,  // ce que la pente a coûté en tout
    pente, min, max, v0, duree,
  };
}

/* ---------------------------------------------------------------------------
   L'ENTORSE, EN CLAIR
   --------------------------------------------------------------------------- */

/* Valeur d'adoucissement conseillée : le plus grand rayon physique du système,
   à défaut un dix-millième de l'étendue.

   Le raisonnement : en deçà du rayon d'un corps, deux corps se sont touchés, et
   ce qui se passe alors n'est plus de la mécanique céleste — mieux vaut
   l'adoucir que le calculer faux. Si aucun rayon n'est donné, on prend une
   fraction de l'étendue assez petite pour ne rien changer aux orbites (l'erreur
   relative sur la force à distance d vaut environ 1,5·(ε/d)², soit 1,5 × 10⁻⁸
   au bord du système) et assez grande pour borner l'accélération. */
function adoucissementConseille(s){
  let rmax = 0;
  for(let i = 0; i < s.n; i++) rmax = Math.max(rmax, s.rayon[i]);
  if(rmax > 0) return rmax;
  const cdm = centreDeMasse(s);
  let etendue = 0;
  for(let i = 0; i < s.n; i++){
    const dx = s.p[3*i]-cdm.p[0], dy = s.p[3*i+1]-cdm.p[1], dz = s.p[3*i+2]-cdm.p[2];
    etendue = Math.max(etendue, Math.sqrt(dx*dx+dy*dy+dz*dz));
  }
  return etendue * 1e-4;
}

/* La liste, en français, de ce que ce calcul a d'approché. Destinée à être
   affichée telle quelle : sur ce site, une approximation qui ne s'affiche pas
   est un mensonge par omission. */
function entorses(s){
  const l = [];
  if(s.eps > 0){
    l.push({
      quoi: "adoucissement des forces (Plummer)",
      valeur: s.eps,
      effet: "en deçà de ε = " + s.eps.toPrecision(3) + ", la gravité simulée " +
             "est plus faible que la vraie ; une rencontre plus serrée que cela " +
             "n'est pas décrite. L'erreur relative sur la force vaut environ " +
             "1,5·(ε/r)², soit un pour mille à r = 39 ε.",
      pourquoi: "sans lui, une rencontre serrée dépasse ce qu'un pas fixe peut " +
                "suivre, et le corps est éjecté par le calcul et non par la physique.",
    });
  }
  l.push({
    quoi: "gravitation newtonienne",
    effet: "aucune correction relativiste. La précession du périhélie de " +
           "Mercure, 43″ par siècle, n'y est pas ; rien de ce qui se passe à " +
           "quelques rayons de Schwarzschild n'y est non plus.",
    pourquoi: "le module sert à poser des planètes dans un système, pas à " +
              "approcher un horizon. Pour cela, voir kerr.js.",
  });
  l.push({
    quoi: "corps ponctuels",
    effet: "aucun aplatissement, aucune marée, aucun couple de rotation. Un " +
           "satellite très proche de sa planète ne migrera pas comme il devrait.",
    pourquoi: "les termes de marée demandent des paramètres (nombre de Love, " +
              "facteur de dissipation) qu'on ne saurait pas sourcer.",
  });
  l.push({
    quoi: "pas de temps fixe, collisions détectées après coup",
    effet: "deux corps rapides peuvent se traverser entre deux pas sans être " +
           "signalés. Le veilleur ne peut affirmer une collision, seulement " +
           "en constater une qu'il a vue.",
    pourquoi: "un pas adaptatif détruirait la conservation de l'énergie à long " +
              "terme, qui est la raison d'être de ce module.",
  });
  return l;
}

/* ---------------------------------------------------------------------------
   RACCOURCIS UTILES
   --------------------------------------------------------------------------- */

/* Pose un système « une étoile et des planètes » depuis des éléments
   képlériens, en repère héliocentrique puis recentré sur le barycentre.

   @param mEtoile  masse de l'étoile
   @param planetes [{ m, a, e, i, Omega, omega, M, nom, rayon }] angles en radians
   @param options  { G, ... } comme `systeme`

   L'ordre compte : chaque planète est posée avec μ = G(M★ + m_p), et non
   G·M★. Voir la remarque sur μ dans `elements`. */
function systemeKeplerien(mEtoile, planetes, options){
  options = options || {};
  const G = options.G !== undefined ? options.G : G_SI;
  const corps = [{ m: mEtoile, p:[0,0,0], v:[0,0,0],
                   nom: options.nomEtoile || "étoile", rayon: options.rayonEtoile || 0 }];
  for(const pl of planetes){
    const et = etatDepuisElements(pl, G*(mEtoile + pl.m));
    corps.push({ m: pl.m, p: et.p, v: et.v, nom: pl.nom, rayon: pl.rayon || 0 });
  }
  const s = systeme(corps, options);
  return centre(s);
}

/* Une orbite circulaire à deux corps, prête à intégrer, dans le repère du
   barycentre. Le cas d'école dont on se sert pour tout contrôler. */
function deuxCorps(m1, m2, a, e, options){
  e = e || 0;
  return systemeKeplerien(m1, [{ m:m2, a, e:e, i:0, Omega:0, omega:0, M:0,
                                 nom:"compagnon" }], options);
}

/* Période képlérienne exacte du problème à deux corps — la référence
   analytique contre laquelle l'intégrateur se juge, et non un résultat de
   l'intégrateur. T = 2π√(a³/G(M+m)). */
function periodeKepler(a, M, m, G){
  return 2*Math.PI*Math.sqrt(a*a*a / ((G === undefined ? G_SI : G) * (M + (m||0))));
}

global.NCORPS = {
  // poser
  systeme, systemeKeplerien, deuxCorps, copie, centre,
  // avancer
  pas, avance, accelerations,
  // invariants
  energie, momentCinetique, quantiteDeMouvement, centreDeMasse,
  // orbites
  elements, elementsDepuisEtat, etatDepuisElements, periodeKepler,
  // Roche
  rocheRigide, rocheFluide, rocheRigideSynchrone, rocheParDensites,
  rayonDeHill, diagnosticRoche, ROCHE_FLUIDE, ROCHE_RIGIDE,
  // stabilité
  veille, mesureDerive,
  // approximations
  adoucissementConseille, entorses,
  // constantes et unités
  UNITES, G_SI, G_UA_JOUR_MSOL, UA_M, JOUR_S, AN_JULIEN_J, GM_SOLEIL, M_SOLEIL,
  YOSH_W0, YOSH_W1,
};

})(typeof window !== "undefined" ? window : this);
