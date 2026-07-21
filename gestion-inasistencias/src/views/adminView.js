// views/adminView.js — Dashboard + gestión de solicitudes para Habilidades Socioemocionales
import Sidebar from "@components/Sidebar.js";
import { getSession } from "@utils/index.js";
import { adminController } from "@controllers/admin.controller.js";

export default function adminView() {
  const user = getSession();

  setTimeout(() => {
    adminController();
  });

  return `
    <div class="flex">
      ${Sidebar("inicio")}

      <main class="flex-1 p-6 bg-slate-100 min-h-screen">

        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Dashboard · ${user?.name} 👋</h1>
          <p class="text-slate-500 text-sm">Visión general de las inasistencias justificadas.</p>
        </div>

        <!-- Tarjetas de estadísticas -->
        <section id="statsCards" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="col-span-2 md:col-span-4 text-center py-6 text-slate-400 bg-white rounded-xl shadow">
            Cargando estadísticas...
          </div>
        </section>

        <!-- Ausencias por mes / motivos frecuentes / coders con más ausencias -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white p-5 rounded-xl shadow">
            <h3 class="font-bold text-sm text-slate-800 mb-3">Ausencias por mes</h3>
            <div id="ausenciasPorMes" class="space-y-2 text-sm text-slate-500">Cargando...</div>
          </div>
          <div class="bg-white p-5 rounded-xl shadow">
            <h3 class="font-bold text-sm text-slate-800 mb-3">Motivos más frecuentes</h3>
            <div id="motivosFrecuentes" class="space-y-2 text-sm text-slate-500">Cargando...</div>
          </div>
          <div class="bg-white p-5 rounded-xl shadow">
            <h3 class="font-bold text-sm text-slate-800 mb-3">Coders con más ausencias</h3>
            <div id="codersConMasAusencias" class="space-y-2 text-sm text-slate-500">Cargando...</div>
          </div>
        </section>

        <!-- Tabla de solicitudes -->
        <section class="bg-white p-5 rounded-xl shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-lg text-slate-800">Solicitudes</h2>
            <span class="text-sm text-slate-400">Abre el soporte, aprueba o rechaza con observaciones</span>
          </div>

          <div id="solicitudesTableContainer" class="overflow-x-auto">
            <div class="text-center py-8 text-slate-400">Cargando solicitudes...</div>
          </div>
        </section>

      </main>
    </div>

    <!-- Modal de revisión (aprobar / rechazar con observaciones) -->
    <div id="reviewModal" class="fixed inset-0 bg-black/40 hidden items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h3 class="font-bold text-lg mb-1 text-slate-800">Revisar solicitud</h3>
        <p id="reviewSubtitle" class="text-sm text-slate-500 mb-4"></p>

        <div class="bg-slate-50 rounded-lg p-3 mb-4 text-sm text-slate-600" id="reviewDetails"></div>

        <label class="block text-sm font-medium mb-1 text-slate-700">Observaciones</label>
        <textarea id="reviewObservaciones" rows="3" placeholder="Comentario para el coder (opcional para aprobar, recomendado para rechazar)"
          class="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400"></textarea>

        <div class="flex flex-wrap justify-end gap-2">
          <button id="btnCancelReview" class="px-4 py-2 rounded font-medium text-slate-500 hover:bg-slate-100 transition">
            Cancelar
          </button>
          <button id="btnEnRevision" class="px-4 py-2 rounded font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 transition">
            Marcar en revisión
          </button>
          <button id="btnRechazar" class="px-4 py-2 rounded font-medium text-white bg-rose-600 hover:bg-rose-700 transition">
            Rechazar
          </button>
          <button id="btnAprobar" class="px-4 py-2 rounded font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition">
            Aprobar
          </button>
        </div>
      </div>
    </div>
  `;
}
