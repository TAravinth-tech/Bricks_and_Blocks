import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  Blocks,
  Boxes,
  CircleCheck,
  Leaf,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react'

export const brand = {
  name: 'JPS Bricks & Blocks',
  phone: '+91 63827 27154',
  phoneHref: 'tel:+916382727154',
  secondPhone: '+91 78715 99044',
  secondPhoneHref: 'tel:+917871599044',
  whatsapp: '917871599044',
  address: '12/6, Kilangulam Main Road, Peraiyur Taluk, Madurai – 625703, Tamil Nadu, India',
  shortAddress: 'Kilangulam Main Road, Peraiyur, Madurai',
  tamilTagline: 'குறைந்த விலையில் நிறைவான தரம் · தரம் எங்கள் அடையாளம்',
  mapUrl: 'https://www.google.com/maps?q=Kilangulam%20Main%20Road%2C%20Peraiyur%2C%20Madurai&output=embed',
}

export type Product = {
  name: string
  description: string
  bullets: string[]
  image: string
  imageAlt: string
  badge?: string
}

export const products: Product[] = [
  {
    name: 'Solid Concrete Blocks',
    description: 'Our flagship product, supplied in 4” (100 mm) and 6” (150 mm) for every wall in the building.',
    bullets: ['6” — external, fence & factory walls', '4” — partitions, bathrooms & kitchens'],
    image: '/images/concrete-blocks.png',
    imageAlt: 'Uniform solid grey concrete masonry blocks stacked at the JPS yard',
    badge: 'Best seller',
  },
  {
    name: 'Fairface Blocks',
    description: 'A smooth, even face straight off the mould — often laid exposed with minimal or no plastering.',
    bullets: ['Sharp arris, clean face texture', 'Cuts plaster and finishing cost'],
    image: '/images/brick-yard.png',
    imageAlt: 'Neatly stacked fairface concrete blocks with a smooth finish',
  },
  {
    name: 'Flavour Bricks',
    description: 'Coloured designer bricks in red, yellow and charcoal for feature walls, borders and landscaping.',
    bullets: ['Multiple colours and shapes', 'Ideal for elevations & garden work'],
    image: '/images/flavour-bricks.png',
    imageAlt: 'Red, yellow and charcoal coloured concrete designer bricks arranged in rows',
  },
  {
    name: 'Paver Blocks',
    description: 'Interlocking pavers for driveways, walkways, parking bays and factory yards.',
    bullets: ['Zigzag, cosmic & rectangular patterns', 'Grey and coloured options'],
    image: '/images/paver-driveway.png',
    imageAlt: 'Grey interlocking pavers laid in a driveway',
  },
  {
    name: 'Highway Kerb Stone',
    description: 'Heavy-section kerbing for road edges, medians, footpath borders and layout roads.',
    bullets: ['Bulk quantities for road contracts', 'Consistent profile across the batch'],
    image: '/images/brick-yard.png',
    imageAlt: 'Precast concrete sections ready for delivery',
  },
  {
    name: 'Blue Metal',
    description: 'Crushed stone aggregate in construction grades, supplied by the unit load.',
    bullets: ['Standard construction gradings', 'Clean, well-graded, low dust'],
    image: '/images/blue-metal.png',
    imageAlt: 'Clean graded blue metal crushed stone aggregate',
  },
  {
    name: 'Boundary Stone',
    description: 'Durable precast markers for clear boundaries, plot corners and site demarcation.',
    bullets: ['Made for outdoor conditions', 'Supplied in practical quantities'],
    image: '/images/concrete-blocks.png',
    imageAlt: 'Precast concrete products at a manufacturing yard',
  },
  {
    name: 'Furlong Stone',
    description: 'Reliable concrete markers for roads, layouts, fields and infrastructure projects.',
    bullets: ['Strong, dependable casting', 'Suitable for project orders'],
    image: '/images/brick-yard.png',
    imageAlt: 'Concrete products stacked for a project order',
  },
  {
    name: 'Edge Stone',
    description: 'A clean, lasting finish for garden beds, pathways, paved areas and compound edges.',
    bullets: ['Neat, consistent edges', 'Works with pavers and landscaping'],
    image: '/images/paver-driveway.png',
    imageAlt: 'Concrete paver edge detail along a walkway',
  },
  {
    name: 'Compound Wall Stone',
    description: 'Precast concrete components for strong, practical compound wall construction.',
    bullets: ['Built for everyday site use', 'Enquire for project quantities'],
    image: '/images/concrete-blocks.png',
    imageAlt: 'Stacked concrete masonry components at the JPS yard',
  },
  {
    name: 'Highway Stones',
    description: 'Precast concrete stones for road edges, roadside works and infrastructure projects.',
    bullets: ['Suitable for bulk requirements', 'Made for dependable site performance'],
    image: '/images/paver-driveway.png',
    imageAlt: 'Concrete paving and roadside stone work',
  },
]

