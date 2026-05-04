# Backlog — Mini Jira MVP

> **Proyecto:** Mini Jira v1.0  
> **Product Owner:** Laura  
> **Fecha de validación:** 02 de Mayo 2026  
> **Fuente:** PRD Mini Jira v1.0 + Sesión de análisis BDD  
> **Estado:** ✅ Validado — listo para Sprint Planning

---

## Resumen del Backlog

| ID | Título | Tipo | Prioridad | Dependencias | Escenarios |
|---|---|:---:|:---:|---|:---:|
| HU-01 | Autenticación y Control de Acceso por Rol | Historia | 🔴 Crítica | — | 5 |
| HU-02 | Ciclo de Vida Completo de un Ticket | Historia | 🔴 Crítica | HU-01 | 6 |
| HU-03 | Detección de Conflicto por Edición Concurrente | Historia | 🔴 Crítica | HU-02 | 4 |
| EC-01 | Validación de Límites en Creación de Ticket | Edge Case | 🟠 Alta | HU-02 | 6 |
| EC-02 | Archivado Concurrente de un Ticket en Edición | Edge Case | 🟠 Alta | HU-02 + HU-03 | 4 |

**Total de escenarios Gherkin validados: 25**

---

## HU-01 — Autenticación y Control de Acceso por Rol

> **Como** miembro del equipo,  
> **quiero** iniciar sesión con mis credenciales internas,  
> **para** acceder a las funciones según mi rol (Admin o User).

**Criterios de aceptación resumidos:**
- Login con usuario/contraseña internos (no SSO).
- Sesión persistente con expiración de 8 h.
- Dos roles: Admin (acceso total) y User (acceso restringido según matriz PRD §2.4).
- Credenciales inválidas no revelan qué campo es incorrecto.
- Redirige al recurso original tras re-autenticación.

```gherkin
Feature: Autenticación y sesión

  Background:
    Given que existen los roles "Admin" y "User" en el sistema
    And la sesión expira tras 8 horas de inactividad por defecto

  Scenario: Inicio de sesión exitoso como User
    Given que soy un usuario registrado con rol "User"
    When me autentico con credenciales válidas
    Then tengo acceso al board de tickets, comentarios y dashboard
    And no tengo acceso a la gestión de usuarios ni restauración de tickets archivados

  Scenario: Inicio de sesión exitoso como Admin
    Given que soy un usuario registrado con rol "Admin"
    When me autentico con credenciales válidas
    Then tengo acceso a todas las operaciones del sistema
    And puedo gestionar usuarios y restaurar tickets archivados

  Scenario: Credenciales inválidas
    Given que intento autenticarme
    When las credenciales proporcionadas no corresponden a ningún usuario activo
    Then el acceso es denegado
    And no se revela si el error es el usuario o la contraseña

  Scenario: Expiración de sesión
    Given que tengo una sesión activa
    When han transcurrido 8 horas sin actividad
    Then mi sesión es invalidada
    And soy redirigido al login sin perder la URL que intentaba visitar

  Scenario: Acceso a recurso sin sesión activa
    Given que no tengo una sesión activa
    When intento acceder a cualquier recurso protegido
    Then soy redirigido al login
```

---

## HU-02 — Ciclo de Vida Completo de un Ticket

> **Como** miembro del equipo,  
> **quiero** crear, editar, cambiar el estado y archivar tickets,  
> **para** gestionar el trabajo del equipo de forma centralizada.

**Criterios de aceptación resumidos:**
- Campos obligatorios: título (máx. 120 chars), descripción (Markdown), estado, prioridad.
- Campos opcionales: asignado a, etiquetas (máx. 5).
- Campos automáticos (read-only): creado por, fecha creación, fecha modificación, versión.
- Transición de estado libre entre los 4 estados definidos.
- Archivado = soft delete; el ticket no aparece en board pero sí en métricas.
- Solo Admin puede restaurar un ticket archivado.

