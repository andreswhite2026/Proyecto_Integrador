// controllers/adminSedes.controller.js — Crear, listar y eliminar sedes
import { getSedes, createSede, deleteSede } from "@services/sedes.service.js";

export async function adminSedesController() {
  const form = document.getElementById("sedeForm");
  const message = document.getElementById("sedeFormMessage");
  const tableContainer = document.getElementById("sedesTableContainer");

  await renderTable();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.className = "md:col-span-3 text-sm hidden";

    const nombre = form.nombre.value.trim();
    const ciudad = form.ciudad.value.trim();
    const direccion = form.direccion.value.trim();

    if (!nombre || !ciudad) {
      return showMessage("Completa al menos el nombre y la ciudad.", "error");
    }

    try {
      await createSede({ nombre, ciudad, direccion });
      showMessage("Sede creada correctamente.", "success");
      form.reset();
      await renderTable();
    } catch (err) {
      console.error("[adminSedesController]", err);
      showMessage(`No se pudo crear la sede. Detalle: ${err.message}`, "error");
    }
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `md:col-span-3 text-sm ${type === "error" ? "text-rose-500" : "text-emerald-600"} font-medium`;
  }

  async function renderTable() {
    try {
      const sedes = await getSedes();

      if (!sedes.length) {
        tableContainer.innerHTML = `<p class="text-slate-400 text-center py-8">Aún no hay sedes registradas.</p>`;
        return;
      }

      tableContainer.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr class="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider bg-slate-50">
              <th class="p-3">Nombre</th>
              <th class="p-3">Ciudad</th>
              <th class="p-3">Dirección</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            ${sedes.map(sedeRow).join("")}
          </tbody>
        </table>
      `;

      tableContainer.querySelectorAll(".btn-delete-sede").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("¿Eliminar esta sede?")) return;
          try {
            await deleteSede(btn.dataset.id);
            await renderTable();
          } catch (err) {
            alert(`No se pudo eliminar. Detalle: ${err.message}`);
          }
        });
      });
    } catch (err) {
      console.error("[adminSedesController] Error al cargar sedes:", err);
      tableContainer.innerHTML = `<p class="text-rose-500 text-center py-8">Error al cargar sedes. Detalle: ${err.message}</p>`;
    }
  }

  function sedeRow(s) {
    return `
      <tr class="hover:bg-slate-50/80">
        <td class="p-3 font-medium text-slate-900">${s.nombre}</td>
        <td class="p-3 text-slate-500">${s.ciudad}</td>
        <td class="p-3 text-slate-500">${s.direccion || "—"}</td>
        <td class="p-3 text-center">
          <button data-id="${s.id}" class="btn-delete-sede text-rose-500 hover:text-rose-700 text-xs font-medium">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }
}
