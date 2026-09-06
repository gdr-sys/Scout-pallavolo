export type Language = 'it' | 'en' | 'es' | 'fr' | 'de' | 'pt';

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export type TranslationKeys = {
  app_title: string;
  app_subtitle: string;
  nav_home: string;
  nav_scout: string;
  nav_stats: string;
  nav_roster: string;
  nav_report: string;
  nav_matches: string;
  // Game management
  games_title: string;
  games_no_games: string;
  games_no_games_desc: string;
  games_new_game: string;
  games_load: string;
  games_delete: string;
  games_delete_confirm: string;
  games_current: string;
  // Wizard steps
  wizard_step: string;
  wizard_step_teams: string;
  wizard_step_details: string;
  wizard_step_roster: string;
  wizard_step_starters: string;
  wizard_step_liberos: string;
  wizard_step_ready: string;
  wizard_next: string;
  wizard_back: string;
  wizard_finish: string;
  create: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  confirm: string;
  undo: string;
  export: string;
  download: string;
  close: string;
  home_new_match: string;
  home_teams: string;
  home_team_home: string;
  home_team_away: string;
  home_details: string;
  home_date: string;
  home_location: string;
  home_roster: string;
  home_select_roster: string;
  home_no_roster: string;
  home_start_match: string;
  home_match_in_progress: string;
  home_go_to_scout: string;
  scout_no_match: string;
  scout_no_match_desc: string;
  scout_select_player: string;
  scout_new_set: string;
  scout_set: string;
  scout_point_home: string;
  scout_point_away: string;
  scout_no_actions: string;
  scout_action_undone: string;
  fund_attack: string;
  fund_attack_short: string;
  fund_reception: string;
  fund_reception_short: string;
  fund_serve: string;
  fund_serve_short: string;
  fund_block: string;
  fund_block_short: string;
  fund_defense: string;
  fund_defense_short: string;
  quality_excellent: string;
  quality_positive: string;
  quality_negative: string;
  quality_error: string;
  role_setter: string;
  role_setter_short: string;
  role_opposite: string;
  role_opposite_short: string;
  role_outside: string;
  role_outside_short: string;
  role_middle: string;
  role_middle_short: string;
  role_libero: string;
  role_libero_short: string;
  roster_management: string;
  roster_management_desc: string;
  roster_new_name: string;
  roster_no_rosters: string;
  roster_no_rosters_desc: string;
  roster_add_player: string;
  roster_player_name: string;
  roster_player_number: string;
  roster_players: string;
  roster_delete_confirm: string;
  stats_title: string;
  stats_no_match: string;
  stats_no_match_desc: string;
  stats_all: string;
  stats_no_data: string;
  stats_actions: string;
  stats_total: string;
  stats_efficiency: string;
  stats_positivity: string;
  summary_title: string;
  summary_no_match: string;
  summary_no_match_desc: string;
  summary_result: string;
  summary_actions: string;
  summary_sets: string;
  summary_players: string;
  summary_mvp: string;
  summary_mvp_desc: string;
  summary_team_totals: string;
  summary_export: string;
  summary_download_pdf: string;
  summary_download_csv: string;
  summary_end_match: string;
  summary_end_match_confirm: string;
  credits: string;
  // New keys for features
  settings_advanced_mode: string;
  settings_advanced_mode_desc: string;
  starters: string;
  starters_bench: string;
  favorites: string;
  live_stats: string;
  export_whatsapp: string;
  export_datavolley: string;
  copied: string;
  swipe_right_positive: string;
  swipe_left_negative: string;
  select_starters: string;
  rotation: string;
  liberos: string;
  select_liberos: string;
  timeout: string;
  timeouts_home: string;
  timeouts_away: string;
  substitutions: string;
  sub_in: string;
  sub_out: string;
  no_subs: string;
  heatmap: string;
  heatmap_desc: string;
  player_in: string;
  player_out: string;
  confirm_sub: string;
  // Auth
  auth_sign_in: string;
  auth_sign_out: string;
  auth_sign_in_google: string;
  auth_sign_in_anonymous: string;
  auth_signed_in_as: string;
  auth_guest: string;
  auth_synced: string;
  auth_local_only: string;
  // Report translations
  report_title: string;
  report_match_info: string;
  report_team_stats: string;
  report_player_stats: string;
  report_summary: string;
  report_mvp: string;
  report_total_actions: string;
  report_efficiency: string;
  report_positivity: string;
  report_success_rate: string;
  report_error_rate: string;
  report_net_efficiency: string;
};

const it: TranslationKeys = {
  app_title: 'VOLLEYBALL SCOUT',
  app_subtitle: 'Statistiche Pallavolo',
  nav_home: 'Home',
  nav_scout: 'Scout',
  nav_stats: 'Stats',
  nav_roster: 'Rosa',
  nav_report: 'Report',
  nav_matches: 'Partite',
  create: 'Crea',
  save: 'Salva',
  cancel: 'Annulla',
  delete: 'Elimina',
  edit: 'Modifica',
  add: 'Aggiungi',
  confirm: 'Conferma',
  undo: 'Annulla',
  export: 'Esporta',
  download: 'Scarica',
  close: 'Chiudi',
  home_new_match: 'Nuova Partita',
  home_teams: 'Squadre',
  home_team_home: 'Squadra Casa',
  home_team_away: 'Squadra Ospite',
  home_details: 'Dettagli',
  home_date: 'Data',
  home_location: 'Luogo',
  home_roster: 'Rosa',
  home_select_roster: 'Seleziona una rosa...',
  home_no_roster: 'Nessuna rosa disponibile. Vai nella sezione Rosa per crearne una.',
  home_start_match: 'Inizia Partita',
  home_match_in_progress: 'Partita in Corso',
  home_go_to_scout: 'Vai nella scheda Scout per registrare le azioni della partita.',
  scout_no_match: 'Nessuna Partita Avviata',
  scout_no_match_desc: 'Vai nella scheda Home per configurare e avviare una nuova partita.',
  scout_select_player: 'Seleziona un giocatore',
  scout_new_set: 'Nuovo Set',
  scout_set: 'Set',
  scout_point_home: 'PUNTO CASA',
  scout_point_away: 'PUNTO OSPITE',
  scout_no_actions: 'Nessuna azione registrata',
  scout_action_undone: 'Azione annullata',
  fund_attack: 'Attacco',
  fund_attack_short: 'ATT',
  fund_reception: 'Ricezione',
  fund_reception_short: 'RIC',
  fund_serve: 'Battuta',
  fund_serve_short: 'BAT',
  fund_block: 'Muro',
  fund_block_short: 'MUR',
  fund_defense: 'Difesa',
  fund_defense_short: 'DIF',
  quality_excellent: 'Eccellente',
  quality_positive: 'Positivo',
  quality_negative: 'Negativo',
  quality_error: 'Errore',
  role_setter: 'Palleggiatore',
  role_setter_short: 'PAL',
  role_opposite: 'Opposto',
  role_opposite_short: 'OPP',
  role_outside: 'Schiacciatore',
  role_outside_short: 'SCH',
  role_middle: 'Centrale',
  role_middle_short: 'CEN',
  role_libero: 'Libero',
  role_libero_short: 'LIB',
  roster_management: 'Gestione Rose',
  roster_management_desc: 'Crea e gestisci le tue squadre',
  roster_new_name: 'Nome nuova rosa...',
  roster_no_rosters: 'Nessuna rosa creata',
  roster_no_rosters_desc: 'Crea la tua prima squadra per iniziare',
  roster_add_player: 'Aggiungi Giocatore',
  roster_player_name: 'Nome',
  roster_player_number: 'N°',
  roster_players: 'giocatori',
  roster_delete_confirm: 'Eliminare questa rosa?',
  stats_title: 'Statistiche Giocatori',
  stats_no_match: 'Statistiche',
  stats_no_match_desc: 'Avvia una partita per visualizzare le statistiche in tempo reale.',
  stats_all: 'Tutti',
  stats_no_data: 'Nessun dato per questo fondamentale',
  stats_actions: 'azioni',
  stats_total: 'Tot',
  stats_efficiency: 'Eff%',
  stats_positivity: 'Pos%',
  summary_title: 'Riepilogo Partita',
  summary_no_match: 'Riepilogo',
  summary_no_match_desc: 'Avvia una partita per visualizzare il riepilogo e scaricare i report.',
  summary_result: 'Risultato',
  summary_actions: 'Azioni',
  summary_sets: 'Set',
  summary_players: 'Giocatori',
  summary_mvp: 'MVP della Partita',
  summary_mvp_desc: 'azioni eccellenti su',
  summary_team_totals: 'Totale Squadra',
  summary_export: 'Esportazione',
  summary_download_pdf: 'Scarica Report PDF',
  summary_download_csv: 'Esporta Dati CSV',
  summary_end_match: 'Termina Partita',
  summary_end_match_confirm: 'Sei sicuro di voler terminare la partita? I dati della partita corrente verranno cancellati.',
  credits: 'Progetto e idea di',
  settings_advanced_mode: 'Modalità Avanzata',
  settings_advanced_mode_desc: 'Abilita swipe gesture, coordinate posizione, rotazioni e export DataVolley',
  starters: 'Titolari',
  starters_bench: 'Panchina',
  favorites: 'Azioni Rapide',
  live_stats: 'Stats Live',
  export_whatsapp: 'Copia per WhatsApp',
  export_datavolley: 'Esporta DataVolley (.dvw)',
  copied: 'Copiato!',
  swipe_right_positive: 'Swipe → per ++',
  swipe_left_negative: 'Swipe ← per =',
  select_starters: 'Seleziona Titolari (6)',
  rotation: 'Rotazione',
  auth_sign_in: 'Accedi',
  auth_sign_out: 'Esci',
  auth_sign_in_google: 'Accedi con Google',
  auth_sign_in_anonymous: 'Continua come ospite',
  auth_signed_in_as: 'Connesso come',
  auth_guest: 'Ospite',
  auth_synced: 'Dati sincronizzati',
  auth_local_only: 'Solo dati locali',
  liberos: 'Liberi',
  select_liberos: 'Seleziona Liberi (max 2)',
  timeout: 'Timeout',
  timeouts_home: 'Timeout Casa',
  timeouts_away: 'Timeout Ospite',
  substitutions: 'Sostituzioni',
  sub_in: 'Entra',
  sub_out: 'Esce',
  no_subs: 'Nessuna sostituzione',
  heatmap: 'Mappa Campo',
  heatmap_desc: 'Tocca il campo per registrare la posizione',
  player_in: 'Giocatore che entra',
  player_out: 'Giocatore che esce',
  confirm_sub: 'Conferma Cambio',
  // Game management
  games_title: 'Partite Salvate',
  games_no_games: 'Nessuna partita salvata',
  games_no_games_desc: 'Inizia una nuova partita per salvarla',
  games_new_game: 'Nuova Partita',
  games_load: 'Carica',
  games_delete: 'Elimina',
  games_delete_confirm: 'Sei sicuro di voler eliminare questa partita?',
  games_current: 'Corrente',
  // Wizard steps
  wizard_step: 'Passo',
  wizard_step_teams: 'Squadre',
  wizard_step_details: 'Dettagli',
  wizard_step_roster: 'Rosa',
  wizard_step_starters: 'Titolari',
  wizard_step_liberos: 'Liberi',
  wizard_step_ready: 'Pronto',
  wizard_next: 'Avanti',
  wizard_back: 'Indietro',
  wizard_finish: 'Fine',
  // Report translations
  report_title: 'Rapporto Partita',
  report_match_info: 'Informazioni Partita',
  report_team_stats: 'Statistiche Squadra',
  report_player_stats: 'Statistiche Giocatore',
  report_summary: 'Riepilogo',
  report_mvp: 'MVP',
  report_total_actions: 'Azioni Totali',
  report_efficiency: 'Efficienza',
  report_positivity: 'Positività',
  report_success_rate: 'Tasso Riuscita',
  report_error_rate: 'Tasso Errori',
  report_net_efficiency: 'Efficienza Netta',
};

