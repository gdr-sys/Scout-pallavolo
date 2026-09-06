import { useState } from 'react';
import { PlayerStats, Fundamental } from '../types';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { BarChart3, Filter, Info } from 'lucide-react';

interface Props {
  stats: PlayerStats[];
  matchStarted: boolean;
}

function StatPill({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={cn("rounded-lg px-2 py-1.5 text-center", bg)}>
      <span className={cn("text-[10px] font-bold block", color)}>{label}</span>
      <span className="text-white font-extrabold text-sm">{value}</span>
    </div>
  );
}

function MetricBadge({ value, color, bg, label }: { value: number; color: string; bg: string; label: string }) {
  return (
    <span className={cn("text-[10px] font-extrabold", color, bg, "px-1 rounded")} title={label}>
      {value}%
    </span>
  );
}

export default function StatsPage({ stats, matchStarted }: Props) {
  const { t } = useI18n();
  const [activeFund, setActiveFund] = useState<Fundamental | 'ALL'>('ALL');

  const FUND_TABS: { key: Fundamental | 'ALL'; label: string }[] = [
    { key: 'ALL', label: t.stats_all },
    { key: 'ATT', label: t.fund_attack },
    { key: 'RIC', label: t.fund_reception },
    { key: 'BAT', label: t.fund_serve },
    { key: 'MUR', label: t.fund_block },
    { key: 'DIF', label: t.fund_defense },
  ];

  if (!matchStarted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-3 text-muted-dark opacity-40" />
          <h3 className="text-lg font-bold text-white mb-2">{t.stats_no_match}</h3>
          <p className="text-sm text-muted max-w-xs mx-auto">{t.stats_no_match_desc}</p>
        </div>
      </div>
    );
  }

  const filteredStats = stats.filter((s) => {
    if (activeFund === 'ALL') return s.totals.total > 0;
    return s.fundamentals[activeFund].total > 0;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={18} className="text-gold-400" />
          <h2 className="text-base font-bold text-white">{t.stats_title}</h2>
          <Info size={14} className="text-muted-dark" title="SR=Success Rate, ER=Error Rate, NE=Net Efficiency" />
        </div>

        {/* Fund tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {FUND_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFund(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0",
                activeFund === tab.key
                  ? "bg-gold-400/15 text-gold-400 border border-gold-400/30"
                  : "bg-surface-700 text-muted hover:text-white hover:bg-surface-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Legend */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 flex-wrap text-[10px]">
          <span className="flex items-center gap-1 text-muted-dark">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>SR={t.report_success_rate}</span>
          </span>
          <span className="flex items-center gap-1 text-muted-dark">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>ER={t.report_error_rate}</span>
          </span>
          <span className="flex items-center gap-1 text-muted-dark">
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span>NE={t.report_net_efficiency}</span>
          </span>
        </div>
      </div>

      {/* Stats table */}
      <div className="flex-1 overflow-auto px-2 pb-4">
        {filteredStats.length === 0 ? (
          <div className="text-center py-12 text-muted-dark">
            <Filter size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">{t.stats_no_data}</p>
          </div>
        ) : activeFund === 'ALL' ? (
          <div className="space-y-2 mt-2">
            {filteredStats
              .sort((a, b) => b.totals.total - a.totals.total)
              .map((s) => (
                <div key={s.playerId} className="bg-surface-800 border border-surface-600/50 rounded-xl p-3 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-lg bg-gold-400/10 flex items-center justify-center text-xs font-bold text-gold-400">
                      {s.playerNumber}
                    </span>
                    <span className="text-sm font-bold text-white flex-1">{s.playerName}</span>
                    <span className="text-xs text-muted">{s.totals.total} {t.stats_actions}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <StatPill label="++" value={s.totals.pp} color="text-green-400" bg="bg-green-500/10" />
                    <StatPill label="+" value={s.totals.p} color="text-blue-400" bg="bg-blue-500/10" />
                    <StatPill label="\u2013" value={s.totals.m} color="text-yellow-400" bg="bg-yellow-500/10" />
                    <StatPill label="=" value={s.totals.eq} color="text-red-400" bg="bg-red-500/10" />
                  </div>
                  {/* Per-fundamental bars with all metrics */}
                  <div className="mt-3 space-y-1.5">
                    {(['ATT', 'RIC', 'BAT', 'MUR', 'DIF'] as Fundamental[]).map((f) => {
                      const fs = s.fundamentals[f];
                      if (fs.total === 0) return null;
                      return (
                        <div key={f} className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-dark w-7">{f}</span>
                          <div className="flex-1 h-4 bg-surface-700 rounded-full overflow-hidden flex">
                            {fs.pp > 0 && <div className="bg-green-500/60 h-full" style={{ width: `${(fs.pp / fs.total) * 100}%` }} />}
                            {fs.p > 0 && <div className="bg-blue-500/60 h-full" style={{ width: `${(fs.p / fs.total) * 100}%` }} />}
                            {fs.m > 0 && <div className="bg-yellow-500/60 h-full" style={{ width: `${(fs.m / fs.total) * 100}%` }} />}
                            {fs.eq > 0 && <div className="bg-red-500/60 h-full" style={{ width: `${(fs.eq / fs.total) * 100}%` }} />}
                          </div>
                          <span className="text-[10px] text-muted font-bold w-5 text-right">{fs.total}</span>
                          <MetricBadge value={fs.efficiency} color="text-white" bg="bg-white/10" label="Efficiency" />
                          <MetricBadge value={fs.positivity} color="text-blue-400" bg="bg-blue-500/10" label="Positivity" />
                          <MetricBadge value={fs.successRate} color="text-green-400" bg="bg-green-500/10" label="Success Rate" />
                          <MetricBadge value={fs.errorRate} color="text-red-400" bg="bg-red-500/10" label="Error Rate" />
                          <MetricBadge value={fs.netEfficiency} color="text-gold-400" bg="bg-gold-400/10" label="Net Efficiency" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="mt-2">
            <div className="bg-surface-800 border border-surface-600/50 rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[32px_1fr_32px_32px_32px_32px_36px_36px_36px_36px_36px_36px] gap-0 px-2 py-2 bg-navy-800/50 text-[10px] font-bold text-muted-dark uppercase tracking-wider">
                <span>N\u00b0</span>
                <span>{t.roster_player_name}</span>
                <span className="text-center text-green-400">++</span>
                <span className="text-center text-blue-400">+</span>
                <span className="text-center text-yellow-400">\u2013</span>
                <span className="text-center text-red-400">=</span>
                <span className="text-center">{t.stats_total}</span>
                <span className="text-center font-extrabold">Eff%</span>
                <span className="text-center font-extrabold">Pos%</span>
                <span className="text-center font-extrabold text-green-400">SR%</span>
                <span className="text-center font-extrabold text-red-400">ER%</span>
                <span className="text-center font-extrabold text-gold-400">NE%</span>
              </div>
              {filteredStats
                .sort((a, b) => b.fundamentals[activeFund].total - a.fundamentals[activeFund].total)
                .map((s, i) => {
                  const fs = s.fundamentals[activeFund];
                  return (
                    <div
                      key={s.playerId}
                      className={cn(
                        "grid grid-cols-[32px_1fr_32px_32px_32px_32px_36px_36px_36px_36px_36px_36px] gap-0 px-2 py-2.5 text-xs items-center",
                        i % 2 === 0 ? "bg-surface-800" : "bg-surface-700/30"
                      )}
                    >
                      <span className="font-bold text-gold-400">{s.playerNumber}</span>
                      <span className="font-semibold text-white truncate pr-1">{s.playerName}</span>
                      <span className="text-center text-green-400 font-bold">{fs.pp || '-'}</span>
                      <span className="text-center text-blue-400 font-bold">{fs.p || '-'}</span>
                      <span className="text-center text-yellow-400 font-bold">{fs.m || '-'}</span>
                      <span className="text-center text-red-400 font-bold">{fs.eq || '-'}</span>
                      <span className="text-center text-white font-bold">{fs.total}</span>
                      <span className={cn(
                        "text-center font-extrabold",
                        fs.efficiency >= 30 ? "text-green-400" : fs.efficiency >= 0 ? "text-white" : "text-red-400"
                      )}>
                        {fs.efficiency}%
                      </span>
                      <span className={cn(
                        "text-center font-extrabold",
                        fs.positivity >= 50 ? "text-blue-400" : "text-yellow-400"
                      )}>
                        {fs.positivity}%
                      </span>
                      <span className={cn(
                        "text-center font-extrabold",
                        fs.successRate >= 50 ? "text-green-400" : "text-white"
                      )}>
                        {fs.successRate}%
                      </span>
                      <span className={cn(
                        "text-center font-extrabold",
                        fs.errorRate <= 20 ? "text-green-400" : fs.errorRate <= 40 ? "text-yellow-400" : "text-red-400"
                      )}>
                        {fs.errorRate}%
                      </span>
                      <span className={cn(
                        "text-center font-extrabold",
                        fs.netEfficiency >= 30 ? "text-gold-400" : fs.netEfficiency >= 0 ? "text-white" : "text-red-400"
                      )}>
                        {fs.netEfficiency}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
