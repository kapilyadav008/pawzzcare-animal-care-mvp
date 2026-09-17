# PawzzCare — Practo for Animals
Product & Technology Intern Screening Assignment

**Candidate Submission**: Product & Technology Intern Screening Assignment  
**GitHub Repository**: https://github.com/kapilyadav008/pawzzcare-animal-care-mvp  
**Prototype State**: Working local full-stack prototype; not deployed.

---

## 1. Product Concept

### Target Users
- **Primary**: Pet Parents (struggling with care uncertainty and scattered paper/WhatsApp medical reports).
- **Secondary**: Animal Rescuers & Volunteers (requiring quick access to emergency animal ambulances, NGOs, and shelters).

### First Problem Solved
Animal-care information in India is fragmented across Google, Instagram, WhatsApp, and word of mouth. When an animal shows symptoms (e.g., *"My dog has been vomiting since morning"*), pet parents struggle to determine what type of care service is needed, find nearby relevant providers, and organize past medical reports to share with veterinarians. PawzzCare addresses this core friction by combining intelligent care discovery with automated medical document organization.

### 5 Prioritized Features
1. **AI Care Assistant**: Converts natural-language symptom queries into structured urgency, recommended service types, and clarification questions without medical diagnosis.
2. **Location-Based Care Discovery**: Filterable directory of Gurgaon clinics, vets, ambulances, NGOs, and rescuers with distance sorting.
3. **AI Medical Record Organizer**: Multi-stage document parser extracting facts from PDF/image reports into structured timeline events.
4. **Care Passport**: A shareable, concise pet health snapshot.
5. **Vet Visit Preparation Summary**: One-click summary aggregating recent medical events and generating relevant questions for the vet.

---

## 2. User Flow & Prototype

### Text User Flow
```
Home
 → Natural-language care query
 → AI Care Assistant OR Find Care
 → Suggested service / urgency
 → Nearby providers
 → Upload medical records
 → AI Health Vault
 → Care Passport / Vet Summary
```

*Note: The prototype demonstrates the core pet-parent journey through the implemented screens. It is submitted as a functional local prototype for screening evaluation.*

---

## 3. AI & Automation

### 4 AI-Powered Workflows
1. **Care Intent & Triage**:
   - *Input*: Natural-language animal-care query.
   - *Processing*: Gemini 2.5 Flash / Fallback AI extracts animal type, symptoms, and duration.
   - *Output*: Urgency, recommended service type, reasoning, and clarification questions.
   - *Safety*: Strict disclaimers; zero disease diagnosis or drug dosage prescribing.
2. **Medical Document Fact Extraction**:
   - *PDF*: `pdf-parse` $\rightarrow$ raw text $\rightarrow$ Gemini structured extraction.
   - *Image*: Image buffer $\rightarrow$ Gemini multimodal vision.
   - *Output*: Explicit facts (`petName`, `species`, `documentType`, `documentDate`, `testValues`, `observations`). Missing fields return `null`.
3. **Medical Timeline Automation**: Converts extracted medical records into chronological timeline events automatically.
4. **Vet Visit Summary**: Aggregates timeline events into a concise summary with generated questions to ask during a vet consultation.

### Original Product Concepts
- **Care Passport**: Shareable health snapshot bridging pet parents and veterinarians.
- **Zero-Diagnosis Boundary**: Document is the sole source of truth; missing fields return `null` without invented diagnoses or dosages.
- **Deterministic Fallback AI Mode**: Rule-based engine ensuring 100% application uptime and test coverage offline.
- **Pet-Parent-Friendly Health Timeline**: Simplified chronological record layout.

---

## 4. Technology

### Technology Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Mongoose, MongoDB, Zod, Multer, `pdf-parse`.
- **AI**: Google Gemini API using `@google/genai` (with fallback engine).
- **Testing**: Vitest and Supertest.

### Key Integrations & Components
1. **Google Gemini API**: AI care query processing and medical document fact extraction.
2. **MongoDB**: Persistent database for pets, medical records, timeline events, and providers.
3. **Express REST API**: Frontend/backend API communication with Zod schema validation.
4. **PDF Parsing Integration (`pdf-parse`)**: Server-side raw text extraction from PDF report buffers.
5. **Gemini Multimodal Vision Integration**: Image buffer analysis for JPG/PNG medical documents.

### Architecture Overview
```
React Client ──► Express REST API ──► Zod Validation ──► MongoDB ──► Gemini AI / Fallback AI
```

---

## 5. MVP Thinking — 30 Days

### Build First (Days 1–30)
- Core pet-parent care journey (Symptom query $\rightarrow$ Guidance $\rightarrow$ Gurgaon Discovery).
- AI Care Assistant with strict safety disclaimers.
- Location-based Gurgaon provider discovery with category filters.
- Medical PDF/image organization & auto-timeline creation.
- Care Passport & Vet Visit Preparation Summary.

### Deliberately Leave Out
- In-app payment processing.
- Complex appointment booking workflows.
- Veterinarian & clinic portal login dashboards.
- Real-time chat & telemedicine video streaming.
- Prescription generation and medical diagnostic decision trees.

*Rationale: These features are intentionally excluded to validate the core care discovery and information organization problem first.*

---

## 6. Prototype & Tools

### Prototype Link & State
- **GitHub Repository**: https://github.com/kapilyadav008/pawzzcare-animal-care-mvp
- **State**: Working local full-stack prototype; not deployed.

### Tools Used
- **Google Antigravity**: Used as an AI pair-programming agent for full-stack TypeScript implementation, file creation, refactoring, and test writing. Product and architecture decisions were reviewed and directed during development.
- **ChatGPT**: Used for initial product concept brainstorming and persona definition.
- **Google Gemini API**: Embedded inside the application for structured AI care triage and document extraction.
