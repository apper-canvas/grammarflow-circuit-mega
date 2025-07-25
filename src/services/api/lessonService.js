import lessonData from "@/services/mockData/lessons.json";

class LessonService {
  constructor() {
    this.lessons = [...lessonData];
  }

  async getAll() {
    await this.delay(400);
    return [...this.lessons];
  }

  async getById(id) {
    await this.delay(300);
    const lesson = this.lessons.find(l => l.Id === parseInt(id));
    if (!lesson) {
      throw new Error(`Lesson with Id ${id} not found`);
    }
    return { ...lesson };
  }

  async getRecommended(limit = 3) {
    await this.delay(350);
    // Return lessons not yet completed, prioritizing lower difficulty
    return this.lessons
      .filter(lesson => lesson.difficulty <= 2)
      .sort((a, b) => a.difficulty - b.difficulty)
      .slice(0, limit)
      .map(lesson => ({ ...lesson }));
  }

  async getByCategory(category) {
    await this.delay(300);
    return this.lessons
      .filter(lesson => lesson.category === category)
      .map(lesson => ({ ...lesson }));
  }

  async create(lessonData) {
    await this.delay(500);
    const newId = Math.max(...this.lessons.map(l => l.Id)) + 1;
    const newLesson = { Id: newId, ...lessonData };
    this.lessons.push(newLesson);
    return { ...newLesson };
  }

  async update(id, lessonData) {
    await this.delay(400);
    const index = this.lessons.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Lesson with Id ${id} not found`);
    }
    this.lessons[index] = { ...this.lessons[index], ...lessonData };
    return { ...this.lessons[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.lessons.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Lesson with Id ${id} not found`);
    }
    this.lessons.splice(index, 1);
    return { success: true };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new LessonService();