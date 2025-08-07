"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How accurate is Marshild's idea validation?",
    answer: "Marshild uses advanced AI models trained on thousands of successful and failed startups. Our validation accuracy is approximately 85% when comparing to real-world outcomes, making it a reliable first step in your startup journey."
  },
  {
    question: 'Can I export my validation results?',
    answer: 'Yes! Free users can export a basic summary PDF. Premium users can export comprehensive reports, editable pitch decks, and investor-ready presentations.'
  },
  {
    question: 'How does the market fit score work?',
    answer: 'Our market fit score analyzes your idea against current market trends, competitor landscapes, and consumer demand patterns. The score ranges from 1-100, with 70+ indicating strong market potential.'
  },
  {
    question: 'Is my startup idea data secure?',
    answer: 'Absolutely. We use bank-level encryption and never share your idea details with third parties. Your intellectual property remains 100% yours.'
  },
  {
    question: 'Can I validate multiple ideas?',
    answer: 'Free users can validate up to 3 ideas per month. Premium users get unlimited idea validations, perfect for serial entrepreneurs and innovation teams.'
  },
  {
    question: 'How long does the validation process take?',
    answer: 'Most idea validations complete in under 5 minutes. Complex ideas with deep technical components may take up to 10 minutes for comprehensive analysis.'
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-24 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about Marshild
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <button
                className={`w-full text-left p-6 rounded-xl flex justify-between items-center transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <span className="text-2xl transition-transform duration-300 transform">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-b-xl border-t-0 border border-gray-200 dark:border-zinc-700">
                      <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
          <button className="bg-primary/10 text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition">
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}
