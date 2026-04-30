export function filterEtudiants(etudiants, searchTerm = "", formation = "") {
    let filtered = [...etudiants];

    // Filtre par formation
    if (formation) {
        filtered = filtered.filter(e => e.formation === formation);
    }

    // Filtre par recherche (nom, prénom, email, téléphone)
    if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(e => {
            return (
                (e.nom && e.nom.toLowerCase().includes(term)) ||
                (e.prenom && e.prenom.toLowerCase().includes(term)) ||
                (e.email && e.email.toLowerCase().includes(term)) ||
                (e.telephone && e.telephone.toLowerCase().includes(term)) ||
                (e.formation && e.formation.toLowerCase().includes(term))
            );
        });
    }

    return filtered;
}