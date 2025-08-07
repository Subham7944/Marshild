"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: 'Marshild\'s comprehensive risk assessment saved me from a costly mistake. The legal and technical risk analysis revealed critical issues I hadn\'t considered. Within 5 minutes, I had a complete roadmap of potential challenges and mitigation strategies.',
    name: 'Priya Sharma',
    title: 'FinTech Founder & Former Goldman Sachs VP',
    avatar: '👩‍💼',
  },
  {
    quote: 'Before Marshild, I spent weeks researching competitors manually. Their AI-powered competitor analysis gave me insights in minutes that would have taken me months to discover. The market positioning recommendations were incredibly valuable.',
    name: 'David Rodriguez',
    title: 'CEO, TechFlow Solutions',
    avatar: '👨‍💻',
  },
  {
    quote: 'The SWOT analysis and brainstorming features helped me identify revenue streams I never considered. I presented these insights to investors and secured ₹2.5 crores in seed funding. Marshild literally paid for itself 12,500 times over.',
    name: 'Ananya Gupta',
    title: 'Founder, EduTech Innovations',
    avatar: '🧑‍🚀',
  },
  {
    quote: 'As a serial entrepreneur, I\'ve used many validation tools. Marshild\'s Google Trends integration and market fit analysis are unmatched. The detailed reports gave me the confidence to pivot my business model early, saving months of development.',
    name: 'Rajesh Kumar',
    title: 'Serial Entrepreneur & Angel Investor',
    avatar: '👨‍🔬',
  },
  {
    quote: 'Marshild\'s risk assessment identified regulatory challenges specific to the Indian healthcare market that I was completely unaware of. This early insight helped me build compliance into our product from day one, avoiding costly redesigns later.',
    name: 'Dr. Meera Nair',
    title: 'Founder, HealthTech Ventures',
    avatar: '👩‍⚕️',
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
            Join thousands of founders who've validated their ideas with Marshild
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
              className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 md:p-10 text-center relative min-h-[300px] flex flex-col justify-center"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-2xl">
                {testimonials[activeIndex].avatar}
              </div>
              
              <p className="text-lg md:text-xl italic mb-6 leading-relaxed text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
                "{testimonials[activeIndex].quote}"
              </p>
              
              <div className="mt-6">
                <p className="font-bold text-xl text-gray-900 dark:text-white">{testimonials[activeIndex].name}</p>
                <p className="text-primary font-medium mt-1">{testimonials[activeIndex].title}</p>
                <div className="flex justify-center mt-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
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