#!/usr/bin/env node

import * as shell from 'shelljs';
import * as fs from 'fs';

export const installPackages = () => {
  const commands = [
    'npm install graphql-request',
    'npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations',
  ];

  commands.forEach((command) => {
    if (shell.exec(command).code !== 0) {
      console.error(`Error executing command: ${command}`);
      shell.exit(1);
    }
  });

  console.log('Packages installed');
};

export const createFiles = () => {
  const codegenConfig = `
overwrite: true
schema: "src/schema.graphql"
documents: "src/**/*.graphql.ts"
generates:
src/generated/graphql.ts:
  plugins:
    - "typescript"
    - "typescript-operations"`;

  fs.writeFileSync('codegen.yml', codegenConfig);

  console.log('Codegen config created');

  fs.writeFileSync('graphql.config.yml', 'schema: src/schema.graphql');
  console.log('created graphql.config.yml');

  shell.mkdir('-p', 'src');

  console.log('Created src folder');

  const queriesContent = `
import { gql } from "graphql-request";

export const exampleQuery = gql\`
  query GetBoards($ids: [ID!]) {
    boards(ids: $ids) {
      id
      name
    }
  }
\`;

export const exampleMutation = gql\`
  mutation CreateItem($boardId: ID!, $groupId: String!, $itemName: String!) {
    create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName) {
      id
      name
    }
  }
\`;
`;

  fs.writeFileSync('src/queries.graphql.ts', queriesContent);
  console.log('created src/queries.graphql.ts');

  const scriptContent = `#!/bin/bash
  curl "https://api.monday.com/v2/get_schema?format=sdl&version=stable" -o src/schema.graphql
  `.trim();

  fs.writeFileSync('fetch-schema.sh', scriptContent, { mode: 0o755 });
  console.log('Fetch schema script created');
};

export const updatePackageJsonScripts = () => {
  const packageJsonPath = './package.json';
  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json not found!');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['fetch:schema'] = 'bash fetch-schema.sh';
  packageJson.scripts['codgen'] = 'graphql-codegen';
  packageJson.scripts['fetch:generate'] = 'npm run fetch:schema && npm run codgen';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with new scripts');
};

export const setupGraphQL = () => {
  installPackages();
  createFiles();
  updatePackageJsonScripts();
  console.log('Setup complete! run `npm run fetch:generate` to fetch the schema and generate types');
};

// Check if running directly from CLI and not imported
if (require.main === module) {
  setupGraphQL();
}
