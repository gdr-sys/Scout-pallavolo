import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc, setDoc, onSnapshot, collection, query, where, getDocs, deleteDoc, writeBatch
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { Roster, MatchState } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  cloudRosters: Roster[];
  cloudMatch: MatchState | null;
  saveRostersToCloud: (rosters: Roster[]) => Promise<void>;
  saveMatchToCloud: (match: MatchState) => Promise<void>;
  isSyncing: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloudRosters, setCloudRosters] = useState<Roster[]>([]);
  const [cloudMatch, setCloudMatch] = useState<MatchState | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !user) {
      setCloudRosters([]);
      setCloudMatch(null);
      return;
    }
    const rostersQuery = query(
      collection(db, 'rosters'),
      where('userId', '==', user.uid)
    );
    const unsubRosters = onSnapshot(rostersQuery, (snapshot) => {
      const rosters: Roster[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        rosters.push({
          id: doc.id,
          name: data.name,
          players: data.players || [],
          createdAt: data.createdAt,
        });
      });
      setCloudRosters(rosters.sort((a, b) => b.createdAt - a.createdAt));
    });

    const matchRef = doc(db, 'matches', user.uid);
    const unsubMatch = onSnapshot(matchRef, (snapshot) => {
      if (snapshot.exists()) {
        setCloudMatch(snapshot.data() as MatchState);
      } else {
        setCloudMatch(null);
      }
    });

    return () => {
      unsubRosters();
      unsubMatch();
    };
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const signInAnonymously = useCallback(async () => {
    if (!auth) return;
    await firebaseSignInAnonymously(auth);
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    setCloudRosters([]);
    setCloudMatch(null);
  }, []);

  const saveRostersToCloud = useCallback(async (rosters: Roster[]) => {
    if (!db || !user) return;
    setIsSyncing(true);
    try {
      const batch = writeBatch(db);
      const existingQuery = query(
        collection(db, 'rosters'),
        where('userId', '==', user.uid)
      );
      const existingDocs = await getDocs(existingQuery);
      const newIds = new Set(rosters.map(r => r.id));
      existingDocs.forEach((docSnap) => {
        if (!newIds.has(docSnap.id)) {
          batch.delete(docSnap.ref);
        }
      });
      for (const roster of rosters) {
        const rosterRef = doc(db!, 'rosters', roster.id);
        batch.set(rosterRef, { ...roster, userId: user.uid });
      }
      await batch.commit();
    } catch (error) {
      console.error('Error saving rosters to cloud:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  const saveMatchToCloud = useCallback(async (match: MatchState) => {
    if (!db || !user) return;
    setIsSyncing(true);
    try {
      const matchRef = doc(db!, 'matches', user.uid);
      if (match.started) {
        await setDoc(matchRef, match);
      } else {
        await deleteDoc(matchRef).catch(() => {});
      }
    } catch (error) {
      console.error('Error saving match to cloud:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, loading, isConfigured: isFirebaseConfigured,
      signInWithGoogle, signInAnonymously, signOut,
      cloudRosters, cloudMatch,
      saveRostersToCloud, saveMatchToCloud,
      isSyncing,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
