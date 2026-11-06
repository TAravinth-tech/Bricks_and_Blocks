import { useEffect, useState } from 'react'
import { ArrowUp, MapPin, Menu, Phone, Truck, X } from 'lucide-react'
import { brand } from '../data/site-data'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JPS%20Bricks%20%26%20Blocks%20Badge-qoNdEkTOTu0HqZmPzLd5uBjR6bRm4L.png'
export type PageId = 'home' | 'about' | 'products' | 'contact'

export const pageLinks: { id: PageId; label: string; href: string }[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About Us', href: '/about.html' },
  { id: 'products', label: 'Products', href: '/products.html' },
  { id: 'contact', label: 'Contact', href: '/contact.html' },
]

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand-lockup${compact ? ' brand-lockup--compact' : ''}`} href="/" aria-label="JPS Bricks & Blocks home">
      <img src={logoUrl} alt="JPS Bricks & Blocks badge logo" />
      {!compact && <span className="brand-name">JPS <span>Bricks & Blocks</span></span>}
    </a>
  )
}

export function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <a className="topbar-address" href="https://maps.google.com/?q=Kilangulam+Main+Road+Peraiyur+Madurai" target="_blank" rel="noreferrer">
          <MapPin size={14} aria-hidden="true" />
          <span>{brand.shortAddress}</span>
        </a>
        <div className="topbar-right">
          <a href={brand.phoneHref}><Phone size={14} aria-hidden="true" />{brand.phone}</a>
          <a href={brand.secondPhoneHref}><Phone size={14} aria-hidden="true" />{brand.secondPhone}</a>
          <span className="topbar-delivery"><Truck size={15} aria-hidden="true" />Delivery available</span>
        </div>
      </div>
    </div>
  )
}

export function Navbar({ currentPage }: { currentPage: PageId }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <TopBar />
      <header className="site-header">
        <div className="nav-wrap">
          <nav className="container navbar" aria-label="Main navigation">
          <BrandLogo />
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
          <div id="primary-navigation" className={`nav-content${menuOpen ? ' nav-content--open' : ''}`}>
            <div className="nav-links">
              {pageLinks.map((link) => (
                <a
                  key={link.id}
                  className={`nav-link${currentPage === link.id ? ' nav-link--active' : ''}`}
                  href={link.href}
                  aria-current={currentPage === link.id ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a className="button button--red nav-quote" href="/contact.html" onClick={() => setMenuOpen(false)}>
              Get a quote <span aria-hidden="true">↗</span>
            </a>
          </div>
          </nav>
        </div>
      </header>
    </>
  )
}

export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="floating-actions" aria-label="Quick contact">
      {showTop && (
        <a className="float-button float-button--top" href="#home" aria-label="Back to top">
          <ArrowUp size={19} />
        </a>
      )}
      <a className="float-button float-button--call" href={brand.phoneHref} aria-label={`Call ${brand.phone}`}>
        <Phone size={20} fill="currentColor" />
      </a>
      <a className="float-button float-button--whatsapp" href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent('Hello JPS Bricks & Blocks, I would like to enquire about your products.')}`} target="_blank" rel="noreferrer" aria-label="Enquire on WhatsApp">
        <WhatsAppIcon />
      </a>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
      <path d="M20.52 3.48A11.81 11.81 0 0 0 12.1 0C5.55 0 .22 5.33.22 11.88c0 2.1.55 4.16 1.6 5.97L.12 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.44h.01c6.55 0 11.88-5.33 11.88-11.88a11.8 11.8 0 0 0-3.47-8.43ZM12.1 21.77h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.45-9.91 9.91-9.91a9.85 9.85 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.92 9.9Zm5.44-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.08-.8.38-.28.3-1.05 1.02-1.05 2.49s1.08 2.89 1.23 3.09c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.73.23 1.39.2 1.91.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}
