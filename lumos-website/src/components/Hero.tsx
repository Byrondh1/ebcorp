import { WHATSAPP_URL } from '@/lib/constants'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-gold/4 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-brand-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-brand-gold/8" />
      </div>

      {/* Decorative floral SVG */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 md:w-[500px] md:h-[500px] opacity-5 pointer-events-none">
        <FloralDecoration />
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-60 h-60 md:w-80 md:h-80 opacity-5 pointer-events-none rotate-180">
        <FloralDecoration />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase">
            Velas Artesanales
          </span>
        </div>

        {/* Main heading */}
        <h1 className="font-heading font-semibold text-5xl md:text-7xl lg:text-8xl mb-4 leading-tight">
          <span className="text-gradient-gold">Lumos</span>
          <br />
          <span className="text-brand-white text-3xl md:text-4xl lg:text-5xl font-normal italic">
            by Paola
          </span>
        </h1>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-gold" />
          <FlowerIcon className="w-5 h-5 text-brand-gold" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-gold" />
        </div>

        {/* Slogan */}
        <p className="font-heading italic text-xl md:text-2xl lg:text-3xl text-brand-cream/90 mb-4">
          &ldquo;Transforma tu espacio con un destello de aroma&rdquo;
        </p>

        {/* Description */}
        <p className="text-brand-gray text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Velas florales artesanales elaboradas 100% a mano. Diseños únicos y personalizados
          para eventos, regalos y momentos especiales.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#productos" className="btn-gold text-base px-8 py-4 shadow-lg shadow-brand-gold/20">
            <span>Ver Productos</span>
            <ArrowDownIcon className="w-4 h-4" />
          </a>
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent('¡Hola! Me gustaría saber más sobre sus velas artesanales.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold text-base px-8 py-4"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Contactar por WhatsApp</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center animate-bounce">
          <a href="#nosotros" className="text-brand-gold/50 hover:text-brand-gold transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C10.9 2 10 2.9 10 4c0 .74.4 1.38 1 1.72V7H9C7.9 7 7 7.9 7 9c0 .74.4 1.38 1 1.72V12H6.28C5.94 11.4 5.3 11 4.56 11 3.46 11 2.56 11.9 2.56 13s.9 2 2 2c.74 0 1.38-.4 1.72-1H8v2c0 1.1.9 2 2 2h2v1.28c-.6.34-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.38-1-1.72V19h2c1.1 0 2-.9 2-2v-2h1.72c.34.6.98 1 1.72 1 1.1 0 2-.9 2-2s-.9-2-2-2c-.74 0-1.38.4-1.72 1H16v-1.28c.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2h-2V8.72c.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2z" />
    </svg>
  )
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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

function FloralDecoration() {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" className="text-brand-gold w-full h-full">
      <circle cx="100" cy="100" r="8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x = 100 + 40 * Math.cos(rad)
        const y = 100 + 40 * Math.sin(rad)
        return (
          <ellipse
            key={angle}
            cx={x}
            cy={y}
            rx="12"
            ry="22"
            transform={`rotate(${angle + 90}, ${x}, ${y})`}
          />
        )
      })}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x = 100 + 80 * Math.cos(rad)
        const y = 100 + 80 * Math.sin(rad)
        return (
          <ellipse
            key={`outer-${angle}`}
            cx={x}
            cy={y}
            rx="8"
            ry="16"
            transform={`rotate(${angle + 90}, ${x}, ${y})`}
          />
        )
      })}
    </svg>
  )
}
