# PawzzCare — Animal Care Discovery & AI Health Organizer

PawzzCare is a polished, trustworthy MVP web application designed for pet parents and animal rescuers in India. Inspired by the *"Practo for Animals"* screening brief, PawzzCare helps users discover nearby animal-care services and organize scattered health documents without making diagnostic claims.

> **Core Philosophy**: *"Don't try to diagnose the animal. Help the user understand what information they have, what type of care they may need, and where to find it."*

---

## 🚀 Key Features & Experiences

1. **AI Care Assistant (Screen 2)**: Accepts natural-language symptom or care queries, returning structured urgency, suggested care service types, reasoning, and clarification questions with strict medical safety disclaimers.
2. **Nearby Care Discovery (Screen 3)**: Location-based directory in Gurgaon/Gurugram featuring clinics, vets, ambulances, NGOs, and rescuers with distance calculations and transparent demo labels.
3. **AI Medical Record Organizer (Screen 5)**: Parses PDF reports (`pdf-parse` + Gemini) and image documents (multimodal Gemini vision) into structured facts (pet name, test values, vaccinations, medications) without inventing missing data.
4. **Pet Medical Timeline & Care Passport (Screen 4)**: Chronological health history for pet Bruno, featuring the memorable shareable **Care Passport** snapshot.
5. **Vet Visit Preparation Summary (Screen 6)**: Aggregates recent health events into a concise vet-ready report with recommended questions to ask.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Router v6.
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB), Zod Validation, Multer, `pdf-parse`.
- **AI & Multimodal**: Google Gemini API (`@google/genai`) with a robust deterministic **Fallback AI Mode** when `GEMINI_API_KEY` is not present.
- **Testing**: Vitest & Supertest automated test suite.

---

## ⚙️ Environment Variables

Create `.env` in `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pawzzcare
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 💻 Local Setup Instructions

### 1. Install Dependencies
```bash
npm run setup
```

### 2. Seed Database (Demonstration Gurgaon Providers & Pet Bruno)
```bash
npm run seed
```

### 3. Run Development Servers (Backend & Frontend concurrently)
```bash
npm run dev:server   # Starts Express backend on http://localhost:5000
npm run dev:client   # Starts Vite React client on http://localhost:5173
```

### 4. Run Automated Backend Tests
```bash
npm run test
```

### 5. Build Project for Production
```bash
npm run build
```

---

## 🔍 Data Transparency & Safety Guardrails

- **Zero Diagnosis**: The AI never infers medical conditions, interprets lab thresholds as diagnoses, or prescribes drug dosages.
- **Transparent Demo Labels**: All demonstration providers and records in Gurgaon are explicitly tagged with `isDemoData: true` and labeled in the UI as *"Demo Provider Directory"*.
- **Image Pipeline Policy**: If `GEMINI_API_KEY` is unavailable, image files (JPG/PNG) return an explicit notification asking the user to upload PDF format or configure Gemini AI, rather than fabricating medical values.
