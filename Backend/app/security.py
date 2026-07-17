import os
from datetime import datetime, timedelta
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from dotenv import load_dotenv

# Cargar las variables secretas del archivo .env
load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")

# Configurar el contexto de encriptación para las contraseñas de los usuarios
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_bearer = HTTPBearer()

# GESTIÓN DE CONTRASEÑAS

def encriptar_contrasena(password: str) -> str:
    """Recibe la contraseña en texto plano y devuelve el hash encriptado."""
    return pwd_context.hash(password)

def verificar_contrasena(password_plana: str, password_encriptada: str) -> bool:
    """Compara una contraseña ingresada con el hash guardado en Postgres."""
    return pwd_context.verify(password_plana, password_encriptada)

# GESTIÓN DE TOKENS JWT

def crear_token_acceso(data: dict, expires_delta: timedelta = timedelta(hours=8)):
    """Genera un token JWT firmado con un tiempo de expiración (por defecto 8 horas)."""
    para_encriptar = data.copy()
    expiracion = datetime.utcnow() + expires_delta
    para_encriptar.update({"exp": expiracion})
    return jwt.encode(para_encriptar, SECRET_KEY, algorithm=ALGORITHM)

# DEPENDENCIAS DE SEGURIDAD Y ROLES

def obtener_usuario_actual(credentials: HTTPAuthorizationCredentials = Security(security_bearer)) -> dict:
    """
    Inyección de dependencia que extrae el token de la cabecera HTTP (Bearer),
    lo decodifica y valida que no esté expirado ni alterado.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Retorna el diccionario con {"user_id": X, "rol": "X", "email": "X"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="El token de seguridad ha expirado.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido o mal estructurado.")

class VerificarRol:
    """
    Clase validadora de Roles de Usuario. 
    Bloquea las peticiones si el usuario autenticado no cumple con los roles listados.
    """
    def __init__(self, roles_permitidos: list[str]):
        self.roles_permitidos = roles_permitidos

    def __call__(self, usuario_actual: dict = Security(obtener_usuario_actual)):
        if usuario_actual.get("rol") not in self.roles_permitidos:
            raise HTTPException(
                status_code=403, 
                detail="No tienes los permisos de rol requeridos para realizar esta acción."
            )
        return usuario_actual
