import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PlayerStats, MatchState, Fundamental, Player } from './types';

const FUND_LABELS_IT: Record<Fundamental, string> = {
  ATT: 'Attacco',
  DIF: 'Difesa',
  MUR: 'Muro',
  BAT: 'Battuta',
  RIC: 'Ricezione',
};

const FUND_LABELS_EN: Record<Fundamental, string> = {
  ATT: 'Attack',
  DIF: 'Defense',
  MUR: 'Block',
  BAT: 'Serve',
  RIC: 'Reception',
};

const ROLE_LABELS_IT: Record<string, string> = {
  'Palleggiatore': 'Palleggiatore',
  'Opposto': 'Opposto',
  'Schiacciatore': 'Schiacciatore',
  'Centrale': 'Centrale',
  'Libero': 'Libero',
};

const ROLE_LABELS_EN: Record<string, string> = {
  'Palleggiatore': 'Setter',
  'Opposto': 'Opposite',
  'Schiacciatore': 'Outside Hitter',
  'Centrale': 'Middle Blocker',
  'Libero': 'Libero',
};

function getFundLabels(lang: string = 'en'): Record<Fundamental, string> {
  return lang === 'it' ? FUND_LABELS_IT : FUND_LABELS_EN;
}

function getRoleLabels(lang: string = 'en'): Record<string, string> {
  return lang === 'it' ? ROLE_LABELS_IT : ROLE_LABELS_EN;
}

const QUALITY_LABELS_IT = {
  '++': 'Eccellente',
  '+': 'Positivo',
  '-': 'Negativo',
  '=': 'Errore',
};

const QUALITY_LABELS_EN = {
  '++': 'Excellent',
  '+': 'Positive',
  '-': 'Negative',
  '=': 'Error',
};

function getQualityLabels(lang: string = 'en') {
  return lang === 'it' ? QUALITY_LABELS_IT : QUALITY_LABELS_EN;
}

