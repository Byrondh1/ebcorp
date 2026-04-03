export default function About() {
  return (
    <section id="nosotros" className="py-20 md:py-28 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-3 block">
            Nuestra historia
          </span>
          <h2 className="section-heading">¿Por qué elegirnos?</h2>
          <span className="gold-line" />
        </div>

        {/* Main grid: text left, photo collage right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Text */}
          <div>
            <p className="text-brand-gray text-lg leading-relaxed mb-6">
              <span className="text-brand-gold font-semibold">Lumos by Paola</span> no vende solo
              cera con olor — vende una experiencia estética y emocional que la competencia
              difícilmente puede replicar.
            </p>
            <p className="text-brand-gray leading-relaxed mb-6">
              Cada vela es una pieza artesanal que tomó horas de diseño y selección de fragancias.
              Puedes crear recordatorios específicos para una boda o un bautizo, adaptando los
              aromas y colores al evento. La durabilidad y la intensidad del aroma son nuestras
              mejores cartas de presentación.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <div className="h-px flex-1 bg-gradient-to-r from-brand-gold/40 to-transparent" />
              <span className="text-brand-gold text-sm italic font-heading">
                Elaboradas 100% a mano con amor
              </span>
            </div>
          </div>

          {/* Photo Collage */}
          <div className="grid grid-cols-2 gap-3" style={{ gridTemplateRows: '220px 200px' }}>
            {/* Large image — spans full width */}
            <div className="col-span-2 rounded-2xl overflow-hidden">
              <img
                src="/images/about/about-1.jpg"
                alt="Ramos de velas artesanales de girasoles"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Two smaller images below */}
            <div className="rounded-2xl overflow-hidden">
              <img
                src="/images/about/about-2.jpg"
                alt="Vela Lupita en caja de regalo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="/images/about/about-3.jpg"
                alt="Arreglo de velas rosas en cajas corazón"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards — full width row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-gold/30 transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                <feature.Icon className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-white mb-1">{feature.title}</h3>
                <p className="text-brand-gray text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional photos strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-16 scrollbar-hide">
          {EXTRA_PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className="flex-shrink-0 w-48 h-48 rounded-2xl overflow-hidden"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-zinc-800">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl md:text-4xl font-semibold text-gradient-gold mb-1">
                {stat.value}
              </div>
              <div className="text-brand-gray text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    title: 'Diseño a medida',
    description:
      'Adaptamos aromas, colores y formas a tu evento o gusto personal. Cada pieza es única.',
    Icon: PaletteIcon,
  },
  {
    title: 'Aromas intensos y duraderos',
    description:
      'Seleccionamos las mejores fragancias para garantizar una experiencia sensorial duradera.',
    Icon: SparklesIcon,
  },
  {
    title: 'Hechas 100% a mano',
    description:
      'Cada vela pasa por un proceso artesanal cuidadoso. No hay dos iguales — eso las hace especiales.',
    Icon: HandIcon,
  },
]

const EXTRA_PHOTOS = [
  { src: '/images/about/about-4.jpg',  alt: 'Bouquet de velas girasoles y margaritas' },
  { src: '/images/about/about-5.jpg',  alt: 'Vela Lupita sostenida en mano' },
  { src: '/images/about/about-6.jpg',  alt: 'Detalle artesanal de velas florales' },
  { src: '/images/about/about-7.jpg',  alt: 'Arreglo especial de velas Lumos by Paola' },
  { src: '/images/about/about-8.jpg',  alt: 'Proceso de elaboración artesanal' },
  { src: '/images/about/about-9.jpg',  alt: 'Velas aromáticas personalizadas' },
  { src: '/images/about/about-10.jpg', alt: 'Colección de velas florales' },
  { src: '/images/about/about-11.jpg', alt: 'Arreglo floral con velas artesanales' },
  { src: '/images/about/about-12.jpg', alt: 'Caja de regalo con velas Lumos by Paola' },
  { src: '/images/about/about-13.jpg', alt: 'Velas artesanales hechas a mano en Ecuador' },
]

const STATS = [
  { value: '100%', label: 'Artesanal' },
  { value: '+50', label: 'Diseños únicos' },
  { value: '4★+', label: 'Valoración clientes' },
  { value: '∞', label: 'Personalización' },
]

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

function HandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
    </svg>
  )
}
