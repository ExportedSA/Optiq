import "server-only";

import type { TouchPointData, AttributionModel } from "./types";

export interface AttributionModelStrategy {
  readonly name: AttributionModel;
  readonly displayName: string;
  readonly description: string;
  computeWeights(touchPoints: TouchPointData[]): number[];
}

export class FirstTouchModel implements AttributionModelStrategy {
  readonly name: AttributionModel = "FIRST_TOUCH";
  readonly displayName = "First Touch";
  readonly description = "100% credit to the first touchpoint";

  computeWeights(touchPoints: TouchPointData[]): number[] {
    if (touchPoints.length === 0) return [];
    return touchPoints.map((_, i) => (i === 0 ? 1 : 0));
  }
}

export class LastTouchModel implements AttributionModelStrategy {
  readonly name: AttributionModel = "LAST_TOUCH";
  readonly displayName = "Last Touch";
  readonly description = "100% credit to the last touchpoint";

  computeWeights(touchPoints: TouchPointData[]): number[] {
    const n = touchPoints.length;
    if (n === 0) return [];
    return touchPoints.map((_, i) => (i === n - 1 ? 1 : 0));
  }
}

export class LinearModel implements AttributionModelStrategy {
  readonly name: AttributionModel = "LINEAR";
  readonly displayName = "Linear";
  readonly description = "Equal credit distributed across all touchpoints";

  computeWeights(touchPoints: TouchPointData[]): number[] {
    const n = touchPoints.length;
    if (n === 0) return [];
    return touchPoints.map(() => 1 / n);
  }
}

export class TimeDecayModel implements AttributionModelStrategy {
  readonly name: AttributionModel = "TIME_DECAY";
  readonly displayName = "Time Decay";
  readonly description =
    "More credit to touchpoints closer to conversion (7-day half-life)";

  private readonly decayRate = 0.5;
  private readonly halfLifeMs = 7 * 24 * 60 * 60 * 1000;

  computeWeights(touchPoints: TouchPointData[]): number[] {
    const n = touchPoints.length;
    if (n === 0) return [];

    const lastTs = touchPoints[n - 1].occurredAt.getTime();
    const rawWeights = touchPoints.map((tp) => {
      const age = lastTs - tp.occurredAt.getTime();
      return Math.pow(this.decayRate, age / this.halfLifeMs);
    });

    const sum = rawWeights.reduce((a, b) => a + b, 0);
    return rawWeights.map((w) => w / sum);
  }
}

export class PositionBasedModel implements AttributionModelStrategy {
  readonly name: AttributionModel = "POSITION_BASED";
  readonly displayName = "Position Based (U-Shaped)";
  readonly description =
    "40% to first, 40% to last, 20% distributed to middle touchpoints";

  computeWeights(touchPoints: TouchPointData[]): number[] {
    const n = touchPoints.length;
    if (n === 0) return [];
    if (n === 1) return [1];
    if (n === 2) return [0.5, 0.5];

    const firstLast = 0.4;
    const middle = 0.2 / (n - 2);

    return touchPoints.map((_, i) => {
      if (i === 0 || i === n - 1) return firstLast;
      return middle;
    });
  }
}

export class AnyTouchModel implements AttributionModelStrategy {
  readonly name: AttributionModel = "LINEAR";
  readonly displayName = "Any Touch (Multi-Touch)";
  readonly description =
    "Equal credit to all touchpoints that contributed to conversion";

  computeWeights(touchPoints: TouchPointData[]): number[] {
    const n = touchPoints.length;
    if (n === 0) return [];
    return touchPoints.map(() => 1 / n);
  }
}

const modelRegistry = new Map<AttributionModel, AttributionModelStrategy>();

export function registerModel(model: AttributionModelStrategy): void {
  modelRegistry.set(model.name, model);
}

export function getModel(name: AttributionModel): AttributionModelStrategy {
  const model = modelRegistry.get(name);
  if (!model) {
    throw new Error(`Attribution model "${name}" not registered`);
  }
  return model;
}

export function getAllModels(): AttributionModelStrategy[] {
  return Array.from(modelRegistry.values());
}

export function hasModel(name: AttributionModel): boolean {
  return modelRegistry.has(name);
}

registerModel(new FirstTouchModel());
registerModel(new LastTouchModel());
registerModel(new LinearModel());
registerModel(new TimeDecayModel());
registerModel(new PositionBasedModel());

export const defaultModels: AttributionModel[] = [
  "FIRST_TOUCH",
  "LAST_TOUCH",
  "LINEAR",
  "TIME_DECAY",
  "POSITION_BASED",
];

export const coreModels = {
  firstTouch: new FirstTouchModel(),
  lastTouch: new LastTouchModel(),
  linear: new LinearModel(),
  timeDecay: new TimeDecayModel(),
  positionBased: new PositionBasedModel(),
  anyTouch: new AnyTouchModel(),
};
