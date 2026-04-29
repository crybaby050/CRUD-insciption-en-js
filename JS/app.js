// app.js - CORRIGÉ
import { addEtudiant } from "./Services/service.js";
import { getEtudiants } from "./Store/studentStore.js";
import { renderEtudiantList } from "./UI/etudiantRenderer.js";
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
    inpFormation, // AJOUTÉ
    inpAdresse,   // AJOUTÉ
} from "./DOM/element.js";

function ouvrirModalAjout() {
    console.log("ouvrirModalAjout appelée");
    if (!addModal) return;
    
    modalTitre.textContent = "Nouvel étudiant";
    if (inpNom) inpNom.value = "";
    if (inpPrenom) inpPrenom.value = "";
    if (inpEmail) inpEmail.value = "";
    if (inpTelephone) inpTelephone.value = "";
    if (inpFormation) inpFormation.value = "DEV";
    if (inpAdresse) inpAdresse.value = "";

    addModal.classList.add("active");
}

function fermerModal() {
    if (addModal) {
        addModal.classList.remove("active");
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const etudiant = {
        nom: inpNom?.value || "",
        prenom: inpPrenom?.value || "",
        email: inpEmail?.value || "",
        telephone: inpTelephone?.value || "",
        formation: inpFormation?.value || "DEV",
        adresse: inpAdresse?.value || "",
    };

    try {
        addEtudiant(etudiant);
        fermerModal();
        refreshUI();
    } catch (error) {
        alert(error.message);
        console.error("Erreur lors de l'ajout :", error);
    }
}

function refreshUI() {
    const etudiants = getEtudiants();
    const handlers = {
        onModifier: null,
        onDesactiver: null,
    };
    renderEtudiantList(etudiants, handlers);
}

if (btnAjout) {
    btnAjout.addEventListener("click", ouvrirModalAjout);
}

if (btnFermerModal) {
    btnFermerModal.addEventListener("click", fermerModal);
}

if (addForm) {
    addForm.addEventListener("submit", handleSubmit);
}

// Bouton annuler dans le modal
const btnAnnuler = document.getElementById("btn-annuler");
if (btnAnnuler) {
    btnAnnuler.addEventListener("click", fermerModal);
}

// Fermer le modal en cliquant sur l'overlay
if (addModal) {
    addModal.addEventListener("click", function(e) {
        if (e.target === addModal) {
            fermerModal();
        }
    });
}

refreshUI();