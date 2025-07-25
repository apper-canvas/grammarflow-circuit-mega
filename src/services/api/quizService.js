import quizData from "@/services/mockData/quizzes.json";
import questionData from "@/services/mockData/questions.json";

class QuizService {
  constructor() {
    this.quizzes = [...quizData];
    this.questions = [...questionData];
  }

  async getAdaptiveQuizzes() {
    await this.delay(350);
    return [...this.quizzes];
  }

  async getQuizQuestions(quizId) {
    await this.delay(400);
    const questions = this.questions.filter(q => q.quizId === parseInt(quizId));
    
    if (questions.length === 0) {
      // Generate random questions if none found for this quiz
      const allQuestions = [...this.questions];
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 8).map(q => ({ ...q }));
    }
    
    return questions.map(q => ({ ...q }));
  }

  async getDailyQuiz() {
    await this.delay(300);
    const dailyQuiz = this.quizzes.find(q => q.isDaily);
    if (!dailyQuiz) {
      throw new Error("No daily quiz available");
    }
    return { ...dailyQuiz };
  }

  async getByCategory(category) {
    await this.delay(300);
    return this.quizzes
      .filter(quiz => quiz.category === category)
      .map(quiz => ({ ...quiz }));
  }

  async create(quizData) {
    await this.delay(500);
    const newId = Math.max(...this.quizzes.map(q => q.Id)) + 1;
    const newQuiz = { Id: newId, ...quizData };
    this.quizzes.push(newQuiz);
    return { ...newQuiz };
  }

  async update(id, quizData) {
    await this.delay(400);
    const index = this.quizzes.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Quiz with Id ${id} not found`);
    }
    this.quizzes[index] = { ...this.quizzes[index], ...quizData };
    return { ...this.quizzes[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.quizzes.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Quiz with Id ${id} not found`);
    }
    this.quizzes.splice(index, 1);
    return { success: true };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new QuizService();