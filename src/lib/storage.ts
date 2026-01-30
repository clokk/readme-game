import { GameConfig } from '@/types/game';

const CONFIG_KEY = 'readme-game-config';

export function saveConfig(config: GameConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function loadConfig(): GameConfig | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CONFIG_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as GameConfig;
  } catch {
    return null;
  }
}

export function clearConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONFIG_KEY);
}
