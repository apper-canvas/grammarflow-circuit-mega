import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const QuizQuestion = ({ 
  question, 
  onAnswer, 
  showFeedback, 
  selectedAnswer, 
  isCorrect 
}) => {
  const [hoveredOption, setHoveredOption] = useState(null);

  const getOptionStyle = (optionIndex) => {
    if (!showFeedback) {
      return selectedAnswer === optionIndex 
        ? "border-primary-500 bg-primary-50" 
        : hoveredOption === optionIndex 
          ? "border-gray-300 bg-gray-50" 
          : "border-gray-200 bg-white";
    }

    if (optionIndex === question.correctAnswer) {
      return "border-success-500 bg-success-50";
    }
    
    if (selectedAnswer === optionIndex && !isCorrect) {
      return "border-red-500 bg-red-50";
    }
    
    return "border-gray-200 bg-white opacity-60";
  };

  return (
    <Card className="p-8">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {question.text}
        </h3>
        {question.context && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 italic">"{question.context}"</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: showFeedback ? 1 : 1.01 }}
            whileTap={{ scale: showFeedback ? 1 : 0.99 }}
          >
            <button
              className={cn(
                "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed",
                getOptionStyle(index)
              )}
              onClick={() => !showFeedback && onAnswer(index)}
              onMouseEnter={() => setHoveredOption(index)}
              onMouseLeave={() => setHoveredOption(null)}
              disabled={showFeedback}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "mt-6 p-4 rounded-lg border-l-4",
              isCorrect 
                ? "bg-success-50 border-success-500" 
                : "bg-red-50 border-red-500"
            )}
          >
            <div className="flex items-start space-x-3">
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold",
                isCorrect ? "bg-success-500" : "bg-red-500"
              )}>
                {isCorrect ? "✓" : "✗"}
              </div>
              <div>
                <p className={cn(
                  "font-semibold mb-1",
                  isCorrect ? "text-success-800" : "text-red-800"
                )}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </p>
                <p className={cn(
                  "text-sm",
                  isCorrect ? "text-success-700" : "text-red-700"
                )}>
                  {question.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default QuizQuestion;