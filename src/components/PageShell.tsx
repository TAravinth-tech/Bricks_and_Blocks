import { useEffect, type ReactNode } from 'react'
import { Footer } from './ContactFooter'
import { FloatingButtons, Navbar, type PageId } from './SiteChrome'

/** Fades `.reveal` elements in as they scroll into view. */
function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

/** Shared layout for every page: navbar, page content, footer, floating buttons. */
export function PageShell({ currentPage, children }: { currentPage: PageId; children: ReactNode }) {
  useRevealOnScroll()
  return (
    <>
      <Navbar currentPage={currentPage} />
      {children}
      <Footer />
      <FloatingButtons />
    </>
  )
}

/** Blank content area for pages that are not built yet. Replace the body with real sections. */
export function EmptyPage({ title }: { title: string }) {
  return (
    <main id="main-content" className="empty-page">
      <h1 className="sr-only">{title}</h1>
    </main>
  )
}
