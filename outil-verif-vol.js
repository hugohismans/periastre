/* ============================================================================
   Le vol, éprouvé sans navigateur.

       node outil-verif-vol.js

   `vol.js` sort du bloc principal le cycle de vie d'un corps lancé. Comme il ne
   touche plus ni au document ni à WebGL — il rend des événements au lieu de les
   crier — il s'exécute en ligne de commande, et on peut lui demander des comptes
   que l'œil ne saurait pas rendre.

   ---------------------------------------------------------------------------
   CE QU'ON PEUT PROUVER, ET CE QU'ON NE PEUT QUE CONSTATER

   La différence importe. Trois choses se prouvent en forme fermée, et ce sont
   celles qui valent :

     · le moment cinétique se conserve — force centrale, c'est une identité ;
     · la vitesse circulaire est bien √(M/(r−3M)) — elle se retrouve en écrivant
       v²/r = M/r² + 3ML²/r⁴ avec L = rv, ce qui n'est PAS un ajustement mais
       une conséquence ;
     · la précession du périastre vaut 6πM/L² par tour — c'est le résultat de la
       relativité générale, et c'est la raison d'être du terme correctif.

   Cette troisième est la plus intéressante. Le terme 3L²/r² n'a pas été mis là
   pour faire joli : l'équation d'orbite qu'il produit est exactement
   d²u/dφ² + u = M/L² + 3Mu², celle de Schwarzschild. Si la précession mesurée
   colle à 6πM/L², alors le moteur fait vraiment de la relativité et pas du
   Newton décoré. Et c'est cette avance du périastre qu'on a vue mesurée sur S2
   par GRAVITY en 2020.

   Le reste — les trois familles, les seuils, le gel à l'horizon — se constate,
   avec des tolérances honnêtes, et c'est dit à chaque fois.
   ============================================================================ */

"use strict";
const fs = require("fs"), path = require("path");

const faux = {};
const charge = f => new Function("window", fs.readFileSync(path.join(__dirname, f), "utf8"))(faux);
charge("physique.js");
charge("vol.js");
const P = faux.PHYSIQUE, V = faux.VOL;
const { M, R_HORIZON, R_ISCO, R_PHOTON, len, cross, integre, vCirc } = P;

let n = 0, echecs = 0;
const groupe = t => console.log("\n  " + t + "\n  " + "─".repeat(t.length));

function ok(nom, vrai, attendu, mesure, note){
  n++;
  if(!vrai) echecs++;
  console.log("  " + (vrai ? "✅" : "❌") + "  " + nom);
  if(attendu !== undefined)
    console.log("        attendu " + attendu + "   mesuré " + mesure);
  if(note) console.log("        " + note);
}
const pres = (a, b, tol) => Math.abs(a - b) <= tol;

console.log("\n  CE QUI VOLE — CONTRÔLE NUMÉRIQUE");
console.log("  ════════════════════════════════");

// ═══════════════════════════════════════════════ 1. les invariants de la force
groupe("Les invariants");

{
  // Force centrale : L = r × v est conservé exactement. Toute dérive au-delà de
  // l'arrondi machine signale une faute de signe ou un terme non radial.
  let p = [8, 0, 0], v = [0, 0.06, 0.28];
  const L0 = len(cross(p, v));
  let pireL = 0, pireE = 0;
  const energie = (p, v) => {
    const r = len(p), L2 = len(cross(p, v))**2;
    // V(r) = −M/r − M·L²/r³, le potentiel dont dérive l'accélération du moteur
    return 0.5*(v[0]**2 + v[1]**2 + v[2]**2) - M/r - M*L2/(r*r*r);
  };
  const E0 = energie(p, v);
  for(let i = 0; i < 200000; i++){
    [p, v] = integre(p, v, 0.01);
    if((i & 1023) === 0){
      pireL = Math.max(pireL, Math.abs(len(cross(p, v)) - L0)/L0);
      pireE = Math.max(pireE, Math.abs(energie(p, v) - E0)/Math.abs(E0));
    }
  }
  /* La force est centrale, donc L est conservé EXACTEMENT dans le continu. Le
     schéma discret, lui, ne l'est pas : c'est un point milieu, pas un
     intégrateur qui préserve L par construction. La dérive mesurée est ce qui
     reste, et elle est bornée — pas séculaire. */
  ok("moment cinétique conservé sur 200 000 pas", pireL < 1e-7,
     "< 1e-7", pireL.toExponential(2), "exact dans le continu ; ce qui reste est la discrétisation");
  ok("énergie conservée sur 200 000 pas", pireE < 2e-4,
     "< 2e-4", pireE.toExponential(2), "schéma du point milieu, dérive bornée et non séculaire");
}

