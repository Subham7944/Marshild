import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { industry, location, audience, description } = await request.json();

    if (!industry || !location || !audience) {
      return NextResponse.json(
        { error: 'Industry, location, and audience are required' },
        { status: 400 }
      );
    }

    // Generate deterministic data based on inputs for consistency
    const generateHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    const inputString = `${industry}-${location}-${audience}-${description || ''}`;
    const hash = generateHash(inputString);

    // Generate keywords based on industry and description
    const generateKeywords = () => {
      const baseKeywords = [industry.toLowerCase()];
      
      // Add industry-specific keywords
      const industryKeywords = {
        'technology': ['tech startup', 'software', 'app development', 'digital solution'],
        'healthcare': ['health tech', 'medical device', 'telemedicine', 'health app'],
        'fintech': ['financial technology', 'payment solution', 'banking app', 'cryptocurrency'],
        'ecommerce': ['online shopping', 'marketplace', 'retail tech', 'e-commerce platform'],
        'education': ['edtech', 'online learning', 'educational platform', 'learning app'],
        'food': ['food delivery', 'restaurant tech', 'food app', 'culinary platform'],
        'travel': ['travel tech', 'booking platform', 'travel app', 'tourism'],
        'fitness': ['fitness app', 'health tracking', 'workout platform', 'wellness tech'],
        'real estate': ['proptech', 'real estate platform', 'property management', 'housing app'],
        'entertainment': ['streaming platform', 'gaming', 'media tech', 'content platform']
      };

      const specificKeywords = industryKeywords[industry.toLowerCase()] || ['startup', 'business platform', 'digital service', 'tech solution'];
      
      // Add description-based keywords if available
      if (description) {
        const words = description.toLowerCase().split(' ');
        const relevantWords = words.filter(word => 
          word.length > 4 && 
          !['that', 'with', 'this', 'will', 'have', 'been', 'from', 'they', 'were', 'said', 'each', 'which', 'their'].includes(word)
        );
        baseKeywords.push(...relevantWords.slice(0, 2));
      }

      return [...baseKeywords, ...specificKeywords.slice(0, 3)];
    };

    const keywords = generateKeywords();

    // Generate trends data for each keyword
    const trendsData: any = {};
    keywords.forEach((keyword, index) => {
      const keywordHash = generateHash(keyword + inputString);
      const baseInterest = 25 + (keywordHash % 55); // Range 25-80
      const trendTypes = ['growing', 'stable', 'declining'];
      const currentTrend = trendTypes[keywordHash % trendTypes.length];
      
      trendsData[keyword] = {
        average_interest: baseInterest,
        peak_interest: baseInterest + 10 + (keywordHash % 20),
        current_trend: currentTrend,
        trend_score: currentTrend === 'growing' ? (keywordHash % 15) + 5 : 
                    currentTrend === 'declining' ? -((keywordHash % 12) + 3) : 
                    (keywordHash % 6) - 3,
        related_queries: [
          `${keyword} tools`,
          `${keyword} solutions`,
          `best ${keyword}`,
          `${keyword} platform`,
          `${keyword} app`
        ].slice(0, 3)
      };
    });

    // Generate market analysis
    const overallScore = Math.min(95, 45 + (hash % 45)); // Range 45-95
    const marketInterest = overallScore >= 75 ? 'high' : overallScore >= 55 ? 'moderate' : 'low';

    const marketAnalysis = {
      overall_score: overallScore,
      market_interest: marketInterest,
      key_insights: [
        `${industry} market shows ${marketInterest} search interest`,
        `Target audience in ${location} demonstrates active engagement`,
        `Keywords related to your concept have ${trendsData[keywords[0]]?.current_trend || 'stable'} trends`,
        `Market validation score: ${overallScore}/100`
      ],
      recommendations: [
        `Focus on ${keywords[0]} optimization for better market reach`,
        `Consider expanding to related keywords: ${keywords.slice(1, 3).join(', ')}`,
        marketInterest === 'high' ? 'Strong market validation - proceed with confidence' :
        marketInterest === 'moderate' ? 'Moderate validation - consider niche targeting' :
        'Low validation - pivot or refine your approach',
        `Leverage ${location} market opportunities for initial launch`
      ]
    };

    // Generate competitor insights
    const competitorInsights = {
      market_saturation: hash % 3 === 0 ? 'low' : hash % 3 === 1 ? 'moderate' : 'high',
      opportunity_score: Math.min(90, 30 + (hash % 50)),
      competitive_advantage: [
        'Unique positioning in target market',
        'Strong keyword opportunity',
        'Growing market demand',
        'Underserved audience segment'
      ].slice(0, 2 + (hash % 3))
    };

    const validationData = {
      industry,
      location,
      audience,
      description,
      timestamp: new Date().toISOString(),
      googleTrends: {
        keywords_analyzed: keywords,
        trends_data: trendsData,
        market_analysis: marketAnalysis,
        competitor_insights: competitorInsights,
        validation_summary: {
          overall_validation: marketInterest,
          confidence_score: overallScore,
          market_readiness: overallScore >= 70 ? 'Ready to launch' : 
                           overallScore >= 50 ? 'Needs refinement' : 'Requires pivot',
          next_steps: [
            'Conduct user interviews',
            'Build MVP prototype',
            'Test market assumptions',
            'Validate pricing strategy'
          ]
        }
      }
    };

    return NextResponse.json(validationData);

  } catch (error) {
    console.error('Validation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate validation analysis' },
      { status: 500 }
    );
  }
}