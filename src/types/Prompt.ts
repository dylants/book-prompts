type Prompt<Result> = {
  getSystemPrompt(): string;
  getUserPrompt(): string;
  logPrompts(): void;
  execute(): Promise<Result | string>;
};

export default Prompt;
