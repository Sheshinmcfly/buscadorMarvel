import { Character } from '../models/character';

export interface StatDef {
  key: string;
  label: string;
  icon: string;
}

export const STATS: StatDef[] = [
  { key: 'intelligence', label: 'Inteligencia', icon: 'bi-brain' },
  { key: 'strength',     label: 'Fuerza',        icon: 'bi-lightning-charge-fill' },
  { key: 'speed',        label: 'Velocidad',      icon: 'bi-wind' },
  { key: 'durability',   label: 'Durabilidad',    icon: 'bi-shield-fill' },
  { key: 'power',        label: 'Poder',          icon: 'bi-stars' },
  { key: 'combat',       label: 'Combate',        icon: 'bi-crosshair' },
];

export function statVal(char: Character, key: string): number {
  return (char.powerstats as unknown as Record<string, number>)[key] ?? 0;
}

const ALIGNMENT_LABELS: Record<string, string> = {
  good:    'Héroe',
  bad:     'Villano',
  neutral: 'Neutral',
};

const ALIGNMENT_CLASSES: Record<string, string> = {
  good:    'bg-success',
  bad:     'bg-danger',
  neutral: 'bg-secondary',
};

export function alignmentLabel(alignment: string): string {
  return ALIGNMENT_LABELS[alignment] ?? alignment;
}

export function alignmentClass(alignment: string): string {
  return ALIGNMENT_CLASSES[alignment] ?? 'bg-secondary';
}

export function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
