import { Schema, model, Document } from 'mongoose';

export interface IProvider extends Document {
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
  createdAt: Date;
}

const ProviderSchema = new Schema<IProvider>({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['Clinic', 'Vet', 'Ambulance', 'NGO', 'Rescue'],
    required: true
  },
  location: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  phone: { type: String, required: true },
  services: [{ type: String }],
  openNow: { type: Boolean, default: true },
  isDemoData: { type: Boolean, default: true },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Provider = model<IProvider>('Provider', ProviderSchema);
