# CLAUDE.md — Agent Skills (by Addy Osmani / Google)
> Basado en https://github.com/addyosmani/agent-skills — 43k ⭐
> Instrucciones de ingeniería de nivel producción para Claude Code.

---

## 🗺️ CÓMO USAR ESTAS SKILLS

Antes de empezar cualquier tarea, identifica en qué fase estás:

| Si vas a... | Usa la skill |
|---|---|
| Definir qué construir | `spec-driven-development` |
| Refinar una idea vaga | `idea-refine` |
| Aclarar requisitos | `interview-me` |
| Planificar tareas | `planning-and-task-breakdown` |
| Construir código | `incremental-implementation` |
| Hacer UI/frontend | `frontend-ui-engineering` |
| Diseñar APIs | `api-and-interface-design` |
| Escribir tests | `test-driven-development` |
| Debuggear errores | `debugging-and-error-recovery` |
| Revisar código | `code-review-and-quality` |
| Simplificar código | `code-simplification` |
| Seguridad | `security-and-hardening` |
| Performance | `performance-optimization` |
| Hacer commit/branches | `git-workflow-and-versioning` |
| Deploy/CI-CD | `ci-cd-and-automation` |
| Documentar | `documentation-and-adrs` |
| Lanzar a producción | `shipping-and-launch` |

**Regla de oro:** Las skills se activan automáticamente según el contexto. Si estás construyendo UI, aplica `frontend-ui-engineering`. Si estás haciendo un deploy, aplica `shipping-and-launch`.

---

## 📋 FASE 1 — DEFINE (Antes de escribir una sola línea de código)

### skill: spec-driven-development

**Nunca escribas código sin un spec.** Un spec de 15 minutos evita horas de reescritura.

**Cuándo usar:** Proyecto nuevo, feature nueva, cambio que toca múltiples archivos, tarea de más de 30 minutos.

**Flujo obligatorio:**
```
SPECIFY → PLAN → TASKS → IMPLEMENT
   ↓         ↓      ↓         ↓
 Revisar   Revisar  Revisar  Revisar
```
No avanzar a la siguiente fase sin validación.

**Template de Spec:**
```
# Spec: [Nombre del Proyecto/Feature]

## Objetivo
[Qué construimos y por qué. Criterios de aceptación.]

## Tech Stack
[Framework, lenguaje, dependencias clave con versiones]

## Comandos
[Build, test, lint, dev — comandos completos]

## Estructura del Proyecto
[Layout de directorios con descripciones]

## Estilo de Código
[Snippet de ejemplo + convenciones clave]

## Estrategia de Testing
[Framework, ubicación de tests, cobertura requerida]

## Límites
- Siempre: [...]
- Preguntar primero: [...]
- Nunca: [...]

## Criterios de Éxito
[Condiciones específicas y testeables de "done"]

## Preguntas Abiertas
[Cosas sin resolver que necesitan input]
```

**Antes de escribir el spec, lista tus supuestos:**
```
SUPUESTOS QUE ESTOY HACIENDO:
1. Es una app web (no mobile nativa)
2. La base de datos es PostgreSQL
3. Apuntamos a browsers modernos
→ Corrígeme ahora o procedo con estos.
```

**Anti-racionalizaciones:**
- "Es simple, no necesito spec" → Los specs simples son de 2 líneas. Aun así los necesitas.
- "Lo escribo después de codear" → Eso es documentación, no especificación.
- "Los requisitos van a cambiar" → El spec es un documento vivo. Cámbialo cuando cambien.

---

### skill: interview-me

**Cuándo usar:** El pedido es vago o el usuario dice "entrevístame" / "hazme preguntas".

**Proceso:** Una pregunta a la vez. No bombardear con múltiples preguntas. Continuar hasta tener ~95% de confianza en lo que el usuario quiere construir.

---

### skill: idea-refine

**Cuándo usar:** Tienes un concepto rough que necesita exploración.

**Proceso:** Pensamiento divergente (explorar posibilidades) → convergente (elegir la mejor). Convertir ideas vagas en propuestas concretas con criterios de éxito.

---

## 🗂️ FASE 2 — PLAN (Descomponer en tareas)

### skill: planning-and-task-breakdown

**Cuándo usar:** Tienes un spec y necesitas unidades implementables.

