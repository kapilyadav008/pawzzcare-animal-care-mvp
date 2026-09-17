import { Schema, model, Document, Types } from 'mongoose';

export interface IMedicalRecord extends Document {
  petId: Types.ObjectId | string;
  fileName: string;
  documentType: string;
  documentDate: string;
  extractedData: {
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
  };
  isDemoData?: boolean;
  createdAt: Date;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  petId: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  fileName: { type: String, required: true },
  documentType: { type: String, required: true, default: 'General Medical Document' },
  documentDate: { type: String, default: null },
  extractedData: { type: Schema.Types.Mixed, required: true },
  isDemoData: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const MedicalRecord = model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
