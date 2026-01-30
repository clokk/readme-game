export interface Prompt {
  word: string;
  forbiddenWords: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Guess {
  word: string;
  reasoning: string;
}

export interface GuessResult {
  guesses: Guess[];
  correctGuessIndex: number | null; // 0, 1, 2, or null if no match
  points: number;
}

export type AIProvider = 'anthropic' | 'google' | 'openai';

export interface GameConfig {
  apiKey: string;
  customInstructions: string;
  provider: AIProvider;
  model: string;
}

export interface GameState {
  status: 'idle' | 'playing' | 'finished';
  timeRemaining: number; // in seconds
  currentPromptIndex: number;
  score: number;
  promptsCompleted: number;
  history: RoundResult[];
}

export interface RoundResult {
  prompt: Prompt;
  description: string;
  guessResult: GuessResult;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'TICK' }
  | { type: 'SUBMIT_RESULT'; result: GuessResult }
  | { type: 'NEXT_PROMPT' }
  | { type: 'END_GAME' };

export interface APIKeyStore {
  google?: string;
  openai?: string;
  anthropic?: string;
}

export interface UserPreferences {
  lastUsedModel: string;
  customInstructions: string;
}
