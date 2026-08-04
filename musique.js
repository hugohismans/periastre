/* ============================================================================
   La musique, calculée.

   Même règle que pour les textures et les modèles : rien n'est importé. Ni
   licence à vérifier sur un site public, ni mégaoctets à servir — et surtout,
   une piste enregistrée ne saurait pas ce qui se passe à l'écran.

   Celle-ci le sait. Ses paramètres sont pris dans l'orbite : quand le vaisseau
   plonge vers le périastre, le filtre s'ouvre, les battements s'accélèrent et
   une nappe grave monte. Quand il s'éloigne, tout retombe. La musique devient
   une seconde lecture des mêmes équations au lieu d'un habillage — et comme
   l'orbite ne se referme jamais tout à fait, elle ne se répète jamais non plus.

   Construction : un bourdon de trois oscillateurs légèrement désaccordés, un
   filtre passe-bas qui respire, et une nappe aiguë très en retrait. Les
   désaccords sont ce qui fait tout : deux oscillateurs à 0,3 Hz d'écart
   produisent un battement lent qu'aucune boucle ne reproduit.

   Tonalité : la mineur. Rien d'exotique — c'est la triade la plus sombre qui
   reste consonante, et l'astre fournit déjà le spectaculaire.
   ============================================================================ */

(function(global){
"use strict";

let ctx = null, maitre = null, filtre = null;
let voix = [], nappe = null, souffle = null;
let allume = false, volume = 0.16, tension = 0, cible = 0;

// La mineur : fondamentale, quinte, octave, puis la tierce mineure très haut.
// Les décalages en centièmes de ton créent les battements.
const BOURDON = [
  { f: 55.00, d:  0.0, g: 0.55 },   // la 1
  { f: 55.00, d: +5.5, g: 0.42 },   // son jumeau désaccordé : le battement
  { f: 82.41, d: -3.0, g: 0.30 },   // mi 2, la quinte
  { f:110.00, d: +2.0, g: 0.22 },   // la 2
];

function cree(){
  const AC = global.AudioContext || global.webkitAudioContext;
  if(!AC) return false;
  ctx = new AC();

  maitre = ctx.createGain();
  maitre.gain.value = 0;
  maitre.connect(ctx.destination);

  // Un compresseur doux : sans lui, la somme des oscillateurs sature dès que
  // la tension monte, et la saturation numérique s'entend très mal.
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -22; comp.ratio.value = 5; comp.knee.value = 14;
  comp.connect(maitre);

  filtre = ctx.createBiquadFilter();
  filtre.type = "lowpass";
  filtre.frequency.value = 240;
  filtre.Q.value = 0.7;
  filtre.connect(comp);

  for(const b of BOURDON){
    const o = ctx.createOscillator();
    o.type = "sawtooth";                 // riche en harmoniques : le filtre a de quoi travailler
    o.frequency.value = b.f;
    o.detune.value = b.d;
    const g = ctx.createGain();
    g.gain.value = b.g;
    o.connect(g); g.connect(filtre);
    o.start();
    voix.push({ o, g, base: b.f });
  }

  // La nappe aiguë : une sinusoïde seule, à peine audible, qui donne l'espace.
  // Elle passe à côté du filtre, sinon elle disparaîtrait au repos.
  nappe = ctx.createGain();
  nappe.gain.value = 0.0;
  nappe.connect(comp);
  for(const f of [329.63, 493.88]){      // mi 4 et si 4
    const o = ctx.createOscillator();
    o.type = "sine"; o.frequency.value = f;
    o.detune.value = (Math.random() - 0.5) * 8;
    const g = ctx.createGain(); g.gain.value = 0.5;
    o.connect(g); g.connect(nappe);
    o.start();
  }

  // Un souffle très grave, filtré : c'est lui qui fait « vaisseau ».
  const n = ctx.createBufferSource();
  const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let prec = 0;
  for(let i = 0; i < d.length; i++){
    // bruit brun : on intègre du bruit blanc, ce qui creuse les aigus
    prec = (prec + (Math.random()*2 - 1) * 0.02) * 0.996;
    d[i] = prec * 3.2;
  }
  n.buffer = buf; n.loop = true;
  const pb = ctx.createBiquadFilter();
  pb.type = "lowpass"; pb.frequency.value = 95;   // plus sourd, donc moins present
  souffle = ctx.createGain(); souffle.gain.value = 0.028;
  n.connect(pb); pb.connect(souffle); souffle.connect(comp);
  n.start();

  return true;
}

/* Le contexte audio démarre suspendu tant qu'aucun geste n'a eu lieu : c'est la
   politique de tous les navigateurs, et il n'y a pas à la contourner. On
   attend donc d'être appelé depuis un clic. */
function demarre(){
  if(!ctx && !cree()) return false;
  if(ctx.state === "suspended") ctx.resume();
  allume = true;
  maitre.gain.cancelScheduledValues(ctx.currentTime);
  maitre.gain.setTargetAtTime(volume, ctx.currentTime, 3.5);   // lever de rideau lent
  return true;
}

function arrete(){
  if(!ctx) return;
  allume = false;
  maitre.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
}

function regleVolume(v){
  volume = Math.max(0, Math.min(1, v));
  if(ctx && allume) maitre.gain.setTargetAtTime(volume, ctx.currentTime, 0.4);
}

/**
 * Donne à la musique l'état de l'orbite.
 * @param t  0 à l'apoastre, 1 au périastre. C'est tout ce dont elle a besoin.
 */
function regle(t){
  cible = Math.max(0, Math.min(1, t || 0));
}

// Appelé à chaque image. On lisse fortement : une musique qui suit le rayon
// instantanément saute à chaque à-coup de la simulation.
function avance(dt){
  if(!ctx || !allume) return;
  tension += (cible - tension) * Math.min(1, dt * 0.6);
  const n = ctx.currentTime;

  // Le filtre s'ouvre à l'approche : c'est l'effet le plus audible, et le plus
  // juste — on entend le vaisseau accélérer sans qu'aucun tempo ne change.
  filtre.frequency.setTargetAtTime(210 + tension * 1250, n, 0.35);
  filtre.Q.setTargetAtTime(0.7 + tension * 3.2, n, 0.35);

  // Les battements s'accélèrent : le désaccord s'écarte avec la tension.
  voix[1].o.detune.setTargetAtTime(5.5 + tension * 22, n, 0.5);
  voix[3].o.detune.setTargetAtTime(2.0 - tension * 14, n, 0.5);

  nappe.gain.setTargetAtTime(0.012 + tension * 0.052, n, 0.7);
  souffle.gain.setTargetAtTime(0.028 + tension * 0.045, n, 0.5);
}

/* Un coup, pour marquer un moment.

   Une seule fois par étape franchie, et surtout pas à chaque clic : ce qui
   souligne tout ne souligne plus rien. Deux gestes seulement — une sous-basse
   qui descend, et le filtre qu'on ouvre brièvement. C'est assez pour qu'on
   sente que quelque chose vient de se passer, et assez discret pour ne pas
   transformer une simulation en bande-annonce. */
function frappe(force){
  if(!ctx || !allume) return;
  const n = ctx.currentTime, f = Math.max(0.2, Math.min(1, force || 1));

  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(78, n);
  o.frequency.exponentialRampToValueAtTime(26, n + 2.4);   // la descente
  g.gain.setValueAtTime(0.0001, n);
  g.gain.exponentialRampToValueAtTime(0.5 * f, n + 0.09);
  g.gain.exponentialRampToValueAtTime(0.0001, n + 3.2);
  o.connect(g); g.connect(maitre);
  o.start(n); o.stop(n + 3.3);

  // et le filtre s'ouvre, puis retombe là où la tension le veut
  const haut = 400 + f * 2600;
  filtre.frequency.cancelScheduledValues(n);
  filtre.frequency.setValueAtTime(filtre.frequency.value, n);
  filtre.frequency.linearRampToValueAtTime(haut, n + 0.35);
  filtre.frequency.setTargetAtTime(210 + tension * 1250, n + 0.4, 1.4);
}

global.MUSIQUE = { demarre, arrete, regle, regleVolume, avance, frappe,
                   get active(){ return allume; } };

})(window);
