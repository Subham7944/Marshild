"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90 z-0"></div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Validate Your Idea Now
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-10 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Join founders who build smarter. Get instant AI insights and take your next step with confidence.
          </motion.p>
          
          <motion.form 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 rounded-full text-gray-900 w-full sm:w-auto min-w-[300px] focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button 
              type="submit" 
              className="bg-white text-primary px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-white/30 hover:bg-gray-100 transition w-full sm:w-auto"
            >
              Sign Up Free
            </button>
          </motion.form>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button className="text-white underline hover:text-white/80 transition text-lg">
              Try a Demo Idea
            </button>
            
            <p className="mt-8 text-sm text-white/70">
              No credit card required. Free plan includes 3 idea validations per month.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
