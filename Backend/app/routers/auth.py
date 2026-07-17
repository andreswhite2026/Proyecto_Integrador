from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database import get_db_connection
from app.security import encriptar_contrasena, verificar_contrasena, crear_token_acceso

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

class RegistroUsuario(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    rol: str # 'Coder' o 'Habilidades Socioemocionales (TL)'

class LoginUsuario(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def registrar(usuario: RegistroUsuario):
    if usuario.rol not in ['Coder', 'Habilidades Socioemocionales']:
        raise HTTPException(status_code=400, detail="Rol no permitido.")
        
    hash_password = encriptar_contrasena(usuario.password)
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Valida si el correo ya existe en Postgres
        cur.execute("SELECT id FROM usuarios WHERE email = %s;", (usuario.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="El correo ya está registrado.")
            
        cur.execute(
            "INSERT INTO usuarios (nombre, email, password, rol) VALUES (%s, %s, %s, %s) RETURNING id;",
            (usuario.nombre, usuario.email, hash_password, usuario.rol)
        )
        nuevo_id = cur.fetchone()["id"]
        conn.commit()
        cur.close()
        conn.close()
        
        token = crear_token_acceso({"user_id": nuevo_id, "rol": usuario.rol, "email": usuario.email})
        return {"access_token": token, "token_type": "bearer", "rol": usuario.rol}
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Error en registro: {str(e)}")

@router.post("/login")
def login(credenciales: LoginUsuario):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, password, rol FROM usuarios WHERE email = %s;", (credenciales.email,))
        usuario = cur.fetchone()
        cur.close()
        conn.close()
        
        if not usuario or not verificar_contrasena(credenciales.password, usuario["password"]):
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos.")
            
        token = crear_token_acceso({"user_id": usuario["id"], "rol": usuario["rol"], "email": credenciales.email})
        return {"access_token": token, "token_type": "bearer", "rol": usuario["rol"]}
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Error en login: {str(e)}")
