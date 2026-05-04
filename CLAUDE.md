# CLAUDE.md — Reglas Globales del Proyecto Mini Jira

> **Tech Lead:** Este archivo es la fuente de verdad para cualquier agente de IA o desarrollador que trabaje en este repositorio. Toda regla aquí es **obligatoria** salvo que se indique "recomendado".

---

## 1. Regla Máxima: Colores

> ⛔ **NUNCA inventes un color. NUNCA uses un valor hexadecimal, rgb(), hsl() ni oklch() directamente en JSX o CSS que no esté ya definido en `src/index.css`.**

Usa **exclusivamente** los tokens CSS semánticos de Tailwind que están mapeados en `src/index.css`. Si un color que necesitas no tiene token, consulta primero la tabla de abajo. Si aun así no existe, escala con el Tech Lead.

### 1.1 Tokens de diseño disponibles (mapeados desde `design.md`)

| Token Tailwind | Variable CSS | Equivalente `design.md` | Uso correcto |
|---|---|---|---|
| `bg-background` / `text-background` | `--color-background` | `background: #f9f9fb` | Fondo de página |
| `text-foreground` | `--color-foreground` | `on-surface: #1a1c1d` | Texto principal |
| `bg-card` | `--color-card` | `surface-container-lowest: #ffffff` | Fondo de tarjetas y paneles |
| `text-card-foreground` | `--color-card-foreground` | `on-surface: #1a1c1d` | Texto dentro de cards |
| `bg-primary` | `--color-primary` | `primary: #0058bc` | Botones primarios, acciones clave |
| `text-primary` | `--color-primary` | `primary: #0058bc` | Links, estado activo |
| `text-primary-foreground` | `--color-primary-foreground` | `on-primary: #ffffff` | Texto sobre fondo primario |
| `bg-secondary` | `--color-secondary` | `secondary-container: #e0dfe4` | Botones secundarios, fondo de chips neutros |
| `text-secondary-foreground` | `--color-secondary-foreground` | `on-secondary-container: #626267` | Texto en elementos secundarios |
| `bg-muted` | `--color-muted` | `surface-container-low: #f3f3f5` | Fondos de inputs, filas alternadas |
| `text-muted-foreground` | `--color-muted-foreground` | `on-surface-variant: #414755` | Texto de metadatos, labels, placeholders |
| `bg-accent` | `--color-accent` | `surface-container: #eeeef0` | Hover states, highlighting |
| `text-accent-foreground` | `--color-accent-foreground` | `on-surface: #1a1c1d` | Texto sobre accent |
| `bg-destructive` | `--color-destructive` | `error: #ba1a1a` | Fondos de alertas críticas |
| `text-destructive` | `--color-destructive` | `error: #ba1a1a` | Mensajes de error, iconos de error |
| `border-border` / `border` | `--color-border` | `outline: #717786` | Bordes de contenedores, separadores |
| `border-input` | `--color-input` | `outline-variant: #c1c6d7` | Borde de inputs en reposo |
| `ring` | `--color-ring` | `surface-tint: #005bc1` | Focus ring en elementos interactivos |
| `bg-sidebar` | `--color-sidebar` | `surface-container-lowest` (sidebar) | Fondo del sidebar |

### 1.2 Colores semánticos para chips de estado (excepción controlada)

Los chips de estado de tickets son el **único caso** donde se permiten colores de utilidad Tailwind fuera de los tokens anteriores. Usa **solo** estas clases, definidas en `src/lib/constants.ts`:

```ts
// STATUS_COLORS — no modificar sin aprobación de Tech Lead
'Por hacer':   'bg-slate-100  text-slate-700  dark:bg-slate-800  dark:text-slate-300'
'En progreso': 'bg-blue-100   text-blue-700   dark:bg-blue-900   dark:text-blue-300'
'En revisión': 'bg-amber-100  text-amber-700  dark:bg-amber-900  dark:text-amber-300'
'Listo':       'bg-green-100  text-green-700  dark:bg-green-900  dark:text-green-300'

// PRIORITY_COLORS
'Baja':  'text-slate-400'
'Media': 'text-amber-500'
'Alta':  'text-red-500'
```

> ⛔ Si necesitas agregar un color de estado nuevo, actualiza `constants.ts` y este documento. **No hardcodees la clase en el componente.**

---

## 2. Tipografía

Fuente única: **Inter** (cargada desde Google Fonts en `src/index.css`). No se usa ninguna otra fuente.

