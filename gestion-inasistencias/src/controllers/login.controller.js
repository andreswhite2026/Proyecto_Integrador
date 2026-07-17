// controllers/login.controller.js — Lógica del formulario de login

import { saveSession } from "@utils/index.js";
import { navigateTo } from "@router/router.js";
import { getUserByEmail } from "@services/auth.service.js";

const HOME_BY_ROLE = {
  coder: "/coder",
  admin: "/admin",
  team_leader: "/coder",
};

export const loginController = () => {
  const form = document.querySelector("#loginForm");
  const error = document.querySelector("#loginError");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      showError("Por favor completa todos los campos.");
      return;
    }

    try {
      const users = await getUserByEmail(email);

      if (!users.length) {
        showError("Correo o contraseña incorrectos.");
        return;
      }

      const user = users[0];

      if (user.password !== password) {
        showError("Correo o contraseña incorrectos.");
        return;
      }

      saveSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clan: user.clan,
      });

      navigateTo(HOME_BY_ROLE[user.role] || "/login");
    } catch (err) {
      console.error("[loginController]", err);
      showError("Error al conectar con el servidor. ¿Está corriendo json-server?");
    }
  });

  function showError(msg) {
    error.textContent = msg;
    error.classList.remove("hidden");
  }
};
