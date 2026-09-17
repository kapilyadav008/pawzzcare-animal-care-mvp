import { connectDB } from './db.js';
import { Pet } from './models/Pet.js';
import { MedicalRecord } from './models/MedicalRecord.js';
import { MedicalEvent } from './models/MedicalEvent.js';
import { Provider } from './models/Provider.js';
import { SEEDED_PROVIDERS } from './routes/providers.js';

async function seedDatabase() {
  console.log('[Seed] Connecting to MongoDB...');
  const conn = await connectDB();
  if (!conn || conn.connection.readyState !== 1) {
    console.error('[Seed Error] Could not connect to MongoDB. Make sure MongoDB is running.');
    process.exit(1);
  }

  try {
    console.log('[Seed] Clearing existing demo collections...');
    await Pet.deleteMany({ isDemoData: true });
    await MedicalRecord.deleteMany({ isDemoData: true });
    await MedicalEvent.deleteMany({ isDemoData: true });
    await Provider.deleteMany({});

    console.log('[Seed] Seeding Gurgaon Providers...');
    await Provider.insertMany(SEEDED_PROVIDERS);

    console.log('[Seed] Seeding Demo Pet Bruno...');
    const bruno = await Pet.create({
      _id: '66e9a1234567890123456789',
      name: 'Bruno',
      species: 'Dog',
      breed: 'Beagle',
      age: 4,
      sex: 'Male',
      photo: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80',
      isDemoData: true
    });

    console.log('[Seed] Seeding Demo Medical Record...');
    const sampleRecord = await MedicalRecord.create({
      petId: bruno._id,
      fileName: 'bruno_blood_test_report.pdf',
      documentType: 'Blood Test Report',
      documentDate: '2026-02-18',
      isDemoData: true,
      extractedData: {
        petName: 'Bruno',
        species: 'Dog',
        breed: 'Beagle',
        documentType: 'Blood Test Report',
        documentDate: '2026-02-18',
        veterinarian: 'Dr. R. K. Sharma',
        clinicName: 'Pawzz Veterinary Care',
        medications: null,
        vaccinations: null,
        observations: ['Hemoglobin concentration within normal limits.', 'WBC count slightly elevated.'],
        testValues: [
          { testName: 'Hemoglobin', value: '12.4', unit: 'g/dL', referenceRange: '12.0 - 18.0' },
          { testName: 'WBC Total Count', value: '14.2', unit: '10^3/uL', referenceRange: '6.0 - 17.0' },
          { testName: 'Platelets', value: '280', unit: '10^3/uL', referenceRange: '200 - 500' }
        ],
        followUp: 'Routine follow-up in 6 months or if symptoms arise.'
      }
    });

    console.log('[Seed] Seeding Demo Medical Events...');
    await MedicalEvent.insertMany([
      {
        petId: bruno._id,
        date: '2026-03-03',
        type: 'Consultation',
        title: 'Veterinary Consultation',
        description: 'Routine physical wellness checkup at Pawzz Veterinary Clinic.',
        isDemoData: true
      },
      {
        petId: bruno._id,
        date: '2026-02-18',
        type: 'Lab Result',
        title: 'Blood Test Uploaded',
        description: 'Blood report parsed by AI vault. Hemoglobin 12.4 g/dL.',
        sourceRecordId: sampleRecord._id,
        isDemoData: true
      },
      {
        petId: bruno._id,
        date: '2026-01-12',
        type: 'Vaccination',
        title: 'Rabies Booster Vaccination',
        description: 'Anti-Rabies booster dose administered by Dr. Sharma.',
        isDemoData: true
      }
    ]);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('[Seed Error]:', err.message);
    process.exit(1);
  }
}

seedDatabase();
