"use client";

import React from 'react';
import { motion } from 'framer-motion';

const cards = [
  {
    title: 'The Problem',
    text: 'Founders waste months on ideas without validation, risking time, money, and motivation.',
    icon: '⏳',
  },
  {
    title: 'The Solution',
    text: 'CursorAI delivers instant AI-powered insights, risk scoring, and pitch deck exports to validate your idea before you build.',
    icon: '🚀',
  },
];

export default function ProblemSolutionSection() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Founders Choose <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CursorAI</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className="rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-100 dark:border-zinc-800 bg-background dark:bg-darkbg overflow-hidden relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.7 }}
              whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="text-6xl mb-6 relative z-10">{card.icon}</span>
              <h3 className="font-bold text-2xl mb-4 relative z-10">{card.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg relative z-10">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
