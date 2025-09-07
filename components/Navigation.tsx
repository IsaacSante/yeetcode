'use client';

interface NavigationProps {
  currentIndex: number;
  total: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export default function Navigation({ 
  currentIndex, 
  total, 
  canGoNext, 
  canGoPrev, 
  onNext, 
  onPrev 
}: NavigationProps) {
  return (
    <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200 px-5 pb-5">
      <button 
        className="btn btn-secondary"
        onClick={onPrev}
        disabled={!canGoPrev}
      >
        ← Previous
      </button>
      
      <span className="text-sm text-gray-600 font-semibold">
        Card {currentIndex + 1} of {total}
      </span>
      
      <button 
        className="btn btn-secondary"
        onClick={onNext}
        disabled={!canGoNext}
      >
        Next →
      </button>
    </div>
  );
}