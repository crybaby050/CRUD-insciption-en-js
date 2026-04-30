import {
    addModal, addForm, modalTitre,
    inpNom, inpPrenom, inpEmail, inpTelephone,
    inpFormation, inpAdresse, inpPays,
    btnAjout, btnFermerModal,
    btnVueTableau, btnVueCartes,
    viewTableau, viewCartes,
    confirmModal, confirmMessage,
    btnConfirmAnnuler, btnConfirmOk,
    drawerOverlay, drawer, btnFermerDrawer, btnRestaurerTout,
    restoreModal, btnRestoreAnnuler, btnRestoreOk,
    restoreMultipleModal, btnRestoreMultipleAnnuler, btnRestoreMultipleOk,
    searchInput, filterFormation, btnReinitialiser, btnRestaurer,
    pagina
} from "./DOM/element.js";

import { addEtudiant, updateEtudiant } from "./Services/service.js";

import { getEtudiants, getEtudiantById, desactiverUnEtudiant } from "./Store/studentStore.js";

import { renderEtudiantList, renderEtudiantCarteList } from "./UI/etudiantRenderer.js";
import { toastSuccess, toastError } from "./UI/toastRenderer.js";
import { showErrors, clearErrors, initErrorListeners, initPhoneFormatting } from "./UI/errorRenderer.js";
import {
    renderDrawer,
    executerRestoration,
    fermerModalRestoration,
    ouvrirModalRestorationMultiple,
    executerRestorationMultiple,
    fermerModalRestorationMultiple,
    getSelectedCount
} from "./UI/drawerRenderer.js";
import { renderPagination, getCurrentPageSlice, resetPagination } from "./UI/paginationRenderer.js";

import { validateForm } from "./Utils/validationForm.js";
import { filterEtudiants } from "./Utils/searchFilter.js";

let vueActive = "tableau";
let etudiantEnCoursModification = null;
let idEtudiantADesactiver = null;
let currentSearch = "";
let currentFilter = "";

window.refreshUI = refreshUI;

// ========== MODAL AJOUT/MODIFICATION ==========

function ouvrirModalAjout() {
    if (!addModal) return;
    etudiantEnCoursModification = null;
    modalTitre.textContent = "Nouvel étudiant";
    inpNom.value = inpPrenom.value = inpEmail.value = inpTelephone.value = inpFormation.value = inpAdresse.value = "";
    inpPays.value = "+221";
    clearErrors();
    addModal.classList.add("active");
}

function ouvrirModalModification(id) {
    if (!addModal) return;
    const etudiant = getEtudiantById(id);
    if (!etudiant) { toastError("Erreur", "Étudiant introuvable"); return; }
    etudiantEnCoursModification = id;
    modalTitre.textContent = "Modifier l'étudiant";
    inpNom.value = etudiant.nom || "";
    inpPrenom.value = etudiant.prenom || "";
    inpEmail.value = etudiant.email || "";
    inpAdresse.value = etudiant.adresse || "";
    inpFormation.value = etudiant.formation || "";
    if (etudiant.telephone) {
        const parts = etudiant.telephone.split(" ");
        if (parts.length >= 2) { inpPays.value = parts[0]; inpTelephone.value = parts.slice(1).join(" "); }
    } else { inpPays.value = "+221"; inpTelephone.value = ""; }
    clearErrors();
    addModal.classList.add("active");
}

function fermerModal() {
    addModal?.classList.remove("active");
    etudiantEnCoursModification = null;
    clearErrors();
}

// ========== SOUMISSION ==========

function handleSubmit(event) {
    event.preventDefault();
    const codePays = inpPays?.value || "+221";
    const numeroBrut = inpTelephone?.value.replace(/\s/g, "") || "";
    const telephoneComplet = numeroBrut ? `${codePays} ${numeroBrut}` : "";
    const etudiant = {
        nom: inpNom?.value.trim() || "",
        prenom: inpPrenom?.value.trim() || "",
        email: inpEmail?.value.trim() || "",
        telephone: numeroBrut,
        formation: inpFormation?.value || "",
        adresse: inpAdresse?.value.trim() || "",
    };
    const errors = validateForm(etudiant, codePays, etudiantEnCoursModification);
    if (Object.keys(errors).length > 0) { showErrors(errors); return; }
    etudiant.telephone = telephoneComplet;
    try {
        if (etudiantEnCoursModification) { updateEtudiant(etudiantEnCoursModification, etudiant); toastSuccess("Succès", "Étudiant modifié !"); }
        else { addEtudiant(etudiant); toastSuccess("Succès", "Étudiant ajouté !"); }
        fermerModal();
        refreshUI();
    } catch (error) { toastError("Erreur", error.message); }
}

// ========== CONFIRMATION DÉSACTIVATION ==========

function ouvrirModalConfirmation(id, nom, prenom) {
    if (!confirmModal) return;
    idEtudiantADesactiver = id;
    confirmMessage.innerHTML = `Êtes-vous sûr de vouloir supprimer <strong>${prenom} ${nom}</strong> ?`;
    confirmModal.classList.add("active");
}

