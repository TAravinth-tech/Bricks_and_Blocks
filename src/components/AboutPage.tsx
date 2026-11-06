import { Check, Droplets, Factory, HeartHandshake, IndianRupee, MapPin, Ruler, ShieldCheck, Truck } from 'lucide-react'

/* ---------- Content ---------- */

const promises = [
  { icon: ShieldCheck, title: 'Solid Quality', description: 'The right mix design, properly compacted. Strength you can rely on for load-bearing masonry.', tamil: 'உறுதியான தரம்' },
  { icon: IndianRupee, title: 'Fair Price', description: 'Direct-from-manufacturer rates, quoted clearly per piece and per load. No hidden loading charges.', tamil: 'நியாயமான விலை' },
  { icon: Ruler, title: 'Accurate Size', description: 'Dimensional tolerance checked batch by batch, so your courses run straight and your joints stay thin.', tamil: 'சரியான அளவு' },
  { icon: Truck, title: 'On-Time Delivery', description: 'Your masons are booked and waiting. We plan dispatch around your schedule, not ours.', tamil: 'சரியான நேரத்தில் விநியோகம்' },
  { icon: Droplets, title: 'Proper Curing', description: 'The full water-curing cycle, every time. It costs us days — and it is why our blocks do not crack on site.', tamil: 'சரியான கியூரிங் மூலம் தர உறுதி' },
  { icon: HeartHandshake, title: 'Customer Satisfaction', description: 'Our stated goal, printed on our own visiting card: the customer’s satisfaction is the target.', tamil: 'வாடிக்கையாளர் திருப்தியே எங்கள் இலக்கு' },
]

const journey = [
  { year: 'Year One', title: 'The yard opens at Kilangulam', text: 'JPS begins casting solid concrete blocks on Kilangulam Main Road, serving individual home builders in and around Peraiyur.' },
  { year: 'Year Two', title: 'Both wall sizes in regular stock', text: '6" (150 mm) and 4" (100 mm) blocks become continuous stock items, letting a builder finish external and partition walls from one supplier.' },
  { year: 'Year Three', title: 'Paving and landscaping added', text: 'Paver blocks and coloured flavour bricks join the range, opening up driveways, walkways and elevation work.' },
  { year: 'Year Four', title: 'Highway and layout products', text: 'Kerb stones, boundary stones, furlong and kilometre stones bring road contractors and layout promoters onto our customer list.' },
  { year: 'Year Five & Onward', title: 'Eleven lines, one standard', text: 'Blue metal supply and compound wall stones complete the range — with the same curing discipline applied to every one of them.' },
]

const commitments = [
  'One quality standard for every order size',
  'Accuracy in dimensions, verified per batch',
  'High strength and long service life',
  'Correct curing before dispatch, without exception',
  'Customer satisfaction as the measure of the job',
]

const locations = [
  { name: 'Peraiyur', note: 'Head yard', head: true },
  { name: 'Madurai', note: 'City & outskirts' },
  { name: 'Thirumangalam', note: 'Regular routes' },
  { name: 'Usilampatti', note: 'Regular routes' },
  { name: 'Kallikudi', note: 'On request' },
  { name: 'Tirumangalam', note: 'On request' },
  { name: 'Sedapatti', note: 'On request' },
  { name: 'Virudhunagar', note: 'Bulk orders' },
]

/* ---------- Sections ---------- */

export function AboutHero() {
  return (
    <section className="page-hero">
      <div className="hero-grain" aria-hidden="true" />
      <div className="container page-hero-grid">
        <div className="reveal">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">About Us</span>
          </nav>
          <h1>Five Years of Experience.<br /><em>Five Years of Trust.</em></h1>
          <p className="page-hero-lead">JPS Bricks & Blocks manufactures solid concrete blocks, fairface blocks, pavers and highway stones at Kilangulam Main Road, Peraiyur, Madurai.</p>
        </div>
        <div className="page-hero-visual reveal">
          <div className="page-hero-photo">
            <img src="/images/signboard-jps.png" alt="JPS Bricks and Blocks signboard with contact numbers 63827 27154 and 78715 99044" fetchPriority="high" />
          </div>
          <div className="trust-badge"><strong>5<span>+</span></strong><small>Years of<br />trust</small></div>
        </div>
      </div>
    </section>
  )
}

export function WhoWeAre() {
  return (
    <section className="section" id="who-we-are">
      <div className="container who-grid">
        <div className="about-copy who-copy reveal">
          <span className="eyebrow">Who we are</span>
          <h2>Five years of experience.<br /><span>Five years of trust.</span></h2>
          <p>JPS Bricks & Blocks is a concrete products manufacturer based at 12/6, Kilangulam Main Road, Peraiyur Taluk, Madurai. For more than five years we have been casting, curing and delivering the material that holds up homes, compound walls, layout roads and factory sheds across the district.</p>
          <p>Five years is long enough to learn what actually matters to a builder. It is not the brochure — it is whether the block is square, whether it arrived on the promised day, and whether the rate you were quoted is the rate on the bill. That is the business we have built, one load at a time.</p>
        </div>
        <aside className="who-panel reveal" aria-label="JPS at a glance">
          <p className="tamil-line" lang="ta">உறுதியான தரம்… வலிமையான நம்பிக்கை… · தரம் எங்கள் அடையாளம்</p>
          <div className="who-mini">
            <span className="who-mini-icon"><Factory size={22} aria-hidden="true" /></span>
            <div><h3>In-House Manufacturing</h3><p>Cast at our own Peraiyur yard</p></div>
          </div>
          <div className="who-mini">
            <span className="who-mini-icon"><Truck size={22} aria-hidden="true" /></span>
            <div><h3>Delivery Available</h3><p lang="ta">டெலிவரி வசதி உண்டு</p></div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export function FivePromises() {
  return (
    <section className="section section--paper" id="promises">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">Five years of trust, built on five promises</span>
          <h2>What every JPS load<br /><span>carries with it.</span></h2>
          <p>These are not marketing lines. They are the five checks a block has to pass before it leaves our yard.</p>
        </div>
        <div className="feature-grid">
          {promises.map(({ icon: Icon, title, description, tamil }, index) => (
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

export function Journey() {
  return (
    <section className="section" id="journey">
      <div className="container journey-grid">
        <div className="journey-intro reveal">
          <div className="section-heading">
            <span className="eyebrow">Our journey</span>
            <h2>How a small casting yard became<br /><span>a district supplier.</span></h2>
            <p>Growth here has been steady rather than sudden — each new product line added only once we could make it properly.</p>
          </div>
          <div className="journey-stats">
            <div className="journey-stat"><strong>450<span>+</span></strong><small>Sites supplied</small></div>
            <div className="journey-stat"><strong>11</strong><small>Product lines</small></div>
          </div>
        </div>
        <ol className="timeline">
          {journey.map((item, index) => (
            <li className="timeline-item reveal" key={item.title} style={{ transitionDelay: `${index * 70}ms` }}>
              <span className="timeline-dot" aria-hidden="true">{index + 1}</span>
              <span className="step-kicker">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Commitment() {
  return (
    <section className="section section--paper" id="commitment">
      <div className="container commit-grid">
        <div className="about-copy reveal">
          <span className="eyebrow">Our commitment</span>
          <h2>Superior quality is the standard,<br /><span>not the upgrade.</span></h2>
          <p>We do not run a premium grade and an economy grade. There is one JPS standard, and every customer — a single-house owner buying 500 blocks or a contractor taking 20 loads — gets material from the same stock, cured the same way.</p>
          <ul className="promise-list">
            {commitments.map((item) => <li key={item}><span><Check size={14} strokeWidth={3} /></span>{item}</li>)}
          </ul>
        </div>
        <div className="commit-gallery reveal">
          <figure className="commit-photo commit-photo--wide">
            <img src="/images/signboard-2.png" alt="JPS Bricks and Blocks visiting card, front" loading="lazy" />
          </figure>
          <figure className="commit-photo">
            <img src="/images/visiting-card-back.png" alt="JPS visiting card showing 6 inch and 4 inch solid block applications" loading="lazy" />
          </figure>
          <figure className="commit-photo">
            <img src="/images/visiting-card-front.png" alt="JPS Bricks and Blocks roadside signboard" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  )
}

export function Delivery() {
  return (
    <section className="section" id="delivery">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">Where we deliver</span>
          <h2>Serving Madurai district<br /><span>and beyond.</span></h2>
          <p>Our own transport arrangement covers Peraiyur and the surrounding towns. Ask us about delivery to your site — we usually can.</p>
        </div>
        <div className="delivery-grid">
          {locations.map((place, index) => (
            <article className={`delivery-card reveal${place.head ? ' delivery-card--head' : ''}`} key={place.name} style={{ transitionDelay: `${(index % 4) * 55}ms` }}>
              <span className="delivery-pin"><MapPin size={19} aria-hidden="true" /></span>
              <div><h3>{place.name}</h3><p>{place.note}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
