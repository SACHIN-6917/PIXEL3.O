# PIXEL-3.O — Google Sheet Backend Setup Guide

This guide explains how to connect your **PIXEL-3.O** website registration to your Google Spreadsheet.

---

### Direct Google Spreadsheet Link
- **Target Spreadsheet**: [PIXELO3.O — Google Spreadsheet](https://docs.google.com/spreadsheets/d/1OncFSqAdmW7eCTUvtKtbyYhSAJmgIWaZjsNsewgLcHY/edit?pli=1&gid=0#gid=0)
- **Tab Name**: `PIXELO 3.O – Event Registrations 2026` (or `Registrations`)
- **Web App URL**: `https://script.google.com/macros/s/AKfycbxzUn5hFzvTP3GotvliByvdKDeMBLAO61WLjbpMe_yGCMNISsF7l11VeCPRKcwsbZ5Meg/exec`

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
   - **Description**: `PIXEL-3.O Registration API`
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

### Verification & Features
Once deployed:
1. The script will automatically create the 23 exact columns with orange header formatting on the first submission.
2. Every registration will be saved as **EXACTLY ONE ROW**.
3. Strict team sizes enforced:
   - **PAPERQUEST**: Exactly 4 members
   - **AI FILMFORGE**: Exactly 1 member (Solo)
   - **CHECKMATE**: Exactly 1 member (Solo)
   - **MIME RELAY**: Exactly 4 members
4. ₹129 fee per unique participant with cross-event deduplication.
5. Dynamic UPI QR with UPI ID `gokulkumar1406@okaxis` and pre-filled amount.
6. Static fallback/reference QR available from `/Payment-Qr.jpeg`.
7. Concurrency-safe sequential IDs: `PIXEL-3.O-001`, `PIXEL-3.O-002`, etc.
8. Deadline enforcement stops registrations after **13 October 2026, 10:00 PM IST**.
9. Official WhatsApp Group Link: `https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v`

---

### Troubleshooting: "Registrations sheet not found" Fix
If you see the message `Registrations sheet not found`:
1. **Option A (Instant 5-second fix)**:
   - Open your Google Spreadsheet.
   - Look at the tab at the very bottom (e.g., named `Sheet1` or `Sheet 1`).
   - Right-click the tab > click **Rename** > type `Registrations` (exact spelling).
2. **Option B (Update Apps Script code & deployment)**:
   - Open the spreadsheet > click **Extensions** > **Apps Script**.
   - Select all code, delete it, and paste the latest [`google-apps-script/Code.gs`](./google-apps-script/Code.gs).
   - Click **Save** 💾.
   - Click **Deploy** > **Manage deployments** > click the **Edit** ✏️ pencil icon next to your Active deployment.
   - Under **Version**, choose **New version**.
   - Click **Deploy**.

---

### Step 5: Admin Portal Access
- **Admin Hotkey / Shortcut**: Press **`Ctrl + F1`** on any page to immediately open the portal!
- **Admin Login Route**: `/admin/login`
- **Username**: `PIXEL3.O`
- **Password**: `PIXEL@26`
- **Admin Dashboard**: `/admin/dashboard`
- **Manage Registrations & Verify Payments**: `/admin/registrations`
- **Unique Participants Directory**: `/admin/participants`
- **Payments Management**: `/admin/payments`
- **Events & Quotas**: `/admin/events`
- **Analytics & Charts**: `/admin/analytics`
- **System Settings**: `/admin/settings`
- **CSV Export**: Direct filtered CSV exports available on Registrations, Payments, and Participants.

