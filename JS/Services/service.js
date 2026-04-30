import {
    ajouterUnEtudiantStore, // Correction: même nom que dans studentStore.js
    normalizeEtudiant,
    modifierUnEtudiant,
    desactiverUnEtudiant,
    toutEffacer,
    getEtudiantById  
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

// fonction pour modifier un étudiant
export function updateEtudiant(id, modifications) {
    // Vérifier que l'étudiant existe
    const etudiantExistant = getEtudiantById(id);
    if (!etudiantExistant) {
        throw new Error("Étudiant introuvable !");
    }

    // Validation des champs modifiés
    if (!modifications.nom || !modifications.nom.trim()) {
        throw new Error("Le nom est obligatoire !");
    }
    if (!modifications.prenom || !modifications.prenom.trim()) {
        throw new Error("Le prénom est obligatoire !");
    }
    if (!modifications.email || !modifications.email.trim()) {
        throw new Error("L'email est obligatoire !");
    }
    if (!modifications.telephone || !modifications.telephone.trim()) {
        throw new Error("Le téléphone est obligatoire !");
    }
    if (!modifications.adresse || !modifications.adresse.trim()) {
        throw new Error("L'adresse est obligatoire !");
    }
    if (!modifications.formation || !modifications.formation.trim()) {
        throw new Error("La formation est obligatoire !");
    }

    modifierUnEtudiant(id, modifications);
    return getEtudiantById(id);
}