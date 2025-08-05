import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import lessonService from '@/services/api/lessonService';
import userService from '@/services/api/userService';
import ApperIcon from '@/components/ApperIcon';
import LessonCard from '@/components/molecules/LessonCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import { cn } from '@/utils/cn';

const Courses = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const categories = [
    { value: 'all', label: 'All Categories', icon: 'Grid3X3' },
    { value: 'tenses', label: 'Tenses', icon: 'Clock' },
    { value: 'articles', label: 'Articles', icon: 'FileText' },
    { value: 'prepositions', label: 'Prepositions', icon: 'MapPin' },
    { value: 'pronouns', label: 'Pronouns', icon: 'Users' },
    { value: 'conditionals', label: 'Conditionals', icon: 'GitBranch' },
    { value: 'adjectives', label: 'Adjectives', icon: 'Palette' },
    { value: 'parts-of-speech', label: 'Parts of Speech', icon: 'BookOpen' },
    { value: 'figures-of-speech', label: 'Figures of Speech', icon: 'Sparkles' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels', icon: 'Layers' },
    { value: '1', label: 'Beginner', icon: 'Circle' },
    { value: '2', label: 'Intermediate', icon: 'CircleDot' },
    { value: '3', label: 'Advanced', icon: 'Target' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [lessonsData, completedData] = await Promise.all([
        lessonService.getAll(),
        loadCompletedLessons()
      ]);
      
      setLessons(lessonsData);
      setCompletedLessons(completedData);
    } catch (err) {
      console.error('Error loading courses data:', err);
      setError(err.message || 'Failed to load courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedLessons = async () => {
    try {
      const user = await userService.getCurrentUser();
      return user.completedLessons || [];
    } catch (error) {
      return lessonService.getCompletedLessons();
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty.toString() === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
});

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  const coursesByCategory = categories.reduce((acc, category) => {
    if (category.value === 'all') return acc;
    
    const categoryLessons = filteredLessons.filter(lesson => lesson.category === category.value);
    if (categoryLessons.length > 0) {
      acc[category.value] = {
        ...category,
        lessons: categoryLessons,
        completed: categoryLessons.filter(lesson => isLessonCompleted(lesson.Id)).length,
        total: categoryLessons.length
      };
    }
    return acc;
  }, {});

  const handleStartLesson = async (lesson) => {
    try {
      // Check prerequisites
      if (lesson.prerequisites && lesson.prerequisites.length > 0) {
        const unmetPrerequisites = lesson.prerequisites.filter(
          prereqId => !isLessonCompleted(prereqId)
        );
        
        if (unmetPrerequisites.length > 0) {
          toast.warning('Please complete prerequisite lessons first');
          return;
        }
      }

      toast.success(`Starting lesson: ${lesson.title}`);
      navigate('/learn', { state: { selectedLesson: lesson } });
    } catch (error) {
      console.error('Error starting lesson:', error);
      toast.error('Failed to start lesson');
    }
  };

  const getCategoryProgress = (category) => {
    const categoryLessons = lessons.filter(lesson => lesson.category === category);
    const completed = categoryLessons.filter(lesson => isLessonCompleted(lesson.Id)).length;
    return {
      completed,
      total: categoryLessons.length,
      percentage: categoryLessons.length > 0 ? Math.round((completed / categoryLessons.length) * 100) : 0
    };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return 'text-success-600 bg-success-50 border-success-200';
      case 2: return 'text-accent-600 bg-accent-50 border-accent-200';
      case 3: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Grammar Courses</h1>
            <p className="text-gray-600 mt-2">
              Explore structured lessons organized by topics and difficulty levels
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <ApperIcon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <ApperIcon name="List" size={16} />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <ApperIcon name="BookOpen" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-700">{lessons.length}</p>
                <p className="text-sm text-primary-600">Total Lessons</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-success-50 to-success-100 border-success-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success-500 rounded-lg">
                <ApperIcon name="CheckCircle" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success-700">{completedLessons.length}</p>
                <p className="text-sm text-success-600">Completed</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-500 rounded-lg">
                <ApperIcon name="Clock" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-700">
                  {lessons.reduce((sum, lesson) => sum + lesson.estimatedTime, 0)}
                </p>
                <p className="text-sm text-accent-600">Total Minutes</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary-500 rounded-lg">
                <ApperIcon name="Target" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-700">
                  {Object.keys(coursesByCategory).length}
                </p>
                <p className="text-sm text-secondary-600">Categories</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search lessons, topics, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon="Search"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.slice(1).map(category => {
            const progress = getCategoryProgress(category.value);
            if (progress.total === 0) return null;
            
            return (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name={category.icon} size={14} />
                <span>{category.label}</span>
                <Badge variant="secondary" className="ml-1">
                  {progress.completed}/{progress.total}
                </Badge>
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Course Content */}
      <AnimatePresence mode="wait">
        {filteredLessons.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Empty
              title="No lessons found"
              message="Try adjusting your search or filters to find lessons."
              action={
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}>
                  Clear Filters
                </Button>
              }
            />
          </motion.div>
        ) : selectedCategory === 'all' ? (
          // Category-based view
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {Object.entries(coursesByCategory).map(([categoryKey, category]) => (
              <motion.div
                key={categoryKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ApperIcon name={category.icon} size={24} className="text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{category.label}</h2>
                      <p className="text-sm text-gray-600">
                        {category.completed} of {category.total} lessons completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(category.completed / category.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round((category.completed / category.total) * 100)}%
                    </span>
                  </div>
                </div>

                <div className={cn(
                  "grid gap-4",
                  viewMode === 'grid' 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                )}>
                  {category.lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <LessonCard
                        lesson={lesson}
                        isCompleted={isLessonCompleted(lesson.Id)}
                        onClick={() => handleStartLesson(lesson)}
                        className="h-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Filtered lessons view
          <motion.div
            key="filtered"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''} found
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Filter" size={16} />
                <span>Filtered results</span>
              </div>
            </div>

            <div className={cn(
              "grid gap-4",
              viewMode === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            )}>
              {filteredLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LessonCard
                    lesson={lesson}
                    isCompleted={isLessonCompleted(lesson.Id)}
                    onClick={() => handleStartLesson(lesson)}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;