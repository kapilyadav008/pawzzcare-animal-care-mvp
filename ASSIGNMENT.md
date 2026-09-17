# PawzzCare — "Practo for Animals"
Product & Technology Intern Screening Assignment Submission

**Role**: Product & Technology Intern  
**Project**: PawzzCare — Animal Care Discovery & AI Health Organizer  
**Brief**: Practo for Animals (Screening Assignment)  
**GitHub Repository**: https://github.com/kapilyadav008/pawzzcare-animal-care-mvp  
**Deployment Status**: Not deployed. Submitted as a functional local working prototype.

---

## Submission & Prototype Info

- **Prototype**: Working full-stack prototype available through the submitted GitHub repository and runnable locally.
- **GitHub**: https://github.com/kapilyadav008/pawzzcare-animal-care-mvp
- **Deployment**: Not deployed. The project is submitted as a functional local prototype.
- **Nature of Project**: This is an internship screening assignment prototype, not a production system.

---

## 1. Product Concept

### Target Users
- **Primary**: Pet Parents (who experience anxiety, care uncertainty, and scattered pet health records across paper, Instagram, and WhatsApp).
- **Secondary**: Animal Rescuers & Volunteers (who need quick access to local rescue services, ambulances, and NGOs).

### First Problem Solved
Animal-care information in India is highly fragmented across Google, Instagram, WhatsApp, and word of mouth. When an animal shows symptoms (e.g., *"My dog has been vomiting since morning"*), pet parents struggle to:
1. Understand what type of care service is appropriate (routine vet vs. emergency care).
2. Find relevant nearby care providers quickly.
3. Organize previous medical reports to share during veterinary visits.

PawzzCare solves this friction by providing a unified care discovery assistant and a lightweight AI medical document organizer.

### 5 Prioritized Features
1. **AI Care Assistant**: Processes natural-language care requests, mapping symptoms to urgency and suggested service types safely without medical diagnosis.
2. **Location-Based Care Discovery**: Distance-based, filterable directory of Gurgaon clinics, vets, ambulances, NGOs, and rescuers.
3. **AI Medical Record Organizer**: Multi-stage document parser extracting facts from PDFs and images into structured medical events.
4. **Care Passport**: A shareable, concise pet health snapshot for quick review.
5. **Vet Visit Preparation Summary**: One-click summary aggregating recent medical events and generating relevant questions for the vet.

---

## 2. User Flow & Prototype

### Prototype User Flow
```
[Home Screen]
  ↓
Describe what is happening (Natural language query)
  ↓
AI Care Assistant (Urgency + Suggested Service) OR Find Care
  ↓
Discover Nearby Providers (Gurgaon Directory)
  ↓
Upload Medical Records (PDF / Image Document)
  ↓
AI Health Vault (Fact Extraction)
  ↓
Care Passport / Vet Visit Preparation Summary
```

*Note: The prototype demonstrates the core pet-parent journey through fully implemented screens. Payments, complex booking, and doctor portals are intentionally excluded.*

---

## 3. AI & Automation

### AI-Powered Workflows
1. **Care Intent & Triage**: Analyzes natural-language queries to determine animal type, symptoms, duration, urgency, and recommended service type. Includes strict safety disclaimers (no diagnosis/prescriptions).
2. **Medical Document Fact Extraction**:
   - **PDFs**: Text extracted via `pdf-parse` $\rightarrow$ Gemini 2.5 Flash / Fallback AI extracts explicit facts (`petName`, `species`, `documentType`, `documentDate`, `testValues`, `observations`).
   - **Images**: Direct buffer $\rightarrow$ Gemini multimodal vision API.
3. **Medical Timeline Automation**: Converts extracted medical records into chronological timeline events automatically.
4. **Vet Visit Summary Generation**: Aggregates pet timeline events into a concise summary with recommended questions to ask during a vet consultation.

### Original Product Concepts
- **Care Passport**: A shareable pet health snapshot bridging pet parents and veterinarians.
- **Zero-Diagnosis Boundary**: System strictly extracts explicit document facts and returns missing fields as `null` without inventing diagnoses or drug dosages.
- **Deterministic Fallback AI Engine**: Standalone rule-based engine ensuring 100% uptime and test coverage even when offline or without a Gemini API key.
- **Pet-Parent-Friendly Timeline**: Lightweight, chronological medical history design.

---

## 4. Technology

### Technology Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router v6, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Mongoose, MongoDB, Zod, Multer, `pdf-parse`.
- **AI**: Google Gemini API (`@google/genai`) with fallback engine.
- **Testing**: Vitest and Supertest.

### Key Integrations & Components
1. **Google Gemini API**: AI care query processing and medical document fact extraction.
2. **MongoDB Database**: Persistent storage for pet profiles, medical records, timeline events, and provider listings.
3. **Express REST API**: Backend API routing with Zod schema validation.
4. **PDF Parsing Component (`pdf-parse`)**: Server-side raw text extraction from PDF report buffers.
5. **Gemini Multimodal Vision Integration**: Image buffer analysis for JPG/PNG medical reports.

### Architecture Overview
```
[React Client] ──► [Express REST API] ──► [Zod Validation] ──► [MongoDB Database]
                                                                  │
                                                     ┌────────────┴────────────┐
                                                     ▼                         ▼
                                            [Gemini 2.5 API]        [Fallback AI Engine]
```

---

## 5. MVP Thinking — 30 Days

### Build First (Days 1–30)
- Core pet-parent care journey (Natural language query $\rightarrow$ Care Guidance $\rightarrow$ Gurgaon Discovery).
- AI Care Assistant with strict safety disclaimers.
- Location-based Gurgaon provider directory with category filters.
- AI Medical Document Vault (PDF/Image parsing + timeline auto-creation).
- Care Passport & Vet Visit Preparation Summary.

### Deliberately Leave Out
- Payment gateway integration.
- Complex appointment booking systems.
- Veterinarian & clinic login dashboards.
- Real-time chat & telemedicine video streaming.
- Prescription generation and medical diagnostic decision trees.

*Rationale: These features are intentionally excluded in order to focus on validating the core discovery and medical document organization problem first.*

---

## 6. Submission & Tools

- **Prototype Repository**: https://github.com/kapilyadav008/pawzzcare-animal-care-mvp
- **State**: Working local full-stack prototype; not deployed.
- **Tools Used**:
  - Google Antigravity (AI pair-programming agent for full-stack implementation, file creation, refactoring, and test writing).
  - ChatGPT (Product ideation & initial requirement structuring).
  - Google Gemini API (In-product AI care triage and document extraction).
  - VS Code & Git.
