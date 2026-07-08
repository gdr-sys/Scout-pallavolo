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
  // App
  app_title: string;
  app_subtitle: string;
  
  // Navigation
  nav_home: string;
  nav_scout: string;
  nav_stats: string;
  nav_roster: string;
  nav_report: string;
  
  // Common actions
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
  
  // Home page
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
  
  // Scout page
  scout_no_match: string;
  scout_no_match_desc: string;
  scout_select_player: string;
  scout_new_set: string;
  scout_set: string;
  scout_point_home: string;
  scout_point_away: string;
  scout_no_actions: string;
  scout_action_undone: string;
  
  // Fundamentals
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
  
  // Quality
  quality_excellent: string;
  quality_positive: string;
  quality_negative: string;
  quality_error: string;
  
  // Roles
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
  
  // Roster page
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
  
  // Stats page
  stats_title: string;
  stats_no_match: string;
  stats_no_match_desc: string;
  stats_all: string;
  stats_no_data: string;
  stats_actions: string;
  stats_total: string;
  stats_efficiency: string;
  stats_positivity: string;
  
  // Summary page
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
  
  // Auth
  auth_sign_in: string;
  auth_sign_out: string;
  auth_sign_in_google: string;
  auth_sign_in_anonymous: string;
  auth_signed_in_as: string;
  auth_guest: string;
  auth_synced: string;
  auth_local_only: string;
  
  // Credits
  credits: string;
};

const it: TranslationKeys = {
  app_title: 'VOLLEYBALL SCOUT',
  app_subtitle: 'Statistiche Pallavolo',
  
  nav_home: 'Home',
  nav_scout: 'Scout',
  nav_stats: 'Stats',
  nav_roster: 'Rosa',
  nav_report: 'Report',
  
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
  
  auth_sign_in: 'Accedi',
  auth_sign_out: 'Esci',
  auth_sign_in_google: 'Accedi con Google',
  auth_sign_in_anonymous: 'Continua come ospite',
  auth_signed_in_as: 'Connesso come',
  auth_guest: 'Ospite',
  auth_synced: 'Dati sincronizzati',
  auth_local_only: 'Solo dati locali',
  
  credits: 'Progetto e idea di',
};

const en: TranslationKeys = {
  app_title: 'VOLLEYBALL SCOUT',
  app_subtitle: 'Volleyball Statistics',
  
  nav_home: 'Home',
  nav_scout: 'Scout',
  nav_stats: 'Stats',
  nav_roster: 'Roster',
  nav_report: 'Report',
  
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
  
  auth_sign_in: 'Sign In',
  auth_sign_out: 'Sign Out',
  auth_sign_in_google: 'Sign in with Google',
  auth_sign_in_anonymous: 'Continue as guest',
  auth_signed_in_as: 'Signed in as',
  auth_guest: 'Guest',
  auth_synced: 'Data synced',
  auth_local_only: 'Local data only',
  
  credits: 'Project and idea by',
};

const es: TranslationKeys = {
  app_title: 'VOLLEYBALL SCOUT',
  app_subtitle: 'Estadísticas de Voleibol',
  
  nav_home: 'Inicio',
  nav_scout: 'Scout',
  nav_stats: 'Stats',
  nav_roster: 'Plantilla',
  nav_report: 'Informe',
  
  create: 'Crear',
  save: 'Guardar',
  cancel: 'Cancelar',
  delete: 'Eliminar',
  edit: 'Editar',
  add: 'Añadir',
  confirm: 'Confirmar',
  undo: 'Deshacer',
  export: 'Exportar',
  download: 'Descargar',
  close: 'Cerrar',
  
  home_new_match: 'Nuevo Partido',
  home_teams: 'Equipos',
  home_team_home: 'Equipo Local',
  home_team_away: 'Equipo Visitante',
  home_details: 'Detalles',
  home_date: 'Fecha',
  home_location: 'Lugar',
  home_roster: 'Plantilla',
  home_select_roster: 'Selecciona una plantilla...',
  home_no_roster: 'No hay plantillas disponibles. Ve a la sección Plantilla para crear una.',
  home_start_match: 'Iniciar Partido',
  home_match_in_progress: 'Partido en Curso',
  home_go_to_scout: 'Ve a la pestaña Scout para registrar las acciones del partido.',
  
  scout_no_match: 'Ningún Partido Iniciado',
  scout_no_match_desc: 'Ve a la pestaña Inicio para configurar e iniciar un nuevo partido.',
  scout_select_player: 'Selecciona un jugador',
  scout_new_set: 'Nuevo Set',
  scout_set: 'Set',
  scout_point_home: 'PUNTO LOCAL',
  scout_point_away: 'PUNTO VISITANTE',
  scout_no_actions: 'Sin acciones registradas',
  scout_action_undone: 'Acción deshecha',
  
  fund_attack: 'Ataque',
  fund_attack_short: 'ATQ',
  fund_reception: 'Recepción',
  fund_reception_short: 'REC',
  fund_serve: 'Saque',
  fund_serve_short: 'SAQ',
  fund_block: 'Bloqueo',
  fund_block_short: 'BLQ',
  fund_defense: 'Defensa',
  fund_defense_short: 'DEF',
  
  quality_excellent: 'Excelente',
  quality_positive: 'Positivo',
  quality_negative: 'Negativo',
  quality_error: 'Error',
  
  role_setter: 'Colocador',
  role_setter_short: 'COL',
  role_opposite: 'Opuesto',
  role_opposite_short: 'OPU',
  role_outside: 'Receptor',
  role_outside_short: 'REC',
  role_middle: 'Central',
  role_middle_short: 'CEN',
  role_libero: 'Líbero',
  role_libero_short: 'LIB',
  
  roster_management: 'Gestión de Plantillas',
  roster_management_desc: 'Crea y gestiona tus equipos',
  roster_new_name: 'Nombre de nueva plantilla...',
  roster_no_rosters: 'No hay plantillas creadas',
  roster_no_rosters_desc: 'Crea tu primer equipo para empezar',
  roster_add_player: 'Añadir Jugador',
  roster_player_name: 'Nombre',
  roster_player_number: 'N°',
  roster_players: 'jugadores',
  roster_delete_confirm: '¿Eliminar esta plantilla?',
  
  stats_title: 'Estadísticas de Jugadores',
  stats_no_match: 'Estadísticas',
  stats_no_match_desc: 'Inicia un partido para ver las estadísticas en tiempo real.',
  stats_all: 'Todos',
  stats_no_data: 'Sin datos para este fundamento',
  stats_actions: 'acciones',
  stats_total: 'Tot',
  stats_efficiency: 'Efe%',
  stats_positivity: 'Pos%',
  
  summary_title: 'Resumen del Partido',
  summary_no_match: 'Resumen',
  summary_no_match_desc: 'Inicia un partido para ver el resumen y descargar informes.',
  summary_result: 'Resultado',
  summary_actions: 'Acciones',
  summary_sets: 'Sets',
  summary_players: 'Jugadores',
  summary_mvp: 'MVP del Partido',
  summary_mvp_desc: 'acciones excelentes de',
  summary_team_totals: 'Totales del Equipo',
  summary_export: 'Exportación',
  summary_download_pdf: 'Descargar Informe PDF',
  summary_download_csv: 'Exportar Datos CSV',
  summary_end_match: 'Finalizar Partido',
  summary_end_match_confirm: '¿Estás seguro de que quieres finalizar el partido? Los datos del partido actual serán eliminados.',
  
  auth_sign_in: 'Iniciar sesión',
  auth_sign_out: 'Cerrar sesión',
  auth_sign_in_google: 'Iniciar sesión con Google',
  auth_sign_in_anonymous: 'Continuar como invitado',
  auth_signed_in_as: 'Conectado como',
  auth_guest: 'Invitado',
  auth_synced: 'Datos sincronizados',
  auth_local_only: 'Solo datos locales',
  
  credits: 'Proyecto e idea de',
};

