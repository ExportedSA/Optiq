/**
 * Attribution Weight Calculator
 * 
 * Calculates attribution weights for different models
 */

import "server-only";
import type { AttributionModel } from "@prisma/client";

export interface TouchPointForAttribution {
  id: string;
  occurredAt: Date;
  position: number;
}

export interface AttributionWeight {
  touchPointId: string;
  weight: number;
}

/**
 * Calculate attribution weights for a set of touchpoints
 */
export function calculateAttributionWeights(
  touchPoints: TouchPointForAttribution[],
  model: AttributionModel
): AttributionWeight[] {
  if (touchPoints.length === 0) {
    return [];
  }

  switch (model) {
    case "LAST_TOUCH":
      return calculateLastTouchWeights(touchPoints);
    
    case "LINEAR":
      return calculateLinearWeights(touchPoints);
    
    case "FIRST_TOUCH":
      return calculateFirstTouchWeights(touchPoints);
    
    case "TIME_DECAY":
      return calculateTimeDecayWeights(touchPoints);
    
    case "POSITION_BASED":
      return calculatePositionBasedWeights(touchPoints);
    
    default:
      throw new Error(`Unsupported attribution model: ${model}`);
  }
}

/**
 * LAST_TOUCH: 100% credit to the last touchpoint
 */
function calculateLastTouchWeights(
  touchPoints: TouchPointForAttribution[]
): AttributionWeight[] {
  return touchPoints.map((tp, index) => ({
    touchPointId: tp.id,
    weight: index === touchPoints.length - 1 ? 1.0 : 0.0,
  }));
}

/**
 * FIRST_TOUCH: 100% credit to the first touchpoint
 */
function calculateFirstTouchWeights(
  touchPoints: TouchPointForAttribution[]
): AttributionWeight[] {
  return touchPoints.map((tp, index) => ({
    touchPointId: tp.id,
    weight: index === 0 ? 1.0 : 0.0,
  }));
}

/**
 * LINEAR: Equal credit across all touchpoints
 */
function calculateLinearWeights(
  touchPoints: TouchPointForAttribution[]
): AttributionWeight[] {
  const weight = 1.0 / touchPoints.length;
  
  return touchPoints.map(tp => ({
    touchPointId: tp.id,
    weight,
  }));
}

/**
 * TIME_DECAY: More credit to recent touchpoints
 * Uses exponential decay with 7-day half-life
 */
function calculateTimeDecayWeights(
  touchPoints: TouchPointForAttribution[]
): AttributionWeight[] {
  if (touchPoints.length === 1) {
    return [{ touchPointId: touchPoints[0].id, weight: 1.0 }];
  }

  const HALF_LIFE_DAYS = 7;
  const conversionTime = touchPoints[touchPoints.length - 1].occurredAt.getTime();

  // Calculate decay factor for each touchpoint
  const decayFactors = touchPoints.map(tp => {
    const daysSinceTouch = (conversionTime - tp.occurredAt.getTime()) / (1000 * 60 * 60 * 24);
    return Math.pow(0.5, daysSinceTouch / HALF_LIFE_DAYS);
  });

  // Normalize to sum to 1.0
  const totalDecay = decayFactors.reduce((sum, factor) => sum + factor, 0);

  return touchPoints.map((tp, index) => ({
    touchPointId: tp.id,
    weight: decayFactors[index] / totalDecay,
  }));
}

/**
 * POSITION_BASED: U-shaped distribution
 * 40% to first, 20% to middle touchpoints (split evenly), 40% to last
 */
function calculatePositionBasedWeights(
  touchPoints: TouchPointForAttribution[]
): AttributionWeight[] {
  if (touchPoints.length === 1) {
    return [{ touchPointId: touchPoints[0].id, weight: 1.0 }];
  }

  if (touchPoints.length === 2) {
    return [
      { touchPointId: touchPoints[0].id, weight: 0.5 },
      { touchPointId: touchPoints[1].id, weight: 0.5 },
    ];
  }

  const middleCount = touchPoints.length - 2;
  const middleWeight = 0.2 / middleCount;

  return touchPoints.map((tp, index) => {
    if (index === 0) {
      return { touchPointId: tp.id, weight: 0.4 }; // First
    } else if (index === touchPoints.length - 1) {
      return { touchPointId: tp.id, weight: 0.4 }; // Last
    } else {
      return { touchPointId: tp.id, weight: middleWeight }; // Middle
    }
  });
}

/**
 * Validate that weights sum to approximately 1.0
 */
export function validateWeights(weights: AttributionWeight[]): boolean {
  if (weights.length === 0) {
    return true;
  }

  const sum = weights.reduce((total, w) => total + w.weight, 0);
  const epsilon = 0.0001; // Allow small floating point errors

  return Math.abs(sum - 1.0) < epsilon;
}
