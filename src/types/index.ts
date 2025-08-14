export interface Participant {
  id: string;
  name: string;
  startTime: Date;
  currentQuestion: number;
  answers: Answer[];
  violations: Violation[];
  isActive: boolean;
  totalTime: number;
}

export interface Answer {
  questionId: number;
  selectedAnswer: string;
  timeSpent: number;
  timestamp: Date;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  category: string;
  question: string;
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Violation {
  type: 'copy' | 'paste' | 'tab_change' | 'focus_loss';
  timestamp: Date;
  details: string;
}

export interface QuizSession {
  participants: Participant[];
  currentQuestion: number;
  isActive: boolean;
  startTime: Date;
}