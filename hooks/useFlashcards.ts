'use client';

import { useState, useEffect } from 'react';
import { Flashcard, GameState, AnswerMode } from '@/types/flashcard';

const defaultFlashcards: Flashcard[] = [
  {
    problem_title: "FizzBuzz",
    problem_description: "Write a program that prints numbers 1 to 100, but print 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, and 'FizzBuzz' for multiples of both.",
    code_solution: "def fizzbuzz():\n    for i in range(1, 101):\n        if i % 15 == 0:\n            print('FizzBuzz')\n        elif i % 3 == 0:\n            print('Fizz')\n        elif i % 5 == 0:\n            print('Buzz')\n        else:\n            print(i)",
    code_explanation: "Check divisibility by 15 first (both 3 and 5), then by 3, then by 5, otherwise print the number."
  }
];

export function useFlashcards() {
  const [gameState, setGameState] = useState<GameState>({
    currentCardIndex: 0,
    isFlipped: false,
    currentMode: 'text',
    flashcards: defaultFlashcards
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flipCard = () => {
    setGameState(prev => ({ ...prev, isFlipped: !prev.isFlipped }));
  };

  const nextCard = () => {
    if (gameState.currentCardIndex < gameState.flashcards.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex + 1,
        isFlipped: false
      }));
    }
  };

  const prevCard = () => {
    if (gameState.currentCardIndex > 0) {
      setGameState(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex - 1,
        isFlipped: false
      }));
    }
  };

  const setMode = (mode: AnswerMode) => {
    setGameState(prev => ({ ...prev, currentMode: mode }));
  };

  const currentCard = gameState.flashcards[gameState.currentCardIndex];

  return {
    ...gameState,
    currentCard,
    loading,
    error,
    flipCard,
    nextCard,
    prevCard,
    setMode,
    canGoNext: gameState.currentCardIndex < gameState.flashcards.length - 1,
    canGoPrev: gameState.currentCardIndex > 0,
  };
}