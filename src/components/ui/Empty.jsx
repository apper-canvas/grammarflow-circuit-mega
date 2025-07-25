import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found", 
  description, 
  action, 
  actionLabel = "Get Started",
  icon = "BookOpen",
  className 
}) => {
  return (
    <Card className={cn("p-12 text-center", className)}>
      <div className="flex flex-col items-center space-y-6">
        <div className="p-6 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full">
          <ApperIcon name={icon} size={48} className="text-primary-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-gray-600 max-w-md">{description}</p>
          )}
        </div>
        {action && (
          <Button onClick={action} className="mt-4">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;