"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeStatistics();
});


/* =========================================
   INICIALIZACE
========================================= */

function initializeStatistics() {
    if (!window.ZasobyStorage) {
        return;
    }

    renderStatistics();
}


/* =========================================
   HLAVNÍ VYKRESLENÍ
========================================= */

function renderStatistics() {
    const inventory =
        window.ZasobyStorage.getInventory();

    renderTotalStatistics(inventory);
    renderCategoryStatistics(inventory);
    renderExpirationStatistics(inventory);
}


/* =========================================
   CELKOVÉ STATISTIKY
========================================= */

function renderTotalStatistics(inventory) {
    const totalQuantity =
        inventory.reduce((total, item) => {
            return total + Number(item.quantity || 0);
        }, 0);

    const totalItems =
        inventory.length;

    setStatisticsText(
        "statisticsTotalQuantity",
        totalQuantity
    );

    setStatisticsText(
        "statisticsTotalItems",
        totalItems
    );
}


/* =========================================
   STATISTIKY KATEGORIÍ
========================================= */

function renderCategoryStatistics(inventory) {
    const container =
        document.getElementById("statisticsCategories");

    if (!container) {
        return;
    }

    const categories = {
        food: "Potraviny",
        water: "Voda",
        medicine: "Léky",
        equipment: "Vybavení",
        other: "Ostatní"
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

    const totalQuantity =
        Object.values(categoryTotals).reduce(
            (total, quantity) => total + quantity,
            0
        );

    Object.entries(categoryTotals).forEach(
        ([category, quantity]) => {
            const categoryName =
                categories[category] || "Ostatní";

            const percentage =
                totalQuantity > 0
                    ? Math.round(
                        (quantity / totalQuantity) * 100
                    )
                    : 0;

            const item =
                document.createElement("div");

            item.className =
                "statistics-category-item";

            item.innerHTML = `
                <div class="statistics-row">
                    <strong>
                        ${escapeStatisticsHtml(categoryName)}
                    </strong>

                    <span>
                        ${quantity} ks
                    </span>
                </div>

                <div class="statistics-bar">
                    <div
                        class="statistics-bar-fill"
                        style="width: ${percentage}%"
                    ></div>
                </div>

                <small>
                    ${percentage} % z celkového množství
                </small>
            `;

            container.appendChild(item);
        }
    );
}


/* =========================================
   STATISTIKY EXPIRACE
========================================= */

function renderExpirationStatistics(inventory) {
    const container =
        document.getElementById("statisticsExpiration");

    if (!container) {
        return;
    }

    const expirationCounts = {
        ok: 0,
        warning: 0,
        expired: 0,
        unknown: 0
    };

    inventory.forEach((item) => {
        const status =
            getStatisticsExpirationStatus(
                item.expirationDate
            );

        expirationCounts[status]++;
    });

    container.innerHTML = `
        <div class="expiration-statistics">

            <div class="expiration-stat ok">
                <span class="expiration-stat-number">
                    ${expirationCounts.ok}
                </span>

                <span class="expiration-stat-label">
                    V pořádku
                </span>
            </div>

            <div class="expiration-stat warning">
                <span class="expiration-stat-number">
                    ${expirationCounts.warning}
                </span>

                <span class="expiration-stat-label">
                    Brzy expiruje
                </span>
            </div>

            <div class="expiration-stat expired">
                <span class="expiration-stat-number">
                    ${expirationCounts.expired}
                </span>

                <span class="expiration-stat-label">
                    Prošlé
                </span>
            </div>

            <div class="expiration-stat unknown">
                <span class="expiration-stat-number">
                    ${expirationCounts.unknown}
                </span>

                <span class="expiration-stat-label">
                    Bez data
                </span>
            </div>

        </div>
    `;
}


/* =========================================
   STAV EXPIRACE
========================================= */

function getStatisticsExpirationStatus(dateString) {
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

function setStatisticsText(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function escapeStatisticsHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}