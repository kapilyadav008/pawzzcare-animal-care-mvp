export interface AssistantAnalysisResult {
  animalType: string;
  symptoms: string[];
  duration: string;
  urgency: 'low' | 'moderate' | 'high' | 'emergency';
  recommendedServiceType: string;
  reasoning: string;
  clarifyingQuestions: string[];
  disclaimer: string;
  isDemoFallback: boolean;
}

export interface ExtractedDocumentData {
  petName: string | null;
  species: string | null;
  breed: string | null;
  age?: string | null;
  sex?: string | null;
  documentType: string | null;
  documentDate: string | null;
  veterinarian: string | null;
  clinicName: string | null;
  medications: Array<{ name: string; dosage?: string; frequency?: string }> | null;
  vaccinations: Array<{ name: string; date?: string; dueDate?: string }> | null;
  observations: string[] | null;
  testValues: Array<{ testName: string; value: string; unit?: string; referenceRange?: string }> | null;
  followUp: string | null;
  isDemoFallback: boolean;
}

export function parseAndNormalizeDate(text: string): string | null {
  const monthNames: Record<string, string> = {
    jan: '01', january: '01',
    feb: '02', february: '02',
    mar: '03', march: '03',
    apr: '04', april: '04',
    may: '05',
    jun: '06', june: '06',
    jul: '07', july: '07',
    aug: '08', august: '08',
    sep: '09', september: '09',
    oct: '10', october: '10',
    nov: '11', november: '11',
    dec: '12', december: '12'
  };

  // Match 1: YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const isoMatch = text.match(/\b(\d{4})[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Match 2: DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = text.match(/\b(0?[1-9]|[12]\d|3[01])[-/.](0?[1-9]|1[0-2])[-/.](\d{4})\b/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${y}-${m}-${d}`;
  }

  // Match 3: 18 February 2026 or 18 Feb 2026
  const textMatch1 = text.match(/\b(0?[1-9]|[12]\d|3[01])\s+([A-Za-z]+),?\s+(\d{4})\b/);
  if (textMatch1) {
    const d = textMatch1[1].padStart(2, '0');
    const mKey = textMatch1[2].toLowerCase();
    const y = textMatch1[3];
    if (monthNames[mKey]) {
      return `${y}-${monthNames[mKey]}-${d}`;
    }
  }

  // Match 4: February 18, 2026 or Feb 18 2026
  const textMatch2 = text.match(/\b([A-Za-z]+)\s+(0?[1-9]|[12]\d|3[01]),?\s+(\d{4})\b/);
  if (textMatch2) {
    const mKey = textMatch2[1].toLowerCase();
    const d = textMatch2[2].padStart(2, '0');
    const y = textMatch2[3];
    if (monthNames[mKey]) {
      return `${y}-${monthNames[mKey]}-${d}`;
    }
  }

  return null;
}

