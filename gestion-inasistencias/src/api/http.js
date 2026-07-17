// api/http.js — Cliente HTTP base para comunicarse con json-server
// Todas las peticiones a la API pasan por aquí

const API_URL = "http://localhost:3000";

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} en ${endpoint} — ${bodyText || "sin detalle"}`);
    }

    // DELETE puede no devolver contenido
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    // TypeError "Failed to fetch" = json-server no está corriendo, puerto equivocado, o bloqueado por el navegador
    if (error instanceof TypeError) {
      console.error(`[http] No se pudo conectar a ${API_URL}${endpoint}. ¿Está json-server corriendo en el puerto 3000?`, error);
      throw new Error(`No se pudo conectar con el servidor (${API_URL}). Verifica que json-server esté corriendo.`);
    }
    console.error("[http] Error en la petición:", error);
    throw error;
  }
};

export const http = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