const en: TranslationKeys = {
  app_title: 'VOLLEYBALL SCOUT',
  app_subtitle: 'Volleyball Statistics',
  nav_home: 'Home',
  nav_scout: 'Scout',
  nav_stats: 'Stats',
  nav_roster: 'Roster',
  nav_report: 'Report',
  nav_matches: 'Matches',
  create: 'Create',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  confirm: 'Confirm',
  undo: 'Undo',
  export: 'Export',
  download: 'Download',
  close: 'Close',
  home_new_match: 'New Match',
  home_teams: 'Teams',
  home_team_home: 'Home Team',
  home_team_away: 'Away Team',
  home_details: 'Details',
  home_date: 'Date',
  home_location: 'Location',
  home_roster: 'Roster',
  home_select_roster: 'Select a roster...',
  home_no_roster: 'No roster available. Go to the Roster section to create one.',
  home_start_match: 'Start Match',
  home_match_in_progress: 'Match in Progress',
  home_go_to_scout: 'Go to the Scout tab to record match actions.',
  scout_no_match: 'No Match Started',
  scout_no_match_desc: 'Go to the Home tab to configure and start a new match.',
  scout_select_player: 'Select a player',
  scout_new_set: 'New Set',
  scout_set: 'Set',
  scout_point_home: 'HOME POINT',
  scout_point_away: 'AWAY POINT',
  scout_no_actions: 'No actions recorded',
  scout_action_undone: 'Action undone',
  fund_attack: 'Attack',
  fund_attack_short: 'ATK',
  fund_reception: 'Reception',
  fund_reception_short: 'REC',
  fund_serve: 'Serve',
  fund_serve_short: 'SRV',
  fund_block: 'Block',
  fund_block_short: 'BLK',
  fund_defense: 'Defense',
  fund_defense_short: 'DEF',
  quality_excellent: 'Excellent',
  quality_positive: 'Positive',
  quality_negative: 'Negative',
  quality_error: 'Error',
  role_setter: 'Setter',
  role_setter_short: 'SET',
  role_opposite: 'Opposite',
  role_opposite_short: 'OPP',
  role_outside: 'Outside Hitter',
  role_outside_short: 'OH',
  role_middle: 'Middle Blocker',
  role_middle_short: 'MB',
  role_libero: 'Libero',
  role_libero_short: 'LIB',
  roster_management: 'Roster Management',
  roster_management_desc: 'Create and manage your teams',
  roster_new_name: 'New roster name...',
  roster_no_rosters: 'No rosters created',
  roster_no_rosters_desc: 'Create your first team to get started',
  roster_add_player: 'Add Player',
  roster_player_name: 'Name',
  roster_player_number: 'No.',
  roster_players: 'players',
  roster_delete_confirm: 'Delete this roster?',
  stats_title: 'Player Statistics',
  stats_no_match: 'Statistics',
  stats_no_match_desc: 'Start a match to view real-time statistics.',
  stats_all: 'All',
  stats_no_data: 'No data for this fundamental',
  stats_actions: 'actions',
  stats_total: 'Tot',
  stats_efficiency: 'Eff%',
  stats_positivity: 'Pos%',
  summary_title: 'Match Summary',
  summary_no_match: 'Summary',
  summary_no_match_desc: 'Start a match to view the summary and download reports.',
  summary_result: 'Result',
  summary_actions: 'Actions',
  summary_sets: 'Sets',
  summary_players: 'Players',
  summary_mvp: 'Match MVP',
  summary_mvp_desc: 'excellent actions out of',
  summary_team_totals: 'Team Totals',
  summary_export: 'Export',
  summary_download_pdf: 'Download PDF Report',
  summary_download_csv: 'Export CSV Data',
  summary_end_match: 'End Match',
  summary_end_match_confirm: 'Are you sure you want to end the match? Current match data will be deleted.',
  credits: 'Project and idea by',
  settings_advanced_mode: 'Advanced Mode',
  settings_advanced_mode_desc: 'Enable swipe gestures, position coordinates, rotations and DataVolley export',
  starters: 'Starters',
  starters_bench: 'Bench',
  favorites: 'Quick Actions',
  live_stats: 'Live Stats',
  export_whatsapp: 'Copy for WhatsApp',
  export_datavolley: 'Export DataVolley (.dvw)',
  copied: 'Copied!',
  swipe_right_positive: 'Swipe → for ++',
  swipe_left_negative: 'Swipe ← for =',
  select_starters: 'Select Starters (6)',
  rotation: 'Rotation',
  auth_sign_in: 'Sign In',
  auth_sign_out: 'Sign Out',
  auth_sign_in_google: 'Sign in with Google',
  auth_sign_in_anonymous: 'Continue as guest',
  auth_signed_in_as: 'Signed in as',
  auth_guest: 'Guest',
  auth_synced: 'Data synced',
  auth_local_only: 'Local data only',
  liberos: 'Liberos',
  select_liberos: 'Select Liberos (max 2)',
  timeout: 'Timeout',
  timeouts_home: 'Home Timeouts',
  timeouts_away: 'Away Timeouts',
  substitutions: 'Substitutions',
  sub_in: 'In',
  sub_out: 'Out',
  no_subs: 'No substitutions',
  heatmap: 'Court Map',
  heatmap_desc: 'Tap the court to record position',
  player_in: 'Player entering',
  player_out: 'Player leaving',
  confirm_sub: 'Confirm Sub',
  // Game management
  games_title: 'Saved Games',
  games_no_games: 'No saved games',
  games_no_games_desc: 'Start a new match to save it',
  games_new_game: 'New Game',
  games_load: 'Load',
  games_delete: 'Delete',
  games_delete_confirm: 'Are you sure you want to delete this game?',
  games_current: 'Current',
  // Wizard steps
  wizard_step: 'Step',
  wizard_step_teams: 'Teams',
  wizard_step_details: 'Details',
  wizard_step_roster: 'Roster',
  wizard_step_starters: 'Starters',
  wizard_step_liberos: 'Liberos',
  wizard_step_ready: 'Ready',
  wizard_next: 'Next',
  wizard_back: 'Back',
  wizard_finish: 'Finish',
  // Report translations
  report_title: 'Match Report',
  report_match_info: 'Match Information',
  report_team_stats: 'Team Statistics',
  report_player_stats: 'Player Statistics',
  report_summary: 'Summary',
  report_mvp: 'MVP',
  report_total_actions: 'Total Actions',
  report_efficiency: 'Efficiency',
  report_positivity: 'Positivity',
  report_success_rate: 'Success Rate',
  report_error_rate: 'Error Rate',
  report_net_efficiency: 'Net Efficiency',
};

const es: TranslationKeys = {
  ...en,
  nav_home: 'Inicio',
  nav_roster: 'Plantilla',
  nav_report: 'Informe',
  nav_matches: 'Partidos',
  create: 'Crear',
  save: 'Guardar',
  cancel: 'Cancelar',
  delete: 'Eliminar',
  settings_advanced_mode: 'Modo Avanzado',
  settings_advanced_mode_desc: 'Habilitar gestos swipe, coordenadas, rotaciones y exportación DataVolley',
  starters: 'Titulares',
  starters_bench: 'Banquillo',
  favorites: 'Acciones Rápidas',
  live_stats: 'Stats en Vivo',
  export_whatsapp: 'Copiar para WhatsApp',
  export_datavolley: 'Exportar DataVolley (.dvw)',
  copied: '¡Copiado!',
  swipe_right_positive: 'Swipe → para ++',
  swipe_left_negative: 'Swipe ← para =',
  select_starters: 'Seleccionar Titulares (6)',
  rotation: 'Rotación',
  liberos: 'Líberos',
  select_liberos: 'Seleccionar Líberos (máx 2)',
  timeout: 'Tiempo muerto',
  timeouts_home: 'Tiempos Casa',
  timeouts_away: 'Tiempos Visitante',
  substitutions: 'Sustituciones',
  sub_in: 'Entra',
  sub_out: 'Sale',
  no_subs: 'Sin sustituciones',
  heatmap: 'Mapa de Campo',
  heatmap_desc: 'Toca el campo para registrar posición',
  player_in: 'Jugador que entra',
  player_out: 'Jugador que sale',
  confirm_sub: 'Confirmar Cambio',
};