export function exportCSV(stats: PlayerStats[], match: MatchState, lang: string = 'en') {
  const fundLabels = getFundLabels(lang);
  const roleLabels = getRoleLabels(lang);
  const qualityLabels = getQualityLabels(lang);

  const header = [
    'No.', 'Name', 'Role',
    `${fundLabels.ATT}++`, `${fundLabels.ATT}+`, `${fundLabels.ATT}-`, `${fundLabels.ATT}=`, `${fundLabels.ATT} Tot`, `${fundLabels.ATT} Eff%`, `${fundLabels.ATT} Pos%`, `${fundLabels.ATT} SR%`, `${fundLabels.ATT} ER%`, `${fundLabels.ATT} NE%`,
    `${fundLabels.DIF}++`, `${fundLabels.DIF}+`, `${fundLabels.DIF}-`, `${fundLabels.DIF}=`, `${fundLabels.DIF} Tot`, `${fundLabels.DIF} Eff%`, `${fundLabels.DIF} Pos%`, `${fundLabels.DIF} SR%`, `${fundLabels.DIF} ER%`, `${fundLabels.DIF} NE%`,
    `${fundLabels.MUR}++`, `${fundLabels.MUR}+`, `${fundLabels.MUR}-`, `${fundLabels.MUR}=`, `${fundLabels.MUR} Tot`, `${fundLabels.MUR} Eff%`, `${fundLabels.MUR} Pos%`, `${fundLabels.MUR} SR%`, `${fundLabels.MUR} ER%`, `${fundLabels.MUR} NE%`,
    `${fundLabels.BAT}++`, `${fundLabels.BAT}+`, `${fundLabels.BAT}-`, `${fundLabels.BAT}=`, `${fundLabels.BAT} Tot`, `${fundLabels.BAT} Eff%`, `${fundLabels.BAT} Pos%`, `${fundLabels.BAT} SR%`, `${fundLabels.BAT} ER%`, `${fundLabels.BAT} NE%`,
    `${fundLabels.RIC}++`, `${fundLabels.RIC}+`, `${fundLabels.RIC}-`, `${fundLabels.RIC}=`, `${fundLabels.RIC} Tot`, `${fundLabels.RIC} Eff%`, `${fundLabels.RIC} Pos%`, `${fundLabels.RIC} SR%`, `${fundLabels.RIC} ER%`, `${fundLabels.RIC} NE%`,
    'TOT++', 'TOT+', 'TOT-', 'TOT=', 'Total',
  ];

  const fundamentals: Fundamental[] = ['ATT', 'DIF', 'MUR', 'BAT', 'RIC'];

  const rows = stats.map((s) => {
    const fundCols = fundamentals.flatMap((f) => {
      const fs = s.fundamentals[f];
      return [fs.pp, fs.p, fs.m, fs.eq, fs.total, fs.efficiency, fs.positivity];
    });
    const newMetrics = fundamentals.flatMap((f) => {
      const fs = s.fundamentals[f];
      return [fs.successRate, fs.errorRate, fs.netEfficiency];
    });
    return [
      s.playerNumber, s.playerName, roleLabels[s.playerRole] || s.playerRole,
      ...fundCols,
      ...newMetrics,
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

export function exportPDF(stats: PlayerStats[], match: MatchState, lang: string = 'en') {
  const doc = new jsPDF({ orientation: 'landscape' });
  const fundamentals: Fundamental[] = ['ATT', 'DIF', 'MUR', 'BAT', 'RIC'];
  const fundLabels = getFundLabels(lang);
  const roleLabels = getRoleLabels(lang);

  const reportTitle = lang === 'it' ? 'Report Partita' : 'Match Report';
  const summaryTitle = lang === 'it' ? 'Riepilogo Generale' : 'General Summary';

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(reportTitle, 14, 15);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${match.info.homeTeam} vs ${match.info.awayTeam}`, 14, 23);

  const scoreText = match.scores
    .map((s, i) => `Set ${i + 1}: ${s.home}-${s.away}`)
    .join(' | ');
  doc.text(scoreText, 14, 30);

  if (match.info.date) doc.text(`Date: ${match.info.date}`, 14, 37);
  if (match.info.location) doc.text(`Location: ${match.info.location}`, 100, 37);

  let startY = 45;

  fundamentals.forEach((fund) => {
    const head = [['No.', 'Name', '++', '+', '-', '=', 'Tot', 'Eff%', 'Pos%', 'SR%', 'ER%', 'NE%']];
    const body = stats
      .filter((s) => s.fundamentals[fund].total > 0)
      .map((s) => {
        const fs = s.fundamentals[fund];
        return [s.playerNumber, s.playerName, fs.pp, fs.p, fs.m, fs.eq, fs.total, `${fs.efficiency}%`, `${fs.positivity}%`, `${fs.successRate}%`, `${fs.errorRate}%`, `${fs.netEfficiency}%`];
      });

    if (body.length === 0) return;

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(fundLabels[fund], 14, startY);

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
  doc.text(summaryTitle, 14, startY);

  const totHead = [['No.', 'Name', 'Role', '++', '+', '-', '=', 'Total', 'Eff%', 'Pos%', 'SR%', 'ER%', 'NE%']];
  const totBody = stats
    .filter((s) => s.totals.total > 0)
    .map((s) => {
      // Calculate overall metrics from fundamentals
      const allFunds = ['ATT', 'DIF', 'MUR', 'BAT', 'RIC'] as Fundamental[];
      let totalForMetrics = 0;
      let totalSuccess = 0;
      let totalErrors = 0;
      let totalNet = 0;
      
      allFunds.forEach(f => {
        const fs = s.fundamentals[f];
        totalForMetrics += fs.total;
        totalSuccess += fs.pp + fs.p;
        totalErrors += fs.eq;
        totalNet += fs.pp - fs.m - fs.eq;
      });
      
      const overallEfficiency = totalForMetrics > 0 ? Math.round(((s.totals.pp - s.totals.m) / totalForMetrics) * 100) : 0;
      const overallPositivity = totalForMetrics > 0 ? Math.round(((s.totals.pp + s.totals.p) / totalForMetrics) * 100) : 0;
      const overallSuccessRate = totalForMetrics > 0 ? Math.round((totalSuccess / totalForMetrics) * 100) : 0;
      const overallErrorRate = totalForMetrics > 0 ? Math.round((totalErrors / totalForMetrics) * 100) : 0;
      const overallNetEfficiency = totalForMetrics > 0 ? Math.round((totalNet / totalForMetrics) * 100) : 0;
      
      return [s.playerNumber, s.playerName, roleLabels[s.playerRole] || s.playerRole, s.totals.pp, s.totals.p, s.totals.m, s.totals.eq, s.totals.total, `${overallEfficiency}%`, `${overallPositivity}%`, `${overallSuccessRate}%`, `${overallErrorRate}%`, `${overallNetEfficiency}%`];
    });

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

  // Add metric formulas as footer
  const formulasTitle = lang === 'it' ? 'Formule Metriche' : 'Metric Formulas';
  doc.addPage();
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(formulasTitle, 14, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const formulaLines = [
    `Pos%: ((++ + +) / Total) x 100`,
    `SR%: ((++ + +) / Total) x 100`,
    `ER%: (= / Total) x 100`,
    `NE%: ((++ - - - =) / Total) x 100`,
    `++ = Excellent, + = Positive, - = Negative, = = Error`
  ];
  formulaLines.forEach((line, i) => {
    doc.text(line, 14, 25 + (i * 8));
  });
}

// WhatsApp-friendly plain text export
export function generateWhatsAppText(stats: PlayerStats[], match: MatchState, lang: string = 'en'): string {
  const lines: string[] = [];
  const fundLabels = getFundLabels(lang);
  const qualityLabels = getQualityLabels(lang);
  
  const matchLabel = lang === 'it' ? 'Partita' : 'Match';
  const scoresLabel = lang === 'it' ? 'Punteggi' : 'Scores';
  const statsLabel = lang === 'it' ? 'Statistiche Chiave' : 'Key Statistics';
  const mvpLabel = lang === 'it' ? 'MVP' : 'MVP';
  const effLabel = lang === 'it' ? 'Eff' : 'Eff';
  const posLabel = lang === 'it' ? 'Pos' : 'Pos';
  const actionsLabel = lang === 'it' ? 'azioni' : 'actions';

  lines.push(`\ud83c\udfd0 *${match.info.homeTeam} vs ${match.info.awayTeam}*`);
  if (match.info.date) lines.push(`\ud83d\udcc5 ${match.info.date}`);
  if (match.info.location) lines.push(`\ud83d\udccd ${match.info.location}`);
  lines.push('');
  
  // Scores
  lines.push(`*\ud83d\udcca ${scoresLabel}:*`);
  match.scores.forEach((s, i) => {
    lines.push(`  Set ${i + 1}: ${s.home} - ${s.away}`);
  });
  lines.push('');

  // Key stats per player
  const fundamentals: Fundamental[] = ['ATT', 'RIC', 'BAT', 'MUR', 'DIF'];
  const fundEmoji: Record<Fundamental, string> = { ATT: '\u26a1', RIC: '\ud83d\udee1\ufe0f', BAT: '\ud83c\udfd0', MUR: '\ud83e\uddf1', DIF: '\ud83e\udd38' };
  
  const activePlayers = stats.filter(s => s.totals.total > 0).sort((a, b) => b.totals.total - a.totals.total);
  
  if (activePlayers.length > 0) {
    lines.push(`*\ud83d\udcc8 ${statsLabel}:*`);
    lines.push('');
    
    for (const s of activePlayers) {
      lines.push(`*#${s.playerNumber} ${s.playerName}* (${s.totals.total} ${actionsLabel})`);
      
      for (const f of fundamentals) {
        const fs = s.fundamentals[f];
        if (fs.total === 0) continue;
        lines.push(`  ${fundEmoji[f]} ${fundLabels[f]}: *${effLabel} ${fs.efficiency}%* | *${posLabel} ${fs.positivity}%* | *SR ${fs.successRate}%* | *ER ${fs.errorRate}%* | *NE ${fs.netEfficiency}%* (${fs.total})`);
      }
      lines.push('');
    }
  }

  // MVP
  const mvp = stats.reduce((best, s) => (s.totals.pp > (best?.totals.pp || 0) ? s : best), stats[0]);
  if (mvp && mvp.totals.pp > 0) {
    const mvpText = lang === 'it' ? 'MVP della partita' : 'Match MVP';
    lines.push(`\u2b50 *${mvpLabel}: ${mvpText}* #${mvp.playerNumber} ${mvp.playerName} (${mvp.totals.pp}++ su ${mvp.totals.total})`);
  }

  // Add metric formulas
  lines.push('');
  const formulasTitle = lang === 'it' ? 'Formule Metriche' : 'Metric Formulas';
  lines.push(`*\ud83d\udcd3 ${formulasTitle}:*`);
  lines.push(`Pos%: ((++ + +) / Total) x 100`);
  lines.push(`SR%: ((++ + +) / Total) x 100`);
  lines.push(`ER%: (= / Total) x 100`);
  lines.push(`NE%: ((++ - - - =) / Total) x 100`);
  lines.push(`++ = Excellent, + = Positive, - = Negative, = = Error`);

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
