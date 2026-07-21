// views/adminSedesView.js — Crear y administrar sedes
import Sidebar from "@components/Sidebar.js";
import { adminSedesController } from "@controllers/adminSedes.controller.js";

export default function adminSedesView() {
  setTimeout(() => adminSedesController());

  return `
    <div class="flex">
      ${Sidebar("sedes")}

      <main class="flex-1 p-6 bg-slate-100 min-h-screen">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Sedes</h1>
          <p class="text-slate-500 text-sm">Administra las sedes de Riwi.</p>
        </div>

        <section class="bg-white p-5 rounded-xl shadow mb-6">
          <h2 class="font-bold text-lg mb-4 text-slate-800">Crear nueva sede</h2>
          <form id="sedeForm" novalidate class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Nombre</label>
              <input type="text" name="nombre" placeholder="Ej: Riwi Medellín"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Ciudad</label>
              <input type="text" name="ciudad" placeholder="Ej: Medellín"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Dirección</label>
              <input type="text" name="direccion" placeholder="Dirección física"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>

            <p id="sedeFormMessage" class="md:col-span-3 text-sm hidden"></p>

            <div class="md:col-span-3">
              <button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded font-semibold transition">
                Crear sede
              </button>
            </div>
          </form>
        </section>

        <section class="bg-white p-5 rounded-xl shadow">
          <h2 class="font-bold text-lg mb-4 text-slate-800">Sedes registradas</h2>
          <div id="sedesTableContainer" class="overflow-x-auto">
            <div class="text-center py-8 text-slate-400">Cargando sedes...</div>
          </div>
        </section>
      </main>
    </div>
  `;
}
