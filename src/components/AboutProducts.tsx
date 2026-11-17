import { ArrowRight, Check } from 'lucide-react'
import { brand, products } from '../data/site-data'
import { useEffect, useRef, type CSSProperties } from 'react'


/* =========================================================
   About — "the wall flips open, the stamp lands"

   SAME placement, classes and looks as before.
   Only the animations are new.

   >>> SPEED DIAL <<<
   AB_SPEED below speeds up EVERYTHING in this section at once:
   every delay and every duration, in the JS and in the CSS.
     1    = original speed
     1.8  = fast (current)
     2.5  = very fast
   Bigger number = faster.

   GALLERY
   - Each photo is covered by a brick wall (running bond). When the
     gallery scrolls in, the bricks FLIP like shutters in a ripple
     that starts at the middle of the wall and spreads outward
     (even rows tip one way, odd rows the other).
   - The photos settle from a zoom and then drift gently with
     scroll (no more endless Ken Burns, no mouse movement).
   - The caption wipes up from the bottom.
   - The trust badge lands like a rubber stamp (big and blurry,
     shrinking down onto the page), counts 0 -> 5, then throws a
     few brick chips with gravity and a dashed ring breathes.
   - A little brick pyramid is LAID: bricks slide in from the
     sides, row by row.
   - "JPS / 01" flips in letter by letter like a split-flap board.

   COPY
   - Headline words are wiped in left to right, like paint.
   - The gold-red bar grows out from the centre.
   - Paragraphs pull into focus (blur -> sharp), no movement.
   - Each promise is wiped in, its tick circle spins and the tick
     is drawn, then a faint gold rule draws underneath.
   - The vertical brick gauge now has a glowing "head" brick.
   - The call button pops in, then gives a soft ring pulse and
     its arrow nudges, to invite a tap.

   Safe by design
   - Everything is hidden ONLY after JS adds "ab-armed", so if the
     script fails nothing stays invisible.
   - Reveal is decided by a scroll/resize check (getBoundingClientRect),
     no IntersectionObserver.
   - Uses keyframe animations with --d delays and individual
     transform properties where possible, so it does not fight your
     existing CSS or hover transforms.
   - Respects prefers-reduced-motion (final state, no movement).
   ========================================================= */

const AB_SPEED = 5.5

/* a time in ms, sped up by the dial */
const ms = (n: number) => Math.round(n / AB_SPEED)

