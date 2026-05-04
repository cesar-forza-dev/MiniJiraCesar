-- =============================================================================
-- Mini Jira v1.0 — Database Init Script
-- Motor:   PostgreSQL 15+
-- Fuente:  PRD §2.1 (Auth), §2.2 (Tickets), §2.5 (Archivado), §2.11 (Versioning)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensiones
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- índice ILIKE para búsqueda §2.7

-- ---------------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
    'Admin',
    'User'
);

CREATE TYPE ticket_status AS ENUM (
    'Por hacer',
    'En progreso',
    'En revisión',
    'Listo'
);

CREATE TYPE ticket_priority AS ENUM (
    'Baja',
    'Media',
    'Alta'
);

-- ---------------------------------------------------------------------------
-- Función auxiliar: actualiza updated_at automáticamente en cualquier tabla
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =============================================================================
-- TABLA: users
-- PRD §2.1 — Autenticación y Sesión
-- =============================================================================
CREATE TABLE users (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)     NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    password_hash   TEXT            NOT NULL,              -- bcrypt hash
    role            user_role       NOT NULL DEFAULT 'User',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE, -- baja lógica de usuario
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_users_username    UNIQUE (username),
    CONSTRAINT uq_users_email       UNIQUE (email),
    CONSTRAINT chk_users_email_fmt  CHECK  (email ~* '^[^@]+@[^@]+\.[^@]+$')
);

COMMENT ON TABLE  users                IS 'Usuarios internos del sistema. No SSO en v1.';
COMMENT ON COLUMN users.password_hash  IS 'Hash bcrypt. Nunca almacenar contraseña en texto plano.';
COMMENT ON COLUMN users.is_active      IS 'Soft-delete de usuario. FALSE = no puede autenticarse.';

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Índice para lookups de login (email es el campo de autenticación primario)
CREATE INDEX idx_users_email    ON users (email)    WHERE is_active = TRUE;
CREATE INDEX idx_users_username ON users (username) WHERE is_active = TRUE;

-- =============================================================================
-- TABLA: tickets
-- PRD §2.2 (campos), §2.3 (estados), §2.5 (archivado), §2.11 (versioning)
-- =============================================================================
CREATE TABLE tickets (
    -- Identidad
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Campos obligatorios (PRD §2.2)
    title           VARCHAR(120)    NOT NULL,
    description     TEXT            NOT NULL,
    status          ticket_status   NOT NULL DEFAULT 'Por hacer',
    priority        ticket_priority NOT NULL,

    -- Campos opcionales
    assigned_to     UUID            REFERENCES users(id) ON DELETE SET NULL,

    -- Campos de auditoría (read-only desde la app)
    created_by      UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

    -- Locking optimista (PRD §2.11) — empieza en 1, se incrementa en cada UPDATE
    version         INTEGER         NOT NULL DEFAULT 1,

    -- Archivado lógico (PRD §2.5)
    archived        BOOLEAN         NOT NULL DEFAULT FALSE,
    archived_at     TIMESTAMPTZ,
    archived_by     UUID            REFERENCES users(id) ON DELETE SET NULL,

    -- Timestamps automáticos
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Constraints de integridad
    CONSTRAINT chk_title_not_blank
        CHECK (TRIM(title) <> ''),

    CONSTRAINT chk_description_not_blank
        CHECK (TRIM(description) <> ''),

    CONSTRAINT chk_version_positive
        CHECK (version >= 1),

    -- Si está archivado, archived_at y archived_by deben estar presentes (y viceversa)
    CONSTRAINT chk_archived_consistency CHECK (
        (archived = FALSE AND archived_at IS NULL  AND archived_by IS NULL) OR
        (archived = TRUE  AND archived_at IS NOT NULL AND archived_by IS NOT NULL)
    )
);

COMMENT ON TABLE  tickets               IS 'Tickets de trabajo. Nunca se eliminan físicamente (soft-delete vía archived).';
COMMENT ON COLUMN tickets.version       IS 'Locking optimista. El cliente envía la versión que leyó; el UPDATE incluye WHERE version = $cliente.';
COMMENT ON COLUMN tickets.archived      IS 'TRUE = soft-delete. No aparece en board pero sí en métricas históricas (PRD §2.5).';
COMMENT ON COLUMN tickets.description   IS 'Texto en formato Markdown.';

CREATE TRIGGER trg_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Índices operacionales
CREATE INDEX idx_tickets_status         ON tickets (status)      WHERE archived = FALSE;
CREATE INDEX idx_tickets_priority       ON tickets (priority)    WHERE archived = FALSE;
CREATE INDEX idx_tickets_assigned_to    ON tickets (assigned_to) WHERE archived = FALSE;
CREATE INDEX idx_tickets_created_by     ON tickets (created_by);
CREATE INDEX idx_tickets_created_at     ON tickets (created_at);
CREATE INDEX idx_tickets_archived       ON tickets (archived);

-- Índice de búsqueda de texto exacta sobre título y descripción (PRD §2.7)
-- pg_trgm permite ILIKE eficiente sin semántica — alineado con "búsqueda exacta" del PRD
CREATE INDEX idx_tickets_title_trgm       ON tickets USING GIN (title       gin_trgm_ops) WHERE archived = FALSE;
CREATE INDEX idx_tickets_description_trgm ON tickets USING GIN (description gin_trgm_ops) WHERE archived = FALSE;

-- =============================================================================
-- TABLA: ticket_labels
-- PRD §2.2 — Etiquetas: lista de strings, libre, máx. 5 por ticket
-- =============================================================================
CREATE TABLE ticket_labels (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id   UUID        NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    label       TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_ticket_label          UNIQUE (ticket_id, label),
    CONSTRAINT chk_label_not_blank      CHECK  (TRIM(label) <> ''),
    CONSTRAINT chk_label_max_length     CHECK  (LENGTH(TRIM(label)) <= 50)
);

COMMENT ON TABLE ticket_labels IS 'Etiquetas de un ticket. Máximo 5 por ticket (enforced por trigger).';

CREATE INDEX idx_ticket_labels_ticket_id ON ticket_labels (ticket_id);

-- Función y trigger: máximo 5 etiquetas por ticket (PRD §2.2)
CREATE OR REPLACE FUNCTION fn_check_max_labels()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM   ticket_labels
        WHERE  ticket_id = NEW.ticket_id
    ) >= 5 THEN
        RAISE EXCEPTION
            'El ticket % ya tiene 5 etiquetas. No se pueden agregar más (PRD §2.2).',
            NEW.ticket_id
            USING ERRCODE = 'check_violation';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_max_labels_per_ticket
    BEFORE INSERT ON ticket_labels
    FOR EACH ROW EXECUTE FUNCTION fn_check_max_labels();

-- =============================================================================
-- MOCK DATA — Datos de prueba realistas
-- Contraseñas en texto plano (solo para referencia local):
--   marcos@minijira.io  → Admin1234!
--   sofia@minijira.io   → Sofia2024!
--   laura@minijira.io   → Laura2024!
-- =============================================================================

-- ---------------------------------------------------------------------------
-- UUIDs fijos para referenciar entre tablas de forma determinista
-- ---------------------------------------------------------------------------
-- usuarios
-- u1: Marcos Ruiz    (Admin)
-- u2: Sofía Herrera  (User)
-- u3: Laura Gómez    (User / PO)
--
-- tickets
-- t1: Setup inicial del proyecto         → Listo         (cerrado, v3)
-- t2: Implementar autenticación JWT      → En progreso   (v2)
-- t3: Diseñar esquema de base de datos   → Listo         (cerrado, v2)
-- t4: Crear componentes UI del board     → Por hacer     (v1)
-- t5: Revisar locking optimista          → En revisión   (v2)
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Usuarios
-- ---------------------------------------------------------------------------
INSERT INTO users (id, username, email, password_hash, role) VALUES

    -- Admin — Marcos Ruiz (Tech Lead)
    (
        '11111111-1111-1111-1111-111111111111',
        'marcos.ruiz',
        'marcos@minijira.io',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtgT0aDfbDRMgU.vLkGxMUFNJL8K',
        'Admin'
    ),

    -- User — Sofía Herrera (Dev Junior)
    (
        '22222222-2222-2222-2222-222222222222',
        'sofia.herrera',
        'sofia@minijira.io',
        '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uhu15odo.',
        'User'
    ),

    -- User — Laura Gómez (Product Owner)
    (
        '33333333-3333-3333-3333-333333333333',
        'laura.gomez',
        'laura@minijira.io',
        '$2b$12$X4kGT3pLJmVN1rWqEo8bBuYzKp5nHsI9vCjlU7mTw6aQdFeMrK3Oy',
        'User'
    );

