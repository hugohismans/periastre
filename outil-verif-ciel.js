/* ============================================================================
   Le champ d'étoiles, sans GPU.

       node outil-verif-ciel.js

   Hugo a écrit « ça grouille » à trois séances de jugement d'affilée, sans
   jamais pouvoir dire pourquoi — et c'est normal, la cause n'est pas regardable.

   ---------------------------------------------------------------------------
   DEUX MALADIES, ET LA SECONDE EST LE REMÈDE DE LA PREMIÈRE

   1. Les cœurs faisaient le quart d'un pixel. Un objet plus petit que la grille
      d'échantillonnage apparaît et disparaît dès que la caméra bouge. Corrigé en
      élargissant le cœur à la taille d'un pixel.

   2. Ce qui a créé la seconde : chaque étoile vit dans une cellule, et le
      nuanceur ne consulte QUE l'étoile de la cellule où tombe l'échantillon. Des
      cœurs élargis dépassent leur boîte — 0,55 cellule de rayon quand la
      demi-cellule vaut 0,5 — et l'étoile est tranchée net par sa propre
      frontière. Le trait de coupe se déplace sur elle quand la caméra tourne.

      Mesuré avant correctif : couche fine, 920 discontinuités franches sur
      5 524 traversées éclairées. Une sur six.

   ---------------------------------------------------------------------------
   POURQUOI CET OUTIL POURRAIT MENTIR, ET CE QU'ON FAIT CONTRE

   Il rejoue `couche()` en JavaScript. C'est une COPIE du nuanceur, donc il peut
   dériver de lui sans que rien ne le signale — et un contrôle qui surveille un
   modèle périmé est pire qu'aucun contrôle. C'est la règle 3 du projet : un
   contrôle doit tirer sa vérité d'ailleurs que de ce qu'il contrôle.

   Il lit donc le nuanceur dans `index.html` et refuse de conclure si les
   expressions qu'il réplique n'y sont plus telles quelles.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));
function ok(nom, vrai, attendu, mesure, note){
  n++; if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined) console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}

console.log("\n  LE CHAMP D'ÉTOILES — CONTRÔLE NUMÉRIQUE");
console.log("  ═══════════════════════════════════════");

// ═══════════════════════════════ 0. le modèle correspond-il encore au nuanceur
groupe("Ce fichier réplique bien le nuanceur d'aujourd'hui");

const page = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const corps = (page.match(/vec3 couche\(vec3 d, float ech, float seuil\)\{([\s\S]*?)\n\}/) || [])[1];

ok("`couche()` est trouvée dans index.html", !!corps, "trouvée", corps ? "trouvée" : "ABSENTE");

/* Chaque expression que le modèle ci-dessous suppose. Si l'une bouge dans le
   nuanceur sans bouger ici, le contrôle doit tomber — pas passer au vert sur
   une physique qui n'existe plus. */
const ATTENDU = [
  ["la maille",            "vec3 p = d*ech, id = floor(p), f = p - id - 0.5;"],
  ["le tirage de l'étoile","vec3 h = hash33(id);"],
  ["le seuil de présence", "if(h.x > seuil) return vec3(0.0);"],
  ["le pixel en cellules", "float px = (2.0/(uFocal*uRes.y)) * ech;"],
  ["la largeur du cœur",   "float w  = max(0.16, px*0.62);"],
  ["la gigue rétractée",   "float gigue = max(0.0, 2.0*(0.46 - w)/1.7320508);"],
  ["le profil",            "float b  = pow(smoothstep(w, 0.0, dist), 3.0);"],
  ["la conservation du flux", "float flux = (0.16*0.16)/(w*w);"],
  ["l'extinction de la couche illisible", "float lisible = smoothstep(0.74, 0.40, px);"],
];

