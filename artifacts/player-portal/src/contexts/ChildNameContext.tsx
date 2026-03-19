import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ChildNameContextValue {
  childName: string | null;
  setChildName: (name: string) => void;
  clearChildName: () => void;
  promptOpen: boolean;
  openPrompt: () => void;
  closePrompt: () => void;
}

const ChildNameContext = createContext<ChildNameContextValue>({
  childName: null,
  setChildName: () => {},
  clearChildName: () => {},
  promptOpen: false,
  openPrompt: () => {},
  closePrompt: () => {},
});

const STORAGE_KEY = "mts_child_name";
const SKIPPED_KEY = "mts_welcome_skipped";

export function ChildNameProvider({ children }: { children: ReactNode }) {
  const [childName, setChildNameState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    if (childName) return;
    try {
      if (sessionStorage.getItem(SKIPPED_KEY)) return;
    } catch {}
    const t = setTimeout(() => setPromptOpen(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const setChildName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const capitalised = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    setChildNameState(capitalised);
    try {
      localStorage.setItem(STORAGE_KEY, capitalised);
    } catch {}
  };

  const clearChildName = () => {
    setChildNameState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const openPrompt = () => setPromptOpen(true);

  const closePrompt = () => {
    setPromptOpen(false);
    try {
      sessionStorage.setItem(SKIPPED_KEY, "1");
    } catch {}
  };

  return (
    <ChildNameContext.Provider value={{ childName, setChildName, clearChildName, promptOpen, openPrompt, closePrompt }}>
      {children}
    </ChildNameContext.Provider>
  );
}

export function useChildName() {
  return useContext(ChildNameContext);
}
