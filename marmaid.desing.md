# Modelo C4 — Nivel de Contenedores · Mini Jira v1.0

> **Tipo:** C4 Container Diagram  
> **Proyecto:** Mini Jira v1.0  
> **Fuente:** PRD Mini Jira v1.0 (02 de Mayo 2026)  
> **Autor:** Arquitecto de Software

---

## Diagrama

```mermaid
C4Container
    title Diagrama de Contenedores — Mini Jira v1.0

    Person(admin, "Admin", "Gestiona usuarios, restaura tickets archivados y tiene acceso total al sistema.")
    Person(user, "User", "Crea, edita y comenta tickets. Consulta el dashboard de métricas.")

    System_Boundary(minijira, "Mini Jira") {

        Container(spa, "Web App (SPA)", "React · Shadcn/ui · Tailwind CSS", "Board de tickets, formularios CRUD, dashboard de métricas y toggle light/dark/system. Almacena preferencia de tema en localStorage.")

        Container(api, "API Server", "Node.js · Express/Fastify · Zod", "REST API. Autenticación JWT + bcrypt, autorización por rol, locking optimista con campo version, validación Zod, disparo de notificaciones por email.")

        ContainerDb(db, "Base de Datos", "PostgreSQL · Prisma ORM", "Persiste: usuarios y roles, tickets (version, soft-delete), comentarios, etiquetas y audit log interno.")
    }

    System_Ext(email_svc, "Servicio de Email", "Resend · SMTP interno", "Envía notificaciones de asignación de ticket, mención con @usuario y cambio de estado.")

    Rel(admin, spa, "Usa", "HTTPS")
    Rel(user, spa, "Usa", "HTTPS")
    Rel(spa, api, "Llama", "HTTPS · JSON REST")
    Rel(api, db, "Lee / escribe", "TCP · Prisma ORM")
    Rel(api, email_svc, "Envía emails transaccionales", "HTTPS · SMTP")
```

---

## Decisiones de arquitectura

| Elemento | Justificación |
|---|---|
| **SPA separada del API** | Desacoplamiento frontend/backend; el SPA puede desplegarse en CDN |
| **API Server único** | Equipo pequeño (10 personas), v1 no requiere microservicios |
| **PostgreSQL + Prisma** | Locking optimista requiere transacciones ACID; Prisma facilita migraciones cuando los estados cambien en v2 |
| **Email como sistema externo** | Dependencia de política IT (Resend vs SMTP); el API lo abstrae con un adaptador intercambiable |
| **localStorage fuera del System_Boundary** | Es almacenamiento del navegador, no un contenedor gestionado por el equipo |