{
  // v_circ = √(M/(r−3M)) n'est pas un réglage : elle se déduit de l'équilibre
  // v²/r = M/r² + 3ML²/r⁴ avec L = rv. On le vérifie en lançant une orbite
  // circulaire et en regardant si le rayon bouge.
  /* Pas r = 3 : c'est l'ISCO même, où la fréquence épicyclique s'annule. Une
     orbite y est marginalement stable, et le battement de 0,5 % qu'on y mesure
     n'est pas un défaut du schéma — c'est la physique du lieu. La section
     suivante le montre proprement. */
  for(const r0 of [3.5, 6.0, 14.0]){
    let p = [r0, 0, 0], v = [0, 0, vCirc(r0)];
    let rmin = r0, rmax = r0;
    for(let i = 0; i < 60000; i++){
      [p, v] = integre(p, v, 0.02);
      const r = len(p);
      if(r < rmin) rmin = r;
      if(r > rmax) rmax = r;
    }
    const bat = (rmax - rmin)/r0;
    ok("orbite circulaire à r = " + r0.toFixed(1) + " reste circulaire", bat < 2e-3,
       "battement < 0,2 %", (100*bat).toFixed(4) + " %");
  }
}

// ═══════════════════════════════════════════════════════ 2. la vraie preuve
groupe("La précession du périastre — et l'ISCO qu'elle contient");

