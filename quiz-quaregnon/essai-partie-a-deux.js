/* ============================================================================
   UNE PARTIE À DEUX, POUR DE VRAI.

       npm install playwright        (une fois)
       node essai-partie-a-deux.js

   C'est le seul outil du dossier qui a besoin de quelque chose d'installé, et
   c'est pour ça qu'il ne s'appelle pas `outil-verif-…` : `verifier.js` ne le
   joue pas, et le dépôt reste utilisable sans rien installer. Il ouvre deux
   vrais navigateurs, l'un meneur, l'autre invité, et leur fait jouer une partie
   entière l'un contre l'autre.

   ---------------------------------------------------------------------------

   Le serveur ci-dessous IMITE une base Firebase Realtime Database : le même
   dialecte HTTP (PUT / PATCH / DELETE / GET sur des adresses en .json) et le
   même flux d'événements en text/event-stream.

   Ce que cela prouve : que le salon, l'autorité du meneur, le barème, la
   synchronisation et le classement fonctionnent bout en bout, dans deux vrais
   navigateurs.

   Ce que cela NE prouve PAS : que Firebase se comporte comme cette imitation.
   Elle est écrite d'après la même lecture de la documentation que salon.js —
   c'est-à-dire par moi. Seule une vraie partie sur une vraie base tranchera. */

"use strict";
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");

const RACINE = __dirname;
const PORT_SITE = 8741, PORT_BASE = 8742;
const SORTIE = process.env.VUES || require("os").tmpdir() + "/quiz-vues";
fs.mkdirSync(SORTIE, { recursive: true });

/* ------------------------------------------------ l'imitation de la base */

let donnees = {};
const ecoutes = [];

const decoupe = (p) => p.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

function lire(bouts) {
  let n = donnees;
  for (const b of bouts) { if (n === null || typeof n !== "object") return null; n = n[b]; }
  return n === undefined ? null : n;
}

function ecrire(bouts, valeur) {
  if (!bouts.length) { donnees = valeur === null ? {} : valeur; return; }
  let n = donnees;
  for (let i = 0; i < bouts.length - 1; i++) {
    if (!n[bouts[i]] || typeof n[bouts[i]] !== "object") n[bouts[i]] = {};
    n = n[bouts[i]];
  }
  if (valeur === null) delete n[bouts[bouts.length - 1]];
  else n[bouts[bouts.length - 1]] = valeur;
}

/* {".sv":"timestamp"} devient l'heure du serveur, comme chez Firebase. */
function horloge(v) {
  if (v && typeof v === "object" && v[".sv"] === "timestamp") return Date.now();
  if (Array.isArray(v)) return v.map(horloge);
  if (v && typeof v === "object") {
    const o = {}; for (const k in v) o[k] = horloge(v[k]); return o;
  }
  return v;
}

function relatif(cheminEcrit, cheminEcoute) {
  const a = decoupe(cheminEcrit), b = decoupe(cheminEcoute);
  if (a.length < b.length) return null;
  for (let i = 0; i < b.length; i++) if (a[i] !== b[i]) return null;
  return "/" + a.slice(b.length).join("/");
}

function prevenir(type, cheminEcrit, donnee) {
  ecoutes.forEach((e) => {
    const rel = relatif(cheminEcrit, e.chemin);
    if (rel === null) return;
    e.res.write("event: " + type + "\n");
    e.res.write("data: " + JSON.stringify({ path: rel, data: donnee }) + "\n\n");
  });
}

const base = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  const chemin = decodeURIComponent(req.url.split("?")[0]).replace(/\.json$/, "");
  const bouts = decoupe(chemin);

  if (req.method === "GET" && (req.headers.accept || "").includes("text/event-stream")) {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache",
                         "Connection": "keep-alive" });
    res.write("event: put\ndata: "
      + JSON.stringify({ path: "/", data: lire(bouts) }) + "\n\n");
    const e = { res, chemin };
    ecoutes.push(e);
    req.on("close", () => { const i = ecoutes.indexOf(e); if (i >= 0) ecoutes.splice(i, 1); });
    return;
  }

  let corps = "";
  req.on("data", (c) => corps += c);
  req.on("end", () => {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(lire(bouts)));
    }
    if (req.method === "DELETE") {
      ecrire(bouts, null);
      prevenir("put", chemin, null);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end("null");
    }
    let v; try { v = JSON.parse(corps || "null"); } catch (_) { v = null; }
    v = horloge(v);

    if (req.method === "PUT") {
      ecrire(bouts, v);
      prevenir("put", chemin, v);
    } else if (req.method === "PATCH") {
      /* Les clés d'un PATCH sont des chemins relatifs — c'est ce qui permet
         « joueurA/score » de viser deux niveaux plus bas. */
      for (const cle in v) ecrire(bouts.concat(decoupe(cle)), v[cle]);
      prevenir("patch", chemin, v);
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(v));
  });
});

