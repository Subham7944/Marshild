"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CrossPageNavigation from '../../../components/CrossPageNavigation';
import { useStartupIdea } from '../../../contexts/StartupIdeaContext.jsx';
import { getCachedAnalysis, setCachedAnalysis } from '../../../utils/cacheUtils.js';

export default function SWOTAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Global startup idea context
  const { ideaData, updateIdeaData, isLoaded: contextLoaded, hasIdeaData, isComplete } = useStartupIdea();

  // Auto-run analysis when context loads with complete data
  useEffect(() => {
    if (contextLoaded && ideaData && !analysisResult && !isLoading) {
      // Check for cached results first
      if (ideaData.industry && ideaData.location && ideaData.audience) {
        const cachedResult = getCachedAnalysis(ideaData, 'swot');
        if (cachedResult) {
          console.log('Loading cached SWOT analysis results');
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
      console.log('Starting SWOT analysis...');
      
      const response = await fetch('/api/swot-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate SWOT analysis');
      }

      const result = await response.json();
      console.log('SWOT analysis completed:', result);
      
      setAnalysisResult(result);
      
      // Cache the results for this startup idea
      setCachedAnalysis(ideaData, 'swot', result);
    } catch (error) {
      console.error('SWOT analysis failed:', error);
      setError(error.message || 'Failed to generate SWOT analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAnalysis = async () => {
    if (!analysisResult) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/swot-analysis', {
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
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 75) return 'bg-green-100 border-green-300';
    if (score >= 50) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  return (
    <div className="space-y-6 pt-16 md:pt-10">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">📊 SWOT Analysis</h1>
            <p className="opacity-90">Advanced ML-powered Strengths, Weaknesses, Opportunities & Threats analysis</p>
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
              Please go back to the dashboard and fill out your startup idea details to generate a SWOT analysis.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : !analysisResult && isLoading ? (
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6 text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <h3 className="text-xl font-semibold">Generating SWOT Analysis...</h3>
            <p className="text-gray-600">
              Analyzing strengths, weaknesses, opportunities, and threats for <strong>{ideaData.industry}</strong> in <strong>{ideaData.location}</strong>
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
          {/* Overall Scores Dashboard */}
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🎯 Overall Assessment
                {analysisResult.analysis_method === 'python_ml_model' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">ML Powered</span>
                )}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className={`p-4 rounded-lg border-2 ${getScoreBackground(analysisResult.overall_score)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall SWOT Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(analysisResult.overall_score)}`}>
                      {analysisResult.overall_score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        analysisResult.overall_score >= 75 ? 'bg-green-500' :
                        analysisResult.overall_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${analysisResult.overall_score}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${getScoreBackground(analysisResult.success_probability)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Success Probability</span>
                    <span className={`text-2xl font-bold ${getScoreColor(analysisResult.success_probability)}`}>
                      {analysisResult.success_probability}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        analysisResult.success_probability >= 75 ? 'bg-green-500' :
                        analysisResult.success_probability >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${analysisResult.success_probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Component Scores */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="text-center">
                    <div className="text-2xl mb-1">💪</div>
                    <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Strengths</div>
                    <div className="text-xl font-bold text-green-900 dark:text-green-100">
                      {analysisResult.component_scores.strengths}
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚠️</div>
                    <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Weaknesses</div>
                    <div className="text-xl font-bold text-red-900 dark:text-red-100">
                      {analysisResult.component_scores.weaknesses}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🚀</div>
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Opportunities</div>
                    <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                      {analysisResult.component_scores.opportunities}
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">Threats</div>
                    <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                      {analysisResult.component_scores.threats}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed SWOT Matrix */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-700 dark:text-green-300">
                  💪 Strengths
                </h3>
                <ul className="space-y-2">
                  {analysisResult.swot_analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Weaknesses */}
            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-700 dark:text-red-300">
                  ⚠️ Weaknesses
                </h3>
                <ul className="space-y-2">
                  {analysisResult.swot_analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Opportunities */}
            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  🚀 Opportunities
                </h3>
                <ul className="space-y-2">
                  {analysisResult.swot_analysis.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-sm">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Threats */}
            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  ⚡ Threats
                </h3>
                <ul className="space-y-2">
                  {analysisResult.swot_analysis.threats.map((threat, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-sm">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          {analysisResult.metrics && (
            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📈 Normalized Key Metrics
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(analysisResult.metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold">{value}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, value)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Strategic Recommendations */}
          <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🎯 Strategic Recommendations
              </h2>
              <div className="space-y-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <span className="text-purple-600 font-bold">{index + 1}.</span>
                    <span className="text-sm text-purple-800 dark:text-purple-200">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cross-Page Navigation */}
          <div className="mt-8">
            <CrossPageNavigation 
              currentPage="swot"
              ideaData={ideaData}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button 
              onClick={() => setAnalysisResult(null)}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}