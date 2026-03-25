'use client'

import { useState } from 'react'
import { SOCIAL } from '@/lib/constants'

const GALLERY_ITEMS = [
  { id: 1, label: 'Velas de Rosas', category: 'Florales', accent: '#F9C6D0' },
  { id: 2, label: 'La Lupita', category: 'Religiosas', accent: '#C9A84C' },
  { id: 3, label: 'Arreglo Floral', category: 'Arreglos', accent: '#E2C97A' },
  { id: 4, label: 'Velas de Peonías', category: 'Florales', accent: '#F9C6D0' },
  { id: 5, label: 'Caja Premium', category: 'Premium', accent: '#C9A84C' },
  { id: 6, label: 'Velas de Girasoles', category: 'Florales', accent: '#E2C97A' },
  { id: 7, label: 'Canasta de Regalo', category: 'Arreglos', accent: '#F9C6D0' },
  { id: 8, label: 'Recordatorio de Boda', category: 'Especiales', accent: '#C9A84C' },
  { id: 9, label: 'Caja I ❤️ U', category: 'Premium', accent: '#E2C97A' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section id="galeria" className="py-20 md:py-28 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-3 block">
            Galería
          </span>
          <h2 className="section-heading">Nuestras Creaciones</h2>
          <span className="gold-line" />
          <p className="text-brand-gray mt-6 max-w-xl mx-auto">
            Cada pieza cuenta una historia. Aquí te mostramos algunos de nuestros trabajos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setLightbox(idx)}
              className={`relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-gold/40 transition-all duration-300 group cursor-pointer ${
                idx === 0 || idx === 4 ? 'row-span-2' : ''
              }`}
              style={{ minHeight: idx === 0 || idx === 4 ? '400px' : '180px' }}
            >
              {/* Placeholder content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div
                  className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${item.accent}20` }}
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 0c0 0-.8 1.5-.8 3s.8 1.5.8 1.5.8-1.5.8-3S12 5 12 5zM8 9h8a2 2 0 012 2v9a2 2 0 01-2 2H8a2 2 0 01-2-2v-9a2 2 0 012-2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium" style={{ color: item.accent }}>
                  {item.category}
                </span>
                <span className="text-brand-white/60 text-sm mt-1 text-center">{item.label}</span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-brand-black/70 rounded-full p-3">
                  <ZoomIcon className="w-5 h-5 text-brand-gold" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-brand-gray mb-2">¿Quieres ver más de nuestras creaciones?</p>
          <p className="text-brand-white font-semibold mb-6 font-heading text-xl">
            Síguenos en redes sociales
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              <InstagramIcon className="w-4 h-4" />
              Instagram
            </a>
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm"
            >
              <FacebookIcon className="w-4 h-4" />
              Facebook
            </a>
            <a
              href={SOCIAL.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-white font-semibold px-5 py-2.5 rounded-full hover:border-brand-gold/40 transition-colors text-sm"
            >
              <TikTokIcon className="w-4 h-4" />
              TikTok
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-brand-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-brand-gray hover:text-brand-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="max-w-lg w-full bg-zinc-900 rounded-3xl border border-zinc-800 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${GALLERY_ITEMS[lightbox].accent}20` }}
            >
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke={GALLERY_ITEMS[lightbox].accent} strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 0c0 0-.8 1.5-.8 3s.8 1.5.8 1.5.8-1.5.8-3S12 5 12 5zM8 9h8a2 2 0 012 2v9a2 2 0 01-2 2H8a2 2 0 01-2-2v-9a2 2 0 012-2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GALLERY_ITEMS[lightbox].accent }}>
              {GALLERY_ITEMS[lightbox].category}
            </span>
            <h3 className="font-heading text-2xl text-brand-white mt-2 mb-1">{GALLERY_ITEMS[lightbox].label}</h3>
            <p className="text-brand-gray text-sm mt-3">
              Foto disponible próximamente. Contáctanos para ver más diseños.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.23 8.23 0 004.83 1.55V6.79a4.85 4.85 0 01-1.06-.1z" />
    </svg>
  )
}
