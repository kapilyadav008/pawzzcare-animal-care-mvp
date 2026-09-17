import {
  Pet,
  MedicalEvent,
  Provider,
  AssistantAnalysis,
  DocumentAnalysisResponse,
  VetSummaryData
} from '../types';

const API_BASE = '/api';

export async function fetchHealthStatus() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function analyzeCareQuery(query: string): Promise<AssistantAnalysis> {
  const res = await fetch(`${API_BASE}/assistant/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to analyze query');
  return data.data;
}

export async function fetchProviders(type?: string, search?: string): Promise<{ data: Provider[]; notice?: string }> {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/providers?${params.toString()}`);
  const data = await res.json();
  return { data: data.data || [], notice: data.notice };
}

export async function fetchNearbyProviders(lat?: number, lng?: number): Promise<{ data: Provider[]; notice?: string }> {
  const params = new URLSearchParams();
  if (lat) params.append('lat', lat.toString());
  if (lng) params.append('lng', lng.toString());

  const res = await fetch(`${API_BASE}/providers/nearby?${params.toString()}`);
  const data = await res.json();
  return { data: data.data || [], notice: data.notice };
}

export async function fetchPets(): Promise<Pet[]> {
  const res = await fetch(`${API_BASE}/pets`);
  const data = await res.json();
  return data.data || [];
}

export async function fetchPetDetails(petId: string): Promise<Pet> {
  const res = await fetch(`${API_BASE}/pets/${petId}`);
  const data = await res.json();
  return data.data;
}

export async function fetchPetTimeline(petId: string): Promise<MedicalEvent[]> {
  const res = await fetch(`${API_BASE}/pets/${petId}/timeline`);
  const data = await res.json();
  return data.data || [];
}

export async function uploadAndAnalyzeDocument(file: File, petId?: string): Promise<DocumentAnalysisResponse> {
  const formData = new FormData();
  formData.append('document', file);
  if (petId) formData.append('petId', petId);

  const res = await fetch(`${API_BASE}/medical-records/analyze`, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Document analysis failed');
  return data.data;
}

export async function fetchVetSummary(petId: string): Promise<VetSummaryData> {
  const res = await fetch(`${API_BASE}/pets/${petId}/vet-summary`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to generate vet summary');
  return data.data;
}
