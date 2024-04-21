# Monday API Setup Library

## Overview

This library automates the setup of a development environment for working with the Monday API using GraphQL. It's designed to help developers quickly start projects with pre-configured tools and settings.

## What does the script do?

The script gets the environment ready for graphql api development

- Installs the following npm packages: @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
- Adds configuration file for codegen (used to create types for queries and mutations) at the root folder - codegen.yml
- Adds configuration file for the graphql extension at the root folder - graphql.config.yml - to be used with the official graphql extensions
- Adds queries folder used to write your queries and mutations - src/queries.graphql.ts
- Adds a script to get the latest api schema - fetch-schema.sh
- Adds scripts to package.json to run with your graphql api

## How do I work now?

After everything will be set up, you should follow those steps:

1. Write your queries in the queries.graphql.ts file
2. Run 'npm run fetch:schma'
3. your types will be ready to use (as can be seen in the src/generated folder)

## Installation

Run this command on the **root** directory of your project

```bash
npx @mondaydotcomorg/setup-api 
```

## Using the newly created scripts

After installation, you will have 3 new scripts:

- "fetch:schema" - Gets the monday api schema
- "codegen" - generates types
- "fetch:generate" - runs both

for now do the following to get the schema and create your first type.

```bash
npm run fetch:generate
```

## Installing the GraphQL Extension for your IDE

### Visual Studio Code

To enhance your development experience with GraphQL, we recommend installing the GraphQL extension for Visual Studio Code. This extension provides syntax highlighting, linting, auto-complete, and more.

To install the extension, open Visual Studio Code, go to the Extensions view by clicking on the square icon on the sidebar or pressing `Ctrl+Shift+X`, and search for `GraphQL`. Find the extension by GraphQL Foundation and click `Install`.

Alternatively, you can install the extension via the command line:

```bash
code --install-extension GraphQL.vscode-graphql
```

Or you can simply go to extensions and add the official graphql extensions (GraphQL: Language Feature Support, GraphQL: Syntax Highlighting)

### JetBrains IDEs

JetBrains IDEs such as WebStorm or IntelliJ IDEA support GraphQL development through plugins. To install a GraphQL plugin, follow these steps:

1. Open your IDE and go to `Preferences` > `Plugins`.
2. Click the `Marketplace` tab and search for `GraphQL`.
3. Find the plugin provided by JetBrains and click `Install`.
4. Restart your IDE if prompted.

This plugin provides features such as syntax highlighting, documentation lookup, and schema-aware code completion.

## What You Should Know

This library simplifies the initial configuration for working with the Monday API, but you should still familiarize yourself with the [GraphQL schema](https://api.monday.com/v2/get_schema) and the [Monday API documentation](https://developer.monday.com/api-reference) to make the most out of your development experience.

We hope this library helps you kickstart your project with the Monday API more efficiently. Happy coding!

## Example usage

When using this package, you will automatically get an example query and an example mutation in your queries file.
Here is how to use them!

```typescript
const client = new ApiClient("your_api_token"); // From the monday api sdk @mondaydotcomorg/api

const queryVariables: QueryBoardsArgs = { ids: ["your_board_id"] }; // replace with your board id
const queryData = await client.query<GetBoardsQuery>(exampleQuery, queryVariables);

const mutationVariables: CreateItemMutationVariables = {
boardId: "your_board_id", // replace with your board id
groupId: "your_groyup_id", // replace with your group id
itemName: "Im using my own queries!",
};
const mutationData = await client.query<CreateItemMutation>(exampleMutation, mutationVariables);
```

## Further configuration

you can also add advanced options for you work environment, for example you can add configuration
to add react hooks out of your queries (@graphql-codegen/typescript-react-query) in two ways:

- Install the config that best suits you by adding it manually OR
- Run npm i --save-dev @graphql-codegen/cli
- Run graphql-codegen init
- Choose the config that best suits you
