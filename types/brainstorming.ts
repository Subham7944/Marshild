export interface MonetizationModel {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface GrowthStrategy {
  name: string;
  description: string;
  implementationSteps: string[];
  timeframe: string;
  resources: string[];
}

export interface AudienceInsight {
  segment: string;
  painPoints: string[];
  preferences: string[];
  acquisitionChannels: string[];
}

export interface BrainstormingResult {
  id: string;
  timestamp: number;
  monetizationModels: MonetizationModel[];
  growthStrategies: GrowthStrategy[];
  audienceInsights: AudienceInsight[];
}

export interface BrainstormingFormData {
  industry: string;
  location: string;
  audience: string;
  description: string;
}
