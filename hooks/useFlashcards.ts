'use client';

import { useState, useEffect, useCallback } from 'react';
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
    flashcards: []
  });
  
  const [originalFlashcards, setOriginalFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingVariation, setGeneratingVariation] = useState(false);
  const [generatedIndices, setGeneratedIndices] = useState<Set<number>>(new Set());

  // Generate variation function
  const generateVariation = useCallback(async (forceRegenerate = false) => {
    const currentIndex = gameState.currentCardIndex;
    const originalCard = originalFlashcards[currentIndex];
    
    // Skip if already generated for this index (unless forced)
    if (!forceRegenerate && generatedIndices.has(currentIndex)) {
      console.log('Variation already generated for index:', currentIndex);
      return;
    }
    
    if (!originalCard || generatingVariation) return;
    
    console.log('Requesting variation for card:', originalCard.problem_title);

    try {
      setGeneratingVariation(true);
      setError(null);
      
      const response = await fetch('/api/generate-variation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(originalCard),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to generate variation: ${errorData}`);
      }

      const variation: Flashcard = await response.json();
      
      console.log('Received variation:', variation.problem_title);
      
      // Replace the current card with the variation
      setGameState(prev => {
        const newFlashcards = [...prev.flashcards];
        newFlashcards[currentIndex] = variation;
        return {
          ...prev,
          flashcards: newFlashcards,
          isFlipped: false,
        };
      });
      
      // Mark this index as having a generated variation
      setGeneratedIndices(prev => new Set(prev).add(currentIndex));
      
    } catch (err) {
      console.error('Error generating variation:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate variation');
    } finally {
      setGeneratingVariation(false);
    }
  }, [gameState.currentCardIndex, originalFlashcards, generatingVariation, generatedIndices]);

  // Fetch flashcards from JSON file
  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/flashcards.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch flashcards: ${response.status}`);
        }
        
        const data: Flashcard[] = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid flashcard data format');
        }
        
        // Store both original and working copies
        setOriginalFlashcards(data);
        setGameState(prev => ({
          ...prev,
          flashcards: [...data]  // Create a copy
        }));
        
        setError(null);
      } catch (err) {
        console.error('Error loading flashcards:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fall back to default flashcards
        setOriginalFlashcards(defaultFlashcards);
        setGameState(prev => ({
          ...prev,
          flashcards: [...defaultFlashcards]
        }));
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, []);

  // Generate variation for the first card when flashcards are loaded
  useEffect(() => {
    if (!loading && originalFlashcards.length > 0 && !generatingVariation) {
      console.log('Generating initial variation...');
      generateVariation();
    }
  }, [loading, originalFlashcards.length]); // Intentionally not including generateVariation to avoid loops

  // Generate variation when currentCardIndex changes
  useEffect(() => {
    if (!loading && originalFlashcards.length > 0 && !generatingVariation) {
      console.log('Card index changed, generating variation...');
      generateVariation();
    }
  }, [gameState.currentCardIndex]); // Intentionally not including generateVariation to avoid loops

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
      // Variation will be generated automatically by the useEffect
    }
  };

  const prevCard = () => {
    if (gameState.currentCardIndex > 0) {
      setGameState(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex - 1,
        isFlipped: false
      }));
      // Variation will be generated automatically by the useEffect
    }
  };

  const regenerateVariation = () => {
    // Force regenerate even if already generated
    generateVariation(true);
  };

  const resetToOriginal = () => {
    const originalCard = originalFlashcards[gameState.currentCardIndex];
    if (originalCard) {
      setGameState(prev => {
        const newFlashcards = [...prev.flashcards];
        newFlashcards[prev.currentCardIndex] = { ...originalCard };
        return {
          ...prev,
          flashcards: newFlashcards,
          isFlipped: false,
        };
      });
      // Remove from generated set so it can be regenerated
      setGeneratedIndices(prev => {
        const newSet = new Set(prev);
        newSet.delete(gameState.currentCardIndex);
        return newSet;
      });
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
    generatingVariation,
    flipCard,
    nextCard,
    prevCard,
    setMode,
    generateVariation: regenerateVariation, // Use regenerateVariation for manual trigger
    resetToOriginal,
    canGoNext: gameState.currentCardIndex < gameState.flashcards.length - 1,
    canGoPrev: gameState.currentCardIndex > 0,
  };
}