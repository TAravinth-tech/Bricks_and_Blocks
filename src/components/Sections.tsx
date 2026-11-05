import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, Quote, Star } from 'lucide-react'
import { brand, features, marqueeProducts, processSteps, stats, testimonials } from '../data/site-data'

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grain" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <div className="hero-badge"><span className="badge-dot" />5 years of trust <span className="badge-divider">·</span> Peraiyur, Madurai</div>
          <h1>Solid quality.<br /><em>Strong trust.</em></h1>
          <p className="hero-lead">JPS Bricks & Blocks manufactures precision-cast solid concrete blocks, fairface blocks, paver blocks and highway stones for builders across Madurai district — dimensionally accurate, properly cured and delivered on time.</p>
          <p className="tamil-line" lang="ta">{brand.tamilTagline}</p>
          <div className="hero-actions">
            <a className="button button--red button--large" href="#products">View our products <ArrowRight size={17} /></a>
            <a className="button button--outline button--large" href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent('Hello JPS Bricks & Blocks, I would like to enquire about your products.')}`} target="_blank" rel="noreferrer">
              <WhatsAppMini /> Enquire on WhatsApp
            </a>
          </div>
          <div className="hero-quick-stats" aria-label="JPS at a glance">
            <div><strong>5<span>+</span></strong><small>Years strong</small></div>
            <div><strong>11</strong><small>Product lines</small></div>
            <div><strong>450<span>+</span></strong><small>Sites served</small></div>
          </div>
        </div>
        <div className="hero-visual reveal" aria-label="Concrete blocks and paving products">
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-photo hero-photo--main">
            <img src="/images/brick-yard.png" alt="Concrete blocks ready for dispatch from a tidy manufacturing yard" fetchPriority="high" />
            <span className="photo-label"><i />Made for the long run</span>
          </div>
          <div className="hero-photo hero-photo--small">
            <img src="/images/paver-driveway.png" alt="Interlocking concrete pavers in a finished driveway" />
          </div>
          <div className="hero-stamp"><span>JPS</span><small>Built on<br />good work</small></div>
          <div className="hero-corner-mark" aria-hidden="true">01 / 04</div>
        </div>
      </div>
      <a className="hero-scroll" href="#why"><span />Scroll to explore</a>
    </section>
  )
}

export function ProductMarquee() {
  const items = [...marqueeProducts, ...marqueeProducts]
  return (
    <div className="marquee" aria-label={`Products: ${marqueeProducts.join(', ')}`}>
      <div className="marquee-track" aria-hidden="true">
        {items.map((item, index) => <span className="marquee-item" key={`${item}-${index}`}>{item}<b>✳</b></span>)}
      </div>
    </div>
  )
}

export function WhyChoose() {
  return (
    <section className="section section--paper" id="why">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">Why builders choose JPS</span>
          <h2>Quality is our identity,<br /><span>not our slogan.</span></h2>
          <p>Every batch leaves our Peraiyur yard only after full curing and dimension checks — because a wall is only as straight as the block behind it.</p>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, description, tamil }, index) => (
            <article className="feature-card reveal" key={title} style={{ transitionDelay: `${index * 55}ms` }}>
              <div className="feature-icon"><Icon size={22} strokeWidth={1.8} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="feature-tamil" lang="ta">{tamil}</span>
              <span className="feature-index">0{index + 1}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function StatsBand() {
  const [started, setStarted] = useState(false)
  const [counts, setCounts] = useState<number[]>(() => stats.map(() => 0))
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.35 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    let frame = 0
    let startTime = 0
    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / 1300, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCounts(stats.map(({ value }) => Math.round(value * eased)))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [started])

  return (
    <section className="stats-band" ref={ref} aria-label="JPS by the numbers">
      <div className="container stats-grid">
        {stats.map(({ suffix, label, icon: Icon }, index) => (
          <div className="stat-item" key={label}>
            <Icon className="stat-icon" size={21} aria-hidden="true" />
            <strong>{counts[index]}<span>{suffix}</span></strong>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Process() {
  return (
    <section className="section section--paper" id="process">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">How we work</span>
          <h2>From raw aggregate to<br /><span>a wall you can trust.</span></h2>
          <p>Four disciplined stages. Skip any one of them and a block can crack on site — so we skip none.</p>
        </div>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <article className="process-step reveal" key={step.title} style={{ transitionDelay: `${index * 80}ms` }}>
              <div className="step-number"><span>0{index + 1}</span><i /></div>
              <span className="step-kicker">Stage 0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <div className="section-heading section-heading--split reveal">
          <div><span className="eyebrow">Built on good word</span><h2>Trusted on site,<br /><span>order after order.</span></h2></div>
          <p>Good work travels by word of mouth. Here’s what local builders and customers have to say about working with JPS.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((review, index) => (
            <article className="testimonial-card reveal" key={review.name} style={{ transitionDelay: `${index * 90}ms` }}>
              <Quote className="quote-mark" size={32} fill="currentColor" strokeWidth={1} aria-hidden="true" />
              <div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star size={15} key={i} fill="currentColor" strokeWidth={0} />)}</div>
              <blockquote>“{review.quote}”</blockquote>
              <div className="reviewer">
                <span className="reviewer-initials">{review.initials}</span>
                <span><strong>{review.name}</strong><small>{review.role}</small></span>
                <Check className="verified-icon" size={17} aria-label="Verified customer" />
              </div>
            </article>
          ))}
        </div>
        <a className="text-link" href="#contact">Let’s build something together <ArrowUpRight size={16} /></a>
      </div>
    </section>
  )
}

function WhatsAppMini() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M20.52 3.48A11.81 11.81 0 0 0 12.1 0C5.55 0 .22 5.33.22 11.88c0 2.1.55 4.16 1.6 5.97L.12 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.44h.01c6.55 0 11.88-5.33 11.88-11.88a11.8 11.8 0 0 0-3.47-8.43ZM12.1 21.77h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.45-9.91 9.91-9.91a9.85 9.85 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.92 9.9Zm5.44-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.08-.8.38-.28.3-1.05 1.02-1.05 2.49s1.08 2.89 1.23 3.09c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.73.23 1.39.2 1.91.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" /></svg>
}
