import React, { useState, useEffect } from "react";
import LessonCard from "@/components/molecules/LessonCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import lessonService from "@/services/api/lessonService";
import userService from "@/services/api/userService";

const Learn = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

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
      setCompletedLessons(userData.completedLessons || []);
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

  const handleStartLesson = (lesson) => {
    navigate(`/learn/${lesson.Id}`);
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
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
              {completedLessons.length} completed
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