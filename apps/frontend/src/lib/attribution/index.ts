export {
  recordTouchPoint,
  linkConversionToTouchPoints,
  matchTouchPointsToCampaigns,
  getAttributionForConversion,
} from "./linker";

export {
  extractClickIds,
  inferPlatformFromClickId,
} from "./types";

export type {
  AttributionModel,
  TouchPointData,
  ConversionData,
  AttributionLinkInput,
} from "./types";

export {
  AttributionService,
  attributionService,
  coreModels,
  registerModel,
  getModel,
  getAllModels,
} from "./service";

export type {
  AttributionConfig,
  AttributionResult,
  ConversionAttributionSummary,
  TouchPointSummary,
  TouchPointAttribution,
} from "./service";

export {
  type AttributionModelStrategy,
  FirstTouchModel,
  LastTouchModel,
  LinearModel,
  TimeDecayModel,
  PositionBasedModel,
  AnyTouchModel,
  defaultModels,
} from "./models";
