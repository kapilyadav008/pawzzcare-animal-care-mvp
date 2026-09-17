# AI Usage & Transparency Note

This document outlines the usage of AI tools during the product design, architectural planning, and engineering of **PawzzCare**.

---

## 1. External AI Tools Used During Development

- **ChatGPT / Gemini**: Consulted for high-level product ideation, user persona refinement, and screening brief analysis.
- **Google Antigravity**: Used as an AI pair programming agent for full-stack TypeScript implementation, file creation, code refactoring, and test writing.
- **Google Gemini API (`@google/genai` / `gemini-2.5-flash`)**: Embedded directly inside the PawzzCare production code to power the live AI Care Assistant, document text fact extraction, image multimodal vision, and vet summary generation.

---

## 2. Important Architectural Decisions Made Independently

1. **Strict Zero-Diagnosis Boundary**: AI tools frequently default to suggesting disease diagnosis engines. We explicitly rejected this approach. Instead, PawzzCare enforces the philosophy: *"Don't try to diagnose the animal. Help the user understand what information they have, what type of care they may need, and where to find it."*
2. **Dual PDF & Multimodal Image Pipeline**:
   - **PDFs**: Parsed via `pdf-parse` to extract text, followed by Gemini structured JSON generation.
   - **Images**: Passed directly to Gemini multimodal vision. When Gemini API key is absent, the app transparently prompts the user rather than inventing fake data.
3. **Seeded Provider Directory Reliability**: Rather than depending on flaky third-party place APIs during live interview demos, we populated realistic Gurgaon animal clinics, NGOs, ambulances, and rescuers tagged with `isDemoData: true`.
4. **Deterministic Fallback Engine**: Designed a standalone rule-based AI engine (`fallbackAi.ts`) ensuring 100% application uptime and test coverage even when offline or without an active Gemini API key.

---

## 3. AI Suggestions Rejected or Modified

- **Rejected**: AI-generated disease diagnostic questionnaires and treatment recommendations.
- **Rejected**: Generic SaaS dashboard layout with excessive metrics and glassmorphism gradients.
- **Modified**: Simplified complex medical entity schemas into pet-parent friendly timeline events.