/* rewrites every "0.8s" / "300ms" in the CSS below, so the stylesheet follows the same dial */
const speedUp = (css: string) =>
  css.replace(/([\s(,+])(\d*\.?\d+)(ms|s)(?![\w-])/g, (_m, pre: string, num: string, unit: string) => {
    const base = parseFloat(num) * (unit === 's' ? 1000 : 1)
    return `${pre}${Math.round(base / AB_SPEED)}ms`
  })

const dly = (t: number) => ({ ['--d' as string]: `${ms(t)}ms` }) as CSSProperties

/* ---------- brick wall that covers a photo and then flips away ---------- */
function AbWall({ cols, rows, seed, base = 0 }: { cols: number; rows: number; seed: number; base?: number }) {
  const rand = (n: number) => {
    const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453
    return x - Math.floor(x)
  }
  const cy = (rows - 1) / 2
  return (
    <div className="ab-wall" aria-hidden="true" style={{ ['--cols' as string]: cols } as CSSProperties}>
      {Array.from({ length: rows }).map((_, r) => (
        <div className={`ab-row${r % 2 ? ' is-odd' : ''}`} key={r}>
          {Array.from({ length: cols + 1 }).map((__, c) => {
            const k = r * (cols + 1) + c
            const tone = rand(k + 1) < 0.07 ? 3 : rand(k + 2) < 0.3 ? 2 : k % 2
            // distance from the middle of the wall -> ripple spreads outward
            const dist = Math.hypot(c - cols / 2 + (r % 2 ? -0.5 : 0), (r - cy) * 1.2)
            return (
              <i
                key={c}
                className={`ab-cell t${tone}`}
                style={{ ['--d' as string]: `${ms(base + dist * 110 + rand(k) * 90)}ms` } as CSSProperties}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ---------- text helpers ---------- */
function AbLetters({ text, base }: { text: string; base: number }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <i className="ab-ch" style={dly(base + i * 80)} key={i}>
          {ch === ' ' ? '\u00A0' : ch}
        </i>
      ))}
    </>
  )
}
function AbWords({ text, base }: { text: string; base: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <i className="ab-mask" key={w + i}>
          <i className="ab-word" style={dly(base + i * 140)}>
            {w}
          </i>
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </i>
      ))}
    </>
  )
}

/* chips thrown by the badge (fixed values, so no randomness on render) */
const chips = Array.from({ length: 10 }).map((_, i) => {
  const a = (i / 10) * Math.PI * 2 + 0.3
  const r = 62 + (i % 3) * 12
  return {
    x: Math.round(Math.cos(a) * r),
    y: Math.round(Math.sin(a) * r * 0.8 - 24),
    rot: (i % 2 ? 1 : -1) * (120 + i * 25),
  }
})

export function About() {
  const promises = [
    'In-house manufacturing at Peraiyur, Madurai district',
    'Accuracy in dimensions on every casting batch',
    'Full curing cycle before a single block is dispatched',
    'Fair, transparent pricing per piece and per load',
  ]

  const rootRef = useRef<HTMLElement>(null)
  const countRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const gallery = root.querySelector<HTMLElement>('.ab-g')
    const copy = root.querySelector<HTMLElement>('.ab-c')
    if (!gallery || !copy) return
    const bricks = Array.from(root.querySelectorAll<HTMLElement>('.ab-bar i'))
    const countEl = countRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    root.classList.add('ab-armed')

    if (reduce) {
      root.classList.add('ab-static')
      gallery.classList.add('is-in', 'is-done')
      copy.classList.add('is-in')
      if (countEl) countEl.textContent = '5'
      bricks.forEach((b) => b.classList.add('is-on'))
      return
    }

    const timers: number[] = []
    let cRaf = 0
    let gIn = false
    let cIn = false

    const runCount = () => {
      if (!countEl) return
      const t0 = performance.now() + ms(1600) // after the stamp has landed
      const dur = ms(1000)
      const tick = (now: number) => {
        const t = Math.min(Math.max((now - t0) / dur, 0), 1)
        countEl.textContent = String(Math.round(5 * (1 - Math.pow(1 - t, 3))))
        if (t < 1) cRaf = requestAnimationFrame(tick)
        else gallery.classList.add('is-done')
      }
      cRaf = requestAnimationFrame(tick)
    }

    const check = () => {
      const vh = window.innerHeight
      const g = gallery.getBoundingClientRect()
      if (!gIn && g.top < vh * 0.88 && g.bottom > 0) {
        gIn = true
        gallery.classList.add('is-in')
        runCount()
      }
      const c = copy.getBoundingClientRect()
      if (!cIn && c.top < vh * 0.88 && c.bottom > 0) {
        cIn = true
        copy.classList.add('is-in')
      }
      // gentle scroll parallax for the photos (-1 .. 1)
      const sp = Math.min(Math.max((g.top + g.height / 2 - vh / 2) / vh, -1), 1)
      gallery.style.setProperty('--sp', sp.toFixed(3))

      // scroll gauge + background drift
      const r = root.getBoundingClientRect()
      const p = Math.min(Math.max((vh * 0.8 - r.top) / (r.height * 0.75), 0), 1)
      root.style.setProperty('--ab-p', p.toFixed(3))
      const on = Math.round(p * bricks.length)
      bricks.forEach((b, i) => {
        b.classList.toggle('is-on', i < on)
        b.classList.toggle('is-head', i === on - 1 && p < 1)
      })
    }

    check()
    // lazy images can move things after load, so check a few more times
    ;[150, 600, 1500].forEach((t) => timers.push(window.setTimeout(check, t)))
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(cRaf)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <section className="section about-section" id="about" ref={rootRef}>
      <style>{abCss}</style>
      <div className="ab-grid" aria-hidden="true" />

      <div className="container about-grid">
        {/* ================= GALLERY ================= */}
        <div className="about-gallery ab-g">
          <div className="about-image about-image--main">
            <img src="/images/brick-yard.png" alt="A clean JPS-style block casting and storage yard" loading="lazy" />
            <AbWall cols={6} rows={8} seed={1} />
            <span className="image-caption ab-cap">Cast with care. Cured completely.</span>
          </div>
          <div className="about-image about-image--detail">
            <img src="/images/concrete-blocks.png" alt="Fairface concrete blocks with consistent edges and texture" loading="lazy" />
            <AbWall cols={4} rows={5} seed={2} base={600} />
          </div>

          <div className="trust-badge">
            <i className="ab-orbit" aria-hidden="true" />
            {chips.map((c, i) => (
              <i
                className="ab-chip"
                aria-hidden="true"
                key={i}
                style={{ ['--x' as string]: c.x, ['--y' as string]: c.y, ['--r' as string]: `${c.rot}deg` } as CSSProperties}
              />
            ))}
            <strong>
              <b className="ab-count" ref={countRef}>
                5
              </b>
              <span>+</span>
            </strong>
            <small>
              years of
              <br />
              earned trust
            </small>
          </div>

          <div className="gallery-scribble" aria-hidden="true">
            <AbLetters text="JPS / 01" base={2100} />
          </div>

          {/* a little brick pyramid that is laid from the sides */}
          <div className="ab-stack" aria-hidden="true">
            {(
              [
                [0, 0, 'a', 1700],
                [36, 0, 'b', 1850],
                [72, 0, 'a', 2000],
                [18, 17, 'c', 2250],
                [54, 17, 'a', 2400],
                [36, 34, 'b', 2650],
              ] as [number, number, string, number][]
            ).map(([x, y, tone, d], i) => (
              <i
                className={`ab-brick ${tone}`}
                key={i}
                style={{ left: x, bottom: y, ['--d' as string]: `${ms(d)}ms`, ['--side' as string]: i % 2 ? 1 : -1 } as CSSProperties}
              />
            ))}
          </div>
        </div>

        {/* ================= COPY ================= */}
        <div className="about-copy ab-c">
          <div className="ab-bar" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>

          <span className="eyebrow ab-w" style={dly(0)}>
            About JPS Bricks & Blocks
          </span>
          <h2>
            <AbWords text="Five &nbsp;years&nbsp; of&nbsp; experience." base={150} />
            <br />
            <span>
              <AbWords text="Five&nbsp; years&nbsp; of&nbsp; trust." base={750} />
            </span>
          </h2>
          <i className="ab-underline" aria-hidden="true" />
          <p className="ab-w" style={dly(1100)}>
            What began as a small block-casting yard on Kilangulam Main Road has grown into one of Peraiyur’s dependable names in construction materials. Over five years we have supplied individual home builders, contractors, promoters and highway works — and kept the same discipline throughout: get the mix right, cure it fully, measure it twice.
          </p>
          <p className="ab-w" style={dly(1350)}>
            We manufacture in-house, which means you deal directly with the people who cast the block. No middleman markup, no substituted material, no surprises on the lorry.
          </p>
          <ul className="promise-list">
            {promises.map((item, i) => (
              <li key={item} style={{ ['--d' as string]: `${ms(1600 + i * 200)}ms`, ['--d2' as string]: `${ms(1850 + i * 200)}ms` } as CSSProperties}>
                <span>
                  <Check size={14} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <a className="button button--red ab-btn" href={brand.phoneHref} style={dly(2500)}>
            Call 63827 27154 <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

const abCssRaw = `
.about-section { position: relative; isolation: isolate; }
.about-gallery, .about-copy, .about-image, .trust-badge { contain: layout; }
.about-section .about-image { overflow: hidden; }

/* drifting brick-grid backdrop (moves with scroll) */
.ab-grid {
  position: absolute;
  inset: -40px 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(rgb(120 135 170 / 9%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(120 135 170 / 9%) 1px, transparent 1px);
  background-size: 100% 34px, 68px 100%;
  translate: 0 calc(var(--ab-p, 0) * -60px);
  mask-image: radial-gradient(ellipse at 50% 50%, #000 30%, transparent 78%);
}

/* ---------- brick wall that covers each photo ---------- */
.ab-wall {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: none;
  flex-direction: column;
  overflow: hidden;
  pointer-events: none;
  background: #d9cfbd;
}
.ab-armed .ab-wall { display: flex; }
.ab-row { display: flex; flex: 1; width: 100%; }
.ab-row.is-odd { translate: calc(-50% / var(--cols)) 0; }
.ab-cell {
  --fx: -90deg;
  flex: 0 0 calc(100% / var(--cols));
  margin: 1px;
  border-radius: 2px;
  backface-visibility: hidden;
  box-shadow: inset 0 2px 0 rgb(255 255 255 / 22%), inset 0 -3px 0 rgb(0 0 0 / 22%);
}
.ab-row.is-odd .ab-cell { --fx: 90deg; }
.ab-cell.t0 { background: #c8452f; }
.ab-cell.t1 { background: #b53a28; }
.ab-cell.t2 { background: #14407f; }
.ab-cell.t3 { background: #e0a800; }

/* the bricks flip like shutters, rippling out from the middle */
.ab-g.is-in .ab-cell {
  animation: ab-flip 0.8s cubic-bezier(0.55, 0.05, 0.6, 1) forwards;
  animation-delay: var(--d);
}
.ab-g.is-in .ab-wall { animation: ab-wallgone 0.1s linear 3.4s forwards; }

/* photos: settle from a zoom, then drift gently with scroll */
.ab-armed .about-image img {
  scale: 1.1;
  translate: 0 calc(var(--sp, 0) * -14px);
}
.ab-armed .about-image--detail img {
  translate: 0 calc(var(--sp, 0) * 11px);
}
.ab-g.is-in .about-image img { animation: ab-settle 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

/* caption wipes up from the bottom */
.ab-armed .ab-cap { opacity: 0; }
.ab-g.is-in .ab-cap { opacity: 1; animation: ab-capwipe 0.9s cubic-bezier(0.6, 0, 0.2, 1) 1.8s backwards; }

/* ---------- trust badge: lands like a rubber stamp ---------- */
.ab-armed .trust-badge { opacity: 0; }
.ab-g.is-in .trust-badge {
  opacity: 1;
  animation: ab-stamp 0.95s cubic-bezier(0.3, 1.3, 0.5, 1) 1.15s backwards;
}
.ab-count { font-weight: inherit; }

/* dashed ring that breathes once the count has finished */
.ab-orbit {
  position: absolute;
  inset: -9px;
  border: 2px dashed var(--brand-gold, #ffc400);
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
}
.ab-g.is-done .ab-orbit { opacity: 0.85; animation: ab-orbit-in 0.6s ease backwards, ab-breathe 3.2s ease-in-out 0.6s infinite alternate; }

/* brick chips thrown out with gravity */
.ab-chip {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 5px;
  margin: -3px 0 0 -5px;
  border-radius: 1px;
  background: #c8452f;
  opacity: 0;
  pointer-events: none;
}
.ab-chip:nth-of-type(3n + 2) { background: var(--brand-gold, #ffc400); }
.ab-chip:nth-of-type(3n) { background: #14407f; }
.ab-g.is-done .ab-chip { animation: ab-chip 1.1s cubic-bezier(0.2, 0.7, 0.3, 1) both; }

/* ---------- scribble: split-flap letters ---------- */
.ab-ch { display: inline-block; font-style: normal; }
.ab-armed .ab-ch { opacity: 0; }
.ab-g.is-in .ab-ch { opacity: 1; animation: ab-flap 0.55s cubic-bezier(0.3, 1.3, 0.5, 1) backwards; animation-delay: var(--d); }

/* ---------- brick pyramid (laid from the sides) ---------- */
.ab-stack {
  position: absolute;
  top: -22px;
  right: 14px;
  z-index: 3;
  width: 106px;
  height: 52px;
  pointer-events: none;
}
.ab-brick {
  position: absolute;
  width: 34px;
  height: 15px;
  border-radius: 2px;
  box-shadow: inset 0 2px 0 rgb(255 255 255 / 25%), inset 0 -3px 0 rgb(0 0 0 / 25%), 0 6px 10px rgb(0 0 0 / 20%);
}
.ab-brick.a { background: #c8452f; }
.ab-brick.b { background: #e0a800; }
.ab-brick.c { background: #14407f; }
.ab-armed .ab-brick { opacity: 0; }
.ab-g.is-in .ab-brick {
  opacity: 1;
  animation: ab-lay 0.7s cubic-bezier(0.25, 0.8, 0.3, 1) backwards;
  animation-delay: var(--d);
}

/* ---------- copy ---------- */
.ab-armed .ab-w { opacity: 0; }
.ab-c.is-in .ab-w { opacity: 1; animation: ab-focus 1s ease backwards; animation-delay: var(--d); }

/* headline words are wiped in left to right */
.ab-mask {
  display: inline-block;
  font-style: normal;
}
.ab-word { display: inline-block; font-style: normal; }
.ab-armed .ab-word { clip-path: inset(-10% 100% -20% -4%); translate: -14px 0; }
.ab-c.is-in .ab-word {
  clip-path: inset(-10% -4% -20% -4%);
  translate: 0 0;
  animation: ab-wipe 0.9s cubic-bezier(0.6, 0, 0.2, 1) backwards;
  animation-delay: var(--d);
}

/* bar grows out from the centre */
.ab-underline {
  display: block;
  width: 190px;
  height: 5px;
  margin: 14px 0 22px;
  border-radius: 5px;
  background: linear-gradient(90deg, var(--brand-red, #e30613), var(--brand-gold, #ffc400));
  transform-origin: center;
}
.ab-armed .ab-underline { transform: scaleX(0); }
.ab-c.is-in .ab-underline { transform: scaleX(1); animation: ab-bar 0.9s cubic-bezier(0.6, 0, 0.2, 1) 1.05s backwards; }

/* promises: wiped in, tick circle spins, faint gold rule draws */
.about-section .promise-list li { position: relative; }
.ab-armed .promise-list li { opacity: 0; }
.ab-c.is-in .promise-list li { opacity: 1; animation: ab-wipeli 0.8s cubic-bezier(0.6, 0, 0.2, 1) backwards; animation-delay: var(--d); }
.promise-list li::after {
  position: absolute;
  right: 0;
  bottom: -2px;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--brand-gold, #ffc400), transparent 80%);
  content: "";
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
  pointer-events: none;
}
.ab-c.is-in .promise-list li::after { animation: ab-linedraw 1s cubic-bezier(0.6, 0, 0.2, 1) forwards; animation-delay: calc(var(--d2) + 300ms); }
.ab-c.is-in .promise-list li > span { animation: ab-spin 0.8s cubic-bezier(0.3, 1.5, 0.5, 1) backwards; animation-delay: var(--d2); }
.promise-list li > span svg path { stroke-dasharray: 30; stroke-dashoffset: 0; }
.ab-c.is-in .promise-list li > span svg path { animation: ab-tick 0.5s ease backwards; animation-delay: calc(var(--d2) + 350ms); }

/* scroll gauge made of bricks, with a glowing head */
.ab-bar {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: -34px;
  display: flex;
  width: 12px;
  flex-direction: column-reverse;
  gap: 3px;
  pointer-events: none;
}
.ab-bar i {
  flex: 1;
  border-radius: 2px;
  background: rgb(128 140 165 / 26%);
  transition: background 0.35s ease, box-shadow 0.35s ease, scale 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}
.ab-bar i:nth-child(3n) { background: rgb(128 140 165 / 36%); }
.ab-bar i.is-on { background: var(--brand-gold, #ffc400); box-shadow: 0 0 10px rgb(255 196 0 / 55%); scale: 1.18 1; }
.ab-bar i.is-on:nth-child(4n) { background: var(--brand-red, #e30613); box-shadow: 0 0 10px rgb(227 6 19 / 40%); }
.ab-bar i.is-head { animation: ab-head 0.9s ease-in-out infinite alternate; }

/* call button: pops in, then a soft ring pulse + nudging arrow */
.ab-btn { position: relative; }
.ab-armed .ab-btn { opacity: 0; }
.ab-c.is-in .ab-btn {
  opacity: 1;
  animation: ab-btnin 0.8s cubic-bezier(0.3, 1.6, 0.5, 1) var(--d) backwards, ab-ring 3.4s ease-out 3.8s infinite;
}
.ab-c.is-in .ab-btn svg { animation: ab-nudge 1.7s ease-in-out 3.8s infinite; }

/* ---------- keyframes ---------- */
@keyframes ab-flip {
  0% { transform: perspective(520px) rotateX(0deg) scale(1); opacity: 1; }
  60% { transform: perspective(520px) rotateX(var(--fx)) scale(1); opacity: 1; }
  100% { transform: perspective(520px) rotateX(var(--fx)) scale(0.5); opacity: 0; }
}
@keyframes ab-wallgone { to { visibility: hidden; } }
@keyframes ab-settle { from { scale: 1.32; } }
@keyframes ab-capwipe { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes ab-stamp {
  0% { opacity: 0; scale: 1.9; rotate: 14deg; filter: blur(6px); }
  55% { opacity: 1; scale: 0.9; rotate: -4deg; filter: blur(0); }
  75% { scale: 1.05; rotate: 1.5deg; }
  100% { scale: 1; rotate: 0deg; }
}
@keyframes ab-orbit-in { from { opacity: 0; } }
@keyframes ab-breathe { from { scale: 1; } to { scale: 1.07; } }
@keyframes ab-chip {
  0% { opacity: 1; translate: 0 0; rotate: 0deg; }
  55% { opacity: 1; translate: calc(var(--x) * 1px) calc(var(--y) * 1px); }
  100% { opacity: 0; translate: calc(var(--x) * 1.25px) calc(var(--y) * 1px + 70px); rotate: var(--r); }
}
@keyframes ab-flap {
  from { opacity: 0; transform: perspective(300px) rotateX(-90deg); }
  to { opacity: 1; transform: perspective(300px) rotateX(0deg); }
}
@keyframes ab-lay {
  0% { opacity: 0; translate: calc(var(--side) * 70px) 0; }
  70% { opacity: 1; translate: calc(var(--side) * -4px) 0; }
  100% { opacity: 1; translate: 0 0; }
}
@keyframes ab-focus {
  from { opacity: 0; filter: blur(8px); scale: 0.985; }
}
@keyframes ab-wipe {
  from { clip-path: inset(-10% 100% -20% -4%); translate: -14px 0; }
}
@keyframes ab-bar {
  from { transform: scaleX(0); }
}
@keyframes ab-wipeli {
  from { opacity: 0; clip-path: inset(-6px 100% -6px 0); }
  to { opacity: 1; clip-path: inset(-6px -6px -6px -6px); }
}
@keyframes ab-linedraw {
  from { opacity: 0; transform: scaleX(0); }
  to { opacity: 0.55; transform: scaleX(1); }
}
@keyframes ab-spin {
  from { scale: 0; rotate: -270deg; }
}
@keyframes ab-tick {
  from { stroke-dashoffset: 30; }
}
@keyframes ab-head {
  from { scale: 1.18 1; box-shadow: 0 0 8px rgb(255 196 0 / 45%); }
  to { scale: 1.6 1; box-shadow: 0 0 18px rgb(255 196 0 / 90%); }
}
@keyframes ab-btnin {
  from { opacity: 0; scale: 0.7; }
}
@keyframes ab-ring {
  0% { box-shadow: 0 0 0 0 rgb(227 6 19 / 45%); }
  70%, 100% { box-shadow: 0 0 0 16px rgb(227 6 19 / 0%); }
}
@keyframes ab-nudge {
  0%, 100% { translate: 0 0; }
  50% { translate: 5px 0; }
}

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .ab-bar { display: none; }
}
@media (max-width: 800px) {
  .ab-stack { right: 8px; top: -18px; scale: 0.85; }
}

/* ---------- reduced motion: finished state, no movement ---------- */
.ab-static .ab-wall,
.ab-static .ab-chip,
.ab-static .ab-orbit { display: none; }
.ab-static *, .ab-static *::before, .ab-static *::after {
  animation: none !important;
  transition: none !important;
}
.ab-static .ab-w, .ab-static .ab-ch, .ab-static .ab-brick,
.ab-static .ab-cap, .ab-static .trust-badge, .ab-static .promise-list li, .ab-static .ab-btn { opacity: 1; }
.ab-static .ab-word { clip-path: none; translate: 0 0; }
.ab-static .ab-cap { clip-path: none; }
.ab-static .ab-underline { transform: none; }
.ab-static .promise-list li::after { opacity: 0.55; transform: none; }
.ab-static .about-image img { translate: 0 0; }
`

const abCss = speedUp(abCssRaw)













































































import {  useState, type MutableRefObject } from 'react'

// TODO: adjust this import path to wherever your data lives


/* ------------------------------------------------------------------ */
/*  STYLES (embedded so this stays a single file)                      */
/* ------------------------------------------------------------------ */
const css = `
.hz-wrap {
  --brick: #b8431f;
  --pw: min(64vw, 900px);
  position: relative;
  height: calc(var(--n) * 85vh);
  padding: 0 !important;
}
.hz-stage {
  position: sticky; top: 0; height: 100vh; overflow: hidden; isolation: isolate;
  display: grid; grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto minmax(0, 1fr) auto;
}

/* header */
.hz-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; padding-top: clamp(1.2rem, 4vh, 2.6rem); padding-bottom: 1rem; }
.hz-top h2 { margin: .35rem 0 0; font-size: clamp(1.6rem, 3.2vw, 2.8rem); line-height: 1.02; }
.hz-top h2 em { font-style: normal; color: var(--brick); }
.hz-top__r { max-width: 300px; font-size: .9rem; display: grid; gap: .5rem; justify-items: start; }
.hz-top__r p { margin: 0; opacity: .75; }
.hz-progress { height: 2px; background: color-mix(in srgb, currentColor 12%, transparent); }
.hz-progress i { display: block; height: 100%; background: var(--brick); transform-origin: left; transform: scaleX(var(--p, 0)); }

/* giant rolling numeral */
.hz-bgnum {
  position: absolute; left: 50%; top: 52%; height: 1em; overflow: hidden; z-index: -1; pointer-events: none;
  font-size: clamp(16rem, 38vw, 34rem); line-height: 1; font-weight: 800; transform: translate(-50%, -50%);
  color: transparent; -webkit-text-stroke: 2px color-mix(in srgb, var(--brick) 30%, transparent);
}
.hz-bgnum__col { display: flex; flex-direction: column; transform: translateY(calc(var(--i, 0) * -1em)); transition: transform 1s cubic-bezier(.7, 0, .2, 1); }
.hz-bgnum__col span { display: block; height: 1em; line-height: 1; }

/* dust */
.hz-dust { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }

/* track + panels */
.hz-track {
  position: relative; align-self: center; display: flex; width: max-content;
  gap: clamp(24px, 4vw, 64px); padding-inline: calc((100% - var(--pw)) / 2);
  will-change: transform; transform-origin: 50% 50%;
}
.hz-panel {
  --a: 1; --d: 0;
  position: relative; flex: none; width: var(--pw); height: min(60vh, 520px);
  display: grid; grid-template-columns: 1.15fr .85fr; border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  transform: scale(calc(.8 + .2 * var(--a))); opacity: calc(.3 + .7 * var(--a));
  will-change: transform, opacity;
}
.hz-img {
  position: relative; overflow: hidden; border-radius: 10px 0 0 10px;
  clip-path: inset(calc((1 - var(--a)) * 14%) calc((1 - var(--a)) * 10%) round 10px);
}
.hz-img img {
  position: absolute; top: 0; left: -10%; width: 120%; height: 100%; object-fit: cover;
  transform: translateX(calc(var(--d) * -7%)) scale(calc(1.18 - .18 * var(--a)));
  filter: saturate(calc(.25 + .75 * var(--a)));
}
.hz-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,.35)); }

/* body text reveal */
.hz-body { padding: clamp(1.2rem, 2.4vw, 2.4rem); padding-right: clamp(1.2rem, 2.4vw, 2.4rem); display: flex; flex-direction: column; justify-content: center; gap: .85rem; }
.hz-body h3 { margin: 0; font-size: clamp(1.5rem, 2.6vw, 2.4rem); line-height: 1.08; padding-bottom: .1em; }
.hz-body p { margin: 0; opacity: .8; font-size: .95rem; line-height: 1.55; }
.hz-body ul { list-style: none; padding: 0; margin: .2rem 0 0; display: grid; gap: .25rem; font-size: .88rem; }
.hz-body li span b { color: var(--brick); margin-right: .5rem; font-weight: 700; }
.hz-tag { font-size: .72rem; letter-spacing: .22em; text-transform: uppercase; color: var(--brick); font-weight: 700; }
.hz-tag em { font-style: normal; opacity: .7; }
.hz-line { display: block; overflow: hidden; }
.hz-line > * {
  display: block; transform: translateY(110%); opacity: 0;
  transition: transform .75s cubic-bezier(.2, .9, .2, 1) calc(var(--s, 0) * 70ms + 120ms), opacity .5s calc(var(--s, 0) * 70ms + 120ms);
}
.hz-panel[data-active='true'] .hz-line > * { transform: none; opacity: 1; }
.hz-line > .hz-cta {
  display: flex; width: max-content; align-items: center; gap: .5rem; font-weight: 600; padding-bottom: 3px;
  background: linear-gradient(var(--brick), var(--brick)) 0 100% / 100% 2px no-repeat; transition-property: transform, opacity, background-size;
}
.hz-cta svg { transition: transform .35s; }
.hz-cta:hover svg { transform: translateX(6px); }

/* rotating enquire badge */
.hz-badge {
  position: absolute; left: 57.5%; bottom: -38px; width: 112px; height: 112px; z-index: 5; border-radius: 50%;
  background: var(--brick); color: #fff; display: grid; place-items: center;
  transform: translateX(-50%) scale(calc(.3 + .7 * var(--a))); box-shadow: 0 14px 30px -10px rgba(120, 40, 10, .6);
  transition: background .3s;
}
.hz-badge:hover { background: #111; }
.hz-badge__ring { position: absolute; inset: 0; animation: hz-spin 14s linear infinite; fill: #fff; font-size: 11px; font-weight: 700; letter-spacing: .14em; }
.hz-badge__arrow { transition: transform .4s; transform: rotate(-45deg); }
.hz-badge:hover .hz-badge__arrow { transform: rotate(0deg) scale(1.15); }
@keyframes hz-spin { to { transform: rotate(360deg); } }

/* bottom bar */
.hz-bar { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding-top: 1rem; padding-bottom: clamp(1rem, 4vh, 2.2rem); }
.hz-bar__count { font-size: .85rem; letter-spacing: .1em; text-transform: uppercase; min-width: 220px; }
.hz-bar__count b { font-size: 1.4rem; color: var(--brick); margin-right: .2rem; }
.hz-bar__count span { opacity: .65; margin-left: .6rem; }
.hz-bricks { display: flex; gap: 4px; }
.hz-bricks button {
  all: unset; cursor: pointer; width: 30px; height: 14px; border-radius: 2px;
  background: color-mix(in srgb, currentColor 16%, transparent);
  transition: transform .4s cubic-bezier(.2, .8, .2, 1), background .3s, box-shadow .3s;
}
.hz-bricks button[data-on='true'] { background: var(--brick); }
.hz-bricks button[data-cur='true'] { transform: translateY(-6px) scale(1.15); box-shadow: 0 8px 14px -4px rgba(184, 67, 31, .7); }
.hz-bricks button:hover { transform: translateY(-3px); }
.hz-hint { min-width: 220px; text-align: right; font-size: .78rem; letter-spacing: .18em; text-transform: uppercase; opacity: max(0, calc(1 - var(--p, 0) * 20)); }
.hz-hint b { display: inline-block; animation: hz-nudge 1.2s ease-in-out infinite; }
@keyframes hz-nudge { 50% { transform: translateX(8px); } }

/* stacked fallback (mobile / reduced motion) */
.hz-stack.hz-wrap { height: auto !important; padding: 3rem 0 !important; }
.hz-stack .hz-stage { position: relative; height: auto; overflow: visible; display: block; }
.hz-stack .hz-top { flex-direction: column; align-items: flex-start; }
.hz-stack .hz-track { flex-direction: column; width: auto; padding: 1.5rem 4vw 0; gap: 1.6rem; transform: none !important; }
.hz-stack .hz-panel { width: 100%; height: auto; grid-template-columns: 1fr; transform: none; opacity: 1; }
.hz-stack .hz-img { height: 240px; border-radius: 10px 10px 0 0; clip-path: none; }
.hz-stack .hz-img img { left: 0; width: 100%; transform: none; filter: none; }
.hz-stack .hz-line > * { transform: none; opacity: 1; transition: none; }
.hz-stack .hz-badge, .hz-stack .hz-bgnum, .hz-stack .hz-bar, .hz-stack .hz-dust, .hz-stack .hz-progress { display: none; }
`

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (t: number) => t * t * (3 - 2 * t)
const pad = (n: number) => String(n).padStart(2, '0')

function useStackMode() {
  const [stack, setStack] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px), (prefers-reduced-motion: reduce)')
    const on = () => setStack(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return stack
}

/* brick dust that streams with scroll velocity */
function Dust({ velRef }: { velRef: MutableRefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    let w = 0, h = 0, raf = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    const ps = Array.from({ length: 55 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 2.2 + 0.6,
      s: Math.random() * 0.35 + 0.1, a: Math.random() * 0.35 + 0.1, ph: Math.random() * 6.28,
    }))
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, w, h)
      const v = velRef.current
      for (const p of ps) {
        p.y -= p.s * 0.0012 + Math.abs(v) * p.s * 0.6
        p.x -= v * p.s * 1.6
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random() }
        if (p.x < -0.05) p.x = 1.05
        if (p.x > 1.05) p.x = -0.05
        ctx.fillStyle = `rgba(184,67,31,${p.a})`
        ctx.beginPath()
        ctx.arc(p.x * w + Math.sin(t / 1500 + p.ph) * 10, p.y * h, p.r, 0, 6.283)
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [velRef])
  return <canvas ref={ref} className="hz-dust" aria-hidden="true" />
}

/* ------------------------------------------------------------------ */
/*  SECTION                                                            */
/* ------------------------------------------------------------------ */
export function Products() {
  const stack = useStackMode()
  const wrapRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const velRef = useRef(0)
  const [active, setActive] = useState(0)
  const n = products.length

  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const track = trackRef.current
    if (!wrap || !stage || !track) return
    const panels = panelRefs.current.filter(Boolean) as HTMLElement[]

    if (stack) {
      track.style.transform = ''
      stage.style.removeProperty('--p')
      panels.forEach((p) => { p.style.removeProperty('--a'); p.style.removeProperty('--d') })
      return
    }

    let cur = 0, vel = 0, skew = 0, raf = 0, visible = true, lastActive = -1
    let sw = 0, maxX = 0
    let centers: number[] = []
    let widths: number[] = []

    const measure = () => {
      sw = stage.clientWidth
      maxX = Math.max(0, track.scrollWidth - sw)
      centers = panels.map((p) => p.offsetLeft + p.offsetWidth / 2)
      widths = panels.map((p) => p.offsetWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    ro.observe(stage)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '100px' })
    io.observe(wrap)

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      const r = wrap.getBoundingClientRect()
      const range = Math.max(1, r.height - window.innerHeight)
      const target = clamp(-r.top / range)
      const diff = target - cur
      cur += diff * 0.085
      vel += (diff - vel) * 0.25
      velRef.current = vel

      const x = -cur * maxX
      skew += (clamp(vel * 380, -9, 9) - skew) * 0.2
      track.style.transform = `translate3d(${x}px,0,0) skewX(${skew.toFixed(2)}deg)`
      stage.style.setProperty('--p', cur.toFixed(4))

      let best = 0, bd = 1e9
      for (let i = 0; i < panels.length; i++) {
        const d = (centers[i] + x - sw / 2) / (widths[i] * 0.95)
        const a = smooth(clamp(1 - Math.abs(d)))
        panels[i].style.setProperty('--d', clamp(d, -1.2, 1.2).toFixed(3))
        panels[i].style.setProperty('--a', a.toFixed(3))
        if (Math.abs(d) < bd) { bd = Math.abs(d); best = i }
      }
      if (best !== lastActive) { lastActive = best; setActive(best) }
    }
    raf = requestAnimationFrame(loop)

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [stack, n])

  const goTo = (i: number) => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (stack) { panelRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    const top = wrap.getBoundingClientRect().top + window.scrollY
    const range = wrap.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (i / Math.max(1, n - 1)) * range, behavior: 'smooth' })
  }

  return (
    <section
      ref={wrapRef}
      id="products"
      className={`products-section hz-wrap${stack ? ' hz-stack' : ''}`}
      style={{ '--n': n } as CSSProperties}
    >
      <style>{css}</style>

      <div ref={stageRef} className="hz-stage" style={{ '--i': active } as CSSProperties}>
        {!stack && <Dust velRef={velRef} />}

        <div className="hz-bgnum" aria-hidden="true">
          <div className="hz-bgnum__col">
            {products.map((_: any, i: number) => <span key={i}>{pad(i + 1)}</span>)}
          </div>
        </div>

        <header className="container hz-top">
          <div>
            <span className="eyebrow">Our product range</span>
            <h2>Bricks, blocks &amp; stones — <em>cast to spec.</em></h2>
          </div>
          <div className="hz-top__r">
            <p>Eleven product lines covering walls, pavements, compounds and highway works.</p>
            <a className="text-link" href="#contact">Ask about availability <ArrowRight size={15} /></a>
          </div>
        </header>

        <div className="container"><div className="hz-progress"><i /></div></div>

        <div ref={trackRef} className="hz-track">
          {products.map((product: any, i: number) => {
            const bullets: string[] = product.bullets ?? []
            const href = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
              `Hello JPS Bricks & Blocks, I would like to enquire about ${product.name}.`
            )}`
            return (
              <article
                key={product.name}
                ref={(el) => { panelRefs.current[i] = el }}
                className="hz-panel"
                data-active={stack || i === active}
              >
                <div className="hz-img">
                  <img src={product.image} alt={product.imageAlt} loading="lazy" />
                </div>

                <a className="hz-badge" href={href} target="_blank" rel="noreferrer" aria-hidden="true" tabIndex={-1}>
                  <svg className="hz-badge__ring" viewBox="0 0 120 120">
                    <defs>
                      <path id={`hz-c-${i}`} d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
                    </defs>
                    <text>
                      <textPath href={`#hz-c-${i}`} textLength="288" lengthAdjust="spacing">
                        ENQUIRE • ENQUIRE • ENQUIRE •
                      </textPath>
                    </text>
                  </svg>
                  <ArrowRight className="hz-badge__arrow" size={26} />
                </a>

                <div className="hz-body">
                  <span className="hz-line" style={{ '--s': 0 } as CSSProperties}>
                    <span className="hz-tag">
                      {pad(i + 1)} / {pad(n)}
                      {product.badge && <em> · {product.badge}</em>}
                    </span>
                  </span>
                  <div className="hz-line" style={{ '--s': 1 } as CSSProperties}><h3>{product.name}</h3></div>
                  <div className="hz-line" style={{ '--s': 2 } as CSSProperties}><p>{product.description}</p></div>
                  {bullets.length > 0 && (
                    <ul>
                      {bullets.map((b, bi) => (
                        <li key={b} className="hz-line" style={{ '--s': 3 + bi } as CSSProperties}>
                          <span><b>—</b>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="hz-line" style={{ '--s': 4 + bullets.length } as CSSProperties}>
                    <a className="hz-cta" href={href} target="_blank" rel="noreferrer">
                      Enquire about this <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <footer className="container hz-bar">
          <div className="hz-bar__count">
            <b>{pad(active + 1)}</b>/ {pad(n)}
            <span>{products[active]?.name}</span>
          </div>
          <div className="hz-bricks" role="tablist" aria-label="Products">
            {products.map((p: any, i: number) => (
              <button
                key={p.name}
                role="tab"
                aria-label={p.name}
                aria-selected={i === active}
                data-on={i <= active}
                data-cur={i === active}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <span className="hz-hint">Scroll <b>→</b></span>
        </footer>
      </div>
    </section>
  )
}