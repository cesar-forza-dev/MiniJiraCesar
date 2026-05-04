# PRD — Mini Jira (v1.0)
**Proyecto:** Herramienta interna de gestión de tickets  
**Fecha:** 02 de Mayo 2026  
**Stakeholders:** Laura (PO), Marcos (Tech Lead), Sofía (Dev Junior), Roberto (PM)  
**Fuente:** Kick-off meeting 24 de Octubre + sesión de análisis PM Senior  
**Estado:** BORRADOR — Requiere sign-off de Laura y Marcos antes de iniciar desarrollo

---

## 1. Objetivo

Construir una herramienta web interna de gestión de trabajo para un equipo de 10 personas. Debe reemplazar procesos informales, ser visualmente limpia (referencia estética: Apple / minimalista) y no requerir capacitación.

**Métrica de éxito v1:** El 100% del equipo registra y actualiza sus tickets durante la primera semana de uso en producción, sin soporte del equipo técnico.

---

## 2. In-Scope (v1)

### 2.1 Autenticación y Sesión
- Login con usuario y contraseña internos (no SSO en v1).
- Sesión persistente con expiración configurable (default: 8 h).
- Dos roles únicos: **Admin** y **User**.

### 2.2 Gestión de Tickets
| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Título | Texto corto (máx. 120 chars) | ✅ | |
| Descripción | Texto largo (Markdown) | ✅ | |
| Estado | Enum | ✅ | Ver §2.3 |
| Prioridad | Enum: Baja / Media / Alta | ✅ | |
| Asignado a | Usuario | ❌ | Puede quedar sin asignar |
| Etiquetas | Lista de strings | ❌ | Libre, max 5 por ticket |
| Creado por | Usuario (auto) | ✅ | Read-only |
| Fecha de creación | Timestamp (auto) | ✅ | Read-only |
| Fecha de última modificación | Timestamp (auto) | ✅ | Read-only |

### 2.3 Estados del Ticket
Flujo lineal con transición libre entre estados (no se fuerza secuencia):

```
Por hacer → En progreso → En revisión → Listo
```

> **Decisión:** Se adoptan 4 estados como compromiso entre la propuesta de Laura (3) y la de Marcos (5).  
> El estado **Blocked** queda fuera de scope v1; se revisará en v2 con el feedback real del equipo.

### 2.4 Operaciones por Rol

| Operación | Admin | User (creador) | User (asignado) | User (otro) |
|---|:---:|:---:|:---:|:---:|
| Crear ticket | ✅ | ✅ | ✅ | ✅ |
| Editar título / descripción | ✅ | ✅ | ✅ | ❌ |
| Cambiar estado | ✅ | ✅ | ✅ | ❌ |
| Cambiar asignado | ✅ | ✅ | ❌ | ❌ |
| Archivar ticket | ✅ | ✅ | ❌ | ❌ |
| Restaurar ticket archivado | ✅ | ❌ | ❌ | ❌ |
| Ver todos los tickets | ✅ | ✅ | ✅ | ✅ |
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ |
| Ver dashboard de métricas | ✅ | ✅ | ✅ | ✅ |

> ⚠️ **Acción requerida (Laura):** Confirmar esta matriz antes del inicio del sprint 1.

### 2.5 Archivado (≠ Eliminación)
- El botón en la UI se etiqueta **"Eliminar"** pero ejecuta un **soft delete** (archivado lógico).
- Los tickets archivados **no aparecen** en el board ni en filtros por defecto.
- Los tickets archivados **sí se incluyen** en el dashboard de métricas históricas.
- Solo el Admin puede restaurar un ticket archivado.
- No existe eliminación física (hard delete) en v1.

### 2.6 Comentarios
- Cualquier usuario autenticado puede comentar en cualquier ticket visible.
- Los comentarios son **inmutables** una vez publicados (no se editan ni borran en v1).
- Los comentarios soportan menciones con `@usuario`.
- Orden cronológico ascendente, paginados a 50 por carga.

### 2.7 Filtros y Búsqueda
El board principal permite filtrar por:
- Estado (multi-select)
- Prioridad (multi-select)
- Asignado a (multi-select)
- Etiqueta (multi-select)
- Rango de fecha de creación

Búsqueda de texto libre sobre título y descripción (búsqueda exacta, no full-text semántico en v1).

### 2.8 Notificaciones por Email
Disparadores (solo para el usuario destinatario):
1. Le asignan un ticket.
2. Le mencionan con `@usuario` en un comentario.
3. Un ticket que creó cambia de estado.

Contenido del email: título del ticket, estado actual, nombre del autor de la acción, y enlace directo al ticket.  
> ⚠️ **Restricción de datos:** La descripción completa del ticket **no se incluye** en el cuerpo del email para evitar filtración de información sensible.

### 2.9 Dashboard de Métricas
Visible para todos los roles. Muestra:
- Tickets cerrados (estado "Listo") por mes (últimos 6 meses).
- Tickets por estado (snapshot actual).
- Tickets por miembro del equipo (creados vs. cerrados).

Los tickets archivados se cuentan como cerrados en las métricas.

### 2.10 Modo Oscuro

**Decisión de inclusión:** La preocupación original ("complejidad de theming sin DS definido") queda resuelta al adoptar **Shadcn/ui** como Design System, que implementa dark mode nativamente mediante variables CSS. El esfuerzo incremental es bajo y el impacto en UX es alto para un equipo que trabaja frente a pantalla todo el día.

#### Estrategia de implementación

| Capa | Decisión | Detalle |
|---|---|---|
| **CSS engine** | Tailwind CSS — estrategia `class` | `darkMode: 'class'` en `tailwind.config`. El tema se activa añadiendo `.dark` al `<html>`. |
| **Variables de color** | CSS custom properties (Shadcn/ui defaults) | Todos los tokens de color se definen en `:root {}` (light) y `.dark {}`. Cero hardcoding de colores. |
| **Paleta light** | Blanco / grises fríos / azul acento | Referencia estética Apple declarada por Laura. |
| **Paleta dark** | Gris neutro-oscuro (#0F0F11 base) / azul acento atenuado | No negro puro — evita fatiga visual. |
| **Estado** | `light` · `dark` · `system` | `system` lee `prefers-color-scheme` del OS. |
| **Persistencia** | `localStorage` key: `minijira-theme` | Sobrevive refrescos. Si no hay valor previo, default = `system`. |
| **Hidratación SSR** | Script inline bloqueante pre-React | Evita el "flash" de tema incorrecto al cargar. Se inyecta antes del bundle JS. |

#### Componentes afectados
- `ThemeProvider` — Context global que envuelve `<App />`. Expone `{ theme, setTheme }`.
- `ThemeToggle` — Botón en la barra de navegación superior. Icono `Sun` / `Moon` / `Monitor` (Lucide React, ya incluido en Shadcn/ui).
- Todos los componentes Shadcn/ui (`Card`, `Button`, `Badge`, `Input`, `Table`, `Dialog`) responden automáticamente al cambio de clase `.dark`.
- El editor Markdown de descripción de tickets usa el tema activo para su skin.

#### Flujo de selección de tema

```
Usuario abre la app
       │
       ▼
¿Existe minijira-theme en localStorage?
  NO ──► leer prefers-color-scheme del OS
  SÍ ──► usar valor guardado (light | dark | system)
       │
       ▼
Inyectar/quitar clase .dark en <html>
       │
       ▼
ThemeToggle muestra icono del tema activo
Usuario cambia tema ──► guardar en localStorage ──► toggle .dark
```

#### Criterios de aceptación — Modo Oscuro
- [ ] El toggle de tema está visible y accesible en la navbar para todos los usuarios.
- [ ] La preferencia persiste al recargar la página y al cerrar/abrir el navegador.
- [ ] En modo `system`, el tema cambia automáticamente si el OS cambia su preferencia (evento `prefers-color-scheme`).
- [ ] No se produce flash de tema incorrecto (FOUC) en la carga inicial.
- [ ] Todos los componentes del Design System tienen contraste mínimo WCAG AA en ambos temas.
- [ ] El modo oscuro no afecta el comportamiento de ninguna otra funcionalidad.

---

### 2.11 Concurrencia — Comportamiento Definido
> Esta sección cierra el debate abierto en el kick-off (Sofía, `[09:05]` y `[09:15]`).

**Modelo adoptado: Locking Optimista con detección de conflicto.**

- Cada ticket tiene un campo `version` (entero autoincremental).
- Al guardar, el backend compara la versión del cliente con la versión en base de datos.
- Si las versiones **coinciden**: se guarda y se incrementa la versión.
- Si las versiones **no coinciden**: se rechaza el guardado y se muestra al usuario un mensaje:  
  *"Este ticket fue modificado por [nombre] mientras lo editabas. Recarga para ver los cambios."*
- **No se implementa merge automático.** El usuario que llega segundo debe rehacer sus cambios manualmente.
- Los cambios de **estado** siguen la misma lógica de versioning.
- Los **comentarios** son inserciones independientes; no están sujetos a conflicto de versión.

---

## 3. Out-of-Scope (v1)

| Feature | Motivo de exclusión | Candidato para |
|---|---|---|
| ~~Modo oscuro~~ | Movido a In-Scope §2.10 | v1 ✅ |
| Estado "Blocked" | Requiere definir flujo de dependencias entre tickets | v2 |
| Eliminación física (hard delete) | Decisión de negocio: datos no se destruyen | No planificado |
| Edición / borrado de comentarios | Integridad del historial de conversaciones | v2 |
| SSO / OAuth (cuentas empresa) | Dependencia de infra IT no confirmada | v2 |
| Notificaciones in-app (push/websocket) | Solo email en v1 | v2 |
| Adjuntos / imágenes en tickets | Complejidad de storage | v2 |
| API pública / webhooks | No hay consumidores definidos | No planificado |
| Aplicación móvil | Fuera del alcance declarado | No planificado |
| Custom workflows (estados configurables) | Requiere motor de estados complejo | No planificado |
| Internacionalización (i18n) | Equipo 100% en español | No planificado |
| Historial de cambios visible (audit log UI) | El log se guarda en DB pero no hay UI en v1 | v2 |

---

## 4. Stack Tecnológico

### 4.1 Stack Confirmado en Kick-off
| Capa | Tecnología |
|---|---|
| Frontend | React (librería de componentes: **Shadcn/ui** — referencia estética Apple/minimalista) |
| Backend | Node.js (runtime) |
| Base de datos | **PostgreSQL** (relacional, requerido por la lógica de estados y versioning) |

### 4.2 Stack Propuesto (pendiente sign-off Marcos)
| Capa | Tecnología | Justificación |
|---|---|---|
| Framework backend | Express.js o Fastify | Ligero, familiar para el equipo |
| ORM | **Prisma** | Migraciones versionadas; crítico porque los estados pueden cambiar en v2 |
| Autenticación | JWT + bcrypt | Sin dependencias externas, implementable en < 2 días |
| Servicio de email | **Resend** o **Nodemailer + SMTP interno** | Resend para setup rápido; SMTP interno si hay política IT |
| Validación API | Zod | Compartible entre backend y frontend (monorepo) |
| Theming (dark mode) | **Tailwind CSS `class` strategy + CSS custom properties** | Nativo en Shadcn/ui; `ThemeProvider` + `localStorage` |
| Hosting | A definir (contenedor Docker sobre infra interna) | Pendiente decisión de Roberto con dirección |

### 4.3 Decisiones Técnicas Abiertas
> Estas decisiones deben cerrarse en la primera sesión técnica (Marcos + Sofía) antes del sprint 1.

1. **ORM vs. queries directas:** Se recomienda Prisma por la mención de Sofía (`[09:25]`) sobre cambios de estados post-inicio.
2. **Servicio de email:** ¿Resend (cloud) o SMTP interno? Depende de si hay restricción de que los emails salgan de la red corporativa.
3. **Hosting / CI-CD:** No mencionado en el kick-off. Bloqueante para el despliegue de la semana 3.

---

## 5. Preguntas Abiertas con Owner Asignado

| # | Pregunta | Owner | Bloqueante para |
|---|---|---|---|
| P1 | ¿Se confirma la matriz de permisos del §2.4? | Laura | Sprint 1 — Backend de autenticación |
| P2 | ¿El email de notificación puede incluir la descripción del ticket? | Laura + Roberto | Sprint 2 — Servicio de email |
| P3 | ¿Resend (cloud) o SMTP interno para emails? | Roberto + IT | Sprint 2 — Servicio de email |
| P4 | ¿Cuál es el entorno de hosting y quién aprovisiona el servidor? | Roberto | Sprint 3 — Despliegue |
| P5 | ¿El dashboard es visible para usuarios sin rol Admin? (Asumido ✅ en este PRD) | Laura | Sprint 2 — Dashboard |

---

## 6. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Scope creep (notificaciones, dashboard, modo oscuro pedidos "de paso") | Alta | Alto | Congelar este PRD con firma de Laura antes del sprint 1 |
| Plazo de 3 semanas insuficiente | Alta | Alto | Priorizar: Auth + Tickets (sem 1), Comentarios + Filtros (sem 2), Email + Dashboard (sem 3 o v1.1) |
| Ambigüedad de permisos genera deuda técnica | Media | Alto | P1 debe cerrarse antes del día 1 de desarrollo |
| Conflicto de edición concurrente ignorado | Alta (sin locking) | Alto | Locking optimista definido en §2.10 es no negociable |

---

## 7. Criterios de Aceptación — MVP

- [ ] Un usuario puede registrarse, iniciar sesión y cerrar sesión.
- [ ] Un usuario puede crear, editar y archivar un ticket propio.
- [ ] Un Admin puede archivar cualquier ticket y gestionar usuarios.
- [ ] Un ticket pasa por los 4 estados definidos.
- [ ] Dos usuarios editando el mismo ticket simultáneamente reciben detección de conflicto.
- [ ] Un usuario recibe email al ser asignado o mencionado.
- [ ] El dashboard muestra tickets cerrados por mes (últimos 6 meses).
- [ ] El toggle de tema (light/dark/system) está visible en la navbar y persiste la preferencia entre sesiones.

---

*Este documento reemplaza los "acuerdos" del kick-off del 24 de Octubre, que delegaban permisos y concurrencia como "detalles menores a definir sobre la marcha" (acuerdo 3 — anulado).*
