// app/components/home/HeroSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-[#1A120B]">
      {/* Background Looping Logo Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-60 scale-105 filter brightness-90"
        >
          <source src="/melti-logo-loop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark Vignette / Gradient Overlay to make text pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A120B] via-transparent to-[#1A120B]/40 pointer-events-none" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
       

    
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 z-10 flex flex-col items-center cursor-pointer"
        onClick={scrollToContent}
      >
        <span className="text-xs uppercase tracking-widest text-[#E6C594] mb-2 font-semibold">
          Scroll to Taste
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="p-2 rounded-full bg-[#582F0E]/60 backdrop-blur-sm border border-[#D4A373]/40 text-[#FFF8F0]"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}