// JS/UI/drawerRenderer.js
import { drawerList, drawerCount, btnRestaurerTout, countSelected } from "../DOM/element.js";
import { getEtudiantsDesactives, restaurerEtudiant, getEtudiantById } from "../Store/studentStore.js";

let selectedIds = new Set();


export function renderDrawer() {
    const desactives = getEtudiantsDesactives();
    
    // Mettre à jour le compteur
    if (drawerCount) {
        drawerCount.textContent = `${desactives.length} étudiant(s) désactivé(s)`;
    }
    
    // Vider la liste
    if (drawerList) {
        drawerList.innerHTML = "";
        
        if (desactives.length === 0) {
            drawerList.innerHTML = `
                <div class="text-center py-8" style="color:var(--text-muted);">
                    <svg class="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4">
                        <path d="M3 6h18"/>
                        <path d="M8 6V4h8v2"/>
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
    
    // Réinitialiser la sélection
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
    
    // Événement bouton restaurer
    const btnRestaurer = div.querySelector(".btn-restaurer-un");
    btnRestaurer.addEventListener("click", () => {
        restaurerEtudiant(etudiant.id);
        selectedIds.delete(etudiant.id);
        renderDrawer();
        // Rafraîchir la liste principale
        if (typeof window.refreshUI === "function") {
            window.refreshUI();
        }
    });
    
    return div;
}

function updateRestaurerButton() {
    const count = selectedIds.size;
    
    if (countSelected) {
        countSelected.textContent = count;
    }
    
    if (btnRestaurerTout) {
        btnRestaurerTout.disabled = count < 3;
        btnRestaurerTout.style.opacity = count < 3 ? "0.5" : "1";
        btnRestaurerTout.style.cursor = count < 3 ? "not-allowed" : "pointer";
    }
}

export function restaurerTousSelectionnes() {
    if (selectedIds.size < 3) return;
    
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