import { navigateTo } from "@router/router.js";

export default function notFound() {
  setTimeout(() => {
    document.getElementById("goHome")?.addEventListener("click", () => navigateTo("/login"));
  });

  return `
    <div class="min-h-screen flex flex-col justify-center items-center bg-slate-100 text-center px-4">
      <h1 class="text-6xl font-bold text-violet-600 mb-2">404</h1>
      <p class="text-slate-500 mb-6">La página que buscas no existe.</p>
      <button id="goHome" class="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded font-semibold transition">
        Volver al inicio
      </button>
    </div>
  `;
}
