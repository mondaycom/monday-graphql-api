#!/usr/bin/env node

import * as shell from 'shelljs';
import * as fs from 'fs';

const isYarn = fs.existsSync('yarn.lock');
const GRAPHQL_REQUEST = 'graphql-request@6.1.0';
const GRAPHQL = 'graphql@16.8.2';

const installCommands = isYarn
  ? [
      `yarn add ${GRAPHQL_REQUEST} ${GRAPHQL}`,
      'yarn add -D @graphql-codegen/cli@^5.0.5 @graphql-codegen/client-preset@^4.8.0',
    ]
  : [
      `npm install ${GRAPHQL_REQUEST} ${GRAPHQL}`,
      'npm install --save-dev @graphql-codegen/cli@^5.0.5 @graphql-codegen/client-preset@^4.8.0',
    ];

export const installPackages = () => {
  installCommands.forEach((command) => {
    if (shell.exec(command).code !== 0) {
      console.error(`Error executing command: ${command}`);
      shell.exit(1);
    }
  });

  console.log('Packages installed');
};

export const createFiles = () => {
  const codegenConfig = `overwrite: true
schema: 'src/schema.graphql'
documents: 'src/**/*.graphql.ts'
ignoreNoDocuments: true
generates:
  src/generated/graphql/:
    presetConfig:
      fragmentMasking: false
    preset: client
    hooks:
      afterOneFileWrite:
        - node -e "const fs = require('fs'); fs.writeFileSync('src/generated/graphql/index.ts', '/* eslint-disable */\\nexport * from \\'./gql\\';');"`;

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
  curl "https://api.monday.com/v2/get_schema?format=sdl&version=current" -o src/schema.graphql
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
  packageJson.scripts['codegen'] = 'graphql-codegen';
  packageJson.scripts['fetch:generate'] = 'npm run fetch:schema && npm run codegen';

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
