import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavigationItem = ({ to, icon, label, badge, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg" 
          : "text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700",
        className
      )}
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            size={20} 
            className={cn(
              "transition-colors duration-200",
              isActive ? "text-white" : "text-gray-600 group-hover:text-primary-600"
            )}
          />
          <span className="font-medium">{label}</span>
          {badge && (
            <span className={cn(
              "ml-auto px-2 py-1 text-xs font-semibold rounded-full",
              isActive 
                ? "bg-white/20 text-white" 
                : "bg-accent-100 text-accent-800"
            )}>
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;