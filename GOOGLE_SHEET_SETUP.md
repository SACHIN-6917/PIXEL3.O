# PIXELO 3.O — Google Sheet Backend Setup Guide

This guide explains how to connect your **PIXELO 3.O** website registration to your Google Spreadsheet.

---

### Step 1: Create the Google Spreadsheet
1. Open [Google Sheets](https://sheets.new).
2. Name the spreadsheet:
   ```
   PIXELO 3.O – Event Registrations 2026
   ```
3. Rename the first sheet/tab at the bottom to:
   ```
   Registrations
   ```
   *(Do NOT create any other sheets or tabs)*

---

### Step 2: Add Google Apps Script
1. In the Google Spreadsheet, click on **Extensions** > **Apps Script**.
2. Delete any code inside the editor.
3. Open the file [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) in this project.
4. Copy the entire contents and paste it into the Google Apps Script editor.
5. Click the **Save** icon (diskette).

---

### Step 3: Deploy as Web App
1. In the top right corner of Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description**: `PIXELO 3.O Registration API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial so participants can submit from the website)*
4. Click **Deploy**.
5. Grant permissions if prompted by Google (click *Advanced* > *Go to Untitled project (unsafe)* > *Allow*).
6. Copy the generated **Web app URL** (looks like: `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Configure Web App URL in Website
1. Open `.env.local` (or `.env`) in the root of this project:
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_DEPLOYMENT_ID/exec
   ```
2. Restart your development server:
   ```bash
   npm run dev
   ```

---

### Verification
Once deployed:
1. The script will automatically create the 23 exact columns with orange header formatting on the first submission.
2. Every registration will be saved as **EXACTLY ONE ROW**.
3. Sequential IDs will be concurrency-safely created as `PIXELO3.O-001`, `PIXELO3.O-002`, etc.
4. Deadline enforcement stops registrations after **13 October 2026, 10:00 PM IST**.
