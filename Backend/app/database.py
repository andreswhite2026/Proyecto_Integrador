import psycopg2
from psycopg2.extras import RealDictCursor

# Configuren las credenciales de su base de datos local de Postgres
DB_CONFIG = {
    "host": "localhost",
    "database": "AfkCoders",
    "user": "postgres",
    "password": "postgres",
    "port": "5433"
}

def get_db_connection():
    # Usamos RealDictCursor para que Postgres devuelva los datos como diccionarios estructurados
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    return conn
