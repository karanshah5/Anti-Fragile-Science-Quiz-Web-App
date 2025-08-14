import React from 'react';
import { Participant, Violation } from '../types';
import { Users, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface AdminDashboardProps {
  participants: Participant[];
  currentQuestion: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ participants, currentQuestion }) => {
  const activeParticipants = participants.filter(p => p.isActive);
  const totalViolations = participants.reduce((sum, p) => sum + p.violations.length, 0);

  const getStatusColor = (participant: Participant) => {
    if (participant.violations.length >= 5) return 'bg-red-100 border-red-300';
    if (participant.violations.length >= 2) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  const getViolationIcon = (type: Violation['type']) => {
    switch (type) {
      case 'copy': return '📋';
      case 'paste': return '📥';
      case 'tab_change': return '🔄';
      case 'focus_loss': return '👁️';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Admin Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of all participants</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Participants</p>
                <p className="text-2xl font-bold text-gray-900">{activeParticipants.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Question</p>
                <p className="text-2xl font-bold text-gray-900">{currentQuestion}/15</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Violations</p>
                <p className="text-2xl font-bold text-gray-900">{totalViolations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {participants.length > 0 ? Math.round((participants.filter(p => p.currentQuestion >= 15).length / participants.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Participant Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Violations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((participant) => (
                  <tr key={participant.id} className={getStatusColor(participant)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{participant.name}</div>
                      <div className="text-sm text-gray-500">ID: {participant.id.slice(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(participant.currentQuestion / 15) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{participant.currentQuestion}/15</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(participant.totalTime / 60)}m {participant.totalTime % 60}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-900">{participant.violations.length}</span>
                        <div className="flex space-x-1">
                          {participant.violations.slice(0, 3).map((violation, index) => (
                            <span key={index} title={violation.type}>
                              {getViolationIcon(violation.type)}
                            </span>
                          ))}
                          {participant.violations.length > 3 && <span>...</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        participant.violations.length >= 5 
                          ? 'bg-red-100 text-red-800'
                          : participant.violations.length >= 2
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {participant.violations.length >= 5 ? 'High Risk' : 
                         participant.violations.length >= 2 ? 'Monitored' : 'Good'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};