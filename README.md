# JPS Bricks & Blocks – multi-page website

Vite + React + Tailwind, built as a real multi-page site (one HTML file per page, for SEO).

| Page | File | Entry component | Status |
|------|------|-----------------|--------|
| Home | `index.html` | `src/pages/home.tsx` | Complete |
| About Us | `about.html` | `src/pages/about.tsx` | Empty – ready to build |
| Products | `products.html` | `src/pages/products.tsx` | Empty – ready to build |
| Contact | `contact.html` | `src/pages/contact.tsx` | Empty – ready to build |

Navbar, footer and floating call/WhatsApp buttons are shared (`src/components/PageShell.tsx`).
Existing section components (About, Products, Contact…) in `src/components/` can be reused on the new pages.

## Run
```
npm install   # or pnpm install
npm run dev   # http://localhost:3000
npm run build # outputs dist/ with 4 HTML pages
```

## Before going live
Replace `https://www.your-domain.com` with the real domain in:
`index.html`, `about.html`, `products.html`, `contact.html` (canonical / og:url / breadcrumb),
`public/sitemap.xml` and `public/robots.txt`.

## Adding a new page
1. Create `newpage.html` (copy `about.html`, change title/description/script src).
2. Create `src/pages/newpage.tsx`.
3. Add it to `build.rollupOptions.input` in `vite.config.ts`, `pageLinks` in `SiteChrome.tsx`, and `public/sitemap.xml`.
