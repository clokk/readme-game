# README Game

A word-guessing game where you describe concepts to an AI without using forbidden words. Inspired by Taboo, Codenames, and party games like Jackbox.

## How It Works

1. **Setup** - Enter your AI API key (OpenAI or Anthropic)
2. **Play** - You get a word and 5 forbidden words you can't use
3. **Describe** - Write a description for the AI to guess
4. **Score** - Earn points if the AI guesses correctly (100/75/50 for 1st/2nd/3rd guess)

## Getting Started

### Prerequisites
- Node.js 18+
- An API key from OpenAI or Anthropic

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Features

- **60 word prompts** across Easy/Medium/Hard difficulties
- **3-minute timed rounds** with urgency feedback
- **Streak tracking** for consecutive correct answers
- **Smart forbidden word detection** (catches word variants)
- **BYO AI** - Works with Claude or GPT

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- OpenAI/Anthropic APIs
