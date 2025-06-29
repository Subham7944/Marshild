import { BrainstormingFormData, BrainstormingResult } from '../types/brainstorming';

/**
 * Call the brainstorming API with form data
 * @param formData The startup information to analyze
 * @returns Brainstorming results with monetization models, growth strategies, and audience insights
 */
export async function getBrainstormingInsights(formData: BrainstormingFormData): Promise<BrainstormingResult> {
  try {
    const response = await fetch('/api/brainstorming', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get brainstorming insights');
    }

    const data = await response.json();
    
    // Generate a unique ID for this brainstorming session
    const brainstormingResult: BrainstormingResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      monetizationModels: data.monetizationModels || [],
      growthStrategies: data.growthStrategies || [],
      audienceInsights: data.audienceInsights || [],
    };

    return brainstormingResult;
  } catch (error) {
    console.error('Error fetching brainstorming insights:', error);
    throw error;
  }
}
