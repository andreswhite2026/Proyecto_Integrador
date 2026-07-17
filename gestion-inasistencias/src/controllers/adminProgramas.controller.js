// controllers/adminProgramas.controller.js — Crear, listar y eliminar programas
import { getProgramas, createPrograma, deletePrograma } from "@services/programas.service.js";
import { getSedes } from "@services/sedes.service.js";

export async function adminProgramasController() {
  const form = document.getElementById("programaForm");
  const message = document.getElementById("programaFormMessage");
  const tableContainer = document.getElementById("programasTableContainer");
  const sedeSelect = form.querySelector("select[name='sedeId']");

  let sedesCache = [];

  await Promise.all([loadSedes(), renderTable()]);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.className = "md:col-span-2 text-sm hidden";

    const nombre = form.nombre.value.trim();
    const sedeId = form.sedeId.value;
    const descripcion = form.descripcion.value.trim();

    if (!nombre) {
      return showMessage("El nombre del programa es obligatorio.", "error");
    }

    try {
      await createPrograma({ nombre, sedeId: sedeId || null, descripcion });
      showMessage("Programa creado correctamente.", "success");
      form.reset();
      await renderTable();
    } catch (err) {
      console.error("[adminProgramasController]", err);
      showMessage(`No se pudo crear el programa. Detalle: ${err.message}`, "error");
    }
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `md:col-span-2 text-sm ${type === "error" ? "text-rose-500" : "text-emerald-600"} font-medium`;
  }

  async function loadSedes() {
    try {
      sedesCache = await getSedes();
      sedeSelect.innerHTML =
        `<option value="">Selecciona una sede</option>` +
        sedesCache.map((s) => `<option value="${s.id}">${s.nombre}</option>`).join("");
    } catch (err) {
      console.error("[adminProgramasController] Error al cargar sedes:", err);
    }
  }

  function sedeNombre(sedeId) {
    return sedesCache.find((s) => String(s.id) === String(sedeId))?.nombre || "Sin sede asignada";
  }

  async function renderTable() {
    try {
      const programas = await getProgramas();

      if (!programas.length) {
        tableContainer.innerHTML = `<p class="text-slate-400 text-center py-8">Aún no hay programas registrados.</p>`;
        return;
      }

      tableContainer.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider bg-slate-50">
              <th class="p-3">Nombre</th>
              <th class="p-3">Sede</th>
              <th class="p-3">Descripción</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            ${programas.map(programaRow).join("")}
          </tbody>
        </table>
      `;

      tableContainer.querySelectorAll(".btn-delete-programa").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("¿Eliminar este programa?")) return;
          try {
            await deletePrograma(btn.dataset.id);
            await renderTable();
          } catch (err) {
            alert(`No se pudo eliminar. Detalle: ${err.message}`);
          }
        });
      });
    } catch (err) {
      console.error("[adminProgramasController] Error al cargar programas:", err);
      tableContainer.innerHTML = `<p class="text-rose-500 text-center py-8">Error al cargar programas. Detalle: ${err.message}</p>`;
    }
  }

  function programaRow(p) {
    return `
      <tr class="hover:bg-slate-50/80">
        <td class="p-3 font-medium text-slate-900">${p.nombre}</td>
        <td class="p-3 text-slate-500">${sedeNombre(p.sedeId)}</td>
        <td class="p-3 text-slate-500">${p.descripcion || "—"}</td>
        <td class="p-3 text-center">
          <button data-id="${p.id}" class="btn-delete-programa text-rose-500 hover:text-rose-700 text-xs font-medium">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }
}
