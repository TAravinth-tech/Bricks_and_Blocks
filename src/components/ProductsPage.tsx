import { ArrowRight, Check, Phone } from 'lucide-react'
import { brand } from '../data/site-data'
import { clients, orderSteps, rangeProducts, sizeGuide } from '../data/products-page-data'


import { useRef, type CSSProperties, type PointerEvent } from 'react'


/* =========================================================
   ProductsHero — "laid, cast, levelled"

   One orchestrated sequence, told in the language of a block yard:

   1. A wall is LAID behind the hero, course by course from the
      bottom, bricks sliding in from alternating sides in running
      bond. Each brick flashes gold as the mortar "sets".
   2. The title is CAST: every letter drops from above like a
      block, lands with a squash, and puffs a little dust. It
      starts gold and cools to its final colour.
   3. The lead paragraph rises in word by word.
   4. A SPIRIT LEVEL under the title: its bubble swings, settles
      and centres. (Level, plumb and true.)
   5. The product list is STACKED: items drop onto the pile from
      the bottom up, like pallets.

   After the intro, the wall is alive: a gold light follows the
   pointer and lights the bricks under it, and the wall drifts
   slightly against the cursor for depth.

   Safe by design
   - The normal state is the FINISHED state. All motion lives in
     a `prefers-reduced-motion: no-preference` block, so with
     reduced motion nothing animates.
   ========================================================= */

const COURSES = 20 // rows of bricks (more than any screen needs)
const PER = 12 // bricks per row (one extra is added for the running bond)

const LEAD =
  'Solid concrete blocks in 4 inch and 6 inch, fairface blocks, flavour bricks, pavers, blue metal and highway, boundary, furlong, edge and compound wall stones — all cast and cured at our Peraiyur yard.'

const v = (o: Record<string, string | number>) => o as CSSProperties

function Wall({ glow = false }: { glow?: boolean }) {
  return (
    <div className={`ph-wall${glow ? ' is-glow' : ''}`} aria-hidden="true">
      {Array.from({ length: COURSES }, (_, c) => {
        const odd = c % 2 === 1
        return (
          <div className="ph-row" data-odd={odd ? 1 : 0} key={c} style={v({ '--c': Math.min(c, 13) })}>
            {Array.from({ length: PER + 1 }, (_, b) => (
              <i className="ph-b" key={b} style={v({ '--b': odd ? PER - b : b })} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function Letters({ text, from }: { text: string; from: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span className="ph-l" key={i} style={v({ '--d': from + i, '--r': `${(((from + i) * 37) % 5 - 2) * 7}deg` })}>
          {ch}
        </span>
      ))}
    </>
  )
}

export function ProductsHero() {
  const rootRef = useRef<HTMLElement>(null)

  // pointer lights the bricks under it and nudges the wall for depth
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = rootRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x + 24}px`) // +24: the wall extends 24px past the hero
    el.style.setProperty('--my', `${y + 24}px`)
    el.style.setProperty('--px', (x / r.width - 0.5).toFixed(3))
    el.style.setProperty('--py', (y / r.height - 0.5).toFixed(3))
  }

  const n = rangeProducts.length

  return (
    <section className="page-hero ph" ref={rootRef} onPointerMove={onMove}>
      <style>{heroCss}</style>
      <div className="ph-walls" aria-hidden="true">
        <Wall />
        <Wall glow />
      </div>
      <div className="hero-grain" aria-hidden="true" />

      <div className="container page-hero-grid">
        <div>
          <nav className="breadcrumb ph-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Products</span>
          </nav>

          <h1 aria-label="Our Products">
            <span aria-hidden="true">
              <span className="ph-w">
                <Letters text="Our" from={0} />
              </span>{' '}
              <em className="ph-w">
                <Letters text="Products" from={3} />
              </em>
            </span>
          </h1>

          <div className="ph-level" aria-hidden="true">
            <i className="ph-bubble" />
          </div>

          <p className="page-hero-lead">
            {LEAD.split(' ').map((w, i) => (
              <span key={i}>
                <span className="ph-wd" style={v({ '--w': i })}>
                  {w}
                </span>{' '}
              </span>
            ))}
          </p>
        </div>

        <nav className="pp-jump ph-jump" aria-label="Jump to a product">
          <h2>Jump to a product</h2>
          <ol>
            {rangeProducts.map((product, index) => (
              <li key={product.id} style={v({ '--j': n - 1 - index })}>
                <a href={`#${product.id}`}>
                  <span className="ph-num">{String(index + 1).padStart(2, '0')}</span>
                  <b>{product.name}</b>
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  )
}

const heroCss = `
.page-hero.ph {
  --navy: var(--brand-navy, #0a1c40);
  --gold: var(--brand-gold, #ffc400);
  --bh: 56px;
  position: relative;
  overflow: hidden;
  color: #fff;
  background: radial-gradient(1100px 520px at 12% 0%, #17336a, var(--navy) 66%);
}
.ph .container { position: relative; z-index: 2; }
.ph .hero-grain { z-index: 1; }

/* ---------- the wall ---------- */
.ph-walls {
  position: absolute;
  inset: -24px;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  translate: calc(var(--px, 0) * -14px) calc(var(--py, 0) * -10px);
  transition: translate 0.5s ease-out;
}
.ph-wall { position: absolute; inset: 0; display: flex; flex-direction: column-reverse; gap: 6px; }
.ph-row { display: flex; flex: none; gap: 6px; width: calc(100% + 100% / ${PER}); height: var(--bh); }
.ph-row[data-odd="1"] { margin-left: calc(-100% / ${PER * 2}); }
.ph-b {
  flex: 1 1 0;
  border-radius: 4px;
  background: rgb(255 255 255 / 5%);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 8%);
}
.ph-b:nth-child(5n + 2) { background: rgb(255 255 255 / 8%); }
.ph-b:nth-child(11n + 4) { background: rgb(255 196 0 / 14%); }

/* gold layer: only visible under the pointer */
.ph-wall.is-glow .ph-b { background: rgb(255 196 0 / 26%); box-shadow: inset 0 0 0 1px rgb(255 196 0 / 80%); }
.ph-wall.is-glow {
  -webkit-mask-image: radial-gradient(circle 200px at var(--mx, 74%) var(--my, 30%), #000 0, transparent 100%);
  mask-image: radial-gradient(circle 200px at var(--mx, 74%) var(--my, 30%), #000 0, transparent 100%);
}

/* ---------- text colours ---------- */
.ph h1, .ph h2 { color: #fff; }
.ph .breadcrumb, .ph .breadcrumb a { color: rgb(255 255 255 / 72%); }
.ph .breadcrumb [aria-current] { color: #fff; }
.ph .page-hero-lead { color: rgb(255 255 255 / 84%); }
.ph h1 em { font-style: normal; color: var(--gold); }

/* ---------- title letters ---------- */
.ph-w { display: inline-block; white-space: nowrap; }
.ph-l { --ink: #fff; position: relative; display: inline-block; color: var(--ink); transform-origin: 50% 100%; }
.ph h1 em .ph-l { --ink: var(--gold); }
.ph-l::after {
  content: "";
  position: absolute;
  right: 8%;
  bottom: 0.04em;
  left: 8%;
  height: 0.07em;
  border-radius: 50%;
  background: rgb(255 255 255 / 55%);
  opacity: 0;
  pointer-events: none;
}
.ph-wd { display: inline-block; }

/* ---------- spirit level ---------- */
.ph-level {
  position: relative;
  width: min(300px, 80%);
  height: 24px;
  margin: 18px 0 20px;
  border-radius: 14px;
  border: 1px solid rgb(255 255 255 / 28%);
  background: linear-gradient(rgb(255 255 255 / 14%), rgb(255 255 255 / 4%));
}
.ph-level::before, .ph-level::after { content: ""; position: absolute; top: 4px; bottom: 4px; width: 1px; background: rgb(255 255 255 / 45%); }
.ph-level::before { left: calc(50% - 26px); }
.ph-level::after { left: calc(50% + 26px); }
.ph-bubble {
  position: absolute;
  top: 3px;
  left: 50%;
  width: 42px;
  height: 16px;
  margin-left: -21px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 40% 30%, #fff 0, var(--gold) 45%, #d99a00);
  box-shadow: 0 0 12px rgb(255 196 0 / 55%);
}

/* ---------- product list ---------- */
.ph-jump {
  padding: clamp(16px, 2.4vw, 26px);
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 20px;
  background: rgb(255 255 255 / 6%);
  backdrop-filter: blur(6px);
}
.ph-jump h2 { margin: 0 0 12px; font-size: 1.05rem; }
.ph-jump ol { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 8px; margin: 0; padding: 0; list-style: none; }
.ph-jump li { margin: 0; padding: 0; transform-origin: 50% 100%; }
.ph-jump a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.25s, translate 0.25s;
}
.ph-jump a b { flex: 1; min-width: 0; font-weight: 600; font-size: 0.92rem; }
.ph-jump a svg { flex: none; opacity: 0; translate: -6px 0; transition: opacity 0.25s, translate 0.25s; }
.ph-num {
  display: grid;
  flex: none;
  place-items: center;
  min-width: 34px;
  height: 30px;
  border-radius: 6px;
  background: var(--gold);
  box-shadow: 0 3px 0 rgb(0 0 0 / 28%);
  color: var(--navy);
  font: 800 0.78rem/1 var(--font-heading, inherit);
  transition: translate 0.25s, rotate 0.25s;
}
.ph-jump a:hover, .ph-jump a:focus-visible { background: rgb(255 196 0 / 18%); translate: 4px 0; outline: none; }
.ph-jump a:focus-visible { box-shadow: 0 0 0 2px var(--gold); }
.ph-jump a:hover .ph-num, .ph-jump a:focus-visible .ph-num { translate: 0 -3px; rotate: -6deg; }
.ph-jump a:hover svg, .ph-jump a:focus-visible svg { opacity: 1; translate: 0 0; }

@media (max-width: 560px) {
  .ph-jump ol { grid-template-columns: minmax(0, 1fr); }
  .page-hero.ph { --bh: 44px; }
}

/* =========================================================
   MOTION: only when the visitor has not asked for reduced
   motion. Without it, everything above is the finished state.
   ========================================================= */
@media (prefers-reduced-motion: no-preference) {
  /* 1. the wall is laid, course by course, then each brick's mortar "sets" */
  .ph-b { animation: ph-lay 0.6s cubic-bezier(0.2, 0.85, 0.25, 1) calc(var(--c) * 95ms + var(--b) * 16ms) both; }
  .ph-wall:not(.is-glow) .ph-b {
    animation:
      ph-lay 0.6s cubic-bezier(0.2, 0.85, 0.25, 1) calc(var(--c) * 95ms + var(--b) * 16ms) both,
      ph-flash 1.1s ease-out calc(var(--c) * 95ms + var(--b) * 16ms + 0.5s) backwards;
  }
  .ph-row[data-odd="0"] .ph-b { --dir: -1; }
  .ph-row[data-odd="1"] .ph-b { --dir: 1; }

  /* 2. the title is cast */
  .ph-l { animation: ph-drop 0.95s linear calc(0.55s + var(--d) * 75ms) both; }
  .ph-l::after { animation: ph-dust 0.55s ease-out calc(0.55s + var(--d) * 75ms + 0.5s) both; }

  /* breadcrumb */
  .ph-crumb { animation: ph-fade 0.6s ease-out 0.15s both; }

  /* 3. lead, word by word */
  .ph-wd { animation: ph-word 0.6s ease-out calc(1.25s + var(--w) * 22ms) both; }

  /* 4. spirit level */
  .ph-level { animation: ph-fade 0.6s ease-out 1.3s both; }
  .ph-bubble { animation: ph-swing 3s ease-in-out 1.7s both; }

  /* 5. the product list is stacked from the bottom up */
  .ph-jump { animation: ph-panel 0.8s ease-out 0.6s both; }
  .ph-jump li { animation: ph-stack 0.75s linear calc(1s + var(--j) * 70ms) both; }
}

@keyframes ph-lay {
  from { opacity: 0; translate: calc(var(--dir, -1) * 90px) 12px; scale: 0.96; }
  to { opacity: 1; translate: 0 0; scale: 1; }
}
@keyframes ph-flash {
  from { background-color: rgb(255 196 0 / 62%); box-shadow: inset 0 0 0 1px rgb(255 196 0 / 95%); }
}
@keyframes ph-drop {
  0% { opacity: 0; translate: 0 -1.5em; rotate: var(--r); color: var(--gold); scale: 1 1; animation-timing-function: cubic-bezier(0.55, 0, 1, 0.6); }
  50% { opacity: 1; translate: 0 0; rotate: 0deg; scale: 1 1; animation-timing-function: ease-out; }
  62% { scale: 1.14 0.8; }
  78% { scale: 0.97 1.06; }
  100% { scale: 1 1; color: var(--ink); }
}
@keyframes ph-dust {
  0% { opacity: 0.75; scale: 0.3 1; translate: 0 0; }
  100% { opacity: 0; scale: 1.9 0.6; translate: 0 4px; }
}
@keyframes ph-fade { from { opacity: 0; translate: 0 -10px; } }
@keyframes ph-word { from { opacity: 0; translate: 0 0.7em; filter: blur(4px); } }
@keyframes ph-swing {
  0% { translate: -125px 0; }
  22% { translate: 82px 0; }
  42% { translate: -50px 0; }
  60% { translate: 28px 0; }
  78% { translate: -12px 0; }
  90% { translate: 4px 0; }
  100% { translate: 0 0; }
}
@keyframes ph-panel { from { opacity: 0; translate: 0 22px; scale: 0.97; } }
@keyframes ph-stack {
  0% { opacity: 0; translate: 0 -64px; }
  55% { opacity: 1; translate: 0 0; scale: 1.03 0.92; }
  78% { scale: 0.99 1.03; }
  100% { translate: 0 0; scale: 1 1; }
}
`
























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



















































import { useEffect, useState } from 'react'


/* =========================================================
   ProductRange — "demoulded, inspected, tagged"

   Every product card goes through the yard, once, when you
   scroll to it:

   1. DEMOULD. The product photo is hidden behind two steel
      formwork shutters. They rattle (latches letting go), then
      slide apart, and the photo settles from a soft, enlarged
      state into focus.
   2. The product number is STAMPED onto the photo.
   3. The category tag HANGS and swings like a pallet tag,
      settling to rest.
   4. A QUALITY SEAL ("Cast & cured · Peraiyur yard") is stamped
      in the corner: ring draws, thud, tick draws.
   5. The text is written in: title wipes on, description
      rises, each bullet's tick draws itself, then the buttons.
      The arrow on "Get quote" nudges you twice.

   Above the grid, a row of small blocks, one per product, lights
   gold as you work through the range (click one to jump to it).

   After that, the photo reacts to the pointer: a light sheen
   follows it and the picture drifts against it for depth.

   Safe by design
   - Your existing card classes and layout are untouched. This
     only layers motion on top.
   - The normal state is the FINISHED state. Nothing is hidden
     until JS arms the section, and never with reduced motion.
   ========================================================= */

const v2 = (o: Record<string, string | number>) => o as CSSProperties

export function ProductRange() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [seen, setSeen] = useState<boolean[]>(() => rangeProducts.map(() => false))

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setArmed(true)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = Number((e.target as HTMLElement).dataset.i)
          setSeen((s) => (s[i] ? s : s.map((x, k) => k === i || x)))
          io.unobserve(e.target)
        })
      },
      { threshold: 0.3, rootMargin: '0px 0px -8% 0px' },
    )
    grid.querySelectorAll('[data-i]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
    el.style.setProperty('--px', (x - 0.5).toFixed(3))
    el.style.setProperty('--py', (y - 0.5).toFixed(3))
  }
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--px', '0')
    e.currentTarget.style.setProperty('--py', '0')
  }

  return (
    <section className={`section section--paper pr${armed ? ' is-armed' : ''}`} id="range">
      <style>{rangeCss}</style>
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <span className="eyebrow">Complete range</span>
          <h2>
            Eleven product lines,
            <br />
            <span>one quality standard.</span>
          </h2>
          <p>Walls, pavements, compounds, landscaping and highway works — all cast and cured at our Peraiyur yard.</p>
        </div>

        {/* one block per product, lit as you work through the range */}
        <ol className="pr-pips" aria-label="Products">
          {rangeProducts.map((product, index) => (
            <li key={product.id}>
              <a
                href={`#${product.id}`}
                className={`pr-pip${!armed || seen[index] ? ' is-on' : ''}`}
                title={product.name}
                aria-label={product.name}
              />
            </li>
          ))}
        </ol>

        <div className="pp-grid" ref={gridRef}>
          {rangeProducts.map((product, index) => {
            const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hello JPS Bricks & Blocks, I would like to enquire about ${product.name}.`)}`
            return (
              <article
                className={`pp-card pr-card${index === 0 ? ' pp-card--flagship' : ''}${seen[index] ? ' is-in' : ''}`}
                id={product.id}
                key={product.id}
                data-i={index}
                style={v2({ '--base': `${(index % 2) * 140}ms` })}
              >
                <div
                  className={`pp-media ${product.name === 'Kilometre Stone' ? 'pp-media--kilometre' : ''}`}
                  onPointerMove={onMove}
                  onPointerLeave={onLeave}
                >
                  <img src={product.image} alt={product.alt} loading={index < 2 ? 'eager' : 'lazy'} />
                  <i className="pr-sheen" aria-hidden="true" />
                  <span className="pp-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="pp-tag">{product.tag}</span>

                  {/* quality seal */}
                  <span className="pr-seal" aria-hidden="true">
                    <svg viewBox="0 0 100 100">
                      <defs>
                        <path id={`seal-${product.id}`} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                      </defs>
                      <circle className="pr-seal-bg" cx="50" cy="50" r="48" />
                      <circle className="pr-seal-ring" cx="50" cy="50" r="43" pathLength="1" />
                      <text>
                        <textPath href={`#seal-${product.id}`} textLength="222" lengthAdjust="spacing">
                          CAST &amp; CURED · PERAIYUR YARD ·
                        </textPath>
                      </text>
                      <path className="pr-seal-tick" d="M36 51l10 10 18-21" pathLength="1" />
                    </svg>
                  </span>

                  {/* formwork shutters */}
                  <i className="pr-shut pr-shut--l" aria-hidden="true" />
                  <i className="pr-shut pr-shut--r" aria-hidden="true" />
                </div>

                <div className="pp-body">
                  <h3>{product.name}</h3>
                  <span className="pp-tamil" lang="ta">
                    {product.tamil}
                  </span>
                  <p>{product.description}</p>
                  <ul className="pp-bullets">
                    {product.bullets.map((bullet, b) => (
                      <li key={bullet} style={v2({ '--b': b })}>
                        <span>
                          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                            <path
                              className="pr-tick"
                              pathLength="1"
                              d="M3 8.6l3.2 3.2L13 4.8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="pp-actions">
                    <a className="button button--red" href={`/contact.html?product=${encodeURIComponent(product.name)}`}>
                      Get quote <ArrowRight size={15} />
                    </a>
                    <a className="button pp-btn-wa" href={whatsappHref} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
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

const rangeCss = `
.pr {
  --navy: var(--brand-navy, #0a1c40);
  --gold: var(--brand-gold, #ffc400);
}

/* ---------- progress blocks ---------- */
.pr-pips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin: 26px 0 34px; padding: 0; list-style: none; }
.pr-pips li { margin: 0; padding: 0; }
.pr-pip {
  display: block;
  width: 30px;
  height: 16px;
  border-radius: 3px;
  background: rgb(8 21 47 / 14%);
  box-shadow: 0 3px 0 rgb(8 21 47 / 10%);
  transition: background 0.4s, box-shadow 0.4s, translate 0.25s;
}
.pr-pip.is-on { background: var(--gold); box-shadow: 0 3px 0 rgb(8 21 47 / 28%); }
.pr-pip:hover, .pr-pip:focus-visible { translate: 0 -3px; outline: none; }
.pr-pip:focus-visible { box-shadow: 0 0 0 2px var(--navy); }

/* ---------- media layer ---------- */
.pr .pp-media { position: relative; overflow: hidden; }
.pr .pp-media img { scale: 1.06; translate: calc(var(--px, 0) * -8px) calc(var(--py, 0) * -6px); transition: transform 0.6s ease, translate 0.25s ease-out; }
.pr-sheen {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 24%), transparent 55%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.pr .pp-media:hover .pr-sheen { opacity: 1; }

/* formwork shutters: steel planks with bolts */
.pr-shut { display: none; position: absolute; top: 0; bottom: 0; z-index: 5; width: 50.6%; pointer-events: none; }
.pr.is-armed .pr-shut { display: block; }
.pr-shut {
  background:
    repeating-linear-gradient(0deg, #0f2755 0 26px, #0a1c40 26px 28px);
}
.pr-shut::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 18px;
  background: radial-gradient(circle at 50% 50%, var(--gold) 0 3px, transparent 4px) 0 0 / 18px 56px repeat-y;
}
.pr-shut--l { left: 0; border-right: 3px solid var(--gold); }
.pr-shut--l::before { right: 4px; }
.pr-shut--r { right: 0; border-left: 3px solid var(--gold); }
.pr-shut--r::before { left: 4px; }

/* quality seal */
.pr-seal { position: absolute; right: var(--pr-seal-right, 12px); bottom: var(--pr-seal-bottom, 12px); z-index: 4; width: 84px; height: 84px; rotate: -14deg; pointer-events: none; }
.pr-seal::after { content: ""; position: absolute; inset: 0; border: 2px solid var(--gold); border-radius: 50%; opacity: 0; }
.pr-seal svg { width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 4px 8px rgb(0 0 0 / 35%)); }
.pr-seal-bg { fill: rgb(10 28 64 / 82%); }
.pr-seal-ring { fill: none; stroke: var(--gold); stroke-width: 2; stroke-dasharray: 1; stroke-dashoffset: 0; transform: rotate(-90deg); transform-origin: 50% 50%; }
.pr-seal text { fill: #fff; font: 700 8.2px/1 var(--font-heading, inherit); }
.pr-seal-tick { fill: none; stroke: var(--gold); stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
.pr .pp-tag { transform-origin: 50% 0; }
.pr-tick { stroke-dasharray: 1; stroke-dashoffset: 0; }

/* ---------- armed: before a card is reached ---------- */
.pr.is-armed .pr-card:not(.is-in) .pp-media img { scale: 1.22; filter: blur(5px); }
.pr.is-armed .pr-card:not(.is-in) .pp-number,
.pr.is-armed .pr-card:not(.is-in) .pp-tag,
.pr.is-armed .pr-card:not(.is-in) .pr-seal,
.pr.is-armed .pr-card:not(.is-in) .pp-tamil,
.pr.is-armed .pr-card:not(.is-in) .pp-body p,
.pr.is-armed .pr-card:not(.is-in) .pp-bullets li,
.pr.is-armed .pr-card:not(.is-in) .pp-actions { opacity: 0; }
.pr.is-armed .pr-card:not(.is-in) .pp-body h3 { clip-path: inset(-0.2em 100% -0.2em 0); }

/* =========================================================
   MOTION (never with reduced motion)
   ========================================================= */
@media (prefers-reduced-motion: no-preference) {
  .pr.is-armed .pr-card.is-in .pr-shut--l { animation: pr-open-l 0.15s cubic-bezier(0.65, 0, 0.25, 1) calc(var(--base) + 0.1s) both; }
  .pr.is-armed .pr-card.is-in .pr-shut--r { animation: pr-open-r 0.15s cubic-bezier(0.65, 0, 0.25, 1) calc(var(--base) + 0.1s) both; }
  .pr.is-armed .pr-card.is-in .pp-media img { animation: pr-settle 1.5s ease-out calc(var(--base) + 0.2s) both; }
  .pr.is-armed .pr-card.is-in .pp-number { animation: pr-stamp 0.6s cubic-bezier(0.3, 1.2, 0.5, 1) calc(var(--base) + 0.95s) both; }
  .pr.is-armed .pr-card.is-in .pp-tag { animation: pr-swing 1.9s ease-in-out calc(var(--base) + 1.1s) both; }

  .pr.is-armed .pr-card.is-in .pr-seal { animation: pr-seal 0.65s cubic-bezier(0.3, 1.3, 0.5, 1) calc(var(--base) + 1.35s) both; }
  .pr.is-armed .pr-card.is-in .pr-seal::after { animation: pr-ping 0.9s ease-out calc(var(--base) + 1.5s) both; }
  .pr.is-armed .pr-card.is-in .pr-seal-ring { animation: pr-draw 0.8s ease-out calc(var(--base) + 1.45s) both; }
  .pr.is-armed .pr-card.is-in .pr-seal-tick { animation: pr-draw 0.45s ease-out calc(var(--base) + 1.95s) both; }

  .pr.is-armed .pr-card.is-in .pp-body h3 { animation: pr-wipe 0.7s ease-out calc(var(--base) + 0.7s) both; }
  .pr.is-armed .pr-card.is-in .pp-tamil { animation: pr-up 0.5s ease-out calc(var(--base) + 0.95s) both; }
  .pr.is-armed .pr-card.is-in .pp-body p { animation: pr-up 0.6s ease-out calc(var(--base) + 1.05s) both; }
  .pr.is-armed .pr-card.is-in .pp-bullets li { animation: pr-up 0.45s ease-out calc(var(--base) + 1.2s + var(--b) * 110ms) both; }
  .pr.is-armed .pr-card.is-in .pr-tick { animation: pr-draw 0.35s ease-out calc(var(--base) + 1.35s + var(--b) * 110ms) both; }
  .pr.is-armed .pr-card.is-in .pp-actions { animation: pr-up 0.6s ease-out calc(var(--base) + 1.6s) both; }
  .pr.is-armed .pr-card.is-in .button--red svg { animation: pr-nudge 1s ease-in-out calc(var(--base) + 2.1s) 2; }

  .pr.is-armed .pr-pip.is-on { animation: pr-pop 0.6s cubic-bezier(0.3, 1.8, 0.5, 1); }
}

@keyframes pr-open-l {
  0% { translate: 0 0; }
  12% { translate: -5px 0; }
  24% { translate: 3px 0; }
  36% { translate: 0 0; }
  100% { translate: -102% 0; }
}
@keyframes pr-open-r {
  0% { translate: 0 0; }
  12% { translate: 5px 0; }
  24% { translate: -3px 0; }
  36% { translate: 0 0; }
  100% { translate: 102% 0; }
}
@keyframes pr-settle { from { scale: 1.22; filter: blur(5px); } to { scale: 1.06; filter: blur(0); } }
@keyframes pr-stamp {
  0% { opacity: 0; scale: 1.7; rotate: -8deg; }
  60% { opacity: 1; scale: 0.94; rotate: 1deg; }
  80% { scale: 1.04; }
  100% { opacity: 1; scale: 1; rotate: 0deg; }
}
@keyframes pr-swing {
  0% { opacity: 0; rotate: 24deg; }
  8% { opacity: 1; }
  25% { rotate: -14deg; }
  45% { rotate: 9deg; }
  62% { rotate: -5deg; }
  80% { rotate: 2deg; }
  100% { opacity: 1; rotate: 0deg; }
}
@keyframes pr-seal {
  0% { opacity: 0; scale: 2.4; rotate: -40deg; }
  60% { opacity: 1; scale: 0.92; rotate: -12deg; }
  80% { scale: 1.04; }
  100% { opacity: 1; scale: 1; rotate: -14deg; }
}
@keyframes pr-ping { from { opacity: 0.9; scale: 1; } to { opacity: 0; scale: 1.6; } }
@keyframes pr-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes pr-wipe { from { clip-path: inset(-0.2em 100% -0.2em 0); } to { clip-path: inset(-0.2em -0.2em -0.2em -0.2em); } }
@keyframes pr-up { from { opacity: 0; translate: 0 14px; } to { opacity: 1; translate: 0 0; } }
@keyframes pr-nudge { 0%, 100% { translate: 0 0; } 50% { translate: 6px 0; } }
@keyframes pr-pop { 0% { scale: 1; } 40% { scale: 1.5 1.8; } 100% { scale: 1; } }
`











































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
