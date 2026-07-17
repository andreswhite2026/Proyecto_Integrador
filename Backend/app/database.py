import os
from psycopg2.extras import RealDictCursor
import psycopg2
# Asegúrate de que diga "load_dotenv" y NO "load_data"
from dotenv import load_dotenv

# Carga las variables del archivo .env que acabas de crear
load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "port": os.getenv("DB_PORT")
}

def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    return conn
