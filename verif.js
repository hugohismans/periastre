/* ============================================================================
   Le harnais de vérification.

   Il existe pour une raison précise : personne ne peut plus regarder. Hugo n'a
   pas toujours son ordinateur, et la vignette du navigateur n'est pas toujours
   composée de mon côté — auquel cas je ne vois rien non plus, et les transitions
   CSS ne s'exécutent même pas.

   Le goulot du projet n'est donc pas le travail, c'est la VÉRIFICATION. Tant
   qu'elle demande un humain qui regarde, rien n'avance en son absence. Ce
   fichier rejoue en une passe tout ce qui a été contrôlé à la main pendant les
   sessions précédentes.

   ---------------------------------------------------------------------------
   IL N'INVENTE RIEN

   Tout ce dont il a besoin existait déjà, éparpillé :

     ESSAIS              les quatre essais de physique, appelables directement
     README.md           leurs valeurs mesurées, figées — la table d'or
     VERIFS_QUETE        quatre prédicats d'état de la quête d'accueil
     etatCourant()       la sérialisation, déjà écrite pour la touche « c »
     boucle(now)         pilotable à la main avec des horodatages synthétiques
     window.UI           les 215 clés d'interface, pour traquer les clés nues

   Le harnais ne fait que les appeler dans le bon ordre et comparer.

   ---------------------------------------------------------------------------
   CE QU'IL NE PEUT PAS FAIRE SEUL

   Redimensionner la fenêtre et changer de langue demandent l'un un pilote
   extérieur, l'autre un rechargement. `mesurePage()` contrôle donc la mise en
   page À LA TAILLE COURANTE, et c'est à l'appelant de redimensionner entre deux
   appels. De même pour les deux langues.

   ---------------------------------------------------------------------------
   DEUX PIÈGES PAYÉS, À NE PAS REPAYER

   1. Les transitions CSS ne s'exécutent pas quand la page n'est pas composée :
      une mesure de position y lit l'état de DÉPART. J'ai failli corriger un
      débordement de cent vingt-six pixels qui n'existait pas. D'où `pose()`,
      qui force la fin des transitions avant toute mesure géométrique.

   2. Presque tout s'anime — l'équipage, le drone, le disque, l'orbite. Une
      mesure répétée sans figer ces horloges compare deux images différentes et
      conclut au bruit. D'où `fige()`.
   ============================================================================ */

