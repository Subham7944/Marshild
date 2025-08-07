"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Validate Your Idea in 5 Minutes
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Discover the power of instant AI-driven validation for your startup idea.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-primary/30 hover:bg-primary/90 transition">
                Validate Your Idea Now
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary/5 transition">
                See How It Works
              </button>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="text-primary text-2xl">∞</div>
                <div>
                  <p className="font-medium">Monetize on Autopilot</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-primary text-2xl">⚡</div>
                <div>
                  <p className="font-medium">AI-Powered Licensing</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-xl transform -rotate-3 hover:rotate-0 transition duration-500">
                  <div className="relative h-64 w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">📊</div>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition duration-500 mt-8">
                  <div className="relative h-48 w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">💡</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-12">
                <div className="rounded-2xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition duration-500">
                  <div className="relative h-56 w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">🚀</div>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl transform -rotate-3 hover:rotate-0 transition duration-500 mt-8">
                  <div className="relative h-40 w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">🧠</div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-darkbg text-primary px-6 py-3 rounded-full shadow-xl flex items-center gap-2 hover:bg-primary hover:text-white transition z-20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">▶</span>
              <span>Watch demo</span>
            </motion.button>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-darkbg"></div>
            ))}
          </div>
          <span className="text-gray-600 dark:text-gray-300 text-sm">10,000+ Top Creators</span>
        </motion.div>
      </div>
    </section>
  );
}
