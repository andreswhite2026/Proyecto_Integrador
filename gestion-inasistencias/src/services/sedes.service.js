// services/sedes.service.js — Gestión de sedes desde el módulo administrativo
import { http } from "@api/http";

export const getSedes = () => http.get("/sedes");
export const createSede = (data) => http.post("/sedes", data);
export const deleteSede = (id) => http.delete(`/sedes/${id}`);
