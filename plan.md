# Plan: Construcción del Home (Board Page) — Mini Jira v1.0

## Estado actual del código

La mayoría de los componentes **ya existen como esqueletos funcionales**. El objetivo de este plan es construirlos/pulirlos fase a fase para que coincidan fielmente con el prototipo (`screen.png`) y los tokens de `design.md`/`CLAUDE.md`. Cada fase es validable de forma independiente.

**Árbol de dependencias del Home:**

```
AppLayout (shell)
├── Sidebar                          ← sin dependencias de dominio
├── Topbar                           ← depende de: useAuth, uiStore
└── <main> contenido
    └── BoardPage (route /board)
        ├── PageHeader               ← título + botón "Nuevo ticket"
        └── TicketBoard
            ├── FilterBar            ← depende de: boardStore, queries (users)
            │   └── SearchInput
            ├── ViewToggle           ← depende de: boardStore
            └── KanbanBoard          ← depende de: queries (tickets)
                └── KanbanColumn (×4)
                    └── KanbanCard
```

---

## Fases

---

### FASE 1 — Tokens & Hoja de estilos base
**Archivos:** `src/index.css`  
**Estado actual:** ✅ Existe — revisar que todos los tokens estén correctos  

**Qué hacer:**
- Verificar que `--color-sidebar` esté correctamente mapeado a `surface-container-lowest`.
- Asegurar que el `body` use `antialiased` y la fuente `Inter` con `font-sans`.
- No hay componentes visuales en esta fase — es puro CSS.

**Tokens aplicados:**
| CSS Variable | Valor oklch | `design.md` equiv. |
|---|---|---|
| `--color-background` | oklch(98.6% ...) | `background: #f9f9fb` |
| `--color-foreground` | oklch(17% ...) | `on-surface: #1a1c1d` |
| `--color-card` | oklch(100% 0 0) | `surface-container-lowest: #ffffff` |
| `--color-muted` | oklch(96% ...) | `surface-container-low: #f3f3f5` |
| `--color-sidebar` | oklch(97% ...) | `surface-container-lowest` |
| `--color-border` | oklch(91% ...) | `outline-variant: #c1c6d7` |
| `--color-primary` | oklch(41% 0.16 ...) | `primary: #0058bc` |

**Tipografía base:** `font-sans` → Inter, `antialiased`

**Criterio de validación:** El `body` renderiza con fondo `#f9f9fb`, texto `#1a1c1d`, fuente Inter.

---

### FASE 2 — AppLayout: Shell (estructura del Home)
**Archivos:** `src/components/layout/AppLayout.tsx`  
**Estado actual:** ✅ Existe — necesita ajuste menor de layout  

**Qué hacer:**
- Confirmar que `<main>` tenga `ml-56 mt-14` (offset de sidebar y topbar).
- Aplicar `px-6 py-6` (gutter de 24px según spacing.gutter).
- Limitar ancho máximo con `max-w-[1280px]` centrado.
- Integrar `<Toaster>` y `<CommandPalette>`.

**Tokens aplicados:**
| Uso | Token |
|---|---|
| Fondo página | `bg-background` |
| Padding lateral | `px-6` (gutter: 24px) |
| Max-width | `max-w-[1280px]` |

**Tipografía:** ninguna en este nivel.

**Criterio de validación:** La página se divide correctamente en sidebar izquierdo fijo, topbar superior fijo, y área de contenido que no se solapa.

---

### FASE 3 — Sidebar: Navegación fija izquierda
**Archivos:** `src/components/layout/Sidebar.tsx`  
**Estado actual:** ✅ Existe — revisar tokens activos y hover states  

**Qué hacer:**
- Header del sidebar: ancho `w-56`, altura `h-14`, borde inferior `border-b border-border`.
  - Logo/marca: texto `"Mini Jira"` con `font-semibold text-foreground tracking-tight`.
- Nav items (activo): `bg-primary/10 text-primary` — fondo azul translúcido, texto azul.
- Nav items (inactivo): `text-muted-foreground hover:bg-accent hover:text-accent-foreground`.
- Solo mostrar items `adminOnly` si `isAdmin()`.
- Fondo sidebar: `bg-sidebar border-r border-border`.

**Tokens aplicados:**
| Elemento | Token |
|---|---|
| Fondo | `bg-sidebar` |
| Borde derecho | `border-r border-border` |
| Texto marca | `text-foreground font-semibold` |
| Nav activo fondo | `bg-primary/10` |
| Nav activo texto | `text-primary` |
| Nav hover fondo | `bg-accent` |
| Nav inactivo texto | `text-muted-foreground` |

