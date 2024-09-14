import aiService from '@/lib/services/ai.service';
import Prompt from '@/types/Prompt';

interface PromptClass {
  new (): Prompt;
}

async function runPrompt() {
  const promptName = process.argv[2];
  const PromptClass: PromptClass = (await import(`@/lib/prompts/${promptName}`))
    .default;
  const instance = new PromptClass();

  const response = await aiService.createMessage({
    messages: [
      { content: instance.getSystemPrompt(), role: 'system' },
      { content: instance.getUserPrompt(), role: 'user' },
    ],
    schema: instance.getSchema(),
  });

  const message = response.choices[0]?.message;
  if (message?.parsed) {
    console.log(message.parsed);
  } else if (message?.refusal) {
    console.log(message.refusal);
  }
}

runPrompt();
