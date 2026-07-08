import { useState } from 'react';
import { useI18n } from '../i18n/context';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../firebase/context';
import { cn } from '../utils/cn';
import { X, Globe, Check, Zap, User, Cloud, CloudOff, LogOut } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { language, setLanguage, t, languages } = useI18n();
  const { advancedMode, toggleAdvancedMode } = useSettings();
  const {
    user,
    isConfigured,
    signInWithGoogle,
    signInAnonymously,
    signOut,
    isSyncing
  } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignInGoogle = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignInAnonymous = async () => {
    setAuthLoading(true);
    try {
      await signInAnonymously();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-800 border border-surface-600/50 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-600/50">
          <h2 className="text-base font-bold text-white">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-5 max-h-[65vh]">
          {/* Advanced Mode Toggle */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-gold-400" />
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {t.settings_advanced_mode}
              </span>
            </div>
            <div className="bg-surface-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{t.settings_advanced_mode}</p>
                  <p className="text-xs text-muted mt-1">{t.settings_advanced_mode_desc}</p>
                </div>
                <button
                  onClick={toggleAdvancedMode}
                  className={cn(
                    "relative w-14 h-7 rounded-full transition-colors duration-200 flex-shrink-0",
                    advancedMode
                      ? "bg-gold-400"
                      : "bg-surface-500"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-200",
                      advancedMode ? "translate-x-7" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
              {advancedMode && (
                <div className="mt-3 pt-3 border-t border-surface-600/50 space-y-1.5">
                  <p className="text-[10px] text-gold-400/80 font-bold uppercase tracking-wider">Funzionalità attive:</p>
                  <ul className="text-xs text-muted space-y-1">
                    <li>✓ Swipe gesture su giocatori (++ / =)</li>
                    <li>✓ Coordinate posizione nell'azione</li>
                    <li>✓ Selezione rotazione (1-6)</li>
                    <li>✓ Export DataVolley (.dvw)</li>
                    <li>✓ Heatmap campo interattiva</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Language selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-gold-400" />
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Language / Lingua
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    language === lang.code
                      ? "bg-gold-400/15 text-gold-400 border border-gold-400/30"
                      : "bg-surface-700 text-muted hover:text-white hover:bg-surface-600"
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Auth section — always visible */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={16} className="text-gold-400" />
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Account & Sync
              </span>
            </div>

            {!isConfigured ? (
              /* Firebase NOT configured — show logged-out UI with info */
              <div className="space-y-3">
                <div className="bg-surface-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-600 flex items-center justify-center">
                      <CloudOff size={18} className="text-muted" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{t.auth_local_only}</p>
                      <p className="text-[10px] text-muted mt-0.5">
                        Firebase non configurato. Aggiungi le variabili d'ambiente .env per abilitare il cloud sync.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-white/50 text-gray-500 text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <svg className="w-5 h-5 opacity-50" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.auth_sign_in_google}
                </button>
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-surface-700/50 border border-surface-600 text-muted text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <User size={18} />
                  {t.auth_sign_in_anonymous}
                </button>
              </div>
            ) : user ? (
              /* Logged in */
              <div className="bg-surface-700/50 rounded-xl p-3 space-y-3">
                {/* User info */}
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-navy-600 flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {user.displayName || (user.isAnonymous ? t.auth_guest : 'User')}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {user.email || (user.isAnonymous ? t.auth_local_only : '')}
                    </p>
                  </div>
                  {/* Sync status */}
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
                    isSyncing
                      ? "bg-blue-500/10 text-blue-400"
                      : user.isAnonymous
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-green-500/10 text-green-400"
                  )}>
                    {isSyncing ? (
                      <>
                        <Cloud size={12} className="animate-pulse" />
                        Syncing...
                      </>
                    ) : user.isAnonymous ? (
                      <>
                        <CloudOff size={12} />
                        Local
                      </>
                    ) : (
                      <>
                        <Cloud size={12} />
                        {t.auth_synced}
                      </>
                    )}
                  </div>
                </div>

                {/* Sign out button */}
                <button
                  onClick={handleSignOut}
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  {t.auth_sign_out}
                </button>
              </div>
            ) : (
              /* Firebase configured but not logged in */
              <div className="space-y-2">
                <button
                  onClick={handleSignInGoogle}
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.auth_sign_in_google}
                </button>
                <button
                  onClick={handleSignInAnonymous}
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-surface-700 hover:bg-surface-600 border border-surface-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <User size={18} />
                  {t.auth_sign_in_anonymous}
                </button>
              </div>
            )}
          </div>

          {/* Credits */}
          <div className="text-center py-3 border-t border-surface-600/50">
            <p className="text-[10px] text-muted-dark">
              {t.credits} <span className="text-gold-400/60">Noemi Marcolini</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
