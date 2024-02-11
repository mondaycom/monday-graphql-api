
chmod +x $(npm root -g)/setup-api/dist/cjs/index.js

# Monday API Setup Library

## Overview

This library automates the setup of a development environment for working with the Monday API using GraphQL. It's designed to help developers quickly start projects with pre-configured tools and settings.

## Installation

This library is intended to be installed globally, allowing you to set up any project easily. To install, open your terminal and run:

```bash
npm install -g @mondaycom/setup-api
```

## Post-Installation Steps
After installing the library globally, you must grant execution permissions to the main script to ensure it can be executed properly. This is a critical step for Unix-like operating systems, such as Linux and macOS.

Execute the following command in your terminal:

```bash
chmod +x $(npm root -g)/@mondaycom/setup-api/dist/cjs/index.js
```

This command sets the necessary execution permissions for the library's main script, allowing it to run without encountering permission issues.

## Running the Setup
With the library installed and the appropriate permissions set, you can now run the setup process in the root directory of your project. Simply execute the following command:

```bash
setup-api-monday
```

This command will initiate the library's setup process, automatically configuring your project environment for development with the Monday API and GraphQL.

Afterwards, there will be created 3 scripts.
"fetch:schema" - Gets the monday api schema
"codgen" - generates types
"fetch:gen" - runs both

for now do the following to get the schema and create your first type!

```bash
npm run fetch:gen 
```

## What You Should Know

- The library simplifies the initial configuration for working with the Monday API, but you should still familiarize yourself with the GraphQL schema and the Monday API documentation to make the most out of your development experience.
- If you encounter permission issues or errors during the setup process, ensure that you've correctly followed the post-installation steps to set execution permissions.

We hope this library helps you kickstart your project with the Monday API more efficiently. Happy coding!
