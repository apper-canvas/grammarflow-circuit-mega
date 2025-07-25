import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Learn from "@/components/pages/Learn";
import Practice from "@/components/pages/Practice";
import Progress from "@/components/pages/Progress";
import Profile from "@/components/pages/Profile";
import PlacementTest from "@/components/organisms/PlacementTest";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
<Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="learn" element={<Learn />} />
            <Route path="practice" element={<Practice />} />
            <Route path="progress" element={<Progress />} />
            <Route path="profile" element={<Profile />} />
            <Route 
              path="placement-test" 
              element={
                <PlacementTest 
                  onComplete={(results) => {
                    console.log("Placement test completed:", results);
                    // In a real app, save results and redirect
                  }} 
                />
              } 
            />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;