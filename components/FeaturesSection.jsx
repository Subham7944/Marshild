"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const features = {
  Basic: [
    { 
      title: 'Market Fit Analysis', 
      desc: 'AI-powered validation to see if your idea fits the market demand.',
      icon: '🎯' 
    },
    { 
      title: 'Try a Demo Idea', 
      desc: 'Test the platform with pre-filled startup examples.',
      icon: '🔍' 
    },
  ],
  Premium: [
    { 
      title: 'SWOT Analysis', 
      desc: 'Comprehensive strengths, weaknesses, opportunities, and threats analysis.',
      icon: '📊' 
    },
    { 
      title: 'Risk Assessment', 
      desc: 'Advanced legal, technical, and market risk evaluation.',
      icon: '⚠️' 
    },
    { 
      title: 'Competitor Analysis', 
      desc: 'In-depth competitor research and market positioning insights.',
      icon: '🏆' 
    },
    { 
      title: 'AI Brainstorming', 
      desc: 'AI-powered brainstorming for revenue streams and growth strategies.',
      icon: '💡' 
    },
  ],
};

export default function FeaturesSection() {
  const [tab, setTab] = useState('Basic');
  const [isLoading, setIsLoading] = useState(false);

  const handleFeatureClick = (featureTitle) => {
    if (tab === 'Basic') {
      // Navigate to respective dashboard pages
      if (featureTitle === 'Market Fit Analysis') {
        window.location.href = '/dashboard';
      } else if (featureTitle === 'Try a Demo Idea') {
        window.location.href = '/dashboard';
      }
    } else if (tab === 'Premium') {
      // Navigate to respective premium dashboard pages
      if (featureTitle === 'SWOT Analysis') {
        window.location.href = '/dashboard/swot';
      } else if (featureTitle === 'Risk Assessment') {
        window.location.href = '/dashboard/risk';
      } else if (featureTitle === 'Competitor Analysis') {
        window.location.href = '/dashboard/competitor-analysis';
      } else if (featureTitle === 'AI Brainstorming') {
        window.location.href = '/dashboard/brainstorm';
      }
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (tab === 'Basic') {
      // Free plan - redirect to signup
      window.location.href = '/dashboard';
      return;
    }

    setIsLoading(true);
    
    // For development purposes, simulate payment success
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const confirmPayment = confirm(
          'Demo Payment Simulation\n\n' +
          'Amount: ₹200/month\n' +
          'Service: Premium Subscription\n\n' +
          'Click OK to simulate successful payment, Cancel to simulate failure.'
        );
        
        if (confirmPayment) {
          alert('Payment successful! Redirecting to dashboard...');
          window.location.href = '/dashboard?premium=true';
        } else {
          alert('Payment cancelled.');
        }
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    try {
      // Load Razorpay script if not already loaded
      const isRazorpayLoaded = await loadRazorpay();
      
      if (!isRazorpayLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setIsLoading(false);
        return;
      }

      // Initialize Razorpay payment with proper test credentials
      const options = {
        key: 'rzp_test_9WzaAV4VXt7Wi4', // Valid Razorpay test key
        amount: 20000, // ₹200 in paise
        currency: 'INR',
        name: 'Marshild',
        description: 'Premium Subscription - ₹200/month',
        image: '/dummy-logo.svg',
        handler: function (response) {
          // Handle successful payment
          console.log('Payment successful:', response);
          alert('Payment successful! Redirecting to dashboard...');
          window.location.href = '/dashboard?premium=true';
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Marshild Corporate Office'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setIsLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert('Payment failed: ' + response.error.description);
        setIsLoading(false);
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <section id="features" className="py-24 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to validate your startup idea
          </p>
        </motion.div>
        
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-full inline-flex">
            {Object.keys(features).map((key) => (
              <button
                key={key}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  tab === key 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-transparent text-gray-600 dark:text-gray-300 hover:text-primary'
                }`}
                onClick={() => setTab(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className={`grid gap-8 ${
              tab === 'Basic' 
                ? 'md:grid-cols-2 max-w-2xl mx-auto' 
                : 'md:grid-cols-3'
            }`}
          >
            {features[tab].map((feature, i) => (
              <motion.div
                key={feature.title}
                onClick={() => handleFeatureClick(feature.title)}
                className={`rounded-2xl shadow-lg p-8 bg-background dark:bg-darkbg border border-gray-100 dark:border-zinc-800 group hover:border-primary dark:hover:border-primary transition-all duration-300 cursor-pointer hover:shadow-xl`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h4 className="font-bold text-xl mb-3">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                <div className="mt-4 flex items-center text-primary font-medium text-sm">
                  <span>{tab === 'Basic' ? 'Click to try' : 'Click to explore'}</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {tab === 'Premium' && (
                    <span className="ml-2 px-2 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs rounded-full">
                      Premium
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button 
            onClick={handlePayment}
            disabled={isLoading}
            className={`bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-primary/30 hover:opacity-90 transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              tab === 'Basic' ? 'Try Basic Features Now' : 'Upgrade to Premium - ₹200/month'
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
