import { Prompt } from '@/types/game';

export const prompts: Prompt[] = [
  // EASY - Concrete nouns, common concepts (10 prompts)
  {
    word: 'Elephant',
    forbiddenWords: ['animal', 'trunk', 'big', 'gray', 'tusks'],
    difficulty: 'easy',
  },
  {
    word: 'Pizza',
    forbiddenWords: ['food', 'cheese', 'Italian', 'round', 'slice'],
    difficulty: 'easy',
  },
  {
    word: 'Guitar',
    forbiddenWords: ['music', 'instrument', 'strings', 'play', 'band'],
    difficulty: 'easy',
  },
  {
    word: 'Beach',
    forbiddenWords: ['sand', 'ocean', 'water', 'waves', 'summer'],
    difficulty: 'easy',
  },
  {
    word: 'Rainbow',
    forbiddenWords: ['colors', 'rain', 'sky', 'arc', 'spectrum'],
    difficulty: 'easy',
  },
  {
    word: 'Bicycle',
    forbiddenWords: ['wheels', 'ride', 'pedal', 'bike', 'transport'],
    difficulty: 'easy',
  },
  {
    word: 'Coffee',
    forbiddenWords: ['drink', 'caffeine', 'morning', 'beans', 'cup'],
    difficulty: 'easy',
  },
  {
    word: 'Library',
    forbiddenWords: ['books', 'read', 'quiet', 'borrow', 'shelves'],
    difficulty: 'easy',
  },
  {
    word: 'Snowman',
    forbiddenWords: ['winter', 'snow', 'cold', 'carrot', 'frozen'],
    difficulty: 'easy',
  },
  {
    word: 'Birthday',
    forbiddenWords: ['cake', 'party', 'age', 'celebrate', 'candles'],
    difficulty: 'easy',
  },
  {
    word: 'Umbrella',
    forbiddenWords: ['rain', 'wet', 'cover', 'handle', 'protection'],
    difficulty: 'easy',
  },
  {
    word: 'Telescope',
    forbiddenWords: ['stars', 'see', 'space', 'lens', 'astronomy'],
    difficulty: 'easy',
  },
  {
    word: 'Volcano',
    forbiddenWords: ['lava', 'erupt', 'mountain', 'hot', 'ash'],
    difficulty: 'easy',
  },
  {
    word: 'Penguin',
    forbiddenWords: ['bird', 'ice', 'Antarctica', 'waddle', 'tuxedo'],
    difficulty: 'easy',
  },
  {
    word: 'Keyboard',
    forbiddenWords: ['type', 'keys', 'computer', 'letters', 'buttons'],
    difficulty: 'easy',
  },
  {
    word: 'Toothbrush',
    forbiddenWords: ['teeth', 'clean', 'bristles', 'mouth', 'dental'],
    difficulty: 'easy',
  },
  {
    word: 'Hammock',
    forbiddenWords: ['swing', 'relax', 'sleep', 'hang', 'fabric'],
    difficulty: 'easy',
  },
  {
    word: 'Lighthouse',
    forbiddenWords: ['light', 'ships', 'coast', 'tower', 'beacon'],
    difficulty: 'easy',
  },
  {
    word: 'Popcorn',
    forbiddenWords: ['movies', 'kernel', 'butter', 'snack', 'pop'],
    difficulty: 'easy',
  },
  {
    word: 'Skateboard',
    forbiddenWords: ['wheels', 'ride', 'tricks', 'board', 'skate'],
    difficulty: 'easy',
  },

  // MEDIUM - Abstract concepts, actions (10 prompts)
  {
    word: 'Jealousy',
    forbiddenWords: ['envy', 'green', 'want', 'feeling', 'emotion'],
    difficulty: 'medium',
  },
  {
    word: 'Democracy',
    forbiddenWords: ['vote', 'government', 'election', 'people', 'freedom'],
    difficulty: 'medium',
  },
  {
    word: 'Procrastination',
    forbiddenWords: ['delay', 'later', 'avoid', 'postpone', 'lazy'],
    difficulty: 'medium',
  },
  {
    word: 'Gravity',
    forbiddenWords: ['fall', 'weight', 'force', 'Newton', 'pull'],
    difficulty: 'medium',
  },
  {
    word: 'Sarcasm',
    forbiddenWords: ['irony', 'joke', 'mean', 'opposite', 'tone'],
    difficulty: 'medium',
  },
  {
    word: 'Debugging',
    forbiddenWords: ['code', 'error', 'fix', 'bug', 'programming'],
    difficulty: 'medium',
  },
  {
    word: 'Nostalgia',
    forbiddenWords: ['memory', 'past', 'old', 'remember', 'longing'],
    difficulty: 'medium',
  },
  {
    word: 'Ecosystem',
    forbiddenWords: ['nature', 'environment', 'animals', 'plants', 'balance'],
    difficulty: 'medium',
  },
  {
    word: 'Encryption',
    forbiddenWords: ['code', 'secret', 'security', 'password', 'hide'],
    difficulty: 'medium',
  },
  {
    word: 'Metabolism',
    forbiddenWords: ['body', 'energy', 'food', 'burn', 'calories'],
    difficulty: 'medium',
  },
  {
    word: 'Irony',
    forbiddenWords: ['opposite', 'expect', 'sarcasm', 'meaning', 'literal'],
    difficulty: 'medium',
  },
  {
    word: 'Paradox',
    forbiddenWords: ['contradiction', 'logic', 'impossible', 'true', 'false'],
    difficulty: 'medium',
  },
  {
    word: 'Intuition',
    forbiddenWords: ['gut', 'feeling', 'instinct', 'sense', 'know'],
    difficulty: 'medium',
  },
  {
    word: 'Empathy',
    forbiddenWords: ['feel', 'understand', 'emotion', 'others', 'sympathy'],
    difficulty: 'medium',
  },
  {
    word: 'Bureaucracy',
    forbiddenWords: ['government', 'rules', 'paperwork', 'slow', 'official'],
    difficulty: 'medium',
  },
  {
    word: 'Algorithm',
    forbiddenWords: ['computer', 'steps', 'code', 'math', 'process'],
    difficulty: 'medium',
  },
  {
    word: 'Placebo',
    forbiddenWords: ['medicine', 'fake', 'effect', 'sugar', 'pill'],
    difficulty: 'medium',
  },
  {
    word: 'Photosynthesis',
    forbiddenWords: ['plant', 'sun', 'light', 'energy', 'chlorophyll'],
    difficulty: 'medium',
  },
  {
    word: 'Capitalism',
    forbiddenWords: ['money', 'market', 'profit', 'business', 'economy'],
    difficulty: 'medium',
  },
  {
    word: 'Meditation',
    forbiddenWords: ['mind', 'calm', 'breathe', 'relax', 'focus'],
    difficulty: 'medium',
  },

  // HARD - Nuanced, culturally specific (10 prompts)
  {
    word: 'Schadenfreude',
    forbiddenWords: ['German', 'pleasure', 'pain', 'happy', 'misfortune'],
    difficulty: 'hard',
  },
  {
    word: 'Liminal',
    forbiddenWords: ['space', 'threshold', 'between', 'transition', 'boundary'],
    difficulty: 'hard',
  },
  {
    word: 'Zeitgeist',
    forbiddenWords: ['spirit', 'time', 'era', 'culture', 'mood'],
    difficulty: 'hard',
  },
  {
    word: 'Serendipity',
    forbiddenWords: ['luck', 'accident', 'discover', 'chance', 'happy'],
    difficulty: 'hard',
  },
  {
    word: 'Uncanny',
    forbiddenWords: ['strange', 'familiar', 'creepy', 'weird', 'valley'],
    difficulty: 'hard',
  },
  {
    word: 'Catharsis',
    forbiddenWords: ['release', 'emotion', 'purge', 'relief', 'drama'],
    difficulty: 'hard',
  },
  {
    word: 'Ephemeral',
    forbiddenWords: ['temporary', 'brief', 'short', 'fleeting', 'lasting'],
    difficulty: 'hard',
  },
  {
    word: 'Cognitive dissonance',
    forbiddenWords: ['belief', 'conflict', 'contradiction', 'mind', 'psychology'],
    difficulty: 'hard',
  },
  {
    word: 'Simulacrum',
    forbiddenWords: ['copy', 'fake', 'real', 'image', 'representation'],
    difficulty: 'hard',
  },
  {
    word: 'Kaizen',
    forbiddenWords: ['Japanese', 'improve', 'continuous', 'better', 'progress'],
    difficulty: 'hard',
  },
  {
    word: 'Solipsism',
    forbiddenWords: ['self', 'exist', 'mind', 'real', 'philosophy'],
    difficulty: 'hard',
  },
  {
    word: 'Hegemony',
    forbiddenWords: ['power', 'dominant', 'control', 'influence', 'authority'],
    difficulty: 'hard',
  },
  {
    word: 'Qualia',
    forbiddenWords: ['experience', 'subjective', 'conscious', 'feel', 'sensation'],
    difficulty: 'hard',
  },
  {
    word: 'Sonder',
    forbiddenWords: ['people', 'lives', 'stranger', 'realize', 'complex'],
    difficulty: 'hard',
  },
  {
    word: 'Defenestration',
    forbiddenWords: ['window', 'throw', 'out', 'fall', 'building'],
    difficulty: 'hard',
  },
  {
    word: 'Petrichor',
    forbiddenWords: ['rain', 'smell', 'earth', 'wet', 'scent'],
    difficulty: 'hard',
  },
  {
    word: 'Hygge',
    forbiddenWords: ['cozy', 'Danish', 'comfort', 'warm', 'atmosphere'],
    difficulty: 'hard',
  },
  {
    word: 'Wabi-sabi',
    forbiddenWords: ['imperfect', 'beauty', 'Japanese', 'nature', 'aesthetic'],
    difficulty: 'hard',
  },
  {
    word: 'Tsundoku',
    forbiddenWords: ['books', 'unread', 'pile', 'collect', 'Japanese'],
    difficulty: 'hard',
  },
  {
    word: 'Mamihlapinatapai',
    forbiddenWords: ['look', 'eyes', 'want', 'unspoken', 'mutual'],
    difficulty: 'hard',
  },
];

export function shufflePrompts(): Prompt[] {
  const shuffled = [...prompts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
