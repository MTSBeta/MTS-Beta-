/**
 * Position-aware question blending utility.
 *
 * Strategy for "Your Football Mind" stage:
 *  1. Hybrid-pair questions (if a bank exists for the exact combination) — always first
 *  2. Primary-position questions — always included, labelled with primary position
 *  3. Secondary-position questions — included at 30% weighting, labelled with secondary position
 *  4. Universal questions (no positionIds) — always appended last
 *
 * The 70/30 split is applied to the position-specific bucket only.
 * Universal questions are always included in full and are not labelled.
 */

import type { JourneyQuestion } from "../data/questions";
import { HYBRID_QUESTION_BANKS } from "../data/hybridQuestions";

export interface BlendedQuestion extends JourneyQuestion {
  /**
   * Human-readable position label to display alongside the question.
   * Undefined for universal questions.
   */
  positionLabel?: string;
}

/** Returns the canonical key for a position pair (sorted alphabetically). */
function pairKey(a: string, b: string): string {
  return [a, b].sort().join("-");
}

export interface SelectionOptions {
  /** Primary position ID, e.g. "CB" */
  primaryPosition: string;
  /** Secondary position ID, e.g. "RB" — optional */
  secondaryPosition?: string | null;
  /** Display name for primary position, e.g. "Centre Back" */
  primaryLabel: string;
  /** Display name for secondary position, e.g. "Right Back" */
  secondaryLabel?: string;
  /**
   * Fraction of position-specific slots allocated to the primary position.
   * Default: 0.7 (70 primary / 30 secondary).
   * When secondaryPosition is absent, this is ignored (100% primary).
   */
  primaryWeight?: number;
}

/**
 * Blends position-specific questions for a stage given a player's positions.
 *
 * @param stageQuestions  The full question list for the stage (from questions.ts)
 * @param opts            Player position info and weighting preferences
 * @returns               Ordered, labelled question list ready to display
 */
export function selectPositionQuestions(
  stageQuestions: JourneyQuestion[],
  opts: SelectionOptions
): BlendedQuestion[] {
  const {
    primaryPosition,
    secondaryPosition,
    primaryLabel,
    secondaryLabel,
    primaryWeight = 0.7,
  } = opts;

  const hasSecondary = !!secondaryPosition && secondaryPosition !== primaryPosition;

  // ── Bucket questions ──────────────────────────────────────────────────────
  const universalQs: BlendedQuestion[] = [];
  const primaryQs: BlendedQuestion[] = [];
  const secondaryQs: BlendedQuestion[] = [];

  for (const q of stageQuestions) {
    const { positionIds } = q;

    if (!positionIds || positionIds.length === 0) {
      universalQs.push({ ...q, positionLabel: undefined });
      continue;
    }

    const matchesPrimary = positionIds.includes(primaryPosition);
    const matchesSecondary = hasSecondary && positionIds.includes(secondaryPosition!);

    if (matchesPrimary) {
      primaryQs.push({ ...q, positionLabel: primaryLabel });
    } else if (matchesSecondary) {
      secondaryQs.push({ ...q, positionLabel: secondaryLabel });
    }
    // Questions matching neither position are excluded.
  }

  // ── Hybrid questions ──────────────────────────────────────────────────────
  let hybridQs: BlendedQuestion[] = [];
  if (hasSecondary) {
    const bank = HYBRID_QUESTION_BANKS[pairKey(primaryPosition, secondaryPosition!)] ?? [];
    const hybridLabel = secondaryLabel
      ? `${primaryLabel} / ${secondaryLabel}`
      : primaryLabel;
    hybridQs = bank.map(q => ({ ...q, positionLabel: hybridLabel }));
  }

  // ── Apply 70/30 weighting to secondary questions ──────────────────────────
  //
  // We want: primaryCount / (primaryCount + secondaryCount) ≈ primaryWeight
  // Solving for secondaryCount: secondaryCount ≈ primaryCount * (1 - w) / w
  //
  // In practice each position typically has 1–2 questions so we use
  // a sensible minimum of 1 secondary question if one exists.
  let selectedSecondaryQs: BlendedQuestion[] = [];
  if (hasSecondary && secondaryQs.length > 0) {
    const totalPrimarySpecific = primaryQs.length + hybridQs.length;
    const secondaryWeight = 1 - primaryWeight;
    const idealSecondaryCount = Math.round(
      (totalPrimarySpecific * secondaryWeight) / primaryWeight
    );
    const secondaryCount = Math.max(1, Math.min(idealSecondaryCount, secondaryQs.length));
    selectedSecondaryQs = secondaryQs.slice(0, secondaryCount);
  }

  // ── Final order ───────────────────────────────────────────────────────────
  // Hybrid → Primary → Secondary (capped) → Universal
  return [
    ...hybridQs,
    ...primaryQs,
    ...selectedSecondaryQs,
    ...universalQs,
  ];
}
