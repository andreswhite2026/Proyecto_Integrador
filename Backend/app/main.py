from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from .database import get_db_connection

app = FastAPI(title="AfkCoders API")

# IMPORTANTE: Permite que el Frontend en JS se conecte al Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de validación para recibir las excusas del Coder
class SolicitudInasistencia(BaseModel):
    coder_id: int
    categoria_id: int
    fecha_ausencia: str  # Formato "YYYY-MM-DD"
    motivo_detallado: str
    url_soporte: str

@app.post("/api/solicitudes")
def crear_solicitud(solicitud: SolicitudInasistencia):
    # Logica de los 5 dias
    fecha_ausencia = datetime.strptime(solicitud.fecha_ausencia, "%Y-%m-%d").date()
    hoy = datetime.now().date()
    limite = hoy - timedelta(days=5)
    
    if fecha_ausencia < limite:
        raise HTTPException(status_code=400, detail="No puedes registrar ausencias con más de 5 días de antigüedad.")
    if fecha_ausencia > hoy:
        raise HTTPException(status_code=400, detail="No puedes registrar ausencias en fechas futuras.")
        
    # Persistencia en Postgres
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO solicitudes_inasistencia 
               (coder_id, categoria_id, fecha_ausencia, motivo_detallado, url_soporte) 
               VALUES (%s, %s, %s, %s, %s) RETURNING id;""",
            (solicitud.coder_id, solicitud.categoria_id, fecha_ausencia, solicitud.motivo_detallado, solicitud.url_soporte)
        )
        nuevo_id = cur.fetchone()["id"]
        conn.commit()
        cur.close()
        conn.close()
        return {"mensaje": "Solicitud creada", "id": nuevo_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el servidor: {str(e)}")


#endpoint para listar las solicitudes

@app.get("/api/admin/solicitudes")
def obtener_todas_las_solicitudes():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        # Trae la información uniendo las tablas para ver el nombre del coder y la categoría (codigo sql)
        cur.execute(
            """SELECT s.id, u.nombre AS coder_name, c.nombre AS categoria, 
                      s.fecha_ausencia, s.motivo_detallado, s.url_soporte, s.estado, s.observaciones
               FROM solicitudes_inasistencia s
               JOIN usuarios u ON s.coder_id = u.id
               JOIN categorias_justificacion c ON s.categoria_id = c.id
               ORDER BY s.fecha_creacion DESC;"""
        )
        solicitudes = cur.fetchall()
        cur.close()
        conn.close()
        return solicitudes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener solicitudes: {str(e)}")

#endpoint para procesar las solicitudes

class ProcesarSolicitud(BaseModel):
    estado: str # 'Aprobada' o 'Rechazada'
    observaciones_socioemocional: str
    revisado_por: int # ID del TL que revisa

@app.put("/api/admin/solicitudes/{solicitud_id}")
def procesar_solicitud(solicitud_id: int, datos: ProcesarSolicitud):
    if datos.estado not in ['Aprobada', 'Rechazada']:
        raise HTTPException(status_code=400, detail="Estado no válido. Debe ser 'Aprobada' o 'Rechazada'.")
        
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """UPDATE solicitudes_inasistencia 
               SET estado = %s, 
                   observaciones_socioemocional = %s, 
                   fecha_revision = NOW(), 
                   revisado_por = %s
               WHERE id = %s RETURNING id;""",
            (datos.estado, datos.observaciones_socioemocional, datos.revisado_por, solicitud_id)
        )
        resultado = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not resultado:
            raise HTTPException(status_code=404, detail="Solicitud no encontrada.")
            
        return {"mensaje": f"Solicitud {datos.estado.lower()} con éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar solicitud: {str(e)}")