/* C'EST LA PREUVE QUE LE MOTEUR EST RELATIVISTE, et elle est plus forte que ce
   que je croyais en l'écrivant.

   Le terme correctif 3L²/r² n'est pas un ornement. L'équation radiale qu'il
   produit est
       r̈ = L²/r³ − M/r² − 3ML²/r⁴
   et deux quantités s'en déduisent en forme fermée. La fréquence orbitale :
       Ω² = M / (r²(r − 3M))
   et la fréquence épicyclique — celle des allers-retours en rayon :
       κ² = M (r − 6M) / (r³(r − 3M))

   Leur rapport se simplifie entièrement :
       Ω/κ = √( r / (r − 6M) ) = 1 / √(1 − 6M/r)

   ce qui est EXACTEMENT le résultat de Schwarzschild. Pas une approximation au
   premier ordre : l'égalité est exacte. L'avance par tour vaut donc

       Δφ = 2π ( 1/√(1 − 6M/r) − 1 )

   Deux conséquences valent d'être dites. D'abord, c'est cette avance-là que
   GRAVITY a mesurée sur S2 en 2020 — la première fois qu'on la voyait ailleurs
   qu'autour du Soleil. Ensuite, κ s'annule en r = 6M, c'est-à-dire 3 r_s :
   l'ISCO n'est PAS un nombre écrit dans le code, c'est le zéro de cette
   fréquence. Le banc d'essai le retrouve par bissection depuis toujours ; ici
   on le voit apparaître dans la formule.

   ------------------------------------------------------------------------
   Ma première version de ce contrôle comparait à 6πM/L², qui est faux de deux
   façons à la fois : la formule au premier ordre est 6πM²/L², et le premier
   ordre lui-même ne vaut qu'à faible excentricité. Elle annonçait 46 % d'écart
   sur un moteur qui était juste. Un contrôle faux est pire que pas de contrôle
   — il fait corriger ce qui marche. */
{
  const theorie = r => 2*Math.PI*(1/Math.sqrt(1 - 6*M/r) - 1);

  /* Un piège dans lequel je suis tombé, et qui mérite d'être écrit : pousser
     une orbite circulaire de 1 % en vitesse ne la fait pas osciller AUTOUR de
     son rayon de départ. Elle acquiert du moment cinétique, donc elle se
     recentre plus haut — et c'est à ce rayon-là, le rayon guide, qu'il faut
     comparer. Comparé au rayon de départ, l'écart faisait 2 % au large et 28 %
     près de l'ISCO ; c'était ma mesure qui était mal posée.

     Le rayon guide se calcule : il est celui dont l'orbite circulaire porte le
     même moment cinétique. De L² = M r²/(r − 3M) on tire

         M r² − L² r + 3M L² = 0

     dont la grande racine est le rayon cherché. */
  const rayonGuide = L2 => (L2 + Math.sqrt(L2*L2 - 12*M*M*L2)) / (2*M);

  /* La poussée est dosée pour que l'excursion reste à deux pour mille du rayon,
     quel que soit l'endroit. Sans cela, près de l'ISCO où κ s'annule, une même
     poussée produit une excursion énorme et l'on quitte le régime linéaire dont
     la formule parle. */
  function mesurePrecession(r0){
    const dLnL = 0.5*(2 - r0/(r0 - 3*M));       // d ln L / d ln r
    const v0 = vCirc(r0)*(1 + 0.002*dLnL);
    let p = [r0, 0, 0], v = [0, 0, v0];
    const L2 = (r0*v0)**2;
    const rg = rayonGuide(L2);
    const angle = () => Math.atan2(p[2], p[0]);
    const dt = Math.min(0.01, 0.002*r0);
    let phi = 0, phiPrec = angle(), rPrec = len(p), montait = false;
    const sommets = [];
    for(let i = 0; i < 8000000 && sommets.length < 4; i++){
      [p, v] = integre(p, v, dt);
      let d = angle() - phiPrec;
      if(d >  Math.PI) d -= 2*Math.PI;
      if(d < -Math.PI) d += 2*Math.PI;
      phi += d; phiPrec = angle();
      const r = len(p);
      if(montait && r < rPrec) sommets.push(phi);
      montait = r > rPrec;
      rPrec = r;
    }
    if(sommets.length < 2) return null;
    let s = 0;
    for(let i = 1; i < sommets.length; i++) s += sommets[i] - sommets[i-1] - 2*Math.PI;
    return { avance: s/(sommets.length - 1), rg };
  }

  for(const r0 of [3.4, 5, 12, 40]){
    const m = mesurePrecession(r0);
    const t = m === null ? 0 : theorie(m.rg);
    const ecart = m === null ? 1 : Math.abs(m.avance - t)/t;
    ok("avance par tour à r = " + r0, m !== null && ecart < 0.005,
       t.toFixed(6) + " rad", m === null ? "—" : m.avance.toFixed(6) + " rad",
       "2π(1/√(1−6M/r) − 1) au rayon guide " + (m ? m.rg.toFixed(4) : "—") +
       "   écart " + (100*ecart).toFixed(4) + " %");
  }

  ok("elle est positive partout — le périastre AVANCE",
     [3.4, 5, 12, 40].every(r => theorie(r) > 0), "> 0", "oui",
     "le sens mesuré sur S2 par GRAVITY en 2020");

  /* Et le sommet de l'affaire : la formule diverge en r = 6M. Une orbite y met
     un temps infini à revenir à son périastre — c'est la définition même de la
     marginalité, et c'est pourquoi la section précédente ne teste pas r = 3. */
  const pres3 = theorie(3.001), loin = theorie(40);
  ok("elle diverge à l'approche de l'ISCO", pres3 > 60*loin,
     "immense devant celle du large", pres3.toFixed(2) + " rad contre " + loin.toFixed(5),
     "κ → 0 en r = 6M : l'ISCO n'est pas un nombre écrit, c'est ce zéro-là");
}

// ══════════════════════════════════════════════════════ 3. les trois familles
groupe("Les trois familles");

