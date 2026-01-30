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
- `src/app/setup/page.tsx` - API key configuration
- `src/app/play/page.tsx` - Main game loop
- `src/app/api/guess/route.ts` - AI inference endpoint
- `src/data/prompts.ts` - Word prompts (60 total)
- `src/lib/storage.ts` - LocalStorage helpers
- `src/types/game.ts` - TypeScript types

### Data Flow
1. User configures API key on /setup (stored in localStorage)
2. Game starts on /play with shuffled prompts
3. User submits description → POST /api/guess
4. API calls OpenAI/Anthropic → returns 3 guesses
5. Client checks if any guess matches the target word

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
- OpenAI + Anthropic support
- 60 prompts (20 easy, 20 medium, 20 hard)
- Score tracking, streaks, timer urgency