(function(global){
"use strict";

// --------------------------------------------------------------- les attendus

/* La table d'or, recopiée de README.md.

   Ce ne sont pas les valeurs théoriques — ce sont les valeurs MESURÉES par le
   moteur le jour où elles ont été publiées. C'est ce qui en fait un contrôle de
   non-régression : la théorie ne bougera pas, le moteur si. */
const OR = {
  "banc.essai.photon.nom":    { attendu: 1.500033, tolerance: 5e-5 },
  "banc.essai.ombre.nom":     { attendu: 2.598070, tolerance: 5e-5 },
  "banc.essai.deflexion.nom": { attendu: 0.002003, tolerance: 5e-6 },
  "banc.essai.isco.nom":      { attendu: 3.00223,  tolerance: 5e-4 },
};

// Les tailles d'écran qui ont réellement produit des défauts sur ce projet.
const FORMATS = [
  { nom: "iPhone portrait",  l: 390, h: 844 },
  { nom: "iPhone paysage",   l: 852, h: 393 },
  { nom: "petit portrait",   l: 375, h: 812 },
];

// ------------------------------------------------------------------- outillage

const resultats = [];
let enCours = null;

function ouvre(nom){ enCours = { nom, points: [] }; resultats.push(enCours); return enCours; }

/* Un point de contrôle. `attendu` peut être une valeur ou la chaîne « vrai ». */
function point(nom, ok, attendu, mesure, note){
  const p = { nom, ok: !!ok, attendu, mesure };
  if(note) p.note = note;
  (enCours ? enCours.points : resultats).push(p);
  return p;
}

function proche(a, b, tol){ return Math.abs(a - b) <= tol; }

/* Force la fin de toutes les transitions avant de mesurer.

   Sans cela, sur une page non composée, `getBoundingClientRect` rend la
   position de départ de l'animation et non celle d'arrivée. */
function pose(){
  const el = document.querySelectorAll("*");
  const anciens = [];
  el.forEach(n => { anciens.push(n.style.transition); n.style.transition = "none"; });
  void document.body.offsetWidth;                  // on force le recalcul
  return () => el.forEach((n, i) => { n.style.transition = anciens[i]; });
}

/* Fige tout ce qui s'anime, et rend de quoi le dégeler.

   L'équipage marche, le drone tourne, le disque tourne, l'orbite avance. Deux
   mesures successives sans ce gel comparent deux images différentes — c'est ce
   qui m'a fait conclure trois fois à du bruit qui n'existait pas.

   ---------------------------------------------------------------------------
   IL FAUT AUSSI RENDRE LA CAMÉRA AU CONTRÔLE

   Le 7 août, `couture()` réglait `cam.azim` puis lisait 1,05 au lieu de 0,54.
   L'ouverture cinématique (`index.html:6282`) réécrit dist, elev ET azim à
   chaque image pendant neuf secondes : tout contrôle lancé sur une page fraîche
   mesurait un travelling, depuis un point de vue qu'il n'avait pas choisi.

   Le symptôme était sournois — il disparaissait dès qu'on rejouait le contrôle
   à la main, puisque les neuf secondes étaient alors écoulées. C'est exactement
   la forme d'un contrôle qui ment : d'accord avec soi-même quand on l'observe.

   On la coupe ici plutôt que dans chaque contrôle, parce que le piège vaut pour
   tous ceux qui lisent des pixels, pas seulement pour celui qui l'a révélé. */
function fige(){
  const av = { facteur: salon.facteur, horloge: salon.horloge, p: salon.p.slice(),
               v: salon.v.slice(), images, cumul, cinema: cinema.actif };
  salon.facteur = 0;
  cinema.actif = false;
  return () => {
    salon.facteur = av.facteur; salon.horloge = av.horloge;
    salon.p = av.p; salon.v = av.v; images = av.images; cumul = av.cumul;
    cinema.actif = av.cinema;
  };
}

/* Avance la boucle d'un nombre d'images, à cadence constante et sans laisser la
   bascule de résolution se déclencher — elle change la taille du tampon, donc
   toute mesure de pixel prise à cheval dessus est fausse. */
function avanceImages(n, horloge){
  let t = horloge || performance.now();
  for(let i = 0; i < n; i++){ images = 0; cumul = 0; t += 16.7; boucle(t); }
  return t;
}

// ============================================================ les contrôles

/* 1. LE BLOC DE SCRIPT VIT.

   Le contrôle le plus rentable du dépôt. Le bloc principal fait trois mille
   cinq cents lignes en portée globale ; une variable employée avant sa ligne de
   déclaration le tue ENTIÈREMENT, et le symptôme est muet — la moitié du site
   disparaît sans un message dans la console. C'est arrivé deux fois.

   On teste donc des noms déclarés TARD dans le fichier : s'ils répondent, tout
   ce qui précède a été évalué. */
function vivant(){
  ouvre("Le bloc de script vit");
  const tardifs = {
    vueW: "number", boucle: "function", redimensionne: "function",
    dessine: "function", finBoucle: "function", dessineHabitacle: "function",
    T: "function", toileEcran: "function", seuilTape: "function",
  };
  for(const [nom, type] of Object.entries(tardifs)){
    let vu = "absent";
    try { vu = eval("typeof " + nom); } catch(e){ vu = "zone morte"; }
    point(nom, vu === type, type, vu);
  }
  const modules = ["KERR","VOYAGE","RECUL","ETOILES_S","VAISSEAU","PERSONNAGE",
                   "ROBOT","MUSIQUE","CONTENU","UI"];
  modules.forEach(m => point("module " + m, typeof global[m] === "object", "object", typeof global[m]));

  // La collision désamorcée doit le rester.
  point("VOYAGE n'est pas ECHELLE",
        !global.ECHELLE || global.VOYAGE !== global.ECHELLE,
        "deux objets distincts",
        global.ECHELLE ? (global.VOYAGE === global.ECHELLE ? "COLLISION" : "distincts") : "echelle.js non chargé");
  point("VOYAGE.enChemin survit", typeof (global.VOYAGE||{}).enChemin === "function",
        "function", typeof (global.VOYAGE||{}).enChemin);
  return enCours;
}

/* 1 bis. LE LIEU EST COHÉRENT.

   Depuis la refonte, `lieu` est l'unique autorité sur l'endroit où l'on se
   trouve, et les anciens drapeaux en sont des vues. L'invariant tient tant que
   l'on passe par `vaAu()` — mais `sondeSuivie` reste une variable libre, et
   quiconque l'écrit à la main peut désaccorder l'ensemble.

   On ne peut pas l'interdire ; on peut le VOIR. C'est tout l'intérêt d'avoir un
   invariant : il se contrôle. Ce test le fait aux quatre coins de l'espace des
   états, en enchaînant les transitions comme un joueur les enchaînerait. */
function coherence(){
  ouvre("Le lieu est cohérent");
  const LIEUX = ["libre", "salon", "sonde"];
  const dit = () => ({ lieu, salonActif: salon.actif, surSonde: sondeSuivie !== null });
  const juge = (nom, e) => {
    const connu = LIEUX.indexOf(e.lieu) >= 0;
    const accord = e.salonActif === (e.lieu === "salon") && e.surSonde === (e.lieu === "sonde");
    point(nom, connu && accord, "lieu connu, vues accordées",
          e.lieu + " · salon=" + e.salonActif + " · sonde=" + e.surSonde);
  };

  const av = lieu;
  juge("au départ", dit());
  if(!sondes.length){ pluie(12); avanceImages(30); }

  const b = id => document.getElementById(id);
  if(!salon.actif) b("b-salon").click();   juge("après être entré au salon", dit());
  b("b-sonde").click();                    juge("après être monté sur une sonde", dit());
  b("b-salon").click();                    juge("après être revenu au salon", dit());
  b("b-salon").click();                    juge("après être ressorti", dit());

  // On ne peut être qu'à un endroit : c'est vrai par construction, on le dit.
  point("un seul lieu à la fois",
        [lieu === "libre", lieu === "salon", lieu === "sonde"].filter(Boolean).length === 1,
        1, [lieu === "libre", lieu === "salon", lieu === "sonde"].filter(Boolean).length);

  /* On REND l'état exactement comme on l'a trouvé.

     Ce contrôle déplace le joueur, c'est son travail. Mais il le rendait mal —
     seul le cas du salon était restauré — et les contrôles suivants mesuraient
     alors une page qui n'était plus celle qu'on croyait. `mesurePage` a ainsi
     rapporté un échec qui n'appartenait pas au moment mesuré.

     Un test qui laisse le monde différent de comme il l'a pris fausse tous ceux
     qui le suivent. */
  if(typeof vaAu === "function") vaAu(av);
  return enCours;
}

/* 1 quater. LA TABLE DES TRANSITIONS, DANS TOUS LES SENS.

   `coherence()` juste au-dessus passe par les BOUTONS, et prouve que
   l'interface et l'état disent la même chose. Celui-ci passe par `vaAu()`
   directement, et balaie les NEUF transitions ordonnées au lieu du seul chemin
   qu'un joueur emprunte le plus souvent.

   Et il ne demande pas si le lieu est juste — l'autre le fait déjà. Il demande
   ce qui SURVIT à un changement de lieu et ne devrait pas. C'est là que se
   logent les états impossibles : un voyage encore armé après qu'on a quitté le
   salon restait armé pour toujours, sans jamais avancer, et l'on ne pouvait
   plus ni arriver ni revenir. Ce défaut-là a été payé une fois.

   POURQUOI IL COMPTE MAINTENANT : la salle de tir sera un quatrième lieu. Le
   commentaire d'index.html l'annonce — « ils coûteront un mot ici et deux `case`
   plus bas ». Ce contrôle est ce qui rendra cette phrase vraie, parce qu'il
   échouera si le nouveau lieu oublie d'éteindre quelque chose. */
function lieux(){
  ouvre("La table des transitions");
  const LIEUX = ["libre", "salon", "sonde"];
  const av = lieu;

  if(!sondes.length){ pluie(12); avanceImages(30); }

  // Ce qui ne doit JAMAIS être vrai en même temps que le lieu courant.
  const invariants = () => [
    ["un seul lieu à la fois",
     LIEUX.filter(l => lieu === l).length === 1,
     lieu],
    ["`salon.actif` suit `lieu`",
     salon.actif === (lieu === "salon"),
     "salon.actif=" + salon.actif],
    ["on n'est sur une sonde que si l'on en a une",
     (sondeSuivie !== null) === (lieu === "sonde"),
     "sondeSuivie=" + sondeSuivie],
    ["aucun voyage ne survit hors du salon",
     lieu === "salon" || !TELESCOPE.trajet,
     "trajet=" + (TELESCOPE.trajet ? "armé" : "aucun")],
    ["aucun recul ne survit hors du salon",
     lieu === "salon" || !RECUL.etat.actif,
     "recul=" + RECUL.etat.actif],
    ["le plan d'ouverture ne survit pas à une prise de commande",
     lieu === "libre" || !cinema.actif,
     "cinema=" + cinema.actif],
  ];

  const juge = ou => {
    for(const [nom, vrai, mesure] of invariants())
      if(!vrai){ point(ou + " — " + nom, false, "vrai", mesure); return false; }
    return true;
  };

  /* Les neuf transitions ordonnées, la diagonale comprise : `vaAu` sur le lieu
     où l'on est déjà doit être un non-événement, et c'est aussi un invariant. */
  let toutes = 0, bonnes = 0;
  for(const de of LIEUX) for(const vers of LIEUX){
    vaAu(de);
    if(lieu !== de) continue;              // ce départ n'est pas atteignable ici
    vaAu(vers);
    toutes++;
    if(juge(de + " → " + vers)) bonnes++;
  }
  point("les transitions tiennent leurs invariants", bonnes === toutes,
        toutes + " sur " + toutes, bonnes + " sur " + toutes,
        "six invariants vérifiés après chacune");

  /* LE CAS QUI A COÛTÉ CHER, REJOUÉ EN ENTIER.

     On arme un vrai voyage depuis le salon, on en sort, et l'on regarde s'il
     est mort avec. C'est le seul invariant de la liste qui demande de METTRE le
     monde dans l'état dangereux plutôt que d'espérer l'y trouver. */
  vaAu("salon");
  if(typeof lanceVoyage === "function" && typeof DESTINATIONS !== "undefined"){
    const d = DESTINATIONS[0];
    lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
    point("un voyage s'arme bien depuis le salon", !!TELESCOPE.trajet,
          "armé", TELESCOPE.trajet ? "armé" : "AUCUN — le reste du test ne prouve rien");
    vaAu("libre");
    point("et il meurt en quittant le salon",
          !TELESCOPE.trajet && !RECUL.etat.actif, "éteint",
          "trajet=" + (TELESCOPE.trajet ? "ARMÉ" : "éteint")
          + " recul=" + RECUL.etat.actif,
          "sinon il reste armé pour toujours sans jamais avancer");
  }

  // Entrer sur une sonde qu'on n'a pas doit être refusé, pas subi.
  vaAu("libre");
  const gardees = sondes.slice();
  sondes.length = 0;
  vaAu("sonde");
  point("on n'entre pas sur une sonde quand il n'y en a aucune",
        lieu !== "sonde" && sondeSuivie === null, "refusé",
        lieu + " · sondeSuivie=" + sondeSuivie,
        "`vaAu` porte la précondition, à côté de l'unique écriture de `lieu`");
  sondes.push(...gardees);

  vaAu(av);
  return enCours;
}

/* 1 ter. LE TEMPS AVANCE À LA VITESSE QU'ON LUI DEMANDE.

   Ce contrôle existe parce qu'un défaut lui a échappé : en « temps réel », le
   disque tournait SIX CENT VINGT-DEUX FOIS trop vite. Deux mécanismes
   écrivaient la même horloge — le réglage de la vue libre et la commande du mur
   du salon — et régler l'un ne retirait pas l'autre.

   Aucun œil ne peut vérifier un facteur de temps ; on ne sait pas si un gaz
   tourne six cents fois trop vite en le regardant. Une horloge, en revanche, se
   compare. C'est exactement le genre de chose qu'un harnais doit porter, et
   celui-ci ne le portait pas.

   La règle, à chaque fois qu'un défaut est trouvé à l'œil : on le corrige, puis
   on ajoute le contrôle qui l'aurait vu. Sans quoi il revient. */
function tempsJuste(){
  ouvre("Le temps avance à la vitesse demandée");
  if(typeof facteurTemps !== "function"){
    point("facteurTemps accessible", false, "function", typeof facteurTemps);
    return enCours;
  }
  const degele = fige();
  const avLieu = lieu, avF = salon.facteur;
  try {
    // Une image, un pas connu : c'est la seule façon de mesurer sans que
    // l'horloge du test ne se mêle de celle du site.
    const pas = (f, ou) => {
      vaAu(ou);
      salon.facteur = f;
      let t = performance.now();
      images = 0; cumul = 0; t += 16.7; boucle(t);       // une image d'amorce
      const av = TEMPS.geo;
      images = 0; cumul = 0; t += 16.7; boucle(t);       // celle qu'on mesure
      return TEMPS.geo - av;
    };
    const DT = 0.0167, SPU = 42.34;

    for(const f of [1, 60, 600]){
      const d = pas(f, "salon");
      const attendu = f*DT/SPU;
      point("au salon, mur ×" + f, proche(d/attendu, 1, 0.02),
            +attendu.toFixed(6), +d.toFixed(6),
            "rapport " + (d/attendu).toFixed(3));
    }

    // Et en vue libre, où c'est l'autre commande qui décide.
    const d = pas(VITESSES[TEMPS.cran].mult, "libre");
    const attendu = VITESSES[TEMPS.cran].mult*DT/SPU;
    point("en vue libre, cran " + TEMPS.cran, proche(d/attendu, 1, 0.02),
          +attendu.toFixed(6), +d.toFixed(6), "rapport " + (d/attendu).toFixed(3));

    /* Le disque tourne-t-il à la vitesse képlérienne ? C'est le nuanceur qui le
       fait, donc on ne peut pas le mesurer directement — mais on peut vérifier
       que la formule qu'il applique est la bonne, et que la période qui en sort
       est celle de la physique. */
    const omega = r => 0.707 / Math.pow(r, 1.5);      // ce qu'écrit le nuanceur
    const theorie = r => Math.sqrt(PHYSIQUE.M / (r*r*r));
    for(const r of [3, 6, 11]){
      point("rotation du gaz à r = " + r, proche(omega(r), theorie(r), 1e-3*theorie(r)),
            +theorie(r).toFixed(6), +omega(r).toFixed(6), "Ω = √(M/r³)");
    }
    // Et sa période au temps réel, en secondes : trente-deux minutes à l'ISCO.
    const periode = 2*Math.PI / (theorie(3) / SPU);
    point("une révolution à l'ISCO, au temps réel",
          periode > 1800 && periode < 2100, "≈ 1955 s", Math.round(periode) + " s");

    /* L'INVARIANT EST-IL IMPOSSIBLE À VIOLER, ou seulement interdit ?

       Ce n'est pas la même chose, et c'est toute la valeur du chantier. La
       première correction du disque à 622× consistait à n'écrire qu'à un seul
       endroit : juste, et fragile — rien n'empêchait le prochain de recommencer.
       Depuis que l'horloge vit dans `temps.js`, elle n'a qu'un accesseur en
       lecture, et le second écrivain n'est plus interdit : il est indicible.

       On le vérifie en ESSAYANT vraiment. Un contrôle qui se contenterait de
       lire la valeur ne dirait rien de ce qui la protège. */
    const avGeo = TEMPS.geo;
    let jete = null;
    try { (new Function('"use strict"; window.TEMPS.geo = 1e9;'))(); }
    catch(e){ jete = e.constructor.name; }
    point("l'horloge refuse d'être écrite du dehors",
          jete === "TypeError" && TEMPS.geo === avGeo,
          "TypeError, valeur inchangée",
          (jete || "rien de jeté") + ", " + (TEMPS.geo === avGeo ? "inchangée" : "CHANGÉE"),
          "un seul écrivain, garanti par la structure et non par la mémoire de qui relit");

    /* Le pas de l'image est protégé de la même façon. Et l'écrire depuis ce
       fichier-ci lève AUSSI — `verif.js` est en mode strict, où affecter un
       accesseur en lecture seule est une erreur et non un silence. Il faut donc
       l'attraper, sans quoi le contrôle se casse sur sa propre démonstration.
       C'est arrivé du premier coup, et c'était bon signe. */
    const avPas = TEMPS.pas;
    let jete2 = null;
    try { TEMPS.pas = 12345; } catch(e){ jete2 = e.constructor.name; }
    point("le pas de l'image aussi", jete2 === "TypeError" && TEMPS.pas === avPas,
          "TypeError, valeur inchangée",
          (jete2 || "rien de jeté") + ", " + (TEMPS.pas === avPas ? "inchangé" : "CHANGÉ"));
  } finally {
    salon.facteur = avF;
    vaAu(avLieu);
    degele();
  }
  return enCours;
}

/* 1 quater. LA RÉSOLUTION DESCEND QUAND ÇA RAME, ET REMONTE AVEC PRUDENCE.

   Hugo a signalé des ralentissements sur son iPhone, et je n'ai pas son iPhone.
   Je ne peux donc pas régler les seuils contre son appareil — mais je peux
   prouver que le MÉCANISME fait ce qu'il annonce, et ça, aucun réglage ne le
   remplace : jusqu'ici il n'avait que deux crans, si bien qu'un appareil trop
   lent pour le second n'avait nulle part où descendre. Un défaut de ce genre ne
   se voit pas en regardant — il se voit en comptant les crans.

   On nourrit la boucle d'images lentes et l'on regarde l'échelle tomber. */
function resolution(){
  ouvre("La résolution s'adapte");
  const degele = fige();
  const av = { echelle, tCalme, fenetreMesure, tPrec };
  try {
    // Une horloge synthétique : chaque appel avance de `ms` millisecondes.
    let t = performance.now();
    const nourrit = (n, ms) => { for(let i = 0; i < n; i++){ t += ms; boucle(t); } };

    /* La profondeur est exigée, pas seulement la mécanique. C'est le défaut
       même qu'Hugo a touché : deux crans, et un appareil trop lent pour le
       second n'a nulle part où aller. Un contrôle qui se contente de suivre le
       tableau qu'on lui donne laisserait revenir l'interrupteur d'avant. */
    point("l'échelle a au moins quatre degrés", PALIERS.length >= 4,
          "≥ 4", PALIERS.length, PALIERS.join(" · "));
    point("le dernier tombe sous le sixième de l'aire",
          PALIERS[PALIERS.length-1]**2 <= 1/6,
          "aire ≤ 17 %", (100*PALIERS[PALIERS.length-1]**2).toFixed(0) + " %",
          "de quoi tenir sur un appareil six fois moins puissant");
    point("ils descendent sans se répéter",
          PALIERS.every((v,i) => i === 0 || v < PALIERS[i-1]), "strictement décroissants",
          PALIERS.join(" · "));

    echelle = PALIERS[0]; reechelonne(); tCalme = t; fenetreMesure = 24;
    images = 0; cumul = 0;

    // 40 ms par image, soit 25 par seconde : bien au-delà du seuil de 26 ms.
    nourrit(24, 40);
    point("elle réagit dès la première fenêtre", echelle === PALIERS[1],
          PALIERS[1], echelle, "vingt-quatre images, pas quatre-vingt-dix : l'ouverture est le moment le plus lourd");

    for(let cran = 2; cran < PALIERS.length; cran++){
      nourrit(90, 40);
      point("elle descend au cran " + cran, echelle === PALIERS[cran], PALIERS[cran], echelle);
    }

    nourrit(90, 40);
    point("elle s'arrête au dernier cran", echelle === PALIERS[PALIERS.length-1],
          PALIERS[PALIERS.length-1], echelle, "et ne sort pas du tableau");

    // Maintenant tout va bien — mais elle ne doit PAS remonter tout de suite.
    const bas = echelle;
    nourrit(90*8, 5);        // 3,6 s de calme : trop peu
    point("elle ne remonte pas après quelques secondes", echelle === bas,
          bas, echelle, "changer de résolution se voit ; on ne le fait pas deux fois par orbite");

    nourrit(90*90, 5);       // au-delà des trente secondes exigées
    point("elle remonte après une longue accalmie", echelle > bas,
          "> " + bas, echelle);
    point("elle remonte d'un cran à la fois",
          PALIERS.indexOf(echelle) < PALIERS.length - 1 && echelle < PALIERS[0],
          "ni tout en bas ni tout en haut", echelle,
          "cran " + PALIERS.indexOf(echelle) + " sur " + (PALIERS.length-1));

    // Et une seule image lente repousse le retour au piqué.
    const avant = echelle;
    nourrit(90, 20);         // 20 ms : pas assez pour descendre, assez pour inquiéter
    nourrit(90*40, 5);
    point("une lenteur passagère repousse la remontée", echelle === avant,
          avant, echelle, "le seuil d'inquiétude (14 ms) est plus bas que celui de repli (26 ms)");
  } finally {
    echelle = av.echelle; reechelonne();
    tCalme = av.tCalme; fenetreMesure = av.fenetreMesure; tPrec = av.tPrec;
    degele();
  }
  return enCours;
}

/* 1 quinquies. ON PEUT ÉCRIRE DANS UN CHAMP DE TEXTE.

   Ça paraît absurde à contrôler. Ça ne l'est pas : le site donne des touches au
   jeu — l'espace lâche quatre-vingts sondes, « t » montre les trajectoires,
   « r » efface — et trois gestionnaires de clavier se partagent le travail.
   Deux se gardaient des champs de saisie, le troisième non.

   Résultat : dans N'IMPORTE QUEL champ de texte du site, taper un espace ne
   l'écrivait pas et lâchait quatre-vingts sondes. Hugo l'a trouvé en essayant
   d'écrire un commentaire dans la séance de jugement — c'est-à-dire dans l'outil
   que je venais de bâtir pour recueillir ses commentaires, et dont je venais
   d'agrandir le champ pour qu'il puisse écrire davantage.

   On ne teste pas la frappe : on vérifie que les gestionnaires laissent passer
   l'événement, ce qui est la cause et non le symptôme. */
function saisieLibre(){
  ouvre("On peut écrire dans un champ de texte");
  const zone = document.createElement("textarea");
  zone.style.cssText = "position:fixed;left:-9999px;top:0";
  document.body.appendChild(zone);
  const avSondes = sondes.length, avTraj = montreTraj;
  try {
    zone.focus();
    const touches = [
      [" ", "l'espace"], ["t", "la lettre t"], ["r", "la lettre r"],
      ["p", "la lettre p"], ["v", "la lettre v"], ["c", "la lettre c"],
    ];
    for(const [k, nom] of touches){
      const ev = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
      zone.dispatchEvent(ev);
      point(nom + " s'écrit", !ev.defaultPrevented,
            "non annulée", ev.defaultPrevented ? "ANNULÉE" : "non annulée");
    }
    point("et rien n'a été déclenché dans le jeu",
          sondes.length === avSondes && montreTraj === avTraj,
          avSondes + " sondes", sondes.length + " sondes",
          "six touches frappées dans un champ : le jeu ne doit pas les entendre");
  } finally {
    zone.remove();
  }
  return enCours;
}

/* 2. LE NUANCEUR EST LIÉ.

   Une erreur de compilation GLSL jette au chargement et emporte le bloc — même
   symptôme muet. Deux fois payé aussi, en copiant une correction d'une branche
   du nuanceur dans l'autre où les variables n'ont pas le même nom. */
function nuanceurs(){
  ouvre("Les nuanceurs");
  point("programme du ciel", !!prog && gl.getProgramParameter(prog, gl.LINK_STATUS), "lié",
        prog ? gl.getProgramParameter(prog, gl.LINK_STATUS) : "absent");
  point("programme de l'habitacle", !!progSalon && gl.getProgramParameter(progSalon, gl.LINK_STATUS), "lié",
        progSalon ? gl.getProgramParameter(progSalon, gl.LINK_STATUS) : "absent");
  point("aucune erreur GL en attente", gl.getError() === 0, 0, gl.getError());
  return enCours;
}

/* 3. AUCUNE CLÉ NUE.

   Quand une chaîne d'interface manque, `T()` rend la clé elle-même — et l'on
   voit « panneau.titre » à l'écran. C'est laid, mais surtout invisible au
   relecteur qui ne connaît pas les clés. On balaye donc le document entier et
   l'on compare aux 215 clés connues. */
function clesNues(){
  ouvre("Aucune clé nue affichée (" + (global.LANGUE || "?") + ")");
  const cles = new Set(Object.keys(global.UI || {}));
  const nues = [];
  document.querySelectorAll("*").forEach(n => {
    for(const enf of n.childNodes){
      if(enf.nodeType === 3){
        const s = enf.textContent.trim();
        if(s && cles.has(s)) nues.push(s);
      }
    }
  });
  document.querySelectorAll("[title],[aria-label],[placeholder],[alt]").forEach(n => {
    ["title","aria-label","placeholder","alt"].forEach(a => {
      const v = n.getAttribute(a);
      if(v && cles.has(v.trim())) nues.push(a + "=" + v);
    });
  });
  point("clés nues dans le texte et les attributs", nues.length === 0, 0, nues.length,
        nues.length ? nues.slice(0, 8).join(" · ") : undefined);
  point("le fichier de chaînes est chargé", cles.size > 200, "> 200", cles.size);
  return enCours;
}

/* 4. LES QUATRE GRANDEURS DU BANC.

   `ESSAIS` s'appelle directement : pas besoin du bouton, ni du DOM, ni des
   délais de la chaîne récursive qui l'anime à l'écran.

   On compare à la valeur MESURÉE publiée dans README.md, pas à la théorie :
   c'est ce qui fait de ce contrôle une non-régression du moteur et non un
   rappel de cours. */
function banc(){
  ouvre("Le banc d'essai");
  if(typeof ESSAIS === "undefined"){ point("ESSAIS accessible", false, "tableau", "absent"); return enCours; }
  for(const e of ESSAIS){
    const or = OR[e.nom];
    if(!or){ point(e.nom, false, "attendu connu", "absent de la table d'or"); continue; }
    let v;
    try { v = e.mesure(); } catch(err){ point(e.nom, false, or.attendu, "a jeté : " + err.message); continue; }
    // La théorie vient de l'essai lui-même : c'est LUI qui la porte, et la
    // dupliquer ici créerait une seconde source d'autorité pour une seule valeur.
    const ecartTheorie = Math.abs(v - e.theorie) / Math.abs(e.theorie);
    point(e.nom, proche(v, or.attendu, or.tolerance), or.attendu, +v.toPrecision(7),
          "écart à la théorie " + (100*ecartTheorie).toFixed(4) + " %");
  }
  return enCours;
}

/* 5. AUCUN PIXEL NON PEINT.

   Depuis que l'habitacle passe AVANT le ciel, les deux passes doivent se
   recouvrir exactement — le triangle plein écran ne remplit plus que les trous.
   S'il en reste un, on verrait le fond de nettoyage.

   On nettoie donc en magenta, couleur qu'aucune passe ne produit : tout magenta
   survivant est un trou. */
function pixels(){
  ouvre("Aucun pixel non peint");
  const degele = fige();
  const vrai = gl.clearColor.bind(gl);
  gl.clearColor = () => vrai(1, 0, 1, 1);
  try {
    avanceImages(4);
    let trous = 0, n = 0;
    for(let a = 0; a < 40; a++) for(let c = 0; c < 30; c++){
      const q = new Uint8Array(4);
      gl.readPixels(Math.round(cv.width*(0.01 + 0.025*a)),
                    Math.round(cv.height*(0.01 + 0.033*c)), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, q);
      n++;
      if(q[0] > 200 && q[1] < 60 && q[2] > 200) trous++;
    }
    point("pixels laissés vides", trous === 0, 0, trous, n + " échantillons");
  } finally {
    gl.clearColor = vrai;
    degele();
    avanceImages(2);
  }
  return enCours;
}

/* 5 bis. L'AXE DE ROTATION NE PORTE PLUS DE COUTURE.

   Hugo, séance du 6 août : « il y a une trace verticale buguée quand on met une
   rotation au trou noir ». C'était la couture de l'axe polaire, singulier par
   construction en Boyer-Lindquist. Le site la déclarait à sept endroits, dont le
   panneau ouvert devant lui — il l'a lue comme un bug quand même, et il avait
   raison : une déclaration qu'il faut lire ne répare pas ce qu'on voit.

   Le moteur est passé en Kerr-Schild, où l'axe n'a plus rien de singulier. Ce
   contrôle est ce qui empêche la couture de revenir.

   ---------------------------------------------------------------------------
   LA PREMIÈRE VERSION MESURAIT LES ÉTOILES

   Elle lisait une bande de pixels en travers de l'axe, rangée par rangée, et
   gardait le PIRE rapport. Le 7 août elle a échoué à spin 0,9 en rendant 36 —
   trois fois sa borne. Le profil des pixels disait tout :

       31  31  30  30  [54]  30  30  29  29

   Un seul pixel. Une couture est une colonne ; un pixel isolé sur une seule
   rangée n'en est pas une. Sa couleur a donné le coupable : r 35, v 33, b 52 —
   la teinte bleutée du champ d'étoiles. Le contrôle mesurait le CIEL.

   Il ne s'agissait même pas de malchance : la position lentillée d'une étoile
   se déplace avec la rotation, donc le hasard d'en trouver une sur l'axe change
   à chaque spin et à chaque caméra. Le même contrôle rendait 3 puis 36 sur la
   même image. Un contrôle qui bouge tout seul ne prouve rien, dans aucun sens.

   ---------------------------------------------------------------------------
   CE QUI SÉPARE VRAIMENT UNE COUTURE D'UNE ÉTOILE

   Une couture est collée à la SCÈNE : elle reste sur l'axe projeté quel que soit
   l'endroit d'où on regarde. Une étoile est collée au CIEL : elle glisse dès que
   la caméra tourne.

   On mesure donc la même colonne depuis cinq azimuts voisins et l'on garde, pour
   chaque rangée, la MÉDIANE des cinq. Ce qui appartient à la scène survit ; ce
   qui appartient au ciel est éliminé par construction, sans avoir à reconnaître
   une étoile ni à régler un seuil de brillance.

   L'effet est net sur l'image même qui avait fait échouer la version d'avant :

       spin 0,9,    un seul azimut       36        (une étoile)
       spin 0,9,    médiane de cinq       2,5      (le fond)

   ---------------------------------------------------------------------------
   ET LA PREUVE QU'IL SAIT ENCORE VOIR

   Une mesure qu'on vient de rendre insensible au bruit doit prouver qu'elle est
   restée sensible au signal — sinon on a fabriqué un contrôle qui passe toujours,
   ce qui est pire que pas de contrôle.

   On l'éprouve donc sur des profils FABRIQUÉS, dans les deux sens : elle doit
   crier sur une colonne d'un pixel et se taire sur le même fond sans elle. Plus
   un troisième point qui exige que les bandes réellement lues contiennent une
   image, faute de quoi tout le reste mesurerait un tampon vide.

       l'axe, toutes rotations, quatre passages     1,5  à  3,1
       le pic fabriqué d'un pixel                        ≈ 24
       le même fond sans pic                             ≈ 2

   Les bornes — 6 pour l'axe, 12 et 6 pour les témoins — sont posées dans ce
   couloir, et elles ne dépendent plus de la taille de la fenêtre.

   Les valeurs Boyer-Lindquist relevées avant la réécriture (42 à 620) l'ont été
   avec l'ANCIENNE statistique : elles ne sont pas comparables à celles-ci et ne
   servent donc pas de référence. C'est le témoin du bord qui étalonne.        */

/* 5 ter. LA CARTE DES ORBITES NE BOUGE PAS TOUTE SEULE.

   Hugo, séance du 7 août : « on a l'impression que le vaisseau tourne autour du
   trou noir, ou que leur plan tourne sous lui-même. Mais on est sur un point
   fixe dans la galaxie quand on le regarde. »

   La cause tenait en une ligne — `vue.azim += dt*0.05`, ajoutée pour que le
   volume se lise. Elle fabriquait un déplacement du vaisseau qui n'existe pas,
   sur un site dont toute la valeur est que ce qu'on voit est calculé.

   Ce contrôle interdit qu'elle revienne. Il fait tourner cinq secondes de
   simulation sans qu'aucun doigt ne touche rien, et exige que l'azimut soit
   IDENTIQUE — pas « proche ». Une caméra qui dérive n'a pas de bonne vitesse
   de dérive.

   Et il vérifie dans la foulée que le mouvement LÉGITIME, lui, a bien lieu :
   les étoiles avancent sur leurs orbites parce que l'année défile. Sans ce
   second point, on aurait pu satisfaire le premier en gelant toute la carte,
   ce qui aurait supprimé le seul mouvement vrai de la scène.                   */
function carteFixe(){
  ouvre("La carte des orbites ne tourne pas toute seule");
  const V = ETOILES_S.vue;
  const av = { azim: V.azim, elev: V.elev, annee: V.annee,
               carte: TELESCOPE.carte, lieu };
  const degele = fige();
  try {
    if(lieu !== "telescope") vaAu("telescope");

    /* IL FAUT QUE LA CARTE SOIT RÉELLEMENT DESSINÉE.

       Première version : on allait au télescope et l'on avançait trois cents
       images. Les deux premiers points passaient — et ne prouvaient RIEN, parce
       que `dessineVoyage` se court-circuite quand aucun trajet n'est en cours.
       L'azimut ne bougeait pas puisque le code qui le fait bouger ne
       s'exécutait jamais.

       On force donc l'opacité de la carte à chaque image. C'est la troisième
       fois cette semaine qu'un de mes contrôles passe en n'exerçant rien. */
    const azim0 = V.azim, elev0 = V.elev, annee0 = V.annee;
    let t = performance.now();
    for(let i = 0; i < 300; i++){ TELESCOPE.carte = 1; t = avanceImages(1, t); }

    point("l'azimut n'a pas bougé d'un iota", V.azim === azim0,
          azim0.toFixed(6), V.azim.toFixed(6),
          "une dérive de 0,05 rad/s donnerait " + (azim0 + 0.25).toFixed(6)
          + " ici — c'est ce qui a fait dire à Hugo qu'on tournait autour de l'objet");
    point("l'élévation non plus", V.elev === elev0, elev0.toFixed(6), V.elev.toFixed(6));

    point("mais les étoiles, elles, avancent", V.annee > annee0,
          "> " + annee0.toFixed(2), V.annee.toFixed(2),
          "le seul mouvement vrai de la scène : si celui-ci s'arrête, on a figé "
          + "la carte au lieu de retirer la fausse rotation");
  } finally {
    V.azim = av.azim; V.elev = av.elev; V.annee = av.annee;
    TELESCOPE.carte = av.carte;
    degele();
    if(lieu !== av.lieu) vaAu(av.lieu);
    avanceImages(2);
  }
  return enCours;
}

/* 5 quater. LA CARTE RESTE DEHORS, ET ELLE N'A PAS DE TROU.

   Hugo, 7 août : « la trace des orbites est devant la vitre dans le vaisseau,
   on n'a pas l'impression que c'est à l'extérieur. »

   La mesure est différentielle, et il le faut : ce calque porte aussi les
   écrans du bord et l'interface, donc compter les pixels peints ne dirait rien.
   On rend deux fois la même image, une fois avec la carte neutralisée, et l'on
   regarde ce qu'elle AJOUTE de part et d'autre du cadre de la baie.

   Le second point garde le raccord : à l'arrivée, le recul s'arrête avant que
   le voile ne monte, et les traces retombaient à zéro dans l'intervalle. C'est
   ça, le « pop » qu'il signalait. On exige que l'opacité ne descende jamais
   d'une image à l'autre pendant tout le trajet.                              */
function carteDehors(){
  ouvre("La carte des orbites reste derrière la vitre");
  const av = { lieu, p: joueur.p.slice(), lacet: salon.lacet, tangage: salon.tangage,
               trajet: TELESCOPE.trajet, carte: TELESCOPE.carte, grille: TELESCOPE.grille };
  const degele = fige();
  const vraiDessine = ETOILES_S.dessine;
  try {
    if(lieu !== "salon") vaAu("salon");
    salon.lacet = 0; salon.tangage = -0.05;
    joueur.p = [0, hauteurSol(0, 0.6), 0.6];
    RECUL.lance(2.03e14, 14);
    TELESCOPE.trajet = { dest:{ nom:"chrono.retour" }, arrive:false, depart:RECUL.etat.d0,
                         calcul: VOYAGE.entre(RECUL.etat.d0, RECUL.etat.d1) };

    // Le cadre de la baie, projeté — c'est la frontière qu'on interdit de franchir.
    let t = avanceImages(200);
    const M = mvpSalon();
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, vues = 0;
    for(const w of VAISSEAU.vitres())
      for(const p of [[w.x0,w.y0,w.z], [w.x1,w.y1,w.z]]){
        const q = projetteSalon(p, M);
        if(!q) continue;
        vues++;
        x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]);
        y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]);
      }
    point("la baie se projette bien à l'écran", vues >= 6, "≥ 6 coins", vues,
          "sans cadre, les deux points suivants ne mesurent rien");

    const cvs = ctx.canvas, e = cvs.width / cvs.clientWidth;
    const compte = () => {
      const img = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
      let dedans = 0, dehors = 0;
      for(let y = 0; y < cvs.height; y += 2) for(let x = 0; x < cvs.width; x += 2){
        if(img[(y*cvs.width + x)*4 + 3] < 8) continue;
        const cx = x/e, cy = y/e;
        if(cx >= x0-2 && cx <= x1+2 && cy >= y0-2 && cy <= y1+2) dedans++; else dehors++;
      }
      return { dedans, dehors };
    };
    ETOILES_S.dessine = () => {};
    t = avanceImages(4, t); const sans = compte();
    ETOILES_S.dessine = vraiDessine;
    t = avanceImages(4, t); const avec = compte();

    point("elle peint bien quelque chose", avec.dedans - sans.dedans > 200,
          "> 200 pixels dans la baie", avec.dedans - sans.dedans,
          "sinon le point suivant serait satisfait par une carte invisible");
    point("et rien en dehors du cadre", avec.dehors - sans.dehors < 60,
          "< 60 pixels", avec.dehors - sans.dehors,
          "mesuré par différence : ce calque porte aussi les écrans du bord");

    // Le raccord entre le recul et le voile, image par image.
    let pire = 0, avant = null;
    for(let i = 0; i < 1100; i++){
      t = avanceImages(1, t);
      const o = Math.max(TELESCOPE.trajet ? 0.12 + 0.30*RECUL.etat.t : 0,
                         Math.max(0, (TELESCOPE.carte - 0.30)/0.70));
      if(avant !== null) pire = Math.min(pire, o - avant);
      avant = o;
    }
    point("l'opacité des traces ne retombe jamais", pire > -0.002,
          "> −0,002 par image", pire.toFixed(4),
          "c'est le « pop » qu'il signalait : les traces disparaissaient entre "
          + "la fin du recul et la montée du voile");
  } finally {
    ETOILES_S.dessine = vraiDessine;
    TELESCOPE.trajet = av.trajet; TELESCOPE.carte = av.carte; TELESCOPE.grille = av.grille;
    RECUL.etat.actif = false;
    joueur.p = av.p; salon.lacet = av.lacet; salon.tangage = av.tangage;
    degele();
    if(lieu !== av.lieu) vaAu(av.lieu);
    avanceImages(2);
  }
  return enCours;
}

