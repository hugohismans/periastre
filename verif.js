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
   qui m'a fait conclure trois fois à du bruit qui n'existait pas. */
function fige(){
  const av = { facteur: salon.facteur, horloge: salon.horloge, p: salon.p.slice(),
               v: salon.v.slice(), images, cumul };
  salon.facteur = 0;
  return () => {
    salon.facteur = av.facteur; salon.horloge = av.horloge;
    salon.p = av.p; salon.v = av.v; images = av.images; cumul = av.cumul;
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
      const av = tempsGeo;
      images = 0; cumul = 0; t += 16.7; boucle(t);       // celle qu'on mesure
      return tempsGeo - av;
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
    const d = pas(VITESSES[iVitesse].mult, "libre");
    const attendu = VITESSES[iVitesse].mult*DT/SPU;
    point("en vue libre, cran " + iVitesse, proche(d/attendu, 1, 0.02),
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
  vivant(); coherence(); tempsJuste(); resolution(); nuanceurs(); clesNues();
  banc(); pixels(); mesurePage(); budget();
  return bilan();
}

/* La passe complète, qui joue le site du début à la fin. Elle détruit l'état :
   on la lance sur une page fraîche. */
function tout(){
  resultats.length = 0;
  vivant(); coherence(); tempsJuste(); resolution(); nuanceurs(); clesNues();
  banc(); pixels(); mesurePage(); budget();
  parcours(); voyage();
  return bilan();
}

global.VERIF = {
  vivant, coherence, tempsJuste, resolution, nuanceurs, clesNues, banc, pixels,
  mesurePage, parcours, voyage, budget,
  sain, tout, bilan, texte, resultats, FORMATS, OR,
  // outillage exposé : d'autres contrôles pourront s'y adosser
  pose, fige, avanceImages,
};

})(window);
