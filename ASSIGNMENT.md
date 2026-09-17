# Screening Assignment: PawzzCare — "Practo for Animals"

**Role**: Product & Technology Intern  
**Project**: PawzzCare — Animal Care Discovery & AI Health Organizer  
**Brief**: Practo for Animals (Antigravity Submission)

---

## 🔗 SUBMISSION & PROTOTYPE LINK

- **Live Working Prototype**: `http://localhost:5173` (Local Development) / `https://pawzzcare.vercel.app` (Vercel Deployment Ready)
- **Backend API Endpoint**: `http://localhost:5000/api` (Local Express Server) / `https://pawzzcare-api.onrender.com/api` (Render Deployment Ready)
- **GitHub Code Repository**: `https://github.com/kapilyadav008/pawzzcare-animal-care-mvp`
- **Prototype Status**: Verified Full-Stack Working Prototype (React 18 + Vite + Express + TypeScript + Mongoose + Gemini 2.5 AI Engine)

---

## 1. PRODUCT CONCEPT

### Target Users
- **Primary**: Pet Parents (struggling with fragmented care services and scattered paper/WhatsApp medical reports).
- **Secondary**: Animal Rescuers / Volunteers (needing rapid location-based access to emergency ambulances, NGOs, and shelters).

### Core Problem Solved First
When an animal experiences acute distress (e.g. *"My dog has been vomiting since morning"*), pet parents face friction at three levels:
1. **Uncertainty**: Not knowing what level of care is required (clinic vs. emergency ambulance).
2. **Fragmentation**: Searching across Google, Instagram, and WhatsApp for reliable nearby vets.
3. **Information Loss**: Arriving at the clinic without structured medical history or previous blood reports.

PawzzCare eliminates this friction by answering: *"What type of care do I need, where do I find it, and is my pet's medical information ready for the vet?"*

### Top 5 Prioritized Features
1. **AI Care Triage Assistant**: Converts natural-language symptoms into structured urgency, recommended service types, and clarification questions without medical diagnosis.
2. **Location-Based Discovery Directory**: Distance-sorted, filterable directory of Gurgaon vets, 24/7 clinics, ambulances, NGOs, and rescuers.
3. **AI Medical Record Vault**: Multi-stage document parser extracting facts from PDF/Images into chronological medical events.
4. **Care Passport**: A shareable, single-page pet health snapshot for rapid verification and sharing.
5. **Vet Visit Preparation Summary**: One-click concise summary of recent health events and generated questions to ask during consultations.

---

## 2. USER FLOW & PROTOTYPE JOURNEY

```
[HOME] ──► "What's happening with your animal?" (Natural Language Input)
  │
  ├──► Service Lookup (e.g. "vet near me") ──► [FIND CARE DIRECTORY]
  │                                                     │
  └──► Symptom / Care Query ──────────────────► [AI CARE ASSISTANT]
                                                        │
                                          Suggests Service & Urgency
                                                        │
                                            [FIND NEARBY PROVIDERS]
                                                        │
                                           [UPLOAD MEDICAL DOCUMENTS]
                                                        │
                                             [AI HEALTH VAULT]
                                                        │
                                            [CARE PASSPORT & VET SUMMARY]
```

---

## 3. AI & AUTOMATION

### AI-Powered Workflows
1. **Care Intent & Triage Analysis**: Processes user symptom queries using Gemini 2.5 Flash to output structured JSON (`animalType`, `symptoms`, `duration`, `urgency`, `recommendedServiceType`, `reasoning`, `clarifyingQuestions`).
2. **Document Fact Extraction**: 
   - **PDF Pipeline**: Raw text extracted via `pdf-parse` → Gemini structured fact extraction (`petName`, `species`, `documentType`, `testValues`, `observations`).
   - **Multimodal Image Pipeline**: Image buffer → Gemini multimodal vision API.
3. **Automated Timeline & Vet Summary Generation**: Compiles extracted records into a clean timeline and generates a visit summary with questions to ask the vet.

### Original Product Concept: Care Passport & Zero-Diagnosis Boundary
- **Care Passport**: A shareable health card bridging pet parents and vets.
- **Safety Boundary**: The system strictly extracts explicit text facts. It returns missing values as `null` and **never** infers diseases, interprets lab ranges as diagnoses, or prescribes drug dosages.

---

## 4. TECHNOLOGY ARCHITECTURE

### Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB), Zod Validation, Multer, `pdf-parse`.
- **AI Service**: Google Gemini API (`@google/genai`) with fallback engine.

### Integrations & Data Flow
```
[React Client] ──(REST / JSON)──► [Express API] ──► [Zod Validator]
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
        [MongoDB Database]      [Gemini 2.5 API]      [Fallback AI Engine]
```

---

## 5. 30-DAY MVP THINKING

### Build First (Days 1–30)
- Core pet parent journey (Symptom query → Service type → Gurgaon discovery).
- PDF medical document upload and timeline auto-generation.
- Basic provider listings in target geography (Gurgaon).
- Care Passport sharing and Vet Summary generator.

### Deliberately Leave Out
- In-app payment processing and complex appointment booking systems.
- Vet/Clinic portal login dashboards.
- Real-time chat & telemedicine video streaming.
- Prescription generation and diagnostic decision trees.
