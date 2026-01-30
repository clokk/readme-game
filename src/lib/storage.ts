import { GameConfig, AIProvider, APIKeyStore, UserPreferences } from '@/types/game';
import { getDefaultModel, PROVIDERS } from '@/lib/providers';

// Storage keys
const API_KEYS_KEY = 'readme-game-api-keys';
const PREFERENCES_KEY = 'readme-game-preferences';
const LEGACY_CONFIG_KEY = 'readme-game-config';

// --- Migration ---

interface LegacyConfig {
  apiKey: string;
  customInstructions: string;
  provider: AIProvider;
  model: string;
}

export function migrateFromLegacyConfig(): boolean {
  if (typeof window === 'undefined') return false;

  const legacy = localStorage.getItem(LEGACY_CONFIG_KEY);
  if (!legacy) return false;

  try {
    const config = JSON.parse(legacy) as LegacyConfig;

    // Migrate API key to new store
    if (config.apiKey && config.provider) {
      const keys = loadAPIKeys();
      keys[config.provider] = config.apiKey;
      saveAPIKeys(keys);
    }

    // Migrate preferences
    const prefs: UserPreferences = {
      lastUsedModel: config.model || getDefaultModel(config.provider || 'google'),
      customInstructions: config.customInstructions || '',
    };
    savePreferences(prefs);

    // Remove legacy config
    localStorage.removeItem(LEGACY_CONFIG_KEY);

    return true;
  } catch {
    return false;
  }
}

// --- API Keys ---

export function saveAPIKeys(keys: APIKeyStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
}

export function loadAPIKeys(): APIKeyStore {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(API_KEYS_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored) as APIKeyStore;
  } catch {
    return {};
  }
}

export function setAPIKey(provider: AIProvider, key: string): void {
  const keys = loadAPIKeys();
  keys[provider] = key;
  saveAPIKeys(keys);
}

export function removeAPIKey(provider: AIProvider): void {
  const keys = loadAPIKeys();
  delete keys[provider];
  saveAPIKeys(keys);
}

export function getAPIKey(provider: AIProvider): string | undefined {
  const keys = loadAPIKeys();
  return keys[provider];
}

export function getConfiguredProviders(): AIProvider[] {
  const keys = loadAPIKeys();
  return PROVIDERS
    .map(p => p.id)
    .filter(id => !!keys[id]);
}

export function hasAnyAPIKey(): boolean {
  return getConfiguredProviders().length > 0;
}

// --- Preferences ---

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return { lastUsedModel: '', customInstructions: '' };
  }
  const stored = localStorage.getItem(PREFERENCES_KEY);
  if (!stored) {
    return { lastUsedModel: '', customInstructions: '' };
  }
  try {
    return JSON.parse(stored) as UserPreferences;
  } catch {
    return { lastUsedModel: '', customInstructions: '' };
  }
}

export function updatePreferences(updates: Partial<UserPreferences>): void {
  const current = loadPreferences();
  savePreferences({ ...current, ...updates });
}

// --- Game Config (runtime) ---

export function buildGameConfig(model: string, provider: AIProvider): GameConfig | null {
  const apiKey = getAPIKey(provider);
  if (!apiKey) return null;

  const prefs = loadPreferences();

  return {
    apiKey,
    customInstructions: prefs.customInstructions,
    provider,
    model,
  };
}

// --- Legacy support (for play page until updated) ---

export function loadConfig(): GameConfig | null {
  if (typeof window === 'undefined') return null;

  // Try migration first
  migrateFromLegacyConfig();

  const prefs = loadPreferences();
  const configuredProviders = getConfiguredProviders();

  if (configuredProviders.length === 0) return null;

  // Find the provider for the last used model
  let provider: AIProvider = configuredProviders[0];
  let model = prefs.lastUsedModel;

  if (model) {
    // Find which provider this model belongs to
    for (const p of PROVIDERS) {
      if (p.models.some(m => m.id === model)) {
        if (configuredProviders.includes(p.id)) {
          provider = p.id;
        } else {
          // Provider no longer configured, use default
          model = getDefaultModel(configuredProviders[0]);
          provider = configuredProviders[0];
        }
        break;
      }
    }
  } else {
    // No last used model, pick first available provider's default
    model = getDefaultModel(provider);
  }

  const apiKey = getAPIKey(provider);
  if (!apiKey) return null;

  return {
    apiKey,
    customInstructions: prefs.customInstructions,
    provider,
    model,
  };
}

export function saveConfig(config: GameConfig): void {
  // Save to new schema
  setAPIKey(config.provider, config.apiKey);
  savePreferences({
    lastUsedModel: config.model,
    customInstructions: config.customInstructions,
  });
}

export function clearConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(API_KEYS_KEY);
  localStorage.removeItem(PREFERENCES_KEY);
}
