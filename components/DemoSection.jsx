"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, TrendingUp, Shield, Users } from 'lucide-react';
import DemoModal from './DemoModal';

const demoFeatures = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI-Powered Analysis",
    description: "Watch our AI analyze market trends in real-time"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Market Insights",
    description: "See how we gather data from Google Trends and Crunchbase"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Risk Assessment",
    description: "Discover potential risks before you invest time and money"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Competitor Analysis",
    description: "Learn about your competition and find your advantage"
  }
];

export default function DemoSection() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See Marshild in Action</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Watch how our AI validates startup ideas in minutes, not months
          </p>
          
          <motion.button
            onClick={() => setIsDemoModalOpen(true)}
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-primary/30 hover:bg-primary/90 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6" />
            Watch Interactive Demo
          </motion.button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {demoFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-4xl">🎯</div>
            <div>
              <h3 className="text-2xl font-bold">Try Our Sample Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See how we analyzed a successful FinTech startup idea
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div className="text-green-600 dark:text-green-400 font-bold text-2xl">87%</div>
              <div className="text-sm text-green-700 dark:text-green-300">Market Fit Score</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="text-blue-600 dark:text-blue-400 font-bold text-2xl">$2.3B</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Market Size</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <div className="text-purple-600 dark:text-purple-400 font-bold text-2xl">23%</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Growth Rate</div>
            </div>
          </div>
          
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            See Full Analysis Process
          </button>
        </motion.div>
      </div>

      {/* Demo Modal */}
      <DemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </section>
  );
}