-- ---------------------------------------------------------------------------
-- Tickets
-- ---------------------------------------------------------------------------
INSERT INTO tickets (
    id, title, description, status, priority,
    assigned_to, created_by,
    version, archived, archived_at, archived_by,
    created_at, updated_at
) VALUES

    -- T1: Listo — Setup inicial del proyecto (editado 3 veces, cerrado)
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Setup inicial del proyecto (monorepo)',
        E'## Objetivo\nConfigurar el monorepo con los siguientes paquetes:\n- `apps/web` — React + Vite + Shadcn/ui\n- `apps/api` — Node.js + Fastify\n- `packages/zod-schemas` — esquemas Zod compartidos\n\n## Criterio de aceptación\n- `pnpm install` sin errores\n- `pnpm dev` levanta ambas apps en paralelo',
        'Listo',
        'Alta',
        '22222222-2222-2222-2222-222222222222',   -- asignado a Sofía
        '11111111-1111-1111-1111-111111111111',   -- creado por Marcos
        3,        -- versión 3: editado dos veces tras la creación
        FALSE,
        NULL,
        NULL,
        NOW() - INTERVAL '6 days',
        NOW() - INTERVAL '4 days'
    ),

    -- T2: En progreso — Autenticación JWT
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Implementar autenticación JWT + bcrypt',
        E'## Descripción\nCrear el flujo de autenticación completo:\n1. `POST /auth/login` — valida credenciales, devuelve JWT (exp 8 h)\n2. `POST /auth/logout` — invalida el token en lista negra (en memoria v1)\n3. Middleware `requireAuth` que protege todas las rutas privadas\n\n## Notas técnicas\n- Usar `jsonwebtoken` + `bcrypt` (cost factor 12)\n- El JWT incluye `userId`, `role` y `exp`\n- **No SSO en v1** (PRD §2.1)',
        'En progreso',
        'Alta',
        '22222222-2222-2222-2222-222222222222',   -- asignado a Sofía
        '11111111-1111-1111-1111-111111111111',   -- creado por Marcos
        2,
        FALSE,
        NULL,
        NULL,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '1 day'
    ),

    -- T3: Listo — Esquema de base de datos
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'Diseñar e implementar esquema PostgreSQL',
        E'## Objetivo\nCrear el script `init_db.sql` con las tablas:\n- `users` (roles, bcrypt hash, soft-delete)\n- `tickets` (locking optimista con campo `version`, soft-delete con `archived`)\n- `ticket_labels` (máx. 5 por ticket, enforced por trigger)\n\n## Referencias\n- PRD §2.2 — Campos del ticket\n- PRD §2.11 — Locking optimista',
        'Listo',
        'Alta',
        '11111111-1111-1111-1111-111111111111',   -- asignado a Marcos
        '11111111-1111-1111-1111-111111111111',   -- creado por Marcos
        2,
        FALSE,
        NULL,
        NULL,
        NOW() - INTERVAL '4 days',
        NOW() - INTERVAL '2 days'
    ),

    -- T4: Por hacer — UI del board
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'Crear componentes UI del board de tickets',
        E'## Alcance\nImplementar los siguientes componentes con Shadcn/ui + Tailwind:\n- `<TicketCard />` — muestra título, estado, prioridad y asignado\n- `<TicketBoard />` — lista filtrable de tickets\n- `<StatusBadge />` — badge coloreado según estado\n- `<PriorityIndicator />` — icono de prioridad\n\n## Notas de diseño\n- Referencia estética: Apple / minimalista (PRD §1)\n- Compatible con modo oscuro (PRD §2.10)\n- Sin asignar aún — pendiente de que Sofía termine HU-01',
        'Por hacer',
        'Media',
        NULL,                                     -- sin asignar
        '33333333-3333-3333-3333-333333333333',   -- creado por Laura
        1,
        FALSE,
        NULL,
        NULL,
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days'
    ),

    -- T5: En revisión — Locking optimista
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        'Revisar implementación de locking optimista con Prisma',
        E'## Contexto\nValidar que el patrón de locking optimista funciona correctamente:\n```sql\nUPDATE tickets\nSET    status = $1, version = version + 1, updated_at = NOW()\nWHERE  id = $2\nAND    version = $3;  -- si devuelve 0 filas → conflicto\n```\n\n## Criterios de revisión\n- [ ] El UPDATE devuelve 0 filas cuando hay conflicto\n- [ ] La API responde 409 con el mensaje correcto (PRD §2.11)\n- [ ] Los comentarios no incrementan `version`\n- [ ] Test de integración con dos usuarios concurrentes',
        'En revisión',
        'Alta',
        '11111111-1111-1111-1111-111111111111',   -- asignado a Marcos (reviewer)
        '22222222-2222-2222-2222-222222222222',   -- creado por Sofía
        2,
        FALSE,
        NULL,
        NULL,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '4 hours'
    );

-- ---------------------------------------------------------------------------
-- Etiquetas
-- ---------------------------------------------------------------------------
INSERT INTO ticket_labels (ticket_id, label) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'infra'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'setup'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'auth'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'backend'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'seguridad'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'base-de-datos'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'backend'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'frontend'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'ui'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'shadcn'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'concurrencia'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'backend'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'revisión');

-- =============================================================================
-- Fin del script
-- =============================================================================
