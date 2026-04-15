# EB Corp — Blueprint Maestro de Arquitectura Web
**Electrical Business Corporation | Quito, Ecuador**

---

## 1. SITEMAP — Arquitectura de Información

```
ebcorp.netlify.app/
│
├── index.html                    → Home (principal)
│
├── pages/
│   ├── servicios-electricos.html → Ingeniería Eléctrica (H1 único)
│   ├── desarrollo-web.html       → Desarrollo Web (H1 único)
│   ├── proyectos.html            → Portfolio completo
│   └── contacto.html             → Página de contacto + formulario
│
├── css/
│   ├── styles.css                → Design system global
│   └── pages.css                 → Estilos de páginas internas
│
├── js/
│   └── main.js                   → Navegación, AOS, contadores, filtros
│
└── assets/
    ├── favicon.svg
    └── images/                   → (Carpeta para imágenes reales de proyectos)
```

### Escalabilidad futura (sin romper jerarquía):
- `/pages/blog/` → Artículos SEO (ingeniería eléctrica, tips web)
- `/pages/servicios-electricos/instalaciones.html` → Sub-páginas de servicios
- `/pages/casos-de-estudio/` → Case studies detallados
- `/pages/sobre-nosotros.html` → Página del fundador/equipo

---

## 2. ESTRUCTURA DE LA HOME — Wireframe con Objetivos Psicológicos

### Sección 1: NAV
- **Objetivo**: Orientación y acceso rápido al CTA principal
- **Elementos**: Logo + links + botón WhatsApp (siempre visible)
- **Comportamiento**: `position: fixed`, scroll → fondo sólido, mobile → hamburger

### Sección 2: HERO
- **Objetivo psicológico**: Claridad absoluta en 5 segundos — "¿Dónde estoy? ¿Qué hacen?"
- **Mensaje clave**: "Una empresa. Dos especialidades."
- **CTA dual**: [Cotizar proyecto WhatsApp] + [Ver servicios]
- **Social proof visual**: Dos cards — Ingeniería Eléctrica + Desarrollo Web
- **Fondo**: Dark + grid + partículas (autoridad técnica)

### Sección 3: STATS BAR
- **Objetivo psicológico**: Validación inmediata antes de profundizar
- **Números**: +50 proyectos / 100% satisfacción / 2 especialidades / 24/7
- **Animación**: Conteo progresivo al hacer scroll (refuerza credibilidad)

### Sección 4: PAIN POINTS
- **Objetivo psicológico**: Resonancia empática — "Me entienden, saben mi problema"
- **Estructura**: Dos columnas de problemas (eléctrico | web) + empresa al centro
- **Copy**: Lista de dolores específicos con iconos ✕ (antes de la solución)

### Sección 5: SOLUTION (PUV)
- **Objetivo psicológico**: Posicionamiento como única opción viable
- **Mensaje**: "El puente entre el mundo industrial y digital"
- **Visual**: Diagrama — Ingeniería → EB Corp → Web → Empresa más competitiva
- **Credenciales**: NEC/IEC + 24/7 + un solo proveedor

### Sección 6: SERVICES
- **Objetivo psicológico**: Especificidad = confianza. "Sé exactamente lo que ofrecen"
- **Formato**: Dos pilares (eléctrico | digital) con lista de sub-servicios
- **CTA por pilar**: Links a páginas dedicadas (más detalles + más SEO)

### Sección 7: PROCESS
- **Objetivo psicológico**: Reducir la fricción de inicio — "Es más fácil de lo que pensaba"
- **3 pasos**: Consulta gratuita → Propuesta técnica → Ejecución y entrega
- **Fondo dark**: Contraste visual, genera break en el scroll

### Sección 8: PROJECTS
- **Objetivo psicológico**: Prueba social visual — "Han hecho esto antes, funciona"
- **Filtros**: Todos / Eléctrico / Web (interactividad = engagement)
- **6 proyectos**: Mix estratégico eléctrico + web + uno integral (PUV reforzada)

### Sección 9: TESTIMONIALS
- **Objetivo psicológico**: Validación de terceros — "No solo ellos lo dicen"
- **3 testimonios**: Uno eléctrico + uno web + uno soporte
- **Elementos de confianza**: 5 estrellas + nombre + empresa + sector

### Sección 10: CTA FINAL
- **Objetivo psicológico**: Capturar a quien llegó hasta aquí con máxima fricción mínima
- **Urgencia suave**: "Respuesta en menos de 2 horas"
- **Doble CTA**: WhatsApp (principal) + Email (alternativo)
- **Trust markers**: Sin compromiso / Presupuesto gratuito / Respuesta garantizada

### Footer
- Logo + descripción + redes sociales
- Links de servicios y empresa
- Contacto directo (WhatsApp, email, Instagram, ubicación)

---

## 3. STACK TECNOLÓGICO RECOMENDADO

