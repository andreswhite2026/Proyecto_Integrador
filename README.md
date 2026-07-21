# AFKCoders API · Riwi Backend

Backend para el sistema de Gestión de Inasistencias Justificadas. Construido con **FastAPI**, validación de datos mediante **Pydantic**, soporte de CORS para integración con el frontend de Vanilla JS, y persistencia de datos relacional en **PostgreSQL**.

El sistema cuenta con una arquitectura modularizada mediante routers y un sistema de seguridad basado en tokens **JWT** con control de accesos por rol (**RBAC**).

## Requisitos previos

* Python 3.10 o superior.
* Servidor PostgreSQL activo en el puerto `5433` (u otro configurado en el entorno).

## Configuración del Entorno y Base de Datos

1. Crea un archivo llamado `.env` en la **raíz de la carpeta Backend** (al mismo nivel que la carpeta `app/`) para mapear tus credenciales locales de forma segura:

```env
DB_HOST=localhost
DB_NAME=AfkCoders
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5433

JWT_SECRET=riwi_afk
JWT_ALGORITHM=HS256
```

2. El archivo `app/database.py` utiliza `RealDictCursor` de `psycopg2` para cargar de forma segura estas variables y retornar todas las consultas SQL directamente estructuradas en formato JSON nativo (clave-valor).

## Cómo correrlo

Para evitar conflictos globales en tu sistema operativo Linux, el backend se ejecuta de forma aislada dentro de un entorno virtual (`venv`):

1. **Crear el entorno virtual** (Solo la primera vez):
   ```bash
   python3 -m venv .venv
   ```

2. **Activar el entorno virtual**:
   ```bash
   source .venv/bin/activate
   ```
   *(Verás el prefijo `(.venv)` al inicio de tu línea de comandos en la terminal).*

3. **Instalar todas las dependencias**:
   ```bash
   pip install fastapi uvicorn pydantic psycopg2-binary python-dotenv PyJWT passlib[bcrypt] "pydantic[email]"
   ```

4. **Levantar el servidor de desarrollo**:
   ```bash
   uvicorn app.main:app --reload
   ```

* **Servidor local:** El backend estará disponible en `http://localhost:8000`
* **Documentación Interactiva (Swagger UI):** Accede a `http://localhost:8000/docs` para visualizar y probar todos los flujos utilizando el botón superior derecho **"Authorize"** con el candado de seguridad.

## Endpoints de la API

### 1. Módulo de Autenticación (`/api/auth`)

* **`POST /api/auth/register`**: Registra un nuevo usuario en PostgreSQL. Valida el formato del correo mediante `EmailStr` y guarda la contraseña encriptada de forma segura usando **Bcrypt**.
* **`POST /api/auth/login`**: Valida las credenciales ingresadas. Si son correctas, genera y devuelve un token firmado **JWT** con una vigencia de 8 horas.

---

### 2. Módulo del Coder (Solicitudes)

* **`POST /api/solicitudes`**: Recibe y procesa las excusas o justificaciones enviadas por los Coders.
  * **Seguridad requerida:** Requiere una cabecera HTTP `Authorization: Bearer <token>` y que el usuario autenticado posea estrictamente el rol `'Coder'`.
  * *Nota: El sistema extrae automáticamente el `user_id` desde el token interno del JWT para guardarlo en la base de datos de Postgres.*

**Estructura del JSON enviado (Request Body):**
```json
{
  "categoria_id": 2,
  "fecha_ausencia": "YYYY-MM-DD",
  "motivo_detallado": "Descripción del motivo de la inasistencia",
  "url_soporte": "https://enlace-al-documento.com"
}
```

---

### 3. Módulo Administrativo (Habilidades Socioemocionales / Admin)

Ambas rutas requieren autenticación JWT en las cabeceras y control estricto de rol. Bloquean con error `403 Forbidden` a cualquier usuario con rol diferente de `'Habilidades Socioemocionales'`.

* **`GET /api/admin/solicitudes`**: Recupera el listado completo de solicitudes ordenadas por fecha de creación descendente. Ejecuta un `JOIN` relacional automático para incluir el nombre del coder (`coder_name`) y el nombre de la categoría de justificación (`categoria`).

* **`PUT /api/admin/solicitudes/{solicitud_id}`**: Actualiza el estado de una inasistencia (Aprobación o Rechazo). Asigna el ID del administrador que hizo la revisión mediante la decodificación del token.

**Estructura del JSON enviado (Request Body):**
```json
{
  "estado": "Aprobada", 
  "observaciones_socioemocional": "Soporte médico válido y verificado."
}
```
> **Nota:** El campo `estado` valida de forma estricta en el backend que los valores recibidos coincidan únicamente con las cadenas de texto `'Aprobada'` o `'Rechazada'`.

## Estructura del proyecto (`Backend/app`)

