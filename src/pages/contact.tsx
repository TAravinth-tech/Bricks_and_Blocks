import React from "react"
import { createRoot } from "react-dom/client"
import { EmptyPage, PageShell } from "../components/PageShell"
import "../index.css"

// TODO: build the Contact page content here.
function ContactPage() {
  return (
    <PageShell currentPage="contact">
      <EmptyPage title="Contact – JPS Bricks & Blocks" />
    </PageShell>
  )
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><ContactPage /></React.StrictMode>)
