import React from 'react'
import { createRoot } from 'react-dom/client'
import { About, Products } from '../components/AboutProducts'
import { Contact } from '../components/ContactFooter'
import { PageShell } from '../components/PageShell'
import { Hero, Process, ProductMarquee, StatsBand, Testimonials, WhyChoose } from '../components/Sections'
import '../index.css'

function HomePage() {
  return (
    <PageShell currentPage="home">
      <main>
        <Hero />
        <ProductMarquee />
        <WhyChoose />
        <About />
        <Products />
        <StatsBand />
        <Process />
        <Testimonials />
        <Contact />
      </main>
    </PageShell>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><HomePage /></React.StrictMode>)
