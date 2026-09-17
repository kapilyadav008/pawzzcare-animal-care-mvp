import { Router } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { analyzeMedicalDocument } from '../services/aiService.js';
import { MedicalRecord } from '../models/MedicalRecord.js';
import { MedicalEvent } from '../models/MedicalEvent.js';
import { Pet } from '../models/Pet.js';

const router = Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/analyze', upload.single('document'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document file uploaded. Supported formats: PDF, JPG, PNG.'
      });
    }

    const { buffer, mimetype, originalname } = req.file;
    const petId = req.body.petId;

    const analysisResult = await analyzeMedicalDocument(buffer, mimetype, originalname);

    let savedRecord = null;
    let savedEvent = null;

    // If MongoDB is connected and we have a valid petId (or a default pet in DB), auto-save record & event
    if (mongoose.connection.readyState === 1 && petId) {
      try {
        const petExists = await Pet.findById(petId);
        if (petExists) {
          const recordDoc = new MedicalRecord({
            petId,
            fileName: originalname,
            documentType: analysisResult.extractedData.documentType || 'Medical Report',
            documentDate: analysisResult.extractedData.documentDate || null,
            extractedData: analysisResult.extractedData
          });
          savedRecord = await recordDoc.save();

          // Create event in pet timeline
          const eventDoc = new MedicalEvent({
            petId,
            date: recordDoc.documentDate || new Date().toISOString().split('T')[0],
            type: recordDoc.documentType.includes('Vaccin') ? 'Vaccination' :
                  recordDoc.documentType.includes('Blood') || recordDoc.documentType.includes('Test') ? 'Lab Result' : 'Consultation',
            title: `${recordDoc.documentType} Uploaded`,
            description: `Document "${originalname}" organized by AI Health Vault.`,
            sourceRecordId: savedRecord._id
          });
          savedEvent = await eventDoc.save();
        }
      } catch (dbErr: any) {
        console.warn('[DB Auto-Save Warning]:', dbErr.message);
      }
    }

    res.json({
      success: true,
      data: {
        fileName: originalname,
        mimeType: mimetype,
        extractedData: analysisResult.extractedData,
        imageRequiresAi: analysisResult.imageRequiresAi || false,
        warning: analysisResult.error || null,
        savedRecordId: savedRecord ? savedRecord._id : null,
        savedEventId: savedEvent ? savedEvent._id : null
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { petId, fileName, documentType, documentDate, extractedData } = req.body;
    if (!petId || !fileName || !extractedData) {
      return res.status(400).json({
        success: false,
        message: 'petId, fileName, and extractedData are required'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable'
      });
    }

    const record = new MedicalRecord({
      petId,
      fileName,
      documentType: documentType || 'Medical Report',
      documentDate: documentDate || null,
      extractedData
    });
    const saved = await record.save();

    res.status(201).json({
      success: true,
      data: saved
    });
  } catch (error) {
    next(error);
  }
});

export default router;
