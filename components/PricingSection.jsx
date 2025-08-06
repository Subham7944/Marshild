"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started with idea validation',
    features: [
      'Market Fit Analysis',
      'Try Demo Ideas',
      'Basic validation reports',
      'Google Trends integration',
      'Community support'
    ],
    buttonText: 'Get Started Free',
    popular: false,
    priceId: null
  },
  {
    name: 'Premium',
    price: '₹200',
    period: '/month',
    description: 'Complete startup validation toolkit for serious entrepreneurs',
    features: [
      'Everything in Basic',
      'SWOT Analysis',
      'Risk Assessment',
      'Competitor Analysis',
      'AI Brainstorming',
      'Advanced reports',
      'Export to PDF',
      'Priority support',
      'Unlimited validations'
    ],
    buttonText: 'Upgrade to Premium',
    popular: true,
    priceId: 'premium_monthly'
  }
];

export default function PricingSection() {
  const [isLoading, setIsLoading] = useState(false);

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

  const handlePayment = async (plan) => {
    if (plan.priceId === null) {
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
    <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start free, upgrade when you need advanced validation tools
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary shadow-xl' 
                  : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan)}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/30'
                    : 'bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {plan.popular && <Zap className="w-4 h-4" />}
                    {plan.buttonText}
                  </div>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            🔒 Secure payments powered by Razorpay • Cancel anytime • No hidden fees
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
            <span>✓ 7-day money back guarantee</span>
            <span>✓ Instant access</span>
            <span>✓ No setup fees</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
