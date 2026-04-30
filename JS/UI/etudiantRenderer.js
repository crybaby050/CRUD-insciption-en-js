import { tableBody, cardGrid } from "../DOM/element.js";

export function renderEtudiant(etudiant, { onModifier, onDesactiver }) {
    const tr = document.createElement("tr");
    tr.classList.add("student-row");
    tr.style.borderBottom = "1px solid var(--border)";
    tr.dataset.id = etudiant.id;

    const dateAjout = etudiant.dateAjout || "N/A";

    tr.innerHTML = `
        <td style="padding:14px 16px;font-weight:500;">${etudiant.prenom}</td>
        <td style="padding:14px 16px;font-weight:500;">${etudiant.nom}</td>
        <td style="padding:14px 16px;font-size:13px;color:var(--text-muted);">${etudiant.email}</td>
        <td style="padding:14px 16px;font-size:13px;color:var(--text-muted);">${etudiant.telephone}</td>
        <td style="padding:14px 16px;font-size:13px;color:var(--text-muted);">${dateAjout}</td>
        <td style="padding:14px 16px;">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-pale text-green-dark">
                ${etudiant.formation}
            </span>
        </td>
        <td style="padding:14px 16px;">
            <div class="flex gap-2">
                <button class="btn-modifier w-8 h-8 rounded-lg bg-green text-white flex items-center justify-center" title="Modifier l'étudiant">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="btn-desactiver w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center" title="Désactiver l'étudiant">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/>
                        <path d="M14 11v6"/>
                    </svg>
                </button>
            </div>
        </td>
    `;

    tr.querySelector(".btn-modifier").addEventListener("click", function() {
        if (onModifier) onModifier(etudiant.id);
    });

    tr.querySelector(".btn-desactiver").addEventListener("click", function() {
        if (onDesactiver) onDesactiver(etudiant.id);
    });

    tableBody.appendChild(tr);
}

export function renderEtudiantCarte(etudiant, { onModifier, onDesactiver }) {
    const div = document.createElement("div");
    div.classList.add("student-card", "rounded-2xl", "p-5", "flex", "flex-col", "gap-4");
    div.dataset.id = etudiant.id;

    const initiales = (etudiant.prenom[0] || "") + (etudiant.nom[0] || "");
    const dateAjout = etudiant.dateAjout || "N/A";

    div.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-green flex items-center justify-center text-white font-bold">
                ${initiales}
            </div>
            <div>
                <p class="font-poppins font-semibold">${etudiant.prenom} ${etudiant.nom}</p>
                <p class="text-xs" style="color:var(--text-muted);">${etudiant.email}</p>
            </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-pale text-green-dark">
                ${etudiant.formation}
            </span>
            <span class="text-xs" style="color:var(--text-muted);">${dateAjout}</span>
        </div>
        <div class="flex gap-2 pt-2">
            <button class="btn-modifier flex-1 py-2 rounded-lg bg-green text-white text-sm">Modifier</button>
            <button class="btn-desactiver flex-1 py-2 rounded-lg bg-red-50 text-red-500 text-sm">Supprimer</button>
        </div>
    `;

    div.querySelector(".btn-modifier").addEventListener("click", function() {
        if (onModifier) onModifier(etudiant.id);
    });

    div.querySelector(".btn-desactiver").addEventListener("click", function() {
        if (onDesactiver) onDesactiver(etudiant.id);
    });

    if (cardGrid) {
        cardGrid.appendChild(div);
    }
}

export function renderEtudiantList(etudiants, handlers) {
    if (!tableBody) {
        console.error("tableBody est null");
        return;
    }
    tableBody.innerHTML = "";
    
    if (etudiants.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-8" style="color:var(--text-muted);">
                    Aucun étudiant trouvé
                </td>
            </tr>
        `;
        return;
    }
    
    etudiants.forEach(function(etudiant) {
        renderEtudiant(etudiant, handlers);
    });
}

export function renderEtudiantCarteList(etudiants, handlers) {
    if (!cardGrid) {
        console.error("cardGrid est null, impossible d'afficher les cartes");
        return;
    }
    cardGrid.innerHTML = "";
    
    if (etudiants.length === 0) {
        cardGrid.innerHTML = `
            <div class="col-span-full text-center py-8" style="color:var(--text-muted);">
                Aucun étudiant trouvé
            </div>
        `;
        return;
    }
    
    etudiants.forEach(function(etudiant) {
        renderEtudiantCarte(etudiant, handlers);
    });
}