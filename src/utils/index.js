// utils/index.js — Control de la sesión del usuario en el navegador

const SESSION_KEY = "inasistencias_session";

// Guarda los datos del usuario autenticado
export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Recupera la sesión activa actual (o null si no hay ninguna)
export function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

// Destruye la sesión al cerrar sesión
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// Etiquetas legibles para cada rol del sistema
export const ROLE_LABELS = {
  coder: "Coder",
  team_leader: "Team Leader",
  admin: "Habilidades Socioemocionales",
};

// Colores/estilos asociados a cada estado de una solicitud
export const STATUS_STYLES = {
  pendiente: { label: "Pendiente", classes: "bg-amber-100 text-amber-800" },
  en_revision: { label: "En revisión", classes: "bg-sky-100 text-sky-800" },
  aprobada: { label: "Aprobada", classes: "bg-emerald-100 text-emerald-800" },
  rechazada: { label: "Rechazada", classes: "bg-rose-100 text-rose-800" },
};

// Formatea una fecha ISO (yyyy-mm-dd) a un formato legible en español
export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${meses[Number(month) - 1]} ${year}`;
}
