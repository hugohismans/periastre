/* ============================================================================
   OUTIL DE VÉRIFICATION — pas du code de production, pas chargé par la page.

       node outil-verif-etoiles.js

   Il charge etoiles.js en lui donnant un faux `window`, puis éprouve trois
   choses sur les éléments recopiés de Gillessen et al. 2017 :

     1. le SIGNE de la troisième composante de position() — un astre qui
        s'éloigne doit-il donner un z croissant ? Le juge est la vitesse
        radiale de S2 au périastre de 2018, publiée et sans ambiguïté ;
     2. la troisième loi de Kepler, étoile par étoile, qui doit rendre la même
        masse centrale partout — une ligne mal recopiée s'y voit tout de suite ;
     3. quelques ordres de grandeur (périastre et vitesse de S2).

   Résultat dans VERIF-ETOILES.md.
   ============================================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

// --- chargement d'etoiles.js sans navigateur -------------------------------
const src = fs.readFileSync(path.join(__dirname, "etoiles.js"), "utf8");
const faux = {};
// le module se termine par })(window); — on lui passe notre objet à la place
new Function("window", src)(faux);
const { ETOILES, position } = faux.ETOILES_S;

// --- constantes ------------------------------------------------------------
const UA_AN_EN_KMS = 4.74047;   // une unité astronomique par an, en km/s
const MASSE_ATTENDUE = 4.3e6;   // masses solaires

// vitesse par différence centrée, en UA/an, puis en km/s
function vitesse(s, annee, h = 1e-4){
  const a = position(s, annee - h), b = position(s, annee + h);
  return [0,1,2].map(k => (b[k] - a[k]) / (2*h) * UA_AN_EN_KMS);
}

const S2 = ETOILES.find(s => s.nom === "S2");

// --- 1. le signe -----------------------------------------------------------
const lignes = [];
const dit = t => { lignes.push(t); console.log(t); };

dit("## 1. Signe de la troisième composante — vitesse radiale de S2");
dit("");
dit("| époque | dz/dt (km/s) | |v| (km/s) | r (UA) |");
dit("|---|---:|---:|---:|");
for(const an of [2017.4, 2018.0, 2018.2, 2018.3, 2018.35, 2018.4, 2018.45, 2018.5, 2018.6, 2019.0, 2019.4]){
  const v = vitesse(S2, an);
  const p = position(S2, an);
  const norme = Math.hypot(...v);
  const r = Math.hypot(...p);
  dit(`| ${an.toFixed(2)} | ${v[2].toFixed(0)} | ${norme.toFixed(0)} | ${r.toFixed(1)} |`);
}
dit("");

// extrema de dz/dt autour du périastre
let min = {v: Infinity}, max = {v: -Infinity};
for(let an = 2017.5; an <= 2019.5; an += 0.0005){
  const vz = vitesse(S2, an)[2];
  if(vz < min.v) min = {v: vz, an};
  if(vz > max.v) max = {v: vz, an};
}
dit(`Extremum négatif : ${min.v.toFixed(0)} km/s en ${min.an.toFixed(3)}`);
dit(`Extremum positif : ${max.v.toFixed(0)} km/s en ${max.an.toFixed(3)}`);
dit("");

// date du périastre effective (distance minimale)
let peri = {r: Infinity};
for(let an = 2017.5; an <= 2019.5; an += 0.0005){
  const r = Math.hypot(...position(S2, an));
  if(r < peri.r) peri = {r, an};
}
dit(`Périastre calculé : r = ${peri.r.toFixed(1)} UA en ${peri.an.toFixed(3)}`);
dit(`a(1−e) attendu    : ${(S2.a*(1-S2.e)).toFixed(1)} UA`);
const vPeri = Math.hypot(...vitesse(S2, peri.an));
dit(`Vitesse au périastre : ${vPeri.toFixed(0)} km/s = ${(vPeri/299792.458*100).toFixed(2)} % de c`);
dit("");

// --- 1 bis. le même résultat, mais analytique ------------------------------
// La vitesse radiale képlérienne vaut K·[cos(ω+ν) + e·cos ω], avec
// K = 2πa·sin i / (P·√(1−e²)). Ses deux extrema tombent en ω+ν = 0 et = 180°,
// c'est-à-dire en ν = −ω (AVANT le périastre, puisque ν y passe par zéro) et
// ν = 180−ω (APRÈS). Leurs valeurs sont K(1+e·cos ω) et −K(1−e·cos ω).
//
// Conséquence qui tranche : le rapport des deux extrema ne dépend que de e et
// de ω, jamais du signe de z. Aucune correction de signe ne peut échanger
// leurs grandeurs — elle ne peut qu'échanger leurs signes.
dit("## 1 bis. Contrôle analytique des deux extrema de vitesse radiale");
dit("");
{
  const K = 2*Math.PI * S2.a * Math.sin(S2.i*DEG_()) /
            (S2.P * Math.sqrt(1 - S2.e*S2.e)) * UA_AN_EN_KMS;
  const ec = S2.e * Math.cos(S2.w*DEG_());
  dit(`K = ${Math.abs(K).toFixed(0)} km/s, e·cos ω = ${ec.toFixed(4)}`);
  dit(`Extremum AVANT le périastre (ν = −ω) : ${(K*(1+ec)).toFixed(0)} km/s`);
  dit(`Extremum APRÈS le périastre (ν = 180−ω) : ${(-K*(1-ec)).toFixed(0)} km/s`);
  dit(`Rapport des grandeurs : ${Math.abs((1+ec)/(1-ec)).toFixed(2)} — le plus ` +
      `grand tombe forcément AVANT le périastre tant que cos ω > 0.`);
}
dit("");

function DEG_(){ return Math.PI/180; }

// --- 2. Kepler -------------------------------------------------------------
dit("## 2. Troisième loi de Kepler, étoile par étoile");
dit("");
dit("| étoile | a (UA) | P (an) | M = a³/P² (M☉) | écart à 4,3e6 |");
dit("|---|---:|---:|---:|---:|");
const masses = [];
for(const s of ETOILES){
  const M = s.a**3 / s.P**2;
  masses.push({nom: s.nom, M});
  const ecart = (M/MASSE_ATTENDUE - 1) * 100;
  dit(`| ${s.nom} | ${s.a.toFixed(0)} | ${s.P.toFixed(1)} | ${(M/1e6).toFixed(2)} × 10⁶ | ${ecart >= 0 ? "+" : ""}${ecart.toFixed(1)} % |`);
}
const moy = masses.reduce((t,m) => t + m.M, 0) / masses.length;
dit("");
dit(`Moyenne : ${(moy/1e6).toFixed(2)} × 10⁶ M☉ (écart à 4,3e6 : ${((moy/MASSE_ATTENDUE-1)*100).toFixed(1)} %)`);
dit("");

// Le constat rédigé est dans VERIF-ETOILES.md ; ici on ne fait que l'imprimer.
void lignes;
