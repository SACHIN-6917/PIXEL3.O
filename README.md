# 🔥 PIXEL-3.O — National Level Technical Symposium

**Organized by:**  
Department of Computer Science and Engineering  
**Adhiparasakthi Engineering College (AEC), Melmaruvathur**  
*In Association with Computer Society of India (CSI) – Kanchipuram Chapter*  
**Date of Symposium:** 14 October 2026 | **Reporting Time:** 09:00 AM IST  
**Registration Deadline:** 13 October 2026, 10:00 PM IST  

---

## 📑 Table of Contents
1. [Overview & Aesthetics](#-overview--aesthetics)
2. [Tech Stack](#-tech-stack)
3. [Confirmed Events & Strict Team Size Rules](#-confirmed-events--strict-team-size-rules)
4. [₹129 Fee Logic & Participant Deduplication](#-129-fee-logic--participant-deduplication)
5. [End-to-End Registration Flow](#-end-to-end-registration-flow)
6. [UPI Payment System (Dynamic & Static QR)](#-upi-payment-system-dynamic--static-qr)
7. [Google Sheets Backend Architecture (`Code.gs`)](#-google-sheets-backend-architecture-codegs)
8. [Comprehensive Admin Portal](#-comprehensive-admin-portal)
9. [CSV Export Guide](#-csv-export-guide)
10. [Environment Variables](#-environment-variables)
11. [Local Development & Production Build](#-local-development--production-build)
12. [Verification Checklist](#-verification-checklist)

---

## 🌟 Overview & Aesthetics
**PIXEL-3.O** is a premium, high-performance web platform architected for a national-level engineering symposium. The design is built around the mythological **Phoenix** — symbolizing energy, rebirth, and analytical excellence — featuring rich dark charcoal accents, vibrant flame gradients (Gold, Orange, Red, Magenta, Purple), smooth Framer Motion micro-animations, and responsive layouts across mobile, tablet, and desktop devices.

---

## 🛠️ Tech Stack
- **Frontend Framework:** React 19 + TypeScript + Vite
- **Styling:** Vanilla CSS & Tailwind CSS with curated Phoenix design tokens
- **Typography:** Space Grotesk / Inter
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **QR Engine:** `qrcode` (real-time dynamic SVG/DataURL generation)
- **Celebration Effects:** `canvas-confetti`
- **Backend:** Google Apps Script Web App (Serverless, Concurrency-Safe, Single Google Sheet)
- **Database:** Google Spreadsheet (`PIXEL-3.O – Event Registrations 2026`)

---

## 🎯 Confirmed Events & Strict Team Size Rules

The symposium features **EXACTLY FOUR** authorized arenas. Old events (`CODESPRINT` and `KITTY PARTY 101`) have been completely removed from public routes, APIs, and the admin system.

| # | Event Name | Category | Exact Team Size | Venue | Time Slot | Description |
|:---:|:---|:---:|:---:|:---|:---:|:---|
| **01** | **PAPERQUEST** | Technical | **EXACTLY 4 MEMBERS** | Main Auditorium | 10:30 AM – 12:10 PM | Research paper presentation symposium arena before expert faculty evaluators. |
| **02** | **AI FILMFORGE** | Technical | **EXACTLY 1 MEMBER (Solo)** | Main CSE Lab | 10:30 AM – 12:10 PM | Generative AI short film creation and prompt engineering challenge. |
| **03** | **CHECKMATE** | Non-Technical | **EXACTLY 1 MEMBER (Solo)** | Main CSE Lab | 01:40 PM – 03:30 PM | FIDE rapid / blitz knockout chess arena. |
| **04** | **MINE RELAY** | Non-Technical | **EXACTLY 4 MEMBERS** | Auditorium | 01:40 PM – 03:30 PM | Timed puzzle deciphering and obstacle navigation relay race. |

### Strict Team Size Rule:
- ONLY **1 participant (Solo)** OR **4 participants (Team)** are allowed.
- Teams of 2, 3, 5, 6, 7+ members are strictly disallowed and blocked by both frontend form validation and Google Apps Script server validation.
- Allowed Event Combinations:
  - Technical only (PaperQuest or AI FilmForge)
  - Non-Technical only (Checkmate or Mine Relay)
  - One Technical + One Non-Technical (e.g. PaperQuest + Checkmate, PaperQuest + Mine Relay, AI FilmForge + Checkmate, AI FilmForge + Mine Relay)
- At least ONE event is required. Selecting two technical or two non-technical events is blocked.

---

## 💰 ₹129 Fee Logic & Participant Deduplication

The registration fee is strictly **₹129 per UNIQUE participant**.

### Mathematical Formula:
$$\text{Total Amount} = \text{Unique Participant Count} \times 129$$

### Deduplication Rule:
If a participant competes in both a Technical event and a Non-Technical event, they are counted **only once**. The system never charges a participant twice.

### Real-World Calculation Examples:
- **Example A (PaperQuest + Checkmate):**
  - PaperQuest Team (4 members): *Arun, Rahul, Vijay, Karthik*
  - Checkmate Solo (1 member): *Arun*
  - Unique Participants: *Arun, Rahul, Vijay, Karthik* $\rightarrow$ **4 Unique Members**
  - Total Fee: $4 \times 129 = \mathbf{₹516}$ *(NOT ₹645)*.
- **Example B (AI FilmForge + Mine Relay):**
  - AI FilmForge Solo (1 member): *Arun*
  - Mine Relay Team (4 members): *Arun, Anu, Kavi, Divya*
  - Unique Participants: *Arun, Anu, Kavi, Divya* $\rightarrow$ **4 Unique Members**
  - Total Fee: $4 \times 129 = \mathbf{₹516}$.
- **Example C (Solo Only):**
  - Checkmate Solo (1 member): *Arun* $\rightarrow$ $1 \times 129 = \mathbf{₹129}$.

Both the client Review screen and the backend Apps Script run identical case-insensitive name deduplication to guarantee fee accuracy.

---

## 🚀 End-to-End Registration Flow

The registration flow is a 6-step interactive wizard accessible at `/registration`:

1. **Step 1 — Participant Details:**
   - Participant enters: Full Name, College Name, Department, 10-digit Phone, Email ID.
   - This person automatically becomes **Member 1 (Main Participant)** for all selected events.
2. **Step 2 — Event Selection:**
   - Technical (Max 1): *PaperQuest* (Team of 4), *AI FilmForge* (Solo), or *No Technical Event*.
   - Non-Technical (Max 1): *Checkmate* (Solo), *Mine Relay* (Team of 4), or *No Non-Technical Event*.
   - Validation ensures at least one event is chosen.
3. **Step 3 — Team Member Details:**
   - If *PaperQuest* selected: Form asks for Member 2, Member 3, Member 4 (all mandatory).
   - If *Mine Relay* selected: Form asks for Member 2, Member 3, Member 4 (all mandatory).
   - If *AI FilmForge* or *Checkmate* selected: Solo event, no extra members needed.
4. **Step 4 — Review & Dynamic Breakdown:**
   - Full summary of participant data and event rosters.
   - Shows deduplicated list of unique attendees.
   - Displays clear pricing breakdown: Total Unique Members, ₹129 fee per head, and Total Amount.
5. **Step 5 — Payment & Dynamic UPI QR:**
   - Real-time dynamic UPI QR code rendered with exact calculated amount.
   - Payee: `PIXEL-3.O`, UPI ID: `sachinvelu6925-2@oksbi`.
   - "PAY VIA ANY UPI APP" deep link button for mobile devices.
   - "View Static Organizer QR (Reference)" toggle to inspect the fallback organizer image.
   - Participant enters the 12-digit UTR / Transaction Reference ID.
   - Double-click and duplicate submission prevention disabled on click.
6. **Step 6 — Confirmation & Pass:**
   - Displays official Registration ID (e.g. `PIXEL-3.O-001`).
   - Payment Status marked as `Submitted` (awaiting admin audit).
   - **"JOIN PIXEL-3.O WHATSAPP GROUP"** button: Direct invite link to `https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v`.
   - **"DOWNLOAD CONFIRMATION PASS"** button: Generates an official text pass with all symposium reporting details.

---

## 💳 UPI Payment System (Dynamic & Static QR)

### 1. Dynamic UPI QR:
The website encodes the exact total calculated fee dynamically for every user:
```
upi://pay?pa=sachinvelu6925-2@oksbi&pn=PIXEL-3.O&am={TOTAL_AMOUNT}&cu=INR&tn={REGISTRATION_NOTE}
```
* **₹129:** `upi://pay?pa=sachinvelu6925-2@oksbi&pn=PIXEL-3.O&am=129&cu=INR&tn=PIXEL-3.O`
* **₹516:** `upi://pay?pa=sachinvelu6925-2@oksbi&pn=PIXEL-3.O&am=516&cu=INR&tn=PIXEL-3.O`

### 2. Static Reference QR:
- Located at `/Payment-Qr.jpeg` in the public folder.
- Contains the official static Google Pay UPI QR for `sachinvelu6925-2@oksbi`.
- Available inside a clean collapsible accordion on the payment step as a reference fallback for manual entry.

---

## 📊 Google Sheets Backend Architecture (`Code.gs`)

### Live Google Apps Script Web App Endpoint:
```
https://script.google.com/macros/s/AKfycbxzUn5hFzvTP3GotvliByvdKDeMBLAO61WLjbpMe_yGCMNISsF7l11VeCPRKcwsbZ5Meg/exec
```

### Google Spreadsheet Specifications:
- **Spreadsheet Name:** `PIXEL-3.O – Event Registrations 2026`
- **Tab Name:** `Registrations` (Single tab only. No separate tabs for events or payments).
- **Storage Rule:** Every registration creates **EXACTLY ONE ROW**.

### Exact 23 Columns Order:
1. `Registration_ID` (Concurrency-safe format: `PIXEL-3.O-001`, `PIXEL-3.O-002`...)
2. `Full_Name`
3. `College`
4. `Department`
5. `Phone_Number`
6. `Email_ID`
7. `Technical_Event`
8. `Technical_Member1`
9. `Technical_Member2`
10. `Technical_Member3`
11. `Technical_Member4`
12. `Non_Technical_Event`
13. `Non_Technical_Member1`
14. `Non_Technical_Member2`
15. `Non_Technical_Member3`
16. `Non_Technical_Member4`
17. `Total_Members`
18. `Fee_Per_Head` (`129`)
19. `Total_Amount`
20. `Payment_Status` (`Submitted` by default, `Paid` upon admin verification)
21. `Payment_ID` (UTR Transaction reference)
22. `Registration_Status` (`Confirmed` / `Cancelled`)
23. `Registered_AT` (IST Timestamp: `YYYY-MM-DD HH:mm:ss IST`)

### Concurrency & Deadline Safety:
- Employs `LockService.getScriptLock()` with a 30-second concurrency lock to prevent race conditions on simultaneous submissions.
- Uses `PropertiesService.getScriptProperties()` for continuous, incremental numbering.
- Rejects new public submissions automatically after **13 October 2026, 10:00 PM IST** (`DEADLINE_EPOCH`).

---

## 🛡️ Comprehensive Admin Portal

A completely separate, password-protected administrative interface built with a responsive dashboard, sidebar, and mobile drawer.

### Admin Routes:

| Route | Page | Purpose |
|:---|:---|:---|
| `/admin/login` | **Admin Login** | Secure entry. Show/hide password, session token authentication. |
| `/admin/dashboard` | **Dashboard** | 7 real-time KPI cards + recent registrations with click-to-view drawer. |
| `/admin/registrations` | **Registrations** | Search by any field, filter by Tech/Non-Tech/Payment/Status, pagination, **Verify Payment**, **Mark Pending**, **Cancel Registration**, and **CSV Export**. |
| `/admin/participants` | **Unique Participants** | Roster of deduplicated individual attendees across all teams and solo entries, role tags, and **CSV Export**. |
| `/admin/payments` | **Payments Audit** | Financial reconciliation, UTR transaction check, payment verification modal, and **CSV Export**. |
| `/admin/events` | **Events & Quotas** | Strict directory of the 4 confirmed symposium events with rules, capacities, venues, and timings. |
| `/admin/analytics` | **Analytics** | Visual charts, technical vs non-technical ratio, payment status distribution, college and department rankings. |
| `/admin/settings` | **System Diagnostics** | Real-time status of Google Apps Script URL, UPI ID, deadline cutoff check, and local cache purge. |

### Admin Quick Access Shortcut:
- **Global Keybinding:** Press **`Ctrl + F1`** (or `Cmd + F1`) on **any page** of the website to immediately open the Admin Portal!

### Admin Credentials:
- **Username:** `PIXEL3.O`
- **Password:** `PIXEL@26`
*(Also accepts case-insensitive `pixel3.o` and legacy `admin` / `pixelo2026@admin`).*

---

## 📥 CSV Export Guide

Admins can export live symposium data directly from:
- `/admin/registrations` $\rightarrow$ Exports all current filtered registrations with all 23 columns.
- `/admin/payments` $\rightarrow$ Exports financial records, UTRs, and payment statuses.
- `/admin/participants` $\rightarrow$ Exports the unique participant directory.

**Security:** Password hashes, tokens, and secret environment variables are never included in exported CSV files.

---

## ⚙️ Environment Variables

Create or update `.env.local` in the project root:

```env
# Google Apps Script Web App Endpoint
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxzUn5hFzvTP3GotvliByvdKDeMBLAO61WLjbpMe_yGCMNISsF7l11VeCPRKcwsbZ5Meg/exec
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxzUn5hFzvTP3GotvliByvdKDeMBLAO61WLjbpMe_yGCMNISsF7l11VeCPRKcwsbZ5Meg/exec

# Official UPI ID for Dynamic QR Payments
VITE_UPI_ID=sachinvelu6925-2@oksbi

# Official WhatsApp Group Link
VITE_WHATSAPP_LINK=https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v
```

---

## 💻 Local Development & Production Build

### 1. Install Dependencies:
```bash
npm install
```

### 2. Run Local Development Server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production:
```bash
npm run build
```
Generates an optimized production bundle in the `dist/` folder.

### 4. Preview Production Build:
```bash
npm run preview
```

---

## ✅ Verification Checklist

- [x] **Public Design:** Existing Phoenix video hero, colors, fonts, about, agenda, venues, coordinators, and footer completely preserved.
- [x] **Event Quotas:** Exactly four events: PaperQuest (4), AI FilmForge (1), Checkmate (1), Mine Relay (4).
- [x] **Team Validation:** Only 1 or 4 members allowed. 2, 3, 5+ disallowed.
- [x] **Deduplication:** ₹129 per unique participant calculated correctly.
- [x] **Dynamic QR:** Pre-fills calculated amount (`sachinvelu6925-2@oksbi`).
- [x] **Static Reference QR:** Available at `/Payment-Qr.jpeg`.
- [x] **WhatsApp Link:** Verified `https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v`.
- [x] **Google Sheet Integration:** Connected to live Web App URL; writes to single `Registrations` sheet with 23 columns.
- [x] **Admin System:** Complete 8-route portal with live metrics, payment verification, and CSV exports.

---

**PIXEL-3.O Organizing Committee**  
Department of Computer Science and Engineering  
Adhiparasakthi Engineering College, Melmaruvathur  
*Let the Phoenix Rise! 🔥*
