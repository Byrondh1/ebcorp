const TESTIMONIALS = [
  {
    name: 'Jasmín Pinchao',
    text: 'Las velas están bien elaboradas y tienen un aroma super rico y fuerte. ¡Las recomiendo totalmente!',
    initials: 'JP',
    color: '#F9C6D0',
  },
  {
    name: 'Tania Arcos',
    text: 'Las virgencitas están muy lindas. Un detalle precioso y lleno de devoción. Quedé encantada.',
    initials: 'TA',
    color: '#C9A84C',
  },
  {
    name: 'Dr. Alex Sandoval',
    text: 'Están hermosas, un detalle hecho con amor, super recomendado. La calidad y el acabado son increíbles.',
    initials: 'AS',
    color: '#E2C97A',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-20 md:py-28 relative overflow-hidden bg-brand-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-rose/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-3 block">
            Testimonios
          </span>
          <h2 className="section-heading">Lo que dicen nuestros clientes</h2>
          <span className="gold-line" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative p-7 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-brand-gold/30 transition-all duration-300 group flex flex-col"
            >
              {/* Quote mark */}
              <div className="absolute top-5 right-6 text-6xl font-heading text-brand-gold/10 leading-none select-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-brand-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-brand-gray leading-relaxed flex-1 mb-6 text-sm md:text-base">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-brand-black flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-brand-white text-sm">{t.name}</p>
                  <p className="text-brand-gray text-xs">Cliente verificado</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div className="mt-14 text-center">
          <p className="font-heading italic text-xl text-brand-gold/70">
            &ldquo;Cada vela cuenta tu historia&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
