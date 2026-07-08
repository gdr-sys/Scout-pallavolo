import { useState } from 'react';
import { Roster, Player, PlayerRole } from '../types';
import { generateId } from '../store';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { Plus, Trash2, Users, Edit3, Check, X, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';

interface Props {
  rosters: Roster[];
  onSave: (rosters: Roster[]) => void;
}

export default function RosterPage({ rosters, onSave }: Props) {
  const { t } = useI18n();
  
  // Localized roles
  const ROLES: { value: PlayerRole; label: string; short: string; color: string }[] = [
    { value: 'Palleggiatore', label: t.role_setter, short: t.role_setter_short, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { value: 'Opposto', label: t.role_opposite, short: t.role_opposite_short, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { value: 'Schiacciatore', label: t.role_outside, short: t.role_outside_short, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { value: 'Centrale', label: t.role_middle, short: t.role_middle_short, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { value: 'Libero', label: t.role_libero, short: t.role_libero_short, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  ];

  const getRoleInfo = (role: PlayerRole) => ROLES.find(r => r.value === role) || ROLES[2];

  const [editingRoster, setEditingRoster] = useState<Roster | null>(null);
  const [newRosterName, setNewRosterName] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New player form
  const [pName, setPName] = useState('');
  const [pNumber, setPNumber] = useState('');
  const [pRole, setPRole] = useState<PlayerRole>('Schiacciatore');

  const createRoster = () => {
    if (!newRosterName.trim()) return;
    const r: Roster = {
      id: generateId(),
      name: newRosterName.trim(),
      players: [],
      createdAt: Date.now(),
    };
    onSave([...rosters, r]);
    setNewRosterName('');
    setExpandedId(r.id);
  };

  const deleteRoster = (id: string) => {
    if (confirm(t.roster_delete_confirm)) {
      onSave(rosters.filter((r) => r.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const addPlayer = (rosterId: string) => {
    if (!pName.trim() || !pNumber) return;
    const updated = rosters.map((r) => {
      if (r.id !== rosterId) return r;
      const p: Player = {
        id: generateId(),
        name: pName.trim(),
        number: parseInt(pNumber),
        role: pRole,
      };
      return { ...r, players: [...r.players, p] };
    });
    onSave(updated);
    setPName('');
    setPNumber('');
  };

  const removePlayer = (rosterId: string, playerId: string) => {
    const updated = rosters.map((r) => {
      if (r.id !== rosterId) return r;
      return { ...r, players: r.players.filter((p) => p.id !== playerId) };
    });
    onSave(updated);
  };

  const startEditing = (roster: Roster) => {
    setEditingRoster({ ...roster });
  };

  const saveEditing = () => {
    if (!editingRoster) return;
    const updated = rosters.map((r) =>
      r.id === editingRoster.id ? { ...r, name: editingRoster.name } : r
    );
    onSave(updated);
    setEditingRoster(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-navy-600/50 flex items-center justify-center">
            <Users size={20} className="text-gold-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t.roster_management}</h2>
            <p className="text-xs text-muted">{t.roster_management_desc}</p>
          </div>
        </div>

        {/* New roster form */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder={t.roster_new_name}
            value={newRosterName}
            onChange={(e) => setNewRosterName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createRoster()}
            className="flex-1 min-w-0 bg-surface-700 border border-surface-500 rounded-xl px-4 py-3 text-sm text-white placeholder-muted-dark focus:border-navy-600 focus:ring-1 focus:ring-navy-600 outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => createRoster()}
            disabled={!newRosterName.trim()}
            className={cn(
              "px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all flex-shrink-0",
              newRosterName.trim()
                ? "bg-navy-600 hover:bg-navy-500 text-white active:scale-95"
                : "bg-surface-600 text-muted-dark cursor-not-allowed"
            )}
          >
            <Plus size={18} />
            {t.create}
          </button>
        </div>

        {/* Roster list */}
        {rosters.length === 0 && (
          <div className="text-center py-12 text-muted-dark">
            <Users size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">{t.roster_no_rosters}</p>
            <p className="text-xs mt-1">{t.roster_no_rosters_desc}</p>
          </div>
        )}

        <div className="space-y-3">
          {rosters.map((roster) => {
            const isExpanded = expandedId === roster.id;
            return (
              <div
                key={roster.id}
                className="bg-surface-800 border border-surface-600/50 rounded-2xl overflow-hidden animate-fade-in"
              >
                {/* Roster header */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-700/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : roster.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center text-gold-400 font-bold text-sm">
                    {roster.players.length}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingRoster?.id === roster.id ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingRoster.name}
                          onChange={(e) => setEditingRoster({ ...editingRoster, name: e.target.value })}
                          className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-1 text-sm text-white outline-none flex-1"
                          autoFocus
                        />
                        <button onClick={saveEditing} className="text-green-400 hover:text-green-300">
                          <Check size={18} />
                        </button>
                        <button onClick={() => setEditingRoster(null)} className="text-red-400 hover:text-red-300">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-bold text-white truncate">{roster.name}</h3>
                        <p className="text-[11px] text-muted-dark">{roster.players.length} {t.roster_players}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => startEditing(roster)}
                      className="p-2 rounded-lg hover:bg-surface-600/50 text-muted transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteRoster(roster.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-muted" />
                  ) : (
                    <ChevronDown size={16} className="text-muted" />
                  )}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-surface-600/30 animate-fade-in">
                    {/* Add player form */}
                    <div className="mt-3 mb-3 p-3 bg-surface-700/50 rounded-xl">
                      <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <UserPlus size={12} />
                        {t.roster_add_player}
                      </p>
                      <div className="grid grid-cols-[1fr_60px] gap-2 mb-2">
                        <input
                          type="text"
                          placeholder={t.roster_player_name}
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                          className="bg-surface-900/50 border border-surface-500 rounded-lg px-3 py-2 text-sm text-white placeholder-muted-dark outline-none focus:border-navy-600"
                        />
                        <input
                          type="number"
                          placeholder={t.roster_player_number}
                          value={pNumber}
                          onChange={(e) => setPNumber(e.target.value)}
                          className="bg-surface-900/50 border border-surface-500 rounded-lg px-3 py-2 text-sm text-white placeholder-muted-dark outline-none focus:border-navy-600 text-center"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={pRole}
                          onChange={(e) => setPRole(e.target.value as PlayerRole)}
                          className="flex-1 bg-surface-900/50 border border-surface-500 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-navy-600"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => addPlayer(roster.id)}
                          disabled={!pName.trim() || !pNumber}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1 flex-shrink-0",
                            pName.trim() && pNumber
                              ? "bg-navy-600 hover:bg-navy-500 text-white active:scale-95"
                              : "bg-surface-600 text-muted-dark cursor-not-allowed"
                          )}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Player list */}
                    <div className="space-y-1.5">
                      {roster.players
                        .sort((a, b) => a.number - b.number)
                        .map((player) => {
                          const roleInfo = getRoleInfo(player.role);
                          return (
                            <div
                              key={player.id}
                              className="flex items-center gap-2.5 px-3 py-2 bg-surface-700/30 rounded-xl group hover:bg-surface-700/60 transition-colors"
                            >
                              <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {player.number}
                              </span>
                              <span className="text-sm text-white font-medium flex-1 truncate">{player.name}</span>
                              <span className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-md border',
                                roleInfo.color
                              )}>
                                {roleInfo.short}
                              </span>
                              <button
                                onClick={() => removePlayer(roster.id, player.id)}
                                className="p-1 rounded-md text-red-400/40 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
