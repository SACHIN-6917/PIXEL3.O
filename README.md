# 🔥 PIXEL-3.O — National Level Technical Symposium

**Organized by:**  
Department of Computer Science and Engineering  
**Adhiparasakthi Engineering College (AEC), Melmaruvathur - 603319**  
*In Association with Computer Society of India (CSI) – Kanchipuram Chapter*  
**Date of Symposium:** 14 October 2026 | **Reporting Time:** 09:00 AM IST  
**Registration Deadline:** 13 October 2026, 09:00 PM IST  
**Official Google Registration Form:** [https://forms.gle/YEnqBNgS6VuzYjJe6](https://forms.gle/YEnqBNgS6VuzYjJe6)  
**Official WhatsApp Community:** [https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v](https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v)  

---

## 📑 Table of Contents
1. [Overview & Aesthetics](#-overview--aesthetics)
2. [Tech Stack](#-tech-stack)
3. [Confirmed Events](#-confirmed-events)
4. [Simplified Registration Workflow](#-simplified-registration-workflow)
5. [Floating WhatsApp Widget](#-floating-whatsapp-widget)
6. [Project Structure](#-project-structure)
7. [Environment Configuration](#-environment-configuration)
8. [Local Development & Production Build](#-local-development--production-build)
9. [Developer Credits & Attribution](#-developer-credits--attribution)

---

## 🌟 Overview & Aesthetics

**PIXEL-3.O** is a modern, high-performance web platform built for a national-level engineering symposium. The design system is inspired by the legendary **Phoenix** — symbolizing energy, analytical vigor, and technical mastery — featuring rich dark charcoal accents, curated flame gradients (Gold, Orange, Red, Magenta), smooth Framer Motion page transitions, and responsive layouts across mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

- **Frontend Core:** React 19, TypeScript, Vite 6
- **Routing:** React Router v7
- **Styling:** Tailwind CSS + Vanilla CSS custom variables & utilities
- **Typography:** Space Grotesk / Inter
- **Icons:** Lucide React & official SVG vector icons
- **Micro-Animations:** Framer Motion
- **Verification Passes & Certificates:** QRCode & jsPDF (historical pass rendering)
- **Deployment Platform:** Vercel

---

## 🎯 Confirmed Events

The symposium features **EXACTLY FOUR** official competition arenas:

| # | Event Name | Category | Team Size | Venue | Timing | Description |
|:---:|:---|:---:|:---:|:---|:---:|:---|
| **01** | **PAPERQUEST** | Technical | **Team of 4** | Central Library | 10:30 AM – 12:10 PM | Research paper presentation before expert evaluators. |
| **02** | **AI FILMFORGE** | Technical | **Solo (1 Member)** | Lab PG Block | 10:30 AM – 12:10 PM | Generative AI short film creation and prompt engineering. |
| **03** | **CHECKMATE** | Non-Technical | **Solo (1 Member)** | Lab PG Block | 01:40 PM – 03:30 PM | Rapid/blitz knockout tournament on the 64 squares. |
| **04** | **MINE RELAY** | Non-Technical | **Team of 4** | Central Library | 01:40 PM – 03:30 PM | Three Monkeys sensory coordination challenge: Eyes, Ears, and Mouth. |

*Note: Complimentary vegetarian lunch and refreshments are provided for all registered participants at the Central Library.*

---

## 🚀 Simplified Registration Workflow

The registration process follows a streamlined, direct path:

$$\text{PIXEL 3.O Website} \longrightarrow \text{Click "REGISTER"} \longrightarrow \text{Google Form} \longrightarrow \text{WhatsApp Group}$$

1. **Single Entry Point:**  
   On the homepage, directly below all four event cards in the **THE EVENTS** section, a single **REGISTER** button opens the official Google Registration Form:  
   👉 [https://forms.gle/YEnqBNgS6VuzYjJe6](https://forms.gle/YEnqBNgS6VuzYjJe6)

2. **Form Submission:**  
   Participants submit their college, personal details, and event selections directly in the Google Form.

3. **WhatsApp Community Continuation:**  
   Participants join the official PIXEL 3.O WhatsApp Community for reporting schedules, announcements, and coordinator assistance:  
   👉 [https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v](https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v)

---

## 💬 Floating WhatsApp Widget

A persistent floating WhatsApp button (`FloatingWhatsApp.tsx`) is fixed on the bottom-right of every public page (`bottom-6 right-6 z-50`):
- Displays the official WhatsApp vector icon.
- Features an ambient pulse effect and a tooltip ("Join WhatsApp Group").
- Directs users to the verified community invite URL.

---

## 📂 Project Structure

```text
PIXEL3.O/
├── public/                 # Static assets (favicons, banners, illustrations)
├── src/
│   ├── components/         # Reusable UI elements (Navbar, Footer, Hero, FloatingWhatsApp, etc.)
│   ├── data/
│   │   └── pixeloData.ts   # Confirmed events, agenda schedule, venues, and committee leads
│   ├── hooks/              # Custom React hooks (useScrollReveal)
│   ├── lib/                # Pass generation utilities & Supabase read-only archival interfaces
│   ├── pages/              # Public views (HomePage, AboutPage, AgendaPage, VenuesPage, Coordinators)
│   ├── App.tsx             # Root router & layout wrapper with FloatingWhatsApp
│   ├── index.css           # Global design system, custom utility classes, and gradients
│   └── main.tsx            # React application entry point
├── index.html              # HTML shell with Google Fonts & Open Graph meta tags
├── package.json            # Project dependencies and script commands
├── tailwind.config.js      # Custom theme colors (phoenix-orange, phoenix-red, etc.)
├── tsconfig.json           # TypeScript configuration
└── vercel.json             # SPA fallback rewrite configuration
```

---

## ⚙️ Environment Configuration

Create a `.env` or `.env.local` file in the root directory if customizing environment flags:

```env
# Official WhatsApp Community Group
VITE_WHATSAPP_LINK=https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v
```

---

## 💻 Local Development & Production Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Build
```bash
npm run build
```
Runs TypeScript type check (`tsc -b`) and generates the minified production assets in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 👨‍💻 Developer Credits & Attribution

- **Developed by:** Sachin | **DUDU STUDIO**
- **Organizing Department:** Department of Computer Science and Engineering, Adhiparasakthi Engineering College
- **Professional Association:** Computer Society of India (CSI) – Kanchipuram Chapter
