import axios from 'axios';
import { Participant, Violation } from '../types';

// Google Sheets Web App integration utility
export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private webAppUrl: string = '';

  private constructor() {}

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  configure(webAppUrl: string) {
    this.webAppUrl = webAppUrl;
  }

  /** Send participant data to Sheets (POST) **/
  async updateParticipantData(participantData: Participant) {
    if (!this.webAppUrl) {
      console.log('Google Sheets not configured. Data:', participantData);
      return { success: true };
    }

    try {
      const payload = {
        action: 'updateParticipant',
        data: {
          participantId: participantData.id,
          name: participantData.name,
          currentQuestion: participantData.currentQuestion,
          totalQuestions: 15, // Adjust if your quiz length changes
          totalTime: participantData.totalTime,
          violationCount: participantData.violations.length,
          isActive: participantData.isActive,
          timestamp: new Date().toISOString(),
          answers: participantData.answers.map(answer => ({
            questionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            timeSpent: answer.timeSpent,
            isCorrect: answer.isCorrect,
            timestamp: answer.timestamp.toISOString()
          }))
        }
      };

      const response = await axios.post(this.webAppUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
      return { success: false, error };
    }
  }

  /** Log a violation for a participant (POST) **/
  async logViolation(participantName: string, participantId: string, violation: Violation) {
    if (!this.webAppUrl) {
      console.log(`Violation logged for ${participantName}:`, violation);
      return { success: true };
    }
    try {
      const payload = {
        action: 'logViolation',
        data: {
          participantId,
          participantName,
          violationType: violation.type,
          violationDetails: violation.details,
          timestamp: violation.timestamp.toISOString()
        }
      };
      const response = await axios.post(this.webAppUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error logging violation to Google Sheets:', error);
      return { success: false, error };
    }
  }

  /** Initialize Sheets (GET to avoid CORS preflight) **/
  async initializeSheets() {
    if (!this.webAppUrl) {
      console.log('Google Sheets not configured. Skipping initialization.');
      return { success: true };
    }
    try {
      const response = await axios.get(`${this.webAppUrl}?action=initialize`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
      return { success: false, error };
    }
  }
}

export const googleSheetsService = GoogleSheetsService.getInstance();
