import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  variant = "default"
}) => {
  const variants = {
    default: "hover:shadow-xl hover:-translate-y-1",
    accent: "bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200 hover:shadow-xl hover:-translate-y-1",
    success: "bg-gradient-to-br from-success-50 to-success-100 border-success-200 hover:shadow-xl hover:-translate-y-1",
    primary: "bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 hover:shadow-xl hover:-translate-y-1"
  };

  return (
    <Card className={cn("p-6 transition-all duration-300", variants[variant], className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16}
                className={cn(
                  trend === "up" ? "text-success-500" : "text-red-500"
                )}
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-success-600" : "text-red-600"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl">
          <ApperIcon name={icon} size={24} className="text-primary-600" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;