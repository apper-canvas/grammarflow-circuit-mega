import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import userService from "@/services/api/userService";
import lessonService from "@/services/api/lessonService";
import ApperIcon from "@/components/ApperIcon";
import LessonCard from "@/components/molecules/LessonCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Practice from "@/components/pages/Practice";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const Learn = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLessonView, setIsLessonView] = useState(false);
const categories = [
    { value: "all", label: "All Categories" },
    { value: "tenses", label: "Tenses" },
    { value: "articles", label: "Articles" },
    { value: "prepositions", label: "Prepositions" },
    { value: "pronouns", label: "Pronouns" },
    { value: "conditionals", label: "Conditionals" },
    { value: "adjectives", label: "Adjectives" },
    { value: "parts-of-speech", label: "Parts of Speech" },
    { value: "figures-of-speech", label: "Figures of Speech" }
  ];

const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "1", label: "Beginner" },
    { value: "2", label: "Intermediate" },
    { value: "3", label: "Advanced" }
  ];

  // Load completed lessons on mount
  useEffect(() => {
    const loadCompletedLessons = async () => {
      try {
        const completed = await lessonService.getCompletedLessons();
        setCompletedLessons(new Set(completed));
      } catch (error) {
        console.error('Error loading completed lessons:', error);
      }
    };
    loadCompletedLessons();
  }, []);

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [lessons, searchTerm, selectedCategory, selectedDifficulty]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError("");
      
const [allLessons, userData] = await Promise.all([
        lessonService.getAll(),
        userService.getCurrentUser()
      ]);

      setLessons(allLessons);
      const userCompleted = userData?.completedLessons || [];
      setCompletedLessons(new Set(userCompleted));
    } catch (err) {
      setError("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

const filterLessons = () => {
    let filtered = lessons;

    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(lesson => lesson.difficulty === parseInt(selectedDifficulty));
    }

    setFilteredLessons(filtered);
  };

  const handleStartLesson = async (lesson) => {
    try {
      setSelectedLesson(lesson);
      setIsLessonView(true);
      toast.success(`Started lesson: ${lesson.title}`);
    } catch (error) {
      toast.error('Failed to start lesson');
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      await lessonService.markAsCompleted(lessonId);
      setCompletedLessons(prev => new Set([...prev, lessonId]));
      toast.success('Lesson completed! Great job!');
      setIsLessonView(false);
      setSelectedLesson(null);
    } catch (error) {
      toast.error('Failed to complete lesson');
    }
  };

  const handleBackToLessons = () => {
    setIsLessonView(false);
    setSelectedLesson(null);
  };

const isLessonCompleted = (lessonId) => {
    return completedLessons.has(lessonId);
  };

  const getRecommendedLessons = () => {
    return filteredLessons.filter(lesson => 
      !isLessonCompleted(lesson.Id) && lesson.difficulty <= 2
    ).slice(0, 3);
  };

  if (loading) return <Loading variant="lessons" />;
  if (error) return <Error message={error} onRetry={loadLessons} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Grammar Lessons
          </h1>
          <p className="text-gray-600">
            Master English grammar with our comprehensive lesson library
          </p>
        </div>
        <Button onClick={() => navigate("/practice")}>
          <ApperIcon name="Brain" size={16} className="mr-2" />
          Quick Practice
        </Button>
      </div>

      {/* Filters */}
{!isLessonView ? (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Lessons
                </label>
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <Input
                    placeholder="Search by title or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <LessonCard
                  lesson={lesson}
isCompleted={completedLessons.has(lesson.Id)}
                  isRecommended={getRecommendedLessons().some(rec => rec.Id === lesson.Id)}
                  onClick={() => handleStartLesson(lesson)}
                />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        /* Lesson Detail View */
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToLessons}
              className="mb-4"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Lessons
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{selectedLesson?.title}</h1>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${
                    selectedLesson?.difficulty === 1 ? 'text-success-600 bg-success-100' :
                    selectedLesson?.difficulty === 2 ? 'text-accent-600 bg-accent-100' :
                    'text-red-600 bg-red-100'
                  }`}>
                    {selectedLesson?.difficulty === 1 ? 'Beginner' :
                     selectedLesson?.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {selectedLesson?.category}
                  </Badge>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">{selectedLesson?.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <ApperIcon name="Clock" size={16} className="mr-2" />
                Estimated time: {selectedLesson?.estimatedTime} minutes
              </div>
            </div>

            {selectedLesson?.content && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Explanation</h2>
                  <p className="text-gray-700 leading-relaxed">{selectedLesson.content.explanation}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Examples</h2>
                  <ul className="space-y-2">
                    {selectedLesson.content.examples?.map((example, index) => (
                      <li key={index} className="flex items-start">
                        <ApperIcon name="ArrowRight" size={16} className="mr-2 mt-1 text-primary-500 flex-shrink-0" />
                        <span className="text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Rules</h2>
                  <ul className="space-y-2">
                    {selectedLesson.content.rules?.map((rule, index) => (
                      <li key={index} className="flex items-start">
                        <ApperIcon name="Check" size={16} className="mr-2 mt-1 text-success-500 flex-shrink-0" />
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Ready to mark this lesson as complete?
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline" onClick={handleBackToLessons}>
                        Study Later
                      </Button>
                      <Button 
                        onClick={() => handleCompleteLesson(selectedLesson.Id)}
                        className="bg-success-600 hover:bg-success-700"
                      >
                        <ApperIcon name="CheckCircle" size={16} className="mr-2" />
                        Complete Lesson
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommended Lessons */}
      {selectedCategory === "all" && !searchTerm && (
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <ApperIcon name="Star" size={20} className="text-accent-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Recommended for You
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {getRecommendedLessons().map((lesson, index) => (
              <motion.div
                key={lesson.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LessonCard
                  lesson={lesson}
                  isRecommended={true}
                  isCompleted={isLessonCompleted(lesson.Id)}
                  onClick={() => handleStartLesson(lesson)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Lessons */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory !== "all" || searchTerm ? "Filtered Results" : "All Lessons"}
          </h2>
<div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{filteredLessons.length} lessons</span>
            <Badge variant="secondary">
              {completedLessons.size} completed
            </Badge>
          </div>
        </div>

        {filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LessonCard
                  lesson={lesson}
                  isCompleted={isLessonCompleted(lesson.Id)}
                  onClick={() => handleStartLesson(lesson)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <Empty
            title="No lessons found"
            description="Try adjusting your search criteria or browse all lessons"
            action={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
            actionLabel="Clear Filters"
            icon="BookOpen"
          />
        )}
      </div>
    </div>
  );
};

export default Learn;