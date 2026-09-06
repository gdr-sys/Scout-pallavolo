# Database Options for Volleyball Scout

## Current: localStorage
- **Limit**: ~5MB
- **Pros**: Simple, synchronous, built-in
- **Cons**: Limited storage, blocking, string-only

---

## 🏆 Recommended Options

### 1. Dexie.js (Best for most use cases)
**Type**: IndexedDB wrapper
**Size**: ~40KB
**Storage**: 50MB+

```bash
npm install dexie
```

```typescript
import Dexie, { Table } from 'dexie';
import { GameSession, Roster } from './types';

class VolleyballDB extends Dexie {
  games!: Table<GameSession, string>;
  rosters!: Table<Roster, string>;

  constructor() {
    super('VolleyballScoutDB');
    this.version(1).stores({
      games: 'id,updatedAt,createdAt,match.info.homeTeam,match.info.awayTeam',
      rosters: 'id,name,createdAt'
    });
  }
}

const db = new VolleyballDB();

// Usage
await db.games.add(game);
await db.games.update(gameId, changes);
await db.games.delete(gameId);
const games = await db.games.toArray();
const recentGames = await db.games.orderBy('updatedAt').reverse().limit(10).toArray();
```

**Pros**:
- Promise-based async API
- TypeScript support
- Query builder
- Indexes for fast queries
- Small bundle size

**Cons**:
- No built-in sync

---

### 2. RxDB (Offline-first with sync capability)
**Type**: Reactive database
**Size**: ~500KB
**Storage**: 50MB+

```bash
npm install rxdb @rx-angular/db-plugin-pouchdb
```

```typescript
import { createRxDatabase } from 'rxdb';
import { getRxStoragePouch } from 'rxdb-plugins/pouchdb';

const db = await createRxDatabase({
  name: 'volleyballscoutdb',
  storage: getRxStoragePouch('idb')
});

const gamesCollection = await db.collection('games');
const rostersCollection = await db.collection('rosters');

// Usage
await gamesCollection.insert(game);
await gamesCollection.findOne(gameId).exec();
const games = await gamesCollection.find().exec();

// Observe changes
gamesCollection.find().$.subscribe(games => {
  console.log('Games updated:', games);
});
```

**Pros**:
- Reactive queries (automatic updates)
- Offline-first
- Sync plugins available (CouchDB, Firebase, etc.)
- Conflict resolution
- TypeScript support

**Cons**:
- Larger bundle size
- More complex setup

---

### 3. PouchDB (CouchDB sync)
**Type**: Document database with sync
**Size**: ~200KB
**Storage**: 50MB+

```bash
npm install pouchdb
```

```typescript
import PouchDB from 'pouchdb';

const localDB = new PouchDB('volleyball_scout');
const remoteDB = new PouchDB('https://your-server.com/volleyball_scout');

// Sync
localDB.sync(remoteDB, {
  live: true,
  retry: true
});

// Usage
localDB.post(game);
localDB.get(gameId);
localDB.allDocs({ include_docs: true });
localDB.destroy(gameId, rev);
```

**Pros**:
- Built-in sync with CouchDB
- Offline-first
- Simple API
- IndexedDB adapter

**Cons**:
- Need CouchDB server for sync
- Callback-based (but promises available)

---

### 4. Raw IndexedDB
**Type**: Native browser API
**Size**: 0KB
**Storage**: 50MB+

```typescript
const dbPromise = indexedDB.open('VolleyballScoutDB', 1);

dbPromise.onupgradeneeded = (event) => {
  const db = (event.target as IDBOpenDBRequest).result;
  db.createObjectStore('games', { keyPath: 'id' });
  db.createObjectStore('rosters', { keyPath: 'id' });
};

dbPromise.onerror = (event) => {
  console.error('DB error:', event);
};

// Usage with wrapper
class IndexedDBStore<T> {
  private dbPromise: Promise<IDBDatabase>;
  private storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
    this.dbPromise = dbPromise;
  }

  async get(id: string): Promise<T | undefined> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(item: T): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(): Promise<T[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
```

**Pros**:
- Native, no dependencies
- Large storage
- Persistent

**Cons**:
- Complex callback-based API
- No TypeScript types
- Manual error handling

---

## 📊 Comparison

| Feature | localStorage | IndexedDB | Dexie.js | RxDB | PouchDB |
|---------|-------------|-----------|----------|------|--------|
| **Storage Limit** | 5MB | 50MB+ | 50MB+ | 50MB+ | 50MB+ |
| **Offline** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sync** | ❌ | ❌ | ❌ | ✅* | ✅* |
| **Async** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **TypeScript** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Bundle Size** | 0KB | 0KB | 40KB | 500KB | 200KB |
| **Query Support** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Reactive** | ❌ | ❌ | ❌ | ✅ | ❌ |

*Requires server setup

---

## 🎯 Recommendation

### For your use case:
1. **Start with Dexie.js** - Simple, TypeScript-friendly, good performance
2. **If you need sync** - Use RxDB or PouchDB with a backend service
3. **If minimal dependencies** - Use raw IndexedDB with a wrapper

### Migration Path
```typescript
// Current (localStorage)
localStorage.setItem('games', JSON.stringify(games));

// With Dexie.js
await db.games.bulkPut(games);
```

The API is very similar but with proper typing and async support.

---

## 🔧 Implementation Example (Dexie.js)

### 1. Install
```bash
npm install dexie
```

### 2. Create database class
```typescript
// src/db.ts
import Dexie, { Table } from 'dexie';
import { GameSession, Roster, AppSettings } from './types';

export class VolleyballDB extends Dexie {
  games!: Table<GameSession, string>;
  rosters!: Table<Roster, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('VolleyballScoutDB');
    
    this.version(1).stores({
      games: 'id,updatedAt,createdAt,match.info.homeTeam,match.info.awayTeam',
      rosters: 'id,name,createdAt',
      settings: 'id'
    });
  }
}

export const db = new VolleyballDB();
```

### 3. Replace store.ts functions
```typescript
// src/store.ts
import { db } from './db';

export async function loadGames(): Promise<GameSession[]> {
  return await db.games.toArray();
}

export async function saveGame(session: GameSession): Promise<void> {
  await db.games.put(session);
}

export async function deleteGame(gameId: string): Promise<void> {
  await db.games.delete(gameId);
}
```

### 4. Update App.tsx
```typescript
// Use async/await or .then() for database operations
useEffect(() => {
  loadGames().then(setGames);
}, []);
```

---

## 📦 Package.json Updates

For Dexie.js:
```json
{
  "dependencies": {
    "dexie": "^4.0.1"
  }
}
```

For RxDB:
```json
{
  "dependencies": {
    "rxdb": "^15.0.0",
    "@rx-angular/db-plugin-pouchdb": "^15.0.0"
  }
}
```

For PouchDB:
```json
{
  "dependencies": {
    "pouchdb": "^8.0.0"
  }
}
```