const fr: TranslationKeys = {
  ...en,
  nav_home: 'Accueil',
  nav_roster: 'Effectif',
  nav_report: 'Rapport',
  nav_matches: 'Matchs',
  settings_advanced_mode: 'Mode Avancé',
  settings_advanced_mode_desc: 'Activer les gestes swipe, coordonnées, rotations et export DataVolley',
  starters: 'Titulaires',
  starters_bench: 'Banc',
  favorites: 'Actions Rapides',
  live_stats: 'Stats en Direct',
  export_whatsapp: 'Copier pour WhatsApp',
  export_datavolley: 'Exporter DataVolley (.dvw)',
  copied: 'Copié !',
  swipe_right_positive: 'Swipe → pour ++',
  swipe_left_negative: 'Swipe ← pour =',
  select_starters: 'Sélectionner Titulaires (6)',
  rotation: 'Rotation',
  liberos: 'Libéros',
  select_liberos: 'Sélectionner Libéros (max 2)',
  timeout: 'Temps mort',
  timeouts_home: 'Temps morts Domicile',
  timeouts_away: 'Temps morts Extérieur',
  substitutions: 'Remplacements',
  sub_in: 'Entre',
  sub_out: 'Sort',
  no_subs: 'Aucun remplacement',
  heatmap: 'Carte du terrain',
  heatmap_desc: 'Touchez le terrain pour enregistrer la position',
  player_in: 'Joueur entrant',
  player_out: 'Joueur sortant',
  confirm_sub: 'Confirmer Remplacement',
};