**Tipografía:**
| Elemento | Clases |
|---|---|
| Marca "Mini Jira" | `text-sm font-semibold tracking-tight` → button |
| Nav label | `text-sm font-medium` → button |

**Criterio de validación:** La ruta `/board` activa el item "Board" con fondo azul translúcido y texto azul.

---

### FASE 4 — Topbar: Barra superior (Header)
**Archivos:** `src/components/layout/Topbar.tsx`  
**Estado actual:** ✅ Existe — revisar glassmorphism y estructura  

**Qué hacer:**
- Posición: `fixed top-0 left-56 right-0 h-14 z-20`.
- Efecto glass: `bg-background/70 backdrop-blur-xl border-b border-border`.
- Izquierda: botón "Buscar..." (`<Button variant="outline">`) que abre CommandPalette.
  - Ancho `w-64`, altura `h-8`, icono `<Search>`, atajo `⌘K`.
- Derecha: `<ThemeToggle>` + Avatar con `<DropdownMenu>` para logout.

**Tokens aplicados:**
| Elemento | Token |
|---|---|
| Fondo glass | `bg-background/70 backdrop-blur-xl` |
| Borde inferior | `border-b border-border` |
| Botón buscar | `variant="outline"` → `border-input` |
| Texto placeholder | `text-muted-foreground` |
| Avatar fallback | `text-foreground` (iniciales) |
| Logout item | `text-destructive` |

**Tipografía:**
| Elemento | Clases |
|---|---|
| Placeholder buscar | `text-sm` → body-sm |
| Usuario nombre | `text-sm font-medium` |
| Usuario email | `text-xs text-muted-foreground` |
| Atajo kbd | `text-xs opacity-50` |

**Criterio de validación:** El header se ve semi-transparente sobre el contenido al hacer scroll. El dropdown de usuario muestra nombre, email y opción de cerrar sesión.

---

### FASE 5 — PageHeader: Cabecera de la página Board
**Archivos:** `src/routes/_app/board.tsx`  
**Estado actual:** ✅ Existe — verificar tipografía H1/H2 y botón CTA  

**Qué hacer:**
- Título `"Board"`: clase `text-2xl font-semibold tracking-tight` (H2 del sistema).
- Subtítulo `"Gestión de tickets del equipo"`: `text-sm text-muted-foreground`.
- Botón "Nuevo ticket": `<Button>` (variant default → `bg-primary text-primary-foreground`).
  - Icono `<Plus>` a la izquierda.
  - Al hacer clic: `openTicketModal('create')`.
- Layout: `flex items-center justify-between`.

**Tokens aplicados:**
| Elemento | Token |
|---|---|
| Título | `text-foreground` |
| Subtítulo | `text-muted-foreground` |
| Botón CTA fondo | `bg-primary` |
| Botón CTA texto | `text-primary-foreground` |

**Tipografía:**
| Elemento | Clases |
|---|---|
| Título Board | `text-2xl font-semibold tracking-tight` → H2 |
| Subtítulo | `text-sm font-normal` → body-sm |
| Botón | `text-sm font-medium tracking-[-0.01em]` → button |

**Criterio de validación:** El header de página muestra "Board" en H2 semibold y el botón azul "Nuevo ticket" alineado a la derecha.

---

### FASE 6 — SearchInput: Campo de búsqueda inline
**Archivos:** `src/components/board/SearchInput.tsx`  
**Estado actual:** ⚠️ Existe — verificar estilos y debounce  

**Qué hacer:**
- Usar `<Input>` de Shadcn/ui con icono `<Search>` a la izquierda.
- Fondo `bg-muted` para distinguir del fondo de página.
- Borde en reposo `border-input`, focus `ring-2 ring-ring`.
- Debounce de 300ms (`SEARCH_DEBOUNCE_MS`).
- Ancho `w-64`.

**Tokens aplicados:**
| Elemento | Token |
|---|---|
| Fondo input | `bg-muted` |
| Borde reposo | `border-input` |
| Focus ring | `ring-ring` |
| Icono | `text-muted-foreground` |

**Tipografía:** `text-sm` → body-sm

**Criterio de validación:** Al escribir en el campo, los tickets se filtran con 300ms de delay. El campo se diferencia visualmente del fondo.

