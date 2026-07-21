from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import get_db_connection
from app.security import VerificarRol

router = APIRouter(prefix="/api/admin", tags=["Clanes"])

class ClanSchema(BaseModel):
    nombre: str

# 1. Listar todos los clanes (Accesible por el Administrador/TL)
@router.get("/clanes", dependencies=[Depends(VerificarRol(["Habilidades Socioemocionales"]))])
def listar_clanes():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, nombre, fecha_creacion FROM clanes ORDER BY id ASC;")
        clanes = cur.fetchall()
        cur.close()
        conn.close()
        return clanes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener clanes: {str(e)}")

# 2. Crear un nuevo clan
@router.post("/clanes", dependencies=[Depends(VerificarRol(["Habilidades Socioemocionales"]))])
def crear_clan(clan: ClanSchema):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Validar si el nombre del clan ya existe para evitar duplicados
        cur.execute("SELECT id FROM clanes WHERE nombre = %s;", (clan.nombre,))
        if cur.fetchone():
            cur.close()
            conn.close()
            raise HTTPException(status_code=400, detail="El nombre del clan ya está registrado.")
            
        cur.execute("INSERT INTO clanes (nombre) VALUES (%s) RETURNING id;", (clan.nombre,))
        nuevo_id = cur.fetchone()["id"]
        conn.commit()
        cur.close()
        conn.close()
        return {"mensaje": "Clan creado exitosamente", "id": nuevo_id}
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Error al crear clan: {str(e)}")

# 3. Actualizar un clan existente
@router.put("/clanes/{clan_id}", dependencies=[Depends(VerificarRol(["Habilidades Socioemocionales"]))])
def actualizar_clan(clan_id: int, clan: ClanSchema):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE clanes SET nombre = %s WHERE id = %s RETURNING id;",
            (clan.nombre, clan_id)
        )
        resultado = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not resultado:
            raise HTTPException(status_code=404, detail="Clan no encontrado.")
            
        return {"mensaje": f"Clan {clan_id} actualizado con éxito"}
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Error al actualizar clan: {str(e)}")

# 4. Eliminar un clan
@router.delete("/clanes/{clan_id}", dependencies=[Depends(VerificarRol(["Habilidades Socioemocionales"]))])
def eliminar_clan(clan_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM clanes WHERE id = %s RETURNING id;", (clan_id,))
        resultado = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not resultado:
            raise HTTPException(status_code=404, detail="Clan no encontrado.")
            
        return {"mensaje": f"Clan {clan_id} eliminado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar clan: {str(e)}")
