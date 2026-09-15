"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    initializeActiveNavigation();
    initializeMobileMenu();
});


/* =========================================
   PŘEPÍNÁNÍ VZHLEDU
========================================= */

function initializeTheme() {
    const themeToggle = document.getElementById("themeToggle");

    const savedTheme = localStorage.getItem("zasoby_theme") || "dark";

    applyTheme(savedTheme);

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.body.dataset.theme || "dark";

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(newTheme);

        localStorage.setItem("zasoby_theme", newTheme);
    });
}


function applyTheme(theme) {
    document.body.dataset.theme = theme;

    updateThemeIcon(theme);
}


function updateThemeIcon(theme) {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
        return;
    }

    themeToggle.textContent =
        theme === "dark" ? "☀️" : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        theme === "dark"
            ? "Přepnout na světlý vzhled"
            : "Přepnout na tmavý vzhled"
    );

    themeToggle.setAttribute(
        "title",
        theme === "dark"
            ? "Přepnout na světlý vzhled"
            : "Přepnout na tmavý vzhled"
    );
}


/* =========================================
   AKTIVNÍ ODKAZ V MENU
========================================= */

function initializeActiveNavigation() {
    const currentPath = window.location.pathname;

    const navigationLinks =
        document.querySelectorAll(".navigation-item");

    navigationLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        const linkUrl = new URL(
            href,
            window.location.href
        );

        const linkPath = linkUrl.pathname;

        const currentIsHome =
            currentPath.endsWith("/") ||
            currentPath.endsWith("/index.html");

        const linkIsHome =
            linkPath.endsWith("/") ||
            linkPath.endsWith("/index.html");

        const isActive =
            currentPath === linkPath ||
            (currentIsHome && linkIsHome);

        link.classList.toggle("active", isActive);
    });
}


/* =========================================
   MOBILNÍ MENU
   Funguje i v případě, že tlačítko zatím není
========================================= */

function initializeMobileMenu() {
    const menuToggle =
        document.getElementById("menuToggle");

    const sidebar =
        document.querySelector(".sidebar");

    if (!menuToggle || !sidebar) {
        return;
    }

    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    const navigationLinks =
        sidebar.querySelectorAll(".navigation-item");

    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("open");
        });
    });
}


/* =========================================
   POMOCNÉ FUNKCE PRO DALŠÍ STRÁNKY
========================================= */

window.Zasoby = {
    applyTheme,
    updateThemeIcon
};