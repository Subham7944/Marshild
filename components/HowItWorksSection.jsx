"use client";

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Enter your idea',
    description: 'Describe your startup concept in simple terms. No jargon needed.',
    icon: '💡',
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    title: 'AI analyzes & scores it',
    description: 'Our AI engine evaluates market fit, competition, and execution risks.',
    icon: '🤖',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    title: 'Get instant results',
    description: 'Receive your SWOT, risk score, and market fit analysis in seconds.',
    icon: '⚡',
    color: 'from-pink-500/20 to-orange-500/20',
  },
];

export default function HowItWorksSection() {
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
              className="relative rounded-2xl shadow-lg overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.7 }}
              whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-50`}></div>
              <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                <div className="text-6xl mb-6">{step.icon}</div>
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-2xl mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
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
          <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-primary/30 hover:bg-primary/90 transition">
            Try it Free
          </button>
        </motion.div>
      </div>
    </section>
  );
}
