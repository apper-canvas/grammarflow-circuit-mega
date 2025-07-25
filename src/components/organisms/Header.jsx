import React from "react";
import Button from "@/components/atoms/Button";
import StreakCounter from "@/components/molecules/StreakCounter";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Header = ({ user, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Good morning! Ready to learn?
            </h2>
            <p className="text-sm text-gray-600">
              Let&apos;s continue your grammar journey today
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <StreakCounter 
            streak={user?.streak || 0} 
            lastPractice={user?.lastPractice}
          />
          <Button variant="ghost" size="icon">
            <ApperIcon name="Bell" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;