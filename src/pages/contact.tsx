import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContactHero, EnquirySection, Faq, FindUs, InfoCards } from '../components/ContactPage'
import { PageShell } from '../components/PageShell'
import { QuoteBanner } from '../components/QuoteBanner'
import '../index.css'
import '../page-common.css'
import '../contact.css'

function ContactPage() {
  return (
    <PageShell currentPage="contact">
      <main id="main-content">
        <ContactHero />
        <EnquirySection />
        <InfoCards />
        <FindUs />
        <Faq />
        <QuoteBanner enquiryHref="#enquiry" />
      </main>
    </PageShell>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><ContactPage /></React.StrictMode>)
