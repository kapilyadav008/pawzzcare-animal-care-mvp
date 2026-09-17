import { Router } from 'express';
import mongoose from 'mongoose';
import { Provider } from '../models/Provider.js';

const router = Router();

// Default Gurgaon Reference Coordinates (Cyber City, Gurgaon)
const GURGAON_CENTER = { latitude: 28.4595, longitude: 77.0266 };

export const SEEDED_PROVIDERS = [
  {
    _id: '66e9b0011111111111111101',
    name: 'Pawzz Veterinary Care & Clinic',
    type: 'Clinic',
    location: 'Sector 54, Gurgaon',
    coordinates: { latitude: 28.4421, longitude: 77.1054 },
    rating: 4.8,
    phone: '+91 98100 12345',
    services: ['General Consultation', 'Vaccination', 'Emergency Care', 'Surgery'],
    openNow: true,
    isDemoData: true,
    address: 'Golf Course Road, Near Sector 54 Rapid Metro, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111102',
    name: 'Gurgaon Animal Rescue & Rehab',
    type: 'NGO',
    location: 'Sector 31, Gurgaon',
    coordinates: { latitude: 28.4612, longitude: 77.0425 },
    rating: 4.7,
    phone: '+91 98111 22334',
    services: ['Stray Animal Rescue', 'Fostering', 'First Aid', 'Adoption'],
    openNow: true,
    isDemoData: true,
    address: 'Plot 45, Near Huda Market, Sector 31, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111103',
    name: 'Dr. Sharma Pet Clinic & Multispeciality',
    type: 'Vet',
    location: 'DLF Phase 4, Gurgaon',
    coordinates: { latitude: 28.4689, longitude: 77.0812 },
    rating: 4.9,
    phone: '+91 98765 43210',
    services: ['Dental Care', 'Orthopedics', 'Vaccination', 'Diagnostics'],
    openNow: true,
    isDemoData: true,
    address: 'Galleria Market, Suite 102, DLF Phase 4, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111104',
    name: 'Paws24 Emergency Animal Ambulance',
    type: 'Ambulance',
    location: 'Cyber City, Gurgaon',
    coordinates: { latitude: 28.4950, longitude: 77.0890 },
    rating: 4.9,
    phone: '+91 99999 88888',
    services: ['24/7 Mobile ICU', 'Trauma Transport', 'Oxygen Support'],
    openNow: true,
    isDemoData: true,
    address: 'DLF Cyber City, Building 10, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111105',
    name: 'Heal & Hope Animal NGO',
    type: 'NGO',
    location: 'Sector 14, Gurgaon',
    coordinates: { latitude: 28.4720, longitude: 77.0350 },
    rating: 4.6,
    phone: '+91 98222 33445',
    services: ['ABC Program', 'Rabies Vaccination Drives', 'Free Stray Clinic'],
    openNow: true,
    isDemoData: true,
    address: 'Old Judicial Complex Road, Sector 14, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111106',
    name: 'Capt. Rajesh Independent Animal Rescuer',
    type: 'Rescue',
    location: 'Sector 56, Gurgaon',
    coordinates: { latitude: 28.4280, longitude: 77.1080 },
    rating: 4.9,
    phone: '+91 97177 66554',
    services: ['Snake & Wildlife Rescue', 'Injured Stray Triage', 'Spot Treatment'],
    openNow: true,
    isDemoData: true,
    address: 'Sector 56 Community Center, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111107',
    name: 'VetCare 24/7 Emergency Hospital',
    type: 'Clinic',
    location: 'Sohna Road, Gurgaon',
    coordinates: { latitude: 28.4150, longitude: 77.0410 },
    rating: 4.8,
    phone: '+91 98188 99000',
    services: ['Overnight ICU', 'Surgical Suite', 'Blood Bank', 'CT Scan'],
    openNow: true,
    isDemoData: true,
    address: 'Subhash Chowk, Sohna Road, Sector 47, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111108',
    name: 'City Pet Mobile Vet Ambulance',
    type: 'Ambulance',
    location: 'Golf Course Extension, Gurgaon',
    coordinates: { latitude: 28.3980, longitude: 77.0850 },
    rating: 4.7,
    phone: '+91 98999 11223',
    services: ['Home Visit Consultation', 'Emergency Dispatch', 'Sample Pickup'],
    openNow: true,
    isDemoData: true,
    address: 'Sector 65, Golf Course Extension Road, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111109',
    name: 'Stray Friends Gurgaon Collective',
    type: 'NGO',
    location: 'Sector 23, Gurgaon',
    coordinates: { latitude: 28.5110, longitude: 77.0520 },
    rating: 4.5,
    phone: '+91 98112 44556',
    services: ['Community Feeding', 'De-worming Drives', 'Feline Spay Clinic'],
    openNow: false,
    isDemoData: true,
    address: 'Palam Vihar Road, Sector 23, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111110',
    name: 'Anand Pet Wellness Clinic',
    type: 'Vet',
    location: 'DLF Phase 2, Gurgaon',
    coordinates: { latitude: 28.4810, longitude: 77.0820 },
    rating: 4.6,
    phone: '+91 98101 55443',
    services: ['Wellness Examinations', 'Microchipping', 'Health Certificates'],
    openNow: true,
    isDemoData: true,
    address: 'Near Sikanderpur Metro Station, DLF Phase 2, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111111',
    name: 'Gurugram Canine Rescuers Network',
    type: 'Rescue',
    location: 'Sector 45, Gurgaon',
    coordinates: { latitude: 28.4480, longitude: 77.0650 },
    rating: 4.8,
    phone: '+91 99100 88776',
    services: ['Foster Matching', 'Accident Rescue Response', 'Cruelty Reporting'],
    openNow: true,
    isDemoData: true,
    address: 'Sector 45 Unitech Cyber Park Area, Gurgaon'
  },
  {
    _id: '66e9b0011111111111111112',
    name: 'Pet Shield Veterinary Diagnostic Center',
    type: 'Clinic',
    location: 'Sector 15, Gurgaon',
    coordinates: { latitude: 28.4680, longitude: 77.0480 },
    rating: 4.7,
    phone: '+91 98115 77889',
    services: ['Pathology Lab', 'Ultrasound', 'Echocardiography', 'X-Ray'],
    openNow: true,
    isDemoData: true,
    address: 'Patel Nagar, Sector 15 Part 1, Gurgaon'
  }
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

router.get('/', async (req, res, next) => {
  try {
    const { type, search } = req.query;

    let providersList: any[] = [];
    if (mongoose.connection.readyState === 1) {
      const queryObj: any = {};
      if (type && type !== 'all' && type !== 'All') {
        queryObj.type = { $regex: new RegExp(`^${type}$`, 'i') };
      }
      if (search) {
        queryObj.$or = [
          { name: { $regex: search as string, $options: 'i' } },
          { location: { $regex: search as string, $options: 'i' } },
          { services: { $regex: search as string, $options: 'i' } }
        ];
      }
      providersList = await Provider.find(queryObj);
    }

    if (providersList.length === 0) {
      providersList = SEEDED_PROVIDERS;
      if (type && type !== 'all' && type !== 'All') {
        providersList = providersList.filter(
          p => p.type.toLowerCase() === (type as string).toLowerCase()
        );
      }
      if (search) {
        const s = (search as string).toLowerCase();
        providersList = providersList.filter(
          p =>
            p.name.toLowerCase().includes(s) ||
            p.location.toLowerCase().includes(s) ||
            p.services.some((srv: string) => srv.toLowerCase().includes(s))
        );
      }
    }

    // Attach computed distance from Gurgaon center
    const withDistance = providersList.map(p => {
      const pObj = p.toObject ? p.toObject() : { ...p };
      const dist = calculateDistanceKm(
        GURGAON_CENTER.latitude,
        GURGAON_CENTER.longitude,
        pObj.coordinates.latitude,
        pObj.coordinates.longitude
      );
      return { ...pObj, distanceKm: dist };
    });

    res.json({
      success: true,
      data: withDistance,
      isDemoData: true,
      notice: 'Demo Provider Directory: Sourced from Gurgaon demonstration directory.'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/nearby', async (req, res, next) => {
  try {
    const userLat = parseFloat(req.query.lat as string) || GURGAON_CENTER.latitude;
    const userLng = parseFloat(req.query.lng as string) || GURGAON_CENTER.longitude;

    let providersList: any[] = [];
    if (mongoose.connection.readyState === 1) {
      providersList = await Provider.find();
    }
    if (providersList.length === 0) {
      providersList = SEEDED_PROVIDERS;
    }

    const calculated = providersList.map(p => {
      const pObj = p.toObject ? p.toObject() : { ...p };
      const dist = calculateDistanceKm(userLat, userLng, pObj.coordinates.latitude, pObj.coordinates.longitude);
      return { ...pObj, distanceKm: dist };
    });

    // Sort nearest first
    calculated.sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      data: calculated,
      userLocation: { latitude: userLat, longitude: userLng },
      isDemoData: true,
      notice: 'Demo Provider Directory: Sourced from Gurgaon demonstration directory.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
