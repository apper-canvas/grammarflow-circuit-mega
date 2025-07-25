import React, { useState, useEffect } from "react";
import QuizInterface from "@/components/organisms/QuizInterface";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import quizService from "@/services/api/quizService";
import userService from "@/services/api/userService";
import { toast } from "react-toastify";

const Practice = () => {
  const navigate = useNavigate();
const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [availableTopics, setAvailableTopics] = useState([]);
useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const availableQuizzes = await quizService.getAdaptiveQuizzes();
      setQuizzes(availableQuizzes);
      
      // Extract unique topics from quizzes
      const topics = [...new Set(availableQuizzes.map(quiz => quiz.category))];
      setAvailableTopics(topics);
    } catch (err) {
      setError("Failed to load practice quizzes");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredQuizzes = () => {
    if (selectedTopic === "all") {
      return quizzes.filter(quiz => !quiz.isDaily);
    }
    return quizzes.filter(quiz => !quiz.isDaily && quiz.category === selectedTopic);
  };

  const getTopicDisplayName = (topic) => {
    const topicNames = {
      tenses: "Tenses",
      articles: "Articles", 
      prepositions: "Prepositions",
      conditionals: "Conditionals",
      mixed: "Mixed Grammar"
    };
    return topicNames[topic] || topic.charAt(0).toUpperCase() + topic.slice(1);
  };

  const handleStartQuiz = async (quiz) => {
    try {
      const questions = await quizService.getQuizQuestions(quiz.Id);
      setCurrentQuiz({ ...quiz, questions });
      setQuizStarted(true);
    } catch (err) {
      toast.error("Failed to load quiz questions");
    }
  };

  const handleQuizComplete = async (quizResults) => {
    try {
      await userService.saveQuizResults(quizResults);
      setResults(quizResults);
      setQuizStarted(false);
      
      // Update user streak and progress
      await userService.updateStreak();
      
      toast.success("Great job! Your progress has been saved.");
    } catch (err) {
      toast.error("Failed to save quiz results");
    }
  };

  const handleRetryQuiz = () => {
    setResults(null);
    setQuizStarted(true);
  };

  const handleBackToQuizzes = () => {
    setCurrentQuiz(null);
    setQuizStarted(false);
    setResults(null);
  };

  if (loading) return <Loading variant="quiz" />;
  if (error) return <Error message={error} onRetry={loadQuizzes} />;

  // Show quiz results
  if (results) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 text-center">
            <div className="mb-6">
              <div className={`p-6 rounded-full inline-block mb-4 ${
                results.accuracy >= 80 
                  ? "bg-success-100" 
                  : results.accuracy >= 60 
                    ? "bg-accent-100" 
                    : "bg-red-100"
              }`}>
                <ApperIcon 
                  name={results.accuracy >= 80 ? "Trophy" : results.accuracy >= 60 ? "Target" : "RefreshCw"} 
                  size={48} 
                  className={
                    results.accuracy >= 80 
                      ? "text-success-600" 
                      : results.accuracy >= 60 
                        ? "text-accent-600" 
                        : "text-red-600"
                  }
                />
              </div>
              
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Quiz Complete!
              </h2>
              
              <div className="text-6xl font-bold mb-4">
                <span className={
                  results.accuracy >= 80 
                    ? "text-success-600" 
                    : results.accuracy >= 60 
                      ? "text-accent-600" 
                      : "text-red-600"
                }>
                  {results.accuracy}%
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">
                You got {results.correctAnswers} out of {results.totalQuestions} questions right
              </p>

              {results.accuracy >= 80 && (
                <Badge variant="success" className="mb-4">
                  🌟 Excellent Work!
                </Badge>
              )}
              {results.accuracy >= 60 && results.accuracy < 80 && (
                <Badge variant="accent" className="mb-4">
                  📈 Good Progress!
                </Badge>
              )}
              {results.accuracy < 60 && (
                <Badge variant="outline" className="mb-4">
                  💪 Keep Practicing!
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRetryQuiz} variant="outline">
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Try Again
              </Button>
              <Button onClick={handleBackToQuizzes}>
                <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                Back to Practice
              </Button>
              <Button onClick={() => navigate("/progress")} variant="accent">
                <ApperIcon name="TrendingUp" size={16} className="mr-2" />
                View Progress
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show quiz interface
  if (quizStarted && currentQuiz) {
    return (
      <div>
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToQuizzes}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Practice
          </Button>
        </div>
        
        <QuizInterface
          questions={currentQuiz.questions}
          title={currentQuiz.title}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  // Show quiz selection
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-4">
          Practice Grammar
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a quiz to test your grammar knowledge and improve your skills
        </p>
      </div>

      {/* Daily Challenge */}
      <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Calendar" size={20} className="text-primary-600" />
              <Badge variant="accent">Daily Challenge</Badge>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Today&apos;s Grammar Challenge
            </h3>
            <p className="text-gray-600 mb-4">
              Take on today&apos;s adaptive quiz and maintain your learning streak!
            </p>
            <Button 
              onClick={() => handleStartQuiz(quizzes.find(q => q.isDaily))}
              disabled={!quizzes.find(q => q.isDaily)}
            >
              <ApperIcon name="Play" size={16} className="mr-2" />
              Start Daily Challenge
            </Button>
          </div>
          <div className="hidden md:block">
            <div className="p-4 bg-primary-100 rounded-2xl">
              <ApperIcon name="Zap" size={48} className="text-primary-600" />
            </div>
          </div>
        </div>
      </Card>

      {/* Available Quizzes */}
      <div>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            Choose Your Topic
          </h2>
        </div>

        {/* Topic Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedTopic("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTopic === "all"
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Topics
            </button>
            {availableTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedTopic === topic
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getTopicDisplayName(topic)}
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {selectedTopic === "all" ? "All Practice Quizzes" : `${getTopicDisplayName(selectedTopic)} Quizzes`}
        </h3>

        {getFilteredQuizzes().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredQuizzes().map((quiz, index) => (
              <motion.div
                key={quiz.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {quiz.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {quiz.category}
                        </Badge>
                        <Badge 
                          variant={quiz.difficulty === 1 ? "success" : quiz.difficulty === 2 ? "accent" : "outline"}
                          className="text-xs"
                        >
                          {quiz.difficulty === 1 ? "Beginner" : quiz.difficulty === 2 ? "Intermediate" : "Advanced"}
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <ApperIcon name="Brain" size={20} className="text-gray-600 group-hover:text-primary-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{quiz.questionCount} questions</span>
                    <span>{quiz.estimatedTime} min</span>
                  </div>

                  <Button 
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full"
                    size="sm"
                  >
                    Start Quiz
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Empty
            title="No practice quizzes available"
            description="Check back later for new practice opportunities"
            icon="Brain"
          />
        )}
      </div>
    </div>
  );
};

export default Practice;