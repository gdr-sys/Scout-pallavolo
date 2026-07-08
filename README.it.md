# 🏐 Volleyball Scout

**Volleyball Scout** è un'applicazione web single-page progettata per il tracciamento statistico avanzato durante le partite di pallavolo. Permette agli operatori di monitorare le performance individuali degli atleti e della squadra in tempo reale attraverso un'interfaccia moderna ottimizzata per dispositivi mobile e tablet.

> **Progetto e idea di [Noemi Marcolini](mailto:noemi.marcolini@gmail.com)**

## 🌐 Demo Live

L'applicazione è disponibile su GitHub Pages:  
👉 [**Volleyball Scout — Demo Live**](https://gdr-sys.github.io/Scout-pallavolo/)

---

## ✨ Funzionalità Principali

### 📋 Gestione Rose

* Crea squadre personalizzate
* Aggiungi giocatori con **nome**, **numero di maglia** e **ruolo** (Palleggiatore, Opposto, Schiacciatore, Centrale, Libero)
* Modifica ed elimina le rose
* Dati salvati localmente nel browser (LocalStorage)

### 🎯 Scouting in Tempo Reale

* Selezione rapida del giocatore dalla barra laterale
* **Titolari (6) + Liberi (fino a 2)** sempre visibili in cima
* Registrazione azioni per **5 fondamentali**:
  * ⚡ **Attacco** (ATT)
  * 🛡️ **Ricezione** (RIC)
  * 🏐 **Battuta** (BAT)
  * 🧱 **Muro** (MUR)
  * 🤸 **Difesa** (DIF)
* Ogni azione è valutata su **4 livelli di qualità**:
  * `++` Eccellente (verde)
  * `+` Positivo (blu)
  * `–` Negativo (giallo)
  * `=` Errore (rosso)
* **Undo** per annullare l'ultima azione
* Barra **Azioni Preferite** con le 5 combinazioni più usate
* **Feedback aptico** (vibrazione) alla registrazione dell'azione
* Log orizzontale con la cronologia delle azioni recenti

### ⏱️ Tracker Timeout

* Contatore visivo timeout per squadra
* 2 timeout per set (regolamento standard)
* Cerchi pieni/vuoti indicano timeout usati/disponibili
* Pulsanti +/- per gestire i timeout
* Reset automatico al nuovo set

### 🔄 Log Sostituzioni

* Pannello espandibile per registrare le sostituzioni
* Seleziona giocatore che esce (dal campo) e che entra (dalla panchina)
* **Scambio visivo reale**: i giocatori sostituiti cambiano effettivamente posizione nella UI
* Log con nomi e numeri dei giocatori per ogni cambio
* Possibilità di annullare qualsiasi sostituzione

### 📊 Tabellone

* Contatore punteggio integrato nella barra superiore (Casa vs Ospite)
* Supporto multi-set con creazione rapida nuovo set
* Pulsanti rapidi "Punto Casa" e "Punto Ospite" nella vista Scout

### 📈 Statistiche

* Vista "Tutti i fondamentali" con barre di distribuzione per giocatore
* Vista singolo fondamentale con tabella dettagliata
* Calcolo automatico di:
  * **Efficienza %** = (++ − –) / Totale × 100
  * **Positività %** = (++ + +) / Totale × 100
* **Statistiche chiave in grassetto**: Eff% e Pos% evidenziati per lettura rapida
* Filtri per fondamentale

### 🗺️ Heatmap Campo (Modalità Avanzata)

* Campo da pallavolo visivo con marcature zone (1-6)
* Tocca il campo per registrare la posizione dell'azione
* Celle colorate: verde (positive) / rosso (negative)
* Punti individuali per dati sparsi
* **Esporta come immagine PNG**
* Filtro per fondamentale selezionato

### 📄 Riepilogo & Esportazione

* Riepilogo partita con punteggi e statistiche aggregate
* Identificazione automatica **MVP** (giocatore con più azioni `++`)
* **Esportazione PDF** con tabelle professionali per fondamentale
* **Esportazione CSV** per analisi in Excel/Google Sheets
* **Esportazione WhatsApp-friendly**: testo semplice con emoji, pronto da copiare e condividere
* **Esportazione DataVolley** (formato .dvw) - Solo Modalità Avanzata
* **Esportazione Heatmap PNG** - Solo Modalità Avanzata
* Opzione per terminare la partita e resettare i dati

### ⚡ Modalità Avanzata

Toggle nelle Impostazioni per abilitare:
* **Gesture swipe** sulle card giocatore (swipe destra → ++, swipe sinistra → =)
* **Selettore rotazione** (1-6) salvato con ogni azione
* **Tracciamento posizione** sulla heatmap campo
* **Esportazione DataVolley** (formato .dvw)
* **Dashboard stats live avanzata**

### 🌍 Supporto Multi-Lingua

* 🇮🇹 Italiano (default)
* 🇬🇧 Inglese
* 🇪🇸 Spagnolo
* 🇫🇷 Francese
* 🇩🇪 Tedesco
* 🇵🇹 Portoghese

Rilevamento automatico browser + selezione manuale nelle Impostazioni.

---

## 🛠️ Stack Tecnologico

| Tecnologia | Scopo |
|------------|-------|
| **React 19** | Libreria UI con componenti funzionali e hooks |
| **TypeScript** | Tipizzazione statica per robustezza del codice |
| **Vite** | Build tool ultra-veloce con HMR |
| **Tailwind CSS v4** | Styling utility-first con design system personalizzato |
| **jsPDF** + **jsPDF-AutoTable** | Generazione PDF lato client |
| **Lucide React** | Set di icone consistente e leggero |
| **LocalStorage API** | Persistenza dati locale |

---

## 🚀 Installazione & Setup

### Prerequisiti

* **Node.js** ≥ 18
* **npm** ≥ 9

### Setup Locale

```bash
# Clona il repository
git clone https://github.com/gdr-sys/Scout-pallavolo.git
cd Scout-pallavolo

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

### Build di Produzione

```bash
npm run build
```

Il file finale viene generato in `dist/index.html` come single-file (HTML + CSS + JS inline).

---

## 📂 Struttura Progetto

```
Scout-pallavolo/
├── index.html              # Entry point HTML
├── src/
│   ├── main.tsx            # Bootstrap React con Providers
│   ├── App.tsx             # Componente root con navigazione e stato globale
│   ├── types.ts            # Definizioni TypeScript
│   ├── store.ts            # Persistenza locale e calcolo statistiche
│   ├── exportUtils.ts      # Export PDF, CSV, WhatsApp, DataVolley
│   ├── index.css           # Tailwind + animazioni custom
│   ├── contexts/
│   │   └── SettingsContext.tsx  # Gestione stato modalità avanzata
│   ├── i18n/
│   │   ├── translations.ts # Tutte le traduzioni (6 lingue)
│   │   └── context.tsx     # React Context per i18n
│   ├── utils/
│   │   ├── cn.ts           # Utility class names
│   │   └── haptic.ts       # Wrapper Vibration API
│   └── components/
│       ├── HomePage.tsx        # Setup partita + selezione titolari/liberi
│       ├── ScoutPage.tsx       # Interfaccia scouting principale
│       ├── StatsPage.tsx       # Vista statistiche
│       ├── RosterPage.tsx      # Gestione rose
│       ├── SummaryPage.tsx     # Riepilogo ed esportazione
│       ├── SettingsModal.tsx   # Impostazioni lingua e modalità avanzata
│       ├── LiveStatsBar.tsx    # Display efficienza in tempo reale
│       ├── TimeoutTracker.tsx  # Contatore timeout per squadra
│       ├── SubstitutionPanel.tsx # Log sostituzioni
│       └── CourtHeatmap.tsx    # Visualizzazione posizioni campo
├── development.md          # Documentazione tecnica
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📱 Ottimizzazione Mobile

* Pulsanti e interazioni ottimizzati per touch
* Feedback aptico su tutte le azioni
* Gesture swipe in Modalità Avanzata
* Layout responsive per telefoni e tablet
* Nessuna interferenza con pinch-zoom

---

## 📜 Licenza

Questo software è distribuito per scopi tecnici e sportivi.  
Progetto e idea di **Noemi Marcolini**.

---

## 🤝 Contribuire

I contributi sono benvenuti! Per proporre modifiche:

1. Fai fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/nuova-feature`)
3. Committa le tue modifiche (`git commit -m 'Aggiungi nuova feature'`)
4. Pusha il branch (`git push origin feature/nuova-feature`)
5. Apri una Pull Request

---

📖 **[README in Inglese](README.md)**
