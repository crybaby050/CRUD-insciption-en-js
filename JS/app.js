// app.js
import { addEtudiant, updateEtudiant } from "./Services/service.js";
import { getEtudiants, getEtudiantById, desactiverUnEtudiant } from "./Store/studentStore.js";
import { renderEtudiantList, renderEtudiantCarteList } from "./UI/etudiantRenderer.js";
import { showToast, toastSuccess, toastError } from "./UI/toastRenderer.js";
import {
    addModal,
    addForm,
    modalTitre,
    inpNom,
    inpPrenom,
    inpEmail,
    inpTelephone,
    btnAjout,
    btnFermerModal,
    inpFormation,
    inpAdresse,
    inpPays,
    btnVueTableau,
    btnVueCartes,
    viewTableau,
    viewCartes,
    confirmModal,
    confirmMessage,
    btnConfirmAnnuler,
    btnConfirmOk,
} from "./DOM/element.js";

let vueActive = "tableau";
let etudiantEnCoursModification = null;
let idEtudiantADesactiver = null;

function ouvrirModalAjout() {
    console.log("ouvrirModalAjout appelée");
    if (!addModal) return;
    
    etudiantEnCoursModification = null;
    modalTitre.textContent = "Nouvel étudiant";
    
    if (inpNom) inpNom.value = "";
    if (inpPrenom) inpPrenom.value = "";
    if (inpEmail) inpEmail.value = "";
    if (inpTelephone) inpTelephone.value = "";
    if (inpFormation) inpFormation.value = "";
    if (inpAdresse) inpAdresse.value = "";
    if (inpPays) inpPays.value = "+221";

    addModal.classList.add("active");
}

function ouvrirModalModification(id) {
    console.log("ouvrirModalModification appelée pour l'ID:", id);
    if (!addModal) return;
    
    const etudiant = getEtudiantById(id);
    if (!etudiant) {
        toastError("Erreur", "Étudiant introuvable");
        return;
    }
    
    etudiantEnCoursModification = id;
    modalTitre.textContent = "Modifier l'étudiant";
    
    if (inpNom) inpNom.value = etudiant.nom || "";
    if (inpPrenom) inpPrenom.value = etudiant.prenom || "";
    if (inpEmail) inpEmail.value = etudiant.email || "";
    if (inpAdresse) inpAdresse.value = etudiant.adresse || "";
    if (inpFormation) inpFormation.value = etudiant.formation || "";
    
    if (etudiant.telephone) {
        const parts = etudiant.telephone.split(" ");
        if (parts.length >= 2) {
            if (inpPays) inpPays.value = parts[0];
            if (inpTelephone) inpTelephone.value = parts.slice(1).join(" ");
        } else {
            if (inpPays) inpPays.value = "+221";
            if (inpTelephone) inpTelephone.value = etudiant.telephone;
        }
    } else {
        if (inpPays) inpPays.value = "+221";
        if (inpTelephone) inpTelephone.value = "";
    }

    addModal.classList.add("active");
}

function fermerModal() {
    if (addModal) {
        addModal.classList.remove("active");
        etudiantEnCoursModification = null;
    }
}

function ouvrirModalConfirmation(id, nom, prenom) {
    if (!confirmModal) return;
    
    idEtudiantADesactiver = id;
    
    if (confirmMessage) {
        confirmMessage.innerHTML = `
            Êtes-vous sûr de vouloir désactiver <strong>${prenom} ${nom}</strong> ?<br>
            <span style="font-size: 12px; opacity: 0.8;">Il ne sera plus visible dans la liste.</span>
        `;
    }
    
    confirmModal.classList.add("active");
}

function fermerModalConfirmation() {
    if (confirmModal) {
        confirmModal.classList.remove("active");
        idEtudiantADesactiver = null;
    }
}

