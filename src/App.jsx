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
import CookieConsent from './components/CookieConsent';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState(null);

  const handleCookieConsent = (preferences) => {
    setCookiePreferences(preferences);
    // Here you can initialize analytics, marketing scripts, etc. based on preferences
    console.log('Cookie preferences saved:', preferences);

    if (preferences.statistics) {
      // Initialize analytics (e.g., Google Analytics)
      console.log('Statistics cookies enabled - analytics can be loaded');
    }

    if (preferences.marketing) {
      // Initialize marketing scripts
      console.log('Marketing cookies enabled - marketing scripts can be loaded');
    }

    if (preferences.preferences) {
      // Initialize preference-based features
      console.log('Preference cookies enabled');
    }
  };

  return (
    <Layout>
      {/* Cookie Consent Banner - Shows on first visit */}
      <CookieConsent onConsentGiven={handleCookieConsent} />

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

      {/* Cookie Settings Modal - For changing preferences later */}
      <CookieModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />
    </Layout>
  )
}

export default App;
