const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/api$/, "/api");

let cachedBlobUrl: string | null = null;
let pendingFetch: Promise<void> | null = null;
let cacheKey = "";

export function getPreloadedAudio(assistantId: string, firstName: string): string | null {
  const key = `${assistantId}:${firstName}`;
  return cachedBlobUrl && cacheKey === key ? cachedBlobUrl : null;
}

export function preloadIntroAudio(assistantId: string, firstName: string): void {
  const key = `${assistantId}:${firstName}`;
  if (cachedBlobUrl && cacheKey === key) return;
  if (pendingFetch && cacheKey === key) return;

  cacheKey = key;
  cachedBlobUrl = null;

  pendingFetch = (async () => {
    try {
      const nameParam = encodeURIComponent(firstName || "there");
      const res = await fetch(`${API_BASE}/tts/intro/${assistantId}?name=${nameParam}`);
      if (!res.ok) return;
      const blob = await res.blob();
      if (cacheKey === key) {
        cachedBlobUrl = URL.createObjectURL(blob);
      }
    } catch {
    } finally {
      pendingFetch = null;
    }
  })();
}
