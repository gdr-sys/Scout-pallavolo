# 🏐 Volleyball Scout

**Volleyball Scout** is a single-page web application designed for advanced statistical tracking during volleyball matches. It allows operators to monitor individual athlete and team performance in real-time through a modern interface optimized for mobile and tablet devices.

> **Project and idea by [Noemi Marcolini](mailto:noemi.marcolini@gmail.com)**

## 🌐 Live Demo

The application is available on GitHub Pages:  
👉 [**Volleyball Scout — Live Demo**](https://gdr-sys.github.io/Scout-pallavolo/)

---

## ✨ Key Features

### 📋 Roster Management
- Create custom teams
- Add players with **name**, **jersey number**, and **role** (Setter, Opposite, Outside Hitter, Middle Blocker, Libero)
- Edit and delete rosters
- Data saved locally in the browser (LocalStorage) or synced to cloud (Firebase)

### 🎯 Real-Time Scouting
- Quick player selection from the sidebar
- Action recording for **5 fundamentals**:
  - ⚡ **Attack** (ATK)
  - 🛡️ **Reception** (REC)
  - 🏐 **Serve** (SRV)
  - 🧱 **Block** (BLK)
  - 🤸 **Defense** (DEF)
- Each action is rated on **4 quality levels**:
  - `++` Excellent (green)
  - `+` Positive (blue)
  - `–` Negative (yellow)
  - `=` Error (red)
- **Undo** to revert the last action
- Horizontal log with recent action history

### 📊 Scoreboard
- Integrated score counter in the top bar (Home vs Away)
- Multi-set support with quick new set creation
- Quick "Home Point" and "Away Point" buttons in Scout view

### 📈 Statistics
- "All fundamentals" view with distribution bars per player
- Single fundamental view with detailed table
- Automatic calculation of:
  - **Efficiency %** = (++ − –) / Total × 100
  - **Positivity %** = (++ + +) / Total × 100
- Filters by fundamental

### 📄 Summary & Export
- Match summary with scores and aggregated statistics
- Automatic **MVP** identification (player with most `++` actions)
- **PDF export** with professional tables per fundamental
- **CSV export** for analysis in Excel/Google Sheets
- Option to end match and reset data

### 🌍 Multi-Language Support
- 🇮🇹 Italian (default)
- 🇬🇧 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇵🇹 Portuguese

Automatic browser detection + manual selection in Settings.

### 🔐 Cloud Sync (Optional)
- **Google Sign-In** for cross-device sync
- **Guest mode** for local-only usage
- Data automatically synced to Firebase Firestore

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library with functional components and hooks |
| **TypeScript** | Static typing for code robustness |
| **Vite** | Ultra-fast build tool with HMR |
| **Tailwind CSS v4** | Utility-first styling with custom design system |
| **Firebase** | Authentication (Google) + Firestore for cloud sync |
| **jsPDF** + **jsPDF-AutoTable** | Client-side PDF generation |
| **Lucide React** | Consistent, lightweight icon set |
| **LocalStorage API** | Local data persistence (fallback) |

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Local Setup

```bash
# Clone the repository
git clone https://github.com/gdr-sys/Scout-pallavolo.git
cd Scout-pallavolo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

The final file is generated in `dist/index.html` as a single-file (HTML + CSS + JS inline).

---

## 📂 Project Structure

```
Scout-pallavolo/
├── index.html              # HTML entry point
├── .env                    # Firebase environment variables (optional)
├── src/
│   ├── main.tsx            # React bootstrap with Providers
│   ├── App.tsx             # Root component with navigation and global state
│   ├── types.ts            # TypeScript definitions
│   ├── store.ts            # Local persistence and stats calculation
│   ├── exportUtils.ts      # PDF and CSV export functions
│   ├── i18n/
│   │   ├── translations.ts # All translations (6 languages)
│   │   └── context.tsx     # React Context for i18n
│   ├── firebase/
│   │   ├── config.ts       # Firebase configuration
│   │   └── context.tsx     # Auth and Firestore context
│   └── components/
│       ├── HomePage.tsx     # Match setup
│       ├── ScoutPage.tsx    # Main scouting interface
│       ├── StatsPage.tsx    # Statistics view
│       ├── RosterPage.tsx   # Roster management
│       ├── SummaryPage.tsx  # Summary and export
│       └── SettingsModal.tsx # Language and account
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📜 License

This software is distributed for technical and sports purposes.  
Project and idea by **Noemi Marcolini**.

---

## 🤝 Contributing

Contributions are welcome! To propose changes:

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

📖 **[README in Italian](README.it.md)**
