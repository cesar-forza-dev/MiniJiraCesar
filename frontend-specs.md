# Frontend Specification — Mini Jira v1.0

> **Proyecto:** Mini Jira v1.0  
> **Repositorio:** `Clasefront` (SPA independiente)  
> **Fuente:** PRD v1.0 + backlog.md + DESIGN.md + marmaid.desing.md + init_db.sql  
> **Fecha:** 02 de Mayo 2026  
> **Estado:** BORRADOR — pendiente confirmación

---

## 1. Stack y Versiones

| Capa | Tecnología | Versión |
|---|---|---|
| Lenguaje | TypeScript | 5.7+ |
| UI Library | React | 19.x |
| Build Tool | Vite | 6.x |
| CSS Framework | Tailwind CSS | 4.x |
| Design System | Shadcn/ui (estilo: `default`) | latest (compatible con Tailwind v4) |
| Routing | TanStack Router | 1.x |
| Server State | TanStack Query (React Query) | 5.x |
| Client State | Zustand | 5.x |
| Formularios | React Hook Form | 7.x |
| Validación | Zod | 3.x |
| Editor Markdown | @uiw/react-md-editor | 4.x |
| Charts | Tremor | 3.x |
| Command Palette | cmdk | 1.x |
| Iconos | Lucide React | latest (incluido en Shadcn/ui) |
| HTTP Client | Axios | 1.x |
| Package Manager | npm | 10.x |

---

## 2. Dependencias `package.json`

### Producción

```
react@19
react-dom@19
@tanstack/react-router@1
@tanstack/react-query@5
@tanstack/react-query-devtools@5
zustand@5
react-hook-form@7
zod@3
@hookform/resolvers@3
axios@1
@uiw/react-md-editor@4
tremor@3
cmdk@1
lucide-react
class-variance-authority
clsx
tailwind-merge
```

### Desarrollo

```
typescript@5
vite@6
@vitejs/plugin-react@4
tailwindcss@4
@tailwindcss/vite
@types/react@19
@types/react-dom@19
@tanstack/router-devtools
eslint@9
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
prettier
```

---

## 3. Variables de Entorno