### Actual (fase 0 — mínimo viable ✅)
| Componente | Solución | Justificación |
|------------|----------|---------------|
| Frontend | HTML5 + CSS3 + Vanilla JS | Cero dependencias, carga ultrarrápida, fácil mantenimiento |
| Deploy | Netlify (CDN global) | Free tier, HTTPS automático, CI/CD con Git |
| Performance | Sin frameworks CSS | Sin Bootstrap overhead, CSS custom properties |
| Fonts | Google Fonts (Inter + Space Grotesk) | Profesional, técnico, legible |

### Fase 1 — Crecimiento (3-6 meses)
| Componente | Solución | Justificación |
|------------|----------|---------------|
| Formulario | Formspree / Netlify Forms | Backend de formularios sin servidor |
| Analytics | Google Analytics 4 | Tracking gratuito de conversiones |
| SEO local | Google Business Profile | Aparecer en "electricistas en Quito" |
| Imágenes | WebP + lazy loading | PageSpeed 90+ garantizado |

### Fase 2 — Escalabilidad (6-18 meses)
| Componente | Solución | Justificación |
|------------|----------|---------------|
| CMS | Decap CMS (headless) | Gestión de contenido sin tocar código |
| Blog | Astro o Eleventy (SSG) | SEO máximo, cero JS innecesario |
| Presupuestador | JS vanilla → form dinámico | Calificador de leads automático |
| CRM | HubSpot Free | Tracking de leads desde WhatsApp/formulario |

### ¿Por qué NO WordPress para este caso?
- Overhead de PHP/MySQL innecesario para un sitio de servicios B2B
- Netlify + HTML estático: TTFB < 100ms vs WordPress 500-1500ms
- Cero vulnerabilidades de plugins
- Menor costo de mantenimiento

---

## 4. ESTRATEGIA SEO

### Arquitectura de H1/H2/H3

#### Home (`/index.html`)
```
H1: "Una empresa. Dos especialidades." [branding]
  H2: Nuestros servicios — Dos especialidades. Una empresa.
    H3: Ingeniería Eléctrica
    H3: Desarrollo Web
  H2: El puente entre el mundo industrial y el mundo digital
  H2: Simple, claro y sin sorpresas [proceso]
  H2: +50 proyectos. 100% clientes satisfechos. [proyectos]
  H2: Lo que dicen nuestros clientes
  H2: ¿Listo para dar el siguiente paso? [CTA]
```

#### Servicios Eléctricos (`/pages/servicios-electricos.html`)
```
H1: Ingeniería Eléctrica Industrial & Comercial
  H2: Soluciones eléctricas completas para tu empresa
    H3: Instalaciones Eléctricas Industriales
    H3: Auditorías y Diagnóstico Eléctrico
    H3: Tableros de Control y Protección
    H3: Sistemas de Respaldo de Energía
    H3: Cumplimiento Normativo NEC/IEC
    H3: Mantenimiento Eléctrico Preventivo
  H2: Lo que nos hace diferentes en ingeniería eléctrica
```

#### Desarrollo Web (`/pages/desarrollo-web.html`)
```
H1: Desarrollo Web Profesional & Optimizado
  H2: Todo lo que necesita tu presencia digital
    H3: Sitios Web Corporativos
    H3: Tiendas en Línea (E-commerce)
    H3: SEO y Posicionamiento Web
    H3: Diseño Responsive (Mobile First)
    H3: Hosting, Dominio y Seguridad
    H3: Mantenimiento y Soporte Web
  H2: De cero a publicado en 2-4 semanas
```

### Estructura de URLs
```
/                                    → Home
/pages/servicios-electricos.html     → [Mejora futura: /ingenieria-electrica/]
/pages/desarrollo-web.html           → [Mejora futura: /desarrollo-web/]
/pages/proyectos.html                → [Mejora futura: /proyectos/]
/pages/contacto.html                 → [Mejora futura: /contacto/]
```

### Keywords objetivo (Ecuador/Quito)
| Keyword | Volumen est. | Intención |
|---------|-------------|-----------|
| instalaciones eléctricas quito | Alta | Comercial |
| electricista industrial ecuador | Media | Comercial |
| ingeniería eléctrica quito | Media | Comercial |
| desarrollo web quito | Alta | Comercial |
| diseño web ecuador | Alta | Comercial |
| sitio web corporativo quito | Media | Comercial |
| tienda online ecuador | Alta | Comercial |

### Meta tags implementados
- `<title>` único por página (55-60 chars)
- `<meta description>` único (150-160 chars)
- `<meta keywords>` con variaciones locales
- `<link rel="canonical">` en todas las páginas
- Open Graph completo (og:title, og:description, og:image)
- Schema.org JSON-LD (ProfessionalService, Service)
- `lang="es-EC"` en el HTML

---

## 5. DISEÑO VISUAL — Sistema de Diseño

### Paleta de Colores

