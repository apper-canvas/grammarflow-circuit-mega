import userData from "@/services/mockData/users.json";
import mistakesData from "@/services/mockData/mistakes.json";
import achievementsData from "@/services/mockData/achievements.json";

class UserService {
  constructor() {
    this.users = [...userData];
    this.mistakes = [...mistakesData];
    this.achievements = [...achievementsData];
  }

  async getCurrentUser() {
    await this.delay(300);
    return this.users.find(user => user.Id === 1) || this.users[0];
  }

  async getRecentMistakes(limit = 5) {
    await this.delay(200);
    return this.mistakes
      .filter(mistake => mistake.userId === 1)
      .slice(0, limit);
  }

  async getAchievements() {
    await this.delay(250);
    return [...this.achievements];
  }

  async saveQuizResults(results) {
    await this.delay(400);
    // In a real app, this would save to database
    console.log("Quiz results saved:", results);
    return { success: true };
  }

  async updateStreak() {
    await this.delay(200);
    const user = this.users.find(u => u.Id === 1);
    if (user) {
      const today = new Date().toDateString();
      const lastPractice = new Date(user.lastPractice).toDateString();
      
      if (today !== lastPractice) {
        user.streak += 1;
        user.lastPractice = new Date().toISOString();
      }
    }
    return user;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new UserService();