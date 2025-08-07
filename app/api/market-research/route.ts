import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client - we'll use the API key directly in the route handler
// for better security practice in production, use environment variables

export async function POST(request: NextRequest) {
  try {
    const { industry, location, audience, description } = await request.json();

    if (!industry || !location || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a combined prompt for analysis
    const prompt = `
    Perform a market research analysis for a startup with the following details:
    Industry/Vertical: ${industry}
    Primary Market/Location: ${location}
    Target Audience: ${audience}
    Description: ${description || 'Not provided'}
    
    Please provide:
    1. A list of 5 top competitors in this space with their brief description, founding date, and funding information if known.
    2. Market trends in this industry.
    3. An overall evaluation of market potential in 2-3 paragraphs.
    
    Format the response as structured JSON with the following format:
    {
      "competitors": [
        {
          "name": "Company Name",
          "description": "Brief description",
          "foundingDate": "Year founded",
          "funding": "Funding information if available",
          "url": "Website URL if available"
        },
        // additional companies...
      ],
      "marketTrends": "Analysis of current market trends",
      "marketPotential": "Overall evaluation of market potential"
    }
    `;

    // Call OpenAI API with secure initialization using environment variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a market research expert specializing in startup analysis. Provide accurate, structured data about competitors and market trends." },
        { role: "user", content: prompt }
      ],
      model: "gpt-3.5-turbo-0125", // Using a cost-effective model
      response_format: { type: "json_object" },
    });

    // Extract and parse response
    const responseContent = completion.choices[0].message.content;
    const parsedData = JSON.parse(responseContent || '{}');
    
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Market research API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze startup idea' },
      { status: 500 }
    );
  }
}
