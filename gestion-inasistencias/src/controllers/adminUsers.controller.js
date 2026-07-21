// controllers/adminUsers.controller.js — Crear, listar y eliminar usuarios
import { ROLE_LABELS } from "@utils/index.js";
import { getUsers, createUser, deleteUser } from "@services/users.service.js";
import { getUserByEmail } from "@services/auth.service.js";

export async function adminUsersController() {
  const form = document.getElementById("userForm");
  const message = document.getElementById("userFormMessage");
  const tableContainer = document.getElementById("usersTableContainer");
  const roleSelect = form.querySelector("select[name='role']");
  const clanField = document.getElementById("userClanField");

  roleSelect.addEventListener("change", () => {
    clanField.classList.toggle("hidden", roleSelect.value === "admin");
  });

  await renderTable();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.className = "md:col-span-2 text-sm hidden";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const role = form.role.value;
    const clan = form.clan.value.trim();

    if (!name || !email || !password) {
      return showMessage("Completa nombre, correo y contraseña.", "error");
    }
    if (password.length < 6) {
      return showMessage("La contraseña debe tener al menos 6 caracteres.", "error");
    }

    try {
      const existing = await getUserByEmail(email);
      if (existing.length > 0) {
        return showMessage("Ya existe un usuario con ese correo.", "error");
      }

      await createUser({
        name,
        email,
        password,
        role,
        clan: role === "admin" ? "" : clan,
      });

      showMessage("Usuario creado correctamente.", "success");
      form.reset();
      await renderTable();
    } catch (err) {
      console.error("[adminUsersController]", err);
      showMessage(`No se pudo crear el usuario. Detalle: ${err.message}`, "error");
    }
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `md:col-span-2 text-sm ${type === "error" ? "text-rose-500" : "text-emerald-600"} font-medium`;
  }

  async function renderTable() {
    try {
      const users = await getUsers();

      tableContainer.innerHTML = `
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider bg-slate-50">
              <th class="p-3">Nombre</th>
              <th class="p-3">Correo</th>
              <th class="p-3">Rol</th>
              <th class="p-3">Clan</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            ${users.map(userRow).join("")}
          </tbody>
        </table>
      `;

      tableContainer.querySelectorAll(".btn-delete-user").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("¿Eliminar este usuario?")) return;
          try {
            await deleteUser(btn.dataset.id);
            await renderTable();
          } catch (err) {
            alert(`No se pudo eliminar. Detalle: ${err.message}`);
          }
        });
      });
    } catch (err) {
      console.error("[adminUsersController] Error al cargar usuarios:", err);
      tableContainer.innerHTML = `<p class="text-rose-500 text-center py-8">Error al cargar usuarios. Detalle: ${err.message}</p>`;
    }
  }

  function userRow(u) {
    return `
      <tr class="hover:bg-slate-50/80">
        <td class="p-3 font-medium text-slate-900">${u.name}</td>
        <td class="p-3 text-slate-500">${u.email}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-violet-100 text-violet-700">
            ${ROLE_LABELS[u.role] || u.role}
          </span>
        </td>
        <td class="p-3 text-slate-500">${u.clan || "—"}</td>
        <td class="p-3 text-center">
          <button data-id="${u.id}" class="btn-delete-user text-rose-500 hover:text-rose-700 text-xs font-medium">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }
}
