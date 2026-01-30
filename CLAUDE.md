# Claude Code Context

README Game - A word-guessing game where humans describe concepts for AI to guess.

## Quick Start

```bash
npm run dev    # Start dev server on :3000
npm run build  # Production build
npm run lint   # ESLint check
```

## Architecture

### Key Files
- `src/app/page.tsx` - Landing page
- `src/app/settings/page.tsx` - API key management (add/remove keys per provider)
- `src/app/lobby/page.tsx` - Pre-game config (model selection, custom instructions)
- `src/app/play/page.tsx` - Main game loop
- `src/app/api/guess/route.ts` - AI inference endpoint
- `src/data/prompts.ts` - Word prompts (60 total)
- `src/lib/storage.ts` - LocalStorage helpers (API keys, preferences, migration)
- `src/lib/providers.ts` - Provider/model definitions and helpers
- `src/types/game.ts` - TypeScript types

### Data Flow
1. User configures API keys on /settings (stored in localStorage per provider)
2. User selects model and sets custom instructions on /lobby
3. Game starts on /play with shuffled prompts
4. User submits description → POST /api/guess
5. API calls Google/OpenAI/Anthropic → returns 3 guesses
6. Client checks if any guess matches the target word

### Navigation
```
/ (landing) → /lobby (if keys) or /settings (no keys)
/settings → manage API keys → back to previous
/lobby → configure game → /play
/play → game in progress (End Game button to finish early)
```

### Storage Schema
- `readme-game-api-keys` → `{ google?, openai?, anthropic? }` - API keys by provider
- `readme-game-preferences` → `{ lastUsedModel, customInstructions }` - User prefs
- Auto-migrates from legacy `readme-game-config` on first load

### Styling
- Tailwind CSS v4 with CSS variables
- Dark theme only (for now)
- See STYLEGUIDE.md for design tokens

## Conventions

- Use Tailwind utility classes, not custom CSS
- Keep components in page files unless reused
- API keys stored in localStorage, never logged
- Prompts have word + 5 forbidden words + difficulty

## Current State

MVP complete with:
- Taboo-style gameplay
- Multi-provider support (Google, OpenAI, Anthropic)
- Per-provider API key management
- Model selection grouped by provider
- Custom instructions (500 char limit)
- 60 prompts (20 easy, 20 medium, 20 hard)
- Score tracking, streaks, timer urgency
- End game early option with confirmation
