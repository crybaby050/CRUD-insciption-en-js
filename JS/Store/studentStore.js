import { formatTaskDate } from "../Utils/studentDate.js";

const STORAGE_KEY = "etudiants";

let etudiants = chargerLesEtudiants();

export function chargerLesEtudiants() {
    const contenu = localStorage.getItem(STORAGE_KEY);
    return contenu ? JSON.parse(contenu) : [];
}

export function sauvegarderLesEtudiants() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(etudiants));
}

export function normalizeEtudiant(etudiant) {
    return {
        id: etudiant.id,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        telephone: etudiant.telephone,
        adresse: etudiant.adresse,
        formation: etudiant.formation,
        statut: Boolean(etudiant.statut),
        createdAt: etudiant.createdAt ? new Date(etudiant.createdAt) : new Date(),
        dateAjout: formatTaskDate(etudiant.createdAt || new Date())
    };
}

export function getEtudiants() {
    return etudiants.filter(e => e.statut === true);
}

export function ajouterUnEtudiantStore(etudiant) {
    etudiants.push(normalizeEtudiant(etudiant));
    sauvegarderLesEtudiants();
}

// fonction : récupérer un étudiant par son ID
export function getEtudiantById(id) {
    return etudiants.find(e => e.id === id) || null;
}

// fonction : récupérer tous les étudiants
export function getAllEtudiants() {
    return etudiants;
}

export function modifierUnEtudiant(id, modifications) {
    etudiants = etudiants.map(e =>
        e.id === id ? normalizeEtudiant({ ...e, ...modifications }) : e
    );
    sauvegarderLesEtudiants();
}

export function desactiverUnEtudiant(id) {
    etudiants = etudiants.map(e =>
        e.id === id ? { ...e, statut: false } : e
    );
    sauvegarderLesEtudiants();
}

export function toutEffacer() {
    etudiants = [];
    sauvegarderLesEtudiants();
}


// Récupérer tous les étudiants désactivés
export function getEtudiantsDesactives() {
    return etudiants.filter(e => e.statut === false);
}

// Restaurer un étudiant (remettre statut à true)
export function restaurerEtudiant(id) {
    etudiants = etudiants.map(e =>
        e.id === id ? { ...e, statut: true } : e
    );
    sauvegarderLesEtudiants();
}

// Vider la corbeille (supprimer définitivement les désactivés)
// export function viderCorbeille() {
//     etudiants = etudiants.filter(e => e.statut === true);
//     sauvegarderLesEtudiants();
// }



export function emailExiste(email, excludeId = null) {
    return etudiants.some(e => 
        e.email.toLowerCase() === email.toLowerCase() && 
        e.id !== excludeId
    );
}

export function telephoneExiste(telephone, excludeId = null) {
    // Nettoyer le téléphone pour la comparaison (garder que les chiffres)
    const cleanPhone = telephone.replace(/\D/g, "");
    
    return etudiants.some(e => {
        const existingPhone = (e.telephone || "").replace(/\D/g, "");
        return existingPhone === cleanPhone && e.id !== excludeId;
    });
}