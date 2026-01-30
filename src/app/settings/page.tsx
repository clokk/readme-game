'use client';

import { useState, useSyncExternalStore, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadAPIKeys, setAPIKey, removeAPIKey, migrateFromLegacyConfig } from '@/lib/storage';
import { PROVIDERS, ProviderInfo } from '@/lib/providers';
import { AIProvider, APIKeyStore } from '@/types/game';

function maskKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return key.slice(0, 8) + '••••••••••••';
}

function ProviderCard({
  provider,
  apiKey,
  onSave,
  onRemove,
}: {
  provider: ProviderInfo;
  apiKey: string | undefined;
  onSave: (key: string) => void;
  onRemove: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const isConfigured = !!apiKey;

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('API key is required');
      return;
    }
    if (!trimmed.startsWith(provider.keyPrefix)) {
      setError(`Key should start with ${provider.keyPrefix}`);
      return;
    }
    onSave(trimmed);
    setIsAdding(false);
    setInputValue('');
    setError('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setInputValue('');
    setError('');
  };

  return (
    <div className="bg-card rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{provider.name}</h3>
          {isConfigured ? (
            <span className="text-xs px-2 py-0.5 rounded bg-correct/20 text-correct">
              Configured
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded bg-muted/20 text-muted">
              Not configured
            </span>
          )}
        </div>
        <a
          href={provider.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent text-sm hover:underline"
        >
          Get API key
        </a>
      </div>

      {isConfigured && !isAdding && (
        <div className="flex items-center justify-between">
          <code className="text-sm text-muted bg-background px-3 py-2 rounded">
            {showKey ? apiKey : maskKey(apiKey!)}
          </code>
          <div className="flex gap-2">
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-sm text-muted hover:text-foreground"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={onRemove}
              className="text-sm text-wrong hover:text-wrong/80"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {!isConfigured && !isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2 px-4 border border-dashed border-muted/50 rounded-lg text-muted hover:border-accent hover:text-accent transition-colors"
        >
          + Add API Key
        </button>
      )}

      {isAdding && (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              placeholder={provider.keyPlaceholder}
              className="w-full bg-background border border-muted/30 rounded-lg px-4 py-3 font-mono text-sm focus:border-accent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          </div>
          {error && (
            <p className="text-wrong text-sm">{error}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-accent text-background font-medium py-2 px-4 rounded-lg hover:bg-accent/90"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="text-muted text-xs space-y-1">
          <p className="font-medium">How to get a key:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            {provider.helpSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// Use useSyncExternalStore to safely read localStorage on client
function useAPIKeys() {
  // We need a way to trigger re-render when keys change
  const [, forceUpdate] = useState(0);

  const subscribe = useCallback((callback: () => void) => {
    // Listen for storage events (from other tabs)
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    migrateFromLegacyConfig();
    return JSON.stringify(loadAPIKeys());
  }, []);

  const getServerSnapshot = useCallback(() => '{}', []);

  const keysJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const keys = JSON.parse(keysJson) as APIKeyStore;

  const triggerUpdate = useCallback(() => forceUpdate(n => n + 1), []);

  return { keys, triggerUpdate };
}

export default function SettingsPage() {
  const router = useRouter();
  const { keys: apiKeys, triggerUpdate } = useAPIKeys();

  const handleSaveKey = (provider: AIProvider, key: string) => {
    setAPIKey(provider, key);
    triggerUpdate();
  };

  const handleRemoveKey = (provider: AIProvider) => {
    removeAPIKey(provider);
    triggerUpdate();
  };

  const configuredCount = Object.values(apiKeys).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-xl w-full space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="text-muted hover:text-foreground text-sm"
          >
            &larr; Back
          </button>
          <h1 className="text-3xl font-bold">
            <span className="text-accent">API</span> Settings
          </h1>
          <p className="text-muted">
            Configure your AI provider keys
          </p>
        </div>

        {/* Provider Cards */}
        <div className="space-y-4">
          {PROVIDERS.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              apiKey={apiKeys[provider.id]}
              onSave={(key) => handleSaveKey(provider.id, key)}
              onRemove={() => handleRemoveKey(provider.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-muted text-sm">
            Your API keys are stored locally in your browser and never sent to our servers.
          </p>
          {configuredCount > 0 && (
            <Link
              href="/lobby"
              className="inline-block bg-accent text-background font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Continue to Lobby
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
