import { createContext, useContext, useState, type ReactNode } from "react";

export interface ActiveQuestion {
  text: string;
  hint?: string;
  prompts?: string[];
  options?: string[];
  type?: string;
  stageName?: string;
}

interface AssistantContextValue {
  activeQuestion: ActiveQuestion | null;
  setActiveQuestion: (q: ActiveQuestion | null) => void;
}

const AssistantContext = createContext<AssistantContextValue>({
  activeQuestion: null,
  setActiveQuestion: () => {},
});

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [activeQuestion, setActiveQuestion] = useState<ActiveQuestion | null>(null);
  return (
    <AssistantContext.Provider value={{ activeQuestion, setActiveQuestion }}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  return useContext(AssistantContext);
}
