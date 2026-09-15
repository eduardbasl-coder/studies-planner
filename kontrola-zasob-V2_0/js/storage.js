"use strict";


/* =========================================
   ZÁKLADNÍ NASTAVENÍ
========================================= */

const STORAGE_KEY = "zasoby_inventory";


/* =========================================
   NAČTENÍ ZÁSOB
========================================= */

function getInventory() {
    const savedInventory =
        localStorage.getItem(STORAGE_KEY);

    if (!savedInventory) {
        return [];
    }

    try {
        const inventory = JSON.parse(savedInventory);

        return Array.isArray(inventory)
            ? inventory
            : [];
    } catch (error) {
        console.error(
            "Nepodařilo se načíst zásoby:",
            error
        );

        return [];
    }
}


/* =========================================
   ULOŽENÍ ZÁSOB
========================================= */

function saveInventory(inventory) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(inventory)
    );
}


/* =========================================
   PŘIDÁNÍ ZÁSOBY
========================================= */

function addInventoryItem(item) {
    const inventory = getInventory();

    const newItem = {
        id: Date.now(),
        name: item.name || "Neznámá položka",
        category: item.category || "Ostatní",
        quantity: Number(item.quantity) || 0,
        unit: item.unit || "ks",
        expirationDate: item.expirationDate || "",
        note: item.note || "",
        createdAt: new Date().toISOString()
    };

    inventory.push(newItem);

    saveInventory(inventory);

    return newItem;
}


/* =========================================
   ÚPRAVA ZÁSOBY
========================================= */

function updateInventoryItem(id, updatedData) {
    const inventory = getInventory();

    const updatedInventory = inventory.map((item) => {
        if (item.id !== Number(id)) {
            return item;
        }

        return {
            ...item,
            ...updatedData,
            quantity:
                updatedData.quantity !== undefined
                    ? Number(updatedData.quantity) || 0
                    : item.quantity
        };
    });

    saveInventory(updatedInventory);

    return updatedInventory;
}


/* =========================================
   SMAZÁNÍ ZÁSOBY
========================================= */

function deleteInventoryItem(id) {
    const inventory = getInventory();

    const filteredInventory = inventory.filter(
        (item) => item.id !== Number(id)
    );

    saveInventory(filteredInventory);

    return filteredInventory;
}


/* =========================================
   VYMAZÁNÍ VŠECH ZÁSOB
========================================= */

function clearInventory() {
    localStorage.removeItem(STORAGE_KEY);
}


/* =========================================
   EXPORT FUNKCÍ PRO DALŠÍ JS SOUBORY
========================================= */

window.ZasobyStorage = {
    getInventory,
    saveInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    clearInventory
};