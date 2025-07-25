import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress";
import QuizQuestion from "@/components/molecules/QuizQuestion";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import placementTestService from "@/services/api/placementTestService";
import { toast } from "react-toastify";

const PlacementTest = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const testQuestions = await placementTestService.getQuestions();
      setQuestions(testQuestions);
    } catch (error) {
      toast.error("Failed to load placement test");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const newAnswer = {
      questionId: questions[currentQuestionIndex].Id,
      selectedAnswer: answerIndex,
      isCorrect: answerIndex === questions[currentQuestionIndex].correctAnswer
    };

    setAnswers([...answers, newAnswer]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      completeTest();
    }
  };

  const completeTest = async () => {
    try {
      const results = await placementTestService.calculateResults(answers);
      toast.success(`Test completed! Your level: ${results.level}`);
      onComplete(results);
    } catch (error) {
      toast.error("Failed to process test results");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="p-12">
            <div className="mb-8">
              <div className="p-6 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full inline-block mb-6">
                <ApperIcon name="Brain" size={48} className="text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-4">
                Grammar Placement Test
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Let&apos;s assess your current grammar knowledge to create a 
                personalized learning path just for you. This test will take 
                about 10-15 minutes to complete.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={16} className="text-primary-600" />
                  <span>10-15 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="HelpCircle" size={16} className="text-primary-600" />
                  <span>{questions.length} questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Target" size={16} className="text-primary-600" />
                  <span>Personalized results</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartTest}
              size="lg"
              className="w-full sm:w-auto px-8"
            >
              <ApperIcon name="Play" size={20} className="mr-2" />
              Start Placement Test
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            isCorrect={selectedAnswer === currentQuestion.correctAnswer}
          />
        </motion.div>
      </AnimatePresence>

      {showFeedback && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext} size="lg">
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Next Question
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </>
            ) : (
              <>
                Complete Test
                <ApperIcon name="CheckCircle" size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlacementTest;