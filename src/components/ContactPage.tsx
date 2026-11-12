import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowRight, Check, ChevronDown, Clock, MapPin, MessageCircle, Phone, Send, User, Smartphone } from 'lucide-react'
import { brand } from '../data/site-data'
import { rangeProducts } from '../data/products-page-data'

/* ---------- Content ---------- */

const hours = { weekdays: 'Mon – Sat: 8:00 AM – 7:00 PM', sunday: 'Sunday: 9:00 AM – 1:00 PM' }
const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}`
const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent('Hello JPS Bricks & Blocks, I would like to enquire about your products.')}`
const NOT_SURE = 'Not sure — please advise'
const productOptions = [...rangeProducts.map((product) => product.name), NOT_SURE]

export const faqs = [
  { q: 'What is your minimum order quantity?', a: 'There is no fixed minimum for yard pickup. For delivery, we work out the most economical load size for your quantity and distance — tell us what you need and we will advise.' },
  { q: 'Do you deliver to my site?', a: 'Yes, delivery is available. Share your village or town, taluk and district in the enquiry form and we will confirm delivery to your site and quote the rate with delivery included.' },
  { q: 'Should I use 4 inch or 6 inch solid blocks?', a: 'Use 6 inch (150 mm) blocks for external, load-bearing, fence and factory walls. Use 4 inch (100 mm) blocks for partitions, inter walls, and bathroom and kitchen walls. Not sure? Tell us about the building and we will advise.' },
  { q: 'How soon can I get material after ordering?', a: 'Most enquiries are quoted the same day. Along with the rate, we give you an honest delivery date based on our real stock position and your site location.' },
  { q: 'Can I see the material before I buy?', a: 'Yes. Site visits are welcome — come to our yard on Kilangulam Main Road, Peraiyur and see the stock yourself. We are open Monday to Saturday, 8:00 AM to 7:00 PM, and Sunday, 9:00 AM to 1:00 PM.' },
]

const promises = [
  'Same-day quotation on most enquiries',
  'Rates quoted per piece and per load, delivery included',
  <>Delivery facility available — <span lang="ta">டெலிவரி வசதி உண்டு</span></>,
  'Site visits welcome; come and see the stock yourself',
]

/* ---------- Helpers ---------- */

/** Reduces "+91 63827 27154", "063827 27154" etc. to a plain 10-digit number. */
function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

function productFromUrl() {
  if (typeof window === 'undefined') return ''
  const wanted = new URLSearchParams(window.location.search).get('product')?.toLowerCase()
  return productOptions.find((option) => option.toLowerCase() === wanted) ?? ''
}

/** True while the yard is open, judged in Indian time whatever the visitor's timezone. */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date())
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  const minutes = Number(get('hour')) * 60 + Number(get('minute'))
  return get('weekday') === 'Sun' ? minutes >= 9 * 60 && minutes < 13 * 60 : minutes >= 8 * 60 && minutes < 19 * 60
}

/* ---------- Sections ---------- */

export function ContactHero() {
  return (
    <section className="page-hero cx-hero">
      <div className="hero-grain" aria-hidden="true" />
      <div className="container page-hero-grid">
        <div className="reveal">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Contact</span>
          </nav>
          <h1>Contact &amp;<br /><em>Get a Quote</em></h1>
          <p className="page-hero-lead">Tell us what you are building. We reply with the real rate, the real stock position and an honest delivery date — usually the same day.</p>
        </div>
        <ul className="cx-quick reveal">
          <li><a href={brand.phoneHref}><span className="cx-quick-icon"><Phone size={19} aria-hidden="true" /></span><div><small>Call us</small><strong>{brand.phone}</strong></div></a></li>
          <li><a href={whatsappHref} target="_blank" rel="noreferrer"><span className="cx-quick-icon cx-quick-icon--wa"><MessageCircle size={19} aria-hidden="true" /></span><div><small>WhatsApp</small><strong>{brand.secondPhone}</strong></div></a></li>
          <li><a href={directionsHref} target="_blank" rel="noreferrer"><span className="cx-quick-icon"><MapPin size={19} aria-hidden="true" /></span><div><small>Visit the yard</small><strong>{brand.shortAddress}</strong></div></a></li>
        </ul>
      </div>
    </section>
  )
}

type Values = { name: string; phone: string; address: string; product: string; quantity: string; message: string }
type Errors = Partial<Record<'name' | 'phone' | 'address' | 'product', string>>

