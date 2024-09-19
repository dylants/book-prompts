type Prompt<Result> = {
  getSystemPrompt(): Promise<string>;
  getUserPrompt(): Promise<string>;
  logPrompts(): Promise<void>;
  execute(): Promise<Result | string>;
};

export default Prompt;
