"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeSettings();
});


/* =========================================
   INICIALIZACE NASTAVENÍ
========================================= */

function initializeSettings() {
    const settingsThemeToggle =
        document.getElementById("settingsThemeToggle");

    const clearInventoryButton =
        document.getElementById("clearInventoryButton");


    settingsThemeToggle?.addEventListener(
        "click",
        toggleSettingsTheme
    );


    clearInventoryButton?.addEventListener(
        "click",
        handleClearInventory
    );
}


/* =========================================
   PŘEPNUTÍ VZHLEDU
========================================= */

function toggleSettingsTheme() {
    const currentTheme =
        document.body.dataset.theme || "dark";

    const newTheme =
        currentTheme === "dark" ? "light" : "dark";

    document.body.dataset.theme = newTheme;

    localStorage.setItem(
        "zasoby_theme",
        newTheme
    );

    if (window.Zasoby) {
        window.Zasoby.updateThemeIcon(newTheme);
    }
}


/* =========================================
   VYMAZÁNÍ VŠECH ZÁSOB
========================================= */

function handleClearInventory() {
    const inventory =
        window.ZasobyStorage.getInventory();

    if (inventory.length === 0) {
        alert("Nejsou zde žádné zásoby k vymazání.");

        return;
    }

    const confirmed =
        confirm(
            "Opravdu chceš vymazat všechny uložené zásoby? Tuto akci nelze vrátit."
        );

    if (!confirmed) {
        return;
    }

    window.ZasobyStorage.clearInventory();

    alert("Všechny zásoby byly vymazány.");

    window.location.href = "inventory.html";
}