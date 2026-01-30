# README Game Style Guide

Design philosophy inspired by monkeytype: minimalist, focused, dark-first.

## Design Principles

1. **Focus on the action** - No distractions during gameplay
2. **Dark theme default** - Easy on the eyes, modern feel
3. **Immediate feedback** - Real-time validation, animations communicate state
4. **Monospace for data** - Scores, timers, words use monospace font

## Color Palette

| Token        | Hex       | Usage                          |
|--------------|-----------|--------------------------------|
| background   | #1e1e1e   | Page background                |
| foreground   | #d4d4d4   | Primary text                   |
| muted        | #6b6b6b   | Secondary text, borders        |
| accent       | #60a5fa   | Interactive elements, branding |
| correct      | #4ade80   | Success states                 |
| wrong        | #f87171   | Error states, urgency          |
| card         | #2d2d2d   | Card/panel backgrounds         |

## Typography

- **Sans-serif:** Geist Sans (body text, UI)
- **Monospace:** Geist Mono (scores, timers, words, code)

## Animation Guidelines

- **Transitions:** 125ms ease-out (default for all elements)
- **Shake:** 0.3s - Used for errors/violations
- **Float-up:** 0.8s - Score animations
- **Pulse:** 1s infinite - Timer urgency

## Component Patterns

### Buttons
- Primary: `bg-accent text-background` with hover opacity
- Secondary: `bg-card text-foreground`

### Cards
- Background: `bg-card`
- Border radius: `rounded-lg`
- Padding: `p-6`

### Feedback States
- Correct: Green border + green text
- Wrong: Red border + red text + shake animation
- Muted/Disabled: Reduced opacity (50%)
