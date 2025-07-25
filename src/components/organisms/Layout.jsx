import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock user data - in a real app this would come from context/state
  const mockUser = {
    name: "Grammar Learner",
    level: "Intermediate",
    streak: 7,
    lastPractice: new Date().toISOString()
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <AnimatePresence>
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-80">
        <Header user={mockUser} onMenuClick={handleMenuClick} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;