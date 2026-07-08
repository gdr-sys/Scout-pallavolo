import { useMemo, useRef, useCallback } from 'react';
import { ActionEntry, Fundamental } from '../types';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { Download } from 'lucide-react';

interface Props {
  actions: ActionEntry[];
  onCourtTap?: (position: { x: number; y: number }) => void;
  selectedFundamental?: Fundamental | null;
  interactive?: boolean;
  showExport?: boolean;
}

export default function CourtHeatmap({ actions, onCourtTap, selectedFundamental, interactive = false, showExport = false }: Props) {
  const { t } = useI18n();
  const courtRef = useRef<HTMLDivElement>(null);

  // Filter actions with positions
  const positionedActions = useMemo(() => {
    return actions.filter(a => a.position && (selectedFundamental ? a.fundamental === selectedFundamental : true));
  }, [actions, selectedFundamental]);

  // Generate heatmap grid (divide court into cells)
  const heatmapData = useMemo(() => {
    const grid: Record<string, { count: number; pp: number; eq: number }> = {};
    const cellSize = 10; // 10% cells

    for (const action of positionedActions) {
      if (!action.position) continue;
      const cellX = Math.floor(action.position.x / cellSize) * cellSize;
      const cellY = Math.floor(action.position.y / cellSize) * cellSize;
      const key = `${cellX}_${cellY}`;
      
      if (!grid[key]) {
        grid[key] = { count: 0, pp: 0, eq: 0 };
      }
      grid[key].count++;
      if (action.quality === '++') grid[key].pp++;
      if (action.quality === '=') grid[key].eq++;
    }

    return grid;
  }, [positionedActions]);

  const maxCount = Math.max(1, ...Object.values(heatmapData).map(c => c.count));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onCourtTap) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onCourtTap({ x, y });
  };

  const handleExportImage = useCallback(() => {
    if (!courtRef.current) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    const width = 600;
    const height = 400;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#1a3d1a';
    ctx.fillRect(0, 0, width, height);

    // Court lines
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Attack lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(width * 0.33, 0);
    ctx.lineTo(width * 0.33, height);
    ctx.moveTo(width * 0.67, 0);
    ctx.lineTo(width * 0.67, height);
    ctx.stroke();

    // Draw heatmap cells
    Object.entries(heatmapData).forEach(([key, data]) => {
      const [x, y] = key.split('_').map(Number);
      const intensity = data.count / maxCount;
      const isPositive = data.pp > data.eq;
      
      ctx.fillStyle = isPositive 
        ? `rgba(34, 197, 94, ${intensity * 0.7})`
        : `rgba(239, 68, 68, ${intensity * 0.7})`;
      
      ctx.fillRect(
        (x / 100) * width,
        (y / 100) * height,
        width * 0.1,
        height * 0.1
      );

      // Count text
      if (data.count > 1) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          data.count.toString(),
          (x / 100) * width + width * 0.05,
          (y / 100) * height + height * 0.06
        );
      }
    });

    // Draw individual dots
    if (positionedActions.length <= 20) {
      positionedActions.forEach(action => {
        if (!action.position) return;
        
        const color = action.quality === '++' ? '#22c55e' :
          action.quality === '+' ? '#3b82f6' :
          action.quality === '-' ? '#eab308' : '#ef4444';
        
        ctx.beginPath();
        ctx.arc(
          (action.position.x / 100) * width,
          (action.position.y / 100) * height,
          6,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    // Download
    const link = document.createElement('a');
    link.download = `heatmap_${selectedFundamental || 'all'}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [heatmapData, maxCount, positionedActions, selectedFundamental]);

  return (
    <div className="bg-surface-800 border border-surface-600/50 rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-dark font-bold mb-2">
        {t.heatmap} {selectedFundamental && `(${selectedFundamental})`}
      </p>
      
      <div
        ref={courtRef}
        onClick={handleClick}
        className={cn(
          "relative w-full aspect-[3/2] bg-green-900/30 rounded-lg border-2 border-white/20 overflow-hidden",
          interactive && "cursor-crosshair"
        )}
      >
        {/* Court lines */}
        {/* Center line */}
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/30" />
        {/* Attack lines (3m from net) */}
        <div className="absolute top-0 left-[33%] w-0.5 h-full bg-white/20" />
        <div className="absolute top-0 left-[67%] w-0.5 h-full bg-white/20" />
        {/* Net */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-white/50" />
        
        {/* Position zones labels */}
        <div className="absolute top-1 left-1 text-[8px] text-white/40 font-bold">4</div>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-white/40 font-bold">3</div>
        <div className="absolute top-1 right-[52%] text-[8px] text-white/40 font-bold">2</div>
        <div className="absolute bottom-1 left-1 text-[8px] text-white/40 font-bold">5</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white/40 font-bold">6</div>
        <div className="absolute bottom-1 right-[52%] text-[8px] text-white/40 font-bold">1</div>

        {/* Heatmap cells */}
        {Object.entries(heatmapData).map(([key, data]) => {
          const [x, y] = key.split('_').map(Number);
          const intensity = data.count / maxCount;
          const isPositive = data.pp > data.eq;
          
          return (
            <div
              key={key}
              className="absolute w-[10%] h-[10%] rounded-sm transition-all"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: isPositive 
                  ? `rgba(34, 197, 94, ${intensity * 0.7})` 
                  : `rgba(239, 68, 68, ${intensity * 0.7})`,
              }}
            >
              {data.count > 1 && (
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow">
                  {data.count}
                </span>
              )}
            </div>
          );
        })}

        {/* Individual action dots (if few actions) */}
        {positionedActions.length <= 20 && positionedActions.map((action) => {
          if (!action.position) return null;
          const color = action.quality === '++' ? 'bg-green-500' :
            action.quality === '+' ? 'bg-blue-500' :
            action.quality === '-' ? 'bg-yellow-500' : 'bg-red-500';
          
          return (
            <div
              key={action.id}
              className={cn(
                "absolute w-2 h-2 rounded-full border border-white/50 transform -translate-x-1/2 -translate-y-1/2 transition-all",
                color
              )}
              style={{
                left: `${action.position.x}%`,
                top: `${action.position.y}%`,
              }}
              title={`#${action.playerNumber} ${action.fundamental} ${action.quality}`}
            />
          );
        })}

        {/* Interactive hint */}
        {interactive && positionedActions.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-white/50 text-center px-4">{t.heatmap_desc}</p>
          </div>
        )}
      </div>

      {/* Stats summary */}
      {positionedActions.length > 0 && (
        <div className="mt-2 flex items-center gap-2 text-[10px]">
          <span className="text-muted">{positionedActions.length} azioni mappate</span>
          <span className="text-green-400">
            {positionedActions.filter(a => a.quality === '++').length} ++
          </span>
          <span className="text-red-400">
            {positionedActions.filter(a => a.quality === '=').length} =
          </span>
          {showExport && (
            <button
              onClick={handleExportImage}
              className="ml-auto flex items-center gap-1 px-2 py-1 bg-surface-700 hover:bg-surface-600 rounded-lg text-muted hover:text-white transition-colors"
            >
              <Download size={10} />
              <span>PNG</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