/* 5 quinquies. UNE SÉANCE DE JUGEMENT NE DOIT RIEN LAISSER DERRIÈRE ELLE.

   Le 7 août au soir : « c'est hyper lent, j'ai deux images par seconde ». Son
   réglage sauvegardé contenait `"spin": 0.95`. Une séance lui avait fait
   comparer les quatre rotations, la rotation est PERSISTÉE — et personne ne
   l'avait remise. Depuis, chaque chargement faisait tourner la branche Kerr,
   huit fois plus chère que la branche immobile.

   Le coût de cette faute est le pire du projet : elle ne casse rien, elle ne
   lève aucune erreur, et elle abîme le site de la personne qui l'a aidé — en
   punition d'avoir aidé.

   Ce contrôle joue une séance entière et compare le RÉGLAGE ENREGISTRÉ avant et
   après, octet pour octet. Il ne suppose pas quelles clés comptent : il les
   compare toutes, parce que la prochaine fuite portera sur une autre.          */
function seanceSansTrace(){
  ouvre("Une séance de jugement ne laisse pas de trace");
  if(typeof JUGE === "undefined"){
    point("la séance est chargée", false, "JUGE", "absent",
          "ouvrir `?verif&juge` pour jouer ce contrôle");
    return enCours;
  }
  spin = 0; sauve();                       // un état de départ propre et connu
  const av = { spin, lieu, stock: localStorage.getItem(CLE) };
  try {
    JUGE.demarre();

    /* ON SALIT NOUS-MÊMES, ET C'EST TOUT L'INTÉRÊT.

       Première version : on jouait la séance telle quelle et l'on regardait
       l'état après. Elle passait AVEC ET SANS la réparation — parce qu'aucune
       des questions du jour ne touche à la rotation, celle qui le faisait ayant
       été retirée le matin même. Un contrôle accroché au contenu de la file ne
       protège que tant que la file contient le cas.

       On dérange donc le monde nous-même, exactement comme le fait le bouton
       d'une question de comparaison, et l'on exige que la séance le rende. Ce
       qui est éprouvé est le MÉCANISME, qui survivra au prochain remaniement
       des questions. */
    spin = 0.95; sauve();
    let n = 0;
    while(JUGE.DECISIONS.length && n++ < 40 && JUGE.rapport === null) JUGE.repond("passé");

    const apres = localStorage.getItem(CLE);
    point("le réglage enregistré est rendu intact", apres === av.stock,
          "identique", apres === av.stock ? "identique" : "MODIFIÉ",
          "c'est ce qui a laissé la rotation à 0,95 dans les préférences d'Hugo "
          + "et divisé sa cadence par huit sur toutes les pages — 13,8 ms par "
          + "image contre 1,6");
    point("la rotation est rendue", spin === av.spin, av.spin, spin);
    point("et la séance s'est bien jouée", JUGE.rapport !== null || JUGE.DECISIONS.length === 0,
          "un rapport", JUGE.rapport === null ? "aucun" : "rendu",
          "sans ça les deux points ci-dessus passeraient sans avoir rien exercé");
  } finally {
    spin = av.spin;
    if(av.stock !== null) localStorage.setItem(CLE, av.stock);
    if(lieu !== av.lieu) vaAu(av.lieu);
    avanceImages(2);
  }
  return enCours;
}

