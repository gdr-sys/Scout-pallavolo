# 🏐 Volleyball Scout

**Volleyball Scout** è un'applicazione web single-page progettata per la rilevazione statistica avanzata durante le competizioni di pallavolo. Lo strumento permette agli operatori di monitorare le prestazioni dei singoli atleti e della squadra in tempo reale attraverso un'interfaccia moderna ottimizzata per dispositivi mobile e tablet.

> **Progetto e idea di [Noemi Marcolini](mailto:noemi.marcolini@gmail.com)**

## 🌐 Demo Live

L'applicazione è disponibile su GitHub Pages:  
👉 [**Volleyball Scout — Live Demo**](https://gdr-sys.github.io/Scout-pallavolo/)

---

## ✨ Funzionalità Principali

### 📋 Gestione Rose (Roster)
- Creazione di squadre personalizzate
- Aggiunta giocatori con **nome**, **numero di maglia** e **ruolo** (Palleggiatore, Opposto, Schiacciatore, Centrale, Libero)
- Modifica e eliminazione rose
- Dati salvati localmente nel browser (LocalStorage) o sincronizzati su cloud (Firebase)

### 🎯 Scouting in Tempo Reale
- Selezione rapida del giocatore dalla colonna laterale
- Registrazione delle azioni per **5 fondamentali**:
  - ⚡ **Attacco** (ATT)
  - 🛡️ **Ricezione** (RIC)
  - 🏐 **Battuta** (BAT)
  - 🧱 **Muro** (MUR)
  - 🤸 **Difesa** (DIF)
- Ogni azione è valutata su **4 livelli di qualità**:
  - `++` Eccellente (verde)
  - `+` Positiva (blu)
  - `–` Negativa (giallo)
  - `=` Errore (rosso)
- **Undo** per annullare l'ultima azione
- Log orizzontale con cronologia delle ultime azioni

### 📊 Tabellone Punteggio
- Contatore punteggio integrato nella barra superiore (Casa vs Ospite)
- Supporto multi-set con creazione rapida di nuovi set
- Pulsanti rapidi "Punto Casa" e "Punto Ospite" nella schermata Scout

### 📈 Statistiche
- Vista "Tutti i fondamentali" con barre di distribuzione per giocatore
- Vista per singolo fondamentale con tabella dettagliata
- Calcolo automatico di:
  - **Efficienza %** = (++ − –) / Totale × 100
  - **Positività %** = (++ + +) / Totale × 100
- Filtri per fondamentale

### 📄 Riepilogo & Esportazione
- Riepilogo della partita con punteggi e statistiche aggregate
- Identificazione automatica **MVP** (giocatore con più azioni `++`)
- **Esportazione PDF** professionale con tabelle per fondamentale
- **Esportazione CSV** per analisi in Excel/Google Sheets
- Possibilità di terminare la partita e resettare i dati

### 🌍 Supporto Multilingua
- 🇮🇹 Italiano (predefinito)
- 🇬🇧 Inglese
- 🇪🇸 Spagnolo
- 🇫🇷 Francese
- 🇩🇪 Tedesco
- 🇵🇹 Portoghese

Rilevamento automatico dal browser + selezione manuale nelle Impostazioni.

### 🔐 Sincronizzazione Cloud (Opzionale)
- **Accesso con Google** per sincronizzazione tra dispositivi
- **Modalità ospite** per uso solo locale
- Dati sincronizzati automaticamente su Firebase Firestore

---

## 🛠️ Stack Tecnologico

| Tecnologia | Utilizzo |
|---|---|
| **React 19** | Libreria UI con componenti funzionali e hooks |
| **TypeScript** | Tipizzazione statica per robustezza del codice |
| **Vite** | Build tool ultra-veloce con HMR |
| **Tailwind CSS v4** | Styling utility-first con design system personalizzato |
| **Firebase** | Autenticazione (Google) + Firestore per sincronizzazione cloud |
| **jsPDF** + **jsPDF-AutoTable** | Generazione documenti PDF lato client |
| **Lucide React** | Set di icone consistente e leggero |
| **LocalStorage API** | Persistenza dati locale (fallback) |

---

## 🚀 Installazione e Avvio

### Prerequisiti
- **Node.js** ≥ 18
- **npm** ≥ 9

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

L'applicazione sarà disponibile su `http://localhost:5173`

### Build di Produzione

```bash
npm run build
```

Il file finale viene generato in `dist/index.html` come single-file (HTML + CSS + JS inline).

---

## 🔥 Configurazione Firebase (Opzionale)

Firebase abilita la sincronizzazione cloud e l'autenticazione Google. **L'app funziona perfettamente anche senza Firebase** — i dati vengono salvati localmente.

### Passo 1: Crea un Progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca **"Crea un progetto"**
3. Inserisci un nome progetto (es. `volleyball-scout`)
4. Disabilita Google Analytics (opzionale)
5. Clicca **"Crea progetto"**

### Passo 2: Aggiungi un'App Web

1. Nella dashboard del progetto, clicca l'icona **Web** (`</>`)
2. Registra l'app con un nickname (es. `volleyball-scout-web`)
3. **Copia l'oggetto `firebaseConfig`** — ti servirà dopo
4. Clicca **"Continua nella console"**

### Passo 3: Abilita l'Autenticazione

1. Nella barra laterale, clicca **"Authentication"**
2. Clicca **"Inizia"**
3. Vai alla scheda **"Metodo di accesso"**
4. Abilita il provider **"Google"**
5. Aggiungi la tua email come email di supporto
6. Clicca **"Salva"**

### Passo 4: Crea il Database Firestore

1. Nella barra laterale, clicca **"Firestore Database"**
2. Clicca **"Crea database"**
3. Seleziona **"Avvia in modalità produzione"**
4. Scegli una posizione vicina ai tuoi utenti
5. Clicca **"Crea"**

### Passo 5: Imposta le Regole di Sicurezza Firestore

1. In Firestore, vai alla scheda **"Regole"**
2. Sostituisci le regole con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rose: gli utenti possono accedere solo alle proprie
    match /rosters/{rosterId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    // Partite: l'ID del documento = ID utente
    match /matches/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

3. Clicca **"Pubblica"**

### Passo 6: Configura le Variabili d'Ambiente

Crea un file `.env` nella root del progetto:

```env
VITE_FIREBASE_API_KEY=AIzaSyB...la_tua_api_key
VITE_FIREBASE_AUTH_DOMAIN=tuo-progetto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tuo-progetto-id
VITE_FIREBASE_STORAGE_BUCKET=tuo-progetto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

Ottieni questi valori da Firebase Console → Impostazioni progetto → Le tue app → Config.

### Passo 7: Rebuild & Deploy

```bash
npm run build
```

Carica `dist/index.html` su GitHub Pages o qualsiasi host statico.

---

## 🌐 Deploy su GitHub Pages

### Opzione 1: Deploy Manuale

1. Esegui `npm run build`
2. Copia `dist/index.html` nella root del branch `gh-pages`
3. Pusha su GitHub

### Opzione 2: GitHub Actions (Consigliato)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - uses: actions/deploy-pages@v4
```

Aggiungi la tua config Firebase come **Repository Secrets** in GitHub Settings → Secrets and variables → Actions.

---

## 📂 Struttura del Progetto

```
Scout-pallavolo/
├── index.html              # Entry point HTML
├── .env                    # Variabili d'ambiente Firebase (opzionale)
├── src/
│   ├── main.tsx            # Bootstrap React con Providers
│   ├── App.tsx             # Componente root con navigazione e stato globale
│   ├── types.ts            # Definizioni TypeScript
│   ├── store.ts            # Persistenza locale e calcolo statistiche
│   ├── exportUtils.ts      # Funzioni di esportazione PDF e CSV
│   ├── i18n/
│   │   ├── translations.ts # Tutte le traduzioni (6 lingue)
│   │   └── context.tsx     # React Context per i18n
│   ├── firebase/
│   │   ├── config.ts       # Configurazione Firebase
│   │   └── context.tsx     # Auth e Firestore context
│   └── components/
│       ├── HomePage.tsx     # Setup partita
│       ├── ScoutPage.tsx    # Interfaccia di scouting principale
│       ├── StatsPage.tsx    # Visualizzazione statistiche
│       ├── RosterPage.tsx   # Gestione rose
│       ├── SummaryPage.tsx  # Riepilogo ed esportazione
│       └── SettingsModal.tsx # Lingua e account
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📜 Licenza

Questo software è distribuito per scopi tecnici e sportivi.  
Progetto e idea di **Noemi Marcolini**.

---

## 🤝 Contribuire

I contributi sono benvenuti! Per proporre modifiche:

1. Fai un fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/nuova-funzionalita`)
3. Committa le modifiche (`git commit -m 'Aggiunge nuova funzionalità'`)
4. Pusha il branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

---

📖 **[README in English](README.md)**
