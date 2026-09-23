/**
 * Utility functions for color manipulation, hex parsing,
 * brightness calculation, and contrast adaptation for ID cards.
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = (hex || '').trim().replace(/^#/, '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num) || c.length !== 6) {
    return { r: 30, g: 58, b: 138 }; // Default navy fallback (#1e3a8a)
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test((hex || '').trim());
}

export function normalizeHex(hex: string): string {
  let c = (hex || '').trim();
  if (!c.startsWith('#')) {
    c = '#' + c;
  }
  return c;
}

export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  // ITU-R BT.709 relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance >= 165;
}

export function adjustHexBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface PresetColorOption {
  name: string;
  nameGu: string;
  hex: string;
}

export const PRESET_ACCENT_COLORS: PresetColorOption[] = [
  { name: 'Royal Navy', nameGu: 'શાહી નેવી બ્લુ', hex: '#1e3a8a' },
  { name: 'Crimson Maroon', nameGu: 'ક્લાસિક મરૂન', hex: '#881337' },
  { name: 'Emerald Forest', nameGu: 'હરિયાળું લીલું', hex: '#047857' },
  { name: 'Saffron Orange', nameGu: 'કેસરી નારંગી', hex: '#ea580c' },
  { name: 'Royal Purple', nameGu: 'શાહી જાંબલી', hex: '#6b21a8' },
  { name: 'Ocean Teal', nameGu: 'મોડર્ન ટીલ', hex: '#0f766e' },
  { name: 'Sapphire Blue', nameGu: 'આકાશી બ્લુ', hex: '#0284c7' },
  { name: 'Deep Ruby Red', nameGu: 'લાલ રૂબી', hex: '#b91c1c' },
  { name: 'Rich Amber', nameGu: 'સુવર્ણ અંબર', hex: '#b45309' },
  { name: 'Dark Indigo', nameGu: 'ડીપ ઇન્ડિગો', hex: '#312e81' },
  { name: 'Dark Slate', nameGu: 'સ્લેટ ગ્રે', hex: '#334155' },
  { name: 'Rose Plum', nameGu: 'ગુલાબી પ્લમ', hex: '#9d174d' },
];
