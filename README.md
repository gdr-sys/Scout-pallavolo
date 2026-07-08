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

## 🔥 Firebase Setup (Optional)

Firebase enables cloud sync and Google authentication. **The app works perfectly without Firebase** — data is stored locally.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter a project name (e.g., `volleyball-scout`)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Add Web App

1. In your project dashboard, click the **Web icon** (`</>`)
2. Register app with a nickname (e.g., `volleyball-scout-web`)
3. **Copy the `firebaseConfig` object** — you'll need it later
4. Click **"Continue to console"**

### Step 3: Enable Authentication

1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Google"** provider
5. Add your email as support email
6. Click **"Save"**

### Step 4: Create Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location close to your users
5. Click **"Create"**

### Step 5: Set Firestore Security Rules

1. In Firestore, go to **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rosters: users can only access their own
    match /rosters/{rosterId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    // Matches: document ID = user ID
    match /matches/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### Step 6: Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSyB...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

Get these values from your Firebase Console → Project Settings → Your apps → Config.

### Step 7: Rebuild & Deploy

```bash
npm run build
```

Upload `dist/index.html` to GitHub Pages or any static host.

---

## 🌐 Deploy to GitHub Pages

### Option 1: Manual Deploy

1. Run `npm run build`
2. Copy `dist/index.html` to the root of your `gh-pages` branch
3. Push to GitHub

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

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

Add your Firebase config as **Repository Secrets** in GitHub Settings → Secrets and variables → Actions.

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
