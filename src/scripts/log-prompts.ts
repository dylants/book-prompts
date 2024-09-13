import Prompt from '@/types/Prompt';

interface PromptClass {
  new (): Prompt;
}

async function logPrompts() {
  const promptName = process.argv[2];
  const PromptClass: PromptClass = (await import(`@/lib/prompts/${promptName}`))
    .default;
  const instance = new PromptClass();

  instance.logPrompts();
}

logPrompts();
