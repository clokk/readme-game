'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { hasAnyAPIKey, migrateFromLegacyConfig } from '@/lib/storage';

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

// Use useSyncExternalStore to safely read localStorage on client
function useHasAPIKeys() {
  return useSyncExternalStore(
    () => () => {}, // No subscription needed - just initial read
    () => {
      migrateFromLegacyConfig();
      return hasAnyAPIKey();
    },
    () => false // Server snapshot - assume no keys
  );
}

export default function Home() {
  const hasKeys = useHasAPIKeys();
  const startHref = hasKeys ? '/lobby' : '/settings';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Settings gear icon in top right */}
      <Link
        href="/settings"
        className="absolute top-8 right-8 text-muted hover:text-foreground transition-colors p-2"
        title="Settings"
      >
        <SettingsGearIcon />
      </Link>

      <main className="max-w-2xl w-full space-y-12 text-center">
        {/* Logo / Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="text-accent">README</span> Game
          </h1>
          <p className="text-xl text-muted">
            Human + AI Party Game
          </p>
        </div>

        {/* Game explanation */}
        <div className="bg-card rounded-lg p-8 text-left space-y-6">
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

          <div className="pt-4 border-t border-muted/30">
            <p className="text-muted text-sm">
              Can you document clearly enough for AI to understand?
            </p>
          </div>
        </div>

        {/* Scoring info */}
        <div className="grid grid-cols-3 gap-4 text-center font-mono text-sm">
          <div className="bg-card rounded-lg p-4">
            <div className="text-2xl font-bold text-correct">100</div>
            <div className="text-muted">1st guess</div>
          </div>
          <div className="bg-card rounded-lg p-4">
            <div className="text-2xl font-bold text-accent">75</div>
            <div className="text-muted">2nd guess</div>
          </div>
          <div className="bg-card rounded-lg p-4">
            <div className="text-2xl font-bold text-wrong">50</div>
            <div className="text-muted">3rd guess</div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={startHref}
          className="inline-block bg-accent text-background font-semibold px-8 py-4 rounded-lg text-lg hover:bg-accent/90 transition-colors"
        >
          Start Playing
        </Link>

        {/* Footer note */}
        <p className="text-muted text-sm">
          Bring your own AI - connect your API key to play
        </p>
      </main>
    </div>
  );
}
