// app.js - CORRIGÉ
import { addEtudiant, updateEtudiant } from "./Services/service.js";
import { getEtudiants } from "./Store/studentStore.js";
import { renderEtudiantList, renderEtudiantCarteList } from "./UI/etudiantRenderer.js";
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
} from "./DOM/element.js";

let vueActive = "tableau";

//On initialise une variable pour quand c'est le bouton modifier qui est selectionner
let etudiantEnCoursModification = null;

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

//Ouvrir le modal pour les modifications
function ouvrirModalModification(id) {
    console.log("ouvrirModalModification appelée pour l'ID:", id);
    if (!addModal) return;
    
    const etudiant = getEtudiantById(id);
    if (!etudiant) {
        afficherToast("Étudiant introuvable", "error");
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
        addEtudiant(etudiant);
        fermerModal();
        refreshUI();
        afficherToast("Étudiant ajouté avec succès !");
    } catch (error) {
        afficherToast(error.message, "error");
        console.error("Erreur lors de l'ajout :", error);
    }
}

function refreshUI() {
    const etudiants = getEtudiants();
    const handlers = {
        onModifier: null,
        onDesactiver: null,
    };
    
    if (vueActive === "tableau") {
        renderEtudiantList(etudiants, handlers);
        if (viewTableau) viewTableau.style.display = "block";
        if (viewCartes) viewCartes.style.display = "none";
        if (btnVueTableau) btnVueTableau.classList.add("active");
        if (btnVueCartes) btnVueCartes.classList.remove("active");
    } else {
        renderEtudiantCarteList(etudiants, handlers);
        if (viewTableau) viewTableau.style.display = "none";
        if (viewCartes) viewCartes.style.display = "block";
        if (btnVueTableau) btnVueTableau.classList.remove("active");
        if (btnVueCartes) btnVueCartes.classList.add("active");
    }
}

function afficherToast(message, type = "success") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;
    
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.style.background = type === "error" ? "#ef4444" : "#2A9D8F";
    
    toast.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === "error" ? 
                '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' :
                '<polyline points="20 6 9 17 4 12"/>'
            }
        </svg>
        <span style="font-size: 14px; flex: 1;">${message}</span>
        <button class="toast-close" style="background:none;border:none;color:white;cursor:pointer;font-size:18px;padding:0 4px;">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    const closeBtn = toast.querySelector(".toast-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => toast.remove());
    }
    
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

if (btnAjout) btnAjout.addEventListener("click", ouvrirModalAjout);
if (btnFermerModal) btnFermerModal.addEventListener("click", fermerModal);
if (addForm) addForm.addEventListener("submit", handleSubmit);

const btnAnnuler = document.getElementById("btn-annuler");
if (btnAnnuler) btnAnnuler.addEventListener("click", fermerModal);

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


refreshUI();