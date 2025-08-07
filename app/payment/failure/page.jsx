"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailurePage() {
  const handleRetryPayment = () => {
    // Redirect back to pricing page
    window.location.href = '/pricing';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Failure Icon */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Payment Failed
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Don't worry, no charges were made to your account.
          </p>
        </motion.div>

        {/* Failure Card */}
        <motion.div 
          className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-700 p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Something went wrong with your payment
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your payment could not be processed. This might be due to insufficient funds, 
              network issues, or bank restrictions. Please try again or contact your bank.
            </p>
          </div>

          {/* Common Reasons */}
          <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <HelpCircle className="w-5 h-5 text-primary mr-2" />
              Common Reasons for Payment Failure
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Insufficient balance in your account
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Daily transaction limit exceeded
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Network connectivity issues
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Card expired or blocked by bank
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Incorrect card details entered
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleRetryPayment}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-2xl font-semibold text-center hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <Link 
              href="/" 
              className="flex-1 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-2xl font-semibold text-center hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Support Information */}
        <motion.div 
          className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you continue to face issues, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@marshild.com" 
              className="text-primary hover:text-accent transition-colors font-medium"
            >
              Email: support@marshild.com
            </a>
            <a 
              href="tel:+911234567890" 
              className="text-primary hover:text-accent transition-colors font-medium"
            >
              Phone: +91 12345 67890
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}