Archivo `.env` (raíz del proyecto):

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Mini Jira
```

---

## 4. Estructura de Carpetas

```
Clasefront/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                  # Entry point — ThemeProvider + QueryClient + Router
│   ├── routeTree.gen.ts          # Generado por TanStack Router CLI
│   │
│   ├── routes/                   # Rutas de TanStack Router (file-based)
│   │   ├── __root.tsx            # Root layout (AppLayout | AuthLayout)
│   │   ├── _auth/
│   │   │   └── login.tsx         # Página de login (pública)
│   │   └── _app/
│   │       ├── _layout.tsx       # AppLayout: sidebar + topbar
│   │       ├── board.tsx         # Board principal (Kanban + Lista)
│   │       ├── dashboard.tsx     # Dashboard de métricas
│   │       ├── users.tsx         # Gestión de usuarios (Admin only)
│   │       └── archived.tsx      # Tickets archivados (Admin only)
│   │
│   ├── components/
│   │   ├── ui/                   # Componentes Shadcn/ui (generados — NO editar manualmente)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── command.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── sonner.tsx        # Toast notifications (Sonner via Shadcn)
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx     # Shell: sidebar + topbar + <Outlet />
│   │   │   ├── AuthLayout.tsx    # Shell centrado para login
│   │   │   ├── Sidebar.tsx       # Navegación fija izquierda
│   │   │   └── Topbar.tsx        # Barra superior con ThemeToggle y UserMenu
│   │   │
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx # Context global { theme, setTheme }
│   │   │   └── ThemeToggle.tsx   # Botón Sun/Moon/Monitor en Topbar
│   │   │
│   │   ├── command-palette/
│   │   │   └── CommandPalette.tsx # Modal CMD+K con cmdk
│   │   │
│   │   ├── board/
│   │   │   ├── TicketBoard.tsx   # Contenedor principal (toggle Kanban/Lista)
│   │   │   ├── ViewToggle.tsx    # Botón Kanban | Lista
│   │   │   ├── FilterBar.tsx     # Filtros multi-select + búsqueda de texto
│   │   │   ├── SearchInput.tsx   # Input de búsqueda sobre título y descripción
│   │   │   ├── KanbanView/
│   │   │   │   ├── KanbanBoard.tsx    # Contenedor de columnas
│   │   │   │   ├── KanbanColumn.tsx   # Columna por estado (con scroll)
│   │   │   │   └── KanbanCard.tsx     # Tarjeta de ticket en Kanban
│   │   │   └── ListView/
│   │   │       ├── TicketTable.tsx    # Tabla de tickets
│   │   │       ├── TicketRow.tsx      # Fila de ticket en tabla
│   │   │       └── Pagination.tsx     # Paginación clásica
│   │   │
│   │   ├── ticket/
│   │   │   ├── TicketModal.tsx        # Modal: create | edit | view
│   │   │   ├── TicketForm.tsx         # Formulario (React Hook Form + Zod)
│   │   │   ├── TicketDetail.tsx       # Vista read-only del ticket
│   │   │   ├── StatusBadge.tsx        # Badge coloreado según estado
│   │   │   ├── PriorityIndicator.tsx  # Icono de prioridad
│   │   │   ├── LabelInput.tsx         # Chips editables (máx. 5 etiquetas)
│   │   │   ├── AssigneeSelect.tsx     # Selector de usuario asignado
│   │   │   ├── MarkdownEditor.tsx     # Wrapper de @uiw/react-md-editor
│   │   │   ├── ConflictModal.tsx      # Modal de conflicto de versión (locking optimista)
│   │   │   └── ArchiveConfirmDialog.tsx # Dialog de confirmación de archivado
│   │   │
│   │   ├── comments/
│   │   │   ├── CommentSection.tsx     # Lista de comentarios + formulario
│   │   │   ├── CommentItem.tsx        # Comentario individual (inmutable)
│   │   │   └── MentionInput.tsx       # Textarea con autocomplete @usuario
│   │   │
│   │   ├── activity/
│   │   │   └── ActivityFeed.tsx       # Timeline vertical de comentarios en ticket
│   │   │
│   │   ├── dashboard/
│   │   │   ├── MetricsCard.tsx        # Card numérica (Tremor)
│   │   │   ├── TicketsClosedChart.tsx # BarChart: tickets cerrados por mes (Tremor)
│   │   │   ├── StatusSnapshot.tsx     # DonutChart: tickets por estado (Tremor)
│   │   │   └── TeamMetrics.tsx        # Tabla: creados vs. cerrados por miembro
│   │   │
│   │   └── users/
│   │       ├── UserTable.tsx          # Tabla de usuarios (Admin only)
│   │       ├── UserModal.tsx          # Crear / editar usuario (Admin only)
│   │       └── UserForm.tsx           # Formulario de usuario
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                 # Accede al authStore; helper para isAdmin, isOwner, etc.
│   │   ├── useTheme.ts                # Accede al ThemeProvider context
│   │   └── useCommandPalette.ts       # Abre/cierra el CommandPalette (Zustand)
│   │
│   ├── stores/
│   │   ├── authStore.ts               # Zustand: { user, token, login, logout }
│   │   ├── uiStore.ts                 # Zustand: { commandPaletteOpen, activeModal, ... }
│   │   └── boardStore.ts              # Zustand: { view, filters, page, searchText }
│   │
│   ├── api/
│   │   ├── client.ts                  # Instancia Axios con interceptor JWT + manejo 401
│   │   ├── auth.api.ts                # POST /auth/login, POST /auth/logout
│   │   ├── tickets.api.ts             # CRUD /tickets, archive, restore
│   │   ├── comments.api.ts            # GET/POST /tickets/:id/comments
│   │   ├── users.api.ts               # CRUD /users (Admin)
│   │   └── metrics.api.ts             # GET /metrics/dashboard
│   │
│   ├── queries/                       # TanStack Query hooks
│   │   ├── useTicketsQuery.ts
│   │   ├── useTicketQuery.ts
│   │   ├── useTicketMutations.ts      # create, update, archive, restore
│   │   ├── useCommentsQuery.ts
│   │   ├── useCommentMutation.ts
│   │   ├── useUsersQuery.ts
│   │   ├── useUserMutations.ts
│   │   └── useMetricsQuery.ts
│   │
│   ├── schemas/                       # Zod schemas para validación de formularios
│   │   ├── ticket.schema.ts
│   │   ├── comment.schema.ts
│   │   ├── auth.schema.ts
│   │   └── user.schema.ts
│   │
│   ├── types/                         # Interfaces TypeScript del dominio
│   │   ├── ticket.types.ts
│   │   ├── user.types.ts
│   │   ├── comment.types.ts
│   │   └── metrics.types.ts
│   │
│   ├── lib/
│   │   ├── utils.ts                   # cn() helper (clsx + tailwind-merge)
│   │   ├── constants.ts               # TICKET_STATES, PRIORITIES, ROLES, etc.
│   │   └── theme.ts                   # Script inline bloqueante anti-FOUC (inyectado en index.html)
│   │
│   └── styles/
│       └── globals.css                # @import "tailwindcss"; tokens CSS Shadcn/ui (light + dark)
│
├── index.html                         # Script anti-FOUC antes del bundle JS
├── vite.config.ts
├── tailwind.config.ts                 # darkMode: 'class'
├── tsconfig.json
├── tsconfig.app.json
├── .eslintrc.cjs
├── .prettierrc
└── .env
```

---

## 5. Modelo de Datos (TypeScript)

### 5.1 Enumeraciones

```typescript
// src/types/ticket.types.ts

