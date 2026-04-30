// app.js
import { addEtudiant, updateEtudiant } from "./Services/service.js";
import { getEtudiants, getEtudiantById, desactiverUnEtudiant } from "./Store/studentStore.js";
import { renderEtudiantList, renderEtudiantCarteList } from "./UI/etudiantRenderer.js";
import { showToast, toastSuccess, toastError } from "./UI/toastRenderer.js";
import { validateForm } from "./Utils/validationForm.js";
import { drawerOverlay, drawer, btnFermerDrawer, btnRestaurerTout, btnViderCorbeille } from "./DOM/element.js";
import { showErrors, clearErrors, initErrorListeners, initPhoneFormatting } from "./UI/errorRenderer.js";
import { renderDrawer, restaurerTousSelectionnes } from "./UI/drawerRenderer.js";
import { getEtudiantsDesactives, viderCorbeille } from "./Store/studentStore.js";
import { btnRestaurer } from "./DOM/element.js";
import {
    addModal, addForm, modalTitre,
    inpNom, inpPrenom, inpEmail, inpTelephone,
    inpFormation, inpAdresse, inpPays,
    btnAjout, btnFermerModal,
    btnVueTableau, btnVueCartes,
    viewTableau, viewCartes,
    confirmModal, confirmMessage,
    btnConfirmAnnuler, btnConfirmOk,
} from "./DOM/element.js";

let vueActive = "tableau";
let etudiantEnCoursModification = null;
let idEtudiantADesactiver = null;


window.refreshUI = refreshUI;

// ========== MODAL AJOUT/MODIFICATION ==========

function ouvrirModalAjout() {
    if (!addModal) return;
    
    etudiantEnCoursModification = null;
    modalTitre.textContent = "Nouvel étudiant";
    
    inpNom.value = "";
    inpPrenom.value = "";
    inpEmail.value = "";
    inpTelephone.value = "";
    inpFormation.value = "";
    inpAdresse.value = "";
    inpPays.value = "+221";
    
    clearErrors();
    addModal.classList.add("active");
}

function ouvrirModalModification(id) {
    if (!addModal) return;
    
    const etudiant = getEtudiantById(id);
    if (!etudiant) {
        toastError("Erreur", "Étudiant introuvable");
        return;
    }
    
    etudiantEnCoursModification = id;
    modalTitre.textContent = "Modifier l'étudiant";
    
    inpNom.value = etudiant.nom || "";
    inpPrenom.value = etudiant.prenom || "";
    inpEmail.value = etudiant.email || "";
    inpAdresse.value = etudiant.adresse || "";
    inpFormation.value = etudiant.formation || "";
    
    if (etudiant.telephone) {
        const parts = etudiant.telephone.split(" ");
        if (parts.length >= 2) {
            inpPays.value = parts[0];
            inpTelephone.value = parts.slice(1).join(" ");
        }
    } else {
        inpPays.value = "+221";
        inpTelephone.value = "";
    }
    
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

    const errors = validateForm(etudiant, codePays);
    
    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }

    etudiant.telephone = telephoneComplet;

    try {
        if (etudiantEnCoursModification) {
            updateEtudiant(etudiantEnCoursModification, etudiant);
            toastSuccess("Succès", "Étudiant modifié !");
        } else {
            addEtudiant(etudiant);
            toastSuccess("Succès", "Étudiant ajouté !");
        }
        fermerModal();
        refreshUI();
    } catch (error) {
        toastError("Erreur", error.message);
    }
}

// ========== CONFIRMATION DÉSACTIVATION ==========

function ouvrirModalConfirmation(id, nom, prenom) {
    if (!confirmModal) return;
    idEtudiantADesactiver = id;
    confirmMessage.innerHTML = `
        Êtes-vous sûr de vouloir supprimer <strong>${prenom} ${nom}</strong> ?<br>
    `;
    confirmModal.classList.add("active");
}

function fermerModalConfirmation() {
    confirmModal?.classList.remove("active");
    idEtudiantADesactiver = null;
}

function executerDesactivation() {
    if (!idEtudiantADesactiver) return;
    try {
        desactiverUnEtudiant(idEtudiantADesactiver);
        fermerModalConfirmation();
        refreshUI();
        toastSuccess("Succès", "Étudiant supprimer");
    } catch (error) {
        toastError("Erreur", "Échec de la suppression");
    }
}

function gererDesactivation(id) {
    const etudiant = getEtudiantById(id);
    if (etudiant) {
        ouvrirModalConfirmation(id, etudiant.nom, etudiant.prenom);
    }
}

// ========== AFFICHAGE ==========

function refreshUI() {
    const etudiants = getEtudiants();
    const handlers = {
        onModifier: ouvrirModalModification,
        onDesactiver: gererDesactivation,
    };
    
    if (vueActive === "tableau") {
        renderEtudiantList(etudiants, handlers);
        viewTableau.style.display = "block";
        viewCartes.style.display = "none";
        btnVueTableau?.classList.add("active");
        btnVueCartes?.classList.remove("active");
    } else {
        renderEtudiantCarteList(etudiants, handlers);
        viewTableau.style.display = "none";
        viewCartes.style.display = "block";
        btnVueTableau?.classList.remove("active");
        btnVueCartes?.classList.add("active");
    }
}


// ========== FONCTIONS DRAWER ==========

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

function handleRestaurerTout() {
    restaurerTousSelectionnes();
    fermerDrawer();
    refreshUI();
    toastSuccess("Succès", "Étudiants restaurés !");
}

function handleViderCorbeille() {
    const desactives = getEtudiantsDesactives();
    if (desactives.length === 0) {
        toastError("Info", "La corbeille est déjà vide");
        return;
    }
    
    if (confirm(`Supprimer définitivement ${desactives.length} étudiant(s) ?`)) {
        viderCorbeille();
        fermerDrawer();
        toastSuccess("Succès", "Corbeille vidée");
    }
}

// ========== EVENT LISTENERS ==========

btnAjout?.addEventListener("click", ouvrirModalAjout);
btnFermerModal?.addEventListener("click", fermerModal);
addForm?.addEventListener("submit", handleSubmit);
document.getElementById("btn-annuler")?.addEventListener("click", fermerModal);

btnConfirmAnnuler?.addEventListener("click", fermerModalConfirmation);
btnConfirmOk?.addEventListener("click", executerDesactivation);

confirmModal?.addEventListener("click", e => {
    if (e.target === confirmModal) fermerModalConfirmation();
});

addModal?.addEventListener("click", e => {
    if (e.target === addModal) fermerModal();
});

btnVueTableau?.addEventListener("click", () => { vueActive = "tableau"; refreshUI(); });
btnVueCartes?.addEventListener("click", () => { vueActive = "cartes"; refreshUI(); });

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        if (confirmModal?.classList.contains("active")) fermerModalConfirmation();
        else if (addModal?.classList.contains("active")) fermerModal();
    }
});

// ========== INITIALISATION ==========
initErrorListeners();
initPhoneFormatting();
refreshUI();