{
  const r0 = 8;
  const vc = vCirc(r0);
  const tire = f => V.destin([r0,0,0], [0, 0, vc*f]).sort;

  ok("à la vitesse circulaire, elle orbite", tire(1.0) === "orbite", "orbite", tire(1.0));
  ok("à 1,8 × la circulaire, elle s'échappe", tire(1.8) === "fuite", "fuite", tire(1.8));
  ok("à 0,15 × la circulaire, elle tombe",   tire(0.15) === "chute", "chute", tire(0.15));

  /* Le seuil de libération a lui aussi une forme fermée, et elle n'est pas √2.
     Pour un tir tangentiel à r, le moment cinétique vaut L = rv, donc

         E = ½v² − M/r − M L²/r³ = v²(½ − M/r) − M/r

     et E = 0 donne  v_esc = √( 2M / (r − 2M) )  —  qui fait écho à
     v_circ = √( M / (r − 3M) ), au dénominateur près.

     Le facteur √2 usuel ne vaut que par rapport à la circulaire NEWTONIENNE
     √(M/r). Rapporté à la circulaire d'ici, le seuil est plus bas. */
  const vEsc = r => Math.sqrt(2*M/(r - 2*M));
  const attendu = vEsc(r0)/vc;

  ok("au-dessus du seuil calculé, elle s'échappe", tire(attendu*1.06) === "fuite",
     "fuite", tire(attendu*1.06));
  ok("en dessous, elle reste liée", tire(attendu*0.94) === "orbite",
     "orbite", tire(attendu*0.94));

  /* Mesuré par bissection sur la CLASSIFICATION, qui est bornée dans le temps :
     une orbite qui s'échappe très lentement n'atteint pas r = 50 en 260 unités
     et sera dite « orbite ». Le seuil observé est donc nécessairement au-dessus
     du vrai, jamais en dessous — et c'est ce sens-là qu'on vérifie. */
  let bas = 1.0, haut = 2.0;
  for(let i = 0; i < 30; i++){
    const m = (bas + haut)/2;
    if(tire(m) === "fuite") haut = m; else bas = m;
  }
  const seuil = (bas + haut)/2;
  ok("seuil de libération observé, contre sa forme fermée",
     seuil >= attendu && seuil < attendu*1.06,
     "≥ " + attendu.toFixed(4) + " et à moins de 6 %", seuil.toFixed(4),
     "v_esc = √(2M/(r−2M)) = " + vEsc(r0).toFixed(5) + " ; le biais est celui de la classification");

  /* Une limite du modèle, qu'il vaut mieux écrire que découvrir plus tard : la
     même formule donne v_esc = c en r = 4M, soit DEUX rayons de Schwarzschild.
     Dans la vraie métrique, la vitesse de libération locale n'atteint c qu'à
     l'horizon. Le potentiel effectif employé ici pour la matière — le même que
     celui qui donne pourtant l'ISCO et la précession exacts — surestime donc le
     puits tout près du trou noir. À dire dans la note de la rédaction. */
  ok("la limite du modèle est là où on l'attend", pres(4*M, 2.0, 1e-12),
     "v_esc = c en r = 2 r_s", (4*M).toFixed(1) + " r_s",
     "dans la vraie métrique ce serait à l'horizon ; compromis assumé, à déclarer");
}

// ══════════════════════════════════════════════════ 4. l'horizon infranchissable
groupe("L'horizon, vu de loin");

{
  /* Le fait le plus contre-intuitif du site : une sonde qui tombe ne franchit
     jamais l'horizon POUR NOUS. Elle ralentit, rougit, se fige. Si le facteur
     (1 − r_s/r) disparaissait du pas d'intégration, elle traverserait — et
     personne, en regardant, ne s'apercevrait que c'est faux. */
  V.vide();
  const s = V.lance([6, 0, 0], [-0.02, 0, 0.02]);     // presque radiale
  let figee = null, tombee = null, rMin = 1e9, tGeo = 0;
  for(let i = 0; i < 24000; i++){
    tGeo += 0.02;
    for(const f of V.avance(0.02, 0.016)){
      if(f.quoi === "figee"  && figee  === null) figee  = tGeo;
      if(f.quoi === "tombee" && tombee === null) tombee = tGeo;
    }
    if(s.p) rMin = Math.min(rMin, len(s.p));
    if(tombee !== null) break;
  }

  ok("elle ne franchit jamais l'horizon", rMin > R_HORIZON,
     "> " + R_HORIZON, rMin.toFixed(6) + " r_s",
     "elle s'en approche à " + ((rMin - R_HORIZON)*1e6).toFixed(0) + " × 10⁻⁶ r_s et s'arrête");
  ok("elle se fige avant de s'éteindre", figee !== null && tombee !== null && figee < tombee,
     "figée puis tombée", "figée à " + (figee||"—") + ", tombée à " + (tombee||"—"));
  ok("quatorze unités séparent les deux",
     figee !== null && tombee !== null && pres(tombee - figee, 14, 0.5),
     "14 ± 0,5", figee !== null && tombee !== null ? (tombee - figee).toFixed(2) : "—",
     "l'intervalle où le mémorial devra dire « en train de disparaître »");
  ok("la sonde a bien été retirée de la liste", V.sondes.length === 0, 0, V.sondes.length);
  ok("le compteur de chutes s'est incrémenté", V.compte.chute === 1, 1, V.compte.chute);
}