```gherkin
Feature: Gestión de tickets

  Background:
    Given que estoy autenticado en el sistema
    And existen los estados: "Por hacer", "En progreso", "En revisión", "Listo"

  Scenario: Creación de ticket con campos obligatorios
    Given que quiero registrar un nuevo ítem de trabajo
    When creo un ticket con título, descripción, estado y prioridad válidos
    Then el ticket queda registrado con mi usuario como "Creado por"
    And se registran automáticamente la fecha de creación y la versión inicial (v1)
    And el ticket aparece visible en el board para todos los usuarios

  Scenario: Edición por usuario con permiso
    Given que soy el creador o el asignado de un ticket existente
    When modifico el título, descripción o estado del ticket
    Then los cambios se persisten
    And se actualiza la fecha de última modificación
    And la versión del ticket se incrementa

  Scenario: Edición bloqueada para usuario sin permiso
    Given que no soy creador, asignado ni Admin de un ticket
    When intento modificar el título, descripción o estado de ese ticket
    Then la operación es rechazada
    And el ticket permanece sin cambios

  Scenario: Transición de estado libre
    Given que tengo permiso de edición sobre un ticket
    When cambio el estado a cualquier valor válido del flujo
    Then el estado se actualiza independientemente del estado anterior

  Scenario Outline: Archivado (soft delete)
    Given que un ticket existe en el board con estado "<estado_actual>"
    When lo archivo teniendo el permiso correspondiente
    Then el ticket desaparece del board y de los filtros por defecto
    And el ticket sigue contabilizándose en el dashboard de métricas históricas
    And no se elimina físicamente de la base de datos

    Examples:
      | estado_actual |
      | Por hacer     |
      | En progreso   |
      | En revisión   |
      | Listo         |

  Scenario: Restauración exclusiva de Admin
    Given que un ticket está archivado
    When un usuario con rol "Admin" lo restaura
    Then el ticket vuelve a ser visible en el board
    And un usuario con rol "User" no tiene disponible esa acción
```

---

## HU-03 — Detección de Conflicto por Edición Concurrente

> **Como** miembro del equipo,  
> **quiero** ser notificado si alguien más modificó un ticket mientras yo lo editaba,  
> **para** no sobreescribir cambios de mis compañeros sin saberlo.

**Criterios de aceptación resumidos:**
- Campo `version` (entero) en cada ticket, autoincremental.
- Al guardar: backend compara versión cliente vs. base de datos.
- Versiones coinciden → se guarda y versión sube a N+1.
- Versiones no coinciden → se rechaza con mensaje de conflicto nombrado.
- Sin merge automático: el usuario rehace cambios manualmente.
- Comentarios son inserciones independientes; no sujetos a conflicto de versión.

```gherkin
Feature: Locking optimista en tickets

  Background:
    Given que el sistema implementa versionado optimista
    And cada ticket posee un campo "version" entero autoincremental

  Scenario: Guardado exitoso sin conflicto
    Given que abro un ticket en versión N
    And ningún otro usuario lo modifica mientras lo edito
    When guardo mis cambios enviando la versión N
    Then los cambios se persisten
    And la versión del ticket pasa a N+1

  Scenario: Detección de conflicto al guardar
    Given que abro un ticket en versión N
    And otro usuario guarda cambios sobre ese mismo ticket mientras lo edito
    When intento guardar mis cambios enviando la versión N
    Then el sistema rechaza mi operación
    And recibo el mensaje:
      """
      Este ticket fue modificado por [nombre] mientras lo editabas.
      Recarga para ver los cambios.
      """
    And mis cambios locales no se persisten

  Scenario: No existe merge automático
    Given que se detecta un conflicto de versión
    When decido continuar editando
    Then debo recargar el ticket manualmente para ver la versión actual
    And debo rehacer mis cambios sobre la versión más reciente

  Scenario: Los comentarios no generan conflicto de versión
    Given que dos usuarios añaden comentarios al mismo ticket simultáneamente
    When ambos publican su comentario
    Then ambos comentarios se persisten de forma independiente
    And no se genera error de conflicto de versión en ninguno de los dos
```

---

## EC-01 — Validación de Límites en Creación de Ticket

> **Derivado de:** PRD §2.2 — campos obligatorios, máx. 120 chars en título, máx. 5 etiquetas  
> **Riesgo:** Sin validación explícita del comportamiento de fallo, el backend puede persistir datos inválidos o lanzar excepciones no controladas.

