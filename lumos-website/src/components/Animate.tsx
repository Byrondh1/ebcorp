'use client'

import { useEffect, useRef, useState } from 'react'

type Animation = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right'

interface Props {
  children: React.ReactNode
  className?: string
  animation?: Animation
  delay?: number
}

const hidden: Record<Animation, string> = {
  'fade-up':    'opacity-0 translate-y-8',
  'fade-in':    'opacity-0',
  'fade-left':  'opacity-0 -translate-x-8',
  'fade-right': 'opacity-0 translate-x-8',
}

export default function Animate({ children, className = '', animation = 'fade-up', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out ${visible ? '' : hidden[animation]} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
