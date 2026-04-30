const PER_PAGE = 5;
let currentPage = 1;


function getTotalPages(filtered) {
    return Math.max(1, Math.ceil(filtered.length / PER_PAGE));
}

function getPageSlice(filtered) {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
}

export function renderPagination(container, filtered, onPageChange) {
    if (!container) return;
    
    const totalPages = getTotalPages(filtered);
    
    // Corriger la page courante si elle dépasse
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    
    container.innerHTML = "";
    
    // Si une seule page, ne rien afficher
    if (totalPages <= 1) return;
    
    // Bouton Précédent
    const btnPrev = document.createElement("button");
    btnPrev.className = "pagination-btn";
    btnPrev.innerHTML = "‹";
    btnPrev.disabled = currentPage === 1;
    btnPrev.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            onPageChange(getPageSlice(filtered));
            renderPagination(container, filtered, onPageChange);
        }
    });
    container.appendChild(btnPrev);
    
    // Numéros de page
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.className = "pagination-btn" + (i === currentPage ? " active" : "");
        btn.textContent = i;
        btn.addEventListener("click", () => {
            currentPage = i;
            onPageChange(getPageSlice(filtered));
            renderPagination(container, filtered, onPageChange);
        });
        container.appendChild(btn);
    }
    
    // Bouton Suivant
    const btnNext = document.createElement("button");
    btnNext.className = "pagination-btn";
    btnNext.innerHTML = "›";
    btnNext.disabled = currentPage === totalPages;
    btnNext.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            onPageChange(getPageSlice(filtered));
            renderPagination(container, filtered, onPageChange);
        }
    });
    container.appendChild(btnNext);
}

export function getCurrentPageSlice(filtered) {
    return getPageSlice(filtered);
}

export function resetPagination() {
    currentPage = 1;
}