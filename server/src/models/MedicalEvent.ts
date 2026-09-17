import { Schema, model, Document, Types } from 'mongoose';

export interface IMedicalEvent extends Document {
  petId: Types.ObjectId | string;
  date: string;
  type: 'Vaccination' | 'Lab Result' | 'Consultation' | 'Medication' | 'Surge' | 'General';
  title: string;
  description: string;
  sourceRecordId?: Types.ObjectId | string;
  isDemoData?: boolean;
  createdAt: Date;
}

const MedicalEventSchema = new Schema<IMedicalEvent>({
  petId: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  date: { type: String, required: true },
  type: {
    type: String,
    enum: ['Vaccination', 'Lab Result', 'Consultation', 'Medication', 'Surge', 'General'],
    default: 'General'
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  sourceRecordId: { type: Schema.Types.ObjectId, ref: 'MedicalRecord' },
  isDemoData: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const MedicalEvent = model<IMedicalEvent>('MedicalEvent', MedicalEventSchema);
