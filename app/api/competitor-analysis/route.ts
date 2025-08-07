import { NextRequest, NextResponse } from 'next/server';
import { crunchbaseService } from '../../../services/crunchbase-api';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Cache directory setup for competitor analysis
const COMPETITOR_CACHE_DIR = path.join(os.tmpdir(), 'marshild-competitor-cache');

// Ensure cache directory exists
if (!fs.existsSync(COMPETITOR_CACHE_DIR)) {
  fs.mkdirSync(COMPETITOR_CACHE_DIR, { recursive: true });
}

// Helper function to create a hash from input parameters
function createCompetitorHash(industry: string, location: string): string {
  const inputString = `${industry.toLowerCase().trim()}|${location.toLowerCase().trim()}`;
  return crypto.createHash('md5').update(inputString).digest('hex');
}

// Helper function to get cached competitor result
function getCachedCompetitors(hash: string): any | null {
  try {
    const cacheFile = path.join(COMPETITOR_CACHE_DIR, `${hash}.json`);
    if (fs.existsSync(cacheFile)) {
      const cachedData = fs.readFileSync(cacheFile, 'utf8');
      const parsed = JSON.parse(cachedData);
      
      // Check if cache is less than 7 days old (competitors change less frequently)
      const cacheAge = Date.now() - parsed.timestamp;
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (cacheAge < maxAge) {
        console.log(`Competitor cache hit for hash: ${hash}`);
        return parsed.data;
      } else {
        // Cache expired, remove file
        fs.unlinkSync(cacheFile);
        console.log(`Competitor cache expired for hash: ${hash}`);
      }
    }
  } catch (error) {
    console.error('Error reading competitor cache:', error);
  }
  return null;
}

// Helper function to save competitor result to cache
function saveCachedCompetitors(hash: string, data: any): void {
  try {
    const cacheFile = path.join(COMPETITOR_CACHE_DIR, `${hash}.json`);
    const cacheData = {
      timestamp: Date.now(),
      data: data
    };
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
    console.log(`Competitor cache saved for hash: ${hash}`);
  } catch (error) {
    console.error('Error saving competitor cache:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { industry, location, audience, description } = await request.json();

    if (!industry || !location) {
      return NextResponse.json(
        { error: 'Industry and location are required for competitor analysis' },
        { status: 400 }
      );
    }

    // Create hash for competitor caching (industry + location based)
    const competitorHash = createCompetitorHash(industry, location);
    
    // Check if we have cached competitor results
    const cachedCompetitors = getCachedCompetitors(competitorHash);
    if (cachedCompetitors) {
      console.log('Returning cached competitor analysis result');
      return NextResponse.json({
        competitors: cachedCompetitors,
        source: 'cached',
        message: 'Competitor data retrieved from cache'
      });
    }

    console.log(`Fetching fresh competitor data for ${industry} in ${location}`);

    // Try Crunchbase API first, then fallback to RapidAPI if needed
    let competitors;
    try {
      competitors = await crunchbaseService.searchCompanies(industry, location, 5);
      console.log(`Found ${competitors.length} competitors via Crunchbase API`);
    } catch (error) {
      console.log('Crunchbase API failed, trying RapidAPI...');
      try {
        competitors = await crunchbaseService.searchCompaniesViaRapidAPI(industry, location, 5);
        console.log(`Found ${competitors.length} competitors via RapidAPI`);
      } catch (rapidError) {
        console.log('RapidAPI also failed, using mock data');
        competitors = await crunchbaseService.searchCompanies(industry, location, 5);
      }
    }

    // Enhance competitor data with additional context
    const enhancedCompetitors = competitors.map(competitor => ({
      ...competitor,
      relevanceScore: calculateRelevanceScore(competitor, industry, audience),
      competitiveAdvantage: generateCompetitiveInsight(competitor, industry),
      threatLevel: assessThreatLevel(competitor)
    }));

    // Sort by relevance score
    enhancedCompetitors.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const result = {
      competitors: enhancedCompetitors,
      source: 'live',
      totalFound: enhancedCompetitors.length,
      searchCriteria: {
        industry,
        location,
        audience
      },
      analysis: {
        marketConcentration: analyzeMarketConcentration(enhancedCompetitors),
        fundingTrends: analyzeFundingTrends(enhancedCompetitors),
        competitiveGaps: identifyCompetitiveGaps(enhancedCompetitors, description)
      }
    };

    // Save to cache for future requests
    saveCachedCompetitors(competitorHash, enhancedCompetitors);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Competitor analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze competitors' },
      { status: 500 }
    );
  }
}

