import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Check, Droplets, Factory, HeartHandshake, IndianRupee, MapPin, Ruler, ShieldCheck, Truck } from "lucide-react";

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

/* =========================================================
   AboutHero — "poured, measured, hung"
   ========================================================= */

const countLetters = (t: string) => t.replace(/ /g, "").length;

const LINE_ONE = "Five Years of Experience.";
const LINE_TWO = "Five Years of Trust.";

/* each letter = a ghost mould + a concrete layer that is poured in */
function PourLine({ text, start }: { text: string; start: number }) {
  let n = start;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <Fragment key={word + wi}>
          <span className="ah-word">
            {word.split("").map((ch, i) => {
              const idx = n++;
              return (
                <span className="ah-c" data-c={ch} key={i} style={{ ["--n" as string]: idx } as CSSProperties}>
                  <i>{ch}</i>
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

export function AboutHero() {
  const swayRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  // the sign can be swung again once the intro has finished
  useEffect(() => {
    const t = window.setTimeout(() => {
      readyRef.current = true;
    }, 1500);
    return () => window.clearTimeout(t);
  }, []);

  const swing = () => {
    const el = swayRef.current;
    if (!el || !readyRef.current) return;
    const dir = Math.random() < 0.5 ? -1 : 1;
    el.style.setProperty("--amp", `${dir * (7 + Math.random() * 4)}deg`);
    el.classList.remove("is-poked");
    void el.offsetWidth; // restart the animation
    el.classList.add("is-poked");
  };

  return (
    <section className="page-hero ah">
      <style>{ahCss}</style>
      <div className="hero-grain" aria-hidden="true" />

      <div className="container page-hero-grid">
        {/* ================= COPY ================= */}
        <div className="ah-copy">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a className="ah-crumb" style={{ ["--k" as string]: 0 } as CSSProperties} href="/">
              Home
            </a>
            <span className="ah-crumb" style={{ ["--k" as string]: 1 } as CSSProperties} aria-hidden="true">
              /
            </span>
            <span className="ah-crumb" style={{ ["--k" as string]: 2 } as CSSProperties} aria-current="page">
              About Us
            </span>
          </nav>

          <h1 className="ah-h1" aria-label={`${LINE_ONE} ${LINE_TWO}`}>
            <span aria-hidden="true">
              <PourLine text={LINE_ONE} start={0} />
              <br />
              <em className="ah-em">
                <PourLine text={LINE_TWO} start={countLetters(LINE_ONE)} />
              </em>
            </span>
          </h1>

          {/* measuring tape: pulled out, year marks pop as the hook passes */}
          <div className="ah-tape" aria-hidden="true">
            <div className="ah-strip">
              {[1, 2, 3, 4, 5].map((k) => (
                <b className="ah-yr" key={k} style={{ ["--k" as string]: k } as CSSProperties}>
                  {k}
                </b>
              ))}
            </div>
            <i className="ah-case" />
            <i className="ah-hook" />
          </div>

          <p className="page-hero-lead ah-lead">
            JPS Bricks &amp; Blocks manufactures{" "}
            <mark className="ah-mark">solid concrete blocks, fairface blocks, pavers and highway stones</mark> at
            Kilangulam Main Road, Peraiyur, Madurai.
          </p>
        </div>

        {/* ================= SIGN ================= */}
        <div className="page-hero-visual">
          <div className="ah-rig">
            <i className="ah-beam" aria-hidden="true" />
            <i className="ah-spot" aria-hidden="true" />

            <div className="ah-sway" ref={swayRef} onPointerDown={swing}>
              <i className="ah-rope ah-rope--l" aria-hidden="true" />
              <i className="ah-rope ah-rope--r" aria-hidden="true" />
              <div className="page-hero-photo ah-board">
                <img
                  src="/images/signboard-jps2.png"
                  alt="JPS Bricks and Blocks signboard with contact numbers 63827 27154 and 78715 99044"
                  fetchPriority="high"
                  draggable={false}
                />
                <i className="ah-glint" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="trust-badge">
            <strong aria-label="5 plus">
              <b className="ah-odo" aria-hidden="true">
                <b className="ah-col">
                  {[0, 1, 2, 3, 4, 5].map((d) => (
                    <i key={d}>{d}</i>
                  ))}
                </b>
              </b>
              <span aria-hidden="true">+</span>
            </strong>
            <small>
              Years of
              <br />
              trust
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

const ahCss = `
.ah {
  --rope: 64px;        /* length of the ropes the sign hangs on */
  --tape-d: 1.35s;     /* when the tape starts to come out */
  --tape-t: 1.3s;      /* how long it takes to come out */
}

/* ---------- breadcrumb ---------- */
.ah-crumb { animation: ah-fade 0.5s ease backwards; animation-delay: calc(var(--k) * 90ms + 80ms); }

/* ---------- headline: concrete poured into letter moulds ---------- */
.ah-word { display: inline-block; white-space: nowrap; }
.ah-c { position: relative; display: inline-block; }
/* the empty mould: same colour as the heading, but faint */
.ah-c i {
  font-style: inherit;
  color: color-mix(in srgb, currentColor 20%, transparent);
}
/* the concrete: real colour, poured from the bottom up */
.ah-c::after {
  content: attr(data-c);
  position: absolute;
  top: 0;
  left: 0;
  clip-path: inset(-12% -6% -12% -6%);
  animation: ah-pour 0.55s cubic-bezier(0.6, 0, 0.2, 1) backwards;
  animation-delay: calc(var(--n) * 28ms + 300ms);
}
/* the gold line glows once when it has set */
.ah-em { animation: ah-glow 1.5s ease-in-out 1.55s 1; }

/* ---------- measuring tape ---------- */
.ah-tape { position: relative; width: min(100%, 440px); height: 34px; margin: 26px 0 24px; }
.ah-strip {
  position: absolute;
  inset: 0;
  border-radius: 2px 0 0 2px;
  background:
    linear-gradient(90deg, transparent calc(100% - 2px), rgb(8 21 47 / 90%) calc(100% - 2px)) 0 0 / 20% 100% repeat-x,
    linear-gradient(90deg, transparent calc(100% - 1.5px), rgb(8 21 47 / 75%) calc(100% - 1.5px)) 0 100% / 10% 58% repeat-x,
    linear-gradient(90deg, transparent calc(100% - 1px), rgb(8 21 47 / 60%) calc(100% - 1px)) 0 100% / 2% 36% repeat-x,
    var(--brand-gold, #ffc400);
  box-shadow: inset 0 2px 0 rgb(255 255 255 / 40%), inset 0 -3px 0 rgb(0 0 0 / 14%), 0 10px 18px -10px rgb(0 0 0 / 55%);
  clip-path: inset(0 0 0 0);
  animation: ah-pull var(--tape-t) linear var(--tape-d) backwards;
}
.ah-yr {
  position: absolute;
  top: 4px;
  left: calc(var(--k) * 20%);
  translate: calc(-100% - 6px) 0;
  color: #08152f;
  font: 800 12px/1 var(--font-heading, inherit);
  animation: ah-yr-pop 0.45s cubic-bezier(0.3, 1.8, 0.5, 1) backwards;
  animation-delay: calc(var(--tape-d) + var(--tape-t) * var(--k) / 5 - 0.12s);
}
/* year 5 is the one that counts */
.ah-yr:last-child {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  top: 3px;
  color: #fff;
  border-radius: 50%;
  background: var(--brand-red, #e30613);
  translate: calc(-100% - 4px) 0;
}
.ah-case {
  position: absolute;
  top: -5px;
  left: -12px;
  width: 30px;
  height: 44px;
  border-radius: 9px;
  background: linear-gradient(160deg, #1b3a74, #0a1c40);
  box-shadow: inset 0 2px 0 rgb(255 255 255 / 20%), 0 10px 16px -8px rgb(0 0 0 / 60%);
}
.ah-case::after {
  content: "";
  position: absolute;
  top: 17px;
  left: 9px;
  width: 12px;
  height: 10px;
  border-radius: 2px;
  background: var(--brand-gold, #ffc400);
}
.ah-hook {
  position: absolute;
  top: -5px;
  left: 100%;
  width: 9px;
  height: 44px;
  border-radius: 2px;
  background: linear-gradient(90deg, #98a2b8, #eef2f9 50%, #7f8aa2);
  translate: -50% 0;
  box-shadow: 0 8px 12px -6px rgb(0 0 0 / 55%);
  animation: ah-hook-move var(--tape-t) linear var(--tape-d) backwards;
}

/* ---------- lead: gold highlighter swipe ---------- */
.ah-lead { animation: ah-fade 0.8s ease 1.1s backwards; }
.ah-mark {
  color: inherit;
  padding: 0 0.04em;
  background-color: transparent;
  background-image: linear-gradient(rgb(255 196 0 / 42%), rgb(255 196 0 / 42%));
  background-repeat: no-repeat;
  background-position: 0 92%;
  background-size: 100% 0.55em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  animation: ah-highlight 0.9s cubic-bezier(0.6, 0, 0.2, 1) 2.45s backwards;
}

/* ---------- signboard on ropes ---------- */
.ah .page-hero-visual { overflow: visible; }
.ah-rig { position: relative; isolation: isolate; }
.ah-beam {
  position: absolute;
  top: calc(var(--rope) * -1 - 6px);
  right: 6%;
  left: 6%;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(180deg, #8791a8, #4a546b);
  box-shadow: 0 8px 14px rgb(0 0 0 / 30%), inset 0 1px 0 rgb(255 255 255 / 40%);
  animation: ah-beam-in 0.6s ease 0.05s backwards;
}
.ah-spot {
  position: absolute;
  z-index: -1;
  inset: -22% -14% 28%;
  background: radial-gradient(ellipse at 50% 0%, rgb(255 196 0 / 30%), transparent 68%);
  filter: blur(8px);
  animation: ah-spot-in 1.2s ease 1s backwards, ah-breathe 5s ease-in-out 2.2s infinite alternate;
}

/* the swinging group (ropes + board) pivots from the beam */
.ah-sway {
  --amp: 9deg;
  position: relative;
  cursor: pointer;
  touch-action: manipulation;
  transform-origin: 50% calc(var(--rope) * -1);
  will-change: translate, rotate;
  animation:
    ah-drop 0.9s cubic-bezier(0.3, 0.8, 0.3, 1) 0.25s backwards,
    ah-pend 3.4s ease-in-out 1s backwards,
    ah-idle 7s ease-in-out 4.6s infinite alternate;
}
.ah-sway.is-poked {
  animation: ah-pend 3s ease-in-out both, ah-idle 7s ease-in-out 3.2s infinite alternate;
}
.ah-rope {
  position: absolute;
  bottom: 100%;
  width: 4px;
  height: var(--rope);
  border-radius: 2px;
  background: repeating-linear-gradient(180deg, #c9a15c 0 3px, #8d6a33 3px 6px);
  pointer-events: none;
}
.ah-rope::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--brand-gold, #ffc400);
  box-shadow: 0 0 0 2px #08152f;
  translate: -50% 0;
}
.ah-rope--l { left: 17%; }
.ah-rope--r { right: 17%; }
.ah .page-hero-photo.ah-board { position: relative; overflow: hidden; }
.ah-glint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 38%, rgb(255 255 255 / 45%) 50%, transparent 62%);
  translate: 140% 0;
  animation: ah-glint 7s ease-in-out 3.6s infinite;
}

/* ---------- badge: hangs like a tag, swings a beat behind the sign ---------- */
.ah .trust-badge {
  transform-origin: 50% -10px;
  animation:
    ah-tag-in 0.6s cubic-bezier(0.3, 1.5, 0.5, 1) 1.1s backwards,
    ah-tag-swing 3.2s ease-in-out 1.5s backwards;
}
.ah-odo {
  display: inline-block;
  height: 1em;
  overflow: hidden;
  vertical-align: top;
  font-weight: inherit;
  line-height: 1;
}
.ah-col {
  display: flex;
  flex-direction: column;
  font-weight: inherit;
  translate: 0 -5em;          /* the finished state shows 5 */
  animation: ah-roll 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) 1.35s backwards;
}
.ah-col i {
  display: block;
  height: 1em;
  font-style: normal;
  line-height: 1;
}

/* ---------- keyframes ---------- */
@keyframes ah-fade { from { opacity: 0; } }
@keyframes ah-pour { from { clip-path: inset(100% 0 0 0); } }
@keyframes ah-glow {
  0%, 100% { text-shadow: 0 0 0 rgb(255 196 0 / 0%); }
  50% { text-shadow: 0 0 26px rgb(255 196 0 / 60%); }
}
@keyframes ah-pull { from { clip-path: inset(0 100% 0 0); } }
@keyframes ah-hook-move { from { left: 0; } }
@keyframes ah-yr-pop { from { scale: 0; opacity: 0; } }
@keyframes ah-highlight { from { background-size: 0% 0.55em; } }
@keyframes ah-beam-in { from { opacity: 0; translate: 0 -20px; } }
@keyframes ah-spot-in { from { opacity: 0; } }
@keyframes ah-breathe { from { opacity: 0.75; } to { opacity: 1; } }
@keyframes ah-drop {
  0% { translate: 0 -160%; }
  55% { translate: 0 3%; }
  75% { translate: 0 -1.2%; }
  100% { translate: 0 0; }
}
@keyframes ah-pend {
  0% { rotate: var(--amp); }
  18% { rotate: calc(var(--amp) * -0.72); }
  36% { rotate: calc(var(--amp) * 0.46); }
  54% { rotate: calc(var(--amp) * -0.27); }
  72% { rotate: calc(var(--amp) * 0.13); }
  88% { rotate: calc(var(--amp) * -0.05); }
  100% { rotate: 0deg; }
}
@keyframes ah-idle { from { rotate: 0deg; } to { rotate: 0.9deg; } }
@keyframes ah-glint {
  0% { translate: -140% 0; }
  22%, 100% { translate: 140% 0; }
}
@keyframes ah-tag-in { from { opacity: 0; scale: 0.5; translate: 0 -30px; } }
@keyframes ah-tag-swing {
  0% { rotate: -14deg; }
  18% { rotate: 9deg; }
  36% { rotate: -5.5deg; }
  54% { rotate: 3deg; }
  72% { rotate: -1.4deg; }
  100% { rotate: 0deg; }
}
@keyframes ah-roll { from { translate: 0 0; } }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .ah { --rope: 44px; }
  .ah-rig { margin-top: 52px; }
  .ah-tape { width: min(100%, 360px); }
}

/* ---------- reduced motion: finished state, nothing moves ---------- */
@media (prefers-reduced-motion: reduce) {
  .ah *, .ah *::before, .ah *::after { animation: none !important; }
  .ah-sway { cursor: default; }
}
`;

/* =========================================================
   WhoWeAre — "yard to house"
   ========================================================= */

export function WhoWeAre() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("is-armed");
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-in", e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section wwr" id="who-we-are" ref={ref}>
      <style>{css}</style>
      <div className="container who-grid">
        <div className="about-copy who-copy reveal">
          <span className="eyebrow">Who we are</span>
          <h2>
            Five years of experience.
            <br />
            <span>Five years of trust.</span>
          </h2>
          <p>
            JPS Bricks &amp; Blocks is a concrete products manufacturer based at 12/6, Kilangulam Main Road, Peraiyur
            Taluk, Madurai. For more than five years we have been casting, curing and delivering the material that
            holds up homes, compound walls, layout roads and factory sheds across the district.
          </p>
          <p>
            Five years is long enough to learn what actually matters to a builder. It is not the brochure — it is
            whether the block is square, whether it arrived on the promised day, and whether the rate you were quoted
            is the rate on the bill. That is the business we have built, one load at a time.
          </p>
        </div>

        <aside className="who-panel reveal" aria-label="JPS at a glance">
          {/* ---------- scene: yard -> house ---------- */}
          <div className="wwr-scene" aria-hidden="true">
            <i className="wwr-cloud wwr-cloud--a wwr-x" />
            <i className="wwr-cloud wwr-cloud--b wwr-x" />

            <svg className="wwr-factory" viewBox="0 0 70 58">
              <polygon points="4,24 4,14 20,24 20,14 36,24 36,14 52,24" fill="#0a1c40" />
              <rect x="4" y="24" width="56" height="34" fill="#0a1c40" />
              <rect x="54" y="6" width="8" height="30" fill="#17336a" />
              <rect x="54" y="6" width="8" height="4" fill="#e30613" />
              <rect x="10" y="34" width="10" height="8" fill="#ffc400" />
              <rect x="27" y="34" width="10" height="8" fill="#ffc400" />
              <rect x="44" y="34" width="10" height="8" fill="#ffc400" />
            </svg>
            <i className="wwr-smoke wwr-x" style={{ animationDelay: "0s" }} />
            <i className="wwr-smoke wwr-x" style={{ animationDelay: "0.9s" }} />
            <i className="wwr-smoke wwr-x" style={{ animationDelay: "1.8s" }} />

            <svg className="wwr-house" viewBox="0 0 70 56">
              <rect x="48" y="8" width="6" height="14" fill="#0a1c40" />
              <polygon points="2,26 35,4 68,26" fill="#e30613" />
              <rect x="10" y="26" width="50" height="30" fill="#fff" stroke="#0a1c40" strokeWidth="2" />
              <rect className="wwr-win wwr-x" x="17" y="33" width="14" height="12" fill="#ffc400" stroke="#0a1c40" strokeWidth="1.5" />
              <rect x="40" y="34" width="12" height="22" fill="#0a1c40" />
            </svg>
            <span className="wwr-tag wwr-x">
              <Check size={12} strokeWidth={3.6} />
              Delivered
            </span>

            <div className="wwr-road" />

            <div className="wwr-truck wwr-x">
              <div className="wwr-flip wwr-x">
                <svg viewBox="0 0 64 34">
                  <rect x="0" y="2" width="38" height="22" rx="3" fill="#0a1c40" />
                  <rect x="0" y="18" width="38" height="3" fill="#ffc400" />
                  <circle cx="19" cy="10" r="5" fill="#ffc400" />
                  <circle cx="19" cy="10" r="2" fill="#0a1c40" />
                  <path d="M38 8H52L60 16V24H38Z" fill="#e30613" />
                  <path d="M42 11H50L55 16H42Z" fill="#cfe3ff" />
                  <rect x="0" y="24" width="62" height="4" rx="1" fill="#08152f" />
                  <g className="wwr-wheel wwr-x">
                    <circle cx="14" cy="28" r="5.5" fill="#08152f" />
                    <circle cx="14" cy="28" r="2.2" fill="#ffc400" />
                    <line x1="9.5" y1="28" x2="18.5" y2="28" stroke="#08152f" strokeWidth="1.2" />
                  </g>
                  <g className="wwr-wheel wwr-x">
                    <circle cx="48" cy="28" r="5.5" fill="#08152f" />
                    <circle cx="48" cy="28" r="2.2" fill="#ffc400" />
                    <line x1="43.5" y1="28" x2="52.5" y2="28" stroke="#08152f" strokeWidth="1.2" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <p className="tamil-line" lang="ta">
            உறுதியான தரம்… வலிமையான நம்பிக்கை… · தரம் எங்கள் அடையாளம்
          </p>
          <div className="who-mini">
            <span className="who-mini-icon">
              <Factory size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>In-House Manufacturing</h3>
              <p>Cast at our own Peraiyur yard</p>
            </div>
          </div>
          <div className="who-mini">
            <span className="who-mini-icon">
              <Truck size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>Delivery Available</h3>
              <p lang="ta">டெலிவரி வசதி உண்டு</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

const css = `
.wwr { --cycle: 10s; }

/* ---------- scene (finished state by default) ---------- */
.wwr-scene {
  position: relative;
  height: 172px;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 14px;
  background: linear-gradient(180deg, #cfe0f7, #eef3fb 72%);
  isolation: isolate;
}
.wwr-factory { position: absolute; bottom: 26px; left: 10px; width: 70px; }
.wwr-house { position: absolute; right: 10px; bottom: 26px; width: 70px; }
.wwr-road { position: absolute; right: 0; bottom: 0; left: 0; height: 26px; background: #0a1c40; }
.wwr-road::after {
  content: "";
  position: absolute;
  top: 12px;
  right: 10px;
  left: 10px;
  height: 2px;
  background: repeating-linear-gradient(90deg, #ffc400 0 12px, transparent 12px 22px);
}

.wwr-cloud {
  position: absolute;
  width: 52px;
  height: 15px;
  border-radius: 99px;
  background: #fff;
  box-shadow: 16px -7px 0 -1px #fff, 30px -2px 0 -3px #fff;
}
.wwr-cloud--a { top: 24px; left: 34%; }
.wwr-cloud--b { top: 54px; left: 58%; scale: 0.75; opacity: 0.85; }

.wwr-smoke {
  position: absolute;
  bottom: 80px;
  left: 64px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgb(8 21 47 / 26%);
  opacity: 0;
}

.wwr-tag {
  position: absolute;
  right: 6px;
  bottom: 88px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px 5px 7px;
  border-radius: 99px;
  background: #0a1c40;
  color: #fff;
  font: 800 0.72rem/1 var(--font-heading, inherit);
}
.wwr-tag svg { padding: 2px; border-radius: 50%; background: #ffc400; color: #0a1c40; box-sizing: content-box; }
.wwr-tag::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #0a1c40;
  rotate: 45deg;
  translate: -50% 0;
}

.wwr-truck {
  position: absolute;
  bottom: 7px;
  left: calc(100% - 78px);
  z-index: 1;
  width: 66px;
}
.wwr-flip { transform-origin: 50% 50%; }
.wwr-truck svg { display: block; width: 100%; overflow: visible; }
.wwr-wheel { transform-box: fill-box; transform-origin: center; }

/* ---------- the loop ---------- */
.wwr-truck { animation: wwr-go var(--cycle) infinite; }
.wwr-flip { animation: wwr-turn var(--cycle) infinite; }
.wwr-wheel { animation: wwr-spin var(--cycle) linear infinite; }
.wwr-win { animation: wwr-lamp var(--cycle) infinite; }
.wwr-tag { animation: wwr-tag var(--cycle) infinite; }
.wwr-smoke { animation: wwr-smoke 2.7s ease-out infinite; }
.wwr-cloud { animation: wwr-drift 16s ease-in-out infinite alternate; }

/* only run while armed and on screen */
.wwr.is-armed .wwr-x { animation-play-state: paused; }
.wwr.is-armed.is-in .wwr-x { animation-play-state: running; }

@keyframes wwr-go {
  0%, 8% { left: 8px; animation-timing-function: cubic-bezier(0.5, 0, 0.3, 1); }
  45%, 56% { left: calc(100% - 78px); animation-timing-function: cubic-bezier(0.5, 0, 0.3, 1); }
  92%, 100% { left: 8px; }
}
@keyframes wwr-turn {
  0%, 55.9% { transform: scaleX(1); }
  56%, 100% { transform: scaleX(-1); }
}
@keyframes wwr-spin {
  0%, 8% { rotate: 0deg; animation-timing-function: cubic-bezier(0.5, 0, 0.3, 1); }
  45%, 56% { rotate: 1080deg; animation-timing-function: cubic-bezier(0.5, 0, 0.3, 1); }
  92%, 100% { rotate: 2160deg; }
}
@keyframes wwr-lamp {
  0%, 44% { fill: #9fb3d1; }
  48%, 74% { fill: #ffc400; }
  86%, 100% { fill: #9fb3d1; }
}
@keyframes wwr-tag {
  0%, 45% { opacity: 0; scale: 0.6; translate: 0 6px; }
  49% { opacity: 1; scale: 1.08; translate: 0 0; }
  52%, 68% { opacity: 1; scale: 1; translate: 0 0; }
  74%, 100% { opacity: 0; scale: 0.9; translate: 0 0; }
}
@keyframes wwr-smoke {
  0% { opacity: 0; translate: 0 0; scale: 0.6; }
  20% { opacity: 1; }
  100% { opacity: 0; translate: 8px -40px; scale: 2.2; }
}
@keyframes wwr-drift { to { translate: 36px 0; } }

/* ---------- small screens ---------- */
@media (max-width: 480px) {
  .wwr-scene { height: 156px; }
}

/* ---------- reduced motion: finished state, nothing moves ---------- */
@media (prefers-reduced-motion: reduce) {
  .wwr *, .wwr *::before, .wwr *::after { animation: none !important; }
}
`;

/* =========================================================
   FivePromises — "the inspection line"
   ========================================================= */

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export function FivePromises() {
  const rootRef = useRef<HTMLElement>(null);
  // FIX: this ref is attached to a <div className="fp-list">, so it is typed as HTMLDivElement
  const listRef = useRef<HTMLDivElement>(null);

  // scroll-linked scanner: fills the line and checks the cards it passes
  useEffect(() => {
    const root = rootRef.current, list = listRef.current;
    if (!root || !list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("is-armed");

    const cards = Array.from(list.querySelectorAll<HTMLElement>(".fp-card"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = list.getBoundingClientRect();
      const y = clamp(window.innerHeight * 0.6 - box.top, 0, box.height);
      list.style.setProperty("--fill", `${y}px`);
      list.style.setProperty("--on", y > 0 && y < box.height ? "1" : "0");
      cards.forEach((card) => {
        const node = card.querySelector<HTMLElement>(".fp-node");
        if (!node) return;
        const ny = node.getBoundingClientRect().top - box.top + node.offsetHeight / 2;
        card.classList.toggle("is-passed", y >= ny);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // spotlight + tilt on hover
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 7}deg`);
  };
  const onLeave = (e: PointerEvent<HTMLElement>) => {
    const s = e.currentTarget.style;
    s.setProperty("--rx", "0deg");
    s.setProperty("--ry", "0deg");
  };

  return (
    <section className="section section--paper fp" id="promises" ref={rootRef}>
      <style>{css1}</style>
      <div className="container">
        <div className="section-heading section-heading--center">
          <span className="eyebrow">Five years of trust, built on five promises</span>
          <h2>
            What every JPS load
            <br />
            <span className="fp-accent">carries with it.</span>
          </h2>
          <p>These are not marketing lines. They are the five checks a block has to pass before it leaves our yard.</p>
        </div>

        <div className="fp-list" ref={listRef}>
          <div className="fp-rail" aria-hidden="true">
            <i className="fp-fill" />
          </div>
          <div className="fp-scan" aria-hidden="true" />
          <div className="fp-head" aria-hidden="true" />

          <ol className="fp-cards" role="list">
            {promises.map(({ icon: Icon, title, description, tamil }, index) => (
              <li
                className="fp-card"
                key={title}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                style={{ ["--k" as string]: index } as CSSProperties}
              >
                <i className="fp-strip" aria-hidden="true" />
                <span className="fp-node" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="fp-ghost" aria-hidden="true">
                  0{index + 1}
                </span>

                <div className="fp-top">
                  <div className="fp-icon">
                    <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="fp-stampwrap" aria-hidden="true">
                    <span className="fp-burst">
                      {Array.from({ length: 8 }, (_, i) => (
                        <i key={i} style={{ ["--a" as string]: `${i * 45}deg` } as CSSProperties} />
                      ))}
                    </span>
                    <span className="fp-stamp">
                      <Check size={16} strokeWidth={3.4} />
                      Passed
                    </span>
                  </span>
                </div>

                <h3>{title}</h3>
                <p>{description}</p>
                <span className="fp-tamil" lang="ta">
                  {tamil}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const css1 = `
.fp {
  --navy: var(--brand-navy, #0a1c40);
  --gold: var(--brand-gold, #ffc400);
  --red: var(--brand-red, #e30613);
  --gutter: 64px;   /* distance from card to the line */
}

/* ---------- heading: one gold shine across the accent line ---------- */
.fp .section-heading h2 .fp-accent {
  --acc: var(--red);
  color: transparent;
  background-image: linear-gradient(100deg, var(--acc) 42%, var(--gold) 50%, var(--acc) 58%);
  background-size: 250% 100%;
  background-position: 0 0;
  -webkit-background-clip: text;
  background-clip: text;
  animation: fp-shine 2.2s ease 0.5s both;
}

/* ---------- the line ---------- */
.fp-list { position: relative; max-width: 1040px; margin: clamp(36px, 5vw, 64px) auto 0; }
.fp-cards {
  display: grid;
  gap: clamp(26px, 4vw, 52px);
  margin: 0;
  padding: 8px 0;
  list-style: none;
}
.fp-rail {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  translate: -1px 0;
  background: repeating-linear-gradient(180deg, rgb(8 21 47 / 30%) 0 8px, transparent 8px 16px);
}
.fp-fill {
  position: absolute;
  top: 0;
  left: -1px;
  width: 4px;
  height: var(--fill, 100%);
  border-radius: 2px;
  background: linear-gradient(180deg, var(--gold), #ffd95c);
  box-shadow: 0 0 14px rgb(255 196 0 / 70%);
}
.fp-scan {
  position: absolute;
  top: var(--fill, 100%);
  right: 0;
  left: 0;
  height: 2px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgb(255 196 0 / 70%) 22%, rgb(255 196 0 / 70%) 78%, transparent);
  box-shadow: 0 0 16px rgb(255 196 0 / 55%);
  opacity: var(--on, 0);
  transition: opacity 0.3s;
}
.fp-head {
  position: absolute;
  top: var(--fill, 100%);
  left: 50%;
  z-index: 3;
  width: 16px;
  height: 16px;
  translate: -50% -50%;
  border: 3px solid #fff;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 4px rgb(255 196 0 / 35%), 0 0 22px 6px rgb(255 196 0 / 60%);
  opacity: var(--on, 0);
  transition: opacity 0.3s;
  animation: fp-beat 1.2s ease-in-out infinite;
}
.fp:not(.is-armed) .fp-scan, .fp:not(.is-armed) .fp-head { display: none; }

/* ---------- cards (finished state by default) ---------- */
.fp-card {
  position: relative;
  width: calc(50% - var(--gutter));
  padding: 26px 26px 28px;
  list-style: none;
  border: 1.5px solid rgb(8 21 47 / 16%);
  border-radius: 16px;
  background: #fff;
  color: var(--navy);
  box-shadow: 0 18px 34px -24px rgb(8 21 47 / 55%);
  transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.25s ease-out, opacity 0.6s ease, translate 0.6s cubic-bezier(0.3, 1.2, 0.5, 1), filter 0.6s ease;
}
.fp-card:nth-of-type(odd) { justify-self: start; }
.fp-card:nth-of-type(even) { justify-self: end; }
.fp-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgb(255 196 0 / 22%), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}
.fp-card:hover::before { opacity: 1; }
.fp-strip { position: absolute; top: -1.5px; right: 24px; left: 24px; height: 4px; border-radius: 0 0 4px 4px; background: var(--gold); transform-origin: left; transition: transform 0.6s ease 0.1s; }

/* checkpoint on the line + connector to the card */
.fp-node {
  position: absolute;
  top: 28px;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 2px solid var(--navy);
  border-radius: 50%;
  background: var(--gold);
  color: var(--navy);
  font: 800 0.8rem/1 var(--font-heading, inherit);
  z-index: 4;
  transition: background-color 0.3s, color 0.3s;
}
.fp-node::after { content: ""; position: absolute; inset: -2px; border: 2px solid var(--gold); border-radius: 50%; opacity: 0; }
.fp-card:nth-of-type(odd) .fp-node { left: calc(100% + var(--gutter) - 22px); }
.fp-card:nth-of-type(even) .fp-node { left: calc(var(--gutter) * -1 - 22px); }
.fp-card:nth-of-type(odd)::after, .fp-card:nth-of-type(even)::after {
  content: "";
  position: absolute;
  top: 49px;
  width: calc(var(--gutter) - 22px);
  height: 2px;
  background: var(--gold);
  transition: transform 0.4s ease 0.15s;
}
.fp-card:nth-of-type(odd)::after { left: 100%; transform-origin: left; }
.fp-card:nth-of-type(even)::after { right: 100%; transform-origin: right; }

.fp-ghost {
  position: absolute;
  right: 16px;
  bottom: 8px;
  font: 800 5rem/0.8 var(--font-heading, inherit);
  color: rgb(8 21 47 / 5%);
  pointer-events: none;
  user-select: none;
}
.fp-top { position: relative; display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
.fp-icon { display: grid; width: 52px; height: 52px; place-items: center; border-radius: 12px; background: var(--navy); color: var(--gold); box-shadow: inset 0 -4px 0 rgb(0 0 0 / 22%); }
.fp-icon svg * { stroke-dasharray: 100; stroke-dashoffset: 0; transition: stroke-dashoffset 0.9s ease 0.25s; }
.fp-card h3 { margin: 0 0 8px; font: 800 1.2rem/1.25 var(--font-heading, inherit); }
.fp-card p { margin: 0; font-size: 0.98rem; line-height: 1.65; color: rgb(8 21 47 / 80%); }
.fp-tamil { display: block; margin-top: 12px; padding-left: 12px; border-left: 3px solid var(--gold); font-size: 0.95rem; line-height: 1.5; color: rgb(8 21 47 / 68%); }

/* the stamp */
.fp-stampwrap { position: relative; display: grid; width: 82px; height: 82px; margin: -6px -4px 0 0; place-items: center; }
.fp-stamp {
  display: grid;
  width: 76px;
  height: 76px;
  place-content: center;
  justify-items: center;
  gap: 2px;
  rotate: -12deg;
  border: 3px solid var(--red);
  border-radius: 50%;
  outline: 1.5px solid var(--red);
  outline-offset: -9px;
  color: var(--red);
  font: 800 0.72rem/1 var(--font-heading, inherit);
  mix-blend-mode: multiply;
  opacity: 0.92;
}
.fp-burst { position: absolute; inset: 0; pointer-events: none; }
.fp-burst i {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 12px;
  margin: -6px 0 0 -1.5px;
  border-radius: 2px;
  background: var(--gold);
  opacity: 0;
}

/* ---------- armed: cards start unchecked, scanner checks them ---------- */
.fp.is-armed .fp-card:not(.is-passed) { opacity: 0.55; translate: 0 18px; filter: saturate(0.35); }
.fp.is-armed .fp-card:not(.is-passed) .fp-strip { transform: scaleX(0); }
.fp.is-armed .fp-card:not(.is-passed)::after { transform: scaleX(0); }
.fp.is-armed .fp-card:not(.is-passed) .fp-node { background: #fff; }
.fp.is-armed .fp-card:not(.is-passed) .fp-icon svg * { stroke-dashoffset: 100; }
.fp.is-armed .fp-card:not(.is-passed) .fp-stamp { opacity: 0; }

.fp.is-armed .fp-card.is-passed { animation: fp-shake 0.4s ease 0.32s; }
.fp.is-armed .fp-card.is-passed .fp-stamp { animation: fp-slam 0.55s cubic-bezier(0.3, 1, 0.4, 1) 0.28s both; }
.fp.is-armed .fp-card.is-passed .fp-node::after { animation: fp-ring 0.9s ease-out; }
.fp.is-armed .fp-card.is-passed .fp-burst i { animation: fp-burst 0.6s ease-out 0.4s both; }

/* ---------- keyframes ---------- */
@keyframes fp-shine { from { background-position: 100% 0; } }
@keyframes fp-beat { 50% { scale: 1.25; } }
@keyframes fp-slam {
  0% { opacity: 0; scale: 2.5; rotate: -34deg; }
  55% { opacity: 1; scale: 0.9; rotate: -10deg; }
  78% { scale: 1.05; rotate: -13deg; }
  100% { opacity: 0.92; scale: 1; rotate: -12deg; }
}
@keyframes fp-shake {
  0%, 100% { translate: 0 0; }
  25% { translate: -3px 2px; }
  50% { translate: 3px -1px; }
  75% { translate: -2px 1px; }
}
@keyframes fp-ring { from { opacity: 0.9; scale: 1; } to { opacity: 0; scale: 2.2; } }
@keyframes fp-burst {
  0% { opacity: 1; transform: rotate(var(--a)) translateY(-32px) scaleY(1); }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(-58px) scaleY(0.4); }
}

/* ---------- small screens: the line moves to the left edge ---------- */
@media (max-width: 760px) {
  .fp { --gutter: 64px; }
  .fp-rail { left: 22px; }
  .fp-head { left: 22px; }
  .fp-card { width: auto; margin-left: var(--gutter); }
  .fp-card:nth-of-type(odd), .fp-card:nth-of-type(even) { justify-self: stretch; }
  .fp-card:nth-of-type(odd) .fp-node, .fp-card:nth-of-type(even) .fp-node { left: calc(var(--gutter) * -1); }
  .fp-card:nth-of-type(odd)::after, .fp-card:nth-of-type(even)::after { right: 100%; left: auto; width: calc(var(--gutter) - 44px); transform-origin: right; }
  .fp-stampwrap { width: 68px; height: 68px; }
  .fp-stamp { width: 62px; height: 62px; outline-offset: -7px; }
}

/* ---------- reduced motion: finished state, nothing moves ---------- */
@media (prefers-reduced-motion: reduce) {
  .fp *, .fp *::before, .fp *::after { animation: none !important; transition: none !important; }
  .fp-card { transform: none; }
}
`;

/* =========================================================
   Journey — "from one yard to the whole district"
   ========================================================= */

const JR_SITES = 450;
const JR_LINES = 11;
const JR_DOTS = 72; // drawn sites (an illustration, not a count)
const JR_R = 140; // outer radius in the 300x300 map
const JR_R0 = 18; // radius of the yard

/* counts up smoothly; snaps when going back to zero or when not animating */
function useJourneyTween(target: number, on: boolean) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (!on || target === 0) {
      cur.current = target;
      setV(target);
      return;
    }
    const from = cur.current, t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 700);
      const val = from + (target - from) * (1 - Math.pow(1 - k, 3));
      cur.current = val;
      setV(val);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, on]);
  return Math.round(v);
}

export function Journey() {
  const rootRef = useRef<HTMLElement>(null);
  // FIX: this ref is attached to an <ol className="jr-timeline">, so it is typed as HTMLOListElement
  const listRef = useRef<HTMLOListElement>(null);
  const n = journey.length;
  const [armed, setArmed] = useState(false);
  const [step, setStep] = useState(n); // how many chapters have been reached

  // chapter is "reached" once it crosses ~55% of the viewport height
  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    setStep(0);
    const items = Array.from(list.children);
    const reached = items.map(() => false);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = items.indexOf(e.target);
          if (i >= 0) reached[i] = e.isIntersecting || e.boundingClientRect.top < (e.rootBounds?.top ?? 0);
        });
        let s = 0;
        reached.forEach((r, i) => {
          if (r) s = i + 1;
        });
        setStep(s);
      },
      { rootMargin: "0px 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [n]);

  const frac = n ? step / n : 1;
  const sites = useJourneyTween(armed ? Math.round(JR_SITES * frac) : JR_SITES, armed);
  const lines = useJourneyTween(armed ? Math.round(JR_LINES * frac) : JR_LINES, armed);

  const band = (JR_R - JR_R0) / Math.max(n, 1);
  // sites spread evenly (golden angle), each belongs to the ring it sits in
  const dots = useMemo(
    () =>
      Array.from({ length: JR_DOTS }, (_, k) => {
        const a = k * 2.399963;
        const r = JR_R0 + Math.sqrt((k + 0.5) / JR_DOTS) * (JR_R - JR_R0);
        return {
          k,
          x: 150 + r * Math.cos(a),
          y: 150 + r * Math.sin(a),
          ring: Math.min(Math.max(n - 1, 0), Math.floor((r - JR_R0) / band)),
        };
      }),
    [n, band],
  );

  const cur = n ? journey[Math.min(n - 1, Math.max(0, step - 1))] : null;

  return (
    <section className={`section jr${armed ? " is-armed" : ""}`} id="journey" ref={rootRef}>
      <style>{journeyCss}</style>
      <div className="container journey-grid">
        <div className="journey-intro">
          <div className="section-heading">
            <span className="eyebrow">Our journey</span>
            <h2>
              How a small casting yard became
              <br />
              <span>a district supplier.</span>
            </h2>
            <p>
              Growth here has been steady rather than sudden — each new product line added only once we could make it
              properly.
            </p>
          </div>

          <div className="journey-stats">
            <div className="journey-stat">
              <strong aria-hidden="true">
                {sites}
                <span>+</span>
              </strong>
              <span className="jr-sr">450 plus</span>
              <small>Sites supplied</small>
            </div>
            <div className="journey-stat">
              <strong aria-hidden="true">{lines}</strong>
              <span className="jr-sr">11</span>
              <small>Product lines</small>
            </div>
          </div>

          {/* ---------- the growing coverage map ---------- */}
          <div className="jr-map" aria-hidden="true">
            <i className="jr-sweep" />
            <svg className="jr-svg" viewBox="0 0 300 300">
              {Array.from({ length: n }, (_, i) => {
                const r = JR_R0 + (i + 1) * band;
                const on = i < step;
                return (
                  <g key={i}>
                    <circle className={`jr-ring${on ? " is-on" : ""}`} cx="150" cy="150" r={r} />
                    {on && <circle className="jr-wave" cx="150" cy="150" r={r} />}
                  </g>
                );
              })}
              {dots.map((d) => (
                <circle
                  key={d.k}
                  className={`jr-site${d.ring < step ? " is-on" : ""}${d.k % 9 === 0 ? " is-gold" : ""}`}
                  cx={d.x.toFixed(1)}
                  cy={d.y.toFixed(1)}
                  r="2.8"
                  style={{ ["--k" as string]: d.k % 12 } as CSSProperties}
                />
              ))}
              <circle className="jr-pulse" cx="150" cy="150" r="10" />
              <rect x="143" y="143" width="14" height="14" rx="3" className="jr-yard" />
              <circle cx="150" cy="150" r="3" className="jr-yard-dot" />
            </svg>
            {cur && (
              <div className="jr-cap" key={cur.title} style={{ opacity: armed && step === 0 ? 0.45 : 1 }}>
                <b>{cur.year}</b>
                <span>{cur.title}</span>
              </div>
            )}
          </div>
        </div>

        <ol className="jr-timeline" ref={listRef}>
          {journey.map((item, index) => (
            <li className={`jr-item${index < step ? " is-reached" : ""}`} key={item.title}>
              <span className="jr-dot" aria-hidden="true">
                {index + 1}
              </span>
              <span className="step-kicker">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const journeyCss = `
.jr {
  --navy: var(--brand-navy, #0a1c40);
  --gold: var(--brand-gold, #ffc400);
  --red: var(--brand-red, #e30613);
}
.jr-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* ---------- coverage map ---------- */
.jr-map {
  position: relative;
  width: min(100%, 320px);
  aspect-ratio: 1;
  margin-top: 28px;
  overflow: hidden;
  border-radius: 22px;
  background:
    linear-gradient(rgb(255 255 255 / 6%) 1px, transparent 1px) 0 0 / 28px 28px,
    linear-gradient(90deg, rgb(255 255 255 / 6%) 1px, transparent 1px) 0 0 / 28px 28px,
    radial-gradient(circle at 50% 50%, #17336a, var(--navy) 72%);
  box-shadow: inset 0 0 0 2px rgb(255 255 255 / 10%), 0 26px 40px -26px rgb(8 21 47 / 75%);
}
.jr-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.jr-sweep {
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0 292deg, rgb(255 196 0 / 26%) 360deg);
  -webkit-mask: radial-gradient(circle, transparent 0 7%, #000 8%);
  mask: radial-gradient(circle, transparent 0 7%, #000 8%);
  animation: jr-sweep 7s linear infinite;
  pointer-events: none;
}
.jr-ring, .jr-wave { fill: none; transform-box: fill-box; transform-origin: center; }
.jr-ring { stroke: rgb(255 196 0 / 85%); stroke-width: 1.4; stroke-dasharray: 3 5; transition: scale 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.15), opacity 0.6s; }
.jr-wave { stroke: var(--gold); stroke-width: 3; opacity: 0; animation: jr-wave 1.2s ease-out; }
.jr-site { fill: #fff; transform-box: fill-box; transform-origin: center; transition: scale 0.5s cubic-bezier(0.3, 1.8, 0.5, 1), opacity 0.4s; transition-delay: calc(var(--k) * 45ms + 250ms); }
.jr-site.is-gold { fill: var(--gold); }
.jr-yard { fill: var(--navy); stroke: var(--gold); stroke-width: 2.2; }
.jr-yard-dot { fill: var(--gold); }
.jr-pulse { fill: none; stroke: var(--gold); stroke-width: 1.5; transform-box: fill-box; transform-origin: center; animation: jr-pulse 2.4s ease-out infinite; }
.jr-cap { position: absolute; bottom: 14px; left: 16px; display: grid; gap: 2px; max-width: 78%; color: #fff; transition: opacity 0.4s; animation: jr-cap 0.5s cubic-bezier(0.3, 1.3, 0.5, 1); }
.jr-cap b { font: 800 1.7rem/1 var(--font-heading, inherit); color: var(--gold); }
.jr-cap span { overflow: hidden; font-size: 0.8rem; line-height: 1.3; text-overflow: ellipsis; white-space: nowrap; color: rgb(255 255 255 / 85%); }

/* map starts as just the yard, grows as chapters are reached */
.jr.is-armed .jr-ring:not(.is-on) { scale: 0.55; opacity: 0; }
.jr.is-armed .jr-site:not(.is-on) { scale: 0; opacity: 0; }

/* ---------- timeline ---------- */
.jr-timeline { display: grid; gap: 38px; margin: 0; padding: 0; list-style: none; }
.jr-item {
  position: relative;
  padding-left: 74px;
  transition: opacity 0.7s ease, filter 0.7s ease, translate 0.7s cubic-bezier(0.3, 1.1, 0.5, 1);
}
.jr-item:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 52px;
  bottom: -34px;
  left: 22px;
  border-left: 2px dashed rgb(8 21 47 / 28%);
  transition: border-color 0.6s;
}
.jr-item.is-reached:not(:last-child)::before { border-color: var(--gold); }

@property --jr-a { syntax: "<angle>"; inherits: false; initial-value: 360deg; }
.jr-dot {
  --jr-a: 360deg;
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 2px solid var(--navy);
  border-radius: 50%;
  background: conic-gradient(var(--gold) var(--jr-a), #fff 0);
  color: var(--navy);
  font: 800 0.95rem/1 var(--font-heading, inherit);
  transition: --jr-a 0.9s ease;
}
.jr-item h3 { margin: 6px 0 8px; }
.jr-item p { margin: 0; }

/* chapters start soft, then come into focus when reached */
.jr.is-armed .jr-item:not(.is-reached) { opacity: 0.4; filter: blur(2.5px); translate: 16px 0; }
.jr.is-armed .jr-item:not(.is-reached) .jr-dot { --jr-a: 0deg; }

/* ---------- desktop: the intro (and map) stays in view ---------- */
@media (min-width: 901px) and (min-height: 760px) {
  .jr .journey-intro { position: sticky; top: 90px; align-self: start; }
}

/* ---------- keyframes ---------- */
@keyframes jr-sweep { to { rotate: 360deg; } }
@keyframes jr-wave { from { opacity: 0.8; scale: 0.9; } to { opacity: 0; scale: 1.18; } }
@keyframes jr-pulse { from { opacity: 0.9; scale: 1; } to { opacity: 0; scale: 3; } }
@keyframes jr-cap { from { opacity: 0; translate: 0 10px; } }

/* ---------- reduced motion: finished state, nothing moves ---------- */
@media (prefers-reduced-motion: reduce) {
  .jr *, .jr *::before, .jr *::after { animation: none !important; transition: none !important; }
  .jr-wave { display: none; }
}
.jr:not(.is-armed) .jr-wave { display: none; }
`;

/* =========================================================
   Commitment — "the blueprint board + the foundation"
   ========================================================= */

/* true once the element has scrolled into view */
function useCmSeen<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/* words that slide up out of a mask, one after another */
function CmWords({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={w + i}>
          <span className="cm-w">
            <i style={{ ["--i" as string]: start + i } as CSSProperties}>{w}</i>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

const cmCss = `
.cm {
  position: relative;
  overflow: hidden;
  background: #061538;
}

/* =====================================================
   TOP: header + blueprint board
   ===================================================== */
.cm-top {
  position: relative;
  z-index: 2;
  isolation: isolate;
  display: flow-root; /* keeps the board's negative margin inside, so it overlaps the dark band */
  background: var(--paper, #f2f4f7);
}
.cm-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}
.cm-bgwall {
  position: absolute;
  inset: -80px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Cpath d='M0 .5H120M0 40.5H120M.5 0V40M60.5 40V80' stroke='%23003a8f' stroke-opacity='.07' fill='none'/%3E%3C/svg%3E");
  background-size: 120px 80px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, #000 20%, transparent 75%);
  animation: cm-drift 40s linear infinite;
}
.cm-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  animation: cm-float 14s ease-in-out infinite alternate;
}
.cm-blob--blue { top: -10%; left: -6%; width: 360px; height: 360px; background: rgb(0 58 143 / 13%); }
.cm-blob--gold { top: 6%; right: -5%; width: 320px; height: 320px; background: rgb(255 196 0 / 24%); animation-delay: -6s; }

/* plumb bob */
.cm-plumb {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 50%;
  width: 0;
  height: 0;
  opacity: 0;
  transform-origin: top center;
}
.cm-string {
  position: absolute;
  top: 0;
  left: -0.75px;
  width: 1.5px;
  height: 58px;
  background: #25334a;
}
.cm-bob {
  position: absolute;
  top: 56px;
  left: -11px;
  width: 22px;
  height: 32px;
  background: linear-gradient(160deg, #ffd23d, #c99700);
  clip-path: polygon(50% 100%, 0 28%, 18% 0, 82% 0, 100% 28%);
}
.cm-top.is-in .cm-plumb {
  animation:
    cm-plumb 3.4s ease 0.2s both,
    cm-sway 6s ease-in-out 3.6s infinite alternate;
}

/* header */
.cm-head {
  padding-top: 112px;
  text-align: center;
}
.cm-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--brand-blue);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0;
}
.cm-eyebrow::before,
.cm-eyebrow::after {
  width: 28px;
  height: 2px;
  background: var(--brand-gold);
  content: "";
  transform: scaleX(0);
}
.cm-eyebrow::before { transform-origin: right; }
.cm-eyebrow::after { transform-origin: left; }
.cm-top.is-in .cm-eyebrow { animation: cm-fade 0.6s ease 0.2s forwards; }
.cm-top.is-in .cm-eyebrow::before,
.cm-top.is-in .cm-eyebrow::after { animation: cm-draw 0.7s cubic-bezier(0.6, 0, 0.2, 1) 0.4s forwards; }

.cm-head h2 {
  margin: 16px 0 0;
  color: var(--heading-ink);
  font: 800 clamp(2.1rem, 4.6vw, 3.8rem) / 1.1 var(--font-heading);
  letter-spacing: -0.06em;
}
.cm-w {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding-bottom: 0.14em;
  margin-bottom: -0.14em;
}
.cm-w > i {
  display: inline-block;
  font-style: normal;
  transform: translateY(115%) rotate(5deg);
}
.cm-top.is-in .cm-w > i {
  animation: cm-rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: calc(0.4s + var(--i) * 0.1s);
}
.cm-mark {
  position: relative;
  color: var(--brand-blue);
}
.cm-mark::after {
  position: absolute;
  z-index: -1;
  right: -6px;
  bottom: 0.06em;
  left: -6px;
  height: 0.34em;
  border-radius: 3px;
  background: linear-gradient(90deg, rgb(255 196 0 / 75%), rgb(255 196 0 / 25%));
  content: "";
  transform: scaleX(0);
  transform-origin: left;
}
.cm-top.is-in .cm-mark::after { animation: cm-draw 0.9s cubic-bezier(0.6, 0, 0.2, 1) 1.6s forwards; }

/* spirit level */
.cm-level {
  position: relative;
  width: 240px;
  height: 27px;
  margin: 26px auto 24px;
  border-radius: 7px;
  background: linear-gradient(180deg, #ffd23d, #d9a300);
  box-shadow: 0 8px 16px rgb(8 21 47 / 18%), inset 0 -3px 0 rgb(0 0 0 / 15%);
  opacity: 0;
}
.cm-level::before,
.cm-level::after {
  position: absolute;
  top: 9.5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(0 0 0 / 22%);
  content: "";
}
.cm-level::before { left: 14px; }
.cm-level::after { right: 14px; }
.cm-top.is-in .cm-level { animation: cm-level 2.4s ease 1s forwards; }
.cm-vial {
  position: absolute;
  top: 6.5px;
  left: 50%;
  width: 80px;
  height: 14px;
  margin-left: -40px;
  overflow: hidden;
  border-radius: 8px;
  background: linear-gradient(180deg, #ecfacd, #bfe67f);
  box-shadow: inset 0 2px 3px rgb(0 0 0 / 22%);
}
.cm-vial::before,
.cm-vial::after {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgb(0 0 0 / 35%);
  content: "";
}
.cm-vial::before { left: calc(50% - 13px); }
.cm-vial::after { left: calc(50% + 13px); }
.cm-bubble {
  position: absolute;
  top: 2px;
  left: 50%;
  width: 18px;
  height: 10px;
  margin-left: -9px;
  border-radius: 50%;
  background: rgb(255 255 255 / 85%);
  box-shadow: inset 0 -2px 2px rgb(0 0 0 / 12%);
}
.cm-top.is-in .cm-bubble { animation: cm-bubble 2.4s ease 1s both; }

.cm-lead {
  max-width: 660px;
  margin: 0 auto;
  color: #596678;
  font-size: 16px;
  line-height: 1.85;
  opacity: 0;
}
.cm-top.is-in .cm-lead { animation: cm-fade-up 0.8s ease 1.2s forwards; }

/* ---------- the board ---------- */
.cm-stage {
  position: relative;
  z-index: 3;
  margin-top: 54px;
  margin-bottom: -100px;
}
.cm-board {
  position: relative;
  aspect-ratio: 1160 / 480;
  border-radius: 22px;
  background:
    linear-gradient(rgb(255 255 255 / 8%) 1px, transparent 1px) 0 0 / 24px 24px,
    linear-gradient(90deg, rgb(255 255 255 / 8%) 1px, transparent 1px) 0 0 / 24px 24px,
    linear-gradient(rgb(255 255 255 / 15%) 1px, transparent 1px) 0 0 / 120px 120px,
    linear-gradient(90deg, rgb(255 255 255 / 15%) 1px, transparent 1px) 0 0 / 120px 120px,
    linear-gradient(160deg, #0d3a8c, #0a2250);
  box-shadow: 0 40px 80px rgb(8 21 47 / 35%);
  clip-path: inset(0 0 100% 0 round 22px);
}
.cm-top.is-in .cm-board { animation: cm-unroll 1.1s cubic-bezier(0.6, 0, 0.2, 1) 1.4s forwards; }
.cm-board::before {
  position: absolute;
  inset: 12px;
  border: 1px dashed rgb(255 196 0 / 38%);
  border-radius: 14px;
  content: "";
  pointer-events: none;
}
/* dimension line */
.cm-dim {
  position: absolute;
  right: 6%;
  bottom: 22px;
  left: 6%;
  height: 1px;
  background: rgb(255 255 255 / 55%);
  transform: scaleX(0);
}
.cm-dim::before,
.cm-dim::after {
  position: absolute;
  top: -6px;
  width: 1px;
  height: 13px;
  background: rgb(255 255 255 / 75%);
  content: "";
}
.cm-dim::before { left: 0; }
.cm-dim::after { right: 0; }
.cm-dim i {
  position: absolute;
  top: -4px;
  left: calc(50% - 4px);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-gold);
}
.cm-top.is-in .cm-dim { animation: cm-draw 0.9s cubic-bezier(0.6, 0, 0.2, 1) 2.6s forwards; }

/* pinned photos */
.cm-pic {
  position: absolute;
  opacity: 0;
  transform: rotate(var(--r));
  transform-origin: 50% 0;
}
.cm-pic--a { top: 10%; left: 25%; z-index: 3; width: 50%; --r: -2deg; }
.cm-pic--b { top: 30%; left: 3%; z-index: 1; width: 29%; --r: -7deg; }
.cm-pic--c { top: 21%; right: 3%; z-index: 2; width: 29%; --r: 6deg; }
.cm-pic:hover { z-index: 6; }
.cm-top.is-in .cm-pic {
  animation: cm-pin 1.8s ease both;
  animation-delay: calc(2.1s + var(--d) * 0.5s);
}
.cm-card {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: 6px solid #fff;
  border-radius: 8px;
  background: #d1d5db;
  box-shadow: 0 26px 50px rgb(0 0 0 / 38%);
  aspect-ratio: 4 / 3;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease;
}
.cm-pic--a .cm-card { aspect-ratio: 16 / 10; }
.cm-card:hover {
  box-shadow: 0 34px 60px rgb(0 0 0 / 46%);
  transform: scale(1.04) rotate(0.6deg);
}
.cm-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.cm-card:hover img { transform: scale(1.06); }
/* quality-scan sweep */
.cm-card::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 38%, rgb(255 210 61 / 40%) 50%, transparent 62%);
  content: "";
  opacity: 0;
  pointer-events: none;
  transform: translateX(-130%);
}
.cm-top.is-in .cm-card::after {
  animation: cm-scan 6.5s ease-in-out infinite;
  animation-delay: calc(5s + var(--d) * 0.8s);
}
/* red push-pin */
.cm-pin {
  position: absolute;
  z-index: 2;
  top: -10px;
  left: calc(50% - 10px);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ff8087, #e30613 55%, #8f020b);
  box-shadow: 0 6px 8px rgb(0 0 0 / 40%);
}
/* hazard-tape strip */
.cm-strip {
  position: absolute;
  z-index: 2;
  top: -15px;
  left: calc(50% - 50px);
  width: 100px;
  height: 28px;
  background: repeating-linear-gradient(45deg, rgb(255 196 0 / 92%) 0 9px, rgb(8 21 47 / 85%) 9px 18px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 28%);
  clip-path: polygon(0 0, 100% 0, 98% 25%, 100% 50%, 98% 75%, 100% 100%, 0 100%, 2% 75%, 0 50%, 2% 25%);
  transform: rotate(-3deg);
}

/* seal */
.cm-seal {
  position: absolute;
  z-index: 6;
  top: -38px;
  right: 22px;
  display: grid;
  width: 112px;
  height: 112px;
  place-items: center;
  color: var(--deep-navy, #08152f);
  border-radius: 50%;
  background: var(--brand-gold);
  box-shadow: 0 12px 28px rgb(8 21 47 / 30%), 0 0 0 5px #fff, 0 0 0 7px var(--brand-gold);
  opacity: 0;
}
.cm-top.is-in .cm-seal { animation: cm-seal 0.8s cubic-bezier(0.3, 1.5, 0.5, 1) 4.6s forwards; }
.cm-ring {
  position: absolute;
  inset: 0;
  animation: cm-spin 16s linear infinite;
}
.cm-seal text {
  fill: #08152f;
  font: 800 10.8px var(--font-heading);
  letter-spacing: 0.08em;
}

/* =====================================================
   BASE: foundation band + promise blocks
   ===================================================== */
.cm-base {
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: 168px 0 100px;
  background: linear-gradient(180deg, #0a2250, #061538);
}
.cm-base::before {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Cpath d='M0 .5H120M0 40.5H120M.5 0V40M60.5 40V80' stroke='%23ffffff' stroke-opacity='.05' fill='none'/%3E%3C/svg%3E");
  background-size: 120px 80px;
  content: "";
  mask-image: linear-gradient(180deg, transparent, #000 40%);
}
/* gold course along the top edge */
.cm-base::after {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--brand-red), var(--brand-gold), var(--brand-red));
  content: "";
  transform: scaleX(0);
}
.cm-base.is-in::after { animation: cm-draw 1.2s cubic-bezier(0.6, 0, 0.2, 1) forwards; }

.cm-list {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(var(--cnt), 1fr);
  align-items: start;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.cm-tile {
  position: relative;
  min-height: 176px;
  margin-top: calc((var(--cnt) - 1 - var(--n)) * 16px);
  overflow: hidden;
  padding: 22px 20px 26px;
  border-radius: 10px;
  background: linear-gradient(160deg, #ffffff, #e9eef7);
  box-shadow: 0 22px 40px rgb(0 0 0 / 35%), inset 0 -4px 0 rgb(8 21 47 / 8%);
  opacity: 0;
  --t: -6deg;
  transition: translate 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s ease;
}
.cm-tile:nth-child(even) { --t: 6deg; }
.cm-tile:hover {
  translate: 0 -8px;
  box-shadow: 0 30px 50px rgb(0 0 0 / 45%), inset 0 -4px 0 rgb(8 21 47 / 8%);
}
.cm-base.is-in .cm-tile {
  animation: cm-drop 0.85s cubic-bezier(0.3, 0.7, 0.4, 1) both;
  animation-delay: calc(0.4s + var(--n) * 0.22s);
}
.cm-tile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.cm-check {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  color: #fff;
  border-radius: 50%;
  background: var(--brand-red);
  box-shadow: 0 6px 14px rgb(227 6 19 / 40%);
  transform: scale(0);
}
.cm-base.is-in .cm-check {
  animation: cm-stamp 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) forwards;
  animation-delay: calc(1.2s + var(--n) * 0.22s);
}
.cm-num {
  color: transparent;
  font: 800 42px / 1 var(--font-heading);
  letter-spacing: -0.04em;
  -webkit-text-stroke: 1.5px #c3cddf;
  transition: color 0.3s ease, -webkit-text-stroke-color 0.3s ease;
}
.cm-tile:hover .cm-num {
  color: var(--brand-gold);
  -webkit-text-stroke-color: var(--brand-gold);
}
.cm-tile p {
  margin: 0;
  color: #101d32;
  font-size: 16.5px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.01em;
}
/* mortar bar */
.cm-mortar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--brand-red), var(--brand-gold));
  transform: scaleX(0);
  transform-origin: left;
}
.cm-base.is-in .cm-mortar {
  animation: cm-draw 0.7s ease forwards;
  animation-delay: calc(1.3s + var(--n) * 0.22s);
}

/* ---------- keyframes ---------- */
@keyframes cm-drift { to { transform: translate(120px, 80px); } }
@keyframes cm-float { to { transform: translate(40px, 30px) scale(1.12); } }
@keyframes cm-plumb {
  0% { opacity: 0; transform: rotate(26deg); }
  8% { opacity: 1; }
  30% { transform: rotate(-17deg); }
  50% { transform: rotate(10deg); }
  66% { transform: rotate(-5deg); }
  80% { transform: rotate(2.4deg); }
  100% { opacity: 1; transform: rotate(0deg); }
}
@keyframes cm-sway {
  from { opacity: 1; transform: rotate(-0.9deg); }
  to { opacity: 1; transform: rotate(0.9deg); }
}
@keyframes cm-fade { to { opacity: 1; } }
@keyframes cm-fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}
@keyframes cm-rise { to { transform: none; } }
@keyframes cm-draw { to { transform: scaleX(1); } }
@keyframes cm-level {
  0% { opacity: 0; transform: translateY(-34px) rotate(-14deg); }
  14% { opacity: 1; transform: translateY(0) rotate(-8deg); }
  36% { transform: rotate(5deg); }
  56% { transform: rotate(-3deg); }
  74% { transform: rotate(1.5deg); }
  100% { opacity: 1; transform: none; }
}
@keyframes cm-bubble {
  0% { transform: translateX(30px); }
  36% { transform: translateX(-22px); }
  56% { transform: translateX(12px); }
  74% { transform: translateX(-6px); }
  100% { transform: translateX(0); }
}
@keyframes cm-unroll { to { clip-path: inset(-80px -80px -80px -80px round 22px); } }
@keyframes cm-pin {
  0% { opacity: 0; transform: translateY(-90px) rotate(calc(var(--r) + 30deg)); }
  12% { opacity: 1; }
  34% { transform: translateY(0) rotate(calc(var(--r) - 15deg)); }
  54% { transform: rotate(calc(var(--r) + 8deg)); }
  72% { transform: rotate(calc(var(--r) - 3.5deg)); }
  100% { opacity: 1; transform: rotate(var(--r)); }
}
@keyframes cm-scan {
  0%, 50% { opacity: 0; transform: translateX(-130%); }
  56% { opacity: 1; }
  100% { opacity: 1; transform: translateX(130%); }
}
@keyframes cm-seal {
  0% { opacity: 0; transform: scale(2.6) rotate(-35deg); }
  60% { opacity: 1; transform: scale(0.92) rotate(6deg); }
  100% { opacity: 1; transform: none; }
}
@keyframes cm-spin { to { transform: rotate(360deg); } }
@keyframes cm-drop {
  0% { opacity: 0; transform: translateY(-440px) rotate(var(--t)); }
  12% { opacity: 1; }
  74% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1.04, 0.94); }
  100% { opacity: 1; transform: none; }
}
@keyframes cm-stamp {
  0% { transform: scale(0) rotate(-40deg); }
  100% { transform: none; }
}

/* ---------- responsive ---------- */
@media (max-width: 1000px) {
  .cm-list { grid-template-columns: repeat(2, 1fr); }
  .cm-tile { margin-top: 0; }
}
@media (max-width: 900px) {
  .cm-head { padding-top: 104px; }
  .cm-stage { margin-bottom: -70px; }
  .cm-board {
    display: grid;
    aspect-ratio: auto;
    grid-template-columns: 1fr 1fr;
    gap: 22px 16px;
    padding: 40px 18px 54px;
  }
  .cm-pic {
    position: relative;
    top: auto;
    right: auto;
    left: auto;
    width: auto;
  }
  .cm-pic--a { grid-column: 1 / -1; --r: -1.5deg; }
  .cm-pic--b { --r: -3deg; }
  .cm-pic--c { --r: 3deg; }
  .cm-seal { top: -42px; right: 12px; width: 92px; height: 92px; }
  .cm-seal text { font-size: 10.5px; }
  .cm-base { padding-top: 130px; }
}
@media (max-width: 560px) {
  .cm-list { grid-template-columns: 1fr; }
  .cm-tile { min-height: 0; }
  .cm-level { width: 200px; }
  .cm-pin { top: -8px; width: 16px; height: 16px; left: calc(50% - 8px); }
  .cm-strip { width: 78px; left: calc(50% - 39px); height: 24px; }
  .cm-board { padding: 34px 12px 50px; gap: 18px 12px; }
}

/* reduced motion: finished layout straight away */
@media (prefers-reduced-motion: reduce) {
  .cm-plumb, .cm-eyebrow, .cm-level, .cm-lead, .cm-pic, .cm-seal, .cm-tile {
    opacity: 1 !important;
    animation: none !important;
  }
  .cm-pic { transform: rotate(var(--r)) !important; }
  .cm-tile, .cm-seal { transform: none !important; }
  .cm-check { transform: none !important; animation: none !important; }
  .cm-w > i { transform: none !important; animation: none !important; }
  .cm-eyebrow::before, .cm-eyebrow::after, .cm-mark::after, .cm-dim, .cm-mortar, .cm-base::after {
    transform: scaleX(1) !important;
    animation: none !important;
  }
  .cm-board { clip-path: none !important; animation: none !important; }
  .cm-bgwall, .cm-blob, .cm-ring, .cm-bubble, .cm-card::after { animation: none !important; }
}
`;

export function Commitment() {
  const [topRef, topSeen] = useCmSeen<HTMLDivElement>(0.15);
  const [baseRef, baseSeen] = useCmSeen<HTMLDivElement>(0.2);

  return (
    <section className="cm" id="commitment">
      <style>{cmCss}</style>

      {/* ================= TOP ================= */}
      <div className={`cm-top${topSeen ? " is-in" : ""}`} ref={topRef}>
        <div className="cm-bg" aria-hidden="true">
          <span className="cm-bgwall" />
          <span className="cm-blob cm-blob--blue" />
          <span className="cm-blob cm-blob--gold" />
        </div>

        <div className="cm-plumb" aria-hidden="true">
          <i className="cm-string" />
          <i className="cm-bob" />
        </div>

        <div className="container cm-head">
          <span className="cm-eyebrow">Our commitment</span>
          <h2>
            <CmWords text="Superior quality is the standard," />
            <br />
            <span className="cm-mark">
              <CmWords text="not the upgrade." start={5} />
            </span>
          </h2>

          <div className="cm-level" aria-hidden="true">
            <span className="cm-vial">
              <i className="cm-bubble" />
            </span>
          </div>

          <p className="cm-lead">
            We do not run a premium grade and an economy grade. There is one JPS standard, and every customer — a
            single-house owner buying 500 blocks or a contractor taking 20 loads — gets material from the same stock,
            cured the same way.
          </p>
        </div>

        <div className="container cm-stage">
          <div className="cm-board">
            <div className="cm-pic cm-pic--b" style={{ ["--d" as string]: 1 } as CSSProperties}>
              <span className="cm-pin" aria-hidden="true" />
              <figure className="cm-card">
                <img
                  src="/images/visiting-card-back.png"
                  alt="JPS visiting card showing 6 inch and 4 inch solid block applications"
                  loading="lazy"
                />
              </figure>
            </div>

            <div className="cm-pic cm-pic--c" style={{ ["--d" as string]: 2 } as CSSProperties}>
              <span className="cm-pin" aria-hidden="true" />
              <figure className="cm-card">
                <img src="/images/visiting-card-front.png" alt="JPS Bricks and Blocks roadside signboard" loading="lazy" />
              </figure>
            </div>

            <div className="cm-pic cm-pic--a" style={{ ["--d" as string]: 0 } as CSSProperties}>
              <span className="cm-strip" aria-hidden="true" />
              <figure className="cm-card">
                <img src="/images/signboard-2.png" alt="JPS Bricks and Blocks visiting card, front" loading="lazy" />
              </figure>
            </div>

            <span className="cm-dim" aria-hidden="true">
              <i />
            </span>
          </div>

          <div className="cm-seal" aria-hidden="true">
            <svg className="cm-ring" viewBox="0 0 120 120">
              <defs>
                <path id="cm-seal-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
              </defs>
              <text>
                <textPath href="#cm-seal-path" textLength="276" lengthAdjust="spacing">
                  ONE STANDARD • ONE STANDARD •
                </textPath>
              </text>
            </svg>
            <Check size={34} strokeWidth={3.4} />
          </div>
        </div>
      </div>

      {/* ================= BASE ================= */}
      <div className={`cm-base${baseSeen ? " is-in" : ""}`} ref={baseRef}>
        <div className="container">
          <ul className="cm-list" style={{ ["--cnt" as string]: commitments.length } as CSSProperties}>
            {commitments.map((item, n) => (
              <li className="cm-tile" key={item} style={{ ["--n" as string]: n } as CSSProperties}>
                <div className="cm-tile-top">
                  <span className="cm-check">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  <span className="cm-num" aria-hidden="true">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                </div>
                <p>{item}</p>
                <i className="cm-mortar" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Delivery
   ========================================================= */

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

/* =========================================================
   Page
   ========================================================= */

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <FivePromises />
      <Journey />
      <Commitment />
      <Delivery />
    </>
  );
}

export default AboutPage;