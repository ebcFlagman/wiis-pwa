# Wiis – Digitale Jass-Tafel

> Deine digitale Jass-Tafel. Punkte zählen, Runden verfolgen, Gewinner küren – ganz ohne Papier und Bleistift.

[![Build](https://github.com/ebcFlagman/wiis-pwa/actions/workflows/build.yml/badge.svg)](https://github.com/ebcFlagman/wiis-pwa/actions/workflows/build.yml)
[![Latest Release](https://img.shields.io/github/v/release/ebcFlagman/wiis-pwa)](https://github.com/ebcFlagman/wiis-pwa/releases/latest)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue?logo=docker)](https://github.com/ebcFlagman/wiis-pwa/pkgs/container/wiis-pwa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Features

- Punkte für zwei Teams erfassen (Schreiben, Weisen, Match)
- Multiplikator (1×–6×) pro Runde wählbar
- Letzten Zug rückgängig machen
- Rundenanzeige mit Fortschrittsbalken zum Ziel
- Individuell konfigurierbare Spielernamen und Zielpunktzahl
- Vollständig lokal – keine Serveranbindung, keine Registrierung
- **PWA:** installierbar auf iOS, Android und Desktop, funktioniert offline
- Mehrsprachig: Deutsch (Standard), Englisch, Französisch

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| Persistenz | Dexie (IndexedDB) |
| i18n | i18next + react-i18next |
| Build | Vite 8 + vite-plugin-pwa |
| Tests | Playwright + playwright-bdd |
| CI | GitHub Actions |
| Deployment | Docker + nginx |

---

## Voraussetzungen

- **Node.js** >= 20
- **npm** >= 10

---

## Installation & Start

```bash
# Repository klonen
git clone https://github.com/ebcFlagman/wiis-pwa.git
cd wiis-pwa

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (http://localhost:5173)
npm run dev
```

---

## Verfügbare Scripts

| Script | Beschreibung |
|---|---|
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | Produktions-Build erstellen (`dist/`) |
| `npm run preview` | Produktions-Build lokal vorschauen |
| `npm run lint` | ESLint auf `src/` ausführen |
| `npm run test:e2e` | E2E-Tests (Playwright) im Headless-Modus |
| `npm run test:e2e:ui` | E2E-Tests im interaktiven UI-Modus |
| `npm run test:e2e:report` | Playwright HTML-Report öffnen |

---

## Spielmodi

### Schreiben (WRITE)
Eingespielte Punkte eingeben (0–157). Das eingebende Team erhält `punkte × multiplikator`, das andere Team `(157 − punkte) × multiplikator`.

### Weisen (CLAIM)
Vordefinierten Weis-Wert wählen (20, 40, 50 … 200). Der Betrag wird dem ausgewählten Team gutgeschrieben.

### Match (MATCH)
Fixe 257 Punkte multipliziert mit dem gewählten Multiplikator für das aktive Team.

Die Standard-Zielpunktzahl ist **2500** und kann in den Einstellungen angepasst werden.

---

## Projektstruktur

```
wiis-pwa/
├── e2e/
│   ├── features/          # Gherkin-Feature-Dateien (Deutsch)
│   └── steps/             # Playwright-Schrittdefinitionen
├── public/                # Statische Assets (Icons, SVGs)
├── src/
│   ├── components/
│   │   ├── dialogs/       # Alle Modaldialoge
│   │   └── ui/            # Wiederverwendbare UI-Komponenten
│   ├── db/                # Dexie-Datenbankdefinition + Entities
│   ├── i18n/
│   │   └── locales/       # de.json, en.json, fr.json
│   ├── store/             # Zustand-Store (gameStore.ts)
│   └── types/             # TypeScript-Typen + Konstanten
├── Dockerfile
├── nginx.conf
├── playwright.config.ts
└── vite.config.js
```

---

## Internationalisierung

Die Sprache wird automatisch aus den Browser-Einstellungen erkannt und in `localStorage` unter dem Schlüssel `wiis-lng` gespeichert. Unterstützte Werte: `de`, `en`, `fr`. Fallback: `de`.

Übersetzungsdateien befinden sich unter [`src/i18n/locales/`](src/i18n/locales/).

---

## PWA – App installieren

Nach dem Öffnen im Browser erscheint ein Installations-Banner (je nach Browser und Betriebssystem). Die App funktioniert danach vollständig offline. Service-Worker-Updates werden automatisch im Hintergrund eingespielt.

---

## Tests

Die E2E-Tests sind als BDD-Feature-Files in Deutsch geschrieben und decken die vier Kernszenarien ab:

| Feature | Beschreibung |
|---|---|
| `scoring.feature` | Punkteverteilung im Schreiben-Modus |
| `claims.feature` | Weisen mit Multiplikatoren |
| `match.feature` | Match-Modus (257 Punkte fix) |
| `undo.feature` | Rückgängig-Funktion und Rundenreset |

```bash
# Tests ausführen (startet automatisch den Dev-Server)
npm run test:e2e
```

---

## Deployment

### Docker

```bash
# Image bauen
docker build -t wiis-pwa .

# Container starten (Port 8080)
docker run -p 8080:8080 wiis-pwa
```

Das Docker-Image verwendet ein mehrstufiges Build: **Node 26 alpine** für den Build-Schritt, **nginx** für die Auslieferung. Alle Routen werden auf `index.html` umgeleitet (SPA-Routing). Statische Assets werden mit Gzip-Komprimierung und Browser-Cache-Headern ausgeliefert.

### Manuelle Bereitstellung

```bash
npm run build
# Inhalt von dist/ auf einen Webserver deployen
# Alle Anfragen auf index.html umleiten (SPA)
```

---

## Datenschutz & Datenspeicherung

Alle Daten (Spiele, Einträge, Einstellungen) werden ausschließlich lokal im Browser via **IndexedDB** gespeichert. Es werden keine Daten an einen Server übertragen. Die letzten 10 Spiele werden automatisch in der Datenbank behalten.

---

## Lizenz

[MIT](LICENSE) © Patrick Wachsmuth – [Flagman's World](https://flagmansworld.ch)
