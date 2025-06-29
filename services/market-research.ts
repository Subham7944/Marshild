import { MarketResearchFormData, MarketResearchResult } from '../types/market-research';

/**
 * Calls the market research API to analyze a startup idea
 */
export async function analyzeMarketResearch(formData: MarketResearchFormData): Promise<MarketResearchResult> {
  try {
    const response = await fetch('/api/market-research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze startup idea');
    }
    
    const data = await response.json();
    
    // Generate a unique ID for this market research session
    const marketResearchResult: MarketResearchResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...data
    };
    
    return marketResearchResult;
  } catch (error) {
    console.error('Error analyzing startup:', error);
    throw error;
  }
}
