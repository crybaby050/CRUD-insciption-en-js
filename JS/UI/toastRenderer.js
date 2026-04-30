// JS/UI/toastRenderer.js
import { toastContainer } from "../DOM/element.js";

// Icônes SVG pour chaque type de toast
const TOAST_ICONS = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
    </svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`
};


// Affiche une notification toast
export function showToast(type = "success", title = "", message = "", duree = 4000) {
    if (!toastContainer) {
        console.error("toastContainer introuvable dans le DOM");
        return;
    }

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.success}</div>
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

    // Auto-dismiss après la durée spécifiée
    const timer = setTimeout(() => dismissToast(toast), duree);
    toast._timer = timer;

    return toast;
}


export function dismissToast(toast) {
    if (!toast) return;
    
    clearTimeout(toast._timer);
    toast.classList.add("toast--out");
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 240);
}


export function toastSuccess(title, message, duree) {
    return showToast("success", title, message, duree);
}

export function toastError(title, message, duree) {
    return showToast("error", title, message, duree);
}

export function toastWarning(title, message, duree) {
    return showToast("warning", title, message, duree);
}

export function toastInfo(title, message, duree) {
    return showToast("info", title, message, duree);
}