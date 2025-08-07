"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function PaymentSuccessPage() {
  const { user } = useUser();
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  useEffect(() => {
    // Get subscription details from localStorage
    try {
      const subscription = localStorage.getItem('marshild_subscription');
      if (subscription) {
        setSubscriptionDetails(JSON.parse(subscription));
      }
    } catch (error) {
      console.error('Error loading subscription details:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Icon */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Welcome to Marshild Premium! 🎉
          </p>
        </motion.div>

        {/* Success Card */}
        <motion.div 
          className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-700 p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Premium Activated</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Hi {user?.firstName || 'there'}! Your premium features are now active.
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You now have access to all advanced AI-powered startup validation tools.
            </p>
          </div>

          {subscriptionDetails && (
            <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Subscription Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                  <p className="font-medium">Premium Monthly</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <p className="font-medium">₹200/month</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <p className="font-medium text-green-600 dark:text-green-400">Active</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Next Billing:</span>
                  <p className="font-medium">
                    {subscriptionDetails.endDate ? 
                      new Date(subscriptionDetails.endDate).toLocaleDateString('en-IN') : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Premium Features Unlocked */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Zap className="w-5 h-5 text-primary mr-2" />
              Premium Features Unlocked
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Advanced ML-Powered SWOT Analysis',
                'Deep Risk Assessment',
                'Real-time Competitor Analysis',
                'Brainstorm Intelligence',
                'AI Investor Q&A Preparation',
                'Professional Pitch Deck Export',
                'Priority Support',
                'Advanced Analytics'
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                >
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dashboard" 
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-2xl font-semibold text-center hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Start Using Premium Features
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              href="/account" 
              className="flex-1 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-2xl font-semibold text-center hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all duration-300"
            >
              Manage Subscription
            </Link>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to validate your startup idea with advanced AI insights?
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-primary hover:text-accent transition-colors font-medium"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}