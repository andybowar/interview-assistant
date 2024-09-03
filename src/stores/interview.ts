import { defineStore } from 'pinia';

interface InterviewOptions {
  jobTitle: string;
  industry: string;
  experienceLevel: number;
}

interface Answer {
  questionId: number;
  answer: string;
  feedback: string;
}

export const useInterviewStore = defineStore('interview', {
  state: () => ({
    options: {} as InterviewOptions,
    answers: [] as Answer[]
  }),
  actions: {
    setInterviewOptions(options: InterviewOptions) {
      this.options = options;
    },
    addAnswer(id: number, answer: string, feedback: string) {
      this.answers.push({ questionId: id, answer: answer, feedback: feedback });
    },
    loadAnswers() {
      // Implementation to load answers from storage
    },
    getAnswers() {
      return this.answers;
    }
  }
});