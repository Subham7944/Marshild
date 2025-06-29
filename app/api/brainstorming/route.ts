import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { industry, location, audience, description } = await request.json();

    if (!industry || !location || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a combined prompt for brainstorming analysis
    const prompt = `
    Conduct a strategic brainstorming session for a startup with the following details:
    Industry/Vertical: ${industry}
    Primary Market/Location: ${location}
    Target Audience: ${audience}
    Description: ${description || 'Not provided'}
    
    Please provide:
    
    1. Five viable monetization models appropriate for this business, including:
       - Name of the model
       - Brief description
       - Three pros
       - Three cons

    2. Five growth strategies/customer-acquisition tactics specific to this business, including:
       - Strategy name
       - Brief description
       - Three implementation steps
       - Rough timeframe (short/mid/long term)
       - Key resources needed

    3. Three key audience insights:
       - Specific audience segments
       - Pain points for each segment
       - Preferences/needs
       - Best channels to reach them
    
    Format the response as structured JSON with the following format:
    {
      "monetizationModels": [
        {
          "name": "Model Name",
          "description": "Brief description of the monetization model",
          "pros": ["Pro 1", "Pro 2", "Pro 3"],
          "cons": ["Con 1", "Con 2", "Con 3"]
        }
      ],
      "growthStrategies": [
        {
          "name": "Strategy Name",
          "description": "Brief description of the growth strategy",
          "implementationSteps": ["Step 1", "Step 2", "Step 3"],
          "timeframe": "Short/Medium/Long term",
          "resources": ["Resource 1", "Resource 2", "Resource 3"]
        }
      ],
      "audienceInsights": [
        {
          "segment": "Audience Segment Name",
          "painPoints": ["Pain Point 1", "Pain Point 2", "Pain Point 3"],
          "preferences": ["Preference 1", "Preference 2", "Preference 3"],
          "acquisitionChannels": ["Channel 1", "Channel 2", "Channel 3"]
        }
      ]
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
        { role: "system", content: "You are a strategic business consultant specializing in startup growth, monetization, and audience analysis. Provide accurate, actionable insights." },
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
    console.error('Brainstorming API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze startup strategy' },
      { status: 500 }
    );
  }
}