// Helper function to calculate relevance score
function calculateRelevanceScore(competitor: any, industry: string, audience: string): number {
  let score = 50; // Base score

  // Industry match
  if (competitor.categories?.some((cat: string) => 
    cat.toLowerCase().includes(industry.toLowerCase()) || 
    industry.toLowerCase().includes(cat.toLowerCase())
  )) {
    score += 30;
  }

  // Description relevance
  if (competitor.description.toLowerCase().includes(industry.toLowerCase())) {
    score += 20;
  }

  // Funding indicates market validation
  const fundingAmount = competitor.funding.replace(/[^0-9.]/g, '');
  if (parseFloat(fundingAmount) > 10) {
    score += 15;
  }

  // Recent activity (if founded recently)
  const foundingYear = parseInt(competitor.foundingDate);
  if (foundingYear >= 2018) {
    score += 10;
  }

  return Math.min(score, 100);
}

// Helper function to generate competitive insight
function generateCompetitiveInsight(competitor: any, industry: string): string {
  const insights = [
    `Strong player in ${industry} with ${competitor.funding} in funding`,
    `Established since ${competitor.foundingDate}, showing market longevity`,
    `Focus on ${competitor.categories?.join(', ') || industry} solutions`,
    `Well-funded competitor with proven market traction`
  ];

  return insights[Math.floor(Math.random() * insights.length)];
}

// Helper function to assess threat level
function assessThreatLevel(competitor: any): 'Low' | 'Medium' | 'High' {
  const fundingAmount = parseFloat(competitor.funding.replace(/[^0-9.]/g, '')) || 0;
  const foundingYear = parseInt(competitor.foundingDate) || 2020;
  const age = new Date().getFullYear() - foundingYear;

  if (fundingAmount > 50 && age > 3) return 'High';
  if (fundingAmount > 10 || age > 5) return 'Medium';
  return 'Low';
}

// Helper function to analyze market concentration
function analyzeMarketConcentration(competitors: any[]): string {
  const highFundingCount = competitors.filter(c => 
    parseFloat(c.funding.replace(/[^0-9.]/g, '')) > 50
  ).length;

  if (highFundingCount >= 3) {
    return 'High concentration - Market dominated by well-funded players';
  } else if (highFundingCount >= 1) {
    return 'Medium concentration - Mix of established and emerging players';
  } else {
    return 'Low concentration - Emerging market with opportunities';
  }
}

// Helper function to analyze funding trends
function analyzeFundingTrends(competitors: any[]): string {
  const totalFunding = competitors.reduce((sum, c) => 
    sum + (parseFloat(c.funding.replace(/[^0-9.]/g, '')) || 0), 0
  );
  const avgFunding = totalFunding / competitors.length;

  if (avgFunding > 50) {
    return 'High funding activity - Investors are confident in this market';
  } else if (avgFunding > 10) {
    return 'Moderate funding activity - Growing investor interest';
  } else {
    return 'Early-stage funding - Market still developing';
  }
}

// Helper function to identify competitive gaps
function identifyCompetitiveGaps(competitors: any[], description: string): string[] {
  const gaps = [
    'Focus on underserved customer segments',
    'Leverage emerging technologies (AI/ML)',
    'Improve user experience and accessibility',
    'Offer more competitive pricing models',
    'Target specific geographic markets',
    'Develop niche specializations'
  ];

  // Return 2-3 relevant gaps
  return gaps.slice(0, 3);
}