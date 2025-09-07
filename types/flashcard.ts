export interface Flashcard {
  problem_title: string;
  problem_description: string;
  code_solution: string;
  code_explanation: string;
}

export type AnswerMode = 'text' | 'code';

export interface GameState {
  currentCardIndex: number;
  isFlipped: boolean;
  currentMode: AnswerMode;
  flashcards: Flashcard[];
}