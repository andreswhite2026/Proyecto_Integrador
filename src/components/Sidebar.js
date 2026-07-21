// components/Sidebar.js — Navegación lateral, cambia según el rol de la sesión activa
import { getSession, logout, ROLE_LABELS } from "@utils/index.js";
import { navigateTo } from "@router/router.js";

export default function Sidebar(active = "") {
  const user = getSession();

  setTimeout(() => {
    document.getElementById("navInicio")?.addEventListener("click", () => {
      navigateTo(user?.role === "admin" ? "/admin" : "/coder");
    });
    document.getElementById("navUsuarios")?.addEventListener("click", () => navigateTo("/admin/usuarios"));
    document.getElementById("navSedes")?.addEventListener("click", () => navigateTo("/admin/sedes"));
    document.getElementById("navProgramas")?.addEventListener("click", () => navigateTo("/admin/programas"));
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      logout();
      navigateTo("/login");
    });
  });

  const navItem = (id, label, icon, key) => `
    <button id="${id}"
      class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium text-left ${
        active === key
          ? "bg-violet-600/90 text-white"
          : "hover:bg-slate-800 hover:text-white text-slate-300"
      }">
      <span>${icon}</span> ${label}
    </button>
  `;

  return `
    <aside class="w-64 bg-slate-900 text-slate-300 min-h-screen p-5 flex flex-col justify-between shadow-xl">
      <div>
        <div class="mb-8 border-b border-slate-800 pb-4">
          <h2 class="text-xl font-bold text-white tracking-wide">Inasistencias</h2>
          <p class="text-[11px] text-slate-500">Gestión de justificaciones · Riwi</p>
          <div class="mt-3 flex flex-col">
            <span class="text-sm font-semibold text-slate-200 truncate">${user?.name || "Invitado"}</span>
            <span class="text-[10px] uppercase font-bold tracking-wider bg-violet-600 text-white px-2 py-0.5 rounded mt-1 w-max">
              ${ROLE_LABELS[user?.role] || user?.role || ""}
            </span>
            ${user?.clan ? `<span class="text-[11px] text-slate-500 mt-1">Clan: ${user.clan}</span>` : ""}
          </div>
        </div>

        <nav class="space-y-1">
          ${navItem("navInicio", user?.role === "admin" ? "Dashboard" : "Registrar inasistencia", "🏠", "inicio")}
        </nav>

        ${
          user?.role === "admin"
            ? `
          <p class="text-[10px] uppercase tracking-wider text-slate-600 font-bold mt-6 mb-2 px-4">Administración</p>
          <nav class="space-y-1">
            ${navItem("navUsuarios", "Gestión de usuarios", "👥", "usuarios")}
            ${navItem("navSedes", "Sedes", "🏢", "sedes")}
            ${navItem("navProgramas", "Programas", "📘", "programas")}
          </nav>
          `
            : ""
        }
      </div>

      <div class="border-t border-slate-800 pt-4">
        <button id="logoutBtn" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition text-sm font-medium text-left">
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  `;
}
