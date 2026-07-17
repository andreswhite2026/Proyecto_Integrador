# Planificación del Proyecto - Scrum Backlog

## 1. Product Backlog y Priorización (Método MoSCoW)
Listado de historias de usuario priorizadas para cumplir con el Producto Mínimo Viable (MVP) y asignación de responsabilidades para evidenciar el seguimiento.

| ID | Historia de Usuario | Prioridad | Estado | Asignado a |
|----|---------------------|-----------|--------|------------|
| HU01 | Registro e Inicio de Sesión | Alta (Must) | Finalizado | Desarrollador A |
| HU02 | Visualización de Turnos Disponibles | Alta (Must) | Finalizado | Desarrollador B |
| HU03 | Reserva de Citas en Línea | Alta (Must) | En Progreso | Desarrollador C |
| HU04 | Cancelación de Citas | Media (Should)| Pendiente | Desarrollador A |

---

## 2. Detalle de Historias de Usuario (Sprint Backlog)

### HU01: Registro e Inicio de Sesión de Usuarios
**Como** paciente de la plataforma,  
**quiero** registrarme e iniciar sesión con mi correo y contraseña,  
**para** acceder a mi historial médico y gestionar mis citas de forma segura.

*   **Criterios de Aceptación:**
    *   **Escenario 1 (Registro exitoso):** Dado que el usuario ingresa un correo válido y una contraseña de más de 8 caracteres, cuando hace clic en "Registrarse", entonces el sistema crea la cuenta y lo redirige al panel principal.
    *   **Escenario 2 (Validación de campos):** Dado que el usuario deja campos vacíos o el correo no tiene formato válido (@), cuando intenta registrarse, entonces el sistema muestra un mensaje de error en rojo.

---

### HU02: Visualización de Turnos Disponibles
**Como** paciente registrado,  
**quiero** ver un calendario con los médicos y horarios disponibles,  
**para** seleccionar el que mejor se adapte a mi tiempo.

*   **Criterios de Aceptación:**
    *   **Escenario 1 (Filtro por especialidad):** Dado que el usuario selecciona una especialidad médica, cuando el sistema procesa la búsqueda, entonces solo se deben mostrar los médicos de esa área con sus horas libres.
    *   **Escenario 2 (Sin disponibilidad):** Dado que un médico no tiene horas libres en la fecha seleccionada, cuando el usuario abre su perfil, entonces el sistema debe mostrar un mensaje indicando "Sin turnos disponibles para esta fecha".

---

### HU03: Reserva de Citas en Línea
**Como** paciente autenticado,  
**quiero** confirmar la reserva del turno seleccionado,  
**para** asegurar mi atención médica en la fecha estipulada.

*   **Criterios de Aceptación:**
    *   **Escenario 1 (Confirmación de reserva):** Dado que el usuario selecciona una hora disponible, cuando hace clic en "Confirmar Cita", entonces el sistema bloquea ese horario y genera un código de confirmación en pantalla.
    *   **Escenario 2 (Control de concurrencia):** Dado que dos usuarios intentan reservar el mismo turno al mismo tiempo, cuando el primer usuario confirma la reserva, entonces el sistema debe rechazar el intento del segundo usuario y pedirle elegir otro horario.

---

### HU04: Cancelación de Citas
**Como** paciente con una cita programada,  
**quiero** cancelar mi turno desde mi panel de usuario,  
**para** liberar el horario para otro paciente si no puedo asistir.

*   **Criterios de Aceptación:**
    *   **Escenario 1 (Cancelación exitosa):** Dado que el usuario tiene una cita activa, cuando presiona el botón "Cancelar Cita" y confirma la acción, entonces el estado de la cita cambia a "Cancelado" y el horario vuelve a estar disponible en el sistema.
