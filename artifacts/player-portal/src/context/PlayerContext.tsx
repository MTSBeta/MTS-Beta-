import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Player, StakeholderLink } from "@workspace/api-client-react";
import { type AcademyConfig } from "../data/academies";

interface AnswerEntry {
  text: string;
  audioUrl: string | null;
  audioBlob?: Blob | null;
  mediaUrls: string[];
}

interface JourneyAnswers {
  [stageId: string]: AnswerEntry[];
}

interface PlayerContextType {
  selectedAcademy: AcademyConfig | null;
  setSelectedAcademy: (academy: AcademyConfig | null) => void;
  playerData: Player | null;
  setPlayerData: (player: Player | null) => void;
  journeyAnswers: JourneyAnswers;
  saveJourneyStage: (stageId: string, answers: AnswerEntry[]) => void;
  clearContext: () => void;
  stakeholderLinks: StakeholderLink[];
  setStakeholderLinks: (links: StakeholderLink[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [selectedAcademy, setSelectedAcademy] = useState<AcademyConfig | null>(null);
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [journeyAnswers, setJourneyAnswers] = useState<JourneyAnswers>({});
  const [stakeholderLinks, setStakeholderLinks] = useState<StakeholderLink[]>([]);

  const saveJourneyStage = (stageId: string, answers: AnswerEntry[]) => {
    setJourneyAnswers((prev) => ({ ...prev, [stageId]: answers }));
  };

  const clearContext = () => {
    setSelectedAcademy(null);
    setPlayerData(null);
    setJourneyAnswers({});
    setStakeholderLinks([]);
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
        stakeholderLinks,
        setStakeholderLinks,
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

export type { AnswerEntry };
