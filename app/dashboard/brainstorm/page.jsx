"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CrossPageNavigation from '../../../components/CrossPageNavigation';
import { useStartupIdea } from '../../../contexts/StartupIdeaContext.jsx';
import { getCachedAnalysis, setCachedAnalysis } from '../../../utils/cacheUtils.js';

export default function BrainstormPage() {
  // No form data needed - using context data directly
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Global startup idea context
  const { ideaData, updateIdeaData, isLoaded: contextLoaded, hasIdeaData, isComplete } = useStartupIdea();

  // Auto-run analysis when context loads with complete data
  useEffect(() => {
    if (contextLoaded && ideaData && !analysisResult && !isLoading) {
      // Check for cached results first
      if (ideaData.industry && ideaData.location && ideaData.audience) {
        const cachedResult = getCachedAnalysis(ideaData, 'brainstorm');
        if (cachedResult) {
          console.log('Loading cached brainstorm results');
          setAnalysisResult(cachedResult);
        } else {
          console.log('No cached results found, generating new analysis');
          handleSubmit();
        }
      }
    }
  }, [contextLoaded, ideaData, analysisResult, isLoading]);

  const handleSubmit = async (e = null) => {
    if (e) e.preventDefault();
    
    if (!ideaData || !ideaData.industry || !ideaData.location || !ideaData.audience) {
      setError('Please complete your startup idea on the dashboard first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Starting brainstorm analysis...');
      
      const response = await fetch('/api/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate analysis');
      }

      const result = await response.json();
      console.log('Brainstorm analysis completed:', result);
      
      setAnalysisResult(result);
      
      // Cache the results for this startup idea
      setCachedAnalysis(ideaData, 'brainstorm', result);
    } catch (error) {
      console.error('Brainstorm analysis failed:', error);
      setError(error.message || 'Failed to generate brainstorm analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAnalysis = async () => {
    if (!analysisResult) return;
    
    setIsRefreshing(true);
    setError('');

    try {
      const response = await fetch('/api/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ideaData,
          forceFresh: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh analysis');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      setError('Failed to refresh analysis: ' + error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 pt-16 md:pt-10">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">🧠 Industry Brainstorm</h1>
            <p className="opacity-90">Comprehensive market intelligence using news, social media, and research data</p>
          </div>
          {analysisResult && (
            <button
              onClick={refreshAnalysis}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
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
          )}
        </div>
      </div>

      {/* Analysis Status */}
      {!ideaData || !ideaData.industry || !ideaData.location || !ideaData.audience ? (
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold">Complete Your Startup Idea First</h3>
            <p className="text-gray-600">
              Please go back to the dashboard and fill out your startup idea details to generate a brainstorm analysis.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : !analysisResult && isLoading ? (
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6 text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <h3 className="text-xl font-semibold">Generating Brainstorm Analysis...</h3>
            <p className="text-gray-600">
              Analyzing industry trends and opportunities for <strong>{ideaData.industry}</strong> in <strong>{ideaData.location}</strong>
            </p>
          </div>
        </div>
      ) : error && !analysisResult ? (
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold text-red-600">Error</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : null}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary Overview */}
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                📊 Market Health Summary
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Market Health</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      analysisResult.summary.marketHealth === 'healthy' ? 'bg-green-100 text-green-800' :
                      analysisResult.summary.marketHealth === 'cautious' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysisResult.summary.marketHealth.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {analysisResult.summary.marketHealth === 'healthy' ? '💚' : 
                     analysisResult.summary.marketHealth === 'cautious' ? '💛' : '❤️'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Opportunity Score</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {analysisResult.summary.opportunityScore}/100
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.summary.opportunityScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Risk Score</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {analysisResult.summary.riskScore}/100
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.summary.riskScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                  🎯 Strategic Recommendations
                </h3>
                <ul className="space-y-1">
                  {analysisResult.summary.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* News Analysis */}
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                📰 Industry News Analysis
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Sentiment</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      analysisResult.newsAnalysis.overallSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      analysisResult.newsAnalysis.overallSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {analysisResult.newsAnalysis.overallSentiment === 'positive' ? '😊 POSITIVE' :
                       analysisResult.newsAnalysis.overallSentiment === 'negative' ? '😞 NEGATIVE' :
                       '😐 NEUTRAL'}
                    </span>
                  </div>
                  <div className="text-lg font-bold">
                    Score: {(analysisResult.newsAnalysis.sentimentScore * 100).toFixed(0)}/100
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">Articles Analyzed</div>
                  <div className="text-lg font-bold">{analysisResult.newsAnalysis.articles.length}</div>
                </div>
              </div>

              {/* Key Topics */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">🏷️ Key Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.newsAnalysis.keyTopics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Risk Indicators */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">⚠️ Risk Indicators</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.newsAnalysis.riskIndicators.map((risk, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {risk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Articles */}
              {analysisResult.newsAnalysis.articles.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">📄 Recent Articles</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {analysisResult.newsAnalysis.articles.slice(0, 5).map((article, index) => (
                      <div key={index} className="border rounded p-3 bg-white dark:bg-gray-800">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ml-2 ${
                            article.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                            article.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {article.sentiment}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                          {article.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{article.source}</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Sentiment */}
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                💬 Social Media Sentiment
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">Overall Sentiment</div>
                  <div className={`font-bold ${
                    analysisResult.socialSentiment.overallSentiment === 'positive' ? 'text-green-600' :
                    analysisResult.socialSentiment.overallSentiment === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {analysisResult.socialSentiment.overallSentiment.toUpperCase()}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">Public Interest</div>
                  <div className={`font-bold ${
                    analysisResult.socialSentiment.publicInterest === 'high' ? 'text-green-600' :
                    analysisResult.socialSentiment.publicInterest === 'medium' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {analysisResult.socialSentiment.publicInterest.toUpperCase()}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">Posts Analyzed</div>
                  <div className="font-bold">{analysisResult.socialSentiment.posts.length}</div>
                </div>
              </div>

              {/* Trending Topics */}
              <div>
                <h3 className="font-semibold mb-2">🔥 Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.socialSentiment.trendingTopics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Research Trends */}
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🔬 Research & Technology Trends
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">Research Volume</div>
                  <div className={`font-bold ${
                    analysisResult.researchTrends.researchVolume === 'increasing' ? 'text-green-600' :
                    analysisResult.researchTrends.researchVolume === 'stable' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {analysisResult.researchTrends.researchVolume.toUpperCase()}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">Papers Found</div>
                  <div className="font-bold">{analysisResult.researchTrends.papers.length}</div>
                </div>
              </div>

              {/* Emerging Technologies */}
              <div>
                <h3 className="font-semibold mb-2">🚀 Emerging Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.researchTrends.emergingTechnologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🏢 Competitor Intelligence
              </h2>
              
              {analysisResult.competitorNews.companies.length > 0 ? (
                <div className="space-y-4">
                  {analysisResult.competitorNews.companies.map((company, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{company.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {company.recentNews.length} articles
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {company.marketPosition}
                      </p>
                      
                      {company.fundingActivity.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Recent Funding: </span>
                          <span className="text-sm text-green-600">
                            {company.fundingActivity.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No competitor data available at this time.</p>
                  <p className="text-sm">Try refreshing the analysis or check API configurations.</p>
                </div>
              )}
            </div>
          </div>

          {/* Business Strategy Section */}
          {analysisResult.businessStrategy && (
            <>
              {/* Monetization Models */}
              <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    💰 Monetization Models
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    AI-generated revenue models tailored to your startup concept
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysisResult.businessStrategy.monetizationModels.map((model, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{model.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            model.viability === 'high' ? 'bg-green-100 text-green-800' :
                            model.viability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {model.viability.toUpperCase()} VIABILITY
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {model.description}
                        </p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Implementation:</span>
                            <span>{model.timeToImplement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Revenue:</span>
                            <span className="text-green-600">{model.revenueProjection}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Examples:</div>
                          <div className="flex flex-wrap gap-1">
                            {model.examples.map((example, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Acquisition Strategies */}
              <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🎯 Customer Acquisition Strategies
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Proven strategies to grow your customer base effectively
                  </p>
                  
                  <div className="space-y-4">
                    {analysisResult.businessStrategy.customerAcquisition.map((strategy, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{strategy.name}</h3>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              strategy.cost === 'low' ? 'bg-green-100 text-green-800' :
                              strategy.cost === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {strategy.cost.toUpperCase()} COST
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              strategy.effectiveness === 'high' ? 'bg-green-100 text-green-800' :
                              strategy.effectiveness === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {strategy.effectiveness.toUpperCase()} IMPACT
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {strategy.description}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium mb-1">Channels:</div>
                            <div className="flex flex-wrap gap-1">
                              {strategy.channels.map((channel, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                                  {channel}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-1">Key Metrics:</div>
                            <div className="flex flex-wrap gap-1">
                              {strategy.metrics.map((metric, i) => (
                                <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                                  {metric}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <span className="font-medium">Timeframe: </span>
                          <span className="text-gray-600 dark:text-gray-400">{strategy.timeframe}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Go-to-Market Strategy */}
              <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    🚀 Go-to-Market Strategy
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Phased approach to launching and scaling your startup
                  </p>
                  
                  <div className="space-y-6">
                    {analysisResult.businessStrategy.goToMarketStrategy.map((phase, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{phase.phase}</h3>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                            {phase.timeline}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium mb-2">Objectives:</div>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                              {phase.objectives.map((objective, i) => (
                                <li key={i}>{objective}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="font-medium mb-2">Key Tactics:</div>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                              {phase.tactics.map((tactic, i) => (
                                <li key={i}>{tactic}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium">Budget: </span>
                            <span className="text-green-600">{phase.budget}</span>
                          </div>
                          <div>
                            <span className="font-medium">Success Metrics: </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {phase.successMetrics.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & Funding Strategy */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pricing Strategy */}
                <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      💵 Pricing Strategy
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="font-semibold text-green-800 dark:text-green-200 mb-1">
                          Recommended Pricing
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {analysisResult.businessStrategy.competitivePricing.suggestedPricing}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-2">Strategy:</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {analysisResult.businessStrategy.competitivePricing.pricingStrategy}
                        </p>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-2">Value Proposition:</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {analysisResult.businessStrategy.competitivePricing.valueProposition}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Funding Strategy */}
                <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      💼 Funding Strategy
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                          Recommended Amount
                        </div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {analysisResult.businessStrategy.fundingStrategy.recommendedAmount}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          {analysisResult.businessStrategy.fundingStrategy.fundingStage}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-2">Target Investors:</div>
                        <div className="flex flex-wrap gap-1">
                          {analysisResult.businessStrategy.fundingStrategy.investorTypes.map((type, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-2">Use of Funds:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {analysisResult.businessStrategy.fundingStrategy.useOfFunds.map((use, i) => (
                            <li key={i}>{use}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cross-Page Navigation */}
              <div className="mt-8">
                <CrossPageNavigation 
                  currentPage="brainstorm"
                  ideaData={ideaData}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button 
                  onClick={refreshAnalysis}
                  disabled={isRefreshing}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}
                </button>
                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  New Analysis
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}