export interface PassportColorPreset {
  slug: string;
  label: string;
  gradient: string; // CSS gradient for the passport cover
  accent: string;   // hex accent for text/icons
  ring: string;     // tailwind ring color for selected state
}

export const PASSPORT_COLORS: PassportColorPreset[] = [
  {
    slug: 'indigo',
    label: 'Indigo Night',
    gradient: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#1e40af 100%)',
    accent: '#818cf8',
    ring: '#6366f1',
  },
  {
    slug: 'rose',
    label: 'Rose Gold',
    gradient: 'linear-gradient(135deg,#4c0519 0%,#9f1239 40%,#be185d 100%)',
    accent: '#fda4af',
    ring: '#f43f5e',
  },
  {
    slug: 'emerald',
    label: 'Emerald Isle',
    gradient: 'linear-gradient(135deg,#064e3b 0%,#065f46 40%,#0f766e 100%)',
    accent: '#6ee7b7',
    ring: '#10b981',
  },
  {
    slug: 'amber',
    label: 'Golden Hour',
    gradient: 'linear-gradient(135deg,#451a03 0%,#78350f 40%,#b45309 100%)',
    accent: '#fcd34d',
    ring: '#f59e0b',
  },
  {
    slug: 'sky',
    label: 'Sky High',
    gradient: 'linear-gradient(135deg,#0c4a6e 0%,#075985 40%,#0369a1 100%)',
    accent: '#7dd3fc',
    ring: '#0ea5e9',
  },
  {
    slug: 'violet',
    label: 'Ultra Violet',
    gradient: 'linear-gradient(135deg,#2e1065 0%,#4c1d95 40%,#6d28d9 100%)',
    accent: '#c4b5fd',
    ring: '#8b5cf6',
  },
];

export function getPassportColor(slug: string): PassportColorPreset {
  return PASSPORT_COLORS.find((c) => c.slug === slug) ?? PASSPORT_COLORS[0];
}
