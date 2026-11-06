import { ArrowRight, Check, Phone } from 'lucide-react'
import { brand } from '../data/site-data'
import { clients, orderSteps, rangeProducts, sizeGuide } from '../data/products-page-data'

export function ProductsHero() {
  return (
    <section className="page-hero">
      <div className="hero-grain" aria-hidden="true" />
      <div className="container page-hero-grid">
        <div className="reveal">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Products</span>
          </nav>
          <h1>Our <em>Products</em></h1>
          <p className="page-hero-lead">Solid concrete blocks in 4 inch and 6 inch, fairface blocks, flavour bricks, pavers, blue metal and highway, boundary, furlong, edge and compound wall stones — all cast and cured at our Peraiyur yard.</p>
        </div>
        <nav className="pp-jump reveal" aria-label="Jump to a product">
          <h2>Jump to a product</h2>
          <ol>
            {rangeProducts.map((product, index) => (
              <li key={product.id}>
                <a href={`#${product.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{product.name}</a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  )
}

export function SizeGuide() {
  return (
    <section className="section" id="size-guide">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">Solid block size guide</span>
          <h2>Which size<br /><span>for which wall.</span></h2>
          <p>Straight from our own product card — the two solid block sizes we supply and exactly where each one belongs.</p>
          <p className="pp-guide-tamil" lang="ta">நாங்கள் வழங்கும் சாலிட் பிளாக்ஸ் அளவுகள்</p>
        </div>
        <div className="pp-size-grid">
          {sizeGuide.map((item, index) => (
            <article className={`pp-size reveal${item.featured ? ' pp-size--featured' : ''}`} key={item.label} style={{ transitionDelay: `${index * 80}ms` }}>
              <span className="pp-size-number" aria-hidden="true">{item.size}</span>
              <span className="pp-size-label">{item.label}</span>
              <h3>{item.title}</h3>
              <ul>
                {item.uses.map((use) => (
                  <li key={use.en}>
                    <span><Check size={13} strokeWidth={3} /></span>
                    <div>{use.en}{'ta' in use && use.ta ? <> <em lang="ta">({use.ta})</em></> : null}</div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProductRange() {
  return (
    <section className="section section--paper" id="range">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">Complete range</span>
          <h2>Eleven product lines,<br /><span>one quality standard.</span></h2>
          <p>Walls, pavements, compounds, landscaping and highway works — all cast and cured at our Peraiyur yard.</p>
        </div>
        <div className="pp-grid">
          {rangeProducts.map((product, index) => {
            const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hello JPS Bricks & Blocks, I would like to enquire about ${product.name}.`)}`
            return (
              <article className={`pp-card reveal${index === 0 ? ' pp-card--flagship' : ''}`} id={product.id} key={product.id} style={{ transitionDelay: `${(index % 2) * 70}ms` }}>
                <div className="pp-media">
                  <img src={product.image} alt={product.alt} loading={index < 2 ? 'eager' : 'lazy'} />
                  <span className="pp-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="pp-tag">{product.tag}</span>
                </div>
                <div className="pp-body">
                  <h3>{product.name}</h3>
                  <span className="pp-tamil" lang="ta">{product.tamil}</span>
                  <p>{product.description}</p>
                  <ul className="pp-bullets">
                    {product.bullets.map((bullet) => <li key={bullet}><span><Check size={12} strokeWidth={3} /></span>{bullet}</li>)}
                  </ul>
                  <div className="pp-actions">
                    <a className="button button--red" href={`/contact.html?product=${encodeURIComponent(product.name)}`}>Get quote <ArrowRight size={15} /></a>
                    <a className="button pp-btn-wa" href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function OrderSteps() {
  return (
    <section className="section" id="how-to-order">
      <div className="container">
        <div className="section-heading section-heading--split reveal">
          <div>
            <span className="eyebrow">Ordering & delivery</span>
            <h2>How to place<br /><span>an order.</span></h2>
            <p className="pp-order-note">Three steps. Most enquiries are quoted the same day.</p>
          </div>
          <div className="pp-order-actions">
            <a className="button button--red" href="/contact.html">Enquiry form <ArrowRight size={16} /></a>
            <a className="button pp-btn-wa" href={brand.phoneHref}><Phone size={15} aria-hidden="true" /> Call 63827 27154</a>
          </div>
        </div>
        <ol className="pp-steps">
          {orderSteps.map((step, index) => (
            <li className="pp-step reveal" key={step.title} style={{ transitionDelay: `${index * 80}ms` }}>
              <span className="pp-step-number">0{index + 1}</span>
              <span className="step-kicker">Step 0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Clients() {
  return (
    <section className="section section--paper" id="clients">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">Our clients</span>
          <h2>Trusted by<br /><span>our clients.</span></h2>
          <p>A few of the organisations that have sourced material from JPS Bricks & Blocks.</p>
        </div>
        <ul className="pp-clients">
          {clients.map((client) => (
            <li className="pp-client reveal" key={client.alt}>
              <img src={client.image} alt={client.alt} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
