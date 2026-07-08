import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PlayerStats, MatchState, Fundamental, Player } from './types';

const FUND_LABELS: Record<Fundamental, string> = {
  ATT: 'Attacco',
  DIF: 'Difesa',
  MUR: 'Muro',
  BAT: 'Battuta',
  RIC: 'Ricezione',
};

export function exportCSV(stats: PlayerStats[], match: MatchState) {
  const header = [
    'N°', 'Nome', 'Ruolo',
    'ATT++', 'ATT+', 'ATT-', 'ATT=', 'ATT Tot', 'ATT Eff%', 'ATT Pos%',
    'DIF++', 'DIF+', 'DIF-', 'DIF=', 'DIF Tot', 'DIF Eff%', 'DIF Pos%',
    'MUR++', 'MUR+', 'MUR-', 'MUR=', 'MUR Tot', 'MUR Eff%', 'MUR Pos%',
    'BAT++', 'BAT+', 'BAT-', 'BAT=', 'BAT Tot', 'BAT Eff%', 'BAT Pos%',
    'RIC++', 'RIC+', 'RIC-', 'RIC=', 'RIC Tot', 'RIC Eff%', 'RIC Pos%',
    'TOT++', 'TOT+', 'TOT-', 'TOT=', 'TOTALE',
  ];

  const fundamentals: Fundamental[] = ['ATT', 'DIF', 'MUR', 'BAT', 'RIC'];

  const rows = stats.map((s) => {
    const fundCols = fundamentals.flatMap((f) => {
      const fs = s.fundamentals[f];
      return [fs.pp, fs.p, fs.m, fs.eq, fs.total, fs.efficiency, fs.positivity];
    });
    return [
      s.playerNumber, s.playerName, s.playerRole,
      ...fundCols,
      s.totals.pp, s.totals.p, s.totals.m, s.totals.eq, s.totals.total,
    ];
  });

  const csvContent = [header, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `scout_${match.info.homeTeam}_vs_${match.info.awayTeam}_${match.info.date || 'match'}.csv`;
  link.click();
}

export function exportPDF(stats: PlayerStats[], match: MatchState) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const fundamentals: Fundamental[] = ['ATT', 'DIF', 'MUR', 'BAT', 'RIC'];

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Partita', 14, 15);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${match.info.homeTeam} vs ${match.info.awayTeam}`, 14, 23);

  const scoreText = match.scores
    .map((s, i) => `Set ${i + 1}: ${s.home}-${s.away}`)
    .join(' | ');
  doc.text(scoreText, 14, 30);

  if (match.info.date) doc.text(`Data: ${match.info.date}`, 14, 37);
  if (match.info.location) doc.text(`Luogo: ${match.info.location}`, 100, 37);

  let startY = 45;

  fundamentals.forEach((fund) => {
    const head = [['N°', 'Nome', '++', '+', '-', '=', 'Tot', 'Eff%', 'Pos%']];
    const body = stats
      .filter((s) => s.fundamentals[fund].total > 0)
      .map((s) => {
        const fs = s.fundamentals[fund];
        return [s.playerNumber, s.playerName, fs.pp, fs.p, fs.m, fs.eq, fs.total, `${fs.efficiency}%`, `${fs.positivity}%`];
      });

    if (body.length === 0) return;

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(FUND_LABELS[fund], 14, startY);

    autoTable(doc, {
      startY: startY + 3,
      head,
      body,
      theme: 'grid',
      headStyles: { fillColor: [26, 44, 107], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14 },
    });

    startY = (doc as any).lastAutoTable.finalY + 10;
    if (startY > 170) {
      doc.addPage();
      startY = 15;
    }
  });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Riepilogo Generale', 14, startY);

  const totHead = [['N°', 'Nome', 'Ruolo', '++', '+', '-', '=', 'Totale']];
  const totBody = stats
    .filter((s) => s.totals.total > 0)
    .map((s) => [s.playerNumber, s.playerName, s.playerRole, s.totals.pp, s.totals.p, s.totals.m, s.totals.eq, s.totals.total]);

  autoTable(doc, {
    startY: startY + 3,
    head: totHead,
    body: totBody,
    theme: 'grid',
    headStyles: { fillColor: [26, 44, 107], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 14 },
  });

  doc.save(`scout_${match.info.homeTeam}_vs_${match.info.awayTeam}_${match.info.date || 'match'}.pdf`);
}