**Reglas de tareas:**
- Cada tarea completable en una sesión enfocada
- Cada tarea tiene criterios de aceptación explícitos
- Cada tarea incluye un paso de verificación (test, build, revisión manual)
- Tareas ordenadas por dependencia, no por importancia percibida
- Ninguna tarea debería tocar más de ~5 archivos

**Template de tarea:**
```
- [ ] Tarea: [Descripción]
  - Aceptación: [Qué debe ser verdad cuando esté listo]
  - Verificar: [Cómo confirmar — comando de test, build, revisión manual]
  - Archivos: [Qué archivos se van a tocar]
```

---

## 🔨 FASE 3 — BUILD (Escribir el código)

### skill: incremental-implementation

**Nunca construyas todo de una vez.** Thin vertical slices — implementa, testea, verifica, commitea.

**Patrón de trabajo:**
```
Implementar slice → Testear → Verificar → Commitear → Siguiente slice
```

**Reglas:**
- Feature flags para trabajo incompleto
- Defaults seguros en todo
- Cambios amigables al rollback
- Cualquier cambio que toque más de un archivo necesita esta disciplina

---

### skill: frontend-ui-engineering

**Objetivo:** UI de calidad producción — no "aesthetic de AI".

**Evita el aesthetic de AI generativa:**

| ❌ AI Default | ✅ Calidad Producción |
|---|---|
| Morado/índigo en todo | Paleta real del proyecto |
| Gradientes excesivos | Gradientes sutiles del design system |
| `rounded-2xl` en todo | Border-radius consistente del design system |
| Hero sections genéricas | Layouts content-first |
| Lorem ipsum | Contenido placeholder realista |
| Padding gigante uniforme | Escala de espaciado consistente |
| Card grids stock | Layouts con propósito |
| Sombras en todo | Sombras sutiles o ninguna |

**Arquitectura de componentes:**
```
src/components/
  TaskList/
    TaskList.tsx          # Implementación
    TaskList.test.tsx     # Tests
    use-task-list.ts      # Custom hook (si hay estado complejo)
    types.ts              # Tipos del componente
```

**Preferir composición sobre configuración:**
```tsx
// ✅ Bueno: Composable
<Card>
  <CardHeader><CardTitle>Tareas</CardTitle></CardHeader>
  <CardBody><TaskList tasks={tasks} /></CardBody>
</Card>

// ❌ Evitar: Over-configurado
<Card title="Tareas" headerVariant="large" content={<TaskList />} />
```

**Separar data fetching de presentación:**
```tsx
// Container: maneja datos
export function TaskListContainer() {
  const { tasks, isLoading, error } = useTasks();
  if (isLoading) return <TaskListSkeleton />;
  if (error) return <ErrorState message="Error cargando tareas" />;
  if (tasks.length === 0) return <EmptyState message="Sin tareas aún" />;
  return <TaskList tasks={tasks} />;
}

// Presentación: maneja el render
export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul role="list" className="divide-y">
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
    </ul>
  );
}
```

**Accesibilidad WCAG 2.1 AA (obligatorio):**
- Todo elemento interactivo navegable con teclado
- Labels ARIA en elementos sin texto visible
- Manejo de focus cuando cambia contenido
- Estados de error, loading y vacío siempre presentes

