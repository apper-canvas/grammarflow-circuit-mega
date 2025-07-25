import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress";
import QuizQuestion from "@/components/molecules/QuizQuestion";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const QuizInterface = ({ 
  questions, 
  onComplete, 
  title = "Practice Quiz" 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const newAnswer = {
      questionId: currentQuestion.Id,
      selectedAnswer: answerIndex,
      isCorrect
    };

    setAnswers([...answers, newAnswer]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const results = {
      totalQuestions: questions.length,
      correctAnswers: score,
      accuracy: Math.round((score / questions.length) * 100),
      answers
    };

    toast.success(`Quiz completed! Score: ${score}/${questions.length}`);
    onComplete(results);
  };

  if (!currentQuestion) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">No questions available</p>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
              Score: {score}/{questions.length}
            </div>
          </div>
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
                Complete Quiz
                <ApperIcon name="CheckCircle" size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizInterface;