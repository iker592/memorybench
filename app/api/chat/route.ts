import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { readFileSync } from 'fs';
import { join } from 'path';

export const maxDuration = 30;

// Load system prompt from markdown file
function getSystemPrompt(): string {
  try {
    const promptPath = join(process.cwd(), 'agents', 'SystemPrompt.md');
    return readFileSync(promptPath, 'utf-8');
  } catch {
    // Fallback if file doesn't exist
    return 'You are a helpful assistant for MemoryBench - a personal knowledge base application.';
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: getSystemPrompt(),
    messages,
  });

  return result.toTextStreamResponse();
}
