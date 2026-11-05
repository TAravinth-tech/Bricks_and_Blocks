import { useState, type FormEvent } from 'react'
import { ArrowRight, Clock3, MapPin, Phone, Send } from 'lucide-react'
import { brand, products } from '../data/site-data'
import { BrandLogo } from './SiteChrome'

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const values = new FormData(form)
    const message = [
      'Hello JPS Bricks & Blocks, I would like a quote.',
      `Name: ${values.get('name')}`,
      `Phone: ${values.get('phone')}`,
      `Product: ${values.get('product')}`,
      `Quantity: ${values.get('quantity')}`,
      values.get('message') ? `Message: ${values.get('message')}` : '',
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
    setToastVisible(true)
    window.setTimeout(() => setToastVisible(false), 4600)
    form.reset()
  }

  return (
    <>
      <div className="quote-banner">
        <div className="container quote-banner-inner reveal">
          <div><span className="quote-kicker">Your project starts with a conversation</span><h2>Get a price today.</h2></div>
          <div className="quote-banner-copy"><p>Tell us your quantity — we’ll quote and deliver. Send your requirement on WhatsApp and get the rate, availability and delivery date back on the same chat.</p><a href="#contact-form" className="button button--light">Send your requirement <ArrowRight size={16} /></a></div>
          <span className="quote-watermark" aria-hidden="true">JPS</span>
        </div>
      </div>
      <section className="section contact-section" id="contact">
        <div className="container">
          <div className="section-heading section-heading--center reveal">
            <span className="eyebrow">Talk to the people who make it</span>
            <h2>Tell us what you’re<br /><span>building.</span></h2>
            <p>Share a few details and we’ll take it from there — directly on WhatsApp, no waiting around.</p>
          </div>
          <div className="contact-grid">
            <form className="enquiry-form reveal" id="contact-form" onSubmit={handleSubmit}>
              <div className="form-heading"><div><span className="form-index">01 / ENQUIRY</span><h3>Request a quote</h3></div><Send size={20} aria-hidden="true" /></div>
              <div className="form-fields">
                <label className="field"><span>Your name <i>*</i></span><input name="name" type="text" autoComplete="name" placeholder="e.g. Arun Kumar" required maxLength={80} /></label>
                <label className="field"><span>Phone number <i>*</i></span><input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" pattern="[0-9+() -]{8,18}" title="Enter a valid phone number" required /></label>
                <label className="field"><span>Product <i>*</i></span><select name="product" defaultValue="" required><option value="" disabled>Select a product</option>{products.map((product) => <option key={product.name}>{product.name}</option>)}</select></label>
                <label className="field"><span>Quantity <i>*</i></span><input name="quantity" type="text" placeholder="e.g. 500 pieces / 1 load" maxLength={80} required /></label>
                <label className="field field--wide"><span>Message <small>(optional)</small></span><textarea name="message" rows={3} placeholder="Tell us about your site or delivery location..." maxLength={500} /></label>
              </div>
              <button type="submit" className="button button--red form-submit">Send enquiry on WhatsApp <ArrowRight size={16} /></button>
              <p className="form-note">Your details are used only to respond to this enquiry.</p>
              {submitted && <p className="form-success" role="status">Your enquiry is ready in WhatsApp. We’ll be in touch soon.</p>}
            </form>
            <div className="contact-details reveal">
              <div className="details-heading"><span className="form-index">02 / REACH US</span><h3>Come by or call.</h3><p>We’re at the yard Monday through Sunday. Delivery is available across the surrounding area.</p></div>
              <div className="contact-detail-card"><span className="detail-icon"><MapPin size={19} /></span><div><small>Visit our yard</small><address>{brand.address}</address><a href="https://maps.google.com/?q=Kilangulam+Main+Road+Peraiyur+Madurai" target="_blank" rel="noreferrer">Get directions <ArrowRight size={13} /></a></div></div>
              <div className="contact-detail-card"><span className="detail-icon"><Phone size={19} /></span><div><small>Call us directly</small><a className="detail-phone" href={brand.phoneHref}>{brand.phone}</a><a className="detail-phone" href={brand.secondPhoneHref}>{brand.secondPhone}</a></div></div>
              <div className="contact-detail-card"><span className="detail-icon"><Clock3 size={19} /></span><div><small>Working hours</small><p>Mon–Sat · 8:00 AM – 7:00 PM<br />Sunday · 9:00 AM – 1:00 PM</p></div></div>
              <div className="map-frame"><iframe src={brand.mapUrl} title="Map showing JPS Bricks & Blocks near Kilangulam Main Road, Peraiyur, Madurai" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
            </div>
          </div>
        </div>
      </section>
      {toastVisible && <div className="toast" role="status"><span>✓</span> WhatsApp enquiry prepared. We’ll be in touch soon.</div>}
    </>
  )
}

export function Footer() {
  const quickLinks = [
    ['Home', '#home'], ['About JPS', '#about'], ['Our products', '#products'], ['Our process', '#process'], ['Testimonials', '#testimonials'], ['Get a quote', '#contact'],
  ]
  const productLinks = products.slice(0, 6)
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <BrandLogo />
          <p>Manufacturer and supplier of solid concrete blocks, fairface blocks, flavour bricks, paver blocks, kerb stones and blue metal — serving Peraiyur, Madurai and the surrounding districts for over five years.</p>
          <p className="footer-tamil" lang="ta">{brand.tamilTagline}</p>
          <div className="footer-socials">
            <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Message JPS on WhatsApp"><WhatsAppIcon /></a>
            <a href={brand.phoneHref} aria-label={`Call ${brand.phone}`}><Phone size={17} /></a>
            <a href="https://maps.google.com/?q=Kilangulam+Main+Road+Peraiyur+Madurai" target="_blank" rel="noreferrer" aria-label="Find JPS on the map"><MapPin size={17} /></a>
          </div>
        </div>
        <div className="footer-column"><h3>Quick links</h3>{quickLinks.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div>
        <div className="footer-column"><h3>Our products</h3>{productLinks.map((product) => <a key={product.name} href="#products">{product.name}</a>)}</div>
        <div className="footer-column footer-reach"><h3>Reach us</h3><p>{brand.address}</p><a href={brand.phoneHref}>{brand.phone}</a><a href={brand.secondPhoneHref}>{brand.secondPhone}</a><p>Mon–Sat · 8:00 AM – 7:00 PM<br />Sunday · 9:00 AM – 1:00 PM</p></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 JPS Bricks & Blocks, Peraiyur, Madurai. All rights reserved.</span><a href="#home">Back to top ↑</a></div>
    </footer>
  )
}

function WhatsAppIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.52 3.48A11.81 11.81 0 0 0 12.1 0C5.55 0 .22 5.33.22 11.88c0 2.1.55 4.16 1.6 5.97L.12 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.44h.01c6.55 0 11.88-5.33 11.88-11.88a11.8 11.8 0 0 0-3.47-8.43ZM12.1 21.77h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.45-9.91 9.91-9.91a9.85 9.85 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.92 9.9Z" /></svg>
}
