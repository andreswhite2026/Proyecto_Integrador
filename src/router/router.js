import loginView from "@views/loginView.js";
import coderView from "@views/coderView.js";
import adminView from "@views/adminView.js";
import adminUsersView from "@views/adminUsersView.js";
import adminSedesView from "@views/adminSedesView.js";
import adminProgramasView from "@views/adminProgramasView.js";
import notFound from "@views/notFound.js";
import { getSession } from "@utils/index.js";

// "role" acepta un string o un arreglo de roles permitidos para esa ruta
const routes = {
  "/": { view: loginView, private: false },
  "/login": { view: loginView, private: false },
  "/coder": { view: coderView, private: true, role: "coder" },
  "/admin": { view: adminView, private: true, role: "admin" },
  "/admin/usuarios": { view: adminUsersView, private: true, role: "admin" },
  "/admin/sedes": { view: adminSedesView, private: true, role: "admin" },
  "/admin/programas": { view: adminProgramasView, private: true, role: "admin" },
};

// A dónde redirigir a cada rol después de iniciar sesión
const HOME_BY_ROLE = {
  coder: "/coder",
  admin: "/admin",
  team_leader: "/coder", // aún no tiene vista propia; se habilitará más adelante
};

export function navigateTo(path) {
  window.history.pushState({}, "", path);
  resolveRoute(path);
}

export function resolveRoute(path) {
  const route = routes[path] || { view: notFound, private: false };
  const user = getSession();

  // Ruta privada sin sesión -> al login
  if (route.private && !user) {
    navigateTo("/login");
    return;
  }

  // Ya autenticado intentando ver login -> a su propio home
  if ((path === "/login" || path === "/") && user) {
    navigateTo(HOME_BY_ROLE[user.role] || "/login");
    return;
  }

  // Ruta restringida a un rol que no coincide -> a su propio home
  if (route.role && user?.role !== route.role) {
    navigateTo(HOME_BY_ROLE[user.role] || "/login");
    return;
  }

  const appContainer = document.getElementById("app");
  if (appContainer) {
    appContainer.innerHTML = route.view();
  }
}

window.addEventListener("popstate", () => {
  resolveRoute(window.location.pathname);
});
