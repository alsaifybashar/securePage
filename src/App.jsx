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
import AdminPage from './pages/admin/AdminPage';
import { analyticsTracker } from './services/analytics';

function App() {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Check if we're on the hidden admin route
  useEffect(() => {
    const path = window.location.pathname;
    // Hidden admin URL - hard to guess
    if (path === '/sp-admin-portal-x7k9m2') {
      setIsAdminRoute(true);
    }

    // Handle browser back/forward
    const handlePopState = () => {
      const newPath = window.location.pathname;
      setIsAdminRoute(newPath === '/sp-admin-portal-x7k9m2');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCookieConsent = (preferences) => {
    setCookiePreferences(preferences);
    console.log('Cookie preferences saved:', preferences);

    // Initialize analytics if statistics cookies are allowed
    if (preferences.statistics) {
      analyticsTracker.init();
      console.log('Statistics cookies enabled - analytics initialized');
    }

    if (preferences.marketing) {
      console.log('Marketing cookies enabled - marketing scripts can be loaded');
    }

    if (preferences.preferences) {
      console.log('Preference cookies enabled');
    }
  };

  // Render admin dashboard if on admin route
  if (isAdminRoute) {
    return <AdminPage />;
  }

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