```
Backend/
├── .env                  # Variables de entorno secretas (Base de datos y JWT)
├── .venv/                # Entorno virtual aislado de Python
└── app/
    ├── main.py           # Inicialización de la app, CORS e inclusión de routers
    ├── database.py       # Configuración y provisión de conexiones a Postgres con RealDictCursor
    ├── security.py       # Funciones de hashing Bcrypt, firmado JWT e inyección de dependencias por Rol
    └── routers/
        ├── auth.py       # Controladores modulares para login y registro de usuarios
        └── solicitudes.py # Controladores modulares para la creación y gestión de inasistencias
```

## Pendiente para siguientes iteraciones

* Integración de almacenamiento de archivos en la nube (ej. AWS S3) para procesar los adjuntos binarios reales (`UploadFile`) en lugar de strings de URLs fijas.
* Conexión completa de los scripts `fetch` del cliente Frontend en Vanilla JS.


🔑 Cuentas de Prueba Registradas
1. Rol: Habilidades Socioemocionales (Administrador / TL)
Email: nuevoadmin@example.com
Password: adminpassword123
Nota: Este es el usuario que sirve para usar los métodos GET, PUT y DELETE.

2. Rol: Coder (Alumno)
Email: coder_test@example.com
Password: coderpassword123
Nota: Este usuario lo usamos para crear inasistencias en el método POST.


💡 Recordatorio de uso rápido en Swagger 
Ejecutar el endpoint POST /api/auth/login con cualquiera de las dos cuentas de arriba según lo que se quiera probar
Copia todo el texto largo del "access_token".
Haz clic en el candado verde Authorize arriba del todo, pega el token en el campo Value y presiona Authorize.





## 🛡️ Módulo de Clanes (Administración)

Este módulo permite gestionar de forma completa los Clanes de la plataforma. Por motivos de seguridad y consistencia en los reportes, **todas las rutas de este módulo están protegidas** y solo pueden ser ejecutadas por usuarios autenticados con el rol de `Habilidades Socioemocionales` (TL / Administrador).

### 🛣️ Endpoints Disponibles

| Método | Endpoint | Descripción | Rol Requerido |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/clanes` | Listar todos los clanes registrados en el sistema. | Habilidades Socioemocionales |
| `POST` | `/api/admin/clanes` | Registrar un nuevo clan (Valida duplicados). | Habilidades Socioemocionales |
| `PUT` | `/api/admin/clanes/{clan_id}` | Actualizar el nombre de un clan existente mediante su ID. | Habilidades Socioemocionales |
| `DELETE` | `/api/admin/clanes/{clan_id}` | Eliminar un clan de forma definitiva mediante su ID. | Habilidades Socioemocionales |

---

### 📋 Ejemplos de Uso (Estructura de Datos)

#### 1. Estructura de Respuesta para Lectura (`GET`)
Cuando el administrador solicita la lista de clanes, el servidor retorna un arreglo de objetos con la siguiente estructura directa de PostgreSQL:
```json
[
  {
    "id": 1,
    "nombre": "Clan Magdalena",
    "fecha_creacion": "2026-07-21T15:30:00"
  },
  {
    "id": 2,
    "nombre": "Clan Esthercita",
    "fecha_creacion": "2026-07-21T15:30:00"
  }
]
```

#### 2. Estructura de Petición para Creación y Edición (`POST` / `PUT`)
Para registrar o actualizar un clan, se debe enviar obligatoriamente un JSON en el cuerpo de la solicitud (`Request Body`) con el siguiente formato:
```json
{
  "nombre": "Clan Cayena"
}
```

#### 3. Respuestas de Éxito comunes
* **Creación exitosa (`200 OK`):** `{"mensaje": "Clan creado exitosamente", "id": 7}`
* **Actualización exitosa (`200 OK`):** `{"mensaje": "Clan 7 actualizado con éxito"}`
* **Eliminación exitosa (`200 OK`):** `{"mensaje": "Clan 7 eliminado exitosamente"}`

---

### ⚠️ Respuestas de Error Controladas

* **`401 Unauthorized` (`"Not authenticated"`):** Se genera si no se envía el `access_token` JWT en las cabeceras de la petición (`Authorization: Bearer <token>`).
* **`403 Forbidden` (`"No tienes los permisos de rol requeridos..."`):** Se genera de inmediato si un usuario con rol de `Coder` intenta alterar o consultar la configuración de los clanes.
* **`400 Bad Request` (`"El nombre del clan ya está registrado."`):** Control de duplicados en el backend que evita colisiones de nombres únicos en la base de datos.
* **`404 Not Found` (`"Clan no encontrado."`):** Se arroja en peticiones `PUT` o `DELETE` si el `clan_id` enviado en la ruta no existe en la tabla de PostgreSQL.
