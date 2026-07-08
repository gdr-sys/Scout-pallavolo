import { useI18n } from '../i18n/context';
import { useSettings } from '../contexts/SettingsContext';
import { cn } from '../utils/cn';
import { X, Globe, Check, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { language, setLanguage, t, languages } = useI18n();
  const { advancedMode, toggleAdvancedMode } = useSettings();

  if (!isOpen) return null;

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
        <div className="p-4 overflow-y-auto space-y-5">
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
                    "relative w-14 h-7 rounded-full transition-colors flex-shrink-0",
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
                    <li>✓ Dashboard stats live avanzata</li>
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