// ═════════════════════════════════════════════════════════════ 5. les photons
groupe("Les photons");

{
  V.vide();
  /* Le piège documenté dans le code : poser naïvement |d| = 1 donnerait
     h² = r² = 2,25 au lieu de b_c² = 6,75, et le photon tournerait √3 fois trop
     vite. On vérifie que `rayonDepuis` rend bien le second. */
  const r = R_PHOTON;
  const ray = P.rayonDepuis([r, 0, 0], [0, 0, 1]);       // tangentiel
  const bc2 = 27*M*M;                                     // b_c² = 27M² = 6,75
  ok("h² au ras de la sphère des photons", pres(ray.h2, bc2, 1e-9),
     bc2.toFixed(6), ray.h2.toFixed(6), "et non r² = " + (r*r).toFixed(2) + ", qui ferait tourner √3 fois trop vite");

  // Lancé exactement tangentiellement à r = 1,5, il doit tourner sur la crête.
  let p = [r, 0, 0], d = ray.d.slice();
  let derive = 0;
  for(let i = 0; i < 3000; i++){
    [p, d] = P.integrePhoton(p, d, ray.h2, 0.001);
    derive = Math.max(derive, Math.abs(len(p) - r));
  }
  ok("il tient sur la sphère des photons", derive < 1e-4,
     "dérive < 1e-4", derive.toExponential(2), "orbite circulaire instable : elle tient, mais peu");

  for(let i = 0; i < 9; i++) V.lancePhoton();
  ok("pas plus de quatre photons à la fois", V.photons.length === 4, 4, V.photons.length);
}

// ══════════════════════════════════════════════════════════ 6. la mécanique
groupe("La tenue de la liste");

{
  V.vide();
  for(let i = 0; i < 500; i++) V.lance([9,0,0], [0,0,vCirc(9)]);
  ok("la liste est plafonnée à " + V.MAX_SONDES, V.sondes.length === V.MAX_SONDES,
     V.MAX_SONDES, V.sondes.length);

  V.vide();
  V.lance([R_ISCO - 0.5, 0, 0], [0, 0, 0.3]);
  ok("un tir sous la dernière orbite stable est compté", V.compte.essaisPres === 1,
     1, V.compte.essaisPres, "c'est ce compteur qui déclenche la note sur l'ISCO");

  V.vide();
  ok("vide() remet tout à zéro",
     V.sondes.length === 0 && V.photons.length === 0 && V.compte.chute === 0 && V.compte.fuite === 0,
     "tout à zéro", JSON.stringify(V.compte));

  V.pluie(200);
  const familles = {};
  for(const s of V.sondes) familles[s.sort] = (familles[s.sort]||0) + 1;
  ok("une pluie de 200 produit les trois familles",
     familles.orbite > 0 && familles.chute > 0 && familles.fuite > 0,
     "les trois", JSON.stringify(familles),
     "le facteur de vitesse balaie 0,40 à 1,65 × v_circ, de part et d'autre des deux seuils");
}

console.log("\n  ════════════════════════════════");
if(echecs === 0) console.log("  " + n + " contrôles tenus.\n");
else             console.log("  " + echecs + " ÉCHEC(S) sur " + n + " contrôles.\n");
process.exit(echecs === 0 ? 0 : 1);
