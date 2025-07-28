import { NextRequest, NextResponse } from 'next/server';
import IndustryAnalysisService, { IndustryAnalysisResult } from '../../../services/industry-analysis';
import BusinessStrategyService, { BusinessStrategyResult } from '../../../services/business-strategy';
import crypto from 'crypto';

// Enhanced brainstorm result type
type EnhancedBrainstormResult = IndustryAnalysisResult & {
  businessStrategy?: BusinessStrategyResult;
};

// Cache for brainstorm results (24 hour expiry)
const brainstormCache = new Map<string, { data: EnhancedBrainstormResult; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function createBrainstormHash(industry: string, location: string, audience: string, description: string): string {
  const input = `${industry}-${location}-${audience}-${description}`;
  return crypto.createHash('md5').update(input).digest('hex');
}

function getCachedBrainstorm(hash: string): EnhancedBrainstormResult | null {
  const cached = brainstormCache.get(hash);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  if (cached) {
    brainstormCache.delete(hash); // Remove expired cache
  }
  return null;
}

function setCachedBrainstorm(hash: string, data: EnhancedBrainstormResult): void {
  brainstormCache.set(hash, { data, timestamp: Date.now() });
}

export async function POST(request: NextRequest) {
  try {
    const { industry, location, audience, description, forceFresh } = await request.json();

    if (!industry || !location || !audience) {
      return NextResponse.json(
        { error: 'Missing required fields: industry, location, audience' },
        { status: 400 }
      );
    }

    console.log('=== BRAINSTORM API REQUEST ===');
    console.log('Industry:', industry);
    console.log('Location:', location);
    console.log('Audience:', audience);
    console.log('Description:', description);
    console.log('Force Fresh:', forceFresh);

    // Create hash for caching
    const inputHash = createBrainstormHash(industry, location, audience, description || '');
    
    // Check cache unless forceFresh is requested
    if (!forceFresh) {
      const cachedResult = getCachedBrainstorm(inputHash);
      if (cachedResult) {
        console.log('Returning cached brainstorm result');
        return NextResponse.json(cachedResult);
      }
    } else {
      console.log('Force refresh requested, bypassing cache');
    }

    // Initialize services
    const analysisService = new IndustryAnalysisService();
    const businessStrategyService = new BusinessStrategyService();
    
    console.log('Starting comprehensive industry analysis...');
    
    // Perform the comprehensive analysis
    const analysisResult = await analysisService.analyzeIndustry(industry, description || '');
    
    console.log('Industry analysis completed');
    console.log('News articles found:', analysisResult.newsAnalysis.articles.length);
    console.log('Social posts analyzed:', analysisResult.socialSentiment.posts.length);
    console.log('Research papers found:', analysisResult.researchTrends.papers.length);
    console.log('Competitors analyzed:', analysisResult.competitorNews.companies.length);
    
    // Generate business strategy analysis
    console.log('Starting business strategy analysis...');
    const competitors = analysisResult.competitorNews.companies.map(c => c.name);
    const businessStrategy = await businessStrategyService.generateBusinessStrategy(
      description || `${industry} solution`,
      audience,
      industry,
      'early', // Default stage
      competitors
    );
    
    console.log('Business strategy analysis completed');
    console.log('Monetization models generated:', businessStrategy.monetizationModels.length);
    console.log('Customer acquisition strategies:', businessStrategy.customerAcquisition.length);
    
    // Combine results
    const enhancedResult: EnhancedBrainstormResult = {
      ...analysisResult,
      businessStrategy
    };
    
    // Cache the result
    setCachedBrainstorm(inputHash, enhancedResult);
    
    // Add metadata for frontend
    const response = {
      ...enhancedResult,
      metadata: {
        generatedAt: new Date().toISOString(),
        location,
        audience,
        cacheKey: inputHash,
        analysisType: 'comprehensive_industry_brainstorm_with_business_strategy'
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Brainstorm API error:', error);
    
    // Return a structured error response
    return NextResponse.json(
      {
        error: 'Failed to generate brainstorm analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: {
          industry: 'Unknown',
          newsAnalysis: {
            articles: [],
            overallSentiment: 'neutral' as const,
            sentimentScore: 0,
            keyTopics: ['Market Research Required'],
            riskIndicators: ['Data Unavailable']
          },
          socialSentiment: {
            posts: [],
            overallSentiment: 'neutral' as const,
            sentimentScore: 0,
            publicInterest: 'low' as const,
            trendingTopics: ['Analysis Pending']
          },
          researchTrends: {
            papers: [],
            emergingTechnologies: ['Research Required'],
            researchVolume: 'stable' as const
          },
          competitorNews: {
            companies: []
          },
          summary: {
            marketHealth: 'cautious' as const,
            opportunityScore: 50,
            riskScore: 50,
            recommendations: [
              'Verify API configurations and keys',
              'Conduct manual market research',
              'Validate with industry experts'
            ]
          }
        }
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'brainstorm-analysis',
    timestamp: new Date().toISOString(),
    cacheSize: brainstormCache.size,
    availableAPIs: {
      googleNews: !!process.env.GOOGLE_NEWS_API_KEY,
      eventRegistry: !!process.env.EVENT_REGISTRY_API_KEY,
      crunchbase: !!process.env.CRUNCHBASE_API_KEY,
      twitter: !!process.env.TWITTER_BEARER_TOKEN
    }
  });
}
