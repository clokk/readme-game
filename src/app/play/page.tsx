'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadConfig } from '@/lib/storage';
import { shufflePrompts } from '@/data/prompts';
import { Prompt, GuessResult, RoundResult, GameConfig, Guess } from '@/types/game';

const GAME_DURATION = 180; // 3 minutes in seconds
const POINTS = [100, 75, 50]; // Points for 1st, 2nd, 3rd guess

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function normalizeWord(word: string): string {
  return word.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

function checkGuess(guess: string, target: string): boolean {
  const normalizedGuess = normalizeWord(guess);
  const normalizedTarget = normalizeWord(target);
  return normalizedGuess === normalizedTarget ||
         normalizedGuess.includes(normalizedTarget) ||
         normalizedTarget.includes(normalizedGuess);
}

export default function PlayPage() {
  const router = useRouter();
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentResult, setCurrentResult] = useState<GuessResult | null>(null);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [gameStatus, setGameStatus] = useState<'loading' | 'playing' | 'showing_result' | 'finished'>('loading');
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize game
  useEffect(() => {
    const savedConfig = loadConfig();
    if (!savedConfig) {
      router.push('/lobby');
      return;
    }
    setConfig(savedConfig);
    setPrompts(shufflePrompts());
    setGameStatus('playing');
  }, [router]);

  // Timer
  useEffect(() => {
    if (gameStatus !== 'playing' && gameStatus !== 'showing_result') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameStatus('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  // Focus input when ready for new prompt
  useEffect(() => {
    if (gameStatus === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStatus, currentPromptIndex]);

  const currentPrompt = prompts[currentPromptIndex];

  const checkForbiddenWords = useCallback((text: string): string[] => {
    if (!currentPrompt) return [];
    const normalizedText = text.toLowerCase();
    const violations: string[] = [];

    // Check forbidden words in text (substring matching)
    for (const word of currentPrompt.forbiddenWords) {
      if (normalizedText.includes(word.toLowerCase())) {
        violations.push(word);
      }
    }

    // Check if user used the secret word itself (word-boundary matching only)
    const secretWord = currentPrompt.word.toLowerCase();
    const secretWordRegex = new RegExp(`\\b${secretWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (secretWordRegex.test(text)) {
      violations.push(currentPrompt.word);
    }

    return [...new Set(violations)];
  }, [currentPrompt]);

  // Sound effect for correct answers - satisfying chord "ding"
  const playDing = useCallback(() => {
    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.25, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    // Play a major chord (root, major third, perfect fifth) for a pleasant sound
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.frequency.value = freq;
      osc.type = 'sine';
      // Stagger slightly for a richer sound
      oscGain.gain.setValueAtTime(0.4 - i * 0.1, ctx.currentTime);
      osc.start(ctx.currentTime + i * 0.02);
      osc.stop(ctx.currentTime + 0.5);
    });
  }, []);

  // Sound effect for next word - subtle "whoosh"
  const playWhoosh = useCallback(() => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, []);

  // Render text with forbidden words highlighted
  const renderHighlightedText = useCallback((text: string): React.ReactNode[] => {
    if (!currentPrompt || !text) return [text];

    // Build list of all forbidden words including the secret word
    const allForbidden = [currentPrompt.word.toLowerCase(), ...currentPrompt.forbiddenWords.map(w => w.toLowerCase())];

    // Create a regex that matches any forbidden word (case insensitive)
    const pattern = allForbidden
      .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');

    const parts = text.split(regex);
    return parts.map((part, i) => {
      const isMatch = allForbidden.includes(part.toLowerCase());
      if (isMatch) {
        return (
          <mark key={i} className="bg-wrong/50 text-transparent rounded">
            {part}
          </mark>
        );
      }
      return part;
    });
  }, [currentPrompt]);

  const handleSubmit = async () => {
    if (!config || !currentPrompt || isSubmitting) return;

    const forbiddenUsed = checkForbiddenWords(description);
    if (forbiddenUsed.length > 0) {
      setError(`You used forbidden words: ${forbiddenUsed.join(', ')}`);
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          apiKey: config.apiKey,
          customInstructions: config.customInstructions,
          provider: config.provider,
          model: config.model,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setIsSubmitting(false);
        return;
      }

      const guesses: Guess[] = data.guesses;
      let correctGuessIndex: number | null = null;
      let points = 0;

      for (let i = 0; i < guesses.length; i++) {
        if (checkGuess(guesses[i].word, currentPrompt.word)) {
          correctGuessIndex = i;
          points = POINTS[i];
          break;
        }
      }

      const result: GuessResult = {
        guesses,
        correctGuessIndex,
        points,
      };

      setCurrentResult(result);
      setScore((prev) => prev + points);
      setHistory((prev) => [...prev, { prompt: currentPrompt, description, guessResult: result }]);
      setGameStatus('showing_result');

      // Update streak and trigger score animation
      if (correctGuessIndex !== null) {
        setStreak((prev) => prev + 1);
        setLastPoints(points);
        setTimeout(() => setLastPoints(null), 800);
        playDing();
      } else {
        setStreak(0);
      }
    } catch {
      setError('Failed to get AI response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextPrompt = useCallback(() => {
    if (currentPromptIndex >= prompts.length - 1) {
      setGameStatus('finished');
      return;
    }
    playWhoosh();
    setCurrentPromptIndex((prev) => prev + 1);
    setDescription('');
    setCurrentResult(null);
    setError('');
    setGameStatus('playing');
  }, [currentPromptIndex, prompts.length, playWhoosh]);

  const handleSkip = useCallback(() => {
    if (!currentPrompt) return;
    setHistory((prev) => [...prev, {
      prompt: currentPrompt,
      description: '[Skipped]',
      guessResult: { guesses: [], correctGuessIndex: null, points: 0 }
    }]);
    setStreak(0);
    handleNextPrompt();
  }, [currentPrompt, handleNextPrompt]);

  const handleEndGame = useCallback(() => {
    setGameStatus('finished');
    setShowEndConfirm(false);
  }, []);

  // Global keyboard listener for shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+Enter for next word when showing result
      if (gameStatus === 'showing_result' && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleNextPrompt();
      }
      // Cmd/Ctrl+S for skip during playing
      if (gameStatus === 'playing' && (e.key === 's' || e.key === 'S') && (e.metaKey || e.ctrlKey) && !isSubmitting) {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [gameStatus, handleNextPrompt, handleSkip, isSubmitting]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (gameStatus === 'showing_result') {
        handleNextPrompt();
      } else if (!isSubmitting) {
        handleSubmit();
      }
    }
  };

  // Loading state
  if (gameStatus === 'loading' || !currentPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading game...</div>
      </div>
    );
  }

  // Game finished
  if (gameStatus === 'finished') {
    const correctCount = history.filter(h => h.guessResult.correctGuessIndex !== null).length;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <main className="max-w-xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Game Over!</h1>
            <div className="text-6xl font-bold text-accent">{score}</div>
            <p className="text-muted">points</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-6">
              <div className="text-3xl font-bold text-correct">{correctCount}</div>
              <div className="text-muted text-sm">correct</div>
            </div>
            <div className="bg-card rounded-lg p-6">
              <div className="text-3xl font-bold">{history.length}</div>
              <div className="text-muted text-sm">attempted</div>
            </div>
          </div>

          {/* History */}
          <div className="bg-card rounded-lg p-6 text-left space-y-4 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-sm text-muted">Round History</h3>
            {history.map((round, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b border-muted/20 pb-2">
                <span className="font-mono">{round.prompt.word}</span>
                <span className={round.guessResult.correctGuessIndex !== null ? 'text-correct' : 'text-wrong'}>
                  {round.guessResult.correctGuessIndex !== null
                    ? `+${round.guessResult.points}`
                    : round.description === '[Skipped]' ? 'Skipped' : 'Miss'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Link
              href="/play"
              onClick={() => window.location.reload()}
              className="flex-1 bg-accent text-background font-semibold px-6 py-4 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Play Again
            </Link>
            <Link
              href="/"
              className="flex-1 bg-card text-foreground font-semibold px-6 py-4 rounded-lg hover:bg-card/80 transition-colors"
            >
              Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const forbiddenInDescription = checkForbiddenWords(description);
  const timerUrgent = timeRemaining <= 30;
  const timerCritical = timeRemaining <= 10;

  return (
    <div className={`min-h-screen flex flex-col p-4 md:p-8 ${timerCritical ? 'timer-urgent' : ''}`}>
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Link href="/" className="text-lg font-bold">
          <span className="text-accent">README</span> Game
        </Link>
        <div className="flex items-center gap-4 font-mono">
          <button
            onClick={() => setShowEndConfirm(true)}
            className="text-muted hover:text-wrong transition-colors text-sm"
            disabled={isSubmitting}
          >
            End Game
          </button>
          <div className={`text-2xl font-bold ${
            timerCritical ? 'text-wrong animate-pulse shake' :
            timerUrgent ? 'text-wrong animate-pulse' : ''
          }`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xl relative">
            <span className="text-muted">Score:</span>{' '}
            <span className="text-accent font-bold">{score}</span>
            {lastPoints !== null && (
              <span className="score-float absolute -top-2 left-full ml-2 text-correct font-bold">
                +{lastPoints}
              </span>
            )}
          </div>
          {streak >= 2 && (
            <div className="text-lg text-accent">
              <span className="text-orange-400">🔥</span> {streak}
            </div>
          )}
        </div>
      </header>

      {/* End Game Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">End game early?</h3>
            <p className="text-muted text-sm">
              You still have {formatTime(timeRemaining)} remaining. Your current score is {score} points.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleEndGame}
                className="flex-1 bg-wrong text-background font-semibold py-3 px-4 rounded-lg hover:bg-wrong/90 transition-colors"
              >
                End Game
              </button>
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 bg-muted/20 text-foreground font-semibold py-3 px-4 rounded-lg hover:bg-muted/30 transition-colors"
              >
                Keep Playing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main game area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* Prompt card */}
        <div className="w-full bg-card rounded-lg p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted text-sm font-mono">
              #{currentPromptIndex + 1} / {prompts.length}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              currentPrompt.difficulty === 'easy' ? 'bg-correct/20 text-correct' :
              currentPrompt.difficulty === 'medium' ? 'bg-accent/20 text-accent' :
              'bg-wrong/20 text-wrong'
            }`}>
              {currentPrompt.difficulty}
            </span>
          </div>

          <div className="text-center">
            <span className="text-muted text-sm">Your word:</span>
            <h2 className="text-4xl font-bold text-accent font-mono mt-1">
              {currentPrompt.word.toUpperCase()}
            </h2>
          </div>

          <div className="text-center">
            <span className="text-muted text-sm">Forbidden:</span>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {/* Secret word shown first with distinct styling */}
              <span
                className={`px-3 py-1 rounded text-sm font-mono ${
                  forbiddenInDescription.includes(currentPrompt.word)
                    ? 'bg-wrong/30 text-wrong line-through'
                    : 'bg-accent/20 text-accent'
                }`}
              >
                {currentPrompt.word}
              </span>
              {currentPrompt.forbiddenWords.map((word) => (
                <span
                  key={word}
                  className={`px-3 py-1 rounded text-sm font-mono ${
                    forbiddenInDescription.includes(word)
                      ? 'bg-wrong/30 text-wrong line-through'
                      : 'bg-muted/20 text-muted'
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Input area */}
        {gameStatus === 'playing' && (
          <div className="w-full space-y-4">
            <div className="relative">
              {/* Highlight layer - only shown when forbidden words detected */}
              {forbiddenInDescription.length > 0 && (
                <div
                  className="absolute inset-0 px-4 py-4 text-lg whitespace-pre-wrap break-words pointer-events-none overflow-hidden rounded-lg text-transparent"
                  aria-hidden="true"
                >
                  {renderHighlightedText(description)}
                </div>
              )}
              {/* Actual textarea - transparent bg when showing highlights */}
              <textarea
                key={shakeKey}
                ref={inputRef}
                value={description}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const hadViolations = checkForbiddenWords(description).length > 0;
                  const hasViolations = checkForbiddenWords(newValue).length > 0;
                  // Trigger shake when new violation is detected
                  if (!hadViolations && hasViolations) {
                    setShakeKey((prev) => prev + 1);
                  }
                  setDescription(newValue);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Describe the word without using forbidden words..."
                className={`w-full border rounded-lg px-4 py-4 text-lg resize-none focus:border-accent relative z-10 ${
                  forbiddenInDescription.length > 0
                    ? 'border-wrong shake bg-transparent'
                    : 'border-muted/30 bg-card'
                }`}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {forbiddenInDescription.length > 0 && (
              <div className="text-wrong text-sm flex items-center gap-2">
                <span>Forbidden words detected:</span>
                <span className="font-mono">{forbiddenInDescription.join(', ')}</span>
              </div>
            )}

            {error && (
              <div className="bg-wrong/10 border border-wrong/30 rounded-lg px-4 py-3 text-wrong text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || forbiddenInDescription.length > 0}
                className="flex-1 bg-accent text-background font-semibold px-6 py-4 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Asking AI...' : 'Submit (Cmd/Ctrl+Enter)'}
              </button>
              <button
                onClick={handleSkip}
                disabled={isSubmitting}
                className="bg-card text-muted font-semibold px-6 py-4 rounded-lg hover:bg-card/80 hover:text-foreground transition-colors disabled:opacity-50"
              >
                Skip (Cmd/Ctrl+S)
              </button>
            </div>
          </div>
        )}

        {/* Results overlay */}
        {gameStatus === 'showing_result' && currentResult && (
          <div className="w-full space-y-4">
            <div className="bg-card rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-center">
                {currentResult.correctGuessIndex !== null ? (
                  <span className="text-correct">Correct! +{currentResult.points}</span>
                ) : (
                  <span className="text-wrong">Not quite...</span>
                )}
              </h3>

              <div className="space-y-3">
                {currentResult.guesses.map((guess, i) => {
                  const isCorrect = currentResult.correctGuessIndex === i;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? 'border-correct bg-correct/10'
                          : 'border-muted/30 bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-mono ${isCorrect ? 'text-correct' : 'text-muted'}`}>
                          {i + 1}.
                        </span>
                        <span className={`font-bold ${isCorrect ? 'text-correct' : ''}`}>
                          {guess.word}
                        </span>
                        {isCorrect && <span className="text-correct">✓</span>}
                      </div>
                      {guess.reasoning && (
                        <p className="text-muted text-sm mt-2 ml-6">{guess.reasoning}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-muted text-sm text-center">
                <span className="font-mono">Your description:</span> &ldquo;{description}&rdquo;
              </div>
            </div>

            <button
              onClick={handleNextPrompt}
              className="w-full bg-accent text-background font-semibold px-6 py-4 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Next Word (Cmd/Ctrl+Enter)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
