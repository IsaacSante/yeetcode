import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
// Make sure you have lucide-react installed: npm install lucide-react

interface NavigationProps {
  currentIndex: number;
  total: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onGenerateVariation?: () => void;
  generatingVariation?: boolean;
}

export default function Navigation({
  currentIndex,
  total,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  onGenerateVariation,
  generatingVariation = false,
}: NavigationProps) {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex items-center gap-2 px-4 py-2 text-purple-700 font-medium rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            {currentIndex + 1} / {total}
          </span>
          
          {onGenerateVariation && (
            <button
              onClick={() => {
                console.log('Generate Variation button clicked');
                onGenerateVariation();
              }}
              disabled={generatingVariation}
              className="px-4 py-2 text-blue-700 font-medium rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Generate new variation of this problem"
            >
              {generatingVariation ? 'Generating...' : 'New Variation'}
            </button>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 px-4 py-2 text-purple-700 font-medium rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}