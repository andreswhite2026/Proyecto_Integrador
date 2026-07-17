from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timedelta
from app.database import get_db_connection
from app.security import obtener_usuario_actual, VerificarRol

router = APIRouter(prefix="/api", tags=["Solicitudes"])

class SolicitudInasistencia(BaseModel):
    categoria_id: int
    fecha_ausencia: str
    motivo_detallado: str
    url_soporte: str

class ProcesarSolicitud(BaseModel):
    estado: str
    observaciones_socioemocional: str

# 1. Crear Solicitud (Solo lo hace el rol coder)
@router.post("/solicitudes", dependencies=[Depends(VerificarRol(["Coder"]))])
def crear_solicitud(solicitud: SolicitudInasistencia, usuario_actual: dict = Depends(obtener_usuario_actual)):
    fecha_ausencia = datetime.strptime(solicitud.fecha_ausencia, "%Y-%m-%d").date()
    hoy = datetime.now().date()
    limite = hoy - timedelta(days=5)
    
    if fecha_ausencia < limite:
        raise HTTPException(status_code=400, detail="No puedes registrar ausencias con más de 5 días de antigüedad.")
    if fecha_ausencia > hoy:
        raise HTTPException(status_code=400, detail="No puedes registrar ausencias en fechas futuras.")
        
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO solicitudes_inasistencia 
               (coder_id, categoria_id, fecha_ausencia, motivo_detallado, url_soporte) 
               VALUES (%s, %s, %s, %s, %s) RETURNING id;""",
            (usuario_actual["user_id"], solicitud.categoria_id, fecha_ausencia, solicitud.motivo_detallado, solicitud.url_soporte)
        )
        nuevo_id = cur.fetchone()["id"]
        conn.commit()
        cur.close()
        conn.close()
        return {"mensaje": "Solicitud creada exitosamente", "id": nuevo_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el servidor: {str(e)}")

# 2. listar Solicitudes Solo permitido para Habilidades Socioemocionales (TL)
@router.get("/admin/solicitudes", dependencies=[Depends(VerificarRol(["Habilidades Socioemocionales"]))])
def obtener_todas_las_solicitudes():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
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

# 3. Procesar Solicitud (Solo permitido para Habilidades Socioemocionales
@router.put("/admin/solicitudes/{solicitud_id}", dependencies=[Depends(VerificarRol(["Habilidades Socioemocionales"]))])
def procesar_solicitud(solicitud_id: int, datos: ProcesarSolicitud, usuario_actual: dict = Depends(obtener_usuario_actual)):
    if datos.estado not in ['Aprobada', 'Rechazada']:
        raise HTTPException(status_code=400, detail="Estado no válido. Debe ser 'Aprobada' o 'Rechazada'.")
        
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """UPDATE solicitudes_inasistencia 
               SET estado = %s, 
                   observaciones = %s, 
                   fecha_revision = NOW(), 
                   revisado_por = %s
               WHERE id = %s RETURNING id;""",
            (datos.estado, datos.observaciones, usuario_actual["user_id"], solicitud_id)
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
