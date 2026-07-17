# Gestión de Inasistencias Justificadas · Riwi

MVP de interfaz (login + módulo del coder + módulo de Habilidades Socioemocionales/admin).
Construido con **Vite + Vanilla JS + TailwindCSS v4**, siguiendo la misma arquitectura del
sistema de reservas: MVC por carpetas (`views`, `controllers`, `services`, `components`),
enrutamiento por History API con guards de rol, y `json-server` como backend simulado.

## Cómo correrlo

```bash
npm install
npm run dev
```

Esto levanta al mismo tiempo:
- El cliente Vite en `http://localhost:5173`
- `json-server` en `http://localhost:3000` (usa `db.json`)

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Coder | juan.coder@riwi.io | Coder123* |
| Coder | maria.coder@riwi.io | Coder123* |
| Habilidades Socioemocionales (admin) | soc@riwi.io | Socio123* |
| Team Leader (aún sin vista propia) | team.leader@riwi.io | Leader123* |

## Qué incluye esta primera entrega

- **Login / Registro** en tabs: puedes iniciar sesión o crear una cuenta nueva eligiendo
  el tipo (Coder o Habilidades Socioemocionales). El registro valida que el correo no
  exista, guarda al usuario en `db.json` (vía `json-server`) y abre sesión automáticamente
  con el rol elegido. Al cerrar sesión, el usuario puede volver a entrar cuando quiera con
  su correo y contraseña, ya que queda guardado de forma persistente en `db.json`.
- **Módulo del coder**: formulario para registrar una inasistencia (fecha, motivo,
  descripción, adjuntar soporte) + historial de "Mis solicitudes" con su estado
  (Pendiente / En revisión / Aprobada / Rechazada) y observaciones cuando aplica.
- **Módulo administrativo (Habilidades Socioemocionales)**: dashboard con tarjetas de
  estadísticas (total, pendientes, en revisión, aprobadas, rechazadas), ausencias por
  mes, motivos más frecuentes, coders con más ausencias, y una tabla de solicitudes con
  un modal para abrir el soporte, marcar en revisión, aprobar o rechazar dejando
  observaciones.
- Espacios reservados en el sidebar del admin para **Gestión de usuarios, Sedes y
  Programas** (marcados como "Próximamente"): la interfaz ya tiene el lugar listo para
  cuando conectemos esa funcionalidad.

## Pendiente para siguientes iteraciones

- Vista propia del Team Leader (solo consulta, sin permisos de decisión).
- CRUD real de usuarios, sedes y programas para el admin.
- Subida real de archivos (hoy solo se guarda el nombre del archivo seleccionado,
  ya que `json-server` no almacena binarios).
- Validaciones más robustas y manejo de permisos en el backend (hoy todo el control
  de acceso vive en el frontend, como en el proyecto de reservas).