**Diseño responsive (mobile-first):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```
Testear en: 320px, 768px, 1024px, 1440px.

**Red flags:**
- Componentes de más de 200 líneas
- Estilos inline o valores arbitrarios en px
- Sin estados de error, loading o vacío
- Sin navegación por teclado

---

### skill: test-driven-development

**Red-Green-Refactor. Tests primero.**

**Pirámide de tests (80/15/5):**
- 80% Unit tests (rápidos, aislados)
- 15% Integration tests
- 5% E2E tests

**Regla Beyoncé:** Si no está testeado, no te importa. Si te importa, testéalo.

**DAMP sobre DRY en tests:** Los tests deben ser descriptivos y explícitos, incluso si hay algo de repetición. La legibilidad importa más que la brevedad.

---

### skill: api-and-interface-design

**Contract-first:** Define la API antes de implementarla.

**Ley de Hyrum:** Con suficientes usuarios, *todo* comportamiento observable de tu API se convierte en dependencia. Diseña con eso en mente.

**One-Version Rule:** No rompas APIs existentes. Depreca, no elimines.

**Validación en boundaries:** Valida inputs en el borde del sistema, no en lo profundo.

---

### skill: context-engineering

**Dale al agente la información correcta en el momento correcto.**

- Carga el spec relevante al inicio de cada sesión
- No inundes el contexto con todo el codebase
- Referencia archivos específicos, no carpetas enteras
- Si la calidad del output baja, es una señal de context drift — recarga el contexto

---

### skill: source-driven-development

**Grunda cada decisión de framework en documentación oficial.**

- Verifica antes de implementar
- Cita las fuentes
- Marca lo que no está verificado
- No asumas que tu conocimiento de una librería está actualizado

---

### skill: doubt-driven-development

**Revisión adversarial de decisiones importantes.**

Flujo: `CLAIM → EXTRACT → DOUBT → RECONCILE → STOP`

**Cuándo usar:** Stakes altos (producción, seguridad, irreversible), código desconocido, output muy confiado que es más barato verificar ahora que debuggear después.

---

## ✅ FASE 4 — VERIFY (Probar que funciona)

### skill: debugging-and-error-recovery

**5 pasos de triage:**
1. **Reproducir** — Crea un caso de prueba mínimo que falla consistentemente
2. **Localizar** — Reduce el problema al componente o función específica
3. **Reducir** — Elimina variables hasta tener el caso más simple posible
4. **Fijar** — Implementa la solución
5. **Guardar** — Agrega un test que previene la regresión

**Stop-the-line rule:** Si los tests fallan, para. No avances hasta que estén verdes.

**Fallbacks seguros:** Prefiere fallar ruidosamente (error claro) sobre fallar silenciosamente.

---

### skill: browser-testing-with-devtools

**Cuándo usar:** Construyendo o debuggeando cualquier cosa que corra en un browser.

Usa Chrome DevTools para: DOM inspection, console logs, network traces, performance profiling.

**No asumas que funciona** sin verificar en el browser real con DevTools abierto.

---

## 🔍 FASE 5 — REVIEW (Calidad antes del merge)

### skill: code-review-and-quality

**5 ejes de revisión:**
1. Corrección — ¿Hace lo que debe?
2. Tests — ¿Hay pruebas suficientes?
3. Diseño — ¿Es mantenible?
4. Seguridad — ¿Hay vulnerabilidades?
5. Performance — ¿Hay problemas obvios?

**Sizing de cambios:**
- ~100 líneas → Fácil de revisar
- ~300 líneas → Aceptable para un cambio lógico
- ~1000 líneas → Dividir en cambios menores

**Etiquetas de severidad:**
- `Nit:` → Preferencia menor, no bloquea
- `Optional:` → Sugerencia, el autor decide
- `FYI:` → Informativo, sin acción requerida
- Sin etiqueta → Debe resolverse antes del merge

---

### skill: code-simplification

**Chesterton's Fence:** No elimines código sin entender por qué existe.

**Rule of 500:** Ningún archivo debería tener más de 500 líneas. Si lo tiene, refactoriza.

**Objetivo:** Reducir complejidad preservando exactamente el mismo comportamiento. Claridad sobre astucia.

---

### skill: security-and-hardening

**OWASP Top 10 siempre en mente.**

**Reglas no negociables:**
- Nunca commitear secrets, API keys o passwords
- Validar todos los inputs del usuario
- Sanitizar antes de renderizar (XSS)
- Usar prepared statements (SQL injection)
- HTTPS siempre en producción
- Auditar dependencias regularmente (`npm audit`)

**Sistema de 3 tiers:**
- **Siempre hacer:** Validar inputs, seguir convenciones, HTTPS
- **Preguntar primero:** Cambios en auth, nuevas dependencias críticas
- **Nunca hacer:** Commitear secrets, deshabilitar validación, ignorar warnings de seguridad

---

### skill: performance-optimization

**Medir primero, optimizar después.** No optimices sin datos.

**Core Web Vitals targets:**
- LCP (Largest Contentful Paint) < 2.5s
- FID/INP (Interaction to Next Paint) < 200ms
- CLS (Cumulative Layout Shift) < 0.1

**Flujo:** Perfilar → Identificar bottleneck → Optimizar → Medir de nuevo.

---

## 🚀 FASE 6 — SHIP (Deploy con confianza)

### skill: git-workflow-and-versioning

**Trunk-based development:** `main` siempre deployable. Feature branches de 1-3 días máximo.

**Commit como save point:**
```
Implementar slice → Test pasa → Commitear → Siguiente slice
```

**Commits atómicos:** Cada commit hace una sola cosa lógica.

**Formato de mensaje:**
```
<tipo>: <descripción corta>

