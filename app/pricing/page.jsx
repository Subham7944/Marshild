"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, TrendingUp, Shield, Brain, Building2, MessageSquare, FileText, ArrowLeft } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { PaymentService } from '../../services/payment-service';

const features = [
  { icon: <Check className="w-5 h-5" />, text: "Validation Results & Market Research" },
  { icon: <TrendingUp className="w-5 h-5" />, text: "Advanced ML-Powered SWOT Analysis" },
  { icon: <Shield className="w-5 h-5" />, text: "Deep Risk Assessment (Legal, Technical, Market)" },
  { icon: <Building2 className="w-5 h-5" />, text: "Real-time Competitor Analysis (Crunchbase Data)" },
  { icon: <Brain className="w-5 h-5" />, text: "Brainstorm Intelligence (News & Social Sentiment)" },
  { icon: <MessageSquare className="w-5 h-5" />, text: "AI-Powered Investor Q&A Preparation" },
  { icon: <FileText className="w-5 h-5" />, text: "Professional Pitch Deck Export & Customization" },
  { icon: <Zap className="w-5 h-5" />, text: "Priority Support & Advanced Analytics" },
];

export default function PricingPage() {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentService = PaymentService.getInstance();

  const handleUpgrade = async () => {
    if (!user) {
      alert('Please sign in to upgrade to premium.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create payment order
      const orderData = await paymentService.createOrder('premium');
      
      // User information for Razorpay
      const userInfo = {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.emailAddresses[0]?.emailAddress || '',
        contact: user.phoneNumbers[0]?.phoneNumber || ''
      };

      // Initiate payment
      await paymentService.initiatePayment(
        orderData,
        userInfo,
        (response) => {
          // Payment success
          console.log('Payment successful:', response);
          if (response.demo) {
            alert(`Demo Payment Successful! \n\n${response.message}\n\nYou now have premium access for testing.`);
          }
          window.location.href = '/payment/success';
        },
        () => {
          // Payment failure
          console.log('Payment failed or cancelled');
          window.location.href = '/payment/failure';
        }
      );
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Premium Plan</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Unlock the Full Power of
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
              AI Startup Validation
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get access to advanced AI-powered analysis tools that give you the competitive edge to validate, refine, and pitch your startup idea with confidence.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div 
          className="max-w-lg mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Most Popular
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-700 p-8 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold">₹200</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Everything you need for comprehensive startup validation
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    >
                      <div className="text-primary mr-3 flex-shrink-0">
                        {feature.icon}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Upgrade to Premium'
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Cancel anytime • 7-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-bold text-xl mb-2">Advanced Analytics</h4>
            <p className="text-gray-600 dark:text-gray-300">
              ML-powered insights that go beyond basic validation to give you actionable intelligence.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-bold text-xl mb-2">Risk Mitigation</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Identify potential legal, technical, and market risks before they become costly problems.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-bold text-xl mb-2">Competitive Edge</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time competitor analysis and market intelligence to stay ahead of the competition.
            </p>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-zinc-700">
              <h4 className="font-semibold text-lg mb-2">What's included in the Premium plan?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                You get access to all advanced AI features including SWOT analysis, risk assessment, competitor analysis, brainstorm intelligence, investor Q&A preparation, and professional pitch deck exports.
              </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-zinc-700">
              <h4 className="font-semibold text-lg mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can cancel your subscription at any time. We also offer a 7-day money-back guarantee if you're not satisfied.
              </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-zinc-700">
              <h4 className="font-semibold text-lg mb-2">How does the AI analysis work?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI uses machine learning models, real-time data from multiple APIs (Google Trends, Crunchbase, news sources), and advanced NLP to provide comprehensive startup validation insights.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
