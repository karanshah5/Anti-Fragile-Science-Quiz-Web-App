# Google Sheets Integration Setup Guide

## Overview
This quiz app integrates with Google Sheets to provide real-time tracking of participant data, answers, and violations.

## Required Sheets Structure

The integration will automatically create 3 sheets in your Google Spreadsheet:

### 1. **Participants Sheet**
Tracks overall participant progress and status.

**Columns:**
- A: Participant ID (unique identifier)
- B: Name (participant's name)
- C: Current Question (question number they're on)
- D: Total Questions (always 15)
- E: Total Time (seconds spent so far)
- F: Violation Count (number of violations detected)
- G: Is Active (true/false if still taking quiz)
- H: Last Updated (timestamp of last update)

### 2. **Answers Sheet**
Records each individual answer submitted.

**Columns:**
- A: Participant ID
- B: Participant Name
- C: Question ID (1-15)
- D: Answer (what they typed)
- E: Time Spent (seconds on that question)
- F: Is Correct (true/false)
- G: Timestamp (when answer was submitted)

### 3. **Violations Sheet**
Logs all anti-cheat violations detected.

**Columns:**
- A: Participant ID
- B: Participant Name
- C: Violation Type (copy, paste, tab_change, focus_loss)
- D: Details (description of what happened)
- E: Timestamp (when violation occurred)

## Setup Instructions

### Step 1: Create Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Science Quiz Results" (or your preferred name)
4. Note the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Set up Google Apps Script
1. In your spreadsheet, go to **Extensions > Apps Script**
2. Delete the default `myFunction()` code
3. Copy and paste the entire contents of `google-apps-script.js` into the editor
4. Save the project (Ctrl+S or Cmd+S)
5. Name your project "Science Quiz Integration"

### Step 3: Deploy as Web App
1. Click **Deploy > New deployment**
2. Click the gear icon next to "Type" and select **Web app**
3. Set the following:
   - **Description:** "Science Quiz Data Handler"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Important:** Copy the Web App URL that appears - you'll need this!
6. Click **Done**

### Step 4: Configure the Quiz App
1. In the quiz app, open `src/App.tsx`
2. Find this line:
   ```javascript
   const webAppUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. Replace `YOUR_SCRIPT_ID` with your actual Web App URL from Step 3

### Step 5: Test the Integration
1. Start the quiz app
2. Register a participant and answer a few questions
3. Check your Google Spreadsheet - you should see:
   - Participant data in the "Participants" sheet
   - Individual answers in the "Answers" sheet
   - Any violations in the "Violations" sheet

## Data Flow

1. **Participant Registration:** Creates entry in Participants sheet
2. **Each Answer:** Updates Participants sheet + adds row to Answers sheet
3. **Each Violation:** Adds row to Violations sheet
4. **Real-time Updates:** Data appears in sheets within seconds

## Troubleshooting

### Common Issues:
1. **"Script not found" error:** Double-check your Web App URL
2. **Permission denied:** Make sure Web App access is set to "Anyone"
3. **No data appearing:** Check browser console for error messages

### Testing the Web App:
You can test if your Web App is working by visiting the URL directly in a browser. You should see a blank page (this is normal for POST-only endpoints).

## Security Notes

- The Web App URL is public but only accepts POST requests with specific data structure
- No sensitive data is transmitted - only quiz responses and timing data
- Participant names are the only personally identifiable information stored

## Data Analysis

Once data is flowing, you can:
- Create charts and graphs in Google Sheets
- Export data to other analysis tools
- Set up automated reports
- Monitor quiz performance in real-time during the session

Your Google Sheets will automatically update as participants take the quiz!