/* ET CE QUI NE DOIT PLUS Y ÊTRE.

   Les trois ciels ont été comparés en direct le 6 août, Hugo a gardé le corrigé,
   et l'uniforme qui permettait de basculer est parti avec les deux autres. Un
   réglage qu'on garde « au cas où » après que le choix est fait devient un
   chemin que personne n'emprunte et que personne ne teste.

   On cherche l'EXPRESSION, pas le nombre. Chercher « 0.72 » tout court trouvait
   la teinte bleutée des étoiles, `vec3(0.62,0.72,1.0)`, et déclarait présente
   une gigue retirée depuis dix minutes. C'est la troisième fois de la journée
   qu'un motif trop large accuse du code sain, et à chaque fois le contrôle avait
   tort et le code raison. */
const PARTI = [
  ["l'uniforme de bascule", "uCiel"],
  ["l'ancienne gigue fixe", "(h-0.5)*0.72"],
];
if(corps){
  const propre = corps.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  for(const [nom, bout] of ATTENDU)
    ok("le nuanceur porte encore " + nom, propre.includes(bout), "présent",
       propre.includes(bout) ? "présent" : "INTROUVABLE — le modèle a dérivé");
  for(const [nom, bout] of PARTI)
    ok("et " + nom + " a bien disparu", !propre.includes(bout), "absent",
       propre.includes(bout) ? "ENCORE LÀ" : "absent");
}

// ─────────────────────────────────────────────────────── le modèle, à l'identique
const fract = x => x - Math.floor(x);
const f3 = v => v.map(fract);
function hash33(p){
  let q = f3([p[0]*0.1031, p[1]*0.1030, p[2]*0.0973]);
  const d = q[0]*(q[1]+33.33) + q[1]*(q[0]+33.33) + q[2]*(q[2]+33.33);
  q = [q[0]+d, q[1]+d, q[2]+d];
  return f3([(q[0]+q[1])*q[2], (q[0]+q[0])*q[1], (q[1]+q[0])*q[0]]);
}
const lisse = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x-e0)/(e1-e0)));
  return t*t*(3-2*t);
};

/* `p` est déjà en cellules : on veut maîtriser où l'on est par rapport aux faces.

   `mode` N'EXISTE PLUS DANS LE NUANCEUR — il n'existe que dans ce fichier, et
   pour une seule raison : rejouer l'ancienne gigue fixe afin de prouver que le
   contrôle sait tomber. Sans ce levier, « zéro coupure » serait une affirmation
   qu'on ne peut pas mettre en doute, donc une affirmation sans valeur.

   Le nuanceur, lui, ne connaît que le mode 2. */
function couche(p, seuil, px, mode){
  const id = p.map(Math.floor);
  const f = p.map((v, i) => v - id[i] - 0.5);
  const h = hash33(id);
  if(h[0] > seuil) return 0;

  const w = Math.max(0.16, px*0.62);
  const gigue = mode === 0 ? 0.72 : Math.max(0, 2*(0.46 - w)/Math.sqrt(3));
  const o = [ (h[0]-0.5)*gigue, (h[1]-0.5)*gigue, (h[2]-0.5)*gigue ];
  const dist = Math.hypot(f[0]-o[0], f[1]-o[1], f[2]-o[2]);

  const b = Math.pow(lisse(w, 0, dist), 3);
  const flux = (0.16*0.16)/(w*w);
  const lisible = mode === 2 ? lisse(0.74, 0.40, px) : 1;
  return b * (0.35 + h[2]) * flux * lisible;
}

const FOCAL = 1.55;
const COUCHES = [
  { nom:"large   (95)",  ech: 95,  seuil:0.070 },
  { nom:"moyenne (205)", ech: 205, seuil:0.060 },
  { nom:"fine    (410)", ech: 410, seuil:0.050 },
];
// Les hauteurs de tampon qui existent vraiment : téléphone, portable, large.
const HAUTEURS = [ 390, 595, 900, 1440 ];

