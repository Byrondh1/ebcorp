export const WHATSAPP_NUMBER = '593962927911'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const EMAIL = 'tefapayo@hotmail.com'

export const SOCIAL = {
  facebook: 'https://www.facebook.com/share/1U6rLNRkjA/',
  tiktok: 'https://www.tiktok.com/@lumos.by.paola',
  instagram: 'https://www.instagram.com/lumos.by.paola',
}

export function getWhatsAppProductUrl(productName: string): string {
  const message = encodeURIComponent(
    `¡Hola! Me interesa el producto: ${productName}. ¿Me puedes dar más información y precio?`
  )
  return `${WHATSAPP_URL}?text=${message}`
}

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Productos', href: '#productos' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
]
