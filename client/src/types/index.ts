export interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  sex: 'Male' | 'Female' | 'Unknown';
  photo?: string;
  isDemoData?: boolean;
}

export interface MedicalEvent {
  _id: string;
  petId: string;
  date: string;
  type: 'Vaccination' | 'Lab Result' | 'Consultation' | 'Medication' | 'Surge' | 'General';
  title: string;
  description: string;
  sourceRecordId?: string;
  isDemoData?: boolean;
}

export interface Provider {
  _id: string;
  name: string;
  type: 'Clinic' | 'Vet' | 'Ambulance' | 'NGO' | 'Rescue';
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  phone: string;
  services: string[];
  openNow: boolean;
  isDemoData: boolean;
  address?: string;
  distanceKm?: number;
}

export interface AssistantAnalysis {
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

export interface ExtractedData {
  petName: string | null;
  species: string | null;
  breed: string | null;
  documentType: string | null;
  documentDate: string | null;
  veterinarian: string | null;
  clinicName: string | null;
  medications: Array<{ name: string; dosage?: string; frequency?: string }> | null;
  vaccinations: Array<{ name: string; date?: string; dueDate?: string }> | null;
  observations: string[] | null;
  testValues: Array<{ testName: string; value: string; unit?: string; referenceRange?: string }> | null;
  followUp: string | null;
  isDemoFallback?: boolean;
}

export interface DocumentAnalysisResponse {
  fileName: string;
  mimeType: string;
  extractedData: ExtractedData;
  imageRequiresAi?: boolean;
  warning?: string | null;
  savedRecordId?: string | null;
  savedEventId?: string | null;
}

export interface VetSummaryData {
  petName: string;
  species: string;
  breed: string;
  age: number;
  recentEvents: string[];
  currentMedications: string;
  knownHistory: string;
  questionsToAskVet: string[];
  disclaimer: string;
}
