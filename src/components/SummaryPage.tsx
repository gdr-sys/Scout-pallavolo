import { useState } from 'react';
import { PlayerStats, MatchState, Player } from '../types';
import { exportCSV, exportPDF, generateWhatsAppText, downloadDataVolley } from '../exportUtils';
import { useI18n } from '../i18n/context';
import { useSettings } from '../contexts/SettingsContext';
import { cn } from '../utils/cn';
import { FileText, Download, FileSpreadsheet, RotateCcw, Trophy, Clock, Zap, MessageCircle, Database, Check, Calculator } from 'lucide-react';
import CourtHeatmap from './CourtHeatmap';

interface Props {
  stats: PlayerStats[];
  match: MatchState;
  players: Player[];
  onResetMatch: () => void;
}

export default function SummaryPage({ stats, match, players, onResetMatch }: Props) {
  const { t, language } = useI18n();
  const { advancedMode } = useSettings();
  const [copied, setCopied] = useState(false);

  if (!match.started) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-3 text-muted-dark opacity-40" />
          <h3 className="text-lg font-bold text-white mb-2">{t.summary_no_match}</h3>
          <p className="text-sm text-muted max-w-xs mx-auto">{t.summary_no_match_desc}</p>
        </div>
      </div>
    );
  }

  const totalActions = match.actions.length;
  const setsPlayed = match.scores.length;
  const mvp = stats.reduce((best, s) => (s.totals.pp > (best?.totals.pp || 0) ? s : best), stats[0]);

  const teamTotals = stats.reduce(
    (acc, s) => ({
      pp: acc.pp + s.totals.pp,
      p: acc.p + s.totals.p,
      m: acc.m + s.totals.m,
      eq: acc.eq + s.totals.eq,
      total: acc.total + s.totals.total,
    }),
    { pp: 0, p: 0, m: 0, eq: 0, total: 0 }
  );

  const handleWhatsAppCopy = async () => {
    const text = generateWhatsAppText(stats, match, language);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportPDF = () => {
    exportPDF(stats, match, language);
  };

  const handleExportCSV = () => {
    exportCSV(stats, match, language);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <FileText size={18} className="text-gold-400" />
          <h2 className="text-base font-bold text-white">{t.summary_title}</h2>
        </div>

        {/* Match overview */}
        <div className="bg-surface-800 border border-surface-600/50 rounded-2xl p-4 mb-4">
          <div className="text-center mb-4">
            <p className="text-xs text-muted-dark uppercase tracking-wider font-bold mb-2">{t.summary_result}</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-base font-bold text-white">{match.info.homeTeam}</span>
              <div className="flex gap-1.5">
                {match.scores.map((s, i) => (
                  <div key={i} className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold",
                    i === match.currentSet - 1
                      ? "bg-gold-400/15 text-gold-400 border border-gold-400/30"
                      : "bg-surface-700 text-muted"
                  )}>
                    {s.home}-{s.away}
                  </div>
                ))}
              </div>
              <span className="text-base font-bold text-white">{match.info.awayTeam}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <QuickStat icon={<Zap size={14} />} label={t.summary_actions} value={totalActions} />
            <QuickStat icon={<Clock size={14} />} label={t.summary_sets} value={setsPlayed} />
            <QuickStat icon={<Trophy size={14} />} label={t.summary_players} value={players.length} />
          </div>
        </div>

        {/* MVP */}
        {mvp && mvp.totals.pp > 0 && (
          <div className="bg-gradient-to-r from-gold-400/10 to-gold-400/5 border border-gold-400/20 rounded-2xl p-4 mb-4">
            <p className="text-[10px] uppercase tracking-wider text-gold-400/70 font-bold mb-2">\u2b50 {t.summary_mvp}</p>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gold-400/15 flex items-center justify-center text-lg font-bold text-gold-400">
                {mvp.playerNumber}
              </span>
              <div>
                <p className="text-white font-bold">{mvp.playerName}</p>
                <p className="text-xs text-muted">
                  {mvp.totals.pp} {t.summary_mvp_desc} {mvp.totals.total}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Team totals */}
        <div className="bg-surface-800 border border-surface-600/50 rounded-2xl p-4 mb-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-3">{t.summary_team_totals}</p>
          <div className="grid grid-cols-5 gap-2">
            <div className="bg-green-500/10 rounded-xl p-2 text-center">
              <span className="text-green-400 text-[10px] font-bold">++</span>
              <p className="text-white font-extrabold text-lg">{teamTotals.pp}</p>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-2 text-center">
              <span className="text-blue-400 text-[10px] font-bold">+</span>
              <p className="text-white font-extrabold text-lg">{teamTotals.p}</p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-2 text-center">
              <span className="text-yellow-400 text-[10px] font-bold">\u2013</span>
              <p className="text-white font-extrabold text-lg">{teamTotals.m}</p>
            </div>
            <div className="bg-red-500/10 rounded-xl p-2 text-center">
              <span className="text-red-400 text-[10px] font-bold">=</span>
              <p className="text-white font-extrabold text-lg">{teamTotals.eq}</p>
            </div>
            <div className="bg-surface-600/30 rounded-xl p-2 text-center">
              <span className="text-muted text-[10px] font-bold">TOT</span>
              <p className="text-white font-extrabold text-lg">{teamTotals.total}</p>
            </div>
          </div>
        </div>

        {/* Export buttons */}
        <div className="space-y-2 mb-6">
          <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-2">{t.summary_export}</p>
          
          <button
            onClick={handleExportPDF}
            className="w-full bg-navy-600 hover:bg-navy-500 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-colors"
          >
            <Download size={18} />
            {t.summary_download_pdf}
          </button>
          
          <button
            onClick={handleExportCSV}
            className="w-full bg-surface-700 hover:bg-surface-600 border border-surface-500 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-colors"
          >
            <FileSpreadsheet size={18} />
            {t.summary_download_csv}
          </button>

          {/* WhatsApp export */}
          <button
            onClick={handleWhatsAppCopy}
            className={cn(
              "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-colors",
              copied
                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                : "bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400"
            )}
          >
            {copied ? <Check size={18} /> : <MessageCircle size={18} />}
            {copied ? t.copied : t.export_whatsapp}
          </button>

          {/* DataVolley export (advanced mode only) */}
          {advancedMode && (
            <button
              onClick={() => downloadDataVolley(match, players)}
              className="w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-colors"
            >
              <Database size={18} />
              {t.export_datavolley}
            </button>
          )}
        </div>

        {/* Heatmap with export (advanced mode) */}
        {advancedMode && match.actions.some(a => a.position) && (
          <div className="mb-4">
            <CourtHeatmap 
              actions={match.actions} 
              showExport={true}
            />
          </div>
        )}

        {/* Metric Formulas */}
        <div className="bg-surface-800 border border-surface-600/50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={16} className="text-gold-400" />
            <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold">{t.report_formulas_title}</p>
          </div>
          <div className="space-y-2 text-[11px] text-muted">
            <p><span className="text-gold-400 font-bold">Pos%</span>: {t.report_formula_positivity}</p>
            <p><span className="text-gold-400 font-bold">SR%</span>: {t.report_formula_success_rate}</p>
            <p><span className="text-gold-400 font-bold">ER%</span>: {t.report_formula_error_rate}</p>
            <p><span className="text-gold-400 font-bold">NE%</span>: {t.report_formula_net_efficiency}</p>
            <p className="text-[10px] text-muted-dark mt-2 italic">{t.report_formula_note}</p>
          </div>
        </div>

        {/* Reset button */}
        <div className="pt-4 border-t border-surface-600/50">
          <button
            onClick={() => {
              if (confirm(t.summary_end_match_confirm)) {
                onResetMatch();
              }
            }}
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={16} />
            {t.summary_end_match}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-surface-700/50 rounded-xl p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-muted mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-white font-extrabold text-xl">{value}</p>
    </div>
  );
}
