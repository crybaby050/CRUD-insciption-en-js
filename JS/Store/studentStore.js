const STORAGE_KEY = "etudiants";

// Charger les étudiants depuis le navigateur au démarrage
let etudiants = chargerLesEtudiants();

// Lit les étudiants sauvegardés dans le navigateur
export function chargerLesEtudiants() {
    const contenu = localStorage.getItem(STORAGE_KEY);
    return contenu ? JSON.parse(contenu) : [];
}

// Sauvegarde la liste des étudiants dans le navigateur
export function sauvegarderLesEtudiants() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(etudiants));
}

// S'assure qu'un étudiant a toujours le bon format
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

// Retourne tous les étudiants
export function getEtudiants() {
    return etudiants;
}

// Ajoute un étudiant à la liste
export function ajouterUnEtudiant(etudiant) {
    etudiants.push(normaliserEtudiant(etudiant));
    sauvegarderLesEtudiants();
}

// Modifie les informations d'un étudiant
export function modifierUnEtudiant(id, modifications) {
    etudiants = etudiants.map(e =>
        e.id === id ? normaliserEtudiant({ ...e, ...modifications }) : e
    );
    sauvegarderLesEtudiants();
}

// Désactive un étudiant en mettant son statut à false
export function desactiverUnEtudiant(id) {
    etudiants = etudiants.map(e =>
        e.id === id ? { ...e, statut: false } : e
    );
    sauvegarderLesEtudiants();
}

// Supprime tous les étudiants
export function toutEffacer() {
    etudiants = [];
    sauvegarderLesEtudiants();
}