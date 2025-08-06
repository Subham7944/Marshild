import { NextRequest, NextResponse } from 'next/server';

// Market research API route with mock data implementation

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

    // Generate mock market research data
    console.log('Generating mock market research data for:', { industry, location, audience });
    
    const mockData = {
      competitors: [
        {
          name: `${industry} Leader Inc`,
          description: `Leading company in ${industry} serving ${audience}`,
          foundingDate: "2018",
          funding: "Series B - $25M",
          url: `https://${industry.toLowerCase()}leader.com`
        },
        {
          name: `${audience} Solutions`,
          description: `Specialized platform for ${audience} in ${location}`,
          foundingDate: "2020",
          funding: "Series A - $12M",
          url: `https://${audience.toLowerCase()}solutions.com`
        },
        {
          name: `${location} ${industry} Co`,
          description: `Regional ${industry} company based in ${location}`,
          foundingDate: "2019",
          funding: "Seed - $3M",
          url: `https://${location.toLowerCase()}${industry.toLowerCase()}.com`
        }
      ],
      marketTrends: `The ${industry} market in ${location} is experiencing significant growth, particularly in segments targeting ${audience}. Key trends include digital transformation, increased demand for personalized solutions, and growing investment in technology infrastructure.`,
      marketPotential: `The market potential for ${industry} solutions targeting ${audience} in ${location} appears promising. With increasing digitization and changing consumer preferences, there are substantial opportunities for innovative startups. The market size is estimated to grow at 15-20% annually, with particular strength in the ${audience} segment.`
    };
    
    const parsedData = mockData;
    
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Market research API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze startup idea' },
      { status: 500 }
    );
  }
}
