"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard();
});


/* =========================================
   INICIALIZACE DASHBOARDU
========================================= */

function initializeDashboard() {
    if (!window.ZasobyStorage) {
        return;
    }

    renderDashboard();
}


/* =========================================
   HLAVNÍ VYKRESLENÍ
========================================= */

function renderDashboard() {
    const inventory =
        window.ZasobyStorage.getInventory();

    updateMainStatistics(inventory);
    renderCategoryOverview(inventory);
    renderAlertsOverview(inventory);
    renderRecentSupplies(inventory);
}


/* =========================================
   HLAVNÍ STATISTIKY
========================================= */

function updateMainStatistics(inventory) {
    const totalQuantity =
        inventory.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );

    const totalItems =
        inventory.length;

    const expiringItems =
        inventory.filter((item) => {
            return getExpirationStatus(item.expirationDate)
                === "warning";
        }).length;

    const expiredItems =
        inventory.filter((item) => {
            return getExpirationStatus(item.expirationDate)
                === "expired";
        }).length;

    setElementText("totalQuantity", totalQuantity);
    setElementText("totalItems", totalItems);
    setElementText("expiringItems", expiringItems);
    setElementText("expiredItems", expiredItems);
}


/* =========================================
   PŘEHLED KATEGORIÍ
========================================= */

function renderCategoryOverview(inventory) {
    const container =
        document.getElementById("categoryOverview");

    if (!container) {
        return;
    }

    const categories = {
        food: {
            name: "Potraviny",
            icon: "🍲"
        },
        water: {
            name: "Voda",
            icon: "💧"
        },
        medicine: {
            name: "Léky",
            icon: "⚕️"
        },
        equipment: {
            name: "Vybavení",
            icon: "🛠️"
        },
        other: {
            name: "Ostatní",
            icon: "📦"
        }
    };

    const categoryTotals = {};

    inventory.forEach((item) => {
        const category =
            item.category || "other";

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] +=
            Number(item.quantity || 0);
    });

    container.innerHTML = "";

    if (Object.keys(categoryTotals).length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                Zatím nejsou evidovány žádné zásoby.
            </p>
        `;

        return;
    }

    Object.entries(categoryTotals).forEach(
        ([category, quantity]) => {
            const categoryData =
                categories[category] || categories.other;

            const element =
                document.createElement("div");

            element.className = "category-item";

            element.innerHTML = `
                <span class="category-icon">
                    ${categoryData.icon}
                </span>

                <span class="category-name">
                    ${categoryData.name}
                </span>

                <strong class="category-quantity">
                    ${quantity}
                </strong>
            `;

            container.appendChild(element);
        }
    );
}


/* =========================================
   UPOZORNĚNÍ NA EXPIRACI
========================================= */

function renderAlertsOverview(inventory) {
    const container =
        document.getElementById("alertsOverview");

    if (!container) {
        return;
    }

    const alerts =
        inventory
            .filter((item) => {
                const status =
                    getExpirationStatus(item.expirationDate);

                return status === "warning" ||
                    status === "expired";
            })
            .sort((first, second) => {
                return String(
                    first.expirationDate
                ).localeCompare(
                    String(second.expirationDate)
                );
            });

    container.innerHTML = "";

    if (alerts.length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                Žádná kritická upozornění.
            </p>
        `;

        return;
    }

    alerts.forEach((item) => {
        const status =
            getExpirationStatus(item.expirationDate);

        const element =
            document.createElement("div");

        element.className =
            `alert-item ${status}`;

        element.innerHTML = `
            <div>
                <strong>
                    ${escapeDashboardHtml(item.name)}
                </strong>

                <small>
                    ${
                        status === "expired"
                            ? "Položka je prošlá"
                            : "Položka brzy expiruje"
                    }
                </small>
            </div>

            <span>
                ${formatDashboardDate(item.expirationDate)}
            </span>
        `;

        container.appendChild(element);
    });
}


/* =========================================
   POSLEDNÍ PŘIDANÉ ZÁSOBY
========================================= */

function renderRecentSupplies(inventory) {
    const container =
        document.getElementById("recentSupplies");

    if (!container) {
        return;
    }

    const recentItems =
        [...inventory]
            .sort((first, second) => {
                return Number(second.id) - Number(first.id);
            })
            .slice(0, 5);

    container.innerHTML = "";

    if (recentItems.length === 0) {
        container.innerHTML = `
            <p class="empty-state">
                Zatím nebyly přidány žádné zásoby.
            </p>
        `;

        return;
    }

    recentItems.forEach((item) => {
        const element =
            document.createElement("div");

        element.className = "recent-item";

        element.innerHTML = `
            <div>
                <strong>
                    ${escapeDashboardHtml(item.name)}
                </strong>

                <small>
                    ${getDashboardCategoryName(item.category)}
                </small>
            </div>

            <span>
                ${item.quantity} ${escapeDashboardHtml(item.unit)}
            </span>
        `;

        container.appendChild(element);
    });
}


/* =========================================
   STAV EXPIRACE
========================================= */

function getExpirationStatus(dateString) {
    if (!dateString) {
        return "unknown";
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
        return "expired";
    }

    if (daysRemaining <= 30) {
        return "warning";
    }

    return "ok";
}


/* =========================================
   POMOCNÉ FUNKCE
========================================= */

function setElementText(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function formatDashboardDate(dateString) {
    if (!dateString) {
        return "Bez data";
    }

    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("cs-CZ");
}


function getDashboardCategoryName(category) {
    const categories = {
        food: "Potraviny",
        water: "Voda",
        medicine: "Léky",
        equipment: "Vybavení",
        other: "Ostatní"
    };

    return categories[category] || "Ostatní";
}


function escapeDashboardHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}