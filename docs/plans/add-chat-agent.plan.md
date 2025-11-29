# Add Chat Agent to My Memory

## Overview

Replace the current home page (showing `home.md` content) with a centered chat interface using Vercel AI SDK and Anthropic's Claude Haiku model. Messages will stream in real-time.

## Dependencies to Install

```bash
npm install ai @ai-sdk/anthropic @ai-sdk/react zod
```

## Files to Create/Modify

### 1. Create API Route: `app/api/chat/route.ts`

- Use `streamText` from `ai` package
- Use `anthropic('claude-haiku-4-5-20251001')` model
- Return streaming response via `toDataStreamResponse()`
- Simple system prompt for a helpful assistant

### 2. Replace Home Page: `app/page.tsx`

- Remove current markdown rendering logic
- Create a centered chat UI with:
  - Messages list at top
  - Input box centered at bottom
- Use `useChat` hook from `@ai-sdk/react` for:
  - Managing messages state
  - Handling input/submit
  - Streaming text display
- Keep the sidebar with FileExplorer intact

### 3. Environment Setup: `.env.local`

User needs to create this file with:

```
ANTHROPIC_API_KEY=your-api-key-here
```

## Architecture

```
[Client: page.tsx]          [Server: route.ts]
     |                            |
     |--- POST /api/chat -------->|
     |                            |-- streamText(anthropic)
     |<--- Streaming response ----|
     |                            |
   useChat hook renders tokens
```

## UI Design

- Keep existing sidebar with FileExplorer
- Main area becomes chat interface:
  - Messages scroll area (auto-scroll on new messages)
  - Centered input box at bottom with send button
  - Loading indicator during streaming
  - Clean, minimal design matching existing aesthetics

## Status

✅ Completed - 2024-11-29

