// services/programas.service.js — Gestión de programas desde el módulo administrativo
import { http } from "@api/http";

export const getProgramas = () => http.get("/programas");
export const createPrograma = (data) => http.post("/programas", data);
export const deletePrograma = (id) => http.delete(`/programas/${id}`);
