import placementData from "@/services/mockData/placementTest.json";

class PlacementTestService {
  constructor() {
    this.questions = [...placementData];
  }

  async getQuestions() {
    await this.delay(400);
    return [...this.questions];
  }

  async calculateResults(answers) {
    await this.delay(500);
    
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    
    let level = "Beginner";
    let recommendedLessons = [];
    
    if (accuracy >= 80) {
      level = "Advanced";
      recommendedLessons = [6, 7, 9]; // Advanced lessons
    } else if (accuracy >= 60) {
      level = "Intermediate";
      recommendedLessons = [3, 4, 6]; // Intermediate lessons
    } else {
      level = "Beginner";
      recommendedLessons = [1, 2, 5]; // Beginner lessons
    }

    // Analyze weak areas
    const categoryPerformance = this.analyzeCategoryPerformance(answers);
    
    return {
      level,
      accuracy,
      correctAnswers,
      totalQuestions,
      recommendedLessons,
      categoryPerformance,
      weakAreas: categoryPerformance.filter(cat => cat.accuracy < 60)
    };
  }

  analyzeCategoryPerformance(answers) {
    const categoryStats = {};
    
    answers.forEach(answer => {
      const question = this.questions.find(q => q.Id === answer.questionId);
      if (question) {
        if (!categoryStats[question.category]) {
          categoryStats[question.category] = {
            correct: 0,
            total: 0
          };
        }
        categoryStats[question.category].total++;
        if (answer.isCorrect) {
          categoryStats[question.category].correct++;
        }
      }
    });

    return Object.keys(categoryStats).map(category => ({
      category,
      accuracy: Math.round((categoryStats[category].correct / categoryStats[category].total) * 100),
      questionsAnswered: categoryStats[category].total
    }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new PlacementTestService();