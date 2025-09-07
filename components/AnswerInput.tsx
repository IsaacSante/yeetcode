'use client';

import { useState } from 'react';
import { AnswerMode } from '@/types/flashcard';

interface AnswerInputProps {
  mode: AnswerMode;
  onModeChange: (mode: AnswerMode) => void;
  onSubmit: () => void;
  isFlipped: boolean;
}

export default function AnswerInput({ mode, onModeChange, onSubmit, isFlipped }: AnswerInputProps) {
  const [textAnswer, setTextAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');

  const handleSubmit = () => {
    onSubmit();
  };

  const handleReset = () => {
    setTextAnswer('');
    setCodeAnswer('');
    onSubmit(); // This will flip back to show the problem
  };

  return (
    <div className="flex flex-col h-full p-5">
      {/* Controls */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <button 
          className={`btn btn-toggle ${mode === 'text' ? 'active' : ''}`}
          onClick={() => onModeChange('text')}
        >
          Text Mode
        </button>
        <button 
          className={`btn btn-toggle ${mode === 'code' ? 'active' : ''}`}
          onClick={() => onModeChange('code')}
        >
          Code Mode
        </button>
        <button 
          className="btn btn-primary"
          onClick={isFlipped ? handleReset : handleSubmit}
        >
          {isFlipped ? 'Show Problem' : 'Show Solution'}
        </button>
      </div>

      {/* Answer Input */}
      <div className="flex-1 flex flex-col min-h-0">
        {mode === 'text' ? (
          <textarea
            className="textarea-answer custom-scrollbar flex-1"
            placeholder="Write your approach or explanation here..."
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
          />
        ) : (
          <textarea
            className="textarea-answer textarea-code custom-scrollbar-dark flex-1"
            placeholder="# Write your code solution here..."
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}