// Tiny synthesized sound effects (no audio files): paper rustle for page
// turns, a soft leather creak for the cover, and a wax-seal crack.

let ctx = null;
let muted = false;

export const setSfxMuted = (m) => (muted = m);

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noise(c, seconds) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
}

function burst({ at = 0, dur, freq, q, gain, type = "bandpass", sweep }) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + at;
  const src = noise(c, dur);
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t + dur);
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + dur);
}

export function pageFlip() {
  if (muted) return;
  burst({ dur: 0.38, freq: 2500, sweep: 900, q: 0.7, gain: 0.22 });
  burst({ at: 0.22, dur: 0.16, freq: 1400, q: 1, gain: 0.12 });
}

export function coverCreak() {
  if (muted) return;
  burst({ dur: 0.7, freq: 380, sweep: 220, q: 6, gain: 0.25 });
  burst({ at: 0.45, dur: 0.4, freq: 1800, sweep: 700, q: 0.8, gain: 0.15 });
}

export function sealCrack() {
  if (muted) return;
  burst({ dur: 0.07, freq: 3000, q: 2, gain: 0.5, type: "highpass" });
  burst({ at: 0.05, dur: 0.12, freq: 900, q: 1.5, gain: 0.3 });
}