---

### FASE 7 — FilterBar + ViewToggle: Barra de controles
**Archivos:** `src/components/board/FilterBar.tsx`, `src/components/board/ViewToggle.tsx`  
**Estado actual:** ✅ Existe — revisar alineación y tamaños  

**Qué hacer (FilterBar):**
- Contenedor: `flex flex-wrap items-center gap-2`.
- Botones de filtro (`MultiSelectFilter`): `<Button variant="outline" size="sm" h-9>`.
- Badge contador activo: `<Badge variant="secondary" className="rounded-full">`.
- Separador + botón "Limpiar filtros" visible solo si `hasActiveFilters`.

**Qué hacer (ViewToggle):**
- Toggle Kanban/Lista como grupo de botones con borde compartido.
- Estado activo: `bg-muted` (fondo ligeramente más oscuro).

**Tokens aplicados:**
| Elemento | Token |
|---|---|
| Botones filtro | `border-input` (outline variant) |
| Badge contador | `bg-secondary text-secondary-foreground` |
| Botón limpiar | `text-muted-foreground` (ghost) |
| Toggle activo | `bg-muted` |

**Tipografía:** `text-sm font-medium` → button

**Criterio de validación:** Los filtros de estado, prioridad y asignado aparecen en fila. Al seleccionar un filtro, aparece el badge contador. El toggle cambia entre vistas.

---

### FASE 8 — Átomos de ticket: StatusBadge + PriorityIndicator
**Archivos:** `src/components/ticket/StatusBadge.tsx`, `src/components/ticket/PriorityIndicator.tsx`  
**Estado actual:** ✅ Existe — verificar uso de `STATUS_COLORS` y `PRIORITY_COLORS`  

**Qué hacer (StatusBadge):**
- Usar `<Badge>` de Shadcn/ui.
- `className={cn('rounded-full', STATUS_COLORS[status])}`.
- No hardcodear ningún color — solo leer de `constants.ts`.

**Qué hacer (PriorityIndicator):**
- Icono (`ArrowUp`/`Minus`/`ArrowDown`) + label opcional.
- `className={PRIORITY_COLORS[priority]}`.
- Prop `showLabel?: boolean`.

**Tokens aplicados (vía constants.ts):**
| Status | Clases |
|---|---|
| Por hacer | `bg-slate-100 text-slate-700` |
| En progreso | `bg-blue-100 text-blue-700` |
| En revisión | `bg-amber-100 text-amber-700` |
| Listo | `bg-green-100 text-green-700` |

**Tipografía:** `text-xs font-medium` (badge)

**Criterio de validación:** Los 4 estados del sistema renderizan con el color correcto. En dark mode las variantes `dark:` se aplican automáticamente.

---

### FASE 9 — KanbanCard: Tarjeta de ticket
**Archivos:** `src/components/board/KanbanView/KanbanCard.tsx`  
**Estado actual:** ⚠️ Existe — usa `<button>` nativo (excepción válida por accesibilidad de card)  

**Qué hacer:**
- Fondo: `bg-card` (nunca `bg-white`).
- Borde: `border border-border` en reposo → `hover:shadow-sm hover:border-primary/30` en hover.
- Radio: `rounded-lg` (1rem).
- Padding: `px-3 py-3` (p-3 = 12px, próximo a md=16px).
- Estructura interna:
  1. Título: `text-sm font-medium text-foreground line-clamp-2`.
  2. Fila de chips: `<PriorityIndicator>` + labels con icono `<Tag>`.
  3. Footer: fecha creación (`text-xs text-muted-foreground`) + `<Avatar>` del asignado.
- Transición: `transition-all duration-150`.
- Focus: `focus-visible:ring-2 focus-visible:ring-ring`.

**Tokens aplicados:**
| Elemento | Token |
|---|---|
| Fondo | `bg-card` |
| Borde reposo | `border-border` |
| Borde hover | `border-primary/30` |
| Sombra hover | `shadow-sm` |
| Título | `text-foreground` |
| Metadata | `text-muted-foreground` |
| Focus ring | `ring-ring` |

**Tipografía:**
| Elemento | Clases |
|---|---|
| Título ticket | `text-sm font-medium leading-snug` → body-sm medium |
| Labels | `text-xs` → label-caps |
| Fecha | `text-xs text-muted-foreground` |

**Criterio de validación:** Al pasar el cursor sobre una card, aparece sombra suave y el borde cambia a azul translúcido. La card muestra título, prioridad, labels y avatar del asignado.

