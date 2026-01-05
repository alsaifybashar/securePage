import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Section from './components/Section';
import CompanySection from './components/CompanySection';
import ProductSection from './components/ProductSection';
import MindsSection from './components/MindsSection';
import InvestorsSection from './components/InvestorsSection';
import ContactSection from './components/ContactSection';

function App() {
  return (
    <Layout>
      <Hero />
      <Section id="company">
        <CompanySection />
      </Section>
      <Section id="product">
        <ProductSection />
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
    </Layout>
  )
}

export default App;