/* 5 sexies. LA ROTATION NE S'INVITE PAS TOUTE SEULE.

   Le 7 août 2026, Hugo : « c'est hyper lent, j'ai deux images par seconde ».
   Son réglage enregistré contenait `"spin": 0.95`, laissé par une séance de
   jugement. La rotation bascule le nuanceur sur la branche Kerr-Schild, qui
   coûte **13,8 ms par image contre 1,6** — huit fois plus. Appliquée à toutes
   les vues, elle vidait l'écran d'un téléphone.

   Sa décision : les trous noirs de PRÉSENTATION ne tournent pas. La rotation
   garde son poste — le trou noir d'étude — où elle se règle et où son coût est
   payé volontairement.

   Ce contrôle écrit une rotation dans les préférences, recharge l'état, et
   exige que l'entrée reste immobile. Il mesure aussi l'écart de coût, pour que
   le chiffre qui justifie la règle ne soit pas une croyance.                  */
function rotationCalme(){
  ouvre("La rotation ne s'invite pas toute seule");
  const av = { spin, stock: localStorage.getItem(CLE) };
  const degele = fige();
  try {
    spin = 0.95; sauve();                  // l'état exact dans lequel il s'est retrouvé
    spin = 0;
    charge();
    point("un réglage enregistré ne remet pas la rotation", spin === 0, 0, spin,
          "c'est ce qui l'a fait tomber à deux images par seconde, sur toutes "
          + "les pages, sans qu'aucune erreur ne soit levée");

    // Et le chiffre qui justifie la règle, mesuré et non supposé.
    /* On prend le MINIMUM de plusieurs passages, pas une mesure unique.

       La première version en prenait une seule et rendait 54 ms pour la branche
       immobile quand elle tournait au milieu de la suite — le pipeline
       graphique chauffait encore après les contrôles précédents, et le rapport
       sortait à 0,2 au lieu de 9. Le minimum est la bonne statistique pour un
       coût : il écarte les à-coups sans rien inventer. */
    const un = new Uint8Array(4);
    const cout = s => {
      spin = s;
      let mieux = Infinity;
      for(let k = 0; k < 3; k++){
        avanceImages(8);                       // on chauffe avant CHAQUE passage
        const t0 = performance.now();
        avanceImages(10);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, un);  // force la synchro
        mieux = Math.min(mieux, (performance.now() - t0)/10);
      }
      return mieux;
    };
    const immobile = cout(0), tourne = cout(0.95);
    point("et elle coûte bien plus cher qu'immobile", tourne > immobile * 1.8,
          "> 1,8 fois", (tourne/immobile).toFixed(1) + " fois   ("
          + immobile.toFixed(1) + " → " + tourne.toFixed(1) + " ms)",
          "si ce rapport tombait à 1, la règle n'aurait plus de raison d'être "
          + "et il faudrait rendre la rotation partout");
  } finally {
    spin = av.spin;
    if(av.stock !== null) localStorage.setItem(CLE, av.stock);
    degele();
    avanceImages(2);
  }
  return enCours;
}

