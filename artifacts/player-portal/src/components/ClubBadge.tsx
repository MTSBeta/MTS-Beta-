import type { AcademyConfig } from "@/data/academies";

interface ClubBadgeProps {
  academy: AcademyConfig;
  size?: number;
  selected?: boolean;
}

export function ClubBadge({ academy, size = 56, selected = false }: ClubBadgeProps) {
  const { primaryColor, secondaryColor, accentColor, logoText } = academy;

  const isLight = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  };

  const textColor = isLight(primaryColor) ? (accentColor ?? "#000000") : secondaryColor;
  const fontSize = logoText.length <= 3 ? size * 0.22 : logoText.length <= 4 ? size * 0.18 : size * 0.14;

  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: selected ? `drop-shadow(0 0 ${size * 0.18}px ${primaryColor}aa)` : "none" }}
    >
      {/* Shield outer (border/trim) */}
      <path
        d="M50 4 L8 18 L8 58 C8 80 27 98 50 111 C73 98 92 80 92 58 L92 18 Z"
        fill={secondaryColor}
      />
      {/* Shield inner fill */}
      <path
        d="M50 10 L14 22 L14 58 C14 77 30 93 50 105 C70 93 86 77 86 58 L86 22 Z"
        fill={primaryColor}
      />
      {/* Diagonal stripe accent (optional, using accentColor if exists) */}
      {accentColor && accentColor !== secondaryColor && accentColor !== primaryColor && (
        <path
          d="M14 48 L86 30 L86 40 L14 58 Z"
          fill={accentColor}
          opacity="0.25"
        />
      )}
      {/* Emblem text */}
      <text
        x="50"
        y="64"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={fontSize}
        fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif"
        fontWeight="900"
        letterSpacing="0.5"
      >
        {logoText}
      </text>
    </svg>
  );
}
