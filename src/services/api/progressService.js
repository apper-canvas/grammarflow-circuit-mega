import progressData from "@/services/mockData/progress.json";

class ProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getOverallProgress() {
    await this.delay(400);
    
    // Calculate overall stats
    const totalSessions = this.progress.length;
    const totalQuestions = this.progress.reduce((sum, p) => sum + p.questionsAnswered, 0);
    const totalCorrect = this.progress.reduce((sum, p) => sum + Math.round(p.accuracy * p.questionsAnswered / 100), 0);
    const overallAccuracy = Math.round((totalCorrect / totalQuestions) * 100);
    
    // Category performance
    const categoryPerformance = this.calculateCategoryPerformance();
    
    return {
      userId: 1,
      overallAccuracy,
      totalSessions,
      lessonsCompleted: 8,
      lessonsThisWeek: 3,
      sessionsThisWeek: 5,
      currentStreak: 7,
      accuracyTrend: "up",
      accuracyChange: 5,
      categoryPerformance
    };
  }

  async getProgressHistory(userId, timeRange = "7days") {
    await this.delay(350);
    
    let days = 7;
    switch (timeRange) {
      case "30days":
        days = 30;
        break;
      case "90days":
        days = 90;
        break;
      default:
        days = 7;
    }

    return this.progress
      .filter(p => p.userId === parseInt(userId))
      .slice(-days)
      .map(p => ({ ...p }));
  }

  async getMistakePatterns() {
    await this.delay(300);
    
    return [
      {
        rule: "Subject-Verb Agreement",
        description: "Verbs must agree with their subjects in number",
        mistakeCount: 3,
        lastSeen: "2024-01-14"
      },
      {
        rule: "Preposition Usage",
        description: "Incorrect use of prepositions with time expressions",
        mistakeCount: 2,
        lastSeen: "2024-01-13"
      }
    ];
  }

  calculateCategoryPerformance() {
    const categories = {};
    
    this.progress.forEach(session => {
      if (!categories[session.category]) {
        categories[session.category] = {
          name: session.category,
          totalQuestions: 0,
          totalCorrect: 0
        };
      }
      
      categories[session.category].totalQuestions += session.questionsAnswered;
      categories[session.category].totalCorrect += Math.round(session.accuracy * session.questionsAnswered / 100);
    });

    return Object.values(categories).map(cat => ({
      name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
      accuracy: Math.round((cat.totalCorrect / cat.totalQuestions) * 100),
      questionsAnswered: cat.totalQuestions
    }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ProgressService();