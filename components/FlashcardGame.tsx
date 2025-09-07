'use client';

import { useEffect } from 'react';
import { useFlashcards } from '@/hooks/useFlashcards';
import Flashcard from './Flashcard';
import AnswerInput from './AnswerInput';
import Navigation from './Navigation';

export default function FlashcardGame() {
  const {
    currentCard,
    currentCardIndex,
    isFlipped,
    currentMode,
    loading,
    error,
    flashcards,
    flipCard,
    nextCard,
    prevCard,
    setMode,
    canGoNext,
    canGoPrev,
  } = useFlashcards();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          e.preventDefault();
          flipCard();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevCard();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextCard();
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        flipCard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [flipCard, nextCard, prevCard]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl">Loading flashcards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-center">
          <div className="text-xl mb-4">Error loading flashcards</div>
          <div className="text-sm opacity-75">{error}</div>
          <div className="text-sm mt-2">Using default flashcards instead</div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl">No flashcards available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
      <div className="h-screen flex flex-col lg:flex-row">
        {/* Card Section */}
        <div className="lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center p-5 bg-white/10 backdrop-blur-sm">
          <Flashcard 
            card={currentCard} 
            isFlipped={isFlipped} 
            onFlip={flipCard}
          />
        </div>

        {/* Answer Section */}
        <div className="lg:w-1/2 h-1/2 lg:h-full bg-white/95 flex flex-col">
          <AnswerInput 
            mode={currentMode}
            onModeChange={setMode}
            onSubmit={flipCard}
            isFlipped={isFlipped}
          />
          
          <Navigation
            currentIndex={currentCardIndex}
            total={flashcards.length}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            onNext={nextCard}
            onPrev={prevCard}
          />
        </div>
      </div>
    </div>
  );
}