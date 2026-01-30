'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadConfig, saveConfig } from '@/lib/storage';
import { GameConfig } from '@/types/game';
import { PROVIDERS, getProvider, getDefaultModel } from '@/lib/providers';

function getInitialConfig(): GameConfig {
  if (typeof window === 'undefined') {
    return { provider: 'google', apiKey: '', customInstructions: '', model: getDefaultModel('google') };
  }
  const stored = loadConfig();
  if (stored) {
    // Ensure model exists (migration for old configs)
    if (!stored.model) {
      stored.model = getDefaultModel(stored.provider);
    }
    return stored;
  }
  return { provider: 'google', apiKey: '', customInstructions: '', model: getDefaultModel('google') };
}

export default function SetupPage() {
  const router = useRouter();
  const [config, setConfig] = useState<GameConfig>(getInitialConfig);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const selectedProvider = getProvider(config.provider);

  const updateConfig = (updates: Partial<GameConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleProviderChange = (providerId: typeof config.provider) => {
    updateConfig({
      provider: providerId,
      model: getDefaultModel(providerId),
      apiKey: '', // Clear API key when changing provider
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!config.apiKey.trim()) {
      setError('API key is required');
      return;
    }

    if (!config.apiKey.startsWith(selectedProvider.keyPrefix)) {
      setError(`Please enter a valid ${selectedProvider.name} API key (starts with ${selectedProvider.keyPrefix})`);
      return;
    }

    saveConfig({
      apiKey: config.apiKey.trim(),
      customInstructions: config.customInstructions.trim(),
      provider: config.provider,
      model: config.model,
    });
    router.push('/play');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-xl w-full space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Link href="/" className="text-muted hover:text-foreground text-sm">
            &larr; Back
          </Link>
          <h1 className="text-3xl font-bold">
            <span className="text-accent">Setup</span> Your AI
          </h1>
          <p className="text-muted">
            Connect your API key to play
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              AI Provider
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProviderChange(p.id)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    config.provider === p.id
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-muted/30 bg-card text-muted hover:text-foreground'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            {config.provider === 'google' && (
              <p className="text-correct text-xs">
                Gemini Flash is fast and cheap - great for testing!
              </p>
            )}
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label htmlFor="model" className="block text-sm font-medium">
              Model
            </label>
            <select
              id="model"
              value={config.model}
              onChange={(e) => updateConfig({ model: e.target.value })}
              className="w-full bg-card border border-muted/30 rounded-lg px-4 py-3 text-sm focus:border-accent"
            >
              {selectedProvider.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.description}
                </option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <label htmlFor="apiKey" className="block text-sm font-medium">
              {selectedProvider.name} API Key <span className="text-wrong">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                id="apiKey"
                value={config.apiKey}
                onChange={(e) => updateConfig({ apiKey: e.target.value })}
                placeholder={selectedProvider.keyPlaceholder}
                className="w-full bg-card border border-muted/30 rounded-lg px-4 py-3 font-mono text-sm focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-sm"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-muted text-xs">
              Your key is stored locally and never sent to our servers
            </p>
          </div>

          {/* Custom Instructions */}
          <div className="space-y-2">
            <label htmlFor="instructions" className="block text-sm font-medium">
              Custom Instructions <span className="text-muted">(optional)</span>
            </label>
            <textarea
              id="instructions"
              value={config.customInstructions}
              onChange={(e) => updateConfig({ customInstructions: e.target.value })}
              placeholder="Add context about how you communicate, your style, or hints for your AI partner..."
              rows={4}
              className="w-full bg-card border border-muted/30 rounded-lg px-4 py-3 text-sm focus:border-accent resize-none"
            />
            <p className="text-muted text-xs">
              These instructions are sent to your AI before each round.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-wrong/10 border border-wrong/30 rounded-lg px-4 py-3 text-wrong text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-accent text-background font-semibold px-6 py-4 rounded-lg text-lg hover:bg-accent/90 transition-colors"
          >
            Start Game
          </button>
        </form>

        {/* Help */}
        <div className="bg-card rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-sm">Need a {selectedProvider.name} API key?</h3>
          <ol className="text-muted text-sm space-y-2">
            {selectedProvider.helpSteps.map((step, i) => (
              <li key={i}>
                {i + 1}. {i === 0 ? (
                  <>Go to <a href={selectedProvider.helpUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{selectedProvider.helpUrl.replace('https://', '')}</a></>
                ) : step}
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
