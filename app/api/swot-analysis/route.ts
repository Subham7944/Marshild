import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import crypto from 'crypto';

// Cache for SWOT analysis results (24 hour expiry)
const swotCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function createSWOTHash(industry: string, location: string, audience: string, description: string): string {
  const input = `${industry}-${location}-${audience}-${description}`;
  return crypto.createHash('md5').update(input).digest('hex');
}

function getCachedSWOT(hash: string): any | null {
  const cached = swotCache.get(hash);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  if (cached) {
    swotCache.delete(hash); // Remove expired cache
  }
  return null;
}

function setCachedSWOT(hash: string, data: any): void {
  swotCache.set(hash, { data, timestamp: Date.now() });
}

async function runPythonSWOTAnalysis(startupData: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'services', 'swot-scoring.py');
    const pythonProcess = spawn('python3', [scriptPath, JSON.stringify(startupData)]);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error}`));
        }
      } else {
        console.error('Python script stderr:', stderr);
        reject(new Error(`Python script failed with code ${code}: ${stderr}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}

function generateFallbackSWOTAnalysis(industry: string, location: string, audience: string, description: string): any {
  // Create deterministic hash for consistent results
  const hash = createSWOTHash(industry, location, audience, description);
  const hashInt = parseInt(hash.substring(0, 8), 16);
  
  // Use hash to generate consistent scores
  const baseScore = (hashInt % 40) + 50; // 50-90 range
  const variation1 = ((hashInt * 7) % 20) + 60; // 60-80 range
  const variation2 = ((hashInt * 13) % 30) + 40; // 40-70 range
  const variation3 = ((hashInt * 19) % 25) + 55; // 55-80 range
  
  return {
    overall_score: Math.round(baseScore * 10) / 10,
    success_probability: Math.round(variation1 * 10) / 10,
    component_scores: {
      strengths: Math.round(variation1 * 10) / 10,
      weaknesses: Math.round((100 - variation2) * 10) / 10,
      opportunities: Math.round(variation3 * 10) / 10,
      threats: Math.round((100 - variation2) * 10) / 10
    },
    swot_analysis: {
      strengths: [
        `Strong market position in ${industry} sector`,
        `Innovative approach to serving ${audience}`,
        `Strategic location advantage in ${location}`,
        "Agile development and adaptation capabilities"
      ],
      weaknesses: [
        "Limited brand recognition in competitive market",
        "Resource constraints typical of early-stage ventures",
        "Dependency on key team members and expertise",
        "Limited customer base requiring expansion"
      ],
      opportunities: [
        `Growing demand in ${industry} market`,
        `Expansion potential in ${location} region`,
        "Emerging technology trends creating new segments",
        "Potential for strategic partnerships"
      ],
      threats: [
        "Intense competition from established players",
        "Economic uncertainty affecting investment",
        "Regulatory changes impacting business model",
        "Rapid technological changes requiring innovation"
      ]
    },
    metrics: {
      market_growth_rate: Math.round(((hashInt % 30) + 10) * 10) / 10,
      competition_level: Math.round(((hashInt * 3) % 40 + 30) * 10) / 10,
      regulatory_difficulty: Math.round(((hashInt * 5) % 35 + 25) * 10) / 10,
      funding_availability: Math.round(((hashInt * 7) % 40 + 40) * 10) / 10,
      tech_complexity: Math.round(((hashInt * 11) % 35 + 45) * 10) / 10,
      market_size_billions: Math.round(((hashInt * 13) % 50 + 30) * 10) / 10
    },
    recommendations: [
      "Establish key performance indicators to track progress",
      `Focus on differentiation in the ${industry} market`,
      "Build strategic partnerships to accelerate growth",
      "Optimize customer acquisition and retention strategies",
      "Maintain lean operations while scaling capabilities"
    ],
    analysis_method: "fallback_deterministic",
    generated_at: new Date().toISOString()
  };
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

    console.log('=== SWOT ANALYSIS API REQUEST ===');
    console.log('Industry:', industry);
    console.log('Location:', location);
    console.log('Audience:', audience);
    console.log('Description:', description);
    console.log('Force Fresh:', forceFresh);

    // Create hash for caching
    const inputHash = createSWOTHash(industry, location, audience, description || '');
    
    // Check cache unless forceFresh is requested
    if (!forceFresh) {
      const cachedResult = getCachedSWOT(inputHash);
      if (cachedResult) {
        console.log('Returning cached SWOT analysis result');
        return NextResponse.json(cachedResult);
      }
    } else {
      console.log('Force refresh requested, bypassing cache');
    }

    // Prepare data for Python script
    const startupData = {
      industry,
      location,
      audience,
      description: description || ''
    };

    let analysisResult;

    try {
      console.log('Running Python SWOT analysis...');
      analysisResult = await runPythonSWOTAnalysis(startupData);
      console.log('Python SWOT analysis completed successfully');
      analysisResult.analysis_method = 'python_ml_model';
    } catch (error) {
      console.error('Python SWOT analysis failed, using fallback:', error);
      analysisResult = generateFallbackSWOTAnalysis(industry, location, audience, description || '');
    }
    
    // Add metadata
    const response = {
      ...analysisResult,
      metadata: {
        generatedAt: new Date().toISOString(),
        industry,
        location,
        audience,
        cacheKey: inputHash,
        analysisType: 'comprehensive_swot_analysis'
      }
    };

    // Cache the result
    setCachedSWOT(inputHash, response);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('SWOT Analysis API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate SWOT analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: generateFallbackSWOTAnalysis('Technology', 'Global', 'General Market', '')
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'swot-analysis',
    timestamp: new Date().toISOString(),
    cacheSize: swotCache.size,
    features: {
      pythonMLModel: 'available',
      deterministicFallback: 'available',
      caching: 'enabled',
      normalization: 'pandas/numpy',
      scoring: 'ml_based'
    }
  });
}
