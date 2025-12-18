import { Suspense, lazy } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Portfolio from '@/components/sections/Portfolio';
import Certifications from '@/components/sections/Certifications';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

// Lazy load 3D scene for performance
const Scene3D = lazy(() => import('@/components/Scene3D'));

const Index = () => {
  return (
    <main className="relative">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Navigation */}
      <Navigation />

      {/* Content */}
      <Hero />
      <About />
      <Skills />
      <Portfolio />
      <Certifications />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