export function analyzeCareRequestFallback(userQuery: string): AssistantAnalysisResult {
  const queryLower = userQuery.toLowerCase();

  let animalType = 'animal';
  if (/\bdogs?\b|\bpuppy\b|\bpuppies\b/.test(queryLower)) animalType = 'dog';
  else if (/\bcats?\b|\bkitten\b|\bkittens\b/.test(queryLower)) animalType = 'cat';
  else if (/\bbirds?\b|\bparrot\b/.test(queryLower)) animalType = 'bird';
  else if (/\bcows?\b|\bcalf\b/.test(queryLower)) animalType = 'cow';

  const symptoms: string[] = [];
  if (/vomit|vomiting|puking/.test(queryLower)) symptoms.push('vomiting');
  if (/diarrhea|loose stool|poop/.test(queryLower)) symptoms.push('diarrhea');
  if (/letharg|sluggish|tired|weak/.test(queryLower)) symptoms.push('lethargy');
  if (/fever|warm|hot/.test(queryLower)) symptoms.push('fever');
  if (/limp|injured|paw|leg|wound|cut|bleeding/.test(queryLower)) symptoms.push('physical injury');
  if (/cough|sneez|breathing|gasp/.test(queryLower)) symptoms.push('respiratory symptoms');
  if (/vaccin|rabies|shot|booster/.test(queryLower)) symptoms.push('vaccination request');

  if (symptoms.length === 0) {
    symptoms.push('general health query');
  }

  let duration = 'recently reported';
  if (/this morning|since morning/.test(queryLower)) duration = 'since this morning';
  else if (/yesterday|since yesterday/.test(queryLower)) duration = 'since yesterday';
  else if (/few days|couple of days|2 days|3 days/.test(queryLower)) duration = 'for a few days';

  let urgency: 'low' | 'moderate' | 'high' | 'emergency' = 'moderate';
  let recommendedServiceType = 'veterinary clinic';
  let reasoning = 'A physical examination by a licensed veterinarian is recommended to assess symptoms and provide safe care guidance.';
  const clarifyingQuestions: string[] = [];

  if (/accident|hit|run over|ambulance|heavy bleeding|unconscious|collapse|seizure|poison/.test(queryLower)) {
    urgency = 'emergency';
    recommendedServiceType = 'emergency animal assistance / ambulance';
    reasoning = 'Severe, acute trauma or critical distress requires urgent veterinary or emergency rescue intervention immediately.';
    clarifyingQuestions.push('Is the animal conscious and responding to voice or touch?');
    clarifyingQuestions.push('Is there visible severe bleeding or difficulty breathing?');
  } else if (/vomit|diarrhea|fever|cough|limp|wound|injured/.test(queryLower)) {
    urgency = 'high';
    recommendedServiceType = 'veterinary clinic';
    reasoning = 'Persistent gastrointestinal or physical symptoms can lead to dehydration or worsening distress if not evaluated promptly.';
    clarifyingQuestions.push('Has your pet been able to keep water down in the last 4 hours?');
    clarifyingQuestions.push('Are there any other warning signs such as extreme lethargy or pale gums?');
  } else if (/vaccin|rabies|booster|routine|checkup|grooming/.test(queryLower)) {
    urgency = 'low';
    recommendedServiceType = 'veterinary clinic';
    reasoning = 'Preventative care and routine vaccinations help maintain long-term immunity and pet health.';
    clarifyingQuestions.push('Does your pet have any previous vaccination records available?');
  } else if (/stray|abandoned|rescue|ngo|found/.test(queryLower)) {
    urgency = 'moderate';
    recommendedServiceType = 'animal rescue / NGO';
    reasoning = 'Local animal welfare organizations and rescuers can assist with shelter, triage, and community animal care.';
    clarifyingQuestions.push('Is the animal friendly, frightened, or displaying signs of pain?');
  }

  return {
    animalType,
    symptoms,
    duration,
    urgency,
    recommendedServiceType,
    reasoning,
    clarifyingQuestions,
    disclaimer: 'PawzzCare does not diagnose medical conditions. This guidance is intended to help you find appropriate animal-care services.',
    isDemoFallback: true
  };
}

