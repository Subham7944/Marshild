"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const demoSteps = [
  {
    id: 1,
    title: "Enter Your Startup Idea",
    description: "Start by describing your startup concept, target industry, and primary market location.",
    image: "🚀",
    content: "Simply fill in basic details about your idea - industry (e.g., FinTech, HealthTech), location (Global, North America), and target audience (Young professionals, Small businesses).",
    action: "Try entering: 'AI-powered fitness app for busy professionals'"
  },
  {
    id: 2,
    title: "AI Analysis in Progress",
    description: "Our AI analyzes market trends, competition, and validates your idea using real-time data.",
    image: "🧠",
    content: "Marshild combines Google Trends data, Crunchbase insights, and industry reports to provide comprehensive analysis in under 5 minutes.",
    action: "Watch as AI processes thousands of data points"
  },
  {
    id: 3,
    title: "Market Research Results",
    description: "Get detailed market insights, trends analysis, and keyword performance data.",
    image: "📊",
    content: "See Google Trends analysis, market size estimations, growth projections, and keyword performance for your industry.",
    action: "Review market trends and growth opportunities"
  },
  {
    id: 4,
    title: "Risk Assessment",
    description: "Identify potential risks, regulatory concerns, and technical challenges early.",
    image: "⚠️",
    content: "Our AI scans for legal risks, technical barriers, market saturation, and competitive threats to help you prepare.",
    action: "Premium feature: Get detailed risk mitigation strategies"
  },
  {
    id: 5,
    title: "Competitor Analysis",
    description: "Discover who you're competing against and find your competitive advantage.",
    image: "🏆",
    content: "Real-time competitor data from Crunchbase, funding information, and market positioning analysis.",
    action: "Premium feature: Access live competitor intelligence"
  },
  {
    id: 6,
    title: "SWOT Analysis",
    description: "Get AI-powered Strengths, Weaknesses, Opportunities, and Threats analysis.",
    image: "🎯",
    content: "Machine learning models analyze your idea against successful startups to identify key strategic insights.",
    action: "Premium feature: Download comprehensive SWOT report"
  },
  {
    id: 7,
    title: "Investor-Ready Reports",
    description: "Export professional reports and pitch decks for investors and stakeholders.",
    image: "📋",
    content: "Generate PDF reports, editable pitch decks, and investor presentations with one click.",
    action: "Premium feature: Export to PDF, PowerPoint, or CSV"
  }
];

const DemoModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoMode, setDemoMode] = useState('interactive'); // 'video' or 'interactive'

  useEffect(() => {
    let interval;
    if (isPlaying && demoMode === 'interactive') {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= demoSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000); // 4 seconds per step
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoMode]);

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto relative max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎬</div>
                <div>
                  <h2 className="text-xl font-semibold">Marshild Demo</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    See how AI validates your startup idea
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                aria-label="Close demo"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
              </button>
            </div>

            {/* Demo Mode Toggle */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Demo Mode:</span>
                <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setDemoMode('interactive')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      demoMode === 'interactive'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Interactive Tour
                  </button>
                  <button
                    onClick={() => setDemoMode('video')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      demoMode === 'video'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Video Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-6">
              {demoMode === 'video' ? (
                /* Video Demo Section */
                <div className="space-y-6">
                  <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden relative border border-gray-700">
                    {/* Video Player - Hidden until video loads */}
                    <video
                      className="w-full h-full object-cover absolute inset-0 z-10"
                      controls
                      style={{ display: 'none' }}
                      onLoadedData={(e) => {
                        e.target.style.display = 'block';
                        e.target.nextElementSibling.style.display = 'none';
                      }}
                      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:0.2' /%3E%3Cstop offset='100%25' style='stop-color:%23a855f7;stop-opacity:0.2' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%236366f1' font-size='48' font-family='Arial, sans-serif' font-weight='bold'%3EMarshild Demo%3C/text%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='%23666' font-size='24' font-family='Arial, sans-serif'%3EAI Startup Validation Platform%3C/text%3E%3Ccircle cx='50%25' cy='65%25' r='30' fill='%236366f1' opacity='0.8' /%3E%3Cpolygon points='590,425 610,435 590,445' fill='white' /%3E%3C/svg%3E"
                    >
                      <source src="/videos/marshild-demo.mp4" type="video/mp4" />
                      <source src="/videos/marshild-demo.webm" type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video Placeholder - Shows when video is not available */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="text-center text-white max-w-lg mx-auto px-6">
                        <div className="text-6xl mb-6">🎬</div>
                        <h3 className="text-2xl font-bold mb-3 text-white">Demo Video</h3>
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                          Watch how Marshild validates startup ideas using AI and real-time market data
                        </p>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
                          <div className="flex items-center justify-center mb-3">
                            📹 <span className="ml-2 font-medium">Video file not found</span>
                          </div>
                          <p className="text-sm text-gray-200 mb-3">
                            Place your demo video at:
                          </p>
                          <code className="bg-black/40 px-3 py-2 rounded-lg text-xs font-mono text-green-300 block">
                            /public/videos/marshild-demo.mp4
                          </code>
                        </div>
                        
                        <button
                          onClick={() => setDemoMode('interactive')}
                          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Try Interactive Demo Instead
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Description */}
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-3">What You'll See in This Demo</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span className="text-sm">Live startup idea validation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span className="text-sm">Real-time market research</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span className="text-sm">AI-powered risk assessment</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span className="text-sm">Competitor analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span className="text-sm">SWOT analysis generation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span className="text-sm">Report export features</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Demo Section */
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Step {currentStep + 1} of {demoSteps.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={resetDemo}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                          title="Reset demo"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={togglePlayPause}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Step Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-4">{demoSteps[currentStep].image}</div>
                        <h3 className="text-2xl font-bold mb-2">{demoSteps[currentStep].title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          {demoSteps[currentStep].description}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {demoSteps[currentStep].content}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <CheckCircle className="w-5 h-5" />
                          <span>{demoSteps[currentStep].action}</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {demoSteps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentStep(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentStep
                              ? 'bg-primary w-8'
                              : index < currentStep
                              ? 'bg-primary/60'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextStep}
                      disabled={currentStep === demoSteps.length - 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ready to validate your startup idea?
                </p>
                <button
                  onClick={() => {
                    handleClose();
                    // Scroll to validation form or open validation modal
                    setTimeout(() => {
                      const validateButton = document.querySelector('[data-validate-button]');
                      if (validateButton) {
                        validateButton.click();
                      }
                    }, 300);
                  }}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Start Validation
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoModal;
