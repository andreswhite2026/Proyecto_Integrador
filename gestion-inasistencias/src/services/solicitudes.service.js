// services/solicitudes.service.js — Acceso a la colección "solicitudes" en json-server
//
// NOTA IMPORTANTE: esta versión de json-server (1.0.0-beta) tiene un bug con los
// filtros por query string cuando el valor es un string "numérico" (ej: coderId=1),
// y con la combinación _sort + _order: en vez de fallar, devuelve un arreglo vacío
// silenciosamente. Por eso aquí traemos siempre la colección completa y filtramos /
// ordenamos del lado del cliente, evitando depender de esos query params.

import { http } from "@api/http";

// Todas las solicitudes, ordenadas de la más reciente a la más antigua
export const getSolicitudes = async () => {
  const solicitudes = await http.get("/solicitudes");
  return solicitudes.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
};

// Solo las solicitudes de un coder puntual (uso del módulo del coder)
export const getSolicitudesByCoder = async (coderId) => {
  const solicitudes = await getSolicitudes();
  return solicitudes.filter((s) => String(s.coderId) === String(coderId));
};

// Crear una nueva solicitud de inasistencia
export const createSolicitud = (data) => http.post("/solicitudes", data);

// Actualizar estado / observaciones de una solicitud (aprobar, rechazar, poner en revisión)
export const updateSolicitud = (id, data) => http.patch(`/solicitudes/${id}`, data);

// Catálogo de motivos disponibles para seleccionar
export const MOTIVOS = [
  "Cita médica (EPS / IPS)",
  "Calamidad doméstica",
  "Incapacidad médica",
  "Diligencia personal o legal",
  "Problema de transporte",
  "Fallecimiento de familiar",
  "Otro",
];
