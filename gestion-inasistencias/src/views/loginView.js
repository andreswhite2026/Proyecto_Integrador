// views/loginView.js — Pantalla de acceso: iniciar sesión o registrarse
// El registro permite crear cuentas de Coder o de Habilidades Socioemocionales (admin).

import { loginController } from "@controllers/login.controller.js";
import { registerController } from "@controllers/register.controller.js";

export default function loginView() {
  setTimeout(() => {
    loginController();
    registerController();

    // Lógica de tabs: alterna entre el panel de login y el de registro
    const tabs = document.querySelectorAll(".auth-tab");
    const panels = document.querySelectorAll(".auth-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        tabs.forEach((t) => {
          t.classList.toggle("border-b-2", t === tab);
          t.classList.toggle("border-violet-600", t === tab);
          t.classList.toggle("text-violet-600", t === tab);
          t.classList.toggle("text-slate-400", t !== tab);
        });

        panels.forEach((p) => {
          p.classList.toggle("hidden", p.dataset.panel !== target);
        });
      });
    });

    // Muestra/oculta el campo "Clan" según el rol elegido en el registro
    const roleSelect = document.querySelector("#registerForm select[name='role']");
    const clanField = document.querySelector("#clanField");
    roleSelect?.addEventListener("change", () => {
      clanField.classList.toggle("hidden", roleSelect.value !== "coder");
    });
  });

  return `
    <div class="min-h-screen flex justify-center items-center bg-slate-100 px-4">
      <div class="bg-white rounded-xl shadow-md w-full max-w-md">

        <div class="text-center pt-8 pb-2 px-8">
          <div class="w-12 h-12 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-3">R</div>
          <h1 class="text-2xl font-bold text-slate-800">Gestión de Inasistencias</h1>
          <p class="text-slate-500 text-sm mt-1">Riwi · Habilidades Socioemocionales</p>
        </div>

        <!-- Tabs de navegación -->
        <div class="flex border-b mt-4">
          <button class="auth-tab flex-1 py-3 text-sm font-semibold text-violet-600 border-b-2 border-violet-600"
            data-tab="login">
            Iniciar sesión
          </button>
          <button class="auth-tab flex-1 py-3 text-sm font-semibold text-slate-400"
            data-tab="register">
            Registrarse
          </button>
        </div>

        <!-- Panel: Login -->
        <div class="auth-panel p-8" data-panel="login">
          <form id="loginForm" novalidate>
            <label class="block text-sm font-medium mb-1 text-slate-700">Correo electrónico</label>
            <input type="email" name="email" placeholder="tu@riwi.io"
              class="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400" />

            <label class="block text-sm font-medium mb-1 text-slate-700">Contraseña</label>
            <input type="password" name="password" placeholder="••••••••"
              class="border w-full p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-violet-400" />

            <p id="loginError" class="text-rose-500 text-sm mb-4 hidden"></p>

            <button type="submit"
              class="bg-violet-600 hover:bg-violet-700 text-white w-full py-2 rounded transition font-semibold">
              Ingresar
            </button>
          </form>

          <div class="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
            <p class="font-semibold text-slate-500 mb-1">Usuarios de prueba:</p>
            <p>Coder → juan.coder@riwi.io / Coder123*</p>
            <p>Habilidades Socioemocionales → soc@riwi.io / Socio123*</p>
          </div>
        </div>

        <!-- Panel: Registro -->
        <div class="auth-panel p-8 hidden" data-panel="register">
          <form id="registerForm" novalidate>
            <label class="block text-sm font-medium mb-1 text-slate-700">Nombre completo</label>
            <input type="text" name="name" placeholder="Tu nombre"
              class="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400" />

            <label class="block text-sm font-medium mb-1 text-slate-700">Correo electrónico</label>
            <input type="email" name="email" placeholder="tu@riwi.io"
              class="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400" />

            <label class="block text-sm font-medium mb-1 text-slate-700">Contraseña</label>
            <input type="password" name="password" placeholder="Mínimo 6 caracteres"
              class="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400" />

            <!-- Selector de rol -->
            <label class="block text-sm font-medium mb-1 text-slate-700">Tipo de cuenta</label>
            <select name="role"
              class="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400">
              <option value="coder">Coder — registra y consulta sus inasistencias</option>
              <option value="admin">Habilidades Socioemocionales — aprueba y gestiona</option>
            </select>

            <!-- Solo aplica a coders -->
            <div id="clanField">
              <label class="block text-sm font-medium mb-1 text-slate-700">Clan</label>
              <input type="text" name="clan" placeholder="Ej: Cumbia"
                class="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>

            <p id="registerMessage" class="text-sm mb-4 hidden"></p>

            <button type="submit"
              class="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-2 rounded transition font-semibold">
              Crear cuenta
            </button>
          </form>
        </div>

      </div>
    </div>
  `;
}
