import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { industry, location, audience, description, marketResearch } = await request.json();

    if (!industry || !location || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Initialize OpenAI API with secure key from environment variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OpenAI API key');
      return NextResponse.json(
        { error: 'Configuration error. Please contact support.' },
        { status: 500 }
      );
    }
    
    // Format competitors data for the prompt
    const competitorsInfo = marketResearch?.competitors 
      ? marketResearch.competitors.map((c: any) => 
          `${c.name}: ${c.description} (Founded: ${c.foundingDate}, Funding: ${c.funding || 'Unknown'})`
        ).join('\n')
      : 'No competitor data available';
    
    // Create system message with market research context
    const systemMessage = `
    You are a strategic business consultant specialized in SWOT analysis.
    You have access to the following market research data to inform your analysis:
    
    COMPETITORS:
    ${competitorsInfo}
    
    MARKET TRENDS:
    ${marketResearch?.marketTrends || 'No market trends data available'}
    
    MARKET POTENTIAL:
    ${marketResearch?.marketPotential || 'No market potential data available'}
    
    Based on this data and the user's startup information, provide a comprehensive SWOT analysis.
    Format your response as structured JSON with titles and descriptions for each point.
    `;
    
    // User message with startup details
    const userMessage = `
    Generate a detailed SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for a startup with the following details:
    Industry/Vertical: ${industry}
    Primary Market/Location: ${location}
    Target Audience: ${audience}
    ${description ? `Description: ${description}` : ''}
    
    For each category (strengths, weaknesses, opportunities, threats), provide 4-5 items.
    Each item should have a short title and a more detailed description explaining the strategic implication.
    
    Return ONLY a JSON object with this exact structure:
    {
      "strengths": [
        { "title": "Short Title", "description": "Detailed explanation" },
        ...
      ],
      "weaknesses": [...],
      "opportunities": [...],
      "threats": [...]
    }
    `;
    
    // Call OpenAI API with enriched context
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });
    
    // Extract and parse the JSON response
    const responseContent = completion.choices[0]?.message?.content || '{}';
    const swotData = JSON.parse(responseContent);
    
    return NextResponse.json(swotData);
  } catch (error: any) {
    console.error('SWOT Analysis API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate SWOT analysis' },
      { status: 500 }
    );
  }
}
