import { resolveRoute } from "./router/router.js";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname === "/" ? "/login" : window.location.pathname;
  resolveRoute(currentPath);
});
