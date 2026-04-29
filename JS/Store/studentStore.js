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
    };
}

export function getEtudiants() {
    // Ne retourner que les étudiants avec statut = true
    return etudiants.filter(e => e.statut === true);
}

export function ajouterUnEtudiantStore(etudiant) {
    etudiants.push(normalizeEtudiant(etudiant)); // Correction: normalizeEtudiant au lieu de normaliserEtudiant
    sauvegarderLesEtudiants();
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