const fr: TranslationKeys = {
  app_title: 'VOLLEYBALL SCOUT',
  app_subtitle: 'Statistiques Volleyball',
  
  nav_home: 'Accueil',
  nav_scout: 'Scout',
  nav_stats: 'Stats',
  nav_roster: 'Effectif',
  nav_report: 'Rapport',
  
  create: 'Créer',
  save: 'Enregistrer',
  cancel: 'Annuler',
  delete: 'Supprimer',
  edit: 'Modifier',
  add: 'Ajouter',
  confirm: 'Confirmer',
  undo: 'Annuler',
  export: 'Exporter',
  download: 'Télécharger',
  close: 'Fermer',
  
  home_new_match: 'Nouveau Match',
  home_teams: 'Équipes',
  home_team_home: 'Équipe Domicile',
  home_team_away: 'Équipe Extérieur',
  home_details: 'Détails',
  home_date: 'Date',
  home_location: 'Lieu',
  home_roster: 'Effectif',
  home_select_roster: 'Sélectionner un effectif...',
  home_no_roster: 'Aucun effectif disponible. Allez dans la section Effectif pour en créer un.',
  home_start_match: 'Démarrer Match',
  home_match_in_progress: 'Match en Cours',
  home_go_to_scout: 'Allez dans l\'onglet Scout pour enregistrer les actions du match.',
  
  scout_no_match: 'Aucun Match Démarré',
  scout_no_match_desc: 'Allez dans l\'onglet Accueil pour configurer et démarrer un nouveau match.',
  scout_select_player: 'Sélectionnez un joueur',
  scout_new_set: 'Nouveau Set',
  scout_set: 'Set',
  scout_point_home: 'POINT DOMICILE',
  scout_point_away: 'POINT EXTÉRIEUR',
  scout_no_actions: 'Aucune action enregistrée',
  scout_action_undone: 'Action annulée',
  
  fund_attack: 'Attaque',
  fund_attack_short: 'ATT',
  fund_reception: 'Réception',
  fund_reception_short: 'REC',
  fund_serve: 'Service',
  fund_serve_short: 'SRV',
  fund_block: 'Bloc',
  fund_block_short: 'BLC',
  fund_defense: 'Défense',
  fund_defense_short: 'DEF',
  
  quality_excellent: 'Excellent',
  quality_positive: 'Positif',
  quality_negative: 'Négatif',
  quality_error: 'Erreur',
  
  role_setter: 'Passeur',
  role_setter_short: 'PAS',
  role_opposite: 'Opposé',
  role_opposite_short: 'OPP',
  role_outside: 'Attaquant',
  role_outside_short: 'ATT',
  role_middle: 'Central',
  role_middle_short: 'CEN',
  role_libero: 'Libéro',
  role_libero_short: 'LIB',
  
  roster_management: 'Gestion des Effectifs',
  roster_management_desc: 'Créez et gérez vos équipes',
  roster_new_name: 'Nom du nouvel effectif...',
  roster_no_rosters: 'Aucun effectif créé',
  roster_no_rosters_desc: 'Créez votre première équipe pour commencer',
  roster_add_player: 'Ajouter Joueur',
  roster_player_name: 'Nom',
  roster_player_number: 'N°',
  roster_players: 'joueurs',
  roster_delete_confirm: 'Supprimer cet effectif ?',
  
  stats_title: 'Statistiques des Joueurs',
  stats_no_match: 'Statistiques',
  stats_no_match_desc: 'Démarrez un match pour voir les statistiques en temps réel.',
  stats_all: 'Tous',
  stats_no_data: 'Aucune donnée pour ce fondamental',
  stats_actions: 'actions',
  stats_total: 'Tot',
  stats_efficiency: 'Eff%',
  stats_positivity: 'Pos%',
  
  summary_title: 'Résumé du Match',
  summary_no_match: 'Résumé',
  summary_no_match_desc: 'Démarrez un match pour voir le résumé et télécharger les rapports.',
  summary_result: 'Résultat',
  summary_actions: 'Actions',
  summary_sets: 'Sets',
  summary_players: 'Joueurs',
  summary_mvp: 'MVP du Match',
  summary_mvp_desc: 'actions excellentes sur',
  summary_team_totals: 'Totaux Équipe',
  summary_export: 'Exportation',
  summary_download_pdf: 'Télécharger Rapport PDF',
  summary_download_csv: 'Exporter Données CSV',
  summary_end_match: 'Terminer Match',
  summary_end_match_confirm: 'Êtes-vous sûr de vouloir terminer le match ? Les données du match actuel seront supprimées.',
  
  auth_sign_in: 'Connexion',
  auth_sign_out: 'Déconnexion',
  auth_sign_in_google: 'Se connecter avec Google',
  auth_sign_in_anonymous: 'Continuer en tant qu\'invité',
  auth_signed_in_as: 'Connecté en tant que',
  auth_guest: 'Invité',
  auth_synced: 'Données synchronisées',
  auth_local_only: 'Données locales uniquement',
  
  credits: 'Projet et idée de',
};

const de: TranslationKeys = {
  app_title: 'VOLLEYBALL SCOUT',
  app_subtitle: 'Volleyball Statistiken',
  
  nav_home: 'Start',
  nav_scout: 'Scout',
  nav_stats: 'Stats',
  nav_roster: 'Kader',
  nav_report: 'Bericht',
  
  create: 'Erstellen',
  save: 'Speichern',
  cancel: 'Abbrechen',
  delete: 'Löschen',
  edit: 'Bearbeiten',
  add: 'Hinzufügen',
  confirm: 'Bestätigen',
  undo: 'Rückgängig',
  export: 'Exportieren',
  download: 'Herunterladen',
  close: 'Schließen',
  
  home_new_match: 'Neues Spiel',
  home_teams: 'Mannschaften',
  home_team_home: 'Heimmannschaft',
  home_team_away: 'Gastmannschaft',
  home_details: 'Details',
  home_date: 'Datum',
  home_location: 'Ort',
  home_roster: 'Kader',
  home_select_roster: 'Kader auswählen...',
  home_no_roster: 'Kein Kader verfügbar. Gehen Sie zum Bereich Kader, um einen zu erstellen.',
  home_start_match: 'Spiel Starten',
  home_match_in_progress: 'Spiel Läuft',
  home_go_to_scout: 'Gehen Sie zur Registerkarte Scout, um Spielaktionen aufzuzeichnen.',
  
  scout_no_match: 'Kein Spiel Gestartet',
  scout_no_match_desc: 'Gehen Sie zur Registerkarte Start, um ein neues Spiel zu konfigurieren und zu starten.',
  scout_select_player: 'Spieler auswählen',
  scout_new_set: 'Neuer Satz',
  scout_set: 'Satz',
  scout_point_home: 'PUNKT HEIM',
  scout_point_away: 'PUNKT GAST',
  scout_no_actions: 'Keine Aktionen aufgezeichnet',
  scout_action_undone: 'Aktion rückgängig gemacht',
  
  fund_attack: 'Angriff',
  fund_attack_short: 'ANG',
  fund_reception: 'Annahme',
  fund_reception_short: 'ANN',
  fund_serve: 'Aufschlag',
  fund_serve_short: 'AUF',
  fund_block: 'Block',
  fund_block_short: 'BLK',
  fund_defense: 'Abwehr',
  fund_defense_short: 'ABW',
  
  quality_excellent: 'Ausgezeichnet',
  quality_positive: 'Positiv',
  quality_negative: 'Negativ',
  quality_error: 'Fehler',
  
  role_setter: 'Zuspieler',
  role_setter_short: 'ZUS',
  role_opposite: 'Diagonal',
  role_opposite_short: 'DIA',
  role_outside: 'Außenangreifer',
  role_outside_short: 'AA',
  role_middle: 'Mittelblocker',
  role_middle_short: 'MB',
  role_libero: 'Libero',
  role_libero_short: 'LIB',
  
  roster_management: 'Kaderverwaltung',
  roster_management_desc: 'Erstellen und verwalten Sie Ihre Teams',
  roster_new_name: 'Name des neuen Kaders...',
  roster_no_rosters: 'Keine Kader erstellt',
  roster_no_rosters_desc: 'Erstellen Sie Ihr erstes Team, um zu beginnen',
  roster_add_player: 'Spieler Hinzufügen',
  roster_player_name: 'Name',
  roster_player_number: 'Nr.',
  roster_players: 'Spieler',
  roster_delete_confirm: 'Diesen Kader löschen?',
  
  stats_title: 'Spielerstatistiken',
  stats_no_match: 'Statistiken',
  stats_no_match_desc: 'Starten Sie ein Spiel, um Echtzeit-Statistiken zu sehen.',
  stats_all: 'Alle',
  stats_no_data: 'Keine Daten für dieses Grundelement',
  stats_actions: 'Aktionen',
  stats_total: 'Ges',
  stats_efficiency: 'Eff%',
  stats_positivity: 'Pos%',
  
  summary_title: 'Spielzusammenfassung',
  summary_no_match: 'Zusammenfassung',
  summary_no_match_desc: 'Starten Sie ein Spiel, um die Zusammenfassung anzuzeigen und Berichte herunterzuladen.',
  summary_result: 'Ergebnis',
  summary_actions: 'Aktionen',
  summary_sets: 'Sätze',
  summary_players: 'Spieler',
  summary_mvp: 'Spiel-MVP',
  summary_mvp_desc: 'ausgezeichnete Aktionen von',
  summary_team_totals: 'Team-Summen',
  summary_export: 'Export',
  summary_download_pdf: 'PDF-Bericht Herunterladen',
  summary_download_csv: 'CSV-Daten Exportieren',
  summary_end_match: 'Spiel Beenden',
  summary_end_match_confirm: 'Sind Sie sicher, dass Sie das Spiel beenden möchten? Die aktuellen Spieldaten werden gelöscht.',
  
  auth_sign_in: 'Anmelden',
  auth_sign_out: 'Abmelden',
  auth_sign_in_google: 'Mit Google anmelden',
  auth_sign_in_anonymous: 'Als Gast fortfahren',
  auth_signed_in_as: 'Angemeldet als',
  auth_guest: 'Gast',
  auth_synced: 'Daten synchronisiert',
  auth_local_only: 'Nur lokale Daten',
  
  credits: 'Projekt und Idee von',
};

