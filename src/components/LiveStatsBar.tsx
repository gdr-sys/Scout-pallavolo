import { useMemo } from 'react';
import { ActionEntry, Fundamental } from '../types';
import { cn } from '../utils/cn';

interface Props {
  actions: ActionEntry[];
}

export default function LiveStatsBar({ actions }: Props) {
  const stats = useMemo(() => {
    const fundamentals: Fundamental[] = ['ATT', 'RIC', 'BAT', 'MUR', 'DIF'];
    const emoji: Record<Fundamental, string> = {
      ATT: '⚡', RIC: '🛡️', BAT: '🏐', MUR: '🧱', DIF: '🤸'
    };

    return fundamentals.map(fund => {
      const fa = actions.filter(a => a.fundamental === fund);
      const total = fa.length;
      if (total === 0) return { fund, emoji: emoji[fund], eff: 0, pos: 0, total: 0 };
      
      const pp = fa.filter(a => a.quality === '++').length;
      const p = fa.filter(a => a.quality === '+').length;
      const m = fa.filter(a => a.quality === '-').length;
      
      return {
        fund,
        emoji: emoji[fund],
        eff: Math.round(((pp - m) / total) * 100),
        pos: Math.round(((pp + p) / total) * 100),
        total,
      };
    }).filter(s => s.total > 0);
  }, [actions]);

  if (stats.length === 0) return null;

  return (
    <div className="bg-surface-800/80 backdrop-blur-sm border-b border-surface-600/30 px-2 py-1.5 flex-shrink-0">
      <div className="flex gap-1.5 overflow-x-auto">
        {stats.map(s => (
          <div
            key={s.fund}
            className="flex items-center gap-1 px-2 py-1 bg-surface-700/60 rounded-lg flex-shrink-0"
          >
            <span className="text-[10px]">{s.emoji}</span>
            <span className="text-[10px] font-bold text-muted-dark">{s.fund}</span>
            <span className={cn(
              "text-[10px] font-extrabold",
              s.eff >= 30 ? "text-green-400" : s.eff >= 0 ? "text-yellow-400" : "text-red-400"
            )}>
              {s.eff}%
            </span>
            <span className="text-[9px] text-muted-dark">|</span>
            <span className={cn(
              "text-[10px] font-extrabold",
              s.pos >= 50 ? "text-blue-400" : "text-yellow-400"
            )}>
              {s.pos}%
            </span>
            <span className="text-[9px] text-muted-dark">({s.total})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
