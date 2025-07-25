import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
const StreakCounter = ({ streak, lastPractice }) => {
  const isActiveToday = lastPractice && 
    new Date(lastPractice).toDateString() === new Date().toDateString();

  return (
    <motion.div 
      className="flex items-center space-x-2 bg-gradient-to-r from-accent-50 to-accent-100 px-4 py-2 rounded-full border border-accent-200"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={isActiveToday ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ duration: 0.5, repeat: isActiveToday ? Infinity : 0, repeatDelay: 2 }}
      >
        <ApperIcon 
          name="Flame" 
          size={20} 
          className={cn(
            "transition-colors duration-300",
            streak > 0 ? "text-accent-600" : "text-gray-400"
          )}
        />
      </motion.div>
      <span className="font-semibold text-accent-800">
        {streak} day{streak !== 1 ? "s" : ""} streak
      </span>
    </motion.div>
  );
};

export default StreakCounter;