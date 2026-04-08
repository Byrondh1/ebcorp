'use client'

import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface LightboxProps {
  images: string[]
  index: number
  title?: string
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({ images, index, title, onClose, onNavigate }: LightboxProps) {
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && hasPrev) onNavigate(index - 1)
    if (e.key === 'ArrowRight' && hasNext) onNavigate(index + 1)
  }, [onClose, onNavigate, index, hasPrev, hasNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (typeof window === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/95 z-[9999] flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-3 z-10" onClick={e => e.stopPropagation()}>
        {title && (
          <h3 className="font-heading text-brand-white font-semibold truncate pr-4">{title}</h3>
        )}
        <span className="text-brand-gray text-sm ml-auto mr-4">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="text-brand-gray hover:text-brand-white transition-colors p-1"
          aria-label="Cerrar"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-12">
        <img
          src={images[index]}
          alt={title ?? `Imagen ${index + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={e => e.stopPropagation()}
        />

        {/* Prev button */}
        {hasPrev && (
          <button
            onClick={e => { e.stopPropagation(); onNavigate(index - 1) }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next button */}
        {hasNext && (
          <button
            onClick={e => { e.stopPropagation(); onNavigate(index + 1) }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 transition-all"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-2 justify-center px-4 py-3 overflow-x-auto"
          onClick={e => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === index ? 'border-brand-gold opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={src} alt={`${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
