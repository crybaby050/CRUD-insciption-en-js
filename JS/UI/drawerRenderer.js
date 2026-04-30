import { drawerList, drawerCount, btnRestaurerTout, countSelected } from "../DOM/element.js";
import { getEtudiantsDesactives, restaurerEtudiant, getEtudiantById } from "../Store/studentStore.js";

let selectedIds = new Set();
let idEtudiantARestaurer = null;

export function renderDrawer() {
    const desactives = getEtudiantsDesactives();
    
    if (drawerCount) {
        drawerCount.textContent = `${desactives.length} étudiant(s) désactivé(s)`;
    }
    
    if (drawerList) {
        drawerList.innerHTML = "";
        
        if (desactives.length === 0) {
            drawerList.innerHTML = `
                <div class="text-center py-8" style="color:var(--text-muted);">
                    <svg class="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                    </svg>
                    <p class="text-sm">La corbeille est vide</p>
                </div>
            `;
        } else {
            desactives.forEach(etudiant => {
                drawerList.appendChild(createDrawerItem(etudiant));
            });
        }
    }
    
    selectedIds.clear();
    updateRestaurerButton();
}

function createDrawerItem(etudiant) {
    const div = document.createElement("div");
    div.className = "flex items-center gap-3 p-3 rounded-xl transition-colors";
    div.style.background = "var(--input-bg)";
    div.style.border = "1px solid var(--border)";
    div.dataset.id = etudiant.id;
    
    const initiales = (etudiant.prenom?.[0] || "") + (etudiant.nom?.[0] || "");
    const dateAjout = etudiant.dateAjout || "N/A";
    
    div.innerHTML = `
        <input type="checkbox" class="drawer-checkbox w-4 h-4 rounded accent-green cursor-pointer" data-id="${etudiant.id}">
        <div class="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-500 font-bold text-xs flex-shrink-0">
            ${initiales}
        </div>
        <div class="flex-1 min-w-0">
            <p class="font-poppins text-sm font-semibold truncate" style="color:var(--text);">${etudiant.prenom} ${etudiant.nom}</p>
            <p class="text-xs truncate" style="color:var(--text-muted);">${etudiant.email}</p>
            <p class="text-[10px]" style="color:var(--text-muted);">${etudiant.formation} • ${dateAjout}</p>
        </div>
        <button class="btn-restaurer-un w-8 h-8 rounded-lg bg-green flex items-center justify-center flex-shrink-0 hover:bg-green-dark transition-colors" title="Restaurer" data-id="${etudiant.id}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
            </svg>
        </button>
    `;
    
    // Événement checkbox
    const checkbox = div.querySelector(".drawer-checkbox");
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            selectedIds.add(etudiant.id);
        } else {
            selectedIds.delete(etudiant.id);
        }
        updateRestaurerButton();
    });
    
    // Événement bouton restaurer qui Ouvre le modal de confirmation
    const btnRestaurer = div.querySelector(".btn-restaurer-un");
    btnRestaurer.addEventListener("click", () => {
        ouvrirModalRestoration(etudiant);
    });
    
    return div;
}

function ouvrirModalRestoration(etudiant) {
    const restoreModal = document.getElementById("restore-modal");
    const restoreMessage = document.getElementById("restore-message");
    
    if (!restoreModal) return;
    
    idEtudiantARestaurer = etudiant.id;
    
    if (restoreMessage) {
        restoreMessage.innerHTML = `
            Êtes-vous sûr de vouloir restaurer <strong>${etudiant.prenom} ${etudiant.nom}</strong> ?<br>
            <span style="font-size: 12px; opacity: 0.8;">Il sera de nouveau visible dans la liste.</span>
        `;
    }
    
    restoreModal.classList.add("active");
}

export function executerRestoration() {
    if (!idEtudiantARestaurer) return;
    
    restaurerEtudiant(idEtudiantARestaurer);
    fermerModalRestoration();
    renderDrawer();
    
    if (typeof window.refreshUI === "function") {
        window.refreshUI();
    }
    
    // Notification
    if (typeof window.afficherToast === "function") {
        window.afficherToast("Étudiant restauré avec succès !", "success");
    }
}

export function fermerModalRestoration() {
    const restoreModal = document.getElementById("restore-modal");
    if (restoreModal) {
        restoreModal.classList.remove("active");
    }
    idEtudiantARestaurer = null;
}

export function getIdEtudiantARestaurer() {
    return idEtudiantARestaurer;
}

function updateRestaurerButton() {
    const count = selectedIds.size;
    
    if (countSelected) {
        countSelected.textContent = count;
    }
    
    if (btnRestaurerTout) {
        btnRestaurerTout.disabled = count < 3;
        btnRestaurerTout.style.opacity = count < 1 ? "0.5" : "1";
        btnRestaurerTout.style.cursor = count < 1 ? "not-allowed" : "pointer";
    }
}

export function restaurerTousSelectionnes() {
    if (selectedIds.size === 0) return;
    
    selectedIds.forEach(id => {
        restaurerEtudiant(id);
    });
    
    selectedIds.clear();
    renderDrawer();
    
    if (typeof window.refreshUI === "function") {
        window.refreshUI();
    }
}

export function getSelectedIds() {
    return [...selectedIds];
}