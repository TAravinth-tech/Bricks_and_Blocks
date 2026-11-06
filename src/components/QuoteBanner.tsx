import { ArrowRight } from 'lucide-react'
import { brand } from '../data/site-data'

/** Red "Get a price today" call-to-action banner shared by the inner pages. */
export function QuoteBanner() {
  const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent('Hello JPS Bricks & Blocks, I would like to enquire about your products.')}`
  return (
    <div className="quote-banner">
      <div className="container quote-banner-inner reveal">
        <div>
          <span className="quote-kicker">Get a price today</span>
          <h2>Tell us your quantity —<br />we’ll quote and deliver.</h2>
        </div>
        <div className="quote-banner-copy">
          <p>Send your requirement on WhatsApp and get the rate, availability and delivery date back on the same chat.</p>
          <div className="quote-actions">
            <a className="button button--light" href="/contact.html">Enquiry form <ArrowRight size={16} /></a>
            <a className="button button--outline" href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
        <span className="quote-watermark" aria-hidden="true">JPS</span>
      </div>
    </div>
  )
}
