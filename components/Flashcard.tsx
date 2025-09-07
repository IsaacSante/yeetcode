'use client';

import { Flashcard as FlashcardType } from '@/types/flashcard';
import { formatContent, escapeHtml } from '@/utils/formatContent';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div className="w-full h-full max-h-[calc(100vh-40px)]" style={{ perspective: '1000px' }}>
      <div 
        className={`flashcard ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={onFlip}
      >
        {/* Front Face - Problem */}
        <div className="flashcard-face flashcard-front">
          <div className="text-sm text-gray-600 mb-4 uppercase tracking-wide font-semibold">
            {card.problem_title}
          </div>
          <br/>
          <div 
            className="flex-1 overflow-y-auto text-lg leading-relaxed text-slate-700 custom-scrollbar content-formatted"
            dangerouslySetInnerHTML={{ __html: formatContent(card.problem_description) }}
          />
        </div>

        {/* Back Face - Solution */}
        <div className="flashcard-face flashcard-back">
          <div className="text-sm text-gray-600 mb-4 uppercase tracking-wide font-semibold">
            Solution
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar">
            <div>
              <pre className="code-block">
                <code>{card.code_solution}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Explanation:</h3>
              <div 
                className="text-slate-700 leading-relaxed content-formatted"
                dangerouslySetInnerHTML={{ __html: formatContent(card.code_explanation) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}