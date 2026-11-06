export type RangeProduct = {
  id: string
  name: string
  tamil: string
  tag: string
  image: string
  alt: string
  description: string
  bullets: string[]
}

export const sizeGuide = [
  {
    size: '6″',
    label: '6 Inch Block · 150 mm',
    title: 'External & Load-Bearing',
    featured: true,
    uses: [
      { en: 'External walls', ta: 'வெளி சுவர்' },
      { en: 'Fence & compound walls', ta: 'கம்பி வேலி சுவர்' },
      { en: 'Factory and shed walls', ta: 'தொழிற்சாலை' },
    ],
  },
  {
    size: '4″',
    label: '4 Inch Block · 100 mm',
    title: 'Partition & Internal',
    featured: false,
    uses: [
      { en: 'Partition walls', ta: 'பகுதி பிரிப்பு சுவர்' },
      { en: 'Inter walls', ta: 'உள்ளக சுவர்' },
      { en: 'Bathroom & kitchen walls' },
      { en: 'Plaster walls, ventilator & wardrobe sections' },
    ],
  },
]

export const rangeProducts: RangeProduct[] = [
  {
    id: 'solid-block', name: 'Solid Concrete Blocks', tamil: 'உயர் தரமான சாலிட் பிளாக்ஸ்', tag: 'Flagship',
    image: '/images/solid-block.jpg', alt: 'Solid Concrete Blocks manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Machine-pressed solid blocks in the two sizes that build an entire house — 6" (150 mm) for external and load-bearing walls, 4" (100 mm) for partitions and internal work.',
    bullets: ['6" / 150 mm — external walls, fence walls, factory & shed walls', '4" / 100 mm — partition walls, inter walls, bathroom & kitchen walls', '4" also used for plaster walls, ventilator and wardrobe sections', 'High strength, low water absorption, uniform dimensions'],
  },
  {
    id: 'fairface-block', name: 'Fairface Blocks', tamil: 'ஃபேர்ஃபேஸ் பிளாக்', tag: 'Low Plaster',
    image: '/images/fairface-block.jpg', alt: 'Fairface Blocks manufactured by JPS Bricks and Blocks, Madurai',
    description: 'A smooth, closed face straight from the mould. Often laid exposed, or finished with a skim rather than full plaster — which takes real money off the finishing bill.',
    bullets: ['Even, closed surface texture with sharp arris', 'Reduces or removes plastering on internal faces', 'Popular for compound walls, sheds and boundary work', 'Same strength and curing standard as our solid blocks'],
  },
  {
    id: 'flavour-bricks', name: 'Flavour Bricks', tamil: 'ஃபிளேவர் பிரிக்ஸ்', tag: 'Coloured',
    image: '/images/flavour-bricks.jpg', alt: 'Flavour Bricks manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Coloured designer bricks in red, yellow and charcoal grey. Used where the masonry is meant to be seen — elevations, feature walls, garden borders and landscaping.',
    bullets: ['Red, yellow and charcoal colour options', 'Multiple shapes and profiles available on order', 'Colour is integral to the mix, not a surface coat', 'Ideal for elevation, compound facing and garden work'],
  },
  {
    id: 'paver-block', name: 'Paver Blocks', tamil: 'பேவர் பிளாக்', tag: 'Interlocking',
    image: '/images/paver-block.jpg', alt: 'Paver Blocks manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Interlocking pavers that spread load across the surface instead of concentrating it. For driveways, walkways, parking bays, temple grounds and factory yards.',
    bullets: ['Zigzag, cosmic, dumbbell and rectangular patterns', 'Grey and coloured finishes', 'Suitable for pedestrian and light-vehicle traffic', 'Individual pieces can be lifted and relaid for repairs'],
  },
  {
    id: 'blue-metal', name: 'Blue Metal', tamil: 'ப்ளூ மெட்டல்', tag: 'Aggregate',
    image: '/images/blue-metal.jpg', alt: 'Blue Metal manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Crushed hard-stone aggregate supplied by the load for concrete work, foundations, flooring beds and road bases.',
    bullets: ['Standard construction gradings available', 'Clean, well-graded material with low dust content', 'Supplied by the unit / lorry load', 'Also used in our own block casting — same source, same quality'],
  },
  {
    id: 'kerb-stone', name: 'Highway Kerb Stone', tamil: 'ஹைவே கர்ப் ஸ்டோன்', tag: 'Roads',
    image: '/images/kerb-stone.jpg', alt: 'Highway Kerb Stone manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Heavy-section kerbing for road edges, medians, footpath borders and layout roads — cast in bulk and cured together so the profile stays identical across the run.',
    bullets: ['Uniform profile across the full batch', 'Bulk quantities for road and layout contracts', 'Used for medians, footpath edges and road shoulders', 'Delivered stacked and ready to lay'],
  },
  {
    id: 'boundary-stone', name: 'Boundary Stone', tamil: 'பவுண்டரி ஸ்டோன்', tag: 'Highways',
    image: '/images/boundary-stone.jpg', alt: 'Boundary Stone manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Cast boundary markers for highway edges, land parcels, survey limits and layout demarcation. Set once and they hold their line for decades.',
    bullets: ['Highway boundary and land parcel marking', 'Robust cast section, weather resistant', 'Can be supplied plain or ready for lettering', 'Bulk supply for highway and layout works'],
  },
  {
    id: 'furlong-stone', name: 'Furlong Stone', tamil: 'ஃபர்லாங் ஸ்டோன்', tag: 'Highways',
    image: '/images/furlong-stone.jpg', alt: 'Furlong Stone manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Furlong markers for highway and road distance marking, cast to the standard profile and finished smooth for painting and lettering.',
    bullets: ['Standard furlong marker profile', 'Smooth face, ready for paint and lettering', 'Cast and cured for outdoor service life', 'Supplied in project quantities'],
  },
  {
    id: 'kilometre-stone', name: 'Kilometre Stone', tamil: 'கிலோமீட்டர் ஸ்டோன்', tag: 'Highways',
    image: '/images/kilometre-stone.jpg', alt: 'Kilometre Stone manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Kilometre stones for highways, district roads and layout roads — the standard chamfered-top marker, cast to hold paint and lettering cleanly.',
    bullets: ['Standard kilometre marker shape', 'Chamfered top for clear lettering', 'Dense casting, low water absorption', 'Available for road contract quantities'],
  },
  {
    id: 'edge-stone', name: 'Edge Stone', tamil: 'எட்ஜ் ஸ்டோன்', tag: 'Landscaping',
    image: '/images/edge-stone.jpg', alt: 'Edge Stone manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Slim edging sections that hold a paved area, garden bed or pathway to a clean line and stop the paving from creeping outward.',
    bullets: ['Defines pathway, driveway and garden edges', 'Holds paver courses tight and in line', 'Straight and curved runs supported', 'Grey finish, other colours on request'],
  },
  {
    id: 'compound-wall', name: 'Compound Wall Stone', tamil: 'கம்பவுண்ட் வால் ஸ்டோன்', tag: 'Compounds',
    image: '/images/compound-wall.jpg', alt: 'Compound Wall Stone manufactured by JPS Bricks and Blocks, Madurai',
    description: 'Precast posts and panel stones for compound walls — the fast, low-maintenance way to enclose a plot, farm or factory without full masonry.',
    bullets: ['Precast posts and wall sections', 'Quick to erect, minimal wet work on site', 'Suitable for plots, farms, factories and layouts', 'Long service life with almost no maintenance'],
  },
]

export const orderSteps = [
  { title: 'Send your requirement', text: 'Fill in the enquiry form or message us on WhatsApp with the product, approximate quantity and your site location.' },
  { title: 'Get the rate and delivery date', text: 'We confirm availability, quote the per-piece and per-load rate including delivery, and give you a dispatch date.' },
  { title: 'Material reaches your site', text: 'Stock is loaded, checked and delivered to your site on the agreed day. Unloading is coordinated with your site in-charge.' },
]

export const clients = [
  { image: '/images/client-lnt.png', alt: 'L&T (Larsen & Toubro) logo' },
  { image: '/images/client-aims.jpg', alt: 'AIMS logo' },
]
