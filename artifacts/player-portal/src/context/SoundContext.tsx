import { createContext, useContext, ReactNode, useState, useCallback } from "react";

interface SoundContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <SoundContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundEnabled() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    return { enabled: true, setEnabled: () => {} };
  }
  return ctx;
}
