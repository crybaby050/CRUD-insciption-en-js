import {
    ajouterUnEtudiantStore,
    normalizeEtudiant,
    modifierUnEtudiant,
    desactiverUnEtudiant,
    toutEffacer
} from "../Store/studentStore";

export function createEtudiantObject(etudiant) {
    return {
        id: crypto.randomUUID(),
        nom: etudiant.nom,        // manquant
        prenom: etudiant.prenom,
        email: etudiant.email,
        telephone: etudiant.telephone,
        adresse: etudiant.adresse,
        formation: etudiant.formation,
        statut: Boolean(etudiant.statut),
        createdAt: etudiant.createdAt ? new Date(etudiant.createdAt) : new Date(),
    };
}


export function addEtudiant(etudiant) {
    // On vérifie que tous les champs obligatoires sont remplis
    if (!etudiant.nom || !etudiant.nom.trim()) {
        throw new Error("Le nom est obligatoire !");
    }

    if (!etudiant.prenom || !etudiant.prenom.trim()) {
        throw new Error("Le prénom est obligatoire !");
    }

    if (!etudiant.email || !etudiant.email.trim()) {
        throw new Error("L'email est obligatoire !");
    }

    if (!etudiant.telephone || !etudiant.telephone.trim()) {
        throw new Error("Le téléphone est obligatoire !");
    }

    if (!etudiant.adresse || !etudiant.adresse.trim()) {
        throw new Error("L'adresse est obligatoire !");
    }

    if (!etudiant.formation || !etudiant.formation.trim()) {
        throw new Error("La formation est obligatoire !");
    }

    // Tous les champs sont valides, on crée l'étudiant et on l'ajoute à la liste
    const nouvelEtudiant = createEtudiantObject(etudiant);
    ajouterUnEtudiant(nouvelEtudiant);
    return nouvelEtudiant;
}