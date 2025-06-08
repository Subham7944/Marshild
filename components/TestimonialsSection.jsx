"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: 'CursorAI helped me avoid months of wasted dev time. The SWOT and risk analysis were spot on!',
    name: 'Alex Chen',
    title: 'Indie Hacker',
    avatar: '👨‍💻',
  },
  {
    quote: 'I used CursorAI to validate my SaaS idea before pitching to investors. Game changer!',
    name: 'Samira Patel',
    title: 'SaaS Founder',
    avatar: '👩‍💼',
  },
  {
    quote: 'The instant market fit score gave me the confidence to move forward with my startup.',
    name: 'Jordan Taylor',
    title: 'First-time Founder',
    avatar: '🧑‍🚀',
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Founders Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of founders who've validated their ideas with CursorAI
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute top-10 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl -z-10"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-10 text-center relative"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-2xl">
                {testimonials[activeIndex].avatar}
              </div>
              
              <p className="text-2xl italic mb-8">"{testimonials[activeIndex].quote}"</p>
              
              <div>
                <p className="font-bold text-lg">{testimonials[activeIndex].name}</p>
                <p className="text-primary">{testimonials[activeIndex].title}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-primary w-8' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
