"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ArrowRight, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Loader, Target, Users, Lightbulb, FileText, Share2 } from 'lucide-react';

const demoSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Marshild',
    description: 'Your complete startup validation platform',
    component: 'welcome'
  },
  {
    id: 'idea-input',
    title: 'Step 1: Enter Your Idea',
    description: 'Simple form to describe your startup concept',
    component: 'idea-input'
  },
  {
    id: 'validation-results',
    title: 'Step 2: Get Validation Results',
    description: 'AI-powered analysis with Google Trends and market data',
    component: 'validation-results'
  },
  {
    id: 'market-research',
    title: 'Step 3: Market Research',
    description: 'Comprehensive competitor analysis and market insights',
    component: 'market-research'
  },
  {
    id: 'risk-assessment',
    title: 'Step 4: Risk Assessment',
    description: 'Legal, technical, and market risk evaluation',
    component: 'risk-assessment'
  },
  {
    id: 'advanced-tools',
    title: 'Step 5: Advanced Analysis',
    description: 'SWOT analysis, competitor research, and brainstorming tools',
    component: 'advanced-tools'
  },
  {
    id: 'reports-export',
    title: 'Step 6: Export & Share',
    description: 'Professional reports and actionable next steps',
    component: 'reports-export'
  }
];

const sampleData = {
  idea: {
    industry: 'HealthTech',
    location: 'United States',
    audience: 'Fitness enthusiasts aged 25-40',
    description: 'AI-powered personal fitness coach app that creates custom workout plans'
  },
  marketResearch: {
    marketSize: '$96.7B',
    growthRate: '14.7%',
    competitors: ['MyFitnessPal', 'Nike Training Club', 'Peloton'],
    trends: ['AI personalization', 'Wearable integration', 'Virtual coaching']
  },
  risks: {
    overall: 35,
    legal: { score: 40, level: 'Medium' },
    technical: { score: 30, level: 'Low' },
    market: { score: 35, level: 'Medium' }
  },
  validation: {
    score: 78,
    confidence: 'High',
    recommendation: 'Proceed with MVP development'
  }
};

