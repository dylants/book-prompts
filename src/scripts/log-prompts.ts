import Prompt from '@/types/Prompt';

interface PromptClass<T> {
  new (): Prompt<T>;
}

async function logPrompts() {
  const promptName = process.argv[2];
  const PromptClass: PromptClass<string> = (
    await import(`@/lib/prompts/${promptName}`)
  ).default;
  const instance = new PromptClass();

  instance.logPrompts();
}

logPrompts();
