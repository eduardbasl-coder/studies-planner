"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeInventoryPage();
});


/* =========================================
   HLAVNÍ INICIALIZACE
========================================= */

function initializeInventoryPage() {
    const inventoryForm =
        document.getElementById("inventoryForm");

    const addItemButton =
        document.getElementById("addItemButton");

    const cancelItemButton =
        document.getElementById("cancelItemButton");

    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    if (!inventoryForm) {
        return;
    }

    renderInventory();

    addItemButton?.addEventListener("click", () => {
        showInventoryForm();
    });

    cancelItemButton?.addEventListener("click", () => {
        hideInventoryForm();
    });

    inventoryForm.addEventListener("submit", handleInventorySubmit);

    searchInput?.addEventListener("input", () => {
        renderInventory();
    });

    categoryFilter?.addEventListener("change", () => {
        renderInventory();
    });
}


/* =========================================
   ZOBRAZENÍ / SKRYTÍ FORMULÁŘE
========================================= */

function showInventoryForm() {
    const formPanel =
        document.getElementById("inventoryFormPanel");

    if (!formPanel) {
        return;
    }

    formPanel.classList.remove("hidden");

    formPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function hideInventoryForm() {
    const formPanel =
        document.getElementById("inventoryFormPanel");

    const inventoryForm =
        document.getElementById("inventoryForm");

    if (!formPanel) {
        return;
    }

    formPanel.classList.add("hidden");

    inventoryForm?.reset();
}


/* =========================================
   ULOŽENÍ NOVÉ ZÁSOBY
========================================= */

function handleInventorySubmit(event) {
    event.preventDefault();

    const form =
        event.currentTarget;

    const formData =
        new FormData(form);

    const item = {
        name: formData.get("name").trim(),
        category: formData.get("category"),
        quantity: formData.get("quantity"),
        unit: formData.get("unit"),
        expirationDate: formData.get("expirationDate"),
        note: formData.get("note").trim()
    };

    if (!item.name) {
        alert("Zadej název zásoby.");

        return;
    }

    if (Number(item.quantity) < 0) {
        alert("Množství nemůže být záporné.");

        return;
    }

    window.ZasobyStorage.addInventoryItem(item);

    hideInventoryForm();
    renderInventory();
}


/* =========================================
   VYKRESLENÍ TABULKY
========================================= */

function renderInventory() {
    const tableBody =
        document.getElementById("inventoryTableBody");

    const inventoryCount =
        document.getElementById("inventoryCount");

    if (!tableBody) {
        return;
    }

    const inventory =
        window.ZasobyStorage.getInventory();

    const filteredInventory =
        getFilteredInventory(inventory);

    tableBody.innerHTML = "";

    if (filteredInventory.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Nebyly nalezeny žádné zásoby.
                </td>
            </tr>
        `;
    } else {
        filteredInventory.forEach((item) => {
            tableBody.appendChild(
                createInventoryRow(item)
            );
        });
    }

    if (inventoryCount) {
        inventoryCount.textContent =
            `${filteredInventory.length} položek`;
    }
}


/* =========================================
   FILTROVÁNÍ
========================================= */

function getFilteredInventory(inventory) {
    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const searchTerm =
        searchInput?.value.trim().toLowerCase() || "";

    const selectedCategory =
        categoryFilter?.value || "all";

    return inventory.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
}


/* =========================================
   VYTVOŘENÍ ŘÁDKU TABULKY
========================================= */

function createInventoryRow(item) {
    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>
            <strong>${escapeHtml(item.name)}</strong>

            ${
                item.note
                    ? `<small>${escapeHtml(item.note)}</small>`
                    : ""
            }
        </td>

        <td>
            ${getCategoryName(item.category)}
        </td>

        <td>
            ${item.quantity} ${escapeHtml(item.unit)}
        </td>

        <td>
            ${
                item.expirationDate
                    ? formatDate(item.expirationDate)
                    : "Neuvedeno"
            }
        </td>

        <td>
            <span class="status-badge ${getExpirationClass(item.expirationDate)}">
                ${getExpirationLabel(item.expirationDate)}
            </span>
        </td>

        <td>
            <button
                class="danger-button"
                type="button"
                data-delete-id="${item.id}"
            >
                Smazat
            </button>
        </td>
    `;

    const deleteButton =
        row.querySelector("[data-delete-id]");

    deleteButton.addEventListener("click", () => {
        deleteInventoryItem(item.id);
    });

    return row;
}


/* =========================================
   SMAZÁNÍ POLOŽKY
========================================= */

function deleteInventoryItem(id) {
    const inventory =
        window.ZasobyStorage.getInventory();

    const item =
        inventory.find((entry) => entry.id === id);

    if (!item) {
        return;
    }

    const confirmed =
        confirm(
            `Opravdu chceš smazat položku "${item.name}"?`
        );

    if (!confirmed) {
        return;
    }

    window.ZasobyStorage.deleteInventoryItem(id);

    renderInventory();
}


/* =========================================
   KATEGORIE
========================================= */

function getCategoryName(category) {
    const categories = {
        food: "Potraviny",
        water: "Voda",
        medicine: "Léky",
        equipment: "Vybavení",
        other: "Ostatní"
    };

    return categories[category] || "Ostatní";
}


/* =========================================
   DATUMY A STAV SPOTŘEBY
========================================= */

function formatDate(dateString) {
    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("cs-CZ");
}


function getExpirationClass(dateString) {
    if (!dateString) {
        return "status-unknown";
    }

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);

    const expirationDate =
        new Date(`${dateString}T00:00:00`);

    const difference =
        expirationDate - today;

    const daysRemaining =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );

    if (daysRemaining < 0) {
        return "status-expired";
    }

    if (daysRemaining <= 30) {
        return "status-warning";
    }

    return "status-ok";
}


function getExpirationLabel(dateString) {
    if (!dateString) {
        return "Bez data";
    }

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);

    const expirationDate =
        new Date(`${dateString}T00:00:00`);

    const difference =
        expirationDate - today;

    const daysRemaining =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );

    if (daysRemaining < 0) {
        return "Prošlé";
    }

    if (daysRemaining <= 30) {
        return "Brzy expiruje";
    }

    return "V pořádku";
}


/* =========================================
   OCHRANA TEXTU V TABULCE
========================================= */

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}