function fermerModalConfirmation() { confirmModal?.classList.remove("active"); idEtudiantADesactiver = null; }

function executerDesactivation() {
    if (!idEtudiantADesactiver) return;
    desactiverUnEtudiant(idEtudiantADesactiver);
    fermerModalConfirmation();
    refreshUI();
    toastSuccess("Succès", "Étudiant supprimé");
}

function gererDesactivation(id) {
    const etudiant = getEtudiantById(id);
    if (etudiant) ouvrirModalConfirmation(id, etudiant.nom, etudiant.prenom);
}

// ========== AFFICHAGE ==========

function refreshUI() {
    let etudiants = getEtudiants();
    etudiants = filterEtudiants(etudiants, currentSearch, currentFilter);
    const paginatedEtudiants = getCurrentPageSlice(etudiants);
    const handlers = { onModifier: ouvrirModalModification, onDesactiver: gererDesactivation };
    
    if (vueActive === "tableau") {
        renderEtudiantList(paginatedEtudiants, handlers);
        viewTableau.style.display = "block"; viewCartes.style.display = "none";
        btnVueTableau?.classList.add("active"); btnVueCartes?.classList.remove("active");
    } else {
        renderEtudiantCarteList(paginatedEtudiants, handlers);
        viewTableau.style.display = "none"; viewCartes.style.display = "block";
        btnVueTableau?.classList.remove("active"); btnVueCartes?.classList.add("active");
    }
    
    if (pagina) {
        renderPagination(pagina, etudiants, (slice) => {
            vueActive === "tableau" ? renderEtudiantList(slice, handlers) : renderEtudiantCarteList(slice, handlers);
        });
    }
}

// ========== DRAWER ==========

function ouvrirDrawer() {
    drawerOverlay?.classList.remove("hidden");
    drawer?.classList.remove("translate-x-full");
    drawer?.classList.add("translate-x-0");
    renderDrawer();
}

function fermerDrawer() {
    drawerOverlay?.classList.add("hidden");
    drawer?.classList.add("translate-x-full");
    drawer?.classList.remove("translate-x-0");
}

// ========== EVENT LISTENERS ==========

btnAjout?.addEventListener("click", ouvrirModalAjout);
btnFermerModal?.addEventListener("click", fermerModal);
addForm?.addEventListener("submit", handleSubmit);
document.getElementById("btn-annuler")?.addEventListener("click", fermerModal);

btnConfirmAnnuler?.addEventListener("click", fermerModalConfirmation);
btnConfirmOk?.addEventListener("click", executerDesactivation);

confirmModal?.addEventListener("click", e => { if (e.target === confirmModal) fermerModalConfirmation(); });
addModal?.addEventListener("click", e => { if (e.target === addModal) fermerModal(); });

btnVueTableau?.addEventListener("click", () => { vueActive = "tableau"; refreshUI(); });
btnVueCartes?.addEventListener("click", () => { vueActive = "cartes"; refreshUI(); });

// Drawer
btnRestaurer?.addEventListener("click", ouvrirDrawer);
btnFermerDrawer?.addEventListener("click", fermerDrawer);
drawerOverlay?.addEventListener("click", fermerDrawer);

// Restauration multiple
btnRestaurerTout?.addEventListener("click", ouvrirModalRestorationMultiple);
btnRestoreMultipleAnnuler?.addEventListener("click", fermerModalRestorationMultiple);
btnRestoreMultipleOk?.addEventListener("click", () => {
    const count = getSelectedCount();
    executerRestorationMultiple();
    toastSuccess("Succès", `${count} étudiant(s) restauré(s) !`);
});
restoreMultipleModal?.addEventListener("click", e => { if (e.target === restoreMultipleModal) fermerModalRestorationMultiple(); });

// Restauration simple
btnRestoreAnnuler?.addEventListener("click", fermerModalRestoration);
btnRestoreOk?.addEventListener("click", () => { executerRestoration(); toastSuccess("Succès", "Étudiant restauré !"); });
restoreModal?.addEventListener("click", e => { if (e.target === restoreModal) fermerModalRestoration(); });

// Filtres
searchInput?.addEventListener("input", () => { currentSearch = searchInput.value; resetPagination(); refreshUI(); });
filterFormation?.addEventListener("change", () => { currentFilter = filterFormation.value; resetPagination(); refreshUI(); });
btnReinitialiser?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (filterFormation) filterFormation.value = "";
    currentSearch = ""; currentFilter = "";
    resetPagination(); refreshUI();
});

// ✅ UN SEUL écouteur Escape
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        if (restoreMultipleModal?.classList.contains("active")) fermerModalRestorationMultiple();
        else if (restoreModal?.classList.contains("active")) fermerModalRestoration();
        else if (confirmModal?.classList.contains("active")) fermerModalConfirmation();
        else if (addModal?.classList.contains("active")) fermerModal();
        else if (drawer?.classList.contains("translate-x-0")) fermerDrawer();
    }
});

// ========== INITIALISATION ==========
initErrorListeners();
initPhoneFormatting();
refreshUI();