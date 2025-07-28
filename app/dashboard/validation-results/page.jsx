"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import CrossPageNavigation from '../../../components/CrossPageNavigation';

export default function ValidationResultsPage() {
  const { userId } = useAuth();
  const { user, isLoaded } = useUser();
  const [researchData, setResearchData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const researchId = searchParams.get('id');

  const refreshAnalysis = async () => {
    if (!researchId) return;

    console.log("--- 🔄 Refresh Analysis Started ---");
    setIsRefreshing(true);
    setError('');

    try {
      const storedData = localStorage.getItem(`validation-${researchId}`);
      if (!storedData) {
        console.error("LocalStorage Error: Original data not found for ID:", researchId);
        setError('Original data not found');
        return;
      }
      console.log("1. Found original data in localStorage:", storedData);
      const originalData = JSON.parse(storedData);

      const requestBody = {
        industry: originalData.industry || 'Technology',
        location: originalData.location || 'Global',
        audience: originalData.audience || 'General',
        description: originalData.description || '',
        forceFresh: true
      };
      console.log("2. Sending request to /api/validation with body:", requestBody);

      const response = await fetch('/api/validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log("3. Received response from API:", response);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to refresh analysis. Status: ${response.status}`);
      }

      const newData = await response.json();
      console.log("4. Parsed new data from API:", newData);

      localStorage.setItem(`validation-${researchId}`, JSON.stringify(newData));
      console.log("5. Updated localStorage with new data.");

      setResearchData(newData);
      console.log("6. Updated component state with new data.");

    } catch (error) {
      console.error("--- ❌ Refresh Analysis Failed ---", error);
      setError('Failed to refresh analysis: ' + error.message);
    } finally {
      setIsRefreshing(false);
      console.log("--- ✅ Refresh Analysis Finished ---");
    }
  };

  useEffect(() => {
    console.log("--- ⚡️ Validation Results Page Loading ---");
    if (researchId) {
      try {
        const storedData = localStorage.getItem(`validation-${researchId}`);
        console.log("1. Initial load from localStorage:", storedData);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("2. Parsed initial data:", parsedData);
          setResearchData(parsedData);
        } else {
          console.warn("No research data found in localStorage for ID:", researchId);
          setError("Research data not found");
        }
      } catch (err) {
        console.error("Failed to load or parse research data:", err);
        setError("Failed to load research data");
      }
    } else {
      console.error("No research ID provided in URL.");
      setError("No research ID provided");
    }
    
    setIsLoading(false);
    console.log("--- ✅ Page Load Finished ---");
  }, [researchId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  console.log("--- 🎨 Rendering Component ---");
  console.log("Current state - isLoading:", isLoading, "error:", error);
  console.log("Current researchData state:", researchData);
  if(researchData) {
    console.log("googleTrends object:", researchData.googleTrends);
    if(researchData.googleTrends) {
      console.log("keywords_analyzed array:", researchData.googleTrends.keywords_analyzed);
    }
  }

  if (error || !researchData) {
    return (
      <div className="p-6">
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-red-500">Error: {error || "No research data available"}</h2>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-16 md:pt-10">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-green-600 to-blue-500 p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">Validation Results</h1>
            <p className="opacity-90">Google Trends analysis and keyword insights for your startup idea</p>
          </div>
          <button
            onClick={refreshAnalysis}
            disabled={isRefreshing}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Refresh Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Google Trends Section */}
      {researchData.googleTrends && (
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📈</span>
              <h3 className="text-xl font-bold">Google Trends Analysis</h3>
            </div>



            {/* Market Analysis Score */}
            {researchData.googleTrends.market_analysis && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">Market Interest Score</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      researchData.googleTrends.market_analysis.market_interest === 'high' ? 'bg-green-100 text-green-800' :
                      researchData.googleTrends.market_analysis.market_interest === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {researchData.googleTrends.market_analysis.market_interest}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {researchData.googleTrends.market_analysis.overall_score}/100
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${researchData.googleTrends.market_analysis.overall_score}%` }}
                  ></div>
                </div>
                
                {/* Enhanced Key Insights */}
                {researchData.googleTrends.market_analysis.insights && researchData.googleTrends.market_analysis.insights.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      💡 Key Market Insights
                    </h5>
                    
                    {/* Primary Insights */}
                    <div className="space-y-3 mb-4">
                      {researchData.googleTrends.market_analysis.insights.map((insight, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="flex items-start gap-3">
                            <span className="text-blue-500 text-lg mt-0.5">📊</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                                {insight}
                              </p>
                              {/* Add detailed context based on insight content */}
                              {insight.toLowerCase().includes('stable') && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 pl-2 border-l-2 border-blue-200">
                                  <p><strong>Market Implication:</strong> Consistent search patterns indicate a mature, predictable market with steady demand.</p>
                                  <p><strong>Strategy:</strong> Focus on differentiation and quality rather than timing - the market is ready for your solution.</p>
                                </div>
                              )}
                              {insight.toLowerCase().includes('growing') && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 pl-2 border-l-2 border-green-200">
                                  <p><strong>Market Implication:</strong> Rising interest suggests expanding market opportunity and increasing consumer awareness.</p>
                                  <p><strong>Strategy:</strong> Capitalize on momentum with aggressive marketing and rapid market entry.</p>
                                </div>
                              )}
                              {insight.toLowerCase().includes('declining') && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 pl-2 border-l-2 border-red-200">
                                  <p><strong>Market Implication:</strong> Decreasing search volume may indicate market saturation or shifting consumer preferences.</p>
                                  <p><strong>Strategy:</strong> Consider pivoting approach or finding underserved niches within the market.</p>
                                </div>
                              )}
                              {insight.toLowerCase().includes('seasonal') && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 pl-2 border-l-2 border-yellow-200">
                                  <p><strong>Market Implication:</strong> Cyclical patterns require strategic timing for launches and marketing campaigns.</p>
                                  <p><strong>Strategy:</strong> Plan product launches and marketing spend around peak interest periods.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Additional Analysis */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h6 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center gap-2">
                        <span>🔍</span>
                        Detailed Market Analysis
                      </h6>
                      <div className="grid md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Search Volume Trends:</p>
                          <p className="text-indigo-600 dark:text-indigo-400">
                            Based on Google Trends data, your market shows {researchData.googleTrends.market_analysis.market_interest} interest levels 
                            with an overall market score of {researchData.googleTrends.market_analysis.overall_score}/100.
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Competitive Landscape:</p>
                          <p className="text-indigo-600 dark:text-indigo-400">
                            {researchData.googleTrends.market_analysis.overall_score >= 70 ? 
                              'High search volume indicates competitive market - focus on unique value proposition.' :
                              researchData.googleTrends.market_analysis.overall_score >= 40 ?
                              'Moderate competition suggests good market opportunity with room for new entrants.' :
                              'Low competition may indicate niche market or early-stage opportunity.'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Geographic Insights:</p>
                          <p className="text-indigo-600 dark:text-indigo-400">
                            Analysis covers {researchData.googleTrends.geo_region || 'global'} market trends, 
                            providing localized insights for your target geography.
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">Timing Considerations:</p>
                          <p className="text-indigo-600 dark:text-indigo-400">
                            Current market conditions suggest 
                            {researchData.googleTrends.market_analysis.market_interest === 'high' ? 'immediate action' :
                             researchData.googleTrends.market_analysis.market_interest === 'moderate' ? 'strategic entry timing' :
                             'careful market development'} for optimal results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Recommendations */}
                {researchData.googleTrends.market_analysis.recommendations && researchData.googleTrends.market_analysis.recommendations.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      🎯 Recommendations
                    </h5>
                    <ul className="space-y-1">
                      {researchData.googleTrends.market_analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Keywords Analyzed */}
            {researchData.googleTrends.keywords_analyzed && researchData.googleTrends.keywords_analyzed.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3">🔍 Keywords Analyzed</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {researchData.googleTrends.keywords_analyzed.map((keyword, index) => {
                    // Try multiple data sources for keyword data
                    let keywordData = researchData.googleTrends.trends_data?.[keyword];
                    
                    // Fallback: check if data is in a different structure
                    if (!keywordData && researchData.googleTrends.trends_data) {
                      // Look for the keyword in different possible formats
                      const possibleKeys = Object.keys(researchData.googleTrends.trends_data);
                      const matchingKey = possibleKeys.find(key => 
                        key.toLowerCase().includes(keyword.toLowerCase()) || 
                        keyword.toLowerCase().includes(key.toLowerCase())
                      );
                      if (matchingKey) {
                        keywordData = researchData.googleTrends.trends_data[matchingKey];
                      }
                    }
                    
                    // Debug logging
                    console.log(`=== KEYWORD ANALYSIS DEBUG ===`);
                    console.log(`Keyword: ${keyword}`);
                    console.log(`Direct lookup result:`, researchData.googleTrends.trends_data?.[keyword]);
                    console.log(`Final keywordData:`, keywordData);
                    console.log(`Available trends_data keys:`, Object.keys(researchData.googleTrends.trends_data || {}));
                    
                    // Generate mock data if no real data is available
                    if (!keywordData || (keywordData.error && !keywordData.average_interest)) {
                      // Create deterministic hash from keyword for consistent data
                      const keywordHash = keyword.split('').reduce((hash, char) => {
                        return ((hash << 5) - hash) + char.charCodeAt(0);
                      }, 0);
                      const absHash = Math.abs(keywordHash);
                      
                      // Use hash to generate consistent mock data
                      const mockTrends = ['growing', 'stable', 'declining'];
                      const mockTrend = mockTrends[absHash % mockTrends.length];
                      const baseInterest = 35 + (absHash % 45); // Consistent range 35-80
                      
                      keywordData = {
                        average_interest: baseInterest,
                        peak_interest: baseInterest + 10 + (absHash % 15),
                        current_trend: mockTrend,
                        trend_score: mockTrend === 'growing' ? (absHash % 12) + 3 : 
                                   mockTrend === 'declining' ? -((absHash % 10) + 2) : 0,
                        related_queries: [
                          `${keyword} tools`,
                          `${keyword} solutions`,
                          `best ${keyword}`
                        ],
                        is_mock: true
                      };
                      
                      console.log(`Generated consistent mock data for '${keyword}':`, keywordData);
                    }
                    
                    return (
                      <div key={index} className={`border rounded-lg p-4 ${
                        keywordData.is_mock ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : 'bg-white dark:bg-gray-800'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium capitalize">{keyword}</h5>
                            {keywordData.is_mock && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                                Demo
                              </span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            keywordData.current_trend === 'growing' ? 'bg-green-100 text-green-800' :
                            keywordData.current_trend === 'declining' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {keywordData.current_trend === 'growing' ? '📈' : keywordData.current_trend === 'declining' ? '📉' : '➡️'} 
                            {keywordData.current_trend}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Average Interest:</span>
                            <span className="font-medium">{keywordData.average_interest}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Peak Interest:</span>
                            <span className="font-medium">{keywordData.peak_interest}/100</span>
                          </div>
                          {keywordData.trend_score !== 0 && (
                            <div className="flex justify-between">
                              <span>Trend Score:</span>
                              <span className={`font-medium ${
                                keywordData.trend_score > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {keywordData.trend_score > 0 ? '+' : ''}{keywordData.trend_score.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Progress Bar for Average Interest */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                keywordData.current_trend === 'growing' ? 'bg-green-500' :
                                keywordData.current_trend === 'declining' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}
                              style={{ width: `${keywordData.average_interest}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Related Queries */}
                        {keywordData.related_queries && keywordData.related_queries.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h6 className="text-xs font-medium text-gray-600 mb-1">Related Searches:</h6>
                            <div className="flex flex-wrap gap-1">
                              {keywordData.related_queries.slice(0, 3).map((query, qIndex) => (
                                <span key={qIndex} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {query}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


          </div>
        </div>
      )}

      {/* Error Handling */}
      {researchData.googleTrends?.error && (
        <div className="border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600">⚠️</span>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Google Trends Data Unavailable</h4>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            {researchData.googleTrends.error}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            Please try again later or check your internet connection.
          </p>
        </div>
      )}

      {/* Cross-Page Navigation */}
      <div className="mt-8">
        <CrossPageNavigation 
          currentPage="validation-results"
          ideaData={researchData ? {
            industry: researchData.industry,
            location: researchData.location,
            audience: researchData.audience,
            description: researchData.description
          } : null}
          researchId={researchId}
        />
      </div>
    </div>
  );
}
