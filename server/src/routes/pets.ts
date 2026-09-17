import { Router } from 'express';
import mongoose from 'mongoose';
import { Pet } from '../models/Pet.js';
import { MedicalEvent } from '../models/MedicalEvent.js';
import { MedicalRecord } from '../models/MedicalRecord.js';
import { generateVetSummary } from '../services/aiService.js';

const router = Router();

// Fallback demo pet if DB has no pets yet or DB is offline
const DEMO_PET = {
  _id: '66e9a1234567890123456789',
  name: 'Bruno',
  species: 'Dog',
  breed: 'Beagle',
  age: 4,
  sex: 'Male',
  photo: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80',
  isDemoData: true,
  createdAt: new Date().toISOString()
};

const DEMO_TIMELINE = [
  {
    _id: 'evt-001',
    petId: '66e9a1234567890123456789',
    date: '2026-03-03',
    type: 'Consultation',
    title: 'Veterinary Consultation',
    description: 'Routine wellness check and physical examination.',
    isDemoData: true
  },
  {
    _id: 'evt-002',
    petId: '66e9a1234567890123456789',
    date: '2026-02-18',
    type: 'Lab Result',
    title: 'Blood Test Uploaded',
    description: 'Complete Blood Count report organized in vault. Hemoglobin 12.4 g/dL.',
    isDemoData: true
  },
  {
    _id: 'evt-003',
    petId: '66e9a1234567890123456789',
    date: '2026-01-12',
    type: 'Vaccination',
    title: 'Rabies Booster Vaccination',
    description: 'Annual anti-rabies vaccination administered by Dr. Sharma.',
    isDemoData: true
  }
];

router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const pets = await Pet.find().sort({ createdAt: -1 });
      if (pets.length > 0) {
        return res.json({ success: true, data: pets });
      }
    }
    res.json({ success: true, data: [DEMO_PET] });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, species, breed, age, sex, photo } = req.body;
    if (!name || !species) {
      return res.status(400).json({
        success: false,
        message: 'Name and species are required'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable'
      });
    }

    const pet = new Pet({
      name,
      species,
      breed: breed || 'Mixed / Unknown',
      age: Number(age) || 0,
      sex: sex || 'Unknown',
      photo
    });
    const saved = await pet.save();

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const pet = await Pet.findById(id);
      if (pet) {
        return res.json({ success: true, data: pet });
      }
    }
    // Return demo pet if matches or fallback
    res.json({ success: true, data: DEMO_PET });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/timeline', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const events = await MedicalEvent.find({ petId: id }).sort({ date: -1 });
      if (events.length > 0) {
        return res.json({ success: true, data: events });
      }
    }
    res.json({ success: true, data: DEMO_TIMELINE });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/vet-summary', async (req, res, next) => {
  try {
    const { id } = req.params;
    let petData: any = DEMO_PET;
    let eventsData: any[] = DEMO_TIMELINE;
    let recordsData: any[] = [];

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const pet = await Pet.findById(id);
      if (pet) petData = pet;

      eventsData = await MedicalEvent.find({ petId: id }).sort({ date: -1 });
      recordsData = await MedicalRecord.find({ petId: id }).sort({ documentDate: -1 });
    }

    const summary = await generateVetSummary(petData, eventsData, recordsData);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
});

export default router;
