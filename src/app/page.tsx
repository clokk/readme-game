'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
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
          href="/setup"
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
