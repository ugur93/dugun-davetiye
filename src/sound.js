// Page-turn and cover sounds from audio files (see WEDDING.sfx). They are
// played through Web Audio so they also work for turns started by buttons,
// and each turn varies the pitch slightly so repeated flips sound natural.
// Without the files the book simply turns silently.
import { WEDDING } from "./content.js";

let ctx = null;
let muted = false;
const buffers = {};

export const setSfxMuted = (m) => (muted = m);

function create() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    load();
  }
  return ctx;
}

function audio() {
  const c = create();
  if (c?.state === "suspended") c.resume();
  return c;
}

function load() {
  for (const [name, file] of Object.entries(WEDDING.sfx || {})) {
    if (!file) continue;
    fetch(import.meta.env.BASE_URL + file)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then((data) => ctx.decodeAudioData(data))
      .then((buf) => (buffers[name] = buf))
      .catch(() => {}); // file not added yet
  }
}

function play(name, volume) {
  if (muted) return;
  const c = audio();
  const buf = buffers[name];
  if (!c || !buf) return;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = 0.93 + Math.random() * 0.14;
  const g = c.createGain();
  g.gain.value = volume;
  src.connect(g).connect(c.destination);
  src.start();
}

// The context starts suspended (no sound before a tap) but the files are
// fetched and decoded right away, so the very first cover opening has its sound.
create();

// Call from a tap: browsers only allow sound after a user gesture.
export const unlockSfx = () => audio();

export const pageFlip = () => play("flip", 0.6);
export const coverCreak = () => play("cover", 0.75);
