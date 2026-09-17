import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Home } from './pages/Home';
import { AiAssistant } from './pages/AiAssistant';
import { FindCare } from './pages/FindCare';
import { MyPets } from './pages/MyPets';
import { MedicalOrganizer } from './pages/MedicalOrganizer';
import { VetSummary } from './pages/VetSummary';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-charcoal-900 pb-16 md:pb-0">
        <EmergencyBanner />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assistant" element={<AiAssistant />} />
            <Route path="/find-care" element={<FindCare />} />
            <Route path="/my-pets" element={<MyPets />} />
            <Route path="/medical-organizer" element={<MedicalOrganizer />} />
            <Route path="/vet-summary" element={<VetSummary />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