| Estilo | Clases Tailwind | Equivalente `design.md` |
|---|---|---|
| H1 | `text-[32px] font-semibold leading-tight tracking-[-0.02em]` | `h1` |
| H2 | `text-2xl font-semibold leading-snug tracking-[-0.01em]` | `h2` |
| H3 | `text-xl font-semibold leading-snug` | `h3` |
| Body base | `text-base font-normal leading-normal` | `body-base` |
| Body sm | `text-sm font-normal leading-normal` | `body-sm` |
| Label caps | `text-xs font-medium tracking-[0.05em] uppercase` | `label-caps` |
| Button | `text-sm font-medium tracking-[-0.01em]` | `button` |

> El token `font-sans` de Tailwind ya resuelve a Inter. No añadas `font-['Inter']` manualmente.

---

## 3. Espaciado y Layout

El proyecto usa una **cuadrícula base de 4px** (`spacing.base: 4px` en `design.md`). Usa siempre múltiplos de 4 vía las utilidades de Tailwind.

| `design.md` | Tailwind equivalente |
|---|---|
| `xs: 4px` | `p-1` / `gap-1` |
| `sm: 8px` | `p-2` / `gap-2` |
| `md: 16px` | `p-4` / `gap-4` |
| `lg: 24px` | `p-6` / `gap-6` |
| `xl: 32px` | `p-8` / `gap-8` |
| `2xl: 48px` | `p-12` / `gap-12` |
| `gutter: 24px` | `px-6` (layout wrapper) |
| `container-max: 1280px` | `max-w-[1280px] mx-auto` |

> ⛔ No uses valores arbitrarios de espaciado como `p-[14px]` o `mt-[22px]`. Si el diseño lo requiere, usa el múltiplo de 4 más cercano.

---

## 4. Bordes y Radios

Radios permitidos (definidos en `design.md`):

| Nombre | Valor | Tailwind |
|---|---|---|
| sm | `0.25rem` | `rounded-sm` |
| DEFAULT | `0.5rem` | `rounded` |
| md | `0.75rem` | `rounded-md` |
| lg | `1rem` | `rounded-lg` |
| xl | `1.5rem` | `rounded-xl` |
| full | `9999px` | `rounded-full` |

- **Botones, inputs, cards:** `rounded` (0.5rem)
- **Contenedores / secciones prominentes:** `rounded-lg` (1rem)
- **Chips y badges de estado:** `rounded-full`
- **Modales:** `rounded-xl`

**Bordes estándar:**
- Cards en reposo: `border border-border` (1px, sin sombra)
- Cards en hover: `border border-border shadow-sm` (sombra difusa suave)
- Inputs en reposo: `border border-input`
- Inputs en focus: `ring-2 ring-ring` (gestionado por Shadcn/ui automáticamente)

---

## 5. Elevación y Profundidad

Reglas del sistema de elevación de `design.md`:

| Contexto | Clase Tailwind |
|---|---|
| Card en reposo | `border border-border` (sin sombra) |
| Card en hover | `shadow-sm` (`0px 4px 12px rgba(0,0,0,0.05)`) |
| Modal / Sheet | `shadow-lg` + `backdrop-blur-[20px]` |
| Navbar / Topbar | `backdrop-blur-[20px] bg-background/70` |
| Superficies elevadas (dark mode) | usar `bg-card` (más claro que `bg-background`) |

> En dark mode la elevación se comunica con **tonos**, no con sombras. `bg-card` > `bg-background` en lightness. **No agregues `shadow` pesados en dark mode.**

---

## 6. Reglas de Componentes

### 6.1 Botones

```tsx
// ✅ Correcto
<Button variant="default">Acción primaria</Button>   // bg-primary
<Button variant="secondary">Acción secundaria</Button>
<Button variant="ghost">Acción terciaria</Button>
<Button variant="destructive">Eliminar</Button>      // bg-destructive

// ⛔ Incorrecto
<button className="bg-[#0058bc] text-white">...</button>   // hex hardcodeado
<button className="bg-blue-600">...</button>               // color inventado
```

- Efecto clic: `active:scale-[0.98]` (scale-down táctil)
- **Siempre** usar el componente `<Button>` de Shadcn/ui, no un `<button>` nativo con clases manuales.

### 6.2 Inputs

- Fondo: `bg-muted` (ligeramente distinto al fondo de página para definir el área de hit)
- Borde focus: gestionado por Shadcn/ui via `ring-ring`
- **Siempre** usar `<Input>` de Shadcn/ui.

### 6.3 Cards de Ticket

```tsx
// ✅ Estructura estándar de KanbanCard / TicketRow
<Card className="border border-border bg-card hover:shadow-sm transition-shadow cursor-pointer">
  ...
</Card>
```

- Sin sombra por defecto. Solo `shadow-sm` en hover.
- Usar `bg-card` como fondo, nunca `bg-white` ni `bg-background`.

### 6.4 Chips / Badges de estado

