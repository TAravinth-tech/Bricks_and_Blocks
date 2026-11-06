import React from 'react'
import { createRoot } from 'react-dom/client'
import { PageShell } from '../components/PageShell'
import { Clients, OrderSteps, ProductRange, ProductsHero, SizeGuide } from '../components/ProductsPage'
import { QuoteBanner } from '../components/QuoteBanner'
import '../index.css'
import '../page-common.css'
import '../products.css'

function ProductsPage() {
  return (
    <PageShell currentPage="products">
      <main id="main-content">
        <ProductsHero />
        <SizeGuide />
        <ProductRange />
        <OrderSteps />
        <Clients />
        <QuoteBanner />
      </main>
    </PageShell>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><ProductsPage /></React.StrictMode>)
