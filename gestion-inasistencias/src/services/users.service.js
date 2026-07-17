// services/users.service.js — Gestión de usuarios desde el módulo administrativo
import { http } from "@api/http";

export const getUsers = () => http.get("/users");
export const createUser = (data) => http.post("/users", data);
export const updateUser = (id, data) => http.patch(`/users/${id}`, data);
export const deleteUser = (id) => http.delete(`/users/${id}`);
