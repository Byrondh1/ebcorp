import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://byrondh1.github.io/lumos-paola'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lumos By Paola',
  description:
    'Velas aromáticas artesanales hechas 100% a mano. Diseños florales, religiosos y personalizados para eventos, regalos y recordatorios en Ecuador.',
  url: `${SITE_URL}/`,
  telephone: '+593962927911',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+593962927911',
    contactType: 'customer service',
    availableLanguage: 'Spanish',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'EC',
  },
  image: `${SITE_URL}/images/hero/hero.jpg`,
  priceRange: '$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Transfer',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Velas Artesanales',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Velas Florales' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Velas Religiosas' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Arreglos Florales' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Cajas de Regalo' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Recordatorios Personalizados' } },
    ],
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lumos By Paola | Velas Artesanales Ecuador',
    template: '%s | Lumos By Paola',
  },
  description:
    'Velas aromáticas artesanales hechas 100% a mano en Ecuador. Diseños florales, religiosos y personalizados para bodas, bautizos, 15 años y regalos únicos. ¡Personaliza la tuya!',
  keywords: [
    'velas artesanales Ecuador',
    'velas aromáticas',
    'velas florales',
    'velas personalizadas',
    'velas de rosas',
    'velas de girasoles',
    'velas de peonías',
    'velas La Lupita',
    'Virgen de Guadalupe vela',
    'recordatorios de boda',
    'recordatorios de bautizo',
    'recordatorios 15 años',
    'arreglos florales con velas',
    'canastas de regalo',
    'cajas de regalo personalizadas',
    'regalos únicos Ecuador',
    'regalos San Valentín',
    'regalos día de la madre',
    'velas hechas a mano',
    'Lumos by Paola',
  ],
  authors: [{ name: 'Lumos By Paola' }],
  creator: 'Lumos By Paola',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Lumos By Paola | Velas Artesanales Ecuador',
    description:
      'Transforma tu espacio con un destello de aroma. Velas artesanales hechas 100% a mano — florales, religiosas y personalizadas para todo tipo de eventos.',
    type: 'website',
    locale: 'es_EC',
    url: `${SITE_URL}/`,
    siteName: 'Lumos By Paola',
    images: [
      {
        url: '/images/hero/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Lumos By Paola — Velas Artesanales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumos By Paola | Velas Artesanales Ecuador',
    description: 'Transforma tu espacio con un destello de aroma. Velas hechas 100% a mano.',
    images: ['/images/hero/hero.jpg'],
  },
  alternates: {
    canonical: `${SITE_URL}/`,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-brand-black text-brand-white font-body antialiased">
        {children}
      </body>
    </html>
  )
}
