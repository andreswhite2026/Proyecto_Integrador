# Backlog del Producto - Gestión de Inasistencias Justificadas (AFK CODER)

**Proyecto:** Gestión de Inasistencias Justificadas
**Metodología:** Priorización MoSCoW (Must have / Should have / Could have / Won't have)
**Stack:** Vite + Vanilla JS + TailwindCSS v4 + json-server

---

## 1. Roles considerados

| Rol | Descripción |
|---|---|
| **Coder** | Estudiante que reporta y hace seguimiento a sus propias justificaciones de inasistencia |
| **Team Leader** | Consulta el estado de asistencia de sus estudiantes (solo lectura) |
| **Admin (Habilidades Socioemocionales)** | Revisa, aprueba/rechaza solicitudes, y gestiona usuarios, sedes y programas |

---

## 2. Resumen MoSCoW

| Prioridad | Significado | # Ítems |
|---|---|---|
| **Must have (Debe tener)** | Crítico para que el MVP sea utilizable | 14 |
| **Should have (Debería tener)** | Importante, aporta valor real, pero el producto funciona sin esto al inicio | 9 |
| **Could have (Podría tener)** | Deseable si hay tiempo/recursos disponibles | 8 |
| **Won't have (No tendrá por ahora)** | Explícitamente fuera de alcance por ahora, se retoma después | 6 |

---

## 3. Must Have (Debe tener)

Funcionalidad núcleo sin la cual el producto no entrega ningún valor.

| ID | Historia de Usuario | Módulo |
|---|---|---|
| M-01 | Como **usuario**, quiero iniciar sesión con correo y contraseña para poder acceder a las funciones de mi rol. | Auth |
| M-02 | Como **usuario**, quiero registrar una cuenta nueva eligiendo mi rol (Coder / Admin) para empezar a usar el sistema sin configuración manual. | Auth |
| M-03 | Como **usuario**, quiero que mi sesión se mantenga al cerrar y volver a abrir el navegador para no tener que iniciar sesión cada vez. | Auth |
| M-04 | Como **coder**, quiero registrar una inasistencia con fecha, motivo y descripción para que quede formalmente documentada. | Coder |
| M-05 | Como **coder**, quiero adjuntar un soporte (PDF o imagen) a mi justificación para poder aportar evidencia. | Coder |
| M-06 | Como **coder**, quiero ver el estado de cada una de mis solicitudes (Pendiente / En revisión / Aprobada / Rechazada) para saber en qué va mi trámite. | Coder |
| M-07 | Como **coder**, quiero ver el historial completo de mis solicitudes para poder revisar justificaciones anteriores. | Coder |
| M-08 | Como **admin**, quiero ver un listado de todas las solicitudes enviadas para poder revisarlas. | Admin |
| M-09 | Como **admin**, quiero abrir el soporte adjunto de una solicitud para poder validar la evidencia. | Admin |
| M-10 | Como **admin**, quiero aprobar o rechazar una solicitud para resolver oficialmente la inasistencia del coder. | Admin |
| M-11 | Como **admin**, quiero agregar una observación/comentario al aprobar o rechazar para que el coder entienda la decisión. | Admin |
| M-12 | Como **admin**, quiero un dashboard con total de solicitudes, pendientes, aprobadas y rechazadas para tener una visión general de la actividad. | Admin |
| M-13 | Como **sistema**, las solicitudes y usuarios deben persistir en un almacenamiento (no solo en memoria) para que los datos sobrevivan entre sesiones. | Datos |
| M-14 | Como **usuario**, quiero control de acceso por rol para que cada rol solo vea las pantallas y acciones que le corresponden. | Auth / Permisos |

---

## 4. Should Have (Debería tener)

Importante para una buena experiencia, pero el MVP funciona sin esto.

| ID | Historia de Usuario | Módulo |
|---|---|---|
| S-01 | Como **admin**, quiero ver las ausencias agrupadas por mes para identificar patrones estacionales. | Dashboard admin |
| S-02 | Como **admin**, quiero ver los motivos de ausencia más frecuentes para detectar problemas recurrentes. | Dashboard admin |
| S-03 | Como **admin**, quiero ver los coders con más ausencias para identificar estudiantes que puedan necesitar apoyo. | Dashboard admin |
| S-04 | Como **admin**, quiero marcar una solicitud como "En revisión" (separado de Pendiente/Aprobada/Rechazada) para señalar que la estoy trabajando activamente. | Admin |
| S-05 | Como **admin**, quiero crear cuentas de usuario nuevas (coder, team leader, admin) directamente desde el panel administrativo para no depender del autoregistro. | Gestión de usuarios |
| S-06 | Como **admin**, quiero crear y listar sedes para poder organizar las solicitudes por ubicación. | Sedes |
| S-07 | Como **admin**, quiero crear y listar programas de formación para poder organizar las solicitudes por programa. | Programas |
| S-08 | Como **coder**, quiero mensajes de error claros y específicos cuando algo falla (ej: servidor no disponible) para entender qué salió mal. | UX / Confiabilidad |
| S-09 | Como **usuario**, quiero que el formulario de login/registro valide los campos obligatorios antes de enviar para evitar errores innecesarios. | Auth |

---

## 5. Could Have (Podría tener)

Mejoras deseables, de menor urgencia — buenos candidatos para una segunda iteración.

| ID | Historia de Usuario | Módulo |
|---|---|---|
| C-01 | Como **team leader**, quiero un dashboard de solo lectura para consultar el estado de asistencia de mis estudiantes asignados, para hacer seguimiento sin poder de decisión. | Team Leader |
| C-02 | Como **admin**, quiero editar o eliminar sedes y programas existentes para poder corregir errores. | Sedes / Programas |
| C-03 | Como **admin**, quiero editar los datos de un usuario (nombre, rol, sede) después de creado para mantener los registros correctos. | Gestión de usuarios |
| C-04 | Como **coder**, quiero filtrar/buscar en mi historial de solicitudes por estado o fecha para encontrar una solicitud específica más rápido. | Coder |
| C-05 | Como **admin**, quiero filtrar la tabla de solicitudes por estado, sede o programa para enfocar mi carga de revisión. | Admin |
| C-06 | Como **admin**, quiero exportar el listado de solicitudes (CSV/Excel) para poder compartir reportes fuera del sistema. | Reportes |
| C-07 | Como **usuario**, quiero recuperar mi contraseña si la olvido para no quedar bloqueado permanentemente. | Auth |
| C-08 | Como **coder**, quiero recibir una notificación (en la app o por correo) cuando cambie el estado de mi solicitud para no tener que revisar manualmente. | Notificaciones |

---

## 6. Won't Have (No tendrá por ahora)

Explícitamente aplazado — documentado para manejar expectativas, no porque no importe.

| ID | Ítem | Motivo |
|---|---|---|
| W-01 | Almacenamiento/subida real de archivos adjuntos (hoy solo se guarda el nombre del archivo, no el binario) | Requiere un backend de almacenamiento de archivos (ej: S3, servicio de subida dedicado); fuera de alcance para un MVP basado en `json-server`. |
| W-02 | Autenticación real en backend (contraseñas hasheadas, tokens JWT/sesión, autorización del lado del servidor) | El control de acceso actual vive completamente en el frontend, coherente con el backend simulado (`json-server`) usado para el MVP. |
| W-03 | Soporte multi-idioma (i18n) | No es un requisito actual; la interfaz es en español por diseño por ahora. |
| W-04 | Aplicación móvil nativa | Alcance solo web para esta entrega; la web responsiva es suficiente por ahora. |
| W-05 | Notificaciones automáticas por correo/SMS | Depende de un servicio de notificaciones externo aún no integrado. |
| W-06 | Analítica avanzada (predicción de riesgo de deserción, pronóstico de tendencias) | Valioso a largo plazo, pero requiere un dataset más grande y un esfuerzo de analítica dedicado más allá del MVP. |

---

## 7. Orden de entrega sugerido

1. **Sprint 1 (Must Have):** Auth (login/registro/sesión), módulo Coder (crear + historial), módulo Admin (listado + aprobar/rechazar + dashboard básico).
2. **Sprint 2 (Should Have):** Desglose del dashboard (por mes, por motivo, por coder), gestión de usuarios/sedes/programas, mejor manejo de errores.
3. **Sprint 3 (Could Have):** Vista del Team Leader, editar/eliminar catálogos, filtros, exportaciones, recuperación de contraseña.
4. **Backlog / Futuro:** Ítems bajo "Won't Have" — se retoman una vez haya un backend real y almacenamiento de archivos.
