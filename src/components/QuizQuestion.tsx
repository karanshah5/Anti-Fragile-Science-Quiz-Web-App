import React, { useState, useEffect } from 'react';
import { Question, Violation } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useAntiCheat } from '../hooks/useAntiCheat';
import { Clock, AlertTriangle, Eye } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string, timeSpent: number) => void;
  onViolation: (violation: Violation) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onViolation
}) => {
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [startTime] = useState<number>(Date.now());
  
  const { timeLeft, startTimer } = useTimer(30, () => {
    if (!typedAnswer.trim()) {
      handleSubmit(''); // Auto-submit with no answer
    }
  });

  const { violations, isTabActive, violationCount } = useAntiCheat(onViolation);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  const handleSubmit = (answer: string = typedAnswer.trim()) => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    onAnswer(answer, timeSpent);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && typedAnswer.trim()) {
      handleSubmit();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return 'text-red-600';
    if (timeLeft <= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-700">
                Question {questionNumber} of {totalQuestions}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {question.category}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {violationCount > 0 && (
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">{violationCount} violations</span>
                </div>
              )}
              
              <div className={`flex items-center space-x-2 ${!isTabActive ? 'text-red-600' : ''}`}>
                <Eye className={`w-4 h-4 ${!isTabActive ? 'opacity-50' : ''}`} />
                <span className="text-sm">{isTabActive ? 'Active' : 'Tab Inactive'}</span>
              </div>
              
              <div className={`flex items-center space-x-2 ${getTimerColor()}`}>
                <Clock className="w-5 h-5" />
                <span className="text-xl font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Progress: {questionNumber}/{totalQuestions}</span>
              <span>{totalQuestions - questionNumber} questions remaining</span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
            {question.question}
          </h2>

          <div className="mb-8">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Type your answer:
            </label>
            <input
              type="text"
              id="answer"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your answer here..."
              autoComplete="off"
              autoFocus
            />
            <p className="text-sm text-gray-500 mt-2">Press Enter to submit or use the button below</p>
          </div>

          {/* Monitoring Status Messages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Time Tracking</span>
              </div>
              <p className="text-xs text-blue-700">
                Recording time spent on each question for performance analysis
              </p>
            </div>
            
            <div className={`border rounded-lg p-4 ${violationCount > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className={`w-4 h-4 ${violationCount > 0 ? 'text-red-600' : 'text-green-600'}`} />
                <span className={`text-sm font-medium ${violationCount > 0 ? 'text-red-800' : 'text-green-800'}`}>
                  Copy/Paste Detection
                </span>
              </div>
              <p className={`text-xs ${violationCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                {violationCount > 0 ? `${violationCount} violations detected` : 'No violations detected'}
              </p>
            </div>
            
            <div className={`border rounded-lg p-4 ${!isTabActive ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Eye className={`w-4 h-4 ${!isTabActive ? 'text-red-600' : 'text-green-600'}`} />
                <span className={`text-sm font-medium ${!isTabActive ? 'text-red-800' : 'text-green-800'}`}>
                  Tab Change Detection
                </span>
              </div>
              <p className={`text-xs ${!isTabActive ? 'text-red-700' : 'text-green-700'}`}>
                {!isTabActive ? 'Tab switch detected!' : 'Quiz tab is active'}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {typedAnswer.trim() ? 'Answer entered' : 'Please type your answer'}
            </div>
            
            <button
              onClick={() => handleSubmit()}
              disabled={!typedAnswer.trim()}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>

        {/* Violation Alerts */}
        {!isTabActive && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Warning: Please return to the quiz tab</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};