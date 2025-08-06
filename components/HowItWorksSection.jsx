"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

const steps = [
  {
    title: 'Enter your idea',
    description: 'Describe your startup concept in simple terms. No jargon needed.',
    detailedDescription: 'Just tell us your industry, target market, and basic concept. Our AI understands natural language.',
    icon: '💡',
    color: 'from-blue-500/20 to-purple-500/20',
    features: ['Industry selection', 'Target audience', 'Basic description', 'Optional details']
  },
  {
    title: 'AI analyzes & scores it',
    description: 'Our AI engine evaluates market fit, competition, and execution risks.',
    detailedDescription: 'Advanced algorithms analyze Google Trends, market data, and competitive landscape in real-time.',
    icon: '🤖',
    color: 'from-purple-500/20 to-pink-500/20',
    features: ['Google Trends analysis', 'Market research', 'Competitor analysis', 'Risk assessment']
  },
  {
    title: 'Get instant results',
    description: 'Receive your SWOT, risk score, and market fit analysis in seconds.',
    detailedDescription: 'Comprehensive reports with actionable insights, risk mitigation strategies, and next steps.',
    icon: '⚡',
    color: 'from-pink-500/20 to-orange-500/20',
    features: ['SWOT analysis', 'Risk scoring', 'Market validation', 'Action plan']
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleStepClick = (stepIndex) => {
    setActiveStep(activeStep === stepIndex ? null : stepIndex);
  };

  const handleTryItFree = () => {
    // Trigger the validation modal from the hero section
    document.querySelector('[data-validate-button]')?.click();
  };

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Validate your startup idea in three simple steps
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className={`relative rounded-2xl shadow-lg overflow-hidden group cursor-pointer transition-all duration-300 ${
                activeStep === i ? 'ring-4 ring-primary/50 scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.7 }}
              whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              onClick={() => handleStepClick(i)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-50`}></div>
              <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                <div className="text-6xl mb-6 transition-transform duration-300 group-hover:scale-110">{step.icon}</div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4 transition-all duration-300 ${
                  completedSteps.includes(i) ? 'bg-green-500' : 'bg-primary'
                } text-white`}>
                  {completedSteps.includes(i) ? <CheckCircle className="w-6 h-6" /> : i + 1}
                </div>
                <h3 className="font-bold text-2xl mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {activeStep === i ? step.detailedDescription : step.description}
                </p>
                
                {/* Expanded content */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: activeStep === i ? 'auto' : 0, 
                    opacity: activeStep === i ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden w-full"
                >
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold mb-3 text-primary">What you get:</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
                
                {/* Click indicator */}
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to {activeStep === i ? 'collapse' : 'expand'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2">Ready to validate your idea?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of entrepreneurs who've validated their ideas with Marshild
            </p>
            <button 
              onClick={handleTryItFree}
              className="bg-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-primary/30 hover:bg-primary/90 transition inline-flex items-center gap-2 group"
            >
              Try it Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              No credit card required • Get results in under 5 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
