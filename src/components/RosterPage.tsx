import { useState } from 'react';
import { Roster, Player, PlayerRole } from '../types';
import { generateId } from '../store';
import { useI18n } from '../i18n/context';
import { cn } from '../utils/cn';
import { Users, Plus, Trash2, Edit3, Check, X, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';

interface Props {
  rosters: Roster[];
  onSave: (rosters: Roster[]) => void;
}

function getRoleInfo(role: PlayerRole) {
  switch (role) {
    case 'Palleggiatore': return { short: 'PAL', color: 'text-blue-400', bg: 'bg-blue-500/10' };
    case 'Opposto': return { short: 'OPP', color: 'text-red-400', bg: 'bg-red-500/10' };
    case 'Schiacciatore': return { short: 'SCH', color: 'text-green-400', bg: 'bg-green-500/10' };
    case 'Centrale': return { short: 'CEN', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    case 'Libero': return { short: 'LIB', color: 'text-purple-400', bg: 'bg-purple-500/10' };
    default: return { short: '?', color: 'text-muted', bg: 'bg-surface-700' };
  }
}

const ROLES: PlayerRole[] = ['Palleggiatore', 'Opposto', 'Schiacciatore', 'Centrale', 'Libero'];

export default function RosterPage({ rosters, onSave }: Props) {
  const { t } = useI18n();
  const [newRosterName, setNewRosterName] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingRoster, setEditingRoster] = useState<Roster | null>(null);
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

  const saveEditing = () => {
    if (!editingRoster) return;
    const updated = rosters.map((r) =>
      r.id === editingRoster.id ? { ...r, name: editingRoster.name } : r
    );
    onSave(updated);
    setEditingRoster(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
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
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRosterName}
            placeholder={t.roster_new_name}
            onChange={(e) => setNewRosterName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createRoster()}
            className="flex-1 min-w-0 bg-surface-700 border border-surface-500 rounded-xl px-4 py-3 text-sm text-white placeholder-muted-dark focus:border-navy-600 outline-none transition-all"
          />
          <button
            onClick={createRoster}
            disabled={!newRosterName.trim()}
            className="px-4 py-3 rounded-xl bg-navy-600 hover:bg-navy-500 text-white font-bold text-sm transition-colors disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Roster list */}
        {rosters.length === 0 && (
          <div className="text-center py-12">
            <Users size={40} className="mx-auto mb-3 text-muted-dark opacity-40" />
            <p className="text-white font-bold">{t.roster_no_rosters}</p>
            <p className="text-xs text-muted mt-1">{t.roster_no_rosters_desc}</p>
          </div>
        )}

        <div className="space-y-2">
          {rosters.map((roster) => {
            const isExpanded = expandedId === roster.id;
            return (
              <div key={roster.id} className="bg-surface-800 border border-surface-600/50 rounded-2xl overflow-hidden">
                {/* Roster header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : roster.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-700/30 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-navy-600/30 flex items-center justify-center text-xs font-extrabold text-gold-400">
                    {roster.players.length}
                  </span>
                  <div className="flex-1 text-left">
                    {editingRoster?.id === roster.id ? (
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          value={editingRoster.name}
                          onChange={(e) => setEditingRoster({ ...editingRoster, name: e.target.value })}
                          className="bg-surface-700 border border-surface-500 rounded-lg px-3 py-1 text-sm text-white outline-none flex-1"
                          autoFocus
                        />
                        <button onClick={saveEditing} className="text-green-400"><Check size={16} /></button>
                        <button onClick={() => setEditingRoster(null)} className="text-red-400"><X size={16} /></button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-white">{roster.name}</p>
                        <p className="text-[10px] text-muted">{roster.players.length} {t.roster_players}</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setEditingRoster({ ...roster })} className="w-7 h-7 rounded-lg bg-surface-700 hover:bg-surface-600 flex items-center justify-center">
                      <Edit3 size={12} className="text-muted" />
                    </button>
                    <button onClick={() => deleteRoster(roster.id)} className="w-7 h-7 rounded-lg bg-surface-700 hover:bg-red-500/20 flex items-center justify-center">
                      <Trash2 size={12} className="text-muted hover:text-red-400" />
                    </button>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-surface-600/50 animate-fade-in">
                    {/* Add player form */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gold-400/70">
                        <UserPlus size={12} />
                        {t.roster_add_player}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={pName}
                          placeholder={t.roster_player_name}
                          onChange={(e) => setPName(e.target.value)}
                          className="flex-1 bg-surface-900/50 border border-surface-500 rounded-lg px-3 py-2 text-sm text-white placeholder-muted-dark outline-none focus:border-navy-600"
                        />
                        <input
                          type="number"
                          value={pNumber}
                          placeholder={t.roster_player_number}
                          onChange={(e) => setPNumber(e.target.value)}
                          className="w-16 bg-surface-900/50 border border-surface-500 rounded-lg px-3 py-2 text-sm text-white placeholder-muted-dark outline-none focus:border-navy-600 text-center"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={pRole}
                          onChange={(e) => setPRole(e.target.value as PlayerRole)}
                          className="flex-1 bg-surface-900/50 border border-surface-500 rounded-lg px-3 py-2 text-sm text-white outline-none"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => addPlayer(roster.id)}
                          disabled={!pName.trim() || !pNumber}
                          className="px-4 py-2 rounded-lg bg-navy-600 hover:bg-navy-500 text-white font-bold text-sm transition-colors disabled:opacity-40"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Player list */}
                    <div className="mt-3 space-y-1">
                      {roster.players
                        .sort((a, b) => a.number - b.number)
                        .map((player) => {
                          const roleInfo = getRoleInfo(player.role);
                          return (
                            <div key={player.id} className="flex items-center gap-2 px-2 py-1.5 bg-surface-700/30 rounded-lg">
                              <span className="w-7 h-7 rounded-lg bg-gold-400/10 flex items-center justify-center text-xs font-extrabold text-gold-400">
                                {player.number}
                              </span>
                              <span className="text-sm text-white font-medium flex-1">{player.name}</span>
                              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", roleInfo.bg, roleInfo.color)}>
                                {roleInfo.short}
                              </span>
                              <button
                                onClick={() => removePlayer(roster.id, player.id)}
                                className="w-6 h-6 rounded-md hover:bg-red-500/20 flex items-center justify-center"
                              >
                                <Trash2 size={11} className="text-muted hover:text-red-400" />
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
