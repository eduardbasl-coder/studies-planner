# ZÁSOBY

Jednoduchá offline webová aplikace pro evidenci nouzových zásob domácnosti.

Aplikace umožňuje přehledně ukládat zásoby, sledovat jejich množství, kategorie a datum spotřeby. Součástí je také dashboard, statistika zásob a nastavení vzhledu aplikace.

## 🌐 Live demo

Aplikace je dostupná online:

https://supply-tracker-basldev.netlify.app/pages/inventory

## ✨ Funkce

- přehledný dashboard,
- evidence nouzových zásob,
- přidávání nových zásob,
- rozdělení zásob podle kategorií,
- zadání množství a jednotky,
- zadání data spotřeby,
- přidání poznámky k zásobě,
- vyhledávání zásob podle názvu,
- filtrování podle kategorie,
- zobrazení stavu zásob,
- upozornění na blížící se expiraci,
- upozornění na prošlé zásoby,
- statistika celkového množství,
- statistika počtu uložených položek,
- přehled kategorií,
- přepínání tmavého a světlého režimu,
- ukládání dat přímo v prohlížeči pomocí `localStorage`,
- fungování bez nutnosti backendu nebo databáze.

## 📸 Stránky aplikace

### Dashboard

Hlavní stránka aplikace poskytuje rychlý přehled o aktuálním stavu zásob.

Obsahuje:

- celkové množství zásob,
- počet uložených položek,
- počet zásob s blížící se expirací,
- počet prošlých zásob,
- přehled kategorií,
- upozornění ke kontrole zásob.

### Moje zásoby

Stránka pro správu jednotlivých zásob.

Umožňuje:

- přidat novou zásobu,
- zadat kategorii,
- zadat množství,
- vybrat jednotku,
- nastavit datum spotřeby,
- přidat poznámku,
- vyhledávat položky,
- filtrovat položky podle kategorie,
- zobrazit stav zásoby,
- odstranit zásobu.

### Statistiky

Stránka poskytuje souhrnný přehled uložených zásob.

Zobrazuje:

- celkové množství,
- počet uložených položek,
- rozložení zásob podle kategorií,
- přehled expirace,
- počet prošlých zásob,
- počet zásob, kterým se blíží datum spotřeby.

### Nastavení

Stránka nastavení obsahuje:

- přepínání tmavého a světlého režimu,
- možnost smazat všechny uložené zásoby.

## 🛠️ Použité technologie

Projekt je vytvořen pomocí základních webových technologií:

- HTML5
- CSS3
- JavaScript
- LocalStorage API
- Netlify

Aplikace nepoužívá backend ani externí databázi. Data jsou ukládána lokálně v prohlížeči uživatele.

## 📁 Struktura projektu

```text
zasoby/
├── css/
│   ├── dashboard.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── dashboard.js
│   ├── inventory.js
│   ├── settings.js
│   ├── statistics.js
│   └── storage.js
├── pages/
│   ├── inventory.html
│   ├── settings.html
│   └── statistics.html
├── index.html
├── script.js
├── style.css
└── README.md