function executerDesactivation() {
    if (!idEtudiantADesactiver) return;
    
    try {
        desactiverUnEtudiant(idEtudiantADesactiver);
        fermerModalConfirmation();
        refreshUI();
        toastSuccess("Succès", "Étudiant désactivé avec succès");
    } catch (error) {
        toastError("Erreur", "Erreur lors de la désactivation");
        console.error(error);
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const codePays = inpPays?.value || "+221";
    const numero = inpTelephone?.value.trim() || "";
    const telephoneComplet = numero ? `${codePays} ${numero}` : "";

    const etudiant = {
        nom: inpNom?.value.trim() || "",
        prenom: inpPrenom?.value.trim() || "",
        email: inpEmail?.value.trim() || "",
        telephone: telephoneComplet,
        formation: inpFormation?.value || "",
        adresse: inpAdresse?.value.trim() || "",
    };

    try {
        if (etudiantEnCoursModification) {
            updateEtudiant(etudiantEnCoursModification, etudiant);
            toastSuccess("Succès", "Étudiant modifié avec succès !");
        } else {
            addEtudiant(etudiant);
            toastSuccess("Succès", "Étudiant ajouté avec succès !");
        }
        fermerModal();
        refreshUI();
    } catch (error) {
        toastError("Erreur", error.message);
        console.error("Erreur :", error);
    }
}

function refreshUI() {
    const etudiants = getEtudiants();
    const handlers = {
        onModifier: ouvrirModalModification,
        onDesactiver: gererDesactivation,
    };
    
    if (vueActive === "tableau") {
        renderEtudiantList(etudiants, handlers);
        if (viewTableau) {
            viewTableau.style.display = "block";
            viewTableau.classList.remove("hidden");
        }
        if (viewCartes) {
            viewCartes.style.display = "none";
            viewCartes.classList.add("hidden");
        }
        if (btnVueTableau) btnVueTableau.classList.add("active");
        if (btnVueCartes) btnVueCartes.classList.remove("active");
    } else {
        renderEtudiantCarteList(etudiants, handlers);
        if (viewTableau) {
            viewTableau.style.display = "none";
            viewTableau.classList.add("hidden");
        }
        if (viewCartes) {
            viewCartes.style.display = "block";
            viewCartes.classList.remove("hidden");
            const cardGrid = document.getElementById("card-grid");
            if (cardGrid) {
                cardGrid.style.display = "grid";
            }
        }
        if (btnVueTableau) btnVueTableau.classList.remove("active");
        if (btnVueCartes) btnVueCartes.classList.add("active");
    }
}

function gererDesactivation(id) {
    const etudiant = getEtudiantById(id);
    if (etudiant) {
        ouvrirModalConfirmation(id, etudiant.nom, etudiant.prenom);
    } else {
        toastError("Erreur", "Étudiant introuvable");
    }
}

// Event Listeners
if (btnAjout) btnAjout.addEventListener("click", ouvrirModalAjout);
if (btnFermerModal) btnFermerModal.addEventListener("click", fermerModal);
if (addForm) addForm.addEventListener("submit", handleSubmit);

const btnAnnuler = document.getElementById("btn-annuler");
if (btnAnnuler) btnAnnuler.addEventListener("click", fermerModal);

if (btnConfirmAnnuler) btnConfirmAnnuler.addEventListener("click", fermerModalConfirmation);
if (btnConfirmOk) btnConfirmOk.addEventListener("click", executerDesactivation);

if (confirmModal) {
    confirmModal.addEventListener("click", function(e) {
        if (e.target === confirmModal) fermerModalConfirmation();
    });
}

if (addModal) {
    addModal.addEventListener("click", function(e) {
        if (e.target === addModal) fermerModal();
    });
}

if (btnVueTableau) {
    btnVueTableau.addEventListener("click", () => {
        vueActive = "tableau";
        refreshUI();
    });
}

if (btnVueCartes) {
    btnVueCartes.addEventListener("click", () => {
        vueActive = "cartes";
        refreshUI();
    });
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        if (confirmModal && confirmModal.classList.contains("active")) {
            fermerModalConfirmation();
        } else if (addModal && addModal.classList.contains("active")) {
            fermerModal();
        }
    }
});

// Toast de bienvenue
showToast("info", "Application prête", "Gérez vos inscriptions facilement", 3000);
refreshUI();