/* 5 septies. LES ORBITES ET LE QUADRILLAGE DÉCRIVENT LE MÊME ESPACE.

   Hugo, 7 août au soir : « le quadrillage qui se dézoome devrait suivre
   exactement les traces des orbites. Si c'est logique, un point de la courbe
   d'une orbite devrait suivre parfaitement ce quadrillage. Et là ce n'est pas
   le cas. »

   Il y avait deux lois pour un seul espace : le quadrillage en 1/d, et une
   interpolation de six à un pour la carte, choisie parce qu'elle était jolie.
   Deux objets qui glissent l'un sur l'autre, et l'œil le voit sans savoir le
   nommer.

   On exige donc que `échelle × distance` soit CONSTANT — c'est la signature de
   la loi en 1/d, et elle interdit qu'on réintroduise un lissage — et qu'elle
   vaille exactement un à l'arrivée, sans quoi le cadre final aurait bougé.   */
function memeEspace(){
  ouvre("Les orbites suivent la même loi que le quadrillage");
  const av = { etat: Object.assign({}, RECUL.etat), echelle: ETOILES_S.vue.echelle,
               pilotee: ETOILES_S.vue.pilotee };
  try {
    const d0 = 16*RECUL.RS_M, d1 = 1000*d0;
    const produits = [];
    let arrivee = null;
    for(let i = 0; i <= 12; i++){
      const d = Math.pow(10, Math.log10(d0) + (Math.log10(d1) - Math.log10(d0))*i/12);
      Object.assign(RECUL.etat, { actif:true, d0, d1, distance:d });
      ETOILES_S.vue.pilotee = true;
      ETOILES_S.cadre(d, d0, d1);
      produits.push(ETOILES_S.vue.echelle * d);
      if(i === 12) arrivee = ETOILES_S.vue.echelle;
    }
    const lo = Math.min(...produits), hi = Math.max(...produits);
    point("échelle × distance est constant", (hi - lo)/hi < 1e-9,
          "constant à 1e-9 près", ((hi - lo)/hi).toExponential(1),
          "c'est la signature de la loi en 1/d — un lissage la casserait "
          + "immédiatement, et c'est ce que le quadrillage suit déjà");
    point("et le cadre final vaut exactement un", Math.abs(arrivee - 1) < 1e-12,
          1, arrivee,
          "sinon les orbites n'arriveraient plus à la taille où elles ont été réglées");
  } finally {
    Object.assign(RECUL.etat, av.etat);
    ETOILES_S.vue.echelle = av.echelle; ETOILES_S.vue.pilotee = av.pilotee;
  }
  return enCours;
}

