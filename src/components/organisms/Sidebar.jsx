import React from "react";
import { useLocation } from "react-router-dom";
import Card from "@/components/atoms/Card";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

const navigationItems = [
    { to: "/", icon: "Home", label: "Dashboard" },
    { to: "/learn", icon: "BookOpen", label: "Learn" },
    { to: "/courses", icon: "BookOpenCheck", label: "Courses" },
    { to: "/practice", icon: "Brain", label: "Practice" },
    { to: "/progress", icon: "TrendingUp", label: "Progress" },
    { to: "/profile", icon: "User", label: "Profile" },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl">
            <ApperIcon name="GraduationCap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">GrammarFlow</h1>
            <p className="text-sm text-gray-600">AI Grammar Tutor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      {/* User Section */}
      <div className="p-6 border-t border-gray-200">
        <Card className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ApperIcon name="User" size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Grammar Learner</p>
              <p className="text-sm text-gray-600">Intermediate Level</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative flex w-80 flex-col bg-white shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-gray-600" />
            </button>
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;