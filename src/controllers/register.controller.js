// controllers/register.controller.js — Lógica del formulario de registro
// Crea coders o cuentas de Habilidades Socioemocionales (admin) en json-server

import { getUserByEmail, registerUser } from "@services/auth.service.js";
import { saveSession } from "@utils/index.js";
import { navigateTo } from "@router/router.js";

const HOME_BY_ROLE = {
  coder: "/coder",
  admin: "/admin",
  team_leader: "/coder",
};

export const registerController = () => {
  const form = document.querySelector("#registerForm");
  const message = document.querySelector("#registerMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const role = form.role.value;
    const clan = form.clan.value.trim();

    if (!name || !email || !password) {
      showMessage("Completa todos los campos.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    if (role === "coder" && !clan) {
      showMessage("Indica el clan del coder.", "error");
      return;
    }

    try {
      const existing = await getUserByEmail(email);
      if (existing.length > 0) {
        showMessage("Ese correo ya está registrado.", "error");
        return;
      }

      const newUser = await registerUser({
        name,
        email,
        password,
        role,
        clan: role === "coder" ? clan : "",
      });

      // Inicia sesión automáticamente con la cuenta recién creada
      saveSession({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        clan: newUser.clan,
      });

      navigateTo(HOME_BY_ROLE[newUser.role] || "/login");
    } catch (err) {
      console.error("[registerController]", err);
      showMessage("Error al registrar. ¿Está corriendo json-server?", "error");
    }
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `text-sm mb-4 ${type === "error" ? "text-rose-500" : "text-emerald-600"}`;
    message.classList.remove("hidden");
  }
};