// WhatsApp-friendly plain text export
export function generateWhatsAppText(stats: PlayerStats[], match: MatchState): string {
  const lines: string[] = [];
  
  lines.push(`🏐 *${match.info.homeTeam} vs ${match.info.awayTeam}*`);
  if (match.info.date) lines.push(`📅 ${match.info.date}`);
  if (match.info.location) lines.push(`📍 ${match.info.location}`);
  lines.push('');
  
  // Scores
  lines.push('*📊 Punteggi:*');
  match.scores.forEach((s, i) => {
    lines.push(`  Set ${i + 1}: ${s.home} - ${s.away}`);
  });
  lines.push('');

  // Key stats per player
  const fundamentals: Fundamental[] = ['ATT', 'RIC', 'BAT', 'MUR', 'DIF'];
  const fundEmoji: Record<Fundamental, string> = { ATT: '⚡', RIC: '🛡️', BAT: '🏐', MUR: '🧱', DIF: '🤸' };
  
  const activePlayers = stats.filter(s => s.totals.total > 0).sort((a, b) => b.totals.total - a.totals.total);
  
  if (activePlayers.length > 0) {
    lines.push('*📈 Statistiche Chiave:*');
    lines.push('');
    
    for (const s of activePlayers) {
      lines.push(`*#${s.playerNumber} ${s.playerName}* (${s.totals.total} azioni)`);
      
      for (const f of fundamentals) {
        const fs = s.fundamentals[f];
        if (fs.total === 0) continue;
        lines.push(`  ${fundEmoji[f]} ${f}: *Eff ${fs.efficiency}%* | *Pos ${fs.positivity}%* (${fs.total})`);
      }
      lines.push('');
    }
  }

  // MVP
  const mvp = stats.reduce((best, s) => (s.totals.pp > (best?.totals.pp || 0) ? s : best), stats[0]);
  if (mvp && mvp.totals.pp > 0) {
    lines.push(`⭐ *MVP:* #${mvp.playerNumber} ${mvp.playerName} (${mvp.totals.pp}++ su ${mvp.totals.total})`);
  }

  return lines.join('\n');
}

// DataVolley export (.dvw format)
export function exportToDataVolley(match: MatchState, players: Player[]): string {
  const lines: string[] = [];
  
  // Header section
  lines.push('[3SCOUT]');
  lines.push(`[3SET]`);
  lines.push(`[3MATCH]`);
  lines.push(`Match Date: ${match.info.date || new Date().toISOString().split('T')[0]}`);
  lines.push(`Home: ${match.info.homeTeam}`);
  lines.push(`Away: ${match.info.awayTeam}`);
  lines.push(`Location: ${match.info.location || ''}`);
  lines.push('');
  
  // Score section
  lines.push('[3SCORE]');
  match.scores.forEach((s, i) => {
    lines.push(`Set ${i + 1};${s.home};${s.away}`);
  });
  lines.push('');
  
  // Players section
  lines.push('[3PLAYERS-H]');
  players.forEach(p => {
    const roleCode = getRoleCode(p.role);
    lines.push(`${p.number};${p.name};${roleCode}`);
  });
  lines.push('');
  
  // Actions section - DataVolley-like format
  // Format: Set;HomeScore;AwayScore;Team;PlayerNumber;Skill;Type;Result;Position;Rotation
  lines.push('[3SCOUT]');
  
  const fundMap: Record<string, string> = {
    'ATT': 'A', 'RIC': 'R', 'BAT': 'S', 'MUR': 'B', 'DIF': 'D'
  };
  
  const qualityMap: Record<string, string> = {
    '++': '#', '+': '+', '-': '/', '=': '='
  };
  
  for (const action of match.actions) {
    const skillCode = fundMap[action.fundamental] || 'X';
    const evalCode = qualityMap[action.quality] || '!';
    const posStr = action.position ? `${action.position.x},${action.position.y}` : '';
    const rotStr = action.rotation ? `R${action.rotation}` : '';
    
    lines.push(
      `${action.set};*;*;*;` +
      `${action.playerNumber};${skillCode};H;${evalCode};` +
      `${posStr};${rotStr};${action.timestamp}`
    );
  }
  
  return lines.join('\n');
}

function getRoleCode(role: string): string {
  switch (role) {
    case 'Palleggiatore': return 'S';
    case 'Opposto': return 'O';
    case 'Schiacciatore': return 'R';
    case 'Centrale': return 'M';
    case 'Libero': return 'L';
    default: return 'U';
  }
}

export function downloadDataVolley(match: MatchState, players: Player[]) {
  const content = exportToDataVolley(match, players);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `scout_${match.info.homeTeam}_vs_${match.info.awayTeam}_${match.info.date || 'match'}.dvw`;
  link.click();
}
