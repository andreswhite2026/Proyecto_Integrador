from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, solicitudes

app = FastAPI(title="AfkCoders API")

# Permite que el Frontend en JS se conecte al Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión modular con APIRouter
app.include_router(auth.router)
app.include_router(solicitudes.router)
