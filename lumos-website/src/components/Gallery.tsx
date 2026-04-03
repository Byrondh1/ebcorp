'use client'

import { useState } from 'react'
import { SOCIAL } from '@/lib/constants'
import Animate from '@/components/Animate'

const GALLERY_ITEMS = [
  { id: 1, label: 'Velas de Rosas',        category: 'Florales',    image: '/images/gallery/gallery-1.jpg' },
  { id: 2, label: 'La Lupita',             category: 'Religiosas',  image: '/images/gallery/gallery-2.jpg' },
  { id: 3, label: 'Arreglo Floral',        category: 'Arreglos',    image: '/images/gallery/gallery-3.jpg' },
  { id: 4, label: 'Velas de Peonías',      category: 'Florales',    image: '/images/gallery/gallery-4.jpg' },
  { id: 5, label: 'Caja Premium',          category: 'Premium',     image: '/images/gallery/gallery-5.jpg' },
  { id: 6, label: 'Velas de Girasoles',    category: 'Florales',    image: '/images/gallery/gallery-6.jpg' },
  { id: 7, label: 'Canasta de Regalo',     category: 'Arreglos',    image: '/images/gallery/gallery-7.jpg' },
  { id: 8, label: 'Recordatorio de Boda',  category: 'Especiales',  image: '/images/gallery/gallery-8.jpg' },
  { id: 9, label: 'Caja I ❤️ U',          category: 'Premium',     image: '/images/gallery/gallery-9.jpg' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section id="galeria" className="py-20 md:py-28 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Animate animation="fade-up">
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
        </Animate>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <Animate key={item.id} animation="fade-in" delay={idx * 80} className={idx === 0 || idx === 4 ? 'row-span-2' : ''}>
            <button
              key={item.id}
              onClick={() => setLightbox(idx)}
              className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-gold/40 transition-all duration-300 group cursor-pointer w-full h-full"
              style={{ minHeight: idx === 0 || idx === 4 ? '400px' : '180px' }}
            >
              {/* Real photo */}
              <img
                src={item.image}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/10 to-transparent" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold block mb-0.5">
                  {item.category}
                </span>
                <span className="text-brand-white text-sm font-medium">{item.label}</span>
              </div>

              {/* Zoom icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-brand-black/60 rounded-full p-3 backdrop-blur-sm">
                  <ZoomIcon className="w-5 h-5 text-brand-gold" />
                </div>
              </div>
            </button>
            </Animate>
          ))}
        </div>

        {/* Instagram CTA */}
        <Animate animation="fade-up">
        <div className="mt-12 text-center p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-brand-gray mb-2">¿Quieres ver más de nuestras creaciones?</p>
          <p className="text-brand-white font-semibold mb-6 font-heading text-xl">
            Síguenos en redes sociales
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
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
        </Animate>
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
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_ITEMS[lightbox].image}
              alt={GALLERY_ITEMS[lightbox].label}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="mt-4 text-center">
              <span className="text-brand-gold text-xs font-semibold uppercase tracking-widest block">
                {GALLERY_ITEMS[lightbox].category}
              </span>
              <h3 className="font-heading text-xl text-brand-white mt-1">
                {GALLERY_ITEMS[lightbox].label}
              </h3>
            </div>
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