export default function DemoVideoModal({ isOpen, onClose }) {
  const [demoType, setDemoType] = useState(null); // 'interactive' or 'video'
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDemoType(null);
      setCurrentStep(0);
      setIsPlaying(false);
      setProgress(0);
      setAutoPlay(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval;
    if (autoPlay && isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              setAutoPlay(false);
              return 100;
            }
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [autoPlay, isPlaying, currentStep]);

  const startDemo = () => {
    setIsPlaying(true);
    setAutoPlay(true);
    setCurrentStep(0);
    setProgress(0);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const renderDemoContent = () => {
    const step = demoSteps[currentStep];
    
    switch (step.component) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-3xl font-bold mb-4">Welcome to Marshild</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              The AI-powered platform that validates your startup ideas in minutes
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-medium">5-Minute Analysis</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-sm font-medium">AI-Powered</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium">Market Data</div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium">Pro Reports</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
              <h4 className="font-semibold mb-2">What You'll Get</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Google Trends analysis and market validation</li>
                <li>✓ Comprehensive competitor research</li>
                <li>✓ Legal, technical, and market risk assessment</li>
                <li>✓ SWOT analysis and strategic recommendations</li>
                <li>✓ Professional reports you can share with investors</li>
              </ul>
            </div>
            
            <div className="text-center pt-4">
              <button 
                onClick={nextStep}
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition flex items-center gap-2 mx-auto"
              >
                Get Started 
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500 mt-2">See how it works step by step</p>
            </div>
          </div>
        );
        
      case 'idea-input':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Step 1: Enter Your Startup Idea</h3>
              <p className="text-gray-600 dark:text-gray-400">Simple form to get started - takes less than 2 minutes</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., FinTech, HealthTech, E-commerce"
                      className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Market *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., United States, Europe, Global"
                      className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Young professionals, Small businesses, Students"
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Describe Your Idea</label>
                  <textarea 
                    placeholder="What problem does your startup solve? How does it work? (Optional but recommended)"
                    rows={3}
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
                  ⚡ Validate My Startup Idea
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-semibold text-blue-600">2 Minutes</div>
                <div className="text-gray-600 dark:text-gray-400">To fill form</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-semibold text-green-600">5 Minutes</div>
                <div className="text-gray-600 dark:text-gray-400">AI analysis</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-semibold text-purple-600">Instant</div>
                <div className="text-gray-600 dark:text-gray-400">Results</div>
              </div>
            </div>
          </div>
        );
        
      case 'validation-results':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Step 2: Validation Results</h3>
              <p className="text-gray-600 dark:text-gray-400">AI-powered analysis with Google Trends and market data</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold">Validation Score</h4>
                <div className="text-3xl font-bold text-green-600">78/100</div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div className="bg-green-500 h-3 rounded-full" style={{width: '78%'}}></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Strong market potential with moderate competition</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Google Trends Analysis
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Search Interest</span>
                    <span className="text-sm font-medium text-green-600">Rising +24%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Related Queries</span>
                    <span className="text-sm font-medium">127 keywords</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Geographic Interest</span>
                    <span className="text-sm font-medium">US, UK, CA</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Market Insights
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Market Size</span>
                    <span className="text-sm font-medium">$2.4B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Growth Rate</span>
                    <span className="text-sm font-medium text-green-600">+15% YoY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Competition</span>
                    <span className="text-sm font-medium text-orange-600">Moderate</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h5 className="font-semibold mb-2">Key Recommendations</h5>
              <ul className="text-sm space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Strong market demand detected in target demographics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Consider focusing on mobile-first approach</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span>Monitor competitor pricing strategies closely</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      case 'analyzing':
        return (
          <div className="text-center py-8">
            <Loader className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
            <h3 className="text-xl font-semibold mb-4">Analyzing Your Idea...</h3>
            <div className="space-y-3 max-w-md mx-auto">
              {[
                'Analyzing market trends with Google Trends',
                'Researching competitors and market size',
                'Evaluating technical feasibility',
                'Assessing legal and regulatory risks',
                'Generating validation score'
              ].map((task, idx) => (
                <div key={idx} className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">{task}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'market-research':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Step 3: Market Research</h3>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive competitor analysis and market insights</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{sampleData.marketResearch.marketSize}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Market Size</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{sampleData.marketResearch.growthRate}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{sampleData.marketResearch.competitors.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Major Competitors</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{sampleData.marketResearch.trends.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Key Trends</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Top Competitors</h4>
                <ul className="space-y-2">
                  {sampleData.marketResearch.competitors.map((competitor, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {competitor}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Market Trends</h4>
                <ul className="space-y-2">
                  {sampleData.marketResearch.trends.map((trend, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'risk-assessment':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Step 4: Risk Assessment</h3>
              <p className="text-gray-600 dark:text-gray-400">Legal, technical, and market risk evaluation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{sampleData.risks.overall}/100</div>
              <div className="text-lg text-gray-600 dark:text-gray-400">Overall Risk Score</div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Legal Risk', data: sampleData.risks.legal, icon: '⚖️', color: 'red' },
                { name: 'Technical Risk', data: sampleData.risks.technical, icon: '🔧', color: 'blue' },
                { name: 'Market Risk', data: sampleData.risks.market, icon: '📊', color: 'purple' }
              ].map((risk, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{risk.icon}</span>
                    <h4 className="font-semibold">{risk.name}</h4>
                  </div>
                  <div className="text-2xl font-bold mb-2">{risk.data.score}/100</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                    risk.data.level === 'Low' ? 'bg-green-100 text-green-800' :
                    risk.data.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {risk.data.level} Risk
                  </div>
                  <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        risk.data.level === 'Low' ? 'bg-green-500' :
                        risk.data.level === 'Medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${risk.data.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'advanced-tools':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Step 5: Advanced Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">SWOT analysis, competitor research, and brainstorming tools</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  SWOT Analysis
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="font-medium text-green-700 dark:text-green-400 mb-1">Strengths</div>
                    <ul className="text-xs space-y-1">
                      <li>• Innovative approach</li>
                      <li>• Strong team</li>
                      <li>• Market timing</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="font-medium text-red-700 dark:text-red-400 mb-1">Weaknesses</div>
                    <ul className="text-xs space-y-1">
                      <li>• Limited funding</li>
                      <li>• No brand recognition</li>
                      <li>• Technical challenges</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">Opportunities</div>
                    <ul className="text-xs space-y-1">
                      <li>• Growing market</li>
                      <li>• Partnership potential</li>
                      <li>• Technology trends</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <div className="font-medium text-orange-700 dark:text-orange-400 mb-1">Threats</div>
                    <ul className="text-xs space-y-1">
                      <li>• Established competitors</li>
                      <li>• Regulatory changes</li>
                      <li>• Economic factors</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Competitor Analysis
                </h4>
                <div className="space-y-3">
                  {['Competitor A', 'Competitor B', 'Competitor C'].map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div>
                        <div className="font-medium text-sm">{comp}</div>
                        <div className="text-xs text-gray-500">Market leader in segment</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">${(Math.random() * 100 + 50).toFixed(0)}M</div>
                        <div className="text-xs text-gray-500">Valuation</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                AI Brainstorming Assistant
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="font-medium mb-2">Revenue Streams</div>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Subscription model</li>
                    <li>• Freemium approach</li>
                    <li>• Enterprise licensing</li>
                  </ul>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="font-medium mb-2">Marketing Channels</div>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Content marketing</li>
                    <li>• Social media ads</li>
                    <li>• Partnership programs</li>
                  </ul>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded">
                  <div className="font-medium mb-2">Growth Strategies</div>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Geographic expansion</li>
                    <li>• Feature development</li>
                    <li>• Strategic acquisitions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'reports-export':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Step 6: Export & Share</h3>
              <p className="text-gray-600 dark:text-gray-400">Professional reports and actionable next steps</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Professional Reports
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div>
                      <div className="font-medium text-sm">Executive Summary</div>
                      <div className="text-xs text-gray-500">2-page overview for investors</div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Download PDF
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <div>
                      <div className="font-medium text-sm">Detailed Analysis</div>
                      <div className="text-xs text-gray-500">Complete 15-page report</div>
                    </div>
                    <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                      Download PDF
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div>
                      <div className="font-medium text-sm">Data Export</div>
                      <div className="text-xs text-gray-500">Raw data in CSV/Excel format</div>
                    </div>
                    <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                      Download CSV
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-600" />
                  Share & Collaborate
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="font-medium text-sm mb-2">Share with Team</div>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="teammate@email.com"
                        className="flex-1 px-3 py-2 text-xs border rounded"
                      />
                      <button className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        Invite
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="font-medium text-sm mb-2">Public Link</div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value="https://marshild.com/report/abc123"
                        readOnly
                        className="flex-1 px-3 py-2 text-xs border rounded bg-gray-100"
                      />
                      <button className="px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 text-center">
              <h4 className="font-semibold mb-3">Next Steps Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-medium mb-1">Immediate Actions</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Start MVP development and validate core features</div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-medium mb-1">Funding Strategy</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Prepare pitch deck for seed funding round</div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-medium mb-1">Growth Plan</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Focus on customer acquisition and retention</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'results':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <div className="text-4xl font-bold text-green-600 mb-2">{sampleData.validation.score}/100</div>
              <div className="text-xl font-semibold mb-2">Validation Score</div>
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Confidence: {sampleData.validation.confidence}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Recommendation</h4>
                <p className="text-green-600 font-medium">{sampleData.validation.recommendation}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-semibold text-blue-600">Market Opportunity</div>
                <div>Large and growing market</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-semibold text-green-600">Competitive Position</div>
                <div>Differentiated offering</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-semibold text-purple-600">Technical Feasibility</div>
                <div>Achievable with current tech</div>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="font-semibold text-orange-600">Risk Level</div>
                <div>Manageable risks identified</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Demo content</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Interactive Demo: {demoSteps[currentStep].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {demoSteps[currentStep].description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </div>
            <div className="flex space-x-1">
              {demoSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    idx < currentStep ? 'bg-green-500' :
                    idx === currentStep ? 'bg-primary' :
                    'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  {idx === currentStep && (
                    <div 
                      className="h-full bg-primary/60 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Demo Type Selection or Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!demoType ? (
              <div className="text-center space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Choose Your Demo Experience</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Explore Marshild's powerful validation platform
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDemoType('interactive')}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="text-4xl mb-4">🖥️</div>
                    <h4 className="text-xl font-semibold mb-3">Interactive Demo</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Hands-on exploration of our platform features and tools
                    </p>
                    <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 text-left">
                      <li>• Navigate through actual dashboard</li>
                      <li>• See real validation tools</li>
                      <li>• Explore all features</li>
                      <li>• Self-paced experience</li>
                    </ul>
                    <div className="mt-4 text-primary font-medium">Start Interactive Demo →</div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDemoType('video')}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="text-4xl mb-4">🎥</div>
                    <h4 className="text-xl font-semibold mb-3">Video Demo</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Guided walkthrough showcasing the complete validation process
                    </p>
                    <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 text-left">
                      <li>• Professional narration</li>
                      <li>• Complete workflow demo</li>
                      <li>• Real use case examples</li>
                      <li>• 3-minute overview</li>
                    </ul>
                    <div className="mt-4 text-primary font-medium">Watch Video Demo →</div>
                  </motion.div>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Both demos showcase the same powerful features - choose your preferred learning style
                </div>
              </div>
            ) : demoType === 'video' ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Marshild Platform Walkthrough</h3>
                  <p className="text-gray-600 dark:text-gray-400">See how entrepreneurs validate their ideas in under 3 minutes</p>
                </div>
                
                <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-4 inline-flex">
                        <Play className="w-16 h-16 text-primary" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Professional Demo Video
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Complete platform walkthrough with real examples
                      </p>
                      <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition">
                        Play Demo Video
                      </button>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Duration</span>
                        <span className="text-primary font-medium">2:45</span>
                      </div>
                      <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-0 transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-sm font-medium">Market Analysis</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-sm font-medium">AI Validation</div>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl mb-1">⚠️</div>
                    <div className="text-sm font-medium">Risk Assessment</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button 
                    onClick={() => setDemoType(null)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm underline"
                  >
                    ← Back to demo options
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {demoSteps[currentStep].title}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentStep + 1} of {demoSteps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {demoSteps[currentStep].description}
              </p>
            </div>
            
            {/* Demo Content Area */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 min-h-[300px]">
              {renderDemoContent()}
            </div>
            
            {/* Demo Controls */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  ← Previous
                </button>
                
                {!isPlaying ? (
                  <button
                    onClick={startDemo}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2 font-medium"
                  >
                    <Play className="w-4 h-4" />
                    {currentStep === 0 ? 'Start Demo' : 'Resume'}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                  >
                    Pause
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={nextStep}
                  disabled={currentStep === demoSteps.length - 1}
                  className={`px-6 py-2 rounded-lg transition flex items-center gap-2 font-medium ${
                    currentStep === demoSteps.length - 1
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                  }`}
                >
                  {currentStep === demoSteps.length - 1 ? 'Completed' : 'Next Step'}
                  {currentStep !== demoSteps.length - 1 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              </div>
            </div>
            
                <div className="text-center">
                  <button 
                    onClick={() => setDemoType(null)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm underline"
                  >
                    ← Back to demo options
                  </button>
                </div>
              </div>
            )}


            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to validate your own idea?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started with our AI-powered validation tools today
              </p>
              <button
                onClick={() => {
                  onClose();
                  // Trigger the validation modal
                  setTimeout(() => {
                    document.querySelector('[data-validate-button]')?.click();
                  }, 300);
                }}
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition inline-flex items-center gap-2"
              >
                Start Validation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}