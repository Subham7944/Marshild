"use client";

import { useState } from 'react';

export default function CompetitorAnalysis({ industry, location, audience, description }) {
  const [competitors, setCompetitors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisData, setAnalysisData] = useState(null);

  const handleCompetitorAnalysis = async () => {
    if (!industry || !location) {
      setError('Industry and location are required for competitor analysis');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, location, audience, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze competitors');
      }

      const data = await response.json();
      setCompetitors(data.competitors);
      setAnalysisData(data.analysis);
    } catch (error) {
      setError(error.message || 'Failed to analyze competitors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Competitor Analysis Trigger */}
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-xl font-semibold leading-none tracking-tight">🏢 Competitor Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Get real-time data on your main competitors using Crunchbase API - including funding, founding dates, and investor information.
          </p>
        </div>
        <div className="p-6 pt-0">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <button
            onClick={handleCompetitorAnalysis}
            disabled={isLoading || !industry || !location}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-md font-medium hover:from-purple-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Analyzing Competitors...
              </div>
            ) : (
              '🔍 Analyze Competitors (Crunchbase API)'
            )}
          </button>

          {!industry || !location ? (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please provide industry and location information to enable competitor analysis
            </p>
          ) : null}
        </div>
      </div>

      {/* Competitor Results */}
      {competitors && (
        <div className="space-y-6">
          {/* Analysis Summary */}
          {analysisData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">Market Concentration</h4>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">{analysisData.marketConcentration}</p>
              </div>
              <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">Funding Trends</h4>
                <p className="text-xs text-green-600 dark:text-green-300 mt-1">{analysisData.fundingTrends}</p>
              </div>
              <div className="border rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                <h4 className="font-semibold text-sm text-purple-800 dark:text-purple-200">Opportunities</h4>
                <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                  {analysisData.competitiveGaps?.join(', ') || 'Multiple opportunities identified'}
                </p>
              </div>
            </div>
          )}

          {/* Competitors List */}
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-xl font-semibold leading-none tracking-tight">
                🏆 Top Competitors ({competitors.length} found)
              </h3>
              <p className="text-sm text-muted-foreground">
                Real competitor data from Crunchbase API
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 gap-6">
                {competitors.map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {competitor.name}
                          </h4>
                          {competitor.threatLevel && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              competitor.threatLevel === 'High' ? 'bg-red-100 text-red-800' :
                              competitor.threatLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {competitor.threatLevel} Threat
                            </span>
                          )}
                          {competitor.relevanceScore && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {competitor.relevanceScore}% Match
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          {competitor.description}
                        </p>
                        {competitor.competitiveAdvantage && (
                          <p className="text-purple-600 dark:text-purple-400 text-sm italic mb-3">
                            💡 {competitor.competitiveAdvantage}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Founded:</span>
                        <p className="text-gray-600 dark:text-gray-400">{competitor.foundingDate}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Total Funding:</span>
                        <p className="text-green-600 dark:text-green-400 font-semibold">{competitor.funding}</p>
                      </div>
                      {competitor.latestFunding && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Latest Round:</span>
                          <p className="text-blue-600 dark:text-blue-400">
                            {competitor.latestFunding.type} - {competitor.latestFunding.amount}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Website:</span>
                        <a 
                          href={competitor.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Visit Site →
                        </a>
                      </div>
                    </div>

                    {/* Categories */}
                    {competitor.categories && competitor.categories.length > 0 && (
                      <div className="mt-4">
                        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Categories:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {competitor.categories.map((category, catIndex) => (
                            <span 
                              key={catIndex}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Investors */}
                    {competitor.investors && competitor.investors.length > 0 && (
                      <div className="mt-4">
                        <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Key Investors:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {competitor.investors.map((investor, invIndex) => (
                            <span 
                              key={invIndex}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded text-xs"
                            >
                              {investor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitive Gaps Analysis */}
          {analysisData?.competitiveGaps && (
            <div className="border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-6">
              <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                🎯 Competitive Opportunities
              </h4>
              <ul className="space-y-2">
                {analysisData.competitiveGaps.map((gap, index) => (
                  <li key={index} className="text-green-800 dark:text-green-200 flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