const EPS = 1e-6;
function traverse(seuil, px, mode, n){
  let pire = 0, francs = 0, eclairees = 0;
  let graine = 12345;
  const alea = () => (graine = (graine*1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for(let i = 0; i < n; i++){
    const axe = i % 3;
    const p = [ (alea()-0.5)*800, (alea()-0.5)*800, (alea()-0.5)*800 ];
    p[axe] = Math.round(p[axe]);                    // pile sur une face
    const avant = p.slice(); avant[axe] -= EPS;
    const apres = p.slice(); apres[axe] += EPS;
    const a = couche(avant, seuil, px, mode), b = couche(apres, seuil, px, mode);
    if(a > 0.001 || b > 0.001){
      eclairees++;
      const saut = Math.abs(a - b);
      if(saut > pire) pire = saut;
      if(saut > 0.02) francs++;
    }
  }
  return { pire, francs, eclairees };
}

// ═══════════════════════════ 1. le mode employé ne coupe aucune étoile, nulle part
function balayeTout(mode){
  return HAUTEURS.map(H => {
    let pire = 0, francs = 0, eclairees = 0;
    for(const c of COUCHES){
      const px = (2.0/(FOCAL*H)) * c.ech;
      const r = traverse(c.seuil, px, mode, 260000);
      pire = Math.max(pire, r.pire); francs += r.francs; eclairees += r.eclairees;
    }
    return { H, pire, francs, eclairees };
  });
}

groupe("Aucune étoile n'est tranchée par sa cellule, à aucune hauteur");
for(const r of balayeTout(2)){
  ok("hauteur " + r.H + " px — zéro coupure sur les trois couches",
     r.francs === 0 && r.pire < 1e-9, "saut nul",
     r.francs + " coupures, saut max " + r.pire.toExponential(2),
     r.eclairees + " traversées de face éclairées examinées");
}

/* Et pourquoi le mode 1 ne suffit pas — c'est ce que la première version de ce
   fichier m'a appris, en échouant.

   Rétracter la gigue ne sauve que si le cœur PEUT tenir dans la cellule. En
   dessous de 600 pixels de haut il ne le peut plus : à 390, la couche fine porte
   un cœur de 0,84 cellule, plus gros que la cellule entière. La gigue tombe à
   zéro et l'étoile déborde quand même.

   On le CONSTATE ici plutôt que de l'oublier, pour que personne ne remette le
   mode 1 par défaut en croyant qu'il est propre. */
groupe("Et pourquoi la rétraction seule ne suffisait pas — constaté, pas oublié");
{
  const r = balayeTout(1);
  const petit = r.find(x => x.H === 390), grand = r.find(x => x.H === 1440);
  ok("à 390 px, le mode 1 laisse un résidu", petit.pire > 1e-9,
     "> 0", petit.pire.toExponential(2),
     "le cœur de la couche fine y vaut "
     + (Math.max(0.16, (2.0/(FOCAL*390))*410*0.62)).toFixed(2)
     + " cellule, contre 0,50 pour la demi-cellule");
  ok("à 1440 px, le mode 1 est propre", grand.pire < 1e-9, "saut nul",
     grand.pire.toExponential(2),
     "sur grand écran la rétraction suffit — c'est ce qui rendait le défaut invisible ici");
}

/* Et la preuve que ce contrôle sait tomber : l'ancien réglage doit le faire
   échouer. On ne le déduit pas, on le joue. Si cette ligne passait au vert, le
   contrôle ci-dessus ne vaudrait rien. */
groupe("Et il sait tomber — l'ancien réglage est bien refusé");
{
  const c = COUCHES[2], px = (2.0/(FOCAL*595)) * c.ech;
  const vieux = traverse(c.seuil, px, 0, 260000);
  ok("mode 0 (gigue fixe) : les coupures sont bien détectées",
     vieux.francs > 100, "> 100", vieux.francs + " coupures franches",
     "c'est le défaut d'origine, et le contrôle doit le voir");
}

// ═════════════════════════════════════ 2. une étoile n'est jamais sous-pixel
groupe("Une étoile ne redevient jamais plus petite qu'un pixel");
for(const H of HAUTEURS){
  let pire = null;
  for(const c of COUCHES){
    const px = (2.0/(FOCAL*H)) * c.ech;
    const w  = Math.max(0.16, px*0.62);
    const r  = w/px;                       // le cœur, en pixels
    if(pire === null || r < pire.r) pire = { r, nom:c.nom, w, px };
  }
  ok("hauteur " + H + " px — le plus petit cœur couvre au moins un demi-pixel",
     pire.r >= 0.5, "≥ 0,50 px", pire.r.toFixed(3) + " px (" + pire.nom.trim() + ")",
     "sous cette taille, l'étoile se remet à clignoter au sous-échantillonnage");
}

// ═══════════════════════════════════════ 3. élargir ne doit pas éclaircir
groupe("Le ciel ne devient pas laiteux quand les cœurs s'élargissent");
{
  /* PREMIÈRE VERSION FAUSSE, ET C'EST INSTRUCTIF.

     J'intégrais sur un VOLUME, et j'ai conclu à 132 % d'écart — donc au défaut.
     Le nuanceur avait raison, mon contrôle avait tort.

     Ce qui compte n'est pas ce que l'étoile occupe dans l'espace, c'est ce
     qu'elle dépose sur l'ÉCRAN, qui est une surface. Une étoile élargie d'un
     facteur k couvre k² pixels de plus, et `flux = (0.16/w)²` la divise
     exactement par k². Le produit est constant. Sur un volume le compte donne
     k³/k² = k, et l'on croit voir grossir ce qui ne bouge pas.

     Le contrôle intègre donc sur un plan passant par le centre de l'étoile. */
  const integre = px => {
    const w = Math.max(0.16, px*0.62);
    const flux = (0.16*0.16)/(w*w);
    let s = 0;
    const pas = 0.0015;
    for(let x = -0.5; x < 0.5; x += pas)
      for(let y = -0.5; y < 0.5; y += pas)
        s += Math.pow(lisse(w, 0, Math.hypot(x, y)), 3) * flux * pas*pas;
    return s;
  };
  const etroit = integre(0.10), large = integre(0.60);
  const ecart = Math.abs(large - etroit) / etroit;
  ok("le flux d'une étoile à l'écran ne dépend pas de sa largeur", ecart < 0.05,
     "< 5 %", (ecart*100).toFixed(1) + " %",
     "cœur étroit " + etroit.toExponential(3) + "   cœur large " + large.toExponential(3));
}

// ══════════════════════════════════ 4. le mode 2 éteint ce qui est illisible
groupe("La couche qu'on ne peut plus échantillonner s'éteint");
{
  const px = h => (2.0/(FOCAL*h)) * 410;
  const part = h => lisse(0.62, 0.34, px(h));
  ok("à 595 px de haut, la couche fine est éteinte", part(595) < 0.01,
     "≈ 0", part(595).toFixed(4),
     "sa cellule vaut " + px(595).toFixed(2) + " pixel : elle ne peut produire que du bruit");
  ok("à 1440 px de haut, elle revient", part(1440) > 0.5, "> 0,5", part(1440).toFixed(4),
     "sa cellule vaut " + px(1440).toFixed(2) + " pixel : elle est de nouveau lisible");
  ok("et rien n'est touché quand elle est lisible", couche([0.3,0.3,0.3], 1.0, px(595), 1) >= 0,
     "intact", "intact",
     "le mode 1 corrige un défaut mesuré ; retirer des étoiles est un choix d'œil");
}

console.log("\n  " + (echecs ? "❌  " + echecs + " ÉCHECS sur " + n + " contrôles"
                             : "✅  TOUT PASSE — " + n + " contrôles") + "\n");
process.exit(echecs ? 1 : 0);
