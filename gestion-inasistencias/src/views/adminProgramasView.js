// views/adminProgramasView.js — Crear y administrar programas
import Sidebar from "@components/Sidebar.js";
import { adminProgramasController } from "@controllers/adminProgramas.controller.js";

export default function adminProgramasView() {
  setTimeout(() => adminProgramasController());

  return `
    <div class="flex">
      ${Sidebar("programas")}

      <main class="flex-1 p-6 bg-slate-100 min-h-screen">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Programas</h1>
          <p class="text-slate-500 text-sm">Administra los programas formativos de Riwi.</p>
        </div>

        <section class="bg-white p-5 rounded-xl shadow mb-6">
          <h2 class="font-bold text-lg mb-4 text-slate-800">Crear nuevo programa</h2>
          <form id="programaForm" novalidate class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Nombre del programa</label>
              <input type="text" name="nombre" placeholder="Ej: Desarrollo de Software"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700">Sede</label>
              <select name="sedeId"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="">Selecciona una sede</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1 text-slate-700">Descripción</label>
              <textarea name="descripcion" rows="2" placeholder="Breve descripción del programa"
                class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-400"></textarea>
            </div>

            <p id="programaFormMessage" class="md:col-span-2 text-sm hidden"></p>

            <div class="md:col-span-2">
              <button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded font-semibold transition">
                Crear programa
              </button>
            </div>
          </form>
        </section>

        <section class="bg-white p-5 rounded-xl shadow">
          <h2 class="font-bold text-lg mb-4 text-slate-800">Programas registrados</h2>
          <div id="programasTableContainer" class="overflow-x-auto">
            <div class="text-center py-8 text-slate-400">Cargando programas...</div>
          </div>
        </section>
      </main>
    </div>
  `;
}
