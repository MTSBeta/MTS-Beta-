import { publicAssetUrl } from "./publicAssetUrl";

const w = globalThis as unknown as Record<string, HTMLAudioElement | null | undefined>;
const KEY = "__metyMusicAudio";

function get(): HTMLAudioElement | null {
  return (w[KEY] as HTMLAudioElement | null) ?? null;
}
function set(a: HTMLAudioElement | null) {
  w[KEY] = a;
}

function createAudioElement(): HTMLAudioElement {
  const audio = new Audio(publicAssetUrl("audio/love-me-again.mp3"));
  audio.volume = 0.15;
  audio.currentTime = 12;
  audio.preload = "auto";
  audio.addEventListener("ended", () => { set(null); });
  return audio;
}

function playWithFallback(audio: HTMLAudioElement): void {
  audio.play().catch(() => {
    const tryPlay = () => { audio.play().catch(() => {}); };
    document.addEventListener("click",      tryPlay, { once: true, capture: true });
    document.addEventListener("touchstart", tryPlay, { once: true, capture: true });
    document.addEventListener("keydown",    tryPlay, { once: true, capture: true });
  });
}

/** Fetch and buffer the audio file so it's ready to play instantly later.
 *  Does NOT attempt playback and does NOT attach any interaction listeners.
 *  Call this on app boot; call ensureMusicPlaying() only from the Welcome page. */
export function bufferMusic(): void {
  if (get()) return;
  const audio = createAudioElement();
  set(audio);
  audio.load();
}

/** @deprecated Use bufferMusic() for preloading and ensureMusicPlaying() to start. */
export function preloadMusic(): void {
  bufferMusic();
}

export function ensureMusicPlaying(): void {
  let audio = get();
  if (audio && !audio.paused) return;
  if (!audio) {
    audio = createAudioElement();
    set(audio);
  }
  playWithFallback(audio);
}

export function stopMusic(): void {
  const audio = get();
  if (audio) {
    audio.pause();
    audio.src = "";
    set(null);
  }
}

export function duckMusic(): void {
  const audio = get();
  if (!audio) return;
  const target = 0.075;
  const step = () => {
    const a = get();
    if (!a) return;
    if (a.volume > target) {
      a.volume = Math.max(a.volume - 0.005, target);
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

export function restoreMusic(targetVolume = 0.15): void {
  const step = () => {
    const a = get();
    if (!a) return;
    if (a.volume < targetVolume) {
      a.volume = Math.min(a.volume + 0.003, targetVolume);
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

export function isMusicPlaying(): boolean {
  const a = get();
  return !!a && !a.paused;
}

export function playAudioElement(audio: HTMLAudioElement): void {
  playWithFallback(audio);
}
