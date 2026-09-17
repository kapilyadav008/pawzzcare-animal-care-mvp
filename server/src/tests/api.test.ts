import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { analyzeCareRequestFallback, analyzeMedicalDocumentTextFallback } from '../services/fallbackAi.js';

describe('PawzzCare Backend API & AI Engine Tests', () => {

  // Test 1: Natural-language care request processing
  it('POST /api/assistant/analyze - should process natural language care request', async () => {
    const res = await request(app)
      .post('/api/assistant/analyze')
      .send({ query: 'My dog has been vomiting since this morning' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('animalType');
    expect(res.body.data).toHaveProperty('urgency');
    expect(res.body.data).toHaveProperty('recommendedServiceType');
    expect(res.body.data.disclaimer).toContain('does not diagnose');
  });

  // Test 2: Veterinary service detection
  it('POST /api/assistant/analyze - should detect veterinary clinic service for vomiting symptoms', async () => {
    const res = await request(app)
      .post('/api/assistant/analyze')
      .send({ query: 'My cat injured its paw and needs a vet' });

    expect(res.status).toBe(200);
    expect(res.body.data.animalType.toLowerCase()).toBe('cat');
    expect(res.body.data.recommendedServiceType).toMatch(/veterinary|clinic/i);
  });

  // Test 3: Fallback AI handling when Gemini key is missing
  it('Fallback AI Engine - should produce valid deterministic analysis without Gemini API key', () => {
    const fallbackResult = analyzeCareRequestFallback('I need an animal ambulance for a hit dog');
    expect(fallbackResult.isDemoFallback).toBe(true);
    expect(fallbackResult.urgency).toBe('emergency');
    expect(fallbackResult.recommendedServiceType).toMatch(/ambulance|emergency/i);
  });

  // Test 4: Invalid input validation (Zod)
  it('POST /api/assistant/analyze - should return 400 Bad Request for invalid/empty input', async () => {
    const res = await request(app)
      .post('/api/assistant/analyze')
      .send({ query: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation Error');
  });

  // Test 5: Provider search & location distance filtering
  it('GET /api/providers - should return Gurgaon providers with distance filter', async () => {
    const res = await request(app)
      .get('/api/providers?type=Clinic');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('distanceKm');
    expect(res.body.notice).toContain('Demo Provider Directory');
  });

  // Test 6: Medical document text parsing & event extraction
  it('Medical Document Extractor - should parse text and extract structured facts', () => {
    const mockPdfText = `
      Pet: Bruno
      Species: Dog
      Breed: Beagle
      Date: 2026-02-18
      Clinic: Pawzz Veterinary Care
      Dr. R. K. Sharma
      Hemoglobin: 12.4 g/dL
      WBC Total Count: 14.2 10^3/uL
      Rabies Vaccination administered on 2026-01-12
    `;

    const extracted = analyzeMedicalDocumentTextFallback(mockPdfText, 'report.pdf');

    expect(extracted.petName).toBe('Bruno');
    expect(extracted.species).toBe('Dog');
    expect(extracted.documentDate).toBe('2026-02-18');
    expect(extracted.veterinarian).toBe('Dr. R. K. Sharma');
    expect(extracted.testValues).not.toBeNull();
    expect(extracted.testValues?.[0].testName).toBe('Hemoglobin');
    expect(extracted.testValues?.[0].value).toBe('12.4');
  });

  // Test 7: Missing medical document fields handling (must return null or not found, zero fabrication)
  it('Medical Document Extractor - missing fields must return null (zero fabrication)', () => {
    const sparseText = `
      General checkup note with no date, clinic name, test values, or medication list.
    `;

    const extracted = analyzeMedicalDocumentTextFallback(sparseText, 'sparse_doc.pdf');

    expect(extracted.petName).toBeNull(); // Must NOT invent a pet name!
    expect(extracted.documentDate).toBeNull(); // Must NOT default to today's date!
    expect(extracted.clinicName).toBeNull(); // Must NOT fabricate a clinic name!
    expect(extracted.veterinarian).toBeNull(); // Must NOT fabricate "Dr. ."!
    expect(extracted.medications).toBeNull();
    expect(extracted.testValues).toBeNull();
    expect(extracted.isDemoFallback).toBe(true);
  });

  // Test 8: Synthetic Document Regression Test
  it('Medical Document Extractor - synthetic document exact extraction & date normalization', () => {
    const syntheticText = `
      Pet Name: Bruno
      Species: Dog
      Breed: Beagle
      Age: 4 years
      Sex: Male
      Clinic: Demo Veterinary Care
      Report Date: 18 February 2026

      Hemoglobin: 12.4 g/dL
    `;

    const extracted = analyzeMedicalDocumentTextFallback(syntheticText, 'synthetic_report.pdf');

    expect(extracted.petName).toBe('Bruno');
    expect(extracted.species).toBe('Dog');
    expect(extracted.breed).toBe('Beagle');
    expect(extracted.documentDate).toBe('2026-02-18'); // Normalized from 18 February 2026
    expect(extracted.clinicName).toBe('Demo Veterinary Care');
    expect(extracted.veterinarian).toBeNull(); // Not present in text -> MUST be null!
  });

});