```gherkin
Feature: Validación de entradas al crear o editar un ticket

  Background:
    Given que estoy autenticado en el sistema
    And tengo permiso para crear o editar tickets

  Scenario: Título vacío al crear ticket
    Given que intento crear un ticket
    When envío el formulario con el campo título vacío
    Then la operación es rechazada antes de llegar a la base de datos
    And recibo un mensaje de error indicando que el título es obligatorio
    And no se crea ningún ticket

  Scenario: Título en el límite exacto (120 caracteres)
    Given que intento crear un ticket
    When el título contiene exactamente 120 caracteres
    Then el ticket se crea correctamente
    And el título se persiste sin truncamiento

  Scenario: Título excede el límite (121 caracteres)
    Given que intento crear un ticket
    When el título contiene 121 caracteres o más
    Then la operación es rechazada
    And recibo un mensaje de error indicando el límite de 120 caracteres
    And no se crea ningún ticket

  Scenario: Agregar etiqueta dentro del límite permitido
    Given que un ticket ya tiene 4 etiquetas asignadas
    When agrego una etiqueta adicional
    Then la etiqueta se persiste correctamente
    And el ticket queda con 5 etiquetas en total

  Scenario: Exceder el límite de etiquetas (más de 5)
    Given que un ticket ya tiene 5 etiquetas asignadas
    When intento agregar una sexta etiqueta
    Then la operación es rechazada
    And recibo un mensaje de error indicando el límite de 5 etiquetas por ticket
    And las 5 etiquetas existentes permanecen sin cambios

  Scenario: Descripción ausente al crear ticket
    Given que intento crear un ticket
    When envío el formulario sin contenido en el campo descripción
    Then la operación es rechazada
    And recibo un mensaje de error indicando que la descripción es obligatoria
    And no se crea ningún ticket
```

---

## EC-02 — Archivado Concurrente de un Ticket en Edición

> **Derivado de:** PRD §2.5 (archivado) + §2.11 (locking optimista)  
> **Riesgo:** El PRD define el versionado para conflictos entre ediciones, pero no especifica qué ocurre cuando un usuario archiva un ticket mientras otro lo edita. Sin este escenario cubierto, el editor podría recibir un error genérico sin contexto, o peor, persistir cambios sobre un ticket ya archivado.

```gherkin
Feature: Conflicto entre archivado y edición concurrente

  Background:
    Given que el sistema implementa versionado optimista
    And un ticket existe en el board en versión N con estado activo

  Scenario: Editor intenta guardar un ticket que fue archivado mientras lo editaba
    Given que el usuario A abre el ticket en versión N para editarlo
    And el usuario B (con permiso de archivado) archiva ese mismo ticket
    When el usuario A intenta guardar sus cambios enviando la versión N
    Then la operación es rechazada
    And el usuario A recibe un mensaje indicando que el ticket ya no está disponible
    And los cambios del usuario A no se persisten
    And el ticket permanece en estado archivado

  Scenario: Admin restaura un ticket mientras otro usuario lo intenta editar
    Given que un ticket está archivado en versión N
    And el usuario A (Admin) restaura el ticket, incrementando su versión a N+1
    When un segundo usuario intenta guardar una edición con versión N
    Then la operación es rechazada por conflicto de versión
    And el segundo usuario recibe el mensaje estándar de conflicto de versión
    And debe recargar para ver el estado restaurado del ticket

  Scenario: El archivado en sí mismo incrementa la versión del ticket
    Given que un ticket existe en versión N
    When un usuario con permiso lo archiva
    Then la versión del ticket se incrementa a N+1
    And cualquier operación posterior que envíe la versión N es rechazada automáticamente

  Scenario: Un ticket archivado no puede recibir nuevos comentarios
    Given que un ticket está archivado
    When cualquier usuario intenta publicar un comentario en ese ticket
    Then la operación es rechazada
    And el comentario no se persiste
    And los comentarios existentes permanecen intactos y visibles
```

---

## Criterio de Priorización

| ID | Historia | Dependencias | Motivo de criticidad |
|---|---|---|---|
| **HU-01** | Autenticación | — | Prerequisito absoluto — desbloquea todo lo demás |
| **HU-02** | Ciclo de Vida del Ticket | HU-01 | Core del producto; sin ella no hay MVP |
| **HU-03** | Concurrencia (Locking Optimista) | HU-02 | Marcada en PRD como *"no negociable"* — genera deuda técnica estructural si se omite |
| **EC-01** | Validación de Límites | HU-02 | Previene corrupción de datos — fácil de olvidar, costoso de corregir post-producción |
| **EC-02** | Archivado Concurrente | HU-02 + HU-03 | Intersección de dos features críticas; sin cobertura genera comportamiento indefinido |

---

*Backlog generado a partir del PRD Mini Jira v1.0 (02 de Mayo 2026).*  
*Pendiente sign-off de Laura y Marcos antes del inicio del Sprint 1.*
