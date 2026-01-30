import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { Guess, AIProvider } from '@/types/game';
import { getDefaultModel } from '@/lib/providers';

interface GuessRequest {
  description: string;
  apiKey: string;
  customInstructions: string;
  provider: AIProvider;
  model?: string;
}

interface GuessResponse {
  guesses: Guess[];
  error?: string;
}

function parseGuesses(text: string): Guess[] {
  const guesses: Guess[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    // Match patterns like "GUESS 1: Word - reasoning" or "1. Word - reasoning"
    const match = line.match(/(?:GUESS\s*)?(\d)[\.:]\s*([^-\n]+)(?:\s*[-:]\s*(.*))?/i);
    if (match) {
      const guessNum = parseInt(match[1]);
      if (guessNum >= 1 && guessNum <= 3) {
        guesses.push({
          word: match[2].trim().replace(/^["']|["']$/g, '').replace(/\*\*/g, ''),
          reasoning: match[3]?.trim() || '',
        });
      }
    }
  }

  // If we couldn't parse properly, try to extract any words that look like guesses
  if (guesses.length === 0) {
    const words = text.match(/(?:guess|answer|think|believe)[:\s]+["']?(\w+)["']?/gi);
    if (words) {
      for (const word of words.slice(0, 3)) {
        const match = word.match(/["']?(\w+)["']?$/);
        if (match) {
          guesses.push({ word: match[1], reasoning: '' });
        }
      }
    }
  }

  return guesses.slice(0, 3);
}

const SYSTEM_PROMPT_TEMPLATE = (customInstructions: string) => `You are playing a word guessing game with your human partner.

${customInstructions ? `Your partner has given you these instructions about how they communicate:\n${customInstructions}\n\n` : ''}Your partner will describe a secret word without using certain forbidden words.
Based on their description, provide your top 3 guesses for what the word is.

Rules:
- Give exactly 3 guesses, ranked by confidence
- Each guess should be a single word or short phrase
- For each guess, briefly explain your reasoning
- Format your response EXACTLY as:
GUESS 1: [word] - [brief reasoning]
GUESS 2: [word] - [brief reasoning]
GUESS 3: [word] - [brief reasoning]`;

async function getAnthropicGuesses(description: string, apiKey: string, customInstructions: string, model: string): Promise<Guess[]> {
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model,
    max_tokens: 300,
    system: SYSTEM_PROMPT_TEMPLATE(customInstructions),
    messages: [
      {
        role: 'user',
        content: `My description: "${description}"`,
      },
    ],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  return parseGuesses(responseText);
}

async function getGoogleGuesses(description: string, apiKey: string, customInstructions: string, model: string): Promise<Guess[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const genModel = genAI.getGenerativeModel({ model });

  const prompt = `${SYSTEM_PROMPT_TEMPLATE(customInstructions)}

My description: "${description}"`;

  const result = await genModel.generateContent(prompt);
  const responseText = result.response.text();
  return parseGuesses(responseText);
}

async function getOpenAIGuesses(description: string, apiKey: string, customInstructions: string, model: string): Promise<Guess[]> {
  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model,
    max_tokens: 300,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT_TEMPLATE(customInstructions),
      },
      {
        role: 'user',
        content: `My description: "${description}"`,
      },
    ],
  });

  const responseText = completion.choices[0]?.message?.content || '';
  return parseGuesses(responseText);
}

export async function POST(request: NextRequest): Promise<NextResponse<GuessResponse>> {
  try {
    const body: GuessRequest = await request.json();
    const { description, apiKey, customInstructions, provider = 'google', model } = body;

    if (!description || !apiKey) {
      return NextResponse.json(
        { guesses: [], error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const selectedModel = model || getDefaultModel(provider);
    let guesses: Guess[];

    switch (provider) {
      case 'anthropic':
        guesses = await getAnthropicGuesses(description, apiKey, customInstructions, selectedModel);
        break;
      case 'openai':
        guesses = await getOpenAIGuesses(description, apiKey, customInstructions, selectedModel);
        break;
      default:
        guesses = await getGoogleGuesses(description, apiKey, customInstructions, selectedModel);
    }

    // Ensure we always have 3 guesses
    while (guesses.length < 3) {
      guesses.push({ word: '[No guess]', reasoning: 'Could not parse response' });
    }

    return NextResponse.json({ guesses });
  } catch (error) {
    console.error('AI guess error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { guesses: [], error: `AI error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