---

### FASE 10 — KanbanColumn: Columna de estado
**Archivos:** `src/components/board/KanbanView/KanbanColumn.tsx`  
**Estado actual:** ✅ Existe — revisar fondo, header y scroll  

**Qué hacer:**
- Contenedor: `min-w-[280px] max-w-[280px] rounded-lg bg-muted/40 border border-border`.
- Header columna: `flex items-center justify-between px-3 py-2.5 border-b border-border`.
  - `<StatusBadge>` del estado.
  - Contador: `<span>` con `text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5`.
- Contenido: `<ScrollArea>` con `max-h-[calc(100vh-220px)]`.
- Padding interno: `p-2 space-y-2`.
- Estado loading: 3 skeletons `h-24 rounded-lg bg-muted animate-pulse`.
- Estado vacío: texto centrado `text-xs text-muted-foreground`.

**Tokens aplicados:**
| Elemento | Token |
|---|---|
| Fondo columna | `bg-muted/40` |
| Borde | `border-border` |
| Header borde inferior | `border-b border-border` |
| Contador fondo | `bg-muted` |
| Contador texto | `text-muted-foreground` |
| Skeleton | `bg-muted animate-pulse` |

**Tipografía:**
| Elemento | Clases |
|---|---|
| Contador | `text-xs font-medium` |
| Vacío | `text-xs text-muted-foreground` |

**Criterio de validación:** Las 4 columnas (Por hacer / En progreso / En revisión / Listo) se muestran en fila con scroll independiente. El skeleton aparece mientras cargan los datos.

---

### FASE 11 — KanbanBoard: Contenedor de columnas
**Archivos:** `src/components/board/KanbanView/KanbanBoard.tsx`  
**Estado actual:** ✅ Existe — verificar scroll horizontal  

**Qué hacer:**
- Contenedor: `flex gap-4 overflow-x-auto pb-4`.
- Cada columna carga su query independiente (`KanbanColumnLoader`).
- Aplicar filtros del `boardStore` a cada query (excepto `status` que viene fijo por columna).

**Tokens aplicados:** Solo spacing (`gap-4`, `pb-4`).

**Criterio de validación:** Las 4 columnas aparecen en fila horizontal con scroll si el viewport es menor. Cada columna carga sus tickets de forma independiente.

---

### FASE 12 — TicketBoard: Orquestador final
**Archivos:** `src/components/board/TicketBoard.tsx`  
**Estado actual:** ✅ Existe — verificar integración de todos los subcomponentes  

**Qué hacer:**
- Contenedor: `space-y-4`.
- Fila superior: `flex items-start justify-between gap-4 flex-wrap` con `<FilterBar>` + `<ViewToggle>`.
- Cuerpo: renderiza `<KanbanBoard>` o `<TicketTable>` según `boardStore.view`.
- `<TicketModal>` montado al final (controlado por `uiStore`).

**Tokens aplicados:** Solo spacing (`space-y-4`, `gap-4`).

**Criterio de validación:** Cambiar el toggle muestra/oculta la vista Kanban y Lista. Los filtros afectan ambas vistas en tiempo real.

---

## Resumen de dependencias entre fases

```
FASE 1 (tokens)
  └─ FASE 2 (AppLayout)
       ├─ FASE 3 (Sidebar)
       └─ FASE 4 (Topbar)
            └─ FASE 5 (PageHeader)
                 └─ FASE 6 (SearchInput)
                      └─ FASE 7 (FilterBar + ViewToggle)
                           └─ FASE 8 (StatusBadge + PriorityIndicator)  ←─┐
                                └─ FASE 9 (KanbanCard)  ─────────────────────┘
                                     └─ FASE 10 (KanbanColumn)
                                          └─ FASE 11 (KanbanBoard)
                                               └─ FASE 12 (TicketBoard) ← Home completo
```

---

## Notas técnicas

- **`cn()` obligatorio** para concatenar clases condicionales.
- **Nunca** `bg-white`, `bg-black`, ni hex directos — solo tokens semánticos.
- **`STATUS_COLORS`** en `constants.ts` es la única fuente de colores de estado.
- Las fases 1–4 son el **layout shell** (sin lógica de negocio).
- Las fases 5–7 son el **área de controles** (filtros, búsqueda, vistas).
- Las fases 8–12 son el **área de contenido Kanban** (átomos → moléculas → organismos).