export type TicketStatus =
  | 'Por hacer'
  | 'En progreso'
  | 'En revisión'
  | 'Listo';

export type TicketPriority = 'Baja' | 'Media' | 'Alta';

export type UserRole = 'Admin' | 'User';

export type AppTheme = 'light' | 'dark' | 'system';
```

### 5.2 Usuarios

```typescript
export interface User {
  id: string;           // UUID
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;    // ISO 8601
  updatedAt: string;
}

// Payload del JWT decodificado (almacenado en authStore)
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  exp: number;          // Unix timestamp
}
```

### 5.3 Tickets

```typescript
export interface Ticket {
  id: string;             // UUID
  title: string;          // máx. 120 chars
  description: string;    // Markdown
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: User | null;
  createdBy: User;
  labels: string[];       // máx. 5 elementos
  version: number;        // locking optimista — se envía al guardar
  archived: boolean;
  archivedAt: string | null;
  archivedBy: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketSummary {  // Para tarjetas en el board (sin descripción completa)
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: Pick<User, 'id' | 'username'> | null;
  labels: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

### 5.4 Comentarios

```typescript
export interface Comment {
  id: string;
  ticketId: string;
  author: Pick<User, 'id' | 'username'>;
  content: string;    // texto con menciones @username
  createdAt: string;  // inmutable — no updatedAt
}
```

### 5.5 Dashboard de Métricas

```typescript
export interface DashboardMetrics {
  ticketsClosedByMonth: MonthlyCount[];   // últimos 6 meses
  ticketsByStatus: StatusCount[];          // snapshot actual
  teamMetrics: TeamMemberMetrics[];
}

export interface MonthlyCount {
  month: string;    // 'YYYY-MM'
  count: number;
}

export interface StatusCount {
  status: TicketStatus;
  count: number;
}

export interface TeamMemberMetrics {
  user: Pick<User, 'id' | 'username'>;
  created: number;
  closed: number;
}
```

### 5.6 Payloads de API

```typescript
export interface LoginPayload   { email: string; password: string; }
export interface LoginResponse  { token: string; user: AuthUser; }

export interface CreateTicketPayload {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedToId?: string;
  labels?: string[];
}

export interface UpdateTicketPayload extends Partial<CreateTicketPayload> {
  version: number;    // OBLIGATORIO — locking optimista
}

export interface CreateCommentPayload {
  content: string;    // menciones @username en texto plano
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  assignedToId?: string[];
  labels?: string[];
  createdFrom?: string;   // ISO 8601
  createdTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
```

---

## 6. Rutas de la Aplicación (TanStack Router)

| Ruta | Componente | Acceso | Descripción |
|---|---|---|---|
| `/login` | `LoginPage` | Público | Formulario login; redirige a `/board` si hay sesión activa |
| `/board` | `BoardPage` | Todos | Board principal (Kanban + Lista con toggle) |
| `/dashboard` | `DashboardPage` | Todos | Métricas históricas |
| `/users` | `UsersPage` | Admin | Gestión de usuarios |
| `/archived` | `ArchivedPage` | Admin | Tickets archivados con opción de restaurar |

### Guards de Ruta
- **`requireAuth`**: redirige a `/login` (guardando la URL de origen en el state del router) si no hay token válido.
- **`requireAdmin`**: redirige a `/board` si el usuario no tiene rol `Admin`.

---

## 7. Gestión de Estado

### 7.1 `authStore` (Zustand)

```typescript
interface AuthStore {
  user: AuthUser | null;
  token: string | null;           // JWT en memoria; persiste en localStorage('minijira-token')
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}
```

**Comportamiento:**
- Al inicializar: lee `localStorage['minijira-token']`, decodifica el JWT y valida que `exp > Date.now()`. Si expiró, llama `logout()`.
- `logout()`: elimina `localStorage['minijira-token']`, resetea el store y redirige a `/login`.

### 7.2 `boardStore` (Zustand)

```typescript
interface BoardStore {
  view: 'kanban' | 'list';
  filters: TicketFilters;
  setView: (view: 'kanban' | 'list') => void;
  setFilters: (filters: Partial<TicketFilters>) => void;
  resetFilters: () => void;
}
```

**Comportamiento:** los filtros se mantienen mientras el usuario navega dentro de la sesión. No se persisten en `localStorage` (v1).

### 7.3 `uiStore` (Zustand)

```typescript
interface UIStore {
  commandPaletteOpen: boolean;
  ticketModalOpen: boolean;
  ticketModalMode: 'create' | 'edit' | 'view';
  selectedTicketId: string | null;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openTicketModal: (mode: 'create' | 'edit' | 'view', ticketId?: string) => void;
  closeTicketModal: () => void;
}
```

### 7.4 TanStack Query — Claves de Cache

| Query Key | Descripción |
|---|---|
| `['tickets', filters]` | Lista paginada del board |
| `['ticket', id]` | Detalle de un ticket |
| `['tickets', id, 'comments']` | Comentarios de un ticket |
| `['users']` | Lista de usuarios (admin) |
| `['users', 'active']` | Usuarios activos (para selects) |
| `['metrics', 'dashboard']` | Datos del dashboard |

**Configuración global:**
- `staleTime`: 30 segundos
- `gcTime`: 5 minutos
- `retry`: 1 (no reintentar en errores 4xx)

---

## 8. Interceptor HTTP (Axios)

**`src/api/client.ts`**

| Situación | Comportamiento |
|---|---|
| Request | Adjunta `Authorization: Bearer <token>` si existe token en authStore |
| Response 401 | Llama `authStore.logout()` → redirige a `/login` |
| Response 409 | Propaga el error; el componente abre `ConflictModal` |
| Response 422/400 | Propaga el error; React Hook Form muestra errores inline |
| Response 5xx | Propaga el error; se muestra mensaje genérico en toast (Sonner) |

---

## 9. Design System — Tokens

### 9.1 Colores (definidos en `globals.css`)

Los tokens siguen el formato Shadcn/ui sobre variables CSS:

```css
/* Light mode — :root */
--background: 0 0% 98%;              /* #f9f9fb */
--foreground: 210 6% 11%;            /* #1a1c1d */
--primary: 217 100% 37%;             /* #0058bc */
--primary-foreground: 0 0% 100%;
--secondary: 240 2% 38%;             /* #5d5e63 */
--destructive: 0 72% 40%;            /* #ba1a1a */
--border: 240 4% 83%;                /* #d2d3d8 */
--card: 0 0% 100%;
--muted: 240 4% 94%;
--accent: 217 100% 46%;              /* #0070eb */

/* Dark mode — .dark */
--background: 240 4% 6%;             /* #0f0f11 */
--foreground: 240 3% 93%;
--primary: 217 100% 68%;             /* #adc6ff */
--card: 240 3% 12%;
--border: 240 3% 20%;
```

**Regla absoluta:** Cero hardcoding de colores con hex/rgb en componentes. Siempre usar tokens (`bg-background`, `text-foreground`, `border-border`, etc.) o clases Shadcn/ui.

### 9.2 Tipografía

| Token | Fuente | Tamaño | Peso | Tracking |
|---|---|---|---|---|
| `h1` | Inter | 32px | 600 | -0.02em |
| `h2` | Inter | 24px | 600 | -0.01em |
| `h3` | Inter | 20px | 600 | 0 |
| `body` | Inter | 16px | 400 | 0 |
| `body-sm` | Inter | 14px | 400 | 0 |
| `label-caps` | Inter | 12px | 500 | +0.05em / uppercase |
| `button` | Inter | 14px | 500 | -0.01em |

### 9.3 Espaciado (base 4px)

| Token | Valor |
|---|---|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `container-max` | 1280px |
| `gutter` | 24px |

### 9.4 Border Radius

| Token | Valor |
|---|---|
| `sm` | 4px (0.25rem) |
| `DEFAULT` | 8px (0.5rem) |
| `md` | 12px (0.75rem) |
| `lg` | 16px (1rem) |
| `xl` | 24px (1.5rem) |
| `full` | 9999px |

### 9.5 Elevación y Sombras

- **Light:** borde 1px `border-border` + sombra `shadow-sm` (`0 4px 12px rgba(0,0,0,0.05)`)
- **Dark:** superficie elevada con color más claro; sin sombra pesada
- **Navbar y modals flotantes:** glassmorphism → `backdrop-blur-xl bg-background/70`

### 9.6 Colores Semánticos para Estados y Prioridades

| Estado | Clase badge (light) | Clase badge (dark) |
|---|---|---|
| Por hacer | `bg-slate-100 text-slate-700` | `bg-slate-800 text-slate-300` |
| En progreso | `bg-blue-100 text-blue-700` | `bg-blue-900 text-blue-300` |
| En revisión | `bg-amber-100 text-amber-700` | `bg-amber-900 text-amber-300` |
| Listo | `bg-green-100 text-green-700` | `bg-green-900 text-green-300` |

| Prioridad | Icono Lucide | Color |
|---|---|---|
| Baja | `ArrowDown` | `text-slate-400` |
| Media | `ArrowRight` | `text-amber-500` |
| Alta | `ArrowUp` | `text-red-500` |

---

## 10. Arquitectura de Componentes

### 10.1 Árbol de Composición Principal

```
<ThemeProvider>
  <QueryClientProvider>
    <RouterProvider>
      ├── /login → <AuthLayout>
      │     └── <LoginPage>
      │           └── <LoginForm> (React Hook Form + Zod)
      │
      └── /board, /dashboard, /users, /archived → <AppLayout>
            ├── <Sidebar>
            │     ├── Logo
            │     ├── NavItem (Board)
            │     ├── NavItem (Dashboard)
            │     ├── NavItem (Usuarios) [Admin only]
            │     └── NavItem (Archivados) [Admin only]
            ├── <Topbar>
            │     ├── Breadcrumb
            │     ├── <ThemeToggle>
            │     └── <UserMenu> (Avatar + DropdownMenu)
            ├── <CommandPalette> (CMD+K, global)
            └── <Outlet>
                  ├── <BoardPage>
                  │     ├── <FilterBar>
                  │     │     ├── <SearchInput>
                  │     │     ├── FilterSelect (Status, multiselect)
                  │     │     ├── FilterSelect (Priority, multiselect)
                  │     │     ├── FilterSelect (Assignee, multiselect)
                  │     │     ├── FilterSelect (Label, multiselect)
                  │     │     ├── DateRangePicker (createdFrom/createdTo)
                  │     │     └── ClearFiltersButton
                  │     ├── <ViewToggle>
                  │     ├── <KanbanView> | <ListView> (condicional)
                  │     │     └── [Kanban] 4 × <KanbanColumn>
                  │     │           └── n × <KanbanCard onClick → openTicketModal('view')>
                  │     │     └── [Lista] <TicketTable>
                  │     │           ├── n × <TicketRow onClick → openTicketModal('view')>
                  │     │           └── <Pagination>
                  │     └── <TicketModal> (portal, controlado por uiStore)
                  │           ├── [create/edit] <TicketForm>
                  │           │     ├── TitleInput (120 char counter)
                  │           │     ├── <MarkdownEditor>
                  │           │     ├── StatusSelect
                  │           │     ├── PrioritySelect
                  │           │     ├── <AssigneeSelect>
                  │           │     └── <LabelInput>
                  │           └── [view] <TicketDetail>
                  │                 ├── Metadata (Status, Priority, Assignee, Labels)
                  │                 ├── Markdown preview
                  │                 ├── ActionBar (Editar | Archivar | Restaurar)
                  │                 ├── <ActivityFeed>
                  │                 │     └── n × <CommentItem>
                  │                 └── <CommentSection>
                  │                       └── <MentionInput> + Submit
                  │
                  ├── <DashboardPage>
                  │     ├── 3 × <MetricsCard> (totales)
                  │     ├── <TicketsClosedChart> (BarChart Tremor — 6 meses)
                  │     ├── <StatusSnapshot> (DonutChart Tremor)
                  │     └── <TeamMetrics> (Tabla)
                  │
                  ├── <UsersPage> [Admin]
                  │     ├── <UserTable>
                  │     │     └── n × <UserRow>
                  │     └── <UserModal>
                  │           └── <UserForm>
                  │
                  └── <ArchivedPage> [Admin]
                        └── <TicketTable mode="archived"> (restaurar, no archivar)
```

---

## 11. Componentes Clave — Contrato de Props

### `<TicketModal>`

| Prop | Tipo | Descripción |
|---|---|---|
| `open` | `boolean` | Controlado por `uiStore` |
| `mode` | `'create' \| 'edit' \| 'view'` | Determina el contenido renderizado |
| `ticketId` | `string \| undefined` | Requerido en modo `edit` y `view` |
| `onClose` | `() => void` | Cierra el modal y limpia estado |

### `<TicketForm>` (dentro de TicketModal)

- Validado con **Zod** + **React Hook Form**
- En modo `edit`, envía `version` actual junto con los cambios
- En respuesta **409** del API: cierra el formulario y abre `<ConflictModal>` con el nombre del usuario que produjo el conflicto

### `<ConflictModal>`

- Muestra el mensaje exacto del PRD: *"Este ticket fue modificado por [nombre] mientras lo editabas. Recarga para ver los cambios."*
- Único botón: **"Recargar ticket"** → invalida la query del ticket en TanStack Query (`invalidateQueries(['ticket', id])`)

### `<MentionInput>` (@autocomplete)

- Textarea que detecta el carácter `@` y muestra un `Popover` con la lista de usuarios activos (filtrable)
- Al seleccionar un usuario, inserta `@username` en el texto
- Fuente de datos: `useQuery(['users', 'active'])` — lista cacheada

### `<CommandPalette>` (CMD+K)

- Implementado con **cmdk** + `Dialog` de Shadcn/ui
- Grupos: Navegación (Board, Dashboard, Usuarios, Archivados), Tickets recientes, Acciones (Nuevo ticket, Toggle tema)
- Atajo de teclado: `⌘K` (Mac) / `Ctrl+K` (Windows)
- Estado controlado por `uiStore.commandPaletteOpen`

### `<ThemeProvider>` + Anti-FOUC

- Context expone `{ theme, setTheme }` donde `theme: AppTheme = 'light' | 'dark' | 'system'`
- Persiste en `localStorage['minijira-theme']`
- En `index.html`, antes del bundle JS, se inyecta un script inline que lee `localStorage['minijira-theme']` y aplica/quita `.dark` en `<html>` para evitar FOUC
- En modo `system`, escucha el evento `window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ...)`

---

## 12. Reglas de Negocio del Frontend

### 12.1 Permisos (derivados de PRD §2.4)

El frontend **oculta o desactiva** controles según las siguientes reglas. El backend es la última barrera de autorización.

```
Operación               | Admin | Creador | Asignado | Otro
------------------------|-------|---------|----------|------
Crear ticket            |  ✅   |   ✅    |    ✅    |  ✅
Editar título/desc      |  ✅   |   ✅    |    ✅    |  ❌
Cambiar estado          |  ✅   |   ✅    |    ✅    |  ❌
Cambiar asignado        |  ✅   |   ✅    |    ❌    |  ❌
Archivar ticket         |  ✅   |   ✅    |    ❌    |  ❌
Restaurar archivado     |  ✅   |   ❌    |    ❌    |  ❌
Gestionar usuarios      |  ✅   |   ❌    |    ❌    |  ❌
Comentar               |  ✅   |   ✅    |    ✅    |  ✅
Ver dashboard           |  ✅   |   ✅    |    ✅    |  ✅
```

**Implementación:**
- Hook `useAuth()` expone helpers: `isAdmin()`, `isOwner(ticket)`, `isAssigned(ticket)`, `canEdit(ticket)`, `canArchive(ticket)`.
- Los botones/controles bloqueados se renderizan con `disabled` o directamente no se montan (preferir no montar para Admin-only).

### 12.2 Locking Optimista (PRD §2.11)

1. Al abrir un ticket en modo `edit`, se guarda localmente el `version` leído.
2. Al enviar el formulario, se incluye `{ ...cambios, version: N }` en el `PATCH`.
3. Si el API responde **409**, se abre `<ConflictModal>` con el nombre del editor conflictivo.
4. `<ConflictModal>` invalida la query del ticket para forzar recarga desde el servidor.
5. **No hay merge automático.** El usuario debe rehacer sus cambios manualmente.
6. Los comentarios **no incluyen** el campo `version` y nunca generan conflicto.

### 12.3 Archivado (Soft Delete — PRD §2.5)

- El botón en la UI se etiqueta **"Eliminar"** aunque la operación sea un soft delete.
- Los tickets archivados **no aparecen** en la query principal del board (filtro `archived=false` en todos los queries del board).
- La ruta `/archived` (Admin only) carga los tickets con `archived=true`.
- Un ticket archivado **no puede recibir comentarios**: el `<CommentSection>` muestra un aviso y el input queda deshabilitado.
- Al restaurar un ticket, se invalidan las queries del board y del ticket.

### 12.4 Flujo de Estados (PRD §2.3)

- Transición **libre** entre los 4 estados: no se bloquea ninguna transición en el frontend.
- El `StatusSelect` muestra siempre los 4 estados disponibles.
- El estado inicial al crear un ticket es **"Por hacer"** (valor por defecto en el formulario).

### 12.5 Validaciones de Formulario (Zod — PRD §2.2)

| Campo | Regla |
|---|---|
| `title` | `string().min(1).max(120)` |
| `description` | `string().min(1)` |
| `status` | `enum(['Por hacer','En progreso','En revisión','Listo'])` |
| `priority` | `enum(['Baja','Media','Alta'])` |
| `assignedToId` | `string().uuid().optional()` |
| `labels` | `array(string()).max(5).optional()` |
| `content` (comentario) | `string().min(1)` |

Los errores se muestran **inline** bajo el campo correspondiente. No se usa toast para errores de validación de formulario.

### 12.6 Paginación del Board

- Tamaño de página por defecto: **20 tickets**.
- La `Pagination` muestra: primera, anterior, páginas cercanas, siguiente, última.
- Al cambiar cualquier filtro, la página se resetea a 1 automáticamente.
- La vista Kanban no tiene paginación externa: las columnas hacen scroll vertical interno. Se cargan hasta 50 tickets por columna (límite de la query).

### 12.7 Búsqueda de Texto

- Se ejecuta sobre `title` y `description` con un debounce de **300 ms** antes de disparar la query.
- La búsqueda es exacta (substring, no semántica) — alineado con PRD §2.7.
- Se cancela la request anterior si el usuario sigue escribiendo (AbortController via TanStack Query).

### 12.8 Tema (Dark Mode — PRD §2.10)

- Tres opciones: `light`, `dark`, `system`.
- Si `system`: respeta `prefers-color-scheme` del OS y reacciona al cambio en tiempo real.
- Persiste en `localStorage['minijira-theme']`.
- Script bloqueante en `index.html` previene FOUC antes de que React hidrate.
- El `ThemeToggle` (iconos `Sun` / `Moon` / `Monitor` de Lucide) está en el `Topbar`, visible para todos los usuarios.

### 12.9 Sesión y Expiración (PRD §2.1)

- JWT con expiración de **8 horas**.
- Al montar la aplicación, `authStore` valida `exp` del token. Si expiró → `logout()` inmediato.
- El interceptor de Axios detecta **401** en cualquier request y ejecuta `logout()`.
- Al hacer logout (manual o por expiración), la URL actual se guarda en el state del router para redirigir después del re-login.

### 12.10 Comentarios (PRD §2.6)

- Cargados con paginación de **50 por request**.
- Orden cronológico **ascendente** (el más antiguo primero, el más reciente al final).
- Inmutables: no hay botones de edición ni borrado.
- El campo `content` se renderiza como texto plano con las menciones `@username` resaltadas (no Markdown).
- `<MentionInput>` muestra dropdown de autocompletado al escribir `@` + mínimo 1 carácter adicional.

---

## 13. Accesibilidad y UX Mínima

- Contraste mínimo **WCAG AA** en ambos temas (garantizado por la paleta Shadcn/ui).
- Todos los controles interactivos son alcanzables por teclado.
- Los modals atrapan el foco (focus trap) y se cierran con `Esc`.
- El `ThemeToggle` tiene `aria-label` que describe el tema activo.
- Los badges de estado y prioridad tienen `aria-label` descriptivo.
- Los errores de formulario están asociados con `aria-describedby`.

---

## 14. Criterios de Aceptación del Frontend

Alineados con el MVP del PRD (§7):

- [ ] Login / Logout funcional con sesión de 8 h; redirige a recurso original tras re-autenticación.
- [ ] Board muestra los tickets con vistas Kanban y Lista con toggle.
- [ ] Filtros (estado, prioridad, asignado, etiqueta, rango de fecha) y búsqueda de texto funcionan combinados.
- [ ] Modal de creación/edición valida campos inline (Zod) antes de enviar al API.
- [ ] El campo `version` se envía en cada PATCH; el conflicto 409 abre el `ConflictModal` con el nombre del editor.
- [ ] El botón "Eliminar" ejecuta archivado; el ticket desaparece del board.
- [ ] Solo el Admin ve la ruta `/archived` y el botón "Restaurar".
- [ ] La sección de comentarios pagina a 50, soporta `@autocomplete` y los comentarios son inmutables.
- [ ] El Dashboard muestra los 3 gráficos correctamente (incluyendo tickets archivados como cerrados).
- [ ] El toggle de tema (light/dark/system) está en el Topbar, persiste en `localStorage['minijira-theme']` y no produce FOUC.
- [ ] El Command Palette (CMD+K) permite navegar por secciones y acceder a acciones rápidas.
- [ ] El Activity Feed en el detalle del ticket muestra comentarios en orden cronológico ascendente.
- [ ] Usuarios con rol `Admin` tienen acceso a la gestión de usuarios (`/users`).

---

*Generado a partir de: specs.md · backlog.md · DESIGN.md · marmaid.desing.md · init_db.sql*  
*Pendiente confirmación del equipo antes de iniciar desarrollo.*
