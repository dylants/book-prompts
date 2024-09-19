# book-prompts

Recommends books based off reading prompts.

## Getting Started

Use [nvm](https://github.com/nvm-sh/nvm) to use the project's Node version

```
nvm use
```

_This app uses [bun](https://bun.sh/) for dependency management and script execution._

Install dependencies

```
bun install
```

## Config

Configuration for the application is available within the [`src/config/index.ts`](src/config/index.ts) file. See the config file for configuration elements exposed via environment variables.

## Scratch Data

Static data used in place of a database, stored in `src/lib/scratch-data/`

### `books.ts`

Contains a list of books to use in the `RecommendBooksPrompt`

## Scripts

### `log-prompts`

To log a `Prompt`, run the following script:

```
bun run log-prompts <prompt name>
```

For example, to log `RecommendBooksPrompt.ts`:

```
bun run log-prompts RecommendBooksPrompt
```

### `run-prompt`

To run a `Prompt`, run the following script:

```
bun run run-prompt <prompt name>
```

For example, to run `RecommendBooksPrompt.ts`:

```
bun run run-prompt RecommendBooksPrompt
```

## Tests

This project is configured to use ESLint as the linter.

To run both lint and compile TypeScript files:

```
npm run lint
```

Jest unit tests exist along side the source file. Integration tests exist in [`integration-tests`](integration-tests).

To run the tests:

```
npm test
```

To run tests in watch mode:

```
npm run test:watch
```
