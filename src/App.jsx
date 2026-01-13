import React, { useState, useEffect } from 'react';
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
import { analyticsTracker } from './services/analytics';
import clarityService from './services/clarity';

function App() {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState(null);
  // Listen for cookie consent changes
  useEffect(() => {
    const handleConsentUpdate = (event) => {
      const prefs = event.detail;
      if (prefs.statistics && !clarityService.isInitialized()) {
        clarityService.init();
        clarityService.consent(true);
      }
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  const handleCookieConsent = (preferences) => {
    setCookiePreferences(preferences);
    console.log('Cookie preferences saved:', preferences);

    // Initialize analytics if statistics cookies are allowed
    if (preferences.statistics) {
      analyticsTracker.init();
      console.log('Statistics cookies enabled - analytics initialized');

      // Initialize Microsoft Clarity for behavior analytics
      clarityService.init();
      clarityService.consent(true);
      console.log('Microsoft Clarity initialized');
    }

    if (preferences.marketing) {
      console.log('Marketing cookies enabled - marketing scripts can be loaded');
    }

    if (preferences.preferences) {
      console.log('Preference cookies enabled');
    }
  };

  // Regular website
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
