/* ============================================================================
   Le panthéon : les noms de ceux qui ont franchi l'horizon.

   Deux principes de conception, et le second est le plus important.

   D'ABORD LE LOCAL. Le module fonctionne entièrement sans réseau : les sauts
   sont écrits dans le navigateur, et la paroi gravée s'affiche. Le nuage n'est
   qu'une source supplémentaire qu'on fusionne quand elle répond. Rien ne
   dépend de Firebase, ce qui veut dire qu'une panne, un blocage de traqueurs
   ou un vol en avion ne cassent pas le jeu — ils le rendent solitaire.

   UN NOM N'EST PAS DU TEXTE. Ce sont trois nombres : deux index dans un
   vocabulaire embarqué, et un matricule. Le nom lisible s'écrit à l'affichage.
   La configuration web étant publique par nature, n'importe qui peut écrire
   directement dans la base sans passer par cette page ; toute vérification
   faite ici serait donc décorative. En ne stockant que des entiers, la règle
   de sécurité se réduit à des bornes — incontournables — et aucune chaîne
   écrite par un visiteur n'atteint jamais la base. Il n'y a rien à modérer.
   ============================================================================ */

(function(global){
"use strict";

// ------------------------------------------------------------- vocabulaire
// Inventé, prononçable, un peu ailleurs. L'équipage n'est pas humaine.
const PRENOMS = [
  "Zeb","Nol","Dax","Prim","Vala","Orso","Kip","Mora",
  "Ilk","Sten","Ruve","Anka","Bren","Ottik","Sela","Turm",
  "Jaz","Nomi","Elk","Poz","Varn","Lume","Skad","Ori",
  "Bek","Tala","Zim","Fen","Naps","Oldo","Rikke","Ubo",
];
const NOMS = [
  "Kerlingen","Vandersept","Obrek","Fournoy","Vasteland","Tchernin","Bosquet","Halvard",
  "Orbeck","Piquemal","Van Oort","Delmare","Skarsen","Baptiste","Nordheim","Lacrampe",
  "Vossberg","Aldrinsen","Merleau","Kastrup","Bonnefoy","Tavernier","Ossola","Hjelm",
  "Delaunay","Varenne","Skogen","Petithan","Marchetti","Lindqvist","Rouvray","Ebersolt",
];

// Les bornes doivent coller à celles des règles Firestore. Si l'une bouge,
// l'autre doit bouger : une écriture hors bornes serait refusée en silence.
const NA = PRENOMS.length, NB = NOMS.length, NN = 10000;

function nom(e){
  return PRENOMS[e.a] + " " + NOMS[e.b] + " " + String(e.n).padStart(4, "0");
}

function tirage(){
  return { a: Math.floor(Math.random()*NA),
           b: Math.floor(Math.random()*NB),
           n: Math.floor(Math.random()*NN) };
}

// ----------------------------------------------------------------- local
const CLE = "periastre.pantheon";

function litLocal(){
  try { return JSON.parse(localStorage.getItem(CLE) || "[]"); }
  catch(_){ return []; }
}

function ecritLocal(liste){
  try { localStorage.setItem(CLE, JSON.stringify(liste.slice(-200))); }
  catch(_){ /* mode privé, quota plein : on continue sans mémoire */ }
}

// ----------------------------------------------------------------- nuage
// La configuration web est publique par conception — c'est un identifiant de
// projet, pas un secret. La sécurité tient entièrement aux règles Firestore.
// Aucune clé de compte de service n'a sa place ici, ni dans ce dépôt.
const CONFIG = {
  apiKey: "AIzaSyB4J1pp3WY6tfOnL3hoqJRnR9KktCbLkqQ",
  authDomain: "periastre.firebaseapp.com",
  projectId: "periastre",
  storageBucket: "periastre.firebasestorage.app",
  messagingSenderId: "715123544655",
  appId: "1:715123544655:web:44a9c8b5d9f7bf77b6903a",
};
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

let nuage = null;     // { db, ajoute, lit } une fois connecté
let tentative = null; // la promesse en cours, pour ne pas se connecter deux fois

/* On ne charge le SDK qu'au premier besoin réel. Tant que personne n'ouvre le
   panthéon, la page ne contacte aucun serveur tiers — ce qui est autant une
   question de vitesse que de sobriété. */
function connecte(){
  if(tentative) return tentative;
  tentative = (async () => {
    const [{ initializeApp }, auth, bd] = await Promise.all([
      import(SDK + "firebase-app.js"),
      import(SDK + "firebase-auth.js"),
      import(SDK + "firebase-firestore.js"),
    ]);
    const app = initializeApp(CONFIG);
    // Anonyme : un identifiant de session, aucun compte, aucun mot de passe.
    // C'est ce que les règles exigent pour autoriser une écriture.
    await auth.signInAnonymously(auth.getAuth(app));
    const db = bd.getFirestore(app);
    nuage = {
      async ajoute(e){
        await bd.addDoc(bd.collection(db, "pantheon"), {
          a:e.a, b:e.b, n:e.n, tau:e.tau, r0:e.r0,
          quand: bd.serverTimestamp(),   // l'heure du serveur : on n'antidate pas
        });
      },
      async lit(max){
        const q = bd.query(bd.collection(db, "pantheon"),
                           bd.orderBy("quand", "desc"), bd.limit(max));
        const s = await bd.getDocs(q);
        return s.docs.map(d => {
          const v = d.data();
          return { a:v.a, b:v.b, n:v.n, tau:v.tau, r0:v.r0,
                   quand: v.quand ? v.quand.toMillis() : Date.now(), loin:true };
        });
      },
    };
    return nuage;
  })().catch(e => {
    // Réseau coupé, traqueurs bloqués, projet en pause : on reste local, et on
    // le dit une fois. Ce n'est pas une erreur du jeu.
    console.info("Panthéon : partage indisponible, mémoire locale seule.", e && e.code);
    nuage = null;
    return null;
  });
  return tentative;
}

// ------------------------------------------------------------------- API

/** Inscrit un saut. Toujours écrit localement ; poussé au loin si possible. */
async function inscris(e){
  const saut = { a:e.a, b:e.b, n:e.n, tau:e.tau, r0:e.r0, quand: Date.now() };
  const liste = litLocal();
  liste.push(saut);
  ecritLocal(liste);
  const c = await connecte();
  if(c){ try { await c.ajoute(saut); } catch(_){ /* le local fait foi */ } }
  return saut;
}

/** Les derniers noms gravés, les siens fusionnés à ceux des autres. */
async function derniers(max){
  const m = max || 40;
  const mien = litLocal().map(s => Object.assign({ mien:true }, s));
  const c = await connecte();
  let tous = mien;
  if(c){
    try {
      const loin = await c.lit(m);
      // On écarte les doublons : nos propres sauts reviennent par le nuage.
      const vus = new Set(mien.map(s => s.a+"/"+s.b+"/"+s.n));
      tous = mien.concat(loin.filter(s => !vus.has(s.a+"/"+s.b+"/"+s.n)));
    } catch(_){ /* on garde le local */ }
  }
  return tous.sort((x,y) => y.quand - x.quand).slice(0, m);
}

global.PANTHEON = { nom, tirage, inscris, derniers, PRENOMS, NOMS,
                    get partage(){ return nuage !== null; } };

})(window);