- Siempre `rounded-full`
- Fondo de baja saturación, texto de alta saturación (ver `STATUS_COLORS` en §1.2)
- Usar el componente `<Badge>` de Shadcn/ui con `className={STATUS_COLORS[status]}`

### 6.5 Modal / Dialog

- Usar `<Dialog>` de Shadcn/ui
- Efecto glassmorphism: `backdrop-blur-[20px] bg-background/70` en el overlay
- Radio: `rounded-xl`
- Max-width del contenido: `max-w-2xl` (edición/detalle de ticket)

### 6.6 Activity Feed

- Timeline vertical con línea `border-l border-border`
- Avatares circulares `rounded-full` de tamaño `size-7`
- Texto de metadatos con `text-muted-foreground text-xs`

### 6.7 Command Palette (CMD+K)

- Modal flotante con `backdrop-blur-[20px]`
- Usar `cmdk` vía `<CommandDialog>` de Shadcn/ui

---

## 7. Reglas de Negocio (Backlog v1.0)

Estas reglas deben reflejarse en **validaciones de formulario (Zod), guards de ruta y lógica de permisos** (`src/hooks/useAuth.ts`):

### HU-01 — Autenticación
- Sesión expira a las **8 horas** (campo `exp` en JWT). El campo `exp` está en segundos Unix.
- Si `exp * 1000 < Date.now()` → llamar a `logout()` + redirigir a `/login` con `?redirect=<url>`.
- Mensaje de error de login: **genérico** — no revelar si el fallo es email o contraseña.
- Dos roles: `Admin` y `User`. Matriz de permisos:

| Acción | Admin | User |
|---|:---:|:---:|
| Ver board | ✅ | ✅ |
| Crear ticket | ✅ | ✅ |
| Editar ticket (propio / asignado) | ✅ | ✅ |
| Editar ticket (ajeno) | ✅ | ⛔ |
| Archivar ticket | ✅ | ✅ (solo propio/asignado) |
| Restaurar ticket archivado | ✅ | ⛔ |
| Gestionar usuarios | ✅ | ⛔ |
| Ver dashboard de métricas | ✅ | ✅ |

### HU-02 — Ciclo de vida del ticket

| Campo | Tipo | Restricción |
|---|---|---|
| `title` | `string` | Obligatorio. Máx. **120 caracteres**. Validar en Zod y mostrar contador. |
| `description` | `string` (Markdown) | Obligatorio. Sin límite de longitud. |
| `status` | `TicketStatus` | Obligatorio. Transición libre entre los 4 estados. |
| `priority` | `TicketPriority` | Obligatorio. |
| `assignedTo` | `User \| null` | Opcional. |
| `labels` | `string[]` | Opcional. Máx. **5 etiquetas**. Validar al agregar la 6ª. |
| `createdBy` | `User` | Auto (read-only). No mostrar en formulario de creación. |
| `createdAt` | `string` | Auto (read-only). |
| `updatedAt` | `string` | Auto (read-only). |
| `version` | `number` | Auto (read-only). Siempre incluir en PATCH. |

- **Archivado = soft delete.** El ticket desaparece del board pero se contabiliza en métricas.
- Solo `Admin` puede restaurar un ticket archivado.
- El archivado incrementa `version` en +1.

### HU-03 — Locking optimista (versionado)

- Cada `PATCH /tickets/:id` **debe** incluir `{ version: N }` en el body.
- Si el backend responde `409 Conflict` → mostrar `<ConflictModal>` con el nombre del usuario que hizo el cambio conflictivo.
- **No hay merge automático.** El usuario debe recargar manualmente y rehacer sus cambios.
- Los comentarios son **inserciones independientes** (`POST /comments`). No incluyen `version`. No generan conflicto.

### EC-01 — Validaciones de formulario

Implementar en el schema Zod (`src/schemas/ticket.schema.ts`):
```ts
title: z.string().min(1, 'El título es obligatorio').max(120, 'Máximo 120 caracteres')
description: z.string().min(1, 'La descripción es obligatoria')
labels: z.array(z.string()).max(5, 'Máximo 5 etiquetas')
```

### EC-02 — Archivado concurrente

- Si el backend rechaza un PATCH sobre un ticket ya archivado → mostrar mensaje: _"Este ticket ya no está disponible. Fue archivado por otro usuario."_
- Si el backend rechaza con 409 (versión desactualizada) → mostrar `<ConflictModal>` estándar.
- Un ticket archivado **no puede recibir nuevos comentarios**. El `<CommentSection>` debe estar deshabilitado cuando `ticket.isArchived === true`.

---

## 8. Arquitectura y Estructura de Código

### 8.1 Estructura de carpetas

