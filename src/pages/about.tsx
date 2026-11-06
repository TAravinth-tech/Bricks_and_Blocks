import React from 'react'
import { createRoot } from 'react-dom/client'
import { AboutHero, Commitment, Delivery, FivePromises, Journey, WhoWeAre } from '../components/AboutPage'
import { PageShell } from '../components/PageShell'
import { QuoteBanner } from '../components/QuoteBanner'
import '../index.css'
import '../page-common.css'
import '../about.css'

function AboutPage() {
  return (
    <PageShell currentPage="about">
      <main id="main-content">
        <AboutHero />
        <WhoWeAre />
        <FivePromises />
        <Journey />
        <Commitment />
        <Delivery />
        <QuoteBanner />
      </main>
    </PageShell>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><AboutPage /></React.StrictMode>)
