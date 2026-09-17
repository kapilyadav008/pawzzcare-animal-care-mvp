import { Schema, model, Document } from 'mongoose';

export interface IPet extends Document {
  name: string;
  species: string;
  breed: string;
  age: number;
  sex: 'Male' | 'Female' | 'Unknown';
  photo?: string;
  isDemoData?: boolean;
  createdAt: Date;
}

const PetSchema = new Schema<IPet>({
  name: { type: String, required: true, trim: true },
  species: { type: String, required: true, trim: true },
  breed: { type: String, default: 'Mixed / Unknown' },
  age: { type: Number, required: true, min: 0 },
  sex: { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
  photo: { type: String },
  isDemoData: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Pet = model<IPet>('Pet', PetSchema);
