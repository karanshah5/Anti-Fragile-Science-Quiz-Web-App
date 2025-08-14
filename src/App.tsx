import React, { useState, useEffect } from 'react';
import { ParticipantRegistration } from './components/ParticipantRegistration';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { AdminDashboard } from './components/AdminDashboard';
import { Participant, Answer, Violation, Question } from './types';
import { scienceQuestions } from './data/questions';
import { googleSheetsService } from './utils/googleSheets';
import { v4 as uuidv4 } from 'uuid';
import { Settings } from 'lucide-react';

type AppState = 'registration' | 'quiz' | 'results' | 'admin';

function App() {
  const [appState, setAppState] = useState<AppState>('registration');
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions] = useState<Question[]>(scienceQuestions);

  // Initialize Google Sheets (in real app, get these from environment variables)
  useEffect(() => {
    // Configure with your Google Apps Script Web App URL
    // Replace with your actual deployed Google Apps Script URL
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbw4bOrY5V98uol0pRjfkU3ZOOWIy55ewlxXClZzwfYSp4uo_hwJvTKuSNtUov4CBerB_w/exec';
    googleSheetsService.configure(webAppUrl);
    
    // Initialize sheets structure
    googleSheetsService.initializeSheets();
  }, []);

  const handleParticipantRegistration = (name: string) => {
    const participant: Participant = {
      id: uuidv4(),
      name,
      startTime: new Date(),
      currentQuestion: 0,
      answers: [],
      violations: [],
      isActive: true,
      totalTime: 0
    };

    setCurrentParticipant(participant);
    setAllParticipants(prev => [...prev, participant]);
    setAppState('quiz');
  };

  const handleAnswer = (selectedAnswer: string, timeSpent: number) => {
    if (!currentParticipant) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      timeSpent,
      timestamp: new Date(),
      isCorrect
    };

    const updatedParticipant = {
      ...currentParticipant,
      answers: [...currentParticipant.answers, answer],
      currentQuestion: currentQuestionIndex + 1,
      totalTime: currentParticipant.totalTime + timeSpent
    };

    setCurrentParticipant(updatedParticipant);
    
    // Update all participants list
    setAllParticipants(prev => 
      prev.map(p => p.id === updatedParticipant.id ? updatedParticipant : p)
    );

    // Update Google Sheets
    googleSheetsService.updateParticipantData(updatedParticipant);

    // Move to next question or results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const finalParticipant = { ...updatedParticipant, isActive: false };
      setCurrentParticipant(finalParticipant);
      setAllParticipants(prev => 
        prev.map(p => p.id === finalParticipant.id ? finalParticipant : p)
      );
      setAppState('results');
    }
  };

  const handleViolation = (violation: Violation) => {
    if (!currentParticipant) return;

    const updatedParticipant = {
      ...currentParticipant,
      violations: [...currentParticipant.violations, violation]
    };

    setCurrentParticipant(updatedParticipant);
    setAllParticipants(prev => 
      prev.map(p => p.id === updatedParticipant.id ? updatedParticipant : p)
    );

    // Log violation to Google Sheets
    googleSheetsService.logViolation(currentParticipant.name, currentParticipant.id, violation);
  };

  const handleRestart = () => {
    setCurrentParticipant(null);
    setCurrentQuestionIndex(0);
    setAppState('registration');
  };

  const toggleAdminView = () => {
    setAppState(appState === 'admin' ? 'registration' : 'admin');
  };

  return (
    <div className="relative">
      {/* Admin Toggle Button */}
      <button
        onClick={toggleAdminView}
        className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
        title="Toggle Admin Dashboard"
      >
        <Settings className="w-5 h-5" />
      </button>

      {appState === 'registration' && (
        <ParticipantRegistration onRegister={handleParticipantRegistration} />
      )}

      {appState === 'quiz' && currentParticipant && (
        <QuizQuestion
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onViolation={handleViolation}
        />
      )}

      {appState === 'results' && currentParticipant && (
        <QuizResults
          participant={currentParticipant}
          onRestart={handleRestart}
        />
      )}

      {appState === 'admin' && (
        <AdminDashboard
          participants={allParticipants}
          currentQuestion={currentQuestionIndex + 1}
        />
      )}
    </div>
  );
}

export default App;