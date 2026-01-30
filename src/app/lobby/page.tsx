'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  loadPreferences,
  updatePreferences,
  getConfiguredProviders,
  migrateFromLegacyConfig,
} from '@/lib/storage';
import {
  getAvailableModels,
  getProviderForModel,
  getDefaultModel,
  GroupedModels,
} from '@/lib/providers';
import { AIProvider } from '@/types/game';

const MAX_INSTRUCTIONS_LENGTH = 500;
const WARNING_THRESHOLD = 450;

function SettingsGearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Get initial state from localStorage (client-side only)
function getInitialLobbyState(): {
  providers: AIProvider[];
  models: GroupedModels[];
  initialModel: string;
  customInstructions: string;
} {
  if (typeof window === 'undefined') {
    return { providers: [], models: [], initialModel: '', customInstructions: '' };
  }

  migrateFromLegacyConfig();
  const providers = getConfiguredProviders();
  const models = getAvailableModels(providers);
  const prefs = loadPreferences();

  let initialModel = prefs.lastUsedModel;
  if (initialModel) {
    const provider = getProviderForModel(initialModel);
    if (!provider || !providers.includes(provider)) {
      initialModel = providers.length > 0 ? getDefaultModel(providers[0]) : '';
    }
  } else if (providers.length > 0) {
    initialModel = getDefaultModel(providers[0]);
  }

  return {
    providers,
    models,
    initialModel,
    customInstructions: prefs.customInstructions || '',
  };
}

export default function LobbyPage() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Use lazy initialization to read from localStorage on client
  const [lobbyState] = useState(getInitialLobbyState);
  const [selectedModel, setSelectedModel] = useState(() => lobbyState.initialModel);
  const [customInstructions, setCustomInstructions] = useState(() => lobbyState.customInstructions);

  const configuredProviders = lobbyState.providers;
  const availableModels = lobbyState.models;

  // Redirect to settings if no API keys configured (only on client)
  useEffect(() => {
    if (!hasRedirected.current && configuredProviders.length === 0) {
      hasRedirected.current = true;
      router.replace('/settings');
    }
  }, [configuredProviders.length, router]);

  const handleStartGame = () => {
    const provider = getProviderForModel(selectedModel);
    if (!provider) return;

    updatePreferences({
      lastUsedModel: selectedModel,
      customInstructions: customInstructions.trim(),
    });

    router.push('/play');
  };

  const instructionsLength = customInstructions.length;
  const isOverLimit = instructionsLength > MAX_INSTRUCTIONS_LENGTH;
  const isNearLimit = instructionsLength >= WARNING_THRESHOLD;

  // Show loading state during SSR or when no providers configured (before redirect)
  if (configuredProviders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Link href="/" className="text-lg font-bold">
          <span className="text-accent">README</span> Game
        </Link>
        <Link
          href="/settings"
          className="text-muted hover:text-foreground transition-colors p-2"
          title="Settings"
        >
          <SettingsGearIcon />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* Rules section */}
        <div className="w-full bg-card rounded-lg p-8 text-left space-y-6 mb-8">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-accent font-mono">{'//'} How it works</h2>
            <p className="text-foreground leading-relaxed">
              You&apos;re writing documentation for a secret concept. Your AI has to understand what you mean.
            </p>
          </div>

          <div className="space-y-4 font-mono text-sm">
            <div className="flex items-start gap-3">
              <span className="text-accent">1.</span>
              <span>You get a secret word with forbidden words you can&apos;t use</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent">2.</span>
              <span>Write a description (like a README explaining it)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent">3.</span>
              <span>Your AI guesses what the concept is</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent">4.</span>
              <span>Race to get as many correct in 3 minutes</span>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="w-full space-y-6">
          {/* Model selection */}
          <div className="space-y-2">
            <label htmlFor="model" className="block text-sm font-medium">
              AI Model
            </label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-card border border-muted/30 rounded-lg px-4 py-3 text-sm focus:border-accent"
            >
              {availableModels.map((group) => (
                <optgroup key={group.provider.id} label={group.provider.name}>
                  {group.models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - {m.description}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="text-muted text-xs">
              {configuredProviders.length === 1
                ? 'Add more API keys in settings to unlock more models.'
                : `${configuredProviders.length} providers configured.`}
            </p>
          </div>

          {/* Custom instructions */}
          <div className="space-y-2">
            <label htmlFor="instructions" className="block text-sm font-medium">
              Custom Instructions <span className="text-muted">(optional)</span>
            </label>
            <textarea
              id="instructions"
              value={customInstructions}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_INSTRUCTIONS_LENGTH + 50) {
                  setCustomInstructions(value);
                }
              }}
              placeholder="Add context about how you communicate, your style, or hints for your AI partner..."
              rows={4}
              className={`w-full bg-card border rounded-lg px-4 py-3 text-sm resize-none ${
                isOverLimit
                  ? 'border-wrong focus:border-wrong'
                  : 'border-muted/30 focus:border-accent'
              }`}
            />
            <div className="flex justify-between items-center">
              <p className="text-muted text-xs">
                These instructions are sent to your AI before each round.
              </p>
              <span
                className={`text-xs font-mono ${
                  isOverLimit
                    ? 'text-wrong'
                    : isNearLimit
                    ? 'text-accent'
                    : 'text-muted'
                }`}
              >
                {instructionsLength} / {MAX_INSTRUCTIONS_LENGTH}
              </span>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartGame}
            disabled={isOverLimit}
            className="w-full bg-accent text-background font-semibold px-6 py-4 rounded-lg text-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Game
          </button>
        </div>
      </main>
    </div>
  );
}
