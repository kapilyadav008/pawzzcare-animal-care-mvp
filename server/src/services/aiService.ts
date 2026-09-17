import { GoogleGenAI } from '@google/genai';
import { config } from '../config.js';
import { extractTextFromPdf } from './pdfExtractor.js';
import {
  analyzeCareRequestFallback,
  analyzeMedicalDocumentTextFallback,
  generateVetSummaryFallback,
  AssistantAnalysisResult,
  ExtractedDocumentData
} from './fallbackAi.js';

let aiClient: GoogleGenAI | null = null;
if (config.geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
  } catch (err) {
    console.warn('[AI Service Warning] Failed to initialize Gemini client:', err);
  }
}

const SAFETY_SYSTEM_PROMPT = `You are PawzzCare, an animal-care information assistant.
STRICT RULES:
1. You DO NOT diagnose diseases or health conditions under any circumstances.
2. You DO NOT prescribe medications or recommend dosages.
3. You DO NOT infer diseases or medical conclusions from lab values.
4. You DO NOT invent missing information. If a field is not explicitly stated in the document or query, set it to null or "Not found in document".
5. Distinguish clearly between facts explicitly stated in text and high-level safety guidance.
6. Always recommend consulting a licensed veterinarian for professional diagnosis and medical decisions.
7. Always respond in valid JSON format.`;

