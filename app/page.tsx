// app/page.tsx
'use client';

import { useState } from 'react';
import HotChocolateLoader from './components/loader/HotChocolateLoader';
import SurveyMascot from './components/survey/SurveyMascot';
import Navbar from './components/navigation/Navbar';
import HeroSection from './components/home/HeroSection';
import ProductShowcase from './components/home/ProductShowcase';
import WhyMelti from './components/home/WhyMelti';
import WhiskRituals from './components/home/WhiskRituals';
import OurStory from './components/home/OurStory';
import Footer from './components/home/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#120B06',
        color: '#FFF8F0',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Signature Hot Chocolate Loader */}
      {isLoading && (
        <HotChocolateLoader
          onLoadingComplete={() => {
            setIsLoading(false);
            setShowSurvey(true);
          }}
          minimumLoadTimeMs={4000}
        />
      )}

      {/* 2. Interactive Survey Mascot */}
      {showSurvey && (
        <SurveyMascot
          surveyUrl="https://survey-ecru-pi.vercel.app/"
          onDismiss={() => setShowSurvey(false)}
        />
      )}

      {/* 3. Glassmorphic Navigation Bar */}
      <Navbar />

      {/* 4. Hero Section */}
      <HeroSection />

      {/* 5. Signature Blend Bar (#products) */}
      <ProductShowcase />

      {/* 6. The Couverture Standard (#why-melti) */}
      <WhyMelti />

      {/* 7. Café-Grade Whisk Rituals (#recipes) */}
      <WhiskRituals />

      {/* 8. Bean-to-Tin Provenance & Manifesto (#story) */}
      <OurStory />

      {/* 9. Inner Circle VIP Club & Footer */}
      <Footer />
    </main>
  );
}