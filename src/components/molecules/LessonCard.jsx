import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const LessonCard = ({ 
  lesson, 
  isCompleted, 
  isRecommended, 
  progress = 0, 
  onClick,
  className 
}) => {
  const difficultyColors = {
    1: "text-success-600 bg-success-100",
    2: "text-accent-600 bg-accent-100", 
    3: "text-red-600 bg-red-100"
  };

  const difficultyLabels = {
    1: "Beginner",
    2: "Intermediate", 
    3: "Advanced"
  };

  return (  
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "p-6 cursor-pointer transition-all duration-300 hover:shadow-xl",
          isRecommended && "ring-2 ring-primary-500 bg-gradient-to-br from-primary-50 to-white",
          isCompleted && "bg-gradient-to-br from-success-50 to-white border-success-200",
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
              {isRecommended && (
                <Badge variant="accent" className="text-xs">
                  <ApperIcon name="Star" size={12} className="mr-1" />
                  Recommended
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
            <div className="flex items-center space-x-2">
              <Badge 
                className={cn(
                  "text-xs",
                  difficultyColors[lesson.difficulty]
                )}
              >
                {difficultyLabels[lesson.difficulty]}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {lesson.category}
              </Badge>
            </div>
          </div>
          <div className="ml-4">
            {isCompleted ? (
              <div className="p-2 bg-success-100 rounded-lg">
                <ApperIcon name="CheckCircle" size={20} className="text-success-600" />
              </div>
            ) : (
              <div className="p-2 bg-gray-100 rounded-lg">
                <ApperIcon name="BookOpen" size={20} className="text-gray-600" />
              </div>
            )}
          </div>
        </div>
        
        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default LessonCard;