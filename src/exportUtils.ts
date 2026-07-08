import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PlayerStats, MatchState, Fundamental } from './types';

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

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Partita', 14, 15);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${match.info.homeTeam} vs ${match.info.awayTeam}`, 14, 23);

  const scoreText = match.scores
    .map((s, i) => `Set ${i + 1}: ${s.home}-${s.away}`)
    .join('  |  ');
  doc.text(scoreText, 14, 30);

  if (match.info.date) doc.text(`Data: ${match.info.date}`, 14, 37);
  if (match.info.location) doc.text(`Luogo: ${match.info.location}`, 100, 37);

  // Stats tables per fundamental
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

  // General totals
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