function couture(){
  ouvre("L'axe de rotation ne porte pas de couture");
  const av = { spin, dist: cam.dist, elev: cam.elev, azim: cam.azim, lieu };
  const degele = fige();
  try {
    if(lieu !== "libre") vaAu("libre");
    cam.dist = 9; cam.elev = 0.0;

    const AZIM = 0.6, ECARTS = [-0.06, -0.03, 0, 0.03, 0.06];
    const ech = cv.width / cv.clientWidth;

    /* LA BANDE SE MESURE EN FRACTION D'ÉCRAN, PAS EN PIXELS.

       Elle faisait quarante et un pixels en dur. C'est 3 % de la largeur sur un
       écran de bureau — et 11 % sur un téléphone à 375 points, où elle avale
       alors la courbure du bord de l'ombre et noie la structure qu'elle est
       censée voir. Le témoin tombait de 24-29 à 3,5-8 sans qu'une seule ligne
       du moteur ait changé.

       Le contrôle dépendait donc de la taille de la fenêtre sans le dire, ce
       qui est la même faute que la caméra qui n'obéissait pas : d'accord avec
       lui-même dans les conditions où on l'a écrit, muet ailleurs. Et il aurait
       menti précisément sur le matériel d'Hugo, qui juge au téléphone. */
    const DEMI  = Math.max(6, Math.round(cv.width * 0.0156));   // 20 px à 1280
    const LARGE = 2*DEMI + 1;
    const buf = new Uint8Array(LARGE*4);

    /* Le rapport de la différence seconde AU CENTRE à la médiane de la bande.
       Séparé de la lecture de pixels pour qu'on puisse l'éprouver sur des
       profils fabriqués — voir les deux témoins, plus bas. */
    const rapport = L => {
      const n = L.length, d2 = [];
      for(let i = 1; i < n-1; i++) d2.push(Math.abs(L[i+1] - 2*L[i] + L[i-1]));
      const tri = d2.slice().sort((p, q) => p - q);
      return d2[(n>>1) - 1] / Math.max(tri[Math.floor(tri.length/2)], 0.5);
    };

    let vuDuVrai = 0;                 // l'amplitude réelle rencontrée dans l'image
    const rangee = (sx, sy) => {
      if(sx < DEMI+5 || sx > cv.width-DEMI-5 || sy < 2 || sy > cv.height-2) return null;
      gl.readPixels(sx-DEMI, sy, LARGE, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      const L = [];
      for(let i = 0; i < LARGE; i++) L.push((buf[i*4] + buf[i*4+1] + buf[i*4+2])/3);
      vuDuVrai = Math.max(vuDuVrai, Math.max(...L) - Math.min(...L));
      return rapport(L);
    };

    /* `decal` est un écart en pixels CSS depuis le centre projeté : 0 pour
       l'axe, l'écart du bord de l'ombre pour le témoin. */
    let derive = 0;                 // ce que la caméra a fait de travers
    const colonne = decal => {
      const parRangee = [];
      for(const d of ECARTS){
        cam.azim = AZIM + d;
        avanceImages(6);
        derive = Math.max(derive, Math.abs(cam.azim - (AZIM + d)));
        const h = projette([0, 6, 0]), b = projette([0, -6, 0]), c = projette([0, 0, 0]);
        if(!h || !b || !c) return null;
        for(let k = 0; k <= 40; k++){
          const f = k/40;
          (parRangee[k] = parRangee[k] || []).push(
            rangee(Math.round((c[0] + decal) * ech),
                   Math.round(cv.height - (h[1] + (b[1]-h[1])*f) * ech)));
        }
      }
      const med = parRangee.map(a => {
        const p = a.filter(v => v !== null).sort((x, y) => x - y);
        return p.length < 3 ? null : p[Math.floor(p.length/2)];
      }).filter(v => v !== null);
      return med.length ? Math.max(...med) : null;
    };

    spin = 0;
    const temoin = colonne(0);

    /* AVANT tout verdict : la caméra a-t-elle obéi ?

       Elle ne le faisait pas, et rien ne le disait. Une mesure prise depuis un
       point de vue qu'on n'a pas choisi n'est pas une mesure prudente, c'est
       une mesure fausse — et ici elle rendait la médiane sur cinq azimuts
       parfaitement inutile, puisque les cinq images étaient la même. */
    point("la caméra est allée où on la demandait", derive < 0.01,
          "< 0,01 rad d'écart", derive.toFixed(4),
          derive >= 0.01 ? "quelque chose pilote la caméra par-dessus le contrôle : "
                         + "les quatre points suivants ne veulent rien dire" : undefined);

    point("le témoin à rotation nulle est calme", temoin !== null && temoin < 6,
          "< 6", temoin === null ? "axe hors champ" : temoin.toFixed(2),
          "sans rotation il ne PEUT pas y avoir de couture : si celui-ci monte, "
          + "c'est la mesure qui est en cause, pas le moteur");

    for(const s of [0.6, 0.9, 0.95]){
      spin = s;
      const v = colonne(0);
      point("spin " + s + " — pas de colonne sur l'axe", v !== null && v < 6,
            "< 6", v === null ? "axe hors champ" : v.toFixed(2));
    }

    /* ------------------------------------------------- LES DEUX TÉMOINS

       Le premier essai posait la même colonne sur le BORD DE L'OMBRE, en
       pariant que c'était une structure verticale franche. C'est faux, et le
       profil des pixels le dit sans appel — 240, 236, 229, 224, 217, 190, 174,
       138, 128, 96, 47, 34, 32 : une RAMPE sur dix pixels, pas une marche. Une
       différence seconde ne voit rien d'une pente lisse, et le témoin passait à
       1 280 par chance de cadrage avant de rater à 375.

       On éprouve donc la statistique sur des profils fabriqués, où l'on sait ce
       qu'il y a. Elle doit crier sur une colonne d'un pixel et se taire sur un
       fond bruité — les deux sens, sans quoi on ne saurait pas si elle est
       aveugle ou hystérique.

       Et comme un test sur données fabriquées ne prouverait rien de la chaîne
       de lecture, un troisième point exige que les bandes réellement lues
       contiennent une image, et pas un tampon vide. */
    /* Le profil n'est pas inventé : c'est CELUI DU 7 AOÛT, relevé sur l'image
       qui avait fait échouer ce contrôle — `31 31 30 30 [54] 30 30 29 29`. Un
       fond qui dérive doucement de 31 à 29, et l'étoile à +24 dessus. */
    const plat = [], pic = [];
    for(let i = 0; i < LARGE; i++){
      const fond = Math.round(31 - i*2/(LARGE - 1));
      plat.push(fond);
      pic.push(i === (LARGE >> 1) ? fond + 24 : fond);
    }
    const rPic = rapport(pic), rPlat = rapport(plat);

    point("la mesure voit une colonne d'un seul pixel", rPic > 12,
          "> 12", rPic.toFixed(2),
          "un pic de 24 niveaux sur un fond bruité de 30 — l'ordre de grandeur "
          + "exact de l'étoile qui avait fait échouer ce contrôle le 7 août");
    point("et elle se tait sur un fond sans colonne", rPlat < 6,
          "< 6", rPlat.toFixed(2),
          "le même fond, sans le pic : sans ce point, une mesure qui crie "
          + "toujours passerait le précédent");
    point("les bandes lues contenaient bien une image", vuDuVrai > 20,
          "> 20 niveaux d'amplitude", Math.round(vuDuVrai),
          "sinon les quatre points ci-dessus mesurent un tampon vide, et "
          + "l'absence de couture ne veut rien dire");
  } finally {
    spin = av.spin; cam.dist = av.dist; cam.elev = av.elev; cam.azim = av.azim;
    degele();
    if(lieu !== av.lieu) vaAu(av.lieu);
    avanceImages(2);
  }
  return enCours;
}

/* 6. LA MISE EN PAGE, À LA TAILLE COURANTE.

   Quatre défauts de mise en page ont échappé à la relecture sur ce projet,
   tous sur téléphone, et tous de la même famille : une règle écrite pour un
   écran haut appliquée à un écran large et court. On mesure donc, on ne relit
   plus.

   L'appelant redimensionne entre deux appels — une page ne peut pas se
   redimensionner elle-même. */
function mesurePage(){
  const w = innerWidth, h = innerHeight;
  ouvre("Mise en page " + w + " × " + h);
  const rends = pose();
  try {
    point("la page ne défile pas latéralement",
          document.documentElement.scrollWidth <= w + 1, "≤ " + w,
          document.documentElement.scrollWidth);

    const debordent = [];
    document.querySelectorAll(".hud, #instrument, #presentation, #temps, #spectre, #voile")
      .forEach(n => {
        const s = getComputedStyle(n);
        if(s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return;
        const r = n.getBoundingClientRect();
        if(r.width === 0 && r.height === 0) return;
        // Un élément qui défile à l'intérieur a le droit d'être plus grand que
        // son cadre ; ce qu'on interdit, c'est de sortir de l'ÉCRAN.
        const deborde = r.right > w + 1 || r.left < -1 || r.bottom > h + 1 || r.top < -1;
        if(deborde) debordent.push(
          (n.id || n.className) + " [" + Math.round(r.left) + "," + Math.round(r.top) +
          " → " + Math.round(r.right) + "," + Math.round(r.bottom) + "]");
      });
    point("rien ne sort de l'écran", debordent.length === 0, 0, debordent.length,
          debordent.length ? debordent.slice(0, 5).join(" · ") : undefined);

    /* La ZONE SENSIBLE, et non la boîte dessinée.

       Un bouton peut être petit à l'œil et large au doigt : un pseudo-élément
       qui déborde capte le contact sans rien changer au dessin. On ne mesure
       donc pas `getBoundingClientRect`, on SONDE — on demande au document qui
       reçoit un contact à quelques pixels au-delà du bord.

       C'est la même méthode qui a résolu l'affaire du drone : ce qui compte
       n'est pas où est l'objet, c'est qui reçoit le doigt. */
    const petits = [];
    document.querySelectorAll("button").forEach(b => {
      const r = b.getBoundingClientRect();
      if(r.width === 0 || r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) return;
      // Rendu invisible par lui-même ou par un ancêtre — la barre du bas est
      // masquée dans le salon, par exemple.
      if(b.checkVisibility && !b.checkVisibility({ opacityProperty: true,
                                                   visibilityProperty: true,
                                                   contentVisibilityAuto: true })) return;

      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const recoit = (x, y) => {
        const n = document.elementFromPoint(x, y);
        return n === b || (n && b.contains(n));
      };
      /* Si le CENTRE ne répond pas, ce bouton n'est pas touchable du tout —
         soit il est neutralisé (`pointer-events`), soit quelque chose le
         recouvre. Mesurer sa zone n'aurait alors aucun sens : on le laisse.

         Ce cas mériterait son propre contrôle — « un bouton visible mais
         inatteignable » est un vrai défaut — mais il demande de distinguer le
         volontaire de l'accident, ce qu'aucune règle simple ne sait faire. */
      if(!recoit(cx, cy)) return;
      // On cherche jusqu'où le bouton répond encore, vers le haut et vers le bas.
      let haut = 0, bas = 0;
      for(let d = 1; d <= 22; d++){ if(recoit(cx, cy - d)) haut = d; else break; }
      for(let d = 1; d <= 22; d++){ if(recoit(cx, cy + d)) bas = d; else break; }
      const zone = haut + bas + 1;
      if(zone < 28) petits.push((b.id || b.textContent.trim().slice(0, 16)) +
                                " " + zone + "px (boîte " + Math.round(r.height) + ")");
    });
    point("la zone sensible des boutons atteint 28 px", petits.length === 0, 0, petits.length,
          petits.length ? petits.slice(0, 6).join(" · ") : undefined);
  } finally { rends(); }
  return enCours;
}

/* 7. LE PARCOURS NEUF VA AU BOUT.

   DESTRUCTIF : il vide la mémoire et joue l'entrée. À lancer sur une page
   fraîche, ou en sachant qu'on ne reviendra pas en arrière.

   On pilote `boucle()` à la main plutôt que d'attendre le rythme d'affichage :
   c'est déterministe, et ça marche même quand la page n'est pas composée — donc
   quand `requestAnimationFrame` ne se déclenche jamais. */
function parcours(){
  ouvre("Le parcours neuf");

  /* Il faut une page chargée AVEC LA MÉMOIRE DÉJÀ VIDE.

     Vider `localStorage` ici ne sert à rien : `dejaVenu` a été lu au
     chargement, et c'est lui qui décide si la présentation se joue et si l'on
     tombe dans la quête ou dans le menu. Le vider en cours de route produisait
     quatre échecs parfaitement trompeurs — un harnais qui crie au loup pour une
     erreur de protocole cesse vite d'être lu.

     On le dit donc, et l'on ne teste pas. */
  if(typeof dejaVenu !== "undefined" && dejaVenu){
    point("protocole", false, "page neuve, mémoire vide au chargement",
          "déjà venu — vider la mémoire PUIS recharger, ensuite relancer");
    return enCours;
  }
  const muet = document.getElementById("acc-muet");
  point("l'accueil propose d'entrer", !!muet, "présent", muet ? "présent" : "absent");
  if(!muet) return enCours;
  muet.click();

  const pres = document.getElementById("presentation");
  point("la présentation se joue", pres && pres.classList.contains("vu"), "affichée",
        pres ? (pres.classList.contains("vu") ? "affichée" : "absente") : "élément manquant");
  const passer = document.getElementById("pr-passer");
  if(passer) passer.click();

  let t = performance.now();
  salon.lacet = 0; salon.tangage = 0;
  t = avanceImages(700, t);
  point("on est dans le salon", salon.actif === true, true, salon.actif);
  point("la quête a démarré", typeof queteActive !== "undefined" && queteActive, true,
        typeof queteActive !== "undefined" ? queteActive : "?");
  const etape = (typeof QUETE !== "undefined" && QUETE[iQuete]) ? QUETE[iQuete].id : null;
  point("l'étape de la baie s'est validée", etape === "a-lumen", "a-lumen", etape);
  return enCours;
}

/* 8. L'ALLER-RETOUR DU VOYAGE.

   DESTRUCTIF aussi. On part, on arrive, on revient — et l'on vérifie qu'on
   retrouve une orbite, que le registre a inscrit sa ligne, et que la carte des
   étoiles s'est bien effacée.

   Ce dernier point a été un vrai défaut : le fondu de retrait vivait dans une
   fonction qui cesse d'être appelée à la fin du trajet, si bien qu'on rentrait
   chez soi avec les orbites encore à l'écran, définitivement. */
function voyage(){
  ouvre("L'aller-retour du télescope");
  if(!salon.actif) document.getElementById("b-salon").click();
  cinema.actif = false;
  if(typeof queteActive !== "undefined"){ queteActive = false; queteFinie = true; }
  const avant = registre.length;

  ouvreTelescope();
  const liste = document.getElementById("in-liste");
  point("le télescope propose des destinations", liste.children.length >= 2, "≥ 2", liste.children.length);
  liste.children[0].click();

  let t = avanceImages(2400);
  point("on est arrivé", TELESCOPE.trajet && TELESCOPE.trajet.arrive === true, true,
        TELESCOPE.trajet ? TELESCOPE.trajet.arrive : "trajet absent");
  point("la carte des étoiles est là", TELESCOPE.carte > 0.9, "> 0,9", +TELESCOPE.carte.toFixed(3));
  point("le registre a inscrit le trajet", registre.length === avant + 1, avant + 1, registre.length);

  const l2 = document.getElementById("in-liste");
  point("le retour est proposé", l2.children.length >= 1, "≥ 1", l2.children.length);
  l2.children[0].click();
  t = avanceImages(1800, t);

  point("le trajet est terminé", TELESCOPE.trajet === null, null, TELESCOPE.trajet);
  point("la carte s'est effacée", TELESCOPE.carte < 0.01, "< 0,01", +TELESCOPE.carte.toFixed(4));
  const r = len(salon.p);
  point("on est revenu en orbite", r > 8 && r < 40, "entre 8 et 40 rayons", +r.toFixed(1));
  return enCours;
}

/* 9. LE BUDGET D'IMAGE.

   Les seuils sont larges à dessein : cette machine n'est pas le téléphone
   d'Hugo, et une mesure absolue n'y voudrait rien dire. Ce qu'on surveille,
   c'est la RÉGRESSION — le jour où le calque à deux dimensions repasse au-dessus
   d'une demi-milliseconde, quelqu'un a remis du texte dans la boucle. */
function budget(){
  ouvre("Le budget d'image");
  const degele = fige();
  try {
    const mesure = (n, f) => { const t0 = performance.now(); for(let i = 0; i < n; i++) f(); return (performance.now() - t0)/n; };
    const d2 = mesure(120, () => dessine());
    point("le calque à deux dimensions", d2 < 0.5, "< 0,5 ms", +d2.toFixed(3) + " ms");
    let t = performance.now();
    const t0 = performance.now();
    for(let i = 0; i < 120; i++){ images = 0; cumul = 0; t += 16.7; boucle(t); }
    const bo = (performance.now() - t0)/120;
    point("la boucle entière", bo < 4, "< 4 ms", +bo.toFixed(3) + " ms");
  } finally { degele(); }
  return enCours;
}

// =================================================================== rapports

function bilan(){
  const tous = [];
  resultats.forEach(g => (g.points || [g]).forEach(p => tous.push(p)));
  const echecs = tous.filter(p => !p.ok);
  return { total: tous.length, reussis: tous.length - echecs.length,
           echoues: echecs.length, ok: echecs.length === 0, echecs };
}

function texte(){
  const l = [];
  for(const g of resultats){
    if(!g.points){ continue; }
    const rates = g.points.filter(p => !p.ok).length;
    l.push((rates ? "✗" : "✓") + " " + g.nom);
    for(const p of g.points){
      if(p.ok && !rates) continue;                    // on ne détaille que ce qui rate
      l.push("   " + (p.ok ? "·" : "✗") + " " + p.nom +
             "  attendu " + JSON.stringify(p.attendu) + ", mesuré " + JSON.stringify(p.mesure) +
             (p.note ? "  — " + p.note : ""));
    }
  }
  const b = bilan();
  l.push("");
  l.push(b.ok ? ("TOUT PASSE — " + b.total + " contrôles")
              : (b.echoues + " ÉCHECS sur " + b.total + " contrôles"));
  return l.join("\n");
}

/* La passe non destructive : tout ce qui n'abîme pas l'état courant.
   C'est celle qu'on lance après une modification, en boucle. */
function sain(){
  resultats.length = 0;
  vivant(); coherence(); lieux(); tempsJuste(); resolution(); saisieLibre(); nuanceurs();
  clesNues(); banc(); pixels(); couture(); carteFixe(); carteDehors(); rotationCalme(); memeEspace(); mesurePage(); budget();
  return bilan();
}

/* La passe complète, qui joue le site du début à la fin. Elle détruit l'état :
   on la lance sur une page fraîche. */
function tout(){
  resultats.length = 0;
  vivant(); coherence(); lieux(); tempsJuste(); resolution(); saisieLibre(); nuanceurs();
  clesNues(); banc(); pixels(); couture(); carteFixe(); carteDehors(); rotationCalme(); memeEspace(); mesurePage(); budget();
  parcours(); voyage();
  return bilan();
}

global.VERIF = {
  vivant, coherence, lieux, tempsJuste, resolution, saisieLibre, nuanceurs, clesNues,
  banc, pixels, couture, carteFixe, carteDehors, seanceSansTrace, rotationCalme, memeEspace, mesurePage, parcours, voyage, budget,
  sain, tout, bilan, texte, resultats, FORMATS, OR,
  // outillage exposé : d'autres contrôles pourront s'y adosser
  pose, fige, avanceImages,
};

})(window);
