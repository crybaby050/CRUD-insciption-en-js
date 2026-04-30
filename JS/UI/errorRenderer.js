export function showErrors(errors) {
    clearErrors();
    
    const fields = ["nom", "prenom", "email", "telephone", "adresse", "formation"];
    
    fields.forEach((field) => {
        const errEl = document.getElementById(`err-${field}`);
        const inputEl = document.getElementById(`inp-${field}`);
        
        if (errors[field]) {
            if (errEl) {
                errEl.textContent = errors[field];
                errEl.style.display = "block";
            }
            if (inputEl) {
                inputEl.classList.add("invalid");
                inputEl.style.borderColor = "#ef4444";
            }
        }
    });
    
    // Focus sur le premier champ en erreur
    const firstErrorField = fields.find((f) => errors[f]);
    if (firstErrorField) {
        const firstInput = document.getElementById(`inp-${firstErrorField}`);
        if (firstInput) {
            firstInput.focus();
        }
    }
}

export function clearErrors() {
    const fields = ["nom", "prenom", "email", "telephone", "adresse", "formation"];
    
    fields.forEach((field) => {
        const errEl = document.getElementById(`err-${field}`);
        const inputEl = document.getElementById(`inp-${field}`);
        
        if (errEl) {
            errEl.textContent = "";
            errEl.style.display = "none";
        }
        if (inputEl) {
            inputEl.classList.remove("invalid");
            inputEl.style.borderColor = "";
        }
    });
}

export function initValidationListeners() {
    const fields = ["nom", "prenom", "email", "telephone", "adresse", "formation"];
    
    fields.forEach((field) => {
        const inputEl = document.getElementById(`inp-${field}`);
        if (inputEl) {
            // Effacer l'erreur quand l'utilisateur tape
            inputEl.addEventListener("input", () => {
                const errEl = document.getElementById(`err-${field}`);
                if (errEl) {
                    errEl.textContent = "";
                    errEl.style.display = "none";
                }
                inputEl.classList.remove("invalid");
                inputEl.style.borderColor = "";
            });
        }
    });
    
    initPhoneValidation();
}

function initPhoneValidation() {
    const inpPays = document.getElementById("inp-pays");
    const inpTelephone = document.getElementById("inp-telephone");
    
    if (!inpPays || !inpTelephone) return;
    
    // Mettre à jour le placeholder et la longueur max quand le pays change
    inpPays.addEventListener("change", () => {
        const countryCode = inpPays.value;
        inpTelephone.value = "";
        inpTelephone.placeholder = countryCode === "+221" ? "77 123 45 67" : "2 123 456";
        inpTelephone.maxLength = countryCode === "+221" ? 11 : 9; // Avec les espaces
        
        // Effacer l'erreur
        const errEl = document.getElementById("err-telephone");
        if (errEl) {
            errEl.textContent = "";
            errEl.style.display = "none";
        }
        inpTelephone.classList.remove("invalid");
        inpTelephone.style.borderColor = "";
    });
    
    inpTelephone.addEventListener("input", (e) => {
        const countryCode = inpPays.value;
        let value = e.target.value.replace(/\D/g, "");
        
        // Limiter la longueur selon le pays
        const maxLength = countryCode === "+221" ? 9 : 7;
        value = value.substring(0, maxLength);
        
        // Formater selon le pays
        if (countryCode === "+221") {
            // Format Sénégal : XX XXX XX XX
            if (value.length > 2) value = value.substring(0, 2) + " " + value.substring(2);
            if (value.length > 6) value = value.substring(0, 6) + " " + value.substring(6);
            if (value.length > 9) value = value.substring(0, 9) + " " + value.substring(9);
        } else {
            // Format Gambie : X XXX XXX
            if (value.length > 1) value = value.substring(0, 1) + " " + value.substring(1);
            if (value.length > 5) value = value.substring(0, 5) + " " + value.substring(5);
        }
        
        e.target.value = value;
    });
    
    inpTelephone.addEventListener("blur", () => {
        const countryCode = inpPays.value;
        const phoneNumber = inpTelephone.value.replace(/\D/g, "");
        
        if (phoneNumber) {
            const { validatePhoneByCountry } = require("../Utils/validators.js");
            const error = validatePhoneByCountry(phoneNumber, countryCode);
            
            if (error) {
                const errEl = document.getElementById("err-telephone");
                if (errEl) {
                    errEl.textContent = error;
                    errEl.style.display = "block";
                }
                inpTelephone.classList.add("invalid");
                inpTelephone.style.borderColor = "#ef4444";
            }
        }
    });
}