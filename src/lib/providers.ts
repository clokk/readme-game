import { AIProvider } from '@/types/game';

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
}

export interface ProviderInfo {
  id: AIProvider;
  name: string;
  keyPrefix: string;
  keyPlaceholder: string;
  helpUrl: string;
  helpSteps: string[];
  models: ModelInfo[];
  defaultModel: string;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'google',
    name: 'Google Gemini',
    keyPrefix: 'AIza',
    keyPlaceholder: 'AIza...',
    helpUrl: 'https://aistudio.google.com/apikey',
    helpSteps: [
      'Go to aistudio.google.com/apikey',
      'Sign in with your Google account',
      'Click "Create API Key"',
      'Copy and paste it here',
    ],
    models: [
      { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', description: 'Fastest & cheapest' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Fast & capable' },
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'Latest flash model' },
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', description: '💰 Pay to win' },
    ],
    defaultModel: 'gemini-2.0-flash-lite',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-...',
    helpUrl: 'https://platform.openai.com/api-keys',
    helpSteps: [
      'Go to platform.openai.com/api-keys',
      'Sign in with your OpenAI account',
      'Click "Create new secret key"',
      'Copy and paste it here',
    ],
    models: [
      { id: 'gpt-5-nano', name: 'GPT-5 Nano', description: 'Fastest & cheapest' },
      { id: 'gpt-5-mini', name: 'GPT-5 Mini', description: 'Fast & capable' },
      { id: 'o4-mini', name: 'o4-mini', description: 'Fast reasoning' },
      { id: 'gpt-5', name: 'GPT-5', description: '💰 Pay to win' },
    ],
    defaultModel: 'gpt-5-nano',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-...',
    helpUrl: 'https://console.anthropic.com',
    helpSteps: [
      'Go to console.anthropic.com',
      'Create an account or sign in',
      'Navigate to API Keys',
      'Create a new key and paste it here',
    ],
    models: [
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Fast & affordable' },
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'Balanced performance' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Previous generation' },
      { id: 'claude-opus-4-5-20251101', name: 'Claude Opus 4.5', description: '💰 Pay to win' },
    ],
    defaultModel: 'claude-3-5-haiku-20241022',
  },
];

export function getProvider(providerId: AIProvider): ProviderInfo {
  return PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0];
}

export function getDefaultModel(providerId: AIProvider): string {
  return getProvider(providerId).defaultModel;
}

export interface GroupedModels {
  provider: ProviderInfo;
  models: ModelInfo[];
}

export function getAvailableModels(configuredProviders: AIProvider[]): GroupedModels[] {
  return PROVIDERS
    .filter(p => configuredProviders.includes(p.id))
    .map(p => ({
      provider: p,
      models: p.models,
    }));
}

export function getProviderForModel(modelId: string): AIProvider | null {
  for (const provider of PROVIDERS) {
    if (provider.models.some(m => m.id === modelId)) {
      return provider.id;
    }
  }
  return null;
}
