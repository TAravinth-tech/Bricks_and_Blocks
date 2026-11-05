import { ArrowRight, Check } from 'lucide-react'
import { brand, products } from '../data/site-data'

export function About() {
  const promises = [
    'In-house manufacturing at Peraiyur, Madurai district',
    'Accuracy in dimensions on every casting batch',
    'Full curing cycle before a single block is dispatched',
    'Fair, transparent pricing per piece and per load',
  ]

  return (
    <section className="section about-section" id="about">
      <div className="container about-grid">
        <div className="about-gallery reveal">
          <div className="about-image about-image--main">
            <img src="/images/brick-yard.png" alt="A clean JPS-style block casting and storage yard" loading="lazy" />
            <span className="image-caption">Cast with care. Cured completely.</span>
          </div>
          <div className="about-image about-image--detail">
            <img src="/images/concrete-blocks.png" alt="Fairface concrete blocks with consistent edges and texture" loading="lazy" />
          </div>
          <div className="trust-badge"><strong>5<span>+</span></strong><small>years of<br />earned trust</small></div>
          <div className="gallery-scribble" aria-hidden="true">JPS / 01</div>
        </div>
        <div className="about-copy reveal">
          <span className="eyebrow">About JPS Bricks & Blocks</span>
          <h2>Five years of experience.<br /><span>Five years of trust.</span></h2>
          <p>What began as a small block-casting yard on Kilangulam Main Road has grown into one of Peraiyur’s dependable names in construction materials. Over five years we have supplied individual home builders, contractors, promoters and highway works — and kept the same discipline throughout: get the mix right, cure it fully, measure it twice.</p>
          <p>We manufacture in-house, which means you deal directly with the people who cast the block. No middleman markup, no substituted material, no surprises on the lorry.</p>
          <ul className="promise-list">
            {promises.map((item) => <li key={item}><span><Check size={14} strokeWidth={3} /></span>{item}</li>)}
          </ul>
          <a className="button button--red" href={brand.phoneHref}>Call 63827 27154 <ArrowRight size={16} /></a>
        </div>
      </div>
    </section>
  )
}

export function Products() {
  return (
    <section className="section products-section" id="products">
      <div className="container">
        <div className="section-heading section-heading--split reveal">
          <div><span className="eyebrow">Our product range</span><h2>Bricks, blocks & stones —<br /><span>cast to spec.</span></h2></div>
          <div className="product-heading-aside"><p>Eleven product lines covering walls, pavements, compounds and highway works.</p><a className="text-link" href="#contact">Ask about availability <ArrowRight size={15} /></a></div>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className={`product-card reveal${index > 5 ? ' product-card--compact' : ''}`} key={product.name} style={{ transitionDelay: `${(index % 3) * 55}ms` }}>
              <div className="product-image">
                <img src={product.image} alt={product.imageAlt} loading="lazy" />
                <span className="product-number">{String(index + 1).padStart(2, '0')}</span>
                {product.badge && <span className="product-ribbon">{product.badge}</span>}
              </div>
              <div className="product-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {index < 6 && <ul>{product.bullets.map((bullet) => <li key={bullet}><span aria-hidden="true">—</span>{bullet}</li>)}</ul>}
                <a className="product-enquire" href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hello JPS Bricks & Blocks, I would like to enquire about ${product.name}.`)}`} target="_blank" rel="noreferrer">
                  Enquire about this <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
