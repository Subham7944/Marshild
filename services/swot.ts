import { SWOTAnalysis, SWOTFormData } from '../types/swot';
import { analyzeMarketResearch } from './market-research';

/**
 * Calls the SWOT analysis API with market research context
 */
export async function getSWOTAnalysis(formData: SWOTFormData): Promise<SWOTAnalysis> {
  try {
    // First get market research data to enrich the SWOT analysis
    const marketResearchResult = await analyzeMarketResearch(formData);

    // Now call the SWOT API with the market research data
    const response = await fetch('/api/swot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        marketResearch: {
          competitors: marketResearchResult.competitors,
          marketTrends: marketResearchResult.marketTrends,
          marketPotential: marketResearchResult.marketPotential
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate SWOT analysis');
    }
    
    const data = await response.json();
    
    // Generate a unique ID for this SWOT analysis
    const swotResult: SWOTAnalysis = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...data
    };
    
    return swotResult;
  } catch (error) {
    console.error('Error generating SWOT analysis:', error);
    throw error;
  }
}
