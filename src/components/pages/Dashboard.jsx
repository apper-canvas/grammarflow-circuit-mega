import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import LessonCard from "@/components/molecules/LessonCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import userService from "@/services/api/userService";
import lessonService from "@/services/api/lessonService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [recommendedLessons, setRecommendedLessons] = useState([]);
  const [recentMistakes, setRecentMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [user, lessons, mistakes] = await Promise.all([
        userService.getCurrentUser(),
        lessonService.getRecommended(3),
        userService.getRecentMistakes(5)
      ]);

      setUserData(user);
      setRecommendedLessons(lessons);
      setRecentMistakes(mistakes);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDailyPractice = () => {
    navigate("/practice");
    toast.success("Starting your daily practice session!");
  };

  const handleStartLesson = (lesson) => {
    navigate(`/learn/${lesson.Id}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  if (!userData) return <Empty title="No user data found" />;

  const stats = [
    {
      title: "Current Streak",
      value: `${userData.streak} days`,
      icon: "Flame",
      variant: "accent",
      trend: userData.streak > 0 ? "up" : null,
      trendValue: userData.streak > 0 ? "Keep it up!" : null
    },
    {
      title: "Lessons Completed",
      value: userData.completedLessons.length,
      icon: "BookOpen",
      variant: "success",
      trend: "up",
      trendValue: "+3 this week"
    },
    {
      title: "Accuracy Rate",
      value: `${userData.averageAccuracy}%`,
      icon: "Target",
      variant: "primary",
      trend: userData.accuracyTrend === "up" ? "up" : "down",
      trendValue: `${Math.abs(userData.accuracyChange)}% from last week`
    },
    {
      title: "Total Practice Time",
      value: `${userData.totalMinutes}min`,
      icon: "Clock",
      variant: "default",
      trend: "up",
      trendValue: "+45min this week"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, Grammar Learner! 🎯
            </h1>
            <p className="text-primary-100 mb-6">
              You&apos;re on a {userData.streak}-day streak! Ready for today&apos;s challenge?
            </p>
            <Button 
              onClick={handleStartDailyPractice}
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-50"
            >
              <ApperIcon name="Play" size={20} className="mr-2" />
              Start Daily Practice
            </Button>
          </div>
          <div className="hidden md:block">
            <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <ApperIcon name="Trophy" size={64} className="text-accent-300" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Lessons */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recommended for You
            </h2>
            <Button 
              variant="outline" 
              onClick={() => navigate("/learn")}
            >
              View All Lessons
            </Button>
          </div>

          {recommendedLessons.length > 0 ? (
            <div className="space-y-4">
              {recommendedLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LessonCard
                    lesson={lesson}
                    isRecommended={true}
                    onClick={() => handleStartLesson(lesson)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <Empty 
              title="No lessons available" 
              description="Complete the placement test to get personalized recommendations"
              action={() => navigate("/placement-test")}
              actionLabel="Take Placement Test"
            />
          )}
        </div>

        {/* Recent Mistakes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Mistakes
          </h2>
          
          <Card className="p-6">
            {recentMistakes.length > 0 ? (
              <div className="space-y-4">
                {recentMistakes.map((mistake, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {mistake.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {mistake.date}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {mistake.rule}
                    </p>
                    <p className="text-xs text-gray-600">
                      {mistake.example}
                    </p>
                  </motion.div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => navigate("/progress")}
                >
                  View All Mistakes
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" size={48} className="text-success-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No recent mistakes!</p>
                <p className="text-sm text-gray-500">
                  You&apos;re doing great. Keep practicing to maintain your accuracy.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;