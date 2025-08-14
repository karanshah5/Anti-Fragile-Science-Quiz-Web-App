import React from 'react';
import { Participant, Answer } from '../types';
import { Trophy, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface QuizResultsProps {
  participant: Participant;
  onRestart: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ participant, onRestart }) => {
  const correctAnswers = participant.answers.filter(answer => answer.isCorrect).length;
  const totalQuestions = participant.answers.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(participant.totalTime / totalQuestions) : 0;

  const getScoreColor = () => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = () => {
    if (accuracy >= 90) return 'A+';
    if (accuracy >= 80) return 'A';
    if (accuracy >= 70) return 'B';
    if (accuracy >= 60) return 'C';
    if (accuracy >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600">Great job, {participant.name}!</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
              {accuracy}%
            </div>
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              Grade: {getGrade()}
            </div>
            <p className="text-gray-600">
              {correctAnswers} out of {totalQuestions} questions correct
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{avgTimePerQuestion}s</div>
              <div className="text-sm text-gray-600">Avg per Question</div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {Math.floor(participant.totalTime / 60)}:{String(participant.totalTime % 60).padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{avgTimePerQuestion}s</div>
              <div className="text-sm text-gray-600">Avg Time</div>
            </div>
            
            <div className="text-center">
              <div className={`text-lg font-semibold ${participant.violations.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {participant.violations.length}
              </div>
              <div className="text-sm text-gray-600">Violations</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
          </div>

          {participant.violations.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="font-medium text-red-800">Violation Summary</h3>
              </div>
              <div className="text-sm text-red-700">
                {participant.violations.length} violation(s) detected during the quiz. 
                These may affect your final score.
              </div>
            </div>
          )}
        </div>

        {/* Question Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Question Breakdown</h2>
          
          <div className="space-y-3">
            {participant.answers.map((answer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {answer.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">Question {index + 1}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{answer.timeSpent}s</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    </div>
  );
};