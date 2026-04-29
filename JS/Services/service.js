import {
    ajouterUnEtudiantStore, // Correction: même nom que dans studentStore.js
    normalizeEtudiant,
    modifierUnEtudiant,
    desactiverUnEtudiant,
    toutEffacer
} from "../Store/studentStore.js";

export function createEtudiantObject(etudiant) {
    return {
        id: crypto.randomUUID(),
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        telephone: etudiant.telephone,
        adresse: etudiant.adresse || "",
        formation: etudiant.formation,
        statut: true, // Toujours true à la création
        createdAt: new Date(),
    };
}

export function addEtudiant(etudiant) {
    // Validation de tous les champs obligatoires
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

    const nouvelEtudiant = createEtudiantObject(etudiant);
    ajouterUnEtudiantStore(nouvelEtudiant); // Correction: bon nom de fonction
    return nouvelEtudiant;
}