export async function analyzeCareRequest(userQuery: string): Promise<AssistantAnalysisResult> {
  if (!aiClient || !config.geminiApiKey) {
    console.log('[AI Service] Gemini API key not present. Using Fallback AI for care request.');
    return analyzeCareRequestFallback(userQuery);
  }

  try {
    const prompt = `${SAFETY_SYSTEM_PROMPT}

Analyze the user's natural language animal-care query:
"${userQuery}"

Return JSON matching this exact structure:
{
  "animalType": "dog|cat|bird|cow|animal",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string description",
  "urgency": "low|moderate|high|emergency",
  "recommendedServiceType": "veterinary clinic|emergency animal assistance|animal rescue / NGO|boarding",
  "reasoning": "Brief, safe explanation of why this service type is suggested",
  "clarifyingQuestions": ["Question 1", "Question 2"],
  "disclaimer": "PawzzCare does not diagnose medical conditions. This guidance is intended to help you find appropriate care."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    if (!text) throw new Error('Empty response from Gemini model');

    const parsed = JSON.parse(text);
    return {
      ...parsed,
      isDemoFallback: false
    };
  } catch (error: any) {
    console.warn('[AI Service Error] Gemini query failed, falling back to fallback engine:', error.message);
    return analyzeCareRequestFallback(userQuery);
  }
}

export async function analyzeMedicalDocument(
  fileBuffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<{ extractedData: ExtractedDocumentData; imageRequiresAi?: boolean; error?: string }> {
  const isPdf = mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  const isImage = mimeType.startsWith('image/') || /\.(png|jpe?g)$/i.test(fileName);

  // PDF PIPELINE
  if (isPdf) {
    let extractedText = '';
    try {
      extractedText = await extractTextFromPdf(fileBuffer);
    } catch (err: any) {
      console.warn('[PDF Extract Warning] pdf-parse failed:', err.message);
    }

    if (!extractedText || extractedText.length < 10) {
      console.log('[PDF Extract] Text empty or unparseable. Falling back to fallback extractor.');
      return {
        extractedData: analyzeMedicalDocumentTextFallback(extractedText || fileName, fileName)
      };
    }

    if (!aiClient || !config.geminiApiKey) {
      console.log('[AI Service] Gemini key absent. Parsing PDF text with Fallback AI.');
      return {
        extractedData: analyzeMedicalDocumentTextFallback(extractedText, fileName)
      };
    }

    try {
      const prompt = `${SAFETY_SYSTEM_PROMPT}

Extract facts from the following medical report text:
"""
${extractedText}
"""

Return JSON with exact keys:
{
  "petName": string or null,
  "species": string or null,
  "breed": string or null,
  "documentType": string (e.g. "Blood Test Report", "Vaccination Certificate", "Consultation Note"),
  "documentDate": "YYYY-MM-DD" or null,
  "veterinarian": string or null,
  "clinicName": string or null,
  "medications": [{"name": string, "dosage": string or null}] or null,
  "vaccinations": [{"name": string, "date": string or null}] or null,
  "observations": [string] or null,
  "testValues": [{"testName": string, "value": string, "unit": string or null}] or null,
  "followUp": string or null
}
Set missing fields strictly to null. Do NOT invent missing values.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      if (!text) throw new Error('Empty Gemini response');

      const parsed = JSON.parse(text);
      return {
        extractedData: {
          ...parsed,
          isDemoFallback: false
        }
      };
    } catch (err: any) {
      console.warn('[Gemini PDF Error]:', err.message);
      return {
        extractedData: analyzeMedicalDocumentTextFallback(extractedText, fileName)
      };
    }
  }

  // IMAGE PIPELINE (JPG / PNG)
  if (isImage) {
    if (!aiClient || !config.geminiApiKey) {
      // Per architecture rule: Do NOT fabricate extracted medical info for images if Gemini is unavailable!
      return {
        imageRequiresAi: true,
        extractedData: {
          petName: null,
          species: null,
          breed: null,
          documentType: 'Image Document (Analysis Pending)',
          documentDate: new Date().toISOString().split('T')[0],
          veterinarian: null,
          clinicName: null,
          medications: null,
          vaccinations: null,
          observations: ['Image uploaded. Gemini AI vision service is required to analyze image files.'],
          testValues: null,
          followUp: null,
          isDemoFallback: true
        },
        error: 'Image analysis requires active Gemini AI connection. Please upload a PDF report or configure GEMINI_API_KEY.'
      };
    }

    try {
      const base64Data = fileBuffer.toString('base64');
      const prompt = `${SAFETY_SYSTEM_PROMPT}
Analyze this veterinary document image and extract factual data into structured JSON:
{
  "petName": string or null,
  "species": string or null,
  "breed": string or null,
  "documentType": string,
  "documentDate": "YYYY-MM-DD" or null,
  "veterinarian": string or null,
  "clinicName": string or null,
  "medications": [{"name": string, "dosage": string or null}] or null,
  "vaccinations": [{"name": string, "date": string or null}] or null,
  "observations": [string] or null,
  "testValues": [{"testName": string, "value": string, "unit": string or null}] or null,
  "followUp": string or null
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType || 'image/jpeg'
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      if (!text) throw new Error('Empty image analysis response from Gemini');

      const parsed = JSON.parse(text);
      return {
        extractedData: {
          ...parsed,
          isDemoFallback: false
        }
      };
    } catch (err: any) {
      console.warn('[Gemini Image Analysis Error]:', err.message);
      return {
        imageRequiresAi: true,
        extractedData: {
          petName: null,
          species: null,
          breed: null,
          documentType: 'Image Document',
          documentDate: new Date().toISOString().split('T')[0],
          veterinarian: null,
          clinicName: null,
          medications: null,
          vaccinations: null,
          observations: ['Failed to analyze image with Gemini AI.'],
          testValues: null,
          followUp: null,
          isDemoFallback: true
        },
        error: `Image analysis failed: ${err.message}`
      };
    }
  }

  // Unsupported format
  throw new Error('Unsupported file format. Please upload PDF, JPG, or PNG files.');
}

export async function generateVetSummary(pet: any, events: any[], records: any[]) {
  if (!aiClient || !config.geminiApiKey) {
    return generateVetSummaryFallback(pet, events, records);
  }

  try {
    const prompt = `${SAFETY_SYSTEM_PROMPT}

Generate a concise, organized vet visit summary for:
Pet: ${JSON.stringify(pet)}
Events: ${JSON.stringify(events.slice(0, 8))}
Records: ${JSON.stringify(records.slice(0, 5))}

Return JSON:
{
  "petName": "${pet.name}",
  "species": "${pet.species}",
  "breed": "${pet.breed || ''}",
  "age": ${pet.age},
  "recentEvents": ["event 1", "event 2"],
  "currentMedications": "string or none",
  "knownHistory": "concise medical summary",
  "questionsToAskVet": ["question 1", "question 2"],
  "disclaimer": "This summary is aggregated automatically from your pet's PawzzCare timeline for easy reference during veterinary consultations."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    if (!text) throw new Error('Empty Gemini response');

    return JSON.parse(text);
  } catch (err: any) {
    console.warn('[Gemini Vet Summary Error]:', err.message);
    return generateVetSummaryFallback(pet, events, records);
  }
}
