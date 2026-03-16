import { publicAssetUrl } from "./publicAssetUrl";

/**
 * globalAudio.ts — cross-platform volume control including iOS Safari.
 *
 * iOS Safari ignores programmatic changes to HTMLAudioElement.volume.
 * The fix: route audio through a Web Audio API GainNode, which iOS DOES
 * allow JavaScript to control. We set audio.volume = 1 always and drive
 * the perceived volume exclusively via gainNode.gain.value.
 *
 * If the Web Audio API is unavailable (very old browsers) we fall back to
 * audio.volume as before.
 */

const w = globalThis as Record<string, unknown>;
const AUDIO_KEY = "__metyMusicAudio";
const CTX_KEY   = "__metyAudioCtx";
const GAIN_KEY  = "__metyGainNode";

const NORMAL_VOL = 0.15;
const DUCK_VOL   = 0.075;

function getAudio(): HTMLAudioElement | null {
  return (w[AUDIO_KEY] as HTMLAudioElement | null) ?? null;
}
function setAudio(a: HTMLAudioElement | null) { w[AUDIO_KEY] = a; }

function getCtx(): AudioContext | null {
  return (w[CTX_KEY] as AudioContext | null) ?? null;
}
function setCtx(c: AudioContext | null) { w[CTX_KEY] = c; }

function getGain(): GainNode | null {
  return (w[GAIN_KEY] as GainNode | null) ?? null;
}
function setGain(g: GainNode | null) { w[GAIN_KEY] = g; }

// Track the animation target so overlapping calls cancel the previous fade
let _targetGain = NORMAL_VOL;

function createAudioElement(): HTMLAudioElement {
  const audio = new Audio(publicAssetUrl("audio/love-me-again.mp3"));
  // Keep native volume at 1 — the GainNode controls perceived level.
  // If Web Audio setup fails we'll lower this in the catch block.
  audio.volume = 1;
  audio.currentTime = 12;
  audio.preload = "auto";
  audio.addEventListener("ended", () => { setAudio(null); });
  return audio;
}

/**
 * Wire up AudioContext + GainNode so we can control volume on iOS.
 * Falls back gracefully to audio.volume on unsupported browsers.
 */
function trySetupWebAudio(audio: HTMLAudioElement): void {
  if (getCtx()) return; // already set up for this audio element
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) throw new Error("no AudioContext");

    const ctx  = new AC();
    const gain = ctx.createGain();
    gain.gain.value = NORMAL_VOL;

    const src = ctx.createMediaElementSource(audio);
    src.connect(gain);
    gain.connect(ctx.destination);

    setCtx(ctx);
    setGain(gain);

    // iOS creates AudioContext in "suspended" state — resume immediately
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
  } catch {
    // Web Audio unavailable — fall back to native volume control
    audio.volume = NORMAL_VOL;
  }
}

function resumeCtx(): void {
  const ctx = getCtx();
  if (ctx?.state === "suspended") ctx.resume().catch(() => {});
}

/** Read current effective volume (GainNode or audio.volume fallback). */
function getVol(): number {
  const gain = getGain();
  if (gain) return gain.gain.value;
  return getAudio()?.volume ?? 0;
}

/** Set current effective volume (GainNode or audio.volume fallback). */
function setVol(v: number): void {
  const gain = getGain();
  if (gain) {
    gain.gain.value = v;
  } else {
    const a = getAudio();
    if (a) a.volume = Math.min(v, 1);
  }
}

/** Smoothly animate volume to target. Works on iOS via GainNode. */
function fadeToVol(target: number, stepUp: number, stepDown: number): void {
  _targetGain = target;
  const tick = () => {
    if (_targetGain !== target) return; // a newer fade superseded this one
    const cur = getVol();
    if (Math.abs(cur - target) < 0.001) { setVol(target); return; }
    const next = cur < target
      ? Math.min(cur + stepUp, target)
      : Math.max(cur - stepDown, target);
    setVol(next);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function playWithFallback(audio: HTMLAudioElement): void {
  trySetupWebAudio(audio);
  resumeCtx();
  audio.play().catch(() => {
    const tryPlay = () => {
      resumeCtx();
      audio.play().catch(() => {});
    };
    document.addEventListener("click",      tryPlay, { once: true, capture: true });
    document.addEventListener("touchstart", tryPlay, { once: true, capture: true });
    document.addEventListener("keydown",    tryPlay, { once: true, capture: true });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/** Download and buffer the audio file without starting playback. Call on app boot. */
export function bufferMusic(): void {
  if (getAudio()) return;
  const audio = createAudioElement();
  setAudio(audio);
  audio.load();
}

/** @deprecated Use bufferMusic() + ensureMusicPlaying() instead. */
export function preloadMusic(): void { bufferMusic(); }

/** Start (or resume) music playback. */
export function ensureMusicPlaying(): void {
  let audio = getAudio();
  if (!audio) { audio = createAudioElement(); setAudio(audio); }
  if (!audio.paused) { resumeCtx(); return; }
  playWithFallback(audio);
}

/** Stop music and tear down the Web Audio graph (e.g. when journey begins). */
export function stopMusic(): void {
  const audio = getAudio();
  if (audio) { audio.pause(); audio.src = ""; }
  getGain()?.disconnect();
  getCtx()?.close().catch(() => {});
  setAudio(null);
  setGain(null);
  setCtx(null);
}

/** Fade music down to half-volume. Works on iOS via Web Audio GainNode. */
export function duckMusic(): void {
  fadeToVol(DUCK_VOL, 0.005, 0.005);
}

/** Fade music back up to normal volume. */
export function restoreMusic(targetVolume = NORMAL_VOL): void {
  fadeToVol(targetVolume, 0.003, 0.003);
}

export function isMusicPlaying(): boolean {
  const a = getAudio();
  return !!a && !a.paused;
}

export function playAudioElement(audio: HTMLAudioElement): void {
  audio.play().catch(() => {
    const tryPlay = () => { audio.play().catch(() => {}); };
    document.addEventListener("click",      tryPlay, { once: true, capture: true });
    document.addEventListener("touchstart", tryPlay, { once: true, capture: true });
    document.addEventListener("keydown",    tryPlay, { once: true, capture: true });
  });
}
