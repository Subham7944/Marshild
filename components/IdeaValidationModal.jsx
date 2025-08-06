"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function IdeaValidationModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: '',
    location: '',
    audience: '',
    description: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const steps = [
    {
      title: "What's your startup industry?",
      subtitle: "Tell us about your business vertical",
      field: "industry",
      placeholder: "e.g. FinTech, HealthTech, E-commerce, SaaS",
      type: "text"
    },
    {
      title: "Where's your primary market?",
      subtitle: "Your main target location or region",
      field: "location",
      placeholder: "e.g. United States, Europe, India, Global",
      type: "text"
    },
    {
      title: "Who's your target audience?",
      subtitle: "Describe your ideal customers",
      field: "audience",
      placeholder: "e.g. Young professionals, Small businesses, Students",
      type: "text"
    },
    {
      title: "Describe your startup idea",
      subtitle: "What problem does it solve? (Optional)",
      field: "description",
      placeholder: "e.g. A platform that helps freelancers manage their finances...",
      type: "textarea"
    }
  ];

  const currentStepData = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;
  const canProceed = formData[currentStepData.field].trim() !== '' || currentStepData.field === 'description';

  const handleInputChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.field]: value
    }));
    setError('');
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if user is signed in
    if (!userId) {
      // Redirect to sign-in with the form data stored
      localStorage.setItem('pendingIdeaValidation', JSON.stringify(formData));
      router.push('/sign-in?redirect_url=/dashboard');
      onClose();
      return;
    }

    // Validate required fields
    if (!formData.industry || !formData.location || !formData.audience) {
      setError('Please fill all required fields');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze startup idea');
      }

      const validationData = await response.json();
      
      // Generate a unique ID for this validation result
      const validationId = Date.now().toString();
      
      // Store the result in localStorage
      localStorage.setItem(`validation-${validationId}`, JSON.stringify(validationData));
      
      // Navigate to the validation results page
      router.push(`/dashboard/validation-results?id=${validationId}`);
      onClose();
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze startup. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetModal = () => {
    setCurrentStep(1);
    setFormData({
      industry: '',
      location: '',
      audience: '',
      description: ''
    });
    setError('');
    setIsAnalyzing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md mx-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🚀</div>
              <h2 className="text-xl font-semibold">Validate Your Idea</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round((currentStep / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2">{currentStepData.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{currentStepData.subtitle}</p>

              {currentStepData.type === 'textarea' ? (
                <textarea
                  value={formData[currentStepData.field]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-32 bg-white dark:bg-gray-800"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={formData[currentStepData.field]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && canProceed) {
                      handleNext();
                    }
                  }}
                />
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed || isAnalyzing}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : isLastStep ? (
                <>
                  Validate Idea
                  <div className="text-xl">🚀</div>
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
