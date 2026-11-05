import { useEffect, useState } from 'react'
import { About, Products } from './components/AboutProducts'
import { Contact, Footer } from './components/ContactFooter'
import { FloatingButtons, Navbar } from './components/SiteChrome'
import { Hero, Process, ProductMarquee, StatsBand, Testimonials, WhyChoose } from './components/Sections'

const sections = ['home', 'about', 'products', 'process', 'testimonials', 'contact']

export default function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))

    const updateActiveSection = () => {
      const activationLine = window.innerHeight * 0.42
      let current = sections[0]
      for (const id of sections) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= activationLine) current = id
        else break
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection()

    return () => {
      revealObserver.disconnect()
      window.removeEventListener('scroll', updateActiveSection)
    }
  }, [])

  return (
    <>
      <Navbar activeSection={activeSection} />
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
      <Footer />
      <FloatingButtons />
    </>
  )
}
