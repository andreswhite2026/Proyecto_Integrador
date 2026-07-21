// controllers/admin.controller.js — Dashboard, estadísticas y acciones de revisión
import { STATUS_STYLES, formatDate } from "@utils/index.js";
import { getSolicitudes, updateSolicitud } from "@services/solicitudes.service.js";

export async function adminController() {
  const statsCards = document.getElementById("statsCards");
  const ausenciasPorMesEl = document.getElementById("ausenciasPorMes");
  const motivosFrecuentesEl = document.getElementById("motivosFrecuentes");
  const codersConMasAusenciasEl = document.getElementById("codersConMasAusencias");
  const tableContainer = document.getElementById("solicitudesTableContainer");

  const modal = document.getElementById("reviewModal");
  const reviewSubtitle = document.getElementById("reviewSubtitle");
  const reviewDetails = document.getElementById("reviewDetails");
  const reviewObservaciones = document.getElementById("reviewObservaciones");
  const btnCancel = document.getElementById("btnCancelReview");
  const btnEnRevision = document.getElementById("btnEnRevision");
  const btnRechazar = document.getElementById("btnRechazar");
  const btnAprobar = document.getElementById("btnAprobar");

  let currentSolicitudId = null;
  let solicitudesCache = [];

  await loadAll();

  btnCancel.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  btnEnRevision.addEventListener("click", () => aplicarDecision("en_revision"));
  btnRechazar.addEventListener("click", () => aplicarDecision("rechazada"));
  btnAprobar.addEventListener("click", () => aplicarDecision("aprobada"));

  async function loadAll() {
    try {
      solicitudesCache = await getSolicitudes();
      renderStats(solicitudesCache);
      renderAusenciasPorMes(solicitudesCache);
      renderMotivosFrecuentes(solicitudesCache);
      renderCodersConMasAusencias(solicitudesCache);
      renderTable(solicitudesCache);
    } catch (err) {
      console.error("[adminController] Error al cargar solicitudes:", err);
      tableContainer.innerHTML = `<p class="text-rose-500 text-center py-8">Error al conectar con json-server. Detalle: ${err.message}</p>`;
      statsCards.innerHTML = `<p class="col-span-4 text-rose-500 text-center py-6 bg-white rounded-xl shadow">No se pudieron cargar las estadísticas.</p>`;
    }
  }

  function renderStats(solicitudes) {
    const total = solicitudes.length;
    const pendientes = solicitudes.filter((s) => s.estado === "pendiente").length;
    const enRevision = solicitudes.filter((s) => s.estado === "en_revision").length;
    const aprobadas = solicitudes.filter((s) => s.estado === "aprobada").length;
    const rechazadas = solicitudes.filter((s) => s.estado === "rechazada").length;

    const cards = [
      { label: "Total de solicitudes", value: total, classes: "bg-white text-slate-800" },
      { label: "Pendientes", value: pendientes, classes: "bg-amber-50 text-amber-800" },
      { label: "En revisión", value: enRevision, classes: "bg-sky-50 text-sky-800" },
      { label: "Aprobadas", value: aprobadas, classes: "bg-emerald-50 text-emerald-800" },
      { label: "Rechazadas", value: rechazadas, classes: "bg-rose-50 text-rose-800" },
    ];

    statsCards.innerHTML = cards
      .map(
        (c) => `
        <div class="${c.classes} p-5 rounded-xl shadow">
          <p class="text-3xl font-bold">${c.value}</p>
          <p class="text-sm font-medium mt-1">${c.label}</p>
        </div>
      `
      )
      .join("");
  }

  function renderAusenciasPorMes(solicitudes) {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const conteo = {};

    solicitudes.forEach((s) => {
      if (!s.fecha) return;
      const mesIndex = Number(s.fecha.split("-")[1]) - 1;
      const key = meses[mesIndex] || "—";
      conteo[key] = (conteo[key] || 0) + 1;
    });

    const entries = Object.entries(conteo);
    if (!entries.length) {
      ausenciasPorMesEl.innerHTML = `<p class="text-slate-400">Sin datos aún.</p>`;
      return;
    }

    const max = Math.max(...entries.map(([, v]) => v));
    ausenciasPorMesEl.innerHTML = entries
      .map(
        ([mes, count]) => `
        <div class="flex items-center gap-2">
          <span class="w-10 text-xs text-slate-500">${mes}</span>
          <div class="flex-1 bg-slate-100 rounded-full h-2">
            <div class="bg-violet-500 h-2 rounded-full" style="width:${(count / max) * 100}%"></div>
          </div>
          <span class="w-5 text-xs text-slate-500 text-right">${count}</span>
        </div>
      `
      )
      .join("");
  }

  function renderMotivosFrecuentes(solicitudes) {
    const conteo = {};
    solicitudes.forEach((s) => {
      conteo[s.motivo] = (conteo[s.motivo] || 0) + 1;
    });

    const entries = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!entries.length) {
      motivosFrecuentesEl.innerHTML = `<p class="text-slate-400">Sin datos aún.</p>`;
      return;
    }

    motivosFrecuentesEl.innerHTML = entries
      .map(
        ([motivo, count], i) => `
        <div class="flex justify-between items-center">
          <span class="truncate pr-2">${i + 1}. ${motivo}</span>
          <span class="font-semibold text-violet-600">${count}</span>
        </div>
      `
      )
      .join("");
  }

  function renderCodersConMasAusencias(solicitudes) {
    const conteo = {};
    solicitudes.forEach((s) => {
      const key = s.coderName || "Sin nombre";
      conteo[key] = (conteo[key] || 0) + 1;
    });

    const entries = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!entries.length) {
      codersConMasAusenciasEl.innerHTML = `<p class="text-slate-400">Sin datos aún.</p>`;
      return;
    }

    codersConMasAusenciasEl.innerHTML = entries
      .map(
        ([nombre, count], i) => `
        <div class="flex justify-between items-center">
          <span class="truncate pr-2">${i + 1}. ${nombre}</span>
          <span class="font-semibold text-violet-600">${count}</span>
        </div>
      `
      )
      .join("");
  }

  function renderTable(solicitudes) {
    if (!solicitudes.length) {
      tableContainer.innerHTML = `<p class="text-slate-400 text-center py-8">No hay solicitudes registradas todavía.</p>`;
      return;
    }

    tableContainer.innerHTML = `
      <table class="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr class="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider bg-slate-50">
            <th class="p-3">Coder / Clan</th>
            <th class="p-3">Motivo</th>
            <th class="p-3">Fecha</th>
            <th class="p-3">Soporte</th>
            <th class="p-3">Estado</th>
            <th class="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
          ${solicitudes.map(rowHtml).join("")}
        </tbody>
      </table>
    `;

    tableContainer.querySelectorAll(".btn-revisar").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.id));
    });
  }

  function rowHtml(s) {
    const status = STATUS_STYLES[s.estado] || STATUS_STYLES.pendiente;
    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="p-3">
          <div class="font-bold text-slate-900">${s.coderName || "N/A"}</div>
          <div class="text-xs text-slate-400">Clan: ${s.clan || "N/A"}</div>
        </td>
        <td class="p-3 max-w-[220px]">
          <div class="truncate font-medium" title="${s.descripcion || ""}">${s.motivo}</div>
          <div class="text-xs text-slate-400 truncate">${s.descripcion || ""}</div>
        </td>
        <td class="p-3 text-xs text-slate-500">${formatDate(s.fecha)}</td>
        <td class="p-3 text-xs">${s.archivoNombre ? `📁 ${s.archivoNombre}` : `<span class="text-slate-400">Sin soporte</span>`}</td>
        <td class="p-3">
          <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${status.classes}">${status.label}</span>
        </td>
        <td class="p-3 text-center">
          <button data-id="${s.id}" class="btn-revisar bg-violet-50 text-violet-700 hover:bg-violet-100 px-3 py-1 rounded font-medium transition text-xs">
            Abrir soporte
          </button>
        </td>
      </tr>
    `;
  }

  function openModal(id) {
    const solicitud = solicitudesCache.find((s) => String(s.id) === String(id));
    if (!solicitud) return;

    currentSolicitudId = id;
    reviewSubtitle.textContent = `${solicitud.coderName} · Clan ${solicitud.clan || "N/A"}`;
    reviewDetails.innerHTML = `
      <p><span class="font-semibold">Motivo:</span> ${solicitud.motivo}</p>
      <p class="mt-1"><span class="font-semibold">Descripción:</span> ${solicitud.descripcion}</p>
      <p class="mt-1"><span class="font-semibold">Fecha:</span> ${formatDate(solicitud.fecha)}</p>
      <p class="mt-1"><span class="font-semibold">Soporte:</span> ${solicitud.archivoNombre || "Sin adjunto"}</p>
    `;
    reviewObservaciones.value = solicitud.observaciones || "";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    currentSolicitudId = null;
  }

  async function aplicarDecision(estado) {
    if (!currentSolicitudId) return;

    try {
      await updateSolicitud(currentSolicitudId, {
        estado,
        observaciones: reviewObservaciones.value.trim(),
      });
      closeModal();
      await loadAll();
    } catch (err) {
      console.error("[adminController] error al actualizar", err);
      alert("No se pudo actualizar la solicitud. ¿Está corriendo json-server?");
    }
  }
}
