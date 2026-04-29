import { toastContainer } from "../DOM/Element";

function showToast(type, title, message) {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${TOAST_ICONS[type]}</div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            ${message ? `<div class="toast-msg">${message}</div>` : ""}
        </div>
        <button class="toast-close" title="Fermer">×</button>
        <div class="toast-progress"></div>
    `;

    toastContainer.appendChild(toast);

    // Fermer manuellement
    toast.querySelector(".toast-close").addEventListener("click", () => dismissToast(toast));

    // Auto-dismiss après 4s
    const timer = setTimeout(() => dismissToast(toast), 4000);
    toast._timer = timer;
}

function dismissToast(toast) {
    clearTimeout(toast._timer);
    toast.classList.add("toast--out");
    setTimeout(() => toast.remove(), 240);
}