/**
 * Google Apps Script for Science Quiz Integration
 * Deploy this as a Web App with execute permissions set to "Anyone"
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'initialize':
        return initializeSheets();
      case 'updateParticipant':
        return updateParticipantData(data.data);
      case 'logViolation':
        return logViolation(data.data);
      default:
        return ContentService
          .createTextOutput(JSON.stringify({ success: false, error: 'Unknown action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function initializeSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create or get Participants sheet
  let participantsSheet = spreadsheet.getSheetByName('Participants');
  if (!participantsSheet) {
    participantsSheet = spreadsheet.insertSheet('Participants');
    participantsSheet.getRange(1, 1, 1, 8).setValues([[
      'Participant ID', 'Name', 'Current Question', 'Total Questions', 
      'Total Time (seconds)', 'Violation Count', 'Is Active', 'Last Updated'
    ]]);
    participantsSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }
  
  // Create or get Answers sheet
  let answersSheet = spreadsheet.getSheetByName('Answers');
  if (!answersSheet) {
    answersSheet = spreadsheet.insertSheet('Answers');
    answersSheet.getRange(1, 1, 1, 7).setValues([[
      'Participant ID', 'Participant Name', 'Question ID', 'Answer', 
      'Time Spent (seconds)', 'Is Correct', 'Timestamp'
    ]]);
    answersSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
  
  // Create or get Violations sheet
  let violationsSheet = spreadsheet.getSheetByName('Violations');
  if (!violationsSheet) {
    violationsSheet = spreadsheet.insertSheet('Violations');
    violationsSheet.getRange(1, 1, 1, 5).setValues([[
      'Participant ID', 'Participant Name', 'Violation Type', 'Details', 'Timestamp'
    ]]);
    violationsSheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Sheets initialized' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateParticipantData(data) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const participantsSheet = spreadsheet.getSheetByName('Participants');
  const answersSheet = spreadsheet.getSheetByName('Answers');
  
  // Update participant summary
  const participantData = [
    data.participantId,
    data.name,
    data.currentQuestion,
    data.totalQuestions,
    data.totalTime,
    data.violationCount,
    data.isActive,
    data.timestamp
  ];
  
  // Find existing participant row or add new one
  const participantRange = participantsSheet.getDataRange();
  const participantValues = participantRange.getValues();
  let participantRowIndex = -1;
  
  for (let i = 1; i < participantValues.length; i++) {
    if (participantValues[i][0] === data.participantId) {
      participantRowIndex = i + 1;
      break;
    }
  }
  
  if (participantRowIndex > 0) {
    participantsSheet.getRange(participantRowIndex, 1, 1, 8).setValues([participantData]);
  } else {
    participantsSheet.appendRow(participantData);
  }
  
  // Add answers to answers sheet
  if (data.answers && data.answers.length > 0) {
    const lastAnswer = data.answers[data.answers.length - 1];
    const answerData = [
      data.participantId,
      data.name,
      lastAnswer.questionId,
      lastAnswer.selectedAnswer,
      lastAnswer.timeSpent,
      lastAnswer.isCorrect,
      lastAnswer.timestamp
    ];
    answersSheet.appendRow(answerData);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Participant data updated' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function logViolation(data) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const violationsSheet = spreadsheet.getSheetByName('Violations');
  
  const violationData = [
    data.participantId,
    data.participantName,
    data.violationType,
    data.violationDetails,
    data.timestamp
  ];
  
  violationsSheet.appendRow(violationData);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Violation logged' }))
    .setMimeType(ContentService.MimeType.JSON);
}