import { motion } from "framer-motion";

interface Props {
  surname: string;
  number: number;
  primaryColor: string;
  secondaryColor: string;
}

export function PlayerJersey({ surname, number, primaryColor, secondaryColor }: Props) {
  const displayName = surname.length > 10 ? surname.slice(0, 10) : surname;
  const textColor = secondaryColor === "#FFFFFF" || secondaryColor === "#ffffff" ? "#FFFFFF" : secondaryColor;

  return (
    <motion.div
      className="relative select-none"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Drop shadow beneath jersey */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-xl"
        style={{ backgroundColor: primaryColor, width: "70%", height: 18 }}
        animate={{ opacity: [0.35, 0.55, 0.35], scaleX: [1, 0.9, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        viewBox="0 0 220 260"
        xmlns="http://www.w3.org/2000/svg"
        className="w-44 h-auto drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="jersey-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="jersey-sleeve-l" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="jersey-sleeve-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.7" />
          </linearGradient>
          <filter id="jersey-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left sleeve */}
        <path
          d="M 72 48 L 18 90 L 30 112 L 68 88 L 68 52 Z"
          fill="url(#jersey-sleeve-l)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        {/* Left sleeve cuff stripe */}
        <path
          d="M 18 90 L 30 112 L 34 108 L 22 86 Z"
          fill={textColor}
          opacity="0.5"
        />

        {/* Right sleeve */}
        <path
          d="M 148 48 L 202 90 L 190 112 L 152 88 L 152 52 Z"
          fill="url(#jersey-sleeve-r)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        {/* Right sleeve cuff stripe */}
        <path
          d="M 202 90 L 190 112 L 186 108 L 198 86 Z"
          fill={textColor}
          opacity="0.5"
        />

        {/* Main jersey body */}
        <path
          d="M 68 48 L 68 240 L 152 240 L 152 48 L 140 42 C 128 54 92 54 80 42 Z"
          fill="url(#jersey-body)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />

        {/* Subtle vertical highlight (fabric sheen) */}
        <path
          d="M 100 55 L 100 235"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="18"
        />

        {/* Collar V-neck */}
        <path
          d="M 80 42 C 92 54 128 54 140 42 L 130 42 C 118 52 102 52 90 42 Z"
          fill={primaryColor}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Collar accent */}
        <path
          d="M 80 42 C 86 48 110 51 130 42"
          fill="none"
          stroke={textColor}
          strokeWidth="2.5"
          opacity="0.7"
        />

        {/* Shirt number */}
        <text
          x="110"
          y="158"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={number > 9 ? "72" : "80"}
          fontWeight="900"
          fontFamily="'Arial Black', 'Impact', sans-serif"
          fill={textColor}
          opacity="0.95"
          filter="url(#jersey-glow)"
        >
          {number}
        </text>

        {/* Player surname */}
        <text
          x="110"
          y="206"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={displayName.length > 7 ? "11" : "13"}
          fontWeight="700"
          fontFamily="'Arial', sans-serif"
          letterSpacing="3"
          fill={textColor}
          opacity="0.8"
        >
          {displayName.toUpperCase()}
        </text>

        {/* Bottom hem stripe */}
        <rect x="68" y="232" width="84" height="8" rx="0"
          fill={textColor} opacity="0.15" />
      </svg>
    </motion.div>
  );
}
