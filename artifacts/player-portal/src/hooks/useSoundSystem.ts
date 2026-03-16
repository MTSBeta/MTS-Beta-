import { useCallback, useRef } from "react";

type SoundType = "click" | "select" | "navigate" | "success" | "error";

interface SoundConfig {
  volume: number;
  enabled: boolean;
}

/**
 * Premium FIFA-style sound system using Web Audio API
 * Generates restrained, crisp menu sounds on-demand
 */
export function useSoundSystem(config: Partial<SoundConfig> = {}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const settingsRef = useRef<SoundConfig>({
    volume: 0.4, // restrained FIFA-style volume
    enabled: true,
    ...config,
  });

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!settingsRef.current.enabled) return;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      switch (type) {
        case "click": {
          // Subtle click: high-pitched, very short
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 1200; // crisp high tone
          gain.gain.setValueAtTime(settingsRef.current.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case "select": {
          // Selection: medium tone, slightly longer
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.setValueAtTime(settingsRef.current.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case "navigate": {
          // Navigation: ascending tone (next/forward)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.linearRampToValueAtTime(1000, now + 0.15);
          gain.gain.setValueAtTime(settingsRef.current.volume * 0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case "success": {
          // Success: pleasant musical interval (minor third)
          const notes = [800, 1000]; // ascending notes
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            const startTime = now + idx * 0.08;
            gain.gain.setValueAtTime(settingsRef.current.volume * 0.7, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            osc.start(startTime);
            osc.stop(startTime + 0.1);
          });
          break;
        }

        case "error": {
          // Error: descending buzz
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "square"; // buzzy square wave
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.linearRampToValueAtTime(300, now + 0.1);
          gain.gain.setValueAtTime(settingsRef.current.volume * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }
      }
    } catch (e) {
      // Silently fail if Web Audio API unavailable
      console.debug("Sound playback failed:", e);
    }
  }, [getAudioContext]);

  const setEnabled = useCallback((enabled: boolean) => {
    settingsRef.current.enabled = enabled;
  }, []);

  const setVolume = useCallback((volume: number) => {
    settingsRef.current.volume = Math.max(0, Math.min(1, volume));
  }, []);

  return {
    play: playSound,
    setEnabled,
    setVolume,
    isEnabled: () => settingsRef.current.enabled,
  };
}
