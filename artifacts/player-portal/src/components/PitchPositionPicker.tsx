import { POSITIONS } from "@/data/positions";

interface PitchPosition {
  id: string;
  cx: number;
  cy: number;
  label: string;
}

const PITCH_POSITIONS: PitchPosition[] = [
  { id: "GK",  cx: 48,  cy: 200, label: "GK" },
  { id: "LB",  cx: 145, cy: 68,  label: "LB" },
  { id: "CB",  cx: 155, cy: 165, label: "CB" },
  { id: "RB",  cx: 145, cy: 332, label: "RB" },
  { id: "CDM", cx: 240, cy: 200, label: "CDM" },
  { id: "CM",  cx: 320, cy: 130, label: "CM" },
  { id: "CAM", cx: 390, cy: 200, label: "CAM" },
  { id: "LW",  cx: 460, cy: 68,  label: "LW" },
  { id: "RW",  cx: 460, cy: 332, label: "RW" },
  { id: "CF",  cx: 490, cy: 155, label: "CF" },
  { id: "ST",  cx: 535, cy: 200, label: "ST" },
];

interface Props {
  value: string;
  onChange: (positionId: string) => void;
  error?: string;
  disabledId?: string;
  label?: string;
  accent?: "amber" | "sky";
}

export function PitchPositionPicker({ value, onChange, error, disabledId, label, accent = "amber" }: Props) {
  const selectedPos = POSITIONS.find(p => p.id === value);

  const ringColor = accent === "sky" ? "rgba(56,189,248,0.6)" : "rgba(245,158,11,0.6)";
  const dotColor  = accent === "sky" ? "rgba(56,189,248,0.9)"  : "rgba(245,158,11,0.9)";
  const dotStroke = accent === "sky" ? "rgba(56,189,248,1)"    : "rgba(245,158,11,1)";
  const cardBg    = accent === "sky" ? "bg-sky-500/10 border-sky-500/30" : "bg-amber-500/10 border-amber-500/30";
  const iconBg    = accent === "sky" ? "bg-sky-500/20 border-sky-500/50" : "bg-amber-500/20 border-amber-500/50";
  const iconText  = accent === "sky" ? "text-sky-400" : "text-amber-400";
  const archText  = accent === "sky" ? "text-sky-400" : "text-amber-400";

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-white/80 uppercase tracking-wider font-display ml-1">
          {label}
        </label>
      )}

      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-emerald-900/40 via-green-900/30 to-emerald-900/40"
        style={{ aspectRatio: "3/2" }}>

        <svg
          viewBox="0 0 600 400"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {[0,1,2,3,4,5].map(i => (
            <rect key={i} x={i * 100} y={0} width={100} height={400}
              fill={i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent"} />
          ))}

          <rect x="10" y="10" width="580" height="380" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" rx="2"/>
          <line x1="300" y1="10" x2="300" y2="390" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
          <circle cx="300" cy="200" r="55" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
          <circle cx="300" cy="200" r="3" fill="rgba(255,255,255,0.4)"/>

          <rect x="10" y="110" width="100" height="180" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
          <rect x="10" y="155" width="35" height="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <rect x="10" y="170" width="8" height="60" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
          <path d="M 110 160 A 55 55 0 0 1 110 240" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <circle cx="65" cy="200" r="3" fill="rgba(255,255,255,0.3)"/>

          <rect x="490" y="110" width="100" height="180" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
          <rect x="555" y="155" width="35" height="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <rect x="582" y="170" width="8" height="60" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
          <path d="M 490 160 A 55 55 0 0 0 490 240" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <circle cx="535" cy="200" r="3" fill="rgba(255,255,255,0.3)"/>

          <path d="M 10 22 A 12 12 0 0 1 22 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <path d="M 578 10 A 12 12 0 0 1 590 22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <path d="M 590 378 A 12 12 0 0 1 578 390" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <path d="M 22 390 A 12 12 0 0 1 10 378" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>

          <text x="560" y="395" fontSize="9" fill="rgba(255,255,255,0.3)" textAnchor="middle" fontFamily="sans-serif">ATTACK →</text>

          {PITCH_POSITIONS.map(pos => {
            const isSelected = value === pos.id;
            const isDisabled = disabledId === pos.id;
            return (
              <g key={pos.id}
                onClick={() => !isDisabled && onChange(isSelected ? "" : pos.id)}
                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}>

                {isSelected && (
                  <circle cx={pos.cx} cy={pos.cy} r={22} fill="none" stroke={ringColor} strokeWidth="3">
                    <animate attributeName="r" values="22;28;22" dur="1.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite"/>
                  </circle>
                )}

                <circle
                  cx={pos.cx} cy={pos.cy} r={isSelected ? 16 : 13}
                  fill={
                    isDisabled
                      ? "rgba(255,255,255,0.06)"
                      : isSelected
                        ? dotColor
                        : "rgba(255,255,255,0.15)"
                  }
                  stroke={
                    isDisabled
                      ? "rgba(255,255,255,0.15)"
                      : isSelected
                        ? dotStroke
                        : "rgba(255,255,255,0.5)"
                  }
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeDasharray={isDisabled ? "3 2" : undefined}
                  style={{ transition: "all 0.2s ease" }}
                />

                <text
                  x={pos.cx} y={pos.cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={pos.label.length > 2 ? "7.5" : "9"}
                  fontWeight="700"
                  fill={isDisabled ? "rgba(255,255,255,0.2)" : isSelected ? "#1a1a1a" : "white"}
                  fontFamily="sans-serif"
                  style={{ userSelect: "none" }}
                >
                  {pos.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/40 bg-black/30 px-3 py-1 rounded-full whitespace-nowrap font-medium tracking-wide pointer-events-none">
          Tap your position on the pitch
        </div>
      </div>

      {selectedPos ? (
        <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
          <div className="flex items-center gap-3 px-4 pt-3 pb-2">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <span className={`font-black text-xs font-display ${iconText}`}>{selectedPos.id}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm">{selectedPos.displayName}</div>
              <div className={`text-xs font-semibold uppercase tracking-wide ${archText}`}>{selectedPos.archetype}</div>
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-white/30 hover:text-white/70 transition-colors text-lg leading-none flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="px-4 pb-3 border-t border-white/10 pt-2 space-y-1">
            <p className="text-white/80 text-xs italic leading-relaxed">"{selectedPos.storyHook}"</p>
          </div>
        </div>
      ) : (
        <div className={`px-4 py-3 rounded-xl border text-sm text-white/40 italic ${error ? "border-red-500/40 bg-red-500/5" : "border-white/10 bg-white/5"}`}>
          {error ? <span className="text-red-400 not-italic font-medium">{error}</span> : "No position selected yet"}
        </div>
      )}
    </div>
  );
}