const de: TranslationKeys = {
  ...en,
  nav_home: 'Start',
  nav_roster: 'Kader',
  nav_report: 'Bericht',
  nav_matches: 'Spiele',
  settings_advanced_mode: 'Erweiterter Modus',
  settings_advanced_mode_desc: 'Swipe-Gesten, Positionskoordinaten, Rotationen und DataVolley-Export aktivieren',
  starters: 'Stammformation',
  starters_bench: 'Bank',
  favorites: 'Schnellaktionen',
  live_stats: 'Live-Statistik',
  export_whatsapp: 'Für WhatsApp kopieren',
  export_datavolley: 'DataVolley exportieren (.dvw)',
  copied: 'Kopiert!',
  swipe_right_positive: 'Swipe → für ++',
  swipe_left_negative: 'Swipe ← für =',
  select_starters: 'Stammformation wählen (6)',
  rotation: 'Rotation',
  liberos: 'Liberos',
  select_liberos: 'Liberos wählen (max 2)',
  timeout: 'Auszeit',
  timeouts_home: 'Auszeiten Heim',
  timeouts_away: 'Auszeiten Gast',
  substitutions: 'Auswechslungen',
  sub_in: 'Ein',
  sub_out: 'Aus',
  no_subs: 'Keine Auswechslungen',
  heatmap: 'Spielfeldkarte',
  heatmap_desc: 'Tippen Sie auf das Feld, um die Position zu erfassen',
  player_in: 'Einwechselspieler',
  player_out: 'Auswechselspieler',
  confirm_sub: 'Wechsel bestätigen',
};

const pt: TranslationKeys = {
  ...en,
  nav_home: 'Início',
  nav_roster: 'Elenco',
  nav_report: 'Relatório',
  nav_matches: 'Partidas',
  settings_advanced_mode: 'Modo Avançado',
  settings_advanced_mode_desc: 'Ativar gestos swipe, coordenadas, rotações e exportação DataVolley',
  starters: 'Titulares',
  starters_bench: 'Banco',
  favorites: 'Ações Rápidas',
  live_stats: 'Stats ao Vivo',
  export_whatsapp: 'Copiar para WhatsApp',
  export_datavolley: 'Exportar DataVolley (.dvw)',
  copied: 'Copiado!',
  swipe_right_positive: 'Swipe → para ++',
  swipe_left_negative: 'Swipe ← para =',
  select_starters: 'Selecionar Titulares (6)',
  rotation: 'Rotação',
  liberos: 'Líberos',
  select_liberos: 'Selecionar Líberos (máx 2)',
  timeout: 'Tempo técnico',
  timeouts_home: 'Tempos Casa',
  timeouts_away: 'Tempos Visitante',
  substitutions: 'Substituições',
  sub_in: 'Entra',
  sub_out: 'Sai',
  no_subs: 'Sem substituições',
  heatmap: 'Mapa do Campo',
  heatmap_desc: 'Toque no campo para registrar posição',
  player_in: 'Jogador que entra',
  player_out: 'Jogador que sai',
  confirm_sub: 'Confirmar Troca',
};

export const translations: Record<Language, TranslationKeys> = { it, en, es, fr, de, pt };

export function getTranslation(lang: Language): TranslationKeys {
  return translations[lang] || translations.it;
}