<cuerpo opcional explicando el POR QUÉ, no el qué>
```

**Tipos:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

**Pre-commit checklist:**
```bash
git diff --staged                          # Revisar qué vas a commitear
git diff --staged | grep -i "password\|secret\|api_key"  # Sin secrets
npm test                                   # Tests pasan
npm run lint                               # Sin errores de lint
```

**Resumen de cambios (después de cada modificación):**
```
CAMBIOS HECHOS:
- archivo.ts: [qué cambió y por qué]

COSAS QUE NO TOQUÉ (intencionalmente):
- otro-archivo.ts: [razón]

POSIBLES PREOCUPACIONES:
- [cualquier cosa que el revisor debería saber]
```

**Red flags:**
- Cambios sin commitear acumulándose
- Mensajes de commit como "fix", "update", "misc"
- Cambios de formato mezclados con cambios de comportamiento
- Sin `.gitignore`
- Ramas de larga duración (más de 3 días)

---

### skill: ci-cd-and-automation

**Shift Left:** Detectar problemas lo antes posible en el pipeline.

**Faster is Safer:** Pipelines rápidos = feedback rápido = deploys más seguros.

**Pipeline de calidad:**
```
Push → Lint → Tests → Build → Deploy staging → Tests E2E → Deploy producción
```

**Feature flags > branches largas:** Deploy código incompleto detrás de flags en lugar de mantenerlo en ramas semanas.

---

### skill: shipping-and-launch

**Pre-launch checklist (antes de cada deploy):**

- [ ] Tests pasan en CI
- [ ] Build exitoso
- [ ] Variables de entorno configuradas correctamente
- [ ] Sin secrets en el código
- [ ] Errores de consola revisados
- [ ] Performance básica verificada
- [ ] Rollback disponible si algo falla
- [ ] Monitoreo/logs activos

**Staged rollouts:** No despliegues a todos los usuarios a la vez. Empieza con un % pequeño.

---

### skill: documentation-and-adrs

**Architecture Decision Records (ADRs):** Documenta el *por qué* de las decisiones importantes.

**Template ADR:**
```markdown
# ADR-001: [Título de la decisión]

## Estado
Aceptado / Propuesto / Deprecado

## Contexto
[¿Por qué se tomó esta decisión?]

## Decisión
[¿Qué se decidió?]

## Consecuencias
[¿Qué pasa como resultado de esta decisión?]
```

**Documenta en el momento:** El contexto se pierde rápido. Documenta mientras tienes la información fresca.

---

### skill: deprecation-and-migration

**Code as liability mindset:** El código que no usas te cuesta. Elimínalo.

**Proceso de deprecación:**
1. Marca como deprecado (warning en logs/docs)
2. Comunica el timeline
3. Migra usuarios
4. Elimina el código zombie

**Nunca elimines sin entender quién depende de eso.**

---

## 🧠 REGLAS GLOBALES (aplican siempre)

1. **Spec antes de código** — Sin spec, sin código.
2. **Tests son prueba** — "Parece correcto" no es suficiente.
3. **Commits pequeños y atómicos** — Un commit, una cosa lógica.
4. **Verificación no es opcional** — Cada skill termina con evidencia, no con suposiciones.
5. **Medir antes de optimizar** — No adivines los bottlenecks.
6. **Seguridad en el límite** — Valida inputs en la entrada del sistema.
7. **Claridad sobre astucia** — Código que el próximo leerá fácilmente.
8. **No racionalices saltarte pasos** — Las excusas comunes están documentadas arriba. Reconócelas y resiste.

---

## ⚡ COMANDOS RÁPIDOS DE REFERENCIA

```bash
# Spec nuevo proyecto
# → Sigue el template de spec-driven-development

# Feature nueva
# → spec → plan → tasks → implement (una tarea a la vez)

# Bug fix
# → debugging-and-error-recovery: reproducir → localizar → reducir → fijar → guardar

# Antes de commitear
git diff --staged && npm test && npm run lint

# Antes de deploy
# → shipping-and-launch checklist completo

# Código legacy confuso
# → code-simplification: Chesterton's Fence primero
```

---

> **Fuente:** [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — Addy Osmani (Google Chrome team)
> Inspirado en *Software Engineering at Google* y las prácticas de ingeniería de Google.
> MIT License.
