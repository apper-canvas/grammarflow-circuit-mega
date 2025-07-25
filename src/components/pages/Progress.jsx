import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import ProgressChart from "@/components/organisms/ProgressChart";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import progressService from "@/services/api/progressService";
import userService from "@/services/api/userService";

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [mistakePatterns, setMistakePatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [progress, badges, mistakes] = await Promise.all([
        progressService.getOverallProgress(),
        userService.getAchievements(),
        progressService.getMistakePatterns()
      ]);

      setProgressData(progress);
      setAchievements(badges);
      setMistakePatterns(mistakes);
    } catch (err) {
      setError("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProgressData} />;
  if (!progressData) return <Empty title="No progress data available" />;

  const stats = [
    {
      title: "Overall Accuracy",
      value: `${progressData.overallAccuracy}%`,
      icon: "Target",
      variant: "primary",
      trend: progressData.accuracyTrend,
      trendValue: `${Math.abs(progressData.accuracyChange)}% from last week`
    },
    {
      title: "Lessons Completed",
      value: progressData.lessonsCompleted,
      icon: "BookOpen",
      variant: "success",
      trend: "up",
      trendValue: `${progressData.lessonsThisWeek} this week`
    },
    {
      title: "Practice Sessions",
      value: progressData.totalSessions,
      icon: "Brain",
      variant: "accent",
      trend: "up",
      trendValue: `${progressData.sessionsThisWeek} this week`
    },
    {
      title: "Current Streak",
      value: `${progressData.currentStreak} days`,
      icon: "Flame",
      variant: "default",
      trend: progressData.currentStreak > 0 ? "up" : null,
      trendValue: progressData.currentStreak > 0 ? "Keep it up!" : null
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Your Progress
        </h1>
        <p className="text-gray-600">
          Track your grammar learning journey and see how far you&apos;ve come
        </p>
      </div>

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

      {/* Progress Chart */}
      <ProgressChart userId={progressData.userId} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Performance by Category
          </h3>
          
          <div className="space-y-4">
            {progressData.categoryPerformance.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    category.accuracy >= 80 ? "bg-success-100" :
                    category.accuracy >= 60 ? "bg-accent-100" : "bg-red-100"
                  }`}>
                    <ApperIcon 
                      name="BookOpen" 
                      size={16} 
                      className={
                        category.accuracy >= 80 ? "text-success-600" :
                        category.accuracy >= 60 ? "text-accent-600" : "text-red-600"
                      }
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">
                      {category.questionsAnswered} questions
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={
                    category.accuracy >= 80 ? "success" :
                    category.accuracy >= 60 ? "accent" : "outline"
                  }
                >
                  {category.accuracy}%
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Achievements
            </h3>
            <Badge variant="secondary">
              {achievements.filter(a => a.unlocked).length} / {achievements.length}
            </Badge>
          </div>

          {achievements.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((badge, index) => (
                <motion.div
                  key={badge.Id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                    badge.unlocked 
                      ? "border-accent-200 bg-accent-50 hover:shadow-lg" 
                      : "border-gray-200 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <h4 className={`font-medium text-sm mb-1 ${
                    badge.unlocked ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {badge.title}
                  </h4>
                  <p className={`text-xs ${
                    badge.unlocked ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {badge.description}
                  </p>
                  {badge.unlocked && badge.unlockedDate && (
                    <p className="text-xs text-accent-600 mt-2">
                      Earned {badge.unlockedDate}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Award" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No achievements yet</p>
              <p className="text-sm text-gray-500">
                Keep practicing to unlock your first badge!
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Common Mistakes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Areas for Improvement
        </h3>

        {mistakePatterns.length > 0 ? (
          <div className="space-y-4">
            {mistakePatterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="AlertTriangle" size={16} className="text-red-600" />
                    <h4 className="font-medium text-red-900">{pattern.rule}</h4>
                  </div>
                  <p className="text-sm text-red-700 mb-2">{pattern.description}</p>
                  <p className="text-xs text-red-600">
                    Missed {pattern.mistakeCount} times • Last seen {pattern.lastSeen}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <ApperIcon name="BookOpen" size={14} className="mr-1" />
                  Review
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ApperIcon name="CheckCircle" size={48} className="text-success-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No common mistakes found!</p>
            <p className="text-sm text-gray-500">
              You&apos;re doing great. Keep up the excellent work.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Progress;