import React, { useState } from 'react';
import { User, Shield, Clock } from 'lucide-react';

interface ParticipantRegistrationProps {
  onRegister: (name: string) => void;
}

export const ParticipantRegistration: React.FC<ParticipantRegistrationProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && agreed) {
      onRegister(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Science Quiz Challenge</h1>
          <p className="text-gray-600">Enter your name to begin the quiz</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <h3 className="font-medium text-yellow-800 mb-2">Anti-Cheat Monitoring Active</h3>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Copy/paste detection enabled</li>
                  <li>• Tab switching monitoring</li>
                  <li>• Time tracking for each question</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreed"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agreed" className="text-sm text-gray-700">
              I understand the quiz rules and agree to fair play policies
            </label>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !agreed}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Clock className="w-5 h-5" />
            <span>Start Quiz</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>15 questions • ~10 minutes</p>
        </div>
      </div>
    </div>
  );
};