export function analyzeMedicalDocumentTextFallback(rawText: string, fileName: string): ExtractedDocumentData {

  // 1. Extract Pet Name
  let petName: string | null = null;
  const nameMatch = rawText.match(/(?:Pet\s*Name|Patient\s*Name|Pet|Patient|Name):\s*([A-Za-z]+)/i);
  if (nameMatch && nameMatch[1].trim().length > 1) {
    petName = nameMatch[1].trim();
  }

  // 2. Extract Species
  let species: string | null = null;
  const speciesMatch = rawText.match(/(?:Species|Animal):\s*([A-Za-z]+)/i);
  if (speciesMatch) {
    species = speciesMatch[1].trim();
  } else if (/\bdogs?\b|\bcanine\b/i.test(rawText)) {
    species = 'Dog';
  } else if (/\bcats?\b|\bfeline\b/i.test(rawText)) {
    species = 'Cat';
  }

  // 3. Extract Breed
  let breed: string | null = null;
  const breedMatch = rawText.match(/Breed:\s*([A-Za-z\s]+)/i);
  if (breedMatch) {
    breed = breedMatch[1].trim().split('\n')[0];
  }

  // 4. Extract Age
  let age: string | null = null;
  const ageMatch = rawText.match(/Age:\s*([0-9A-Za-z\s]+)/i);
  if (ageMatch) {
    age = ageMatch[1].trim().split('\n')[0];
  }

  // 5. Extract Sex
  let sex: string | null = null;
  const sexMatch = rawText.match(/(?:Sex|Gender):\s*([A-Za-z]+)/i);
  if (sexMatch) {
    sex = sexMatch[1].trim();
  }

  // 6. Document Type
  let documentType: string | null = 'Medical Document';
  if (/blood|cbc|hemogram|haematology|biochemistry/i.test(rawText)) documentType = 'Blood Test Report';
  else if (/vaccin|rabies|dhpp|deworm/i.test(rawText)) documentType = 'Vaccination Certificate';
  else if (/prescription|consultation|doctor note/i.test(rawText)) documentType = 'Veterinary Consultation';
  else if (/x-ray|radiology|ultrasound/i.test(rawText)) documentType = 'Imaging Report';

  // 7. Extract Document Date (Strict Source-of-Truth, no fallback to today's date!)
  const documentDate = parseAndNormalizeDate(rawText);

  // 8. Extract Clinic Name
  let clinicName: string | null = null;
  const clinicMatch = rawText.match(/(?:Clinic|Hospital|Facility|Center|Centre):\s*([^\n\r,]+)/i);
  if (clinicMatch) {
    const extracted = clinicMatch[1].trim();
    if (extracted.length > 2 && !/^(undefined|null|unknown|\.)$/i.test(extracted)) {
      clinicName = extracted;
    }
  }

  // 9. Extract Veterinarian
  let veterinarian: string | null = null;
  const vetMatch = rawText.match(/(?:Veterinarian|Doctor|Dr\.)\s*:?\s*([A-Za-z\s.]+)/i);
  if (vetMatch) {
    let extracted = vetMatch[1].trim().split('\n')[0].trim();
    extracted = extracted.replace(/^(Clinic|Hospital|Patient|Date|Report|Species|Breed).*/i, '').trim();
    if (extracted.length >= 3 && /[A-Za-z]{2,}/.test(extracted) && extracted !== '.') {
      veterinarian = extracted.startsWith('Dr.') ? extracted : `Dr. ${extracted}`;
    }
  }

  // 10. Extract Test Values & Observations (Fact Extraction Only)
  const testValues: Array<{ testName: string; value: string; unit?: string; referenceRange?: string }> = [];
  const observations: string[] = [];
  const medications: Array<{ name: string; dosage?: string; frequency?: string }> = [];
  const vaccinations: Array<{ name: string; date?: string; dueDate?: string }> = [];

  const lines = rawText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || /^(Date|Report Date|Document|Patient|Pet|Name|Species|Breed|Age|Sex|Gender|Clinic|Doctor|Dr\.|Veterinarian|Phone|Address|Page)/i.test(trimmed)) {
      continue;
    }

    const labMatch = trimmed.match(/^([A-Za-z\s()]+):\s*([\d.]+)\s*([A-Za-z/%^0-9]*)/);
    if (labMatch && labMatch[1].trim().length > 2 && labMatch[1].trim().length < 30) {
      testValues.push({
        testName: labMatch[1].trim(),
        value: labMatch[2],
        unit: labMatch[3] || undefined
      });
    }

    if (/rabies|dhpp|distemper|parvo/i.test(line)) {
      vaccinations.push({
        name: line.trim(),
        date: documentDate || undefined
      });
    }

    if (/tab|syrup|mg|ml|twice daily|once daily/i.test(line)) {
      medications.push({
        name: line.trim()
      });
    }

    if (/normal|mild|advised|recommended|observe/i.test(line) && line.length < 100) {
      observations.push(line.trim());
    }
  }

  return {
    petName,
    species,
    breed,
    age,
    sex,
    documentType,
    documentDate,
    veterinarian,
    clinicName,
    medications: medications.length > 0 ? medications : null,
    vaccinations: vaccinations.length > 0 ? vaccinations : null,
    observations: observations.length > 0 ? observations : null,
    testValues: testValues.length > 0 ? testValues : null,
    followUp: null,
    isDemoFallback: true
  };
}

export function generateVetSummaryFallback(pet: any, events: any[], records: any[]) {
  const recentEvents = events.slice(0, 5).map(e => `- ${e.type}: ${e.title} (${e.date})`);
  
  const questions = [
    `Are there any recommended preventative vaccinations due for ${pet.name || 'this pet'}?`,
    `Should we adjust diet or physical routine based on ${pet.name || 'this pet'}'s age (${pet.age || 4} years)?`,
    `Are any follow-up blood tests or checkups necessary in the coming months?`
  ];

  return {
    petName: pet.name || 'Bruno',
    species: pet.species || 'Dog',
    breed: pet.breed || 'Beagle',
    age: pet.age || 4,
    recentEvents: recentEvents.length > 0 ? recentEvents : ['No recent events logged.'],
    currentMedications: 'None currently prescribed in active record history.',
    knownHistory: `${records.length} document(s) organized in health vault.`,
    questionsToAskVet: questions,
    disclaimer: 'This summary is automatically aggregated from your pet\'s PawzzCare timeline. Present this report to your licensed veterinarian for professional review.'
  };
}