```
src/
├── api/           # Módulos de Axios (uno por recurso)
├── components/
│   ├── ui/        # Solo componentes de Shadcn/ui (NO tocar)
│   ├── layout/    # AppLayout, Sidebar, Topbar
│   ├── board/     # FilterBar, KanbanView/, ListView/, TicketBoard
│   ├── ticket/    # TicketModal, TicketForm, TicketDetail, badges
│   ├── comments/  # CommentSection, CommentItem, MentionInput
│   ├── activity/  # ActivityFeed
│   ├── command-palette/
│   └── theme/     # ThemeProvider, ThemeToggle
├── hooks/         # useAuth, useTheme (lógica reutilizable)
├── lib/           # constants.ts, utils.ts (cn helper)
├── mocks/         # mockAuth.ts — solo activo si VITE_MOCK_AUTH=true
├── queries/       # TanStack Query hooks (useTicketsQuery, etc.)
├── routes/        # TanStack Router (file-based)
├── schemas/       # Zod schemas por dominio
├── stores/        # Zustand stores (authStore, boardStore, uiStore)
└── types/         # TypeScript interfaces y tipos
```

### 8.2 Reglas de código

- **Sin `any`** en TypeScript. Usar `unknown` + type guard si el tipo es incierto.
- **Sin `useEffect` para server state.** Toda petición HTTP va por TanStack Query.
- **Sin `fetch` directo.** Todo HTTP pasa por `src/api/client.ts` (instancia Axios con interceptor JWT).
- **`cn()` obligatorio** para concatenar clases Tailwind condicionales (importar desde `@/lib/utils`).
- **Zustand para estado global UI** (modales, filtros del board, theme). No uses Context para esto.
- **TanStack Query para estado de servidor.** `staleTime: 30s`, `gcTime: 5min`, sin retry en 4xx.
- Los **`queryKeys`** se definen en el propio hook de query (ej: `ticketKeys` en `useTicketsQuery.ts`). Usar el key factory para todas las invalidaciones.
- **`boardStore.setFilters()`** siempre resetea `page` a 1.

### 8.3 Permisos — usar `useAuth` hook

```ts
// src/hooks/useAuth.ts
const { isAdmin, isOwner, canEdit, canArchive } = useAuth(ticket)

// ✅ Correcto — delegar al hook
{canEdit && <Button>Editar</Button>}

// ⛔ Incorrecto — lógica de permisos en el componente
{user.role === 'Admin' || ticket.createdBy.id === user.id ? <Button>Editar</Button> : null}
```

### 8.4 Rutas protegidas

- Toda ruta bajo `_app.tsx` requiere `isAuthenticated`. Guard en `beforeLoad`.
- Redirigir a `/login?redirect=<url>` para recuperar la navegación original tras login.
- `initFromStorage()` se llama en `__root.tsx` `beforeLoad` (una sola vez).

---

## 9. Modo Mock (desarrollo sin backend)

Controlado por `VITE_MOCK_AUTH=true` en `.env`.

- Cuando está activo, `authApi.login()` usa `mockLogin()` de `src/mocks/mockAuth.ts`.
- Las llamadas a otros endpoints (`/tickets`, `/users`, etc.) seguirán fallando hasta que el backend esté disponible.
- **Para desactivar:** cambiar a `VITE_MOCK_AUTH=false` en `.env` y recargar el servidor.
- **No commitear** `.env` con datos sensibles. Usar `.env.example` como referencia.

---

## 10. Lo que NUNCA debes hacer

| ⛔ Prohibido | ✅ Alternativa |
|---|---|
| Hexadecimales en JSX/CSS (`#0058bc`, `#fff`) | Token Tailwind (`bg-primary`, `text-foreground`) |
| Colores Tailwind arbitrarios (`bg-blue-600`) | Tokens semánticos o `STATUS_COLORS` de constants.ts |
| `style={{ color: '...' }}` inline para color | Clase Tailwind con token del sistema |
| `<button>` nativo con clases manuales | `<Button>` de Shadcn/ui |
| `bg-white` o `bg-black` directos | `bg-card` / `bg-background` / `text-foreground` |
| `useEffect` para fetching | `useQuery` / `useMutation` de TanStack Query |
| `fetch()` directo | `apiClient` (Axios) de `src/api/client.ts` |
| Lógica de permisos en componentes | Hook `useAuth()` |
| Modificar archivos en `src/components/ui/` | Usar los componentes Shadcn/ui tal como están |
| Crear colores de estado hardcodeados | Actualizar `STATUS_COLORS` en `constants.ts` |
| Valores de espaciado arbitrarios (`p-[14px]`) | Múltiplo de 4 via utilidades Tailwind (`p-3`, `p-4`) |

---

*Documento generado por Tech Lead · Mini Jira v1.0 · 03 de Mayo 2026*  
*Fuente: `design.md` + `backlog.md` + `frontend-specs.md` + `src/index.css`*
