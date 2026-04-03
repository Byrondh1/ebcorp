'use client'

import { useState } from 'react'
import { PRODUCTS, CATEGORY_LABELS, type ProductCategory } from '@/data/products'
import { getWhatsAppProductUrl } from '@/lib/constants'
import Animate from '@/components/Animate'

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')

  const categories: Array<ProductCategory | 'all'> = ['all', 'floral', 'special', 'arrangements', 'premium']
  const categoryLabels: Record<ProductCategory | 'all', string> = {
    all: 'Todos',
    ...CATEGORY_LABELS,
  }

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <section id="productos" className="py-20 md:py-28 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-3 block">
            Catálogo
          </span>
          <h2 className="section-heading">Nuestros Productos</h2>
          <span className="gold-line" />
          <p className="text-brand-gray mt-6 max-w-xl mx-auto">
            Cada pieza es única, elaborada a mano con los mejores materiales y fragancias.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-gold text-brand-black'
                  : 'bg-zinc-900 text-brand-gray border border-zinc-800 hover:border-brand-gold/40 hover:text-brand-gold'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, idx) => (
            <Animate key={`${product.id}-${activeCategory}`} animation="fade-up" delay={(idx % 3) * 100}>
            <div className="card-dark relative group flex flex-col h-full">
              {/* Featured Badge */}
              {product.isFeatured && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-brand-gold text-brand-black text-xs font-bold px-3 py-1 rounded-full">
                  <StarIcon className="w-3 h-3" />
                  Producto Estrella
                </div>
              )}

              {/* Product image */}
              <div className="relative h-52 bg-zinc-800 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProductPlaceholder category={product.category} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-2">
                  <span className="text-xs text-brand-gold/70 uppercase tracking-wider font-medium">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-brand-white mb-2 group-hover:text-brand-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-brand-gray text-sm leading-relaxed flex-1 mb-5">
                  {product.description}
                </p>
                <a
                  href={getWhatsAppProductUrl(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full justify-center text-sm py-2.5"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Consultar precio
                </a>
              </div>
            </div>
            </Animate>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-brand-gray mb-4">¿No encuentras lo que buscas?</p>
          <a
            href="#contacto"
            className="btn-outline-gold inline-flex"
          >
            Pide tu diseño personalizado
          </a>
        </div>
      </div>
    </section>
  )
}

function ProductPlaceholder({ category }: { category: ProductCategory }) {
  const icons: Record<ProductCategory, React.ReactNode> = {
    floral: <FloralIcon className="w-20 h-20 text-brand-gold/30" />,
    special: <CandleIcon className="w-20 h-20 text-brand-gold/30" />,
    arrangements: <GiftIcon className="w-20 h-20 text-brand-gold/30" />,
    premium: <BoxIcon className="w-20 h-20 text-brand-gold/30" />,
  }
  return <>{icons[category]}</>
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FloralIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="8" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x = 50 + 22 * Math.cos(rad)
        const y = 50 + 22 * Math.sin(rad)
        return <ellipse key={angle} cx={x} cy={y} rx="9" ry="16" transform={`rotate(${angle + 90}, ${x}, ${y})`} />
      })}
    </svg>
  )
}

function CandleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" d="M12 3c0 0-.8 1.5-.8 3s.8 1.5.8 1.5.8-1.5.8-3S12 3 12 3z" fill="currentColor" stroke="none" />
      <rect x="8" y="7.5" width="8" height="13" rx="1.5" />
      <line x1="8" y1="15" x2="16" y2="15" />
    </svg>
  )
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1014.625 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 109.375 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}
