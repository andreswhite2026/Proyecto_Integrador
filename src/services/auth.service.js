// services/auth.service.js — Lógica de autenticación y registro contra json-server
//
// Traemos todos los usuarios y filtramos en el cliente en vez de usar
// "/users?email=..." para evitar el bug de filtros por query de json-server 1.0-beta
// (ver nota en solicitudes.service.js).

import { http } from "@api/http";
import { getUsers } from "@services/users.service.js";

// Busca un usuario por su correo (login se valida contraseña en el cliente)
export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return users.filter((u) => u.email.toLowerCase() === email.toLowerCase());
};

// Crea un usuario nuevo (registro de coder o de Habilidades Socioemocionales)
export const registerUser = (userData) => http.post("/users", userData);
