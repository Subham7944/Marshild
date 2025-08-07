"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, TrendingUp } from "lucide-react";

export default function AnalysisProgressModal({ isAnalyzing, analysisSteps, currentStep, completedSteps }) {
  return (
    <AnimatePresence>
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 p-[2px] rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-50" />
            </div>
            
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center"
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Your Startup</h3>
              <p className="text-gray-600 dark:text-gray-300">Our AI is processing your business idea...</p>
            </div>

            <div className="space-y-4 relative">
              {analysisSteps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = completedSteps.has(index);
                const isPending = index > currentStep;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : isCompleted
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-700/50"
                    } relative`}
                  >
                    <div
                      className={`p-2 rounded-lg ${isCompleted ? "bg-green-100 dark:bg-green-900/30" : step.bgColor}`}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={isActive ? { rotate: 360 } : {}}
                          transition={
                            isActive ? { duration: 2, repeat: Infinity, ease: "linear" } : {}
                          }
                        >
                          <step.icon className={`w-5 h-5 ${isActive ? step.color : "text-gray-400"}`} />
                        </motion.div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          isActive
                            ? "text-blue-900 dark:text-blue-100"
                            : isCompleted
                              ? "text-green-900 dark:text-green-100"
                              : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p
                        className={`text-sm ${
                          isActive
                            ? "text-blue-700 dark:text-blue-300"
                            : isCompleted
                              ? "text-green-700 dark:text-green-300"
                              : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {isActive && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: step.duration / 1000, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <div className="flex justify-center space-x-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few moments...</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
