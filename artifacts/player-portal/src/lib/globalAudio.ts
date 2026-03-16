const w = globalThis as unknown as Record<string, HTMLAudioElement | null | undefined>;
const KEY = "__metyMusicAudio";

function get(): HTMLAudioElement | null {
  return (w[KEY] as HTMLAudioElement | null) ?? null;
}
function set(a: HTMLAudioElement | null) {
  w[KEY] = a;
}

function playWithFallback(audio: HTMLAudioElement): void {
  audio.play().catch(() => {
    const tryPlay = () => { audio.play().catch(() => {}); };
    document.addEventListener("click",      tryPlay, { once: true, capture: true });
    document.addEventListener("touchstart", tryPlay, { once: true, capture: true });
    document.addEventListener("keydown",    tryPlay, { once: true, capture: true });
  });
}

export function ensureMusicPlaying(): void {
  let audio = get();
  if (audio && !audio.paused) return;
  if (!audio) {
    audio = new Audio(`${import.meta.env.BASE_URL}audio/love-me-again.mp3`);
    audio.volume = 0.15;
    audio.currentTime = 12;
    audio.addEventListener("ended", () => { set(null); });
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
  const target = 0.04;
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
