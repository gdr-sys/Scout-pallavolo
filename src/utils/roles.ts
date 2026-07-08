import { PlayerRole } from '../types';
import { TranslationKeys } from '../i18n/translations';

export function getRoleName(role: PlayerRole, t: TranslationKeys): string {
  switch (role) {
    case 'Palleggiatore': return t.role_setter;
    case 'Opposto': return t.role_opposite;
    case 'Schiacciatore': return t.role_outside;
    case 'Centrale': return t.role_middle;
    case 'Libero': return t.role_libero;
    default: return role;
  }
}

export function getRoleShort(role: PlayerRole, t: TranslationKeys): string {
  switch (role) {
    case 'Palleggiatore': return t.role_setter_short;
    case 'Opposto': return t.role_opposite_short;
    case 'Schiacciatore': return t.role_outside_short;
    case 'Centrale': return t.role_middle_short;
    case 'Libero': return t.role_libero_short;
    default: return '?';
  }
}

export function getRoleColor(role: PlayerRole): { color: string; bg: string } {
  switch (role) {
    case 'Palleggiatore': return { color: 'text-blue-400', bg: 'bg-blue-500/10' };
    case 'Opposto': return { color: 'text-red-400', bg: 'bg-red-500/10' };
    case 'Schiacciatore': return { color: 'text-green-400', bg: 'bg-green-500/10' };
    case 'Centrale': return { color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    case 'Libero': return { color: 'text-purple-400', bg: 'bg-purple-500/10' };
    default: return { color: 'text-muted', bg: 'bg-surface-700' };
  }
}

/** All roles as internal keys — the display name comes from translations */
export const PLAYER_ROLES: PlayerRole[] = [
  'Palleggiatore', 'Opposto', 'Schiacciatore', 'Centrale', 'Libero'
];
