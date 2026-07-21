// views/coderView.js — Módulo del coder: registrar inasistencia + ver historial
import Sidebar from "@components/Sidebar.js";
import { getSession } from "@utils/index.js";
import { coderController } from "@controllers/coder.controller.js";
import { MOTIVOS } from "@services/solicitudes.service.js";

export default function coderView() {
  const user = getSession();

  setTimeout(() => {
    coderController();
  });

  return `
    <div class="flex">
      ${Sidebar("inicio")}

      <main class="flex-1 p-6 bg-slate-100 min-h-screen">

        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Hola, ${user?.name} 👋</h1>
          <p class="text-slate-500 text-sm">Registra tu inasistencia y haz seguimiento a tus solicitudes.</p>
        </div>

        <!-- Formulario para registrar una inasistencia -->
        <section class="bg-white p-5 rounded-xl shadow mb-6">
          <h2 class="font-bold text-lg mb-4 text-slate-800">Registrar inasistencia</h2>

          <form id="solicitudForm" novalidate class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Fecha de la inasistencia</label>
              <input type="date" name="fecha"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Motivo</label>
              <select name="motivo"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="">Selecciona un motivo</option>
                ${MOTIVOS.map((m) => `<option value="${m}">${m}</option>`).join("")}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1 text-slate-700">Descripción</label>
              <textarea name="descripcion" rows="3" placeholder="Cuéntanos brevemente qué ocurrió..."
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400"></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1 text-slate-700">Adjuntar soporte (PDF o imagen)</label>
              <input type="file" name="archivo" accept=".pdf,image/*"
                class="border w-full p-1.5 rounded bg-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>

            <p id="formMessage" class="md:col-span-2 text-sm hidden"></p>

            <div class="md:col-span-2">
              <button type="submit"
                class="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded font-semibold transition">
                Enviar solicitud
              </button>
            </div>
          </form>
        </section>

        <!-- Historial de solicitudes del coder -->
        <section class="bg-white p-5 rounded-xl shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-lg text-slate-800">Mis solicitudes</h2>
            <span class="text-sm text-slate-400">Historial y estado</span>
          </div>

          <div id="solicitudesContainer" class="space-y-3">
            <div class="text-center py-8 text-slate-400">Cargando solicitudes...</div>
          </div>
        </section>

      </main>
    </div>
  `;
}
