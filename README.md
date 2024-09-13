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

For example, to run `RecommendBooksPrompt.ts`:

```
bun run log-prompts RecommendBooksPrompt
```
