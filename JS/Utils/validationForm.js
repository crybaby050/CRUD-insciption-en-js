import { emailExiste, telephoneExiste } from "../Store/studentStore.js";
// Regex pour la validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Opérateurs par pays
const OPERATORS_SENEGAL = ["70", "71", "75", "76", "77", "78"];
const OPERATORS_GAMBIA = ["2", "3", "6", "7", "9"];

const PHONE_CONFIG = {
    "+221": {
        name: "Sénégal",
        totalLength: 9, 
        operators: OPERATORS_SENEGAL,
        operatorLength: 2,
        example: "771234567",
        format: "XX XXX XX XX"
    },
    "+220": {
        name: "Gambie",
        totalLength: 7, 
        operators: OPERATORS_GAMBIA,
        operatorLength: 1,
        example: "2123456",
        format: "X XXX XXX"
    }
};


export function validateForm(data, countryCode = "+221", excludeId = null) {
    const errors = {};

    // Validation du prénom
    if (!data.prenom || !data.prenom.trim()) {
        errors.prenom = "Le prénom est requis.";
    }

    // Validation du nom
    if (!data.nom || !data.nom.trim()) {
        errors.nom = "Le nom est requis.";
    }

    // Validation de l'email
    if (!data.email || !data.email.trim()) {
        errors.email = "L'email est requis.";
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
        errors.email = "Format invalide. Ex: nom@domaine.com";
    } else if (emailExiste(data.email.trim(), excludeId)) {
        errors.email = "Cet email est déjà utilisé par un autre étudiant.";
    }

    // Validation du téléphone selon le pays
    if (!data.telephone || !data.telephone.trim()) {
        errors.telephone = "Le numéro est requis.";
    } else {
        const phoneError = validatePhoneByCountry(data.telephone.trim(), countryCode);
        if (phoneError) {
            errors.telephone = phoneError;
        } else if (telephoneExiste(data.telephone.trim(), excludeId)) {
            errors.telephone = "Ce numéro de téléphone est déjà utilisé.";
        }
    }

    // Validation de l'adresse
    if (!data.adresse || !data.adresse.trim()) {
        errors.adresse = "L'adresse est requise.";
    }

    // Validation de la formation
    if (!data.formation) {
        errors.formation = "Veuillez choisir une formation.";
    }

    return errors;
}

export function validatePhoneByCountry(phoneNumber, countryCode = "+221") {
    const config = PHONE_CONFIG[countryCode];
    if (!config) return "Code pays invalide.";

    // Nettoyer le numéro (garder uniquement les chiffres)
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Vérifier la longueur totale
    if (cleanNumber.length !== config.totalLength) {
        return `Le numéro ${config.name} doit contenir exactement ${config.totalLength} chiffres.`;
    }

    // Vérifier l'opérateur
    const operatorCode = cleanNumber.substring(0, config.operatorLength);
    if (!config.operators.includes(operatorCode)) {
        const operatorsList = config.operators.join(", ");
        return `L'opérateur ${operatorCode} n'est pas valide. Opérateurs ${config.name} : ${operatorsList}`;
    }

    // Vérifier que ce ne sont que des chiffres
    if (!/^\d+$/.test(cleanNumber)) {
        return "Le numéro ne doit contenir que des chiffres.";
    }

    return null;
}


export function getPhonePlaceholder(countryCode = "+221") {
    const config = PHONE_CONFIG[countryCode];
    return config ? config.example : "771234567";
}

export function getPhoneMaxLength(countryCode = "+221") {
    const config = PHONE_CONFIG[countryCode];
    return config ? config.totalLength : 9;
}

export function formatPhoneNumber(phoneNumber, countryCode = "+221") {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const config = PHONE_CONFIG[countryCode];
    
    if (!config) return phoneNumber;
    
    if (countryCode === "+221") {
        // Format Sénégal : XX XXX XX XX
        if (cleanNumber.length <= 2) return cleanNumber;
        if (cleanNumber.length <= 5) return cleanNumber.substring(0, 2) + " " + cleanNumber.substring(2);
        if (cleanNumber.length <= 7) return cleanNumber.substring(0, 2) + " " + cleanNumber.substring(2, 5) + " " + cleanNumber.substring(5);
        return cleanNumber.substring(0, 2) + " " + cleanNumber.substring(2, 5) + " " + cleanNumber.substring(5, 7) + " " + cleanNumber.substring(7, 9);
    }
    
    // Format Gambie : X XXX XXX
    if (cleanNumber.length <= 1) return cleanNumber;
    if (cleanNumber.length <= 4) return cleanNumber.substring(0, 1) + " " + cleanNumber.substring(1);
    return cleanNumber.substring(0, 1) + " " + cleanNumber.substring(1, 4) + " " + cleanNumber.substring(4, 7);
}

export { EMAIL_REGEX, PHONE_CONFIG };