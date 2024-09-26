# book-prompts

Recommends books based off reading prompts.

## Getting Started

Use [nvm](https://github.com/nvm-sh/nvm) to use the project's Node version

```
nvm use
```

_This app uses [bun](https://bun.sh/) for dependency management._

Install dependencies

```
bun install
```

## Config

Configuration for the application is available within the [`src/config/index.ts`](src/config/index.ts) file. See the config file for configuration elements exposed via environment variables.

## Database

This project utilizes [Prisma](https://www.prisma.io/) for its ORM, and expects a PostgreSQL database instance.

The database schema is stored in the [schema.prisma](prisma/schema.prisma) file.

### Setup Postgres

Install PostgreSQL and populate the `.env` file with the correct `DATABASE_URL` string to connect to PostgreSQL.

The `DATABASE_URL` should be populated as such:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/book-prompts"
```

### Run Migrations

To run migrations:

```
npm run db:migrate
```

### Create New Migration

To create a new migration (and run it):

```
npm run db:migrate --name <migration name>
```

### Seeds

Database seeds are found in the [seeds script directory](prisma/seeds/).

To run the script to generate seed data:

```
npm run db:seed
```

Reset the database, re-run migrations, and re-seed the database:

```
npm run db:reset
```

## Scripts

### `log-prompts`

To log a `Prompt`, run the following script:

```
npm run log-prompts <prompt name>
```

For example, to log `RecommendBooksPrompt.ts`:

```
npm run log-prompts RecommendBooksPrompt
```

### `run-prompt`

To run a `Prompt`, run the following script:

```
npm run run-prompt <prompt name>
```

For example, to run `RecommendBooksPrompt.ts`:

```
npm run run-prompt RecommendBooksPrompt
```

## Tests

### Lint and Type Checking

This project is configured to use ESLint as the linter.

To run both lint and compile TypeScript files:

```
npm run lint
```

### Unit and Integration Tests

Jest unit tests exist along side the source file. Integration tests exist in [`integration-tests`](integration-tests).

The integration tests (which are included in the test run) require a test database. This is setup via Docker Compose, and requires a running Docker instance.

To run the tests:

- Start Docker ([Docker Desktop](https://docs.docker.com/desktop/) is an easy option).

- Start the test database

```
npm run ci:up
```

- Migrate and seed the test database

```
npm run ci:db:reset
```

- Run the tests

```
npm test
```

To run tests in watch mode:

```
npm run test:watch
```

When tests are complete, you can shutdown the test database:

```
npm run ci:down
```

## Storybook

This app uses [Storybook](https://storybook.js.org/) to demo UI components.

To run storybook:

```
npm run storybook
```
