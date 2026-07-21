// views/adminUsersView.js — Crear y administrar usuarios (coders y admins)
import Sidebar from "@components/Sidebar.js";
import { adminUsersController } from "@controllers/adminUsers.controller.js";

export default function adminUsersView() {
  setTimeout(() => adminUsersController());

  return `
    <div class="flex">
      ${Sidebar("usuarios")}

      <main class="flex-1 p-6 bg-slate-100 min-h-screen">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Gestión de usuarios</h1>
          <p class="text-slate-500 text-sm">Crea cuentas de coders o de Habilidades Socioemocionales.</p>
        </div>

        <section class="bg-white p-5 rounded-xl shadow mb-6">
          <h2 class="font-bold text-lg mb-4 text-slate-800">Crear nuevo usuario</h2>
          <form id="userForm" novalidate class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Nombre completo</label>
              <input type="text" name="name" placeholder="Nombre del usuario"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Correo electrónico</label>
              <input type="email" name="email" placeholder="correo@riwi.io"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Contraseña temporal</label>
              <input type="text" name="password" placeholder="Mínimo 6 caracteres"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Rol</label>
              <select name="role"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="coder">Coder</option>
                <option value="team_leader">Team Leader</option>
                <option value="admin">Habilidades Socioemocionales</option>
              </select>
            </div>
            <div id="userClanField">
              <label class="block text-sm font-medium mb-1 text-slate-700">Clan</label>
              <input type="text" name="clan" placeholder="Ej: Cumbia"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>

            <p id="userFormMessage" class="md:col-span-2 text-sm hidden"></p>

            <div class="md:col-span-2">
              <button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded font-semibold transition">
                Crear usuario
              </button>
            </div>
          </form>
        </section>

        <section class="bg-white p-5 rounded-xl shadow">
          <h2 class="font-bold text-lg mb-4 text-slate-800">Usuarios registrados</h2>
          <div id="usersTableContainer" class="overflow-x-auto">
            <div class="text-center py-8 text-slate-400">Cargando usuarios...</div>
          </div>
        </section>
      </main>
    </div>
  `;
}
