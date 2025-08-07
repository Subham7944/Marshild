"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const features = {
  Free: [
    { 
      title: 'SWOT Analysis', 
      desc: 'Instant strengths, weaknesses, opportunities, and threats.',
      icon: '📊' 
    },
    { 
      title: 'Market Fit Score', 
      desc: 'See if your idea fits the market.',
      icon: '🎯' 
    },
    { 
      title: 'Try a Demo Idea', 
      desc: 'Test with a pre-filled example.',
      icon: '🔍' 
    },
  ],
  Premium: [
    { 
      title: 'Investor Q&A', 
      desc: 'AI answers tough investor questions.',
      icon: '💬' 
    },
    { 
      title: 'Editable Pitch Decks', 
      desc: 'Export and edit your pitch deck.',
      icon: '📑' 
    },
    { 
      title: 'Advanced Risk Analysis', 
      desc: 'Deeper risk scoring and insights.',
      icon: '📈' 
    },
  ],
};

export default function FeaturesSection() {
  const [tab, setTab] = useState('Free');
  
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
            className="grid md:grid-cols-3 gap-8"
          >
            {features[tab].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl shadow-lg p-8 bg-background dark:bg-darkbg border border-gray-100 dark:border-zinc-800 group hover:border-primary dark:hover:border-primary transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h4 className="font-bold text-xl mb-3">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
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
          <button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-primary/30 hover:opacity-90 transition">
            {tab === 'Free' ? 'Try Free Features Now' : 'Upgrade to Premium'}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
