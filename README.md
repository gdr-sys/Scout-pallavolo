# 🏐 Volleyball Scout

**Volleyball Scout** is a single-page web application designed for advanced statistical tracking during volleyball matches. It allows operators to monitor individual athlete and team performance in real-time through a modern interface optimized for mobile and tablet devices.

> **Project and idea by [Noemi Marcolini](mailto:noemi.marcolini@gmail.com)**

## 🌐 Live Demo

The application is available on GitHub Pages:  
👉 [**Volleyball Scout — Live Demo**](https://gdr-sys.github.io/Scout-pallavolo/)

---

## ✨ Key Features

### 📋 Roster Management

* Create custom teams
* Add players with **name**, **jersey number**, and **role** (Setter, Opposite, Outside Hitter, Middle Blocker, Libero)
* Edit and delete rosters
* Data saved locally in the browser (LocalStorage)

### 🎯 Real-Time Scouting

* Quick player selection from the sidebar
* **Starters (6) + Liberos (up to 2)** always visible at the top
* Action recording for **5 fundamentals**:
  * ⚡ **Attack** (ATK)
  * 🛡️ **Reception** (REC)
  * 🏐 **Serve** (SRV)
  * 🧱 **Block** (BLK)
  * 🤸 **Defense** (DEF)
* Each action is rated on **4 quality levels**:
  * `++` Excellent (green)
  * `+` Positive (blue)
  * `–` Negative (yellow)
  * `=` Error (red)
* **Undo** to revert the last action
* **Favorite Actions** bar with the 5 most used action combinations
* **Haptic feedback** (vibration) on action registration
* Horizontal log with recent action history

### ⏱️ Timeout Tracker

* Visual timeout counter for each team
* 2 timeouts per set (standard regulation)
* Filled/empty circles indicate used/available timeouts
* +/- buttons to manage timeouts
* Auto-reset on new set

### 🔄 Substitution Log

* Expandable panel to record substitutions
* Select player going out (from court) and coming in (from bench)
* **Real visual swap**: substituted players actually change position in the UI
* Log with player names and numbers for each sub
* Ability to undo any substitution

### 📊 Scoreboard

* Integrated score counter in the top bar (Home vs Away)
* Multi-set support with quick new set creation
* Quick "Home Point" and "Away Point" buttons in Scout view

### 📈 Statistics

* "All fundamentals" view with distribution bars per player
* Single fundamental view with detailed table
* Automatic calculation of:
  * **Efficiency %** = (++ − –) / Total × 100
  * **Positivity %** = (++ + +) / Total × 100
* **Key stats in bold**: Eff% and Pos% highlighted for quick reading
* Filters by fundamental

### 🗺️ Court Heatmap (Advanced Mode)

* Visual volleyball court with zone markings (1-6)
* Tap the court to record action position
* Color-coded cells: green (positive) / red (negative)
* Individual dots for sparse data
* **Export as PNG image**
* Filter by selected fundamental

### 📄 Summary & Export

* Match summary with scores and aggregated statistics
* Automatic **MVP** identification (player with most `++` actions)
* **PDF export** with professional tables per fundamental
* **CSV export** for analysis in Excel/Google Sheets
* **WhatsApp-friendly export**: plain text with emojis, ready to copy and share
* **DataVolley export** (.dvw format) - Advanced Mode only
* **Heatmap PNG export** - Advanced Mode only
* Option to end match and reset data

### ⚡ Advanced Mode

Toggle in Settings to enable:
* **Swipe gestures** on player cards (swipe right → ++, swipe left → =)
* **Rotation selector** (1-6) saved with each action
* **Position tracking** on court heatmap
* **DataVolley export** (.dvw format)
* **Enhanced live stats dashboard**

### 🌍 Multi-Language Support

* 🇮🇹 Italian (default)
* 🇬🇧 English
* 🇪🇸 Spanish
* 🇫🇷 French
* 🇩🇪 German
* 🇵🇹 Portuguese

Automatic browser detection + manual selection in Settings.

### 🔐 Cloud Sync (Optional)

* **Google Sign-In** for cross-device sync
* **Guest mode** for local-only usage
* Data automatically synced to Firebase Firestore
* Works completely offline without Firebase configured

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with functional components and hooks |
| **TypeScript** | Static typing for code robustness |
| **Vite** | Ultra-fast build tool with HMR |
| **Tailwind CSS v4** | Utility-first styling with custom design system |
| **jsPDF** + **jsPDF-AutoTable** | Client-side PDF generation |
| **Firebase** | Authentication (Google) + Firestore for cloud sync |
| **Lucide React** | Consistent, lightweight icon set |
| **LocalStorage API** | Local data persistence (fallback) |

---

## 🚀 Installation & Setup

### Prerequisites

* **Node.js** ≥ 18
* **npm** ≥ 9

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
├── src/
│   ├── main.tsx            # React bootstrap with Providers
│   ├── App.tsx             # Root component with navigation and global state
│   ├── types.ts            # TypeScript definitions
│   ├── store.ts            # Local persistence and stats calculation
│   ├── exportUtils.ts      # PDF, CSV, WhatsApp, DataVolley export
│   ├── index.css           # Tailwind + custom animations
│   ├── contexts/
│   │   └── SettingsContext.tsx  # Advanced mode state management
│   ├── firebase/
│   │   ├── config.ts           # Firebase configuration
│   │   └── context.tsx         # Auth and Firestore context
│   ├── i18n/
│   │   ├── translations.ts # All translations (6 languages)
│   │   └── context.tsx     # React Context for i18n
│   ├── utils/
│   │   ├── cn.ts           # Class name utilities
│   │   └── haptic.ts       # Vibration API wrapper
│   └── components/
│       ├── HomePage.tsx        # Match setup + starter/libero selection
│       ├── ScoutPage.tsx       # Main scouting interface
│       ├── StatsPage.tsx       # Statistics view
│       ├── RosterPage.tsx      # Roster management
│       ├── SummaryPage.tsx     # Summary and export
│       ├── SettingsModal.tsx   # Language and advanced mode settings
│       ├── LiveStatsBar.tsx    # Real-time efficiency display
│       ├── TimeoutTracker.tsx  # Timeout counter per team
│       ├── SubstitutionPanel.tsx # Substitution log
│       └── CourtHeatmap.tsx    # Court position visualization
├── development.md          # Technical documentation
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📱 Mobile Optimization

* Touch-optimized buttons and interactions
* Haptic feedback on all actions
* Swipe gestures in Advanced Mode
* Responsive layout for phones and tablets
* No pinch-zoom interference

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
