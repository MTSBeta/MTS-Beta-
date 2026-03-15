import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Player } from "@workspace/api-client-react";
import { type AcademyConfig } from "../data/academies";

interface JourneyAnswers {
  [stageId: string]: string[];
}

interface PlayerContextType {
  selectedAcademy: AcademyConfig | null;
  setSelectedAcademy: (academy: AcademyConfig | null) => void;
  playerData: Player | null;
  setPlayerData: (player: Player | null) => void;
  journeyAnswers: JourneyAnswers;
  saveJourneyStage: (stageId: string, answers: string[]) => void;
  clearContext: () => void;
  completionData: { parentCode: string; coachCode: string } | null;
  setCompletionData: (data: { parentCode: string; coachCode: string }) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [selectedAcademy, setSelectedAcademy] = useState<AcademyConfig | null>(null);
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [journeyAnswers, setJourneyAnswers] = useState<JourneyAnswers>({});
  const [completionData, setCompletionData] = useState<{ parentCode: string; coachCode: string } | null>(null);

  const saveJourneyStage = (stageId: string, answers: string[]) => {
    setJourneyAnswers(prev => ({
      ...prev,
      [stageId]: answers
    }));
  };

  const clearContext = () => {
    setSelectedAcademy(null);
    setPlayerData(null);
    setJourneyAnswers({});
    setCompletionData(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        selectedAcademy,
        setSelectedAcademy,
        playerData,
        setPlayerData,
        journeyAnswers,
        saveJourneyStage,
        clearContext,
        completionData,
        setCompletionData
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
}
