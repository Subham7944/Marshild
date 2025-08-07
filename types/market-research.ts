export interface Competitor {
  name: string;
  description: string;
  foundingDate: string;
  funding: string;
  url?: string;
}

export interface MarketResearchResult {
  competitors: Competitor[];
  marketTrends: string;
  marketPotential: string;
}

export interface MarketResearchFormData {
  industry: string;
  location: string;
  audience: string;
  description?: string;
}