| Nombre | HEX | Uso |
|--------|-----|-----|
| Deep Navy | `#1A2B5F` | Color primario, botones, headers |
| Navy Dark | `#0F1A3D` | Fondos oscuros, overlays |
| Electric Cyan | `#00D4FF` | Acento digital, links activos, elementos tech |
| Amber Electric | `#F5A623` | Acento eléctrico, highlights, advertencias positivas |
| Emerald | `#00C896` | Éxito, checks, elementos positivos |
| Dark Base | `#0D1117` | Fondo principal oscuro |
| Dark 2 | `#161B27` | Fondos alternativos oscuros |
| Gray 900 | `#111827` | Texto principal |
| Gray 700 | `#374151` | Texto secundario |
| Gray 500 | `#6B7280` | Texto terciario, placeholders |
| White | `#FFFFFF` | Fondos claros, texto sobre oscuro |

**Psicología de la paleta:**
- **Navy** → Autoridad técnica, confianza corporativa B2B (sector financiero/industrial)
- **Cyan eléctrico** → Innovación digital, energía, tecnología (diferenciador)
- **Amber/Amarillo** → Electricidad (asociación directa), atención sin alarma
- **Fondo oscuro** → Seriedad técnica, contraste que destaca los CTAs

### Tipografías

| Rol | Fuente | Peso | Uso |
|-----|--------|------|-----|
| Headings | Inter | 800-900 | H1, H2, H3 principales |
| Body | Inter | 400-600 | Párrafos, labels, UI |
| Números / Datos | Space Grotesk | 600-700 | Stats, datos técnicos, logo |

**¿Por qué Inter?**
- Diseñada específicamente para UI digital
- Altamente legible en tamaños pequeños
- Proyección técnica sin ser fría (vs Roboto)
- Usada por Linear, Vercel, Supabase (sectores tech referentes)

**¿Por qué Space Grotesk para datos?**
- Carácter geométrico = técnico, ingenieril
- Diferencia visualmente números de texto (importante para stats)
- Transmite precisión (clave para el sector eléctrico)

### Estilo Visual General
- **Modo oscuro** para hero y secciones clave → autoridad premium
- **Modo claro** para contenido → legibilidad y confianza
- **Gradientes** sutiles → modernidad sin exceso
- **Bordes** muy suaves, casi invisibles → limpieza
- **Sombras** multicapa → profundidad y jerarquía
- **Sin imágenes stock genéricas** → sustituibles por gradientes de marca

### Componentes de Conversión
1. **WhatsApp FAB** → Siempre visible, tooltip contextual
2. **Nav CTA** → Botón verde WhatsApp en navbar (contraste máximo)
3. **Doble CTA en hero** → WhatsApp + Ver servicios (captura todos los intent)
4. **CTA inline en servicios** → Al final de cada pilar
5. **CTA final** → Sección dedicada con trust markers

---

## 6. DECISIONES TÉCNICAS CLAVE

### Rendimiento
- CSS custom properties (sin preprocessor overhead)
- AOS nativo (sin librería externa = -28KB)
- Partículas generadas con JS nativo (sin canvas library)
- Font display swap activado por Google Fonts
- No hay JavaScript bloqueante (todo `defer`)

### Accesibilidad (WCAG 2.1 AA)
- `aria-label` en todos los iconos sin texto
- `aria-labelledby` en todas las secciones
- `aria-expanded` en el toggle de navegación
- Breadcrumbs con `aria-label="Ruta de navegación"`
- Contraste de texto: mínimo 4.5:1 en todos los casos
- Focus visible en todos los elementos interactivos
- `lang="es-EC"` para screen readers

### Formulario de contacto (contacto.html)
- El formulario recoge datos y los envía por WhatsApp con un mensaje pre-formateado
- No requiere backend ni servidor
- Fallback: email directo disponible siempre

---

## 7. PRÓXIMOS PASOS RECOMENDADOS

### Inmediato (semana 1-2)
- [ ] Reemplazar gradientes de proyectos con imágenes reales de los trabajos
- [ ] Crear og:image (1200×630px) para redes sociales
- [ ] Activar Netlify Forms en contacto.html
- [ ] Configurar Google Analytics 4

### Corto plazo (mes 1-3)
- [ ] Crear Google Business Profile con fotos de proyectos
- [ ] Fotografía profesional de proyectos reales
- [ ] Testimoniales con foto del cliente (aumenta conversión ~34%)
- [ ] Video corto del fundador para sección "Nosotros"

### Mediano plazo (mes 3-6)
- [ ] Blog con artículos: "Norma NEC en Ecuador", "Costo de un sitio web profesional"
- [ ] Calculadora/cotizador interactivo online
- [ ] Integrar WhatsApp Business API para respuesta automática

---

*Blueprint generado para: EB Corp — Electrical Business Corporation*
*Quito, Ecuador | ebcorp.netlify.app | @eb_corp1*
