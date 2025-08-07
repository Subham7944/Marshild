"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { BarChart3, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import CrossPageNavigation from '../../../components/CrossPageNavigation';
import { useStartupIdea } from '../../../contexts/StartupIdeaContext.jsx';
import { getCachedAnalysis, setCachedAnalysis } from '../../../utils/cacheUtils.js';

export default function RiskAssessmentPage() {
  const { userId } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  // Global startup idea context
  const { ideaData, updateIdeaData, isLoaded: contextLoaded, hasIdeaData, isComplete } = useStartupIdea();
  
  // No form inputs needed - using context data directly
  
  // State for risk assessment
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [error, setError] = useState('');

  // Risk assessment function
  const handleRiskAssessment = async (e = null) => {
    if (e) e.preventDefault();
    
    // Validate context data
    if (!ideaData || !ideaData.industry || !ideaData.location || !ideaData.audience) {
      setError('Please complete your startup idea on the dashboard first');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      const response = await fetch('/api/risk-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: ideaData.industry,
          location: ideaData.location,
          audience: ideaData.audience,
          description: ideaData.description || ''
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze risks');
      }
      
      const data = await response.json();
      console.log('Risk assessment data received:', data);
      setRiskData(data);
      
      // Cache the results with new version
      setCachedAnalysis(ideaData, 'risk-v2', data);
    } catch (error) {
      console.error('Risk assessment error:', error);
      setError(error.message || 'Failed to assess risks. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-run analysis when context loads with complete data
  useEffect(() => {
    if (contextLoaded && ideaData && !riskData && !isAnalyzing) {
      // Check for cached results first
      if (ideaData.industry && ideaData.location && ideaData.audience) {
        // Clear old cache format and force fresh API call
        const cacheKey = `risk-${ideaData.industry}-${ideaData.location}-${ideaData.audience}`;
        localStorage.removeItem(cacheKey); // Clear old cache
        
        const cachedResult = getCachedAnalysis(ideaData, 'risk-v2'); // Use new cache version
        if (cachedResult && cachedResult.legal_risk && cachedResult.technical_risk && cachedResult.market_risk) {
          console.log('Loading cached risk assessment results (v2)');
          setRiskData(cachedResult);
        } else {
          console.log('No valid cached results found, generating new analysis');
          handleRiskAssessment();
        }
      }
    }
  }, [contextLoaded, ideaData, riskData, isAnalyzing]);

  // Handle loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Handle unauthorized access
  if (!userId) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="space-y-6 pt-16 md:pt-10">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <BarChart3 className="w-8 h-8" />
          Risk Assessment
        </h1>
        <p className="opacity-90">Comprehensive analysis of legal, technical, and market risks for your startup idea</p>
      </div>

      {/* Analysis Status */}
      {!ideaData || !ideaData.industry || !ideaData.location || !ideaData.audience ? (
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Complete Your Startup Idea First</h3>
              <p className="text-gray-600">
                Please go back to the dashboard and fill out your startup idea details to generate a risk assessment.
              </p>
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      ) : !riskData && isAnalyzing ? (
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
              <h3 className="text-xl font-semibold">Analyzing Startup Risks...</h3>
              <p className="text-gray-600">
                Assessing legal, technical, and market risks for <strong>{ideaData.industry}</strong> in <strong>{ideaData.location}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-red-600">Error</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={handleRiskAssessment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Risk Assessment Results */}
      {riskData && (
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Overall Risk Assessment
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  riskData.overall_risk_level?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                  riskData.overall_risk_level?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {riskData.overall_risk_level} risk
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">Risk Score</h4>
                  <span className="text-2xl font-bold text-primary">
                    {riskData.overall_risk_score}/100
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      riskData.overall_risk_level?.toLowerCase() === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      riskData.overall_risk_level?.toLowerCase() === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${riskData.overall_risk_score}%` }}
                  ></div>
                </div>
                
                {riskData.risk_summary && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Highest risk: <span className="font-medium capitalize">{riskData.risk_summary.highest_risk_category}</span> ({riskData.risk_summary.highest_risk_score}/100)
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total risk factors: <span className="font-medium">{riskData.risk_summary.total_risk_factors}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Priority: <span className="font-medium">{riskData.risk_summary.mitigation_priority}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Assessment Date: <span className="font-medium">{riskData.risk_summary.assessment_date}</span>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risk Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Legal Risk */}
            {riskData.legal_risk && (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    ⚖️ Legal Risk
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      riskData.legal_risk.risk_level?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                      riskData.legal_risk.risk_level?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {riskData.legal_risk.risk_level}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Risk Score:</span>
                    <span className="text-lg font-bold">{riskData.legal_risk.risk_score}/100</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        riskData.legal_risk.risk_level?.toLowerCase() === 'high' ? 'bg-red-500' :
                        riskData.legal_risk.risk_level?.toLowerCase() === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${riskData.legal_risk.risk_score}%` }}
                    ></div>
                  </div>
                  
                  {riskData.legal_risk.applicable_regulations && (
                    <div>
                      <h5 className="font-medium mb-2">Key Regulations:</h5>
                      <div className="flex flex-wrap gap-1">
                        {riskData.legal_risk.applicable_regulations.slice(0, 3).map((reg, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">
                            {reg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {riskData.legal_risk.key_concerns && (
                    <div>
                      <h5 className="font-medium mb-2">Key Concerns:</h5>
                      <ul className="text-sm space-y-1">
                        {riskData.legal_risk.key_concerns.slice(0, 3).map((concern, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-1">
                            <span className="text-red-500 mt-1 text-xs">•</span>
                            <span>{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-600">
                    <div>Compliance Cost: {riskData.legal_risk.estimated_compliance_cost}</div>
                    <div>Complexity: {riskData.legal_risk.compliance_complexity}</div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Technical Risk */}
            {riskData.technical_risk && (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    🔧 Technical Risk
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      riskData.technical_risk.risk_level?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                      riskData.technical_risk.risk_level?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {riskData.technical_risk.risk_level}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Risk Score:</span>
                    <span className="text-lg font-bold">{riskData.technical_risk.risk_score}/100</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        riskData.technical_risk.risk_level?.toLowerCase() === 'high' ? 'bg-red-500' :
                        riskData.technical_risk.risk_level?.toLowerCase() === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${riskData.technical_risk.risk_score}%` }}
                    ></div>
                  </div>
                  
                  {riskData.technical_risk.key_technologies && (
                    <div>
                      <h5 className="font-medium mb-2">Key Technologies:</h5>
                      <div className="flex flex-wrap gap-1">
                        {riskData.technical_risk.key_technologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="text-xs bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {riskData.technical_risk.technical_challenges && (
                    <div>
                      <h5 className="font-medium mb-2">Technical Challenges:</h5>
                      <ul className="text-sm space-y-1">
                        {riskData.technical_risk.technical_challenges.slice(0, 3).map((challenge, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-1">
                            <span className="text-orange-500 mt-1 text-xs">•</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {riskData.technical_risk.patent_landscape && (
                    <div className="text-xs text-gray-600">
                      <div>Patent Space: {riskData.technical_risk.patent_landscape.crowded ? 'Crowded' : 'Open'} ({riskData.technical_risk.patent_landscape.patent_count} patents)</div>
                      <div>Dev Time: {riskData.technical_risk.estimated_dev_time}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Market Risk */}
            {riskData.market_risk && (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    📊 Market Risk
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      riskData.market_risk.risk_level?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                      riskData.market_risk.risk_level?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {riskData.market_risk.risk_level}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Risk Score:</span>
                    <span className="text-lg font-bold">{riskData.market_risk.risk_score}/100</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        riskData.market_risk.risk_level?.toLowerCase() === 'high' ? 'bg-red-500' :
                        riskData.market_risk.risk_level?.toLowerCase() === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${riskData.market_risk.risk_score}%` }}
                    ></div>
                  </div>
                  
                  {riskData.market_risk.trend_analysis && (
                    <div>
                      <h5 className="font-medium mb-2">Market Trends:</h5>
                      <div className="text-sm space-y-1">
                        {riskData.market_risk.trend_analysis.growing?.length > 0 && (
                          <div className="text-green-600">📈 {riskData.market_risk.trend_analysis.growing.length} growing trends</div>
                        )}
                        {riskData.market_risk.trend_analysis.declining?.length > 0 && (
                          <div className="text-red-600">📉 {riskData.market_risk.trend_analysis.declining.length} declining trends</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {riskData.market_risk.market_signals && (
                    <div>
                      <h5 className="font-medium mb-2">Market Signals:</h5>
                      <ul className="text-sm space-y-1">
                        {riskData.market_risk.market_signals.slice(0, 2).map((signal, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-1">
                            <span className="text-blue-500 mt-1 text-xs">•</span>
                            <span>{signal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-600">
                    <div>Sentiment: {riskData.market_risk.market_sentiment}</div>
                    <div>Timing: {riskData.market_risk.market_timing}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Key Recommendations */}
          {riskData.key_recommendations && (
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💡 Key Risk Mitigation Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <ul className="space-y-2">
                    {riskData.key_recommendations.map((rec, index) => (
                      <li key={index} className="text-blue-800 dark:text-blue-200 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Handling */}
          {riskData.error && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-600">⚠️</span>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Risk Assessment Partially Available</h4>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {riskData.error}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  Some risk analysis data may be limited, but the available assessment is still valuable.
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Cross-Page Navigation */}
          <div className="mt-8">
            <CrossPageNavigation 
              currentPage="risk-assessment"
              ideaData={ideaData}
            />
          </div>
        </div>
      )}
    </div>
  );
}