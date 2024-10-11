import Prompt from '@/types/Prompt';

interface PromptClass<T> {
  new (): Prompt<T>;
}

async function runPrompt() {
  const promptName = process.argv[2];
  const PromptClass: PromptClass<string> = (
    await import(`@/lib/prompts/${promptName}`)
  ).default;
  const instance = new PromptClass();

  const response = await instance.execute();
  // eslint-disable-next-line no-console
  console.log(response);
}

runPrompt();
