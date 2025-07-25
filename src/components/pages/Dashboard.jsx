import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import userService from "@/services/api/userService";
import lessonService from "@/services/api/lessonService";
import ApperIcon from "@/components/ApperIcon";
import Practice from "@/components/pages/Practice";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import LessonCard from "@/components/molecules/LessonCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Dashboard = () => {
  const navigate = useNavigate();
const [userData, setUserData] = useState(null);
  const [recommendedLessons, setRecommendedLessons] = useState([]);
  const [recentMistakes, setRecentMistakes] = useState([]);
  const [calendarLessons, setCalendarLessons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const [user, lessons, mistakes, calendarData] = await Promise.all([
        userService.getCurrentUser(),
        lessonService.getRecommended(3),
        userService.getRecentMistakes(5),
        lessonService.getByDateRange(startDate, endDate)
      ]);

      setUserData(user);
      setRecommendedLessons(lessons);
      setRecentMistakes(mistakes);
      setCalendarLessons(calendarData);
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

      {/* Curriculum Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Curriculum Calendar
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
              <span className="text-lg font-semibold px-4">
                {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
              >
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Calendar Header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {(() => {
              const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
              const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
              const startDate = new Date(firstDay);
              startDate.setDate(startDate.getDate() - firstDay.getDay());
              
              const days = [];
              const current = new Date(startDate);
              
for (let i = 0; i < 42; i++) {
                const isCurrentMonth = current.getMonth() === selectedDate.getMonth();
                const isToday = current.toDateString() === new Date().toDateString();
                const dateStr = current.toISOString().split('T')[0];
                
                // Robust date matching to handle different formats
                const dayLessons = calendarLessons.filter(lesson => {
                  if (!lesson.scheduledDate) return false;
                  
                  // Normalize the lesson date to YYYY-MM-DD format
                  let lessonDateStr;
                  try {
                    const lessonDate = new Date(lesson.scheduledDate);
                    lessonDateStr = lessonDate.toISOString().split('T')[0];
                  } catch (e) {
                    // If date parsing fails, try direct string comparison
                    lessonDateStr = lesson.scheduledDate.toString().split('T')[0];
                  }
                  
                  return lessonDateStr === dateStr;
                });
days.push(
                  <div
                    key={current.toISOString()}
                    className={`min-h-[100px] p-2 border border-gray-100 rounded-lg ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'ring-2 ring-primary-500' : ''} ${
                      dayLessons.length > 0 ? 'hover:bg-blue-50 cursor-pointer' : 'hover:bg-gray-50'
                    } transition-colors`}
                    onClick={() => {
                      if (dayLessons.length > 0) {
                        setSelectedEvent({
                          date: current.toLocaleDateString(),
                          lessons: dayLessons
                        });
                        setShowEventModal(true);
                      }
                    }}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${isToday ? 'text-primary-600' : ''}`}>
                      {current.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayLessons.slice(0, 2).map(lesson => (
                        <div
                          key={lesson.Id}
                          className={`text-xs px-2 py-1 rounded text-white truncate ${
                            lesson.category === 'tenses' ? 'bg-primary-500' :
                            lesson.category === 'articles' ? 'bg-secondary-500' :
                            lesson.category === 'prepositions' ? 'bg-accent-500' :
                            lesson.category === 'pronouns' ? 'bg-success-500' :
                            lesson.category === 'conditionals' ? 'bg-purple-500' :
                            lesson.category === 'adjectives' ? 'bg-pink-500' :
                            lesson.category === 'parts-of-speech' ? 'bg-blue-500' :
                            lesson.category === 'figures-of-speech' ? 'bg-indigo-500' :
                            'bg-gray-500'
                          }`}
                          title={`${lesson.title} - ${lesson.estimatedTime} min`}
                        >
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-xs opacity-80">{lesson.estimatedTime}min</div>
                        </div>
                      ))}
                      {dayLessons.length > 2 && (
                        <div className="text-xs text-primary-600 px-2 font-medium">
                          +{dayLessons.length - 2} more events
                        </div>
                      )}
                      {dayLessons.length > 0 && (
                        <div className="text-xs text-gray-500 px-2 mt-1">
                          Click to view details
                        </div>
                      )}
                    </div>
                  </div>
                );
                current.setDate(current.getDate() + 1);
              }
              
              return days;
            })()}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-primary-500 rounded mr-2"></div>
              <span>Tenses</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-secondary-500 rounded mr-2"></div>
              <span>Articles</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-accent-500 rounded mr-2"></div>
              <span>Prepositions</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-success-500 rounded mr-2"></div>
              <span>Pronouns</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Parts of Speech</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-indigo-500 rounded mr-2"></div>
              <span>Figures of Speech</span>
            </div>
          </div>
        </Card>
      </motion.div>

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

      {/* Curriculum Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowEventModal(false)}></div>
            </div>

            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Curriculum Schedule
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedEvent.date} • {selectedEvent.lessons.length} event{selectedEvent.lessons.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedEvent.lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {lesson.title}
                        </h4>
                        <p className="text-gray-600 mb-3">
                          {lesson.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge
                            variant={
                              lesson.category === 'tenses' ? 'primary' :
                              lesson.category === 'articles' ? 'secondary' :
                              lesson.category === 'prepositions' ? 'accent' :
                              lesson.category === 'pronouns' ? 'success' :
                              'default'
                            }
                          >
                            {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
                          </Badge>
                          <Badge variant="outline">
                            Level {lesson.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {lesson.estimatedTime} minutes
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900 flex items-center gap-2">
                          <ApperIcon name="Clock" size={16} />
                          Session Details
                        </h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Duration: {lesson.estimatedTime} minutes</div>
                          <div>Difficulty: Level {lesson.difficulty}</div>
                          <div>Assigned Teacher: Grammar AI Assistant</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900 flex items-center gap-2">
                          <ApperIcon name="BookOpen" size={16} />
                          Learning Objectives
                        </h5>
                        <div className="text-sm text-gray-600">
                          {lesson.content?.explanation || "Interactive lesson with practical exercises"}
                        </div>
                      </div>
                    </div>

                    {lesson.content?.examples && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <ApperIcon name="Lightbulb" size={16} />
                          Examples
                        </h5>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <ul className="text-sm text-gray-600 space-y-1">
                            {lesson.content.examples.slice(0, 3).map((example, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary-500 mt-1">•</span>
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {lesson.content?.rules && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <ApperIcon name="CheckCircle" size={16} />
                          Key Rules
                        </h5>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <ul className="text-sm text-gray-600 space-y-1">
                            {lesson.content.rules.map((rule, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Scheduled for {selectedEvent.date}
                      </div>
                      <Button
                        onClick={() => handleStartLesson(lesson)}
                        size="sm"
                        className="button-glow"
                      >
                        <ApperIcon name="Play" size={14} className="mr-1" />
                        Start Lesson
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setShowEventModal(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success("All lessons added to your study plan!");
                    setShowEventModal(false);
                  }}
                  className="button-glow"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add All to Study Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;