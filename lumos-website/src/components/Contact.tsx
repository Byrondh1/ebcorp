import { WHATSAPP_URL, EMAIL, SOCIAL } from '@/lib/constants'

export default function Contact() {
  const whatsappMessage = encodeURIComponent(
    '¡Hola! Me gustaría hacer un pedido o consultar sobre sus velas artesanales.'
  )

  return (
    <section id="contacto" className="py-20 md:py-28 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-3 block">
          Contacto
        </span>
        <h2 className="section-heading mb-4">¿Tienes algo en mente?</h2>
        <span className="gold-line" />

        <p className="text-brand-gray text-lg mt-8 mb-3">
          Diseñamos la vela perfecta para ti.
        </p>
        <p className="text-brand-white font-heading italic text-2xl mb-10">
          ¡Escríbenos y hagámoslo realidad!
        </p>

        {/* Main WhatsApp CTA */}
        <a
          href={`${WHATSAPP_URL}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-[#20bd5a] transition-all duration-300 shadow-xl shadow-[#25D366]/20 hover:shadow-[#25D366]/30 hover:scale-105 active:scale-100 mb-12"
        >
          <WhatsAppIcon className="w-6 h-6" />
          Escríbenos por WhatsApp
        </a>

        {/* Availability badge */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-brand-gray text-sm">Siempre disponibles para atenderte</span>
          <span className="text-brand-gold">✦</span>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-brand-gold text-xs uppercase tracking-widest">También puedes encontrarnos en</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-4 flex-wrap mb-12">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-gold/40 hover:text-brand-gold text-brand-gray transition-all text-sm group"
          >
            <InstagramIcon className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
            <span>@lumos.by.paola</span>
          </a>
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-gold/40 hover:text-brand-gold text-brand-gray transition-all text-sm group"
          >
            <FacebookIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Lumos By Paola</span>
          </a>
          <a
            href={SOCIAL.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-gold/40 hover:text-brand-gold text-brand-gray transition-all text-sm group"
          >
            <TikTokIcon className="w-5 h-5 group-hover:text-white transition-colors" />
            <span>@lumos.by.paola</span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-brand-gold/40 hover:text-brand-gold text-brand-gray transition-all text-sm group"
          >
            <EmailIcon className="w-5 h-5 group-hover:text-brand-gold transition-colors" />
            <span>{EMAIL}</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.23 8.23 0 004.83 1.55V6.79a4.85 4.85 0 01-1.06-.1z" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}