const pt: TranslationKeys = {
  app_title: 'VOLLEYBALL SCOUT',
  app_subtitle: 'Estatísticas de Voleibol',
  
  nav_home: 'Início',
  nav_scout: 'Scout',
  nav_stats: 'Stats',
  nav_roster: 'Elenco',
  nav_report: 'Relatório',
  
  create: 'Criar',
  save: 'Salvar',
  cancel: 'Cancelar',
  delete: 'Excluir',
  edit: 'Editar',
  add: 'Adicionar',
  confirm: 'Confirmar',
  undo: 'Desfazer',
  export: 'Exportar',
  download: 'Baixar',
  close: 'Fechar',
  
  home_new_match: 'Nova Partida',
  home_teams: 'Equipes',
  home_team_home: 'Equipe da Casa',
  home_team_away: 'Equipe Visitante',
  home_details: 'Detalhes',
  home_date: 'Data',
  home_location: 'Local',
  home_roster: 'Elenco',
  home_select_roster: 'Selecione um elenco...',
  home_no_roster: 'Nenhum elenco disponível. Vá para a seção Elenco para criar um.',
  home_start_match: 'Iniciar Partida',
  home_match_in_progress: 'Partida em Andamento',
  home_go_to_scout: 'Vá para a aba Scout para registrar as ações da partida.',
  
  scout_no_match: 'Nenhuma Partida Iniciada',
  scout_no_match_desc: 'Vá para a aba Início para configurar e iniciar uma nova partida.',
  scout_select_player: 'Selecione um jogador',
  scout_new_set: 'Novo Set',
  scout_set: 'Set',
  scout_point_home: 'PONTO CASA',
  scout_point_away: 'PONTO VISITANTE',
  scout_no_actions: 'Nenhuma ação registrada',
  scout_action_undone: 'Ação desfeita',
  
  fund_attack: 'Ataque',
  fund_attack_short: 'ATQ',
  fund_reception: 'Recepção',
  fund_reception_short: 'REC',
  fund_serve: 'Saque',
  fund_serve_short: 'SAQ',
  fund_block: 'Bloqueio',
  fund_block_short: 'BLQ',
  fund_defense: 'Defesa',
  fund_defense_short: 'DEF',
  
  quality_excellent: 'Excelente',
  quality_positive: 'Positivo',
  quality_negative: 'Negativo',
  quality_error: 'Erro',
  
  role_setter: 'Levantador',
  role_setter_short: 'LEV',
  role_opposite: 'Oposto',
  role_opposite_short: 'OPO',
  role_outside: 'Ponteiro',
  role_outside_short: 'PON',
  role_middle: 'Central',
  role_middle_short: 'CEN',
  role_libero: 'Líbero',
  role_libero_short: 'LIB',
  
  roster_management: 'Gestão de Elenco',
  roster_management_desc: 'Crie e gerencie suas equipes',
  roster_new_name: 'Nome do novo elenco...',
  roster_no_rosters: 'Nenhum elenco criado',
  roster_no_rosters_desc: 'Crie sua primeira equipe para começar',
  roster_add_player: 'Adicionar Jogador',
  roster_player_name: 'Nome',
  roster_player_number: 'N°',
  roster_players: 'jogadores',
  roster_delete_confirm: 'Excluir este elenco?',
  
  stats_title: 'Estatísticas dos Jogadores',
  stats_no_match: 'Estatísticas',
  stats_no_match_desc: 'Inicie uma partida para ver as estatísticas em tempo real.',
  stats_all: 'Todos',
  stats_no_data: 'Sem dados para este fundamento',
  stats_actions: 'ações',
  stats_total: 'Tot',
  stats_efficiency: 'Efe%',
  stats_positivity: 'Pos%',
  
  summary_title: 'Resumo da Partida',
  summary_no_match: 'Resumo',
  summary_no_match_desc: 'Inicie uma partida para ver o resumo e baixar relatórios.',
  summary_result: 'Resultado',
  summary_actions: 'Ações',
  summary_sets: 'Sets',
  summary_players: 'Jogadores',
  summary_mvp: 'MVP da Partida',
  summary_mvp_desc: 'ações excelentes de',
  summary_team_totals: 'Totais da Equipe',
  summary_export: 'Exportação',
  summary_download_pdf: 'Baixar Relatório PDF',
  summary_download_csv: 'Exportar Dados CSV',
  summary_end_match: 'Encerrar Partida',
  summary_end_match_confirm: 'Tem certeza de que deseja encerrar a partida? Os dados da partida atual serão excluídos.',
  
  auth_sign_in: 'Entrar',
  auth_sign_out: 'Sair',
  auth_sign_in_google: 'Entrar com Google',
  auth_sign_in_anonymous: 'Continuar como convidado',
  auth_signed_in_as: 'Conectado como',
  auth_guest: 'Convidado',
  auth_synced: 'Dados sincronizados',
  auth_local_only: 'Apenas dados locais',
  
  credits: 'Projeto e ideia de',
};

export const translations: Record<Language, TranslationKeys> = {
  it,
  en,
  es,
  fr,
  de,
  pt,
};

export function getTranslation(lang: Language): TranslationKeys {
  return translations[lang] || translations.it;
}
