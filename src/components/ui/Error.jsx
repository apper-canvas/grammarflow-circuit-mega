import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <Card className={cn("p-8 text-center", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-red-100 rounded-full">
          <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;