/* ------------------------------------------------------------ le site */

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
                ".js": "text/javascript; charset=utf-8" };

const site = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";

  /* On remplace config.js par une configuration qui pointe sur l'imitation. */
  if (p === "/config.js") {
    res.writeHead(200, { "Content-Type": TYPES[".js"] });
    return res.end('const CONFIG = { base: "http://localhost:' + PORT_BASE + '",'
      + ' secondesParQuestion: 25, questionsParPartie: 3, secondesAvantOubli: 45 };');
  }

  const f = path.join(RACINE, p);
  if (!f.startsWith(RACINE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); return res.end("non");
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});

/* ------------------------------------------------------------ la partie */

let echecs = 0;
function verifier(titre, condition, detail) {
  console.log((condition ? "  ✓ " : "  ✗ ") + titre + (condition || !detail ? "" : "\n      " + detail));
  if (!condition) echecs++;
}

(async () => {
  await new Promise((r) => site.listen(PORT_SITE, r));
  await new Promise((r) => base.listen(PORT_BASE, r));
  const nav = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
                                      args: ["--no-sandbox"] });

  const ctxA = await nav.newContext({ viewport: { width: 420, height: 900 } });
  const ctxB = await nav.newContext({ viewport: { width: 420, height: 900 } });
  const A = await ctxA.newPage(), B = await ctxB.newPage();
  const erreurs = [];
  A.on("pageerror", (e) => erreurs.push("meneur : " + e.message));
  B.on("pageerror", (e) => erreurs.push("invité : " + e.message));

  await A.goto("http://localhost:" + PORT_SITE + "/");
  await B.goto("http://localhost:" + PORT_SITE + "/");

  console.log("\nLe meneur ouvre un salon");
  await A.click("#b-multi");
  await A.fill("#champ-nom", "Hugo");
  await A.click("#b-creer");
  await A.waitForSelector("#salle.actif", { timeout: 8000 });
  const code = (await A.textContent("#affiche-code")).trim();
  verifier("un code de quatre lettres est attribué", /^[A-Z]{4}$/.test(code), "code : " + code);

  console.log("\nL'invité rejoint");
  await B.click("#b-multi");
  await B.fill("#champ-code", code);
  await B.fill("#champ-nom", "Zoé");
  await B.click("#b-rejoindre");
  await B.waitForSelector("#salle.actif", { timeout: 8000 });

  await A.waitForFunction(() =>
    document.querySelectorAll("#liste-attente li").length === 2, null, { timeout: 8000 });
  verifier("le meneur voit les deux joueurs",
    (await A.locator("#liste-attente li").count()) === 2);
  verifier("l'invité voit les deux joueurs aussi",
    (await B.locator("#liste-attente li").count()) === 2);
  verifier("l'invité n'a pas le bouton de lancement",
    !(await B.locator("#b-lancer:visible").count()));
  await A.screenshot({ path: SORTIE + "/6-salon-meneur.png" });

  console.log("\nLa partie est lancée");
  await A.click("#b-lancer");
  await A.waitForSelector("#jeu.actif", { timeout: 8000 });
  await B.waitForSelector("#jeu.actif", { timeout: 8000 });

  const qA = await A.textContent("#enonce");
  const qB = await B.textContent("#enonce");
  verifier("les deux voient la même question", qA === qB, qA + " ≠ " + qB);

  const repA = await A.locator("#reponses .reponse span:nth-child(2)").allTextContents();
  const repB = await B.locator("#reponses .reponse span:nth-child(2)").allTextContents();
  verifier("les réponses sont dans le même ordre chez les deux",
    JSON.stringify(repA) === JSON.stringify(repB),
    "sinon « la réponse B » ne veut pas dire la même chose des deux côtés");

  /* Le meneur répond juste et vite, l'invité répond faux. On lit la bonne
     réponse depuis la banque, pas depuis l'écran, pour ne pas se contenter de
     l'accord du site avec lui-même. */
  const { QUESTIONS } = require(RACINE + "/questions.js");
  const ordre = await A.evaluate(() => JSON.parse(JSON.stringify(
    Array.from(document.querySelectorAll("#reponses .reponse"))
      .map(b => b.lastChild.textContent))));
  const question = QUESTIONS.find(q => q.q === qA);
  const bonPlace = ordre.indexOf(question.r[question.bonne]);
  verifier("la bonne réponse est bien à l'écran", bonPlace >= 0);

  await A.locator("#reponses .reponse").nth(bonPlace).click();
  await B.locator("#reponses .reponse").nth((bonPlace + 1) % 4).click();

  await A.waitForFunction(() =>
    document.querySelector("#b-suite") &&
    document.querySelector("#b-suite").style.display === "block", null, { timeout: 8000 });

  const scores = await A.evaluate(() =>
    Array.from(document.querySelectorAll("#liste-jeu li")).map(li => li.textContent));
  verifier("le meneur, juste et rapide, marque des points",
    /Hugo.*[1-9]/.test(scores.join(" | ")), scores.join(" | "));
  verifier("l'invité, dans l'erreur, reste à zéro",
    /Zoé.*0 pts/.test(scores.join(" | ")), scores.join(" | "));

  const scoresB = await B.evaluate(() =>
    Array.from(document.querySelectorAll("#liste-jeu li")).map(li => li.textContent));
  verifier("les deux voient le même tableau",
    JSON.stringify(scores) === JSON.stringify(scoresB),
    scores.join(" | ") + "   ≠   " + scoresB.join(" | "));
  verifier("l'invité ne peut pas faire avancer la partie",
    await B.locator("#b-suite").isDisabled());
  await A.screenshot({ path: SORTIE + "/7-revelation-meneur.png" });

  console.log("\nOn enchaîne jusqu'au classement");
  for (let tour = 0; tour < 6; tour++) {
    if (await A.locator("#fin.actif").count()) break;
    await A.locator("#b-suite:visible").click();
    await A.waitForTimeout(350);
    if (await A.locator("#fin.actif").count()) break;
    const libres = A.locator("#reponses .reponse:not([disabled])");
    if (await libres.count()) {
      await libres.first().click();
      await B.locator("#reponses .reponse:not([disabled])").last().click();
      await A.waitForTimeout(350);
    }
  }

  await A.waitForSelector("#fin.actif", { timeout: 10000 });
  await B.waitForSelector("#fin.actif", { timeout: 10000 });
  verifier("les deux arrivent au classement", true);

  const podA = await A.locator("#podium li .nom").allTextContents();
  const podB = await B.locator("#podium li .nom").allTextContents();
  verifier("le podium a deux places", podA.length === 2, podA.join(", "));
  verifier("le podium est dans le même ordre des deux côtés",
    podA.map(t => t.replace(" (toi)", "")).join("|")
      === podB.map(t => t.replace(" (toi)", "")).join("|"),
    podA.join(", ") + "   ≠   " + podB.join(", "));
  await A.screenshot({ path: SORTIE + "/8-classement.png" });

  /* Vu à l'œil sur une capture : le gros score affichait « 2 970 » et le
     podium, juste en dessous, « 2970 ». Deux écritures pour un même nombre,
     à trois centimètres l'une de l'autre. */
  const ecrits = [await A.textContent("#score-final")]
    .concat(await A.locator("#podium li .pts").allTextContents())
    .map(t => t.trim());
  verifier("un même nombre s'écrit pareil partout",
    ecrits.every(t => t.replace(/\u202F/g, "").length < 4 || t.indexOf("\u202F") !== -1),
    ecrits.join("  |  "));

  console.log("\nL'invité s'en va");
  await B.click("#b-accueil-fin");
  await A.waitForTimeout(1200);
  const restant = await A.evaluate(() =>
    fetch(SALON.adresse("salons/" + document.getElementById("affiche-code").textContent))
      .then(r => r.json()).then(s => Object.keys((s && s.joueurs) || {}).length));
  verifier("le joueur parti disparaît du salon", restant === 1, "il en reste " + restant);

  verifier("aucune erreur JavaScript pendant la partie", erreurs.length === 0,
    erreurs.join(" ; "));

  await nav.close(); site.close(); base.close();
  console.log("\n" + (echecs ? echecs + " échec(s)." : "Une partie complète à deux, sans accroc."));
  process.exit(echecs ? 1 : 0);
})();