export function EnquirySection() {
  const [values, setValues] = useState<Values>({ name: '', phone: '', address: '', product: '', quantity: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  // Arriving from a "Get quote" button on the Products page pre-selects that product.
  useEffect(() => {
    const product = productFromUrl()
    if (product) setValues((current) => ({ ...current, product }))
  }, [])

  function validate(next: Values): Errors {
    const result: Errors = {}
    if (next.name.trim().length < 2) result.name = 'Please enter your name.'
    if (!/^[6-9]\d{9}$/.test(normalizePhone(next.phone))) result.phone = 'Enter a valid 10-digit mobile number.'
    if (next.address.trim().length < 3) result.address = 'Tell us where the material has to be delivered.'
    if (!next.product) result.product = 'Please choose a product.'
    return result
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    setSent(false)
    if (errors[name as keyof Errors]) setErrors(validate(next))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const firstInvalid = (['name', 'phone', 'address', 'product'] as const).find((key) => found[key])
    if (firstInvalid) {
      document.getElementById(`cx-${firstInvalid}`)?.focus()
      return
    }
    const message = [
      'Hello JPS Bricks & Blocks, I would like a quote.',
      '',
      `Name: ${values.name.trim()}`,
      `Mobile: ${normalizePhone(values.phone)}`,
      `Delivery location: ${values.address.trim()}`,
      `Product: ${values.product}`,
      values.quantity.trim() ? `Quantity: ${values.quantity.trim()}` : '',
      values.message.trim() ? `Message: ${values.message.trim()}` : '',
    ].filter((line, index) => line || index === 1).join('\n')
    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setSent(true)
    setValues({ name: '', phone: '', address: '', product: '', quantity: '', message: '' })
  }

  const fieldProps = (key: keyof Errors) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `cx-${key}-error` : undefined,
    onChange: handleChange,
  })
  const error = (key: keyof Errors) => errors[key] ? <p className="cx-error" id={`cx-${key}-error`} role="alert">{errors[key]}</p> : null

  return (
    <section className="cx-enquiry" id="enquiry">
      <div className="container cx-grid">
        <div className="cx-form-card reveal">
          <span className="eyebrow">Enquiry form</span>
          <h2>Tell us what you need</h2>
          <p className="cx-form-lead">Fill this in and press <strong>Send on WhatsApp</strong>. Your details open as a ready-made message in WhatsApp — just hit send, and we reply with the rate and delivery date.</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="cx-row">
              <div className="cx-field">
                <label htmlFor="cx-name">Name <span className="cx-req">*</span></label>
                <div className="cx-input"><User size={16} aria-hidden="true" /><input id="cx-name" name="name" type="text" autoComplete="name" placeholder="Your full name" value={values.name} {...fieldProps('name')} /></div>
                {error('name')}
              </div>
              <div className="cx-field">
                <label htmlFor="cx-phone">Mobile number <span className="cx-req">*</span></label>
                <div className="cx-input"><Smartphone size={16} aria-hidden="true" /><input id="cx-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" value={values.phone} {...fieldProps('phone')} /></div>
                {error('phone')}
              </div>
            </div>
            <div className="cx-field">
              <label htmlFor="cx-address">Address / site location <span className="cx-req">*</span></label>
              <textarea id="cx-address" name="address" rows={3} autoComplete="street-address" placeholder="Village / town, taluk and district where the material has to be delivered" value={values.address} {...fieldProps('address')} />
              {error('address')}
            </div>
            <div className="cx-row">
              <div className="cx-field">
                <label htmlFor="cx-product">Which bricks / blocks do you need? <span className="cx-req">*</span></label>
                <select id="cx-product" name="product" value={values.product} {...fieldProps('product')}>
                  <option value="">— Select a product —</option>
                  {productOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                {error('product')}
              </div>
              <div className="cx-field">
                <label htmlFor="cx-quantity">Approx. quantity <span className="cx-opt">(optional)</span></label>
                <input id="cx-quantity" name="quantity" type="text" placeholder="e.g. 2000 nos / 3 loads" value={values.quantity} onChange={handleChange} />
              </div>
            </div>
            <div className="cx-field">
              <label htmlFor="cx-message">Message <span className="cx-opt">(optional)</span></label>
              <textarea id="cx-message" name="message" rows={3} placeholder="Sizes, colours, expected delivery date, or anything else we should know" value={values.message} onChange={handleChange} />
            </div>
            <button className="cx-submit" type="submit"><Send size={17} aria-hidden="true" /> Send enquiry on WhatsApp</button>
            <p className="cx-status" role="status" aria-live="polite">
              {sent ? <><Check size={15} aria-hidden="true" /> WhatsApp is opening with your enquiry — just press Send.</> : null}
            </p>
            <p className="cx-note">This form opens WhatsApp with your details filled in — no data is stored on this website. Prefer to talk? Call <a href={brand.phoneHref}>{brand.phone.replace('+91 ', '')}</a>.</p>
          </form>
        </div>

        <aside className="cx-side reveal">
          <div className="cx-photos">
            <figure className="cx-photo"><img src="/images/concrete-blocks.png" alt="Solid concrete blocks stacked at the JPS Bricks and Blocks yard in Peraiyur" loading="lazy" /></figure>
            <figure className="cx-photo"><img src="/images/paver-driveway.png" alt="Paver blocks laid on a driveway, supplied by JPS Bricks and Blocks" loading="lazy" /></figure>
          </div>
          <h2>Straight answers, quickly</h2>
          <p className="cx-side-lead">We are a manufacturer, not a call centre. When you ring, you reach the people who cast the block — so you get the real rate, the real stock position and an honest delivery date on the first call.</p>
          <ul className="cx-checks">
            {promises.map((item, index) => <li key={index}><span><Check size={13} strokeWidth={3} /></span><div>{item}</div></li>)}
          </ul>
          <div className="cx-bulk">
            <h3>Bulk or contract requirement?</h3>
            <p>For layout roads, highway kerbing or multi-house projects, call us directly and we will work out a phased delivery schedule and a contract rate.</p>
            <a className="button cx-btn-gold" href={brand.secondPhoneHref}><Phone size={15} aria-hidden="true" /> Call {brand.secondPhone.replace('+91 ', '')}</a>
          </div>
        </aside>
      </div>
    </section>
  )
}

export function InfoCards() {
  const [open, setOpen] = useState<boolean | null>(null)
  useEffect(() => {
    setOpen(isOpenNow())
    const timer = window.setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="section section--paper cx-cards-section" aria-label="Contact details">
      <div className="container cx-cards">
        <article className="cx-card reveal">
          <span className="cx-card-icon"><Phone size={21} aria-hidden="true" /></span>
          <h3>Call us</h3>
          <a href={brand.phoneHref}>{brand.phone}</a>
          <a href={brand.secondPhoneHref}>{brand.secondPhone}</a>
          <a className="cx-card-link" href={brand.phoneHref}>Call now <ArrowRight size={13} aria-hidden="true" /></a>
        </article>
        <article className="cx-card reveal" style={{ transitionDelay: '60ms' }}>
          <span className="cx-card-icon"><MessageCircle size={21} aria-hidden="true" /></span>
          <h3>WhatsApp</h3>
          <a href={whatsappHref} target="_blank" rel="noreferrer">{brand.secondPhone}</a>
          <p>Fastest way to get a rate</p>
          <a className="cx-card-link" href={whatsappHref} target="_blank" rel="noreferrer">Start chat <ArrowRight size={13} aria-hidden="true" /></a>
        </article>
        <article className="cx-card reveal" style={{ transitionDelay: '120ms' }}>
          <span className="cx-card-icon"><MapPin size={21} aria-hidden="true" /></span>
          <h3>Visit the yard</h3>
          <p>12/6, Kilangulam Main Road, Peraiyur Taluk, Madurai – 625703</p>
          <a className="cx-card-link" href={directionsHref} target="_blank" rel="noreferrer">Get directions <ArrowRight size={13} aria-hidden="true" /></a>
        </article>
        <article className="cx-card reveal" style={{ transitionDelay: '180ms' }}>
          <span className="cx-card-icon"><Clock size={21} aria-hidden="true" /></span>
          <h3>Working hours</h3>
          <p>{hours.weekdays}<br />{hours.sunday}</p>
          {open !== null && <span className={`cx-badge ${open ? 'cx-badge--open' : 'cx-badge--closed'}`}>{open ? 'Open now' : 'Closed now'}</span>}
        </article>
      </div>
    </section>
  )
}

export function FindUs() {
  return (
    <section className="section" id="find-us">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">Find us</span>
          <h2>Kilangulam Main Road,<br /><span>Peraiyur.</span></h2>
          <p>Our yard is on Kilangulam Main Road in Peraiyur Taluk, Madurai district. Open six days a week.</p>
        </div>
        <div className="cx-map-grid reveal">
          <div className="cx-map-info">
            <span className="cx-map-pin"><MapPin size={22} aria-hidden="true" /></span>
            <h3>JPS Bricks &amp; Blocks</h3>
            <address>12/6, Kilangulam Main Road,<br />Peraiyur Taluk, Madurai – 625703,<br />Tamil Nadu, India</address>
            <p className="cx-map-hours"><Clock size={15} aria-hidden="true" /><span>{hours.weekdays}<br />{hours.sunday}</span></p>
            <div className="cx-map-actions">
              <a className="button button--red" href={directionsHref} target="_blank" rel="noreferrer">Open in Google Maps <ArrowRight size={15} aria-hidden="true" /></a>
              <a className="button cx-btn-ghost" href={brand.phoneHref}><Phone size={15} aria-hidden="true" /> Call</a>
            </div>
          </div>
          <div className="cx-map">
            <span className="cx-map-loading" aria-hidden="true">Loading map…</span>
            <iframe title="Map showing JPS Bricks and Blocks, Kilangulam Main Road, Peraiyur, Madurai" src={brand.mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  return (
    <section className="section section--paper" id="faq">
      <div className="container cx-faq-grid">
        <div className="cx-faq-intro reveal">
          <span className="eyebrow">Common questions</span>
          <h2>Before you<br /><span>call.</span></h2>
          <p>The questions we are asked most often, answered plainly.</p>
          <a className="button button--red" href={brand.phoneHref}><Phone size={15} aria-hidden="true" /> Still unsure? Call us</a>
        </div>
        <div className="cx-faq reveal">
          {faqs.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}<ChevronDown size={19} aria-hidden="true" /></summary>
              <p className="cx-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
