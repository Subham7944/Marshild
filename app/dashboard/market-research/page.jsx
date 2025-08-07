"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useStartupIdea } from '../../../contexts/StartupIdeaContext.jsx';
import { getCachedAnalysis, setCachedAnalysis } from '../../../utils/cacheUtils.js';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import CrossPageNavigation from '../../../components/CrossPageNavigation';

export default function MarketResearchPage() {
  const { userId } = useAuth();
  const { user, isLoaded } = useUser();
  const [researchData, setResearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const researchId = searchParams.get('id');
  
  // Global startup idea context
  const { ideaData, updateIdeaData, isLoaded: contextLoaded, hasIdeaData } = useStartupIdea();

  const handleMarketResearch = async (e = null) => {
    if (e) e.preventDefault();
    
    if (!ideaData || !ideaData.industry || !ideaData.location) {
      setError('Please complete your startup idea on the dashboard first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/market-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: ideaData.industry,
          location: ideaData.location,
          audience: ideaData.audience,
          description: ideaData.description || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze market');
      }

      const data = await response.json();
      setResearchData(data);
      
      // Cache the results
      setCachedAnalysis(ideaData, 'market-research', data);
      
    } catch (error) {
      console.error('Market research error:', error);
      setError(error.message || 'Failed to analyze market. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run analysis when context loads with complete data
  useEffect(() => {
    if (contextLoaded && ideaData && !researchData && !isLoading) {
      // Check for cached results first
      if (ideaData.industry && ideaData.location && ideaData.audience) {
        const cachedResult = getCachedAnalysis(ideaData, 'market-research');
        if (cachedResult) {
          console.log('Loading cached market research results');
          setResearchData(cachedResult);
        } else {
          console.log('No cached results found, generating new analysis');
          handleMarketResearch();
        }
      }
    }
    
    // If we have a research ID, fetch the data from localStorage
    if (researchId && !researchData) {
      try {
        const storedData = localStorage.getItem(`market-research-${researchId}`);
        if (storedData) {
          setResearchData(JSON.parse(storedData));
        } else {
          setError("Research data not found");
        }
      } catch (err) {
        setError("Failed to load research data");
        console.error(err);
      }
    }
  }, [contextLoaded, ideaData, researchData, isLoading, researchId]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-1">📊 Market Research</h1>
          <p className="opacity-90">Comprehensive market analysis and competitor insights</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
              <span>Analyzing market data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasIdeaData) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-1">📊 Market Research</h1>
          <p className="opacity-90">Comprehensive market analysis and competitor insights</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              Startup Idea Required
            </CardTitle>
            <CardDescription>
              Please go back to the dashboard and fill out your startup idea details to begin market research.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !researchData) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-1">📊 Market Research</h1>
          <p className="opacity-90">Comprehensive market analysis and competitor insights</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleMarketResearch}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Generating...' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-1">📊 Market Research</h1>
        <p className="opacity-90">Comprehensive market analysis and competitor insights</p>
      </div>

      {/* Generate Research Button */}
      {!researchData && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Market Research</CardTitle>
            <CardDescription>
              Analyze market trends, competitors, and opportunities for your startup idea.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleMarketResearch}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🚀 Start Market Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Research Results */}
      {researchData && (
        <div className="space-y-6">
          {/* Competitors Section */}
          {researchData.competitors && researchData.competitors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏢</span>
                  Top Competitors ({researchData.competitors.length} found)
                </CardTitle>
                <CardDescription>
                  Key competitors in your market space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {researchData.competitors.map((competitor, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h3 className="text-xl font-bold">{competitor.name}</h3>
                      {competitor.url && (
                        <a 
                          href={competitor.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {competitor.url}
                        </a>
                      )}
                      <p className="my-2">{competitor.description}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="font-medium">Founded:</span> {competitor.foundingDate}
                        </div>
                        <div>
                          <span className="font-medium">Funding:</span> {competitor.funding}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Market Trends Section */}
          {researchData.marketTrends && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  Market Trends
                </CardTitle>
                <CardDescription>
                  Current trends and patterns in your industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line leading-relaxed">{researchData.marketTrends}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Market Potential Section */}
          {researchData.marketPotential && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  Market Potential
                </CardTitle>
                <CardDescription>
                  Market size, growth opportunities, and revenue potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line leading-relaxed">{researchData.marketPotential}</p>
              </CardContent>
            </Card>
          )}

          {/* Cross-Page Navigation */}
          <div className="mt-8">
            <CrossPageNavigation 
              currentPage="market-research"
              ideaData={ideaData}
              researchId={researchId}
            />
          </div>
        </div>
      )}
    </div>
  );
}