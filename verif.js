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

/* 1. LES TROIS BLOCS DE SCRIPT VIVENT.

   Le contrôle le plus rentable du dépôt. Une variable employée avant sa ligne
   de déclaration tue le bloc où elle vit, ENTIÈREMENT, et le symptôme est muet
   — la moitié du site disparaît sans un message dans la console. C'est arrivé
   deux fois.

   ---------------------------------------------------------------------------
   UN TÉMOIN PAR BLOC, DEPUIS LE 8 AOÛT 2026

   Le code de la page est maintenant coupé en trois, précisément pour qu'une
   panne n'emporte plus qu'un tiers. Mais les huit noms que ce contrôle testait
   étaient TOUS dans le dernier tiers : une mort du premier bloc et une mort du
   troisième rendaient le même verdict.

   On prend donc le DERNIER nom déclaré de chaque bloc. S'il répond, tout ce qui
   le précède dans son bloc a été évalué — et l'on sait lequel est tombé.

   `T` reste à part : il est le tout premier nom du premier bloc, et s'il manque
   c'est que rien n'a démarré du tout. */
function vivant(){
  ouvre("Les trois blocs de script vivent");
  const tardifs = {
    // bloc A — se termine sur la physique et le temps
    avanceCorps: "function", surLePlan: "function",
    // bloc B — se termine sur l'écran d'accueil
    detail: "function", menu: "function",
    // bloc C — se termine sur la boucle
    finBoucle: "function", boucle: "function", vueW: "number",
    // le tout premier nom du tout premier bloc
    T: "function",
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
    // `carte:true` — ce contrôle MESURE la carte, il doit donc la demander. Elle
    // ne se montre plus qu'aux trajets qui la déclarent, depuis le 10 août : la
    // laisser implicite serait mesurer depuis un état qu'on n'a pas choisi.
    TELESCOPE.trajet = { dest:{ nom:"chrono.retour" }, arrive:false, depart:RECUL.etat.d0,
                         carte:true, calcul: VOYAGE.entre(RECUL.etat.d0, RECUL.etat.d1) };

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

/* 5 quater bis. L'ARRIVÉE SAIT OÙ L'ON EST ARRIVÉ.

   Trouvé le 10 août en préparant le chantier du système solaire, et il était en
   ligne : `d.id` existait dans la table des destinations depuis le premier jour
   et n'était lu NULLE PART. On partait vingt-sept mille années-lumière, et l'on
   arrivait devant les dix orbites du centre galactique — à la même taille
   apparente qu'à l'arrivée aux étoiles S, puisque `ETOILES_S.cadre` pose
   `échelle = arrivée / distance` et atteint donc la taille un à TOUTE arrivée.
   Sept millions de fois trop grandes.

   LA MESURE EST DIFFÉRENTIELLE, et surtout : c'est LA MÊME, jouée deux fois sur
   deux destinations. Un contrôle qui n'irait voir que le système solaire
   passerait au vert sur une carte cassée partout. Ici, l'une doit peindre et
   l'autre non — et c'est l'écart entre les deux qui est le contrôle.

   SA VÉRITÉ VIENT DE LA TABLE DES DESTINATIONS, pas du dessin : il demande à
   `DESTINATIONS` qui déclare `carte`, et il exige de l'écran ce que la donnée
   annonce. Le jour où l'on ajoute une destination, il la joue sans qu'on le
   touche.

   ÉPROUVÉ EN REMETTANT LE DÉFAUT, dans un navigateur, le 10 août. En état sain :
   59 008 pixels ajoutés aux étoiles S, −28 au système solaire. Le garde-fou
   retiré — `montreCarte` forcé à vrai, c'est-à-dire le code d'hier — le système
   solaire passe à 57 998 et le contrôle rougit. C'est la signature exacte du
   défaut : la même carte, à la même taille, sept millions de fois trop loin. */
function arriveeJuste(){
  ouvre("L'arrivée sait où l'on est arrivé");
  const av = { lieu, p: joueur.p.slice(), sp: salon.p.slice(),
               lacet: salon.lacet, tangage: salon.tangage,
               trajet: TELESCOPE.trajet, retour: TELESCOPE.retour,
               carte: TELESCOPE.carte, grille: TELESCOPE.grille,
               pied: $("in-pied").textContent };
  const degele = fige();
  const vraiDessine = ETOILES_S.dessine;
  const cvs = ctx.canvas;
  try {
    if(lieu !== "salon") vaAu("salon");
    salon.lacet = 0; salon.tangage = -0.05;
    joueur.p = [0, hauteurSol(0, 0.6), 0.6];

    const peints = () => {
      const img = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
      let n = 0;
      for(let y = 0; y < cvs.height; y += 2) for(let x = 0; x < cvs.width; x += 2)
        if(img[(y*cvs.width + x)*4 + 3] >= 8) n++;
      return n;
    };

    /* Ce que la carte AJOUTE, pour une destination donnée. On rejoue le vrai
       départ — `lanceVoyage`, et non une copie de sa décision : un contrôle qui
       refait le calcul qu'il surveille se met d'accord avec lui-même. */
    const ajout = (d) => {
      TELESCOPE.trajet = null; TELESCOPE.retour = false;
      TELESCOPE.carte = 0; TELESCOPE.grille = 0;
      // On remet le vaisseau sur son orbite : `lanceVoyage` part de là où il
      // est, et le trajet précédent l'a déplacé. C'est le défaut du 9 août.
      salon.p = [salon.apo, 0, 0];
      lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
      RECUL.etat.t = 0.999;
      let t = avanceImages(30);
      TELESCOPE.carte = 1;                 // le voile est monté : on est à l'arrivée
      ETOILES_S.dessine = () => {};
      t = avanceImages(4, t); const sans = peints();
      ETOILES_S.dessine = vraiDessine;
      t = avanceImages(4, t); const avec = peints();
      return avec - sans;
    };

    const attend = DESTINATIONS.filter(d => d.carte === true);
    const refuse = DESTINATIONS.filter(d => d.carte !== true);

    point("des destinations déclarent la carte, et d'autres non",
          attend.length > 0 && refuse.length > 0,
          "au moins une de chaque", `${attend.length} / ${refuse.length}`,
          "sans les deux, la comparaison qui suit ne compare rien");

    // Une seule mesure par destination : `ajout` relance un vrai voyage, et
    // l'appeler deux fois pour le même point mesurerait deux départs différents.
    for(const d of attend){
      const n = ajout(d);
      point(`« ${d.id} » montre bien la carte`, n > 200,
            "> 200 pixels ajoutés", n,
            "sinon le point suivant serait satisfait par une carte cassée partout");
    }
    for(const d of refuse){
      const n = ajout(d);
      point(`« ${d.id} » ne montre pas la carte`, Math.abs(n) < 40,
            "< 40 pixels ajoutés", n,
            "les dix orbites du centre galactique n'ont rien à faire ici");
    }

    /* Et le pied du panneau suit la destination. Il n'y en avait qu'un, et il
       écrivait « le trou noir est là, au centre » à qui venait de s'en éloigner
       de vingt-sept mille années-lumière. */
    const pieds = DESTINATIONS.map(d => { poseArrivee(d); return $("in-pied").textContent; });
    point("chaque destination a son propre pied de panneau",
          new Set(pieds).size === pieds.length && pieds.every(p => p && p.length > 40),
          `${pieds.length} textes distincts et pleins`,
          `${new Set(pieds).size} distincts, le plus court ${Math.min(...pieds.map(p => (p||"").length))}`,
          "deux destinations qui partagent leur pied en ont forcément une qui ment");
    point("et aucun ne laisse voir une clé nue",
          pieds.every(p => !/^tele\./.test(p)),
          "aucun texte commençant par « tele. »",
          pieds.filter(p => /^tele\./.test(p)).join(" · ") || "aucun",
          "une clé non résolue s'affiche telle quelle, et personne ne la lit");
  } finally {
    ETOILES_S.dessine = vraiDessine;
    TELESCOPE.trajet = av.trajet; TELESCOPE.retour = av.retour;
    TELESCOPE.carte = av.carte; TELESCOPE.grille = av.grille;
    RECUL.etat.actif = false;
    $("in-pied").textContent = av.pied;
    joueur.p = av.p; salon.p = av.sp;
    salon.lacet = av.lacet; salon.tangage = av.tangage;
    degele();
    if(lieu !== av.lieu) vaAu(av.lieu);
    avanceImages(2);
  }
  return enCours;
}

/* 5 quater bis. LA SCÈNE SOLAIRE — ET LE DÉFAUT QU'ELLE A COÛTÉ.

   TROUVÉ À L'ŒIL LE 11 AOÛT, en regardant la première image de la scène : le
   Soleil n'était pas là. Pas mal placé — ABSENT. La baie regarde l'astre pendant
   tout le vol, ce qui est exactement ce qui rend le recul visible ; mais on
   arrive alors DOS à sa destination, puisqu'elle est au bout du rayon qu'on a
   suivi. Vingt-sept mille années-lumière pour arriver le nez contre une cloison.

   Aucun contrôle ne pouvait le dire : `outil-verif-approche.js` sait que le
   module rend les bons nombres, et il les rendait. Ce qui manquait n'est pas
   dans le module, c'est l'orientation de la pièce autour de lui — et ça, ça se
   mesure dans un navigateur ou pas du tout. Règle 1 : le défaut devient un
   contrôle, et le voici.

   LA MESURE EST DIFFÉRENTIELLE, comme celle de l'arrivée : on compte ce que la
   scène AJOUTE à l'écran, avec et sans son dessin. Un compte absolu serait
   satisfait par le décor de la pièce.

   ET ELLE SE JOUE DEUX FOIS : vaisseau retourné, puis vaisseau NON retourné —
   c'est-à-dire le code d'avant. La première doit peindre, la seconde presque
   rien. C'est l'écart entre les deux qui est le contrôle ; sans le second point,
   une scène peinte au hasard sur tout l'écran passerait au vert. */
function sceneSolaire(){
  ouvre("La scène solaire est devant la baie, pas dans le dos");
  const av = { lieu, p: joueur.p.slice(), sp: salon.p.slice(),
               lacet: salon.lacet, tangage: salon.tangage, retourne: salon.retourne,
               trajet: TELESCOPE.trajet, retour: TELESCOPE.retour,
               carte: TELESCOPE.carte, grille: TELESCOPE.grille,
               dUa: APPROCHE.etat.dUa, actif: APPROCHE.etat.actif };
  const degele = fige();
  const vraiDessine = APPROCHE.dessine;
  const cvs = ctx.canvas;
  try {
    if(lieu !== "salon") vaAu("salon");
    joueur.p = [0, hauteurSol(0, 0.6), 0.6];

    /* ON COMPTE LES PIXELS CLAIRS, PAS LES PIXELS PEINTS — et cette distinction
       m'a repris au premier jet. Le voile de la scène couvre toute la baie dès
       la première image, à n'importe quelle distance : compter tout ce qui n'est
       pas transparent donnait 59 070 en bas de la chute et 59 048 dans le nuage.
       Le contrôle « bien moins qu'en bas » passait donc au vert, à vingt-deux
       pixels près, en ne mesurant rien du tout.

       Ce qui distingue les deux régimes, ce sont les ANNEAUX, les noms et le
       halo — tout ce qui est clair. Le voile, lui, est à peine plus qu'un noir :
       #05050a sous une opacité de 0,45. On pèse donc chaque pixel par son éclat
       ET par son alpha, et le seuil laisse le voile dehors sans discuter. */
    /* ON COMPTE LES PIXELS QUI CHANGENT, ET NON LES PIXELS CLAIRS — 17 août.

       `clairs()` pesait chaque pixel par son éclat, avec un seuil. La scène
       solaire est dessinée à l'opacité du recul, qui vaut 0,33 près de
       l'arrivée : sous ce seuil, presque rien ne comptait, et le contrôle ne
       tenait que parce qu'il levait la carte des étoiles à la main pour tripler
       la luminosité. Une mesure qui a besoin qu'on truque la scène ne mesure pas
       la scène.

       Ce qu'on veut savoir est « le dessin change-t-il l'image ? ». On le
       demande donc directement : la même image, avec et sans, et l'on compte les
       pixels qui diffèrent. Aucun seuil de luminosité à choisir — et le plancher
       de bruit se mesure avec le MÊME geste, dessin ôté des deux côtés. */
    const empreinte = () => {
      const img = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
      const out = new Uint8ClampedArray(Math.ceil(cvs.height/2)*Math.ceil(cvs.width/2)*4);
      let k = 0;
      for(let y = 0; y < cvs.height; y += 2) for(let x = 0; x < cvs.width; x += 2){
        const i = (y*cvs.width + x)*4;
        out[k++] = img[i]; out[k++] = img[i+1]; out[k++] = img[i+2]; out[k++] = img[i+3];
      }
      return out;
    };

    const d = DESTINATIONS.find(x => x.scene === "solaire");
    point("une destination déclare une scène", !!d,
          "au moins une", d ? d.id : "aucune",
          "sans elle, tout ce qui suit ne mesurerait rien");
    if(!d) return enCours;

    /* On rejoue le VRAI voyage, comme `arriveeJuste` : un contrôle qui refait la
       décision qu'il surveille se met d'accord avec lui-même. Puis on ATTEND que
       le demi-tour soit fini, au lieu de le supposer — c'est la règle 5, et
       c'est exactement ce qui a fait mentir cette mesure au premier jet : je
       posais `salon.retourne` à la main entre deux images, et `majVoyage`, qui
       en est le seul écrivain, le ramenait à sa valeur à l'image suivante. */
    let t = 0;
    const arrive = (dUa) => {
      TELESCOPE.trajet = null; TELESCOPE.retour = false;
      TELESCOPE.carte = 0; TELESCOPE.grille = 0;
      salon.lacet = 0; salon.tangage = -0.05; salon.retourne = 0;
      salon.p = [salon.apo, 0, 0];
      lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
      /* ON PLACE LE VAISSEAU, ON NE POSE PLUS LA SCÈNE — 17 août 2026.

         Il y avait ici `RECUL.etat.t = 0.999` puis `APPROCHE.pose(dUa)`, et
         `suitLesScenes` rangeait la scène à l'image suivante : à 0,999 on est en
         bas de la chute, la scène solaire est éteinte et c'est la Terre qui
         remplit la baie. Ce contrôle mesurait donc « ce que la scène solaire
         ajoute » avec la scène solaire ÉTEINTE, et il passait au vert sur le
         scintillement de la carte des étoiles.

         Il s'est vu le jour où l'ancre de la Terre a changé : la mesure a viré
         au rouge en donnant −888, c'est-à-dire un ajout négatif. Un contrôle qui
         ne bouge que par accident ne contrôlait rien.

         `placeSurLeVol` est le geste de la page, et la séance emploie le même :
         on dit où l'on est, la page allume ce qu'elle allume. */
      placeSurLeVol(dUa * SOLAIRE.UA);
      t = avanceImages(4, t);
      /* LE DEMI-TOUR EST POSÉ À SON POINT FIXE, PAS JOUÉ. Il dure trois
         secondes, soit cent quatre-vingts images à la cadence de ce contrôle,
         et trois arrivées en coûtaient sept minutes.

         Un est un POINT FIXE de son écrivain : `majVoyage` calcule
         `min(1, retourne + dt/3)` tant qu'on est arrivé à une destination qui
         porte une scène. Le poser à un et laisser tourner trois images ne
         court-circuite donc rien — au contraire, ça ÉPROUVE que `majVoyage` le
         maintient, et le point qui suit le vérifie avant de conclure. S'il
         redescendait, c'est que le demi-tour ne serait pas armé du tout. */
      salon.retourne = 1;
      /* ON NE LÈVE PLUS LA CARTE DES ÉTOILES À LA MAIN. Il y avait ici
         `TELESCOPE.carte = 1`, et l'opacité de la scène en dépend : elle valait
         donc 1 au lieu des 0,33 qu'elle a vraiment. La destination « soleil »
         déclare `carte: false` depuis le 10 août — la lever était mesurer une
         luminosité que personne ne voit. */
      t = avanceImages(25, t);        // et les fondus finissent de converger
    };

    // Où le Soleil tombe-t-il à l'écran ? C'est la question du défaut, posée
    // directement : la page projette la même direction que le dessin.
    const ouSoleil = () => {
      const u = norm(salon.p), loin = Math.max(1e6, len(cam.pos)*1000);
      return projette([cam.pos[0]+u[0]*loin, cam.pos[1]+u[1]*loin, cam.pos[2]+u[2]*loin]);
    };

    /* LE DÉFAUT DU 11 AOÛT, ET IL SE DIT EN UNE LIGNE. La baie regarde l'astre
       pendant tout le vol ; sans demi-tour, on arrive DOS à sa destination et
       `projette` rend `null`. Le contrôle a donc deux moitiés qui doivent être
       vraies ENSEMBLE : avant, rien ; après, quelque chose. */
    arrive(APPROCHE.ARRIVEE_UA);
    point("le vaisseau s'est retourné en arrivant", salon.retourne >= 1,
          "1", +salon.retourne.toFixed(3),
          "trois secondes de manœuvre, et c'est `majVoyage` qui les écrit");
    const apres = ouSoleil();
    point("et le Soleil est devant la baie", !!apres,
          "une position à l'écran", apres ? `${Math.round(apres[0])}, ${Math.round(apres[1])}` : "DANS LE DOS",
          "c'est le défaut du 11 août : vingt-sept mille années-lumière pour "
          + "arriver le nez contre une cloison");

    /* ET LA MOITIÉ QUI PROUVE L'AUTRE : sans le demi-tour, il n'y a rien. On ne
       repose pas `salon.retourne` — `majVoyage` en est le seul écrivain et le
       reprendrait — on regarde AVANT que la manœuvre commence. */
    TELESCOPE.trajet = null; TELESCOPE.carte = 0;
    salon.lacet = 0; salon.tangage = -0.05; salon.retourne = 0;
    salon.p = [salon.apo, 0, 0];
    lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
    RECUL.etat.t = 0.999;
    t = avanceImages(2, t);
    const avant = ouSoleil();
    point("alors qu'avant le demi-tour, il était dans le dos",
          !avant && salon.retourne < 0.2,
          "aucune position, manœuvre à peine entamée",
          (avant ? `${Math.round(avant[0])}, ${Math.round(avant[1])}` : "dans le dos")
          + ` (retourne ${salon.retourne.toFixed(3)})`,
          "si les deux moitiés répondaient pareil, cette mesure ne mesurerait rien");

    /* LES DEUX RÉGIMES, À L'ÉCRAN. La mesure est différentielle : on compte ce
       que la scène AJOUTE, avec et sans son dessin. Un compte absolu serait
       satisfait par le décor de la pièce. */
    /* LES FONDUS D'ABORD, LA MESURE ENSUITE — règle 5, et il a fallu se faire
       prendre pour l'écrire.

       Les deux passes étaient prises à six images d'écart, et rien n'était
       stabilisé entre elles : `TELESCOPE.carte`, la trame et le fondu du recul
       convergent d'un pas à chaque image. La différence portait donc leur
       progression autant que le dessin qu'on ôtait. Sur la scène du bas, où
       l'ajout se compte en centaines de pixels, ça ne se voyait pas ; depuis le
       nuage de Oort, où la scène entière est UN POINT, la mesure a rendu −16 puis
       −31 — un ajout négatif, c'est-à-dire du bruit pur.

       On laisse donc les fondus se poser, puis les deux passes partent de LA
       MÊME horloge et ne durent qu'une image. `mesureLeBruit` refait exactement
       le même geste avec le dessin ôté DES DEUX CÔTÉS : ce qu'il rend est le
       plancher de mesure, et les seuils se comparent à lui plutôt qu'à un
       nombre que j'aurais choisi. */
    const ajout = (bruit) => {
      const t0 = t;
      APPROCHE.dessine = () => {};
      avanceImages(1, t0); const sans = empreinte();
      APPROCHE.dessine = bruit ? () => {} : vraiDessine;
      t = avanceImages(1, t0); const avec = empreinte();
      APPROCHE.dessine = vraiDessine;
      /* LE SEUIL EST CELUI D'AVANT, appliqué à l'ÉCART. Compter tout pixel qui
         change reviendrait à compter tout pixel non transparent : le voile de la
         scène couvre la baie entière à n'importe quelle distance, et les deux
         régimes ont rendu 54 642 et 54 725 — à quatre-vingt-trois pixels près,
         c'est-à-dire rien du tout. C'est le piège déjà payé le 11 août, sous une
         autre forme.

         On garde donc l'éclat, pesé par l'alpha, et l'on demande que le dessin
         DÉPLACE cet éclat d'au moins vingt niveaux. Le voile en vaut trois —
         #05050a sous 0,45 — et reste dehors sans discuter ; les anneaux, les
         noms et le halo passent. Un écart signé, lui, ne dirait rien : la scène
         recouvre un fond étoilé, et ce qu'elle ajoute peut être plus sombre que
         ce qu'elle cache. */
      const eclat = (a, i) => (a[i] + a[i+1] + a[i+2])/3 * a[i+3]/255;
      let n = 0;
      for(let i = 0; i < sans.length; i += 4)
        if(Math.abs(eclat(avec, i) - eclat(sans, i)) >= 20) n++;
      return n;
    };

    arrive(APPROCHE.ARRIVEE_UA);
    const plancher = Math.abs(ajout(true));
    const bas = ajout();
    point("la mesure a un plancher, et il est bas", plancher <= 40,
          "≤ 40 pixels changés", plancher,
          "c'est le même geste avec le dessin ôté des deux côtés : si ce nombre "
          + "monte, les deux points suivants ne mesurent plus que du bruit — "
          + "c'est très exactement ce qui s'est passé le 17 août");
    point("en bas de la chute, la scène se peint", bas > 20*Math.max(1, plancher),
          "> " + 20*Math.max(1, plancher) + " pixels changés", bas,
          "les anneaux, le Soleil et les noms — ce qu'on a traversé vingt-sept "
          + "mille années-lumière pour voir");

    arrive(APPROCHE.DEPART_UA);
    const nuage = ajout();
    point("depuis le nuage, il y a quelque chose — un point",
          nuage > Math.max(2, plancher),
          "> " + Math.max(2, plancher) + " pixels changés", nuage,
          "un écran rigoureusement vide se lirait comme une panne, et c'est "
          + "justement la question posée à Hugo");
    /* LE FACTEUR EST DEUX, ET IL A ÉTÉ TROIS. Il valait trois quand la mesure
       comptait les pixels clairs de l'image entière, la carte des étoiles levée
       à la main : ce trois-là chiffrait un montage, pas la scène. À l'opacité
       vraie et sur l'écart, les deux régimes donnent 3 519 et 1 454 — un facteur
       2,4. Ce point n'est pas là pour policer ce nombre : il est là pour
       attraper le jour où les deux régimes se confondent, ce qui est très
       exactement ce que l'ancienne mesure faisait déjà sans le dire. */
    point("et bien moins qu'en bas de la chute", nuage < bas/2,
          "< " + Math.round(bas/2), nuage,
          "c'est le passage d'un régime à l'autre, mesuré : « rien à voir » "
          + "devient « ah, il y a quelque chose »");

    /* Et l'on regarde AILLEURS. La scène est posée là où le Soleil se trouve
       vraiment, pas au milieu de l'image : tourner la tête doit la faire sortir
       du champ, comme ce qu'on voit par une fenêtre. C'est la leçon du 9 août,
       et le recentrage se tait pendant cette scène, donc la tête reste où on la
       met. */
    salon.lacet += Math.PI;
    t = avanceImages(3, t);
    const dos = ajout();
    point("et si l'on regarde ailleurs, elle sort du champ", Math.abs(dos) < 40,
          "< 40 pixels changés", dos,
          "`projette` rend `null` derrière le plan de coupure, et l'on ne "
          + "dessine alors rien plutôt que de rabattre la scène au centre");
  } finally {
    APPROCHE.dessine = vraiDessine;
    APPROCHE.range();
    APPROCHE.etat.dUa = av.dUa; APPROCHE.etat.actif = av.actif;
    TELESCOPE.trajet = av.trajet; TELESCOPE.retour = av.retour;
    TELESCOPE.carte = av.carte; TELESCOPE.grille = av.grille;
    RECUL.etat.actif = false;
    joueur.p = av.p; salon.p = av.sp;
    salon.lacet = av.lacet; salon.tangage = av.tangage; salon.retourne = av.retourne;
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

/* 5 quinquies. UNE QUESTION DE SÉANCE NE DÉRANGE RIEN ET NE SE DÉROBE PAS.

   Écrit le 16 août 2026, et les deux moitiés viennent d'un défaut réel.

   RÉÉCRIT LE 17 : IL NOMMAIT SES DEUX QUESTIONS, et le jour où Hugo les a jugées
   « ça va » elles sont sorties de la file — le contrôle a rougi sur « les deux
   questions sont bien posées », en reprochant à la séance d'avoir fait
   exactement ce qu'on lui demande. Un contrôle épinglé à un cas particulier
   meurt le jour où ce cas est réglé, c'est-à-dire le jour où l'on a le plus
   besoin de lui ; c'est la troisième fois de la journée que ce piège se referme.
   Il porte donc les deux invariants sur TOUTES les questions vivantes, sans en
   nommer aucune.

   LA PREMIÈRE EST LE PIÈGE DU 11 AOÛT, DÉPLACÉ. Ce jour-là, `rangeGrandTrajet`
   remettait « fidele » EN DUR en sortant de séance : juste tant que le rythme
   n'était pas réglable, et destructeur le jour où le bouton est apparu — dix
   minutes de jugement, et l'on ressortait avec un réglage qu'on n'avait pas
   demandé. Le repère du voyage est réglable depuis le 14 août, et la question
   qui le juge doit en poser les deux valeurs : le même piège est armé, à la
   même place. On écrit donc un choix de joueur, on joue la question, et l'on
   exige de le retrouver.

   LA SECONDE A ÉTÉ MESURÉE ICI AVANT D'EXISTER AILLEURS. La question de la
   vitre avant tourne la visée de 180° pour mettre Hugo devant l'ouverture —
   mais `recentre` ramène la visée vers l'astre à 0,8 par seconde, soit 21° en
   six dixièmes de seconde. La vue se dérobait pendant qu'il la regardait, et il
   l'aurait jugée mauvaise pour une raison qui n'est pas celle qu'on lui
   demande. Le remède est le drapeau que la page pose elle-même quand la main
   prend la visée ; ce contrôle exige que l'écart TIENNE dans le temps.

   POURQUOI IL VIT DANS LA PAGE et pas dans un outil : `recentre` est appelé par
   la boucle de rendu, et c'est l'écoulement des images qui révèle la dérive. Un
   outil qui lirait le texte de `juge.js` pour y chercher le drapeau serait vert
   le jour où le drapeau est posé au mauvais endroit.

   RÈGLE 5 — il maîtrise l'état d'où il mesure : il fige le salon, écrit le
   repère qu'il veut, et rend tout dans le `finally`, y compris quand un point
   échoue.                                                                     */
function questionsDuVoyage(){
  ouvre("Une question de séance ne dérange rien et ne se dérobe pas");
  if(typeof JUGE === "undefined"){
    point("la séance est chargée", false, "JUGE", "absent",
          "ouvrir `?verif&juge` pour jouer ce contrôle");
    return enCours;
  }
  point("il reste des questions ouvertes à jouer", JUGE.DECISIONS.length > 0,
        "> 0", JUGE.DECISIONS.length,
        "une file vide passerait tout ce qui suit sans rien exercer");

  const av = { repere: RECUL.repere, rythme: RECUL.rythme,
               lacet: salon.lacet, tangage: salon.tangage };
  const degele = fige();
  const efface = [], derobent = [];
  let derive = null;
  try {
    for(const d of JUGE.DECISIONS){
      /* --- LE PIÈGE DU 11 AOÛT : la séance efface le réglage du joueur.

         Ce jour-là, `rangeGrandTrajet` remettait « fidele » EN DUR en sortant :
         juste tant que le rythme n'était pas réglable, destructeur le jour où le
         bouton est apparu. On écrit donc un choix de joueur qui n'est le défaut
         d'aucun des deux réglages, on joue la question et sa sortie, et l'on
         exige de le retrouver. */
      RECUL.poseRepere("quadrillage");
      RECUL.poseRythme("fidele");
      if(typeof d.pose === "function") d.pose();
      if(d.options) for(const o of d.options) if(typeof o.fait === "function"){
        o.fait(); avanceImages(2);
      }
      if(typeof d.rend === "function") d.rend();
      avanceImages(2);
      if(RECUL.repere !== "quadrillage" || RECUL.rythme !== "fidele")
        efface.push(d.id + " (" + RECUL.repere + ", " + RECUL.rythme + ")");

      /* --- ET LA VUE TIENT PENDANT QU'ON LA REGARDE.

         `recentre` ramène la visée vers l'astre à 0,8 par seconde, soit 21° en
         six dixièmes. Une scène de séance qui se dérobe pendant qu'Hugo la juge
         lui fait juger autre chose que ce qu'on lui demande — c'est le défaut
         mesuré ici le 16 août, avant qu'il n'existe ailleurs. Le remède est le
         drapeau que la page pose quand la main prend la visée ; ce point exige
         que l'écart TIENNE, pour toute question, sans en nommer aucune. */
      if(typeof d.pose === "function") d.pose();
      avanceImages(2);
      const a0 = salon.lacet;
      avanceImages(60);                            // une seconde
      let dl = salon.lacet - a0;
      while(dl >  Math.PI) dl -= 2*Math.PI;
      while(dl < -Math.PI) dl += 2*Math.PI;
      const deg = Math.abs(dl) * 180/Math.PI;
      if(derive === null || deg > derive) derive = deg;
      if(deg > 5) derobent.push(d.id + " : " + deg.toFixed(1) + "°");
      if(typeof d.rend === "function") d.rend();
      avanceImages(2);
    }

    point("aucune n'efface le réglage du joueur", efface.length === 0,
          "aucune", efface.length ? efface.join(" · ") : "aucune",
          "le piège du 11 août : dix minutes de jugement, et l'on ressort avec "
          + "un réglage qu'on n'a pas demandé");
    point("et aucune vue ne se dérobe pendant qu'on la regarde",
          derobent.length === 0, "moins de 5° en une seconde",
          derobent.length ? derobent.join(" · ")
                          : "au pire " + (derive === null ? "?" : derive.toFixed(1)) + "°",
          "le recentrage referme la moitié de l'écart en une seconde ; Hugo "
          + "jugerait une vue qui glisse, et il aurait raison de la trouver "
          + "mauvaise — pour une raison qui n'est pas celle qu'on lui demande");

    /* LE TÉMOIN : sans le drapeau, ça DOIT bouger. Sans lui, « la vue tient »
       serait vrai d'une séance qui ne pose plus aucune scène. On rejoue la
       dernière question dans l'état exact d'avant le 16 août. */
    const last = JUGE.DECISIONS[JUGE.DECISIONS.length - 1];
    let sansDrapeau = null;
    if(last && typeof last.pose === "function"){
      last.pose();
      avanceImages(2);
      if(TELESCOPE.trajet){
        TELESCOPE.trajet.mainPrise = false;
        salon.lacet += Math.PI;                    // on regarde ailleurs, exprès
        const b0 = salon.lacet;
        avanceImages(60);
        let db = salon.lacet - b0;
        while(db >  Math.PI) db -= 2*Math.PI;
        while(db < -Math.PI) db += 2*Math.PI;
        sansDrapeau = Math.abs(db) * 180/Math.PI;
      }
      if(typeof last.rend === "function") last.rend();
      avanceImages(2);
    }
    point("et le témoin montre ce qu'elles feraient sans le drapeau",
          sansDrapeau !== null && sansDrapeau > 15,
          "plus de 15° en une seconde",
          sansDrapeau === null ? "aucune scène à éprouver" : sansDrapeau.toFixed(1) + "°",
          "sans ce point, « la vue tient » serait vrai d'une séance qui ne pose "
          + "plus rien du tout");
  } finally {
    degele();
    RECUL.poseRepere(av.repere);
    RECUL.poseRythme(av.rythme);
    salon.lacet = av.lacet; salon.tangage = av.tangage;
    TERRELUNE.ferme(); APPROCHE.range();
    RECUL.etat.actif = false;
    if(TELESCOPE.trajet){ TELESCOPE.trajet = null; TELESCOPE.retour = false; }
    TELESCOPE.carte = 0;
    fermeTelescope();
    poseSalon();
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
    /* `#juge` EST DANS LA LISTE DEPUIS LE 16 AOÛT, et il aurait dû y être depuis
       le premier jour : c'est le seul outil du projet qu'aucun calcul ne
       remplace. Il en est sorti de l'écran sur le téléphone d'Hugo, boutons de
       réponse compris, et rien ne l'a dit. */
    document.querySelectorAll(".hud, #instrument, #presentation, #temps, #spectre, #voile, #juge")
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
  point("la quête a démarré", typeof PROG.queteActive !== "undefined" && PROG.queteActive, true,
        typeof PROG.queteActive !== "undefined" ? PROG.queteActive : "?");
  const etape = (typeof QUETE !== "undefined" && QUETE[PROG.iQuete]) ? QUETE[PROG.iQuete].id : null;
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
  if(typeof PROG.queteActive !== "undefined"){ PROG.queteActive = false; PROG.queteFinie = true; }
  const avant = REGISTRE.tout().length;

  ouvreTelescope();
  const liste = document.getElementById("in-liste");
  point("le télescope propose des destinations", liste.children.length >= 2, "≥ 2", liste.children.length);
  liste.children[0].click();

  let t = avanceImages(2400);
  point("on est arrivé", TELESCOPE.trajet && TELESCOPE.trajet.arrive === true, true,
        TELESCOPE.trajet ? TELESCOPE.trajet.arrive : "trajet absent");
  point("la carte des étoiles est là", TELESCOPE.carte > 0.9, "> 0,9", +TELESCOPE.carte.toFixed(3));
  point("le registre a inscrit le trajet", REGISTRE.tout().length === avant + 1,
        avant + 1, REGISTRE.tout().length);

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

/* 8 quater. LA SÉANCE POSE SA SCÈNE SUR UNE TABLE RASE.

   Hugo, le 16 août au soir, après avoir fait le voyage puis ouvert `?juge` :
   « le premier question de juge ne me remet pas au trou noir, j'ai du mal de
   juger je reste sur la terre. »

   La scène Terre-Lune était restée OUVERTE, laissée par sa partie, et elle se
   repeignait par-dessus à chaque image. Il jugeait le repère du voyage à travers
   une planète. Les quatre poseurs de scène de `juge.js` rangeaient le télescope,
   le trajet et la carte ; aucun ne rangeait les deux scènes.

   ON NE LE VOYAIT PAS TANT QUE LA TERRE ÉTAIT LOIN : il fallait deux boutons
   pour y arriver. Depuis que le voyage est d'un seul tenant, y arriver est
   devenu la chose la plus facile du site.

   ET LE PIÈGE SE REFERME SUR SOI, comme celui de `couture()` : en rejouant la
   séance à la main sur une page fraîche, on ne revient jamais de la Terre, donc
   tout paraît normal. Ce contrôle salit donc D'ABORD, exprès — il ouvre les deux
   scènes — puis pose la question et exige qu'elles aient disparu.              */
function seanceTableRase(){
  ouvre("La séance pose sa scène sur une table rase");
  if(typeof JUGE === "undefined"){
    point("la séance est chargée", false, "JUGE", "absent",
          "ouvrir `?verif&juge` pour jouer ce contrôle");
    return enCours;
  }
  const av = { lacet: salon.lacet, tangage: salon.tangage, retourne: salon.retourne,
               trajet: TELESCOPE.trajet, carte: TELESCOPE.carte };
  const degele = fige();
  try {
    /* ON SALIT NOUS-MÊMES — même manœuvre que `seanceSansTrace`, et pour la même
       raison : un contrôle accroché au contenu de la file ne protège que tant
       que la file contient le cas. Ce qui est éprouvé est le MÉCANISME. */
    const H = vueH || cv.clientHeight, W = vueW || cv.clientWidth;
    TERRELUNE.ouvre(TERRELUNE.echelle(cam.focale, H), W, cam.focale);
    APPROCHE.pose(APPROCHE.DEPART_UA);
    salon.retourne = 1;
    point("on a bien sali avant de mesurer",
          TERRELUNE.etat.actif && APPROCHE.etat.actif,
          "les deux scènes ouvertes",
          `terre-lune ${TERRELUNE.etat.actif}, solaire ${APPROCHE.etat.actif}`,
          "sans ça les trois points suivants passeraient au vert à vide — c'est "
          + "exactement pourquoi le défaut a survécu : sur une page fraîche, "
          + "on ne revient jamais de la Terre");

    /* ON NE DEMANDE PAS « la Terre est-elle fermée » : la question de l'arrivée
       DOIT l'ouvrir, et exiger le contraire d'elle serait absurde. On ne
       nomme pas les questions non plus — un contrôle accroché au contenu de la
       file ne protège que tant que la file contient le cas.

       CE QU'ON MESURE EST L'HÉRITAGE. On marque la scène sale avec une valeur
       qu'aucune ouverture ne produirait ; après chaque pose, elle doit être
       fermée, ou rouverte pour de bon — jamais retrouvée telle qu'on l'a
       laissée. La marque distingue « elle a repris la main » de « elle a
       hérité », ce qu'aucun drapeau ne dirait. */
    const MARQUE = 7.77;
    /* ET LE DEMI-TOUR PORTE SA PROPRE MARQUE — 17 août 2026.

       On salissait avec `salon.retourne = 1`, et l'on refusait de le retrouver à
       1 après la pose. C'était juste tant qu'un seul état était légitime. Depuis
       que le vaisseau se retourne pour freiner, la question de l'arrivée pose
       une scène où il EST retourné : un vrai 1, indiscernable de l'hérité.

       Une valeur qu'aucun poseur ne produit règle ça — c'est déjà l'argument
       écrit trois lignes plus haut pour la scène Terre-Lune, et il valait pour
       celui-ci sans que personne l'applique. */
    const DEMI = 0.37;
    const heritees = [];
    let posees = 0;
    for(const d of JUGE.DECISIONS){
      if(typeof d.pose !== "function") continue;
      TERRELUNE.ouvre(TERRELUNE.echelle(cam.focale, H), W, cam.focale);
      TERRELUNE.etat.t = MARQUE;
      APPROCHE.pose(APPROCHE.DEPART_UA);
      salon.retourne = DEMI;

      d.pose();
      posees++;
      if(TERRELUNE.etat.actif && TERRELUNE.etat.t === MARQUE) heritees.push(d.id + " (Terre)");
      if(APPROCHE.etat.actif && !TERRELUNE.etat.actif
         && APPROCHE.etat.dUa === APPROCHE.DEPART_UA && !APPROCHE.etat.chute
         && d.id.indexOf("solaire") < 0) heritees.push(d.id + " (solaire)");
      if(salon.retourne === DEMI) heritees.push(d.id + " (demi-tour)");
    }

    point("toutes les questions ont posé leur scène", posees > 0, "> 0", posees,
          "zéro passerait le point suivant sans rien mesurer");
    point("aucune n'hérite d'une scène laissée par la partie",
          heritees.length === 0, "aucune",
          heritees.length ? heritees.join(", ") : "aucune",
          "c'est le défaut qu'Hugo a vu : il venait d'arriver à la Terre, il a "
          + "ouvert la séance, et il jugeait le repère du voyage à travers une "
          + "planète");
  } finally {
    degele();
    TERRELUNE.ferme();
    APPROCHE.range();
    RECUL.etat.actif = false;
    TELESCOPE.trajet = av.trajet;
    TELESCOPE.carte = av.carte;
    salon.lacet = av.lacet; salon.tangage = av.tangage; salon.retourne = av.retourne;
    fermeTelescope();
    poseSalon();
    avanceImages(2);
  }
  return enCours;
}

/* 8 septies. LA DESTINATION EST DEVANT NOUS PENDANT TOUTE LA SECONDE MOITIÉ.

   Hugo, le 17 août 2026 : « lors de l'arrivée du voyage dans le système solaire,
   la transition est très ratée. On zoom sur le Soleil, puis tout disparaît et la
   Terre apparaît à l'opposé d'où on regarde (vitre arrière). »

   DEUX DÉFAUTS DANS UNE SEULE PHRASE, et je n'ai vu le second qu'en mesurant.

   Le premier est celui qu'il décrit : deux lois pour un même endroit du ciel. La
   scène solaire se plaçait au bout du rayon suivi, la scène Terre-Lune au centre
   de la baie — cent quatre-vingts degrés d'écart. Réparé dans
   `RECUL.versDestination`, une seule loi pour les deux.

   Le second est plus grave et ne se voyait pas : le vaisseau ne se retournait
   qu'APRÈS être arrivé. Pendant toute l'approche, la destination était donc
   derrière la caméra — `projette` rendait `null` à chaque instant de la descente,
   pour le Soleil comme pour la Terre. Il fallait se battre contre le recentrage
   pour regarder où l'on va. Un vol à 1 g freine la seconde moitié du chemin, et
   pour freiner on se retourne : le demi-tour tombe au milieu, pas à la fin.

   CE QU'ON MESURE, et sa vérité vient de la caméra de la page : à six distances
   qui couvrent toute la seconde moitié, le point où l'on va se projette à
   l'écran. Le TÉMOIN est la première moitié, où il doit être dans le dos —
   sans lui, un contrôle qui ne saurait plus projeter passerait au vert.       */
function transitionDuVoyage(){
  ouvre("La destination reste devant nous jusqu'au bout");
  const d = DESTINATIONS.find(x => x.scene === "solaire");
  if(!d){ point("une destination porte une scène", false, "une", "aucune"); return enCours; }
  const av = { lieu, p: joueur.p.slice(), sp: salon.p.slice(),
               lacet: salon.lacet, tangage: salon.tangage, retourne: salon.retourne,
               trajet: TELESCOPE.trajet, carte: TELESCOPE.carte, grille: TELESCOPE.grille };
  const degele = fige();
  /* UNE SEULE HORLOGE, ENFILÉE D'UN BOUT À L'AUTRE. `avanceImages` sans horloge
     repart de `performance.now()`, et la boucle voit alors un bond de plusieurs
     secondes : le demi-tour, qui avance de dt/3, se retrouvait à 0,98 en quatre
     images. Le témoin mesurait un vaisseau déjà retourné et rougissait. */
  let t = performance.now();
  try {
    if(lieu !== "salon") vaAu("salon");
    /* On pose la scène d'où l'on mesure, et on la vérifie — règle 5. Le
       demi-tour est un POINT FIXE de `majVoyage` passé la mi-chemin : le poser
       à un et laisser tourner quelques images n'est pas un raccourci, c'est
       éprouver que la page le MAINTIENT. Trois secondes jouées six fois
       coûteraient onze minutes sur une machine sans carte graphique. */
    const place = (dUa) => {
      TELESCOPE.trajet = null; TELESCOPE.retour = false;
      TELESCOPE.carte = 0; TELESCOPE.grille = 0;
      salon.lacet = 0; salon.tangage = -0.05; salon.retourne = 0;
      salon.p = [salon.apo, 0, 0];
      lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
      placeSurLeVol(dUa * SOLAIRE.UA);
      salon.retourne = 1;
      /* ET ON LAISSE LE RECENTRAGE CONVERGER. Huit images suffisaient à
         mesurer « la tête est encore où je l'ai mise » : en sabotant la cible du
         recentrage — on la remet sur l'astre qu'on quitte — le contrôle restait
         vert. Il faut laisser la visée ALLER où elle va. */
      t = avanceImages(110, t);
      return versLaDestination();
    };

    const etapes = [APPROCHE.DEPART_UA, 4000, 800, 150, 20, 1.2];
    const dos = [];
    for(const dUa of etapes){
      const q = place(dUa);
      if(!q) dos.push(Math.round(dUa) + " UA");
    }
    /* ET LE DEMI-TOUR N'EST PAS POSÉ : ON LE LAISSE SE FAIRE. Les six étapes
       ci-dessus l'ont posé à son point fixe pour ne pas jouer six fois trois
       secondes ; ce point-ci le gagne honnêtement, une seule fois, en partant
       de zéro à une distance de la seconde moitié. C'est lui qui dirait qu'on a
       remis la manœuvre à l'arrivée. */
    TELESCOPE.trajet = null; TELESCOPE.carte = 0; TELESCOPE.grille = 0;
    salon.lacet = 0; salon.tangage = -0.05; salon.retourne = 0;
    salon.p = [salon.apo, 0, 0];
    lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
    placeSurLeVol(800 * SOLAIRE.UA);
    const arriveDeja = TELESCOPE.trajet.arrive;
    t = avanceImages(260, t);
    point("le vaisseau se retourne parce qu'il FREINE, pas parce qu'il arrive",
          salon.retourne >= 1 && !arriveDeja, "1, et pas encore arrivé",
          +salon.retourne.toFixed(3) + (arriveDeja ? ", DÉJÀ ARRIVÉ" : ", en vol"),
          "à huit cents unités astronomiques il reste du chemin : si la manœuvre "
          + "attend l'arrivée, la destination est derrière la caméra pendant "
          + "toute la descente, et c'est le défaut du 17 août");
    point("à chaque étape de la descente, on voit où l'on va",
          dos.length === 0, "aucune étape dans le dos",
          dos.length ? dos.join(", ") : "aucune",
          "c'est ce qu'Hugo a subi : le Soleil puis la Terre derrière la coque, "
          + "et le recentrage qui ramène la tête vers ce qu'on quitte");

    /* LE TÉMOIN. Avant la mi-chemin le vaisseau n'a pas encore freiné : il
       regarde ce qu'il quitte, et la destination DOIT être dans le dos. Sans ce
       point, « on voit où l'on va » serait vrai d'une projection cassée qui
       rendrait un point pour tout. */
    TELESCOPE.trajet = null; TELESCOPE.carte = 0; TELESCOPE.grille = 0;
    salon.lacet = 0; salon.tangage = -0.05; salon.retourne = 0;
    salon.p = [salon.apo, 0, 0];
    lanceVoyage(d, VOYAGE.entre(distanceVaisseau(), d.d_m));
    RECUL.etat.t = 0.10;
    t = avanceImages(4, t);
    const tot = versLaDestination();
    point("alors qu'au début du voyage, elle est bien derrière",
          !tot && salon.retourne < 0.2,
          "dans le dos, demi-tour non entamé",
          (tot ? Math.round(tot[0]) + ", " + Math.round(tot[1]) : "dans le dos")
          + " (retourne " + salon.retourne.toFixed(2) + ")",
          "on part en regardant ce qu'on quitte : c'est ce qui rend le recul "
          + "visible, et c'est pour ça que le demi-tour existe");
  } finally {
    degele();
    TERRELUNE.ferme(); APPROCHE.range();
    RECUL.etat.actif = false;
    TELESCOPE.trajet = av.trajet; TELESCOPE.carte = av.carte; TELESCOPE.grille = av.grille;
    joueur.p = av.p; salon.p = av.sp;
    salon.lacet = av.lacet; salon.tangage = av.tangage; salon.retourne = av.retourne;
    fermeTelescope();
    if(lieu !== av.lieu) vaAu(av.lieu);
    poseSalon();
    avanceImages(2);
  }
  return enCours;
}

/* 8 sexies. LES ANGLES D'UNE QUESTION CHANGENT VRAIMENT CE QU'ON VOIT.

   Hugo, le 17 août 2026 : « les 4 boutons du juge ne changent rien, je vois
   toujours que la Terre en grand. »

   LA CAUSE, ET C'EST LA MALADIE DE LA MAISON. La séance écrivait
   `TERRELUNE.etat.t` ; `suitLesScenes` le RECALCULE à chaque image depuis la
   position du vol. Deux écrivains pour une valeur. Comme la séance posait le vol
   arrivé, la valeur recalculée était toujours la fin — la Terre en grand, quel
   que soit le bouton.

   ET LE PIÈGE EST CELUI DE L'ANCIEN GESTE DEVENU MUET. Écrire `etat.t` était
   juste jusqu'au 16 août ; ce jour-là l'avancement a cessé d'être une horloge
   pour se déduire de la distance, et le vieux geste n'est pas devenu faux, il est
   devenu SANS EFFET. Rien ne casse, rien ne lève d'erreur — seule une séance
   entière ne sert plus à rien.

   CE QU'ON MESURE : pour chaque question à options, deux angles au moins doivent
   donner deux états du monde différents. Pas « la fonction est appelée » — l'état
   APRÈS quelques images, c'est-à-dire après que la page a eu le temps de
   reprendre la main.

   D'OÙ VIENT SA VÉRITÉ : d'un relevé de l'état du monde qui ne sait rien des
   questions. Il ne nomme aucune option et ne connaît aucun identifiant ; il
   marche donc sur la file de demain.                                          */
function anglesDeSeance(){
  ouvre("Les angles d'une question changent vraiment ce qu'on voit");
  if(typeof JUGE === "undefined"){
    point("la séance est chargée", false, "JUGE", "absent",
          "ouvrir `?verif&juge` pour jouer ce contrôle");
    return enCours;
  }
  const av = { lacet: salon.lacet, tangage: salon.tangage, retourne: salon.retourne,
               p: salon.p.slice(), trajet: TELESCOPE.trajet, carte: TELESCOPE.carte,
               lieu };
  /* CE QU'ON RELÈVE : SEULEMENT CE QUI SE VOIT. Aucun nom d'option — le relevé
     doit valoir pour les questions qu'on n'a pas écrites.

     ET SURTOUT PAS `RECUL.etat.t` : c'est une ENTRÉE, pas une observable. La
     première version l'y mettait, et c'est ce qui a fait passer ce contrôle au
     vert le 17 août pendant qu'Hugo, lui, voyait la Terre en grand aux quatre
     boutons. L'avancement changeait bien ; la position, elle, ne bougeait pas,
     parce que `RECUL.avance(0)` rend la main sur un vol arrivé. Un contrôle qui
     relève ce qu'on ÉCRIT confirmera toujours qu'on a écrit.

     `distance` est prise en logarithme parce qu'elle vaut 2,5 × 10²⁰ : à cette
     échelle, un arrondi décimal effacerait exactement l'écart qu'on cherche. */
  const releve = () => [
    TERRELUNE.etat.actif ? +(TERRELUNE.etat.t / TERRELUNE.etat.duree).toFixed(4) : -1,
    APPROCHE.etat.actif  ? +Math.log10(Math.max(1, APPROCHE.etat.dUa)).toFixed(4) : -1,
    +Math.log10(Math.max(1, RECUL.etat.distance)).toFixed(9),
    +salon.lacet.toFixed(4), +salon.tangage.toFixed(4), +salon.retourne.toFixed(3),
    +Math.log10(Math.max(1, len(salon.p))).toFixed(6),
    RECUL.rythme, RECUL.repere, lieu,
  ].join("|");
  const muettes = [], vues = [], fixes = [], echoues = [];
  /* UNE SEULE HORLOGE, ENFILÉE. `avanceImages` sans horloge repart de
     `performance.now()` : appelée cent cinquante fois de suite, elle ne fait
     donc AVANCER la scène que du temps réel qu'elle met à s'exécuter, et le
     sabotage de la reprise passait au vert faute d'avoir joué deux secondes. */
  let hor = performance.now();
  try {
    for(const d of JUGE.DECISIONS){
      if(d.ignore || !d.options || d.options.length < 2) continue;
      /* ON PREND LE PLUS BAS DE LA TRANCHE, pas un instantané. Depuis que la
         scène de l'arrivée se REJOUE en boucle, une seule image tombe à une
         phase quelconque du cycle : deux angles pourraient s'y ressembler par
         hasard, ou un même angle différer de lui-même. Le début de sa tranche,
         lui, est l'identité de l'angle et ne dépend pas du moment où l'on
         regarde. */
      const etats = new Set();
      for(const o of d.options){
        if(typeof d.pose === "function") d.pose();
        if(typeof o.fait === "function") o.fait();
        hor = avanceImages(4, hor);      // que la page reprenne la main
        let bas = null, basU = Infinity, hautU = -Infinity, derU = -1;
        for(let k = 0; k < 150; k++){    // deux secondes et demie de scène
          const u = TERRELUNE.etat.actif && TERRELUNE.etat.duree
                  ? TERRELUNE.etat.t / TERRELUNE.etat.duree : -1;
          if(u < basU){ basU = u; bas = releve(); }
          if(u > hautU) hautU = u;
          derU = u;
          hor = avanceImages(1, hor);
        }
        etats.add(bas);
        /* ET LA SECONDE MOITIÉ DE SA PHRASE : « je n'ai QUE la Terre en grand
           qui RESTE ». Une fois la première réparation faite, les quatre angles
           jouaient — et finissaient tous au bout de la chute en moins de deux
           secondes. On serait passé de « rien ne bouge » à « tout finit pareil »
           sans avoir réglé sa question. */
        if(basU >= 0){
          if(hautU <= basU + 0.005)
            fixes.push(d.id + " / " + (o.nom || "?") + " : figé à " + basU.toFixed(3));
          if(basU < 0.9 && derU >= 0.999)
            echoues.push(d.id + " / " + (o.nom || "?") + " : parti de "
                         + basU.toFixed(3) + ", échoué au bout");
        }
      }
      vues.push(d.id + " : " + etats.size + "/" + d.options.length);
      if(etats.size < 2) muettes.push(d.id + " (" + d.options.length + " angles, un seul état)");
      if(typeof d.rend === "function") d.rend();
      hor = avanceImages(2, hor);
    }
    point("des questions à options ont été jouées", vues.length > 0,
          "> 0", vues.length ? vues.join(", ") : "aucune",
          "zéro passerait le point suivant sans rien mesurer");
    point("chaque angle est une scène qui joue, pas une image fixe",
          fixes.length === 0, "aucun figé",
          fixes.length ? fixes.join(" · ") : "aucun",
          "« je n'ai pas les différentes ANIMATIONS qui s'affichent » — ce qu'on "
          + "lui demande de juger est un enchaînement, et une scène figée ne dit "
          + "rien du rythme");
    point("et aucun ne s'échoue au bout de la chute",
          echoues.length === 0, "aucun",
          echoues.length ? echoues.join(" · ") : "aucun",
          "« je n'ai que la Terre en grand qui RESTE » : sans reprise, les "
          + "quatre angles arrivent au bout en moins de deux secondes et "
          + "montrent tous la même image");
    point("aucune ne montre la même chose sous tous ses angles",
          muettes.length === 0, "aucune",
          muettes.length ? muettes.join(" · ") : "aucune",
          "c'est ce qu'Hugo a subi : quatre boutons, et la Terre en grand à "
          + "chaque fois — parce que la séance écrivait une valeur que la page "
          + "recalcule à l'image suivante");
  } finally {
    TERRELUNE.ferme(); APPROCHE.range();
    RECUL.etat.actif = false;
    TELESCOPE.trajet = av.trajet; TELESCOPE.carte = av.carte;
    salon.p = av.p;
    salon.lacet = av.lacet; salon.tangage = av.tangage; salon.retourne = av.retourne;
    fermeTelescope();
    if(lieu !== av.lieu) vaAu(av.lieu);
    poseSalon();
    avanceImages(2);
  }
  return enCours;
}

/* 8 quinquies. LA SÉANCE TIENT SUR UN TÉLÉPHONE COUCHÉ.

   Hugo, le 17 août 2026, capture à l'appui : « la fenêtre de juge n'est pas
   adapté au layout mobile, elle sort de l'écran je n'y ai pas accès. »

   Il n'a plus son ordinateur. La séance de jugement est le SEUL outil du projet
   qu'aucun calcul ne remplace — c'est par elle que passe tout ce que lui seul
   peut voir — et elle était devenue inatteignable. Aucun des quarante-huit
   outils ne pouvait le dire : ils ne mesurent pas de mise en page.

   CE QU'ON MESURE : à chaque question de la file, aucun bouton ne dépasse de la
   fenêtre. Pas « le panneau tient dans l'écran » — il tenait déjà, borné, et les
   deux derniers boutons étaient quand même quarante-six pixels sous le bord.
   C'est du DÉBORDEMENT des boutons hors de leur propre fenêtre qu'il s'agit, et
   c'est ce que le moteur de rendu répond, pas ce que ma feuille de style
   prétend.

   D'OÙ VIENT SA VÉRITÉ : de la mise en page réelle, mesurée par le navigateur
   sur une fenêtre bornée à la hauteur d'un téléphone couché. Elle ne vient pas
   du texte de `juge.js`, qu'un outil hors navigateur pourrait relire sans jamais
   savoir où tombe un bouton.

   ET SON TÉMOIN, sans lequel il ne prouverait rien : on desserre la borne et
   l'on exige que le contenu déployé dépasse VRAIMENT les quatre cents pixels. Si
   la séance tenait naturellement dans un écran court, tous les points ci-dessous
   passeraient à vide.                                                          */
function seanceSurTelephone(){
  ouvre("La séance tient sur un téléphone couché");
  if(typeof JUGE === "undefined" || typeof JUGE.simuleEcran !== "function"){
    point("la séance est chargée", false, "JUGE.simuleEcran", "absent",
          "ouvrir `?verif&juge` pour jouer ce contrôle");
    return enCours;
  }
  /* DEUX HAUTEURS, ET LA PLUS BASSE EST CELLE QU'IL A VRAIMENT.

     402 était mon idée d'un téléphone couché. Le rapport de matériel de sa
     séance du 17 août dit 814 × 207 : un écran de 932 points, couché, moins la
     barre du navigateur. J'avais réglé la mise en page sur un appareil que je
     m'étais figuré, et il a rejugé sur le sien. On garde les deux — la seconde
     parce que c'est la vraie, la première parce qu'un palier qui ne serait juste
     qu'à sa borne basse serait juste par accident. */
  const b = JUGE.boite;
  const av = { spin, lieu, stock: localStorage.getItem(CLE) };
  try {
    for(const H of [402, 207]){
      if(JUGE.rapport === null) JUGE.demarre(); else JUGE.rejoue();
      JUGE.simuleEcran(H);
      point("l'écran de " + H + " px est simulé", b.classList.contains("court"),
            "la classe court", b.classList.contains("court") ? "posée" : "absente",
            "sans elle on mesurerait la mise en page d'un grand écran");

      /* LE TÉMOIN, pris sur la première question : desserré, le contenu doit
         dépasser. `simuleEcran` reste le seul écrivain de la classe — on lui
         demande un grand écran, on ne retire pas la classe à la main. */
      deplie(b);
      JUGE.simuleEcran(4000);
      const naturelle = b.scrollHeight;
      JUGE.simuleEcran(H);
      point("il y a vraiment plus de séance que d'écran à " + H + " px",
            naturelle > H - 24, "> " + (H - 24) + " px", naturelle + " px",
            "si la séance tenait d'elle-même dans cette hauteur, les points "
            + "suivants passeraient sans rien exercer");

      /* DEUX EXIGENCES, ET NON UNE — c'est ce contrôle lui-même qui l'a appris.

         Première écriture : « aucun bouton ne sort de la fenêtre ». Rouge sur la
         question de l'arrivée, qui porte quatre variantes : leurs boutons
         tombaient cinquante-six pixels sous le bord. Et c'était JUSTE, au sens où
         le rendu le disait — mais ce n'était pas un défaut : ces boutons-là
         vivaient alors dans le corps, qui défile.

         Depuis, ils sont passés dans le socle avec le champ libre, et la
         frontière est nette : ce qu'on TOUCHE ne bouge pas, ce qu'on LIT défile.
         Alors on sépare :
           — rien du socle ne sort de la fenêtre, jamais ;
           — et si le corps déborde, il doit VRAIMENT défiler, sinon la moitié
             de la question est perdue. */
      let n = 0, boutons = 0;
      const dehors = [], muets = [], etroits = [], menteurs = [];
      while(JUGE.rapport === null && n < 40){
        const d = JUGE.DECISIONS[n];
        deplie(b);
        /* ET LE BOUTON DE REPLI DIT CE QU'IL FERA. Il n'était réécrit qu'au
           changement de question : déplié, il continuait d'annoncer « Déplier ».
           Sur cet écran le panneau couvre presque tout, et c'est le seul chemin
           pour revoir la scène qu'on juge. */
        const bc = b.querySelector(".rangee.replie-visible") &&
                   b.querySelector(".rangee.replie-visible").lastElementChild;
        if(bc && /Déplier/.test(bc.textContent) && !b.classList.contains("replie"))
          menteurs.push(H + " px, " + (d ? d.id : "?") + " : déplié, il dit encore Déplier");
        const rb = b.getBoundingClientRect();
        /* LE CHAMP LIBRE COMPTE COMME UN BOUTON DU SOCLE, et pour une raison
           plus forte : c'est lui qui porte le verdict. Sur la première capture
           d'un téléphone couché il avait disparu entièrement, et il ne restait
           que quatre boutons de verdict — un « ça coince » sans une phrase ne dit
           pas ce qui coince. */
        for(const bt of b.querySelectorAll(".socle button, .socle textarea")){
          const r = bt.getBoundingClientRect();
          if(r.width < 1 && r.height < 1) continue;      // caché, pas débordant
          boutons++;
          const quoi = bt.tagName === "TEXTAREA" ? "le champ libre"
                                                 : bt.textContent.trim().slice(0, 24);
          if(r.top < rb.top - 1 || r.bottom > rb.bottom + 1)
            dehors.push(H + " px, " + (d ? d.id : "?") + " : " + quoi
                        + " (" + Math.round(r.top) + "→" + Math.round(r.bottom)
                        + " dans " + Math.round(rb.top) + "→" + Math.round(rb.bottom) + ")");
        }
        const co = b.querySelector(".corps");
        if(co && co.scrollHeight > co.clientHeight + 1){
          const f = getComputedStyle(co).overflowY;
          if(f !== "auto" && f !== "scroll")
            muets.push(H + " px, " + (d ? d.id : "?") + " : le corps déborde de "
                       + (co.scrollHeight - co.clientHeight) + " px sans défiler");
        }
        /* Et le champ doit rester ASSEZ GRAND pour recevoir une phrase — la
           leçon du 9 août : une boîte de la taille d'un mot ne reçoit que des
           mots. Vingt-huit pixels, c'est deux lignes de onze. */
        const ta = b.querySelector(".socle textarea");
        const ht = ta ? ta.getBoundingClientRect().height : 0;
        if(ht < 28) etroits.push(H + " px, " + (d ? d.id : "?") + " : " + Math.round(ht) + " px");
        n++;
        JUGE.repond("passé");
      }

      point("toutes les questions ont été affichées à " + H + " px",
            n > 0 && boutons > 0,
            "> 0", n + " question(s), " + boutons + " élément(s) de socle",
            "zéro passerait les points suivants sans rien mesurer");
      point("rien du socle ne sort de la fenêtre à " + H + " px",
            dehors.length === 0, "aucun",
            dehors.length ? dehors.join(" · ") : "aucun",
            "c'est le défaut qu'Hugo a subi : « Noter autre chose » et « Déplier "
            + "pour répondre » tombaient sous le bord, et la séance devenait "
            + "inutilisable sur le seul appareil qui lui reste");
      point("le champ libre garde de quoi écrire une phrase à " + H + " px",
            etroits.length === 0,
            "≥ 28 px", etroits.length ? etroits.join(" · ") : "toutes ≥ 28 px",
            "une boîte de la taille d'un mot ne reçoit que des mots — et c'est "
            + "dans ce champ que passe tout ce que lui seul peut voir");
      point("ce qui déborde du corps se rattrape en défilant à " + H + " px",
            muets.length === 0, "aucun",
            muets.length ? muets.join(" · ") : "aucun",
            "le corps ne porte que le texte de la question, et il en manque "
            + "toujours la moitié sur un écran couché : sans ascenseur, c'est la "
            + "moitié qu'on ne lira jamais");
      point("le bouton de repli dit ce qu'il fera à " + H + " px",
            menteurs.length === 0, "aucun",
            menteurs.length ? menteurs.join(" · ") : "aucun",
            "c'est le seul chemin pour revoir la scène qu'on juge quand le "
            + "panneau couvre l'écran ; un bouton qui ment sur sa fonction, là, "
            + "coûte la question");
      point("et la séance s'est bien jouée à " + H + " px", JUGE.rapport !== null,
            "un rapport", JUGE.rapport === null ? "aucun" : "rendu",
            "sans ça la boucle aurait mesuré une seule question");
    }
  } finally {
    JUGE.simuleEcran(0);
    spin = av.spin;
    if(av.stock !== null) localStorage.setItem(CLE, av.stock);
    if(lieu !== av.lieu) vaAu(av.lieu);
    avanceImages(2);
  }
  return enCours;
}

/* Le panneau s'ouvre REPLIÉ pour les questions qui envoient explorer. Replié il
   ne montre qu'un bandeau : le mesurer alors ne dit rien, et c'est l'erreur que
   ce contrôle a faite d'abord — il rendait un vert franc sur la mise en page
   qu'Hugo ne pouvait pas atteindre. */
function deplie(b){
  /* ON VISE L'ÉTAT, PAS LE LIBELLÉ. Première version : chercher le bouton dont
     le texte dit « Déplier ». Elle a laissé une question repliée — son champ
     libre mesurait zéro pixel — parce que ce libellé n'est réécrit qu'au
     changement de question, et non au dépli. Un contrôle qui lit une étiquette
     pour connaître un état lit une étiquette périmée. */
  if(!b.classList.contains("replie")) return;
  const r = b.querySelector(".rangee.replie-visible");
  const bt = r && r.lastElementChild;
  if(bt) bt.click();
}

/* 8 ter. LE VOYAGE D'UN SEUL TENANT — les deux coutures.

   Hugo, le 16 août 2026, en jugeant l'arrivée : « je veux que ce soit un voyage
   depuis sagitarius a travers la galaxie, apres un moment on voit le systeme
   solaire, on zoom dessus, PUIS on zoom sur le systeme terre lune. La ça va pas
   du tout. » C'étaient trois vols séparés par deux boutons, et un bouton est un
   arrêt. Les deux cartes du panneau sont tombées.

   CE QUI SE CASSERAIT SANS CE CONTRÔLE : n'importe qui remettant une condition
   dans `arriveVoyage` ou `majChute` rendrait au voyage l'un de ses arrêts, et
   RIEN ne le dirait — les trois scènes marchent séparément, chacune a ses
   contrôles, et aucun ne regarde le passage de l'une à l'autre. C'est
   exactement l'endroit où le dépôt s'est déjà fait avoir : la faute n'était pas
   dans les pièces mais dans leur rapport.

   ON APPELLE LE CHEMIN DE MISE À JOUR, PAS LA BOUCLE DE RENDU. `dt` y est
   plafonné à 50 ms et la boucle réelle tourne en parallèle : on piloterait
   depuis un état qu'on ne maîtrise pas, ce qui est la règle 5 prise à l'envers.
   Mesuré le 16 août — huit images de `avanceImages` ne faisaient pas bouger
   l'avancement d'un millième.

   RÈGLE 5, ET ELLE COÛTE CHER ICI : ce contrôle traverse tout le voyage, donc il
   salit le salon, le carnet, le télescope et trois scènes. Il rend TOUT dans son
   `finally`, y compris quand un point échoue — le carnet compris, qui vit dans
   la mémoire du navigateur et survivrait à la page.                            */
function voyageDunSeulTenant(){
  ouvre("Le voyage d'un seul tenant");
  const CLE_R = "periastre.registre";
  const av = { registre: localStorage.getItem(CLE_R), trajet: TELESCOPE.trajet,
               carte: TELESCOPE.carte, retour: TELESCOPE.retour };
  const degele = fige();
  try {
    localStorage.removeItem(CLE_R);
    REGISTRE.pose({ lit: () => JSON.parse(localStorage.getItem(CLE_R)),
                    ecrit: l => localStorage.setItem(CLE_R, JSON.stringify(l)) });

    const dest = DESTINATIONS.find(d => d.id === "soleil");
    point("la destination du système solaire existe", !!dest, "une destination",
          dest ? dest.id : "AUCUNE");
    if(!dest) return enCours;

    /* ON REPART D'ORBITE, ET ON NE LE SUPPOSE PAS — règle 5, apprise le 17 août.

       Ce contrôle lançait le vol depuis `distanceVaisseau()`, c'est-à-dire d'où
       qu'on soit. Le jour où la séance a ouvert sur la question de l'arrivée,
       elle laissait le vaisseau à huit mille deux cent soixante-dix-sept parsecs
       — le vol partait donc de sa destination. Résultat mesuré : un chemin de
       longueur nulle, une vitesse de zéro d'un bout à l'autre, et « la vitesse
       part de zéro et y revient » AU VERT. Trois points sur cinq passaient en
       décrivant un voyage qui n'avait pas lieu.

       Un contrôle qui ne maîtrise pas l'état d'où il mesure finit par mesurer
       autre chose et par le dire avec assurance. */
    TERRELUNE.ferme(); APPROCHE.range();
    if(TELESCOPE.trajet){ TELESCOPE.trajet = null; TELESCOPE.retour = false; }
    TELESCOPE.carte = 0; TELESCOPE.grille = 0;
    salon.retourne = 0;
    salon.p = [salon.apo, 0, 0];
    avanceImages(2);
    const depart = distanceVaisseau();
    point("on part bien d'une orbite, pas de l'arrivée",
          depart < dest.d_m * 1e-9, "moins d'un milliardième du chemin",
          (depart / dest.d_m).toExponential(2) + " du chemin",
          "partir d'où l'on est faisait un vol de longueur nulle, et trois "
          + "points passaient au vert en décrivant un voyage qui n'a pas lieu");

    lanceVoyage(dest, VOYAGE.entre(depart, dest.d_m));
    const panneauOuvert = () => document.getElementById("instrument").classList.contains("vu");

    point("le vol connaît son chemin total", RECUL.etat.total === dest.d_m,
          dest.d_m.toExponential(3), String(RECUL.etat.total),
          "sans lui le régulier n'étale que les décades du départ, et la fin du "
          + "voyage reçoit un cent-millième du temps d'écran");
    point("et il va PLUS LOIN que le nuage de Oort",
          RECUL.etat.d1 > dest.d_m * (1 - 1e-3), "presque tout le chemin",
          (100*RECUL.etat.d1/dest.d_m).toFixed(4) + " % du chemin",
          "le vol ne s'arrête plus au bord du nuage : il traverse et continue "
          + "jusqu'à ce que la Terre remplisse la baie");

    /* ═══ LE PROFIL DE VITESSE — c'est LA remarque d'Hugo, et le contrôle qui la
       porte. « à la moitié du voyage, elle repasse à zéro alors que non, elle
       doit aller à proche de la vitesse de un c, puis décélérer jusqu'à arriver
       au système solaire avec une vitesse de zéro. C'est le compteur il ne
       marche pas. »

       Trois vols enchaînés donnaient TROIS zéros. On échantillonne donc tout le
       voyage et l'on exige la forme d'un seul vol : zéro aux deux bouts, un
       maximum proche de c, et JAMAIS de retour à zéro entre les deux. */
    const betas = [];
    for(let i = 0; i <= 200; i++){
      const p = RECUL.ou(RECUL.etat.d0, RECUL.etat.d1, i/200, null, RECUL.etat.total);
      betas.push(p.vol ? p.vol.beta : NaN);
    }
    /* CE QU'ON MESURE EST L'UNIMODALITÉ, PAS L'ABSENCE DE LENTEUR. Près du
       Soleil le vaisseau EST lent, et c'est juste : il freine. Le défaut
       qu'Hugo a vu n'est pas qu'elle descende, c'est qu'elle REMONTE — la
       signature de deux vols mis bout à bout. On exige donc une seule bosse :
       elle monte, elle redescend, et elle ne repart jamais. */
    const remontees = (v) => {
      const i = v.indexOf(Math.max(...v));
      let n = 0;
      for(let k = i + 1; k < v.length; k++) if(v[k] > v[k-1] + 1e-9) n++;
      return n;
    };
    const max = Math.max(...betas);
    point("la vitesse part de zéro et y revient",
          betas[0] < 1e-6 && betas[betas.length-1] < 1e-3,
          "zéro aux deux bouts",
          betas[0].toExponential(1) + " … " + betas[betas.length-1].toExponential(1));
    point("elle monte tout près de c au milieu", max > 0.99, "> 0,99 c",
          max.toFixed(6));
    point("ET ELLE NE REMONTE JAMAIS APRÈS AVOIR FREINÉ", remontees(betas) === 0,
          "aucune remontée", remontees(betas) + " remontée(s)",
          "c'est la remarque d'Hugo du 16 août : trois vols enchaînés donnaient "
          + "trois bosses, et le compteur se lisait comme cassé");

    /* LE TÉMOIN : sans lui, « aucune remontée » serait vrai d'une courbe plate.
       On refait la mesure sur DEUX vols mis bout à bout — l'état d'hier — et
       l'on exige que la remontée s'y voie. */
    const enDeux = [];
    for(const [a, b] of [[RECUL.etat.d0, dest.d_m], [dest.d_m*0.9999, RECUL.etat.d1]])
      for(let i = 0; i <= 100; i++)
        enDeux.push(RECUL.ou(a, b, i/100, null, NaN).vol.beta);
    point("et deux vols bout à bout montreraient bien la remontée",
          remontees(enDeux) > 0, "> 0", remontees(enDeux) + " remontée(s)",
          "sans ce témoin, le point ci-dessus passerait au vert sur n'importe "
          + "quelle courbe plate");

    /* ═══ LES SCÈNES SUIVENT LE VOL, elles ne le mènent plus. */
    const carnetEnVol = [];
    const etapes = [];
    for(const t of [0.3, 0.62, 0.70, 0.90, 0.999]){
      RECUL.etat.t = t;
      majVoyage(0.0001);
      carnetEnVol.push(REGISTRE.tout().length);
      etapes.push(TERRELUNE.etat.actif ? "terre-lune"
                : APPROCHE.etat.actif ? "solaire" : "trajet");
    }
    point("on traverse bien les trois scènes, dans l'ordre",
          etapes.indexOf("solaire") > 0
          && etapes.lastIndexOf("terre-lune") === etapes.length - 1
          && etapes.indexOf("solaire") < etapes.indexOf("terre-lune"),
          "trajet, puis solaire, puis terre-lune", etapes.join(" → "));
    point("le carnet reste muet tant qu'on vole",
          carnetEnVol.slice(0, -1).every(n => n === 0), 0,
          carnetEnVol.join(", "),
          "trois lignes décriraient trois trajets, et il n'y en a plus qu'un");

    // ---- la fin, une seule fois -------------------------------------------
    RECUL.etat.t = 1;
    majVoyage(0.05);
    point("au bout, le panneau s'ouvre", panneauOuvert(), "ouvert",
          panneauOuvert() ? "ouvert" : "FERMÉ");
    point("et le carnet reçoit SA ligne, une seule",
          REGISTRE.tout().length === 1, 1, REGISTRE.tout().length,
          "un seul vol, une seule ligne — et son coût est celui du vol, pas une "
          + "somme recomposée");
    majVoyage(0.05);
    point("et le panneau ne se rouvre pas à chaque image",
          REGISTRE.tout().length === 1, 1, REGISTRE.tout().length,
          "`arrive` garde la porte : sans lui, chaque image rouvrirait le "
          + "panneau et rallongerait le carnet");
  } finally {
    degele();
    TERRELUNE.ferme();
    APPROCHE.range();
    RECUL.etat.actif = false;
    TELESCOPE.trajet = av.trajet;
    TELESCOPE.carte = av.carte;
    TELESCOPE.retour = av.retour;
    fermeTelescope();
    document.getElementById("chrono").classList.remove("vu");
    if(av.registre === null) localStorage.removeItem(CLE_R);
    else localStorage.setItem(CLE_R, av.registre);
    REGISTRE.pose({ lit: () => JSON.parse(localStorage.getItem(CLE_R)),
                    ecrit: l => localStorage.setItem(CLE_R, JSON.stringify(l)) });
    poseSalon();
    avanceImages(2);
  }
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

/* ---------------------------------------------------------------------------
   CHAQUE CONTRÔLE SOUS FILET.

   Les deux passes appelaient dix-sept contrôles à la file, sans `try`. Le
   premier qui levait emportait les seize suivants : on lisait « rien ne
   s'affiche » et l'on ne savait pas si c'était un contrôle cassé ou seize
   défauts. C'est exactement le mode de panne d'un chantier qui déplace des
   noms — celui qui commence le 8 août 2026.

   Un contrôle qui lève rend maintenant un point rouge nommé, et les autres
   continuent. L'erreur devient une information au lieu d'un silence. */
function joue(nom, f){
  try { f(); }
  catch(e){
    ouvre(nom);
    point("le contrôle s'est joué jusqu'au bout", false, "aucune erreur",
          (e && e.message) ? e.message : String(e),
          "il a LEVÉ. Les points qu'il aurait posés manquent — mais les autres "
          + "contrôles ont continué, et c'est tout l'intérêt de ce filet.");
  }
}

/* La liste vit à un seul endroit : deux listes divergent, et celle qu'on oublie
   de tenir à jour est celle qui compte. */
/* LES AVEUX SONT-ILS RÉELLEMENT À L'ÉCRAN ? — F4, et c'est le contrôle qui la
   ferme.

   `contrat.js` garantit qu'un compromis est bien DÉCLARÉ : un lieu connu, un
   texte court, les deux langues. `outil-verif-aveu.js` garantit que le module
   sait à quel endroit chacun doit aller. Ni l'un ni l'autre ne garantit qu'il
   ARRIVE sur l'écran — et c'est exactement ce qui manquait :

     « chaque compromis doit se déclarer LÀ OÙ ON LE RENCONTRE, pas seulement
       dans une liste rangée ailleurs. » — Hugo, 5 août 2026

   On ouvre donc chaque panneau pour de vrai et l'on regarde ce qui s'y trouve.
   La vérité vient d'ailleurs que du code qui peint : elle vient du DOCUMENT,
   après coup, et du texte attendu que `contenu.js` porte.

   LE CLIQUET. Deux lieux n'ont pas encore de panneau où poser leurs badges. On
   les compte plutôt que de les taire, et le compte ne remonte jamais — même
   mécanique que `PLAFOND` et `INCONNUS`. Un compromis déclaré demain sans être
   montré fera rougir cette ligne le jour même. */
/* UN, et c'est `recul`. Son panneau — le chronomètre — n'existe vraiment que
   pendant un voyage, et l'ouvrir depuis la passe non destructive demanderait de
   lancer un trajet, donc de casser l'état de qui joue. C'est `parcours`/`voyage`,
   la passe longue, qui le traverse.

   IL Y EN AVAIT DEUX, ET LE SECOND ÉTAIT UNE PARESSE. « L'arrivée » était rangée
   ici pour la même raison supposée, et c'était faux : `poseArrivee` construit son
   panneau et pose ses badges sans lancer quoi que ce soit. Trouvé le 11 août
   parce que la scène solaire a déclaré son compromis, que le compte est monté à
   trois, et que ce cliquet a rougi. Il a fait son travail ; la bonne réponse
   n'était pas de le monter mais d'aller chercher les deux panneaux.

   Un, et jamais deux : le jour où l'on déclare un compromis dans un endroit sans
   panneau, cette ligne rougit avant qu'il soit publié. */
const AVEUX_SANS_PLACE = 1;

function aveux(){
  ouvre("Les aveux sont-ils à l'écran ?");
  if(typeof AVEU === "undefined"){ point("le module des aveux est chargé", false, "AVEU", "absent"); return; }

  const tous = AVEU.tous(CONTENU);
  point("il y a des compromis à montrer", tous.length > 0, "> 0", tous.length);

  /* Chaque lieu et le panneau qui l'accueille. `partout` n'en a pas : il sort à
     tous les autres, et c'est là qu'on le trouvera. */
  const OUVRE = {
    "salon":         () => document.getElementById("dossier"),
    "reglages":      () => { document.getElementById("rouage").click(); return document.getElementById("panneau"); },
    "reglage-temps": () => { document.getElementById("b-temps").click(); return document.getElementById("temps"); },
    "spectre":       () => { document.getElementById("b-spectre").click(); return document.getElementById("spectre"); },
    /* `fermeTelescope()` d'abord, et ce n'est pas de la précaution : l'étude et
       le télescope PEIGNENT LE MÊME PANNEAU. Sans refermer, l'étude laisse ses
       badges dans `in-pied` et le télescope, déjà ouvert, ne le repeint pas —
       le contrôle accusait alors le site d'un défaut qui était le sien. */
    "telescope":     () => { fermeTelescope(); ouvreTelescope(); return document.getElementById("in-pied"); },
    "etude":         () => { fermeTelescope(); ouvreTelescope(); poseEtude(); return document.getElementById("in-pied"); },
    /* LES DEUX ARRIVÉES, DEPUIS LE 11 AOÛT — et elles n'avaient pas à manquer.
       Le commentaire du cliquet disait que leur panneau « n'existe que pendant un
       voyage », donc qu'il faudrait en lancer un. C'est faux : `poseArrivee`
       CONSTRUIT le panneau et pose ses badges sans rien déplacer, et
       `arriveeJuste` l'appelle déjà ainsi dans la passe non destructive.

       C'est le compromis de la scène solaire qui l'a montré : en le déclarant,
       le compte est passé de deux à trois et le cliquet a rougi. Il a fait
       exactement ce pour quoi il existe, et la bonne réponse n'était pas de le
       monter — c'était d'aller chercher le panneau qu'on croyait inaccessible. */
    "arrivee-etoiles": () => { fermeTelescope();
      poseArrivee(DESTINATIONS.find(d => d.carte === true)); return document.getElementById("in-pied"); },
    "arrivee-soleil":  () => { fermeTelescope();
      poseArrivee(DESTINATIONS.find(d => d.scene === "solaire")); return document.getElementById("in-pied"); },
  };

  /* Le texte cherché passe par le MODULE, jamais par `c.aveu` en direct : depuis
     le 9 août, l'aveu du fond de ciel dépend du rendu, et la page peint celui du
     mode courant. Chercher le texte générique ferait accuser le site d'un défaut
     qui serait celui du contrôle — on a déjà payé ça une fois avec le télescope
     et l'étude qui peignent le même panneau. */
  const mode = typeof modeRendu === "string" ? modeRendu : null;
  const texteAttendu = c => AVEU.descripteur(c, mode).aveu;

  let sansPlace = 0;
  for(const c of tous){
    if(c.ou === "partout") continue;                  // vérifié via les autres
    const ouvrir = OUVRE[c.ou];
    if(!ouvrir){ sansPlace++; continue; }
    let hote = null;
    try { hote = ouvrir(); } catch(e){ hote = null; }
    const badge = hote && [...hote.querySelectorAll(".aveu")]
      .find(n => n.textContent.indexOf(texteAttendu(c)) >= 0);
    point("« " + c.id + " » est affiché dans « " + c.ou + " »", !!badge,
          "un badge portant son texte", badge ? "présent" : "ABSENT",
          badge ? undefined
                : "déclaré dans contenu.js, et jamais montré : c'est le défaut que F4 ferme");
  }

  // Le « partout » doit accompagner un lieu ordinaire — on en éprouve un.
  const global_ = tous.filter(c => c.ou === "partout");
  if(global_.length){
    let hote = null;
    try { hote = OUVRE["reglages"](); } catch(e){}
    const badge = hote && [...hote.querySelectorAll(".aveu")]
      .find(n => n.textContent.indexOf(texteAttendu(global_[0])) >= 0);
    point("le compromis « partout » accompagne les réglages", !!badge,
          "présent", badge ? "présent" : "ABSENT");
  }

  point("aucun lieu de plus n'est resté sans panneau", sansPlace <= AVEUX_SANS_PLACE,
        "≤ " + AVEUX_SANS_PLACE, sansPlace,
        "le cliquet ne remonte jamais : un compromis déclaré sans endroit où le "
        + "poser doit se voir le jour où on l'écrit");

  // On referme ce qu'on a ouvert : un contrôle qui laisse la scène sale fausse
  // le suivant, et c'est arrivé assez souvent pour que ce soit une règle.
  fermeTelescope();
  if(document.getElementById("panneau").classList.contains("vu")) document.getElementById("rouage").click();
  if(document.getElementById("temps").classList.contains("vu"))   document.getElementById("b-temps").click();
  if(spectreActif) document.getElementById("b-spectre").click();
}

const PASSE = [
  ["Le bloc de script vit", vivant], ["Cohérence", coherence], ["Les lieux", lieux],
  ["Les aveux", aveux],
  ["Le temps", tempsJuste], ["La résolution", resolution], ["La saisie libre", saisieLibre],
  ["Les nuanceurs", nuanceurs], ["Les clés nues", clesNues], ["Le banc d'essai", banc],
  ["Les pixels", pixels], ["La couture", couture], ["La carte fixe", carteFixe],
  ["La carte dehors", carteDehors], ["L'arrivée juste", arriveeJuste],
  ["La scène solaire", sceneSolaire],
  ["La rotation calme", rotationCalme],
  ["Le même espace", memeEspace], ["La mise en page", mesurePage], ["Le budget", budget],
];
const PASSE_LONGUE = [["Le parcours", parcours], ["Le voyage", voyage]];

/* La passe non destructive : tout ce qui n'abîme pas l'état courant.
   C'est celle qu'on lance après une modification, en boucle. */
function sain(){
  resultats.length = 0;
  for(const [nom, f] of PASSE) joue(nom, f);
  return bilan();
}

/* La passe complète, qui joue le site du début à la fin. Elle détruit l'état :
   on la lance sur une page fraîche. */
function tout(){
  resultats.length = 0;
  for(const [nom, f] of PASSE.concat(PASSE_LONGUE)) joue(nom, f);
  return bilan();
}

global.VERIF = {
  vivant, coherence, lieux, aveux, tempsJuste, resolution, saisieLibre, nuanceurs, clesNues,
  banc, pixels, couture, carteFixe, carteDehors, arriveeJuste, sceneSolaire, seanceSansTrace,
  // Comme `seanceSansTrace` : hors de la passe, parce qu'il exige `?verif&juge`.
  // L'y mettre le ferait échouer sur toute page où la séance n'est pas chargée.
  questionsDuVoyage, voyageDunSeulTenant, seanceTableRase, seanceSurTelephone,
  anglesDeSeance, transitionDuVoyage,
  rotationCalme, memeEspace, mesurePage, parcours, voyage, budget,
  sain, tout, bilan, texte, resultats, FORMATS, OR,
  // outillage exposé : d'autres contrôles pourront s'y adosser
  pose, fige, avanceImages,
};

})(window);
