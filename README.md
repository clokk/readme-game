# README Game

A word-guessing game where you describe concepts to an AI without using forbidden words. Inspired by Taboo, Codenames, and party games like Jackbox.

## How It Works

1. **Setup** - Choose your AI provider and model, enter your API key
2. **Play** - You get a word and 5 forbidden words you can't use
3. **Describe** - Write a description for the AI to guess
4. **Score** - Earn points if the AI guesses correctly (100/75/50 for 1st/2nd/3rd guess)

## Getting Started

### Prerequisites
- Node.js 18+
- An API key from one of the supported providers

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Supported AI Providers

| Provider | Models |
|----------|--------|
| **Google Gemini** | Gemini 2.0 Flash Lite, Gemini 2.0 Flash, Gemini 3 Flash, Gemini 3 Pro |
| **OpenAI** | GPT-5 Nano, GPT-5 Mini, o4-mini, GPT-5 |
| **Anthropic** | Claude 3.5 Haiku, Claude Sonnet 4, Claude 3 Haiku, Claude Opus 4.5 |

## Features

- **60 word prompts** across Easy/Medium/Hard difficulties
- **3-minute timed rounds** with urgency feedback
- **Streak tracking** for consecutive correct answers
- **Smart forbidden word detection** (catches word variants)
- **Multi-provider support** - Google, OpenAI, and Anthropic
- **Model selection** - Choose your preferred model per provider

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Google Generative AI / OpenAI / Anthropic SDKs
