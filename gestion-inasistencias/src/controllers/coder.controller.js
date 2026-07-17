// controllers/coder.controller.js — Lógica del módulo del coder
import { getSession, STATUS_STYLES, formatDate } from "@utils/index.js";
import { getSolicitudesByCoder, createSolicitud } from "@services/solicitudes.service.js";

export async function coderController() {
  const user = getSession();
  const form = document.getElementById("solicitudForm");
  const formMessage = document.getElementById("formMessage");
  const container = document.getElementById("solicitudesContainer");

  if (!user) return;

  await renderHistorial();

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    formMessage.className = "md:col-span-2 text-sm hidden";

    const formData = new FormData(form);
    const fecha = formData.get("fecha");
    const motivo = formData.get("motivo");
    const descripcion = formData.get("descripcion")?.trim();
    const archivo = formData.get("archivo");

    if (!fecha || !motivo || !descripcion) {
      showMessage("Por favor completa fecha, motivo y descripción.", "error");
      return;
    }

    const nuevaSolicitud = {
      coderId: user.id,
      coderName: user.name,
      clan: user.clan || "",
      fecha,
      motivo,
      descripcion,
      archivoNombre: archivo?.name || null,
      estado: "pendiente",
      observaciones: "",
      fechaCreacion: new Date().toISOString(),
    };

    try {
      await createSolicitud(nuevaSolicitud);
      showMessage("Solicitud enviada correctamente. Quedó en estado Pendiente.", "success");
      form.reset();
      await renderHistorial();
    } catch (err) {
      console.error("[coderController] Error al crear solicitud:", err);
      showMessage(`No se pudo enviar la solicitud. Detalle: ${err.message}`, "error");
    }
  });

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `md:col-span-2 text-sm ${
      type === "error" ? "text-rose-500" : "text-emerald-600"
    } font-medium`;
  }

  async function renderHistorial() {
    try {
      const solicitudes = await getSolicitudesByCoder(user.id);

      if (!solicitudes.length) {
        container.innerHTML = `<p class="text-slate-400 text-center py-8">Aún no has registrado ninguna solicitud.</p>`;
        return;
      }

      container.innerHTML = solicitudes.map(solicitudRow).join("");
    } catch (err) {
      console.error("[coderController] Error al cargar historial:", err);
      container.innerHTML = `<p class="text-rose-500 text-center py-8">Error al cargar tu historial. Detalle: ${err.message}</p>`;
    }
  }

  function solicitudRow(s) {
    const status = STATUS_STYLES[s.estado] || STATUS_STYLES.pendiente;
    return `
      <div class="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-semibold text-slate-800">${s.motivo}</span>
            <span class="px-2 py-0.5 text-xs font-semibold rounded-full ${status.classes}">${status.label}</span>
          </div>
          <p class="text-sm text-slate-500">${s.descripcion}</p>
          <p class="text-xs text-slate-400 mt-1">📅 ${formatDate(s.fecha)} · 📁 ${s.archivoNombre || "Sin soporte adjunto"}</p>
          ${
            s.estado === "rechazada" && s.observaciones
              ? `<p class="text-xs text-rose-500 mt-1">Observación: ${s.observaciones}</p>`
              : ""
          }
          ${
            s.estado === "aprobada" && s.observaciones
              ? `<p class="text-xs text-emerald-600 mt-1">Observación: ${s.observaciones}</p>`
              : ""
          }
        </div>
      </div>
    `;
  }
}
