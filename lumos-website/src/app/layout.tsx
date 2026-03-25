import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lumos By Paola | Velas Artesanales',
  description:
    'Velas aromáticas artesanales hechas 100% a mano. Diseños florales, religiosos y personalizados para eventos, regalos y recordatorios. Transforma tu espacio con un destello de aroma.',
  keywords: [
    'velas artesanales',
    'velas aromáticas',
    'velas florales',
    'velas personalizadas',
    'Virgen de Guadalupe',
    'recordatorios de boda',
    'recordatorios de bautizo',
    'regalos únicos',
    'Lumos by Paola',
  ],
  openGraph: {
    title: 'Lumos By Paola | Velas Artesanales',
    description:
      'Transforma tu espacio con un destello de aroma. Velas aromáticas artesanales personalizadas.',
    type: 'website',
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumos By Paola | Velas Artesanales',
    description: 'Transforma tu espacio con un destello de aroma.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand-black text-brand-white font-body antialiased">
        {children}
      </body>
    </html>
  )
}
