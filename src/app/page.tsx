'use client';

import { useState, useEffect } from 'react';
import Landing from '@/components/layout/landing';
import Header from '@/components/layout/header';
import Hero from '@/components/sections/hero';
import Essays from '@/components/sections/essays';
import ReadingLog from '@/components/sections/reading-log';
import KnowledgeGraph from '@/components/sections/knowledge-graph';
import Dashboard from '@/components/sections/dashboard';
import About from '@/components/sections/about';
import Footer from '@/components/layout/footer';

export default function Home() {
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    if (!isEntered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isEntered]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white selection:text-black">
      {!isEntered && <Landing onEnter={() => setIsEntered(true)} />}
      
      <div className={`transition-opacity duration-1000 ${isEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Header />
        <main className="max-w-[860px] mx-auto">
          <Hero />
          <Essays />
          <ReadingLog />
          <KnowledgeGraph />
          <Dashboard />
          <About />
          <Footer />
        </main>
      </div>
    </div>
  );
}