export const marqueeProducts = [
  'Solid Blocks', 'Fairface Blocks', 'Flavour Bricks', 'Paver Blocks', 'Blue Metal',
  'Highway Kerb Stone', 'Boundary Stone', 'Furlong Stone', 'Edge Stone',
  'Compound Wall Stone', 'Highway Stones',
]

export const features: { icon: LucideIcon; title: string; description: string; tamil: string }[] = [
  {
    icon: ShieldCheck,
    title: 'High Compressive Strength',
    description: 'Machine-pressed, graded aggregate mix that carries load without hairline failure — for load-bearing and framed structures alike.',
    tamil: 'உயர் வலிமை',
  },
  {
    icon: BadgeCheck,
    title: 'Long-Lasting Durability',
    description: 'A balanced cement-to-aggregate ratio and disciplined curing cycle give our blocks a service life measured in decades.',
    tamil: 'நீண்ட நாட்கள் நிலைத்திருக்கும்',
  },
  {
    icon: Blocks,
    title: 'Low Water Absorption',
    description: 'Dense casting keeps moisture out, so plaster holds, paint stays clean and dampness does not creep up your walls.',
    tamil: 'குறைந்த நீர் உறிஞ்சல்',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Production',
    description: 'No kiln, no topsoil, no burning. Concrete blocks help preserve fertile land and reduce the footprint of masonry work.',
    tamil: 'சுற்றுச்சூழல் நட்பு',
  },
  {
    icon: Ruler,
    title: 'Uniform Size & Shape',
    description: 'Consistent dimensions mean straight courses, thinner mortar joints and less plaster — measurable savings on every wall.',
    tamil: 'சீரான அளவு, சீரான வடிவம்',
  },
  {
    icon: Truck,
    title: 'On-Time Site Delivery',
    description: 'Our transport arrangement serves Peraiyur, Madurai, Thirumangalam, Usilampatti and the surrounding belt.',
    tamil: 'சரியான நேரத்தில் விநியோகம்',
  },
]

export const processSteps = [
  {
    title: 'Material Selection & Batching',
    description: 'Graded blue metal, quarry dust and cement are proportioned by weight for the target strength — not by guesswork.',
  },
  {
    title: 'Machine Pressing',
    description: 'High-pressure vibro-compaction removes voids and gives the block its density, sharp edges and uniform dimensions.',
  },
  {
    title: 'Full Curing Cycle',
    description: 'Blocks are water-cured for the complete cycle before they are moved. This is where most of the strength is earned.',
  },
  {
    title: 'Inspection & Delivery',
    description: 'Dimension and edge check, careful stacking, then delivery to your site on the date you were promised.',
  },
]

export const testimonials = [
  {
    quote: 'The size consistency is what won us over. Straight courses, thin joints, and our plastering cost came down noticeably compared to what we used earlier.',
    name: 'R. Murugan',
    role: 'Building Contractor · Peraiyur',
    initials: 'RM',
  },
  {
    quote: 'We ordered kerb stones in bulk for a layout road. Delivery came exactly on schedule and the profile was identical across every piece.',
    name: 'S. Karthikeyan',
    role: 'Layout Promoter · Madurai',
    initials: 'SK',
  },
  {
    quote: 'Built my house with JPS 6” blocks. Two rainy seasons later, no dampness on the outer walls. Fair price and they answer the phone every time.',
    name: 'A. Lakshmanan',
    role: 'Home Owner · Usilampatti',
    initials: 'AL',
  },
]

export const stats = [
  { value: 5, suffix: '+', label: 'Years in business', icon: BadgeCheck },
  { value: 450, suffix: '+', label: 'Sites supplied', icon: Boxes },
  { value: 11, suffix: '', label: 'Product lines', icon: Blocks },
  { value: 100, suffix: '%', label: 'Fully cured stock', icon: CircleCheck },
]
