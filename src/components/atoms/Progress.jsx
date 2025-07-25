import React from "react";
import { cn } from "@/utils/cn";

const Progress = React.forwardRef(({ 
  className, 
  value = 0, 
  max = 100,
  variant = "default",
  ...props 
}, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variants = {
    default: "bg-primary-500",
    success: "bg-success-500",
    accent: "bg-accent-500"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 ease-out",
          variants[variant]
        )}
        style={{
          transform: `translateX(-${100 - percentage}%)`
        }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;