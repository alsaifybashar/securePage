import React, { useState } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Section from './components/Section';
import CompanySection from './components/CompanySection';
import ProductSection from './components/ProductSection';
import ProcessSection from './components/ProcessSection';
import MindsSection from './components/MindsSection';
import InvestorsSection from './components/InvestorsSection';
import ContactSection from './components/ContactSection';
import CookieButton from './components/CookieButton';
import CookieModal from './components/CookieModal';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  return (
    <Layout>
      <Hero />
      <Section id="company">
        <CompanySection />
      </Section>
      <Section id="product">
        <ProductSection />
      </Section>
      <Section id="process">
        <ProcessSection />
      </Section>
      <Section id="minds">
        <MindsSection />
      </Section>
      <Section id="investors">
        <InvestorsSection />
      </Section>
      <Section id="contact">
        <ContactSection />
      </Section>
      {/* Spacer for scrolling */}
      <div style={{ height: '20vh' }}></div>

      {/* Fixed UI Controls */}
      <CookieButton onClick={() => setIsCookieModalOpen(true)} />
      <ThemeToggle />

      <CookieModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />
    </Layout>
  )
}

export default App;
