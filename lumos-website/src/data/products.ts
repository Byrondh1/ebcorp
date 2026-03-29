export type ProductCategory = 'floral' | 'special' | 'arrangements' | 'premium'

export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  isFeatured?: boolean
  image?: string
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  floral: 'Formas Florales',
  special: 'Especiales & Religiosas',
  arrangements: 'Arreglos',
  premium: 'Línea Premium',
}

export const PRODUCTS: Product[] = [
  // Formas Florales
  {
    id: 'rosas',
    name: 'Velas de Rosas',
    description: 'Individuales o en sets. Elegancia floral capturada en cera artesanal con aromas únicos.',
    category: 'floral',
    image: '/images/products/rosas.jpg',
  },
  {
    id: 'girasoles',
    name: 'Velas de Girasoles',
    description: 'Individuales o en sets. Ideales para dar luz y energía a cualquier espacio.',
    category: 'floral',
    image: '/images/products/girasoles.jpg',
  },
  {
    id: 'margaritas',
    name: 'Velas de Margaritas',
    description: 'Individuales o en sets. Un toque sencillo y elegante para tu hogar.',
    category: 'floral',
    image: '/images/products/margaritas.jpg',
  },
  {
    id: 'peonias',
    name: 'Velas de Peonías',
    description: 'Individuales o en sets. Muy buscadas por su volumen y sofisticación.',
    category: 'floral',
    image: '/images/products/peonias.jpg',
  },
  // Especiales & Religiosas
  {
    id: 'lupita',
    name: 'Vela "La Lupita"',
    description: 'Virgen de Guadalupe en cera artesanal. Un diseño con mucha identidad, devoción y amor.',
    category: 'special',
    isFeatured: true,
    image: '/images/products/lupita.jpg',
  },
  {
    id: 'recordatorios',
    name: 'Velas para Recordatorios',
    description: 'Diseños específicos y personalizados para Bodas, Bautizos y Graduaciones.',
    category: 'special',
    image: '/images/products/recordatorios.jpg',
  },
  // Arreglos
  {
    id: 'arreglo-14',
    name: 'Arreglo de 14 Flores',
    description: 'Combinaciones florales en cera, perfectas como detalle especial para cualquier ocasión.',
    category: 'arrangements',
    image: '/images/products/arreglo-14.jpg',
  },
  {
    id: 'arreglo-20',
    name: 'Arreglo de 20 Flores',
    description: 'Una opción más lujosa y completa. El regalo ideal para sorprender a alguien especial.',
    category: 'arrangements',
    image: '/images/products/arreglo-20.jpg',
  },
  {
    id: 'canasta',
    name: 'Canasta de Regalo',
    description: 'Mezcla de velas aromáticas y flores decorativas. El regalo perfecto en una presentación única.',
    category: 'arrangements',
    image: '/images/products/canasta.jpg',
  },
  // Línea Premium
  {
    id: 'caja-mom',
    name: 'Caja "MOM"',
    description: 'Especial para el Día de la Madre. Una experiencia de aroma y amor en una caja única.',
    category: 'premium',
    image: '/images/products/caja-mom.jpg',
  },
  {
    id: 'caja-love',
    name: 'Caja "I ❤️ U"',
    description: 'Perfecta para San Valentín o aniversarios. Transmite amor con cada destello.',
    category: 'premium',
    image: '/images/products/caja-love.jpg',
  },
  {
    id: 'caja-personalizada',
    name: 'Cajas Personalizadas',
    description: 'Empaques robustos y elegantes que el cliente puede conservar. 100% a tu medida.',
    category: 'premium',
    image: '/images/products/caja-personalizada.jpg',
  },
]
